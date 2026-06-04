// js/lang-init.js
// FOUC(언어 깜빡임) 방지 전용. 모든 페이지 <head>의 stylesheet <link> "앞"에서
// 동기 <script src>로 로드된다 (CSP script-src 'self' 준수 — 인라인 스크립트는 차단되므로 외부 파일).
// 첫 페인트 전에 두 가지를 수행한다:
//   (1) 저장 언어(localStorage 'ns-lang')를 <html data-lang>/<html lang>에 확정.
//   (2) 비활성 언어 숨김 규칙을 크리티컬 <style>로 head에 선주입.
//       (숨김 규칙은 css/utilities.css의 깊은 @import 체인 끝에 있어 느린 네트워크에선
//        첫 페인트 때 ko/en이 둘 다 보였다가 사라지는 깜빡임이 남기 때문.)
// 헤더/푸터 fallback 마크업과 늦게 hydrate되는 partial 모두 전역 descendant 셀렉터로 함께 적용됨.
//
// 동기화 의무(1:1):
//   - STORAGE_KEY('ns-lang')·허용값(ko/en) ↔ js/components/i18n.js
//   - 숨김 규칙 ↔ css/utilities.css
// 전역 변수 없는 IIFE. 사용자/JSON 데이터 삽입 없음(정적 문자열만) — XSS 무관.
(function () {
  const STORAGE_KEY = 'ns-lang';
  const LANGS = ['ko', 'en'];
  const root = document.documentElement;

  let lang = root.getAttribute('data-lang') === 'en' ? 'en' : 'ko';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.indexOf(saved) !== -1) lang = saved;
  } catch {
    // localStorage 접근 불가(프라이빗 모드 등) — HTML 기본값(ko) 유지.
  }
  root.setAttribute('data-lang', lang);
  root.setAttribute('lang', lang);

  // 크리티컬 숨김 CSS 선주입 — css/utilities.css와 동일 규칙.
  const style = document.createElement('style');
  style.setAttribute('data-lang-init', '');
  style.textContent =
    "html[data-lang='ko'] [lang='en'],html[data-lang='en'] [lang='ko']{display:none}";
  (document.head || root).appendChild(style);
})();
