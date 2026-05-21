# CLAUDE.md

이 파일은 Claude Code가 이 저장소에서 작업할 때 자동 로드된다. 상세 가이드는 `README.md`를 참조하라. 본 파일은 **AI가 반드시 지켜야 할 규칙과 자주 깨지는 패턴**만 압축한다.

---

## 프로젝트 컨텍스트

- 2026 남산 서머 페스티벌 정적 사이트
- **멀티페이지(MPA) · 빌드 도구 없음 · Vanilla JS · 한국어**
- 페이지: `index.html` + `<area>/{index,page}.html` × 5
- 단일 진실원(SSOT): 공통 마크업은 `partials/`, 디자인은 `DESIGN.md` + `css/tokens.css` (1:1 매핑)
- 콘텐츠 모드: **정적 HTML 1차 작성** — 동적 렌더 모듈(`js/modules/*`) + `data/*.json` 시스템은 2026-05-21 redesign/v2에서 폐기 (시안 단순화 방침)

---

## 절대 룰 (위반 시 즉시 중단)

1. **헤더/푸터 마크업을 페이지마다 복붙 금지** — `partials/header.html`, `partials/footer.html` 단일 편집. 새 페이지에는 `<site-header>...fallback...</site-header>` / `<site-footer></site-footer>` 커스텀 엘리먼트 사용. fallback nav는 최소 마크업 (로고 + 메뉴 5개)으로 유지 — 메뉴 항목 변경 시 fallback 6곳 + partial 1곳 모두 갱신.
2. **공지/FAQ 콘텐츠는 HTML에 직접 작성** — 시안 단순화 방침에 따라 정적 마크업으로 작성. 같은 콘텐츠가 두 페이지에 들어갈 경우 review 의무 (lint 자동 검출 없음). 동적 시스템 재도입은 사용자 명시 승인 필요.
3. **동일 콘텐츠 중복 시 review 의무** — 홈의 공지 미리보기와 `community/index.html` 전체 목록이 같은 항목이면 두 곳 모두 동시 갱신. drift 발생 시 사용자 보고.
4. **인라인 `style` 속성 금지** — 색상/그라데이션은 컴포넌트 modifier 또는 CSS 변수로.
5. **`<script type="module">` 사용. 전역 `<script src>` 금지**, 전역 변수 금지.
6. **`DESIGN.md`/`tokens.css`에 없는 값 직접 사용 금지** — 대상: 색상·spacing·radius·typography·**size**(고정 dimension, 예: 48px icon)·**alpha 변형**(dark-context 또는 program color soft variant 등 rgba 패턴). `DESIGN.md` 먼저 등록 → `tokens.css`에 동일 이름으로 매핑 → 컴포넌트 적용. 단 다음은 예외: (a) `?spec=1` dev tooling 내부 매직값, (b) 컴포넌트 내부 좌표(hamburger lines 등 1회 사용 절대좌표).
7. **`!important` 금지** (접근성 fallback 제외).
8. **빌드 도구·npm 의존성 추가 금지** — 사용자가 명시 승인하기 전까지 No-build 원칙 유지.
9. **외부 URL이 필요한 메타 (`og:image`, `og:url`, `canonical`) 절대 URL 사용** — 프로덕션 도메인 `https://namsangreensummer.com` 기준. 페이지-상대 또는 root-absolute 금지 (SNS 봇이 못 찾음).
10. **디자인 시스템은 `DESIGN.md` SSOT** — 색상/타이포/spacing/radius/컴포넌트는 `DESIGN.md` (Google Stitch alpha spec)를 먼저 갱신한 뒤 CSS 반영. lint(`npx @google/design.md lint DESIGN.md`)가 **0 errors / 0 warnings** 통과해야 머지.
11. **코드 수정 후 `./scripts/lint.sh` 실행 필수** — CI 미도입 결정(2026-05-20)에 따라 lint 통과는 AI 에이전트(본인)와 개발자가 양심적으로 보장한다. 실패 시 fix 후 재실행, 통과 못 한 상태로 사용자에게 완료 보고 금지. 부분 실행: `./scripts/lint.sh {css|js|html|design|tokens}`. 만진 파일 종류만 검증해도 됨 (전체는 PR 직전).
12. **mirror 문서(같은 정보를 두 출처에 가진 파일 쌍) 한쪽 변경 시 다른 쪽도 같은 PR에서 동시 갱신** — 현 mirror pair 2개:
    - `sitemap.xml` ↔ `docs/INFRA.md §6-2` — URL 목록·priority·changefreq
    - `_headers` ↔ `docs/INFRA.md §1-§3` — Cache-Control(max-age·must-revalidate)·CSP 지시문·외부 도메인 화이트리스트

    한쪽 갱신 후 반드시 다른 쪽을 grep으로 cross-reference하여 drift 없는지 확인. lint 자동 검출 없음 → review 의무.
    이전 pair 2개는 redesign/v2(2026-05-21)에서 폐기: `data/image-slots.json` ↔ `docs/IMAGE_SPEC.md`는 image-slot 시스템 폐기와 함께 제거, `data/programs.json.refund_policy` ↔ `funwalk/notice.html`은 정적 HTML 단일 출처 정책으로 mirror 해체.

