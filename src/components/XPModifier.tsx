"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "../store";

interface XPModifierProps {
  pokemonUuid: string;
  onClose: () => void;
}

export default function XPModifier({ pokemonUuid, onClose }: XPModifierProps) {
  const [xpGain, setXpGain] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const gainExperience = useAppStore.use.gainExperience();
  const pokemon = useAppStore.use.pokemonTeam()[pokemonUuid];

  useEffect(() => {
    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Handle escape key to close
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const xpValue = parseInt(xpGain);
    if (isNaN(xpValue) || xpValue <= 0) {
      onClose();
      return;
    }

    gainExperience(pokemonUuid, xpValue);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!pokemon) return null;

  const willLevelUp = parseInt(xpGain) >= pokemon.experienceToNext;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="glass rounded-2xl p-6 mx-4 max-w-sm w-full">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Gain Experience</h3>
          <p className="text-sm text-gray-300">
            {pokemon.name} - Level {pokemon.level}
          </p>
          <p className="text-xs text-gray-400">
            {pokemon.experience}/{pokemon.experience + pokemon.experienceToNext} XP
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* XP Input */}
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

          {/* Action Buttons */}
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
              className="flex-1 py-2 px-4 bg-purple-500/80 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
            >
              Gain XP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
