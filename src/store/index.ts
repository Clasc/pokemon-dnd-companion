import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Attack, Pokemon, PokemonTeam } from "../types/pokemon";
import { Trainer } from "../types/trainer";
import { createSelectors } from "./utils";

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
}

export const useAppStore = createSelectors(
  create<AppState>()(
    persist(
      (set) => ({
        pokemonTeam: {},
        trainer: null,
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
        setTrainer: (trainer) => set({ trainer }),
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

            return {
              pokemonTeam: {
                ...state.pokemonTeam,
                [pokemonUuid]: {
                  ...pokemon,
                  currentHP: newCurrentHP,
                },
              },
            };
          }),
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
