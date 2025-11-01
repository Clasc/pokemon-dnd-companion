"use client";

import { useState, useEffect } from "react";
import EditButtons from "@/components/shared/EditButtons";
import { useAppStore } from "@/store";
import { Trainer, InventoryItem } from "@/types/trainer";
import EditButton from "@/components/shared/ActionButtons/EditButton";
import TrainerInventory from "../TrainerInventory";
import InteractiveProgress from "@/components/shared/ui/InteractiveProgress";

export default function TrainerOverview() {
  const [isEditing, setIsEditing] = useState(false);
  const trainer = useAppStore.use.trainer();
  const setTrainer = useAppStore.use.setTrainer();
  const [editedTrainer, setEditedTrainer] = useState<Trainer>(trainer!);

  useEffect(() => {
    if (trainer) {
      setEditedTrainer({
        ...trainer,
        inventory: trainer.inventory || [],
        pokedollars: trainer.pokedollars || 0,
      });
    }
  }, [trainer]);

  if (!trainer) {
    return null;
  }

  const handleAttributeChange = (
    attribute: keyof Trainer["attributes"],
    value: number,
  ) => {
    const updatedTrainer = {
      ...editedTrainer,
      attributes: {
        ...editedTrainer.attributes,
        [attribute]: Math.max(1, Math.min(20, value)), // Clamp between 1-20
      },
    };
    setEditedTrainer(updatedTrainer);
  };

  const handleHPChange = (type: "current" | "max", delta: number) => {
    const field = type === "current" ? "currentHP" : "maxHP";
    const newValue = Math.max(0, editedTrainer[field] + delta);
    const updatedTrainer = { ...editedTrainer, [field]: newValue };

    if (type === "max" && updatedTrainer.currentHP > newValue) {
      updatedTrainer.currentHP = newValue;
    }
    if (type === "current" && newValue > editedTrainer.maxHP) {
      updatedTrainer.currentHP = editedTrainer.maxHP;
    }

    setEditedTrainer(updatedTrainer);
  };

  const handleSave = () => {
    setTrainer(editedTrainer);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTrainer(trainer);
    setIsEditing(false);
  };

  const handleUseItem = (itemId: string) => {
    const currentInventory = editedTrainer.inventory || [];
    const updatedInventory = currentInventory
      .map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: Math.max(0, item.quantity - 1) };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    const updatedTrainer = { ...editedTrainer, inventory: updatedInventory };
    setEditedTrainer(updatedTrainer);

    if (!isEditing) {
      setTrainer(updatedTrainer);
    }
  };

  const handleAddItem = (newItem: Omit<InventoryItem, "id">) => {
    const itemWithId: InventoryItem = {
      id: Date.now().toString(),
      ...newItem,
    };

    const updatedTrainer = {
      ...editedTrainer,
      inventory: [...(editedTrainer.inventory || []), itemWithId],
    };
    setEditedTrainer(updatedTrainer);

    if (!isEditing) {
      setTrainer(updatedTrainer);
    }
  };

  const handleUpdatePokedollars = (newAmount: number) => {
    const updatedTrainer = {
      ...editedTrainer,
      pokedollars: newAmount,
    };
    setEditedTrainer(updatedTrainer);

    if (!isEditing) {
      setTrainer(updatedTrainer);
    }
  };

  const handleIncreaseItem = (itemId: string) => {
    const currentInventory = editedTrainer.inventory || [];
    const updatedInventory = currentInventory.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    const updatedTrainer = { ...editedTrainer, inventory: updatedInventory };
    setEditedTrainer(updatedTrainer);

    if (!isEditing) {
      setTrainer(updatedTrainer);
    }
  };

  const handleTrainerHPDragChange = (value: number) => {
    if (!trainer) return;
    const clamped = Math.max(0, Math.min(value, trainer.maxHP));
    if (clamped !== trainer.currentHP) {
      setTrainer({ ...trainer, currentHP: clamped });
    }
  };

  const attributeNames: (keyof Trainer["attributes"])[] = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];

  const getAttributeDisplayName = (attr: string) => {
    const names: { [key: string]: string } = {
      strength: "Strength",
      dexterity: "Dexterity",
      constitution: "Constitution",
      intelligence: "Intelligence",
      wisdom: "Wisdom",
      charisma: "Charisma",
    };
    return names[attr] || attr;
  };

  const getAttributeShortName = (attr: keyof Trainer["attributes"]) => {
    const shortNames = {
      strength: "STR",
      dexterity: "DEX",
      constitution: "CON",
      intelligence: "INT",
      wisdom: "WIS",
      charisma: "CHA",
    };
    return shortNames[attr];
  };

  const getAttributeModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const formatModifier = (modifier: number) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  return (
    <>
      {/* Read-only Summary View */}
      <div className="glass rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all duration-300 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white p-2">Trainer Overview</h2>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {trainer.level || 1}
            </span>
          </div>
        </div>
        <EditButton onClick={() => setIsEditing(true)} />
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-2">
            {trainer.name || "Unnamed Trainer"}
          </h3>
          <p className="text-gray-300 text-sm">
            Level {trainer.level} {trainer.class || "Adventurer"}
          </p>
        </div>

        {/* Attributes Chips */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex flex-wrap justify-center gap-2">
            {attributeNames.map((attr) => (
              <div
                key={attr}
                className="bg-white/10 rounded-full px-3 py-1 text-sm font-medium text-white flex items-center gap-2"
              >
                <span className="text-gray-300 font-semibold">
                  {getAttributeShortName(attr)}
                </span>
                <span className="font-bold text-base">
                  {formatModifier(
                    getAttributeModifier(trainer.attributes[attr]),
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Hit Points</h3>
            <span className="text-xs text-gray-300 font-medium">
              {trainer.currentHP}/{trainer.maxHP}
            </span>
          </div>
          <InteractiveProgress
            type="hp"
            current={trainer.currentHP}
            max={trainer.maxHP}
            onChange={handleTrainerHPDragChange}
            label="HP"
            step={1}
            className="mb-3"
          />
        </div>

        {/* Inventory Section */}
        <TrainerInventory
          inventory={trainer.inventory || []}
          pokedollars={trainer.pokedollars || 0}
          onUseItem={handleUseItem}
          onAddItem={handleAddItem}
          onIncreaseItem={handleIncreaseItem}
          onUpdatePokedollars={handleUpdatePokedollars}
          isEditable={true}
        />
      </div>

      {/* Editing Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-white/20">
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Trainer</h2>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {editedTrainer.level || 1}
                </span>
              </div>
            </div>

            {/* Trainer Name & Class - Editable */}
            <div className="mb-6 space-y-4">
              <input
                type="text"
                value={editedTrainer.name}
                onChange={(e) =>
                  setEditedTrainer({ ...editedTrainer, name: e.target.value })
                }
                placeholder="Trainer Name"
                className="w-full bg-white/10 text-white placeholder-gray-400 rounded-lg p-3 border border-white/20 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  value={editedTrainer.class}
                  onChange={(e) =>
                    setEditedTrainer({
                      ...editedTrainer,
                      class: e.target.value,
                    })
                  }
                  placeholder="Class"
                  className="w-full bg-white/10 text-white placeholder-gray-400 rounded-lg p-3 border border-white/20 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <input
                  type="number"
                  value={editedTrainer.level}
                  onChange={(e) =>
                    setEditedTrainer({
                      ...editedTrainer,
                      level: parseInt(e.target.value) || 1,
                    })
                  }
                  placeholder="Level"
                  className="w-24 bg-white/10 text-white placeholder-gray-400 rounded-lg p-3 border border-white/20 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Attributes */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Attributes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attributeNames.map((attr) => (
                  <div
                    key={attr}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <span className="text-gray-300 font-medium">
                      {getAttributeDisplayName(attr)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleAttributeChange(
                            attr,
                            editedTrainer.attributes[attr] - 1,
                          )
                        }
                        className="w-8 h-8 rounded-md bg-red-500/80 hover:bg-red-500 text-white font-bold transition-colors"
                      >
                        -
                      </button>
                      <div className="w-12 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                        <span className="text-white font-semibold">
                          {editedTrainer.attributes[attr]}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleAttributeChange(
                            attr,
                            editedTrainer.attributes[attr] + 1,
                          )
                        }
                        className="w-8 h-8 rounded-md bg-green-500/80 hover:bg-green-500 text-white font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hit Points */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Hit Points</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleHPChange("current", -1)}
                    className="w-8 h-8 rounded-md bg-red-500/80 hover:bg-red-500 text-white font-bold transition-colors"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleHPChange("current", 1)}
                    className="w-8 h-8 rounded-md bg-green-500/80 hover:bg-green-500 text-white font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <InteractiveProgress
                type="hp"
                current={editedTrainer.currentHP}
                max={editedTrainer.maxHP}
                onChange={(val: number) =>
                  setEditedTrainer({
                    ...editedTrainer,
                    currentHP: Math.max(0, Math.min(val, editedTrainer.maxHP)),
                  })
                }
                label="HP"
                step={1}
                className="mb-3"
              />

              <div className="flex justify-between items-center">
                <div className="text-base text-gray-300 font-medium">
                  {editedTrainer.currentHP}/{editedTrainer.maxHP}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleHPChange("max", -1)}
                    className="w-7 h-7 rounded bg-red-500/60 hover:bg-red-500/80 text-white text-xs font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm text-gray-400 px-1">Max HP</span>
                  <button
                    onClick={() => handleHPChange("max", 1)}
                    className="w-7 h-7 rounded bg-green-500/60 hover:bg-green-500/80 text-white text-xs font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <EditButtons handleCancel={handleCancel} handleSave={handleSave} />
          </div>
        </div>
      )}
    </>
  );
}
