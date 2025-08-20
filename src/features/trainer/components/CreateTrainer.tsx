"use client";

import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { Trainer, DnDAttributes } from "@/types/trainer";

interface TrainerFormProps {
  onTrainerUpdate?: (character: Trainer) => void;
}

export default function CreateTrainer({ onTrainerUpdate }: TrainerFormProps) {
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

  const changeHandler =
    (field: keyof Trainer) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
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

  const handleMaxHPChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newMaxHP = Math.max(0, parseInt(event.target.value) || 0);
    const updatedTrainer = {
      ...character,
      maxHP: newMaxHP,
      currentHP: newMaxHP, // Automatically set current HP to max HP
    };
    setTrainer(updatedTrainer);
  };

  const handleSave = () => {
    onTrainerUpdate?.(character);
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

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Trainer Name
          </label>

          <input
            type="text"
            value={character.name}
            onChange={changeHandler("name")}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter character name"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Level
            </label>

            <input
              type="number"
              min="1"
              value={character.level}
              onChange={changeHandler("level")}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Class
            </label>

            <input
              type="text"
              value={character.class}
              onChange={changeHandler("class")}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter class"
            />
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

                <input
                  type="number"
                  min="1"
                  max="20"
                  value={character.attributes[attr]}
                  onChange={(e) =>
                    handleAttributeChange(attr, parseInt(e.target.value) || 0)
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
              <input
                type="number"
                min="0"
                value={character.maxHP}
                onChange={handleMaxHPChange}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter max HP"
              />
            </div>

            <div>
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
