// ESLint 9 flat config (eslint.config.mjs).
// 본 프로젝트는 npm 의존성 0 원칙을 위해 외부 plugin / globals 패키지를 사용하지 않고,
// browser global을 수동 열거 + 핵심 안전 룰은 built-in `no-restricted-syntax`로 강제한다.
// 실행: npx --yes eslint@9 "js/**/*.js"

export default [
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // DOM + BOM
        window: 'readonly',
        document: 'readonly',
        location: 'readonly',
        navigator: 'readonly',
        history: 'readonly',
        console: 'readonly',
        getComputedStyle: 'readonly',
        // Network
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        // DOM types referenced via instanceof / extends
        HTMLElement: 'readonly',
        HTMLDetailsElement: 'readonly',
        Element: 'readonly',
        Node: 'readonly',
        DocumentFragment: 'readonly',
        // Observers + control
        IntersectionObserver: 'readonly',
        ResizeObserver: 'readonly',
        MutationObserver: 'readonly',
        AbortController: 'readonly',
        AbortSignal: 'readonly',
        // Animation frame
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        // Web Components
        customElements: 'readonly',
        // Standard library
        Promise: 'readonly',
        Map: 'readonly',
        Set: 'readonly',
        WeakMap: 'readonly',
        WeakSet: 'readonly',
        Number: 'readonly',
        String: 'readonly',
        Array: 'readonly',
        Boolean: 'readonly',
        Object: 'readonly',
        Math: 'readonly',
        JSON: 'readonly',
        Error: 'readonly',
        TypeError: 'readonly',
        RangeError: 'readonly',
        Infinity: 'readonly',
        // External SDK injected globals
        kakao: 'readonly',
      },
    },
    rules: {
      // === README §3 JS 규약 강제 ===

      // 전역 변수 금지 (전역 누수 검출)
      'no-implicit-globals': 'error',
      'no-var': 'error',

      // 미사용 변수 / import (특별 예외: _prefix 변수 허용)
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // 정의되지 않은 식별자 — globals에 등록되지 않은 사용 차단
      'no-undef': 'error',

      // === XSS 방지: innerHTML/outerHTML/document.write 금지 ===
      // (위 패턴들은 textContent + <template> + cloneNode으로 대체 — CLAUDE.md 룰)
      // 단 customElement 자체 마운트에서 rewriteAbsolutePaths()된 partial을 inject할 때만 의도적 허용.
      'no-restricted-syntax': [
        'error',
        {
          selector: "AssignmentExpression[left.property.name='innerHTML'][right.type!='CallExpression']",
          message: 'innerHTML에 raw 문자열 대입 금지 — textContent 또는 <template>+cloneNode 사용 (XSS). 함수 호출 결과(rewriteAbsolutePaths 등)는 예외.',
        },
        {
          selector: "AssignmentExpression[left.property.name='outerHTML']",
          message: 'outerHTML 사용 금지 — 동적 마크업은 <template>+cloneNode 사용 (XSS).',
        },
        {
          selector: "CallExpression[callee.object.name='document'][callee.property.name='write']",
          message: 'document.write 사용 금지 — DOM API 사용.',
        },
        {
          selector: "NewExpression[callee.name='Function']",
          message: 'new Function() 사용 금지 — eval 등가 위험.',
        },
      ],

      // === 일반 안전성 ===
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-with': 'error',
      'no-console': 'off', // 모듈들이 의도적으로 console.error/warn 사용
      'no-debugger': 'error',
      'no-unreachable': 'error',
      'no-constant-condition': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-prototype-builtins': 'off',

      // === ES Module 안전성 ===
      'no-duplicate-imports': 'error',
    },
  },
  {
    // ESLint 자체 config는 제외
    ignores: ['node_modules/**', '.omc/**', '_ref/**', 'docs/design-system/**'],
  },
];
