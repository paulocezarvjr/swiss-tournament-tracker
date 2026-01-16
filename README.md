# Swiss Tournament Tracker

A web application for tracking Magic: The Gathering tournaments using Swiss pairing (3 wins to advance, 3 losses to eliminate).

## Files

- **index.html** - Main HTML structure (English version)
- **styles.css** - All CSS styling separated for maintainability
- **app.js** - Application logic and state management
- **index.backup.html** - Backup of original Portuguese version (fully functional)

## What Changed

### ✅ Translation (Portuguese → English)
- All UI text, buttons, and messages translated
- Headers, labels, placeholders updated
- Alert/confirm messages in English
- Log entries now in English format

### ✅ Layout Improvements
Fixed button layout issues with long deck names:
- Buttons now use `white-space: nowrap` to prevent text wrapping
- Added `word-break: break-word` to deck names for proper wrapping
- Improved flex layout with better min/max widths
- Controls section now uses `flex-shrink: 0` to maintain button integrity
- Better responsive behavior on mobile/smaller screens

### ✅ Code Organization (Best Practices)
Reorganized monolithic HTML into modular structure:
- **Separation of Concerns**: CSS, JS, and HTML in separate files
- **Maintainability**: Easier to edit and debug individual components
- **Readability**: Clear file structure with comments
- **Atomicity**: Each file has a single responsibility

## How to Run

### 🖥️ Local (Single Computer)
1. Open `index.html` in your browser (Chrome, Firefox, Edge)
2. The app uses localStorage to persist data

### 📱 Network Access (Phone, Tablet, Multiple Computers)

**Easiest Method - Auto Script:**
```bash
cd /Users/paulo-olibra/swiss
./start-server.sh
```

**Manual Method:**
```bash
# Start server
python3 -m http.server 8080

# Find your IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Access from other devices
http://YOUR-IP:8080
```

📖 **See [NETWORK-GUIDE.md](docs/NETWORK-GUIDE.md) for detailed instructions**

### 🌐 GitHub Pages (Access from Anywhere)
1. Push to GitHub
2. Enable Pages in Settings → Pages → Source: main branch
3. Access: `https://your-username.github.io/swiss/`

✨ **Ready for GitHub Pages - zero configuration needed!**

## Features

### Core Features
- Swiss pairing algorithm with tiebreaker (Strength of Schedule)
- **🎲 Randomized Round 1**: First round pairings are randomized (subsequent rounds use Swiss logic)
- Automatic BO3 detection for decisive matches
- Win/loss tracking with automatic advancement/elimination
- Top 4/8 bracket builder (seeded by performance)
- JSON export/import/download for backup
- Activity log
- BYE handling for odd number of decks
- **Reset Tournament**: Clear rounds/bracket but keep decks (perfect for consecutive tournaments)

### Enhanced Features ✨
- **Toast Notifications**: Real-time visual feedback for all actions
- **Auto-save Indicator**: Live saving status display (bottom-right corner)
- **Expanded Statistics**: Win rate, opponent win rate, and detailed SoS
  - Hover over 📊 icon to see detailed stats for each deck
- **Visual Button Feedback**: Success animations when recording results
- **Download Backup**: Direct JSON file download with timestamp

### Premium Features 🎯
- **⏱️ Round Timer**: Customizable timer with presets (30/45/60/90 min)
  - Start, pause, reset controls
  - Visual alerts when time expires
  - Audio notification
- **📜 Round History**: Navigate through past rounds
  - View all previous pairings and results
  - Quick navigation with arrow buttons
- **🏆 Tournament Archive**: Save and compare multiple tournaments
  - Save current tournament with custom name
  - Load previous tournaments
  - Compare statistics across tournaments
- **🖥️ Presentation Mode**: Optimized display for projectors
  - Grid layout with multiple matches visible side-by-side
  - Larger fonts and spacing for readability from distance
  - Cleaner layout for visibility
  - Keyboard shortcuts (F11 or Ctrl+Shift+P)
- **🎨 Enhanced Bracket Visualization**: Beautiful playoff bracket display
  - **Replaces Swiss view**: Bracket takes over the main panel when built
  - **Single-round view**: Shows one round at a time (no scrolling!)
  - **Round navigation**: Navigate between rounds with arrow buttons
  - **Seeded by performance**: #1 vs #8, #2 vs #7, etc.
  - Card-based match view with seeds
  - Winner highlighting with animations
  - Trophy display for champion
  - Easy toggle back to Swiss rounds

## Browser Support

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

No server required - runs entirely in the browser!
