"use client";

import { useState, useEffect } from "react";
import { Trainer, DnDAttributes } from "../types/trainer";
import { saveTrainer, loadTrainer } from "../utils/storage";

interface TrainerFormProps {
  onTrainerUpdate?: (character: Trainer) => void;
}

export default function TrainerForm({ onTrainerUpdate }: TrainerFormProps) {
  const [character, setTrainer] = useState<Trainer>({
    name: "",
    level: 1,
    class: "",
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
    const loadedTrainer = loadTrainer();
    setTrainer(loadedTrainer);
    onTrainerUpdate?.(loadedTrainer);
  }, [onTrainerUpdate]);

  const handleInputChange = (field: keyof Trainer, value: string | number) => {
    const updatedTrainer = { ...character, [field]: value };
    setTrainer(updatedTrainer);
  };

  const handleAttributeChange = (
    attribute: keyof DnDAttributes,
    value: number,
  ) => {
    const updatedTrainer = {
      ...character,
      attributes: {
        ...character.attributes,
        [attribute]: value,
      },
    };
    setTrainer(updatedTrainer);
  };

  const handleHPChange = (type: "current" | "max", delta: number) => {
    const field = type === "current" ? "currentHP" : "maxHP";
    const newValue = Math.max(0, character[field] + delta);
    const updatedTrainer = { ...character, [field]: newValue };

    // Ensure current HP doesn't exceed max HP
    if (type === "max" && updatedTrainer.currentHP > newValue) {
      updatedTrainer.currentHP = newValue;
    }
    if (type === "current" && newValue > character.maxHP) {
      updatedTrainer.currentHP = character.maxHP;
    }

    setTrainer(updatedTrainer);
  };

  const handleSave = () => {
    saveTrainer(character);
    setIsEditing(false);
    onTrainerUpdate?.(character);
  };

  const handleCancel = () => {
    const loadedTrainer = loadTrainer();
    setTrainer(loadedTrainer);
    setIsEditing(false);
  };

  const attributeNames: (keyof DnDAttributes)[] = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];

  return (
    <div className="max-w-md mx-auto p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Trainer
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Edit Trainer
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

      <div className="space-y-8">
        {/* Basic Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Trainer Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={character.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter character name"
            />
          ) : (
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white font-medium">
              {character.name || "No name set"}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Level
            </label>
            {isEditing ? (
              <input
                type="number"
                min="1"
                value={character.level}
                onChange={(e) =>
                  handleInputChange("level", parseInt(e.target.value) || 1)
                }
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white font-medium">
                {character.level}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Class
            </label>
            {isEditing ? (
              <input
                type="text"
                value={character.class}
                onChange={(e) => handleInputChange("class", e.target.value)}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter class"
              />
            ) : (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white font-medium">
                {character.class || "No class set"}
              </div>
            )}
          </div>
        </div>

        {/* Attributes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            D&D Attributes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {attributeNames.map((attr) => (
              <div key={attr}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                  {attr}
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={character.attributes[attr]}
                    onChange={(e) =>
                      handleAttributeChange(attr, parseInt(e.target.value) || 1)
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white text-center font-semibold">
                    {character.attributes[attr]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hit Points */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Hit Points
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Max HP
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleHPChange("max", -1)}
                  disabled={!isEditing}
                  className="w-12 h-12 bg-red-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-600 transition-colors font-bold"
                >
                  -
                </button>
                <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white text-center font-bold text-lg">
                  {character.maxHP}
                </div>
                <button
                  onClick={() => handleHPChange("max", 1)}
                  disabled={!isEditing}
                  className="w-12 h-12 bg-green-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-600 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current HP
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleHPChange("current", -1)}
                  disabled={!isEditing}
                  className="w-12 h-12 bg-red-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-600 transition-colors font-bold"
                >
                  -
                </button>
                <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white text-center font-bold text-lg">
                  {character.currentHP}
                </div>
                <button
                  onClick={() => handleHPChange("current", 1)}
                  disabled={!isEditing}
                  className="w-12 h-12 bg-green-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-600 transition-colors font-bold"
                >
                  +
                </button>
              </div>

              {/* HP Bar */}
              {character.maxHP > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-5">
                    <div
                      className={`h-5 rounded-full transition-all duration-300 ${
                        character.currentHP / character.maxHP > 0.6
                          ? "bg-green-500"
                          : character.currentHP / character.maxHP > 0.3
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(100, (character.currentHP / character.maxHP) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center font-medium">
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
