// js/components/site-header.js
// Self-hydrating header. Fallback markup inside the element is the SEO/noscript baseline.
const PARTIAL_URL = new URL('../../partials/header.html', import.meta.url);
const SITE_BASE = new URL('../../', import.meta.url).pathname;

function rewriteAbsolutePaths(html) {
  if (SITE_BASE === '/') return html;
  return html.replace(/((?:href|src)\s*=\s*["'])\/(?!\/)/g, `$1${SITE_BASE}`);
}

class SiteHeader extends HTMLElement {
  async connectedCallback() {
    try {
      const res = await fetch(PARTIAL_URL, { cache: 'force-cache' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const html = await res.text();
      this.innerHTML = rewriteAbsolutePaths(html);
      this.#attachHandlers();
      this.#markCurrent();
    } catch (err) {
      console.error('[site-header] partial load failed:', err);
      // fallback content stays visible
    }
  }

  #attachHandlers() {
    const header = this.querySelector('.site-header');
    const nav = this.querySelector('.site-nav');
    const toggle = this.querySelector('.site-nav__toggle');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toggle && nav) {
      const setNavOpen = (open) => {
        nav.dataset.open = String(open);
        toggle.setAttribute('aria-expanded', String(open));
        document.documentElement.classList.toggle('nav-open', open);
      };
      toggle.addEventListener('click', () => setNavOpen(nav.dataset.open !== 'true'));
      nav.querySelectorAll('.site-nav__link').forEach(link =>
        link.addEventListener('click', () => setNavOpen(false))
      );
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.dataset.open === 'true') setNavOpen(false);
      });
      const mql = window.matchMedia('(min-width: 769px)');
      const onChange = (e) => { if (e.matches) setNavOpen(false); };
      if (mql.addEventListener) mql.addEventListener('change', onChange);
      else if (mql.addListener) mql.addListener(onChange); // Safari < 14
    }
  }

  #markCurrent() {
    const here = new URL(location.href);
    const herePath = here.pathname.replace(/\/$/, '/index.html');
    this.querySelectorAll('.site-nav__link').forEach(a => {
      try {
        const linkPath = new URL(a.href, here).pathname;
        if (linkPath === herePath) a.setAttribute('aria-current', 'page');
      } catch {}
    });
  }
}

customElements.define('site-header', SiteHeader);
