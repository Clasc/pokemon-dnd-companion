export interface PokeAPINamedResource {
  name: string;
  url: string;
}

export interface PokeAPIPokemonSpeciesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeAPINamedResource[];
}

export interface PokeAPIPokemonType {
  slot: number;
  type: PokeAPINamedResource;
}

export interface PokeAPIPokemonSprites {
  other: {
    "official-artwork": {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface PokeAPIPokemonDetailResponse {
  id: number;
  name: string;
  types: PokeAPIPokemonType[];
  sprites: PokeAPIPokemonSprites;
}

export interface PokemonAutocompleteResult {
  name: string;
  displayName: string;
  types: [PokemonType, PokemonType?] | [];
  spriteUrl: string;
}

type PokemonType =
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

export const POKEAPI_TYPES: PokemonType[] = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isValidPokemonType(type: string): type is PokemonType {
  return POKEAPI_TYPES.includes(type as PokemonType);
}
