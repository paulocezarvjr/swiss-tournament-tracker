# CI/CD Pipeline Design
**Date:** 2026-03-17
**Issue:** #9 — GitHub Actions for CI/CD
**Status:** Approved

---

## Overview

Add two GitHub Actions workflow files to the Swiss Tournament Tracker repository:
- `ci.yml` — quality gate that runs on every PR and push
- `deploy.yml` — auto-deploy to GitHub Pages on merge to `main`

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
   Uses `Cyb3r-Jak3/html5validator-action@v1.0.3`.
   Validates all `.html` files under the repository root, excluding `backup/` and hidden directories (`.superpowers/`, `.github/`).
   Fails the check if any errors are reported.

3. **Link checker**
   Uses `lycheeverse/lychee-action@v2` to scan all `.html` and `.md` files for broken external URLs.
   A `lychee.toml` config file at the repo root explicitly excludes `backup/`, `.superpowers/`, and `.github/` directories, sets `localhost` as an ignored host, and sets `accept = [200, 429]` so rate-limited responses from external hosts do not cause false failures.
   Fails on broken links.

### Repository settings required

- Enable branch protection on `main` with the `ci` workflow set as a required status check. Without this rule, the CI badge is informational only and does not block merging.

---

## Workflow 2: `deploy.yml`

**Trigger:** `push` to `main` branch only.

**Concurrency:** Cancel in-progress deploys for the same branch when a new push supersedes them. This ensures the latest commit is always what goes live and prevents stale deploys racing ahead.

### Steps (in order)

1. **Checkout** repository
2. **Configure Pages** using `actions/configure-pages`
3. **Upload artifact** using `actions/upload-pages-artifact` with the repository root as the upload path
4. **Deploy to GitHub Pages** using `actions/deploy-pages`

Serves the repository root as the static site.

### Repository settings required

- GitHub Pages must be enabled on the repository, set to deploy from GitHub Actions (not from a branch).
- The `GITHUB_TOKEN` permissions need `pages: write`, `id-token: write`, and `contents: read`.

---

## File layout

```
.github/
  workflows/
    ci.yml
    deploy.yml
lychee.toml          # link checker config — excludes backup/, .superpowers/, localhost; accept 200+429
```

---

## Acceptance criteria

- [ ] Every PR shows a green CI check before merge is allowed
- [ ] Introducing `package.json` in a PR causes CI to fail with a clear message
- [ ] Invalid HTML in `index.html` causes CI to fail
- [ ] A broken external link in any `.html` or `.md` file causes CI to fail
- [ ] Merging to `main` automatically triggers a GitHub Pages deployment
- [ ] The deployed site is accessible at the repository's GitHub Pages URL
- [ ] No `package.json`, `node_modules/`, or npm-related files are added to the repo

---

## Out of scope

- JS linting (would require npm)
- CSS validation (low signal-to-noise ratio for this codebase)
- End-to-end browser tests (future work)
- Notifications / Slack integration
