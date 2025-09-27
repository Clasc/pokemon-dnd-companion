import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PokemonCard from ".";
import { useAppStore } from "@/store";
import { Pokemon } from "@/types/pokemon";

// Mock components that are imported
jest.mock("@/components/shared/DeleteConfirmationModal", () => {
  return function MockDeleteConfirmationModal() {
    return <div data-testid="delete-modal">Delete Modal</div>;
  };
});

jest.mock("../PokemonEditModal", () => {
  return function MockPokemonEditModal() {
    return <div data-testid="edit-modal">Edit Modal</div>;
  };
});

jest.mock("../AddAttackModal", () => {
  return function MockAddAttackModal() {
    return <div data-testid="add-attack-modal">Add Attack Modal</div>;
  };
});

jest.mock("../AttackCard", () => {
  return function MockAttackCard() {
    return <div data-testid="attack-card">Attack Card</div>;
  };
});

jest.mock("../HPModifier", () => {
  return function MockHPModifier() {
    return <div data-testid="hp-modifier">HP Modifier</div>;
  };
});

jest.mock("../XPModifier", () => {
  return function MockXPModifier() {
    return <div data-testid="xp-modifier">XP Modifier</div>;
  };
});

jest.mock("@/utils/IconMapper", () => ({
  getPokemonIcon: jest.fn(() => "🔥"),
}));

const createTestPokemon = (): Pokemon => ({
  type: "Pikachu",
  name: "Pikachu",
  type1: "electric",
  type2: undefined,
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
});

