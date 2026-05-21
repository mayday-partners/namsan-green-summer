// js/modules/course-map.js
// programs.json[program].course → course-map CSS-only 5 라벨 + notice-panel 렌더

export async function renderCourseMap() {
  const slots = document.querySelectorAll('[data-course-map]');
  if (!slots.length) return;

  let data;
  try {
    const res = await fetch('/data/programs.json');
    if (!res.ok) throw new Error(`fetch /data/programs.json: ${res.status}`);
    data = await res.json();
  } catch (e) {
    console.error('[course-map] fetch error:', e);
    return;
  }

  const programMap = {};
  for (const p of (data.programs || [])) {
    programMap[p.id] = p;
  }

  for (const slot of slots) {
    if (slot.dataset.courseMapRendered) continue;
    slot.dataset.courseMapRendered = '1';

    const programId = slot.dataset.courseMap;
    const program = programMap[programId];
    if (!program || !program.course) continue;
    const course = program.course;

    // course-map-block wrapper
    const block = document.createElement('div');
    block.className = 'course-map-block';

    // heading
    const h3 = document.createElement('h3');
    h3.textContent = course.heading;
    block.appendChild(h3);

    // course-map container
    const mapDiv = document.createElement('div');
    mapDiv.className = 'course-map';
    mapDiv.setAttribute('role', 'img');
    mapDiv.setAttribute('aria-label', `Fun&Walk ${course.heading} 코스맵`);

    // course-path decorative
    const pathDiv = document.createElement('div');
    pathDiv.className = 'course-path';
    mapDiv.appendChild(pathDiv);

    // labels
    for (const lbl of (course.labels || [])) {
      const span = document.createElement('span');
      span.className = `course-label ${lbl.position_class}`;
      // \n → <br> 처리: textContent 불가, 안전하게 처리
      const parts = lbl.text.split('\n');
      for (let i = 0; i < parts.length; i++) {
        span.appendChild(document.createTextNode(parts[i]));
        if (i < parts.length - 1) {
          span.appendChild(document.createElement('br'));
        }
      }
      mapDiv.appendChild(span);
    }

    // caption
    if (course.caption) {
      const cap = document.createElement('div');
      cap.className = 'course-caption';
      cap.textContent = course.caption;
      mapDiv.appendChild(cap);
    }

    block.appendChild(mapDiv);

    // notice-panel
    if (course.notice_panel) {
      const np = course.notice_panel;
      const noticeDiv = document.createElement('div');
      noticeDiv.className = 'notice-panel';

      const npH3 = document.createElement('h3');
      npH3.textContent = np.heading;
      noticeDiv.appendChild(npH3);

      if (Array.isArray(np.items) && np.items.length) {
        const ul = document.createElement('ul');
        for (const item of np.items) {
          const li = document.createElement('li');
          li.textContent = item;
          ul.appendChild(li);
        }
        noticeDiv.appendChild(ul);
      }

      block.appendChild(noticeDiv);
    }

    slot.appendChild(block);
  }
}
