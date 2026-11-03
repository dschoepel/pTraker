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
- **Hosting**: self-hosted Docker — images built by GitHub Actions and published to GHCR

---

## What's in this repo

```
pTraker/
├── ARCHITECTURE.md                    — system overview, DB schema, flow diagrams
├── CLAUDE.md                          — Claude Code workspace guide
└── .claude/
    └── commands/
        └── deploy.md                  — /deploy release checklist for Claude Code
```

`ptraker-api/` and `ptraker-client/` are separate git repos and are excluded from
this repo's history. Each has a `Dockerfile`; the API repo also has demo-user seed
scripts in `deploy/seeds/`. Host-specific deployment configuration is kept privately.

---

## Features

- Dashboard with net worth summary, gain/loss, and per-account breakdown
- Import from LPL Financial CSV, OFX/QFX (investment + bank), credit-union CSV, and manual entry
- Manual entry for exchange-listed stocks (Yahoo Finance autocomplete) and private/unlisted stocks
- Price refresh via Yahoo Finance — nightly (weekdays 5 pm CT) plus intraday (hourly 9:30 am–3:30 pm ET); manually priced private holdings keep their entered price
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

- Dev Supabase: self-hosted instance (set `SUPABASE_URL` / `SUPABASE_PUBLIC_URL` in `ptraker-api/.env` and `VITE_SUPABASE_URL` in `ptraker-client/.env`)
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
