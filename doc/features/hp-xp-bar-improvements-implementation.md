# HP/XP Bar Improvements - Implementation Plan

## Overview
Implement drag-to-adjust functionality for HP and XP bars in the Pokemon card component, following a test-first development approach with accessibility as a priority.

## Implementation Phases

### Phase 1: Test Foundation & Accessibility Setup
**Goal:** Establish comprehensive test coverage before implementation

### Phase 2: Core Drag Functionality  
**Goal:** Implement basic drag mechanics for both bars

### Phase 3: Visual Feedback & Polish
**Goal:** Add visual indicators and smooth interactions

### Phase 4: Integration & Cleanup
**Goal:** Ensure compatibility with existing features

---

## Phase 1: Test Foundation & Accessibility Setup

### 1.1 Create Test File Structure
**Location:** `src/features/pokemon/components/PokemonCard/DraggableProgressBar/index.test.tsx`

Create a new reusable component for draggable progress bars that will be used for both HP and XP.

### 1.2 Test Categories to Implement

#### A. Accessibility Tests
```typescript
// Test: Progress bar has proper ARIA attributes
- role="slider" for drag interaction
- aria-valuenow={currentValue}
- aria-valuemin={0}
- aria-valuemax={maxValue}
- aria-label="HP" or "Experience Points"
- aria-valuetext="50 out of 100 HP"

// Test: Keyboard navigation works
- Tab focuses the slider
- Arrow keys adjust value (←/→ or ↑/↓)
- Home/End keys jump to min/max
- Announces changes to screen readers
```

#### B. Mouse Interaction Tests
```typescript
// Test: Mouse drag updates value
- getByRole('slider', { name: 'HP' })
- fireEvent.mouseDown at position
- fireEvent.mouseMove to new position
- fireEvent.mouseUp
- Verify aria-valuenow updated

// Test: Drag boundaries enforced
- Cannot drag below aria-valuemin
- Cannot drag above aria-valuemax
- Value clamps appropriately
```

#### C. Touch Interaction Tests
```typescript
// Test: Touch drag on mobile
- getByRole('slider', { name: 'HP' })
- fireEvent.touchStart
- fireEvent.touchMove
- fireEvent.touchEnd
- Verify smooth value updates
```

#### D. Integration Tests with Store
```typescript
// Test: HP bar updates Pokemon in store
- Render with real store
- Drag HP slider
- Verify store.pokemonTeam[uuid].currentHP updated
- Verify no unintended side effects

// Test: XP bar triggers level up
- Set XP near threshold
- Drag past threshold
- Verify level increase in store
- Verify XP reset calculation
```

### 1.3 Test File Template

```typescript
// src/features/pokemon/components/PokemonCard/DraggableProgressBar/index.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DraggableProgressBar from ".";
import { useAppStore } from "@/store";

describe("DraggableProgressBar - Accessibility", () => {
  it("renders with proper ARIA attributes for HP bar", () => {
    render(
      <DraggableProgressBar
        type="hp"
        current={50}
        max={100}
        onChange={jest.fn()}
        label="HP"
      />
    );

    const slider = screen.getByRole("slider", { name: "HP" });
    expect(slider).toHaveAttribute("aria-valuenow", "50");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
    expect(slider).toHaveAttribute("aria-valuetext", "50 out of 100 HP");
  });

  it("announces value changes to screen readers", async () => {
    // Implementation here
  });
});

describe("DraggableProgressBar - Mouse Interactions", () => {
  it("updates value on mouse drag", async () => {
    const onChange = jest.fn();
    render(
      <DraggableProgressBar
        type="hp"
        current={50}
        max={100}
        onChange={onChange}
        label="HP"
      />
    );

    const slider = screen.getByRole("slider", { name: "HP" });
    
    // Simulate drag from 50% to 75%
    fireEvent.mouseDown(slider, { clientX: 50 });
    fireEvent.mouseMove(slider, { clientX: 75 });
    fireEvent.mouseUp(slider);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(75);
    });
  });
});

describe("DraggableProgressBar - Touch Interactions", () => {
  it("updates value on touch drag", async () => {
    // Touch event simulation
  });
});

describe("DraggableProgressBar - Keyboard Navigation", () => {
  it("increases value with right arrow key", () => {
    const onChange = jest.fn();
    render(
      <DraggableProgressBar
        type="hp"
        current={50}
        max={100}
        onChange={onChange}
        label="HP"
        step={1}
      />
    );

    const slider = screen.getByRole("slider", { name: "HP" });
    slider.focus();
    
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(51);
  });

  it("decreases value with left arrow key", () => {
    // Implementation
  });

  it("jumps to maximum with End key", () => {
    // Implementation
  });

  it("jumps to minimum with Home key", () => {
    // Implementation
  });
});
```

### 1.4 PokemonCard Integration Tests

```typescript
// src/features/pokemon/components/PokemonCard/index.test.tsx (additions)

describe("PokemonCard - HP Bar Drag Interaction", () => {
  const mockPokemon = createMockPokemon({
    currentHP: 50,
    maxHP: 100,
  });

  beforeEach(() => {
    const store = useAppStore.getState();
    store.addPokemon(mockPokemon);
  });

  it("updates Pokemon HP via drag", async () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);
    
    const hpSlider = screen.getByRole("slider", { name: /HP/i });
    
    // Drag to 75 HP
    fireEvent.mouseDown(hpSlider, { clientX: 50 });
    fireEvent.mouseMove(hpSlider, { clientX: 75 });
    fireEvent.mouseUp(hpSlider);

    await waitFor(() => {
      const updatedPokemon = useAppStore.getState().pokemonTeam["test-uuid"];
      expect(updatedPokemon.currentHP).toBe(75);
    });
  });

  it("maintains HP bar color thresholds during drag", () => {
    // Test color changes at 30% and 60% thresholds
  });
});

describe("PokemonCard - XP Bar Drag Interaction", () => {
  it("updates Pokemon XP via drag", async () => {
    // Similar to HP test
  });

  it("handles level up during XP drag", async () => {
    // Test level threshold behavior
  });
});
```

