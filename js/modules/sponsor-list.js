const DATA_URL = '/data/sponsors.json';

export async function renderSponsorList() {
  const slots = document.querySelectorAll('[data-sponsor-list]');
  if (!slots.length) return;

  let sponsors;
  try {
    const res = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const json = await res.json();
    if (!Array.isArray(json?.sponsors)) throw new TypeError('sponsors must be array');
    sponsors = json.sponsors;
  } catch (err) {
    console.error('[sponsor-list] load failed:', err);
    slots.forEach(slot => renderFallback(slot, '후원사 정보를 불러오지 못했습니다.'));
    return;
  }

  slots.forEach(slot => {
    try {
      if (!sponsors.length) {
        renderFallback(slot, '후원사 정보는 운영팀 확정 후 공개됩니다.');
        return;
      }

      const frag = document.createDocumentFragment();
      sponsors.forEach(item => {
        if (!item?.id) return;
        const tile = document.createElement(item.url ? 'a' : 'div');
        tile.className = 'sponsor__tile';
        if (item._pending) tile.dataset.pending = 'true';

        if (item.url) {
          tile.href = item.url;
          tile.target = '_blank';
          tile.rel = 'noopener noreferrer';
        }

        if (item.logo) {
          const img = document.createElement('img');
          img.src = item.logo;
          img.alt = item.name ?? '후원사';
          img.loading = 'lazy';
          tile.append(img);
        } else {
          const name = document.createElement('span');
          name.className = 'sponsor__tile-name';
          name.textContent = item.name ?? '(이름 미정)';
          const badge = document.createElement('span');
          badge.className = 'sponsor__tile-badge';
          badge.textContent = item._pending ? 'TBD' : (item.tier ?? '');
          tile.append(name, badge);
        }
        frag.append(tile);
      });
      slot.replaceChildren(frag);
    } catch (err) {
      console.error('[sponsor-list] render failed:', err);
      renderFallback(slot, '후원사 표시 중 오류가 발생했습니다.');
    }
  });
}

function renderFallback(slot, message) {
  const p = document.createElement('p');
  p.className = 'sponsor__empty';
  p.setAttribute('role', 'note');
  p.textContent = message;
  slot.replaceChildren(p);
}
