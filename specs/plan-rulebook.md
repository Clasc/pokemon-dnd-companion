---
title: Rulebook
version: 1.0
date_created: 2026-04-19
owner: Pokemon DnD Companion
tags: `feature`, `reference`
status: open
---

# Rulebook

## Problem Statement

Players need a reference guide to understand how Pokémon and D&D rules map to each other in this hybrid system. Currently, this mapping information exists only scattered across code and documentation.

## Requirements

- Create a navigable rulebook UI accessible from the app
- Display type effectiveness chart (which Pokemon types are strong/weak/resistant/immune against others)
- Show stat modifier calculations (ability score → modifier formula)
- Document level progression mechanics (level → proficiency bonus, AC base)
- Map status effects between Pokemon and D&D conditions
- Document attack/action system (action vs bonus action, PP tracking)

## Implementation Details

### Data Sources (from codebase)

- **PokemonType** (`src/types/pokemon.ts:59-77`): 18 types
- **TYPE_COLORS** (`src/types/pokemon.ts:85-104`): Type-to-color mapping
- **STATUS_COLORS** (`src/types/pokemon.ts:106-117`): Status to color mapping
- **Attributes** (`src/types/pokemon.ts:119-126`): D&D 6 abilities from Pokemon
- **Attack** (`src/types/pokemon.ts:3-12`): Move structure with action type, PP, damage dice
- **StatusCondition** (`src/types/pokemon.ts:20-30`): Pokemon status effects

### Rulebook Sections

1. **Type Chart**: Matrix showing attacker vs defender effectiveness
2. **Ability Scores**: STR, DEX, CON, INT, WIS, CHA → modifier formula
3. **Combat**
   - HP: currentHP / maxHP tracking
   - Actions: action vs bonus action
   - PP: currentPp / maxPp tracking
4. **Status Effects**: Pokemon conditions mapped to D&D conditions
5. **Level Progression**: Level → proficiency bonus (standard D&D 5e)

### UI Approach

- Add `/rulebook` route
- Section-based navigation (tabs or accordion)
- Reference tables for type chart and modifiers

## Success Criteria

- [ ] Rulebook accessible from navigation
- [ ] Type effectiveness chart displayed
- [ ] Ability score modifier table shown
- [ ] Level progression table shown
- [ ] Status effects reference included