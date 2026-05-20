// docs/design-system/ds-tokens.js
// <ds-tokens> — DESIGN.md / tokens.css fetch + 자동 컬러/타이포/spacing 렌더.
// 토큰 정의가 바뀌면 카탈로그가 자동 동기화 (drift 방지).
// stories/tokens.html에서만 사용.

const TOKENS_CSS_URL = new URL('../../../css/tokens.css', import.meta.url).href;

class DsTokens extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `<p class="ds-tokens__status" role="status">Loading tokens…</p>`;
    try {
      const css = await fetch(TOKENS_CSS_URL).then(r => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.text();
      });
      const tokens = parseTokens(css);
      const computed = getComputedStyle(document.documentElement);
      this.render(tokens, computed);
    } catch (err) {
      this.innerHTML = `<p class="ds-tokens__status ds-tokens__status--error">
        Failed to load tokens.css: ${escapeHtml(String(err.message || err))}
      </p>`;
    }
  }

  render(tokens, computed) {
    const groups = {
      'Brand accents (decorative)':       tokens.colors.filter(t => /^--color-(primary|secondary|tertiary)$/.test(t.name)),
      'Light surface stack':              tokens.colors.filter(t => /^--color-(neutral|surface|surface-alt)$/.test(t.name)),
      'On-light text tiers':              tokens.colors.filter(t => /^--color-on-surface(-body|-muted)?$/.test(t.name)),
      'Darker text variants (on light)':  tokens.colors.filter(t => /^--color-(primary|secondary|tertiary)-text$/.test(t.name)),
      'Dark surface stack (sections)':    tokens.colors.filter(t => /^--color-dark-surface(-2)?$/.test(t.name)),
      'On-dark text tiers':               tokens.colors.filter(t => /^--color-on-dark(-body)?$/.test(t.name)),
      'External brand colors':            tokens.colors.filter(t => /^--color-brand-/.test(t.name)),
      'Deprecated aliases (mig pending)': tokens.colors.filter(t => /^--color-(bg|bg-elevated|bg-overlay|neon|neon-soft|pink|blue|white|text|text-muted|border)$/.test(t.name)),
    };

    this.innerHTML = `
      <section class="ds-tokens__section">
        <h2>Colors</h2>
        ${Object.entries(groups).map(([title, items]) => items.length ? `
          <h3>${escapeHtml(title)}</h3>
          <div class="ds-tokens__palette">
            ${items.map(t => swatchHtml(t, computed)).join('')}
          </div>
        ` : '').join('')}
      </section>

      <section class="ds-tokens__section">
        <h2>Typography (font-size scale)</h2>
        <table class="ds-tokens__table">
          <thead><tr><th>Token</th><th>Value</th><th>Preview</th></tr></thead>
          <tbody>
            ${tokens.fontSize.map(t => `
              <tr>
                <td><code>${escapeHtml(t.name)}</code></td>
                <td><code>${escapeHtml(t.value)}</code></td>
                <td style="font-size: ${t.value};">남산 서머 Aa 123</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>

      <section class="ds-tokens__section">
        <h2>Spacing scale</h2>
        <div class="ds-tokens__spacing">
          ${tokens.space.map(t => `
            <div class="ds-tokens__space-row">
              <code>${escapeHtml(t.name)}</code>
              <code>${escapeHtml(t.value)}</code>
              <div class="ds-tokens__space-bar" style="width: ${t.value};"></div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="ds-tokens__section">
        <h2>Radii</h2>
        <div class="ds-tokens__radii">
          ${tokens.radius.map(t => `
            <div class="ds-tokens__radius-tile">
              <div class="ds-tokens__radius-shape" style="border-radius: ${t.value};"></div>
              <code>${escapeHtml(t.name)}</code>
              <code class="ds-muted">${escapeHtml(t.value)}</code>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="ds-tokens__section">
        <h2>Shadows</h2>
        <div class="ds-tokens__shadows">
          ${tokens.shadow.map(t => `
            <div class="ds-tokens__shadow-tile">
              <div class="ds-tokens__shadow-shape" style="box-shadow: ${t.value};"></div>
              <code>${escapeHtml(t.name)}</code>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }
}

customElements.define('ds-tokens', DsTokens);

// ============================================
// CSS variable extraction (no YAML parsing needed —
// tokens.css is the source-of-truth runtime surface)
// ============================================

function parseTokens(css) {
  const colors = [];
  const fontSize = [];
  const space = [];
  const radius = [];
  const shadow = [];

  // Match `  --name: value;`  (single line)
  for (const m of css.matchAll(/^\s*(--[\w-]+)\s*:\s*([^;]+);/gm)) {
    const name = m[1].trim();
    const value = m[2].trim();
    if (/^--color-/.test(name))   colors.push({ name, value });
    else if (/^--fs-/.test(name))    fontSize.push({ name, value });
    else if (/^--space-/.test(name)) space.push({ name, value });
    else if (/^--radius-/.test(name)) radius.push({ name, value });
    else if (/^--shadow-/.test(name)) shadow.push({ name, value });
  }
  return { colors, fontSize, space, radius, shadow };
}

function swatchHtml(t, computed) {
  // resolve var() references to actual color for swatch display
  const resolved = computed.getPropertyValue(t.name).trim() || t.value;
  const isAlias = /^var\(/.test(t.value);
  return `
    <div class="ds-tokens__swatch">
      <div class="ds-tokens__swatch-color" style="background: ${resolved};"></div>
      <div class="ds-tokens__swatch-meta">
        <code class="ds-tokens__swatch-name">${escapeHtml(t.name)}</code>
        <code class="ds-tokens__swatch-value">${escapeHtml(resolved)}</code>
        ${isAlias ? `<code class="ds-tokens__swatch-alias">→ ${escapeHtml(t.value)}</code>` : ''}
      </div>
    </div>
  `;
}

function escapeHtml(s) {
  return String(s).replace(/[<>&"]/g, c => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;',
  }[c]));
}
