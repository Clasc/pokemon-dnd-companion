"use client";

import { useState } from "react";

import PokemonOverview from "@/features/pokemon/components/PokemonOverview";
import HPBottomSheet from "@/features/pokemon/components/HPBottomSheet";
import TrainerStrip from "@/features/trainer/components/TrainerStrip";
import CreateTrainer from "@/features/trainer/components/CreateTrainer";
import { useAppStore } from "@/store";
import type { Pokemon } from "@/types/pokemon";

export default function DashboardPage() {
  const pokemon = useAppStore.use.pokemonTeam();
  const trainer = useAppStore.use.trainer();
  const setTrainer = useAppStore.use.setTrainer();

  const [hpEditUuid, setHpEditUuid] = useState<string | null>(null);

  const hpEditPokemon: Pokemon | null = hpEditUuid
    ? pokemon[hpEditUuid] ?? null
    : null;

  if (!trainer) {
    return (
      <main className="min-h-screen px-4 py-6">
        <CreateTrainer onTrainerUpdate={setTrainer} />
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-space-6 space-y-space-6">
      <header className="text-center">
        <h1 className="text-responsive-xl font-bold text-white mb-1 font-['Poppins']">
          Session Tracker
        </h1>
        <p className="text-gray-300 text-sm">
          Quick actions during play
        </p>
      </header>

      <TrainerStrip trainer={trainer} />

      <PokemonOverview
        pokemon={pokemon}
        showAttacks
        hideTeamStats
        onEditHP={(_, uuid) => setHpEditUuid(uuid)}
      />

      {hpEditPokemon && hpEditUuid && (
        <HPBottomSheet
          pokemon={hpEditPokemon}
          pokemonUuid={hpEditUuid}
          isOpen={hpEditUuid !== null}
          onClose={() => setHpEditUuid(null)}
        />
      )}
    </main>
  );
}
