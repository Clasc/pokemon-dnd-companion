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

export interface StatusEffect {
  condition: StatusCondition;
  duration?: number; // Duration in turns, if applicable
  turnsActive?: number; // For tracking escalating effects
}

export type StatusCondition =
  | "burned"
  | "frozen"
  | "paralyzed"
  | "poisoned"
  | "badly-poisoned"
  | "asleep"
  | "confused"
  | "flinching"
  | "none";

export interface Pokemon {
  type: string; // e.g., "Pikachu", "Charizard"
  name: string;
  type1?: PokemonType;
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

  primaryStatus?: StatusEffect; // Mutually exclusive conditions
  confusion?: StatusEffect; // Special case - can coexist with primary
  temporaryEffects?: StatusEffect[]; // Flinching, etc.
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

export const STATUS_COLORS: Record<StatusCondition, Color> = {
  burned: "#FF6B35",
  frozen: "#4ECDC4",
  paralyzed: "#FFE66D",
  poisoned: "#8E44AD",
  "badly-poisoned": "#6C3483",
  asleep: "#5DADE2",
  confused: "#F39C12",
  flinching: "#95A5A6",
  none: "#00000000",
};

export type Attributes = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};
