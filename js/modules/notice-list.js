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
    const res = await fetch(DATA_URL);
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
    const list = raw === 'all' ? sorted : sorted.slice(0, Number(raw) || 4);

    const frag = document.createDocumentFragment();
    for (const item of list) {
      const node = tpl.content.cloneNode(true);
      const a = node.querySelector('a');
      if (!a) continue;
      a.href = item.link ?? `pages/community.html#${item.id}`;
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
