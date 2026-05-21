# 2026 남산 서머 페스티벌

2026.06.27 남산공원에서 열리는 도심형 여름 페스티벌의 공식 정적 웹사이트.

본 README는 프로젝트 개요와 개발 지침을 함께 다룬다. 신규 페이지·컴포넌트 추가, 콘텐츠 업데이트 시 본 문서를 우선 참조한다. AI(Claude Code) 작업 지침은 [`CLAUDE.md`](./CLAUDE.md) 참조.

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
| 페이지 수 | 14 (`index.html` + `404.html` + 12 area page) |
| 호스팅 | Cloudflare Pages (단일 환경 — `https://namsangreensummer.com/`) |
| 기본 언어 | 한국어 (`<html lang="ko">`) |

설계 원칙:
1. **No build, no dependency** — npm 없이 브라우저가 그대로 렌더.
2. **시안 단순화 정신** — 시안(`Pretendard 950 + 단일 neon + white paper`)의 단순함을 코드 구조에도 적용. 동적 데이터 시스템 폐기, 정적 HTML 1차 작성.
3. **단일 소스 진실(SSOT)** — 디자인은 `DESIGN.md` + `css/tokens.css`(1:1), 공통 마크업은 `partials/`.
4. **점진적 향상(Progressive Enhancement)** — JS 없이도 핵심 콘텐츠는 노출 (custom element fallback markup).

---

## 2. 디렉토리 구조

