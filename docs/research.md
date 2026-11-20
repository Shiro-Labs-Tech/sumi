# Shiro Sumi: research for revision 1

Date: 2026-11-19. Concept project, no real client.

## 0. Limits of this research (read first)

I could not open most gallery pages visually. Fetches for godly.website, siteinspire category pages, gaggan.com, several Awwwards site pages and the GSAP and Lenis docs were refused as "not on allowlist", and Awwwards' search endpoint is blocked by robots. What I have is search-result metadata (titles, award labels, dates, descriptions, palette hex values that Awwwards publishes, tutorial summaries). So:

- Claims below about each reference are tied to what that metadata says (award, subject, palette, tech tags) plus what the cited tutorials describe. I did not watch these sites scroll, and I say "unverified visually" where it matters.
- The brief asked for Godly, Siteinspire, Httpster and Land-book. Searches against those four returned nothing usable (Land-book and Godly returned only generic template roundups). That part of the brief is **not met**. Awwwards is the only gallery I could sample.
- Nothing here is copied. Each entry says what I borrow in spirit and nothing more.

## 1. Reference sites (10)

### Awwwards-listed, Japanese or fire-led restaurants

| # | Reference | URL | What the listing tells me works | Borrow in spirit |
|---|---|---|---|---|
| 1 | Akaneya | https://www.awwwards.com/sites/akaneya | Sumibiyaki (charcoal grill) restaurants in Barcelona, Madrid, Paris, inspired by Kyoto izakaya. Palette listed as warm off-white #FFFCF9. Closest subject match to us. Visual execution unverified. | Treat charcoal as the brand idea, not a texture. Light and dark sections that alternate as "smoke and paper". |
| 2 | KAIJU (Honorable Mention, 1 Apr 2025) | https://www.awwwards.com/sites/kaiju | Thai-Japanese fusion in KL, described as bold flavours in an art-inspired setting. Proof that a cross-cultural kitchen can win on personality, which is our Indonesian-Japanese angle. | Cross-cultural identity shown through one confident graphic system, not flags and clichés. |
| 3 | THE CULT Japanese Restaurant (HM, 6 Mar 2023) | https://awwwards.com/sites/the-cult-japanese-restaurant | Fictional restaurant concept that still earned an HM. Palette is just two colours, #FAF5E5 and #201B19. | A two-colour discipline: near-black and warm paper, with one accent. Also: fictional concepts can be taken seriously by the jury. |
| 4 | Honō Restos | https://www.awwwards.com/sites/hono-restos | Japanese tavern and ramen microsites, black base (#000). Separate microsites per venue. | Strong black ground, heat colour used sparingly. |
| 5 | Hotarutei | https://www.awwwards.com/sites/hotarutei | A 170-year-old house turned into a modern Japanese restaurant with a private villa. Heritage plus modern is the story. | Story-first pacing: place and history before menu. |
| 6 | Umami Land (SOTD, 1 Feb 2021) | https://www.awwwards.com/sites/umami-land | Immersive Japanese cuisine site; Awwwards lists video elements and an immersive layout. | Immersion through one continuous scene rather than stacked sections. |
| 7 | Paris Yugao Ginza | https://www.awwwards.com/sites/paris-yugao-ginza | Awwwards publishes its font set; the listing is built around Art Nouveau meeting Japanese tradition in one space. | Type does the cultural blend: a serif display with Japanese mincho, not decoration. |

### Real top-tier restaurant sites

| # | Reference | URL | What works | Borrow in spirit |
|---|---|---|---|---|
| 8 | Noma | https://noma.dk | A roundup (magier.com) describes the homepage as leading with a single story and one booking action, and selling products without becoming a shop. | One primary action (Reserve) always visible. One story per screen. |
| 9 | Pujol | https://pujol.com.mx (domain from memory, not fetched) | A HubSpot roundup describes full-screen kitchen video on landing, then menus, location and reservation links only. Not verified by me. | The kitchen is the hero. Our version: fire and embers, not stock video. |
| 10 | Maaemo (SOTD, 6 Dec 2014) | https://www.awwwards.com/sites/maaemo-restaurant | Three-colour palette (#000, #9C9C9C, #fff). Old, but the restraint is the point. | Restraint. Fewer elements, more air. |

