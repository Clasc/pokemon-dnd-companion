"use client";

import { Trainer } from "@/types/trainer";

interface TrainerStripProps {
  trainer: Trainer;
}

export default function TrainerStrip({ trainer }: TrainerStripProps) {
  return (
    <div className="flex items-center gap-space-4 p-space-4 bg-white/5 rounded-lg border border-white/10">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-interactive to-purple-600 flex items-center justify-center text-xl shrink-0">
        🎒
      </div>
      <div>
        <h2 className="text-lg font-bold text-white">
          {trainer.name || "Unnamed Trainer"}
        </h2>
        <p className="text-sm text-gray-300">
          Lv. {trainer.level} {trainer.class || "Adventurer"}
        </p>
      </div>
    </div>
  );
}
