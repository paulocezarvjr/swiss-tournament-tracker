# Quick Start Guide

Get started with the Swiss Tournament Tracker in 5 minutes!

## 📦 Setup (First Time)

1. **Open** `index.html` in your browser
2. **Add decks** using the deck name field
3. **Click "Generate next round"**
4. **Record results** by clicking winner buttons
5. Done! Data auto-saves to your browser

## 🎮 Basic Workflow

```
Add Decks → Generate Round → Record Results → Next Round → Repeat
```

### Step-by-Step:

1. **Add Decks**
   - Type deck name in the field (right panel)
   - Press Enter or click "Add deck"
   - Repeat for all decks

2. **Start Tournament**
   - Click "Generate next round" (top-left)
   - Round 1 pairings are automatically randomized (for variety!)
   - BO3 format auto-assigned for decisive matches
   - Round 2+ uses Swiss pairing by performance

3. **Record Results**
   - Click "[Deck Name] won" for match winner
   - Or click "Mark BYE (win)" for bye matches
   - Watch for green flash confirmation

4. **Continue**
   - When all results are in, generate next round
   - Decks automatically advance (3W) or eliminate (3L)
   - Continue until tournament complete

5. **Playoffs (Optional)**
   - Select Top 4 or Top 8
   - Click "Build bracket"
   - Bracket uses performance seeding (#1 vs #8, etc.)
   - Record bracket results
   - Click "Advance round" after each stage

## ⚡ Quick Features

### Add Example Decks (Testing)
- Click "Fill example (20)" for instant 20-deck tournament
- Perfect for testing the app

### Timer
- Click preset (30m, 45m, 60m, 90m) to set timer
- Click "Start" to begin countdown
- Get alert when time's up

### History
- Click "📜 History" to view past rounds
- Use arrows or dropdown to navigate
- Click "✕ Close" to return

### Save Tournament
- Click "Save Current" in archive section
- Give it a name
- Load anytime or compare with others

### Presentation Mode
- Click "🖥️ Presentation Mode" (top-right)
- Or press F11
- Great for projectors and TVs

## 🎯 Tips & Tricks

### During Tournament:
- ✅ Watch for toast notifications (top-right) for feedback
- ✅ Check "✓ Saved" indicator (bottom-right) for auto-save
- ✅ Hover 📊 icon on decks for detailed stats
- ✅ Use timer to keep rounds on schedule

### Between Rounds:
- Review standings in the table
- Check KPIs: Round, Active, Advanced, Eliminated
- Save tournament if running a league/series

### After Tournament:
- Build Top 4/8 bracket for playoffs
- Export/Download JSON for backup
- Save to archive for comparison
- Reset all when ready for next tournament

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Add deck (in deck name field) |
| `F11` | Toggle presentation mode |
| `Ctrl+Shift+P` | Toggle presentation mode |
| `ESC` | Exit presentation mode |

## 🆘 Troubleshooting

**Q: My data disappeared!**
- A: Data is saved in browser localStorage. Don't clear browser data.
- Solution: Use "Download JSON" for permanent backup

**Q: Can't generate next round**
- A: Complete all results from current round first
- Check for red/incomplete pairings

**Q: Deck names are too long**
- A: Layout auto-adjusts, but keep names under 30 chars for best display

**Q: Want to undo a round**
- A: Click "Undo last round" (careful: removes all results!)

**Q: Want to run another tournament with same decks**
- A: Click "Reset Tournament" - keeps decks, clears rounds/bracket
- Or click "🔄 New Tournament" button on champion screen

**Q: Round 1 matchups are different each tournament**
- A: Yes! Round 1 is automatically randomized
- Prevents predictable alphabetical pairings
- Round 2+ uses Swiss pairing by performance
- Playoffs use seeded bracket (#1 vs #8, etc.)

**Q: Lost my tournament data**
- A: If you exported/downloaded JSON, click "Import JSON" to restore

## 📱 Mobile Support

✅ Fully responsive - works on phones and tablets
✅ Touch-friendly buttons
✅ Swipe-compatible
✅ Landscape recommended for presentation mode

## 🌐 Network/Office Setup

### Share on Local Network:

**Host Computer:**
```bash
# Navigate to folder containing index.html
cd /path/to/swiss

# Start server (choose one):
python -m http.server 8080
# or
npx serve -p 8080
```

**Other Computers:**
1. Find host's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. On other PCs, visit: `http://192.168.X.X:8080`
3. Everyone sees same app (note: data is local per computer)

### For Shared Data:
- Use "Export JSON" to share tournament state
- Send JSON to others
- They use "Import JSON" to load

## 🎓 Advanced Usage

### Running a League:
1. Run tournament each week
2. Click "Save Current" with date
3. After season, click "Compare" to see all weeks
4. Identify top performers across season

### Tournament Series:
1. Save each tournament: "Week 1", "Week 2", etc.
2. Track which decks/players dominate
3. Export data for external analysis
4. Load previous tournaments for reference

### Live Streaming:
1. Enable Presentation Mode (F11)
2. Share screen or window
3. Large, clear display for viewers
4. Use timer for professional look

## 🔒 Data & Privacy

- ✅ All data stored locally in your browser
- ✅ No internet connection required
- ✅ No data sent to servers
- ✅ No tracking or analytics
- ✅ 100% private and secure

## 🚀 Next Steps

1. ✅ Read full [FEATURES.md](FEATURES.md) for detailed documentation
2. ✅ Check [README.md](README.md) for technical details
3. ✅ Start running tournaments!

---

**Questions? Issues? Ideas?**
Check the docs or modify the code - it's all yours! 🎉
