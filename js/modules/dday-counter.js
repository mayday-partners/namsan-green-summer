const FALLBACK_DATE = '2026-06-27';

export function renderDdayBadges() {
  const slots = document.querySelectorAll('[data-dday]');
  if (!slots.length) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  slots.forEach(slot => {
    const target = slot.dataset.dday || FALLBACK_DATE;
    const event = new Date(`${target}T00:00:00`);
    if (Number.isNaN(event.getTime())) {
      console.warn('[dday-counter] invalid date:', target);
      return;
    }
    const diff = Math.round((event - today) / (1000 * 60 * 60 * 24));
    let label;
    if (diff > 0) label = `D-${String(diff).padStart(2, '0')}`;
    else if (diff === 0) label = 'D-DAY';
    else label = `D+${String(Math.abs(diff)).padStart(2, '0')}`;
    slot.textContent = label;
  });
}
