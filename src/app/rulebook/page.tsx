"use client";

import { useState } from "react";
import type { PokemonType, Effectiveness } from "@/types/pokemon";
import { TYPE_CHART, TYPE_COLORS } from "@/types/pokemon";

/* ---------- Constants ---------- */

type TabKey = "type-chart" | "ability-scores" | "level-progression" | "status-effects";

const TABS: { key: TabKey; label: string }[] = [
  { key: "type-chart", label: "Type Chart" },
  { key: "ability-scores", label: "Ability Scores" },
  { key: "level-progression", label: "Level Progression" },
  { key: "status-effects", label: "Status Effects" },
];

const ALL_TYPES: PokemonType[] = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

const ABILITY_DESCRIPTIONS: Record<string, string> = {
  strength: "Physical power & melee attack",
  dexterity: "Agility, reflexes & ranged attack",
  constitution: "Endurance & HP scaling",
  intelligence: "Reasoning & special attack",
  wisdom: "Perception & special defense",
  charisma: "Force of personality & intimidation",
};

const STATUS_MAP: { condition: string; dnd: string; description: string }[] = [
  { condition: "Burned", dnd: "Poisoned (damage)", description: "Takes damage each turn; attack damage halved" },
  { condition: "Frozen", dnd: "Paralyzed", description: "Cannot act; may thaw on subsequent turns" },
  { condition: "Paralyzed", dnd: "Slowed", description: "Speed halved; chance of losing turn" },
  { condition: "Poisoned", dnd: "Poisoned", description: "Takes damage each turn" },
  { condition: "Badly Poisoned", dnd: "Poisoned (escalating)", description: "Damage increases each turn" },
  { condition: "Asleep", dnd: "Unconscious", description: "Cannot act for 1-3 turns; wake on damage" },
  { condition: "Confused", dnd: "Confused", description: "Chance to hit self when attacking" },
  { condition: "Flinching", dnd: "Stunned", description: "Loses action for one turn" },
  { condition: "Fainted", dnd: "Unconscious (0 HP)", description: "Unable to battle; must be revived" },
];

/* ---------- Helpers ---------- */

function calcModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function formatEffectiveness(e: Effectiveness): string {
  if (e === 2) return "2×";
  if (e === 0.5) return "½×";
  if (e === 0) return "0×";
  return "1×";
}

function typeColor(t: PokemonType): string {
  return TYPE_COLORS[t] ?? "#888";
}

/* ---------- Sub-components ---------- */

