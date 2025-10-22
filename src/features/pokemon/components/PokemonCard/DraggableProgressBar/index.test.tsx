import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DraggableProgressBar from ".";
import { useAppStore } from "@/store";
import { Pokemon } from "@/types/pokemon";

describe("DraggableProgressBar - Accessibility", () => {
  describe("ARIA attributes", () => {
    it("renders with proper ARIA attributes for HP bar", () => {
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={jest.fn()}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      expect(slider).toHaveAttribute("aria-valuenow", "50");
      expect(slider).toHaveAttribute("aria-valuemin", "0");
      expect(slider).toHaveAttribute("aria-valuemax", "100");
      expect(slider).toHaveAttribute("aria-valuetext", "50 out of 100 HP");
    });

    it("renders with proper ARIA attributes for XP bar", () => {
      render(
        <DraggableProgressBar
          type="xp"
          current={250}
          max={500}
          onChange={jest.fn()}
          label="Experience Points"
        />,
      );

      const slider = screen.getByRole("slider", { name: "Experience Points" });
      expect(slider).toHaveAttribute("aria-valuenow", "250");
      expect(slider).toHaveAttribute("aria-valuemin", "0");
      expect(slider).toHaveAttribute("aria-valuemax", "500");
      expect(slider).toHaveAttribute("aria-valuetext", "250 out of 500 XP");
    });

    it("updates aria-valuetext when value changes", async () => {
      const onChange = jest.fn();
      const { rerender } = render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      expect(slider).toHaveAttribute("aria-valuetext", "50 out of 100 HP");

      rerender(
        <DraggableProgressBar
          type="hp"
          current={75}
          max={100}
          onChange={onChange}
          label="HP"
        />,
      );

      expect(slider).toHaveAttribute("aria-valuetext", "75 out of 100 HP");
    });

    it("handles disabled state with proper ARIA", () => {
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={jest.fn()}
          label="HP"
          disabled={true}
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      expect(slider).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("Focus management", () => {
    it("can receive keyboard focus", () => {
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={jest.fn()}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      slider.focus();
      expect(slider).toHaveFocus();
    });

    it("shows focus indicator when focused", () => {
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={jest.fn()}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      slider.focus();
      // Check for focus-visible class or similar
      expect(slider).toHaveClass("focus-visible");
    });
  });

  describe("Screen reader announcements", () => {
    it("announces value changes with live region", async () => {
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={jest.fn()}
          label="HP"
        />,
      );

      // Check for live region
      const liveRegion = screen.getByRole("status");
      expect(liveRegion).toHaveAttribute("aria-live", "polite");
      expect(liveRegion).toHaveAttribute("aria-atomic", "true");
    });
  });
});

describe("DraggableProgressBar - Mouse Interactions", () => {
  describe("Basic drag operations", () => {
    it("updates value on mouse drag to the right", async () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      const rect = slider.getBoundingClientRect();

      // Simulate drag from 50% to 75% of the bar width
      const startX = rect.left + rect.width * 0.5;
      const endX = rect.left + rect.width * 0.75;

      fireEvent.mouseDown(slider, { clientX: startX, button: 0 });
      fireEvent.mouseMove(document, { clientX: endX });
      fireEvent.mouseUp(document);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(75);
      });
    });

    it("updates value on mouse drag to the left", async () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      const rect = slider.getBoundingClientRect();

      const startX = rect.left + rect.width * 0.5;
      const endX = rect.left + rect.width * 0.25;

      fireEvent.mouseDown(slider, { clientX: startX, button: 0 });
      fireEvent.mouseMove(document, { clientX: endX });
      fireEvent.mouseUp(document);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(25);
      });
    });

    it("shows drag preview during drag", async () => {
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={jest.fn()}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });

      fireEvent.mouseDown(slider, { clientX: 50, button: 0 });

      // Check for preview element
      await waitFor(() => {
        const preview = screen.getByRole("tooltip");
        expect(preview).toBeInTheDocument();
      });

      fireEvent.mouseUp(document);

      // Preview should be removed after drag
      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });

    it("cancels drag on escape key", async () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });

      fireEvent.mouseDown(slider, { clientX: 50, button: 0 });
      fireEvent.mouseMove(document, { clientX: 75 });
      fireEvent.keyDown(document, { key: "Escape" });
      fireEvent.mouseUp(document);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Boundary conditions", () => {
    it("clamps value to maximum when dragging beyond right edge", async () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      const rect = slider.getBoundingClientRect();

      fireEvent.mouseDown(slider, {
        clientX: rect.left + rect.width * 0.5,
        button: 0,
      });
      fireEvent.mouseMove(document, { clientX: rect.right + 100 }); // Way past the edge
      fireEvent.mouseUp(document);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(100);
      });
    });

    it("clamps value to minimum when dragging beyond left edge", async () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      const rect = slider.getBoundingClientRect();

      fireEvent.mouseDown(slider, {
        clientX: rect.left + rect.width * 0.5,
        button: 0,
      });
      fireEvent.mouseMove(document, { clientX: rect.left - 100 }); // Way past the edge
      fireEvent.mouseUp(document);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(0);
      });
    });

    it("handles drag when already at maximum", () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={100}
          max={100}
          onChange={onChange}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      const rect = slider.getBoundingClientRect();

      fireEvent.mouseDown(slider, { clientX: rect.right, button: 0 });
      fireEvent.mouseMove(document, { clientX: rect.right + 50 });
      fireEvent.mouseUp(document);

      // Should not call onChange since value can't increase
      expect(onChange).not.toHaveBeenCalled();
    });

    it("handles drag when already at minimum", () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={0}
          max={100}
          onChange={onChange}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      const rect = slider.getBoundingClientRect();

      fireEvent.mouseDown(slider, { clientX: rect.left, button: 0 });
      fireEvent.mouseMove(document, { clientX: rect.left - 50 });
      fireEvent.mouseUp(document);

      // Should not call onChange since value can't decrease
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Visual feedback", () => {
    it("changes cursor to grab on hover", () => {
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={jest.fn()}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      expect(slider).toHaveStyle({ cursor: "grab" });
    });

    it("changes cursor to grabbing during drag", async () => {
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={jest.fn()}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });

      fireEvent.mouseDown(slider, { clientX: 50, button: 0 });

      await waitFor(() => {
        expect(slider).toHaveStyle({ cursor: "grabbing" });
      });

      fireEvent.mouseUp(document);
    });
  });
});

