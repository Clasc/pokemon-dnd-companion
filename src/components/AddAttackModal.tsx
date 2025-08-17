"use client";

import { useState, useEffect } from "react";
import { Attack } from "../types/pokemon";
import { useAppStore } from "../store";

interface AddAttackModalProps {
  isOpen: boolean;
  onClose: () => void;
  pokemonUuid: string;
  attackIndex: number;
}

const initialState: Omit<Attack, "currentPp"> = {
  name: "",
  maxPp: 10,
  actionType: "action",
  moveBonus: 0,
  damageDice: "d4",
  specialEffect: "",
  description: "",
};

export default function AddAttackModal({
  isOpen,
  onClose,
  pokemonUuid,
  attackIndex,
}: AddAttackModalProps) {
  const addAttack = useAppStore.use.addAttack();
  const [attack, setAttack] = useState<Omit<Attack, "currentPp">>(initialState);

  useEffect(() => {
    if (isOpen) {
      setAttack(initialState);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const isNumber = type === "number";
    setAttack((prev) => ({
      ...prev,
      [name]: isNumber ? (value === "" ? "" : parseInt(value, 10)) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAttack(pokemonUuid, attackIndex, attack as Attack);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="glass rounded-lg p-6 w-full max-w-md text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Add New Attack</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Attack Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={attack.name}
              onChange={handleChange}
              className="w-full bg-white/10 rounded-md border-transparent focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="maxPp"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Max PP
              </label>
              <input
                type="number"
                name="maxPp"
                id="maxPp"
                value={attack.maxPp}
                onChange={handleChange}
                className="w-full bg-white/10 rounded-md border-transparent focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="moveBonus"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Move Bonus
              </label>
              <input
                type="number"
                name="moveBonus"
                id="moveBonus"
                value={attack.moveBonus}
                onChange={handleChange}
                className="w-full bg-white/10 rounded-md border-transparent focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="actionType"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Action Type
              </label>
              <select
                name="actionType"
                id="actionType"
                value={attack.actionType}
                onChange={handleChange}
                className="w-full bg-white/10 rounded-md border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="action">Action</option>
                <option value="bonus action">Bonus Action</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="damageDice"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Damage Dice
              </label>
              <select
                name="damageDice"
                id="damageDice"
                value={attack.damageDice}
                onChange={handleChange}
                className="w-full bg-white/10 rounded-md border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="d4">d4</option>
                <option value="d6">d6</option>
                <option value="d10">d10</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="specialEffect"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Special Effect (on d20 roll)
            </label>
            <input
              type="text"
              name="specialEffect"
              id="specialEffect"
              value={attack.specialEffect}
              onChange={handleChange}
              className="w-full bg-white/10 rounded-md border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Flinch on 19+"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={attack.description || ""}
              onChange={handleChange}
              rows={2}
              className="w-full bg-white/10 rounded-md border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., A powerful electric shock."
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-md bg-white/10 hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Add Attack
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
