/**
 * @vitest-environment node
 */
import fs from "node:fs";
import path from "node:path";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createServer } from "../../server.mjs";

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
});
