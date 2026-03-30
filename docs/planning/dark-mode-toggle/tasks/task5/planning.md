# Task 5 — Apply Dark Mode Variants to All Components: Implementation Plan

## Task Overview

Task 5 adds `dark:` Tailwind utility variants to all five shared components: `EntryCard`, `FilterPanel`,
`MoodBadge`, `LinkList`, and `MultiSelectDropdown`. These components are reused across multiple pages
and must be styled consistently with the page-level dark variants applied in Task 4. No new files are
created — this is a targeted class-annotation pass. Tasks 1, 2, and 3 must be complete before dark
variants are visible in the browser. Task 4 (page variants) and Task 5 (component variants) cover
entirely disjoint files and can be developed in parallel on the same branch.

Design decisions:

- **Augment, don't replace**: existing class strings receive `dark:` counterparts in the same
  `className` prop. No structural JSX changes.
- **Color palette** matches Task 4: card surfaces `bg-white → dark:bg-gray-800`, inner surfaces
  `bg-gray-100 → dark:bg-gray-700`, borders `border-gray-200/300 → dark:border-gray-700/600`.
- **MoodBadge** uses a static `Record<Mood, {className}>` config object. Dark variants are appended
  directly to each mood's `className` string — not added as a conditional override in the render
  function — keeping the data/presentation separation clean.
- **MultiSelectDropdown** has two conditional class branches on the trigger button (selected vs.
  unselected state); both branches receive dark variants independently.

## Key References

| File                                                    | Lines  | Pattern to follow                                                                                                                                                                                                                                                                                                                                                                |
|---------------------------------------------------------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `frontend/src/components/EntryCard/index.tsx`           | 18–70  | Card wrapper `bg-white rounded-lg border border-gray-200` (line 18); project badge `bg-indigo-50 text-indigo-700` (line 28); content `text-gray-700` (line 48); tag chips `bg-gray-100 text-gray-600` (line 57)                                                                                                                                                                  |
| `frontend/src/components/FilterPanel/index.tsx`         | 43–107 | Form wrapper `bg-white rounded-lg border border-gray-200` (line 43); heading `text-gray-700` (line 44); labels `text-gray-500` (lines 50, 63, 72, 80); date inputs `border-gray-300` (lines 75, 84); buttons (lines 90–103)                                                                                                                                                      |
| `frontend/src/components/MoodBadge/index.tsx`           | 3–9    | `moodConfig` Record — each entry has a `className` string; dark variants appended to each string                                                                                                                                                                                                                                                                                 |
| `frontend/src/components/LinkList/index.tsx`            | 14–25  | Anchor `text-sm text-blue-600 hover:underline break-all` (line 20)                                                                                                                                                                                                                                                                                                               |
| `frontend/src/components/MultiSelectDropdown/index.tsx` | 48–103 | Trigger button two branches: unselected `border-gray-300 bg-white text-gray-500` (line 55), selected `border-indigo-400 bg-indigo-50 text-indigo-700` (line 56); dropdown panel `bg-white border border-gray-200 shadow-lg` (line 71); option row `hover:bg-gray-50` (line 78); unchecked label `text-gray-700` (line 86), checked label `text-indigo-700 font-medium` (line 86) |

## Architectural Constraints

- No structural JSX changes — only add `dark:` class variants to existing `className` strings
- No new npm packages
- `MoodBadge` — dark variants must be added to the `moodConfig` record strings, not as runtime conditionals
- `MultiSelectDropdown` — both the selected-state and unselected-state trigger branches must each
  receive appropriate dark variants

## Gotchas

- **`EntryCard` project badge** uses `bg-indigo-50 text-indigo-700` — a light indigo tint that
  looks washed out on dark backgrounds. Use `dark:bg-indigo-900/30 dark:text-indigo-300` for a
  muted but visible dark variant.
