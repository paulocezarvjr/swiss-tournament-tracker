# 📊 Interactive Analytics Guide

## Overview

The **Analytics** feature is now a **full-screen interactive experience** with deck selection, color-coded visualizations, and dynamic filtering!

---

## 🚀 How to Access

### **Method 1: Click Analytics Tab**
```
Tournament Tab → 📈 Analytics Tab → Opens Fullscreen
```

### **Method 2: Direct Button** (if added to main interface)
```
Click "Open Analytics" → Fullscreen Mode
```

---

## 🎨 Features

### **1. Deck Selection (Color-Coded)**

Each deck gets a **unique color** that persists throughout the session:

```
┌──────────────────────────────────────┐
│ ● Mono Blue Terror  [2-1] (66.7%)   │  ← Click to toggle
│ ● Golgari Elves    [3-0] (100%)     │
│ ● Burn             [1-2] (33.3%)    │
└──────────────────────────────────────┘
```

**How it works:**
- ✅ **Click any chip** to toggle deck on/off
- ✅ **Active chips** have green border
- ✅ **Colors persist** - same deck = same color always
- ✅ **See stats** - W-L record and win %

**20 Unique Colors:**
Teal, Blue, Pink, Yellow, Purple, Green, Orange, Red, Cyan, Lime, Indigo, Rose, Emerald, Amber, Violet, etc.

---

### **2. Chart Toggles**

Control which charts to display:

```
☑ Win Rate Chart
☑ Progress Chart  
☑ Head-to-Head
```

- Check/uncheck to show/hide
- Saves screen space
- Focus on what matters

---

### **3. Interactive Charts**

#### **📊 Win Rate Chart**
- **Horizontal bars** showing win percentage
- **Color-coded** by deck
- **Shows:** Name, Win %, W-L record
- **Sorted:** Highest win rate first

**Example:**
```
Mono Blue Terror  ████████████ 75.0% (6-2)
Golgari Elves     ████████     66.7% (4-2)
Burn              ████         50.0% (3-3)
```

#### **📈 Wins Progression**
- **Line chart** tracking wins over rounds
- **Multi-colored lines** - one per deck
- **Shows:** How decks climb/fall
- **Includes:** Grid, axis labels, legend

**Features:**
- See who's surging
- Identify stagnant decks
- Compare trajectories
- Round-by-round breakdown

#### **🔥 Head-to-Head Matrix**
- **Table format** showing matchup records
- **Color-coded cells:**
  - Green: >60% win rate
  - Yellow: 40-60%
  - Red: <40%
- **Shows:** W-L for each pairing

**Example:**
```
            Mono Blue  Golgari  Burn
Mono Blue       —       2-1     1-0
Golgari        1-2       —      3-0
Burn           0-1      0-3      —
```

---

### **4. Stats Summary**

Real-time statistics for selected decks:

```
┌─────────────┬─────────────┬─────────────┐
│ Selected    │ Total       │ Avg Win     │
│ Decks       │ Games       │ Rate        │
│     8       │    124      │   62.5%     │
└─────────────┴─────────────┴─────────────┘

┌─────────────────────────┐
│ Best Performer          │
│ Mono Blue Terror        │
│ 75.0% Win Rate          │
└─────────────────────────┘
```

---

## 💡 Usage Examples

### **Example 1: Compare Top 3 Decks**

1. Open Analytics
2. Deselect all decks (click all chips)
3. Select only top 3 performers
4. View clean comparison in all charts

**Result:** See exactly how the leaders stack up

---

### **Example 2: Track Underdog**

1. Select only one low-ranked deck
2. Check only "Progress Chart"
3. See round-by-round journey
4. Identify when they struggled/shined

**Result:** Deep dive into single deck performance

---

### **Example 3: Analyze Matchups**

1. Select 2 rival decks
2. Check only "Head-to-Head"
3. See direct confrontation record
4. Identify meta trends

**Result:** Understand specific matchup dynamics

---

### **Example 4: Full Tournament View**

1. Keep all decks selected (default)
2. Enable all charts
3. Scroll through comprehensive data
4. Get complete picture

**Result:** Full tournament analytics

---

