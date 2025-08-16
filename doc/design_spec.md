# Design Language for the Pokémon & D&D Companion App
This design language is based on the core concept of being simple yet dynamic, using gradients and blurs to create an aesthetic that is easy on the eyes. The app prioritizes mobile and tablet optimization and supports both a light and dark theme, with the dark theme as the default.

1. Visual Identity
Aesthetic Direction
The aesthetic blends the fantasy elements of Dungeons & Dragons with the vibrant energy of Pokémon. This is achieved through a mix of organic, flowing shapes and clean, structured layouts. The design should feel both magical and functional, like a well-organized spellbook.

Gradients: Use subtle, flowing gradients to add depth and visual interest. These shouldn't be overwhelming but rather a soft, atmospheric layer. A purple-to-blue gradient could be used for the background of a character page, while a red-to-orange gradient might appear in a health bar to signify low HP.

Blurs: Apply a frosted glass effect to pop-up menus, card backgrounds, and modals. This creates a sense of hierarchy and focus, making the content on top of the blur stand out.

Icons: Icons should be simple, clean, and symbolic rather than overly detailed. For example, a stylized sword for the "Attacks" section or a minimalist heart for HP.

Color Palette
The color palette is designed to be versatile for both light and dark themes while maintaining the magical D&D and vibrant Pokémon feel.

Dark Theme (Default):

Primary Background: A deep, dark blue or purple-grey (e.g., #1E1A2C) that feels like a night sky.

Accent Colors: Vibrant, saturated colors for UI elements, HP bars, and active states. Use a palette of colors inspired by Pokémon types, such as a fiery red (#E84B5B), a lightning-bolt yellow (#F9C51D), or a forest green (#5DB079).

Text & UI: A soft white (#F0F0F0) for primary text to ensure readability against the dark background. Lighter greys (#A0A0A0) for secondary information.

Light Theme:

Primary Background: A soft, off-white or light gray (#F5F5F7).

Accent Colors: The same vibrant accent colors from the dark theme, but slightly desaturated to be less jarring on a light background.

Text & UI: A deep charcoal gray (#333333) for primary text and a lighter gray for secondary information.

2. Typography & Layout
Typography
The font choice should balance readability with a hint of fantasy.

Main Font: A clean, modern sans-serif font like Poppins or Inter for all primary text, input fields, and labels. Its legibility is crucial for displaying game data.

Headers: A slightly more stylized, yet still readable, font like Oswald or Roboto Condensed for section titles and headers to give a nod to the fantasy genre without compromising clarity.

Layout & Structure
The layout is designed for easy, single-handed use on mobile devices and a clear overview on tablets.

Tabs/Sections: The main view is split into two clear, switchable sections: Trainer Overview and Pokémon Overview. On a tablet, these could be presented side-by-side.

Cards: All Trainer and Pokémon information should be contained within distinct, rounded "cards" with a slight drop shadow or blur effect. This visually separates information and makes it easy to scan.

Read-Only Mode: To prevent accidental changes, all fields are read-only by default. They should have a subtle, non-interactive visual style (e.g., a simple text display).

Edit Mode: Toggling the "Edit" button transforms the read-only displays into active input fields, each with a clear, focusable state (e.g., a glowing border). This transition should be smooth and immediate.

3. Interactive Elements
Buttons
Primary Actions: Main call-to-action buttons (e.g., "Edit," "Save") should be vibrant, solid-colored buttons with a subtle hover or press effect.

HP Adjustment: The "+" and "-" buttons for HP should be small, circular, and simple. The color of the button should reflect its function (e.g., green for "+" and red for "-").

Progress Bars
HP Bar: The HP bar for Pokémon should be a visual representation of the current health. It should have a gradient fill that changes color as HP decreases (e.g., full green, then yellow, then red as HP gets low). The bar should have a clear, rounded container to show the maximum HP.

XP Bar: The XP bar should be a simple, solid-colored bar (e.g., a vibrant green or blue) that fills up to show progress towards the next level. This should be a linear visual that fills smoothly.

Transitions
Transitions between screens should be fluid and not distract from the user's task. A simple slide-in or fade-in effect when a new view opens or a card expands is sufficient.

This design language creates a user experience that is both visually appealing and highly functional, perfectly suited for the needs of a D&D and Pokémon player. It provides a clean, clear way to manage stats, allowing players to stay focused on the game, not on the app.

## 4. Responsive Breakpoints & Device Targeting

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
