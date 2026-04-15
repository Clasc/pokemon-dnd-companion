"use client";

import { useState } from "react";
import { Pokemon, TYPE_COLORS } from "@/types/pokemon";
import { getPokemonIcon } from "@/utils/IconMapper";
import ProgressBar from "@/components/shared/ui/ProgressBar";
import QuickStatusDropdown from "../QuickStatusDropdown";
import { useAppStore } from "@/store";

interface PokemonCompactCardProps {
  pokemon: Pokemon;
  uuid: string;
  onClick: () => void;
}

export default function PokemonCompactCard({
  pokemon,
  uuid,
  onClick,
}: PokemonCompactCardProps) {
  const [xpInput, setXpInput] = useState("");
  const gainExperience = useAppStore.use.gainExperience();

  const handleAddXP = () => {
    const amount = parseInt(xpInput);
    if (amount > 0) {
      gainExperience(uuid, amount);
      setXpInput("");
    }
  };

  const getTypeColor = (type: string) =>
    TYPE_COLORS[type as keyof typeof TYPE_COLORS] || "#A8A878";

  return (
    <div
      onClick={onClick}
      className="p-space-2 cursor-pointer hover:bg-white/5 transition-all duration-200 relative z-0 border-b border-white/10 last:border-b-0"
    >
      <div className="absolute top-1 right-1 z-10">
        <QuickStatusDropdown pokemonUuid={uuid} />
      </div>
      <div className="flex items-center gap-sm">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-[#4a4a4a] flex items-center justify-center text-xl md:text-2xl border border-white/10 overflow-hidden flex-shrink-0">
          {pokemon.spriteUrl ? (
            <img
              src={pokemon.spriteUrl}
              alt={pokemon.name}
              className="w-full h-full object-contain"
              style={{
                filter: pokemon.primaryStatus?.condition === "fainted" ? "grayscale(100%)" : undefined,
              }}
            />
          ) : pokemon.type1 ? (
            getPokemonIcon(pokemon.type1, pokemon.type2)
          ) : (
            "❓"
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-sm mb-space-1">
            <h3 className="font-semibold text-white text-sm md:text-base truncate">
              {pokemon.name}
            </h3>
            <span className="text-xs md:text-sm text-gray-300 bg-white/10 px-1.5 py-0.5 rounded">
              Lv.{pokemon.level}
            </span>
          </div>

          <div className="flex items-center gap-tight mb-space-1">
            {pokemon.type1 && (
              <span
                className="text-[10px] px-1 py-0.5 rounded text-white font-medium"
                style={{ backgroundColor: getTypeColor(pokemon.type1) }}
              >
                {pokemon.type1.toUpperCase()}
              </span>
            )}
            {pokemon.type2 && (
              <span
                className="text-[10px] px-1 py-0.5 rounded text-white font-medium"
                style={{ backgroundColor: getTypeColor(pokemon.type2) }}
              >
                {pokemon.type2.toUpperCase()}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400">HP</span>
              <span className="text-[10px] text-gray-300">
                {pokemon.currentHP}/{pokemon.maxHP}
              </span>
            </div>
            <ProgressBar
              variant="hp"
              current={pokemon.currentHP}
              max={pokemon.maxHP}
              showValue={false}
            />

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400">XP</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={xpInput}
                  onChange={(e) => setXpInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddXP()}
                  placeholder="+XP"
                  className="w-14 px-2 py-0.5 bg-white/10 border border-white/20 rounded text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddXP();
                  }}
                  className="px-2 py-0.5 bg-[#EE5D20] hover:bg-[#ff6e35] rounded text-[10px] text-white"
                >
                  +
                </button>
                <span className="text-[10px] text-gray-300">
                  {pokemon.experience}/{pokemon.experience + pokemon.experienceToNext}
                </span>
              </div>
            </div>
            <ProgressBar
              variant="xp"
              current={pokemon.experience}
              max={pokemon.experience + pokemon.experienceToNext}
              showValue={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}