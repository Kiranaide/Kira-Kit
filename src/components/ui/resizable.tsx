"use client";

import * as React from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import { IconGripVertical } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// Context to pass orientation to handles
const ResizableContext = React.createContext<"horizontal" | "vertical">(
  "horizontal"
);

// Re-export Group as ResizablePanelGroup with styling
interface ResizablePanelGroupProps extends React.ComponentProps<typeof Group> {
  className?: string;
}

function ResizablePanelGroup({
  className,
  orientation = "horizontal",
  children,
  ...props
}: ResizablePanelGroupProps) {
  return (
    <ResizableContext.Provider value={orientation}>
      <Group
        orientation={orientation}
        className={cn(
          "flex h-full w-full",
          orientation === "vertical" && "flex-col",
          className
        )}
        {...props}
      >
        {children}
      </Group>
    </ResizableContext.Provider>
  );
}

// Re-export Panel as ResizablePanel
const ResizablePanel = Panel;

// Re-export Separator as ResizableHandle with styling
interface ResizableHandleProps {
  withHandle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function ResizableHandle({
  withHandle = true,
  className,
  style,
}: ResizableHandleProps) {
  const orientation = React.useContext(ResizableContext);
  const isVertical = orientation === "vertical";

  return (
    <Separator
      className={cn(
        "relative flex items-center justify-center bg-border transition-colors hover:bg-primary/50 active:bg-primary/70",
        className
      )}
      style={{
        width: isVertical ? "100%" : "6px",
        height: isVertical ? "6px" : "100%",
        cursor: isVertical ? "row-resize" : "col-resize",
        flexShrink: 0,
        ...style,
      }}
    >
      {withHandle && (
        <div
          className={cn(
            "z-10 flex items-center justify-center rounded-sm border bg-border",
            isVertical ? "h-3 w-4" : "h-4 w-3"
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

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
