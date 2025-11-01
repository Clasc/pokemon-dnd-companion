"use client";

import AppMain from "@/components/shared/AppMain";
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
    <AppMain title="Pokémon Team">
      <div className="text-sm text-gray-400">
        {Object.keys(pokemonTeam).length}/6 Slots
      </div>

      <PokemonOverview pokemon={pokemonTeam} unstyled />
    </AppMain>
  );
}
