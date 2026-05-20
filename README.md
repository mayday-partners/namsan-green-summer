# 2026 남산 서머 페스티벌

2026.06.27 남산공원에서 열리는 도심형 여름 페스티벌의 공식 정적 웹사이트.

본 README는 프로젝트 개요와 개발 지침을 함께 다룬다. 신규 페이지·컴포넌트 추가, 콘텐츠 업데이트, 게시판 관리 시 본 문서를 우선 참조한다. AI(Claude Code) 작업 지침은 [`CLAUDE.md`](./CLAUDE.md) 참조.

## 빠른 시작

```bash
# 정적 서버 실행 (fetch가 file:// 에서 동작 안 하므로 필수)
npx serve -l 3000
# 또는: python3 -m http.server 3000
```

브라우저: <http://localhost:3000/>

---

## 1. 프로젝트 개요

| 항목 | 값 |
|---|---|
| 종류 | 멀티페이지(MPA) 정적 사이트 |
| 빌드 도구 | 없음 (브라우저가 직접 실행) |
| 언어 | HTML5, CSS3, Vanilla JavaScript (ES2020+) |
| 페이지 수 | 6 (`index.html` + `<area>/{index,page}.html` × 5) |
| 호스팅 가정 | 정적 파일 서버 / CDN |
| 기본 언어 | 한국어 (`<html lang="ko">`) |

설계 원칙:
1. **No build, no dependency** — npm 없이 브라우저가 그대로 렌더.
2. **데이터-마크업 분리** — 자주 바뀌는 콘텐츠(공지, FAQ 등)는 JSON으로 분리.
3. **단일 소스 진실(SSOT)** — 공통 마크업/데이터를 한 곳에서만 편집.
4. **점진적 향상(Progressive Enhancement)** — JS 없이도 핵심 콘텐츠는 노출.

---

## 2. 디렉토리 구조

```
/
├─ index.html                  ← 홈 페이지
├─ 404.html                    ← Not Found (Cloudflare 자동 서빙, noindex)
├─ _headers                    ← Cloudflare Pages 보안 헤더 + CSP + 캐시 정책 — docs/INFRA.md
├─ robots.txt                  ← 검색엔진 정책
├─ sitemap.xml                 ← 13 URL (404 제외)
├─ event/                      ← 행사안내 (행사 개요 + 주요 프로그램)
│  ├─ index.html
│  └─ programs.html
├─ fun-and-walk/               ← Fun&Walk (안내 + 코스 + 유의사항)
│  ├─ index.html
│  ├─ course.html
│  └─ notice.html
├─ summer-night/               ← Summer Night (안내 + 공연 예약 유의사항)
│  ├─ index.html
│  └─ notice.html
├─ summer-garden/              ← Summer Garden (안내 + 도슨트 투어 유의사항)
│  ├─ index.html
│  └─ notice.html
├─ community/                  ← 커뮤니티 (공지 + FAQ + 환불 신청)
│  ├─ index.html
│  ├─ faq.html
│  └─ refund.html
├─ partials/                   ← <site-header> / <site-footer> 가 fetch (SSOT)
│  ├─ header.html
│  └─ footer.html
├─ data/                       ← JSON SSOT — docs/SCHEMAS.md
│  ├─ notices.json             ← 공지사항
│  ├─ faqs.json                ← FAQ
│  ├─ venue.json               ← 장소 + 코스 (지도 deep-link / SDK 임베드)
│  ├─ image-slots.json         ← 이미지 슬롯 인벤토리 (디자이너 핸드오프 SSOT)
│  ├─ config.json              ← Kakao JS key (의도적 공개)
│  └─ config.example.json      ← 키 로테이션용 템플릿
├─ css/
│  ├─ main.css                 ← @layer + @import 단일 진입점
│  ├─ tokens.css               ← DESIGN.md ↔ 1:1 매핑 (colors/typography/spacing/rounded/sizes)
│  ├─ reset.css                ← Generic + prefers-reduced-motion
│  ├─ base.css                 ← Elements (@font-face Pretendard + skip-link + body)
│  ├─ home.css                 ← 홈 페이지 컴포넌트 (.hero / .preview / .program-card / .bottom-grid)
│  ├─ page.css                 ← 5개 서브 페이지 공통 (.page-hero / .info-grid / .timetable / .faq / .ext-cta ...)
│  ├─ animations.css           ← .fade-in + data-delay 1-4
│  ├─ utilities.css            ← .fallback-error / .mt-7
│  └─ components/              ← BEM 블록 단위
│     ├─ header.css            ← .site-header + <site-header> host
│     ├─ footer.css            ← .site-footer + <site-footer> host
│     ├─ button.css            ← .btn / .btn--primary/ghost / .btn--map-{kakao,google,naver} / .map-links
│     ├─ card.css              ← .card / .card__media--{funwalk,night,garden,...}
│     ├─ image-slot.css        ← ?spec=1 dev tooling 슬롯 라벨 badge
│     └─ dark-section.css      ← (정의됨, 현재 HTML 미사용 — ARCHITECTURE.md §7)
├─ js/
│  ├─ main.js                  ← ES Module 진입점 (모든 페이지 공통)
│  ├─ components/
│  │  ├─ site-header.js        ← <site-header> custom element (셀프 하이드레이트 + nav 토글 + aria-current)
│  │  └─ site-footer.js        ← <site-footer> custom element
│  └─ modules/
│     ├─ observer.js           ← .fade-in IntersectionObserver
│     ├─ notice-list.js        ← notices.json → [data-notice-list] (preview/full 2-mode)
│     ├─ faq-list.js           ← faqs.json → [data-faq-list]
│     ├─ image-slot.js         ← ?spec=1 디자이너 모드 (image-slots.json 기반 라벨 오버레이)
│     ├─ map-links.js          ← venue.json → [data-map-links] (카카오/구글/네이버 deep-link)
│     └─ map-embed.js          ← Kakao SDK lazy load → [data-map-embed] (지도 + CP 마커 + InfoWindow)
├─ img/
│  ├─ sections/                ← hero / funwalk / night / garden (webp + png)
│  ├─ hero/ programs/ ui/      ← (예약 폴더)
├─ fonts/pretendard/           ← woff2 subset (300/400/500/600/700) — 로컬 호스트
├─ docs/                       ← 보조 문서
│  ├─ IMAGE_SPEC.md            ← 디자이너 핸드오프 가이드 + ?spec=1 모드 사용법
│  ├─ INFRA.md                 ← _headers / CSP / 캐시 / 외부 도메인 추가 절차
│  ├─ SCHEMAS.md               ← data/*.json 스키마 전체 reference
│  ├─ design-system/           ← 컴포넌트 카탈로그 (Storybook 대체, ds-canvas/catalog/tokens)
│  └─ design-explorations/     ← 디자인 탐색 기록
├─ README.md                   ← 본 파일 (storefront + 빠른 시작)
├─ ONBOARDING.md               ← 처음 30분 둘러보기 + 작업 유형별 진입점 (Tutorial)
├─ ARCHITECTURE.md             ← 시스템 이해 — 왜 이렇게 설계됐는가 (Explanation)
├─ DESIGN.md                   ← 디자인 시스템 SSOT (Google Stitch alpha)
├─ CHANGELOG.md                ← 날짜별 변경 이력
└─ CLAUDE.md                   ← AI 에이전트 룰
```

