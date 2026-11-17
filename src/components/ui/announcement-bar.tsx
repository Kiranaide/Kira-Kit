/* oxlint-disable react/only-export-components -- public compound API and hooks */
"use client";

import * as React from "react";
import { reactContentKey, withContentKeys } from "@/components/ui/content-keys";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconInfoCircle,
  IconPlayerPause,
  IconPlayerPlay,
  IconX,
} from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "cn";
import { isNumberProp, isStringProp } from "@/components/ui/prop-guards";

const announcementBarVariants = cva(
  "relative flex w-full min-w-0 flex-wrap items-center gap-3 px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground",
        info: "bg-info/10 text-foreground",
        success: "bg-success/10 text-foreground",
        warning: "bg-warning/10 text-foreground",
        destructive: "bg-destructive/10 text-foreground",
      },
      position: {
        inline: "",
        top: "sticky top-0 z-50",
        bottom: "fixed inset-x-0 bottom-0 z-50",
        floating:
          "fixed inset-x-4 top-4 z-50 mx-auto max-w-2xl rounded-lg border border-border shadow-lg",
      },
      priority: {
        low: "",
        normal: "",
        high: "font-medium",
        critical: "font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "inline",
      priority: "normal",
    },
  },
);

type AnnouncementVariant = NonNullable<
  VariantProps<typeof announcementBarVariants>["variant"]
>;

type AnnouncementPosition = NonNullable<
  VariantProps<typeof announcementBarVariants>["position"]
>;

type AnnouncementPriority = NonNullable<
  VariantProps<typeof announcementBarVariants>["priority"]
>;

type AnnouncementUrgency = "polite" | "assertive";

type AnimationType = "slide" | "fade" | "scale" | "none";

type PersistMode = "session" | "persistent";

interface AnnouncementBarProps
  extends
    Omit<useRender.ComponentProps<"div">, "className">,
    VariantProps<typeof announcementBarVariants> {
  className?: string;
  urgency?: AnnouncementUrgency;
  autoDismiss?: number;
  showProgress?: boolean;
  marquee?: boolean;
  icon?: React.ReactNode;
  dismissible?: boolean;
  persistMode?: PersistMode;
  expiresAt?: Date;
  startsAt?: Date;
  onDismiss?: () => void;
  animation?: AnimationType;
  announcementId?: string;
  paused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  disabled?: boolean;
}

interface AnnouncementBarContentProps extends React.ComponentProps<"div"> {
  marquee?: boolean;
}

interface AnnouncementBarActionProps extends Omit<
  ButtonPrimitive.Props,
  "className" | "onClick"
> {
  onClick?: React.MouseEventHandler<HTMLElement>;
  href?: string;
  target?: string;
  rel?: string;
  download?: string | boolean;
  variant?: "link" | "button" | "outline";
  className?: string;
}

interface AnnouncementBarDismissProps extends React.ComponentProps<
  typeof Button
> {
  label?: string;
}

interface AnnouncementBarIconProps extends React.ComponentProps<"span"> {
  icon?: React.ReactNode;
  variant?: AnnouncementVariant;
}

interface AnnouncementBarProgressProps extends React.ComponentProps<"div"> {
  value: number;
  variant?: AnnouncementVariant;
  duration?: number;
  paused?: boolean;
}

interface AnnouncementBarContextValue {
  variant: AnnouncementVariant;
  priority: AnnouncementPriority;
  urgency: AnnouncementUrgency;
  isPaused: boolean;
  playbackPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  dismiss: () => void;
  extend: () => void;
  disabled: boolean;
}

const AnnouncementBarContext = React.createContext<
  AnnouncementBarContextValue | undefined
>(undefined);

function useAnnouncementBar() {
  const context = React.useContext(AnnouncementBarContext);

  if (!context)
    throw new Error("useAnnouncementBar must be used within AnnouncementBar");

  return context;
}

/** Browser visibility is external state; hidden panels and documents stop timers. */
function useAnnouncementActivity(element: HTMLElement | null) {
  const store = React.useMemo(() => announcementBarUseMemo(element), [element]);

  return React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    () => false,
  );
}

const dismissalEvent = "kira-announcement-dismissal";
const volatileDismissals = new Map<string, boolean>();

function useAnnouncementDismiss(key: string, mode: PersistMode = "persistent") {
  const storageKey = `announcement-${key}`;
  const identity = `${mode}:${storageKey}`;

  const subscribe = React.useCallback(
    (notify: () => void) => announcementBarUseCallback(notify),
    [],
  );

  const getSnapshot = React.useCallback(
    () => announcementBarUseCallback2(key, identity, mode, storageKey),
    [key, mode, storageKey, identity],
  );

  const dismissed = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => false,
  );

  const write = React.useCallback(
    (value: boolean) =>
      announcementBarUseCallback3(value, key, mode, storageKey, identity),
    [key, mode, storageKey, identity],
  );

  const dismiss = React.useCallback(() => write(true), [write]);
  const reset = React.useCallback(() => write(false), [write]);

  return [dismissed, dismiss, reset] as const;
}

// One shared clock, suspended in hidden documents, instead of one interval per part.
let clockTime = Date.now();
const clockListeners = new Set<() => void>();
let clockInterval: ReturnType<typeof setInterval> | undefined;

function refreshClock() {
  clockTime = Date.now();
  clockListeners.forEach((notify) => notify());
}

function syncClockVisibility() {
  clearInterval(clockInterval);
  clockInterval = undefined;
  refreshClock();

  if (document.visibilityState !== "hidden")
    clockInterval = setInterval(refreshClock, 1000);
}

function subscribeClock(notify: () => void) {
  clockListeners.add(notify);

  if (clockListeners.size === 1) {
    document.addEventListener("visibilitychange", syncClockVisibility);
    syncClockVisibility();
  }

  return () => announcementBarCallback(notify);
}

const getClock = () => clockTime;
const getServerClock = () => 0;
const subscribeNoClock = () => () => {};

function useAnnouncementExpiry(expiresAt?: Date) {
  const target = expiresAt?.getTime();
  const enabled = target !== undefined && Number.isFinite(target);

  const now = React.useSyncExternalStore(
    enabled ? subscribeClock : subscribeNoClock,
    getClock,
    getServerClock,
  );

  return target !== undefined && Number.isFinite(target) && now >= target;
}

