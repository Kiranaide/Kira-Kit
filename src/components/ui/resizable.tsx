"use client";

import * as React from "react";
import {
  Panel,
  Group,
  Separator,
  usePanelRef,
  type PanelImperativeHandle,
  type GroupImperativeHandle,
  type Layout,
  type PanelSize,
} from "react-resizable-panels";
import { IconGripVertical } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================
type Orientation = "horizontal" | "vertical";

interface ResizableContextValue {
  orientation: Orientation;
}

export type ResizablePanelRef = PanelImperativeHandle;
export type ResizablePanelGroupRef = GroupImperativeHandle;

// ============================================
// CONTEXT
// ============================================
const ResizableContext = React.createContext<ResizableContextValue>({
  orientation: "horizontal",
});

// ============================================
// RESIZABLE PANEL GROUP
// ============================================
interface ResizablePanelGroupProps extends Omit<
  React.ComponentProps<typeof Group>,
  "onLayoutChange"
> {
  className?: string;
  /** Auto-save layout to localStorage with this key */
  autoSaveId?: string;
  /** Callback when layout changes - receives object { [panelId]: percentage } */
  onLayoutChange?: (layout: Layout) => void;
}

function ResizablePanelGroup({
  className,
  orientation = "horizontal",
  onLayoutChange,
  children,
  ...props
}: ResizablePanelGroupProps) {
  const groupRef = React.useRef<GroupImperativeHandle>(null);

  return (
    <ResizableContext.Provider value={{ orientation }}>
      <Group
        groupRef={groupRef}
        orientation={orientation}
        onLayoutChange={onLayoutChange}
        data-slot="resizable-panel-group"
        className={cn(
          "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
          className,
        )}
        {...props}
      >
        {children}
      </Group>
    </ResizableContext.Provider>
  );
}
ResizablePanelGroup.displayName = "ResizablePanelGroup";

// ============================================
// RESIZABLE PANEL
// ============================================
interface ResizablePanelProps extends Omit<
  React.ComponentProps<typeof Panel>,
  "onResize" | "panelRef"
> {
  /** Panel content */
  children?: React.ReactNode;
  /** Ref for imperative control (collapse, expand, resize) */
  panelRef?: React.RefObject<PanelImperativeHandle | null>;
  /** Called when panel resizes - receives { asPercentage, inPixels } */
  onResize?: (size: PanelSize, id: string | number | undefined) => void;
}

function ResizablePanel({
  className,
  panelRef,
  onResize,
  ...props
}: ResizablePanelProps) {
  return (
    <Panel
      panelRef={panelRef}
      onResize={onResize}
      data-slot="resizable-panel"
      className={cn("", className)}
      {...props}
    />
  );
}
ResizablePanel.displayName = "ResizablePanel";

// ============================================
// RESIZABLE HANDLE
// ============================================
const handleVariants = cva(
  "relative flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-border hover:bg-primary/50 active:bg-primary/70",
        subtle: "bg-transparent hover:bg-muted active:bg-muted/80",
        prominent: "bg-muted hover:bg-primary/30 active:bg-primary/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface ResizableHandleProps
  extends
    VariantProps<typeof handleVariants>,
    Omit<React.ComponentProps<typeof Separator>, "orientation"> {
  /** Show the grip handle icon */
  withHandle?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Accessible label for the handle */
  "aria-label"?: string;
}

function ResizableHandle({
  withHandle = true,
  className,
  style,
  variant,
  "aria-label": ariaLabel,
  ...props
}: ResizableHandleProps) {
  const { orientation } = React.useContext(ResizableContext);
  const isVertical = orientation === "vertical";

  return (
    <Separator
      data-slot="resizable-handle"
      aria-label={
        ariaLabel ?? `Resize ${isVertical ? "vertically" : "horizontally"}`
      }
      className={cn(handleVariants({ variant }), className)}
      style={{
        width: isVertical ? "100%" : "6px",
        height: isVertical ? "6px" : "100%",
        cursor: isVertical ? "row-resize" : "col-resize",
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "z-10 flex items-center justify-center rounded-sm border bg-border",
            isVertical ? "h-3 w-4" : "h-4 w-3",
          )}
        >
          <IconGripVertical
            className={cn("h-2.5 w-2.5", isVertical && "rotate-90")}
          />
        </div>
      )}
    </Separator>
  );
}

// ============================================
// COLLAPSIBLE PANEL (Higher-level component)
// ============================================
interface CollapsiblePanelProps extends ResizablePanelProps {
  /** ID for the panel, required for collapsible */
  id: string;
  /** Whether the panel is collapsible */
  collapsible?: boolean;
  /** Size when collapsed (percentage) */
  collapsedSize?: number | string;
  /** Default size (percentage) */
  defaultSize?: number | string;
  /** Minimum size (percentage) */
  minSize?: number | string;
  /** Maximum size (percentage) */
  maxSize?: number | string;
}

function CollapsiblePanel({
  id,
  collapsible = true,
  collapsedSize = 0,
  defaultSize = 20,
  minSize = 10,
  maxSize,
  panelRef,
  children,
  ...props
}: CollapsiblePanelProps) {
  return (
    <ResizablePanel
      id={id}
      panelRef={panelRef}
      collapsible={collapsible}
      collapsedSize={collapsedSize}
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      {...props}
    >
      {children}
    </ResizablePanel>
  );
}
CollapsiblePanel.displayName = "CollapsiblePanel";

// Re-export the usePanelRef hook from the library
export { usePanelRef };

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  CollapsiblePanel,
};
export type {
  ResizablePanelGroupProps,
  ResizablePanelProps,
  ResizableHandleProps,
  CollapsiblePanelProps,
  Layout,
  PanelSize,
};
