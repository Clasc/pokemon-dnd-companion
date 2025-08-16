"use client";

import { useState, useEffect } from "react";
import { Pokemon, Attributes, TYPE_COLORS } from "../types/pokemon";
import EditButtons from "./EditButtons";
import { useAppStore } from "../store";
import { getPokemonIcon } from "@/utils/IconMapper";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface PokemonCardProps {
  pokemon: Pokemon;
  uuid: string;
}

export default function PokemonCard({ pokemon, uuid }: PokemonCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPokemon, setEditedPokemon] = useState<Pokemon>(pokemon);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const updatePokemon = useAppStore.use.updatePokemon();
  const removePokemon = useAppStore.use.removePokemon();
  const viewedPokemon = isEditing ? editedPokemon : pokemon;

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
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPokemon(pokemon);
  };

  const handleDelete = () => {
    removePokemon(uuid);
    setShowDeleteModal(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
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

  return (
    <>
      <div
        className={`glass rounded-2xl p-4 ${
          !isEditing ? "cursor-pointer hover:bg-white/10" : ""
        }`}
        onClick={() => !isEditing && setIsEditing(true)}
      >
        <div className="flex items-start gap-4">
          {/* Pokemon Sprite/Icon */}
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-xl md:text-2xl border border-white/10">
            {getPokemonIcon(viewedPokemon.type1, viewedPokemon.type2)}
          </div>

          {/* Pokemon Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-white text-base md:text-lg truncate">
                {viewedPokemon.name}
              </h3>
              <span className="text-xs md:text-sm text-gray-300 bg-white/10 px-2 py-0.5 rounded-md">
                Lv.{viewedPokemon.level}
              </span>
            </div>

            {/* Type Badges */}
            <div className="flex gap-2 mb-3">
              <span
                className="text-xs px-2 py-1 rounded-md text-white font-medium"
                style={{ backgroundColor: getTypeColor(viewedPokemon.type1) }}
              >
                {viewedPokemon.type1.toUpperCase()}
              </span>
              {viewedPokemon.type2 && (
                <span
                  className="text-xs px-2 py-1 rounded-md text-white font-medium"
                  style={{ backgroundColor: getTypeColor(viewedPokemon.type2) }}
                >
                  {viewedPokemon.type2.toUpperCase()}
                </span>
              )}
            </div>

            {/* Attributes Chips */}
            <div className="mb-3">
              <div className="flex flex-wrap justify-start gap-1.5">
                {attributeNames.map((attr) => (
                  <div
                    key={attr}
                    className="bg-white/10 rounded-full px-2 py-0.5 text-xs font-medium text-white flex items-center gap-1.5"
                  >
                    <span className="text-gray-300 font-semibold">
                      {getAttributeShortName(attr)}
                    </span>
                    <span className="font-bold">
                      {viewedPokemon.attributes[attr]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* HP Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs md:text-sm text-gray-300 font-medium">
                  HP
                </span>
                <div className="flex items-center gap-3">
                  {isEditing && (
                    <>
                      <button
                        onClick={() => onHPChange(-1)}
                        className="w-6 h-6 rounded-md bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                      >
                        -
                      </button>
                      <button
                        onClick={() => onHPChange(1)}
                        className="w-6 h-6 rounded-md bg-green-500/80 hover:bg-green-500 text-white text-xs font-bold transition-colors"
                      >
                        +
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-600/50 rounded-full h-2 md:h-2.5 overflow-hidden">
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
              <div className="text-xs md:text-sm text-gray-300 mt-1.5 text-right font-medium">
                {viewedPokemon.currentHP}/{viewedPokemon.maxHP}
              </div>
            </div>

            {/* XP Bar */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs md:text-sm text-gray-300 font-medium">
                  XP
                </span>
                <div className="flex items-center gap-3">
                  {isEditing && (
                    <>
                      <button
                        onClick={() => onXPChange(-10)}
                        className="w-6 h-6 rounded-md bg-purple-500/80 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                      >
                        -
                      </button>
                      <button
                        onClick={() => onXPChange(10)}
                        className="w-6 h-6 rounded-md bg-blue-500/80 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
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
              <div className="text-xs md:text-sm text-gray-300 mt-1.5 text-right font-medium">
                {viewedPokemon.experience}/{viewedPokemon.experienceToNext}
              </div>

              {isEditing && (
                <EditButtons
                  handleCancel={handleCancel}
                  handleSave={handleSave}
                />
              )}
            </div>
          </div>

          {/* Delete Button */}
          {!isEditing && (
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
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        pokemonName={viewedPokemon.name}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
