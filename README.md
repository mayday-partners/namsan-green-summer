# 2026 남산 그린 서머 페스티벌

2026.06.27 남산공원에서 열리는 도심형 여름 페스티벌의 공식 정적 웹사이트.

본 README는 프로젝트 개요와 개발 지침을 함께 다룬다. 신규 페이지·컴포넌트 추가, 콘텐츠 업데이트, 게시판 관리 시 본 문서를 우선 참조한다. AI(Claude Code) 작업 지침은 [`CLAUDE.md`](./CLAUDE.md) 참조.

## 빠른 시작

```bash
# 정적 서버 실행 (fetch가 file:// 에서 동작 안 하므로 필수)
python3 -m http.server 8000
# 또는: npx serve .
```

브라우저: <http://localhost:8000/>

---

## 1. 프로젝트 개요

| 항목 | 값 |
|---|---|
| 종류 | 멀티페이지(MPA) 정적 사이트 |
| 빌드 도구 | 없음 (브라우저가 직접 실행) |
| 언어 | HTML5, CSS3, Vanilla JavaScript (ES2020+) |
| 페이지 수 | 6 (`index.html` + `pages/*.html` × 5) |
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
├─ index.html
├─ pages/
│  ├─ event.html
│  ├─ fun-and-walk.html
│  ├─ green-night.html
│  ├─ green-garden.html
│  └─ community.html
├─ partials/                  ← 공통 마크업 (헤더/푸터 fetch 대상)
│  ├─ header.html
│  └─ footer.html
├─ data/                      ← 콘텐츠 데이터 (게시판 SSOT)
│  ├─ notices.json
│  ├─ faqs.json
│  └─ schedule.json
├─ css/
│  ├─ tokens.css              ← Settings (변수)
│  ├─ reset.css               ← Generic
│  ├─ base.css                ← Elements
│  ├─ components/             ← Components (BEM 블록 단위)
│  │  ├─ header.css
│  │  ├─ footer.css
│  │  ├─ button.css
│  │  ├─ card.css
│  │  ├─ faq.css
│  │  ├─ notice-list.css
│  │  └─ ...
│  ├─ pages/
│  │  ├─ home.css
│  │  └─ page.css
│  └─ main.css                ← @layer + @import 진입점
├─ js/
│  ├─ main.js                 ← ES Module 진입점
│  └─ modules/
│     ├─ include.js           ← partials 주입
│     ├─ header.js            ← 헤더 스크롤·모바일 토글
│     ├─ observer.js          ← fade-in IntersectionObserver
│     ├─ notice-list.js       ← 공지사항 렌더
│     ├─ faq-list.js          ← FAQ 렌더
│     └─ render.js            ← 공통 템플릿 헬퍼
├─ img/
├─ fonts/
├─ README.md
└─ CLAUDE.md
```

> 현재 단계에서는 `partials/`, `data/`, `js/modules/`가 아직 존재하지 않을 수 있다. 신규 작업 시 본 구조로 점진 이행한다.

---

## 3. 코드 스타일

### HTML
- 들여쓰기 2칸, 속성 순서는 `class → id → data-* → aria-* → role`.
- 시맨틱 우선: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- `<section>`에는 `aria-labelledby` 또는 `aria-label` 부여.
- 모든 페이지는 `<a class="skip-link" href="#main">본문으로 건너뛰기</a>`와 `<main id="main">`를 포함.
- 인라인 `style` 금지 — 색상/그라데이션은 컴포넌트 modifier 또는 CSS 변수로 처리.

### CSS
- 명명: **BEM** (`block__element--modifier`).
- 단위: 폰트는 `rem`, 간격은 토큰(`var(--space-*)`), 미디어 쿼리 breakpoint는 `768px` / `900px` / `1440px` 기준.
- 셀렉터 중첩 깊이 3단계 이하.
- `!important` 금지(접근성 fallback 외).
- 컴포넌트 1개 = CSS 파일 1개 (`css/components/<block>.css`).
- 색상은 토큰만 사용 (`tokens.css`에 없는 색상이 필요하면 먼저 토큰 추가).

### JavaScript
- ES Module 기본 (`<script type="module">`), 전역 변수 금지.
- 한 모듈 = 한 책임(SRP), 외부에 공개할 것만 `export`.
- DOM 쿼리는 모듈 초기화 함수 내부에서만 실행, 모듈 최상단에서 `document.querySelector` 호출 금지(import 시점에 DOM 미준비 위험).
- 이벤트 리스너에는 가능한 한 `{ passive: true }` 옵션 사용(scroll/touch).
- async 함수의 await에는 `try/catch`로 fetch 실패 처리.

---

## 4. CSS 아키텍처

ITCSS + BEM + CSS Cascade Layers 조합:

```css
/* css/main.css — 모든 페이지가 이 파일 하나만 link */
@layer reset, tokens, base, layouts, components, pages, utilities;

