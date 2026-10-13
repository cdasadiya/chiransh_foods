# Security and data protection

This is the rule for the whole Chiransh Foods website. Pages, the enquiry API, and hosting must follow it. The legal basis is the Digital Personal Data Protection Act, 2023 (DPDP Act) and the rules made under it.

Chiransh Foods, Ahmedabad, Gujarat, India, is the data fiduciary. The site collects personal data for one purpose: to reply to an enquiry and arrange that order.

## Notice and consent

Collect personal data only after a plain-language notice and a specific, affirmative consent. The consent control on the contact form starts unchecked. Sending the form is not consent by itself.

The notice must say what is collected, why, how long it is kept, who else processes it, how to withdraw consent, and how to complain to the Data Protection Board of India. English and Gujarati must carry the same notice. The published version identifier is `2026-10-11`.

Withdrawal, access, correction, completion, erasure, and nomination go through the Contact page or +91 91063 54619.

## What is stored

An accepted enquiry stores:

- name, phone number, email if the person gave one, product interest, and message
- the time consent was recorded, the notice version, and the language (`en` or `gu`)

The site does not store the IP address, cookies, or analytics identifiers. The IP address is used only in memory to limit repeated posts, then discarded. Logs may include the enquiry id, time, and product interest. Logs must not include the name, phone number, email, or message.

The site does not knowingly collect personal data from anyone under 18, and it does not run behavioural advertising. The form asks the person to confirm they are 18 or older.

## Retention

Keep an enquiry for 90 days from its timestamp, then erase it. Erase sooner when the person asks.

Each enquiry write erases records older than 90 days. That step is a comment in `server.mjs`, `backend/server.py`, and `frontend/src/lib/enquiry.js`. It does not run.

## Processors

| Who | When | What they process |
| --- | --- | --- |
| Render (the current site host, outside India) | While it hosts this site | The enquiry file and ordinary server logs |
| WhatsApp / Meta | Only after the visitor opens a WhatsApp link | The message the visitor chooses to send there |
| Instagram, Facebook, YouTube | Only after the visitor opens those links | Nothing from the enquiry form |

Render must not use enquiry data for its own marketing. The enquiry form is not sent to WhatsApp or the social networks.

Do not add a tracker, pixel, payment provider, or host until this file and the privacy notice both name it.

## Hosting

Any current or future host of this personal data must:

- serve the site over HTTPS
- limit access to the people operating Chiransh Foods
- not use enquiry data for the host’s own marketing
- process the data only in India, or in a country the Central Government of India has not restricted under the DPDP Act
- keep a written list of its subprocessors
- allow Chiransh Foods to export and delete enquiry records

India-region hosting is the preferred control for this personal data. The live site is still on Render, which does not offer an India region. The privacy notice discloses that host and the cross-border processing. Do not treat this document as approval to move the host. A move, and any change to Render settings, needs a separate decision. `render.yaml` is unchanged by the notice and storage work that introduced this file.

## Security safeguards

- HTTPS, HSTS, and the Content-Security-Policy in `server.mjs`
- same-origin checks, a honeypot, and a limit of 5 enquiry posts per IP per 10 minutes
- no public API to read enquiries
- enquiry file mode restricted to the owner when the process can set it

Set `ENQUIRY_STORAGE_KEY` in the host environment so the enquiry file is encrypted with AES-256-GCM. The key is a secret. Do not commit it, and do not put it in `render.yaml`. If the variable is unset, the file stays plaintext so a deploy does not break the form before the secret is approved and set. Production should set the key.

The encrypted file is a JSON object:

- `v`: `1`
- `alg`: `aes-256-gcm`
- `iv`: base64 of a 12-byte nonce
- `tag`: base64 of the 16-byte authentication tag
- `data`: base64 of the ciphertext

The key is SHA-256 of the UTF-8 secret. The associated data is the UTF-8 string `chiransh-enquiries-v1`. The ciphertext is the UTF-8 JSON array of enquiry records. The local API (`backend/server.py`) and the production server (`server.mjs`) use this same format.

## If personal data is exposed

Contain the exposure, record what happened, and inform the affected people and the Data Protection Board of India in the manner the DPDP Rules prescribe. Do not put names, phone numbers, or email addresses in the incident log unless that record is itself protected and limited to the response.

## Rights and grievances

Chiransh Foods will answer requests to access, correct, complete, erase, withdraw consent, or nominate another person. The contact is the Contact page and +91 91063 54619. There is no separate email address on the site. A person may also complain to the Data Protection Board of India.
