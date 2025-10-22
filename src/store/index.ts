import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Attack, Pokemon, PokemonTeam, StatusEffect } from "../types/pokemon";
import { Trainer } from "../types/trainer";
import { createSelectors } from "./utils";
import { testFixtures } from "../fixtures";

interface AppState {
  pokemonTeam: PokemonTeam;
  trainer: Trainer | null;
  addPokemon: (pokemon: Pokemon) => void;
  updatePokemon: (updatedPokemon: Pokemon, uuid: string) => void;
  removePokemon: (id: string) => void;
  setTrainer: (trainer: Trainer) => void;
  addAttack: (pokemonUuid: string, attackIndex: number, attack: Attack) => void;
  decreaseAttackPP: (pokemonUuid: string, attackIndex: number) => void;
  modifyPokemonHP: (pokemonUuid: string, hpChange: number) => void;
  gainExperience: (pokemonUuid: string, xpGained: number) => void;
  setPrimaryStatus: (pokemonUuid: string, status: StatusEffect | null) => void;
  setConfusion: (pokemonUuid: string, confusion: StatusEffect | null) => void;
  addTemporaryEffect: (pokemonUuid: string, effect: StatusEffect) => void;
  removeTemporaryEffect: (pokemonUuid: string, effectIndex: number) => void;
  clearAllStatus: (pokemonUuid: string) => void;
  reset: () => void;
}

// Helper function to check if we should load test data
export const shouldLoadTestData = (): boolean => {
  // Only in development
  if (process.env.NODE_ENV !== "development") {
    return false;
  }

  // Check if localStorage is empty
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const existingData = localStorage.getItem("app-store");
    return !existingData || existingData === "{}";
  } catch {
    return false;
  }
};

// Get initial state with test data if needed
const getInitialState = () => {
  if (shouldLoadTestData()) {
    return {
      pokemonTeam: testFixtures.pokemonTeam,
      trainer: testFixtures.trainer,
    };
  }

  return {
    pokemonTeam: {},
    trainer: null,
  };
};

