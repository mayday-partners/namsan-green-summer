// js/modules/notice-list.js
const DATA_URL = '/data/notices.json';
const TEMPLATES = {
  preview: 'tpl-notice-preview',
  full:    'tpl-notice-full',
  table:   'tpl-notice-table',
};
const VALID_MODES = new Set(Object.keys(TEMPLATES));

export async function renderNoticeList() {
  const slots = document.querySelectorAll('[data-notice-list]');
  if (!slots.length) return;

  let sorted;
  try {
    const res = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const items = await res.json();
    if (!Array.isArray(items)) throw new TypeError('expected array');

    items.forEach((item, i) => {
      if (!item.id)    console.warn('[notice-list] item[%d] missing id; anchor will break', i, item);
      if (!item.date)  console.warn('[notice-list] item[%d] missing date; will sort to bottom', i, item);
      if (!item.title) console.warn('[notice-list] item[%d] missing title; will show fallback text', i, item);
    });

    sorted = [...items].sort((a, b) => {
      const pa = !!a.pinned, pb = !!b.pinned;
      if (pa !== pb) return pa ? -1 : 1;
      return (b.date ?? '').localeCompare(a.date ?? '');
    });
  } catch (err) {
    console.error('[notice-list] load failed:', err);
    slots.forEach(slot => {
      renderFallbackError(slot, 'li', '공지사항을 불러오지 못했습니다.');
    });
    return;
  }

  slots.forEach(slot => {
    try {
      const rawMode = slot.dataset.render || 'full';
      const mode = VALID_MODES.has(rawMode) ? rawMode : 'full';
      const tpl = document.getElementById(TEMPLATES[mode]);
      const fallbackTag = mode === 'table' ? 'tr' : 'li';
      if (!tpl) {
        console.error('[notice-list] template missing for mode "%s": #%s', mode, TEMPLATES[mode]);
        renderFallbackError(slot, fallbackTag, '공지사항을 표시할 수 없습니다 (template missing).');
        return;
      }

      const raw = slot.dataset.limit ?? 'all';
      const limit = parseLimit(raw);
      const list = limit === Infinity ? sorted : sorted.slice(0, limit);
      const total = list.length;

      const frag = document.createDocumentFragment();
      list.forEach((item, i) => {
        if (!item.id) return;
        const node = tpl.content.cloneNode(true);
        const a = node.querySelector('a');
        if (!a) return;
        a.href = safeLink(item.link) ?? `/community/#${item.id}`;
        const row = node.querySelector('li, tr');
        if (row && mode !== 'preview') row.id = item.id;

        const numEl = node.querySelector('.notice-table__num');
        if (numEl) numEl.textContent = String(total - i).padStart(2, '0');

        const dateEl = node.querySelector('.notice__date, .notice-table__date');
        const titleEl = node.querySelector('.notice__title, .notice-table__title');
        if (dateEl) dateEl.textContent = formatDate(item.date);
        if (titleEl) titleEl.textContent = item.title ?? '(제목 없음)';
        frag.appendChild(node);
      });
      slot.replaceChildren(frag);
    } catch (err) {
      console.error('[notice-list] render failed for slot:', slot, err);
      const fallbackTag = slot.dataset.render === 'table' ? 'tr' : 'li';
      renderFallbackError(slot, fallbackTag, '공지사항 표시 중 오류가 발생했습니다.');
    }
  });
}

function formatDate(iso) {
  return String(iso ?? '').replaceAll('-', '.');
}

function renderFallbackError(slot, tag, message) {
  const el = document.createElement(tag);
  el.setAttribute('role', 'alert');
  el.className = 'fallback-error';
  el.textContent = message;
  slot.replaceChildren(el);
}

function parseLimit(raw) {
  if (raw === 'all') return Infinity;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) {
    console.warn('[notice-list] invalid data-limit "%s"; defaulting to 4', raw);
    return 4;
  }
  return n;
}

function safeLink(raw) {
  if (!raw) return null;
  let u;
  try {
    u = new URL(raw, location.origin);
  } catch (err) {
    console.warn('[notice-list] safeLink could not parse URL:', raw, err);
    return null;
  }
  if (u.protocol === 'http:' || u.protocol === 'https:') return raw;
  console.warn('[notice-list] unsafe link rejected (non-http(s) protocol):', raw);
  return null;
}