describe("DraggableProgressBar - Touch Interactions", () => {
  describe("Basic touch operations", () => {
    it("updates value on touch drag", async () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="xp"
          current={100}
          max={500}
          onChange={onChange}
          label="Experience Points"
        />,
      );

      const slider = screen.getByRole("slider", { name: "Experience Points" });
      const rect = slider.getBoundingClientRect();

      const startX = rect.left + rect.width * 0.2; // 20% = 100/500
      const endX = rect.left + rect.width * 0.6; // 60% = 300/500

      fireEvent.touchStart(slider, {
        touches: [{ clientX: startX, clientY: rect.top }],
      });
      fireEvent.touchMove(slider, {
        touches: [{ clientX: endX, clientY: rect.top }],
      });
      fireEvent.touchEnd(slider, {
        changedTouches: [{ clientX: endX, clientY: rect.top }],
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(300);
      });
    });

    it("prevents page scroll during touch drag", () => {
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={jest.fn()}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });

      const touchEvent = new TouchEvent("touchmove", {
        cancelable: true,
        touches: [{ clientX: 50, clientY: 50 } as Touch],
      });

      const preventDefault = jest.spyOn(touchEvent, "preventDefault");

      slider.dispatchEvent(touchEvent);

      expect(preventDefault).toHaveBeenCalled();
    });

    it("ignores multi-touch (only first touch active)", async () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      const rect = slider.getBoundingClientRect();

      // Start with two touches - only first touch should be used
      fireEvent.touchStart(slider, {
        touches: [
          { clientX: rect.left + rect.width * 0.5, clientY: rect.top },
          { clientX: rect.left + rect.width * 0.8, clientY: rect.top },
        ],
      });

      // Move to 70% with first touch
      fireEvent.touchMove(slider, {
        touches: [{ clientX: rect.left + rect.width * 0.7, clientY: rect.top }],
      });

      fireEvent.touchEnd(slider, {
        changedTouches: [
          { clientX: rect.left + rect.width * 0.7, clientY: rect.top },
        ],
      });

      await waitFor(() => {
        // Should only respond to first touch (70%)
        expect(onChange).toHaveBeenCalled();
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
        expect(lastCall[0]).toBeCloseTo(70, 0);
      });
    });
  });
});

