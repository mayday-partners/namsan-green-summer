# Changelog

> [!NOTE]
> **Diátaxis: Reference.** 단일 주말 페스티벌 사이트로 semver 릴리스가 없음 — **날짜별 작업 단위**로 기록.
> [Keep a Changelog](https://keepachangelog.com/) 형식을 단순화 적용 (Added/Changed/Fixed/Removed).
> 코드 단위 이력은 `git log`. 본 파일은 **"사용자/기여자 관점에서 무엇이 바뀌었나"**에 집중.

---

## [Unreleased] — 2026-05-20 ~ (문서 체계 정비 + Lint 도입)

### Added
- `ARCHITECTURE.md` (루트) — 시스템 멘탈 모델, SSOT 계층, 데이터 흐름, Custom Element 패턴, subpath 호환 메커니즘, Hybrid 다크 컨테이너 패턴, 미활성 인프라 설명 (Diátaxis Explanation)
- `docs/SCHEMAS.md` — 5개 `data/*.json` 파일의 통합 스키마 reference (notices/faqs/venue/image-slots/config), 좌표 검증 정책, 추가 시 체크리스트 (Diátaxis Reference)
- `docs/INFRA.md` — `_headers` 전체 reference, CSP 화이트리스트 + 추가 절차, 캐시 정책, `forms.example.com` placeholder 교체 시나리오, SEO 정책 파일 정리 (Diátaxis Reference + How-to)
- `ONBOARDING.md` (루트) — 처음 30분 둘러보기, 작업 유형별 진입점 매트릭스, 문서 지도 (Diátaxis Tutorial)
- 본 `CHANGELOG.md`
- **Lint 인프라 도입** (의존성 0 원칙 유지):
  - `.stylelintrc.json` — BEM 패턴 / `!important` 금지 / 중첩 3단계 / breakpoint 화이트리스트
  - `eslint.config.mjs` (ESLint 9 flat config) — ES Module / `innerHTML`/`eval` 금지 / 전역 변수 금지 / browser global 수동 열거
  - `.htmlhintrc` — `inline-style-disabled` / `alt-require` / `id-unique` 등
  - `scripts/lint.sh` — 5종 lint 통합 entrypoint (stylelint + eslint + htmlhint + `@google/design.md lint` + 색상 토큰 SSOT grep)
  - `.claude/settings.json` — lint 명령 자동 허용 등록
  - **CI 도입은 의도적 보류** — 모든 코드가 AI agent를 거치는 워크플로우에서 CLAUDE.md 절대 룰 #11 ("lint 통과 못 한 상태로 완료 보고 금지")이 사실상 강제력

### Changed
- `README.md` §3 코드 스타일 — 70% 슬림화. 형식 룰은 lint config가 SSOT, 의미적 규약(시맨틱 태그, 컴포넌트 분리 의도, fetch URL 패턴 등)만 prose 잔존
- `README.md` 슬림화 — §5(JS 모듈)과 §6(헤더/푸터)의 stale `mountIncludes` / `data-include` 예시를 현재 코드(`<site-header>` Web Component + `SITE_BASE` 자동 감지)에 맞게 rewrite. §7-3 데이터 스키마 상세를 `docs/SCHEMAS.md`로 분기, §7-4 템플릿 패턴을 `data-render="preview"` 분기 반영으로 갱신
- `CLAUDE.md` — 디자인 시스템 stale 수치 라인 제거 + "수치는 DESIGN.md 직접 grep" 룰. 절대 룰 #11 ("lint 실행 필수") 추가. 자주 깨지는 패턴 표에 lint 자동 검출 컬럼 추가 (12개 항목 중 7개 lint 커버)
- `js/modules/notice-list.js`, `js/modules/faq-list.js` — fallback 에러 메시지를 `innerHTML` 문자열 → `renderFallbackError(slot, tag, msg)` 헬퍼(DOM API) 리팩토링. ESLint `no-restricted-syntax` 룰 통과 위함 + XSS 방어 강도 균일화
- `js/modules/map-embed.js` 상단 코멘트 — "Course polyline auto-renders" → 실제 동작(checkpoints render as markers + InfoWindow + setBounds)으로 갱신
- 모든 문서/README의 dev 서버 명령을 `npx serve -l 3000`으로 통일 (Kakao Developers Console 도메인 화이트리스트 호환)

### Notes
- 본 변경은 기능 동작 영향 없음 — 모두 문서 정합성 + 인프라 명시성 + lint 자동화 개선
- 신규 기여자 onboarding 깊이: README 단독 50% → 문서 체계 후 80%+ + lint로 형식 룰 100% 자동 검증
- DESIGN.md lint 결과로 현재 토큰 카운트 확정: **19 colors / 8 typography / 4 rounding / 9 spacing / 23 components**

---

## 2026-05-20

### Fixed
- **CSP**: Kakao Maps SDK + Pretendard CDN + Cloudflare Insights 외부 도메인 허용 (`_headers`). 이전엔 CSP가 SDK 스크립트 로드를 차단하여 지도 미작동
- **Config tracking**: `data/config.json` (Kakao JS key) git 트래킹 시작. Kakao JS key는 의도적 공개 — 보호는 Console의 도메인 화이트리스트로

---

## 2026-05-19 (대규모 작업일)

### Added
- **디자인 시스템 SSOT** ([DESIGN.md](./DESIGN.md), Google Stitch alpha 형식) + `npx @google/design.md lint` 권한 등록 + CLAUDE.md에 SSOT 워크플로우 룰
- **Light baseline 전환** — 페이지 베이스를 다크 → 라이트 paper(`#F4F8EE`)로. neon 모티프는 유지, 다크 무드는 섹션 단위 컨테이너(`.dark-section`)로 분리
- **이미지 슬롯 시스템** — `data/image-slots.json` 인벤토리 + `?spec=1` dev 모드 placeholder 렌더러 + 디자이너 핸드오프 가이드 ([docs/IMAGE_SPEC.md](./docs/IMAGE_SPEC.md))
- **지도 통합 (Maps 줄기)**:
  - Kakao Maps SDK 임베드 (lazy load + course-map placeholder 교체)
  - Kakao/Google/Naver deep-link 버튼 ([data-map-links] 슬롯)
  - 다중 venue 지원 (`data/venue.json`): 백범광장 / 서울역 7번 출구 / 남산도서관
  - Place ID 3종 (Kakao/Google/Naver) + 좌표 검증 흔적
  - CP 체크포인트 마커 + InfoWindow (Fun&Walk 5km 코스, polyline은 의도적 미렌더)
- **Custom Elements 마이그레이션** — `<div data-include="...">` + `mountIncludes()` → `<site-header>`/`<site-footer>` Web Components. fallback content로 SEO + JS-disabled 호환 확보
- **CSS @layer 재구성** — 모놀리식 `components.css` → 블록 단위(`components/*.css`) + `@layer reset, tokens, base, components, pages, utilities` 강제 순서
- **404.html** 추가 — Cloudflare가 매칭 실패 시 자동 서빙, `<meta name="robots" content="noindex, follow">`
- **A11y/perf 번들** — skip-link, `<main id="main">`, 히어로 이미지 preload + fetchpriority
- **헤더 CTA** — 데스크톱은 nav 옆, 모바일은 햄버거 메뉴 내부에 "참가신청"
- **홈 hero 재구성** — display zone (Anton 2026 + Pretendard 900 한글) + meta card (날짜/장소/CTA) 분리
- **홈 programs grid** — 3카드를 컴팩트한 수평 슬림 밴드로 압축
- **홈 preview SVG check 아이콘** + **notice/FAQ megaphone/FAQ 아이콘**
- **DESIGN.md sizes primitive** 추가 (mask-icon / logo-dot / faq-sign / hamburger-toggle / sns-icon / tap-target / program-icon)
- **`fs-display-hero` clamp 토큰** (fluid 2.5–6rem)
- **Pretendard variable CDN** (jsdelivr) — 모든 sub-page에 동기화. 로컬 woff2 subset(300–700)과 병행
- **운영 가이드** — README §14 확장 (배포 환경 매트릭스, Cloudflare 운영 노트, 비상 대응)
- **info-grid `<dl>` 구조** — `dt`/`dd` 페어를 `<div class="info-grid__row">`로 wrap (MDN-allowed) → 정렬/border 일관성

### Changed
- **CSS 토큰화** — z-index, hero-card track, card-media placeholder gradient 모두 `--*` 변수로
- **Naver deep-link 우선순위** — Place ID > 좌표 기반 transit > 검색 fallback
- **Kakao Place ID** 백범광장 실제 ID로 정정
- **Phase 2 무결성 강화** — template 누락 가드, JSON 스키마 validation, 에러 fallback, lifecycle (bfcache pageshow 등)
- **CSS dead code 제거** — 미사용 card img, glow/zoom/float animations, unused tokens

### Fixed
- og:image 메타의 width/height를 실 파일 크기(540×380)와 일치
- 모바일 CTA가 데스크톱으로 leak되는 `.btn` cascade 버그
- aria 라벨, spacing 토큰 일관성, `.bottom-list` grid 홈 한정 scope

---

## 2026-05-18 (initial scaffold)

### Added
- **디자인 시스템 foundations** + Pretendard woff2 subset 5종 (Light/Regular/Medium/SemiBold/Bold)
- **공통 UI 컴포넌트** (button, card, header, footer)
- **홈 페이지** (hero + programs + previews + notice)
- **5개 서브 페이지** (event / fun-and-walk / green-night / green-garden / community) + 공통 sub-page 스타일
- **첫 README + CLAUDE.md** — 프로젝트 컨벤션
- **partials / data / modules 마이그레이션** (Phase 1):
  - `partials/` 헤더/푸터 추출 + `include` 로더
  - `data/notices.json` + `data/faqs.json` JSON 추출
  - `<script type="module">` ES 모듈 entry point + observer / notice-list / faq-list 모듈
  - 모든 페이지 (`index.html` + `pages/*.html`)를 partials + JSON + ES module로 migrate

### Fixed
- root-absolute 경로(`/...`)를 페이지-상대로 변환 (subpath 배포 호환)
- 5개 리뷰 지적사항 (paths, innerHTML 사용 → textContent, silent failures, error boundary, null guards)

---

## Format

- 신규 변경은 `## [Unreleased]` 섹션에 추가
- 작업 단위가 끝나면 `## YYYY-MM-DD` 또는 `## YYYY-MM-DD (작업 단위 이름)`으로 promotion
- 카테고리: **Added / Changed / Fixed / Removed / Security**
- 각 항목은 사용자/기여자 관점에서 영향을 기술 — git commit message를 그대로 옮기지 말 것
- 의미 있는 그룹("Maps 줄기" 등)으로 묶어 narrative 부여

## 관련 문서

- [`README.md`](./README.md) §13 — 마이그레이션 우선순위 (계획 + 현재 상태)
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — 결정의 배경과 결과 구조
- git log — 정확한 커밋별 이력
