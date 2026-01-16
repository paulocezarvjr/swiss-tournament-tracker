# Enhanced Features Guide

This document describes the improvements added to the Swiss Tournament Tracker.

## 🎉 1. Toast Notifications

Real-time notifications appear in the top-right corner for all major actions:

### What triggers toasts:
- ✓ Deck added
- 🎲 Round generated
- ✓ Match result recorded
- 🏆 Bracket built
- 💾 Backup downloaded
- ↩️ Round undone
- 🗑️ Data reset

### Types of notifications:
- **Success** (green): Positive actions completed
- **Info** (blue): Informational updates
- **Warning** (yellow): Reversible actions or alerts
- **Error** (red): Failed operations

Notifications auto-dismiss after 2-4 seconds and can be manually closed with the × button.

## 💾 2. Auto-save Indicator

A small indicator appears in the bottom-right corner showing save status:

- **Spinning icon**: Currently saving
- **✓ Saved**: Data successfully saved to localStorage

The indicator automatically hides after 2 seconds to stay out of the way.

## 📊 3. Expanded Statistics

Each deck now shows expanded statistics:

### Main table view:
- **Win Rate %**: Calculated as wins / (wins + losses)
- Basic info: SoS, Opponents, BYE count

### Detailed tooltip (hover over 📊):
- **Win Rate**: Percentage of games won
- **Total Games**: Total matches played
- **Opponent Win Rate**: Average win % of opponents faced
- **Strength of Schedule**: Sum of opponents' wins (tiebreaker)

### Why this matters:
- Better understanding of deck performance
- Fair tiebreakers using strength of schedule
- Post-tournament analysis

## ✨ 4. Visual Button Feedback

Interactive feedback when you click buttons:

### Success animations:
- Buttons flash green when recording match results
- Smooth pulse animation confirms the action
- Makes it clear the click was registered

### Button types:
- **Match result buttons**: Flash green on success
- **Other action buttons**: Subtle click animation
- **Clear buttons**: Standard click feedback

### Benefits:
- Instant visual confirmation
- Prevents accidental double-clicks
- Better user experience during live tournaments

## 💿 5. Download Backup

New button to download tournament data as a JSON file:

### How it works:
1. Click "Download JSON"
2. File saves automatically: `swiss-tournament-YYYY-MM-DD-HHMMSS.json`
3. Keep multiple backups with timestamps

### Why use this:
- Permanent backup outside the browser
- Share tournament data with others
- Archive completed tournaments
- Restore data even after browser cache clear

### File format:
Standard JSON with all tournament data:
- All decks with complete stats
- All rounds with pairings and results
- Bracket information (if created)
- Activity log

## Tips & Best Practices

### During a Tournament:
1. **Use toasts** for quick feedback - no need to scroll to logs
2. **Watch the save indicator** to ensure data is persisted
3. **Hover over 📊** to quickly check deck performance
4. **Download backups** after each round for safety

### After a Tournament:
1. **Export/download** final data for records
2. **Review statistics** to analyze deck performance
3. **Keep backup files** for future reference

## Keyboard Shortcuts

- **Enter**: Add deck (when in deck name field)
- **Ctrl/Cmd + Click**: Future feature - quick actions

## Mobile Support

All features work on mobile devices:
- Touch-friendly button sizes
- Responsive toast positioning
- Tooltip works on tap
- Layout adapts to screen size

## Performance

All features are optimized for smooth performance:
- Toasts use CSS animations (GPU-accelerated)
- Auto-save is debounced to prevent excessive writes
- Statistics calculated only when needed
- No external dependencies

## Browser Compatibility

Tested and working on:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires modern browser with:
- localStorage support
- ES6+ JavaScript
- CSS Grid & Flexbox

---

# Premium Features (Advanced)

## ⏱️ Round Timer

A customizable timer for tracking round duration during tournaments.

### Features:
- **Start/Pause/Reset** controls
- **Preset durations**: 30, 45, 60, 90 minutes
- **Visual indicators**:
  - Green when running
  - Yellow when paused
  - Red pulsing when expired
- **Audio alert** when time runs out
- **Auto-notification** toast when timer expires

### How to use:
1. Select a preset (30m, 45m, etc.) or use default 50 minutes
2. Click **Start** to begin timer
3. Click **Pause** to temporarily stop
4. Click **Reset** to set back to 00:00
5. Timer automatically stops and alerts when time is up

### Best for:
- Timed Swiss rounds
- Keeping tournament on schedule
- Fair time management across all matches

---

## 📜 Round History Navigator

Browse through all previous rounds and their results.

### Features:
- View any past round's pairings and results
- **Arrow navigation** (◀ ▶) to move between rounds
- **Dropdown selector** for quick jump to specific round
- See match outcomes and formats (BO1/BO3)
- Non-intrusive - hides current round while viewing history