function TypeBadge({ type, size = "sm" }: { type: PokemonType; size?: "sm" | "md" }) {
  const color = typeColor(type);
  const cls = size === "md"
    ? "px-3 py-1.5 text-sm rounded-lg"
    : "px-2 py-1 text-xs rounded-md";
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold ${cls}`}
      style={{ background: color + "30", color, border: `1px solid ${color}60` }}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

function EffCell({ e }: { e: Effectiveness }) {
  const colors: Record<Effectiveness, string> = {
    2: "bg-green-600/30 text-green-400 border-green-600/50",
    1: "bg-white/5 text-gray-300 border-white/10",
    0.5: "bg-orange-600/30 text-orange-400 border-orange-600/50",
    0: "bg-red-900/30 text-red-400 border-red-900/50",
  };
  return (
    <span
      className={`inline-flex items-center justify-center w-10 h-8 rounded border text-xs font-bold ${colors[e]}`}
    >
      {formatEffectiveness(e)}
    </span>
  );
}

/* ==============================================
   Section: Type Chart
   ============================================== */

function TypeChartSection() {
  const [attacker, setAttacker] = useState<PokemonType | null>(null);

  return (
    <div>
      <p className="text-secondary mb-4 text-sm">
        Select an attacking type to see its effectiveness against each defending type.
      </p>

      {/* Attacker picker */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_TYPES.map((t) => {
          const active = attacker === t;
          const color = typeColor(t);
          return (
            <button
              key={t}
              onClick={() => setAttacker(active ? null : t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border
                ${active ? "ring-2 ring-white/40 scale-105" : "hover:scale-105"}`}
              style={{
                background: active ? color + "40" : "#222",
                color: active ? "#fff" : color,
                borderColor: active ? color : color + "50",
              }}
              aria-pressed={active}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {attacker ? (
        <div className="bg-surface rounded-xl border border-white/10 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">
            <span className="text-secondary">Attacking with</span>{" "}
            <TypeBadge type={attacker} size="md" />
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {ALL_TYPES.map((defender) => {
              const e = TYPE_CHART[attacker][defender];
              return (
                <div
                  key={defender}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5"
                  style={{ background: typeColor(defender) + "12" }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: typeColor(defender) }}
                  />
                  <span className="text-xs text-white font-medium flex-1">
                    {defender.charAt(0).toUpperCase() + defender.slice(1)}
                  </span>
                  <EffCell e={e} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-secondary text-sm">
          Click a type above to see its matchups
        </div>
      )}
    </div>
  );
}

/* ==============================================
   Section: Ability Scores
   ============================================== */

function AbilityScoresSection() {
  const [score, setScore] = useState(10);

  return (
    <div className="space-y-6">
      <p className="text-secondary text-sm">
        Pokémon use the six standard D&amp;D ability scores. The modifier bonus is calculated as
        <code className="mx-1 px-1.5 py-0.5 rounded bg-white/10 text-white text-xs font-mono">
          (score − 10) ÷ 2
        </code>
        rounded down.
      </p>

      {/* Modifier calculator */}
      <div className="bg-surface rounded-xl border border-white/10 p-4 flex items-center gap-4 flex-wrap">
        <label className="text-sm text-white font-medium">Ability Score:</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScore(Math.max(1, score - 1))}
            className="w-8 h-8 rounded bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
            aria-label="Decrease score"
          >
            −
          </button>
          <span className="w-10 text-center text-lg font-bold text-white font-mono tabular-nums">{score}</span>
          <button
            onClick={() => setScore(Math.min(30, score + 1))}
            className="w-8 h-8 rounded bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
            aria-label="Increase score"
          >
            +
          </button>
        </div>
        <span className="text-sm text-secondary">Modifier:</span>
        <span className="text-lg font-bold font-mono tabular-nums text-interactive">
          {calcModifier(score) >= 0 ? "+" : ""}{calcModifier(score)}
        </span>
      </div>

      {/* Ability table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-secondary text-xs uppercase tracking-wider">
              <th className="text-left py-2 pr-4">Ability</th>
              <th className="text-left py-2 pr-4">Abbrev.</th>
              <th className="text-left py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(ABILITY_DESCRIPTIONS).map(([key, desc]) => (
              <tr key={key} className="border-b border-white/5">
                <td className="py-2 pr-4 font-semibold text-white capitalize">{key}</td>
                <td className="py-2 pr-4 text-secondary font-mono">{key.slice(0, 3).toUpperCase()}</td>
                <td className="py-2 text-secondary">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modifier table */}
      <details className="bg-surface rounded-xl border border-white/10">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-white hover:text-interactive transition-colors select-none">
          Full Modifier Table (1–30)
        </summary>
        <div className="px-4 pb-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-secondary text-xs uppercase tracking-wider">
                <th className="text-left py-1 pr-3">Score</th>
                <th className="text-left py-1 pr-3">Modifier</th>
                <th className="text-left py-1 pr-3">Score</th>
                <th className="text-left py-1 pr-3">Modifier</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 15 }, (_, i) => {
                const left = i + 1;
                const right = i + 16;
                return (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-1 pr-3 font-mono text-white">{left}</td>
                    <td className="py-1 pr-3 font-mono text-interactive font-bold">
                      {calcModifier(left) >= 0 ? "+" : ""}{calcModifier(left)}
                    </td>
                    <td className="py-1 pr-3 font-mono text-white">{right}</td>
                    <td className="py-1 pr-3 font-mono text-interactive font-bold">
                      {calcModifier(right) >= 0 ? "+" : ""}{calcModifier(right)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

/* ==============================================
   Section: Level Progression
   ============================================== */

function LevelProgressionSection() {
  const profBonus = (level: number) => {
    if (level <= 4) return 2;
    if (level <= 8) return 3;
    if (level <= 12) return 4;
    if (level <= 16) return 5;
    return 6;
  };

  const rows = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <p className="text-secondary text-sm">
        A Pokémon&apos;s level determines its proficiency bonus, following the standard D&amp;D 5e progression.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-secondary text-xs uppercase tracking-wider">
              <th className="text-left py-2 pr-4">Level</th>
              <th className="text-left py-2">Proficiency Bonus</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((lv) => (
              <tr key={lv} className="border-b border-white/5">
                <td className="py-1.5 pr-4 font-mono text-white">Lv. {lv}</td>
                <td className="py-1.5 font-mono text-interactive font-bold">
                  +{profBonus(lv)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==============================================
   Section: Status Effects
   ============================================== */

function StatusEffectsSection() {
  return (
    <div className="space-y-4">
      <p className="text-secondary text-sm">
        Pokémon status conditions map to D&amp;D 5e conditions as follows:
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-secondary text-xs uppercase tracking-wider">
              <th className="text-left py-2 pr-4">Pokémon Condition</th>
              <th className="text-left py-2 pr-4">D&amp;D Equivalent</th>
              <th className="text-left py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {STATUS_MAP.map((s) => (
              <tr key={s.condition} className="border-b border-white/5">
                <td className="py-2 pr-4 font-semibold text-white">{s.condition}</td>
                <td className="py-2 pr-4 text-secondary">{s.dnd}</td>
                <td className="py-2 text-secondary text-xs">{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==============================================
   Main Page
   ============================================== */

export default function RulebookPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("type-chart");

  return (
    <main className="min-h-screen px-4 py-6 max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-responsive-xl font-bold text-white font-['Poppins'] mb-1">
          Rulebook
        </h1>
        <p className="text-secondary text-sm">
          Reference guide for Pokémon D&amp;D hybrid rules
        </p>
      </header>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-white/10 pb-0.5 overflow-x-auto" role="tablist">
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap
                ${active
                  ? "bg-interactive text-white"
                  : "text-secondary hover:text-white hover:bg-white/5"
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div role="tabpanel" className="animate-fade-in">
        {activeTab === "type-chart" && <TypeChartSection />}
        {activeTab === "ability-scores" && <AbilityScoresSection />}
        {activeTab === "level-progression" && <LevelProgressionSection />}
        {activeTab === "status-effects" && <StatusEffectsSection />}
      </div>
    </main>
  );
}
