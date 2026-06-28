import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import HPBottomSheet from ".";
import { useAppStore } from "@/store";
import { testPokemon } from "@/fixtures";

jest.mock("@/store", () => ({
  useAppStore: {
    use: {
      modifyPokemonHP: jest.fn(),
    },
  },
}));

const modifyPokemonHPMock = jest.fn();

const mockPokemon = testPokemon["pikachu-001"];
const mockPokemonUuid = "pikachu-001";

beforeEach(() => {
  jest.clearAllMocks();
  (useAppStore.use.modifyPokemonHP as jest.Mock).mockReturnValue(
    modifyPokemonHPMock,
  );
});

describe("HPBottomSheet", () => {
  it("renders pokemon name and HP", () => {
    render(
      <HPBottomSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText(mockPokemon.name)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockPokemon.currentHP} / ${mockPokemon.maxHP}`),
    ).toBeInTheDocument();
    expect(screen.getByText(`Lv.${mockPokemon.level}`)).toBeInTheDocument();
  });

  it("renders damage and heal buttons", () => {
    render(
      <HPBottomSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText("-10")).toBeInTheDocument();
    expect(screen.getByText("-5")).toBeInTheDocument();
    expect(screen.getByText("-1")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
    expect(screen.getByText("+5")).toBeInTheDocument();
    expect(screen.getByText("+10")).toBeInTheDocument();
  });

  it("calls modifyPokemonHP with -10 when -10 is clicked", () => {
    render(
      <HPBottomSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByText("-10"));
    expect(modifyPokemonHPMock).toHaveBeenCalledWith(mockPokemonUuid, -10);
  });

  it("calls modifyPokemonHP with +5 when +5 is clicked", () => {
    render(
      <HPBottomSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByText("+5"));
    expect(modifyPokemonHPMock).toHaveBeenCalledWith(mockPokemonUuid, 5);
  });

  it("shows FAINTED badge when pokemon is fainted", () => {
    const faintedPokemon = {
      ...mockPokemon,
      currentHP: 0,
      primaryStatus: { condition: "fainted" as const, turnsActive: 0 },
    };

    render(
      <HPBottomSheet
        pokemon={faintedPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText("FAINTED")).toBeInTheDocument();
  });

  it("renders exact HP input and submits correct delta", () => {
    render(
      <HPBottomSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    const input = screen.getByPlaceholderText(
      `0 - ${mockPokemon.maxHP}`,
    );
    fireEvent.change(input, { target: { value: "30" } });
    fireEvent.click(screen.getByText("Set"));

    const expectedDelta = 30 - mockPokemon.currentHP;
    expect(modifyPokemonHPMock).toHaveBeenCalledWith(
      mockPokemonUuid,
      expectedDelta,
    );
  });

  it("calls onClose after setting exact HP", () => {
    const onClose = jest.fn();

    render(
      <HPBottomSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={onClose}
      />,
    );

    const input = screen.getByPlaceholderText(
      `0 - ${mockPokemon.maxHP}`,
    );
    fireEvent.change(input, { target: { value: "30" } });
    fireEvent.click(screen.getByText("Set"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders nothing when isOpen is false", () => {
    render(
      <HPBottomSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={false}
        onClose={jest.fn()}
      />,
    );

    expect(screen.queryByText(mockPokemon.name)).not.toBeInTheDocument();
  });

  it("handles damage to 0 HP gracefully", () => {
    const lowHPPokemon = { ...mockPokemon, currentHP: 3 };

    render(
      <HPBottomSheet
        pokemon={lowHPPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByText("-10"));
    expect(modifyPokemonHPMock).toHaveBeenCalledWith(mockPokemonUuid, -10);
  });

  it("handles heal beyond max HP gracefully", () => {
    const almostFullPokemon = { ...mockPokemon, currentHP: 40 };

    render(
      <HPBottomSheet
        pokemon={almostFullPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByText("+10"));
    expect(modifyPokemonHPMock).toHaveBeenCalledWith(mockPokemonUuid, 10);
  });
});
