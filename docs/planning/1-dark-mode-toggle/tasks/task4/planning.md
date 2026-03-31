# Task 4 — Apply Dark Mode Variants to All Pages: Implementation Plan

## Task Overview

Task 4 adds `dark:` Tailwind utility variants to all five page components and to the app shell in
`App.tsx`, so that backgrounds, text colours, borders, and interactive states render correctly when
the `dark` class is on `<html>`. No new components or context are created — this is a targeted
class-annotation pass. Pages covered: `DiaryList`, `DiaryEntry`, `SearchResults`, `ProjectsManager`,
`TagsManager`, plus the `App.tsx` shell and header (which are page-level concerns). Tasks 1, 2, and 3
must be complete first — Tailwind config, ThemeContext, and the toggle wiring must all be in place
before dark variants are visible in the browser.

Design decisions:

- **Augment, don't replace**: each existing utility class receives a `dark:` counterpart appended
  to the same `className` string (e.g., `bg-white dark:bg-gray-900`). No structural JSX changes.
- **Color palette**: grey scale maps as `gray-50 → gray-950`, `gray-100 → gray-800`, `gray-200 →
  gray-700`, `gray-300 → gray-600` for backgrounds/borders; text maps as `gray-800/900 → gray-100`,
  `gray-600/700 → gray-300`, `gray-500 → gray-400`. Indigo accent colours (`bg-indigo-600`,
  `text-indigo-600`) are high-contrast on both themes and need no dark variant.
- **App.tsx shell and header** are included here (not Task 3) because they are visual page-level
  concerns orthogonal to the wiring work of Task 3.

## Key References

| File                                           | Lines   | Pattern to follow                                                                                                                                                                                         |
|------------------------------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `frontend/src/App.tsx`                         | 9–34    | Outer `<div className="min-h-screen bg-gray-50">` (line 10); header `<header className="bg-white border-b border-gray-200 ...">` (line 11); logo `text-gray-900` (line 13); nav `text-gray-500` (line 16) |
| `frontend/src/pages/DiaryList/index.tsx`       | 60–110  | Heading `text-gray-800` (line 63), search input `border-gray-300` (line 70), search button `bg-gray-100 text-gray-700` (line 76), loading/error/empty text `text-gray-500`/`text-red-600`                 |
| `frontend/src/pages/DiaryEntry/index.tsx`      | 138–355 | Form wrapper `bg-white rounded-lg border border-gray-200 p-6` (line 185); labels `text-gray-600` (line 165, 203 etc.); inputs/select/textarea `border border-gray-300` (lines 175, 207 etc.)              |
| `frontend/src/pages/SearchResults/index.tsx`   | 38–81   | Heading `text-gray-800` (line 47); back button `text-gray-500` (line 41); search input `border-gray-300` (line 58); status text `text-gray-500` (line 71)                                                 |
| `frontend/src/pages/ProjectsManager/index.tsx` | 65–171  | List items `bg-white border border-gray-200` (line 115); archived items `bg-gray-50 border border-gray-200` (line 149)                                                                                    |
| `frontend/src/pages/TagsManager/index.tsx`     | 57–147  | Tag chips `bg-white border border-gray-200` (line 104); archived chips `bg-gray-50 border border-gray-200` (line 130)                                                                                     |

## Architectural Constraints

- No structural JSX changes — only add `dark:` class variants to existing `className` strings
- No inline styles, CSS modules, or CSS-in-JS — Tailwind utility classes only
- All five pages plus App.tsx shell must be covered in this task
- `bg-indigo-600` primary action buttons need no dark variant (sufficient contrast on both themes)
- `text-red-600` error messages need no dark variant (red is readable on both themes)

## Gotchas

- **App.tsx outer wrapper** `<div className="min-h-screen bg-gray-50">` (line 10) is the page
  background — without a dark variant here, the whole page background stays light even if inner
  elements flip. Add `dark:bg-gray-950`.
- **App.tsx header** `bg-white border-b border-gray-200` → needs `dark:bg-gray-900 dark:border-gray-700`.
- **`DiaryEntry` is 355 lines** — scan systematically for every `border-gray-300`, `bg-white`,
  `text-gray-600`, `text-gray-800`, `text-gray-500`. The tag toggle buttons have two conditional
  branches (selected = `bg-indigo-600 text-white`, unselected = `bg-gray-100 text-gray-600`) —
  only the unselected branch needs a dark variant.
