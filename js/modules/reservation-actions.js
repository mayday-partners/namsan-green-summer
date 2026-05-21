// js/modules/reservation-actions.js
// programs.json[program].reservation_buttons → .reservation-actions 렌더
// programs.json[program].helper_copy → [data-helper-copy] 렌더
// pending_link → aria-disabled="true" + href="#" + data-pending-link

export async function renderReservationActions() {
  const actionSlots = document.querySelectorAll('[data-reservation-actions]');
  const helperSlots = document.querySelectorAll('[data-helper-copy]');
  if (!actionSlots.length && !helperSlots.length) return;

  let data;
  try {
    const res = await fetch('/data/programs.json');
    if (!res.ok) throw new Error(`fetch /data/programs.json: ${res.status}`);
    data = await res.json();
  } catch (e) {
    console.error('[reservation-actions] fetch error:', e);
    return;
  }

  const programMap = {};
  for (const p of (data.programs || [])) {
    programMap[p.id] = p;
  }

  // helper-copy 슬롯
  for (const slot of helperSlots) {
    if (slot.dataset.helperCopyRendered) continue;
    slot.dataset.helperCopyRendered = '1';

    const programId = slot.dataset.helperCopy;
    const program = programMap[programId];
    if (!program || !program.helper_copy) continue;

    const p = document.createElement('p');
    p.className = 'helper-copy';
    p.textContent = program.helper_copy;
    slot.appendChild(p);
  }

  // reservation-actions 슬롯
  for (const slot of actionSlots) {
    if (slot.dataset.reservationActionsRendered) continue;
    slot.dataset.reservationActionsRendered = '1';

    const programId = slot.dataset.reservationActions;
    const program = programMap[programId];
    if (!program) continue;
    const buttons = program.reservation_buttons;
    if (!Array.isArray(buttons)) continue;

    const wrapper = document.createElement('div');
    wrapper.className = 'reservation-actions';

    for (const btn of buttons) {
      const a = document.createElement('a');
      a.className = `reserve-button ${btn.variant}`;

      if (btn.pending_link || !btn.href) {
        a.href = '#';
        a.setAttribute('aria-disabled', 'true');
        a.dataset.pendingLink = '1';
      } else {
        a.href = btn.href;
        a.target = '_blank';
        a.rel = 'noopener';
      }

      const labelText = document.createTextNode(btn.label);
      a.appendChild(labelText);

      if (btn.sub_label) {
        const br = document.createElement('br');
        a.appendChild(br);
        const span = document.createElement('span');
        span.textContent = btn.sub_label;
        a.appendChild(span);
      }

      wrapper.appendChild(a);
    }

    slot.appendChild(wrapper);
  }
}
