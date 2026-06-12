const TEMPLATE_ID = 'home-notice-popup-template';
const POPUP_SELECTOR = '[data-home-notice-popup]';
const CLOSE_SELECTOR = '[data-home-notice-close]';
const HIDE_TODAY_SELECTOR = '[data-home-notice-hide-today]';
const STORAGE_KEY = 'namsan-home-notice-hidden-date';

let previousFocus = null;

export function initHomeNoticePopup() {
  if (!document.body.classList.contains('home-page')) return;
  if (isHiddenToday()) return;

  const template = document.getElementById(TEMPLATE_ID);
  if (!(template instanceof HTMLTemplateElement)) return;

  const fragment = template.content.cloneNode(true);
  const popup = fragment.querySelector(POPUP_SELECTOR);
  if (!popup) return;

  document.body.append(fragment);

  const mountedPopup = document.querySelector(POPUP_SELECTOR);
  if (!mountedPopup) return;

  bindPopup(mountedPopup);
  openPopup(mountedPopup);
}

function bindPopup(popup) {
  const panel = popup.querySelector('.home-notice-popup__panel');

  popup.querySelectorAll(CLOSE_SELECTOR).forEach(button => {
    button.addEventListener('click', () => closePopup(popup));
  });

  popup.addEventListener('click', event => {
    if (panel && !panel.contains(event.target)) closePopup(popup);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && popup.dataset.open === 'true') {
      closePopup(popup);
    }
  });
}

function openPopup(popup) {
  previousFocus = document.activeElement;
  popup.hidden = false;
  popup.setAttribute('aria-hidden', 'false');

  requestAnimationFrame(() => {
    popup.dataset.open = 'true';
    const closeButton = popup.querySelector(CLOSE_SELECTOR);
    if (closeButton instanceof HTMLElement) closeButton.focus();
  });
}

function closePopup(popup) {
  const hideToday = popup.querySelector(HIDE_TODAY_SELECTOR);
  if (hideToday instanceof HTMLInputElement && hideToday.checked) {
    saveHiddenToday();
  }

  popup.dataset.open = 'false';
  popup.setAttribute('aria-hidden', 'true');

  window.setTimeout(() => {
    popup.remove();
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }, 160);
}

function isHiddenToday() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === getTodayKey();
  } catch {
    return false;
  }
}

function saveHiddenToday() {
  try {
    window.localStorage.setItem(STORAGE_KEY, getTodayKey());
  } catch {
    // localStorage가 제한된 환경에서는 닫기 동작만 수행한다.
  }
}

function getTodayKey() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date());
}
