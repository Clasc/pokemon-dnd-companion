import { useState } from "react";

const Pokedollars = ({
  pokedollars,
  isEditable,
  onPokedollarChange,
}: {
  pokedollars: number;
  isEditable: boolean;
  onPokedollarChange: (amount: number) => void;
}) => {
  const [pokedollarAmount, setPokedollarAmount] = useState("");

  const changeDollars = (operation: "add" | "subtract") => {
    const amount = parseInt(pokedollarAmount) || 0;
    if (amount <= 0) return;

    const finalAmount = operation === "add" ? amount : -amount;
    const newTotal = Math.max(0, pokedollars + finalAmount);
    onPokedollarChange(newTotal);
    setPokedollarAmount("");
  };
  return (
    <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg border border-yellow-500/30 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-lg font-semibold text-yellow-400">
            Pokedollars
          </span>
        </div>
        <span className="text-xl font-bold text-yellow-300">
          {pokedollars.toLocaleString()}
        </span>
      </div>

      {isEditable && (
        <div className="flex items-center gap-2 mt-3">
          <input
            type="number"
            value={pokedollarAmount}
            onChange={(e) => setPokedollarAmount(e.target.value)}
            placeholder="Amount"
            min="1"
            className="flex-1 bg-white/10 text-white placeholder-gray-400 rounded-lg p-2 border border-white/20 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          />
          <button
            onClick={() => changeDollars("add")}
            disabled={!pokedollarAmount || parseInt(pokedollarAmount) <= 0}
            className="px-4 py-2 bg-green-500/80 hover:bg-green-500 disabled:bg-gray-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            Add
          </button>
          <button
            onClick={() => changeDollars("subtract")}
            disabled={!pokedollarAmount || parseInt(pokedollarAmount) <= 0}
            className="px-4 py-2 bg-red-500/80 hover:bg-red-500 disabled:bg-gray-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            Subtract
          </button>
        </div>
      )}
    </div>
  );
};

export default Pokedollars;
