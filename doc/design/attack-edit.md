# Attack Editing

Covers attack pills, PP management, and attack creation/replacement.

## Attack Pill (on Card)
- `2×2 grid`, 4 slots max per Pokémon
- Occupied slot: attack name (truncated) + `PP {currentPp}/{maxPp}`
- Empty slot: dashed border "+ Add" button

## Interactions

| Gesture | Result |
|---|---|
| **Tap** (occupied, PP > 0) | Decrements PP by 1 via `useAppStore.use.decreaseAttackPP()` |
| **Tap** (occupied, PP = 0) | Nothing — button is disabled |
| **Tap** (empty slot) | Opens `AddAttackModal` at that slot index |
| **Long-press / right-click** (occupied) | Opens `AttackQuickEditSheet` |
| **Disabled** (fainted) | All slots disabled, including "+ Add" |

## AttackQuickEditSheet
Opened via long-press on any occupied attack pill.

### Content
1. Attack name and damage dice / action type
2. PP section: current/max display with -1 / +1 / Max buttons
3. "Replace" button → closes sheet, opens `AddAttackModal` at same slot

### PP Controls
```tsx
modifyAttackPP(pokemonUuid, attackIndex, delta: number)
// delta: positive = restore, negative = decrement
// clamped between 0 and maxPp
```

## AddAttackModal
Opened from "+ Add" slot or "Replace" button.

### Fields
- Attack name (text input)
- PP max (number input)
- Damage dice: d4 / d6 / d10 (select)
- Action type: action / bonus action (select)
- Move bonus (number)
- Special effect (optional text)
- Description (optional textarea)

### Store
```tsx
addAttack(pokemonUuid, attackIndex, attack: Attack)
// Overwrites attack at given index
// Sets currentPp = maxPp automatically
```

## Disabled States
- PP = 0: `opacity-40 cursor-not-allowed`, text colors dimmed to `#71717a` / `#52525b`
- Fainted: ALL slots disabled with same treatment
- PP at max: +1 and Max buttons disabled in AttackQuickEditSheet
