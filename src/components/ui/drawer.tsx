import * as React from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { IconX } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { isFunctionProp } from "@/components/ui/prop-guards";

type DrawerSide = "left" | "right" | "top" | "bottom";

function mergeClassName<S>(
  base: string,
  className: string | ((state: S) => string | undefined) | undefined,
) {
  return isFunctionProp(className)
    ? (state: S) => cn(base, className(state))
    : cn(base, className);
}

// SAFETY: React's CSSProperties omits custom properties; this value is a CSS variable reference.
const snapStyle = {
  "--kira-snap-offset": "var(--drawer-snap-point-offset, 0px)",
} as React.CSSProperties;

const drawerVariants = cva(
  "group/drawer fixed z-50 flex min-h-0 flex-col overflow-hidden border border-border bg-background shadow-xl outline-none transition-[transform,box-shadow] duration-300 motion-reduce:transition-none data-swiping:duration-0 data-nested-drawer-swiping:duration-0 data-starting-style:shadow-none data-ending-style:shadow-none [transform:translate3d(var(--drawer-swipe-movement-x,0px),calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)),0)] data-starting-style:[transform:var(--drawer-closed-transform)] data-ending-style:[transform:var(--drawer-closed-transform)] data-[swipe-direction=left]:inset-y-0 data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:h-full data-[swipe-direction=left]:[--drawer-closed-transform:translate3d(-100%,0,0)] data-[swipe-direction=right]:inset-y-0 data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:h-full data-[swipe-direction=right]:[--drawer-closed-transform:translate3d(100%,0,0)] data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:w-full data-[swipe-direction=up]:[--drawer-closed-transform:translate3d(0,-100%,0)] data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:w-full data-[swipe-direction=down]:[--drawer-closed-transform:translate3d(0,100%,0)]",
  {
    variants: {
      size: {
        sm: "data-[swipe-direction=left]:w-3/4 data-[swipe-direction=left]:max-w-xs data-[swipe-direction=right]:w-3/4 data-[swipe-direction=right]:max-w-xs data-[swipe-direction=up]:max-h-[30dvh] data-[swipe-direction=down]:max-h-[30dvh]",
        default:
          "data-[swipe-direction=left]:w-3/4 data-[swipe-direction=left]:max-w-sm data-[swipe-direction=right]:w-3/4 data-[swipe-direction=right]:max-w-sm data-[swipe-direction=up]:max-h-[80dvh] data-[swipe-direction=down]:max-h-[80dvh]",
        lg: "data-[swipe-direction=left]:w-3/4 data-[swipe-direction=left]:max-w-lg data-[swipe-direction=right]:w-3/4 data-[swipe-direction=right]:max-w-lg data-[swipe-direction=up]:max-h-[90dvh] data-[swipe-direction=down]:max-h-[90dvh]",
        xl: "data-[swipe-direction=left]:w-3/4 data-[swipe-direction=left]:max-w-xl data-[swipe-direction=right]:w-3/4 data-[swipe-direction=right]:max-w-xl data-[swipe-direction=up]:h-dvh data-[swipe-direction=down]:h-dvh",
        full: "data-[swipe-direction=left]:w-screen data-[swipe-direction=right]:w-screen data-[swipe-direction=up]:h-dvh data-[swipe-direction=down]:h-dvh",
      },
    },
    defaultVariants: { size: "default" },
  },
);

const drawerDirections = {
  left: "left",
  right: "right",
  top: "up",
  bottom: "down",
} as const;

const DrawerModalContext = React.createContext({
  modal: true,
  hasSnapPoints: false,
});

type SnapProps = Pick<
  DrawerPrimitive.Root.Props,
  | "snapPoints"
  | "snapPoint"
  | "defaultSnapPoint"
  | "onSnapPointChange"
  | "snapToSequentialPoints"
>;

type DrawerProps<Payload = unknown> = Omit<
  DrawerPrimitive.Root.Props<Payload>,
  "swipeDirection" | keyof SnapProps
> &
  (
    | ({ side: "bottom" } & SnapProps)
    | ({ side?: DrawerSide } & { [K in keyof SnapProps]?: never })
  );

