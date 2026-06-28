import { testFixtures } from "../../fixtures";
import { shouldLoadTestData } from "../index";
import { useAppStore } from "../index";
import { totalXpForLevel, xpToNextLevel } from "../../utils/xp";

// Mock crypto.randomUUID for consistent testing
const mockUuid = "test-pokemon-uuid";
let originalRandomUUID: typeof crypto.randomUUID;

beforeAll(() => {
  originalRandomUUID = crypto.randomUUID;
  Object.defineProperty(global, "crypto", {
    value: {
      randomUUID: jest.fn(() => mockUuid),
    },
  });
});

afterAll(() => {
  Object.defineProperty(global, "crypto", {
    value: { randomUUID: originalRandomUUID },
  });
});

beforeEach(() => {
  // Reset the store before each test
  useAppStore.getState().reset();
  localStorage.removeItem("app-store");
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("Store - gainExperience", () => {
  it("adds XP without leveling up when progress stays under threshold", () => {
    useAppStore.getState().addPokemon({
      type: "Pikachu",
      name: "Testmon",
      type1: "electric",
      level: 5,
      currentHP: 20,
      maxHP: 30,
      experience: 125,
      experienceToNext: 91,
      xpSinceLevelUp: 0,
      attributes: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
      armorClass: 10,
      attacks: [],
    }, mockUuid);

    useAppStore.getState().gainExperience(mockUuid, 50);

    const result = useAppStore.getState().pokemonTeam[mockUuid];
    expect(result!.level).toBe(5);
    expect(result!.xpSinceLevelUp).toBe(50);
    expect(result!.experience).toBe(125 + 50);
    expect(result!.experienceToNext).toBe(91);
  });

  it("levels up when XP progress crosses the threshold", () => {
    useAppStore.getState().addPokemon({
      type: "Pikachu",
      name: "Testmon",
      type1: "electric",
      level: 5,
      currentHP: 20,
      maxHP: 30,
      experience: 125,
      experienceToNext: 91,
      xpSinceLevelUp: 80,
      attributes: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
      armorClass: 10,
      attacks: [],
    }, mockUuid);

    useAppStore.getState().gainExperience(mockUuid, 20);
    // 80 + 20 = 100, threshold is 91, so level up with overflow 9

    const result = useAppStore.getState().pokemonTeam[mockUuid];
    expect(result!.level).toBe(6);
    expect(result!.xpSinceLevelUp).toBe(9);
    expect(result!.experienceToNext).toBe(xpToNextLevel(6));
    expect(result!.experience).toBe(totalXpForLevel(6) + 9);
  });

  it("handles multi-level-up from a large XP gain", () => {
    useAppStore.getState().addPokemon({
      type: "Pikachu",
      name: "Testmon",
      type1: "electric",
      level: 1,
      currentHP: 20,
      maxHP: 30,
      experience: 1,
      experienceToNext: 7,
      xpSinceLevelUp: 0,
      attributes: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
      armorClass: 10,
      attacks: [],
    }, mockUuid);

    // Gain enough XP to go from level 1 to level 3
    // Level 1→2: need 7, Level 2→3: need 19, total needed = 7 + 19 = 26
    useAppStore.getState().gainExperience(mockUuid, 30);

    const result = useAppStore.getState().pokemonTeam[mockUuid];
    expect(result!.level).toBe(3);
    // overflow: 0 + 30 - 7 - 19 = 4
    expect(result!.xpSinceLevelUp).toBe(4);
    expect(result!.experienceToNext).toBe(xpToNextLevel(3));
    expect(result!.experience).toBe(totalXpForLevel(3) + 4);
  });

  it("does nothing when XP gained is zero", () => {
    useAppStore.getState().addPokemon({
      type: "Pikachu",
      name: "Testmon",
      type1: "electric",
      level: 5,
      currentHP: 20,
      maxHP: 30,
      experience: 125,
      experienceToNext: 91,
      xpSinceLevelUp: 0,
      attributes: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
      armorClass: 10,
      attacks: [],
    }, mockUuid);

    useAppStore.getState().gainExperience(mockUuid, 0);

    const result = useAppStore.getState().pokemonTeam[mockUuid];
    expect(result!.level).toBe(5);
    expect(result!.xpSinceLevelUp).toBe(0);
  });

  it("does nothing when XP gained is negative", () => {
    useAppStore.getState().addPokemon({
      type: "Pikachu",
      name: "Testmon",
      type1: "electric",
      level: 5,
      currentHP: 20,
      maxHP: 30,
      experience: 125,
      experienceToNext: 91,
      xpSinceLevelUp: 0,
      attributes: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
      armorClass: 10,
      attacks: [],
    }, mockUuid);

    useAppStore.getState().gainExperience(mockUuid, -50);

    const result = useAppStore.getState().pokemonTeam[mockUuid];
    expect(result!.level).toBe(5);
    expect(result!.xpSinceLevelUp).toBe(0);
  });

  it("preserves other pokemon properties on XP gain", () => {
    useAppStore.getState().addPokemon({
      type: "Pikachu",
      name: "Testmon",
      type1: "electric",
      level: 5,
      currentHP: 20,
      maxHP: 30,
      experience: 125,
      experienceToNext: 91,
      xpSinceLevelUp: 0,
      attributes: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
      armorClass: 10,
      attacks: [],
    }, mockUuid);

    useAppStore.getState().gainExperience(mockUuid, 30);

    const result = useAppStore.getState().pokemonTeam[mockUuid];
    expect(result!.name).toBe("Testmon");
    expect(result!.type).toBe("Pikachu");
    expect(result!.type1).toBe("electric");
    expect(result!.currentHP).toBe(20);
    expect(result!.maxHP).toBe(30);
    expect(result!.attributes).toEqual({ strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 });
  });

  it("migrates legacy data (xpSinceLevelUp undefined) on first gainExperience", () => {
    // Add a Pokemon without xpSinceLevelUp (legacy data)
    useAppStore.getState().addPokemon({
      type: "Pikachu",
      name: "Legacy",
      type1: "electric",
      level: 10,
      currentHP: 50,
      maxHP: 50,
      experience: 500,
      experienceToNext: 300,
      attributes: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
      armorClass: 10,
      attacks: [],
    }, mockUuid);

    const before = useAppStore.getState().pokemonTeam[mockUuid];
    expect(before!.xpSinceLevelUp).toBeUndefined();

    useAppStore.getState().gainExperience(mockUuid, 50);

    const result = useAppStore.getState().pokemonTeam[mockUuid];
    // Should be migrated and have new XP
    expect(result!.xpSinceLevelUp).toBe(50);
    expect(result!.level).toBe(10);
    expect(result!.experience).toBe(totalXpForLevel(10) + 50);
    expect(result!.experienceToNext).toBe(xpToNextLevel(10));
  });

  it("handles exact level up (progress exactly equals threshold)", () => {
    useAppStore.getState().addPokemon({
      type: "Pikachu",
      name: "Testmon",
      type1: "electric",
      level: 5,
      currentHP: 20,
      maxHP: 30,
      experience: 125,
      experienceToNext: 91,
      xpSinceLevelUp: 41,
      attributes: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
      armorClass: 10,
      attacks: [],
    }, mockUuid);

    // 41 + 50 = 91, exactly the threshold
    useAppStore.getState().gainExperience(mockUuid, 50);

    const result = useAppStore.getState().pokemonTeam[mockUuid];
    expect(result!.level).toBe(6);
    expect(result!.xpSinceLevelUp).toBe(0); // exactly at threshold, no overflow
    expect(result!.experience).toBe(totalXpForLevel(6));
  });
});

describe("Store - Fixture Loading Conditions (env-agnostic)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
  });

  it("returns false when localStorage is empty under test env (non-development)", () => {
    localStorageMock.getItem.mockReturnValue(null);
    expect(shouldLoadTestData()).toBe(false);
  });

  it("returns false when localStorage already has data", () => {
    localStorageMock.getItem.mockReturnValue(
      '{"pokemonTeam":{"existing":"data"},"trainer":{"name":"Existing"}}',
    );
    expect(shouldLoadTestData()).toBe(false);
  });

  it("returns false when localStorage access throws", () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error("LocalStorage error");
    });
    expect(shouldLoadTestData()).toBe(false);
  });

  it("fixture structures remain valid (sanity check)", () => {
    // Trainer structure
    expect(testFixtures.trainer).toMatchObject({
      name: expect.any(String),
      level: expect.any(Number),
      class: expect.any(String),
      attributes: expect.objectContaining({
        strength: expect.any(Number),
        dexterity: expect.any(Number),
        constitution: expect.any(Number),
        intelligence: expect.any(Number),
        wisdom: expect.any(Number),
        charisma: expect.any(Number),
      }),
      currentHP: expect.any(Number),
      maxHP: expect.any(Number),
      inventory: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          quantity: expect.any(Number),
        }),
      ]),
      pokedollars: expect.any(Number),
    });

    // Pokémon fixture structure
    Object.values(testFixtures.pokemonTeam).forEach((pokemon) => {
      expect(pokemon).toMatchObject({
        type: expect.any(String),
        name: expect.any(String),
        type1: expect.any(String),
        level: expect.any(Number),
        currentHP: expect.any(Number),
        maxHP: expect.any(Number),
        experience: expect.any(Number),
        experienceToNext: expect.any(Number),
        attributes: expect.objectContaining({
          strength: expect.any(Number),
          dexterity: expect.any(Number),
          constitution: expect.any(Number),
          intelligence: expect.any(Number),
          wisdom: expect.any(Number),
          charisma: expect.any(Number),
        }),
        attacks: expect.any(Array),
      });
    });
  });
});
