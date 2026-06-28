---
title: Click Friction Reduction
version: 1.0
date_created: 2026-06-27
owner: Pokemon D&D Companion
tags: design, ux, friction, optimization
status: done
---

# Click Friction Reduction

## 1. Purpose & Scope

Reduce unnecessary taps/clicks in the three highest-friction flows remaining after the initial tap flow optimizations:
1. Attack management — always show attack grid in expanded modal
2. Delete confirmation — replace modal with inline confirmation
3. Add inventory item — replace nested overlay with inline form within the inventory list overlay

## 2. Definitions

| Term | Definition |
|------|-----------|
| Expanded modal | The PokemonExpandedModal (BottomSheet on mobile, BaseModal on desktop) that opens when tapping a compact card |
| Inline confirmation | A UI pattern where confirmation buttons replace the triggering buttons in-place, rather than opening a separate modal |
| Nested overlay | A second modal/sheet opening on top of an already-open overlay |

## 3. Changes

### 3.1 Always Show Attacks Grid

**Current:** The expanded modal's Attacks section has a "Manage" / "Hide" toggle button. When collapsed, attacks show as compact badges. User must click "Manage" to add/edit/execute attacks from the expanded view.

**Target:** Remove the toggle. Always show the attack grid (existing AttackCards + empty slots with "+ Add"). This matches the implementation plan in `plan-attack-management.md` item 3.

**Changes to `PokemonExpandedModal`:**
- Remove `isAttacksVisible` state
- Remove the "Manage" / "Hide" toggle button
- Always render the grid of 4 slots (AttackCard or "+ Add" placeholder)

### 3.2 Inline Delete Confirmation

**Current:** Clicking "Delete" in the expanded modal opens `DeleteConfirmationModal` (a separate overlay). User must click "Delete" again to confirm, or "Cancel" to dismiss. This is 2 extra clicks + a modal transition.

**Target:** Replace the "Edit" / "Delete" button row with an inline confirmation when Delete is tapped. The buttons swap to "Are you sure? [Delete] [Cancel]" in the same location. No modal overlay.

**Changes to `PokemonExpandedModal`:**
- Remove `showDeleteModal` state and `DeleteConfirmationModal`
- Add `showDeleteConfirm` boolean state
- When `showDeleteConfirm` is true, render confirmation buttons instead of Edit/Delete
- On confirm: call `removePokemon(uuid)` and `onClose()`
- On cancel: set `showDeleteConfirm` back to false

**The `DeleteConfirmationModal` component is no longer needed from this flow. Keep it for potential future use.**

### 3.3 Inline Add Item in Inventory

**Current:** Clicking "Add Item" in the inventory list overlay opens a second overlay (BottomSheet/BaseModal) on top. The user must interact with two stacked overlays, adding cognitive load.

**Target:** When "Add Item" is clicked, the inventory list content is replaced by (or prepended with) the add-item form. Save/Cancel return to the list view. Everything stays within a single overlay.

**Changes to `TrainerInventory`:**
- Remove `showAddItem` state
- Add `showAddItemForm` boolean state (or merge with existing)
- When `showAddItemForm` is true, replace the inventory list content with the add-item form
- On add/save: commit item, switch back to list view
- On cancel: switch back to list view

## 4. Acceptance Criteria

### 4.1 Always Show Attacks
- **AC-1.1**: Expanded modal shows the attack grid immediately — no toggle needed
- **AC-1.2**: Each existing attack renders as an AttackCard with Perform Attack, edit, delete
- **AC-1.3**: Empty slots show "+ Add" placeholder
- **AC-1.4**: Adding an attack via placeholder still opens AddAttackModal

### 4.2 Inline Delete Confirmation
- **AC-2.1**: Clicking "Delete" replaces Edit/Delete buttons with "Are you sure? [Delete] [Cancel]"
- **AC-2.2**: Clicking "Delete" (confirm) removes the Pokemon and closes the modal
- **AC-2.3**: Clicking "Cancel" restores the Edit/Delete buttons
- **AC-2.4**: No modal overlay opens for deletion confirmation

### 4.3 Inline Add Item in Inventory
- **AC-3.1**: Clicking "Add Item" in the inventory overlay shows the add-item form within the same overlay
- **AC-3.2**: Form has Item Name (autocomplete), Quantity, Description fields + Save/Cancel buttons
- **AC-3.3**: Saving adds the item and returns to the inventory list (showing the new item)
- **AC-3.4**: Cancel returns to the inventory list without adding
- **AC-3.5**: No second overlay opens

## 5. Implementation Notes

- All three changes are in existing components — no new files needed
- Changes are purely about state management and conditional rendering
- `DeleteConfirmationModal` component can remain; just not called from PokemonExpandedModal anymore
- Ensure all existing tests are updated to reflect the new interaction patterns
- Run full test suite after changes
