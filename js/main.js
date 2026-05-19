// js/main.js
import { mountIncludes } from './modules/include.js';
import { initHeader } from './modules/header.js';
import { initFadeIn } from './modules/observer.js';
import { renderNoticeList } from './modules/notice-list.js';
import { renderFaqList } from './modules/faq-list.js';

(async () => {
  try { await mountIncludes(); } catch (e) { console.error('[main] mountIncludes:', e); }
  try { initHeader(); } catch (e) { console.error('[main] initHeader:', e); }
  await Promise.allSettled([renderNoticeList(), renderFaqList()]);
  try { initFadeIn(); } catch (e) { console.error('[main] initFadeIn:', e); }
  resolveHashAfterRender();
})();

function resolveHashAfterRender() {
  if (!location.hash) return;
  let target;
  try { target = document.querySelector(location.hash); } catch {}
  if (!target) return;
  if (target instanceof HTMLDetailsElement) target.open = true;
  target.scrollIntoView({ behavior: 'instant', block: 'start' });
}
