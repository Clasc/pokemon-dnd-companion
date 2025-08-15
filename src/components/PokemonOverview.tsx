'use client';

import { Pokemon } from '../types/pokemon';
import PokemonCard from './PokemonCard';

interface PokemonOverviewProps {
  pokemon: Pokemon[];
  isEditing: boolean;
  onPokemonHPChange?: (pokemonId: number, delta: number) => void;
  onPokemonXPChange?: (pokemonId: number, delta: number) => void;
}

export default function PokemonOverview({
  pokemon,
  isEditing,
  onPokemonHPChange,
  onPokemonXPChange
}: PokemonOverviewProps) {
  const handleHPChange = (pokemonId: number, delta: number) => {
    onPokemonHPChange?.(pokemonId, delta);
  };

  const handleXPChange = (pokemonId: number, delta: number) => {
    onPokemonXPChange?.(pokemonId, delta);
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white">Pokémon Overview</h2>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
            <span className="text-white text-sm md:text-base font-bold">
              {pokemon.length}
            </span>
          </div>
          <span className="text-gray-300 text-base md:text-lg">/ 6</span>
        </div>
      </div>

      <div className="pokemon-grid space-y-4">
        {pokemon.length === 0 ? (
          <div className="text-center py-12 md:py-16 px-4">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-600/50 to-gray-700/50 flex items-center justify-center border border-white/10">
              <span className="text-4xl md:text-5xl">🔍</span>
            </div>
            <p className="text-gray-400 text-base md:text-lg mb-2">No Pokémon in your team yet</p>
            <p className="text-gray-500 text-sm md:text-base">Add some Pokémon to get started!</p>
          </div>
        ) : (
          pokemon.map((poke) => (
            <PokemonCard
              key={poke.id}
              pokemon={poke}
              isEditing={isEditing}
              onHPChange={handleHPChange}
              onXPChange={handleXPChange}
            />
          ))
        )}
      </div>

      {/* Quick Stats */}
      {pokemon.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Team Stats</h3>
          <div className="grid grid-cols-3 gap-6 md:gap-8 text-center">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xl md:text-2xl font-bold text-white mb-1">
                {pokemon.reduce((sum, p) => sum + p.level, 0)}
              </div>
              <div className="text-sm md:text-base text-gray-400">Total Levels</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xl md:text-2xl font-bold text-white mb-1">
                {pokemon.reduce((sum, p) => sum + p.currentHP, 0)}
              </div>
              <div className="text-sm md:text-base text-gray-400">Total HP</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xl md:text-2xl font-bold text-white mb-1">
                {Math.round(
                  pokemon.reduce((sum, p) => sum + (p.maxHP > 0 ? (p.currentHP / p.maxHP) * 100 : 0), 0) /
                  Math.max(pokemon.length, 1)
                )}%
              </div>
              <div className="text-sm md:text-base text-gray-400">Avg Health</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
