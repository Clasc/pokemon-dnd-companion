'use client';

import { useState, useEffect } from 'react';
import { Character, DnDAttributes } from '../types/character';
import { saveCharacter, loadCharacter } from '../utils/storage';

interface CharacterFormProps {
  onCharacterUpdate?: (character: Character) => void;
}

export default function CharacterForm({ onCharacterUpdate }: CharacterFormProps) {
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

  const [isEditing, setIsEditing] = useState(false);

  // Load character from localStorage on component mount
  useEffect(() => {
    const loadedCharacter = loadCharacter();
    setCharacter(loadedCharacter);
    onCharacterUpdate?.(loadedCharacter);
  }, [onCharacterUpdate]);

  const handleInputChange = (field: keyof Character, value: string | number) => {
    const updatedCharacter = { ...character, [field]: value };
    setCharacter(updatedCharacter);
  };

  const handleAttributeChange = (attribute: keyof DnDAttributes, value: number) => {
    const updatedCharacter = {
      ...character,
      attributes: {
        ...character.attributes,
        [attribute]: value,
      },
    };
    setCharacter(updatedCharacter);
  };

  const handleHPChange = (type: 'current' | 'max', delta: number) => {
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

  const handleSave = () => {
    saveCharacter(character);
    setIsEditing(false);
    onCharacterUpdate?.(character);
  };

  const handleCancel = () => {
    const loadedCharacter = loadCharacter();
    setCharacter(loadedCharacter);
    setIsEditing(false);
  };

  const attributeNames: (keyof DnDAttributes)[] = [
    'strength',
    'dexterity',
    'constitution',
    'intelligence',
    'wisdom',
    'charisma',
  ];

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Character</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Edit Character
          </button>
        ) : (
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-none px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Character Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={character.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter character name"
            />
          ) : (
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white font-medium">
              {character.name || 'No name set'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Level
            </label>
            {isEditing ? (
              <input
                type="number"
                min="1"
                value={character.level}
                onChange={(e) => handleInputChange('level', parseInt(e.target.value) || 1)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white font-medium">
                {character.level}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Class
            </label>
            {isEditing ? (
              <input
                type="text"
                value={character.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter class"
              />
            ) : (
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white font-medium">
                {character.class || 'No class set'}
              </div>
            )}
          </div>
        </div>

        {/* Attributes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">D&D Attributes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {attributeNames.map((attr) => (
              <div key={attr}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                  {attr}
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={character.attributes[attr]}
                    onChange={(e) => handleAttributeChange(attr, parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white text-center font-semibold">
                    {character.attributes[attr]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hit Points */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hit Points</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max HP
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleHPChange('max', -1)}
                  disabled={!isEditing}
                  className="w-10 h-10 bg-red-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-600 transition-colors font-bold"
                >
                  -
                </button>
                <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white text-center font-bold text-lg">
                  {character.maxHP}
                </div>
                <button
                  onClick={() => handleHPChange('max', 1)}
                  disabled={!isEditing}
                  className="w-10 h-10 bg-green-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-600 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current HP
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleHPChange('current', -1)}
                  disabled={!isEditing}
                  className="w-10 h-10 bg-red-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-600 transition-colors font-bold"
                >
                  -
                </button>
                <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white text-center font-bold text-lg">
                  {character.currentHP}
                </div>
                <button
                  onClick={() => handleHPChange('current', 1)}
                  disabled={!isEditing}
                  className="w-10 h-10 bg-green-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-600 transition-colors font-bold"
                >
                  +
                </button>
              </div>

              {/* HP Bar */}
              {character.maxHP > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-300 ${
                        character.currentHP / character.maxHP > 0.6
                          ? 'bg-green-500'
                          : character.currentHP / character.maxHP > 0.3
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (character.currentHP / character.maxHP) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center font-medium">
                    {character.currentHP} / {character.maxHP} HP
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