각 문서의 역할은 [ONBOARDING.md](./ONBOARDING.md)의 "문서 지도" 참조.

---

## 3. 코드 스타일

대부분 룰은 **lint로 자동 강제** — `./scripts/lint.sh` 실행. 본 § 는 lint가 못 잡는 의미적 규약 + 의도만 다룬다. 절대 룰과 anti-pattern 표는 [`CLAUDE.md`](./CLAUDE.md) 참조.

### Lint (커밋 전 필수 실행)

```bash
./scripts/lint.sh           # 전체 (stylelint + eslint + htmlhint + design.md + tokens grep)
./scripts/lint.sh css       # stylelint만
./scripts/lint.sh js        # eslint만
./scripts/lint.sh html      # htmlhint만
./scripts/lint.sh design    # DESIGN.md lint만
./scripts/lint.sh tokens    # 색상 토큰 SSOT grep만
```

config 파일:
- [`.stylelintrc.json`](./.stylelintrc.json) — BEM 패턴, `!important` 금지, 중첩 3단계, breakpoint 화이트리스트 (768/900)
- [`eslint.config.mjs`](./eslint.config.mjs) — ES Module, `innerHTML`/`outerHTML`/`eval` 금지, `no-undef`
- [`.htmlhintrc`](./.htmlhintrc) — `inline-style-disabled`, `alt-require`, `attr-no-duplication`, `id-unique`

CI는 **도입하지 않음** — 개발자/AI 에이전트의 양심에 맡김. CLAUDE.md "코드 수정 후 lint 실행" 룰이 사실상 강제력 (모든 코드가 Claude를 거치는 워크플로우).

### Lint가 못 잡는 의미적 규약 (인간 가이드 필수)

- **시맨틱 태그 우선** — `<div>` 남발 대신 `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` 선택
- **`<section>`에 `aria-labelledby` 또는 `aria-label`** — a11y 의미 부여
- **모든 페이지에 skip-link + `<main id="main">`** — htmlhint custom rule 없으므로 review로 보장
- **컴포넌트 1개 = CSS 파일 1개** — `css/components/<block>.css` 구조 의도
- **모듈은 타깃 슬롯이 없으면 조용히 `return`** — 다른 페이지에서 import해도 안전
- **신규 색상/spacing이 필요하면 토큰 먼저** — `DESIGN.md` 등록 → `tokens.css` 매핑 → 컴포넌트 적용 순서 (워크플로우는 [`DESIGN.md`](./DESIGN.md))
- **경로는 root-absolute** — 모든 정적 자원·메뉴 href는 `/css/`, `/js/`, `/<area>/` 형태로 통일 (Cloudflare 루트 도메인 단일 환경)
- **fetch URL도 root-absolute 문자열** — `'/data/notices.json'`, `'/partials/header.html'` 등 직접 사용
- **이벤트 리스너 scroll/touch는 `{ passive: true }`** — 스크롤 jank 방지
- **`window.<name> = ...` 전역 부여 금지** — eslint `no-implicit-globals`가 일부 잡지만 의도적 전역도 금지

### 형식 규약 (lint가 자동 검증)

| 규약 | 도구 | 룰 |
|---|---|---|
| HTML 인라인 `style` 금지 | htmlhint | `inline-style-disabled` |
| HTML `alt`/`title` 누락 | htmlhint | `alt-require`, `title-require` |
| HTML `id` 중복 | htmlhint | `id-unique` |
| CSS BEM 명명 패턴 | stylelint | `selector-class-pattern` |
| CSS `!important` 금지 | stylelint | `declaration-no-important` |
| CSS 중첩 3단계 이하 | stylelint | `max-nesting-depth` |
| CSS breakpoint 화이트리스트 | stylelint | `media-feature-name-value-allowed-list` |
| 색상 토큰 SSOT (tokens.css 외 hex 금지) | shell grep | `scripts/lint.sh tokens` |
| JS `innerHTML`/`outerHTML` 금지 | eslint | `no-restricted-syntax` |
| JS `eval`/`document.write`/`new Function()` 금지 | eslint | `no-eval`, `no-restricted-syntax` |
| JS 전역 변수 금지 | eslint | `no-implicit-globals`, `no-undef` |
| JS `var` 금지 | eslint | `no-var` |
| DESIGN.md ↔ tokens.css 정합성 | design.md lint | spec validation |

