// js/modules/header.js
export function initHeader() {
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.site-nav__toggle');
  if (!header) return;

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

  // 현재 페이지 nav 링크에 aria-current 자동 부여
  const here = location.pathname.endsWith('/')
    ? '/index.html'
    : location.pathname;
  document.querySelectorAll('.site-nav__link').forEach(a => {
    if (a.getAttribute('href') === here) {
      a.setAttribute('aria-current', 'page');
    }
  });
}
