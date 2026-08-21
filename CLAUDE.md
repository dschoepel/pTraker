# portfolioTraker — Workspace Guide

## Structure

This directory is the Claude Code working root. It contains two separate git repos:

```
E:\ptraker\
├── CLAUDE.md              ← you are here
├── ARCHITECTURE.md        ← full system architecture, DB schema, flow diagrams
├── jupiter-vps-security-hardening.md  ← Jupiter VPS security baseline (read before deployment work)
├── ptraker-api\           ← Express/Node.js API  (see ptraker-api/CLAUDE.md)
└── ptraker-client\        ← React 19/Vite client (see ptraker-client/CLAUDE.md)
```

## Start Here

**Always read these before starting any session:**
1. `ARCHITECTURE.md` — system overview, DB schema, import pipeline, frontend layout
2. `ptraker-api/CLAUDE.md` — API patterns, gotchas, routes, env vars
3. `ptraker-client/CLAUDE.md` — React patterns, Ant Design v6 quirks, services

**Before any deployment or infrastructure work:**
4. `jupiter-vps-security-hardening.md` — Jupiter VPS config, security posture, network layout

## Repositories

| Repo | Path | Remote |
|------|------|--------|
| API | `E:\ptraker\ptraker-api` | https://github.com/dschoepel/ptraker-api |
| Client | `E:\ptraker\ptraker-client` | https://github.com/dschoepel/ptraker-client |

Each repo has its own git history, branches, and GitHub Actions CI/CD.

## Stack Summary

- **API**: Node.js 23 / Express 4 / Supabase PostgreSQL / yahoo-finance2 v4
- **Client**: React 19 / Vite 6 / Ant Design v6 / React Router v7 / Recharts
- **Auth**: Supabase GoTrue (self-hosted) — email via nodemailer (GoTrue v2.186 bug workaround)
- **Dev DB**: Supabase on Mercury (10.0.10.60:8100)
- **Prod target**: jupiter-r640 (10.0.10.50, LAN) at ptraker.com — Docker/Dockhand; reverse-proxied by nginx on Earth

## Current Status

**Production deployment complete** — ptraker.com is live on jupiter-r640 (v1.8.0, 2026-07-07).
Fully functional: auth, dashboard, accounts, import (LPL CSV/QFX + CFCU OFX + manual),
watchlist, admin, profile, portfolio sharing, analytics charts.

## Production Deployment Progress

| Step | Description | Status |
|------|-------------|--------|
| 1 | DNS — DYNU A records for ptraker.com + subdomains | ✅ Done |
| 2 | Swag — add ptraker.com to EXTRA_DOMAINS, get TLS cert | ✅ Done |
| 3 | Swag — add ptraker.conf proxy-conf | ✅ Done |
| 4 | Production Supabase stack on Jupiter | ✅ Done |
| 5 | ptraker-api Dockerfile + .dockerignore | ✅ Done |
| 6 | ptraker-client Dockerfile + nginx.conf | ✅ Done |
| 7 | deploy/docker-compose.yml (ptraker stack) | ✅ Done |
| 8 | GitHub Actions CI/CD workflows + versioning + deploy skill | ✅ Done (build/push only — Dockhand handles deploy) |
| 9 | schema_additions.sql | ✅ Done |
| 10 | First deployment + smoke test | ✅ Done |

### Swag Notes (Steps 2–3)
- Swag proxy-conf: `deploy/swag/ptraker.subdomain.conf` → `/data/proxy/letsencrypt/config/nginx/proxy-confs/ptraker.subdomain.conf`
- Uses `$upstream_app` variable pattern + `include /config/nginx/resolver.conf` so nginx starts cleanly even before ptraker containers exist
- `listen 443 ssl; http2 on;` — the `http2` directive must be separate (not in listen) on this nginx version
- `ssl_stapling off` must NOT appear in proxy-confs — it's already set in ssl.conf (duplicate causes fatal error)

### Swag Notes (Step 2 — cert)
- Cert at `/config/etc/letsencrypt/live/theschoepels.com/fullchain.pem` (and symlinked at `/config/keys/letsencrypt/`)
- Covers theschoepels.com + 9 subdomains + ptraker.com + www/api/supabase.ptraker.com (14 domains total)
- Expires 2026-08-18
- Several nginx sample files are newer than the installed versions (ssl.conf, bookstack/nextcloud/ntfy/portainer subdomain confs, default.conf, nginx.conf). The hardening customizations in ssl.conf must be preserved — review/merge before updating those files.
- `/config/nginx/site-confs/default.conf.old` is safe to delete (nginx ignores non-.conf files)
- To verify cert SANs: `docker exec swag openssl x509 -in /config/etc/letsencrypt/live/theschoepels.com/fullchain.pem -noout -text | grep -A2 "Subject Alternative"`

