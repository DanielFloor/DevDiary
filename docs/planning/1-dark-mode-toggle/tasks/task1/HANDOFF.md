# Implementation Handoff — Task 1: Dark Mode Toggle

## Status
All validation gates passed. Ready for Test Agent.

## Changed Files
| File | Type | Purpose |
|------|------|---------|
| `frontend/tailwind.config.js` | modified | Enable class-based dark mode |
| `frontend/src/index.css` | modified | Dark CSS variable overrides for shadcn/ui tokens |
| `frontend/src/context/ThemeContext.tsx` | created | ThemeProvider + useTheme hook |
| `frontend/src/components/ThemeToggle/index.tsx` | created | Sun/Moon toggle button |
| `frontend/src/App.tsx` | modified | ThemeProvider wrapper, sticky header, ThemeToggle in nav, dark variants |
| `frontend/src/pages/DiaryList/index.tsx` | modified | Dark variant classes |
| `frontend/src/pages/SearchResults/index.tsx` | modified | Dark variant classes |
| `frontend/src/pages/DiaryEntry/index.tsx` | modified | Dark variant classes |
| `frontend/src/pages/ProjectsManager/index.tsx` | modified | Dark variant classes |
| `frontend/src/pages/TagsManager/index.tsx` | modified | Dark variant classes |
| `frontend/src/components/EntryCard/index.tsx` | modified | Dark variant classes |
| `frontend/src/components/LinkList/index.tsx` | modified | Dark variant class on anchor |
| `frontend/src/components/MoodBadge/index.tsx` | modified | Dark variants on all five mood configs |
| `frontend/src/components/FilterPanel/index.tsx` | modified | Dark variant classes |
| `frontend/src/components/MultiSelectDropdown/index.tsx` | modified | Dark variant classes |

## Public Contracts Introduced

### `ThemeContext.tsx`
```ts
export type Theme = 'light' | 'dark'

// Context value
interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

// Provider
export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element

// Hook — throws if called outside ThemeProvider
export function useTheme(): ThemeContextValue
```

### `ThemeToggle/index.tsx`
```ts
export default function ThemeToggle(): JSX.Element
// - Renders <Moon size={18}/> when theme === 'light'
// - Renders <Sun size={18}/> when theme === 'dark'
// - aria-label: 'Switch to dark mode' | 'Switch to light mode'
// - onClick calls toggleTheme()
```

## Validation Gates Passed
| Command | Result |
|---------|--------|
| `pnpm exec tsc --noEmit` | ✅ 0 errors |
| `pnpm build` | ✅ built in 2.21s, 0 errors |

## Patterns in Use

Key reference files for testing conventions:
- `frontend/src/context/ThemeContext.tsx` — the context/hook pattern used throughout
- `frontend/src/components/ThemeToggle/index.tsx` — simple component consuming the context

## Known Risks / Edge Cases

- `getInitialTheme` runs at module load in the browser; tests must mock `localStorage` and `window.matchMedia`
- The `useEffect` in `ThemeProvider` applies the initial `dark` class synchronously on first render — important for SSR-like testing environments
- `toggleTheme` deliberately does NOT call `setTheme` then re-read state; it uses the computed `next` value directly for the localStorage write and class toggle to avoid stale closure issues

