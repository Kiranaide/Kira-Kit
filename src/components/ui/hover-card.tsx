import * as React from "react";
import { cn } from "@/lib/utils";

interface HoverCardProps {
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
}

interface HoverCardContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const HoverCardContext = React.createContext<HoverCardContextValue | null>(
  null
);

function HoverCard({
  children,
  openDelay = 200,
  closeDelay = 300,
}: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  const openTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const handleOpen = React.useCallback(() => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    openTimeoutRef.current = setTimeout(() => setOpen(true), openDelay);
  }, [openDelay]);

  const handleClose = React.useCallback(() => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay]);

  React.useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <HoverCardContext.Provider value={{ open, setOpen }}>
      <div
        data-slot="hover-card"
        className="relative inline-block"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        {children}
      </div>
    </HoverCardContext.Provider>
  );
}

interface HoverCardTriggerProps extends React.HTMLAttributes<HTMLSpanElement> {
  render?: React.ReactElement<{ className?: string }>;
}

function HoverCardTrigger({
  className,
  children,
  render,
  ...props
}: HoverCardTriggerProps) {
  if (render) {
    return React.cloneElement(render, {
      ...props,
      className: cn(className, render.props.className),
    });
  }

  return (
    <span data-slot="hover-card-trigger" className={className} {...props}>
      {children}
    </span>
  );
}

interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number;
  align?: "start" | "center" | "end";
}

function HoverCardContent({
  className,
  sideOffset = 8,
  align = "center",
  ...props
}: HoverCardContentProps) {
  const context = React.useContext(HoverCardContext);

  if (!context?.open) return null;

  return (
    <div
      data-slot="hover-card-content"
      className={cn(
        // Higher z-index to appear above sidebar
        "absolute z-[100] w-64 rounded-lg border border-border bg-popover p-4 shadow-lg outline-none",
        "animate-in fade-in-0 zoom-in-95",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "end" && "right-0",
        className
      )}
      style={{ top: `calc(100% + ${sideOffset}px)` }}
      {...props}
    />
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
