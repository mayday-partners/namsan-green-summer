---
version: alpha
name: Namsan Green Summer 2026
description: >-
  Festival site for the 2026 Namsan Green Summer Festival
  (2026 남산 서머 페스티벌). Light paper baseline with neon accents
  preserved as motifs; dark surfaces reserved for nocturnal-mood section
  containers (Summer Night hero, program imagery). Display Anton + body
  Pretendard. Editorial calm under a high-contrast festival aesthetic.
colors:
  # Brand accent — single neon (decorative use only on light surfaces)
  primary:   "#39ff14"   # Neon Green — brand mark, CTA, program identity, focus ring (never as text on light surfaces)
  # Surface system (light baseline)
  neutral:        "#F4F8EE"   # Pale Garden — page background, green-tinted paper
  surface:        "#FFFFFF"   # Pure paper — cards, panels, scrolled header backdrop
  surface-alt:    "#FAFBF6"   # Soft off-white — section zone separation
  # Foreground tiers (on light surfaces)
  on-surface:        "#0F1419"   # Charcoal Ink — display titles, primary headings
  on-surface-body:   "#2D3340"   # Body Slate — body copy
  on-surface-muted:  "#6B7280"   # Cool Slate — metadata, eyebrows, captions
  # Darker accent variant — text use on light surfaces (raw neon fails contrast as text)
  primary-text:    "#107010"   # Deep Green — brand/program text on light surfaces (6.27:1 AA on #FFFFFF, 5.83:1 AA on #F4F8EE)
  # Dark surface system (section-level nocturnal containers)
  dark-surface:    "#050816"   # Midnight Ink — dark section background, photo cards
  dark-surface-2:  "#0C0F24"   # Elevated Indigo — elevated dark cards
  # Foreground tiers (on dark surfaces)
  on-dark:        "#FFFFFF"   # Pure white — display titles inside dark sections
  on-dark-body:   "#E6E8F0"   # Paper — body copy inside dark sections
  # External deep-link brand colors — scoped to button-map-* only, never reused elsewhere
  brand-kakao:        "#FAE100"   # Kakao official yellow — pair with dark-surface text (15:1, AAA)
  brand-google-blue:  "#1A73E8"   # Google Material blue — pair with on-dark white (4.5:1, AA)
  brand-naver:        "#03C75A"   # Naver Bright Green — pair with dark-surface text (9.4:1, AAA)
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
sizes:
  # Dimension primitives — referenced by components below and exported as
  # `--size-*` in tokens.css. Use these instead of inlining raw px in
  # component definitions. Closed list — add a new key only when a value
  # repeats in ≥ 2 components or has semantic identity worth naming.
  mask-icon:        16px  # bullet markers, notice/FAQ list icons (1:1 SVG mask)
  logo-dot:         10px  # site-logo signature dot
  faq-sign:         24px  # FAQ details/summary toggle indicator
  hamburger-toggle: 32px  # mobile nav toggle — a11y deviation, see prose
  sns-icon:         36px  # footer SNS round icons — a11y deviation, see prose
  tap-target:       44px  # WCAG 2.2 SC 2.5.8 minimum recommended hit area
  program-icon:     48px  # .program-card circular icon
  button-action:        48px  # .btn primary CTA min-height (시안 .primary-action 48px hit area)
  button-action-small:  40px  # .btn--small variant
