# DNS, SSL, and HTTPS checklist

The domain is not registered yet. There are no live mail records to preserve. When a mailbox is added later, treat its MX, SPF, DKIM, and DMARC records as production data and do not delete them during a website change.

Do not replace nameservers with a host you do not intend to use for DNS. If both the site and the mail stay at Hostinger, Hostinger nameservers are appropriate. If the site stays on Render, you can still keep Hostinger nameservers and publish the records Render shows.

## Ownership

- [ ] The registrar account email is one you control.
- [ ] The registrant name is the business or the owner, not the developer’s personal experiment account, unless you choose that on purpose.
- [ ] WHOIS privacy is enabled where the extension allows it.
- [ ] The ICANN contact email is confirmed within 15 days of `.com` registration.
- [ ] Auto-renewal is a conscious choice. Hostinger turns it on and charges 27 days before expiry.
- [ ] Transfer lock stays on. Unlock only for a planned transfer, and not in the first 60 days unless support says otherwise.

## Records to create

Copy values from the screen that is actually issuing them. The table is a checklist of types, not a list of addresses to type from this document.

| Type | Name | When | Source of the value |
| --- | --- | --- | --- |
| A | `@` | Site hosted at Hostinger | hPanel website IP. Add AAAA if hPanel shows one |
| AAAA | `@` | Only if an IPv6 address is shown | hPanel |
| CNAME or redirect | `www` | Always | One redirect to the apex, or the CNAME hPanel requires for that redirect. Not a second app |
| CNAME | `www` or the host Render names | Site stays on Render | Render custom-domain screen |
| ALIAS / ANAME / A | `@` | Site stays on Render | Whatever Render supports at Hostinger. If the panel cannot alias the apex, use Render’s documented apex method. Do not invent an IP |
| MX | `@` | A mailbox is created | Hostinger email setup. Absent until then |
| TXT | `@` or the name shown | SPF, after mail exists | Email setup wizard |
| CNAME or TXT | selector shown | DKIM, after mail exists | Email setup wizard |
| TXT | `_dmarc` | After SPF and DKIM work | Start with a monitor policy, for example `p=none`, then tighten after mail is flowing. The exact record is a decision at that time, not before mail exists |
| TXT | name shown by Google | Search Console | Google’s verification wizard |
| CAA | `@` | Optional, after you know the certificate issuer | Only if you want to restrict issuers. A wrong CAA blocks issuance. Skip until the first certificate succeeds |

NS records: leave the registrar default unless you are deliberately moving DNS. This audit does not recommend a nameserver cutover beyond “use Hostinger DNS if the domain is bought there.”

## Behaviour

- [ ] `https://chiranshfoods.com/` returns 200 and the Chiransh homepage.
- [ ] `http://chiranshfoods.com/` returns 301 or 308 to the HTTPS URL.
- [ ] `https://www.chiranshfoods.com/` redirects once to the apex, or the apex redirects once to `www`. Pick one and use it in canonical tags. This design picks the apex.
- [ ] There is no redirect loop.
- [ ] Only one hostname runs the Node process. F-05.

## Propagation

- [ ] TTL was lowered before the change, if the panel allows a number such as 300 seconds.
- [ ] `dig` or the Hostinger DNS checker shows the new records from more than one resolver.
- [ ] You waited through the old TTL before declaring a failure. Hostinger’s own domain FAQ says DNS can take up to 24 hours and rarely 72.
- [ ] A phone off Wi-Fi was checked, not only the office DNS cache.

## Certificate

- [ ] The hostname is attached to the hosting plan before you expect a certificate.
- [ ] hPanel shows the certificate as issued for the apex and for `www`.
- [ ] The certificate chain is valid in a browser. No name mismatch.
- [ ] Renewal is automatic. Note the expiry date anyway and check it once a quarter.
- [ ] No manual certificate file was pasted over the managed one.

## After HTTPS works

- [ ] Open the contact page and a dish page. Images and fonts load. The content security policy is present.
- [ ] Browser tools show no mixed-content warnings. **Not Verified** in this audit’s browser session.
- [ ] HSTS is present, sent by `server.mjs`. Do not add `preload`.
- [ ] Secure cookies are not applicable today. There is no session cookie. If one is added later, set `Secure` only after this checklist is green.
- [ ] Canonical tags use `https://` and the chosen hostname. F-03.

## Mail safety

- [ ] Creating the website did not delete MX records. On a brand-new domain there are none yet. Re-check after both the site and the mailbox exist.
- [ ] SPF includes only the servers that really send mail.
- [ ] DKIM signs messages from the mailbox.
- [ ] DMARC starts at `p=none` with a mailbox you read, then moves to quarantine or reject after legitimate mail passes.
- [ ] The website’s Node app is not used as a bulk mailer. It does not send mail today.

## DNSSEC

- [ ] Leave DNSSEC off until the A, redirect, and mail records are correct.
- [ ] If you enable it, confirm resolvers still resolve the site before you announce the domain.
- [ ] Disabling DNSSEC later is a planned change, not a quick toggle during an outage, because caches hold the old trust chain.

## Render

- [ ] The Render hostname still answers until you approve retirement.
- [ ] You have written down the Render DNS targets before you need them for rollback.
- [ ] Rollback of DNS is tested as a procedure on paper in [migration-and-rollback.md](migration-and-rollback.md). It does not recover a database, because there is no database. It also does not recover enquiry files written only on the other host.
