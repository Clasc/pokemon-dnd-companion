"use client";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  pokemonName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  pokemonName,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl p-6 max-w-sm w-full mx-4 border border-white/20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">
            Delete Pokémon?
          </h3>

          <p className="text-gray-300 mb-6">
            Are you sure you want to delete <strong>{pokemonName}</strong>? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white border border-white/20"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 px-4 rounded-lg bg-red-500/80 hover:bg-red-500 transition-colors text-white"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
