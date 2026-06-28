---
title: Dashboard Simplification — Read-Only Team Snapshot
version: 1.0
date_created: 2026-06-27
owner: Pokemon D&D Companion
tags: design, ux, dashboard
status: done
---

# Dashboard Simplification

## Problem
The Dashboard duplicates all trainer and pokemon functionality — HP/XP drag, pokedollars, inventory, status cycling, attacks — creating a complex page that competes with the dedicated `/pokemon` and `/trainer` tabs.

## Solution
Strip the Dashboard to a read-only team snapshot with a compact trainer header. All interactivity moves to the dedicated pages.

## Layout
```
┌──────────────────────────────┐
│  [icon] Trainer Name          │  ← TrainerStrip
│  Lv. 5 Paladin               │
├──────────────────────────────┤
│  Pokemon Card (read-only)     │  ← sprite, name, types, AC
│  HP ████████░░ 45/80         │     static ProgressBar (no drag)
│  XP ██████░░░░ 1200/2500     │     status badge (read-only)
├──────────────────────────────┤
│  Pokemon Card ...             │
├──────────────────────────────┤
│  [+ Add Pokémon]              │
└──────────────────────────────┘
```

## Changes

### New: TrainerStrip
- Compact read-only trainer header
- Shows: icon, name, "Lv. {level} {class}"
- No HP, no attributes, no pokedollars, no inventory, no edit

### Modified: PokemonCompactCard (`readOnly` prop)
When `readOnly=true`:
- HP/XP render as static `ProgressBar` instead of `InteractiveProgress`
- Status icon is display-only (no `QuickStatusDropdown`)
- Card still clickable (opens read-only detail modal)
- No attack badges

### Modified: PokemonExpandedModal (`readOnly` prop)
When `readOnly=true`:
- Shows: larger sprite, name, level, types, attributes, AC
- HP/XP as static ProgressBars (no drag)
- Attacks listed as compact chips (name + PP)
- Status displayed (read-only)
- No Edit/Delete buttons
- No QuickStatusDropdown
- No attack management (add/edit/delete)
- Footer: "View Full Details" button → navigates to `/pokemon`

### Modified: Dashboard page
- Single column layout
- `TrainerStrip` at top (no `TrainerOverview`)
- `PokemonOverview` with `readOnly=true`, `hideTeamStats=true`
- No inline `TrainerOverview` (no pokedollars, inventory, attributes)

### Modified: PokemonOverview (`readOnly` prop)
- Passes `readOnly` through to `PokemonCompactCard`
- Passes `readOnly` through to `PokemonExpandedModal`

## Acceptance Criteria
- AC-1: Dashboard shows only trainer name/level/class in a compact strip
- AC-2: Dashboard pokemon cards have static HP/XP bars (not draggable)
- AC-3: Dashboard pokemon status is display-only (not cycle-able)
- AC-4: Clicking a pokemon card opens a read-only detail modal
- AC-5: Read-only detail modal has "View Full Details" button linking to /pokemon
- AC-6: No pokedollars, inventory, trainer attributes, or edit controls on dashboard
- AC-7: /pokemon and /trainer pages remain fully interactive (unchanged)
- AC-8: Add Pokémon button still works on dashboard
