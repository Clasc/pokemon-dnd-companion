import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useAppStore } from "@/store";
import TrainerOverview from "./index";
import { Trainer } from "@/types/trainer";

// Mock the store
jest.mock("@/store", () => ({
  useAppStore: {
    use: {
      trainer: jest.fn(),
      setTrainer: jest.fn(),
    },
  },
}));

const mockTrainer: Trainer = {
  name: "Ash Ketchum",
  class: "Pokemon Trainer",
  level: 5,
  attributes: {
    strength: 14,
    dexterity: 16,
    constitution: 12,
    intelligence: 10,
    wisdom: 13,
    charisma: 18,
  },
  currentHP: 25,
  maxHP: 30,
  inventory: [
    {
      id: "1",
      name: "Potion",
      quantity: 3,
      description: "Restores 20 HP",
    },
  ],
  pokedollars: 500,
};

const mockSetTrainer = jest.fn();

describe("TrainerOverview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppStore.use.trainer as jest.Mock).mockReturnValue(mockTrainer);
    (useAppStore.use.setTrainer as jest.Mock).mockReturnValue(mockSetTrainer);
  });

  describe("Modifier Calculations", () => {
    it("should display correct modifiers for all ability scores", () => {
      render(<TrainerOverview />);

      // Check that modifiers are displayed correctly by finding the attribute sections
      expect(screen.getByText("STR").parentElement).toHaveTextContent("+2"); // STR 14 = +2
      expect(screen.getByText("DEX").parentElement).toHaveTextContent("+3"); // DEX 16 = +3
      expect(screen.getByText("CON").parentElement).toHaveTextContent("+1"); // CON 12 = +1
      expect(screen.getByText("INT").parentElement).toHaveTextContent("+0"); // INT 10 = +0
      expect(screen.getByText("WIS").parentElement).toHaveTextContent("+1"); // WIS 13 = +1
      expect(screen.getByText("CHA").parentElement).toHaveTextContent("+4"); // CHA 18 = +4
    });

    it("should handle negative modifiers correctly", () => {
      const trainerWithLowStats = {
        ...mockTrainer,
        attributes: {
          strength: 8, // -1
          dexterity: 6, // -2
          constitution: 4, // -3
          intelligence: 2, // -4
          wisdom: 1, // -5
          charisma: 9, // -1
        },
      };

      (useAppStore.use.trainer as jest.Mock).mockReturnValue(
        trainerWithLowStats,
      );

      render(<TrainerOverview />);

      expect(screen.getByText("STR").parentElement).toHaveTextContent("-1"); // STR 8 = -1
      expect(screen.getByText("DEX").parentElement).toHaveTextContent("-2"); // DEX 6 = -2
      expect(screen.getByText("CON").parentElement).toHaveTextContent("-3"); // CON 4 = -3
      expect(screen.getByText("INT").parentElement).toHaveTextContent("-4"); // INT 2 = -4
      expect(screen.getByText("WIS").parentElement).toHaveTextContent("-5"); // WIS 1 = -5
      expect(screen.getByText("CHA").parentElement).toHaveTextContent("-1"); // CHA 9 = -1
    });

    it("should handle edge cases for modifier calculation", () => {
      const trainerWithEdgeCases = {
        ...mockTrainer,
        attributes: {
          strength: 30, // +10
          dexterity: 20, // +5
          constitution: 21, // +5
          intelligence: 11, // +0
          wisdom: 10, // +0
          charisma: 15, // +2
        },
      };

      (useAppStore.use.trainer as jest.Mock).mockReturnValue(
        trainerWithEdgeCases,
      );

      render(<TrainerOverview />);

      expect(screen.getByText("STR").parentElement).toHaveTextContent("+10"); // STR 30 = +10
      expect(screen.getByText("DEX").parentElement).toHaveTextContent("+5"); // DEX 20 = +5
      expect(screen.getByText("CON").parentElement).toHaveTextContent("+5"); // CON 21 = +5
      expect(screen.getByText("INT").parentElement).toHaveTextContent("+0"); // INT 11 = +0
      expect(screen.getByText("WIS").parentElement).toHaveTextContent("+0"); // WIS 10 = +0
      expect(screen.getByText("CHA").parentElement).toHaveTextContent("+2"); // CHA 15 = +2
    });
  });

  describe("Component Rendering", () => {
    it("should render trainer information correctly", () => {
      render(<TrainerOverview />);

      expect(screen.getByText("Ash Ketchum")).toBeInTheDocument();
      expect(screen.getByText("Level 5 Pokemon Trainer")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument(); // Level badge
    });

    it("should render all attribute short names", () => {
      render(<TrainerOverview />);

      expect(screen.getByText("STR")).toBeInTheDocument();
      expect(screen.getByText("DEX")).toBeInTheDocument();
      expect(screen.getByText("CON")).toBeInTheDocument();
      expect(screen.getByText("INT")).toBeInTheDocument();
      expect(screen.getByText("WIS")).toBeInTheDocument();
      expect(screen.getByText("CHA")).toBeInTheDocument();
    });

    it("should render HP information correctly", () => {
      render(<TrainerOverview />);

      expect(screen.getByText("25/30")).toBeInTheDocument();
      expect(screen.getByText("Hit Points")).toBeInTheDocument();
    });

    it("should return null when no trainer is provided", () => {
      (useAppStore.use.trainer as jest.Mock).mockReturnValue(null);

      const { container } = render(<TrainerOverview />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Edit Mode", () => {
    it("should open edit modal when edit button is clicked", async () => {
      render(<TrainerOverview />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByText("Edit Trainer")).toBeInTheDocument();
      });
    });

    it("should display raw attribute values in edit mode", async () => {
      render(<TrainerOverview />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      await waitFor(() => {
        // In edit mode, we should see the raw values as text, not modifiers
        // Look for the actual values displayed in the edit interface
        expect(screen.getByText("14")).toBeInTheDocument(); // STR value
        expect(screen.getByText("16")).toBeInTheDocument(); // DEX value
        expect(screen.getByText("12")).toBeInTheDocument(); // CON value
        expect(screen.getByText("10")).toBeInTheDocument(); // INT value
        expect(screen.getByText("13")).toBeInTheDocument(); // WIS value
        expect(screen.getByText("18")).toBeInTheDocument(); // CHA value
      });
    });

    it("should allow editing trainer name and class", async () => {
      render(<TrainerOverview />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      await waitFor(() => {
        const nameInput = screen.getByDisplayValue("Ash Ketchum");
        const classInput = screen.getByDisplayValue("Pokemon Trainer");

        fireEvent.change(nameInput, { target: { value: "Gary Oak" } });
        fireEvent.change(classInput, { target: { value: "Gym Leader" } });

        expect(nameInput).toHaveValue("Gary Oak");
        expect(classInput).toHaveValue("Gym Leader");
      });
    });

    it("should save changes when save button is clicked", async () => {
      render(<TrainerOverview />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      await waitFor(() => {
        const nameInput = screen.getByDisplayValue("Ash Ketchum");
        fireEvent.change(nameInput, { target: { value: "Gary Oak" } });

        const saveButton = screen.getByRole("button", { name: /save/i });
        fireEvent.click(saveButton);
      });

      expect(mockSetTrainer).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Gary Oak",
        }),
      );
    });

    it("should cancel changes when cancel button is clicked", async () => {
      render(<TrainerOverview />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      await waitFor(() => {
        const nameInput = screen.getByDisplayValue("Ash Ketchum");
        fireEvent.change(nameInput, { target: { value: "Gary Oak" } });

        const cancelButton = screen.getByRole("button", { name: /cancel/i });
        fireEvent.click(cancelButton);
      });

      expect(mockSetTrainer).not.toHaveBeenCalled();
    });

    it("should modify attributes with + and - buttons", async () => {
      render(<TrainerOverview />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      await waitFor(() => {
        // Find all + and - buttons (there are many in the component)
        const plusButtons = screen.getAllByText("+");

        // Click the first + button (should be for strength)
        fireEvent.click(plusButtons[0]);

        const saveButton = screen.getByRole("button", { name: /save/i });
        fireEvent.click(saveButton);
      });

      expect(mockSetTrainer).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            strength: 15, // Should be increased from 14 to 15
          }),
        }),
      );
    });

    it("should clamp attribute values between 1 and 20", async () => {
      const trainerWithMaxStr = {
        ...mockTrainer,
        attributes: { ...mockTrainer.attributes, strength: 20 },
      };
      (useAppStore.use.trainer as jest.Mock).mockReturnValue(trainerWithMaxStr);

      render(<TrainerOverview />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      await waitFor(() => {
        const plusButtons = screen.getAllByText("+");
        // Try to increase strength above 20
        fireEvent.click(plusButtons[0]);

        const saveButton = screen.getByRole("button", { name: /save/i });
        fireEvent.click(saveButton);
      });

      expect(mockSetTrainer).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            strength: 20, // Should remain 20, not go to 21
          }),
        }),
      );
    });
  });

  describe("HP Management", () => {
    it("should handle HP changes correctly", async () => {
      render(<TrainerOverview />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      await waitFor(() => {
        // Find HP management buttons in the edit modal
        const hpButtons = screen.getAllByText("+");
        // The HP + buttons should be towards the end of the + buttons list
        // Let's click one of the HP + buttons
        fireEvent.click(hpButtons[hpButtons.length - 1]); // Last + button should be for HP

        const saveButton = screen.getByRole("button", { name: /save/i });
        fireEvent.click(saveButton);
      });

      expect(mockSetTrainer).toHaveBeenCalled();
    });
  });
});
