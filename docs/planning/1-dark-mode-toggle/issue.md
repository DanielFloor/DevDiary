# Add Dark Mode with Theme Toggle

## User Story

As a developer using DevDiary,
I want to toggle between light and dark mode using a button in the top-right corner of the app,
so that I can use the application comfortably in low-light environments and match my personal preference.

## Description

DevDiary currently has no dark mode support. A theme toggle using Tailwind's `darkMode: 'class'`
strategy will be added to the existing shadcn/ui + Tailwind setup without new packages. The selected
theme will be persisted to `localStorage` and initialised from the OS `prefers-color-scheme` on first
visit. This is a purely frontend change — no backend or data model involvement.

## Acceptance Criteria

- [ ] A theme toggle button is visible in the top-right corner of every page
- [ ] The button displays a **Sun icon** when dark mode is active and a **Moon icon** when light mode is active
- [ ] Clicking the button switches between light and dark mode immediately
- [ ] The selected theme is **persisted to `localStorage`** and restored on page reload
- [ ] Dark mode applies consistently across all pages: `DiaryList`, `DiaryEntry`, `SearchResults`, `ProjectsManager`,
  `TagsManager`
- [ ] Dark mode applies consistently across all components: `EntryCard`, `FilterPanel`, `MoodBadge`, `LinkList`,
  `MultiSelectDropdown`
- [ ] The system's preferred color scheme (`prefers-color-scheme`) is used as the **default** when no stored preference
  exists
- [ ] The toggle button is accessible (has an `aria-label` describing the current action)

## Technical Notes

### Affected Components

| Component                                                                    | Layer                 | Change Description                                                                                                               |
|------------------------------------------------------------------------------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `tailwind.config.js`                                                         | Config                | Add `darkMode: 'class'`                                                                                                          |
| `frontend/src/index.css`                                                     | Styles                | Add `.dark { ... }` CSS variable overrides matching shadcn token names                                                           |
| `ThemeContext.tsx` *(new)*                                                   | Frontend — Context    | React context providing `theme` state and `toggleTheme()`, persisted via `localStorage`, initialised from `prefers-color-scheme` |
| `ThemeToggle/index.tsx` *(new)*                                              | Frontend — Component  | Icon button (Sun/Moon from `lucide-react`) calling `toggleTheme()`                                                               |
| `frontend/src/App.tsx`                                                       | Frontend — App shell  | Wrap app in `ThemeProvider`; add `ThemeToggle` to sticky header                                                                  |
| `DiaryList`, `DiaryEntry`, `SearchResults`, `ProjectsManager`, `TagsManager` | Frontend — Pages      | Add `dark:` Tailwind variants to backgrounds and typography                                                                      |
| `EntryCard`, `FilterPanel`, `MoodBadge`, `LinkList`, `MultiSelectDropdown`   | Frontend — Components | Add `dark:` Tailwind variants to card, text, and border classes                                                                  |

### Data Model Changes

No data model changes required.

### API Changes

No API changes required.

### Frontend Changes

**Strategy:** Tailwind's `darkMode: 'class'` applies dark styles by toggling a `dark` class on the
`<html>` element. This fits the existing Tailwind + shadcn/ui setup without introducing a new
CSS-in-JS layer or any new packages (`lucide-react` is already a transitive shadcn/ui dependency).

**New files:**

- `frontend/src/context/ThemeContext.tsx` — on mount: read `localStorage`; fallback to
  `window.matchMedia('(prefers-color-scheme: dark)')`. On toggle: flip state, persist to
  `localStorage`, update `document.documentElement.classList`.
- `frontend/src/components/ThemeToggle/index.tsx` — shadcn/ui `Button` with `variant="ghost"`
  and `size="icon"`; renders `<Sun>` or `<Moon>` from `lucide-react` based on current theme.

**Modified files:**

- `tailwind.config.js` — add `darkMode: 'class'` alongside existing keys.
- `index.css` — add `.dark { ... }` block with variable overrides for all shadcn tokens
  (`--background`, `--foreground`, `--card`, `--card-foreground`, `--muted`, etc.).
- `App.tsx` — introduce a minimal sticky `<header>` (if one does not already exist) with
  `ThemeToggle` pinned to the top-right; wrap root in `<ThemeProvider>`.
- All pages and components listed in the Affected Components table: add `dark:` variants
  to background, text, and border Tailwind classes.

**Constraints:**

- No Redux/Zustand — React Context + `useState` only (per architecture guardrails)
- No new packages — `lucide-react` is already available
- `.dark {}` variable names must match the existing shadcn token set in `index.css`

## Task Breakdown

1. **Configure Tailwind dark mode and CSS variables** — Add `darkMode: 'class'` to `tailwind.config.js` and add the
   `.dark { ... }` CSS variable block to `index.css`.
2. **Implement ThemeContext** — Create `frontend/src/context/ThemeContext.tsx` with `localStorage` persistence and
   `prefers-color-scheme` fallback.
3. **Implement ThemeToggle component and wire into App.tsx** — Create `ThemeToggle/index.tsx` and update `App.tsx` to
   wrap the app in `ThemeProvider` and render the toggle in the header.
4. **Apply dark mode variants to all pages** — Add `dark:` Tailwind variants to `DiaryList`, `DiaryEntry`,
   `SearchResults`, `ProjectsManager`, and `TagsManager`.
5. **Apply dark mode variants to all components** — Add `dark:` variants to `EntryCard`, `FilterPanel`, `MoodBadge`,
   `LinkList`, and `MultiSelectDropdown`.

## Stacked PR Breakdown

| PR   | Branch                                   | Tasks   | Merges into   |
|------|------------------------------------------|---------|---------------|
| PR 1 | `feature/dark-mode/part-1-foundation`    | 1, 2, 3 | PR 2's branch |
| PR 2 | `feature/dark-mode/part-2-dark-variants` | 4, 5    | `main`        |

## Testing Considerations

- Unit tests: `ThemeContext` — localStorage read/write, system preference fallback, toggle behaviour; `ThemeToggle` —
  renders correct icon per theme state, fires `toggleTheme` on click, correct `aria-label`
- Integration tests: theme persists across a simulated page reload; OS preference respected on first visit (no
  `localStorage` entry)
- Edge cases: `localStorage` unavailable (SSR/private browsing); `prefers-color-scheme` not supported; rapid toggle
  clicks do not desync state

## Out of Scope

- A three-way toggle (Light / Dark / System) — binary toggle is sufficient for v1
- Backend changes — purely frontend concern

## Labels

`frontend`, `enhancement`
