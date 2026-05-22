# Deploy a new version of portfolioTraker

Run through the full deploy checklist for accumulated changes in one or both repos,
then push tagged releases to kick off the GitHub Actions builds.

## Before you start

Determine which repos have changes to release:

- `ptraker-api` (`E:\ptraker\ptraker-api`) — backend changes
- `ptraker-client` (`E:\ptraker\ptraker-client`) — frontend changes
- Both — full release (most common)

Run `git log --oneline -10` and `git diff HEAD` in each repo to understand what changed.
If a repo has no meaningful changes since its last tag, skip it.

---

## Steps

### 1. Review accumulated changes

For each repo being released, run:

```bash
git -C E:\ptraker\ptraker-api log --oneline $(git -C E:\ptraker\ptraker-api describe --tags --abbrev=0)..HEAD
git -C E:\ptraker\ptraker-client log --oneline $(git -C E:\ptraker\ptraker-client describe --tags --abbrev=0)..HEAD
```

Summarize what changed in each repo so the version bump and changelog are accurate.

### 2. Determine the next version

Check current versions:

```bash
node -p "require('./ptraker-api/package.json').version"
node -p "require('./ptraker-client/package.json').version"
```

Both repos use the same version number (kept in sync). Determine the bump:

- **Patch** (x.y.Z) — bug fixes, dependency updates, minor tweaks
- **Minor** (x.Y.0) — new features, non-breaking additions
- **Major** (X.0.0) — breaking changes, major rewrites

### 3. Client build check

If releasing ptraker-client, verify the production build succeeds:

```bash
cd E:\ptraker\ptraker-client && npm run build
```

If the build fails, stop here and fix the errors before proceeding.

### 4. Write a test plan

Based on what changed, write a specific test plan for the user to run against
the local dev environment (`http://localhost:5173` for client, `http://localhost:5000` for API).

The plan must be specific to the changes — not a generic smoke test. Examples:

- New UI feature: list exact pages, buttons, and interactions to exercise
- API change: specific endpoints and request shapes to verify
- Bug fix: reproduce the original bug and confirm it no longer occurs
- Import change: upload a real file and verify the output

**Wait for the user to confirm all tests have passed before continuing.**

Do not proceed to documentation, version bumping, committing, or tagging until
the user explicitly says tests passed.

---

### 5. Update documentation

*Only proceed here after the user has confirmed tests passed.*

For each repo being released:

**CHANGELOG.md** — add a new section at the top (below the heading):

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Fixed
- ...
```

**RELEASE.md** — replace the top section with new release notes. Keep a
`---` separator and the previous release below it.

**ptraker-api/CLAUDE.md** — update if any new routes, patterns, or gotchas
were introduced.

**ptraker-client/CLAUDE.md** — update if any new components, services, or
patterns were introduced.

### 6. Bump version

Update `"version"` in `package.json` and `package-lock.json` for each repo
being released. Both files have the version in two places in package-lock.json
(top-level and under `packages: { "": { ... } }`).

Keep both repos on the same version number.

### 7. Commit

For each repo being released, stage all modified files and commit:

```
git -C E:\ptraker\ptraker-api add -A
git -C E:\ptraker\ptraker-api commit -m "chore: release v X.Y.Z"

git -C E:\ptraker\ptraker-client add -A
git -C E:\ptraker\ptraker-client commit -m "chore: release v X.Y.Z"
```

### 8. Tag and push

For each repo being released:

```bash
git -C E:\ptraker\ptraker-api tag vX.Y.Z
git -C E:\ptraker\ptraker-api push origin main --tags

git -C E:\ptraker\ptraker-client tag vX.Y.Z
git -C E:\ptraker\ptraker-client push origin main --tags
```

This triggers the GitHub Actions workflow that builds the Docker image and
pushes it to GHCR, then SSHes to Jupiter to restart the container.

### 9. Monitor the build

Check the Actions tab in each repo:

- https://github.com/dschoepel/ptraker-api/actions
- https://github.com/dschoepel/ptraker-client/actions

Wait for both workflows to complete (typically 2–4 minutes each).
If a workflow fails, check the logs before proceeding.

### 10. Verify on Jupiter

After both builds complete, SSH to Jupiter and confirm containers are running
the new image:

```bash
ssh -p 22791 dschoepel@142.202.190.9
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" | grep ptraker
```

Then smoke test via browser:

- https://ptraker.com — React app loads, login works
- https://api.ptraker.com/health — returns `{"status":"ok",...}`
- https://supabase.ptraker.com — returns HTTP 401 (Kong is up)

If the API was updated, also verify:

- Dashboard loads with portfolio data
- Prices refresh on demand
- 

If the client was updated, also verify the specific features that changed.

### Notes

- **First-time deploy only**: before the first tag, Jupiter needs a one-time
  `docker login ghcr.io` with a GitHub PAT (`read:packages` scope) so it can
  pull the private GHCR images. After that, the deploy workflow handles everything.
- **Rollback**: `docker compose pull api` with a previous image tag, or
  `docker compose up -d --no-deps api` with the previous `latest`.
- **DB migrations**: if a release adds new tables or columns, run the SQL in
  Studio before deploying the API that depends on them.
- **VITE_ vars**: if production Supabase keys ever change, update the GitHub
  Actions secrets in ptraker-client before tagging — they are baked into the
  client bundle at build time.