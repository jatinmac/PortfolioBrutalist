# Agent Instructions

This file is the working guide for agents editing the Jatin Davis Design portfolio. Keep changes aligned with the existing React/Vite app instead of introducing a new product direction or framework.

## Project Snapshot

- App type: single-page personal portfolio for Jatin Davis.
- Framework: React 19 with Vite.
- Entry points: `src/main.jsx`, `src/App.jsx`, and `index.html`.
- Styling: plain CSS imported by component files. Do not add Tailwind, CSS-in-JS, or a UI kit unless the user explicitly asks.
- Icons: `lucide-react`.
- Main sections: `Home`, `About`, `Work`, and `Contact`, controlled by tab state in `src/App.jsx`.
- Build output: `dist/` is generated. Do not edit built assets by hand.

## Commands

- Install dependencies: `npm install`
- Start local development: `npm run dev`
- Production build: `npm run build`
- Lint: `npm run lint`
- Preview a production build: `npm run preview`

Run `npm run build` before handing off meaningful UI or behavior changes. Run `npm run lint` when touching React or shared logic.

## Current App Architecture

- `src/App.jsx`
  - Owns active tab state, tab transition state, theme state, and sound state.
  - Lazy-loads `AboutPage`, `WorkPage`, and `ContactPage` with `React.lazy` and `Suspense`.
  - Renders the fixed navbar, main tab panel, global footer, theme buttons, and sound toggle.
  - Implements the home hero word reveal and Pong-style ball interaction.
- `src/components/Navbar.jsx`
  - Defines the tab list: `Home`, `About`, `Work`, `Contact`.
  - Implements a sliding 3D pill highlight, roving tabindex, arrow-key navigation, and a `/resume.pdf` link.
- `src/components/AboutPage.jsx`
  - Renders the profile bento grid.
- `src/components/WorkPage.jsx`
  - Renders the project accordion, previous/next controls, and project-detail modal.
  - Uses a portal for the modal and handles body scroll lock, Escape close, focus trap, and focus return.
- `src/components/ContactPage.jsx`
  - Renders contact bento cards, social links, and copy-to-clipboard controls.
- `src/data/projects.js`
  - Source of truth for portfolio project content shown on the Work page.
- `src/utils/sound.js`
  - Procedural Web Audio API sound effects. No audio assets are required.

## Styling Rules

- Keep global design tokens and base utilities in `src/index.css`.
- Keep layout-level app styles in `src/App.css`.
- Keep component styles in the matching component CSS file.
- Shared About/Contact bento styles belong in `src/components/bento.css`.
- Preserve the existing visual language: compact, premium, glassy surfaces; dark-first theme; light theme overrides via `:root.light`; electric blue accent; restrained typography.
- Use existing CSS variables before adding new hard-coded colors:
  - `--bg-primary`
  - `--bg-secondary`
  - `--accent-color`
  - `--accent-rgb`
  - `--text-primary`
  - `--text-secondary`
  - `--text-muted`
  - `--border-color`
  - `--transition-spring`
  - `--transition-smooth`
- Keep responsive behavior consistent with existing breakpoints, especially `max-width: 768px` and the navbar's smaller mobile breakpoints.
- Do not use oversized marketing sections, decorative card stacks, or unrelated hero layouts. The app is already the portfolio experience, not a landing page template.

## Interaction and State

- Theme is persisted in `localStorage` under `theme` and applied by toggling `:root.light`.
- Theme switching uses `document.startViewTransition` when available and when reduced motion is not requested.
- Sound is persisted in `localStorage` under `soundEnabled`.
- Tab transitions are timed to the CSS animation duration in `src/App.jsx` and `src/App.css`; update both if the timing changes.
- The home Pong animation respects `prefers-reduced-motion` by shortening reveal and animation durations.
- Work page project navigation wraps from first to last and last to first.
- Modal behavior should remain accessible: Escape closes, Tab stays trapped inside the modal, scroll is locked behind the modal, and focus returns to the opening button.

## Content and Assets

- Project content belongs in `src/data/projects.js`.
- Project image paths are absolute public paths such as `/double-ai.webp`; matching source images live in `public/`.
- Prefer the existing `.webp` assets for runtime UI. The `.png` files are also present in `public/`, but the current app uses `.webp`.
- Public files currently expected by UI:
  - `/double-ai.webp`
  - `/maruti-suzuki-smartplay-pro-x.webp`
  - `/formula-1-design-youtube.webp`
  - `/quilo.webp`
  - `/u3k-instrument-cluster.webp`
  - `/resume.pdf` for the navbar resume link
- Keep public case-study copy NDA-safe where a project is marked under development.
- When editing contact details, make the displayed text and copied clipboard value match.

## Accessibility and Semantics

- Keep the skip link in `src/App.jsx`.
- Keep tab panels wired with `role="tabpanel"`, `aria-labelledby`, and matching tab IDs.
- Keep navbar tabs as real buttons with `role="tab"` and roving tabindex behavior.
- Icon-only buttons must have descriptive `aria-label` values.
- Background images used as project visuals currently use `role="img"` with `aria-label`; keep labels descriptive when adding new visuals.
- Preserve visible focus states from `src/index.css`.
- Respect `prefers-reduced-motion` for new animations.

## SEO and Metadata

- Page metadata lives in `index.html`.
- Keep the title and description aligned with the actual portfolio positioning and visible content.
- The current metadata emphasizes design engineering, interaction design, React/Vite, spring physics, and Web Audio.
- If changing major content, update metadata in the same change.

## Editing Guidelines

- Prefer small, focused edits that follow the existing file boundaries.
- Do not introduce routing libraries unless the user asks; the app is currently tab-based.
- Do not introduce external state management; local React state is enough for the current app.
- Do not edit `dist/` directly.
- Keep comments only where they clarify timing, accessibility, or non-obvious interaction behavior.
- Use lucide icons for new icon buttons when a suitable icon exists.
- Verify the rendered UI on desktop and mobile when changing layout, navigation, modal behavior, or animation.
