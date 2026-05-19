// js/main.js
import './components/site-header.js';
import './components/site-footer.js';
import { initFadeIn } from './modules/observer.js';
import { renderNoticeList } from './modules/notice-list.js';
import { renderFaqList } from './modules/faq-list.js';
import { initImageSlots } from './modules/image-slot.js';
import { mountMapLinks } from './modules/map-links.js';

(async () => {
  // Custom elements self-hydrate; no orchestration needed for partials.
  await Promise.allSettled([renderNoticeList(), renderFaqList(), initImageSlots(), mountMapLinks()]);
  try { initFadeIn(); } catch (e) { console.error('[main] initFadeIn:', e); }
  resolveHashAfterRender();
})();

window.addEventListener('hashchange', resolveHashAfterRender);

function resolveHashAfterRender() {
  if (!location.hash) return;
  let target;
  try {
    target = document.querySelector(location.hash);
  } catch (err) {
    console.warn('[main] invalid hash selector:', location.hash, err);
    return;
  }
  if (!target) return;
  if (target instanceof HTMLDetailsElement) target.open = true;
  target.scrollIntoView({ behavior: 'auto', block: 'start' });
}
