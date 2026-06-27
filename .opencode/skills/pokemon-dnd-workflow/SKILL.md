---
name: pokemon-dnd-workflow
description: >-
  Use this skill when making changes to the Pokémon D&D Companion project (Next.js, TypeScript, Zustand, Tailwind CSS 4).
  It captures the project's conventions — color system, component patterns, navigation updates, testing rules, and
  verification workflow. Always activate when the working directory is `pokemon-dnd-companion` or the user
  mentions working on this project.
---

# Pokémon D&D Companion — Development Workflow

## 1. Project Overview

| Aspect | Detail |
|--------|--------|
| Framework | Next.js 15 (App Router, Turbopack dev) |
| Language | TypeScript 5.9 |
| State | Zustand 5 (real store in tests, never mock) |
| Styling | Tailwind CSS 4 + custom CSS vars |
| Testing | Jest 30 + @testing-library/react + jest-dom |
| Path alias | `@/` → `src/` |

### Directory structure
```
src/
  app/                        # Next.js app router pages
  components/shared/          # Cross-feature reusable UI
  features/                   # Feature modules (pokemon/, trainer/)
  store/                      # Zustand store + helpers
  fixtures/                   # Reusable test data
  types/                      # TS domain models
  utils/                      # Pure helpers
  tests/                      # Global test utilities
specs/                        # Feature specs (living documents)
docs/                         # Design reference docs (static)
```

### Component pattern
```
ComponentName/
  index.tsx        # Component code
  index.test.tsx   # Co-located tests
```

### Reference: Modal / Overlay component pattern
Use this when creating any overlay component (modal, dialog, popover):
```tsx
"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — clicks on backdrop close */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md bg-surface rounded-lg border border-white/10 shadow-lg"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-interactive hover:bg-interactive-hover transition-colors flex items-center justify-center text-primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
```

