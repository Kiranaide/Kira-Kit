import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "cn";
import {
  isFunctionProp,
  isNumberProp,
  isStringProp,
} from "@/components/ui/prop-guards";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

type StateClassName<S> =
  string | ((state: S) => string | undefined) | undefined;

type StateStyle<S> =
  | React.CSSProperties
  | ((state: S) => React.CSSProperties | undefined)
  | undefined;

function mergeClassName<S>(base: string, className: StateClassName<S>) {
  return isFunctionProp(className)
    ? (state: S) => cn(base, className(state))
    : cn(base, className);
}

function mergeStyle<S>(base: React.CSSProperties, style: StateStyle<S>) {
  return isFunctionProp(style)
    ? (state: S) => ({ ...base, ...style(state) })
    : { ...base, ...style };
}

const toCssLength = (v: number | string) => (isNumberProp(v) ? `${v}px` : v);

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

const tooltipContentVariants = cva(
  [
    "relative w-max rounded-md shadow-md",
    "max-w-[min(var(--tooltip-max-width),var(--available-width))]",
    "text-balance break-words",
    "origin-(--transform-origin) transition-[opacity,scale] duration-150 ease-out",
    "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
    "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
    "data-[instant]:transition-none motion-reduce:transition-none",
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
    defaultVariants: { variant: "default", size: "default" },
  },
);

const tooltipArrowVariants = cva(
  [
    "flex h-1.5 w-3",
    "data-[side=bottom]:-top-1.5",
    "data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180",
    "data-[side=left]:-right-[9px] data-[side=left]:rotate-90",
    "data-[side=right]:-left-[9px] data-[side=right]:-rotate-90",
    "data-[uncentered]:opacity-0",
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
    defaultVariants: { variant: "default" },
  },
);

type TooltipVariant = VariantProps<typeof tooltipContentVariants>["variant"];

type TooltipSize = VariantProps<typeof tooltipContentVariants>["size"];

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

type TooltipContextValue = {
  variant?: TooltipVariant;
  size?: TooltipSize;
  delay?: number;
  closeDelay?: number;
};

const TooltipContext = React.createContext<TooltipContextValue>({});

/* -------------------------------------------------------------------------- */
/*                                   Provider                                 */
/* -------------------------------------------------------------------------- */

interface TooltipProviderProps extends TooltipPrimitive.Provider.Props {
  /** @deprecated Use `delay` */
  delayDuration?: number;
  /** @deprecated Use `closeDelay` */
  closeDelayDuration?: number;
}

