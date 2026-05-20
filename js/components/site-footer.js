// js/components/site-footer.js
const PARTIAL_URL = new URL('../../partials/footer.html', import.meta.url);

class SiteFooter extends HTMLElement {
  async connectedCallback() {
    try {
      const res = await fetch(PARTIAL_URL, { cache: 'force-cache' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      // partial은 same-origin own repo trusted source — innerHTML 대입 안전.
      // eslint-disable-next-line no-restricted-syntax
      this.innerHTML = await res.text();
    } catch (err) {
      console.error('[site-footer] partial load failed:', err);
    }
  }
}

customElements.define('site-footer', SiteFooter);
