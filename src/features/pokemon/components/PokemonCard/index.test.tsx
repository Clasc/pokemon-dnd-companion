import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
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

jest.mock("../StatusIndicator", () => {
  return function MockStatusIndicator() {
    return <div data-testid="status-indicator">Status Indicator</div>;
  };
});

jest.mock("../StatusSelector", () => {
  return function MockStatusSelector() {
    return <div data-testid="status-selector">Status Selector</div>;
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
    });

    // Mock getBoundingClientRect for drag tests
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 200,
      height: 20,
      top: 0,
      left: 0,
      bottom: 20,
      right: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
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

  it("renders inline HP control buttons", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    expect(screen.getByTitle("Decrease HP")).toBeInTheDocument();
    expect(screen.getByTitle("Decrease HP by 5")).toBeInTheDocument();
    expect(screen.getByTitle("Increase HP")).toBeInTheDocument();
    expect(screen.getByTitle("Increase HP by 5")).toBeInTheDocument();
  });

  it("renders inline XP control buttons", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    expect(screen.getByTitle("Gain 10 XP")).toBeInTheDocument();
    expect(screen.getByTitle("Gain 50 XP")).toBeInTheDocument();
    expect(screen.getByTitle("Gain 100 XP")).toBeInTheDocument();
  });

  it("modifies HP when inline buttons are clicked", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    const increaseHPButton = screen.getByTitle("Increase HP");
    fireEvent.click(increaseHPButton);

    const state = useAppStore.getState();
    expect(state.pokemonTeam[testUuid]?.currentHP).toBe(61);
  });

  it("prevents HP from going below 0", () => {
    const lowHPPokemon = { ...mockPokemon, currentHP: 1 };
    useAppStore.setState({
      pokemonTeam: {
        [testUuid]: lowHPPokemon,
      },
    });

    render(<PokemonCard pokemon={lowHPPokemon} uuid="test-uuid" />);

    const decreaseHP5Button = screen.getByTitle("Decrease HP by 5");
    fireEvent.click(decreaseHP5Button);

    const state = useAppStore.getState();
    expect(state.pokemonTeam[testUuid]?.currentHP).toBe(0);
  });

  it("prevents HP from going above max HP", () => {
    const highHPPokemon = { ...mockPokemon, currentHP: 98 };
    useAppStore.setState({
      pokemonTeam: {
        [testUuid]: highHPPokemon,
      },
    });

    render(<PokemonCard pokemon={highHPPokemon} uuid="test-uuid" />);

    const increaseHP5Button = screen.getByTitle("Increase HP by 5");
    fireEvent.click(increaseHP5Button);

    const state = useAppStore.getState();
    expect(state.pokemonTeam[testUuid]?.currentHP).toBe(100);
  });

  it("gains XP when inline buttons are clicked", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    const gainXP50Button = screen.getByTitle("Gain 50 XP");
    fireEvent.click(gainXP50Button);

    const state = useAppStore.getState();
    expect(state.pokemonTeam[testUuid]?.experience).toBe(1550);
  });

  it("opens status selector when status is clicked", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    const statusIndicator = screen.getByTestId("status-indicator");
    fireEvent.click(statusIndicator);

    expect(screen.getByTestId("status-selector")).toBeInTheDocument();
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

    expect(screen.getByTestId("status-indicator")).toBeInTheDocument();
  });

  it("shows add first attack button when pokemon has no attacks", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    expect(screen.getByText("+ Add First Attack")).toBeInTheDocument();
  });

  it("shows attack chips when pokemon has attacks", () => {
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
        {
          name: "Quick Attack",
          currentPp: 8,
          maxPp: 15,
          actionType: "action" as const,
          moveBonus: 2,
          description: "Quick move",
        },
      ],
    };

    render(<PokemonCard pokemon={pokemonWithAttacks} uuid="test-uuid" />);

    expect(screen.getByText("Thunderbolt")).toBeInTheDocument();
    expect(screen.getByText("5/10")).toBeInTheDocument();
    expect(screen.getByText("Quick Attack")).toBeInTheDocument();
    expect(screen.getByText("8/15")).toBeInTheDocument();
    expect(screen.getByText("+ Attack")).toBeInTheDocument();
  });

  it("shows manage attacks when pokemon has attacks", () => {
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

    expect(screen.getByText("Attacks")).toBeInTheDocument();
    expect(screen.getByText("Manage")).toBeInTheDocument();
  });

  it("toggles attack management section when manage is clicked", () => {
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

    const manageButton = screen.getByText("Manage");

    // Initially expanded section should not be visible
    expect(screen.queryByTestId("attack-card")).not.toBeInTheDocument();

    // Click to show
    fireEvent.click(manageButton);
    expect(screen.getByTestId("attack-card")).toBeInTheDocument();

    // Click to hide
    fireEvent.click(screen.getByText("Hide"));
    expect(screen.queryByTestId("attack-card")).not.toBeInTheDocument();
  });

  it("opens add attack modal when add attack chip is clicked", () => {
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

    const addAttackButton = screen.getByText("+ Attack");
    fireEvent.click(addAttackButton);

    expect(screen.getByTestId("add-attack-modal")).toBeInTheDocument();
  });

  it("opens add attack modal when add first attack is clicked", () => {
    render(<PokemonCard pokemon={mockPokemon} uuid="test-uuid" />);

    const addFirstAttackButton = screen.getByText("+ Add First Attack");
    fireEvent.click(addFirstAttackButton);

    expect(screen.getByTestId("add-attack-modal")).toBeInTheDocument();
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
    // Find the XP progress bar by looking for the second DraggableProgressBar's progress bar fill
    const progressBars = document.querySelectorAll('[role="progressbar"]');
    const xpBar = progressBars[1]; // Second progress bar is XP
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

  it("handles pokemon with undefined type1 gracefully", () => {
    const pokemonWithUndefinedType = {
      ...mockPokemon,
      type1: undefined,
      type2: undefined,
    };

    render(<PokemonCard pokemon={pokemonWithUndefinedType} uuid="test-uuid" />);

    // Should render without crashing
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText("(Pikachu)")).toBeInTheDocument();
    expect(screen.getByText("Lv.25")).toBeInTheDocument();

    // Should show fallback icon when type1 is undefined
    expect(screen.getByText("❓")).toBeInTheDocument();

    // Should not show any type badges
    expect(screen.queryByText("ELECTRIC")).not.toBeInTheDocument();
  });
});