- **`DiaryEntry` form wrapper** at line 185: `bg-white rounded-lg border border-gray-200 p-6 space-y-5`
  — this is the main form card; add `dark:bg-gray-900 dark:border-gray-700`.
- **Loading spinner text** `text-gray-500 text-sm` at the top of `DiaryEntry` (line 136) also needs
  `dark:text-gray-400`.
- **`ProjectsManager` and `TagsManager`** both have `text-sm text-gray-400` empty-state messages —
  these need `dark:text-gray-500` (slightly lighter in dark to maintain contrast hierarchy).

## Phase Breakdown

### Phase 1 — Darken App.tsx Shell, DiaryList, and SearchResults

**Objective:** Apply `dark:` variants to the `App.tsx` outer wrapper and header, and to both
list/search pages.

**Files to create/modify:**

- `frontend/src/App.tsx` — modify: add dark variants to outer div, `<header>`, logo text, nav text
- `frontend/src/pages/DiaryList/index.tsx` — modify: add dark variants to heading, inputs, buttons, status text
- `frontend/src/pages/SearchResults/index.tsx` — modify: add dark variants to heading, back button, input, status text

**Implementation steps:**

1. **`App.tsx`**:

- `min-h-screen bg-gray-50` → `min-h-screen bg-gray-50 dark:bg-gray-950`
- `bg-white border-b border-gray-200` (header) → add `dark:bg-gray-900 dark:border-gray-700`
- `text-gray-900` (logo) → add `dark:text-white`
- `text-gray-500` (nav wrapper) → add `dark:text-gray-400`
- Active NavLink `text-indigo-600 font-medium` — no change needed (indigo reads well in dark)

2. **`DiaryList`**:

- `text-xl font-semibold text-gray-800` (heading) → add `dark:text-gray-100`
- `border border-gray-300 rounded px-3 py-1.5 text-sm` (search input) → add
  `dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100`
- `bg-gray-100 text-gray-700` (Search button) → add `dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600`
- `text-gray-500 text-sm` (loading / empty state text) → add `dark:text-gray-400`
- `text-red-600 text-sm` (error text) — no change needed

3. **`SearchResults`**:

- `text-sm text-gray-500` (← Back button) → add `dark:text-gray-400`
- `text-xl font-semibold text-gray-800` (heading) → add `dark:text-gray-100`
- `border border-gray-300 rounded px-3 py-2 text-sm` (search input) → add
  `dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100`
- `bg-indigo-600 text-white` (Search button) — no change needed
- `text-gray-500 text-sm` (loading / empty state) → add `dark:text-gray-400`

**Validation rules:**
None beyond framework defaults.

**Dependencies:** None — first phase.

**Test scenarios:**

- `shouldRenderDarkShellBackgroundWhenDarkModeActive()`
- `shouldRenderDarkHeaderWhenDarkModeActive()`
- `shouldRenderDarkHeadingInDiaryListWhenDarkModeActive()`
- `shouldRenderDarkSearchInputWhenDarkModeActive()`
- `shouldRenderDarkStatusTextWhenDarkModeActive()`

---

### Phase 2 — Darken DiaryEntry

**Objective:** Apply `dark:` variants to the DiaryEntry page form container, all form element inputs,
select boxes, textareas, labels, and tag/link interaction elements.

**Files to create/modify:**

- `frontend/src/pages/DiaryEntry/index.tsx` — modify: add dark variants throughout the form

**Implementation steps:**

1. Loading text `text-gray-500 text-sm` (line 136) → add `dark:text-gray-400`
2. Back button `text-sm text-gray-500` (line 142) → add `dark:text-gray-400`
3. Heading `text-xl font-semibold text-gray-800` (line 145) → add `dark:text-gray-100`
4. Error message `text-red-600 text-sm` — no change needed
5. Form wrapper `bg-white rounded-lg border border-gray-200 p-6 space-y-5` (line 185) → add
   `dark:bg-gray-900 dark:border-gray-700`
