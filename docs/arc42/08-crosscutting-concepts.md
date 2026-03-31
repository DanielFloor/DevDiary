# 8. Cross-cutting concepts

## Dark mode / theming

DevDiary supports a light/dark colour scheme toggle that is applied consistently across the entire
frontend. The implementation follows Tailwind CSS's `class` strategy:

**Mechanism**
- A `dark` class on `<html>` (i.e. `document.documentElement`) activates all `dark:` Tailwind
  variants defined in component class strings.
- `tailwind.config.js` sets `darkMode: 'class'`.
- `frontend/src/index.css` declares two CSS variable blocks: `:root {}` for the light-mode shadcn/ui
  token defaults and `.dark {}` for their dark-mode overrides. Every shadcn primitive that consumes
  `var(--background)`, `var(--card)`, etc. automatically adapts to the active theme.

**State management — `ThemeContext`**
- `frontend/src/context/ThemeContext.tsx` is the single source of truth for the active theme.
- On mount, `getInitialTheme()` reads `localStorage` (key: `devdiary-theme`). If no stored value is
  present it falls back to `window.matchMedia('(prefers-color-scheme: dark)').matches`, defaulting
  to `'light'` when the media query is also unavailable or throws.
- `useLayoutEffect([theme])` toggles the `dark` class on `<html>` synchronously before the browser
  paints, preventing a flash of unstyled content (FOUC) on page load.
- `toggleTheme()` flips the state, persists the new value to `localStorage`, and relies on the
  effect above to update the DOM class. `localStorage` writes are wrapped in a try/catch to handle
  private-browsing or storage-quota errors gracefully.

**Toggle component — `ThemeToggle`**
- `frontend/src/components/ThemeToggle/index.tsx` renders a `<button type="button">` containing a
  `<Moon>` icon in light mode and a `<Sun>` icon in dark mode (both from `lucide-react`, already a
  transitive dependency).
- `aria-label` describes the *next* action ("Switch to dark mode" / "Switch to light mode"), not
  the current state, following WCAG guidance on labelling toggle controls.
- The button is placed in the sticky `<header>` in `App.tsx`, visible on every route.

**Coverage**
All five page components (`DiaryList`, `DiaryEntry`, `SearchResults`, `ProjectsManager`,
`TagsManager`) and all five shared components (`EntryCard`, `FilterPanel`, `MoodBadge`, `LinkList`,
`MultiSelectDropdown`) carry `dark:` Tailwind variants on every background, text, and border class.

**No backend involvement** — theming is a purely frontend concern. No API changes, no data-model
changes.

**Test coverage**
- `ThemeContext` — 11 unit tests covering `getInitialTheme` (localStorage priority,
  `prefers-color-scheme` fallback, storage-throws fallback), `toggleTheme` (state flip, localStorage
  persistence, `<html>` class mutation), and the `useTheme` guard throw.
- `ThemeToggle` — 5 unit tests covering icon/aria-label per theme state and click delegation.
- Test runner: **vitest 2.x** + `@testing-library/react` + `happy-dom`.

## Date and time serialisation

> Stub — `LocalDate` fields serialise as ISO-8601 strings (`YYYY-MM-DD`). `OffsetDateTime` fields use a custom Jackson
> module configured in `JacksonConfig.java`. Document exact formats and any frontend parsing assumptions here.

## Error handling

> Stub — the backend uses Spring Boot's default error format (`timestamp`, `status`, `message`). Document how the
> frontend handles 4xx/5xx responses and any user-visible error states.

## CORS

> Stub — `@CrossOrigin(origins = "*")` is applied to all REST controllers. This is intentional for a local dev tool.
> Document here if this changes (e.g. when a hosted environment is introduced).

## Full-text search (FTS5)

> Stub — a SQLite FTS5 virtual table indexes the `content` field of diary entries. The service layer keeps the FTS index
> in sync on create, update, and delete. Document the index schema and any known limitations (e.g. minimum token length,
> stop words) here.

## Persistence and schema management

> Stub — Hibernate `ddl-auto=update` manages schema creation and migration automatically on startup. Document any manual
> migration steps required for breaking schema changes here.

