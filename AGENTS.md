# Movie Discovery App — Agent Guide

## Commands (order matters)

```sh
npm run format   # Prettier — only formats src/
npm run lint     # ESLint — flat config, applies --fix
npm run dev      # Vite dev server
npm run build    # Vite production build (output: dist/)
npm run preview  # Preview production build
```

Run `format` before `lint` because `@vue/eslint-config-prettier/skip-formatting` is configured.

## Architecture

- **Vue 3** (Composition API, SFC `<script setup>`) + **Vite 6** + **Pinia** + **Vue Router 4**
- **TMDB API** (`api.themoviedb.org/3`) for movie data — API key in `.env` as `VITE_TMDB_API_KEY`
- **Firebase Auth + Firestore** for user accounts and persisted favorites/watchlist
- **Naive UI** for buttons/spinners, **Tailwind CSS v4** for utility styling, **FontAwesome** + **Ionicons** for icons
- Deployed on **Netlify** at `moviesdiscoveryapp.netlify.app`

## Key files

| Path | Role |
|---|---|
| `src/main.js` | App bootstrap: Pinia, Router, Naive UI, FontAwesome, theme init, user data init |
| `src/App.vue` | Root component — calls `authStore.fetchUser()` |
| `src/router/index.js` | 6 routes (`/`, `/movie/:id`, `/favorites`, `/watchlist`, `/login`, `/register`) with lazy-loaded views |
| `src/Firebase.js` | Firebase init — exports `auth` and `db` |
| `src/stores/auth.js` | Firebase email/password auth |
| `src/stores/Theme.js` | Dark/light theme — stored in `localStorage` (key: `theme`), fallback to `prefers-color-scheme`, toggles `html.dark` class |
| `src/stores/userData.js` | **Active** favorites/watchlist — Firestore real-time via `onSnapshot`; used by all views |
| `src/stores/favourites.js` | **Dead code** — localStorage-based, not imported anywhere |
| `src/stores/WatchList.js` | **Dead code** — localStorage-based, not imported anywhere |
| `src/assets/base.css` | CSS custom properties for theme (`--color-background`, `--color-text`, etc.) |

## Import alias

`@` maps to `./src` (configured in both `vite.config.js` and `jsconfig.json`).

## Dark mode

Uses **class-based** approach: `html.dark` class toggled by `Theme.js`. Theme variables defined in `base.css` via `html.dark { --color-*: ... }`. Tailwind's `dark:` prefix is **not** used — the app uses CSS custom properties and the `darkMode: 'class'` config option is unused.

## Quirks & gotchas

- **Dead stores removed** — `favourites.js`, `WatchList.js`, `counter.js` were unused and deleted.
- **Tailwind v4 is loaded via Vite plugin only** (`@tailwindcss/vite`). PostCSS plugin was removed to avoid duplication.
- **`.env` contains committed API keys** — avoid committing additional secrets.
- **No test framework** — `vitest`, `cypress`, `playwright` are not configured despite being in `jsconfig.json` nesting patterns.
- **No TypeScript** — plain JS project.
- **VS Code** is configured for format-on-save with Prettier as default formatter, and ESLint fix-on-save.

## Prettier

Single quotes, 100 char print width (`.prettierrc.json`). EditorConfig mirrors this with 2-space indent, LF line endings.
