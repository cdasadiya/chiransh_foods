import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateEnquiry } from "./frontend/src/lib/enquiry.js";
import { applySeoToHtml, isKnownPath, renderRobots, renderSitemap } from "./frontend/src/lib/seo.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, "frontend", "dist");
const dataDir = path.join(root, "backend", "data");
const enquiriesPath = path.join(dataDir, "enquiries.json");

const PORT = Number(process.env.PORT) || 10000;
const HOST = "0.0.0.0";
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const ENQUIRY_QUEUE_MAX = 32;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".ico": "image/x-icon",
};

const jsonCache = new Map();
const rateHits = new Map();
let enquiryQueue = Promise.resolve();
let enquiryDepth = 0;

function loadJson(name, fallback) {
  const file = path.join(dataDir, name);
  if (!fs.existsSync(file)) return fallback;
  const stat = fs.statSync(file);
  const cached = jsonCache.get(name);
  if (cached && cached.mtimeMs === stat.mtimeMs) return cached.data;
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  jsonCache.set(name, { mtimeMs: stat.mtimeMs, data });
  return data;
}

function loadFaq(lang) {
  const key = `faq:${lang}`;
  const file = path.join(root, "frontend", "src", "locales", lang, "translation.json");
  if (!fs.existsSync(file)) return [];
  const stat = fs.statSync(file);
  const cached = jsonCache.get(key);
  if (cached && cached.mtimeMs === stat.mtimeMs) return cached.data;
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const items = Array.isArray(data?.faq?.items) ? data.faq.items : [];
  jsonCache.set(key, { mtimeMs: stat.mtimeMs, data: items });
  return items;
}

function seoData() {
  return {
    products: loadJson("products.json", []),
    settings: loadJson("settings.json", {}),
    faqs: loadFaq("en"),
    faqsGu: loadFaq("gu"),
    faqsHi: loadFaq("hi"),
  };
}

function etagFor(body) {
  return `"${createHash("sha1").update(body).digest("base64url")}"`;
}