function countdownLabel(
  target: number | undefined,
  now: number,
): string | null {
  if (target === undefined || !Number.isFinite(target)) return null;
  const remaining = Math.max(0, Math.ceil((target - now) / 1000));

  if (!remaining) return null;
  const days = Math.floor(remaining / 86_400);
  const hours = Math.floor((remaining % 86_400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  if (days) return `${days}d ${hours}h`;

  if (hours) return `${hours}h ${minutes}m`;

  return `${minutes}m ${seconds}s`;
}

function useCountdown(target?: Date, paused = false) {
  const timestamp = target?.getTime();

  const frozen = React.useMemo(
    () => ({ paused, timestamp, time: clockTime }),
    [paused, timestamp],
  );

  const enabled =
    timestamp !== undefined && Number.isFinite(timestamp) && !paused;

  const subscribe = React.useCallback(
    (notify: () => void) => (enabled ? subscribeClock(notify) : () => {}),
    [enabled],
  );

  const snapshot = React.useCallback(
    () => (paused ? frozen.time : clockTime),
    [paused, frozen],
  );

  const now = React.useSyncExternalStore(subscribe, snapshot, getServerClock);

  return countdownLabel(timestamp, now);
}

function AnnouncementBar(arg0: AnnouncementBarProps) {
  const model = useAnnouncementBarModel(arg0);

  return <AnnouncementBarView {...model} />;
}

const variantIcons: Record<AnnouncementVariant, React.ReactNode> = {
  default: <IconInfoCircle aria-hidden="true" className="size-5" />,
  info: <IconInfoCircle aria-hidden="true" className="size-5" />,
  success: <IconCheck aria-hidden="true" className="size-5" />,
  warning: <IconAlertTriangle aria-hidden="true" className="size-5" />,
  destructive: <IconAlertCircle aria-hidden="true" className="size-5" />,
};

const iconColors: Record<AnnouncementVariant, string> = {
  default: "text-muted-foreground",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

function AnnouncementBarIcon({
  icon,
  variant,
  className,
  ...props
}: AnnouncementBarIconProps) {
  const context = React.useContext(AnnouncementBarContext);
  const current = variant ?? context?.variant ?? "default";

  return (
    <span
      data-slot="announcement-bar-icon"
      aria-hidden="true"
      className={cn("shrink-0", iconColors[current], className)}
      {...props}
    >
      {icon === undefined ? variantIcons[current] : icon}
    </span>
  );
}

function AnnouncementBarContent({
  marquee = false,
  className,
  children,
  ref,
  ...props
}: AnnouncementBarContentProps) {
  const context = React.useContext(AnnouncementBarContext);
  const reducedMotion = useReducedMotion();
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);
  const [paused, setPaused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const active = useAnnouncementActivity(element);

  const stopped = [
    paused,
    hovered,
    !active,
    context?.isPaused,
    reducedMotion,
  ].some(Boolean);

  const moving = marquee && !stopped;

  // SAFETY: Native element props are valid; data attributes and numeric CSS custom properties extend React's closed types.
  return useRender({
    defaultTagName: "div",
    ref: [ref ?? null, setElement],
    props: mergeProps<"div">(
      {
        "data-slot": "announcement-bar-content",
        role: "status",
        "aria-live": context?.urgency ?? "polite",
        "aria-atomic": true,
        className: cn(
          "flex min-w-0 flex-1 basis-48 flex-wrap items-center gap-3 wrap-anywhere sm:basis-0",
          className,
        ),
        onPointerEnter: () => setHovered(true),
        onPointerLeave: () => setHovered(false),
        onFocusCapture: () => setPaused(true),
        children: (
          <AnnouncementBarMessageView
            moving={moving}
            setPaused={setPaused}
            marquee={marquee}
            stopped={stopped}
            context={context}
            reducedMotion={reducedMotion}
          >
            {children}
          </AnnouncementBarMessageView>
        ),
      } as React.ComponentProps<"div">,
      props,
    ),
  });
}

function AnnouncementBarAction({
  href,
  target,
  rel,
  download,
  variant = "link",
  className,
  render,
  nativeButton,
  ref,
  disabled,
  focusableWhenDisabled,
  onClick,
  ...props
}: AnnouncementBarActionProps) {
  const context = React.useContext(AnnouncementBarContext);
  const inactive = disabled || context?.disabled;

  const classes = cn(
    buttonVariants({
      variant: variant === "button" ? "secondary" : variant,
      size: "sm",
    }),
    "min-h-11 max-w-full whitespace-normal wrap-anywhere text-start sm:min-h-8",
    { "text-current underline": variant === "link" },
    "motion-reduce:transition-none",
    { "pointer-events-none opacity-50": inactive },
    className,
  );

  const link = useRender({
    defaultTagName: "a",
    render,
    ref,
    state: { disabled: Boolean(inactive) },
    enabled: Boolean(href),
    props: {
      ...props,
      "data-slot": "announcement-bar-action",
      "data-disabled": inactive || undefined,
      href: inactive ? undefined : href,
      target,
      rel,
      download,
      role: "link",
      "aria-disabled": inactive || undefined,
      tabIndex: announcementActionTabIndex(
        inactive,
        focusableWhenDisabled,
        props.tabIndex,
      ),
      className: classes,
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        if (inactive) event.preventDefault();
        else onClick?.(event);
      },
    },
  });

  if (href) return link;

  return (
    <ButtonPrimitive
      data-slot="announcement-bar-action"
      nativeButton={nativeButton ?? !render}
      render={render}
      ref={ref}
      className={classes}
      {...props}
      disabled={inactive}
      focusableWhenDisabled={focusableWhenDisabled}
      onClick={onClick}
    />
  );
}

function AnnouncementBarDismiss({
  label = "Dismiss announcement",
  onClick,
  className,
  ...props
}: AnnouncementBarDismissProps) {
  const context = React.useContext(AnnouncementBarContext);

  return (
    <Button
      data-slot="announcement-bar-dismiss"
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      className={cn("ms-auto size-11 shrink-0 text-current", className)}
      {...props}
      disabled={props.disabled || context?.disabled}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) context?.dismiss();
      }}
    >
      <IconX aria-hidden="true" className="size-4" />
    </Button>
  );
}

function AnnouncementBarPause({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const context = useAnnouncementBar();

  return (
    <Button
      data-slot="announcement-bar-pause"
      type="button"
      variant="ghost"
      size="sm"
      aria-pressed={context.playbackPaused}
      className={cn("min-h-11 sm:min-h-8", className)}
      {...props}
      onClick={(event) => {
        props.onClick?.(event);

        if (!event.defaultPrevented)
          context.setIsPaused(!context.playbackPaused);
      }}
    >
      <span
        key={String(context.playbackPaused)}
        data-slot="announcement-bar-playback-icon"
        className="inline-flex motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-75 duration-150"
      >
        {context.playbackPaused ? (
          <IconPlayerPlay aria-hidden="true" className="size-4" />
        ) : (
          <IconPlayerPause aria-hidden="true" className="size-4" />
        )}
      </span>
      {context.playbackPaused ? "Resume timer" : "Pause timer"}
    </Button>
  );
}

function AnnouncementBarProgress({
  value,
  variant = "default",
  duration,
  paused = false,
  className,
  ...props
}: AnnouncementBarProgressProps) {
  const reducedMotion = useReducedMotion();

  const percent = Number.isFinite(value)
    ? Math.max(0, Math.min(100, value))
    : 0;

  const [initialPercent] = React.useState(percent);

  const colors: Record<AnnouncementVariant, string> = {
    default: "bg-muted-foreground",
    info: "bg-info",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
  };

  return (
    <div
      data-slot="announcement-bar-progress"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The custom visual progress track exposes its range via ARIA while retaining its existing animation.
      role="progressbar"
      aria-label="Time remaining"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      className={cn(
        "absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-foreground/10",
        className,
      )}
      {...props}
    >
      {duration && !reducedMotion && (
        <style data-slot="announcement-bar-progress-style">
          {
            "@keyframes kira-announcement-progress { to { transform: scaleX(0); } }"
          }
        </style>
      )}
      <div
        data-slot="announcement-bar-progress-fill"
        className={cn(
          "h-full w-full origin-left rtl:origin-right",
          {
            "transition-transform duration-300 ease-linear motion-reduce:transition-none":
              !duration,
          },
          colors[variant],
        )}
        style={
          duration && !reducedMotion
            ? {
                transform: "scaleX(1)",
                animation: `kira-announcement-progress ${duration}ms linear forwards`,
                animationDelay: `${-duration * (1 - initialPercent / 100)}ms`,
                animationPlayState: paused ? "paused" : "running",
              }
            : { transform: `scaleX(${percent / 100})` }
        }
      />
    </div>
  );
}

interface AnnouncementStackProps extends React.ComponentProps<"div"> {
  position?: "inline" | "top" | "bottom";
  maxVisible?: number;
}

function AnnouncementStack({
  children,
  className,
  position = "inline",
  maxVisible = 3,
  ...props
}: AnnouncementStackProps) {
  const [expanded, setExpanded] = React.useState(false);
  const id = React.useId();
  const items = React.Children.toArray(children);

  const limit = Number.isFinite(maxVisible)
    ? Math.max(1, Math.floor(maxVisible))
    : 3;

  const hiddenCount = Math.max(0, items.length - limit);

  return (
    <div
      data-slot="announcement-stack"
      className={cn(
        "flex min-w-0 flex-col gap-2 [&_[data-slot=announcement-bar]]:relative [&_[data-slot=announcement-bar]]:inset-auto",
        { "sticky top-0 z-50": position === "top" },
        { "fixed inset-x-0 bottom-0 z-50": position === "bottom" },
        className,
      )}
      {...props}
    >
      <div data-slot="announcement-stack-items" id={id} className="space-y-2">
        {items.map((child, index) => (
          <div
            data-slot="announcement-stack-item"
            key={React.isValidElement(child) ? (child.key ?? index) : index}
            hidden={!expanded && index >= limit}
          >
            {child}
          </div>
        ))}
      </div>
      {hiddenCount > 0 && (
        <Button
          data-slot="announcement-stack-toggle"
          variant="ghost"
          size="sm"
          aria-controls={id}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="min-h-11"
        >
          {expanded
            ? "Show fewer announcements"
            : `Show ${hiddenCount} more announcement${hiddenCount === 1 ? "" : "s"}`}
        </Button>
      )}
    </div>
  );
}

interface AnnouncementBarCountdownProps extends React.ComponentProps<"span"> {
  to: Date;
  prefix?: string;
  expiredLabel?: string;
  paused?: boolean;
}

function AnnouncementBarCountdown({
  to,
  prefix = "Ends in",
  expiredLabel = "Ended",
  paused = false,
  className,
  ...props
}: AnnouncementBarCountdownProps) {
  const context = React.useContext(AnnouncementBarContext);
  const label = useCountdown(to, paused || Boolean(context?.isPaused));
  const valid = Number.isFinite(to.getTime());

  return (
    <span
      data-slot="announcement-bar-countdown"
      aria-live="off"
      className={cn(
        "inline-flex items-center gap-2 font-medium tabular-nums whitespace-nowrap",
        className,
      )}
      {...props}
    >
      {announcementCountdownContent(valid, label, prefix, expiredLabel)}
    </span>
  );
}

function announcementActionTabIndex(
  inactive: boolean | undefined,
  focusable: boolean | undefined,
  tabIndex: number | undefined,
) {
  if (!inactive) return tabIndex;

  return focusable ? 0 : -1;
}

function announcementCountdownContent(
  valid: boolean,
  label: string | null,
  prefix: string,
  expiredLabel: string,
) {
  if (!valid) return "Deadline unavailable";

  if (!label) return expiredLabel;

  return <AnnouncementBarCountdownPrefixView prefix={prefix} label={label} />;
}

interface AnnouncementRotatorProps extends React.ComponentProps<"div"> {
  messages: React.ReactNode[];
  rotateInterval?: number;
  paused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  onIndexChange?: (index: number) => void;
}

function useAnnouncementRotatorModel({
  messages,
  rotateInterval = 6000,
  paused,
  onPausedChange,
  onIndexChange,
  className,
  ref,
  ...props
}: AnnouncementRotatorProps) {
  const context = React.useContext(AnnouncementBarContext);
  const reducedMotion = useReducedMotion();
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);
  const [index, setIndex] = React.useState(0);
  const [userPaused, setUserPaused] = React.useState(false);
  const [focusStopped, setFocusStopped] = React.useState(false);
  const [motionResumed, setMotionResumed] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const active = useAnnouncementActivity(element);
  const current = messages.length ? Math.min(index, messages.length - 1) : 0;

  const { playbackPaused, isPaused } = announcementRotationPause({
    paused,
    userPaused,
    focusStopped,
    context,
    reducedMotion,
    motionResumed,
    hovered,
    active,
  });

  const delay = Number.isFinite(rotateInterval)
    ? Math.max(1000, rotateInterval)
    : 6000;

  const changeIndex = React.useEffectEvent((next: number) =>
    onIndexChange?.(next),
  );

  React.useEffect(
    () =>
      announcementBarUseEffect(
        messages.length,
        isPaused,
        current,
        setIndex,
        changeIndex,
        delay,
      ),
    [messages.length, delay, isPaused, current],
  );

  const move = (direction: number) => {
    const next = (current + direction + messages.length) % messages.length;
    setIndex(next);
    setUserPaused(true);
    onPausedChange?.(true);
    onIndexChange?.(next);
  };

  return {
    messages,
    className,
    ref,
    props,
    context,
    reducedMotion,
    setElement,
    current,
    playbackPaused,
    isPaused,
    setHovered,
    setFocusStopped,
    setUserPaused,
    setMotionResumed,
    onPausedChange,
    move,
  };
}

