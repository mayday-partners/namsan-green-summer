// js/modules/map-links.js
// Builds map-app deep links from data/venue.json and mounts buttons into [data-map-links] slots.
// Strategy: Kakao via Place ID, Google via address string, Naver skipped while coords absent.

const DATA_URL = new URL('../../data/venue.json', import.meta.url).href;

let venuePromise = null;

function loadVenue() {
  if (venuePromise) return venuePromise;
  venuePromise = (async () => {
    const res = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  })();
  return venuePromise;
}

function isMobile() {
  return /iPhone|iPad|Android/.test(navigator.userAgent);
}

export function buildKakaoLink(venue) {
  const id = venue?.primary?.place_ids?.kakao;
  if (!id) return null;
  return isMobile()
    ? `kakaomap://place?id=${id}`
    : `https://place.map.kakao.com/${id}`;
}

export function buildGoogleLink(venue) {
  const addr = venue?.primary?.address?.road_en;
  if (!addr) return null;
  const params = new URLSearchParams({
    api: '1',
    destination: addr,
    travelmode: 'transit',
    utm_source: 'namsan-green-summer',
    utm_campaign: 'directions_request',
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function buildNaverLink(venue) {
  const c = venue?.primary?.coordinates;
  if (!c || c.lat == null || c.lng == null) return null;
  if (!isMobile()) return null; // PC web fallback not finalized
  const params = new URLSearchParams({
    dlat: String(c.lat),
    dlng: String(c.lng),
    dname: venue.primary.name ?? '',
    appname: location.origin || 'https://namsangreensummer.com',
  });
  return `nmap://route/public?${params.toString()}`;
}

export async function mountMapLinks(root = document) {
  const slots = root.querySelectorAll('[data-map-links]');
  if (!slots.length) return;

  let venue;
  try {
    venue = await loadVenue();
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

  const links = [
    { label: '카카오맵으로 열기',     modifier: 'map-kakao',  href: buildKakaoLink(venue) },
    { label: '구글맵으로 길찾기',     modifier: 'map-google', href: buildGoogleLink(venue) },
    { label: '네이버지도로 길찾기',   modifier: 'map-naver',  href: buildNaverLink(venue) },
  ].filter((l) => l.href);

  if (!links.length) {
    console.warn('[map-links] no available links for current venue/UA');
    return;
  }

  slots.forEach((slot) => {
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
