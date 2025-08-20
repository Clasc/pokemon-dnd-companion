import React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Pokemon, PokemonTeam } from "../../types/pokemon";
import { Trainer } from "../../types/trainer";
import { createSelectors } from "../../store/utils";

// Mock data for testing
export const mockPokemon: Pokemon = {
  type: "Pikachu",
  name: "Thunder",
  type1: "electric",
  level: 25,
  currentHP: 78,
  maxHP: 95,
  experience: 1250,
  experienceToNext: 500,
  attacks: [
    {
      name: "Thunderbolt",
      currentPp: 10,
      maxPp: 15,
      actionType: "action",
      moveBonus: 3,
      damageDice: "d10",
      specialEffect: "Paralyzes on 20",
      description: "A powerful electric attack that may paralyze the target.",
    },
    {
      name: "Quick Attack",
      currentPp: 5,
      maxPp: 10,
      actionType: "bonus action",
      moveBonus: 2,
      damageDice: "d6",
      specialEffect: "None",
      description: "A fast attack that always goes first.",
    },
  ],
  attributes: {
    strength: 12,
    dexterity: 16,
    constitution: 11,
    intelligence: 14,
    wisdom: 13,
    charisma: 15,
  },
  status: {
    condition: "healthy",
  },
};

export const mockPokemonWithSecondType: Pokemon = {
  type: "Charizard",
  name: "Blaze",
  type1: "fire",
  type2: "flying",
  level: 36,
  currentHP: 125,
  maxHP: 140,
  experience: 2100,
  experienceToNext: 400,
  attacks: [],
  attributes: {
    strength: 18,
    dexterity: 14,
    constitution: 16,
    intelligence: 12,
    wisdom: 13,
    charisma: 15,
  },
  status: {
    condition: "burned",
    duration: 3,
  },
};

export const mockPokemonLowHP: Pokemon = {
  type: "Eevee",
  name: "Eve",
  type1: "normal",
  level: 18,
  currentHP: 15,
  maxHP: 65,
  experience: 800,
  experienceToNext: 200,
  attacks: [
    {
      name: "Quick Attack",
      currentPp: 5,
      maxPp: 10,
      actionType: "action",
      moveBonus: 2,
      damageDice: "d6",
      specialEffect: "None",
      description: "A fast attack that always goes first.",
    },
    {
      name: "Tail Whip",
      currentPp: 3,
      maxPp: 5,
      actionType: "bonus action",
      moveBonus: 0,
      specialEffect: "Lowers defense",
      description: "Lowers the target's defense.",
    },
  ],
  attributes: {
    strength: 10,
    dexterity: 12,
    constitution: 10,
    intelligence: 11,
    wisdom: 12,
    charisma: 14,
  },
};

export const mockPokemonTeam: PokemonTeam = {
  "uuid-1": mockPokemon,
  "uuid-2": mockPokemonWithSecondType,
  "uuid-3": mockPokemonLowHP,
};

export const mockTrainer: Trainer = {
  name: "Ash Ketchum",
  level: 15,
  class: "Pokemon Trainer",
  currentHP: 45,
  maxHP: 60,
  attributes: {
    strength: 12,
    dexterity: 14,
    constitution: 13,
    intelligence: 15,
    wisdom: 16,
    charisma: 18,
  },
  inventory: [
    {
      id: "1",
      name: "Potion",
      quantity: 3,
      description: "Restores 20 HP",
    },
    {
      id: "2",
      name: "Pokeball",
      quantity: 5,
    },
  ],
};

// Store interface for testing
interface TestAppState {
  pokemonTeam: PokemonTeam;
  trainer: Trainer | null;
  addPokemon: (pokemon: Pokemon, uuid?: string) => void;
  updatePokemon: (updatedPokemon: Pokemon, uuid: string) => void;
  removePokemon: (id: string) => void;
  setTrainer: (trainer: Trainer) => void;
}

// Create test store factory
export const createTestStore = (initialState: Partial<TestAppState> = {}) => {
  return createSelectors(
    create<TestAppState>()(
      persist(
        (set) => ({
          pokemonTeam: {},
          trainer: null,
          addPokemon: (pokemon: Pokemon, uuid: string = crypto.randomUUID()) =>
            set((state) => ({
              pokemonTeam: { ...state.pokemonTeam, [uuid]: pokemon },
            })),
          updatePokemon: (updatedPokemon: Pokemon, uuid: string) =>
            set((state) => ({
              pokemonTeam: {
                ...state.pokemonTeam,
                [uuid]: { ...state.pokemonTeam[uuid], ...updatedPokemon },
              },
            })),
          removePokemon: (id: string) =>
            set((state) => {
              const { [id]: _removed, ...restTeam } = state.pokemonTeam;
              return {
                pokemonTeam: restTeam,
              };
            }),
          setTrainer: (trainer: Trainer) => set({ trainer }),
          ...initialState,
        }),
        {
          name: "test-app-store",
          partialize: (state) => ({
            pokemonTeam: state.pokemonTeam,
            trainer: state.trainer,
          }),
        },
      ),
    ),
  );
};

// Test wrapper component to provide store context
export const createTestWrapper = (store: object) => {
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => {
    jest.doMock("../../store", () => ({
      useAppStore: store,
    }));

    return React.createElement(React.Fragment, null, children);
  };
};

// Helper to calculate expected team stats
export const calculateTeamStats = (team: PokemonTeam) => {
  const pokemon = Object.values(team);
  const totalLevels = pokemon.reduce((sum, p) => sum + p.level, 0);
  const totalHP = pokemon.reduce((sum, p) => sum + p.currentHP, 0);
  const avgHealth =
    pokemon.length > 0
      ? Math.round(
          pokemon.reduce(
            (sum, p) => sum + (p.maxHP > 0 ? (p.currentHP / p.maxHP) * 100 : 0),
            0,
          ) / pokemon.length,
        )
      : 0;

  return { totalLevels, totalHP, avgHealth };
};
