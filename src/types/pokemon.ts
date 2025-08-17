export type ActionType = "action" | "bonus action";

export interface Attack {
  name: string;
  currentPp: number;
  maxPp: number;
  actionType: ActionType;
  moveBonus: number;
  specialEffect?: string;
  damageDice?: "d4" | "d6" | "d10";
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
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};
