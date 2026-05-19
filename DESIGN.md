---
version: alpha
name: Namsan Green Summer 2026
description: >-
  Festival site for the 2026 Namsan Green Summer Festival
  (2026 남산 그린 서머 페스티벌). Dark surface · neon-green primary ·
  pink/blue program accents · display Anton + body Pretendard.
  Editorial calm under a high-contrast techno-festival aesthetic.
colors:
  # Brand accents — three program identities
  primary:   "#A8FF00"   # Neon Lime — main accent + Green Garden program
  secondary: "#FF0F7B"   # Hot Pink — Green Night program
  tertiary:  "#00A3FF"   # Sky Blue — Fun & Walk program
  # Surface system (dark only — no light mode)
  neutral:   "#050816"   # Midnight Ink — page background
  surface:   "#0C0F24"   # Elevated Indigo — cards, panels, scrolled header
  # Foreground tiers
  on-surface:        "#FFFFFF"   # Pure white — display titles, primary headings
  on-surface-body:   "#E6E8F0"   # Paper — body copy
  on-surface-muted:  "#8A8FA3"   # Cool Slate — metadata, eyebrows, captions
typography:
  display-hero:
    fontFamily: Anton
    fontSize: 6rem
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.02em
  display-lg:
    fontFamily: Anton
    fontSize: 4.5rem
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.02em
  display-md:
    fontFamily: Anton
    fontSize: 3rem
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Anton
    fontSize: 2rem
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.02em
  body-md:
    fontFamily: Pretendard
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: -0.01em
  body-sm:
    fontFamily: Pretendard
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: -0.01em
  label-en-md:
    fontFamily: Montserrat
    fontSize: 0.875rem
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.2em
  label-en-caps:
    fontFamily: Montserrat
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.24em
spacing:
  xs:  0.25rem   # 4px  — micro adjustments
  sm:  0.5rem    # 8px  — inline gaps, badge padding
  md:  1rem      # 16px — base rhythm (body line gap)
  lg:  1.5rem    # 24px — card body padding, list gap
  xl:  2rem      # 32px — card padding, section header gap
  2xl: 3rem      # 48px — section internal padding
  3xl: 4rem      # 64px — section vertical padding (mobile)
  4xl: 6rem      # 96px — section vertical padding (desktop)
  5xl: 8rem      # 128px — footer top margin
rounded:
  sm:   6px      # skip-link, focus outline target, small badges
  md:   12px    # standard cards (.program-card)
  lg:   24px    # hero card, large panels (.card, .hero__card, .caution)
  full: 9999px  # pill CTAs (.btn)
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.full}"
    padding: 12px
    typography: "{typography.body-sm}"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
  button-ghost:
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    padding: 12px
    typography: "{typography.body-sm}"
  button-ghost-hover:
    textColor: "{colors.primary}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-compact:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 24px
  header:
    textColor: "{colors.on-surface-body}"
    height: 72px
  header-scrolled:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-body}"
  footer:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface-muted}"
    padding: 64px
  input-base:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-body}"
    rounded: "{rounded.md}"
    padding: 12px
  program-icon-funwalk:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.full}"
    size: 48px
  program-icon-night:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.full}"
    size: 48px
  program-icon-garden:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.full}"
    size: 48px
---

# 2026 Namsan Green Summer Festival — Visual Identity

> Single-weekend festival site (event: 2026-06-27 SAT, 남산공원). Korean-first content with English typographic accents. The visual identity targets the
> "도심 속 초록빛 여름" (verdant summer inside the city) brief — cool, nocturnal,
> luminous, but never neon-circus.

## Overview

The brand mood is **"editorial calm under a high-contrast techno-festival aesthetic."** A near-black canvas plays foil to a single signature **Neon Lime** accent, while two secondary brand colors — **Hot Pink** and **Sky Blue** — partition the three festival programs without ever competing inside the same surface.

- **Density**: spacious. Hero, programs, and previews each occupy a full viewport-height band. Typography breathes; CTAs sit alone in their visual zone.
- **Voice**: editorial broadsheet meets after-hours flyer. Korean headlines stay tight (Pretendard SemiBold), English eyebrows wear wide letter-spacing (Montserrat caps), and display numerals/English use Anton for festival-poster gravitas.
- **Motion**: subtle. `cubic-bezier(0.22, 1, 0.36, 1)` ease-out across 200–400 ms. Hover lifts (`translateY(-2px) ~ -4px`) plus a neon glow on the primary CTA; the program watermarks scale-fade on scroll-in only.
- **Non-goals**: no light theme, no glassmorphism gradients on content, no playful illustrations, no rounded sans-serif headings.

