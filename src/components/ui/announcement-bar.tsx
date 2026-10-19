/* oxlint-disable react/only-export-components -- compound component exports are required by the public API */
"use client";

import * as React from "react";
import {
  IconX,
  IconInfoCircle,
  IconCheck,
  IconAlertTriangle,
  IconAlertCircle,
} from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const announcementBarVariants = cva(
  "relative flex w-full items-center justify-between gap-4 px-4 py-3 text-sm transition-all",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        info: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        destructive: "bg-destructive/10 text-destructive",
      },
      position: {
        top: "sticky top-0 z-50",
        bottom: "fixed bottom-0 left-0 right-0 z-50",
        floating:
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-lg shadow-lg max-w-2xl mx-auto border",
      },
      priority: {
        low: "",
        normal: "",
        high: "font-medium",
        critical: "font-semibold",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        position: "floating",
        className: "border-border",
      },
      {
        variant: "info",
        position: "floating",
        className: "border-primary/20",
      },
      {
        variant: "success",
        position: "floating",
        className: "border-success/20",
      },
      {
        variant: "warning",
        position: "floating",
        className: "border-warning/20",
      },
      {
        variant: "destructive",
        position: "floating",
        className: "border-destructive/20",
      },
    ],
    defaultVariants: {
      variant: "default",
      position: "top",
      priority: "normal",
    },
  },
);

type AnnouncementVariant =
  "default" | "info" | "success" | "warning" | "destructive";

type AnnouncementPosition = "top" | "bottom" | "floating";

type AnnouncementPriority = "low" | "normal" | "high" | "critical";

type AnnouncementUrgency = "polite" | "assertive";

type AnimationType = "slide" | "fade" | "scale" | "none";

type PersistMode = "session" | "persistent";

interface AnnouncementBarProps
  extends
    React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof announcementBarVariants> {
  priority?: AnnouncementPriority;
  urgency?: AnnouncementUrgency;
  autoDismiss?: number;
  showProgress?: boolean;
  marquee?: boolean;
  icon?: React.ReactNode;
  dismissible?: boolean;
  persistMode?: PersistMode;
  expiresAt?: Date;
  onDismiss?: () => void;
  animation?: AnimationType;
  announcementId?: string;
}

interface AnnouncementBarContentProps extends React.ComponentPropsWithoutRef<"div"> {
  marquee?: boolean;
}

interface AnnouncementBarActionProps extends React.ComponentPropsWithoutRef<"a"> {
  /** Visual treatment: an underlined link (default), or a solid/outline button. */
  variant?: "link" | "button" | "outline";
}

interface AnnouncementBarDismissProps extends React.ComponentPropsWithoutRef<"button"> {
  label?: string;
}

interface AnnouncementBarIconProps extends React.ComponentPropsWithoutRef<"span"> {
  icon?: React.ReactNode;

  variant?: AnnouncementVariant;
}

interface AnnouncementBarProgressProps extends React.ComponentPropsWithoutRef<"div"> {
  value: number;

  variant?: AnnouncementVariant;
}

