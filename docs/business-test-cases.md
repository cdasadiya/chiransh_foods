# Chiransh Foods business test cases

Guest-facing use cases for the Chiransh Foods website and the API behind it. The site is a bilingual (English and Gujarati) vegetarian street-food menu. A guest browses dishes, builds an order message, and places it by WhatsApp, phone, or the contact form. There is no cart, account, checkout, or payment.

This catalog is the test script. It does not add automated tests. Run it against a local copy of this repository. Do not run it against the live Render site unless a person responsible for that site has approved a production smoke.

## How to run

| Environment | What it proves | How to start |
| --- | --- | --- |
| Local site | Pages, language, menu, and the enquiry form through the Vite proxy | From the repository root, `./run.sh`. Site at `http://localhost:3000`. FastAPI at `http://127.0.0.1:8001`. |
| Production-like server | The Node server that Render runs: built pages, SEO, HTTP status, and `/api` | `yarn` (or `npm install`) from the root, then `yarn start`. Default port `10000`, or `PORT` if set. |
| API only | Enquiry validation and stored records without the browser | `cd backend` and run uvicorn on port `8001`, or call the production-like server's `/api`. |

English pages use the normal path (`/menu`). Gujarati pages use the same path under `/gu` (`/gu/menu`). There is no `/en` prefix and no Hindi locale.

Published facts live in [backend/data/settings.json](../backend/data/settings.json) and [backend/data/products.json](../backend/data/products.json). The contact form appends to `backend/data/enquiries.json`, which is gitignored. Inspect that file when a case says the enquiry is stored. The privacy page tells guests those records can be cleared when the server restarts.

## Actors

- **Guest.** Browses the menu and places a normal order.
- **Party planner.** Books a family pack or a bulk dish for 5 to 200 persons.
- **Jain or Swaminarayan guest.** Needs the separate no-onion, no-garlic recipe.
- **Operator.** Reads `enquiries.json`. There is no admin screen.

## Coverage

Each case is marked against the tests already in the repo:

- **covered.** An existing test asserts the business result.
- **partial.** A test covers part of the case. The note says what is still manual.
- **gap.** No automated test asserts this result.

## Reference data

### Contact and ordering

- Phone display `+91 91063 54619`, tel link `tel:+919106354619`.
- WhatsApp `https://wa.me/919106354619`. A general order uses the text `Hello Chiransh Foods, I would like to place an order.`
- Email is empty. The contact card shows “To be announced” for email.
- City line: Ahmedabad, Gujarat, India.
- Pickup areas: New Ranip, Ranip, Nirnay Nagar, Chandlodiya, Chandkheda, Vandemataram, New Vadaj, Jagat Pur, Godrej Garden City, Charodi.
- Pickup is by phone call. No street address is published. The map card says location details are coming soon.
- Hours: every day 10:00 AM – 11:00 PM IST, because `opens` is `10:00` and `closes` is `23:00`.
- FSSAI licence `20726038003778`.
- Ordering mode is `contact`. Zomato, Swiggy, and an online checkout URL are empty, and the site has no buttons for them.
- Social links: `https://instagram.com/chiranshfoods`, `https://facebook.com/chiranshfoods`, `https://youtube.com/@chiranshfoods`.
- Canonical host: `https://chiransh-foods.onrender.com`.

### Menu

`GET /api/products` returns 22 dishes, sorted by `sort_order`. Every published dish is vegetarian and `available`. Prices use English digits, including on Gujarati pages (`₹ 100`, never Gujarati numerals).

| Category | Dishes and prices |
| --- | --- |
| Sev Usal (Regular) | Baroda-Style Sev Usal ₹100, Sev Usal with Pav ₹100, Sev Usal Take-Home Pack ₹100 |
| Tuvar Totha (Regular) | Tuvar Totha ₹120, Tuvar Totha with Pav ₹140 |
| Combos (Regular) | Sev Usal and Tuvar Totha Combo Plate ₹220 |
| Jain & Swaminarayan | Jain Sev Usal ₹120, Jain Tuvar Totha ₹140, Swaminarayan Sev Usal ₹120, Swaminarayan Tuvar Totha ₹140 |
| Family & Party Packs (Regular) | Sev Usal Family and Party Pack, Tuvar Totha Family and Party Pack. Both prices are null. |
| Family & Bulk Orders | Bhaji Pav ₹120, Khada Pav Bhaji ₹130, Masala Pav ₹60, Pulav ₹100, Kutchi Dabeli ₹30, Ragda Pattice ₹75. Badge: Advance order. |
| Extras (Regular) | Pav (2 pcs) ₹20, Butter Pav (2 pcs) price null |
| Beverages | Masala Chaas ₹20, Packaged Drinking Water ₹20 |

Optional add-ons exist only on `baroda-style-sev-usal` and `tuvar-totha`: Extra sev ₹15 and Extra garlic red chutney ₹15. Quantity on a dish page runs from 1 to 99. A total is shown only when the dish has a unit price. Total = (unit price + selected add-on prices) × quantity.

The menu page always shows one “Advance orders only” block (5 to 200 persons, call or WhatsApp the published number, Jain and Swaminarayan on request, FSSAI). A dish page shows that block for family packs and bulk dishes, and shows a serving note for every other category.

### Enquiry rules

The browser checks the form before it calls the API. The API checks again.

| Field | Browser | API |
| --- | --- | --- |
| Name | Required, at least 2 characters after trim. The box stops at 80 characters. | Required, 2 to 120 characters after trim. |
| Phone | Required. Pattern `[0-9+()\-\s]{7,20}` and at least 7 digits. Box stops at 20 characters. | Same rule. |
| Email | Optional. If filled, it must look like an email. | Optional. If filled, it must look like an email and be at most 200 characters. Blank is stored as null. |
| Product interest | Defaults to “General enquiry”. The select stores the English dish name. | Defaults to “General enquiry”, at most 120 characters. |
| Message | Optional, box stops at 2000 characters. | Optional, at most 2000 characters. |
| `website`, `company` | Hidden honeypot fields. Guests do not see or fill them. | Any non-empty value is rejected. Those fields are not stored. |

A valid create returns **201** with `id`, the stored fields, and `created_at`. It does not send email.

Servers differ on a few errors. Say which server you are hitting.

