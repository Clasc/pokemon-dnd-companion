"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { Pokemon, Attributes, TYPE_COLORS } from "@/types/pokemon";
import { getPokemonIcon } from "@/utils/IconMapper";
import BaseModal from "@/components/shared/ui/BaseModal";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import AddAttackModal from "../AddAttackModal";
import AttackCard from "../AttackCard";
import StatusSelector from "../StatusSelector";
import QuickStatusDropdown from "../QuickStatusDropdown";
import ProgressBar from "@/components/shared/ui/ProgressBar";

interface PokemonExpandedModalProps {
  pokemon: Pokemon;
  uuid: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PokemonExpandedModal({
  pokemon,
  uuid,
  isOpen,
  onClose,
}: PokemonExpandedModalProps) {
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAttacksVisible, setIsAttacksVisible] = useState(false);
  const [showAddAttackModal, setShowAddAttackModal] = useState(false);
  const [showStatusSelector, setShowStatusSelector] = useState(false);
  const [selectedAttackIndex, setSelectedAttackIndex] = useState<number | null>(null);

  const removePokemon = useAppStore.use.removePokemon();
  const modifyPokemonHP = useAppStore.use.modifyPokemonHP();
  const gainExperience = useAppStore.use.gainExperience();

  const handleDelete = () => {
    removePokemon(uuid);
    setShowDeleteModal(false);
    onClose();
  };

  const handleEditClick = () => {
    router.push(`/pokemon/${uuid}/edit`);
    onClose();
  };

  const modifyHP = (amount: number) => {
    modifyPokemonHP(uuid, amount);
  };

  const gainQuickXP = (amount: number) => {
    gainExperience(uuid, amount);
  };

  const getTypeColor = (type: string) =>
    TYPE_COLORS[type as keyof typeof TYPE_COLORS] || "#A8A878";

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

  const getAttributeModifier = (score: number) => Math.floor((score - 10) / 2);

  const formatModifier = (modifier: number) =>
    modifier >= 0 ? `+${modifier}` : `${modifier}`;

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="fullscreen"
      className="md:max-w-2xl md:h-auto md:max-h-[90vh] md:rounded-2xl"
    >
      <div className="p-4 md:p-6">
        <div className="absolute top-3 right-10 z-10">
          <QuickStatusDropdown pokemonUuid={uuid} />
        </div>

        <div className="p-4 md:p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-4xl md:text-5xl border border-white/10 overflow-hidden flex-shrink-0">
              {pokemon.spriteUrl ? (
                <img
                  src={pokemon.spriteUrl}
                  alt={pokemon.name}
                  className="w-full h-full object-contain"
                />
              ) : pokemon.type1 ? (
                getPokemonIcon(pokemon.type1, pokemon.type2)
              ) : (
                "❓"
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-bold text-white text-xl md:text-2xl truncate">
                  {pokemon.name}
                </h2>
                <span className="text-sm text-gray-300 bg-white/10 px-2 py-1 rounded">
                  Lv.{pokemon.level}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
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
              </div>

              <div className="flex flex-wrap gap-1">
                {attributeNames.map((attr) => (
                  <div
                    key={attr}
                    className="bg-white/10 rounded-full px-2 py-1 text-xs font-medium text-white flex items-center gap-1"
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
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300 font-medium">HP</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => modifyHP(-1)}
                    className="w-7 h-7 text-sm bg-red-500/20 hover:bg-red-500/40 rounded text-white flex items-center justify-center"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => modifyHP(-5)}
                    className="w-7 h-7 text-sm bg-red-500/20 hover:bg-red-500/40 rounded text-white flex items-center justify-center"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => modifyHP(1)}
                    className="w-7 h-7 text-sm bg-green-500/20 hover:bg-green-500/40 rounded text-white flex items-center justify-center"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => modifyHP(5)}
                    className="w-7 h-7 text-sm bg-green-500/20 hover:bg-green-500/40 rounded text-white flex items-center justify-center"
                  >
                    +5
                  </button>
                </div>
              </div>
              <ProgressBar
                variant="hp"
                current={pokemon.currentHP}
                max={pokemon.maxHP}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300 font-medium">XP</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => gainQuickXP(-10)}
                    className="w-8 h-7 text-sm bg-red-500/20 hover:bg-red-500/40 rounded text-white flex items-center justify-center"
                    disabled={pokemon.experience <= 0}
                  >
                    -10
                  </button>
                  <button
                    onClick={() => gainQuickXP(10)}
                    className="w-8 h-7 text-sm bg-blue-500/20 hover:bg-blue-500/40 rounded text-white flex items-center justify-center"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => gainQuickXP(50)}
                    className="w-8 h-7 text-sm bg-blue-500/20 hover:bg-blue-500/40 rounded text-white flex items-center justify-center"
                  >
                    +50
                  </button>
                  <button
                    onClick={() => gainQuickXP(100)}
                    className="w-10 h-7 text-sm bg-blue-500/20 hover:bg-blue-500/40 rounded text-white flex items-center justify-center"
                  >
                    +100
                  </button>
                </div>
              </div>
              <ProgressBar
                variant="xp"
                current={pokemon.experience}
                max={pokemon.experience + pokemon.experienceToNext}
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Attacks</h3>
              {(pokemon.attacks?.length ?? 0) > 0 && (
                <button
                  onClick={() => setIsAttacksVisible(!isAttacksVisible)}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  {isAttacksVisible ? "Hide" : "Manage"}
                </button>
              )}
            </div>

            {(!pokemon.attacks || pokemon.attacks.length === 0) ? (
              <button
                onClick={() => {
                  setSelectedAttackIndex(0);
                  setShowAddAttackModal(true);
                }}
                className="w-full bg-white/5 hover:bg-white/10 rounded-lg p-4 text-sm font-medium text-white/50 hover:text-white transition-colors border border-dashed border-white/20"
              >
                + Add First Attack
              </button>
            ) : isAttacksVisible ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                      className="bg-white/5 rounded-lg flex items-center justify-center p-4 h-full border-2 border-dashed border-white/10 hover:bg-white/10 transition-colors cursor-pointer min-h-[100px]"
                      role="button"
                    >
                      <span className="text-white/50 font-semibold">+ Add</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {pokemon.attacks.map((attack, i) => (
                  <div
                    key={i}
                    className="bg-white/10 rounded-full px-3 py-1.5 text-sm font-medium text-white flex items-center gap-2"
                  >
                    <span>{attack.name}</span>
                    <span className="text-gray-300">
                      {attack.currentPp}/{attack.maxPp}
                    </span>
                  </div>
                ))}
                {(pokemon.attacks?.length ?? 0) < 4 && (
                  <button
                    onClick={() => {
                      setSelectedAttackIndex(pokemon.attacks.length);
                      setShowAddAttackModal(true);
                    }}
                    className="bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors border border-dashed border-white/20"
                  >
                    + Attack
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleEditClick}
              className="flex-1 py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex-1 py-3 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-colors text-red-300 font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        pokemonName={pokemon.name}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

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

      <StatusSelector
        pokemonUuid={uuid}
        isOpen={showStatusSelector}
        onClose={() => setShowStatusSelector(false)}
      />
    </BaseModal>
  );
}