# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project loosely adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) — adapted for a static event-site context:

- **MAJOR** — 사이트 IA / URL 슬러그 / 디자인 시스템 전면 재구축 (사용자 가시 breaking change)
- **MINOR** — 새 페이지·섹션 추가, 디자인 토큰 확장, 신규 기능
- **PATCH** — 콘텐츠·문구 수정, 버그 픽스, 작은 디자인 조정

코드 단위 이력은 `git log`. 본 파일은 **사용자/기여자 관점에서 무엇이 바뀌었나**에 집중한다.

## [Unreleased]

_None._

## [1.0.0] - 2026-05-21 — redesign/v2 (시안 단순화 전면 재구축)

디자이너 제공 시안(`docs/namsan-summer-festival-source-20260521-103004/`)을 SSOT로 받아 시각·콘텐츠·아키텍처를 전면 재설계. branch `redesign/v2`에서 작업. **Breaking change**: URL 슬러그·디자인 토큰·디렉토리 구조·콘텐츠 모드 모두 변경.

### Added
- 새 디렉토리 슬러그: `info/` · `funwalk/` · `night/` · `garden/` (시안 영문명 1:1, `community/`만 유지)
- 13개 area HTML 페이지 (index + 12 sub-page)
- 시안 자산 4종: `img/festival/{main-visual-wide, sub-visual, night-lineup, night-experience}.png`
- 15개 component CSS 신규: site-header · button · footer · sub-visual · overview · info-panel · program-detail · reserve-button · notice · map · lineup · seat-guide · experience-grid · community · sponsor · wire-section · radial-pattern
- DESIGN.md 신규 색상 토큰 3종: `garden-route` / `lineup-card-bg` / `experience-deep`
- DESIGN.md `divider` 컴포넌트 (`line` 토큰 orphan 회피 + 향후 hairline 분리자 슬롯)

### Changed
- **URL 슬러그 전면 변경**: `event/` · `fun-and-walk/` · `summer-night/` · `summer-garden/` → `info/` · `funwalk/` · `night/` · `garden/`
- **디자인 시스템 단순화**: light-baseline + dark-section 이중 시스템 → **white paper + 단일 neon 모티프**
- **Typography 단일화**: Anton + Pretendard + Montserrat 3폰트 → **Pretendard 단일** (weight 600~950 사용)
- **반응형 breakpoint**: 768/900 → **620/980** (stylelint 화이트리스트 동시 갱신)
- **콘텐츠 모드**: 동적 렌더(JSON + 모듈) → **정적 HTML 1차 작성**
- DESIGN.md: 670줄 → 524줄 압축 재작성. 토큰 카운트 = **18 colors / 10 typography / 7 rounded / 10 spacing / 13 sizes / 55 components**
- CLAUDE.md mirror pair 목록: 4 → 2개 (IMAGE_SPEC ↔ image-slots / programs.refund_policy ↔ funwalk/notice는 해체)
- partials/header.html: 시안 마크업 (NS skewed brand-mark + hover-only submenu + 새 슬러그)
- partials/footer.html: 시안 단순 footer (brand + 한 줄 정보, 5-column sitemap 폐기)
- js/main.js: 단순화 — custom element 2개 import + hash resolver만 (~20줄)
- js/components/site-header.js: nav 토글 로직 폐기 (시안은 CSS hover-only)
- sitemap.xml: 6 URL → **13 URL** (새 슬러그)
- README.md: redesign/v2 현재 상태 반영, 22개 CSS 파일 · 15곳 fallback nav 동기화 위치 명시

### Fixed
- **a11y contrast 위반 2건** — 시안 디자이너 원본의 WCAG fail 색상을 토큰 단계에서 교정:
  - `lineup-base` `#078c4f` (4.31:1) → `#066d3a` (6.5:1 AA)
  - `map-finish` `#f20505` (4.38:1) → `#c00404` (6.4:1 AA)
  - `reserve-button-global` · `map-pin-garden`: paper text → black text (시안의 `#fff` on `#05b957` 2.4:1 / `#fff` on `#1ecb3b` 1.7:1 fail → 새 페어 AA pass)

### Removed
- 옛 디렉토리 4개 (총 9 HTML): `event/` · `fun-and-walk/` · `summer-night/` · `summer-garden/`
- 데이터 시스템 8개 파일: `data/{notices, faqs, programs, sponsors, venue, image-slots, config, config.example}.json`
- JS 동적 렌더 모듈 16개: course-map / dday-counter / event-overview / faq-list / image-slot / info-panel-list / map-embed / map-links / notice-guide-list / notice-list / observer / program-detail / program-summary / reservation-actions / seat-guide / sponsor-list
- 옛 component CSS 10개: header / brand-mark / card / cta-group / dark-section / image-slot / info-box / kit-grid / notice-table / page-tabs
- `css/animations.css` (fade-in IntersectionObserver 시스템 미사용)
- `docs/IMAGE_SPEC.md` + `data/image-slots.json` (mirror pair 해체)
- `main-sample.png`, `docs/zone-plans/`, `docs/namsan-summer-festival-source-20260521-103004/` (작업용 임시 자산)

