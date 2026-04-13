"use client";

import React from "react";
import BaseModal from "@/components/shared/ui/BaseModal";

export interface DeleteConfirmationModalProps {
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
  const titleId = "delete-modal-title";
  const descId = "delete-modal-desc";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onCancel}
      size="sm"
      titleId={titleId}
      descriptionId={descId}
    >
      <div className="p-2">
        <h2
          id={titleId}
          className="text-xl font-bold text-white mb-3 text-center"
        >
          Delete Pokémon?
        </h2>
        <p
          id={descId}
          className="text-gray-300 mb-6 leading-relaxed text-center"
        >
          Are you sure you want to delete &quot;{pokemonName}&quot;? This action cannot be undone.
        </p>
        <div className="flex flex-col items-center text-center mb-2">
          <div className="w-16 h-16 mb-5 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 9v2m0 4h.01" />
              <path d="M4.93 19h14.14c1.54 0 2.5-1.67 1.73-2.5L13.73 4c-.77-.83-1.96-.83-2.73 0L3.2 16.5c-.77.83.19 2.5 1.73 2.5Z" />
            </svg>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Deleting{" "}
            <span className="font-semibold text-white">{pokemonName}</span> will
            permanently remove it from your team.
          </p>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 px-4 rounded-lg bg-red-500/80 hover:bg-red-500 text-white font-semibold transition-colors"
            autoFocus
          >
            Delete
          </button>
        </div>
      </div>
    </BaseModal>
  );
}