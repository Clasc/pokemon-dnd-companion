"use client";

import { useState, useRef, useEffect } from "react";

import { useAppStore } from "@/store";

import ModalShell from "@/components/shared/ui/ModalShell";

interface XPModifierProps {
  pokemonUuid: string;

  onClose: () => void;
}

export default function XPModifier({ pokemonUuid, onClose }: XPModifierProps) {
  const [xpGain, setXpGain] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const gainExperience = useAppStore.use.gainExperience();

  const pokemon = useAppStore.use.pokemonTeam()[pokemonUuid];

  // Focus input when pokemon/context ready or mode changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [pokemon]);

  if (!pokemon) return null;

  const parsedValue = parseInt(xpGain);
  const isValid = !isNaN(parsedValue) && parsedValue > 0;
  const willLevelUp = isValid && parsedValue >= pokemon.experienceToNext;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      onClose();
      return;
    }
    gainExperience(pokemonUuid, parsedValue);
    onClose();
  };

  return (
    <ModalShell
      isOpen={true}
      onClose={onClose}
      title="Gain Experience"
      size="sm"
      closeOnBackdrop={true}
      closeOnEscape={true}
      backdropTestId="xp-modifier-backdrop"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-500/20 hover:bg-gray-500/40 text-gray-300 hover:text-white rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="xp-modifier-form"
            className="flex-1 py-2 px-4 rounded-lg transition-colors text-white font-medium bg-purple-500/80 hover:bg-purple-500"
          >
            Gain XP
          </button>
        </div>
      }
    >
      <div className="text-center mb-4">
        <p className="text-sm text-gray-300">
          {pokemon.name} - Level {pokemon.level}
        </p>
        <p className="text-xs text-gray-400">
          {pokemon.experience}/{pokemon.experience + pokemon.experienceToNext}{" "}
          XP
        </p>
      </div>
      <form id="xp-modifier-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="xp-amount"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Experience Points
          </label>
          <input
            id="xp-amount"
            ref={inputRef}
            type="number"
            min="1"
            value={xpGain}
            onChange={(e) => setXpGain(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
            placeholder="Enter XP amount"
          />
          {willLevelUp && xpGain && (
            <p className="text-sm text-yellow-400 mt-2 font-medium">
              🎉 Will level up to Level {pokemon.level + 1}!
            </p>
          )}
        </div>
      </form>
    </ModalShell>
  );
}