function isFresh(req, tag) {
  const header = req.headers["if-none-match"];
  if (!header || !tag) return false;
  return header.split(",").some((part) => part.trim() === tag || part.trim() === `W/${tag}`);
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function securityHeaders(nonce) {
  const script = nonce ? `script-src 'self' 'nonce-${nonce}'` : "script-src 'self'";
  return {
    "content-security-policy": [
      "default-src 'self'",
      script,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "x-frame-options": "DENY",
    "cross-origin-opener-policy": "same-origin",
    "cross-origin-resource-policy": "same-site",
    "strict-transport-security": "max-age=15552000",
  };
}

function sendBuffer(req, res, status, body, { type, cacheControl, nonce }) {
  const tag = etagFor(body);
  const headers = {
    ...securityHeaders(nonce),
    "content-type": type,
    "cache-control": cacheControl,
    etag: tag,
  };
  if (status === 200 && isFresh(req, tag)) {
    res.writeHead(304, headers);
    res.end();
    return;
  }
  headers["content-length"] = body.length;
  res.writeHead(status, headers);
  res.end(req.method === "HEAD" ? undefined : body);
}

function sendJson(req, res, status, payload, cacheControl = "no-store") {
  sendBuffer(req, res, status, Buffer.from(JSON.stringify(payload)), {
    type: "application/json; charset=utf-8",
    cacheControl,
  });
}

function allowRate(ip) {
  const now = Date.now();
  const bucket = (rateHits.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);
  if (bucket.length >= RATE_MAX) {
    rateHits.set(ip, bucket);
    return false;
  }
  bucket.push(now);
  rateHits.set(ip, bucket);
  if (rateHits.size > 5000) {
    for (const [key, times] of rateHits) {
      if (!times.some((time) => now - time < RATE_WINDOW_MS)) rateHits.delete(key);
    }
  }
  return true;
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function appendEnquiry(record) {
  if (enquiryDepth >= ENQUIRY_QUEUE_MAX) {
    return Promise.reject(Object.assign(new Error("Too many enquiries"), { status: 429 }));
  }
  enquiryDepth += 1;
  const run = enquiryQueue.then(() => {
    const items = fs.existsSync(enquiriesPath) ? JSON.parse(fs.readFileSync(enquiriesPath, "utf8")) : [];
    const list = Array.isArray(items) ? items : [];
    list.push(record);
    fs.writeFileSync(enquiriesPath, JSON.stringify(list, null, 2));
    console.log(JSON.stringify({ event: "enquiry", id: record.id, at: record.created_at, product: record.product_interest }));
  });
  enquiryQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run.finally(() => {
    enquiryDepth = Math.max(0, enquiryDepth - 1);
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 1_000_000) {
        reject(Object.assign(new Error("payload too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(Object.assign(new Error("invalid json"), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

async function handleApi(req, res, pathname) {
  const method = req.method;
  if (method === "OPTIONS") {
    res.writeHead(204, { ...securityHeaders(), "cache-control": "no-store" });
    res.end();
    return;
  }
  const read = method === "GET" || method === "HEAD";
  if ((pathname === "/api" || pathname === "/api/") && read) {
    sendJson(req, res, 200, { message: "Chiransh Foods API", status: "ok" }, "no-store");
    return;
  }
  if (pathname === "/api/health" && read) {
    sendJson(req, res, 200, { status: "ok" }, "no-store");
    return;
  }
  if (pathname === "/api/products" && read) {
    const products = [...loadJson("products.json", [])];
    products.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    sendJson(req, res, 200, products, "public, max-age=60, must-revalidate");
    return;
  }
  if (pathname.startsWith("/api/products/") && read) {
    const slug = decodeURIComponent(pathname.slice("/api/products/".length));
    const product = loadJson("products.json", []).find((item) => item.slug === slug);
    if (!product) sendJson(req, res, 404, { detail: "Product not found" }, "no-store");
    else sendJson(req, res, 200, product, "public, max-age=60, must-revalidate");
    return;
  }
  if (pathname === "/api/settings" && read) {
    sendJson(req, res, 200, loadJson("settings.json", {}), "public, max-age=60, must-revalidate");
    return;
  }
  if (pathname === "/api/enquiries" && method === "POST") {
    const contentType = String(req.headers["content-type"] || "");
    if (!contentType.toLowerCase().includes("application/json")) {
      sendJson(req, res, 415, { detail: "Expected application/json" });
      return;
    }
    if (!sameOrigin(req)) {
      sendJson(req, res, 403, { detail: "Cross-origin submissions are not accepted" });
      return;
    }
    if (!allowRate(clientIp(req))) {
      sendJson(req, res, 429, { detail: "Too many enquiries. Please try again later." });
      return;
    }
    const body = await readBody(req);
    const { errors, value } = validateEnquiry(body);
    if (errors.length) {
      sendJson(req, res, 422, { detail: errors });
      return;
    }
    const record = { id: randomUUID(), ...value, created_at: new Date().toISOString() };
    await appendEnquiry(record);
    sendJson(req, res, 201, record, "no-store");
    return;
  }
  sendJson(req, res, 404, { detail: "Not found" }, "no-store");
}

function cacheForFile(pathname, file) {
  if (pathname.startsWith("/assets/")) return "public, max-age=31536000, immutable";
  const ext = path.extname(file).toLowerCase();
  if ([".webp", ".jpg", ".jpeg", ".png", ".svg", ".woff2", ".ico"].includes(ext)) {
    return "public, max-age=86400, must-revalidate";
  }
  if (ext === ".css" || ext === ".js") return "public, max-age=86400, must-revalidate";
  return "no-cache";
}

function serveStatic(req, res, pathname) {
  const relative = decodeURIComponent(pathname.split("?")[0]).replace(/^\/+/, "");
  const candidate = path.resolve(dist, relative);
  if (candidate !== dist && !candidate.startsWith(dist + path.sep)) {
    res.writeHead(403, { ...securityHeaders(), "cache-control": "no-store", "content-type": "text/plain; charset=utf-8" });
    res.end(req.method === "HEAD" ? undefined : "Forbidden");
    return;
  }
  let file = candidate;
  let exists = fs.existsSync(file) && fs.statSync(file).isFile();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, "index.html");
    exists = fs.existsSync(file) && fs.statSync(file).isFile();
  }
  const data = seoData();
  const known = isKnownPath(pathname, data.products);
  if (!exists) {
    file = path.join(dist, "index.html");
    if (!fs.existsSync(file)) {
      sendJson(req, res, 404, { detail: "Not found" });
      return;
    }
  }
  const isHtml = path.basename(file) === "index.html";
  const status = isHtml && !known ? 404 : 200;
  if (isHtml) {
    const nonce = randomUUID().replace(/-/g, "");
    const html = Buffer.from(applySeoToHtml(fs.readFileSync(file, "utf8"), pathname, data, { nonce }));
    sendBuffer(req, res, status, html, {
      type: "text/html; charset=utf-8",
      cacheControl: status === 404 ? "no-store" : "no-cache",
      nonce,
    });
    return;
  }
  sendBuffer(req, res, 200, fs.readFileSync(file), {
    type: TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
    cacheControl: cacheForFile(pathname, file),
  });
}

export function createServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
      const pathname = url.pathname;
      if (pathname === "/api" || pathname.startsWith("/api/")) {
        await handleApi(req, res, pathname);
        return;
      }
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405, { ...securityHeaders(), "cache-control": "no-store", "content-type": "text/plain; charset=utf-8" });
        res.end(req.method === "HEAD" ? undefined : "Method not allowed");
        return;
      }
      if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
        const settings = loadJson("settings.json", {});
        const body = Buffer.from(
          pathname === "/robots.txt"
            ? renderRobots(settings)
            : renderSitemap(loadJson("products.json", []), undefined, settings),
        );
        const type = pathname === "/robots.txt" ? "text/plain; charset=utf-8" : "application/xml; charset=utf-8";
        sendBuffer(req, res, 200, body, { type, cacheControl: "public, max-age=3600, must-revalidate" });
        return;
      }
      serveStatic(req, res, pathname);
    } catch (err) {
      const status = err.status || 500;
      sendJson(req, res, status, { detail: status === 500 ? "Internal server error" : err.message });
    }
  });
  server.requestTimeout = 15_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;
  server.timeout = 20_000;
  return server;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  if (!fs.existsSync(path.join(dist, "index.html"))) {
    console.error("frontend/dist is missing. Run yarn (or npm run build) before start.");
    process.exit(1);
  }
  const server = createServer();
  server.listen(PORT, HOST, () => {
    console.log(`Chiransh Foods listening on http://${HOST}:${PORT}`);
  });
}
