"use client";

import PokemonOverview from "@/features/pokemon/components/PokemonOverview";
import { useAppStore } from "@/store";

/**
 * /pokemon
 *
 * Dedicated Pokémon Team page.
 * Compact version: removes unnecessary wrapper section around the overview
 * to reduce nesting and excess vertical spacing.
 */
export default function PokemonTeamPage() {
  const pokemonTeam = useAppStore.use.pokemonTeam();

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Pokémon Team
        </h1>
        <div className="text-sm text-gray-400">
          {Object.keys(pokemonTeam).length}/6 Slots
        </div>
      </header>

      <PokemonOverview pokemon={pokemonTeam} unstyled />
    </main>
  );
}
