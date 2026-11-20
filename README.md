# Shiro Sumi (炭)

Concept website for a fictional Indonesian-Japanese charcoal grill. Portfolio case study #2 by [Shiro Labs](https://shiro-labs.tech).

**This is an honest concept project.** The restaurant does not exist. Menu, prices, hours, address, contact email and all names are illustrative. Currency conversions are approximate (reference: 1 USD ≈ Rp 16,300 ≈ ¥150). Indonesian and Japanese copy is awaiting native review.

## Stack
Static HTML, CSS and vanilla JS. No build step.

- 4 pages: Home, Menu, Story, Reserve, with a shared nav and footer
- EN / ID / JA switcher saved in `localStorage` (`sumi-lang`); USD, IDR and JPY per language
- Canvas ember background that reacts to the pointer; ignition loader (once per session)
- Honours `prefers-reduced-motion`: no loader, static embers, no reveal motion
- Self-hosted fonts (Fraunces, Instrument Sans, Shippori Mincho, Zen Kaku Gothic New; SIL OFL via Fontsource), JA files subset to the glyphs used
- Stylized map is an SVG illustration, not real geography; no photos (SVG and CSS art only)
- The reservation form is a concept and sends nothing

## Run
```
python3 -m http.server 8000
```

## Testing
Checked with Playwright in EN, ID and JA at 390, 430, 600, 768, 1024, 1280 and 1680px for horizontal scroll and text overflow, plus reduced-motion, language persistence, mobile nav and form validation.