## 🎯 Tips & Tricks

### **Color Management**
- Colors assigned automatically
- Same deck = same color always
- 20 unique colors available
- Cycles if >20 decks

### **Performance**
- Select fewer decks = cleaner charts
- Disable unused charts for speed
- Works with 1-20+ decks

### **Mobile Use**
- Fullscreen works great on mobile
- Swipe to scroll charts
- Tap chips to select
- Pinch to zoom SVGs

### **Data Requirements**
- **Win Rate:** Needs games played
- **Progress:** Needs 2+ rounds
- **Head-to-Head:** Needs matchups between selected decks
- **Stats:** Always available

---

## 🎨 Visual Design

### **Color Palette (20 Colors)**
```
1.  Teal      #2dd4bf
2.  Blue      #60a5fa
3.  Pink      #f472b6
4.  Yellow    #fbbf24
5.  Purple    #a78bfa
6.  Green     #34d399
7.  Orange    #fb923c
8.  Red       #f87171
9.  Cyan      #22d3ee
10. Lime      #a3e635
... (10 more)
```

### **Chart Sizes**
- **Win Rate:** Dynamic height (40px per deck)
- **Progress:** 500px tall, 1200px wide
- **Head-to-Head:** Responsive table
- **All:** SVG scalable

### **Layout**
```
┌────────────────────────────────────┐
│ 📊 Performance Analytics      ✕    │ ← Header
├────────────────────────────────────┤
│ Select Decks: [●●●●●●●●]          │ ← Controls
│ Chart Options: ☑☑☑                 │
├────────────────────────────────────┤
│                                    │
│  [📊 Win Rate Chart]              │
│                                    │
│  [📈 Progress Chart]              │
│                                    │
│  [🔥 Head-to-Head]                │
│                                    │
│  [Stats Summary Cards]            │
│                                    │
└────────────────────────────────────┘
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Escape` | Close Analytics |
| `Tab` | Navigate controls |
| `Space` | Toggle chip/checkbox |

---

## 🔧 Technical Details

### **Architecture**
```
User clicks Analytics →
  assignDeckColors() →
    renderDeckChips() →
      renderAnalyticsFullscreen() →
        renderWinRateChartLarge()
        renderProgressChartLarge()
        renderHeadToHeadLarge()
        renderStatsSummary()
```

### **Performance**
- **SVG rendering:** Fast, scalable
- **No external libraries:** Pure vanilla JS
- **Lazy loading:** Only renders when open
- **Efficient updates:** Only re-renders on change

### **Data Flow**
```
State → Filter by selectedDecks → Generate SVG → Display
```

### **Storage**
- Colors stored in `deckColors` object
- Selection stored in `selectedDecks` Set
- Persists during session (not localStorage)

---

## 📱 Responsive Behavior

### **Desktop (>768px)**
- Full width charts
- Side-by-side stats
- All labels visible
- Optimal experience

### **Tablet (768px)**
- Stacked charts
- Compressed stats
- Touch-friendly
- Still readable

### **Mobile (<768px)**
- Vertical layout
- Smaller fonts
- Tap controls
- Scroll-optimized

---

## 🚀 Future Enhancements (Potential)

- [ ] Export charts as PNG/SVG
- [ ] Print-friendly view
- [ ] Custom color picker
- [ ] Date range filtering
- [ ] More chart types (radar, scatter)
- [ ] Animation on data change
- [ ] Zoom/pan for large datasets
- [ ] Save/load deck selections

---

## 🎓 Use Cases

### **Tournament Organizer**
- Identify dominant archetypes
- Balance future tournaments
- Share stats with players

### **Player**
- Track your deck's performance
- Find favorable/unfavorable matchups
- Adjust strategy between rounds

### **Analyst**
- Study meta trends
- Create reports
- Compare tournaments

### **Casual User**
- See pretty graphs
- Understand who's winning
- Have fun with data

---

## 📝 Notes

- **Zero Dependencies:** Pure SVG + JS
- **Works Offline:** No internet needed
- **GitHub Pages Ready:** Static hosting compatible
- **Privacy:** All data local

---

**Enjoy exploring your tournament data visually!** 📊🎉
