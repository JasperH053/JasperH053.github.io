# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

The git root is `JasperH053.github.io/`; the Vue app lives in the `portfolio/` subdirectory. All npm commands run from `portfolio/`. The GitHub Actions workflow is at the repo root (`../.github/workflows/deploy.yml`).

## Commands

```sh
npm install                 # no lockfile is committed; CI uses `npm install --legacy-peer-deps`
npm run dev                 # Vite dev server on :5173
npm run build               # vue-tsc type-check and vite build in parallel → dist/
npm run type-check          # vue-tsc --build only
npm run lint                # oxlint then eslint, both with --fix (they modify files)
npm run preview             # serve dist/ on :4173

npx playwright install      # first run only
npm run test:e2e                              # all browsers (chromium, firefox, webkit)
npm run test:e2e -- --project=chromium        # one browser
npm run test:e2e -- e2e/vue.spec.ts           # one file
npm run test:e2e -- -g "redirects the root"   # one test by name
```

Playwright starts its own server: `npm run dev` locally (reusing one already running), or `npm run preview` when `CI` is set, so run `npm run build` before e2e tests in CI mode. There is no unit-test runner.

## Architecture

Vue 3 + TypeScript + Vite single-page app using Pinia and Vue Router, scaffolded with `create-vue`. `src/main.ts` installs Pinia and the router and mounts `App.vue`. The `@/` alias maps to `src/` (set in both `vite.config.ts` and `tsconfig.app.json`).

Routes: `/` and unknown paths redirect to `/home`; `/home`, `/about` and `/projects` are lazy-loaded views in `src/views/` that wrap their content in `PagePanel`. The pages form a story: `PagePanel`'s `next` prop adds a "Volgende" cloud button to the next page (home → about → projects; projects has none). `App.vue` renders `SkyBackground` outside `RouterView`, so the sky canvas stays mounted across page changes (an e2e test checks this).

Pixel-art rendering:
- `src/composables/usePixelCanvas.ts` sizes a canvas so one canvas pixel is one art pixel (`PIXEL` CSS px, from `src/pixel/constants.ts`, must match `--pixel`), follows its parent element's size via `ResizeObserver`, and exposes `toGrid()` for pointer → art-pixel coordinates. `preserve: true` keeps existing pixels on resize.
- `src/pixel/` holds the drawing code: clouds (`cloud.ts`), sun, mountain ranges, and character-grid sprites (`sprite.ts`, used by the hiker in `hiker.ts`). Randomness always comes from the seeded RNG in `rng.ts`, so the scene looks the same on every load. Clouds and mountain peaks are placed per fixed grid cell, so resizing never moves them.
- The nav links (`NavBar.vue`) and the "Volgende" button (`PagePanel.vue`) are `RouterLink`s with hand-made pixel-art PNGs from `src/assets/clouds/` as CSS backgrounds. The PNGs are drawn at 1×; their size in image pixels is written in the CSS and multiplied by `--pixel`, so a new or resized image needs its size updated there. In the nav, the image sits in `::before`, so hover images of a different size don't shift the layout.
- Canvas colors come from the CSS variables in `src/assets/styles.css` via `readPalette()`; that file is the only place colors are defined.
- `SkyBackground` is a fixed, `pointer-events: none` stack of canvas layers, back to front: `SkyLayer` (sky + sun), `CloudLayer`, `MountainLayer` (two ranges + the hiker on a far peak). They sit in `.sky__scene`, which is drawn at `--backdrop-opacity` over `--backdrop` so the page content stands out.
- `CloudLayer` is the only animated layer: two parallax depths drift left over time, in whole art pixels, redrawing only when a depth moves a pixel. It stays still when `prefers-reduced-motion` is set.
- The planned drawing feature (brush, colors, eraser) should be a separate canvas layer after `.sky__scene` (so it isn't dimmed), built on `usePixelCanvas` with `preserve: true`.

TypeScript uses project references: `tsconfig.app.json` covers `src/` (with `noUncheckedIndexedAccess` enabled), `tsconfig.node.json` covers the tool config files, and `e2e/tsconfig.json` covers the tests.

Linting: oxlint runs first (config in `.oxlintrc.json`), and `eslint-plugin-oxlint` turns off the ESLint rules oxlint already covers. ESLint adds `vue/flat/essential`, the TS recommended rules, and Playwright rules for `e2e/`. There is no Prettier; formatting follows `.editorconfig` (2-space indent, LF, 100-char lines).

## Deployment

Pushing to `main` triggers `deploy.yml`, which builds with Node 24 and publishes `portfolio/dist` to GitHub Pages. This is a user site (`JasperH053.github.io`), so it is served from the domain root and Vite's default `base: '/'` is correct. The router uses `createWebHistory`; because GitHub Pages has no SPA fallback, the workflow copies `dist/index.html` to `dist/404.html` so deep links and reloads still load the app.

## Style
- Everything is pixel art. Sharp pixels, no smooth shapes.
- Use `image-rendering: pixelated` for all pixel images and canvases.
- Limited color palette: light blue for the sky, white and light gray for clouds,

a dark color for text. No gradients, no shadows, no blur.
- Animations only if I ask for them, and then in pixel steps (steps()), not smooth.
- Font: a legible pixel font, such as Pixelify Sans or VT323.
- Scoped CSS, no UI-libraries
- colors as CSS-variables at one place
- Do not write text for the site, use short placeholders.
- Ask first before installing packages.

No Press Start 2P for body text.