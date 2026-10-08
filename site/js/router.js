// ============== ROUTER ==============
// Simple hash-based router

const Router = {
  routes: {},
  current: null,

  add(name, handler) {
    this.routes[name] = handler;
  },

  navigate(route) {
    if (route.startsWith('#')) route = route.slice(1);
    window.location.hash = route;
  },

  parse() {
    const hash = window.location.hash.slice(1) || 'home';
    const [name, ...params] = hash.split('/');
    return { name: name || 'home', params };
  },

  init() {
    window.addEventListener('hashchange', () => this.handle());
    this.handle();
  },

  handle() {
    const { name, params } = this.parse();
    const handler = this.routes[name] || this.routes['home'];
    this.current = name;
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[data-route="${name}"]`);
    if (activeLink) activeLink.classList.add('active');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Dispatch
    if (handler) handler(params);
  }
};