@import url('reset.css')                    layer(reset);
@import url('tokens.css')                   layer(tokens);
@import url('base.css')                     layer(base);

@import url('components/header.css')        layer(components);
@import url('components/footer.css')        layer(components);
@import url('components/button.css')        layer(components);
@import url('components/card.css')          layer(components);
@import url('components/faq.css')           layer(components);
@import url('components/notice-list.css')   layer(components);
@import url('components/timetable.css')     layer(components);
/* ...더 추가될 컴포넌트... */

@import url('pages/home.css')               layer(pages);
@import url('pages/page.css')               layer(pages);
```

원칙:
- 페이지별 CSS는 `pages` 레이어에 두어 컴포넌트 기본형을 자연스럽게 오버라이드.
- 토큰 변경은 **반드시 `tokens.css`만** 수정.
- 신규 색상/간격이 필요하면 토큰 먼저 추가 → 컴포넌트 적용 순서 준수.

---

## 5. JavaScript 모듈 패턴

```html
<!-- 모든 HTML의 </body> 직전 -->
<script type="module" src="/js/main.js"></script>
```

```js
// js/main.js
import { mountIncludes } from './modules/include.js';
import { initHeader } from './modules/header.js';
import { initFadeIn } from './modules/observer.js';
import { renderNoticeList } from './modules/notice-list.js';
import { renderFaqList } from './modules/faq-list.js';

(async () => {
  await mountIncludes();          // 헤더/푸터 주입 먼저
  initHeader();                   // 그 후 헤더 상호작용
  await Promise.all([
    renderNoticeList(),           // 데이터 의존 렌더
    renderFaqList(),
  ]);
  initFadeIn();                   // 마지막에 IntersectionObserver 등록
})();
```

모듈 작성 규약:
- 한 모듈은 `init...()`, `render...()`, `mount...()` 등 동사로 시작하는 함수를 export.
- 모듈 외부에 상태(state)를 노출하지 않는다.
- DOM이 없는 경우(타깃 요소 부재) 조용히 `return` — 다른 페이지에서 import해도 안전해야 한다.

---

## 6. 공통 컴포넌트(헤더/푸터) 관리

### 마크업 단일화
모든 페이지의 `<header>`와 `<footer>`는 `partials/`에서 단 한 번 정의하고, 각 페이지에서는 자리 표시자만 둔다.

```html
<!-- 모든 페이지 공통 -->
<div data-include="/partials/header.html"></div>
<main id="main"> ... </main>
<div data-include="/partials/footer.html"></div>
```

```js
// js/modules/include.js
export async function mountIncludes(root = document) {
  const slots = root.querySelectorAll('[data-include]');
  await Promise.all([...slots].map(async (el) => {
    try {
      const res = await fetch(el.dataset.include);
      if (!res.ok) throw new Error(res.statusText);
      el.outerHTML = await res.text();
    } catch (err) {
      console.error('[include]', el.dataset.include, err);
    }
  }));
}
```

`<noscript>` fallback: JS 미사용 환경에서는 헤더가 비게 되므로, partials에 들어갈 메뉴를 `<noscript>` 블록으로 한 번 더 정적 출력하거나, 향후 SSG(11ty 등) 도입 시 자동 인라이닝한다.

### 현재 페이지 표시
헤더 partial 로딩 직후, 현재 페이지 URL과 일치하는 nav 링크에 `aria-current="page"`를 자동 부여한다.
```js
// js/modules/header.js 내 initHeader 끝
const here = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.site-nav__link').forEach(a => {
  if (a.getAttribute('href').endsWith(here)) a.setAttribute('aria-current', 'page');
});
```

---

## 7. 콘텐츠 / 게시판 관리 (핵심)

### 7-1. 문제 정의
공지사항·FAQ·일정 같은 "자주 바뀌는 목록형 콘텐츠"가 현재 HTML 마크업에 직접 박혀 있고, 동일 항목이 `index.html`(미리보기)과 `pages/community.html`(전체) **양쪽에 중복**된다. 항목을 1건 추가하려면 두 페이지의 HTML을 모두 수정해야 한다.

### 7-2. 관리 원칙
1. **데이터는 JSON 1개 파일**(SSOT) — `data/notices.json` 등.
2. **마크업은 템플릿 1개**(`<template>` 또는 JS 문자열).
3. **렌더는 모듈 1개**(`notice-list.js`).
4. **표시 위치는 N개** — 같은 데이터를 다른 변형(요약/전체)으로 호출.
5. **스키마는 명시** — 필드명·타입·필수 여부를 본 문서에 기재.

### 7-3. 데이터 스키마

#### `data/notices.json`
```json
[
  {
    "id": "2026-05-20-launch",
    "date": "2026-05-20",
    "title": "2026 남산 그린 서머 페스티벌 공식 홈페이지 오픈!",
    "category": "공지",
    "pinned": true,
    "body": "본문 마크다운 또는 HTML 문자열(상세 페이지 사용 시)",
    "link": null
  }
]
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | string | ✅ | 영문 kebab-case 유일 식별자. URL slug 겸용 |
| `date` | string(YYYY-MM-DD) | ✅ | 게시일. 내림차순 정렬 기준 |
| `title` | string | ✅ | 목록·상세 공통 제목 |
| `category` | string | ⬜ | "공지" / "이벤트" / "긴급" 등 |
| `pinned` | boolean | ⬜ | 상단 고정 여부 |
| `body` | string | ⬜ | 상세 본문. 없으면 목록만 표시 |
| `link` | string\|null | ⬜ | 외부 링크면 상세 페이지 대신 이 URL로 |

