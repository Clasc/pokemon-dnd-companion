# Design Tokens

## Color Palette

### Surface Colors
| Token | Hex | Utility | Usage |
|-------|-----|---------|-------|
| `--color-bg` | `#1a1a1a` | `bg-primary` | Page background |
| `--color-surface` | `#222222` | `bg-surface` | Cards, inputs, dropdowns |
| `--color-surface-hover` | `#2d2d2d` | `bg-surface-hover` | Card hover |

### Interactive Colors
| Token | Hex | Utility | Usage |
|-------|-----|---------|-------|
| `--color-interactive` | `#EE5D20` | `bg-interactive`, `ring-interactive` | Primary buttons, focus rings |
| `--color-interactive-hover` | `#d44d15` | `hover:bg-interactive-hover` | Button hover |

### Text Colors
| Token | Hex | Utility | Usage |
|-------|-----|---------|-------|
| `--color-text-primary` | `#f0f0f0` | `text-primary` | Main text, headings |
| `--color-text-secondary` | `#a0a0a0` | `text-secondary` | Muted text, labels |

### Semantic (Pokémon-specific — exempt from token enforcement)
| Purpose | Source | Examples |
|---------|--------|----------|
| Pokémon types | `TYPE_COLORS` from `@/types/pokemon` | `TYPE_COLORS.fire` → `#F08030` |
| Status conditions | `STATUS_COLORS` from `@/types/pokemon` | `STATUS_COLORS.poisoned` → `#8E44AD` |
| XP accent | `--color-accent` | `#3B82F6` — XP bars and progress |
| HP bar fill | Dynamic function (see below) | Green/yellow/red/zinc tiers |

### Code Pattern
```tsx
// Preferred (Tailwind utilities)
className="bg-surface text-primary"

// For dynamic colors not in Tailwind
style={{ color: "var(--color-accent)" }}

// For Pokémon type colors
style={{ color: TYPE_COLORS[pokemon.type1] }}
```

## HP Bar Color Tiers

```tsx
function getHPBarColor(currentHP: number, maxHP: number): string {
  const pct = maxHP > 0 ? currentHP / maxHP : 0;
  if (currentHP === 0) return "#3f3f46";  // fainted — zinc
  if (pct < 0.25) return "#ef4444";       // red — <25%
  if (pct < 0.5) return "#eab308";        // yellow — 25-50%
  return "#22c55e";                        // green — >50%
}
```

## Status Condition Colors
Defined in `@/types/pokemon` as `STATUS_COLORS`:

| Condition | Hex | Usage |
|-----------|-----|-------|
| none | `#00000000` | Transparent (hidden) |
| burned | `#FF6B35` | Badge dot + card border |
| poisoned | `#8E44AD` | Badge dot + card border |
| badly-poisoned | `#6C3483` | Badge dot |
| paralyzed | `#FFE66D` | Badge dot |
| asleep | `#5DADE2` | Badge dot |
| frozen | `#4ECDC4` | Badge dot |
| confused | `#F39C12` | Secondary badge dot |
| fainted | `#4A4A4A` | Badge dot, dimmed card |

## Typography

| Context | Font | How to apply |
|---------|------|-------------|
| Dashboard cards | `'Courier New', monospace` | `style={{ fontFamily: "'Courier New', monospace" }}` |
| Page chrome | System sans-serif (`Inter`, `Poppins`) | Inheritance from body (default) |
| Card name | `text-sm font-bold text-primary` | 14px bold |
| Card labels | `text-[10px] text-secondary` | 10px muted |
| Attack names | `text-[11px]` | 11px medium |
| HP numbers | `text-[10px] font-mono` | 10px monospace |

## Spacing

Uses custom CSS tokens defined in `globals.css`:
- `p-space-3` — 12px padding (standard card padding)
- `gap-sm` — 8px gap (card internal spacing)
- `gap-1.5` — items between attack pills
- `mb-2` — 8px margin bottom (between card sections)
