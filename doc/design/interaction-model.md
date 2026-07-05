# Interaction Model

Covers tap targets, sheet patterns, and editing flows used on the dashboard.

## Core Principle
**Every data point has its own tap target. No overlapping zones. All editing in sheets — never page navigation during play.**

## Dashboard Tap Targets

### Pokémon Card
| Target | Gesture | Opens / Action |
|---|---|---|
| Header row (sprite, name, level, chevron) | tap | `PokemonExpandedModal` |
| HP bar | tap | `StatAdjustSheet` (HP tab) |
| XP underline | tap | `StatAdjustSheet` (XP tab) |
| Status badge | tap | `QuickStatusDropdown` |
| Attack pill (occupied) | tap | Decrements PP (inline, no sheet) |
| Attack pill (occupied) | long-press / right-click | `AttackQuickEditSheet` |
| + Add slot (empty) | tap | `AddAttackModal` |

### Trainer Strip
| Target | Gesture | Opens / Action |
|---|---|---|
| Header row (avatar, name, chevron) | tap | `TrainerSheet` |
| HP cell | tap | Trainer HP quick adjust sheet |
| Pokédollars cell | tap | Inline number input sheet |
| Items cell | tap | Trainer inventory (navigates to `/trainer`) |
| Attributes row | tap | `TrainerSheet` |

## Editing Sheet Components

All in-session editing uses `BottomSheet` (mobile) or `BaseModal` (desktop).
Never navigate away from the dashboard for an edit.

| Sheet | Purpose | Content |
|---|---|---|
| `StatAdjustSheet` | HP/XP adjustment | Draggable HP bar + damage/quick buttons, XP number input |
| `AttackQuickEditSheet` | PP restore/replace | PP +/- buttons, "Max" restore, "Replace" → opens AddAttackModal |
| `TrainerSheet` | Full trainer edit | Name, class, level inputs; attributes +/-; HP InteractiveProgress |
| `AddAttackModal` | Create attack | Attack name, PP, damage dice, action type, description |
| `PokemonExpandedModal` | Full Pokémon detail | HP drag, XP drag, attack list, status selector, edit/delete |
| `AddPokemonBottomSheet` | Add new Pokémon | Species autocomplete, stats form |

## Deprecated Patterns

### `onEditStat` toggle (REMOVED)
The old pattern where setting `onEditStat` disabled card click and made HP/XP pills
tappable. This was replaced with independent tap targets — header always opens modal,
HP bar always opens StatAdjustSheet. They never block each other.

### Page navigation for edits (AVOIDED)
The old pattern of `router.push("/trainer")` or `router.push("/pokemon/[uuid]/edit")`
for editing. All editing now happens in sheets on the dashboard. The only exception
is Items (navigates to `/trainer` since inventory management is complex).

## Component References
- `BottomSheet`: `src/components/shared/ui/BottomSheet/index.tsx`
- `BaseModal`: `src/components/shared/ui/BaseModal/index.tsx`
- `PokemonExpandedModal`: `src/features/pokemon/components/PokemonExpandedModal/index.tsx`
- `StatAdjustSheet`: `src/features/pokemon/components/StatAdjustSheet/index.tsx`
- `AttackQuickEditSheet`: `src/features/pokemon/components/AttackQuickEditSheet/index.tsx`
- `TrainerSheet`: `src/features/trainer/components/TrainerSheet/index.tsx`
- `AddAttackModal`: `src/features/pokemon/components/AddAttackModal/index.tsx`
- `QuickStatusDropdown`: `src/features/pokemon/components/QuickStatusDropdown/index.tsx`
- `InteractiveProgress`: `src/components/shared/ui/InteractiveProgress/index.tsx`