---

## 4. CSS 아키텍처

ITCSS + BEM + CSS Cascade Layers 조합. 단일 진입점 `css/main.css`:

```css
@layer reset, tokens, base, components, pages, utilities;

@import url('reset.css')                    layer(reset);
@import url('tokens.css')                   layer(tokens);
@import url('base.css')                     layer(base);

@import url('components/header.css')        layer(components);
@import url('components/button.css')        layer(components);
@import url('components/card.css')          layer(components);
@import url('components/footer.css')        layer(components);
@import url('components/image-slot.css')    layer(components);
@import url('components/dark-section.css')  layer(components);

@import url('home.css')                     layer(pages);
@import url('page.css')                     layer(pages);

@import url('animations.css')               layer(utilities);
@import url('utilities.css')                layer(utilities);
```

원칙:
- **페이지별 CSS는 `pages` 레이어**에 두어 컴포넌트 기본형을 자연스럽게 오버라이드. 현재 `home.css` (홈 전용) + `page.css` (5개 서브 페이지 공통) 2개. 신규 페이지가 기존 패턴 내면 `page.css` 추가, 완전히 다르면 새 `css/<area>.css` + main.css `@import`
- **토큰 변경은 반드시 `tokens.css`만** 수정 — DESIGN.md ↔ tokens.css 1:1 매핑 유지. 토큰 워크플로우는 [`DESIGN.md`](./DESIGN.md) "변경 워크플로우"
- **`dark-section.css`는 정의됐으나 HTML 미사용** — 향후 Summer Night 전용 섹션 도입 후보 ([`ARCHITECTURE.md`](./ARCHITECTURE.md) §7)
- **utility layer가 components 위** — `.fade-in opacity:0`이 컴포넌트 기본형보다 우선 적용되어야 IntersectionObserver 진입 전 숨김 보장

---

## 5. JavaScript 모듈 패턴

진입점은 모든 페이지에 동일하게 link되는 단일 `js/main.js` 모듈이다. 페이지별 조건 분기 없이, 각 모듈이 타깃 슬롯이 없으면 조용히 return하는 방식으로 안전성을 보장한다.

```html
<!-- 모든 페이지 공통: <script type="module" src="/js/main.js"></script>
     (root-absolute — Cloudflare 루트 도메인 단일 배포 환경) -->
```

```js
// js/main.js — 실제 코드
import './components/site-header.js';   // <site-header> custom element 정의 (self-hydrate)
import './components/site-footer.js';   // <site-footer> custom element 정의 (self-hydrate)
import { initFadeIn } from './modules/observer.js';
import { renderNoticeList } from './modules/notice-list.js';
import { renderFaqList } from './modules/faq-list.js';
import { initImageSlots } from './modules/image-slot.js';
import { mountMapLinks } from './modules/map-links.js';
import { mountMapEmbeds } from './modules/map-embed.js';

(async () => {
  // Custom elements가 connectedCallback에서 스스로 partial fetch + 마운트.
  // main.js는 orchestration 책임 없음.
  await Promise.allSettled([
    renderNoticeList(), renderFaqList(),
    initImageSlots(), mountMapLinks(), mountMapEmbeds(),
  ]);
  try { initFadeIn(); } catch (e) { console.error('[main] initFadeIn:', e); }
  resolveHashAfterRender();    // URL hash 대상이 details면 open + scrollIntoView
})();
```

전체 모듈 인벤토리 (`js/`):

| 경로 | 책임 |
|---|---|
| `js/main.js` | 모든 페이지 공통 진입점. 모듈 import + Promise.allSettled로 병렬 마운트 |
| `js/components/site-header.js` | `<site-header>` custom element — partial fetch + nav 토글 + `aria-current` 자동 부여 + bfcache 복원 핸들링 |
| `js/components/site-footer.js` | `<site-footer>` custom element — partial fetch만 |
| `js/modules/observer.js` | `.fade-in` IntersectionObserver (threshold 0.15, rootMargin -10%) |
| `js/modules/notice-list.js` | `data/notices.json` → `[data-notice-list]` 슬롯 렌더 (`data-render="preview"` / `data-limit` 분기) |
| `js/modules/faq-list.js` | `data/faqs.json` → `[data-faq-list]` 슬롯 렌더 (preview/full 2-mode) |
| `js/modules/image-slot.js` | `?spec=1` 모드에서만 활성. `data/image-slots.json` 기반 디자이너 슬롯 라벨 오버레이 |
| `js/modules/map-links.js` | `data/venue.json` → `[data-map-links]` 슬롯에 카카오/구글/네이버 deep link 버튼 |
| `js/modules/map-embed.js` | Kakao Maps SDK lazy load + `[data-map-embed]` 슬롯에 지도 + CP 마커 + InfoWindow |

