/**
 * Geometry & animation test utilities.
 *
 * Provides deterministic mocking of element geometry (getBoundingClientRect)
 * and a helper to run test code with a synchronous requestAnimationFrame.
 *
 * Goals:
 * - Eliminate ad-hoc inline rect stubs.
 * - Make drag / slider math tests predictable.
 * - Avoid brittle reliance on JSDOM's default 0-width elements.
 *
 * Usage (in a test):
 *   const restore = mockElementRect(myElement, { width: 250 });
 *   // ... run assertions
 *   restore(); // ALWAYS restore to avoid leaking mocks across tests
 *
 * For multiple elements you can collect restore callbacks and call them in afterEach.
 *
 * Synchronous RAF usage:
 *   withSynchronousRaf(() => {
 *     // Code that schedules requestAnimationFrame callbacks
 *     // They execute immediately within this block.
 *   });
 */

type Mutable<T> = { -readonly [K in keyof T]: T[K] };

export interface MockRectOptions {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}

/**
 * Returns a stable DOMRect-like object (the minimal fields used by code).
 * We intentionally avoid constructing a real DOMRect to keep things simple and
 * fully serializable.
 */
function buildRect(options: MockRectOptions): DOMRect {
  const {
    width = 100,
    height = 10,
    left = 0,
    top = 0,
    right = left + width,
    bottom = top + height,
  } = options;

  // Create a plain object matching DOMRectReadOnly fields
  const rect: Partial<Mutable<DOMRect>> = {
    x: left,
    y: top,
    left,
    top,
    right,
    bottom,
    width,
    height,
  };

  // Fill any missing numeric properties JSDOM consumers might read
  const requiredNumeric: Array<keyof DOMRect> = [
    "x",
    "y",
    "left",
    "top",
    "right",
    "bottom",
    "width",
    "height",
  ];

  for (const key of requiredNumeric) {
    if (typeof rect[key] !== "number") {
      (rect as DOMRect)[key] = 0;
    }
  }

  // Cast to DOMRect (good enough for tests)
  return rect as DOMRect;
}

/**
 * Mock getBoundingClientRect for a specific HTMLElement.
 *
 * Returns a restore function that MUST be called after the test.
 */
export function mockElementRect(
  element: HTMLElement,
  options: MockRectOptions = {},
): () => void {
  if (!element) {
    throw new Error(
      "mockElementRect: element is required (received null/undefined)",
    );
  }

  const original = element.getBoundingClientRect.bind(element);
  const rect = buildRect(options);

  // Use jest.spyOn when available for better reporting; fallback to manual assignment.
  let restore: () => void;

  if (typeof jest !== "undefined" && jest.spyOn) {
    const spy = jest.spyOn(element, "getBoundingClientRect");
    spy.mockImplementation(() => rect);
    restore = () => {
      spy.mockRestore();
    };
  } else {
    // Manual override
    (element as any).getBoundingClientRect = () => rect;
    restore = () => {
      (element as any).getBoundingClientRect = original;
    };
  }

  return restore;
}

/**
 * Run a block of code with requestAnimationFrame made synchronous (callbacks fire immediately).
 *
 * Useful for debounced / animated drag update tests so you don't need manual timers or nested awaits.
 */
export function withSynchronousRaf<T>(run: () => T): T {
  const g: any = globalThis as any;
  const originalRAF = g.requestAnimationFrame;
  const originalCancel = g.cancelAnimationFrame;

  let frameId = 0;
  const active = new Set<number>();

  g.requestAnimationFrame = (cb: FrameRequestCallback): number => {
    frameId += 1;
    active.add(frameId);
    const now =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    // Execute callback immediately
    cb(now);
    return frameId;
  };

  g.cancelAnimationFrame = (id: number) => {
    active.delete(id);
  };

  try {
    return run();
  } finally {
    g.requestAnimationFrame = originalRAF;
    g.cancelAnimationFrame = originalCancel;
    active.clear();
  }
}

/**
 * Advance fake timers to flush setTimeout-based debounce logic conveniently.
 * Only call when using jest fake timers.
 *
 * @param ms milliseconds to advance (defaults to 0 => run all pending).
 */
export function flushDebounce(ms: number = 0) {
  if (
    typeof jest === "undefined" ||
    !(jest as any).advanceTimersByTime ||
    !(jest as any).runOnlyPendingTimers
  ) {
    throw new Error(
      "flushDebounce requires Jest fake timers (enable with jest.useFakeTimers())",
    );
  }

  if (ms > 0) {
    (jest as any).advanceTimersByTime(ms);
  } else {
    (jest as any).runOnlyPendingTimers();
  }
}