| Situation | FastAPI (local `server.py`) | Node (`server.mjs`, production) |
| --- | --- | --- |
| Field validation | **422**, FastAPI `detail` list | **422**, `detail` array of `{ loc, msg, type }` |
| Honeypot | **422**, `detail` string `Unable to accept this enquiry.` | **422**, `detail` array whose message is `Unable to accept this enquiry.` |
| Sixth enquiry from the same IP inside 10 minutes | **429** `Too many enquiries. Please try again later.` | Same **429**. IP is the first `X-Forwarded-For` hop. |
| Cross-origin POST | Allowed (`allow_origins: *`) | **403** when `Origin` is present and its host is not the request host |
| Content-Type other than JSON | FastAPI’s own parse error | **415** |
| Body larger than 1 MB, or invalid JSON | FastAPI’s own parse error | **413** or **400** |
| More than 32 enquiry writes waiting | Not limited | **429** |

---

## P0. A guest can order the right dish

### TC-HOME-01. Home page leads to the menu and the two signature dishes

- **Actor:** Guest
- **Priority:** P0
- **Language:** English
- **Preconditions:** Local site is running. Settings include the published WhatsApp number.

**Steps**

1. Open `/`.
2. Read the hero. Confirm the vegetarian badge and the three-line headline.
3. Activate “Explore Menu”.
4. Return home. Activate the WhatsApp button in the hero.
5. On a viewport at least `sm` wide, activate the floating Tuvar Totha card on the hero photo.
6. In “Our Signatures”, open the Sev Usal card and then the Tuvar Totha card.
7. Confirm each card shows a rupee price in English digits.

**Expected result**

- Explore Menu goes to `/menu`.
- The hero WhatsApp link opens `https://wa.me/919106354619` with the general order text, in a new tab (`noopener noreferrer`).
- The floating card goes to `/menu/tuvar-totha`.
- The signature cards go to `/menu/baroda-style-sev-usal` and `/menu/tuvar-totha`, show Signature, and show `₹ 100` and `₹ 120`.
- The story block links to `/about`.

**Coverage:** gap. No home-page test.

### TC-HOME-02. The same home journey in Gujarati

- **Actor:** Guest
- **Priority:** P0
- **Language:** Gujarati
- **Preconditions:** TC-HOME-01 is understood. Published settings are loaded.

**Steps**

1. Open `/gu`.
2. Confirm `document.documentElement.lang` is `gu` and the hero copy is Gujarati.
3. Activate Explore Menu (the Gujarati label).
4. Return to `/gu` and open both signature cards.

**Expected result**

- Explore Menu goes to `/gu/menu`.
- Signature cards go to `/gu/menu/baroda-style-sev-usal` and `/gu/menu/tuvar-totha`.
- The primary name on each card is the Gujarati name. The other name is still shown as the secondary line.
- Prices stay `₹ 100` and `₹ 120` with English digits.
- The hero WhatsApp link still uses `wa.me/919106354619`.

**Coverage:** gap.

### TC-HOME-03. Menu preview separates live food, bulk orders, and a future category

- **Actor:** Guest
- **Priority:** P0
- **Language:** English, then Gujarati
- **Preconditions:** Home is loaded.

**Steps**

1. On `/`, open the three cards in the menu preview.
2. Open “View full menu”.
3. Repeat the bulk card from `/gu`.
4. Read the closing order band, including the reviews line.

**Expected result**

- Gujarati street food and the dashed “coming soon” Indian card both go to `/menu` (or `/gu/menu`). The Indian card is visibly marked soon and is still a link.
- The family and bulk card goes to `/menu?category=Family%20%26%20Bulk%20Orders` (Gujarati: the same query under `/gu`).
- “View Full Menu” goes to `/menu`.
- The order band offers WhatsApp (`wa.me/919106354619`), Call to Order (`tel:+919106354619`), and Contact to Order (`/contact`).
- The band says customer reviews are coming soon. There is no review list and no star rating.

**Coverage:** gap for the home preview. The bulk query itself is covered for the menu page by `frontend/src/pages/Menu.test.jsx`.

### TC-MENU-01. The menu lists every published dish in category order

- **Actor:** Guest
- **Priority:** P0
- **Language:** English
- **Preconditions:** `GET /api/products` succeeds.

**Steps**

1. Open `/menu`.
2. Read the category tabs and the count on each tab.
3. Leave the search box empty and read the grid from first card to last.
4. Open three cards: a priced regular dish, a bulk dish, and an unpriced family pack.

**Expected result**

- Tabs are All (22), then the eight categories with counts 3, 2, 1, 4, 2, 6, 2, 2, matching the reference table.
- One “Advance orders only” block is visible above the grid, including “5 to 200 persons” and a phone link to `tel:+919106354619`.
- Cards follow `sort_order`. The first card is Baroda-Style Sev Usal at `₹ 100`. Family packs and Butter Pav say “Contact for current price”.
- Each card links to `/menu/{slug}`.
- Every dish shows a vegetarian mark. Signature, Jain, Swaminarayan, and Advance order badges match the data file.

**Coverage:** partial. `frontend/src/lib/catalog.test.js` checks that the offline list matches `products.json` (slugs, names, categories, prices, bulk badges). The menu UI test checks the bulk tab, not the full 22-card order.

### TC-MENU-02. Category tabs filter the grid, and an unknown category shows everything

- **Actor:** Guest
- **Priority:** P0
- **Language:** English
- **Preconditions:** Menu is loaded.

**Steps**

1. Select “Jain & Swaminarayan”.
2. Select “Family & Bulk Orders”.
3. Select “All”.
4. Open `/menu?category=Family%20%26%20Bulk%20Orders` directly.
5. Open `/menu?category=not-a-real-category`.
6. Switch to Gujarati from the bulk URL.

**Expected result**

- Jain shows the four Jain and Swaminarayan dishes and the note that those recipes have no onion, no garlic, and no root vegetables. Sev Usal cards are absent.
- Bulk shows the six advance-order dishes and the note that booking is for 5 to 200 persons by call or WhatsApp. The tab is selected. The address keeps `category=Family%20%26%20Bulk%20Orders`.
- All clears the `category` parameter and shows 22 dishes.
- An unknown `category` value selects All and shows 22 dishes.
- From the bulk URL, Gujarati is `/gu/menu?category=Family%20%26%20Bulk%20Orders`, the bulk tab stays selected, and the instruction heading is Gujarati (`ફક્ત અગાઉથી ઓર્ડર`, quantity `૫ થી ૨૦૦ વ્યક્તિઓ`).

