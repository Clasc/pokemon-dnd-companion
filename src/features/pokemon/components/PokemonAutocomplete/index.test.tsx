import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PokemonAutocomplete from "./index";

const mockPokemonSpeciesResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon-species/25/" },
    { name: "raichu", url: "https://pokeapi.co/api/v2/pokemon-species/26/" },
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
    { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon-species/4/" },
  ],
};

const mockPikachuDetailResponse = {
  id: 25,
  name: "pikachu",
  types: [
    { slot: 1, type: { name: "electric", url: "https://pokeapi.co/api/v2/type/13/" } },
  ],
  sprites: {
    other: {
      "official-artwork": {
        front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
        front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/25.png",
      },
    },
  },
};

const mockCharizardDetailResponse = {
  id: 6,
  name: "charizard",
  types: [
    { slot: 1, type: { name: "fire", url: "https://pokeapi.co/api/v2/type/10/" } },
    { slot: 2, type: { name: "flying", url: "https://pokeapi.co/api/v2/type/3/" } },
  ],
  sprites: {
    other: {
      "official-artwork": {
        front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
        front_shiny: null,
      },
    },
  },
};

global.fetch = jest.fn();

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("PokemonAutocomplete", () => {
  let mockOnSelect: jest.Mock;
  let mockOnChange: jest.Mock;

  beforeEach(() => {
    mockOnSelect = jest.fn();
    mockOnChange = jest.fn();
    mockedFetch.mockReset();
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemonSpeciesResponse),
    } as Response);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial Rendering", () => {
    it("renders input with placeholder", () => {
      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
          placeholder="Search Pokemon..."
        />,
      );

      expect(screen.getByPlaceholderText("Search Pokemon...")).toBeInTheDocument();
    });

    it("renders with correct initial value", () => {
      render(
        <PokemonAutocomplete
          value="Pikachu"
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("Pikachu");
    });

    it("disables input when disabled prop is true", () => {
      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
          disabled={true}
        />,
      );

      expect(screen.getByRole("textbox")).toBeDisabled();
    });
  });

  describe("Species List Loading", () => {
    it("fetches species list on mount", async () => {
      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledWith(
          "https://pokeapi.co/api/v2/pokemon-species/?limit=1000",
        );
      });
    });

    it("does not refetch species list if already loaded", async () => {
      const { rerender } = render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledTimes(1);
      });

      rerender(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledTimes(1);
      });
    });

    it("shows error when species fetch fails", async () => {
      mockedFetch.mockReset();
      mockedFetch.mockRejectedValueOnce(new Error("Network error"));

      await act(async () => {
        render(
          <PokemonAutocomplete
            value=""
            onSelect={mockOnSelect}
            onChange={mockOnChange}
          />,
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Unable to load Pokemon. Please try again.")).toBeInTheDocument();
      });
    });
  });

  describe("Search and Filtering", () => {
    it("shows suggestions when user types", async () => {
      const user = userEvent.setup();

      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalled();
      });

      const input = screen.getByRole("textbox");
      await act(async () => {
        await user.type(input, "pik");
      });

      await waitFor(() => {
        expect(screen.getByText("Pikachu")).toBeInTheDocument();
      });
    });

    it("filters suggestions based on input", async () => {
      const user = userEvent.setup();

      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalled();
      });

      const input = screen.getByRole("textbox");
      await act(async () => {
        await user.type(input, "char");
      });

      await waitFor(() => {
        expect(screen.getByText("Charmander")).toBeInTheDocument();
        expect(screen.queryByText("Pikachu")).not.toBeInTheDocument();
      });
    });

    it("limits suggestions to 10 items", async () => {
      const manySpeciesResponse = {
        ...mockPokemonSpeciesResponse,
        results: Array.from({ length: 20 }, (_, i) => ({
          name: `pokemon-${i}`,
          url: `https://pokeapi.co/api/v2/pokemon-species/${i + 1}/`,
        })),
      };
      mockedFetch.mockReset();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(manySpeciesResponse),
      } as Response);

      const user = userEvent.setup();

      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalled();
      });

      const input = screen.getByRole("textbox");
      await act(async () => {
        await user.type(input, "pokemon");
      });

      await waitFor(() => {
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeLessThanOrEqual(10);
      });
    });

    it("shows no results message when no matches", async () => {
      const user = userEvent.setup();

      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalled();
      });

      const input = screen.getByRole("textbox");
      await act(async () => {
        await user.type(input, "xyz123");
      });

      await waitFor(
        () => {
          expect(screen.getByText("No Pokemon found")).toBeInTheDocument();
        },
        { timeout: 1000 },
      );
    });

    it("calls onChange when user types", async () => {
      const user = userEvent.setup();

      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole("textbox");
      await act(async () => {
        await user.type(input, "test");
      });

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe("Pokemon Selection", () => {
    it("fetches Pokemon details on selection", async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPikachuDetailResponse),
      } as Response);

      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalled();
      });

      const input = screen.getByRole("textbox");
      await act(async () => {
        await user.type(input, "pik");
      });

      await waitFor(() => {
        expect(screen.getByText("Pikachu")).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText("Pikachu"));
      });

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledWith(
          "https://pokeapi.co/api/v2/pokemon/pikachu/",
        );
      });
    });

    it("calls onSelect with correct data for single-type Pokemon", async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPikachuDetailResponse),
      } as Response);

      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalled();
      });

      const input = screen.getByRole("textbox");
      await act(async () => {
        await user.type(input, "pik");
      });

      await waitFor(() => {
        expect(screen.getByText("Pikachu")).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText("Pikachu"));
      });

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith({
          name: "pikachu",
          displayName: "Pikachu",
          types: ["electric"],
          spriteUrl: mockPikachuDetailResponse.sprites.other["official-artwork"].front_default,
        });
      });
    });

    it("calls onSelect with correct data for dual-type Pokemon", async () => {
      const user = userEvent.setup();
      mockedFetch.mockReset();
      mockedFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPokemonSpeciesResponse),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockCharizardDetailResponse),
        } as Response);

      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalled();
      });

      const input = screen.getByRole("textbox");
      await act(async () => {
        await user.type(input, "char");
      });

      await waitFor(() => {
        expect(screen.getByText("Charmander")).toBeInTheDocument();
      });

      const speciesWithCharizard = {
        ...mockPokemonSpeciesResponse,
        results: [
          { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon-species/4/" },
          { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon-species/6/" },
        ],
      };
      mockedFetch.mockReset();
      mockedFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(speciesWithCharizard),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockCharizardDetailResponse),
        } as Response);

      const { rerender } = render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalled();
      });

      const input2 = screen.getByRole("textbox");
      await act(async () => {
        await user.type(input2, "charizard");
      });

      await waitFor(() => {
        expect(screen.getByText("Charizard")).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText("Charizard"));
      });

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith({
          name: "charizard",
          displayName: "Charizard",
          types: ["fire", "flying"],
          spriteUrl: mockCharizardDetailResponse.sprites.other["official-artwork"].front_default,
        });
      });
    });

    it("closes dropdown after selection", async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPikachuDetailResponse),
      } as Response);

      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalled();
      });

      const input = screen.getByRole("textbox");
      await act(async () => {
        await user.type(input, "pik");
      });

      await waitFor(() => {
        expect(screen.getByText("Pikachu")).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText("Pikachu"));
      });

      await waitFor(() => {
        expect(screen.queryByRole("button", { name: "Pikachu" })).not.toBeInTheDocument();
      });
    });

    it("updates input value after selection", async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPikachuDetailResponse),
      } as Response);

      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalled();
      });

      const input = screen.getByRole("textbox");
      await act(async () => {
        await user.type(input, "pik");
      });

      await waitFor(() => {
        expect(screen.getByText("Pikachu")).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText("Pikachu"));
      });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith("pikachu");
      });
    });

    it("shows error when detail fetch fails", async () => {
      const user = userEvent.setup();
      mockedFetch.mockRejectedValueOnce(new Error("Network error"));

      await act(async () => {
        render(
          <PokemonAutocomplete
            value=""
            onSelect={mockOnSelect}
            onChange={mockOnChange}
          />,
        );
      });

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalled();
      });

      const input = screen.getByRole("textbox");
      await act(async () => {
        await user.type(input, "pik");
      });

      await waitFor(() => {
        expect(screen.getByText("Pikachu")).toBeInTheDocument();
      });

      mockedFetch.mockRejectedValueOnce(new Error("Network error"));
      
      await act(async () => {
        await user.click(screen.getByText("Pikachu"));
      });

      await waitFor(() => {
        expect(screen.getByText("Failed to load Pokemon details. Please try again.")).toBeInTheDocument();
      });
    });
  });

  describe("Name Formatting", () => {
    it("formats hyphenated names correctly", async () => {
      const hyphenatedSpeciesResponse = {
        ...mockPokemonSpeciesResponse,
        results: [
          { name: "mr-mime", url: "https://pokeapi.co/api/v2/pokemon-species/122/" },
          { name: "mime-jr", url: "https://pokeapi.co/api/v2/pokemon-species/439/" },
        ],
      };
      mockedFetch.mockReset();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(hyphenatedSpeciesResponse),
      } as Response);

      const user = userEvent.setup();

      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalled();
      });

      const input = screen.getByRole("textbox");
      await act(async () => {
        await user.type(input, "mr");
      });

      await waitFor(() => {
        expect(screen.getByText("Mr Mime")).toBeInTheDocument();
      });
    });
  });

  describe("Test ID Support", () => {
    it("applies testIds to input", () => {
      render(
        <PokemonAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
          testIds={{ input: "species-input" }}
        />,
      );

      expect(screen.getByTestId("species-input")).toBeInTheDocument();
    });
  });
});
