// js/modules/info-panel-list.js
// programs.json[program].info_panels → .info-panel × N 렌더
// Rule: textContent only (no innerHTML), idempotency guard, try/catch

export async function renderInfoPanelList() {
  const slots = document.querySelectorAll('[data-info-panels]');
  if (!slots.length) return;

  let data;
  try {
    const res = await fetch('/data/programs.json');
    if (!res.ok) throw new Error(`fetch /data/programs.json: ${res.status}`);
    data = await res.json();
  } catch (e) {
    console.error('[info-panel-list] fetch error:', e);
    return;
  }

  const programMap = {};
  for (const p of (data.programs || [])) {
    programMap[p.id] = p;
  }

  for (const slot of slots) {
    // idempotency guard
    if (slot.dataset.infoPanelsRendered) continue;
    slot.dataset.infoPanelsRendered = '1';

    const programId = slot.dataset.infoPanels;
    const program = programMap[programId];
    if (!program) continue;
    const panels = program.info_panels;
    if (!Array.isArray(panels)) continue;

    for (const panel of panels) {
      const div = document.createElement('div');
      div.className = 'info-panel';

      const h3 = document.createElement('h3');
      h3.textContent = panel.heading;
      div.appendChild(h3);

      const dl = document.createElement('dl');
      dl.className = 'program-info-table';

      for (const row of (panel.rows || [])) {
        const rowDiv = document.createElement('div');
        const dt = document.createElement('dt');
        dt.textContent = row.label;
        const dd = document.createElement('dd');
        dd.textContent = row.value;
        rowDiv.appendChild(dt);
        rowDiv.appendChild(dd);
        dl.appendChild(rowDiv);
      }

      div.appendChild(dl);
      slot.appendChild(div);
    }
  }
}
