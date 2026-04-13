---
title: Unified Modal System
version: 1.0
date_created: 2026-04-12
owner: Pokemon DnD Companion
status: done
tags: `design-system`, `ui`, `modal`
---

# Unified Modal System Specification

## Current State Analysis

The codebase has 6+ different modal/overlay implementations:

| Component | Pattern | Portal | Focus Trap | Animation |
|-----------|---------|--------|------------|-----------|
| ModalShell | Reusable shell | Yes | Yes | No |
| DeleteConfirmationModal | Uses ModalShell | Yes | Inherited | No |
| PokemonExpandedModal | Custom inline | No | No | No |
| AddAttackModal | Custom inline | No | No | No |
| StatusSelector | Custom inline | No | No | No |
| HPModifier/XPModifier | Uses ModalShell | Yes | Inherited | No |

**Problems identified:**
1. Inconsistent portal usage (some inline, some portal)
2. No animations on most modals
3. Incomplete accessibility (missing focus trap on some)
4. No standardized API pattern
5. Various z-index/backdrop implementations

## Proposed Solution

### 1. BaseModal Component (new)

```typescript
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  titleId?: string;
  descriptionId?: string;
  className?: string;
}
```

Features:
- React Portal at document.body
- Framer Motion animations (fade + scale)
- Focus trap with sentinel elements
- Body scroll lock
- Glass backdrop (`bg-black/60`, `backdrop-blur-sm`)
- 4 sizes: sm (24rem), md (36rem), lg (48rem), fullscreen

### 2. ConfirmationModal (refactored)

Wraps BaseModal for confirmation dialogs with:
- Title + message
- Confirm/Cancel buttons
- Danger variant for destructive actions
- Loading state

### 3. Migration Plan

1. Create BaseModal (based on existing ModalShell + framer-motion)
2. Refactor DeleteConfirmationModal to use BaseModal
3. Refactor PokemonExpandedModal to use BaseModal
4. Refactor AddAttackModal to use BaseModal
5. Refactor StatusSelector to use BaseModal
6. Refactor HPModifier/XPModifier to use BaseModal
7. Add tests

## Key Decisions Made

- **Scope**: Modals/dialogs only (not dropdowns/autocompletes)
- **Portal**: Always use portal for consistent z-index
- **API**: Controlled props (isOpen + onClose)
- **Migration**: Migrate everything at once
- **Animation**: Framer Motion
- **Backdrop**: Glass style (existing design language)
- **Sizes**: 4 variants (sm, md, lg, fullscreen)

## Files to Modify

1. Create: `src/components/shared/ui/BaseModal/index.tsx`
2. Create: `src/components/shared/ui/ConfirmationModal/index.tsx`
3. Refactor: `src/components/shared/DeleteConfirmationModal.tsx`
4. Refactor: `src/components/shared/ui/ModalShell/index.tsx` (may replace or enhance)
5. Refactor: `src/features/pokemon/components/PokemonExpandedModal/index.tsx`
6. Refactor: `src/features/pokemon/components/AddAttackModal/index.tsx`
7. Refactor: `src/features/pokemon/components/StatusSelector/index.tsx`
8. Refactor: `src/features/pokemon/components/HPModifier/index.tsx`
9. Refactor: `src/features/pokemon/components/XPModifier/index.tsx`