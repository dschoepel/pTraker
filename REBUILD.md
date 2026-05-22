# portfolioTraker — Rebuild From Scratch

Complete step-by-step runbook for rebuilding the full ptraker stack on a fresh VPS
(or recovering after a catastrophic failure).

**Assumptions:**
- Target VPS is Jupiter at 142.202.190.9 running Ubuntu 24.04
- `/data` is restored from Urbackup (or being rebuilt fresh)
- GitHub repos exist at github.com/dschoepel/ptraker-api and ptraker-client
- DNS at DYNU is already pointing ptraker.com → 142.202.190.9

---

## Recovery vs Rebuild

| Scenario | What you need |
|---|---|
| **DB restore only** (data loss, OS intact) | Steps 5c–5d only — restore pg_dump into running Supabase |
| **App containers only** (bad deploy) | Steps 7–8 only — re-pull and restart ptraker stack |
| **Full VPS rebuild** | All steps in order |
| **New VPS** | All steps in order |

---

## Step 1 — VPS Prerequisites

These are already done on Jupiter. Verify before proceeding on a new machine.

```bash
# Docker
docker --version       # should be 26+
docker compose version # should be 2.x

# UFW
sudo ufw status
# Expected open ports: 80/tcp, 443/tcp, 22791/tcp

# fail2ban (host SSH protection)
sudo fail2ban-client status sshd

# WireGuard (VPN back to home LAN)
sudo wg show
```

**If rebuilding on a new VPS:**
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# UFW rules
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22791/tcp
sudo ufw enable

# fail2ban
sudo apt install fail2ban
sudo nano /etc/fail2ban/jail.local   # see jupiter-vps-security-hardening.md
```

See `jupiter-vps-security-hardening.md` for full WireGuard and security config.

---

## Step 2 — Docker Networks

The Swag proxy stack creates `proxy_net`. If restoring Swag from Urbackup, start Swag
first — it will create the network. If building fresh:

```bash
docker network create proxy_net
```

Verify:
```bash
docker network ls | grep proxy_net
```

---

## Step 3 — DNS (DYNU)

Already configured. If rebuilding with a new IP, update at https://dynu.com:

| Record | Type | Value |
|---|---|---|
| `ptraker.com` | A | 142.202.190.9 |
| `*.ptraker.com` | A | 142.202.190.9 (wildcard — covers all subdomains) |
| `ptraker.com` | CAA | letsencrypt.org only |
| `api.ptraker.com` | CAA | letsencrypt.org only |
| `supabase.ptraker.com` | CAA | letsencrypt.org only |

---

## Step 4 — Swag (Reverse Proxy + SSL)

**If restoring from Urbackup:** Swag config is under `/data/proxy/` — restore that
directory and start the Swag stack. The ptraker proxy conf is already in place.

**If rebuilding fresh:**

1. Start the Swag stack (Portainer or `docker compose up -d` in `/data/proxy/`)
2. Copy the ptraker nginx proxy conf (stored in ptraker-api repo):
   ```bash
   # The conf is in the ptraker-api repo at deploy/swag/ptraker.subdomain.conf
   # Also backed up at /data/proxy/letsencrypt/config/nginx/proxy-confs/ptraker.subdomain.conf
   sudo cp ptraker.subdomain.conf \
     /data/proxy/letsencrypt/config/nginx/proxy-confs/ptraker.subdomain.conf
   docker exec swag nginx -t
   docker exec swag nginx -s reload
   ```

The conf handles three domains:
- `ptraker.com` / `www.ptraker.com` → `ptraker-client:80`
- `api.ptraker.com` → `ptraker-api:5000`
- `supabase.ptraker.com` → `ptraker-supabase-kong:8000`

**SSL:** Cert at `/config/keys/letsencrypt/fullchain.pem` covers ptraker.com and
subdomains as part of the theschoepels.com cert (SAN). Current cert expires 2026-08-18.
See the root CLAUDE.md Swag notes for renewal gotchas.

---

## Step 5 — Production Supabase Stack

### 5a. Directory and files

**If restoring from Urbackup:** `/data/supabase-ptraker/` is fully restored including
`.env`, `docker-compose.yml`, `keyscript.sh`, and `volumes/`. Skip to step 5c.

**If rebuilding fresh:**

```bash
mkdir -p /data/supabase-ptraker
cd /data/supabase-ptraker
```

Create `/data/supabase-ptraker/docker-compose.yml` with the following content:

```yaml
# =============================================================================
# ptraker — Supabase Slim Stack (PRODUCTION — Jupiter VPS)
# =============================================================================
# Derived from the dev slim stack on Mercury (10.0.10.60).
#
# Production changes from dev:
#   - Kong: host port bindings REMOVED — Swag reaches via proxy_net
#   - Kong: joined to proxy_net so Swag container can reach ptraker-supabase-kong:8000
#   - Studio: restricted to 127.0.0.1:3002 (SSH tunnel access only)
#   - Supavisor: postgres/pooler ports restricted to 127.0.0.1 (not public)
#   - Auth: GOTRUE_API_EXTERNAL_URL changed from Mercury URL to https://supabase.ptraker.com
#   - Networks section added: proxy_net external
#
# Deploy to Jupiter: /data/supabase-ptraker/
# Volume files: copy from Mercury /data/supabase-ptraker/volumes/ (excluding db/data/)
#
# First run:
#   cd /data/supabase-ptraker && docker compose up -d
#
# Studio access (SSH tunnel from dev machine):
#   ssh -p 22791 -L 3002:localhost:3002 dschoepel@142.202.190.9
#   then open http://localhost:3002
# =============================================================================

