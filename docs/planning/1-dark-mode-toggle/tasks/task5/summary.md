# Task 5 Summary — Apply Dark Mode Variants to All Components

## Implemented files

| File | Action | Description |
|------|--------|-------------|
| `frontend/src/components/EntryCard/index.tsx` | modified | Dark variants on card wrapper, date text, project badge, content excerpt, edit/delete buttons, and tag chips |
| `frontend/src/components/LinkList/index.tsx` | modified | `dark:text-blue-400` on anchor text |
| `frontend/src/components/MoodBadge/index.tsx` | modified | Dark background (`dark:bg-*-900/30`) and text (`dark:text-*-400`) variants added to all five mood entries in `moodConfig` |
| `frontend/src/components/FilterPanel/index.tsx` | modified | Dark variants on form wrapper, heading, labels, date inputs, and Clear button |
| `frontend/src/components/MultiSelectDropdown/index.tsx` | modified | Dark variants on trigger button (both selected and unselected branches), dropdown panel, empty state text, option rows, and option labels |

## API surface changes

None — this is a purely frontend feature.

## Data model changes

None.

## Test coverage notes

Test Agent not available in this workspace. Recommended test targets:

**Phase 1 — EntryCard & LinkList:**
- `shouldRenderDarkCardBackgroundInEntryCardWhenDarkModeActive()` — assert `dark:bg-gray-800` present on card wrapper
- `shouldRenderDarkProjectBadgeInEntryCardWhenDarkModeActive()` — assert `dark:bg-indigo-900/30` on project badge
- `shouldRenderDarkTagChipsInEntryCardWhenDarkModeActive()` — assert `dark:bg-gray-700` on tag chips
- `shouldRenderDarkContentTextInEntryCardWhenDarkModeActive()` — assert `dark:text-gray-300` on content excerpt
- `shouldRenderDarkLinkColourInLinkListWhenDarkModeActive()` — assert `dark:text-blue-400` on anchor

**Phase 2 — MoodBadge:**
- `shouldRenderDarkGreatMoodBadgeWhenDarkModeActive()` — render MoodBadge with `mood="GREAT"`, assert `dark:bg-green-900/30 dark:text-green-400`
- `shouldRenderDarkGoodMoodBadgeWhenDarkModeActive()` — mood GOOD, assert `dark:bg-blue-900/30 dark:text-blue-400`
- `shouldRenderDarkNeutralMoodBadgeWhenDarkModeActive()` — mood NEUTRAL, assert `dark:bg-gray-700 dark:text-gray-300`
- `shouldRenderDarkTiredMoodBadgeWhenDarkModeActive()` — mood TIRED, assert `dark:bg-yellow-900/30 dark:text-yellow-400`
- `shouldRenderDarkFrustratedMoodBadgeWhenDarkModeActive()` — mood FRUSTRATED, assert `dark:bg-red-900/30 dark:text-red-400`

**Phase 3 — FilterPanel & MultiSelectDropdown:**
- `shouldRenderDarkFilterPanelWrapperWhenDarkModeActive()` — assert form has `dark:bg-gray-800`
- `shouldRenderDarkDateInputsInFilterPanelWhenDarkModeActive()` — assert date inputs have `dark:bg-gray-700`
- `shouldRenderDarkTriggerButtonUnselectedWhenDarkModeActive()` — assert unselected trigger has `dark:bg-gray-800`
- `shouldRenderDarkTriggerButtonSelectedWhenDarkModeActive()` — assert selected trigger has `dark:bg-indigo-900/30`
- `shouldRenderDarkDropdownPanelWhenOpenInDarkMode()` — open dropdown, assert panel has `dark:bg-gray-800`
- `shouldRenderDarkOptionLabelsInDropdownWhenDarkModeActive()` — assert unchecked label has `dark:text-gray-300`

## ADR candidates

None — dark variant application follows the same augment-don't-replace pattern established in Tasks 1–4; no new architectural decisions were made.

## Arc42 chapters to update

- **08**: The cross-cutting dark mode strategy note (class on `<html>`, Tailwind `dark:` variants) can be extended to confirm all shared components are fully covered, completing the feature description started in Task 1.

