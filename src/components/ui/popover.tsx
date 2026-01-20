import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// POPOVER ROOT
// ============================================

interface PopoverProps extends PopoverPrimitive.Root.Props {
  /** Callback when open state changes. */
  onOpenChange?: (open: boolean) => void;
}

function Popover({ onOpenChange, ...props }: PopoverProps) {
  return (
    <PopoverPrimitive.Root
      data-slot="popover"
      onOpenChange={onOpenChange}
      {...props}
    />
  );
}

// ============================================
// POPOVER TRIGGER
// ============================================

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

// ============================================
// POPOVER PORTAL
// ============================================

function PopoverPortal({ ...props }: PopoverPrimitive.Portal.Props) {
  return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />;
}

// ============================================
// POPOVER CLOSE
// ============================================

function PopoverClose({ ...props }: PopoverPrimitive.Close.Props) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

// ============================================
// POPOVER CONTENT VARIANTS
// ============================================

const popoverContentVariants = cva(
  "z-50 rounded-lg border p-4 shadow-lg outline-none data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      size: {
        auto: "w-auto",
        sm: "w-48",
        md: "w-72",
        lg: "w-96",
        xl: "w-[32rem]",
      },
      variant: {
        default: "border-border bg-popover text-popover-foreground",
        outline: "border-border bg-background text-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

// ============================================
// POPOVER CONTENT
// ============================================

interface PopoverContentProps
  extends
    Omit<PopoverPrimitive.Popup.Props, "initialFocus" | "finalFocus">,
    VariantProps<typeof popoverContentVariants> {
  /** Side to position the popover relative to trigger. */
  side?: PopoverPrimitive.Positioner.Props["side"];
  /** Offset from the trigger element. */
  sideOffset?: PopoverPrimitive.Positioner.Props["sideOffset"];
  /** Alignment relative to the trigger. */
  align?: PopoverPrimitive.Positioner.Props["align"];
  /** Offset for alignment. */
  alignOffset?: PopoverPrimitive.Positioner.Props["alignOffset"];
  /** Padding for the arrow. */
  arrowPadding?: PopoverPrimitive.Positioner.Props["arrowPadding"];
  /** Element to use as collision boundary. */
  collisionBoundary?: PopoverPrimitive.Positioner.Props["collisionBoundary"];
  /** Padding from collision boundary. */
  collisionPadding?: PopoverPrimitive.Positioner.Props["collisionPadding"];
  /** How to handle positioning when overflowing. */
  sticky?: PopoverPrimitive.Positioner.Props["sticky"];
  /**
   * Element to focus when the popover opens.
   * - `false`: Do not move focus.
   * - `true`: Focus first tabbable element or popup.
   * - `RefObject`: Focus the ref element.
   */
  initialFocus?: PopoverPrimitive.Popup.Props["initialFocus"];
  /**
   * Element to focus when the popover closes.
   * - `false`: Do not move focus.
   * - `true`: Focus trigger or previously focused element.
   * - `RefObject`: Focus the ref element.
   */
  finalFocus?: PopoverPrimitive.Popup.Props["finalFocus"];
  /** ARIA role for the popover content. */
  role?: "dialog" | "tooltip" | "listbox" | "menu";
}

function PopoverContent({
  className,
  sideOffset = 4,
  side = "bottom",
  align = "center",
  alignOffset = 0,
  arrowPadding,
  collisionBoundary,
  collisionPadding,
  sticky,
  size,
  variant,
  initialFocus,
  finalFocus,
  role,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        arrowPadding={arrowPadding}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        sticky={sticky}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(popoverContentVariants({ size, variant }), className)}
          initialFocus={initialFocus}
          finalFocus={finalFocus}
          role={role}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

// ============================================
// POPOVER BACKDROP
// ============================================

function PopoverBackdrop({
  className,
  ...props
}: PopoverPrimitive.Backdrop.Props) {
  return (
    <PopoverPrimitive.Backdrop
      data-slot="popover-backdrop"
      className={cn(
        "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

// ============================================
// POPOVER ARROW
// ============================================

const popoverArrowVariants = cva("", {
  variants: {
    variant: {
      default: "fill-popover",
      outline: "fill-background",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface PopoverArrowProps
  extends
    PopoverPrimitive.Arrow.Props,
    VariantProps<typeof popoverArrowVariants> {}

function PopoverArrow({ className, variant, ...props }: PopoverArrowProps) {
  return (
    <PopoverPrimitive.Arrow
      data-slot="popover-arrow"
      className={cn(popoverArrowVariants({ variant }), className)}
      {...props}
    />
  );
}

// ============================================
// POPOVER TITLE
// ============================================

interface PopoverTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level to use. */
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}

function PopoverTitle({
  className,
  as: Component = "h4",
  ...props
}: PopoverTitleProps) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      render={<Component />}
      className={cn("font-medium text-base leading-none", className)}
      {...props}
    />
  );
}

// ============================================
// POPOVER DESCRIPTION
// ============================================

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PopoverDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-sm text-muted-foreground mt-1", className)}
      {...props}
    />
  );
}

// ============================================
// EXPORTS
// ============================================

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverPortal,
  PopoverArrow,
  PopoverBackdrop,
  PopoverTitle,
  PopoverDescription,
  popoverContentVariants,
  popoverArrowVariants,
};
export type { PopoverProps, PopoverContentProps, PopoverArrowProps };
