"use client";

import { useState } from "react";
import { Pokemon, Attributes, TYPE_COLORS } from "../types/pokemon";
import { useAppStore } from "../store";
import { getPokemonIcon } from "@/utils/IconMapper";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import PokemonEditModal from "./PokemonEditModal";

interface PokemonCardProps {
  pokemon: Pokemon;
  uuid: string;
}

export default function PokemonCard({ pokemon, uuid }: PokemonCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const removePokemon = useAppStore.use.removePokemon();

  const handleDelete = () => {
    removePokemon(uuid);
    setShowDeleteModal(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditModal(true);
  };

  const hpPercentage =
    pokemon.maxHP > 0 ? (pokemon.currentHP / pokemon.maxHP) * 100 : 0;

  const xpPercentage =
    pokemon.experienceToNext > 0
      ? (pokemon.experience / (pokemon.experience + pokemon.experienceToNext)) *
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

  return (
    <>
      <div className="glass rounded-2xl p-4">
        <div className="flex items-start gap-4">
          {/* Pokemon Sprite/Icon */}
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-xl md:text-2xl border border-white/10">
            {getPokemonIcon(pokemon.type1, pokemon.type2)}
          </div>

          {/* Pokemon Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-white text-base md:text-lg truncate">
                {pokemon.name}
              </h3>
              <span className="text-xs text-gray-400 truncate">
                ({pokemon.type})
              </span>
              <span className="text-xs md:text-sm text-gray-300 bg-white/10 px-2 py-0.5 rounded-md">
                Lv.{pokemon.level}
              </span>
            </div>

            {/* Type Badges and Status */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs px-2 py-1 rounded-md text-white font-medium"
                style={{ backgroundColor: getTypeColor(pokemon.type1) }}
              >
                {pokemon.type1.toUpperCase()}
              </span>
              {pokemon.type2 && (
                <span
                  className="text-xs px-2 py-1 rounded-md text-white font-medium"
                  style={{ backgroundColor: getTypeColor(pokemon.type2) }}
                >
                  {pokemon.type2.toUpperCase()}
                </span>
              )}
              {pokemon.status && pokemon.status.condition !== "healthy" && (
                <span className="text-xs px-2 py-1 rounded-md bg-orange-500/80 text-white font-medium">
                  {pokemon.status.condition.toUpperCase()}
                  {pokemon.status.duration && ` (${pokemon.status.duration})`}
                </span>
              )}
            </div>

            {/* Attributes Chips */}
            <div className="mb-2">
              <div className="flex flex-wrap justify-start gap-1">
                {attributeNames.map((attr) => (
                  <div
                    key={attr}
                    className="bg-white/10 rounded-full px-1.5 py-0.5 text-xs font-medium text-white flex items-center gap-1"
                  >
                    <span className="text-gray-300 font-semibold">
                      {getAttributeShortName(attr)}
                    </span>
                    <span className="font-bold">
                      {pokemon.attributes[attr]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* HP Bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-300 font-medium">HP</span>
                <span className="text-xs text-gray-300 font-medium">
                  {pokemon.currentHP}/{pokemon.maxHP}
                </span>
              </div>
              <div className="w-full bg-gray-600/50 rounded-full h-2 overflow-hidden">
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
            </div>

            {/* XP Bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-300 font-medium">XP</span>
                <span className="text-xs text-gray-300 font-medium">
                  {pokemon.experience}/
                  {pokemon.experience + pokemon.experienceToNext}
                </span>
              </div>
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

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {/* Edit Button */}
            <button
              onClick={handleEditClick}
              className="w-8 h-8 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 transition-colors flex items-center justify-center group"
              title="Edit Pokémon"
            >
              <svg
                className="w-4 h-4 text-blue-400 group-hover:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDeleteClick}
              className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-colors flex items-center justify-center group"
              title="Delete Pokémon"
            >
              <svg
                className="w-4 h-4 text-red-400 group-hover:text-red-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <PokemonEditModal
        isOpen={showEditModal}
        pokemon={pokemon}
        uuid={uuid}
        onClose={() => setShowEditModal(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        pokemonName={pokemon.name}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