---

## 코드 작성 규약

### HTML
- 들여쓰기 2칸. 시맨틱 태그 우선(`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`).
- 모든 페이지: `<a class="skip-link" href="#main">본문으로 건너뛰기</a>` + `<main id="main">` 필수.
- `<section>`에 `aria-labelledby` 또는 `aria-label` 부여.
- 메타: `<title>`, `<meta name="description">`, OG 4종(`og:title`/`og:description`/`og:type`/`og:image`).
- **기본 언어 한국어 (`<html lang="ko">`).** 사용자 노출 텍스트는 한국어 우선. 영문 사용은 다음 카테고리에만 허용:
  - 프로그램 공식 영문명: `Fun&Walk` / `Summer Night` / `Summer Garden`
  - SNS 플랫폼명: Instagram / YouTube / Blog (aria-label, 아이콘 표기)
  - 도메인 / 외부 서비스 URL
  - 기타 모든 라벨 (breadcrumb / eyebrow / `<dt>` / 섹션 헤더 / hero 디스플레이 카피)은 한국어. 이미 영문으로 작성된 경우 한국어로 의역.

### CSS
- 명명: **BEM** (`block__element--modifier`).
- 컴포넌트 1개 = 파일 1개 (`css/components/<block>.css`).
- 페이지 전용 스타일은 `css/<area>.css` 한 파일에 담는다. 현재는 `css/home.css` (홈 전용) + `css/page.css` (5개 서브페이지 공통) 둘만 존재. 새 페이지가 기존 패턴 안에 들어가면 `page.css`에 추가, 완전히 다른 레이아웃이면 새 `css/<area>.css` 생성 후 `main.css`에 `@import`.
- 진입점: `css/main.css` 하나만 HTML이 link. `@layer reset, tokens, base, components, pages, utilities;` 순서.
- 간격은 `var(--space-*)`, 색상은 `var(--color-*)` 토큰만 사용. 모든 CSS 토큰은 `DESIGN.md` YAML과 **1:1 매핑** 유지 (이름·값 모두).
- 셀렉터 중첩 3단계 이하.
- 반응형 break: `980px`(헤더 gnb wrap + overview-layout 단일컬럼), `620px`(모바일 — 헤더 static + 그리드 단일컬럼). 신규 break 만들지 말고 둘 중 하나 선택. (stylelint `media-feature-name-value-allowed-list`로 강제)

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

공지/FAQ/일정 등 목록형 콘텐츠를 다룰 때 (정적 HTML 모드):

1. `community/index.html` 의 `.notice-list` 내부에 `<a class="notice">...</a>` 항목 직접 추가.
2. 홈(`index.html`)의 공지 미리보기와 `community/index.html` 전체 목록은 동일 콘텐츠로 동시 갱신 (drift 방지 — review 의무).
3. 날짜는 `<time datetime="YYYY-MM-DD">2026.05.20</time>` 형식 (시맨틱 datetime + 표시용 텍스트 분리).
4. 상세 페이지는 사용 안 함 — 목록 항목만. 추후 SEO 필요 시 SSG 도입을 사용자에게 제안.

---

## 신규 페이지 추가 시 절차