**Coverage:** partial. Bulk query, one instruction block, and Gujarati instruction copy are covered in `frontend/src/pages/Menu.test.jsx`. Language-switch URL preservation is covered in `frontend/src/lib/locale.test.js`. The unknown-category fallback and the Jain note are gap.

### TC-MENU-03. Search matches English and Gujarati names inside the selected category

- **Actor:** Guest
- **Priority:** P0
- **Language:** Both
- **Preconditions:** Menu is on All.

**Steps**

1. Search `bhaji`.
2. Clear the box and search `ભાજી પાવ`.
3. With that Gujarati query still in the box, select “Beverages”.
4. Clear the search and type `zzzz-not-a-dish`.
5. On the Beverages tab, search `pav` and confirm Masala Pav does not appear.

**Expected result**

- `bhaji` shows Bhaji Pav and Khada Pav Bhaji.
- `ભાજી પાવ` shows Bhaji Pav only. Pulav is absent. Search uses both language names and descriptions.
- A category and a query apply together. Beverages plus the Gujarati Bhaji Pav query shows the empty-search message, because that dish is not a beverage.
- `zzzz-not-a-dish` shows the no-match empty state, not an error banner.
- Search does not cross categories. Masala Pav stays under Family & Bulk Orders.

**Coverage:** partial. Gujarati search for Bhaji Pav on All is covered in `frontend/src/pages/Menu.test.jsx`. English search, the empty state, and category-plus-search are gap.

### TC-DISH-01. A guest builds a Sev Usal order and sends it to WhatsApp or the enquiry form

- **Actor:** Guest
- **Priority:** P0
- **Language:** English
- **Preconditions:** Settings include the published WhatsApp number. Open `/menu/baroda-style-sev-usal`.

**Steps**

1. Read the breadcrumb, name, Gujarati secondary name, badge, availability, price, and category.
2. Confirm both add-ons and the starting quantity.
3. Select Extra sev. Increase quantity once.
4. Read the total and open the WhatsApp link’s destination text (do not send the WhatsApp message).
5. Activate “Send an enquiry” and stop on the contact form.
6. Return to the dish. Select both add-ons and set quantity to 2. Read the total.
7. Decrease quantity until it stops. Increase until it stops, using the keyboard or by holding the control only as far as the buttons allow. The buttons are the limit.

**Expected result**

- Breadcrumb is Home / Menu / Baroda-Style Sev Usal. Badge is Signature. Availability is “Available now”. Price is `₹ 100`. Category is Sev Usal (Regular). A vegetarian mark is shown.
- Ingredients and serving use the “on request” copy, because this dish has no ingredient list and no serving text. The advance-order block is absent on this regular dish.
- Add-ons are Extra sev `₹ 15` and Extra garlic red chutney `₹ 15`. Quantity starts at 1.
- After Extra sev and quantity 2, the total is `₹ 230`. The WhatsApp URL is `https://wa.me/919106354619` and the text is:

  ```text
  Hello Chiransh Foods, I would like to order:
  Baroda-Style Sev Usal — ₹ 100
  Extra sev — ₹ 15
  Quantity: 2
  Total: ₹ 230
  ```

- Enquiry goes to `/contact?product=baroda-style-sev-usal&qty=2&addons=extra-sev`.
- Both add-ons at quantity 2 total `₹ 260`.
- Quantity never goes below 1 or above 99. There is no “currently unavailable” sentence.

**Coverage:** partial. Price, one add-on, quantity 2, total `₹ 230`, WhatsApp text, and the enquiry URL are covered in `frontend/src/pages/ProductDetail.test.jsx`. The 1–99 stops, both add-ons together on the dish page, breadcrumb, and availability badge are gap. Both add-ons at quantity 2 are covered on the contact form in `frontend/src/pages/Contact.test.jsx` (total `₹ 260`).

### TC-DISH-02. Add-ons are offered only on the two signature dishes

- **Actor:** Guest
- **Priority:** P0
- **Language:** English
- **Preconditions:** Menu data is the published file.

**Steps**

1. Open `/menu/tuvar-totha`.
2. Open `/menu/jain-sev-usal`, `/menu/sev-usal-tuvar-totha-combo-plate`, `/menu/bhaji-pav`, and `/menu/masala-chaas`.

**Expected result**

- Tuvar Totha costs `₹ 120` and offers the same two ₹15 add-ons.
- Jain Sev Usal, the combo, Bhaji Pav, and Masala Chaas have no add-on group.
- Their enquiry links carry `product` and `qty` and do not carry `addons`.

**Coverage:** covered for Tuvar Totha, Jain Sev Usal, and Bhaji Pav in `frontend/src/pages/ProductDetail.test.jsx`, and for the add-on map in `frontend/src/lib/catalog.test.js`. Combo and Masala Chaas are the same rule and are gap in the UI test.

### TC-DISH-03. Unpriced dishes ask the guest to enquire and do not invent a total

- **Actor:** Party planner
- **Priority:** P0
- **Language:** English
- **Preconditions:** Open each unpriced slug.

**Steps**

1. Open `/menu/sev-usal-family-party-pack`.
2. Open `/menu/tuvar-totha-family-party-pack`.
3. Open `/menu/butter-pav-2-pcs`.
4. On each page, read the price, look for a total, and read the WhatsApp text.

**Expected result**

- The price line is “Contact for current price”.
- There is no total line.
- The WhatsApp text names the dish, uses “Contact for current price” as the price, includes `Quantity: 1`, and has no `Total:` line.
- Family packs show the advance-order block. Butter Pav shows the serving note instead, because it is an Extra.

**Coverage:** partial. `catalog.test.js` asserts the three prices are null. `ProductDetail.test.jsx` asserts the family-pack instruction block and the English heading. The contact-for-price line, the missing total, and Butter Pav are gap.

### TC-DISH-04. Bulk dishes and family packs explain advance booking

- **Actor:** Party planner
- **Priority:** P0
- **Language:** English and Gujarati
- **Preconditions:** Published menu.

**Steps**

1. Open each bulk dish: `bhaji-pav`, `khada-pav-bhaji`, `masala-pav`, `pulav`, `kutchi-dabeli`, `ragda-pattice`.
2. Open `/gu/menu/kutchi-dabeli`.
3. Open a regular dish, `/menu/pav-2-pcs`, and compare the lower section.

**Expected result**

