# SEO and performance plan

No ranking, traffic, or Core Web Vitals score is promised. Measurements that were not taken are marked Not Verified.

## What already works on the live site

Checked around 11:06 PM IST on 28 October 2026.

| Item | Evidence |
| --- | --- |
| Unique titles and descriptions | Homepage, `/menu`, `/contact`, `/gu`, `/faq`, `/privacy` each returned a specific `<title>` and meta description |
| Canonical URL | Present, and correctly pointed at `https://chiransh-foods.onrender.com` while that is the public host |
| hreflang | Homepage HTML contained `en`, `gu`, and `x-default` |
| Open Graph and Twitter card tags | Generated in `renderSeoTags` (`frontend/src/lib/seo.js` lines 423–449). Homepage included `og:image` pointing at `/images/og-image.jpg` on the Render origin |
| JSON-LD | Homepage included `application/ld+json`. Home is `FoodEstablishment`. Menu is an `ItemList`. Dishes are `Product`. FAQ is `FAQPage` |
| robots | Live `/robots.txt` allows `/` and disallows `/api/`. Sitemap URL is on the Render host |
| Sitemap | Live sitemap had 62 URLs and all 22 current dish slugs, with hreflang alternates |
| HTTPS | HTTP 301 to HTTPS on the Render host |
| Language URLs | English has no prefix. Gujarati is under `/gu`. That is a sound indexing structure |
| Local signals in structured data | City, region, country, phone, areas, and opening hours are added when settings contain them (`seo.js` lines 89–120 and 259–285) |
| Legal pages | Privacy, terms, and refund routes exist and privacy returned 200 |
| Image format | 54 WebP assets and one JPEG social image shipped with the site |

The visible body of the first HTML response is still the React shell. The search text for a dish is in the head tags and, after JavaScript, in the page. Google can index this pattern. It is weaker than server-rendered body text. Do not claim parity with a fully rendered HTML site.

## Gaps

| Gap | Priority | Action |
| --- | --- | --- |
| Canonical host is Render. F-03 | P0 at cutover | Change `domain.canonical_base` only when the new HTTPS host is real. Then request indexing of the new sitemap |
| Committed static sitemap is missing 6 dishes. F-09 | P1 if anyone serves it | Keep the Node generator. Do not publish `frontend/public/sitemap.xml` as the live file |
| Product schema has no price. F-08 | P2 | Add `offers` only after you agree the on-site prices may show in Google |
| No `og:locale:alternate` | P2 | Optional tag pointing at the other language URL |
| Analytics and Search Console IDs are null. F-07 | P1 | Verify Search Console by DNS TXT so the content security policy does not need a new script. Add an analytics script only in a later reviewed change |
| Google Business URL is null | P1 | Create or claim the profile for Ahmedabad, then paste the public URL into settings when you want it on the site |
| No public street address. F-17 | P2 | Publish only if the kitchen address should be public. Area served is already in the data |
| No published email. F-06 | P1 for trust, not for indexing | Optional mailbox |
| `security.txt` and the static robots file name the Render host | P0 at cutover | They follow settings when served by `server.mjs` for robots and sitemap. `security.txt` is a static file and needs a content update with the canonical change |
| Sitemap `lastmod` is fixed at `2026-10-08` unless a product has `updated_on` (`seo.js` line 464) | P2 | Bump the date when the menu actually changes. A fake daily date does not help |
| Core Web Vitals | P2 | Run PageSpeed Insights on the final domain after launch. This audit did not |
| Browser console and broken-image crawl | P2 | Not run here. Live HTML routes that were fetched returned 200 |
| Redirects from the Render URL | P0 at cutover | Keep the old host answering, then 301 to the new URL if Render allows, so existing links keep their value |

## Local SEO for Ahmedabad

The site already says Ahmedabad, Gujarat, India, lists neighbourhoods, and publishes hours in `Asia/Kolkata`. Useful next steps that are not code:

- Google Business Profile with the same name, phone, and hours.
- The same phone number everywhere. It is already consistent between settings and the contact page.
- Photographs of the real food where the gallery still describes placeholders.
- Gujarati URLs are ready. Share `/gu/...` links with Gujarati-speaking customers. Do not auto-redirect by browser language. The current explicit URLs are the right SEO choice.

Structured data must stay accurate. Do not mark delivery as available while `delivery_available` is null. Do not invent a street address in JSON-LD.

## Performance notes from the code

- Hashed `/assets/` are cached for one year.
- Images and fonts revalidate daily.
- Routes other than home are code-split.
- Fonts are self-hosted.
- Smooth scroll does not run for coarse pointers.

Not measured: LCP, INP, CLS, total bytes, and server cold-start time on Hostinger (F-15).

## Search Console setup, when the domain exists

1. Add the domain property `chiranshfoods.com`, not only a URL prefix, if you can verify by DNS.
2. Submit `https://chiranshfoods.com/sitemap.xml` after F-03 is deployed.
3. Inspect `/`, `/menu`, `/gu`, and one dish URL.
4. Watch coverage for the old Render host and the new host together for several weeks.
5. Do not request removal of the old host until the new host is indexed and redirects work.

## Performance and SEO items that are not defects

- The lack of a web app manifest. Optional P3.
- The lack of a cart. F-18. Do not add fake product offers for checkout.
- Reviews are disabled in settings and the home page says they are coming later. Do not add review stars in structured data until the reviews are real.
