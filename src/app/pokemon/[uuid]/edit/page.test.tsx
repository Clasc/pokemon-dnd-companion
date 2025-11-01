import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditPokemonPage from "./page";
import { useAppStore } from "@/store";
import { Pokemon } from "@/types/pokemon";

/**
 * Tests for route: /pokemon/[uuid]/edit
 *
 * Coverage:
 * 1. Not found state
 * 2. Prefilled form for existing Pokémon
 * 3. Successful edit + save updates store & navigates
 * 4. Validation (required fields) shows alert and blocks save
 * 5. Cancel & Back buttons invoke router.back()
 * 6. Delete flow (two-step confirmation) removes Pokémon & navigates
 * 7. Max HP reduction clamps Current HP immediately
 * 8. Overlarge Current HP is clamped on save
 *
 * Validation currently relies on alert(); parity with add page (refactor later).
 */

type MockRouter = { push: jest.Mock; back: jest.Mock };
const mockPush = jest.fn();
const mockBack = jest.fn();
const FIXED_UUID = "11111111-2222-4333-8444-555555555555";
const MISSING_UUID = "99999999-aaaa-4bbb-8ccc-dddddddddddd";

jest.mock("next/navigation", () => ({
  useRouter: (): MockRouter => ({
    push: mockPush,
    back: mockBack,
  }),
  useParams: jest.fn(() => ({ uuid: FIXED_UUID })),
}));

import * as NextNav from "next/navigation";

// Stable crypto UUID (some internal logic may use it)
const originalCrypto = globalThis.crypto;
beforeAll(() => {
  const patched: Crypto = {
    ...originalCrypto,
    randomUUID: () => "00000000-0000-4000-8000-000000000000",
  };
  Object.defineProperty(globalThis, "crypto", {
    value: patched,
    configurable: true,
  });
});
afterAll(() => {
  Object.defineProperty(globalThis, "crypto", {
    value: originalCrypto,
    configurable: true,
  });
});

const seedPokemon = (): Pokemon => ({
  type: "Bulbasaur",
  name: "Leafy",
  level: 5,
  type1: "grass",
  currentHP: 20,
  maxHP: 25,
  experience: 120,
  experienceToNext: 80,
  attributes: {
    strength: 12,
    dexterity: 11,
    constitution: 13,
    intelligence: 10,
    wisdom: 9,
    charisma: 8,
  },
  attacks: [],
});

const resetStore = () => {
  const state = useAppStore.getState();
  if ((state as { reset?: () => void }).reset) {
    (state as { reset: () => void }).reset();
  } else {
    Object.keys(state.pokemonTeam).forEach((id) => {
      delete (state.pokemonTeam as Record<string, unknown>)[id];
    });
  }
};

