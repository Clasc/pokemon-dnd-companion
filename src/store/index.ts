import { create } from "zustand";
import { Pokemon } from "../types/pokemon";
import { Trainer } from "../types/trainer";
import { loadPokemonTeam, loadTrainer } from "@/utils/storage";

interface AppState {
  pokemonList: Pokemon[];
  trainer: Trainer;
  addPokemon: (pokemon: Pokemon) => void;
  updatePokemon: (updatedPokemon: Pokemon) => void;
  removePokemon: (id: number) => void;
  setTrainer: (trainer: Trainer) => void;
  isLoading: boolean;
  loadData: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  pokemonList: [],
  trainer: {
    name: "",
    level: 1,
    class: "",
    attributes: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    currentHP: 0,
    maxHP: 0,
  },
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
  isLoading: true,
  loadData: () =>
    set(() => {
      const loadedTrainer = loadTrainer();
      const loadedPokemon = loadPokemonTeam();
      return {
        isLoading: false,
        trainer: loadedTrainer,
        pokemonList: loadedPokemon,
      };
    }),
}));
