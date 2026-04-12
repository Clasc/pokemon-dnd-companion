"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  PokeAPINamedResource,
  PokeAPIMoveDetailResponse,
  PokeAPIMoveListResponse,
  formatMoveName,
  getEnglishFlavorText,
} from "@/types/pokeapi";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";
const DEBOUNCE_MS = 300;
const MAX_SUGGESTIONS = 10;

export interface MoveAutocompleteProps {
  value: string;
  onSelect: (move: {
    name: string;
    displayName: string;
    pp: number;
    description: string;
  }) => void;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  testIds?: {
    input?: string;
    dropdown?: string;
    option?: string;
  };
}

function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export default function MoveAutocomplete({
  value,
  onSelect,
  onChange,
  placeholder = "Search for a move...",
  disabled = false,
  testIds,
}: MoveAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<PokeAPINamedResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moveList, setMoveList] = useState<PokeAPINamedResource[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMoveList = async () => {
      if (moveList.length > 0) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `${POKEAPI_BASE_URL}/move/?limit=1000`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch move list");
        }
        const data: PokeAPIMoveListResponse = await response.json();
        setMoveList(data.results);
      } catch (err) {
        setError("Unable to load moves. Please try again.");
        console.error("Failed to fetch move list:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoveList();
  }, [moveList.length]);

  const filterSuggestions = useCallback(
    (query: string): PokeAPINamedResource[] => {
      if (!query.trim()) return [];
      const lowerQuery = query.toLowerCase();
      return moveList
        .filter((move) => move.name.includes(lowerQuery))
        .slice(0, MAX_SUGGESTIONS);
    },
    [moveList],
  );

  const debouncedFilter = useMemo(
    () => debounce(filterSuggestions, DEBOUNCE_MS),
    [filterSuggestions],
  );

  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    debouncedFilter(value);
  }, [value, debouncedFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setError(null);

    if (!newValue.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const filtered = filterSuggestions(newValue);
    setSuggestions(filtered);
    setIsOpen(filtered.length > 0);
  };

  const handleSelect = async (move: PokeAPINamedResource) => {
    onChange(formatMoveName(move.name));
    setIsOpen(false);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${POKEAPI_BASE_URL}/move/${move.name}/`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch move details");
      }
      const data: PokeAPIMoveDetailResponse = await response.json();

      const result = {
        name: move.name,
        displayName: formatMoveName(move.name),
        pp: data.pp,
        description: getEnglishFlavorText(data.flavor_text_entries),
      };

      onSelect(result);
    } catch (err) {
      setError("Failed to load move details. Please try again.");
      console.error("Failed to fetch move details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocus = () => {
    if (value.trim() && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 disabled:opacity-50"
          data-testid={testIds?.input}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {error && (
        <div className="mt-1 text-sm text-red-400" role="alert">
          {error}
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg max-h-64 overflow-y-auto"
          data-testid={testIds?.dropdown}
        >
          {suggestions.map((move) => (
            <button
              key={move.name}
              type="button"
              onClick={() => handleSelect(move)}
              className="w-full px-4 py-2 text-left text-white hover:bg-white/10 focus:outline-none focus:bg-white/20 transition-colors"
              data-testid={testIds?.option}
            >
              {formatMoveName(move.name)}
            </button>
          ))}
        </div>
      )}

      {isOpen && value.trim() && suggestions.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg p-4 text-gray-400 text-center">
          No moves found
        </div>
      )}
    </div>
  );
}
