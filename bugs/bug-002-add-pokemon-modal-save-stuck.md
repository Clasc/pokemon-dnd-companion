# Bug: Add Pokemon Modal Save Button Stuck After Autocomplete

**Status:** Open
**Created:** 2026-04-15
**Fixed:** 
**Severity:** High

## Description

When adding a new Pokemon via the AddPokemonModal, selecting a Pokemon from the autocomplete dropdown can cause the Save button to become stuck showing "Saving...". The Cancel button also becomes unresponsive during this state.

## Steps to Reproduce

1. Open the Add Pokemon modal
2. Click on the Species input field
3. Type a Pokemon name to trigger autocomplete
4. Select a Pokemon from the dropdown
5. Quickly press Cmd+Enter (or click Save) while the spinner is still visible
6. Observe: Save button shows "Saving..." and Cancel button is disabled

## Expected Behavior

- The Cancel button should always remain clickable to close the modal
- Pressing Cmd+Enter should either save successfully or do nothing (not get stuck)
- The modal should return to a normal state after the autocomplete loading completes

## Actual Behavior

- Cancel button becomes disabled during `speciesLoading` state
- If user triggers save while autocomplete is loading, `submitting` becomes true
- After autocomplete finishes, `submitting` remains true, leaving button stuck on "Saving..."
- User must close modal via the X button and reopen to recover

## Root Cause

**File:** `src/features/pokemon/components/AddPokemonModal/index.tsx`

1. Line 127: Cancel button is disabled when `speciesLoading` is true
2. Line 97-98: Keyboard handler allows `handleSave()` to be called when `submitting` is false (even if `speciesLoading` is true)
3. Line 61: `setSubmitting(true)` sets the submitting state

**Flow:**
1. User selects Pokemon from autocomplete → `isLoading(true)` → `speciesLoading(true)`
2. User presses Cmd+Enter → `handleSave()` called → `setSubmitting(true)` → button shows "Saving..."
3. API call completes → `isLoading(false)` → `speciesLoading(false)` 
4. But `submitting` is still `true` → button stuck on "Saving..."

## Notes

**Fix Applied:** 
1. Cancel button: `disabled={submitting}` (remove `|| speciesLoading`)
2. handleSave: Add early return `if (submitting || speciesLoading) return;`
3. Keyboard handler already guards with `!speciesLoading`
