"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Pokemon, Attributes, TYPE_COLORS } from "../types/pokemon";
import EditButtons from "./EditButtons";
import { useAppStore } from "../store";
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

  const onHPChange = (hpDelta: number) => {
    const newHP = Math.max(
      0,
      Math.min(editedPokemon.maxHP, editedPokemon.currentHP + hpDelta),
    );
    setEditedPokemon({ ...editedPokemon, currentHP: newHP });
  };

  const onXPChange = (xpDelta: number) => {
    const newXP = Math.max(0, editedPokemon.experience + xpDelta);
    setEditedPokemon({ ...editedPokemon, experience: newXP });
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

  const getTypeColor = (type: string) => {
    return TYPE_COLORS[type as keyof typeof TYPE_COLORS] || "#A8A878";
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

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center p-4 z-50">
      <div className="w-full max-w-lg glass rounded-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
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
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            {/* Pokemon Sprite/Icon */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-2xl border border-white/10">
              {getPokemonIcon(editedPokemon.type1, editedPokemon.type2)}
            </div>

            {/* Pokemon Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-white text-lg truncate">
                  {editedPokemon.name}
                </h3>
                <span className="text-sm text-gray-300 bg-white/10 px-2 py-0.5 rounded-md">
                  Lv.{editedPokemon.level}
                </span>
              </div>

              {/* Type Badges */}
              <div className="flex gap-2 mb-3">
                <span
                  className="text-xs px-2 py-1 rounded-md text-white font-medium"
                  style={{ backgroundColor: getTypeColor(editedPokemon.type1) }}
                >
                  {editedPokemon.type1.toUpperCase()}
                </span>
                {editedPokemon.type2 && (
                  <span
                    className="text-xs px-2 py-1 rounded-md text-white font-medium"
                    style={{ backgroundColor: getTypeColor(editedPokemon.type2) }}
                  >
                    {editedPokemon.type2.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Attributes Chips */}
          <div>
            <div className="flex flex-wrap justify-start gap-1.5">
              {attributeNames.map((attr) => (
                <div
                  key={attr}
                  className="bg-white/10 rounded-full px-3 py-1 text-sm font-medium text-white flex items-center gap-2"
                >
                  <span className="text-gray-300 font-semibold">
                    {getAttributeShortName(attr)}
                  </span>
                  <span className="font-bold">
                    {editedPokemon.attributes[attr]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* HP Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300 font-medium">
                HP
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onHPChange(-1)}
                  className="w-8 h-8 rounded-md bg-red-500/80 hover:bg-red-500 text-white text-sm font-bold transition-colors"
                >
                  -
                </button>
                <button
                  onClick={() => onHPChange(1)}
                  className="w-8 h-8 rounded-md bg-green-500/80 hover:bg-green-500 text-white text-sm font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-600/50 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 relative"
                style={{
                  width: `${Math.min(100, hpPercentage)}%`,
                  backgroundColor: getHPColor(),
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="text-sm text-gray-300 mt-2 text-right font-medium">
              {editedPokemon.currentHP}/{editedPokemon.maxHP}
            </div>
          </div>

          {/* XP Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300 font-medium">
                XP
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onXPChange(-10)}
                  className="w-8 h-8 rounded-md bg-purple-500/80 hover:bg-purple-500 text-white text-sm font-bold transition-colors"
                >
                  -
                </button>
                <button
                  onClick={() => onXPChange(10)}
                  className="w-8 h-8 rounded-md bg-blue-500/80 hover:bg-blue-500 text-white text-sm font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-600/50 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 xp-bar"
                style={{
                  width: `${Math.min(100, xpPercentage)}%`,
                }}
              />
            </div>
            <div className="text-sm text-gray-300 mt-2 text-right font-medium">
              {editedPokemon.experience}/{editedPokemon.experienceToNext}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6">
            <EditButtons
              handleCancel={handleCancel}
              handleSave={handleSave}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