name: supabase-ptraker

services:

  db:
    container_name: ptraker-supabase-db
    image: supabase/postgres:15.8.1.085
    restart: unless-stopped
    volumes:
      - ./volumes/db/realtime.sql:/docker-entrypoint-initdb.d/migrations/99-realtime.sql:Z
      - ./volumes/db/webhooks.sql:/docker-entrypoint-initdb.d/init-scripts/98-webhooks.sql:Z
      - ./volumes/db/roles.sql:/docker-entrypoint-initdb.d/init-scripts/99-roles.sql:Z
      - ./volumes/db/jwt.sql:/docker-entrypoint-initdb.d/init-scripts/99-jwt.sql:Z
      - ./volumes/db/data:/var/lib/postgresql/data:Z
      - ./volumes/db/_supabase.sql:/docker-entrypoint-initdb.d/migrations/97-_supabase.sql:Z
      - ./volumes/db/logs.sql:/docker-entrypoint-initdb.d/migrations/99-logs.sql:Z
      - ./volumes/db/pooler.sql:/docker-entrypoint-initdb.d/migrations/99-pooler.sql:Z
      - db-config:/etc/postgresql-custom
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres", "-h", "localhost"]
      interval: 5s
      timeout: 5s
      retries: 10
    environment:
      POSTGRES_HOST: /var/run/postgresql
      PGPORT: ${POSTGRES_PORT}
      POSTGRES_PORT: ${POSTGRES_PORT}
      PGPASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      PGDATABASE: ${POSTGRES_DB}
      POSTGRES_DB: ${POSTGRES_DB}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXP: ${JWT_EXPIRY}
    command:
      [
        "postgres",
        "-c", "config_file=/etc/postgresql/postgresql.conf",
        "-c", "log_min_messages=fatal"
      ]

  studio:
    container_name: ptraker-supabase-studio
    image: supabase/studio:2026.02.16-sha-26c615c
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD", "node", "-e",
          "fetch('http://studio:3000/api/platform/profile').then((r) => {if (r.status !== 200) throw new Error(r.status)})"
        ]
      timeout: 10s
      interval: 5s
      retries: 3
    ports:
      - 127.0.0.1:3002:3000   # localhost only — access via SSH tunnel
    depends_on:
      db:
        condition: service_healthy
    environment:
      HOSTNAME: "::"
      STUDIO_PG_META_URL: http://ptraker-supabase-meta:8080
      POSTGRES_PORT: ${POSTGRES_PORT}
      POSTGRES_HOST: ${POSTGRES_HOST}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      PG_META_CRYPTO_KEY: ${PG_META_CRYPTO_KEY}
      DEFAULT_ORGANIZATION_NAME: ${STUDIO_DEFAULT_ORGANIZATION}
      DEFAULT_PROJECT_NAME: ${STUDIO_DEFAULT_PROJECT}
      OPENAI_API_KEY: ${OPENAI_API_KEY:-}
      SUPABASE_URL: http://ptraker-supabase-kong:8000
      SUPABASE_PUBLIC_URL: ${SUPABASE_PUBLIC_URL}
      SUPABASE_ANON_KEY: ${ANON_KEY}
      SUPABASE_SERVICE_KEY: ${SERVICE_ROLE_KEY}
      AUTH_JWT_SECRET: ${JWT_SECRET}
      LOGFLARE_API_KEY: ${LOGFLARE_PUBLIC_ACCESS_TOKEN}
      LOGFLARE_PUBLIC_ACCESS_TOKEN: ${LOGFLARE_PUBLIC_ACCESS_TOKEN}
      LOGFLARE_PRIVATE_ACCESS_TOKEN: ${LOGFLARE_PRIVATE_ACCESS_TOKEN}
      LOGFLARE_URL: http://analytics:4000
      NEXT_PUBLIC_ENABLE_LOGS: false
      NEXT_ANALYTICS_BACKEND_PROVIDER: postgres
      SNIPPETS_MANAGEMENT_FOLDER: /app/snippets
      EDGE_FUNCTIONS_MANAGEMENT_FOLDER: /app/edge-functions
    volumes:
      - ./volumes/snippets:/app/snippets:Z
      - ./volumes/functions:/app/edge-functions:Z

  kong:
    container_name: ptraker-supabase-kong
    image: kong:2.8.1
    restart: unless-stopped
    # No host port bindings — Swag reaches this container via proxy_net
    # Dev had: - ${KONG_HTTP_PORT}:8000/tcp and - ${KONG_HTTPS_PORT}:8443/tcp
    volumes:
      - ./volumes/api/kong.yml:/home/kong/temp.yml:ro,z
    depends_on:
      db:
        condition: service_healthy
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /home/kong/kong.yml
      KONG_DNS_ORDER: LAST,A,CNAME
      KONG_PLUGINS: request-transformer,cors,key-auth,acl,basic-auth,request-termination,ip-restriction
      KONG_NGINX_PROXY_PROXY_BUFFER_SIZE: 160k
      KONG_NGINX_PROXY_PROXY_BUFFERS: 64 160k
      SUPABASE_ANON_KEY: ${ANON_KEY}
      SUPABASE_SERVICE_KEY: ${SERVICE_ROLE_KEY}
      DASHBOARD_USERNAME: ${DASHBOARD_USERNAME}
      DASHBOARD_PASSWORD: ${DASHBOARD_PASSWORD}
    entrypoint: bash -c 'eval "echo \"$(cat ~/temp.yml)\"" > ~/kong.yml && /docker-entrypoint.sh kong docker-start'
    networks:
      - default
      - proxy_net   # Swag reaches ptraker-supabase-kong:8000 via this network

  auth:
    container_name: ptraker-supabase-auth
    image: supabase/gotrue:v2.186.0
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:9999/health"]
      timeout: 5s
      interval: 5s
      retries: 3
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./volumes/templates:/templates:ro
    environment:
      GOTRUE_API_HOST: 0.0.0.0
      GOTRUE_API_PORT: 9999
      API_EXTERNAL_URL: ${API_EXTERNAL_URL}
      GOTRUE_DB_DRIVER: postgres
      GOTRUE_DB_DATABASE_URL: postgres://supabase_auth_admin:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
      GOTRUE_SITE_URL: ${SITE_URL}
      GOTRUE_URI_ALLOW_LIST: ${ADDITIONAL_REDIRECT_URLS}
      GOTRUE_DISABLE_SIGNUP: ${DISABLE_SIGNUP}
      GOTRUE_JWT_ADMIN_ROLES: service_role
      GOTRUE_JWT_AUD: authenticated
      GOTRUE_JWT_DEFAULT_GROUP_NAME: authenticated
      GOTRUE_JWT_EXP: ${JWT_EXPIRY}
      GOTRUE_JWT_SECRET: ${JWT_SECRET}
      GOTRUE_EXTERNAL_EMAIL_ENABLED: ${ENABLE_EMAIL_SIGNUP}
      GOTRUE_EXTERNAL_ANONYMOUS_USERS_ENABLED: ${ENABLE_ANONYMOUS_USERS}
      GOTRUE_MAILER_AUTOCONFIRM: ${ENABLE_EMAIL_AUTOCONFIRM}
      GOTRUE_SMTP_ADMIN_EMAIL: ${SMTP_ADMIN_EMAIL}
      GOTRUE_SMTP_HOST: ${SMTP_HOST}
      GOTRUE_SMTP_PORT: ${SMTP_PORT}
      GOTRUE_SMTP_USER: ${SMTP_USER}
      GOTRUE_SMTP_PASS: ${SMTP_PASS}
      GOTRUE_SMTP_SENDER_NAME: ${SMTP_SENDER_NAME}
      GOTRUE_MAILER_URLPATHS_INVITE: ${MAILER_URLPATHS_INVITE}
      GOTRUE_MAILER_URLPATHS_CONFIRMATION: ${MAILER_URLPATHS_CONFIRMATION}
      GOTRUE_MAILER_URLPATHS_RECOVERY: ${MAILER_URLPATHS_RECOVERY}
      GOTRUE_MAILER_URLPATHS_EMAIL_CHANGE: ${MAILER_URLPATHS_EMAIL_CHANGE}
      GOTRUE_EXTERNAL_PHONE_ENABLED: ${ENABLE_PHONE_SIGNUP}
      GOTRUE_SMS_AUTOCONFIRM: ${ENABLE_PHONE_AUTOCONFIRM}
      GOTRUE_EXTERNAL_GOOGLE_ENABLED: ${GOOGLE_ENABLED}
      GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOTRUE_EXTERNAL_GOOGLE_SECRET: ${GOOGLE_SECRET}
      GOTRUE_MAILER_EXTERNAL_HOSTS: ${GOTRUE_MAILER_EXTERNAL_HOSTS}
      GOTRUE_API_EXTERNAL_URL: https://supabase.ptraker.com   # prod: was http://10.0.10.60:8100

  rest:
    container_name: ptraker-supabase-rest
    image: postgrest/postgrest:v14.5
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      PGRST_DB_URI: postgres://authenticator:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
      PGRST_DB_SCHEMAS: ${PGRST_DB_SCHEMAS}
      PGRST_DB_ANON_ROLE: anon
      PGRST_JWT_SECRET: ${JWT_SECRET}
      PGRST_DB_USE_LEGACY_GUCS: "false"
      PGRST_APP_SETTINGS_JWT_SECRET: ${JWT_SECRET}
      PGRST_APP_SETTINGS_JWT_EXP: ${JWT_EXPIRY}
    command: ["postgrest"]

  storage:
    container_name: ptraker-supabase-storage
    image: supabase/storage-api:v1.37.8
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
      rest:
        condition: service_started
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://storage:5000/status"]
      timeout: 5s
      interval: 5s
      retries: 3
    environment:
      ANON_KEY: ${ANON_KEY}
      SERVICE_KEY: ${SERVICE_ROLE_KEY}
      POSTGREST_URL: http://ptraker-supabase-rest:3000
      PGRST_JWT_SECRET: ${JWT_SECRET}
      DATABASE_URL: postgres://supabase_storage_admin:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
      REQUEST_ALLOW_X_FORWARDED_PATH: "true"
      FILE_SIZE_LIMIT: 52428800
      STORAGE_BACKEND: file
      GLOBAL_S3_BUCKET: ${GLOBAL_S3_BUCKET}
      FILE_STORAGE_BACKEND_PATH: /var/lib/storage
      TENANT_ID: ${STORAGE_TENANT_ID}
      REGION: ${REGION}
      ENABLE_IMAGE_TRANSFORMATION: "false"
      S3_PROTOCOL_ACCESS_KEY_ID: ${S3_PROTOCOL_ACCESS_KEY_ID}
      S3_PROTOCOL_ACCESS_KEY_SECRET: ${S3_PROTOCOL_ACCESS_KEY_SECRET}
    volumes:
      - ./volumes/storage:/var/lib/storage:z

  meta:
    container_name: ptraker-supabase-meta
    image: supabase/postgres-meta:v0.95.2
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      PG_META_PORT: 8080
      PG_META_DB_HOST: ${POSTGRES_HOST}
      PG_META_DB_PORT: ${POSTGRES_PORT}
      PG_META_DB_NAME: ${POSTGRES_DB}
      PG_META_DB_USER: supabase_admin
      PG_META_DB_PASSWORD: ${POSTGRES_PASSWORD}
      CRYPTO_KEY: ${PG_META_CRYPTO_KEY}

  supavisor:
    container_name: ptraker-supabase-pooler
    image: supabase/supavisor:2.7.4
    restart: unless-stopped
    ports:
      - 127.0.0.1:${POSTGRES_PORT}:5432           # localhost only — direct DB access via SSH tunnel
      - 127.0.0.1:${POOLER_PROXY_PORT_TRANSACTION}:6543  # localhost only
    volumes:
      - ./volumes/pooler/pooler.exs:/etc/pooler/pooler.exs:ro,z
    healthcheck:
      test: ["CMD", "curl", "-sSfL", "--head", "-o", "/dev/null", "http://127.0.0.1:4000/api/health"]
      interval: 10s
      timeout: 5s
      retries: 5
    depends_on:
      db:
        condition: service_healthy
    environment:
      PORT: 4000
      POSTGRES_PORT: ${POSTGRES_PORT}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASE_URL: ecto://supabase_admin:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/_supabase
      CLUSTER_POSTGRES: true
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
      VAULT_ENC_KEY: ${VAULT_ENC_KEY}
      API_JWT_SECRET: ${JWT_SECRET}
      METRICS_JWT_SECRET: ${JWT_SECRET}
      REGION: local
      ERL_AFLAGS: -proto_dist inet_tcp
      POOLER_TENANT_ID: ${POOLER_TENANT_ID}
      POOLER_DEFAULT_POOL_SIZE: ${POOLER_DEFAULT_POOL_SIZE}
      POOLER_MAX_CLIENT_CONN: ${POOLER_MAX_CLIENT_CONN}
      POOLER_POOL_MODE: transaction
      DB_POOL_SIZE: ${POOLER_DB_POOL_SIZE}
    command:
      [
        "/bin/sh", "-c",
        "/app/bin/migrate && /app/bin/supavisor eval \"$(cat /etc/pooler/pooler.exs)\" && /app/bin/server"
      ]

