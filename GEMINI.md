# Gemini Agent Instructions

Operational guide for the AI assistant working on `pokemon-dnd-companion`.

---
## 1. Project Overview
Next.js (App Router) + TypeScript client‑side companion app for a hybrid Pokémon + D&D tabletop session. Current scope is player (not DM) oriented: managing a Trainer and a party of Pokémon locally (no backend).

---
## 2. Current Tech Stack (Pinned Versions)
| Aspect | Tech / Version |
|--------|----------------|
| Framework | Next.js 15.4.6 (app directory, Turbopack dev) |
| Language | TypeScript 5.9.x |
| React | React 19.1.0 |
| State | Zustand 5 (real store in tests) |
| Styling | Tailwind CSS 4 + custom CSS vars |
| Testing | Jest 30 + @testing-library/react + jest-dom |
| Build Dev | `next dev --turbopack` |
| Persistence | `localStorage` (custom hydration) |
| Path Alias | `@/` -> `src/` (see `jest.config.ts`) |

Do not introduce alternative state managers, test frameworks, or styling systems without explicit approval.

---
## 3. Scripts
```
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm start            # Serve built app
npm run lint         # ESLint (flat config)
npm test             # Jest test suite
npm run test:watch   # Watch mode
npm run test:coverage# Coverage report
```

---
## 4. Repository & Structure Conventions
Feature‑centric layout + shared components:
```
src/
	app/                 # Next.js app router entry/layout
	components/shared/   # Cross-feature reusable UI
	features/
		pokemon/
		trainer/
	store/               # Zustand store + helpers
	fixtures/            # Reusable test data (DO use instead of ad-hoc objects)
	tests/               # Global test docs + utilities
	types/               # TS domain models
	utils/               # Pure helpers / mappers
doc/                   # Design specs / feature docs (authoritative planning)
docs/                  # Ancillary or user-facing conceptual docs
```

Distinction:
- `doc/` = living design + requirements (update first when adding/modifying features)
- `docs/` = supplemental / gameplay / narrative / domain notes

### Component Pattern
```
ComponentName/
	index.tsx
	index.test.tsx
```
Keep components small; if you need explanatory comments for internal sections, consider splitting into sub-components.

### Imports
Use path alias `@/` instead of relative chains (`../../..`).

---
## 5. Testing Standards & Philosophy
Principles:
- Test behavior, not implementation details.
- Prefer integration-style tests using real components + real Zustand store.
- Never mock the Zustand store or replace it with a custom test version.
- Avoid snapshot tests. If encountered, propose converting to explicit assertions (state, text, roles, attributes, side-effects) — get confirmation before refactor.
- Keep assertions user-centric: visible text, roles, aria states, computed values.

### DOM Query Priority
1. `getByRole`
2. `getByText`
3. `getByTestId` (only when no semantic alternative exists)
4. `queryBy*` variants for absence assertions

If `getByRole` isn't available, consider adding an appropriate semantic element or ARIA role (without harming accessibility) rather than defaulting immediately to `data-testid`.

### Test Utilities
- Reuse factory / fixture data from `src/fixtures`.
- Place shared helpers in `src/tests/utils/`.
- Ensure new fixtures are deterministic (no random unless seeded) to keep tests stable.

### Setup Environment (jest.setup.ts)
Includes:
- `@testing-library/jest-dom` matchers
- Polyfills / mocks: `crypto.randomUUID`, `localStorage`, `matchMedia`, `alert`
Do not duplicate or override these silently in individual tests.

### Coverage
Collects from `src/**/*.{js,jsx,ts,tsx}` excluding `.d.ts`. Strive to cover critical paths (store mutations, modal flows, interactive buttons). Avoid aiming for arbitrary %; focus on risk / complexity areas first.