#### `data/faqs.json`
```json
[
  {
    "id": "fee",
    "question": "참가비가 있나요?",
    "answer": "모든 입장은 무료입니다. 다만 Fun&Walk, Green Garden 도슨트 등 일부 프로그램은 사전 예약이 필요합니다.",
    "tags": ["참가", "예약"]
  }
]
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | string | ✅ | 앵커 링크 ID(`#faq-fee`)로 사용 |
| `question` | string | ✅ | summary에 표시 |
| `answer` | string | ✅ | details 본문 (HTML 허용) |
| `tags` | string[] | ⬜ | 향후 필터링 확장용 |

### 7-4. 템플릿과 렌더링

```html
<!-- pages/community.html 일부 -->
<ul class="notice__list" data-notice-list data-limit="all"></ul>

<!-- index.html 일부 -->
<ul class="notice__list" data-notice-list data-limit="4"></ul>
```

```html
<!-- partials/templates.html (또는 community.html 내부에 둠) -->
<template id="tpl-notice-item">
  <li>
    <a class="notice__item" href="">
      <span class="notice__date"></span>
      <span class="notice__title"></span>
      <span class="notice__arrow" aria-hidden="true">→</span>
    </a>
  </li>
</template>
```

```js
// js/modules/notice-list.js
const PATH = '/data/notices.json';

export async function renderNoticeList() {
  const slots = document.querySelectorAll('[data-notice-list]');
  if (!slots.length) return;

  const res = await fetch(PATH);
  if (!res.ok) return console.error('[notice] load failed');
  const items = await res.json();

  const sorted = [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.date.localeCompare(a.date);
  });

  const tpl = document.getElementById('tpl-notice-item');

  slots.forEach(slot => {
    const limit = slot.dataset.limit;
    const list = limit === 'all' ? sorted : sorted.slice(0, Number(limit) || 4);

    slot.replaceChildren(...list.map(item => {
      const node = tpl.content.cloneNode(true);
      const a = node.querySelector('a');
      a.href = item.link ?? `notice.html?id=${item.id}`;
      a.querySelector('.notice__date').textContent = formatDate(item.date);
      a.querySelector('.notice__title').textContent = item.title;
      return node;
    }));
  });
}

function formatDate(iso) {
  return iso.replaceAll('-', '.');
}
```

### 7-5. 상세 페이지 처리
정적 사이트에서 게시글 N건의 상세 페이지를 각각 만들지 않는 두 가지 패턴:

**A. 쿼리스트링 단일 페이지 (No-build 유지)**
- 라우트: `pages/notice.html?id=2026-05-20-launch`
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

