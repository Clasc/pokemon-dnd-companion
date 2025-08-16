"use client";

import { useEffect } from "react";
import TrainerOverview from "../components/TrainerOverview";
import PokemonOverview from "../components/PokemonOverview";
import { useAppStore } from "@/store";

export default function Home() {
  const pokemon = useAppStore.use.pokemonList();
  const isLoading = useAppStore.use.isLoading();
  const initialize = useAppStore.use.initialize();
  const trainer = useAppStore.use.trainer();

  useEffect(() => {
    // Load initial trainer data from store
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="glass rounded-2xl p-8">
          <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
          <p className="text-white text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 pointer-events-none"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header - Full Width */}
        <header className="w-full text-center py-6 md:py-8 lg:py-12 px-4 md:px-6">
          <h1 className="text-responsive-xl font-bold text-white mb-2 font-['Poppins']">
            Pokémon D&D Companion
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Manage your character and Pokémon team
          </p>
        </header>

        {/* Main Content Container */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Cards Grid - Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 max-w-6xl mx-auto">
            {/* Trainer Overview */}
            <div className="w-full">
              <TrainerOverview />
            </div>

            {/* Pokemon Overview */}
            <div className="w-full">
              <PokemonOverview pokemon={pokemon} />
            </div>
          </div>
        </div>

        {/* Footer - Full Width */}
        <footer className="w-full text-center py-6 md:py-8 px-4 md:px-6">
          <div className="glass rounded-xl p-4 md:p-6 max-w-md mx-auto">
            <p className="text-gray-400 text-xs md:text-sm">
              Made with ❤️ for D&D and Pokémon enthusiasts
            </p>
            <div className="flex justify-center gap-4 md:gap-6 mt-2">
              <span className="text-xs md:text-sm text-gray-500">
                Trainer Lv.{trainer.level}
              </span>
              <span className="text-xs md:text-sm text-gray-500">
                Team: {pokemon.length}/6
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
