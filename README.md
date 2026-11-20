# Shiro Sumi (炭)

Concept case study by Shiro Labs: a fictional Indonesian-Japanese binchotan grill in Surabaya. Not a real restaurant.

## Stack
Vite 7 multi-page static site, GSAP + ScrollTrigger, Lenis, split-type. EN / ID / JA via `src/i18n.js`.

## Structure
- `tools/build.py` generates the HTML pages (run first), `tools/fonts.py` subsets and self-hosts fonts.
- `src/` style, motion, i18n. `public/fonts/` self-hosted fonts.
- `docs/` audit, research and motion spec.

## Run
    python3 tools/fonts.py && python3 tools/build.py
    npm install && npm run dev

## Photography
Hotlinked from Unsplash with photographer credits in the site footer.
