// js/modules/info-panel-list.js
// programs.json[program].info_panels → .info-panel × N 렌더
// data-info-panels="<id>"         → 해당 프로그램의 모든 패널 렌더
// data-info-panels-single="<id>"  → data-info-panels-index 번째 패널 1개만 렌더
// Rule: textContent only (no innerHTML), idempotency guard, try/catch

export async function renderInfoPanelList() {
  const listSlots   = document.querySelectorAll('[data-info-panels]');
  const singleSlots = document.querySelectorAll('[data-info-panels-single]');
  if (!listSlots.length && !singleSlots.length) return;

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

  // helper: panel 1개 → DOM div.info-panel
  function buildPanel(panel) {
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
    return div;
  }

  // list mode: data-info-panels → 모든 패널
  for (const slot of listSlots) {
    if (slot.dataset.infoPanelsRendered) continue;
    slot.dataset.infoPanelsRendered = '1';

    const program = programMap[slot.dataset.infoPanels];
    if (!program) continue;
    const panels = program.info_panels;
    if (!Array.isArray(panels)) continue;

    for (const panel of panels) {
      slot.appendChild(buildPanel(panel));
    }
  }

  // single mode: data-info-panels-single + data-info-panels-index → 1개 패널
  for (const slot of singleSlots) {
    if (slot.dataset.infoPanelsSingleRendered) continue;
    slot.dataset.infoPanelsSingleRendered = '1';

    const program = programMap[slot.dataset.infoPanelsSingle];
    if (!program) continue;
    const panels = program.info_panels;
    if (!Array.isArray(panels)) continue;

    const idx = parseInt(slot.dataset.infoPanelsIndex || '0', 10);
    const panel = panels[idx];
    if (!panel) continue;

    slot.appendChild(buildPanel(panel));
  }
}