- [ ] `pages/<name>.html` 생성. 다른 페이지를 복제하지 말고 **헤더/푸터는 partials 슬롯** 사용.
- [ ] `<title>`, `<meta name="description">`, OG 메타 4종(`og:title`, `og:description`, `og:type`, `og:image`) 작성.
- [ ] `<main id="main">` + skip-link 포함.
- [ ] 헤더 nav에 항목 추가 → `partials/header.html` 한 곳에서 수정.
- [ ] 푸터 sitemap에 링크 추가 → `partials/footer.html` 한 곳에서 수정.
- [ ] 새 컴포넌트가 필요하면 `css/components/<block>.css` + `css/main.css`에 `@import` 추가.
- [ ] 페이지 전용 스타일이 필요하면 `css/pages/<name>.css` 작성 후 `main.css`의 `pages` 레이어에 추가.
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

- [ ] 모든 페이지 skip-link 존재 (`pages/community.html`엔 있고, 일부 페이지엔 누락 상태 → 점검).
- [ ] `<main id="main">` 존재.
- [ ] 헤더 nav에 현재 페이지 `aria-current="page"` (`include.js` 자동 처리).
- [ ] 이미지에 `alt` 또는 `aria-hidden="true"`.
- [ ] 버튼/링크 텍스트가 없으면 `aria-label`.
- [ ] 색 대비 4.5:1 이상 — 본문 텍스트 기준. `var(--color-text-muted)`는 약한 본문에만 사용, 핵심 정보 금지.
- [ ] `prefers-reduced-motion` 감지 시 모션 비활성 (reset.css 이미 처리됨).
- [ ] 키보드만으로 모든 인터랙션 가능 — 모바일 nav 토글, FAQ details, 외부 CTA 등.

---

## 11. 변경 시 영향 범위 매트릭스

| 변경 종류 | 수정 파일 | 영향 페이지 |
|---|---|---|
| 색상 토큰 | `css/tokens.css` | 전체 |
| 메뉴 항목 | `partials/header.html` | 전체 |
| 푸터 sitemap | `partials/footer.html` | 전체 |
| 공지/FAQ 1건 추가 | `data/notices.json` / `data/faqs.json` | community + index 자동 반영 |
| 새 컴포넌트 | `css/components/<X>.css` + `css/main.css` | 사용처만 |
| JS 동작 변경 | `js/modules/<X>.js` | 해당 모듈 사용 페이지 |

---

## 12. 로컬 개발

`fetch('/partials/...')`는 `file://` 프로토콜에서 동작하지 않으므로 반드시 정적 서버를 사용한다.

```bash
# 택 1: Python
python3 -m http.server 8000

# 택 2: Node
npx serve .

# 택 3: VS Code Live Server 확장
```

브라우저: `http://localhost:8000/`.

---

## 13. 마이그레이션 우선순위

현재 코드베이스에서 본 가이드를 적용해 나갈 순서:

1. ~~**partials 분리** (`header.html`, `footer.html`) + `include.js` 도입 → 6개 HTML의 중복 제거.~~ ✅ 완료
2. ~~**데이터 분리** (`notices.json`, `faqs.json`) + 렌더 모듈 도입 → `community.html`·`index.html` 동기화 문제 해결.~~ ✅ 완료
3. ~~**ES Module 전환** — `<script src>` → `type="module"`, 모듈 폴더 정리.~~ ✅ 완료
4. **CSS 컴포넌트 분리** — 현재 단일 `components.css`를 `components/*.css`로 쪼개고 `@layer` 적용.
5. **성능 보강** — preload, fetchpriority 추가.
6. **(선택) SSG 도입** — 게시판 SEO가 중요해지는 시점에 Eleventy로 정적 빌드 전환.

각 단계는 다른 단계 없이 단독 실행 가능하며, 단계 사이에 사이트는 계속 동작 가능해야 한다.

---

## 14. 배포 환경

본 사이트는 **두 환경 모두에서 동작**해야 한다. 코드는 두 환경의 차이를 자동 흡수한다.

### 14-1. 환경 매트릭스

