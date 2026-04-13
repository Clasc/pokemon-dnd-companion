"use client";

import { useAppStore } from "@/store";
import TrainerOverview from "@/features/trainer/components/TrainerOverview";
import PokemonOverview from "@/features/pokemon/components/PokemonOverview";
import CreateTrainer from "@/features/trainer/components/CreateTrainer";

/**
 * /trainer
 *
 * Dedicated Trainer management page with Pokémon team.
 * - If no trainer exists yet, prompts the user to create one.
 * - Otherwise displays both trainer and pokemon side-by-side.
 */
export default function TrainerPage() {
  const trainer = useAppStore.use.trainer();
  const pokemon = useAppStore.use.pokemonTeam();
  const setTrainer = useAppStore.use.setTrainer();

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 md:py-10 overflow-x-hidden">
      <header className="flex items-center justify-between pb-4 border-b border-white/10">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Trainer</h1>
      </header>

      {!trainer ? (
        <CreateTrainer onTrainerUpdate={setTrainer} />
      ) : (
        <section className="flex flex-col md:grid md:grid-cols-2 mt-6">
          <div className="md:border-r md:border-white/10 md:pr-6">
            <TrainerOverview unstyled />
          </div>
          <div className="md:pl-6 mt-6 md:mt-0">
            <PokemonOverview pokemon={pokemon} />
          </div>
        </section>
      )}
    </main>
  );
}
