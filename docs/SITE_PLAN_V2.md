# 2026 남산 서머 페스티벌 홈페이지 기획서 (V2 재구성)

> **출처**: `docs/(남산) 홈페이지 기획안_V2.pptx` (12 slides, 2026-05-19 기준)
> **목적**: PPTX 슬라이드를 IA·페이지 명세·데이터 스키마·CTA 매트릭스로 재구성하여 코드베이스에 바로 매핑 가능한 작업 기준을 만든다.
> **행사명**: "2026 남산 서머 페스티벌" (V1에서 변경됨)

---

## 1. 행사 메타데이터

| 항목 | 값 |
|---|---|
| 행사일 | 2026.6.27. (토) |
| 접수 시작 | 2026.6.10. (수) 선착순 마감 |
| 운영 사무국 | 02-6412-9714 |
| 도메인 | https://namsangreensummer.com (Cloudflare Pages 루트 단일 환경) |
| 참고 사이트 | https://seoulrun.kr/ |
| 후원사 | 미확정 (0519 기준) — 로고 추후 전달 |

---

## 2. 사이트맵 (IA)

```
/ (메인)
├─ 행사안내
│  ├─ 행사 개요 (인사말 · 전체 사이트맵 · 오시는 길)
│  └─ 주요 프로그램 (Fun&Walk · Summer Night · Summer Garden 요약)
├─ Fun&Walk
│  ├─ 프로그램 안내 (기본·참가·신청)
│  ├─ 코스 안내 (6.0km 코스맵)
│  └─ 참가 유의사항
├─ Summer Night
│  ├─ 프로그램 안내 (공연·체험존)
│  └─ 공연 예약 유의사항
├─ Summer Garden
│  ├─ 도슨트 투어 안내
│  └─ 도슨트 투어 유의사항
└─ 커뮤니티
   ├─ 공지사항
   ├─ 자주 묻는 질문 (FAQ)
   └─ 환불 및 취소 신청
```

- **GNB 5개 메뉴**: 행사안내 / Fun&Walk / Summer Night / Summer Garden / 커뮤니티
- **공통 푸터**: 모든 페이지 동일 (`partials/footer.html`)
- **공통 헤더**: GNB + 모바일 햄버거 (`partials/header.html` + `<site-header>` 커스텀 엘리먼트)

---

## 3. 페이지별 상세 명세

### 3-1. 메인 (`index.html`)

| 블록 | 내용 | 데이터 소스 |
|---|---|---|
| 키비주얼 | 행사명 + 배경 이미지 (활용 배경 디자인 필요) | `data/image-slots.json` |
| Fun&Walk 개요 | 일시·장소·참가비·신청 CTA (내국인/외국인) | `data/programs.json` |
| Summer Night 개요 | 일시·장소·참가비·사전 예약 CTA | `data/programs.json` |
| Summer Garden 개요 | 일시·장소·참가비·도슨트 투어 CTA (내국인/외국인) | `data/programs.json` |
| 공지사항 프리뷰 | 2건 (공지사항 게시글 링크) | `data/notices.json` (`data-limit="2"`) |
| 후원사 로고 | 후원사 영역 | `data/sponsors.json` (placeholder) |

**예시 공지**:
- "2026 남산 서머 페스티벌 개최 안내"
- "프로그램 별 신청 방법"

---

### 3-2. 행사안내

#### `event/index.html` — 행사 개요

- **인사말** (히어로 카피)
  > "남산의 자연, 야경, 그리고 문화가 어우러지는 도심 속 여름 특화 체험형 축제!"
  > 여름철 남산공원의 숨겨진 매력과 아름다움을 재발견하는 시간, '2026 남산 서머 페스티벌'이 찾아옵니다. 푸른 나무들이 반겨주는 남산 순환로의 활기찬 낮 풍경부터, 서울의 독보적인 야경 명소인 팔각정의 로맨틱한 밤까지! 남산이 가진 모든 특별함을 다채로운 체험 프로그램으로 가득 담아냈습니다. 대한민국 서울을 대표하는 도심 속 초록 오아시스, 남산공원에서 올여름을 빛낼 기분 좋은 에너지를 가득 채워보세요.

