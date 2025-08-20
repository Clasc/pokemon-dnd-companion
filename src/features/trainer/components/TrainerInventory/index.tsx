"use client";

import { useState } from "react";
import { InventoryItem } from "@/types/trainer";

interface TrainerInventoryProps {
  inventory: InventoryItem[];
  onUseItem: (itemId: string) => void;
  onAddItem: (item: Omit<InventoryItem, "id">) => void;
  onIncreaseItem: (itemId: string) => void;
  isEditable?: boolean;
}

export default function TrainerInventory({
  inventory,
  onUseItem,
  onAddItem,
  onIncreaseItem,
  isEditable = true,
}: TrainerInventoryProps) {
  const [showInventory, setShowInventory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemDescription, setNewItemDescription] = useState("");

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const newItem = {
        name: newItemName.trim(),
        quantity: Math.max(1, newItemQuantity),
        description: newItemDescription.trim() || undefined,
      };

      onAddItem(newItem);

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

  return (
    <>
      {/* Inventory Section */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <button
          onClick={() => setShowInventory(!showInventory)}
          className="w-full flex items-center justify-between text-lg font-semibold text-white hover:text-gray-300 transition-colors"
        >
          <span>Inventory ({inventory?.length || 0})</span>
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
            {!inventory || inventory.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No items in inventory
              </p>
            ) : (
              inventory.map((item) => (
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
                  {isEditable && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onIncreaseItem(item.id)}
                        className="w-8 h-8 rounded-md bg-green-500/80 hover:bg-green-500 text-white font-bold transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                      <button
                        onClick={() => onUseItem(item.id)}
                        className="px-3 py-1 bg-blue-500/80 hover:bg-blue-500 text-white text-sm rounded-md transition-colors"
                      >
                        Use
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}

            {isEditable && (
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
            )}
          </div>
        )}
      </div>

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
