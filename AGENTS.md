# Repository Guidelines

## Project Structure & Architecture

This is a clean React 19 + Vite single-page website boilerplate. The entrypoint `src/App.jsx` manages the main website layout, theme toggles, font scaling, and section-scroll tracking. 

The Design System lives in `src/ds/` and consists of:
- **Layouts & Elements**: `Navbar`, `Footer`, `Button`, `ControlButton`, `GlassPanel`, `Text`, `BentoGrid`, `BentoItem`, `VisuallyHidden`, and `SkipLink`.
- **Styling**: Color tokens and style variables live in `src/ds/tokens.css`; component specific CSS rules live in `src/ds/components.css`.
- **Global styles**: Base resets, browser focus states, and scroll behaviors live in `src/index.css`.
- **App Layout**: Section wrappers and animations live in `src/App.css`.

All assets are served from the root-level `public/` directory. The production build output is generated in the `dist/` directory; do not edit it directly.

## Build, Test, and Development Commands

- `npm run dev`: start Vite locally.
- `npm run build`: create `dist/`.
- `npm run preview`: serve the production build.
- `npm run lint`: run ESLint.

Use `npm install` when dependencies are missing. Run the build command before UI or behavior handoffs, and lint when touching React code, configuration, or CSS files.

## Coding Style & Styling Rules

Use React function components with hooks. Keep components modular, accessible, and aligned with semantic HTML rules. 

Do not add Tailwind, CSS-in-JS, routing, external state management, or UI kits unless requested. Use `lucide-react` for icons. Preserve the dark-first visual language, `:root.light` overrides, CSS variables, and the `768px` mobile breakpoint. Prefer explicit CSS transitions and avoid heavy, layout-blocking animations.

## Performance Guidelines

Keep the initial bundle lean. Heavy external libraries must be avoided in order to maintain maximum load speeds. Keep motion transitions visually stable and respect `prefers-reduced-motion` settings.

## Testing Guidelines

There is no automated test suite. For visual or interaction changes, validate desktop and mobile in a browser. Check:
- Section-scrolling and active tab highlight tracking in the Navbar.
- Smooth scrolling behaviors when clicking Navbar links or CTA buttons.
- Functional dark/light theme toggle.
- Adjustable font size scaling widget in the Footer.
- Full viewport responsiveness and linter compliance.

## Content, Assets & Accessibility

Keep the skip link, tab ARIA attributes, labels, keyboard focus-states, and visual focus rings intact. Metadata lives in `index.html`; update the page title, description, and keywords when site contents change.

## Commit & Pull Request Guidelines

Recent commits use short imperative summaries such as `Clean up unused design system components`. Keep commits focused and descriptive of structural changes.

## Agent-Specific Notes

Do not overwrite unrelated local edits. Inspect current diffs before changing shared files. Keep generated files, build folders (`dist`), and temporary files out of the repository unless explicitly requested.
