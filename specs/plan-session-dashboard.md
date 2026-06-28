---
title: Session Dashboard — Combat Tracker Hub
version: 1.0
date_created: 2026-06-27
tags: design, feature, dashboard, session
status: done
---

# Session Dashboard

Redesign `/dashboard` as a mobile-first combat tracker for use during live D&D/Pokémon sessions, replacing both the current (overly complex) and the proposed (read-only, useless) versions.

## 1. Purpose & Scope

**Problem:** The dashboard was either too complex (full interactivity, 2-column, all controls) or too passive (read-only, no actions possible mid-session). Neither works when a player is at the table and needs to quickly damage a Pokémon, apply status, or decrement PP.

**Solution:** A focused "session hub" that shows the entire party at a glance and provides the three most common mid-session actions — HP adjustment, status toggling, and PP decrement — without navigating away. All other management (editing, deleting, adding attacks, items, trainer) stays on `/pokemon` and `/trainer` pages.

**Out of scope:**
- Attack editing/deleting (go to `/pokemon`)
- Item usage (future feature)
- Trainer editing (go to `/trainer`)
- XP drag (post-session, go to `/pokemon`)
- Adding/removing Pokémon (go to `/pokemon`)

## 2. Definitions

| Term | Definition |
|------|-----------|
| Session | A live tabletop game session where the player needs quick, frequent adjustments |
| HP Bottom Sheet | A bottom-sheet modal with damage/heal buttons that opens when tapping a HP bar |
| PP Chip | A small pill-shaped button showing attack name and current/max PP, tap to decrement |
| QuickStatusDropdown | Existing component (compact mode) for cycling primary status conditions |
| TrainerStrip | Existing compact trainer header (name, level, class) |

## 3. Requirements, Constraints & Guidelines

- **REQ-001**: Dashboard MUST show all party Pokémon at once (full team of 5-6 visible by scrolling)
- **REQ-002**: Each Pokémon card MUST display: name, level, types, static HP bar, attack PP chips, status indicator
- **REQ-003**: Tapping a HP bar MUST open the HP Bottom Sheet for quick damage/heal
- **REQ-004**: HP Bottom Sheet MUST provide damage buttons (-10, -5, -1) and heal buttons (+1, +5, +10)
- **REQ-005**: HP Bottom Sheet MUST allow entering an exact HP value via number input
- **REQ-006**: HP Bottom Sheet MUST auto-faint (set fainted status) when HP reaches 0
- **REQ-007**: HP Bottom Sheet MUST auto-clear fainted status when HP rises above 0
- **REQ-008**: Each PP chip MUST decrement PP by 1 on tap (no confirmation, no modal)
- **REQ-009**: PP chips MUST be disabled when PP = 0
- **REQ-010**: Status MUST use the existing QuickStatusDropdown in compact mode
- **REQ-011**: XP bar MUST be static (ProgressBar, not InteractiveProgress)
- **REQ-012**: TrainerStrip MUST show at top (existing component, unchanged)
- **REQ-013**: Dashboard MUST use single-column layout, max-w-3xl centered
- **REQ-014**: No modals beyond the HP Bottom Sheet — no expanded detail, no edit, no delete
- **REQ-015**: All actions MUST use existing store mutations (no new store actions needed)
- **CON-001**: Must work well on phone screens (375px+ width)
- **CON-002**: Use existing components where possible (TrainerStrip, QuickStatusDropdown, ProgressBar)
- **GUD-001**: Keep cards compact — no wasted vertical space, fit as many Pokémon above the fold as possible
- **PAT-001**: Follow existing component pattern (ComponentName/index.tsx + index.test.tsx)

## 4. Interfaces & Data Contracts

### New Component: HPBottomSheet

```tsx
interface HPBottomSheetProps {
  pokemon: Pokemon;
  pokemonUuid: string;
  isOpen: boolean;
  onClose: () => void;
}
```

**Store actions used:**
- `modifyPokemonHP(uuid, delta)` — positive = heal, negative = damage
- `setPrimaryStatus(uuid, condition)` — called internally when HP hits 0 or revives

### Modified Component: PokemonCompactCard

New optional prop:

```tsx
interface PokemonCompactCardProps {
  // ... existing props ...
  onEditHP?: (pokemon: Pokemon, uuid: string) => void;  // NEW
}
```

When `onEditHP` is provided:
- HP bar renders as clickable ProgressBar instead of InteractiveProgress
- Clicking the HP bar fires `onEditHP(pokemon, uuid)` instead of starting a drag
- XP bar renders as ProgressBar (static) regardless
- QuickStatusDropdown is shown (not readOnly)

