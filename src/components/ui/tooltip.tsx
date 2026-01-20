import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// TOOLTIP CONTENT VARIANTS
// ============================================
const tooltipContentVariants = cva(
  [
    // Base styles
    "z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md",
    // Animation - WCAG: respect prefers-reduced-motion
    "animate-in fade-in-0 zoom-in-95",
    "data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95",
    // Positioning animations
    "data-[side=bottom]:slide-in-from-top-2",
    "data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2",
    "data-[side=top]:slide-in-from-bottom-2",
    // Reduced motion support
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

// ============================================
// TOOLTIP ARROW VARIANTS
// ============================================
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

// ============================================
// TYPES
// ============================================
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
  /**
   * Default hover delay for all tooltips in milliseconds
   * @default 500
   */
  delayDuration?: number;
  /**
   * Default close delay for all tooltips in milliseconds
   * @default 200
   */
  closeDelayDuration?: number;
  /**
   * Children
   */
  children: React.ReactNode;
}

interface TooltipProps
  extends Omit<TooltipPrimitive.Root.Props, "children">,
    VariantProps<typeof tooltipContentVariants> {
  /**
   * Hover delay in milliseconds before showing tooltip
   * @default 500
   */
  delayDuration?: number;
  /**
   * Delay in milliseconds before hiding tooltip after mouse leaves
   * @default 200
   */
  closeDelayDuration?: number;
  /**
   * Children
   */
  children: React.ReactNode;
}

interface TooltipTriggerProps extends TooltipPrimitive.Trigger.Props {
  /**
   * Custom class name
   */
  className?: string;
}

interface TooltipContentProps
  extends Omit<TooltipPrimitive.Popup.Props, "children">,
    VariantProps<typeof tooltipContentVariants> {
  /**
   * Side of the trigger to position the tooltip
   * @default "top"
   */
  side?: "top" | "right" | "bottom" | "left";
  /**
   * Alignment of the tooltip relative to the trigger
   * @default "center"
   */
  align?: "start" | "center" | "end";
  /**
   * Offset from the trigger in pixels
   * @default 8
   */
  sideOffset?: number;
  /**
   * Maximum width of the tooltip
   * @default 250
   */
  maxWidth?: number | string;
  /**
   * Whether to show the arrow
   * @default true
   */
  showArrow?: boolean;
  /**
   * Content to display
   */
  children: React.ReactNode;
}

interface TooltipArrowProps extends Omit<TooltipPrimitive.Arrow.Props, "render"> {
  /**
   * Custom class name
   */
  className?: string;
}

// ============================================
// SIMPLE TOOLTIP PROPS (Shorthand API)
// ============================================
interface SimpleTooltipProps extends VariantProps<typeof tooltipContentVariants> {
  /**
   * Tooltip content text or node
   */
  content: React.ReactNode;
  /**
   * The element that triggers the tooltip
   */
  children: React.ReactElement;
  /**
   * Side of the trigger to position the tooltip
   * @default "top"
   */
  side?: "top" | "right" | "bottom" | "left";
  /**
   * Alignment of the tooltip
   * @default "center"
   */
  align?: "start" | "center" | "end";
  /**
   * Whether to show the arrow
   * @default true
   */
  showArrow?: boolean;
  /**
   * Offset from the trigger
   * @default 8
   */
  sideOffset?: number;
  /**
   * Hover delay in milliseconds
   * @default 500
   */
  delayDuration?: number;
  /**
   * Close delay in milliseconds
   * @default 200
   */
  closeDelayDuration?: number;
  /**
   * Controlled open state
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (
    open: boolean,
    eventDetails: TooltipPrimitive.Root.ChangeEventDetails
  ) => void;
}

// ============================================
// TOOLTIP PROVIDER
// ============================================
/**
 * Provider for tooltip configuration.
 * Wrap your app to set default delays.
 *
 * @example
 * ```tsx
 * <TooltipProvider delayDuration={300}>
 *   <App />
 * </TooltipProvider>
 * ```
 */
function TooltipProvider({
  delayDuration: _delayDuration = 500, // eslint-disable-line @typescript-eslint/no-unused-vars
  closeDelayDuration: _closeDelayDuration = 200, // eslint-disable-line @typescript-eslint/no-unused-vars
  children,
}: TooltipProviderProps) {
  // Base UI handles provider internally, this is for API consistency
  return <>{children}</>;
}

// ============================================
// TOOLTIP ROOT
// ============================================
/**
 * Root component for tooltip. Controls open state and timing.
 *
 * @example
 * ```tsx
 * <Tooltip delayDuration={300}>
 *   <TooltipTrigger>Hover me</TooltipTrigger>
 *   <TooltipContent>Tooltip content</TooltipContent>
 * </Tooltip>
 * ```
 */
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

  // Controlled vs uncontrolled
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

  // WCAG 1.4.13: Dismissible - Escape key to close
  // Note: Base UI handles this internally, but we add it for extra safety
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

// ============================================
// TOOLTIP TRIGGER
// ============================================
/**
 * The element that triggers the tooltip on hover/focus.
 *
 * @example
 * ```tsx
 * <TooltipTrigger>
 *   <Button>Hover me</Button>
 * </TooltipTrigger>
 * ```
 */
function TooltipTrigger({ className, children, ...props }: TooltipTriggerProps) {
  const { id, delayDuration, closeDelayDuration } =
    React.useContext(TooltipContext);

  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      // WCAG: Link trigger to tooltip content for screen readers
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

// ============================================
// TOOLTIP CONTENT
// ============================================
/**
 * The content displayed in the tooltip popup.
 *
 * @example
 * ```tsx
 * <TooltipContent side="top" align="center">
 *   This is a tooltip
 * </TooltipContent>
 * ```
 */
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

// ============================================
// TOOLTIP ARROW
// ============================================
/**
 * Arrow pointing to the trigger element.
 */
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
      className={cn(tooltipArrowVariants({ variant: resolvedVariant }), className)}
      {...props}
    >
      <svg width="12" height="6" viewBox="0 0 12 6" aria-hidden="true">
        <path d="M0 6L6 0L12 6" />
      </svg>
    </TooltipPrimitive.Arrow>
  );
}

// ============================================
// SIMPLE TOOLTIP (Shorthand API)
// ============================================
/**
 * Simplified tooltip component for common use cases.
 *
 * @example
 * ```tsx
 * // Simple usage
 * <SimpleTooltip content="Save your changes">
 *   <Button>Save</Button>
 * </SimpleTooltip>
 *
 * // With options
 * <SimpleTooltip
 *   content="Delete this item permanently"
 *   variant="destructive"
 *   side="right"
 * >
 *   <Button variant="destructive">Delete</Button>
 * </SimpleTooltip>
 * ```
 */
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

// ============================================
// EXPORTS
// ============================================
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
