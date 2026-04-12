---
title: Status Effects Quick Select
version: 1.0
date_created: 2026-04-12
owner: Pokemon DnD Companion
tags: `feature`, `pokemon`, `status-effects`, `ui`, `quick-access`
---

# Status Effects Quick Select

## Problem Statement

The existing status system requires opening a modal to select status effects. Users need a faster, more accessible way to apply statuses during gameplay with a single click. Additionally, fainted state needs automatic handling when HP reaches zero, with visual greyed representation matching official Pokemon games.

## Requirements

### Core Functionality
- **Quick Dropdown Button**: External button on Pokemon card for instant status selection
- **Dropdown UI**: Simple dropdown list showing all available statuses with their colors
- **Auto-Faint**: When HP reaches 0, automatically set status to "fainted"
- **Auto-Recover**: When HP restored above 0, clear "fainted" status
- **Fainted Visual**: Grey/grayscale filter on Pokemon image when fainted
- **Mutual Exclusion**: Only one primary status at a time
- **Confused Special**: Can coexist with primary status

### Status Colors (Official Game Palette)
| Status | Color | Hex |
|--------|-------|-----|
| None | - | transparent |
| Fainted | Dark Grey | `#4A4A4A` |
| Burned | Orange-Red | `#FF6B35` |
| Frozen | Ice Blue | `#4ECDC4` |
| Paralyzed | Electric Yellow | `#FFE66D` |
| Poisoned | Purple | `#8E44AD` |
| Badly Poisoned | Dark Purple | `#6C3483` |
| Asleep | Soft Blue | `#5DADE2` |
| Confused | Amber | `#F39C12` |

### User Experience
- **One-Click Access**: Dropdown button visible without opening modal/menu
- **Clear Visual**: Status colors visible in dropdown options
- **Fast Selection**: Single click to apply status
- **Mobile Friendly**: Touch-friendly dropdown

## Implementation Details

### Type Changes

```typescript
// src/types/pokemon.ts

// Add "fainted" to StatusCondition
export type StatusCondition =
  | "burned"
  | "frozen"
  | "paralyzed"
  | "poisoned"
  | "badly-poisoned"
  | "asleep"
  | "confused"
  | "flinching"
  | "fainted"    // NEW
  | "none";

// Add fainted color to STATUS_COLORS
export const STATUS_COLORS: Record<StatusCondition, Color> = {
  burned: "#FF6B35",
  frozen: "#4ECDC4",
  paralyzed: "#FFE66D",
  poisoned: "#8E44AD",
  "badly-poisoned": "#6C3483",
  asleep: "#5DADE2",
  confused: "#F39C12",
  flinching: "#95A5A6",
  fainted: "#4A4A4A",   // NEW
  none: "#00000000",
};
```

### Store Changes

```typescript
// src/store/index.ts - modifyPokemonHP action

modifyPokemonHP: (pokemonUuid, hpChange) => set((state) => {
  const pokemon = state.pokemonTeam[pokemonUuid];
  if (!pokemon) return state;

  const newCurrentHP = Math.max(0, Math.min(pokemon.maxHP, pokemon.currentHP + hpChange));
  
  let updatedPokemon = { ...pokemon, currentHP: newCurrentHP };
  
  // Auto-faint logic
  if (newCurrentHP === 0) {
    // Set fainted if HP hits 0
    updatedPokemon.primaryStatus = { condition: "fainted", turnsActive: 0 };
    // Clear confusion when fainted
    updatedPokemon.confusion = undefined;
  } else if (pokemon.primaryStatus?.condition === "fainted" && newCurrentHP > 0) {
    // Clear fainted when HP restored
    updatedPokemon.primaryStatus = undefined;
  }

  return { pokemonTeam: { ...state.pokemonTeam, [pokemonUuid]: updatedPokemon } };
})
```

### QuickStatusDropdown Component

```typescript
// src/features/pokemon/components/QuickStatusDropdown/index.tsx

interface QuickStatusDropdownProps {
  pokemonUuid: string;
}

const PRIMARY_STATUS_OPTIONS: StatusCondition[] = [
  "none",
  "fainted",
  "burned",
  "frozen",
  "paralyzed",
  "poisoned",
  "badly-poisoned",
  "asleep",
  "confused",
];

// Displays:
// - Small icon/button (external to card)
// - Click opens native <select> dropdown or custom dropdown
// - Each option shows color dot + status name
// - On change: calls setPrimaryStatus or setConfusion
```

### Image Grey Filter

```tsx
// In PokemonCard or PokemonCompactCard

{pokemon.spriteUrl ? (
  <img
    src={pokemon.spriteUrl}
    alt={pokemon.name}
    className="w-full h-full object-contain"
    style={{
      filter: pokemon.primaryStatus?.condition === "fainted" 
        ? "grayscale(100%)" 
        : undefined
    }}
  />
) : (
  getPokemonIcon(...)
)}
```

## UI/UX Design

### Quick Status Button Placement
- Position: Top-right corner of Pokemon card, outside the main glass container
- Style: Small pill-shaped or dropdown select element
- Icon: Status indicator or down-arrow icon

### Dropdown Options Structure
```
[●] None
[●] Fainted (grey)
[●] Burned (orange)
[●] Frozen (cyan)
[●] Paralyzed (yellow)
[●] Poisoned (purple)
[●] Badly Poisoned (purple)
[●] Asleep (blue)
[●] Confused (amber)
```

### Visual Integration
- Button uses glassmorphism to match card style
- Status color shown as dot next to each option
- Active status shown as colored badge on card

## Testing Strategy

### Unit Tests
1. modifyPokemonHP sets fainted when HP becomes 0
2. modifyPokemonHP clears fainted when HP becomes > 0
3. modifyPokemonHP clears confusion on faint
4. setPrimaryStatus replaces existing primary status

### Component Tests
1. QuickStatusDropdown renders all options with colors
2. Selecting option updates store
3. Fainted Pokemon shows grayscale filter
4. Active status badge displays correctly

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| HP reaches 0 via any method | Auto-set fainted |
| HP restored from 0 | Clear fainted status |
| Fainted + user selects poisoned | Replace fainted with poisoned |
| Confused + HP reaches 0 | Set fainted, clear confused |
| No spriteUrl when fainted | Grey emoji/icon fallback |

## Success Criteria

- [ ] Quick status dropdown button visible on Pokemon card
- [ ] Dropdown shows all statuses with their colors
- [ ] Selecting status applies it in one click
- [ ] HP=0 auto-sets fainted status
- [ ] Fainted Pokemon shows greyed/grayscale image
- [ ] HP>0 clears fainted automatically
- [ ] Confused can exist alongside any primary status

## Dependencies

- Existing: PokemonCard and PokemonCompactCard components
- Existing: Zustand store state management
- Existing: STATUS_COLORS mapping
- Existing: Pokemon types interface