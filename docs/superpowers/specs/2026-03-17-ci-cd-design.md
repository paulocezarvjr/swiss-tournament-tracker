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

**Trigger:** `push` and `pull_request` on all branches.

### Steps (in order)

1. **Repo hygiene guard**
   Shell step. Fails with a clear error message if any of the following exist:
   - `package.json`
   - `package-lock.json`
   - `node_modules/`

   Purpose: prevents contributors from silently introducing Node dependencies into a zero-dependency project.

2. **HTML5 validation**
   Uses a W3C-compatible HTML validator GitHub Action (e.g. `Cyb3r-Jak3/html5validator-action` or equivalent).
   Validates `index.html`.
   Fails the check if any errors are reported.

3. **Link checker**
   Uses `lycheeverse/lychee-action` to scan all `.html` and `.md` files for broken URLs.
   External links are checked; localhost/relative links are excluded.
   Fails on broken links; a `lychee.toml` config file excludes known false positives if needed.

---

## Workflow 2: `deploy.yml`

**Trigger:** `push` to `main` branch only.

### Steps (in order)

1. **Checkout** repository
2. **Deploy to GitHub Pages** using `actions/deploy-pages` (or the standard `actions/configure-pages` + `actions/upload-pages-artifact` + `actions/deploy-pages` sequence).
   Serves the repository root as the static site.

### Repository settings required

- GitHub Pages must be enabled on the repository, set to deploy from GitHub Actions (not from a branch).
- The `GITHUB_TOKEN` permissions need `pages: write` and `id-token: write`.

---

## File layout

```
.github/
  workflows/
    ci.yml
    deploy.yml
lychee.toml          # link checker config (optional, for exclusions)
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
