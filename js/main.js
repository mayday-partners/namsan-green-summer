// js/main.js
import { mountIncludes } from './modules/include.js';
import { initHeader } from './modules/header.js';
import { initFadeIn } from './modules/observer.js';

(async () => {
  await mountIncludes();
  initHeader();
  initFadeIn();
})();
