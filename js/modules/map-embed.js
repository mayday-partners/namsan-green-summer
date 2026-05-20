// js/modules/map-embed.js
// Loads the Kakao Maps SDK on demand and renders maps into [data-map-embed] slots.
// Slot selects venue: <div data-map-embed="<key>"> picks venues[<key>]; bare attribute uses default_venue.
// When data.courses[<key>].checkpoints exists, each CP renders as a marker + click-to-open InfoWindow
// and the viewport auto-fits via setBounds. Polyline rendering intentionally omitted — see inline note.

const VENUE_URL  = '/data/venue.json';
const CONFIG_URL = '/data/config.json';
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

    // Checkpoint markers + InfoWindow (click to open/close).
    // Polyline rendering intentionally omitted: course geometry should come
    // from an operator GPX trace or designer illustration, not estimated coords.
    //
    // Mount pattern (Kakao SDK aspect-ratio quirk):
    //   1) relayout() after the next paint to recompute pixel/coord mapping
    //   2) create overlays AFTER relayout
    //   3) setBounds() (single-arg form) auto-fits the new viewport
    const course = data.courses?.[key];
    if (course?.checkpoints?.length) {
      requestAnimationFrame(() => {
        map.relayout();

        const bounds = new kakao.maps.LatLngBounds();
        bounds.extend(center);

        course.checkpoints.forEach((cp) => {
          if (cp.lat == null || cp.lng == null) return;
          const pos = new kakao.maps.LatLng(cp.lat, cp.lng);
          const marker = new kakao.maps.Marker({ map, position: pos, title: cp.name });

          // Build InfoWindow content as a DOM element (textContent — XSS-safe per CLAUDE.md).
          const iwContent = document.createElement('div');
          iwContent.style.padding = '6px 10px';
          iwContent.style.fontSize = '0.875rem';
          iwContent.style.fontWeight = '600';
          iwContent.textContent = cp.name + (cp.km != null ? ` · ${cp.km}km` : '');

          const iw = new kakao.maps.InfoWindow({
            content: iwContent,
            removable: true,
          });

          kakao.maps.event.addListener(marker, 'click', () => iw.open(map, marker));

          bounds.extend(pos);
        });

        map.setBounds(bounds);
      });
    }
  });
}