function AnnouncementRotator(input: AnnouncementRotatorProps) {
  const model = useAnnouncementRotatorModel(input);

  const {
    messages,
    className,
    ref,
    props,
    reducedMotion,
    setElement,
    current,
    isPaused,
    setHovered,
    setFocusStopped,
  } = model;

  // SAFETY: Native element props are valid; data attributes and numeric CSS custom properties extend React's closed types.
  return useRender({
    defaultTagName: "div",
    ref: [ref ?? null, setElement],
    props: mergeProps<"div">(
      {
        "data-slot": "announcement-rotator",
        role: "group",
        "aria-roledescription": "carousel",
        "aria-label": "Announcements",
        className: cn(
          "flex min-w-0 flex-1 basis-48 flex-wrap items-center gap-3 sm:basis-0",
          className,
        ),
        onPointerEnter: () => setHovered(true),
        onPointerLeave: () => setHovered(false),
        onFocusCapture: (event) =>
          announcementFocusStops(
            event,
            '[data-slot="announcement-rotator-pause"]',
            setFocusStopped,
          ),
        children: (
          <>
            <AnnouncementRotatorMessagesView
              isPaused={isPaused}
              messages={messages}
              current={current}
              reducedMotion={reducedMotion}
            />
            <AnnouncementRotatorControls model={model} />
          </>
        ),
      } as React.ComponentProps<"div">,
      props,
    ),
  });
}

const AnnouncementDismiss = AnnouncementBarDismiss;

type AnnouncementConsentDecision = "accepted" | "rejected";

interface AnnouncementActionContext {
  signal: AbortSignal;
}

const volatileConsent = new Map<string, AnnouncementConsentDecision | null>();

function useAnnouncementConsent(key: string, mode: PersistMode = "persistent") {
  const storageKey = `announcement-consent-${key}`;
  const identity = `${mode}:${storageKey}`;

  const subscribe = React.useCallback(
    (notify: () => void) => announcementBarUseCallback(notify),
    [],
  );

  const snapshot = React.useCallback(
    () => announcementBarUseCallback5(key, identity, mode, storageKey),
    [key, mode, storageKey, identity],
  );

  const decision = React.useSyncExternalStore(subscribe, snapshot, () => null);

  const write = React.useCallback(
    (value: AnnouncementConsentDecision | null) =>
      announcementBarUseCallback6(value, key, mode, storageKey, identity),
    [key, mode, storageKey, identity],
  );

  const save = React.useCallback(
    (value: AnnouncementConsentDecision) => write(value),
    [write],
  );

  const reset = React.useCallback(() => write(null), [write]);

  return [decision, save, reset] as const;
}

interface KiraAnnouncementBarProps extends Omit<
  AnnouncementBarProps,
  "children"
> {
  message?: React.ReactNode;
  messages?: React.ReactNode[];
  rotateInterval?: number;
  action?: {
    id?: string;
    label: React.ReactNode;
    href?: string;
    onClick?: (context: AnnouncementActionContext) => void | Promise<void>;
    variant?: AnnouncementBarActionProps["variant"];
  };
  countdownTo?: Date;
  countdownPrefix?: string;
  consent?: boolean;
  onAccept?: (context: AnnouncementActionContext) => void | Promise<void>;
  onReject?: (context: AnnouncementActionContext) => void | Promise<void>;
  acceptLabel?: string;
  rejectLabel?: string;
  consentKey?: string;
  successMessage?: string;
  dismissOnActionSuccess?: boolean;
}

type AnnouncementActionState = {
  status: "idle" | "pending" | "error" | "success";
  kind: "primary" | "accept" | "reject" | null;
  message: string;
  showBusy: boolean;
};

const idleAction: AnnouncementActionState = {
  status: "idle",
  kind: null,
  message: "",
  showBusy: false,
};

function useKiraAnnouncementSettings({
  message,
  messages,
  rotateInterval,
  action,
  countdownTo,
  countdownPrefix,
  consent: consentInput,
  onAccept,
  onReject,
  acceptLabel: acceptLabelInput,
  rejectLabel: rejectLabelInput,
  consentKey,
  successMessage,
  dismissOnActionSuccess: dismissOnActionSuccessInput,
  icon,
  variant: variantInput,
  ...props
}: KiraAnnouncementBarProps) {
  const { consent, acceptLabel, rejectLabel, dismissOnActionSuccess, variant } =
    useKiraAnnouncementBarOptions({
      consent: consentInput,
      acceptLabel: acceptLabelInput,
      rejectLabel: rejectLabelInput,
      dismissOnActionSuccess: dismissOnActionSuccessInput,
      variant: variantInput,
    });

  return {
    message,
    messages,
    rotateInterval,
    action,
    countdownTo,
    countdownPrefix,
    consent,
    onAccept,
    onReject,
    acceptLabel,
    rejectLabel,
    consentKey,
    successMessage,
    dismissOnActionSuccess,
    icon,
    variant,
    props,
  };
}

type KiraAnnouncementSettings = ReturnType<typeof useKiraAnnouncementSettings>;

function useAnnouncementAction(settings: KiraAnnouncementSettings) {
  const { props, action, consentKey } = settings;
  const key = `${props.announcementId ?? ""}|${action?.id ?? ""}|${consentKey ?? ""}`;
  const [state, setState] = React.useState<AnnouncementActionState>(idleAction);
  const [previousKey, setPreviousKey] = React.useState(key);

  if (previousKey !== key) {
    setPreviousKey(key);
    setState(idleAction);
  }

  const [decision, saveDecision] = useAnnouncementConsent(
    consentKey ?? "",
    props.persistMode,
  );

  const [previousDecision, setPreviousDecision] = React.useState(decision);

  if (previousDecision !== decision) {
    setPreviousDecision(decision);

    if (!decision) setState(idleAction);
  }

  const request = React.useRef(0);
  const pending = React.useRef(false);
  const controller = React.useRef<AbortController | null>(null);

  const busyTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const actionsRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(
    () => announcementBarUseEffect2(request, pending, controller, busyTimer),
    [key],
  );
  const expired = useAnnouncementExpiry(props.expiresAt);
  React.useEffect(() => {
    if (expired) controller.current?.abort();
  }, [expired]);

  const requestState = { request, pending, controller, busyTimer, actionsRef };

  const run = (kind: "primary" | "accept" | "reject") =>
    performAnnouncementAction(
      kind,
      settings,
      state,
      requestState,
      setState,
      saveDecision,
    );

  const cancel = (restoreFocus = true) =>
    cancelAnnouncementAction(state, requestState, setState, restoreFocus);

  return { state, decision, actionsRef, run, cancel };
}

