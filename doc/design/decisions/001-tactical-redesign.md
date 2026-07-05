# Decision 001: Tactical Dashboard Redesign

**Date**: 2026-07-05
**Status**: Implemented

## Context
The original dashboard used a glassmorphism aesthetic with light/dark theme support
and a read-only-by-default editing model. The UI was functional but not optimized
for the primary use case: quick actions during tabletop D&D+Pokémon sessions.

## Decision
Redesigned the dashboard with a **tactical monospace aesthetic** optimized for
mobile-first, data-dense, in-session play. Key changes:

1. **Monospace typography** on all dashboard cards for a tabletop character-sheet feel
2. **Independent tap targets** replacing the old `onEditStat` toggle pattern
3. **All editing in BottomSheets** — no page transitions during play
4. **2×2 attack grid** with tap-to-use and long-press-to-edit PP
5. **HP bar color tiers** (green/yellow/red) for at-a-glance health assessment
6. **Always-visible status badges** with confused secondary indicator
7. **Fainted visual treatment** (grayscale, strikethrough, disabled attacks)
8. **Trainer strip** with team status dots, quick stats, and condensed attributes

## Consequences
- Glassmorphism, light theme, and read-only mode removed from docs
- All docs now point to `doc/design/mockup.html` as canonical reference
- The `onEditStat` prop deprecated in favor of `onHPTap` + `onXPTap` + `onLongPressAttack`
- The `/trainer` page is now a secondary view; all editing happens on `/dashboard`

## References
- `mockup-4-final.html` (copied to `doc/design/mockup.html`)
- `doc/design/pokemon-card.md`
- `doc/design/interaction-model.md`
- `doc/design/tokens.md`
