# Status Effects System

## Problem Statement

Currently, Pokémon in the companion app can only track basic information like HP, XP, and attacks. However, in D&D-style combat, Pokémon can be afflicted with various status conditions that affect their performance and need to be tracked throughout encounters. Players need a clear, accessible way to apply, modify, and monitor these status effects during gameplay.

## Requirements

### Core Functionality
- **Status Application**: Allow players to apply status effects to Pokémon via dropdown interface
- **Duration Tracking**: Track turn-based duration for temporary status effects
- **Multiple Effects**: Support confusion as a separate status that can coexist with other conditions
- **Fainting Interaction**: Automatically clear confusion when a Pokémon faints
- **Visual Indicators**: Provide clear color-coded visual representation of each status

### User Experience
- **Quick Access**: Status controls should be easily accessible from the Pokémon overview
- **Clear Visual Feedback**: Each status should have distinctive colors and iconography
- **Mobile Optimization**: Touch-friendly controls suitable for tabletop gaming scenarios

## Status Effect Types

### Primary Status Conditions
These are mutually exclusive (only one can be active at a time):

| Status | Duration | Effect Description | Color |
|--------|----------|-------------------|-------|
| **Burned** | Until healed | Takes damage at end of turn, reduced physical attack | `#FF6B35` (Orange-red) |
| **Frozen** | Until healed | Cannot take actions, chance to thaw each turn | `#4ECDC4` (Ice blue) |
| **Paralyzed** | Until healed | Reduced speed, chance to be unable to act | `#FFE66D` (Electric yellow) |
| **Poisoned** | Until healed | Takes damage at end of turn | `#8E44AD` (Purple) |
| **Badly Poisoned** | Until healed | Increasing damage each turn | `#6C3483` (Dark purple) |
| **Asleep** | 1-3 turns | Cannot take actions, chance to wake up | `#5DADE2` (Soft blue) |

### Secondary Status Conditions
Can coexist with primary status conditions and each other:

| Status | Duration | Effect Description | Color |
|--------|----------|-------------------|-------|
| **Confused** | 1-4 turns | May hurt itself instead of attacking | `#F39C12` (Amber) |
| **Flinching** | End of turn | Cannot act this turn | `#95A5A6` (Gray) |

## Testing Strategy

### Test Architecture
The status effects system follows the project's testing guidelines:

- **Real Store Usage**: All tests use the actual Zustand store rather than mocks
- **User-Centric Assertions**: Tests focus on visible behavior and user interactions
- **Integration-Style Testing**: Tests cover complete workflows from user action to state change

### Test Coverage Areas

#### Core Functionality Tests
- Status application and removal for all primary status types
- Confusion status handling (can coexist with primary status)
- Duration input validation and persistence
- Modal opening/closing behavior

#### Edge Case Tests
- Maximum and minimum duration values
- Zero or negative duration handling
- Status overwriting and preservation
- Empty input graceful handling
- Complex status combinations

#### User Interaction Tests
- Modal UI interactions (radio buttons, checkboxes, inputs)
- Save and cancel button functionality
- Duration input for time-limited conditions
- Status clearing to healthy state

### Example Test Patterns

```typescript
// Testing status application with real store
it("saves primary status to store when Save is clicked", async () => {
  const user = userEvent.setup();
  
  render(<StatusSelector pokemonUuid={testUuid} isOpen={true} onClose={mockOnClose} />);
  
  const poisonedRadio = screen.getByDisplayValue("poisoned");
  await user.click(poisonedRadio);
  
  const saveButton = screen.getByRole("button", { name: "Save" });
  await user.click(saveButton);
  
  const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
  expect(updatedPokemon.primaryStatus?.condition).toBe("poisoned");
});

// Testing complex status combinations
it("preserves secondary effects when changing primary status", async () => {
  // Setup Pokemon with primary status, confusion, and flinching
  const pokemonWithMultipleStatus = createTestPokemon();
  pokemonWithMultipleStatus.primaryStatus = { condition: "poisoned", duration: 3, turnsActive: 0 };
  pokemonWithMultipleStatus.confusion = { condition: "confused", duration: 2, turnsActive: 1 };
  pokemonWithMultipleStatus.temporaryEffects = [{ condition: "flinching", turnsActive: 0 }];
  
  useAppStore.setState({ pokemonTeam: { [testUuid]: pokemonWithMultipleStatus } });
  
  // Test that changing primary status preserves secondary effects
  // ... test implementation
});
```

## Edge Cases and Validation

### Duration Handling
- **Maximum Values**: System accepts large duration values (tested up to 99 turns)
- **Minimum Values**: Supports single-turn durations
- **Zero Duration**: Accepts zero duration for immediate effect resolution
- **Empty Input**: Gracefully handles empty duration fields with appropriate defaults

### Status Combinations
- **Mutual Exclusion**: Primary status conditions properly replace each other
- **Coexistence**: Secondary effects (confusion, flinching) can exist alongside any primary status and each other
- **State Preservation**: Changing one status type preserves others
- **Complete Clearing**: All status effects can be cleared to return to healthy state

### Invalid Input Handling
- Non-numeric duration input defaults to safe values
- Negative durations handled gracefully
- Missing Pokemon UUID fails safely without crashes

## Data Model Changes