- Each bulk page shows the Advance order badge, “Available now”, the reference price, and one advance-order block: “Advance orders only”, “5 to 200 persons”, call or WhatsApp `+91 91063 54619`, the quality points (100% vegetarian, fresh groundnut oil, hygiene, Jain and Swaminarayan on request, FSSAI), and licence `20726038003778`.
- The serving block is absent on those pages.
- `/gu/menu/kutchi-dabeli` uses the Gujarati name `કચ્છી દાબેલી` as the heading, shows “Kutchi Dabeli” as the secondary name, and uses the Gujarati instruction heading. The price stays `₹ 30` in English digits.
- Pav (2 pcs) shows `₹ 20` and the serving note, and does not show the advance-order block.

**Coverage:** partial. Bhaji Pav versus regular Sev Usal, the family pack, and the Gujarati Kutchi Dabeli heading are covered in `frontend/src/pages/ProductDetail.test.jsx`. The other bulk slugs and the FSSAI line on the dish page are gap. The licence itself is covered on the footer in `frontend/src/components/FssaiBadge.test.jsx`.

### TC-DISH-05. Jain and Swaminarayan dishes state the separate recipe

- **Actor:** Jain or Swaminarayan guest
- **Priority:** P0
- **Language:** English
- **Preconditions:** Published menu.

**Steps**

1. From the menu, select “Jain & Swaminarayan” and open all four dishes.
2. Read the badge, description, price, and whether add-ons or pav are part of the offer.
3. Open the FAQ item “How can I place an order?”.

**Expected result**

- Jain Sev Usal and Jain Tuvar Totha use the Jain badge and say no onion, no garlic, and no root vegetables. Prices are `₹ 120` and `₹ 140`. Descriptions say they are served without pav.
- Swaminarayan Sev Usal and Swaminarayan Tuvar Totha use the Swaminarayan badge and say no onion and no garlic. Prices are `₹ 120` and `₹ 140`. Descriptions say they are served without pav.
- None of the four offer the garlic-chutney add-on.
- The category note and the advance-order quality list both say Jain and Swaminarayan food is available on request. The FAQ order answer says the same and points guests to WhatsApp, phone, and the contact form.

**Coverage:** partial. Jain Sev Usal heading, price `₹ 120`, and the absent add-on group are covered in `frontend/src/pages/ProductDetail.test.jsx`. Badge text, the dietary sentences, and the FAQ wording are gap.

### TC-DISH-06. A Gujarati dish page keeps money in English digits

- **Actor:** Guest
- **Priority:** P0
- **Language:** Gujarati
- **Preconditions:** Open `/gu/menu/baroda-style-sev-usal`.

**Steps**

1. Read the heading, the secondary name, and the price.
2. Leave quantity at 1 and read the WhatsApp text and the enquiry link.
3. Confirm the price element is marked `lang="en"`.

**Expected result**

- Heading is `બરોડા સ્ટાઇલ સેવ ઉસળ`. Secondary name is the English dish name.
- Price and total use `₹ 100`. The WhatsApp text contains `બરોડા સ્ટાઇલ સેવ ઉસળ — ₹ 100`, `સંખ્યા: 1`, and `કુલ: ₹ 100`, and contains no Gujarati digits.
- Enquiry goes to `/gu/contact?product=baroda-style-sev-usal&qty=1`.

**Coverage:** covered in `frontend/src/pages/ProductDetail.test.jsx`.

### TC-404-01. An unknown dish or page offers a way back to food

- **Actor:** Guest
- **Priority:** P0
- **Language:** English and Gujarati
- **Preconditions:** For the HTTP status, use the production-like server. For the in-app page, either server is fine.

**Steps**

1. Open `/menu/not-a-real-dish` on the local site.
2. Open `/gu/menu/not-a-real-dish`.
3. Open `/this-route-should-404` and `/hi`.
4. On the recovery page, follow “Return to Menu” and “Back to Home”.
5. Repeat steps 3 and 4 against the production-like server and record the HTTP status.

**Expected result**

- An unknown slug renders the in-app recovery page: “Looks like this plate is empty.”, a link to the menu, and a link home. On `/gu/...` those links stay under `/gu` (`/gu/menu` and `/gu`).
- The production-like server responds **404** for `/this-route-should-404` and for `/hi`. `/gu` and `/gu/menu` respond **200**. The recovery page is still the site shell, so the guest can navigate.
- A known dish URL responds **200**.

**Coverage:** partial. Recovery heading and the English menu link are covered in `frontend/src/pages/NotFound.test.jsx`. Production **404** for `/hi` and an unknown path, and **200** for `/gu/menu`, are covered in `frontend/src/server.integration.test.js`. The unknown-slug screen and the Gujarati recovery links are gap. `frontend/src/lib/seo.test.js` covers `isKnownPath` for a missing dish.

---

## P0. Enquiry and contact facts

### TC-ENQ-01. The form blocks an incomplete enquiry before it is sent

- **Actor:** Guest
- **Priority:** P0
- **Language:** English
- **Preconditions:** Open `/contact`. Watch network calls to `POST /api/enquiries`.

**Steps**

1. Submit the empty form.
2. Enter name `A` and phone `123`, leave email blank, and submit.
3. Enter name `Asha Patel`, phone `abcdefg`, and submit.
4. Enter name `Asha Patel`, phone `+91 91063 54619`, email `not-an-email`, and submit.
5. Correct the email to `asha@example.com` but do not submit yet.

**Expected result**

- Step 1 shows “Please enter your name.” and the phone error. No POST is sent.
- Step 2 still shows the name error and “Please enter a valid phone number.” No POST.
- Step 3 shows the phone error because letters are not allowed. No POST.
- Step 4 shows “Please enter a valid email address.” No POST. A blank email would be allowed.
- The form remains on screen. The success panel is absent.

**Coverage:** partial. The empty-name message is covered in `frontend/src/pages/Contact.test.jsx`. Phone and email messages on the form are gap. The same phone, email, and message rules are covered for the shared validator in `frontend/src/lib/enquiry.test.js` and for the FastAPI API in `backend/test_server.py`.

### TC-ENQ-02. A valid enquiry is stored and the guest is thanked

- **Actor:** Guest, then Operator
- **Priority:** P0
- **Language:** English
- **Preconditions:** Local API is running. Note the current contents of `backend/data/enquiries.json` so the new row can be found. Rate limit for this IP is not already full.

**Steps**