describe("EditPokemonPage route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetStore();
    // Default mock params to existing Pokémon unless overridden per test
    (NextNav.useParams as jest.Mock).mockReturnValue({ uuid: FIXED_UUID });
  });

  it("renders not found UI when Pokémon is missing", () => {
    (NextNav.useParams as jest.Mock).mockReturnValue({ uuid: MISSING_UUID });

    render(<EditPokemonPage />);

    expect(
      screen.getByRole("heading", { name: /pokémon not found/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to team/i }),
    ).toBeInTheDocument();
  });

  it("renders prefilled form fields for existing Pokémon", () => {
    // Seed
    useAppStore.getState().addPokemon(seedPokemon(), FIXED_UUID);

    render(<EditPokemonPage />);

    expect(
      screen.getByRole("heading", { name: /edit pokémon/i }),
    ).toBeInTheDocument();

    const speciesInput = screen.getByTestId(
      "species-input",
    ) as HTMLInputElement;
    const nicknameInput = screen.getByTestId(
      "nickname-input",
    ) as HTMLInputElement;

    expect(speciesInput.value).toBe("Bulbasaur");
    expect(nicknameInput.value).toBe("Leafy");
  });

  it("saves edited changes and navigates back to team", async () => {
    useAppStore.getState().addPokemon(seedPokemon(), FIXED_UUID);
    const user = userEvent.setup();

    render(<EditPokemonPage />);

    const speciesInput = screen.getByTestId(
      "species-input",
    ) as HTMLInputElement;
    const nicknameInput = screen.getByTestId(
      "nickname-input",
    ) as HTMLInputElement;

    // Change species & nickname
    await user.clear(speciesInput);
    await user.type(speciesInput, "Ivysaur");
    await user.clear(nicknameInput);
    await user.type(nicknameInput, "Bloom");

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(mockPush).toHaveBeenCalledWith("/pokemon");

    const updated = useAppStore.getState().pokemonTeam[FIXED_UUID];
    expect(updated.type).toBe("Ivysaur");
    expect(updated.name).toBe("Bloom");
  });

  it("shows validation alert and blocks save when required fields empty", async () => {
    useAppStore.getState().addPokemon(seedPokemon(), FIXED_UUID);
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<EditPokemonPage />);

    const speciesInput = screen.getByTestId(
      "species-input",
    ) as HTMLInputElement;
    const nicknameInput = screen.getByTestId(
      "nickname-input",
    ) as HTMLInputElement;

    await user.clear(speciesInput);
    await user.clear(nicknameInput);

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(alertSpy).toHaveBeenCalledTimes(1);
    const message = String(alertSpy.mock.calls[0]?.[0]);
    expect(message).toMatch(/species is required/i);
    expect(message).toMatch(/nickname is required/i);

    // Ensure store not changed
    const stored = useAppStore.getState().pokemonTeam[FIXED_UUID];
    expect(stored.type).toBe("Bulbasaur");
    expect(stored.name).toBe("Leafy");

    alertSpy.mockRestore();
  });

  it("Cancel button invokes router.back()", async () => {
    useAppStore.getState().addPokemon(seedPokemon(), FIXED_UUID);
    const user = userEvent.setup();

    render(<EditPokemonPage />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("Back button invokes router.back()", async () => {
    useAppStore.getState().addPokemon(seedPokemon(), FIXED_UUID);
    const user = userEvent.setup();

    render(<EditPokemonPage />);

    await user.click(screen.getByRole("button", { name: /^back$/i }));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("delete flow removes the Pokémon after confirmation and navigates", async () => {
    useAppStore.getState().addPokemon(seedPokemon(), FIXED_UUID);
    const user = userEvent.setup();

    render(<EditPokemonPage />);

    expect(useAppStore.getState().pokemonTeam[FIXED_UUID]).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /delete pokémon/i }));

    // Confirmation UI appears
    expect(screen.getByTestId("delete-confirmation")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /yes, delete/i }));

    expect(useAppStore.getState().pokemonTeam[FIXED_UUID]).toBeUndefined();
    expect(mockPush).toHaveBeenCalledWith("/pokemon");
  });

  it("reducing Max HP clamps Current HP immediately in edit form", async () => {
    const base = seedPokemon();
    base.currentHP = 20;
    base.maxHP = 25;
    useAppStore.getState().addPokemon(base, FIXED_UUID);

    render(<EditPokemonPage />);

    const numberInputs = screen.getAllByRole(
      "spinbutton",
    ) as HTMLInputElement[];

    // Input ordering (from shared form):
    // Level, Current HP, Max HP, Current XP, XP to Next, then 6 attributes.
    const currentHpInput = numberInputs[1];
    const maxHpInput = numberInputs[2];

    // Sanity check initial values
    expect(currentHpInput.value).toBe("20");
    expect(maxHpInput.value).toBe("25");

    // Lower max below current HP
    fireEvent.change(maxHpInput, { target: { value: "15" } });

    // Current HP should clamp to 15
    expect(currentHpInput.value).toBe("15");
  });

  it("overlarge Current HP triggers validation and retains previous value", async () => {
    const base = seedPokemon();

    base.currentHP = 20;

    base.maxHP = 25;

    useAppStore.getState().addPokemon(base, FIXED_UUID);

    const user = userEvent.setup();

    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<EditPokemonPage />);

    const numberInputs = screen.getAllByRole(
      "spinbutton",
    ) as HTMLInputElement[];

    const currentHpInput = numberInputs[1]; // Current HP

    // Set Current HP artificially greater than Max HP (25) to provoke validation error

    fireEvent.change(currentHpInput, { target: { value: "999" } });

    expect(currentHpInput.value).toBe("999");

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    // Validation should block save and show alert
    expect(alertSpy).toHaveBeenCalled();
    const stored = useAppStore.getState().pokemonTeam[FIXED_UUID];

    expect(stored.currentHP).toBe(20); // Unchanged (no save performed)
    expect(stored.maxHP).toBe(25);
    alertSpy.mockRestore();
  });
});
