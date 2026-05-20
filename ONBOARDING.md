# Onboarding — 처음 30분 가이드

> [!NOTE]
> **Diátaxis: Tutorial.** 본 프로젝트를 처음 만지는 모든 사람(개발자/디자이너/콘텐츠 운영자)이 30분 안에 첫 변경을 만들 수 있도록 안내합니다.
> 깊은 설명은 [ARCHITECTURE][arch], 절차는 [README][rm], 데이터·인프라 스펙은 [docs/][docs]를 참조.

[arch]: ./ARCHITECTURE.md
[rm]: ./README.md
[docs]: ./docs/
[design]: ./DESIGN.md
[claude]: ./CLAUDE.md
[changelog]: ./CHANGELOG.md
[schemas]: ./docs/SCHEMAS.md
[infra]: ./docs/INFRA.md
[image]: ./docs/IMAGE_SPEC.md

---

## 0. 이 프로젝트가 무엇인가

- **2026 남산 그린 서머 페스티벌** 공식 정적 사이트 (2026-06-27 토, 남산공원)
- **6개 페이지** + 다국어 없음(한국어 전용) + **빌드 도구 없음**
- 기술: **Vanilla HTML + CSS + ES Module JavaScript** (npm 의존성 0)
- 호스팅: GitHub Pages (테스트) + Cloudflare Pages (프로덕션 `namsangreensummer.com`)

---

## 1. 30분 첫 둘러보기 (단계별)

### 1-1. 클론 + 정적 서버 (5분)

```bash
git clone <repo-url>
cd namsan-green-summer
npx serve -l 3000
# → http://localhost:3000/
```

> [!IMPORTANT]
> **포트 3000 고정** — Kakao Developers Console JavaScript SDK 도메인 화이트리스트가 `localhost:3000`만 허용. 다른 포트로 띄우면 지도 SDK가 거부된다.

### 1-2. 페이지 6개 클릭 (5분)

브라우저에서 다음 순서로 모두 열어보세요:
- `/` (홈)
- `/pages/event.html` (행사안내 — 허브 페이지)
- `/pages/fun-and-walk.html` (Program 01)
- `/pages/green-night.html` (Program 02)
- `/pages/green-garden.html` (Program 03)
- `/pages/community.html` (공지 + FAQ + 환불)

**관찰 포인트**:
- 모바일 viewport (DevTools 375px)에서 햄버거 메뉴 → 메뉴 항목 클릭 → 닫힘 자동
- 페이지 하단까지 스크롤 → 섹션이 fade-in (IntersectionObserver)
- 행사안내 페이지의 지도 영역 → 카카오 지도가 로드되고 마커가 표시되면 OK

### 1-3. DevTools Network 탭으로 데이터 흐름 관찰 (5분)

DevTools → Network → 페이지 reload. 다음 fetch를 확인:
- `partials/header.html`, `partials/footer.html` — Web Component 셀프 하이드레이트
- `data/notices.json`, `data/faqs.json` — 게시판 데이터
- `data/venue.json`, `data/config.json` — 지도 모듈
- Kakao SDK (`dapi.kakao.com/v2/maps/sdk.js`)

각 fetch가 어느 모듈에서 트리거됐는지는 [`ARCHITECTURE.md`](./ARCHITECTURE.md) §3 참조.

### 1-4. 디자이너 모드 (`?spec=1`) (5분)

```
http://localhost:3000/?spec=1
```

각 이미지 슬롯에 라벨이 떠야 함 (예: hero-main / 1280×720 / ratio 16:9). 디자이너 핸드오프 SSOT는 [`docs/IMAGE_SPEC.md`](./docs/IMAGE_SPEC.md).

### 1-5. 디자인 시스템 카탈로그 (5분)

```
http://localhost:3000/docs/design-system/
```

토큰 (colors / typography / spacing / sizes / rounded) 시각 catalog. DESIGN.md ↔ tokens.css의 매핑 결과를 한눈에. 자세한 워크플로우는 [`DESIGN.md`](./DESIGN.md) "변경 워크플로우".

