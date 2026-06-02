# Repository Guidelines

## Project Structure & Architecture

This is a React 19 + Vite single-page portfolio. `src/App.jsx` owns tab, theme, sound, font scale, page-loading state, and the desktop-only page preview carousel. Page components live in `src/components/` with matching CSS. Portfolio case-study content is in `src/data/projects.js`; the Builds tab currently keeps its build-card data in `src/components/BuildsPage.jsx`. Web Audio helpers are in `src/utils/sound.js`. Assets are served from `public/`. `dist/` is generated output; do not edit it directly.

## Build, Test, and Development Commands

- `npm run dev`: start Vite locally.
- `npm run build`: create `dist/`.
- `npm run preview`: serve the production build.
- `npm run lint`: run ESLint.

Use `npm install` when dependencies are missing. Run build before UI or behavior handoff, and lint when touching React, shared logic, or config.

## Coding Style & Styling Rules

Use React function components with hooks. Component files use PascalCase, for example `WorkPage.jsx`; utilities and data files use descriptive lowercase names. Keep global tokens in `src/index.css`, app layout and carousel preview styles in `src/App.css`, component styles beside JSX, and shared bento styles in `src/components/bento.css`.

Do not add Tailwind, CSS-in-JS, routing, external state management, or a UI kit unless requested. Use `lucide-react` for new icon buttons. Preserve the dark-first visual language, `:root.light` overrides, CSS variables, `max-width: 768px` mobile breakpoint, and the `min-width: 1340px` / fine-pointer desktop carousel threshold. Prefer explicit transitions and avoid stacked `backdrop-filter`, animated blur, 3D transforms, and persistent `will-change`.

## Testing Guidelines

There is no automated test suite yet. For visual or interaction changes, validate desktop and mobile in a browser. Check console errors, tab navigation across Home, About, Work, Builds, and Contact, desktop preview carousel behavior on wide viewports, project wrapping, modal behavior, focus return, scroll lock, theme/sound/font controls, and image loading.

## Content, Assets & Accessibility

Project content belongs in `src/data/projects.js`; Builds card content belongs in `src/components/BuildsPage.jsx` until a shared data file is introduced. Use absolute public image paths such as `/double-ai.webp` and prefer existing `.webp` assets. For PNG fallbacks such as `/aitwin.png`, keep the optimized WebP companion such as `/aitwin.webp` referenced first via `image-set(...)`. Keep contact display text and clipboard values in sync. Keep the navbar local resume download path aligned with the PDF in `public/`, and keep the external resume URL in `Navbar.jsx` intentional if it changes.

Preserve the skip link, tab/tabpanel ARIA wiring, roving tabindex, carousel preview button labels, icon `aria-label`s, modal focus trap, and focus styles. New animations must respect `prefers-reduced-motion` and the existing touch/mobile performance guards. Metadata lives in `index.html`; update it when content positioning changes.

## Commit & Pull Request Guidelines

Recent commits use short imperative summaries such as `Update portfolio interaction and case studies`. Keep commits focused. PRs should include a summary, changed surfaces, validation commands, and screenshots for UI changes. Mention untested viewports or performance risks.

## Agent-Specific Notes

Do not overwrite unrelated local edits. Inspect current diffs before changing shared data or assets. Keep generated files, traces, and screenshots out of the repo unless intentionally part of the change.
