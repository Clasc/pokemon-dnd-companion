export interface Pokemon {
  id: number;
  name: string;
  type1: PokemonType;
  type2?: PokemonType;
  level: number;
  currentHP: number;
  maxHP: number;
  experience: number;
  experienceToNext: number;
  sprite?: string;
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  attacks?: {
    name: string;
    type: PokemonType;
    power: number;
    accuracy: number;
    pp: number;
  }[];

  status?: {
    condition: string;
    duration?: number; // Duration in turns, if applicable
  };
}

export enum PokemonType {
  NORMAL = "normal",
  FIRE = "fire",
  WATER = "water",
  ELECTRIC = "electric",
  GRASS = "grass",
  ICE = "ice",
  FIGHTING = "fighting",
  POISON = "poison",
  GROUND = "ground",
  FLYING = "flying",
  PSYCHIC = "psychic",
  BUG = "bug",
  ROCK = "rock",
  GHOST = "ghost",
  DRAGON = "dragon",
  DARK = "dark",
  STEEL = "steel",
  FAIRY = "fairy",
}

export interface PokemonTeam {
  pokemon: Pokemon[];
}

export const TYPE_COLORS: Record<PokemonType, string> = {
  [PokemonType.NORMAL]: "#A8A878",
  [PokemonType.FIRE]: "#F08030",
  [PokemonType.WATER]: "#6890F0",
  [PokemonType.ELECTRIC]: "#F8D030",
  [PokemonType.GRASS]: "#78C850",
  [PokemonType.ICE]: "#98D8D8",
  [PokemonType.FIGHTING]: "#C03028",
  [PokemonType.POISON]: "#A040A0",
  [PokemonType.GROUND]: "#E0C068",
  [PokemonType.FLYING]: "#A890F0",
  [PokemonType.PSYCHIC]: "#F85888",
  [PokemonType.BUG]: "#A8B820",
  [PokemonType.ROCK]: "#B8A038",
  [PokemonType.GHOST]: "#705898",
  [PokemonType.DRAGON]: "#7038F8",
  [PokemonType.DARK]: "#705848",
  [PokemonType.STEEL]: "#B8B8D0",
  [PokemonType.FAIRY]: "#EE99AC",
};

export const DEFAULT_POKEMON: Omit<Pokemon, "id"> = {
  name: "",
  type1: PokemonType.NORMAL,
  level: 1,
  currentHP: 0,
  maxHP: 0,
  experience: 0,
  experienceToNext: 100,
};

// Sample Pokemon data for the mockup
export const SAMPLE_POKEMON: Pokemon[] = [
  {
    id: 25,
    name: "Pikachu",
    type1: PokemonType.ELECTRIC,
    level: 25,
    currentHP: 78,
    maxHP: 95,
    experience: 0,
    experienceToNext: 250,
    sprite: "⚡",
  },
  {
    id: 6,
    name: "Charizard",
    type1: PokemonType.FIRE,
    type2: PokemonType.FLYING,
    level: 36,
    currentHP: 125,
    maxHP: 140,
    experience: 1500,
    experienceToNext: 1800,
    sprite: "🔥",
  },
  {
    id: 150,
    name: "Mewtwo",
    type1: PokemonType.PSYCHIC,
    level: 42,
    currentHP: 98,
    maxHP: 155,
    experience: 2100,
    experienceToNext: 2500,
    sprite: "🧠",
  },
  {
    id: 133,
    name: "Eevee",
    type1: PokemonType.NORMAL,
    level: 18,
    currentHP: 52,
    maxHP: 65,
    experience: 320,
    experienceToNext: 400,
    sprite: "🦊",
  },
  {
    id: 3,
    name: "Bulbasaur",
    type1: PokemonType.GRASS,
    type2: PokemonType.POISON,
    level: 22,
    currentHP: 68,
    maxHP: 80,
    experience: 580,
    experienceToNext: 700,
    sprite: "🌱",
  },
];
