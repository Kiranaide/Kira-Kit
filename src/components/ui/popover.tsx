import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface PopoverProps extends PopoverPrimitive.Root.Props {
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

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverPortal({ ...props }: PopoverPrimitive.Portal.Props) {
  return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />;
}

function PopoverClose({ ...props }: PopoverPrimitive.Close.Props) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

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
  }
);

interface PopoverContentProps
  extends
    Omit<PopoverPrimitive.Popup.Props, "initialFocus" | "finalFocus">,
    VariantProps<typeof popoverContentVariants> {
  side?: PopoverPrimitive.Positioner.Props["side"];
  sideOffset?: PopoverPrimitive.Positioner.Props["sideOffset"];
  align?: PopoverPrimitive.Positioner.Props["align"];
  alignOffset?: PopoverPrimitive.Positioner.Props["alignOffset"];
  arrowPadding?: PopoverPrimitive.Positioner.Props["arrowPadding"];
  collisionBoundary?: PopoverPrimitive.Positioner.Props["collisionBoundary"];
  collisionPadding?: PopoverPrimitive.Positioner.Props["collisionPadding"];
  sticky?: PopoverPrimitive.Positioner.Props["sticky"];
  initialFocus?: PopoverPrimitive.Popup.Props["initialFocus"];
  finalFocus?: PopoverPrimitive.Popup.Props["finalFocus"];
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

function PopoverBackdrop({
  className,
  ...props
}: PopoverPrimitive.Backdrop.Props) {
  return (
    <PopoverPrimitive.Backdrop
      data-slot="popover-backdrop"
      className={cn(
        "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

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

interface PopoverTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
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
