"use client";

import PokemonOverview from "@/features/pokemon/components/PokemonOverview";
import { useAppStore } from "@/store";

/**
 * /pokemon
 *
 * Dedicated Pokémon Team page.
 * - Shows current team via <PokemonOverview />
 * - Add flow handled by the overview's built-in "Add Pokémon" button (navigates to /pokemon/new)
 * - Team editing (per Pokémon) routes to /pokemon/[uuid]/edit
 */
export default function PokemonTeamPage() {
  const pokemonTeam = useAppStore.use.pokemonTeam();

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Pokémon Team
        </h1>
        <div className="text-sm text-gray-400">
          {Object.keys(pokemonTeam).length}/6 Slots
        </div>
      </header>

      <section aria-labelledby="team-section" className="space-y-6">
        <h2 id="team-section" className="sr-only">
          Team Overview
        </h2>
        <PokemonOverview pokemon={pokemonTeam} />
      </section>
    </main>
  );
}
