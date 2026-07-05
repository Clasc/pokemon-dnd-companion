"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PokemonOverview from "@/features/pokemon/components/PokemonOverview";
import StatAdjustSheet from "@/features/pokemon/components/StatAdjustSheet";
import AddAttackModal from "@/features/pokemon/components/AddAttackModal";
import AttackQuickEditSheet from "@/features/pokemon/components/AttackQuickEditSheet";
import TrainerStrip from "@/features/trainer/components/TrainerStrip";
import TrainerSheet from "@/features/trainer/components/TrainerSheet";
import CreateTrainer from "@/features/trainer/components/CreateTrainer";
import BottomSheet from "@/components/shared/ui/BottomSheet";
import InteractiveProgress from "@/components/shared/ui/InteractiveProgress";
import { useAppStore } from "@/store";
import type { Pokemon } from "@/types/pokemon";

export default function DashboardPage() {
  const router = useRouter();
  const pokemon = useAppStore.use.pokemonTeam();
  const trainer = useAppStore.use.trainer();
  const setTrainer = useAppStore.use.setTrainer();

  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showTrainerHP, setShowTrainerHP] = useState(false);
  const [showPokedollars, setShowPokedollars] = useState(false);
  const [pokedollarsInput, setPokedollarsInput] = useState("");
  const [addAttackUuid, setAddAttackUuid] = useState<string | null>(null);
  const [addAttackIndex, setAddAttackIndex] = useState<number>(0);
  const [editAttackUuid, setEditAttackUuid] = useState<string | null>(null);
  const [editAttackIndex, setEditAttackIndex] = useState<number>(0);
  const [showTrainerSheet, setShowTrainerSheet] = useState(false);

  const editingPokemon: Pokemon | null = editingUuid
    ? pokemon[editingUuid] ?? null
    : null;

  if (!trainer) {
    return (
      <main className="min-h-screen px-4 py-6">
        <CreateTrainer onTrainerUpdate={setTrainer} />
      </main>
    );
  }

  const rawInventory = trainer.inventory || [];

  const pokemonCount = Object.keys(pokemon).length;

  const handleTrainerHPChange = (value: number) => {
    const clamped = Math.max(0, Math.min(value, trainer.maxHP));
    if (clamped !== trainer.currentHP) {
      setTrainer({ ...trainer, currentHP: clamped });
    }
  };

  const handlePokedollarsSave = () => {
    const amount = parseInt(pokedollarsInput, 10);
    if (!isNaN(amount) && amount >= 0) {
      setTrainer({ ...trainer, pokedollars: amount });
    }
    setShowPokedollars(false);
  };

  const openPokedollarsEdit = () => {
    setPokedollarsInput(String(trainer.pokedollars));
    setShowPokedollars(true);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-space-4 space-y-space-4 pb-20">
      <TrainerStrip
        trainer={{ ...trainer, inventory: rawInventory }}
        pokemonTeam={pokemon}
        onHeaderTap={() => setShowTrainerSheet(true)}
        onHPTap={() => setShowTrainerHP(true)}
        onDollarsTap={openPokedollarsEdit}
        onItemsTap={() => router.push("/trainer")}
        onAttributesTap={() => setShowTrainerSheet(true)}
      />

      {/* Roster Header */}
      <div className="flex justify-between items-center">
        <h2
          className="text-xs text-secondary uppercase tracking-wider"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          Roster
        </h2>
        <span
          className="text-[10px] text-secondary/60"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          {pokemonCount} / 6
        </span>
      </div>

      <PokemonOverview
        pokemon={pokemon}
        showAttacks
        hideTeamStats
        unstyled
        onHPTap={(_, uuid) => setEditingUuid(uuid)}
        onXPTap={(_, uuid) => setEditingUuid(uuid)}
        onAddAttack={(_, uuid, attackIndex) => {
          setAddAttackUuid(uuid);
          setAddAttackIndex(attackIndex);
        }}
        onLongPressAttack={(_, uuid, attackIndex) => {
          setEditAttackUuid(uuid);
          setEditAttackIndex(attackIndex);
        }}
      />

      {editingPokemon && editingUuid && (
        <StatAdjustSheet
          pokemon={editingPokemon}
          pokemonUuid={editingUuid}
          isOpen={editingUuid !== null}
          onClose={() => setEditingUuid(null)}
        />
      )}

      {addAttackUuid && (
        <AddAttackModal
          isOpen={addAttackUuid !== null}
          onClose={() => {
            setAddAttackUuid(null);
          }}
          pokemonUuid={addAttackUuid}
          attackIndex={addAttackIndex}
        />
      )}

      {editAttackUuid && (
        (() => {
          const editPoke = pokemon[editAttackUuid];
          const editAttack = editPoke?.attacks?.[editAttackIndex];
          return editAttack ? (
            <AttackQuickEditSheet
              attack={editAttack}
              pokemonUuid={editAttackUuid}
              attackIndex={editAttackIndex}
              isOpen={editAttackUuid !== null}
              onClose={() => setEditAttackUuid(null)}
              onReplace={() => {
                setAddAttackUuid(editAttackUuid);
                setAddAttackIndex(editAttackIndex);
              }}
            />
          ) : null;
        })()
      )}

      {/* Trainer Full Edit Sheet */}
      <TrainerSheet
        isOpen={showTrainerSheet}
        onClose={() => setShowTrainerSheet(false)}
      />

      {/* Trainer HP Quick Adjust */}
      {trainer && (
        <BottomSheet
          isOpen={showTrainerHP}
          onClose={() => setShowTrainerHP(false)}
        >
          <div className="p-space-4">
            <h2 className="text-xl font-bold text-primary mb-space-4">
              Trainer HP
            </h2>
            <InteractiveProgress
              type="hp"
              current={trainer.currentHP}
              max={trainer.maxHP}
              onChange={handleTrainerHPChange}
              label="HP"
              step={1}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-lg font-mono text-primary">
                {trainer.currentHP}/{trainer.maxHP}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newHP = trainer.currentHP - Math.floor(trainer.maxHP * 0.25);
                    handleTrainerHPChange(newHP);
                  }}
                  className="px-3 py-1.5 text-sm rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors font-mono"
                >
                  -25%
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newHP = trainer.currentHP + Math.floor(trainer.maxHP * 0.25);
                    handleTrainerHPChange(newHP);
                  }}
                  className="px-3 py-1.5 text-sm rounded bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors font-mono"
                >
                  +25%
                </button>
                <button
                  type="button"
                  onClick={() => handleTrainerHPChange(trainer.maxHP)}
                  className="px-3 py-1.5 text-sm rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors font-mono"
                >
                  Full
                </button>
              </div>
            </div>
          </div>
        </BottomSheet>
      )}

      {/* Pokédollars Inline Edit */}
      {trainer && (
        <BottomSheet
          isOpen={showPokedollars}
          onClose={() => setShowPokedollars(false)}
        >
          <div className="p-space-4">
            <h2 className="text-xl font-bold text-primary mb-space-4">
              ₽okédollars
            </h2>
            <input
              type="number"
              inputMode="numeric"
              value={pokedollarsInput}
              onChange={(e) => setPokedollarsInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePokedollarsSave();
              }}
              className="w-full bg-white/10 text-primary placeholder-secondary rounded-lg p-space-3 border border-white/20 focus:ring-2 focus:ring-interactive focus:outline-none font-mono text-lg"
              autoFocus
            />
            <div className="flex gap-3 mt-space-4">
              <button
                type="button"
                onClick={handlePokedollarsSave}
                className="flex-1 py-space-3 rounded-lg bg-interactive hover:bg-interactive-hover transition-colors text-primary font-medium"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowPokedollars(false)}
                className="flex-1 py-space-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-primary font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </BottomSheet>
      )}
    </main>
  );
}
