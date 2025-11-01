# Layout Compaction & Density Improvement (Refactor Spec)

## 1. Goal (User Perspective)
Make the app feel more focused, efficient, and information‑dense by eliminating excessive padding, nested wrappers, and redundant vertical gaps—without making the interface feel cramped or overwhelming. Users should see more meaningful content above the fold (especially on mobile) and spend less time scrolling between related controls.

## 2. Current Pain Points
- Large stacked paddings from multiple nested containers produce “air gaps” that slow scanning.
- Repeated decorative wrappers dilute hierarchy (every section feels equally “loud”).
- Important interactions (e.g., HP adjust, add Pokémon) can fall below the initial viewport on smaller devices.
- Modal interiors carry the same large padding scale as cards, feeling oversized for focused editing.

## 3. Target Experience
- A single outer layout container protects against edge collisions; interior components avoid re‑adding heavy horizontal padding.
- Cards and panels have a lean, consistent inner spacing rhythm.
- Vertical rhythm communicates grouping (tight inside, breathable between major sections).
- Modals feel like focused work surfaces: compact, intentional, not “floating dashboards”.
- The interface keeps its approachable “glass” style while visually tightening density.

## 4. Scope (Phase Included)
This refactor applies to:
- Dashboard page
- Pokémon Team page + Pokémon Overview
- Trainer page + Trainer Overview
- Pokémon add/edit pages
- Trainer edit modal (included per decision)
- Global navigation shell (sidebar + bottom bar)
- Global layout background & footer

## 5. Decisions & Constraints
Decision 1 (Sidebar Width): Reduce sidebar width for desktop to reclaim horizontal space while keeping clear labels.
Decision 2 (Footer): Keep a minimal one‑line footer (not removed entirely).
Decision 3 (Trainer Edit Modal): Included in this compaction pass.
Decision 4 (Corner Radius): Tighten large surface rounding for a crisper, denser visual feel.

Additional Principles:
- Only one persistent gradient / backdrop layer at the layout level (pages no longer duplicate it).
- Keep a minimal footer presence to avoid visual heaviness at the end of scroll.
- Preserve accessible touch targets and contrast—compaction must not harm usability.

## 6. What Will Feel Different to Users
Before:
- Large scrolling blocks with repeated “card” framing.
- Empty zones between functional clusters.
- Modals feel as padded as full pages.
After:
- More content visible immediately (less initial scroll).
- Clearer hierarchy: major sections stand out; interior elements feel connected.
- Actions feel closer to the data they affect.
- Modals feel purpose‑built, not generic containers.

## 7. Non‑Goals (Explicitly Out of Scope)
- Introducing new features or altering data structures.
- Changing interaction patterns (navigation, routing, state flows remain the same).
- Typography scale overhaul.
- Dark/light theming or visual rebrand.
- Reordering functional content (focus is density, not restructuring flows).

## 8. Accessibility & Usability Guardrails
- Maintain minimum touch target sizes for interactive controls.
- Preserve readable line lengths (compaction must not cause edge crowding).
- Ensure no loss of heading or landmark semantics during wrapper removal.
- Avoid compressing form controls to the point of reducing clarity or tap accuracy.

## 9. Success Criteria (User‑Centric)
- Users can view both trainer summary and part of the team list on a typical mobile viewport without scrolling as far as before.
- Pokémon edit and trainer edit experiences feel faster to parse (less scanning required to locate core fields).
- No interaction becomes harder to tap or understand.
- Overall layout feels “lighter” without feeling “bare” or unfinished.
- No negative impact on existing navigation clarity.

## 10. Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Over‑compaction causing cramped feel | Keep a consistent minimal interior spacing scale; test on small + large screens. |
| Loss of hierarchy | Use contrast, subtle dividers, and typography instead of padding volume. |
| Modal discomfort (too tight) | Preserve a baseline interior breathing room while removing only surplus layers. |
| Visual inconsistency if some components are untouched | Apply a clear first pass across all primary surfaces in one cohesive refactor. |

## 11. Rollout Approach
1. Document (this spec) to align intent.
2. Apply global container + background centralization.
3. Compact key pages and shared surfaces (cards, modals).
4. Adjust navigation’s spatial footprint.
5. Review manually (mobile + desktop).
6. Confirm no functional regressions (tests should remain stable).
7. Consider a follow‑up pass only if residual outliers stand out.

## 12. Future Opportunities (Optional Later)
- Adaptive density preference (user toggle: “Comfort” vs “Compact”).
- Systematic spacing scale tokens for consistency across future features.
- Progressive disclosure for less‑used control clusters.

## 13. User Value Summary
This refactor improves information density and reduces cognitive and scroll friction without changing core functionality. Users gain faster access to actionable data and forms while the interface retains its familiar style and clarity.

---

End of layout compaction specification.