function KiraAnnouncementBar(input: KiraAnnouncementBarProps) {
  const settings = useKiraAnnouncementSettings(input);
  const model = { ...settings, ...useAnnouncementAction(settings) };

  const {
    consent,
    decision,
    dismissOnActionSuccess,
    state,
    variant,
    icon,
    props,
    cancel,
  } = model;

  if (
    (consent && decision) ||
    (dismissOnActionSuccess && state.status === "success")
  )
    return null;

  return (
    <AnnouncementBar
      variant={variant}
      icon={icon}
      {...props}
      paused={state.status === "pending" || props.paused}
      onDismiss={() => {
        if (state.status === "pending") cancel(false);
        props.onDismiss?.();
      }}
      aria-busy={state.status === "pending" || undefined}
    >
      <KiraAnnouncementContent model={model} />
      <KiraAnnouncementActions model={model} />
    </AnnouncementBar>
  );
}

export {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarAction,
  AnnouncementBarDismiss,
  AnnouncementBarPause,
  AnnouncementBarProgress,
  AnnouncementBarCountdown,
  AnnouncementRotator,
  AnnouncementStack,
  KiraAnnouncementBar,
  AnnouncementDismiss,
  useAnnouncementDismiss,
  useAnnouncementExpiry,
  useAnnouncementConsent,
  useCountdown,
  useAnnouncementBar,
  announcementBarVariants,
};

export type {
  AnnouncementBarProps,
  AnnouncementBarContentProps,
  AnnouncementBarActionProps,
  AnnouncementBarDismissProps,
  AnnouncementBarIconProps,
  AnnouncementBarProgressProps,
  AnnouncementBarCountdownProps,
  AnnouncementRotatorProps,
  AnnouncementStackProps,
  KiraAnnouncementBarProps,
  AnnouncementVariant,
  AnnouncementPosition,
  AnnouncementPriority,
  AnnouncementUrgency,
  AnimationType,
  PersistMode,
  AnnouncementConsentDecision,
  AnnouncementActionContext,
};

function announcementBarValueValue(reducedMotion: boolean, stopped: boolean) {
  if (reducedMotion) {
    return "Motion disabled";
  }

  if (stopped) {
    return "Resume text";
  }

  return "Pause text";
}

function announcementBarCallbackValue(
  kind: "primary" | "accept" | "reject",
  action:
    | {
        id?: string;
        label: React.ReactNode;
        href?: string;
        onClick?: (context: AnnouncementActionContext) => void | Promise<void>;
        variant?: AnnouncementBarActionProps["variant"];
      }
    | undefined,
  onAccept:
    ((context: AnnouncementActionContext) => void | Promise<void>) | undefined,
  onReject:
    ((context: AnnouncementActionContext) => void | Promise<void>) | undefined,
) {
  if (kind === "primary") {
    return action?.onClick;
  }

  if (kind === "accept") {
    return onAccept;
  }

  return onReject;
}

function resolveAnnouncementBarOptions({
  variant = "default",
  position = "inline",
  priority = "normal",
  urgency = "polite",
  showProgress = false,
  marquee = false,
}: {
  variant?: AnnouncementBarProps["variant"];
  position?: AnnouncementBarProps["position"];
  priority?: AnnouncementBarProps["priority"];
  urgency?: AnnouncementBarProps["urgency"];
  showProgress?: AnnouncementBarProps["showProgress"];
  marquee?: AnnouncementBarProps["marquee"];
}) {
  return { variant, position, priority, urgency, showProgress, marquee };
}

function resolveAnnouncementBarOptions2({
  dismissible = false,
  persistMode = "persistent",
  animation = "slide",
  disabled = false,
}: {
  dismissible?: AnnouncementBarProps["dismissible"];
  persistMode?: AnnouncementBarProps["persistMode"];
  animation?: AnnouncementBarProps["animation"];
  disabled?: AnnouncementBarProps["disabled"];
}) {
  return { dismissible, persistMode, animation, disabled };
}

function resolveKiraAnnouncementBarOptions({
  consent = false,
  acceptLabel = "Accept",
  rejectLabel = "Reject",
  dismissOnActionSuccess = false,
  variant = "default",
}: {
  consent?: KiraAnnouncementBarProps["consent"];
  acceptLabel?: KiraAnnouncementBarProps["acceptLabel"];
  rejectLabel?: KiraAnnouncementBarProps["rejectLabel"];
  dismissOnActionSuccess?: KiraAnnouncementBarProps["dismissOnActionSuccess"];
  variant?: KiraAnnouncementBarProps["variant"];
}) {
  return { consent, acceptLabel, rejectLabel, dismissOnActionSuccess, variant };
}

function AnnouncementBarMessageView({
  moving,
  setPaused,
  children,
  marquee,
  stopped,
  context,
  reducedMotion,
}: {
  moving: boolean;
  setPaused: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  marquee: boolean;
  stopped: boolean;
  context: AnnouncementBarContextValue | undefined;
  reducedMotion: boolean;
}) {
  return (
    <>
      <div
        data-slot="announcement-bar-message"
        className="min-w-0 flex-1 overflow-hidden"
      >
        <div
          data-slot="announcement-bar-marquee"
          className={cn({ "animate-marquee whitespace-nowrap": moving })}
          style={moving ? { animationIterationCount: 3 } : undefined}
          onAnimationEnd={() => setPaused(true)}
        >
          {children}
        </div>
      </div>
      {marquee && (
        <Button
          data-slot="announcement-bar-marquee-pause"
          size="sm"
          variant="ghost"
          aria-pressed={stopped}
          onClick={() => {
            const next = !stopped;
            setPaused(next);

            if (!next) context?.setIsPaused(false);
          }}
          disabled={reducedMotion || context?.disabled}
          className="min-h-11 sm:min-h-8"
        >
          {announcementBarValueValue(reducedMotion, stopped)}
        </Button>
      )}
    </>
  );
}

