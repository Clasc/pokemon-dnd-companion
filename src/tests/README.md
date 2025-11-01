# Test Documentation for Pokémon D&D Companion

## Overview

This document outlines the comprehensive testing strategy for the PokemonOverview component and provides guidelines for testing React components with Zustand state management in this project.

## Testing Philosophy

Our testing approach follows these principles:

1. **Integration over Unit Testing**: We prefer integration tests that test components with their actual dependencies rather than heavily mocked unit tests.
2. **User-Centric Testing**: Tests focus on user interactions and behaviors rather than implementation details.
3. **Accessibility First**: All tests include accessibility checks using semantic queries.
4. **Real State Management**: We test with actual Zustand stores to ensure state management works correctly.

## Test Structure

### PokemonOverview Component Tests

The PokemonOverview component tests are organized into the following test suites:

#### 1. Empty State Tests
- Verifies correct rendering when no Pokémon are present
- Tests empty state messaging and icons
- Ensures proper counter display (0/6)
- Validates add button visibility

#### 2. Single Pokémon Tests
- Tests rendering with one Pokémon
- Verifies team statistics calculation
- Ensures proper card display

#### 3. Multiple Pokémon Tests
- Tests rendering with multiple Pokémon
- Validates complex team statistics calculations
- Ensures all Pokémon cards are rendered

#### 4. Full Team Tests (6 Pokémon)
- Tests behavior when team is at maximum capacity
- Verifies add button is hidden when team is full
- Ensures team statistics still display correctly

#### 5. Edge Case Tests
- Handles Pokémon with zero max HP
- Tests rounding behavior for percentage calculations
- Validates various team compositions


#### 6. Route-Based Form Tests
- Navigates to /pokemon/new and renders creation form
- Validates required fields and shows error messaging (currently alert-based; planned inline errors)
- Navigates to /pokemon/[uuid]/edit and persists updates
- Executes inline delete (danger zone) flow on the edit page


#### 7. Accessibility Tests
- Verifies proper heading structure
- Tests button accessibility
- Ensures proper ARIA labels and roles

#### 8. State Management Tests
- Tests modal state independence
- Verifies component behavior with changing props

#### 9. Responsive Design Tests
- Tests CSS classes for responsive behavior
- Verifies proper styling application

#### 10. Performance Tests
- Tests re-rendering behavior with reference changes
- Ensures efficient component updates

## Testing Tools and Setup

### Dependencies
- **@testing-library/react**: For component rendering and querying
- **@testing-library/user-event**: For realistic user interactions
- **@testing-library/jest-dom**: For DOM-specific matchers
- **Jest**: Test runner and assertion library

### Configuration Files

#### `jest.config.js`
- Configures Next.js integration with Jest
- Sets up module name mapping for import aliases
- Configures test environment and setup files

#### `jest.setup.js`
- Imports jest-dom matchers
- Mocks browser APIs (crypto, localStorage, matchMedia)
- Sets up global test environment

### Test Utilities (`src/tests/utils/testUtils.ts`)

#### Mock Data
- `mockPokemon`: Standard Pokémon for testing
- `mockPokemonWithSecondType`: Dual-type Pokémon
- `mockPokemonLowHP`: Pokémon with low health for edge case testing
- `mockPokemonTeam`: Complete team for multi-Pokémon tests
- `mockTrainer`: Trainer data for future tests

#### Helper Functions
- `createTestStore()`: Factory for creating isolated test stores
- `calculateTeamStats()`: Helper for validating team statistics
- `createTestWrapper()`: Provider component for store context

## Testing Patterns

### 1. Component Mocking Strategy

We mock child components to focus on the component under test:


jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
}))

```

### 2. Store Mocking

We mock the Zustand store selectively:

```typescript
jest.mock('../store', () => ({
  useAppStore: {
    use: {
      addPokemon: jest.fn(),
    },
  },
}))
```

### 3. User Interaction Testing

We use `@testing-library/user-event` for realistic interactions:

```typescript
const user = userEvent.setup()
const addButton = screen.getByRole('button', { name: /add pokémon/i })
await user.click(addButton)
```

### 4. Accessibility-First Queries

We prioritize semantic queries over test IDs:

```typescript
// Preferred
screen.getByRole('heading', { level: 2 })
screen.getByRole('button', { name: /add pokémon/i })

// Avoid (use only when necessary)
screen.getByTestId('some-test-id')
```

## Running Tests

### Basic Commands
```bash
npm test                 # Run all tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

### Test-Specific Commands
```bash
npm test PokemonOverview.test.tsx    # Run specific test file
npm test -- --verbose               # Run with detailed output
```

## Coverage Goals

We aim for:
- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >90%
- **Lines**: >90%

Focus areas for coverage:
- All user interaction paths
- Edge cases and error conditions
- State management flows
- Accessibility requirements

## Best Practices

### 1. Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names that explain the behavior
- Keep tests focused on single behaviors

### 2. Assertions
- Use specific matchers (`toHaveTextContent` vs `toBeTruthy`)
- Assert on user-visible behavior, not implementation
- Include negative assertions where appropriate

### 3. Test Data
- Use realistic but minimal test data
- Create data that tests edge cases
- Reuse test data across similar tests

### 4. Async Testing
- Always use `await` with user interactions
- Use `waitFor` for async state changes
- Avoid arbitrary timeouts

## Common Patterns

### Testing Empty States
```typescript
it('should render empty state when no pokemon are present', () => {
  const emptyTeam: PokemonTeam = {}
  render(<PokemonOverview pokemon={emptyTeam} />)
  
  expect(screen.getByText('No Pokémon in your team yet')).toBeInTheDocument()
})
```

### Testing Modal Interactions
```typescript
it('should open modal when button is clicked', async () => {
  const user = userEvent.setup()
  render(<PokemonOverview pokemon={emptyTeam} />)
  
  await user.click(screen.getByRole('button', { name: /add pokémon/i }))
  expect(screen.getByTestId('add-pokemon-modal')).toBeInTheDocument()
})
```

### Testing Calculations
```typescript
it('should calculate team statistics correctly', () => {
  render(<PokemonOverview pokemon={mockPokemonTeam} />)
  
  const { totalLevels, totalHP, avgHealth } = calculateTeamStats(mockPokemonTeam)
  expect(screen.getByText(totalLevels.toString())).toBeInTheDocument()
})
```

## Future Enhancements

1. **Visual Regression Testing**: Consider adding screenshot testing for UI consistency
2. **E2E Testing**: Add Cypress or Playwright for full user journey testing
3. **Performance Testing**: Add tests for rendering performance with large datasets
4. **Store Integration**: Expand testing with full store integration scenarios

## Troubleshooting

### Common Issues

1. **Module Resolution**: Ensure `moduleNameMapper` is correctly configured in Jest config
2. **Async Assertions**: Use `await` with all user interactions
3. **Store Mocking**: Verify mock return values match expected function signatures
4. **CSS Classes**: Remember that className assertions test implementation, prefer semantic queries

### Debug Tips

1. Use `screen.debug()` to see rendered output
2. Use `screen.logTestingPlaygroundURL()` for query suggestions
3. Check console warnings for accessibility issues
4. Use `--verbose` flag for detailed test output