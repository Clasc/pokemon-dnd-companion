import { PokemonType } from "../types/pokemon";

/**
 * A record mapping each individual Pokémon type to a representative emoji.
 * This serves as the base for single-type Pokémon and as a fallback for dual-types.
 */
export const TYPE_ICONS: Record<PokemonType, string> = {
  normal: "⭐",
  fire: "🔥",
  water: "💧",
  electric: "⚡",
  grass: "🌱",
  ice: "❄️",
  fighting: "🥊",
  poison: "☠️",
  ground: "🌍",
  flying: "🕊️",
  psychic: "🧠",
  bug: "🐛",
  rock: "🗿",
  ghost: "👻",
  dragon: "🐲",
  dark: "🌑",
  steel: "⚙️",
  fairy: "✨",
};

/**
 * A comprehensive map of Pokémon type combinations to a single representative emoji.
 * The keys are strings in the format "type1" or "type1-type2".
 *
 * For dual-types, a specific emoji is used if a fitting one exists.
 * Otherwise, it defaults to the emoji of the first type in the combination.
 */
export const ICON_MAP: Record<string, string> = {
  // Single types
  ...TYPE_ICONS,

  // Dual-type combinations
  // Format: "type1-type2": "emoji"
  // If no specific emoji fits, the first type's icon is used as a fallback.

  // Grass Combinations
  "grass-poison": "🌿", // A leafy plant, fitting for poison ivy vibes
  "grass-flying": "🌱",
  "grass-dark": "🌳", // A darker, more imposing tree
  "grass-psychic": "🍄", // Represents psychedelic/mind-altering mushrooms

  // Fire Combinations
  "fire-flying": "🔥", // As seen with Charizard
  "fire-rock": "🌋", // Volcano
  "fire-ground": "🌋",
  "fire-fighting": "🔥",

  // Water Combinations
  "water-flying": "💧",
  "water-ice": "🧊", // Ice cube is a perfect fit
  "water-ground": "늪", // A symbol representing a swamp or marsh
  "water-poison": "💧",
  "water-dark": "🌊", // Deep, dark waters

  // Bug Combinations
  "bug-flying": "🦋", // Butterfly
  "bug-poison": "🐝", // Bee or wasp
  "bug-steel": "🐞", // Ladybug, often with a hard shell
  "bug-grass": "🦗", // Cricket or grasshopper

  // Rock Combinations
  "rock-ground": "🏜️", // Desert landscape
  "rock-water": "🧱", // Wet brick or stone
  "rock-flying": "🗿",
  "rock-steel": "🔩", // Nut and bolt, fitting for rock/steel

  // Steel Combinations
  "steel-psychic": "⚙️",
  "steel-flying": "✈️", // Airplane
  "steel-fairy": "✨",

  // Ghost Combinations
  "ghost-poison": "👻",
  "ghost-fire": "🎃", // Jack-o'-lantern (Ghost/Fire type like Chandelure)
  "ghost-grass": "🎃",
  "ghost-dark": "👻",

  // Other notable combinations
  "poison-dark": "☠️",
  "poison-flying": "🦇", // Bat
  "ground-flying": "🌍",
  "electric-flying": "⚡",
  "psychic-fairy": "🧠",
  "dragon-flying": "🐲",
};

/**
 * Retrieves the corresponding emoji for a given Pokémon's type or type combination.
 *
 * @param type1 - The primary type of the Pokémon.
 * @param type2 - The optional secondary type of the Pokémon.
 * @returns The emoji string for the given type combination.
 */
export const getPokemonIcon = (
  type1: PokemonType,
  type2?: PokemonType
): string => {
  if (type2) {
    // Check for "type1-type2" combination
    const key1 = `${type1}-${type2}`;
    if (ICON_MAP[key1]) {
      return ICON_MAP[key1];
    }
    // Check for "type2-type1" combination as a fallback
    const key2 = `${type2}-${type1}`;
    if (ICON_MAP[key2]) {
      return ICON_MAP[key2];
    }
  }

  // Default to the icon of the primary type
  return TYPE_ICONS[type1];
};