| 항목 | 테스트 (GitHub Pages) | 프로덕션 (Cloudflare) |
|---|---|---|
| URL | `https://mayday-partners.github.io/namsan-green-summer/` | `https://namsangreensummer.com/` |
| 호스팅 | GitHub Pages (`main` branch, repo root) | Cloudflare Pages |
| 도메인 | github.io 서브경로(subpath) | 루트(apex) 도메인 |
| 도메인 등록 | — | Gabia (네임서버는 Cloudflare로 위임) |
| SSL | GitHub 자동 (Let's Encrypt) | Cloudflare 자동 |
| 사이트 base | `/namsan-green-summer/` | `/` |
| 자동 배포 트리거 | `main` push 시 GH Pages action | `main` push 시 Cloudflare Pages build |

### 14-2. subpath 호환 메커니즘

GH Pages는 사이트가 `/namsan-green-summer/` 서브경로에 위치하므로, **모든 경로가 페이지-상대 또는 base-aware**여야 한다. 다음 메커니즘이 이를 보장한다:

1. **HTML 정적 경로는 페이지-상대** — `<script src="js/main.js">` (index) / `<script src="../js/main.js">` (pages/), `<link rel="stylesheet" href="css/...">` 등. 페이지 위치에 따라 다름.
2. **JS 모듈의 fetch URL은 `import.meta.url` 기반** — `notice-list.js`, `faq-list.js`, `site-header.js`, `site-footer.js` 모두 `new URL('../../partials/header.html', import.meta.url)` 형태. 모듈이 어떤 base에서 import되든 자동으로 올바른 절대 URL로 resolve됨.
3. **`SITE_BASE` 자동 감지** — `site-header.js` / `site-footer.js`가 `new URL('../../', import.meta.url).pathname`으로 base 계산. GH Pages면 `/namsan-green-summer/`, Cloudflare면 `/`.
4. **partial 내 root-absolute 링크 자동 rewrite** — `partials/header.html`, `partials/footer.html`은 `/pages/event.html` 같은 root-absolute href를 작성하고, 커스텀 엘리먼트가 fetch한 HTML을 innerHTML로 주입하기 직전에 `rewriteAbsolutePaths()`로 base prefix를 적용한다.
5. **fallback nav href도 mount 시 정규화** — `<site-header>` 내 fallback content의 `/pages/...` 링크는 `connectedCallback` 시작 시 즉시 base prefix 적용 (fetch 결과를 기다리지 않음).

### 14-3. 환경별 동작 검증

#### GitHub Pages
1. `main` 브랜치 push
2. `https://mayday-partners.github.io/namsan-green-summer/` 접속
3. DevTools Console 에러 0, Network 탭에서 다음이 200:
   - `/namsan-green-summer/partials/header.html`
   - `/namsan-green-summer/partials/footer.html`
   - `/namsan-green-summer/data/notices.json`
   - `/namsan-green-summer/data/faqs.json`
4. nav 클릭 시 `/namsan-green-summer/pages/...`로 라우팅

#### Cloudflare (프로덕션)
1. Cloudflare Pages에 GitHub repo 연결 (Build command 비움, output dir `/`)
2. Cloudflare DNS 영역에 `namsangreensummer.com` A/AAAA 또는 CNAME 설정
3. Gabia DNS 관리에서 네임서버를 Cloudflare가 안내한 2개로 변경
4. `https://namsangreensummer.com/` 접속
5. 동일하게 fetch 4종이 200 (이번엔 `/partials/...` 형태)

### 14-4. 환경별 차이 없는 코드 작성 원칙

새 파일·기능 추가 시:
- **HTML에서 절대 경로(`/...`) 사용 금지** (페이지-상대 또는 partial 안에 두고 rewrite에 맡김)
- **JS에서 절대 경로 문자열로 fetch 금지** — 반드시 `new URL(..., import.meta.url)` 사용
- **CSS의 `url()` 참조는 CSS 파일 위치 기준 상대** (브라우저가 자동 처리, 변경 불요)
- **외부 폼/링크는 도메인 포함 절대 URL** (`https://forms.example.com/...`) — 영향 없음

### 14-5. 도메인 전환 시 체크리스트

테스트(GH Pages) → 프로덕션(Cloudflare/namsangreensummer.com) 전환 시:

- [ ] Cloudflare Pages 프로젝트 생성 + GitHub repo 연결
- [ ] Cloudflare에 `namsangreensummer.com` 추가 → 네임서버 2개 안내 받음
- [ ] Gabia에 네임서버 변경 (DNS 전파 ~수 시간)
- [ ] Cloudflare Pages 프로젝트에 `namsangreensummer.com` Custom Domain 연결
- [ ] SSL/TLS 모드 "Full (Strict)" 권장
- [ ] OG/SNS 메타 태그 점검 (현재 `og:image`는 페이지마다 `/img/sections/hero.webp`, 절대 URL 아님 — 카카오/페이스북 일부에서 인식 안 될 수 있음 → 향후 페이지별 절대 URL OG 이미지 권장)
- [ ] `robots.txt`, `sitemap.xml` 추가 (현재 없음 — 프로덕션 SEO 필요 시)
- [ ] Lighthouse 측정: LCP < 2.5s, CLS < 0.1, INP < 200ms
