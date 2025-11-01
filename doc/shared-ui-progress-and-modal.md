# Shared UI: Progress Indicators & Modal Shell

High‑level design specification for introducing unified progress bars (HP/XP) and a reusable modal shell across the application.

---

## 1. Purpose

Players currently see HP and XP represented differently in Pokémon forms, cards, and Trainer views. Modals (edit, HP/XP adjustments, delete confirmation) also vary in structure and behavior. This initiative standardizes these UI elements to improve clarity, accessibility, consistency, and reuse.

---

## 2. Scope (User-Facing)

Included:
- A consistent visual style for HP and XP progress indicators wherever they appear.
- Clear color semantics for HP (healthy / caution / critical) and a distinct neutral/energized style for XP.
- Consistent textual and visual representation of current and maximum values.
- Unified drag-based interaction for interactive bars (where applicable).
- A shared non-interactive bar for static displays.
- A reusable modal container with predictable closing behavior (backdrop click, Escape key) and uniform look.
- Optional level‑up readiness message when XP is near threshold.

Not Included (deferred):
- Battle system logic.
- Evolution flow.
- Inventory-driven HP changes beyond existing interactions.
- Additional modal features like stacking or focus trapping enhancements (may be considered later).

---

## 3. Goals

1. Reduce cognitive load: HP and XP look and behave the same in every context.
2. Improve accessibility: Uniform ARIA labeling, keyboard navigation for interactive bars, clear contrast.
3. Minimize repeated logic: Color thresholds, percentage formatting, and value clamping implemented once.
4. Simplify future feature additions: New entities (e.g., wild Pokémon, NPC trainer) can adopt the same components.
5. Provide responsive, unobtrusive feedback: Smooth animation without distracting flair.

---

## 4. User Experience Summary

- HP always displays current and max values alongside a colored bar (green, yellow, red based on remaining percentage).
- XP always displays current and total (current + to next level) with a blue or neutral bar style.
- In places where adjustment is allowed (e.g., Pokémon card), users can drag the interactive bar or use inline buttons for precise changes.
- When XP is near leveling (threshold defined by remaining required experience), a subtle indicator appears (“Ready to level up!”).
- Modals share a consistent translucent backdrop, rounded container style, close affordance (X button), and dismissal on pressing Escape or clicking outside (unless intentionally blocked for critical confirmations).
- Each modal shows a clear title and primary action grouping at the bottom or in a predictable region.

---

## 5. User Stories

1. As a player, I want HP bars to look the same everywhere so I can instantly gauge health status without reinterpreting styles.
2. As a player, I want XP bars to clearly show progress toward the next level so I can decide when to grant additional XP.
3. As a player, I want modals to behave consistently so I know how to exit them quickly (Escape or backdrop click).
4. As a player, I want to adjust HP or XP efficiently using either drag interaction or quick increment buttons.
5. As a player with limited vision, I want clear color contrast and text values displayed, not only color-coded states.
6. As a player using only keyboard input, I want to adjust interactive bars via arrow keys and standard shortcuts.
7. As a player, I want reassurance that nearing a level-up will be visibly indicated.

---

## 6. Acceptance Criteria

Progress Bars (Static):
- HP displays color tier based on percentage ( >60 healthy, >30 caution, else critical ).
- XP displays a distinct non-HP style (neutral or blue gradient) and total visible.
- Edge case (max = 0) shows empty bar with value 0/0 without errors or misleading color.

Progress Bars (Interactive):
- Keyboard arrows increment/decrement by defined step.
- Home sets value to 0; End sets value to max.
- Drag operations change value only on release (or via controlled incremental feedback when appropriate).
- Escape during drag cancels the change and reverts to original value.

Level-Up Indicator:
- Visible when remaining XP is below a small threshold (e.g., ≤10 points or ≥99% complete) without flickering.
- Does not appear if total XP to next is zero (already at or beyond threshold).

Modal Shell:
- Backdrop covers entire viewport.
- Escape key or clicking backdrop closes modal unless modal is marked as “critical confirmation”.
- Title region is clearly defined.
- Closing control (X) is present in non-critical modals.
- Content scrolls internally without moving backdrop on overflow.
- Only one modal visually elevated at a time (no stacking requirement now).

Accessibility:
- Progress indicators expose current/max values in text.
- Interactive bar is reachable by tab navigation and announces its updated value.
- Modal announces its role and title to assistive technologies.

Performance:
- Animations are smooth (short duration) without jank on repeated HP/XP updates.
- Drag operations do not cause excessive re-renders outside the bar component.

---

## 7. Non-Functional Considerations

- Consistent spacing, rounded corners, and subtle movement unify brand feel.
- No reliance on heavy external libraries; stays within existing styling constraints.
- Future extensibility: Additional progress variants (e.g., status durations) can adopt same pattern without design overhaul.

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Interactive bar change breaks existing tests | Preserve current API during initial move; update test imports carefully. |
| Confusion between static vs interactive bars | Clear naming (e.g., “Draggable” vs plain “Progress”) and visual cues (cursor change, focus outline). |
| Modal close unintended during long edits | Critical modals can disable backdrop close while still supporting explicit close buttons. |
| Color accessibility insufficient | Maintain text values; later enhancement could add patterns or ARIA descriptions if color contrast feedback is inadequate. |

---

## 9. Migration Plan (User Perspective)

1. Introduce unified bars; existing screens visually adjust but retain all functionality.
2. Interactive behavior remains where users expect it (Pokémon Card adjustments).
3. Modals retain their action buttons but gain consistent backdrop and dismissal patterns.
4. No data loss; purely visual and interaction standardization.

---

## 10. Out of Scope (For Now)

- Adding sound or haptic feedback to adjustments.
- Multi-step modal flows (wizard style).
- Global theme selector affecting bar styles.
- Progress comparison dashboards (aggregate over party).

---

## 11. Future Opportunities

- Add optional tooltip on static bars showing percentage.
- Add mini size variants for compact list views.
- Extend modal shell with focus trap and inert background for stricter accessibility.
- Provide “damage/heal” animated overlays on HP changes.
- Add configurable thresholds (user customization of what counts as caution/critical).

---

## 12. User-Facing Summary Statement

The app now presents health and experience progress the same way everywhere and uses a unified modal style. Players can more confidently interpret status, adjust values, and navigate dialogs without relearning patterns.

---