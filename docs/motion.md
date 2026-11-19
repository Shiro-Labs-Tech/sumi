# Motion spec: Shiro Sumi revision 1

Written before coding. Techniques from the sources in `docs/research.md` (M1 to M6); all code is original. Rule for everything: animate `transform`, `opacity`, `clip-path` only, reserve space so there is no layout shift, and every item has a `prefers-reduced-motion` and touch fallback.

## Stack
- `gsap` 3.15.1 plus `ScrollTrigger`, `lenis` 1.3.27, `split-type` 0.3.4, bundled with a small Vite build (output `dist`, Vercel framework preset Vite). No CDNs.
- One shared ticker: `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)` (Lenis README, GSAP forum).
- `matchMedia`: `(hover:hover) and (pointer:fine)` enables Lenis, custom cursor, magnetic, pointer-reactive hero. `(prefers-reduced-motion: reduce)` disables all of it and shows final states.

## Minimum set, with specifics

| # | Item | Spec | Fallback |
|---|---|---|---|
| 1 | Preloader | Ember ring draws, 炭 resolves, curtain lifts. 1.6s total, hard cap 2.2s. Does not gate LCP: hero image is already painting under the curtain. Skipped when `sessionStorage sumi-loaded` is set. | Reduced motion and repeat visits: none. |
| 2 | Interactive hero | WebGL-free canvas ember field. Pre-rendered glow sprites (no shadowBlur), 90 particles desktop, 36 mobile, DPR capped at 1.5. Pointer attracts and brightens nearby embers. Parallax layers (photo, smoke, glyph) shift with pointer by a few px. | Touch: slow self-drift only, no pointer. Reduced motion: one static frame. |
| 3 | Smooth scroll | Lenis, duration 1.1, anchored links use `lenis.scrollTo`. | Touch and reduced motion: native scroll. |
| 4 | Split-text headlines | split-type to lines, then chars for H1 only. Chars rise from `yPercent:110` inside `overflow:clip` masks, stagger 0.018. Re-split on language change and on resize (debounced). JA splits by char, never mid-word for latin. | Reduced motion: plain text. Split reverted if `document.fonts` not ready. |
| 5 | Set piece A: pinned fire | `ScrollTrigger` pin, scrub, `end:+=220%`. A `clip-path: inset()` slot opens from a small ember-shaped window to full bleed (M2). Three copy lines swap by timeline label. Image scale 1.25 to 1. | Reduced motion and small screens under 700px: static full image with the copy stacked. |
| 6 | Set piece B: horizontal dish gallery | Pinned container, `x` tween across the track, scrub 0.6 (M1/M2 pattern). Per-card image counter-shift for depth. Progress bar. | Under 900px: native horizontal scroll-snap, no pin. |
| 7 | Set piece C: coal grid reveal | Grid of cells over a fullscreen image, cells clip away in a wave from the cursor side (M1 idea, own implementation). | Reduced motion: image shown. |
| 8 | Counters | Stats 12 / 1 / 6 count up on enter, `tabular-nums`, final value in the DOM from the start for no-JS. | Reduced motion: final value. |
| 9 | Marquee | Two-line ticker, one reverses on scroll direction via Lenis velocity. CSS transform only. | Reduced motion: wraps as static text. |
| 10 | Hover with intent | Magnetic CTA (pull 0.25 within 80px), custom cursor dot that grows to a "View" ring over images, underline sweep on links via scaleX, menu row hover reveals its dish image following the cursor, image zoom 1.06 on cards. | Touch: none of the cursor items. Menu rows tap to expand. Focus-visible styles always present. |
| 11 | Page transitions | `@view-transition { navigation: auto; }` plus `pageswap`/`pagereveal` to name the dish image so it travels between home and menu (M5 concept, M6 API). Firefox fallback: GSAP curtain on link click, 450ms, then navigate. 4s timeout respected. | Reduced motion: instant navigation. |
| 12 | Map route | SVG route path `stroke-dashoffset` drawn on scroll. | Reduced motion: drawn. |

## Cut, and why
- Three.js or shader hero: weight and mobile risk against the Lighthouse 85 target. The sprite canvas gets most of the feel.
- ScrollSmoother: Lenis already covers smoothing and keeps native sticky.
- Smooth scroll on touch: iOS momentum scrolling is better than any JS version and the GSAP forum advises against it.

## Performance guards
- Embers and pointer loops pause when the tab is hidden or the hero is off screen (IntersectionObserver).
- `will-change` only on pinned and scrubbed elements, removed after.
- Fonts preloaded (display and body latin). Images lazy except the hero, `fetchpriority=high` on the hero.
- `ScrollTrigger.refresh()` after fonts and images settle, and on language change.

## Test plan
- Playwright scroll-through capture at 1440 and 390, asserting transforms change (pins engage, gallery x moves, counters reach targets).
- Console clean, CLS under 0.05, overflow sweep EN/ID/JA at 390 to 1680, reduced-motion run, Lighthouse mobile 85+.
