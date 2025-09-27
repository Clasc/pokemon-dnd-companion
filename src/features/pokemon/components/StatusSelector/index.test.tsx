import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StatusSelector from "./index";
import { useAppStore } from "@/store";
import { Pokemon } from "@/types/pokemon";

const createTestPokemon = (): Pokemon => ({
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
});

describe("StatusSelector", () => {
  const testUuid = "test-pokemon-uuid";
  let mockOnClose: jest.Mock;

  beforeEach(() => {
    // Clear the store state
    useAppStore.setState({
      pokemonTeam: {},
      trainer: null,
    });

    // Add test Pokemon to store
    const testPokemon = createTestPokemon();
    useAppStore.setState({
      pokemonTeam: {
        [testUuid]: testPokemon,
      },
      trainer: null,
    });

    mockOnClose = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Modal Rendering", () => {
    it("does not render when isOpen is false", () => {
      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={false}
          onClose={mockOnClose}
        />,
      );

      expect(screen.queryByText("Status Effects")).not.toBeInTheDocument();
    });

    it("renders modal when isOpen is true", () => {
      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText("Status Effects")).toBeInTheDocument();
      expect(screen.getByText("Primary Status")).toBeInTheDocument();
      expect(screen.getByText("Special Effects")).toBeInTheDocument();
    });

    it("does not render when pokemon does not exist", () => {
      render(
        <StatusSelector
          pokemonUuid="non-existent-uuid"
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.queryByText("Status Effects")).not.toBeInTheDocument();
    });
  });

  describe("Primary Status Selection", () => {
    it("renders all primary status options", () => {
      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByDisplayValue("none")).toBeInTheDocument();
      expect(screen.getByDisplayValue("burned")).toBeInTheDocument();
      expect(screen.getByDisplayValue("frozen")).toBeInTheDocument();
      expect(screen.getByDisplayValue("paralyzed")).toBeInTheDocument();
      expect(screen.getByDisplayValue("poisoned")).toBeInTheDocument();
      expect(screen.getByDisplayValue("badly-poisoned")).toBeInTheDocument();
      expect(screen.getByDisplayValue("asleep")).toBeInTheDocument();
    });

    it("defaults to 'none' when pokemon has no status", () => {
      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const noneRadio = screen.getByDisplayValue("none");
      expect(noneRadio).toBeChecked();
    });

    it("shows current primary status when pokemon has one", () => {
      const pokemonWithStatus = createTestPokemon();
      pokemonWithStatus.primaryStatus = {
        condition: "poisoned",
        duration: 3,
        turnsActive: 0,
      };

      useAppStore.setState({
        pokemonTeam: {
          [testUuid]: pokemonWithStatus,
        },
      });

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const poisonedRadio = screen.getByDisplayValue("poisoned");
      expect(poisonedRadio).toBeChecked();
    });

    it("allows selecting different primary status", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const burnedRadio = screen.getByDisplayValue("burned");
      await user.click(burnedRadio);

      expect(burnedRadio).toBeChecked();
      expect(screen.getByDisplayValue("none")).not.toBeChecked();
    });
  });

  describe("Duration Handling", () => {
    it("shows duration input for asleep status", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const asleepRadio = screen.getByDisplayValue("asleep");
      await user.click(asleepRadio);

      expect(screen.getByText("Duration:")).toBeInTheDocument();
      expect(screen.getByText("turns")).toBeInTheDocument();
    });

    it("does not show duration input for non-duration conditions", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const burnedRadio = screen.getByDisplayValue("burned");
      await user.click(burnedRadio);

      expect(screen.queryByText("Duration:")).not.toBeInTheDocument();
    });
  });

  describe("Confusion Status", () => {
    it("renders confusion checkbox", () => {
      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const confusionCheckbox = screen.getByRole("checkbox", {
        name: /Confused/i,
      });
      expect(confusionCheckbox).toBeInTheDocument();
      expect(confusionCheckbox).not.toBeChecked();
    });

    it("shows current confusion status when pokemon is confused", () => {
      const pokemonWithConfusion = createTestPokemon();
      pokemonWithConfusion.confusion = {
        condition: "confused",
        duration: 2,
        turnsActive: 0,
      };

      useAppStore.setState({
        pokemonTeam: {
          [testUuid]: pokemonWithConfusion,
        },
      });

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const confusionCheckbox = screen.getByRole("checkbox", {
        name: /Confused/i,
      });
      expect(confusionCheckbox).toBeChecked();
    });

    it("shows duration input when confusion is selected", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const confusionCheckbox = screen.getByRole("checkbox", {
        name: /Confused/i,
      });
      await user.click(confusionCheckbox);

      expect(confusionCheckbox).toBeChecked();
      expect(screen.getByText("Duration:")).toBeInTheDocument();
    });
  });

  describe("Action Buttons", () => {
    it("renders Cancel and Save buttons", () => {
      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("calls onClose when Cancel is clicked", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when X button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const closeButton = screen.getByRole("button", { name: "" }); // X button has no accessible name
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Save Functionality", () => {
    it("saves primary status to store when Save is clicked", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const poisonedRadio = screen.getByDisplayValue("poisoned");
      await user.click(poisonedRadio);

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      expect(updatedPokemon.primaryStatus?.condition).toBe("poisoned");
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("saves confusion to store when Save is clicked", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const confusionCheckbox = screen.getByRole("checkbox", {
        name: /Confused/i,
      });
      await user.click(confusionCheckbox);

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      expect(updatedPokemon.confusion?.condition).toBe("confused");
      expect(updatedPokemon.confusion?.duration).toBe(3);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("handles both primary status and confusion simultaneously", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const burnedRadio = screen.getByDisplayValue("burned");
      await user.click(burnedRadio);

      const confusionCheckbox = screen.getByRole("checkbox", {
        name: /Confused/i,
      });
      await user.click(confusionCheckbox);

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      expect(updatedPokemon.primaryStatus?.condition).toBe("burned");
      expect(updatedPokemon.confusion?.condition).toBe("confused");
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("clears primary status when none is selected", async () => {
      const user = userEvent.setup();

      // First set a status
      const pokemonWithStatus = createTestPokemon();
      pokemonWithStatus.primaryStatus = {
        condition: "poisoned",
        duration: 3,
        turnsActive: 0,
      };

      useAppStore.setState({
        pokemonTeam: {
          [testUuid]: pokemonWithStatus,
        },
      });

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const noneRadio = screen.getByDisplayValue("none");
      await user.click(noneRadio);

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      expect(updatedPokemon.primaryStatus).toBeUndefined();
    });

    it("clears confusion when unchecked", async () => {
      const user = userEvent.setup();

      // First set confusion
      const pokemonWithConfusion = createTestPokemon();
      pokemonWithConfusion.confusion = {
        condition: "confused",
        duration: 2,
        turnsActive: 0,
      };

      useAppStore.setState({
        pokemonTeam: {
          [testUuid]: pokemonWithConfusion,
        },
      });

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const confusionCheckbox = screen.getByRole("checkbox", {
        name: /Confused/i,
      });
      await user.click(confusionCheckbox); // Uncheck it

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      expect(updatedPokemon.confusion).toBeUndefined();
    });
  });

  describe("Duration Input Functionality", () => {
    it("allows setting custom duration for asleep status", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const asleepRadio = screen.getByDisplayValue("asleep");
      await user.click(asleepRadio);

      const durationInput = screen.getByDisplayValue("2"); // Default duration for asleep
      await user.clear(durationInput);
      await user.type(durationInput, "1");

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      expect(updatedPokemon.primaryStatus?.condition).toBe("asleep");
      expect(updatedPokemon.primaryStatus?.duration).toBe(1);
    });

    it("allows setting custom duration for confusion", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const confusionCheckbox = screen.getByRole("checkbox", {
        name: /Confused/i,
      });
      await user.click(confusionCheckbox);

      const durationInput = screen.getByDisplayValue("3"); // Default duration for confusion
      await user.clear(durationInput);
      await user.type(durationInput, "2");

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      expect(updatedPokemon.confusion?.condition).toBe("confused");
      expect(updatedPokemon.confusion?.duration).toBe(2);
    });
  });

  describe("Edge Cases and Complex Scenarios", () => {
    it("handles maximum duration values correctly", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const asleepRadio = screen.getByDisplayValue("asleep");
      await user.click(asleepRadio);

      const durationInput = screen.getByDisplayValue("2");
      await user.clear(durationInput);
      await user.type(durationInput, "99");

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      expect(updatedPokemon.primaryStatus?.duration).toBe(99);
    });

    it("handles minimum duration values correctly", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const asleepRadio = screen.getByDisplayValue("asleep");
      await user.click(asleepRadio);

      const durationInput = screen.getByDisplayValue("2");
      await user.clear(durationInput);
      await user.type(durationInput, "1");

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      expect(updatedPokemon.primaryStatus?.duration).toBe(1);
    });

    it("handles zero duration input gracefully", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const asleepRadio = screen.getByDisplayValue("asleep");
      await user.click(asleepRadio);

      const durationInput = screen.getByDisplayValue("2");
      await user.clear(durationInput);
      await user.type(durationInput, "0");

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      // Should still set the status even with 0 duration
      expect(updatedPokemon.primaryStatus?.condition).toBe("asleep");
      expect(updatedPokemon.primaryStatus?.duration).toBe(0);
    });

    it("overwrites existing status when selecting new primary status", async () => {
      const user = userEvent.setup();

      // Set initial status
      const pokemonWithStatus = createTestPokemon();
      pokemonWithStatus.primaryStatus = {
        condition: "poisoned",
        duration: 5,
        turnsActive: 2,
      };

      useAppStore.setState({
        pokemonTeam: {
          [testUuid]: pokemonWithStatus,
        },
      });

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const burnedRadio = screen.getByDisplayValue("burned");
      await user.click(burnedRadio);

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      expect(updatedPokemon.primaryStatus?.condition).toBe("burned");
      expect(updatedPokemon.primaryStatus?.turnsActive).toBe(0); // Should reset
    });

    it("preserves confusion when changing primary status", async () => {
      const user = userEvent.setup();

      // Set initial status with both primary and confusion
      const pokemonWithBothStatus = createTestPokemon();
      pokemonWithBothStatus.primaryStatus = {
        condition: "poisoned",
        duration: 3,
        turnsActive: 0,
      };
      pokemonWithBothStatus.confusion = {
        condition: "confused",
        duration: 2,
        turnsActive: 1,
      };

      useAppStore.setState({
        pokemonTeam: {
          [testUuid]: pokemonWithBothStatus,
        },
      });

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const burnedRadio = screen.getByDisplayValue("burned");
      await user.click(burnedRadio);

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      expect(updatedPokemon.primaryStatus?.condition).toBe("burned");
      expect(updatedPokemon.confusion?.condition).toBe("confused");
      expect(updatedPokemon.confusion?.duration).toBe(2);
    });

    it("preserves primary status when changing confusion", async () => {
      const user = userEvent.setup();

      // Set initial status with both primary and confusion
      const pokemonWithBothStatus = createTestPokemon();
      pokemonWithBothStatus.primaryStatus = {
        condition: "paralyzed",
        duration: 0,
        turnsActive: 0,
      };
      pokemonWithBothStatus.confusion = {
        condition: "confused",
        duration: 2,
        turnsActive: 1,
      };

      useAppStore.setState({
        pokemonTeam: {
          [testUuid]: pokemonWithBothStatus,
        },
      });

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const confusionCheckbox = screen.getByRole("checkbox", {
        name: /Confused/i,
      });
      await user.click(confusionCheckbox); // Uncheck confusion

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      expect(updatedPokemon.primaryStatus?.condition).toBe("paralyzed");
      expect(updatedPokemon.confusion).toBeUndefined();
    });

    it("handles clearing all status effects to healthy state", async () => {
      const user = userEvent.setup();

      // Set initial status with both primary and confusion
      const pokemonWithAllStatus = createTestPokemon();
      pokemonWithAllStatus.primaryStatus = {
        condition: "poisoned",
        duration: 3,
        turnsActive: 0,
      };
      pokemonWithAllStatus.confusion = {
        condition: "confused",
        duration: 2,
        turnsActive: 1,
      };

      useAppStore.setState({
        pokemonTeam: {
          [testUuid]: pokemonWithAllStatus,
        },
      });

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const noneRadio = screen.getByDisplayValue("none");
      await user.click(noneRadio);

      const confusionCheckbox = screen.getByRole("checkbox", {
        name: /Confused/i,
      });
      await user.click(confusionCheckbox); // Uncheck confusion

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      expect(updatedPokemon.primaryStatus).toBeUndefined();
      expect(updatedPokemon.confusion).toBeUndefined();
      expect(updatedPokemon.temporaryEffects).toBeUndefined();
    });

    it("handles empty duration input gracefully", async () => {
      const user = userEvent.setup();

      render(
        <StatusSelector
          pokemonUuid={testUuid}
          isOpen={true}
          onClose={mockOnClose}
        />,
      );

      const asleepRadio = screen.getByDisplayValue("asleep");
      await user.click(asleepRadio);

      const durationInput = screen.getByDisplayValue("2");
      await user.clear(durationInput);
      // Leave input empty

      const saveButton = screen.getByRole("button", { name: "Save" });
      await user.click(saveButton);

      const updatedPokemon = useAppStore.getState().pokemonTeam[testUuid];
      expect(updatedPokemon.primaryStatus?.condition).toBe("asleep");
      // Empty input results in undefined duration (per StatusEffect interface)
      expect(updatedPokemon.primaryStatus?.duration).toBeUndefined();
    });
  });
});
