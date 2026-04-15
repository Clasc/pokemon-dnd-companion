---
title: XP Gain System Revision
version: 1.0
date_created: 2026-04-13
owner: Pokemon DnD Companion
status: done
tags: `feature`, `xp`, `ux`, `pokemon`
---

# XP Gain System Revision

## Problem Statement

Current XP system allows losing XP (negative values), which contradicts D&D mechanics where XP only accumulates. The PokemonCard has quick +/- buttons for XP while XPModifier modal only accepts gains. This is inconsistent with D&D's XP gain model where DMs award XP for activities.

## Requirements

### Core Functionality
- **XP Gain Only**: Remove negative XP logic, XP can only increase
- **Remove Quick Buttons**: Remove all quick +/- buttons from PokemonCard
- **Modal Only**: Use XPModifier modal for custom XP amounts (already exists, already gain-only)

### UX Changes
- **PokemonCard**: No XP buttons, click to open XPModifier modal
- **XPModifier Modal**: Keep as-is (already only accepts positive)
- **Store**: Update gainExperience to reject negative values

### Store Logic Changes

```typescript
// Current (allows negative)
gainExperience: (pokemonUuid, xpChange) => set((state) => {
  const newExperience = pokemon.experience + xpChange; // xpChange can be negative
})

// Revised (gain only)
gainExperience: (pokemonUuid, xpGained) => set((state) => {
  // Reject negative values
  if (xpGained < 0) return state;
  const newExperience = pokemon.experience + xpGained;
})
```

### Component Changes

1. **PokemonCard**: Remove XP quick buttons (lines 251-288)
2. **store/index.ts**: Update gainExperience to ignore negative values

## Implementation Details

### Store Change

```typescript
// src/store/index.ts - gainExperience action
gainExperience: (pokemonUuid, xpGained) => set((state) => {
  const pokemon = state.pokemonTeam[pokemonUuid];
  if (!pokemon) return state;

  // XP can only be gained (positive values)
  if (xpGained <= 0) return state;

  // ... existing level up logic
})
```

### PokemonCard Change

- Remove buttons at lines 251-288: the -10, -50, +10, +50, +100 buttons
- Keep the XP display bar, allow clicking to open modal for custom amounts

### Optional: Add Quick Gain Presets

If extra functionality desired later:
- Quick buttons: +50, +100, +250, +500
- Opens modal with pre-filled value

## Testing Strategy

- Unit tests for gainExperience rejecting negative values
- Component tests for PokemonCard XP section rendering without buttons

## Success Criteria

- [ ] gainExperience rejects negative values in store
- [ ] PokemonCard no longer shows XP +/- buttons
- [ ] XPModifier modal still works for custom XP gains
- [ ] XP can only increase, never decrease