- **`MoodBadge` colour hierarchy in dark**: the `/30` opacity suffix on `bg-*-900/30` keeps mood
  badges visually distinct without being too saturated on a dark surface. Text moves from `*-800` to
  `*-400` for readability.
- **`LinkList` link colour**: `text-blue-600` is fine in light but can look too dark on a
  `gray-800` card. Use `dark:text-blue-400` (not `dark:text-blue-600`).
- **`MultiSelectDropdown` dropdown panel** is `bg-white border border-gray-200 shadow-lg`. The
  shadow (`shadow-lg`) works on both themes — no dark variant needed for shadow. Darken background
  and border only: `dark:bg-gray-800 dark:border-gray-700`.
- **`MultiSelectDropdown` option `hover:bg-gray-50`** — `gray-50` is nearly white and invisible
  on a dark panel. Must add `dark:hover:bg-gray-700`.
- **`FilterPanel` form wrapper** is the same pattern as `EntryCard` card: `bg-white border-gray-200`
  → `dark:bg-gray-800 dark:border-gray-700`.
- **`FilterPanel` Apply button** (`bg-indigo-600`) needs no dark variant. Clear button
  (`bg-gray-100 text-gray-700`) needs `dark:bg-gray-700 dark:text-gray-200`.

## Phase Breakdown

### Phase 1 — Darken EntryCard and LinkList

**Objective:** Apply dark variants to the `EntryCard` card wrapper, header elements, content text,
action buttons, and tag chips; and to the `LinkList` anchor colour.

**Files to create/modify:**

- `frontend/src/components/EntryCard/index.tsx` — modify: add dark variants to all bg/text/border classes
- `frontend/src/components/LinkList/index.tsx` — modify: add `dark:text-blue-400` to anchor

**Implementation steps:**

1. **`EntryCard`**:
  - Card wrapper `bg-white rounded-lg border border-gray-200 p-5 shadow-sm` → add
    `dark:bg-gray-800 dark:border-gray-700`
  - Date text `text-sm font-medium text-gray-500` → add `dark:text-gray-400`
  - Project badge `bg-indigo-50 text-indigo-700` → add `dark:bg-indigo-900/30 dark:text-indigo-300`
  - Content excerpt `text-sm text-gray-700 whitespace-pre-wrap` → add `dark:text-gray-300`
  - Edit button `text-xs text-gray-500 hover:text-indigo-600 hover:bg-indigo-50` → add
    `dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20`
  - Delete button `text-xs text-gray-500 hover:text-red-600 hover:bg-red-50` → add
    `dark:text-gray-400 dark:hover:bg-red-900/20`
  - Tag chips `bg-gray-100 text-gray-600` → add `dark:bg-gray-700 dark:text-gray-300`

2. **`LinkList`**:
  - Anchor `text-sm text-blue-600 hover:underline break-all` → add `dark:text-blue-400`

**Validation rules:**
None beyond framework defaults.

**Dependencies:** None — first phase.

**Test scenarios:**

- `shouldRenderDarkCardBackgroundInEntryCardWhenDarkModeActive()`
- `shouldRenderDarkProjectBadgeInEntryCardWhenDarkModeActive()`
- `shouldRenderDarkTagChipsInEntryCardWhenDarkModeActive()`
- `shouldRenderDarkContentTextInEntryCardWhenDarkModeActive()`
- `shouldRenderDarkLinkColourInLinkListWhenDarkModeActive()`

---

### Phase 2 — Darken MoodBadge

**Objective:** Add dark-mode class variants to each of the five mood entries in the `moodConfig`
record in `MoodBadge/index.tsx`.

**Files to create/modify:**

- `frontend/src/components/MoodBadge/index.tsx` — modify: extend each mood's `className` string
  with dark variants

**Implementation steps:**

