# CLAUDE.md

이 파일은 Claude Code가 이 저장소에서 작업할 때 자동 로드된다. 상세 가이드는 `README.md`를 참조하라. 본 파일은 **AI가 반드시 지켜야 할 규칙과 자주 깨지는 패턴**만 압축한다.

---

## 프로젝트 컨텍스트

- 2026 남산 그린 서머 페스티벌 정적 사이트
- **멀티페이지(MPA) · 빌드 도구 없음 · Vanilla JS · 한국어**
- 페이지: `index.html` + `pages/*.html` × 5
- 단일 진실원(SSOT): 공통 마크업은 `partials/`, 게시판 콘텐츠는 `data/*.json`

---

## 절대 룰 (위반 시 즉시 중단)

1. **헤더/푸터 마크업을 페이지마다 복붙 금지** — `partials/header.html`, `partials/footer.html` 단일 편집. 새 페이지에는 `<site-header>...fallback...</site-header>` / `<site-footer></site-footer>` 커스텀 엘리먼트 사용. fallback nav는 최소 마크업 (로고 + 메뉴 5개)으로 유지 — 메뉴 항목 변경 시 fallback 6곳 + partial 1곳 모두 갱신.
2. **게시판 항목(공지/FAQ 등)을 HTML에 직접 작성 금지** — `data/*.json`에만 추가. 마크업은 `<template>` 또는 모듈 렌더 함수로만 생성.
3. **같은 데이터를 두 페이지에 복사 금지** — `index.html` 미리보기와 `community.html` 전체 목록이 같은 JSON을 다른 `data-limit`으로 호출해야 한다.
4. **인라인 `style` 속성 금지** — 색상/그라데이션은 컴포넌트 modifier 또는 CSS 변수로. (현재 `event.html` 카드들에 위반 있음, 작업 시 정리)
5. **`<script type="module">` 사용. 전역 `<script src>` 금지**, 전역 변수 금지.
6. **`tokens.css`에 없는 색상 직접 사용 금지** — 토큰 먼저 추가 → 컴포넌트 적용.
7. **`!important` 금지** (접근성 fallback 제외).
8. **빌드 도구·npm 의존성 추가 금지** — 사용자가 명시 승인하기 전까지 No-build 원칙 유지.

---

## 코드 작성 규약

### HTML
- 들여쓰기 2칸. 시맨틱 태그 우선(`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`).
- 모든 페이지: `<a class="skip-link" href="#main">본문으로 건너뛰기</a>` + `<main id="main">` 필수.
- `<section>`에 `aria-labelledby` 또는 `aria-label` 부여.
- 메타: `<title>`, `<meta name="description">`, OG 4종(`og:title`/`og:description`/`og:type`/`og:image`).

### CSS
- 명명: **BEM** (`block__element--modifier`).
- 컴포넌트 1개 = 파일 1개 (`css/components/<block>.css`).
- 페이지 전용은 `css/pages/<name>.css`.
- 진입점: `css/main.css` 하나만 HTML이 link. `@layer reset, tokens, base, layouts, components, pages, utilities;` 순서.
- 간격은 `var(--space-*)`, 색상은 `var(--color-*)` 토큰만 사용.
- 셀렉터 중첩 3단계 이하.
- 반응형 break: `768px`(모바일), `900px`(태블릿 메인 그리드), `1440px`(데스크톱 와이드).

### JavaScript
- ES Module. `js/main.js`가 진입점. 새 기능은 `js/modules/<name>.js`로 분리, `main.js`에서 import.
- 한 모듈 = 한 책임. `init...()` / `render...()` / `mount...()` 형태로 export.
- DOM 쿼리는 함수 내부에서만. import 시점에 `document.querySelector` 호출 금지.
- 타깃 요소가 없으면 조용히 `return` — 다른 페이지에서 import해도 안전해야 한다.
- 이벤트 리스너: scroll/touch는 `{ passive: true }`.
- fetch는 `try/catch` + `res.ok` 확인.
- 동적 마크업은 `<template>` + `cloneNode` + `textContent`만 사용. **`innerHTML`로 사용자/JSON 데이터 삽입 금지** (XSS).

---

## 게시판 콘텐츠 작업 시

공지/FAQ/일정 등 목록형 콘텐츠를 다룰 때:

