"use client";

import { Pokemon, TYPE_COLORS, STATUS_COLORS } from "@/types/pokemon";
import { getPokemonIcon } from "@/utils/IconMapper";
import { ATTRIBUTE_NAMES, getAttributeShortName } from "@/utils/attributes";
import { useAppStore } from "@/store";

interface PokemonCompactCardProps {
  pokemon: Pokemon;
  uuid: string;
  onClick: () => void;
  onHPTap?: () => void;
  onXPTap?: () => void;
  onAddAttack?: (attackIndex: number) => void;
  onLongPressAttack?: (attackIndex: number) => void;
  showAttacks?: boolean;
  readOnly?: boolean;
}

const MAX_ATTACK_SLOTS = 4;

function getHPColor(currentHP: number, maxHP: number): string {
  const pct = maxHP > 0 ? currentHP / maxHP : 0;
  if (currentHP === 0) return "#71717a";
  if (pct < 0.25) return "#ef4444";
  if (pct < 0.5) return "#eab308";
  return "#22c55e";
}

function getHPBarColor(currentHP: number, maxHP: number): string {
  const pct = maxHP > 0 ? currentHP / maxHP : 0;
  if (currentHP === 0) return "#3f3f46";
  if (pct < 0.25) return "#ef4444";
  if (pct < 0.5) return "#eab308";
  return "#22c55e";
}

