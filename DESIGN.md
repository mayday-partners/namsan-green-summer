---
version: alpha
name: 2026 남산 서머 페스티벌
description: >-
  Festival site for the 2026 Namsan Summer Festival (2026-06-27 SAT, 남산공원).
  Block-cut poster aesthetic — heavy Pretendard 950, a single Neon Green motif
  on a white paper baseline, a skewed brand mark, and concentric radial decor.
  No dark mode. Korean-first content with brief English typographic accents
  (section labels, badges) all set in Pretendard.
colors:
  # Foundation — white paper + single neon + black inlay
  ink:          "#0b0d0c"   # Primary text on light surfaces
  muted:        "#6c7370"   # Caption, metadata, helper, sponsor labels
  line:         "#e5e8e6"   # Hairline divider (used as borderColor on cards)
  paper:        "#ffffff"   # Page background, cards, scrolled header
  soft:         "#f5fbf7"   # Zone alternation (sub-hero, info-panel, community-block)
  primary:      "#39ff14"   # Neon Green — single brand accent (CTA hover, brand inlay, focus)
  neon-deep:    "#22c40f"   # Active text state of brand (gnb-link-active)
  black:        "#080808"   # Brand-mark surface, footer, primary CTA base
  # Program callouts — narrowly scoped, document the single allowed usage
  reserve-local:  "#ffbd00"   # Fun&Walk 내국인 신청 (reserve-button-local only)
  reserve-global: "#05b957"   # Fun&Walk 외국인 신청 (reserve-button-global only)
  lineup-base:    "#066d3a"   # Summer Night lineup-card strong bg (normal artist) — darkened from #078c4f for AA 6.5:1 on paper
  lineup-live:    "#ffb400"   # Summer Night lineup-card.live highlight + heading underline
  map-garden:     "#1ecb3b"   # Festival-map pin-garden bg only
  map-course:     "#1c7dff"   # Fun&Walk course-map route border only
  map-finish:     "#c00404"   # Fun&Walk course-label background only — darkened from #f20505 for AA 6.4:1 on paper
  garden-route:   "#006f4a"   # Summer Garden docent route line only — visual sibling of lineup-base
  lineup-card-bg: "#f7f1e7"   # Summer Night lineup card base bg (warm beige paper variant)
  experience-deep: "#273027"  # Summer Night experience card gradient end (deeper-than-black warm)
typography:
  display-xl:
    fontFamily: Pretendard
    fontSize: 7rem
    fontWeight: 950
    lineHeight: 0.86
    letterSpacing: 0em
  display-lg:
    fontFamily: Pretendard
    fontSize: 4.5rem
    fontWeight: 950
    lineHeight: 0.9
    letterSpacing: 0em
  display-md:
    fontFamily: Pretendard
    fontSize: 3rem
    fontWeight: 950
    lineHeight: 1.0
    letterSpacing: 0em
  headline-lg:
    fontFamily: Pretendard
    fontSize: 2.25rem
    fontWeight: 950
    lineHeight: 1.1
    letterSpacing: 0em
  headline-md:
    fontFamily: Pretendard
    fontSize: 1.625rem
    fontWeight: 900
    lineHeight: 1.18
    letterSpacing: 0em
  headline-sm:
    fontFamily: Pretendard
    fontSize: 1.25rem
    fontWeight: 900
    lineHeight: 1.3
    letterSpacing: 0em
  body-md:
    fontFamily: Pretendard
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.7
    letterSpacing: 0em
  body-sm:
    fontFamily: Pretendard
    fontSize: 0.875rem
    fontWeight: 750
    lineHeight: 1.55
    letterSpacing: 0em
  label-en:
    fontFamily: Pretendard
    fontSize: 0.8125rem
    fontWeight: 950
    lineHeight: 1.0
    letterSpacing: 0.06em
  badge-en:
    fontFamily: Pretendard
    fontSize: 0.75rem
    fontWeight: 950
    lineHeight: 1.0
    letterSpacing: 0.08em