- **전체 사이트맵** (디자인 필요 — 시각 다이어그램)

- **오시는 길** (3개 좌표, 카카오맵 임베드)
  | 프로그램 | 장소 | 주소 |
  |---|---|---|
  | Fun&Walk | 백범광장 및 남·북측 순환로 | 서울 중구 회현동1가 100-115 |
  | Summer Garden | 한국 숲 정원 | 서울 용산구 이태원동 259-16 |
  | Summer Night | 팔각광장 | 서울 중구 예장동 8-1 |

  > ※ 주차권/비용 미지원. 대중교통 권장.

#### `event/programs.html` — 주요 프로그램

3개 프로그램 요약 카드 + 신청 버튼. 각 프로그램 상세 페이지로 진입 동선.

> ⚠️ **중복 신청 불가 고지** (전 페이지 반복):
> Fun&Walk와 Summer Garden 프로그램은 동시 진행되는 프로그램으로 중복 신청이 불가합니다.

---

### 3-3. Fun&Walk

#### `fun-and-walk/index.html` — 프로그램 안내

| 항목 | 값 |
|---|---|
| 프로그램 명 | Fun&Walk |
| 행사 일시 | 2026.6.27. (토) |
| 집결지 | 백범광장 (서울 중구 회현동1가 100-115) |
| 참가비 | 10,000원 |
| 참가 자격 | 신체 건강한 남녀노소 누구나 |
| 신청 기간 | 6월 10일 (수) ~ 선착순 마감 |
| 신청 방법 | 사전예약 (서울시공공서비스예약) / 네이버 예약 (외국인) |
| 지급품 | 기념티셔츠, 방수 스트링백, 완보증, 메달 키링 (완주 시 수령) |
| 환불 마감 | 별도 안내사항 확인 (`fun-and-walk/notice.html`) |
| 문의 | 02-6412-9714 |

**CTA**:
- 내국인 신청 바로가기 (공공서비스)
- 외국인 신청 바로가기 (네이버 예약)

#### `fun-and-walk/course.html` — 코스 안내

- **6km 코스** (코스맵 이미지 디자인 필요)
- **경유지**: ① 백범광장 → ② 호현당 → ③ 횡단보도 → ④ 남산 북측순환로 → ⑤ 남측순환로 → ⑥ 팔각광장 (종점), 약 6.0km

**NOTICE**:
- 야외 신체 활동 — 편안한 운동복·운동화 필수
- 사전 코스 확인 권장
- 현장 운영요원·안내 표지판 지시 준수

#### `fun-and-walk/notice.html` — 참가 유의사항

| 섹션 | 핵심 내용 |
|---|---|
| 참가 자격 | 보조 장비(휠체어·인라인) 없이 달릴 수 있는 신체 건강한 자. 유아 동반 가능하나 유아차 불가 |
| 접수처 안내 | 2026.6.27.(토) 15:00–16:00 운영 / 출발 16:00 / **15:50까지 등록 완료 필수** / 백범광장공원 (백범김구선생상 인근) |
| 탈의실 운영 | 대회 당일 운영, 배부 티셔츠 착용 |
| 운영 관련 | 비경쟁 / 순위·기록 미집계 / 개인 기록 측정 장비 미지원 / 팔찌 1인 1매, 재발급 불가 / 백범광장 주차 불가 / 공식 촬영 진행 |
| 안전 및 보험 | 행사 보험 적용, 개인 과실 사고는 보장 제한 / 구급차·응급 의료 인력 배치 |
| **환불 규정** | 「서울특별시 도시공원 조례」 제19조 적용 (아래 표 참조) |
| 기타 | 천재지변 등 불가항력 사유 시 별도 공지 |

**환불 규정 (도시공원 조례 19조)**:

