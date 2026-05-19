// docs/design-system/ds-canvas.js
// <ds-canvas data-viewport="mobile|tablet|desktop" src="...">
// 카탈로그 메인 캔버스. iframe을 격리된 viewport box 안에 띄움.

class DsCanvas extends HTMLElement {
  static get observedAttributes() { return ['src', 'data-viewport']; }

  connectedCallback() {
    if (!this.firstChild) this.render();
  }

  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === 'src')           this.updateSrc();
    if (name === 'data-viewport') this.updateViewport();
  }

  render() {
    this.innerHTML = `
      <div class="ds-canvas__inner" data-viewport="${this.dataset.viewport || 'desktop'}">
        <iframe class="ds-canvas__frame" data-frame title="Component story preview"></iframe>
      </div>
    `;
    this.updateSrc();
  }

  updateSrc() {
    const frame = this.querySelector('[data-frame]');
    if (!frame) return;
    const src = this.getAttribute('src');
    if (src) frame.src = src;
    else     frame.removeAttribute('src');
  }

  updateViewport() {
    const inner = this.querySelector('.ds-canvas__inner');
    if (!inner) return;
    inner.dataset.viewport = this.dataset.viewport || 'desktop';
  }
}

customElements.define('ds-canvas', DsCanvas);
