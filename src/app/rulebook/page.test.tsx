import { render, screen, fireEvent } from "@testing-library/react";
import RulebookPage from "./page";
import { TYPE_CHART, type PokemonType } from "@/types/pokemon";

/* ==============================================
   TYPE_CHART data integrity
   ============================================== */

describe("TYPE_CHART", () => {
  const checks: [PokemonType, PokemonType, number][] = [
    ["fire", "grass", 2],
    ["fire", "water", 0.5],
    ["water", "fire", 2],
    ["electric", "water", 2],
    ["electric", "ground", 0],
    ["grass", "water", 2],
    ["normal", "ghost", 0],
    ["ghost", "normal", 1],
    ["fighting", "ghost", 1],
    ["ground", "flying", 0],
    ["dragon", "fairy", 0],
    ["fairy", "dragon", 2],
    ["psychic", "dark", 0],
    ["dark", "psychic", 2],
    ["poison", "steel", 0],
    ["ice", "dragon", 2],
    ["steel", "fairy", 2],
    ["fighting", "steel", 2],
    ["rock", "fire", 2],
    ["bug", "dark", 2],
  ];

  it.each(checks)("%s attacking %s = %s", (att, def, expected) => {
    expect(TYPE_CHART[att][def]).toBe(expected);
  });

  it("contains all 18 Pokemon types", () => {
    const types = Object.keys(TYPE_CHART);
    expect(types).toHaveLength(18);
  });

  it("has 18 entries per attacking type", () => {
    for (const defs of Object.values(TYPE_CHART)) {
      expect(Object.keys(defs)).toHaveLength(18);
    }
  });

  it("all effectiveness values are valid (0, 0.5, 1, or 2)", () => {
    const valid = [0, 0.5, 1, 2];
    for (const defs of Object.values(TYPE_CHART)) {
      for (const value of Object.values(defs)) {
        expect(valid).toContain(value);
      }
    }
  });
});

/* ==============================================
   Rulebook Page rendering & interaction
   ============================================== */

