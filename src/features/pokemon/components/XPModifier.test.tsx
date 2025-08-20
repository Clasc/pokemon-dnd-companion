import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import XPModifier from "./XPModifier";
import { useAppStore } from "@/store";

// Mock the Zustand store
jest.mock("@/store", () => ({
  useAppStore: {
    use: {
      gainExperience: jest.fn(),
      pokemonTeam: jest.fn(),
    },
  },
}));

describe("XPModifier", () => {
  const mockGainExperience = jest.fn();
  const mockOnClose = jest.fn();

  const mockPokemon = {
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

  const setupMockStore = (pokemonTeam = { "test-uuid": mockPokemon }) => {
    (useAppStore.use.gainExperience as jest.Mock).mockReturnValue(
      mockGainExperience,
    );
    (useAppStore.use.pokemonTeam as jest.Mock).mockReturnValue(pokemonTeam);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockStore();
  });

  it("renders with pokemon information", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    expect(screen.getByText("Gain Experience")).toBeInTheDocument();
    expect(screen.getByText("Pikachu - Level 25")).toBeInTheDocument();
    expect(screen.getByText("1500/2000 XP")).toBeInTheDocument();
    expect(screen.getByLabelText("Experience Points")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gain XP" })).toBeInTheDocument();
  });

  it("displays level up message when XP gain exceeds experienceToNext", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("Experience Points");
    fireEvent.change(input, { target: { value: "600" } });

    expect(
      screen.getByText("🎉 Will level up to Level 26!"),
    ).toBeInTheDocument();
  });

  it("does not display level up message when XP gain is less than experienceToNext", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("Experience Points");
    fireEvent.change(input, { target: { value: "300" } });

    expect(screen.queryByText(/Will level up/)).not.toBeInTheDocument();
  });

  it("calls gainExperience with correct values when form is submitted", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("Experience Points");
    const submitButton = screen.getByRole("button", { name: "Gain XP" });

    fireEvent.change(input, { target: { value: "250" } });
    fireEvent.click(submitButton);

    expect(mockGainExperience).toHaveBeenCalledWith("test-uuid", 250);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("closes without gaining XP when input is empty", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const submitButton = screen.getByRole("button", { name: "Gain XP" });
    fireEvent.click(submitButton);

    expect(mockGainExperience).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("closes without gaining XP when input is zero", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("Experience Points");

    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.submit(input.closest("form")!);

    expect(mockGainExperience).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("closes without gaining XP when input is negative", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("Experience Points");

    fireEvent.change(input, { target: { value: "-50" } });
    fireEvent.submit(input.closest("form")!);

    expect(mockGainExperience).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("closes when cancel button is clicked", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("closes when backdrop is clicked", () => {
    const { container } = render(
      <XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />,
    );

    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("closes when escape key is pressed", async () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("focuses input on mount", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("Experience Points");
    expect(input).toHaveFocus();
  });

  it("returns null when pokemon is not found", () => {
    setupMockStore({});

    const { container } = render(
      <XPModifier pokemonUuid="nonexistent-uuid" onClose={mockOnClose} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("handles form submission via Enter key", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("Experience Points");
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.submit(input.closest("form")!);

    expect(mockGainExperience).toHaveBeenCalledWith("test-uuid", 100);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("handles large XP values correctly", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("Experience Points");
    const submitButton = screen.getByRole("button", { name: "Gain XP" });

    fireEvent.change(input, { target: { value: "9999" } });
    fireEvent.click(submitButton);

    expect(mockGainExperience).toHaveBeenCalledWith("test-uuid", 9999);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows level up message for exact experienceToNext value", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("Experience Points");
    fireEvent.change(input, { target: { value: "500" } });

    expect(
      screen.getByText("🎉 Will level up to Level 26!"),
    ).toBeInTheDocument();
  });

  it("updates level up message when input changes", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("Experience Points");

    // First, enter enough XP to level up
    fireEvent.change(input, { target: { value: "600" } });
    expect(
      screen.getByText("🎉 Will level up to Level 26!"),
    ).toBeInTheDocument();

    // Then, reduce XP below level up threshold
    fireEvent.change(input, { target: { value: "100" } });
    expect(screen.queryByText(/Will level up/)).not.toBeInTheDocument();

    // Then, increase XP above level up threshold again
    fireEvent.change(input, { target: { value: "800" } });
    expect(
      screen.getByText("🎉 Will level up to Level 26!"),
    ).toBeInTheDocument();
  });

  it("has correct input attributes", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText(
      "Experience Points",
    ) as HTMLInputElement;

    expect(input.type).toBe("number");
    expect(input.min).toBe("1");
    expect(input.placeholder).toBe("Enter XP amount");
  });

  it("handles invalid input gracefully", () => {
    render(<XPModifier pokemonUuid="test-uuid" onClose={mockOnClose} />);

    const input = screen.getByLabelText("Experience Points");
    const submitButton = screen.getByRole("button", { name: "Gain XP" });

    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.click(submitButton);

    expect(mockGainExperience).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
