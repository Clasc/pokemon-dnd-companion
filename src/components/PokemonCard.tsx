"use client";

import { useState, useEffect } from "react";
import { Pokemon, TYPE_COLORS } from "../types/pokemon";
import EditButtons from "./EditButtons";
import { useAppStore } from "../store";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPokemon, setEditedPokemon] = useState<Pokemon>(pokemon);
  const updatePokemonInStore = useAppStore((state) => state.updatePokemon);

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
    updatePokemonInStore(editedPokemon);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPokemon(pokemon);
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

  return (
    <div
      className={`glass rounded-2xl p-6 ${
        !isEditing ? "cursor-pointer hover:bg-white/10" : ""
      }`}
      onClick={() => !isEditing && setIsEditing(true)}
    >
      <div className="flex items-center gap-4 md:gap-6">
        {/* Pokemon Sprite/Icon */}
        <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-2xl md:text-3xl border border-white/10">
          {pokemon.sprite || "❓"}
        </div>

        {/* Pokemon Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="font-semibold text-white text-lg md:text-xl truncate">
              {pokemon.name}
            </h3>
            <span className="text-sm md:text-base text-gray-300 bg-white/10 px-3 py-1 rounded-md">
              Lv.{pokemon.level}
            </span>
          </div>

          {/* Type Badges */}
          <div className="flex gap-2 md:gap-3 mb-4">
            <span
              className="text-xs md:text-sm px-3 py-1.5 rounded-md text-white font-medium"
              style={{ backgroundColor: getTypeColor(pokemon.type1) }}
            >
              {pokemon.type1.toUpperCase()}
            </span>
            {pokemon.type2 && (
              <span
                className="text-xs md:text-sm px-3 py-1.5 rounded-md text-white font-medium"
                style={{ backgroundColor: getTypeColor(pokemon.type2) }}
              >
                {pokemon.type2.toUpperCase()}
              </span>
            )}
          </div>

          {/* HP Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm md:text-base text-gray-300 font-medium">
                HP
              </span>
              <div className="flex items-center gap-3">
                {isEditing && (
                  <>
                    <button
                      onClick={() => onHPChange(-1)}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                    >
                      -
                    </button>
                    <button
                      onClick={() => onHPChange(1)}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-green-500/80 hover:bg-green-500 text-white text-xs font-bold transition-colors"
                    >
                      +
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-600/50 rounded-full h-3 md:h-4 overflow-hidden">
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
            <div className="text-sm md:text-base text-gray-300 mt-2 text-right font-medium">
              {pokemon.currentHP}/{pokemon.maxHP}
            </div>
          </div>

          {/* XP Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm md:text-base text-gray-300 font-medium">
                XP
              </span>
              <div className="flex items-center gap-3">
                {isEditing && (
                  <>
                    <button
                      onClick={() => onXPChange(-10)}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-purple-500/80 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                    >
                      -
                    </button>
                    <button
                      onClick={() => onXPChange(10)}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-blue-500/80 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                    >
                      +
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-600/50 rounded-full h-2.5 md:h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 xp-bar"
                style={{
                  width: `${Math.min(100, xpPercentage)}%`,
                }}
              />
            </div>
            <div className="text-sm md:text-base text-gray-300 mt-2 text-right font-medium">
              {pokemon.experience}/
              {pokemon.experience + pokemon.experienceToNext}
            </div>

            {isEditing && (
              <EditButtons
                handleCancel={handleCancel}
                handleSave={handleSave}
              ></EditButtons>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
