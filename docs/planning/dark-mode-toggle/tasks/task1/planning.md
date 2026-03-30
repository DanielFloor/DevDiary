lap# Task 1 — Configure Tailwind Dark Mode and CSS Variables: Implementation Plan

## Task Overview

Task 1 lays the foundational configuration for the entire dark mode feature. It covers two config-level
changes: enabling Tailwind's class-based dark mode strategy in `tailwind.config.js`, and adding the
`.dark { ... }` CSS variable override block to `index.css`. No React components are touched. These
changes must land first because every subsequent task depends on `darkMode: 'class'` being present
before `dark:` utility variants are generated at build time, and the CSS variable block is required
for any shadcn/ui Radix primitives (e.g., `Button`) that consume token variables.

Design decisions made:

- **`darkMode: 'class'`** chosen over `'media'` because the feature requires a user-controlled toggle
  with `localStorage` persistence — `'media'` would only reflect the OS preference and cannot be
  overridden by the app.
- **CSS variable names** must match the shadcn/ui token set exactly (e.g., `--background`,
  `--foreground`, `--card`) so Radix-based components that read those tokens automatically adopt dark
  colours without requiring `dark:` variants on every element.
- No other tasks need to precede this one.

## Key References

| File                          | Lines | Pattern to follow                                                                                         |
|-------------------------------|-------|-----------------------------------------------------------------------------------------------------------|
| `frontend/tailwind.config.js` | 1–10  | Entire config is 10 lines; `darkMode: 'class'` is a top-level key alongside `content`, `theme`, `plugins` |
| `frontend/src/index.css`      | 1–5   | Currently only three Tailwind directives; `.dark { }` block is appended after `@tailwind utilities`       |

## Documentation

- https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually — exact key name and placement in config
- https://ui.shadcn.com/themes — reference dark-palette HSL values for all shadcn CSS token overrides

## Architectural Constraints

- `darkMode: 'class'` is the only permitted strategy (per issue Technical Notes)
- No new npm packages
- CSS variable names must match the existing shadcn/ui token set — do not invent new names
- The `.dark {}` block goes in `index.css`, not in a separate file

## Gotchas

- The current `index.css` has **no `:root {}` block** — the app uses direct Tailwind utility classes
  (`bg-white`, `text-gray-800`) rather than CSS token variables. The `.dark {}` block still adds value
  for any Radix/shadcn primitives that read token variables, and future-proofs the codebase.
- Tailwind **only generates** `dark:` variant classes for utility classes that actually appear in the
  scanned `content` files. Adding `darkMode: 'class'` alone produces no output until Tasks 4 and 5
  actually add `dark:` prefixed utilities to page/component files.
- Do not rename or abbreviate token variables — shadcn's components reference them by exact name.
- `@layer base` is the correct Tailwind layer for CSS variable definitions; wrap the `.dark {}` block
  in `@layer base { }` so Tailwind includes it in the base layer reset.

## Phase Breakdown

### Phase 1 — Enable Tailwind Class-Based Dark Mode

**Objective:** Add `darkMode: 'class'` to `tailwind.config.js` so the Tailwind compiler generates
`dark:` utility variants whenever a `dark` class is present on `<html>`.

**Files to create/modify:**

- `frontend/tailwind.config.js` — modify: add `darkMode: 'class'` top-level key

**Implementation steps:**

1. Open `frontend/tailwind.config.js`.
2. Add `darkMode: 'class'` as a new top-level property in the exported config object, placed
   before `content` for readability.

**Validation rules:**
None beyond framework defaults.

**Dependencies:** None — first phase.

**Test scenarios:**

- `shouldGenerateDarkVariantsWhenDarkClassPresentOnHtml()` — manual/visual: temporarily add class
  `dark` to `<html>` in the browser DevTools and confirm a `dark:bg-gray-900` utility on any element
  is applied.

---

### Phase 2 — Add `.dark` CSS Variable Block to index.css

**Objective:** Append a `.dark { ... }` block inside `@layer base` to `index.css` that overrides all
standard shadcn/ui CSS tokens with dark-mode-appropriate HSL values.

**Files to create/modify:**

- `frontend/src/index.css` — modify: append `@layer base { .dark { ... } }` after `@tailwind utilities`

**Implementation steps:**

1. Open `frontend/src/index.css`.
2. After the `@tailwind utilities` directive, add:
   ```css
   @layer base {
     .dark {
       --background: 222.2 84% 4.9%;
       --foreground: 210 40% 98%;
       --card: 222.2 84% 4.9%;
       --card-foreground: 210 40% 98%;
       --popover: 222.2 84% 4.9%;
       --popover-foreground: 210 40% 98%;
       --primary: 217.2 91.2% 59.8%;
       --primary-foreground: 222.2 47.4% 11.2%;
       --secondary: 217.2 32.6% 17.5%;
       --secondary-foreground: 210 40% 98%;
       --muted: 217.2 32.6% 17.5%;
       --muted-foreground: 215 20.2% 65.1%;
       --accent: 217.2 32.6% 17.5%;
       --accent-foreground: 210 40% 98%;
       --destructive: 0 62.8% 30.6%;
       --destructive-foreground: 210 40% 98%;
       --border: 217.2 32.6% 17.5%;
       --input: 217.2 32.6% 17.5%;
       --ring: 224.3 76.3% 48%;
     }
   }
   ```
3. Use the standard shadcn dark palette from https://ui.shadcn.com/themes as the HSL reference.

**Validation rules:**
None beyond framework defaults.

**Dependencies:** Phase 1 must be complete before starting this phase.

**Test scenarios:**

- `shouldApplyDarkBackgroundTokenWhenDarkClassPresent()` — manual/DevTools: add `dark` to `<html>`,
  inspect `var(--background)` computed value on any element.

## Field Mappings Summary

No persistent fields involved.

## Validation Rules Summary

None beyond framework defaults.

## Test Plan

- **Phase 1**: manual visual test — `darkMode: 'class'` in config enables `dark:` variant generation.
- **Phase 2**: manual DevTools test — `.dark {}` CSS variables resolve to expected HSL values.

## Acceptance Criteria Coverage

| Acceptance criterion (from issue)                                                             | Covered by phase(s) |
|-----------------------------------------------------------------------------------------------|---------------------|
| Clicking the button switches between light and dark mode immediately (foundation required)    | Phase 1             |
| Dark mode applies consistently across all pages and components (Tailwind config prerequisite) | Phase 1             |
| `.dark` CSS variable overrides in place for shadcn token compatibility                        | Phase 2             |

## Validation Gates

- `cd frontend && pnpm build` — passing: build completes with zero TypeScript or Tailwind errors

## Completion Checklist

- [ ] `darkMode: 'class'` present as a top-level key in `frontend/tailwind.config.js`
- [ ] `.dark { ... }` CSS variable block present inside `@layer base` in `frontend/src/index.css`
- [ ] All standard shadcn/ui tokens overridden: `--background`, `--foreground`, `--card`,
  `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`,
  `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`,
  `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`
- [ ] `pnpm build` passes with no errors

