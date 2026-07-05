---
name: design-guardian
description: |
  Use this skill whenever making UI changes, editing components, adding new
  visual elements, choosing colors, styling cards, creating sheets/modals,
  or modifying any file under src/features/ or src/app/. Also use when
  the user mentions design, styling, CSS, colors, layout, typography,
  mockup, or asks to review UI. This skill enforces the project's design
  system and prevents drift from the canonical mockup.
---

# Design Guardian

Enforces the Pokémon D&D Companion design system. Every UI change must align
with the canonical mockup (`mockup-4-final.html`) and the documented patterns
in `doc/design_spec.md` Section 5 and `AGENTS.md` Section 4.

---

## 1. Canonical Reference

**Everything starts from `mockup-4-final.html`.** This file is the single
source of truth for layout, spacing, typography, interaction model, color
usage, and visual states. Before any UI change:

- Open `mockup-4-final.html` and check how the relevant element is designed
- Match the mockup's structure, not just its colors
- If the mockup doesn't cover the change, propose adding it to the mockup first

**Key design docs** (read when uncertain):
- `doc/design_spec.md` Section 5 — Tactical Dashboard Design
- `AGENTS.md` Section 4 — Design System (color tokens, typography, HP tiers, sheet patterns)
- `docs/color-migration-guide.md` — maps hardcoded colors to Tailwind utilities

---

## 2. Color Rules

### NEVER hardcode colors. Always use design tokens.

| Hardcoded | Replacement |
|-----------|-------------|
| `#1a1a1a`, `#18181b` | `bg-primary` or `var(--color-bg)` |
| `#222222`, `#27272a` | `bg-surface` or `var(--color-surface)` |
| `#EE5D20` | `bg-interactive`, `ring-interactive`, `border-interactive` |
| `#f0f0f0` | `text-primary` |
| `#a0a0a0` | `text-secondary` |
| `#3B82F6` | `var(--color-accent)` (XP bar ONLY) |

### Semantic colors (Pokémon-specific — these are the exception)

| Purpose | Source | Example |
|---------|--------|---------|
| Pokémon types | `TYPE_COLORS` from `@/types/pokemon` | `TYPE_COLORS.fire` → `#F08030` |
| Status conditions | `STATUS_COLORS` from `@/types/pokemon` | `STATUS_COLORS.poisoned` → `#8E44AD` |
| HP bar fill | Dynamic green/yellow/red (see Section 5) | `#22c55e` / `#eab308` / `#ef4444` |

### Tailwind utilities (preferred)
```tsx
className="bg-surface"         // cards, inputs
className="bg-interactive"     // primary buttons
className="text-primary"       // main text
className="text-secondary"     // muted text, labels
className="focus:ring-interactive" // focus rings
```

DO NOT use `bg-[#222222]`, `text-[#f0f0f0]`, or any other hardcoded hex in
Tailwind classes. If a color has no utility, use `style={{ color: "var(--color-xxx)" }}`
or propose adding a `@utility` in `globals.css`.

### HP bar color tiers
```tsx
function getHPBarColor(currentHP: number, maxHP: number): string {
  const pct = maxHP > 0 ? currentHP / maxHP : 0;
  if (currentHP === 0) return "#3f3f46";  // fainted
  if (pct < 0.25) return "#ef4444";       // red
  if (pct < 0.5) return "#eab308";        // yellow
  return "#22c55e";                        // green
}
```

---

## 3. Typography Rules

| Context | Font | How |
|---------|------|-----|
| Dashboard cards (Pokémon, trainer strip) | `'Courier New', monospace` | `style={{ fontFamily: "'Courier New', monospace" }}` |
| Page headings, nav, modals | System sans-serif (`Poppins`, `Inter`) | Default (inherited from body) |

The monospace font is what gives the dashboard its tactical tabletop feel.
Every element on a Pokémon card or trainer strip cell must use it.
The page chrome (headings, navigation, modal titles) stays sans-serif.

---

## 4. Status Condition Rules

### Only use valid status conditions
The valid statuses are defined in `STATUS_COLORS` in `@/types/pokemon`:
`burned`, `frozen`, `paralyzed`, `poisoned`, `badly-poisoned`, `asleep`,
`confused`, `flinching`, `fainted`, `none`.

**NEVER invent status labels** like "Ready", "Critical", "Healthy", "OK".
These are derived states, not Pokémon status conditions.

