"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import BottomSheet from "@/components/shared/ui/BottomSheet";
import { Pokemon, STATUS_COLORS } from "@/types/pokemon";
import { useAppStore } from "@/store";
import { xpRemaining } from "@/utils/xp";

interface StatAdjustSheetProps {
  pokemon: Pokemon;
  pokemonUuid: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function StatAdjustSheet({
  pokemon,
  pokemonUuid,
  isOpen,
  onClose,
}: StatAdjustSheetProps) {
  const modifyPokemonHP = useAppStore.use.modifyPokemonHP();
  const gainExperience = useAppStore.use.gainExperience();
  const [hpValue, setHpValue] = useState(pokemon.currentHP);
  const [xpInput, setXpInput] = useState("");
  const hpTrackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setHpValue(pokemon.currentHP);
      setXpInput("");
    }
  }, [isOpen, pokemon.currentHP]);

  const handleHpDrag = useCallback(
    (clientX: number) => {
      if (!hpTrackRef.current) return;
      const rect = hpTrackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newHp = Math.round(pct * pokemon.maxHP);
      setHpValue(newHp);
    },
    [pokemon.maxHP],
  );

  const commitHP = useCallback(
    (value: number) => {
      const clamped = Math.max(0, Math.min(pokemon.maxHP, value));
      const delta = clamped - pokemon.currentHP;
      if (delta !== 0) modifyPokemonHP(pokemonUuid, delta);
    },
    [modifyPokemonHP, pokemon.maxHP, pokemon.currentHP, pokemonUuid],
  );

  const handleDamage = (amount: number) => {
    const newHp = Math.max(0, hpValue - amount);
    setHpValue(newHp);
    modifyPokemonHP(pokemonUuid, -amount);
  };

  const handleHeal = (amount: number) => {
    const newHp = Math.min(pokemon.maxHP, hpValue + amount);
    setHpValue(newHp);
    modifyPokemonHP(pokemonUuid, amount);
  };

  const handleHpPointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      handleHpDrag(e.clientX);
    },
    [handleHpDrag],
  );

  const handleHpPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      handleHpDrag(e.clientX);
    },
    [handleHpDrag],
  );

  const handleHpPointerUp = useCallback(() => {
    isDragging.current = false;
    commitHP(hpValue);
  }, [commitHP, hpValue]);

  const handleExactHP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = parseInt(formData.get("hp-value") as string, 10);
    if (isNaN(value)) return;
    commitHP(value);
    setHpValue(Math.max(0, Math.min(pokemon.maxHP, value)));
    onClose();
  };

  const handleGainXP = (amount: number) => {
    gainExperience(pokemonUuid, amount);
  };

  const handleExactXP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = parseInt(xpInput, 10);
    if (isNaN(value) || value <= 0) return;
    gainExperience(pokemonUuid, value);
    setXpInput("");
    onClose();
  };

  const hpPercent = pokemon.maxHP > 0 ? (hpValue / pokemon.maxHP) * 100 : 0;
  const getHPColor = (pct: number) => {
    if (pct <= 25) return "#EF4444";
    if (pct <= 50) return "#F59E0B";
    return "#22C55E";
  };

  const isFainted =
    pokemon.primaryStatus?.condition === "fainted" || pokemon.currentHP === 0;

  const remaining = xpRemaining(
    pokemon.level,
    pokemon.xpSinceLevelUp ?? 0,
  );

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="space-y-space-4">
        <div className="flex items-center gap-space-3">
          <div className="w-12 h-12 rounded-lg bg-[#4a4a4a] flex items-center justify-center text-xl border border-white/10 overflow-hidden flex-shrink-0">
            {pokemon.spriteUrl ? (
              <img
                src={pokemon.spriteUrl}
                alt={pokemon.name}
                className="w-full h-full object-contain"
                style={{
                  filter: isFainted ? "grayscale(100%)" : undefined,
                }}
              />
            ) : (
              <span>{pokemon.type1 ? pokemon.type1[0].toUpperCase() : "?"}</span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{pokemon.name}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Lv.{pokemon.level}</span>
              {pokemon.type1 && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded text-white font-medium"
                  style={{
                    backgroundColor:
                      STATUS_COLORS[pokemon.type1 as keyof typeof STATUS_COLORS] ||
                      "#A8A878",
                  }}
                >
                  {pokemon.type1.toUpperCase()}
                </span>
              )}
              <span>🛡️{pokemon.armorClass}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-space-2">
            <span className="text-sm text-gray-400 font-medium">HP</span>
            <span className="text-sm text-gray-300 font-mono">
              {pokemon.currentHP} / {pokemon.maxHP}
            </span>
          </div>

          <div
            ref={hpTrackRef}
            role="slider"
            tabIndex={0}
            aria-label="Adjust HP"
            aria-valuemin={0}
            aria-valuemax={pokemon.maxHP}
            aria-valuenow={hpValue}
            className="relative h-8 rounded-full bg-white/10 cursor-pointer touch-none mb-space-2"
            onPointerDown={handleHpPointerDown}
            onPointerMove={handleHpPointerMove}
            onPointerUp={handleHpPointerUp}
            onPointerCancel={handleHpPointerUp}
            onClick={(e) => {
              if (!isDragging.current) {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                const val = Math.round(pct * pokemon.maxHP);
                commitHP(val);
                setHpValue(val);
              }
            }}
            onKeyDown={(e) => {
              let newVal = hpValue;
              if (e.key === "ArrowRight" || e.key === "ArrowUp") newVal = Math.min(pokemon.maxHP, hpValue + 1);
              else if (e.key === "ArrowLeft" || e.key === "ArrowDown") newVal = Math.max(0, hpValue - 1);
              else if (e.key === "Home") newVal = 0;
              else if (e.key === "End") newVal = pokemon.maxHP;
              else return;
              e.preventDefault();
              setHpValue(newVal);
              commitHP(newVal);
            }}
          >
            <div
              className="absolute inset-y-1 left-1 rounded-full transition-all duration-75"
              style={{
                width: `calc(${hpPercent}% - 4px)`,
                backgroundColor: getHPColor(hpPercent),
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md border-2 border-gray-300 pointer-events-none transition-left duration-75"
              style={{
                left: `calc(${hpPercent}% - 12px)`,
              }}
            />
          </div>

          <div className="flex gap-space-2">
            <button
              type="button"
              onClick={() => handleDamage(10)}
              className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 font-bold hover:bg-red-500/30 active:bg-red-500/40 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              -10
            </button>
            <button
              type="button"
              onClick={() => handleDamage(5)}
              className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 font-bold hover:bg-red-500/30 active:bg-red-500/40 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              -5
            </button>
            <button
              type="button"
              onClick={() => handleDamage(1)}
              className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 font-bold hover:bg-red-500/30 active:bg-red-500/40 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              -1
            </button>
            <button
              type="button"
              onClick={() => handleHeal(1)}
              className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 font-bold hover:bg-green-500/30 active:bg-green-500/40 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              +1
            </button>
            <button
              type="button"
              onClick={() => handleHeal(5)}
              className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 font-bold hover:bg-green-500/30 active:bg-green-500/40 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              +5
            </button>
            <button
              type="button"
              onClick={() => handleHeal(10)}
              className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 font-bold hover:bg-green-500/30 active:bg-green-500/40 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              +10
            </button>
          </div>

          <form onSubmit={handleExactHP} className="flex items-center gap-space-2 mt-space-2">
            <label htmlFor="hp-exact-input" className="sr-only">Set exact HP</label>
            <input
              id="hp-exact-input"
              name="hp-value"
              type="number"
              min={0}
              max={pokemon.maxHP}
              placeholder={`0 - ${pokemon.maxHP}`}
              className="flex-1 px-3 py-1.5 rounded-lg bg-[#222222] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-interactive text-sm"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-interactive text-white font-semibold text-sm hover:bg-interactive-hover transition-colors focus:outline-none focus:ring-2 focus:ring-interactive"
            >
              Set HP
            </button>
          </form>
        </div>

        {isFainted && (
          <div className="text-center py-2 px-3 rounded-lg bg-red-500/20 border border-red-500/30">
            <span className="text-red-400 font-semibold text-sm">FAINTED</span>
          </div>
        )}

        <div className="border-t border-white/10 pt-space-4">
          <div className="flex items-center justify-between mb-space-2">
            <span className="text-sm text-gray-400 font-medium">XP</span>
            <span className="text-sm text-gray-300 font-mono">
              {pokemon.experience} (+{remaining} to next)
            </span>
          </div>

          <div className="flex gap-space-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleGainXP(10)}
              className="flex-1 min-w-[60px] py-2.5 rounded-lg bg-blue-500/20 text-blue-400 font-bold hover:bg-blue-500/30 active:bg-blue-500/40 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => handleGainXP(50)}
              className="flex-1 min-w-[60px] py-2.5 rounded-lg bg-blue-500/20 text-blue-400 font-bold hover:bg-blue-500/30 active:bg-blue-500/40 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              +50
            </button>
            <button
              type="button"
              onClick={() => handleGainXP(100)}
              className="flex-1 min-w-[60px] py-2.5 rounded-lg bg-blue-500/20 text-blue-400 font-bold hover:bg-blue-500/30 active:bg-blue-500/40 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              +100
            </button>
            <button
              type="button"
              onClick={() => handleGainXP(200)}
              className="flex-1 min-w-[60px] py-2.5 rounded-lg bg-blue-500/20 text-blue-400 font-bold hover:bg-blue-500/30 active:bg-blue-500/40 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              +200
            </button>
          </div>

          <form onSubmit={handleExactXP} className="flex items-center gap-space-2 mt-space-2">
            <label htmlFor="xp-exact-input" className="sr-only">Gain exact XP</label>
            <input
              id="xp-exact-input"
              type="number"
              min={1}
              value={xpInput}
              onChange={(e) => setXpInput(e.target.value)}
              placeholder="Exact XP"
              className="flex-1 px-3 py-1.5 rounded-lg bg-[#222222] text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-interactive text-sm"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-interactive text-white font-semibold text-sm hover:bg-interactive-hover transition-colors focus:outline-none focus:ring-2 focus:ring-interactive"
            >
              Add XP
            </button>
          </form>
        </div>
      </div>
    </BottomSheet>
  );
}
