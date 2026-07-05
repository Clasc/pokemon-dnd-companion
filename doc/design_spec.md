# Design Language for the Pokémon & D&D Companion App
This design language prioritizes mobile-first, data-dense layouts optimized for in-session tabletop play. The app uses a dark theme by default with zinc-toned surfaces, orange interactive accents, and monospace typography for tactical cards.

> **Current design reference**: `mockup-4-final.html` at the project root is the canonical visual reference for all design decisions. The dashboard implements a tactical monospace aesthetic with zinc-tone surfaces, amber/orange interactive accents, and dense information layouts optimized for in-session use.

## 5. Tactical Dashboard Design (Current)

The Session Dashboard (`/dashboard`) is the primary in-game interface. It follows a tactical, data-dense mobile-first design optimized for quick actions during tabletop play.

### Design Principles
- **Glance, don't read**: All critical information (HP, status, attacks, XP) visible at zero taps
- **Tap target separation**: Every data point has its own action — no overlapping touch zones
- **Consistent sheet pattern**: All editing happens in BottomSheets; no page transitions during play
- **Progressive disclosure**: Summary on cards, full details behind header tap

### Layout
```
┌──────────────────────────┐
│ TRAINER STRIP            │  Name, class, level, team status dots
│ HP / ₽okédollars / Items │  Each cell tappable independently
│ STR DEX CON INT WIS CHA  │  Attributes row tappable
├──────────────────────────┤
│ Roster          4/6      │  Section header with count
├──────────────────────────┤
│ Pokémon Card             │
│  [sprite] Name   Lv ▬▬  >│  Header → expanded modal
│  ● Status  ● Conf        │  Status row → QuickStatusDropdown
│  HP ██████████ 100/100   │  HP bar → StatAdjustSheet
│  🛡️18 STR11 DEX14 ...    │  Attributes row
│  [Attack] [Attack]       │  Tap = use PP, long-press = edit
│  [+ Add ] [+ Add ]       │  Tap = add attack
├──────────────────────────┤
│ ⋮ more cards             │
├──────────────────────────┤
│ + Add Unit               │
└──────────────────────────┘
```

### Interaction Model

| Target | Action |
|---|---|
| Card header row (chevron) | Opens `PokemonExpandedModal` |
| HP bar | Opens `StatAdjustSheet` |
| XP underline (under level) | Opens `StatAdjustSheet` |
| Status badge | Opens `QuickStatusDropdown` |
| Attack pill (tap) | Decrements PP |
| Attack pill (long-press/right-click) | Opens `AttackQuickEditSheet` (PP+/-, Replace) |
| + Add attack slot | Opens `AddAttackModal` |
| Trainer header row | Opens `TrainerSheet` |
| Trainer HP cell | Opens trainer HP quick adjust |
| Trainer ₽okédollars cell | Inline number input |
| Trainer Items cell | Opens inventory |
| Trainer attributes row | Opens `TrainerSheet` |

### Visual States

| State | Treatment |
|---|---|
| Healthy (no condition) | Gray "● Status" placeholder badge |
| Status condition | Colored dot + condition name (Poisoned, Burned, etc.) |
| Confused | Secondary smaller "● Conf" badge alongside primary |
| Low HP (<25%) | Red HP bar, red numbers, bold HP label |
| Medium HP (25-50%) | Yellow HP bar |
| High HP (>50%) | Green HP bar, green numbers |
| Fainted | Grayscale sprite, strikethrough name, empty HP bar, all attacks disabled, "● Fainted" badge |

### Typography
- **Card body**: `'Courier New', monospace` for the tactical tabletop feel
- **Page chrome**: System sans-serif (`Inter`, `Poppins` for headings) per existing conventions
- **Size hierarchy**: 10px labels, 11px attack names, 14px names, consistent spacing

### Color Palette (Current Implementation)
- Surfaces: zinc-toned via `--color-surface` (`#222222`), `--color-bg` (`#1a1a1a`)
- Interactive: `--color-interactive` (`#EE5D20`) for buttons and focus rings
- XP/Accent: `--color-accent` (`#3B82F6`) for XP bar and progress indicators
- Type colors: Pokemon type palette (`TYPE_COLORS`)
- Status colors: Status condition palette (`STATUS_COLORS`)
- HP bar: Dynamic green/yellow/red based on percentage thresholds

### Editing Pattern: BottomSheet
All in-session editing uses the `BottomSheet` pattern (mobile) with `BaseModal` fallback on desktop:
- `PokemonExpandedModal` — full Pokémon detail/edit
- `StatAdjustSheet` — HP drag + XP input
- `AttackQuickEditSheet` — PP ±/restore/replace
- `TrainerSheet` — full trainer profile edit
- `AddAttackModal` — attack creation form


