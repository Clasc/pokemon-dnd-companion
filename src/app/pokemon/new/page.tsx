"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pokemon } from "@/types/pokemon";
import { useAppStore } from "@/store";
import AddPokemonForm from "@/features/pokemon/components/AddPokemonModal/AddPokemonForm";

/**
 * Route-based Pokémon creation page.
 * Replaces the former AddPokemonModal.
 * Provides:
 * - Direct URL access (/pokemon/new)
 * - Browser back navigation
 * - Full-page form space
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
        // Clamp just in case inputs were modified mid-validation

        currentHP: Math.min(Math.max(0, pokemon.currentHP), pokemon.maxHP),
      },
      uuid,
    );

    router.push("/pokemon");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Add Pokémon</h1>
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm text-white transition-colors"
        >
          Back
        </button>
      </header>

      <section className="glass rounded-2xl p-6 border border-white/10 space-y-6">
        <AddPokemonForm pokemon={pokemon} setPokemon={setPokemon} />

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
    </main>
  );
}