1. `<area>/<name>.html` 생성 — 다른 페이지 복제하지 말 것.
2. 헤더/푸터는 `<div data-include="/partials/...">` 슬롯만.
3. 메타·skip-link·`<main id="main">` 포함.
4. 메뉴 추가 필요 시 `partials/header.html` + `partials/footer.html` 단일 편집.
5. 새 컴포넌트면 `css/components/<X>.css` + `css/main.css`에 `@import` 추가.
6. 페이지 전용 스타일은 `css/<area>.css`.
7. 모바일(390/620) · 태블릿(980) · 데스크톱(1280) 확인 후 보고.

---

## 자주 깨지는 패턴 (방지 목록)

| 안티패턴 | 올바른 방식 | lint 자동 검출 |
|---|---|---|
| `<header>...</header>`를 새 페이지에 복붙 | `<site-header>...fallback...</site-header>` (자체 hydrate) | ✗ (review 필수) |
| `<li>공지제목</li>` 직접 작성 | `data/notices.json`에 추가 + 렌더 모듈이 자동 표시 | ✗ |
| `style="background: linear-gradient(...)"` | 컴포넌트 modifier class + `tokens.css` 색상 | ✓ htmlhint `inline-style-disabled` |
| `<script src="js/header.js">` 추가 | `js/components/<X>.js`에 customElements.define 후 `main.js`에서 import | ✗ |
| analytics/GA를 `partials/*.html`에 `<script>` 직접 삽입 | `innerHTML`/`outerHTML` 주입 시 `<script>`는 미실행 — `js/main.js`에 import하거나 페이지 HTML inline 추가 | ✗ |
| 새 색상 헥스값 컴포넌트에 직접 작성 | `DESIGN.md` `colors:` 등록 → `tokens.css` 의미 토큰 추가 → 컴포넌트 적용 | ✓ `lint.sh tokens` (hex 검출) |
| `DESIGN.md`/`tokens.css`가 어긋남 (이름/값 불일치) | 둘을 같은 PR에서 동시 갱신, lint 통과 확인 | ✓ `@google/design.md lint` |
| 새 컴포넌트를 CSS만 작성 | `DESIGN.md` `components:` 등록 + Components prose 1단락 동시 작성 | ⚠ design.md lint 일부 검출 |
| 같은 공지를 `index.html`/`community.html` 둘에 입력 | 한 JSON에 1번, `data-limit` 속성으로 다르게 호출 | ✗ |
| `el.innerHTML = jsonData.title` | `el.textContent = jsonData.title` | ✓ eslint `no-restricted-syntax` |
| 날짜를 `"2026.05.20"` 형태로 JSON 저장 | `"2026-05-20"` 저장, 표시 시 `formatDate()` | ✗ |
| `!important` 추가 | layer 순서 조정 또는 specificity 재설계 | ✓ stylelint `declaration-no-important` |
| 새 CSS 셀렉터 4단계 중첩 | 컴포넌트 분리 또는 modifier class | ✓ stylelint `max-nesting-depth` |
| 새 breakpoint (예: `@media (max-width: 1024px)`) | 768/900 화이트리스트 내 선택 또는 DESIGN.md 갱신 후 추가 | ✓ stylelint `media-feature-name-value-allowed-list` |
| 새 전역 변수 `window.foo = ...` | 모듈 내부 클로저 또는 export | ✓ eslint `no-implicit-globals` |
| `eval()` / `new Function()` / `document.write()` | DOM API 사용 | ✓ eslint `no-eval`, `no-restricted-syntax` |
| 비교/매칭표를 row 번호로 줄세움 (예: 3-way 비교 시 N번째 항목끼리 강제 매칭) | 각 항목에 **책임 단위**(이 zone이 답하는 사용자 질문 1개)를 1줄로 부여 후 책임 단위로 outer join. 같은 책임이면 같은 행, 한쪽만 있으면 빈칸. row 순서 매칭은 가짜 alignment를 만든다 (2026-05-20 매칭표 사고에서 도입) | ✗ (review 필수) |
| `data/image-slots.json` 변경 후 `docs/IMAGE_SPEC.md` 미갱신 (운영팀 핸드오프 drift) | mirror 문서 동시 갱신 — 절대 룰 12 참조 | ✗ (review 필수) |

---

## 응답·작업 스타일

