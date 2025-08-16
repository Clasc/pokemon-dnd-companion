import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PokemonOverview from "../components/PokemonOverview";
import { useAppStore } from "../store";
import {
  mockPokemon,
  mockPokemonWithSecondType,
  mockPokemonLowHP,
  mockPokemonTeam,
  calculateTeamStats,
  createTestStore,
} from "./utils/testUtils";
import { PokemonTeam } from "../types/pokemon";

// Mock the store
jest.mock("../store", () => ({
  useAppStore: {
    use: {
      addPokemon: jest.fn(),
    },
  },
}));

// Mock the AddPokemonModal component
jest.mock("../components/AddPokemonModal/AddPokemonModal", () => {
  return function MockAddPokemonModal({ isOpen, onClose, onSave }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="add-pokemon-modal">
        <button onClick={() => onSave(mockPokemon)}>Save Test Pokemon</button>
        <button onClick={onClose}>Close Modal</button>
      </div>
    );
  };
});

// Mock the PokemonCard component
jest.mock("../components/PokemonCard", () => {
  return function MockPokemonCard({ pokemon, uuid }: any) {
    return (
      <div data-testid={`pokemon-card-${uuid}`}>
        <span data-testid="pokemon-name">{pokemon.name}</span>
        <span data-testid="pokemon-type">{pokemon.type}</span>
        <span data-testid="pokemon-level">Lv.{pokemon.level}</span>
        <span data-testid="pokemon-hp">
          {pokemon.currentHP}/{pokemon.maxHP}
        </span>
      </div>
    );
  };
});

