# Shared Test Utilities (High-Level Guide)

Central resource explaining the purpose and intended usage of the shared test utilities introduced during the refactor initiative. This is a conceptual overview (no code examples) to keep focus on behavior and workflow rather than implementation.

---

## 1. Purpose

The utilities exist to:
- Reduce repeated boilerplate in tests (data creation, geometry mocking, store resets).
- Keep test intent clear (asserting user-visible behavior and domain state changes).
- Ensure deterministic, stable test data.
- Reinforce usage of the real application store rather than mocking internal logic.

They enable faster addition of new interaction tests (dragging, status editing, HP/XP adjustments) while maintaining confidence that changes reflect real app behavior.

---

## 2. Available Utility Categories

1. Pokémon Data Factories  
   - Create consistent Pokémon test objects with readable overrides.
   - Support targeted scenarios (statuses, HP ranges, attacks) without redefining full objects.

2. Geometry & Animation Helpers  
   - Provide predictable element sizing for interaction tests (e.g., drag calculations).
   - Make animation frame timing synchronous when verifying intermediate UI states.

3. Store Management Helpers  
   - Reset the actual Zustand store between tests (including persisted state).
   - Seed trainer and Pokémon data through the same paths used in production.
   - Apply status effects and team configurations without manual object mutation.

---

## 3. When To Use What

| Scenario | Use These Utilities | Outcome |
|----------|---------------------|---------|
| Need a baseline Pokémon | Pokémon factory | Clear starting object with minimal overrides |
| Testing drag or slider movement | Geometry + synchronous frame helper | Deterministic progress calculations, no brittle timing |
| Verifying status editing behavior | Store seeding + status helpers | Realistic updates mirroring production flows |
| Adding multi-Pokémon scenarios | Team construction helper | Stable UUIDs and structure without hand-built maps |
| Clearing prior test side-effects | Store reset helper | Clean slate preventing state leakage |
| Testing HP / XP mutation buttons | Store seeding + real store assertions | Confidence in integrated logic, not implementation mocks |

---

## 4. Guiding Principles for Test Authors

- Treat tests as user-focused behavior specifications (roles, text, state changes) rather than implementation inspections.
- Always prefer semantic queries (role, text) before falling back to test IDs.
- Avoid mocking the app store; interact with it the way the UI does.
- Keep each test’s setup concise—only override the minimal fields required for clarity.
- Use one clear local render helper per test file when repeated patterns appear.

---

## 5. What Not To Do

- Do not recreate ad-hoc Pokémon objects when a factory suffices.
- Do not hardcode geometry values directly on DOM nodes.
- Do not mock internal store methods to assert invocation counts—assert resulting state instead.
- Do not introduce randomness (unseeded) into factories; deterministic data keeps failures reproducible.
- Do not rely on snapshot tests. Prefer explicit assertions.

---

## 6. Typical Workflow Pattern

1. Reset store at the start of each test or `beforeEach` block.
2. Seed required Pokémon / trainer records with readable overrides (only the fields relevant to the scenario).
3. Render the component using a local helper if multiple tests share similar props.
4. Perform user interactions (click, keyboard, pointer, touch) using accessible pathways.
5. Assert visible UI changes and underlying domain state via store access helpers.
6. Restore any geometry or timing overrides after each test to prevent leakage.

---

## 7. Benefits Realized

- Reduced duplication in status, progress bar, and card-related tests.
- More resilient drag and keyboard interaction coverage (no brittle manual timing).
- Clear separation between “what the user sees” and “mechanics that power it.”
- Faster addition of new test scenarios (e.g., edge cases around leveling or status stacking).

---

## 8. Migration Checklist (For Legacy Test Files)

Use this when updating older tests:
- Remove inline Pokémon object definitions -> use factory with overrides.
- Replace manual store object mutations -> use seeding helpers.
- Eliminate geometry stubs -> use geometry helper when width/position matters.
- Replace store method mocks -> assert final store state instead.
- Introduce a local `renderX` helper if repeated render prop setup appears.
- Remove unnecessary nested `act()` calls (only rely on Testing Library defaults unless strictly required).
- Confirm assertions are behavior-centric (roles/text/state) not implementation internals.

---

## 9. Edge Case Coverage Expectations

Utilities should support:
- HP / XP at boundaries (0, max, near thresholds).
- Status combinations (primary + confusion + temporary effects).
- Attack arrays (empty, single, multiple).
- Drag extremes (start, end, beyond bounds).
- Disabled vs enabled interactive states.
- Focus management and keyboard accessibility.

If a new test scenario can’t be cleanly expressed with existing helpers, first evaluate whether it is truly a novel pattern before adding new utility surface.

---

## 10. Ongoing Maintenance

- Extend factories only when a new, broadly useful pattern emerges (e.g., evolution-ready Pokémon shape), not for one-off edge cases.
- Keep utility naming descriptive and narrow (avoid monolithic “kitchen sink” helpers).
- Update this document when new utility categories are introduced or philosophy changes.
- Align new tests with existing principles—do not regress to ad-hoc mocking.

---

## 11. Success Indicators

- New tests rarely introduce inline Pokémon definitions.
- Minimal manual geometry mocking outside shared helpers.
- No reliance on store method invocation counting.
- Clear, readable test intent sections (“what” > “how”).
- Stable cross-run behavior with negligible flakiness.

---

## 12. Handoff Summary

The shared test utilities are now the recommended baseline for all feature-level test additions. Any remaining legacy patterns (mocked store modules, duplicated factories) should be migrated as part of incremental maintenance rather than deferred indefinitely.

---