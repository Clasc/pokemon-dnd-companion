---
title: Dashboard Pokemon Card Redesign
version: 1.0
date_created: 2026-04-15
owner: Pokemon D&D Companion
status: done
tags: `design`, `dashboard`, `pokemon`, `cards`, `ui`
---

# Overview

Redesign the Pokemon cards on the dashboard to show less detail while making the Pokemon image the visual focal point. Add an expand-on-click feature to show full details in a fullscreen modal with animation.

## Current State

- PokemonCard shows extensive details inline: sprite, name, types, level, status, all 6 attributes (STR/DEX/CON/INT/WIS/CHA), HP bar, XP bar, attack list, and action buttons (edit/delete)
- All content is visible without interaction
- No way to expand to full-screen view

## Target State

### Dashboard View (Compact)

**Display:**
- Pokemon image (sprite) as the primary visual element - large and prominent
- Pokemon name
- Pokemon types (1-2 type badges)
- Level
- HP bar (compact)
- XP bar (compact)

**Not shown in dashboard view:**
- Attribute scores/modifiers
- Individual +/- buttons for HP/XP
- Attack list
- Edit/Delete buttons (available on expanded view only)

**Layout:**
- Grid of Pokemon cards, 2 columns on mobile, responsive to more columns on larger screens
- Cards stack vertically if content doesn't fit (flex-wrap)

### Expanded View (Fullscreen Modal)

**Trigger:** Click anywhere on the Pokemon card

**Animation:** 
- Card expands to fill the screen with a smooth scale/translate animation (200-300ms, ease-out)
- Backdrop fades in

**Display:**
- Large Pokemon image at top
- Pokemon name (large)
- Types and level
- Full HP bar with +/- buttons
- Full XP bar with +/- buttons
- Attack list with "Add Attack" / "Manage" functionality
- Status selector
- Edit button
- Delete button

**Close:** Click outside, click X button, or press Escape

## Implementation Plan

### 1. Create CompactCard component

Location: `src/features/pokemon/components/PokemonOverview/PokemonCompactCard.tsx`

Responsibilities:
- Display sprite prominently (largest element)
- Show name, types, level
- Compact HP and XP bars
- Handle click to trigger expansion

### 2. Modify PokemonOverview

- Replace `PokemonCard` with `PokemonCompactCard` in the grid
- Ensure responsive grid layout (flex-wrap with proper breakpoints)

### 3. Create PokemonExpandedModal component

Location: `src/features/pokemon/components/PokemonExpandedModal.tsx`

Responsibilities:
- Full-screen modal overlay
- Display all Pokemon details
- Animate in from card position
- Close on backdrop click, X button, or Escape

### 4. Add animation

- Use CSS transitions/transform for animations
- expand animation: scale from card to fullscreen
- Backdrop: fade in

### 5. Dependencies

No additional dependencies needed - use CSS animations

## Acceptance Criteria

1. Dashboard shows compact cards with: sprite, name, types, level, HP bar, XP bar
2. Sprite is the largest visual element on compact cards
3. Attributes, attacks, edit/delete buttons are NOT visible in dashboard view
4. Clicking a compact card opens fullscreen expanded view
5. Expanded view shows all details: HP controls, XP controls, attacks, status, edit, delete
6. Smooth animation between compact and expanded states
7. Expanded view closes on backdrop click, X button, or Escape
8. Responsive: works on mobile (375px), tablet, and desktop
9. Bug #001 (responsive layout) is addressed - cards fit screen width