describe("DraggableProgressBar - Keyboard Navigation", () => {
  describe("Arrow key navigation", () => {
    it("increases value with right arrow key", () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
          step={1}
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      slider.focus();

      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(onChange).toHaveBeenCalledWith(51);
    });

    it("decreases value with left arrow key", () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
          step={1}
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      slider.focus();

      fireEvent.keyDown(slider, { key: "ArrowLeft" });
      expect(onChange).toHaveBeenCalledWith(49);
    });

    it("increases value with up arrow key", () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
          step={1}
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      slider.focus();

      fireEvent.keyDown(slider, { key: "ArrowUp" });
      expect(onChange).toHaveBeenCalledWith(51);
    });

    it("decreases value with down arrow key", () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
          step={1}
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      slider.focus();

      fireEvent.keyDown(slider, { key: "ArrowDown" });
      expect(onChange).toHaveBeenCalledWith(49);
    });

    it("uses custom step value for keyboard navigation", () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="xp"
          current={100}
          max={500}
          onChange={onChange}
          label="Experience Points"
          step={10}
        />,
      );

      const slider = screen.getByRole("slider", { name: "Experience Points" });
      slider.focus();

      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(onChange).toHaveBeenCalledWith(110);
    });
  });

  describe("Home/End key navigation", () => {
    it("jumps to minimum with Home key", () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      slider.focus();

      fireEvent.keyDown(slider, { key: "Home" });
      expect(onChange).toHaveBeenCalledWith(0);
    });

    it("jumps to maximum with End key", () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      slider.focus();

      fireEvent.keyDown(slider, { key: "End" });
      expect(onChange).toHaveBeenCalledWith(100);
    });
  });

  describe("Page navigation keys", () => {
    it("increases value by 10% with PageUp", () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      slider.focus();

      fireEvent.keyDown(slider, { key: "PageUp" });
      expect(onChange).toHaveBeenCalledWith(60);
    });

    it("decreases value by 10% with PageDown", () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={50}
          max={100}
          onChange={onChange}
          label="HP"
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      slider.focus();

      fireEvent.keyDown(slider, { key: "PageDown" });
      expect(onChange).toHaveBeenCalledWith(40);
    });
  });

  describe("Keyboard boundary conditions", () => {
    it("does not exceed maximum with keyboard", () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={99}
          max={100}
          onChange={onChange}
          label="HP"
          step={5}
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      slider.focus();

      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(onChange).toHaveBeenCalledWith(100); // Clamped to max
    });

    it("does not go below minimum with keyboard", () => {
      const onChange = jest.fn();
      render(
        <DraggableProgressBar
          type="hp"
          current={1}
          max={100}
          onChange={onChange}
          label="HP"
          step={5}
        />,
      );

      const slider = screen.getByRole("slider", { name: "HP" });
      slider.focus();

      fireEvent.keyDown(slider, { key: "ArrowLeft" });
      expect(onChange).toHaveBeenCalledWith(0); // Clamped to min
    });
  });
});

describe("DraggableProgressBar - Visual States", () => {
  describe("HP bar colors", () => {
    it("applies red color when HP is low (0-30%)", () => {
      render(
        <DraggableProgressBar
          type="hp"
          current={20}
          max={100}
          onChange={jest.fn()}
          label="HP"
        />,
      );

      const progressFill = screen.getByRole("progressbar");
      expect(progressFill).toHaveStyle({
        backgroundColor: "var(--accent-red)",
      });
    });

    it("applies yellow color when HP is medium (31-60%)", () => {
      render(
        <DraggableProgressBar
          type="hp"
          current={45}
          max={100}
          onChange={jest.fn()}
          label="HP"
        />,
      );

      const progressFill = screen.getByRole("progressbar");
      expect(progressFill).toHaveStyle({
        backgroundColor: "var(--accent-yellow)",
      });
    });

    it("applies green color when HP is high (61-100%)", () => {
      render(
        <DraggableProgressBar
          type="hp"
          current={80}
          max={100}
          onChange={jest.fn()}
          label="HP"
        />,
      );

      const progressFill = screen.getByRole("progressbar");
      expect(progressFill).toHaveStyle({
        backgroundColor: "var(--accent-green)",
      });
    });
  });

  describe("XP bar appearance", () => {
    it("shows level-up indicator when XP is near threshold", () => {
      render(
        <DraggableProgressBar
          type="xp"
          current={495}
          max={500}
          onChange={jest.fn()}
          label="Experience Points"
          showLevelUpIndicator={true}
        />,
      );

      const levelUpIndicator = screen.getByText(/Ready to level up/i);
      expect(levelUpIndicator).toBeInTheDocument();
    });
  });
});