### Notes
- net 변경: **69 files / +1,429 / −7,743** (시안 단순화 효과 ≈ 6배 코드 감소)
- 전체 lint 통과: stylelint 0 / eslint 0 / htmlhint 0 / DESIGN.md 0/0 warnings / tokens SSOT ✓
- 상용 미오픈 상태라 `_redirects` 미설치 — 옛 URL은 외부 인덱싱 없음으로 가정. 운영 오픈 후 외부 링크 발견 시 retroactive redirect 추가 필요

## [0.4.0] - 2026-05-21 — PPT 정합성 + V1 → V2 통일 + 한국어 통일

3라운드 검증 루프(critic + verifier + analyst → R2 → R3)로 PPT 원본(`docs/(남산) 홈페이지 기획안_V2.pptx`) vs 구현 정합성을 **R1 65/100 → R3 93/100**까지 끌어올림. R3 verifier APPROVE.

### Added
- `data/programs.json` — V2 PPT 기반 프로그램 메타데이터 SSOT (행사 · 3 프로그램 · 환불 정책 5단계). funwalk에 `checkin_open` / `checkin_close` / `depart_time` / `kit_note` / `details` 신규 키
- `data/sponsors.json` — 0519 기준 미확정 placeholder
- `fun-and-walk/notice.html` "우천 시 운영" 섹션 (PPT slide 7 누락 보강, Summer Night/Garden 정책과 동일 적용)
- `data/notices.json` 9건 시드에 `_source` 메타 (PPT slide 2 명시 2건 vs dev seed 7건 명시적 구분)
- `docs/SITE_PLAN_V2.md` § 8-1 V1 → V2 명칭 매핑표, § 8-2 8개 Open Questions
- `data/venue.json` `courses._waypoint_note` (PPT slide 6 6단계 vs 5 CP 등록 정합 설명)
- CLAUDE.md HTML 영문 사용 최소화 룰 (프로그램 공식명/SNS 플랫폼명/URL만 허용)

### Changed
- **브랜드명 V1 → V2 통일** — 헤더 로고 "NAMSAN GREEN SUMMER" → "남산 서머 페스티벌", 푸터 © 갱신, 메인 hero 영문 sub 제거
- **헤더 CTA 동작** — `https://forms.example.com/apply` placeholder → `/event/programs.html`
- **푸터 Host/이메일** — `data-pending` placeholder + TODO. 전화번호 `02-0000-0000` → `02-6412-9714` (PPT 명시값)
- **subpath 배포 폐기** — Cloudflare Pages 루트 도메인 단일 환경 확정. GitHub Pages 테스트 환경 매트릭스 제거
- **JS fetch URL 단순화** — 9곳의 `new URL(..., import.meta.url).href` → root-absolute 문자열
- **partial cache** — `force-cache` → `default` (dev에서 stale partial 잡힘 방지)
- **사용자 노출 영문 → 한국어 통일** — breadcrumb, `<dt>` 라벨 18종, eyebrow 20여 종, hero 디스플레이 카피 3종, 푸터 섹션명

### Fixed
- index.html HTML 주석/watermark V1 잔재 (`Green Night/Garden` → `Summer Night/Garden`)
- fun-and-walk/course.html 코스맵 영문 라벨 → 한국어
- 메인 → community 링크 broken anchor (`querySelector` → `getElementById`로 변경, 숫자로 시작하는 id 정상 resolve)

## [0.3.0] - 2026-05-20 — 문서 체계 + Lint 인프라

### Added
- `ARCHITECTURE.md` — 시스템 멘탈 모델, SSOT 계층, 데이터 흐름, Custom Element 패턴 (Diátaxis Explanation)
- `docs/SCHEMAS.md` — 5개 `data/*.json` 통합 스키마 reference (Reference)
- `docs/INFRA.md` — `_headers` reference, CSP 화이트리스트, 캐시 정책 (Reference + How-to)
- `ONBOARDING.md` — 처음 30분 둘러보기 + 작업 유형별 진입점 (Tutorial)
- 본 `CHANGELOG.md`
- **Lint 인프라 5종 통합** (의존성 0 원칙 유지):
  - `.stylelintrc.json` — BEM 패턴 / `!important` 금지 / 중첩 3단계 / breakpoint 화이트리스트
  - `eslint.config.mjs` (ESLint 9 flat) — `innerHTML`/`eval` 금지, browser global 수동 열거
  - `.htmlhintrc` — `inline-style-disabled` / `alt-require` / `id-unique`
  - `scripts/lint.sh` — stylelint + eslint + htmlhint + `@google/design.md lint` + tokens SSOT grep 통합
  - `.claude/settings.json` — lint 명령 자동 허용
- `_headers` — 보안 헤더 + CSP (Kakao SDK / Pretendard CDN / Cloudflare Insights 화이트리스트) + 캐시 정책