function AnnouncementBarCountdownPrefixView({
  prefix,
  label,
}: {
  prefix: string;
  label: string;
}) {
  return (
    <>
      <span data-slot="announcement-bar-countdown-prefix">{prefix}</span>
      <span
        data-slot="announcement-bar-countdown-value"
        className="inline-flex items-baseline gap-1.5"
      >
        <span className="sr-only">{label}</span>
        {label.split(" ").map((part) => (
          <span
            key={part.slice(-1)}
            data-slot="announcement-bar-countdown-unit"
            aria-hidden="true"
            className="inline-flex items-baseline gap-0.5"
          >
            <span
              data-slot="announcement-bar-countdown-number"
              className="min-w-[2ch] text-end"
            >
              {part.slice(0, -1).padStart(2, "0")}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {part.slice(-1)}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}

function AnnouncementRotatorMessagesView({
  isPaused,
  messages,
  current,
  reducedMotion,
}: {
  isPaused: boolean;
  messages: React.ReactNode[];
  current: number;
  reducedMotion: boolean;
}) {
  return (
    <div
      data-slot="announcement-rotator-messages"
      className="grid min-w-0 flex-1 basis-48 wrap-anywhere sm:basis-0"
      aria-live={isPaused ? "polite" : "off"}
      aria-atomic="true"
    >
      {messages.length ? (
        withContentKeys(messages, reactContentKey).map(
          ({ item: message, key }, messageIndex) => (
            <div
              data-slot="announcement-rotator-message"
              key={key}
              // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
              role="group"
              aria-roledescription="slide"
              aria-label={`${messageIndex + 1} of ${messages.length}`}
              aria-hidden={messageIndex !== current || undefined}
              inert={messageIndex !== current || undefined}
              className={cn(
                "col-start-1 row-start-1",
                {
                  "animate-in fade-in-0 slide-in-from-bottom-1 duration-200":
                    messageIndex === current && !reducedMotion,
                },
                { "invisible pointer-events-none": messageIndex !== current },
              )}
            >
              {message}
            </div>
          ),
        )
      ) : (
        <span data-slot="announcement-rotator-empty">No announcements</span>
      )}
    </div>
  );
}

function AnnouncementRotatorPauseView({
  playbackPaused,
  setUserPaused,
  setMotionResumed,
  setFocusStopped,
  context,
  onPausedChange,
}: {
  playbackPaused: boolean;
  setUserPaused: React.Dispatch<React.SetStateAction<boolean>>;
  setMotionResumed: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusStopped: React.Dispatch<React.SetStateAction<boolean>>;
  context: AnnouncementBarContextValue | undefined;
  onPausedChange: ((paused: boolean) => void) | undefined;
}) {
  return (
    <Button
      data-slot="announcement-rotator-pause"
      size="icon"
      variant="ghost"
      aria-label={
        playbackPaused ? "Resume announcements" : "Pause announcements"
      }
      aria-pressed={playbackPaused}
      className="size-11"
      onClick={() =>
        announcementBarCallback2(
          playbackPaused,
          setUserPaused,
          setMotionResumed,
          setFocusStopped,
          context,
          onPausedChange,
        )
      }
    >
      <span
        key={String(playbackPaused)}
        data-slot="announcement-rotator-playback-icon"
        className="inline-flex motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-75 duration-150"
      >
        {playbackPaused ? (
          <IconPlayerPlay className="size-4" aria-hidden="true" />
        ) : (
          <IconPlayerPause className="size-4" aria-hidden="true" />
        )}
      </span>
    </Button>
  );
}

function AnnouncementBarContentView({
  actionsDisabled,
  run,
  actionLabel,
  rejectLabel,
  acceptLabel,
}: {
  actionsDisabled: boolean;
  run: (kind: "primary" | "accept" | "reject") => Promise<void>;
  actionLabel: (
    kind: "primary" | "accept" | "reject",
    label: React.ReactNode,
  ) => React.JSX.Element;
  rejectLabel: string;
  acceptLabel: string;
}) {
  return (
    <>
      <AnnouncementBarAction
        data-action-kind="reject"
        variant="outline"
        disabled={actionsDisabled}
        focusableWhenDisabled
        onClick={() => {
          void run("reject");
        }}
      >
        {actionLabel("reject", rejectLabel)}
      </AnnouncementBarAction>
      <AnnouncementBarAction
        data-action-kind="accept"
        variant="button"
        disabled={actionsDisabled}
        focusableWhenDisabled
        onClick={() => {
          void run("accept");
        }}
      >
        {actionLabel("accept", acceptLabel)}
      </AnnouncementBarAction>
    </>
  );
}

function useAnnouncementBarSettings({
  className,
  variant: variantInput,
  position: positionInput,
  priority: priorityInput,
  urgency: urgencyInput,
  autoDismiss,
  showProgress: showProgressInput,
  marquee: marqueeInput,
  icon,
  dismissible: dismissibleInput,
  persistMode: persistModeInput,
  expiresAt,
  startsAt,
  announcementId,
  onDismiss,
  animation: animationInput,
  paused,
  onPausedChange,
  disabled: disabledInput,
  children,
  ref,
  render,
  ...props
}: AnnouncementBarProps) {
  const { variant, position, priority, urgency, showProgress, marquee } =
    useAnnouncementBarOptions({
      variant: variantInput,
      position: positionInput,
      priority: priorityInput,
      urgency: urgencyInput,
      showProgress: showProgressInput,
      marquee: marqueeInput,
    });

  const { dismissible, persistMode, animation, disabled } =
    useAnnouncementBarOptions2({
      dismissible: dismissibleInput,
      persistMode: persistModeInput,
      animation: animationInput,
      disabled: disabledInput,
    });

  return {
    className,
    variant,
    position,
    priority,
    urgency,
    autoDismiss,
    showProgress,
    marquee,
    icon,
    dismissible,
    persistMode,
    expiresAt,
    startsAt,
    announcementId,
    onDismiss,
    animation,
    paused,
    onPausedChange,
    disabled,
    children,
    ref,
    render,
    props,
  };
}

function useAnnouncementBarModel(input: AnnouncementBarProps) {
  const settings = useAnnouncementBarSettings(input);
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);
  const lifecycle = useAnnouncementLifecycle(settings, element);

  const rendered = useAnnouncementSurface({
    ...settings,
    ...lifecycle,
    setElement,
  });

  const { variant, priority, urgency, disabled } = settings;
  const { isPaused, playbackPaused, setIsPaused, dismiss, extend } = lifecycle;

  return {
    variant,
    priority,
    urgency,
    isPaused,
    playbackPaused,
    setIsPaused,
    dismiss,
    extend,
    disabled,
    rendered,
  };
}

type AnnouncementSettings = ReturnType<typeof useAnnouncementBarSettings>;

function useAnnouncementDismissal({
  announcementId,
  persistMode,
  disabled,
  onDismiss,
}: AnnouncementSettings) {
  const [visible, setVisible] = React.useState(true);
  const [previousId, setPreviousId] = React.useState(announcementId);
  const dismissedRef = React.useRef(false);

  const [storedDismissed, storeDismiss] = useAnnouncementDismiss(
    announcementId ?? "",
    persistMode,
  );

  if (previousId !== announcementId) {
    setPreviousId(announcementId);
    setVisible(true);
  }

  React.useEffect(() => {
    if (!storedDismissed) dismissedRef.current = false;
  }, [announcementId, storedDismissed]);

  const dismiss = React.useCallback(() => {
    if (disabled || dismissedRef.current) return;
    dismissedRef.current = true;

    if (!announcementId) setVisible(false);
    storeDismiss();
    onDismiss?.();
  }, [disabled, announcementId, storeDismiss, onDismiss]);

  return { visible, storedDismissed, dismiss };
}

function useAnnouncementPlayback(
  {
    announcementId,
    paused,
    disabled,
    onPausedChange,
    position,
  }: AnnouncementSettings,
  element: HTMLDivElement | null,
) {
  const [userPaused, setUserPaused] = React.useState(false);
  const [motionResumed, setMotionResumed] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [obscured, setObscured] = React.useState(false);
  const [previousId, setPreviousId] = React.useState(announcementId);
  const reducedMotion = useReducedMotion();
  const active = useAnnouncementActivity(element);

  if (previousId !== announcementId) {
    setPreviousId(announcementId);
    setUserPaused(false);
    setFocused(false);
  }

  const playbackPaused = Boolean(
    (paused ?? userPaused) || focused || (reducedMotion && !motionResumed),
  );

  const isPaused = Boolean(
    playbackPaused || hovered || !active || obscured || disabled,
  );

  const setIsPaused = React.useCallback(
    (value: boolean) =>
      announcementBarUseCallback7(
        value,
        setUserPaused,
        setFocused,
        setMotionResumed,
        onPausedChange,
      ),
    [onPausedChange],
  );

  React.useEffect(
    () => announcementBarUseEffect3(element, position, setObscured),
    [element, position],
  );

  return {
    isPaused,
    playbackPaused,
    setIsPaused,
    reducedMotion,
    obscured,
    setHovered,
    setFocused,
  };
}

function useAnnouncementSchedule(
  startsAt: AnnouncementBarProps["startsAt"],
  expiresAt: AnnouncementBarProps["expiresAt"],
) {
  const expired = useAnnouncementExpiry(expiresAt);
  const start = startsAt?.getTime();

  const clock = React.useSyncExternalStore(
    start !== undefined && Number.isFinite(start)
      ? subscribeClock
      : subscribeNoClock,
    getClock,
    getServerClock,
  );

  const upcoming =
    start !== undefined && Number.isFinite(start) && clock < start;

  return { expired, upcoming };
}

function useAnnouncementLifecycle(
  settings: AnnouncementSettings,
  element: HTMLDivElement | null,
) {
  const dismissal = useAnnouncementDismissal(settings);
  const playback = useAnnouncementPlayback(settings, element);

  const schedule = useAnnouncementSchedule(
    settings.startsAt,
    settings.expiresAt,
  );

  const timer = useAnnouncementDismissTimer({
    ...settings,
    ...dismissal,
    ...playback,
    ...schedule,
  });

  return { ...dismissal, ...playback, ...schedule, ...timer };
}

type AnnouncementTimerOptions = AnnouncementSettings &
  ReturnType<typeof useAnnouncementDismissal> &
  ReturnType<typeof useAnnouncementPlayback> &
  ReturnType<typeof useAnnouncementSchedule>;

function useAnnouncementDismissTimer({
  autoDismiss,
  announcementId,
  storedDismissed,
  visible,
  expired,
  upcoming,
  isPaused,
  dismiss,
}: AnnouncementTimerOptions) {
  const duration =
    autoDismiss && Number.isFinite(autoDismiss)
      ? Math.max(1000, autoDismiss)
      : 0;

  const [remaining, setRemaining] = React.useState(duration);
  const [previousDuration, setPreviousDuration] = React.useState(duration);
  const [previousId, setPreviousId] = React.useState(announcementId);
  const [timerVersion, setTimerVersion] = React.useState(0);

  const [previousStoredDismissed, setPreviousStoredDismissed] =
    React.useState(storedDismissed);

  if (previousStoredDismissed !== storedDismissed) {
    setPreviousStoredDismissed(storedDismissed);

    if (!storedDismissed) {
      setRemaining(duration);
      setTimerVersion((value) => value + 1);
    }
  }

  if (previousId !== announcementId) {
    setPreviousId(announcementId);
    setRemaining(duration);
  }

  if (previousDuration !== duration) {
    setPreviousDuration(duration);
    setRemaining(duration);
  }

  const extend = React.useCallback(() => {
    setRemaining(duration);
    setTimerVersion((value) => value + 1);
  }, [duration]);

  const getRemaining = React.useEffectEvent(() => remaining);

  const getTimerIdentity = React.useEffectEvent(() => ({
    duration,
    announcementId,
    timerVersion,
  }));

  const expireTimer = React.useEffectEvent(dismiss);
  React.useEffect(
    () =>
      startAnnouncementDismissTimer({
        duration,
        visible,
        storedDismissed,
        expired,
        upcoming,
        isPaused,
        getRemaining,
        setRemaining,
        expireTimer,
        getTimerIdentity,
        announcementId,
        timerVersion,
      }),
    [
      duration,
      announcementId,
      timerVersion,
      visible,
      storedDismissed,
      expired,
      upcoming,
      isPaused,
    ],
  );

  return { duration, remaining, timerVersion, extend };
}

type AnnouncementTimerIdentity = {
  duration: number;
  announcementId: string | undefined;
  timerVersion: number;
};

type AnnouncementTimerEffect = AnnouncementTimerIdentity & {
  visible: boolean;
  storedDismissed: boolean;
  expired: boolean;
  upcoming: boolean;
  isPaused: boolean;
  getRemaining: () => number;
  setRemaining: React.Dispatch<React.SetStateAction<number>>;
  expireTimer: () => void;
  getTimerIdentity: () => AnnouncementTimerIdentity;
};

function startAnnouncementDismissTimer({
  duration,
  visible,
  storedDismissed,
  expired,
  upcoming,
  isPaused,
  getRemaining,
  setRemaining,
  expireTimer,
  getTimerIdentity,
  announcementId,
  timerVersion,
}: AnnouncementTimerEffect) {
  if (
    !duration ||
    !visible ||
    storedDismissed ||
    expired ||
    upcoming ||
    isPaused
  )
    return;
  let value = getRemaining();
  let last = performance.now();

  const interval = setInterval(() => {
    const now = performance.now();
    value = Math.max(0, value - (now - last));
    last = now;
    setRemaining(value);

    if (!value) {
      clearInterval(interval);
      expireTimer();
    }
  }, 1000);

  const timeout = setTimeout(() => {
    clearInterval(interval);
    setRemaining(0);
    expireTimer();
  }, value);

  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
    const latest = getTimerIdentity();

    if (
      latest.duration === duration &&
      latest.announcementId === announcementId &&
      latest.timerVersion === timerVersion
    )
      setRemaining(Math.max(0, value - (performance.now() - last)));
  };
}

type AnnouncementSurfaceOptions = AnnouncementSettings &
  ReturnType<typeof useAnnouncementLifecycle> & {
    setElement: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
  };

function useAnnouncementSurface(options: AnnouncementSurfaceOptions) {
  const {
    render,
    ref,
    setElement,
    visible,
    storedDismissed,
    expired,
    upcoming,
    variant,
    priority,
    isPaused,
    disabled,
    setHovered,
    setFocused,
    props,
  } = options;

  // SAFETY: Native element props are valid; data attributes and numeric CSS custom properties extend React's closed types.
  const rendered = useRender({
    defaultTagName: "div",
    render,
    ref: [ref ?? null, setElement],
    enabled: visible && !storedDismissed && !expired && !upcoming,
    props: mergeProps<"div">(
      {
        "data-slot": "announcement-bar",
        "data-variant": variant,
        "data-priority": priority,
        "data-paused": isPaused || undefined,
        "data-disabled": disabled || undefined,
        role: "region",
        "aria-label": "Announcement",
        className: announcementSurfaceClasses(options),
        onPointerEnter: () => setHovered(true),
        onPointerLeave: () => setHovered(false),
        onFocusCapture: (event) => {
          if (
            !(event.target as HTMLElement).closest(
              '[data-slot="announcement-bar-pause"], [data-slot="announcement-rotator-pause"]',
            )
          )
            setFocused(true);
        },
        children: <AnnouncementSurfaceBody options={options} />,
      } as React.ComponentProps<"div">,
      props,
    ),
  });

  return rendered;
}

function AnnouncementBarView({
  variant,
  priority,
  urgency,
  isPaused,
  playbackPaused,
  setIsPaused,
  dismiss,
  extend,
  disabled,
  rendered,
}: ReturnType<typeof useAnnouncementBarModel>) {
  return (
    <AnnouncementBarContext.Provider
      value={{
        variant: variant ?? "default",
        priority: priority ?? "normal",
        urgency: priority === "critical" ? "assertive" : urgency,
        isPaused,
        playbackPaused,
        setIsPaused,
        dismiss,
        extend,
        disabled,
      }}
    >
      {rendered}
    </AnnouncementBarContext.Provider>
  );
}

function useKiraAnnouncementBarOptions({
  consent: consentInput,
  acceptLabel: acceptLabelInput,
  rejectLabel: rejectLabelInput,
  dismissOnActionSuccess: dismissOnActionSuccessInput,
  variant: variantInput,
}: Parameters<typeof resolveKiraAnnouncementBarOptions>[0]) {
  return React.useMemo(
    () =>
      resolveKiraAnnouncementBarOptions({
        consent: consentInput,
        acceptLabel: acceptLabelInput,
        rejectLabel: rejectLabelInput,
        dismissOnActionSuccess: dismissOnActionSuccessInput,
        variant: variantInput,
      }),
    [
      consentInput,
      acceptLabelInput,
      rejectLabelInput,
      dismissOnActionSuccessInput,
      variantInput,
    ],
  );
}

function useAnnouncementBarOptions({
  variant: variantInput,
  position: positionInput,
  priority: priorityInput,
  urgency: urgencyInput,
  showProgress: showProgressInput,
  marquee: marqueeInput,
}: Parameters<typeof resolveAnnouncementBarOptions>[0]) {
  return React.useMemo(
    () =>
      resolveAnnouncementBarOptions({
        variant: variantInput,
        position: positionInput,
        priority: priorityInput,
        urgency: urgencyInput,
        showProgress: showProgressInput,
        marquee: marqueeInput,
      }),
    [
      variantInput,
      positionInput,
      priorityInput,
      urgencyInput,
      showProgressInput,
      marqueeInput,
    ],
  );
}

function useAnnouncementBarOptions2({
  dismissible: dismissibleInput,
  persistMode: persistModeInput,
  animation: animationInput,
  disabled: disabledInput,
}: Parameters<typeof resolveAnnouncementBarOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveAnnouncementBarOptions2({
        dismissible: dismissibleInput,
        persistMode: persistModeInput,
        animation: animationInput,
        disabled: disabledInput,
      }),
    [dismissibleInput, persistModeInput, animationInput, disabledInput],
  );
}

function announcementBarUseMemo(element: HTMLElement | null) {
  let intersects = true;

  return {
    getSnapshot: () =>
      Boolean(
        element &&
        document.visibilityState !== "hidden" &&
        intersects &&
        element.getClientRects().length,
      ),
    subscribe: (notify: () => void) => {
      if (!element) return () => {};

      const observer =
        typeof IntersectionObserver === "undefined"
          ? null
          : new IntersectionObserver(([entry]) => {
              intersects = entry.isIntersecting;
              notify();
            });

      const resize =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(notify);

      observer?.observe(element);
      resize?.observe(element);
      document.addEventListener("visibilitychange", notify);
      window.addEventListener("resize", notify);

      return () => {
        observer?.disconnect();
        resize?.disconnect();
        document.removeEventListener("visibilitychange", notify);
        window.removeEventListener("resize", notify);
      };
    },
  };
}

function announcementBarUseCallback(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(dismissalEvent, notify);

  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(dismissalEvent, notify);
  };
}

