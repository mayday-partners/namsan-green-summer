// js/modules/notice-list.js
const DATA_URL = new URL('../../data/notices.json', import.meta.url).href;
const TEMPLATE_ID = 'tpl-notice-item';

export async function renderNoticeList() {
  const slots = document.querySelectorAll('[data-notice-list]');
  if (!slots.length) return;

  const tpl = document.getElementById(TEMPLATE_ID);
  if (!tpl) {
    console.error('[notice-list] template missing:', TEMPLATE_ID);
    return;
  }

  let sorted;
  try {
    const res = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const items = await res.json();
    if (!Array.isArray(items)) throw new TypeError('expected array');
    sorted = [...items].sort((a, b) => {
      const pa = !!a.pinned, pb = !!b.pinned;
      if (pa !== pb) return pa ? -1 : 1;
      return (b.date ?? '').localeCompare(a.date ?? '');
    });
  } catch (err) {
    console.error('[notice-list] load failed:', err);
    slots.forEach(slot => {
      slot.innerHTML = '<li role="alert" class="fallback-error">공지사항을 불러오지 못했습니다.</li>';
    });
    return;
  }

  slots.forEach(slot => {
    const raw = slot.dataset.limit ?? 'all';
    const limit = parseLimit(raw);
    const list = limit === Infinity ? sorted : sorted.slice(0, limit);

    const frag = document.createDocumentFragment();
    for (const item of list) {
      const node = tpl.content.cloneNode(true);
      const a = node.querySelector('a');
      if (!a) continue;
      a.href = safeLink(item.link) ?? `pages/community.html#${item.id}`;
      const dateEl = node.querySelector('.notice__date');
      const titleEl = node.querySelector('.notice__title');
      if (dateEl) dateEl.textContent = formatDate(item.date);
      if (titleEl) titleEl.textContent = item.title;
      frag.appendChild(node);
    }
    slot.replaceChildren(frag);
  });
}

function formatDate(iso) {
  return String(iso ?? '').replaceAll('-', '.');
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
  try {
    const u = new URL(raw, location.origin);
    if (u.protocol === 'http:' || u.protocol === 'https:') return raw;
  } catch {}
  console.warn('[notice-list] unsafe link rejected:', raw);
  return null;
}
