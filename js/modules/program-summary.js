// js/modules/program-summary.js
// 시안 .wire-section.program-summary 패턴 렌더.
// data/programs.json의 programs[].summary 객체에서 데이터를 읽어
// [data-program-summary="<id>"] 슬롯에 마크업을 생성한다.
// Rule: innerHTML에 데이터 직접 삽입 금지 — textContent + DOM API만 사용.
const DATA_URL = '/data/programs.json';

export async function renderProgramSummaries() {
  const slots = document.querySelectorAll('[data-program-summary]');
  if (!slots.length) return;

  let programs;
  try {
    const res = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();
    programs = Array.isArray(data?.programs) ? data.programs : [];
  } catch (err) {
    console.error('[program-summary] load failed:', err);
    return;
  }

  const byId = new Map(programs.map(p => [p.id, p]));

  slots.forEach(slot => {
    const id = slot.dataset.programSummary;
    if (!id) return;
    const program = byId.get(id);
    if (!program?.summary) {
      console.warn('[program-summary] no summary for id "%s"', id);
      return;
    }
    renderSlot(slot, program.summary);
  });
}

function renderSlot(section, s) {
  // Build: .wire-inner.program-copy > h2 + strong + p* + .cta-row
  const inner = document.createElement('div');
  inner.className = 'wire-inner program-copy';

  // h2
  const h2 = document.createElement('h2');
  h2.textContent = s.heading ?? '';
  inner.appendChild(h2);

  // strong (lead)
  if (s.lead) {
    const strong = document.createElement('strong');
    strong.textContent = s.lead;
    inner.appendChild(strong);
  }

  // location_line — rendered as <p>
  if (s.location_line) {
    const p = document.createElement('p');
    p.textContent = s.location_line;
    inner.appendChild(p);
  }

  // application_line — rendered as <p> (null → omit)
  if (s.application_line) {
    const p = document.createElement('p');
    p.textContent = s.application_line;
    inner.appendChild(p);
  }

  // cta-row
  if (Array.isArray(s.ctas) && s.ctas.length) {
    const row = document.createElement('div');
    row.className = 'cta-row';

    s.ctas.forEach((cta, i) => {
      const a = document.createElement('a');
      // pending_key → href="#", aria-disabled (운영팀 URL 확정 전)
      a.href = '#';
      a.setAttribute('aria-disabled', 'true');
      a.dataset.pendingLink = cta.pending_key ?? '';
      a.className = i === 0 ? 'primary-action' : 'secondary-action';
      a.textContent = cta.label ?? '';
      row.appendChild(a);
    });

    inner.appendChild(row);
  }

  section.replaceChildren(inner);
}
