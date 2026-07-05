"use client";

import BottomSheet from "@/components/shared/ui/BottomSheet";
import { Attack } from "@/types/pokemon";
import { useAppStore } from "@/store";

interface AttackQuickEditSheetProps {
  attack: Attack;
  pokemonUuid: string;
  attackIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onReplace: () => void;
}

export default function AttackQuickEditSheet({
  attack,
  pokemonUuid,
  attackIndex,
  isOpen,
  onClose,
  onReplace,
}: AttackQuickEditSheetProps) {
  const modifyAttackPP = useAppStore.use.modifyAttackPP();

  const handlePPChange = (delta: number) => {
    modifyAttackPP(pokemonUuid, attackIndex, delta);
  };

  const handleRestore = () => {
    const needed = attack.maxPp - attack.currentPp;
    if (needed > 0) {
      modifyAttackPP(pokemonUuid, attackIndex, needed);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div
        className="p-space-4"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        <h2 className="text-lg font-bold text-primary mb-space-1 truncate">
          {attack.name}
        </h2>
        <p className="text-xs text-secondary mb-space-4">
          {attack.damageDice && (
            <span className="mr-2">{attack.damageDice}</span>
          )}
          {attack.actionType && (
            <span className="uppercase">{attack.actionType}</span>
          )}
        </p>

        {/* PP Controls */}
        <div className="bg-white/5 rounded-lg p-space-3 mb-space-4">
          <div className="flex items-center justify-between mb-space-2">
            <span className="text-sm text-secondary uppercase">PP</span>
            <span className="text-lg font-bold text-primary">
              {attack.currentPp}
              <span className="text-secondary">/{attack.maxPp}</span>
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePPChange(-1)}
              disabled={attack.currentPp <= 0}
              className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold"
            >
              -1
            </button>
            <button
              type="button"
              onClick={() => handlePPChange(1)}
              disabled={attack.currentPp >= attack.maxPp}
              className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold"
            >
              +1
            </button>
            <button
              type="button"
              onClick={handleRestore}
              disabled={attack.currentPp >= attack.maxPp}
              className="flex-1 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold"
            >
              Max
            </button>
          </div>
        </div>

        {/* Replace button */}
        <button
          type="button"
          onClick={() => {
            onReplace();
            onClose();
          }}
          className="w-full py-space-3 rounded-lg bg-interactive hover:bg-interactive-hover transition-colors text-primary font-bold text-sm uppercase tracking-wider"
        >
          Replace
        </button>
      </div>
    </BottomSheet>
  );
}