volumes:
  db-config:

networks:
  proxy_net:
    external: true
```

### 5b. Generate secrets (fresh build only)

**Critical:** `JWT_SECRET` and `VAULT_ENC_KEY` must each be exactly 32 bytes.
Use `token_hex(16)` — NOT `token_urlsafe(32)` (that produces 43 chars, breaks AES-256-GCM).

```bash
# Generate JWT_SECRET and VAULT_ENC_KEY (32-char hex = exactly 32 bytes)
python3 -c "import secrets; print(secrets.token_hex(16))"

# Generate ANON_KEY and SERVICE_ROLE_KEY (JWTs signed with JWT_SECRET)
# Use keyscript.sh on Jupiter:
bash /data/supabase-ptraker/keyscript.sh
# Or use gen-service-key.py if keyscript.sh not available

# Verify generated JWTs have exactly 3 parts (2 dots):
echo "YOUR_ANON_KEY" | tr -cd '.' | wc -c   # must print 2
echo "YOUR_SERVICE_KEY" | tr -cd '.' | wc -c # must print 2
```

### 5c. `.env` file — required variables

Create `/data/supabase-ptraker/.env` with all of the following:

```bash
# --- Core secrets (generate with keyscript.sh) ---
JWT_SECRET=<32-byte hex string>
ANON_KEY=<JWT signed with JWT_SECRET, role: anon>
SERVICE_ROLE_KEY=<JWT signed with JWT_SECRET, role: service_role>
VAULT_ENC_KEY=<32-byte hex string — separate from JWT_SECRET>
SECRET_KEY_BASE=<long random string>

