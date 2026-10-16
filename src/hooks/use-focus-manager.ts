import * as React from "react";

// ============================================
// USE FOCUS MANAGER HOOK
// ============================================
// Implements roving tabindex pattern for grid/table navigation
// Following WAI-ARIA grid navigation best practices

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
  /** Move to start of current row */
  moveToRowStart: () => void;
  /** Move to end of current row */
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
  containerRef: React.RefObject<HTMLElement>;
  /** Focus the current position */
  focusCurrent: () => void;
}

export function useFocusManager(
  options: UseFocusManagerOptions
): UseFocusManagerReturn {
  const {
    rowCount,
    colCount,
    initialPosition = { row: 0, col: 0 },
    wrap = false,
    onPositionChange,
    enabled = true,
  } = options;

  const [position, setPositionState] = React.useState<FocusPosition>(
    initialPosition
  );

  const containerRef = React.useRef<HTMLElement>(null);

  // Clamp position to valid range
  const clamp = React.useCallback(
    (pos: FocusPosition): FocusPosition => ({
      row: Math.max(0, Math.min(rowCount - 1, pos.row)),
      col: Math.max(0, Math.min(colCount - 1, pos.col)),
    }),
    [rowCount, colCount]
  );

  const setPosition = React.useCallback(
    (newPosition: FocusPosition) => {
      const clamped = clamp(newPosition);
      setPositionState(clamped);
      onPositionChange?.(clamped);
    },
    [clamp, onPositionChange]
  );

  // Reset position if it goes out of bounds
  React.useEffect(() => {
    if (position.row >= rowCount || position.col >= colCount) {
      setPosition(clamp(position));
    }
  }, [rowCount, colCount, position, setPosition, clamp]);

  const move = React.useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!enabled) return;

      setPositionState((current) => {
        let { row, col } = current;

        switch (direction) {
          case "up":
            if (row > 0) {
              row--;
            } else if (wrap) {
              row = rowCount - 1;
            }

            break;
          case "down":
            if (row < rowCount - 1) {
              row++;
            } else if (wrap) {
              row = 0;
            }

            break;
          case "left":
            if (col > 0) {
              col--;
            } else if (wrap) {
              col = colCount - 1;
            }

            break;
          case "right":
            if (col < colCount - 1) {
              col++;
            } else if (wrap) {
              col = 0;
            }

            break;
        }

        const newPosition = { row, col };
        onPositionChange?.(newPosition);

        return newPosition;
      });
    },
    [enabled, rowCount, colCount, wrap, onPositionChange]
  );

  const moveToRowStart = React.useCallback(() => {
    if (!enabled) return;
    setPosition({ row: position.row, col: 0 });
  }, [enabled, position.row, setPosition]);

  const moveToRowEnd = React.useCallback(() => {
    if (!enabled) return;
    setPosition({ row: position.row, col: colCount - 1 });
  }, [enabled, position.row, colCount, setPosition]);

  const moveToStart = React.useCallback(() => {
    if (!enabled) return;
    setPosition({ row: 0, col: 0 });
  }, [enabled, setPosition]);

  const moveToEnd = React.useCallback(() => {
    if (!enabled) return;
    setPosition({ row: rowCount - 1, col: colCount - 1 });
  }, [enabled, rowCount, colCount, setPosition]);

  const getTabIndex = React.useCallback(
    (row: number, col: number): 0 | -1 => {
      if (!enabled) return -1;

      return position.row === row && position.col === col ? 0 : -1;
    },
    [enabled, position]
  );

  const isFocused = React.useCallback(
    (row: number, col: number): boolean => {
      return position.row === row && position.col === col;
    },
    [position]
  );

  const focusCurrent = React.useCallback(() => {
    if (!containerRef.current) return;

    const selector = `[data-row="${position.row}"][data-col="${position.col}"]`;
    const element = containerRef.current.querySelector<HTMLElement>(selector);
    element?.focus();
  }, [position]);

  // Focus element when position changes
  React.useEffect(() => {
    if (!enabled) return;
    focusCurrent();
  }, [position, enabled, focusCurrent]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent): boolean => {
      if (!enabled) return false;

      let handled = true;

      switch (event.key) {
        case "ArrowUp":
          move("up");
          break;
        case "ArrowDown":
          move("down");
          break;
        case "ArrowLeft":
          move("left");
          break;
        case "ArrowRight":
          move("right");
          break;
        case "Home":
          if (event.ctrlKey || event.metaKey) {
            moveToStart();
          } else {
            moveToRowStart();
          }

          break;
        case "End":
          if (event.ctrlKey || event.metaKey) {
            moveToEnd();
          } else {
            moveToRowEnd();
          }

          break;
        default:
          handled = false;
      }

      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }

      return handled;
    },
    [enabled, move, moveToRowStart, moveToRowEnd, moveToStart, moveToEnd]
  );

  return {
    position,
    setPosition,
    move,
    moveToRowStart,
    moveToRowEnd,
    moveToStart,
    moveToEnd,
    getTabIndex,
    isFocused,
    handleKeyDown,
    containerRef: containerRef as React.RefObject<HTMLElement>,
    focusCurrent,
  };
}

export type { FocusPosition, UseFocusManagerOptions, UseFocusManagerReturn };
