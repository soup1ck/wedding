# Repository Guidelines

## Project Structure & Module Organization
This repository is a single-page wedding invitation built with React, TypeScript, and Vite. Application code lives in `src/`: `main.tsx` boots the app, `App.tsx` holds most page content and section data, `components/` contains reusable UI and Three.js scene code, and `types/` contains asset and module declarations. Static media is split between `src/assets/` and top-level content folders such as `people/`, `dresscode/`, and `music/`. Production output is generated into `dist/` and should be treated as build artifacts.

## Build, Test, and Development Commands
- `npm install`: install dependencies. Use Node `20.19+` and npm `10+`.
- `npm run dev`: start the Vite dev server on `http://0.0.0.0:4173`.
- `npm run build`: run `tsc -b` and create a production bundle in `dist/`.
- `npm run preview`: serve the built site locally on port `4173`.

There is no dedicated test runner configured at the moment; `npm run build` is the main verification step and should pass before opening a PR.

## Coding Style & Naming Conventions
Follow the existing TypeScript style: strict typing, ES modules, and React function components with PascalCase names such as `EnvelopeIntro`. Keep helpers and local data in camelCase, and prefer explicit types for structured content arrays. Use double quotes and trailing commas, matching the current source. Keep CSS in `src/styles.css`, reuse existing custom properties, and prefer descriptive class names like `intro-overlay` or `scene-depth`. Use `Alice RA` as the global UI font, loaded from the local file `font/Alice RA.otf` via `@font-face`; do not reintroduce mixed font stacks unless there is a strong design reason.

## Testing Guidelines
Because the repo has no first-party automated tests yet, validate changes with:
- `npm run build`
- manual browser checks in `npm run dev`

When adding tests later, place them under `src/` with `*.test.ts` or `*.test.tsx` names and keep them focused on component behavior or date/content logic.

## Commit & Pull Request Guidelines
Recent history uses short, imperative commit subjects and occasional feature-branch merge commits. Prefer concise messages such as `Update venue gallery` or `Adjust ocean background layout`. PRs should include a short summary, screenshots or a screen recording for UI changes, and note any content/assets updated. Avoid committing unrelated changes in `dist/` or `node_modules/`.

## Content & Asset Notes
Most invitation text, schedule items, date values, and venue links are defined directly in `src/App.tsx`. Keep filenames stable when possible, and compress large media before committing to limit bundle growth.
