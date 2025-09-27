"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import EditButtons from "@/components/shared/EditButtons";
import { useAppStore } from "@/store";
import { Pokemon, Attributes, PokemonType } from "@/types/pokemon";
import { getPokemonIcon } from "@/utils/IconMapper";

interface PokemonEditModalProps {
  isOpen: boolean;
  pokemon: Pokemon;
  uuid: string;
  onClose: () => void;
}

export default function PokemonEditModal({
  isOpen,
  pokemon,
  uuid,
  onClose,
}: PokemonEditModalProps) {
  const [mounted, setMounted] = useState(false);
  const [editedPokemon, setEditedPokemon] = useState<Pokemon>(pokemon);

  const updatePokemon = useAppStore.use.updatePokemon();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setEditedPokemon(pokemon);
  }, [pokemon]);

  const handleInputChange = (
    field: keyof Pokemon,
    value:
      | string
      | number
      | null
      | undefined
      | { condition: string; duration?: number },
  ) => {
    setEditedPokemon({ ...editedPokemon, [field]: value });
  };

  const handleAttributeChange = (attr: keyof Attributes, value: number) => {
    setEditedPokemon({
      ...editedPokemon,
      attributes: {
        ...editedPokemon.attributes,
        [attr]: value,
      },
    });
  };

  const handleSave = () => {
    updatePokemon(editedPokemon, uuid);
    onClose();
  };

  const handleCancel = () => {
    setEditedPokemon(pokemon);
    onClose();
  };

  const hpPercentage =
    editedPokemon.maxHP > 0
      ? (editedPokemon.currentHP / editedPokemon.maxHP) * 100
      : 0;

  const xpPercentage =
    editedPokemon.experienceToNext > 0
      ? (editedPokemon.experience /
          (editedPokemon.experience + editedPokemon.experienceToNext)) *
        100
      : 0;

  const getHPColor = () => {
    if (hpPercentage > 60) return "var(--accent-green)";
    if (hpPercentage > 30) return "var(--accent-yellow)";
    return "var(--accent-red)";
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

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center p-4 z-50">
      <div className="w-full max-w-2xl glass rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center z-10"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Edit Pokémon</h2>
          <div className="h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
        </div>

        {/* Pokemon Info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            {/* Pokemon Sprite/Icon */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-2xl border border-white/10">
              {editedPokemon.type1
                ? getPokemonIcon(editedPokemon.type1, editedPokemon.type2)
                : "❓"}
            </div>

            {/* Pokemon Basic Info */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Species */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Species
                </label>
                <input
                  type="text"
                  value={editedPokemon.type || ""}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="e.g., Pikachu, Charizard"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Nickname
                </label>
                <input
                  type="text"
                  value={editedPokemon.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="Custom name for your Pokémon"
                />
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Level
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editedPokemon.level}
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
                <label className="block text-xs text-gray-400 mb-1">
                  Type 1
                </label>
                <select
                  value={editedPokemon.type1}
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
                  value={editedPokemon.type2 || ""}
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
            <label className="block text-sm text-gray-300 mb-2">
              Hit Points
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Current HP
                </label>
                <input
                  type="number"
                  min="0"
                  max={editedPokemon.maxHP}
                  value={editedPokemon.currentHP}
                  onChange={(e) =>
                    handleInputChange(
                      "currentHP",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Max HP
                </label>
                <input
                  type="number"
                  min="1"
                  value={editedPokemon.maxHP}
                  onChange={(e) =>
                    handleInputChange("maxHP", parseInt(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
            {/* HP Bar */}
            <div className="mt-2">
              <div className="w-full bg-gray-600/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, hpPercentage)}%`,
                    backgroundColor: getHPColor(),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Experience
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Current XP
                </label>
                <input
                  type="number"
                  min="0"
                  value={editedPokemon.experience}
                  onChange={(e) =>
                    handleInputChange(
                      "experience",
                      parseInt(e.target.value) || 0,
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
                  min="0"
                  value={editedPokemon.experienceToNext}
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
            <div className="mt-2">
              <div className="w-full bg-gray-600/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 xp-bar"
                  style={{
                    width: `${Math.min(100, xpPercentage)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div>
            <label className="block text-sm text-gray-300 mb-3">
              Attributes
            </label>
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
                    value={editedPokemon.attributes[attr]}
                    onChange={(e) =>
                      handleAttributeChange(attr, parseInt(e.target.value) || 1)
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <EditButtons handleCancel={handleCancel} handleSave={handleSave} />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
