// js/tools/coord-picker.js
// Dev tool: pick a WGS84 lat/lng by clicking the Kakao map.
// Loads Kakao SDK with key from data/config.json (same as map-embed.js).

const CONFIG_URL = '/data/config.json';
const SDK_BASE = 'https://dapi.kakao.com/v2/maps/sdk.js';
const DEFAULT_CENTER = { lat: 37.5548599, lng: 126.9792405 }; // 백범광장

let sdkPromise = null;

async function loadKakaoSdk() {
  if (sdkPromise) return sdkPromise;
  sdkPromise = (async () => {
    const cfgRes = await fetch(CONFIG_URL, { cache: 'no-cache' });
    if (!cfgRes.ok) throw new Error(`config.json ${cfgRes.status}`);
    const cfg = await cfgRes.json();
    const key = cfg?.kakao_js_key;
    if (!key || key.startsWith('REPLACE_')) {
      throw new Error('kakao_js_key missing in data/config.json');
    }
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `${SDK_BASE}?appkey=${encodeURIComponent(key)}&autoload=false`;
      s.async = true;
      s.onload = () => window.kakao.maps.load(resolve);
      s.onerror = () => reject(new Error('Kakao SDK script load failed'));
      document.head.appendChild(s);
    });
    return window.kakao;
  })();
  return sdkPromise;
}

function format(lat, lng, kind) {
  const a = lat.toFixed(7);
  const b = lng.toFixed(7);
  if (kind === 'copy-json') return `"lat": ${a}, "lng": ${b}`;
  if (kind === 'copy-gmaps') return `!3d${a}!4d${b}`;
  return `${a}, ${b}`;
}

async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('[coord-picker] clipboard write failed', err);
    return;
  }
  const orig = btn.textContent;
  btn.textContent = '복사됨';
  window.setTimeout(() => { btn.textContent = orig; }, 1200);
}

async function init() {
  const mapEl = document.getElementById('coord-picker-map');
  const readout = document.getElementById('coord-picker-readout');
  const buttons = document.querySelectorAll('.coord-picker__btn');
  if (!mapEl || !readout) return;

  let kakao;
  try {
    kakao = await loadKakaoSdk();
  } catch (err) {
    readout.textContent = `[error] ${err.message}`;
    readout.classList.add('coord-picker__readout--error');
    console.error('[coord-picker]', err);
    return;
  }

  const center = new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
  const map = new kakao.maps.Map(mapEl, { center, level: 4 });
  const marker = new kakao.maps.Marker({ position: center, map });

  let lastLat = null;
  let lastLng = null;

  kakao.maps.event.addListener(map, 'click', (event) => {
    const latlng = event.latLng;
    lastLat = latlng.getLat();
    lastLng = latlng.getLng();
    marker.setPosition(latlng);
    readout.textContent = `${lastLat.toFixed(7)}, ${lastLng.toFixed(7)}`;
    buttons.forEach((btn) => { btn.disabled = false; });
  });

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (lastLat == null || lastLng == null) return;
      const action = btn.getAttribute('data-action');
      copyToClipboard(format(lastLat, lastLng, action), btn);
    });
  });
}

init();