모듈 작성 규약:
- 한 모듈은 `init...()`, `render...()`, `mount...()` 등 동사로 시작하는 함수만 export.
- 모듈 외부에 상태(state)를 노출하지 않는다 (모듈 내부 클로저로 캐시).
- DOM이 없는 경우(타깃 슬롯 부재) **조용히 `return`** — 다른 페이지에서 import해도 안전해야 한다.
- 동적 마크업은 `<template>` + `cloneNode` + `textContent` 사용. **`innerHTML`로 JSON/사용자 데이터 삽입 금지** (XSS).
- fetch URL은 root-absolute 문자열 (`'/data/...'`, `'/partials/...'`) 사용.

---

## 6. 공통 컴포넌트(헤더/푸터) 관리

### Web Components 셀프-하이드레이션 패턴
모든 페이지의 헤더/푸터는 **custom element**로 마운트된다. 페이지 HTML에는 `<site-header>` / `<site-footer>` 태그만 두고, 엘리먼트가 `connectedCallback`에서 자체 partial을 fetch하여 자기 `innerHTML`을 교체한다.

```html
<!-- 모든 페이지 공통 -->
<site-header>
  <!-- fallback content: JS 미동작 환경에서 노출 + partial fetch 전 short window의 SEO baseline.
       메뉴 항목 변경 시 이 fallback도 6개 페이지 + 1개 partial 모두 동기화 필요. -->
  <header class="site-header site-header--fallback">
    <div class="container site-header__inner">
      <a href="/index.html" class="site-logo">...</a>
      <nav class="site-nav" data-open="false">
        <ul class="site-nav__list">
          <li><a class="site-nav__link" href="/event/">행사안내</a></li>
          ...
        </ul>
      </nav>
    </div>
  </header>
</site-header>

<main id="main"> ... </main>

<site-footer></site-footer>   <!-- 푸터는 fallback content 없음 (SEO 가중치 낮음) -->
```

```js
// js/components/site-header.js — 핵심 발췌
const PARTIAL_URL = '/partials/header.html';

class SiteHeader extends HTMLElement {
  async connectedCallback() {
    const res = await fetch(PARTIAL_URL, { cache: 'force-cache' });
    this.innerHTML = await res.text();
    this.#attachHandlers();   // nav 토글, scroll-state, esc-close, mql-change
    this.#markCurrent();       // 현재 URL과 매칭되는 링크에 aria-current="page"
  }
}
customElements.define('site-header', SiteHeader);
```

이 패턴이 해결하는 것:
- **JS 없는 환경** — fallback `<header>`가 그대로 보임 (SEO + a11y baseline).
- **bfcache 복원** — `pageshow` 핸들러로 nav-open 상태 reset.
- **메모리 누수 방지** — `AbortController`로 모든 핸들러 cleanup.
- **fetch URL의 위치 독립성** — `import.meta.url` 기반으로 모듈이 어떤 페이지에서 import되든 동일하게 동작.

### 현재 페이지 표시
`#markCurrent()`가 partial 마운트 직후 자동 부여:
```js
const here = new URL(location.href);
const herePath = here.pathname.replace(/\/$/, '/index.html');
this.querySelectorAll('.site-nav__link').forEach(a => {
  if (new URL(a.href, here).pathname === herePath) {
    a.setAttribute('aria-current', 'page');
  }
});
```

### 메뉴 항목 변경 시 동기화 위치 (반드시 7곳 모두 수정)
1. `partials/header.html` (정상 fetch 결과)
2. `partials/footer.html` (sitemap 영역)
3. `index.html` fallback
4-8. `{event,fun-and-walk,summer-night,summer-garden,community}/index.html` fallback
9. `404.html` fallback

> [!TIP]
> 더 깊은 설명(왜 Web Components를 골랐는지, lifecycle 상세, `normalize` 타이밍 등)은 [`ARCHITECTURE.md`](./ARCHITECTURE.md) §4 Custom Element 패턴 참조.

---

## 7. 콘텐츠 / 게시판 관리 (핵심)

### 7-1. 문제 정의
공지사항·FAQ·일정 같은 "자주 바뀌는 목록형 콘텐츠"가 현재 HTML 마크업에 직접 박혀 있고, 동일 항목이 `index.html`(미리보기)과 `community/`(전체) **양쪽에 중복**된다. 항목을 1건 추가하려면 두 페이지의 HTML을 모두 수정해야 한다.

### 7-2. 관리 원칙
1. **데이터는 JSON 1개 파일**(SSOT) — `data/notices.json` 등.
2. **마크업은 템플릿 1개**(`<template>` 또는 JS 문자열).
3. **렌더는 모듈 1개**(`notice-list.js`).
4. **표시 위치는 N개** — 같은 데이터를 다른 변형(요약/전체)으로 호출.
5. **스키마는 명시** — 필드명·타입·필수 여부를 본 문서에 기재.

### 7-3. 데이터 SSOT 인벤토리

5개 JSON 파일이 서로 다른 책임을 분담한다.

| 파일 | 책임 | 사용 모듈 |
|---|---|---|
| `data/notices.json` | 공지사항 | `js/modules/notice-list.js` |
| `data/faqs.json` | FAQ | `js/modules/faq-list.js` |
| `data/venue.json` | 장소 + 코스 | `js/modules/map-{links,embed}.js` |
| `data/image-slots.json` | 이미지 슬롯 인벤토리 | `js/modules/image-slot.js` |
| `data/config.json` | 외부 API 키 (Kakao) | `js/modules/map-embed.js` |

**전체 필드 스펙 + 추가 시 체크리스트는 [`docs/SCHEMAS.md`](./docs/SCHEMAS.md) 참조** (Reference). 본 §에서는 작업 흐름만 다룬다.

