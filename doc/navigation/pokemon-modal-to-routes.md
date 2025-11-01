# Pokémon Management: Modal → Route Subpage Migration (High-Level Spec)

## 1. Purpose
Replace modal-based interaction flows for managing Pokémon with dedicated route-based subpages. This improves consistency, deep linking, browser navigation (Back/Forward), accessibility, and scalability of future features.

## 2. Goals (User-Facing Outcomes)
- I can add, edit, and manage a Pokémon on full pages instead of cramped overlays.
- The browser Back button always takes me logically to where I came from (usually the team list).
- I can share or bookmark a URL to return directly to a creation or editing context.
- Forms feel stable and not dismissible by accidental backdrop clicks.
- Destructive actions (delete) feel deliberate and clearly separated.
- Status and attack management are easier to understand when given full layout space.

## 3. In Scope (This Iteration)
- Converting the following modal flows to pages:
  - Add new Pokémon
  - Edit existing Pokémon
  - Manage status conditions
  - Add an attack (selecting a target attack slot)
  - Delete confirmation (folded into the edit page rather than a separate confirmation URL)
- Providing clear navigation affordances (Back link / Cancel action).
- Preserving (or improving) current form field coverage and validation messaging.
- Ensuring pages are still usable if opened directly (no prior navigation context).
- High-level documentation (this file) to guide and anchor implementation choices.

## 4. Out of Scope (Deferred)
- A standalone Pokémon detail/summary page (not required now).
- Editing existing attacks (only adding covered here).
- Bulk editing or batch operations.
- Any server persistence or multi-user sync.
- Mobile-specific layout redesign (current responsive behavior assumed acceptable).
- Introducing a global notification system (inline feedback is sufficient for now).

## 5. User Stories
1. As a player, I can open a full “Add Pokémon” page to create a new entry without worrying about losing progress by accidentally clicking outside a modal.
2. As a player, I can bookmark or reload the “Edit Pokémon” page and continue editing.
3. As a player, I can adjust primary and secondary status effects on a dedicated page with clear grouping and durations.
4. As a player, I can add a new attack to a chosen slot through a dedicated form, even if I navigated there directly.
5. As a player, I can delete a Pokémon deliberately from the edit page with an inline confirmation step that reduces accidental deletions.
6. As a player, I can always return to the team overview using either the page’s Back/Cancel control or the browser’s Back button.

## 6. Experience Principles
- Predictable: Navigation is URL-driven rather than ephemeral state.
- Focused: Each page centers on one primary action (create, edit, manage status, add attack).
- Reversible: Users can abandon changes easily (Back or Cancel).
- Composable: Future features (e.g., evolution, inventory, move editing) can follow the same pattern.

## 7. Page Inventory (Target)
| Flow | New Page Purpose | Notes |
|------|------------------|-------|
| Add Pokémon | Create a fresh entry | Initializes reasonable defaults. |
| Edit Pokémon | Modify core stats & attributes | Includes delete section. |
| Manage Status | Adjust primary, confusion, flinching effects | Mirrors existing logic with clearer layout. |
| Add Attack | Populate an empty attack slot | Slot selection conveyed via URL segment. |

(Delete confirmation is intentionally absorbed into the Edit page to reduce extra navigation.)

## 8. Navigation Behaviors (User Expectations)
- Using the browser Back button returns to the previous page, not an accidental blank screen.
- If a user lands directly (e.g., shared link) and the referenced Pokémon does not exist, they see a friendly explanation with a path back to the team list.
- Cancel/Back always discards unsaved edits (no partial commits).
- Explicit Save triggers visible acknowledgment (implicit assumption: immediate reflection in the overview page after navigation).

## 9. Form Interaction Expectations
- Required core fields: species, nickname (if currently required), primary type.
- Validation prevents empty critical fields on Save; errors are clearly described adjacent to inputs.
- HP and XP values remain clamped within logical bounds (e.g., current ≤ max).
- Attribute values remain within defined numeric ranges.
- Adding an attack ensures name and required numeric fields are populated.
- Status durations remain within their defined logical turn windows.