```
/
├─ index.html                  ← 홈 페이지
├─ 404.html                    ← Not Found (Cloudflare 자동 서빙, noindex)
├─ _headers                    ← Cloudflare Pages 보안 헤더 + CSP + 캐시 정책 — docs/INFRA.md
├─ robots.txt                  ← 검색엔진 정책
├─ sitemap.xml                 ← 13 URL (404 제외)
├─ info/                       ← 행사안내 (행사 개요 + 주요 프로그램)
│  ├─ index.html
│  └─ programs.html
├─ funwalk/                    ← Fun&Walk (안내 + 코스 + 유의사항)
│  ├─ index.html
│  ├─ course.html
│  └─ notice.html
├─ night/                      ← Summer Night (안내 + 공연 예약 유의사항)
│  ├─ index.html
│  └─ notice.html
├─ garden/                     ← Summer Garden (안내 + 도슨트 투어 사전예약)
│  ├─ index.html
│  └─ reservation.html
├─ community/                  ← 커뮤니티 (공지 + FAQ + 환불 신청)
│  ├─ index.html
│  ├─ faq.html
│  └─ refund.html
├─ partials/                   ← <site-header> / <site-footer> 가 fetch (SSOT)
│  ├─ header.html
│  └─ footer.html
├─ css/
│  ├─ main.css                 ← @layer + @import 단일 진입점
│  ├─ tokens.css               ← DESIGN.md ↔ 1:1 매핑 (18 colors / 10 typography / 7 rounded / 10 spacing / 13 sizes)
│  ├─ reset.css                ← Generic + prefers-reduced-motion
│  ├─ base.css                 ← Pretendard CDN import + body 글로벌
│  ├─ home.css                 ← 홈 페이지 레이아웃 (.poster-hero / .program-summary / .notice-area / .home-page 오버라이드)
│  ├─ page.css                 ← 5개 서브 페이지 공통 (sub-hero 색상 변형 / per-area 카드)
│  ├─ utilities.css            ← .fallback-error / .mt-*
│  └─ components/              ← BEM 블록 단위 (15 파일)
│     ├─ site-header.css       ← .site-header + .brand + .gnb + .submenu + .menu-icon + .skip-link
│     ├─ button.css            ← .primary-action / .secondary-action / .cta-row / .button-row
│     ├─ footer.css            ← .footer + .footer-inner + <site-footer> host
│     ├─ sub-visual.css        ← 서브페이지 hero 이미지 strip
│     ├─ overview.css          ← .sub-hero + .overview-tabs + .overview-card + .section-label + .section-inner
│     ├─ info-panel.css        ← .info-panel + .program-info-table + .helper-copy
│     ├─ program-detail.css    ← .program-detail-list + .program-detail + .program-number + .program-guide-card
│     ├─ reserve-button.css    ← Fun&Walk reserve-button-local / global
│     ├─ notice.css            ← .notice-list + .notice + .notice-area + .notice-panel + .notice-guide-*
│     ├─ map.css               ← festival-map / course-map / garden-map 통합 (3 maps + pins + labels)
│     ├─ lineup.css            ← Summer Night .lineup-image + .lineup-card (decorative)
│     ├─ seat-guide.css        ← Summer Night .seat-guide
│     ├─ experience-grid.css   ← Summer Night .experience-grid + .experience-image
│     ├─ community.css         ← .community-block + .block-kicker + .community-placeholder
│     ├─ sponsor.css           ← .sponsor-area + .sponsor-grid + .sponsor
│     ├─ wire-section.css      ← .wire-section + .wire-inner (홈 컨테이너)
│     └─ radial-pattern.css    ← decorative concentric ring utility
├─ js/
│  ├─ main.js                  ← ES Module 진입점 (custom elements import + hash resolver)
│  └─ components/
│     ├─ site-header.js        ← <site-header> custom element (partial fetch + aria-current)
│     └─ site-footer.js        ← <site-footer> custom element (partial fetch만)
├─ img/
│  └─ festival/                ← 시안 4종 (main-visual-wide / sub-visual / night-lineup / night-experience)
├─ fonts/pretendard/           ← woff2 subset (300/400/500/600/700) — 로컬 fallback (Pretendard CDN 우선)
├─ scripts/
│  └─ lint.sh                  ← stylelint + eslint + htmlhint + design.md + tokens grep 통합
├─ docs/
│  ├─ INFRA.md                 ← _headers / CSP / 캐시 / 외부 도메인 추가 절차
│  └─ design-system/           ← 컴포넌트 카탈로그 (Storybook 대체)
├─ README.md                   ← 본 파일
├─ ONBOARDING.md               ← 처음 30분 둘러보기 (Tutorial)
├─ ARCHITECTURE.md             ← 시스템 이해 (Explanation)
├─ DESIGN.md                   ← 디자인 시스템 SSOT (Google Stitch alpha)
├─ CHANGELOG.md                ← 날짜별 변경 이력
└─ CLAUDE.md                   ← AI 에이전트 룰
```

> [!NOTE]
> 2026-05-21 `redesign/v2`: `data/*.json` + `js/modules/*` + `css/animations.css` 폐기. 시안 단순화 방침에 따라 정적 HTML 1차 작성으로 전환. 자세한 사항은 [`CHANGELOG.md`](./CHANGELOG.md) 참조.

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
- [`.stylelintrc.json`](./.stylelintrc.json) — BEM 패턴, `!important` 금지, 중첩 3단계, breakpoint 화이트리스트 (**620 / 980**)
- [`eslint.config.mjs`](./eslint.config.mjs) — ES Module, `innerHTML`/`outerHTML`/`eval` 금지, `no-undef`
- [`.htmlhintrc`](./.htmlhintrc) — `inline-style-disabled`, `alt-require`, `attr-no-duplication`, `id-unique`

CI는 **도입하지 않음** — 개발자/AI 에이전트의 양심에 맡김. CLAUDE.md "코드 수정 후 lint 실행" 룰이 사실상 강제력.

### Lint가 못 잡는 의미적 규약 (인간 가이드 필수)