# --- PostgreSQL ---
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_PASSWORD=<strong password>

# --- Public URLs ---
API_EXTERNAL_URL=https://supabase.ptraker.com
SUPABASE_PUBLIC_URL=https://supabase.ptraker.com
SITE_URL=https://ptraker.com

# --- GoTrue auth settings ---
DISABLE_SIGNUP=false
ENABLE_EMAIL_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=false    # MUST be false — required for proper invite flow
ENABLE_ANONYMOUS_USERS=false
ENABLE_PHONE_SIGNUP=false
ENABLE_PHONE_AUTOCONFIRM=false
ADDITIONAL_REDIRECT_URLS=
MAILER_URLPATHS_INVITE=/auth/v1/verify
MAILER_URLPATHS_CONFIRMATION=/auth/v1/verify
MAILER_URLPATHS_RECOVERY=/auth/v1/verify
MAILER_URLPATHS_EMAIL_CHANGE=/auth/v1/verify
GOTRUE_MAILER_EXTERNAL_HOSTS=

# --- SMTP (nodemailer fallback — GoTrue v2.186 bug skips its own emails) ---
SMTP_HOST=theschoepels-com-smtp.dynu.com
SMTP_PORT=587
SMTP_USER=dave@theschoepels.com
SMTP_PASS=<smtp password>
SMTP_SENDER_NAME=portfolioTraker
SMTP_ADMIN_EMAIL=dave@theschoepels.com

