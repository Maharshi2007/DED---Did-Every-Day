// ============================================================
// DED — Gym Dashboard
// Gym toggle + Muscles trained + Supplements + Rating
// ============================================================

const GymDashboard = (() => {
  let currentDate = Store.todayStr();

  const MUSCLES = [
    { id: 'chest',     name: 'Chest',     emoji: '🫁' },
    { id: 'back',      name: 'Back',      emoji: '🔙' },
    { id: 'shoulders', name: 'Shoulders', emoji: '💪' },
    { id: 'biceps',    name: 'Biceps',    emoji: '💪' },
    { id: 'triceps',   name: 'Triceps',   emoji: '🦾' },
    { id: 'legs',      name: 'Legs',      emoji: '🦵' },
    { id: 'abs',       name: 'Abs',       emoji: '🎯' },
    { id: 'cardio',    name: 'Cardio',    emoji: '🏃' },
  ];

  const SUPPLEMENTS = [
    { id: 'protein',  name: 'Protein',   emoji: '🥤', desc: 'Whey / Plant protein' },
    { id: 'creatine', name: 'Creatine',  emoji: '💊', desc: 'Creatine monohydrate' },
    { id: 'omega_3',  name: 'Omega-3',   emoji: '🐟', desc: 'Fish oil capsules' },
  ];

  function render() {
    const entry = Store.Gym.getDailyEntry(currentDate);
    const weeklyStats = Store.Gym.getWeeklyStats();
    const streak = Store.Gym.getStreak();
    const wentToGym = entry.went_to_gym || false;
    const musclesTrained = entry.muscles_trained || [];
    const supplements = entry.supplements || { protein: false, creatine: false, omega_3: false };

    // Muscle grid
    const muscleGridHtml = MUSCLES.map(m => {
      const active = musclesTrained.includes(m.id) ? 'active' : '';
      return `
        <button class="muscle-btn ${active}" data-muscle="${m.id}">
          <span class="muscle-btn__emoji">${m.emoji}</span>
          <span class="muscle-btn__name">${m.name}</span>
        </button>
      `;
    }).join('');

    // Supplements
    const supplementsHtml = SUPPLEMENTS.map(s => {
      const isActive = supplements[s.id] || false;
      return `
        <div class="supplement-row">
          <div class="supplement-info">
            <span class="supplement-icon">${s.emoji}</span>
            <div>
              <div class="supplement-name">${s.name}</div>
              <div class="supplement-desc">${s.desc}</div>
            </div>
          </div>
          ${Components.toggle(`supp_${s.id}`, '', isActive)}
        </div>
      `;
    }).join('');

    return `
      <div class="section-header">
        <div>
          <div class="section-title" style="color: var(--accent-gym);">Gym</div>
          <div class="section-subtitle">Workout & Supplement Tracker</div>
        </div>
        ${Components.dateNav(currentDate)}
      </div>

      <!-- Hero Gym Toggle -->
      <div class="gym-hero-toggle ${wentToGym ? 'went-to-gym' : ''}" id="gym-hero-toggle">
        <div class="gym-hero-toggle__info">
          <div class="gym-hero-toggle__title">${wentToGym ? '🏋️ Went to Gym!' : 'Did you go to gym?'}</div>
          <div class="gym-hero-toggle__subtitle">${wentToGym ? 'Great work! Log your workout below.' : 'Toggle this if you hit the gym today.'}</div>
        </div>
        <div class="gym-big-toggle">
          <div class="gym-big-toggle__thumb"></div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="gym-stats-grid" style="margin-top: var(--sp-6);">
        <div class="gym-stat-item">
          <div class="gym-stat-item__value">${weeklyStats.gym_days_7d}</div>
          <div class="gym-stat-item__label">Gym Days (7D)</div>
        </div>
        <div class="gym-stat-item">
          <div class="gym-stat-item__value">🔥 ${streak}</div>
          <div class="gym-stat-item__label">Current Streak</div>
        </div>
        <div class="gym-stat-item">
          <div class="gym-stat-item__value">${weeklyStats.avg_rating_7d}</div>
          <div class="gym-stat-item__label">Avg Rating (7D)</div>
        </div>
      </div>

      <!-- Weekly Strip -->
      <div class="card" style="margin-top: var(--sp-4);">
        <div class="card-header">
          <span class="card-title">This Week</span>
        </div>
        <div class="gym-week-strip">
          ${weeklyStats.week_days.map(d => `
            <div class="gym-week-day ${d.went ? 'went' : ''}">
              <span class="gym-week-day__label">${d.day}</span>
              <span class="gym-week-day__dot"></span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Detail sections (disabled if not went to gym) -->
      <div class="gym-details ${wentToGym ? '' : 'hidden'}" id="gym-details">

        <!-- Muscles Trained -->
        <div class="muscle-section">
          <div style="display: flex; align-items: center;">
            <span class="muscle-section__title">Muscles Trained</span>
            <span class="muscles-selected-count">${musclesTrained.length} selected</span>
          </div>
          <div class="muscle-grid" id="muscle-grid">
            ${muscleGridHtml}
          </div>
        </div>

        <!-- Supplements -->
        <div class="supplements-section">
          <span class="supplements-section__title">Supplements Intake</span>
          ${supplementsHtml}
        </div>

      </div>

      <!-- Day Rating (always visible) -->
      <div class="gym-day-rating" style="margin-top: var(--sp-6);">
        <span class="gym-day-rating__label">Rate Your Day</span>
        ${Components.starRating('gym_day', entry.rating_day || 0)}
      </div>
    `;
  }

  function init(container) {
    container.innerHTML = render();

    // --- Date navigation ---
    Components.initDateNav(container, currentDate, (newDate) => {
      currentDate = newDate;
      init(container);
    });

    // --- Hero gym toggle ---
    const heroToggle = container.querySelector('#gym-hero-toggle');
    if (heroToggle) {
      heroToggle.addEventListener('click', () => {
        const went = Store.Gym.toggleGymAttendance(currentDate);
        init(container); // Re-render to show/hide details
      });
    }

    // --- Muscle buttons ---
    container.querySelectorAll('.muscle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const muscle = btn.dataset.muscle;
        const muscles = Store.Gym.toggleMuscle(currentDate, muscle);
        btn.classList.toggle('active');

        // Update count
        const countEl = container.querySelector('.muscles-selected-count');
        if (countEl) countEl.textContent = `${muscles.length} selected`;
      });
    });

    // --- Supplement toggles ---
    Components.initToggles(container, (id, isActive) => {
      const suppId = id.replace('supp_', '');
      Store.Gym.toggleSupplement(currentDate, suppId);
    });

    // --- Star ratings ---
    Components.initStarRatings(container, (group, value) => {
      if (group === 'gym_day') {
        Store.Gym.setRating(currentDate, value);
      }
    });
  }

  return { render, init };
})();

window.GymDashboard = GymDashboard;
