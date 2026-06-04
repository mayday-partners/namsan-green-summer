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
// 이미 지도를 렌더한 슬롯 — 중복 초기화 방지 (언어 토글 시 재호출되므로 필요).
const mounted = new WeakSet();

// display:none(비활성 언어) 슬롯 판별. Kakao 지도는 크기 0 컨테이너에서
// 타일 레이아웃을 못 잡으므로, 보이는 슬롯만 렌더해야 한다.
function isVisible(el) {
  return el.offsetParent !== null;
}

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

// 보이는(활성 언어) 슬롯 중 아직 렌더하지 않은 것만 마운트한다.
// 언어 토글 시 다시 호출되면 새로 보이게 된 슬롯이 그때 렌더된다 — 숨겨진 채
// 0px로 초기화돼 깨지는 현상(ko/en 중복 마크업)을 막는다.
export async function mountVenueMaps(root = document) {
  const slots = Array.from(root.querySelectorAll('.venue-map')).filter(
    (slot) => isVisible(slot) && !mounted.has(slot),
  );
  if (!slots.length) return;

  let kakao;
  try {
    kakao = await loadKakaoSdk();
  } catch (err) {
    console.error('[venue-map]', err);
    return; // fallback: 슬롯은 빈 배경으로 남음
  }

  slots.forEach((slot) => {
    // SDK 로드(await) 사이 언어가 다시 바뀌어 숨겨졌을 수 있으니 재확인.
    if (!isVisible(slot) || mounted.has(slot)) return;
    mounted.add(slot);
    renderMap(kakao, slot).catch((err) => {
      mounted.delete(slot); // 실패 시 다음 호출에서 재시도 가능하도록.
      console.warn('[venue-map]', err);
    });
  });
}
