import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Pokemon } from "../types/pokemon";
import { Trainer } from "../types/trainer";
import { createSelectors } from "./utils";

interface AppState {
  pokemonList: Pokemon[];
  trainer: Trainer | null;
  addPokemon: (pokemon: Pokemon) => void;
  updatePokemon: (updatedPokemon: Pokemon) => void;
  removePokemon: (id: number) => void;
  setTrainer: (trainer: Trainer) => void;
}

export const useAppStore = createSelectors(
  create<AppState>()(
    persist(
      (set) => ({
        pokemonList: [],
        trainer: null,
        addPokemon: (pokemon) =>
          set((state) => ({ pokemonList: [...state.pokemonList, pokemon] })),
        updatePokemon: (updatedPokemon) =>
          set((state) => ({
            pokemonList: state.pokemonList.map((p) =>
              p.id === updatedPokemon.id ? updatedPokemon : p,
            ),
          })),
        removePokemon: (id) =>
          set((state) => ({
            pokemonList: state.pokemonList.filter((p) => p.id !== id),
          })),
        setTrainer: (trainer) => set({ trainer: trainer }),
      }),
      {
        name: "app-store",
        partialize: (state) => ({
          pokemonList: state.pokemonList,
          trainer: state.trainer,
        }),
      },
    ),
  ),
);