공통 룰:
- 날짜는 항상 `YYYY-MM-DD` (ISO 8601)로 저장 — 표시 변환은 렌더 시점
- 좌표는 WGS84 + 소수점 6자리 이상 — `_verified` / `_source` 흔적 기록
- 외부 API 키가 server secret이면 `config.json` 커밋 중단 (Kakao JS key는 공개 의도)

### 7-4. 템플릿과 렌더링 패턴

```html
<!-- 홈 (index.html) — 4건 미리보기 -->
<ul class="bottom-list" data-notice-list data-limit="4" data-render="preview"></ul>

<!-- 커뮤니티 (community/) — 전체 목록 -->
<ul class="notice__list" data-notice-list data-limit="all"></ul>
```

**slot attribute**:
- `data-limit` — 숫자 또는 `"all"`. 정렬 후 상위 N개 슬라이스
- `data-render` — `"preview"`면 미리보기 템플릿, 미지정이면 full 템플릿

**템플릿** (페이지별 정의):
- `index.html`: `<template id="tpl-notice-preview">` (icon + title + meta 형태)
- `community/`: `<template id="tpl-notice-full">` (date + title + arrow 형태) + `<template id="tpl-faq-item">` (details/summary)

**렌더 모듈 흐름** (`js/modules/notice-list.js` 발췌):
```js
const DATA_URL = '/data/notices.json';
// 1. fetch + parse + 정렬 (pinned 우선 → date 내림차순)
// 2. 각 슬롯의 data-render 모드별 템플릿 선택
// 3. data-limit 적용 후 cloneNode + textContent 채움 (XSS-safe)
// 4. slot.replaceChildren(frag)
```

상세 동작은 모듈 코드와 [`ARCHITECTURE.md`](./ARCHITECTURE.md) §3 데이터 흐름 참조.

### 7-5. 상세 페이지 처리
정적 사이트에서 게시글 N건의 상세 페이지를 각각 만들지 않는 두 가지 패턴:

**A. 쿼리스트링 단일 페이지 (No-build 유지)**
- 라우트: `community/notice.html?id=2026-05-20-launch`
- `notice.html`이 URL의 `id`를 읽어 해당 항목의 `body`를 렌더.
- 장점: 추가 빌드 없이 N건 처리 가능 / 단점: SEO·SNS 공유는 단일 URL.

**B. SSG 빌드 시점 페이지 생성**
- Eleventy / Astro 도입 → `notices.json`을 순회해 각 글마다 정적 HTML 생성.
- 장점: 게시글마다 고유 URL·OG 메타·완전한 SEO / 단점: 빌드 단계 추가.

게시글이 **30건 이하 + 검색엔진 색인 우선순위 낮음** → A안 권장.
**검색 트래픽 유입이나 SNS 공유가 중요** → B안 권장 (11ty가 학습 비용 가장 낮음).

### 7-6. 확장 시나리오 매핑

| 요구 | 대응 |
|---|---|
| 항목 1개 추가 | `data/*.json`에 객체 1개 push, 끝 |
| 카테고리/태그 필터 | `<select data-filter>` + render 함수에 필터 옵션 추가 |
| 페이지네이션 | `data-page-size="10"` 슬롯 속성 + 상태 관리 모듈 1개 추가 |
| 검색 | 클라이언트 측 `filter()` (수십~수백 건 규모면 충분) |
| 비기술자 편집 | Decap CMS / TinaCMS 같은 git-backed CMS로 JSON 파일을 GUI 편집 가능하게 |
| 외부 시스템에서 자동 수집 | 빌드 단계에서 Google Sheets/Notion API → `data/*.json` 생성 |

### 7-7. 절대 하지 말 것
- HTML 마크업 안에 공지/FAQ 항목을 직접 작성하기 (현재 `community.html`, `index.html` 패턴).
- 같은 데이터를 두 페이지에 복사하기.
- `<template>` 없이 JS 문자열로 마크업 빌드(이스케이프 누락 시 XSS 위험). `textContent` / `template.content.cloneNode()` 사용.
- 날짜를 `YYYY.MM.DD` 같은 표시용 포맷으로 저장 — 데이터는 항상 `YYYY-MM-DD`, 표시 변환은 렌더 시점.

---

## 8. 신규 페이지 추가 절차 (체크리스트)

- [ ] `<area>/<name>.html` 생성. 다른 페이지를 복제하지 말고 **헤더/푸터는 partials 슬롯** 사용.
- [ ] `<title>`, `<meta name="description">`, OG 메타 4종(`og:title`, `og:description`, `og:type`, `og:image`) 작성.
- [ ] `<main id="main">` + skip-link 포함.
- [ ] 헤더 nav에 항목 추가 → `partials/header.html` 한 곳에서 수정.
- [ ] 푸터 sitemap에 링크 추가 → `partials/footer.html` 한 곳에서 수정.
- [ ] 새 컴포넌트가 필요하면 `css/components/<block>.css` + `css/main.css`에 `@import` 추가.
- [ ] 페이지 전용 스타일이 필요하면 `css/<area>.css` 작성 후 `main.css`의 `pages` 레이어에 추가.
- [ ] 모바일(390/768) · 데스크톱(1280/1440) 시각 확인.
- [ ] Lighthouse Performance ≥ 90, Accessibility = 100 확인.

---

## 9. 성능 체크리스트

