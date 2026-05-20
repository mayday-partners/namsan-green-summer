# Data Schemas — `data/*.json` Reference

> [!NOTE]
> **Diátaxis: Reference.** 5개 JSON 파일의 필드 정의와 추가 시 주의사항.
> 작업 절차(How-to)는 [README][rm] §7, 디자이너 핸드오프는 [IMAGE_SPEC][image].

[rm]: ../README.md
[arch]: ../ARCHITECTURE.md
[image]: ./IMAGE_SPEC.md
[infra]: ./INFRA.md

---

## 인벤토리

| 파일 | 책임 | 사용 모듈 | 페이지 슬롯 |
|---|---|---|---|
| `data/notices.json` | 공지사항 게시판 | `js/modules/notice-list.js` | `[data-notice-list]` (홈 + community) |
| `data/faqs.json` | 자주 묻는 질문 | `js/modules/faq-list.js` | `[data-faq-list]` (홈 + community) |
| `data/venue.json` | 장소 정보 (좌표, 주소, 외부 앱 Place ID, 코스 체크포인트) | `js/modules/map-links.js`, `js/modules/map-embed.js` | `[data-map-links]`, `[data-map-embed]` |
| `data/image-slots.json` | 이미지 슬롯 인벤토리 (디자이너 핸드오프) | `js/modules/image-slot.js` | `[data-image-slot]` (`?spec=1` 모드만) |
| `data/config.json` | 외부 API 키 (현재는 Kakao 1종) | `js/modules/map-embed.js` | — |

---

## 1. `data/notices.json`

### 스키마

```json
[
  {
    "id": "2026-05-20-launch",
    "date": "2026-05-20",
    "title": "2026 남산 서머 페스티벌 공식 홈페이지 오픈!",
    "category": "공지",
    "pinned": true,
    "body": "본문 마크다운 또는 HTML 문자열 (선택)",
    "link": null
  }
]
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | string | ✅ | 영문 kebab-case 유일 식별자. URL anchor (`community.html#<id>`) 겸용. **누락 시 해당 항목 skip** + console.warn |
| `date` | string `YYYY-MM-DD` | ✅ | 게시일. 내림차순 정렬 기준. **표시용 포맷(`YYYY.MM.DD`)으로 저장 금지** — 렌더 시 `formatDate()` 변환 |
| `title` | string | ✅ | 목록·상세 공통 제목 |
| `category` | string | ⬜ | "공지" / "이벤트" / "긴급" 등 (현재 UI에서 미사용) |
| `pinned` | boolean | ⬜ | 상단 고정. true가 false보다 우선 정렬 |
| `body` | string | ⬜ | 상세 본문 (현재 상세 페이지 없음 — 향후 SSG 도입 시 사용) |
| `link` | string\|null | ⬜ | 외부 링크면 상세 페이지 대신 이 URL로 이동. `http(s)` 외 프로토콜은 거부 (XSS 방지) |

### 렌더 동작
- **홈** (`index.html`): `<ul data-notice-list data-limit="4" data-render="preview">` → `tpl-notice-preview` 템플릿 사용 (icon + title + meta)
- **커뮤니티** (`community/`): `<ul data-notice-list data-limit="all">` → `tpl-notice-full` 템플릿 사용 (date + title + arrow)

### 추가 시 체크리스트

- [ ] `id`는 `YYYY-MM-DD-slug` 형식 (중복 방지 + 정렬 안정)
- [ ] `date` 형식 반드시 `YYYY-MM-DD` (ISO 8601)[^iso]
- [ ] 추가만 하면 홈/커뮤니티 양쪽 자동 반영 — HTML 수정 불필요

[^iso]: 표시용 포맷(`YYYY.MM.DD`)으로 저장하면 정렬이 깨지고 `formatDate()`가 중복 변환을 시도해 깨진다. 데이터는 항상 ISO, 표시는 렌더 시점 변환.

---

## 2. `data/faqs.json`

### 스키마

