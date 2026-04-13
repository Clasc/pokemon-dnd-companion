"use client";

import React from "react";
import BaseModal, { BaseModalProps } from "../BaseModal";

export interface ConfirmationModalProps extends Omit<BaseModalProps, "children"> {
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
  size = "sm",
}: ConfirmationModalProps) {
  const titleId = `confirmation-title-${Math.random().toString(36).substr(2, 9)}`;
  const descId = `confirmation-desc-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      titleId={titleId}
      descriptionId={descId}
    >
      <div className="p-2">
        <h2
          id={titleId}
          className="text-xl font-bold text-white mb-3"
        >
          {title}
        </h2>
        <p
          id={descId}
          className="text-gray-300 mb-6 leading-relaxed"
        >
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50
              ${variant === "danger" 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-accent-purple hover:bg-purple-700 text-white"}
            `}
          >
            {isLoading ? "Loading..." : confirmLabel}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}