- **시맨틱 태그 우선** — `<div>` 남발 대신 `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` 선택
- **`<section>`에 `aria-labelledby` 또는 `aria-label`** — a11y 의미 부여
- **모든 페이지에 skip-link + `<main id="main">`** — htmlhint custom rule 없으므로 review로 보장
- **컴포넌트 1개 = CSS 파일 1개** — `css/components/<block>.css` 구조 의도. 단 시각적·의미적으로 강하게 결합된 컴포넌트(예: 3개 *-map)는 한 파일에 묶어도 OK
- **신규 색상/spacing이 필요하면 토큰 먼저** — `DESIGN.md` 등록 → `tokens.css` 매핑 → 컴포넌트 적용 순서 (워크플로우는 [`DESIGN.md`](./DESIGN.md))
- **경로는 root-absolute** — 모든 정적 자원·메뉴 href는 `/css/`, `/js/`, `/<area>/` 형태로 통일 (Cloudflare 루트 도메인 단일 환경)
- **fetch URL도 root-absolute 문자열** — `'/partials/header.html'` 등 직접 사용
- **이벤트 리스너 scroll/touch는 `{ passive: true }`** — 스크롤 jank 방지
- **`window.<name> = ...` 전역 부여 금지** — eslint `no-implicit-globals`가 일부 잡지만 의도적 전역도 금지

### 형식 규약 (lint가 자동 검증)

| 규약 | 도구 | 룰 |
|---|---|---|
| HTML 인라인 `style` 금지 | htmlhint | `inline-style-disabled` |
| HTML `alt` 누락 | htmlhint | `alt-require` |
| HTML `id` 중복 | htmlhint | `id-unique` |
| CSS BEM 명명 패턴 | stylelint | `selector-class-pattern` |
| CSS `!important` 금지 | stylelint | `declaration-no-important` |
| CSS 중첩 3단계 이하 | stylelint | `max-nesting-depth` |
| CSS breakpoint 화이트리스트 (620/980) | stylelint | `media-feature-name-value-allowed-list` |
| 색상 토큰 SSOT (tokens.css 외 hex 금지) | shell grep | `scripts/lint.sh tokens` |
| JS `innerHTML`/`outerHTML` 금지 | eslint | `no-restricted-syntax` |
| JS `eval`/`document.write`/`new Function()` 금지 | eslint | `no-eval`, `no-restricted-syntax` |
| JS 전역 변수 금지 | eslint | `no-implicit-globals`, `no-undef` |
| JS `var` 금지 | eslint | `no-var` |
| DESIGN.md ↔ tokens.css 정합성 | design.md lint | spec validation + WCAG contrast |

---

## 4. CSS 아키텍처

ITCSS + BEM + CSS Cascade Layers 조합. 단일 진입점 `css/main.css`:

```css
@layer reset, tokens, base, components, pages, utilities;

@import url('reset.css')                              layer(reset);
@import url('tokens.css')                             layer(tokens);
@import url('base.css')                               layer(base);

/* Site chrome */
@import url('components/site-header.css')             layer(components);
@import url('components/footer.css')                  layer(components);

/* Generic UI */
@import url('components/button.css')                  layer(components);
@import url('components/radial-pattern.css')          layer(components);

/* Home layout */
@import url('components/wire-section.css')            layer(components);
@import url('components/sponsor.css')                 layer(components);
@import url('components/notice.css')                  layer(components);

/* Sub-page layout */
@import url('components/sub-visual.css')              layer(components);
@import url('components/overview.css')                layer(components);

/* Sub-page content blocks */
@import url('components/info-panel.css')              layer(components);
@import url('components/program-detail.css')          layer(components);
@import url('components/reserve-button.css')          layer(components);
@import url('components/map.css')                     layer(components);
@import url('components/lineup.css')                  layer(components);
@import url('components/seat-guide.css')              layer(components);
@import url('components/experience-grid.css')         layer(components);
@import url('components/community.css')               layer(components);

@import url('home.css')                               layer(pages);
@import url('page.css')                               layer(pages);

@import url('utilities.css')                          layer(utilities);
```

