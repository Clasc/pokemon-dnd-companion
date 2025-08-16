import { Trainer, DEFAULT_TRAINER } from "../types/trainer";
import { Pokemon, SAMPLE_POKEMON } from "../types/pokemon";

const STORAGE_KEY = "pokemon-dnd-character";
const POKEMON_STORAGE_KEY = "pokemon-dnd-team";

export const saveTrainer = (character: Trainer): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
  } catch (error) {
    console.error("Failed to save character to localStorage:", error);
  }
};

export const loadTrainer = (): Trainer => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure all required fields exist with defaults
      return {
        ...DEFAULT_TRAINER,
        ...parsed,
        attributes: {
          ...DEFAULT_TRAINER.attributes,
          ...parsed.attributes,
        },
      };
    }
  } catch (error) {
    console.error("Failed to load character from localStorage:", error);
  }
  return DEFAULT_TRAINER;
};

export const clearCharacter = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear character from localStorage:", error);
  }
};

// Pokemon storage utilities
export const savePokemonTeam = (pokemon: Pokemon[]): void => {
  try {
    localStorage.setItem(POKEMON_STORAGE_KEY, JSON.stringify(pokemon));
  } catch (error) {
    console.error("Failed to save Pokemon team to localStorage:", error);
  }
};

export const loadPokemonTeam = (): Pokemon[] => {
  try {
    const stored = localStorage.getItem(POKEMON_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : SAMPLE_POKEMON;
    }
  } catch (error) {
    console.error("Failed to load Pokemon team from localStorage:", error);
  }
  return SAMPLE_POKEMON;
};

export const clearPokemonTeam = (): void => {
  try {
    localStorage.removeItem(POKEMON_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear Pokemon team from localStorage:", error);
  }
};

export const updatePokemonInTeam = (
  pokemonId: number,
  updates: Partial<Pokemon>,
): Pokemon[] => {
  const team = loadPokemonTeam();
  const updatedTeam = team.map((pokemon) =>
    pokemon.id === pokemonId ? { ...pokemon, ...updates } : pokemon,
  );
  savePokemonTeam(updatedTeam);
  return updatedTeam;
};