| 항목 | 기준 | 적용 위치 |
|---|---|---|
| LCP | < 2.5 s | 히어로 이미지에 `<link rel="preload" as="image" fetchpriority="high">` |
| INP | < 200 ms | 큰 JS 작업 없음, IntersectionObserver만 사용 |
| CLS | < 0.1 | 이미지는 `width`/`height` 또는 `aspect-ratio` 명시 |
| 폰트 | FOUT 최소화 | 서브셋 woff2를 `<link rel="preload" as="font" crossorigin>` |
| above-fold 이미지 | `loading="eager"` (기본) | 절대 lazy 처리 금지 |
| below-fold 이미지 | `loading="lazy"` | 모든 카드/아래 섹션 이미지 |
| 외부 폰트 | `preconnect` 적용됨 | 이미 있음 |

---

## 10. 접근성 체크리스트

- [ ] 모든 페이지 skip-link 존재 (`community/`엔 있고, 일부 페이지엔 누락 상태 → 점검).
- [ ] `<main id="main">` 존재.
- [ ] 헤더 nav에 현재 페이지 `aria-current="page"` (`site-header.js`의 `#markCurrent()` 자동 처리).
- [ ] 이미지에 `alt` 또는 `aria-hidden="true"`.
- [ ] 버튼/링크 텍스트가 없으면 `aria-label`.
- [ ] 색 대비 4.5:1 이상 — 본문 텍스트 기준. `var(--color-text-muted)`는 약한 본문에만 사용, 핵심 정보 금지.
- [ ] `prefers-reduced-motion` 감지 시 모션 비활성 (reset.css 이미 처리됨).
- [ ] 키보드만으로 모든 인터랙션 가능 — 모바일 nav 토글, FAQ details, 외부 CTA 등.

---

## 11. 변경 시 영향 범위 매트릭스

| 변경 종류 | 수정 파일 | 영향 페이지 | 참고 |
|---|---|---|---|
| 색상/spacing 토큰 | `DESIGN.md` + `css/tokens.css` (1:1) | 전체 | DESIGN.md "변경 워크플로우" |
| 메뉴 항목 | `partials/header.html` + 6개 페이지 + `404.html` fallback (총 8곳) | 전체 | §6 마지막 표 |
| 푸터 sitemap | `partials/footer.html` | 전체 | |
| 공지/FAQ 1건 추가 | `data/notices.json` / `data/faqs.json` | community + index 자동 반영 | [`docs/SCHEMAS.md`](./docs/SCHEMAS.md) §1, §2 |
| 새 venue (지도 장소) | `data/venue.json` `venues.<key>` + 페이지에 `[data-map-links="<key>"]` | 해당 슬롯만 | SCHEMAS.md §3 |
| 새 이미지 슬롯 | `data/image-slots.json` `slots[]` + 페이지에 `[data-image-slot="<id>"]` | 해당 페이지 | [`docs/IMAGE_SPEC.md`](./docs/IMAGE_SPEC.md) |
| 새 컴포넌트 | `DESIGN.md` `components:` + `css/components/<X>.css` + `css/main.css` @import | 사용처만 | |
| JS 동작 변경 | `js/modules/<X>.js` | 해당 모듈 사용 페이지 | |
| 외부 도메인 / CDN / 폼 시스템 추가 | `_headers` CSP 갱신 + HTML preconnect | 전체 (보안 정책) | [`docs/INFRA.md`](./docs/INFRA.md) §4 |
| Kakao JS key 로테이션 | `data/config.json` + Kakao Console 도메인 화이트리스트 | 지도 기능 | SCHEMAS.md §5 |
| 새 페이지 추가 | §8 체크리스트 + `sitemap.xml` URL 추가 + fallback nav 8곳 | 신규 | |

---

## 12. 로컬 개발

`fetch('/partials/...')`는 `file://` 프로토콜에서 동작하지 않으므로 반드시 정적 서버를 사용한다.

```bash
# 택 1: Node (권장 — 프론트엔드 표준 도구, npm 의존성 추가 없이 npx로 일회성 실행)
npx serve -l 3000

# 택 2: Python (macOS/Linux 기본 설치, Windows는 별도)
python3 -m http.server 3000

# 택 3: VS Code Live Server 확장 (settings.json에서 liveServer.settings.port를 3000으로 변경)
```

브라우저: `http://localhost:3000/`.

> [!IMPORTANT]
> **포트 3000 고정** — Kakao Developers Console JavaScript SDK 도메인 화이트리스트에 `http://localhost:3000`만 등록. 다른 포트로 띄우면 카카오 맵 SDK가 거부된다.

---

## 13. 마이그레이션 우선순위

본 § 는 **현재 진행 중 / 계획**만 다룹니다. 완료된 마이그레이션 이력은 [`CHANGELOG.md`](./CHANGELOG.md) 참조.

### 완료 (요약)

| 단계 | 완료 시점 | 상세 |
|---|---|---|
| partials/data/modules 분리 (Phase 1) | 2026-05-18 | CHANGELOG 2026-05-18 |
| Custom Elements 마이그레이션 (`<site-header>`/`<site-footer>`) | 2026-05-19 | CHANGELOG 2026-05-19 |
| CSS `@layer` + 컴포넌트 분리 | 2026-05-19 | CHANGELOG 2026-05-19 |
| 디자인 시스템 SSOT (`DESIGN.md`) + light baseline 전환 | 2026-05-19 | CHANGELOG 2026-05-19 |
| 이미지 슬롯 시스템 + `?spec=1` dev tooling | 2026-05-19 | CHANGELOG 2026-05-19 |
| 지도 통합 (Kakao SDK + 3-앱 deep links + multi-venue) | 2026-05-19 | CHANGELOG 2026-05-19 |
| a11y/perf 번들 (skip-link, hero preload, fetchpriority) | 2026-05-19 | CHANGELOG 2026-05-19 |
| `_headers` CSP + 캐시 정책 | 2026-05-20 | CHANGELOG 2026-05-20, [`docs/INFRA.md`](./docs/INFRA.md) |
| 문서 체계 정비 (ARCHITECTURE/SCHEMAS/INFRA/ONBOARDING/CHANGELOG) | 2026-05-20 | CHANGELOG [Unreleased] |

