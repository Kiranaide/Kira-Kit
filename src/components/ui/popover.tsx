import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
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
  "z-50 rounded-lg border border-border bg-popover p-4 shadow-lg outline-none data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      size: {
        auto: "w-auto",
        sm: "w-48",
        md: "w-72",
        lg: "w-96",
        xl: "w-[32rem]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface PopoverContentProps
  extends PopoverPrimitive.Popup.Props,
    VariantProps<typeof popoverContentVariants> {
  side?: PopoverPrimitive.Positioner.Props["side"];
  sideOffset?: PopoverPrimitive.Positioner.Props["sideOffset"];
  align?: PopoverPrimitive.Positioner.Props["align"];
  alignOffset?: PopoverPrimitive.Positioner.Props["alignOffset"];
  arrowPadding?: PopoverPrimitive.Positioner.Props["arrowPadding"];
  collisionBoundary?: PopoverPrimitive.Positioner.Props["collisionBoundary"];
  collisionPadding?: PopoverPrimitive.Positioner.Props["collisionPadding"];
  sticky?: PopoverPrimitive.Positioner.Props["sticky"];
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
          className={cn(popoverContentVariants({ size }), className)}
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

function PopoverArrow({ className, ...props }: PopoverPrimitive.Arrow.Props) {
  return (
    <PopoverPrimitive.Arrow
      data-slot="popover-arrow"
      className={cn("fill-popover", className)}
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
};