function announcementBarUseCallback2(
  key: string,
  identity: string,
  mode: PersistMode,
  storageKey: string,
) {
  if (!key || typeof window === "undefined") return false;

  if (volatileDismissals.has(identity))
    return volatileDismissals.get(identity) ?? false;

  try {
    return (
      (mode === "persistent"
        ? window.localStorage
        : window.sessionStorage
      ).getItem(storageKey) === "dismissed"
    );
  } catch {
    return volatileDismissals.get(identity) ?? false;
  }
}

function announcementBarUseCallback3(
  value: boolean,
  key: string,
  mode: PersistMode,
  storageKey: string,
  identity: string,
) {
  if (!key || typeof window === "undefined") return;

  try {
    const storage =
      mode === "persistent" ? window.localStorage : window.sessionStorage;

    if (value) storage.setItem(storageKey, "dismissed");
    else storage.removeItem(storageKey);
    volatileDismissals.delete(identity);
  } catch {
    volatileDismissals.set(identity, value);
    // The in-memory value preserves dismissal when browser storage is unavailable.
  }

  window.dispatchEvent(new Event(dismissalEvent));
}

function announcementBarCallback(notify: () => void) {
  clockListeners.delete(notify);

  if (!clockListeners.size) {
    clearInterval(clockInterval);
    clockInterval = undefined;
    document.removeEventListener("visibilitychange", syncClockVisibility);
  }
}

