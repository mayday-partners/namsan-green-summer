// js/components/site-footer.js
const PARTIAL_URL = new URL('../../partials/footer.html', import.meta.url);
const SITE_BASE = new URL('../../', import.meta.url).pathname;

function rewriteAbsolutePaths(html) {
  if (SITE_BASE === '/') return html;
  return html.replace(/((?:href|src)\s*=\s*["'])\/(?!\/)/g, `$1${SITE_BASE}`);
}

class SiteFooter extends HTMLElement {
  async connectedCallback() {
    try {
      const res = await fetch(PARTIAL_URL, { cache: 'force-cache' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const html = await res.text();
      this.innerHTML = rewriteAbsolutePaths(html);
    } catch (err) {
      console.error('[site-footer] partial load failed:', err);
    }
  }
}

customElements.define('site-footer', SiteFooter);