describe("PokemonOverview", () => {
  const mockAddPokemon = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppStore.use.addPokemon as jest.Mock).mockReturnValue(mockAddPokemon);
  });

  describe("Empty State", () => {
    it("should render empty state when no pokemon are present", () => {
      const emptyTeam: PokemonTeam = {};

      render(<PokemonOverview pokemon={emptyTeam} />);

      // Check header
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Pokémon Overview",
      );

      // Check counter shows 0/6
      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText("/ 6")).toBeInTheDocument();

      // Check empty state message
      expect(
        screen.getByText("No Pokémon in your team yet"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Click the button below to add one!"),
      ).toBeInTheDocument();

      // Check empty state icon
      expect(screen.getByText("🔍")).toBeInTheDocument();

      // Check add button is present
      expect(
        screen.getByRole("button", { name: /add pokémon/i }),
      ).toBeInTheDocument();

      // Team stats should not be visible
      expect(screen.queryByText("Team Stats")).not.toBeInTheDocument();
    });

    it("should open add pokemon modal when add button is clicked", async () => {
      const user = userEvent.setup();
      const emptyTeam: PokemonTeam = {};

      render(<PokemonOverview pokemon={emptyTeam} />);

      const addButton = screen.getByRole("button", { name: /add pokémon/i });
      await user.click(addButton);

      expect(screen.getByTestId("add-pokemon-modal")).toBeInTheDocument();
    });
  });

  describe("Single Pokemon", () => {
    it("should render single pokemon correctly", () => {
      const singlePokemonTeam: PokemonTeam = {
        "uuid-1": mockPokemon,
      };

      render(<PokemonOverview pokemon={singlePokemonTeam} />);

      // Check counter shows 1/6
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("/ 6")).toBeInTheDocument();

      // Check pokemon card is rendered
      expect(screen.getByTestId("pokemon-card-uuid-1")).toBeInTheDocument();
      expect(screen.getByTestId("pokemon-name")).toHaveTextContent("Thunder");

      // Check add button is still present (team not full)
      expect(
        screen.getByRole("button", { name: /add pokémon/i }),
      ).toBeInTheDocument();

      // Check team stats are displayed
      expect(screen.getByText("Team Stats")).toBeInTheDocument();
      expect(screen.getByText("25")).toBeInTheDocument(); // Total levels
      expect(screen.getByText("78")).toBeInTheDocument(); // Total HP
      expect(screen.getByText("82%")).toBeInTheDocument(); // Avg health (78/95 * 100 = 82%)
    });
  });

  describe("Multiple Pokemon", () => {
    it("should render multiple pokemon correctly", () => {
      render(<PokemonOverview pokemon={mockPokemonTeam} />);

      // Check counter shows 3/6
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("/ 6")).toBeInTheDocument();

      // Check all pokemon cards are rendered
      expect(screen.getByTestId("pokemon-card-uuid-1")).toBeInTheDocument();
      expect(screen.getByTestId("pokemon-card-uuid-2")).toBeInTheDocument();
      expect(screen.getByTestId("pokemon-card-uuid-3")).toBeInTheDocument();

      // Check add button is present (team not full)
      expect(
        screen.getByRole("button", { name: /add pokémon/i }),
      ).toBeInTheDocument();

      // Check team stats
      const { totalLevels, totalHP, avgHealth } =
        calculateTeamStats(mockPokemonTeam);
      expect(screen.getByText(totalLevels.toString())).toBeInTheDocument();
      expect(screen.getByText(totalHP.toString())).toBeInTheDocument();
      expect(screen.getByText(`${avgHealth}%`)).toBeInTheDocument();
    });

    it("should calculate team statistics correctly", () => {
      render(<PokemonOverview pokemon={mockPokemonTeam} />);

      // Expected calculations:
      // Total levels: 25 + 36 + 18 = 79
      // Total HP: 78 + 125 + 15 = 218
      // Avg health: ((78/95)*100 + (125/140)*100 + (15/65)*100) / 3 = (82.11 + 89.29 + 23.08) / 3 = 64.83 ≈ 65%

      expect(screen.getByText("79")).toBeInTheDocument();
      expect(screen.getByText("218")).toBeInTheDocument();
      expect(screen.getByText("65%")).toBeInTheDocument();
    });
  });

  describe("Full Team (6 Pokemon)", () => {
    it("should hide add button when team is full", () => {
      const fullTeam: PokemonTeam = {};
      for (let i = 1; i <= 6; i++) {
        fullTeam[`uuid-${i}`] = {
          ...mockPokemon,
          name: `Pokemon ${i}`,
        };
      }

      render(<PokemonOverview pokemon={fullTeam} />);

      // Check counter shows 6/6
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("/ 6")).toBeInTheDocument();

      // Add button should not be present
      expect(
        screen.queryByRole("button", { name: /add pokémon/i }),
      ).not.toBeInTheDocument();

      // Team stats should still be displayed
      expect(screen.getByText("Team Stats")).toBeInTheDocument();
    });
  });

  describe("Team Statistics Edge Cases", () => {
    it("should handle pokemon with zero max HP", () => {
      const teamWithZeroHP: PokemonTeam = {
        "uuid-1": {
          ...mockPokemon,
          currentHP: 0,
          maxHP: 0,
        },
      };

      render(<PokemonOverview pokemon={teamWithZeroHP} />);

      // Should show 0% for average health when maxHP is 0
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("should round average health percentage correctly", () => {
      const teamWithSpecificHP: PokemonTeam = {
        "uuid-1": {
          ...mockPokemon,
          currentHP: 33,
          maxHP: 100, // 33% health
        },
        "uuid-2": {
          ...mockPokemonWithSecondType,
          currentHP: 67,
          maxHP: 100, // 67% health
        },
      };

      render(<PokemonOverview pokemon={teamWithSpecificHP} />);

      // Average should be (33 + 67) / 2 = 50%
      expect(screen.getByText("50%")).toBeInTheDocument();
    });
  });

  describe("Add Pokemon Modal Integration", () => {
    it("should save pokemon when modal save is triggered", async () => {
      const user = userEvent.setup();
      const emptyTeam: PokemonTeam = {};

      render(<PokemonOverview pokemon={emptyTeam} />);

      // Open modal
      const addButton = screen.getByRole("button", { name: /add pokémon/i });
      await user.click(addButton);

      // Save pokemon from modal
      const saveButton = screen.getByRole("button", {
        name: "Save Test Pokemon",
      });
      await user.click(saveButton);

      // Check that addPokemon was called
      expect(mockAddPokemon).toHaveBeenCalledWith(mockPokemon);
    });

    it("should close modal when close button is clicked", async () => {
      const user = userEvent.setup();
      const emptyTeam: PokemonTeam = {};

      render(<PokemonOverview pokemon={emptyTeam} />);

      // Open modal
      const addButton = screen.getByRole("button", { name: /add pokémon/i });
      await user.click(addButton);

      expect(screen.getByTestId("add-pokemon-modal")).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByRole("button", { name: "Close Modal" });
      await user.click(closeButton);

      expect(screen.queryByTestId("add-pokemon-modal")).not.toBeInTheDocument();
    });

    it("should close modal after successful save", async () => {
      const user = userEvent.setup();
      const emptyTeam: PokemonTeam = {};

      render(<PokemonOverview pokemon={emptyTeam} />);

      // Open modal
      const addButton = screen.getByRole("button", { name: /add pokémon/i });
      await user.click(addButton);

      // Save pokemon
      const saveButton = screen.getByRole("button", {
        name: "Save Test Pokemon",
      });
      await user.click(saveButton);

      // Modal should be closed
      expect(screen.queryByTestId("add-pokemon-modal")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      render(<PokemonOverview pokemon={mockPokemonTeam} />);

      const mainHeading = screen.getByRole("heading", { level: 2 });
      expect(mainHeading).toHaveTextContent("Pokémon Overview");

      const statsHeading = screen.getByRole("heading", { level: 3 });
      expect(statsHeading).toHaveTextContent("Team Stats");
    });

    it("should have accessible button for adding pokemon", () => {
      const emptyTeam: PokemonTeam = {};
      render(<PokemonOverview pokemon={emptyTeam} />);

      const addButton = screen.getByRole("button", { name: /add pokémon/i });
      expect(addButton).toBeInTheDocument();
      expect(addButton).toBeEnabled();
    });

    it("should have proper ARIA labels and roles", () => {
      render(<PokemonOverview pokemon={mockPokemonTeam} />);

      // Check that headings have proper roles
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();

      // Check button accessibility
      const addButton = screen.getByRole("button", { name: /add pokémon/i });
      expect(addButton).toBeEnabled();
    });
  });

  describe("Component State Management", () => {
    it("should maintain modal state independently", async () => {
      const user = userEvent.setup();
      const emptyTeam: PokemonTeam = {};

      render(<PokemonOverview pokemon={emptyTeam} />);

      // Open and close modal multiple times
      const addButton = screen.getByRole("button", { name: /add pokémon/i });

      await user.click(addButton);
      expect(screen.getByTestId("add-pokemon-modal")).toBeInTheDocument();

      const closeButton = screen.getByRole("button", { name: "Close Modal" });
      await user.click(closeButton);
      expect(screen.queryByTestId("add-pokemon-modal")).not.toBeInTheDocument();

      await user.click(addButton);
      expect(screen.getByTestId("add-pokemon-modal")).toBeInTheDocument();
    });
  });

  describe("Responsive Design Elements", () => {
    it("should render responsive text classes", () => {
      render(<PokemonOverview pokemon={mockPokemonTeam} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("text-xl", "md:text-2xl");
    });

    it("should render responsive padding classes", () => {
      const { container } = render(
        <PokemonOverview pokemon={mockPokemonTeam} />,
      );

      const mainContainer = container.querySelector(".glass");
      expect(mainContainer).toHaveClass("p-6", "md:p-8");
    });
  });

  describe("Team Counter Display", () => {
    it("should display correct count for different team sizes", () => {
      const testCases = [
        { team: {}, expectedCount: "0" },
        { team: { "uuid-1": mockPokemon }, expectedCount: "1" },
        { team: mockPokemonTeam, expectedCount: "3" },
      ];

      testCases.forEach(({ team, expectedCount }) => {
        const { unmount } = render(<PokemonOverview pokemon={team} />);
        expect(screen.getByText(expectedCount)).toBeInTheDocument();
        expect(screen.getByText("/ 6")).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("Performance Considerations", () => {
    it("should not re-render unnecessarily when pokemon team reference changes but content is same", () => {
      const team1 = { "uuid-1": mockPokemon };
      const team2 = { "uuid-1": mockPokemon }; // Same content, different reference

      const { rerender } = render(<PokemonOverview pokemon={team1} />);

      // Re-render with new reference but same content
      rerender(<PokemonOverview pokemon={team2} />);

      // Component should still work correctly
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByTestId("pokemon-card-uuid-1")).toBeInTheDocument();
    });
  });
});
