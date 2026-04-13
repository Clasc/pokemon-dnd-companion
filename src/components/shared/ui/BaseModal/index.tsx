"use client";

import React, { useEffect, useRef, useCallback, ReactNode, KeyboardEvent } from "react";
import { createPortal } from "react-dom";

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "fullscreen";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  titleId?: string;
  descriptionId?: string;
  className?: string;
  disableAutoFocus?: boolean;
  hideCloseButton?: boolean;
  disableAllClose?: boolean;
  title?: string;
  description?: string;
  footer?: ReactNode;
  backdropTestId?: string;
  children: ReactNode;
}

const sizeClassMap: Record<Required<BaseModalProps>["size"], string> = {
  sm: "max-w-sm",
  md: "max-w-xl",
  lg: "max-w-2xl",
  fullscreen: "max-w-full h-full",
};

export default function BaseModal({
  isOpen,
  onClose,
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
  titleId,
  descriptionId,
  className = "",
  disableAutoFocus = false,
  hideCloseButton = false,
  disableAllClose = false,
  title,
  description,
  footer,
  backdropTestId,
  children,
}: BaseModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstSentinelRef = useRef<HTMLSpanElement>(null);
  const lastSentinelRef = useRef<HTMLSpanElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (disableAllClose) return;

      if (e.key === "Escape" && closeOnEscape) {
        e.stopPropagation();
        onClose();
      }

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
    [isOpen, closeOnEscape, onClose, disableAllClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    previousActiveElement.current = document.activeElement as HTMLElement;

    const listener = (e: KeyboardEvent) => handleKeyDown(e);
    document.addEventListener("keydown", listener as unknown as EventListener);
    return () =>
      document.removeEventListener("keydown", listener as unknown as EventListener);
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (!isOpen || disableAutoFocus) return;

    const focusable = getFocusableElements(panelRef.current);
    if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 0);
    } else {
      setTimeout(() => panelRef.current?.focus(), 0);
    }
  }, [isOpen, disableAutoFocus]);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

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
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onMouseDown={handleBackdropMouseDown}
        onClick={handleBackdropMouseDown}
        data-testid={backdropTestId}
      />

      <span ref={firstSentinelRef} tabIndex={0} className="sr-only" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={`
          relative w-full ${sizeClassMap[size]} ${size === "fullscreen" ? "" : "max-h-[90vh] overflow-y-auto"}
          glass rounded-2xl border border-white/20 shadow-lg
          focus:outline-none
          animate-scale-in
          ${className}
        `}
        tabIndex={-1}
      >
        {!hideCloseButton && !disableAllClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white z-10"
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

        <div className="px-6 pb-6">{children}</div>

        {footer && (
          <div className="px-6 pb-6 pt-4 border-t border-white/10">
            {footer}
          </div>
        )}
      </div>

      <span ref={lastSentinelRef} tabIndex={0} className="sr-only" />
    </div>,
    document.body,
  );
}

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