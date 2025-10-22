# HP / XP Bar Improvements

## Feature Overview

Enhanced interaction model for HP and XP progress bars allowing direct manipulation through drag gestures alongside existing button controls. This provides a more intuitive and faster way to adjust values during gameplay.

## User Stories

### As a Player
- I want to quickly adjust my Pokémon's HP by dragging the HP bar so I can update damage/healing without multiple button clicks
- I want to drag the XP bar to set experience points visually when receiving bulk XP rewards
- I want visual feedback while dragging so I know the exact value I'm setting
- I want the ability to cancel a drag operation if I change my mind
- I want fine-grained control with buttons for precise adjustments after rough dragging

### As a DM
- I want players to quickly update their stats without disrupting game flow
- I want the interface to prevent invalid values that could break game balance

## Functional Requirements

### HP Bar Drag Interaction
- Bar responds to both touch (mobile) and mouse (desktop) drag gestures
- Dragging left decreases HP, dragging right increases HP
- Cannot exceed maximum HP when dragging right
- Cannot go below 0 HP when dragging left
- Shows real-time numeric feedback during drag (e.g., "45/100 HP")
- Drag interaction works across the entire bar area, not just the filled portion

### XP Bar Drag Interaction  
- Bar responds to both touch (mobile) and mouse (desktop) drag gestures
- Dragging adjusts experience within current level range
- Cannot exceed experience required for next level
- Cannot go below 0 experience for current level
- Shows real-time numeric feedback during drag (e.g., "250/500 XP")
- Visual indicator when approaching level-up threshold

### Button Controls (Fine Adjustment)
- HP buttons remain: -5, -1, +1, +5 for precise adjustments
- XP buttons adjusted to: -10, +10 for fine-tuning after drag
- Buttons disabled when at min/max values
- Button controls work independently of drag feature

### Visual Feedback
- Draggable bars have subtle visual affordance (cursor change on hover)
- Active drag state shows enhanced visual feedback (glow, shadow, or outline)
- Preview value displayed above/near bar during drag
- Smooth animation when releasing drag to final value
- Color coding maintained (HP: red/yellow/green based on percentage)

### Accessibility
- Keyboard navigation maintained through existing button controls
- Screen reader announces value changes
- Touch targets meet minimum size requirements (44x44px)
- High contrast mode compatible

## Edge Cases & Validation

### HP Bar
- Dragging when HP is already at maximum (no change)
- Dragging when HP is at 0 (can only increase)
- Rapid dragging back and forth (should track accurately)
- Dragging beyond bar boundaries (clamps to min/max)
- Interrupting drag with system events (should cancel gracefully)

### XP Bar
- Dragging when at level-up threshold (stops at max for level)
- Handling level-up during drag (deferred until drag complete)
- Multiple simultaneous touch points (only first touch active)
- Dragging on newly added Pokémon with 0 XP

## Test Cases

### HP Bar - Desktop Mouse Interaction

#### Test: Basic HP Decrease via Drag
**Setup:** Pokémon with 80/100 HP
**Action:** Click and drag HP bar from 80% position to 50% position
**Expected:** 
- HP updates to 50/100
- Bar fill animates to 50%
- Color changes from green to yellow
- Numeric display updates in real-time during drag

#### Test: HP Increase via Drag
**Setup:** Pokémon with 30/100 HP  
**Action:** Click and drag HP bar from 30% position to 75% position
**Expected:**
- HP updates to 75/100
- Bar fill animates to 75%
- Color changes from red to green
- Healing is applied correctly

#### Test: Drag Beyond Maximum
**Setup:** Pokémon with 90/100 HP
**Action:** Drag bar to 120% position (beyond right edge)
**Expected:**
- HP caps at 100/100
- Bar fills completely but doesn't overflow
- Numeric display shows "100/100"

#### Test: Drag Below Zero
**Setup:** Pokémon with 10/100 HP
**Action:** Drag bar to -20% position (beyond left edge)
**Expected:**
- HP stops at 0/100
- Bar becomes empty
- Numeric display shows "0/100"
- Possible KO status indicator

#### Test: Cancel Drag Operation
**Setup:** Pokémon with 50/100 HP
**Action:** Start dragging to 30%, then press ESC key
**Expected:**
- Drag cancelled
- HP remains at 50/100
- Visual feedback removed
- Bar returns to original position

### HP Bar - Touch Interaction

#### Test: Touch Drag on Mobile
**Setup:** Pokémon with 60/100 HP on mobile device
**Action:** Touch and swipe from 60% to 40% position
**Expected:**
- HP updates to 40/100
- Smooth tracking of finger position
- No page scroll during drag
- Haptic feedback on value change (if available)

#### Test: Multi-touch Prevention
**Setup:** Pokémon with 50/100 HP
**Action:** Place two fingers on bar and try to drag
**Expected:**
- Only first touch point active
- Second touch ignored
- No erratic behavior

