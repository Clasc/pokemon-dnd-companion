# Pokedollars Feature

## Overview

Pokedollars are the primary currency in the Pokemon D&D companion app. They are managed as a special type of inventory item with unique properties and behaviors.

## Features

### Special Properties

- **Cannot be deleted**: Unlike regular inventory items, Pokedollars cannot be removed from a trainer's inventory
- **Can reach zero**: Pokedollars can be reduced to 0 without being removed from the inventory
- **Unlimited growth**: There is no upper limit on the amount of Pokedollars a trainer can have
- **Bulk operations**: Users can add or subtract large amounts at once using a number input field

### User Interface

The Pokedollars section appears at the top of the trainer inventory with:

- **Distinctive styling**: Golden gradient background with money emoji (💰)
- **Formatted display**: Large amounts are displayed with comma separators (e.g., "1,234,567")
- **Bulk modification controls**: When in edit mode, users see:
  - Number input field for specifying amounts
  - "Add" button to increase Pokedollars
  - "Subtract" button to decrease Pokedollars

### Behavior

#### Adding Pokedollars
- Enter an amount in the input field
- Click "Add" to increase the total by that amount
- The input field clears after the operation

#### Subtracting Pokedollars
- Enter an amount in the input field
- Click "Subtract" to decrease the total by that amount
- The total cannot go below 0 (automatically clamped)
- The input field clears after the operation

#### Validation
- Add/Subtract buttons are disabled when:
  - The input field is empty
  - The input value is 0 or negative
  - The input contains invalid characters
- Invalid input is handled gracefully without throwing errors

### Technical Implementation

#### Data Structure
Pokedollars are stored as a separate `pokedollars` field in the `Trainer` interface:

```typescript
export interface Trainer {
  // ... other fields
  pokedollars: number;
}
```

#### Component Props
The `TrainerInventory` component accepts:
- `pokedollars: number` - Current amount of Pokedollars
- `onUpdatePokedollars: (amount: number) => void` - Callback to update the total

#### State Management
- Changes are applied immediately when not in edit mode
- When in edit mode, changes are batched with other trainer modifications
- The total amount is always stored as an absolute value (not a delta)

### Testing

The Pokedollar feature includes comprehensive test coverage:

- Display formatting and zero-state handling
- Add/subtract operations with validation
- Edge cases like preventing negative amounts
- Input clearing and button state management
- Edit mode vs. non-edit mode behavior

### Usage Examples

#### Basic Operations
1. Navigate to the trainer overview
2. The Pokedollars section appears above the regular inventory
3. In edit mode, use the amount input and Add/Subtract buttons
4. Changes persist immediately or when saving the trainer edit session

#### Common Scenarios
- **Quest rewards**: Add large amounts after completing adventures
- **Equipment purchases**: Subtract costs when buying gear
- **Initial setup**: Set starting Pokedollars for new trainers