interface AnnouncementBarContextValue {
  variant: AnnouncementVariant;
  priority: AnnouncementPriority;
  urgency: AnnouncementUrgency;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

const AnnouncementBarContext = React.createContext<
  AnnouncementBarContextValue | undefined
>(undefined);

function useAnnouncementBar() {
  const context = React.useContext(AnnouncementBarContext);

  if (!context) {
    throw new Error("useAnnouncementBar must be used within AnnouncementBar");
  }

  return context;
}

const AnnouncementBar = React.forwardRef<HTMLDivElement, AnnouncementBarProps>(
  (
    {
      className,
      variant = "default",
      position = "top",
      priority = "normal",
      urgency = "polite",
      autoDismiss,
      showProgress = false,
      marquee = false,
      icon,
      dismissible = false,
      persistMode = "persistent",
      expiresAt,
      announcementId,
      onDismiss,
      animation = "slide",
      children,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const [progress, setProgress] = React.useState(100);
    const [isPaused, setIsPaused] = React.useState(false);
    const reducedMotion = useReducedMotion();
    const timerRef = React.useRef<number | null>(null);
    const startTimeRef = React.useRef<number>(0);
    const remainingTimeRef = React.useRef<number>(autoDismiss || 0);
    const barRef = React.useRef<HTMLDivElement>(null);

    // Persisted dismissal (keyed by announcementId) and time-based expiry.
    const [isDismissedStored, dismissStored] = useAnnouncementDismiss(
      announcementId ?? "",
      persistMode,
    );

    const isExpired = useAnnouncementExpiry(expiresAt);

    React.useImperativeHandle(ref, () => barRef.current!);

    const handleDismiss = React.useCallback(() => {
      if (announcementId) dismissStored();

      if (!barRef.current || reducedMotion || animation === "none") {
        setIsVisible(false);
        onDismiss?.();

        return;
      }

      const exitProps: { opacity: number; y?: number; scale?: number } = {
        opacity: 0,
      };

      switch (animation) {
        case "slide":
          exitProps.y = position === "bottom" ? 16 : -16;
          break;
        case "scale":
          exitProps.scale = 0.95;
          break;
      }

      gsap.to(barRef.current, {
        ...exitProps,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setIsVisible(false);
          onDismiss?.();
        },
      });
    }, [
      reducedMotion,
      animation,
      position,
      onDismiss,
      announcementId,
      dismissStored,
    ]);

    useGSAP(
      () => {
        if (reducedMotion || animation === "none" || !barRef.current) return;

        const initialProps: { opacity: number; y?: number; scale?: number } = {
          opacity: 0,
        };

        switch (animation) {
          case "slide":
            initialProps.y = position === "bottom" ? 16 : -16;
            break;
          case "scale":
            initialProps.scale = 0.95;
            break;
        }

        gsap.fromTo(barRef.current, initialProps, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      },
      { scope: barRef, dependencies: [reducedMotion, animation, position] },
    );

    React.useEffect(() => {
      if (!autoDismiss || !isVisible) return;

      // Drive the countdown from requestAnimationFrame instead of a 50ms
      // setInterval. A fixed-interval JS timer whose value feeds into a
      // CSS `transition` (see AnnouncementBarProgress) fights the
      // transition on every tick — each update restarts a new transition
      // from a still-interpolating position, which reads as laggy/stepped
      // motion. rAF updates every frame, so the bar can be driven directly
      // without a competing CSS transition, for a smooth 60fps countdown.
      const startTimer = () => {
        startTimeRef.current = Date.now();

        const tick = () => {
          const elapsed = Date.now() - startTimeRef.current;
          const remaining = remainingTimeRef.current - elapsed;

          if (remaining <= 0) {
            handleDismiss();

            return;
          }

          setProgress((remaining / autoDismiss) * 100);
          timerRef.current = requestAnimationFrame(tick);
        };

        timerRef.current = requestAnimationFrame(tick);
      };

      if (!isPaused) {
        startTimer();
      }

      return () => {
        if (timerRef.current) {
          cancelAnimationFrame(timerRef.current);
          remainingTimeRef.current =
            remainingTimeRef.current - (Date.now() - startTimeRef.current);
        }
      };
    }, [autoDismiss, isVisible, isPaused, handleDismiss]);

    const handleMouseEnter = () => {
      if (autoDismiss) {
        setIsPaused(true);

        if (timerRef.current) {
          cancelAnimationFrame(timerRef.current);
          remainingTimeRef.current =
            remainingTimeRef.current - (Date.now() - startTimeRef.current);
        }
      }
    };

    const handleMouseLeave = () => {
      if (autoDismiss) {
        setIsPaused(false);
      }
    };

    const getAriaLive = () => {
      if (priority === "critical") return "assertive";

      return urgency;
    };

    if (!isVisible || isDismissedStored || isExpired) return null;

    // Auto-compose sub-parts when the convenience props are used. If children
    // are supplied, they take over and these are ignored.
    const composed = (
      <>
        {icon !== undefined && (
          <AnnouncementBarIcon icon={icon} variant={variant || "default"} />
        )}
        <AnnouncementBarContent marquee={marquee}>
          {children}
        </AnnouncementBarContent>
        {dismissible && <AnnouncementBarDismiss onClick={handleDismiss} />}
      </>
    );

    const useComposed = icon !== undefined || dismissible || marquee;

    return (
      <AnnouncementBarContext.Provider
        value={{
          variant: variant || "default",
          priority: priority || "normal",
          urgency: urgency || "polite",
          isPaused,
          setIsPaused,
        }}
      >
        <div
          ref={barRef}
          data-slot="announcement-bar"
          data-variant={variant}
          data-priority={priority}
          role={priority === "critical" ? "alert" : "status"}
          aria-live={getAriaLive()}
          aria-atomic="true"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            announcementBarVariants({ variant, position, priority, className }),
          )}
          {...props}
        >
          {useComposed ? composed : children}
          {showProgress && autoDismiss && (
            <AnnouncementBarProgress
              value={progress}
              variant={variant || "default"}
            />
          )}
        </div>
      </AnnouncementBarContext.Provider>
    );
  },
);

