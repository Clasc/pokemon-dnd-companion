"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { StatusCondition, StatusEffect, STATUS_COLORS } from "@/types/pokemon";
import { useAppStore } from "@/store";

interface QuickStatusDropdownProps {
  pokemonUuid: string;
}

const PRIMARY_STATUS_CONDITIONS: StatusCondition[] = [
  "none",
  "fainted",
  "burned",
  "frozen",
  "paralyzed",
  "poisoned",
  "badly-poisoned",
  "asleep",
];

const CONFUSED_STATUS_CONDITIONS: StatusCondition[] = ["none", "confused"];

const getStatusDisplayName = (condition: StatusCondition): string => {
  switch (condition) {
    case "badly-poisoned":
      return "Badly Poisoned";
    case "none":
      return "Status";
    default:
      return condition.charAt(0).toUpperCase() + condition.slice(1);
  }
};

const getDefaultDuration = (condition: StatusCondition): number | undefined => {
  switch (condition) {
    case "asleep":
      return 2;
    case "confused":
      return 3;
    default:
      return undefined;
  }
};

export default function QuickStatusDropdown({
  pokemonUuid,
}: QuickStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const pokemon = useAppStore.use.pokemonTeam()[pokemonUuid];
  const setPrimaryStatus = useAppStore.use.setPrimaryStatus();
  const setConfusion = useAppStore.use.setConfusion();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = dropdownRef.current;
      const portal = document.getElementById("quick-status-portal");
      
      if (dropdown && !dropdown.contains(event.target as Node) && 
          portal && !portal.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!pokemon) return null;

  const handlePrimaryStatusChange = (condition: StatusCondition) => {
    if (condition === "none") {
      setPrimaryStatus(pokemonUuid, null);
    } else {
      const statusEffect: StatusEffect = {
        condition,
        duration: getDefaultDuration(condition),
      };
      setPrimaryStatus(pokemonUuid, statusEffect);
    }
    setIsOpen(false);
  };

  const handleConfusedChange = (condition: StatusCondition) => {
    if (condition === "none") {
      setConfusion(pokemonUuid, null);
    } else {
      const statusEffect: StatusEffect = {
        condition,
        duration: getDefaultDuration(condition),
      };
      setConfusion(pokemonUuid, statusEffect);
    }
    setIsOpen(false);
  };

  const currentPrimaryStatus = pokemon.primaryStatus?.condition || "none";
  const currentConfusedStatus = pokemon.confusion?.condition || "none";

  const getButtonLabel = () => {
    if (currentPrimaryStatus === "none") return "Status";
    return getStatusDisplayName(currentPrimaryStatus);
  };

  const showConfusedBadge = currentConfusedStatus === "confused";

  return (
    <div className="relative z-[1000]" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-[#4a4a4a] hover:bg-[#5a5a5a] rounded-md border border-white/10 transition-colors"
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: STATUS_COLORS[currentPrimaryStatus] }}
        />
        <span className="text-white">
          {getButtonLabel()}
        </span>
        <svg
          className={`w-3 h-3 text-gray-300 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showConfusedBadge && (
        <div className="absolute top-full right-0 mt-1">
          <div 
            className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-white/20"
            style={{ backgroundColor: STATUS_COLORS.confused }}
          >
            <span className="text-white">Confused</span>
          </div>
        </div>
      )}

      {isOpen && (
        createPortal(
          <div 
            id="quick-status-portal"
            className="fixed w-48 bg-[#2d2d2d] border border-white/10 rounded-lg shadow-lg z-[9999] pointer-events-auto"
            style={{ 
              top: buttonRef.current?.getBoundingClientRect().bottom,
              right: window.innerWidth - (buttonRef.current?.getBoundingClientRect().right || 0)
            }}
          >
            <div className="p-2 border-b border-white/10">
              <div className="text-xs text-gray-400 mb-1 px-2">Status</div>
              {PRIMARY_STATUS_CONDITIONS.map((condition) => (
                <button
                  key={condition}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrimaryStatusChange(condition);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm rounded hover:bg-white/10 transition-colors ${
                    currentPrimaryStatus === condition ? "bg-white/10" : ""
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: STATUS_COLORS[condition] }}
                  />
                  <span className="text-white">
                    {getStatusDisplayName(condition)}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-2">
              <div className="text-xs text-gray-400 mb-1 px-2">Confused</div>
              {CONFUSED_STATUS_CONDITIONS.map((condition) => (
                <button
                  key={condition}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfusedChange(condition);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm rounded hover:bg-white/10 transition-colors ${
                    currentConfusedStatus === condition ? "bg-white/10" : ""
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: STATUS_COLORS[condition] }}
                  />
                  <span className="text-white">
                    {getStatusDisplayName(condition)}
                  </span>
                </button>
              ))}
            </div>
          </div>,
          document.body
        )
      )}
    </div>
  );
}
