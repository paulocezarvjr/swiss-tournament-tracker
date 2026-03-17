# CI/CD Pipeline Design
**Date:** 2026-03-17
**Issue:** #9 — GitHub Actions for CI/CD
**Status:** Approved

---

## Overview

Add one GitHub Actions workflow file to the Swiss Tournament Tracker repository:
- `ci.yml` — quality gate that runs on every PR and push to `main`

Deployment is handled by GitHub Pages legacy mode (serves directly from `main` branch, no build step required). A separate `deploy.yml` is unnecessary and would conflict with the existing Pages configuration.

The project is intentionally dependency-free (no `package.json`). All CI checks must run without npm.

---

## Workflow 1: `ci.yml`

**Trigger:** `pull_request` on all branches; `push` on `main` only (avoids duplicate runs on PR branches).

**Concurrency:** Cancel in-progress runs for the same branch when a new push supersedes them. Set `timeout-minutes: 10` on the job.

### Steps (in order)

1. **Repo hygiene guard**
   Shell step. Fails with a clear error message if any of the following exist:
   - `package.json`
   - `package-lock.json`
   - `node_modules/`

   Purpose: prevents contributors from silently introducing Node dependencies into a zero-dependency project.

2. **HTML5 validation**
   Uses `Cyb3r-Jak3/html5validator-action@v7.2.0` with the `blacklist` input.
   Validates all `.html` files under the repository root, excluding `backup/` and hidden directories (`.superpowers/`, `.github/`).
   Fails the check if any errors are reported.

3. **Link checker**
   Uses `lycheeverse/lychee-action@v2` to scan all `.html` and `.md` files for broken external URLs.
   A `lychee.toml` config file at the repo root explicitly excludes `backup/`, `.superpowers/`, and `.github/` directories, sets `localhost` as an ignored host, and sets `accept = [200, 429]` so rate-limited responses from external hosts do not cause false failures.
   Fails on broken links.

### Repository settings required

- Enable branch protection on `main` with the `ci` workflow set as a required status check. Without this rule, the CI badge is informational only and does not block merging.

---

## File layout

```
.github/
  workflows/
    ci.yml
lychee.toml          # link checker config — excludes backup/, .superpowers/, localhost; accept 200+429
```

---

## Acceptance criteria

- [ ] Every PR shows a green CI check before merge is allowed
- [ ] Introducing `package.json` in a PR causes CI to fail with a clear message
- [ ] Invalid HTML in `index.html` causes CI to fail
- [ ] A broken external link in any `.html` or `.md` file causes CI to fail
- [ ] No `package.json`, `node_modules/`, or npm-related files are added to the repo

---

## Out of scope

- JS linting (would require npm)
- CSS validation (low signal-to-noise ratio for this codebase)
- End-to-end browser tests (future work)
- Notifications / Slack integration
