// js/main.js
import './components/site-header.js';
import './components/site-footer.js';
import { initFadeIn } from './modules/observer.js';
import { renderNoticeList } from './modules/notice-list.js';
import { initImageSlots } from './modules/image-slot.js';
import { mountMapLinks } from './modules/map-links.js';
import { mountMapEmbeds } from './modules/map-embed.js';
import { renderSponsorList } from './modules/sponsor-list.js';
import { renderProgramSummaries } from './modules/program-summary.js';
import { renderEventOverview } from './modules/event-overview.js';
import { renderProgramDetail } from './modules/program-detail.js';
import { renderInfoPanelList } from './modules/info-panel-list.js';
import { renderReservationActions } from './modules/reservation-actions.js';
import { renderCourseMap } from './modules/course-map.js';
import { renderNoticeGuideList } from './modules/notice-guide-list.js';
import { renderSeatGuide } from './modules/seat-guide.js';

(async () => {
  // Custom elements self-hydrate; no orchestration needed for partials.
  await Promise.allSettled([
    renderNoticeList(),
    renderSponsorList(),
    renderProgramSummaries(),
    initImageSlots(),
    mountMapLinks(),
    mountMapEmbeds(),
    renderEventOverview(),
    renderProgramDetail(),
    renderInfoPanelList(),
    renderReservationActions(),
    renderCourseMap(),
    renderNoticeGuideList(),
    renderSeatGuide(),
  ]);
  try { initFadeIn(); } catch (e) { console.error('[main] initFadeIn:', e); }
  resolveHashAfterRender();
})();

window.addEventListener('hashchange', resolveHashAfterRender);

function resolveHashAfterRender() {
  if (!location.hash) return;
  // Use getElementById (not querySelector) so ids that start with digits
  // — e.g., notice ids like "2026-05-20-launch" — resolve correctly.
  const id = decodeURIComponent(location.hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return;
  if (target instanceof HTMLDetailsElement) target.open = true;
  target.scrollIntoView({ behavior: 'auto', block: 'start' });
}