### Status display rules
- **No condition**: Show a dim "● Status" placeholder (dot + label in `text-secondary`).
  This must always be visible as a tap target.
- **Has condition**: Colored dot (from `STATUS_COLORS`) + condition name (capitalized).
  e.g. "● Poisoned", "● Burned", "● Asleep"
- **Confused**: A secondary smaller "● Conf" badge alongside the primary status.
  Confusion coexists with primary conditions.
- **Fainted**: "● Fainted" badge. Grayscale sprite (`filter: grayscale(100%)`),
  strikethrough name, empty HP bar, ALL attacks disabled.

### Team status dots (trainer strip)
Six dots representing party slots. Color = the Pokémon's actual status condition
color from `STATUS_COLORS`. Green (`#22c55e`) when no condition. Grey (`#3f3f46`)
when slot is empty. Do not use red for "low HP" — HP state is not a status condition.

---

## 5. Interaction Model

### Dashboard card tap targets (each independent — no overlapping zones)

| What | Action | Opens |
|------|--------|-------|
| Card header row (chevron `>`) | tap | `PokemonExpandedModal` |
| HP bar | tap | `StatAdjustSheet` |
| XP underline (under level) | tap | `StatAdjustSheet` |
| Status badge | tap | `QuickStatusDropdown` |
| Attack pill | tap | Decrements PP (inline) |
| Attack pill | long-press / right-click | `AttackQuickEditSheet` (PP+/-, Replace) |
| + Add slot | tap | `AddAttackModal` |
| Trainer header | tap | `TrainerSheet` |
| Trainer HP cell | tap | Trainer HP quick adjust sheet |
| Trainer Pokédollars cell | tap | Inline number input sheet |
| Trainer Items cell | tap | Navigates to `/trainer` (inventory) |
| Trainer attributes row | tap | `TrainerSheet` |

### Never disable card interactions
The old `onEditStat` toggle pattern (disabling card click when stat editing
is active) is deprecated. Every interaction point works independently.
Header tap always opens the expanded modal. HP tap always opens
StatAdjustSheet. They don't block each other.

### Editing always in sheets, never page navigation
During a session, the user stays on the dashboard. All editing happens in
`BottomSheet` (mobile) or `BaseModal` (desktop). Never `router.push()` to
another page for an edit during play.

---

## 6. Pokémon Card Structure

Every card must follow this exact vertical order:

```
┌─────────────────────────────────┐
│ [sprite] Name  Lv ██▒▒░░░░ > │  ← Header (tap → expanded)
│ [Water] [Fire]                 │  ← Type text (colored, no pills)
├─────────────────────────────────┤
│ ● Status  ● Conf               │  ← Status row (always visible)
├─────────────────────────────────┤
│ HP ████████████████ 100/100    │  ← HP bar (tap → StatAdjustSheet)
├─────────────────────────────────┤
│ 🛡️18  STR12 DEX14 CON16 ...    │  ← AC + attributes row
├─────────────────────────────────┤
│ [Hydro Pump]  [Bite    ]       │  ← 2×2 attack grid
│ [Protect   ]  [+ Add   ]       │
└─────────────────────────────────┘
```

### Fainted card variant
- Opacity: slightly dimmed (`opacity-60`)
- Sprite: `filter: grayscale(100%)`
- Name: `text-decoration: line-through`, color `#a0a0a0`
- HP bar: empty (`width: 0%`), color `#3f3f46`
- HP label/numbers: `#71717a`
- Attacks: ALL disabled with `opacity-40 cursor-not-allowed`
- + Add slots: disabled
- Chevron: STILL visible (must be expandable to heal/revive)

### Low HP card variant
- Card border changes to red when HP < 25%
- HP label becomes bold, colored red
- HP bar pulses (animate-pulse)
- No "Critical" badge — the bar communicates the state

---

## 7. Documentation Rules

**Documentation is part of the change, not an afterthought.** Every UI
change that affects layout, interaction, visual state, or component
structure must update the docs. The skill must proactively check and
sync docs before considering work complete.

### Before Starting Any UI Change
1. Read `mockup-4-final.html` — confirm the change aligns with the mockup
2. Read `doc/design_spec.md` Section 5 — confirm no conflicts with documented patterns
3. Scan `AGENTS.md` Section 4 — confirm design tokens and rules are followed
4. If the change modifies an existing component, search `doc/`, `docs/`, and `specs/`
   for any references to that component that may need updating

