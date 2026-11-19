/* oxlint-disable react/only-export-components -- public compound API, contexts and variants */
"use client";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconCheck,
  IconAlertTriangle,
  IconInfoCircle,
  IconClock,
} from "@tabler/icons-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { SkeletonRoot, SkeletonListItem } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "cn";
import { resolveComponentDefaults } from "@/lib/component-defaults";
import { isCallbackProp } from "@/lib/component-prop-guards";

const timelineVariants = cva("relative min-w-0 [--timeline-dot-size:1rem]", {
  variants: {
    orientation: { vertical: "", horizontal: "overflow-x-auto pb-2" },
    layout: { left: "", right: "", alternating: "", centered: "" },
    variant: {
      default: "[--timeline-space:2rem]",
      compact: "[--timeline-space:1rem] text-sm",
      minimal:
        "[--timeline-space:1.5rem] [&_[data-slot=timeline-connector]]:opacity-40",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    layout: "left",
    variant: "default",
  },
});

const timelineItemVariants = cva(
  "group/timeline-item relative grid min-w-0 gap-x-4 pb-(--timeline-space)",
  {
    variants: {
      orientation: {
        vertical: "grid-cols-[var(--timeline-dot-size)_minmax(0,1fr)]",
        horizontal:
          "w-64 shrink-0 grid-cols-1 grid-rows-[var(--timeline-dot-size)_1fr] gap-y-4 pe-6",
      },
      layout: {
        left: "",
        right: "grid-cols-[minmax(0,1fr)_var(--timeline-dot-size)]",
        alternating:
          "md:grid-cols-[minmax(0,1fr)_var(--timeline-dot-size)_minmax(0,1fr)]",
        centered:
          "md:grid-cols-[minmax(0,1fr)_var(--timeline-dot-size)_minmax(0,1fr)]",
      },
      status: {
        default: "",
        success: "",
        warning: "",
        error: "",
        info: "",
        active: "",
        pending: "",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      layout: "left",
      status: "default",
    },
  },
);

const timelineDotVariants = cva(
  "relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 bg-background [&>svg]:size-3",
  {
    variants: {
      size: {
        sm: "size-3 [&>svg]:size-2",
        // kira-kit-ignore spacing-scale: icon inside the 16px timeline node is optical
        default: "size-4 [&>svg]:size-2.5",
        lg: "size-6",
        xl: "size-8 [&>svg]:size-4",
      },
      status: {
        default: "border-muted-foreground/50",
        success: "border-success text-success",
        warning: "border-warning text-warning",
        error: "border-destructive text-destructive",
        info: "border-info text-info",
        active: "border-primary bg-primary text-primary-foreground",
        pending: "border-muted-foreground text-muted-foreground",
      },
    },
    defaultVariants: { size: "default", status: "default" },
  },
);

const timelineConnectorVariants = cva("pointer-events-none absolute", {
  variants: {
    orientation: {
      vertical: "bottom-0 top-(--timeline-dot-size) w-px",
      horizontal:
        "top-[calc(var(--timeline-dot-size)/2)] start-(--timeline-dot-size) end-0 h-px",
    },
    variant: {
      solid: "bg-border",
      dashed: "border-dashed border-border",
      gradient: "from-border to-transparent",
    },
    status: { default: "", completed: "bg-primary", active: "bg-primary/50" },
  },
  compoundVariants: [
    { orientation: "vertical", variant: "dashed", className: "border-s" },
    { orientation: "horizontal", variant: "dashed", className: "border-t" },
    {
      orientation: "vertical",
      variant: "gradient",
      className: "bg-linear-to-b",
    },
    {
      orientation: "horizontal",
      variant: "gradient",
      className: "bg-linear-to-r",
    },
  ],
  defaultVariants: {
    orientation: "vertical",
    variant: "solid",
    status: "default",
  },
});

const timelineContentVariants = cva("min-w-0 space-y-2 wrap-anywhere", {
  variants: {
    orientation: {
      vertical: "col-start-2 row-start-1",
      horizontal: "col-start-1 row-start-2",
    },
    layout: {
      left: "",
      right: "col-start-1 text-end",
      alternating: "",
      centered: "",
    },
  },
  defaultVariants: { orientation: "vertical", layout: "left" },
});

type TimelineStatus =
  "default" | "success" | "warning" | "error" | "info" | "active" | "pending";

type TimelineLayout = "left" | "right" | "alternating" | "centered";

interface TimelineItemData<T = unknown> {
  id: string;
  datetime?: Date | string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: TimelineStatus;
  statusLabel?: string;
  avatar?: { src?: string; alt: string; fallback?: string };
  actions?: React.ReactNode;
  details?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  data?: T;
}

interface TimelineContextValue {
  orientation: "vertical" | "horizontal";
  layout: TimelineLayout;
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

const TimelinePositionContext = React.createContext({ index: 0, count: 1 });

function useTimelineContext() {
  return React.useContext(TimelineContext);
}

interface TimelineProps<T = unknown>
  extends
    Omit<React.ComponentProps<"div">, "children">,
    VariantProps<typeof timelineVariants> {
  items?: TimelineItemData<T>[];
  connectorVariant?: "solid" | "dashed" | "gradient";
  size?: "sm" | "default" | "lg" | "xl";
  collapsible?: boolean;
  virtualized?: boolean;
  estimateSize?: number;
  animate?: boolean;
  groupBy?:
    "day" | "week" | "month" | "year" | ((item: TimelineItemData<T>) => string);
  locale?: string;
  timeZone?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  renderItem?: (item: TimelineItemData<T>, index: number) => React.ReactNode;
  children?: React.ReactNode;
}

function validDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);

  return Number.isFinite(date.getTime()) ? date : null;
}

function groupLabel<T>(
  item: TimelineItemData<T>,
  groupBy: NonNullable<TimelineProps<T>["groupBy"]>,
  locale: string | undefined,
  timeZone: string | undefined,
  weekStartsOn: number,
) {
  if (isCallbackProp(groupBy)) return groupBy(item);
  const date = item.datetime ? validDate(item.datetime) : null;

  if (!date) return "Date unavailable";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const part = (type: string) =>
    Number(parts.find((entry) => entry.type === type)?.value);

  const calendarDate = new Date(
    Date.UTC(part("year"), part("month") - 1, part("day")),
  );

  if (groupBy === "week")
    calendarDate.setUTCDate(
      calendarDate.getUTCDate() -
        ((calendarDate.getUTCDay() - weekStartsOn + 7) % 7),
    );

  const options: Intl.DateTimeFormatOptions = resolvegroupLabelChoice1({
    groupBy,
  });

  const label = new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: "UTC",
  }).format(calendarDate);

  return groupBy === "week" ? `Week of ${label}` : label;
}