원칙:
- **페이지별 CSS는 `pages` 레이어**에 두어 컴포넌트 기본형을 자연스럽게 오버라이드. 현재 `home.css` (홈 전용) + `page.css` (5개 서브 페이지 공통) 2개. 신규 페이지가 기존 패턴 내면 `page.css` 추가, 완전히 다르면 새 `css/<area>.css` + main.css `@import`
- **토큰 변경은 반드시 `tokens.css`만** 수정 — DESIGN.md ↔ tokens.css 1:1 매핑 유지. 토큰 워크플로우는 [`DESIGN.md`](./DESIGN.md)
- **반응형 break는 980/620 두 개만** — 기타 break 도입 금지 (DESIGN.md 갱신 + stylelint 화이트리스트 갱신 필요)

---

## 5. JavaScript

시안 단순화 방침으로 동적 렌더 모듈을 폐기했다. 현재 JS는 두 가지 책임만 수행한다:

1. **Custom element 정의 + partial hydration** (`<site-header>`, `<site-footer>`)
2. **URL hash anchor 스크롤 보정**

```js
// js/main.js — 전체 코드 (약 20줄)
import './components/site-header.js';
import './components/site-footer.js';

window.addEventListener('hashchange', resolveHash);
document.addEventListener('DOMContentLoaded', resolveHash);

function resolveHash() {
  if (!location.hash) return;
  const id = decodeURIComponent(location.hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return;
  if (target instanceof HTMLDetailsElement) target.open = true;
  target.scrollIntoView({ behavior: 'auto', block: 'start' });
}
```

| 경로 | 책임 |
|---|---|
| `js/main.js` | 모든 페이지 공통 진입점. custom elements import + hash resolver만 |
| `js/components/site-header.js` | `<site-header>` custom element — partial fetch + `aria-current` 자동 부여 |
| `js/components/site-footer.js` | `<site-footer>` custom element — partial fetch만 |

> [!IMPORTANT]
> **동적 콘텐츠 재도입 시**: 사용자 명시 승인 필요. JSON SSOT + 렌더 모듈 시스템 복원 시 CLAUDE.md "콘텐츠 모드" 항목 동시 갱신.

---

## 6. 공통 컴포넌트(헤더/푸터) 관리

### Web Components 셀프-하이드레이션 패턴

모든 페이지의 헤더/푸터는 **custom element**로 마운트된다. 페이지 HTML에는 `<site-header>` / `<site-footer>` 태그만 두고, 엘리먼트가 `connectedCallback`에서 자체 partial을 fetch하여 자기 `innerHTML`을 교체한다.

```html
<!-- 모든 페이지 공통 -->
<site-header>
  <!-- fallback content: JS 미동작 환경에서 노출 + partial fetch 전 short window의 SEO baseline.
       메뉴 항목 변경 시 이 fallback도 14개 페이지 + 1개 partial 모두 동기화 필요. -->
  <a class="skip-link" href="#main">본문으로 건너뛰기</a>
  <header class="site-header">
    <a class="brand" href="/" aria-label="2026 남산 서머 페스티벌 홈">
      <span class="brand-mark">NS</span>
      <span>2026 남산<br>서머 페스티벌</span>
    </a>
    <nav class="gnb" aria-label="주요 메뉴">
      <div class="gnb-item"><a href="/info/">행사안내</a></div>
      <div class="gnb-item"><a href="/funwalk/">Fun&amp;Walk</a></div>
      <div class="gnb-item"><a href="/night/">Summer Night</a></div>
      <div class="gnb-item"><a href="/garden/">Summer Garden</a></div>
      <div class="gnb-item"><a href="/community/">커뮤니티</a></div>
    </nav>
  </header>
</site-header>

<main id="main"> ... </main>

<site-footer>
  <footer class="footer"> ... </footer>
</site-footer>
```

