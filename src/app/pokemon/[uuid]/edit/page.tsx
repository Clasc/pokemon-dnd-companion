"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Pokemon } from "@/types/pokemon";
import { useAppStore } from "@/store";
import PokemonForm from "@/features/pokemon/components/PokemonForm";
import AppMain from "@/components/shared/AppMain";
import PokemonNotFound from "./NotFound";

/**
 * /pokemon/[uuid]/edit
 *
 * Route-based Pokémon edit page.
 * - Loads an existing Pokémon by UUID from the Zustand store.
 * - Provides a controlled form (shared <PokemonForm />) to modify fields.
 * - Supports cancel (history back) and save.
 * - Integrates a two-step delete confirmation section.
 * - Uses alert() for validation errors (will be refactored later).
 * - Gracefully handles missing Pokémon (shows not-found UI, no redirect).
 */

export default function EditPokemonPage() {
  const router = useRouter();
  const params = useParams<{ uuid?: string }>();
  const uuid = params?.uuid || "";

  // Select only the needed Pokémon entry to minimize re-renders.
  const pokemonFromStore = useAppStore.use.pokemonTeam()[uuid];
  const updatePokemon = useAppStore.use.updatePokemon();
  const removePokemon = useAppStore.use.removePokemon();

  // Local editable copy (only if Pokémon exists).
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize local state when store data loads / changes.
  useEffect(() => {
    if (pokemonFromStore) {
      setPokemon(pokemonFromStore);
    } else {
      setPokemon(null);
    }
  }, [pokemonFromStore]);

  const isNotFound = useMemo(() => !pokemonFromStore, [pokemonFromStore]);

  const validate = (candidate: Pokemon): string[] => {
    const errors: string[] = [];
    if (!candidate.name.trim()) errors.push("Nickname is required.");
    if (!candidate.type.trim()) errors.push("Species is required.");
    if (!candidate.type1) errors.push("Primary type is required.");
    if (candidate.maxHP < 1) errors.push("Max HP must be at least 1.");
    if (candidate.currentHP < 0) errors.push("Current HP cannot be negative.");
    if (candidate.currentHP > candidate.maxHP)
      errors.push("Current HP cannot exceed Max HP.");
    return errors;
  };

  const handleCancel = () => {
    // Prefer history back. If user landed directly (no meaningful back), push to overview.
    try {
      router.back();
    } catch {
      router.push("/pokemon");
    }
  };

  const handleSave = () => {
    if (!pokemon || isNotFound) return;
    const errors = validate(pokemon);
    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }
    setSubmitting(true);

    const clamped: Pokemon = {
      ...pokemon,
      currentHP: Math.min(Math.max(0, pokemon.currentHP), pokemon.maxHP),
      attacks: pokemon.attacks || [],
    };

    updatePokemon(clamped, uuid);
    router.push("/pokemon");
  };

  const handleDelete = () => {
    removePokemon(uuid);
    router.push("/pokemon");
  };

  if (isNotFound) {
    return <PokemonNotFound />;
  }

  if (!pokemon) {
    // Loading placeholder (very brief; mainly covers hydration edge cases).
    return <AppMain title="Loading Pokemon..." />;
  }

  return (
    <AppMain title="Edit Pokémon">
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
          onChange={(next) => setPokemon(next)}
          // In edit mode we still clamp, but do not auto-fill to full if HP is 0 intentionally.
          autoAdjustCurrentHPOnMaxChange={false}
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
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="glass rounded-2xl p-6 border border-red-500/30 space-y-4">
        <h2 className="text-lg font-semibold text-red-300">Danger Zone</h2>
        <p className="text-sm text-gray-400">
          Deleting this Pokémon removes it permanently from your local team.
          This cannot be undone.
        </p>

        {!showDeleteConfirm && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-semibold transition-colors"
            data-testid="delete-toggle-button"
          >
            Delete Pokémon
          </button>
        )}

        {showDeleteConfirm && (
          <div
            className="p-4 rounded-lg border border-red-500/40 bg-red-900/20 space-y-3"
            data-testid="delete-confirmation"
          >
            <p className="text-sm text-red-200">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{pokemon.name}</span>? This action
              is permanent.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors"
                data-testid="confirm-delete-button"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                data-testid="cancel-delete-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </AppMain>
  );
}
