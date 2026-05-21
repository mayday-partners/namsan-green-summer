// js/modules/seat-guide.js
// programs.json[program].seat_guide → .seat-guide 렌더
// Rule: textContent only (no innerHTML), idempotency guard, try/catch

export async function renderSeatGuide() {
  const slots = document.querySelectorAll('[data-seat-guide]');
  if (!slots.length) return;

  let data;
  try {
    const res = await fetch('/data/programs.json');
    if (!res.ok) throw new Error(`fetch /data/programs.json: ${res.status}`);
    data = await res.json();
  } catch (e) {
    console.error('[seat-guide] fetch error:', e);
    return;
  }

  const programMap = {};
  for (const p of (data.programs || [])) {
    programMap[p.id] = p;
  }

  for (const slot of slots) {
    // idempotency guard
    if (slot.dataset.seatGuideRendered) continue;
    slot.dataset.seatGuideRendered = '1';

    const program = programMap[slot.dataset.seatGuide];
    const sg = program?.seat_guide;
    if (!sg) continue;

    const wrapper = document.createElement('div');
    wrapper.className = 'seat-guide';

    const stage = document.createElement('span');
    stage.textContent = sg.stage_label;
    wrapper.appendChild(stage);

    for (let i = 0; i < (sg.seat_count || 0); i++) {
      const seat = document.createElement('i');
      wrapper.appendChild(seat);
    }

    const freeZone = document.createElement('strong');
    freeZone.textContent = sg.free_zone_label;
    wrapper.appendChild(freeZone);

    slot.appendChild(wrapper);
  }
}
