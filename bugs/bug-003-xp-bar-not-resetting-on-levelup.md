# Bug: XP bar not resetting on level up

**Status:** Open
**Created:** 2026-04-19
**Fixed:** 
**Severity:** High

## Description

The XP bar displays total accumulated XP instead of XP gained since the last level up. After a Pokémon levels up, the XP bar should reset to empty (0%) to represent the progress toward the next level, not show the total XP in relation to the next level threshold.

## Steps to Reproduce

1. Train a Pokémon until it has 200 XP
2. Level up occurs (e.g., next level requires 400 XP total)
3. Observe the XP bar

## Expected Behavior

The XP bar should be empty (0%) after a level up, showing progress from 0 → 400 toward the next level.

## Actual Behavior

The XP bar shows 200/400 (50% full) because it's displaying total XP rather than XP since last level up.

## Notes

This bug likely exists in the XP bar component or the level calculation logic.