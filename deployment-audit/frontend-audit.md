# Frontend audit

Method: source review of `frontend/src`, plus live HTML fetched on 28 October 2026 around 11:05–11:06 PM IST. A visual pass in a phone, tablet, and desktop browser was **Not Verified**. No console-error session was captured. Findings below are either from source, from the live HTML, or marked Not Verified.

## Pages that exist

Each route exists in English and again under `/gu` (`frontend/src/App.jsx` lines 25–67, `frontend/src/lib/seo.js` lines 8–11).

| Path | Role |
| --- | --- |
| `/` and `/gu` | Home |
| `/menu` | Category menu and search |
| `/menu/:slug` | Dish, quantity, add-ons, WhatsApp and enquiry links |
| `/about` | Story and values |
| `/gallery` | Image gallery and lightbox |
| `/contact` | Phone, WhatsApp, hours, areas, enquiry form |
| `/faq` | Accordion |
| `/privacy`, `/terms`, `/refund` | Legal copy from the translation files |
| Unknown path | 404 page. The Node server also sends HTTP 404 |

The header links home, menu, about, gallery, and contact. The footer adds FAQ and the legal pages.

Live HTML titles and canonical URLs on 28 October 2026:

| URL | Result |
| --- | --- |
| `/` | 200. Title “Chiransh Foods \| Authentic Gujarati Vegetarian Food in Ahmedabad”. Canonical is the Render origin. JSON-LD present. Three hreflang links |
| `/menu` | 200. Menu title and Ahmedabad description |
| `/contact` | 200. “Contact & Order”. Description names pickup hours and the public phone number |
| `/gu` | 200. Gujarati title and description. Canonical `https://chiransh-foods.onrender.com/gu` |
| `/faq` | 200. FAQ title |
| `/privacy` | 200. Privacy title. Description mentions the enquiry form |
| `http://` the homepage | 301 to HTTPS |

The first homepage fetch in this session timed out once. The retry returned 200. That single timeout is not treated as an outage.

## Ordering flows that exist

Confirmed in source and settings:

- Phone links (`tel:`) and WhatsApp links (`wa.me`).
- One enquiry form on the contact page. It POSTs JSON to `/api/enquiries` with name, phone, optional email, product interest, message, and two honeypot fields.
- A dish page can prefill the contact form with a product, quantity, and add-ons through the query string.

Not implemented: cart, checkout, card payment, customer accounts, Zomato, Swiggy. `ordering.mode` is `contact`. Finding F-18.

## Language

English is the unprefixed URL. Gujarati is `/gu` plus the same path. The language control keeps the path and the query string. `documentElement.lang` is updated from the route. Production HTML is rewritten so the first response already has `lang="gu"` on Gujarati URLs (`seo.js` `applySeoToHtml`). hreflang `en`, `gu`, and `x-default` are injected. `og:locale` is `en_IN` or `gu_IN`. `og:locale:alternate` was not found. That is a small social-preview gap, not a broken language switch.

## Forms

The contact form uses visible labels, `aria-invalid`, and `role="alert"` for errors (`frontend/src/pages/Contact.jsx`). Shared rules in `frontend/src/lib/enquiry.js` require a name of at least 2 characters, a plausible phone number, an optional email, a product string up to 120 characters, and a message up to 2000 characters. Honeypot fields `website` and `company` reject the post without naming the trap.

Success and failure toasts depend on the API response and the React Query / sonner UI. This audit did not submit a real enquiry to the live site, because that would store a personal-data record on production. End-to-end form behaviour on the live host is **Not Verified** in this session. The code path and the automated tests exist; the tests were not re-run.

The product `<select>` stores the English product name as the value while the label can be Gujarati. The saved `product_interest` can therefore be English even on `/gu/contact`. Low, P2. Confirm with one Gujarati submission when you next test.

## Layout, media, and accessibility

Implemented and visible in source:

