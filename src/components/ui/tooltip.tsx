import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tooltipContentVariants = cva(
  [
    "z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md",
    "animate-in fade-in-0 zoom-in-95",
    "data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95",
    "data-[side=bottom]:slide-in-from-top-2",
    "data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2",
    "data-[side=top]:slide-in-from-bottom-2",
    "motion-reduce:animate-none",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-border bg-background text-foreground",
        muted: "bg-muted text-muted-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const tooltipArrowVariants = cva(
  [
    "data-[side=bottom]:top-[-6px]",
    "data-[side=left]:right-[-6px]",
    "data-[side=right]:left-[-6px]",
    "data-[side=top]:bottom-[-6px]",
  ],
  {
    variants: {
      variant: {
        default: "fill-primary",
        secondary: "fill-secondary",
        outline: "fill-background stroke-border",
        muted: "fill-muted",
        destructive: "fill-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type TooltipContextValue = {
  variant: VariantProps<typeof tooltipContentVariants>["variant"];
  id: string;
  delayDuration: number;
  closeDelayDuration: number;
};

const TooltipContext = React.createContext<TooltipContextValue>({
  variant: "default",
  id: "",
  delayDuration: 500,
  closeDelayDuration: 200,
});

interface TooltipProviderProps {
  delayDuration?: number;
  closeDelayDuration?: number;
  children: React.ReactNode;
}

interface TooltipProps
  extends
    Omit<TooltipPrimitive.Root.Props, "children">,
    VariantProps<typeof tooltipContentVariants> {
  delayDuration?: number;
  closeDelayDuration?: number;
  children: React.ReactNode;
}

interface TooltipTriggerProps extends TooltipPrimitive.Trigger.Props {
  className?: string;
}

interface TooltipContentProps
  extends
    Omit<TooltipPrimitive.Popup.Props, "children">,
    VariantProps<typeof tooltipContentVariants> {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  maxWidth?: number | string;
  showArrow?: boolean;
  children: React.ReactNode;
}

interface TooltipArrowProps extends Omit<
  TooltipPrimitive.Arrow.Props,
  "render"
> {
  className?: string;
}

interface SimpleTooltipProps extends VariantProps<
  typeof tooltipContentVariants
> {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  showArrow?: boolean;
  sideOffset?: number;
  delayDuration?: number;
  closeDelayDuration?: number;
  open?: boolean;
  onOpenChange?: (
    open: boolean,
    eventDetails: TooltipPrimitive.Root.ChangeEventDetails
  ) => void;
}

function TooltipProvider({
  delayDuration: _delayDuration = 500,
  closeDelayDuration: _closeDelayDuration = 200,
  children,
}: TooltipProviderProps) {
  return <>{children}</>;
}

function Tooltip({
  delayDuration = 500,
  closeDelayDuration = 200,
  variant = "default",
  children,
  open: controlledOpen,
  onOpenChange,
  ...props
}: TooltipProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const id = React.useId();

  const isOpen = controlledOpen ?? internalOpen;

  const handleOpenChange = React.useCallback(
    (
      newOpen: boolean,
      eventDetails: TooltipPrimitive.Root.ChangeEventDetails
    ) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen, eventDetails);
    },
    [controlledOpen, onOpenChange]
  );

  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setInternalOpen(false);
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const contextValue = React.useMemo<TooltipContextValue>(
    () => ({ variant, id, delayDuration, closeDelayDuration }),
    [variant, id, delayDuration, closeDelayDuration]
  );

  return (
    <TooltipContext.Provider value={contextValue}>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        open={isOpen}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </TooltipPrimitive.Root>
    </TooltipContext.Provider>
  );
}

function TooltipTrigger({
  className,
  children,
  ...props
}: TooltipTriggerProps) {
  const { id, delayDuration, closeDelayDuration } =
    React.useContext(TooltipContext);

  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      aria-describedby={id}
      delay={delayDuration}
      closeDelay={closeDelayDuration}
      className={cn("cursor-default", className)}
      {...props}
    >
      {children}
    </TooltipPrimitive.Trigger>
  );
}

function TooltipContent({
  className,
  side = "top",
  align = "center",
  sideOffset = 8,
  maxWidth = 250,
  showArrow = true,
  variant,
  size,
  children,
  ...props
}: TooltipContentProps) {
  const context = React.useContext(TooltipContext);
  const resolvedVariant = variant ?? context.variant ?? "default";

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          id={context.id}
          role="tooltip"
          className={cn(
            tooltipContentVariants({ variant: resolvedVariant, size }),
            className
          )}
          style={{ maxWidth }}
          {...props}
        >
          {showArrow && <TooltipArrow variant={resolvedVariant} />}
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

function TooltipArrow({
  className,
  variant,
  ...props
}: TooltipArrowProps & VariantProps<typeof tooltipArrowVariants>) {
  const context = React.useContext(TooltipContext);
  const resolvedVariant = variant ?? context.variant ?? "default";

  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={cn(
        tooltipArrowVariants({ variant: resolvedVariant }),
        className
      )}
      {...props}
    >
      <svg width="12" height="6" viewBox="0 0 12 6" aria-hidden="true">
        <path d="M0 6L6 0L12 6" />
      </svg>
    </TooltipPrimitive.Arrow>
  );
}

function SimpleTooltip({
  content,
  children,
  variant = "default",
  size,
  side = "top",
  align = "center",
  sideOffset = 8,
  showArrow = true,
  delayDuration = 500,
  closeDelayDuration = 200,
  open,
  onOpenChange,
}: SimpleTooltipProps) {
  return (
    <Tooltip
      variant={variant}
      delayDuration={delayDuration}
      closeDelayDuration={closeDelayDuration}
      open={open}
      onOpenChange={onOpenChange}
    >
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        showArrow={showArrow}
        variant={variant}
        size={size}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
  SimpleTooltip,
  tooltipContentVariants,
  tooltipArrowVariants,
};

export type {
  TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipArrowProps,
  TooltipProviderProps,
  SimpleTooltipProps,
};
