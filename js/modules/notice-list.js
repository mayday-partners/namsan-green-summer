// js/modules/notice-list.js
const DATA_URL = '/data/notices.json';
const TEMPLATE_ID = 'tpl-notice-item';

export async function renderNoticeList() {
  const slots = document.querySelectorAll('[data-notice-list]');
  if (!slots.length) return;

  const tpl = document.getElementById(TEMPLATE_ID);
  if (!tpl) {
    console.error('[notice-list] template missing:', TEMPLATE_ID);
    return;
  }

  let items;
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    items = await res.json();
  } catch (err) {
    console.error('[notice-list] load failed:', err);
    return;
  }

  const sorted = [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.date.localeCompare(a.date);
  });

  slots.forEach(slot => {
    const raw = slot.dataset.limit ?? 'all';
    const list = raw === 'all' ? sorted : sorted.slice(0, Number(raw) || 4);

    const frag = document.createDocumentFragment();
    for (const item of list) {
      const node = tpl.content.cloneNode(true);
      const a = node.querySelector('a');
      a.href = item.link ?? `/pages/community.html#${item.id}`;
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
  return iso.replaceAll('-', '.');
}