### 1-6. 첫 변경 만들어보기 (5분)

가장 안전한 변경 = **공지 1건 추가**:

1. `data/notices.json` 파일 열기
2. 배열 맨 위에 다음 추가:
   ```json
   {
     "id": "2026-05-20-onboarding-test",
     "date": "2026-05-20",
     "title": "온보딩 테스트 공지",
     "category": "공지",
     "pinned": false,
     "link": null
   }
   ```
3. 저장 → 브라우저 reload
4. 홈 페이지 "공지사항" 섹션과 `/pages/community.html` 둘 다에 자동 반영되는지 확인
5. 확인 후 추가한 항목 삭제

### 1-7. Lint (커밋 전 필수)

본 프로젝트는 lint를 갖추고 있고 **CI는 없음** — 개발자/AI 양심에 맡김. 코드 만진 후 반드시 실행:

```bash
./scripts/lint.sh           # 전체 (CSS + JS + HTML + DESIGN.md + 색상 토큰 grep)
./scripts/lint.sh css       # 만진 부분만 빠르게 (css|js|html|design|tokens)
```

각 도구는 npx로 일회성 실행 (의존성 0). 첫 실행만 ~1-2분 다운로드, 이후 캐시.

Lint가 무엇을 잡는지: [README][rm] §3 "형식 규약" 표. Lint가 못 잡는 의미적 규약(시맨틱 태그, 컴포넌트 분리 의도 등)은 같은 §의 "Lint가 못 잡는 의미적 규약" 항목.

> [!CAUTION]
> Lint 통과 못 한 상태로 사용자에게 "완료"라고 보고하지 말 것 — [CLAUDE][claude] 절대 룰 #11. AI 에이전트가 직접 self-gating 하는 강제력이다.

작동했으면 30분 끝. 다음은 §2 작업 유형별 진입점 매트릭스에서 자신의 작업 찾아 진행.

---

## 2. 작업 유형별 진입점 매트릭스

"이걸 하고 싶다" → "여길 보세요" 매핑. 막힐 때 첫 단계.

| 하려는 일 | 1차 문서 | 2차 문서 (깊이) |
|---|---|---|
| 공지/FAQ 1건 추가/수정 | [`README.md`](./README.md) §7-3 | [`docs/SCHEMAS.md`](./docs/SCHEMAS.md) §1, §2 |
| 새 페이지 추가 | [`README.md`](./README.md) §8 | [`README.md`](./README.md) §6 (Web Component fallback), `ARCHITECTURE.md` §4 |
| 새 색상/spacing 토큰 추가 | [`DESIGN.md`](./DESIGN.md) "변경 워크플로우" | `CLAUDE.md` 절대 룰 #6 |
| 새 컴포넌트 추가 | [`DESIGN.md`](./DESIGN.md) `components:` + [`README.md`](./README.md) §4 | 기존 `css/components/<X>.css` 참고 |
| 메뉴 항목 변경/추가 | [`README.md`](./README.md) §6 (동기화 8곳 표) | — |
| 새 지도 장소(venue) 추가 | [`docs/SCHEMAS.md`](./docs/SCHEMAS.md) §3 | `js/modules/map-{links,embed}.js` 코드 |
| 새 이미지 슬롯 추가 | [`docs/IMAGE_SPEC.md`](./docs/IMAGE_SPEC.md) + [`docs/SCHEMAS.md`](./docs/SCHEMAS.md) §4 | — |
| 외부 CDN/script 도입 | [`docs/INFRA.md`](./docs/INFRA.md) §4 (CSP 절차) | `_headers` 파일 |
| 외부 폼 시스템 교체 (forms.example.com) | [`docs/INFRA.md`](./docs/INFRA.md) §5 | — |
| Kakao JS key 로테이션 | [`docs/SCHEMAS.md`](./docs/SCHEMAS.md) §5 | Kakao Developers Console |
| 시스템 동작 원리가 궁금 | [`ARCHITECTURE.md`](./ARCHITECTURE.md) | 모듈 코드 직접 읽기 |
| Web Component lifecycle 버그 디버깅 | [`ARCHITECTURE.md`](./ARCHITECTURE.md) §4 | `js/components/site-header.js` |
| Subpath(GH Pages) 환경에서 깨짐 | [`ARCHITECTURE.md`](./ARCHITECTURE.md) §5 + [`README.md`](./README.md) §14-2 | — |
| 배포 / 롤백 / 캐시 퍼지 | [`README.md`](./README.md) §14-8 | [`docs/INFRA.md`](./docs/INFRA.md) §3-3 |
| CSP 위반으로 SDK 차단 | [`docs/INFRA.md`](./docs/INFRA.md) §7 | DevTools Console |
| 디자이너 자산 확인/요청 | [`docs/IMAGE_SPEC.md`](./docs/IMAGE_SPEC.md) | `?spec=1` 모드 |
| AI 에이전트 룰 확인 | [`CLAUDE.md`](./CLAUDE.md) | — |
| 무엇이 언제 바뀌었는지 | [`CHANGELOG.md`](./CHANGELOG.md) | `git log` |

