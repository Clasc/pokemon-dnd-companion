import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemAutocomplete from "./index";

const mockItemListResponse = {
  count: 4,
  next: null,
  previous: null,
  results: [
    { name: "master-ball", url: "https://pokeapi.co/api/v2/item/1/" },
    { name: "ultra-ball", url: "https://pokeapi.co/api/v2/item/2/" },
    { name: "great-ball", url: "https://pokeapi.co/api/v2/item/3/" },
    { name: "potion", url: "https://pokeapi.co/api/v2/item/21/" },
  ],
};

const mockMasterBallDetailResponse = {
  id: 1,
  name: "master-ball",
  sprites: {
    default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png",
  },
  flavor_text_entries: [
    {
      text: "The best Poké Ball with the ultimate level of performance. With it, you will catch any wild Pokémon without fail.",
      language: { name: "en", url: "https://pokeapi.co/api/v2/language/9/" },
      version: { name: "x-y", url: "https://pokeapi.co/api/v2/version/25/" },
    },
  ],
};

global.fetch = jest.fn();

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("ItemAutocomplete", () => {
  let mockOnSelect: jest.Mock;
  let mockOnChange: jest.Mock;

  beforeEach(() => {
    mockOnSelect = jest.fn();
    mockOnChange = jest.fn();
    mockedFetch.mockReset();
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockItemListResponse),
    } as Response);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial Rendering", () => {
    it("renders input with placeholder", () => {
      render(
        <ItemAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
          placeholder="Search items..."
        />,
      );

      expect(screen.getByPlaceholderText("Search items...")).toBeInTheDocument();
    });

    it("renders with correct initial value", () => {
      render(
        <ItemAutocomplete
          value="Master Ball"
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("Master Ball");
    });

    it("disables input when disabled prop is true", () => {
      render(
        <ItemAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
          disabled={true}
        />,
      );

      expect(screen.getByRole("textbox")).toBeDisabled();
    });
  });

  describe("Item List Loading", () => {
    it("fetches item list on mount", async () => {
      render(
        <ItemAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledWith(
          "https://pokeapi.co/api/v2/item/?limit=2000",
        );
      });
    });

    it("does not refetch item list if already loaded", async () => {
      const { rerender } = render(
        <ItemAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledTimes(1);
      });

      rerender(
        <ItemAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
        />,
      );

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledTimes(1);
      });
    });

    it("shows error when item list fetch fails", async () => {
      mockedFetch.mockReset();
      mockedFetch.mockRejectedValueOnce(new Error("Network error"));

      await act(async () => {
        render(
          <ItemAutocomplete
            value=""
            onSelect={mockOnSelect}
            onChange={mockOnChange}
          />,
        );
      });

      await waitFor(() => {
        expect(
          screen.getByText("Unable to load items. Please try again."),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Search and Filtering", () => {
    it("shows suggestions when user types", async () => {
      const user = userEvent.setup();

      render(
        <ItemAutocomplete
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
        await user.type(input, "master");
      });

      await waitFor(() => {
        expect(screen.getByText("Master Ball")).toBeInTheDocument();
      });
    });

    it("filters suggestions based on input", async () => {
      mockedFetch.mockReset();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockItemListResponse),
      } as Response);

      const user = userEvent.setup();

      render(
        <ItemAutocomplete
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
        await user.type(input, "potion");
      });

      await waitFor(() => {
        expect(screen.getByText("Potion")).toBeInTheDocument();
      });
    });

    it("limits suggestions to 10 items", async () => {
      const manyItemsResponse = {
        ...mockItemListResponse,
        results: Array.from({ length: 20 }, (_, i) => ({
          name: `item-${i}`,
          url: `https://pokeapi.co/api/v2/item/${i + 1}/`,
        })),
      };
      mockedFetch.mockReset();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(manyItemsResponse),
      } as Response);

      const user = userEvent.setup();

      render(
        <ItemAutocomplete
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
        await user.type(input, "item");
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
        json: () => Promise.resolve(mockItemListResponse),
      } as Response);

      const user = userEvent.setup();

      render(
        <ItemAutocomplete
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

      await waitFor(
        () => {
          expect(screen.getByText("No items found")).toBeInTheDocument();
        },
        { timeout: 1000 },
      );
    });

    it("calls onChange when user types", async () => {
      const user = userEvent.setup();

      render(
        <ItemAutocomplete
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

  describe("Item Selection", () => {
    it("fetches item details on selection", async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMasterBallDetailResponse),
      } as Response);

      render(
        <ItemAutocomplete
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
        await user.type(input, "master");
      });

      await waitFor(() => {
        expect(screen.getByText("Master Ball")).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText("Master Ball"));
      });

      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledWith(
          "https://pokeapi.co/api/v2/item/master-ball/",
        );
      });
    });

    it("calls onSelect with correct data", async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMasterBallDetailResponse),
      } as Response);

      render(
        <ItemAutocomplete
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
        await user.type(input, "master");
      });

      await waitFor(() => {
        expect(screen.getByText("Master Ball")).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText("Master Ball"));
      });

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith({
          name: "master-ball",
          displayName: "Master Ball",
          description:
            "The best Poké Ball with the ultimate level of performance. With it, you will catch any wild Pokémon without fail.",
          spriteUrl:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png",
        });
      });
    });

    it("closes dropdown after selection", async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMasterBallDetailResponse),
      } as Response);

      render(
        <ItemAutocomplete
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
        await user.type(input, "master");
      });

      await waitFor(() => {
        expect(screen.getByText("Master Ball")).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText("Master Ball"));
      });

      await waitFor(() => {
        expect(
          screen.queryByRole("button", { name: "Master Ball" }),
        ).not.toBeInTheDocument();
      });
    });

    it("updates input value after selection", async () => {
      const user = userEvent.setup();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMasterBallDetailResponse),
      } as Response);

      render(
        <ItemAutocomplete
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
        await user.type(input, "master");
      });

      await waitFor(() => {
        expect(screen.getByText("Master Ball")).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText("Master Ball"));
      });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith("Master Ball");
      });
    });

    it("shows error when detail fetch fails", async () => {
      const user = userEvent.setup();
      mockedFetch.mockRejectedValueOnce(new Error("Network error"));

      render(
        <ItemAutocomplete
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
        await user.type(input, "master");
      });

      await waitFor(() => {
        expect(screen.getByText("Master Ball")).toBeInTheDocument();
      });

      mockedFetch.mockRejectedValueOnce(new Error("Network error"));

      await act(async () => {
        await user.click(screen.getByText("Master Ball"));
      });

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load item details. Please try again."),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Name Formatting", () => {
    it("formats hyphenated names correctly", async () => {
      const hyphenatedItemsResponse = {
        ...mockItemListResponse,
        results: [
          { name: "ultra-ball", url: "https://pokeapi.co/api/v2/item/2/" },
          { name: "great-ball", url: "https://pokeapi.co/api/v2/item/3/" },
        ],
      };
      mockedFetch.mockReset();
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(hyphenatedItemsResponse),
      } as Response);

      const user = userEvent.setup();

      render(
        <ItemAutocomplete
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
        await user.type(input, "ultra");
      });

      await waitFor(() => {
        expect(screen.getByText("Ultra Ball")).toBeInTheDocument();
      });
    });
  });

  describe("Test ID Support", () => {
    it("applies testIds to input", () => {
      render(
        <ItemAutocomplete
          value=""
          onSelect={mockOnSelect}
          onChange={mockOnChange}
          testIds={{ input: "item-input" }}
        />,
      );

      expect(screen.getByTestId("item-input")).toBeInTheDocument();
    });
  });
});
