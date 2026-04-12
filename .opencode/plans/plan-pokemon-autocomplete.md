---
title: Pokemon Autocomplete Feature
version: 1.0
date_created: 2026-04-12
owner: pokemon-dnd-companion
tags: [`feature`, `pokemon`, `autocomplete`, `api-integration`]
---

# Introduction

This specification defines the requirements, constraints, and interfaces for implementing a Pokemon autocomplete feature in the Pokemon D&D Companion application. The feature enables users to search and select Pokemon species from the PokeAPI, automatically populating relevant fields (name, types, sprite image) while preserving D&D-specific values (HP, attributes).

## 1. Purpose & Scope

### Purpose
Provide an intuitive autocomplete experience when creating or editing Pokemon entries, reducing manual data entry by fetching Pokemon data from the PokeAPI and auto-filling species-specific information.

### Scope
- **In Scope**: Autocomplete search component, API integration with PokeAPI, auto-population of Pokemon species data, image display
- **Out of Scope**: Backend caching layer, offline mode, bulk import, Pokemon moves/abilities lookup

### Intended Audience
- Application developers maintaining the Pokemon D&D Companion
- End users creating or editing Pokemon entries

### Assumptions
- PokeAPI is accessible and responsive
- Users have internet connectivity when using autocomplete
- Pokemon species names follow the PokeAPI naming convention (lowercase, hyphenated)

## 2. Definitions

| Term | Definition |
|------|------------|
| **Autocomplete** | A UI pattern where a dropdown list appears as the user types, showing matching suggestions |
| **Species** | The Pokemon type/breed (e.g., "Pikachu", "Charizard") as defined by PokeAPI |
| **Pokemon species** | The API resource containing Pokemon species data including name and evolution details |
| **Sprite/Image** | The official artwork representation of a Pokemon |
| **Auto-fill** | The automatic population of form fields upon Pokemon selection |
| **D&D Rules** | Game mechanics specific to the D&D Companion app (HP calculation, attribute rolls) |

## 3. Requirements, Constraints & Guidelines

### Requirements

- **REQ-001**: The autocomplete component shall display a dropdown list of matching Pokemon species as the user types
- **REQ-002**: The dropdown shall show at minimum 5 and maximum 10 suggestions at a time
- **REQ-003**: Upon selecting a Pokemon from the dropdown, the form shall auto-fill:
  - `type` (species name, capitalized)
  - `type1` (primary type)
  - `type2` (secondary type, if applicable)
  - Display the Pokemon sprite image in the form header
- **REQ-004**: The autocomplete shall support partial matching (e.g., "pik" matches "Pikachu")
- **REQ-005**: The autocomplete shall debounce API calls by 300ms to reduce unnecessary requests
- **REQ-006**: Loading state shall be indicated to the user during API fetches

### Constraints

- **CON-001**: HP, attributes, experience, level, and attacks shall NOT be auto-filled (governed by D&D rules)
- **CON-002**: API calls shall not exceed PokeAPI fair use policy (cache locally, limit frequency)
- **CON-003**: The autocomplete shall gracefully degrade if PokeAPI is unavailable

### Guidelines

- **GUD-001**: Follow existing component patterns in `src/features/pokemon/components/`
- **GUD-002**: Use Tailwind CSS classes consistent with existing glassmorphism styling
- **GUD-003**: Implement proper TypeScript types for PokeAPI responses
- **GUD-004**: Handle network errors with user-friendly fallback messages

## 4. Interfaces & Data Contracts

### PokemonAutocomplete Component Props

```typescript
interface PokemonAutocompleteProps {
  value: string;
  onSelect: (pokemon: PokemonAutocompleteResult) => void;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  testIds?: {
    input?: string;
    dropdown?: string;
    option?: string;
  };
}
```

### PokemonAutocompleteResult

```typescript
interface PokemonAutocompleteResult {
  name: string;           // Pokemon species name
  displayName: string;    // Formatted display name (capitalized)
  types: [PokemonType, PokemonType?];  // Primary and optional secondary type
  spriteUrl: string;      // Official artwork URL
}
```

### PokeAPI Response Types

```typescript
// GET https://pokeapi.co/api/v2/pokemon-species/?limit=1000
interface PokemonSpeciesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

// GET https://pokeapi.co/api/v2/pokemon/{id or name}/
interface PokemonDetailResponse {
  name: string;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string | null;
      };
    };
  };
}
```

### Store Integration

```typescript
// The form component receives the onChange callback which handles auto-fill
type PokemonFormOnChange = (updated: Partial<Pokemon>) => void;
```

## 5. Acceptance Criteria