1. On `/contact`, enter name `Asha Patel`, phone `9876543210`, email `asha@example.com`, leave product interest on “General enquiry”, and message `Need Sev Usal for Saturday.`
2. Submit.
3. Open `backend/data/enquiries.json` and find the new record.
4. Activate “Send another enquiry”.
5. Repeat the POST directly against FastAPI and against the production-like server with the same body, using a same-origin `Origin` on Node.

**Expected result**

- The button shows a sending state, then the success panel “Enquiry received!” and the success toast. The form fields are cleared.
- The API responds **201**. The stored record has a UUID `id`, the trimmed name and phone, the email, `product_interest` `General enquiry`, the message, and an ISO `created_at`. It has no `website` and no `company`.
- “Send another enquiry” shows the empty form again.
- The Node response matches that contract. FastAPI prints a one-line JSON log with `event` `enquiry` and the new id. No email is sent.

**Coverage:** partial. FastAPI **201** and the echoed name are covered in `backend/test_server.py`. The shared validator’s happy path is covered in `frontend/src/lib/enquiry.test.js`. The success panel, the file contents, and a Node **201** are gap.

### TC-ENQ-03. A hidden honeypot or an oversized message is rejected

- **Actor:** Guest (or a script filling the honeypot)
- **Priority:** P0
- **Language:** Either
- **Preconditions:** API is reachable. Use a fresh IP or restart the API so the rate limit is clear.

**Steps**

1. POST a valid name and phone with `website` set to `https://spam.example`.
2. POST a valid name and phone with `company` set to `spam` and `website` empty.
3. POST name `Asha Patel`, phone `9876543210`, and a message of 2001 characters.
4. POST name `  ` (spaces only) and a valid phone.
5. On the production-like server, repeat step 2 with `Origin` set to the site’s own origin, and watch the toast if you drive it through the form by filling the hidden fields in devtools.

**Expected result**

- Steps 1 and 2 return **422** and add nothing to `enquiries.json`.
- FastAPI’s honeypot `detail` is the string `Unable to accept this enquiry.` Node’s `detail` is an array with that message. The browser toast shows that sentence when `detail` is an array. When `detail` is a string, the toast is the generic “Something went wrong while sending your enquiry.”
- The oversized message and the blank name return **422** and are not stored.
- A normal guest never sees the honeypot inputs (they are off-screen, `tabIndex` -1).

**Coverage:** partial. FastAPI rejects `website` in `backend/test_server.py`. Node rejects `company` in `frontend/src/server.integration.test.js`. The validator rejects a honeypot and an oversized message in `frontend/src/lib/enquiry.test.js`. The `company` field on FastAPI, the toast wording, and “nothing was stored” are gap.

### TC-ENQ-04. A dish page prefills the enquiry, and illegal add-ons are dropped

- **Actor:** Guest
- **Priority:** P0
- **Language:** English and Gujarati
- **Preconditions:** Published menu and settings.

**Steps**

1. Open `/contact?product=baroda-style-sev-usal&qty=2&addons=extra-sev,extra-garlic-red-chutney`.
2. Read the product select and the message. Leave name and phone empty.
3. Open `/gu/contact?product=tuvar-totha&qty=1&addons=extra-garlic-red-chutney,not-allowed`.
4. Open `/contact?product=baroda-style-sev-usal&qty=0&addons=extra-sev`, then the same URL with `qty=500`.
5. Open `/contact?product=not-a-real-dish&qty=2`.
6. On a prefilled form, change the message, then switch language.

**Expected result**

- Step 1 selects the option whose value is `Baroda-Style Sev Usal`. The message is:

  ```text
  Hello Chiransh Foods, I would like to order:
  Baroda-Style Sev Usal — ₹ 100
  Extra sev — ₹ 15
  Extra garlic red chutney — ₹ 15
  Quantity: 2
  Total: ₹ 260
  ```

  Name and phone stay empty. Digits are English.
- Step 3 selects value `Tuvar Totha`. The message uses `તુવેર ટોઠા — ₹ 120`, the Gujarati garlic-chutney line, `સંખ્યા: 1`, and `કુલ: ₹ 135`. The unknown add-on `not-allowed` is omitted, so the extra-sev line is absent.
- `qty=0` is treated as 1. `qty=500` is treated as 99. The message quantity follows that clamp.
- An unknown `product` leaves the select on “General enquiry” and leaves the message empty.
- After the guest edits the message, a language switch does not replace that edited text.

**Coverage:** partial. Steps 1 and 3 are covered in `frontend/src/pages/Contact.test.jsx`. Quantity clamp, unknown product, and the edited-message guard are gap.

### TC-ENQ-05. The API slows repeat enquiries and rejects unsafe production requests

- **Actor:** Guest
- **Priority:** P0
- **Language:** Either
- **Preconditions:** Restart the API, or call `reset` by using a new process, so the in-memory rate bucket is empty. Production checks need `server.mjs`.

**Steps**

1. POST five valid enquiries in a row from one IP. Use distinct messages so the rows are easy to see.
2. POST a sixth valid enquiry from that IP immediately.
3. On `server.mjs` only, POST a valid JSON body with `Origin: https://evil.example`.
4. On `server.mjs` only, POST with `Content-Type: text/plain`, then with a body larger than 1 MB, then with `{` as the body.
5. Wait 10 minutes, or restart the process, and POST one more valid enquiry.

**Expected result**

- The first five return **201** and are stored.
- The sixth returns **429** with `detail` `Too many enquiries. Please try again later.` and is not stored.
- Cross-origin returns **403** `Cross-origin submissions are not accepted`.
- Wrong content type returns **415**. An oversized body returns **413**. Invalid JSON returns **400**.
- After the window (or a process restart) a valid enquiry returns **201** again.
- FastAPI does not implement steps 3 and 4. Its CORS middleware allows other origins. Do not expect **403**, **415**, **413**, or **400** from FastAPI for those cases.

**Coverage:** partial. Node **403** for a foreign origin is covered in `frontend/src/server.integration.test.js`. The five-then-429 path, **415**, **413**, **400**, and the window reset are gap. Pytest clears the rate bucket and never fills it.

### TC-CONTACT-01. The contact page matches the published business facts

- **Actor:** Guest
- **Priority:** P0
- **Language:** English and Gujarati
- **Preconditions:** `GET /api/settings` returns [backend/data/settings.json](../backend/data/settings.json).

**Steps**