## 2. Motion study (6)

| # | Source | URL | Technique | How we use it (original code) |
|---|---|---|---|---|
| M1 | Codrops, "SVG Mask Transitions on Scroll with GSAP and ScrollTrigger" (Hiroki Watanabe, 11 Mar 2026) | https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/ | Four scroll-driven fullscreen image reveals with SVG masks, grid and blind patterns, scrubbed by ScrollTrigger. | A "coal grid" mask: the fullscreen fire image is revealed by a grid of cells that glow out. I write the mask logic myself and use clip-path where possible. |
| M2 | Codrops Creative Hub, "Pinned image mask reveal on scroll" (gridmorphic, 5 Sep 2025) | https://tympanus.net/codrops/hub/author/gridmorphic | Pinned section, mask grows while text content flows past. | Set piece 1: pinned "The Fire" section where a clip-path inset opens from a small ember slot to full bleed while three lines of copy swap. |
| M3 | Lenis README and GSAP forum thread on Lenis + ScrollTrigger | https://github.com/darkroomengineering/lenis and https://gsap.com/community/forums/topic/38517-scrolltrigger-and-lenis/ | Sync pattern: `lenis.on('scroll', ScrollTrigger.update)`, drive `lenis.raf` from `gsap.ticker`, `gsap.ticker.lagSmoothing(0)`. Forum advice: on touch devices skip Lenis and do not combine it with `normalizeScroll`. | Lenis on fine pointers only. Native scroll on touch and under reduced motion. |
| M4 | Codrops, "Layered Zoom Scroll Effect with GSAP ScrollSmoother and ScrollTrigger" (29 Oct 2025) | https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/ | One timeline, layered elements scale at different rates for depth. | Hero depth: smoke, ember layer and the 炭 glyph scale and drift at different rates. I do it with plain ScrollTrigger scrub, not ScrollSmoother. |
| M5 | Codrops, "Scroll-Revealed WebGL Gallery with GSAP, Three.js, Astro and Barba.js" | https://tympanus.net/codrops/?p=107628 | Shader reveal on enter, and page transitions where the clicked image travels between pages. | Concept only: the clicked dish image travels to the menu page. Done with the View Transitions API (below), no Three.js. |
| M6 | Chrome for Developers, cross-document view transitions | https://developer.chrome.com/docs/web-platform/view-transitions/cross-document | `@view-transition { navigation: auto; }`, `pageswap` and `pagereveal` events. Chrome 126+, Edge 126+, Safari 18.2+. No Firefox. | Page transitions with a GSAP curtain fallback for Firefox. |

Also noted: freefrontend's "Pinned Split-Screen Mask Reveal" (https://freefrontend.com/code/pinned-split-screen-mask-reveal-2026-02-22/) describes the same pin plus mask plus Lenis pattern at about 50KB including libraries. That is a weight budget sanity check, not code to copy.

## 3. Gap analysis

Ranked from `docs/audit.md`.

