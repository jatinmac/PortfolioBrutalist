# Repository Guidelines

## Project Structure & Architecture

This is a React 19 + Vite single-page portfolio site for Jatin Davis. The app is section-based, with no router. `src/App.jsx` owns the page shell, active nav tracking, smooth section navigation, theme persistence, font scaling, and project modal state.

Primary source areas:

- `src/main.jsx`: React entrypoint.
- `src/App.jsx`: top-level app composition and cross-section state.
- `src/sections/`: page sections (`HomeSection`, `AboutSection`, `ProjectsSection`, `ContactSection`).
- `src/data/siteContent.js`: navigation labels, hero/about/contact copy, project card groups, YouTube ticker data, and resume import.
- `src/data/projects.js`: detailed work project content used by `ProjectModal`.
- `src/images/`: imported portfolio imagery. Keep image filenames stable unless all imports are updated.
- `src/data/jatindavisresume.pdf`: bundled resume download asset.

The local design system lives in `src/ds/`:

- **Navigation & Layout**: `Navbar`, `NavTab`, `Footer`, `Section`, `SkipLink`.
- **Controls & Cards**: `Button`, `ControlButton`, `ProjectCard`, `ProjectModal`.
- **Visual Effects**: `CustomCursor`, `DotShaderBackground`, `HeroDotShader`, `VideoTicker`, `Icon`.
- **Exports**: update `src/ds/index.js` when adding or removing design-system components.
- **Styling**: design tokens live in `src/ds/tokens.css`; shared DS component styles live in `src/ds/components.css`; section/page layout styles live in `src/App.css`; base reset and focus styles live in `src/index.css`.

The production build output is generated in `dist/`; do not edit it directly. There is currently no root `public/` asset workflow in use.

## Build, Test, and Development Commands

- `npm install`: install dependencies when `node_modules` is missing or package files changed.
- `npm run dev`: start the Vite development server.
- `npm run build`: create a production build in `dist/`.
- `npm run preview`: serve the production build locally.
- `npm run lint`: run ESLint across the project.

Run `npm run build` before UI or behavior handoffs. Run `npm run lint` when touching React, CSS, config, or content modules that affect rendered UI.

## Coding Style & Styling Rules

Use React function components and hooks. Keep components accessible, semantic, and small enough to stay understandable. Do not add routing, Tailwind, CSS-in-JS, external state management, or UI kits unless explicitly requested.

Use `lucide-react` for icons. Preserve the existing dark-first token model, `:root.light` overrides, CSS variables, `--font-scale`, and the `768px` mobile breakpoint. Prefer explicit CSS transitions and stable layout primitives. Avoid heavy, layout-blocking animation and respect `prefers-reduced-motion` when adding motion.

When changing content, prefer editing `src/data/siteContent.js` or `src/data/projects.js` instead of hard-coding copy in components. When adding project cards, make sure card `id` values align with modal details where a modal should open.

## Performance Guidelines

Keep the initial bundle lean. Avoid heavy external libraries. Imported images are bundled by Vite, so use appropriately sized assets and keep `loading="lazy"` behavior for non-critical imagery. Be careful with cursor, shader, ticker, and modal changes because they run across the main experience.

## Testing Guidelines

There is no automated test suite. For visual or interaction changes, validate desktop and mobile in a browser.

Check:

- Section scrolling and active tab highlight tracking in `Navbar`.
- Smooth scrolling from nav tabs, hero CTA, and contact previous/next controls.
- Functional dark/light theme toggle and persistence.
- Footer font size decrease/reset/increase controls and `--font-scale` behavior.
- Work project modal open/close, ESC key close, focus trap, scroll lock, and focus restoration.
- Build project cards opening external links correctly.
- Video ticker rendering in the Builds section.
- Full viewport responsiveness at and below `768px`.
- Keyboard focus states, skip link behavior, and linter compliance.

## Content, Assets & Accessibility

Keep the skip link, ARIA labels, dialog attributes, keyboard focus states, and visible focus rings intact. Update `index.html` metadata when the site positioning, title, description, or keywords change.

Project images are imported from `src/images/`; about images are under `src/images/about/`; build images are under `src/images/builds/`. Use descriptive alt text through existing component props and content data. Keep external links marked as external where the existing `Button` or `ProjectCard` APIs support it.

## Commit & Pull Request Guidelines

Recent commits use short imperative summaries such as `Clean up unused design system components`. Keep commits focused and descriptive of structural changes. Do not include generated build output, dependency folders, or temporary files unless explicitly requested.

## Agent-Specific Notes

Do not overwrite unrelated local edits. Inspect current diffs before changing shared files. In this workspace, `.vscode/` may be untracked local editor state; leave it alone unless the user explicitly asks for editor config changes.