6. All `text-xs font-medium text-gray-600` labels → add `dark:text-gray-400`
7. All `border border-gray-300 rounded px-3 py-2 text-sm` inputs, select, and textarea → add
   `dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100`
8. Unselected tag buttons `bg-gray-100 text-gray-600 hover:bg-gray-200` → add
   `dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600`
9. Archived tag buttons `bg-indigo-600 text-white opacity-60` — no change needed (indigo is fine)
10. New tag input `border border-gray-300 rounded px-3 py-1.5 text-sm` → add
    `dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100`
11. `+ Add tag` button `bg-gray-100 text-gray-700` → add `dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600`
12. Links label `text-xs font-medium text-gray-600` → add `dark:text-gray-400`
13. Link URL/label inputs `border border-gray-300 rounded px-3 py-1.5 text-sm` → add
    `dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100`
14. Remove link button `text-gray-400 hover:text-red-500` → add `dark:text-gray-500`
15. Cancel button `bg-gray-100 text-gray-700` → add `dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600`

**Validation rules:**
None beyond framework defaults.

**Dependencies:** Phase 1 must be complete before starting this phase.

**Test scenarios:**

- `shouldRenderDarkFormWrapperWhenDarkModeActive()`
- `shouldRenderDarkInputBordersWhenDarkModeActive()`
- `shouldRenderDarkLabelTextWhenDarkModeActive()`
- `shouldRenderDarkTagButtonsWhenDarkModeActive()`

---

### Phase 3 — Darken ProjectsManager and TagsManager

**Objective:** Apply `dark:` variants to both management pages' list items, section headers,
inputs, and empty states.

**Files to create/modify:**

- `frontend/src/pages/ProjectsManager/index.tsx` — modify: add dark variants
- `frontend/src/pages/TagsManager/index.tsx` — modify: add dark variants

**Implementation steps:**

1. **`ProjectsManager`**:

- Back button `text-sm text-gray-500` → add `dark:text-gray-400`
- Heading `text-xl font-semibold text-gray-800` → add `dark:text-gray-100`
- Error `text-red-600` — no change
- New project input `border border-gray-300 rounded px-3 py-2 text-sm` → add
  `dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100`
- Section headers `text-xs font-semibold text-gray-500 uppercase` → add `dark:text-gray-400`
- Empty state `text-sm text-gray-400` → add `dark:text-gray-500`
- Active list item `bg-white border border-gray-200 rounded-lg` → add `dark:bg-gray-800 dark:border-gray-700`
- Active project name `text-sm font-medium text-gray-800` → add `dark:text-gray-100`
- Archive button `text-amber-600 hover:text-amber-800 hover:bg-amber-50` — no dark variant needed (amber is readable)
- Delete button `text-gray-400 hover:text-red-600 hover:bg-red-50` → add `dark:text-gray-500 dark:hover:bg-red-900/20`
- Archived item `bg-gray-50 border border-gray-200 rounded-lg opacity-70` → add
  `dark:bg-gray-900 dark:border-gray-700`
- Archived name `text-sm text-gray-500` → add `dark:text-gray-400`

2. **`TagsManager`**:

- Back button `text-sm text-gray-500` → add `dark:text-gray-400`
- Heading `text-xl font-semibold text-gray-800` → add `dark:text-gray-100`
- Error `text-red-600` — no change
- New tag input `border border-gray-300 rounded px-3 py-2 text-sm` → add
  `dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100`
- Section headers `text-xs font-semibold text-gray-500 uppercase` → add `dark:text-gray-400`
- Empty state `text-sm text-gray-400` → add `dark:text-gray-500`
- Active tag chip `bg-white border border-gray-200 rounded-full` → add `dark:bg-gray-800 dark:border-gray-700`
- Tag name `text-sm text-gray-700` → add `dark:text-gray-300`
- Archive button `text-gray-400 hover:text-amber-600 hover:bg-amber-50` → add `dark:hover:bg-amber-900/20`
- Archived chip `bg-gray-50 border border-gray-200 rounded-full opacity-60` → add
  `dark:bg-gray-900 dark:border-gray-700`
