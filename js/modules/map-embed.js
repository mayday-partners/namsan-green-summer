// js/modules/map-embed.js
// Loads the Kakao Maps SDK on demand and renders maps into [data-map-embed] slots.
// Slot selects venue: <div data-map-embed="<key>"> picks venues[<key>]; bare attribute uses default_venue.
// Course polyline auto-renders when data.courses[<key>] exists (not required for marker-only mode).

const VENUE_URL  = new URL('../../data/venue.json',  import.meta.url).href;
const CONFIG_URL = new URL('../../data/config.json', import.meta.url).href;
const SDK_BASE   = 'https://dapi.kakao.com/v2/maps/sdk.js';

let sdkPromise = null;

async function loadKakaoSdk() {
  if (sdkPromise) return sdkPromise;
  sdkPromise = (async () => {
    const cfgRes = await fetch(CONFIG_URL, { cache: 'no-cache' });
    if (!cfgRes.ok) throw new Error(`config.json ${cfgRes.status}`);
    const cfg = await cfgRes.json();
    const key = cfg?.kakao_js_key;
    if (!key || key.startsWith('REPLACE_')) {
      throw new Error('kakao_js_key missing — copy data/config.example.json to data/config.json and fill in the key');
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

async function loadVenues() {
  const res = await fetch(VENUE_URL, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`venue.json ${res.status}`);
  return res.json();
}

export async function mountMapEmbeds(root = document) {
  const slots = root.querySelectorAll('[data-map-embed]');
  if (!slots.length) return;

  let kakao, data;
  try {
    [kakao, data] = await Promise.all([loadKakaoSdk(), loadVenues()]);
  } catch (err) {
    console.error('[map-embed]', err);
    return; // .course-map gradient placeholder stays as graceful fallback
  }

  slots.forEach((slot) => {
    const key = slot.getAttribute('data-map-embed') || data.default_venue;
    const venue = data.venues?.[key];
    const lat = venue?.coordinates?.lat;
    const lng = venue?.coordinates?.lng;
    if (lat == null || lng == null) {
      console.warn('[map-embed] no coordinates for venue:', key);
      return;
    }

    // Clear placeholder label before SDK paints into the container.
    slot.replaceChildren();

    const center = new kakao.maps.LatLng(lat, lng);
    const map = new kakao.maps.Map(slot, { center, level: 4, draggable: true });
    new kakao.maps.Marker({ position: center, map, title: venue.name });

    const course = data.courses?.[key];
    if (course?.polyline?.length >= 2) {
      new kakao.maps.Polyline({
        map,
        path: course.polyline.map(([la, ln]) => new kakao.maps.LatLng(la, ln)),
        strokeWeight: 4,
        strokeColor: '#A8FF00',
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
      });
    }
  });
}
