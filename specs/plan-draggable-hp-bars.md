---
title: Add Draggable HP Bars Everywhere
version: 1.0
date_created: 2026-04-15
owner: Pokemon D&D Companion
status: open
tags: `feature`, `hp`, `drag`, `ui`, `pokemon`
---

# Overview

Enable users to modify Pokemon HP by dragging the HP bar directly, providing a quick and intuitive way to adjust health without using +/- buttons. This feature should be available everywhere a user can see a Pokemon.

## Current State

### Existing Components

| Component | HP Bar Type | Location |
|-----------|-------------|----------|
| `PokemonCard` | `InteractiveProgress` (draggable) | `/src/features/pokemon/components/PokemonCard/` |
| `PokemonCompactCard` | `ProgressBar` (static) | `/src/features/pokemon/components/PokemonOverview/` |
| `PokemonExpandedModal` | `ProgressBar` (static) | `/src/features/pokemon/components/PokemonExpandedModal/` |
| `PokemonForm` | `ProgressBar` (static) | Read-only, no change needed |

### PokemonCard (Already Draggable)
- Uses `InteractiveProgress` component
- Has `handleHPDragChange` and `handleXPDragChange` handlers
- Works correctly

### PokemonCompactCard (Static)
- Uses static `ProgressBar` for HP and XP
- No interaction possible
- User must open expanded modal to adjust HP

### PokemonExpandedModal (Static)
- Uses static `ProgressBar` for HP
- Has +/- buttons for adjustment
- Could benefit from drag for quick changes

## Target State

All Pokemon HP displays should support drag-to-modify, consistent with PokemonCard behavior.

## Requirements

### REQ-001: PokemonCompactCard HP Drag
- HP bar in compact card must be draggable
- Dragging sets HP to exact position value
- Visual feedback during drag (tooltip shows current value)
- Auto-faint when HP reaches 0

### REQ-002: PokemonCompactCard XP Drag
- XP bar in compact card should be draggable
- Dragging sets XP to exact position value

### REQ-003: PokemonExpandedModal HP Drag
- HP bar in expanded modal must be draggable
- Keep existing +/- buttons for alternative input
- Drag provides quick adjustment option

### REQ-004: Visual Feedback
- Show tooltip with current HP value while dragging
- Highlight bar during drag interaction
- Smooth animation on release

## Implementation Plan

### 1. Modify PokemonCompactCard

**Location:** `src/features/pokemon/components/PokemonOverview/PokemonCompactCard.tsx`

**Changes:**
1. Import `InteractiveProgress` from `@/components/shared/ui/InteractiveProgress`
2. Import `useAppStore` from `@/store`
3. Add `modifyPokemonHP` and `gainExperience` from store
4. Add `uuid` prop (already exists)
5. Add handlers:
   ```typescript
   const handleHPDragChange = (value: number) => {
     const diff = value - pokemon.currentHP;
     if (diff !== 0) {
       modifyPokemonHP(uuid, diff);
     }
   };
   
   const handleXPDragChange = (value: number) => {
     const diff = value - pokemon.experience;
     if (diff !== 0) {
       gainExperience(uuid, diff);
     }
   };
   ```
6. Replace `<ProgressBar>` with `<InteractiveProgress>` for both HP and XP bars

### 2. Modify PokemonExpandedModal

**Location:** `src/features/pokemon/components/PokemonExpandedModal/index.tsx`

**Changes:**
1. Import `InteractiveProgress` from `@/components/shared/ui/InteractiveProgress`
2. Add `handleHPDragChange` handler (same pattern as PokemonCard)
3. Replace `<ProgressBar variant="hp">` with `<InteractiveProgress variant="hp">`
4. Keep existing +/- buttons (provides both options)

## Dependencies

- `InteractiveProgress` component already exists at `/src/components/shared/ui/InteractiveProgress/`
- `modifyPokemonHP` and `gainExperience` store actions already exist
- Pattern to follow from `PokemonCard` implementation

## Acceptance Criteria

1. **HP-001**: Given a PokemonCompactCard, When user drags the HP bar, Then HP updates to exact dragged position
2. **HP-002**: Given a PokemonExpandedModal, When user drags the HP bar, Then HP updates to exact dragged position
3. **HP-003**: Given dragging HP to 0, When complete, Then Pokemon status is set to fainted
4. **HP-004**: Given compact card HP drag, When dragging, Then tooltip shows current HP value
5. **XP-001**: Given a PokemonCompactCard, When user drags the XP bar, Then XP updates to exact dragged position

## Edge Cases

- **HP at 0**: Cannot drag below 0 (clamp to 0)
- **HP at max**: Cannot drag above maxHP (clamp to maxHP)
- **Fainted Pokemon**: Can drag HP above 0 to revive (remove fainted status)
- **Escape during drag**: Should cancel and revert to original value (handled by InteractiveProgress)

## Related Specifications

- `plan-armor-class.md` - Related to Pokemon stats display
- `plan-dashboard-pokemon-card-redesign.md` - Card layout that includes HP bars

## Files to Modify

1. `/src/features/pokemon/components/PokemonOverview/PokemonCompactCard.tsx`
2. `/src/features/pokemon/components/PokemonExpandedModal/index.tsx`
