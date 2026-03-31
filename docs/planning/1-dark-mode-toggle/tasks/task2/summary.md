# Task 2 Summary — Dark Mode Toggle

## Implemented files

| File | Action | Description |
|------|--------|-------------|
| `frontend/src/context/ThemeContext.tsx` | created | ThemeProvider + useTheme hook; lazy-initialises from localStorage with prefers-color-scheme fallback; toggles `dark` class on `document.documentElement`; persists selection to localStorage |

## API surface changes

None — this is a purely frontend feature.

## Data model changes

None.

## Test coverage notes

Test Agent not available in this workspace. Recommended test targets:
- `shouldReturnLightWhenLocalStorageHasLight()` — mock `localStorage.getItem` to return `'light'`
- `shouldReturnDarkWhenLocalStorageHasDark()` — mock `localStorage.getItem` to return `'dark'`
- `shouldFallbackToDarkWhenSystemPrefersDark()` — mock `localStorage.getItem` to return `null`, mock `window.matchMedia` to return `{ matches: true }`
- `shouldFallbackToLightWhenNoPreferenceAndNoStorage()` — both return negative/null
- `shouldFallbackToLightWhenLocalStorageThrows()` — mock `localStorage.getItem` to throw
- `shouldToggleFromLightToDark()` — render provider, call `toggleTheme()`, assert `theme === 'dark'`
- `shouldToggleFromDarkToLight()` — start dark, toggle, assert light
- `shouldPersistThemeToLocalStorageOnToggle()` — assert `localStorage.setItem('theme', 'dark')` called
- `shouldApplyDarkClassToDocumentElementOnToggle()` — assert `document.documentElement.classList` contains `'dark'` after toggle to dark
- `shouldRemoveDarkClassFromDocumentElementWhenTogglingToLight()` — assert `'dark'` class removed after toggle back to light
- `shouldThrowWhenUseThemeCalledOutsideProvider()` — render without provider, expect thrown error `'useTheme must be used inside ThemeProvider'`

## ADR candidates

None — class-based dark mode with localStorage persistence is the established shadcn/ui pattern.

## Arc42 chapters to update

- **08**: Add a note under Cross-cutting Concepts documenting the dark mode strategy: ThemeContext as single source of truth, class toggled on `<html>`, localStorage persistence, and `prefers-color-scheme` auto-detection on first visit.

