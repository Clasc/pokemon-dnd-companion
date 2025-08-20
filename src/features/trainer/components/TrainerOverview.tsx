"use client";

import { useState, useEffect } from "react";
import EditButtons from "@/components/shared/EditButtons";
import { useAppStore } from "@/store";
import { Trainer, InventoryItem } from "@/types/trainer";

export default function TrainerOverview() {
  const [isEditing, setIsEditing] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemDescription, setNewItemDescription] = useState("");
  const trainer = useAppStore.use.trainer();
  const setTrainer = useAppStore.use.setTrainer();
  const [editedTrainer, setEditedTrainer] = useState<Trainer>(trainer!);

  useEffect(() => {
    if (trainer) {
      setEditedTrainer({
        ...trainer,
        inventory: trainer.inventory || [],
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

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        quantity: Math.max(1, newItemQuantity),
        description: newItemDescription.trim() || undefined,
      };

      const updatedTrainer = {
        ...editedTrainer,
        inventory: [...(editedTrainer.inventory || []), newItem],
      };
      setEditedTrainer(updatedTrainer);

      if (!isEditing) {
        setTrainer(updatedTrainer);
      }

      setNewItemName("");
      setNewItemQuantity(1);
      setNewItemDescription("");
      setShowAddItem(false);
    }
  };

  const handleCancelAddItem = () => {
    setNewItemName("");
    setNewItemQuantity(1);
    setNewItemDescription("");
    setShowAddItem(false);
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

  const getHPPercentage = (hp: number, maxHp: number) => {
    return maxHp > 0 ? (hp / maxHp) * 100 : 0;
  };

  const getHPColor = (percentage: number) => {
    if (percentage > 60) return "var(--accent-green)";
    if (percentage > 30) return "var(--accent-yellow)";
    return "var(--accent-red)";
  };

  const trainerHPPercentage = getHPPercentage(trainer.currentHP, trainer.maxHP);
  const trainerHPColor = getHPColor(trainerHPPercentage);

  const editedHPPercentage = getHPPercentage(
    editedTrainer.currentHP,
    editedTrainer.maxHP,
  );
  const editedHPColor = getHPColor(editedHPPercentage);

  return (
    <>
      {/* Read-only Summary View */}
      <div
        className="glass rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all duration-300 space-y-4"
        onClick={() => setIsEditing(true)}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white p-2">Trainer Overview</h2>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {trainer.level || 1}
            </span>
          </div>
        </div>

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
                  {trainer.attributes[attr]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Hit Points</h3>
          <div className="w-full bg-gray-600/50 rounded-full h-4 md:h-5 overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, trainerHPPercentage)}%`,
                backgroundColor: trainerHPColor,
              }}
            />
          </div>
          <div className="text-sm md:text-base text-gray-300 font-medium text-center">
            {trainer.currentHP}/{trainer.maxHP}
          </div>
        </div>

        {/* Inventory Section */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="w-full flex items-center justify-between text-lg font-semibold text-white hover:text-gray-300 transition-colors"
          >
            <span>Inventory ({trainer.inventory?.length || 0})</span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${showInventory ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showInventory && (
            <div className="mt-4 space-y-2">
              {!trainer.inventory || trainer.inventory.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  No items in inventory
                </p>
              ) : (
                trainer.inventory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {item.name}
                        </span>
                        <span className="text-gray-400 text-sm">
                          x{item.quantity}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-gray-400 text-xs mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleUseItem(item.id)}
                      className="px-3 py-1 bg-blue-500/80 hover:bg-blue-500 text-white text-sm rounded-md transition-colors"
                    >
                      Use
                    </button>
                  </div>
                ))
              )}

              <button
                onClick={() => setShowAddItem(true)}
                className="w-full p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Item
              </button>
            </div>
          )}
        </div>
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

              <div className="w-full bg-gray-600/50 rounded-full h-5 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, editedHPPercentage)}%`,
                    backgroundColor: editedHPColor,
                  }}
                />
              </div>

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

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add New Item</h2>
              <button
                onClick={handleCancelAddItem}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="h-6 w-6"
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
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Item name"
                className="w-full bg-white/10 text-white placeholder-gray-400 rounded-lg p-3 border border-white/20 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />

              <input
                type="number"
                value={newItemQuantity}
                onChange={(e) =>
                  setNewItemQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                placeholder="Quantity"
                min="1"
                className="w-full bg-white/10 text-white placeholder-gray-400 rounded-lg p-3 border border-white/20 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />

              <textarea
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={3}
                className="w-full bg-white/10 text-white placeholder-gray-400 rounded-lg p-3 border border-white/20 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancelAddItem}
                className="flex-1 px-4 py-2 bg-gray-500/80 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItemName.trim()}
                className="flex-1 px-4 py-2 bg-green-500/80 hover:bg-green-500 disabled:bg-gray-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
