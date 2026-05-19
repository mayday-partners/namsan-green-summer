// js/modules/include.js
// Site base computed once: '/' on root host, '/subpath/' on subpath deploys.
const SITE_BASE = new URL('../../', import.meta.url).pathname;

// Rewrite leading-slash href/src in fetched HTML so partial links work under any base.
function rewriteAbsolutePaths(html) {
  if (SITE_BASE === '/') return html;
  return html.replace(/((?:href|src)\s*=\s*["'])\/(?!\/)/g, `$1${SITE_BASE}`);
}

export async function mountIncludes(root = document) {
  const slots = root.querySelectorAll('[data-include]');
  if (!slots.length) return;

  await Promise.all([...slots].map(async (el) => {
    const url = el.dataset.include;
    try {
      const res = await fetch(url, { cache: 'force-cache' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const html = await res.text();
      el.outerHTML = rewriteAbsolutePaths(html);
    } catch (err) {
      console.error('[include]', url, err);
      el.innerHTML = `<p role="alert" class="fallback-error">콘텐츠 로딩 실패: ${url}</p>`;
    }
  }));
}
