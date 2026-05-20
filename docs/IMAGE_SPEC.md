# Image Spec — 디자이너 핸드오프 가이드

> 2026 남산 서머 페스티벌 정적 사이트의 이미지 슬롯 인벤토리와 export 규약.
> **단일 진실원(SSOT)**: [`data/image-slots.json`](../data/image-slots.json). 본 문서는 그 사본이며, 슬롯 정의가 바뀌면 JSON을 먼저 수정합니다.

---

## 1. 빠른 시작 (Designer)

1. **사이트를 spec 모드로 연다**
   - 로컬: `http://localhost:3000/?spec=1`
   - 배포: `https://namsangreensummer.com/?spec=1`
2. 페이지를 다음 폭으로 확인:
   - 모바일 **390 / 768**
   - 데스크톱 **1280 / 1440**
3. 각 슬롯 우상단에 표시되는 라벨:
   - **slot ID** (네온 그린)
   - **실제 렌더 px** (브라우저 폭에 따라 실시간 갱신)
   - **권장 비율**
4. Figma에서 슬롯 ID와 동일한 이름의 프레임을 만든다. 권장 widths 중 **가장 큰 값**을 기준 아트보드로.
5. Export 파일명 = `<slot-id>.webp` + `<slot-id>.png` (예: `hero-main.webp` + `hero-main.png`)
6. 개발자가 `img/slots/`에 배치 → `data/image-slots.json`의 `current_file` 갱신.

> spec=1을 빼면 일반 사이트(임시 이미지)로 보입니다. 일반 사용자에게는 영향 없음.

---

## 2. 슬롯 인벤토리 (P1 → P3)

### P1 — 가장 큰 비주얼 임팩트

| ID | 페이지 | 비율 (데스크톱 / 모바일) | 권장 widths (px) | 비고 |
|---|---|---|---|---|
| `hero-main` | `/` | 16:9 / 4:5 | 1280·1920·2560 | **LCP**. 우상단 360px 폭 텍스트 카드 오버레이. 좌측 60%에 메인 피사체. |
| `og-share-default` | 전 페이지 meta | 1.91:1 | **1200×630** | **별도 파일**. 현재 hero.webp(540×380) 재사용은 SNS 표준 미달. |

### P2 — 지도 (특수 자산)

| ID | 페이지 | 비율 | 권장 widths | 비고 |
|---|---|---|---|---|
| `course-map-walk` | `/fun-and-walk/` | 16:9 | 768·1280 | 5km 코스 라인 + CP1~CP4 / FIN 마커. 다크 테마. |
| `course-map-event` | `/event/#location` | 16:9 | 768·1280 | 행사 구역(백범광장/북측순환로/남산도서관) + 교통 접근. 다크 테마. |

### P3 — 프로그램 카드 미디어 (의사결정 필요)

> 모두 현재 그라데이션 색상 박스. **이미지로 교체할지 / 그라데이션을 유지할지** 디자이너 판단.

| ID | 페이지 | 비율 | widths | 공유 |
|---|---|---|---|---|
| `card-media-funwalk` | event.html | 4:3 | 480·768 | — |
| `card-media-night` | event.html + summer-night.html | 4:3 | 480·768 | **2개 페이지** |
| `card-media-garden` | event.html + summer-night.html + summer-garden.html | 4:3 | 480·768 | **3개 페이지** |
| `card-media-garden-deep` | summer-garden.html (Workshop 02) | 4:3 | 480·768 | — |
| `card-media-garden-fresh` | summer-garden.html (Workshop 03) | 4:3 | 480·768 | — |
| `card-media-neutral` | summer-night.html (Food Truck) | 4:3 | 480·768 | — |

---

## 3. 파일 컨벤션

- **파일명**: `<slot-id>.<ext>` — 예: `hero-main.webp`
- **포맷**: WebP 필수 + PNG/JPG fallback 권장 (구 브라우저 호환)
- **위치**: `img/slots/` (신규 디렉토리)
- **색공간**: sRGB
- **압축**: WebP quality 80~85
- **메타데이터**: GPS·카메라 정보 strip
- **공유 슬롯**: 같은 ID를 여러 페이지에서 사용 — **파일은 1개**만 export

### art direction 슬롯 (모바일/데스크톱 다른 크롭)

`hero-main`처럼 모바일/데스크톱 비율이 다른 슬롯:
```
img/slots/hero-main.desktop.webp   # 16:9 (1280/1920/2560 중 가장 큰 것)
img/slots/hero-main.mobile.webp    # 4:5  (540/768)
```
※ `<picture>` 마이그레이션은 **Phase B**에서 구현 (실제 이미지 수령 후).

---

## 4. og:image (SNS 공유 카드)

현재 `og:image`로 `hero.webp` (540×380)를 재사용 — Facebook/Twitter/Kakao 표준(1200×630) 미달.

권장:
- 별도 디자인 (텍스트 오버레이 가능 — 사이트 hero와 차별화)
- 파일: `img/share/og-default.png` 또는 `.jpg`
- 사이즈: 1200×630 (1.91:1)
- 모든 페이지가 같은 og:image 공유 (Phase B에서 페이지별 분기 검토)

→ og:image가 갱신되면 7개 HTML의 다음 메타도 같이 수정 필요:
```html
<meta property="og:image" content="https://namsangreensummer.com/img/share/og-default.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

---

## 5. 권장 작업 순서

1. **P1 5개** (hero + preview 3개 + og) — 메인 페이지 전체 인상 결정
2. **P2 코스맵 2개** — 일러스트 작업 시간 필요
3. **P3 카드 6개** — 그라데이션 유지로 결정 시 작업 불필요

---

## 6. 변경 관리

| 작업 | 수정할 곳 |
|---|---|
| 슬롯 추가/삭제 | `data/image-slots.json` + 해당 HTML에 `data-image-slot="..."` |
| 권장 크기/비율 변경 | `data/image-slots.json` 만 |
| 실제 이미지 수령 | `current_file` 필드 갱신 |
| Phase B 전환 (`<picture>` + srcset) | `js/modules/image-slot.js` + CSS 마이그레이션 |

slot 정의가 바뀌면 본 문서와 placeholder 라벨은 **자동 반영**됩니다.

---

## 7. 개발자 메모

- spec=1은 dev-only 도구. 일반 사용자에겐 영향 없음.
- placeholder 렌더는 SVG `data:` URL — 별도 빌드/npm 불필요 (no-build 정책 유지).
- og:image는 SNS 봇이 직접 fetch하므로 spec 모드와 무관 — 메타 태그 갱신만 영향.
- `_ref/` 아래 reference asset 및 루트 `main-sample.png`(2.9MB)는 본 시스템과 무관 — 별도 정리 가능.
