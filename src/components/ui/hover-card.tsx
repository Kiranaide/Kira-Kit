import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

function HoverCard({ ...props }: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

const hoverCardContentVariants = cva(
  "z-[100] rounded-lg border border-border bg-popover p-4 shadow-lg outline-none data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      size: {
        sm: "w-48",
        md: "w-64",
        lg: "w-80",
        xl: "w-96",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface HoverCardContentProps
  extends PreviewCardPrimitive.Popup.Props,
    VariantProps<typeof hoverCardContentVariants> {
  side?: PreviewCardPrimitive.Positioner.Props["side"];
  sideOffset?: PreviewCardPrimitive.Positioner.Props["sideOffset"];
  align?: PreviewCardPrimitive.Positioner.Props["align"];
  alignOffset?: PreviewCardPrimitive.Positioner.Props["alignOffset"];
  arrowPadding?: PreviewCardPrimitive.Positioner.Props["arrowPadding"];
  collisionBoundary?: PreviewCardPrimitive.Positioner.Props["collisionBoundary"];
  collisionPadding?: PreviewCardPrimitive.Positioner.Props["collisionPadding"];
  sticky?: PreviewCardPrimitive.Positioner.Props["sticky"];
}

function HoverCardContent({
  className,
  sideOffset = 8,
  side = "bottom",
  align = "center",
  alignOffset = 0,
  arrowPadding,
  collisionBoundary,
  collisionPadding,
  sticky,
  size,
  ...props
}: HoverCardContentProps) {
  return (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        arrowPadding={arrowPadding}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        sticky={sticky}
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(hoverCardContentVariants({ size }), className)}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

function HoverCardArrow({
  className,
  ...props
}: PreviewCardPrimitive.Arrow.Props) {
  return (
    <PreviewCardPrimitive.Arrow
      data-slot="hover-card-arrow"
      className={cn("fill-popover", className)}
      {...props}
    />
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardArrow };
