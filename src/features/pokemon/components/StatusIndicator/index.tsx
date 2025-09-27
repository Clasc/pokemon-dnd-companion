"use client";

import { Pokemon, STATUS_COLORS } from "@/types/pokemon";

interface StatusIndicatorProps {
  pokemon: Pokemon;
}

const getStatusDisplayName = (condition: string): string => {
  switch (condition) {
    case "badly-poisoned":
      return "Badly Poisoned";
    default:
      return condition.charAt(0).toUpperCase() + condition.slice(1);
  }
};

export default function StatusIndicator({ pokemon }: StatusIndicatorProps) {
  const hasStatus = pokemon.primaryStatus || pokemon.confusion || pokemon.temporaryEffects?.length;

  if (!hasStatus) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {/* Primary Status */}
      {pokemon.primaryStatus && pokemon.primaryStatus.condition !== "none" && (
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white shadow-sm"
          style={{ backgroundColor: STATUS_COLORS[pokemon.primaryStatus.condition] }}
        >
          <span>{getStatusDisplayName(pokemon.primaryStatus.condition)}</span>
          {pokemon.primaryStatus.duration && (
            <span className="bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-xs">
              {pokemon.primaryStatus.duration}
            </span>
          )}
        </div>
      )}

      {/* Confusion - Special Status */}
      {pokemon.confusion && (
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white shadow-sm"
          style={{ backgroundColor: STATUS_COLORS.confused }}
        >
          <span>Confused</span>
          {pokemon.confusion.duration && (
            <span className="bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-xs">
              {pokemon.confusion.duration}
            </span>
          )}
        </div>
      )}

      {/* Temporary Effects */}
      {pokemon.temporaryEffects?.map((effect, index) => (
        <div
          key={`${effect.condition}-${index}`}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white shadow-sm"
          style={{ backgroundColor: STATUS_COLORS[effect.condition] }}
        >
          <span>{getStatusDisplayName(effect.condition)}</span>
          {effect.duration && (
            <span className="bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-xs">
              {effect.duration}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
