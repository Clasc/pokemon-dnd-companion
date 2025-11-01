/**
 * PokemonOverview Component Tests (Route-Based Flows)
 *
 * This suite validates:
 * - Empty state rendering
 * - Single and multiple Pokémon rendering
 * - Team statistics aggregation
 * - Capacity (6 Pokémon) behavior
 * - Edge cases in health percentage calculations
 * - Accessibility / structural expectations
 * - Responsive utility class presence (basic smoke)
 *
 * Adaptations for route-based flows:
 * - Add Pokémon action is now a <Link href="/pokemon/new"> (not a button)
 * - Edit flow moved to /pokemon/[uuid]/edit (not covered directly here)
 *
 * NOTE:
 * We mock next/navigation's useRouter so nested PokemonCard components
 * (which call useRouter for edit navigation) do not trigger the Next.js
 * app router invariant inside the test environment.
 */

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
}));

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import PokemonOverview from ".";
import {
  calculateTeamStats,
  mockPokemon,
  mockPokemonTeam,
  mockPokemonWithSecondType,
} from "@/tests/utils/testUtils";

describe("PokemonOverview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Empty State", () => {
    it("renders empty state when no pokemon are present", () => {
      const emptyTeam = {};

      render(<PokemonOverview pokemon={emptyTeam} disableCards />);

      // Heading
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Pokémon Overview",
      );

      // Counter 0/6
      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText("/ 6")).toBeInTheDocument();

      // Empty copy + icon
      expect(
        screen.getByText("No Pokémon in your team yet"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Click the button below to add one!"),
      ).toBeInTheDocument();
      expect(screen.getByText("🔍")).toBeInTheDocument();

      // Add link
      const addLink = screen.getByRole("link", { name: /add pokémon/i });
      expect(addLink).toBeInTheDocument();
      expect(addLink).toHaveAttribute("href", "/pokemon/new");

      // No stats section yet
      expect(screen.queryByText("Team Stats")).not.toBeInTheDocument();
    });
  });

  describe("Single Pokemon", () => {
    it("renders single pokemon correctly including stats", () => {
      const team = { "uuid-1": mockPokemon };

      render(<PokemonOverview pokemon={team} disableCards />);

      // Counter 1/6
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("/ 6")).toBeInTheDocument();

      // Card heading / placeholder text (name may have surrounding characters in placeholder mode)
      expect(screen.getByText(new RegExp(mockPokemon.name))).toBeVisible();

      // Add link still present
      expect(screen.getByRole("link", { name: /add pokémon/i })).toBeVisible();

      // Team stats block
      expect(screen.getByText("Team Stats")).toBeInTheDocument();

      // Expected numbers derived from mockPokemon fixture
      expect(screen.getByText("25")).toBeInTheDocument(); // Total levels
      expect(screen.getByText("78")).toBeInTheDocument(); // Total HP (current)
      expect(screen.getByText("82%")).toBeInTheDocument(); // Avg health %
    });
  });

  describe("Multiple Pokemon", () => {
    it("renders multiple pokemon and aggregate stats", () => {
      render(<PokemonOverview pokemon={mockPokemonTeam} disableCards />);

      // Counter 3/6
      expect(screen.getAllByText("3").length).toBeGreaterThan(0);
      expect(screen.getByText("/ 6")).toBeInTheDocument();

      expect(screen.getByText(/Thunder/)).toBeVisible();
      expect(screen.getByText(/Eve/)).toBeVisible();

      expect(screen.getByText(/Blaze/)).toBeVisible();

      // Add link still (team not full)
      expect(screen.getByRole("link", { name: /add pokémon/i })).toBeVisible();

      // Stats verified via helper to avoid duplicating logic
      const { totalLevels, totalHP, avgHealth } =
        calculateTeamStats(mockPokemonTeam);
      expect(screen.getByText(String(totalLevels))).toBeInTheDocument();
      expect(screen.getByText(String(totalHP))).toBeInTheDocument();
      expect(screen.getByText(`${avgHealth}%`)).toBeInTheDocument();
    });

    it("calculates stats with expected rounding", () => {
      render(<PokemonOverview pokemon={mockPokemonTeam} disableCards />);

      // Known expected values from fixtures (see test utils)
      expect(screen.getByText("79")).toBeInTheDocument(); // Total levels
      expect(screen.getByText("218")).toBeInTheDocument(); // Total HP
      expect(screen.getByText("65%")).toBeInTheDocument(); // Avg health rounded
    });
  });

  describe("Full Team (6 Pokemon)", () => {
    it("hides add link when at capacity", () => {
      const fullTeam = {};
      for (let i = 1; i <= 6; i++) {
        fullTeam[`uuid-${i}`] = {
          ...mockPokemon,
          name: `Pokemon ${i}`,
        };
      }

      render(<PokemonOverview pokemon={fullTeam} disableCards />);

      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("/ 6")).toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: /add pokémon/i }),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Team Stats")).toBeInTheDocument();
    });
  });

  describe("Team Statistics Edge Cases", () => {
    it("handles zero max HP gracefully", () => {
      const teamWithZero = {
        "uuid-1": { ...mockPokemon, currentHP: 0, maxHP: 0 },
      };
      render(<PokemonOverview pokemon={teamWithZero} disableCards />);
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("rounds average health percentage correctly", () => {
      const team = {
        "uuid-1": { ...mockPokemon, currentHP: 33, maxHP: 100 },
        "uuid-2": {
          ...mockPokemonWithSecondType,
          currentHP: 67,
          maxHP: 100,
        },
      };
      render(<PokemonOverview pokemon={team} disableCards />);
      expect(screen.getByText("50%")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<PokemonOverview pokemon={mockPokemonTeam} disableCards />);

      expect(
        screen.getByRole("heading", { level: 2, name: "Pokémon Overview" }),
      ).toBeVisible();
      expect(
        screen.getByRole("heading", { level: 3, name: "Team Stats" }),
      ).toBeVisible();
    });

    it("provides accessible add link", () => {
      render(<PokemonOverview pokemon={{}} disableCards />);
      const addLink = screen.getByRole("link", { name: /add pokémon/i });
      expect(addLink).toBeInTheDocument();
      expect(addLink).toHaveAttribute("href", "/pokemon/new");
    });

    it("renders expected heading roles", () => {
      render(<PokemonOverview pokemon={mockPokemonTeam} disableCards />);
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
      expect(
        screen.getAllByRole("heading", { level: 3 }).length,
      ).toBeGreaterThan(0);
    });
  });

  describe("Responsive Class Presence (smoke)", () => {
    it("applies responsive heading classes", () => {
      render(<PokemonOverview pokemon={mockPokemonTeam} disableCards />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading.className).toMatch(/text-xl/);
      expect(heading.className).toMatch(/md:text-2xl/);
    });

    it("applies responsive padding classes", () => {
      const { container } = render(
        <PokemonOverview pokemon={mockPokemonTeam} disableCards />,
      );
      const wrapper = container.querySelector(".glass");
      expect(wrapper?.className).toMatch(/p-6/);
      expect(wrapper?.className).toMatch(/md:p-8/);
    });
  });

  describe("Team Counter Variations", () => {
    it("shows correct counts for varying team sizes", () => {
      const scenarios = [
        { team: {}, expected: "0" },
        { team: { a: mockPokemon }, expected: "1" },
        { team: mockPokemonTeam, expected: "3" },
      ];

      scenarios.forEach(({ team, expected }) => {
        const { unmount } = render(
          <PokemonOverview pokemon={team} disableCards />,
        );
        expect(screen.getAllByText(expected).length).toBeGreaterThan(0);
        expect(screen.getByText("/ 6")).toBeInTheDocument();
        unmount();
      });
    });
  });
});