AnnouncementBar.displayName = "AnnouncementBar";

const variantIcons: Record<AnnouncementVariant, React.ReactNode> = {
  default: <IconInfoCircle className="h-5 w-5" aria-hidden="true" />,
  info: <IconInfoCircle className="h-5 w-5" aria-hidden="true" />,
  success: <IconCheck className="h-5 w-5" aria-hidden="true" />,
  warning: <IconAlertTriangle className="h-5 w-5" aria-hidden="true" />,
  destructive: <IconAlertCircle className="h-5 w-5" aria-hidden="true" />,
};

const AnnouncementBarIcon = React.forwardRef<
  HTMLSpanElement,
  AnnouncementBarIconProps
>(({ className, icon, variant, ...props }, ref) => {
  const context = React.useContext(AnnouncementBarContext);
  const currentVariant = variant || context?.variant || "default";
  const iconElement = icon || variantIcons[currentVariant];

  return (
    <span
      ref={ref}
      data-slot="announcement-bar-icon"
      className={cn("shrink-0", className)}
      {...props}
    >
      {iconElement}
    </span>
  );
});

AnnouncementBarIcon.displayName = "AnnouncementBarIcon";

const AnnouncementBarContent = React.forwardRef<
  HTMLDivElement,
  AnnouncementBarContentProps
>(({ className, marquee = false, children, ...props }, ref) => {
  const reducedMotion = useReducedMotion();
  const showMarquee = marquee && !reducedMotion;

  return (
    <div
      ref={ref}
      data-slot="announcement-bar-content"
      className={cn(
        "flex flex-1 items-center gap-3 min-w-0",
        showMarquee && "overflow-hidden",
        className,
      )}
      {...props}
    >
      {showMarquee ? (
        <div className="animate-marquee whitespace-nowrap">{children}</div>
      ) : (
        children
      )}
    </div>
  );
});

AnnouncementBarContent.displayName = "AnnouncementBarContent";

const AnnouncementBarAction = React.forwardRef<
  HTMLAnchorElement,
  AnnouncementBarActionProps
>(({ className, variant = "link", ...props }, ref) => (
  <a
    ref={ref}
    data-slot="announcement-bar-action"
    className={cn(
      "inline-flex items-center gap-1.5 font-medium rounded transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      variant === "link" && "underline underline-offset-4 hover:no-underline",
      variant === "button" &&
        "h-8 px-3 bg-foreground text-background hover:bg-foreground/90",
      variant === "outline" &&
        "h-8 px-3 border border-current/30 hover:bg-current/10",
      className,
    )}
    {...props}
  />
));