```json
[
  {
    "id": "fee",
    "question": "참가비가 있나요?",
    "answer": "모든 입장은 무료입니다. ...",
    "tags": ["참가", "예약"]
  }
]
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | string | ✅ | 영문 kebab-case. anchor (`community.html#faq-<id>`)로 사용 |
| `question` | string | ✅ | `<summary>`에 표시 |
| `answer` | string | ✅ | `<details>` 본문 (`textContent`로 삽입 — HTML 미허용, XSS 방지) |
| `tags` | string[] | ⬜ | 향후 필터링 확장용 (현재 UI에서 미사용) |

### 렌더 동작
- **홈**: preview 모드 — icon + question + `FAQ NN` 메타 라벨
- **커뮤니티**: details/summary `tpl-faq-item` 사용. `Q · NN` qmark 표시

### 추가 시 체크리스트

- [ ] `id`는 URL anchor가 되므로 외부에 노출됨 — 안정적 슬러그로
- [ ] `answer`는 평문만. 강조/링크 필요하면 향후 mini-md 파서 도입 검토

---

## 3. `data/venue.json`

복수 장소 + 코스 정보. `map-links.js`와 `map-embed.js`가 공통 사용.

### 상위 구조

```json
{
  "version": 2,
  "updated": "2026-05-19",
  "default_venue": "baekbeom_square",
  "venues": { "<key>": Venue },
  "reference_points": { "<key>": ReferencePoint },
  "courses": { "<key>": Course }
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `version` | number | ✅ | 스키마 버전 (현재 2) |
| `updated` | string `YYYY-MM-DD` | ✅ | 마지막 갱신 |
| `default_venue` | string | ✅ | `[data-map-links]` / `[data-map-embed]`가 key 없이 사용될 때의 fallback. `venues` 내 key 중 하나여야 함 |
| `venues` | object | ✅ | 실제 장소들. 슬롯에서 `[data-map-links="<key>"]`로 선택 |
| `reference_points` | object | ⬜ | 좌표 검증 시 거리 비교용 (코드에서 미사용, 운영자 참고용) |
| `courses` | object | ⬜ | 워킹 코스 체크포인트. key는 venue key와 매칭 |

### `Venue` 스키마

<details>
<summary>전체 예시 (백범광장 — 33줄)</summary>

```json
{
  "id": "baekbeom_square",
  "name": "남산 백범광장",
  "name_en": "Baekbeom Square",
  "description": "행사 메인 시작 지점.",
  "address": {
    "road": "서울특별시 중구 회현동 삼일대로 231",
    "road_en": "Samil-daero 231, Hoehyeon-dong, Jung-gu, Seoul",
    "jibun": "서울특별시 중구 회현동1가 100-115",
    "postal": "04633"
  },
  "coordinates": {
    "lat": 37.5548599,
    "lng": 126.9792405,
    "_verified": true,
    "_source": "2026-05-19 — Google Maps page URL `!3d37.5548599!4d126.9792405`"
  },
  "place_ids": {
    "kakao": "8381397",
    "kakao_source": "https://place.map.kakao.com/8381397",
    "kakao_verified": "2026-05-19 — Kakao page: 백범광장, 문화유적, ...",
    "google": "ChIJDXyPRF-ifDURo-L1LXIXqj8",
    "google_source": "https://developers.google.com/maps/documentation/places/web-service/place-id",
    "google_verified": "2026-05-19 — Place ID Finder marker ...",
    "naver": "1982441579",
    "naver_source": "https://map.naver.com/p/entry/place/1982441579",
    "naver_verified": "2026-05-19 — Naver page: 백범광장공원, ..."
  }
}
```

</details>

| 필드 그룹 | 필수 | 설명 |
|---|---|---|
| `id`, `name` | ✅ | `name`은 InfoWindow 제목으로 사용 |
| `name_en`, `description` | ⬜ | 운영자 참고용 |
| `address.road_en` | ✅ (구글맵 사용 시) | `buildGoogleLink()`의 `destination` 파라미터 |
| `address.road` / `jibun` / `postal` | ⬜ | 표시/검색용 |
| `coordinates.lat`, `lng` | ⚠️ | `map-embed.js`(Kakao SDK)는 필수. `map-links.js`는 없어도 Place ID로 대체 |
| `coordinates._verified` / `_source` | ⬜ | 운영 검증 흔적 — 좌표 출처와 일자 기록 |
| `place_ids.{kakao,google,naver}` | ⚠️ | 각각 해당 앱 deep link 생성 시 필수. 누락 시 해당 앱 버튼이 슬롯에서 빠짐 |
| `place_ids.*_source` / `*_verified` | ⬜ | 검증 흔적 — 검증 일자와 검증 페이지 요약 |

### `Course` 스키마

```json
{
  "name": "Fun&Walk 5km 코스",
  "_source": "CP coordinates only — polyline rendering disabled.",
  "_verified": false,
  "cp_count": 5,
  "checkpoints": [
    { "id": "cp1", "name": "CP1 백범광장 출발 게이트", "lat": 37.5548599, "lng": 126.9792405, "km": 0 }
  ]
}
```

| 필드 | 필수 | 설명 |
|---|---|---|
| `checkpoints[].id` | ⬜ | 운영자 참고용 (현재 UI에서 미사용) |
| `checkpoints[].name` | ✅ | InfoWindow 제목으로 사용 |
| `checkpoints[].lat`, `lng` | ✅ | 누락 시 해당 CP는 skip |
| `checkpoints[].km` | ⬜ | InfoWindow에 ` · <km>km`로 append |

### 좌표 검증 정책 (자체 룰)

- 좌표계: **WGS84** (Kakao/Google/Naver 모두 호환)
- 정밀도: **소수점 6자리 이상** (~0.1m 정밀도)
- 신규 좌표 추가 시:
  1. 카카오맵/네이버지도/구글맵 셋 중 둘 이상에서 동일 위치 확인
  2. `_verified: true` + `_source`에 검증 출처 + 일자 기록
  3. 추정값이면 `_verified: false` + `_note`에 추정 근거 기록 (예: 현재 `courses.baekbeom_square.checkpoints[2,3]`이 그러함)

### 추가 시 체크리스트

- [ ] 신규 venue → `venues.<key>` 추가 + 슬롯에서 `[data-map-links="<key>"]` / `[data-map-embed="<key>"]`로 선택
- [ ] Kakao Place ID는 `https://place.map.kakao.com/<id>`에서 추출
- [ ] Google Place ID는 [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)에서 marker 클릭
- [ ] Naver Place ID는 `https://map.naver.com/p/entry/place/<id>`에서 추출
- [ ] 좌표 정확성은 `reference_points`의 검증된 좌표와 거리 비교로 sanity check