# --- Studio ---
DASHBOARD_USERNAME=<studio login username>
DASHBOARD_PASSWORD=<studio login password>
STUDIO_DEFAULT_ORGANIZATION=ptraker
STUDIO_DEFAULT_PROJECT=ptraker

# --- Kong ports (internal only — Swag proxies externally) ---
KONG_HTTP_PORT=8000
KONG_HTTPS_PORT=8443

# --- Connection pooler ---
POOLER_TENANT_ID=ptraker
POOLER_DB_POOL_SIZE=10
POOLER_DEFAULT_POOL_SIZE=20
POOLER_MAX_CLIENT_CONN=100
POOLER_PROXY_PORT_TRANSACTION=6543

# --- Storage ---
STORAGE_TENANT_ID=ptraker
REGION=us-east-1
IMGPROXY_ENABLE_WEBP_DETECTION=true

# --- Misc ---
DOCKER_SOCKET_LOCATION=/var/run/docker.sock
PGRST_DB_SCHEMAS=public,storage,graphql_public
PG_META_CRYPTO_KEY=<random string>
JWT_EXPIRY=3600

# --- Google OAuth (disabled) ---
GOOGLE_ENABLED=false
GOOGLE_CLIENT_ID=
GOOGLE_SECRET=
GOOGLE_PROJECT_ID=
GOOGLE_PROJECT_NUMBER=

