"use client";

import PokemonOverview from "@/features/pokemon/components/PokemonOverview";
import CreateTrainer from "@/features/trainer/components/CreateTrainer";
import TrainerOverview from "@/features/trainer/components/TrainerOverview";
import { useAppStore } from "@/store";

/**
 * /dashboard
 *
 * Dashboard aggregates high‑level trainer status and Pokémon team overview.
 * This preserves the original combined home page structure after introducing
 * dedicated navigation routes (/pokemon, /trainer) and a global nav shell.
 */
export default function DashboardPage() {
  const pokemon = useAppStore.use.pokemonTeam();
  const trainer = useAppStore.use.trainer();
  const setTrainer = useAppStore.use.setTrainer();

  // If no trainer exists yet, show the creation flow centered.
  if (!trainer) {
    return (
      <main className="min-h-screen px-4 py-6">
        <CreateTrainer onTrainerUpdate={setTrainer} />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full text-center py-6 md:py-8 lg:py-12 px-4 md:px-6">
          <h1 className="text-responsive-xl font-bold text-white mb-2 font-['Poppins']">
            Pokémon D&D Companion
          </h1>
            <p className="text-gray-300 text-sm md:text-base">
            Manage your character and Pokémon team
          </p>
        </header>

        {/* Content */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 max-w-6xl mx-auto">
            <div className="w-full">
              <TrainerOverview />
            </div>
            <div className="w-full">
              <PokemonOverview pokemon={pokemon} />
            </div>
          </div>
        </div>

        {/* Footer */}
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
                Team: {Object.keys(pokemon).length}/6
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
