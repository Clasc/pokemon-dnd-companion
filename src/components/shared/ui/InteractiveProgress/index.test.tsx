import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import InteractiveProgress from "@/components/shared/ui/InteractiveProgress";
import {
  mockElementRect,
  withSynchronousRaf,
  flushDebounce,
} from "@/tests/utils/mockGeometry";

/**
 * Helper to render the progress bar and return useful handles.
 */
function renderBar(
  props: Partial<React.ComponentProps<typeof InteractiveProgress>> & {
    type?: "hp" | "xp";
    current?: number;
    max?: number;
    label?: string;
  } = {},
) {
  const {
    type = "hp",
    current = 50,
    max = 100,
    label = type === "hp" ? "HP" : "Experience Points",
    onChange = jest.fn(),
    ...rest
  } = props;
  const utils = render(
    <InteractiveProgress
      type={type}
      current={current}
      max={max}
      onChange={onChange}
      label={label}
      {...rest}
    />,
  );
  return {
    slider: screen.getByRole("slider", { name: label }),
    onChange,
    rerender: utils.rerender,
  };
}

describe("InteractiveProgress - Accessibility", () => {
  describe("ARIA attributes", () => {
    it("renders with proper ARIA attributes for HP bar", () => {
      const { slider } = renderBar({ type: "hp", current: 50, max: 100 });

      expect(slider).toHaveAttribute("aria-valuenow", "50");
      expect(slider).toHaveAttribute("aria-valuemin", "0");
      expect(slider).toHaveAttribute("aria-valuemax", "100");
      expect(slider).toHaveAttribute("aria-valuetext", "50 out of 100 HP");
    });

    it("renders with proper ARIA attributes for XP bar", () => {
      const { slider } = renderBar({
        type: "xp",
        current: 250,
        max: 500,
        label: "Experience Points",
      });

      expect(slider).toHaveAttribute("aria-valuenow", "250");
      expect(slider).toHaveAttribute("aria-valuemin", "0");
      expect(slider).toHaveAttribute("aria-valuemax", "500");
      expect(slider).toHaveAttribute("aria-valuetext", "250 out of 500 XP");
    });

    it("updates aria-valuetext when value changes via rerender", () => {
      const onChange = jest.fn();
      const { slider, rerender } = renderBar({
        type: "hp",
        current: 50,
        max: 100,
        onChange,
        label: "HP",
      });
      expect(slider).toHaveAttribute("aria-valuetext", "50 out of 100 HP");

      rerender(
        <InteractiveProgress
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
      const { slider } = renderBar({
        type: "hp",
        current: 50,
        max: 100,
        disabled: true,
      });
      expect(slider).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("Focus management", () => {
    it("can receive keyboard focus", () => {
      const { slider } = renderBar();
      slider.focus();
      expect(slider).toHaveFocus();
    });

    it("shows focus indicator when focused", () => {
      const { slider } = renderBar();
      // Fire the focus event so React onFocus handler sets isFocused state
      fireEvent.focus(slider);
      expect(slider).toHaveClass("focus-visible");
    });
  });

  describe("Screen reader announcements", () => {
    it("announces value changes with live region", () => {
      renderBar();
      const liveRegion = screen.getByRole("status");
      expect(liveRegion).toHaveAttribute("aria-live", "polite");
      expect(liveRegion).toHaveAttribute("aria-atomic", "true");
    });
  });
});

describe("InteractiveProgress - Mouse Interactions", () => {
  let restoreRect: (() => void) | null = null;

  afterEach(() => {
    if (restoreRect) {
      restoreRect();
      restoreRect = null;
    }
  });

  describe("Basic drag operations", () => {
    it("updates value on mouse drag to the right", async () => {
      const { slider, onChange } = renderBar();
      restoreRect = mockElementRect(slider, { width: 100 });

      withSynchronousRaf(() => {
        fireEvent.mouseDown(slider, { clientX: 50, button: 0 });
        fireEvent.mouseMove(document, { clientX: 75 });
        fireEvent.mouseUp(document);
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(75);
      });
    });

    it("updates value on mouse drag to the left", async () => {
      const { slider, onChange } = renderBar();
      restoreRect = mockElementRect(slider, { width: 100 });

      withSynchronousRaf(() => {
        withSynchronousRaf(() => {
          fireEvent.mouseDown(slider, { clientX: 50, button: 0 });
        });
        fireEvent.mouseMove(document, { clientX: 25 });
        fireEvent.mouseUp(document);
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(25);
      });
    });

    it("shows drag preview during drag", async () => {
      const { slider } = renderBar();
      restoreRect = mockElementRect(slider, { width: 100 });

      fireEvent.mouseDown(slider, { clientX: 50, button: 0 });

      const preview = await screen.findByRole("tooltip");
      expect(preview).toBeInTheDocument();

      fireEvent.mouseUp(document);

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });

    it("cancels drag on escape key (no onChange)", () => {
      const { slider, onChange } = renderBar();
      restoreRect = mockElementRect(slider, { width: 100 });

      withSynchronousRaf(() => {
        fireEvent.mouseDown(slider, { clientX: 50, button: 0 });
        fireEvent.mouseMove(document, { clientX: 75 });
        fireEvent.keyDown(document, { key: "Escape" });
        fireEvent.mouseUp(document);
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Boundary conditions", () => {
    it("clamps value to maximum when dragging beyond right edge", async () => {
      const { slider, onChange } = renderBar({ current: 50, max: 100 });
      restoreRect = mockElementRect(slider, { width: 100 });

      withSynchronousRaf(() => {
        fireEvent.mouseDown(slider, { clientX: 50, button: 0 });
        fireEvent.mouseMove(document, { clientX: 250 }); // Far beyond
        fireEvent.mouseUp(document);
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(100);
      });
    });

    it("clamps value to minimum when dragging beyond left edge", async () => {
      const { slider, onChange } = renderBar({ current: 50 });
      restoreRect = mockElementRect(slider, { width: 100 });

      withSynchronousRaf(() => {
        fireEvent.mouseDown(slider, { clientX: 50, button: 0 });
        fireEvent.mouseMove(document, { clientX: -100 }); // Far left
        fireEvent.mouseUp(document);
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(0);
      });
    });

    it("does not call onChange when already at maximum", () => {
      const { slider, onChange } = renderBar({ current: 100, max: 100 });
      restoreRect = mockElementRect(slider, { width: 100 });

      withSynchronousRaf(() => {
        fireEvent.mouseDown(slider, { clientX: 100, button: 0 });
        fireEvent.mouseMove(document, { clientX: 150 });
        fireEvent.mouseUp(document);
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it("does not call onChange when already at minimum", () => {
      const { slider, onChange } = renderBar({ current: 0, max: 100 });
      restoreRect = mockElementRect(slider, { width: 100 });

      withSynchronousRaf(() => {
        fireEvent.mouseDown(slider, { clientX: 0, button: 0 });
        fireEvent.mouseMove(document, { clientX: -50 });
        fireEvent.mouseUp(document);
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Visual feedback", () => {
    it("changes cursor to grab on initial render", () => {
      const { slider } = renderBar();
      expect(slider).toHaveStyle({ cursor: "grab" });
    });

    it("changes cursor to grabbing during drag", async () => {
      const { slider } = renderBar();
      withSynchronousRaf(() => {
        fireEvent.mouseDown(slider, { clientX: 50, button: 0 });
      });

      await waitFor(() => {
        expect(slider).toHaveStyle({ cursor: "grabbing" });
      });

      fireEvent.mouseUp(document);
    });
  });
});

describe("InteractiveProgress - Touch Interactions", () => {
  let restoreRect: (() => void) | null = null;

  afterEach(() => {
    if (restoreRect) {
      restoreRect();
      restoreRect = null;
    }
  });

  describe("Basic touch operations", () => {
    it("updates value on touch drag", async () => {
      const { slider, onChange } = renderBar({
        type: "xp",
        current: 100,
        max: 500,
        label: "Experience Points",
      });
      restoreRect = mockElementRect(slider, { width: 500 });

      fireEvent.touchStart(slider, { touches: [{ clientX: 100 }] });
      fireEvent.touchMove(slider, { touches: [{ clientX: 300 }] });
      fireEvent.touchEnd(slider, { changedTouches: [{ clientX: 300 }] });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(300);
      });
    });

    it("updates aria-valuenow during intermediate touch move", () => {
      const { slider } = renderBar();
      restoreRect = mockElementRect(slider, { width: 100 });

      fireEvent.touchStart(slider, { touches: [{ clientX: 50, clientY: 0 }] });
      fireEvent.touchMove(slider, { touches: [{ clientX: 60, clientY: 0 }] });

      expect(slider).toHaveAttribute("aria-valuenow", "60");
    });

    it("ignores second touch (multi-touch) and tracks first only", async () => {
      const { slider, onChange } = renderBar();
      restoreRect = mockElementRect(slider, { width: 100 });

      fireEvent.touchStart(slider, {
        touches: [
          { clientX: 50, clientY: 0 },
          { clientX: 80, clientY: 0 },
        ],
      });
      fireEvent.touchMove(slider, { touches: [{ clientX: 70, clientY: 0 }] });
      fireEvent.touchEnd(slider, {
        changedTouches: [{ clientX: 70, clientY: 0 }],
      });

      await waitFor(() => {
        const calls = (onChange as jest.Mock).mock.calls;
        expect(calls[calls.length - 1][0]).toBe(70);
      });
    });
  });
});

describe("InteractiveProgress - Keyboard Navigation", () => {
  describe("Arrow keys", () => {
    it("ArrowRight increases value", () => {
      const { slider, onChange } = renderBar({ current: 50, step: 1 });
      slider.focus();
      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(onChange).toHaveBeenCalledWith(51);
    });

    it("ArrowLeft decreases value", () => {
      const { slider, onChange } = renderBar({ current: 50, step: 1 });
      slider.focus();
      fireEvent.keyDown(slider, { key: "ArrowLeft" });
      expect(onChange).toHaveBeenCalledWith(49);
    });

    it("ArrowUp increases value", () => {
      const { slider, onChange } = renderBar({ current: 50, step: 1 });
      slider.focus();
      fireEvent.keyDown(slider, { key: "ArrowUp" });
      expect(onChange).toHaveBeenCalledWith(51);
    });

    it("ArrowDown decreases value", () => {
      const { slider, onChange } = renderBar({ current: 50, step: 1 });
      slider.focus();
      fireEvent.keyDown(slider, { key: "ArrowDown" });
      expect(onChange).toHaveBeenCalledWith(49);
    });

    it("respects custom step", () => {
      const { slider, onChange } = renderBar({
        type: "xp",
        current: 100,
        max: 500,
        step: 10,
        label: "Experience Points",
      });
      slider.focus();
      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(onChange).toHaveBeenCalledWith(110);
    });
  });

  describe("Home/End keys", () => {
    it("Home jumps to minimum", () => {
      const { slider, onChange } = renderBar({ current: 50 });
      slider.focus();
      fireEvent.keyDown(slider, { key: "Home" });
      expect(onChange).toHaveBeenCalledWith(0);
    });

    it("End jumps to maximum", () => {
      const { slider, onChange } = renderBar({ current: 50, max: 100 });
      slider.focus();
      fireEvent.keyDown(slider, { key: "End" });
      expect(onChange).toHaveBeenCalledWith(100);
    });
  });

  describe("PageUp / PageDown keys", () => {
    it("PageUp increases by 10% of max", () => {
      const { slider, onChange } = renderBar({ current: 50, max: 100 });
      slider.focus();
      fireEvent.keyDown(slider, { key: "PageUp" });
      expect(onChange).toHaveBeenCalledWith(60);
    });

    it("PageDown decreases by 10% of max", () => {
      const { slider, onChange } = renderBar({ current: 50, max: 100 });
      slider.focus();
      fireEvent.keyDown(slider, { key: "PageDown" });
      expect(onChange).toHaveBeenCalledWith(40);
    });
  });

  describe("Keyboard boundaries", () => {
    it("does not exceed maximum", () => {
      const { slider, onChange } = renderBar({
        current: 99,
        max: 100,
        step: 5,
      });
      slider.focus();
      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(onChange).toHaveBeenCalledWith(100);
    });

    it("does not go below minimum", () => {
      const { slider, onChange } = renderBar({
        current: 1,
        max: 100,
        step: 5,
      });
      slider.focus();
      fireEvent.keyDown(slider, { key: "ArrowLeft" });
      expect(onChange).toHaveBeenCalledWith(0);
    });
  });
});

describe("InteractiveProgress - Visual States", () => {
  describe("HP color ranges", () => {
    it("low HP (0-30%) is red", () => {
      renderBar({ type: "hp", current: 20, max: 100 });
      const fill = screen.getByRole("progressbar");
      expect(fill).toHaveStyle({ backgroundColor: "var(--accent-red)" });
    });

    it("medium HP (31-60%) is yellow", () => {
      renderBar({ type: "hp", current: 45, max: 100 });
      const fill = screen.getByRole("progressbar");
      expect(fill).toHaveStyle({ backgroundColor: "var(--accent-yellow)" });
    });

    it("high HP (61-100%) is green", () => {
      renderBar({ type: "hp", current: 80, max: 100 });
      const fill = screen.getByRole("progressbar");
      expect(fill).toHaveStyle({ backgroundColor: "var(--accent-green)" });
    });
  });

  describe("XP indicator", () => {
    it("shows level-up indicator near threshold", () => {
      renderBar({
        type: "xp",
        current: 495,
        max: 500,
        label: "Experience Points",
        showLevelUpIndicator: true,
      });
      expect(screen.getByText(/Ready to level up/i)).toBeInTheDocument();
    });
  });
});

describe("InteractiveProgress - Disabled State", () => {
  it("ignores mouse drag when disabled", () => {
    const { slider, onChange } = renderBar({ disabled: true });
    withSynchronousRaf(() => {
      fireEvent.mouseDown(slider, { clientX: 50, button: 0 });
      fireEvent.mouseMove(document, { clientX: 75 });
    });
    fireEvent.mouseUp(document);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("ignores keyboard when disabled", () => {
    const { slider, onChange } = renderBar({ disabled: true });
    slider.focus();
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows disabled visual styles", () => {
    const { slider } = renderBar({ disabled: true });
    expect(slider).toHaveClass("opacity-50");
    expect(slider).toHaveStyle({ cursor: "not-allowed" });
  });
});

describe("InteractiveProgress - Performance", () => {
  it("debounces rapid drag movements", () => {
    jest.useFakeTimers();
    const onChange = jest.fn();
    const { slider } = renderBar({ debounceMs: 100, onChange });
    const restore = mockElementRect(slider, { width: 100 });

    withSynchronousRaf(() => {
      fireEvent.mouseDown(slider, { clientX: 50, button: 0 });
      for (let x = 51; x <= 75; x++) {
        fireEvent.mouseMove(document, { clientX: x });
      }
      fireEvent.mouseUp(document);
    });

    act(() => {
      flushDebounce(150);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(75);

    restore();
    jest.useRealTimers();
  });

  it("schedules updates with requestAnimationFrame", () => {
    const rafSpy = jest.spyOn(window, "requestAnimationFrame");
    const { slider } = renderBar();
    const restore = mockElementRect(slider, { width: 100 });

    fireEvent.mouseDown(slider, { clientX: 50, button: 0 });
    fireEvent.mouseMove(document, { clientX: 75 });

    expect(rafSpy).toHaveBeenCalled();

    fireEvent.mouseUp(document);
    rafSpy.mockRestore();
    restore();
  });
});