- 한국어. 간결. 이모지 금지.
- 모호한 "개선/정리/최적화" 요청은 구체화 후 진행.
- 멀티파일 변경 전 영향 범위 매트릭스(`README.md §11`) 확인.
- 변경 후 정적 서버(`npx serve -l 3000`)로 동작 검증 권장 사항을 사용자에게 안내. 포트 3000은 카카오 콘솔 도메인 화이트리스트와 일치하도록 고정.
- 빌드 도구 도입·외부 의존성 추가·SSG 전환은 **반드시 사용자 승인** 후 진행.

---

## 마이그레이션 현재 상태 (2026-05-21 시점, redesign/v2 완료)

시안 단순화 방침에 따라 전면 재설계 완료:
- **디자인 시스템**: light-baseline + dark-section 이중 시스템 → **white paper + 단일 neon 모티프**로 통일. Anton·Montserrat 폐기, **Pretendard 단일 폰트** (weight 600~950).
- **URL slug**: `event/fun-and-walk/summer-night/summer-garden` → `info/funwalk/night/garden` (시안 영문명 1:1).
- **콘텐츠 모드**: 동적 렌더(js/modules + data/*.json) → **정적 HTML 1차 작성**. js/modules + data/*.json + animations.css 폐기.
- **유지 자산**: partials/header.html + footer.html, js/components/site-header.js + site-footer.js (커스텀 엘리먼트 hydration), scripts/lint.sh, _headers, sitemap.xml.

현 코드베이스는 본 가이드와 일치한다.

---

## 디자인 시스템 (DESIGN.md)

- **SSOT**: 루트 [`DESIGN.md`](./DESIGN.md) — [Google Stitch DESIGN.md alpha spec](https://github.com/google-labs-code/design.md) 준수.
- 정의 카테고리: colors / typography / spacing / rounded / **sizes** / components. **정확한 수치는 본 파일이 아니라 항상 `DESIGN.md` 원본을 grep/awk로 확인** — 본 파일에 수치를 박지 말 것(stale 누적 원인).
- 섹션 순서 강제: Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Sizes → Components → Do's and Don'ts.

### 변경 워크플로우

1. **새 토큰**(색상/폰트/spacing/radius) 필요 → `DESIGN.md` YAML 먼저 수정 → `css/tokens.css`에 동일 이름으로 매핑.
2. **새 컴포넌트** 추가 → `DESIGN.md` `components:` 등록 + Components prose 1단락 작성 → `css/components/<X>.css` 작성.
3. **변경 후 검증**: `npx @google/design.md lint DESIGN.md` → **0 errors / 0 warnings** 통과 필수.
4. **WCAG**: 새 bg/text 쌍은 **4.5:1 (AA) 이상**. lint의 `contrast-ratio` 룰이 자동 검증.
5. **orphaned-tokens**: 모든 color 토큰은 최소 1개 컴포넌트에서 참조되어야 함. 사용처 없는 토큰은 추가 금지.

### 디자이너 핸드오프 vs 디자인 시스템

- **디자인 시스템(규칙)** → `DESIGN.md`
- **이미지 자산(콘텐츠)** → [`docs/IMAGE_SPEC.md`](./docs/IMAGE_SPEC.md) + `data/image-slots.json` + `?spec=1` 모드
- 두 문서는 상호 보완. 시스템 변경 시 `DESIGN.md`, 자산 변경 시 `IMAGE_SPEC.md`.

### lint 자동 허용

`.claude/settings.json`에 `Bash(npx @google/design.md lint:*)` 화이트리스트 등록. 매번 승인 없이 검증 실행 가능.

---

## 배포 환경

본 사이트는 **Cloudflare Pages 루트 도메인 단일 환경**에 배포된다 (`https://namsangreensummer.com/`, Gabia 등록 + Cloudflare 네임서버).
GitHub Pages subpath 배포는 폐기 (2026-05-20).

코드 작성 시 **반드시**:
- HTML 정적 자원·메뉴 href는 root-absolute (`/css/`, `/js/`, `/<area>/`) 통일.
- JS fetch URL도 root-absolute 문자열 (`/data/...`, `/partials/...`) 사용. subpath 호환을 위한 `new URL(..., import.meta.url)` 우회 패턴은 폐기.
- partial 내부 href, fallback content nav도 root-absolute (`/<area>/...`) 직접 작성.

상세: [`README.md §14`](./README.md#14-배포-환경) 참조.