### HP Bar - Button Integration

#### Test: Button After Drag
**Setup:** Pokémon with 50/100 HP
**Action:** Drag to 45 HP, then click +1 button
**Expected:**
- HP increases to 46/100
- Button and drag systems work together
- No conflicts or double-updates

#### Test: Drag After Button
**Setup:** Pokémon with 20/100 HP
**Action:** Click -5 button (to 15 HP), then drag to 30
**Expected:**
- Drag starts from current value (15)
- Updates correctly to 30/100

### XP Bar - Desktop Interaction

#### Test: XP Gain via Drag
**Setup:** Pokémon with 100/500 XP (Level 5)
**Action:** Drag XP bar from 20% to 60% position
**Expected:**
- XP updates to 300/500
- Bar fills to 60%
- Level remains 5
- Progress percentage updates

#### Test: Drag to Level Threshold
**Setup:** Pokémon with 450/500 XP
**Action:** Drag to 100% position
**Expected:**
- XP caps at 499/500 (just before level-up)
- Visual indicator for "ready to level"
- Requires confirmation or button press to actually level

#### Test: XP Decrease via Drag
**Setup:** Pokémon with 300/500 XP
**Action:** Drag from 60% to 40% position
**Expected:**
- XP updates to 200/500
- Bar decreases smoothly
- No level loss (if applicable to game rules)

### XP Bar - Touch Interaction

#### Test: Quick XP Adjustment
**Setup:** Pokémon with 0/100 XP (Level 1)
**Action:** Quick swipe from left to middle of bar
**Expected:**
- XP updates to approximately 50/100
- Responsive to quick gestures
- Accurate position tracking

### Combined Interaction Tests

#### Test: Simultaneous HP and XP Adjustment
**Setup:** Two Pokémon cards visible, one with 50/100 HP, other with 200/400 XP
**Action:** Drag HP bar on first card, then immediately drag XP on second
**Expected:**
- Each bar responds independently
- No cross-contamination of values
- Smooth transition between interactions

#### Test: Drag During Animation
**Setup:** Pokémon with HP animating from 80 to 60 (via button)
**Action:** Try to drag while animation in progress
**Expected:**
- Either: Drag overrides animation, OR
- Drag waits for animation to complete
- No visual glitches or incorrect values

### Accessibility Tests

#### Test: Keyboard-Only Navigation
**Setup:** Pokémon with 50/100 HP
**Action:** Use Tab to focus bar, use arrow keys or buttons
**Expected:**
- Can adjust values without mouse
- Clear focus indicators
- Announcement of value changes

#### Test: Screen Reader Interaction
**Setup:** Screen reader active, Pokémon with 75/100 HP
**Action:** Drag HP bar to 50
**Expected:**
- Announces "HP changing" at drag start
- Announces final value "HP set to 50 out of 100"
- Readable without visual feedback

### Performance Tests

#### Test: Rapid Drag Movements
**Setup:** Pokémon with any HP value
**Action:** Rapidly drag back and forth across bar
**Expected:**
- No lag or stutter
- Value updates keep pace
- No memory leaks
- Final value accurate

#### Test: Multiple Pokémon Cards
**Setup:** 6 Pokémon cards on screen
**Action:** Drag HP bars on multiple cards in succession
**Expected:**
- Each responds smoothly
- No performance degradation
- All values update correctly

### Error Handling Tests

#### Test: Drag with Invalid Pokemon Data
**Setup:** Pokémon with undefined or null HP values
**Action:** Attempt to drag HP bar
**Expected:**
- Graceful handling
- No crashes
- Appropriate error message or disabled state

#### Test: Network/Save Interruption
**Setup:** Dragging HP bar when auto-save triggers
**Action:** Drag overlaps with save operation
**Expected:**
- Drag completes normally
- Value saved correctly
- No data loss

### Visual Regression Tests

#### Test: HP Bar Color Transitions
**Setup:** Pokémon with various HP levels
**Action:** Drag through different HP thresholds
**Expected:**
- Red (0-30%), Yellow (31-60%), Green (61-100%)
- Smooth color transitions
- Colors match existing design system

#### Test: XP Bar Fill Accuracy
**Setup:** Multiple experience values
**Action:** Set XP via drag to specific percentages
**Expected:**
- Visual fill matches numeric percentage exactly
- No off-by-one pixel errors
- Consistent across screen sizes

## Success Metrics

- Average time to adjust HP reduced by 50%
- Reduced number of clicks per gameplay session
- Player satisfaction with stat management increased
- Zero critical bugs in production
- Accessibility compliance maintained

## Out of Scope

- Drag-to-reorder Pokémon cards
- Undo/redo functionality for drag operations
- Batch operations (dragging multiple bars simultaneously)
- Custom gesture recognition beyond basic drag
- Saving drag preferences per user