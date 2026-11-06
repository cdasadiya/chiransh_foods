# Cost and operations

Prices below were read from Hostinger’s public India pages on 28 October 2026. They are promotional, billed upfront for the term shown, and the pages said applicable taxes are added at checkout. A GST rate was not printed in the captured text, so tax is **Not Verified** and is not added into the totals.

Your Render invoice was not opened. That current cost is **Not Verified**. Do not cancel it based on this table.

The exact cart price of `chiranshfoods.com` was **Not Verified**. Extension list prices are included so you can recognize a premium surcharge.

## Price sources

| Item | Figure captured | Source |
| --- | --- | --- |
| Web Hosting Unlimited, 48 months | ₹199 per month, ₹9,552 due for the term. Renews at ₹649 per month | hostinger.com/in pricing page |
| Cloud Startup, 48 months | ₹599 per month, ₹28,752 due. Renews at ₹1,599 per month | hostinger.com/in cloud hosting page |
| VPS KVM 1, 24 months | ₹599 per month, ₹14,376 due. Renews at ₹999 per month. 1 vCPU, 4 GB RAM, 50 GB NVMe, 4 TB bandwidth | hostinger.com/in VPS pricing page |
| `.com` promo | ₹1 first year only with a 3-year term, ₹2,999 due for 3 years, then ₹1,499 per year | hostinger.com/in/domains |
| `.com` non-promo first year | ₹1,499 | same page |
| `.in` | ₹1 first year advertised, renewal ₹899 per year. 3-year due-today total not captured | hostinger.com/in/tld/in-domain |
| `.co.in` | ₹499 first year, renewal ₹799 per year | Hostinger Hindi `.co.in` page |
| Unlimited plan free domain | “Domain - free for 1 year” on the pricing card. Which extensions qualify was not tested | pricing page |
| Mailboxes | Pricing card says unlimited mailboxes free for 1 year. Limits table says 5 per website on the Business email trial for Unlimited | Conflicting official pages. Confirm at checkout |
| Daily backups | Included in the Unlimited marketing text | pricing page |
| Database | Included MySQL quota if you later choose to use it. ₹0 extra on this plan. Not required now | limits table |
| SSL | Included with web and cloud plans | domains FAQ |
| Monitoring SaaS | Not required by the app | — |
| Transactional email | Not used by the app | — |

## Comparison for one year of attention, and the cash due at purchase

“Cash at purchase” is what the page said you pay upfront. It is not a monthly bill.

| Architecture | Cash at purchase | After the intro term | Enquiry durability | Who administers Linux |
| --- | --- | --- | --- | --- |
| Unlimited Node app, 48-month term | ₹9,552 hosting. Domain ₹0 if the free-domain offer covers your name, otherwise about ₹2,999 for 3 years of `.com` if the promo applies | Hosting renewal ₹649 per month if you repeat 48 months. Domain ₹1,499 per year after the `.com` term | Not solved by the plan. F-01 | Hostinger |
| Same, plus a separate `.in` | Add the `.in` cart total. List promo was ₹1 in year one and ₹899 per year after. Multi-year total **Not Verified** | ₹899 per year for `.in` | Same | Hostinger |
| Stay on Render, domain at Hostinger | Domain only, same domain figures. Hosting cash is your existing Render bill, **Not Verified** | Domain renewal as above, plus Render renewal | **Not Verified** on Render | Render |
| Cloud Startup instead of Unlimited | ₹28,752 for 48 months | ₹1,599 per month renewal | Same F-01 limit | Hostinger |
| VPS KVM 1 | ₹14,376 for 24 months, plus domain | ₹999 per month renewal | You can put the file on a normal disk | You |

Illustrative first-term monthly average for Unlimited, if you ignore the free-domain question: ₹9,552 / 48 = ₹199. That average hides the fact that the money leaves the account on day one.

If the free domain does **not** apply and you take the `.com` promo, add ₹2,999 once for three years, which is about ₹83 per month across those three years, then ₹1,499 per year. Do not add that ₹2,999 if the hosting checkout already includes the domain.

## What is not in the price

- GST or other checkout tax.
- A premium-domain fee.
- A future code change to store enquiries in MySQL. The database quota is included. The development time is not a Hostinger line item.
- Google Business Profile, which is not a Hostinger product.
- WhatsApp Business API. The site uses ordinary `wa.me` links, which have no Hostinger fee.
- A paid error tracker. None is configured.

## Who does the work

| Work | Owner in hPanel | Developer in Git or SSH | External |
| --- | --- | --- | --- |
| Buy plan and domain | Owner | — | Hostinger checkout |
| DNS, SSL, mailbox, Node version, restart, read logs | Owner, or a developer you trust with the login | — | — |
| Set framework Other and entry `server.mjs` | Owner following [deployment-runbook.md](deployment-runbook.md) | Developer if the first build fails | — |
| Canonical URL and any enquiry-storage code | — | Developer, after your approval | — |
| OS patches on Unlimited | — | — | Hostinger |
| OS patches, firewall, nginx on VPS | — | Developer | — |
| Menu prices and phone number | Owner confirms the facts | Developer edits `settings.json` or `products.json` | — |
| Search Console | Owner’s Google account | DNS TXT from hPanel | Google |
| Backups of the account | Owner clicks restore, after a test | — | Hostinger backup product, limits **Not Verified** for the enquiry file |
| Incident: site down | Owner checks hPanel status and the Running control | Developer reads the build log | Hostinger support if the platform is down |
| Incident: form data missing after deploy | Owner still has WhatsApp | Developer does not assume DNS rollback restored the file | — |

## Routine

| Cadence | Action |
| --- | --- |
| Every deploy | Export enquiries first, until F-01 is fixed. Confirm `/api/health` |
| Monthly | Open the site on a phone. Submit nothing unless it is a labelled test |
| Quarterly | Check certificate expiry in hPanel even though renewal is advertised as automatic. Check domain auto-renewal and the card |
| Yearly | Read the renewal price before it is charged. Hostinger charges domain renewal 27 days before expiry |
| When the menu changes | Edit `products.json`, deploy, confirm the sitemap contains the new slug |

## Skills required to stay on the recommended plan

You can buy the plan, point the domain, and read “is the site up?” in hPanel without Linux experience. The first deploy needs someone who can tell a static Vite app from `server.mjs`. After that, content changes are Git commits. They are not file-manager edits, because Hostinger overwrites those on the next deploy.

A VPS would require SSH, a firewall, Node process supervision, certificate renewal checks, and Ubuntu updates. That is the wrong default for this site.