---

## 3. 문서 지도

| 문서 | Diátaxis 모드 | 주 대상 | 무엇을 다루나 |
|---|---|---|---|
| [`README.md`](./README.md) | Tutorial + How-to + Reference (혼합) | 모든 기여자 | 빠른 시작, 디렉토리, 코드 스타일, 페이지 추가 절차, 배포 환경 |
| [`ONBOARDING.md`](./ONBOARDING.md) (본 문서) | Tutorial | 처음 보는 누구나 | 30분 첫 둘러보기 + 작업 유형 매트릭스 |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Explanation | 시스템 이해가 필요한 개발자 | 왜 No-build + Web Components인가, SSOT 계층, subpath 메커니즘, Hybrid 다크 컨테이너 |
| [`DESIGN.md`](./DESIGN.md) | Reference + Explanation | 디자이너 + 프론트엔드 | 디자인 시스템 SSOT (Google Stitch alpha 형식) — colors/typography/spacing/rounded/sizes/components |
| [`docs/SCHEMAS.md`](./docs/SCHEMAS.md) | Reference | 데이터 추가하는 누구나 | 5개 `data/*.json` 파일 필드 스펙 |
| [`docs/INFRA.md`](./docs/INFRA.md) | Reference + How-to | 운영자, 외부 의존성 추가하는 개발자 | `_headers` (CSP + 캐시), 외부 도메인 추가 절차 |
| [`docs/IMAGE_SPEC.md`](./docs/IMAGE_SPEC.md) | How-to + Reference | 디자이너 + 핸드오프 받는 개발자 | 이미지 슬롯 13종 인벤토리 + export 규약 + `?spec=1` 모드 사용법 |
| [`CHANGELOG.md`](./CHANGELOG.md) | Reference | 변경 이력 추적 | 날짜별 변경 내역 (keepachangelog 단순화) |
| [`CLAUDE.md`](./CLAUDE.md) | Reference | AI 에이전트 (Claude Code) | 절대 룰 + 자주 깨지는 패턴 |

### Diátaxis 4-mode 빠른 이해

- **Tutorial** (학습) — 처음 보는 사람이 무언가를 해내도록 단계별로 손잡고 안내 — 본 문서 + IMAGE_SPEC §1 빠른 시작
- **How-to** (목적 달성) — 이미 알고 있는 사람이 특정 작업을 끝내도록 안내 — README §8 신규 페이지, INFRA §4 외부 도메인 추가
- **Reference** (조회) — 작업 중 정확한 사실을 빠르게 찾는 사전 — SCHEMAS, INFRA §2 CSP 지시문, DESIGN.md 토큰 표
- **Explanation** (이해) — 왜 이렇게 설계됐는지 background — ARCHITECTURE.md 전체

