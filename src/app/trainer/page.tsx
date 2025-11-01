"use client";

import { useAppStore } from "@/store";
import TrainerOverview from "@/features/trainer/components/TrainerOverview";
import CreateTrainer from "@/features/trainer/components/CreateTrainer";

/**
 * /trainer
 *
 * Dedicated Trainer management page.
 * - If no trainer exists yet, prompts the user to create one.
 * - Otherwise displays the TrainerOverview (which currently contains its own edit modal flow).
 *
 * Future Enhancements (not implemented here):
 * - Route-based trainer edit page (mirroring the Pokémon edit refactor)
 * - Inventory / money management as separate sub‑components
 * - Inline validation & accessibility improvements for edit flows
 */
export default function TrainerPage() {
  const trainer = useAppStore.use.trainer();
  const setTrainer = useAppStore.use.setTrainer();

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Trainer</h1>
      </header>

      {!trainer ? (
        <section
          aria-labelledby="create-trainer-section"
          className="glass rounded-2xl p-6 border border-white/10"
        >
          <h2 id="create-trainer-section" className="sr-only">
            Create Trainer
          </h2>
          <CreateTrainer onTrainerUpdate={setTrainer} />
        </section>
      ) : (
        <section
          aria-labelledby="trainer-overview-section"
          className="space-y-4"
        >
          <h2 id="trainer-overview-section" className="sr-only">
            Trainer Overview
          </h2>
          <TrainerOverview />
        </section>
      )}
    </main>
  );
}
