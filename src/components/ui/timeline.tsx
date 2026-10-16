"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  IconCircleFilled,
  IconCircleCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconAlertTriangle,
  IconChevronDown,
} from "@tabler/icons-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

const timelineVariants = cva("relative", {
  variants: {
    orientation: {
      vertical: "flex flex-col",
      horizontal: "flex flex-row overflow-x-auto",
    },
    layout: {
      left: "",
      right: "",
      alternating: "",
      centered: "",
    },
    variant: {
      default: "",
      compact: "",
      minimal: "",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    layout: "left",
    variant: "default",
  },
});

const timelineItemVariants = cva("relative flex group", {
  variants: {
    orientation: {
      vertical: "flex-row",
      horizontal: "flex-col items-center",
    },
    layout: {
      left: "",
      right: "flex-row-reverse",
      alternating: "",
      centered: "",
    },
    status: {
      default: "",
      success: "",
      warning: "",
      error: "",
      info: "",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    layout: "left",
    status: "default",
  },
});

const timelineDotVariants = cva(
  "relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
  {
    variants: {
      size: {
        sm: "h-3 w-3",
        default: "h-4 w-4",
        lg: "h-6 w-6",
        xl: "h-8 w-8",
      },
      status: {
        default: "border-muted-foreground/30 bg-background",
        success: "border-emerald-500 bg-emerald-500 text-white",
        warning: "border-amber-500 bg-amber-500 text-white",
        error: "border-red-500 bg-red-500 text-white",
        info: "border-blue-500 bg-blue-500 text-white",
        active:
          "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25",
      },
    },
    defaultVariants: {
      size: "default",
      status: "default",
    },
  }
);

const timelineConnectorVariants = cva("transition-all duration-300", {
  variants: {
    orientation: {
      vertical: "absolute left-[7px] top-4 w-0.5 -translate-x-1/2",
      horizontal: "h-0.5 flex-1 min-w-8",
    },
    variant: {
      solid: "bg-border",
      dashed: "border-l-2 border-dashed border-border bg-transparent",
      gradient: "bg-gradient-to-b from-border to-transparent",
    },
    status: {
      default: "",
      completed: "bg-primary",
      active: "bg-primary/50",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    variant: "solid",
    status: "default",
  },
});

const timelineContentVariants = cva("flex-1 pb-8", {
  variants: {
    orientation: {
      vertical: "pl-4",
      horizontal: "pt-4 text-center",
    },
    layout: {
      left: "",
      right: "pr-4 pl-0 text-right",
      alternating: "",
      centered: "",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    layout: "left",
  },
});

type TimelineStatus = "default" | "success" | "warning" | "error" | "info";

interface TimelineItemData<T = unknown> {
  id: string;
  datetime?: Date | string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: TimelineStatus;
  avatar?: { src: string; alt: string; fallback?: string };
  actions?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  data?: T;
}

interface TimelineContextValue {
  orientation: "vertical" | "horizontal";
  layout: "left" | "right" | "alternating" | "centered";
  variant: "default" | "compact" | "minimal";
  connectorVariant: "solid" | "dashed" | "gradient";
  size: "sm" | "default" | "lg" | "xl";
  collapsible: boolean;
  animate: boolean;
}

const TimelineContext = React.createContext<TimelineContextValue>({
  orientation: "vertical",
  layout: "left",
  variant: "default",
  connectorVariant: "solid",
  size: "default",
  collapsible: false,
  animate: true,
});

function useTimelineContext() {
  return React.useContext(TimelineContext);
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

interface TimelineProps<T = unknown>
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof timelineVariants> {
  items?: TimelineItemData<T>[];
  connectorVariant?: "solid" | "dashed" | "gradient";
  size?: "sm" | "default" | "lg" | "xl";
  collapsible?: boolean;
  virtualized?: boolean;
  estimateSize?: number;
  animate?: boolean;
  groupBy?:
    | "day"
    | "week"
    | "month"
    | "year"
    | ((item: TimelineItemData<T>) => string);
  renderItem?: (item: TimelineItemData<T>, index: number) => React.ReactNode;
  children?: React.ReactNode;
}

function TimelineRoot<T>({
  items,
  orientation = "vertical",
  layout = "left",
  variant = "default",
  connectorVariant = "solid",
  size = "default",
  collapsible = false,
  virtualized = false,
  estimateSize = 120,
  animate = true,
  groupBy,
  renderItem,
  className,
  children,
  ...props
}: TimelineProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animate && !reducedMotion;

  const groupedItems = React.useMemo(() => {
    if (!items || !groupBy) return null;

    const groups: Record<string, TimelineItemData<T>[]> = {};

    items.forEach((item) => {
      let groupKey: string;

      if (typeof groupBy === "function") {
        groupKey = groupBy(item);
      } else if (item.datetime) {
        const date = new Date(item.datetime);

        switch (groupBy) {
          case "day":
            groupKey = date.toLocaleDateString();
            break;
          case "week":
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            groupKey = `Week of ${weekStart.toLocaleDateString()}`;
            break;
          case "month":
            groupKey = date.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            });
            break;
          case "year":
            groupKey = date.getFullYear().toString();
            break;
          default:
            groupKey = "Unknown";
        }
      } else {
        groupKey = "Unknown";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(item);
    });

    return groups;
  }, [items, groupBy]);

  const virtualizer = useVirtualizer({
    count: items?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    enabled: virtualized && !!items,
  });

  React.useEffect(() => {
    if (!parentRef.current || !shouldAnimate || !items) return;

    const timelineItems = parentRef.current.querySelectorAll(
      "[data-timeline-item]"
    );

    gsap.fromTo(
      timelineItems,
      {
        opacity: 0,
        x: orientation === "horizontal" ? 0 : -20,
        y: orientation === "horizontal" ? 20 : 0,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
      }
    );
  }, [items, shouldAnimate, orientation]);

  const contextValue = React.useMemo(
    () => ({
      orientation: orientation ?? "vertical",
      layout: layout ?? "left",
      variant: variant ?? "default",
      connectorVariant: connectorVariant ?? "solid",
      size: size ?? "default",
      collapsible,
      animate: shouldAnimate,
    }),
    [
      orientation,
      layout,
      variant,
      connectorVariant,
      size,
      collapsible,
      shouldAnimate,
    ]
  );

  if (virtualized && items) {
    return (
      <TimelineContext.Provider value={contextValue}>
        <div
          ref={parentRef}
          role="feed"
          aria-label="Timeline"
          aria-busy={false}
          data-slot="timeline"
          className={cn(
            timelineVariants({ orientation, layout, variant }),
            "max-h-[600px] overflow-auto",
            className
          )}
          {...props}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const item = items[virtualItem.index];

              return (
                <div
                  key={item.id}
                  data-timeline-item
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  aria-setsize={items.length}
                  aria-posinset={virtualItem.index + 1}
                >
                  {renderItem ? (
                    renderItem(item, virtualItem.index)
                  ) : (
                    <TimelineItem
                      key={item.id}
                      status={item.status}
                      collapsible={item.collapsible}
                      defaultCollapsed={item.defaultCollapsed}
                    >
                      <TimelineDot status={item.status}>
                        {item.icon}
                      </TimelineDot>
                      <TimelineConnector />
                      <TimelineContent>
                        {item.datetime && (
                          <TimelineTime datetime={item.datetime} />
                        )}
                        <TimelineTitle>{item.title}</TimelineTitle>
                        {item.description && (
                          <TimelineDescription>
                            {item.description}
                          </TimelineDescription>
                        )}
                        {item.actions && (
                          <TimelineActions>{item.actions}</TimelineActions>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </TimelineContext.Provider>
    );
  }

  if (groupedItems) {
    return (
      <TimelineContext.Provider value={contextValue}>
        <div
          ref={parentRef}
          role="feed"
          aria-label="Timeline"
          data-slot="timeline"
          className={cn(
            timelineVariants({ orientation, layout, variant }),
            className
          )}
          {...props}
        >
          {Object.entries(groupedItems).map(([groupKey, groupItems]) => (
            <div key={groupKey} className="mb-6">
              <div className="mb-4 text-sm font-semibold text-muted-foreground">
                {groupKey}
              </div>
              {groupItems.map((item, index) =>
                renderItem ? (
                  renderItem(item, index)
                ) : (
                  <TimelineItem
                    key={item.id}
                    status={item.status}
                    collapsible={item.collapsible}
                    defaultCollapsed={item.defaultCollapsed}
                  >
                    <TimelineDot status={item.status}>{item.icon}</TimelineDot>
                    <TimelineConnector />
                    <TimelineContent>
                      {item.datetime && (
                        <TimelineTime datetime={item.datetime} />
                      )}
                      <TimelineTitle>{item.title}</TimelineTitle>
                      {item.description && (
                        <TimelineDescription>
                          {item.description}
                        </TimelineDescription>
                      )}
                      {item.actions && (
                        <TimelineActions>{item.actions}</TimelineActions>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                )
              )}
            </div>
          ))}
        </div>
      </TimelineContext.Provider>
    );
  }

  if (items) {
    return (
      <TimelineContext.Provider value={contextValue}>
        <div
          ref={parentRef}
          role="feed"
          aria-label="Timeline"
          data-slot="timeline"
          className={cn(
            timelineVariants({ orientation, layout, variant }),
            className
          )}
          {...props}
        >
          {items.map((item, index) =>
            renderItem ? (
              renderItem(item, index)
            ) : (
              <TimelineItem
                key={item.id}
                status={item.status}
                collapsible={item.collapsible}
                defaultCollapsed={item.defaultCollapsed}
              >
                <TimelineDot status={item.status}>{item.icon}</TimelineDot>
                <TimelineConnector />
                <TimelineContent>
                  {item.datetime && <TimelineTime datetime={item.datetime} />}
                  <TimelineTitle>{item.title}</TimelineTitle>
                  {item.description && (
                    <TimelineDescription>
                      {item.description}
                    </TimelineDescription>
                  )}
                  {item.actions && (
                    <TimelineActions>{item.actions}</TimelineActions>
                  )}
                </TimelineContent>
              </TimelineItem>
            )
          )}
        </div>
      </TimelineContext.Provider>
    );
  }

  return (
    <TimelineContext.Provider value={contextValue}>
      <div
        ref={parentRef}
        role="feed"
        aria-label="Timeline"
        data-slot="timeline"
        className={cn(
          timelineVariants({ orientation, layout, variant }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TimelineContext.Provider>
  );
}

interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: TimelineStatus;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}

interface TimelineItemContextValue {
  status: TimelineStatus;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isLast: boolean;
}

const TimelineItemContext = React.createContext<TimelineItemContextValue>({
  status: "default",
  collapsed: false,
  setCollapsed: () => {},
  isLast: false,
});

function useTimelineItemContext() {
  return React.useContext(TimelineItemContext);
}

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  (
    {
      status = "default",
      collapsible: itemCollapsible,
      defaultCollapsed = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const {
      orientation,
      layout,
      collapsible: globalCollapsible,
    } = useTimelineContext();

    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
    const isCollapsible = itemCollapsible ?? globalCollapsible;

    const itemLayout = layout === "alternating" ? "left" : layout;

    const itemContextValue = React.useMemo(
      () => ({
        status,
        collapsed: isCollapsible ? collapsed : false,
        setCollapsed,
        isLast: false,
      }),
      [status, collapsed, isCollapsible]
    );

    return (
      <TimelineItemContext.Provider value={itemContextValue}>
        <div
          ref={ref}
          role="article"
          data-slot="timeline-item"
          data-timeline-item
          data-status={status}
          data-collapsed={collapsed || undefined}
          className={cn(
            timelineItemVariants({ orientation, layout: itemLayout, status }),
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TimelineItemContext.Provider>
    );
  }
);

TimelineItem.displayName = "TimelineItem";

interface TimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: TimelineStatus | "active";
  children?: React.ReactNode;
}

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ status: statusProp, className, children, ...props }, ref) => {
    const { size } = useTimelineContext();
    const { status: itemStatus } = useTimelineItemContext();
    const status = statusProp ?? itemStatus;

    const renderIcon = () => {
      if (children) return children;

      if (size === "sm" || size === "default") return null;

      switch (status) {
        case "success":
          return <IconCircleCheck className="h-3 w-3" />;
        case "error":
          return <IconAlertCircle className="h-3 w-3" />;
        case "warning":
          return <IconAlertTriangle className="h-3 w-3" />;
        case "info":
          return <IconInfoCircle className="h-3 w-3" />;
        default:
          return <IconCircleFilled className="h-1.5 w-1.5" />;
      }
    };

    return (
      <div
        ref={ref}
        data-slot="timeline-dot"
        aria-hidden="true"
        className={cn(timelineDotVariants({ size, status }), className)}
        {...props}
      >
        {renderIcon()}
      </div>
    );
  }
);

TimelineDot.displayName = "TimelineDot";

interface TimelineConnectorProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "solid" | "dashed" | "gradient";
}

const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  TimelineConnectorProps
>(({ variant: variantProp, className, ...props }, ref) => {
  const { orientation, connectorVariant } = useTimelineContext();
  const variant = variantProp ?? connectorVariant;

  return (
    <div
      ref={ref}
      data-slot="timeline-connector"
      role="presentation"
      aria-hidden="true"
      className={cn(
        timelineConnectorVariants({ orientation, variant }),
        orientation === "vertical" && "h-[calc(100%-1rem)]",
        className
      )}
      {...props}
    />
  );
});

TimelineConnector.displayName = "TimelineConnector";

interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation, layout, collapsible } = useTimelineContext();
    const { collapsed, setCollapsed } = useTimelineItemContext();
    const contentRef = React.useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    React.useEffect(() => {
      if (!contentRef.current || !collapsible || reducedMotion) return;

      const content = contentRef.current.querySelector(
        "[data-collapsible-content]"
      );

      if (!content) return;

      if (collapsed) {
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.2,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(content, {
          height: "auto",
          opacity: 1,
          duration: 0.2,
          ease: "power2.inOut",
        });
      }
    }, [collapsed, collapsible, reducedMotion]);

    return (
      <div
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          (
            contentRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node;
        }}
        data-slot="timeline-content"
        className={cn(
          timelineContentVariants({ orientation, layout }),
          className
        )}
        {...props}
      >
        {collapsible ? (
          <>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="flex w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              aria-expanded={!collapsed}
            >
              <span className="flex-1">
                {React.Children.toArray(children)[0]}
              </span>
              <IconChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  collapsed && "-rotate-90"
                )}
              />
            </button>
            <div data-collapsible-content className="overflow-hidden">
              {React.Children.toArray(children).slice(1)}
            </div>
          </>
        ) : (
          children
        )}
      </div>
    );
  }
);

TimelineContent.displayName = "TimelineContent";

interface TimelineTimeProps extends React.HTMLAttributes<HTMLTimeElement> {
  datetime: Date | string;
  format?: Intl.DateTimeFormatOptions;
  relative?: boolean;
}

const TimelineTime = React.forwardRef<HTMLTimeElement, TimelineTimeProps>(
  (
    {
      datetime,
      format = { dateStyle: "medium", timeStyle: "short" },
      relative = false,
      className,
      ...props
    },
    ref
  ) => {
    const date = datetime instanceof Date ? datetime : new Date(datetime);
    const isoString = date.toISOString();

    const formatRelative = (date: Date): string => {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return "Just now";

      if (diffMins < 60)
        return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;

      if (diffHours < 24)
        return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

      if (diffDays < 7)
        return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

      return date.toLocaleDateString(undefined, format);
    };

    const displayText = relative
      ? formatRelative(date)
      : date.toLocaleString(undefined, format);

    return (
      <time
        ref={ref}
        data-slot="timeline-time"
        dateTime={isoString}
        className={cn("text-xs text-muted-foreground", className)}
        {...props}
      >
        {displayText}
      </time>
    );
  }
);

TimelineTime.displayName = "TimelineTime";

interface TimelineTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

const TimelineTitle = React.forwardRef<HTMLHeadingElement, TimelineTitleProps>(
  ({ className, children, ...props }, ref) => {
    const { status } = useTimelineItemContext();

    return (
      <h3
        ref={ref}
        data-slot="timeline-title"
        className={cn(
          "text-sm font-semibold leading-tight",
          status === "error" && "text-destructive",
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

TimelineTitle.displayName = "TimelineTitle";

interface TimelineDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  TimelineDescriptionProps
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      data-slot="timeline-description"
      className={cn("mt-1 text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
});

TimelineDescription.displayName = "TimelineDescription";

interface TimelineActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TimelineActions = React.forwardRef<HTMLDivElement, TimelineActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="timeline-actions"
        className={cn("mt-2 flex items-center gap-2", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TimelineActions.displayName = "TimelineActions";

interface TimelineAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

const TimelineAvatar = React.forwardRef<HTMLDivElement, TimelineAvatarProps>(
  ({ src, alt, fallback, className, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);

    return (
      <div
        ref={ref}
        data-slot="timeline-avatar"
        className={cn(
          "relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted",
          className
        )}
        {...props}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={alt || ""}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
            {fallback || alt?.charAt(0)?.toUpperCase() || "?"}
          </span>
        )}
      </div>
    );
  }
);

TimelineAvatar.displayName = "TimelineAvatar";

const Timeline = Object.assign(TimelineRoot, {
  Item: TimelineItem,
  Dot: TimelineDot,
  Connector: TimelineConnector,
  Content: TimelineContent,
  Time: TimelineTime,
  Title: TimelineTitle,
  Description: TimelineDescription,
  Actions: TimelineActions,
  Avatar: TimelineAvatar,
});

export {
  Timeline,
  TimelineRoot,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
  TimelineActions,
  TimelineAvatar,
  timelineVariants,
  timelineItemVariants,
  timelineDotVariants,
  timelineConnectorVariants,
  timelineContentVariants,
  useTimelineContext,
  useTimelineItemContext,
};

export type {
  TimelineProps,
  TimelineItemProps,
  TimelineDotProps,
  TimelineConnectorProps,
  TimelineContentProps,
  TimelineTimeProps,
  TimelineTitleProps,
  TimelineDescriptionProps,
  TimelineActionsProps,
  TimelineAvatarProps,
  TimelineItemData,
  TimelineStatus,
};