### How to use:
1. Click **📜 History** button (next to status pill)
2. Use arrows or dropdown to select round
3. View all pairings and results from that round
4. Click **✕ Close** to return to current round

### Best for:
- Reviewing past matches
- Checking previous pairings for disputes
- Analysis of tournament progression
- Sharing results from specific rounds

---

## 🏆 Tournament Archive & Comparison

Save multiple tournaments and compare their statistics.

### Features:

#### Save Tournaments:
- **Preserve complete state**: all decks, rounds, brackets, logs
- **Custom naming**: identify tournaments easily
- **Timestamp tracking**: automatic date/time recording
- **Unlimited storage**: save as many as localStorage allows

#### Load Tournaments:
- **Instant restoration**: complete tournament state
- **Safe loading**: confirmation before overwriting current data
- **Quick access**: most recent tournaments shown first

#### Compare Tournaments:
- **Side-by-side stats**: up to 4 tournaments at once
- **Key metrics**:
  - Total decks
  - Rounds played
  - Games completed
  - Advanced/Eliminated/Active counts
  - Top performer
- **Current vs Archive**: compare ongoing tournament with past ones

### How to use:

**To save:**
1. Click **Save Current** in Tournament Archive section
2. Enter a name (e.g., "Friday Night Magic - Jan 2026")
3. Tournament is saved with full data

**To load:**
1. Click **Load** on any saved tournament
2. Confirm replacement (current data will be replaced)
3. Tournament loads with all data intact

**To compare:**
1. Click **Compare** button
2. View current tournament alongside last 3 saved
3. Click **Close** to exit comparison view

**To delete:**
1. Click **Delete** on unwanted tournament
2. Confirm deletion (cannot be undone)

### Best for:
- Running recurring tournaments (weekly, monthly)
- Tracking which decks perform well over time
- League/season tracking
- Historical data analysis

---

## 🖥️ Presentation Mode

Optimized display for projectors and large screens.

### Features:
- **Grid Layout**: matches displayed in responsive grid (2-3 columns on large screens, adapts to smaller screens)
- **2-3x larger fonts**: readable from distance
- **Simplified layout**: focus on current round
- **High contrast**: better visibility
- **Auto-hide sidebars**: only essential info shown
- **Larger buttons**: easier to see actions
- **Emphasized KPIs**: round stats prominently displayed
- **Scrollable**: if many matches, scroll to see all while maintaining grid layout

### Visual Changes:
- Round display: 48px → 72px timer
- Deck names: 14px → 24px
- Scores: 18px → larger display
- Buttons: 13px → 18px
- KPI numbers: 16px → 36px

### How to activate:

**Method 1: Click**
- Click **🖥️ Presentation Mode** toggle (top-right corner)

**Method 2: Keyboard**
- Press **F11** (or Fn+F11 on Mac)
- Or **Ctrl+Shift+P**

**To exit:**
- Click toggle again
- Press **ESC** key
- Press **F11** again

### Best for:
- Displaying tournament on TV/projector
- Tournament organizer view
- Public standings board
- Live streaming overlay
- Office tournament displays

### Tips:
- Use with fullscreen (F11) for maximum visibility
- Combine with Round Timer for professional look
- Auto-hides history and detailed stats
- Perfect for wall-mounted displays

---

## Keyboard Shortcuts Summary

| Shortcut | Action |
|----------|--------|
| `Enter` | Add deck (when in deck name field) |
| `F11` | Toggle presentation mode |
| `Ctrl+Shift+P` | Toggle presentation mode |
| `ESC` | Exit presentation mode |

---

## Feature Combinations

### For Tournament Organizers:
1. **Presentation Mode** on projector for standings
2. **Round Timer** for time management
3. **History** for dispute resolution
4. **Archive** for record keeping

### For Leagues/Series:
1. **Save** each week's tournament
2. **Compare** to track trends
3. **Load** previous weeks for analysis
4. **Export** season data

### For Casual Play:
1. **Timer presets** (30m for quick rounds)
2. **History** to review fun matches
3. **Toast notifications** for easy feedback
4. **Presentation mode** optional

---

---

## 🎨 Enhanced Bracket Visualization

Beautiful, modern bracket display for playoffs (Top 4/8).

