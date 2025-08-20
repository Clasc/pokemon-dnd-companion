"use client";

import { useState } from "react";
import { Pokemon, PokemonTeam } from "@/types/pokemon";
import PokemonCard from "./PokemonCard";
import AddPokemonModal from "@/features/pokemon/components/AddPokemonModal/AddPokemonModal";
import { useAppStore } from "@/store";

interface PokemonOverviewProps {
  pokemon: PokemonTeam;
}

export default function PokemonOverview({ pokemon }: PokemonOverviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addPokemon = useAppStore.use.addPokemon();

  const handleSavePokemon = (newPokemon: Pokemon) => {
    addPokemon(newPokemon);
    setIsModalOpen(false);
  };

  const pokemonLength = Object.keys(pokemon).length;

  return (
    <>
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Pokémon Overview
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
              <span className="text-white text-sm md:text-base font-bold">
                {pokemonLength}
              </span>
            </div>
            <span className="text-gray-300 text-base md:text-lg">/ 6</span>
          </div>
        </div>

        <div className="pokemon-grid space-y-4">
          {pokemonLength === 0 ? (
            <div className="text-center py-12 md:py-16 px-4">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-600/50 to-gray-700/50 flex items-center justify-center border border-white/10">
                <span className="text-4xl md:text-5xl">🔍</span>
              </div>
              <p className="text-gray-400 text-base md:text-lg mb-2">
                No Pokémon in your team yet
              </p>
              <p className="text-gray-500 text-sm md:text-base">
                Click the button below to add one!
              </p>
            </div>
          ) : (
            Object.entries(pokemon).map(([uuid, poke]) => (
              <PokemonCard key={uuid} pokemon={poke} uuid={uuid} />
            ))
          )}
        </div>

        {pokemonLength < 6 && (
          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white border-2 border-dashed border-white/20"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Add Pokémon
            </button>
          </div>
        )}

        {/* Quick Stats */}
        {pokemonLength > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              Team Stats
            </h3>
            <div className="grid grid-cols-3 gap-6 md:gap-8 text-center">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-xl md:text-2xl font-bold text-white mb-1">
                  {Object.values(pokemon).reduce((sum, p) => sum + p.level, 0)}
                </div>
                <div className="text-sm md:text-base text-gray-400">
                  Total Levels
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-xl md:text-2xl font-bold text-white mb-1">
                  {Object.values(pokemon).reduce(
                    (sum, p) => sum + p.currentHP,
                    0,
                  )}
                </div>
                <div className="text-sm md:text-base text-gray-400">
                  Total HP
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-xl md:text-2xl font-bold text-white mb-1">
                  {Math.round(
                    Object.values(pokemon).reduce(
                      (sum, p) =>
                        sum + (p.maxHP > 0 ? (p.currentHP / p.maxHP) * 100 : 0),
                      0,
                    ) / Math.max(pokemonLength, 1),
                  )}
                  %
                </div>
                <div className="text-sm md:text-base text-gray-400">
                  Avg Health
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <AddPokemonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePokemon}
      />
    </>
  );
}