# --- Logflare (disabled) ---
LOGFLARE_PUBLIC_ACCESS_TOKEN=
LOGFLARE_PRIVATE_ACCESS_TOKEN=

# --- OpenAI (unused) ---
OPENAI_API_KEY=
```

**After creating `.env`, verify key integrity:**
```bash
grep -E 'ANON_KEY|SERVICE_ROLE_KEY' /data/supabase-ptraker/.env \
  | cut -d= -f2 | tr -cd '.' | wc -c
# Must print 4 (2 dots per key × 2 keys)
```

### 5d. Start the Supabase stack

```bash
cd /data/supabase-ptraker
docker compose up -d

# Verify all containers running
docker ps | grep ptraker-supabase
# Expected: ptraker-supabase-db, kong, auth, rest, storage, meta, pooler, studio
```

**Note:** `docker compose restart` does NOT pick up `.env` changes.
Always use `docker compose up -d --force-recreate <service>` after env changes.

### 5e. Access Studio

Studio is internal-only. Access via SSH tunnel:

```bash
ssh -p 22791 -L 3002:localhost:3002 dschoepel@142.202.190.9
# Then open http://localhost:3002 in browser
# No login screen — SSH is the auth
```

### 5f. Run database schema (fresh build only)

In Studio → SQL Editor, run these scripts **in order**:

1. `ptraker-api/docs/schema.sql` — core tables, views, RLS policies, triggers
2. `ptraker-api/docs/schema_additions.sql` — watchlist, portfolio_shares, role_requests, notifications
3. `ptraker-api/docs/schema_importers.sql` — importers table, user_importer_preferences, seed data

**If restoring from pg_dump backup:**
```bash
# Copy dump to host, then restore:
gunzip -c /data/database_dumps/postgres_ptraker-supabase-db_YYYY-MM-DD.sql.gz \
  | docker exec -i ptraker-supabase-db psql -U postgres
```

Verify tables exist after restore:
```bash
docker exec ptraker-supabase-db psql -U postgres -c "\dt public.*"
```

### 5g. Create first admin user (fresh build only)

Studio "Create user" UI may fail on a fresh install (`bad_jwt` error — truncated SERVICE_ROLE_KEY).
Use SQL instead via Studio SQL Editor:

```sql
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  raw_user_meta_data, role, aud, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'dave@theschoepels.com',
  crypt('YOUR_INITIAL_PASSWORD', gen_salt('bf')),
  now(),
  '', '', '', '',    -- these must be '' not NULL (NULL causes 500 on login)
  '{"display_name": "Dave", "intended_role": "admin"}',
  'authenticated', 'authenticated', now(), now()
);
```

The `handle_new_user` trigger fires automatically and creates the `profiles` row with `role='admin'`.

**If SERVICE_ROLE_KEY shows `bad_jwt`:**
```bash
# Regenerate from existing JWT_SECRET
python3 /data/supabase-ptraker/gen-service-key.py
# Update /data/supabase-ptraker/.env and /data/ptraker/.env
# Force-recreate kong, studio, auth:
cd /data/supabase-ptraker && docker compose up -d --force-recreate kong studio auth
```

---

## Step 6 — GitHub Repositories

Both repos exist and contain all source code, Dockerfiles, and CI/CD workflows.
No action needed unless starting from a different machine.

```bash
git clone https://github.com/dschoepel/ptraker-api
git clone https://github.com/dschoepel/ptraker-client
```

---

## Step 7 — GitHub Actions Secrets

Set these in each repo under Settings → Secrets → Actions:

### Both repos (SSH deploy access)

| Secret | Value |
|---|---|
| `SSH_HOST` | `142.202.190.9` |
| `SSH_USER` | `dschoepel` |
| `SSH_PORT` | `22791` |
| `SSH_PRIVATE_KEY` | Private key matching the authorized key on Jupiter |

### ptraker-client only (baked into build at tag time)

| Secret | Value |
|---|---|
| `VITE_API_URL` | `https://api.ptraker.com/api/v1` |
| `VITE_SUPABASE_URL` | `https://supabase.ptraker.com` |
| `VITE_SUPABASE_ANON_KEY` | Value of `ANON_KEY` from Supabase `.env` |

