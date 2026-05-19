// docs/design-system/ds-catalog.js
// <ds-catalog> — sidebar + main canvas + URL hash routing.
// 모든 story 페이지는 stories/<id>.html. 카탈로그는 빌드 없이 정적 서버에서 작동.

const STORIES = [
  { group: 'Foundations', items: [
    { id: 'tokens',      label: 'Tokens (color/type/space)' },
  ]},
  { group: 'Components', items: [
    { id: 'button',      label: 'Buttons' },
    { id: 'card',        label: 'Cards' },
    { id: 'header',      label: 'Site Header' },
    { id: 'footer',      label: 'Site Footer' },
    { id: 'page-hero',   label: 'Page Hero' },
    { id: 'dark-section', label: 'Dark Section (nocturnal mood)' },
    { id: 'image-slot',  label: 'Image Slot (?spec=1)' },
  ]},
];

class DsCatalog extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <aside class="ds-sidebar">
        <div class="ds-sidebar__brand">
          <div class="ds-sidebar__brand-dot" aria-hidden="true"></div>
          <div>
            <div class="ds-sidebar__brand-name">Namsan Green Summer</div>
            <span class="ds-sidebar__brand-sub">Design System</span>
          </div>
        </div>
        ${STORIES.map(group => `
          <nav class="ds-sidebar__group" aria-label="${group.group}">
            <div class="ds-sidebar__group-title">${group.group}</div>
            <ul class="ds-sidebar__list">
              ${group.items.map(s => `
                <li>
                  <a class="ds-sidebar__link" href="#${s.id}" data-story="${s.id}">${s.label}</a>
                </li>
              `).join('')}
            </ul>
          </nav>
        `).join('')}
        <div class="ds-sidebar__footer">
          drift-safe catalog · no build<br>
          tokens read from <a href="../../DESIGN.md" target="_blank" rel="noopener">DESIGN.md</a>
        </div>
      </aside>
      <section class="ds-main">
        <header class="ds-toolbar" role="toolbar">
          <div>
            <div class="ds-toolbar__title" data-toolbar-title>Select a story</div>
            <div class="ds-toolbar__meta" data-toolbar-meta></div>
          </div>
          <div class="ds-toolbar__spacer"></div>
          <div class="ds-toolbar__viewports" role="group" aria-label="Viewport">
            <button class="ds-toolbar__vp" type="button" data-vp="mobile"  aria-pressed="false">Mobile 390</button>
            <button class="ds-toolbar__vp" type="button" data-vp="tablet"  aria-pressed="false">Tablet 768</button>
            <button class="ds-toolbar__vp" type="button" data-vp="desktop" aria-pressed="true">Desktop 1280</button>
          </div>
          <a class="ds-toolbar__open" data-open-tab href="#" target="_blank" rel="noopener">Open ↗</a>
        </header>
        <ds-canvas data-viewport="desktop"></ds-canvas>
      </section>
    `;

    this.canvas = this.querySelector('ds-canvas');
    this.titleEl = this.querySelector('[data-toolbar-title]');
    this.metaEl = this.querySelector('[data-toolbar-meta]');
    this.openTab = this.querySelector('[data-open-tab]');

    this.querySelectorAll('.ds-toolbar__vp').forEach(btn => {
      btn.addEventListener('click', () => this.setViewport(btn.dataset.vp));
    });

    window.addEventListener('hashchange', () => this.routeFromHash());
    this.routeFromHash();
  }

  routeFromHash() {
    const id = (location.hash || '').replace(/^#/, '') || STORIES[0].items[0].id;
    const item = STORIES.flatMap(g => g.items).find(s => s.id === id);
    if (!item) {
      this.titleEl.textContent = 'Unknown story';
      this.metaEl.textContent = id;
      this.canvas.removeAttribute('src');
      return;
    }
    this.titleEl.textContent = item.label;
    this.metaEl.textContent = `stories/${item.id}.html`;
    this.canvas.setAttribute('src', `stories/${item.id}.html`);
    this.openTab.href = `stories/${item.id}.html`;
    this.querySelectorAll('.ds-sidebar__link').forEach(a => {
      a.toggleAttribute('aria-current', a.dataset.story === item.id);
      if (a.dataset.story === item.id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  setViewport(vp) {
    this.canvas.setAttribute('data-viewport', vp);
    this.querySelectorAll('.ds-toolbar__vp').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.vp === vp));
    });
  }
}

customElements.define('ds-catalog', DsCatalog);
