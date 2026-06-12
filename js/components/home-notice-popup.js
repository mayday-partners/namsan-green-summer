const POPUP_SELECTOR = '[data-home-notice-popup]';
const CLOSE_SELECTOR = '[data-home-notice-close]';
const HIDE_TODAY_SELECTOR = '[data-home-notice-hide-today]';

const POPUP_CONFIGS = [
  {
    templateId: 'home-notice-popup-template',
    storageKey: 'namsan-home-notice-hidden-date',
    matches: () => document.body.classList.contains('home-page'),
  },
  {
    templateId: 'funwalk-notice-popup-template',
    storageKey: 'namsan-funwalk-notice-hidden-date',
    startsAt: '2026-06-17T10:00:00+09:00',
    matches: () =>
      location.pathname === '/funwalk/' ||
      location.pathname === '/funwalk/index.html',
  },
];

let previousFocus = null;

export function initHomeNoticePopup() {
  const config = POPUP_CONFIGS.find(item => item.matches());
  if (!config || !isAfterStartTime(config) || isHiddenToday(config.storageKey)) {
    return;
  }

  const template = document.getElementById(config.templateId);
  if (!(template instanceof HTMLTemplateElement)) return;

  const fragment = template.content.cloneNode(true);
  const popup = fragment.querySelector(POPUP_SELECTOR);
  if (!popup) return;

  document.body.append(fragment);

  const mountedPopup = document.querySelector(POPUP_SELECTOR);
  if (!mountedPopup) return;

  bindPopup(mountedPopup, config.storageKey);
  openPopup(mountedPopup);
}

function bindPopup(popup, storageKey) {
  const panel = popup.querySelector('.home-notice-popup__panel');

  popup.querySelectorAll(CLOSE_SELECTOR).forEach(button => {
    button.addEventListener('click', () => closePopup(popup, storageKey));
  });

  popup.addEventListener('click', event => {
    if (panel && !panel.contains(event.target)) closePopup(popup, storageKey);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && popup.dataset.open === 'true') {
      closePopup(popup, storageKey);
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

function closePopup(popup, storageKey) {
  const hideToday = popup.querySelector(HIDE_TODAY_SELECTOR);
  if (hideToday instanceof HTMLInputElement && hideToday.checked) {
    saveHiddenToday(storageKey);
  }

  popup.dataset.open = 'false';
  popup.setAttribute('aria-hidden', 'true');

  window.setTimeout(() => {
    popup.remove();
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }, 160);
}

function isHiddenToday(storageKey) {
  try {
    return window.localStorage.getItem(storageKey) === getTodayKey();
  } catch {
    return false;
  }
}

function isAfterStartTime(config) {
  if (!config.startsAt) return true;

  const startsAtTime = Date.parse(config.startsAt);
  return Number.isFinite(startsAtTime) && Date.now() >= startsAtTime;
}

function saveHiddenToday(storageKey) {
  try {
    window.localStorage.setItem(storageKey, getTodayKey());
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
