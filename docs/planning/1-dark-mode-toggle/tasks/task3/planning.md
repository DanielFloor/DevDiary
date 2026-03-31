# Task 3 — Implement ThemeToggle Component and Wire into App.tsx: Implementation Plan

## Task Overview

Task 3 creates the `ThemeToggle` button component and integrates it into the existing app shell.
`ThemeToggle` is a small icon button that reads theme state from `ThemeContext` (Task 2) and renders
a `Moon` icon (light mode active → click to go dark) or a `Sun` icon (dark mode active → click to go
light). It calls `toggleTheme()` on click and has an `aria-label` describing the action.

`App.tsx` is updated to (a) wrap the entire component tree in `<ThemeProvider>` and (b) insert
`<ThemeToggle />` into the right side of the existing sticky header. `lucide-react` is confirmed
in `package.json` as a direct dependency (`^0.378.0`) — no new packages needed. Tasks 1 and 2 must
be complete before this task.

Design decisions:

- **`ThemeProvider` wraps the entire JSX return**, including the `<header>`, so `ThemeToggle` (which
  calls `useTheme()`) is guaranteed to be inside the provider tree. Wrapping only `<Routes>` would
  cause `useTheme()` to throw.
- **The existing header** in `App.tsx` (lines 11–34) already uses `flex items-center justify-between`
  — `ThemeToggle` is added as the last child of the right-side flex container, after the `<nav>`.
- **Plain `<button>`** with Tailwind classes rather than shadcn `Button` primitive — keeps the toggle
  self-contained and avoids coupling it to the shadcn button variant system for a single-icon control.

## Key References

| File                                          | Lines               | Pattern to follow                                                                                                                                                                                              |
|-----------------------------------------------|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `frontend/src/App.tsx`                        | 8–34                | Header layout: outer `<div className="min-h-screen bg-gray-50">` (line 10), inner header `<div className="max-w-5xl mx-auto flex items-center justify-between">` (line 12); ThemeToggle slots right of `<nav>` |
| `frontend/src/App.tsx`                        | 9–51                | Entire JSX tree that `<ThemeProvider>` must wrap                                                                                                                                                               |
| `frontend/src/components/MoodBadge/index.tsx` | 1–24                | Component file structure — named default export, no props interface needed beyond the hook call                                                                                                                |
| `frontend/src/context/ThemeContext.tsx`       | (created in Task 2) | `useTheme()` returns `{ theme, toggleTheme }`                                                                                                                                                                  |
| `frontend/package.json`                       | 21                  | `"lucide-react": "^0.378.0"` — confirmed direct dependency                                                                                                                                                     |

## Documentation

- https://lucide.dev/icons/sun — `import { Sun } from 'lucide-react'`
- https://lucide.dev/icons/moon — `import { Moon } from 'lucide-react'`

## Architectural Constraints

- No new npm packages — `lucide-react` is already in `dependencies`
- All theme state flows through `ThemeContext` — no local `useState` in `ThemeToggle`
- Button must include `aria-label` (accessibility acceptance criterion)
- `ThemeProvider` must wrap the **entire** app tree including the header

## Gotchas

- **`aria-label` describes the action, not the state**: when dark mode is active (Sun shown), the
  label is `"Switch to light mode"`; when light mode is active (Moon shown), it is
  `"Switch to dark mode"`. Reversing these is the most common mistake.
- **Icon semantics**: Sun = "it is currently dark, click to bring the sun/light". Moon = "it is
  currently light, click to enter the night/dark". The icon represents what clicking *will do*, not
  the current theme.
- **`App.tsx` wrapping order**: `<ThemeProvider>` must be the outermost element of the return value.
  The existing structure is `<div className="min-h-screen ...">` — this div becomes the immediate
  child of `<ThemeProvider>`, not replaced by it.
- After Task 4, `App.tsx`'s own classes (`bg-gray-50`, `bg-white`, `border-gray-200`) will receive
  `dark:` variants — Task 3 does not need to add those. Keep this task focused on wiring only.

## Phase Breakdown

### Phase 1 — Create ThemeToggle Component

**Objective:** Create `frontend/src/components/ThemeToggle/index.tsx` as an accessible icon button
that calls `toggleTheme()` and shows the correct icon for the current theme.

**Files to create/modify:**

- `frontend/src/components/ThemeToggle/index.tsx` — create: new icon-button component

**Implementation steps:**

1. Import `Sun` and `Moon` from `'lucide-react'`.
2. Import `useTheme` from `'../../context/ThemeContext'`.
3. In the component body: destructure `{ theme, toggleTheme }` from `useTheme()`.
4. Render a `<button>` element with:

