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
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Pokémon Overview</h2>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {pokemon.length}
            </span>
          </div>
          <span className="text-gray-300 text-sm">/ 6</span>
        </div>
      </div>

      <div className="space-y-0">
        {pokemon.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-600/50 to-gray-700/50 flex items-center justify-center border border-white/10">
              <span className="text-3xl">🔍</span>
            </div>
            <p className="text-gray-400 text-sm">No Pokémon in your team yet</p>
            <p className="text-gray-500 text-xs mt-1">Add some Pokémon to get started!</p>
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
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">
                {pokemon.reduce((sum, p) => sum + p.level, 0)}
              </div>
              <div className="text-xs text-gray-400">Total Levels</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {pokemon.reduce((sum, p) => sum + p.currentHP, 0)}
              </div>
              <div className="text-xs text-gray-400">Total HP</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {Math.round(
                  pokemon.reduce((sum, p) => sum + (p.maxHP > 0 ? (p.currentHP / p.maxHP) * 100 : 0), 0) /
                  Math.max(pokemon.length, 1)
                )}%
              </div>
              <div className="text-xs text-gray-400">Avg Health</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
