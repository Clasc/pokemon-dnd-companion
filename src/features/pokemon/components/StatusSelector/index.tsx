"use client";

import { useState, useEffect } from "react";
import { StatusCondition, StatusEffect, STATUS_COLORS } from "@/types/pokemon";
import { useAppStore } from "@/store";

interface StatusSelectorProps {
  pokemonUuid: string;
  isOpen: boolean;
  onClose: () => void;
}

const PRIMARY_STATUS_CONDITIONS: StatusCondition[] = [
  "none",
  "burned",
  "frozen",
  "paralyzed",
  "poisoned",
  "badly-poisoned",
  "asleep"
];

const DURATION_REQUIRING_CONDITIONS: StatusCondition[] = [
  "asleep",
  "confused"
];

const getStatusDisplayName = (condition: StatusCondition): string => {
  switch (condition) {
    case "badly-poisoned":
      return "Badly Poisoned";
    default:
      return condition.charAt(0).toUpperCase() + condition.slice(1);
  }
};

const getDefaultDuration = (condition: StatusCondition): number | undefined => {
  switch (condition) {
    case "asleep":
      return 2; // 1-3 turns, default to 2
    case "confused":
      return 3; // 1-4 turns, default to 3
    default:
      return undefined;
  }
};

export default function StatusSelector({ pokemonUuid, isOpen, onClose }: StatusSelectorProps) {
  const pokemon = useAppStore.use.pokemonTeam()[pokemonUuid];
  const setPrimaryStatus = useAppStore.use.setPrimaryStatus();
  const setConfusion = useAppStore.use.setConfusion();

  const [selectedPrimaryStatus, setSelectedPrimaryStatus] = useState<StatusCondition>("none");
  const [primaryDuration, setPrimaryDuration] = useState<number | undefined>(undefined);
  const [isConfused, setIsConfused] = useState(false);
  const [confusionDuration, setConfusionDuration] = useState<number | undefined>(undefined);

  // Initialize state from current pokemon status
  useEffect(() => {
    if (!pokemon) return;

    // Set primary status
    if (pokemon.primaryStatus) {
      setSelectedPrimaryStatus(pokemon.primaryStatus.condition);
      setPrimaryDuration(pokemon.primaryStatus.duration);
    } else {
      setSelectedPrimaryStatus("none");
      setPrimaryDuration(undefined);
    }

    // Set confusion status
    if (pokemon.confusion) {
      setIsConfused(true);
      setConfusionDuration(pokemon.confusion.duration);
    } else {
      setIsConfused(false);
      setConfusionDuration(undefined);
    }
  }, [pokemon, isOpen]);

  const handlePrimaryStatusChange = (condition: StatusCondition) => {
    setSelectedPrimaryStatus(condition);
    if (DURATION_REQUIRING_CONDITIONS.includes(condition)) {
      setPrimaryDuration(getDefaultDuration(condition));
    } else {
      setPrimaryDuration(undefined);
    }
  };

  const handleConfusionToggle = (checked: boolean) => {
    setIsConfused(checked);
    if (checked) {
      setConfusionDuration(getDefaultDuration("confused"));
    } else {
      setConfusionDuration(undefined);
    }
  };

  const handleSave = () => {
    // Save primary status
    if (selectedPrimaryStatus === "none") {
      setPrimaryStatus(pokemonUuid, null);
    } else {
      const primaryStatusEffect: StatusEffect = {
        condition: selectedPrimaryStatus,
        duration: primaryDuration,
        turnsActive: 0
      };
      setPrimaryStatus(pokemonUuid, primaryStatusEffect);
    }

    // Save confusion
    if (isConfused) {
      const confusionEffect: StatusEffect = {
        condition: "confused",
        duration: confusionDuration,
        turnsActive: 0
      };
      setConfusion(pokemonUuid, confusionEffect);
    } else {
      setConfusion(pokemonUuid, null);
    }

    onClose();
  };

  const handleCancel = () => {
    // Reset to current pokemon state
    if (pokemon?.primaryStatus) {
      setSelectedPrimaryStatus(pokemon.primaryStatus.condition);
      setPrimaryDuration(pokemon.primaryStatus.duration);
    } else {
      setSelectedPrimaryStatus("none");
      setPrimaryDuration(undefined);
    }

    if (pokemon?.confusion) {
      setIsConfused(true);
      setConfusionDuration(pokemon.confusion.duration);
    } else {
      setIsConfused(false);
      setConfusionDuration(undefined);
    }

    onClose();
  };

  if (!isOpen || !pokemon) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="glass rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Status Effects</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Primary Status Effects */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Primary Status</h4>
            <div className="space-y-2">
              {PRIMARY_STATUS_CONDITIONS.map((condition) => (
                <label
                  key={condition}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <input
                    type="radio"
                    name="primaryStatus"
                    value={condition}
                    checked={selectedPrimaryStatus === condition}
                    onChange={() => handlePrimaryStatusChange(condition)}
                    className="w-4 h-4 text-blue-500"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    {condition !== "none" && (
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[condition] }}
                      />
                    )}
                    <span className="text-white text-sm font-medium">
                      {getStatusDisplayName(condition)}
                    </span>
                  </div>
                  {selectedPrimaryStatus === condition && DURATION_REQUIRING_CONDITIONS.includes(condition) && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300 text-sm">Duration:</span>
                      <input
                        type="number"
                        min="1"
                        max={condition === "asleep" ? 3 : 4}
                        value={primaryDuration || ""}
                        onChange={(e) => setPrimaryDuration(parseInt(e.target.value) || undefined)}
                        className="w-12 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                      />
                      <span className="text-gray-300 text-sm">turns</span>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Confusion - Special Status */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg font-semibold text-white mb-3">Special Effects</h4>
            <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={isConfused}
                onChange={(e) => handleConfusionToggle(e.target.checked)}
                className="w-4 h-4 text-blue-500"
              />
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS.confused }}
                />
                <span className="text-white text-sm font-medium">Confused</span>
              </div>
              {isConfused && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 text-sm">Duration:</span>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={confusionDuration || ""}
                    onChange={(e) => setConfusionDuration(parseInt(e.target.value) || undefined)}
                    className="w-12 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-center"
                  />
                  <span className="text-gray-300 text-sm">turns</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
