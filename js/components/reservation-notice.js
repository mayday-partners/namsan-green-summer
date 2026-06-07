const NOTICE_SELECTOR = '[data-reservation-pending]';
const MODAL_ID = 'reservation-notice';
let activeTrigger = null;

export function initReservationNotice() {
  const triggers = document.querySelectorAll(NOTICE_SELECTOR);
  if (!triggers.length) return;

  const modal = ensureNoticeModal();
  const closeButton = modal.querySelector('.reservation-notice__close');
  const panel = modal.querySelector('.reservation-notice__panel');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      activeTrigger = trigger;
      openNoticeModal(modal, closeButton);
    });
  });

  modal.addEventListener('click', event => {
    if (!panel.contains(event.target)) closeNoticeModal(modal);
  });

  closeButton.addEventListener('click', () => closeNoticeModal(modal));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.dataset.open === 'true') {
      closeNoticeModal(modal);
    }
  });
}

function ensureNoticeModal() {
  const existing = document.getElementById(MODAL_ID);
  if (existing) return existing;

  const modal = document.createElement('div');
  modal.id = MODAL_ID;
  modal.className = 'reservation-notice';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'reservation-notice-title');
  modal.setAttribute('aria-hidden', 'true');
  modal.hidden = true;

  const panel = document.createElement('div');
  panel.className = 'reservation-notice__panel';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'reservation-notice__eyebrow';
  eyebrow.textContent = 'Namsan Summer Festival';

  const title = document.createElement('h2');
  title.id = 'reservation-notice-title';
  title.textContent = '예약 안내';

  const message = document.createElement('p');
  message.className = 'reservation-notice__message';
  message.textContent = '2026년 6월 12일 부터 예약 가능합니다';

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'reservation-notice__close';
  closeButton.textContent = '확인';

  panel.append(eyebrow, title, message, closeButton);
  modal.append(panel);
  document.body.append(modal);

  return modal;
}

function openNoticeModal(modal, closeButton) {
  modal.hidden = false;
  modal.dataset.open = 'true';
  modal.setAttribute('aria-hidden', 'false');
  closeButton.focus();
}

function closeNoticeModal(modal) {
  modal.dataset.open = 'false';
  modal.setAttribute('aria-hidden', 'true');
  modal.hidden = true;
  if (activeTrigger) activeTrigger.focus();
}
