# Light/Dark Theme Toggle Design
**Date:** 2026-03-17
**Issue:** #4 — Light/Dark Theme Toggle
**Status:** Approved

---

## Overview

Add a light/dark theme toggle to the Swiss Tournament Tracker. The current dark theme stays as the default. A warm off-white light theme is added as the alternative. User preference persists in `localStorage` and respects `prefers-color-scheme` on first visit.

---

## Approach

CSS custom properties on `[data-theme]`. The existing `:root` variable block is expanded to cover all colors in the stylesheet. A `[data-theme="light"]` override block defines the warm light palette. JavaScript toggles the attribute on `<html>` and persists the choice.

No separate stylesheet. One file, one source of truth.

---

## Color Palettes

### Dark (existing `:root`, unchanged accents)
| Variable | Value | Role |
|---|---|---|
| `--bg` | `#0b0f14` | Page background |
| `--card` | `#121824` | Card/panel background |
| `--card-inner` | `#1a2235` | Nested surfaces |
| `--text` | `#e9f1f8` | Primary text |
| `--muted` | `#9fb0c0` | Secondary text |
| `--line` | `#233041` | Borders |
| `--good` | `#2dd4bf` | Win/success |
| `--bad` | `#fb7185` | Loss/error |
| `--warn` | `#fbbf24` | Warning/BYE |
| `--header-bg` | `rgba(11,15,20,.92)` | Sticky header |
| `--surface` | `rgba(255,255,255,.04)` | Subtle surfaces |

### Light (`[data-theme="light"]`, warm/soft)
| Variable | Value | Role |
|---|---|---|
| `--bg` | `#faf9f7` | Page background |
| `--card` | `#ffffff` | Card/panel background |
| `--card-inner` | `#fdf8f4` | Nested surfaces |
| `--text` | `#1c1917` | Primary text |
| `--muted` | `#78716c` | Secondary text |
| `--line` | `#e8e0d8` | Borders |
| `--good` | `#0d9488` | Win/success (darker teal for contrast) |
| `--bad` | `#e11d48` | Loss/error (darker rose for contrast) |
| `--warn` | `#d97706` | Warning/BYE (darker amber for contrast) |
| `--header-bg` | `rgba(250,249,247,.92)` | Sticky header |
| `--surface` | `rgba(0,0,0,.04)` | Subtle surfaces |

Accent hues are identical between themes; light mode uses slightly darker shades for WCAG AA contrast on white backgrounds.

---

## CSS Changes (`styles.css`)

1. Expand `:root` to include all new variables (`--card-inner`, `--header-bg`, `--surface`)
2. Add `[data-theme="light"]` block immediately after `:root`
3. Replace all 139 hardcoded color values with the appropriate variable
4. Add transition rule: `*, *::before, *::after { transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease; }`
5. The transition rule must be scoped to avoid interfering with existing CSS animations (match result flash, bracket glow, timer pulse) — add `transition: none` overrides on those specific selectors

---

## HTML Changes (`index.html`)

### Anti-flash script in `<head>` (before any stylesheet)
```html
<script>
  (function(){
    var t = localStorage.getItem('swiss_theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
  })();
</script>
```
This runs synchronously before the page renders, preventing a flash of the wrong theme.

### Toggle button in header
Added next to the existing presentation mode button in the header. HTML:
```html
<button id="btnTheme" class="icon-btn" title="Toggle theme" aria-label="Toggle light/dark theme">🌙</button>
```
- Shows `🌙` when dark, `☀️` when light
- Positioned top-right in the header alongside the existing `btnPresentation` button

---

## JavaScript Changes (`app.js`)

Single self-contained theme module added near the top of the IIFE, after DOM element declarations:

```javascript
// Theme toggle
const THEME_KEY = 'swiss_theme';
const btnTheme = $('#btnTheme');

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    btnTheme.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    btnTheme.textContent = '🌙';
  }
  localStorage.setItem(THEME_KEY, theme);
}

btnTheme.addEventListener('click', () => {
  const current = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});
```

The anti-flash script in `<head>` handles initial load; `applyTheme` handles subsequent toggles. No duplication of init logic.

---

## File layout

Changes touch three files only:
```
assets/css/styles.css   — variable expansion + hardcoded color replacement + transition rule
index.html              — anti-flash script in <head> + toggle button in header
assets/js/app.js        — theme toggle event listener + applyTheme function
```

---

## Acceptance criteria

- [ ] Dark theme is default on first visit (no stored preference, no system preference)
- [ ] Light theme activates when `prefers-color-scheme: light` and no stored preference
- [ ] Toggle button appears in header, shows correct icon for current theme
- [ ] Clicking toggle switches theme immediately with 200ms transition
- [ ] Preference persists across page refreshes and browser restarts
- [ ] No flash of wrong theme on load
- [ ] Existing CSS animations (match flash, bracket glow, timer pulse) are unaffected by the transition rule
- [ ] All text meets WCAG AA contrast in both themes
- [ ] No hardcoded hex/rgba color values remain in `styles.css` (all use variables)

---

## Out of scope

- Per-component theme overrides
- High-contrast / accessibility theme
- Automatic theme switching based on time of day
