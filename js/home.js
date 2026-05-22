// ============================================================
// DED — Home Dashboard
// Unified summary of GATE, Football, and Gym
// ============================================================

const HomeDashboard = (() => {

  function render() {
    const today = Store.todayStr();
    const gateProgress = Store.Gate.getOverallProgress();
    const gateEntry = Store.Gate.getDailyEntry(today);
    const gateDaysLeft = Store.Gate.getDaysUntilExam();
    const gateStreak = Store.Gate.getStreak();

    const footballStats = Store.Football.getWeeklyStats();
    const footballEntry = Store.Football.getDailyEntry(today);

    const gymStats = Store.Gym.getWeeklyStats();
    const gymEntry = Store.Gym.getDailyEntry(today);
    const gymStreak = Store.Gym.getStreak();

    // Calculate overall day score
    let todayScores = [];
    if (gateEntry && gateEntry.rating_did_your_best) todayScores.push(gateEntry.rating_did_your_best);
    if (footballEntry && footballEntry.rating_day) todayScores.push(footballEntry.rating_day);
    if (gymEntry && gymEntry.rating_day) todayScores.push(gymEntry.rating_day);
    const avgScore = todayScores.length > 0
      ? (todayScores.reduce((a,b) => a+b, 0) / todayScores.length).toFixed(1)
      : '—';

    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';
    const dateDisplay = now.toLocaleDateString('en-US', { 
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
    });

    // Today's quick status
    const gateStatus = gateEntry && gateEntry.dtd_journal ? 'LOGGED' : 'PENDING';
    const gymStatus = gymEntry && gymEntry.went_to_gym ? 'WENT' : gymEntry && gymEntry.logged_at ? 'REST DAY' : 'PENDING';
    const footballStatus = (footballEntry.matches_watched || []).length > 0
      ? `${footballEntry.matches_watched.length} WATCHED` : 'NO MATCHES';

    return `
      <div class="home-header">
        <div>
          <div class="home-greeting">${greeting}</div>
          <div class="home-date-display">${dateDisplay.toUpperCase()}</div>
        </div>
        <div class="home-overall-score">
          <div class="home-overall-score__value">${avgScore}</div>
          <div class="home-overall-score__label">Today's Score</div>
        </div>
      </div>

      <div class="bento-grid">

        ${Components.card('GATE Exam', `
          <div class="card-metric card-metric--lg" style="color: var(--accent-gate);">${gateDaysLeft}</div>
          <div class="card-sub"><span class="card-sub-value" style="color: var(--text-tertiary);">days until GATE 2027</span></div>
        `, { spanClass: 'col-span-1', accentClass: 'card--gate', icon: '📘' })}

        ${Components.card('Syllabus Progress', `
          ${Components.progressRing(gateProgress.pct, 100)}
          <div style="text-align:center; margin-top: var(--sp-2);">
            <span class="text-label">${gateProgress.completed} / ${gateProgress.total} topics</span>
          </div>
        `, { spanClass: 'col-span-1', accentClass: 'card--gate', icon: '📊' })}

        ${Components.card('Gym This Week', `
          <div class="card-metric card-metric--lg" style="color: var(--accent-gym);">${gymStats.gym_days_7d}</div>
          <div class="card-sub"><span class="card-sub-value">7 days</span></div>
          <div class="gym-week-strip" style="margin-top: var(--sp-3);">
            ${gymStats.week_days.map(d => `
              <div class="gym-week-day ${d.went ? 'went' : ''}">
                <span class="gym-week-day__label">${d.day.substring(0,2)}</span>
                <span class="gym-week-day__dot"></span>
              </div>
            `).join('')}
          </div>
        `, { spanClass: 'col-span-1', accentClass: 'card--gym', icon: '🏋️' })}

        ${Components.card('Football (7D)', `
          <div class="card-metric card-metric--md" style="color: var(--accent-football);">${footballStats.watched_7d}</div>
          <div class="card-sub"><span class="card-sub-value">matches watched</span></div>
          <div style="margin-top: var(--sp-3);">
            <span class="text-label">Avg Rating: ${footballStats.avg_rating_7d}</span>
          </div>
        `, { spanClass: 'col-span-1', accentClass: 'card--football', icon: '⚽' })}

        ${Components.card("Today's Status", `
          <div class="today-quick">
            <div class="today-quick__item">
              <div class="today-quick__field">
                <span class="today-quick__dot today-quick__dot--gate"></span>
                <span>GATE Prep</span>
              </div>
              <span class="today-quick__status ${gateStatus === 'LOGGED' ? 'today-quick__status--done' : ''}">${gateStatus}</span>
            </div>
            <div class="today-quick__item">
              <div class="today-quick__field">
                <span class="today-quick__dot today-quick__dot--gym"></span>
                <span>Gym</span>
              </div>
              <span class="today-quick__status ${gymStatus === 'WENT' ? 'today-quick__status--done' : ''}">${gymStatus}</span>
            </div>
            <div class="today-quick__item">
              <div class="today-quick__field">
                <span class="today-quick__dot today-quick__dot--football"></span>
                <span>Football</span>
              </div>
              <span class="today-quick__status">${footballStatus}</span>
            </div>
          </div>
        `, { spanClass: 'col-span-2', icon: '📋' })}

        ${Components.card('Streaks', `
          <div class="field-summary-metrics">
            <div class="field-metric">
              <span class="field-metric__value" style="color: var(--accent-gate);">🔥 ${gateStreak}</span>
              <span class="field-metric__label">GATE Streak</span>
            </div>
            <div class="field-metric">
              <span class="field-metric__value" style="color: var(--accent-gym);">🔥 ${gymStreak}</span>
              <span class="field-metric__label">Gym Streak</span>
            </div>
            <div class="field-metric">
              <span class="field-metric__value" style="color: var(--accent-gate);">${gateEntry && gateEntry.rating_did_your_best ? '★'.repeat(gateEntry.rating_did_your_best) : '—'}</span>
              <span class="field-metric__label">GATE Today</span>
            </div>
            <div class="field-metric">
              <span class="field-metric__value" style="color: var(--accent-gym);">${gymEntry && gymEntry.rating_day ? '★'.repeat(gymEntry.rating_day) : '—'}</span>
              <span class="field-metric__label">Gym Today</span>
            </div>
          </div>
        `, { spanClass: 'col-span-2', icon: '🔥' })}
      </div>
    `;
  }

  function init(container) {
    container.innerHTML = render();
  }

  return { render, init };
})();

window.HomeDashboard = HomeDashboard;