export const useAppStore = createSelectors(
  create<AppState>()(
    persist(
      (set) => ({
        ...getInitialState(),
        addPokemon: (pokemon, uuid: string = crypto.randomUUID()) =>
          set((state) => ({
            pokemonTeam: {
              ...state.pokemonTeam,
              [uuid]: { ...pokemon, attacks: pokemon.attacks || [] },
            },
          })),
        updatePokemon: (updatedPokemon, uuid: string) =>
          set((state) => ({
            pokemonTeam: {
              ...state.pokemonTeam,
              [uuid]: { ...state.pokemonTeam[uuid], ...updatedPokemon },
            },
          })),
        removePokemon: (id) =>
          set((state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [id]: _removed, ...restTeam } = state.pokemonTeam;
            return {
              pokemonTeam: restTeam,
            };
          }),
        setTrainer: (trainer) =>
          set({ trainer: { ...trainer, inventory: trainer.inventory || [] } }),
        addAttack: (pokemonUuid, attackIndex, attack) =>
          set((state) => {
            const pokemon = state.pokemonTeam[pokemonUuid];
            if (!pokemon) return state;

            const newAttacks = [...(pokemon.attacks || [])];
            newAttacks[attackIndex] = {
              ...attack,
              currentPp: attack.maxPp,
            };

            return {
              pokemonTeam: {
                ...state.pokemonTeam,
                [pokemonUuid]: {
                  ...pokemon,
                  attacks: newAttacks,
                },
              },
            };
          }),
        decreaseAttackPP: (pokemonUuid, attackIndex) =>
          set((state) => {
            const pokemon = state.pokemonTeam[pokemonUuid];
            if (!pokemon || !pokemon.attacks?.[attackIndex]) return state;

            const newAttacks = [...pokemon.attacks];
            const attack = { ...newAttacks[attackIndex] };

            if (attack.currentPp > 0) {
              attack.currentPp -= 1;
            }
            newAttacks[attackIndex] = attack;
            return {
              pokemonTeam: {
                ...state.pokemonTeam,
                [pokemonUuid]: {
                  ...pokemon,
                  attacks: newAttacks,
                },
              },
            };
          }),
        modifyPokemonHP: (pokemonUuid, hpChange) =>
          set((state) => {
            const pokemon = state.pokemonTeam[pokemonUuid];
            if (!pokemon) return state;

            const newCurrentHP = Math.max(
              0,
              Math.min(pokemon.maxHP, pokemon.currentHP + hpChange),
            );

            // Clear confusion when Pokemon faints (HP reaches 0)
            const updatedPokemon = {
              ...pokemon,
              currentHP: newCurrentHP,
            };

            if (newCurrentHP === 0 && pokemon.confusion) {
              updatedPokemon.confusion = undefined;
            }

            return {
              pokemonTeam: {
                ...state.pokemonTeam,
                [pokemonUuid]: updatedPokemon,
              },
            };
          }),
        gainExperience: (pokemonUuid, xpGained) =>
          set((state) => {
            const pokemon = state.pokemonTeam[pokemonUuid];
            if (!pokemon || xpGained <= 0) return state;

            const newExperience = pokemon.experience + xpGained;
            let newLevel = pokemon.level;
            let newExperienceToNext = pokemon.experienceToNext;

            // Simple level up logic: if gained XP exceeds experienceToNext, level up
            if (xpGained >= pokemon.experienceToNext) {
              newLevel += 1;
              const remainingXP = xpGained - pokemon.experienceToNext;
              // Reset experience to remaining XP after level up
              // For simplicity, assume each level requires 100 more XP than the previous
              newExperienceToNext = 100 * newLevel - remainingXP;
              if (newExperienceToNext <= 0) {
                newExperienceToNext = 100; // Minimum XP needed for next level
              }
            } else {
              newExperienceToNext = pokemon.experienceToNext - xpGained;
            }

            return {
              pokemonTeam: {
                ...state.pokemonTeam,
                [pokemonUuid]: {
                  ...pokemon,
                  experience: newExperience,
                  experienceToNext: newExperienceToNext,
                  level: newLevel,
                },
              },
            };
          }),
        setPrimaryStatus: (pokemonUuid, status) =>
          set((state) => {
            const pokemon = state.pokemonTeam[pokemonUuid];
            if (!pokemon) return state;

            return {
              pokemonTeam: {
                ...state.pokemonTeam,
                [pokemonUuid]: {
                  ...pokemon,
                  primaryStatus: status || undefined,
                },
              },
            };
          }),
        setConfusion: (pokemonUuid, confusion) =>
          set((state) => {
            const pokemon = state.pokemonTeam[pokemonUuid];
            if (!pokemon) return state;

            return {
              pokemonTeam: {
                ...state.pokemonTeam,
                [pokemonUuid]: {
                  ...pokemon,
                  confusion: confusion || undefined,
                },
              },
            };
          }),
        addTemporaryEffect: (pokemonUuid, effect) =>
          set((state) => {
            const pokemon = state.pokemonTeam[pokemonUuid];
            if (!pokemon) return state;

            const currentEffects = pokemon.temporaryEffects || [];
            return {
              pokemonTeam: {
                ...state.pokemonTeam,
                [pokemonUuid]: {
                  ...pokemon,
                  temporaryEffects: [...currentEffects, effect],
                },
              },
            };
          }),
        removeTemporaryEffect: (pokemonUuid, effectIndex) =>
          set((state) => {
            const pokemon = state.pokemonTeam[pokemonUuid];
            if (!pokemon || !pokemon.temporaryEffects) return state;

            const newEffects = [...pokemon.temporaryEffects];
            newEffects.splice(effectIndex, 1);

            return {
              pokemonTeam: {
                ...state.pokemonTeam,
                [pokemonUuid]: {
                  ...pokemon,
                  temporaryEffects:
                    newEffects.length > 0 ? newEffects : undefined,
                },
              },
            };
          }),
        clearAllStatus: (pokemonUuid) =>
          set((state) => {
            const pokemon = state.pokemonTeam[pokemonUuid];
            if (!pokemon) return state;

            return {
              pokemonTeam: {
                ...state.pokemonTeam,
                [pokemonUuid]: {
                  ...pokemon,
                  primaryStatus: undefined,
                  confusion: undefined,
                  temporaryEffects: undefined,
                },
              },
            };
          }),
        reset: () =>
          set(() => ({
            pokemonTeam: {},
            trainer: null,
          })),
        isLoading: true,
      }),
      {
        name: "app-store",
        partialize: (state) => ({
          pokemonTeam: state.pokemonTeam,
          trainer: state.trainer,
        }),
      },
    ),
  ),
);
