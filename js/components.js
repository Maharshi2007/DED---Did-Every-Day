// ============================================================
// DED — Shared UI Components
// Reusable rendering functions for star ratings, toggles, etc.
// ============================================================

const Components = (() => {

  // --- Star Rating ---
  // Returns HTML string. Use data-rating-group="name" + data-rating-value="n"
  function starRating(groupName, currentValue = 0, maxStars = 5) {
    let html = `<div class="star-rating" data-rating-group="${groupName}">`;
    for (let i = 1; i <= maxStars; i++) {
      const filled = i <= currentValue ? 'filled' : '';
      html += `<span class="star-rating__star ${filled}" data-star="${i}">★</span>`;
    }
    html += '</div>';
    return html;
  }

  // Initialize star rating interactivity
  function initStarRatings(container, onChange) {
    container.querySelectorAll('.star-rating').forEach(group => {
      const groupName = group.dataset.ratingGroup;
      const stars = group.querySelectorAll('.star-rating__star');

      stars.forEach(star => {
        star.addEventListener('click', () => {
          const value = parseInt(star.dataset.star);
          stars.forEach((s, idx) => {
            s.classList.toggle('filled', idx < value);
          });
          if (onChange) onChange(groupName, value);
        });

        star.addEventListener('mouseenter', () => {
          const value = parseInt(star.dataset.star);
          stars.forEach((s, idx) => {
            s.style.color = idx < value ? 'var(--star-filled)' : '';
          });
        });

        group.addEventListener('mouseleave', () => {
          stars.forEach(s => {
            s.style.color = '';
          });
        });
      });
    });
  }

  // --- Toggle Switch ---
  function toggle(id, label, isActive = false, accentClass = '') {
    const activeClass = isActive ? 'active' : '';
    return `
      <div class="toggle ${activeClass} ${accentClass}" data-toggle-id="${id}" id="toggle-${id}">
        <div class="toggle__track">
          <div class="toggle__thumb"></div>
        </div>
        <span class="toggle__label">${label}</span>
      </div>
    `;
  }

  function initToggles(container, onChange) {
    container.querySelectorAll('.toggle').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('active');
        const id = el.dataset.toggleId;
        const isActive = el.classList.contains('active');
        if (onChange) onChange(id, isActive);
      });
    });
  }

  // --- Progress Ring (SVG) ---
  function progressRing(pct, size = 120, strokeWidth = 8, color = 'var(--accent-gate)') {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    return `
      <div class="progress-ring-container" style="width:${size}px;height:${size}px;">
        <svg class="progress-ring" width="${size}" height="${size}">
          <circle class="progress-ring__bg" cx="${size/2}" cy="${size/2}" r="${radius}" stroke-width="${strokeWidth}"/>
          <circle class="progress-ring__fill" cx="${size/2}" cy="${size/2}" r="${radius}" stroke-width="${strokeWidth}"
            stroke="${color}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"/>
        </svg>
        <div class="progress-ring__text">
          <span class="progress-ring__pct">${pct}%</span>
          <span class="progress-ring__label">Complete</span>
        </div>
      </div>
    `;
  }

  // --- Progress Bar ---
  function progressBar(pct, colorClass = '') {
    return `
      <div class="progress-bar">
        <div class="progress-bar__fill ${colorClass}" style="width: ${pct}%"></div>
      </div>
    `;
  }

  // --- Date Navigation ---
  function dateNav(currentDate) {
    const d = new Date(currentDate + 'T00:00:00');
    const formatted = d.toLocaleDateString('en-US', { 
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
    }).toUpperCase();

    return `
      <div class="date-nav" id="date-nav">
        <button class="date-nav__btn" data-dir="-1">◀</button>
        <span class="date-nav__current">${formatted}</span>
        <button class="date-nav__btn" data-dir="1">▶</button>
      </div>
    `;
  }

  function initDateNav(container, currentDate, onChange) {
    container.querySelectorAll('.date-nav__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = parseInt(btn.dataset.dir);
        const d = new Date(currentDate + 'T00:00:00');
        d.setDate(d.getDate() + dir);
        const newDate = Store.dateStr(d);
        
        // Don't go into the future
        if (newDate > Store.todayStr()) return;

        if (onChange) onChange(newDate);
      });
    });
  }

  // --- Countdown ---
  function countdown(daysLeft) {
    const months = Math.floor(daysLeft / 30);
    const weeks = Math.floor((daysLeft % 30) / 7);
    const days = daysLeft % 7;

    return `
      <div class="countdown">
        <div class="countdown__unit">
          <div class="countdown__value">${months}</div>
          <div class="countdown__label">Months</div>
        </div>
        <div class="countdown__unit">
          <div class="countdown__value">${weeks}</div>
          <div class="countdown__label">Weeks</div>
        </div>
        <div class="countdown__unit">
          <div class="countdown__value">${days}</div>
          <div class="countdown__label">Days</div>
        </div>
      </div>
    `;
  }

  // --- Card wrapper ---
  function card(title, bodyHtml, options = {}) {
    const { 
      icon = '', 
      spanClass = '', 
      accentClass = '', 
      id = '' 
    } = options;

    const iconHtml = icon ? `<div class="card-icon">${icon}</div>` : '';
    const idAttr = id ? `id="${id}"` : '';

    return `
      <div class="card ${spanClass} ${accentClass}" ${idAttr}>
        <div class="card-header">
          <span class="card-title">${title}</span>
          ${iconHtml}
        </div>
        <div class="card-body">
          ${bodyHtml}
        </div>
      </div>
    `;
  }

  // --- Metric display ---
  function metric(value, sub = '', sizeClass = '') {
    const subHtml = sub ? `<div class="card-sub"><span class="card-sub-value">${sub}</span></div>` : '';
    return `
      <div class="card-metric ${sizeClass}">${value}</div>
      ${subHtml}
    `;
  }

  // --- Public API ---
  return {
    starRating,
    initStarRatings,
    toggle,
    initToggles,
    progressRing,
    progressBar,
    dateNav,
    initDateNav,
    countdown,
    card,
    metric
  };
})();

window.Components = Components;