function announcementBarUseEffect(
  messageCount: number,
  isPaused: boolean,
  current: number,
  setIndex: React.Dispatch<React.SetStateAction<number>>,
  changeIndex: (next: number) => void | undefined,
  delay: number,
) {
  if (messageCount < 2 || isPaused) return;
  let value = current;

  const interval = setInterval(() => {
    value = (value + 1) % messageCount;
    setIndex(value);
    changeIndex(value);
  }, delay);

  return () => clearInterval(interval);
}

function announcementBarUseCallback5(
  key: string,
  identity: string,
  mode: PersistMode,
  storageKey: string,
) {
  if (!key || typeof window === "undefined") return null;

  if (volatileConsent.has(identity))
    return volatileConsent.get(identity) ?? null;

  try {
    const value = (
      mode === "persistent" ? window.localStorage : window.sessionStorage
    ).getItem(storageKey);

    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return volatileConsent.get(identity) ?? null;
  }
}

function announcementBarUseCallback6(
  value: AnnouncementConsentDecision | null,
  key: string,
  mode: PersistMode,
  storageKey: string,
  identity: string,
) {
  if (!key || typeof window === "undefined") return;

  try {
    const storage =
      mode === "persistent" ? window.localStorage : window.sessionStorage;

    if (value) storage.setItem(storageKey, value);
    else storage.removeItem(storageKey);
    volatileConsent.delete(identity);
  } catch {
    volatileConsent.set(identity, value);
  }

  window.dispatchEvent(new Event(dismissalEvent));
}

function announcementBarUseEffect2(
  request: React.RefObject<number>,
  pending: React.RefObject<boolean>,
  controller: React.RefObject<AbortController | null>,
  busyTimer: React.RefObject<number | undefined>,
) {
  request.current += 1;
  pending.current = false;

  return () => {
    request.current += 1;
    pending.current = false;
    controller.current?.abort();
    clearTimeout(busyTimer.current);
  };
}

function announcementBarCallback2(
  playbackPaused: boolean,
  setUserPaused: React.Dispatch<React.SetStateAction<boolean>>,
  setMotionResumed: React.Dispatch<React.SetStateAction<boolean>>,
  setFocusStopped: React.Dispatch<React.SetStateAction<boolean>>,
  context: AnnouncementBarContextValue | undefined,
  onPausedChange: ((paused: boolean) => void) | undefined,
) {
  const value = !playbackPaused;
  setUserPaused(value);

  if (!value) setMotionResumed(true);
  setFocusStopped(false);
  context?.setIsPaused(value);
  onPausedChange?.(value);
}

function announcementBarUseCallback7(
  value: boolean,
  setUserPaused: React.Dispatch<React.SetStateAction<boolean>>,
  setFocused: React.Dispatch<React.SetStateAction<boolean>>,
  setMotionResumed: React.Dispatch<React.SetStateAction<boolean>>,
  onPausedChange: ((paused: boolean) => void) | undefined,
) {
  setUserPaused(value);

  if (!value) {
    setFocused(false);
    setMotionResumed(true);
  }

  onPausedChange?.(value);
}

function announcementBarUseEffect3(
  element: HTMLDivElement | null,
  position: "top" | "bottom" | "floating" | "inline" | null,
  setObscured: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (!element || position === "inline") return;

  const checkFocus = () => {
    const target = document.activeElement;

    if (
      !(target instanceof HTMLElement) ||
      target === document.body ||
      element.contains(target)
    ) {
      setObscured(false);

      return;
    }

    const bar = element.getBoundingClientRect();
    const control = target.getBoundingClientRect();
    setObscured(
      control.width > 0 &&
        control.height > 0 &&
        control.top < bar.bottom &&
        control.bottom > bar.top &&
        control.left < bar.right &&
        control.right > bar.left,
    );
  };

  document.addEventListener("focusin", checkFocus);
  window.addEventListener("scroll", checkFocus, true);
  window.addEventListener("resize", checkFocus);

  return () => {
    document.removeEventListener("focusin", checkFocus);
    window.removeEventListener("scroll", checkFocus, true);
    window.removeEventListener("resize", checkFocus);
  };
}

function AnnouncementSurfaceBody({
  options,
}: {
  options: AnnouncementSurfaceOptions;
}) {
  const {
    icon,
    children,
    marquee,
    duration,
    disabled,
    extend,
    dismissible,
    showProgress,
    announcementId,
    timerVersion,
    remaining,
    variant,
    isPaused,
  } = options;

  return (
    <>
      {icon !== undefined && <AnnouncementBarIcon icon={icon} />}
      {isStringProp(children) || isNumberProp(children) ? (
        <AnnouncementBarContent marquee={marquee}>
          {children}
        </AnnouncementBarContent>
      ) : (
        children
      )}
      {duration > 0 && (
        <div
          data-slot="announcement-bar-timer-controls"
          className="flex items-center gap-2"
        >
          <AnnouncementBarPause />
          <Button
            data-slot="announcement-bar-extend"
            size="sm"
            variant="ghost"
            disabled={disabled}
            onClick={extend}
            className="min-h-11 sm:min-h-8"
          >
            Extend time
          </Button>
        </div>
      )}
      {dismissible && <AnnouncementBarDismiss />}
      {showProgress && duration > 0 && (
        <AnnouncementBarProgress
          key={`${announcementId}:${duration}:${timerVersion}`}
          value={(remaining / duration) * 100}
          variant={variant ?? "default"}
          duration={duration}
          paused={isPaused}
        />
      )}
    </>
  );
}

type AnnouncementRequest = {
  request: React.RefObject<number>;
  pending: React.RefObject<boolean>;
  controller: React.RefObject<AbortController | null>;
  busyTimer: React.RefObject<ReturnType<typeof setTimeout> | undefined>;
  actionsRef: React.RefObject<HTMLDivElement | null>;
};

async function performAnnouncementAction(
  kind: "primary" | "accept" | "reject",
  settings: KiraAnnouncementSettings,
  state: AnnouncementActionState,
  requestState: AnnouncementRequest,
  setState: React.Dispatch<React.SetStateAction<AnnouncementActionState>>,
  saveDecision: ReturnType<typeof useAnnouncementConsent>[1],
) {
  const { action, onAccept, onReject, consent, successMessage, props } =
    settings;

  const { request, pending, busyTimer } = requestState;

  if (pending.current || props.disabled || state.status === "success") return;

  const callback = announcementBarCallbackValue(
    kind,
    action,
    onAccept,
    onReject,
  );

  const { attempt, abort } = beginAnnouncementAction(
    kind,
    consent,
    requestState,
    setState,
  );

  try {
    await callback?.({ signal: abort.signal });

    if (announcementRequestInactive(attempt, request, abort.signal)) return;

    completeAnnouncementAction(
      kind,
      consent,
      successMessage,
      saveDecision,
      setState,
    );
  } catch (error) {
    if (announcementRequestInactive(attempt, request, abort.signal)) return;
    setState({
      status: "error",
      kind,
      message: announcementRequestError(
        error instanceof Error ? error : undefined,
      ),
      showBusy: false,
    });
  } finally {
    if (attempt === request.current) {
      pending.current = false;
      clearTimeout(busyTimer.current);
    }
  }
}

function cancelAnnouncementAction(
  state: AnnouncementActionState,
  { request, pending, controller, busyTimer, actionsRef }: AnnouncementRequest,
  setState: React.Dispatch<React.SetStateAction<AnnouncementActionState>>,
  restoreFocus: boolean,
) {
  const kind = state.kind;
  request.current += 1;
  pending.current = false;
  controller.current?.abort();
  clearTimeout(busyTimer.current);
  setState({
    ...idleAction,
    message: "Request cancelled. You can try again.",
  });

  if (restoreFocus && kind)
    requestAnimationFrame(() =>
      actionsRef.current
        ?.querySelector<HTMLElement>(`[data-action-kind="${kind}"]`)
        ?.focus(),
    );
}