spacing:
  xs:   0.25rem    # 4px  — inline micro gap
  sm:   0.5rem     # 8px  — list inner gap, badge inset
  md:   0.75rem    # 12px — small padding, button gap
  lg:   1rem       # 16px — base rhythm, list gap
  xl:   1.5rem     # 24px — card body, info-panel field gap
  2xl:  2rem       # 32px — section header gap, notice-guide-item padding
  3xl:  2.5rem     # 40px — overview-card padding mobile, info-panel padding
  4xl:  3.5rem     # 56px — overview-card padding tablet
  5xl:  4.5rem     # 72px — overview-card padding desktop, sub-hero padding
  6xl:  6.5rem     # 104px — wire-section padding desktop
rounded:
  none:  0px
  xs:    8px       # course-label, dev badges
  sm:    12px      # map-pin, reserve-button
  md:    16px      # notice-guide-item, seat-guide, experience-item, notice-panel
  lg:    20px      # info-panel, program-detail, community-block, all *-map
  xl:    24px      # overview-card, lineup-card
  full:  999px     # pill CTAs, tabs, kickers, notice-badge
sizes:
  brand-mark-w:       42px   # NS skewed inlay box width (desktop)
  brand-mark-h:       28px   # NS skewed inlay box height
  menu-icon:          72px   # hamburger button width (matches header right grid col)
  header-h:           66px   # site-header total height (desktop)
  header-h-mobile:    60px   # site-header total height (≤ 620px)
  cta-min-h:          48px   # primary-action / secondary-action min-height
  cta-min-h-small:    40px   # .primary-action.small variant min-height
  cta-min-w:          250px  # primary-action / secondary-action min-width
  program-number:     42px   # circular badge in program-detail (01/02/03)
  reserve-btn-h:      76px   # Fun&Walk reserve-button tall card
  sub-visual-h-min:   300px  # sub-page hero image min height (clamp lower)
  sub-visual-h-max:   430px  # sub-page hero image max height (clamp upper)
  container-max:      980px  # global content column width
components:
  site-header:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: 66px
  brand-mark:
    backgroundColor: "{colors.black}"
    textColor: "{colors.primary}"
  gnb-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: 0px
  gnb-link-active:
    backgroundColor: "transparent"
    textColor: "{colors.neon-deep}"
    padding: 0px
  submenu:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: 10px
  submenu-item-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
  poster-hero:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  sub-visual:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
  sub-hero:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    padding: 72px
  overview-section:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: 72px
  overview-tabs-item:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: 22px
  overview-tabs-item-active:
    backgroundColor: "{colors.black}"
    textColor: "{colors.paper}"
    rounded: "{rounded.full}"
    padding: 22px
  overview-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 56px
  primary-action:
    backgroundColor: "{colors.black}"
    textColor: "{colors.paper}"
    rounded: "{rounded.full}"
    padding: 24px
    typography: "{typography.body-sm}"
  primary-action-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.black}"
    rounded: "{rounded.full}"
    padding: 24px
    typography: "{typography.body-sm}"
  secondary-action:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: 24px
    typography: "{typography.body-sm}"
  secondary-action-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: 24px
    typography: "{typography.body-sm}"
  info-panel:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 32px
  info-panel-alt:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 32px
  program-info-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: 14px
  program-info-label:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.headline-sm}"
  program-detail:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 38px
  program-number:
    backgroundColor: "{colors.black}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    size: 42px
    typography: "{typography.headline-md}"
  notice-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: 20px
  notice-badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.black}"
    rounded: "{rounded.none}"
    padding: 8px
    typography: "{typography.badge-en}"
  notice-meta:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
  notice-panel:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 30px
  notice-guide-item:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 32px
  notice-guide-item-alt:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 32px
  community-block:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 38px
  community-block-kicker:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.black}"
    rounded: "{rounded.full}"
    padding: 12px
    typography: "{typography.label-en}"
  community-placeholder:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: 26px
  reserve-button-local:
    backgroundColor: "{colors.reserve-local}"
    textColor: "{colors.black}"
    rounded: "{rounded.sm}"
    padding: 20px
    typography: "{typography.headline-sm}"
  reserve-button-global:
    backgroundColor: "{colors.reserve-global}"
    textColor: "{colors.black}"
    rounded: "{rounded.sm}"
    padding: 20px
    typography: "{typography.headline-sm}"
  lineup-card:
    backgroundColor: "{colors.lineup-card-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 22px
  lineup-card-strong:
    backgroundColor: "{colors.lineup-base}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: 16px
  lineup-card-live-strong:
    backgroundColor: "{colors.black}"
    textColor: "{colors.lineup-live}"
    rounded: "{rounded.none}"
    padding: 16px
  lineup-heading-underline:
    backgroundColor: "transparent"
    textColor: "{colors.lineup-live}"
    typography: "{typography.display-md}"
  seat-guide:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: 24px
  experience-item:
    backgroundColor: "{colors.experience-deep}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: 18px
  festival-map:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  map-pin:
    backgroundColor: "{colors.black}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: 12px
  map-pin-fun:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.black}"
    rounded: "{rounded.sm}"
    padding: 12px
  map-pin-garden:
    backgroundColor: "{colors.map-garden}"
    textColor: "{colors.black}"
    rounded: "{rounded.sm}"
    padding: 12px
  course-map:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  course-label:
    backgroundColor: "{colors.map-finish}"
    textColor: "{colors.paper}"
    rounded: "{rounded.xs}"
    padding: 12px
    typography: "{typography.badge-en}"
  course-route:
    backgroundColor: "{colors.map-course}"
    textColor: "transparent"
  garden-map:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  garden-zone:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.black}"
    rounded: "{rounded.full}"
    padding: 10px
    typography: "{typography.badge-en}"
  garden-route:
    backgroundColor: "{colors.garden-route}"
    textColor: "{colors.paper}"
  sponsor-tile:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    padding: 14px
  divider:
    backgroundColor: "{colors.line}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: 0px
  footer:
    backgroundColor: "{colors.black}"
    textColor: "{colors.paper}"
    padding: 42px
  skip-link:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.black}"
    rounded: "{rounded.xs}"
    padding: 12px
    typography: "{typography.label-en}"
  section-label:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.label-en}"
