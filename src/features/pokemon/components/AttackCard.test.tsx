import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AttackCard from "./AttackCard";
import { useAppStore } from "@/store";
import { Attack } from "@/types/pokemon";

// Mock the Zustand store
// We are mocking the entire module
jest.mock("@/store", () => ({
  useAppStore: {
    use: {
      decreaseAttackPP: jest.fn(),
      addAttack: jest.fn(),
    },
  },
}));

describe("AttackCard", () => {
  const decreaseAttackPPMock = jest.fn();
  const addAttackMock = jest.fn();

  // Define a reusable mock setup function
  const setupMockStore = () => {
    (useAppStore.use.decreaseAttackPP as jest.Mock).mockReturnValue(
      decreaseAttackPPMock,
    );
    (useAppStore.use.addAttack as jest.Mock).mockReturnValue(addAttackMock);
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    setupMockStore();
  });

  const attackWithPP: Attack = {
    name: "Thunder Shock",
    currentPp: 10,
    maxPp: 15,
    actionType: "action",
    moveBonus: 3,
    damageDice: "d6",
    description: "A shocking attack",
    specialEffect: "Paralyzes on 20",
  };

  const attackWithoutPP: Attack = { ...attackWithPP, currentPp: 0 };

  it("renders attack details correctly when an attack is provided", () => {
    render(
      <AttackCard
        attack={attackWithPP}
        pokemonUuid="test-uuid-1"
        attackIndex={0}
      />,
    );

    expect(screen.getByText("Thunder Shock")).toBeInTheDocument();
    expect(screen.getByText(/PP: 10 \/ 15/i)).toBeInTheDocument();
    expect(screen.getByText(/Action/i)).toBeInTheDocument(); // For Action Type
    expect(screen.getByText("d6")).toBeInTheDocument(); // For Damage Dice
    expect(screen.getByText("+3")).toBeInTheDocument(); // For Move Bonus
    expect(screen.getByText(/"A shocking attack"/i)).toBeInTheDocument();
    expect(screen.getByText("Paralyzes on 20")).toBeInTheDocument();
  });

  it('renders a placeholder and "Add Attack" button when no attack is provided', () => {
    render(<AttackCard pokemonUuid="test-uuid-2" attackIndex={1} />);
    const addAttackButton = screen.getByText("+ Add Attack");
    expect(addAttackButton).toBeInTheDocument();
    fireEvent.click(addAttackButton);
    // In a full integration test, we would check if the modal opens.
    // For this component test, we just ensure the button is there.
  });

  it('enables the "Perform Attack" button and calls decreasePP on click when currentPp > 0', () => {
    render(
      <AttackCard
        attack={attackWithPP}
        pokemonUuid="test-uuid-3"
        attackIndex={0}
      />,
    );

    const performAttackButton = screen.getByRole("button", {
      name: "Perform Attack",
    });
    expect(performAttackButton).toBeEnabled();

    fireEvent.click(performAttackButton);

    expect(decreaseAttackPPMock).toHaveBeenCalledTimes(1);
    expect(decreaseAttackPPMock).toHaveBeenCalledWith("test-uuid-3", 0);
  });

  it('disables the "Perform Attack" button when currentPp is 0', () => {
    render(
      <AttackCard
        attack={attackWithoutPP}
        pokemonUuid="test-uuid-4"
        attackIndex={0}
      />,
    );

    const performAttackButton = screen.getByRole("button", {
      name: "Perform Attack",
    });
    expect(performAttackButton).toBeDisabled();
  });
});
