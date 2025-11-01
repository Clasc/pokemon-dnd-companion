import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewPokemonPage from "./page";
import { useAppStore } from "@/store";

/**
 * Route Page Test: /pokemon/new
 *
 * This test suite validates the behavior of the new route-based Pokémon creation page.
 * It replaces former modal-focused tests. It uses the real Zustand store (per project rules)
 * and only mocks Next.js routing.
 */

type MockRouter = { push: jest.Mock; back: jest.Mock };

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: (): MockRouter => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// A deterministic, structurally valid UUID (version 4 style) for stable assertions.
const FIXED_UUID = "00000000-0000-4000-8000-000000000000" as const;

// Capture original crypto so it can be restored.
const originalCrypto = globalThis.crypto;

beforeAll(() => {
  // Patch randomUUID only; retain other crypto methods if present.
  const patched: Crypto = {
    ...originalCrypto,
    randomUUID: () => FIXED_UUID,
  };
  // Redefine global crypto (Node/JSDOM test environment mutation).
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

type StoreState = ReturnType<typeof useAppStore.getState>;
const getStoreState = (): StoreState => useAppStore.getState();

const clearPokemonTeam = (): void => {
  const state = getStoreState();
  if (typeof (state as { reset?: () => void }).reset === "function") {
    (state as { reset: () => void }).reset();
    return;
  }
  if (state.pokemonTeam) {
    Object.keys(state.pokemonTeam).forEach((id) => {
      // Assigning undefined (instead of delete) to avoid lint dynamic-delete issues if present.
      (state.pokemonTeam as Record<string, unknown>)[id] =
        undefined as unknown as never;
      delete (state.pokemonTeam as Record<string, unknown>)[id];
    });
  }
};

describe("NewPokemonPage (route-based creation flow)", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    clearPokemonTeam();
    jest.clearAllMocks();
  });

  it("renders the heading and primary action buttons", () => {
    render(<NewPokemonPage />);

    expect(
      screen.getByRole("heading", { name: /add pokémon/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /save pokémon/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows validation alert when required fields are empty", async () => {
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<NewPokemonPage />);

    await user.click(screen.getByRole("button", { name: /save pokémon/i }));

    expect(alertSpy).toHaveBeenCalledTimes(1);
    const message = String(alertSpy.mock.calls[0]?.[0] ?? "");
    expect(message).toMatch(/nickname is required/i);
    expect(message).toMatch(/species is required/i);

    alertSpy.mockRestore();
  });

  it("creates a new Pokémon and navigates to overview on successful save", async () => {
    const user = userEvent.setup();
    render(<NewPokemonPage />);

    const speciesInput = screen.getByTestId(
      "species-input",
    ) as HTMLInputElement;
    const nicknameInput = screen.getByTestId(
      "nickname-input",
    ) as HTMLInputElement;

    await user.type(speciesInput, "Pikachu");
    await user.type(nicknameInput, "Sparky");

    const stateBefore = getStoreState();
    expect(stateBefore.pokemonTeam?.[FIXED_UUID]).toBeUndefined();

    await user.click(screen.getByRole("button", { name: /save pokémon/i }));
    expect(mockPush).toHaveBeenCalledWith("/pokemon");

    const stateAfter = getStoreState();
    const created = stateAfter.pokemonTeam?.[FIXED_UUID] as
      | { name: string; type: string; currentHP: number; maxHP: number }
      | undefined;

    expect(created).toBeTruthy();
    if (created) {
      expect(created.name).toBe("Sparky");
      expect(created.type).toBe("Pikachu");
      expect(created.currentHP).toBeLessThanOrEqual(created.maxHP);
    }
  });

  it("Back button invokes router.back()", async () => {
    const user = userEvent.setup();
    render(<NewPokemonPage />);

    await user.click(screen.getByRole("button", { name: /back/i }));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("Cancel button invokes router.back()", async () => {
    const user = userEvent.setup();
    render(<NewPokemonPage />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("does not create a Pokémon when validation fails (missing species & nickname)", async () => {
    const user = userEvent.setup();

    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<NewPokemonPage />);

    // Intentionally DO NOT fill species or nickname to trigger validation failure.
    // Manipulate some numeric fields to ensure they do not accidentally satisfy validation logic.
    const numberInputs = screen.getAllByRole(
      "spinbutton",
    ) as HTMLInputElement[];

    // Order: level, current HP, max HP, current XP, XP to next ...
    const currentHpInput = numberInputs[1];

    const maxHpInput = numberInputs[2];

    fireEvent.change(maxHpInput, { target: { value: "25" } });

    fireEvent.change(currentHpInput, { target: { value: "999" } });

    await user.click(screen.getByRole("button", { name: /save pokémon/i }));

    // Expect validation alert (no creation)
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();

    const stateAfter = getStoreState();

    const created = stateAfter.pokemonTeam?.[FIXED_UUID];
    expect(created).toBeUndefined();
  });
});