Key patterns to follow:
- Use `createPortal` to render at `document.body` (not nested in page layout)
- Always set `role="dialog"` and `aria-modal="true"` on the panel
- Use `bg-surface` for the panel, `bg-interactive`/`hover:bg-interactive-hover` for close button
- Handle Escape key via `keydown` event listener
- Lock body scroll (`overflow: hidden`) while open with proper cleanup
- Return `null` when closed (don't render hidden DOM)

---

## 2. Color System

**Always use CSS variables / Tailwind utilities instead of hardcoded hex values.**

### Design tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-interactive` | `#EE5D20` | Primary buttons, focus rings |
| `--color-interactive-hover` | `#d44d15` | Button hover |
| `--color-surface` | `#222222` | Cards, inputs, dropdowns |
| `--color-surface-hover` | `#2d2d2d` | Card hover |
| `--color-bg` | `#1a1a1a` | Page background |
| `--color-accent` | `#3B82F6` | XP/progress bars ONLY |
| `--color-text-primary` | `#f0f0f0` | Main text |
| `--color-text-secondary` | `#a0a0a0` | Muted text |

### Tailwind utilities

| Hardcoded | Utility |
|-----------|---------|
| `bg-[#EE5D20]` | `bg-interactive` |
| `bg-[#222222]` | `bg-surface` |
| `bg-[#1a1a1a]` | (root bg, only in layout) |
| `ring-[#EE5D20]` | `ring-interactive` |
| `border-[#EE5D20]` | `border-interactive` |
| `text-[#f0f0f0]` | `text-primary` |
| `text-[#a0a0a0]` | `text-secondary` |

### Keep semantic colors AS-IS (blue/type colors)
- XP bars, HP bars, level indicators
- Pokemon TYPE_COLORS, STATUS_COLORS
- SVG fills in splash screen

### When a color doesn't have a direct match
If the source code has a hardcoded color not in the token table:
- **Check `globals.css`** — the linked `--color-*` variable may already exist
- **Round to nearest token** — e.g. `#252525` → use `bg-surface` (`#222222`), `#333` → `bg-surface`
- **Propose extending** the design system in `globals.css` with a new `--color-*` variable if no token fits

### When editing a file with hardcoded colors
Always read `docs/color-migration-guide.md` before making changes. Replace as shown above.

---

## 3. Adding a New Route

1. Create `src/app/<route>/page.tsx` — add `"use client"` if interactive
2. Add navigation link in `src/components/shared/Navigation/index.tsx`:
   - Add an SVG icon component (inline SVG, matching existing style)
   - Add a nav item config object in the `items` array
   - **Place the new item in logical order** (e.g. Dashboard → Team → *Inventory* → Trainer → Rulebook)
   - No `getPrimarySegment` changes needed (it splits by "/" automatically)
3. If the page uses store data, use Zustand selectors (not full store spread)
4. Use design system colors on the page:
   - Heading: `text-primary` (not `text-white`)
   - Body text: `text-secondary` (not `text-gray-300`)

### Icon pattern
```tsx
const IconMyRoute = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
    className={props.className ?? "w-5 h-5"}>
    {/* SVG paths */}
  </svg>
);
```

### Nav item config
```tsx
{
  key: "my-route",
  label: "My Route",
  href: "/my-route",
  icon: <IconMyRoute />,
  badge: optionalBadge,  // only if badge is needed
  isActive: (p) => getPrimarySegment(p) === "my-route",
}
```

---

## 4. Testing Conventions

### Core rules
- **Use real Zustand store** — never mock the store. Import `useAppStore` and assert against `useAppStore.getState()`.
- **Prefer integration-style tests** — render real components, interact like a user.
- **Test behavior, not implementation** — assert on visible text, roles, attributes, not internal state.

### DOM query priority
1. `getByRole` — best: `getByRole("button", { name: /label/i })`
2. `getByText` — when no semantic element: `getByText("Exact Text")`
3. `getByTestId` — only when no semantic alternative exists

### What to test (coverage checklist)
Aim for at least these test cases per component:

| Category | Examples |
|----------|----------|
| **Render** | Renders with expected text/roles for default props |
| **Empty/null state** | Renders nothing or placeholder when optional data is absent |
| **Interaction** | Clicking a button calls the handler, toggling state shows/hides content |
| **Edge cases** | Keyboard events (Escape), backdrop clicks (for modals/overlays), disabled states |
| **Store integration** | Mutations via `useAppStore.getState()` produce visible changes |

### Tools available (already in jest.setup.ts)
- `@testing-library/jest-dom` matchers (`toBeInTheDocument`, `toBeDisabled`, etc.)
- `crypto.randomUUID` polyfill
- `localStorage` mock
- `matchMedia` mock
- `alert` mock

### Writing a test file
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Component from ".";

describe("ComponentName", () => {
  it("renders with expected content", () => {
    render(<Component prop={value} />);
    expect(screen.getByRole("heading", { name: /title/i })).toBeInTheDocument();
  });

  it("handles interaction", () => {
    render(<Component />);
    fireEvent.click(screen.getByRole("button", { name: /do thing/i }));
    // assert on visible result
  });

  it("handles edge case (e.g. Escape key)", () => {
    render(<Component />);
    fireEvent.keyDown(document, { key: "Escape" });
    // assert expected behavior
  });
});
```

### Testing state-dependent components
```tsx
import { useAppStore } from "@/store";

// Set up store state before render
useAppStore.setState({
  trainer: { name: "Ash", level: 5, ... },
  pokemonTeam: { uuid: { /* ... */ } },
});
```

---

## 5. Verification Checklist (before finishing)

- [ ] `npm run lint` — no new errors (pre-existing warnings are OK)
- [ ] `npm run build` — compiles clean
- [ ] `npm test` — existing tests still pass
- [ ] When adding new files, check:
  - Imports use `@/` alias, not relative chains
  - Colors use CSS variables / Tailwind utilities, not hardcoded hex
  - Component follows `ComponentName/index.tsx` pattern
  - Test is co-located at `ComponentName/index.test.tsx`
  - No `any` types without documented justification
- [ ] Test coverage — at minimum:
  - Render / empty state
  - One interaction (click, toggle, submit)
  - One edge case (Escape key, disabled state, boundary condition)

---

## 6. State Management (Zustand)

```tsx
// Reading — use selectors to avoid unnecessary re-renders
const pokemon = useAppStore.use.pokemonTeam();
const trainer = useAppStore.use.trainer();

// Mutating — call actions directly
useAppStore.getState().setTrainer({ ... });
useAppStore.getState().addPokemon(newPokemon);
```

---

## 7. Common Gotchas

- `@utility` in Tailwind 4 does NOT accept variant suffixes (`:hover`, `:focus`). Use `hover:bg-surface` in className instead.
- Zustand persist middleware auto-handles rehydration; tracked via `_hasHydrated` flag in store.
- Build cache issues: `rm -rf .next && npm run build` if you see `ENOENT` for page paths.