describe("PokemonCard", () => {
  const testUuid = "test-uuid";
  let mockPokemon: Pokemon;

  beforeEach(() => {
    // Clear the store state
    useAppStore.setState({
      pokemonTeam: {},
      trainer: null,
    });

    // Create test Pokemon
    mockPokemon = createTestPokemon();

    // Add test Pokemon to store
    useAppStore.setState({
      pokemonTeam: {
        [testUuid]: mockPokemon,
      },
      trainer: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders pokemon information correctly", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText("(Pikachu)")).toBeInTheDocument();
    expect(screen.getByText("Lv.25")).toBeInTheDocument();
    expect(screen.getByText("ELECTRIC")).toBeInTheDocument();
    expect(screen.getByText("60/100")).toBeInTheDocument();
    expect(screen.getByText("1500/2000")).toBeInTheDocument();
  });

  it("renders control buttons including Gain XP button", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    expect(
      screen.getByRole("button", { name: "Modify HP" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gain XP" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Attacks" })).toBeInTheDocument();
  });

  it("shows HP modifier when Modify HP button is clicked", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    const modifyHPButton = screen.getByRole("button", { name: "Modify HP" });
    fireEvent.click(modifyHPButton);

    expect(screen.getByTestId("hp-modifier")).toBeInTheDocument();
  });

  it("shows XP modifier when Gain XP button is clicked", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    const gainXPButton = screen.getByRole("button", { name: "Gain XP" });
    fireEvent.click(gainXPButton);

    expect(screen.getByTestId("xp-modifier")).toBeInTheDocument();
  });

  it("does not show HP modifier initially", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    expect(screen.queryByTestId("hp-modifier")).not.toBeInTheDocument();
  });

  it("does not show XP modifier initially", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    expect(screen.queryByTestId("xp-modifier")).not.toBeInTheDocument();
  });

  it("displays attribute chips with correct modifiers", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    // Check that modifiers are displayed correctly by finding the attribute sections
    expect(screen.getByText("STR").parentElement).toHaveTextContent("+0"); // STR 10 = +0
    expect(screen.getByText("DEX").parentElement).toHaveTextContent("+2"); // DEX 15 = +2
    expect(screen.getByText("CON").parentElement).toHaveTextContent("+1"); // CON 12 = +1
    expect(screen.getByText("INT").parentElement).toHaveTextContent("+2"); // INT 14 = +2
    expect(screen.getByText("WIS").parentElement).toHaveTextContent("+0"); // WIS 11 = +0
    expect(screen.getByText("CHA").parentElement).toHaveTextContent("+1"); // CHA 13 = +1
  });

  it("should calculate modifiers correctly for various attribute scores", () => {
    const pokemonWithVariedStats = {
      ...mockPokemon,
      attributes: {
        strength: 8, // -1
        dexterity: 20, // +5
        constitution: 1, // -5
        intelligence: 30, // +10
        wisdom: 18, // +4
        charisma: 6, // -2
      },
    };

    render(<PokemonCard pokemon={pokemonWithVariedStats} uuid="test-uuid" />);

    expect(screen.getByText("STR").parentElement).toHaveTextContent("-1"); // STR 8 = -1
    expect(screen.getByText("DEX").parentElement).toHaveTextContent("+5"); // DEX 20 = +5
    expect(screen.getByText("CON").parentElement).toHaveTextContent("-5"); // CON 1 = -5
    expect(screen.getByText("INT").parentElement).toHaveTextContent("+10"); // INT 30 = +10
    expect(screen.getByText("WIS").parentElement).toHaveTextContent("+4"); // WIS 18 = +4
    expect(screen.getByText("CHA").parentElement).toHaveTextContent("-2"); // CHA 6 = -2
  });

  it("should handle edge cases for modifier calculation", () => {
    const pokemonWithEdgeCases = {
      ...mockPokemon,
      attributes: {
        strength: 9, // -1
        dexterity: 11, // +0
        constitution: 19, // +4
        intelligence: 21, // +5
        wisdom: 10, // +0
        charisma: 15, // +2
      },
    };

    render(<PokemonCard pokemon={pokemonWithEdgeCases} uuid="test-uuid" />);

    expect(screen.getByText("STR").parentElement).toHaveTextContent("-1"); // STR 9 = -1
    expect(screen.getByText("DEX").parentElement).toHaveTextContent("+0"); // DEX 11 = +0
    expect(screen.getByText("CON").parentElement).toHaveTextContent("+4"); // CON 19 = +4
    expect(screen.getByText("INT").parentElement).toHaveTextContent("+5"); // INT 21 = +5
    expect(screen.getByText("WIS").parentElement).toHaveTextContent("+0"); // WIS 10 = +0
    expect(screen.getByText("CHA").parentElement).toHaveTextContent("+2"); // CHA 15 = +2
  });

  it("displays dual type pokemon correctly", () => {
    const dualTypePokemon = {
      ...mockPokemon,
      type1: "fire" as const,
      type2: "flying" as const,
    };

    render(<PokemonCard pokemon={dualTypePokemon} uuid="test-uuid" />);

    expect(screen.getByText("FIRE")).toBeInTheDocument();
    expect(screen.getByText("FLYING")).toBeInTheDocument();
  });

  it("displays status condition when pokemon has status", () => {
    const statusPokemon = {
      ...mockPokemon,
      primaryStatus: {
        condition: "poisoned" as const,
        duration: 3,
        turnsActive: 0,
      },
    };

    render(<PokemonCard pokemon={statusPokemon} uuid="test-uuid" />);

    expect(screen.getByText("Poisoned")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("does not display status when pokemon is healthy", () => {
    // Healthy Pokemon should have no status fields set
    const healthyPokemon = {
      ...mockPokemon,
      primaryStatus: undefined,
      confusion: undefined,
      temporaryEffects: undefined,
    };

    render(<PokemonCard pokemon={healthyPokemon} uuid="test-uuid" />);

    // Should not display any status indicators
    expect(screen.queryByText("Poisoned")).not.toBeInTheDocument();
    expect(screen.queryByText("Burned")).not.toBeInTheDocument();
    expect(screen.queryByText("Confused")).not.toBeInTheDocument();
  });

  it("toggles attacks section when attacks button is clicked", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    const attacksButton = screen.getByRole("button", { name: "Attacks" });

    // Initially not visible
    expect(screen.queryByText("+ Add Attack")).not.toBeInTheDocument();

    // Click to show
    fireEvent.click(attacksButton);
    expect(screen.getAllByText("+ Add Attack")).toHaveLength(4); // 4 attack slots

    // Click to hide
    fireEvent.click(attacksButton);
    expect(screen.queryByText("+ Add Attack")).not.toBeInTheDocument();
  });

  it("opens action menu when three dots button is clicked", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    const menuButton = screen.getByTitle("Actions");
    fireEvent.click(menuButton);

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("closes action menu when clicking outside", async () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    const menuButton = screen.getByTitle("Actions");
    fireEvent.click(menuButton);

    // Menu should be open
    expect(screen.getByText("Edit")).toBeInTheDocument();

    // Click outside (on document body)
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });
  });

  it("shows edit modal when edit is clicked from menu", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    const menuButton = screen.getByTitle("Actions");
    fireEvent.click(menuButton);

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
  });

  it("shows delete modal when delete is clicked from menu", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    const menuButton = screen.getByTitle("Actions");
    fireEvent.click(menuButton);

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
  });

  it("calculates HP percentage correctly for styling", () => {
    const lowHPPokemon = {
      ...mockPokemon,
      currentHP: 20,
      maxHP: 100,
    };

    render(<PokemonCard pokemon={lowHPPokemon} uuid="test-uuid" />);

    const hpBar = document.querySelector(".h-full.rounded-full.transition-all");
    expect(hpBar).toHaveStyle({ width: "20%" });
  });

  it("calculates XP percentage correctly for styling", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    // XP: 1500, Total: 2000, Percentage: 75%
    const xpBar = document.querySelector(".xp-bar");
    expect(xpBar).toHaveStyle({ width: "75%" });
  });

  it("handles zero max HP gracefully", () => {
    const zeroHPPokemon = {
      ...mockPokemon,
      currentHP: 0,
      maxHP: 0,
    };

    render(<PokemonCard pokemon={zeroHPPokemon} uuid="test-uuid" />);

    expect(screen.getByText("0/0")).toBeInTheDocument();
  });

  it("handles zero experience to next gracefully", () => {
    const zeroXPToNextPokemon = {
      ...mockPokemon,
      experienceToNext: 0,
    };

    render(<PokemonCard pokemon={zeroXPToNextPokemon} uuid="test-uuid" />);

    expect(screen.getByText("1500/1500")).toBeInTheDocument();
  });

  it("displays attacks when pokemon has attacks", () => {
    const pokemonWithAttacks = {
      ...mockPokemon,
      attacks: [
        {
          name: "Thunderbolt",
          currentPp: 5,
          maxPp: 10,
          actionType: "action" as const,
          moveBonus: 3,
          description: "Electric attack",
        },
      ],
    };

    render(<PokemonCard pokemon={pokemonWithAttacks} uuid="test-uuid" />);

    const attacksButton = screen.getByRole("button", { name: "Attacks" });
    fireEvent.click(attacksButton);

    expect(screen.getByTestId("attack-card")).toBeInTheDocument();
    expect(screen.getAllByText("+ Add Attack")).toHaveLength(3); // 3 remaining slots
  });

  it("shows add attack modal when empty attack slot is clicked", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    const attacksButton = screen.getByRole("button", { name: "Attacks" });
    fireEvent.click(attacksButton);

    const addAttackSlot = screen.getAllByText("+ Add Attack")[0];
    fireEvent.click(addAttackSlot);

    expect(screen.getByTestId("add-attack-modal")).toBeInTheDocument();
  });
});
