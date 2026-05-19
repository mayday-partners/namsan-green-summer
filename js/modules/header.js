// js/modules/header.js
export function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) {
    console.error('[header] .site-header not found — partial injection may have failed');
    return;
  }
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.site-nav__toggle');

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setNavOpen = (open) => {
    if (!nav || !toggle) return;
    nav.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('nav-open', open);
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      setNavOpen(nav.dataset.open !== 'true');
    });
    nav.querySelectorAll('.site-nav__link').forEach(link => {
      link.addEventListener('click', () => setNavOpen(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.dataset.open === 'true') setNavOpen(false);
    });
    const mql = window.matchMedia('(min-width: 769px)');
    mql.addEventListener('change', (e) => {
      if (e.matches) setNavOpen(false);
    });
  }

  // URL-normalized aria-current. Tolerant of subpath, query strings, hashes, trailing slash.
  const here = new URL(location.href);
  const herePath = here.pathname.replace(/\/$/, '/index.html');
  document.querySelectorAll('.site-nav__link').forEach(a => {
    try {
      const linkPath = new URL(a.href, here).pathname;
      if (linkPath === herePath) a.setAttribute('aria-current', 'page');
    } catch {}
  });
}
