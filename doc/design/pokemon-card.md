# Pokémon Card Structure

Covers `PokemonCompactCard.tsx` — the primary dashboard card component.

## Card Anatomy

```
┌─────────────────────────────────────────┐
│ [sprite] Name         Lv ██▒▒░░ > │  ← Header (tap → expanded modal)
│ [Fire] [/] [Flying]                 │  ← Type text (colored, no pills)
├─────────────────────────────────────────┤
│ ● Status  ● Conf                     │  ← Status row (always visible)
├─────────────────────────────────────────┤
│ HP ████████████████████ 100/100      │  ← HP bar (tap → StatAdjustSheet)
├─────────────────────────────────────────┤
│ 🛡️18 STR12 DEX14 CON16 INT8 WIS10 ... │  ← AC + attributes row
├─────────────────────────────────────────┤
│ [Hydro Pump]  [Bite      ]           │  ← 2×2 attack grid (4 slots)
│ [Protect   ]  [+ Add     ]           │
└─────────────────────────────────────────┘
```

## Vertical Order (must follow exactly)
1. **Header row** — sprite, name, level + XP underline, type text, chevron `>`
2. **Status row** — primary badge + confused secondary badge
3. **HP bar** — labeled bar with numeric current/max
4. **Attributes row** — AC + STR/DEX/CON/INT/WIS/CHA
5. **Attack grid** — 2 columns × max 4 slots

## Component Imports
Use `@/types/pokemon` for `TYPE_COLORS`, `STATUS_COLORS`, `Attack`, `Pokemon`, `PokemonTeam`.
Use `@/utils/attributes` for `ATTRIBUTE_NAMES`, `getAttributeShortName`.
Use `@/utils/IconMapper` for `getPokemonIcon`.
Use `@/store` for `useAppStore.use.decreaseAttackPP()`.

## XP Underline
```tsx
const xpPct = pokemon.experienceToNext > 0
  ? Math.min(1, (pokemon.xpSinceLevelUp ?? 0) / pokemon.experienceToNext)
  : 0;
```
Render as: `Lv {level}` with a `h-0.5 bg-[var(--color-accent)]` bar underneath.
Width = `xpPct * 100%`. Tap opens `StatAdjustSheet`.

## Visual States

### Healthy (no condition)
- Status badge: gray dot + "Status" in `text-secondary`
- HP bar: color based on tier
- Card border: default `border-white/10`

### Status Condition Active
- Status badge: colored dot (from `STATUS_COLORS`) + condition name
- Examples: "Burned", "Poisoned", "Asleep", "Paralyzed"
- Card opacity: slightly reduced (`opacity-85`)
- Card border: colored to match condition (`border-{conditionColor}/50`)

### Confused (coexists with primary)
- Secondary badge: amber dot + "Conf"
- Smaller than primary badge (`text-[9px]`)
- Tappable separately → opens confused section of QuickStatusDropdown

### Low HP (<25%)
- Card border: `border-red-900/50 ring-1 ring-red-500/10`
- HP label: bold, colored red (`text-red-400 font-bold`)
- HP bar: red fill, `animate-pulse` optional
- HP numbers: bold, red
- No "Critical" badge — the bar communicates state

### Fainted (0 HP)
- Card opacity: `opacity-60`
- Sprite: `filter: grayscale(100%)`
- Name: `text-decoration: line-through`, color `#a0a0a0`
- Status badge: gray dot + "Fainted"
- HP bar: empty (`width: 0%`), fill color `#3f3f46`
- HP label/numbers: `#71717a`
- Attributes: dimmed to `text-zinc-600`
- Attacks: ALL disabled with `opacity-40 cursor-not-allowed`
- + Add slots: disabled
- Chevron: STILL visible — must be expandable to heal/revive
- Type text: dimmed (`text-zinc-600`)
- HP bar tap: STILL works → opens StatAdjustSheet (for revival)

## Attack Grid Rules
- Always 4 slots in a 2×2 grid
- Empty slots: dashed border "+ Add" button → opens `AddAttackModal`
- Occupied slots: attack name + PP count, tap = decrement PP
- PP = 0: button disabled, dimmed, `cursor-not-allowed`
- Long-press / right-click on occupied slot → `AttackQuickEditSheet`
- Fainted Pokémon: ALL slots disabled
- Max attack name length: truncated with CSS `truncate` class