---
## 6. Development Workflow (For the Agent)
1. Requirements: Clarify ambiguous user requests. If underspecified, list assumptions explicitly before proceeding.
2. Planning: Produce a TODO (single in‑progress item rule) before coding multi‑step changes; get user sign‑off for feature-level work.
3. Documentation First: Update / create spec in `doc/` for new or changed features prior to implementation.
4. Implementation: Follow structure & naming. Keep PR-sized edits cohesive (one feature or fix).
5. Manual Verification: Summarize changes & prompt user to manually validate UI/behavior.
6. Test Authoring: Add / adjust tests only after user confirms manual behavior is correct.
7. Quality Gates: Run lint + tests (and coverage if relevant) before finalizing.
8. Commit: Use clear, present-tense messages (e.g., "Add HP modifier component validation"). Reference doc updates when applicable.

---
## 7. Linting & Quality
- Run `npm run lint` before committing substantive changes.
- Prefer fixing root causes over disabling rules. If a disable is justified, annotate with a concise rationale.
- Keep TypeScript types narrow and explicit; avoid `any` unless unavoidable (document why).

---
## 8. Adding / Modifying Features
When adding a feature (e.g., Attack Management, Inventory, etc.):
1. Create / update a markdown spec under `doc/` (problem, scope, data shape, UI entry points, edge cases).
2. Define data model changes (extend types in `src/types`).
3. Update store shape & pure helpers (ensure backward-safe hydration if existing localStorage keys are reused).
4. Implement UI components with tests pending.
5. Manual review & user confirmation.
6. Add tests covering:
	 - Rendering (roles / text)
	 - Critical interactions (add/edit/delete flows)
	 - Store mutations & derived UI state
	 - Edge cases (empty lists, min/max bounds)

---
## 9. Accessibility Guidance
- Always ensure interactive elements are keyboard reachable (native buttons/inputs preferred).
- Provide `aria-label` or visually hidden text only when semantics are otherwise unclear.
- Prefer real semantic elements (button, form, list, heading hierarchy) over generic `<div>` wrappers.

---
## 10. Performance Considerations
- Leverage Zustand selectors to minimize re-renders (avoid spreading full store into components).
- Keep derived calculations pure & memoized if costly (most are currently lightweight).
- Avoid unnecessary React state when value can come directly from the store selector.

---
## 11. Guardrails / Things NOT To Do Without Approval
- No introduction of server-side persistence or external APIs.
- No adding alternative styling systems (e.g., styled-components) alongside Tailwind.
- No snapshot tests.
- No global monkey-patching beyond `jest.setup.ts`.
- No large utility "kitchen sink" modules—prefer focused helpers.

---
## 12. Review Checklist (Pre-Commit)
- [ ] Spec in `doc/` updated/created
- [ ] README or other docs updated if user-facing behavior changed
- [ ] Lint passes
- [ ] Tests added/updated (post manual confirmation)
- [ ] No unused exports / dead code
- [ ] Accessibility semantics preserved
- [ ] Commit message clear & scoped

---
## 13. Open Gaps / Future (Reference Only)
Roadmap items (attacks, inventory, evolution, battle system, multiplayer, PWA, cloud sync) exist but are intentionally deferred; do not stub premature abstractions.

---
## 14. Quick Reference
| Task | Action |
|------|--------|
| Start Dev | `npm run dev` |
| Run Tests | `npm test` |
| Watch Tests | `npm run test:watch` |
| Coverage | `npm run test:coverage` |
| Lint | `npm run lint` |

---
## 15. Component Acceptance Mini-Checklist
- Renders with meaningful roles / text
- Handles empty / boundary props gracefully
- Interacts with store predictably (idempotent updates where relevant)
- Test covers render + at least one interaction path + one edge case

---
## 16. Document Currency
This file should be updated whenever:
- A new domain concept is added
- Testing strategy changes
- Tooling / script versions change materially
If README diverges from this guide, reconcile both (README = user/dev overview, GEMINI.md = agent operational guide).

---
By following this guide the agent maintains consistency, reliability, and forward scalability without premature complexity.
