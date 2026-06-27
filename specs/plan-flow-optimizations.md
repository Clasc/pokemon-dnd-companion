---
title: Tap Flow Optimizations
version: 1.0
date_created: 2026-06-27
owner: Pokemon DnD Companion
tags: feature, mobile, ux, flow
status: done
---

# Tap Flow Optimizations

## Problem Statement
Common actions require too many taps on mobile. Each extra tap adds friction during a tabletop session. The goal is to reduce the tap count for HP/XP adjustment, attack execution, status setting, view details, edit, and add Pokemon to 0-1 taps each.

## Action Comparison

| # | Action | Before | After | Status |
|---|--------|--------|-------|--------|
| 1 | Adjust HP | 3 clicks (card→modal→button) | 0 clicks (drag bar) | ✅ Done |
| 2 | Add XP | 2 clicks (type→add) | 0 clicks (drag bar) | ✅ Done |
| 3 | Execute attack | 4 clicks (modal→manage→card→button) | 1 tap (attack button on compact card) | ✅ Done |
| 4 | Set status | 2 clicks (dropdown→select) | 1 tap (status badge cycles) | ✅ Done |
| 5 | View details | 1 click (opens modal) | Pull up bottom sheet | ✅ Done |
| 6 | Edit Pokemon | 3 clicks + route change | 1 tap → inline edit in bottom sheet | ✅ Done |
| 7 | Add Pokemon | 2 clicks + form page | 1 tap → bottom sheet form | ✅ Done |

## Detailed Changes

### Item 3: Execute Attack on Compact Card (1 tap)
**Current**: Attack badges on compact card are decorative `<span>` elements. User must open the expanded modal, press "Manage", then click "Perform Attack" on an AttackCard.

**Target**: Each attack badge on the compact card is tappable. Tapping directly decrements PP and provides brief visual feedback.

**Implementation**:
- Make each attack badge a `<button>` with `onClick` that calls `decreaseAttackPP(uuid, index)`
- Show brief flash/scale feedback on tap
- Keep badge showing `name (currentPp/maxPp)`
- Disable tap when `currentPp === 0` (grey out)

### Item 4: Status Badge Cycles (1 tap)
**Current**: A QuickStatusDropdown requires opening a dropdown menu and selecting a status. The StatusIndicator is read-only on the card.

**Target**: Tapping the status indicator area on the compact card cycles to the next status in a predefined order. No dropdown needed for quick changes.

**Implementation**:
- Define a cycle order: `none → burned → poisoned → paralyzed → asleep → frozen → none`
- On each tap, advance to next status in the cycle
- Confused status remains separate (not cycled)
- QuickStatusDropdown still available for non-cycle statuses (badly-poisoned, etc.)

### Item 5: Bottom Sheet for Pokemon Details
**Current**: `PokemonExpandedModal` uses `BaseModal` with `size="fullscreen"`. This covers the entire screen but feels heavy.

**Target**: A bottom sheet pattern that slides up from the bottom with a drag handle. Supports partial snap (40%) and full snap (90%). Dismiss by dragging down or tapping backdrop.

**Implementation**:
- Create `BottomSheet` component in `src/components/shared/ui/BottomSheet/`
  - Slides up from bottom with CSS transform
  - Drag handle at top (visual indicator)
  - Touch-drag to resize or dismiss
  - Backdrop overlay behind
  - Portaled to document.body
  - Handle Escape key
- Refactor `PokemonExpandedModal` to use `BottomSheet` instead of `BaseModal` on mobile
- Keep desktop view as a centered modal (or bottom sheet)

### Item 6: Inline Edit in Bottom Sheet
**Current**: Edit button in the expanded modal routes to `/pokemon/[uuid]/edit` — a separate page load.

**Target**: The bottom sheet has an "Edit" mode. Tapping Edit toggles the content area to show editable form fields (reusing `PokemonForm`). Save/Cancel buttons commit or discard changes without leaving the sheet.

**Implementation**:
- Add `isEditing` state to `PokemonExpandedModal`
- When `isEditing` is true, replace the detail content with `<PokemonForm>` pre-filled with current pokemon data
- Footer buttons change to "Save" and "Cancel"
- On save: call `updatePokemon()`, switch back to view mode
- On cancel: revert changes, switch back to view mode
- Delete still opens `DeleteConfirmationModal` from within the sheet
- The route `/pokemon/[uuid]/edit` can remain for desktop/fallback access

### Item 7: Bottom Sheet for Add Pokemon
**Current**: The "Add Pokemon" button opens either the `/pokemon/new` route or the legacy `AddPokemonModal`.

**Target**: A bottom sheet with `PokemonForm` that slides up when adding a new Pokemon. Save commits to store and closes sheet.

**Implementation**:
- Create `AddPokemonBottomSheet` component using the new `BottomSheet`
- Contains `PokemonForm` + Save/Cancel buttons
- Replaces the old `AddPokemonModal` usage in `PokemonOverview`
- The `/pokemon/new` route remains for desktop/fallback access

## Acceptance Criteria
- [x] Item 3: Attack badges on compact card are tappable and decrement PP on tap
- [x] Item 3: Tapping an attack with 0 PP is a no-op (button disabled/greyed)
- [x] Item 4: Tapping the status indicator cycles through `none → burned → poisoned → paralyzed → asleep → frozen → none`
- [x] Item 5: BottomSheet slides up from bottom with drag handle
- [x] Item 5: Dragging down dismisses the sheet
- [x] Item 5: Pokemon detail uses BottomSheet on mobile, centered modal on desktop
- [x] Item 6: Edit button in PokemonExpandedModal switches to inline form
- [x] Item 6: Save/Cancel toggle back to view mode
- [x] Item 7: Add Pokemon button opens bottom sheet with PokemonForm
- [x] Item 7: Save commits to store and closes sheet
- [x] All tests pass
- [x] Lint passes