## 10. Deletion Flow (Integrated)
- A distinct “Danger” section on the Edit page.
- Two-step action: first click reveals confirmation controls; second confirms.
- Clear copy emphasizing irreversibility.

## 11. Accessibility & Usability Considerations
- Headings: Pages use a clear hierarchy (main action as top heading).
- Inputs have persistent visible labels (no placeholder-only reliance).
- Status groups: Labeled logically; toggles and radios are keyboard operable.
- No reliance on ESC to exit (not a modal anymore).
- Focus placement: Initial logical focus at the main heading or first field (browser default acceptable).

## 12. Error / Edge Handling
| Scenario | Expected Outcome |
|----------|------------------|
| Pokémon UUID not found | Display message + navigation link to team list. |
| Direct visit to “add attack” without valid slot | Show friendly invalid slot message; link back. |
| Unsaved changes + Back | Navigation proceeds (no blocking prompt this iteration). |
| Empty required field on Save | Inline validation message; remain on page. |

## 13. Success Metrics (Qualitative)
- Users can describe where they are (“I’m on the Edit page”) instead of “Inside a popup.”
- Fewer accidental dismissals compared to modal backdrop clicks.
- Faster iteration for future features using the same route pattern.
- Cleaner test coverage that doesn’t rely on modal open/close state toggles.

## 14. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Users miss quick inline feel of modals | Slight friction | Keep transitions lightweight; potential future quick-view pattern if needed. |
| Increased perceived navigation steps | Mild | Provide clear, minimal page chrome and prominent action buttons. |
| Bookmark leads to empty state (removed Pokémon) | Confusion | Friendly “Not found” message + link to overview. |
| Users expect ESC to cancel (old pattern) | Minor | Educate via consistent Back/Cancel placement. |

## 15. Future Extensibility (Not Implemented Now)
- Dedicated Pokémon detail summary page.
- Attack editing and reordering.
- Evolution workflow page.
- Inline unsaved changes warnings.
- Batch operations (multi-delete, bulk status changes).

## 16. Rollout Plan (Sequential)
1. Introduce new route pages while leaving modals temporarily (development phase only).
2. Add tests for new pages (create, edit, status, add attack).
3. Switch UI triggers from modal toggles to navigation links/buttons.
4. Remove modal code + tests once parity verified.
5. Update documentation references (shared UI + contributing guidelines).
6. Final polish pass (copy consistency, headings, empty-state phrasing).

## 17. Open Alignment (Now Resolved)
- Delete flow: integrated (no separate delete route).
- Attack slot: nested segment path pattern selected.
- No standalone Pokémon detail page for this phase.
- All targeted modals replaced—no exceptions.

## 18. User-Facing Copy Principles
- Action-oriented headings: “Add Pokémon”, “Edit Pokémon”, “Manage Status”.
- Clear destructive verbs: “Delete Pokémon” (never ambiguous wording like “Remove” without context).
- Duration fields explicitly labeled with units (“turns”).

---

This document intentionally avoids implementation specifics (file paths, component names, state hooks). It defines the user-facing behavior and rationale to guide the refactor execution. 

## 19. Implementation Status (Incremental Migration Tracking)
| Flow / Page | Status | Notes |
|-------------|--------|-------|
| Add Pokémon (/pokemon/new) | Implemented | Route live; uses shared PokemonForm. |
| Edit Pokémon (/pokemon/[uuid]/edit) | Implemented | Replaces legacy modal; includes inline delete (danger zone). |
| Manage Status (/pokemon/[uuid]/status) | Pending | To be implemented next; will externalize status controls from modal. |
| Add Attack (/pokemon/[uuid]/attacks/new/[slot]) | Pending | Will replace AddAttackModal slot flow. |
| Delete Confirmation (integrated) | Partial | Fully implemented inside Edit page; old standalone modal still exists until remaining flows migrated. |

(Once all “Pending” items are implemented and verified, the legacy modal components and their tests can be removed.) 
