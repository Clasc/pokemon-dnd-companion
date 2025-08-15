'use client';

import { useState, useEffect } from 'react';
import { Character } from '../types/character';
import { Pokemon } from '../types/pokemon';
import {
  saveCharacter,
  loadCharacter,
  savePokemonTeam,
  loadPokemonTeam
} from '../utils/storage';
import CharacterOverview from '../components/CharacterOverview';
import PokemonOverview from '../components/PokemonOverview';

export default function Home() {
  const [character, setCharacter] = useState<Character>({
    name: '',
    level: 1,
    class: '',
    attributes: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    currentHP: 0,
    maxHP: 0,
  });

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadedCharacter = loadCharacter();
    const loadedPokemon = loadPokemonTeam();

    setCharacter(loadedCharacter);
    setPokemon(loadedPokemon);
    setIsLoading(false);
  }, []);

  // Character handlers
  const handleAttributeChange = (attribute: keyof Character['attributes'], value: number) => {
    const updatedCharacter = {
      ...character,
      attributes: {
        ...character.attributes,
        [attribute]: Math.max(1, Math.min(20, value)), // Clamp between 1-20
      },
    };
    setCharacter(updatedCharacter);
  };

  const handleCharacterHPChange = (type: 'current' | 'max', delta: number) => {
    const field = type === 'current' ? 'currentHP' : 'maxHP';
    const newValue = Math.max(0, character[field] + delta);
    const updatedCharacter = { ...character, [field]: newValue };

    // Ensure current HP doesn't exceed max HP
    if (type === 'max' && updatedCharacter.currentHP > newValue) {
      updatedCharacter.currentHP = newValue;
    }
    if (type === 'current' && newValue > character.maxHP) {
      updatedCharacter.currentHP = character.maxHP;
    }

    setCharacter(updatedCharacter);
  };

  // Pokemon handlers
  const handlePokemonHPChange = (pokemonId: number, delta: number) => {
    const updatedTeam = pokemon.map(p => {
      if (p.id === pokemonId) {
        const newHP = Math.max(0, Math.min(p.maxHP, p.currentHP + delta));
        return { ...p, currentHP: newHP };
      }
      return p;
    });
    setPokemon(updatedTeam);
  };

  const handlePokemonXPChange = (pokemonId: number, delta: number) => {
    const updatedTeam = pokemon.map(p => {
      if (p.id === pokemonId) {
        const newXP = Math.max(0, p.experience + delta);
        return { ...p, experience: newXP };
      }
      return p;
    });
    setPokemon(updatedTeam);
  };

  // Save handlers
  const handleSave = () => {
    saveCharacter(character);
    savePokemonTeam(pokemon);
    setIsEditing(false);
  };

  const handleCancel = () => {
    const loadedCharacter = loadCharacter();
    const loadedPokemon = loadPokemonTeam();
    setCharacter(loadedCharacter);
    setPokemon(loadedPokemon);
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8">
          <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
          <p className="text-white text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 pointer-events-none"></div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 font-['Poppins']">
            Pokémon D&D Companion
          </h1>
          <p className="text-gray-300 text-sm">
            Manage your character and Pokémon team
          </p>
        </header>

        {/* Edit/Save Controls */}
        <div className="mb-6">
          {!isEditing ? (
            <button
              onClick={toggleEdit}
              className="w-full btn-primary rounded-2xl py-4 font-semibold text-lg"
            >
              ✏️ Edit Mode
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 btn-primary rounded-2xl py-4 font-semibold"
              >
                ✅ Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 btn-secondary rounded-2xl py-4 font-semibold"
              >
                ❌ Cancel
              </button>
            </div>
          )}
        </div>

        {/* Character Overview */}
        <CharacterOverview
          character={character}
          isEditing={isEditing}
          onAttributeChange={handleAttributeChange}
          onHPChange={handleCharacterHPChange}
        />

        {/* Pokemon Overview */}
        <PokemonOverview
          pokemon={pokemon}
          isEditing={isEditing}
          onPokemonHPChange={handlePokemonHPChange}
          onPokemonXPChange={handlePokemonXPChange}
        />

        {/* Footer */}
        <footer className="text-center mt-8 pb-6">
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-xs">
              Made with ❤️ for D&D and Pokémon enthusiasts
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <span className="text-xs text-gray-500">
                Character Lv.{character.level}
              </span>
              <span className="text-xs text-gray-500">
                Team: {pokemon.length}/6
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
