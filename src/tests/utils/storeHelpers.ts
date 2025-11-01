/**
 * Test Store Helpers
 *
 * Centralized utilities for preparing / mutating the real Zustand app store
 * during tests without re‑implementing ad‑hoc logic in each spec file.
 *
 * Goals:
 * - Deterministic seeding of Pokemon and Trainer data.
 * - Single reset path that clears persisted localStorage state.
 * - Keep behavior aligned with production store (do NOT mock or replace).
 *
 * Usage examples (in a test):
 *   import { resetStore, seedPokemon, seedTrainer } from "@/tests/utils/storeHelpers";
 *
 *   beforeEach(() => {
 *     resetStore(); // clears store & persisted storage
 *     seedTrainer(); // adds default trainer
 *     seedPokemon("pikachu-uuid"); // adds default Pikachu under that uuid
 *   });
 *
 * You can override fields:
 *   seedPokemon("custom-uuid", { type: "Bulbasaur", level: 10, currentHP: 15 });
 *
 * All helpers operate on the real `useAppStore` exported by the app.
 */

import { useAppStore } from "@/store";
import { testFixtures, testPokemon } from "@/fixtures";
import { Pokemon, PokemonTeam } from "@/types/pokemon";
import type { StatusEffect } from "@/types/pokemon";
import { Trainer } from "@/types/trainer";

/**
 * Options for resetStore.
 */
interface ResetOptions {
  /**
   * Whether to clear persisted localStorage entry (`app-store`).
   * Defaults to true for clean isolation.
   */
  clearLocalStorage?: boolean;
}

/**
 * Reset the Zustand store to an empty baseline.
 * Also clears localStorage persisted state unless disabled.
 */
export function resetStore(options: ResetOptions = {}) {
  const { clearLocalStorage = true } = options;

  if (clearLocalStorage && typeof window !== "undefined") {
    try {
      localStorage.removeItem("app-store");
    } catch {
      // Ignore localStorage access errors in non-browser environments.
    }
  }

  // Use production reset to preserve invariants.
  useAppStore.getState().reset();

  return useAppStore.getState();
}

/**
 * Seed the store with the default trainer fixture or a provided trainer.
 * Returns the trainer applied.
 */
export function seedTrainer(trainer?: Trainer): Trainer {
  const finalTrainer =
    trainer ?? (testFixtures.trainer as Trainer) ?? testFixtures.trainer;

  useAppStore.getState().setTrainer(finalTrainer);
  return finalTrainer;
}

/**
 * Obtain a deterministic "default" Pokemon from fixture set.
 * Picks the first entry in testPokemon (stable ordering in source file).
 */
function getDefaultPokemon(): Pokemon {
  const first = Object.values(testPokemon)[0];
  // Clone to avoid shared mutation.
  return JSON.parse(JSON.stringify(first)) as Pokemon;
}

/**
 * Seed a single Pokemon into the store under the provided uuid.
 * If `pokemon` is omitted, uses a deterministic default fixture.
 * Returns the Pokemon that was inserted.
 */
export function seedPokemon(uuid: string, pokemon?: Partial<Pokemon>): Pokemon {
  const base = pokemon
    ? { ...getDefaultPokemon(), ...pokemon }
    : getDefaultPokemon();

  // Ensure attacks array exists (store logic expects it).
  base.attacks = base.attacks || [];

  // Clamp numeric invariants.
  if (base.currentHP > base.maxHP) base.currentHP = base.maxHP;
  if (base.currentHP < 0) base.currentHP = 0;
  if (base.experience < 0) base.experience = 0;
  if (base.experienceToNext < 1) base.experienceToNext = 1;

  useAppStore.getState().addPokemon(base, uuid);
  return base;
}

/**
 * Bulk team seeding helper.
 *
 * @param teamMap A map of uuid -> Partial<Pokemon>. If a value is `null`/`undefined`
 *                the default fixture base is used.
 * @returns The final PokemonTeam inserted.
 */
export function seedTeam(
  teamMap: Record<string, Partial<Pokemon> | undefined>,
): PokemonTeam {
  const inserted: PokemonTeam = {};
  for (const [uuid, partial] of Object.entries(teamMap)) {
    inserted[uuid] = seedPokemon(uuid, partial);
  }
  return inserted;
}

/**
 * Convenience for setting a primary status on an existing Pokemon by uuid.
 * Creates the Pokemon first if it does not exist.
 */
export function setPrimaryStatus(
  uuid: string,
  effect: StatusEffect | null,
): void {
  const state = useAppStore.getState();

  if (!state.pokemonTeam[uuid]) {
    seedPokemon(uuid);
  }
  state.setPrimaryStatus(uuid, effect);
}

/**
 * Convenience for setting confusion status.
 */
export function setConfusion(uuid: string, effect: StatusEffect | null): void {
  const state = useAppStore.getState();
  if (!state.pokemonTeam[uuid]) {
    seedPokemon(uuid);
  }
  state.setConfusion(uuid, effect);
}

/**
 * Add a temporary effect (e.g., flinching) to a Pokemon.
 */
export function addTemporaryEffect(uuid: string, effect: StatusEffect): void {
  const state = useAppStore.getState();
  if (!state.pokemonTeam[uuid]) {
    seedPokemon(uuid);
  }
  state.addTemporaryEffect(uuid, effect);
}

/**
 * Clear all statuses for a Pokemon (primary, confusion, temporary).
 */
export function clearAllStatus(uuid: string): void {
  const state = useAppStore.getState();
  if (!state.pokemonTeam[uuid]) {
    seedPokemon(uuid);
  }
  state.clearAllStatus(uuid);
}

/**
 * Helper to access current raw store state (discourage direct mutation in tests).
 */
export function getStoreState() {
  return useAppStore.getState();
}

/**
 * Helper to read the current PokemonTeam from store (shorthand).
 */
export function getTeam(): PokemonTeam {
  return useAppStore.getState().pokemonTeam;
}

/**
 * Helper to retrieve a single Pokemon by uuid.
 */
export function getPokemon(uuid: string): Pokemon | undefined {
  return useAppStore.getState().pokemonTeam[uuid];
}
