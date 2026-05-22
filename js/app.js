// ============================================================
// DED — App Router & Initialization
// Hash-based SPA routing between 4 dashboards
// ============================================================

const App = (() => {
  const ROUTES = {
    '':         { name: 'Home',     field: 'home',     module: 'HomeDashboard' },
    'home':     { name: 'Home',     field: 'home',     module: 'HomeDashboard' },
    'gate':     { name: 'GATE',     field: 'gate',     module: 'GateDashboard' },
    'football': { name: 'Football', field: 'football', module: 'FootballDashboard' },
    'gym':      { name: 'Gym',      field: 'gym',      module: 'GymDashboard' },
  };

  let currentRoute = '';

  function getRoute() {
    return window.location.hash.replace('#', '') || 'home';
  }

  function navigate(route) {
    window.location.hash = route;
  }

  function updateNav(route) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.field === route);
    });
  }

  function updateDateDisplay() {
    const dateEl = document.querySelector('.nav-date');
    if (dateEl) {
      const now = new Date();
      dateEl.textContent = now.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }).toUpperCase();
    }
  }

  async function renderView(route) {
    const config = ROUTES[route] || ROUTES['home'];
    const container = document.getElementById('main-view');
    if (!container) return;

    // Hide all views, show the active one
    container.className = 'view active';
    currentRoute = route;
    updateNav(config.field);

    // Get the module and init
    const module = window[config.module];
    if (module && module.init) {
      await module.init(container);
    }
  }

  function handleRoute() {
    const route = getRoute();
    renderView(route);
  }

  async function init() {
    // Initialize sync engine (cloud sync)
    if (window.SyncEngine) {
      await SyncEngine.init();
    }

    // Set up nav click handlers
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const field = link.dataset.field;
        navigate(field);
      });
    });

    // Listen for hash changes
    window.addEventListener('hashchange', handleRoute);

    // Update date in nav
    updateDateDisplay();

    // Initial render
    handleRoute();

    console.log('🚀 DED — Did Every Day | Initialized');
  }

  return { init, navigate };
})();

// Boot the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
