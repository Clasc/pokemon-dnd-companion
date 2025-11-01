## Product Specification: Pokémon & D&D Companion App (Current Implementation)

### 1. Introduction

This specification describes the current implementation of a **Single Page Application (SPA)** designed as a companion app for a homebrewed version of Dungeons & Dragons with Pokémon elements. The app is primarily for players and aims to simplify character and Pokémon management on mobile devices and tablets.

---

### 2. Target Audience

The primary user is a **player** in a campaign. The Game Master (DM) is not the main target audience. The app supports the flow of the game by providing an intuitive interface for character and Pokémon management.

---

### 3. Technical Implementation

* **Type:** Single Page Application (SPA) built with Next.js
* **Platform:** Optimized for mobile browsers (iOS/Android) and tablets with responsive design
* **Technology Stack:**
    * **Frontend:** Next.js 14+ with React, TypeScript
    * **Styling:** Custom CSS with CSS Variables, Tailwind CSS integration
    * **State Management:** Zustand with persistence middleware
    * **Data Persistence:** Local storage (localStorage) with automatic state persistence
    * **Icons:** Custom emoji-based icon system for Pokémon types

---

### 4. Current Features

#### 4.1. Trainer Management

**Trainer Overview Card:**
* Display and edit trainer name, level, and class
* Full D&D attribute system (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma)
* Hit Points management with visual HP bar
* Interactive HP adjustment with +/- controls
* Glassmorphism design with hover effects
* Click-to-edit functionality with modal overlay

**Trainer Creation Flow:**
* Initial onboarding form for new users
* Required trainer setup before accessing main features
* Persistent storage of trainer data

#### 4.2. Pokémon Team Management

**Pokémon Overview:**
* Team roster display (up to 6 Pokémon)
* Real-time team statistics (total levels, total HP, average health)
* Add new Pokémon with comprehensive creation modal
* Empty state with encouraging messaging

**Individual Pokémon Cards:**
* Compact card layout with essential information
* Pokémon species, nickname, and level
* Dual-type system with color-coded type badges
* HP and XP progress bars with smooth animations
* Status condition indicators
* D&D attribute chips display
* Quick action buttons (edit, delete)

#### 4.3. Pokémon Details & Editing

**Comprehensive Pokémon Profiles:**
* Species and nickname fields
* Dual Pokémon type system (18 types available)
* Level management (1-100)
* HP system with current/max values and visual feedback
* Experience point tracking with progress visualization
* Full D&D attribute system
* Status condition system with duration tracking
* Type-based emoji icons for visual identification


**Route-Based Edit Page:**
* Dedicated /pokemon/[uuid]/edit page
* Full form parity with creation page
* Validation and error handling
* Integrated delete (danger zone)
* Explicit Back/Cancel navigation


#### 4.4. User Interface & Experience

**Design System:**
* Dark/light theme support with system preference detection
* Glassmorphism effects with backdrop blur
* Responsive grid layouts for different screen sizes
* Custom CSS variables for consistent theming
* Smooth animations and transitions
* Mobile-first responsive design


**Navigation & Interaction:**

* Route-based add & edit pages (replaces legacy modals)
* Confirmation dialogs for destructive actions

* Intuitive touch-friendly controls

* Keyboard accessibility


#### 4.5. Data Management

**State Management:**
* Zustand store with persistence
* Automatic local storage synchronization
* Optimistic updates for smooth UX
* Type-safe state management with TypeScript

**Data Structure:**
* UUID-based Pokémon identification
* Comprehensive type definitions
* Normalized data storage

---

### 5. User Workflow


1. **First Visit:** User is prompted to create trainer profile

2. **Main Dashboard:** Two-panel layout showing trainer and Pokémon overview

3. **Trainer Editing:** Click trainer card to open editing modal

4. **Pokémon Management:**
   - Add new Pokémon via `/pokemon/new` route (replaces legacy creation modal)
   - Edit existing Pokémon via `/pokemon/[uuid]/edit` (action menu navigates instead of opening a modal)
   - Delete Pokémon via the delete (danger) section on the edit page (inline two‑step confirmation)
5. **Data Persistence:** All changes automatically saved to local storage


---

### 6. Current Status vs Original MVP


* ✅ Full dual-type Pokémon system

* ✅ Status condition tracking with duration

* ✅ Advanced UI with glassmorphism design

* ✅ Comprehensive responsive design

* ✅ Type-safe TypeScript implementation

* ✅ Sophisticated state management

* ✅ Visual progress indicators and animations

* ✅ Emoji-based type icon system

* ✅ Team statistics and analytics

* ✅ Route-based add & edit Pokémon pages (legacy modals removed)


**Not Yet Implemented (Future Scope):**
* Attack/move management system
* Combat simulation or dice-rolling interface
* Game Master (DM) functionalities
* Backend synchronization
* User accounts and cloud storage
* Pokémon images/sprites
* Special abilities beyond basic stats

---

### 7. Technical Architecture


```
src/
├── app/                     # Next.js app directory (route-based add/edit flows)

├── components/              # React components (shared/global)

│   ├── Shared/              # Reusable components

│   └── ...                  # Other shared components
├── features/
│   └── pokemon/             # Pokémon feature (cards, forms, overview)
├── store/                   # Zustand state management

├── types/                   # TypeScript type definitions

└── utils/                   # Utility functions

```


**Key Design Patterns:**
* Custom hooks for state management
* Responsive CSS with container queries
* Accessibility-first interactive elements

---

### 8. Performance & Optimization

* Client-side rendering with Next.js
* Efficient re-rendering with Zustand selectors
* CSS-based animations for smooth performance
* Optimized bundle size with tree shaking
* Local storage for instant data access

---

### 9. Browser Support

* Modern mobile browsers (iOS Safari, Chrome Android)
* Progressive enhancement for older browsers
* Touch-optimized interface
* Responsive breakpoints: mobile (320px+), tablet (768px+), desktop (1024px+)