```js
// js/components/site-header.js — 핵심 발췌
const PARTIAL_URL = '/partials/header.html';

class SiteHeader extends HTMLElement {
  async connectedCallback() {
    const res = await fetch(PARTIAL_URL, { cache: 'default' });
    this.innerHTML = await res.text();
    this.#markCurrent();   // 현재 URL과 매칭되는 링크에 aria-current="page"
  }
}
customElements.define('site-header', SiteHeader);
```

시안의 hover-only submenu는 CSS-only로 작동하므로 토글 JS는 없다. 모바일에서는 980 break로 gnb가 wrap되며 햄버거 아이콘은 시각 데코레이션 역할.

### 메뉴 항목 변경 시 동기화 위치 (반드시 15곳 모두 수정)

1. `partials/header.html` (정상 fetch 결과)
2. `partials/footer.html` (footer brand만 — 시안 단순화로 sitemap 영역 없음)
3-15. fallback nav 13곳:
   - `index.html`
   - `404.html`
   - `info/{index, programs}.html`
   - `funwalk/{index, course, notice}.html`
   - `night/{index, notice}.html`
   - `garden/{index, reservation}.html`
   - `community/{index, faq, refund}.html`

> [!TIP]
> 더 깊은 설명(왜 Web Components를 골랐는지, lifecycle 상세)은 [`ARCHITECTURE.md`](./ARCHITECTURE.md) 참조.

---

## 7. 콘텐츠 관리

### 7-1. 현재 정책 (정적 HTML 1차 작성)

`redesign/v2`(2026-05-21)부터 콘텐츠는 HTML에 직접 작성한다. 시안 단순화 정신에 따라 동적 JSON 시스템을 폐기했다.

- **공지사항**: `community/index.html` `.notice-list` 직접 편집
- **FAQ**: `community/faq.html` 직접 편집 (운영팀 콘텐츠 확정 후 채움)
- **환불 안내**: `community/refund.html` 정적 placeholder
- **프로그램 정보**: 각 area의 `index.html` 직접 편집

### 7-2. 공통 콘텐츠 동기화 규칙

홈(`index.html`)의 공지 미리보기와 `community/index.html` 전체 목록이 같은 항목이면 **두 곳 모두 동시 갱신**. lint 자동 검출 없음 → review 의무 (CLAUDE.md 절대 룰 3).

날짜 표기:
```html
<!-- ISO datetime (시맨틱) + 표시용 텍스트 분리 -->
<time datetime="2026-05-20">2026.05.20</time>
```

### 7-3. 새 공지 1건 추가 예시

`community/index.html`의 `.notice-list` 내부:
```html
<a class="notice" href="/community/">
  <span>공지</span>
  <strong>새 공지 제목</strong>
  <time datetime="2026-06-15">2026.06.15</time>
</a>
```

홈에도 노출하려면 `index.html`의 `.notice-area > .notice-list`에도 동일 항목 추가.

### 7-4. 동적 콘텐츠 재도입 시점

게시글 30건 이상 + SNS 공유/SEO 비즈니스 요구 발생 시 — 사용자 명시 승인 후 다음 옵션 검토:
- **A. 쿼리스트링 단일 페이지**: `/community/notice.html?id=...` (No-build 유지)
- **B. SSG**: Eleventy / Astro 도입, 글마다 정적 HTML 생성

---

## 8. 신규 페이지 추가 절차 (체크리스트)

- [ ] `<area>/<name>.html` 생성. 다른 페이지를 복제하지 말고 **헤더/푸터는 `<site-header>`/`<site-footer>` custom element + fallback markup** 사용.
- [ ] `<title>`, `<meta name="description">`, OG 메타 4종(`og:title`, `og:description`, `og:type`, `og:image`) 작성. OG image는 **absolute URL** (`https://namsangreensummer.com/img/...`).
- [ ] `<main id="main">` + skip-link 포함.
- [ ] 헤더 nav에 항목 추가 → `partials/header.html` + fallback 14곳 동시 갱신.
- [ ] 새 컴포넌트가 필요하면 `css/components/<block>.css` + `css/main.css`에 `@import` 추가.
- [ ] 페이지 전용 스타일이 필요하면 `css/<area>.css` 작성 후 `main.css`의 `pages` 레이어에 추가.
- [ ] 모바일(390/620) · 태블릿(980) · 데스크톱(1280) 시각 확인.
- [ ] `./scripts/lint.sh` 통과 확인 후 보고.
- [ ] `sitemap.xml`에 URL 추가.

