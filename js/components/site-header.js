// js/components/site-header.js
// Self-hydrating header. Fallback markup inside the element is the SEO/noscript baseline.
// 시안 디자인: hover-only submenu (CSS-only). No JS toggle required.
const PARTIAL_URL = '/partials/header.html';

class SiteHeader extends HTMLElement {
  #hydrated = false;

  async connectedCallback() {
    if (this.#hydrated) {
      this.#markCurrent();
      return;
    }
    try {
      const res = await fetch(PARTIAL_URL, { cache: 'default' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      // partial은 same-origin own repo trusted source — innerHTML 대입 안전.
      // eslint-disable-next-line no-restricted-syntax
      this.innerHTML = await res.text();
      this.#hydrated = true;
      this.#markCurrent();
    } catch (err) {
      console.error('[site-header] partial load failed:', err);
      // fallback content stays visible
    }
  }

  #markCurrent() {
    const here = new URL(location.href);
    const herePath = here.pathname.replace(/\/$/, '/index.html');
    this.querySelectorAll('.gnb a').forEach(a => {
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
