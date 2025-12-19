import * as React from "react";
import { IconGripVertical } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface ResizablePanelGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
  onLayout?: (sizes: number[]) => void;
}

interface ResizableContextValue {
  direction: "horizontal" | "vertical";
  sizes: number[];
  setSizes: React.Dispatch<React.SetStateAction<number[]>>;
  registerPanel: (
    index: number,
    defaultSize: number,
    minSize: number,
    maxSize: number
  ) => void;
  startResize: (index: number, e: React.MouseEvent | React.TouchEvent) => void;
}

const ResizableContext = React.createContext<ResizableContextValue | null>(
  null
);

function ResizablePanelGroup({
  className,
  direction = "horizontal",
  children,
  onLayout,
  ...props
}: ResizablePanelGroupProps) {
  const [sizes, setSizes] = React.useState<number[]>([]);
  const panelsRef = React.useRef<{ minSize: number; maxSize: number }[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const registerPanel = React.useCallback(
    (index: number, defaultSize: number, minSize: number, maxSize: number) => {
      setSizes((prev) => {
        const newSizes = [...prev];
        if (newSizes[index] === undefined) {
          newSizes[index] = defaultSize;
        }
        return newSizes;
      });
      panelsRef.current[index] = { minSize, maxSize };
    },
    []
  );

  const startResize = React.useCallback(
    (handleIndex: number, e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const isHorizontal = direction === "horizontal";
      const containerRect = container.getBoundingClientRect();
      const containerSize = isHorizontal
        ? containerRect.width
        : containerRect.height;

      const getPosition = (event: MouseEvent | TouchEvent) => {
        if ("touches" in event) {
          return isHorizontal
            ? event.touches[0].clientX
            : event.touches[0].clientY;
        }
        return isHorizontal ? event.clientX : event.clientY;
      };

      const startPos = getPosition(e.nativeEvent as MouseEvent | TouchEvent);
      const startSizes = [...sizes];

      const onMove = (moveEvent: MouseEvent | TouchEvent) => {
        const currentPos = getPosition(moveEvent);
        const delta = ((currentPos - startPos) / containerSize) * 100;

        const newSizes = [...startSizes];
        const leftIndex = handleIndex;
        const rightIndex = handleIndex + 1;

        if (leftIndex >= 0 && rightIndex < newSizes.length) {
          let newLeftSize = startSizes[leftIndex] + delta;
          let newRightSize = startSizes[rightIndex] - delta;

          const leftPanel = panelsRef.current[leftIndex];
          const rightPanel = panelsRef.current[rightIndex];

          // Apply constraints
          if (leftPanel) {
            newLeftSize = Math.max(
              leftPanel.minSize,
              Math.min(leftPanel.maxSize, newLeftSize)
            );
          }
          if (rightPanel) {
            newRightSize = Math.max(
              rightPanel.minSize,
              Math.min(rightPanel.maxSize, newRightSize)
            );
          }

          // Recalculate to respect constraints
          const totalOriginal = startSizes[leftIndex] + startSizes[rightIndex];
          const total = newLeftSize + newRightSize;
          if (Math.abs(total - totalOriginal) > 0.1) {
            // Adjust to maintain total
            if (delta > 0) {
              newLeftSize = totalOriginal - newRightSize;
            } else {
              newRightSize = totalOriginal - newLeftSize;
            }
          }

          newSizes[leftIndex] = newLeftSize;
          newSizes[rightIndex] = newRightSize;

          setSizes(newSizes);
          onLayout?.(newSizes);
        }
      };

      const onEnd = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onEnd);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onEnd);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchmove", onMove);
      document.addEventListener("touchend", onEnd);
    },
    [direction, sizes, onLayout]
  );

  return (
    <ResizableContext.Provider
      value={{ direction, sizes, setSizes, registerPanel, startResize }}
    >
      <div
        ref={containerRef}
        data-slot="resizable-panel-group"
        data-direction={direction}
        className={cn(
          "flex h-full w-full",
          direction === "horizontal" ? "flex-row" : "flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ResizableContext.Provider>
  );
}

interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
}

function ResizablePanel({
  className,
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  children,
  ...props
}: ResizablePanelProps) {
  const context = React.useContext(ResizableContext);
  const indexRef = React.useRef<number>(-1);
  const [index, setIndex] = React.useState(-1);

  React.useEffect(() => {
    if (context && indexRef.current === -1) {
      const panelIndex = context.sizes.length;
      indexRef.current = panelIndex;
      setIndex(panelIndex);
      context.registerPanel(panelIndex, defaultSize, minSize, maxSize);
    }
  }, [context, defaultSize, minSize, maxSize]);

  const size = context?.sizes[index] ?? defaultSize;

  return (
    <div
      data-slot="resizable-panel"
      className={cn("overflow-hidden", className)}
      style={{
        flexBasis: `${size}%`,
        flexGrow: 0,
        flexShrink: 0,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  withHandle?: boolean;
}

function ResizableHandle({
  className,
  withHandle = true,
  ...props
}: ResizableHandleProps) {
  const context = React.useContext(ResizableContext);
  const [handleIndex, setHandleIndex] = React.useState(-1);

  React.useEffect(() => {
    if (context && handleIndex === -1) {
      // The handle index is the number of panels registered so far minus 1
      setHandleIndex(Math.max(0, context.sizes.length - 1));
    }
  }, [context, handleIndex]);

  const handleMouseDown = (e: React.MouseEvent) => {
    context?.startResize(handleIndex, e);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    context?.startResize(handleIndex, e);
  };

  const isHorizontal = context?.direction === "horizontal";

  return (
    <div
      data-slot="resizable-handle"
      className={cn(
        "relative flex items-center justify-center bg-border",
        isHorizontal ? "w-1.5 cursor-col-resize" : "h-1.5 cursor-row-resize",
        "hover:bg-primary/50 active:bg-primary/70 transition-colors",
        className
      )}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <IconGripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </div>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
