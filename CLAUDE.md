# portfolioTraker — Workspace Guide

## Structure

This directory is the Claude Code working root. It contains two separate git repos:

```
pTraker/
├── CLAUDE.md              ← you are here
├── ARCHITECTURE.md        ← full system architecture, DB schema, flow diagrams
├── ptraker-api/           ← Express/Node.js API  (see ptraker-api/CLAUDE.md)
└── ptraker-client/        ← React 19/Vite client (see ptraker-client/CLAUDE.md)
```

**All three repos are public.** Environment-specific details (hosts, IPs, SSH,
emails, account numbers, deployment runbooks) are kept out of tracked files — they
live in a private repo and are loaded via the gitignored `CLAUDE.local.md`. Never add
them to any tracked file.

## Start Here

**Always read these before starting any session:**
1. `ARCHITECTURE.md` — system overview, DB schema, import pipeline, frontend layout
2. `ptraker-api/CLAUDE.md` — API patterns, gotchas, routes, env vars
3. `ptraker-client/CLAUDE.md` — React patterns, Ant Design v6 quirks, services
4. `CLAUDE.local.md` (if present) — private environment and deployment notes

## Repositories

| Repo | Remote |
|------|--------|
| API | https://github.com/dschoepel/ptraker-api |
| Client | https://github.com/dschoepel/ptraker-client |

Each repo has its own git history, branches, and GitHub Actions CI/CD.

## Stack Summary

- **API**: Node.js 23 / Express 4 / Supabase PostgreSQL / yahoo-finance2 v4
- **Client**: React 19 / Vite / Ant Design v6 / React Router v7 / Recharts
- **Auth**: Supabase GoTrue (self-hosted) — email via nodemailer (GoTrue v2.186 bug workaround)
- **Dev DB**: self-hosted Supabase on the LAN (`SUPABASE_URL` in `ptraker-api/.env`)
- **Prod**: ptraker.com — Docker images built by GitHub Actions and pushed to GHCR; container updates handled outside these repos

## Current Status

Production is live at ptraker.com. Fully functional: auth, dashboard, accounts,
import (LPL CSV/QFX + OFX + manual), watchlist, admin, profile, portfolio sharing,
analytics charts. Release process: `/deploy` (`.claude/commands/deploy.md`).

## Deployment Gotchas (generic)

- `docker compose restart` does NOT pick up `.env` changes — use `docker compose up -d --force-recreate <service>`.
- Supabase `VAULT_ENC_KEY` must be exactly 32 bytes — `secrets.token_hex(16)`, not `token_urlsafe(32)`.
- JWT keys copied into `.env` files get truncated easily — a valid key has exactly 2 dots.
- Users inserted directly into `auth.users` need `confirmation_token`, `recovery_token`, `email_change_token_new`, `email_change` set to `''` (NULL → `500: Database error querying schema` on login).
- Vite builds on Linux are case-sensitive — Windows silently accepts wrong-case imports.
- DB schema changes must be applied before the API container that depends on them restarts.
