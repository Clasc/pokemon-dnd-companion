"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pokemon } from "@/types/pokemon";
import { useAppStore } from "@/store";
import PokemonForm from "@/features/pokemon/components/PokemonForm";
import AppMain from "@/components/shared/AppMain";

/**
 * /pokemon/new
 *
 * Route-based Pokémon creation page.
 * Replaces the legacy AddPokemonModal and now uses the shared <PokemonForm />.
 * Validation currently surfaces errors via alert() (to be refactored later per plan).
 */

const initialPokemon: Pokemon = {
  type: "",
  name: "",
  level: 1,
  type1: "normal",
  currentHP: 10,
  maxHP: 10,
  experience: 0,
  experienceToNext: 100,
  attributes: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
  attacks: [],
};

export default function NewPokemonPage() {
  const router = useRouter();
  const addPokemon = useAppStore.use.addPokemon();
  const [pokemon, setPokemon] = useState<Pokemon>(initialPokemon);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): string[] => {
    const errors: string[] = [];
    if (!pokemon.name.trim()) errors.push("Nickname is required.");
    if (!pokemon.type.trim()) errors.push("Species is required.");
    if (!pokemon.type1) errors.push("Primary type is required.");
    if (pokemon.maxHP < 1) errors.push("Max HP must be at least 1.");
    if (pokemon.currentHP < 0) errors.push("Current HP cannot be negative.");
    if (pokemon.currentHP > pokemon.maxHP)
      errors.push("Current HP cannot exceed Max HP.");
    return errors;
  };

  const handleSave = () => {
    const errors = validate();
    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }
    setSubmitting(true);
    const uuid = crypto.randomUUID();

    addPokemon(
      {
        ...pokemon,
        currentHP: Math.min(Math.max(0, pokemon.currentHP), pokemon.maxHP),
        attacks: pokemon.attacks || [],
      },
      uuid,
    );

    router.push("/pokemon");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <AppMain title="Add Pokémon">
      <button
        type="button"
        onClick={handleCancel}
        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm text-white transition-colors"
      >
        Back
      </button>

      <section className="glass rounded-2xl p-6 border border-white/10 space-y-6">
        <PokemonForm
          pokemon={pokemon}
          onChange={setPokemon}
          autoAdjustCurrentHPOnMaxChange
          testIds={{
            species: "species-input",
            nickname: "nickname-input",
          }}
        />

        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            data-testid="save-pokemon-button"
            onClick={handleSave}
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Pokémon"}
          </button>
        </div>
      </section>
    </AppMain>
  );
}
