"""Crawl every internal link reachable from "/", plus exercise interactive UI
(mobile nav, menu tabs, FAQ accordion, gallery lightbox, contact form).

usage: python scripts/crawl.py <base_url> [--mobile]
Reports: pages that render the NotFound view, console errors, HTTP >= 400,
failed requests, broken <img>, unloaded fonts, broken #hash targets, and the
external links found (wa.me / social / tel:), which are listed but not followed.
"""
import json, sys, time
from urllib.parse import urlparse, urljoin
from playwright.sync_api import sync_playwright

base = sys.argv[1].rstrip("/")
host = urlparse(base).netloc
problems, external, seen = [], set(), set()
queue = ["/"]
IGNORE = ("__emergent_overlay__", "ap.emergent.sh", "cloudflareinsights", "/cdn-cgi/")

def watch(page, where):
    page.on("console", lambda m: m.type == "error" and problems.append((where(), "console", m.text)))
    page.on("pageerror", lambda e: problems.append((where(), "pageerror", str(e))))
    page.on("response", lambda r: r.status >= 400 and not any(s in r.url for s in IGNORE) and problems.append((where(), f"http {r.status}", r.url)))
    page.on("requestfailed", lambda q: not any(s in q.url for s in IGNORE) and problems.append((where(), "failed", q.url)))

def settle(page):
    page.wait_for_load_state("networkidle")
    for _ in range(30):
        page.mouse.wheel(0, 700); time.sleep(0.08)
    time.sleep(0.6)

with sync_playwright() as p:
    b = p.chromium.launch()
    vp = {"width": 390, "height": 844} if "--mobile" in sys.argv else {"width": 1440, "height": 900}
    page = b.new_context(viewport=vp).new_page()
    cur = {"r": "/"}
    watch(page, lambda: cur["r"])
    while queue:
        r = queue.pop(0)
        if r in seen: continue
        seen.add(r); cur["r"] = r
        page.goto(base + r, wait_until="networkidle")
        settle(page)
        title = page.title()
        if "not found" in title.lower() and r != "/__probe404":
            problems.append((r, "renders NotFound", title))
        # ignore lazy images inside display:none wrappers (e.g. "hidden sm:block" on mobile) — they never load by design
        bad = page.evaluate("Array.from(document.images).filter(i=>i.getClientRects().length>0).filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.currentSrc||i.src)")
        for s in bad: problems.append((r, "broken img", s))
        ow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
        if ow > 1: problems.append((r, "horizontal overflow px", ow))
        fonts = page.evaluate("Array.from(document.fonts).filter(f=>f.status==='error').map(f=>f.family+' '+f.weight)")
        for f in fonts: problems.append((r, "font error", f))
        links = page.evaluate("Array.from(document.querySelectorAll('a[href]')).map(a=>[a.getAttribute('href'), (a.innerText||a.getAttribute('aria-label')||'').trim().slice(0,40)])")
        for href, text in links:
            if not href or href == "#":
                problems.append((r, "empty link", text)); continue
            if href.startswith("#"):
                if not page.evaluate("h=>!!document.getElementById(h)", href[1:]):
                    problems.append((r, "dangling #hash", href))
                continue
            u = urlparse(urljoin(base + r, href))
            if u.scheme in ("http", "https") and u.netloc == host:
                path = u.path.rstrip("/") or "/"
                if path not in seen: queue.append(path)
                if u.fragment:
                    external.add(f"(internal w/ hash) {href}")
            else:
                external.add(f"{href}  [{text}]")
    # interactive checks
    def check(name, fn):
        cur["r"] = "interactive:" + name
        try: fn()
        except Exception as e: problems.append((cur["r"], "interaction failed", str(e)[:200]))
    def menu_tabs():
        page.goto(base + "/menu", wait_until="networkidle")
        tabs = page.locator("[data-testid^=menu-tab], [role=tab]")
        n = tabs.count()
        if n == 0: raise Exception("no menu tabs found")
        for i in range(n): tabs.nth(i).click(); time.sleep(0.3)
    def faq():
        page.goto(base + "/faq", wait_until="networkidle")
        btns = page.locator("[data-testid=faq-section] button")
        for i in range(btns.count()): btns.nth(i).click(); time.sleep(0.15)
    def gallery():
        page.goto(base + "/gallery", wait_until="networkidle")
        page.click("[data-testid=gallery-item-0]"); time.sleep(0.5)
        page.keyboard.press("ArrowRight"); page.keyboard.press("ArrowLeft"); time.sleep(0.3)
        page.keyboard.press("Escape"); time.sleep(0.4)
    def mobile_nav():
        page.set_viewport_size({"width": 390, "height": 844})
        page.goto(base + "/", wait_until="networkidle")
        page.click("[data-testid=nav-mobile-toggle]"); time.sleep(0.5)
        page.click("[data-testid=nav-mobile-gallery-link]"); time.sleep(0.6)
        if not page.url.endswith("/gallery"): raise Exception("mobile nav did not navigate: " + page.url)
        page.set_viewport_size(vp)
    def contact_validation():
        page.goto(base + "/contact", wait_until="networkidle")
        page.locator("form button[type=submit]").click(); time.sleep(0.4)
    def bad_slug():
        page.goto(base + "/menu/no-such-dish", wait_until="networkidle"); time.sleep(0.5)
        if "not found" not in page.content().lower(): raise Exception("unknown dish slug doesn't show a not-found state")
    def contact_submit():
        if "--submit" not in sys.argv: return
        page.goto(base + "/contact", wait_until="networkidle")
        page.fill("[data-testid=contact-name-input], input[name=name]", "Crawler Test")
        page.fill("[data-testid=contact-phone-input], input[name=phone]", "+91 98765 43210")
        page.locator("form button[type=submit]").click()
        page.wait_for_selector("text=Thank you", timeout=8000)
    for n, f in [("contact-submit", contact_submit), ("menu-tabs", menu_tabs), ("faq", faq), ("gallery-lightbox", gallery), ("mobile-nav", mobile_nav), ("contact-validation", contact_validation), ("bad-slug", bad_slug)]:
        check(n, f)
    b.close()

# /menu/no-such-dish legitimately 404s the product API
problems = [x for x in problems if not (x[0] == "interactive:bad-slug" and ("http 404" in x[1] or "404" in x[2]))]
print("PAGES CRAWLED:", len(seen)); print("\n".join(sorted(seen)))
print("\nEXTERNAL / non-http LINKS:"); print("\n".join(sorted(external)))
print("\nPROBLEMS:", len(problems))
for x in problems: print(" ", x)
