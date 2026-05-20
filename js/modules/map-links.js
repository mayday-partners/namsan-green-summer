// js/modules/map-links.js
// Builds map-app deep links from data/venue.json and mounts buttons into [data-map-links] slots.
// Slot selects venue: <div data-map-links="<key>"> picks venues[<key>]; bare [data-map-links] uses default_venue.

const DATA_URL = '/data/venue.json';

let dataPromise = null;

function loadData() {
  if (dataPromise) return dataPromise;
  dataPromise = (async () => {
    const res = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  })();
  return dataPromise;
}

function isMobile() {
  return /iPhone|iPad|Android/.test(navigator.userAgent);
}

export function buildKakaoLink(venue) {
  const id = venue?.place_ids?.kakao;
  if (!id) return null;
  return isMobile()
    ? `kakaomap://place?id=${id}`
    : `https://place.map.kakao.com/${id}`;
}

export function buildGoogleLink(venue) {
  const addr = venue?.address?.road_en;
  if (!addr) return null;
  const params = new URLSearchParams({
    api: '1',
    destination: addr,
    travelmode: 'transit',
    utm_source: 'namsan-green-summer',
    utm_campaign: 'directions_request',
  });
  const placeId = venue?.place_ids?.google;
  if (placeId) params.set('destination_place_id', placeId);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function buildNaverLink(venue) {
  const name = venue?.name;
  if (!name) return null;
  const appname = location.origin || 'https://namsangreensummer.com';
  const placeId = venue?.place_ids?.naver;
  const c = venue?.coordinates;
  const hasCoords = c && c.lat != null && c.lng != null;

  // Priority 1: coords-based public-transit directions (mobile app only)
  if (hasCoords && isMobile()) {
    const params = new URLSearchParams({
      dlat: String(c.lat),
      dlng: String(c.lng),
      dname: name,
      appname,
    });
    return `nmap://route/public?${params.toString()}`;
  }

  // Priority 2: Place ID — exact match, cross-platform.
  // Mobile uses Universal Links to open the Naver Maps app when installed.
  if (placeId) {
    return `https://map.naver.com/p/entry/place/${placeId}`;
  }

  // Priority 3: search fallback (no place ID, no coords)
  if (isMobile()) {
    const params = new URLSearchParams({ query: name, appname });
    return `nmap://search?${params.toString()}`;
  }
  return `https://map.naver.com/p/search/${encodeURIComponent(name)}`;
}

function pickVenue(data, key) {
  const target = key || data?.default_venue;
  return data?.venues?.[target] ?? null;
}

export async function mountMapLinks(root = document) {
  const slots = root.querySelectorAll('[data-map-links]');
  if (!slots.length) return;

  let data;
  try {
    data = await loadData();
  } catch (err) {
    console.error('[map-links] venue.json load failed:', err);
    slots.forEach((slot) => {
      slot.replaceChildren();
      const msg = document.createElement('p');
      msg.className = 'fallback-error';
      msg.setAttribute('role', 'alert');
      msg.textContent = '지도 링크를 불러오지 못했습니다.';
      slot.appendChild(msg);
    });
    return;
  }

  slots.forEach((slot) => {
    const key = slot.getAttribute('data-map-links') || data.default_venue;
    const venue = pickVenue(data, key);
    if (!venue) {
      console.warn('[map-links] unknown venue key:', key);
      return;
    }

    const links = [
      { label: '카카오맵으로 열기',     modifier: 'map-kakao',  href: buildKakaoLink(venue) },
      { label: '구글맵으로 길찾기',     modifier: 'map-google', href: buildGoogleLink(venue) },
      { label: '네이버지도로 열기',     modifier: 'map-naver',  href: buildNaverLink(venue) },
    ].filter((l) => l.href);

    if (!links.length) {
      console.warn('[map-links] no available links for venue:', key);
      return;
    }

    const frag = document.createDocumentFragment();
    for (const { label, modifier, href } of links) {
      const a = document.createElement('a');
      a.className = `btn btn--${modifier}`;
      a.href = href;
      a.rel = 'noopener';
      a.target = '_blank';
      a.textContent = label;
      frag.appendChild(a);
    }
    slot.replaceChildren(frag);
  });
}
