# Mockup History

The canonical mockup is `../mockup.html` (formerly `mockup-4-final.html`).

These earlier versions document the design exploration that led to it:

| Version | File | Design Approach |
|---------|------|-----------------|
| Mockup 1 | `mockup-1-compact-mobile.html` (lost) | Mobile-first vertical stack — "Combat HUD" optimized for speed during play |
| Mockup 2 | `mockup-2-dashboard-cards.html` (lost) | Top-stats dashboard grid — trainer profile card + 3-column Pokémon grid |
| Mockup 3 | `mockup-3-table-tactical.html` (lost) | Full-width tactical table — spreadsheet-inspired data-dense rows |
| Mockup 3b | `mockup-3b-tactical-mobile.html` (lost) | Mobile adaptation of Mockup 3 — table rows as stacked cards |
| Mockup 4 | `../mockup.html` | **Final**: combines Mockup 2's trainer context with Mockup 3's tactical minimalism. Mobile-first, independent tap targets, bottom-sheet editing. |

## Design Evolution

1. **Mockup 1** was too low-density — good for speed, bad for seeing everything at once
2. **Mockup 2** was balanced but used card grids that created visual noise on mobile
3. **Mockup 3** was the data-dense "tactical table" approach — great for desktop, terrible for mobile
4. **Mockup 3b** adapted 3 for mobile cards but lacked trainer context
5. **Mockup 4** merged trainer context (from 2) with tactical minimalism (from 3) — the current design

Key decisions made during iteration: see `../decisions/001-tactical-redesign.md`.
