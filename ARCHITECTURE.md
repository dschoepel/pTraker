# portfolioTraker — Architecture & Developer Guide

## Overview

Personal investment portfolio tracker for Dave Schoepel.
Tracks $XM across 12 accounts at LPL Financial, Community First CU, and Associated Bank.

## Repositories

- **API**: https://github.com/dschoepel/ptraker-api
- **Client**: https://github.com/dschoepel/ptraker-client

---

## System Architecture

```
┌─────────────────────────────────────────────────┐
│  Browser (React 19 / Vite / Ant Design v6)       │
│  ptraker-client — localhost:5173 (dev)           │
└──────────────────┬──────────────────────────────┘
                   │ Axios (JWT Bearer)
┌──────────────────▼──────────────────────────────┐
│  Express 4 API — localhost:5000 (dev)            │
│  ptraker-api                                      │
│  ├── controllers/   routes/   middleware/         │
│  ├── importers/     services/  utils/             │
└──────────────────┬──────────────────────────────┘
                   │ Supabase JS v2
┌──────────────────▼──────────────────────────────┐
│  Supabase (self-hosted, Mercury 10.0.10.60)      │
│  Kong: 8100  │  Postgres: 5434  │  Studio: 3002  │
└─────────────────────────────────────────────────┘
```

---

## Database Schema

### Core Tables

**profiles**

```sql
id uuid PK (= auth.users.id)
display_name text
role text CHECK ('user','admin','viewer')
notification_settings jsonb
discoverable boolean DEFAULT false
```

**accounts**

```sql
id uuid PK
user_id uuid FK auth.users
name text
institution text  -- lpl, cfcu, associated, manual, other
type text         -- brokerage, retirement, checking, savings, other
account_number_last4 text
is_active boolean DEFAULT true
notes text
```

**positions**

```sql
id uuid PK
user_id uuid FK
account_id uuid FK accounts
ticker text
asset_name text
asset_type text   -- stock, etf, mutual_fund, cash
shares numeric
cost_basis numeric NOT NULL DEFAULT 0
as_of_date date
UNIQUE(account_id, ticker)
```

**price_cache**

```sql
ticker text PK
price numeric
price_as_of timestamptz
updated_at timestamptz
```

CASH ticker always = $1.00

**import_history**

```sql
id uuid PK
user_id uuid FK
account_id uuid FK
filename text
file_format text CHECK ('csv','qfx','ofx','manual')
institution text
status text CHECK ('success','partial','failed')
rows_parsed integer
rows_imported integer
rows_skipped integer
error_detail text
as_of_date date
imported_at timestamptz
```

**watchlist**, **portfolio_shares**, **user_invites**, **role_requests** — see CLAUDE.md

### Views (security_invoker=true)

- `portfolio_summary` — positions with current prices, gain/loss calculated
- `account_summary` — per-account totals, position count, last imported
- `net_worth_summary` — grand totals for the user

---

## API Architecture

### Authentication Flow

1. Client calls POST /auth/login → Express validates with Supabase
2. JWT stored in localStorage (`ptraker_token`)
3. Axios interceptor injects `Authorization: Bearer <token>` on every request
4. 401 response triggers automatic token refresh via refresh_token
5. API middleware verifies JWT on every protected route

### GoTrue Email Bug Workaround

GoTrue v2.186 silently skips ALL outgoing emails. Both invite and password reset
use `admin.auth.generateLink()` + nodemailer:

```javascript
const { data } = await admin.auth.generateLink({ type: 'invite', email, options });
const link = data.properties.action_link.replace(/^https:\/\/10\.0\.10\.60\//, 'http://10.0.10.60:8100/');
// Send link via nodemailer
```

---

## Import Pipeline

### Flow

```
File/Manual Input
       │
       ▼
  Importer.parseMulti(buffer)
  → { accounts: [{ acctId, positions[] }], errors[] }
       │
       ▼
  matchAccounts(parsedAccounts, dbAccounts)
  → match by last-4 of account number
       │
       ▼
  upsertPositions() per matched account
  ├── OFX/QFX: preserve existing cost_basis
  ├── CSV/Manual: full upsert including cost_basis
  └── sync-delete if syncMode=true
       │
       ▼
  fetchPricesForTickers() — Yahoo Finance
       │
       ▼
  insert import_history row
```

### Importer Types

