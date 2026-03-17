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

### Dark (`:root` defaults)
| Variable | Value | Role |
|---|---|---|
| `--bg` | `#0b0f14` | Page background |
| `--card` | `#121824` | Card/panel background |
| `--card-inner` | `#1a2235` | Nested surfaces (inputs, inner panels) |
| `--text` | `#e9f1f8` | Primary text |
| `--text-bright` | `#ffffff` | Headings, deck names, bright labels |
| `--muted` | `#9fb0c0` | Secondary / hint text |
| `--line` | `#233041` | Borders |
| `--good` | `#2dd4bf` | Win/success accent |
| `--bad` | `#fb7185` | Loss/error accent |
| `--warn` | `#fbbf24` | Warning/BYE accent |
| `--header-bg` | `rgba(11,15,20,.92)` | Sticky header backdrop |
| `--surface` | `rgba(255,255,255,.04)` | Subtle overlay surfaces |
| `--btn-bg` | `#0e1730` | Button base background |
| `--pill-good-text` | `#bff7ee` | Text inside win/success pills |
| `--pill-bad-text` | `#ffd2da` | Text inside loss/error pills |
| `--pill-warn-text` | `#ffe7b0` | Text inside warn/BYE pills |

### Light (`[data-theme="light"]`, warm/soft)
| Variable | Value | Role |
|---|---|---|
| `--bg` | `#faf9f7` | Page background |
| `--card` | `#ffffff` | Card/panel background |
| `--card-inner` | `#fdf8f4` | Nested surfaces |
| `--text` | `#1c1917` | Primary text |
| `--text-bright` | `#1c1917` | Headings, deck names (same as text in light) |
| `--muted` | `#78716c` | Secondary / hint text |
| `--line` | `#e8e0d8` | Borders |
| `--good` | `#0f766e` | Win/success — teal-700, 5.47:1 on white ✓ |
| `--bad` | `#be123c` | Loss/error — rose-700, 6.29:1 on white ✓ |
| `--warn` | `#b45309` | Warning — amber-700, 5.02:1 on white ✓ |
| `--header-bg` | `rgba(250,249,247,.92)` | Sticky header backdrop |
| `--surface` | `rgba(0,0,0,.04)` | Subtle overlay surfaces |
| `--btn-bg` | `#f0ece6` | Button base background |
| `--pill-good-text` | `#ffffff` | White text on solid teal pill (see pill note) |
| `--pill-bad-text` | `#ffffff` | White text on solid rose pill |
| `--pill-warn-text` | `#ffffff` | White text on solid amber pill |

**Accent contrast:** Light mode uses Tailwind -700 shades. All three exceed 4.5:1 against white for text use and as badge backgrounds with white text.

### Pill/badge backgrounds in light mode
In dark mode, `.pill.good / .bad / .warn` use `rgba(accent, .08)` tinted backgrounds with light-tinted text — this reads well on dark cards. In light mode, 8% tints over white are near-invisible and white pill text would be 1.1:1 (invisible).

