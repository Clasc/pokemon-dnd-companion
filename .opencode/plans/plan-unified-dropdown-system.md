---
title: Unified Dropdown System
version: 1.0
date_created: 2026-04-12
owner: Pokemon DnD Companion
status: open
tags: `design-system`, `ui`, `dropdown`
---

# Unified Dropdown System Specification

## Current State Analysis

The codebase has 5+ different dropdown/autocomplete implementations:

| Component | Pattern | Click-Outside | Positioning | Z-Index |
|-----------|---------|---------------|--------------|---------|
| QuickStatusDropdown | Custom dropdown | mousedown listener | absolute top-full | z-[101] |
| PokemonAutocomplete | Custom autocomplete | onBlur handler | absolute mt-1 | z-50 |
| MoveAutocomplete | Custom autocomplete | onBlur handler | absolute mt-1 | z-50 |
| ItemAutocomplete | Custom autocomplete | onBlur handler | absolute mt-1 | z-50 |
| ActionButtons | Kebab menu | mousedown listener | absolute top-10 | z-10 |

**Problems identified:**
1. Two different click-outside detection patterns (mousedown listener vs onBlur)
2. Inconsistent z-index values (z-10, z-50, z-[100], z-[101])
3. No floating/anchoring library - hardcoded positioning
4. No Escape key handling in QuickStatusDropdown
5. Custom implementations duplicated across components
6. onBlur pattern can have timing issues with click events

## Proposed Solution

### 1. useFloatingDropdown Hook (new)

Using existing `@floating-ui/react` dependency:

```typescript
interface UseFloatingDropdownOptions {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

interface UseFloatingDropdownReturn {
  refs: UseFloatingReturn< HTMLElement>['refs'];
  floatingStyles: React.CSSProperties;
  getDropdownProps: (props?: {} ) => any;
  getTriggerProps: (props?: {} ) => any;
  context: FloatingContext;
}
```

Features:
- Automatic positioning (flips, shifts to stay in viewport)
- Correct z-index management
- Floating UI's built-in click-outside detection
- Works with Floating UI's useClickOutside or custom

### 2. Dropdown Component (new)

```typescript
interface DropdownProps {
  /** The trigger element that opens the dropdown */
  trigger: React.ReactNode;
  /** The dropdown content */
  children: React.ReactNode;
  /** Controlled open state */
  isOpen: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Placement relative to trigger */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  /** Custom className for dropdown */
  className?: string;
  /** Disable portal - for simple dropdowns inside containers */
  disablePortal?: boolean;
}
```

Features:
- Uses useFloatingDropdown internally
- Controlled open/close
- Escape key closes dropdown
- Click outside closes dropdown
- Handles all positioning

### 3. Autocomplete Component (new)

```typescript
interface AutocompleteProps {
  /** Current value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Async search function */
  search: (query: string) => Promise<T[]>;
  /** Render option label */
  renderOption: (option: T) => string;
  /** Optional: key to use for option value */
  optionKey?: keyof T;
  /** Placeholder text */
  placeholder?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Optional: onEscape key handler */
  onEscape?: () => void;
}
```

Features:
- Debounced search (300ms)
- Keyboard navigation (Arrow Up/Down, Enter to select, Escape to close)
- Loading/error/empty states
- Uses Dropdown internally for floating

### 4. MenuDropdown Component (new)

For simple menus like ActionButtons (kebab menus):

```typescript
interface MenuDropdownProps {
  /** Trigger element (typically an icon button) */
  trigger: React.ReactNode;
  /** Menu items */
  items: MenuItem[];
  /** Callback when item is selected */
  onSelect: (item: MenuItem) => void;
  /** Controlled open state */
  isOpen?: boolean;
  /** onOpenChange callback */
  onOpenChange?: (open: boolean) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}
```

## Key Decisions Made

- **Scope**: All dropdown types (menus, selects, autocompletes)
- **Library**: Floating UI (existing @floating-ui/react)
- **Click-outside**: useClickOutside pattern (document-level mousedown)
- **API**: Floating UI hooks for positioning, controlled props for state

## Files to Create

1. Create: `src/hooks/useFloatingDropdown.ts` - Floating positioning hook
2. Create: `src/components/shared/ui/Dropdown/index.tsx` - Base dropdown component
3. Create: `src/components/shared/ui/Autocomplete/index.tsx` - Autocomplete component
4. Create: `src/components/shared/ui/MenuDropdown/index.tsx` - Menu dropdown

## Files to Modify

1. Refactor: `src/features/pokemon/components/QuickStatusDropdown` → uses Dropdown
2. Refactor: `src/features/pokemon/components/PokemonAutocomplete` → uses Autocomplete
3. Refactor: `src/features/pokemon/components/MoveAutocomplete` → uses Autocomplete
4. Refactor: `src/features/trainer/components/ItemAutocomplete` → uses Autocomplete
5. Refactor: `src/components/shared/ActionButtons` → uses MenuDropdown

## Migration Plan

1. Create reusable components (useFloatingDropdown, Dropdown, Autocomplete, MenuDropdown)
2. Migrate QuickStatusDropdown to use Dropdown
3. Migrate autocompletes to use Autocomplete base component
4. Migrate ActionButtons to use MenuDropdown
5. Add tests