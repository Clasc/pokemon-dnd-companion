import { render, screen, fireEvent } from "@testing-library/react";
import AddAttackModal from "../AddAttackModal";
import { useAppStore } from "../../store";

// Mock the Zustand store
jest.mock("../../store", () => ({
  useAppStore: {
    use: {
      addAttack: jest.fn(),
    },
  },
}));

describe("AddAttackModal", () => {
  const addAttackMock = jest.fn();
  const onCloseMock = jest.fn();

  // Setup the mock store implementation
  const setupMockStore = () => {
    (useAppStore.use.addAttack as jest.Mock).mockReturnValue(addAttackMock);
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    setupMockStore();
  });

  it("does not render when isOpen is false", () => {
    render(
      <AddAttackModal
        isOpen={false}
        onClose={onCloseMock}
        pokemonUuid="test-uuid"
        attackIndex={0}
      />,
    );
    expect(screen.queryByText("Add New Attack")).not.toBeInTheDocument();
  });

  it("renders correctly when isOpen is true", () => {
    render(
      <AddAttackModal
        isOpen={true}
        onClose={onCloseMock}
        pokemonUuid="test-uuid"
        attackIndex={0}
      />,
    );
    expect(screen.getByText("Add New Attack")).toBeInTheDocument();
    expect(screen.getByLabelText("Attack Name")).toBeInTheDocument();
    expect(screen.getByLabelText("PP")).toBeInTheDocument();
    expect(screen.getByLabelText("Move Bonus")).toBeInTheDocument();
    expect(screen.getByLabelText("Action Type")).toBeInTheDocument();
    expect(screen.getByLabelText("Damage Dice")).toBeInTheDocument();
  });

  it("allows typing in form fields", () => {
    render(
      <AddAttackModal
        isOpen={true}
        onClose={onCloseMock}
        pokemonUuid="test-uuid"
        attackIndex={0}
      />,
    );

    const nameInput = screen.getByLabelText("Attack Name") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Tackle" } });
    expect(nameInput.value).toBe("Tackle");

    const ppInput = screen.getByLabelText("PP") as HTMLInputElement;
    fireEvent.change(ppInput, { target: { value: "20" } });
    expect(ppInput.value).toBe("20");

    const damageDiceSelect = screen.getByLabelText(
      "Damage Dice",
    ) as HTMLSelectElement;
    fireEvent.change(damageDiceSelect, { target: { value: "d10" } });
    expect(damageDiceSelect.value).toBe("d10");
  });

  it("calls addAttack and onClose when the form is submitted", () => {
    render(
      <AddAttackModal
        isOpen={true}
        onClose={onCloseMock}
        pokemonUuid="test-uuid"
        attackIndex={0}
      />,
    );

    fireEvent.change(screen.getByLabelText("Attack Name"), {
      target: { value: "Quick Attack" },
    });
    fireEvent.change(screen.getByLabelText("PP"), { target: { value: "30" } });
    fireEvent.change(screen.getByLabelText("Move Bonus"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText("Action Type"), {
      target: { value: "bonus action" },
    });
    fireEvent.change(screen.getByLabelText("Damage Dice"), {
      target: { value: "d6" },
    });
    fireEvent.change(screen.getByLabelText(/Special Effect/i), {
      target: { value: "Always goes first" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "A speedy attack" },
    });

    const submitButton = screen.getByRole("button", { name: "Add Attack" });
    fireEvent.click(submitButton);

    expect(addAttackMock).toHaveBeenCalledTimes(1);
    expect(addAttackMock).toHaveBeenCalledWith("test-uuid", 0, {
      name: "Quick Attack",
      pp: 30,
      moveBonus: 5,
      actionType: "bonus action",
      damageDice: "d6",
      specialEffect: "Always goes first",
      description: "A speedy attack",
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the cancel button is clicked", () => {
    render(
      <AddAttackModal
        isOpen={true}
        onClose={onCloseMock}
        pokemonUuid="test-uuid"
        attackIndex={0}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
    expect(addAttackMock).not.toHaveBeenCalled();
  });
});