## 4. Responsive Breakpoints & Device Targeting (Historical Reference)

> **Note**: Sections 1-4 are historical. The current design is documented in Section 5 above.

The app follows a mobile-first approach with carefully chosen breakpoints to optimize the experience across all gaming scenarios and devices.

### Breakpoint Strategy

**Mobile-First Philosophy**: Start with the smallest screen and enhance progressively, ensuring core functionality works everywhere while providing enhanced experiences on larger devices.

### Device Size Definitions

#### 📱 Mobile (320px - 767px)
**Target Devices:**
- iPhone SE (375×667), iPhone 12/13/14 (390×844)
- iPhone 12/13/14 Pro (393×852), iPhone 14 Plus (428×926)
- Samsung Galaxy S20 (360×800), Pixel 5 (393×851)
- Small Android phones (320×568 minimum)

**Design Characteristics:**
- Single column layout with full-width cards
- Touch-optimized controls (minimum 44px tap targets)
- Compact spacing (16px margins)
- Attribute grid: 1 column for maximum readability
- Font sizes: 14px base, 30px headers
- Button padding: 12px vertical, 20px horizontal

#### 📱 Large Mobile (480px - 767px)
**Target Devices:**
- iPhone 14 Pro Max (430×932)
- Large Android phones in portrait
- Small tablets in portrait mode

**Design Enhancements:**
- Attribute grid: 2 columns for better space utilization
- Slightly larger buttons and text for easier interaction
- Enhanced tap targets for gaming scenarios

#### 📊 Tablet (768px - 1023px)
**Target Devices:**
- iPad (768×1024), iPad Air (820×1180)
- iPad Pro 11" (834×1194)
- Android tablets (768×1024 to 1024×768)
- Small laptops and netbooks

**Layout Changes:**
- Enhanced spacing (24px margins)
- Attribute grid: 3 columns for optimal information density
- Larger touch targets (48px+) perfect for tabletop gaming
- Pokemon cards: 2 per row when space allows
- Font sizes: 16px base, 36px headers
- Button padding: 14px vertical, 24px horizontal

#### 💻 Desktop (1024px - 1439px)
**Target Devices:**
- Standard laptops (1366×768, 1440×900)
- Desktop monitors (1920×1080)
- iPad Pro 12.9" (1024×1366) in landscape

**Major Layout Shift:**
- Two-column grid: Trainer Overview | Pokemon Overview
- Attribute grid: Back to 1 column (optimized for sidebar)
- Edit controls span full width above columns
- Generous spacing (32px margins)
- Font sizes: 16px base, 40px headers
- Button padding: 16px vertical, 28px horizontal

#### 🖥️ Large Desktop (1440px+)
**Target Devices:**
- Large monitors (1920×1080+, 2560×1440)
- Ultrawide displays (3440×1440)
- 4K displays (3840×2160)

**Premium Experience:**
- Fixed-width columns (450px each) for optimal readability
- Centered layout with generous gaps (48px)
- Maximum visual hierarchy and breathing room
- Prevents content from becoming uncomfortably wide

### Gaming-Specific Considerations

#### Tabletop Gaming Scenarios
- **Tablet size (768px+)**: Perfect for sitting on the gaming table, visible to multiple players
- **Desktop mode**: Excellent for DM screens and character planning sessions
- **Large touch targets**: Sized for excitement, gloves, or quick interactions during combat

#### Session Use Cases
- **Mobile portrait**: Quick stat checks during gameplay
- **Mobile landscape**: Optimized for rapid HP/XP adjustments during combat
- **Tablet**: Primary gaming companion device
- **Desktop**: Pre-session planning and detailed character management

#### Accessibility in Gaming Contexts
- High contrast ratios for dimly lit gaming environments
- Large touch targets for precision under pressure
- Clear visual hierarchy for quick information scanning
- Smooth animations that don't distract from gameplay

### Responsive Component Behavior

#### Trainer Overview
- **Mobile**: Vertical attribute list for easy scanning
- **Tablet**: 3-column attribute grid for space efficiency
- **Desktop**: Returns to single column in sidebar layout

#### Pokemon Overview
- **Mobile**: Single column Pokemon cards, full detail visible
- **Tablet**: Option for 2-column grid when beneficial
- **Desktop**: Single column in dedicated sidebar

#### Navigation & Controls
- **All sizes**: Edit mode toggle remains prominent and accessible
- **Mobile**: Full-width buttons for easy tapping
- **Desktop**: Buttons sized appropriately for mouse interaction

This responsive strategy ensures the app works perfectly whether you're quickly checking stats on your phone during a session, managing your team on a tablet at the gaming table, planning your character build on a desktop, or streaming your session with a large monitor setup.
