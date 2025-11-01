import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProgressBar, { hpColorFor, xpColorFor, genericColorFor } from "./index";

describe("ProgressBar", () => {
  const getFill = (progressbar: HTMLElement) =>
    progressbar.firstElementChild as HTMLElement;

  it("renders HP variant with correct ARIA attributes and value text", () => {
    render(<ProgressBar variant="hp" current={50} max={100} label="HP" />);

    const bar = screen.getByRole("progressbar", { name: /hp/i });

    expect(bar).toHaveAttribute("aria-valuenow", "50");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuetext", "50 out of 100 HP");

    const fill = getFill(bar);
    expect(fill).toHaveStyle({ width: "50%" });
  });

  it("applies correct HP colors across thresholds (red, yellow, green)", () => {
    const { rerender } = render(
      <ProgressBar variant="hp" current={20} max={100} />,
    );

    let bar = screen.getByRole("progressbar");

    let fill = getFill(bar);

    expect(fill).toHaveStyle({ backgroundColor: hpColorFor(20) });

    rerender(<ProgressBar variant="hp" current={45} max={100} />);

    bar = screen.getByRole("progressbar");

    fill = getFill(bar);

    expect(fill).toHaveStyle({ backgroundColor: hpColorFor(45) });

    rerender(<ProgressBar variant="hp" current={80} max={100} />);

    bar = screen.getByRole("progressbar");

    fill = getFill(bar);

    expect(fill).toHaveStyle({ backgroundColor: hpColorFor(80) });
  });

  it("renders XP variant with XP-specific aria-valuetext and color", () => {
    render(
      <ProgressBar variant="xp" current={250} max={500} label="Experience" />,
    );
    const bar = screen.getByRole("progressbar", { name: /experience/i });
    expect(bar).toHaveAttribute("aria-valuenow", "250");
    expect(bar).toHaveAttribute("aria-valuetext", "250 out of 500 XP");
    const fill = getFill(bar);
    expect(fill).toHaveStyle({ backgroundColor: xpColorFor() });
    expect(fill).toHaveStyle({ width: "50%" });
  });

  it("renders generic variant without unit in valuetext", () => {
    render(
      <ProgressBar variant="generic" current={20} max={80} label="Load" />,
    );
    const bar = screen.getByRole("progressbar", { name: /load/i });
    expect(bar).toHaveAttribute("aria-valuetext", "20 out of 80");
    const fill = getFill(bar);
    expect(fill).toHaveStyle({ backgroundColor: genericColorFor() });
    expect(fill).toHaveStyle({ width: "25%" });
  });

  it("handles max = 0 gracefully (clamps current and shows 0%)", () => {
    render(<ProgressBar variant="hp" current={5} max={0} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemax", "0");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
    const fill = getFill(bar);
    expect(fill).toHaveStyle({ width: "0%" });
  });

  it("respects getColorOverride for custom color logic", () => {
    render(
      <ProgressBar
        variant="hp"
        current={70}
        max={100}
        getColorOverride={() => "rgb(255, 0, 0)"}
      />,
    );
    const bar = screen.getByRole("progressbar");
    const fill = getFill(bar);
    expect(fill).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" });
  });

  it("clamps current value above max and reflects 100% width", () => {
    render(<ProgressBar variant="xp" current={250} max={100} />);
    const bar = screen.getByRole("progressbar");
    const fill = getFill(bar);
    expect(fill).toHaveStyle({ width: "100%" });
  });
});
