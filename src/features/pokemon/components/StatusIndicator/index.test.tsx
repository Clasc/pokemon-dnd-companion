import { render, screen } from "@testing-library/react";
import StatusIndicator from "./index";
import { Pokemon } from "@/types/pokemon";

const basePokemon: Pokemon = {
  type: "Pikachu",
  name: "Sparky",
  type1: "electric",
  level: 12,
  currentHP: 42,
  maxHP: 42,
  experience: 850,
  experienceToNext: 350,
  attributes: {
    strength: 8,
    dexterity: 16,
    constitution: 12,
    intelligence: 14,
    wisdom: 13,
    charisma: 15,
  },
  attacks: [],
};

describe("StatusIndicator", () => {
  it("renders nothing when pokemon has no status effects", () => {
    const { container } = render(<StatusIndicator pokemon={basePokemon} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders primary status effect without duration", () => {
    const pokemon: Pokemon = {
      ...basePokemon,
      primaryStatus: {
        condition: "burned",
        turnsActive: 0,
      },
    };

    render(<StatusIndicator pokemon={pokemon} />);

    expect(screen.getByText("Burned")).toBeInTheDocument();
    expect(screen.queryByText(/\d/)).not.toBeInTheDocument(); // No duration number
  });

  it("renders primary status effect with duration", () => {
    const pokemon: Pokemon = {
      ...basePokemon,
      primaryStatus: {
        condition: "asleep",
        duration: 2,
        turnsActive: 0,
      },
    };

    render(<StatusIndicator pokemon={pokemon} />);

    expect(screen.getByText("Asleep")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders confusion status effect", () => {
    const pokemon: Pokemon = {
      ...basePokemon,
      confusion: {
        condition: "confused",
        duration: 3,
        turnsActive: 0,
      },
    };

    render(<StatusIndicator pokemon={pokemon} />);

    expect(screen.getByText("Confused")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders temporary effects", () => {
    const pokemon: Pokemon = {
      ...basePokemon,
      temporaryEffects: [
        {
          condition: "flinching",
          turnsActive: 0,
        },
      ],
    };

    render(<StatusIndicator pokemon={pokemon} />);

    expect(screen.getByText("Flinching")).toBeInTheDocument();
  });

  it("renders multiple status effects simultaneously", () => {
    const pokemon: Pokemon = {
      ...basePokemon,
      primaryStatus: {
        condition: "poisoned",
        turnsActive: 0,
      },
      confusion: {
        condition: "confused",
        duration: 2,
        turnsActive: 0,
      },
      temporaryEffects: [
        {
          condition: "flinching",
          turnsActive: 0,
        },
      ],
    };

    render(<StatusIndicator pokemon={pokemon} />);

    expect(screen.getByText("Poisoned")).toBeInTheDocument();
    expect(screen.getByText("Confused")).toBeInTheDocument();
    expect(screen.getByText("Flinching")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // Confusion duration
  });

  it("formats badly-poisoned status name correctly", () => {
    const pokemon: Pokemon = {
      ...basePokemon,
      primaryStatus: {
        condition: "badly-poisoned",
        turnsActive: 0,
      },
    };

    render(<StatusIndicator pokemon={pokemon} />);

    expect(screen.getByText("Badly Poisoned")).toBeInTheDocument();
  });

  it("does not render status effect with 'none' condition", () => {
    const pokemon: Pokemon = {
      ...basePokemon,
      primaryStatus: {
        condition: "none",
        turnsActive: 0,
      },
    };

    render(<StatusIndicator pokemon={pokemon} />);

    expect(screen.queryByText("None")).not.toBeInTheDocument();
  });

  it("applies correct background colors for status effects", () => {
    const pokemon: Pokemon = {
      ...basePokemon,
      primaryStatus: {
        condition: "burned",
        turnsActive: 0,
      },
    };

    render(<StatusIndicator pokemon={pokemon} />);

    const statusBadge = screen.getByText("Burned").closest("div");
    expect(statusBadge).toHaveStyle("background-color: #FF6B35");
  });

  it("handles multiple temporary effects", () => {
    const pokemon: Pokemon = {
      ...basePokemon,
      temporaryEffects: [
        {
          condition: "flinching",
          turnsActive: 0,
        },
        {
          condition: "flinching",
          duration: 1,
          turnsActive: 0,
        },
      ],
    };

    render(<StatusIndicator pokemon={pokemon} />);

    const flinchingElements = screen.getAllByText("Flinching");
    expect(flinchingElements).toHaveLength(2);
    expect(screen.getByText("1")).toBeInTheDocument(); // Duration for second effect
  });
});