---

# 2026 Namsan Summer Festival — Visual Identity

> Single-weekend festival site (event: **2026-06-27 SAT**, 남산공원). Korean-first content. The visual identity follows a **block-cut poster aesthetic** — heavy Pretendard 950, a single neon green motif on white paper, a skewed brand mark, and concentric radial decoration. There is no dark mode.

## Overview

The brand is **white paper + one neon + heavy block type**. There is no full-page dark theme — black appears only as the brand-mark inlay (`brand-mark`), the footer surface, the primary-action resting state, and a few inside-the-card containers (`seat-guide`, `experience-item`). Neon Green (`#39ff14`) is the single accent: brand-mark text fill, primary-CTA hover swap, notice badge fill, focus ring, festival-map fun pin, and garden zone tags. Body text is **never** set in raw neon on light surfaces (fails contrast at 1.4:1) — the active/text variant of the brand is `neon-deep` (#22c40f), used only for `gnb-link-active` and a few targeted accents.

- **Density** — editorial. The canonical content column is **980 px** (`container-max`) centered on the viewport. Sections breathe with `padding-block: clamp(72px, 8vw, 108px)` on home and ~72px on sub-page heroes; overview-card padding clamps from 28 px (mobile) up to 56 px (desktop).
- **Voice** — festival broadsheet. Pretendard carries every role at varied weights: 950 for display, 900 for headlines, 750 for body emphasis, 600 for plain body. English labels use the same family with widened tracking (0.06–0.08 em) to read as a "label," not body.
- **Motion** — minimal. `transition: opacity .16s ease, transform .16s ease` on submenu reveal; `transform: translateY(-4px)` lift on `.preview-card:hover`; no scroll-in animation. The 200 ms baseline keeps the page feeling printed rather than animated.
- **Non-goals** — no dark mode, no glassmorphism on content surfaces (only on scrolled header), no condensed display face (no Anton, no Montserrat), no per-program chrome color (Fun&Walk / Summer Night / Summer Garden share the neon identity).

## Colors

A **single neon accent on white paper** with a black brand inlay and a narrow set of program callout colors for reservation buttons, the Summer Night lineup, and CSS-only map decorations.

### Foundation

- **Ink (#0b0d0c)** Primary text — headlines, body, list items. AA passes on `paper` (16:1) and `soft` (15:1).
- **Muted (#6c7370)** Caption, metadata, helper copy, sponsor labels. AA on `paper` (5.1:1).
- **Line (#e5e8e6)** Hairline divider — used as the `borderColor` of cards (overview-card, info-panel, sponsor-tile) and as row dividers on notice / dl rows. Documented as a `colors:` entry because it is a recurring branded fixture; in `tokens.css` it surfaces as `--color-line`.
- **Paper (#ffffff)** Page background, card surfaces, scrolled header backdrop, sponsor tile.
- **Soft (#f5fbf7)** Zone alternation — `sub-visual`, `sub-hero`, `info-panel`, `community-block`, all `*-map` decorative surfaces, `community-placeholder`, `notice-panel`, `notice-guide-item-alt`.
- **Neon (#39ff14)** The single brand accent. Used as background on the brand-mark inlay (`brand-mark`), the primary-CTA hover state, the secondary-CTA hover state, the `notice-badge`, festival-map `pin-fun`, garden `garden-zone` tags, submenu hover, and the skip-link surface. Always paired with `black` or `ink` text (16:1 AAA).
- **Neon-deep (#22c40f)** The text/active variant of the brand. Used **only** for `gnb-link-active` color and as a hard text-shadow color on display-xl headlines (`--shadow-text-hard`). Passes AA on `paper` (4.6:1).
- **Black (#080808)** Brand-mark surface, footer background, `primary-action` resting bg, `seat-guide`/`experience-item` surface, `map-pin` resting bg.

### Program callouts

These break the white-paper rule deliberately — each callout has a documented, narrowly scoped function and is not reused elsewhere.

- **Reserve-local (#ffbd00)** Fun&Walk 내국인 신청 button only. Paired with `black` text (AAA 11.9:1).
- **Reserve-global (#05b957)** Fun&Walk 외국인 신청 button only. Paired with `black` text (AA 6.0:1) — the visual reads as a green CTA while remaining a11y-compliant. The original source design pairs this with white (`#fff`, 2.4:1, fails AA); we override to `black` text to preserve a11y.
- **Lineup-base (#078c4f)** Summer Night `lineup-card strong` (normal artist label) background. Paired with `paper` text (5.4:1 AA).
- **Lineup-live (#ffb400)** Summer Night `lineup-card.live` highlight + `lineup-heading` underline color. Paired with `black` text (12.2:1 AAA).
- **Map-garden (#1ecb3b)** Festival-map `pin-garden` background only. Paired with `black` text — overrides the source design's `#fff` (1.7:1, fails AA) for a11y.
- **Map-course (#1c7dff)** Fun&Walk `course-map` route border decoration only. Never used with text.
- **Map-finish (#f20505)** Fun&Walk `course-label` background only. Paired with `paper` text (5.9:1 AA).

### Alpha-tinted utilities (CSS only, not tokens)

These derive from base colors. They live in `tokens.css` as `--color-*-soft` or named alpha variables, not as standalone Color tokens, because the alpha layer is presentational.

- **`--color-neon-soft`** `rgba(57, 255, 20, 0.18)` — focus ring fills, neon halos.
- **`--color-overlay-paper`** `rgba(255, 255, 255, 0.96)` — scrolled header backdrop (`backdrop-filter: blur(16px)`).
- **`--color-border-soft`** `rgba(0, 0, 0, 0.08)` — overview-card / program-detail / notice-guide-item border at rest.
- **`--color-pattern-white-soft`** `rgba(255, 255, 255, 0.46)` — radial ring stroke on `--pattern-radial-light`.

### Radial pattern motif (CSS only, not a token)

Two decorative `radial-gradient` variants drawn from the festival keyvisual (concentric thin rings on neon):

- **`--pattern-radial-light`** — white rings on `neon`. Used as `position: absolute` decoration on light sections at `opacity: 0.34–0.38`.
- **`--pattern-radial-dark`** — neon rings on `black`. Used on hero-strip overlays and large band sections.

Apply via the `.radial-pattern--light` / `.radial-pattern--dark` utility on a `position: absolute` ancestor with `overflow: hidden`. Never as a primary content background.

## Typography

**Pretendard** is the only family. It carries Korean, English, numerals, and labels. The festival weight scale is unusually heavy — 950 for display, 900 for headlines, 750 for body emphasis, 600 for plain body. There is no condensed display face; the festival's posterly impact comes from `weight: 950` plus tight line-heights and the `--shadow-text-hard` poster shadow on `display-xl`.

### Roles

- **`display-xl`** (7rem / 950 / lh 0.86) — `wire-hero h1`, home hero strap.
- **`display-lg`** (4.5rem / 950 / lh 0.9) — `program-strip strong`, large band copy.
- **`display-md`** (3rem / 950 / lh 1.0) — `overview-card h2`, sub-page hero h1, section titles inside a card.
- **`headline-lg`** (2.25rem / 950 / lh 1.1) — sub-section title inside overview-card.
- **`headline-md`** (1.625rem / 900 / lh 1.18) — `info-panel h3`, `program-detail h3`, `notice-guide-item h3`, `program-number` digits.
- **`headline-sm`** (1.25rem / 900 / lh 1.3) — `community-placeholder strong`, `lineup-heading`, reserve-button label.
- **`body-md`** (1rem / 600 / lh 1.7) — body paragraphs.
- **`body-sm`** (0.875rem / 750 / lh 1.55) — list items, metadata, `dl` values, helper copy, notice-meta.
- **`label-en`** (0.8125rem / 950 / lh 1.0 / 0.06em tracking) — `section-label`, `block-kicker`, skip-link.
- **`badge-en`** (0.75rem / 950 / lh 1.0 / 0.08em tracking) — `notice-badge`, `course-label`, `garden-zone`.

### Family rules

- Korean and English share **Pretendard**. There is no Anton, no Montserrat, no Noto Sans KR substitution.
- English uppercase labels use `letterSpacing: 0.06em–0.08em` to read as a label; never apply tracking to Korean body copy.
- Body `letterSpacing` defaults to `0`. Korean tightens on its own at this weight scale.

## Layout

- **Container** — `width: min(980px, calc(100% - 40px))`, centered. The **980 px** column is the canonical content width across home and sub-pages.
- **Section rhythm** — `padding-block: clamp(72px, 8vw, 108px)` on home `wire-section`. Sub-page `sub-hero` and `overview-section` use 72 px desktop padding. `overview-card` clamps 28 → 56 px internal padding.
- **Breakpoints**
  - **`980px`** — header gnb wraps into a second row, `overview-layout` becomes single-column, `preview-grid`/`sponsor-grid` drop to one column.
  - **`620px`** — header becomes static (not sticky), gnb items become 50% wide tiles, footer becomes a vertical grid, sponsor-grid drops to 2 columns.
- **Site header** — sticky (`position: sticky; top: 0`), `min-height: 66px`, three-column grid `210px 1fr 72px` (brand / gnb / menu-icon). `backdrop-filter: blur(16px)` over `--color-overlay-paper` when scrolled.

## Elevation & Depth

Depth is **flat with hairlines**. The hierarchy reads in this order:

1. **Hairline borders** (`--color-line` or `--color-border-soft`) on cards, info panels, overview tabs at rest. No drop shadow on resting cards in the typical case.
2. **Soft drop shadow** (`--shadow-base: 0 20px 60px rgba(8, 8, 8, .10)`) on overview-card.
3. **Per-component shadows** for specific lift states:
   - `--shadow-card-lift` — `0 16px 44px rgba(0, 0, 0, .045)` on program-detail.
   - `--shadow-pin` — `0 14px 34px rgba(0, 0, 0, .18)` on map-pin.
   - `--shadow-reserve` — `0 16px 34px rgba(0, 0, 0, .12)` on reserve-button.
   - `--shadow-course-label` — `0 10px 24px rgba(0, 0, 0, .16)` on course-label.
4. **Hard text shadow** — `--shadow-text-hard: 4px 4px 0 var(--color-neon-deep)` on `display-xl` headlines only (poster impact). Reserved for `wire-hero h1`; do not apply elsewhere.

## Shapes

- **Pill** (`rounded.full`, 999 px) — all CTAs (`primary-action`, `secondary-action`), `overview-tabs-item`, `community-block-kicker`. Reads as "interactive."
- **Extra-large** (`rounded.xl`, 24 px) — `overview-card`, `lineup-card`.
- **Large** (`rounded.lg`, 20 px) — `info-panel`, `program-detail`, `community-block`, all `*-map` panels (festival-map, course-map, garden-map).
- **Medium** (`rounded.md`, 16 px) — `notice-guide-item`, `seat-guide`, `experience-item`, `community-placeholder`, `notice-panel`.
- **Small** (`rounded.sm`, 12 px) — `map-pin`, `reserve-button-local`/`-global`.
- **Extra-small** (`rounded.xs`, 8 px) — `course-label`, `skip-link`.
- **Skewed parallelogram** — the `brand-mark` uses `transform: skewX(-22deg)` (CSS only, not a shape token). The NS inlay reads as a poster block-cut.

## Sizes

Dimension primitives for component fixtures. Defined in the YAML `sizes:` block (spec extension — alpha lint recognises only `colors / typography / spacing / rounded` as primitive categories, so `sizes` keys are not cross-referenced from `components.*.size` and remain as raw px in those rules; the canonical mapping is enforced in `tokens.css` via `--size-*`).

- **`brand-mark-w` / `brand-mark-h`** (42 × 28 px desktop) — NS skewed inlay box. Drops to 36 × 24 px under 620 px.
- **`menu-icon`** (72 px) — hamburger button width (matches the site-header right grid column). The hit target is the full 72 × 66 column.
- **`header-h` / `header-h-mobile`** (66 / 60 px) — site-header total height.
- **`cta-min-h`** (48 px) — primary-action / secondary-action min-height. Above WCAG 2.2 SC 2.5.8 absolute minimum (24 px); near the 44 px recommendation when combined with horizontal padding.
- **`cta-min-h-small`** (40 px) — `.primary-action.small` variant for inline CTAs inside cards (program-detail button-row).
- **`cta-min-w`** (250 px) — primary-action / secondary-action min-width. Mobile breakpoint relaxes to `100%`.
- **`program-number`** (42 px) — circular badge in program-detail (01/02/03). `black` fill with `neon` digit.
- **`reserve-btn-h`** (76 px) — Fun&Walk reserve-button tall card. Large emphasis CTA.
- **`sub-visual-h-min` / `sub-visual-h-max`** (300 / 430 px) — sub-page hero image strip height via `clamp(300px, 30vw, 430px)`.
- **`container-max`** (980 px) — global content column width.

## Components

### Site header

Sticky three-column grid on desktop (`210px 1fr 72px`). Left column holds the brand (NS inlay + two-line title). Center column holds the gnb (five items, hover-reveal submenus). Right column holds the hamburger trigger. Submenu drops from the gnb-item with `opacity / transform` transition (no JS — pure CSS). On screens < 980 px the gnb wraps into a second row; submenu becomes static. On screens < 620 px the header becomes non-sticky and gnb items become 50%-wide tiles.

### Brand mark

A skewed parallelogram (`transform: skewX(-22deg)`) inlay carrying the "NS" letters in `neon` on a `black` background. 42 × 28 px desktop / 36 × 24 px mobile. Always appears with the two-line "2026 남산 / 서머 페스티벌" label to its right.

### Primary & secondary action

Both pill-shaped (`rounded.full`), `min-height: 48px`, `min-width: 250px`. Primary uses `black` bg with `paper` text; hover swaps to `neon` bg with `black` text. Secondary uses `paper` bg with `ink` text and a 1 px `black` border; hover swaps to `neon` bg with `ink` text. `.small` modifier drops min-width to 120 px and min-height to 40 px (for inline CTAs inside cards).

### Overview card

Sub-page primary content panel. `paper` bg, `rounded.xl` (24 px), padding `clamp(28px, 5vw, 56px)`, hairline `--color-border-soft`, `--shadow-base`. Lead paragraph (`.lead`) is `clamp(20px, 2.4vw, 28px)` at weight 950. Body paragraphs are `body-md`. Container for `info-panel`, `program-detail-list`, `notice-guide-list`, `community-block`, and per-program decorations.

### Overview tabs

Horizontal pill row of sub-page anchors. Resting: `paper` bg, 1 px `--color-border-soft`, `ink` text. Active or hover: `black` bg, `paper` text. Min-width 150 px / min-height 44 px each. Stacks vertically under 620 px.

### Info panel

Rectangular info block inside overview-card. First panel (`info-panel`) uses `soft` bg with hairline border. Subsequent panels (`info-panel + info-panel`) use `paper` bg. Both use `rounded.lg` (20 px) and `clamp(22px, 4vw, 32px)` padding. Contains an h3 (`headline-md`) and a `program-info-table` — a `<dl>` with a 150 px label column.

### Program info table (`<dl>`)

Inside info-panel. Each row is `<div>` wrapping `<dt>` + `<dd>` with a 150 px label column and `padding-block: 14px`, hairline `--color-border-soft` divider. `dt` uses `headline-sm`/muted color; `dd` uses `body-sm` ink.

### Program detail card

Used on `/info/programs.html` to render 01/02/03. `paper` bg, `rounded.lg`, padding 38 px. Odd-indexed cards receive a subtle neon-tinted gradient (`linear-gradient(135deg, var(--color-neon-soft), white 44%)`). Each card has a `program-number` (42 × 42 px circle, `black` bg / `neon` digit), an h3, a strong lead, optional conflict notice, a `<dl>` info table, and a `button-row`.

### Reserve button (Fun&Walk only)

Two large reservation buttons in a 2-column grid. Each is 76 px tall, padded 16 × 20 px, `rounded.sm`. `reserve-button.local` uses `reserve-local` (#ffbd00) with `black` text; `reserve-button.global` uses `reserve-global` (#05b957) with `black` text. Both carry `--shadow-reserve`. Stack vertically under 620 px.

### Festival map (info overview)

CSS-only decorative map showing three pins on a grid background. Three `.map-pin` spans absolutely positioned: `.pin-fun` (`map-pin-fun`, neon bg, black text), `.pin-night` (`map-pin`, black bg, paper text), `.pin-garden` (`map-pin-garden`, map-garden bg, black text). A decorative `.map-route` line in neon connects them. Decorative arcs (`::before`, `::after`) use rgba neon-deep / black variants.

### Course map (Fun&Walk)

Larger decorative map for the 6 km route. Grid-pattern background with concentric arc borders. `.course-path` is a 5 px `map-course` (blue) border. Five `.course-label` (map-finish red bg, paper text) markers: 시작점 / 호현당 / 북측순환로 / 남측순환로 / 종점. A `.course-caption` strip at the bottom narrates the route.

### Garden map (Summer Garden)

Five-zone decorative map for the docent tour. Soft green ellipse layers + concentric arcs. Five `.garden-zone` pills (neon bg, black text) for 남산마루 / 양지정원 / 이끼원 / 초승마당 / 무궁화원. A `.garden-route` line in `#006f4a`. Legend pill in the corner with translucent paper backdrop.

### Lineup card (Summer Night)

Three cards in a horizontal row (stack on mobile). Each card has a soft beige bg with a circular neon disc decoration. Card label uses `body-sm` muted; card title is a flat label in `lineup-base` (green) with `paper` text. `.lineup-card.live` reverses: title pill in `black` with `lineup-live` (yellow) text. The `lineup-heading` above the row is underlined in `lineup-live` (8 px text-decoration thickness).

### Seat guide (Summer Night)

Dark info card showing stage + free zone layout. `ink` (#0b0d0c) background, `paper` text. Stage label is a `neon` pill at the top spanning the card width. Six empty `<i>` elements render as faint seat markers in a 3-column grid. Free Zone label spans full width with a dashed `paper-on-ink` border.

### Experience grid (Summer Night)

Two-column dark cards showing five experience booths. Each `article` has a radial neon spot in the corner and a `black → #273027` gradient background. Title text in `neon`, body in muted paper. Stacks to single column under 620 px.

### Notice list

Used on home + community/index.html. Each row is a 3-column grid (`52px 1fr 110px`) with a neon `notice-badge` ("공지"), the title, and the date in `notice-meta` muted gray. Hairline `--color-line` divider between rows. Date column right-aligns on desktop, left-aligns under 620 px.

### Notice guide item

Vertical list of guide sections (예약 안내, 입장 안내, 관람 안내, etc.) inside a notice-guide-card. Each item is a `paper` rounded card with `clamp(22px, 3vw, 32px)` padding. Odd-indexed items receive a neon-tinted gradient via the `notice-guide-item-alt` modifier (handled by `:nth-child(odd)` in CSS).

### Community block

Used on `/community/refund.html`. A `soft`-backgrounded `rounded.lg` panel containing a `community-block-kicker` pill (neon bg, black text), an h3 program label, a description paragraph, and a `button-row` with primary + secondary CTAs.

### Skip link & focus ring

`.skip-link` is the first focusable element on every page. Visually hidden until focused. When focused: `neon` background with `black` text, fixed top-left, `z-index: 200`. Interactive elements receive `:focus-visible { outline: 2px solid var(--color-neon); outline-offset: 2px; }`.

### Footer

Two-column horizontal layout (`black` bg, `paper` text). Brand mark + label on the left, contact + copyright text on the right (muted to 62% paper). Becomes a vertical grid under 620 px.

### Sponsor tile / sponsor grid

Four-tile horizontal grid (placeholder labels — Sponsor / Partner / Supporter / Media). `paper` bg, `rounded.sm`, 1 px `--color-line`, muted text. Drops to 2 columns under 620 px.

## Do's and Don'ts

**Do**

- Use `neon` as a single signature motif: brand-mark inlay, CTA hover, notice badge, focus ring, festival-map fun pin, garden zone tags, skip-link.
- Pair every `neon` background with `black` or `ink` text (≥ 15:1 AAA).
- Use Pretendard 950 for display, 900 for headlines, 750 for body emphasis, 600 for plain body.
- Maintain WCAG AA: `ink` on `paper` (16:1 ✓), `ink` on `soft` (15:1 ✓), `muted` on `paper` (5.1:1 ✓), `black` on `neon` (16:1 ✓), `paper` on `black` (16:1 ✓), `black` on `reserve-local` (11.9:1 ✓), `black` on `reserve-global` (6.0:1 ✓), `black` on `map-garden` (5.2:1 ✓).
- Use English labels (Pretendard caps with 0.06–0.08 em tracking) only for `section-label`, `notice-badge`, `community-block-kicker`, `course-label`, `garden-zone`. All other text is Korean.
- Keep the spacing scale closed (`xs / sm / md / lg / xl / 2xl / 3xl / 4xl / 5xl / 6xl`). Pick the nearest value before inventing a new one.

**Don't**

- Don't use `neon` as body text on a light surface — fails contrast at 1.4:1. Use `neon-deep` for the rare text occurrence (gnb-link-active) or `ink` for everything else.
- Don't introduce a dark mode or full-page dark theme. Black is local to brand mark / footer / primary-CTA / seat-guide / experience-item only.
- Don't substitute Noto Sans KR, Anton, or Montserrat for Pretendard.
- Don't reuse `reserve-*` outside Fun&Walk's two reservation buttons, `lineup-*` outside Summer Night lineup cards, or `map-*` outside the documented decorative map components.
- Don't add `!important` (accessibility fallbacks excepted). Layer order resolves cascade ties.
- Don't mix shape vocabularies in a single zone (pill CTAs next to sharp cards).
- Don't apply `--shadow-text-hard` (the poster shadow) outside `display-xl` headlines.
- Don't carry the source design's failing a11y pairings (`paper` on `reserve-global`, `paper` on `map-garden`) — both are overridden to `black` text in our spec.

---

## Related documents

- [`README.md`](./README.md) — repository structure, build/deploy, code conventions.
- [`CLAUDE.md`](./CLAUDE.md) — AI coding agent rules, including SSOT and absolute rules.
- [`docs/namsan-summer-festival-source-20260521-103004/`](./docs/namsan-summer-festival-source-20260521-103004/) — designer source bundle (Phase 7에서 폐기 예정, 그때까지 reference).

> **Format**: Google Stitch `DESIGN.md` (alpha). Validate with `npx @google/design.md lint DESIGN.md`. CLI is optional — the file itself is plain markdown with YAML front matter and requires no tooling.