- `onClick={toggleTheme}`
- `aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}`
- `className`:
  ```
  p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100
  dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800
  transition-colors
  ```

5. Inside the button: render `<Sun size={18} />` when `theme === 'dark'`, `<Moon size={18} />`
   when `theme === 'light'`.
6. Export as default.

**Validation rules:**
None beyond framework defaults.

**Dependencies:** None — first phase (Task 2's `ThemeContext` must exist).

**Test scenarios:**

- `shouldRenderMoonIconWhenThemeIsLight()`
- `shouldRenderSunIconWhenThemeIsDark()`
- `shouldHaveAriaLabelSwitchToLightModeWhenThemeIsDark()`
- `shouldHaveAriaLabelSwitchToDarkModeWhenThemeIsLight()`
- `shouldCallToggleThemeOnClick()`

---

### Phase 2 — Wire ThemeProvider and ThemeToggle into App.tsx

**Objective:** Wrap the App component tree in `<ThemeProvider>` and insert `<ThemeToggle />` into the
header's right-side navigation area.

**Files to create/modify:**

- `frontend/src/App.tsx` — modify: add imports, wrap root in ThemeProvider, add ThemeToggle to header

**Implementation steps:**

1. Add imports at the top of `App.tsx`:
   ```ts
   import { ThemeProvider } from './context/ThemeContext'
   import ThemeToggle from './components/ThemeToggle'
   ```
2. Wrap the entire return value in `<ThemeProvider>...</ThemeProvider>`.
3. In the header, the current right side is:
   ```tsx
   <nav className="flex items-center gap-4 text-sm text-gray-500">
     ...NavLinks...
   </nav>
   ```
   Change to:
   ```tsx
   <div className="flex items-center gap-4">
     <nav className="flex items-center gap-4 text-sm text-gray-500">
       ...NavLinks...
     </nav>
     <ThemeToggle />
   </div>
   ```
   This preserves existing nav layout and appends the toggle button to the right of the nav links.

**Validation rules:**
None beyond framework defaults.

**Dependencies:** Phase 1 must be complete before starting this phase.

**Test scenarios:**

- `shouldRenderThemeToggleInAppHeader()`
- `shouldToggleDarkClassOnHtmlWhenButtonClicked()`

## Field Mappings Summary

No persistent fields involved.

## Validation Rules Summary

None beyond framework defaults.

## Test Plan

**Phase 1 — unit tests for ThemeToggle:**

- `shouldRenderMoonIconWhenThemeIsLight()` — mock `useTheme` returning `theme: 'light'`; assert Moon rendered
- `shouldRenderSunIconWhenThemeIsDark()` — mock `useTheme` returning `theme: 'dark'`; assert Sun rendered
- `shouldHaveAriaLabelSwitchToLightModeWhenThemeIsDark()` — assert `aria-label` value
- `shouldHaveAriaLabelSwitchToDarkModeWhenThemeIsLight()` — assert `aria-label` value
- `shouldCallToggleThemeOnClick()` — mock `toggleTheme`, simulate click, assert it was called once

**Phase 2 — integration test for App wiring:**

- `shouldRenderThemeToggleInAppHeader()` — render `<App>` wrapped in `MemoryRouter`, assert toggle button present in
  header
- `shouldToggleDarkClassOnHtmlWhenButtonClicked()` — render full app, click toggle, assert
  `document.documentElement.classList.contains('dark')`

## Acceptance Criteria Coverage

| Acceptance criterion (from issue)                                            | Covered by phase(s) |
|------------------------------------------------------------------------------|---------------------|
| A theme toggle button is visible in the top-right corner of every page       | Phase 2             |
| Button displays Sun icon when dark, Moon when light                          | Phase 1             |
| Clicking the button switches between light and dark mode immediately         | Phase 1 + 2         |
| Toggle button is accessible (has `aria-label` describing the current action) | Phase 1             |

## Validation Gates

- `cd frontend && pnpm build` — passing: TypeScript compiles with no errors
- Browser: toggle button renders in the top-right corner of the header on all pages (route-independent)

## Completion Checklist

- [ ] `frontend/src/components/ThemeToggle/index.tsx` created
- [ ] Renders `<Moon>` when `theme === 'light'` and `<Sun>` when `theme === 'dark'`
- [ ] `aria-label` says `"Switch to light mode"` when dark, `"Switch to dark mode"` when light
- [ ] Button has appropriate hover/focus styles including `dark:` variants
- [ ] `App.tsx` imports and uses `ThemeProvider` to wrap the entire component tree
- [ ] `ThemeToggle` renders inside the header to the right of the existing nav links
- [ ] No new npm packages added (`lucide-react` was already in `package.json`)
- [ ] `pnpm build` passes with no errors

