// js/main.js
// 시안 디자인: 정적 콘텐츠 기반. 커스텀 엘리먼트 hydration + 경량 컴포넌트 마운트.
// 동적 렌더 모듈(data/*.json + 모듈 시스템)은 폐기 — venue-map은 HTML data-* 속성만 읽는다.
import './components/site-header.js';
import './components/site-footer.js';
import { initI18n } from './components/i18n.js';
import { initScrollToTop } from './components/scroll-to-top.js';
import { mountVenueMaps } from './components/venue-map.js';

// Hash navigation — 페이지 로드 직후 / hashchange 시 anchor 스크롤 보정.
window.addEventListener('hashchange', resolveHash);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageBehavior);
} else {
  initPageBehavior();
}

function initPageBehavior() {
  initI18n();
  resolveHash();
  initScrollToTop();
  mountVenueMaps();
  // 언어 토글로 새로 보이게 된 지도 슬롯을 그 시점에 렌더(중복 마운트는 내부에서 무시).
  document.addEventListener('ns:langchange', () => mountVenueMaps());
}

function resolveHash() {
  if (!location.hash) return;
  // getElementById (not querySelector) — digits로 시작하는 id 지원
  const id = decodeURIComponent(location.hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return;
  if (target instanceof HTMLDetailsElement) target.open = true;
  scrollToWithHeaderOffset(target);
}

// 헤더가 sticky/fixed로 콘텐츠 위에 떠 있을 때 그 높이만큼 덜 스크롤한다.
// 실제 .site-header 높이를 측정하므로 gnb wrap(2행) 등 가변 높이도 정확히 보정.
function scrollToWithHeaderOffset(target) {
  const header = document.querySelector('.site-header');
  const stuck =
    header && ['sticky', 'fixed'].includes(getComputedStyle(header).position);
  const offset = stuck ? header.offsetHeight : 0;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(top, 0), behavior: 'auto' });
}
