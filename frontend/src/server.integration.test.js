/**
 * @vitest-environment node
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createServer, resetRateLimits } from "../../server.mjs";
import { readEnquiries } from "./lib/enquiryStore.js";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist/index.html");

async function withServer(run) {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();
  try {
    await run(port);
  } finally {
    server.close();
    await once(server, "close");
  }
}

async function withEnquiryEnv(key, run) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "chiransh-enquiries-"));
  const file = path.join(dir, "enquiries.json");
  const previousPath = process.env.ENQUIRIES_PATH;
  const previousKey = process.env.ENQUIRY_STORAGE_KEY;
  process.env.ENQUIRIES_PATH = file;
  if (key) process.env.ENQUIRY_STORAGE_KEY = key;
  else delete process.env.ENQUIRY_STORAGE_KEY;
  resetRateLimits();
  try {
    await withServer(async (port) => {
      await run({ port, file, origin: `http://127.0.0.1:${port}` });
    });
  } finally {
    if (previousPath === undefined) delete process.env.ENQUIRIES_PATH;
    else process.env.ENQUIRIES_PATH = previousPath;
    if (previousKey === undefined) delete process.env.ENQUIRY_STORAGE_KEY;
    else process.env.ENQUIRY_STORAGE_KEY = previousKey;
    fs.rmSync(dir, { recursive: true, force: true });
    resetRateLimits();
  }
}

function enquiryBody(extra = {}) {
  return JSON.stringify({
    name: "Asha Patel",
    phone: "9106354619",
    email: "asha@example.com",
    message: "One plate",
    consent: true,
    locale: "gu",
    ...extra,
  });
}

describe("production server", () => {
  it("serves hardened html, 404s, and enquiry limits", async () => {
    expect(fs.existsSync(dist), "run the frontend build before this test").toBe(true);
    await withServer(async (port) => {
      const origin = `http://127.0.0.1:${port}`;
      const home = await fetch(`${origin}/gu`);
      const html = await home.text();
      expect(home.status).toBe(200);
      expect(home.headers.get("content-security-policy")).toContain("default-src 'self'");
      expect(home.headers.get("x-content-type-options")).toBe("nosniff");
      expect(home.headers.get("cache-control")).toBe("no-cache");
      expect(html).toContain('lang="gu"');
      expect(html).toContain('hreflang="en"');
      expect(html).not.toContain('hreflang="hi"');

      const hindi = await fetch(`${origin}/hi`);
      expect(hindi.status).toBe(404);

      const missing = await fetch(`${origin}/this-route-should-404`);
      expect(missing.status).toBe(404);
      expect(missing.headers.get("cache-control")).toBe("no-store");

      const menu = await fetch(`${origin}/gu/menu`);
      expect(menu.status).toBe(200);

      const asset = [...html.matchAll(/\/assets\/[^"]+\.js/g)].map((match) => match[0])[0];
      expect(asset).toBeTruthy();
      const script = await fetch(`${origin}${asset}`);
      expect(script.headers.get("cache-control")).toContain("immutable");

      const products = await fetch(`${origin}/api/products`);
      const tag = products.headers.get("etag");
      const again = await fetch(`${origin}/api/products`, { headers: { "if-none-match": tag } });
      expect(again.status).toBe(304);

      const cross = await fetch(`${origin}/api/enquiries`, {
        method: "POST",
        headers: { "content-type": "application/json", origin: "https://evil.example" },
        body: JSON.stringify({ name: "Asha Patel", phone: "9106354619" }),
      });
      expect(cross.status).toBe(403);

      const honeypot = await fetch(`${origin}/api/enquiries`, {
        method: "POST",
        headers: { "content-type": "application/json", origin },
        body: JSON.stringify({ name: "Asha Patel", phone: "9106354619", company: "spam" }),
      });
      expect(honeypot.status).toBe(422);
      expect(honeypot.headers.get("cache-control")).toBe("no-store");
    });
  });

  it("rejects an enquiry unless consent is strictly true", async () => {
    await withEnquiryEnv(undefined, async ({ origin, file }) => {
      const response = await fetch(`${origin}/api/enquiries`, {
        method: "POST",
        headers: { "content-type": "application/json", origin },
        body: enquiryBody({ consent: "true" }),
      });
      expect(response.status).toBe(422);
      expect(fs.existsSync(file)).toBe(false);
    });
  });

  it("stores consent metadata, keeps older enquiries, and encrypts when a key is set", async () => {
    await withEnquiryEnv("test-key", async ({ origin, file }) => {
      const day = 24 * 60 * 60 * 1000;
      fs.writeFileSync(
        file,
        JSON.stringify([
          { id: "old", name: "Old Person", phone: "9000000001", created_at: new Date(Date.now() - 91 * day).toISOString() },
          { id: "recent", name: "Recent Person", phone: "9000000002", created_at: new Date(Date.now() - 10 * day).toISOString() },
        ]),
      );
      const response = await fetch(`${origin}/api/enquiries`, {
        method: "POST",
        headers: { "content-type": "application/json", origin },
        body: enquiryBody(),
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body.policy_version).toBe("2026-10-11");
      expect(body.locale).toBe("gu");
      expect(body.consent).toBe(true);
      expect(body.consent_at).toEqual(body.created_at);
      expect(body.email).toBe("asha@example.com");
      const raw = fs.readFileSync(file, "utf8");
      expect(raw).not.toContain("Asha");
      expect(raw).not.toContain("asha@example.com");
      expect(raw).not.toContain("Old Person");
      expect(JSON.parse(raw).alg).toBe("aes-256-gcm");
      const stored = readEnquiries(file);
      expect(stored.map((item) => item.name).sort()).toEqual(["Asha Patel", "Old Person", "Recent Person"]);
      expect(stored.find((item) => item.name === "Asha Patel").policy_version).toBe("2026-10-11");
    });
  });

  it("does not replace an encrypted enquiry file when the key is missing", async () => {
    await withEnquiryEnv("test-key", async ({ origin, file }) => {
      const first = await fetch(`${origin}/api/enquiries`, {
        method: "POST",
        headers: { "content-type": "application/json", origin },
        body: enquiryBody(),
      });
      expect(first.status).toBe(201);
      const encrypted = fs.readFileSync(file, "utf8");
      delete process.env.ENQUIRY_STORAGE_KEY;
      const second = await fetch(`${origin}/api/enquiries`, {
        method: "POST",
        headers: { "content-type": "application/json", origin },
        body: enquiryBody({ name: "Second Person", phone: "9000000099" }),
      });
      expect(second.status).toBe(500);
      expect(fs.readFileSync(file, "utf8")).toBe(encrypted);
      expect(encrypted).not.toContain("Asha");
    });
  });
});
