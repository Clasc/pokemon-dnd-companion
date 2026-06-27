---
title: Mobile-First Overlay Design Language
version: 1.0
date_created: 2026-06-27
owner: Pokemon DnD Companion
tags: design, mobile, ui, overlay, modal, bottom-sheet
status: done
---

# Mobile-First Overlay Design Language

## 1. Purpose & Scope

Formalize the BottomSheet + BaseModal responsive pattern as the standard overlay design language. All overlay (modal/dialog) components in the app should use `BottomSheet` on mobile (max-width: 767px) and `BaseModal` on desktop, via the `useMediaQuery` hook.

## 2. Definitions

- **BaseModal**: Centered dialog overlay for desktop (in `src/components/shared/ui/BaseModal/`)
- **BottomSheet**: Slide-up panel from bottom for mobile (in `src/components/shared/ui/BottomSheet/`)
- **useMediaQuery**: Hook returning `true` when viewport matches a query string (in `src/utils/useMediaQuery.ts`)
- **Overlay component**: Any component that presents a layer above the main content (modal, dialog, sheet)

## 3. Requirements

- **REQ-001**: All existing overlays must use the responsive pattern (BottomSheet on mobile, BaseModal on desktop)
- **REQ-002**: The `useMediaQuery("(max-width: 767px)")` hook determines which primitive to render
- **REQ-003**: Each overlay component keeps a single implementation — no separate mobile/desktop variants
- **REQ-004**: BottomSheet must include a drag handle, backdrop, and dismiss-on-overlay-click
- **REQ-005**: BaseModal must include backdrop, close-on-Escape, and focus trap (existing behavior)
- **REQ-006**: Migration must not break existing tests or add new lint warnings

## 4. Components to Migrate

| Component | File | Current Primitive | Priority |
|-----------|------|-------------------|----------|
| DeleteConfirmationModal | `src/components/shared/DeleteConfirmationModal.tsx` | BaseModal (hardcoded) | High (shared) |
| StatusSelector | `src/features/pokemon/components/StatusSelector/index.tsx` | BaseModal | High |
| AddAttackModal | `src/features/pokemon/components/AddAttackModal/index.tsx` | BaseModal | High |
| TrainerInventory add item | `src/features/trainer/components/TrainerInventory/index.tsx` | BaseModal (inline) | Medium |
| TrainerOverview edit trainer | `src/features/trainer/components/TrainerOverview/index.tsx` | BaseModal (inline) | Medium |
| AddPokemonModal | `src/features/pokemon/components/AddPokemonModal/index.tsx` | BaseModal | Low (replaced by AddPokemonBottomSheet) |

## 5. Migration Pattern

Each overlay component should:
1. Import `useMediaQuery` and `BottomSheet`
2. Use responsive flag: `const isMobile = useMediaQuery("(max-width: 767px)")`
3. Conditionally render `<BottomSheet>` or `<BaseModal>` with the same content
4. Keep content/children identical in both variants

```tsx
const isMobile = useMediaQuery("(max-width: 767px)");

if (isMobile) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {/* content */}
    </BottomSheet>
  );
}

return (
  <BaseModal isOpen={isOpen} onClose={onClose}>
    {/* content */}
  </BaseModal>
);
```

## 6. Acceptance Criteria

- [x] DeleteConfirmationModal uses BottomSheet on mobile
- [x] StatusSelector uses BottomSheet on mobile
- [x] AddAttackModal uses BottomSheet on mobile
- [x] TrainerInventory item form uses BottomSheet on mobile
- [x] TrainerOverview edit modal uses BottomSheet on mobile
- [x] All existing tests still pass
- [x] TypeScript compiles with no errors
- [x] Lint passes (no new warnings)

## 7. Test Strategy

- No new tests required for the migration itself
- Existing tests should pass as-is (content is identical, only the wrapper changes)
- Manual verification for mobile behavior (BottomSheet slides up, has drag handle)