| 취소 시점 | 환불액 |
|---|---|
| 천재지변·불가항력 | 전액 |
| 사용일 7일 전까지 또는 예약 당일 | 전액 |
| 사용일 6일~3일 전 | 90% (10% 공제) |
| 사용일 2일~1일 전 | 70% (30% 공제) |
| 사용일 이후 | 환불 불가 |

---

### 3-4. Summer Night

#### `summer-night/index.html` — 프로그램 안내

| 항목 | 값 |
|---|---|
| 장소 | 팔각광장 (서울 중구 예장동 8-1) |
| 운영 일시 | 2026.6.27.(토) 17:00–21:00 |
| 접수기간 | 6월 10일~ 선착순 마감 |
| 참가비 | 무료 |
| 참여 방법 | 사전예약 (네이버 예약) / 현장 예약 |
| 라인업 | 2026 구석구석 라이브, 아티스트 초청 (**로이킴**, **존박**) |

**체험존**:
- 운영 일시: 2026.6.27.(토) 17:00–21:00
- 대상: SNS 이벤트 참여자 (현장 이벤트)
- 참가비: 무료
- 참여 방법: 현장 SNS 업로드

**CTA**: 사전 예약 바로가기 (네이버 예약)
**디자인 필요**: 객석 가이드, 라인업 이미지

#### `summer-night/notice.html` — 공연 예약 유의사항

| 섹션 | 핵심 내용 |
|---|---|
| 예약 안내 | 무료 / 전 연령 / 한정 수용 (사전+현장 선착순) / **예매자 명의 변경 불가** (취소 후 재예약) / 현장 접수 가능 |
| 입장 안내 | 사전 예약 확인 = 티켓 부스 (당일 17시 운영) / 입장 대기줄 운영 시간 **미확정** / 종합 안내소 14시–공연 종료 / 물품 보관소 미운영 |
| 관람 안내 | 입장 시간 운영상 변동 가능 → 공지사항 확인 / 야외 관람 — 겉옷·모자·선글라스 준비 / 우천 시 정상 진행, 안전 따라 조정 / **DSLR·미러리스 등 전문 장비 촬영·녹화 금지** / 안내견 외 반려동물 입장 제한 |
| 기타 | 불가항력 사유 시 별도 공지 |

---

### 3-5. Summer Garden

#### `summer-garden/index.html` — 도슨트 투어 안내

| 항목 | 값 |
|---|---|
| 장소 | 한국 숲 정원 (서울 용산구 이태원동 259-16) |
| 집결지 | **남산 마루** (신규) |
| 접수기간 | 6월 10일~ 선착순 마감 |
| 참가비 | 무료 |
| 참여 방법 | 사전예약 (네이버 예약) |
| 세부 프로그램 | 도슨트 투어, 체험 부스 |
| 신청 자격 | 신체 건강한 남녀노소 누구나 |
| 문의 | 02-6412-9714 |

> ⚠️ Fun&Walk와 **동시 진행 — 중복 신청 불가**

**CTA**: 도슨트 투어 신청 바로가기 (네이버 예약)
**디자인 필요**: 코스 안내 다이어그램

#### `summer-garden/notice.html` — 도슨트 투어 유의사항

| 섹션 | 핵심 내용 |
|---|---|
| 예약 안내 | 네이버 예약 전용 / **1 ID로 다수 인원 예약 가능** / 회차별 정원 마감 시 자동 마감 / 모바일 예약 불가 시 사무국 (02-6412-9714) / **투어 10분 전 집결 필수** / **국문·영문 동시 운영** — 신청 시 언어 선택 유의 |
| 관람 안내 | 야외 — 겉옷·모자·선글라스 준비 / 우천 시 정상 진행 / 공식 촬영 진행 / 현장 상황 따라 코스 변동 가능 |
| 기타 | 불가항력 사유 시 별도 공지 |

---

### 3-6. 커뮤니티

#### `community/index.html` — 공지사항

