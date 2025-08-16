"use client";

import { useState, useEffect } from "react";
import { Pokemon } from "../../types/pokemon";
import AddPokemonForm from "./AddPokemonForm";

interface AddPokemonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pokemon: Pokemon) => void;
}

const initialPokemonState: Pokemon = {
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
  onSave,
}: AddPokemonModalProps) {
  const [newPokemon, setNewPokemon] = useState(initialPokemonState);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setNewPokemon(initialPokemonState);
    }
  }, [isOpen]);

  const handleSave = () => {
    // Basic validation
    if (!newPokemon.name || !newPokemon.type || !newPokemon.type1) {
      alert("Please fill in at least the name, species, and primary type.");
      return;
    }

    onSave(newPokemon);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="glass rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Pokémon</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <AddPokemonForm pokemon={newPokemon} setPokemon={setNewPokemon} />

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors"
          >
            Save Pokémon
          </button>
        </div>
      </div>
    </div>
  );
}
