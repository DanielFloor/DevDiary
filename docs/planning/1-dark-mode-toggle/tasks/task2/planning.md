# Task 2 — Implement ThemeContext: Implementation Plan

## Task Overview

Task 2 creates `frontend/src/context/ThemeContext.tsx` — the single source of truth for the current
theme state (`'light'` | `'dark'`). The context exposes `theme` and `toggleTheme()`, persists the
user's selection to `localStorage`, initialises from the OS `prefers-color-scheme` on first visit,
and directly manages the `dark` class on `document.documentElement` so Tailwind's `darkMode: 'class'`
strategy takes effect. A `useTheme()` convenience hook is exported for downstream consumers
(`ThemeToggle` in Task 3). No other files are modified. Task 1 must be complete first (Tailwind
`darkMode: 'class'` config must exist before the class has any visible effect).

Design decisions:

- **React Context + `useState` only** — no Redux/Zustand, per architectural guardrails.
- **Lazy `useState` initialiser** (`useState(getInitialTheme)`) ensures `localStorage` is read once on
  mount, not on every render.
- **`document.documentElement.classList`** is mutated directly inside `toggleTheme()` (not via a
  `useEffect` on `theme`) to keep the DOM update synchronous with the state flip and avoid a
  one-frame flash of the wrong theme.
- A single `useEffect([], [])` on mount syncs the initial class to the DOM in case the lazy initialiser
  runs in an SSR-like environment where `document` was not available during `useState` initialisation.

## Key References

| File                                          | Lines | Pattern to follow                                                                         |
|-----------------------------------------------|-------|-------------------------------------------------------------------------------------------|
| `frontend/src/App.tsx`                        | 1–52  | Root component structure — `ThemeProvider` will wrap the outermost `<div>` here in Task 3 |
| `frontend/src/components/MoodBadge/index.tsx` | 1–24  | Component file structure and export pattern used throughout the project                   |
| `frontend/package.json`                       | 10–22 | Confirms React 18 is available; no new packages needed                                    |

## Architectural Constraints

- React Context + `useState` only — no Redux/Zustand
- No new npm packages
- The `dark` class must be toggled on `document.documentElement` (the `<html>` element), not on any
  inner element — this is what Tailwind's `darkMode: 'class'` requires
- New file lives at `frontend/src/context/ThemeContext.tsx`
- `ThemeProvider`, `useTheme`, and the `Theme` type must all be named exports (not default exports)
  so tree-shaking works and imports are explicit

## Gotchas

- **`localStorage` can throw** in private browsing / restricted environments — wrap all
  `localStorage` access in `try/catch` and fall back gracefully.
- **`window.matchMedia` may be undefined** in jsdom/test environments — guard with
  `typeof window !== 'undefined' && window.matchMedia` before calling it.
- **Lazy initialiser vs. useEffect**: using `useState(getInitialTheme)` (function reference, not
  call) invokes `getInitialTheme` exactly once. Do NOT write `useState(getInitialTheme())` — that
  calls it on every render.
- **DOM sync on mount**: even with lazy initialiser, the initial `document.documentElement` class
  update should be in a `useEffect` with empty deps to ensure it runs after the component mounts,
  making the behaviour safe in both browser and test environments.
- **`useTheme()` outside provider**: the hook should throw a descriptive error (not just return
  `undefined`) so the developer knows immediately what went wrong.

## Phase Breakdown

### Phase 1 — Create ThemeContext with localStorage and prefers-color-scheme Support

**Objective:** Create `frontend/src/context/ThemeContext.tsx` exporting `ThemeProvider`, `useTheme`,
and `Theme` type, implementing localStorage persistence, OS preference fallback, and DOM class
management.

**Files to create/modify:**

- `frontend/src/context/ThemeContext.tsx` — create: new context file

**Implementation steps:**

1. Define `export type Theme = 'light' | 'dark'`.
2. Define the context interface:
   ```ts
   interface ThemeContextValue {
     theme: Theme
     toggleTheme: () => void
   }
   ```
3. Create `const ThemeContext = React.createContext<ThemeContextValue | null>(null)`.
4. Write `function getInitialTheme(): Theme`:
   a. Wrap body in `try/catch`.
   b. Read `localStorage.getItem('theme')` — if it is `'light'` or `'dark'`, return it.
   c. Check `window.matchMedia?.('(prefers-color-scheme: dark)').matches` — return `'dark'` if true.
   d. Return `'light'` as final fallback.
   e. Return `'light'` in the catch block.
