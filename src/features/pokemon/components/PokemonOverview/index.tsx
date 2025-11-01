"use client";

import Link from "next/link";

import { PokemonTeam } from "@/types/pokemon";

import PokemonCard from "../PokemonCard/";

interface PokemonOverviewProps {
  pokemon: PokemonTeam;

  /**

   * When true, suppresses rendering full PokemonCard components and instead

   * renders lightweight placeholders (used in tests to avoid router dependency).

   */

  disableCards?: boolean;
}

/**

 * PokemonOverview (Compacted)

 *

 * Reduced outer padding, removed redundant vertical margins,
 * and tightened empty state + stats spacing for higher information density.
 */
export default function PokemonOverview({
  pokemon,
  disableCards = false,
}: PokemonOverviewProps) {
  const pokemonLength = Object.keys(pokemon).length;

  const totalLevels = Object.values(pokemon).reduce(
    (sum, p) => sum + p.level,

    0,
  );

  const totalHP = Object.values(pokemon).reduce(
    (sum, p) => sum + p.currentHP,

    0,
  );

  const avgHealthPercent =
    pokemonLength === 0
      ? 0
      : Math.round(
          Object.values(pokemon).reduce(
            (sum, p) => sum + (p.maxHP > 0 ? (p.currentHP / p.maxHP) * 100 : 0),

            0,
          ) / pokemonLength,
        );

  return (
    <>
      <div className="glass rounded-xl p-4 md:p-5 space-y-5">
        <header className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Pokémon Overview
          </h2>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
              <span className="text-white text-sm md:text-base font-bold">
                {pokemonLength}
              </span>
            </div>

            <span className="text-gray-300 text-base md:text-lg">/ 6</span>
          </div>
        </header>

        <div className="pokemon-grid space-y-4">
          {pokemonLength === 0 ? (
            <div className="text-center py-8 md:py-10 px-4">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-5 rounded-xl bg-gradient-to-br from-gray-600/50 to-gray-700/50 flex items-center justify-center border border-white/10">
                <span className="text-4xl md:text-5xl" aria-hidden="true">
                  🔍
                </span>
              </div>

              <p className="text-gray-400 text-base md:text-lg mb-2">
                No Pokémon in your team yet
              </p>

              <p className="text-gray-500 text-sm md:text-base">
                Click the button below to add one!
              </p>
            </div>
          ) : (
            Object.entries(pokemon).map(([uuid, poke]) =>
              disableCards ? (
                <div
                  key={uuid}
                  data-testid="pokemon-card-placeholder"
                  className="rounded-lg bg-white/5 p-4 text-sm text-white/70"
                >
                  {poke.name} ({poke.type})
                </div>
              ) : (
                <PokemonCard key={uuid} pokemon={poke} uuid={uuid} />
              ),
            )
          )}
        </div>

        {pokemonLength < 6 && (
          <div>
            <Link
              href="/pokemon/new"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white border-2 border-dashed border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Pokémon
            </Link>
          </div>
        )}

        {pokemonLength > 0 && (
          <section className="pt-4 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              Team Stats
            </h3>

            <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">
              <div className="p-3 md:p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-lg md:text-2xl font-bold text-white mb-1">
                  {totalLevels}
                </div>

                <div className="text-xs md:text-sm text-gray-400">
                  Total Levels
                </div>
              </div>

              <div className="p-3 md:p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-lg md:text-2xl font-bold text-white mb-1">
                  {totalHP}
                </div>

                <div className="text-xs md:text-sm text-gray-400">Total HP</div>
              </div>
              <div className="p-3 md:p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-lg md:text-2xl font-bold text-white mb-1">
                  {avgHealthPercent}%
                </div>

                <div className="text-xs md:text-sm text-gray-400">
                  Avg Health
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
