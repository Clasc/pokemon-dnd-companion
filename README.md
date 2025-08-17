# Pokémon & D&D Companion App

A mobile‑first Single Page Application (SPA) that helps players manage a hybrid Dungeons & Dragons + Pokémon tabletop experience. It streamlines trainer creation, Pokémon team tracking, stats, health, experience, and status conditions—all persisted locally in the browser for fast, offline-friendly play. The current implementation is intentionally player-focused (not a DM tool yet).

---

## Table of Contents
1. Overview
2. Core Features
3. Tech Stack
4. Application Architecture
5. State & Data Model
6. UI / UX & Design System
7. Performance Characteristics
8. Project Structure
9. Getting Started
10. Development Scripts
11. Roadmap / Future Scope
12. Contributing
13. License / Usage

---

## 1. Overview

This project provides an intuitive dashboard to:
- Create and manage a single Trainer profile
- Build and maintain a Pokémon team (up to 6)
- Track dual typing, attributes, HP, XP, levels, and status effects
- Persist progress automatically with no signup required

It is optimized for touch devices (phones & tablets) while remaining usable on desktop.

---

## 2. Core Features (Current Implementation)

### Trainer Management
- Editable trainer name, level, class
- Full D&D attribute block (STR / DEX / CON / INT / WIS / CHA)
- HP tracking with visual bar + interactive +/- adjustments
- Onboarding flow that enforces initial trainer creation
- Modal editing with validation

### Pokémon Team
- Team roster (up to 6 slots) with empty-state guidance
- Quick team aggregate stats (total levels, total HP, average health)
- Creation modal with comprehensive fields
- Edit & delete actions with confirmation

### Individual Pokémon Profiles
- Species + nickname
- Dual-type system (18 types)
- Level (1–100) with XP tracking & progress visualization
- Current / Max HP with bar animations
- Status conditions (with duration tracking)
- D&D-style attribute chips
- Type badges with emoji-based iconography
- Smooth animated progress bars

### Editing Experience
- Full-screen advanced editing modal
- Real-time preview of changes before save
- Validation & controlled inputs
- Cancel / Save flows with safe exit

### UI / UX
- Dark / Light theme with system preference detection
- Glassmorphism: backdrop blur, layered translucency
- Responsive grid layouts for mobile → tablet → desktop
- Touch-friendly controls and accessible semantics
- Consistent theming via CSS variables + Tailwind utility layering

### Data & Persistence
- Local storage persistence (no external backend)
- UUID identifiers for Pokémon
- Type-safe TypeScript models
- Optimistic UI updates for smooth feedback

---

## 3. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router, SPA usage) |
| Language | TypeScript |
| UI | React + Tailwind CSS + custom CSS variables |
| State | Zustand (with persistence middleware) |
| Persistence | Browser localStorage |
| Icons / Type Labels | Emoji-based system |
| Styling Patterns | Glassmorphism, responsive utilities |

---

## 4. Application Architecture

- **App Directory**: Next.js 14+ App Router structure
- **Componentization**: Feature-scoped directories (e.g. `AddPokemonModal/`)
- **Reusable Primitives**: Shared UI components under `components/Shared`
- **Hooks**: Custom hooks abstract state selection and transformations
- **Modals**: Compound component pattern for accessibility and layering
- **Utilities**: Formatting, calculations, derived stats in `utils/`
- **Types**: Centralized TypeScript declarations in `types/`

Design patterns emphasize:
- Separation of state shape from presentation
- Selector-based Zustand consumption to minimize re-renders
- Declarative, prop-driven visual components

---

## 5. State & Data Model

Persistence Layer:
- Single serialized Zustand store written to `localStorage`
- Automatic hydration on app load
- No cross-device sync (yet)

---

## 6. UI / UX & Design System

Highlights:
- Transition + animation focus on subtle feedback (progress bars, hover states)
- Glassmorphism surfaces (frosted panels)
- Responsive breakpoints:
  - Mobile: ≥ 320px
  - Tablet: ≥ 768px
  - Desktop: ≥ 1024px
- Accessibility:
  - Clickable cards with proper focus outlines
  - Keyboard-safe modals (intended pattern)
  - Semantic structuring where applicable

---

## 7. Performance Characteristics

- Fully client-side after initial load (SPA behavior)
- Lightweight state updates with shallow selectors
- Tree-shaken Next.js build artifacts
- No network latency for core interactions (local-only)
- CSS-driven animations (GPU-friendly where possible)

---

## 8. Project Structure (Simplified)

```
src/
  app/                 # Next.js app directory (entry/UI shells)
  components/
    AddPokemonModal/   # Pokémon creation & editing workflow
    Shared/            # Reusable generic components
    ...                # Other feature-focused components
  store/               # Zustand store(s) + persistence setup
  types/               # TypeScript definitions & enums
  utils/               # Helpers, calculators, formatters
doc/
  project.md           # Full product specification (source of this README)
```

---

## 9. Getting Started

Install dependencies (choose one):
```
npm install
yarn install
pnpm install
bun install
```

Run development server:
```
npm run dev
```

Open:
http://localhost:3000

Edit the landing experience in:
`app/page.tsx`

---

## 10. Development Scripts (Standard Next.js Defaults)

```
dev     - Start development server
build   - Create production build
start   - Run production build locally
lint    - Lint source (if configured)
```

(If a particular script is missing in `package.json`, add it as needed before use.)

---

## 11. Roadmap / Future Scope (Not Yet Implemented)

Planned / Envisioned Enhancements:
- Attack management
- Inventory tracking
- Status condition management (detailed effects)
- Trainer / Pokémon leveling system
- Pokémon evolution mechanics
- Cloud sync / user accounts
- Backend API integration
- Game Master (DM) tooling
- Pokémon images / sprite assets

These are intentionally deferred to keep scope lean and focused on core player stat tracking.

---

## 12. Contributing

Currently scoped to internal / exploratory development. If you intend to contribute:
1. Review `doc/project.md` for context
2. Keep types strict and extend thoughtfully
3. Favor small, composable components
4. Maintain accessibility for any new interactive element
5. Avoid introducing a backend unless aligning with roadmap discussions

You can propose changes by:
- Opening an issue describing enhancement / fix
- Submitting a PR with clear commit messages

---

Enjoy faster tabletop sessions with streamlined Pokémon + D&D hybrid tracking!
