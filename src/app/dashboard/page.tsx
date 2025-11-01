"use client";

import AppMain from "@/components/shared/AppMain";
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
      <AppMain title="Create Trainer">
        <CreateTrainer onTrainerUpdate={setTrainer} />
      </AppMain>
    );
  }

  return (
    <AppMain
      title=" Pokémon D&D Companion"
      subTitle="Manage your character and Pokémon team"
    >
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
    </AppMain>
  );
}