describe("DraggableProgressBar - Disabled State", () => {
  it("does not respond to mouse drag when disabled", () => {
    const onChange = jest.fn();
    render(
      <DraggableProgressBar
        type="hp"
        current={50}
        max={100}
        onChange={onChange}
        label="HP"
        disabled={true}
      />,
    );

    const slider = screen.getByRole("slider", { name: "HP" });

    fireEvent.mouseDown(slider, { clientX: 50, button: 0 });
    fireEvent.mouseMove(document, { clientX: 75 });
    fireEvent.mouseUp(document);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not respond to keyboard input when disabled", () => {
    const onChange = jest.fn();
    render(
      <DraggableProgressBar
        type="hp"
        current={50}
        max={100}
        onChange={onChange}
        label="HP"
        disabled={true}
      />,
    );

    const slider = screen.getByRole("slider", { name: "HP" });
    slider.focus();

    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows disabled visual state", () => {
    render(
      <DraggableProgressBar
        type="hp"
        current={50}
        max={100}
        onChange={jest.fn()}
        label="HP"
        disabled={true}
      />,
    );

    const slider = screen.getByRole("slider", { name: "HP" });
    expect(slider).toHaveClass("opacity-50");
    expect(slider).toHaveStyle({ cursor: "not-allowed" });
  });
});

describe("DraggableProgressBar - Performance", () => {
  it("debounces rapid drag movements", async () => {
    jest.useFakeTimers();
    const onChange = jest.fn();

    render(
      <DraggableProgressBar
        type="hp"
        current={50}
        max={100}
        onChange={onChange}
        label="HP"
        debounceMs={100}
      />,
    );

    const slider = screen.getByRole("slider", { name: "HP" });

    fireEvent.mouseDown(slider, { clientX: 50, button: 0 });

    // Rapid movements
    for (let i = 51; i <= 75; i++) {
      fireEvent.mouseMove(document, { clientX: i });
    }

    fireEvent.mouseUp(document);

    // Fast-forward time past debounce
    jest.advanceTimersByTime(150);

    // Should only call onChange once after debounce
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(75);

    jest.useRealTimers();
  });

  it("uses requestAnimationFrame for smooth updates", async () => {
    const rafSpy = jest.spyOn(window, "requestAnimationFrame");

    render(
      <DraggableProgressBar
        type="hp"
        current={50}
        max={100}
        onChange={jest.fn()}
        label="HP"
      />,
    );

    const slider = screen.getByRole("slider", { name: "HP" });

    fireEvent.mouseDown(slider, { clientX: 50, button: 0 });
    fireEvent.mouseMove(document, { clientX: 75 });

    expect(rafSpy).toHaveBeenCalled();

    fireEvent.mouseUp(document);
    rafSpy.mockRestore();
  });
});

