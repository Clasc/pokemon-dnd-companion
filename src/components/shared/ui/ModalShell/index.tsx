"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

export interface ModalShellProps {
  isOpen: boolean;

  onClose: () => void;

  title?: string;

  children: ReactNode;

  /**

   * If true, clicking the backdrop closes the modal.

   * Defaults to true.

   */

  closeOnBackdrop?: boolean;

  /**

   * If true, pressing Escape closes the modal.

   * Defaults to true.

   */

  closeOnEscape?: boolean;

  /**

   * Hides the top-right close button if true.

   * Useful for critical confirmation dialogs.

   */

  hideCloseButton?: boolean;

  /**

   * Optional footer content (e.g., action buttons).

   * If provided, rendered in a dedicated footer section.

   */

  footer?: ReactNode;

  /**

   * Optional descriptive text that supplements the title.

   * Used for accessibility (aria-describedby).

   */

  description?: string;

  /**

   * Adds size variants controlling max width.

   */

  size?: "sm" | "md" | "lg";

  /**

   * Custom className merged into the modal panel container.

   */

  className?: string;

  /**

   * Disable closing entirely (overrides backdrop & escape).

   */

  disableAllClose?: boolean;

  /**

   * Disable initial auto-focus inside the modal.

   */

  disableAutoFocus?: boolean;

  /**
   * Optional test id hook for the backdrop (testing convenience).
   */
  backdropTestId?: string;
}

const sizeClassMap: Record<Required<ModalShellProps>["size"], string> = {
  sm: "max-w-sm",
  md: "max-w-xl",
  lg: "max-w-2xl",
};

/**
 * ModalShell
 * Reusable accessible modal wrapper with:
 * - Backdrop & optional backdrop dismissal
 * - Escape key handling
 * - Focus management (initial focus + basic containment)
 * - ARIA labeling (role="dialog", aria-modal, aria-labelledby, aria-describedby)
 *
 * NOTE:
 * This is intentionally lightweight; for full focus trapping in complex scenarios
 * you can extend with more sophisticated logic later.
 */

export default function ModalShell({
  isOpen,

  onClose,

  title,

  children,

  closeOnBackdrop = true,

  closeOnEscape = true,

  hideCloseButton = false,

  footer,

  description,

  size = "md",

  className = "",

  disableAllClose = false,

  disableAutoFocus = false,

  backdropTestId,
}: ModalShellProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstSentinelRef = useRef<HTMLSpanElement>(null);
  const lastSentinelRef = useRef<HTMLSpanElement>(null);

  // Derived IDs for accessibility
  const stableTitleId = useStableId();
  const stableDescId = useStableId();
  const titleId = title ? "modal-title-" + stableTitleId : undefined;
  const descriptionId = description ? "modal-desc-" + stableDescId : undefined;

  // Handle Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (disableAllClose) return;

      if (e.key === "Escape" && closeOnEscape) {
        e.stopPropagation();
        onClose();
      }

      // Basic (non-strict) focus containment:
      // If Tab reaches after last sentinel, wrap to first focusable.
      if (e.key === "Tab") {
        const focusable = getFocusableElements(panelRef.current);
        if (focusable.length === 0) return;

        const active = document.activeElement;
        const isShift = e.shiftKey;

        if (isShift && active === focusable[0]) {
          e.preventDefault();
          focusable[focusable.length - 1].focus();
        } else if (!isShift && active === focusable[focusable.length - 1]) {
          e.preventDefault();
          focusable[0].focus();
        }
      }
    },
    [isOpen, closeOnEscape, disableAllClose, onClose],
  );

  // Global key listener
  useEffect(() => {
    if (!isOpen) return;

    const listener = (e: KeyboardEvent) => handleKeyDown(e);
    document.addEventListener("keydown", listener as unknown as EventListener);
    return () =>
      document.removeEventListener(
        "keydown",
        listener as unknown as EventListener,
      );
  }, [isOpen, handleKeyDown]);

  // Auto focus first focusable or panel
  useEffect(() => {
    if (!isOpen || disableAutoFocus) return;

    const focusable = getFocusableElements(panelRef.current);
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      panelRef.current?.focus();
    }
  }, [isOpen, disableAutoFocus]);

  // Backdrop click close
  const handleBackdropMouseDown = (e: React.MouseEvent) => {
    if (!isOpen) return;
    if (disableAllClose) return;

    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}

      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onMouseDown={handleBackdropMouseDown}
        onClick={handleBackdropMouseDown}
        data-testid={backdropTestId}
      />

      {/* Focus sentinel (start) */}
      <span ref={firstSentinelRef} tabIndex={0} className="sr-only">
        Start of modal
      </span>

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={`
          relative w-full ${sizeClassMap[size]} max-h-[90vh] overflow-y-auto
          glass rounded-2xl border border-white/20 shadow-lg
          focus:outline-none
          ${className}
        `}
        tabIndex={-1}
      >
        {/* Close Button */}
        {!hideCloseButton && !disableAllClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Header */}
        {(title || description) && (
          <div className="px-6 pt-6 pb-4">
            {title && (
              <h2
                id={titleId}
                className="text-xl font-bold text-white mb-2 leading-snug"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id={descriptionId}
                className="text-sm text-gray-300 leading-relaxed"
              >
                {description}
              </p>
            )}
            <div className="h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent mt-4" />
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 pb-6 pt-4 border-t border-white/10">
            {footer}
          </div>
        )}
      </div>

      {/* Focus sentinel (end) */}
      <span ref={lastSentinelRef} tabIndex={0} className="sr-only">
        End of modal
      </span>
    </div>,
    document.body,
  );
}

/**
 * Generate a stable (non-random) ID suffix for title/description association.
 * Using a simple counter instead of random keeps tests deterministic.
 */
let idCounter = 0;
function useStableId(): string {
  const idRef = useRef<string>("");
  if (!idRef.current) {
    idCounter += 1;
    idRef.current = idCounter.toString();
  }
  return idRef.current;
}

/**
 * Collect focusable elements inside a container for rudimentary focus trapping.
 */
function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const selector =
    'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(selector),
  );
  return elements.filter(
    (el) =>
      !el.hasAttribute("disabled") &&
      !el.getAttribute("aria-hidden") &&
      el.tabIndex !== -1,
  );
}
