// ============================================================
// DED — Football Dashboard
// Upcoming matches + watched toggles + day rating
// Uses football-data.org API (free tier)
// ============================================================

const FootballDashboard = (() => {
  let currentDate = Store.todayStr();
  let isLoading = false;

  // Competition IDs from football-data.org free tier
  const COMPETITIONS = {
    'PL':  { name: 'Premier League',   emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', id: 2021 },
    'PD':  { name: 'La Liga',          emoji: '🇪🇸', id: 2014 },
    'BL1': { name: 'Bundesliga',        emoji: '🇩🇪', id: 2002 },
    'SA':  { name: 'Serie A',          emoji: '🇮🇹', id: 2019 },
    'FL1': { name: 'Ligue 1',          emoji: '🇫🇷', id: 2015 },
    'CL':  { name: 'Champions League', emoji: '🏆', id: 2001 },
    'WC':  { name: 'FIFA World Cup',   emoji: '🌍', id: 2000 },
  };

  // Priority order (World Cup highest)
  const COMP_ORDER = ['WC', 'CL', 'PL', 'PD', 'BL1', 'SA', 'FL1'];

  // --- API Key Note ---
  // football-data.org requires a free API key.
  // For now we'll use a demo/fallback approach.
  const API_BASE = 'https://api.football-data.org/v4';

  async function fetchMatches(date) {
    // Check cache first
    const cached = Store.Football.getCachedMatches(date);
    if (cached) return cached.matches;

    // Try to fetch from API
    const API_KEY = localStorage.getItem('ded_football_api_key') || '';

    if (!API_KEY) {
      return getDemoMatches(date);
    }

    try {
      const res = await fetch(`${API_BASE}/matches?dateFrom=${date}&dateTo=${date}`, {
        headers: { 'X-Auth-Token': API_KEY }
      });

      if (!res.ok) {
        console.warn('Football API error:', res.status);
        return getDemoMatches(date);
      }

      const data = await res.json();
      const matches = (data.matches || [])
        .filter(m => COMP_ORDER.includes(m.competition.code))
        .map(m => ({
          match_id: m.id,
          competition: m.competition.code,
          competition_name: m.competition.name,
          home_team: m.homeTeam.shortName || m.homeTeam.name,
          away_team: m.awayTeam.shortName || m.awayTeam.name,
          home_crest: m.homeTeam.crest || '',
          away_crest: m.awayTeam.crest || '',
          utc_date: m.utcDate,
          status: m.status,
          score_home: m.score?.fullTime?.home ?? null,
          score_away: m.score?.fullTime?.away ?? null,
        }));

      Store.Football.setCachedMatches(date, matches);
      return matches;
    } catch (err) {
      console.warn('Football API fetch failed:', err);
      return getDemoMatches(date);
    }
  }

  function getDemoMatches(date) {
    // Generate demo/placeholder matches so the UI is functional without an API key
    const dayOfWeek = new Date(date + 'T00:00:00').getDay();

    // Only show matches on certain days (realistic schedule)
    if (dayOfWeek === 1 || dayOfWeek === 4) return []; // Mon/Thu usually quiet

    const demoPool = [
      { comp: 'PL', home: 'Arsenal', away: 'Chelsea', time: '17:30' },
      { comp: 'PL', home: 'Man City', away: 'Liverpool', time: '20:00' },
      { comp: 'PL', home: 'Man United', away: 'Tottenham', time: '15:00' },
      { comp: 'PD', home: 'Barcelona', away: 'Real Madrid', time: '21:00' },
      { comp: 'PD', home: 'Atlético Madrid', away: 'Sevilla', time: '18:30' },
      { comp: 'BL1', home: 'Bayern Munich', away: 'Dortmund', time: '18:30' },
      { comp: 'SA', home: 'Inter Milan', away: 'AC Milan', time: '20:45' },
      { comp: 'SA', home: 'Juventus', away: 'Napoli', time: '18:00' },
      { comp: 'FL1', home: 'PSG', away: 'Lyon', time: '21:00' },
      { comp: 'CL', home: 'Real Madrid', away: 'Man City', time: '21:00' },
      { comp: 'CL', home: 'Barcelona', away: 'Bayern Munich', time: '21:00' },
    ];

    // Pick a subset based on date hash for variety
    const hash = date.split('-').reduce((a, b) => a + parseInt(b), 0);
    const count = dayOfWeek === 0 || dayOfWeek === 6 ? 5 : 3; // More on weekends
    const startIdx = hash % demoPool.length;

    const matches = [];
    for (let i = 0; i < count; i++) {
      const m = demoPool[(startIdx + i) % demoPool.length];
      matches.push({
        match_id: `demo_${date}_${i}`,
        competition: m.comp,
        competition_name: COMPETITIONS[m.comp]?.name || m.comp,
        home_team: m.home,
        away_team: m.away,
        home_crest: '',
        away_crest: '',
        utc_date: `${date}T${m.time}:00Z`,
        status: date < Store.todayStr() ? 'FINISHED' : 'SCHEDULED',
        score_home: date < Store.todayStr() ? Math.floor(Math.random() * 4) : null,
        score_away: date < Store.todayStr() ? Math.floor(Math.random() * 3) : null,
      });
    }

    return matches;
  }

  function renderMatch(match, isWatched) {
    const time = new Date(match.utc_date).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: false
    });

    const scoreOrTime = match.status === 'FINISHED'
      ? `<span class="match-score">${match.score_home} — ${match.score_away}</span>`
      : `<span class="match-time">${time}</span>`;

    const homeCrest = match.home_crest
      ? `<img src="${match.home_crest}" alt="" onerror="this.style.display='none'">`
      : '';
    const awayCrest = match.away_crest
      ? `<img src="${match.away_crest}" alt="" onerror="this.style.display='none'">`
      : '';

    return `
      <div class="match-card ${isWatched ? 'watched' : ''}" data-match-id="${match.match_id}">
        <div class="match-teams">
          <div class="match-team">
            ${homeCrest}
            <span>${match.home_team}</span>
          </div>
          ${scoreOrTime}
          <div class="match-team match-team--away">
            <span>${match.away_team}</span>
            ${awayCrest}
          </div>
        </div>
        <button class="watch-toggle ${isWatched ? 'watched' : ''}" data-match-id="${match.match_id}" title="Mark as watched">
          ${isWatched ? '✓' : '👁'}
        </button>
      </div>
    `;
  }

  function renderMatchesByCompetition(matches, watchedList) {
    if (!matches.length) {
      return `
        <div class="no-matches">
          <div class="no-matches__icon">⚽</div>
          <div class="no-matches__text">No matches scheduled for this day</div>
        </div>
      `;
    }

    // Group by competition
    const grouped = {};
    COMP_ORDER.forEach(code => { grouped[code] = []; });

    matches.forEach(m => {
      if (grouped[m.competition]) {
        grouped[m.competition].push(m);
      }
    });

    let html = '';
    COMP_ORDER.forEach(code => {
      const compMatches = grouped[code];
      if (!compMatches || compMatches.length === 0) return;

      const comp = COMPETITIONS[code];
      html += `
        <div class="competition-section">
          <div class="competition-header">
            <span>${comp.emoji}</span>
            <span class="competition-name">${comp.name}</span>
            <span class="competition-count">${compMatches.length} match${compMatches.length > 1 ? 'es' : ''}</span>
          </div>
          <div class="matches-list">
            ${compMatches.map(m => renderMatch(m, watchedList.includes(m.match_id))).join('')}
          </div>
        </div>
      `;
    });

    return html;
  }

  function renderLoading() {
    return `
      <div class="football-loading">
        <div class="football-loading__spinner"></div>
        <div class="football-loading__text">Loading matches...</div>
      </div>
    `;
  }

  async function render() {
    const entry = Store.Football.getDailyEntry(currentDate);
    const weeklyStats = Store.Football.getWeeklyStats();

    let matchesHtml;
    if (isLoading) {
      matchesHtml = renderLoading();
    } else {
      const matches = await fetchMatches(currentDate);
      matchesHtml = renderMatchesByCompetition(matches, entry.matches_watched || []);
    }

    const watchedCount = (entry.matches_watched || []).length;
    const hasApiKey = !!localStorage.getItem('ded_football_api_key');

    return `
      <div class="section-header">
        <div>
          <div class="section-title" style="color: var(--accent-football);">Football</div>
          <div class="section-subtitle">Match Tracker — Top European Leagues</div>
        </div>
        ${Components.dateNav(currentDate)}
      </div>

      <div class="bento-grid bento-grid--3col" style="margin-bottom: var(--sp-6);">
        ${Components.card('Watched Today', `
          <div class="card-metric card-metric--lg" style="color: var(--accent-football);">${watchedCount}</div>
          <div class="card-sub"><span class="card-sub-value">matches</span></div>
        `, { spanClass: 'col-span-1', accentClass: 'card--football', icon: '👁' })}

        ${Components.card('Weekly Stats', `
          <div class="field-summary-metrics">
            <div class="field-metric">
              <span class="field-metric__value" style="color: var(--accent-football);">${weeklyStats.watched_7d}</span>
              <span class="field-metric__label">Watched (7D)</span>
            </div>
            <div class="field-metric">
              <span class="field-metric__value" style="color: var(--accent-football);">${weeklyStats.avg_rating_7d}</span>
              <span class="field-metric__label">Avg Rating</span>
            </div>
          </div>
        `, { spanClass: 'col-span-1', accentClass: 'card--football', icon: '📊' })}

        ${Components.card('Day Rating', `
          <div class="rating-row" style="justify-content: center;">
            ${Components.starRating('football_day', entry.rating_day || 0)}
          </div>
        `, { spanClass: 'col-span-1', accentClass: 'card--football', icon: '⭐' })}
      </div>

      ${!hasApiKey ? `
        <div class="card" style="margin-bottom: var(--sp-4); border-left: 2px solid var(--accent-football);">
          <div class="card-body" style="flex-direction: row; align-items: center; gap: var(--sp-4);">
            <span style="font-size: var(--fs-lg);">🔑</span>
            <div style="flex:1;">
              <div class="text-label" style="margin-bottom: var(--sp-1);">API Key</div>
              <span class="text-secondary" style="font-size: var(--fs-sm);">
                Add a free football-data.org API key for live match data. 
                <a href="https://www.football-data.org/client/register" target="_blank" style="color: var(--accent-football);">Get one free →</a>
              </span>
            </div>
            <div style="display: flex; gap: var(--sp-2);">
              <input type="text" id="football-api-key-input" placeholder="Your API key" 
                style="padding: var(--sp-2) var(--sp-3); background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); color: var(--text-primary); font-size: var(--fs-sm); width: 200px;">
              <button id="football-api-key-save" class="dtd-save-btn" style="background: var(--accent-football);">Save</button>
            </div>
          </div>
        </div>
      ` : ''}

      <div id="football-matches-container">
        ${matchesHtml}
      </div>

      <div class="football-attribution">
        Football data provided by the Football-Data.org API
      </div>
    `;
  }

  async function init(container) {
    container.innerHTML = await render();

    // --- Date navigation ---
    Components.initDateNav(container, currentDate, async (newDate) => {
      currentDate = newDate;
      await init(container);
    });

    // --- Star ratings ---
    Components.initStarRatings(container, (group, value) => {
      if (group === 'football_day') {
        Store.Football.setRating(currentDate, value);
      }
    });

    // --- Watch toggles ---
    container.querySelectorAll('.watch-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const matchId = btn.dataset.matchId;
        const watched = Store.Football.toggleMatchWatched(currentDate, matchId);
        const isWatched = watched.includes(matchId);

        btn.classList.toggle('watched', isWatched);
        btn.textContent = isWatched ? '✓' : '👁';

        const card = btn.closest('.match-card');
        if (card) card.classList.toggle('watched', isWatched);

        // Update count
        init(container);
      });
    });

    // --- API key save ---
    const apiKeyInput = container.querySelector('#football-api-key-input');
    const apiKeySave = container.querySelector('#football-api-key-save');
    if (apiKeyInput && apiKeySave) {
      apiKeySave.addEventListener('click', async () => {
        const key = apiKeyInput.value.trim();
        if (key) {
          localStorage.setItem('ded_football_api_key', key);
          // Clear cache to refetch with real data
          localStorage.removeItem('ded_football_cache');
          await init(container);
        }
      });
    }
  }

  return { render, init };
})();

window.FootballDashboard = FootballDashboard;