1. Update `moodConfig` as follows (append dark variants to each `className`):
  - `GREAT`: `bg-green-100 text-green-800` → add `dark:bg-green-900/30 dark:text-green-400`
  - `GOOD`: `bg-blue-100 text-blue-800` → add `dark:bg-blue-900/30 dark:text-blue-400`
  - `NEUTRAL`: `bg-gray-100 text-gray-700` → add `dark:bg-gray-700 dark:text-gray-300`
  - `TIRED`: `bg-yellow-100 text-yellow-800` → add `dark:bg-yellow-900/30 dark:text-yellow-400`
  - `FRUSTRATED`: `bg-red-100 text-red-800` → add `dark:bg-red-900/30 dark:text-red-400`

**Validation rules:**
None beyond framework defaults.

**Dependencies:** Phase 1 must be complete before starting this phase.

**Test scenarios:**

- `shouldRenderDarkGreatMoodBadgeWhenDarkModeActive()`
- `shouldRenderDarkGoodMoodBadgeWhenDarkModeActive()`
- `shouldRenderDarkNeutralMoodBadgeWhenDarkModeActive()`
- `shouldRenderDarkTiredMoodBadgeWhenDarkModeActive()`
- `shouldRenderDarkFrustratedMoodBadgeWhenDarkModeActive()`

---

### Phase 3 — Darken FilterPanel and MultiSelectDropdown

**Objective:** Apply dark variants to the filter panel form wrapper, section header, labels, date
inputs, and buttons; and to the `MultiSelectDropdown` trigger button (both state branches), dropdown
panel, and option items.

**Files to create/modify:**

- `frontend/src/components/FilterPanel/index.tsx` — modify: add dark variants to form wrapper, heading, labels, inputs,
  Clear button
- `frontend/src/components/MultiSelectDropdown/index.tsx` — modify: add dark variants to trigger button, dropdown panel,
  option rows, and label text

**Implementation steps:**

1. **`FilterPanel`**:
  - Form wrapper `bg-white rounded-lg border border-gray-200 p-4 space-y-4` → add
    `dark:bg-gray-800 dark:border-gray-700`
  - Section heading `text-sm font-semibold text-gray-700 uppercase tracking-wide` → add `dark:text-gray-300`
  - Project/Tags labels `text-xs text-gray-500` → add `dark:text-gray-400`
  - From/To labels `text-xs text-gray-500` → add `dark:text-gray-400`
  - Date inputs `border border-gray-300 rounded px-3 py-1.5 text-sm` → add
    `dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100`
  - Apply button `bg-indigo-600 text-white` — no change needed
  - Clear button `bg-gray-100 text-gray-700` → add `dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600`

2. **`MultiSelectDropdown`**:
  - Trigger button, **unselected** branch: `border-gray-300 bg-white text-gray-500` → add
    `dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400`
  - Trigger button, **selected** branch: `border-indigo-400 bg-indigo-50 text-indigo-700` → add
    `dark:border-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-300`
  - Both branches share `focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors` — these need no dark
    variant
  - Dropdown panel `bg-white border border-gray-200 rounded-lg shadow-lg` → add `dark:bg-gray-800 dark:border-gray-700`
  - Empty state text `text-xs text-gray-400` → add `dark:text-gray-500`
  - Option row `hover:bg-gray-50 cursor-pointer` → add `dark:hover:bg-gray-700`
  - Checked label `text-indigo-700 font-medium` → add `dark:text-indigo-300`
  - Unchecked label `text-gray-700` → add `dark:text-gray-300`
  - `accent-indigo-600` on checkbox — no dark variant needed

**Validation rules:**
None beyond framework defaults.

**Dependencies:** Phases 1 and 2 must be complete before starting this phase.

**Test scenarios:**

- `shouldRenderDarkFilterPanelWrapperWhenDarkModeActive()`
- `shouldRenderDarkDateInputsInFilterPanelWhenDarkModeActive()`
- `shouldRenderDarkTriggerButtonUnselectedWhenDarkModeActive()`
- `shouldRenderDarkTriggerButtonSelectedWhenDarkModeActive()`
- `shouldRenderDarkDropdownPanelWhenOpenInDarkMode()`
- `shouldRenderDarkOptionLabelsInDropdownWhenDarkModeActive()`

