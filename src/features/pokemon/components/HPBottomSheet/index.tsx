"use client";

import { useState, useEffect } from "react";
import BottomSheet from "@/components/shared/ui/BottomSheet";
import { Pokemon, TYPE_COLORS, STATUS_COLORS } from "@/types/pokemon";
import { useAppStore } from "@/store";

interface HPBottomSheetProps {
  pokemon: Pokemon;
  pokemonUuid: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function HPBottomSheet({
  pokemon,
  pokemonUuid,
  isOpen,
  onClose,
}: HPBottomSheetProps) {
  const modifyPokemonHP = useAppStore.use.modifyPokemonHP();
  const [displayHP, setDisplayHP] = useState(pokemon.currentHP);

  useEffect(() => {
    if (isOpen) {
      setDisplayHP(pokemon.currentHP);
    }
  }, [isOpen, pokemon.currentHP]);

  const handleDamage = (amount: number) => {
    modifyPokemonHP(pokemonUuid, -amount);
    setDisplayHP((prev) => Math.max(0, prev - amount));
  };

  const handleHeal = (amount: number) => {
    modifyPokemonHP(pokemonUuid, amount);
    setDisplayHP((prev) => Math.min(pokemon.maxHP, prev + amount));
  };

  const handleExactValue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = parseInt(formData.get("hp-value") as string, 10);
    if (isNaN(value)) return;
    const clamped = Math.max(0, Math.min(pokemon.maxHP, value));
    const delta = clamped - pokemon.currentHP;
    if (delta !== 0) {
      modifyPokemonHP(pokemonUuid, delta);
    }
    onClose();
  };

  const hpPercent = pokemon.maxHP > 0 ? (pokemon.currentHP / pokemon.maxHP) * 100 : 0;
  const getHPColor = (pct: number) => {
    if (pct <= 25) return "#EF4444";
    if (pct <= 50) return "#F59E0B";
    return "#22C55E";
  };

  const isFainted =
    pokemon.primaryStatus?.condition === "fainted" || pokemon.currentHP === 0;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="space-y-space-4">
        <div className="flex items-center gap-space-3">
          <div
            className="w-14 h-14 rounded-lg bg-[#4a4a4a] flex items-center justify-center text-2xl border border-white/10 overflow-hidden flex-shrink-0"
            style={{
              filter: isFainted ? "grayscale(100%)" : undefined,
            }}
          >
            {pokemon.type1 ? (
              <span className="text-3xl">
                {TYPE_COLORS[pokemon.type1] ? "⚔️" : "❓"}
              </span>
            ) : (
              "❓"
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{pokemon.name}</h2>
            <span className="text-sm text-gray-400">
              Lv.{pokemon.level}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-space-1">
            <span className="text-sm text-gray-400 font-medium">HP</span>
            <span className="text-sm text-gray-300">
              {pokemon.currentHP} / {pokemon.maxHP}
            </span>
          </div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${hpPercent}%`,
                backgroundColor: getHPColor(hpPercent),
              }}
            />
          </div>
        </div>

        {isFainted && (
          <div className="text-center py-space-2 px-space-3 rounded-lg bg-red-500/20 border border-red-500/30">
            <span className="text-red-400 font-semibold text-sm">FAINTED</span>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-space-2">
            Damage
          </p>
          <div className="flex gap-space-2">
            <button
              type="button"
              onClick={() => handleDamage(10)}
              className="flex-1 py-space-3 rounded-lg bg-red-500/20 text-red-400 font-bold text-lg hover:bg-red-500/30 active:bg-red-500/40 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              -10
            </button>
            <button
              type="button"
              onClick={() => handleDamage(5)}
              className="flex-1 py-space-3 rounded-lg bg-red-500/20 text-red-400 font-bold text-lg hover:bg-red-500/30 active:bg-red-500/40 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              -5
            </button>
            <button
              type="button"
              onClick={() => handleDamage(1)}
              className="flex-1 py-space-3 rounded-lg bg-red-500/20 text-red-400 font-bold text-lg hover:bg-red-500/30 active:bg-red-500/40 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              -1
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-space-2">
            Heal
          </p>
          <div className="flex gap-space-2">
            <button
              type="button"
              onClick={() => handleHeal(1)}
              className="flex-1 py-space-3 rounded-lg bg-green-500/20 text-green-400 font-bold text-lg hover:bg-green-500/30 active:bg-green-500/40 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              +1
            </button>
            <button
              type="button"
              onClick={() => handleHeal(5)}
              className="flex-1 py-space-3 rounded-lg bg-green-500/20 text-green-400 font-bold text-lg hover:bg-green-500/30 active:bg-green-500/40 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              +5
            </button>
            <button
              type="button"
              onClick={() => handleHeal(10)}
              className="flex-1 py-space-3 rounded-lg bg-green-500/20 text-green-400 font-bold text-lg hover:bg-green-500/30 active:bg-green-500/40 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              +10
            </button>
          </div>
        </div>

        <form onSubmit={handleExactValue} className="flex items-center gap-space-2">
          <label htmlFor="hp-exact-input" className="sr-only">
            Set exact HP
          </label>
          <input
            id="hp-exact-input"
            name="hp-value"
            type="number"
            min={0}
            max={pokemon.maxHP}
            placeholder={`0 - ${pokemon.maxHP}`}
            className="flex-1 px-space-3 py-space-2 rounded-lg bg-[#222222] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-interactive text-sm"
          />
          <button
            type="submit"
            className="px-space-4 py-space-2 rounded-lg bg-interactive text-white font-semibold text-sm hover:bg-interactive-hover transition-colors focus:outline-none focus:ring-2 focus:ring-interactive"
          >
            Set
          </button>
        </form>
      </div>
    </BottomSheet>
  );
}