---

## Phase 2: Core Drag Functionality Implementation

### 2.1 Create DraggableProgressBar Component

**Location:** `src/features/pokemon/components/PokemonCard/DraggableProgressBar/index.tsx`

```typescript
interface DraggableProgressBarProps {
  type: "hp" | "xp";
  current: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  step?: number;
  className?: string;
  disabled?: boolean;
  getColor?: (percentage: number) => string;
}

// Component implementation with:
// - ARIA slider role
// - Mouse event handlers
// - Touch event handlers  
// - Keyboard event handlers
// - Visual progress bar
// - Value preview during drag
```

### 2.2 Integrate into PokemonCard

**Modifications to:** `src/features/pokemon/components/PokemonCard/index.tsx`

1. Replace static HP bar with DraggableProgressBar
2. Replace static XP bar with DraggableProgressBar
3. Keep existing button controls
4. Add proper onChange handlers connected to store

### 2.3 Store Integration

Ensure existing store methods work smoothly:
- `modifyPokemonHP(uuid, amount)` - adapt for absolute values
- `gainExperience(uuid, amount)` - adapt for absolute XP setting

May need new store methods:
- `setPokemonHP(uuid, value)` - set absolute HP
- `setPokemonExperience(uuid, value)` - set absolute XP

---

## Phase 3: Visual Feedback & Polish

### 3.1 Visual Enhancements

#### Add to DraggableProgressBar:
```css
/* Cursor feedback */
cursor: grab (when hovering)
cursor: grabbing (when dragging)

/* Drag active state */
outline: 2px solid var(--accent-blue)
box-shadow: 0 0 10px rgba(59, 130, 246, 0.5)

/* Value preview tooltip */
position: absolute tooltip showing current value
Smooth fade in/out animation
```

### 3.2 Animation Polish
- Smooth bar fill transitions
- Haptic feedback hook for mobile (if available)
- Visual "snap" feedback at thresholds

### 3.3 Accessibility Enhancements
- Live region announcements for value changes
- Focus visible styles
- High contrast mode support

---

## Phase 4: Integration & Cleanup

### 4.1 Ensure Compatibility
- Test with existing HP modifier modal
- Test with existing XP modifier modal  
- Verify button controls still work
- Check responsive design on all breakpoints

### 4.2 Performance Optimization
- Debounce store updates during drag
- Use requestAnimationFrame for smooth updates
- Memoize color calculations

### 4.3 Documentation Updates
- Update component JSDoc comments
- Add usage examples
- Update README if needed

---

## Testing Checklist

### Before Implementation (TDD)
- [ ] Write all accessibility tests
- [ ] Write mouse interaction tests
- [ ] Write touch interaction tests
- [ ] Write keyboard navigation tests
- [ ] Write store integration tests
- [ ] Write boundary condition tests
- [ ] All tests failing (red phase)

### During Implementation
- [ ] Implement ARIA attributes (accessibility tests pass)
- [ ] Implement mouse drag (mouse tests pass)
- [ ] Implement touch drag (touch tests pass)
- [ ] Implement keyboard navigation (keyboard tests pass)
- [ ] Integrate with store (integration tests pass)
- [ ] All tests passing (green phase)

### After Implementation
- [ ] Refactor for clarity (refactor phase)
- [ ] Add edge case tests
- [ ] Performance tests
- [ ] Manual testing on devices
- [ ] Accessibility audit with screen reader
- [ ] Update documentation

---

## File Structure After Implementation

```
src/features/pokemon/components/
├── PokemonCard/
│   ├── index.tsx (modified)
│   ├── index.test.tsx (expanded)
│   └── DraggableProgressBar/
│       ├── index.tsx (new)
│       └── index.test.tsx (new)
```

---

## Rollback Plan

If issues arise:
1. Keep existing button controls functional
2. Add feature flag to enable/disable drag
3. Revert to static bars if critical bugs found
4. Maintain backward compatibility with store

---

## Success Criteria

1. **All tests pass** - 100% of planned test cases
2. **Accessibility audit** - WCAG 2.1 AA compliant
3. **Performance** - No lag during drag on mobile
4. **User feedback** - Intuitive without instructions
5. **Integration** - Works with all existing features

---

## Notes for Implementation

### Accessibility First
- Every interactive element must be keyboard accessible
- Screen reader users should have full functionality
- Use semantic HTML and ARIA only when needed

### Mobile First
- Touch events take priority over mouse
- Test on actual devices, not just browser emulation
- Consider thumb reach zones on mobile

### Progressive Enhancement
- Feature should degrade gracefully
- Buttons remain as fallback
- No JavaScript? Buttons still work

---

## Dependencies

No new dependencies required. Uses:
- Existing React event handlers
- Existing Zustand store
- Existing Tailwind classes
- Native browser drag events

---

## Timeline Estimate

- Phase 1 (Tests): 2-3 hours
- Phase 2 (Core Implementation): 3-4 hours
- Phase 3 (Polish): 2 hours
- Phase 4 (Integration): 1-2 hours

**Total: 8-11 hours**

---

## Questions to Resolve

1. Should drag preview show absolute value or change amount?
2. Should XP bar allow decreasing XP (for corrections)?
3. Should we add undo functionality?
4. What happens during auto-save while dragging?
5. Should drag be disabled during battle/combat states?

These should be clarified before starting Phase 2.