1. Open `/contact`.
2. Read the header, the contact card, the area list, the hours, the “Before you order” notes, and the map card.
3. Activate phone and WhatsApp.
4. Open the footer on the same page and read the FSSAI line.
5. Repeat on `/gu/contact` and compare the facts that must stay identical.

**Expected result**

- The lede says online ordering is on the way. Ordering is WhatsApp, phone, or the form.
- Phone and WhatsApp both show `+91 91063 54619`. Phone uses `tel:+919106354619`. WhatsApp uses `https://wa.me/919106354619` and the general order text.
- Email says “To be announced”.
- City is Ahmedabad, Gujarat, India. All ten areas are listed. Pickup copy says call before arriving, especially in the morning, and that a street address is not published.
- Each weekday shows 10:00 AM – 11:00 PM. The note mentions 10:00 AM to 11:00 PM IST and the same phone number.
- The map card says location details are coming soon. There is no embedded map and no maps link.
- Footer FSSAI licence is `20726038003778`. In Gujarati the badge label is `FSSAI નોંધાયેલ ખાદ્ય પ્રદાતા` and the licence digits stay the same.
- The product select lists “General enquiry” plus every dish. Priced options show the localized name and `₹` amount. Unpriced options show the name only. Option values stay the English `name` from the menu file.

**Coverage:** partial. The FSSAI licence and the Gujarati badge label are covered in `frontend/src/components/FssaiBadge.test.jsx`. The instruction phone link is covered in `frontend/src/pages/Menu.test.jsx`. The contact card, hours, areas, map placeholder, and select options are gap.

### TC-API-01. Public reads return the menu and the site settings

- **Actor:** Guest (through the site) or Operator (direct HTTP)
- **Priority:** P0
- **Language:** n/a
- **Preconditions:** Either API process is running. Data files are unchanged.

**Steps**

1. `GET /api/health` and `GET /api/` (Node also accepts `GET /api`).
2. `GET /api/products`.
3. `GET /api/products/baroda-style-sev-usal`.
4. `GET /api/products/non-existent-product-12345`.
5. `GET /api/settings`.
6. On `server.mjs`, repeat the products GET with the returned `ETag` in `If-None-Match`.

**Expected result**

- Health is **200** `{ "status": "ok" }`. Root is **200** `{ "message": "Chiransh Foods API", "status": "ok" }`.
- Products is **200**, a list of 22 objects, ordered by `sort_order` ascending. The first slug is `baroda-style-sev-usal`.
- The slug route returns that product’s object, including `price` 100, `category` `Sev Usal (Regular)`, `availability` `available`, and `vegetarian` true.
- An unknown slug is **404** `{ "detail": "Product not found" }`.
- Settings is **200** and includes the phone, WhatsApp, areas, hours, `ordering.mode` `contact`, empty email, empty Zomato and Swiggy URLs, FSSAI licence, and canonical base `https://chiransh-foods.onrender.com`.
- Node sends `ETag` and `Cache-Control: public, max-age=60, must-revalidate` on products and settings. A matching `If-None-Match` returns **304**. FastAPI does not send that cache contract.
- There is no PUT, PATCH, or DELETE for products, settings, or enquiries, and no admin token.

**Coverage:** partial. Root, health, list shape, one slug, a 404 status, settings as an object, and a FastAPI enquiry are covered in `backend/test_server.py`. Node **304** for products is covered in `frontend/src/server.integration.test.js`. Sort order, the 404 body text, settings field values, and settings ETag are gap.

---

## P1. Trust, language, and content pages

### TC-LANG-01. The language control keeps the page, the query, and the hash

- **Actor:** Guest
- **Priority:** P1
- **Language:** Both
- **Preconditions:** Site shell is loaded.

**Steps**

1. On `/menu?category=Family%20%26%20Bulk%20Orders#menu-panel`, activate ગુજરાતી.
2. Activate English.
3. Open a dish, then switch language.
4. Confirm there is no हिन्दी control.

**Expected result**

- Gujarati becomes `/gu/menu?category=Family%20%26%20Bulk%20Orders#menu-panel`. English returns to the unprefixed path with the same query and hash.
- A dish switches between `/menu/{slug}` and `/gu/menu/{slug}`.
- The active language is `aria-current="page"`. English is the unprefixed locale. `/hi` is not a language link.
- The header language control stays available. It is not hidden at desktop width.

**Coverage:** partial. Path and category preservation is covered in `frontend/src/lib/locale.test.js`. Navbar English and Gujarati hrefs, the absent Hindi link, and the visible language group are covered in `frontend/src/components/Navbar.test.jsx`. The hash is gap.

### TC-NAV-01. Header, footer, and the phone menu reach every public page

- **Actor:** Guest
- **Priority:** P1
- **Language:** English, spot-check Gujarati labels
- **Preconditions:** Any page with the site shell.

**Steps**

1. Use the header links: Home, Menu, About, Gallery, Contact.
2. Use the footer Explore links, including FAQ, and the legal links.
3. At a narrow viewport, open the menu button, follow Menu, and close the drawer.
4. On `/gu/about`, confirm the same links stay under `/gu`.

**Expected result**

- Header destinations are `/`, `/menu`, `/about`, `/gallery`, `/contact`. The current section is marked `aria-current="page"`.
- Footer adds `/faq`, `/privacy`, `/terms`, and `/refund`.
- The phone drawer opens as a dialog, language links inside it are tappable, and choosing a destination closes it.
- Gujarati destinations are the same paths prefixed with `/gu`.
- A “Skip to content” link is the first focusable control and targets `#main-content`.

**Coverage:** partial. The phone drawer, language links, and Menu inside it are covered in `frontend/src/components/Navbar.test.jsx`. Footer destinations, active state, and skip link are gap.

### TC-FAQ-01. FAQ answers match how the business actually takes orders

- **Actor:** Guest
- **Priority:** P1
- **Language:** English, then Gujarati
- **Preconditions:** Open `/faq`.

**Steps**

1. Read the first answer, which is open on load.
2. Open “Where do you serve?”, “How can I place an order?”, “Do you offer pickup?”, “Do you offer delivery?”, and “How can I contact Chiransh Foods?”.
3. Close the open item.
4. Spot-check `/gu/faq` for the same facts.

**Expected result**