interface TimelineRow<T> {
  item: TimelineItemData<T>;
  heading?: string;
}

function timelineRows<T>(
  items: TimelineItemData<T>[],
  props: Pick<
    TimelineProps<T>,
    "groupBy" | "locale" | "timeZone" | "weekStartsOn"
  >,
): TimelineRow<T>[] {
  if (!props.groupBy) return items.map((item) => ({ item }));
  const groups = new Map<string, TimelineItemData<T>[]>();

  for (const item of items) {
    const label = groupLabel(
      item,
      props.groupBy,
      props.locale,
      props.timeZone,
      props.weekStartsOn ?? 0,
    );

    const group = groups.get(label);

    if (group) group.push(item);
    else groups.set(label, [item]);
  }

  return Array.from(groups, ([heading, group]) =>
    group.map((item, index) => ({
      item,
      heading: index === 0 ? heading : undefined,
    })),
  ).flat();
}

function TimelineVirtualList<T>({
  rows,
  renderRow,
  estimateSize,
  horizontal,
}: {
  rows: TimelineRow<T>[];
  renderRow: (row: TimelineRow<T>, index: number) => React.ReactNode;
  estimateSize: number;
  horizontal: boolean;
}) {
  "use no memo";
  const viewportRef = React.useRef<HTMLDivElement>(null);

  // oxlint-disable-next-line react/incompatible-library -- TanStack Virtual exposes mutable getters; this caller uses the documented use no memo compiler opt-out to preserve live measurements.
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => viewportRef.current,
    getItemKey: (index) => rows[index].item.id,
    estimateSize: () =>
      Number.isFinite(estimateSize) && estimateSize > 0 ? estimateSize : 120,
    horizontal,
    overscan: 5,
  });

  React.useEffect(() => {
    const node = viewportRef.current;

    if (!node) return;

    const observer = new ResizeObserver(() => {
      if (node.clientWidth && node.clientHeight) virtualizer.measure();
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [virtualizer]);

  return (
    <div
      ref={viewportRef}
      data-slot="timeline-viewport"

      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The bounded scroll region is keyboard focusable so users can scroll and select its content without a pointer.
      tabIndex={0}

      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The named region preserves the component's div root, layout, and public DOM ref contract.
      role="region"
      aria-label="Scrollable timeline"
      className={cn(
        "overflow-auto rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring",
        horizontal ? "h-80" : "h-96",
      )}
    >
      <div
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This list uses div roots for virtualization, positioning, or compound layout; ARIA preserves list semantics without changing item DOM contracts.
        role="list"
        data-slot="timeline-canvas"
        className="relative"
        style={
          horizontal
            ? { width: virtualizer.getTotalSize(), minHeight: "100%" }
            : { height: virtualizer.getTotalSize(), width: "100%" }
        }
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            ref={virtualizer.measureElement}
            data-index={virtualRow.index}
            data-slot="timeline-virtual-row"
            role="presentation"
            className={cn(
              "absolute start-0 top-0",
              horizontal ? "w-64" : "w-full",
            )}
            style={{
              transform: horizontal
                ? `translateX(${virtualRow.start}px)`
                : `translateY(${virtualRow.start}px)`,
            }}
          >
            {renderRow(rows[virtualRow.index], virtualRow.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

const timelineSizes = {
  sm: "[--timeline-dot-size:0.75rem]",
  default: "[--timeline-dot-size:1rem]",
  lg: "[--timeline-dot-size:1.5rem]",
  xl: "[--timeline-dot-size:2rem]",
};

function TimelineRoot<T>(input: TimelineProps<T>) {
  const {
    items,
    orientation,
    layout,
    variant,
    connectorVariant,
    size,
    collapsible,
    virtualized,
    estimateSize,
    animate,
    groupBy,
    locale,
    timeZone,
    weekStartsOn,
    renderItem,
    className,
    children,
    ...props
  } = resolveComponentDefaults(input, TIMELINE_ROOT_DEFAULTS_1);

  const reduced = useReducedMotion();
  const direction = orientation ?? "vertical";

  const resolvedLayout =
    direction === "horizontal" ? "left" : (layout ?? "left");

  const context: TimelineContextValue = {
    orientation: direction,
    layout: resolvedLayout,
    variant: variant ?? "default",
    connectorVariant,
    size,
    collapsible,
    animate: animate && !reduced,
  };

  const rows = timelineRows(items ?? [], {
    groupBy,
    locale,
    timeZone,
    weekStartsOn,
  });

  // Keep disclosure state by event identity when a virtual row leaves the viewport.
  const [collapsedItems, setCollapsedItems] = React.useState<
    Record<string, boolean>
  >({});

  const renderRow = (row: TimelineRow<T>, index: number) => (
    <TimelinePositionContext.Provider
      key={row.item.id}
      value={{ index, count: rows.length }}
    >
      {renderTimelineRowPart1({
        direction,
        row,
        renderItem,
        index,
        collapsedItems,
        setCollapsedItems,
        locale,
        timeZone,
      })}
    </TimelinePositionContext.Provider>
  );

  const composed = React.Children.toArray(children);

  return renderTimelineRootView({
    context,
    props,
    direction,
    resolvedLayout,
    variant,
    sizes: timelineSizes,
    size,
    className,
    virtualized,
    items,
    rows,
    renderRow,
    estimateSize,
    composed,
  });
}

const statusLabels: Record<TimelineStatus, string> = {
  default: "Event",
  success: "Completed",
  warning: "Needs attention",
  error: "Failed",
  info: "Information",
  active: "In progress",
  pending: "Pending",
};

interface TimelineItemProps extends React.ComponentProps<"div"> {
  status?: TimelineStatus;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  disabled?: boolean;
  disabledReason?: string;
}

interface TimelineItemContextValue {
  status: TimelineStatus;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isLast: boolean;
  collapsible: boolean;
  disabled: boolean;
  disabledReason?: string;
  index: number;
}

const TimelineItemContext = React.createContext<TimelineItemContextValue>({
  status: "default",
  collapsed: false,
  setCollapsed: () => {},
  isLast: true,
  collapsible: false,
  disabled: false,
  index: 0,
});

function useTimelineItemContext() {
  return React.useContext(TimelineItemContext);
}

function TimelineItem(inputProps: TimelineItemProps) {
  const {
    status,
    collapsible: itemCollapsible,
    defaultCollapsed,
    collapsed: controlledCollapsed,
    onCollapsedChange,
    disabled,
    disabledReason,
    className,
    children,
    ...props
  } = resolveComponentDefaults(inputProps, {
    status: "default",
    defaultCollapsed: false,
    disabled: false,
  });

  const root = useTimelineContext();
  const { index, count } = React.useContext(TimelinePositionContext);
  const [localCollapsed, setLocalCollapsed] = React.useState(defaultCollapsed);
  const collapsible = itemCollapsible ?? root.collapsible;
  const collapsed = collapsible && (controlledCollapsed ?? localCollapsed);

  const setCollapsed = (next: boolean) => {
    if (disabled) return;

    if (controlledCollapsed === undefined) setLocalCollapsed(next);
    onCollapsedChange?.(next);
  };

  return (
    <TimelineItemContext.Provider
      value={{
        status,
        collapsed,
        setCollapsed,
        isLast: index === count - 1,
        collapsible,
        disabled,
        disabledReason,
        index,
      }}
    >
      <Collapsible
        {...props}
        data-slot="timeline-item"
        data-status={status}
        data-collapsed={collapsed || undefined}

        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This positioned or sortable div retains its public ref and layout while participating in an ARIA list.
        role="listitem"
        aria-setsize={count}
        aria-posinset={index + 1}
        open={!collapsed}
        onOpenChange={(next) => setCollapsed(!next)}
        motion={root.animate}
        className={cn(
          timelineItemVariants({
            orientation: root.orientation,
            layout: root.layout,
            status,
          }),
          className,
        )}
      >
        {children}
      </Collapsible>
    </TimelineItemContext.Provider>
  );
}

function railClass(layout: TimelineLayout) {
  if (layout === "right") return "col-start-2";

  if (layout === "alternating" || layout === "centered")
    return "col-start-1 md:col-start-2";

  return "col-start-1";
}

interface TimelineDotProps extends React.ComponentProps<"div"> {
  status?: TimelineStatus;
}

function TimelineDot({
  status: statusProp,
  className,
  children,
  ...props
}: TimelineDotProps) {
  const { size, layout } = useTimelineContext();
  const item = useTimelineItemContext();
  const status = statusProp ?? item.status;

  const icon = resolveTimelineDotChoice2({ status });

  return (
    <div
      data-slot="timeline-dot"
      {...props}
      aria-hidden="true"
      className={cn(
        timelineDotVariants({ size, status }),
        "row-start-1",
        railClass(layout),
        className,
      )}
    >
      {children ?? icon}
    </div>
  );
}

interface TimelineConnectorProps extends React.ComponentProps<"div"> {
  variant?: "solid" | "dashed" | "gradient";
}

function TimelineConnector({
  variant,
  className,
  ...props
}: TimelineConnectorProps) {
  const root = useTimelineContext();
  const { isLast } = useTimelineItemContext();

  return (
    <div
      data-slot="timeline-connector"
      {...props}
      aria-hidden="true"
      className={cn(
        timelineConnectorVariants({
          orientation: root.orientation,
          variant: variant ?? root.connectorVariant,
        }),
        root.orientation === "vertical" &&
          resolveTimelineConnectorChoice3({ root }),
        isLast && "hidden",
        className,
      )}
    />
  );
}

interface TimelineContentProps extends React.ComponentProps<"div"> {
  summary?: React.ReactNode;
}

function TimelineContent({
  summary,
  className,
  children,
  ...props
}: TimelineContentProps) {
  const root = useTimelineContext();
  const item = useTimelineItemContext();
  const parts = React.Children.toArray(children);
  const heading = summary ?? parts[0];
  const body = summary === undefined ? parts.slice(1) : children;
  const reasonId = React.useId();
  const opposite = root.layout === "alternating" && item.index % 2 === 0;

  return renderTimelineContentPart3({
    props,
    root,
    opposite,
    className,
    item,
    reasonId,
    heading,
    body,
    summary,
    children,
  });
}

interface TimelineTimeProps extends Omit<
  React.ComponentProps<"time">,
  "dateTime"
> {
  datetime: Date | string;
  format?: Intl.DateTimeFormatOptions;
  relative?: boolean;
  locale?: string;
  timeZone?: string;
  now?: Date | string;
  invalidLabel?: string;
}

function TimelineTime(inputProps: TimelineTimeProps) {
  const {
    datetime,
    format,
    relative,
    locale,
    timeZone,
    now,
    invalidLabel,
    className,
    ...props
  } = resolveComponentDefaults(inputProps, {
    format: { dateStyle: "medium", timeStyle: "short" },
    relative: false,
    invalidLabel: "Date unavailable",
  });

  const [mountedAt] = React.useState(() => new Date());
  const date = validDate(datetime);
  const current = now ? validDate(now) : mountedAt;
  let text = invalidLabel;

  if (date) {
    const options: Intl.DateTimeFormatOptions = { ...format };

    if (timeZone) options.timeZone = timeZone;
    text = new Intl.DateTimeFormat(locale, options).format(date);

    if (relative && current) {
      const seconds = (date.getTime() - current.getTime()) / 1000;
      const absolute = Math.abs(seconds);

      const unit = resolveTimelineTimeChoice4({ absolute });

      if (unit)
        text = new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
          Math.round(
            seconds / { second: 1, minute: 60, hour: 3600, day: 86_400 }[unit],
          ),
          unit,
        );
    }
  }

  return (
    <time
      data-slot="timeline-time"
      {...props}
      dateTime={date?.toISOString()}
      className={cn(
        "block text-xs tabular-nums text-muted-foreground",
        className,
      )}
    >
      {text}
    </time>
  );
}

interface TimelineTitleProps extends React.ComponentProps<"h3"> {}

function TimelineTitle({ className, children, ...props }: TimelineTitleProps) {
  return (
    <h3
      data-slot="timeline-title"
      {...props}
      className={cn("text-sm leading-6 font-semibold wrap-anywhere", className)}
    >
      {children}
    </h3>
  );
}

interface TimelineDescriptionProps extends React.ComponentProps<"p"> {}

function TimelineDescription({
  className,
  ...props
}: TimelineDescriptionProps) {
  return (
    <p
      data-slot="timeline-description"
      {...props}
      className={cn(
        "text-sm leading-relaxed text-muted-foreground wrap-anywhere",
        className,
      )}
    />
  );
}

interface TimelineActionsProps extends React.ComponentProps<"div"> {}

function TimelineActions({ className, ...props }: TimelineActionsProps) {
  return (
    <div
      data-slot="timeline-actions"
      {...props}
      className={cn("flex flex-wrap items-center gap-2", className)}
    />
  );
}

interface TimelineAvatarProps extends React.ComponentProps<"div"> {
  src?: string;
  alt?: string;
  fallback?: string;
}

function TimelineAvatar({
  src,
  alt = "",
  fallback,
  className,
  ...props
}: TimelineAvatarProps) {
  return (
    <div
      data-slot="timeline-avatar"
      {...props}
      className={cn("flex min-w-0 items-center gap-2", className)}
    >
      <Avatar size="sm">
        <AvatarImage src={src} alt="" />
        <AvatarFallback>
          {fallback || alt.charAt(0).toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      {alt && (
        <span
          data-slot="timeline-avatar-name"
          className="text-xs text-muted-foreground wrap-anywhere"
        >
          {alt}
        </span>
      )}
    </div>
  );
}

interface KiraTimelineProps<T = unknown> extends Omit<
  TimelineProps<T>,
  "items" | "children"
> {
  items: TimelineItemData<T>[];
  loading?: boolean;
  label?: string;
  empty?: React.ReactNode;
  error?: string;
  hasMore?: boolean;
  /** Append events in the owner; check signal.aborted before committing results. */
  onLoadMore?: (signal: AbortSignal) => Promise<void>;
  loadMoreDisabledReason?: string;
}

type TimelineRequestState =
  | { kind: "idle" | "pending" | "success" | "cancelled" }
  | { kind: "error"; message: string };

function useTimelineRequest(onLoadMore: KiraTimelineProps["onLoadMore"]) {
  const [state, setState] = React.useState<TimelineRequestState>({
    kind: "idle",
  });

  const request = React.useRef<AbortController | null>(null);
  React.useEffect(
    () => () => {
      request.current?.abort();
      request.current = null;
    },
    [],
  );

  const load = async () => {
    if (!onLoadMore || request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setState({ kind: "pending" });

    try {
      await onLoadMore(controller.signal);

      if (!controller.signal.aborted && request.current === controller)
        setState({ kind: "success" });
    } catch (error) {
      if (!controller.signal.aborted && request.current === controller)
        setState({
          kind: "error",
          message:
            error instanceof Error
              ? error.message
              : "Could not load older events. Try again.",
        });
    } finally {
      if (request.current === controller) request.current = null;
    }
  };

  const cancel = () => {
    request.current?.abort();
    request.current = null;
    setState({ kind: "cancelled" });
  };

  return { state, load, cancel };
}

function KiraTimeline<T>(input0: KiraTimelineProps<T>) {
  const state0 = useTimelineSetup<T>(input0);
  const state1 = useTimelineActions<T>(state0);

  return renderTimeline<T>(state1);
}

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
  KiraTimeline,
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
  KiraTimelineProps,
};

type resolvegroupLabelChoice1Args<T> = {
  groupBy: NonNullable<TimelineProps<T>["groupBy"]>;
};

function resolvegroupLabelChoice1<T>({
  groupBy,
}: resolvegroupLabelChoice1Args<T>): Intl.DateTimeFormatOptions {
  if (groupBy === "year") {
    return { year: "numeric" };
  }

  if (groupBy === "month") {
    return { year: "numeric", month: "long" };
  }

  return { year: "numeric", month: "short", day: "numeric" };
}

type resolveTimelineDotChoice2Args = {
  status: TimelineStatus;
};

function resolveTimelineDotChoice2({ status }: resolveTimelineDotChoice2Args) {
  if (status === "success") {
    return <IconCheck />;
  }

  if (status === "warning" || status === "error") {
    return <IconAlertTriangle />;
  }

  if (status === "info") {
    return <IconInfoCircle />;
  }

  if (status === "pending") {
    return <IconClock />;
  }

  return null;
}

type resolveTimelineConnectorChoice3Args = {
  root: ReturnType<typeof useTimelineContext>;
};

function resolveTimelineConnectorChoice3({
  root,
}: resolveTimelineConnectorChoice3Args) {
  if (root.layout === "right") {
    return "end-[calc(var(--timeline-dot-size)/2)]";
  }

  if (root.layout === "alternating" || root.layout === "centered") {
    return "start-[calc(var(--timeline-dot-size)/2)] md:start-1/2";
  }

  return "start-[calc(var(--timeline-dot-size)/2)]";
}

type resolveTimelineTimeChoice4Args = { absolute: number };

function resolveTimelineTimeChoice4({
  absolute,
}: resolveTimelineTimeChoice4Args) {
  if (absolute < 60) {
    return "second";
  }

  if (absolute < 3600) {
    return "minute";
  }

  if (absolute < 86_400) {
    return "hour";
  }

  if (absolute < 604_800) {
    return "day";
  }

  return null;
}

type resolveKiraTimelineChoice5Args = {
  pending: boolean;
  message: string | undefined;
  state: ReturnType<typeof useTimelineRequest>["state"];
};

function resolveKiraTimelineChoice5({
  pending,
  message,
  state,
}: resolveKiraTimelineChoice5Args) {
  if (pending) {
    return "Loading timeline events";
  }

  if (message) {
    return message;
  }

  if (state.kind === "success") {
    return "Older events loaded";
  }

  if (state.kind === "cancelled") {
    return "Loading cancelled. Existing events are unchanged.";
  }

  return "";
}

type renderTimelineRowPart1Args<T> = {
  direction: "vertical" | "horizontal";
  row: TimelineRow<T>;
  renderItem: TimelineProps<T>["renderItem"];
  index: number;
  collapsedItems: Record<string, boolean>;
  setCollapsedItems: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  locale: TimelineProps<T>["locale"];
  timeZone: TimelineProps<T>["timeZone"];
};

// oxlint-disable-next-line eslint/complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function renderTimelineRowPart1<T>({
  direction,
  row,
  renderItem,
  index,
  collapsedItems,
  setCollapsedItems,
  locale,
  timeZone,
}: renderTimelineRowPart1Args<T>) {
  return (
    <div
      data-slot="timeline-row"
      role="presentation"
      className={cn(direction === "horizontal" && "w-64 shrink-0")}
    >
      {row.heading !== undefined && (
        <div
          data-slot="timeline-group-heading"
          className="pb-4 pt-2 text-sm font-semibold wrap-anywhere"
        >
          {row.heading}
        </div>
      )}
      {renderItem ? (
        renderItem(row.item, index)
      ) : (
        <TimelineItem
          status={row.item.status}
          collapsible={row.item.collapsible}
          collapsed={
            Object.hasOwn(collapsedItems, row.item.id)
              ? collapsedItems[row.item.id]
              : (row.item.defaultCollapsed ?? false)
          }
          onCollapsedChange={(next) =>
            setCollapsedItems((current) => ({
              ...current,
              [row.item.id]: next,
            }))
          }
          disabled={row.item.disabled}
          disabledReason={row.item.disabledReason}
        >
          <TimelineDot>{row.item.icon}</TimelineDot>
          <TimelineConnector />
          <TimelineContent summary={row.item.title}>
            {row.item.datetime && (
              <TimelineTime
                datetime={row.item.datetime}
                locale={locale}
                timeZone={timeZone}
              />
            )}
            {row.item.status && row.item.status !== "default" && (
              <span
                data-slot="timeline-status"
                className="block text-xs font-medium"
              >
                {row.item.statusLabel ?? statusLabels[row.item.status]}
              </span>
            )}
            {row.item.avatar && <TimelineAvatar {...row.item.avatar} />}
            {row.item.description && (
              <TimelineDescription>{row.item.description}</TimelineDescription>
            )}
            {row.item.details}
            {row.item.actions && (
              <TimelineActions>{row.item.actions}</TimelineActions>
            )}
          </TimelineContent>
        </TimelineItem>
      )}
    </div>
  );
}

type renderTimelineRootSectionPart2Args<T> = {
  context: TimelineContextValue;
  props: Omit<
    TimelineProps<T>,
    | "items"
    | "orientation"
    | "layout"
    | "variant"
    | "connectorVariant"
    | "size"
    | "collapsible"
    | "virtualized"
    | "estimateSize"
    | "animate"
    | "groupBy"
    | "locale"
    | "timeZone"
    | "weekStartsOn"
    | "renderItem"
    | "className"
    | "children"
  >;
  direction: "vertical" | "horizontal";
  resolvedLayout: "left" | "right" | "alternating" | "centered";
  variant: "default" | "compact" | "minimal" | null;
  sizes: { sm: string; default: string; lg: string; xl: string };
  size: "default" | "sm" | "lg" | "xl";
  className: TimelineProps<T>["className"];
  virtualized: boolean;
  items: TimelineProps<T>["items"];
  rows: TimelineRow<T>[];
  renderRow: (row: TimelineRow<T>, index: number) => React.JSX.Element;
  estimateSize: number;
  composed: React.ReactNode[];
};

function renderTimelineRootSectionPart2<T>({
  context,
  props,
  direction,
  resolvedLayout,
  variant,
  sizes,
  size,
  className,
  virtualized,
  items,
  rows,
  renderRow,
  estimateSize,
  composed,
}: renderTimelineRootSectionPart2Args<T>) {
  return (
    <TimelineContext.Provider value={context}>
      <div
        data-slot="timeline"
        {...props}
        data-orientation={direction}
        data-layout={resolvedLayout}
        className={cn(
          timelineVariants({
            orientation: direction,
            layout: resolvedLayout,
            variant,
          }),
          sizes[size],
          className,
        )}
      >
        {virtualized && items ? (
          <TimelineVirtualList
            rows={rows}
            renderRow={renderRow}
            estimateSize={estimateSize}
            horizontal={direction === "horizontal"}
          />
        ) : (
          <div
            data-slot="timeline-list"

            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This list uses div roots for virtualization, positioning, or compound layout; ARIA preserves list semantics without changing item DOM contracts.
            role="list"
            className={cn(
              direction === "horizontal" && "flex w-max min-w-full",
            )}
          >
            {items
              ? rows.map(renderRow)
              : composed.map((child, index) => (
                  <TimelinePositionContext.Provider
                    key={React.isValidElement(child) ? child.key : index}
                    value={{ index, count: composed.length }}
                  >
                    {child}
                  </TimelinePositionContext.Provider>
                ))}
          </div>
        )}
      </div>
    </TimelineContext.Provider>
  );
}

type renderTimelineContentPart3Args = {
  props: Omit<TimelineContentProps, "summary" | "className" | "children">;
  root: ReturnType<typeof useTimelineContext>;
  opposite: boolean;
  className: TimelineContentProps["className"];
  item: ReturnType<typeof useTimelineItemContext>;
  reasonId: string;
  heading: React.ReactNode;
  body: React.ReactNode;
  summary: TimelineContentProps["summary"];
  children: TimelineContentProps["children"];
};

function renderTimelineContentPart3({
  props,
  root,
  opposite,
  className,
  item,
  reasonId,
  heading,
  body,
  summary,
  children,
}: renderTimelineContentPart3Args) {
  return (
    <div
      data-slot="timeline-content"
      {...props}
      className={cn(
        timelineContentVariants({
          orientation: root.orientation,
          layout: root.layout,
        }),
        (root.layout === "alternating" || root.layout === "centered") &&
          (opposite ? "md:col-start-1 md:text-end" : "md:col-start-3"),
        className,
      )}
    >
      {item.collapsible ? (
        <>
          <CollapsibleTrigger
            data-slot="timeline-trigger"
            size="sm"
            variant="ghost"
            className="-my-1 w-full px-0 py-1 text-inherit"
            disabled={item.disabled}
            aria-describedby={item.disabledReason ? reasonId : undefined}
          >
            {heading}
          </CollapsibleTrigger>
          {item.disabledReason && (
            <p
              data-slot="timeline-disabled-reason"
              id={reasonId}
              className="text-xs text-muted-foreground"
            >
              {item.disabledReason}
            </p>
          )}
          <CollapsibleContent
            data-slot="timeline-panel"
            size="none"
            keepMounted
            inert={item.collapsed || undefined}
            className="space-y-2"
          >
            {body}
          </CollapsibleContent>
        </>
      ) : (
        <>
          {summary !== undefined && <TimelineTitle>{summary}</TimelineTitle>}
          {children}
        </>
      )}
    </div>
  );
}

type renderTimelineLoadActionsPart4Args<T> = {
  loadButton: React.RefObject<HTMLButtonElement | null>;
  pending: boolean;
  loadMoreDisabledReason: KiraTimelineProps<T>["loadMoreDisabledReason"];
  reasonId: string;
  load: ReturnType<typeof useTimelineRequest>["load"];
  message: string | undefined;
  state: ReturnType<typeof useTimelineRequest>["state"];
  cancel: ReturnType<typeof useTimelineRequest>["cancel"];
};

function renderTimelineLoadActionsPart4<T>({
  loadButton,
  pending,
  loadMoreDisabledReason,
  reasonId,
  load,
  message,
  state,
  cancel,
}: renderTimelineLoadActionsPart4Args<T>) {
  return (
    <div
      data-slot="timeline-load-actions"
      className="flex flex-wrap items-center gap-2"
    >
      <Button
        ref={loadButton}
        focusableWhenDisabled
        size="sm"
        variant="outline"
        disabled={pending || !!loadMoreDisabledReason}
        aria-describedby={loadMoreDisabledReason ? reasonId : undefined}
        onClick={() => void load()}
      >
        {resolverenderTimelineLoadActionsPart4Choice1({ pending, message })}
      </Button>
      {state.kind === "pending" && (
        <Button size="sm" variant="ghost" onClick={cancel}>
          Cancel loading
        </Button>
      )}
      {loadMoreDisabledReason && (
        <p
          id={reasonId}
          data-slot="timeline-load-disabled-reason"
          className="text-xs text-muted-foreground"
        >
          {loadMoreDisabledReason}
        </p>
      )}
    </div>
  );
}

type renderKiraTimelinePart5Args<T> = {
  props: Omit<
    KiraTimelineProps<T>,
    | "items"
    | "loading"
    | "label"
    | "empty"
    | "error"
    | "hasMore"
    | "onLoadMore"
    | "loadMoreDisabledReason"
    | "className"
    | "orientation"
    | "layout"
    | "variant"
    | "connectorVariant"
    | "size"
    | "collapsible"
    | "virtualized"
    | "estimateSize"
    | "animate"
    | "groupBy"
    | "locale"
    | "timeZone"
    | "weekStartsOn"
    | "renderItem"
  >;
  className: KiraTimelineProps<T>["className"];
  label: string;
  pending: boolean;
  buildHistory: () => React.JSX.Element;
  message: string | undefined;
  status: ReturnType<typeof resolveKiraTimelineChoice5>;
  buildActions: () => React.JSX.Element | null;
};

function RenderKiraTimelinePart5<T>({
  props,
  className,
  label,
  pending,
  buildHistory,
  message,
  status,
  buildActions,
}: renderKiraTimelinePart5Args<T>) {
  return (
    <div
      {...props}
      data-slot="kira-timeline"
      className={cn("min-w-0 space-y-4", className)}
    >
      <div
        data-slot="timeline-history"

        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The named region preserves the component's div root, layout, and public DOM ref contract.
        role="region"
        aria-label={label}
        aria-busy={pending}
      >
        {buildHistory()}
      </div>
      <p
        data-slot="timeline-request-status"

        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This existing live region preserves its block layout and div ref contract; output introduces form-associated semantics.
        role="status"
        aria-atomic="true"
        className={cn(
          "text-sm",
          message ? "text-destructive" : "text-muted-foreground",
          !status && "sr-only",
        )}
      >
        {status}
      </p>
      {buildActions()}
    </div>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const TIMELINE_ROOT_DEFAULTS_1 = {
  orientation: "vertical",
  layout: "left",
  variant: "default",
  connectorVariant: "solid",
  size: "default",
  collapsible: false,
  virtualized: false,
  estimateSize: 120,
  animate: true,
  weekStartsOn: 0,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const KIRA_TIMELINE_DEFAULTS_2 = {
  loading: false,
  label: "Activity history",
  empty: "No events yet.",
  hasMore: false,
} as const;

type resolverenderTimelineLoadActionsPart4Choice1Args = {
  pending: boolean;
  message: string | undefined;
};

function resolverenderTimelineLoadActionsPart4Choice1({
  pending,
  message,
}: resolverenderTimelineLoadActionsPart4Choice1Args) {
  if (pending) {
    return "Loading older events…";
  }

  if (message) {
    return "Try again";
  }

  return "Load older events";
}

function useTimelineSetup<T>(input: KiraTimelineProps<T>) {
  const {
    items,
    loading,
    label,
    empty,
    error,
    hasMore,
    onLoadMore,
    loadMoreDisabledReason,
    className,
    orientation,
    layout,
    variant,
    connectorVariant,
    size,
    collapsible,
    virtualized,
    estimateSize,
    animate,
    groupBy,
    locale,
    timeZone,
    weekStartsOn,
    renderItem,
    ...props
  } = resolveComponentDefaults(input, KIRA_TIMELINE_DEFAULTS_2);

  const { state, load, cancel } = useTimelineRequest(onLoadMore);

  const pending = loading || state.kind === "pending";

  const message = state.kind === "error" ? state.message : error;

  const reasonId = React.useId();

  const loadButton = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (state.kind === "cancelled") loadButton.current?.focus();
  }, [state.kind]);

  const buildHistory = () =>
    renderTimelineHistory({
      items,
      empty,
      loading,
      orientation,
      layout,
      variant,
      connectorVariant,
      size,
      collapsible,
      virtualized,
      estimateSize,
      animate,
      groupBy,
      locale,
      timeZone,
      weekStartsOn,
      renderItem,
    });

  return {
    label,
    hasMore,
    onLoadMore,
    loadMoreDisabledReason,
    className,
    props,
    state,
    load,
    cancel,
    pending,
    message,
    reasonId,
    loadButton,
    buildHistory,
  };
}

function renderTimelineHistory<T>({
  items = [],
  empty,
  loading,
  ...timelineProps
}: Pick<
  TimelineProps<T>,
  | "items"
  | "orientation"
  | "layout"
  | "variant"
  | "connectorVariant"
  | "size"
  | "collapsible"
  | "virtualized"
  | "estimateSize"
  | "animate"
  | "groupBy"
  | "locale"
  | "timeZone"
  | "weekStartsOn"
  | "renderItem"
> & {
  empty: React.ReactNode;
  loading: boolean;
}) {
  if (loading && items.length === 0)
    return (
      <SkeletonRoot loading announce={false} className="space-y-6">
        <SkeletonListItem />
        <SkeletonListItem />
        <SkeletonListItem />
      </SkeletonRoot>
    );

  if (items.length === 0)
    return (
      <div
        data-slot="timeline-empty"
        className="py-6 text-sm text-muted-foreground"
      >
        {empty}
      </div>
    );

  return <TimelineRoot items={items} {...timelineProps} />;
}

function useTimelineActions<T>(setup: ReturnType<typeof useTimelineSetup<T>>) {
  const {
    hasMore,
    onLoadMore,
    loadMoreDisabledReason,
    state,
    load,
    cancel,
    pending,
    message,
    reasonId,
    loadButton,
  } = setup;

  const buildActions = () =>
    onLoadMore && (hasMore || state.kind === "pending" || message)
      ? renderTimelineLoadActionsPart4({
          loadButton,
          pending,
          loadMoreDisabledReason,
          reasonId,
          load,
          message,
          state,
          cancel,
        })
      : null;

  const status = resolveKiraTimelineChoice5({ pending, message, state });

  return { ...setup, buildActions, status };
}

function renderTimeline<T>({
  label,
  className,
  props,
  pending,
  message,
  buildHistory,
  buildActions,
  status,
}: ReturnType<typeof useTimelineActions<T>>) {
  return (
    <RenderKiraTimelinePart5
      {...{
        props,
        className,
        label,
        pending,
        buildHistory,
        message,
        status,
        buildActions,
      }}
    />
  );
}

type renderTimelineRootViewArgs<T> = {
  context: TimelineContextValue;
  props: Omit<
    TimelineProps<T>,
    | "items"
    | "orientation"
    | "layout"
    | "variant"
    | "connectorVariant"
    | "size"
    | "collapsible"
    | "virtualized"
    | "estimateSize"
    | "animate"
    | "groupBy"
    | "locale"
    | "timeZone"
    | "weekStartsOn"
    | "renderItem"
    | "className"
    | "children"
  >;
  direction: "vertical" | "horizontal";
  resolvedLayout: "left" | "right" | "alternating" | "centered";
  variant: Exclude<TimelineProps<T>["variant"], undefined>;
  sizes: { sm: string; default: string; lg: string; xl: string };
  size: NonNullable<TimelineProps<T>["size"]>;
  className: TimelineProps<T>["className"];
  virtualized: NonNullable<TimelineProps<T>["virtualized"]>;
  items: TimelineProps<T>["items"];
  rows: TimelineRow<T>[];
  renderRow: (row: TimelineRow<T>, index: number) => React.JSX.Element;
  estimateSize: NonNullable<TimelineProps<T>["estimateSize"]>;
  composed: React.ReactNode[];
};

function renderTimelineRootView<T>({
  context,
  props,
  direction,
  resolvedLayout,
  variant,
  sizes,
  size,
  className,
  virtualized,
  items,
  rows,
  renderRow,
  estimateSize,
  composed,
}: renderTimelineRootViewArgs<T>) {
  return renderTimelineRootSectionPart2({
    context,
    props,
    direction,
    resolvedLayout,
    variant,
    sizes,
    size,
    className,
    virtualized,
    items,
    rows,
    renderRow,
    estimateSize,
    composed,
  });
}
