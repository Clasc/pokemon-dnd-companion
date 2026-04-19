# Agent Instructions

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
- `specs/` = living feature specs (status tracking for active work)
- `doc/` = supplemental design notes (static reference)
- `bugs/` = bug tracking (status: Open → Fixed)

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

### Core Principle: Always Work in Specs
All feature work starts from and returns to specs. Never implement without a spec.

### Workflow Steps

1. **Requirements**: Clarify ambiguous requests. List assumptions explicitly if underspecified.

2. **Spec First**: Create or update a spec in `specs/` (features) or `bugs/` (issues) **before** any implementation.

3. **Start Work: Create Git Worktree**
   - When beginning work on a spec, create a new git worktree:
     ```bash
     git worktree add -b feature/<spec-name> .worktrees/feature-<spec-name>
     ```
   - Worktrees keep spec-specific changes isolated and allow parallel workstreams.

4. **Implementation**
   - Update spec status to `in_progress` when starting
   - Follow structure & naming conventions
   - Keep PR-sized edits cohesive (one feature or fix per worktree)

5. **Manual Verification**: Summarize changes & prompt user to validate UI/behavior.

6. **Test Authoring**: Add tests only after user confirms manual behavior is correct.

7. **Quality Gates**: Run lint + tests before committing.

8. **Commit with Status Update**
   - Use clear, present-tense messages
   - After commit, update spec status to `done` (features) or mark bug as `Fixed`

### Spec Locations & Types

| Type | Location | Status Values |
|------|----------|--------------|
| Feature | `specs/plan-<name>.md` | Open → In Progress → Done |
| Bug | `bugs/bug-<number>-<title>.md` | Open → Fixed |

### Bug Workflow
- When user notes a bug → create spec in `bugs/` using bug-tracking skill
- Mark bug as `Fixed` when user confirms resolution

---
## 7. Linting & Quality
- Run `npm run lint` before committing substantive changes.
- Prefer fixing root causes over disabling rules. If a disable is justified, annotate with a concise rationale.
- Keep TypeScript types narrow and explicit; avoid `any` unless unavoidable (document why).

---
## 8. Adding / Modifying Features
When adding a feature (e.g., Attack Management, Inventory, etc.):
1. Create / update a spec under `specs/` (problem, scope, data shape, UI entry points, edge cases).
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
- [ ] Spec in `specs/` or `bugs/` updated/created
- [ ] Spec status updated to `in_progress` when starting work
- [ ] README or other docs updated if user-facing behavior changed
- [ ] Lint passes
- [ ] Tests added/updated (post manual confirmation)
- [ ] No unused exports / dead code
- [ ] Accessibility semantics preserved
- [ ] Commit message clear & scoped
- [ ] Spec status updated to `done` (or bug marked Fixed) after commit

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
If README diverges from this guide, reconcile both (README = user/dev overview, AGENTS.md = agent operational guide).

---
By following this guide the agent maintains consistency, reliability, and forward scalability without premature complexity.
