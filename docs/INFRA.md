# Infrastructure — CSP / 캐시 / 외부 도메인

> [!NOTE]
> **Diátaxis: Reference + How-to.** `_headers` 파일의 모든 지시문과 외부 의존성 추가 절차.
> Cloudflare 운영 비상 대응(롤백/캐시 퍼지 등)은 [README][rm] §14-8.

[rm]: ../README.md
[arch]: ../ARCHITECTURE.md
[claude]: ../CLAUDE.md
[schemas]: ./SCHEMAS.md

---

## 0. 본 문서의 범위

| 다루는 것 | 다루지 않는 것 |
|---|---|
| `_headers` 파일 전체 reference (security + cache) | Cloudflare 콘솔 설정 (대시보드 UI) — README §14 |
| CSP 화이트리스트 + 외부 도메인 추가 절차 | DNS / SSL 인증서 운영 — README §14-8 |
| 신규 CDN/script/font 도입 체크리스트 | 비즈니스 도메인 (가비아 등록) — README §14-1 |
| `robots.txt`, `sitemap.xml` 정책 | 콘텐츠 SEO 최적화 — 추후 별도 문서 |

---

## 1. `_headers` 파일 개요

### 1-1. 어디서 적용되는가

[Cloudflare Pages `_headers` 형식](https://developers.cloudflare.com/pages/configuration/headers/). 저장소 루트의 `_headers` 파일이 Cloudflare Pages 배포에 자동 인식되어 HTTP 응답 헤더로 부여됨.

> [!IMPORTANT]
> **GitHub Pages는 `_headers` 파일을 인식하지 않음.** 보안/캐시 검증은 항상 Cloudflare 환경에서 해야 한다.
>
> | 환경 | `_headers` 적용 |
> |---|---|
> | 프로덕션 (Cloudflare) | ✓ |
> | 테스트 (GitHub Pages) | ✗ |

### 1-2. 파일 문법

```
/<path-pattern>
  Header-Name: value
  Header-Name-2: value
```

- 패턴은 위에서 아래로 매칭 (가장 먼저 매칭된 그룹의 헤더만 적용 — Cloudflare가 자동 merge)
- `/*`는 모든 경로
- `/css/*`는 CSS 폴더 하위만
- 인덴트는 **공백 2칸**

### 1-3. 현재 정의된 그룹

| 그룹 | 적용 | 의도 |
|---|---|---|
| `/*` | 모든 응답 | 보안 헤더 + CSP |
| `/*.html` | HTML 파일 | 짧은 캐시 (콘텐츠 변경 즉시 반영) |
| `/css/*`, `/js/*` | 정적 자산 | 중간 캐시 (1시간, must-revalidate) |
| `/partials/*` | partial 마크업 | 짧은 캐시 (5분, must-revalidate) — 배포 직후 헤더/푸터 변경 빠른 반영 |
| `/data/*.json` | 데이터 파일 | 매우 짧은 캐시 (공지/FAQ 즉시 반영) |
| `/img/*` | 이미지 | 긴 캐시 (1일) |
| `/fonts/*` | 폰트 | 영구 캐시 (immutable) |

---

## 2. 보안 헤더 (`/*` 그룹) Reference

### 2-1. 비-CSP 헤더

| 헤더 | 현재 값 | 역할 |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | 브라우저 MIME sniffing 차단 → CSS/JS 파일을 다른 타입으로 해석하는 공격 방지 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | 동일 origin은 full URL, cross-origin은 origin만 referrer로 전송 → 사용자 URL 누출 감소 |
| `Permissions-Policy` | `interest-cohort=(), browsing-topics=()` | FLoC/Topics API 차단 → Chrome 기반 광고 추적 거부 |
| `X-Frame-Options` | `SAMEORIGIN` | 자기 origin만 iframe 가능 → clickjacking 방지 |

이 4개는 CSP의 보조 — 옛 브라우저/엣지 케이스 보호. CSP가 주력.

### 2-2. Content-Security-Policy 분해

<details>
<summary>현재 CSP 전체 원문 (`_headers` `/*` 그룹)</summary>

```
default-src 'self';
script-src 'self' https://dapi.kakao.com https://*.daumcdn.net https://static.cloudflareinsights.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net;
img-src 'self' data: https://*.daumcdn.net https://*.kakao.com;
connect-src 'self' https://dapi.kakao.com https://cloudflareinsights.com https://cdn.jsdelivr.net;
frame-ancestors 'self';
base-uri 'self';
form-action 'self' https://forms.example.com;
object-src 'none'
```

(실제 파일은 한 줄로 정리됨 — 위는 가독성을 위한 줄 나눔)

</details>

지시문별 의도 + 화이트리스트 출처:

| 지시문 | 값 | 의도 |
|---|---|---|
| `default-src` | `'self'` | 명시되지 않은 모든 리소스는 자기 origin만 |
| `script-src` | `'self' + dapi.kakao.com + *.daumcdn.net + static.cloudflareinsights.com` | `'self'` = `js/*` 모듈 + `data:` SVG는 미허용. `dapi.kakao.com` = Kakao Maps SDK 로더. `*.daumcdn.net` = Kakao 내부 CDN (SDK가 동적 로드). `cloudflareinsights.com` = CF Web Analytics 자동 주입 |
| `style-src` | `'self' 'unsafe-inline' + fonts.googleapis.com + cdn.jsdelivr.net` | `'unsafe-inline'` = `<noscript><style>` + 카카오 InfoWindow 동적 스타일 필요. `googleapis` = Anton/Montserrat. `jsdelivr` = Pretendard variable CSS |
| `font-src` | `'self' + fonts.gstatic.com + cdn.jsdelivr.net` | `gstatic` = Google Fonts 폰트 파일 호스트. `jsdelivr` = Pretendard woff2 |
| `img-src` | `'self' data: + *.daumcdn.net + *.kakao.com` | `data:` = SVG favicon + image-slot placeholder. Kakao 도메인 2종 = 지도 타일 + Place 미리보기 |
| `connect-src` | `'self' + dapi.kakao.com + cloudflareinsights.com + cdn.jsdelivr.net` | `'self'` = `fetch('./data/*.json')`. Kakao = SDK가 추가 데이터 fetch. CF = Web Analytics beacon. jsdelivr = Pretendard variable subset (의도 미명, _headers 정의에 따름) |
| `frame-ancestors` | `'self'` | 본 사이트가 외부 iframe에 임베드되는 것 차단 (clickjacking) |
| `base-uri` | `'self'` | 동적 `<base>` 태그 주입 차단 |
| `form-action` | `'self' https://forms.example.com` | 폼 submit 가능 origin. **`forms.example.com`은 placeholder** — 실 폼 시스템 도입 시 교체 |
| `object-src` | `'none'` | `<object>` / `<embed>` 전면 차단 (Flash 등 레거시) |

### 2-3. 현재 화이트리스트된 외부 도메인 인덱스

| 도메인 | 등록 지시문 | 사용 위치 |
|---|---|---|
| `dapi.kakao.com` | script-src, connect-src | `js/modules/map-embed.js` (SDK 로더 + tile API) |
| `*.daumcdn.net` | script-src, img-src | Kakao SDK 내부 CDN (지도 타일/리소스) |
| `*.kakao.com` | img-src | Kakao Place 썸네일 (InfoWindow 등) |
| `fonts.googleapis.com` | style-src | Anton + Montserrat CSS (`<link>` in HTML head) |
| `fonts.gstatic.com` | font-src | Google Fonts woff2 파일 |
| `cdn.jsdelivr.net` | style-src, font-src, connect-src | Pretendard variable CDN (orioncactus/pretendard v1.3.9) |
| `static.cloudflareinsights.com` | script-src | Cloudflare Web Analytics (자동 주입) |
| `cloudflareinsights.com` | connect-src | CF Analytics beacon |
| `forms.example.com` | form-action | **placeholder** — 실 폼 시스템 도입 시 교체 |

---

## 3. 캐시 정책

### 3-1. 정책 표

| 그룹 | max-age | 추가 옵션 | 의도 |
|---|---|---|---|
| `/*.html` | 300s (5분) | `must-revalidate` | 페이지 콘텐츠 변경 빠른 반영 |
| `/css/*` | 3600s (1시간) | `must-revalidate` | 디자인 변경 1시간 내 반영 (드물게 변경). max-age 만료 후 강제 ETag 검증 |
| `/js/*` | 3600s (1시간) | `must-revalidate` | 모듈 변경 1시간 내 반영. max-age 만료 후 강제 ETag 검증 (배포 시 stale main.js 차단 — 2026-05-19 `3aad39d` 커밋) |
| `/partials/*` | 300s (5분) | `must-revalidate` | 배포 직후 헤더/푸터 변경 빠른 반영 (이전 3600s에서 단축, 2026-05-19 `3aad39d` 커밋) |
| `/data/*.json` | 120s (2분) | `must-revalidate` | 공지/FAQ 추가 시 거의 즉시 반영 (must-revalidate로 stale 차단) |
| `/img/*` | 86400s (1일) | — | 이미지 교체 빈도 낮음 |
| `/fonts/*` | 31536000s (1년) | `immutable` | 폰트 파일 hash 불변 (서브셋 파일명 고정) |

### 3-2. 캐시 vs 콘텐츠 즉시성 트레이드오프

- **공지 1건 추가**: JSON max-age 120s → 최악 2분 후 반영. 즉시 보장 필요하면 Cloudflare 대시보드에서 `/data/*.json` Purge.
- **CSS 토큰 변경**: max-age 3600s → 최악 1시간. 운영 중 critical 변경이면 대시보드 Purge Everything.
- **이미지 교체**: max-age 86400s → 최악 1일. 파일명 hash를 두지 않으므로 같은 경로로 교체하면 캐시 stale. **권장: 새 파일명으로 업로드 후 슬롯 정의 갱신**.

### 3-3. 캐시 즉시 무효화

- **Cloudflare 대시보드 → Caching → Configuration → Purge Cache**
  - Purge Everything: 전체 캐시 비움 (모든 max-age 초기화)
  - Custom Purge: 특정 URL만 (예: `https://namsangreensummer.com/data/notices.json`)
- 운영 환경에서는 너무 잦은 Purge Everything은 origin 부하 증가 — 가능한 한 Custom Purge 사용

---

## 4. How-to: 신규 외부 의존성 추가

새 CDN, 폰트, script, API를 도입할 때 따라야 하는 절차.

### 4-1. 사전 결정

| 질문 | 결정 |
|---|---|
| 이 의존성이 본 사이트의 핵심 기능인가? | 아니면 도입 보류 권장 (no-build 원칙 → 의존성 최소화) |
| 자체 호스팅 가능한가? | 가능하면 자체 호스팅 (CSP 단순화 + 외부 장애 무관) |
| HTTPS인가? | 필수 — HTTP는 mixed-content로 차단 |
| 신뢰 가능한 출처인가? | 공식 도메인 / 평판 있는 CDN만 |

### 4-2. CSP 갱신 절차

도입할 의존성의 종류별로 `_headers`의 어느 지시문을 갱신할지:

| 의존성 종류 | 갱신 지시문 |
|---|---|
| JavaScript SDK | `script-src` (필요시 `connect-src`도) |
| CSS 파일 | `style-src` |
| 폰트 (woff/woff2) | `font-src` |
| 이미지 호스팅 | `img-src` |
| XHR/fetch 대상 API | `connect-src` |
| 폼 submit 대상 | `form-action` |
| iframe 임베드 (외부 widget) | `frame-src` 신규 추가 |

### 4-3. 동시 갱신 체크리스트

신규 외부 도메인 `https://example.com` 추가 시:

- [ ] `_headers`의 해당 CSP 지시문에 `https://example.com` 추가
- [ ] HTML `<head>`에 `<link rel="preconnect" href="https://example.com" crossorigin>` 추가 (성능)
- [ ] 본 문서 §2-3 화이트리스트 인덱스 표에 항목 추가
- [ ] 캐시 정책 영향 검토 — 외부 의존성이 CF 캐시 대상은 아니지만 응답 시간이 LCP에 영향
- [ ] Cloudflare 환경에서 DevTools Console 확인 — CSP 위반 시 `Refused to load ...` 에러 노출
- [ ] 의존성 라이브러리/SDK가 추가로 어떤 origin에 fetch하는지 문서 확인 (예: Kakao SDK는 `dapi.kakao.com` 외 `*.daumcdn.net`도 필요)

### 4-4. 일반적 함정

> [!CAUTION]
> **`'unsafe-inline'` 남발 금지** — CSP 보호 효과 무력화. 현재 `style-src`에 한 번 사용 중 (Kakao InfoWindow 동적 스타일 호환). **다른 지시문엔 절대 추가 금지**.

> [!CAUTION]
> **`*` 전체 와일드카드 금지** — `script-src https://*` 같은 지정은 CSP를 사실상 무력화. 서브도메인 와일드카드(`*.daumcdn.net`)는 명시적 도메인 제한이므로 OK.

> [!IMPORTANT]
> **테스트 환경(GH Pages)에서 CSP 미적용** — 실 검증은 Cloudflare 환경에서. 사전에 DevTools Network → Response Headers에서 `content-security-policy` 행 확인.

---

## 5. How-to: `forms.example.com` placeholder 교체

> [!WARNING]
> **`forms.example.com`은 실제로 존재하지 않는 placeholder 도메인**이다. 현재 6 페이지의 모든 "참가신청/예약" CTA가 이 도메인을 가리킴. 출시 전 반드시 실제 폼 시스템(Google Forms / Typeform / Tally / 자체 빌드)으로 교체할 것.

### 5-1. 영향 범위

| 자산 | 위치 / 개수 |
|---|---|
| HTML 페이지 | `index.html`, `{event,fun-and-walk,summer-night,summer-garden,community}/index.html` — 6곳 |
| Partial | `partials/header.html` (참가신청 CTA) |
| URL 종류 | `/apply` (전체 참가), `/funwalk`, `/greennight`, `/greengarden` |
| CSP 지시문 | `_headers`의 `form-action` |

### 5-2. 교체 체크리스트

- [ ] 실 폼 시스템에서 각 프로그램별 폼 URL 발급 (예: `https://forms.gle/<id1>`, `<id2>`, …)
- [ ] 6개 페이지 + `partials/header.html`의 `forms.example.com` URL 일괄 교체 (`grep -rl "forms.example.com" .` 후 sed)
- [ ] `_headers`의 `form-action` 화이트리스트를 새 도메인으로 교체 (placeholder 제거)
- [ ] 본 문서 §2-3 인덱스에서 `forms.example.com` 행 제거 + 새 도메인 행 추가
- [ ] Cloudflare 환경에 배포 후 폼 submit 동작 확인 (DevTools Network → 차단 메시지 없는지)

---

## 6. SEO 정책 파일

### 6-1. `robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://namsangreensummer.com/sitemap.xml
```

- 모든 크롤러 허용
- AI 학습 봇 차단은 Cloudflare 대시보드 → AI 크롤러 제어 → "모든 페이지에서 차단" (README §14-7 #4 참조). robots.txt 레벨이 아니라 헤더 레벨로 처리.

### 6-2. `sitemap.xml`

```xml
<url><loc>https://namsangreensummer.com/</loc>                           <priority>1.0</priority></url>
<url><loc>https://namsangreensummer.com/event/</loc>           <priority>0.9</priority></url>
<url><loc>https://namsangreensummer.com/fun-and-walk/</loc>    <priority>0.8</priority></url>
<url><loc>https://namsangreensummer.com/summer-night/</loc>     <priority>0.8</priority></url>
<url><loc>https://namsangreensummer.com/summer-garden/</loc>    <priority>0.8</priority></url>
<url><loc>https://namsangreensummer.com/community/</loc>       <priority>0.7</priority></url>
```

- 6개 페이지만 포함. `404.html`은 `noindex` 메타로 제외 (자동 + 명시 둘 다)
- `changefreq`: 홈/메인은 weekly, community는 daily (공지 추가 빈도 반영)
- 신규 페이지 추가 시 본 파일에 URL 추가 필요

### 6-3. `404.html`

- `<meta name="robots" content="noindex, follow">` — 색인은 안 되지만 링크는 따름
- Cloudflare가 매칭 실패 시 자동 서빙 (README §14-7 #2 참조)

---

## 7. 운영 비상 대응

상세는 [`../README.md`](../README.md) §14-8 참조. 본 문서와 직접 관련된 항목만 발췌:

| 상황 | 조치 |
|---|---|
| CSP 위반으로 SDK 차단됨 | DevTools Console → `Refused to load https://X` 메시지 → `_headers`에 해당 지시문 + 도메인 추가 → 커밋 → 새 배포 후 검증 |
| 캐시로 인해 변경 미반영 | Cloudflare 대시보드 → Caching → Purge (전체 또는 특정 URL) |
| 외부 폼 시스템 장애 | CTA href를 임시 다른 URL/메일로 교체 + 5분 내 재배포 |
| Kakao SDK 장애 | `course-map` 슬롯이 자동으로 placeholder gradient fallback (map-embed.js의 try/catch가 처리). 별도 조치 불필요 |

---

## 관련 문서

- [`../README.md`](../README.md) §14 — 배포 환경 전반, Cloudflare 운영
- [`../ARCHITECTURE.md`](../ARCHITECTURE.md) §1 4계층 멘탈 모델, §5 Subpath 호환
- [`./SCHEMAS.md`](./SCHEMAS.md) §5 — `config.json` (외부 API 키)
- [`../CLAUDE.md`](../CLAUDE.md) — AI 에이전트 절대 룰 (외부 의존성 추가 시 사용자 승인 필요)
