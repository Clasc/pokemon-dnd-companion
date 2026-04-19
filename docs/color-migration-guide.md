# Color Migration Guide

This guide documents the design system colors and how to migrate from hardcoded values to design tokens.

---

## Design Tokens

Always prefer these CSS variables over hardcoded colors:

| Token | Color | Hex | Usage |
|------|-------|-----|-------|
| `--color-interactive` | Orange | `#EE5D20` | Primary buttons, focus rings |
| `--color-interactive-hover` | Dark Orange | `#d44d15` | Button hover state |
| `--color-surface` | Dark Grey | `#222222` | Input fields, dropdowns, cards |
| `--color-surface-hover` | Grey | `#2d2d2d` | Card hover state |
| `--color-accent` | Blue | `#3B82F6` | XP bar, progress (Pokemon semantic) |
| `--color-bg` | Black | `#1a1a1a` | Page background |

---

## Tailwind Utilities

Use these utility classes instead of hardcoded values:

### Backgrounds

| Old Hardcoded | New Utility |
|--------------|-------------|
| `bg-[#EE5D20]` | `bg-interactive` |
| `hover:bg-[#d44d15]` | `hover:bg-interactive-hover` |
| `bg-[#222222]` | `bg-surface` |
| `hover:bg-[#2d2d2d]` | `hover:bg-surface-hover` |

### Text

| Old Hardcoded | New Utility |
|--------------|-------------|
| `text-[#f0f0f0]` | `text-primary` |
| `text-[#a0a0a0]` | `text-secondary` |

### Focus Rings

| Old Hardcoded | New Utility |
|--------------|-------------|
| `ring-[#EE5D20]` | `ring-interactive` |
| `ring-[#EE5D20]/50` | `ring-interactive/50` |
| `focus:ring-[#EE5D20]` | `focus:ring-interactive` |

### Focus Borders

| Old Hardcoded | New Utility |
|--------------|-------------|
| `border-[#EE5D20]` | `border-interactive` |
| `focus:border-[#EE5D20]` | `focus:border-interactive` |

---

## Migration Pattern

### Buttons

**Before:**
```tsx
className="px-5 py-2 rounded-lg bg-[#EE5D20] hover:bg-[#d44d15] text-white font-semibold"
```

**After:**
```tsx
className="px-5 py-2 rounded-lg bg-interactive hover:bg-interactive-hover text-white font-semibold"
```

### Input Fields

**Before:**
```tsx
className="w-full px-3 py-2 bg-[#222222] border border-white/20 rounded-lg"
```

**After:**
```tsx
className="w-full px-3 py-2 bg-surface border border-white/20 rounded-lg"
```

### Focus States

**Before:**
```tsx
className="focus:ring-2 focus:ring-[#EE5D20]"
```

**After:**
```tsx
className="focus:ring-2 focus:ring-interactive"
```

---

## Files Requiring Migration

### Buttons & Interactive Elements (14 files)

| File | Line(s) | Replace |
|------|--------|---------|
| `src/app/pokemon/new/page.tsx` | 134 | `bg-[#EE5D20]` → `bg-interactive` |
| `src/app/pokemon/[uuid]/edit/page.tsx` | 128, 186 | `bg-[#EE5D20]` → `bg-interactive` |
| `src/features/pokemon/components/AddPokemonModal/index.tsx` | 137 | `bg-[#EE5D20]` → `bg-interactive` |
| `src/features/pokemon/components/AddAttackModal/index.tsx` | 224 | `bg-[#EE5D20]` → `bg-interactive` |
| `src/features/pokemon/components/AttackCard/index.tsx` | 96 | `bg-[#EE5D20]` → `bg-interactive` |
| `src/features/pokemon/components/StatusSelector/index.tsx` | 321 | `bg-[#EE5D20]` → `bg-interactive` |
| `src/features/pokemon/components/PokemonAutocomplete/index.tsx` | 268 | `bg-[#EE5D20]` → `bg-interactive` |
| `src/features/pokemon/components/PokemonCard/index.tsx` | 257 | `bg-[#EE5D20]` → `bg-interactive` |
| `src/features/pokemon/components/PokemonOverview/PokemonCompactCard.tsx` | 122 | `bg-[#EE5D20]` → `bg-interactive` |
| `src/features/pokemon/components/PokemonOverview/index.tsx` | 72, 126 | `bg-[#EE5D20]` → `bg-interactive` |
| `src/features/trainer/components/TrainerInventory/index.tsx` | 107 | `focus:ring-yellow-500` → `focus:ring-interactive` |
| `src/components/shared/ui/ConfirmationModal/index.tsx` | 69 | `bg-[#EE5D20]` → `bg-interactive` |
| `src/components/shared/Navigation/index.tsx` | 178, 198, 250 | `bg-[#EE5D20]` → `bg-interactive` |
| `src/app/layout.tsx` | 46 | SVG fill not migratable (hardcode OK) |

### Input Fields (8 files)

| File | Replace |
|------|---------|
| `src/features/pokemon/components/PokemonForm/index.tsx` | `bg-[#222222]` → `bg-surface` |
| `src/features/pokemon/components/AddAttackModal/index.tsx` | `bg-[#222222]` → `bg-surface` |
| `src/features/pokemon/components/PokemonAutocomplete/index.tsx` | `bg-[#222222]` → `bg-surface` |
| `src/features/pokemon/components/MoveAutocomplete/index.tsx` | `bg-[#222222]` → `bg-surface` |
| `src/features/trainer/components/TrainerOverview/index.tsx` | `bg-[#222222]` → `bg-surface` |
| `src/features/trainer/components/TrainerInventory/index.tsx` | `bg-[#222222]` → `bg-surface` |
| `src/features/trainer/components/ItemAutocomplete/index.tsx` | `bg-[#222222]` → `bg-surface` |
| `src/app/layout.tsx` | SVG background not migratable (hardcode OK) |

### Focus Rings (Multiple files)

Replace patterns:
- `ring-[#EE5D20]` → `ring-interactive`
- `ring-[#EE5D20]/50` → `ring-interactive/50`
- `focus:ring-[#EE5D20]` → `focus:ring-interactive`
- `focus:border-[#EE5D20]` → `focus:border-interactive`

---

## Keep As-Is (Pokemon Semantic Colors)

These elements should **NOT** be migrated - they intentionally use blue/other colors because they convey Pokemon game semantics:

- XP bars (`InteractiveProgress`)
- HP bars (`ProgressBar`)
- Level progression indicators
- Status effect indicators (poison, burn, freeze, etc.)

---

## Verification

After migration, verify:
1. Build passes: `npm run build`
2. Lint passes: `npm run lint`
3. UI looks correct - orange for interactive elements, blue for progress bars