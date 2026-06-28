"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { Pokemon, TYPE_COLORS, STATUS_COLORS } from "@/types/pokemon";
import { getPokemonIcon } from "@/utils/IconMapper";
import { ATTRIBUTE_NAMES, getAttributeShortName, getAttributeModifier, formatModifier } from "@/utils/attributes";
import BaseModal from "@/components/shared/ui/BaseModal";
import BottomSheet from "@/components/shared/ui/BottomSheet";
import AddAttackModal from "../AddAttackModal";
import AttackCard from "../AttackCard";
import StatusSelector from "../StatusSelector";
import QuickStatusDropdown from "../QuickStatusDropdown";
import ProgressBar from "@/components/shared/ui/ProgressBar";
import InteractiveProgress from "@/components/shared/ui/InteractiveProgress";
import PokemonForm from "../PokemonForm";
import { useMediaQuery } from "@/utils/useMediaQuery";

interface PokemonExpandedModalProps {
  pokemon: Pokemon;
  uuid: string;
  isOpen: boolean;
  onClose: () => void;
  readOnly?: boolean;
}

export default function PokemonExpandedModal({
  pokemon,
  uuid,
  isOpen,
  onClose,
  readOnly = false,
}: PokemonExpandedModalProps) {
  const router = useRouter();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddAttackModal, setShowAddAttackModal] = useState(false);
  const [showStatusSelector, setShowStatusSelector] = useState(false);
  const [selectedAttackIndex, setSelectedAttackIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormState, setEditFormState] = useState<Pokemon>(pokemon);

  const removePokemon = useAppStore.use.removePokemon();
  const modifyPokemonHP = useAppStore.use.modifyPokemonHP();
  const gainExperience = useAppStore.use.gainExperience();
  const updatePokemon = useAppStore.use.updatePokemon();

  const handleDelete = () => {
    removePokemon(uuid);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleEditClick = () => {
    if (isMobile) {
      setEditFormState({ ...pokemon });
      setIsEditing(true);
    } else {
      router.push(`/pokemon/${uuid}/edit`);
      onClose();
    }
  };

  const handleSave = () => {
    updatePokemon(editFormState, uuid);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditFormState({ ...pokemon });
    setIsEditing(false);
  };

  const handleViewFullDetails = () => {
    router.push("/pokemon");
    onClose();
  };

  const getTypeColor = (type: string) =>
    TYPE_COLORS[type as keyof typeof TYPE_COLORS] || "#A8A878";

  const isMobile = useMediaQuery("(max-width: 767px)");

  if (!isOpen) return null;

  const statusCondition = pokemon.primaryStatus?.condition ?? null;

  const detailView = (
    <div className="p-space-4 md:p-space-6">
      <div className="flex items-start gap-space-4 mb-space-6">
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
          <div className="flex items-center gap-space-2 mb-space-2">
            <h2 className="font-bold text-white text-xl md:text-2xl truncate">
              {pokemon.name}
            </h2>
            <span className="text-sm text-gray-300 bg-white/10 px-2 py-1 rounded">
              Lv.{pokemon.level}
            </span>
            {statusCondition && (
              <div
                className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                style={{ backgroundColor: STATUS_COLORS[statusCondition as keyof typeof STATUS_COLORS] || "#888" }}
                title={statusCondition}
              />
            )}
          </div>

          <div className="flex items-center gap-space-2 mb-space-3">
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
            <span className="text-xs text-gray-400">🛡️ {pokemon.armorClass} AC</span>
          </div>

          <div className="flex flex-wrap gap-tight">
            {ATTRIBUTE_NAMES.map((attr) => (
              <div
                key={attr}
                className="bg-white/10 rounded-full px-space-2 py-space-1 text-xs font-medium text-white flex items-center gap-tight"
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

      <div className="space-y-space-4 mb-space-6">
        <div>
          <div className="flex items-center justify-between mb-space-2">
            <span className="text-sm text-gray-300 font-medium">HP</span>
            <span className="text-sm text-gray-300">
              {pokemon.currentHP}/{pokemon.maxHP}
            </span>
          </div>
          {readOnly ? (
            <ProgressBar
              variant="hp"
              current={pokemon.currentHP}
              max={pokemon.maxHP}
              showValue={false}
            />
          ) : (
            <InteractiveProgress
              type="hp"
              current={pokemon.currentHP}
              max={pokemon.maxHP}
              onChange={(val) => modifyPokemonHP(uuid, val - pokemon.currentHP)}
              label="HP"
            />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-space-2">
            <span className="text-sm text-gray-300 font-medium">XP</span>
            <span className="text-sm text-gray-300">
              {(pokemon.xpSinceLevelUp ?? 0)}/{pokemon.experienceToNext}
            </span>
          </div>
          {readOnly ? (
            <ProgressBar
              variant="xp"
              current={pokemon.xpSinceLevelUp ?? 0}
              max={pokemon.experienceToNext}
              showValue={false}
            />
          ) : (
            <InteractiveProgress
              type="xp"
              current={pokemon.xpSinceLevelUp ?? 0}
              max={pokemon.experienceToNext}
              onChange={(val) => gainExperience(uuid, val - (pokemon.xpSinceLevelUp ?? 0))}
              label="XP"
            />
          )}
        </div>
      </div>

      <div className="mb-space-6">
        <h3 className="text-lg font-semibold text-white mb-3">Attacks</h3>

        {!pokemon.attacks || pokemon.attacks.length === 0 ? (
          <p className="text-gray-400 text-sm py-2">No attacks</p>
        ) : readOnly ? (
          <div className="flex flex-wrap gap-2">
            {pokemon.attacks.map((attack, i) => (
              <div
                key={i}
                className="bg-white/10 rounded-full px-3 py-1.5 text-sm font-medium text-white flex items-center gap-2"
              >
                <span>{attack.name}</span>
                <span className="text-gray-300 text-xs">
                  PP {attack.currentPp}/{attack.maxPp}
                </span>
              </div>
            ))}
          </div>
        ) : (
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
                  className="bg-white/5 rounded-lg flex items-center justify-center p-space-4 h-full border-2 border-dashed border-white/10 hover:bg-white/10 transition-colors cursor-pointer min-h-[100px]"
                  role="button"
                >
                  <span className="text-white/50 font-semibold">+ Add</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {readOnly ? (
        <button
          onClick={handleViewFullDetails}
          className="w-full py-space-3 px-space-4 rounded-lg bg-interactive hover:bg-interactive-hover transition-colors text-white font-medium"
        >
          View Full Details
        </button>
      ) : showDeleteConfirm ? (
        <div className="flex flex-col gap-space-2">
          <p className="text-sm text-gray-300 text-center">Delete {pokemon.name}?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-space-3 px-space-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-space-3 px-space-4 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-white font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={handleEditClick}
className="flex-1 py-space-3 px-space-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white font-medium"
            >
              Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 py-space-3 px-space-4 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-colors text-red-300 font-medium"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );

  const editView = (
    <div className="p-space-4 md:p-space-6">
      <PokemonForm pokemon={editFormState} onChange={setEditFormState} />
      <div className="flex gap-3 mt-space-6">
        <button
          onClick={handleSave}
className="flex-1 py-space-3 px-space-4 rounded-lg bg-interactive hover:bg-interactive-hover transition-colors text-white font-medium"
          >
            Save
        </button>
        <button
          onClick={handleCancel}
className="flex-1 py-space-3 px-space-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white font-medium"
          >
            Cancel
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <BottomSheet isOpen={isOpen} onClose={readOnly ? onClose : (isEditing ? handleCancel : onClose)}>
          <div className="space-y-4">
            {!isEditing && !readOnly && (
              <div className="absolute top-3 right-10 z-10">
                <QuickStatusDropdown pokemonUuid={uuid} />
              </div>
            )}
            {isEditing ? editView : detailView}
          </div>
        </BottomSheet>
      ) : (
        <BaseModal
          isOpen={isOpen}
          onClose={onClose}
          size="fullscreen"
          className="md:max-w-2xl md:h-auto md:max-h-[90vh] md:rounded-2xl"
        >
          {!readOnly && (
            <div className="absolute top-3 right-10 z-10">
              <QuickStatusDropdown pokemonUuid={uuid} />
            </div>
          )}
          {isEditing ? editView : detailView}
        </BaseModal>
      )}

      {!readOnly && selectedAttackIndex !== null && (
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

      {!readOnly && (
        <StatusSelector
          pokemonUuid={uuid}
          isOpen={showStatusSelector}
          onClose={() => setShowStatusSelector(false)}
        />
      )}
    </>
  );
}