AnnouncementBarAction.displayName = "AnnouncementBarAction";

const AnnouncementBarDismiss = React.forwardRef<
  HTMLButtonElement,
  AnnouncementBarDismissProps
>(({ className, label = "Dismiss announcement", onClick, ...props }, ref) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      });
    }

    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type="button"
      data-slot="announcement-bar-dismiss"
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
        "opacity-70 transition-opacity hover:opacity-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none",

        "-m-2",
        className,
      )}
      aria-label={label}
      onClick={handleClick}
      {...props}
    >
      <IconX className="h-4 w-4" aria-hidden="true" />
    </button>
  );
});

AnnouncementBarDismiss.displayName = "AnnouncementBarDismiss";

const AnnouncementBarProgress = React.forwardRef<
  HTMLDivElement,
  AnnouncementBarProgressProps
>(({ className, value, variant = "default", ...props }, ref) => {
  const progressColors: Record<AnnouncementVariant, string> = {
    default: "bg-muted-foreground/30",
    info: "bg-primary/30",
    success: "bg-success/30",
    warning: "bg-warning/30",
    destructive: "bg-destructive/30",
  };

  const barColors: Record<AnnouncementVariant, string> = {
    default: "bg-muted-foreground",
    info: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
  };

  return (
    <div
      ref={ref}
      data-slot="announcement-bar-progress"
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Time remaining"
      className={cn(
        "absolute bottom-0 left-0 right-0 h-1",
        progressColors[variant],
        className,
      )}
      {...props}
    >
      <div
        className={cn("h-full", barColors[variant])}
        style={{ width: `${value}%` }}
      />
    </div>
  );
});

AnnouncementBarProgress.displayName = "AnnouncementBarProgress";

interface AnnouncementStackProps {
  children: React.ReactNode;
  className?: string;

  position?: "top" | "bottom";

  maxVisible?: number;
}

interface AnnouncementStackContextValue {
  announcements: string[];
  addAnnouncement: (id: string) => void;
  removeAnnouncement: (id: string) => void;
}

const AnnouncementStackContext = React.createContext<
  AnnouncementStackContextValue | undefined
>(undefined);

function AnnouncementStack({
  children,
  className,
  position = "top",
  maxVisible = 3,
}: AnnouncementStackProps) {
  const [announcements, setAnnouncements] = React.useState<string[]>([]);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const addAnnouncement = React.useCallback((id: string) => {
    setAnnouncements((prev) => [...prev, id]);
  }, []);

  const removeAnnouncement = React.useCallback((id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a !== id));
  }, []);

  const childArray = React.Children.toArray(children);
  const visibleCount = isExpanded ? childArray.length : maxVisible;
  const hasHidden = childArray.length > maxVisible;

  return (
    <AnnouncementStackContext.Provider
      value={{ announcements, addAnnouncement, removeAnnouncement }}
    >
      <div
        data-slot="announcement-stack"
        className={cn(
          "flex flex-col gap-1",
          position === "top"
            ? "sticky top-0 z-50"
            : "fixed bottom-0 left-0 right-0 z-50",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsExpanded(false);
        }}
      >
        {childArray.slice(0, visibleCount).map((child, index) => (
          <div
            key={index}
            className={cn(
              "transition-all duration-200",
              !isHovered &&
                index > 0 &&
                !isExpanded &&
                "opacity-80 scale-[0.98]",
              !isHovered &&
                index > 1 &&
                !isExpanded &&
                "opacity-60 scale-[0.96]",
            )}
          >
            {child}
          </div>
        ))}
        {hasHidden && !isExpanded && isHovered && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className={cn(
              "w-full py-2 text-xs text-muted-foreground hover:text-foreground",
              "bg-muted/50 backdrop-blur-sm rounded transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            +{childArray.length - maxVisible} more announcements
          </button>
        )}
      </div>
    </AnnouncementStackContext.Provider>
  );
}