### Features:
- **Card-based layout**: Each match in its own styled card
- **Seed display**: Shows seeding (#1, #2, etc.) for first round
- **Winner highlighting**: 
  - Green glow animation when winner is selected
  - Check mark (✓) next to winner
  - Loser grayed out with strikethrough
- **Clear progression**: Each round shown separately
- **Trophy display**: 🏆 Champion highlighted at the end
- **Quick actions**: Click deck name buttons to mark winner
- **Visual feedback**: 
  - Border turns green when match has result
  - Smooth animations on winner selection
  - Toast notifications for each result

### How it works:

**Build Bracket:**
1. Complete Swiss rounds until you have winners
2. Select Top 4 or Top 8 in the right panel
3. Click "Build bracket"
4. **Bracket replaces Swiss view** in the main (left) panel
5. Swiss rounds are hidden - bracket takes center stage

**Record Results:**
1. In each match card, click the button with winner's name
2. See winner highlight in green with ✓
3. Loser automatically grays out
4. When round is complete, click "Advance ▶" button
5. Next round appears with winners matched up

**Visual Elements:**
- **Match Card**: Shows both players with seeds
- **BO3 Label**: All playoff matches are Best of 3
- **Winner Button**: Marks result and advances player
- **Clear Button**: Remove result if needed (✕)
- **Champion Display**: Large trophy and name at the end
- **Back Button**: "← Back to Swiss" returns to Swiss view

**Navigation:**
- **Round Navigation**: Use "← Quarterfinals" / "Semifinals →" buttons to move between rounds
- **One Round at a Time**: Only shows current round (no scrolling needed!)
- **Auto-Advance**: When you click "Advance ▶", automatically shows the new round
- **Champion View**: Special "🏆 Champion →" button appears when Final is complete
- **Back to Swiss**: "← Back to Swiss" returns to Swiss rounds view
- Bracket data is preserved when switching views
- Can navigate freely between all rounds

**Benefits:**
- 🚫 **No vertical scrolling** - always fits on screen
- 👁️ **Focused view** - see only what matters now
- 🎯 **Clear navigation** - always know where you are
- ⚡ **Fast access** - jump to any round with one click

### Layout:
```
Round 1: Quarterfinals/Semifinals
┌─────────────────┐
│ Match 1 - BO3   │
│ #1 Deck A   ✓   │
│ #8 Deck B       │
└─────────────────┘

Round 2: Semifinals/Final
┌─────────────────┐
│ Match 1 - BO3   │
│ Deck A      ✓   │
│ Deck C          │
└─────────────────┘

Champion
┌─────────────────┐
│      🏆         │
│   Deck A        │
└─────────────────┘
```

### Best for:
- Clean, professional playoff display
- Easy to understand progression
- Great for presentation mode
- Mobile-friendly single-column layout

### Tips:
- Use presentation mode for even better visibility
- Matches are organized by round, not in tree structure
- Each round must be completed before advancing
- Seeds only shown in first round
- Champion appears automatically when final is complete

---

## 🎲 Randomized Round 1 (Swiss)

First round pairings are automatically randomized for variety and replayability.

### The Problem:
- Without randomization, Round 1 would always be in alphabetical order
- Same decks always paired together in first round
- Predictable and repetitive
- Less variety across multiple tournaments

### The Solution:
**Automatic randomization** of Round 1 pairings:
- ✅ Shuffles all decks randomly before first pairing
- ✅ Different matchups each tournament
- ✅ Fair to all decks (everyone starts 0-0)
- ✅ Perfect for replayability

### How it works:

**Without Randomization (old behavior):**
```
Decks (alphabetical):
- Affinity
- Bogles
- Burn
- Elves
...

Round 1:
Match 1: Affinity vs Bogles (always!)
Match 2: Burn vs Elves (always!)
```

**With Randomization (current):**
```
Decks (shuffled randomly):
- Storm
- Affinity
- Elves
- Burn
...

Round 1:
Match 1: Storm vs Affinity
Match 2: Elves vs Burn

(Each tournament = different Round 1!)
```

### How Round 1 Works:

1. Click **"Generate next round"** (first time)
2. App detects it's Round 1 (no previous rounds)
3. **Automatically shuffles all decks randomly**
4. Creates pairings from shuffled list
5. Log message: "Round 1: Decks randomized for pairing variety."
6. **Different matchups every time!** 🎲

### Subsequent Rounds:

- **Round 2+**: Uses standard Swiss pairing
  - Pairs by performance (W-L record)
  - Then by Strength of Schedule
  - Then alphabetically as last tiebreaker
- **Not randomized**: Fair competitive pairing

### Benefits:

**Weekly Tournaments:**
```
Week 1: 
- Round 1: Storm vs Affinity, Burn vs Gruul
- Different every week!

Week 2:
- Round 1: Affinity vs Elves, Storm vs Burn
- Fresh matchups!
```

**Replayability:**
```
- Run tournament
- Reset Tournament (keep decks)
- Run again
- Different Round 1 matchups!
- No repetition!
```

**Fair Competition:**
```
- Everyone starts 0-0
- Random pairings are fair
- No advantage/disadvantage
- After Round 1: Swiss takes over
```

### Important Notes:

1. **Only Round 1**: Only the first round is randomized
2. **Automatic**: No configuration needed
3. **Always different**: Each new tournament shuffles differently
4. **Fair Swiss after**: Rounds 2+ use proper Swiss pairing
5. **Logged**: Check log for "Round 1: Decks randomized..."

### Comparison:

| Round | Pairing Method | Why |
|-------|----------------|-----|
| **Round 1** | 🎲 Random shuffle | Everyone 0-0, maximize variety |
| **Round 2+** | 📊 Swiss (by record) | Competitive fair pairing |
| **Playoffs** | 🏆 Seeded (#1 vs #8) | Reward performance |

### Example Tournament Flow:

```
Tournament 1:
Round 1 (random): Affinity vs Storm, Burn vs Elves
Round 2 (Swiss): Winners face winners, etc.
...
Playoffs (seeded): #1 vs #8, #2 vs #7

Reset Tournament

Tournament 2:
Round 1 (random): Elves vs Affinity, Storm vs Burn
(DIFFERENT Round 1!)
Round 2 (Swiss): By performance again
...
Playoffs (seeded): Based on results
```

### Tips:

- 💡 Automatic - nothing to configure
- 💡 Perfect for weekly office tournaments
- 💡 Combine with "Reset Tournament" for variety
- 💡 Playoffs still respect performance (not random)

---

---

## 🔄 Reset Tournament (Keep Decks)

Perfect for running consecutive tournaments with the same players/decks.

### The Problem:
- You finish a tournament
- Want to run another one immediately
- Same decks/players
- Don't want to re-register everyone

### The Solution:
**"Reset Tournament"** button that:
- ✅ **Keeps all decks** registered
- ✅ Resets all decks to 0-0
- ✅ Clears all rounds
- ✅ Clears bracket
- ✅ Resets status to "active"
- ✅ Ready for new tournament instantly!

### How to use:

**Option 1: From deck configuration panel**
1. Click **"Reset Tournament"** (yellow button)
2. Confirm action
3. All decks preserved, stats reset
4. Ready to start new tournament

**Option 2: From champion screen**
1. Tournament finishes, champion displayed
2. Click **"🔄 New Tournament (Keep Decks)"**
3. Instantly ready for next tournament
4. Same decks, fresh start

**Option 3: Between rounds**
1. Realize you need to restart
2. Click "Reset Tournament"
3. Decks preserved, everything else cleared

### What it does:

**Preserves:**
- ✅ All deck names
- ✅ Deck registrations
- ✅ Log history (with reset note)

**Clears:**
- ❌ All rounds and pairings
- ❌ All match results
- ❌ Win/loss records (resets to 0-0)
- ❌ Bracket/playoffs
- ❌ Advanced/eliminated status
- ❌ Opponent history
- ❌ BYE counts

### Use Cases:

**Weekly Tournaments:**
```
Week 1: 
- Register 20 decks
- Run tournament
- Reset Tournament
Week 2:
- Same 20 decks already there!
- Run new tournament
- Reset Tournament
(repeat...)
```

**Best of 3 Format:**
```
Match 1: Swiss + Playoffs
- Winner determined
- Reset Tournament
Match 2: Same decks, fresh start
- Winner determined  
- Reset Tournament
Match 3 (if needed): Tiebreaker
```

**Testing/Practice:**
```
- Register decks once
- Run mock tournament
- Reset Tournament
- Try different strategies
- Repeat as needed
```

### Comparison:

| Action | Decks | Rounds | Bracket | Stats |
|--------|-------|--------|---------|-------|
| **Reset Tournament** | ✅ Keep | ❌ Clear | ❌ Clear | ❌ Reset |
| **Reset Everything** | ❌ Delete | ❌ Clear | ❌ Clear | ❌ Reset |
| **Undo Round** | ✅ Keep | 📝 Remove last | ✅ Keep | 📝 Revert |

### Benefits:

1. **Save Time**: No re-registration needed
2. **Convenience**: One click to restart
3. **Consistency**: Same deck pool each tournament
4. **Flexibility**: Run multiple tournaments quickly
5. **Testing**: Perfect for tournament simulation

### Tips:

- 💡 Use "Save Tournament" before resetting to keep records
- 💡 Champion screen has quick "New Tournament" button
- 💡 Log keeps record of when you reset
- 💡 Archive old tournament before resetting if you want history
- 💡 "Reset Everything" is still there if you want full clean slate

---

## Performance Notes

All premium features are:
- **Lightweight**: minimal CPU/memory usage
- **Local**: no internet required
- **Fast**: instant responses
- **Persistent**: data survives browser restart
- **Secure**: all data stays on your device
