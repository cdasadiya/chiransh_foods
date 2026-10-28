# Hostinger compatibility

Sources read on 28 October 2026:

- [Node.js hosting overview](https://docs.hostinger.com/node.js/overview) (updated 21 October 2026)
- [Creating a Node.js app](https://docs.hostinger.com/node.js/creating-an-app) (updated 21 October 2026)
- [Supported frameworks](https://docs.hostinger.com/node.js/overview-1)
- [File structure](https://docs.hostinger.com/node.js/file-structure)
- [Node.js limits for web and cloud plans](https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/) (updated 21 October 2026)
- [Parameters and limits](https://www.hostinger.com/support/6976044-parameters-and-limits-of-hosting-plans-in-hostinger/) (updated 9 October 2026)
- [Which languages are supported](https://www.hostinger.com/support/which-programming-languages-and-frameworks-are-supported-at-hostinger/)
- [Which databases are supported](https://www.hostinger.com/support/which-databases-and-data-tools-are-supported-at-hostinger/)
- India pricing pages for web hosting, cloud hosting, and VPS

Hostinger can change prices and limits. Re-check the cart before paying.

## What this application needs

One Node.js 22 process, start file `server.mjs`, build that produces `frontend/dist`, read of JSON in `backend/data`, write of one enquiry file, HTTPS, and a domain. It does not need Python, PostgreSQL, WebSockets, cron, Docker, or root access.

Python on Hostinger web and cloud hosting is unsupported because those plans have no root access. That fact would matter for Django. It does not force a VPS here, because production never starts `backend/server.py`. Finding F-19.

## Plan boundaries

| Product | Node.js for this app | Why |
| --- | --- | --- |
| A. Web Single and Web Premium | Not supported, according to the limits table | “Node.js websites: Not available.” The pricing page still shows a Node.js badge. Treat the limits table as the rule unless support confirms otherwise. F-04 |
| A. Web Hosting Unlimited (Business) | Supported in the panel | 5 Node.js websites, Node 18/20/22/24, 2 CPU, 3 GB RAM, 50 GB NVMe, daily backups advertised |
| B. Cloud Startup and higher | Supported in the panel | More CPU and RAM than this site needs. 10 Node.js websites on Startup |
| C. VPS KVM | Supported by installing Node yourself | Root, firewall, and process manager are your job |
| D. Stay on Render | Already supported | Custom domain is a DNS change. Dashboard steps were **Not Verified** |
| E. Split frontend and API | Not justified | Both parts are one process today. Splitting adds CORS and a second bill |

## Capability matrix for the recommended plan (Unlimited + Node Web App)

| Capability | Label | Notes |
| --- | --- | --- |
| Node.js 22 | Supported natively | Select 22. Default documented as 22 |
| Custom server entry `.mjs` | Supported with manual configuration | Preset **Other**. Do not accept a static Vite detection. F-02 |
| Python / FastAPI | Not supported on this plan | Not required in production |
| Root and OS packages | Not supported on this plan | VPS only |
| Process manager | Supported natively | Hostinger starts and restarts the process. Idle stop is documented. F-15 |
| Reverse proxy and TLS | Supported natively | Platform proxy. App must use `PORT`, which it does |
| PostgreSQL | Not supported on this plan | Not required. VPS only |
| MySQL | Supported natively | Unused. 150 databases, 3 GB each, on Unlimited |
| Writable deploy directory | Supported until the next deploy | Then replaced. F-01 |
| Cron | Supported with manual configuration | Documented for Node sites. This app has no job to schedule |
| WebSockets inbound | Not supported on this plan | Not used |
| Background workers | Not supported on this plan | Not used |
| SSL | Supported natively | Free certificates with web and cloud plans, per the domains FAQ |
| DNS and redirects | Supported natively | hPanel, while nameservers are Hostinger’s |
| Email mailboxes | Supported natively | Trial mailbox counts conflict between the pricing page and the limits table. Confirm at checkout. F-06 |
| Transactional email | Requires an external service | The app does not send mail. Hostinger script mail is 10 per minute and 100 per day, and is aimed at PHP-style sending |
| Git deploy | Supported natively | GitHub or GitLab. Branch deploy. This repo is on GitHub per `render.yaml` |
| SSH | Requires verification | File edits over SSH are discouraged; deploys overwrite them |
| CI of this repo | Requires an external service | GitHub Actions already exists. Hostinger builds on its side |
| Bandwidth | Supported natively | Unlimited on this plan, fair use |
| Monitoring | Supported with manual configuration | hPanel resource and build logs. No application APM is included |
| Firewall | Supported natively at the platform | You do not manage iptables |
| Security updates of the OS | Supported natively | Hostinger’s images. You still update npm dependencies in Git |
| Enquiry durability | Not supported as currently coded | F-01 |

## Capability matrix for VPS KVM 1, if the panel build fails

| Capability | Label |
| --- | --- |
| Node 22, nginx, systemd or PM2 | Supported with manual configuration |
| Python, if you ever needed it | Supported with manual configuration |
| PostgreSQL | Supported with manual configuration. Still unused |
| Enquiry file on a path outside the Git checkout | Supported with manual configuration |
| SSL | Supported with manual configuration (Certbot or a panel) |
| OS patches, firewall, backups you trust | Your responsibility. Weekly backups are advertised; a restore test is still yours |
| Fit for this site | Works, and costs more attention than the site needs |

## Capability matrix for staying on Render

| Capability | Label |
| --- | --- |
| Current process | Supported natively. It is the live site |
| Custom domain and TLS | Supported with manual configuration in the Render dashboard. Exact clicks were **Not Verified** in this account |
| Enquiry file | Requires verification. Ephemeral disks lose it. A paid disk might keep it. The dashboard was not opened |
| Hostinger’s role | Domain, DNS, and optional mailboxes. The A/CNAME values must come from Render’s custom-domain screen, not from a guess |
| Operational effort | Lowest |

## Recommendation

**Primary:** Hostinger Web Hosting Unlimited, one Node.js Web App, Node 22, preset Other, entry `server.mjs`, repository root, build command `yarn` so `postinstall` builds `frontend/dist`.

**Fallback:** Keep Render. Put the domain’s DNS at Hostinger and follow Render’s custom-domain records.

**Not recommended now:** VPS, Cloud Startup, or a split frontend and API. Choose VPS only after a real Unlimited build fails to start `server.mjs` or you later need software that requires root.

## Trade-offs

| | Unlimited Node app | Stay on Render | VPS KVM 1 |
| --- | --- | --- | --- |
| Fits the code | Yes, if preset Other is set | Yes, already running | Yes, if you configure it |
| Promo price seen | ₹199/month for 48 months, ₹9,552 upfront, renews at ₹649/month | Invoice **Not Verified** | ₹599/month for 24 months, ₹14,376 upfront, renews at ₹999/month |
| Who patches the OS | Hostinger | Render | You |
| Enquiry file | Lost on deploy until F-01 is solved | **Not Verified** | You can place the file on a stable path |
| Idle behaviour | Process may sleep. F-15 | Render free services sleep; this service’s plan is **Not Verified**. The site answered without a cold-start measurement | Stays up if the process manager is installed |
| Migration size | New build, then DNS | DNS only | New server, nginx, firewall, deploy |
| Skill | hPanel plus a careful first deploy | DNS | Linux administration |

Taxes are extra. The pricing pages said applicable taxes are added at checkout and did not print a GST rate in the text that was captured.

## What you manage in hPanel versus elsewhere

| Task | Where |
| --- | --- |
| Domain, DNS, SSL, mailboxes, Node version, build logs, restart | hPanel |
| Canonical URL, menu, enquiry code | Git, after you approve an edit |
| GitHub Actions | GitHub |
| WhatsApp and phone orders | Your phone |
| Search Console | Google, after the domain exists |
| OS firewall | Only on VPS |