function useAnnouncementDismiss(key: string, mode: PersistMode = "persistent") {
  const [isDismissed, setIsDismissed] = React.useState(() => {
    if (typeof window === "undefined") return false;

    try {
      const storage = mode === "persistent" ? localStorage : sessionStorage;

      return storage.getItem(`announcement-${key}`) === "dismissed";
    } catch {
      return false;
    }
  });

  const dismiss = React.useCallback(() => {
    setIsDismissed(true);

    if (typeof window !== "undefined") {
      try {
        const storage = mode === "persistent" ? localStorage : sessionStorage;
        storage.setItem(`announcement-${key}`, "dismissed");
      } catch {
        /* empty */
      }
    }
  }, [key, mode]);

  const reset = React.useCallback(() => {
    setIsDismissed(false);

    if (typeof window !== "undefined") {
      try {
        const storage = mode === "persistent" ? localStorage : sessionStorage;
        storage.removeItem(`announcement-${key}`);
      } catch {
        /* empty */
      }
    }
  }, [key, mode]);

  return [isDismissed, dismiss, reset] as const;
}

function useAnnouncementExpiry(expiresAt?: Date) {
  const [isExpired, setIsExpired] = React.useState(() => {
    if (!expiresAt) return false;

    return new Date() > expiresAt;
  });

  React.useEffect(() => {
    if (!expiresAt) return;

    const checkExpiry = () => {
      setIsExpired(new Date() > expiresAt);
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return isExpired;
}

/**
 * Live "time remaining until `target`" string, updated every second.
 * Returns `null` once the target has passed.
 */
function computeCountdown(target?: Date): string | null {
  if (!target) return null;
  const diff = target.getTime() - Date.now();

  if (diff <= 0) return null;
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);

  if (d > 0) return `${d}d ${h}h`;

  if (h > 0) return `${h}h ${m}m`;

  if (m > 0) return `${m}m ${s}s`;

  return `${s}s`;
}

function useCountdown(target?: Date): string | null {
  const targetTime = target?.getTime();

  const [label, setLabel] = React.useState<string | null>(() =>
    computeCountdown(target)
  );

  // Recompute immediately when the target changes (adjust-state-on-prop-change).
  const [prevTarget, setPrevTarget] = React.useState(targetTime);

  if (targetTime !== prevTarget) {
    setPrevTarget(targetTime);
    setLabel(
      computeCountdown(targetTime === undefined ? undefined : new Date(targetTime))
    );
  }

  React.useEffect(() => {
    if (targetTime === undefined) return;
    const t = new Date(targetTime);
    const interval = setInterval(() => setLabel(computeCountdown(t)), 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return label;
}

interface AnnouncementBarCountdownProps extends React.ComponentPropsWithoutRef<"span"> {
  to: Date;
  prefix?: string;
}

const AnnouncementBarCountdown = React.forwardRef<
  HTMLSpanElement,
  AnnouncementBarCountdownProps
>(({ to, prefix = "Ends in", className, ...props }, ref) => {
  const label = useCountdown(to);

  if (!label) return null;

  return (
    <span
      ref={ref}
      data-slot="announcement-bar-countdown"
      className={cn("tabular-nums font-medium", className)}
      {...props}
    >
      {prefix} {label}
    </span>
  );
});

AnnouncementBarCountdown.displayName = "AnnouncementBarCountdown";

// =============================================================================
// AnnouncementRotator — cycles through messages with a fade
// =============================================================================

interface AnnouncementRotatorProps extends React.ComponentPropsWithoutRef<"div"> {
  messages: React.ReactNode[];
  /** Interval between messages in ms. */
  rotateInterval?: number;
}

const AnnouncementRotator = React.forwardRef<
  HTMLDivElement,
  AnnouncementRotatorProps
>(({ messages, rotateInterval = 4000, className, ...props }, ref) => {
  const [index, setIndex] = React.useState(0);
  const reducedMotion = useReducedMotion();
  const innerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [messages.length, rotateInterval]);

  useGSAP(
    () => {
      if (reducedMotion || !innerRef.current) return;
      gsap.fromTo(
        innerRef.current,
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      );
    },
    { dependencies: [index, reducedMotion] },
  );

  return (
    <div
      ref={ref}
      data-slot="announcement-rotator"
      aria-live="polite"
      className={cn("min-w-0 flex-1", className)}
      {...props}
    >
      <div ref={innerRef}>{messages[index]}</div>
    </div>
  );
});

AnnouncementRotator.displayName = "AnnouncementRotator";

const AnnouncementDismiss = AnnouncementBarDismiss;

// =============================================================================
// KiraAnnouncementBar — one prop-driven announcement bar
// =============================================================================

interface KiraAnnouncementBarProps extends Omit<
  AnnouncementBarProps,
  "children"
> {
  /** Single message. Ignored if `messages` is provided. */
  message?: React.ReactNode;
  /** Rotating messages carousel. */
  messages?: React.ReactNode[];
  rotateInterval?: number;
  /** Inline call-to-action. */
  action?: {
    label: React.ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: AnnouncementBarActionProps["variant"];
  };
  /** Live countdown target rendered before the action. */
  countdownTo?: Date;
  countdownPrefix?: string;
  /** Cookie/consent mode: renders Accept / Reject buttons. */
  consent?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  acceptLabel?: string;
  rejectLabel?: string;
}

function KiraAnnouncementBar({
  message,
  messages,
  rotateInterval,
  action,
  countdownTo,
  countdownPrefix,
  consent = false,
  onAccept,
  onReject,
  acceptLabel = "Accept",
  rejectLabel = "Reject",
  icon,
  dismissible,
  variant = "default",
  onDismiss,
  ...barProps
}: KiraAnnouncementBarProps) {
  const buildBody = () => {
    if (messages && messages.length > 0) {
      return (
        <AnnouncementRotator
          messages={messages}
          rotateInterval={rotateInterval}
        />
      );
    }

    return <AnnouncementBarContent>{message}</AnnouncementBarContent>;
  };

  const buildTrailing = () => {
    if (consent) {
      return (
        <div className="flex shrink-0 items-center gap-2">
          <AnnouncementBarAction variant="outline" onClick={onReject}>
            {rejectLabel}
          </AnnouncementBarAction>
          <AnnouncementBarAction variant="button" onClick={onAccept}>
            {acceptLabel}
          </AnnouncementBarAction>
        </div>
      );
    }

    return (
      <div className="flex shrink-0 items-center gap-3">
        {countdownTo && (
          <AnnouncementBarCountdown to={countdownTo} prefix={countdownPrefix} />
        )}
        {action && (
          <AnnouncementBarAction
            href={action.href}
            onClick={action.onClick}
            variant={action.variant ?? "link"}
          >
            {action.label}
          </AnnouncementBarAction>
        )}
        {dismissible && <AnnouncementDismiss onClick={onDismiss} />}
      </div>
    );
  };

  return (
    <AnnouncementBar variant={variant} onDismiss={onDismiss} {...barProps}>
      {icon !== undefined && (
        <AnnouncementBarIcon icon={icon} variant={variant || "default"} />
      )}
      {buildBody()}
      {buildTrailing()}
    </AnnouncementBar>
  );
}

export {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarAction,
  AnnouncementBarDismiss,
  AnnouncementBarProgress,
  AnnouncementBarCountdown,
  AnnouncementRotator,
  AnnouncementStack,
  KiraAnnouncementBar,
  useAnnouncementDismiss,
  useAnnouncementExpiry,
  useCountdown,
  useAnnouncementBar,
  announcementBarVariants,
  AnnouncementDismiss,
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
};
