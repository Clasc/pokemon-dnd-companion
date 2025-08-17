"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "../store";

interface HPModifierProps {
  pokemonUuid: string;
  onClose: () => void;
}

export default function HPModifier({ pokemonUuid, onClose }: HPModifierProps) {
  const [hpChange, setHpChange] = useState<string>("");
  const [isHealing, setIsHealing] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const modifyPokemonHP = useAppStore.use.modifyPokemonHP();
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

    const changeValue = parseInt(hpChange);
    if (isNaN(changeValue) || changeValue === 0) {
      onClose();
      return;
    }

    const finalChange = isHealing ? changeValue : -changeValue;
    modifyPokemonHP(pokemonUuid, finalChange);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!pokemon) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="glass rounded-2xl p-6 mx-4 max-w-sm w-full">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Modify HP</h3>
          <p className="text-sm text-gray-300">
            {pokemon.name} - {pokemon.currentHP}/{pokemon.maxHP} HP
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Heal/Damage Toggle */}
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsHealing(true)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                isHealing
                  ? "bg-green-500/80 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Heal Mode
            </button>
            <button
              type="button"
              onClick={() => setIsHealing(false)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                !isHealing
                  ? "bg-red-500/80 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Damage Mode
            </button>
          </div>

          {/* HP Input */}
          <div>
            <label
              htmlFor="hp-amount"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              HP Amount
            </label>
            <input
              id="hp-amount"
              ref={inputRef}
              type="number"
              min="1"
              max={
                isHealing
                  ? pokemon.maxHP - pokemon.currentHP
                  : pokemon.currentHP
              }
              value={hpChange}
              onChange={(e) => setHpChange(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              placeholder="Enter amount"
            />
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
              className={`flex-1 py-2 px-4 rounded-lg transition-colors text-white font-medium ${
                isHealing
                  ? "bg-green-500/80 hover:bg-green-500"
                  : "bg-red-500/80 hover:bg-red-500"
              }`}
            >
              {isHealing ? "Heal" : "Damage"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
