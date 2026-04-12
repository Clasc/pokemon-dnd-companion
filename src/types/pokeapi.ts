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

export interface PokeAPIMoveListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeAPINamedResource[];
}

export interface PokeAPIMoveFlavorText {
  flavor_text: string;
  language: PokeAPINamedResource;
  version: PokeAPINamedResource;
}

export interface PokeAPIMoveDetailResponse {
  id: number;
  name: string;
  pp: number;
  type: PokeAPINamedResource;
  flavor_text_entries: PokeAPIMoveFlavorText[];
}

export interface PokemonAutocompleteResult {
  name: string;
  displayName: string;
  types: [PokemonType, PokemonType?] | [];
  spriteUrl: string;
}

export interface MoveAutocompleteResult {
  name: string;
  displayName: string;
  pp: number;
  description: string;
}

export interface PokeAPIItemListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeAPINamedResource[];
}

export interface PokeAPIItemFlavorText {
  text: string;
  language: PokeAPINamedResource;
  version: PokeAPINamedResource;
}

export interface PokeAPIItemDetailResponse {
  id: number;
  name: string;
  sprites: {
    default: string | null;
  };
  flavor_text_entries: PokeAPIItemFlavorText[];
}

export interface ItemAutocompleteResult {
  name: string;
  displayName: string;
  description: string;
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

export function formatMoveName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatItemName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getEnglishItemDescription(
  flavorTextEntries: PokeAPIItemFlavorText[] | undefined,
): string {
  if (!flavorTextEntries || flavorTextEntries.length === 0) {
    return "";
  }
  const englishEntry = flavorTextEntries.find(
    (entry) => entry.language.name === "en",
  );
  if (!englishEntry) {
    return "";
  }
  return englishEntry.text.replace(/\n/g, " ");
}

export function getEnglishFlavorText(
  flavorTextEntries: PokeAPIMoveFlavorText[] | undefined,
): string {
  if (!flavorTextEntries || flavorTextEntries.length === 0) {
    return "";
  }
  const englishEntry = flavorTextEntries.find(
    (entry) => entry.language.name === "en",
  );
  if (!englishEntry) {
    return "";
  }
  return englishEntry.flavor_text.replace(/\n/g, " ");
}

export function isValidPokemonType(type: string): type is PokemonType {
  return POKEAPI_TYPES.includes(type as PokemonType);
}
