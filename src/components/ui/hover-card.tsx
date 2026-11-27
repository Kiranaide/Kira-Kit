"use client";

import * as React from "react";
import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { IconLoader2 } from "@tabler/icons-react";

type HoverCardProps<Payload = unknown> =
  PreviewCardPrimitive.Root.Props<Payload>;

type HoverCardTriggerProps = PreviewCardPrimitive.Trigger.Props;

interface HoverCardContentProps
  extends
    PreviewCardPrimitive.Popup.Props,
    VariantProps<typeof hoverCardContentVariants> {
  side?: PreviewCardPrimitive.Positioner.Props["side"];
  sideOffset?: PreviewCardPrimitive.Positioner.Props["sideOffset"];
  align?: PreviewCardPrimitive.Positioner.Props["align"];
  alignOffset?: PreviewCardPrimitive.Positioner.Props["alignOffset"];
  arrowPadding?: PreviewCardPrimitive.Positioner.Props["arrowPadding"];
  collisionBoundary?: PreviewCardPrimitive.Positioner.Props["collisionBoundary"];
  collisionPadding?: PreviewCardPrimitive.Positioner.Props["collisionPadding"];
  sticky?: PreviewCardPrimitive.Positioner.Props["sticky"];
  portalled?: boolean;
  viewport?: boolean;
  variant?: "default" | "blur";
}

type HoverCardArrowProps = PreviewCardPrimitive.Arrow.Props;

type HoverCardViewportProps = PreviewCardPrimitive.Viewport.Props;

interface HoverCardAnchorProps extends React.ComponentProps<
  typeof PreviewCardPrimitive.Trigger
> {
  href?: string;
  target?: string;
  rel?: string;
}

type HoverCardHeaderProps = React.ComponentProps<"div">;

type HoverCardFooterProps = React.ComponentProps<"div">;

type HoverCardTitleProps = React.ComponentProps<"h4">;

type HoverCardDescriptionProps = React.ComponentProps<"p">;

interface HoverCardLoadingProps extends React.ComponentProps<"div"> {
  message?: string;
}

