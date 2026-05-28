// js/main.js
// 시안 디자인: 정적 콘텐츠 기반. 커스텀 엘리먼트 hydration만 수행하고,
// 동적 렌더 모듈은 없음 (data/*.json + 모듈 시스템 폐기 — Phase 7).
import './components/site-header.js';
import './components/site-footer.js';
import { initScrollToTop } from './components/scroll-to-top.js';

// Hash navigation — 페이지 로드 직후 / hashchange 시 anchor 스크롤 보정.
window.addEventListener('hashchange', resolveHash);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageBehavior);
} else {
  initPageBehavior();
}

function initPageBehavior() {
  resolveHash();
  initScrollToTop();
}

function resolveHash() {
  if (!location.hash) return;
  // getElementById (not querySelector) — digits로 시작하는 id 지원
  const id = decodeURIComponent(location.hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return;
  if (target instanceof HTMLDetailsElement) target.open = true;
  target.scrollIntoView({ behavior: 'auto', block: 'start' });
}