### Changed
- README.md §3 코드 스타일 70% 슬림화 — 형식 룰은 lint config가 SSOT, prose는 의미적 규약만
- CLAUDE.md 절대 룰 #11 추가 ("lint 실행 필수, 통과 못 한 상태로 완료 보고 금지")
- 모듈 fallback 에러 메시지 — `innerHTML` 문자열 → `renderFallbackError(slot, tag, msg)` DOM API 헬퍼

### Fixed
- CSP: Kakao Maps SDK + Pretendard CDN + Cloudflare Insights 외부 도메인 허용 (이전엔 SDK 스크립트 차단으로 지도 미작동)
- `data/config.json` (Kakao JS key) git 트래킹 시작 — JS key는 의도적 공개, 보호는 Console 도메인 화이트리스트

## [0.2.0] - 2026-05-19 — Light baseline + Maps + Custom Elements

### Added
- **디자인 시스템 SSOT** ([DESIGN.md](./DESIGN.md), Google Stitch alpha) + `npx @google/design.md lint` 권한 등록
- **Light baseline 전환** — 페이지 베이스 다크 → 라이트 paper(`#F4F8EE`). neon 모티프 유지, 다크 무드는 섹션 단위 컨테이너(`.dark-section`)로 분리
- **이미지 슬롯 시스템** — `data/image-slots.json` 인벤토리 + `?spec=1` dev 모드 placeholder + 디자이너 핸드오프 가이드(`docs/IMAGE_SPEC.md`)
- **지도 통합**:
  - Kakao Maps SDK 임베드 (lazy load + course-map placeholder 교체)
  - Kakao/Google/Naver deep-link 버튼 (`[data-map-links]`)
  - 다중 venue (`data/venue.json`) — 백범광장 / 서울역 7번 출구 / 남산도서관
  - Place ID 3종 + 좌표 검증 흔적
  - CP 체크포인트 마커 + InfoWindow (Fun&Walk 5km 코스)
- **Custom Elements 마이그레이션** — `<div data-include>` + `mountIncludes()` → `<site-header>` / `<site-footer>` Web Components
- **CSS @layer 재구성** — 모놀리식 `components.css` → 블록 단위 + `@layer reset, tokens, base, components, pages, utilities` 강제 순서
- `404.html` (CF 자동 서빙, `noindex`)
- A11y/perf 번들 — skip-link, `<main id="main">`, hero `preload` + `fetchpriority`
- 홈 hero 재구성 — display zone (Anton "2026" + Pretendard 900 한글) + meta card (날짜/장소/CTA)
- 홈 programs grid — 3카드를 컴팩트 수평 슬림 밴드
- 홈 preview SVG check 아이콘 + notice/FAQ megaphone 아이콘
- DESIGN.md `sizes` primitive 추가 (mask-icon / logo-dot / faq-sign / hamburger-toggle / sns-icon / tap-target / program-icon)
- `--fs-display-hero` fluid clamp 토큰 (2.5–6rem)
- Pretendard variable CDN (jsdelivr) + 로컬 woff2 subset 병행
- README §14 운영 가이드 확장 (배포 환경 매트릭스, CF 운영 노트, 비상 대응)
- info-grid `<dl>` 구조 (`<div class="info-grid__row">` wrap, MDN-allowed)

### Changed
- CSS 토큰화 — z-index / hero-card track / card-media placeholder 모두 `--*` 변수로
- Naver deep-link 우선순위 — Place ID > 좌표 기반 transit > 검색 fallback
- Kakao Place ID 백범광장 실제 ID 정정
- Phase 2 무결성 강화 — template 누락 가드 / JSON 스키마 validation / 에러 fallback / bfcache pageshow lifecycle

### Removed
- CSS dead code — 미사용 card img / glow·zoom·float animations / unused tokens

### Fixed
- og:image 메타의 `width`/`height`를 실제 파일 크기(540×380) 일치
- 모바일 CTA가 데스크톱으로 leak되는 `.btn` cascade 버그
- aria 라벨 / spacing 토큰 일관성 / `.bottom-list` grid 홈 한정 scope

## [0.1.0] - 2026-05-18 — Initial scaffold

### Added
- 디자인 시스템 foundations + Pretendard woff2 subset 5종 (Light/Regular/Medium/SemiBold/Bold)
- 공통 UI 컴포넌트 (button / card / header / footer)
- 홈 페이지 (hero + programs + previews + notice)
- 5개 서브 페이지 (event / fun-and-walk / summer-night / summer-garden / community) + 공통 sub-page 스타일
- 첫 README + CLAUDE.md
- partials / data / modules 마이그레이션 (Phase 1):
  - `partials/` 헤더/푸터 추출 + include 로더
  - `data/notices.json` + `data/faqs.json`
  - `<script type="module">` ES 모듈 entry + observer / notice-list / faq-list

### Fixed
- root-absolute 경로(`/...`) → 페이지-상대 변환 (subpath 배포 호환)
- 5개 리뷰 지적사항: paths / `innerHTML` → `textContent` / silent failures / error boundary / null guards

---

## 관련 문서

- [`README.md`](./README.md) §13 — 마이그레이션 우선순위 (계획 + 현재 상태)
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — 결정의 배경과 결과 구조
- `git log` — 정확한 커밋별 이력
