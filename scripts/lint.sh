#!/usr/bin/env bash
# 본 프로젝트의 lint 통합 entrypoint.
# 의존성 0 원칙을 유지하기 위해 npx --yes로 일회성 실행 — package.json 없음.
# 각 도구 버전은 본 파일에서 핀(이 파일이 single source of truth).
#
# 사용법:
#   ./scripts/lint.sh              # 전체 검사
#   ./scripts/lint.sh css          # stylelint만
#   ./scripts/lint.sh js           # eslint만
#   ./scripts/lint.sh html         # htmlhint만
#   ./scripts/lint.sh design       # @google/design.md만
#   ./scripts/lint.sh tokens       # 색상 토큰 SSOT grep 체크만

set -euo pipefail
cd "$(dirname "$0")/.."

STYLELINT_VERSION="17"
ESLINT_VERSION="9"
HTMLHINT_VERSION="1"

run_css() {
  echo "→ stylelint (css/**/*.css)"
  npx --yes "stylelint@${STYLELINT_VERSION}" "css/**/*.css"
}

run_js() {
  echo "→ eslint (js/**/*.js)"
  npx --yes "eslint@${ESLINT_VERSION}" "js/**/*.js"
}

run_html() {
  echo "→ htmlhint (index.html + 404.html + pages/*.html)"
  npx --yes "htmlhint@${HTMLHINT_VERSION}" index.html 404.html "pages/**/*.html"
}

run_design() {
  echo "→ @google/design.md lint DESIGN.md"
  npx --yes @google/design.md lint DESIGN.md
}

run_tokens() {
  # 색상 SSOT 강제: tokens.css 외에는 hex 색상 직접 사용 금지.
  # (rgba()는 alpha 변형용으로 일부 허용 — DESIGN.md "Alpha-tinted utilities" 참조.
  #  rgba 또한 토큰화 권장 대상이지만 현재 컴포넌트가 다수 사용 중이라 본 check는 hex만 검출.)
  echo "→ tokens SSOT: tokens.css 외 hex 색상 사용 검사"
  local hits
  hits=$(grep -rnE "#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?\b" css \
    --include="*.css" \
    --exclude="tokens.css" \
    --exclude="reset.css" \
    | grep -vE "(--card-media-|svg|<path|background-color: ?#fff)" \
    || true)
  if [ -n "$hits" ]; then
    echo ""
    echo "FAIL: tokens.css 외 hex 색상 발견 — DESIGN.md → tokens.css → 컴포넌트 순서 위반"
    echo "$hits"
    return 1
  fi
}

target="${1:-all}"

case "$target" in
  css)     run_css ;;
  js)      run_js ;;
  html)    run_html ;;
  design)  run_design ;;
  tokens)  run_tokens ;;
  all)
    run_css
    run_js
    run_html
    run_design
    run_tokens
    echo ""
    echo "✓ all lint checks passed"
    ;;
  *)
    echo "usage: $0 [all|css|js|html|design|tokens]" >&2
    exit 2
    ;;
esac
