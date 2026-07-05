"use client";

import { useState, useEffect } from "react";
import BottomSheet from "@/components/shared/ui/BottomSheet";
import EditButtons from "@/components/shared/EditButtons";
import InteractiveProgress from "@/components/shared/ui/InteractiveProgress";
import { useAppStore } from "@/store";
import { Trainer } from "@/types/trainer";
import { ATTRIBUTE_NAMES, getAttributeDisplayName } from "@/utils/attributes";

interface TrainerSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrainerSheet({ isOpen, onClose }: TrainerSheetProps) {
  const trainer = useAppStore.use.trainer();
  const setTrainer = useAppStore.use.setTrainer();
  const [editedTrainer, setEditedTrainer] = useState<Trainer>(trainer!);

  useEffect(() => {
    if (trainer) {
      setEditedTrainer({ ...trainer });
    }
  }, [trainer]);

  if (!trainer) {
    return null;
  }

  const handleAttributeChange = (
    attribute: keyof Trainer["attributes"],
    value: number,
  ) => {
    setEditedTrainer({
      ...editedTrainer,
      attributes: {
        ...editedTrainer.attributes,
        [attribute]: Math.max(1, Math.min(20, value)),
      },
    });
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
    onClose();
  };

  const handleCancel = () => {
    setEditedTrainer(trainer);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleCancel}>
      <div>
        <div className="flex items-center justify-between mb-space-6">
          <h2 className="text-2xl font-bold text-white">Edit Trainer</h2>
        </div>

        <div className="mb-space-6 space-y-4">
          <input
            type="text"
            value={editedTrainer.name}
            onChange={(e) =>
              setEditedTrainer({ ...editedTrainer, name: e.target.value })
            }
            placeholder="Trainer Name"
            className="w-full bg-surface text-white placeholder-gray-400 rounded-lg p-space-3 border border-white/20 focus:ring-2 focus:ring-interactive focus:outline-none"
          />
          <div className="flex gap-space-4">
            <input
              type="text"
              value={editedTrainer.class}
              onChange={(e) =>
                setEditedTrainer({ ...editedTrainer, class: e.target.value })
              }
              placeholder="Class"
              className="w-full bg-surface text-white placeholder-gray-400 rounded-lg p-space-3 border border-white/20 focus:ring-2 focus:ring-interactive focus:outline-none"
            />
            <input
              type="number"
              inputMode="numeric"
              value={editedTrainer.level}
              onChange={(e) =>
                setEditedTrainer({
                  ...editedTrainer,
                  level: parseInt(e.target.value) || 1,
                })
              }
              placeholder="Level"
              className="w-24 bg-surface text-white placeholder-gray-400 rounded-lg p-space-3 border border-white/20 focus:ring-2 focus:ring-interactive focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-space-6">
          <h3 className="text-lg font-semibold text-white mb-space-4">
            Attributes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-4">
            {ATTRIBUTE_NAMES.map((attr) => (
              <div
                key={attr}
                className="flex items-center justify-between p-space-3 bg-white/5 rounded-lg border border-white/10"
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

        <div className="p-space-4 bg-white/5 rounded-lg border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-space-4">
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
    </BottomSheet>
  );
}
