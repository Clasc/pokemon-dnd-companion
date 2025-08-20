# Test Fixtures

This directory contains test data fixtures that are automatically loaded into the application store during development when localStorage is empty.

## Purpose

The test fixtures provide a complete set of sample data for development and testing, including:

- A trainer with inventory items and stats
- Three Pokemon with different types, levels, and abilities
- Various status conditions and attacks

## Files

- **`trainer.ts`** - Contains a sample trainer "Ash Ketchum" with attributes, inventory items, and currency
- **`pokemon.ts`** - Contains three Pokemon:
  - **Sparky** (Pikachu) - Electric type, level 12
  - **Blaze** (Charizard) - Fire/Flying type, level 18
  - **Ivy** (Bulbasaur) - Grass/Poison type, level 8 (poisoned status)
- **`index.ts`** - Main export file that combines all fixtures

## Usage

The fixtures are automatically loaded by the Zustand store when:

1. `NODE_ENV` is set to `"development"`
2. localStorage is empty or doesn't contain existing app data

This ensures that:
- Developers get sample data immediately when starting the app
- Production builds never load test data
- Existing user data is never overwritten

## Development Workflow

When developing new features:

1. Start the development server with `npm run dev`
2. If you have no existing data, the app will automatically load the test fixtures
3. You can immediately test features with realistic data
4. To reset to test data, clear localStorage and refresh the page

## Testing

The fixtures include comprehensive test coverage to ensure:
- All required fields are present
- Data types are correct
- Relationships between entities are valid
- Status conditions and attacks are properly structured

Run fixture tests with:
```bash
npm test src/fixtures
```

## Modifying Test Data

When adding new features that require different test data:

1. Update the relevant fixture files
2. Ensure all required fields are included
3. Add corresponding tests to verify data integrity
4. Clear localStorage during development to load updated fixtures

## Data Structure

### Trainer
- Complete D&D attributes (STR, DEX, CON, INT, WIS, CHA)
- HP and level information
- Inventory with various items (Pokeballs, Potions, Berries)
- Starting currency (Pokedollars)

### Pokemon
Each Pokemon includes:
- Type information (primary and secondary types)
- Level, HP, and experience data
- Complete attribute set
- Up to 4 attacks with PP, damage dice, and special effects
- Optional status conditions

The sample Pokemon represent different stages of the game:
- **Pikachu**: Mid-level starter with basic attacks
- **Charizard**: High-level evolved Pokemon with powerful moves
- **Bulbasaur**: Low-level Pokemon with status condition for testing