---

## 4. `data/image-slots.json`

13개 이미지 슬롯의 인벤토리 + art direction. 디자이너 핸드오프 SSOT.

### 스키마 (요약)

```json
{
  "version": 1,
  "updated": "2026-05-19",
  "production_url": "https://namsangreensummer.com",
  "spec_mode": "?spec=1",
  "format_policy": { /* webp/png/색공간/품질 */ },
  "slots": [ Slot ]
}
```

### `Slot` 스키마

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | string | 슬롯 식별자. 페이지의 `data-image-slot="<id>"`와 매칭 |
| `page` | string | 사용 페이지 (참고용) |
| `section` | string | 사용 위치 설명 (참고용) |
| `render` | enum | `"background-cover"` 또는 `"meta"` (`<meta property="og:image">`) |
| `priority` | enum | `"P1"`, `"P2"`, `"P3"` — 우선순위 |
| `lcp` | boolean | LCP(Largest Contentful Paint) 후보 여부 — true면 preload 필요 |
| `alt` | string | 접근성 alt 텍스트 |
| `current_file` | string\|null | 현재 사용 중인 파일 경로. null이면 placeholder gradient |
| `current_status` | string | "임시 이미지" / "그라데이션" 등 운영 메모 |
| `art_direction` | array | 미디어쿼리별 비율/widths/focus 명세 |

### 본 문서가 SSOT가 아닌 이유

`data/image-slots.json`이 1차 SSOT이고, [`IMAGE_SPEC.md`](./IMAGE_SPEC.md)는 디자이너 친화적 사본. **수정은 항상 JSON 먼저** → IMAGE_SPEC.md 갱신.

