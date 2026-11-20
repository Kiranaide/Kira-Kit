import * as React from "react";

interface FocusPosition {
  row: number;
  col: number;
}

interface UseFocusManagerOptions {
  /** Total number of rows */
  rowCount: number;
  /** Total number of columns */
  colCount: number;
  /** Initial focused position */
  initialPosition?: FocusPosition;
  /** Whether to wrap around at edges */
  wrap?: boolean;
  /** Callback when position changes */
  onPositionChange?: (position: FocusPosition) => void;
  /** Whether the grid is enabled (default: true) */
  enabled?: boolean;
}

interface UseFocusManagerReturn {
  /** Current focused position */
  position: FocusPosition;
  /** Set focus position directly */
  setPosition: (position: FocusPosition) => void;
  /** Move focus in a direction */
  move: (direction: "up" | "down" | "left" | "right") => void;
  moveToRowStart: () => void;
  moveToRowEnd: () => void;
  /** Move to first cell (0, 0) */
  moveToStart: () => void;
  /** Move to last cell */
  moveToEnd: () => void;
  /** Get tabIndex for a cell */
  getTabIndex: (row: number, col: number) => 0 | -1;
  /** Check if a cell is focused */
  isFocused: (row: number, col: number) => boolean;
  /** Handle keyboard event for navigation */
  handleKeyDown: (event: React.KeyboardEvent) => boolean;
  /** Ref callback for the container element */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Focus the current position */
  focusCurrent: () => void;
}

type FocusDirection = "up" | "down" | "left" | "right";

function clampPosition(
  position: FocusPosition,
  rowCount: number,
  colCount: number,
): FocusPosition {
  return {
    row: Math.max(0, Math.min(rowCount - 1, position.row)),
    col: Math.max(0, Math.min(colCount - 1, position.col)),
  };
}

function nextPosition(
  position: FocusPosition,
  direction: FocusDirection,
  options: UseFocusManagerOptions,
): FocusPosition {
  const offsets = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
  } as const;

  const [rowOffset, colOffset] = offsets[direction];
  let row = position.row + rowOffset;
  let col = position.col + colOffset;

  if (options.wrap) {
    const rows = Math.max(1, options.rowCount);
    const cols = Math.max(1, options.colCount);
    row = (row + rows) % rows;
    col = (col + cols) % cols;
  }

  return clampPosition({ row, col }, options.rowCount, options.colCount);
}

function useFocusPosition(options: UseFocusManagerOptions) {
  const {
    rowCount,
    colCount,
    initialPosition = { row: 0, col: 0 },
    onPositionChange,
  } = options;

  const [state, setState] = React.useState<{
    position: FocusPosition;
    correction: FocusPosition | null;
  }>(() => ({ position: initialPosition, correction: null }));

  const position = clampPosition(state.position, rowCount, colCount);

  if (
    position.row !== state.position.row ||
    position.col !== state.position.col
  )
    setState({ position, correction: position });
  const notified = React.useRef<FocusPosition | null>(null);
  React.useEffect(() => {
    if (state.correction && notified.current !== state.correction) {
      notified.current = state.correction;
      onPositionChange?.(state.correction);
    }
  }, [state.correction, onPositionChange]);

  const setPosition = React.useCallback(
    (next: FocusPosition) => {
      const clamped = clampPosition(next, rowCount, colCount);
      setState({ position: clamped, correction: null });
      onPositionChange?.(clamped);
    },
    [rowCount, colCount, onPositionChange],
  );

  return { position, setPosition };
}

function useFocusNavigation(
  options: UseFocusManagerOptions,
  position: FocusPosition,
  setPosition: UseFocusManagerReturn["setPosition"],
) {
  const { enabled = true, rowCount, colCount, wrap = false } = options;

  const move = React.useCallback(
    (direction: FocusDirection) => {
      if (enabled)
        setPosition(
          nextPosition(position, direction, { rowCount, colCount, wrap }),
        );
    },
    [enabled, position, setPosition, rowCount, colCount, wrap],
  );

  const moveToRowStart = React.useCallback(() => {
    if (enabled) setPosition({ row: position.row, col: 0 });
  }, [enabled, position.row, setPosition]);

  const moveToRowEnd = React.useCallback(() => {
    if (enabled) setPosition({ row: position.row, col: colCount - 1 });
  }, [enabled, position.row, colCount, setPosition]);

  const moveToStart = React.useCallback(() => {
    if (enabled) setPosition({ row: 0, col: 0 });
  }, [enabled, setPosition]);

  const moveToEnd = React.useCallback(() => {
    if (enabled) setPosition({ row: rowCount - 1, col: colCount - 1 });
  }, [enabled, rowCount, colCount, setPosition]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent): boolean => {
      if (!enabled) return false;

      const actions = {
        ArrowUp: () => move("up"),
        ArrowDown: () => move("down"),
        ArrowLeft: () => move("left"),
        ArrowRight: () => move("right"),
        Home: event.ctrlKey || event.metaKey ? moveToStart : moveToRowStart,
        End: event.ctrlKey || event.metaKey ? moveToEnd : moveToRowEnd,
      };

      const action = Object.entries(actions).find(
        ([key]) => key === event.key,
      )?.[1];

      if (!action) return false;
      action();
      event.preventDefault();
      event.stopPropagation();

      return true;
    },
    [enabled, move, moveToStart, moveToEnd, moveToRowStart, moveToRowEnd],
  );

  return {
    move,
    moveToRowStart,
    moveToRowEnd,
    moveToStart,
    moveToEnd,
    handleKeyDown,
  };
}

export function useFocusManager(
  options: UseFocusManagerOptions,
): UseFocusManagerReturn {
  const { enabled = true } = options;
  const { position, setPosition } = useFocusPosition(options);
  const navigation = useFocusNavigation(options, position, setPosition);
  const containerRef = React.useRef<HTMLElement>(null);

  const isFocused = React.useCallback(
    (row: number, col: number) => position.row === row && position.col === col,
    [position.row, position.col],
  );

  const getTabIndex = React.useCallback(
    (row: number, col: number): 0 | -1 =>
      enabled && isFocused(row, col) ? 0 : -1,
    [enabled, isFocused],
  );

  const focusCurrent = React.useCallback(() => {
    const selector =
      '[data-row="' + position.row + '"][data-col="' + position.col + '"]';

    containerRef.current?.querySelector<HTMLElement>(selector)?.focus();
  }, [position.row, position.col]);

  React.useEffect(() => {
    if (enabled) focusCurrent();
  }, [enabled, focusCurrent]);

  return {
    ...navigation,
    position,
    setPosition,
    getTabIndex,
    isFocused,
    containerRef,
    focusCurrent,
  };
}

export type { FocusPosition, UseFocusManagerOptions, UseFocusManagerReturn };