function Drawer<Payload = unknown>({
  side = "right",
  modal = true,
  ...props
}: DrawerProps<Payload>) {
  const nonModal = modal === false;

  return (
    <DrawerModalContext.Provider
      value={{
        modal: modal === true,
        hasSnapPoints: !!props.snapPoints?.length,
      }}
    >
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        swipeDirection={drawerDirections[side]}
        // Non-modal recipe (Base UI 1.9): modal={false} alone still closes on
        // outside presses and focus moving out. bake disablePointerDismissal so
        // non-modal drawers stay open while the page is used; Esc, Drawer.Close
        // and swipe still dismiss. An explicit consumer prop wins.
        disablePointerDismissal={
          nonModal && props.disablePointerDismissal === undefined
            ? true
            : props.disablePointerDismissal
        }
        {...props}
      />
    </DrawerModalContext.Provider>
  );
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

interface DrawerHandleProps extends Omit<ButtonPrimitive.Props, "children"> {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

function DrawerHandle({
  expanded,
  onExpandedChange,
  className,
  onClick,
  ...props
}: DrawerHandleProps) {
  return (
    <ButtonPrimitive
      data-slot="drawer-handle"
      data-base-ui-swipe-ignore=""
      aria-label={expanded ? "Collapse drawer" : "Expand drawer"}
      aria-expanded={expanded}
      className={mergeClassName<ButtonPrimitive.State>(
        "mx-auto flex min-h-8 w-20 shrink-0 items-center justify-center rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:opacity-50",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) onExpandedChange(!expanded);
      }}
      {...props}
    >
      <span
        data-slot="drawer-handle-indicator"
        aria-hidden="true"
        className="h-1 w-10 rounded-full bg-muted-foreground/40"
      />
    </ButtonPrimitive>
  );
}

function DrawerOverlay({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={mergeClassName<DrawerPrimitive.Backdrop.State>(
        "fixed inset-0 z-50 min-h-dvh bg-black/50 opacity-[max(var(--drawer-overlay-min-opacity,0),calc(1-var(--drawer-swipe-progress,0)))] transition-opacity duration-300 motion-reduce:transition-none data-snap-points:[--drawer-overlay-min-opacity:0.5] data-starting-style:opacity-0 data-ending-style:opacity-0 data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute",
        className,
      )}
      {...props}
    />
  );
}

interface DrawerContentProps
  extends DrawerPrimitive.Popup.Props, VariantProps<typeof drawerVariants> {
  showCloseButton?: boolean;
  portalProps?: Omit<DrawerPrimitive.Portal.Props, "children">;
  /** Configure the internal backdrop without duplicating drawer composition. */
  overlayProps?: DrawerPrimitive.Backdrop.Props;
}

function DrawerContent({
  className,
  style,
  children,
  portalProps,
  overlayProps,
  size = "default",
  showCloseButton = true,
  ...props
}: DrawerContentProps) {
  const resolveStyle1 = () => drawerResolveStyle1(style);

  const { modal, hasSnapPoints } = React.useContext(DrawerModalContext);

  return (
    <DrawerPortal {...portalProps}>
      {modal && (
        <DrawerOverlay
          {...overlayProps}
          data-snap-points={hasSnapPoints ? "" : undefined}
        />
      )}
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        data-modal={modal}
        className="pointer-events-none fixed inset-0 z-50 data-[modal=true]:pointer-events-auto"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-popup"
          data-modal={modal}
          data-snap-points={hasSnapPoints ? "" : undefined}
          style={resolveStyle1()}
          className={mergeClassName<DrawerPrimitive.Popup.State>(
            cn(
              drawerVariants({ size }),
              "pointer-events-auto data-snap-points:data-[swipe-direction=up]:h-dvh data-snap-points:data-[swipe-direction=up]:max-h-none data-snap-points:data-[swipe-direction=down]:h-dvh data-snap-points:data-[swipe-direction=down]:max-h-none",
              { "data-[modal=false]:shadow-md": !modal },
            ),
            className,
          )}
          {...props}
        >
          <DrawerPrimitive.Content
            data-slot="drawer-content"
            className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain select-text max-h-[calc(100dvh-var(--kira-snap-offset,0px)-2px)]"
          >
            {children}
          </DrawerPrimitive.Content>
          {showCloseButton && (
            <DrawerClose
              className="absolute right-4 top-4 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring motion-reduce:transition-none"
              aria-label="Close"
            >
              <IconX aria-hidden="true" className="h-4 w-4" />
            </DrawerClose>
          )}
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  );
}

function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    // kira-kit-ignore spacing-scale: title-to-description optical gap (contract-sanctioned exception)
    <div
      data-slot="drawer-header"
      className={cn(
        "flex min-w-0 shrink-0 flex-col gap-1.5 wrap-break-word px-4 py-4 pr-12 border-b border-border",
        className,
      )}
      {...props}
    />
  );
}

function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "flex shrink-0 flex-col gap-2 p-4 border-t border-border mt-auto",
        className,
      )}
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={mergeClassName<DrawerPrimitive.Title.State>(
        "min-w-0 wrap-break-word text-lg font-semibold",
        className,
      )}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={mergeClassName<DrawerPrimitive.Description.State>(
        "text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DrawerBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="drawer-body"
      className={cn("min-h-0 flex-1 overflow-y-auto p-4", className)}
      {...props}
    />
  );
}

type WithoutChildren<Props> = Props extends unknown
  ? Omit<Props, "children">
  : never;

interface KiraDrawerProps {
  trigger: React.ReactElement;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  rootProps?: WithoutChildren<DrawerProps>;
  contentProps?: Omit<DrawerContentProps, "children">;
  /** Optional keyboard-operable control above the sheet header. */
  handle?: React.ReactNode;
}

function KiraDrawer({
  trigger,
  title,
  description,
  children,
  footer,
  rootProps,
  contentProps,
  handle,
}: KiraDrawerProps) {
  const buildHeader = () => (
    <DrawerHeader>
      <DrawerTitle>{title}</DrawerTitle>
      {description != null && (
        <DrawerDescription>{description}</DrawerDescription>
      )}
    </DrawerHeader>
  );

  const buildFooter = () =>
    footer != null && <DrawerFooter>{footer}</DrawerFooter>;

  const wrapContent = () => (
    <DrawerContent {...contentProps}>
      {handle}
      {buildHeader()}
      <DrawerBody>{children}</DrawerBody>
      {buildFooter()}
    </DrawerContent>
  );

  return (
    <Drawer {...rootProps}>
      <DrawerTrigger render={trigger} />
      {wrapContent()}
    </Drawer>
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerHandle,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  KiraDrawer,
  drawerVariants,
};

export type {
  DrawerSide,
  DrawerProps,
  DrawerContentProps,
  DrawerHandleProps,
  KiraDrawerProps,
};

function drawerResolveStyle1(
  style:
    | React.CSSProperties
    | ((state: DrawerPrimitive.Popup.State) => React.CSSProperties | undefined)
    | undefined,
) {
  if (isFunctionProp(style)) {
    return (state: DrawerPrimitive.Popup.State) => ({
      ...snapStyle,
      ...style(state),
    });
  }

  if (style) {
    return { ...snapStyle, ...style };
  }

  return snapStyle;
}