### Updated Pokemon Interface
```typescript
export interface StatusEffect {
  condition: StatusCondition;
  duration?: number; // Duration in turns, if applicable
  turnsActive?: number; // For tracking escalating effects
}

export type StatusCondition =
  | "burned"
  | "frozen" 
  | "paralyzed"
  | "poisoned"
  | "badly-poisoned"
  | "asleep"
  | "confused"
  | "flinching"
  | "none";

export interface Pokemon {
  // ... existing fields
  primaryStatus?: StatusEffect; // Mutually exclusive conditions
  confusion?: StatusEffect; // Secondary effect - can coexist with primary
  temporaryEffects?: StatusEffect[]; // Secondary effects like flinching, etc.
}
```

### Status Effect Colors
```typescript
export const STATUS_COLORS: Record<StatusCondition, Color> = {
  burned: "#FF6B35",
  frozen: "#4ECDC4", 
  paralyzed: "#FFE66D",
  poisoned: "#8E44AD",
  "badly-poisoned": "#6C3483",
  asleep: "#5DADE2",
  confused: "#F39C12",
  flinching: "#95A5A6",
  none: "#TRANSPARENT"
};
```

## UI/UX Design

### Pokemon Card Integration
- **Status Indicators**: Small colored badges/chips displayed prominently on each Pokémon card
- **Status Dropdown**: Accessible via edit mode or dedicated status management button
- **Duration Display**: Show remaining turns for temporary effects
- **Multiple Status Display**: Stack confusion separately from primary status

### Status Selection Interface
```
┌─────────────────────────────────┐
│ Status Effect                   │
├─────────────────────────────────┤
│ ● None                         │
│ ○ Burned                       │
│ ○ Frozen                       │
│ ○ Paralyzed                    │
│ ○ Poisoned                     │
│ ○ Badly Poisoned               │
│ ○ Asleep (1-3 turns)           │
├─────────────────────────────────┤
│ Secondary Effects               │
├─────────────────────────────────┤
│ □ Confused (1-4 turns)         │
│ □ Flinching (end of turn)      │
└─────────────────────────────────┘
```

### Visual Design Elements
- **Status Badges**: Rounded rectangles with status color and white text
- **Duration Indicators**: Small circular badges showing turn count
- **Stacking**: Primary status + confusion displayed side-by-side
- **Glassmorphism**: Status selection modal follows app's glass aesthetic

### Mobile Considerations
- **Touch Targets**: Minimum 44px tap targets for status selection
- **Quick Actions**: Swipe or long-press for rapid status changes
- **Clear Typography**: Status names clearly readable at small sizes

### Interaction Rules

### Status Application
1. **Primary Status**: Selecting a new primary status replaces the existing one
2. **Secondary Effects**: Can be toggled independently of primary status and each other
3. **Duration Setting**: Automatically prompt for duration on applicable statuses
4. **Validation**: Prevent invalid combinations within primary statuses (e.g., burned + frozen)

### Automatic Clearing
1. **Fainting**: When currentHP reaches 0, clear confusion automatically
2. **Turn Progression**: Provide mechanism to advance turns and decrement durations
3. **Healing**: Clear status when healed (manual override)

### Combat Integration
- **Attack Interaction**: Visual indicators during attack selection
- **HP Changes**: Status effects can trigger HP modifications
- **Turn Tracking**: Integration with turn-based combat flow

## Edge Cases

### Data Consistency
- **Legacy Data**: Gracefully handle Pokémon without status fields
- **Invalid States**: Auto-correct impossible status combinations
- **Duration Overflow**: Handle negative or excessive duration values

### User Experience
- **Rapid Changes**: Prevent accidental status changes during combat
- **Visual Clarity**: Ensure status effects remain visible in various lighting conditions
- **Performance**: Minimize re-renders when updating status effects

### Accessibility
- **Color Independence**: Include text/icon indicators beyond just color
- **Screen Readers**: Proper ARIA labels for status information
- **High Contrast**: Ensure status colors meet contrast requirements

## Implementation Phases

### Phase 1: Core Status System
1. Update TypeScript interfaces for status effects
2. Extend Pokemon data model with status fields
3. Create status selection dropdown component
4. Implement basic status display on Pokemon cards

### Phase 2: Advanced Features
1. Add confusion special case handling
2. Implement duration tracking and countdown
3. Add automatic clearing on faint
4. Create status effect color system

### Phase 3: Combat Integration
1. Add turn progression functionality
2. Integrate with attack system
3. Implement status effect interactions
4. Add batch status operations

### Phase 4: Polish & Testing
1. Mobile optimization and touch improvements
2. Comprehensive testing of edge cases
3. Accessibility enhancements
4. Performance optimization

## Success Metrics

### Functional Requirements
- [ ] All primary status effects can be applied and displayed
- [ ] Confusion works independently alongside other statuses
- [ ] Duration tracking works correctly for temporary effects
- [ ] Status effects clear properly when Pokémon faints
- [ ] Color coding is consistent and visually distinct

### User Experience
- [ ] Status selection is intuitive and quick to use
- [ ] Visual indicators are clear in various lighting conditions
- [ ] Touch interactions work smoothly on mobile devices
- [ ] Status changes don't disrupt gameplay flow

### Technical Quality
- [ ] Data model handles all edge cases gracefully
- [ ] Performance remains smooth with multiple status effects
- [ ] localStorage persistence works correctly
- [ ] Component tests cover all interaction scenarios

## Dependencies

### Technical
- Zustand store updates for status effect management
- Component updates for Pokemon cards and overview
- Type system extensions for status conditions

### Design
- Color palette integration with existing design system
- Icon set for status effect indicators
- Animation/transition system for status changes

### Future Considerations
- Integration with planned attack system
- Battle management system compatibility
- Multiplayer session status synchronization