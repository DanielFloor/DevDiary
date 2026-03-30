# Dark Mode Support with Theme Toggle Button

## User Story

**As a** developer using DevDiary,  
**I want** to toggle between light and dark mode using a button in the top-right corner of the app,  
**So that** I can use the application comfortably in low-light environments and match my personal preference.

---

## Acceptance Criteria

- [ ] A theme toggle button is visible in the top-right corner of every page
- [ ] The button displays a **Sun icon** when dark mode is active and a **Moon icon** when light mode is active
- [ ] Clicking the button switches between light and dark mode immediately
- [ ] The selected theme is **persisted to `localStorage`** and restored on page reload
- [ ] Dark mode applies consistently across all pages: `DiaryList`, `DiaryEntry`, `SearchResults`, `ProjectsManager`, `TagsManager`
- [ ] Dark mode applies consistently across all components: `EntryCard`, `FilterPanel`, `MoodBadge`, `LinkList`, `MultiSelectDropdown`
- [ ] The system's preferred color scheme (`prefers-color-scheme`) is used as the **default** when no stored preference exists
- [ ] The toggle button is accessible (has an `aria-label` describing the current action)

---

## Technical Notes

### Approach: Tailwind CSS Class Strategy

Tailwind's `darkMode: 'class'` strategy applies dark styles by toggling a `dark` class on the `<html>` element. This fits the existing Tailwind + shadcn/ui setup without introducing a new CSS-in-JS layer.

### Files to Create

| File | Purpose |
|---|---|
| `frontend/src/context/ThemeContext.tsx` | React context providing `theme` state and `toggleTheme()`, persisted via `localStorage`, initialised from `prefers-color-scheme` |
| `frontend/src/components/ThemeToggle/index.tsx` | Icon button (Sun/Moon from `lucide-react`) that calls `toggleTheme()` from context |

### Files to Modify

| File | Change |
|---|---|
| `frontend/tailwind.config.js` | Add `darkMode: 'class'` |
| `frontend/src/index.css` | Add dark-mode CSS variable overrides under `.dark { ... }` matching shadcn token names |
| `frontend/src/App.tsx` | Wrap app in `ThemeProvider`; add `ThemeToggle` to the top-right of the layout header |
| `frontend/src/pages/DiaryList/index.tsx` | Add `dark:` Tailwind variants to page background and typography |
| `frontend/src/pages/DiaryEntry/index.tsx` | Add `dark:` variants to form inputs, labels, and container |
| `frontend/src/pages/SearchResults/index.tsx` | Add `dark:` variants |
| `frontend/src/pages/ProjectsManager/index.tsx` | Add `dark:` variants |
| `frontend/src/pages/TagsManager/index.tsx` | Add `dark:` variants |
| `frontend/src/components/EntryCard/index.tsx` | Add `dark:` variants to card background, text, borders |
| `frontend/src/components/FilterPanel/index.tsx` | Add `dark:` variants |
| `frontend/src/components/MoodBadge/index.tsx` | Verify mood colours are readable in dark mode |

### Implementation Details

1. **`ThemeContext.tsx`** — on mount, read `localStorage`; fallback to `window.matchMedia('(prefers-color-scheme: dark)')`. On toggle: flip state, persist to `localStorage`, update `document.documentElement.classList`.
2. **`tailwind.config.js`** — add `darkMode: 'class'` alongside existing `content`/`theme`/`plugins` keys.
3. **`ThemeToggle`** — use `lucide-react` (already available via shadcn/ui) for `Sun`/`Moon` icons; shadcn/ui `Button` with `variant="ghost"` and `size="icon"`.
4. **`App.tsx`** — introduce a minimal sticky `<header>` with the toggle in the top-right if one does not already exist.

### Constraints

- **No Redux/Zustand** — React Context + `useState` only (per architecture guardrails)
- **No new packages** — `lucide-react` is already a transitive dependency
- **shadcn/ui token alignment** — `.dark {}` variable names must match the existing shadcn token set (`--background`, `--foreground`, `--card`, etc.) in `index.css`

---

## Out of Scope

- A three-way toggle (Light / Dark / System) — binary toggle is sufficient for v1
- Backend changes — purely frontend concern

---

## Testing

- [ ] Toggle switches theme visually with no flash of unstyled content on reload
- [ ] `localStorage` key `theme` is set to `"dark"` or `"light"` after toggling
- [ ] Refreshing the page restores the previously selected theme
- [ ] On first visit (no `localStorage` entry), the OS preference is respected
- [ ] All text meets WCAG AA contrast in both modes
- [ ] Toggle `aria-label` reads `"Switch to dark mode"` / `"Switch to light mode"` appropriately

---

## Labels

`frontend`, `enhancement`

