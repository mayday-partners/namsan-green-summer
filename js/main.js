// js/main.js
import { mountIncludes } from './modules/include.js';
import { initHeader } from './modules/header.js';
import { initFadeIn } from './modules/observer.js';
import { renderNoticeList } from './modules/notice-list.js';
import { renderFaqList } from './modules/faq-list.js';

(async () => {
  await mountIncludes();
  initHeader();
  await Promise.all([renderNoticeList(), renderFaqList()]);
  initFadeIn();
})();
