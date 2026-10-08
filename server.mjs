import { randomUUID } from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applySeoToHtml, renderSitemap } from "./frontend/src/lib/seo.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, "frontend", "dist");
const dataDir = path.join(root, "backend", "data");
const enquiriesPath = path.join(dataDir, "enquiries.json");

const PORT = Number(process.env.PORT) || 10000;
const HOST = "0.0.0.0";

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

function loadJson(name, fallback) {
  const file = path.join(dataDir, name);
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(data),
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
  });
  res.end(data);
}

function fieldError(field, message) {
  return { loc: ["body", field], msg: `Value error, ${message}`, type: "value_error" };
}

function validateEnquiry(body) {
  const errors = [];
  const name = typeof body?.name === "string" ? body.name : "";
  if (name.trim().length < 2 || name.length > 120) {
    errors.push(fieldError("name", "Please enter your name."));
  }
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const digits = phone.replace(/\D/g, "");
  if (!/^[0-9+()\-\s]{7,20}$/.test(phone) || digits.length < 7) {
    errors.push(fieldError("phone", "Please enter a valid phone number."));
  }
  let email = body?.email;
  if (email == null || email === "") email = null;
  else if (typeof email !== "string" || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push(fieldError("email", "Please enter a valid email address."));
  } else {
    email = email.trim();
  }
  let product = body?.product_interest;
  if (product == null || product === "") product = "General enquiry";
  else product = String(product);
  if (product.length > 120) errors.push(fieldError("product_interest", "Please choose a shorter product interest."));
  const message = body?.message == null ? "" : String(body.message);
  if (message.length > 2000) errors.push(fieldError("message", "Please shorten your message."));
  return {
    errors,
    value: { name: name.trim(), phone, email, product_interest: product, message },
  };
}

let enquiryQueue = Promise.resolve();

function appendEnquiry(record) {
  const run = enquiryQueue.then(() => {
    const items = fs.existsSync(enquiriesPath) ? JSON.parse(fs.readFileSync(enquiriesPath, "utf8")) : [];
    items.push(record);
    fs.writeFileSync(enquiriesPath, JSON.stringify(items, null, 2));
  });
  enquiryQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
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
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type",
    });
    res.end();
    return;
  }
  if ((pathname === "/api" || pathname === "/api/") && req.method === "GET") {
    sendJson(res, 200, { message: "Chiransh Foods API", status: "ok" });
    return;
  }
  if (pathname === "/api/health" && req.method === "GET") {
    sendJson(res, 200, { status: "ok" });
    return;
  }
  if (pathname === "/api/products" && req.method === "GET") {
    const products = loadJson("products.json", []);
    products.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    sendJson(res, 200, products);
    return;
  }
  if (pathname.startsWith("/api/products/") && req.method === "GET") {
    const slug = decodeURIComponent(pathname.slice("/api/products/".length));
    const product = loadJson("products.json", []).find((item) => item.slug === slug);
    if (!product) sendJson(res, 404, { detail: "Product not found" });
    else sendJson(res, 200, product);
    return;
  }
  if (pathname === "/api/settings" && req.method === "GET") {
    sendJson(res, 200, loadJson("settings.json", {}));
    return;
  }
  if (pathname === "/api/enquiries" && req.method === "POST") {
    const body = await readBody(req);
    const { errors, value } = validateEnquiry(body);
    if (errors.length) {
      sendJson(res, 422, { detail: errors });
      return;
    }
    const record = { id: randomUUID(), ...value, created_at: new Date().toISOString() };
    await appendEnquiry(record);
    sendJson(res, 201, record);
    return;
  }
  sendJson(res, 404, { detail: "Not found" });
}

function seoData() {
  return {
    products: loadJson("products.json", []),
    settings: loadJson("settings.json", {}),
    faqs: loadFaq("en"),
    faqsGu: loadFaq("gu"),
  };
}

function loadFaq(lang) {
  const file = path.join(root, "frontend", "src", "locales", lang, "translation.json");
  if (!fs.existsSync(file)) return [];
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  return Array.isArray(data?.faq?.items) ? data.faq.items : [];
}

function serveStatic(res, pathname, method) {
  const relative = decodeURIComponent(pathname.split("?")[0]).replace(/^\/+/, "");
  const candidate = path.resolve(dist, relative);
  if (candidate !== dist && !candidate.startsWith(dist + path.sep)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  let file = candidate;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) file = path.join(dist, "index.html");
  const isHtml = path.basename(file) === "index.html";
  const data = isHtml
    ? Buffer.from(applySeoToHtml(fs.readFileSync(file, "utf8"), pathname, seoData()))
    : fs.readFileSync(file);
  const type = isHtml ? "text/html; charset=utf-8" : TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
  res.writeHead(200, { "content-type": type, "content-length": data.length });
  res.end(method === "HEAD" ? undefined : data);
}

if (!fs.existsSync(path.join(dist, "index.html"))) {
  console.error("frontend/dist is missing. Run yarn (or npm run build) before start.");
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname;
    if (pathname === "/api" || pathname.startsWith("/api/")) {
      await handleApi(req, res, pathname);
      return;
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405);
      res.end("Method not allowed");
      return;
    }
    if (pathname === "/sitemap.xml") {
      const body = Buffer.from(renderSitemap(loadJson("products.json", [])));
      res.writeHead(200, { "content-type": "application/xml; charset=utf-8", "content-length": body.length });
      res.end(req.method === "HEAD" ? undefined : body);
      return;
    }
    serveStatic(res, pathname, req.method);
  } catch (err) {
    const status = err.status || 500;
    sendJson(res, status, { detail: status === 500 ? "Internal server error" : err.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Chiransh Foods listening on http://${HOST}:${PORT}`);
});
