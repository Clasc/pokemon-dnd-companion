# Trainer Strip

Covers `TrainerStrip.tsx` — the persistent trainer info bar at the top of the dashboard.

## Layout

```
┌──────────────────────────────────────────────────┐
│ [🎒] Prof. Oak           ●●●●●● > │  Header row  │
│      Researcher • Lv 20               │              │
├──────────┬──────────────┬────────────┤              │
│ HP       │ ₽okédollars  │ Items      │  Stats row   │
│ 45/50    │ ₽ 12,400     │ 12         │              │
├──────────┴──────────────┴────────────┤              │
│ STR 14 DEX 12 CON 16 INT 10 WIS 13 CHA 16 │  Attributes │
└──────────────────────────────────────────────────┘
```

## Props
```tsx
interface TrainerStripProps {
  trainer: Trainer;
  pokemonTeam: PokemonTeam;  // for status dots
  onHeaderTap?: () => void;  // opens TrainerSheet
  onHPTap?: () => void;      // opens trainer HP quick adjust
  onDollarsTap?: () => void; // opens Pokédollars inline edit
  onItemsTap?: () => void;   // opens inventory / navigates to /trainer
  onAttributesTap?: () => void; // opens TrainerSheet
}
```

## Row 1: Header + Team Status Dots
- Left: circular avatar + name + class/level
- Right: 6 team status dots + chevron `>`
- Tapping the row opens `TrainerSheet`

### Team Status Dots
Six dots representing party slots (`pokemonTeam` entries):
- **Has condition**: colored dot from `STATUS_COLORS[condition]`
- **No condition**: green dot (`#22c55e`)
- **Empty slot**: zinc dot (`#3f3f46`)
- Sorted by party order (as stored in the map)

Do NOT use red for "low HP" — HP state is not a status condition, and the dots only represent actual `primaryStatus` conditions.

## Row 2: Quick Stats (3-column grid)
Each cell is independently tappable:
- **HP**: `trainer.currentHP / trainer.maxHP` in green, tap → quick HP adjust sheet
- **Pokédollars**: formatted with locale, tap → inline number input sheet
- **Items**: total quantity sum of `trainer.inventory`, tap → opens trainer inventory

## Row 3: Attributes
- Rendered inline: `STR {val} DEX {val} CON {val} INT {val} WIS {val} CHA {val}`
- Uses `getAttributeShortName()` from `@/utils/attributes`
- Tap → opens `TrainerSheet`

## Typography
All text inside the strip uses `'Courier New', monospace` for tactical consistency.
Labels (HP, ₽okédollars, Items, STR, DEX, etc.) are `text-[10px] text-secondary uppercase`.
Values are `text-sm text-primary font-bold`.

## Styling
- Container: `bg-surface border border-white/10 rounded-lg p-space-3`
- Stats cells: `bg-white/5 rounded p-2 text-center`
- Attribute rows: `border-t border-white/10 mt-2 pt-2`
- All rows: `cursor-pointer` for tap affordance

## State Dependencies
No internal state. All data from `trainer` and `pokemonTeam` props.
All mutations handled by parent (dashboard page) via callbacks.