### After Finishing Any UI Change (MANDATORY)
Run this audit before committing:
1. **Check `doc/design_spec.md`** — does the change introduce a new pattern?
   Add it to Section 5. Does it remove an old pattern? Delete or mark historical.
2. **Check `mockup-4-final.html`** — does the implemented change differ from
   the mockup? If so, update the mockup first, then the code. The mockup is
   always the source of truth.
3. **Check `AGENTS.md`** — did the change introduce a new design token, color
   rule, or interaction pattern? Add a note to Section 4.
4. **Check `README.md`** — does the change affect what the app looks like or
   how users interact with it? Update Section 6 (UI/UX) and Section 2 (Core Features).
5. **Check `doc/project.md`** — does the feature list or design section need updating?
6. **Check all specs in `specs/`** — do any specs reference old patterns
   (glassmorphism, light theme, read-only mode, onEditStat)? Fix them.
7. **Check `docs/color-migration-guide.md`** — did the change touch any files
   listed in the migration guide? Update the status.

### Red Flag Terms (must never appear in docs or comments)
- "glassmorphism", "frosted glass", "backdrop blur" as aesthetic direction
- "light theme" or "light mode" (only dark theme)
- "read-only mode" as the primary editing pattern
- Descriptions of old card layouts (HP/XP pills, separate overview heading)
- "onEditStat" as a prop name or interaction pattern (deprecated)

### Doc Path Reference
Use this quick list to know which files to check:
```
mockup-4-final.html            ← Canonical visual spec (update FIRST)
doc/design_spec.md             ← Design language (Section 5 = current)
doc/project.md                 ← Project features & design section
README.md                      ← User-facing overview (Section 2, 6)
AGENTS.md                      ← Agent instructions (Section 4 = design)
specs/plan-*.md                ← Feature specs (check for stale patterns)
docs/color-migration-guide.md  ← Color token migration status
```

### Conflict Signal
If you find yourself fixing the same kind of documentation issue twice,
update this section of the skill with a new rule or check so it doesn't
happen a third time.

---

## 8. Pre-Commit Checklist (Design)

Before committing any UI change, verify:

### Code Quality
- [ ] No hardcoded colors — all colors use design tokens or semantic constants
- [ ] Status labels use only valid `STATUS_COLORS` conditions
- [ ] Monospace font on all dashboard card elements
- [ ] HP bar uses correct tier colors (green/yellow/red)
- [ ] Status badge always visible (even when "none")
- [ ] Fainted Pokémon get full visual treatment (grayscale, strikethrough, disabled)
- [ ] All interactive elements have independent tap targets

### Mockup Sync
- [ ] `mockup-4-final.html` updated if the change affects layout
- [ ] Implementation matches mockup exactly (same structure, same states)

### Documentation Audit (MANDATORY — see Section 7)
- [ ] `doc/design_spec.md` — new patterns added, old patterns removed
- [ ] `AGENTS.md` — new tokens/rules documented
- [ ] `README.md` — user-facing changes reflected in Sections 2 and 6
- [ ] `doc/project.md` — feature list checked
- [ ] `specs/` — no stale pattern references (glassmorphism, read-only, onEditStat)
- [ ] `docs/color-migration-guide.md` — migration status updated

### Final Checks
- [ ] `npm run lint` passes
- [ ] `npm test` passes

---

## 9. Adding New Components

When creating a new component, check these existing patterns before writing:

### Modals / Sheets
- Use `BottomSheet` for mobile, `BaseModal` for desktop
- Reference: `src/components/shared/ui/BottomSheet/index.tsx`
- Example: `AttackQuickEditSheet` (PP editing), `TrainerSheet` (trainer edit)

### Status displays
- Reference: `src/features/pokemon/components/StatusIndicator/index.tsx`
- Reference: `src/features/pokemon/components/QuickStatusDropdown/index.tsx`

### HP/XP bars
- Reference: `src/components/shared/ui/InteractiveProgress/index.tsx`
- Reference: `src/features/pokemon/components/StatAdjustSheet/index.tsx`

### Store actions
- All mutations go through `src/store/index.ts`
- Follow existing patterns: `modifyAttackPP`, `modifyPokemonHP`, `gainExperience`

### Component structure
```
ComponentName/
  index.tsx        # Main component
  index.test.tsx   # Tests
```
Use `@/` import alias. Keep components under 200 lines.
