---
title: Add AC (Armor Class) to Pokemon
version: 1.0
date_created: 2026-04-12
owner: Pokemon D&D Companion
status: open
tags: `design`, `dnd`, `pokemon`, `armor-class`
---

# Introduction

This specification defines the requirements for adding Armor Class (AC) to Pokemon in the Pokemon D&D Companion application. AC is a core D&D statistic representing how difficult a Pokemon is to hit in combat.

## 1. Purpose & Scope

The purpose is to add AC as a new Pokemon stat that:
- Is auto-calculated from Dexterity by default (standard D&D unarmored formula)
- Can be manually overwritten by the user
- Displays on both the Dashboard (PokemonCard) and Team Overview
- Is required when creating a new Pokemon

## 2. Definitions

- **AC (Armor Class)**: A D&D statistic representing the difficulty to hit a target. Higher is better.
- **DEX Modifier**: `(dexterity - 10) / 2`, floored to nearest integer
- **PokemonCard**: The full detail card component shown on the Dashboard
- **PokemonOverview**: The team overview component showing all Pokemon
- **PokemonCompactCard**: The compact card showing HP/XP bars in team view

## 3. Requirements, Constraints & Guidelines

- **REQ-001**: AC must be a number field stored on the Pokemon interface
- **REQ-002**: AC must default to `10 + DEX modifier` when creating a new Pokemon
- **REQ-003**: AC must be editable in the PokemonForm during creation and edit
- **REQ-004**: AC must display on the Dashboard (PokemonCard) with a shield icon (🛡️)
- **REQ-005**: AC must display in the Team Overview (PokemonOverview) in the Team Stats section
- **REQ-006**: AC must display in the PokemonCompactCard
- **REQ-007**: AC is required field - validation must prevent saving with invalid AC
- **GUD-001**: Auto-calculated value should be shown as a suggestion but user can overwrite
- **GUD-002**: Display format should be "🛡️ {value}" for visual clarity

## 4. Interfaces & Data Contracts

### Pokemon Interface Addition

```typescript
interface Pokemon {
  // ... existing fields ...
  armorClass: number;  // New field - required
}
```

### Default AC Calculation

```
defaultAC = 10 + Math.floor((pokemon.attributes.dexterity - 10) / 2)
```

### Validation Rules

- AC must be >= 0
- No upper bound (standard D&D allows high AC from armor, spells, etc.)

## 5. Acceptance Criteria

- **AC-001**: Given a user creates a new Pokemon with DEX 14, When they view the form, Then AC defaults to 12
- **AC-002**: Given a user creates a new Pokemon, When they manually set AC to 15, Then the saved Pokemon has AC 15
- **AC-003**: Given a Pokemon with AC exists, When viewing the Dashboard, Then the PokemonCard displays "🛡️ {AC}" 
- **AC-004**: Given Pokemon exist in team, When viewing Team Overview, Then "Total AC" appears in Team Stats
- **AC-005**: Given a user edits an existing Pokemon, When they change AC, Then the change is persisted
- **AC-006**: Given a user attempts to create a Pokemon with negative AC, Then validation error prevents save

## 6. Test Automation Strategy

- **Test Levels**: Unit tests for store/calculation, Component tests for display, E2E for flow
- **Unit Tests**: Test default AC calculation formula
- **Component Tests**: Test AC displays correctly in PokemonCard, PokemonCompactCard, PokemonOverview
- **E2E Tests**: Full create Pokemon with AC flow

## 7. Rationale & Context

AC follows the standard D&D unarmored defense formula (10 + DEX mod). This makes sense for Pokemon who don't wear armor but have natural agility. Users can override because:
- Some Pokemon might have natural armor (Shuckle's shell)
- Some might wear items (Pokemon clothing/ accessories)
- Homebrew mechanics might affect AC

## 8. Dependencies & External Integrations

- **DAT-001**: Pokemon.dexterity attribute - must exist before AC can be calculated
- **DAT-002**: Pokemon.attributes object - used for DEX modifier calculation

## 9. Examples & Edge Cases

### Example: Default AC Calculation

```typescript
// Pokemon with DEX 16 (modifier = +3)
// AC = 10 + 3 = 13
const calculateDefaultAC = (dexterity: number): number => {
  const modifier = Math.floor((dexterity - 10) / 2);
  return 10 + modifier;
};
```

### Edge Cases

- **DEX 1**: Modifier = -4, AC = 6
- **DEX 10**: Modifier = 0, AC = 10
- **DEX 20**: Modifier = +5, AC = 15
- **DEX 30**: Modifier = +10, AC = 20

## 10. Validation Criteria

1. Pokemon with armorClass field can be created and saved
2. Pokemon without armorClass field fails type check
3. Dashboard displays AC with shield icon
4. Team Overview shows total AC in stats
5. Create form validates AC >= 0
6. Edit form allows modifying AC

## 11. Related Specifications / Further Reading

- Pokemon type interface: `/src/types/pokemon.ts`
- PokemonForm component: `/src/features/pokemon/components/PokemonForm/index.tsx`
- PokemonCard component: `/src/features/pokemon/components/PokemonCard/index.tsx`
- PokemonOverview component: `/src/features/pokemon/components/PokemonOverview/index.tsx`
