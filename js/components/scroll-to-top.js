const SCROLL_THRESHOLD = 300;

export function initScrollToTop() {
  if (document.querySelector('[data-scroll-to-top]')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'scroll-to-top';
  button.dataset.scrollToTop = '';
  button.setAttribute('aria-label', '페이지 상단으로 이동');
  button.textContent = 'TOP';

  const syncVisibility = () => {
    button.classList.toggle('is-visible', window.scrollY >= SCROLL_THRESHOLD);
  };

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', syncVisibility, { passive: true });

  document.body.append(button);
  syncVisibility();
}