## Field Mappings Summary

No persistent fields involved.

## Validation Rules Summary

None beyond framework defaults.

## Test Plan

All tests are component render tests (with `dark` class applied to a wrapping container or to
`document.documentElement` in the test setup):

**Phase 1 — EntryCard & LinkList:**

- `shouldRenderDarkCardBackgroundInEntryCardWhenDarkModeActive()` — assert `dark:bg-gray-800` present
- `shouldRenderDarkProjectBadgeInEntryCardWhenDarkModeActive()` — assert `dark:bg-indigo-900/30`
- `shouldRenderDarkTagChipsInEntryCardWhenDarkModeActive()` — assert `dark:bg-gray-700`
- `shouldRenderDarkContentTextInEntryCardWhenDarkModeActive()` — assert `dark:text-gray-300`
- `shouldRenderDarkLinkColourInLinkListWhenDarkModeActive()` — assert `dark:text-blue-400` on anchor

**Phase 2 — MoodBadge:**

- `shouldRenderDarkGreatMoodBadgeWhenDarkModeActive()` — render MoodBadge with `mood="GREAT"`, assert
  `dark:bg-green-900/30 dark:text-green-400`
- `shouldRenderDarkGoodMoodBadgeWhenDarkModeActive()` — mood GOOD
- `shouldRenderDarkNeutralMoodBadgeWhenDarkModeActive()` — mood NEUTRAL
- `shouldRenderDarkTiredMoodBadgeWhenDarkModeActive()` — mood TIRED
- `shouldRenderDarkFrustratedMoodBadgeWhenDarkModeActive()` — mood FRUSTRATED

**Phase 3 — FilterPanel & MultiSelectDropdown:**

- `shouldRenderDarkFilterPanelWrapperWhenDarkModeActive()` — assert form has `dark:bg-gray-800`
- `shouldRenderDarkDateInputsInFilterPanelWhenDarkModeActive()` — assert inputs have `dark:bg-gray-700`
- `shouldRenderDarkTriggerButtonUnselectedWhenDarkModeActive()` — assert unselected trigger has `dark:bg-gray-800`
- `shouldRenderDarkTriggerButtonSelectedWhenDarkModeActive()` — assert selected trigger has `dark:bg-indigo-900/30`
- `shouldRenderDarkDropdownPanelWhenOpenInDarkMode()` — open dropdown, assert panel has `dark:bg-gray-800`
- `shouldRenderDarkOptionLabelsInDropdownWhenDarkModeActive()` — assert unchecked label has `dark:text-gray-300`

## Acceptance Criteria Coverage

| Acceptance criterion (from issue)                                                                                                | Covered by phase(s) |
|----------------------------------------------------------------------------------------------------------------------------------|---------------------|
| Dark mode applies consistently across all components: `EntryCard`, `FilterPanel`, `MoodBadge`, `LinkList`, `MultiSelectDropdown` | Phases 1, 2, 3      |

## Validation Gates

- `cd frontend && pnpm build` — passing: TypeScript compiles with no errors
- Browser (with `dark` class on `<html>`): all five components render legible, well-contrasted dark UI

## Completion Checklist

- [ ] `EntryCard` card wrapper, date, project badge, content text, edit/delete buttons, and tag chips have `dark:`
  variants
- [ ] `LinkList` anchor has `dark:text-blue-400`
- [ ] `MoodBadge` all five mood entries in `moodConfig` have `dark:` background and text variants
- [ ] `FilterPanel` form wrapper, heading, labels, date inputs, and Clear button have `dark:` variants
- [ ] `MultiSelectDropdown` trigger button (both selected and unselected branches), dropdown panel, option rows, and
  option labels have `dark:` variants
- [ ] No `dark:` variants added to `bg-indigo-600` primary buttons or `accent-indigo-600` checkboxes
- [ ] `pnpm build` passes with no errors

