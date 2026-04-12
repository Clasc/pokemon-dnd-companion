"use client";

import { Pokemon, TYPE_COLORS } from "@/types/pokemon";
import { getPokemonIcon } from "@/utils/IconMapper";
import ProgressBar from "@/components/shared/ui/ProgressBar";

interface PokemonCompactCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

export default function PokemonCompactCard({
  pokemon,
  onClick,
}: PokemonCompactCardProps) {
  const getTypeColor = (type: string) =>
    TYPE_COLORS[type as keyof typeof TYPE_COLORS] || "#A8A878";

  return (
    <div
      onClick={onClick}
      className="glass rounded-xl p-3 cursor-pointer hover:bg-white/20 transition-all duration-200 active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-2xl md:text-3xl border border-white/10 overflow-hidden flex-shrink-0">
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
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white text-sm md:text-base truncate">
              {pokemon.name}
            </h3>
            <span className="text-xs md:text-sm text-gray-300 bg-white/10 px-1.5 py-0.5 rounded">
              Lv.{pokemon.level}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-2">
            {pokemon.type1 && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded text-white font-medium"
                style={{ backgroundColor: getTypeColor(pokemon.type1) }}
              >
                {pokemon.type1.toUpperCase()}
              </span>
            )}
            {pokemon.type2 && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded text-white font-medium"
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
              <span className="text-[10px] text-gray-300">
                {pokemon.experience}/{pokemon.experience + pokemon.experienceToNext}
              </span>
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