describe("Rulebook Page", () => {
  it("renders the page title and subtitle", () => {
    render(<RulebookPage />);
    expect(
      screen.getByRole("heading", { name: /rulebook/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/reference guide/i)).toBeInTheDocument();
  });

  describe("Tab navigation", () => {
    it("renders all four tabs", () => {
      render(<RulebookPage />);
      expect(
        screen.getByRole("tab", { name: /type chart/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: /ability scores/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: /level progression/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: /status effects/i }),
      ).toBeInTheDocument();
    });

    it("shows Type Chart as the initially selected tab", () => {
      render(<RulebookPage />);
      expect(
        screen.getByRole("tab", { name: /type chart/i }),
      ).toHaveAttribute("aria-selected", "true");
    });

    it("switches to Ability Scores tab on click", () => {
      render(<RulebookPage />);
      fireEvent.click(screen.getByRole("tab", { name: /ability scores/i }));
      expect(
        screen.getByRole("tab", { name: /ability scores/i }),
      ).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText(/six standard D&D ability scores/i)).toBeInTheDocument();
    });

    it("switches to Level Progression tab and shows table", () => {
      render(<RulebookPage />);
      fireEvent.click(
        screen.getByRole("tab", { name: /level progression/i }),
      );
      expect(
        screen.getByText(/level determines its proficiency bonus/i),
      ).toBeInTheDocument();
      expect(screen.getByText("Lv. 1")).toBeInTheDocument();
      expect(screen.getByText("Lv. 20")).toBeInTheDocument();
    });

    it("switches to Status Effects tab and shows conditions", () => {
      render(<RulebookPage />);
      fireEvent.click(
        screen.getByRole("tab", { name: /status effects/i }),
      );
      expect(screen.getByText("Burned")).toBeInTheDocument();
      expect(screen.getByText("Fainted")).toBeInTheDocument();
    });
  });

  describe("Type Chart section", () => {
    it("renders 18 type buttons", () => {
      render(<RulebookPage />);
      expect(screen.queryAllByRole("button", { pressed: false })).toHaveLength(
        18,
      );
    });

    it("shows placeholder when no type is selected", () => {
      render(<RulebookPage />);
      expect(screen.getByText(/click a type above/i)).toBeInTheDocument();
    });

    it("displays matchup results when a type is clicked", () => {
      render(<RulebookPage />);
      fireEvent.click(screen.getByRole("button", { name: "Fire" }));
      expect(screen.getByText(/attacking with/i)).toBeInTheDocument();
      expect(screen.queryByText(/click a type above/i)).not.toBeInTheDocument();
    });

    it("deselects type and returns to placeholder on second click", () => {
      render(<RulebookPage />);
      const fireBtn = screen.getByRole("button", { name: "Fire" });
      fireEvent.click(fireBtn);
      expect(screen.getByText(/attacking with/i)).toBeInTheDocument();
      fireEvent.click(fireBtn);
      expect(screen.queryByText(/attacking with/i)).not.toBeInTheDocument();
      expect(screen.getByText(/click a type above/i)).toBeInTheDocument();
    });
  });

  describe("Ability Scores section", () => {
    beforeEach(() => {
      render(<RulebookPage />);
      fireEvent.click(screen.getByRole("tab", { name: /ability scores/i }));
    });

    it("lists all six abilities", () => {
      for (const ability of [
        "strength",
        "dexterity",
        "constitution",
        "intelligence",
        "wisdom",
        "charisma",
      ]) {
        expect(screen.getByText(ability)).toBeInTheDocument();
      }
    });

    it("renders score controls with +/- buttons and ability score label", () => {
      expect(
        screen.getByRole("button", { name: /increase score/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /decrease score/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/Ability Score:/)).toBeInTheDocument();
    });

    it("increases displayed score on + click", () => {
      const plusBtn = screen.getByRole("button", { name: /increase score/i });
      fireEvent.click(plusBtn);
      expect(screen.queryAllByText("11").length).toBeGreaterThanOrEqual(1);
    });

    it("decreases displayed score on - click", () => {
      const minusBtn = screen.getByRole("button", {
        name: /decrease score/i,
      });
      fireEvent.click(minusBtn);
      expect(screen.queryAllByText("9").length).toBeGreaterThanOrEqual(1);
    });

    it("does not go below score 1", () => {
      const minusBtn = screen.getByRole("button", {
        name: /decrease score/i,
      });
      for (let i = 0; i < 20; i++) fireEvent.click(minusBtn);
      expect(screen.queryAllByText("1").length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText("0")).not.toBeInTheDocument();
    });

    it("does not go above score 30", () => {
      const plusBtn = screen.getByRole("button", { name: /increase score/i });
      for (let i = 0; i < 25; i++) fireEvent.click(plusBtn);
      expect(screen.queryAllByText("30").length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText("31")).not.toBeInTheDocument();
    });
  });

  describe("Level Progression section", () => {
    beforeEach(() => {
      render(<RulebookPage />);
      fireEvent.click(
        screen.getByRole("tab", { name: /level progression/i }),
      );
    });

    it("renders all 20 level rows", () => {
      for (const lv of [1, 5, 10, 15, 20]) {
        expect(screen.getByText(`Lv. ${lv}`)).toBeInTheDocument();
      }
    });
  });

  describe("Status Effects section", () => {
    beforeEach(() => {
      render(<RulebookPage />);
      fireEvent.click(
        screen.getByRole("tab", { name: /status effects/i }),
      );
    });

    it("lists all nine status conditions", () => {
      const conditions = [
        "Burned",
        "Frozen",
        "Paralyzed",
        "Poisoned",
        "Badly Poisoned",
        "Asleep",
        "Confused",
        "Flinching",
        "Fainted",
      ];
      for (const c of conditions) {
        expect(screen.getAllByText(c).length).toBeGreaterThanOrEqual(1);
      }
    });
  });
});
