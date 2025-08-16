"use client";

import { useState, useEffect } from "react";
import { Character } from "../types/character";
import EditButtons from "./EditButtons";

interface CharacterOverviewProps {
  character: Character;
  onSave: (character: Character) => void;
}

export default function CharacterOverview({
  character,
  onSave,
}: CharacterOverviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCharacter, setEditedCharacter] = useState<Character>(character);

  useEffect(() => {
    setEditedCharacter(character);
  }, [character]);

  const handleAttributeChange = (
    attribute: keyof Character["attributes"],
    value: number,
  ) => {
    const updatedCharacter = {
      ...editedCharacter,
      attributes: {
        ...editedCharacter.attributes,
        [attribute]: Math.max(1, Math.min(20, value)), // Clamp between 1-20
      },
    };
    setEditedCharacter(updatedCharacter);
  };

  const handleHPChange = (type: "current" | "max", delta: number) => {
    const field = type === "current" ? "currentHP" : "maxHP";
    const newValue = Math.max(0, editedCharacter[field] + delta);
    const updatedCharacter = { ...editedCharacter, [field]: newValue };

    // Ensure current HP doesn't exceed max HP
    if (type === "max" && updatedCharacter.currentHP > newValue) {
      updatedCharacter.currentHP = newValue;
    }
    if (type === "current" && newValue > editedCharacter.maxHP) {
      updatedCharacter.currentHP = editedCharacter.maxHP;
    }

    setEditedCharacter(updatedCharacter);
  };

  const handleSave = () => {
    onSave(editedCharacter);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCharacter(character);
    setIsEditing(false);
  };
  const attributeNames: (keyof Character["attributes"])[] = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];

  const getAttributeDisplayName = (attr: string) => {
    switch (attr) {
      case "strength":
        return "Strength";
      case "dexterity":
        return "Dexterity";
      case "constitution":
        return "Constitution";
      case "intelligence":
        return "Intelligence";
      case "wisdom":
        return "Wisdom";
      case "charisma":
        return "Charisma";
      default:
        return attr;
    }
  };

  const getHPPercentage = () => {
    return editedCharacter.maxHP > 0
      ? (editedCharacter.currentHP / editedCharacter.maxHP) * 100
      : 0;
  };

  const getHPColor = () => {
    const percentage = getHPPercentage();
    if (percentage > 60) return "var(--accent-green)";
    if (percentage > 30) return "var(--accent-yellow)";
    return "var(--accent-red)";
  };

  return (
    <div
      className={`glass rounded-2xl p-6 ${
        !isEditing ? "cursor-pointer hover:bg-white/10" : ""
      }`}
      onClick={() => !isEditing && setIsEditing(true)}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Character Overview</h2>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-white text-sm font-bold">
            {editedCharacter.level || 1}
          </span>
        </div>
      </div>

      {/* Character Name & Class */}
      <div className="mb-8">
        <div className="text-center mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-2">
            {editedCharacter.name || "Unnamed Character"}
          </h3>
          <p className="text-gray-300 text-sm">
            Level {editedCharacter.level}{" "}
            {editedCharacter.class || "Adventurer"}
          </p>
        </div>
      </div>

      {/* Attributes */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Attributes</h3>
        <div className="attributes-grid space-y-3">
          {attributeNames.map((attr) => (
            <div
              key={attr}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <span className="text-gray-300 text-sm md:text-base font-medium">
                {getAttributeDisplayName(attr)}
              </span>
              <div className="flex items-center gap-3">
                {isEditing && (
                  <>
                    <button
                      onClick={() =>
                        handleAttributeChange(
                          attr,
                          editedCharacter.attributes[attr] - 1,
                        )
                      }
                      className="w-7 h-7 rounded-md bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                    >
                      -
                    </button>
                  </>
                )}
                <div className="w-14 h-10 md:w-16 md:h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                  <span className="text-white font-semibold text-sm md:text-base">
                    {editedCharacter.attributes[attr]}
                  </span>
                </div>
                {isEditing && (
                  <>
                    <button
                      onClick={() =>
                        handleAttributeChange(
                          attr,
                          editedCharacter.attributes[attr] + 1,
                        )
                      }
                      className="w-7 h-7 rounded-md bg-green-500/80 hover:bg-green-500 text-white text-xs font-bold transition-colors"
                    >
                      +
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hit Points */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Hit Points</h3>
          <div className="flex items-center gap-3">
            {isEditing && (
              <>
                <button
                  onClick={() => handleHPChange("current", -1)}
                  className="w-7 h-7 rounded-md bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                >
                  -
                </button>
                <button
                  onClick={() => handleHPChange("current", 1)}
                  className="w-7 h-7 rounded-md bg-green-500/80 hover:bg-green-500 text-white text-xs font-bold transition-colors"
                >
                  +
                </button>
              </>
            )}
          </div>
        </div>

        {/* HP Bar */}
        <div className="w-full bg-gray-600/50 rounded-full h-4 md:h-5 overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-500 relative"
            style={{
              width: `${Math.min(100, getHPPercentage())}%`,
              backgroundColor: getHPColor(),
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm md:text-base text-gray-300 font-medium">
            {editedCharacter.currentHP}/{editedCharacter.maxHP}
          </div>
          {isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleHPChange("max", -1)}
                className="w-6 h-6 rounded bg-red-500/60 hover:bg-red-500/80 text-white text-xs font-bold transition-colors"
              >
                -
              </button>
              <span className="text-xs md:text-sm text-gray-400 px-2">Max</span>
              <button
                onClick={() => handleHPChange("max", 1)}
                className="w-6 h-6 rounded bg-green-500/60 hover:bg-green-500/80 text-white text-xs font-bold transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
      {isEditing && (
        <EditButtons
          handleCancel={handleCancel}
          handleSave={handleSave}
        ></EditButtons>
      )}
    </div>
  );
}
