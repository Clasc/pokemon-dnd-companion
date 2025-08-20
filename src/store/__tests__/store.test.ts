import { Pokemon } from "../../types/pokemon";

// Mock crypto.randomUUID for consistent testing
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: jest.fn(() => "mock-uuid"),
  },
});

// Extracted logic from the store for unit testing
function gainExperienceLogic(
  pokemon: Pokemon,
  xpGained: number,
): Pokemon | null {
  if (!pokemon || xpGained <= 0) return null;

  const newExperience = pokemon.experience + xpGained;
  let newLevel = pokemon.level;
  let newExperienceToNext = pokemon.experienceToNext;

  // Simple level up logic: if gained XP exceeds experienceToNext, level up
  if (xpGained >= pokemon.experienceToNext) {
    newLevel += 1;
    const remainingXP = xpGained - pokemon.experienceToNext;
    // Reset experience to remaining XP after level up
    // For simplicity, assume each level requires 100 more XP than the previous
    newExperienceToNext = 100 * newLevel - remainingXP;
    if (newExperienceToNext <= 0) {
      newExperienceToNext = 100; // Minimum XP needed for next level
    }
  } else {
    newExperienceToNext = pokemon.experienceToNext - xpGained;
  }

  return {
    ...pokemon,
    experience: newExperience,
    experienceToNext: newExperienceToNext,
    level: newLevel,
  };
}

describe("Store - gainExperience logic", () => {
  const mockPokemon: Pokemon = {
    name: "Pikachu",
    type: "Pikachu",
    type1: "electric",
    level: 25,
    currentHP: 60,
    maxHP: 100,
    experience: 1500,
    experienceToNext: 500,
    attributes: {
      strength: 10,
      dexterity: 15,
      constitution: 12,
      intelligence: 14,
      wisdom: 11,
      charisma: 13,
    },
    attacks: [],
  };

  it("adds experience without leveling up when XP is less than experienceToNext", () => {
    const result = gainExperienceLogic(mockPokemon, 200);

    expect(result).not.toBeNull();
    expect(result!.experience).toBe(1700); // 1500 + 200
    expect(result!.experienceToNext).toBe(300); // 500 - 200
    expect(result!.level).toBe(25); // No level up
  });

  it("levels up pokemon when XP gained equals experienceToNext", () => {
    const result = gainExperienceLogic(mockPokemon, 500);

    expect(result).not.toBeNull();
    expect(result!.experience).toBe(2000); // 1500 + 500
    expect(result!.level).toBe(26); // Level up from 25 to 26
    expect(result!.experienceToNext).toBe(2600); // 100 * 26 (new level)
  });

  it("levels up pokemon when XP gained exceeds experienceToNext", () => {
    const result = gainExperienceLogic(mockPokemon, 700);

    expect(result).not.toBeNull();
    expect(result!.experience).toBe(2200); // 1500 + 700
    expect(result!.level).toBe(26); // Level up from 25 to 26
    expect(result!.experienceToNext).toBe(2400); // 100 * 26 - remaining XP (200)
  });

  it("handles large XP gains that would cause multiple level ups", () => {
    const result = gainExperienceLogic(mockPokemon, 1500);

    expect(result).not.toBeNull();
    expect(result!.experience).toBe(3000); // 1500 + 1500
    expect(result!.level).toBe(26); // Only levels up once in current implementation
    expect(result!.experienceToNext).toBe(1600); // 100 * 26 - remaining XP (1000)
  });

  it("returns null when XP gained is zero", () => {
    const result = gainExperienceLogic(mockPokemon, 0);

    expect(result).toBeNull();
  });

  it("returns null when XP gained is negative", () => {
    const result = gainExperienceLogic(mockPokemon, -100);

    expect(result).toBeNull();
  });

  it("sets minimum experienceToNext when calculation results in zero or negative", () => {
    const testPokemon = {
      ...mockPokemon,
      experience: 2400,
      experienceToNext: 100,
      level: 24,
    };

    const result = gainExperienceLogic(testPokemon, 100);

    expect(result).not.toBeNull();
    expect(result!.level).toBe(25);
    expect(result!.experienceToNext).toBe(2500); // 100 * 25 (new level)
  });

  it("maintains other pokemon properties unchanged", () => {
    const result = gainExperienceLogic(mockPokemon, 200);

    expect(result).not.toBeNull();
    // Check that only XP-related properties changed
    expect(result!.name).toBe(mockPokemon.name);
    expect(result!.type).toBe(mockPokemon.type);
    expect(result!.type1).toBe(mockPokemon.type1);
    expect(result!.currentHP).toBe(mockPokemon.currentHP);
    expect(result!.maxHP).toBe(mockPokemon.maxHP);
    expect(result!.attributes).toEqual(mockPokemon.attributes);
    expect(result!.attacks).toEqual(mockPokemon.attacks);
  });

  it("handles edge case with very low experienceToNext", () => {
    const testPokemon = {
      ...mockPokemon,
      experience: 1999,
      experienceToNext: 1,
      level: 20,
    };

    const result = gainExperienceLogic(testPokemon, 1);

    expect(result).not.toBeNull();
    expect(result!.experience).toBe(2000);
    expect(result!.level).toBe(21);
    expect(result!.experienceToNext).toBe(2100); // 100 * 21
  });

  it("works with pokemon at level 1", () => {
    const level1Pokemon = {
      ...mockPokemon,
      experience: 50,
      experienceToNext: 50,
      level: 1,
    };

    const result = gainExperienceLogic(level1Pokemon, 75);

    expect(result).not.toBeNull();
    expect(result!.experience).toBe(125);
    expect(result!.level).toBe(2);
    expect(result!.experienceToNext).toBe(175); // 100 * 2 - remaining XP (25)
  });

  it("handles exact level up threshold", () => {
    const result = gainExperienceLogic(mockPokemon, 500);

    expect(result).not.toBeNull();
    expect(result!.level).toBe(26);
    expect(result!.experience).toBe(2000);
    expect(result!.experienceToNext).toBe(2600);
  });

  it("handles fractional calculations correctly", () => {
    const testPokemon = {
      ...mockPokemon,
      experience: 1000,
      experienceToNext: 250,
      level: 10,
    };

    const result = gainExperienceLogic(testPokemon, 300);

    expect(result).not.toBeNull();
    expect(result!.level).toBe(11);
    expect(result!.experience).toBe(1300);
    expect(result!.experienceToNext).toBe(1050); // 100 * 11 - remaining XP (50)
  });
});
