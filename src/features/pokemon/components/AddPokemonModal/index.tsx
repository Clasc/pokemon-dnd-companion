"use client";

import { useCallback, useEffect, useState } from "react";
import { formatPokemonName } from "@/types/pokeapi";
import { Pokemon } from "@/types/pokemon";
import { useAppStore } from "@/store";
import BaseModal from "@/components/shared/ui/BaseModal";
import PokemonForm from "@/features/pokemon/components/PokemonForm";

interface AddPokemonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function AddPokemonModal({
  isOpen,
  onClose,
}: AddPokemonModalProps) {
  const addPokemon = useAppStore.use.addPokemon();
  const [pokemon, setPokemon] = useState<Pokemon>(initialPokemon);
  const [submitting, setSubmitting] = useState(false);
  const [speciesLoading, setSpeciesLoading] = useState(false);

  const validate = (): string[] => {
    const errors: string[] = [];
    if (!pokemon.type.trim()) errors.push("Species is required.");
    if (!pokemon.type1) errors.push("Primary type is required.");
    if (pokemon.maxHP < 1) errors.push("Max HP must be at least 1.");
    if (pokemon.currentHP < 0) errors.push("Current HP cannot be negative.");
    if (pokemon.currentHP > pokemon.maxHP)
      errors.push("Current HP cannot exceed Max HP.");
    return errors;
  };

  const handleSave = useCallback(() => {
    const errors = validate();
    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }
    setSubmitting(true);
    const uuid = crypto.randomUUID();
    const pokemonName =
      pokemon.name.trim() || formatPokemonName(pokemon.type);

    addPokemon(
      {
        ...pokemon,
        name: pokemonName,
        currentHP: Math.min(Math.max(0, pokemon.currentHP), pokemon.maxHP),
        attacks: pokemon.attacks || [],
      },
      uuid,
    );

    setPokemon(initialPokemon);
    onClose();
  }, [pokemon, addPokemon, onClose]);

  const handleCancel = () => {
    setPokemon(initialPokemon);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setPokemon(initialPokemon);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (!submitting && !speciesLoading) handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, submitting, speciesLoading, handleSave]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      size="lg"
      titleId="add-pokemon-title"
    >
      <div className="p-2">
        <h2 id="add-pokemon-title" className="text-xl font-bold mb-4 text-white">
          Add Pokémon
        </h2>
        
        <PokemonForm
          pokemon={pokemon}
          onChange={setPokemon}
          autoAdjustCurrentHPOnMaxChange
          onSpeciesLoadingChange={setSpeciesLoading}
        />

        <div className="flex justify-end gap-4 pt-4 mt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting || speciesLoading}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            data-testid="save-pokemon-button"
            onClick={handleSave}
            disabled={submitting || speciesLoading}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Pokémon"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}