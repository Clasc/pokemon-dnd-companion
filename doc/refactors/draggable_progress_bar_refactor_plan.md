# Refactor Plan: DraggableProgressBar & Test Utilities

## 1. Purpose
Improve maintainability, clarity, and reliability of the `DraggableProgressBar` component and its test suite by eliminating duplicated logic and consolidating common test setup patterns. This supports faster future iteration (e.g., new sliders or interaction edge cases) while preserving existing behavior and accessibility guarantees.

## 2. Scope
In-scope:
- Test suite clean-up (progress bar, PokemonCard, StatusSelector).
- Introduction of shared test utilities (factories, geometry mocking, store helpers).
- Optional internal component refactor (drag lifecycle, debounce, keyboard mapping extraction).

Out-of-scope (deferred):
- Introducing a generic cross-feature slider primitive.
- Changing public props or ARIA semantics.
- Performance optimizations beyond existing requestAnimationFrame usage.
- Behavior changes (feature parity required).

## 3. Current Pain Points (Observed Duplication)
1. Repeated ad-hoc `createTestPokemon` factories across tests.
2. Multiple custom `getBoundingClientRect` overrides.
3. Manual store clearing & reseeding duplicated in test files.
4. Nested and redundant `act()` wrappers.
5. Large inline event handlers in component for mouse vs touch with similar lifecycle.
6. Keyboard handling switch statement embedded inline.
7. Debounce logic embedded directly in component.
8. Repeated requestAnimationFrame setup/cancellation patterns.

## 4. Goals
- Reduce cognitive load in tests: intent-focused vs setup-heavy.
- Enforce single-responsibility boundaries (drag logic vs input modality).
- Make geometry mocking deterministic and reusable.
- Maintain zero regression on accessibility and interaction behavior.
- Keep refactor incremental and reviewable (small PRs).

## 5. Guiding Principles
- Documentation-first (this plan precedes implementation).
- Small, atomic changes (each phase can stand alone).
- Favor composition over premature abstraction (extract only clear repetitions).
- Preserve test semantics (no snapshot introduction; retain behavior assertions).
- Avoid feature creep (no new props or modes unless required for correctness).

## 6. Phased Approach (Progress Status)

### Phase 1 – Test Utility Introduction
[x] Added shared utilities under `src/tests/utils/`:
- `pokemonFactories.ts` – deterministic Pokémon creation.
- `mockGeometry.ts` – `mockElementRect` & `withSynchronousRaf`.
- `storeHelpers.ts` – `resetStore`, `seedPokemon`, team/status helpers.

Outcome: Consistent data and geometry setup; removed inline duplication.
Status: Completed.

### Phase 2 – Adopt Utilities in Existing Tests
[x] `DraggableProgressBar` test suite refactored to use new utilities.
[ ] Replace inline factories in other component tests.
[ ] Replace remaining manual `getBoundingClientRect` stubs across tests.
[ ] Standardize local render helpers (pattern: `renderComponent(overrides)`).
[ ] Remove redundant nested `act()` usage in other specs.
[ ] Add brief internal note referencing utilities (documentation update below).

Outcome (so far): Reduced LOC and clearer intent for progress bar tests.
Status: In Progress.

### Phase 3 (Optional) – Component Internal Encapsulation
[ ] Extract drag lifecycle into helper/hook.
[ ] Extract keyboard mapping into pure function.
[ ] Introduce shared debounce hook if justified.
[ ] Consolidate animation frame scheduling.

Outcome (future): Thinner event handlers; isolated logic.
Status: Deferred (only proceed with explicit approval).

### Phase 4 – Documentation Update
[x] Plan documented here.
[ ] Add a short “Shared Test Utilities” section to testing guidelines (high-level usage; no code).
Status: Partially Complete.

### Phase 5 – Verification & Tests
[ ] Run full suite post broader adoption.
[ ] Confirm no regressions after any optional Phase 3 changes.
[ ] Consider adding a regression test for escape-cancel drag flow if logic extracted.
Status: Pending broader adoption.

## 7. Acceptance Criteria
- Existing behavior preserved (ARIA, interaction semantics).
- Public props unchanged.
- Tests pass after refactors (currently progress bar tests passing after fixes).
- Duplication reduced (utilities in place; broader adoption pending).
- Optional Phase 3 only if it does not introduce regressions.

## 8. Risk Assessment
Low (Phases 1–2): Test-only changes already stable.
Moderate (Phase 3): Potential subtle drag or debounce timing regressions.
Mitigation: Retain and extend existing drag/keyboard boundary tests before merging Phase 3.

## 9. Rollback Strategy
If Phase 3 causes issues:
- Revert component internal changes; retain test utilities and consolidated tests.
- Keep utility layer intact.

## 10. Metrics / Success Indicators
- Net reduction in repeated test setup code.
- Faster addition of new interaction tests (qualitative).
- Elimination of intermittent failures tied to timing (RAF + debounce now deterministic).
- Clearer distinction between “test intent” and “mechanics.”

## 11. Future Opportunities (Deferred)
- General slider primitive if a second independent draggable metric appears.
- Shared debounce hook reused in future interactive forms.
- Performance micro-review if drag frequency or complexity increases.

## 12. Implementation Order Summary (Updated)
1. (Done) Add utilities.
2. (Done for progress bar) Replace factories & geometry mocks in target suite.
3. (Pending) Broader adoption in other test files.
4. (Optional) Component extraction.
5. (Partial) Documentation – expand utilities usage note.
6. (Pending) Final verification pass.

## 13. Constraints / Guardrails
- No external libraries.
- No snapshot tests.
- Keep PRs small and reviewable.
- Preserve accessibility roles: `slider`, `progressbar`, `status`, `tooltip`.

## 14. Decision Log
| Date | Phase | Summary | Tests Status | Notes |
|------|-------|---------|--------------|-------|
| YYYY-MM-DD | 1 | Added utilities (`pokemonFactories`, `mockGeometry`, `storeHelpers`) | Passing | Foundation established |
| YYYY-MM-DD | 2 | Refactored `DraggableProgressBar` tests; fixed focus & RAF timing issues | Passing after fixes | One test adjusted for proper focus event |

(Replace YYYY-MM-DD with actual dates when logging.)

## 15. Current Handoff Summary
- Utilities are live and stable.
- Progress bar tests migrated successfully.
- Next developer should continue Phase 2 adoption: search for manual geometry mocks and inline Pokémon factories, convert them to shared helpers, then update documentation with a brief utilities usage section.

---

Current Status: Phase 1 complete; Phase 2 partially complete (progress bar suite done); awaiting broader test migration and optional internal component refactor.