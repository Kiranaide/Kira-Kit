import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipProvider({ ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" {...props} />;
}

const tooltipContentVariants = cva(
  "z-[100] overflow-hidden rounded-md shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "bg-background border border-border text-foreground shadow-sm",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        default: "px-3 py-1.5 text-xs",
        sm: "px-2 py-1 text-[10px]",
        lg: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface TooltipContentProps
  extends TooltipPrimitive.Popup.Props,
    VariantProps<typeof tooltipContentVariants> {
  side?: TooltipPrimitive.Positioner.Props["side"];
  sideOffset?: TooltipPrimitive.Positioner.Props["sideOffset"];
  align?: TooltipPrimitive.Positioner.Props["align"];
  alignOffset?: TooltipPrimitive.Positioner.Props["alignOffset"];
  arrowPadding?: TooltipPrimitive.Positioner.Props["arrowPadding"];
  collisionBoundary?: TooltipPrimitive.Positioner.Props["collisionBoundary"];
  collisionPadding?: TooltipPrimitive.Positioner.Props["collisionPadding"];
  sticky?: TooltipPrimitive.Positioner.Props["sticky"];
}

function TooltipContent({
  className,
  sideOffset = 4,
  side = "top",
  align = "center",
  alignOffset = 0,
  arrowPadding,
  collisionBoundary,
  collisionPadding,
  sticky,
  variant,
  size,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        arrowPadding={arrowPadding}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        sticky={sticky}
        trackAnchor={true}
        className="invisible data-[side]:visible"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(tooltipContentVariants({ variant, size }), className)}
          {...props}
        />
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

function TooltipArrow({ className, ...props }: TooltipPrimitive.Arrow.Props) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={cn("fill-primary", className)}
      {...props}
    />
  );
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
  TooltipArrow,
};
