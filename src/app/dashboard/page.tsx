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
    <main className="min-h-screen px-4 md:px-6 lg:px-8 py-4 space-y-6">
      <header className="w-full text-center py-4 md:py-6">
        <h1 className="text-responsive-xl font-bold text-white mb-1 font-['Poppins']">
          Pokémon D&D Companion
        </h1>
        <p className="text-gray-300 text-sm md:text-base">
          Manage your character and Pokémon team
        </p>
      </header>

      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
        <div>
          <TrainerOverview />
        </div>
        <div>
          <PokemonOverview pokemon={pokemon} />
        </div>
      </section>

      <footer className="text-center py-4">
        <p className="text-gray-400 text-xs md:text-sm">
          Trainer Lv.{trainer.level} • Team {Object.keys(pokemon).length}/6 •
          Made with ❤️
        </p>
      </footer>
    </main>
  );
}
