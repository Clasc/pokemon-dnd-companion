"use client";

import { useCallback, useEffect, useState } from "react";
import { formatPokemonName } from "@/types/pokeapi";
import { Pokemon } from "@/types/pokemon";
import { useAppStore } from "@/store";
import BaseModal from "@/components/shared/ui/BaseModal";
import BottomSheet from "@/components/shared/ui/BottomSheet";
import PokemonForm from "@/features/pokemon/components/PokemonForm";
import { useMediaQuery } from "@/utils/useMediaQuery";

interface AddPokemonBottomSheetProps {
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
  armorClass: 10,
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

export default function AddPokemonBottomSheet({
  isOpen,
  onClose,
}: AddPokemonBottomSheetProps) {
  const addPokemon = useAppStore.use.addPokemon();
  const [pokemon, setPokemon] = useState<Pokemon>(initialPokemon);
  const [submitting, setSubmitting] = useState(false);
  const [speciesLoading, setSpeciesLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const handleSave = useCallback(() => {
    if (submitting || speciesLoading) return;
    const errors: string[] = [];
    if (!pokemon.type.trim()) errors.push("Species is required.");
    if (!pokemon.type1) errors.push("Primary type is required.");
    if (pokemon.maxHP < 1) errors.push("Max HP must be at least 1.");
    if (pokemon.currentHP < 0) errors.push("Current HP cannot be negative.");
    if (pokemon.currentHP > pokemon.maxHP)
      errors.push("Current HP cannot exceed Max HP.");
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
  }, [pokemon, addPokemon, onClose, submitting, speciesLoading]);

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

  const formContent = (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Add Pokémon</h2>
      <PokemonForm
        pokemon={pokemon}
        onChange={setPokemon}
        autoAdjustCurrentHPOnMaxChange
        onSpeciesLoadingChange={setSpeciesLoading}
      />
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={handleCancel}
          disabled={submitting}
          className="flex-1 py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          data-testid="save-pokemon-button"
          onClick={handleSave}
          disabled={submitting || speciesLoading}
          className="flex-1 py-3 px-4 rounded-lg bg-interactive hover:bg-interactive-hover text-white font-semibold transition-colors disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Pokémon"}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={handleCancel}>
        {formContent}
      </BottomSheet>
    );
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      size="lg"
      titleId="add-pokemon-title"
    >
      <div className="p-space-2">
        {formContent}
      </div>
    </BaseModal>
  );
}
