"use client";

import { useState } from "react";
import { Attack } from "../types/pokemon";
import { useAppStore } from "../store";
import AddAttackModal from "./AddAttackModal";

interface AttackCardProps {
  attack?: Attack;
  pokemonUuid: string;
  attackIndex: number;
}

export default function AttackCard({
  attack,
  pokemonUuid,
  attackIndex,
}: AttackCardProps) {
  const [showAddAttackModal, setShowAddAttackModal] = useState(false);

  const decreasePP = useAppStore.use.decreaseAttackPP();

  const handlePerformAttack = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (attack && attack.currentPp > 0) {
      decreasePP(pokemonUuid, attackIndex);
    }
  };

  const handleAddAttackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAddAttackModal(true);
  };

  if (!attack) {
    return (
      <>
        <div
          className="bg-white/5 rounded-lg flex items-center justify-center p-4 h-full border-2 border-dashed border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
          onClick={handleAddAttackClick}
          role="button"
          tabIndex={0}
          aria-label="Add new attack"
        >
          <span className="text-white/50 font-semibold">+ Add Attack</span>
        </div>
        <AddAttackModal
          isOpen={showAddAttackModal}
          onClose={() => setShowAddAttackModal(false)}
          pokemonUuid={pokemonUuid}
          attackIndex={attackIndex}
        />
      </>
    );
  }

  return (
    <div className="bg-white/10 rounded-lg p-3 text-white text-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-base">{attack.name}</h4>
          <div className="text-right shrink-0 ml-2">
            <p className="font-semibold">
              PP: {attack.currentPp} / {attack.maxPp}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {attack.actionType}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div>
            <p className="text-gray-400">Damage</p>
            <p className="font-mono font-bold">{attack.damageDice}</p>
          </div>
          <div>
            <p className="text-gray-400">Bonus</p>
            <p className="font-mono font-bold">+{attack.moveBonus}</p>
          </div>
          {attack.specialEffect && (
            <div className="col-span-2">
              <p className="text-gray-400">Effect on d20</p>
              <p>{attack.specialEffect}</p>
            </div>
          )}
        </div>
        {attack.description && (
          <p className="text-xs text-gray-300 mb-3 italic">
            {`"${attack.description}"`}
          </p>
        )}
      </div>
      <button
        onClick={handlePerformAttack}
        disabled={attack.currentPp === 0}
        className="w-full mt-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600/50 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-1.5 px-2 rounded-md transition-colors text-xs"
      >
        Perform Attack
      </button>
    </div>
  );
}