- Archived tag name `text-sm text-gray-500` → add `dark:text-gray-400`
- Reactivate button `text-gray-400 hover:text-green-600 hover:bg-green-50` → add `dark:hover:bg-green-900/20`

**Validation rules:**
None beyond framework defaults.

**Dependencies:** Phase 1 must be complete before starting this phase.

**Test scenarios:**

- `shouldRenderDarkListItemsInProjectsManagerWhenDarkModeActive()`
- `shouldRenderDarkArchivedItemsInProjectsManagerWhenDarkModeActive()`
- `shouldRenderDarkTagChipsInTagsManagerWhenDarkModeActive()`
- `shouldRenderDarkArchivedTagChipsInTagsManagerWhenDarkModeActive()`

## Field Mappings Summary

No persistent fields involved.

## Validation Rules Summary

None beyond framework defaults.

## Test Plan

All tests are component render tests with `dark` class applied to a wrapper element:

**Phase 1:**

- `shouldRenderDarkShellBackgroundWhenDarkModeActive()` — assert `bg-gray-950` applied to outer div
- `shouldRenderDarkHeaderWhenDarkModeActive()` — assert `dark:bg-gray-900` present on header
- `shouldRenderDarkHeadingInDiaryListWhenDarkModeActive()` — render DiaryList, assert heading has `dark:text-gray-100`
- `shouldRenderDarkSearchInputWhenDarkModeActive()` — assert input has `dark:bg-gray-800`
- `shouldRenderDarkStatusTextWhenDarkModeActive()` — assert loading/empty text has `dark:text-gray-400`

**Phase 2:**

- `shouldRenderDarkFormWrapperWhenDarkModeActive()` — assert form container has `dark:bg-gray-900`
- `shouldRenderDarkInputBordersWhenDarkModeActive()` — assert inputs have `dark:border-gray-600`
- `shouldRenderDarkLabelTextWhenDarkModeActive()` — assert labels have `dark:text-gray-400`
- `shouldRenderDarkTagButtonsWhenDarkModeActive()` — assert unselected tag buttons have `dark:bg-gray-700`

**Phase 3:**

- `shouldRenderDarkListItemsInProjectsManagerWhenDarkModeActive()` — assert list items have `dark:bg-gray-800`
- `shouldRenderDarkArchivedItemsInProjectsManagerWhenDarkModeActive()` — assert archived items have `dark:bg-gray-900`
- `shouldRenderDarkTagChipsInTagsManagerWhenDarkModeActive()` — assert chips have `dark:bg-gray-800`
- `shouldRenderDarkArchivedTagChipsInTagsManagerWhenDarkModeActive()` — assert archived chips have `dark:bg-gray-900`

## Acceptance Criteria Coverage

| Acceptance criterion (from issue)                                                                                             | Covered by phase(s) |
|-------------------------------------------------------------------------------------------------------------------------------|---------------------|
| Dark mode applies consistently across all pages: `DiaryList`, `DiaryEntry`, `SearchResults`, `ProjectsManager`, `TagsManager` | Phases 1, 2, 3      |
| App shell header and background render dark                                                                                   | Phase 1 (App.tsx)   |

## Validation Gates

- `cd frontend && pnpm build` — passing: TypeScript compiles with no errors
- Browser (with `dark` class manually on `<html>`): all five pages and app shell render legible dark UI

## Completion Checklist

- [ ] `App.tsx` outer wrapper and header have `dark:` variants
- [ ] `DiaryList` heading, search input, search button, and status text have `dark:` variants
- [ ] `SearchResults` heading, back button, search input, and status text have `dark:` variants
- [ ] `DiaryEntry` form wrapper, all inputs/select/textarea, all labels, tag buttons, and Cancel button have `dark:`
  variants
- [ ] `ProjectsManager` inputs, list items, archived items, section headers, and empty state have `dark:` variants
- [ ] `TagsManager` inputs, tag chips, archived chips, section headers, and empty state have `dark:` variants
- [ ] No `dark:` variants added to `text-red-600` error messages (intentional — red reads on both themes)
- [ ] No `dark:` variants added to `bg-indigo-600` primary buttons (intentional — sufficient contrast)
- [ ] `pnpm build` passes with no errors

