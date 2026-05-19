// js/modules/image-slot.js
// Designer hand-off helper. Activated only when the URL has ?spec=1.
// Reads data/image-slots.json and overlays each [data-image-slot] element
// with a labeled SVG placeholder + a badge showing slot id / live px / target ratio.
const SPEC_URL = new URL('../../data/image-slots.json', import.meta.url).href;
const STYLE_ID = 'image-slot-injected-styles';

export async function initImageSlots() {
  if (new URLSearchParams(location.search).get('spec') !== '1') return;
  document.documentElement.dataset.specMode = '1';

  const elements = document.querySelectorAll('[data-image-slot]');
  if (!elements.length) return;

  let spec;
  try {
    const res = await fetch(SPEC_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    spec = await res.json();
  } catch (err) {
    console.error('[image-slot] failed to load spec:', err);
    elements.forEach(el => {
      el.classList.add('image-slot');
      el.dataset.imageSlotMissing = '';
      el.append(buildBadge(el.dataset.imageSlot || '?', 'spec load failed'));
    });
    return;
  }

  const slots = Array.isArray(spec?.slots) ? spec.slots : [];
  const byId = new Map(slots.map(s => [s.id, s]));
  const rules = [];
  const usedIds = new Set();

  elements.forEach(el => {
    const id = el.dataset.imageSlot;
    if (!id) return;
    el.classList.add('image-slot');
    const def = byId.get(id);
    if (!def) {
      el.dataset.imageSlotMissing = '';
      console.warn('[image-slot] no spec entry for "%s"', id);
      el.append(buildBadge(id, 'no spec'));
      return;
    }
    usedIds.add(id);
    if ((def.render ?? 'background-cover') === 'background-cover') {
      rules.push(
        `[data-image-slot="${escapeAttr(id)}"]{` +
          `background-image:url("${placeholderDataUrl(def)}");` +
          `background-size:cover;background-position:center;background-repeat:no-repeat;` +
        `}`
      );
    }
    el.append(buildBadge(id, primaryRatio(def)));
  });

  // Disable fade-in so designers see every slot without scrolling each into view.
  rules.push('[data-spec-mode="1"] .fade-in{opacity:1;transform:none;}');
  injectStyles(rules.join(''));
  observeBadges();

  for (const id of byId.keys()) {
    if (!usedIds.has(id) && byId.get(id).render !== 'meta') {
      console.info('[image-slot] spec id "%s" has no element on this page', id);
    }
  }
}

function primaryRatio(def) {
  const ad = Array.isArray(def?.art_direction) ? def.art_direction[0] : null;
  return ad?.ratio ?? '—';
}

function primaryWidths(def) {
  const ad = Array.isArray(def?.art_direction) ? def.art_direction[0] : null;
  if (!Array.isArray(ad?.widths) || !ad.widths.length) return '—';
  return ad.widths.join('·') + 'px';
}

function placeholderDataUrl(def) {
  const ratio = primaryRatio(def);
  const [rw, rh] = parseRatio(ratio);
  const W = 1200;
  const H = Math.max(1, Math.round((W * rh) / rw));
  const lines = [
    def.id,
    `ratio ${ratio}`,
    `widths ${primaryWidths(def)}`,
    def.current_status ? `(${def.current_status})` : ''
  ].filter(Boolean);

  // Read brand colors from CSS tokens — keeps spec helper in sync with DESIGN.md.
  // Placeholder stays dark (like .image-slot__badge) so designers can spot slots
  // against the light page baseline by tonal contrast.
  const tok = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const NEON = tok('--color-primary');
  const BG = tok('--color-dark-surface');
  const FG = tok('--color-on-dark');

  const baseFs = Math.max(20, Math.round(W / 36));
  const lineH = Math.round(baseFs * 1.6);
  const cx = W / 2;
  const totalH = lines.length * lineH;
  const startY = H / 2 - totalH / 2 + baseFs;

  const texts = lines.map((t, i) => {
    const isTitle = i === 0;
    const isFooter = i === lines.length - 1;
    const fs = isTitle ? Math.round(baseFs * 1.5) : baseFs;
    const fill = isTitle ? NEON : FG;
    const opacity = isFooter ? '0.55' : '1';
    const weight = isTitle ? '700' : '400';
    return `<text x="${cx}" y="${startY + i * lineH}" text-anchor="middle" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="${fs}" fill="${fill}" fill-opacity="${opacity}" font-weight="${weight}">${escapeXml(t)}</text>`;
  }).join('');

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
      `<defs>` +
        `<pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse">` +
          `<path d="M48 0 L0 0 0 48" fill="none" stroke="${FG}" stroke-opacity="0.10" stroke-width="1"/>` +
        `</pattern>` +
      `</defs>` +
      `<rect width="100%" height="100%" fill="${BG}"/>` +
      `<rect width="100%" height="100%" fill="url(#g)"/>` +
      `<rect x="14" y="14" width="${W - 28}" height="${H - 28}" fill="none" stroke="${NEON}" stroke-opacity="0.65" stroke-dasharray="16 12" stroke-width="2"/>` +
      texts +
    `</svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function parseRatio(s) {
  if (typeof s !== 'string') return [16, 9];
  const m = s.match(/^\s*([\d.]+)\s*[:x/]\s*([\d.]+)\s*$/);
  if (!m) return [16, 9];
  const w = parseFloat(m[1]);
  const h = parseFloat(m[2]);
  if (!w || !h) return [16, 9];
  return [w, h];
}

function buildBadge(id, ratio) {
  const badge = document.createElement('div');
  badge.className = 'image-slot__badge';

  const idEl = document.createElement('span');
  idEl.className = 'image-slot__badge-id';
  idEl.textContent = id;

  const pxEl = document.createElement('span');
  pxEl.className = 'image-slot__badge-px';
  pxEl.dataset.px = '';
  pxEl.textContent = '—';

  const ratioEl = document.createElement('span');
  ratioEl.className = 'image-slot__badge-target';
  ratioEl.textContent = ratio;

  badge.append(idEl, pxEl, ratioEl);
  return badge;
}

function observeBadges() {
  if (typeof ResizeObserver !== 'function') return;
  const ro = new ResizeObserver(entries => {
    for (const entry of entries) {
      const px = entry.target.querySelector('[data-px]');
      if (!px) continue;
      // contentBoxSize is the modern API; contentRect is the legacy fallback for older Safari/Firefox.
      const box = entry.contentBoxSize?.[0];
      const width  = box ? box.inlineSize : entry.contentRect.width;
      const height = box ? box.blockSize  : entry.contentRect.height;
      px.textContent = `${Math.round(width)}×${Math.round(height)}`;
    }
  });
  document.querySelectorAll('.image-slot').forEach(el => ro.observe(el));
}

function injectStyles(css) {
  if (!css) return;
  let el = document.getElementById(STYLE_ID);
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

function escapeAttr(s) {
  return String(s).replace(/["\\]/g, '\\$&');
}

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, c => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
  }[c]));
}
