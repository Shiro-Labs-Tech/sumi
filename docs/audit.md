# Audit: Shiro Sumi, first iteration

Method: Chrome 153 via Playwright, 390 / 820 / 1280 / 1680 wide, EN and JA, three scroll positions per page (96 captures), plus a Lighthouse mobile run on the home page against a local static server. Screenshots live outside the repo; the before/after set is in `docs/shots/` at the end of the revision.

## Verdict

It is clean and bug-free, and it reads as a template. A visitor would not say "agency-grade" in 3 seconds. The hero has one good idea (a glowing 炭 inside an ember ring) and then the page falls into the standard restaurant skeleton: hero, three columns, a cream band with a list, an orange CTA strip, a footer. Nothing on the page is specific to this restaurant except the copy.

## Issues, ranked by visual impact

1. **No imagery at all.** A restaurant site with no food, fire or room is the biggest gap. Type and ember dots carry the whole page. Awwwards-level restaurant sites live on photography treated with art direction (duotone, grain, masks, reveals).
2. **Section layouts are generic.** "01 / 02 / 03" three-column pillars, a three-column dish list, a three-stat strip, a three-item rules list and a full-width CTA band. Every section is the same rhythm: eyebrow, H2, three equal columns. No scale contrast, no overlap, no asymmetry, no full-bleed moments.
3. **Motion is shallow.** What exists: a loader ring, an ember canvas, a slowly rotating ring, a ticker, and fade-up reveals. The reveals are the only scroll behaviour, and fade-in-on-scroll does not count. No smooth scroll, no split-text headline, no pinned or scrubbed section, no horizontal gallery, no cursor interaction on content, no page transitions, no magnetic or custom cursor. Page changes are hard reloads with a blink.
4. **Type is good but under-used.** Fraunces plus Instrument Sans is a competent pairing, but every heading is the same size and weight at the same measure. No oversized display moment, no italic or soft-axis contrast, no outlined or mixed-weight lines. The JA headline looks loose because letter-spacing is not tuned for Shippori Mincho at display size.
5. **Palette is safe.** Dark brown plus cream plus orange is correct for a grill and also what every grill template uses. The orange CTA band is the one loud block and it feels pasted on. Cream and dark sections alternate in hard rectangles with no transition.
6. **The ember canvas is wallpaper.** Dots drift behind content at low opacity. They react to the pointer a little, but they never touch the content, and on paper-coloured sections they vanish, so the effect disappears halfway down the page.
7. **Menu page is a plain list.** It is readable and accessible, but it has no sense of a menu as an object: no imagery, no price-hover interaction beyond a faint glow, no category transitions.
8. **Reserve page** is a standard dark form. The stylized map is nice but small and static.
9. **Footer and legal copy** are honest but visually dead.

## Motion that exists today

| Element | Technique | Verdict |
| --- | --- | --- |
| Loader | SVG ring stroke draw plus core glow, once per session | Fine, but short on payoff, ends in a plain translate-up |
| Hero mark | CSS ring rotation, glyph glow pulse | Pleasant, decorative |
| Embers | Full-page canvas, pointer flare | Costly (see Lighthouse), invisible on paper sections |
| Ticker | CSS marquee | Fine |
| Reveals | IntersectionObserver fade and 22px rise | Generic |
| Dish rows | Pointer-following radial glow | Subtle, good seed to build on |

## Bugs and measurements

- **Overflow, clipping, console errors:** none found in 96 captures (EN and JA, four widths) and none in the earlier ID sweep. No console errors or warnings.
- **Layout shift:** CLS 0.
- **Contrast:** Lighthouse accessibility 100 on the home page. Known weak spots to recheck by hand: `--mute` (#a99f92) at small sizes on `#140f0c` is about 7:1 and passes; gold eyebrow on cream (not used) and ember `#b8401e` text on cream is about 4.6:1, borderline at 12 to 13px.
- **Japanese typography:** the `¥` and `≈` glyphs fall back to a different font than the Zen Kaku slices, so prices look slightly off in JA. The H1 breaks inside "ほんの少しの" at some widths.
- **Header on paper pages:** now solid, fine.

### Lighthouse mobile, home page (local, headless, emulated slow 4G and 4x CPU)

| Category | Score |
| --- | --- |
| Performance | **37** |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

FCP 1.7 s, **LCP 6.1 s**, **TBT about 61 s**, speed index 20 s, CLS 0.

Performance is the real failure and it is self-inflicted. The suspect is the ember canvas: every particle sets `shadowBlur` and `shadowColor` inside the frame loop, which forces a software blur per particle per frame. Headless Chrome with throttled CPU exaggerates it, but the cost is real on low-end phones. The loader also holds the hero hidden for 1.7 s, which pushes LCP. Target for the revision: mobile 85 or better, by replacing per-particle shadow blur with pre-rendered sprites (or a small WebGL shader), capping the pixel ratio, and not gating LCP on the loader.

## What to keep

Structure, copy, i18n (EN, ID, JA, localStorage, currency per language), the 炭 mark, the honest-concept labelling, self-hosted subset fonts, the Playwright harness, Vercel config.
