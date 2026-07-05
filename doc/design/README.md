# Design System

Entry point for all design documentation. Each file covers a specific domain.
Agents read only the files relevant to their change.

## File Index

| File | Read when... |
|---|---|
| `tokens.md` | Choosing colors, fonts, spacing, or CSS utility classes |
| `pokemon-card.md` | Modifying `PokemonCompactCard`, adding card states, card layout |
| `trainer-strip.md` | Modifying `TrainerStrip`, trainer stats display, team dots |
| `interaction-model.md` | Adding tap targets, sheets, modals, editing flows |
| `attack-edit.md` | Attack pills, PP editing, attack management |
| `mockup.html` | **Canonical visual reference** — open this FIRST for any UI change |
| `decisions/` | Design decision log — why things are the way they are |

## Quick Design Rules (from `../AGENTS.md` Section 4)

- Colors: use Tailwind utilities `bg-surface`, `text-primary`, `bg-interactive` — never hardcoded hex
- Typography: `'Courier New', monospace` on dashboard cards, sans-serif for page chrome
- Statuses: only valid `STATUS_COLORS` conditions — no invented labels
- Editing: `BottomSheet` for mobile, `BaseModal` for desktop — never page navigation
- HP tiers: green (>50%), yellow (25-50%), red (<25%), zinc (0 HP = fainted)