각 문서는 가능한 한 1개 모드에 집중하지만, README는 단일 진입점 책임상 4모드 혼합. 처음 보는 사람은 본 ONBOARDING.md → ARCHITECTURE.md → 작업별 진입점 순서를 권장.

---

## 4. 도움 요청 / 막힐 때

### 4-1. 디버깅 순서
1. **DevTools Console** 먼저 — 모든 모듈이 `[<module>]` prefix로 로그 + 에러
2. **Network 탭** — fetch 4xx/5xx면 SSOT 파일명 확인
3. **DevTools Response Headers** — CSP 위반이면 `Refused to load https://X` 메시지 → [`docs/INFRA.md`](./docs/INFRA.md) §4
4. **`grep -rn "<keyword>" .`** — 어디서 정의됐는지 모를 때
5. **`git log --oneline -20`** + [`CHANGELOG.md`](./CHANGELOG.md) — 최근 변경 추적

### 4-2. 자주 막히는 지점

| 증상 | 원인 | 해결 |
|---|---|---|
| `partials/header.html` 404 | `file://` 프로토콜 사용 중 (파일 직접 열기) | `npx serve -l 3000` 사용 |
| 헤더가 비어있음 (fetch 후) | CSP가 partial 차단 또는 partial 자체 손상 | DevTools Network로 status 확인 |
| 지도가 안 뜸 | Kakao SDK CSP 차단 / config.json 누락 / 좌표 누락 | `_headers` CSP, `data/config.json`, `data/venue.json` 순서로 확인 |
| 모바일 메뉴 열린 채 뒤로가기 후 깨짐 | bfcache 복원 미처리 | 이미 `pageshow` 핸들러 있음 — 재현되면 [`ARCHITECTURE.md`](./ARCHITECTURE.md) §4-4 |
| GH Pages에서 nav 클릭 시 404 | root-absolute `/...` 사용 (subpath 미고려) | 페이지-상대 경로로 변경 — [`ARCHITECTURE.md`](./ARCHITECTURE.md) §5-4 |
| 새 색상이 적용 안 됨 | `tokens.css` 거치지 않고 hex 직접 사용 | DESIGN.md 등록 → tokens.css 매핑 후 컴포넌트 사용 |
| 새 공지 추가했는데 안 보임 | JSON syntax 에러 (trailing comma 등) | DevTools Console에서 `[notice-list]` 에러 확인 |
| `?spec=1` 모드에서 슬롯 라벨이 안 뜸 | 슬롯이 `data/image-slots.json`에 정의 안 됨 | image-slots.json `slots[]`에 추가 |

### 4-3. 비-기술적 막힘

| 질문 | 답 |
|---|---|
| 누구한테 PR 리뷰 요청? | 팀 리포지토리 owner |
| 비즈니스 결정이 필요한 변경 (예: 색상 변경) | 디자이너 + PM 협의 후 DESIGN.md PR |
| 도메인 / DNS / Cloudflare 콘솔 접근 | 운영 담당자 (인수인계 문서 별도) |
| Kakao Developers Console 접근 | 운영 담당자 |

---

## 5. 다음 단계

30분 둘러보기 완료 후 추천 진행:

1. **`ARCHITECTURE.md` 정독** (45분) — 시스템 의도가 손에 잡힘. 이후 코드 작업이 훨씬 쉬워짐.
2. **`CLAUDE.md` 절대 룰 9개 + 자주 깨지는 패턴 표** (10분) — 코드 리뷰에서 반복 지적되는 항목들.
3. **`DESIGN.md` 첫 2섹션 (Overview + Colors)** (10분) — 디자인 결정의 어휘를 얻음.
4. **첫 실제 작업** — 작업 유형 매트릭스(§2)에서 자신의 작업 유형 찾아 1차 문서로 진입.

행운을 빕니다. 막히면 위 §4 참조.