| ID         | Source          | Multi-Account | Format                        |
| ---------- | --------------- | ------------- | ----------------------------- |
| `lpl_csv`  | LPL Financial   | ✅            | CSV with quoted newlines      |
| `ofx_qfx`  | Any institution | ✅            | OFX SGML — investment + bank  |
| `cfcu_csv` | CFCU            | ❌            | Transaction CSV, uses balance |
| `manual`   | UI form         | ❌            | Cash balance or market value  |

### OFX Parser — Dual Mode

The generic OFX parser detects file type automatically:

- `<INVSTMTMSGSRSV1>` → investment positions from `<INVPOSLIST>`
- `<BANKMSGSRSV1>` → bank balance from `<LEDGERBAL>` as CASH position

---

## Frontend Architecture

### State Management

No Redux/Zustand — React Context for auth only.
All other state is local component state + API calls.

### Auth Context (3-file pattern for Fast Refresh)

```
src/store/context.js      — createContext
src/store/AuthContext.jsx  — Provider with session management
src/store/useAuth.js       — useContext hook
```

### Service Layer

```
src/services/api.js              — Axios instance + interceptors
src/services/auth.service.js     — Supabase auth client (supabaseAuth)
src/services/dashboard.service.js — dashboardService, accountService,
                                    positionService, importService,
                                    priceService, watchlistService
src/services/admin.service.js    — adminService, sharesService, userService
```

### Page Structure

```
Dashboard
├── SummaryCards (net worth stats)
├── Tabs
│   ├── My Portfolio → PortfolioView
│   │   ├── FilterPanel (institution, account, sort)
│   │   └── Account Collapse panels → positions table
│   ├── Analytics → AnalyticsView
│   │   ├── By Institution (donut + gain/loss bar)
│   │   ├── By Account Type (donut)
│   │   └── Cash & Liquidity (bar + total callout)
│   └── [Shared portfolios if any]
│
Accounts
├── Desktop: expandable Table
└── Mobile: card list with tap-to-expand
│
Import
├── Step 1: Select Institution
├── Step 2: Upload File (or Manual Form)
└── Step 3: Results + Account Breakdown
│
Watchlist — ticker list with 30-day sparklines
Profile — privacy, sharing, upgrade request, export, delete account
Admin — user management, invites, role requests, notification settings
```

---

## User Roles

| Role   | Accounts | Import | Watchlist | Settings | Admin |
| ------ | -------- | ------ | --------- | -------- | ----- |
| admin  | ✅       | ✅     | ✅        | ✅       | ✅    |
| user   | ✅       | ✅     | ✅        | ✅       | ❌    |
| viewer | ❌       | ❌     | ✅        | ✅       | ❌    |

Viewers see shared portfolios as read-only tabs on Dashboard.

---

## Price Refresh

- Scheduled: weekdays 4pm CT (node-cron `0 16 * * 1-5`)
- Manual: Refresh Prices button on dashboard (admin/user only)
- After import: automatic for all imported tickers
- CASH always $1.00 — never fetched from Yahoo

---

## Notification System

Admin users can configure per-channel notification settings:

- **Ntfy** (push): `https://ntfy.schoepels.com`, topic `ptraker-alerts`
- **Email**: SMTP via nodemailer

---

## Known Constraints & Gotchas

1. **Supabase .catch()** — NOT chainable on query builder. Always `await` then check `error`.
2. **GoTrue emails** — use `generateLink` + nodemailer for ALL auth emails.
3. **import_history constraints** — `file_format` CHECK only allows: csv, qfx, ofx, manual.
4. **cost_basis NOT NULL** — default to 0, never null.
5. **Ant Design v6** — `Space direction` → `orientation`, `Divider type` → `orientation`.
6. **useEffect + setState** — always use async IIFE with cancelled flag, never call setState synchronously in effect body.
7. **Route order** — specific routes before parameterized: `/discoverable-users` before `/:ownerId`.
8. **Multi-account matching** — last-4 digits of account number. CFCU savings account `8400` won't export if no activity in date range — use manual entry.

---

## Development Workflow

### Import cadence for LPL accounts

1. **Quarterly**: Import LPL CSV (all accounts) → writes shares + cost basis
2. **Monthly**: Import LPL QFX (all accounts) → updates shares, preserves cost basis
3. **As needed**: Import CFCU OFX → checking ($7845) + money market ($8405) balances
4. **Manual**: NJSD 403(b) and 457 plans, CFCU regular savings ($8400)

### Running locally

```bash
# API
cd ptraker-api && npm run dev   # port 5000

# Client
cd ptraker-client && npm run dev  # port 5173
```