### 진행 중 / 계획

1. **`forms.example.com` placeholder → 실 폼 시스템 교체** — CTA 6곳 + `partials/header.html` + `_headers` CSP 동시 갱신. 절차는 [`docs/INFRA.md`](./docs/INFRA.md) §5
2. **`www.namsangreensummer.com` Custom Domain + apex 301** — Cloudflare 설정 ([`§14-5`](#14-5-도메인-전환-체크리스트))
3. **`pages.dev` 서브도메인 `X-Robots-Tag: noindex`** — CF Transform Rules
4. **Lighthouse 측정 + 회귀 가드** — LCP < 2.5s, CLS < 0.1, INP < 200ms
5. **`.dark-section` 활성화 또는 deprecation 결정** — 현재 미사용 ([`ARCHITECTURE.md`](./ARCHITECTURE.md) §7)
6. **(조건부) SSG 도입** — `data/notices.json` 항목 30+ 도달 + SNS 공유/SEO가 비즈니스 요구가 될 때 Eleventy 전환 검토. 현 단계는 No-build 유지

각 항목은 다른 항목 없이 단독 실행 가능. 단계 사이에 사이트는 계속 동작해야 함.

---

## 14. 배포 환경

본 사이트는 **Cloudflare Pages 루트 도메인 단일 환경**에 배포된다 (2026-05-20 결정).
GitHub Pages subpath 배포는 폐기. 로컬 개발은 `npx serve -l 3000`(포트는 카카오 콘솔 도메인 화이트리스트와 일치하도록 고정)으로 검증한다.

### 14-1. 환경 매트릭스

| 항목 | 값 |
|---|---|
| URL | `https://namsangreensummer.com/` |
| 호스팅 | Cloudflare Pages |
| 도메인 | 루트(apex) 도메인 |
| 도메인 등록 | Gabia (네임서버는 Cloudflare로 위임) |
| SSL | Cloudflare 자동 |
| 사이트 base | `/` |
| 자동 배포 트리거 | `main` push 시 Cloudflare Pages build |
| 프로젝트 URL | `https://namsan-green-summer.pages.dev/` (Pages 기본 도메인, 백업 URL) |
| PR 프리뷰 | PR마다 `https://<hash>.namsan-green-summer.pages.dev/` 자동 발급 |

### 14-2. 정적 자원 경로 패턴

루트 도메인 단일 환경이라 모든 경로는 **root-absolute 한 패턴**으로 통일한다:

1. **HTML 정적 경로**: `<script src="/js/main.js">`, `<link rel="stylesheet" href="/css/main.css">`, `<a href="/event/">`. partial 내 메뉴 href(`/event/` 등)도 동일.
2. **JS 모듈의 fetch URL**: `'/data/notices.json'`, `'/partials/header.html'` 같은 root-absolute 문자열 직접 사용. `notice-list.js`, `faq-list.js`, `site-header.js`, `site-footer.js`, `map-embed.js`, `map-links.js`, `image-slot.js`, `coord-picker.js` 모두 동일 패턴.

### 14-3. 환경별 동작 검증

#### Cloudflare (프로덕션)
1. Cloudflare에 도메인 zone 추가 → 네임서버 2개 발급
2. Gabia DNS에서 네임서버를 위 2개로 변경 (전파 ~1시간)
3. Cloudflare Pages 프로젝트 생성 → GitHub repo 연결:
   - Framework preset: **None**
   - Build command: `exit 0`
   - Build output directory: 비움
   - Production branch: `main`
4. Pages 프로젝트 → Custom Domains → `namsangreensummer.com` 추가 (CF가 CNAME flattening 자동 처리, A/AAAA 수동 설정 불필요)
5. SSL/TLS → Overview → 모드를 **Full** 이상으로 설정
6. `https://namsangreensummer.com/` 접속
7. DevTools Console 에러 0, Network 탭에서 다음이 200:
   - `/partials/header.html`, `/partials/footer.html`
   - `/data/notices.json`, `/data/faqs.json`, `/data/venue.json`

### 14-4. 코드 작성 원칙

새 파일·기능 추가 시:
- **HTML에서 root-absolute 경로(`/...`) 통일** — 페이지-상대(`../js/main.js`) 사용 금지
- **JS fetch URL도 root-absolute 문자열** — `'/data/...'`, `'/partials/...'` 직접 사용
- **CSS의 `url()` 참조는 CSS 파일 위치 기준 상대** (브라우저가 자동 처리)
- **외부 폼/링크는 도메인 포함 절대 URL** (`https://forms.example.com/...`)

### 14-5. 도메인 전환 체크리스트 (현황: 2026-05-20 시점)

테스트(GH Pages) → 프로덕션(Cloudflare/namsangreensummer.com) 전환 진행 상태:

- [x] Cloudflare 가입 + `namsangreensummer.com` zone 추가 (Free 플랜)
- [x] Gabia에 네임서버 변경 (`eugene.ns.cloudflare.com`, `paloma.ns.cloudflare.com`)
- [x] Cloudflare Pages 프로젝트 생성 + GitHub repo 연결
- [x] Pages 프로젝트에 `namsangreensummer.com` Custom Domain 연결 (apex)
- [x] SSL/TLS 모드 설정 (현재 **Full** — "Full (Strict)" 갱신 권장)
- [x] OG/SNS 메타 태그 (모든 페이지 `og:image` 절대 URL 적용 완료)
- [x] 루트 `404.html` 추가 (`.html` 매칭 실패 시 index.html catchall 방지)
- [x] `robots.txt` + `sitemap.xml` 추가 (6 URL)
- [x] `_headers` 파일 — 보안 헤더 + CSP + 캐시 정책 (Kakao SDK / Pretendard CDN / CF Insights 화이트리스트 포함). 상세 [`docs/INFRA.md`](./docs/INFRA.md)
- [ ] `www.namsangreensummer.com` Custom Domain 추가 + apex로 301
- [ ] `pages.dev` 서브도메인 `X-Robots-Tag: noindex` (CF Transform Rules)
- [ ] `forms.example.com` placeholder → 실 폼 시스템 교체 ([`docs/INFRA.md`](./docs/INFRA.md) §5)
- [ ] Lighthouse 측정 + 회귀 가드: LCP < 2.5s, CLS < 0.1, INP < 200ms

### 14-6. Cloudflare Pages 프로젝트 정보

> [!CAUTION]
> 계정 / 권한 등 민감 정보는 repo에 두지 말 것. 별도 인수인계 문서(Notion / Wiki / 패스워드 매니저)에서 관리.

| 항목 | 값 |
|---|---|
| 프로젝트 이름 | `namsan-green-summer` |
| pages.dev URL | `https://namsan-green-summer.pages.dev/` |
| Production branch | `main` |
| Framework preset | None |
| Build command | `exit 0` |
| Build output directory | (빈 칸 = 저장소 루트) |
| Root directory | (빈 칸) |
| 자동 배포 | `main` push → production / PR → preview URL |
| Custom domains | `namsangreensummer.com` (apex) / `www.namsangreensummer.com` (예정) |
| Cloudflare 네임서버 | `eugene.ns.cloudflare.com`, `paloma.ns.cloudflare.com` |
| 도메인 등록기관 | Gabia (DNS 관리는 Cloudflare로 위임) |
| SSL 인증서 | Cloudflare 자동 (Google Trust Services, 90일 자동 갱신) |

**무료 플랜 한도** (참고): 빌드 500회/월, 파일 20,000개, 대역폭/요청 무제한.

### 14-7. Cloudflare Pages 동작 특이점

배포 환경에서만 발생하는 동작. 디버깅 시 자주 막히는 지점.

1. **디렉토리 URL + `.html` 자동 drop (308 redirect)**
   - `/event/` 요청 시 자동으로 `/event/index.html` 서빙 (no redirect).
   - 서브 페이지 `/fun-and-walk/course.html` 등은 `/fun-and-walk/course`로도 접근 가능 (CF가 `.html` drop + 308 redirect). 단, 코드/문서 표기는 명시성 위해 `.html` 유지.
   - 모든 정적 자원/메뉴 href는 root-absolute(`/css/`, `/<area>/`) 통일.

2. **404 처리**
   - 매칭되는 정적 자산이 없으면 루트 `404.html`을 404 상태로 서빙.
   - `404.html` 없을 때는 CF가 index.html을 200으로 fallback (SEO 위험). 본 저장소는 `404.html`을 포함하므로 정상 동작.
   - 404 페이지는 `<meta name="robots" content="noindex, follow">` 포함.

3. **자동 보안 헤더**
   - CF가 다음을 자동 부여: `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`. 별도 `_headers` 작성 없이 기본 적용.

4. **AI 봇 차단 (기본 활성)**
   - CF 대시보드 → AI 크롤러 제어 → "모든 페이지에서 차단".
   - Googlebot 등 검색 봇은 영향 없음. GPTBot 등 AI 학습 봇만 차단.

5. **`*.pages.dev` 중복 인덱싱 위험**
   - 프로젝트의 `namsan-green-summer.pages.dev`가 SEO상 prod 도메인과 동일 콘텐츠.
   - 권장: CF 대시보드 → Rules → Transform Rules에서 hostname이 `pages.dev` 포함이면 `X-Robots-Tag: noindex` 응답 헤더 추가.

6. **`_headers` 미사용 (현재)**
   - 향후 CSP, 캐시 정책(JSON `no-cache`, 정적 자산 장기 캐시) 추가 시 저장소 루트 `_headers` 파일 작성.

### 14-8. 운영 / 비상 대응

| 상황 | 조치 |
|---|---|
| **롤백** | CF Pages → Deployments → 이전 성공 배포 → "Rollback to this deployment" |
| **캐시 퍼지** | CF 대시보드 → Caching → Configuration → "Purge Everything" (또는 특정 URL Purge) |
| **빌드 실패** | Deployments → 실패 배포 → Build log 확인. `exit 0` 외 명령 없으므로 보통 GitHub 권한 / repo 접근 / 파일 크기 한도(5MB) 이슈 |
| **SSL 발급 지연** | Custom Domain 추가 후 보통 5-15분. 1시간 후에도 미발급이면 SSL/TLS → Edge Certificates 상태 확인 |
| **도메인 장애 시 우회** | `*.pages.dev` URL은 도메인/SSL과 분리. 임시 안내 가능 |
| **DNS 변경** | CF 대시보드 → DNS → Records. 가비아 DNS 패널은 NS 위임 후 무효 |
| **Cloudflare 대시보드 접속 불가** | 계정 소유자 부재 시 인수인계 문서 참조. 2FA 백업 코드 필요 |