**Important:** `VITE_*` vars are baked into the client bundle at build time. If the
Supabase URL or anon key ever changes, update the GitHub secret AND re-tag to trigger
a new build.

---

## Step 8 — ptraker Application Stack

### 8a. Directory

```bash
mkdir -p /data/ptraker
```

**If restoring from Urbackup:** `/data/ptraker/` is fully restored including
`docker-compose.yml` and `.env`. Skip to step 8c.

### 8b. `docker-compose.yml`

File lives at `/data/ptraker/docker-compose.yml`:

```yaml
# =============================================================================
# ptraker — Application Stack (PRODUCTION — Jupiter VPS)
# =============================================================================
name: ptraker

services:
  api:
    image: ghcr.io/dschoepel/ptraker-api:latest
    container_name: ptraker-api
    restart: unless-stopped
    env_file: .env
    environment:
      NODE_ENV: production
      PORT: "5000"
      TZ: America/Chicago
      CLIENT_URL: https://ptraker.com
    networks:
      - proxy_net

  client:
    image: ghcr.io/dschoepel/ptraker-client:latest
    container_name: ptraker-client
    restart: unless-stopped
    networks:
      - proxy_net

networks:
  proxy_net:
    external: true
```

### 8c. `.env` file

Create `/data/ptraker/.env`:

```bash
# Supabase connection — use internal Kong URL (not public supabase.ptraker.com)
SUPABASE_URL=http://ptraker-supabase-kong:8000
SUPABASE_ANON_KEY=<value of ANON_KEY from supabase .env>
SUPABASE_SERVICE_KEY=<value of SERVICE_ROLE_KEY from supabase .env>

# SMTP — for invite and password reset emails (GoTrue v2.186 bug: all auth
# emails are silently skipped by GoTrue; the API sends them via nodemailer instead)
SMTP_HOST=theschoepels-com-smtp.dynu.com
SMTP_PORT=587
SMTP_USER=dave@theschoepels.com
SMTP_PASS=<smtp password>
SMTP_SENDER_NAME=portfolioTraker
SMTP_FROM_EMAIL=ptraker@theschoepels.com

# Price refresh schedule (weekdays 4pm CT)
PRICE_REFRESH_CRON=0 16 * * 1-5
```

### 8d. One-time: authenticate Jupiter to pull from GHCR

This is required once per VPS so Jupiter can pull the private container images.

```bash
# Create a GitHub Personal Access Token with read:packages scope
# at https://github.com/settings/tokens

docker login ghcr.io -u dschoepel -p YOUR_GITHUB_PAT
```

After this, the login credentials are cached in `/root/.docker/config.json` and
the GitHub Actions deploy workflow can pull images automatically.

### 8e. Pull and start

```bash
cd /data/ptraker
docker compose pull
docker compose up -d

# Verify
docker ps | grep ptraker
```

---

## Step 9 — First Deployment via CI/CD

The GitHub Actions workflows build Docker images on any `v*` tag push and
deploy to Jupiter automatically.

```bash
# From local dev machine (ptraker-api first, then client)
cd E:\ptraker\ptraker-api
git tag v1.3.1
git push origin main --tags

cd E:\ptraker\ptraker-client
git tag v1.4.2
git push origin main --tags
```

Monitor builds:
- https://github.com/dschoepel/ptraker-api/actions
- https://github.com/dschoepel/ptraker-client/actions

---

## Step 10 — Smoke Test

```bash
# Containers running
docker ps --format "table {{.Names}}\t{{.Status}}" | grep ptraker

# API health
curl https://api.ptraker.com/health

# Supabase Kong up (should return 401 — Kong is running, no auth provided)
curl -s -o /dev/null -w "%{http_code}" https://supabase.ptraker.com

# Client loads
curl -s -o /dev/null -w "%{http_code}" https://ptraker.com
```