components:
  button-primary:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    padding: 12px
    typography: "{typography.body-sm}"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.dark-surface}"
  button-ghost:
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    padding: 12px
    typography: "{typography.body-sm}"
  button-ghost-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.dark-surface}"
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
  section-zone-alt:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.on-surface-body}"
    padding: 48px
  header:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface-body}"
    height: 72px
  header-scrolled:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-body}"
  footer:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.on-surface-muted}"
    padding: 64px
  input-base:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-body}"
    rounded: "{rounded.md}"
    padding: 12px
  program-icon:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.dark-surface}"
    rounded: "{rounded.full}"
    size: 48px   # matches sizes.program-icon (spec extension — lint can't resolve cross-category)
  program-eyebrow:
    textColor: "{colors.primary-text}"
    typography: "{typography.label-en-md}"
  info-box:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-body}"
    rounded: "{rounded.lg}"
    padding: 32px
  info-box-label:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label-en-md}"
  info-box-dday:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.dark-surface}"
    rounded: "{rounded.full}"
    padding: 12px
    typography: "{typography.label-en-caps}"
  cta-group:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.on-surface-body}"
    rounded: "{rounded.lg}"
    padding: 32px
  sponsor-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-muted}"
    rounded: "{rounded.md}"
    padding: 24px
  kit-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 24px
  notice-table:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-body}"
    rounded: "{rounded.md}"
    padding: 24px
  notice-table-head:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body-sm}"
  dark-section:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.on-dark-body}"
    rounded: "{rounded.lg}"
    padding: 48px
  dark-section-title:
    textColor: "{colors.on-dark}"
    typography: "{typography.headline-md}"
  dark-card-elevated:
    backgroundColor: "{colors.dark-surface-2}"
    textColor: "{colors.on-dark-body}"
    rounded: "{rounded.md}"
    padding: 24px
  button-map-kakao:
    backgroundColor: "{colors.brand-kakao}"
    textColor: "{colors.dark-surface}"
    rounded: "{rounded.full}"
    padding: 12px
    typography: "{typography.body-sm}"
  button-map-google:
    backgroundColor: "{colors.brand-google-blue}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    padding: 12px
    typography: "{typography.body-sm}"
  button-map-naver:
    backgroundColor: "{colors.brand-naver}"
    textColor: "{colors.dark-surface}"
    rounded: "{rounded.full}"
    padding: 12px
    typography: "{typography.body-sm}"
---

# 2026 Namsan Green Summer Festival — Visual Identity

> Single-weekend festival site (event: 2026-06-27 SAT, 남산공원). Korean-first content with English typographic accents. The visual identity targets the
> "도심 속 초록빛 여름" (verdant summer inside the city) brief — fresh, daylit,
> luminous, with selective nocturnal moments preserved as dark section containers.

## Overview

The brand mood is **"editorial calm with luminous festival accents on a green-tinted paper canvas."** A pale garden paper plays foil to a single signature **Neon Green** accent used as a *motif* (CTA hover, brand mark, glow, program-card hover). Nocturnal moments (Summer Night hero, program imagery cards) live inside dedicated **dark section containers** rather than across full pages.

- **Density**: spacious. Hero occupies a full viewport-height band; programs sit in a 3-column grid below. Typography breathes; CTAs sit alone in their visual zone.
- **Voice**: editorial broadsheet meets after-hours flyer. Korean headlines stay tight (Pretendard SemiBold), English eyebrows wear wide letter-spacing (Montserrat caps), and display numerals/English use Anton for festival-poster gravitas.
- **Motion**: subtle. `cubic-bezier(0.22, 1, 0.36, 1)` ease-out across 200–400 ms. Hover lifts (`translateY(-2px) ~ -4px`) plus a neon glow on the primary CTA; the program watermarks scale-fade on scroll-in only.
- **Non-goals**: no full-page dark theme (dark mood is section-scoped), no glassmorphism gradients on content, no playful illustrations, no rounded sans-serif headings.

## Colors

The palette is a **light paper baseline + single neon motif + dark section containers**: one brand neon (decorative), a three-step light surface stack, one darker neon variant for text use, and a two-step dark surface stack for nocturnal containers.

