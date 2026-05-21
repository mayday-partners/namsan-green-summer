// js/modules/notice-guide-list.js
// programs.json[program].notice_sections → .notice-guide-item × N 렌더
// ol_from_refund_policy → program.refund_policy.tiers에서 ol 생성

export async function renderNoticeGuideList() {
  const slots = document.querySelectorAll('[data-notice-guide-list]');
  if (!slots.length) return;

  let data;
  try {
    const res = await fetch('/data/programs.json');
    if (!res.ok) throw new Error(`fetch /data/programs.json: ${res.status}`);
    data = await res.json();
  } catch (e) {
    console.error('[notice-guide-list] fetch error:', e);
    return;
  }

  const programMap = {};
  for (const p of (data.programs || [])) {
    programMap[p.id] = p;
  }

  for (const slot of slots) {
    if (slot.dataset.noticeGuideListRendered) continue;
    slot.dataset.noticeGuideListRendered = '1';

    const programId = slot.dataset.noticeGuideList;
    const program = programMap[programId];
    if (!program) continue;
    const sections = program.notice_sections;
    if (!Array.isArray(sections)) continue;

    const listDiv = document.createElement('div');
    listDiv.className = 'notice-guide-list';

    for (const section of sections) {
      const item = document.createElement('section');
      item.className = 'notice-guide-item';

      const h3 = document.createElement('h3');
      h3.textContent = section.heading;
      item.appendChild(h3);

      if (section.type === 'paragraphs') {
        for (const text of (section.items || [])) {
          const p = document.createElement('p');
          p.textContent = text;
          item.appendChild(p);
        }
      } else if (section.type === 'ul') {
        const ul = document.createElement('ul');
        for (const text of (section.items || [])) {
          const li = document.createElement('li');
          li.textContent = text;
          ul.appendChild(li);
        }
        item.appendChild(ul);
      } else if (section.type === 'ol_from_refund_policy') {
        // intro paragraph
        if (section.intro) {
          const p = document.createElement('p');
          p.textContent = section.intro;
          item.appendChild(p);
        }

        // tiers from refund_policy
        const tiers = program.refund_policy && program.refund_policy.tiers;
        if (Array.isArray(tiers)) {
          const ol = document.createElement('ol');
          for (const tier of tiers) {
            const li = document.createElement('li');
            if (tier.refund_pct === 100) {
              li.textContent = `${tier.condition} : 이용료 전액 반환`;
            } else if (tier.refund_pct === 0) {
              li.textContent = `${tier.condition} : 환불 불가`;
            } else {
              const deduct = 100 - tier.refund_pct;
              li.textContent = `${tier.condition} : 이용료의 ${deduct}%를 공제한 나머지 금액 반환`;
            }
            ol.appendChild(li);
          }
          item.appendChild(ol);
        }
      }

      listDiv.appendChild(item);
    }

    slot.appendChild(listDiv);
  }
}
