// js/components/venue-map.js
// Kakao Maps SDK 임베드 — `.venue-map` 슬롯에 지도를 렌더한다.
// 좌표 우선순위: data-lat/data-lng(검증 좌표) → 없으면 data-address 지오코딩.
// SDK/지오코딩 실패 시 조용히 fallback (슬롯은 --color-soft 배경으로 남음).
//
// Kakao JS 키는 공개 키다 — 보안은 비밀이 아니라 Kakao Developers Console의
// Web 도메인 화이트리스트로 보장된다(이전 data/config.json 정책 계승).

const KAKAO_JS_KEY = 'c7be50b0ba9dcf0ff4334e49e788dec3';
const SDK_SRC =
  `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false&libraries=services`;

let sdkPromise = null;

function loadKakaoSdk() {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SDK_SRC;
    s.async = true;
    s.onload = () => window.kakao.maps.load(() => resolve(window.kakao));
    s.onerror = () => reject(new Error('Kakao SDK script load failed'));
    document.head.appendChild(s);
  });
  return sdkPromise;
}

function geocodeAddress(kakao, address) {
  return new Promise((resolve, reject) => {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result[0]) {
        resolve(new kakao.maps.LatLng(result[0].y, result[0].x));
      } else {
        reject(new Error(`geocode failed: ${address} (${status})`));
      }
    });
  });
}

async function resolveCenter(kakao, slot) {
  const lat = parseFloat(slot.dataset.lat);
  const lng = parseFloat(slot.dataset.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return new kakao.maps.LatLng(lat, lng);
  }
  if (slot.dataset.address) {
    return geocodeAddress(kakao, slot.dataset.address);
  }
  return null;
}

async function renderMap(kakao, slot) {
  const center = await resolveCenter(kakao, slot);
  if (!center) return;

  const map = new kakao.maps.Map(slot, { center, level: 4 });
  const marker = new kakao.maps.Marker({
    position: center,
    title: slot.dataset.name || '',
  });
  marker.setMap(map);

  // 컨테이너가 늦게 레이아웃 크기를 얻는 경우 타일 정렬 보정.
  kakao.maps.event.addListener(map, 'tilesloaded', () => map.relayout());
}

export async function mountVenueMaps(root = document) {
  const slots = root.querySelectorAll('.venue-map');
  if (!slots.length) return;

  let kakao;
  try {
    kakao = await loadKakaoSdk();
  } catch (err) {
    console.error('[venue-map]', err);
    return; // fallback: 슬롯은 빈 배경으로 남음
  }

  slots.forEach((slot) => {
    renderMap(kakao, slot).catch((err) => console.warn('[venue-map]', err));
  });
}