1. 데이터: `data/*.json` 1곳에만 추가/수정.
2. 스키마는 `README.md §7-3` 표를 따른다. 날짜는 항상 `YYYY-MM-DD`(표시 변환은 렌더 시).
3. 렌더 슬롯: `<ul data-notice-list data-limit="4">` 같은 `data-*` 속성으로 변형 지정.
4. 같은 데이터를 미리보기/전체 양쪽에서 쓰면 `data-limit`만 다르게.
5. 상세 페이지는 기본적으로 쿼리스트링 단일 페이지(`notice.html?id=...`) 패턴. SEO·SNS가 중요해질 때만 SSG 도입을 사용자에게 제안.

---

## 신규 페이지 추가 시 절차

1. `pages/<name>.html` 생성 — 다른 페이지 복제하지 말 것.
2. 헤더/푸터는 `<div data-include="/partials/...">` 슬롯만.
3. 메타·skip-link·`<main id="main">` 포함.
4. 메뉴 추가 필요 시 `partials/header.html` + `partials/footer.html` 단일 편집.
5. 새 컴포넌트면 `css/components/<X>.css` + `css/main.css`에 `@import` 추가.
6. 페이지 전용 스타일은 `css/pages/<name>.css`.
7. 모바일(390/768) · 데스크톱(1280/1440) 확인 후 보고.

---

## 자주 깨지는 패턴 (방지 목록)

| 안티패턴 | 올바른 방식 |
|---|---|
| `<header>...</header>`를 새 페이지에 복붙 | `<site-header>...fallback...</site-header>` (자체 hydrate) |
| `<li>공지제목</li>` 직접 작성 | `data/notices.json`에 추가 + 렌더 모듈이 자동 표시 |
| `style="background: linear-gradient(...)"` | 컴포넌트 modifier class + `tokens.css` 색상 |
| `<script src="js/header.js">` 추가 | `js/components/<X>.js`에 customElements.define 후 `main.js`에서 import |
| analytics/GA를 `partials/*.html`에 `<script>` 직접 삽입 | `innerHTML`/`outerHTML` 주입 시 `<script>`는 미실행 — `js/main.js`에 import하거나 페이지 HTML inline 추가 |
| 새 색상 헥스값 컴포넌트에 직접 작성 | `tokens.css`에 의미 토큰 먼저 추가 |
| 같은 공지를 `index.html`/`community.html` 둘에 입력 | 한 JSON에 1번, `data-limit` 속성으로 다르게 호출 |
| `el.innerHTML = jsonData.title` | `el.textContent = jsonData.title` |
| 날짜를 `"2026.05.20"` 형태로 JSON 저장 | `"2026-05-20"` 저장, 표시 시 `formatDate()` |

---

## 응답·작업 스타일

- 한국어. 간결. 이모지 금지.
- 모호한 "개선/정리/최적화" 요청은 구체화 후 진행.
- 멀티파일 변경 전 영향 범위 매트릭스(`README.md §11`) 확인.
- 변경 후 정적 서버(`python3 -m http.server`)로 동작 검증 권장 사항을 사용자에게 안내.
- 빌드 도구 도입·외부 의존성 추가·SSG 전환은 **반드시 사용자 승인** 후 진행.

---

## 마이그레이션 현재 상태 (2026-05-19 시점, CSS @layer + components 분리 완료)

partials/data/modules/CSS 마이그레이션 완료. 현 코드베이스는 본 가이드와 일치한다.

---

## 배포 환경 (subpath 호환 필수)

본 사이트는 두 환경에서 동작:
- **테스트**: GitHub Pages `https://mayday-partners.github.io/namsan-green-summer/` (subpath `/namsan-green-summer/`)
- **프로덕션**: Cloudflare Pages `https://namsangreensummer.com/` (도메인 루트, Gabia 등록 + Cloudflare 네임서버)

코드 작성 시 **반드시**:
- HTML에서 `/`로 시작하는 절대 경로 금지 — 페이지-상대 경로 사용
- JS에서 `'/data/...'` 같은 문자열 fetch 금지 — 반드시 `new URL('../../data/...', import.meta.url)`
- partial 내부에서는 root-absolute(`/pages/...`) 허용 — 커스텀 엘리먼트가 mount 시 자동으로 `SITE_BASE` prefix 적용
- 새 fallback content nav 추가 시 `normalizeFallbackLinks()` 호출 패턴 적용 또는 페이지-상대 작성

상세: [`README.md §14`](./README.md#14-배포-환경) 참조.
