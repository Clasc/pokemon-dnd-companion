---
title: Unified Spacing Design System
version: 1.0
date_created: 2026-04-12
owner: Pokemon DnD Companion
tags: `design-system`, `tailwind`, `spacing`, `css`
---

# Unified Spacing Design System

## Problem Statement

Current paddings and margins across the app are inconsistent. Multiple values are used for the same semantic purposes:
- Card padding: `p-3`, `p-4`, `p-5`, `p-6`
- Button padding: `px-3 py-2`, `px-4 py-2`, `px-5 py-2`, `py-3 px-4`
- Gap: `gap-1`, `gap-2`, `gap-3`, `gap-4`, `gap-5`, `gap-6`, `gap-8`
- Section margins: `mb-2`, `mb-3`, `mb-4`, `mb-5`, `mb-6`

This inconsistency makes maintenance difficult and creates visual incoherence.

## Requirements

### Core Functionality
- **Tailwind Theme Extension**: Extend Tailwind v4 with custom spacing tokens in `globals.css` using `@theme`
- **Consistent Token Scale**: Define semantic spacing levels that map to Tailwind values
- **Component Migration**: Update components to use new tokens

### Spacing Token Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `p-1` (4px) | Tight elements, icon gaps |
| `space-2` | `p-2` (8px) | Chip padding, small gaps |
| `space-3` | `p-3` (12px) | Input padding |
| `space-4` | `p-4` (16px) | Card padding, default spacing |
| `space-5` | `p-5` (20px) | Medium sections |
| `space-6` | `p-6` (24px) | Large cards |
| `space-8` | `p-8` (32px) | Section spacing |

| Gap Token | Value | Usage |
|----------|-------|-------|
| `gap-tight` | `gap-1` | Icon clusters |
| `gap-sm` | `gap-2` | Related items |
| `gap-md` | `gap-4` | Default component gaps |
| `gap-lg` | `gap-6` | Section separation |

## Implementation Details

### Tailwind v4 Theme Extension

```css
/* src/app/globals.css */

@theme {
  /* Spacing tokens */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;

  /* Gap tokens */
  --gap-tight: 4px;
  --gap-sm: 8px;
  --gap-md: 16px;
  --gap-lg: 24px;
}
```

### Usage Pattern

```tsx
// After extension, use as:
// padding: var(--spacing-4)   → 16px
// gap: var(--gap-md)         → 16px

// Or via utility extensions if added:
// p-space-4, gap-md
```

### Components to Update

| Component | Current | Target |
|-----------|---------|--------|
| PokemonCard | `p-4`, `gap-1`, `gap-2` | `p-space-4`, `gap-sm` |
| PokemonCompactCard | `p-3`, `gap-2` | `p-space-3`, `gap-sm` |
| PokemonExpandedModal | `p-4 md:p-6` | `p-space-4 md:p-space-6` |
| PokemonOverview | `p-4 md:p-5`, `gap-4 md:gap-6` | `p-space-4 md:p-space-5`, `gap-md md:gap-lg` |
| Navigation | `px-3 py-2`, `gap-1`, `gap-2` | `px-space-3 py-space-2`, `gap-tight`, `gap-sm` |
| Buttons | `px-3 py-2`, `px-4 py-2` | `px-space-3 py-space-2` |
| Inputs | `px-3 py-2`, `p-2` | `px-space-3 py-space-2` |
| Forms container | `py-6`, `py-12`, `py-10` | `py-space-6` |

## Migration Strategy

1. **Add theme tokens** to `globals.css`
2. **Update each component** to use new tokens
3. **Verify visually** that layout remains consistent
4. **Run lint** to check for any missed patterns

## Testing Strategy

- Visual regression check after migration
- Lint rule to detect hardcoded spacing values (optional)

## Success Criteria

- [ ] All components use consistent spacing tokens
- [ ] No more `p-3`, `p-5`, `p-6` used inconsistently
- [ ] Gap values unified to `gap-tight`, `gap-sm`, `gap-md`, `gap-lg`
- [ ] Visual consistency maintained across all pages