export default function PokemonCompactCard({
  pokemon,
  uuid,
  onClick,
  onHPTap,
  onXPTap,
  onAddAttack,
  onLongPressAttack,
  showAttacks = false,
  readOnly = false,
}: PokemonCompactCardProps) {
  const decreaseAttackPP = useAppStore.use.decreaseAttackPP();

  const typeColor = (type: string) =>
    TYPE_COLORS[type as keyof typeof TYPE_COLORS] || "#A8A878";

  const xpPct =
    pokemon.experienceToNext > 0
      ? Math.min(1, (pokemon.xpSinceLevelUp ?? 0) / pokemon.experienceToNext)
      : 0;

  const hpPct = pokemon.maxHP > 0 ? pokemon.currentHP / pokemon.maxHP : 0;
  const hpColor = getHPColor(pokemon.currentHP, pokemon.maxHP);
  const hpBarColor = getHPBarColor(pokemon.currentHP, pokemon.maxHP);
  const isFainted = pokemon.primaryStatus?.condition === "fainted";

  const primaryCondition = pokemon.primaryStatus?.condition ?? "none";
  const hasPrimaryStatus = primaryCondition !== "none";
  const confusedActive = pokemon.confusion?.condition === "confused";

  const statusBadgeColor = hasPrimaryStatus
    ? STATUS_COLORS[primaryCondition as keyof typeof STATUS_COLORS] || "#888"
    : undefined;

  const handleAttackTap = (e: React.MouseEvent, attackIndex: number) => {
    e.stopPropagation();
    const attack = pokemon.attacks?.[attackIndex];
    if (attack && attack.currentPp > 0) {
      decreaseAttackPP(uuid, attackIndex);
    }
  };

  const handleHPClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onHPTap?.();
  };

  const handleXPClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onXPTap?.();
  };

  const handleHeaderClick = () => {
    if (!readOnly) onClick();
  };

  return (
    <div
      className="bg-surface border border-white/10 rounded-lg p-space-3"
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      {/* Header Row: sprite + name + level/XP + chevron */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleHeaderClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleHeaderClick();
          }
        }}
        className="flex items-center justify-between mb-2 cursor-pointer"
      >
        <div className="flex items-center gap-sm">
          <div
            className="w-10 h-10 bg-surface-hover rounded flex items-center justify-center text-lg border border-white/10 overflow-hidden shrink-0"
            style={{
              filter: isFainted ? "grayscale(100%)" : undefined,
              opacity: isFainted ? 0.6 : 1,
            }}
          >
            {pokemon.spriteUrl ? (
              <img
                src={pokemon.spriteUrl}
                alt={pokemon.name}
                className="w-full h-full object-contain"
              />
            ) : pokemon.type1 ? (
              getPokemonIcon(pokemon.type1, pokemon.type2)
            ) : (
              "❓"
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-sm font-bold text-primary leading-tight"
                style={{
                  textDecoration: isFainted ? "line-through" : undefined,
                  color: isFainted ? "#a0a0a0" : undefined,
                }}
              >
                {pokemon.name}
              </span>
              <div
                role="button"
                tabIndex={0}
                onClick={handleXPClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleXPClick(e as unknown as React.MouseEvent);
                  }
                }}
                className="flex flex-col cursor-pointer"
                title="Tap to adjust XP"
              >
                <span className="text-[10px] text-secondary uppercase leading-none">
                  Lv {pokemon.level}
                </span>
                <div className="w-12 h-0.5 bg-white/10 overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-[var(--color-accent)]"
                    style={{ width: `${xpPct * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {pokemon.type1 && (
                <span
                  className="text-[10px]"
                  style={{ color: typeColor(pokemon.type1) }}
                >
                  {pokemon.type1.charAt(0).toUpperCase() +
                    pokemon.type1.slice(1)}
                </span>
              )}
              {pokemon.type2 && (
                <>
                  <span className="text-[10px] text-secondary">/</span>
                  <span
                    className="text-[10px]"
                    style={{ color: typeColor(pokemon.type2) }}
                  >
                    {pokemon.type2.charAt(0).toUpperCase() +
                      pokemon.type2.slice(1)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <svg
          className="w-4 h-4 text-secondary shrink-0"
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

      {/* Status Row: always visible */}
      <div className="flex items-center gap-2 mb-2">
        {hasPrimaryStatus ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded bg-white/5 border border-white/10 uppercase">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: statusBadgeColor }}
            />
            {primaryCondition === "badly-poisoned"
              ? "Badly Psn"
              : primaryCondition.charAt(0).toUpperCase() +
                primaryCondition.slice(1)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded bg-white/5 text-secondary border border-white/10 uppercase cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            Status
          </span>
        )}
        {confusedActive && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] rounded bg-white/5 border border-white/10 uppercase">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor:
                  STATUS_COLORS.confused as keyof typeof STATUS_COLORS,
              }}
            />
            Conf
          </span>
        )}
      </div>

      {/* HP Bar */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleHPClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleHPClick(e as unknown as React.MouseEvent);
          }
        }}
        className="flex items-center gap-2 mb-2 cursor-pointer"
      >
        <span
          className="text-[10px] w-6"
          style={{
            color: isFainted ? "#71717a" : hpColor,
            fontWeight: hpPct < 0.25 ? 700 : 400,
          }}
        >
          HP
        </span>
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${hpPct * 100}%`,
              backgroundColor: hpBarColor,
            }}
          />
        </div>
        <span
          className="text-[10px] w-14 text-right font-mono"
          style={{
            color: hpPct < 0.25 ? hpColor : "#d4d4d8",
            fontWeight: hpPct < 0.25 ? 700 : 400,
          }}
        >
          {pokemon.currentHP}/{pokemon.maxHP}
        </span>
      </div>

      {/* Attributes Row */}
      <div className="flex items-center justify-between mb-2 text-[10px] text-secondary">
        <span>
          🛡️ <span className="text-primary font-bold">{pokemon.armorClass}</span>
        </span>
        <div className="flex gap-2">
          {ATTRIBUTE_NAMES.map((attr) => (
            <span key={attr}>
              {getAttributeShortName(attr)}{" "}
              <span className="text-primary font-bold">
                {pokemon.attributes[attr]}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Attacks Grid */}
      {showAttacks && (
        <div className="grid grid-cols-2 gap-1.5">
          {Array.from({ length: MAX_ATTACK_SLOTS }, (_, i) => {
            const attack = pokemon.attacks?.[i];
            if (!attack) {
              return (
                <button
                  key={i}
                  type="button"
                  disabled={isFainted}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isFainted) return;
                    onAddAttack?.(i);
                  }}
                  className={`bg-white/5 border border-white/10 border-dashed rounded px-2 py-1.5 text-left transition-colors ${
                    isFainted
                      ? "text-secondary/40 cursor-not-allowed"
                      : "text-secondary hover:bg-interactive/10 hover:border-interactive/30 cursor-pointer"
                  }`}
                >
                  <div className="text-[11px] font-medium">+ Add</div>
                </button>
              );
            }

            const isDisabled = isFainted || attack.currentPp === 0;

            return (
              <button
                key={i}
                type="button"
                disabled={isDisabled}
                onClick={(e) => handleAttackTap(e, i)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onLongPressAttack?.(i);
                }}
                className={`rounded px-2 py-1.5 text-left transition-colors border ${
                  isDisabled
                    ? "bg-white/5 border-white/5 opacity-40 cursor-not-allowed"
                    : "bg-white/5 hover:bg-white/10 border-white/10"
                }`}
              >
                <div
                  className="text-[11px] font-medium truncate"
                  style={{
                    color: isDisabled ? "#71717a" : "#f0f0f0",
                  }}
                >
                  {attack.name}
                </div>
                <div
                  className="text-[9px]"
                  style={{
                    color: isDisabled ? "#52525b" : "#a0a0a0",
                  }}
                >
                  PP {attack.currentPp}/{attack.maxPp}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