- Only one answer is open at a time. The first item starts open. Each button’s `aria-expanded` matches the visible panel.
- Vegetarian answer: every dish is 100% vegetarian.
- Service area lists the ten Ahmedabad areas and says a street address is not published.
- Order answer: WhatsApp `wa.me/919106354619`, phone `+91 91063 54619`, daily 10:00 AM to 11:00 PM IST, advance orders for 5 to 200 persons, Jain and Swaminarayan on request, and the contact form.
- Pickup is by phone call, with a call before arrival. Same-day delivery is not offered. Advance catering and delivery are booked by call or WhatsApp. Email is described as coming later.
- Gujarati FAQ answers state the same facts. Hours and the 5-to-200 range in that Gujarati prose use Gujarati numerals. Menu prices elsewhere stay in English digits.

**Coverage:** partial. Open-by-default and single-panel toggle are covered in `frontend/src/pages/FAQ.test.jsx`. The answer text is gap.

### TC-ABOUT-01. About states the brand promises

- **Actor:** Guest
- **Priority:** P1
- **Language:** English and Gujarati
- **Preconditions:** Open `/about` and `/gu/about`.

**Steps**

1. Read the story and the three value cards.
2. Follow the link back to the menu.

**Expected result**

- The page describes Chiransh Foods as home-style Gujarati vegetarian food from Ahmedabad.
- The three values are present in the page language: 100% Vegetarian, Baroda-style Authenticity, and Home-style Care. Gujarati uses the translated titles, not the raw i18n keys.
- The menu link goes to `/menu` or `/gu/menu`.

**Coverage:** partial. `frontend/src/pages/About.test.jsx` checks that `values.vegetarian.title` resolves in both languages. The rendered About page is gap.

### TC-LEGAL-01. Privacy, terms, and refund describe contact-only ordering

- **Actor:** Guest
- **Priority:** P1
- **Language:** English and Gujarati
- **Preconditions:** Footer legal links work.

**Steps**

1. Open `/privacy`, `/terms`, and `/refund`.
2. Repeat under `/gu`.
3. On the production-like server, confirm each URL returns **200**.

**Expected result**

- Privacy says the enquiry collects name, phone, optional email, product interest, and message. It says the details are used to answer the enquiry and arrange the order, are not sold, and can be cleared when the server restarts. Guests can ask for an update or deletion through the contact page.
- Terms place the brand in Ahmedabad, Gujarat, India, say unlisted prices are confirmed on enquiry, and say an order exists only after Chiransh Foods confirms it. Online checkout and payments are not active. Governing law is India.
- Refund says changes and cancellations are handled by contacting the kitchen, preferably before cooking starts. No online payment is taken. A direct payment that must be returned is refunded in full through the same arrangement. The page says the terms will be updated before any future online checkout goes live.
- Gujarati URLs render the Gujarati legal copy. These pages are indexable (they are known public paths).

**Coverage:** partial. `frontend/src/lib/seo.test.js` asserts `/gu/privacy` is indexable and that `/privacy` is in the sitemap. The legal sentences in the browser are gap.

### TC-GAL-01. The gallery opens, moves, and closes

- **Actor:** Guest
- **Priority:** P1
- **Language:** English and Gujarati
- **Preconditions:** Open `/gallery`.

**Steps**

1. Count the photos and open the first one.
2. Press ArrowRight until the counter passes the last photo.
3. Press ArrowLeft once.
4. Press Escape.
5. Open a photo and activate the close button, then open another and click the dark backdrop.
6. Open a photo and click the image itself.
7. Repeat the first caption on `/gu/gallery`.

**Expected result**

- Ten photos are shown. The lightbox is a dialog labelled as the image viewer.
- The first caption is “Signature — Baroda-style Sev Usal” and the counter reads `1 / 10`.
- ArrowRight and ArrowLeft wrap around the set. The previous control from the first photo shows `10 / 10`.
- Escape, the close button, and the backdrop close the dialog and return the page underneath.
- Clicking the image does not close the dialog.
- Gujarati uses the translated caption for the same first photo. The counter digits stay English.

**Coverage:** gap.

### TC-SOC-01. Footer social links use the published profiles

- **Actor:** Guest
- **Priority:** P1
- **Language:** Either
- **Preconditions:** Settings are the published file, which has Instagram, Facebook, and YouTube set, and Google Business empty.

**Steps**

1. Scroll to the footer on `/`.
2. Activate each social icon without completing a login on the other site. Record `href`, `target`, and `rel`.

**Expected result**

- Instagram, Facebook, and YouTube are shown, in that order, pointing at `https://instagram.com/chiranshfoods`, `https://facebook.com/chiranshfoods`, and `https://youtube.com/@chiranshfoods`.
- Each opens in a new tab with `rel="noopener noreferrer"`.
- There is no Google Business icon.
- Phone, WhatsApp, and the FSSAI badge are also in the footer. Email is omitted because it is null.

**Coverage:** gap. The FSSAI half of the footer is covered in `frontend/src/components/FssaiBadge.test.jsx`. Social URLs are gap.

### TC-FALLBACK-01. The menu still renders when the API cannot be reached

- **Actor:** Guest
- **Priority:** P1
- **Language:** English
- **Preconditions:** Stop the API process. Leave the Vite dev server running so `/api` fails at the proxy. Then start the API again for the last step.

**Steps**

1. With the API stopped, open `/menu` and `/menu/baroda-style-sev-usal`.
2. Open `/menu/not-a-real-dish` while the API is still stopped.
3. Start the API. Open `/menu/not-a-real-dish` again.
4. With the API running, compare one price on screen with `backend/data/products.json`.

**Expected result**

