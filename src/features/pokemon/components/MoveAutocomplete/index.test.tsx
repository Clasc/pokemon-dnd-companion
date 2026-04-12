import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MoveAutocomplete from "./index";

const mockMoveListResponse = {
  count: 4,
  next: null,
  previous: null,
  results: [
    { name: "thunderbolt", url: "https://pokeapi.co/api/v2/move/24/" },
    { name: "thunder", url: "https://pokeapi.co/api/v2/move/87/" },
    { name: "thunder-wave", url: "https://pokeapi.co/api/v2/move/86/" },
    { name: "solar-beam", url: "https://pokeapi.co/api/v2/move/76/" },
  ],
};

const mockThunderboltDetailResponse = {
  id: 24,
  name: "thunderbolt",
  pp: 15,
  type: { name: "electric", url: "https://pokeapi.co/api/v2/type/13/" },
  flavor_text_entries: [
    {
      flavor_text: "A strong electric blast that may also leave the target with paralysis.",
      language: { name: "en", url: "https://pokeapi.co/api/v2/language/9/" },
      version: { name: "red-blue", url: "https://pokeapi.co/api/v2/version/1/" },
    },
  ],
};

global.fetch = jest.fn();

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("MoveAutocomplete", () => {
  let mockOnSelect: jest.Mock;
  let mockOnChange: jest.Mock;

  beforeEach(() => {
    mockOnSelect = jest.fn();
    mockOnChange = jest.fn();
    mockedFetch.mockReset();
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMoveListResponse),
    } as Response);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial Rendering", () => {
    it("renders input with placeholder", () => {
      render(
        <MoveAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
          placeholder="Search moves..."
        />,
      );

      expect(screen.getByPlaceholderText("Search moves...")).toBeInTheDocument();
    });

    it("renders with correct initial value", () => {
      render(
        <MoveAutocomplete
          value="Thunderbolt"
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("Thunderbolt");
    });

    it("disables input when disabled prop is true", () => {
      render(
        <MoveAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
          disabled={true}
        />,
      );

      expect(screen.getByRole("textbox")).toBeDisabled();
    });
  });

  describe("Move List Loading", () => {
    it("fetches move list on mount", async () => {
      render(
        <MoveAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledWith(
          "https://pokeapi.co/api/v2/move/?limit=1000",
        );
      });
    });

    it("does not refetch move list if already loaded", async () => {
      const { rerender } = render(
        <MoveAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledTimes(1);
      });

      rerender(
        <MoveAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledTimes(1);
      });
    });

    it("shows error when move list fetch fails", async () => {
      mockedFetch.mockReset();
      mockedFetch.mockRejectedValueOnce(new Error("Network error"));

      await act(async () => {
        render(
          <MoveAutocomplete
            value=""
            onSelect={mockOnSelect}
            onChange={mockOnChange}
          />,
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Unable to load moves. Please try again.")).toBeInTheDocument();
      });
    });
  });

  describe("Search and Filtering", () => {
    it("shows suggestions when user types", async () => {
      const user = userEvent.setup();

      render(
        <MoveAutocomplete
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
        await user.type(input, "thunder");
      });

      await waitFor(() => {
        expect(screen.getByText("Thunderbolt")).toBeInTheDocument();
      });
    });

    it("filters suggestions based on input", async () => {
      mockedFetch.mockReset();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMoveListResponse),
      } as Response);

      const user = userEvent.setup();

      render(
        <MoveAutocomplete
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
        await user.type(input, "solar");
      });

      await waitFor(() => {
        const solarBeamButton = screen.queryByRole("button", { name: "Solar Beam" });
        expect(solarBeamButton).toBeInTheDocument();
      });
    });

    it("limits suggestions to 10 items", async () => {
      const manyMovesResponse = {
        ...mockMoveListResponse,
        results: Array.from({ length: 20 }, (_, i) => ({
          name: `move-${i}`,
          url: `https://pokeapi.co/api/v2/move/${i + 1}/`,
        })),
      };
      mockedFetch.mockReset();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(manyMovesResponse),
      } as Response);

      const user = userEvent.setup();

      render(
        <MoveAutocomplete
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
        await user.type(input, "move");
      });

      await waitFor(() => {
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeLessThanOrEqual(10);
      });
    });

    it.skip("shows no results message when no matches", async () => {
      mockedFetch.mockReset();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMoveListResponse),
      } as Response);

      const user = userEvent.setup();

      render(
        <MoveAutocomplete
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
        await user.type(input, "zzz");
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(screen.getByText("No moves found")).toBeInTheDocument();
    });

    it("calls onChange when user types", async () => {
      const user = userEvent.setup();

      render(
        <MoveAutocomplete
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

  describe("Move Selection", () => {
    it("fetches move details on selection", async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockThunderboltDetailResponse),
      } as Response);

      render(
        <MoveAutocomplete
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
        await user.type(input, "thunder");
      });

      await waitFor(() => {
        expect(screen.getByText("Thunderbolt")).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText("Thunderbolt"));
      });

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledWith(
          "https://pokeapi.co/api/v2/move/thunderbolt/",
        );
      });
    });

    it("calls onSelect with correct data for move with description", async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockThunderboltDetailResponse),
      } as Response);

      render(
        <MoveAutocomplete
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
        await user.type(input, "thunder");
      });

      await waitFor(() => {
        expect(screen.getByText("Thunderbolt")).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText("Thunderbolt"));
      });

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith({
          name: "thunderbolt",
          displayName: "Thunderbolt",
          pp: 15,
          description: "A strong electric blast that may also leave the target with paralysis.",
        });
      });
    });

    it("calls onSelect with empty description when no English text available", async () => {
      mockedFetch.mockReset();
      mockedFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockMoveListResponse),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              ...mockThunderboltDetailResponse,
              flavor_text_entries: [
                {
                  flavor_text: "Une attaque electrique tres puissante.",
                  language: {
                    name: "fr",
                    url: "https://pokeapi.co/api/v2/language/5/",
                  },
                  version: {
                    name: "red-blue",
                    url: "https://pokeapi.co/api/v2/version/1/",
                  },
                },
              ],
            }),
        } as Response);

      const user = userEvent.setup();

      render(
        <MoveAutocomplete
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
        await user.type(input, "thunder");
      });

      await waitFor(() => {
        expect(screen.getByText("Thunderbolt")).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText("Thunderbolt"));
      });

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith({
          name: "thunderbolt",
          displayName: "Thunderbolt",
          pp: 15,
          description: "",
        });
      });
    });

    it("closes dropdown after selection", async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockThunderboltDetailResponse),
      } as Response);

      render(
        <MoveAutocomplete
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
        await user.type(input, "thunder");
      });

      await waitFor(() => {
        expect(screen.getByText("Thunderbolt")).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText("Thunderbolt"));
      });

      await waitFor(() => {
        expect(screen.queryByRole("button", { name: "Thunderbolt" })).not.toBeInTheDocument();
      });
    });

    it("updates input value after selection", async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockThunderboltDetailResponse),
      } as Response);

      render(
        <MoveAutocomplete
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
        await user.type(input, "thunder");
      });

      await waitFor(() => {
        expect(screen.getByText("Thunderbolt")).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText("Thunderbolt"));
      });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith("Thunderbolt");
      });
    });

    it("shows error when detail fetch fails", async () => {
      const user = userEvent.setup();
      mockedFetch.mockRejectedValueOnce(new Error("Network error"));

      render(
        <MoveAutocomplete
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
        await user.type(input, "thunder");
      });

      await waitFor(() => {
        expect(screen.getByText("Thunderbolt")).toBeInTheDocument();
      });

      mockedFetch.mockRejectedValueOnce(new Error("Network error"));

      await act(async () => {
        await user.click(screen.getByText("Thunderbolt"));
      });

      await waitFor(() => {
        expect(screen.getByText("Failed to load move details. Please try again.")).toBeInTheDocument();
      });
    });
  });

  describe("Name Formatting", () => {
    it("formats hyphenated names correctly", async () => {
      const hyphenatedMovesResponse = {
        ...mockMoveListResponse,
        results: [
          { name: "thunder-wave", url: "https://pokeapi.co/api/v2/move/86/" },
          { name: "will-o-wisp", url: "https://pokeapi.co/api/v2/move/137/" },
        ],
      };
      mockedFetch.mockReset();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(hyphenatedMovesResponse),
      } as Response);

      const user = userEvent.setup();

      render(
        <MoveAutocomplete
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
        await user.type(input, "thunder-wave");
      });

      await waitFor(() => {
        expect(screen.getByText("Thunder Wave")).toBeInTheDocument();
      });
    });
  });

  describe("Test ID Support", () => {
    it("applies testIds to input", () => {
      render(
        <MoveAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
          testIds={{ input: "move-input" }}
        />,
      );

      expect(screen.getByTestId("move-input")).toBeInTheDocument();
    });
  });
});
