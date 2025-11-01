"use client";

import { Pokemon, Attributes, PokemonType } from "@/types/pokemon";
import { getPokemonIcon } from "@/utils/IconMapper";
import ProgressBar from "@/components/shared/ui/ProgressBar";

interface AddPokemonFormProps {
  pokemon: Pokemon;
  setPokemon: (pokemon: Pokemon | ((prev: Pokemon) => Pokemon)) => void;
}

export default function AddPokemonForm({
  pokemon,
  setPokemon,
}: AddPokemonFormProps) {
  const handleInputChange = (
    field: keyof Pokemon,
    value:
      | string
      | number
      | null
      | undefined
      | { condition: string; duration?: number },
  ) => {
    setPokemon((prev) => ({ ...prev, [field]: value }));
  };

  const handleAttributeChange = (attr: keyof Attributes, value: number) => {
    setPokemon((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attr]: value,
      },
    }));
  };

  const attributeNames: (keyof Attributes)[] = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];

  const getAttributeShortName = (attr: keyof Attributes) => {
    const shortNames = {
      strength: "STR",
      dexterity: "DEX",
      constitution: "CON",
      intelligence: "INT",
      wisdom: "WIS",
      charisma: "CHA",
    };
    return shortNames[attr];
  };

  const pokemonTypes: PokemonType[] = [
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

  // Removed local hpPercentage/xpPercentage/getHPColor logic;
  // ProgressBar now handles percentage and color internally.

  return (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto">
      {/* Pokemon Info Header */}
      <div className="flex items-start gap-4">
        {/* Pokemon Sprite/Icon */}
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-2xl border border-white/10">
          {pokemon.type1 ? getPokemonIcon(pokemon.type1, pokemon.type2) : "❓"}
        </div>

        {/* Pokemon Basic Info */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Species */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Species</label>
            <input
              type="text"
              value={pokemon.type || ""}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              placeholder="e.g., Pikachu, Charizard"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nickname</label>
            <input
              type="text"
              value={pokemon.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              placeholder="Custom name for your Pokémon"
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Level</label>
            <input
              type="number"
              min="1"
              max="100"
              value={pokemon.level}
              onChange={(e) =>
                handleInputChange("level", parseInt(e.target.value) || 1)
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Types */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">Types</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Type 1</label>
            <select
              value={pokemon.type1}
              onChange={(e) =>
                handleInputChange("type1", e.target.value as PokemonType)
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              {pokemonTypes.map((type) => (
                <option key={type} value={type} className="bg-gray-800">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Type 2 (Optional)
            </label>
            <select
              value={pokemon.type2 || ""}
              onChange={(e) =>
                handleInputChange("type2", e.target.value || null)
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option value="" className="bg-gray-800">
                None
              </option>
              {pokemonTypes.map((type) => (
                <option key={type} value={type} className="bg-gray-800">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* HP */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">Hit Points</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Current HP
            </label>
            <input
              type="number"
              min="0"
              max={pokemon.maxHP}
              value={pokemon.currentHP}
              onChange={(e) =>
                handleInputChange("currentHP", parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Max HP</label>
            <input
              type="number"
              min="1"
              value={pokemon.maxHP}
              onChange={(e) => {
                const maxHP = parseInt(e.target.value) || 1;
                handleInputChange("maxHP", maxHP);
                // Auto-set current HP to max HP when creating new Pokemon
                if (pokemon.currentHP === 0 || pokemon.currentHP > maxHP) {
                  handleInputChange("currentHP", maxHP);
                }
              }}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
        {/* HP Bar */}
        <ProgressBar
          variant="hp"
          current={pokemon.currentHP}
          max={pokemon.maxHP}
          label="HP"
          showValue={false}
          className="mt-2"
        />
      </div>

      {/* Experience */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">Experience</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Current XP
            </label>
            <input
              type="number"
              min="0"
              value={pokemon.experience}
              onChange={(e) =>
                handleInputChange("experience", parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              XP to Next Level
            </label>
            <input
              type="number"
              min="0"
              value={pokemon.experienceToNext}
              onChange={(e) =>
                handleInputChange(
                  "experienceToNext",
                  parseInt(e.target.value) || 0,
                )
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
        {/* XP Bar */}
        <ProgressBar
          variant="xp"
          current={pokemon.experience}
          max={pokemon.experience + pokemon.experienceToNext}
          label="XP"
          showValue={false}
          className="mt-2"
        />
      </div>

      {/* Attributes */}
      <div>
        <label className="block text-sm text-gray-300 mb-3">Attributes</label>
        <div className="grid grid-cols-2 gap-3">
          {attributeNames.map((attr) => (
            <div key={attr}>
              <label className="block text-xs text-gray-400 mb-1">
                {getAttributeShortName(attr)} (
                {attr.charAt(0).toUpperCase() + attr.slice(1)})
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={pokemon.attributes[attr]}
                onChange={(e) =>
                  handleAttributeChange(attr, parseInt(e.target.value) || 1)
                }
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
