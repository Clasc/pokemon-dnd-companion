"use client";

import { Trainer } from "@/types/trainer";
import { PokemonTeam, STATUS_COLORS } from "@/types/pokemon";
import { ATTRIBUTE_NAMES, getAttributeShortName } from "@/utils/attributes";

interface TrainerStripProps {
  trainer: Trainer;
  pokemonTeam: PokemonTeam;
  onHeaderTap?: () => void;
  onHPTap?: () => void;
  onDollarsTap?: () => void;
  onItemsTap?: () => void;
  onAttributesTap?: () => void;
}

export default function TrainerStrip({
  trainer,
  pokemonTeam,
  onHeaderTap,
  onHPTap,
  onDollarsTap,
  onItemsTap,
  onAttributesTap,
}: TrainerStripProps) {
  const totalItems = (trainer.inventory || []).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const slotCount = 6;
  const teamSlots = Array.from({ length: slotCount }, (_, i) => {
    const entries = Object.entries(pokemonTeam);
    if (i < entries.length) {
      const [, poke] = entries[i];
      const condition = poke.primaryStatus?.condition;
      if (condition && condition !== "none") {
        return STATUS_COLORS[condition];
      }
      return "#22c55e";
    }
    return undefined;
  });

  return (
    <div className="bg-surface border border-white/10 rounded-lg p-space-3">
      {/* Row 1: Identity + Team Dots */}
      <div
        role="button"
        tabIndex={0}
        onClick={onHeaderTap}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onHeaderTap?.();
          }
        }}
        className="flex items-center justify-between mb-2 cursor-pointer"
      >
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 bg-surface-hover rounded flex items-center justify-center text-lg border border-white/10 shrink-0">
            🎒
          </div>
          <div>
            <div className="text-sm font-bold text-primary leading-tight">
              {trainer.name || "Unnamed Trainer"}
            </div>
            <div
              className="text-[10px] text-secondary"
              style={{ fontFamily: "'Courier New', monospace" }}
            >
              {trainer.class || "Adventurer"} • Lv {trainer.level}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {teamSlots.map((color, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color || "#3f3f46" }}
                title={
                  color
                    ? Object.values(pokemonTeam)[i]?.name || `Slot ${i + 1}`
                    : "Empty"
                }
              />
            ))}
          </div>
          <svg
            className="w-4 h-4 text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Row 2: HP + Pokédollars + Items */}
      <div className="grid grid-cols-3 gap-sm">
        <div
          role="button"
          tabIndex={0}
          onClick={onHPTap}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onHPTap?.();
            }
          }}
          className="bg-white/5 rounded p-2 text-center cursor-pointer"
        >
          <div
            className="text-[10px] text-secondary uppercase"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            HP
          </div>
          <div
            className="text-sm font-bold text-green-400"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            {trainer.currentHP}/{trainer.maxHP}
          </div>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={onDollarsTap}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onDollarsTap?.();
            }
          }}
          className="bg-white/5 rounded p-2 text-center cursor-pointer"
        >
          <div
            className="text-[10px] text-secondary uppercase"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            ₽okédollars
          </div>
          <div
            className="text-sm font-bold text-[var(--color-accent)]"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            ₽ {trainer.pokedollars.toLocaleString()}
          </div>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={onItemsTap}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onItemsTap?.();
            }
          }}
          className="bg-white/5 rounded p-2 text-center cursor-pointer"
        >
          <div
            className="text-[10px] text-secondary uppercase"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            Items
          </div>
          <div
            className="text-sm font-bold text-primary"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            {totalItems}
          </div>
        </div>
      </div>

      {/* Row 3: Attributes */}
      <div
        role="button"
        tabIndex={0}
        onClick={onAttributesTap}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onAttributesTap?.();
          }
        }}
        className="flex justify-between mt-2 pt-2 border-t border-white/10 cursor-pointer"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        {ATTRIBUTE_NAMES.map((attr) => (
          <span key={attr} className="text-[10px] text-secondary">
            {getAttributeShortName(attr)}{" "}
            <span className="text-primary font-bold">
              {trainer.attributes[attr]}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
