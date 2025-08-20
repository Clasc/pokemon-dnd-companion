# Pokémon & D&D Companion App

A mobile‑first Single Page Application (SPA) that helps players manage a hybrid Dungeons & Dragons + Pokémon tabletop experience. It streamlines trainer creation, Pokémon team tracking, stats, health, experience, and status conditions—all persisted locally in the browser for fast, offline-friendly play. The current implementation is intentionally player-focused (not a DM tool yet).

---

## Table of Contents
1. [Overview](#1-overview)
2. [Core Features](#2-core-features-current-implementation)
3. [Tech Stack](#3-tech-stack)
4. [Application Architecture](#4-application-architecture)
5. [State & Data Model](#5-state--data-model)
6. [UI / UX & Design System](#6-ui--ux--design-system)
7. [Performance Characteristics](#7-performance-characteristics)
8. [Project Structure](#8-project-structure)
9. [Naming Conventions](#9-naming-conventions)
10. [Testing](#10-testing)
11. [Getting Started](#11-getting-started)
12. [Development Scripts](#12-development-scripts)
13. [Roadmap / Future Scope](#13-roadmap--future-scope)
14. [Contributing](#14-contributing)
15. [License / Usage](#15-license--usage)

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
| Testing | Jest + @testing-library/react |
| Persistence | Browser localStorage |
| Icons / Type Labels | Emoji-based system |
| Styling Patterns | Glassmorphism, responsive utilities |

---

## 4. Application Architecture

- **App Directory**: Next.js 14+ App Router structure
- **Feature-based Organization**: Components and logic related to specific features (e.g., `pokemon`, `trainer`) are grouped together within the `src/features` directory
- **Shared Components**: Reusable UI components that are not specific to any single feature are placed in the `src/components/shared` directory
- **Hooks**: Custom hooks abstract state selection and transformations
- **Modals**: Compound component pattern for accessibility and layering
- **Utilities**: Formatting, calculations, derived stats in `utils/`
- **Types**: Centralized TypeScript declarations in `types/`

Design patterns emphasize:
- Separation of state shape from presentation
- Selector-based Zustand consumption to minimize re-renders
- Declarative, prop-driven visual components
- Modular and organized codebase for improved maintainability and scalability

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

## 8. Project Structure

The project follows a feature-based organization approach for better maintainability and scalability:

```
pokemon-dnd-companion/
├── src/
│   ├── app/                    # Next.js app directory (entry/UI shells)
│   ├── components/
│   │   └── shared/             # Reusable UI components (not feature-specific)
│   ├── features/               # Feature-based organization
│   │   ├── pokemon/            # Pokemon-related components and logic
│   │   └── trainer/            # Trainer-related components and logic
│   ├── store/                  # Zustand store(s) + persistence setup
│   ├── types/                  # TypeScript definitions & enums
│   ├── utils/                  # Helpers, calculators, formatters
│   ├── tests/                  # Test utilities and documentation
│   └── fixtures/               # Test data and mock objects
├── doc/                        # Project documentation
├── docs/                       # Additional documentation
├── coverage/                   # Test coverage reports
├── jest.config.ts              # Jest configuration
├── jest.setup.ts               # Jest setup file
├── GEMINI.md                   # AI agent instructions
└── package.json                # Project dependencies and scripts
```

### Component Structure

Each component follows a consistent directory structure:

```
Component/
├── index.tsx                   # Main component file
└── index.test.tsx             # Component tests (sibling to main file)
```

This structure keeps tests close to the components they test and allows for cleaner imports.

---

## 9. Naming Conventions

### File and Directory Naming
- **Components**: Use PascalCase for component directories and files
- **Main Files**: Component main files are named `index.tsx` for cleaner imports
- **Test Files**: Named `index.test.tsx` and located in the same directory as the component
- **Utilities**: Use camelCase for utility files
- **Types**: Use PascalCase for type definition files

### Component Conventions
- Keep components small and focused on a single responsibility
- If a component requires comments to explain its purpose, consider refactoring into smaller sub-components
- Use descriptive names that clearly indicate the component's purpose
- Follow React naming conventions for props and state

### Import/Export Patterns
- Use default exports for components
- Use named exports for utilities and types
- Import paths should start with the appropriate root directory (e.g., `src/features/pokemon/...`)

---

## 10. Testing

### Testing Philosophy
- **Integration over Unit Testing**: Prefer integration tests that test components with their actual dependencies
- **User-Centric Testing**: Focus on user interactions and behaviors rather than implementation details
- **Accessibility First**: All tests include accessibility checks using semantic queries
- **Real State Management**: Test with actual Zustand stores to ensure state management works correctly

### Testing Standards
- All new features and modifications must be accompanied by tests
- Tests should cover both functionality and edge cases
- Use Jest for unit and integration tests
- **Never mock Zustand stores** - use actual stores for realistic testing
- **Avoid snapshot tests** - write tests that check actual behavior
- Ensure all tests pass before committing changes

### DOM Querying Priorities
1. `getByRole` - Find elements by their role
2. `getByText` - Find elements by text content
3. `getByTestId` - Find elements by `data-testid` attribute
4. Use `queryByText` and `queryByRole` for assertions that may not find elements

### Running Tests
```bash
npm test                    # Run all tests once
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate test coverage report
```

---

## 11. Getting Started

### Prerequisites
- Node.js (version specified in `.nvmrc`)
- npm, yarn, pnpm, or bun

### Installation
Install dependencies (choose one):
```bash
npm install
yarn install
pnpm install
bun install
```

### Development
Run development server:
```bash
npm run dev
```

Open: http://localhost:3000

Edit the landing experience in: `app/page.tsx`

---

## 12. Development Scripts

```bash
dev             # Start development server
build           # Create production build
start           # Run production build locally
lint            # Lint source code
test            # Run test suite
test:watch      # Run tests in watch mode
test:coverage   # Generate test coverage report
```

---

## 13. Roadmap / Future Scope

### Immediate Priorities
- Enhanced testing coverage for all components
- Improved accessibility features
- Performance optimizations

### Planned Enhancements
- **Attack Management**: Pokémon move sets and battle mechanics
- **Inventory Tracking**: Items, potions, and equipment management
- **Enhanced Status Conditions**: Detailed effects and duration management
- **Leveling System**: Automated level progression and stat calculations
- **Evolution Mechanics**: Pokémon evolution triggers and management
- **Cloud Sync**: User accounts and cross-device synchronization
- **Backend Integration**: API-driven data management
- **Game Master Tools**: DM-focused features and campaign management
- **Visual Assets**: Pokémon sprites and enhanced imagery
- **Battle System**: Turn-based combat mechanics
- **Multiplayer Support**: Team coordination and shared campaigns

### Technical Improvements
- Progressive Web App (PWA) capabilities
- Offline-first architecture
- Enhanced responsive design
- Performance monitoring and optimization
- Automated testing pipeline
- Accessibility compliance (WCAG 2.1 AA)

These enhancements are intentionally deferred to maintain focus on core player stat tracking functionality.

---

## 14. Contributing

### Development Workflow
1. **Gather Requirements**: Understand feature needs and ask clarifying questions
2. **Create Implementation Plan**: Make a todo list and get confirmation before proceeding
3. **Implement Changes**: Follow project conventions and testing standards
4. **Manual Testing**: Ask for user verification that changes work as expected
5. **Add Tests**: Write comprehensive tests covering new functionality
6. **Run Test Suite**: Ensure all tests pass
7. **Commit Changes**: Use clear, descriptive commit messages

### Guidelines
- Review project documentation in `doc/` and `GEMINI.md`
- Keep TypeScript strict and extend thoughtfully
- Favor small, composable components
- Maintain accessibility for any new interactive elements
- Follow the established project structure and naming conventions
- Ensure all new features include comprehensive tests

### Proposing Changes
- Open an issue describing enhancement or fix
- Submit a PR with clear commit messages
- Include tests for all new functionality
- Update documentation as needed

---

## 15. License / Usage

Currently scoped to internal / exploratory development. 

---

Enjoy faster tabletop sessions with streamlined Pokémon + D&D hybrid tracking!