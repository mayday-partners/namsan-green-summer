// js/modules/program-detail.js
// programs.json[program].detail을 읽어 [data-program-detail-list] 슬롯에 렌더링.
// textContent + createElement 전용 — innerHTML 금지.

const PROGRAM_ORDER = ['funwalk', 'summer-night', 'summer-garden'];

export async function renderProgramDetail() {
  const slots = document.querySelectorAll('[data-program-detail-list]');
  if (!slots.length) return;

  let programsMap;
  try {
    const res = await fetch('/data/programs.json');
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    const json = await res.json();
    // programs 배열을 id → object 맵으로 변환
    programsMap = {};
    (json.programs || []).forEach(p => {
      programsMap[p.id] = p;
    });
  } catch (e) {
    console.warn('[program-detail] 데이터 로드 실패:', e);
    return;
  }

  slots.forEach(slot => {
    if (slot.children.length > 0) return;  // idempotency guard

    // 카드 헤더: h2 + lead + notice-copy
    const h2 = document.createElement('h2');
    h2.textContent = '주요 프로그램 안내';
    slot.appendChild(h2);

    const leadP = document.createElement('p');
    leadP.className = 'lead';
    leadP.textContent = '2026 남산 서머 페스티벌 프로그램별 안내';
    slot.appendChild(leadP);

    const noticeP = document.createElement('p');
    noticeP.className = 'notice-copy';
    noticeP.textContent = 'Fun&Walk와 Summer Garden 프로그램은 동시 진행되는 프로그램으로 중복 신청이 불가합니다.';
    slot.appendChild(noticeP);

    // program-detail-list wrapper
    const listDiv = document.createElement('div');
    listDiv.className = 'program-detail-list';

    PROGRAM_ORDER.forEach(id => {
      const program = programsMap[id];
      if (!program || !program.detail) return;
      const det = program.detail;

      const section = document.createElement('section');
      section.className = 'program-detail';

      // 번호 배지
      const numSpan = document.createElement('span');
      numSpan.className = 'program-number';
      numSpan.textContent = det.number;
      section.appendChild(numSpan);

      // h3
      const h3 = document.createElement('h3');
      h3.textContent = det.heading;
      section.appendChild(h3);

      // lead strong
      const strong = document.createElement('strong');
      strong.textContent = det.lead;
      section.appendChild(strong);

      // conflict notice (있을 때만)
      if (det.conflict_notice) {
        const conflictP = document.createElement('p');
        conflictP.textContent = det.conflict_notice;
        section.appendChild(conflictP);
      }

      // dl rows
      if (det.dl_rows && det.dl_rows.length) {
        const dl = document.createElement('dl');
        det.dl_rows.forEach(row => {
          const div = document.createElement('div');
          const dt = document.createElement('dt');
          dt.textContent = row.label;
          const dd = document.createElement('dd');
          dd.textContent = row.value;
          div.appendChild(dt);
          div.appendChild(dd);
          dl.appendChild(div);
        });
        section.appendChild(dl);
      }

      // button row
      if (det.ctas && det.ctas.length) {
        const buttonRow = document.createElement('div');
        buttonRow.className = 'button-row';
        det.ctas.forEach(cta => {
          const a = document.createElement('a');
          a.className = (cta.variant === 'secondary' ? 'secondary-action' : 'primary-action') + ' small';
          // pending_key가 있으면 href="#" + aria-disabled
          if (cta.pending_key && !cta.href) {
            a.href = '#';
            a.setAttribute('aria-disabled', 'true');
            a.setAttribute('data-pending-link', cta.pending_key);
          } else {
            a.href = cta.href || '#';
          }
          a.textContent = cta.label;
          buttonRow.appendChild(a);
        });
        section.appendChild(buttonRow);
      }

      listDiv.appendChild(section);
    });

    slot.appendChild(listDiv);
  });
}