---

## 9. 성능 체크리스트

| 항목 | 기준 | 적용 위치 |
|---|---|---|
| LCP | < 2.5 s | 홈 hero 이미지에 `<link rel="preload" as="image" fetchpriority="high">` |
| INP | < 200 ms | JS는 custom element hydration만, 큰 작업 없음 |
| CLS | < 0.1 | 이미지는 `width`/`height` 명시 |
| 폰트 | FOUT 최소화 | Pretendard CDN + 로컬 woff2 subset fallback |
| above-fold 이미지 | `loading="eager"` (기본) | 절대 lazy 처리 금지 |
| below-fold 이미지 | `loading="lazy"` | night-lineup, night-experience 등 |

---

## 10. 접근성 체크리스트

- [ ] 모든 페이지 skip-link 존재.
- [ ] `<main id="main">` 존재.
- [ ] 헤더 nav에 현재 페이지 `aria-current="page"` (페이지 HTML 직접 부여 + site-header.js `#markCurrent()` 보완).
- [ ] 이미지에 `alt` 또는 `aria-hidden="true"`.
- [ ] 버튼/링크 텍스트가 없으면 `aria-label`.
- [ ] 색 대비 4.5:1 이상 — DESIGN.md lint의 `contrast-ratio` 룰이 자동 검증.
- [ ] `prefers-reduced-motion` 감지 시 모션 비활성 (reset.css 이미 처리됨).
- [ ] 키보드만으로 모든 인터랙션 가능 — submenu가 `:focus-within`으로도 열림.

---

## 11. 변경 시 영향 범위 매트릭스

| 변경 종류 | 수정 파일 | 영향 페이지 | 참고 |
|---|---|---|---|
| 색상/spacing 토큰 | `DESIGN.md` + `css/tokens.css` (1:1) | 전체 | DESIGN.md "변경 워크플로우" |
| 메뉴 항목 | `partials/header.html` + fallback 14곳 (총 15곳) | 전체 | §6 마지막 표 |
| 공지/FAQ 1건 추가 | `community/index.html` + (필요 시) 홈 `index.html` 동시 갱신 | 두 페이지 | §7-2 |
| 환불 정책 갱신 | `funwalk/notice.html` 직접 편집 | Fun&Walk notice + (필요 시) community/refund | review 의무 |
| 새 컴포넌트 | `DESIGN.md` `components:` + `css/components/<X>.css` + `css/main.css` @import | 사용처만 | |
| JS 동작 변경 | `js/components/<X>.js` | 해당 모듈 사용 페이지 | 시안 단순화로 modules 폐기 — components만 |
| 외부 도메인 / CDN 추가 | `_headers` CSP 갱신 + HTML preconnect | 전체 (보안 정책) | [`docs/INFRA.md`](./docs/INFRA.md) §4 |
| 새 페이지 추가 | §8 체크리스트 + `sitemap.xml` URL 추가 + fallback nav 14곳 | 신규 | |

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
> **포트 3000 고정** — 외부 시스템(Kakao/Naver 등) 도메인 화이트리스트 등록 시 일관성 유지.

---

## 13. 마이그레이션 이력

본 § 는 **현재 진행 중 / 계획**만 다룹니다. 완료된 마이그레이션 상세는 [`CHANGELOG.md`](./CHANGELOG.md) 참조.

### 완료 (요약)

