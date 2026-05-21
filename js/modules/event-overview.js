// js/modules/event-overview.js
// programs.json.event_overview를 읽어 [data-event-overview] 슬롯에 렌더링.
// textContent + createElement 전용 — innerHTML 금지.

export async function renderEventOverview() {
  const slots = document.querySelectorAll('[data-event-overview]');
  if (!slots.length) return;

  let data;
  try {
    const res = await fetch('/data/programs.json');
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    const json = await res.json();
    data = json.event_overview;
    if (!data) throw new Error('event_overview key missing');
  } catch (e) {
    console.warn('[event-overview] 데이터 로드 실패:', e);
    return;
  }

  slots.forEach(slot => {
    if (slot.children.length > 0) return;  // idempotency guard

    // h2
    const h2 = document.createElement('h2');
    h2.textContent = '행사 안내';
    slot.appendChild(h2);

    // lead callout
    const lead = document.createElement('p');
    lead.className = 'lead';
    lead.textContent = data.lead_callout;
    slot.appendChild(lead);

    // intro paragraphs
    (data.intro_paragraphs || []).forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      slot.appendChild(p);
    });

    // festival map block
    const mapBlock = document.createElement('div');
    mapBlock.className = 'overview-map-block';

    const mapH3 = document.createElement('h3');
    mapH3.textContent = '전체 사이트맵';
    mapBlock.appendChild(mapH3);

    const festivalMap = document.createElement('div');
    festivalMap.className = 'festival-map';
    festivalMap.setAttribute('role', 'img');
    festivalMap.setAttribute('aria-label', '남산 서머 페스티벌 전체 사이트맵 예정 영역');

    const mapRoute = document.createElement('div');
    mapRoute.className = 'map-route';
    festivalMap.appendChild(mapRoute);

    (data.festival_map_pins || []).forEach(pin => {
      const span = document.createElement('span');
      span.className = 'map-pin ' + pin.position_class;
      // label과 venue를 두 줄로: textNode + br + textNode
      span.appendChild(document.createTextNode(pin.label));
      const br = document.createElement('br');
      span.appendChild(br);
      span.appendChild(document.createTextNode(pin.venue));
      festivalMap.appendChild(span);
    });

    mapBlock.appendChild(festivalMap);
    slot.appendChild(mapBlock);

    // directions block
    const dir = data.directions;
    if (dir) {
      const dirDiv = document.createElement('div');
      dirDiv.className = 'directions';

      const dirH3 = document.createElement('h3');
      dirH3.textContent = dir.heading;
      dirDiv.appendChild(dirH3);

      const dirIntro = document.createElement('p');
      dirIntro.textContent = dir.intro;
      dirDiv.appendChild(dirIntro);

      const dirH4 = document.createElement('h4');
      dirH4.textContent = dir.section_heading;
      dirDiv.appendChild(dirH4);

      const ul = document.createElement('ul');
      (dir.items || []).forEach(item => {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = item.program;
        li.appendChild(strong);
        li.appendChild(document.createTextNode(' : ' + item.address));
        ul.appendChild(li);
      });
      dirDiv.appendChild(ul);

      slot.appendChild(dirDiv);
    }
  });
}