### Supabase Notes (Step 4)
- Stack deployed at `/data/supabase-ptraker/` on jupiter-r640
- Studio: SSH tunnel only — `ssh -p 22791 -L 3002:localhost:3002 dschoepel@10.0.10.50` → http://localhost:3002 (no additional login — SSH is the auth)
- Kong container: `ptraker-supabase-kong` on `supabase-ptraker_default` and `ptraker-supabase` networks (no proxy_net)
- `VAULT_ENC_KEY` must be exactly 32 bytes — use `secrets.token_hex(16)` not `token_urlsafe(32)` (43 chars breaks AES-256-GCM)
- `docker compose restart` does NOT pick up `.env` changes — use `docker compose up -d --force-recreate <service>`
- Schema: run `schema.sql` then `schema_additions.sql` in Studio SQL Editor (one-time)
- `pg_dump` from the Supabase PostgreSQL image returns empty for public schema — tables are owned by `supabase_admin` but dump is empty due to Supabase image quirk; use `psql \dt` to verify tables exist instead
- Swag proxy-conf had wrong container name (`supabase-ptraker-kong` instead of `ptraker-supabase-kong`) — fix: `sed -i 's/supabase-ptraker-kong/ptraker-supabase-kong/g'` on the conf file

### First-User Bootstrap Notes (Step 10)
- Studio "Create user" fails with `bad_jwt` — Studio's SERVICE_ROLE_KEY was truncated (2 parts); fix: run `deploy/supabase/gen-service-key.py` on Jupiter to regenerate from existing JWT_SECRET, update both `/data/supabase-ptraker/.env` and `/data/ptraker/.env`, force-recreate kong + studio + api
- First user must be created via Studio SQL Editor (GoTrue admin API unusable until Studio key is fixed): insert into `auth.users` with `confirmation_token=''`, `recovery_token=''`, `email_change_token_new=''`, `email_change=''` — NULL in any of those columns causes `500: Database error querying schema` on login
- Set `raw_user_meta_data` to `{"display_name":"Dave","intended_role":"admin"}` so `handle_new_user` trigger creates profile with role='admin'
- `SUPABASE_SERVICE_KEY` truncated (1 dot instead of 2) → `@supabase/supabase-js` throws "Expected 3 parts in JWT; got 2" on first admin client query — regenerate with `gen-service-key.py`
- Vite build on Linux is case-sensitive: `import from "./store/authContext"` fails if file is `AuthContext.jsx` — Windows silently accepts wrong case; fix imports before first deploy
- `generate-secrets.py` produces valid 3-part JWTs; truncation happens during copy-paste from terminal to `.env` file — always verify with `grep KEY .env | cut -d= -f2 | tr -cd '.' | wc -c` (must be 2)

### DNS Notes (Step 1)
- `ptraker.com` and `*.ptraker.com` point to Earth (the nginx reverse proxy host); Earth forwards to jupiter-r640 (10.0.10.50) internally
- CAA records on ptraker.com, api.ptraker.com, supabase.ptraker.com restricting issuance to letsencrypt.org only
- DNS provider: DYNU

### jupiter-r640 Host Notes
- LAN address: 10.0.10.50, SSH port 22791, user dschoepel
- No Swag — TLS termination and reverse proxy handled by nginx on Earth
- nginx on Earth proxies: `ptraker.com` → `10.0.10.50:5001`, `api.ptraker.com` → `10.0.10.50:5000`, `supabase.ptraker.com` → `10.0.10.50:8100`
- Compose files (local source of truth): `e:\schoepels-services\jupiter-r640\ptraker\` and `e:\schoepels-services\jupiter-r640\supabase-ptraker\`
- Compose files on server: `/data/ptraker/` and `/data/supabase-ptraker/`
- CI/CD builds image and pushes to GHCR; Dockhand detects the new image and notifies — no SSH deploy step
- ptraker-api reaches Kong via the `ptraker-supabase` Docker network (shared between both stacks)
