# 📑 Tabs System & Analytics Guide

## Overview

The Swiss Tournament Tracker now features a modern **tabbed interface** for better organization and enhanced analytics capabilities.

---

## 🎯 Tab System

### **3 Main Tabs:**

```
┌──────────────────────────────────────┐
│  🏆 Tournament │ 📈 Analytics │ ⚙️ Tools │
└──────────────────────────────────────┘
```

---

## 🏆 Tab 1: Tournament

**Purpose:** Manage your tournament and track current status

**Features:**
- ✅ Add/remove decks
- ✅ View standings table
- ✅ Build playoff brackets
- ✅ Activity log
- ✅ Quick actions

**Layout:**
- **Decks & Configuration** - Register players/decks
- **Standings** - Real-time W-L records and status
- **Playoff Bracket** - Top 4/8 builder
- **Activity Log** - All tournament actions

**Workflow:**
1. Add decks
2. Generate rounds (left panel)
3. Record results
4. Check standings here
5. Build bracket when ready

---

## 📈 Tab 2: Analytics (NEW!)

**Purpose:** Visualize performance and analyze tournament data

### **Charts Included:**

#### **1. 📊 Win Rate by Deck**
- Horizontal bar chart showing win %
- Top 10 decks
- Color-coded: Green (>60%), Yellow (40-60%), Red (<40%)
- Shows W-L record

#### **2. 📈 Wins Progression**
- Line chart tracking top 5 decks over rounds
- See who's climbing and who's falling
- Multi-colored lines for each deck

#### **3. 🎯 Status Distribution**
- Pie chart showing:
  - Active decks (blue)
  - Advanced decks (green)
  - Eliminated decks (red)
- Percentage breakdown

#### **4. 🔥 Head-to-Head Matrix**
- Table showing matchup records between decks
- Who beats who
- Color-coded by win rate
- Top 8 decks displayed

#### **5. 🏆 Top Performers**
- Leaderboard with ranks
- Medals for top 3 (🥇🥈🥉)
- Win rate badges
- Status indicators

### **When to Use:**
- After Round 2+ (needs data)
- Between rounds for analysis
- End of tournament for review
- Comparing deck performance

### **Features:**
- ✅ **Real-time updates** - Refreshes when switching to tab
- ✅ **SVG-based** - Crisp graphics, no external libraries
- ✅ **Responsive** - Works on mobile/tablet
- ✅ **No dependencies** - Pure JavaScript

---

## ⚙️ Tab 3: Tools

**Purpose:** Access optional features and utilities

### **Tools Available:**

#### **⏱️ Round Timer**
- Collapsible section
- Set duration (30/45/60/90 min presets)
- Start/Pause/Reset controls
- Visual state: Green (running), Yellow (paused), Red (expired)

#### **📜 Round History**
- Browse previous rounds
- View all pairings and results
- Navigate with arrows

#### **🏆 Tournament Archive**
- Save current tournament
- Load previous tournaments
- Compare multiple tournaments
- Delete old archives

#### **💾 Backup & Export**
- Export JSON
- Download file
- Import from JSON
- Perfect for backups

#### **🔄 Reset Options**
- **Reset Tournament** - Clears rounds but keeps decks
- **Reset Everything** - Full clean slate
- Confirmation required

### **Why Collapsible?**
- Keeps interface clean
- Only expand what you need
- Saves screen space
- Better focus on main tournament

---

## 💡 Usage Tips

### **During Tournament:**
1. Stay in **🏆 Tournament tab** for operations
2. Left panel shows current round
3. Right panel (tournament tab) shows standings
4. Use **⚙️ Tools** for timer/history as needed

### **Between Rounds:**
1. Switch to **📈 Analytics** to review performance
2. Check which decks are dominating
3. Analyze matchup trends
4. Identify underperformers

### **After Tournament:**
1. Check **🏆 Leaderboard** in Analytics
2. Review head-to-head records
3. Save to **Archive** (Tools tab)
4. Export backup

### **Mobile Use:**
- Tab labels hidden on mobile (icons only)
- Charts stack vertically
- All features accessible
- Swipe-friendly

---

## 🎨 Visual Design

### **Tab Navigation:**
- Clean bar at top
- Active tab: Green underline + highlight
- Smooth transitions
- Icon + label (desktop) / Icon only (mobile)

### **Charts:**
- Modern SVG graphics
- Color-coded for readability
- Tooltips and labels
- Empty states for no data

### **Tools:**
- Accordion-style (`<details>`)
- Open/close individual sections
- Clean separation
- Compact when closed

---

## 🚀 Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Navigate between tabs and controls |
| `Enter` | Activate button/open details |
| `Escape` | Close modals |

---

## 📱 Responsive Behavior

### **Desktop (>768px):**
- 2-column layout (rounds left, tabs right)
- All tab labels visible
- Charts side-by-side
- Full controls

### **Mobile (<768px):**
- Stacked layout
- Icon-only tabs
- Single-column charts
- Collapsible tools

---

## 🔧 Technical Details

### **Architecture:**
```
HTML: Tab structure with <details> for tools
CSS: Grid layouts, animations, responsiveness
JS: Pure vanilla, no frameworks
```

### **Performance:**
- Charts render only when Analytics tab is active
- Lazy rendering saves resources
- SVG for scalable graphics
- Minimal DOM manipulation

### **Data Flow:**
```
User Action → State Update → renderAll() → 
  → renderAnalytics() (if Analytics tab active)
```

---

## 🎯 Future Enhancements (Potential)

- [ ] Export charts as images
- [ ] More chart types (radar, scatter)
- [ ] Custom date ranges
- [ ] Advanced filtering
- [ ] Print-friendly reports
- [ ] Dark/light theme toggle

---

## 📝 Notes

- **Zero Dependencies:** All graphics built with pure SVG
- **Local Storage:** Everything persists in browser
- **GitHub Pages Ready:** Works perfectly as static site
- **Modern Browsers:** Chrome, Firefox, Safari, Edge

---

**Enjoy the new organized interface!** 🎉
