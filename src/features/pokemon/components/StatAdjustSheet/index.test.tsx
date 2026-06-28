import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatAdjustSheet from ".";
import { useAppStore } from "@/store";
import { testPokemon } from "@/fixtures";

jest.mock("@/store", () => ({
  useAppStore: {
    use: {
      modifyPokemonHP: jest.fn(),
      gainExperience: jest.fn(),
    },
  },
}));

const modifyPokemonHPMock = jest.fn();
const gainExperienceMock = jest.fn();

const mockPokemon = testPokemon["pikachu-001"];
const mockPokemonUuid = "pikachu-001";

beforeEach(() => {
  jest.clearAllMocks();
  (useAppStore.use.modifyPokemonHP as jest.Mock).mockReturnValue(
    modifyPokemonHPMock,
  );
  (useAppStore.use.gainExperience as jest.Mock).mockReturnValue(
    gainExperienceMock,
  );
});

describe("StatAdjustSheet", () => {
  it("renders pokemon name and level", () => {
    render(
      <StatAdjustSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText(mockPokemon.name)).toBeInTheDocument();
    expect(screen.getByText(`Lv.${mockPokemon.level}`)).toBeInTheDocument();
    expect(screen.getByText(`🛡️${mockPokemon.armorClass}`)).toBeInTheDocument();
  });

  it("renders HP damage and heal buttons", () => {
    render(
      <StatAdjustSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getAllByText("-10")[0]).toBeInTheDocument();
    expect(screen.getAllByText("-5")[0]).toBeInTheDocument();
    expect(screen.getAllByText("-1")[0]).toBeInTheDocument();
    expect(screen.getAllByText("+1")[0]).toBeInTheDocument();
    expect(screen.getAllByText("+5")[0]).toBeInTheDocument();
    expect(screen.getAllByText("+10")[0]).toBeInTheDocument();
  });

  it("calls modifyPokemonHP with -10 when -10 is clicked", () => {
    render(
      <StatAdjustSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    fireEvent.click(screen.getAllByText("-10")[0]);
    expect(modifyPokemonHPMock).toHaveBeenCalledWith(mockPokemonUuid, -10);
  });

  it("calls modifyPokemonHP with +5 when +5 is clicked", () => {
    render(
      <StatAdjustSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    fireEvent.click(screen.getAllByText("+5")[0]);
    expect(modifyPokemonHPMock).toHaveBeenCalledWith(mockPokemonUuid, 5);
  });

  it("calls gainExperience with correct amount", () => {
    render(
      <StatAdjustSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByText("+50"));
    expect(gainExperienceMock).toHaveBeenCalledWith(mockPokemonUuid, 50);

    fireEvent.click(screen.getByText("+200"));
    expect(gainExperienceMock).toHaveBeenCalledWith(mockPokemonUuid, 200);
  });

  it("submits exact HP value correctly", () => {
    render(
      <StatAdjustSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    const hpInput = screen.getByPlaceholderText(`0 - ${mockPokemon.maxHP}`);
    fireEvent.change(hpInput, { target: { value: "30" } });
    fireEvent.click(screen.getByText("Set HP"));

    const expectedDelta = 30 - mockPokemon.currentHP;
    expect(modifyPokemonHPMock).toHaveBeenCalledWith(
      mockPokemonUuid,
      expectedDelta,
    );
  });

  it("submits exact XP value correctly", () => {
    render(
      <StatAdjustSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    const xpInput = screen.getByPlaceholderText("Exact XP");
    fireEvent.change(xpInput, { target: { value: "150" } });
    fireEvent.click(screen.getByText("Add XP"));

    expect(gainExperienceMock).toHaveBeenCalledWith(mockPokemonUuid, 150);
  });

  it("shows FAINTED badge when pokemon is fainted", () => {
    const faintedPokemon = {
      ...mockPokemon,
      currentHP: 0,
      primaryStatus: { condition: "fainted" as const, turnsActive: 0 },
    };

    render(
      <StatAdjustSheet
        pokemon={faintedPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={true}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText("FAINTED")).toBeInTheDocument();
  });

  it("renders nothing when isOpen is false", () => {
    render(
      <StatAdjustSheet
        pokemon={mockPokemon}
        pokemonUuid={mockPokemonUuid}
        isOpen={false}
        onClose={jest.fn()}
      />,
    );

    expect(screen.queryByText(mockPokemon.name)).not.toBeInTheDocument();
  });
});
