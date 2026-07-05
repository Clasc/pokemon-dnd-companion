---
name: design-guardian
description: |
  Use this skill whenever making UI changes, editing components, adding new
  visual elements, choosing colors, styling cards, creating sheets/modals,
  or modifying any file under src/features/ or src/app/. Also use when
  the user mentions design, styling, CSS, colors, layout, typography,
  mockup, or asks to review UI. This skill enforces the project's design
  system by directing agents to the right domain-specific design doc.
---

# Design Guardian

Enforces consistency with the design system defined under `doc/design/`.
The skill's main job is to route you to the right domain file, not to
duplicate all the rules inline.

---

## 1. Entry Point

**Start every UI task by reading `doc/design/README.md`.** This tells you
which domain file covers your change and links to the canonical mockup.

Then read one or more of these based on what you're changing:

| You're changing... | Read this |
|---|---|
| Colors, fonts, spacing, CSS | `doc/design/tokens.md` |
| Pokémon cards (`PokemonCompactCard`) | `doc/design/pokemon-card.md` |
| Trainer strip (`TrainerStrip`) | `doc/design/trainer-strip.md` |
| Tap targets, sheets, modals | `doc/design/interaction-model.md` |
| Attacks, PP editing | `doc/design/attack-edit.md` |
| Visual layout (any component) | `doc/design/mockup.html` (open in browser) |
| Why something was designed a certain way | `doc/design/decisions/` |

---

## 2. Hard Rules (never break)

These are non-negotiable. The domain files have the details; these are
the ones that caused bugs when violated:

### Colors
- **No hardcoded hex** in className or style. Use `bg-surface`, `text-primary`,
  `bg-interactive`, or `var(--color-xxx)`.
- Exception: Pokémon `TYPE_COLORS` and `STATUS_COLORS` (semantic, dynamic at runtime)
- Exception: HP bar tier colors (green/yellow/red — dynamic function)

### Typography
- Dashboard cards and trainer strip: `'Courier New', monospace`
  Apply via `style={{ fontFamily: "'Courier New', monospace" }}`.
- Page chrome (headings, nav, modals): default sans-serif (inherited)

### Status Labels
- Only valid conditions from `STATUS_COLORS`: burned, frozen, paralyzed,
  poisoned, badly-poisoned, asleep, confused, flinching, fainted, none
- **Never** use "Ready", "Critical", "Healthy", "OK" as labels
- Status badge always visible (gray "Status" placeholder when no condition)
- Confused is a secondary badge alongside the primary status

### Interaction
- Tap targets never overlap — header, HP, XP, status, attacks are separate
- All editing in `BottomSheet`/`BaseModal` — never `router.push()` during play
- The `onEditStat` toggle pattern is deprecated — don't reintroduce it

### Card States
- Fainted: grayscale sprite, strikethrough name, empty HP bar, ALL attacks disabled
- HP < 25%: red border accent, bold red HP numbers
- No "Critical" badge — the HP bar communicates low HP

---

## 3. Documentation Sync (MANDATORY)

Before committing any UI change, run this audit:

1. **`doc/design/mockup.html`** — does the change differ from the mockup?
   Update the mockup first if the design changed, then the code.
2. **The domain file for what you changed** — does it need a new section
   or an update? (see table in Section 1)
3. **`doc/design/README.md`** — does the file index need updating?
4. **`AGENTS.md`** Section 4 — did you add a new token, pattern, or rule?
5. **`README.md`** Sections 2 and 6 — did you change what users see?
6. **Grep for banned terms** across `doc/`, `docs/`, and `specs/`:
   `glassmorphism`, `light theme`, `read-only mode`, `onEditStat`, `backdrop blur`
   Fix any stale references.

If you find the same documentation issue twice in one session, update
this section of the skill to prevent it happening a third time.

---

## 4. Decision Log

When a design decision involves a trade-off or departure from convention,
add an entry to `doc/design/decisions/`. Use the existing `001-tactical-redesign.md`
as a template (Context → Decision → Consequences → References).
