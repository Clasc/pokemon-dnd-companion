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
      className={`p-space-3 transition-all duration-200 relative z-0 border-b border-white/10 last:border-b-0 ${
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
      <div className="flex items-center gap-space-3">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-[#4a4a4a] flex items-center justify-center text-2xl md:text-3xl border border-white/10 overflow-hidden flex-shrink-0">
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
            <h3 className="font-semibold text-white text-base md:text-lg truncate">
              {pokemon.name}
            </h3>
            <span className="text-sm md:text-base text-gray-300 bg-white/10 px-2 py-0.5 rounded">
              Lv.{pokemon.level}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            {pokemon.type1 && (
              <span
                className="text-xs px-2 py-1 rounded text-white font-medium"
                style={{ backgroundColor: getTypeColor(pokemon.type1) }}
              >
                {pokemon.type1.toUpperCase()}
              </span>
            )}
            {pokemon.type2 && (
              <span
                className="text-xs px-2 py-1 rounded text-white font-medium"
                style={{ backgroundColor: getTypeColor(pokemon.type2) }}
              >
                {pokemon.type2.toUpperCase()}
              </span>
            )}
            <span className="text-xs text-gray-400">🛡️{pokemon.armorClass}</span>
          </div>

          <div className="flex justify-between items-start gap-2">
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              {onEditStat ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditStat(pokemon, uuid);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-300 hover:bg-red-500/20 active:bg-red-500/30 transition-colors text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <span>❤️</span>
                  <span>{pokemon.currentHP}/{pokemon.maxHP}</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-300 text-sm font-semibold">
                  <span>❤️</span>
                  <span>{pokemon.currentHP}/{pokemon.maxHP}</span>
                </span>
              )}

              {onEditStat ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditStat(pokemon, uuid);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 active:bg-blue-500/30 transition-colors text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span>⭐</span>
                  <span>{pokemon.experience}/{xpProgress + xpToNext}</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-300 text-sm font-semibold">
                  <span>⭐</span>
                  <span>{pokemon.experience}/{xpProgress + xpToNext}</span>
                </span>
              )}
            </div>

            {showAttacks && pokemon.attacks && pokemon.attacks.length > 0 && (
              <div className="grid grid-cols-2 gap-1.5">
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
                    className={`text-xs rounded-md border px-2 py-1.5 transition-colors font-medium text-left leading-tight ${
                      attack.currentPp === 0
                        ? "border-white/5 bg-white/5 text-gray-500 cursor-not-allowed"
                        : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20 active:bg-interactive active:text-white active:border-interactive"
                    }`}
                  >
                    <div>{attack.name}</div>
                    <div className="text-gray-500 text-[10px] mt-0.5">
                      PP {attack.currentPp}/{attack.maxPp}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