- 전체 공지 목록 (`data/notices.json` 전체 로드, `data-limit` 미지정 또는 큰 값)
- 메인의 프리뷰와 **동일 JSON 공유** (절대 룰 #3)
- 상세 페이지: `community/notice.html?id=...` 쿼리스트링 패턴 (CLAUDE.md 게시판 규칙) — 신규 생성 시 `community/` 디렉토리 안에 둠

#### `community/faq.html` — 자주 묻는 질문

- FAQ 게시판 (`data/faqs.json`)
- 콘텐츠 **추후 전달 예정** — 페이지 구조만 먼저 잡기

#### `community/refund.html` — 환불 및 취소 신청

| 프로그램 | 처리 방식 |
|---|---|
| Fun&Walk | 각 예매처별 환불 규정 안내 + 예매 사이트 바로가기 (외부 링크) |
| Summer Night | 사전 예약 번호 + 개인 정보 기입 폼 |
| Summer Garden | 사전 예약 번호 + 개인 정보 기입 폼 |

> 메모: 페이지만 먼저 잡기, 콘텐츠 추후 전달

---

## 4. 공통 컴포넌트 매트릭스

| 컴포넌트 | 사용처 | 비고 |
|---|---|---|
| `<site-header>` | 전 페이지 | 5개 메뉴, 모바일 햄버거 |
| `<site-footer>` | 전 페이지 | 문의 02-6412-9714 |
| 프로그램 카드 | 메인 × 3, 행사안내 × 3 | modifier로 색 구분 (Fun&Walk / Night / Garden) |
| CTA 버튼 (내국인/외국인) | 메인, Fun&Walk, Summer Garden | 2버튼 그룹 modifier |
| CTA 버튼 (단일) | Summer Night, Summer Garden 페이지 등 | 단일 primary |
| 공지/FAQ 리스트 | 메인 (limit=2), 커뮤니티 전체 | 동일 JSON, `data-limit`만 차이 |
| 카카오맵 임베드 | 행사안내, 각 프로그램 페이지 | 3개 좌표 재사용 |
| 코스맵 이미지 | Fun&Walk, Summer Garden | 디자인 필요 (svg/이미지) |
| 유의사항 아코디언 | Fun&Walk·Night·Garden 유의사항 | 섹션 4–8개 |
| 환불 규정 표 | Fun&Walk 유의사항, 환불 신청 페이지 | 동일 데이터, 표 컴포넌트 |

---

## 5. 데이터 스키마 영향

### 5-1. `data/programs.json` (신규 필요)

```json
[
  {
    "id": "funwalk",
    "name": "Fun&Walk",
    "tagline": "남산 산책로에서 fun하게 즐기는 미션형 걷기",
    "date": "2026-06-27",
    "time": null,
    "location": { "label": "백범광장", "address": "서울 중구 회현동1가 100-115" },
    "fee": 10000,
    "registration": { "open": "2026-06-10", "method": ["서울시공공서비스예약", "네이버 예약"] },
    "cta": [
      { "label": "내국인 신청", "href": "..." },
      { "label": "외국인 신청", "href": "..." }
    ]
  },
  {
    "id": "summer-night",
    "name": "Summer Night",
    "tagline": "서울 야경이 내려다보이는 팔각정, 한여름 밤의 낭만적인 야외 페스티벌",
    "date": "2026-06-27",
    "time": "17:00-21:00",
    "location": { "label": "팔각광장", "address": "서울 중구 예장동 8-1" },
    "fee": 0,
    "registration": { "open": "2026-06-10", "method": ["네이버 예약", "현장 예약"] },
    "lineup": ["2026 구석구석 라이브", "로이킴", "존박"],
    "cta": [{ "label": "사전 예약", "href": "..." }]
  },
  {
    "id": "summer-garden",
    "name": "Summer Garden",
    "tagline": "새로운 한국숲정원을 거닐다, 도슨트와 함께하는 고품격 정원 투어",
    "date": "2026-06-27",
    "time": null,
    "location": { "label": "한국 숲 정원", "address": "서울 용산구 이태원동 259-16" },
    "meetingPoint": "남산 마루",
    "fee": 0,
    "registration": { "open": "2026-06-10", "method": ["네이버 예약"] },
    "cta": [
      { "label": "내국인 신청", "href": "..." },
      { "label": "외국인 신청", "href": "..." }
    ]
  }
]
```

### 5-2. `data/notices.json` (기존)

- 초기 시드 2건 필요:
  - "2026 남산 서머 페스티벌 개최 안내"
  - "프로그램 별 신청 방법"

### 5-3. `data/faqs.json` (기존)

- 콘텐츠 추후 전달 — 스키마만 유지

### 5-4. `data/sponsors.json` (신규 필요, placeholder)

- 0519 기준 미확정 — 빈 배열 + 로고 슬롯만 준비

---

## 6. 외부 링크 / CTA 매트릭스

| 페이지 | CTA | 종류 | 외부 시스템 |
|---|---|---|---|
| 메인 / Fun&Walk | 내국인 신청 | primary | 서울시공공서비스예약 |
| 메인 / Fun&Walk | 외국인 신청 | secondary | 네이버 예약 |
| 메인 / Summer Night | 사전 예약 | primary | 네이버 예약 |
| 메인 / Summer Garden | 내국인 신청 | primary | 네이버 예약 |
| 메인 / Summer Garden | 외국인 신청 | secondary | 네이버 예약 |
| Fun&Walk 유의사항 | 환불 신청 | 내부 | `/community/refund.html` |
| 모든 페이지 | 공지사항 | 내부 | `/community/` |

> 모든 외부 링크는 `target="_blank" rel="noopener"` 적용 필요.
> URL은 추후 확정 — 현재는 `data/programs.json`의 `cta[].href` placeholder.

---

## 7. 디자인 의존 항목 (디자인 필요)

| 항목 | 위치 | 상태 |
|---|---|---|
| 키비주얼 배경 | 메인 | 활용 배경 미정 |
| 전체 사이트맵 다이어그램 | 행사안내 > 개요 | 디자인 필요 |
| Fun&Walk 6km 코스맵 | 코스 안내 | 이미지 디자인 필요 |
| Summer Night 객석 가이드 | 공연 안내 | 디자인 필요 |
| Summer Night 라인업 이미지 | 공연 안내 | 디자인 필요 |
| Summer Garden 코스 안내 | 도슨트 투어 안내 | 디자인 필요 |
| 후원사 로고 | 메인 푸터 영역 | 0519 미확정 |

---

## 8. 미확정 / 보류 항목

1. 후원사 로고 (0519 기준 미확정)
2. FAQ 콘텐츠 (커뮤니티) — 페이지 구조만 먼저
3. 환불·취소 신청 폼 콘텐츠 — 페이지 구조만 먼저
4. Summer Night 입장 대기줄 운영 시간 (슬라이드에 "00시–00시"로 표기됨)
5. 각 예매처 URL (서울시공공서비스 / 네이버 예약 상세 링크)
6. 환불 마감 정확 일자 (Fun&Walk)
7. 객석 가이드 / 라인업 비주얼 (Summer Night)
8. 후원사 데이터 스키마 (`data/sponsors.json` 구조)
9. Summer Night 공연 본체 시작/종료 시각 (PPT slide 8 본문 "17:00-21:00"은 체험존 운영 시간 — 공연 본체는 미명시)
10. 우천 시 Fun&Walk 진행 정책 (PPT slide 7 미명시. Summer Night/Garden은 명시)

### 8-1. V1 → V2 명칭 매핑

PPT는 V2 본문에서 "Summer Night/Summer Garden"을 사용하나 일부 슬라이드 헤더에 V1 명칭("그린나이트/그린가든 레이아웃")이 잔재한다. 외부 백링크·SEO·운영팀 핸드오프 시 혼동 방지를 위한 참조표:

| V1 (PPT 슬라이드 헤더 잔재) | V2 (공식) | 코드 식별자 |
|---|---|---|
| 그린나이트 (Green Night) | Summer Night | `summer-night/` |
| 그린가든 (Green Garden) | Summer Garden | `summer-garden/` |
| 한국숲정원 (PPT slide 10 본문) | 한국 숲 정원 | `venue.json` 미등록 (`_pending_venue`) |

> 도메인 `namsangreensummer.com`은 V1 명칭("Green Summer") 잔재. 도메인 등록 비가역적이므로 유지하되 표시 라벨은 V2 ("2026 남산 서머 페스티벌") 통일.

### 8-2. Open Questions (검증 루프 R1 결과)

다음은 PPT만으로 결정 불가 — 운영팀 확정 필요:

1. **Summer Night 라인업 확정성**: PPT slide 4 "세부 프로그램 예시"에는 로이킴/존박 명시, slide 8 본문은 "아티스트 초청 (이미지/디자인 필요)"로 미명시. 라인업 단정 가능 시점 확정 필요. (`data/programs.json` lineup 항목에 `_pending_confirmation: true` 마킹됨)
2. **셔틀 운영 데이터 출처**: `venue.json:45` "16:00–22:30, 15분 간격, 백범광장 방면"은 PPT에 없음. 운영팀 확정 또는 다른 문서 출처 명시 필요.
3. **푸터 주최/주관/이메일**: PPT는 운영 사무국 02-6412-9714만 표기. "주최/서울특별시 · 주관/남산공원관리사무소 · namsan-festival@example.kr"은 추정값. 운영팀 확정 필요.
4. **헤더 단일 "참가신청" CTA**: PPT는 프로그램별 "내국인/외국인" 2채널 분기 (Fun&Walk: 공공서비스/네이버, Night·Garden: 네이버). 헤더 단일 CTA 동작 정의 필요 (예: `event/programs.html`로 이동 vs Fun&Walk 직접 이동).
5. **헤더 로고 + 푸터 © 텍스트**: 현재 "NAMSAN GREEN SUMMER" / "Namsan Green Summer Festival" — 도메인과 일치하지만 PPT 행사명("2026 남산 서머 페스티벌")과 불일치. V2 통일 여부 결정.
6. **Fun&Walk 우천 정책**: Summer Night/Garden은 "정상 진행, 안전 따라 조정" 명시, Fun&Walk만 PPT 누락. 동일 적용 vs 별도 정책.
7. **PPT slide 1 사이트맵 "참가 유의사항" 항목**: 사이트맵 도식 L:48-49에서 커뮤니티 하위로 표기되나 slide 12 본문에는 없음. 도식 vs 본문 SSOT 결정.
8. **`data/notices.json` 시드 9건**: PPT slide 2 명시 항목은 "2026 남산 서머 페스티벌 개최 안내" + "프로그램 별 신청 방법" 2건뿐. 나머지 7건은 dev seed (Fun&Walk 모집, 라인업, 1차 마감, 키트 발송, 셔틀, 후원사, 홈페이지 오픈). 각 항목에 `_source` 메타로 PPT 출처/dev seed 구분 표기 완료. 운영팀 콘텐츠 확정 시 dev seed 항목들을 실제 공지로 교체 또는 제거 필요. 특히 "라인업 공개" 항목은 `programs.json` lineup `_pending_confirmation: true` 상태와 모순 — 라인업 확정 전에는 게시 보류 권장.

---

## 9. 현 코드베이스 상태 (2026-05-20 갱신)

V2 PPTX 기반의 IA·페이지 분리·데이터·브랜드 네이밍이 코드에 반영됨. 본 절은 잔여 작업과 미확정 항목만 추적.

### 9-1. 현재 파일 구조

```
event/
├─ index.html         (행사 개요 + 오시는 길 #location)
└─ programs.html      (주요 프로그램)

fun-and-walk/
├─ index.html         (프로그램 안내)
├─ course.html        (6km 코스 안내)
└─ notice.html        (참가 유의사항)

summer-night/
├─ index.html         (공연·체험존 안내)
└─ notice.html        (공연 예약 유의사항)

summer-garden/
├─ index.html         (도슨트 투어 안내)
└─ notice.html        (도슨트 투어 유의사항)

community/
├─ index.html         (공지사항)
├─ faq.html           (자주 묻는 질문)
└─ refund.html        (환불 및 취소 신청)

data/
├─ programs.json      ✓ V2 메타데이터 SSOT (행사·3프로그램·환불 정책)
├─ notices.json       ✓
├─ faqs.json          ✓ (콘텐츠 추후)
├─ venue.json         ✓ (5개 좌표 + Fun&Walk 5개 CP)
├─ sponsors.json      ✓ placeholder
├─ image-slots.json   ✓
└─ config.json        ✓ Kakao SDK 키

partials/
├─ header.html        ✓ V2 라벨 (Summer Night / Summer Garden)
└─ footer.html        ✓
```

### 9-2. 완료된 마이그레이션

- [x] V1 → V2 브랜드 네이밍 (`green-*` → `summer-*` 디렉토리·라벨)
- [x] 단일 페이지 → 멀티 페이지 분리 (`<area>/{index,page}.html`)
- [x] partials + custom element (`<site-header>`, `<site-footer>`) 패턴
- [x] `data/programs.json` 신규 — V2 PPTX의 라인업·집결지·환불 정책 반영
- [x] 모든 페이지 메타·OG·`<title>` — "2026 남산 서머 페스티벌"
- [x] CSS `@layer` + BEM + 컴포넌트 분리
- [x] Cloudflare Pages 루트 도메인 단일 배포 환경 전환 (subpath 폐기)

### 9-3. 잔여 작업

| 영역 | 작업 | 우선순위 |
|---|---|---|
| Summer Garden 장소 | venue.json에 "한국 숲 정원" (이태원동 259-16) 등록 또는 namsan_library와 운영 결정 일원화 | High |
| Summer Garden 집결지 | "남산 마루" 좌표 검증 후 venue.json 추가 | High |
| CTA URL 확정 | `data/programs.json`의 `cta[].href`가 모두 `null` — 서울시공공서비스예약 / 네이버 예약 URL 확정 필요 | High |
| Summer Night 입장 대기줄 | 운영 시간 미확정 (PPTX "00시–00시") — 운영팀 확정 후 `summer-night/notice.html` 반영 | Medium |
| Fun&Walk 환불 마감 | 정확 일자 운영팀 확정 후 `fun-and-walk/notice.html` 반영 | Medium |
| 후원사 로고 | 0519 기준 미확정 → `data/sponsors.json` 채우기 + 푸터/메인 슬롯 | Medium |
| FAQ 콘텐츠 | 운영팀 전달 후 `data/faqs.json` 채우기 | Medium |
| 환불·취소 신청 폼 | 페이지 구조만 존재 — Summer Night/Garden용 입력 폼 콘텐츠 | Medium |
| Summer Night 객석 가이드 / 라인업 비주얼 | 디자인 필요 | Low |
| Summer Garden 코스 다이어그램 | 디자인 필요 | Low |
| 전체 사이트맵 SVG | `event/index.html` 다이어그램 슬롯 — 디자인 필요 | Low |

---

## 10. 변경 이력

| 일자 | 변경 | 출처 |
|---|---|---|
| 2026-05-20 | V2 PPTX 기반 초안 작성 | `docs/(남산) 홈페이지 기획안_V2.pptx` |
| 2026-05-20 | 경로 갱신: `pages/*.html` → `<area>/{index,page}.html`. § 9 코드베이스 상태 갱신 (마이그레이션 완료 마킹). GH Pages subpath 폐기 반영 (도메인 표). | 사용자 지시 (subpath 배포 폐기) |