5. Implement `export function ThemeProvider({ children }: { children: React.ReactNode })`:
   a. `const [theme, setTheme] = useState<Theme>(getInitialTheme)` (lazy — pass function reference).
   b. `useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark') }, [])`
   — syncs the initial class on first mount.
   c. Implement `toggleTheme`:

- Compute `next = theme === 'light' ? 'dark' : 'light'`.
- Call `setTheme(next)`.
- `document.documentElement.classList.toggle('dark', next === 'dark')`.
- `try { localStorage.setItem('theme', next) } catch { /* ignore */ }`.
  d. Return `<ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>`.

6. Implement `export function useTheme(): ThemeContextValue`:

- `const ctx = useContext(ThemeContext)`.
- `if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')`.
- `return ctx`.

**Validation rules:**

- `useTheme()` called outside `<ThemeProvider>` must throw: `'useTheme must be used inside ThemeProvider'`

**Dependencies:** None — first phase (Task 1 Tailwind config must exist for the `dark` class to
have visual effect, but the TypeScript code compiles independently).

**Test scenarios:**

- `shouldReturnLightWhenLocalStorageHasLight()`
- `shouldReturnDarkWhenLocalStorageHasDark()`
- `shouldFallbackToDarkWhenSystemPrefersDark()`
- `shouldFallbackToLightWhenNoPreferenceAndNoStorage()`
- `shouldFallbackToLightWhenLocalStorageThrows()`
- `shouldToggleFromLightToDark()`
- `shouldToggleFromDarkToLight()`
- `shouldPersistThemeToLocalStorageOnToggle()`
- `shouldApplyDarkClassToDocumentElementOnToggle()`
- `shouldRemoveDarkClassFromDocumentElementWhenTogglingToLight()`
- `shouldThrowWhenUseThemeCalledOutsideProvider()`

## Field Mappings Summary

No persistent fields (frontend-only context, no database involvement).

## Validation Rules Summary

- `useTheme()` must throw a descriptive error when called outside `<ThemeProvider>`.

## Test Plan

All tests are unit tests against `ThemeContext.tsx`:

- `shouldReturnLightWhenLocalStorageHasLight()` — mock `localStorage.getItem` to return `'light'`
- `shouldReturnDarkWhenLocalStorageHasDark()` — mock `localStorage.getItem` to return `'dark'`
- `shouldFallbackToDarkWhenSystemPrefersDark()` — mock `localStorage.getItem` to return `null`,
  mock `window.matchMedia` to return `{ matches: true }`
- `shouldFallbackToLightWhenNoPreferenceAndNoStorage()` — both return negative/null
- `shouldFallbackToLightWhenLocalStorageThrows()` — mock `localStorage.getItem` to throw
- `shouldToggleFromLightToDark()` — render provider, call `toggleTheme()`, assert `theme === 'dark'`
- `shouldToggleFromDarkToLight()` — start dark, toggle, assert light
- `shouldPersistThemeToLocalStorageOnToggle()` — assert `localStorage.setItem('theme', 'dark')` called
- `shouldApplyDarkClassToDocumentElementOnToggle()` — assert `document.documentElement.classList`
  contains `'dark'` after toggle to dark
- `shouldRemoveDarkClassFromDocumentElementWhenTogglingToLight()` — opposite
- `shouldThrowWhenUseThemeCalledOutsideProvider()` — render without provider, expect thrown error

## Acceptance Criteria Coverage

| Acceptance criterion (from issue)                                                           | Covered by phase(s)     |
|---------------------------------------------------------------------------------------------|-------------------------|
| The selected theme is persisted to `localStorage` and restored on page reload               | Phase 1                 |
| The system's preferred color scheme is used as the default when no stored preference exists | Phase 1                 |
| Clicking the button switches between light and dark mode immediately                        | Phase 1 (`toggleTheme`) |

## Validation Gates

- `cd frontend && pnpm build` — passing: TypeScript compiles with no errors

## Completion Checklist

- [ ] `frontend/src/context/ThemeContext.tsx` created
- [ ] `ThemeProvider`, `useTheme`, and `Theme` type are all named exports
- [ ] `getInitialTheme()` reads `localStorage` first, falls back to `prefers-color-scheme`, then `'light'`
- [ ] All `localStorage` access is wrapped in `try/catch`
- [ ] `window.matchMedia` is guarded against being undefined
- [ ] `useState(getInitialTheme)` uses lazy initialiser (function reference, not call)
- [ ] `toggleTheme()` flips state, updates `document.documentElement.classList`, and persists to `localStorage`
- [ ] `useEffect([], [])` on mount ensures initial `dark` class is synced to DOM
- [ ] `useTheme()` throws a descriptive error if called outside `<ThemeProvider>`
- [ ] `pnpm build` passes with no errors

