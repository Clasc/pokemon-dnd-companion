import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import HPModifier from ".";
import { useAppStore } from "@/store";
import { Pokemon } from "@/types/pokemon";

// Mock the Zustand store
jest.mock("@/store", () => ({
  useAppStore: {
    use: {
      modifyPokemonHP: jest.fn(),
      pokemonTeam: jest.fn(),
    },
  },
}));

describe("HPModifier", () => {
  const mockModifyPokemonHP = jest.fn();
  const mockOnClose = jest.fn();

  const mockPokemon = {
    name: "Pikachu",
    type: "Pikachu",
    type1: "electric",
    type2: "bug",
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
  } as Pokemon;

  const setupMockStore = (
    pokemonTeam: Record<string, Pokemon> = { "test-uuid": mockPokemon },
  ) => {
    (useAppStore.use.modifyPokemonHP as jest.Mock).mockReturnValue(
      mockModifyPokemonHP,
    );
    (useAppStore.use.pokemonTeam as jest.Mock).mockReturnValue(pokemonTeam);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockStore();
  });

  it("renders with pokemon information", () => {
    render(<HPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    expect(screen.getByText("Modify HP")).toBeInTheDocument();
    expect(screen.getByText("Pikachu - 60/100 HP")).toBeInTheDocument();
    expect(screen.getByLabelText("HP Amount")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Heal Mode" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Damage Mode" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("starts with heal mode selected by default", () => {
    render(<HPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const healButton = screen.getByRole("button", { name: "Heal Mode" });
    const damageButton = screen.getByRole("button", { name: "Damage Mode" });

    expect(healButton).toHaveClass("bg-green-500/80");
    expect(damageButton).not.toHaveClass("bg-red-500/80");
  });

  it("switches to damage mode when damage button is clicked", () => {
    render(<HPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const damageButton = screen.getByRole("button", { name: "Damage Mode" });
    fireEvent.click(damageButton);

    expect(damageButton).toHaveClass("bg-red-500/80");
    expect(screen.getByRole("button", { name: "Heal Mode" })).not.toHaveClass(
      "bg-green-500/80",
    );
  });

  it("sets correct max value for heal mode", () => {
    render(<HPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("HP Amount") as HTMLInputElement;
    // Max HP (100) - Current HP (60) = 40
    expect(input.max).toBe("40");
  });

  it("sets correct max value for damage mode", () => {
    render(<HPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const damageButton = screen.getByRole("button", { name: "Damage Mode" });
    fireEvent.click(damageButton);

    const input = screen.getByLabelText("HP Amount") as HTMLInputElement;
    // Current HP (60)
    expect(input.max).toBe("60");
  });

  it("calls modifyPokemonHP with positive value when healing", () => {
    render(<HPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("HP Amount");
    const submitButton = screen.getByRole("button", { name: "Heal" });

    fireEvent.change(input, { target: { value: "20" } });
    fireEvent.click(submitButton);

    expect(mockModifyPokemonHP).toHaveBeenCalledWith("test-uuid", 20);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls modifyPokemonHP with negative value when damaging", () => {
    render(<HPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("HP Amount");
    const damageButton = screen.getByRole("button", { name: "Damage Mode" });

    fireEvent.click(damageButton);
    fireEvent.change(input, { target: { value: "15" } });

    const submitButton = screen.getByRole("button", { name: "Damage" });
    fireEvent.click(submitButton);

    expect(mockModifyPokemonHP).toHaveBeenCalledWith("test-uuid", -15);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("closes without modifying HP when input is empty", () => {
    render(<HPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const submitButton = screen.getByRole("button", { name: "Heal" });
    fireEvent.click(submitButton);

    expect(mockModifyPokemonHP).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("closes when cancel button is clicked", () => {
    render(<HPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("closes when backdrop is clicked", () => {
    render(<HPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);
    const backdrop = screen.getByTestId("hp-modifier-backdrop");
    // ModalShell triggers close on mouse down (and click). Use mouseDown to mirror the internal handler.
    fireEvent.mouseDown(backdrop);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("closes when escape key is pressed", async () => {
    render(<HPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("focuses input on mount", () => {
    render(<HPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("HP Amount");
    expect(input).toHaveFocus();
  });

  it("returns null when pokemon is not found", () => {
    setupMockStore({});

    const { container } = render(
      <HPModifier pokemonUuid="nonexistent-uuid" onClose={mockOnClose} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("handles form submission correctly", () => {
    render(<HPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("HP Amount");
    const submitButton = screen.getByRole("button", { name: "Heal" });

    fireEvent.change(input, { target: { value: "25" } });
    fireEvent.click(submitButton);

    expect(mockModifyPokemonHP).toHaveBeenCalledWith("test-uuid", 25);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
