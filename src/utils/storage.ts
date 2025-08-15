import { Character, DEFAULT_CHARACTER } from '../types/character';

const STORAGE_KEY = 'pokemon-dnd-character';

export const saveCharacter = (character: Character): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
  } catch (error) {
    console.error('Failed to save character to localStorage:', error);
  }
};

export const loadCharacter = (): Character => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure all required fields exist with defaults
      return {
        ...DEFAULT_CHARACTER,
        ...parsed,
        attributes: {
          ...DEFAULT_CHARACTER.attributes,
          ...parsed.attributes,
        },
      };
    }
  } catch (error) {
    console.error('Failed to load character from localStorage:', error);
  }
  return DEFAULT_CHARACTER;
};

export const clearCharacter = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear character from localStorage:', error);
  }
};