- A connection failure or HTTP 500–504 on the product list still shows the built-in 22-dish menu, with the same slugs, names, categories, and prices as the data file.
- A known dish still opens from that offline list, including its price and add-on rules.
- An unknown slug while the API is down shows the dish error state (“We couldn't load this dish.”) and a Try again button. It does not pretend the slug exists.
- When the API is up, that same unknown slug shows the recovery 404 page, because a real **404** is not replaced by the offline menu.
- Home uses the offline list when the product request fails. Settings keep the built-in phone, WhatsApp, hours, and FSSAI licence if `GET /api/settings` fails.

**Coverage:** partial. `frontend/src/lib/catalog.test.js` asserts the offline list matches the published file. The browser fallback, the error state, and the 404-versus-offline split are gap.

### TC-SEO-01. Search engines see English and Gujarati URLs on the Render host

- **Actor:** Operator
- **Priority:** P1
- **Language:** Both
- **Preconditions:** Production-like server, because Vite preview does not inject these tags.

**Steps**

1. `GET /robots.txt` and `GET /sitemap.xml`.
2. `GET /` and `GET /gu` and read the canonical link, `hreflang`, and `lang` in the HTML.
3. `GET /menu/baroda-style-sev-usal` and confirm the dish URL is in the sitemap.
4. Confirm the sitemap has no `/en` and no `/hi` URLs.

**Expected result**

- Canonical URLs use `https://chiransh-foods.onrender.com`.
- `/` is English. `/gu` is `lang="gu"` and includes `hreflang="en"`, `hreflang="gu"`, and `x-default`. It does not advertise Hindi.
- The sitemap lists each public page and each real dish in English and under `/gu`, including `https://chiransh-foods.onrender.com/gu/menu/baroda-style-sev-usal` and `https://chiransh-foods.onrender.com/privacy`.
- Unknown HTML paths are noindex. Legal pages are indexable.
- HTML responses send a content-security-policy that includes `default-src 'self'`, `x-content-type-options: nosniff`, and `cache-control: no-cache`.

**Coverage:** partial. Locale paths, hreflang, known paths, noindex, and sitemap entries are covered in `frontend/src/lib/seo.test.js`. The live HTML `lang`, CSP, and nosniff headers are covered in `frontend/src/server.integration.test.js`. `robots.txt` wording is gap.

### TC-EMPTY-01. Missing phone and WhatsApp leave a contact path

- **Actor:** Guest
- **Priority:** P1
- **Language:** English
- **Preconditions:** This is a settings variant. Point the site at a settings payload with empty `contact.phone`, `contact.whatsapp`, and `contact.email`, or temporarily edit a local copy of `settings.json` and restore it afterward. Do not commit that edit.

**Steps**

1. Load `/`.
2. Read the hero actions, the order band, the header order control, and the footer contact column.
3. Open `/contact`.
4. Restore the published settings.

**Expected result**

- The hero shows “Contact to Order” linking to `/contact` instead of WhatsApp.
- The order band and the header order control go to the contact page instead of `wa.me`.
- The footer says contact details are coming soon and points guests at the enquiry form.
- The contact card says phone, WhatsApp, and email will be published soon.
- The enquiry form still submits.
- Dish pages hide the WhatsApp button and keep “Send an enquiry”.

**Coverage:** gap.

### TC-DISH-07. Related dishes stay in the same family

- **Actor:** Guest
- **Priority:** P1
- **Language:** English
- **Preconditions:** API returns the published list in `sort_order`.

**Steps**

1. Open `/menu/baroda-style-sev-usal` and read “You may also love”.
2. Open `/menu/packaged-drinking-water` and read the related row.
3. Follow one related card.

**Expected result**

- Up to three other dishes are shown. Dishes from the same category come first.
- From Baroda-Style Sev Usal the row is Sev Usal with Pav, Sev Usal Take-Home Pack, and Tuvar Totha.
- From Packaged Drinking Water the other beverage, Masala Chaas, comes first.
- Each card links to that dish’s `/menu/{slug}` page.

**Coverage:** gap.

### TC-MENU-04. A hard menu failure can be retried

- **Actor:** Guest
- **Priority:** P1
- **Language:** English
- **Preconditions:** Make `GET /api/products` return a non-5xx error such as **404** or **400**. A stopped API or a **500** is TC-FALLBACK-01, not this case.

**Steps**

1. Open `/menu`.
2. Activate Try again after restoring the route.

**Expected result**

- The page shows the menu error copy and a Try again button, not the offline catalog.
- After the API returns the 22 dishes, Try again fills the grid.

**Coverage:** gap.

---

## Known limits

These are true of the current product. Do not file them as failed cases.

- Every dish in `products.json` is `available`. The dish page can show Seasonal and Currently unavailable, and unavailable dishes add the sentence “This dish is currently unavailable — contact us to enquire when it's back.” No published dish uses those states, and the order buttons remain on screen even when a dish is marked unavailable.
- Changing the menu or the phone number is a data-file change, not an API call. There is no admin login.
- FastAPI and Node disagree on CORS and on the exact **422** JSON for a honeypot. Cases above name the server.
- `enquiries.json` is local to the server process. The privacy page tells guests the current host can drop those records on restart.
- The home “Indian” preview card is a coming-soon link to the full menu. It is not a ninth menu category.
- Gallery photos are styled brand images. The page says real photographs will replace them.
- Reviews, email, a street address, and a map are intentionally unpublished.
- FastAPI exposes its generated `/docs` page. The production Node server does not.

## Traceability

| Case | Priority | Result today |
| --- | --- | --- |
| TC-HOME-01 | P0 | gap |
| TC-HOME-02 | P0 | gap |
| TC-HOME-03 | P0 | gap |
| TC-MENU-01 | P0 | partial |
| TC-MENU-02 | P0 | partial |
| TC-MENU-03 | P0 | partial |
| TC-DISH-01 | P0 | partial |
| TC-DISH-02 | P0 | covered |
| TC-DISH-03 | P0 | partial |
| TC-DISH-04 | P0 | partial |
| TC-DISH-05 | P0 | partial |
| TC-DISH-06 | P0 | covered |
| TC-404-01 | P0 | partial |
| TC-ENQ-01 | P0 | partial |
| TC-ENQ-02 | P0 | partial |
| TC-ENQ-03 | P0 | partial |
| TC-ENQ-04 | P0 | partial |
| TC-ENQ-05 | P0 | partial |
| TC-CONTACT-01 | P0 | partial |
| TC-API-01 | P0 | partial |
| TC-LANG-01 | P1 | partial |
| TC-NAV-01 | P1 | partial |
| TC-FAQ-01 | P1 | partial |
| TC-ABOUT-01 | P1 | partial |
| TC-LEGAL-01 | P1 | partial |
| TC-GAL-01 | P1 | gap |
| TC-SOC-01 | P1 | gap |
| TC-FALLBACK-01 | P1 | partial |
| TC-SEO-01 | P1 | partial |
| TC-EMPTY-01 | P1 | gap |
| TC-DISH-07 | P1 | gap |
| TC-MENU-04 | P1 | gap |

Highest-value gaps for a later automation pass: the home journey, a successful enquiry through the form, the 429 rate limit, the gallery lightbox, and the empty phone or WhatsApp variant.
