"use client";

import { useState, useRef, useEffect } from "react";

import { useAppStore } from "@/store";

import ModalShell from "@/components/shared/ui/ModalShell";

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

  // Autofocus input when modal opens
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [pokemon]); // re-run if pokemon changes

  if (!pokemon) return null;

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

  const maxAdjustable = isHealing
    ? Math.max(0, pokemon.maxHP - pokemon.currentHP)
    : pokemon.currentHP;

  return (
    <ModalShell
      isOpen={true}
      onClose={onClose}
      title="Modify HP"
      description={`${pokemon.name} - ${pokemon.currentHP}/${pokemon.maxHP} HP`}
      size="sm"
      closeOnBackdrop={true}
      closeOnEscape={true}
      backdropTestId="hp-modifier-backdrop"
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
            form="hp-modifier-form"
            className={`flex-1 py-2 px-4 rounded-lg transition-colors text-white font-medium ${
              isHealing
                ? "bg-green-500/80 hover:bg-green-500"
                : "bg-red-500/80 hover:bg-red-500"
            }`}
            disabled={maxAdjustable === 0}
          >
            {isHealing ? "Heal" : "Damage"}
          </button>
        </div>
      }
    >
      <form
        id="hp-modifier-form"
        onSubmit={handleSubmit}
        className="space-y-5 mt-2"
      >
        {/* Heal / Damage Toggle */}
        <div className="flex bg-white/10 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setIsHealing(true)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              isHealing
                ? "bg-green-500/80 text-white"
                : "text-gray-300 hover:text-white"
            }`}
            aria-pressed={isHealing}
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
            aria-pressed={!isHealing}
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
            max={maxAdjustable}
            value={hpChange}
            onChange={(e) => setHpChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
            placeholder={
              maxAdjustable > 0
                ? `Enter amount (max ${maxAdjustable})`
                : "No adjustment possible"
            }
            disabled={maxAdjustable === 0}
          />
          {maxAdjustable === 0 && (
            <p className="text-xs text-yellow-400 mt-2">
              {isHealing ? "Already at full HP." : "HP is already at 0."}
            </p>
          )}
        </div>
      </form>
    </ModalShell>
  );
}