### Modified Component: PokemonOverview

New optional prop:

```tsx
interface PokemonOverviewProps {
  // ... existing props ...
  onEditHP?: (pokemon: Pokemon, uuid: string) => void;  // NEW
}
```

Propagates `onEditHP` to each PokemonCompactCard.

### Dashboard Page

```tsx
// src/app/dashboard/page.tsx
export default function DashboardPage() {
  // State: selectedPokemonUuid for HP Bottom Sheet
  // Renders:
  //   - TrainerStrip
  //   - PokemonOverview with showAttacks={true} + onEditHP callback
  //   - HPBottomSheet (when a Pokemon's HP bar is tapped)
}
```

## 5. Acceptance Criteria

- **AC-001**: Dashboard shows all party Pokémon with HP bars, type icons, and status indicators
- **AC-002**: Tapping a HP bar opens the HP Bottom Sheet with current HP displayed
- **AC-003**: Tapping -10, -5, -1 in HP Bottom Sheet reduces HP accordingly (clamped to 0)
- **AC-004**: Tapping +1, +5, +10 in HP Bottom Sheet increases HP accordingly (clamped to maxHP)
- **AC-005**: Setting HP to 0 via any method auto-applies "fainted" status
- **AC-006**: Setting HP above 0 on a fainted Pokémon auto-clears fainted status
- **AC-007**: Each PP chip shows attack name and currentPp/maxPp, tapping decrements by 1
- **AC-008**: PP chips with 0 PP are visually disabled and non-interactive
- **AC-009**: Compact status dropdown cycles through primary status conditions
- **AC-010**: XP bar is static (non-interactive) on dashboard
- **AC-011**: NO expanded detail modal, no edit, no delete, no add-pokémon on dashboard
- **AC-012**: All existing tests still pass (no regressions)

## 6. Test Automation Strategy

- **HPBottomSheet**: render test, damage buttons, heal buttons, exact value input, fainted boundary
- **PokemonCompactCard (onEditHP)**: verify HP bar is clickable (not draggable), verify onClick fires
- **Dashboard page**: verify render with full team, tap HP → sheet opens, verify PP tap works

No snapshot tests. Follow existing test conventions (getByRole, getByText).

## 7. Rationale & Context

- Tap-don't-drag: Drag is imprecise on phone and harder to do one-handed. A bottom sheet with explicit +/- buttons is faster and more accurate for tabletop play.
- PP on dashboard: Attacks are the most common action in battle. Decrementing PP shouldn't require navigating to a different page.
- No XP interaction: XP is a post-session bookkeeping task, not something you adjust mid-combat.
- No expanded modal: The dashboard should be fast — tap a bar, adjust HP, dismiss. A full modal with all details slows you down.
- Single column: Phone-first. Two columns don't work at 375px width.

## 8. Dependencies & External Integrations

None. All store actions exist. No new packages needed.

## 9. Examples & Edge Cases

### HP Bottom Sheet flow

```
User taps Pikachu's HP bar
  → HPBottomSheet slides up
  → Shows: "Pikachu — HP: 27 / 80"
  → Buttons: [-10] [-5] [-1] [+1] [+5] [+10]
  → Custom input: [____] Set
  → User taps -5 → HP becomes 22 / 80
  → User taps Close or backdrop
  → Sheet dismisses, HP bar updates
```

### Fainted edge case

```
User taps -1 repeatedly until HP reaches 0
  → modifyPokemonHP sets HP = 0
  → Store auto-applies primaryStatus = { condition: "fainted", turnsActive: 0 }
  → Card shows fainted badge
  → User opens HP sheet, taps +10 → HP = 10
  → Store auto-cleans fainted status
  → Card shows revived (normal status)
```

### PP at 0

```
Attack "Tackle" has currentPp = 0, maxPp = 20
  → Chip shows "Tackle 0/20" in muted/gray
  → Chip is not clickable (disabled)
  → No decrement possible
```

### Empty team

```
No Pokémon in party
  → Dashboard shows TrainerStrip + empty state message
  → User navigates to /pokemon to add Pokémon
```

## 10. Validation Criteria

1. `npm test` passes (21 suites, 352+ tests)
2. `npx tsc --noEmit` produces no errors
3. `npm run lint` has no new warnings beyond pre-existing
4. Manual verification on phone viewport (375px): HP tap opens sheet, buttons work, PP tap decrements

## 11. Related Specifications

- `specs/plan-dashboard-simplification.md` (predecessor — superseded by this spec)
- `specs/plan-click-friction-reduction.md` (established inline interaction patterns)
- `specs/plan-mobile-first-overlays.md` (established bottom sheet patterns)