| Audit issue | Reference evidence | Fix |
|---|---|---|
| 1. No imagery | #1, #3, #8, #9: every one is image or video led | Unsplash photography (hotlinked, credited) with CSS art direction: duotone via `mix-blend-mode` and gradient overlays, grain, mask shapes. Photos of fire and skewers get an ember tint so mixed sources read as one set. |
| 2. Generic three-column rhythm | #5 story-first, #8 one story per screen | Break the rhythm: full-bleed pinned scene, oversized numbered index for dishes, asymmetric text over image, horizontal gallery. No section repeats the layout of the one before it. |
| 3. Shallow motion | M1 to M6 | Lenis, split-text headline, pinned mask reveal, horizontal gallery, counters, marquee, magnetic buttons, custom cursor, page transitions. Full spec in `docs/motion.md`. |
| 4. Under-used type, loose JA tracking | #7 | Bigger scale contrast, tighter display tracking, JA mincho sized to match latin x-height. |
| 5. Safe palette, pasted-on orange band | #3 (two colours), #10 | Cut to char, paper, ember. The CTA becomes a dark section with a live ember, not an orange slab. |
| 6. Embers as wallpaper | M4 | Embers move to the hero only and react to the pointer. Sprite based, no per-particle shadowBlur. |
| 7. Plain menu list | #8 | Menu rows get an index number, a hover image reveal that follows the cursor on fine pointers, and a tap-to-expand on touch. |
| 8. Static map | none | Keep the SVG map, add a draw-on-scroll route line. Cheap, honest, no tiles. |
| 9. Dead footer | #8 | Giant 炭 wordmark footer with a marquee line and reservation CTA. |
| Perf: Lighthouse mobile 37 | own measurement | Remove shadowBlur loop, do not gate LCP on the loader, DPR cap, lazy images, bundle gsap plus lenis plus split-type only where used. Target 85+. |

## 4. Revised design direction

**One line:** Shiro Sumi is a restaurant that exists in the half second when charcoal turns from black to orange, so the whole site is dark until something catches.

**Type** (to confirm against Shiro Labs and Shiro Gym fonts before build; I am assuming neither uses these):
- Display: **Bodoni Moda** (high contrast serif, variable, italic for emphasis). Replaces Fraunces.
- Body: **Hanken Grotesk** 400/500. Replaces Instrument Sans.
- Japanese: **Shippori Mincho** for display, **Zen Kaku Gothic New** for body (kept, already subset by glyph).
- All self-hosted from Fontsource (SIL OFL), preloaded for the first two latin files.

**Palette** (contrast computed by WCAG relative luminance):

| Token | Hex | Use | Contrast |
|---|---|---|---|
| char | #0d0a08 | background | base |
| ash | #ece2d0 | text on char | 15.37:1 |
| smoke | #9a9086 | secondary text on char | 6.30:1 |
| ember | #ff5a1f | accent, links on char | 6.33:1 on char |
| glow | #ffb347 | rare highlight on char | 11.08:1 |
| paper | #efe4cf | light sections | char on paper 15.67:1 |
| ember-deep | #b83a0e | accent on paper | 4.57:1 (passes AA for text 18px+ and UI, use bold or large only) |
| smoke-deep | #5e554b | secondary text on paper | 5.79:1 |

Dark #0d0a08 on ember #ff5a1f is 6.33:1, so ember buttons carry char text.

**Imagery treatment:** photography in dark rooms and fire, graded warm, grain overlay at low opacity, one consistent vignette. Credits in the footer and in `alt`/figcaption where it fits. Photos are placeholders for a concept, and the site says so.

**Honesty:** unchanged. Restaurant, names, prices and hours stay labelled illustrative. Unsplash credits shown.

## 5. Sources

- Awwwards listings: Akaneya, KAIJU, THE CULT, Honō Restos, Hotarutei, Umami Land, Paris Yugao Ginza, Maaemo (URLs above).
- https://www.magier.com/blog/best-restaurant-website-design-examples (Noma description)
- https://blog.hubspot.com/website/restaurant-website-design (Pujol description)
- https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/
- https://tympanus.net/codrops/hub/author/gridmorphic
- https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/
- https://tympanus.net/codrops/?p=107628
- https://github.com/darkroomengineering/lenis
- https://gsap.com/community/forums/topic/38517-scrolltrigger-and-lenis/
- https://developer.chrome.com/docs/web-platform/view-transitions/cross-document
- https://freefrontend.com/code/pinned-split-screen-mask-reveal-2026-02-22/

Licences: gsap 3.15.1 (GreenSock standard no-charge licence, https://gsap.com/standard-license), lenis 1.3.27 (MIT), split-type 0.3.4 (ISC).
