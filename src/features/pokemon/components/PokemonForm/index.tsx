"use client";

import React from "react";
import { Pokemon, Attributes, PokemonType } from "@/types/pokemon";
import { getPokemonIcon } from "@/utils/IconMapper";
import ProgressBar from "@/components/shared/ui/ProgressBar";

/**
 * PokemonForm
 *
 * A presentational, controlled form component for creating or editing a Pokémon.
 * Responsibilities:
 * - Render labeled inputs for core Pokémon fields (species, nickname, level, types, HP, XP, attributes).
 * - Reflect current values via the provided `pokemon` prop.
 * - Emit all changes through `onChange` with an updated (partial) Pokémon object.
 *
 * Out of Scope (by design):
 * - Persistence (add/update store mutations)
 * - Validation display / error messaging
 * - Save / Cancel / Delete action buttons
 * - Status or attacks management
 *
 * Usage:
 * <PokemonForm
 *   pokemon={pokemonState}
 *   onChange={(next) => setPokemonState(next)}
 *   autoAdjustCurrentHPOnMaxChange={mode === "create"}
 * />
 */
export interface PokemonFormProps {
  pokemon: Pokemon;
  onChange: (updated: Pokemon) => void;

  /**
   * When true, changing Max HP will auto-clamp or auto-set Current HP
   * (useful for the creation flow to default to "full health").
   * Defaults to false.
   */
  autoAdjustCurrentHPOnMaxChange?: boolean;

  /**
   * Optional test IDs for specific inputs to enable stable test selectors
   * without forcing them universally.
   */
  testIds?: {
    species?: string;
    nickname?: string;
  };
}

export default function PokemonForm({
  pokemon,
  onChange,
  autoAdjustCurrentHPOnMaxChange = false,
  testIds,
}: PokemonFormProps) {
  const handleFieldChange = (
    field: keyof Pokemon,
    value:
      | string
      | number
      | null
      | undefined
      | { condition: string; duration?: number },
  ) => {
    onChange({ ...pokemon, [field]: value } as Pokemon);
  };

  const handleAttributeChange = (attr: keyof Attributes, value: number) => {
    onChange({
      ...pokemon,
      attributes: {
        ...pokemon.attributes,
        [attr]: value,
      },
    });
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
    const shortNames: Record<keyof Attributes, string> = {
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

  return (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto">
      {/* Icon + Basic Info */}
      <div className="flex items-start gap-4">
        {/* Pokémon Icon */}
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-2xl border border-white/10">
          {pokemon.type1 ? getPokemonIcon(pokemon.type1, pokemon.type2) : "❓"}
        </div>

        {/* Core Fields */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Species */}
            <div>
            <label className="block text-sm text-gray-300 mb-1">Species</label>
            <input
              type="text"
              value={pokemon.type || ""}
              onChange={(e) => handleFieldChange("type", e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              placeholder="e.g., Pikachu, Charizard"
              data-testid={testIds?.species}
            />
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nickname</label>
            <input
              type="text"
              value={pokemon.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              placeholder="Custom name for your Pokémon"
              data-testid={testIds?.nickname}
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Level</label>
            <input
              type="number"
              min={1}
              max={100}
              value={pokemon.level}
              onChange={(e) =>
                handleFieldChange(
                  "level",
                  Number.isNaN(parseInt(e.target.value))
                    ? 1
                    : parseInt(e.target.value),
                )
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
                handleFieldChange("type1", e.target.value as PokemonType)
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
                handleFieldChange("type2", e.target.value || null)
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
              min={0}
              max={pokemon.maxHP}
              value={pokemon.currentHP}
              onChange={(e) =>
                handleFieldChange(
                  "currentHP",
                  Number.isNaN(parseInt(e.target.value))
                    ? 0
                    : parseInt(e.target.value),
                )
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Max HP</label>
            <input
              type="number"
              min={1}
              value={pokemon.maxHP}
              onChange={(e) => {
                const nextMax =
                  Number.isNaN(parseInt(e.target.value)) ||
                  parseInt(e.target.value) < 1
                    ? 1
                    : parseInt(e.target.value);
                let nextCurrent = pokemon.currentHP;
                if (autoAdjustCurrentHPOnMaxChange) {
                  // In creation flows set / clamp to new max.
                  if (nextCurrent > nextMax) nextCurrent = nextMax;
                  if (nextCurrent === 0) nextCurrent = nextMax;
                } else {
                  // Always clamp defensively even in edit mode.
                  if (nextCurrent > nextMax) nextCurrent = nextMax;
                  if (nextCurrent < 0) nextCurrent = 0;
                }
                onChange({
                  ...pokemon,
                  maxHP: nextMax,
                  currentHP: nextCurrent,
                });
              }}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
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
              min={0}
              value={pokemon.experience}
              onChange={(e) =>
                handleFieldChange(
                  "experience",
                  Number.isNaN(parseInt(e.target.value))
                    ? 0
                    : parseInt(e.target.value),
                )
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
              min={0}
              value={pokemon.experienceToNext}
              onChange={(e) =>
                handleFieldChange(
                  "experienceToNext",
                  Number.isNaN(parseInt(e.target.value))
                    ? 0
                    : parseInt(e.target.value),
                )
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
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
                min={1}
                max={30}
                value={pokemon.attributes[attr]}
                onChange={(e) =>
                  handleAttributeChange(
                    attr,
                    Number.isNaN(parseInt(e.target.value))
                      ? 1
                      : parseInt(e.target.value),
                  )
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
