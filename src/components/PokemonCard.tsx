'use client';

import { Pokemon, TYPE_COLORS } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  isEditing: boolean;
  onHPChange?: (pokemonId: number, delta: number) => void;
  onXPChange?: (pokemonId: number, delta: number) => void;
}

export default function PokemonCard({ pokemon, isEditing, onHPChange, onXPChange }: PokemonCardProps) {
  const hpPercentage = pokemon.maxHP > 0 ? (pokemon.currentHP / pokemon.maxHP) * 100 : 0;
  const xpPercentage = pokemon.experienceToNext > 0 ? (pokemon.experience / (pokemon.experience + pokemon.experienceToNext)) * 100 : 0;

  const getHPColor = () => {
    if (hpPercentage > 60) return 'var(--accent-green)';
    if (hpPercentage > 30) return 'var(--accent-yellow)';
    return 'var(--accent-red)';
  };

  const getTypeColor = (type: string) => {
    return TYPE_COLORS[type as keyof typeof TYPE_COLORS] || '#A8A878';
  };

  return (
    <div className="glass rounded-2xl p-4 md:p-6 mb-3 transition-all duration-300 hover:transform hover:-translate-y-1">
      <div className="flex items-center gap-3 md:gap-4">
        {/* Pokemon Sprite/Icon */}
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-2xl md:text-3xl border border-white/10">
          {pokemon.sprite || '❓'}
        </div>

        {/* Pokemon Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white text-lg md:text-xl truncate">{pokemon.name}</h3>
            <span className="text-sm md:text-base text-gray-300 bg-white/10 px-2 py-0.5 rounded-md">
              Lv.{pokemon.level}
            </span>
          </div>

          {/* Type Badges */}
          <div className="flex gap-1 md:gap-2 mb-2">
            <span
              className="text-xs md:text-sm px-2 py-1 rounded-md text-white font-medium"
              style={{ backgroundColor: getTypeColor(pokemon.type1) }}
            >
              {pokemon.type1.toUpperCase()}
            </span>
            {pokemon.type2 && (
              <span
                className="text-xs md:text-sm px-2 py-1 rounded-md text-white font-medium"
                style={{ backgroundColor: getTypeColor(pokemon.type2) }}
              >
                {pokemon.type2.toUpperCase()}
              </span>
            )}
          </div>

          {/* HP Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs md:text-sm text-gray-300">HP</span>
              <div className="flex items-center gap-2">
                {isEditing && (
                  <>
                    <button
                      onClick={() => onHPChange?.(pokemon.id, -1)}
                      className="w-6 h-6 md:w-7 md:h-7 rounded-md bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                    >
                      -
                    </button>
                    <button
                      onClick={() => onHPChange?.(pokemon.id, 1)}
                      className="w-6 h-6 md:w-7 md:h-7 rounded-md bg-green-500/80 hover:bg-green-500 text-white text-xs font-bold transition-colors"
                    >
                      +
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-600/50 rounded-full h-2 md:h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 relative"
                style={{
                  width: `${Math.min(100, hpPercentage)}%`,
                  backgroundColor: getHPColor(),
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="text-xs md:text-sm text-gray-400 mt-1 text-right">
              {pokemon.currentHP}/{pokemon.maxHP}
            </div>
          </div>

          {/* XP Bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs md:text-sm text-gray-300">XP</span>
              <div className="flex items-center gap-2">
                {isEditing && (
                  <>
                    <button
                      onClick={() => onXPChange?.(pokemon.id, -10)}
                      className="w-6 h-6 md:w-7 md:h-7 rounded-md bg-purple-500/80 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                    >
                      -
                    </button>
                    <button
                      onClick={() => onXPChange?.(pokemon.id, 10)}
                      className="w-6 h-6 md:w-7 md:h-7 rounded-md bg-blue-500/80 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                    >
                      +
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-600/50 rounded-full h-1.5 md:h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 xp-bar"
                style={{
                  width: `${Math.min(100, xpPercentage)}%`,
                }}
              />
            </div>
            <div className="text-xs md:text-sm text-gray-400 mt-1 text-right">
              {pokemon.experience}/{pokemon.experience + pokemon.experienceToNext}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
