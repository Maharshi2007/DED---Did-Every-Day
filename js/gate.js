// ============================================================
// DED — GATE Dashboard
// Syllabus tracker + DTD Journal + Ratings
// ============================================================

const GateDashboard = (() => {
  let currentDate = Store.todayStr();
  let syllabusFilter = 'all'; // all | in_progress | completed | not_started

  function renderSyllabus() {
    const progress = Store.Gate.getSyllabusProgress();

    return GATE_SYLLABUS.map(subject => {
      const subjectProgress = Store.Gate.getSubjectProgress(subject.id);

      const topicsHtml = subject.topics.map(topic => {
        const subtopicsHtml = topic.subtopics.map(st => {
          const status = progress[st.id] || 'not_started';
          if (syllabusFilter !== 'all' && status !== syllabusFilter) return '';

          const statusClass = status === 'completed' ? 'completed' : status === 'in_progress' ? 'in-progress' : '';
          const checkIcon = status === 'completed' ? '✓' : status === 'in_progress' ? '◐' : '';

          return `
            <div class="syllabus-topic ${statusClass}" data-subtopic-id="${st.id}">
              <div class="syllabus-topic__checkbox">${checkIcon}</div>
              <span class="syllabus-topic__name">${st.name}</span>
            </div>
          `;
        }).join('');

        if (syllabusFilter !== 'all' && !subtopicsHtml.trim()) return '';

        return `
          <div class="syllabus-topic-group" style="margin-bottom: var(--sp-2);">
            <div class="text-label" style="padding: var(--sp-1) var(--sp-3); color: var(--accent-gate);">${topic.name}</div>
            ${subtopicsHtml}
          </div>
        `;
      }).join('');

      if (syllabusFilter !== 'all' && !topicsHtml.trim()) return '';

      return `
        <div class="syllabus-subject" data-subject-id="${subject.id}">
          <div class="syllabus-subject__header">
            <span class="syllabus-subject__name">${subject.name}</span>
            <div class="syllabus-subject__progress">
              <span class="syllabus-subject__pct">${subjectProgress.pct}%</span>
              ${Components.progressBar(subjectProgress.pct)}
              <span class="syllabus-subject__chevron">▶</span>
            </div>
          </div>
          <div class="syllabus-topics">
            ${topicsHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  function render() {
    const entry = Store.Gate.getDailyEntry(currentDate) || {};
    const overall = Store.Gate.getOverallProgress();
    const daysLeft = Store.Gate.getDaysUntilExam();
    const streak = Store.Gate.getStreak();

    // Subject progress bars for quick view
    const subjectBarsHtml = GATE_SYLLABUS.map(subject => {
      const sp = Store.Gate.getSubjectProgress(subject.id);
      return `
        <div class="subject-progress-item">
          <div class="subject-progress-header">
            <span class="subject-progress-name">${subject.name}</span>
            <span class="subject-progress-pct">${sp.pct}%</span>
          </div>
          ${Components.progressBar(sp.pct)}
        </div>
      `;
    }).join('');

    return `
      <div class="section-header">
        <div>
          <div class="section-title" style="color: var(--accent-gate);">GATE CS/IT 2027</div>
          <div class="section-subtitle">Exam Preparation Tracker</div>
        </div>
        ${Components.dateNav(currentDate)}
      </div>

      <div class="bento-grid">

        ${Components.card('Days Until Exam', `
          ${Components.countdown(daysLeft)}
        `, { spanClass: 'col-span-1', accentClass: 'card--gate gate-countdown-card', icon: '⏳' })}

        ${Components.card('Overall Progress', `
          ${Components.progressRing(overall.pct, 130)}
          <div style="text-align:center; margin-top: var(--sp-2);">
            <span class="text-label">${overall.completed} / ${overall.total} subtopics</span>
          </div>
        `, { spanClass: 'col-span-1', accentClass: 'card--gate', icon: '📊' })}

        ${Components.card('Study Streak', `
          <div class="card-metric card-metric--lg" style="color: var(--accent-gate);">🔥 ${streak}</div>
          <div class="card-sub"><span class="card-sub-value">consecutive days</span></div>
        `, { spanClass: 'col-span-1', accentClass: 'card--gate', icon: '🔥' })}

        ${Components.card('Ratings', `
          <div class="rating-section">
            <div class="rating-row">
              <span class="rating-label">Did Your Best</span>
              ${Components.starRating('gate_best', entry.rating_did_your_best || 0)}
            </div>
            <div class="rating-row">
              <span class="rating-label">Can Be Better</span>
              ${Components.starRating('gate_better', entry.rating_can_be_better || 0)}
            </div>
          </div>
        `, { spanClass: 'col-span-1', accentClass: 'card--gate', icon: '⭐' })}

        ${Components.card('DTD — Did Today Diary', `
          <div class="dtd-section">
            <div class="dtd-header">
              <span class="text-label">How was your GATE prep today?</span>
              <button class="dtd-save-btn" id="gate-dtd-save">Save</button>
            </div>
            <textarea class="journal-textarea" id="gate-dtd-textarea" 
              placeholder="Write about what you studied, problems you solved, concepts you grasped...">${entry.dtd_journal || ''}</textarea>
          </div>
        `, { spanClass: 'col-span-2 row-span-2', accentClass: 'card--gate', icon: '📝' })}

        ${Components.card('Subject Progress', `
          <div class="subject-progress-list" style="max-height: 320px; overflow-y: auto;">
            ${subjectBarsHtml}
          </div>
        `, { spanClass: 'col-span-2 row-span-2', accentClass: 'card--gate', icon: '📚' })}

      </div>

      <div class="syllabus-section">
        <div class="section-header">
          <div class="section-title">Full Syllabus</div>
          <div class="syllabus-filter">
            <button class="syllabus-filter-btn ${syllabusFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
            <button class="syllabus-filter-btn ${syllabusFilter === 'not_started' ? 'active' : ''}" data-filter="not_started">Not Started</button>
            <button class="syllabus-filter-btn ${syllabusFilter === 'in_progress' ? 'active' : ''}" data-filter="in_progress">In Progress</button>
            <button class="syllabus-filter-btn ${syllabusFilter === 'completed' ? 'active' : ''}" data-filter="completed">Completed</button>
          </div>
        </div>
        <div class="syllabus-tree" id="gate-syllabus-tree">
          ${renderSyllabus()}
        </div>
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

    // --- Star ratings ---
    Components.initStarRatings(container, (group, value) => {
      if (group === 'gate_best') {
        Store.Gate.saveDailyEntry(currentDate, { rating_did_your_best: value });
      } else if (group === 'gate_better') {
        Store.Gate.saveDailyEntry(currentDate, { rating_can_be_better: value });
      }
    });

    // --- DTD Journal Save ---
    const saveBtn = container.querySelector('#gate-dtd-save');
    const textarea = container.querySelector('#gate-dtd-textarea');
    if (saveBtn && textarea) {
      saveBtn.addEventListener('click', () => {
        Store.Gate.saveDailyEntry(currentDate, { dtd_journal: textarea.value });
        saveBtn.textContent = 'Saved ✓';
        saveBtn.classList.add('saved');
        setTimeout(() => {
          saveBtn.textContent = 'Save';
          saveBtn.classList.remove('saved');
        }, 2000);
      });

      // Auto-save on blur
      textarea.addEventListener('blur', () => {
        if (textarea.value.trim()) {
          Store.Gate.saveDailyEntry(currentDate, { dtd_journal: textarea.value });
        }
      });
    }

    // --- Syllabus filter ---
    container.querySelectorAll('.syllabus-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        syllabusFilter = btn.dataset.filter;
        init(container);
      });
    });

    // --- Syllabus subject expand/collapse ---
    container.querySelectorAll('.syllabus-subject__header').forEach(header => {
      header.addEventListener('click', () => {
        header.parentElement.classList.toggle('open');
      });
    });

    // --- Subtopic toggle ---
    container.querySelectorAll('.syllabus-topic').forEach(topic => {
      topic.addEventListener('click', () => {
        const subtopicId = topic.dataset.subtopicId;
        const newStatus = Store.Gate.toggleSubtopic(subtopicId);

        // Update UI immediately
        topic.className = `syllabus-topic ${newStatus === 'completed' ? 'completed' : newStatus === 'in_progress' ? 'in-progress' : ''}`;
        const checkbox = topic.querySelector('.syllabus-topic__checkbox');
        checkbox.textContent = newStatus === 'completed' ? '✓' : newStatus === 'in_progress' ? '◐' : '';

        if (newStatus === 'completed') {
          checkbox.style.animation = 'checkmark 0.3s ease';
        }

        // Update progress bars after a tick
        setTimeout(() => {
          const subjectEl = topic.closest('.syllabus-subject');
          if (subjectEl) {
            const subjectId = subjectEl.dataset.subjectId;
            const sp = Store.Gate.getSubjectProgress(subjectId);
            const pctEl = subjectEl.querySelector('.syllabus-subject__pct');
            const barFill = subjectEl.querySelector('.progress-bar__fill');
            if (pctEl) pctEl.textContent = sp.pct + '%';
            if (barFill) barFill.style.width = sp.pct + '%';
          }
        }, 50);
      });
    });
  }

  return { render, init };
})();

window.GateDashboard = GateDashboard;
