"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import { Pokemon, Attributes, TYPE_COLORS } from "@/types/pokemon";
import { getPokemonIcon } from "@/utils/IconMapper";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import PokemonEditModal from "../PokemonEditModal";
import AddAttackModal from "../AddAttackModal";
import AttackCard from "../AttackCard";
import ActionButtons from "@/components/shared/ActionButtons";
import StatusIndicator from "../StatusIndicator";
import StatusSelector from "../StatusSelector";
import DraggableProgressBar from "./DraggableProgressBar";

interface PokemonCardProps {
  pokemon: Pokemon;
  uuid: string;
}

export default function PokemonCard({ pokemon, uuid }: PokemonCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAttacksVisible, setIsAttacksVisible] = useState(false);
  const [showAddAttackModal, setShowAddAttackModal] = useState(false);
  const [showStatusSelector, setShowStatusSelector] = useState(false);
  const [selectedAttackIndex, setSelectedAttackIndex] = useState<number | null>(
    null,
  );

  const removePokemon = useAppStore.use.removePokemon();
  const modifyPokemonHP = useAppStore.use.modifyPokemonHP();
  const gainExperience = useAppStore.use.gainExperience();

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

  // Direct HP modification functions
  const modifyHP = (amount: number) => {
    modifyPokemonHP(uuid, amount);
  };

  // Handle HP drag change
  const handleHPDragChange = (value: number) => {
    const diff = value - pokemon.currentHP;
    if (diff !== 0) {
      modifyPokemonHP(uuid, diff);
    }
  };

  // Quick XP gain function
  const gainQuickXP = (amount: number) => {
    gainExperience(uuid, amount);
  };

  // Handle XP drag change
  const handleXPDragChange = (value: number) => {
    const diff = value - pokemon.experience;
    if (diff !== 0) {
      gainExperience(uuid, diff);
    }
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

  const getAttributeModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const formatModifier = (modifier: number) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  return (
    <>
      <div className="glass rounded-2xl p-4">
        <div className="flex items-start gap-4">
          {/* Pokemon Sprite/Icon */}
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-xl md:text-2xl border border-white/10">
            {pokemon.type1
              ? getPokemonIcon(pokemon.type1, pokemon.type2)
              : "❓"}
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
              {pokemon.type1 && (
                <span
                  className="text-xs px-2 py-1 rounded-md text-white font-medium"
                  style={{ backgroundColor: getTypeColor(pokemon.type1) }}
                >
                  {pokemon.type1.toUpperCase()}
                </span>
              )}
              {pokemon.type2 && (
                <span
                  className="text-xs px-2 py-1 rounded-md text-white font-medium"
                  style={{ backgroundColor: getTypeColor(pokemon.type2) }}
                >
                  {pokemon.type2.toUpperCase()}
                </span>
              )}

              {/* Clickable Status */}
              <div
                onClick={() => setShowStatusSelector(true)}
                className="cursor-pointer hover:bg-white/10 rounded px-1 transition-colors"
              >
                <StatusIndicator pokemon={pokemon} />
              </div>
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
                      {formatModifier(
                        getAttributeModifier(pokemon.attributes[attr]),
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* HP Bar with Inline Controls */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-300 font-medium">HP</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => modifyHP(-1)}
                      className="w-4 h-4 text-xs bg-red-500/20 hover:bg-red-500/40 rounded text-white flex items-center justify-center leading-none"
                      title="Decrease HP"
                    >
                      -
                    </button>
                    <button
                      onClick={() => modifyHP(-5)}
                      className="w-5 h-4 text-xs bg-red-500/20 hover:bg-red-500/40 rounded text-white flex items-center justify-center leading-none"
                      title="Decrease HP by 5"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => modifyHP(1)}
                      className="w-4 h-4 text-xs bg-green-500/20 hover:bg-green-500/40 rounded text-white flex items-center justify-center leading-none"
                      title="Increase HP"
                    >
                      +
                    </button>
                    <button
                      onClick={() => modifyHP(5)}
                      className="w-5 h-4 text-xs bg-green-500/20 hover:bg-green-500/40 rounded text-white flex items-center justify-center leading-none"
                      title="Increase HP by 5"
                    >
                      +5
                    </button>
                  </div>
                </div>
                <span className="text-xs text-gray-300 font-medium">
                  {pokemon.currentHP}/{pokemon.maxHP}
                </span>
              </div>
              <DraggableProgressBar
                type="hp"
                current={pokemon.currentHP}
                max={pokemon.maxHP}
                onChange={handleHPDragChange}
                label="HP"
                step={1}
              />
            </div>

            {/* XP Bar with Quick Gain */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-300 font-medium">XP</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => gainQuickXP(-10)}
                      className="w-6 h-4 text-xs bg-red-500/20 hover:bg-red-500/40 rounded text-white flex items-center justify-center leading-none"
                      title="Decrease 10 XP"
                      disabled={pokemon.experience <= 0}
                    >
                      -10
                    </button>
                    <button
                      onClick={() => gainQuickXP(-50)}
                      className="w-7 h-4 text-xs bg-red-500/20 hover:bg-red-500/40 rounded text-white flex items-center justify-center leading-none"
                      title="Decrease 50 XP"
                      disabled={pokemon.experience <= 0}
                    >
                      -50
                    </button>
                    <button
                      onClick={() => gainQuickXP(10)}
                      className="w-6 h-4 text-xs bg-blue-500/20 hover:bg-blue-500/40 rounded text-white flex items-center justify-center leading-none"
                      title="Gain 10 XP"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => gainQuickXP(50)}
                      className="w-6 h-4 text-xs bg-blue-500/20 hover:bg-blue-500/40 rounded text-white flex items-center justify-center leading-none"
                      title="Gain 50 XP"
                    >
                      +50
                    </button>
                    <button
                      onClick={() => gainQuickXP(100)}
                      className="w-7 h-4 text-xs bg-blue-500/20 hover:bg-blue-500/40 rounded text-white flex items-center justify-center leading-none"
                      title="Gain 100 XP"
                    >
                      +100
                    </button>
                  </div>
                </div>
                <span className="text-xs text-gray-300 font-medium">
                  {pokemon.experience}/
                  {pokemon.experience + pokemon.experienceToNext}
                </span>
              </div>
              <DraggableProgressBar
                type="xp"
                current={pokemon.experience}
                max={pokemon.experience + pokemon.experienceToNext}
                onChange={handleXPDragChange}
                label="Experience Points"
                step={10}
                showLevelUpIndicator={pokemon.experienceToNext <= 10}
              />
            </div>

            {/* Attacks as Chips */}
            {pokemon.attacks && pokemon.attacks.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-300 font-medium">
                    Attacks
                  </span>
                  <button
                    onClick={() => setIsAttacksVisible(!isAttacksVisible)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    {isAttacksVisible ? "Hide" : "Manage"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {pokemon.attacks.map((attack, i) => (
                    <div
                      key={i}
                      className="bg-white/10 rounded-full px-2 py-1 text-xs font-medium text-white flex items-center gap-1"
                    >
                      <span>{attack.name}</span>
                      <span className="text-gray-300">
                        {attack.currentPp}/{attack.maxPp}
                      </span>
                    </div>
                  ))}
                  {pokemon.attacks.length < 4 && (
                    <button
                      onClick={() => {
                        setSelectedAttackIndex(pokemon.attacks.length);
                        setShowAddAttackModal(true);
                      }}
                      className="bg-white/5 hover:bg-white/10 rounded-full px-2 py-1 text-xs font-medium text-white/50 hover:text-white transition-colors border border-dashed border-white/20"
                    >
                      + Attack
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Add attack button if no attacks */}
            {(!pokemon.attacks || pokemon.attacks.length === 0) && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    setSelectedAttackIndex(0);
                    setShowAddAttackModal(true);
                  }}
                  className="bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 text-xs font-medium text-white/50 hover:text-white transition-colors border border-dashed border-white/20"
                >
                  + Add First Attack
                </button>
              </div>
            )}
          </div>

          <ActionButtons
            onDelete={handleDeleteClick}
            onEdit={handleEditClick}
          />
        </div>

        {/* Expanded Attacks Management */}
        {isAttacksVisible && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4">
            {[...Array(4)].map((_, i) => {
              const attack = pokemon.attacks?.[i];
              return attack ? (
                <AttackCard
                  key={i}
                  attack={attack}
                  pokemonUuid={uuid}
                  attackIndex={i}
                />
              ) : (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedAttackIndex(i);
                    setShowAddAttackModal(true);
                  }}
                  className="bg-white/5 rounded-lg flex items-center justify-center p-4 h-full border-2 border-dashed border-white/10 hover:bg-white/10 transition-colors cursor-pointer min-h-[120px]"
                  role="button"
                >
                  <span className="text-white/50 font-semibold">
                    + Add Attack
                  </span>
                </div>
              );
            })}
          </div>
        )}
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

      {/* Add Attack Modal */}
      {selectedAttackIndex !== null && (
        <AddAttackModal
          isOpen={showAddAttackModal}
          onClose={() => {
            setShowAddAttackModal(false);
            setSelectedAttackIndex(null);
          }}
          pokemonUuid={uuid}
          attackIndex={selectedAttackIndex}
        />
      )}

      {/* Status Selector Modal */}
      <StatusSelector
        pokemonUuid={uuid}
        isOpen={showStatusSelector}
        onClose={() => setShowStatusSelector(false)}
      />
    </>
  );
}