const hoverCardContentVariants = cva(
  "origin-(--transform-origin) transition-[opacity,scale] duration-150 ease-out data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[instant]:transition-none motion-reduce:transition-none rounded-lg border border-border bg-popover p-4 shadow-lg outline-none",
  {
    variants: {
      size: {
        sm: "w-48",
        md: "w-64",
        lg: "w-80",
        xl: "w-96",
        auto: "w-auto max-w-sm",
      },
      variant: {
        default: "",
        blur: "backdrop-blur-md bg-popover/80 border-border/50",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

function createHoverCardHandle<Payload>() {
  return PreviewCardPrimitive.createHandle<Payload>();
}

interface HoverCardPayloadTriggerProps<Payload> extends PreviewCardPrimitive
  .Trigger.Props<Payload> {}

function HoverCardPayloadTrigger<Payload>({
  className,
  children,
  ...props
}: HoverCardPayloadTriggerProps<Payload>) {
  return (
    <PreviewCardPrimitive.Trigger
      data-slot="hover-card-payload-trigger"
      className={cn("focus:outline-none", className)}
      {...props}
    >
      {children}
    </PreviewCardPrimitive.Trigger>
  );
}

function HoverCard<Payload>({ children, ...props }: HoverCardProps<Payload>) {
  return (
    <PreviewCardPrimitive.Root<Payload> data-slot="hover-card" {...props}>
      {children}
    </PreviewCardPrimitive.Root>
  );
}

function HoverCardTrigger({
  className,
  children,
  ...props
}: HoverCardTriggerProps) {
  return (
    <PreviewCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      className={cn("focus:outline-none", className)}
      {...props}
    >
      {children}
    </PreviewCardPrimitive.Trigger>
  );
}

function HoverCardAnchor({
  className,
  children,
  href,
  target,
  rel,
  ...props
}: HoverCardAnchorProps) {
  return (
    <PreviewCardPrimitive.Trigger
      data-slot="hover-card-anchor"
      render={
        <a
          href={href}
          target={target}
          rel={rel}
          className={cn(
            "text-primary underline underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:no-underline focus-visible:outline focus-visible:outline-ring cursor-pointer",
            className,
          )}
        >
          {children}
        </a>
      }
      {...props}
    >
      {children}
    </PreviewCardPrimitive.Trigger>
  );
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
  variant,
  portalled = true,
  viewport = false,
  ...props
}: HoverCardContentProps) {
  const content = (
    <PreviewCardPrimitive.Positioner
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      arrowPadding={arrowPadding}
      collisionBoundary={collisionBoundary}
      collisionPadding={collisionPadding}
      sticky={sticky}
      className="z-50"
    >
      <PreviewCardPrimitive.Popup
        data-slot="hover-card-content"
        className={cn(hoverCardContentVariants({ size, variant }), className)}
        {...props}
      >
        {viewport ? (
          <PreviewCardPrimitive.Viewport
            className={cn(
              "relative",
              "*:data-previous:absolute *:data-previous:top-0 *:data-previous:left-0",
              "*:data-previous:w-(--popup-width) *:data-previous:animate-out *:data-previous:fade-out-0",
              "*:data-current:animate-in *:data-current:fade-in-0",
              "data-instant:*:animate-none motion-reduce:*:animate-none",
            )}
          >
            {props.children}
          </PreviewCardPrimitive.Viewport>
        ) : (
          props.children
        )}
      </PreviewCardPrimitive.Popup>
    </PreviewCardPrimitive.Positioner>
  );

  if (portalled) {
    return <PreviewCardPrimitive.Portal>{content}</PreviewCardPrimitive.Portal>;
  }

  return content;
}

function HoverCardArrow({ className, ...props }: HoverCardArrowProps) {
  return (
    <PreviewCardPrimitive.Arrow
      data-slot="hover-card-arrow"
      className={cn("fill-popover", className)}
      {...props}
    />
  );
}

function HoverCardViewport({
  className,
  ...props
}: PreviewCardPrimitive.Viewport.Props) {
  return (
    <PreviewCardPrimitive.Viewport
      data-slot="hover-card-viewport"
      className={cn(
        "relative",
        "*:data-previous:absolute *:data-previous:top-0 *:data-previous:left-0",
        "*:data-previous:w-(--popup-width) *:data-previous:animate-out *:data-previous:fade-out-0",
        "*:data-current:animate-in *:data-current:fade-in-0",
        "data-instant:*:animate-none motion-reduce:*:animate-none",
        className,
      )}
      {...props}
    />
  );
}

function HoverCardHeader({ className, ...props }: HoverCardHeaderProps) {
  return (
    <div
      data-slot="hover-card-header"
      className={cn("flex items-start gap-3 mb-3", className)}
      {...props}
    />
  );
}

function HoverCardFooter({ className, ...props }: HoverCardFooterProps) {
  return (
    <div
      data-slot="hover-card-footer"
      className={cn(
        "flex items-center justify-between mt-3 pt-3 border-t border-border text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function HoverCardTitle({
  className,
  children,
  ...props
}: HoverCardTitleProps) {
  return (
    <h4
      data-slot="hover-card-title"
      className={cn("text-sm font-semibold leading-none", className)}
      {...props}
    >
      {children}
    </h4>
  );
}

function HoverCardDescription({
  className,
  ...props
}: HoverCardDescriptionProps) {
  return (
    <p
      data-slot="hover-card-description"
      className={cn("text-sm text-muted-foreground mt-1", className)}
      {...props}
    />
  );
}

function HoverCardLoading({
  className,
  message = "Loading...",
  ...props
}: HoverCardLoadingProps) {
  return (
    <div
      data-slot="hover-card-loading"
      className={cn(
        "flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    >
      <IconLoader2 className="h-4 w-4 animate-spin" />
      <span>{message}</span>
    </div>
  );
}

interface HoverCardImageProps extends React.ComponentProps<"img"> {
  aspectRatio?: "video" | "square" | "portrait";
}

function HoverCardImage({
  className,
  aspectRatio = "video",
  alt = "",
  ...props
}: HoverCardImageProps) {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  };

  return (
    <img
      data-slot="hover-card-image"
      alt={alt}
      className={cn(
        "w-full rounded-md object-cover mb-2",
        aspectClasses[aspectRatio],
        className,
      )}
      {...props}
    />
  );
}

export {
  createHoverCardHandle,
  HoverCard,
  HoverCardTrigger,
  HoverCardPayloadTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardAnchor,
  HoverCardHeader,
  HoverCardFooter,
  HoverCardTitle,
  HoverCardDescription,
  HoverCardLoading,
  HoverCardViewport,
  HoverCardImage,
  hoverCardContentVariants,
};

export type {
  HoverCardProps,
  HoverCardTriggerProps,
  HoverCardPayloadTriggerProps,
  HoverCardContentProps,
  HoverCardArrowProps,
  HoverCardAnchorProps,
  HoverCardHeaderProps,
  HoverCardFooterProps,
  HoverCardTitleProps,
  HoverCardDescriptionProps,
  HoverCardLoadingProps,
  HoverCardViewportProps,
  HoverCardImageProps,
};