describe("DraggableProgressBar - Integration with Store", () => {
  const createMockPokemon = (): Pokemon => ({
    type: "Pikachu",
    name: "Sparky",
    level: 25,
    type1: "electric",
    type2: undefined,
    currentHP: 50,
    maxHP: 100,
    experience: 200,
    experienceToNext: 500,
    attributes: {
      strength: 10,
      dexterity: 15,
      constitution: 12,
      intelligence: 8,
      wisdom: 10,
      charisma: 14,
    },
  });

  beforeEach(() => {
    const store = useAppStore.getState();
    store.reset();
  });

  it("updates Pokemon HP in store via drag", async () => {
    const mockPokemon = createMockPokemon();
    const pokemonUuid = "test-uuid-hp";
    const store = useAppStore.getState();
    store.addPokemon(mockPokemon, pokemonUuid);
    const pokemon = useAppStore.getState().pokemonTeam[pokemonUuid];

    const handleHPChange = jest.fn((value: number) => {
      const currentPokemon = useAppStore.getState().pokemonTeam[pokemonUuid];
      const diff = value - currentPokemon.currentHP;
      store.modifyPokemonHP(pokemonUuid, diff);
    });

    render(
      <DraggableProgressBar
        type="hp"
        current={pokemon.currentHP}
        max={pokemon.maxHP}
        onChange={handleHPChange}
        label="HP"
      />,
    );

    const slider = screen.getByRole("slider", { name: "HP" });

    // Drag to 75 HP (75% of 100)
    fireEvent.mouseDown(slider, { clientX: 50, button: 0 });
    fireEvent.mouseMove(document, { clientX: 75 });
    fireEvent.mouseUp(document);

    await waitFor(() => {
      expect(handleHPChange).toHaveBeenCalled();
      const updatedPokemon = useAppStore.getState().pokemonTeam[pokemonUuid];
      expect(updatedPokemon.currentHP).toBe(75);
    });
  });

  it("updates Pokemon XP in store via drag", async () => {
    const mockPokemon = createMockPokemon();
    const pokemonUuid = "test-uuid-xp";
    const store = useAppStore.getState();
    store.addPokemon(mockPokemon, pokemonUuid);
    const pokemon = useAppStore.getState().pokemonTeam[pokemonUuid];

    const handleXPChange = jest.fn((value: number) => {
      const currentPokemon = useAppStore.getState().pokemonTeam[pokemonUuid];
      const diff = value - currentPokemon.experience;
      if (diff > 0) {
        store.gainExperience(pokemonUuid, diff);
      }
    });

    render(
      <DraggableProgressBar
        type="xp"
        current={pokemon.experience}
        max={pokemon.experience + pokemon.experienceToNext}
        onChange={handleXPChange}
        label="Experience Points"
      />,
    );

    const slider = screen.getByRole("slider", {
      name: "Experience Points",
    });

    // Current: 200/700 total (28.57%), drag to 400/700 (57.14%)
    // Drag to 400 XP (57% of 700)
    fireEvent.mouseDown(slider, { clientX: 28, button: 0 });
    fireEvent.mouseMove(document, { clientX: 57 });
    fireEvent.mouseUp(document);

    await waitFor(() => {
      expect(handleXPChange).toHaveBeenCalled();
      const updatedPokemon = useAppStore.getState().pokemonTeam[pokemonUuid];
      expect(updatedPokemon.experience).toBeGreaterThanOrEqual(380);
      expect(updatedPokemon.experience).toBeLessThanOrEqual(420);
    });
  });

  it("handles level up correctly during XP drag", async () => {
    const mockPokemon = createMockPokemon();
    const pokemonUuid = "test-uuid-levelup";
    const store = useAppStore.getState();
    store.addPokemon(mockPokemon, pokemonUuid);
    const pokemon = useAppStore.getState().pokemonTeam[pokemonUuid];

    const handleXPChange = jest.fn((value: number) => {
      const currentPokemon = useAppStore.getState().pokemonTeam[pokemonUuid];
      const diff = value - currentPokemon.experience;
      if (diff > 0) {
        store.gainExperience(pokemonUuid, diff);
      }
    });

    render(
      <DraggableProgressBar
        type="xp"
        current={pokemon.experience}
        max={pokemon.experience + pokemon.experienceToNext}
        onChange={handleXPChange}
        label="Experience Points"
      />,
    );

    const slider = screen.getByRole("slider", {
      name: "Experience Points",
    });

    // Drag to max XP (should trigger level up)
    // Starting at 200/700, drag to 700
    fireEvent.mouseDown(slider, { clientX: 28, button: 0 });
    fireEvent.mouseMove(document, { clientX: 100 });
    fireEvent.mouseUp(document);

    await waitFor(() => {
      expect(handleXPChange).toHaveBeenCalled();
      const updatedPokemon = useAppStore.getState().pokemonTeam[pokemonUuid];
      // Should have leveled up
      expect(updatedPokemon.level).toBe(26);
      // XP should reset after level up
      expect(updatedPokemon.experience).toBeLessThan(500);
    });
  });
});
