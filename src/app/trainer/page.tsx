"use client";

import { useAppStore } from "@/store";
import TrainerOverview from "@/features/trainer/components/TrainerOverview";
import CreateTrainer from "@/features/trainer/components/CreateTrainer";

/**
 * /trainer
 *
 * Dedicated Trainer management page.
 * - If no trainer exists yet, prompts the user to create one.
 * - Otherwise displays trainer details.
 */
export default function TrainerPage() {
  const trainer = useAppStore.use.trainer();
  const setTrainer = useAppStore.use.setTrainer();

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 md:py-10 overflow-x-hidden">
      <header className="flex items-center justify-between pb-4 border-b border-white/10">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Trainer</h1>
      </header>

      {!trainer ? (
        <CreateTrainer onTrainerUpdate={setTrainer} />
      ) : (
        <section className="mt-6">
          <TrainerOverview unstyled />
        </section>
      )}
    </main>
  );
}
