import React, { forwardRef, useMemo } from "react";

export type ProgressVariant = "hp" | "xp" | "generic";

export interface ProgressBarProps {
  variant?: ProgressVariant;
  current: number;
  max: number;
  label?: string;
  showValue?: boolean;
  className?: string;
  getColorOverride?: (percentage: number) => string;
  animate?: boolean;
  valueFormatter?: (current: number, max: number, variant: ProgressVariant) => string;
  "aria-label"?: string;
}

// Default color logic for HP variant
function hpColorFor(percentage: number): string {
  if (percentage > 60) return "var(--accent-green)";
  if (percentage > 30) return "var(--accent-yellow)";
  return "var(--accent-red)";
}

// XP color (non-critical gradient fallback)
function xpColorFor(): string {
  return "var(--accent-blue, #3b82f6)";
}

// Generic neutral color
function genericColorFor(): string {
  return "var(--accent-neutral, #6b7280)";
}

function defaultValueFormatter(current: number, max: number, variant: ProgressVariant): string {
  const unit = variant === "hp" ? "HP" : variant === "xp" ? "XP" : "";
  return unit ? `${current} out of ${max} ${unit}` : `${current} out of ${max}`;
}

/**
 * Shared ProgressBar component:
 * - Visual representation of current / max values.
 * - Handles HP, XP, and generic styling variants.
 * - Accessible via role="progressbar" with ARIA attributes.
 * - Clamps values and gracefully handles max <= 0.
 */
const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  {
    variant = "generic",
    current,
    max,
    label,
    showValue = true,
    className = "",
    getColorOverride,
    animate = true,
    valueFormatter = defaultValueFormatter,
    "aria-label": ariaLabel,
  },
  ref,
) {
  // Normalize & clamp values
  const safeMax = Math.max(0, max);
  const rawCurrent = Number.isFinite(current) ? current : 0;
  const clampedCurrent = Math.max(0, Math.min(rawCurrent, safeMax));
  const percentage = safeMax > 0 ? (clampedCurrent / safeMax) * 100 : 0;

  // Derive color
  const color = useMemo(() => {
    if (getColorOverride) {
      return getColorOverride(percentage);
    }
    switch (variant) {
      case "hp":
        return hpColorFor(percentage);
      case "xp":
        return xpColorFor();
      default:
        return genericColorFor();
    }
  }, [getColorOverride, percentage, variant]);

  // Accessible textual representation
  const valueText = valueFormatter(clampedCurrent, safeMax, variant);

  // Fallback label for aria-label if not provided
  const resolvedAriaLabel = ariaLabel || label || (variant === "hp" ? "Hit Points" : variant === "xp" ? "Experience Points" : "Progress");

  return (
    <div className={`flex flex-col gap-1 ${className}`} ref={ref}>
      {label && (
        <div className="text-xs text-gray-300 font-medium leading-none">{label}</div>
      )}
      <div
        role="progressbar"
        aria-label={resolvedAriaLabel}
        aria-valuenow={clampedCurrent}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuetext={valueText}
        className="w-full bg-gray-600/50 rounded-full h-2 overflow-hidden"
      >
        <div
          className={`h-full rounded-full ${animate ? "transition-all duration-300" : ""}`}
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showValue && (
        <div className="text-[10px] text-gray-400 font-medium text-right">
          {clampedCurrent}/{safeMax}
        </div>
      )}
      {/* Visually hidden live region in case external code updates values rapidly */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {valueText}
      </div>
    </div>
  );
});

export default ProgressBar;

// Named exports for utility reuse if needed elsewhere.
export { hpColorFor, xpColorFor, genericColorFor };

/**
 * NOTE:
 * This component intentionally avoids direct modification of domain state.
 * It is purely presentational and should be wrapped by logic components
 * when interactive adjustments (drag/keyboard) are required.
 */
