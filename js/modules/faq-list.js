// js/modules/faq-list.js
const DATA_URL = '/data/faqs.json';
const TEMPLATE_ID = 'tpl-faq-item';

export async function renderFaqList() {
  const slots = document.querySelectorAll('[data-faq-list]');
  if (!slots.length) return;

  const tpl = document.getElementById(TEMPLATE_ID);
  const hasFullSlot = [...slots].some(s => s.dataset.render !== 'preview');
  if (hasFullSlot && !tpl) {
    console.error('[faq-list] template missing:', TEMPLATE_ID);
    return;
  }

  let items;
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    items = await res.json();
  } catch (err) {
    console.error('[faq-list] load failed:', err);
    return;
  }

  slots.forEach(slot => {
    const raw = slot.dataset.limit ?? 'all';
    const list = raw === 'all' ? items : items.slice(0, Number(raw) || 4);
    const isPreview = slot.dataset.render === 'preview';

    const frag = document.createDocumentFragment();
    list.forEach((item, i) => {
      if (isPreview) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `/pages/community.html#faq-${item.id}`;
        const title = document.createElement('span');
        title.textContent = item.question;
        const tag = document.createElement('span');
        tag.className = 'bottom-list__date';
        tag.textContent = `FAQ ${String(i + 1).padStart(2, '0')}`;
        a.append(title, tag);
        li.append(a);
        frag.append(li);
        return;
      }

      const node = tpl.content.cloneNode(true);
      const details = node.querySelector('details');
      if (details) details.id = `faq-${item.id}`;
      const qmark = node.querySelector('.faq__qmark');
      const qtext = node.querySelector('.faq__q-text');
      const answer = node.querySelector('.faq__a-body');
      if (qmark) qmark.textContent = `Q · ${String(i + 1).padStart(2, '0')}`;
      if (qtext) qtext.textContent = item.question;
      if (answer) answer.innerHTML = `<p>${item.answer}</p>`;
      frag.appendChild(node);
    });
    slot.replaceChildren(frag);
  });
}