- Viewport meta and `viewport-fit=cover` in `frontend/index.html`.
- Skip link to `#main-content` (`App.jsx` lines 49–54).
- Lazy-loaded routes except the home page.
- Responsive WebP `srcSet` at 480 and 768 where `frontend/src/lib/images.js` defines them.
- Lazy images except priority hero and product images.
- Self-hosted fonts with `font-display` handling in the font CSS. 21 WOFF2 files are in `frontend/public/fonts`.
- `prefers-reduced-motion` support in CSS and in the smooth-scroll component.
- Touch-sized controls using `min-h-11` in several components.

Source issues, browser confirmation **Not Verified** (F-16):

| Finding | Severity | Evidence | Recommendation | Validation |
| --- | --- | --- | --- | --- |
| Reveal animation props `delay` and `y` are ignored | Low | `frontend/src/components/Reveal.jsx` accepts children and className. Callers pass `delay` and `y` | Implement the props or stop passing them | Visual check that stagger is intentional |
| Content can stay invisible if JavaScript never runs the observer | Low | Reveal starts at opacity 0. `index.html` noscript only says JavaScript is required | Acceptable for this app. Keep reduced-motion override | Disable JS in one browser and record what remains |
| Menu tabs do not follow a full tab pattern | Low | One tab panel is labelled by a single tab id in `Menu.jsx` | Give the visible panel the selected tab’s id | Keyboard test on `/menu` |
| One story image has no responsive sources or declared size | Low | Plain `img` in the home story block | Use the shared image component with width and height | Layout-shift check in a browser. Not measured here |
| Mobile navigation dialog has a weaker name than the gallery lightbox | Low | Navbar dialog versus gallery `aria-label` | Add an accessible name | VoiceOver or TalkBack spot check |
| Language link uses `aria-current="page"` | Info | `Navbar.jsx` language links | Prefer `aria-current="true"` or a language label | Screen-reader spot check |
| Settings `ready` flag stays false | Info | `SettingsContext.jsx` default. No UI depends on it in a way that was found to block render | Remove or set it when settings load | Unit test or ignore |
| Map is a placeholder | Info | Contact page. `maps_url` is null. F-17 | Add a map only with a public address | Owner decision |
| Gallery copy says some images are styled or placeholder | Info | `Gallery.jsx` lede | Replace when final photography exists | Content review |

Contrast, focus rings, and font sizes were not measured with a colour analyser or a device. Do not treat this document as a WCAG certificate.

## Performance evidence and limits

- Live HTML documents were small (about 2.8 KB to 6.4 KB for the pages sampled) because the body is an application shell. The visible menu text is not in that first HTML. Search engines that execute JavaScript, and the tags injected into `<head>`, are what carry the SEO text. Finding noted in the SEO plan.
- Hashed assets are cached for a year by `server.mjs`. Images and fonts for one day, must-revalidate.
- Vendor chunks are split in `vite.config.js`.
- Lenis smooth scroll is limited to fine pointers in `SmoothScroll.jsx`.
- Core Web Vitals, Lighthouse, and total JavaScript weight were **Not Verified**. No score is claimed.

## Broken links and console

Live fetches of the main routes above returned 200. A full crawl of every dish URL and every image was **Not Verified**. The live sitemap listed 22 dish slugs, matching `products.json`. Console errors and failed XHR in a browser were **Not Verified**.

## Brand and contact consistency

Public facts in `backend/data/settings.json`, also returned by the live `/api/settings` response size (1,539 bytes) on the same evening:

- Business: Chiransh Foods, Ahmedabad, Gujarat, India.
- Phone and WhatsApp are set. The number is already public on the contact page.
- Email is null. F-06.
- Hours: daily 10:00 to 23:00, Asia/Kolkata.
- Service areas are listed. Street address is not public. F-17.
- An FSSAI licence number is published in settings and in the footer badge component.
- Social links: Instagram, Facebook, and YouTube profile URLs. Google Business is null. F-07.
