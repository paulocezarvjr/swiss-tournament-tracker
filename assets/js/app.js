/* ================================================
   SWISS TOURNAMENT TRACKER - APPLICATION LOGIC
   ================================================ */

(() => {
  // =========================
  // Storage + State
  // =========================
  const LS_KEY = "swiss_decks_3w3l_v1";
  const FORMAT_KEY = "swiss_tournament_format_v1";

  /** @typedef {{
   *  id: string,
   *  name: string,
   *  wins: number,
   *  losses: number,
   *  status: 'active'|'advanced'|'eliminated',
   *  opponents: string[],
   *  byeCount: number
   * }} Deck */

  /** @typedef {{
   *  round: number,
   *  pairs: Array<{
   *    id: string,
   *    a: string,
   *    b: string|null,
   *    format: 'BO3'|'BO5',
   *    result: 'A'|'B'|'BYE'|null
   *  }>,
   *  createdAt: number
   * }} Round */

  /** @typedef {{
   *  decks: Deck[],
   *  rounds: Round[],
   *  bracket: any|null,
   *  log: string[]
   * }} AppState */

  /** @type {AppState} */
  let state = load() ?? {
    decks: [],
    rounds: [],
    bracket: null,
    log: []
  };

  // =========================
  // DOM Elements
  // =========================
  const $ = (sel) => document.querySelector(sel);

  const deckName = $("#deckName");
  const btnAddDeck = $("#btnAddDeck");
  const btnSeedExample = $("#btnSeedExample");
  const btnResetTournament = $("#btnResetTournament");
  const btnResetAll = $("#btnResetAll");

  const btnNextRound = $("#btnNextRound");
  const btnUndoRound = $("#btnUndoRound");
  const btnAutoFinish = $("#btnAutoFinish");

  const pairsWrap = $("#pairsWrap");
  const decksTable = $("#decksTable tbody");
  const statusPill = $("#statusPill");

  const kRound = $("#kRound");
  const kActive = $("#kActive");
  const kAdv = $("#kAdv");
  const kElim = $("#kElim");

  const bracketSize = $("#bracketSize");
  const btnBuildBracket = $("#btnBuildBracket");
  const btnSimBracket = $("#btnSimBracket");
  const bracketWrap = $("#bracketWrap");
  const swissSection = $("#swissSection");
  const playoffSection = $("#playoffSection");
  const btnCloseBracket = $("#btnCloseBracket");

  const btnExport = $("#btnExport");
  const btnDownload = $("#btnDownload");
  const btnImport = $("#btnImport");
  const jsonBox = $("#jsonBox");

  const logEl = $("#log");
  const toastContainer = $("#toastContainer");
  const saveIndicator = $("#saveIndicator");
  
  // Timer elements
  const timerWidget = $("#timerWidget");
  const timerDisplay = $("#timerDisplay");
  const btnTimerStart = $("#btnTimerStart");
  const btnTimerPause = $("#btnTimerPause");
  const btnTimerReset = $("#btnTimerReset");
  
  // History elements
  const historyNav = $("#historyNav");
  const historyRoundSelect = $("#historyRoundSelect");
  const historyContent = $("#historyContent");
  const btnViewHistory = $("#btnViewHistory");
  const btnCloseHistory = $("#btnCloseHistory");
  const btnHistoryPrev = $("#btnHistoryPrev");
  const btnHistoryNext = $("#btnHistoryNext");

  // Tabs elements
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");
  
  // Analytics elements
  const chartWinRate = $("#chartWinRate");
  const chartProgress = $("#chartProgress");
  const chartStatus = $("#chartStatus");
  const chartHeadToHead = $("#chartHeadToHead");
  const leaderboard = $("#leaderboard");
  
  // Analytics Fullscreen elements
  const analyticsFullscreen = $("#analyticsFullscreen");
  const btnOpenAnalytics = $("#btnOpenAnalytics");
  const btnCloseAnalytics = $("#btnCloseAnalytics");
  const deckChips = $("#deckChips");
  const chartWinRateLarge = $("#chartWinRateLarge");
  const chartProgressLarge = $("#chartProgressLarge");
  const chartHeadToHeadLarge = $("#chartHeadToHeadLarge");
  const statsSummary = $("#statsSummary");
  const showWinRate = $("#showWinRate");
  const showProgress = $("#showProgress");
  const showHeadToHead = $("#showHeadToHead");
  
  // Analytics state
  let selectedDecks = new Set();
  const deckColors = {};
  const colorPalette = [
    '#2dd4bf', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa',
    '#34d399', '#fb923c', '#f87171', '#22d3ee', '#a3e635',
    '#818cf8', '#fb7185', '#4ade80', '#facc15', '#c084fc',
    '#14b8a6', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6'
  ];

  // Format Configuration Elements
  const formatPreset = $("#formatPreset");
  const winsNeeded = $("#winsNeeded");
  const lossesNeeded = $("#lossesNeeded");
  const normalFormat = $("#normalFormat");
  const decisiveFormat = $("#decisiveFormat");
  const btnApplyFormat = $("#btnApplyFormat");
  const btnToggleFormat = $("#btnToggleFormat");
  const formatConfigSection = $("#formatConfigSection");

  // Tournament Format Configuration
  const formatPresets = {
    quick: { wins: 2, losses: 2, normal: 'BO1', decisive: 'BO3' },
    standard: { wins: 3, losses: 3, normal: 'BO3', decisive: 'BO5' },
    extended: { wins: 4, losses: 4, normal: 'BO3', decisive: 'BO5' }
  };

  let tournamentFormat = loadFormat();
  
  // Tournament archive elements
  const tournamentList = $("#tournamentList");
  const btnSaveTournament = $("#btnSaveTournament");
  const btnCompare = $("#btnCompare");
  const comparisonView = $("#comparisonView");
  const comparisonGrid = $("#comparisonGrid");
  const btnCloseComparison = $("#btnCloseComparison");
  
  // Presentation mode
  const presentationToggle = $("#presentationToggle");
  const presentationIcon = $("#presentationIcon");
  const presentationText = $("#presentationText");

  // =========================
  // Toast Notifications
  // =========================
  function showToast(message, type = 'info', duration = 3000) {
    if (window.showToastEnabled === false) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    
    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // =========================
  // Auto-save Indicator
  // =========================
  let saveTimeout = null;
  
  function showSaveIndicator(saving = true) {
    saveIndicator.classList.add('show');
    saveIndicator.classList.remove('saved');
    
    if (saving) {
      saveIndicator.querySelector('.spinner').style.display = 'block';
      saveIndicator.querySelector('.text').textContent = 'Saving...';
    } else {
      saveIndicator.querySelector('.spinner').style.display = 'none';
      saveIndicator.querySelector('.text').textContent = '✓ Saved';
      saveIndicator.classList.add('saved');
    }
    
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      saveIndicator.classList.remove('show');
    }, saving ? 500 : 2000);
  }

  // =========================
  // Button Feedback
  // =========================
  function buttonFeedback(button, success = true) {
    if (success) {
      button.classList.add('success-flash');
      setTimeout(() => button.classList.remove('success-flash'), 500);
    } else {
      button.classList.add('clicked');
      setTimeout(() => button.classList.remove('clicked'), 300);
    }
  }

  // =========================
  // Statistics
  // =========================
  function calculateStats(deck) {
    const totalGames = deck.wins + deck.losses;
    const winrate = totalGames > 0 ? ((deck.wins / totalGames) * 100).toFixed(1) : 0;
    
    // Calculate opponent win percentage (strength of schedule detail)
    let oppWins = 0;
    let oppTotal = 0;
    for (const oid of deck.opponents) {
      const opp = getDeck(oid);
      if (opp) {
        oppWins += opp.wins;
        oppTotal += opp.wins + opp.losses;
      }
    }
    const oppWinrate = oppTotal > 0 ? ((oppWins / oppTotal) * 100).toFixed(1) : 0;
    
    return {
      winrate,
      totalGames,
      oppWinrate,
      sos: sos(deck)
    };
  }

  function renderStatsTooltip(deck) {
    const stats = calculateStats(deck);
    return `
      <div class="stats-tooltip">
        <span style="cursor: help; text-decoration: underline dotted;">📊</span>
        <div class="tooltip-content">
          <div class="stat-row">
            <span class="label">Win Rate:</span>
            <span class="value">${stats.winrate}%</span>
          </div>
          <div class="stat-row">
            <span class="label">Total Games:</span>
            <span class="value">${stats.totalGames}</span>
          </div>
          <div class="stat-row">
            <span class="label">Opp Win Rate:</span>
            <span class="value">${stats.oppWinrate}%</span>
          </div>
          <div class="stat-row">
            <span class="label">Strength of Schedule:</span>
            <span class="value">${stats.sos}</span>
          </div>
        </div>
      </div>
    `;
  }

  // =========================
  // Utility Functions
  // =========================
  const uid = () => Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
  const now = () => Date.now();

  // =========================
  // Round Timer
  // =========================
  let timerInterval = null;
  let timerSeconds = 0;
  let timerDuration = 50 * 60; // default 50 minutes
  let timerRunning = false;

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    const remaining = Math.max(0, timerDuration - timerSeconds);
    timerDisplay.textContent = formatTime(remaining);
    
    timerDisplay.classList.remove('running', 'paused', 'expired');
    if (remaining === 0) {
      timerDisplay.classList.add('expired');
      if (timerRunning) {
        playTimerSound();
        showToast('⏰ Time is up!', 'warning', 5000);
        stopTimer();
      }
    } else if (timerRunning) {
      timerDisplay.classList.add('running');
    } else if (timerSeconds > 0) {
      timerDisplay.classList.add('paused');
    }
  }

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    btnTimerStart.textContent = 'Resume';
    timerInterval = setInterval(() => {
      timerSeconds++;
      updateTimerDisplay();
    }, 1000);
    updateTimerDisplay();
    showToast('⏱️ Timer started', 'info', 2000);
  }

  function pauseTimer() {
    if (!timerRunning) return;
    timerRunning = false;
    clearInterval(timerInterval);
    updateTimerDisplay();
    showToast('⏸️ Timer paused', 'info', 2000);
  }

  function stopTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    updateTimerDisplay();
  }

  function resetTimer() {
    stopTimer();
    timerSeconds = 0;
    btnTimerStart.textContent = 'Start';
    updateTimerDisplay();
    showToast('🔄 Timer reset', 'info', 2000);
  }

  function setTimerDuration(minutes) {
    resetTimer();
    timerDuration = minutes * 60;
    updateTimerDisplay();
    showToast(`Timer set to ${minutes} minutes`, 'success', 2000);
  }

  function playTimerSound() {
    // Simple audio feedback using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log('Audio not supported');
    }
  }

  // =========================
  // Round History Navigator
  // =========================
  let currentHistoryRound = null;

  function showHistory() {
    if (state.rounds.length === 0) {
      showToast('No rounds to show yet', 'info');
      return;
    }
    
    historyNav.style.display = 'block';
    pairsWrap.style.display = 'none';
    
    // Populate round selector
    historyRoundSelect.innerHTML = '';
    state.rounds.forEach((r, idx) => {
      const option = document.createElement('option');
      option.value = idx;
      option.textContent = `Round ${r.round}`;
      historyRoundSelect.appendChild(option);
    });
    
    currentHistoryRound = state.rounds.length - 1;
    historyRoundSelect.value = currentHistoryRound;
    renderHistoryRound();
  }

  function hideHistory() {
    historyNav.style.display = 'none';
    pairsWrap.style.display = '';
    currentHistoryRound = null;
  }

  function renderHistoryRound() {
    if (currentHistoryRound === null || currentHistoryRound < 0 || currentHistoryRound >= state.rounds.length) {
      return;
    }
    
    const round = state.rounds[currentHistoryRound];
    historyContent.innerHTML = `<h3 style="margin: 0 0 10px; color: var(--good);">Round ${round.round}</h3>`;
    
    round.pairs.forEach(p => {
      const A = getDeck(p.a);
      const B = p.b ? getDeck(p.b) : null;
      
      let resultText = '';
      if (p.result === 'BYE') {
        resultText = 'BYE';
      } else if (p.result === 'A') {
        resultText = `${A ? A.name : 'A'} won`;
      } else if (p.result === 'B') {
        resultText = `${B ? B.name : 'B'} won`;
      } else {
        resultText = 'No result';
      }
      
      const div = document.createElement('div');
      div.className = 'history-match';
      div.innerHTML = `
        <div class="names">
          <b>${escapeHtml(A ? A.name : p.a)}</b>
          ${B ? ` vs <b>${escapeHtml(B.name)}</b>` : ' (BYE)'}
        </div>
        <div class="result">${resultText}</div>
      `;
      historyContent.appendChild(div);
    });
    
    btnHistoryPrev.disabled = currentHistoryRound === 0;
    btnHistoryNext.disabled = currentHistoryRound === state.rounds.length - 1;
  }

  function navigateHistory(delta) {
    currentHistoryRound += delta;
    currentHistoryRound = Math.max(0, Math.min(state.rounds.length - 1, currentHistoryRound));
    historyRoundSelect.value = currentHistoryRound;
    renderHistoryRound();
  }

  // =========================
  // Tournament Archive & Comparison
  // =========================
  const ARCHIVE_KEY = "swiss_tournaments_archive";
  
  function loadArchive() {
    try {
      const raw = localStorage.getItem(ARCHIVE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveArchive(archive) {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive));
  }

  function saveTournament() {
    if (state.decks.length === 0) {
      showToast('No tournament data to save', 'warning');
      return;
    }
    
    const name = prompt('Tournament name:', `Tournament ${new Date().toLocaleDateString()}`);
    if (!name) return;
    
    const archive = loadArchive();
    const tournament = {
      id: uid(),
      name: name.trim(),
      date: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(state)) // deep clone
    };
    
    archive.push(tournament);
    saveArchive(archive);
    renderTournamentList();
    showToast(`✓ Tournament "${name}" saved`, 'success');
    log(`Tournament saved: ${name}`);
  }

  function loadTournament(id) {
    const archive = loadArchive();
    const tournament = archive.find(t => t.id === id);
    if (!tournament) return;
    
    if (!confirm(`Load tournament "${tournament.name}"? Current data will be replaced.`)) return;
    
    state = JSON.parse(JSON.stringify(tournament.data)); // deep clone
    state.decks.forEach(clampStatus);
    save();
    renderAll();
    renderTournamentList();
    showToast(`✓ Loaded: ${tournament.name}`, 'success');
    log(`Tournament loaded: ${tournament.name}`);
  }

  function deleteTournament(id) {
    let archive = loadArchive();
    const tournament = archive.find(t => t.id === id);
    if (!tournament) return;
    
    if (!confirm(`Delete tournament "${tournament.name}"?`)) return;
    
    archive = archive.filter(t => t.id !== id);
    saveArchive(archive);
    renderTournamentList();
    showToast(`Deleted: ${tournament.name}`, 'info');
  }

  function renderTournamentList() {
    const archive = loadArchive();
    tournamentList.innerHTML = '';
    
    if (archive.length === 0) {
      tournamentList.innerHTML = '<div class="muted" style="text-align:center; padding:20px;">No saved tournaments yet</div>';
      return;
    }
    
    archive.reverse().forEach(t => {
      const div = document.createElement('div');
      div.className = 'tournament-item';
      
      const date = new Date(t.date).toLocaleString();
      const deckCount = t.data.decks.length;
      const roundCount = t.data.rounds.length;
      
      div.innerHTML = `
        <div class="tournament-info">
          <div class="name">${escapeHtml(t.name)}</div>
          <div class="meta">${date} · ${deckCount} decks · ${roundCount} rounds</div>
        </div>
        <div class="tournament-actions">
          <button data-action="load" data-id="${t.id}">Load</button>
          <button class="danger" data-action="delete" data-id="${t.id}">Delete</button>
        </div>
      `;
      
      tournamentList.appendChild(div);
    });
  }

  function showComparison() {
    const archive = loadArchive();
    if (archive.length === 0) {
      showToast('Save some tournaments first to compare', 'info');
      return;
    }
    
    comparisonView.style.display = 'block';
    comparisonGrid.innerHTML = '';
    
    // Add current tournament
    const currentCard = createComparisonCard('Current Tournament', state);
    comparisonGrid.appendChild(currentCard);
    
    // Add archived tournaments
    archive.slice(-3).reverse().forEach(t => {
      const card = createComparisonCard(t.name, t.data);
      comparisonGrid.appendChild(card);
    });
    
    showToast('📊 Showing tournament comparison', 'info');
  }

  function createComparisonCard(name, data) {
    const card = document.createElement('div');
    card.className = 'comparison-card';
    
    const totalDecks = data.decks.length;
    const totalRounds = data.rounds.length;
    const advanced = data.decks.filter(d => d.status === 'advanced').length;
    const eliminated = data.decks.filter(d => d.status === 'eliminated').length;
    const active = data.decks.filter(d => d.status === 'active').length;
    
    const totalGames = data.rounds.reduce((sum, r) => sum + r.pairs.filter(p => p.result !== null).length, 0);
    
    // Top performer
    const sorted = [...data.decks].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (a.losses !== b.losses) return a.losses - b.losses;
      return 0;
    });
    const topDeck = sorted[0];
    
    card.innerHTML = `
      <h3>${escapeHtml(name)}</h3>
      <div class="comparison-stat">
        <span class="label">Total Decks</span>
        <span class="value">${totalDecks}</span>
      </div>
      <div class="comparison-stat">
        <span class="label">Rounds Played</span>
        <span class="value">${totalRounds}</span>
      </div>
      <div class="comparison-stat">
        <span class="label">Total Games</span>
        <span class="value">${totalGames}</span>
      </div>
      <div class="comparison-stat">
        <span class="label">Advanced</span>
        <span class="value" style="color: var(--good);">${advanced}</span>
      </div>
      <div class="comparison-stat">
        <span class="label">Eliminated</span>
        <span class="value" style="color: var(--bad);">${eliminated}</span>
      </div>
      <div class="comparison-stat">
        <span class="label">Still Active</span>
        <span class="value" style="color: var(--warn);">${active}</span>
      </div>
      ${topDeck ? `
        <div class="comparison-stat">
          <span class="label">Top Performer</span>
          <span class="value">${escapeHtml(topDeck.name)} (${topDeck.wins}-${topDeck.losses})</span>
        </div>
      ` : ''}
    `;
    
    return card;
  }

  function hideComparison() {
    comparisonView.style.display = 'none';
  }

  // =========================
  // Presentation Mode
  // =========================
  let presentationMode = false;

  function togglePresentationMode() {
    presentationMode = !presentationMode;
    document.body.classList.toggle('presentation-mode', presentationMode);
    
    if (presentationMode) {
      presentationIcon.textContent = '✕';
      presentationText.textContent = 'Exit Presentation';
      showToast('🖥️ Presentation mode activated', 'success');
      
      // Auto-hide history when entering presentation mode
      if (historyNav.style.display !== 'none') {
        hideHistory();
      }
    } else {
      presentationIcon.textContent = '🖥️';
      presentationText.textContent = 'Presentation Mode';
      showToast('👁️ Normal mode restored', 'info');
    }
  }

  // Keyboard shortcut for presentation mode
  document.addEventListener('keydown', (e) => {
    // F11 or Ctrl+Shift+P
    if (e.key === 'F11' || (e.ctrlKey && e.shiftKey && e.key === 'P')) {
      e.preventDefault();
      togglePresentationMode();
    }
    
    // ESC to exit presentation mode
    if (e.key === 'Escape' && presentationMode) {
      togglePresentationMode();
    }
  });

  function save() {
    showSaveIndicator(true);
    localStorage.setItem(LS_KEY, JSON.stringify(state));
    setTimeout(() => showSaveIndicator(false), 300);
  }

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  // =========================
  // Format Configuration
  // =========================
  function loadFormat() {
    try {
      const raw = localStorage.getItem(FORMAT_KEY);
      if (!raw) return formatPresets.standard;
      return JSON.parse(raw);
    } catch {
      return formatPresets.standard;
    }
  }

  function saveFormat(format) {
    localStorage.setItem(FORMAT_KEY, JSON.stringify(format));
    tournamentFormat = format;
    updateFormatUI();
    updateSubtitle();
    toast('Tournament format updated', 'info');
  }

  function updateFormatUI() {
    winsNeeded.value = tournamentFormat.wins;
    lossesNeeded.value = tournamentFormat.losses;
    normalFormat.value = tournamentFormat.normal;
    decisiveFormat.value = tournamentFormat.decisive;

    // Detect which preset matches current config
    let matchedPreset = 'custom';
    for (const [presetName, preset] of Object.entries(formatPresets)) {
      if (preset.wins === tournamentFormat.wins &&
          preset.losses === tournamentFormat.losses &&
          preset.normal === tournamentFormat.normal &&
          preset.decisive === tournamentFormat.decisive) {
        matchedPreset = presetName;
        break;
      }
    }
    formatPreset.value = matchedPreset;
  }

  function applyFormatFromUI() {
    const format = {
      wins: parseInt(winsNeeded.value),
      losses: parseInt(lossesNeeded.value),
      normal: normalFormat.value,
      decisive: decisiveFormat.value
    };

    // Validate
    if (format.wins < 1 || format.wins > 10) {
      showToast('Wins must be between 1 and 10', 'error');
      return;
    }
    if (format.losses < 1 || format.losses > 10) {
      showToast('Losses must be between 1 and 10', 'error');
      return;
    }

    // Warn if tournament has already started
    if (state.decks.length > 0 || state.rounds.length > 0) {
      if (!confirm('⚠️ Tournament has already started!\n\nChanging the format will NOT affect the current tournament, but will apply to new tournaments or after a reset.\n\nContinue?')) {
        return;
      }
    }

    saveFormat(format);
    
    // Hide config section after applying
    formatConfigSection.classList.add('hidden');
    showToast('✓ Format saved! Will apply to new tournaments.', 'success');
  }

  function toggleFormatConfig() {
    formatConfigSection.classList.toggle('hidden');
    const isHidden = formatConfigSection.classList.contains('hidden');
    btnToggleFormat.textContent = isHidden ? '⚙️ Settings' : '✕ Close';
  }

  function updateSubtitle() {
    const subtitle = document.querySelector('.sub');
    if (subtitle) {
      subtitle.innerHTML = `
        Deck advances with <b>${tournamentFormat.wins} wins</b>, is eliminated with <b>${tournamentFormat.losses} losses</b>. 
        Normal matches are <b>${tournamentFormat.normal}</b>. Decisive matches are <b>${tournamentFormat.decisive}</b>.
      `;
    }
  }

  function log(msg) {
    const stamp = new Date().toLocaleString("en-US");
    state.log.push(`[${stamp}] ${msg}`);
    if (state.log.length > 200) state.log.shift();
    save();
    renderLog();
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[s]));
  }

  // =========================
  // Deck Management
  // =========================
  function clampStatus(deck) {
    if (deck.wins >= tournamentFormat.wins) deck.status = "advanced";
    else if (deck.losses >= tournamentFormat.losses) deck.status = "eliminated";
    else deck.status = "active";
  }

  function getDeck(id) {
    return state.decks.find(d => d.id === id) || null;
  }

  function isActive(deck) {
    return deck.status === "active";
  }

  function activeDecks() {
    return state.decks.filter(d => d.status === "active");
  }

  // Strength of Schedule (simple tiebreaker): sum of opponents' wins
  function sos(deck) {
    let s = 0;
    for (const oid of deck.opponents) {
      const od = getDeck(oid);
      if (od) s += od.wins;
    }
    return s;
  }

  function sortedDecksForTable() {
    const copy = [...state.decks];
    copy.sort((x, y) => {
      if (y.wins !== x.wins) return y.wins - x.wins;
      if (x.losses !== y.losses) return x.losses - y.losses;
      const sx = sos(x), sy = sos(y);
      if (sy !== sx) return sy - sx;
      return x.name.localeCompare(y.name);
    });
    return copy;
  }

  // =========================
  // Round Management
  // =========================
  function canGenerateRound() {
    return activeDecks().length >= 2;
  }

  function lastRound() {
    if (state.rounds.length === 0) return null;
    return state.rounds[state.rounds.length - 1];
  }

  function currentRoundComplete() {
    const r = lastRound();
    if (!r) return true;
    return r.pairs.every(p => p.result !== null);
  }

  // Decisive match: someone can reach 3W or fall to 3L
  function isDecisive(a, b) {
    const da = getDeck(a);
    const db = b ? getDeck(b) : null;
    if (!da) return false;
    const threshold = tournamentFormat.wins - 1;
    const lossThreshold = tournamentFormat.losses - 1;
    const aDec = (da.wins >= threshold || da.losses >= lossThreshold);
    const bDec = db ? (db.wins >= threshold || db.losses >= lossThreshold) : false;
    return aDec || bDec;
  }

  // =========================
  // Pairing (Swiss System)
  // =========================
  function makeSwissPairs() {
    if (!currentRoundComplete()) {
      alert("Complete all results from the current round before generating the next one.");
      return null;
    }

    const act = activeDecks();
    if (act.length < 2) {
      alert("Not enough active decks to pair.");
      return null;
    }

    const isFirstRound = state.rounds.length === 0;

    // Sort by performance and SoS for stability
    let ordered = [...act].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (a.losses !== b.losses) return a.losses - b.losses;
      const sa = sos(a), sb = sos(b);
      if (sb !== sa) return sb - sa;
      return a.name.localeCompare(b.name);
    });

    // Randomize first round for variety
    if (isFirstRound) {
      ordered = shuffleArray(ordered);
      log("Round 1: Decks randomized for pairing variety.");
    }

    const used = new Set();
    const pairs = [];

    function pickOpponent(i) {
      const A = ordered[i];
      const candidates = [];
      for (let j = i + 1; j < ordered.length; j++) {
        const B = ordered[j];
        if (used.has(B.id)) continue;
        candidates.push(B);
      }
      candidates.sort((b1, b2) => {
        const s1 = pairScore(A, b1);
        const s2 = pairScore(A, b2);
        return s2 - s1;
      });
      return candidates[0] || null;
    }

    function pairScore(A, B) {
      let score = 0;
      const sameWL = (A.wins === B.wins && A.losses === B.losses);
      const diff = Math.abs((A.wins - A.losses) - (B.wins - B.losses));
      const already = A.opponents.includes(B.id);
      if (sameWL) score += 100;
      score += Math.max(0, 40 - diff * 10);
      if (!already) score += 60; else score -= 120;
      score += Math.max(-10, Math.min(10, sos(B) - sos(A)));
      return score;
    }

    for (let i = 0; i < ordered.length; i++) {
      const A = ordered[i];
      if (used.has(A.id)) continue;

      used.add(A.id);
      const opp = pickOpponent(i);
      if (opp) {
        used.add(opp.id);
        pairs.push({
          id: uid(),
          a: A.id,
          b: opp.id,
          format: isDecisive(A.id, opp.id) ? tournamentFormat.decisive : tournamentFormat.normal,
          result: null
        });
      } else {
        // BYE (odd number case)
        pairs.push({
          id: uid(),
          a: A.id,
          b: null,
          format: tournamentFormat.normal,
          result: null
        });
      }
    }

    return pairs;
  }

  // =========================
  // Apply Results
  // =========================
  function applyPairResult(pair, res) {
    if (pair.result !== null) {
      rollbackPairResult(pair, pair.result);
    }
    pair.result = res;

    const A = getDeck(pair.a);
    const B = pair.b ? getDeck(pair.b) : null;

    if (!A) return;

    if (res === "BYE") {
      A.wins += 1;
      A.byeCount += 1;
      clampStatus(A);
      log(`BYE: ${A.name} receives 1 win (now ${A.wins}-${A.losses}).`);
      showToast(`BYE: ${A.name} receives 1 win`, 'info', 2000);
      save();
      renderAll();
      return;
    }

    if (!B) return;

    if (!A.opponents.includes(B.id)) A.opponents.push(B.id);
    if (!B.opponents.includes(A.id)) B.opponents.push(A.id);

    if (res === "A") {
      A.wins += 1;
      B.losses += 1;
      clampStatus(A); clampStatus(B);
      log(`Result: ${A.name} defeated ${B.name} (${A.wins}-${A.losses} / ${B.wins}-${B.losses}).`);
      showToast(`${A.name} defeated ${B.name}`, 'success', 2500);
    } else if (res === "B") {
      B.wins += 1;
      A.losses += 1;
      clampStatus(A); clampStatus(B);
      log(`Result: ${B.name} defeated ${A.name} (${B.wins}-${B.losses} / ${A.wins}-${A.losses}).`);
      showToast(`${B.name} defeated ${A.name}`, 'success', 2500);
    }
    save();
    renderAll();
  }

  function rollbackPairResult(pair, res) {
    const A = getDeck(pair.a);
    const B = pair.b ? getDeck(pair.b) : null;
    if (!A) return;
    if (res === "BYE") {
      A.wins = Math.max(0, A.wins - 1);
      A.byeCount = Math.max(0, A.byeCount - 1);
      clampStatus(A);
      return;
    }
    if (!B) return;

    if (res === "A") {
      A.wins = Math.max(0, A.wins - 1);
      B.losses = Math.max(0, B.losses - 1);
    } else if (res === "B") {
      B.wins = Math.max(0, B.wins - 1);
      A.losses = Math.max(0, A.losses - 1);
    }

    clampStatus(A); clampStatus(B);
  }

  // =========================
  // Bracket (Top 4/8)
  // =========================
  function showBracketView() {
    swissSection.style.display = 'none';
    playoffSection.style.display = 'block';
  }

  function showSwissView() {
    swissSection.style.display = 'block';
    playoffSection.style.display = 'none';
  }

  // Fisher-Yates shuffle algorithm
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildBracket() {
    const size = parseInt(bracketSize.value, 10);
    if (![4, 8].includes(size)) return;

    const ranked = sortedDecksForTable();
    if (ranked.length < size) {
      alert(`You need at least ${size} registered decks.`);
      showToast(`Need at least ${size} decks to build bracket`, 'error');
      return;
    }

    const selected = ranked.slice(0, size);
    const seeds = selected.map((d, idx) => ({ seed: idx + 1, deckId: d.id }));
    
    const firstRound = [];
    for (let i = 0; i < size / 2; i++) {
      const a = seeds[i];
      const b = seeds[size - 1 - i];
      firstRound.push({
        id: uid(),
        a: a.deckId,
        b: b.deckId,
        aSeed: a.seed,
        bSeed: b.seed,
        result: null
      });
    }

    // Determine proper round name based on size
    const firstRoundName = size === 8 ? "Quarterfinals" : "Semifinals";
    
    state.bracket = {
      size,
      rounds: [
        { name: firstRoundName, matches: firstRound }
      ]
    };
    
    // Reset to first round
    currentBracketRound = 0;
    
    save();
    renderBracket();
    showBracketView(); // Switch to bracket view
    log(`Bracket built: Top ${size} by performance seeding.`);
    showToast(`🏆 Top ${size} bracket built!`, 'success');
  }

  function bracketAdvance() {
    const br = state.bracket;
    if (!br) return;

    const rounds = br.rounds;
    let current = rounds[rounds.length - 1];
    if (!current) return;

    if (!current.matches.every(m => m.result)) {
      alert("Define the winner for all matches in the current bracket round.");
      return;
    }

    const winners = current.matches.map(m => m.result === "A" ? m.a : m.b);
    if (winners.length === 1) return;

    const nextMatches = [];
    for (let i = 0; i < winners.length; i += 2) {
      nextMatches.push({
        id: uid(),
        a: winners[i],
        b: winners[i + 1],
        aSeed: null,
        bSeed: null,
        result: null
      });
    }

    const roundName =
      winners.length === 2 ? "Final" :
      winners.length === 4 ? "Semifinals" :
      winners.length === 8 ? "Quarterfinals" : `R${rounds.length + 1}`;

    rounds.push({ name: roundName, matches: nextMatches });
    
    // Auto-navigate to the new round
    currentBracketRound = rounds.length - 1;
    
    save();
    renderBracket();
  }

  function setBracketResult(roundIdx, matchId, res) {
    const br = state.bracket;
    if (!br) return;
    const r = br.rounds[roundIdx];
    const m = r.matches.find(x => x.id === matchId);
    if (!m) return;
    m.result = res;
    save();
    renderBracket();
  }

  function simulateBracket() {
    if (!state.bracket) {
      buildBracket();
      if (!state.bracket) return;
    }
    while (true) {
      const br = state.bracket;
      const cur = br.rounds[br.rounds.length - 1];
      for (const m of cur.matches) {
        if (!m.result) m.result = (Math.random() < 0.5 ? "A" : "B");
      }
      save();
      renderBracket();
      if (cur.matches.length === 1) break;
      bracketAdvance();
    }
    const final = state.bracket.rounds[state.bracket.rounds.length - 1].matches[0];
    const champId = final.result === "A" ? final.a : final.b;
    const champ = getDeck(champId);
    log(`Bracket simulation completed. Champion: ${champ ? champ.name : champId}.`);
  }

  // =========================
  // UI Rendering
  // =========================
  function renderKPIs() {
    const act = state.decks.filter(d => d.status === "active").length;
    const adv = state.decks.filter(d => d.status === "advanced").length;
    const elim = state.decks.filter(d => d.status === "eliminated").length;
    kRound.textContent = String(state.rounds.length);
    kActive.textContent = String(act);
    kAdv.textContent = String(adv);
    kElim.textContent = String(elim);

    const total = state.decks.length;
    statusPill.className = "pill";
    if (total === 0) {
      statusPill.textContent = "Status: empty";
    } else if (!canGenerateRound()) {
      statusPill.textContent = `Status: ${total} decks registered (no pairing available)`;
      statusPill.classList.add("warn");
    } else {
      statusPill.textContent = `Status: ${total} decks registered`;
      statusPill.classList.add("good");
    }
  }

  function renderDecksTable() {
    decksTable.innerHTML = "";
    const rows = sortedDecksForTable();
    for (const d of rows) {
      const tr = document.createElement("tr");

      const stLabel =
        d.status === "advanced" ? `<span class="pill good">Advanced</span>` :
        d.status === "eliminated" ? `<span class="pill bad">Eliminated</span>` :
        `<span class="pill">Active</span>`;

      const stats = calculateStats(d);
      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <b>${escapeHtml(d.name)}</b>
            ${renderStatsTooltip(d)}
          </div>
          <div class="small">Win Rate: ${stats.winrate}% · SoS: ${sos(d)} · Opponents: ${d.opponents.length} · BYE: ${d.byeCount}</div>
        </td>
        <td class="right"><b>${d.wins}-${d.losses}</b></td>
        <td>${stLabel}</td>
        <td class="right">
          <button data-act="rename" data-id="${d.id}">Rename</button>
          <button class="danger" data-act="remove" data-id="${d.id}">Remove</button>
        </td>
      `;
      decksTable.appendChild(tr);
    }
  }

  function renderPairs() {
    pairsWrap.innerHTML = "";
    const r = lastRound();
    if (!r) {
      pairsWrap.innerHTML = `<div class="muted">No rounds yet. Register decks and click "Generate next round".</div>`;
      return;
    }

    for (const p of r.pairs) {
      const A = getDeck(p.a);
      const B = p.b ? getDeck(p.b) : null;
      const mdBadge = p.format === "BO5"
        ? `<span class="badge bo5">BO5 (decisive)</span>`
        : `<span class="badge bo3">BO3</span>`;

      const scoreLine = () => {
        if (!A) return "";
        if (!B) return `${A.wins}-${A.losses} vs BYE`;
        return `${A.wins}-${A.losses} vs ${B.wins}-${B.losses}`;
      };

      const div = document.createElement("div");
      div.className = "pair";
      
      // Determine winner status
      const aWon = p.result === "A";
      const bWon = p.result === "B";
      const isBye = !B;
      const byeResult = p.result === "BYE";
      
      div.innerHTML = `
        <div class="pair-header">
          ${mdBadge}
          <span class="score-line">${scoreLine()}</span>
        </div>
        <div class="pair-body">
          <div class="deck-vs">
            <button class="deck-item deck-a ${aWon ? 'winner' : ''} ${bWon ? 'loser' : ''}" 
                    data-pair="${p.id}" data-res="A" ${isBye ? 'disabled' : ''}>
              <span class="deck-label">DECK A</span>
              <span class="deck-name">${escapeHtml(A ? A.name : p.a)}</span>
              ${aWon ? '<span class="winner-badge">✓ Winner</span>' : ''}
            </button>
            <div class="vs-divider">vs</div>
            <button class="deck-item deck-b ${bWon ? 'winner' : ''} ${aWon ? 'loser' : ''} ${isBye ? 'bye-placeholder' : ''}" 
                    data-pair="${p.id}" data-res="${isBye ? 'BYE' : 'B'}" ${isBye ? 'disabled' : ''}>
              <span class="deck-label">${B ? 'DECK B' : 'BYE'}</span>
              <span class="deck-name">${B ? escapeHtml(B.name) : (byeResult ? '✓ Auto-win' : '—')}</span>
              ${bWon ? '<span class="winner-badge">✓ Winner</span>' : ''}
            </button>
          </div>
        </div>
        <div class="pair-footer">
          <span class="result-status">${p.result ? (isBye ? 'BYE recorded' : 'Result recorded') : 'Click on the winner'}</span>
          ${p.result ? `<button class="clear-btn" data-pair="${p.id}" data-res="CLR">Clear result</button>` : ''}
        </div>
      `;
      pairsWrap.appendChild(div);
    }
  }

  // renderPairControls removed - now using clickable deck cards directly in renderPairings

  function renderLog() {
    logEl.textContent = state.log.slice().reverse().join("\n");
  }

  // Track current visible bracket round
  let currentBracketRound = 0;

  function renderBracket() {
    bracketWrap.innerHTML = "";
    const br = state.bracket;
    if (!br) {
      bracketWrap.innerHTML = `<div class="muted">No bracket built yet.</div>`;
      return;
    }

    // Check if bracket is complete (has champion)
    const last = br.rounds[br.rounds.length - 1];
    const isComplete = last && last.matches.length === 1 && last.matches[0].result;

    // Initialize current round if needed
    if (currentBracketRound >= br.rounds.length) {
      currentBracketRound = br.rounds.length - 1;
    }

    const totalRounds = br.rounds.length;
    
    // Create navigation header
    if (totalRounds > 1 || isComplete) {
      const navDiv = document.createElement("div");
      navDiv.className = "bracket-navigation";
      
      let navHTML = '<div class="bracket-nav-buttons">';
      
      // Previous round button
      if (currentBracketRound > 0) {
        const prevRound = br.rounds[currentBracketRound - 1];
        navHTML += `<button class="bracket-nav-btn" data-br-nav="${currentBracketRound - 1}">
          ← ${escapeHtml(prevRound.name)}
        </button>`;
      }
      
      // Current round indicator
      if (!isComplete || currentBracketRound < totalRounds) {
        const currentRound = br.rounds[currentBracketRound];
        navHTML += `<span class="bracket-nav-current">${escapeHtml(currentRound.name)}</span>`;
      }
      
      // Next round button
      if (currentBracketRound < totalRounds - 1) {
        const nextRound = br.rounds[currentBracketRound + 1];
        navHTML += `<button class="bracket-nav-btn" data-br-nav="${currentBracketRound + 1}">
          ${escapeHtml(nextRound.name)} →
        </button>`;
      } else if (isComplete && currentBracketRound === totalRounds - 1) {
        navHTML += `<button class="bracket-nav-btn bracket-nav-champion" data-br-nav="champion">
          🏆 Champion →
        </button>`;
      }
      
      navHTML += '</div>';
      navDiv.innerHTML = navHTML;
      bracketWrap.appendChild(navDiv);
    }

    // Show champion view
    if (isComplete && currentBracketRound === 'champion') {
      const f = last.matches[0];
      const champId = f.result === "A" ? f.a : f.b;
      const champ = getDeck(champId);
      
      const champDiv = document.createElement("div");
      champDiv.className = "bracket-champion";
      champDiv.innerHTML = `
        <div class="bracket-champion-trophy">🏆</div>
        <div class="bracket-champion-label">Tournament Champion</div>
        <div class="bracket-champion-name">${escapeHtml(champ ? champ.name : champId)}</div>
        <div class="bracket-champion-actions">
          <button class="primary" id="btnChampionNewTournament">🔄 New Tournament (Keep Decks)</button>
          <button id="btnChampionBackSwiss">← View Swiss Rounds</button>
        </div>
      `;
      bracketWrap.appendChild(champDiv);
      
      // Add event listeners for champion actions
      $("#btnChampionNewTournament")?.addEventListener("click", resetTournament);
      $("#btnChampionBackSwiss")?.addEventListener("click", () => {
        currentBracketRound = 0;
        showSwissView();
        showToast("Returned to Swiss view", 'info');
      });
      
      return;
    }

    // Render only the current round
    const round = br.rounds[currentBracketRound];
    const roundDiv = document.createElement("div");
    roundDiv.className = "bracket-round";
    
    // Round header with advance button
    const headerDiv = document.createElement("div");
    headerDiv.innerHTML = `
      <div class="bracket-round-header">
        <span>${escapeHtml(round.name)}</span>
        ${currentBracketRound === br.rounds.length - 1 && round.matches.every(m => m.result) && round.matches.length > 1
          ? `<button class="primary" data-br-advance="1" style="margin-left: 10px; font-size: 12px;">Advance ▶</button>`
          : ""
        }
      </div>
    `;
    roundDiv.appendChild(headerDiv);

    // Create horizontal layout for matches
    const horizontalDiv = document.createElement("div");
    horizontalDiv.className = "bracket-horizontal";

    const columnDiv = document.createElement("div");
    columnDiv.className = "bracket-column";

    round.matches.forEach((m, idx) => {
      const matchDiv = createBracketMatch(m, currentBracketRound, idx);
      columnDiv.appendChild(matchDiv);
    });

    horizontalDiv.appendChild(columnDiv);
    roundDiv.appendChild(horizontalDiv);
    bracketWrap.appendChild(roundDiv);
  }

  function createBracketMatch(match, roundIdx, matchIdx) {
    const A = getDeck(match.a);
    const B = getDeck(match.b);

    const aName = A ? A.name : match.a;
    const bName = B ? B.name : match.b;
    
    const aSeed = match.aSeed ? `#${match.aSeed}` : '';
    const bSeed = match.bSeed ? `#${match.bSeed}` : '';

    const hasResult = match.result !== null;
    const aWinner = match.result === "A";
    const bWinner = match.result === "B";

    const matchDiv = document.createElement("div");
    matchDiv.className = "pair"; // Same class as Swiss rounds
    
    matchDiv.innerHTML = `
      <div class="pair-header">
        <span class="badge bo5">BO5 - Match ${matchIdx + 1}</span>
        <span class="score-line">${aSeed && bSeed ? `Seed ${aSeed} vs ${bSeed}` : ''}</span>
      </div>
      <div class="pair-body">
        <div class="deck-vs">
          <button class="deck-item deck-a ${aWinner ? 'winner' : ''} ${bWinner ? 'loser' : ''}" 
                  data-br-set="${roundIdx}:${match.id}:A">
            <span class="deck-label">${aSeed ? `SEED ${aSeed}` : 'DECK A'}</span>
            <span class="deck-name">${escapeHtml(aName)}</span>
            ${aWinner ? '<span class="winner-badge">✓ Winner</span>' : ''}
          </button>
          <div class="vs-divider">vs</div>
          <button class="deck-item deck-b ${bWinner ? 'winner' : ''} ${aWinner ? 'loser' : ''}" 
                  data-br-set="${roundIdx}:${match.id}:B">
            <span class="deck-label">${bSeed ? `SEED ${bSeed}` : 'DECK B'}</span>
            <span class="deck-name">${escapeHtml(bName)}</span>
            ${bWinner ? '<span class="winner-badge">✓ Winner</span>' : ''}
          </button>
        </div>
      </div>
      <div class="pair-footer">
        <span class="result-status">${hasResult ? 'Winner selected' : 'Click on the winner'}</span>
        ${hasResult ? `<button class="clear-btn" data-br-set="${roundIdx}:${match.id}:CLR">Clear result</button>` : ''}
      </div>
    `;

    return matchDiv;
  }

  // =========================
  // Tabs System
  // =========================
  function switchTab(tabName) {
    // Analytics opens fullscreen mode now
    if (tabName === "analytics") {
      openAnalyticsFullscreen();
      return;
    }

    // Update tab buttons
    tabButtons.forEach(btn => {
      if (btn.getAttribute("data-tab") === tabName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update tab panes
    tabPanes.forEach(pane => {
      if (pane.id === `tab-${tabName}`) {
        pane.classList.add("active");
      } else {
        pane.classList.remove("active");
      }
    });
  }

  // =========================
  // Analytics Fullscreen Mode
  // =========================
  
  function assignDeckColors() {
    state.decks.forEach((deck, idx) => {
      if (!deckColors[deck.id]) {
        deckColors[deck.id] = colorPalette[idx % colorPalette.length];
      }
    });
  }

  function openAnalyticsFullscreen() {
    assignDeckColors();
    
    // Select all decks by default (up to 10)
    selectedDecks.clear();
    state.decks
      .filter(d => d.wins + d.losses > 0)
      .slice(0, 10)
      .forEach(d => selectedDecks.add(d.id));
    
    analyticsFullscreen.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    renderDeckChips();
    renderAnalyticsFullscreen();
  }

  function closeAnalyticsFullscreen() {
    analyticsFullscreen.style.display = 'none';
    document.body.style.overflow = '';
  }

  function toggleDeck(deckId) {
    if (selectedDecks.has(deckId)) {
      selectedDecks.delete(deckId);
    } else {
      selectedDecks.add(deckId);
    }
    renderDeckChips();
    renderAnalyticsFullscreen();
  }

  function renderDeckChips() {
    const decks = state.decks
      .filter(d => d.wins + d.losses > 0)
      .sort((a, b) => b.wins - a.wins);

    if (decks.length === 0) {
      deckChips.innerHTML = '<div class="chart-empty">No decks with games played yet</div>';
      return;
    }

    let html = '';
    decks.forEach(d => {
      const isActive = selectedDecks.has(d.id);
      const totalGames = d.wins + d.losses;
      const winRate = totalGames > 0 ? ((d.wins / totalGames) * 100).toFixed(0) : '0';
      
      html += `
        <div class="deck-chip ${isActive ? 'active' : ''}" data-deck-id="${d.id}">
          <div class="deck-chip-color" style="background: ${deckColors[d.id]};"></div>
          <span class="deck-chip-name">${escapeHtml(d.name)}</span>
          <span class="deck-chip-stats">${d.wins}-${d.losses} (${winRate}%)</span>
        </div>
      `;
    });

    deckChips.innerHTML = html;
  }

  function renderAnalyticsFullscreen() {
    const selectedDecksList = Array.from(selectedDecks)
      .map(id => state.decks.find(d => d.id === id))
      .filter(d => d);

    if (selectedDecksList.length === 0) {
      chartWinRateLarge.innerHTML = '<div class="chart-empty">Select at least one deck to view analytics</div>';
      chartProgressLarge.innerHTML = '';
      chartHeadToHeadLarge.innerHTML = '';
      statsSummary.innerHTML = '';
      return;
    }

    // Render charts based on toggles
    if (showWinRate.checked) {
      chartWinRateLarge.style.display = 'block';
      renderWinRateChartLarge(selectedDecksList);
    } else {
      chartWinRateLarge.style.display = 'none';
    }

    if (showProgress.checked) {
      chartProgressLarge.style.display = 'block';
      renderProgressChartLarge(selectedDecksList);
    } else {
      chartProgressLarge.style.display = 'none';
    }

    if (showHeadToHead.checked) {
      chartHeadToHeadLarge.style.display = 'block';
      renderHeadToHeadLarge(selectedDecksList);
    } else {
      chartHeadToHeadLarge.style.display = 'none';
    }

    renderStatsSummary(selectedDecksList);
  }

  function renderWinRateChartLarge(decks) {
    const sorted = decks
      .map(d => {
        const totalGames = d.wins + d.losses;
        const winRate = totalGames > 0 ? (d.wins / totalGames) * 100 : 0;
        return { ...d, winRate, totalGames };
      })
      .sort((a, b) => b.winRate - a.winRate);

    const maxRate = 100;
    const barHeight = 40;
    const height = sorted.length * (barHeight + 10) + 60;
    const width = 900;

    let html = '<h2>📊 Win Rate by Deck</h2>';
    let svg = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">`;
    
    sorted.forEach((d, i) => {
      const y = i * (barHeight + 10) + 40;
      const barWidth = (d.winRate / maxRate) * 700;
      const color = deckColors[d.id];
      
      svg += `
        <text x="10" y="${y + 12}" fill="#9ca3af" font-size="14" font-weight="600">${escapeHtml(d.name)}</text>
        <rect x="10" y="${y + 18}" width="${barWidth}" height="${barHeight - 18}" fill="${color}" opacity="0.7" rx="6"/>
        <text x="${barWidth + 20}" y="${y + 35}" fill="#fff" font-size="16" font-weight="600">${d.winRate.toFixed(1)}%</text>
        <text x="${barWidth + 90}" y="${y + 35}" fill="#9ca3af" font-size="14">(${d.wins}-${d.losses})</text>
      `;
    });
    
    svg += `</svg>`;
    html += `<div class="chart-large-content">${svg}</div>`;
    chartWinRateLarge.innerHTML = html;
  }

  function renderProgressChartLarge(decks) {
    if (state.rounds.length === 0) {
      chartProgressLarge.innerHTML = '<h2>📈 Wins Progression</h2><div class="chart-empty">No rounds played yet</div>';
      return;
    }

    const width = 1200;
    const height = 500;
    const padding = { top: 60, right: 200, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxRounds = state.rounds.length;
    const maxWins = Math.max(...decks.map(d => d.wins), 1);

    let html = '<h2>📈 Wins Progression Over Rounds</h2>';
    let svg = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">`;
    
    // Grid lines
    for (let i = 0; i <= maxWins; i++) {
      const y = padding.top + chartHeight - (i / maxWins) * chartHeight;
      svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#1f2a3b" stroke-width="1" stroke-dasharray="5,5"/>`;
      svg += `<text x="${padding.left - 10}" y="${y + 5}" fill="#6b7280" font-size="14" text-anchor="end">${i}</text>`;
    }

    // X-axis labels
    for (let i = 1; i <= maxRounds; i++) {
      const x = padding.left + (i / maxRounds) * chartWidth;
      svg += `<text x="${x}" y="${height - padding.bottom + 25}" fill="#6b7280" font-size="12" text-anchor="middle">R${i}</text>`;
    }

    // Lines for each deck
    decks.forEach((deck, deckIdx) => {
      let points = [[padding.left, padding.top + chartHeight]];
      let winsAcc = 0;

      state.rounds.forEach((round, roundIdx) => {
        round.pairs.forEach(pair => {
          if (pair.result === 'A' && pair.a === deck.id) winsAcc++;
          if (pair.result === 'B' && pair.b === deck.id) winsAcc++;
          if (pair.result === 'BYE' && pair.a === deck.id) winsAcc++;
        });

        const x = padding.left + ((roundIdx + 1) / maxRounds) * chartWidth;
        const y = padding.top + chartHeight - (winsAcc / maxWins) * chartHeight;
        points.push([x, y]);
      });

      const color = deckColors[deck.id];
      const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
      svg += `<path d="${pathData}" stroke="${color}" stroke-width="3" fill="none" opacity="0.9"/>`;
      
      // Points
      points.slice(1).forEach(p => {
        svg += `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${color}"/>`;
      });

      // Legend
      const legendY = padding.top + deckIdx * 25;
      svg += `<rect x="${width - padding.right + 10}" y="${legendY}" width="16" height="16" fill="${color}" rx="3"/>`;
      svg += `<text x="${width - padding.right + 32}" y="${legendY + 12}" fill="#fff" font-size="13" font-weight="600">${escapeHtml(deck.name.slice(0, 18))}</text>`;
    });

    // Axis labels
    svg += `<text x="${width / 2}" y="${height - 10}" fill="#9ca3af" font-size="14" text-anchor="middle" font-weight="600">Rounds</text>`;
    svg += `<text x="25" y="${padding.top - 15}" fill="#9ca3af" font-size="14" font-weight="600">Wins</text>`;

    svg += `</svg>`;
    html += `<div class="chart-large-content">${svg}</div>`;
    chartProgressLarge.innerHTML = html;
  }

  function renderHeadToHeadLarge(decks) {
    if (state.rounds.length === 0) {
      chartHeadToHeadLarge.innerHTML = '<h2>🔥 Head-to-Head Matrix</h2><div class="chart-empty">No matches played yet</div>';
      return;
    }

    // Build matchup matrix
    const matrix = {};
    decks.forEach(d => {
      matrix[d.id] = {};
      decks.forEach(d2 => {
        matrix[d.id][d2.id] = { wins: 0, losses: 0 };
      });
    });

    state.rounds.forEach(round => {
      round.pairs.forEach(pair => {
        const d1 = decks.find(d => d.id === pair.a);
        const d2 = pair.b ? decks.find(d => d.id === pair.b) : null;
        
        if (d1 && d2) {
          if (pair.result === 'A') {
            matrix[pair.a][pair.b].wins++;
            matrix[pair.b][pair.a].losses++;
          } else if (pair.result === 'B') {
            matrix[pair.b][pair.a].wins++;
            matrix[pair.a][pair.b].losses++;
          }
        }
      });
    });

    let html = '<h2>🔥 Head-to-Head Match Records</h2>';
    html += '<div style="overflow-x:auto;"><table style="font-size:13px; border-collapse:collapse; width:100%;">';
    html += '<tr><th style="padding:12px; text-align:left;"></th>';
    decks.forEach(d => {
      html += `<th style="padding:12px; text-align:center; color:${deckColors[d.id]}; font-weight:700;">${escapeHtml(d.name.slice(0, 12))}</th>`;
    });
    html += '</tr>';

    decks.forEach(d1 => {
      html += `<tr><td style="padding:12px; font-weight:700; color:${deckColors[d1.id]};">${escapeHtml(d1.name)}</td>`;
      decks.forEach(d2 => {
        if (d1.id === d2.id) {
          html += '<td style="padding:12px; text-align:center; background:rgba(255,255,255,.05);">—</td>';
        } else {
          const data = matrix[d1.id][d2.id];
          const total = data.wins + data.losses;
          if (total === 0) {
            html += '<td style="padding:12px; text-align:center; color:#6b7280;">0-0</td>';
          } else {
            const winRate = (data.wins / total) * 100;
            const bgColor = winRate >= 60 ? 'rgba(45,212,191,.25)' : winRate >= 40 ? 'rgba(251,191,36,.25)' : 'rgba(248,113,113,.25)';
            const textColor = winRate >= 60 ? '#2dd4bf' : winRate >= 40 ? '#fbbf24' : '#f87171';
            html += `<td style="padding:12px; text-align:center; background:${bgColor}; color:${textColor}; font-weight:700;">${data.wins}-${data.losses}</td>`;
          }
        }
      });
      html += '</tr>';
    });

    html += '</table></div>';
    chartHeadToHeadLarge.innerHTML = html;
  }

  function renderStatsSummary(decks) {
    const totalGames = decks.reduce((sum, d) => sum + d.wins + d.losses, 0);
    const totalWins = decks.reduce((sum, d) => sum + d.wins, 0);
    const avgWinRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : '0.0';
    const bestDeck = decks.reduce((best, d) => {
      const total = d.wins + d.losses;
      const rate = total > 0 ? d.wins / total : 0;
      return rate > (best.rate || 0) ? { deck: d, rate } : best;
    }, {});

    let html = `
      <div class="stat-card">
        <div class="stat-label">Selected Decks</div>
        <div class="stat-value">${decks.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Games</div>
        <div class="stat-value">${totalGames}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Average Win Rate</div>
        <div class="stat-value">${avgWinRate}%</div>
      </div>
    `;

    if (bestDeck.deck) {
      html += `
        <div class="stat-card">
          <div class="stat-label">Best Performer</div>
          <div class="stat-value" style="font-size:18px; color:${deckColors[bestDeck.deck.id]};">${escapeHtml(bestDeck.deck.name)}</div>
          <div class="stat-label">${(bestDeck.rate * 100).toFixed(1)}% Win Rate</div>
        </div>
      `;
    }

    statsSummary.innerHTML = html;
  }

  // =========================
  // Analytics & Charts
  // =========================
  function renderAnalytics() {
    renderWinRateChart();
    renderProgressChart();
    renderStatusChart();
    renderHeadToHeadMatrix();
    renderLeaderboard();
  }

  function renderWinRateChart() {
    if (state.decks.length === 0) {
      chartWinRate.innerHTML = '<div class="chart-empty">No decks registered yet</div>';
      return;
    }

    const decks = state.decks
      .map(d => {
        const totalGames = d.wins + d.losses;
        const winRate = totalGames > 0 ? (d.wins / totalGames) * 100 : 0;
        return { name: d.name, winRate, wins: d.wins, losses: d.losses };
      })
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 10);

    if (decks.length === 0) {
      chartWinRate.innerHTML = '<div class="chart-empty">No games played yet</div>';
      return;
    }

    const maxRate = Math.max(...decks.map(d => d.winRate), 100);
    const height = 30 * decks.length + 40;

    let svg = `<svg width="100%" height="${height}" viewBox="0 0 400 ${height}">`;
    
    decks.forEach((d, i) => {
      const y = i * 30 + 20;
      const barWidth = (d.winRate / maxRate) * 300;
      const color = d.winRate >= 60 ? '#2dd4bf' : d.winRate >= 40 ? '#fbbf24' : '#f87171';
      
      svg += `
        <text x="5" y="${y + 5}" fill="#9ca3af" font-size="12" font-weight="600">${escapeHtml(d.name.slice(0, 20))}</text>
        <rect x="0" y="${y + 8}" width="${barWidth}" height="16" fill="${color}" opacity="0.6" rx="4"/>
        <text x="${barWidth + 5}" y="${y + 20}" fill="#fff" font-size="11">${d.winRate.toFixed(0)}% (${d.wins}-${d.losses})</text>
      `;
    });
    
    svg += `</svg>`;
    chartWinRate.innerHTML = svg;
  }

  function renderProgressChart() {
    if (state.rounds.length === 0) {
      chartProgress.innerHTML = '<div class="chart-empty">No rounds played yet</div>';
      return;
    }

    // Track top 5 decks progression
    const topDecks = state.decks
      .filter(d => d.wins + d.losses > 0)
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 5);

    if (topDecks.length === 0) {
      chartProgress.innerHTML = '<div class="chart-empty">No games completed yet</div>';
      return;
    }

    const colors = ['#2dd4bf', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa'];
    const width = 380;
    const height = 200;
    const padding = { top: 20, right: 60, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxRounds = state.rounds.length;
    const maxWins = Math.max(...topDecks.map(d => d.wins), 1);

    let svg = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">`;
    
    // Grid lines
    for (let i = 0; i <= maxWins; i++) {
      const y = padding.top + chartHeight - (i / maxWins) * chartHeight;
      svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#1f2a3b" stroke-width="1"/>`;
      svg += `<text x="${padding.left - 5}" y="${y + 4}" fill="#6b7280" font-size="10" text-anchor="end">${i}</text>`;
    }

    // Lines for each deck
    topDecks.forEach((deck, deckIdx) => {
      let points = [[padding.left, padding.top + chartHeight]];
      let winsAcc = 0;

      state.rounds.forEach((round, roundIdx) => {
        round.pairs.forEach(pair => {
          if (pair.result === 'A' && pair.a === deck.id) winsAcc++;
          if (pair.result === 'B' && pair.b === deck.id) winsAcc++;
          if (pair.result === 'BYE' && pair.a === deck.id) winsAcc++;
        });

        const x = padding.left + ((roundIdx + 1) / maxRounds) * chartWidth;
        const y = padding.top + chartHeight - (winsAcc / maxWins) * chartHeight;
        points.push([x, y]);
      });

      const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
      svg += `<path d="${pathData}" stroke="${colors[deckIdx]}" stroke-width="2" fill="none"/>`;
      
      // Label at end
      const lastPoint = points[points.length - 1];
      svg += `<text x="${lastPoint[0] + 5}" y="${lastPoint[1] + 4}" fill="${colors[deckIdx]}" font-size="10" font-weight="600">${escapeHtml(deck.name.slice(0, 12))}</text>`;
    });

    // X-axis labels
    svg += `<text x="${padding.left}" y="${height - 5}" fill="#6b7280" font-size="10">R1</text>`;
    svg += `<text x="${width - padding.right}" y="${height - 5}" fill="#6b7280" font-size="10" text-anchor="end">R${maxRounds}</text>`;

    svg += `</svg>`;
    chartProgress.innerHTML = svg;
  }

  function renderStatusChart() {
    const active = state.decks.filter(d => d.status === 'active').length;
    const advanced = state.decks.filter(d => d.status === 'advanced').length;
    const eliminated = state.decks.filter(d => d.status === 'eliminated').length;
    const total = state.decks.length;

    if (total === 0) {
      chartStatus.innerHTML = '<div class="chart-empty">No decks registered yet</div>';
      return;
    }

    const data = [
      { label: 'Active', value: active, color: '#60a5fa' },
      { label: 'Advanced', value: advanced, color: '#2dd4bf' },
      { label: 'Eliminated', value: eliminated, color: '#f87171' }
    ].filter(d => d.value > 0);

    const cx = 100;
    const cy = 100;
    const radius = 70;
    let currentAngle = -90;

    let svg = `<svg width="100%" height="220" viewBox="0 0 300 220">`;

    data.forEach((d, i) => {
      const angle = (d.value / total) * 360;
      const endAngle = currentAngle + angle;
      const startRad = (currentAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      svg += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${d.color}" opacity="0.8"/>`;
      
      currentAngle = endAngle;
    });

    // Legend
    let legendY = 40;
    data.forEach(d => {
      const pct = ((d.value / total) * 100).toFixed(1);
      svg += `<rect x="210" y="${legendY}" width="12" height="12" fill="${d.color}" rx="2"/>`;
      svg += `<text x="228" y="${legendY + 10}" fill="#fff" font-size="12" font-weight="600">${d.label}</text>`;
      svg += `<text x="228" y="${legendY + 22}" fill="#9ca3af" font-size="10">${d.value} (${pct}%)</text>`;
      legendY += 40;
    });

    svg += `</svg>`;
    chartStatus.innerHTML = svg;
  }

  function renderHeadToHeadMatrix() {
    if (state.rounds.length === 0) {
      chartHeadToHead.innerHTML = '<div class="chart-empty">No matches played yet</div>';
      return;
    }

    // Build matchup matrix
    const matrix = {};
    state.decks.forEach(d => {
      matrix[d.id] = {};
      state.decks.forEach(d2 => {
        matrix[d.id][d2.id] = { wins: 0, losses: 0 };
      });
    });

    state.rounds.forEach(round => {
      round.pairs.forEach(pair => {
        if (pair.result === 'A' && pair.b) {
          matrix[pair.a][pair.b].wins++;
          matrix[pair.b][pair.a].losses++;
        } else if (pair.result === 'B' && pair.b) {
          matrix[pair.b][pair.a].wins++;
          matrix[pair.a][pair.b].losses++;
        }
      });
    });

    // Get top 8 decks for readability
    const topDecks = state.decks
      .filter(d => d.wins + d.losses > 0)
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 8);

    if (topDecks.length < 2) {
      chartHeadToHead.innerHTML = '<div class="chart-empty">Need at least 2 decks with matches</div>';
      return;
    }

    let html = '<div style="overflow-x:auto;"><table style="font-size:11px; border-collapse:collapse; min-width:100%;">';
    html += '<tr><th></th>';
    topDecks.forEach(d => {
      html += `<th style="padding:4px; text-align:center; font-size:10px; max-width:60px; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(d.name.slice(0, 10))}</th>`;
    });
    html += '</tr>';

    topDecks.forEach(d1 => {
      html += `<tr><td style="padding:4px; font-weight:600; max-width:80px; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(d1.name.slice(0, 12))}</td>`;
      topDecks.forEach(d2 => {
        if (d1.id === d2.id) {
          html += '<td style="padding:4px; text-align:center; background:rgba(255,255,255,.05);">-</td>';
        } else {
          const data = matrix[d1.id][d2.id];
          const total = data.wins + data.losses;
          if (total === 0) {
            html += '<td style="padding:4px; text-align:center; color:#6b7280;">-</td>';
          } else {
            const winRate = (data.wins / total) * 100;
            const bgColor = winRate >= 60 ? 'rgba(45,212,191,.2)' : winRate >= 40 ? 'rgba(251,191,36,.2)' : 'rgba(248,113,113,.2)';
            html += `<td style="padding:4px; text-align:center; background:${bgColor};">${data.wins}-${data.losses}</td>`;
          }
        }
      });
      html += '</tr>';
    });

    html += '</table></div>';
    chartHeadToHead.innerHTML = html;
  }

  function renderLeaderboard() {
    const rankedDecks = state.decks
      .filter(d => d.wins + d.losses > 0)
      .sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (a.losses !== b.losses) return a.losses - b.losses;
        return strengthOfSchedule(b) - strengthOfSchedule(a);
      })
      .slice(0, 10);

    if (rankedDecks.length === 0) {
      leaderboard.innerHTML = '<div class="chart-empty">No games completed yet</div>';
      return;
    }

    let html = '';
    rankedDecks.forEach((d, i) => {
      const totalGames = d.wins + d.losses;
      const winRate = totalGames > 0 ? ((d.wins / totalGames) * 100).toFixed(1) : '0.0';
      const rank = i + 1;
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;

      html += `
        <div class="leaderboard-item">
          <div class="leaderboard-rank">${medal}</div>
          <div>
            <div class="leaderboard-name">${escapeHtml(d.name)}</div>
            <div class="leaderboard-stat">${d.wins}-${d.losses} • SoS: ${strengthOfSchedule(d)}</div>
          </div>
          <div class="leaderboard-badge">${winRate}%</div>
          <div class="leaderboard-stat">${d.status === 'advanced' ? '✓ Advanced' : d.status === 'eliminated' ? '✗ Eliminated' : '▶ Active'}</div>
        </div>
      `;
    });

    leaderboard.innerHTML = html;
  }

  function renderAll() {
    renderKPIs();
    renderDecksTable();
    renderPairs();
    renderBracket();
    renderLog();

    btnNextRound.disabled = !canGenerateRound() || !currentRoundComplete();
    btnUndoRound.disabled = state.rounds.length === 0;
    
    // Show correct view based on bracket state
    if (state.bracket && state.bracket.rounds && state.bracket.rounds.length > 0) {
      showBracketView();
    } else {
      showSwissView();
    }
  }

  // =========================
  // Actions
  // =========================
  function addDeck(name) {
    const n = name.trim();
    if (!n) return;
    state.decks.push({
      id: uid(),
      name: n,
      wins: 0,
      losses: 0,
      status: "active",
      opponents: [],
      byeCount: 0
    });
    save();
    log(`Deck added: ${n}.`);
    showToast(`✓ Deck added: ${n}`, 'success');
    renderAll();
  }

  function removeDeck(id) {
    const d = getDeck(id);
    if (!d) return;
    if (state.rounds.length > 0) {
      if (!confirm("There are already registered rounds. Removing may break history. Remove anyway?")) return;
    }
    const deckName = d.name;
    state.decks = state.decks.filter(x => x.id !== id);
    state.decks.forEach(x => x.opponents = x.opponents.filter(oid => oid !== id));
    save();
    log(`Deck removed: ${deckName}.`);
    showToast(`Deck removed: ${deckName}`, 'info');
    renderAll();
  }

  function renameDeck(id) {
    const d = getDeck(id);
    if (!d) return;
    const oldName = d.name;
    const n = prompt("New deck name:", d.name);
    if (!n || n.trim() === oldName) return;
    d.name = n.trim() || d.name;
    save();
    log(`Deck renamed: ${d.name}.`);
    showToast(`Deck renamed to: ${d.name}`, 'success');
    renderAll();
  }

  function resetTournament() {
    if (!confirm("Reset tournament? This will clear all rounds and bracket but KEEP your decks registered.")) return;
    
    // Keep decks but reset their stats
    state.decks.forEach(d => {
      d.wins = 0;
      d.losses = 0;
      d.status = "active";
      d.opponents = [];
      d.byeCount = 0;
    });
    
    // Clear rounds and bracket
    state.rounds = [];
    state.bracket = null;
    currentBracketRound = 0;
    
    // Keep some log entries about reset
    state.log.push(`[${new Date().toLocaleString("en-US")}] Tournament reset. ${state.decks.length} decks preserved.`);
    
    save();
    showSwissView(); // Return to Swiss view
    showToast("🔄 Tournament reset - decks preserved", 'success');
    renderAll();
  }

  function resetAll() {
    if (!confirm("Reset EVERYTHING? This will delete all decks, rounds, and brackets. Use 'Reset Tournament' to keep decks.")) return;
    state = { decks: [], rounds: [], bracket: null, log: [] };
    localStorage.removeItem(LS_KEY);
    showSwissView(); // Return to Swiss view
    showToast("🗑️ All data has been reset", 'warning');
    renderAll();
  }

  function seedExample20() {
    if (state.decks.length > 0) {
      if (!confirm("Decks already registered. Add examples anyway?")) return;
    }
    const examples = [
      "Burn", "Izzet Spells", "Azorius Control", "Mono Green Stompy",
      "Rakdos Midrange", "Elves", "Bogles", "Tron", "Affinity", "Goblins",
      "Dimir Faeries", "Boros Synth", "Jeskai Ephemerate", "Gruul Aggro",
      "Orzhov Lifegain", "Selesnya Auras", "Storm", "Merfolk", "Reanimator", "Humans"
    ];
    
    // Temporarily disable toasts for bulk add
    const oldShowToast = showToast;
    window.showToastEnabled = false;
    
    examples.forEach(n => {
      state.decks.push({
        id: uid(),
        name: n,
        wins: 0,
        losses: 0,
        status: "active",
        opponents: [],
        byeCount: 0
      });
    });
    
    window.showToastEnabled = true;
    save();
    log(`Added ${examples.length} example decks.`);
    showToast(`✓ ${examples.length} example decks added`, 'success');
    renderAll();
  }

  function nextRound() {
    const pairs = makeSwissPairs();
    if (!pairs) return;

    const round = {
      round: state.rounds.length + 1,
      pairs,
      createdAt: now()
    };
    state.rounds.push(round);
    state.bracket = null;
    save();
    log(`Round ${round.round} generated with ${pairs.length} pairings.`);
    showToast(`🎲 Round ${round.round} generated with ${pairs.length} pairings`, 'success', 4000);
    renderAll();
  }

  function undoRound() {
    const r = lastRound();
    if (!r) return;
    if (!confirm(`Undo round ${r.round}? This will remove results and revert scores.`)) return;

    const roundNum = r.round;
    for (const p of r.pairs) {
      if (p.result !== null) {
        rollbackPairResult(p, p.result);
        p.result = null;
      }
    }
    state.rounds.pop();
    state.decks.forEach(d => clampStatus(d));

    save();
    log(`Round ${roundNum} undone.`);
    showToast(`↩️ Round ${roundNum} undone`, 'warning');
    renderAll();
  }

  function applyAutoBye() {
    const r = lastRound();
    if (!r) return;
    let count = 0;
    for (const p of r.pairs) {
      if (p.b === null && p.result === null) {
        applyPairResult(p, "BYE");
        count++;
      }
    }
    if (count === 0) {
      showToast("No pending BYE in this round", 'info');
      alert("No pending BYE in this round.");
    } else {
      showToast(`✓ Applied ${count} BYE(s)`, 'success');
    }
  }

  // =========================
  // Event Listeners
  // =========================

  // Tabs navigation
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabName = btn.getAttribute("data-tab");
      switchTab(tabName);
    });
  });

  // Format Configuration
  formatPreset.addEventListener("change", () => {
    const preset = formatPreset.value;
    if (preset !== 'custom' && formatPresets[preset]) {
      const config = formatPresets[preset];
      winsNeeded.value = config.wins;
      lossesNeeded.value = config.losses;
      normalFormat.value = config.normal;
      decisiveFormat.value = config.decisive;
    }
  });

  // When manual fields change, set preset to custom
  [winsNeeded, lossesNeeded, normalFormat, decisiveFormat].forEach(el => {
    el.addEventListener("change", () => {
      formatPreset.value = 'custom';
    });
  });

  btnApplyFormat.addEventListener("click", () => {
    buttonFeedback(btnApplyFormat, true);
    applyFormatFromUI();
  });

  btnToggleFormat.addEventListener("click", toggleFormatConfig);

  // Analytics Fullscreen
  btnCloseAnalytics.addEventListener("click", closeAnalyticsFullscreen);
  
  // Deck chips selection
  deckChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".deck-chip");
    if (chip) {
      const deckId = chip.getAttribute("data-deck-id");
      toggleDeck(deckId);
    }
  });

  // Chart toggles
  showWinRate.addEventListener("change", renderAnalyticsFullscreen);
  showProgress.addEventListener("change", renderAnalyticsFullscreen);
  showHeadToHead.addEventListener("change", renderAnalyticsFullscreen);

  btnAddDeck.addEventListener("click", () => {
    if (deckName.value.trim()) {
      buttonFeedback(btnAddDeck, true);
      addDeck(deckName.value);
      deckName.value = "";
      deckName.focus();
    }
  });

  deckName.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btnAddDeck.click();
  });

  btnSeedExample.addEventListener("click", seedExample20);
  btnResetTournament.addEventListener("click", resetTournament);
  btnResetAll.addEventListener("click", resetAll);

  btnNextRound.addEventListener("click", nextRound);
  btnUndoRound.addEventListener("click", undoRound);
  btnAutoFinish.addEventListener("click", applyAutoBye);

  $("#decksTable").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    const act = btn.getAttribute("data-act");
    if (!id || !act) return;
    if (act === "remove") removeDeck(id);
    if (act === "rename") renameDeck(id);
  });

  pairsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const pairId = btn.getAttribute("data-pair");
    const res = btn.getAttribute("data-res");
    if (!pairId || !res) return;

    const r = lastRound();
    if (!r) return;
    const p = r.pairs.find(x => x.id === pairId);
    if (!p) return;

    if (res === "CLR") {
      if (p.result !== null) {
        buttonFeedback(btn, false);
        rollbackPairResult(p, p.result);
        p.result = null;
        p.format = p.b ? (isDecisive(p.a, p.b) ? tournamentFormat.decisive : tournamentFormat.normal) : tournamentFormat.normal;
        save();
        log("Result cleared for a pairing in the current round.");
        renderAll();
      }
      return;
    }

    if (res === "BYE" && p.b !== null) return;

    buttonFeedback(btn, true);
    applyPairResult(p, res);

    const rr = lastRound();
    if (rr) {
      for (const pp of rr.pairs) {
        if (pp.result === null && pp.b) {
          pp.format = isDecisive(pp.a, pp.b) ? tournamentFormat.decisive : tournamentFormat.normal;
        }
      }
      save();
      renderAll();
    }
  });

  btnBuildBracket.addEventListener("click", buildBracket);
  btnSimBracket.addEventListener("click", simulateBracket);
  btnCloseBracket.addEventListener("click", () => {
    showSwissView();
    showToast('Returned to Swiss view', 'info');
  });

  bracketWrap.addEventListener("click", (e) => {
    // Navigation buttons
    const navBtn = e.target.closest("button[data-br-nav]");
    if (navBtn) {
      const target = navBtn.getAttribute("data-br-nav");
      if (target === 'champion') {
        currentBracketRound = 'champion';
      } else {
        currentBracketRound = parseInt(target, 10);
      }
      renderBracket();
      return;
    }

    // Advance button
    const adv = e.target.closest("button[data-br-advance]");
    if (adv) {
      bracketAdvance();
      showToast('⏭️ Advanced to next round', 'success');
      return;
    }

    // Match result buttons
    const b = e.target.closest("button[data-br-set]");
    if (!b) return;
    const [ri, mid, res] = b.getAttribute("data-br-set").split(":");
    const roundIdx = parseInt(ri, 10);
    
    if (res === "CLR") {
      setBracketResult(roundIdx, mid, null);
      showToast('Result cleared', 'info', 2000);
    } else {
      buttonFeedback(b, true);
      setBracketResult(roundIdx, mid, res);
      
      // Get match info for better toast message
      const round = state.bracket?.rounds[roundIdx];
      const match = round?.matches.find(m => m.id === mid);
      if (match) {
        const winner = res === 'A' ? getDeck(match.a) : getDeck(match.b);
        if (winner) {
          showToast(`✓ ${winner.name} advances!`, 'success', 2500);
        }
      }
    }
  });

  btnExport.addEventListener("click", () => {
    jsonBox.value = JSON.stringify(state, null, 2);
    jsonBox.focus();
    jsonBox.select();
    log("JSON export generated.");
    showToast("📋 JSON copied to clipboard area", 'success');
  });

  btnDownload.addEventListener("click", () => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    a.href = url;
    a.download = `swiss-tournament-${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    log("JSON file downloaded.");
    showToast("💾 Backup file downloaded!", 'success');
  });

  btnImport.addEventListener("click", () => {
    const txt = jsonBox.value.trim();
    if (!txt) {
      showToast("Paste a JSON in the field before importing", 'warning');
      return alert("Paste a JSON in the field before importing.");
    }
    try {
      const parsed = JSON.parse(txt);
      if (!parsed || !Array.isArray(parsed.decks) || !Array.isArray(parsed.rounds)) {
        showToast("Invalid JSON format", 'error');
        return alert("Invalid JSON (doesn't appear to be from this app).");
      }
      state = parsed;
      state.log = Array.isArray(state.log) ? state.log : [];
      state.bracket = state.bracket ?? null;
      state.decks.forEach(d => {
        d.opponents = Array.isArray(d.opponents) ? d.opponents : [];
        d.byeCount = typeof d.byeCount === "number" ? d.byeCount : 0;
        clampStatus(d);
      });
      save();
      log("JSON import applied.");
      showToast("✓ Data imported successfully!", 'success');
      renderAll();
    } catch (err) {
      showToast("Failed to import: " + err.message, 'error');
      alert("Failed to import JSON: " + err.message);
    }
  });

  // =========================
  // Event Listeners - New Features
  // =========================
  
  // Timer controls
  btnTimerStart.addEventListener('click', startTimer);
  btnTimerPause.addEventListener('click', pauseTimer);
  btnTimerReset.addEventListener('click', resetTimer);
  
  // Timer presets
  document.querySelectorAll('.timer-presets button').forEach(btn => {
    btn.addEventListener('click', () => {
      const minutes = parseInt(btn.getAttribute('data-minutes'), 10);
      setTimerDuration(minutes);
    });
  });
  
  // History navigation
  btnViewHistory.addEventListener('click', showHistory);
  btnCloseHistory.addEventListener('click', hideHistory);
  btnHistoryPrev.addEventListener('click', () => navigateHistory(-1));
  btnHistoryNext.addEventListener('click', () => navigateHistory(1));
  historyRoundSelect.addEventListener('change', (e) => {
    currentHistoryRound = parseInt(e.target.value, 10);
    renderHistoryRound();
  });
  
  // Tournament archive
  btnSaveTournament.addEventListener('click', saveTournament);
  btnCompare.addEventListener('click', showComparison);
  btnCloseComparison.addEventListener('click', hideComparison);
  
  tournamentList.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    
    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');
    if (!action || !id) return;
    
    if (action === 'load') loadTournament(id);
    if (action === 'delete') deleteTournament(id);
  });
  
  // Presentation mode
  presentationToggle.addEventListener('click', togglePresentationMode);

  // =========================
  // Initialize
  // =========================
  updateFormatUI();
  updateSubtitle();
  state.decks.forEach(clampStatus);
  save();
  renderAll();
  updateTimerDisplay();
  renderTournamentList();
  
  // Hide format config if tournament already started
  if (state.decks.length > 0 || state.rounds.length > 0) {
    formatConfigSection.classList.add('hidden');
  }

})();