## Colors

The palette is a strict **dark canvas + four hues**: a brand neon, two program signals, and a neutral surface stack. No greys outside the muted text tier.

- **Primary (#A8FF00) — "Neon Lime"** The single brand accent and the *only* color allowed for the primary call-to-action. Doubles as the **Green Garden** program color. Always pair with `neutral` (#050816) text when used as a background; never use as small body text on dark surfaces.
- **Secondary (#FF0F7B) — "Hot Pink"** Reserved for the **Green Night** program. Used for program number `02`, watermark, bullet markers, and program-card border accents. Passes WCAG AA (5.4:1) on `neutral` for normal text.
- **Tertiary (#00A3FF) — "Sky Blue"** Reserved for the **Fun & Walk** program. Same role as pink, scoped to its program. Passes WCAG AA (6.5:1) on `neutral`.
- **Neutral (#050816) — "Midnight Ink"** Page background. Every page starts here.
- **Surface (#0C0F24) — "Elevated Indigo"** Cards, info panels, scrolled header backdrop. Subtle lift from `neutral` (no shadow needed for hierarchy).
- **On-surface tiers** White (#FFFFFF) for display titles and the highest-emphasis copy; Paper (#E6E8F0) for body text; Cool Slate (#8A8FA3) for muted metadata, eyebrows, and uppercase labels. All three pass AA on `neutral`.

### Alpha-tinted utilities (CSS only, not tokens)

These derive from base colors and are applied via `rgba()` or layer opacity rather than as standalone tokens, since the spec restricts colors to sRGB hex:

- **Border** — `rgba(230, 232, 240, 0.08)` — hairline divider between sections, cards, list items.
- **Scrim/Overlay** — `rgba(5, 8, 22, 0.72)` — behind the scrolled header (with 16 px blur).
- **Primary soft** — `rgba(168, 255, 0, 0.18)` — focus ring fills, subtle hover halos.
- **Hero gradient bands** — see Elevation & Depth.

## Typography

Three families, each with a strict role. Never substitute one family into another's role.

- **Anton — display** Festival-poster condensed sans. English / numerals only — *never* set Korean text in Anton (the Hangul fallback breaks the visual texture). Used for the H1 hero, program numbers (01/02/03), program watermarks, and section titles.
- **Pretendard — body (Korean) + display weight** Korean-optimized sans. Carries all body copy, list items, table cells, and form labels. Weights subset-shipped: 300 / 400 / 500 / 600 / 700 / 900. The 900 (Black) weight is reserved for the homepage hero display (`hero-display-kr`); body copy never uses 900. Default body letter-spacing is `-0.01em` (Korean tightens better than English at this scale).
- **Montserrat — English label** Used exclusively for English eyebrows, metadata, date/time labels, breadcrumbs, footer column headings, and breadcrumb trails. Always uppercase with 0.2em – 0.3em letter-spacing.

### Hierarchy (most-used levels)

- `display-hero` (Anton, fluid 2.5rem → 6rem) — homepage H1 only.
- `display-lg` (Anton, 4.5rem) — sub-page hero H1 (`<page-hero__title>`).
- `display-md` (Anton, 3rem) — section titles (`.section-title`, `.sub-head__title`).
- `headline-md` (Anton, 2rem) — large card titles (`.card__title`, `.bottom-block__title`).
- `body-md` (Pretendard 400, 1.125rem) — paragraphs, descriptions.
- `body-sm` (Pretendard 400, 0.875rem) — list items, metadata.
- `label-en-md` (Montserrat 600, 0.875rem, 0.2em tracking, UPPERCASE) — `.eyebrow`, page-hero eyebrow.
- `label-en-caps` (Montserrat 600, 0.75rem, 0.24em tracking, UPPERCASE) — footer column headings, breadcrumbs, list metadata.

## Layout

The grid is a **fixed-max-width Container** centered on the viewport. No bespoke responsive grid library.

- **Container** — `max-width: 1280px`, `padding-inline: 1.25rem` desktop / `1rem` mobile.
- **Section rhythm** — `padding-block: 8rem` (`5xl`) desktop, `6rem` (`4xl`) mobile.
- **Spacing scale** — based on a `0.25rem` (4 px) unit. Use only `xs / sm / md / lg / xl / 2xl / 3xl / 4xl / 5xl`. Do not invent in-between values.
- **Breakpoints** —
  - `768px` — mobile / tablet boundary (header hamburger appears, info-grid collapses to one column, section padding drops).
  - `900px` — main grid pivot (`programs__grid` 3→1 col, `preview__inner` 2→1 col, hero card layout shifts).
  - `1440px` — desktop wide (container caps at 1280, content stays comfortable).
- **Hero & Preview sections** use `min-height: 100svh` / `560px` and a full-bleed `position: absolute` background layer (z-index -2) plus a directional gradient overlay (z-index -1).

## Elevation & Depth

Depth is conveyed through **tonal layers and glow**, never traditional drop shadows for hierarchy.

- **Tonal stack** Background `neutral (#050816)` → cards `surface (#0C0F24)` → text on top. The 7-unit lightness gap reads as elevation without any shadow.
- **Border hairlines** Almost every container uses `1px solid rgba(230, 232, 240, 0.08)` instead of a shadow to define its edge.
- **Glow (the only "shadow" allowed)** `--shadow-glow: 0 0 24px rgba(168, 255, 0, 0.45), 0 0 64px rgba(168, 255, 0, 0.18)`. Applied to the primary button on hover, the section-bottom Garden card hover, and the favicon dot.
- **Card lift shadow** `--shadow-card: 0 24px 64px rgba(0, 0, 0, 0.45)` — used only on `.program-card:hover` to amplify the `translateY(-4px)` lift. Never used as a resting state.
- **Hero gradients** Two stacked linear gradients sit *over* the hero photo — `linear-gradient(180deg, transparent 50%, var(--color-bg) 100%)` for the fade-to-page-bg, and `linear-gradient(90deg, ... 80% rgba(5,8,22,0.85))` for the right-side scrim under the text card. The preview sections use a single directional `--ltr` or `--rtl` overlay (88% → 0% on `neutral`) to push the photo behind text.

## Shapes

- **Pill** (`rounded.full`, 9999px) — all CTAs (`.btn`). Reads as "interactive," differentiates from cards.
- **Large radius** (`rounded.lg`, 24px) — hero card, caution box, `.card` thumbnails, external-CTA banner. Reads as a "panel."
- **Medium radius** (`rounded.md`, 12px) — `.program-card` (sub-pages and home overview).
- **Small radius** (`rounded.sm`, 6px) — skip-link, image-slot dev badge, ad-hoc small labels.
- **Circle** — the `.site-logo__dot`, footer SNS icons (36 × 36 px circles), and the `.program-card__icon` (48 × 48 px). Always solid neon or accent fill.
- The `.course-map` element (designer-placeholder) uses `aspect-ratio: 16/9` with `rounded.lg` and currently fills with a neon + blue radial-gradient as a stand-in until real maps arrive — see `IMAGE_SPEC.md`.

## Components

### Buttons

Two variants, no third. Both are pill-shaped (`rounded.full`).

- **`button-primary`** — solid `primary` (neon) background, `neutral` text. Hover: add `shadow-glow`, lift `translateY(-2px)`. Used at most once per visual zone; never two primaries side by side in the same hero/preview band.
- **`button-ghost`** — transparent background, 1 px `border (alpha 0.08)`, `on-surface` text. Hover: border and text both shift to `primary`. Used as the secondary CTA next to `button-primary` (e.g., "사전예약" beside "개요 보기").
- Inner arrow span (`.btn__arrow`) shifts `translateX(4px)` on hover for both variants — small motion cue, applied automatically.

### Program cards

Three modifiers, one per program, sharing the same `card-compact` base (`rounded.md`, `surface` bg, 32 px padding via `--space-5`).

- `program-card--funwalk` — blue border at 30 % alpha; hover: full `tertiary` border + soft blue card shadow.
- `program-card--night` — pink at 30 % alpha; hover: `secondary` border + pink card shadow.
- `program-card--garden` — neon at 30 % alpha; hover: `primary` border + the neon `shadow-glow`.

Each card has a 48 × 48 circular icon in the program's accent color (with `neutral` text inside).

### Site Header

Fixed (`position: fixed`, top 0, `height: 72px` desktop / `60px` mobile). Three states:

1. **Transparent (default, top of page)** — no background, logo + nav float over the hero.
2. **Scrolled** — `surface-overlay (alpha 0.72)` background with `backdrop-filter: saturate(140%) blur(16px)` and a hairline border-bottom.
3. **Mobile menu open** — full-viewport `neutral` background slides down (`translateY(0)`), nav links become `display-md`.

### Site Footer

`5-column grid (1.4fr 1fr 1fr ...)` of menu sections on desktop; `2-column` on mobile. Column headings use `label-en-caps` in `primary` (neon). Bottom bar holds copyright and an SNS list of 36 × 36 circle borders that pick up neon on hover.

### Notice / FAQ lists

Two-column section on the homepage (`bottom-grid`, 1:1). Each list is a vertical stack with hairline dividers (`border-block-end`). List item rows are `grid-template-columns: 1fr auto` (title left, date right). Hover swaps title text to `primary`.

### Hero Display

Homepage `<section class="hero">` splits into two zones: a left `hero__display` (typographic poster) and a right `hero__card` (event metadata + single CTA). The display zone stacks four elements vertically:

1. `hero__display-num` — Anton "2026" at `display-hero` (clamp 2.5–6rem, white).
2. `hero__display-kr` — Pretendard 900 three-line Korean title ("남산 / 그린 서머 / 페스티벌") at `clamp(2.5rem, 7vw, 5rem)`, line-height 0.95.
3. `hero__display-en-sub` — Anton "NAMSAN GREEN SUMMER FESTIVAL" at `body-md`, neon, wide tracking.

The card zone shrinks to 280 px on desktop and contains only date/place metadata + the primary CTA. On screens ≤ 900 px the two zones stack with display first.

### Info table (`info-grid`)

`220px 1fr` `<dl>` two-column on desktop; collapses to stacked dt/dd on mobile. `dt` uses `label-en-caps`; `dd` uses `body-md` on `on-surface` (white).

### Timetable (`timetable`)

`grid-template-columns: 140px 1fr auto` per row. Time column uses Montserrat 600 in `primary` (neon).

### Forms

Not yet defined — awaiting designer hand-off. When introduced, inputs should follow the `input-base` token (12 px padding, `rounded.md`, `surface` bg, `on-surface-body` text, focus ring = `primary` 2 px with 4 px offset to mirror `:focus-visible`).

## Do's and Don'ts

**Do**

- Use `primary` (neon #A8FF00) **only** for: the brand dot, the primary CTA, eyebrow text, focus rings, the timetable time column, the Green Garden program identity, the `::selection` highlight.
- Pair every neon background with `neutral` text (`#A8FF00` on `#050816` → contrast 14.6 : 1, AAA).
- Reserve each accent for its program scope: **Neon = Green Garden + brand**, **Pink = Green Night**, **Blue = Fun & Walk**.
- Use Anton **only for English and numerals**. Headlines that contain Korean must use Pretendard (e.g., "주요 프로그램" stays in Pretendard, "Program 01" in Montserrat or Anton).
- Maintain WCAG AA contrast (≥ 4.5 : 1 for normal text, ≥ 3 : 1 for large text) — all defined `on-*` × surface pairs currently pass; new combinations must be re-checked.
- Use the glow shadow (`shadow-glow`) only on `primary` interactive states. It is the brand's signature; do not dilute it on non-CTA surfaces.
- Keep the 8-step spacing scale closed. Adding a custom px value is a code smell — pick the nearest scale value.

**Don't**

- Don't set body text in `primary` neon on a dark surface; it fails contrast and reads as "alert." Use `on-surface-body` instead.
- Don't introduce a fourth accent color, a gradient with more than two stops, or a "rainbow" of program colors in a single component.
- Don't add a light theme. The brand is dark-only.
- Don't use heavy multi-layer drop shadows for hierarchy. Tonal layer + hairline border is the pattern.
- Don't mix shape vocabularies in a single zone: square inputs next to pill buttons, or sharp cards next to rounded cards.
- Don't use Anton for Korean text. Don't use Pretendard for English uppercase labels. Don't use Montserrat for body copy.
- Don't replace the primary CTA color with secondary/tertiary "to highlight a program." Each program's accent is for *that program's surface*; the CTA across the whole site stays neon.
- Don't add `!important` to layout/component styles. The cascade is layered (`reset / tokens / base / components / pages / utilities`); break ties with layer order, not flags. (Accessibility fallbacks are the one exception, documented at the rule.)

---

## Related documents

- [`README.md`](./README.md) — repository structure, build/deploy, code conventions.
- [`docs/IMAGE_SPEC.md`](./docs/IMAGE_SPEC.md) — image slot inventory and hand-off rules (the visual *content*; this file covers the visual *system*).
- [`CLAUDE.md`](./CLAUDE.md) — AI coding agent rules, including "no-build" policy and SSOT principles.

> **Format**: Google Stitch `DESIGN.md` (alpha). Validate with `npx @google/design.md lint DESIGN.md`. Export tokens with `npx @google/design.md export --format dtcg DESIGN.md`. CLI is optional — the file itself is plain markdown with YAML front matter and requires no tooling.