function TooltipProvider({
  delay,
  closeDelay,
  delayDuration,
  closeDelayDuration,
  timeout = 400,
  ...props
}: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      delay={delay ?? delayDuration ?? 500}
      closeDelay={closeDelay ?? closeDelayDuration ?? 200}
      timeout={timeout}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Root                                    */
/* -------------------------------------------------------------------------- */

interface TooltipProps<Payload = unknown> extends TooltipPrimitive.Root
  .Props<Payload> {
  variant?: TooltipVariant;
  size?: TooltipSize;
  delay?: number;
  closeDelay?: number;
  /** @deprecated Use `delay` */
  delayDuration?: number;
  /** @deprecated Use `closeDelay` */
  closeDelayDuration?: number;
}

function Tooltip<Payload = unknown>({
  variant,
  size,
  delay,
  closeDelay,
  delayDuration,
  closeDelayDuration,
  ...props
}: TooltipProps<Payload>) {
  const value = React.useMemo<TooltipContextValue>(
    () => ({
      variant,
      size,
      delay: delay ?? delayDuration,
      closeDelay: closeDelay ?? closeDelayDuration,
    }),
    [variant, size, delay, delayDuration, closeDelay, closeDelayDuration],
  );

  return (
    <TooltipContext.Provider value={value}>
      <TooltipPrimitive.Root {...props} />
    </TooltipContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Trigger                                  */
/* -------------------------------------------------------------------------- */

type TooltipTriggerProps<Payload = unknown> =
  TooltipPrimitive.Trigger.Props<Payload>;

function TooltipTrigger<Payload = unknown>({
  delay,
  closeDelay,
  ...props
}: TooltipTriggerProps<Payload>) {
  const ctx = React.useContext(TooltipContext);

  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      delay={delay ?? ctx.delay}
      closeDelay={closeDelay ?? ctx.closeDelay}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Shortcut                                  */
/* -------------------------------------------------------------------------- */

interface TooltipShortcutProps extends React.ComponentProps<"span"> {
  keys: string | readonly string[];
}

/** Visual-only. Expose the real shortcut with `aria-keyshortcuts` on the trigger. */
function TooltipShortcut({ keys, className, ...props }: TooltipShortcutProps) {
  const list = isStringProp(keys) ? [keys] : keys;
  const occurrences = new Map<string, number>();

  const keycaps = list.map((label) => {
    const occurrence = occurrences.get(label) ?? 0;
    occurrences.set(label, occurrence + 1);

    return { label, id: JSON.stringify([label, occurrence]) };
  });

  return (
    <span
      data-slot="tooltip-shortcut"
      aria-hidden="true"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    >
      {keycaps.map(({ label, id }) => (
        <kbd
          key={id}
          className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-current/20 bg-current/10 px-1 font-sans text-[0.7rem] leading-none font-medium"
        >
          {label}
        </kbd>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Content                                  */
/* -------------------------------------------------------------------------- */

type PositionerProps = TooltipPrimitive.Positioner.Props;

interface TooltipContentProps
  extends
    Omit<TooltipPrimitive.Popup.Props, "children">,
    VariantProps<typeof tooltipContentVariants> {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: PositionerProps["collisionPadding"];
  positionerProps?: Omit<
    PositionerProps,
    "side" | "align" | "sideOffset" | "alignOffset" | "collisionPadding"
  >;
  portalProps?: TooltipPrimitive.Portal.Props;
  maxWidth?: number | string;
  showArrow?: boolean;
  shortcut?: string | readonly string[];
  children?: React.ReactNode;
}

function TooltipContent({
  className,
  style,
  side: sideInput,
  align: alignInput,
  sideOffset: sideOffsetInput,
  alignOffset: alignOffsetInput,
  collisionPadding: collisionPaddingInput,
  positionerProps,
  portalProps,
  maxWidth: maxWidthInput,
  showArrow: showArrowInput,
  shortcut,
  variant,
  size,
  children,
  ...props
}: TooltipContentProps) {
  const { side, align, sideOffset, alignOffset, collisionPadding, maxWidth } =
    useTooltipContentOptions({
      side: sideInput,
      align: alignInput,
      sideOffset: sideOffsetInput,
      alignOffset: alignOffsetInput,
      collisionPadding: collisionPaddingInput,
      maxWidth: maxWidthInput,
    });

  const { showArrow } = useTooltipContentOptions2({
    showArrow: showArrowInput,
  });

  const ctx = React.useContext(TooltipContext);
  const resolvedVariant = variant ?? ctx.variant ?? "default";
  const resolvedSize = size ?? ctx.size ?? "default";

  return (
    <TooltipPrimitive.Portal {...portalProps}>
      <TooltipPrimitive.Positioner
        data-slot="tooltip-positioner"
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        {...positionerProps}
        className={mergeClassName("z-50", positionerProps?.className)}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={mergeClassName(
            tooltipContentVariants({
              variant: resolvedVariant,
              size: resolvedSize,
            }),
            className,
          )}
          style={mergeStyle(
            // SAFETY: only the custom `--tooltip-max-width` key is added; it is a
            // valid CSSProperties key (CSS custom property) whose value is
            // always a string produced by toCssLength above.
            {
              "--tooltip-max-width": toCssLength(maxWidth),
            } as React.CSSProperties,
            style,
          )}
          {...props}
        >
          {showArrow && <TooltipArrow variant={resolvedVariant} />}
          {shortcut ? (
            <span className="flex items-center gap-2">
              {children}
              <TooltipShortcut keys={shortcut} />
            </span>
          ) : (
            children
          )}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Arrow                                   */
/* -------------------------------------------------------------------------- */

interface TooltipArrowProps
  extends
    Omit<TooltipPrimitive.Arrow.Props, "children">,
    VariantProps<typeof tooltipArrowVariants> {}

function TooltipArrow({ className, variant, ...props }: TooltipArrowProps) {
  const ctx = React.useContext(TooltipContext);
  const resolvedVariant = variant ?? ctx.variant ?? "default";

  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={mergeClassName(
        tooltipArrowVariants({ variant: resolvedVariant }),
        className,
      )}
      {...props}
    >
      <svg width="12" height="6" viewBox="0 0 12 6" aria-hidden="true">
        <path d="M0 6L6 0L12 6" />
      </svg>
    </TooltipPrimitive.Arrow>
  );
}

/* -------------------------------------------------------------------------- */
/*                    Shared tooltip (one popup, many triggers)               */
/* -------------------------------------------------------------------------- */

type SharedTooltipPayload = {
  label: string;
  shortcut?: string | readonly string[];
};

const createTooltipHandle = TooltipPrimitive.createHandle;

function TooltipViewport({
  className,
  ...props
}: TooltipPrimitive.Viewport.Props) {
  return (
    <TooltipPrimitive.Viewport
      data-slot="tooltip-viewport"
      className={mergeClassName(
        cn(
          "relative",
          "*:data-previous:absolute *:data-previous:top-0 *:data-previous:left-0",
          "*:data-previous:w-(--popup-width) *:data-previous:animate-out *:data-previous:fade-out-0",
          "*:data-current:animate-in *:data-current:fade-in-0",
          "[&[data-activation-direction~=right]>[data-current]]:slide-in-from-right-2",
          "[&[data-activation-direction~=left]>[data-current]]:slide-in-from-left-2",
          "data-instant:*:animate-none motion-reduce:*:animate-none",
        ),
        className,
      )}
      {...props}
    />
  );
}

interface SharedTooltipProps extends Omit<
  TooltipContentProps,
  "children" | "shortcut"
> {
  handle: TooltipPrimitive.Handle<SharedTooltipPayload>;
}

function SharedTooltip({
  handle,
  variant,
  size,
  positionerProps,
  ...contentProps
}: SharedTooltipProps) {
  return (
    <Tooltip handle={handle} variant={variant} size={size}>
      {({ payload }) => (
        <TooltipContent
          {...contentProps}
          positionerProps={{
            ...positionerProps,
            className: mergeClassName(
              cn(
                "h-(--positioner-height) w-(--positioner-width)",
                "transition-[top,left,right,bottom] duration-200 ease-out",
                "data-[instant]:transition-none motion-reduce:transition-none",
              ),
              positionerProps?.className,
            ),
          }}
        >
          <TooltipViewport>
            {payload ? (
              <span className="flex items-center gap-2">
                {payload.label}
                {payload.shortcut && (
                  <TooltipShortcut keys={payload.shortcut} />
                )}
              </span>
            ) : null}
          </TooltipViewport>
        </TooltipContent>
      )}
    </Tooltip>
  );
}

interface SharedTooltipTriggerProps extends Omit<
  TooltipTriggerProps<SharedTooltipPayload>,
  "payload" | "handle"
> {
  handle: TooltipPrimitive.Handle<SharedTooltipPayload>;
  label: string;
  shortcut?: string | readonly string[];
}

function SharedTooltipTrigger({
  handle,
  label,
  shortcut,
  ...props
}: SharedTooltipTriggerProps) {
  const payload = React.useMemo(() => ({ label, shortcut }), [label, shortcut]);

  return (
    <TooltipTrigger
      handle={handle}
      payload={payload}
      aria-label={label}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                SimpleTooltip                               */
/* -------------------------------------------------------------------------- */

interface SimpleTooltipProps extends Pick<
  TooltipContentProps,
  "side" | "align" | "sideOffset" | "showArrow" | "maxWidth" | "shortcut"
> {
  content: React.ReactNode;
  /** Must accept ref + props (e.g. a button). Rendered via `render`, not wrapped. */
  children: React.ReactElement;
  variant?: TooltipVariant;
  size?: TooltipSize;
  delay?: number;
  closeDelay?: number;
  /** @deprecated Use `delay` */
  delayDuration?: number;
  /** @deprecated Use `closeDelay` */
  closeDelayDuration?: number;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: TooltipPrimitive.Root.Props["onOpenChange"];
}

function SimpleTooltip({
  content,
  children,
  variant,
  size,
  delay,
  closeDelay,
  delayDuration,
  closeDelayDuration,
  disabled,
  open,
  onOpenChange,
  ...contentProps
}: SimpleTooltipProps) {
  return (
    <Tooltip
      variant={variant}
      size={size}
      delay={delay ?? delayDuration}
      closeDelay={closeDelay ?? closeDelayDuration}
      disabled={disabled}
      open={open}
      onOpenChange={onOpenChange}
    >
      <TooltipTrigger render={children} />
      <TooltipContent {...contentProps}>{content}</TooltipContent>
    </Tooltip>
  );
}

/* -------------------------------------------------------------------------- */

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
  TooltipShortcut,
  TooltipViewport,
  SharedTooltip,
  SharedTooltipTrigger,
  SimpleTooltip,
  createTooltipHandle,
  tooltipContentVariants,
  tooltipArrowVariants,
};

export type {
  TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipArrowProps,
  TooltipProviderProps,
  TooltipShortcutProps,
  SharedTooltipProps,
  SharedTooltipTriggerProps,
  SharedTooltipPayload,
  SimpleTooltipProps,
};

function resolveTooltipContentOptions({
  side = "top",
  align = "center",
  sideOffset = 8,
  alignOffset = 0,
  collisionPadding = 8,
  maxWidth = 250,
}: {
  side?: TooltipContentProps["side"];
  align?: TooltipContentProps["align"];
  sideOffset?: TooltipContentProps["sideOffset"];
  alignOffset?: TooltipContentProps["alignOffset"];
  collisionPadding?: TooltipContentProps["collisionPadding"];
  maxWidth?: TooltipContentProps["maxWidth"];
}) {
  return { side, align, sideOffset, alignOffset, collisionPadding, maxWidth };
}

function resolveTooltipContentOptions2({
  showArrow = true,
}: {
  showArrow?: TooltipContentProps["showArrow"];
}) {
  return { showArrow };
}

function useTooltipContentOptions({
  side: sideInput,
  align: alignInput,
  sideOffset: sideOffsetInput,
  alignOffset: alignOffsetInput,
  collisionPadding: collisionPaddingInput,
  maxWidth: maxWidthInput,
}: Parameters<typeof resolveTooltipContentOptions>[0]) {
  return React.useMemo(
    () =>
      resolveTooltipContentOptions({
        side: sideInput,
        align: alignInput,
        sideOffset: sideOffsetInput,
        alignOffset: alignOffsetInput,
        collisionPadding: collisionPaddingInput,
        maxWidth: maxWidthInput,
      }),
    [
      sideInput,
      alignInput,
      sideOffsetInput,
      alignOffsetInput,
      collisionPaddingInput,
      maxWidthInput,
    ],
  );
}

function useTooltipContentOptions2({
  showArrow: showArrowInput,
}: Parameters<typeof resolveTooltipContentOptions2>[0]) {
  return React.useMemo(
    () => resolveTooltipContentOptions2({ showArrow: showArrowInput }),
    [showArrowInput],
  );
}
