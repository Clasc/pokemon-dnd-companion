export type ActionType = "action" | "bonus action";

export interface Attack {
  name: string;
  pp: number;
  actionType: ActionType;
  moveBonus: number;
  specialEffect?: string;
  damageDice: "d4" | "d6" | "d10";
  description?: string;
}

export interface Pokemon {
  type: string; // e.g., "Pikachu", "Charizard"
  name: string;
  type1: PokemonType;
  type2?: PokemonType;
  level: number;
  currentHP: number;
  maxHP: number;
  experience: number;
  experienceToNext: number;
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  attacks: Attack[];

  status?: {
    condition: string;
    duration?: number; // Duration in turns, if applicable
  };
}

export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

type uuid = string;

export interface PokemonTeam {
  [key: uuid]: Pokemon;
}

type Color = `#${string}`;

export const TYPE_COLORS: Record<PokemonType, Color> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export type Attributes = {
  strength: 55;
  dexterity: 90;
  constitution: 40;
  intelligence: 50;
  wisdom: 50;
  charisma: 60;
};

const makeAttributes = (attrs: Partial<Attributes> = {}) => ({
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
  ...attrs,
});

// Sample Pokemon data for the mockup
export const SAMPLE_TEAM: PokemonTeam = {
  "25": {
    type: "Pikachu",
    name: "Pikachu",
    type1: "electric",
    level: 25,
    currentHP: 78,
    maxHP: 95,
    experience: 0,
    experienceToNext: 250,
    attributes: makeAttributes(),
  },
  "6": {
    type: "Charizard",
    name: "Charizard",
    type1: "fire",
    type2: "flying",
    level: 36,
    currentHP: 125,
    maxHP: 140,
    experience: 1500,
    experienceToNext: 1800,
    attributes: makeAttributes(),
  },
  "150": {
    type: "Mewtwo",
    name: "Mewtwo",
    type1: "psychic",
    level: 42,
    currentHP: 98,
    maxHP: 155,
    experience: 2100,
    experienceToNext: 2500,
    attributes: makeAttributes(),
  },
  "133": {
    type: "Eevee",
    name: "Eevee",
    type1: "normal",
    level: 18,
    currentHP: 52,
    maxHP: 65,
    experience: 320,
    experienceToNext: 400,
    attributes: makeAttributes(),
  },
  "3": {
    type: "Bulbasaur",
    name: "Bulbasaur",
    type1: "grass",
    type2: "poison",
    level: 22,
    currentHP: 68,
    maxHP: 80,
    experience: 580,
    experienceToNext: 700,
    attributes: makeAttributes(),
  },
};