| 단계 | 완료 시점 | 상세 |
|---|---|---|
| partials/modules 분리 (Phase 1) | 2026-05-18 | CHANGELOG 2026-05-18 |
| Custom Elements 마이그레이션 | 2026-05-19 | CHANGELOG 2026-05-19 |
| CSS `@layer` + 컴포넌트 분리 | 2026-05-19 | CHANGELOG 2026-05-19 |
| 디자인 시스템 SSOT (`DESIGN.md`) | 2026-05-19 | CHANGELOG 2026-05-19 |
| `_headers` CSP + 캐시 정책 | 2026-05-20 | CHANGELOG 2026-05-20, [`docs/INFRA.md`](./docs/INFRA.md) |
| 문서 체계 정비 | 2026-05-20 | CHANGELOG [Unreleased] |
| **redesign/v2** — 시안 단순화 전면 재구축 | 2026-05-21 | URL 슬러그·디자인 시스템·CSS·HTML·라우팅 전부 재작성. data/* + js/modules 폐기. CHANGELOG redesign/v2 |

### 진행 중 / 계획

1. **`www.namsangreensummer.com` Custom Domain + apex 301** — Cloudflare 설정 ([`§14-5`](#14-5-도메인-전환-체크리스트))
2. **`pages.dev` 서브도메인 `X-Robots-Tag: noindex`** — CF Transform Rules
3. **Lighthouse 측정 + 회귀 가드** — LCP < 2.5s, CLS < 0.1, INP < 200ms
4. **community/faq.html + refund.html 실 콘텐츠 입력** — 운영팀 확정 대기
5. **후원사 로고 입력** — 운영팀 확정 대기 (`index.html` `.sponsor-grid` 직접 편집)

---

## 14. 배포 환경

본 사이트는 **Cloudflare Pages 루트 도메인 단일 환경**에 배포된다 (2026-05-20 결정).
로컬 개발은 `npx serve -l 3000`으로 검증한다.

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

1. **HTML 정적 경로**: `<script src="/js/main.js">`, `<link rel="stylesheet" href="/css/main.css">`, `<a href="/info/">`. partial 내 메뉴 href(`/info/` 등)도 동일.
2. **JS fetch URL**: `'/partials/header.html'` 같은 root-absolute 문자열 직접 사용. `site-header.js`, `site-footer.js` 모두 동일 패턴.

### 14-3. 환경별 동작 검증

#### Cloudflare (프로덕션)
1. Cloudflare에 도메인 zone 추가 → 네임서버 2개 발급
2. Gabia DNS에서 네임서버를 위 2개로 변경 (전파 ~1시간)
3. Cloudflare Pages 프로젝트 생성 → GitHub repo 연결:
   - Framework preset: **None**
   - Build command: `exit 0`
   - Build output directory: 비움
   - Production branch: `main`
4. Pages 프로젝트 → Custom Domains → `namsangreensummer.com` 추가 (CF가 CNAME flattening 자동 처리)
5. SSL/TLS → Overview → 모드를 **Full** 이상으로 설정
6. `https://namsangreensummer.com/` 접속
7. DevTools Console 에러 0, Network 탭에서 `/partials/header.html`, `/partials/footer.html`이 200

### 14-4. 코드 작성 원칙

새 파일·기능 추가 시:
- **HTML에서 root-absolute 경로(`/...`) 통일** — 페이지-상대(`../js/main.js`) 사용 금지
- **JS fetch URL도 root-absolute 문자열**
- **CSS의 `url()` 참조는 CSS 파일 위치 기준 상대** (브라우저가 자동 처리)
- **외부 폼/링크는 도메인 포함 절대 URL**

### 14-5. 도메인 전환 체크리스트

테스트 → 프로덕션(Cloudflare/namsangreensummer.com) 전환 진행 상태:

- [x] Cloudflare 가입 + `namsangreensummer.com` zone 추가 (Free 플랜)
- [x] Gabia에 네임서버 변경 (`eugene.ns.cloudflare.com`, `paloma.ns.cloudflare.com`)
- [x] Cloudflare Pages 프로젝트 생성 + GitHub repo 연결
- [x] Pages 프로젝트에 `namsangreensummer.com` Custom Domain 연결 (apex)
- [x] SSL/TLS 모드 설정 (현재 **Full** — "Full (Strict)" 갱신 권장)
- [x] OG/SNS 메타 태그 (모든 페이지 `og:image` 절대 URL 적용 완료)
- [x] 루트 `404.html` 추가
- [x] `robots.txt` + `sitemap.xml` 추가 (**13 URL**, 2026-05-21 redesign/v2 슬러그)
- [x] `_headers` 파일 — 보안 헤더 + CSP + 캐시 정책. 상세 [`docs/INFRA.md`](./docs/INFRA.md)
- [ ] `www.namsangreensummer.com` Custom Domain 추가 + apex로 301
- [ ] `pages.dev` 서브도메인 `X-Robots-Tag: noindex` (CF Transform Rules)
- [ ] Lighthouse 측정 + 회귀 가드: LCP < 2.5s, CLS < 0.1, INP < 200ms

### 14-6. Cloudflare Pages 프로젝트 정보

> [!CAUTION]
> 계정 / 권한 등 민감 정보는 repo에 두지 말 것. 별도 인수인계 문서에서 관리.

| 항목 | 값 |
|---|---|
| 프로젝트 이름 | `namsan-green-summer` |
| pages.dev URL | `https://namsan-green-summer.pages.dev/` |
| Production branch | `main` |
| Framework preset | None |
| Build command | `exit 0` |
| Build output directory | (빈 칸 = 저장소 루트) |
| Custom domains | `namsangreensummer.com` (apex) / `www.namsangreensummer.com` (예정) |
| Cloudflare 네임서버 | `eugene.ns.cloudflare.com`, `paloma.ns.cloudflare.com` |
| 도메인 등록기관 | Gabia (DNS 관리는 Cloudflare로 위임) |
| SSL 인증서 | Cloudflare 자동 |

### 14-7. Cloudflare Pages 동작 특이점

배포 환경에서만 발생하는 동작. 디버깅 시 자주 막히는 지점.

1. **디렉토리 URL + `.html` 자동 drop (308 redirect)**
   - `/info/` 요청 시 자동으로 `/info/index.html` 서빙 (no redirect).
   - 서브 페이지 `/funwalk/course.html` 등은 `/funwalk/course`로도 접근 가능. 단, 코드/문서 표기는 명시성 위해 `.html` 유지.

2. **404 처리**
   - 매칭되는 정적 자산이 없으면 루트 `404.html`을 404 상태로 서빙.
   - `404.html`은 `<meta name="robots" content="noindex, follow">` 포함.

3. **자동 보안 헤더**
   - CF가 다음을 자동 부여: `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`.

4. **AI 봇 차단 (기본 활성)**
   - CF 대시보드 → AI 크롤러 제어 → "모든 페이지에서 차단".

5. **`*.pages.dev` 중복 인덱싱 위험**
   - 권장: CF Transform Rules에서 hostname이 `pages.dev` 포함이면 `X-Robots-Tag: noindex` 추가.

### 14-8. 운영 / 비상 대응

| 상황 | 조치 |
|---|---|
| **롤백** | CF Pages → Deployments → 이전 성공 배포 → "Rollback to this deployment" |
| **캐시 퍼지** | CF 대시보드 → Caching → Configuration → "Purge Everything" |
| **빌드 실패** | Deployments → 실패 배포 → Build log 확인 |
| **SSL 발급 지연** | Custom Domain 추가 후 보통 5-15분. 1시간 후에도 미발급이면 SSL/TLS → Edge Certificates 상태 확인 |
| **도메인 장애 시 우회** | `*.pages.dev` URL은 도메인/SSL과 분리. 임시 안내 가능 |
| **DNS 변경** | CF 대시보드 → DNS → Records. 가비아 DNS 패널은 NS 위임 후 무효 |