### 추가 시 체크리스트

- [ ] 페이지에 `<div data-image-slot="<new-id>">` 슬롯 추가
- [ ] `data/image-slots.json`의 `slots[]`에 새 정의 push
- [ ] `IMAGE_SPEC.md`에도 동일 정보 반영 (디자이너 인지)
- [ ] `?spec=1` 모드로 페이지 열어 라벨 표시 확인
- [ ] 실 이미지 파일을 `img/` 하위에 배치 후 `current_file` 갱신

상세 활용법은 [IMAGE_SPEC][image] 참조.

---

## 5. `data/config.json`

외부 API 키 보관. 현재 단일 키 (Kakao JS SDK).

### 스키마

```json
{
  "kakao_js_key": "<32-char hex string>"
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `kakao_js_key` | string | ✅ | Kakao Developers Console에서 발급한 JavaScript 앱 키 |

### 왜 git에 커밋하는가

> [!IMPORTANT]
> Kakao JavaScript SDK 키는 **의도적으로 공개**되도록 설계됨. 보호는 **Kakao Developers Console의 Web 도메인 화이트리스트**에서 처리[^kakao-key].

화이트리스트:

- `http://localhost:3000` (로컬 dev)
- `https://namsangreensummer.com` (프로덕션)

위 외 도메인에서 SDK 호출 시 Kakao 서버가 거부 → 키 노출되어도 악용 불가.

> [!CAUTION]
> 서버 API 키(secret)는 절대 커밋 금지. 본 프로젝트는 서버가 없으므로 해당 없음 — 향후 서버 도입 시 [§5 추가 외부 API 키가 필요해질 때](#추가-외부-api-키가-필요해질-때) 절차 따를 것.

[^kakao-key]: 상세 의도는 `data/config.example.json`의 `_note` 필드에 명시. 일반 서버 API 키와 다른 보안 모델임을 운영자에게 환기.

### 신규 클론 후 셋업
없음. `data/config.json`이 이미 트래킹되어 있어 clone 즉시 동작. `config.example.json`은 키 로테이션 시 템플릿.

### 키 로테이션 절차
1. Kakao Developers Console → 해당 앱 → 보안 → 키 재발급
2. `data/config.json`의 `kakao_js_key` 값 교체
3. 새 도메인 추가 필요하면 Web 도메인 화이트리스트도 동시 갱신
4. 커밋 + 배포

### 추가 외부 API 키가 필요해질 때
1. `data/config.json`에 새 키 필드 추가
2. `data/config.example.json`에도 placeholder + `_note` 추가
3. 해당 키가 **서버 secret이면** `config.json` 커밋 중단 → `config.example.json`을 1차 트래킹으로 전환 + `.gitignore`에 `config.json` 추가 + README에 셋업 절차 명시
4. 외부 호출이 추가되면 [`INFRA.md`](./INFRA.md)의 CSP `connect-src` / `script-src` 동시 갱신

---

## 공통 룰

1. **모든 JSON은 UTF-8 + LF 줄바꿈** (한글 콘텐츠 포함)
2. **추가/수정 후 정적 서버에서 시각 검증**: `npx serve -l 3000` → 변경 슬롯 확인
3. **스키마 변경**(필드 추가/제거)은 본 문서 + 사용 모듈 + 페이지 슬롯 동시 갱신
4. **렌더 모듈은 모두 `try/catch` + fallback 처리** — JSON load 실패해도 사이트는 깨지지 않고 `role="alert"` 메시지 노출
5. **개인정보/credential 금지** — 위 5개 파일은 모두 git에 공개됨

---

## 관련 문서

- [`../README.md`](../README.md) §7 — 콘텐츠 작업 How-to
- [`../ARCHITECTURE.md`](../ARCHITECTURE.md) §2 SSOT 계층도, §3 데이터 흐름
- [`./IMAGE_SPEC.md`](./IMAGE_SPEC.md) — 디자이너 핸드오프
- [`./INFRA.md`](./INFRA.md) — CSP/외부 도메인 (config 추가 시)
