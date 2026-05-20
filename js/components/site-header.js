// js/components/site-header.js
// Self-hydrating header. Fallback markup inside the element is the SEO/noscript baseline.
const PARTIAL_URL = new URL('../../partials/header.html', import.meta.url);

class SiteHeader extends HTMLElement {
  #ac = null;
  #hydrated = false;

  async connectedCallback() {
    // Already hydrated from a previous mount? Skip the fetch but re-bind handlers.
    if (this.#hydrated) {
      this.#attachHandlers();
      this.#markCurrent();
      return;
    }
    // Reset any nav-open lock that may have survived bfcache restore.
    document.documentElement.classList.remove('nav-open');
    try {
      const res = await fetch(PARTIAL_URL, { cache: 'force-cache' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      // partial은 same-origin own repo trusted source — innerHTML 대입 안전.
      // eslint-disable-next-line no-restricted-syntax
      this.innerHTML = await res.text();
      this.#hydrated = true;
      this.#attachHandlers();
      this.#markCurrent();
    } catch (err) {
      console.error('[site-header] partial load failed:', err);
      // fallback content stays visible
    }
  }

  disconnectedCallback() {
    this.#ac?.abort();
    this.#ac = null;
  }

  #attachHandlers() {
    // Abort prior listeners if re-attaching
    this.#ac?.abort();
    this.#ac = new AbortController();
    const { signal } = this.#ac;

    const header = this.querySelector('.site-header');
    if (!header) {
      console.error('[site-header] .site-header not found — partial injection may have failed');
      return;
    }
    const nav = this.querySelector('.site-nav');
    const toggle = this.querySelector('.site-nav__toggle');

    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true, signal });
    onScroll();

    if (toggle && nav) {
      const setNavOpen = (open) => {
        nav.dataset.open = String(open);
        toggle.setAttribute('aria-expanded', String(open));
        document.documentElement.classList.toggle('nav-open', open);
      };
      toggle.addEventListener('click', () => setNavOpen(nav.dataset.open !== 'true'), { signal });
      nav.querySelectorAll('.site-nav__link').forEach(link =>
        link.addEventListener('click', () => setNavOpen(false), { signal })
      );
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.dataset.open === 'true') setNavOpen(false);
      }, { signal });
      const mql = window.matchMedia('(min-width: 769px)');
      const onChange = (e) => { if (e.matches) setNavOpen(false); };
      if (mql.addEventListener) {
        mql.addEventListener('change', onChange, { signal });
      } else if (mql.addListener) {
        mql.addListener(onChange); // Safari < 14 — no AbortController support
        signal.addEventListener('abort', () => mql.removeListener(onChange), { once: true });
      }
    }
  }

  #markCurrent() {
    const here = new URL(location.href);
    const herePath = here.pathname.replace(/\/$/, '/index.html');
    this.querySelectorAll('.site-nav__link').forEach(a => {
      try {
        const linkPath = new URL(a.href, here).pathname;
        if (linkPath === herePath) a.setAttribute('aria-current', 'page');
      } catch (err) {
        console.warn('[site-header] markCurrent failed for link:', a.href, err);
      }
    });
  }
}

customElements.define('site-header', SiteHeader);

// bfcache restore safeguard — full reset of nav state.
window.addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  document.documentElement.classList.remove('nav-open');
  document.querySelectorAll('site-header .site-nav').forEach(nav => {
    nav.dataset.open = 'false';
  });
  document.querySelectorAll('site-header .site-nav__toggle').forEach(t => {
    t.setAttribute('aria-expanded', 'false');
  });
});