- **Primary (#39ff14) — "Neon Green"** The single brand accent. Used as background fill on the primary CTA hover state, the brand dot/mark, focus ring fills, program-card hover background, and as the unifying festival identity. *Never set as text directly on light surfaces* (fails contrast at 1.4:1) — use `primary-text` for the eyebrow/link/text form.
- **Neutral (#F4F8EE) — "Pale Garden"** Page background. A green-tinted paper that anchors the "Green Summer" brief without going pure white.
- **Surface (#FFFFFF) — "Pure paper"** Cards, panels, scrolled header backdrop, input fields. Lifts cleanly from `neutral` for elevation.
- **Surface-alt (#FAFBF6) — "Soft off-white"** Zone-level alternate strip (footer, alternating sections) for rhythm without a heavy color shift.
- **On-surface tiers** Charcoal Ink (#0F1419), Body Slate (#2D3340), Cool Slate (#6B7280). All three pass WCAG AA or better on `surface`.
- **Primary-text (#107010) — "Deep Green"** The *only* darker variant. Used exclusively for text renditions of the brand identity on light surfaces (eyebrows, links, list category labels). Passes WCAG AA on `surface` (6.27:1) and `neutral` (5.83:1).
- **Dark-surface (#050816) — "Midnight Ink"** Background for **section-scoped** dark containers: Summer Night feature blocks, photo cards, hero overlay zones. Never used as full-page background.
- **Dark-surface-2 (#0C0F24) — "Elevated Indigo"** Elevated cards inside dark sections.
- **On-dark tiers** White (#FFFFFF) for display titles, Paper (#E6E8F0) for body inside dark sections.

### Alpha-tinted utilities (CSS only, not tokens)

These derive from base colors and are applied via `rgba()` or layer opacity rather than as standalone tokens, since the spec restricts colors to sRGB hex:

- **Border** — `rgba(15, 20, 25, 0.10)` — hairline divider between sections, cards, list items on light surfaces.
- **Border (dark sections)** — `rgba(230, 232, 240, 0.10)` — same role inside dark containers.
- **Scrim/Overlay** — `rgba(244, 248, 238, 0.72)` — behind the scrolled header on light pages (with 16 px blur).
- **Scrim (on dark)** — `rgba(5, 8, 22, 0.55)` — hero card backdrop inside dark containers (with `backdrop-filter: blur(18px)`).
- **Scrim (on dark, dev tooling)** — `rgba(5, 8, 22, 0.88)` — image-slot dev badge background under `?spec=1`.
- **Primary soft** — `rgba(57, 255, 20, 0.18)` — focus ring fills, neon glow halos, hero accent blur.
- **Program border-soft (resting)** — `rgba(57, 255, 20, 0.30)` — program-card border at rest; transitions to full neon `primary` background on hover.
- **Hero gradient bands** — see Elevation & Depth.

### Card media placeholder gradient (CSS only, not a token)

`.card__media` slots show a neutral darkened gradient before real images arrive. The dark palette is intentional — placeholder media sits inside light-baseline cards but reads as "image pending," matching the `.course-map` placeholder treatment. The gradient is a single CSS variable in `tokens.css` (`--card-media-placeholder`), not a Color token — it disappears once `data/image-slots.json` is filled.

- `--card-media-placeholder` — `linear-gradient(135deg, #1a1a2e, #2c2c4a)` (neutral dark, removed when image lands)

### Radial pattern motif (CSS only)

A signature decorative pattern derived from the festival keyvisual: concentric thin rings (1-2 px stroke) layered as radial gradients. Two variants:

- `--pattern-radial-light` — white rings on the brand neon, used as section-bottom decoration on light pages (`info-section::after`, `strip-pattern`).
- `--pattern-radial-dark` — neon rings on dark-surface, used inside `.dark-section` containers (`night-experience`, hero overlays).

Apply via the `.radial-pattern--light` / `.radial-pattern--dark` utility class on a positioned ancestor with `overflow: hidden`. Never use as a primary content background — always as `position: absolute` decoration with `opacity: 0.18–0.38`.

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
  - `900px` — main grid pivot (`programs__grid` 3→1 col, hero card layout shifts).
  - `1440px` — desktop wide (container caps at 1280, content stays comfortable).
- **Hero sections** use `min-height: 100svh` and a full-bleed `position: absolute` background layer (`hero__bg`) plus a directional gradient overlay (`hero__bg::after`). Hero photo containers are themselves dark — the light paper page wraps them.

## Elevation & Depth

Depth is conveyed through **tonal layers + soft shadows + selective dark containers**.

- **Tonal stack (light baseline)** Page `neutral (#F4F8EE)` → cards `surface (#FFFFFF)` → text on top. The 11-unit lightness gap reads as elevation without heavy shadow. `surface-alt (#FAFBF6)` provides a subtle zone alternation between sections.
- **Tonal stack (dark sections)** Container `dark-surface (#050816)` → elevated cards `dark-surface-2 (#0C0F24)` → on-dark text. Preserves the original 7-unit dark hierarchy inside section containers.
- **Border hairlines** Light surfaces use `1px solid rgba(15, 20, 25, 0.10)`; dark sections use `1px solid rgba(230, 232, 240, 0.10)`. Both define edges without drop shadows.
- **Card shadow (light surfaces)** `--shadow-card: 0 12px 32px rgba(15, 20, 25, 0.06), 0 2px 8px rgba(15, 20, 25, 0.04)`. Used as the resting state on light cards to lift from the pale paper.
- **Glow (the brand's signature)** `--shadow-glow: 0 0 24px rgba(57, 255, 20, 0.45), 0 0 64px rgba(57, 255, 20, 0.18)`. Applied to the primary button on hover, the program-card hover, the favicon dot, and as a halo behind the hero number on light pages.
- **Dark-section lift shadow** `--shadow-dark: 0 24px 64px rgba(0, 0, 0, 0.45)` — used on `.program-card:hover` and inside dark sections to amplify the `translateY(-4px)` lift. Never used as a resting state on light surfaces.
- **Hero gradients** Hero photos live inside dark container panels that sit on the light page. Inside the dark container: a `linear-gradient(180deg, transparent 50%, var(--color-dark-surface) 100%)` fade plus a right-side scrim `linear-gradient(90deg, ... 80% rgba(5,8,22,0.85))` under the text card.

## Shapes

- **Pill** (`rounded.full`, 9999px) — all CTAs (`.btn`). Reads as "interactive," differentiates from cards.
- **Large radius** (`rounded.lg`, 24px) — hero card, caution box, `.card` thumbnails, external-CTA banner, dark section containers. Reads as a "panel."
- **Medium radius** (`rounded.md`, 12px) — `.program-card` (sub-pages and home overview), elevated dark cards inside sections.
- **Small radius** (`rounded.sm`, 6px) — skip-link, image-slot dev badge, ad-hoc small labels.
- **Circle** — the `.site-logo__dot`, footer SNS icons (36 × 36 px circles), and the `.program-card__icon` (48 × 48 px). Always solid neon or accent fill with dark-surface text inside.
- The `.course-map` element (designer-placeholder) uses `aspect-ratio: 16/9` with `rounded.lg` and currently fills with a neon + blue radial-gradient as a stand-in until real maps arrive — see `IMAGE_SPEC.md`.

## Sizes

Dimension primitives for component fixtures (icon hit areas, decorative dots, masked SVG icons). Defined in the YAML `sizes:` block (spec extension — alpha lint recognises only `colors/typography/spacing/rounded` as primitive categories, so `sizes` keys are not cross-referenced from `components.*.size` and remain as raw px in those rules; the canonical mapping is enforced in `tokens.css` via `--size-*` and in `CLAUDE.md` rule #6).

- **`mask-icon` (16 px)** — Square hit box for SVG-masked decoration: list bullets, notice/FAQ row icons. Always 1:1 with no border.
- **`logo-dot` (10 px)** — The single brand signature dot in `.site-logo__dot`. Solid neon fill + neon glow. Decorative, never interactive on its own.
- **`faq-sign` (24 px)** — `.faq__sign` `+` / `×` toggle indicator inside the FAQ summary row. Hit area is the whole summary row, not this glyph alone.
- **`hamburger-toggle` (32 px)** — `.site-nav__toggle` mobile menu trigger. **A11y deviation**: WCAG 2.2 SC 2.5.8 recommends ≥ 44 × 44 hit area; current 32 passes the absolute minimum (24) but should be revisited. Tracked for future revision.
- **`sns-icon` (36 px)** — Footer SNS round icons (`.sns-list a`). Same a11y deviation as `hamburger-toggle`; the surrounding gap (`space-3`) extends the practical hit area but does not satisfy SC 2.5.8.
- **`tap-target` (44 px)** — WCAG 2.2 SC 2.5.8 recommended minimum. Not used yet; reserved as the target value when `hamburger-toggle` / `sns-icon` are revised.
- **`program-icon` (48 px)** — `.program-card__icon` solid circle in the program accent color. Pairs with the program-icon component.
- **`button-action` (48 px)** — `.btn` primary CTA `min-height`. Matches WCAG 2.2 SC 2.5.8 recommended tap-target minimum (44 px) with extra headroom for festival-scale typography.
- **`button-action-small` (40 px)** — `.btn--small` variant min-height. Below the 44 px tap-target recommendation — use only in non-primary, low-density contexts (e.g., inline secondary action in a dense reservation form).

Rule: when adding a new fixture, prefer reusing one of the above before inventing a new key. New keys require ≥ 2 callsites or a clear semantic name.

## Components

### Buttons

Two in-system variants (`button-primary`, `button-ghost`) plus an external deep-link category (`button-map-*`). All are pill-shaped (`rounded.full`).

- **`button-primary`** — solid `dark-surface` background, `on-dark` text at rest; hover swaps to `primary` (neon) background with `dark-surface` text plus `shadow-glow` and `translateY(-2px)` lift. The neon-on-dark hover pairing (14.6:1 AAA) remains the brand's signature interaction. Used at most once per visual zone; never two primaries side by side in the same hero band.
- **`button-ghost`** — transparent background, 1 px `border (alpha 0.10)`, `on-surface` text (dark on light). Hover: background swaps to `primary` (neon), text and border invert to `dark-surface`. Used as the secondary CTA next to `button-primary`.
- Inner arrow span (`.btn__arrow`) shifts `translateX(4px)` on hover for both variants — small motion cue, applied automatically.

**External deep-link buttons (`button-map-*`)** — a separate category that intentionally breaks the light-canvas color rule because each button must remain instantly recognizable as the target app. They appear only inside `.map-links` slots beneath `.course-map` placeholders and never substitute for the in-system CTA. `button-map-kakao` uses Kakao's brand yellow (`brand-kakao`) with `dark-surface` text; `button-map-google` uses Google Material blue (`brand-google-blue`) with `on-dark` white; `button-map-naver` uses Naver Bright Green (`brand-naver`) with `dark-surface` text. All three brand colors are scoped to this category — they must not be reused for any other surface. Kakao opens the venue's Place page by ID; Google opens transit directions to the road address; Naver opens its search-result page.

### Program cards (light-baseline with neon hover)

A single base class for all three festival programs sharing the same `card-compact` shape (`rounded.md`, 24 px padding). The light-baseline page surface continues into the card — white background, hairline border, charcoal text — and the neon identity surfaces only on hover.

- `.program-card` — `surface` (white) bg, 1 px `border (alpha 0.10)`, `on-surface` text. The eyebrow uses `primary-text` (Deep Green); the card icon uses `primary` (Neon Green) background with `dark-surface` text inside.
- `.program-card:hover` — `translateY(-4px)`, background swaps to `primary` (Neon Green), border swaps to `dark-surface`, eyebrow text inverts to `dark-surface`. This neon-swap is the program-card's signature interaction.

Each card has a 48 × 48 circular icon (`size: program-icon`) in `primary` with `dark-surface` text. There is no per-program color variant — Fun & Walk, Summer Night, Summer Garden all share the same card visual; differentiation comes from copy, icon glyph, and photographic imagery, not from card chrome.

### Program eyebrows on light surfaces

When the brand/program identity needs **text** on a light page (notice list category, breadcrumb, link), use `primary-text` (#107010, 6.27:1 AA on surface). Never use the raw `primary` neon for text on light surfaces.

### Dark section (nocturnal-mood container)

`dark-section` is the Summer Night–style mood container used **inside light pages** for hero photo zones, Summer Night feature sections, and any block where the festival's after-hours identity must read clearly. It is *not* a page mode — light pages can contain multiple `.dark-section` blocks, and they always sit inside the light page rhythm with `rounded.lg` corners that announce the container boundary.

- `dark-section` — `dark-surface` bg, `on-dark-body` body text, `rounded.lg`, 48 px padding.
- `dark-section-title` — `on-dark` white, `headline-md` typography.
- Inside `.dark-section`, the neon-on-dark contrast guidelines apply: eyebrows can use raw `primary`, body text uses `on-dark-body`, glow shadows are legible.
- `dark-card-elevated` — when a card needs further elevation inside a dark section, use `dark-surface-2` bg.

### Site Header

Fixed (`position: fixed`, top 0, `height: 72px` desktop / `60px` mobile). Three states:

1. **Transparent (default, top of page)** — no background, logo + nav float over the page (or over hero containers).
2. **Scrolled** — `surface (alpha 0.72)` background with `backdrop-filter: saturate(140%) blur(16px)` and a hairline border-bottom.
3. **Mobile menu open** — full-viewport `neutral` background slides down (`translateY(0)`), nav links become `display-md` in `on-surface` text.

### Site Footer

`5-column grid (1.4fr 1fr 1fr ...)` of menu sections on desktop; `2-column` on mobile. Background `surface-alt` provides subtle separation from the main page rhythm without going full dark. Column headings use `label-en-caps` in `primary-text` (the darker lime that passes contrast on light). Bottom bar holds copyright and an SNS list of 36 × 36 circle borders that pick up `primary-text` on hover.

### Notice / FAQ lists

Two-column section on the homepage (`bottom-grid`, 1:1). Each list is a vertical stack with hairline dividers (`border-block-end`). List item rows are `grid-template-columns: 1fr auto` (title left, date right). Hover swaps title text to `primary-text`.

### Hero Display

Homepage `<section class="hero">` splits into two zones: a left `hero__display` (typographic poster) and a right `hero__card` (event metadata + single CTA). The display zone stacks three element types vertically (the Korean title repeats across three lines but uses one class):

1. `hero__display-num` — Anton "2026" at `display-hero` token (`--fs-display-hero`, fluid 2.5–6rem, `on-surface` charcoal with a neon glow halo behind).
2. `hero__display-kr` — Pretendard 900 three-line Korean title ("남산 / 서머 / 페스티벌"). Uses its own fluid range `clamp(2.5rem, 7vw, 5rem)` (capped 1rem below `display-hero` so the numeric reads as the lead marquee), line-height 0.95.
3. `hero__display-en-sub` — Anton "NAMSAN GREEN SUMMER FESTIVAL" at `body-md`, `primary-text`, wide tracking.

The card zone shrinks to 280 px on desktop and contains only date/place metadata + the primary CTA. On screens ≤ 900 px the two zones stack with display first.

### Info table (`info-grid`)

`220px 1fr` `<dl>` two-column on desktop; collapses to stacked dt/dd on mobile. Each name-value pair is wrapped in `<div class="info-grid__row">` (MDN-allowed inside `<dl>`) so per-row padding and the inter-row divider live on a single element — `dt` and `dd` share the same row baseline. `dt` uses `label-en-caps` in `on-surface-muted`; `dd` uses `body-md` on `on-surface` (charcoal).

### Timetable (`timetable`)

`grid-template-columns: 140px 1fr auto` per row. Time column uses Montserrat 600 in `primary-text` (Deep Green — the darker variant for legibility on light surfaces).

### Forms

Not yet defined — awaiting designer hand-off. When introduced, inputs should follow the `input-base` token (12 px padding, `rounded.md`, `surface` bg, `on-surface-body` text, focus ring = `primary` 2 px with 4 px offset to mirror `:focus-visible`).

### Section zones

`section-zone-alt` is the alternating-rhythm utility for pages that need a soft separation between full-width sections. Uses `surface-alt` bg (the off-white) so the eye registers a zone change without a hard color step.

## Do's and Don'ts

**Do**

- Use `primary` (neon #39ff14) as a **decorative motif** only: the brand dot, primary CTA hover background, focus ring fill, neon glow halos, program-card hover background, the unifying festival identity across all programs.
- Use `primary-text` (#107010) for **any text** that needs the brand identity on a light page (eyebrows, links, list category labels, timetable times). All three programs share this single text variant.
- Pair every neon background with `dark-surface` text (`#39ff14` on `#050816` → AAA) — this remains the brand's signature pairing on CTAs and program icons.
- Neon (#39ff14) is the single festival identity — all three programs (Fun & Walk, Summer Night, Summer Garden) share it. Differentiate programs by copy, icon glyph, and photographic imagery rather than chrome color.
- Use Anton **only for English and numerals**. Headlines that contain Korean must use Pretendard (e.g., "주요 프로그램" stays in Pretendard, "Program 01" in Montserrat or Anton).
- Maintain WCAG AA contrast (≥ 4.5 : 1 for normal text, ≥ 3 : 1 for large text) — all defined `on-*` × surface pairs currently pass; new combinations must be re-checked.
- Use `shadow-glow` only on `primary` interactive states. It is the brand's signature; do not dilute it on non-CTA surfaces.
- Keep the 9-step spacing scale closed. Adding a custom px value is a code smell — pick the nearest scale value.
- Wrap nocturnal imagery (hero photos, program cards, Summer Night feature blocks) in `.dark-section` containers so the photographic palette and neon-on-dark legibility survive the light page rhythm.

**Don't**

- Don't set body text in raw `primary` neon on a light surface — it fails contrast at 1.4 : 1 and reads as illegible. Use `primary-text` instead.
- Don't introduce a second accent color, a gradient with more than two stops, or per-program color variants in a single component.
- Don't add a full-page dark theme. Dark moods belong inside `.dark-section` containers on otherwise light pages.
- Don't use heavy multi-layer drop shadows for hierarchy. Tonal layer + hairline border + a soft 2-layer `shadow-card` is the pattern.
- Don't mix shape vocabularies in a single zone: square inputs next to pill buttons, or sharp cards next to rounded cards.
- Don't use Anton for Korean text. Don't use Pretendard for English uppercase labels. Don't use Montserrat for body copy.
- Don't replace the primary CTA neon with a custom color "to highlight a program." All three programs share the single neon identity; the CTA across the whole site stays neon.
- Don't add `!important` to layout/component styles. The cascade is layered (`reset / tokens / base / components / pages / utilities`); break ties with layer order, not flags. (Accessibility fallbacks are the one exception, documented at the rule.)
- Don't apply `shadow-card` (the light-page lift shadow) inside dark sections — use `shadow-dark` there.

---

## Related documents

- [`README.md`](./README.md) — repository structure, build/deploy, code conventions.
- [`docs/IMAGE_SPEC.md`](./docs/IMAGE_SPEC.md) — image slot inventory and hand-off rules (the visual *content*; this file covers the visual *system*).
- [`CLAUDE.md`](./CLAUDE.md) — AI coding agent rules, including "no-build" policy and SSOT principles.
- [`docs/design-explorations/light-baseline-v1.html`](./docs/design-explorations/light-baseline-v1.html) — original light-baseline visual exploration that drove this spec.

> **Format**: Google Stitch `DESIGN.md` (alpha). Validate with `npx @google/design.md lint DESIGN.md`. Export tokens with `npx @google/design.md export --format dtcg DESIGN.md`. CLI is optional — the file itself is plain markdown with YAML front matter and requires no tooling.
