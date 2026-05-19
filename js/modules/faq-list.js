// js/modules/faq-list.js
const DATA_URL = new URL('../../data/faqs.json', import.meta.url).href;
const TEMPLATE_ID = 'tpl-faq-item';

export async function renderFaqList() {
  const slots = document.querySelectorAll('[data-faq-list]');
  if (!slots.length) return;

  const tpl = document.getElementById(TEMPLATE_ID);
  const hasFullSlot = [...slots].some(s => s.dataset.render !== 'preview');
  if (hasFullSlot && !tpl) {
    console.error('[faq-list] template missing:', TEMPLATE_ID);
    slots.forEach(slot => {
      if (slot.dataset.render !== 'preview') {
        slot.innerHTML = '<p role="alert" class="fallback-error">자주 묻는 질문을 표시할 수 없습니다 (template missing).</p>';
      }
    });
    return;
  }

  let items;
  try {
    const res = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    items = await res.json();
    if (!Array.isArray(items)) throw new TypeError('expected array');

    items.forEach((item, i) => {
      if (!item.id)       console.warn('[faq-list] item[%d] missing id; anchor will break', i, item);
      if (!item.question) console.warn('[faq-list] item[%d] missing question', i, item);
      if (!item.answer)   console.warn('[faq-list] item[%d] missing answer', i, item);
    });
  } catch (err) {
    console.error('[faq-list] load failed:', err);
    slots.forEach(slot => {
      slot.innerHTML = '<p role="alert" class="fallback-error">자주 묻는 질문을 불러오지 못했습니다.</p>';
    });
    return;
  }

  slots.forEach(slot => {
    try {
      const raw = slot.dataset.limit ?? 'all';
      const limit = parseLimit(raw);
      const list = limit === Infinity ? items : items.slice(0, limit);
      const isPreview = slot.dataset.render === 'preview';

      const frag = document.createDocumentFragment();
      list.forEach((item, i) => {
        if (isPreview) {
          if (!item.id) return;
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `pages/community.html#faq-${item.id}`;
          const title = document.createElement('span');
          title.textContent = item.question ?? '(질문 없음)';
          const tag = document.createElement('span');
          tag.className = 'bottom-list__meta';
          tag.textContent = `FAQ ${String(i + 1).padStart(2, '0')}`;
          a.append(title, tag);
          li.append(a);
          frag.append(li);
          return;
        }

        if (!item.id) return; // skip items missing id — anchor would collide on #faq-undefined
        const node = tpl.content.cloneNode(true);
        const details = node.querySelector('details');
        if (details) details.id = `faq-${item.id}`;
        const qmark = node.querySelector('.faq__qmark');
        const qtext = node.querySelector('.faq__q-text');
        const answer = node.querySelector('.faq__a-text');
        if (qmark) qmark.textContent = `Q · ${String(i + 1).padStart(2, '0')}`;
        if (qtext) qtext.textContent = item.question ?? '(질문 없음)';
        if (answer) answer.textContent = item.answer ?? '';
        frag.appendChild(node);
      });
      slot.replaceChildren(frag);
    } catch (err) {
      console.error('[faq-list] render failed for slot:', slot, err);
      slot.innerHTML = '<p role="alert" class="fallback-error">자주 묻는 질문 표시 중 오류가 발생했습니다.</p>';
    }
  });
}

function parseLimit(raw) {
  if (raw === 'all') return Infinity;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) {
    console.warn('[faq-list] invalid data-limit "%s"; defaulting to 4', raw);
    return 4;
  }
  return n;
}
