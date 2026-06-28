"use client";

import { useState } from "react";

import PokemonOverview from "@/features/pokemon/components/PokemonOverview";
import StatAdjustSheet from "@/features/pokemon/components/StatAdjustSheet";
import TrainerStrip from "@/features/trainer/components/TrainerStrip";
import CreateTrainer from "@/features/trainer/components/CreateTrainer";
import { useAppStore } from "@/store";
import type { Pokemon } from "@/types/pokemon";

export default function DashboardPage() {
  const pokemon = useAppStore.use.pokemonTeam();
  const trainer = useAppStore.use.trainer();
  const setTrainer = useAppStore.use.setTrainer();

  const [statEditUuid, setStatEditUuid] = useState<string | null>(null);

  const statEditPokemon: Pokemon | null = statEditUuid
    ? pokemon[statEditUuid] ?? null
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
        onEditStat={(_, uuid) => setStatEditUuid(uuid)}
      />

      {statEditPokemon && statEditUuid && (
        <StatAdjustSheet
          pokemon={statEditPokemon}
          pokemonUuid={statEditUuid}
          isOpen={statEditUuid !== null}
          onClose={() => setStatEditUuid(null)}
        />
      )}
    </main>
  );
}
