"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  PokemonAutocompleteResult,
  PokeAPINamedResource,
  PokeAPIPokemonDetailResponse,
  PokeAPIPokemonSpeciesListResponse,
  formatPokemonName,
  isValidPokemonType,
} from "@/types/pokeapi";
import { PokemonType } from "@/types/pokemon";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";
const DEBOUNCE_MS = 300;
const MAX_SUGGESTIONS = 10;

export interface PokemonAutocompleteProps {
  value: string;
  onSelect: (pokemon: PokemonAutocompleteResult) => void;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onLoadingChange?: (loading: boolean) => void;
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

export default function PokemonAutocomplete({
  value,
  onSelect,
  onChange,
  placeholder = "Search for a Pokemon...",
  disabled = false,
  onLoadingChange,
  testIds,
}: PokemonAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<PokeAPINamedResource[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pokemonSpecies, setPokemonSpecies] = useState<PokeAPINamedResource[]>(
    [],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  useEffect(() => {
    const fetchSpecies = async () => {
      if (pokemonSpecies.length > 0) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `${POKEAPI_BASE_URL}/pokemon-species/?limit=1000`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Pokemon species");
        }
        const data: PokeAPIPokemonSpeciesListResponse = await response.json();
        setPokemonSpecies(data.results);
      } catch (err) {
        setError("Unable to load Pokemon. Please try again.");
        console.error("Failed to fetch Pokemon species:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecies();
  }, [pokemonSpecies.length]);

  const filterSuggestions = useCallback(
    (query: string): PokeAPINamedResource[] => {
      if (!query.trim()) return [];
      const lowerQuery = query.toLowerCase();
      return pokemonSpecies
        .filter((pokemon) => pokemon.name.includes(lowerQuery))
        .slice(0, MAX_SUGGESTIONS);
    },
    [pokemonSpecies],
  );

  const debouncedFilter = useMemo(
    () => debounce(filterSuggestions, DEBOUNCE_MS),
    [filterSuggestions],
  );

  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }
    debouncedFilter(value);
  }, [value, debouncedFilter]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setError(null);
    setHighlightedIndex(-1);

    if (!newValue.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const filtered = filterSuggestions(newValue);
    setSuggestions(filtered);
    setIsOpen(filtered.length > 0);
  };

  const handleSelect = async (pokemon: PokeAPINamedResource) => {
    onChange(pokemon.name);
    setIsOpen(false);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${POKEAPI_BASE_URL}/pokemon/${pokemon.name}/`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Pokemon details");
      }
      const data: PokeAPIPokemonDetailResponse = await response.json();

      const types: [PokemonType, PokemonType?] | [] = data.types
        .sort((a, b) => a.slot - b.slot)
        .map((t) => t.type.name)
        .filter((typeName): typeName is PokemonType =>
          isValidPokemonType(typeName),
        ) as [PokemonType, PokemonType?] | [];

      const result: PokemonAutocompleteResult = {
        name: pokemon.name,
        displayName: formatPokemonName(pokemon.name),
        types,
        spriteUrl: data.sprites.other["official-artwork"].front_default ?? "",
      };

      onSelect(result);
    } catch (err) {
      setError("Failed to load Pokemon details. Please try again.");
      console.error("Failed to fetch Pokemon details:", err);
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
          onKeyDown={handleKeyDown}
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
{suggestions.map((pokemon, index) => (
              <button
                key={pokemon.name}
                type="button"
                onClick={() => handleSelect(pokemon)}
                className={`w-full px-4 py-2 text-left transition-colors ${
                  index === highlightedIndex
                    ? "bg-blue-600 text-white"
                    : "text-white hover:bg-white/10 focus:bg-white/20"
                }`}
                data-testid={testIds?.option}
              >
                {formatPokemonName(pokemon.name)}
              </button>
            ))}
        </div>
      )}

      {isOpen && value.trim() && suggestions.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg p-4 text-gray-400 text-center">
          No Pokemon found
        </div>
      )}
    </div>
  );
}
