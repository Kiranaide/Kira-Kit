"use client";

import * as React from "react";
import { IconChevronLeft, IconChevronRight, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  CollapsiblePanel,
  usePanelRef,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Orientation = "horizontal" | "vertical";

export interface SplitViewProps extends Omit<React.ComponentProps<typeof ResizablePanelGroup>, "orientation"> {
  children?: React.ReactNode;
  orientation?: Orientation;
  defaultSize?: number;
  minSize?: number;
  collapsible?: boolean;
  collapsedSize?: number;
  sidebarContent: React.ReactNode;
  mainContent: React.ReactNode;
  showToggle?: boolean;
  sidebarLabel?: string;
}

export interface SplitViewRef {
  toggleSidebar: () => void;
  expandSidebar: () => void;
  collapseSidebar: () => void;
}

const SplitView = React.forwardRef<SplitViewRef, SplitViewProps>(
  (
    {
      children,
      orientation = "horizontal",
      defaultSize = 20,
      minSize = 10,
      collapsible = true,
      collapsedSize = 0,
      sidebarContent,
      mainContent,
      showToggle = true,
      sidebarLabel = "Sidebar",
      className,
      ...props
    },
    ref
  ) => {
    const sidebarPanelRef = usePanelRef();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
      toggleSidebar: () => {
        if (isCollapsed) {
          sidebarPanelRef.current?.expand();
        } else {
          sidebarPanelRef.current?.collapse();
        }
      },
      expandSidebar: () => sidebarPanelRef.current?.expand(),
      collapseSidebar: () => sidebarPanelRef.current?.collapse(),
    }));

    const handleToggle = () => {
      if (isCollapsed) {
        sidebarPanelRef.current?.expand();
      } else {
        sidebarPanelRef.current?.collapse();
      }
    };

    const handleResize = (size: { asPercentage: number }) => {
      setIsCollapsed(size.asPercentage <= parseFloat(String(collapsedSize)) + 1);
    };

    const isVertical = orientation === "vertical";

    return (
      <ResizablePanelGroup
        orientation={orientation}
        className={cn("h-full w-full", className)}
        {...props}
      >
        <CollapsiblePanel
          id="sidebar"
          panelRef={sidebarPanelRef}
          collapsible={collapsible}
          collapsedSize={collapsedSize}
          defaultSize={defaultSize}
          minSize={minSize}
          onResize={handleResize}
        >
          <div className="flex h-full flex-col">
            {showToggle && !isCollapsed && (
              <div className="flex items-center justify-between border-b px-3 py-2">
                <span className="text-sm font-medium">{sidebarLabel}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleToggle}
                  className={isVertical ? "self-end" : ""}
                >
                  {isVertical ? (
                    <IconChevronUp className="h-4 w-4" />
                  ) : (
                    <IconChevronLeft className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
            <div className="flex-1 overflow-auto">{sidebarContent}</div>
          </div>
        </CollapsiblePanel>

        <ResizableHandle aria-label={`Resize ${isVertical ? "vertical" : "horizontal"} split view`} />

        <ResizablePanel id="main" className="min-w-0">
          <div className="flex h-full flex-col">
            {showToggle && isCollapsed && (
              <div className="flex border-b px-3 py-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleToggle}
                  className={isVertical ? "self-end" : ""}
                >
                  {isVertical ? (
                    <IconChevronDown className="h-4 w-4" />
                  ) : (
                    <IconChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
            <div className="flex-1 overflow-auto">{mainContent}</div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }
);

SplitView.displayName = "SplitView";

export { SplitView };
