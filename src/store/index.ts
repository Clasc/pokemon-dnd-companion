import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Pokemon, PokemonTeam } from "../types/pokemon";
import { Trainer } from "../types/trainer";
import { createSelectors } from "./utils";

interface AppState {
  pokemonTeam: PokemonTeam;
  trainer: Trainer | null;
  addPokemon: (pokemon: Pokemon) => void;
  updatePokemon: (updatedPokemon: Pokemon, uuid: string) => void;
  removePokemon: (id: string) => void;
  setTrainer: (trainer: Trainer) => void;
}

export const useAppStore = createSelectors(
  create<AppState>()(
    persist(
      (set) => ({
        pokemonTeam: {},
        trainer: null,
        addPokemon: (pokemon, uuid: string = crypto.randomUUID()) =>
          set((state) => ({
            pokemonTeam: { ...state.pokemonTeam, [uuid]: pokemon },
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