Then in browser:
- https://ptraker.com — login works, dashboard loads with data
- https://api.ptraker.com/health — returns `{"status":"ok",...}`
- Admin page → Importers section → all 4 importers listed

---

## Backup Reference

### What Urbackup covers (runs 2:00 AM daily, after database dump at 1:00 AM)

| Path | Contents |
|---|---|
| `/data/supabase-ptraker/.env` | JWT secrets, Postgres password — critical |
| `/data/supabase-ptraker/docker-compose.yml` | Supabase stack definition |
| `/data/supabase-ptraker/volumes/` | Raw PostgreSQL data files (emergency fallback) |
| `/data/ptraker/.env` | API secrets |
| `/data/ptraker/docker-compose.yml` | ptraker stack definition |
| `/data/proxy/letsencrypt/config/nginx/proxy-confs/ptraker.subdomain.conf` | Swag nginx config |
| `/data/database_dumps/postgres_ptraker-supabase-db_*.sql.gz` | Clean pg_dumpall logical backup |

### Database dump script (runs at 1:00 AM via cron, before Urbackup)

`ptraker-supabase-db` is in the `POSTGRES_CONTAINERS` array in
`/usr/local/bin/backup-databases.sh`. The dump lands in
`/data/database_dumps/postgres_ptraker-supabase-db_YYYY-MM-DD.sql.gz`.

### Restore from pg_dump

```bash
# Find the most recent dump
ls -lt /data/database_dumps/postgres_ptraker-supabase-db_*.sql.gz | head -3

# Restore into running Supabase PostgreSQL container
gunzip -c /data/database_dumps/postgres_ptraker-supabase-db_YYYY-MM-DD.sql.gz \
  | docker exec -i ptraker-supabase-db psql -U postgres

# Verify
docker exec ptraker-supabase-db psql -U postgres -c "SELECT count(*) FROM public.profiles;"
```

---

## Key File Locations on Jupiter

| File | Path |
|---|---|
| Supabase stack compose | `/data/supabase-ptraker/docker-compose.yml` |
| Supabase env + secrets | `/data/supabase-ptraker/.env` |
| JWT key generator | `/data/supabase-ptraker/keyscript.sh` |
| ptraker stack compose | `/data/ptraker/docker-compose.yml` |
| ptraker env | `/data/ptraker/.env` |
| Swag nginx proxy conf | `/data/proxy/letsencrypt/config/nginx/proxy-confs/ptraker.subdomain.conf` |
| Database dumps | `/data/database_dumps/postgres_ptraker-supabase-db_*.sql.gz` |
| Backup script | `/usr/local/bin/backup-databases.sh` |
| Backup log | `/var/log/database-dumps.log` |

---

## Critical Gotchas (learned the hard way)

1. **JWT key length** — `VAULT_ENC_KEY` and `JWT_SECRET` must be exactly 32 bytes.
   Use `python3 -c "import secrets; print(secrets.token_hex(16))"`.
   `token_urlsafe(32)` produces 43 chars and silently breaks AES-256-GCM.

2. **JWT parts** — always verify generated JWTs have exactly 3 parts:
   `echo "YOUR_KEY" | tr -cd '.' | wc -c` must print `2`.
   Truncation during copy-paste is the #1 cause of `bad_jwt` errors.

3. **First user SQL** — `confirmation_token`, `recovery_token`, `email_change_token_new`,
   `email_change` must be `''` (empty string), NOT NULL. NULL in any of these causes
   `500: Database error querying schema` on every login attempt.

4. **GoTrue email bug** — GoTrue v2.186 silently skips ALL outgoing emails (invite,
   recovery, confirmation). The API sends all auth emails via nodemailer. Do not
   disable or reconfigure the nodemailer SMTP settings expecting GoTrue to take over.

5. **`ENABLE_EMAIL_AUTOCONFIRM=false`** — must stay false. Setting it true breaks
   the invite flow (new users would be confirmed before they set a password).

6. **`.env` changes** — `docker compose restart` does NOT reload `.env`.
   Use `docker compose up -d --force-recreate <service>`.

7. **Vite env vars** — `VITE_*` variables are baked into the client bundle at build
   time. Changing them in GitHub Actions secrets only takes effect after a new tag push.

8. **Case-sensitive imports on Linux** — `import from "./store/authContext"` fails if
   the file is `AuthContext.jsx`. Windows silently accepts wrong case; Linux Docker
   does not. Ensure all imports match exact filename casing.