- **AC-001**: Given a user starts typing "Pikachu" in the species field, When they have typed "pik", Then a dropdown appears with "Pikachu" as the first suggestion
- **AC-002**: Given a user selects "Pikachu" from the autocomplete dropdown, Then the form auto-fills type1 as "electric", type as "Pikachu", and displays the Pikachu sprite
- **AC-003**: Given a user selects a dual-type Pokemon (e.g., "Charizard"), Then both type1 and type2 are populated correctly
- **AC-004**: Given a user selects a single-type Pokemon (e.g., "Pikachu"), Then type2 remains empty/null
- **AC-005**: Given the PokeAPI is unavailable, When a user types in the autocomplete, Then an error message is displayed and the user can still manually enter data
- **AC-006**: Given a user is editing an existing Pokemon, When they open the autocomplete, Then the existing species name is pre-filled in the input field
- **AC-007**: Given a user has selected a Pokemon, When they clear the species field, Then all auto-filled fields remain unchanged until explicitly modified

## 6. Test Automation Strategy

### Test Levels

| Level | Scope | Location |
|-------|-------|----------|
| Unit | PokemonAutocomplete component logic, debounce, filtering | `src/features/pokemon/components/PokemonAutocomplete/*.test.tsx` |
| Integration | Form integration with PokemonForm, store updates | `src/features/pokemon/**/*.test.tsx` |
| E2E | Full user flow from typing to auto-fill | `e2e/*.spec.ts` (if Cypress/Playwright added) |

### Frameworks
- Jest for unit/integration testing
- @testing-library/react for component testing

### Test Data Management
- Mock PokeAPI responses in fixtures (`src/fixtures/pokeapi/`)
- Use `pokemonFactories.ts` for Pokemon entity test data

### Coverage Requirements
- Minimum 80% code coverage for new components
- Critical paths (selection, auto-fill) require 100% coverage

## 7. Rationale & Context

### Why PokeAPI?
PokeAPI provides a free, comprehensive, and well-documented REST API for Pokemon data. It includes all species names, types, and sprite URLs needed for this feature. The API requires no authentication and has generous rate limits for typical usage patterns.

### Auto-fill vs. Manual Entry
Users often know the Pokemon they want to add but must look up types manually. Auto-fill reduces friction while respecting D&D game mechanics by not overwriting HP and attributes, which are calculated using D&D rules specific to this companion app.

### Caching Strategy
PokeAPI recommends caching resources locally. The species list (one-time fetch of ~1000 names) should be cached in component state or a simple in-memory cache to avoid repeated requests.

## 8. Dependencies & External Integrations

### External Systems

- **EXT-001**: PokeAPI - REST API providing Pokemon species data
  - Base URL: `https://pokeapi.co/api/v2/`
  - Endpoints used:
    - `GET /pokemon-species/?limit=1000` - Fetch all Pokemon names for autocomplete
    - `GET /pokemon/{name}/` - Fetch Pokemon details (types, sprites)

### Third-Party Services

- **SVC-001**: PokeAPI
  - SLA: No guaranteed uptime; graceful degradation required
  - Rate limits: None officially, but caching is recommended per fair use policy

### Infrastructure Dependencies

- **INF-001**: Internet connectivity - Required for API calls
- **INF-002**: No backend infrastructure required - All client-side

### Data Dependencies

- **DAT-001**: Pokemon species list - Fetched once, cached in memory
- **DAT-002**: Pokemon detail data - Fetched per selection

### Technology Platform Dependencies

- **PLT-001**: React 19 - For component implementation
- **PLT-002**: Next.js 15 - For application framework
- **PLT-003**: TypeScript 5 - For type safety

## 9. Examples & Edge Cases

### Example: Selecting Pikachu

1. User navigates to `/pokemon/new`
2. User clicks on Species field
3. User types "pik"
4. After 300ms debounce, autocomplete fetches from PokeAPI
5. Dropdown shows: "Pikachu", "Pikachu-Raichu" (if exists), etc.
6. User clicks "Pikachu"
7. API fetches Pikachu details
8. Form auto-fills:
   - `type`: "Pikachu"
   - `type1`: "electric"
   - `type2`: null
   - Sprite displays in header

### Edge Cases

| Case | Handling |
|------|----------|
| Pokemon name with special characters (e.g., "Mr. Mime") | PokeAPI returns "mr-mime"; display formatted as "Mr. Mime" |
| API timeout | Show error toast, allow manual entry |
| Empty search results | Display "No Pokemon found" message |
| Rapid typing | Debounce prevents excessive API calls |
| Form edit with pre-existing data | Preserve existing values on clear |

## 10. Validation Criteria

The implementation is compliant when:

1. Autocomplete dropdown appears within 500ms of typing
2. Pokemon selection auto-fills type1, type2, and species name
3. HP and attributes remain unchanged after Pokemon selection
4. Error state is displayed gracefully when API fails
5. All new components have >80% test coverage
6. TypeScript compilation succeeds with no errors
7. ESLint passes with no warnings on new code

## 11. Related Specifications / Further Reading

- [PokeAPI Documentation](https://pokeapi.co/docs/v2)
- [PokemonForm Component](../src/features/pokemon/components/PokemonForm/index.tsx)
- [Pokemon Type Definitions](../src/types/pokemon.ts)
- [Existing Component Patterns](../src/components/shared/)
