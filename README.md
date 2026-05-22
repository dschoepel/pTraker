# portfolioTraker

Private investment portfolio tracker for tracking holdings across brokerage, retirement,
and bank accounts. No ads, no data sharing.

Live at **[ptraker.com](https://ptraker.com)**

---

## Repositories

| Repo | Description |
|------|-------------|
| [ptraker-api](https://github.com/dschoepel/ptraker-api) | Express/Node.js REST API |
| [ptraker-client](https://github.com/dschoepel/ptraker-client) | React 19 / Vite frontend |

This workspace root contains shared infrastructure that spans both repos.

---

## Stack

- **API**: Node.js 23 / Express 4 / Supabase PostgreSQL / yahoo-finance2
- **Client**: React 19 / Vite 8 / Ant Design v6 / Recharts / PWA
- **Auth**: Supabase GoTrue (self-hosted)
- **Hosting**: Jupiter VPS — Docker / Portainer / Swag (Let's Encrypt TLS)

---

## What's in this repo

```
pTraker/
├── ARCHITECTURE.md                    — system overview, DB schema, flow diagrams
├── CLAUDE.md                          — Claude Code workspace guide
├── jupiter-vps-security-hardening.md  — Jupiter VPS security baseline
├── deploy/
│   ├── docker-compose.yml             — production Docker stack
│   ├── .env.example                   — required environment variables
│   ├── swag/                          — Swag/nginx proxy config
│   ├── supabase/                      — Supabase stack config
│   └── seeds/                         — demo user SQL seed scripts
└── .claude/
    └── commands/
        └── deploy.md                  — /deploy skill for Claude Code
```

`ptraker-api/` and `ptraker-client/` are separate git repos and are excluded from
this repo's history.

---

## Features

- Dashboard with net worth summary, gain/loss, and per-account breakdown
- Import from LPL Financial CSV, OFX/QFX (investment + bank), CFCU CSV, and manual entry
- Manual entry for exchange-listed stocks (Yahoo Finance autocomplete) and private/unlisted stocks
- Nightly price refresh via Yahoo Finance (weekdays 5 pm CT)
- Watchlist with symbol search and sparkline price history
- Portfolio sharing — share your portfolio view with another user
- Admin panel — invite users, manage roles, approve upgrade requests
- Analytics charts — allocation by institution, account type, and cash position
- PWA — installable on iOS and Android home screen
- Responsive layout — mobile card views and desktop tables

---

## Development Setup

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full system architecture and local dev setup.
Quick reference:

- Dev Supabase: Mercury (10.0.10.60:8100)
- API dev server: `npm run dev` → http://localhost:5000
- Client dev server: `npm run dev` → http://localhost:5173

---

## Deployment

Releases are deployed via GitHub Actions on tag push. See the
[deploy skill](.claude/commands/deploy.md) for the full release checklist.

Production smoke test endpoints:
- https://ptraker.com — React app
- https://api.ptraker.com/health — API health check
- https://supabase.ptraker.com — Supabase Kong (returns 401 = healthy)
