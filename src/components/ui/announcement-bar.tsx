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
  }
);

type AnnouncementVariant =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "destructive";
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

type AnnouncementBarActionProps = React.ComponentPropsWithoutRef<"a">;

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

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
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
      onDismiss,
      animation = "slide",
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const [progress, setProgress] = React.useState(100);
    const [isPaused, setIsPaused] = React.useState(false);
    const reducedMotion = useReducedMotion();
    const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = React.useRef<number>(0);
    const remainingTimeRef = React.useRef<number>(autoDismiss || 0);
    const barRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => barRef.current!);

    const handleDismiss = React.useCallback(() => {
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
    }, [reducedMotion, animation, position, onDismiss]);

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
      { scope: barRef, dependencies: [reducedMotion, animation, position] }
    );

    React.useEffect(() => {
      if (!autoDismiss || !isVisible) return;

      const startTimer = () => {
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
          const elapsed = Date.now() - startTimeRef.current;
          const remaining = remainingTimeRef.current - elapsed;

          if (remaining <= 0) {
            handleDismiss();
          } else {
            setProgress((remaining / autoDismiss) * 100);
          }
        }, 50);
      };

      if (!isPaused) {
        startTimer();
      }

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          remainingTimeRef.current =
            remainingTimeRef.current - (Date.now() - startTimeRef.current);
        }
      };
    }, [autoDismiss, isVisible, isPaused, handleDismiss]);

    const handleMouseEnter = () => {
      if (autoDismiss) {
        setIsPaused(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
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

    if (!isVisible) return null;

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
            announcementBarVariants({ variant, position, priority, className })
          )}
          {...props}
        >
          {children}
          {showProgress && autoDismiss && (
            <AnnouncementBarProgress
              value={progress}
              variant={variant || "default"}
            />
          )}
        </div>
      </AnnouncementBarContext.Provider>
    );
  }
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
        className
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
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    data-slot="announcement-bar-action"
    className={cn(
      "inline-flex items-center gap-1.5 font-medium underline underline-offset-4 hover:no-underline",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded",
      "transition-colors",
      className
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
        className
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
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-100", barColors[variant])}
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
          className
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
                "opacity-60 scale-[0.96]"
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
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

const AnnouncementDismiss = AnnouncementBarDismiss;

export {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarAction,
  AnnouncementBarDismiss,
  AnnouncementBarProgress,
  AnnouncementStack,
  useAnnouncementDismiss,
  useAnnouncementExpiry,
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
  AnnouncementStackProps,
  AnnouncementVariant,
  AnnouncementPosition,
  AnnouncementPriority,
  AnnouncementUrgency,
  AnimationType,
  PersistMode,
};
