# Chiransh Foods deployment audit

These reports describe the website in this repository and the live site at `https://chiransh-foods.onrender.com/`. They were written from a read-only inspection on 28 October 2026 (India time, IST).

Nothing in this folder changes the running site. No domain was purchased, no DNS record was edited, and no file outside `deployment-audit/` was modified.

## How to read them

1. [executive-summary.md](executive-summary.md) — for the business owner. Start here.
2. [findings-register.md](findings-register.md) — every finding, with priority P0 through P3. Later reports use the same IDs.
3. [repository-audit.md](repository-audit.md) — what is in the project.
4. [architecture-audit.md](architecture-audit.md) — how a page request is served.
5. [frontend-audit.md](frontend-audit.md) — pages, language, forms, and what was not visually tested.
6. [backend-database-audit.md](backend-database-audit.md) — the API and the JSON files. There is no database server.
7. [security-audit.md](security-audit.md) — defensive review of the code and the live headers.
8. [hostinger-compatibility.md](hostinger-compatibility.md) — which Hostinger product can run this site.
9. [domain-research.md](domain-research.md) — names that were checked, and which prices are still a checkout question.
10. [deployment-architecture.md](deployment-architecture.md) — the recommended layout, not a deployment that has been performed.
11. [deployment-runbook.md](deployment-runbook.md) — the steps to follow after you approve a move.
12. [dns-ssl-checklist.md](dns-ssl-checklist.md) — domain, HTTPS, and email DNS.
13. [seo-performance-plan.md](seo-performance-plan.md) — search and speed work. No ranking is promised.
14. [cost-and-operations.md](cost-and-operations.md) — prices that were published, and prices that were not.
15. [deployment-checklist.md](deployment-checklist.md) — the practical checklist.
16. [migration-and-rollback.md](migration-and-rollback.md) — how to move off Render without deleting it first.

## Rules that still apply

- Keep `https://chiransh-foods.onrender.com/` online until a replacement has been tested and you have approved the cutover.
- Do not paste real passwords, API keys, or database URLs into these files or into Hostinger chat logs.
- A registry result that a name is unregistered is not a reservation. Another person can register it until you complete checkout.