**Fix:** `[data-theme="light"]` adds overrides to make pill backgrounds solid accent color with `--pill-*-text` (#ffffff):
```css
[data-theme="light"] .pill.good { background: var(--good); }
[data-theme="light"] .pill.bad  { background: var(--bad); }
[data-theme="light"] .pill.warn { background: var(--warn); }
```

### Match format badges (`.badge.bo3`, `.badge.bo5`)
In dark mode, these use light-tinted text (`#bfdbfe` blue, `#ffe7b0` amber) on 8% opacity tinted backgrounds — illegible in light mode (1.3:1 contrast).

**Fix:** Add variables and override to solid backgrounds in light mode:
| Variable | Dark | Light |
|---|---|---|
| `--badge-bo3-text` | `#bfdbfe` | `#ffffff` |
| `--badge-bo5-text` | `#ffe7b0` | `#ffffff` |

```css
[data-theme="light"] .badge.bo3 {
  background: rgba(59, 130, 246, .85);
  border-color: rgba(59, 130, 246, .85);
}
[data-theme="light"] .badge.bo5 {
  background: rgba(251, 191, 36, .85);
  border-color: rgba(251, 191, 36, .85);
}
```

### Exempt from variabilization (stay hardcoded in both themes)
- Trophy/medal colors: `#FFD700`, `#C0C0C0`, `#CD7F32` — intentional brand-fixed values
- `rgba(0,0,0,...)` drop shadows — darken correctly against any background
- `.log` element (`background: #0a101b; color: #cfe0f0; border-color: ...`) — intentionally an always-dark terminal surface in both themes

### `rgba(255,255,255,...)` surface overlays
All `rgba(255,255,255, 0.02–0.08)` values used as dark-surface textures (e.g. `.pair .deck-item`, `.leaderboard-item`, `.kpi .k`) must be replaced with `var(--surface)`. These are near-invisible on dark but invert incorrectly on a light background. The `[data-theme="light"]` value for `--surface` is `rgba(0,0,0,.04)`, which produces the correct subtle texture on either background.

### `body` background gradient
`body { background: linear-gradient(180deg, #0b0f14, #0a0d12) }` must become `var(--bg)` (or a gradient using `--bg`). As-is it would stay dark on light theme.

---

## CSS Changes (`styles.css`)

1. Expand `:root` to include all new variables defined above
2. Add `[data-theme="light"]` override block immediately after `:root`
3. Replace all hardcoded color values with the appropriate variable (except exempt values listed above). Specific mappings:
   - Hardcoded `#fff` / `#ffffff` on deck names, leaderboard names, deck chips → `var(--text-bright)`
   - `.badge.bo3` color → `var(--badge-bo3-text)`, `.badge.bo5` color → `var(--badge-bo5-text)`
   - `.pill.good/bad/warn` text → `var(--pill-good-text)` / `var(--pill-bad-text)` / `var(--pill-warn-text)`
4. Add pill/badge light-mode overrides as shown above
5. Add global transition rule:
   ```css
   *, *::before, *::after {
     transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
   }
   ```
6. Add `transition: none` overrides on these selectors (existing animations must be unaffected):
   - `.btn-result.success-flash` (background-color keyframe)
   - `.bracket-match.has-winner` (box-shadow glow)
   - `.timer-display.expired` (opacity pulse)
   - `.toast` (translateX slide)
   - `.save-indicator .spinner` (rotate)

### Presentation mode stays dark
`body.presentation-mode` uses hardcoded dark/black overrides — left as-is. Always dark. Toggle button hidden while active:
```css
body.presentation-mode #btnTheme { display: none; }
```

---

## HTML Changes (`index.html`)

### Anti-flash script in `<head>` (before the stylesheet `<link>`)
```html
<script>
  (function(){
    var t = localStorage.getItem('swiss_theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
  })();
</script>
```
Runs synchronously before page renders. Prevents flash of wrong theme.

### Toggle button in header
Added next to `#btnPresentation`. Uses the same `presentation-toggle` CSS class. Offset via a new CSS rule (not inline style, to allow the mobile media query to override):
```html
<button id="btnTheme" class="presentation-toggle theme-toggle-btn" title="Toggle theme" aria-label="Toggle light/dark theme">🌙</button>
```
```css
.theme-toggle-btn { right: 60px; }
@media (max-width: 600px) { .theme-toggle-btn { right: 50px; } }
```
The `right` value ensures it never overlaps `#btnPresentation` at any viewport width.

---

## JavaScript Changes (`app.js`)

Theme module added after DOM element declarations, before any other logic:

```javascript
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

// Sync button icon with whatever the anti-flash script already applied
(function initThemeIcon() {
  const active = document.documentElement.getAttribute('data-theme');
  btnTheme.textContent = active === 'light' ? '☀️' : '🌙';
})();

btnTheme.addEventListener('click', () => {
  // Read from DOM attribute as source of truth to avoid localStorage desync
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  applyTheme(isLight ? 'dark' : 'light');
});
```

---

## File layout

```
assets/css/styles.css   — variable expansion, light palette, color replacement, pill/badge overrides, transition rule
index.html              — anti-flash script in <head>, toggle button in header
assets/js/app.js        — applyTheme(), initThemeIcon(), click handler
```

---

## Acceptance criteria

- [ ] Dark theme is default on first visit (no stored preference, no system preference)
- [ ] Light theme activates automatically when `prefers-color-scheme: light` and no stored preference
- [ ] Toggle button appears in header top-right, shows `🌙` in dark and `☀️` in light
- [ ] Clicking toggle switches theme with 200ms transition; icon updates immediately
- [ ] Clicking toggle twice returns to original theme (no desync)
- [ ] Preference persists across page refreshes and browser restarts
- [ ] No flash of wrong theme on load
- [ ] Pill badges (win/loss/warn) are readable in light mode (solid background, white text)
- [ ] Format badges (BO3/BO5) are readable in light mode
- [ ] Deck names in match cards are readable in light mode (dark text, not white-on-white)
- [ ] Existing animations unaffected: match flash, bracket glow, timer pulse, toast slide, save spinner
- [ ] Presentation mode always dark; toggle button hidden while presentation mode is active
- [ ] Log panel always dark in both themes
- [ ] Toggle button does not overlap presentation mode button on any viewport width

---

## Out of scope

- Per-component theme overrides beyond what is specified
- High-contrast / accessibility theme
- Automatic theme switching based on time of day