type KiraAnnouncementModel = KiraAnnouncementSettings &
  ReturnType<typeof useAnnouncementAction>;

function KiraAnnouncementContent({ model }: { model: KiraAnnouncementModel }) {
  const { state, messages, rotateInterval, message } = model;

  const feedback = state.message && (
    <p
      data-slot="announcement-bar-action-feedback"
      className={cn("mt-1 flex items-start gap-1.5 text-xs font-normal", {
        "text-destructive": state.status === "error",
      })}
    >
      {state.status === "error" && (
        <IconAlertCircle className="size-4 shrink-0" aria-hidden="true" />
      )}
      {state.status === "success" && (
        <IconCheck className="size-4 shrink-0" aria-hidden="true" />
      )}
      {state.message}
    </p>
  );

  return messages?.length ? (
    <div
      data-slot="announcement-bar-rotating-content"
      className="min-w-0 flex-1 basis-48 sm:basis-0"
    >
      <AnnouncementRotator
        messages={messages}
        rotateInterval={rotateInterval}
      />
      {feedback && (
        <div // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This live status container preserves the surrounding custom layout.
          role="status"
          aria-live="polite"
        >
          {feedback}
        </div>
      )}
    </div>
  ) : (
    <AnnouncementBarContent>
      <div data-slot="announcement-bar-content-body" className="min-w-0">
        {message}
        {feedback}
      </div>
    </AnnouncementBarContent>
  );
}

function announcementActionLabel(
  state: AnnouncementActionState,
  kind: "primary" | "accept" | "reject",
  label: React.ReactNode,
) {
  return (
    <>
      {state.status === "pending" && state.kind === kind && state.showBusy && (
        <Spinner className="size-4" />
      )}
      {state.status === "success" && state.kind === kind && (
        <IconCheck className="size-4" aria-hidden="true" />
      )}
      {state.status === "error" && state.kind === kind ? "Try again" : label}
    </>
  );
}

function KiraAnnouncementActions({ model }: { model: KiraAnnouncementModel }) {
  const {
    props,
    state,
    actionsRef,
    countdownTo,
    countdownPrefix,
    consent,
    run,
    rejectLabel,
    acceptLabel,
    action,
    cancel,
  } = model;

  const actionLabel = (
    kind: "primary" | "accept" | "reject",
    label: React.ReactNode,
  ) => announcementActionLabel(state, kind, label);

  const actionsDisabled =
    props.disabled || state.status === "pending" || state.status === "success";

  return (
    <div
      ref={actionsRef}
      data-slot="announcement-bar-actions"
      className="flex min-w-0 flex-wrap items-center gap-2"
    >
      {countdownTo && (
        <>
          <AnnouncementBarCountdown to={countdownTo} prefix={countdownPrefix} />
          <AnnouncementBarPause disabled={props.disabled} />
        </>
      )}
      {consent ? (
        <AnnouncementBarContentView
          actionsDisabled={actionsDisabled}
          run={run}
          actionLabel={actionLabel}
          rejectLabel={rejectLabel}
          acceptLabel={acceptLabel}
        />
      ) : (
        action && (
          <AnnouncementBarAction
            data-action-kind="primary"
            disabled={actionsDisabled}
            focusableWhenDisabled
            href={action.href}
            onClick={() => {
              if (action.onClick || !action.href) void run("primary");
            }}
            variant={action.variant}
          >
            {actionLabel("primary", action.label)}
          </AnnouncementBarAction>
        )
      )}
      {state.status === "pending" && (
        <Button
          data-slot="announcement-bar-action-cancel"
          variant="ghost"
          size="sm"
          onClick={() => cancel()}
          className="min-h-11 sm:min-h-8"
          disabled={props.disabled}
        >
          Cancel
        </Button>
      )}
    </div>
  );
}

function beginAnnouncementAction(
  kind: "primary" | "accept" | "reject",
  consent: boolean,
  { request, pending, controller, busyTimer }: AnnouncementRequest,
  setState: React.Dispatch<React.SetStateAction<AnnouncementActionState>>,
) {
  const attempt = ++request.current;
  const abort = new AbortController();
  controller.current = abort;
  pending.current = true;
  setState({
    status: "pending",
    kind,
    message: consent ? "Saving your preference…" : "Working on your request…",
    showBusy: false,
  });
  busyTimer.current = setTimeout(() => {
    if (attempt === request.current)
      setState((value) =>
        value.status === "pending" ? { ...value, showBusy: true } : value,
      );
  }, 150);

  return { attempt, abort };
}

function completeAnnouncementAction(
  kind: "primary" | "accept" | "reject",
  consent: boolean,
  successMessage: KiraAnnouncementBarProps["successMessage"],
  saveDecision: ReturnType<typeof useAnnouncementConsent>[1],
  setState: React.Dispatch<React.SetStateAction<AnnouncementActionState>>,
) {
  if (consent && kind !== "primary")
    saveDecision(kind === "accept" ? "accepted" : "rejected");
  setState({
    status: "success",
    kind,
    message:
      successMessage ??
      (consent ? "Your preference is saved." : "Request completed."),
    showBusy: false,
  });
}

function announcementRotationPause({
  paused,
  userPaused,
  focusStopped,
  context,
  reducedMotion,
  motionResumed,
  hovered,
  active,
}: {
  paused: boolean | undefined;
  userPaused: boolean;
  focusStopped: boolean;
  context: React.ContextType<typeof AnnouncementBarContext>;
  reducedMotion: boolean;
  motionResumed: boolean;
  hovered: boolean;
  active: boolean;
}) {
  const playbackPaused = Boolean(
    announcementUserPause(paused, userPaused) ||
    focusStopped ||
    context?.playbackPaused ||
    (reducedMotion && !motionResumed),
  );

  const isPaused = Boolean(
    playbackPaused || hovered || context?.isPaused || !active,
  );

  return { playbackPaused, isPaused };
}

function announcementFocusStops(
  event: React.FocusEvent<HTMLDivElement>,
  pauseSelector: string,
  setFocused: React.Dispatch<React.SetStateAction<boolean>>,
) {
  // SAFETY: the focus event target is an element within the div containing interactive controls.
  if (!(event.target as HTMLElement).closest(pauseSelector)) setFocused(true);
}

function announcementSurfaceClasses({
  reducedMotion,
  animation,
  variant,
  position,
  priority,
  obscured,
  className,
}: AnnouncementSurfaceOptions) {
  const entrance = !reducedMotion && animation !== "none";

  return cn(
    announcementBarVariants({ variant, position, priority }),
    { "invisible pointer-events-none": obscured },
    { "animate-in fade-in-0 duration-200": entrance },
    entrance &&
      animation === "slide" &&
      (position === "bottom"
        ? "slide-in-from-bottom-2"
        : "slide-in-from-top-2"),
    { "zoom-in-95": entrance && animation === "scale" },
    "motion-reduce:animate-none",
    className,
  );
}

function announcementRequestInactive(
  attempt: number,
  request: React.RefObject<number>,
  signal: AbortSignal,
) {
  return attempt !== request.current || signal.aborted;
}

function announcementRequestError(error: Error | undefined) {
  return error?.message
    ? `${error.message} Try again.`
    : "The request failed. Try again.";
}

function announcementUserPause(
  paused: boolean | undefined,
  userPaused: boolean,
) {
  return paused ?? userPaused;
}

function AnnouncementRotatorControls({
  model,
}: {
  model: ReturnType<typeof useAnnouncementRotatorModel>;
}) {
  const {
    messages,
    current,
    move,
    playbackPaused,
    setUserPaused,
    setMotionResumed,
    setFocusStopped,
    context,
    onPausedChange,
  } = model;

  return (
    <>
      {messages.length > 1 && (
        <div
          data-slot="announcement-rotator-controls"
          className="flex shrink-0 items-center gap-1"
        >
          <Button
            data-slot="announcement-rotator-previous"
            size="icon"
            variant="ghost"
            aria-label="Previous announcement"
            onClick={() => move(-1)}
            className="size-11"
          >
            <IconChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <span
            data-slot="announcement-rotator-counter"
            className="px-1 text-xs tabular-nums"
            aria-live="off"
          >
            {current + 1} / {messages.length}
          </span>
          <Button
            data-slot="announcement-rotator-next"
            size="icon"
            variant="ghost"
            aria-label="Next announcement"
            onClick={() => move(1)}
            className="size-11"
          >
            <IconChevronRight className="size-4" aria-hidden="true" />
          </Button>
          <AnnouncementRotatorPauseView
            playbackPaused={playbackPaused}
            setUserPaused={setUserPaused}
            setMotionResumed={setMotionResumed}
            setFocusStopped={setFocusStopped}
            context={context}
            onPausedChange={onPausedChange}
          />
        </div>
      )}
    </>
  );
}
