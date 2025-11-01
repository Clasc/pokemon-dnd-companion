/**
 * Test Pokemon factories.
 *
 * Deterministic helpers for creating Pokemon objects and simple teams
 * without repeating inline factory logic in individual test files.
 *
 * Goals:
 * - Provide a single place to construct valid Pokemon domain objects.
 * - Keep generated data stable across test runs (no randomness).
 * - Allow targeted overrides for specific test scenarios (HP ranges, types, statuses, etc).
 */

import {
  Pokemon,
  PokemonTeam,
  Attack,
  StatusEffect,
  StatusCondition,
} from "@/types/pokemon";
import { testPokemon } from "@/fixtures/pokemon";

/**
 * Internal counter used to generate deterministic unique names/uuids.
 * This ensures repeated calls across a single test file are predictable.
 */
let pokemonCounter = 0;

/**
 * Deep clone utility (limited scope to our Pokemon shape).
 * Avoids accidental shared references between tests (esp. attacks / status objects).
 */
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/**
 * Base template used when no fixture variant is requested.
 * Chosen to be lightweight while still structurally valid.
 */
const baseTemplate: Pokemon = {
  type: "Pikachu",
  name: "Testmon",
  type1: "electric",
  level: 5,
  currentHP: 20,
  maxHP: 30,
  experience: 100,
  experienceToNext: 200,
  attributes: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
  attacks: [],
};

/**
 * Optional preset keys referencing the canonical test fixtures.
 * These correspond to the keys inside `testPokemon` (fixture set).
 */
export type FixtureKey = keyof typeof testPokemon;

/**
 * Create a Pokemon from a fixture key OR the base template, applying overrides.
 *
 * @param overrides - Partial fields to override the template/fixture.
 * @param fromFixture - (optional) key from `testPokemon` to use as starting point.
 */
export function makePokemon(
  overrides: Partial<Pokemon> = {},
  fromFixture?: FixtureKey,
): Pokemon {
  const source: Pokemon = fromFixture
    ? clone(testPokemon[fromFixture])
    : clone(baseTemplate);

  // Merge (shallow for top-level, deep enough for our nested simple objects)
  const merged: Pokemon = {
    ...source,
    ...overrides,
    attributes: {
      ...source.attributes,
      ...(overrides.attributes || {}),
    },
    attacks: Array.isArray(overrides.attacks)
      ? overrides.attacks.map((a) => ({ ...a }))
      : source.attacks.map((a) => ({ ...a })),
    // Preserve optional status effects (allow explicit override to undefined to clear)
    primaryStatus:
      overrides.primaryStatus === undefined
        ? source.primaryStatus
        : overrides.primaryStatus,
    confusion:
      overrides.confusion === undefined
        ? source.confusion
        : overrides.confusion,
    temporaryEffects:
      overrides.temporaryEffects === undefined
        ? source.temporaryEffects
        : overrides.temporaryEffects?.map((e) => ({ ...e })),
  };

  // Ensure numeric invariants stay sensible for tests.
  if (merged.currentHP > merged.maxHP) {
    merged.currentHP = merged.maxHP;
  }
  if (merged.currentHP < 0) {
    merged.currentHP = 0;
  }
  if (merged.experience < 0) {
    merged.experience = 0;
  }
  if (merged.experienceToNext < 1) {
    merged.experienceToNext = 1;
  }

  return merged;
}

/**
 * Convenience for constructing an Attack (less boilerplate in tests).
 */
export function makeAttack(
  name: string,
  overrides: Partial<Attack> = {},
): Attack {
  return {
    name,
    currentPp: overrides.currentPp ?? overrides.maxPp ?? 10,
    maxPp: overrides.maxPp ?? 10,
    actionType: overrides.actionType ?? "action",
    moveBonus: overrides.moveBonus ?? 0,
    damageDice: overrides.damageDice,
    description: overrides.description,
    specialEffect: overrides.specialEffect,
  };
}

/**
 * Convenience for creating a simple StatusEffect.
 */
export function makeStatus(
  condition: StatusCondition,
  overrides: Partial<StatusEffect> = {},
): StatusEffect {
  return {
    condition,
    duration: overrides.duration,
    turnsActive: overrides.turnsActive ?? 0,
  };
}

/**
 * Build a deterministic PokemonTeam with a requested count.
 *
 * @param count - Number of Pokemon to create.
 * @param overridesList - Optional per-index overrides (length may be < count).
 * @param fixtureKeys - Optional fixture source per index (length may be < count).
 */
export function makeTeam(
  count: number,
  overridesList: Array<Partial<Pokemon>> = [],
  fixtureKeys: Array<FixtureKey | undefined> = [],
): PokemonTeam {
  const team: PokemonTeam = {};
  for (let i = 0; i < count; i++) {
    const overrides = overridesList[i] || {};
    const fixture = fixtureKeys[i];
    const pokemon = makePokemon(overrides, fixture);
    pokemonCounter += 1;
    const uuid = `pokemon-${pokemonCounter}`;
    team[uuid] = pokemon;
  }
  return team;
}

/**
 * Reset internal deterministic counter (use in beforeEach when you need predictable uuids).
 */
export function resetPokemonFactoryState() {
  pokemonCounter = 0;
}
