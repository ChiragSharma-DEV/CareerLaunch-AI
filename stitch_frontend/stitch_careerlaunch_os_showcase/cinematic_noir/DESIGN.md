---
name: Cinematic Noir
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c7c6ca'
  on-secondary: '#2f3033'
  secondary-container: '#46464a'
  on-secondary-container: '#b5b4b8'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e3e2e6'
  secondary-fixed-dim: '#c7c6ca'
  on-secondary-fixed: '#1a1b1e'
  on-secondary-fixed-variant: '#46464a'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.18em
  headline-md-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-page: 40px
  panel-padding: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system for CareerLaunch AI is built on the philosophy of **Cinematic Professionalism**. It moves away from the typical, bright-and-bubbly SaaS aesthetic toward an immersive, editorial-product hybrid that feels like a premium tool for serious career advancement.

The brand personality is authoritative yet visionary. It leverages deep obsidian tones and photographic light blooms to create a sense of depth and focus. The visual style is a blend of **Minimalism** and **Tactile Depth**, emphasizing content through high-contrast typography and subtle, layered surfaces that feel like physical glass panels floating in a darkened environment.

## Colors
The palette is rooted in an ultra-dark spectrum to minimize ocular strain and maximize perceived premium value. 

- **The Foundation:** We use a "triple-black" layering strategy. `#0A0A0B` serves as the canvas, `#111214` for primary containers, and `#18191C` for interactive or secondary elements.
- **The Light:** High-contrast white is reserved for primary information. Accents are not used as solid fills but as **photographic radial light blooms** (Cool Blue, Soft White, Warm Amber) placed strategically behind panels to create a 3D depth effect.
- **The Borders:** Borders must remain whisper-thin and semi-transparent (`rgba(255,255,255,0.08)`) to define edges without breaking the immersive dark flow.

## Typography
The typography system utilizes **Geist** for its technical precision and editorial feel. 

- **Headlines:** Use `text-white` with `font-semibold`. Tighten tracking (`tracking-tight`) to create a compact, authoritative look reminiscent of high-end magazines.
- **Body Text:** Use `text-zinc-400`. This ensures legibility while maintaining the dark atmosphere by avoiding the harshness of pure white on black.
- **Metadata & Labels:** Use `text-zinc-500` at `xs` size. These must be `uppercase` with a wide `0.18em` letter-spacing to act as structural anchors for the layout.

## Layout & Spacing
The layout follows a **Fluid Grid** philosophy with generous breathing room. Elements are grouped into distinct floating modules rather than a continuous flat surface.

- **Desktop:** A 12-column grid with 24px gutters. Use large margins (40px+) to allow the background light blooms to bleed into the view.
- **Mobile:** Transition to a 4-column grid. Reduce page margins to 20px but maintain internal panel padding to preserve the "premium" feel.
- **Rhythm:** Use a strict 8px-based spatial system. Stack elements with `stack-md` (16px) for related content and `stack-lg` (32px) to separate logical sections.

## Elevation & Depth
Depth is the core differentiator of this design system. It is achieved through **Optical Layering** rather than traditional drop shadows.

1.  **Level 0 (Canvas):** Base background `#0A0A0B`.
2.  **The Bloom Layer:** Large, blurry radial gradients (`blur-3xl`) positioned behind Level 1 panels. These provide the "cinematic" lighting.
3.  **Level 1 (Panels):** Background `#111214`. These have a soft white border (`0.08` opacity) and a subtle **inner gradient** (top-down) to simulate a physical edge catching light.
4.  **Level 2 (Interactions):** Popovers and tooltips use `#18191C` with a `backdrop-blur-xl` to subtly reveal the light blooms behind them, creating a frosted glass effect that isn't overwhelming.

## Shapes
The design system uses a signature **Extra-Rounded** language to soften the industrial nature of the dark theme.

- **Primary Panels:** Use a radius of `24px` to `28px` (rounded-2xl).
- **Secondary UI (Inputs/Buttons):** Use a radius of `12px` (rounded-xl).
- **Small Elements (Chips/Tags):** Use a full pill-shape to provide visual contrast against the large rectangular panels.

## Components
- **Panels:** Dark, rounded containers with a subtle inner glow on the top edge. No external drop shadows; depth is provided by the light bloom behind the panel.
- **Buttons:** Primary buttons should use a soft white fill with black text. Secondary buttons are "ghost" style with a `1px` border of `rgba(255,255,255,0.15)`.
- **Input Fields:** Deep backgrounds (`#0A0A0B`) with a very subtle border. On focus, the border opacity increases, and a faint outer glow matching the accent bloom color is applied.
- **Chips:** Small, pill-shaped elements with `text-zinc-500` and a dark-grey background (`#18191C`).
- **Data Lists:** Use thin divider lines (`rgba(255,255,255,0.05)`) and ensure UI labels (uppercase) are used as headers for each column to maintain the editorial hierarchy.