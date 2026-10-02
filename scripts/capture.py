"""Render every route with headless Chromium, record console errors / failed or
external requests, and save full-page screenshots.

usage: python scripts/capture.py <base_url> <out_dir> [--strict-local]
"""
import json, sys, time
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROUTES = ["/", "/menu", "/menu/baroda-style-sev-usal", "/menu/tuvar-totha", "/about",
          "/gallery", "/contact", "/faq", "/privacy", "/terms", "/refund", "/does-not-exist"]

base, out = sys.argv[1].rstrip("/"), sys.argv[2]
strict = "--strict-local" in sys.argv
host = urlparse(base).hostname
report = {}

def slug(r):
    return "home" if r == "/" else r.strip("/").replace("/", "_")

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    for r in ROUTES:
        page = ctx.new_page()
        info = {"console_errors": [], "failed": [], "http_errors": [], "external": [], "requests": []}
        page.on("console", lambda m, i=info: m.type == "error" and i["console_errors"].append(m.text))
        page.on("pageerror", lambda e, i=info: i["console_errors"].append("pageerror: " + str(e)))
        page.on("requestfailed", lambda q, i=info: i["failed"].append(f"{q.url} {q.failure}"))
        def on_resp(resp, i=info):
            i["requests"].append(f"{resp.status} {resp.url}")
            if resp.status >= 400:
                i["http_errors"].append(f"{resp.status} {resp.url}")
        page.on("response", on_resp)
        page.on("request", lambda q, i=info: urlparse(q.url).hostname not in (host, None) and not q.url.startswith("data:") and i["external"].append(q.url))
        page.goto(base + r, wait_until="networkidle", timeout=60000)
        # scroll through so whileInView reveals + lazy images fire
        h = page.evaluate("document.documentElement.scrollHeight")
        y = 0
        while y < h:
            page.mouse.wheel(0, 600); y += 600; time.sleep(0.25)
            h = page.evaluate("document.documentElement.scrollHeight")
        time.sleep(1.2)
        page.evaluate("window.scrollTo(0,0)"); time.sleep(1.0)
        page.wait_for_load_state("networkidle")
        broken = page.evaluate("""Array.from(document.images).filter(i=>i.complete && i.naturalWidth===0).map(i=>i.src)""")
        info["broken_images"] = broken
        info["title"] = page.title()
        page.screenshot(path=f"{out}/{slug(r)}.png", full_page=True)
        if r == "/gallery":
            try:
                page.click("[data-testid=gallery-item-0]"); time.sleep(0.8)
                page.screenshot(path=f"{out}/gallery_lightbox.png")
                page.keyboard.press("Escape")
            except Exception as e:
                info["console_errors"].append(f"lightbox: {e}")
        info.pop("requests") if strict else None
        report[r] = info
        page.close()
    b.close()

json.dump(report, open(f"{out}/report.json", "w"), indent=2)
for r, i in report.items():
    print(r, "| title:", i["title"], "| console:", len(i["console_errors"]), "| http>=400:", len(i["http_errors"]),
          "| failed:", len(i["failed"]), "| broken img:", len(i["broken_images"]), "| external:", len(i["external"]))
