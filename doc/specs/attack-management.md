# Attack Management Redesign

## Overview

Improve attack management on Pokemon cards:
1. Execute attacks directly from the overview card (compact card)
2. Manage attacks (add, edit, delete) in a dedicated manage section

## Current State

### PokemonCompactCard
- Shows attack names as badges/chips
- No way to execute or manage attacks

### PokemonExpandedModal
- Attacks section with "Manage" toggle button
- When "Manage" shown: displays AttackCard components with edit/delete
- AttackCard has "Perform Attack" button but only visible when expanded

## Target State

### Overview Card (PokemonCompactCard)

**Display:**
- Show attack badges in compact view (current behavior)

**Execute Attack:**
- Click on attack badge to execute that attack
- Show PP remaining after execution
- Visual feedback: flash or highlight on execution
- Animate PP number change

**Manage Action:**
- Add "Manage" button or long-press to enter manage mode

### Manage Section (inside PokemonExpandedModal)

**Features:**
- Add new attack (up to 4)
- Edit existing attack (tap to open edit modal)
- Delete attack (with confirmation)
- Reorder attacks (drag or up/down buttons)
- Each attack shows:
  - Name
  - PP (current/max)
  - Action type (action/bonus action)
  - Damage dice
  - Move bonus
  - Special effect (if any)
  - Description

**Layout:**
- Grid of attack cards (2 columns on desktop, 1 on mobile)
- "+ Add Attack" button when < 4 attacks

## Implementation Plan

### 1. Modify PokemonCompactCard

- Add click handler on attack badges to execute
- Show "Manage" button or gesture
- Add visual feedback for execution

### 2. Add AttackStoreActions

- Add `executeAttack(pokemonUuid, attackIndex)` to store
- Decreases PP by 1

### 3. Enhance PokemonExpandedModal Attacks Section

- Always show attacks (no toggle needed)
- Add edit/delete on each attack card
- Add confirmation for delete

### 4. Add Edit Attack Modal

- Reuse or enhance AddAttackModal for editing
- Pre-fill with existing attack data
- Save changes

## Acceptance Criteria

1. Compact card shows attack badges
2. Clicking attack badge executes attack (decreases PP)
3. Visual feedback on attack execution
4. Manage section allows adding attacks
5. Manage section allows editing attacks
6. Manage section allows deleting attacks
7. Manage section shows all attack details

## Edge Cases

- executing attack with 0 PP - show "No PP" message, don't execute
- deleting attack - confirm before deleting
- editing attack - pre-fill modal with current values
- max 4 attacks - show "+ Add Attack" only when < 4