"use client";

import { Pokemon, TYPE_COLORS, STATUS_COLORS } from "@/types/pokemon";
import { getPokemonIcon } from "@/utils/IconMapper";
import QuickStatusDropdown from "../QuickStatusDropdown";
import { useAppStore } from "@/store";

interface PokemonCompactCardProps {
  pokemon: Pokemon;
  uuid: string;
  onClick: () => void;
  showAttacks?: boolean;
  readOnly?: boolean;
  onEditStat?: (pokemon: Pokemon, uuid: string) => void;
}

export default function PokemonCompactCard({
  pokemon,
  uuid,
  onClick,
  showAttacks = false,
  readOnly = false,
  onEditStat,
}: PokemonCompactCardProps) {
  const decreaseAttackPP = useAppStore.use.decreaseAttackPP();

  const getTypeColor = (type: string) =>
    TYPE_COLORS[type as keyof typeof TYPE_COLORS] || "#A8A878";

  const xpToNext = pokemon.experienceToNext;
  const xpProgress =
    pokemon.xpSinceLevelUp != null
      ? pokemon.xpSinceLevelUp
      : pokemon.experience;

  const hasStatus =
    pokemon.primaryStatus && pokemon.primaryStatus.condition !== "none";

  return (
    <div
      onClick={!onEditStat ? onClick : undefined}
      className={`p-space-2 transition-all duration-200 relative z-0 border-b border-white/10 last:border-b-0 ${
        !onEditStat ? "cursor-pointer hover:bg-white/5" : ""
      }`}
    >
      <div className="absolute top-1 right-1 z-10">
        {readOnly ? (
          hasStatus && (
            <div
              className="w-5 h-5 rounded-full border border-white/20"
              style={{
                backgroundColor:
                  STATUS_COLORS[
                    pokemon.primaryStatus!.condition as keyof typeof STATUS_COLORS
                  ] || "#888",
              }}
              title={pokemon.primaryStatus!.condition}
            />
          )
        ) : (
          <QuickStatusDropdown pokemonUuid={uuid} compact />
        )}
      </div>
      <div className="flex items-center gap-sm">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-[#4a4a4a] flex items-center justify-center text-xl md:text-2xl border border-white/10 overflow-hidden flex-shrink-0">
          {pokemon.spriteUrl ? (
            <img
              src={pokemon.spriteUrl}
              alt={pokemon.name}
              className="w-full h-full object-contain"
              style={{
                filter:
                  pokemon.primaryStatus?.condition === "fainted"
                    ? "grayscale(100%)"
                    : undefined,
              }}
            />
          ) : pokemon.type1 ? (
            getPokemonIcon(pokemon.type1, pokemon.type2)
          ) : (
            "❓"
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-sm mb-0.5">
            <h3 className="font-semibold text-white text-sm md:text-base truncate">
              {pokemon.name}
            </h3>
            <span className="text-xs md:text-sm text-gray-300 bg-white/10 px-1.5 py-0.5 rounded">
              Lv.{pokemon.level}
            </span>
          </div>

          <div className="flex items-center gap-tight mb-1 flex-wrap">
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
            <span className="text-[10px] text-gray-400">🛡️{pokemon.armorClass}</span>
          </div>

          <div className="flex items-center gap-space-3 text-xs">
            {onEditStat ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditStat(pokemon, uuid);
                }}
                className="text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-interactive rounded px-0.5"
              >
                <span className="text-gray-400">HP</span> {pokemon.currentHP}/
                {pokemon.maxHP}
              </button>
            ) : (
              <span className="text-gray-300">
                <span className="text-gray-400">HP</span> {pokemon.currentHP}/
                {pokemon.maxHP}
              </span>
            )}

            {onEditStat ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditStat(pokemon, uuid);
                }}
                className="text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-interactive rounded px-0.5"
              >
                <span className="text-gray-400">XP</span> {pokemon.experience}/
                {xpProgress + xpToNext}
              </button>
            ) : (
              <span className="text-gray-300">
                <span className="text-gray-400">XP</span> {pokemon.experience}/
                {xpProgress + xpToNext}
              </span>
            )}
          </div>

          {showAttacks && pokemon.attacks && pokemon.attacks.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {pokemon.attacks.map((attack, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (attack.currentPp > 0) {
                      decreaseAttackPP(uuid, i);
                    }
                  }}
                  disabled={attack.currentPp === 0}
                  className={`text-[10px] rounded-full px-1.5 py-0.5 transition-colors ${
                    attack.currentPp === 0
                      ? "bg-white/5 text-gray-500 cursor-not-allowed"
                      : "bg-white/10 text-gray-300 hover:bg-white/20 active:bg-interactive active:text-white"
                  }`}
                >
                  {attack.name} ({attack.currentPp}/{attack.maxPp})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
