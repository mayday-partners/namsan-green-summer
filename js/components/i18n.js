// js/components/i18n.js
// 정적 인라인 다국어(ko/en). 본문에 두 언어가 모두 마크업으로 존재하고,
// 비활성 언어는 css/components/i18n.css가 display:none으로 숨긴다.
// 이 모듈은 (1) 저장된 언어 적용 (2) 토글 버튼 바인딩 (3) <title> 교체만 담당한다.
// 동적 데이터 시스템(폐기된 data/*.json)과 무관 — DOM 텍스트는 모두 정적 HTML에 존재한다.

const STORAGE_KEY = 'ns-lang';
const LANGS = ['ko', 'en'];

export function initI18n() {
  applyLang(readLang());
  bindToggle();
  // 헤더/푸터 partial이 늦게 hydrate되므로 마운트 후 토글 상태를 재동기화한다.
  document.addEventListener('ns:hydrated', syncControls);
}

function readLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    // localStorage 접근 불가(프라이빗 모드 등) — 기본 ko로 진행
  }
  return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'ko';
}

function applyLang(lang) {
  const root = document.documentElement;
  root.setAttribute('data-lang', lang);
  root.setAttribute('lang', lang);
  swapTitle(lang);
  syncControls();
  // 비활성 언어 슬롯의 가시성이 바뀌었음을 알린다 — venue-map이 새로 보이게 된
  // 지도를 그 시점에 렌더한다(숨겨진 채 초기화돼 깨지는 현상 방지).
  document.dispatchEvent(new CustomEvent('ns:langchange', { detail: { lang } }));
}

// <title data-en="English title">한국어 제목</title> 형태일 때만 교체.
function swapTitle(lang) {
  const titleEl = document.querySelector('title[data-en]');
  if (!titleEl) return;
  if (!titleEl.dataset.ko) titleEl.dataset.ko = titleEl.textContent;
  titleEl.textContent = lang === 'en' ? titleEl.dataset.en : titleEl.dataset.ko;
}

// 토글 버튼 aria-pressed 동기화 (시각 활성 상태는 CSS가 html[data-lang]로 처리).
function syncControls() {
  const lang = document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'ko';
  document.querySelectorAll('.lang-toggle__btn').forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.dataset.langOpt === lang));
  });
}

function setLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // 저장 실패해도 현재 페이지에는 적용
  }
  applyLang(lang);
}

// 이벤트 위임 — 버튼이 partial hydrate 이후 생겨도 동작한다.
function bindToggle() {
  document.addEventListener('click', e => {
    const opt = e.target.closest('[data-lang-opt]');
    if (!opt) return;
    e.preventDefault();
    setLang(opt.dataset.langOpt === 'en' ? 'en' : 'ko');
  });
}
