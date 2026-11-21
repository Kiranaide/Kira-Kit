"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useAnnounce } from "@/hooks/use-announce";
import {
  DropdownMenuItem,
  KiraDropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconDots,
  IconGripVertical,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { resolveComponentDefaults } from "@/lib/component-defaults";
import { isStringProp } from "@/lib/component-prop-guards";

interface TabsContextValue {
  orientation: "horizontal" | "vertical";
  variant: TabsListVariant;
  color: TabsTriggerColor;
  showIndicator: boolean;
}

const TabsContext = React.createContext<TabsContextValue>({
  orientation: "horizontal",
  variant: "default",
  color: "default",
  showIndicator: true,
});

function useTabsContext() {
  return React.useContext(TabsContext);
}

type TabsListVariant =
  "default" | "outline" | "pills" | "underline" | "soft" | "card" | "segment";

type TabsTriggerColor =
  "default" | "primary" | "success" | "warning" | "destructive";

interface TabsProps extends TabsPrimitive.Root.Props {
  orientation?: "horizontal" | "vertical";
  variant?: TabsListVariant;
  color?: TabsTriggerColor;
  showIndicator?: boolean;
}

function Tabs(input: TabsProps) {
  const { orientation, variant, color, showIndicator, className, ...props } =
    resolveComponentDefaults(input, TABS_DEFAULTS_1);

  return (
    <TabsContext.Provider
      value={{ orientation, variant, color, showIndicator }}
    >
      <TabsPrimitive.Root
        data-slot="tabs"
        orientation={orientation}
        // Vertical = side-by-side layout: list left, panel right. Without a
        // row layout on the root the panel stacks below the list.
        className={cn(
          orientation === "vertical" && "flex flex-row items-start gap-6",
          className,
        )}
        {...props}
      />
    </TabsContext.Provider>
  );
}

const tabsListVariants = cva(
  [
    "group/list inline-flex items-center justify-start text-muted-foreground relative",
    "transition-colors duration-200",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        default: "bg-muted rounded-lg p-1",
        outline: "border border-border bg-transparent rounded-lg p-1",
        pills: "bg-transparent gap-1",
        underline:
          "bg-transparent gap-1 rounded-none p-0 border-b border-border",
        soft: "bg-transparent gap-1",
        card: "bg-muted/30 rounded-lg gap-1 p-1",
        segment: "bg-transparent gap-1 rounded-full p-1",
      },
      color: {
        default: "",
        primary: "",
        success: "",
        warning: "",
        destructive: "",
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col items-stretch",
      },
    },
    compoundVariants: [
      {
        variant: "underline",
        orientation: "vertical",
        className: "border-b-0 border-r border-border",
      },

      {
        variant: "default",
        color: "primary",
        className: "bg-primary/10",
      },
      {
        variant: "default",
        color: "success",
        className: "bg-success/10",
      },
      {
        variant: "default",
        color: "warning",
        className: "bg-warning/10",
      },
      {
        variant: "default",
        color: "destructive",
        className: "bg-destructive/10",
      },

      {
        variant: "outline",
        color: "primary",
        className: "border-primary/30 bg-primary/5",
      },
      {
        variant: "outline",
        color: "success",
        className: "border-success/30 bg-success/5",
      },
      {
        variant: "outline",
        color: "warning",
        className: "border-warning/30 bg-warning/5",
      },
      {
        variant: "outline",
        color: "destructive",
        className: "border-destructive/30 bg-destructive/5",
      },
      {
        variant: "card",
        color: "primary",
        className: "bg-primary/10",
      },
      {
        variant: "card",
        color: "success",
        className: "bg-success/10",
      },
      {
        variant: "card",
        color: "warning",
        className: "bg-warning/10",
      },
      {
        variant: "card",
        color: "destructive",
        className: "bg-destructive/10",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
      orientation: "horizontal",
    },
  },
);

// Indicator renders only for "underline" and "segment": other variants let
// the trigger's own data-[active] background own the pill, so a second fill
// layer would double the selected treatment. Position/size come from Base
// UI's --active-tab-* vars and motion animates translate/size only.
function TabsIndicatorInternal() {
  const { orientation, variant, color } = useTabsContext();
  const reducedMotion = useReducedMotion();

  if (variant !== "underline" && variant !== "segment") return null;

  const isSegment = variant === "segment";
  const vertical = orientation === "vertical";

  let position: string;

  if (isSegment && vertical) {
    position =
      "left-0 right-0 top-0 rounded-full h-[var(--active-tab-height)] translate-y-[var(--active-tab-top)]";
  } else if (isSegment) {
    position =
      "inset-y-1 left-0 rounded-full w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)]";
  } else if (vertical) {
    position =
      // kira-kit-ignore spacing-scale: 2px active-indicator stroke/hairline
      "right-0 top-0 w-0.5 h-[var(--active-tab-height)] translate-y-[var(--active-tab-top)]";
  } else {
    position =
      // kira-kit-ignore spacing-scale: 2px active-indicator stroke/hairline
      "bottom-0 left-0 w-[var(--active-tab-width)] h-0.5 translate-x-[var(--active-tab-left)]";
  }

  const colorClasses = {
    default: "bg-primary",
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
  };

  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "absolute",
        colorClasses[color],
        !reducedMotion &&
          "transition-[translate,width,height] duration-200 ease-out",
        position,
      )}
    />
  );
}

interface TabsListProps
  extends
    TabsPrimitive.List.Props,
    Omit<VariantProps<typeof tabsListVariants>, "orientation" | "color"> {
  showIndicator?: boolean;
  /** Constrain with `max-w-*`/`w-*`; overflow gains scroll chevrons. */
  scrollable?: boolean;
  children: React.ReactNode;
}

// Hidden-scrollbar utility (breadcrumb.tsx / toggle-group.tsx precedent).
const SCROLLBAR_NONE =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

/**
 * Edge-detection for the scrollable TabsList. Subscribes via
 * useSyncExternalStore (§4-safe: no setState in effect bodies) to scroll,
 * resize, and childList mutations so chevrons stay current when tabs are
 * added/closed or the list is resized.
 */
function useTabsOverflow(
  el: HTMLElement | null,
  orientation: "horizontal" | "vertical",
) {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      if (!el) return () => {};

      const ro = new ResizeObserver(onStoreChange);
      ro.observe(el);
      const mo = new MutationObserver(onStoreChange);
      mo.observe(el, { childList: true, subtree: true });
      el.addEventListener("scroll", onStoreChange, { passive: true });
      window.addEventListener("resize", onStoreChange);

      return () => {
        ro.disconnect();
        mo.disconnect();
        el.removeEventListener("scroll", onStoreChange);
        window.removeEventListener("resize", onStoreChange);
      };
    },
    [el],
  );

  const getSnapshot = React.useCallback(() => {
    if (!el) return "0|0|0";

    const vertical = orientation === "vertical";
    let pos: number;
    let max: number;

    if (vertical) {
      pos = el.scrollTop;
      max = el.scrollHeight - el.clientHeight;
    } else {
      pos = el.scrollLeft;
      max = el.scrollWidth - el.clientWidth;
    }

    // `1` tolerance for fractional scrollWidth in sub-pixel layouts.
    return `${Number(pos > 0)}|${Number(pos < max - 1)}|${Number(max > 0)}`;
  }, [el, orientation]);

  const snapshot = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => "0|0|0",
  );

  const [canStart, canEnd, hasOverflow] = snapshot
    .split("|")
    .map((flag) => flag === "1");

  return { canStart, canEnd, hasOverflow };
}

function TabsScrollButton({
  direction,
  orientation,
  onScrollStep,
  disabled = false,
}: {
  direction: "start" | "end";
  orientation: "horizontal" | "vertical";
  onScrollStep: (direction: 1 | -1) => void;
  disabled?: boolean;
}) {
  const vertical = orientation === "vertical";
  const backward = direction === "start";

  let label: string;
  let icon: React.ReactNode;
  let position: string;
  let step: 1 | -1 = 1;

  if (backward) {
    step = -1;
  }

  if (vertical && backward) {
    label = "Scroll tabs up";
    // kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception
    icon = <IconChevronUp className="size-3.5" aria-hidden="true" />;
    position = "top-1 left-1/2 -translate-x-1/2";
  } else if (vertical) {
    label = "Scroll tabs down";
    // kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception
    icon = <IconChevronDown className="size-3.5" aria-hidden="true" />;
    position = "bottom-1 left-1/2 -translate-x-1/2";
  } else if (backward) {
    label = "Scroll tabs left";
    // kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception
    icon = <IconChevronLeft className="size-3.5" aria-hidden="true" />;
    position = "left-1 top-1/2 -translate-y-1/2";
  } else {
    label = "Scroll tabs right";
    // kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception
    icon = <IconChevronRight className="size-3.5" aria-hidden="true" />;
    position = "right-1 top-1/2 -translate-y-1/2";
  }

  return (
    <button
      type="button"
      data-slot={`tabs-scroll-${direction}`}
      aria-label={label}
      onClick={() => onScrollStep(step)}
      disabled={disabled}
      className={cn(
        "absolute z-20 inline-flex size-6 items-center justify-center rounded-full",
        "border border-border bg-background/90 text-muted-foreground shadow-sm backdrop-blur",
        "hover:text-foreground hover:bg-background",
        "disabled:pointer-events-none disabled:opacity-40 disabled:hover:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[3px] focus-visible:outline-1 focus-visible:outline-ring",
        "transition-colors duration-150 motion-reduce:transition-none",
        position,
      )}
    >
      {icon}
    </button>
  );
}

// oxlint-disable-next-line complexity -- orthogonal display concern flags over one element.
function TabsList({
  className,
  variant,
  showIndicator: showIndicatorProp,
  scrollable = false,
  children,
  ...props
}: TabsListProps) {
  const {
    orientation,
    variant: contextVariant,
    color,
    showIndicator: contextShowIndicator,
  } = useTabsContext();

  const [listEl, setListEl] = React.useState<HTMLDivElement | null>(null);

  const { canStart, canEnd, hasOverflow } = useTabsOverflow(
    listEl,
    orientation,
  );

  const reducedMotion = useReducedMotion();

  const finalVariant = variant ?? contextVariant;
  const shouldShowIndicator = showIndicatorProp ?? contextShowIndicator;

  const handleScrollStep = (direction: 1 | -1) => {
    if (!listEl) return;

    const vertical = orientation === "vertical";
    let amount: number;

    if (vertical) {
      amount = listEl.clientHeight * 0.8;
    } else {
      amount = listEl.clientWidth * 0.8;
    }

    let behavior: ScrollBehavior = "smooth";

    if (reducedMotion) {
      behavior = "auto";
    }

    if (vertical) {
      listEl.scrollBy({ top: direction * amount, behavior });
    } else {
      listEl.scrollBy({ left: direction * amount, behavior });
    }
  };

  const scrollableList = renderTabsListPart1({
    finalVariant,
    scrollable,
    color,
    orientation,
    className,
    props,
    setListEl,
    children,
    shouldShowIndicator,
  });

  if (!scrollable) {
    return scrollableList;
  }

  // Chevron shell: absolutely-positioned buttons must anchor to a
  // non-scrolling wrapper. Inside the scroller they scroll away with content
  // and overlap edge tabs.
  return renderTabsListScrollShellPart2({
    scrollableList,
    hasOverflow,
    canStart,
    orientation,
    handleScrollStep,
    canEnd,
  });
}

const tabsTriggerVariants = cva(
  [
    "group inline-flex min-w-0 items-center justify-center whitespace-nowrap gap-2",
    // Scrollable lists must scroll, not squeeze: flex shrink would absorb the
    // overflow, so chevron detection never fires and labels truncate instead.
    "group-data-[scrollable]/list:shrink-0",
    "rounded-md px-3 py-1.5 text-sm font-medium",
    "relative z-10",
    "transition-[color,background-color,border-color,box-shadow] duration-200",
    "motion-reduce:transition-none",
    "focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[3px] focus-visible:outline-1 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    // kira-kit-ignore arbitrary-values: explicit 44px touch minimum (11 steps)
    "min-h-[44px] sm:min-h-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "text-muted-foreground hover:text-foreground",
          "data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-md data-[active]:font-semibold",
        ],
        outline: [
          "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          "data-[active]:bg-primary data-[active]:text-foreground data-[active]:font-semibold data-[active]:shadow-md",
        ],
        pills: [
          "text-muted-foreground border border-transparent hover:text-foreground hover:bg-muted/50",
          "data-[active]:bg-primary data-[active]:text-foreground data-[active]:border-primary data-[active]:font-semibold data-[active]:shadow-md",
        ],
        underline: [
          "text-muted-foreground rounded-none border-b-2 border-transparent -mb-px hover:text-foreground hover:border-muted-foreground/30",
          "data-[active]:text-primary data-[active]:border-primary data-[active]:font-semibold",
        ],
        soft: [
          "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          "data-[active]:bg-primary/10 data-[active]:text-foreground data-[active]:font-semibold",
        ],
        card: [
          "text-muted-foreground hover:text-foreground",
          "data-[active]:bg-card data-[active]:text-foreground data-[active]:shadow-lg data-[active]:font-semibold data-[active]:border data-[active]:border-border",
        ],
        segment: [
          "text-muted-foreground hover:text-foreground rounded-full",
          // Active background is the sliding pill (Tabs.Indicator); the trigger
          // only raises text weight/colour so the pill stays unobstructed.
          "data-[active]:text-foreground data-[active]:font-semibold",
        ],
      },
      color: {
        default: "",
        primary: "",
        success: "",
        warning: "",
        destructive: "",
      },
      orientation: {
        horizontal: "",
        vertical: "justify-start w-full",
      },
    },
    compoundVariants: [
      {
        variant: "underline",
        orientation: "vertical",
        className: "border-b-0 border-r-2 -mr-px mb-0",
      },

      {
        variant: "default",
        color: "primary",
        className: "data-[active]:bg-primary data-[active]:text-foreground",
      },
      {
        variant: "outline",
        color: "primary",
        className: "data-[active]:bg-primary data-[active]:text-foreground",
      },
      {
        variant: "pills",
        color: "primary",
        className: "data-[active]:bg-primary data-[active]:text-foreground",
      },
      {
        variant: "soft",
        color: "primary",
        className: "data-[active]:bg-primary/10 data-[active]:text-primary",
      },
      {
        variant: "underline",
        color: "primary",
        className: "data-[active]:text-primary data-[active]:border-primary",
      },
      {
        variant: "card",
        color: "primary",
        className:
          "data-[active]:bg-primary data-[active]:text-primary-foreground",
      },

      {
        variant: "default",
        color: "success",
        className:
          "data-[active]:bg-success data-[active]:text-success-foreground",
      },
      {
        variant: "outline",
        color: "success",
        className:
          "data-[active]:bg-success data-[active]:text-success-foreground",
      },
      {
        variant: "pills",
        color: "success",
        className:
          "data-[active]:bg-success data-[active]:text-success-foreground data-[active]:border-success",
      },
      {
        variant: "soft",
        color: "success",
        className: "data-[active]:bg-success/10 data-[active]:text-success",
      },
      {
        variant: "underline",
        color: "success",
        className: "data-[active]:text-success data-[active]:border-success",
      },
      {
        variant: "card",
        color: "success",
        className:
          "data-[active]:bg-success data-[active]:text-success-foreground",
      },

      {
        variant: "default",
        color: "warning",
        className:
          "data-[active]:bg-warning data-[active]:text-warning-foreground",
      },
      {
        variant: "outline",
        color: "warning",
        className:
          "data-[active]:bg-warning data-[active]:text-warning-foreground",
      },
      {
        variant: "pills",
        color: "warning",
        className:
          "data-[active]:bg-warning data-[active]:text-warning-foreground data-[active]:border-warning",
      },
      {
        variant: "soft",
        color: "warning",
        className: "data-[active]:bg-warning/10 data-[active]:text-warning",
      },
      {
        variant: "underline",
        color: "warning",
        className: "data-[active]:text-warning data-[active]:border-warning",
      },
      {
        variant: "card",
        color: "warning",
        className:
          "data-[active]:bg-warning data-[active]:text-warning-foreground",
      },

      {
        variant: "default",
        color: "destructive",
        className:
          "data-[active]:bg-destructive data-[active]:text-destructive-foreground",
      },
      {
        variant: "outline",
        color: "destructive",
        className:
          "data-[active]:bg-destructive data-[active]:text-destructive-foreground",
      },
      {
        variant: "pills",
        color: "destructive",
        className:
          "data-[active]:bg-destructive data-[active]:text-destructive-foreground data-[active]:border-destructive",
      },
      {
        variant: "soft",
        color: "destructive",
        className:
          "data-[active]:bg-destructive/10 data-[active]:text-destructive",
      },
      {
        variant: "underline",
        color: "destructive",
        className:
          "data-[active]:text-destructive data-[active]:border-destructive",
      },
      {
        variant: "card",
        color: "destructive",
        className:
          "data-[active]:bg-destructive data-[active]:text-destructive-foreground",
      },

      // Segment: the pill fill comes from Tabs.Indicator; the trigger only
      // needs a readable text colour on top of the token fill.
      {
        variant: "segment",
        color: "default",
        className: "data-[active]:text-foreground",
      },
      {
        variant: "segment",
        color: "primary",
        className: "data-[active]:text-primary-foreground",
      },
      {
        variant: "segment",
        color: "success",
        className: "data-[active]:text-success-foreground",
      },
      {
        variant: "segment",
        color: "warning",
        className: "data-[active]:text-warning-foreground",
      },
      {
        variant: "segment",
        color: "destructive",
        className: "data-[active]:text-destructive-foreground",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
      orientation: "horizontal",
    },
  },
);

interface TabsTriggerProps
  extends
    Omit<TabsPrimitive.Tab.Props, "children">,
    Omit<VariantProps<typeof tabsTriggerVariants>, "orientation"> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  badgeColor?: "default" | "primary" | "destructive" | "success" | "warning";
  closable?: boolean;
  onClose?: (value: string) => void;
  /** Unsaved-state marker: dot replaces the close X until hover/active. */
  dirty?: boolean;
  /** A close-guard promise is in flight for this tab. */
  closePending?: boolean;
  /** Leading slot — dnd-kit drag handle (rendered inside the Tab). */
  dragHandle?: React.ReactNode;
}

const badgeColorClasses = {
  default: "bg-muted-foreground/20 text-muted-foreground",
  primary: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
};

interface TabCloseAffordanceProps {
  closeLabel: string;
  dirty: boolean;
  closePending: boolean;
  onClose: (e: React.MouseEvent) => void;
}

/** Closable-tab affordance: X button with dirty-dot swap and pending pulse. */
function TabCloseAffordance({
  closeLabel,
  dirty,
  closePending,
  onClose,
}: TabCloseAffordanceProps) {
  return (
    <button
      data-slot="tabs-close"
      type="button"
      aria-label={closeLabel}
      aria-keyshortcuts="Delete"
      aria-disabled={closePending || undefined}
      onClick={onClose}
      className={cn(
        "relative ms-1 rounded-full shrink-0",
        // Visual 20px, hit area ≥24px via pseudo-element (§9 SC 2.5.8).
        "p-0.5 before:absolute before:-inset-1.5 before:rounded-full",
        "hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "transition-colors duration-150 motion-reduce:transition-none",
        "focus-visible:[&_svg]:opacity-100",
      )}
    >
      <IconX
        aria-hidden="true"
        className={cn(
          "h-3 w-3 transition-opacity duration-150 motion-reduce:transition-none",
          dirty &&
            !closePending &&
            "opacity-0 group-hover:opacity-100 group-data-active:opacity-100",
          closePending && "motion-safe:animate-pulse",
        )}
      />
      {dirty && !closePending && (
        // kira-kit-ignore spacing-scale: non-control indicator dot on the compact ladder
        <span
          data-slot="tabs-dirty-dot"
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warning group-hover:opacity-0 group-data-active:opacity-0"
        />
      )}
    </button>
  );
}

// SAFETY: label is app-authored ReactNode (local prop, not I/O); string vs
// node is the domain distinction for the aria label. Single parse boundary.
function resolveCloseLabel(children: React.ReactNode): string {
  // SAFETY: label is app-authored ReactNode (local prop, not I/O); string vs
  // node is the domain distinction for the aria label. Single parse boundary.
  // oxlint-disable-next-line anti-slop/no-runtime-typeof
  if (isStringProp(children)) {
    return `Close ${children}`;
  }

  return "Close tab";
}

// oxlint-disable-next-line complexity -- linear prop fallbacks and feature slots, not nested branching.
function TabsTrigger(input: TabsTriggerProps) {
  const {
    className,
    variant,
    color,
    icon,
    badge,
    badgeColor,
    closable,
    onClose,
    dirty,
    closePending,
    dragHandle,
    value,
    children,
    ...props
  } = resolveComponentDefaults(input, TABS_TRIGGER_DEFAULTS_2);

  const {
    orientation,
    variant: contextVariant,
    color: contextColor,
  } = useTabsContext();

  const finalVariant = variant ?? contextVariant;
  const finalColor = color ?? contextColor;

  const handleClose = (e: React.MouseEvent) => {
    if (closePending) return;

    e.stopPropagation();
    e.preventDefault();

    // SAFETY: KiraTabs/TabItem model tab identity as string values; the Tab
    // primitive's `TabsTab.Value` is `any` here only because Base UI widens it.
    onClose?.(value as string);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (closePending) return;

    if (closable && (e.key === "Delete" || e.key === "Backspace")) {
      e.preventDefault();

      // SAFETY: same string-value invariant as handleClose above.
      onClose?.(value as string);
    }
  };

  // App-authored label: KiraTabs/TabItem labels are app-controlled, so a plain
  // runtime string check is the I/O contract here — non-strings (icon+text
  // nodes) degrade to the generic "Close tab".
  const closeLabel = resolveCloseLabel(children);

  return renderTabsTriggerPart3({
    closePending,
    value,
    handleKeyDown,
    finalVariant,
    finalColor,
    orientation,
    closable,
    className,
    props,
    dragHandle,
    icon,
    children,
    badge,
    badgeColor,
    dirty,
    closeLabel,
    handleClose,
  });
}

const tabsContentVariants = cva(
  ["focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"],
  {
    variants: {
      animation: {
        none: "",
        fade: "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:animation-duration-200",
        slide:
          "motion-safe:animate-in motion-safe:slide-in-from-right-4 motion-safe:fade-in-0 motion-safe:animation-duration-300",
        slideUp:
          "motion-safe:animate-in motion-safe:slide-in-from-bottom-4 motion-safe:fade-in-0 motion-safe:animation-duration-300",
        zoom: "motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:fade-in-0 motion-safe:animation-duration-200",
        // Direction-aware entry via Base UI's data-activation-direction on the Panel.
        // NOTE: never use `duration-*` here — it sets transition-duration, and the
        // default transition-property:all then delays Base UI's exit detection,
        // breaking animation restarts on keepMounted panels.
        auto: "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:animation-duration-200 data-[activation-direction=left]:motion-safe:slide-in-from-right-4 data-[activation-direction=right]:motion-safe:slide-in-from-left-4 data-[activation-direction=up]:motion-safe:slide-in-from-bottom-4 data-[activation-direction=down]:motion-safe:slide-in-from-top-4",
      },
      orientation: {
        horizontal: "mt-2",
        vertical: "mt-0 flex-1 min-w-0",
      },
    },
    defaultVariants: {
      animation: "fade",
      orientation: "horizontal",
    },
  },
);

interface TabsContentProps
  extends
    TabsPrimitive.Panel.Props,
    Omit<VariantProps<typeof tabsContentVariants>, "orientation"> {
  lazy?: boolean;

  keepMounted?: boolean;
}

function TabsContent({
  className,
  animation,
  lazy = false,
  keepMounted = true,
  value,
  children,
  ...props
}: TabsContentProps) {
  const { orientation } = useTabsContext();

  // `lazy` uses Base UI's native unmount: the panel is not in the DOM until its
  // tab is first selected, and unmounts again when left. `keepMounted` is the
  // escape hatch for panels that must retain internal state across visits.
  let mounted = keepMounted;

  if (lazy) {
    mounted = false;
  }

  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      data-value={value}
      value={value}
      keepMounted={mounted}
      className={cn(tabsContentVariants({ animation, orientation }), className)}
      {...props}
    >
      {children}
    </TabsPrimitive.Panel>
  );
}

interface TabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  badgeColor?: "default" | "primary" | "destructive" | "success" | "warning";
  content?: React.ReactNode;
  disabled?: boolean;
  closable?: boolean;
  /** Unsaved-state marker (dot on the close affordance until hover/active). */
  dirty?: boolean;
}

interface KiraTabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsListVariant;
  color?: TabsTriggerColor;
  orientation?: "horizontal" | "vertical";
  showIndicator?: boolean;
  animation?: TabsContentProps["animation"];
  lazy?: boolean;
  /** Show a trailing "+" button. Return a new TabItem to append & select it. */
  addable?: boolean;
  onAdd?: () => TabItem | void;
  onClose?: (value: string) => void;
  /**
   * Close guard. Return/resolve `false` to veto the close (tab stays,
   * `onClose` is not fired). While a promise is pending, the tab's close
   * control is inert and shows a pulsing state.
   */
  onBeforeClose?: (value: string) => boolean | Promise<boolean>;
  /** Sync the active tab to `location.hash` (replaceState; accordion precedent). */
  deepLink?: boolean;
  /** Render an "All tabs" dropdown menu next to the list. */
  overflowMenu?: boolean;
  /** Enable drag-to-reorder via dnd-kit (pointer + keyboard). */
  reorderable?: boolean;
  onReorder?: (items: TabItem[]) => void;
  className?: string;
  listClassName?: string;
  contentClassName?: string;
}

// Type-wide constants (hoisted for use inside hooks and render alike).
const DND_SENSORS_ACTIVATION = { distance: 8 } as const;

/** Wire one tab into dnd-kit sortable drag state; handle stays inside the Tab. */
function useSortableTab(item: TabItem) {
  const sortable = useSortable({ id: item.value, disabled: item.disabled });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    style.opacity = 0.5;
    style.zIndex = 20;
  }

  const dragHandle = (
    <span
      {...attributes}
      {...listeners}
      data-slot="tabs-drag-handle"
      aria-hidden="true"
      // Merge, don't replace: overriding listeners.onPointerDown would stop
      // dnd-kit's PointerSensor from ever seeing pointerdown, killing drags.
      // stopPropagation only keeps the parent Tab from treating it as a press.
      onPointerDown={(event) => {
        listeners?.onPointerDown?.(event);
        event.stopPropagation();
      }}
      className="-ms-1 inline-flex size-6 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-foreground/10 active:cursor-grabbing touch-none"
    >
      {/* kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception */}
      <IconGripVertical className="size-3.5" />
    </span>
  );

  return { setNodeRef, style, dragHandle };
}

/**
 * TabsTrigger wrapped for dnd-kit when `reorderable` is on. The sortable node
 * ref/style go on a wrapper span so the Base UI Tab DOM registration (roving
 * tabindex composites) stays untouched; the drag handle renders INSIDE the
 * trigger as the leading slot.
 */
function SortableTab({
  item,
  reorderable,
  onClose,
  closePending,
}: {
  item: TabItem;
  reorderable: boolean;
  onClose: (value: string) => void;
  closePending: boolean;
}) {
  const { setNodeRef, style, dragHandle } = useSortableTab(item);

  if (!reorderable) {
    return (
      <TabsTrigger
        value={item.value}
        icon={item.icon}
        badge={item.badge}
        badgeColor={item.badgeColor}
        disabled={item.disabled}
        closable={item.closable}
        onClose={onClose}
        dirty={item.dirty}
        closePending={closePending}
      >
        {item.label}
      </TabsTrigger>
    );
  }

  return (
    <span
      ref={setNodeRef}
      style={style}
      className="inline-flex group-data-scrollable/list:shrink-0"
    >
      <TabsTrigger
        value={item.value}
        icon={item.icon}
        badge={item.badge}
        badgeColor={item.badgeColor}
        disabled={item.disabled}
        closable={item.closable}
        onClose={onClose}
        dirty={item.dirty}
        closePending={closePending}
        dragHandle={dragHandle}
      >
        {item.label}
      </TabsTrigger>
    </span>
  );
}

/** "All tabs" dropdown: jump to any item; check marks the active one. */
function TabsOverflowMenu({
  items,
  activeValue,
  onSelect,
}: {
  items: TabItem[];
  activeValue: string | undefined;
  onSelect: (value: string) => void;
}) {
  return (
    <KiraDropdownMenu
      trigger={
        <button
          type="button"
          data-slot="tabs-overflow-trigger"
          aria-label="All tabs"
          className={cn(
            "inline-flex items-center justify-center rounded-md size-6 shrink-0",
            "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "transition-colors duration-150 motion-reduce:transition-none",
          )}
        >
          <IconDots className="h-4 w-4" aria-hidden="true" />
        </button>
      }
      contentProps={{ className: "max-h-72 overflow-y-auto" }}
    >
      {items.map((item) => {
        const isActive = item.value === activeValue;

        return (
          <DropdownMenuItem
            key={item.value}
            closeOnClick
            disabled={item.disabled}
            icon={isActive ? <IconCheck /> : undefined}
            onClick={() => onSelect(item.value)}
          >
            {item.label}
          </DropdownMenuItem>
        );
      })}
    </KiraDropdownMenu>
  );
}

/**
 * Close-guard state machine. Returns `(value) => void` that either closes
 * immediately, vetoes, or marks the tab pending while the guard promise runs.
 */
function useCloseGuard(
  items: TabItem[],
  activeValue: string | undefined,
  selectValue: (next: string) => void,
  setItems: React.Dispatch<React.SetStateAction<TabItem[]>>,
  onClose: ((value: string) => void) | undefined,
  onBeforeClose: ((value: string) => boolean | Promise<boolean>) | undefined,
) {
  const [pendingCloses, setPendingCloses] = React.useState<
    Record<string, boolean>
  >({});

  const runClose = (closedValue: string) => {
    const idx = items.findIndex((i) => i.value === closedValue);
    const next = items.filter((i) => i.value !== closedValue);

    // If the active tab was closed, move to the FOLLOWING tab in reading
    // order, wrapping to first (WAI-ARIA APG tabs pattern).
    if (activeValue === closedValue && next.length > 0) {
      const neighbour = next[idx] ?? next[0];
      selectValue(neighbour.value);
    }

    setItems(next);
    onClose?.(closedValue);
  };

  const handleClose = (closedValue: string) => {
    if (pendingCloses[closedValue]) return;

    if (!onBeforeClose) {
      runClose(closedValue);

      return;
    }

    let verdict: boolean | Promise<boolean>;

    try {
      verdict = onBeforeClose(closedValue);
    } catch {
      verdict = false;
    }

    if (verdict instanceof Promise) {
      setPendingCloses((prev) => ({ ...prev, [closedValue]: true }));
      verdict
        .then((allowed) => {
          if (allowed) {
            runClose(closedValue);
          }
        })
        .catch(() => {
          // Guard rejection vetoes the close.
        })
        .finally(() => {
          setPendingCloses((prev) => {
            const nextPending = { ...prev };
            delete nextPending[closedValue];

            return nextPending;
          });
        });

      return;
    }

    if (verdict) {
      runClose(closedValue);
    }
  };

  return { pendingCloses, handleClose };
}

/** Hash deep-link effects: mount-time hash adoption + replaceState per selection. */
function useTabsDeepLinkEffects(
  deepLink: boolean,
  items: TabItem[],
  activeValue: string | undefined,
  selectValue: (next: string) => void,
) {
  React.useEffect(() => {
    if (!deepLink || typeof window === "undefined") return;

    if (!window.location.hash || window.location.hash === "#") return;

    const target = decodeURIComponent(window.location.hash.slice(1));

    if (!items.some((item) => item.value === target)) return;

    if (target !== activeValue) {
      selectValue(target);
    }
    // Hash adoption runs once on mount; re-runs would fight replaceState below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLink]);

  React.useEffect(() => {
    if (!deepLink || typeof window === "undefined") return;

    if (!activeValue) return;

    window.history.replaceState(
      window.history.state,
      "",
      `#${encodeURIComponent(activeValue)}`,
    );
  }, [deepLink, activeValue]);
}

// oxlint-disable-next-line complexity -- one prop per optional feature (guard/menu/dnd/link); each is a single flag check.
function KiraTabs(input0: KiraTabsProps) {
  const state0 = useTabsSetup(input0);
  const state1 = useTabsState2(state0);
  const state2 = useTabsActions(state1);

  return renderTabs(state2);
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  KiraTabs,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
  useTabsContext,
};

export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabItem,
  KiraTabsProps,
};

type renderTabsListPart1Args = {
  finalVariant: TabsListVariant;
  scrollable: Exclude<TabsListProps["scrollable"], undefined>;
  color: ReturnType<typeof useTabsContext>["color"];
  orientation: ReturnType<typeof useTabsContext>["orientation"];
  className: TabsListProps["className"];
  props: Omit<
    TabsListProps,
    "className" | "variant" | "showIndicator" | "scrollable" | "children"
  >;
  setListEl: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
  children: TabsListProps["children"];
  shouldShowIndicator: boolean;
};

function renderTabsListPart1({
  finalVariant,
  scrollable,
  color,
  orientation,
  className,
  props,
  setListEl,
  children,
  shouldShowIndicator,
}: renderTabsListPart1Args) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={finalVariant}
      data-scrollable={scrollable || undefined}
      // orientation data-attr is emitted natively by Base UI — don't duplicate.
      className={cn(
        tabsListVariants({
          variant: finalVariant,
          color,
          orientation,
        }),
        scrollable && "flex-nowrap overflow-x-auto",
        scrollable && orientation === "vertical" && "overflow-y-auto",
        scrollable && SCROLLBAR_NONE,
        scrollable && "motion-safe:scroll-smooth",
        className,
      )}
      {...props}
      ref={setListEl}
    >
      {children}
      {shouldShowIndicator && <TabsIndicatorInternal />}
    </TabsPrimitive.List>
  );
}

type renderTabsListScrollShellPart2Args = {
  scrollableList: ReturnType<typeof renderTabsListPart1>;
  hasOverflow: ReturnType<typeof useTabsOverflow>["hasOverflow"];
  canStart: ReturnType<typeof useTabsOverflow>["canStart"];
  orientation: ReturnType<typeof useTabsContext>["orientation"];
  handleScrollStep: (direction: 1 | -1) => void;
  canEnd: ReturnType<typeof useTabsOverflow>["canEnd"];
};

function renderTabsListScrollShellPart2({
  scrollableList,
  hasOverflow,
  canStart,
  orientation,
  handleScrollStep,
  canEnd,
}: renderTabsListScrollShellPart2Args) {
  return (
    <div
      data-slot="tabs-list-scroll-shell"
      // w-fit: the shell must hug the list's box, otherwise the right chevron
      // anchors past the list edge when the list has its own max-width.
      className="relative w-fit min-w-0 max-w-full"
    >
      {scrollableList}
      {hasOverflow && canStart && (
        <TabsScrollButton
          direction="start"
          orientation={orientation}
          onScrollStep={handleScrollStep}
        />
      )}
      {hasOverflow && canEnd && (
        <TabsScrollButton
          direction="end"
          orientation={orientation}
          onScrollStep={handleScrollStep}
        />
      )}
    </div>
  );
}

type renderTabsTriggerPart3Args = {
  closePending: boolean;
  value: TabsTriggerProps["value"];
  handleKeyDown: (e: React.KeyboardEvent) => void;
  finalVariant: TabsListVariant;
  finalColor: TabsTriggerColor;
  orientation: ReturnType<typeof useTabsContext>["orientation"];
  closable: boolean;
  className: TabsTriggerProps["className"];
  props: Omit<
    TabsTriggerProps,
    | "className"
    | "variant"
    | "color"
    | "icon"
    | "badge"
    | "badgeColor"
    | "closable"
    | "onClose"
    | "dirty"
    | "closePending"
    | "dragHandle"
    | "value"
    | "children"
  >;
  dragHandle: TabsTriggerProps["dragHandle"];
  icon: TabsTriggerProps["icon"];
  children: TabsTriggerProps["children"];
  badge: TabsTriggerProps["badge"];
  badgeColor: "default" | "success" | "destructive" | "warning" | "primary";
  dirty: boolean;
  closeLabel: ReturnType<typeof resolveCloseLabel>;
  handleClose: (e: React.MouseEvent) => void;
};

function renderTabsTriggerPart3({
  closePending,
  value,
  handleKeyDown,
  finalVariant,
  finalColor,
  orientation,
  closable,
  className,
  props,
  dragHandle,
  icon,
  children,
  badge,
  badgeColor,
  dirty,
  closeLabel,
  handleClose,
}: renderTabsTriggerPart3Args) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      data-close-pending={closePending || undefined}
      aria-disabled={closePending || undefined}
      value={value}
      onKeyDown={handleKeyDown}
      className={cn(
        tabsTriggerVariants({
          variant: finalVariant,
          color: finalColor,
          orientation,
        }),
        closable && "pe-2",
        className,
      )}
      {...props}
    >
      {dragHandle}
      {icon && (
        <span
          data-slot="tabs-icon"
          className="shrink-0 [&_svg]:h-4 [&_svg]:w-4"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 truncate">{children}</span>
      {badge !== undefined && (
        // kira-kit-ignore spacing-scale: badge/chip-tier compact padding (labels, not controls)
        <span
          data-slot="tabs-badge"
          className={cn(
            "inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium min-w-5",
            badgeColorClasses[badgeColor],
          )}
        >
          {badge}
        </span>
      )}
      {dirty && !closable && (
        // kira-kit-ignore spacing-scale: non-control indicator dot on the compact ladder
        <span
          data-slot="tabs-dirty-dot"
          aria-hidden="true"
          className="absolute top-1.5 inset-e-1.5 size-1.5 rounded-full bg-warning group-data-active:hidden"
        />
      )}
      {closable && (
        <TabCloseAffordance
          closeLabel={closeLabel}
          dirty={dirty}
          closePending={closePending}
          onClose={handleClose}
        />
      )}
    </TabsPrimitive.Tab>
  );
}

type renderKiraTabsSectionPart4Args = {
  listClassName: KiraTabsProps["listClassName"];
  items: TabItem[];
  reorderable: boolean;
  handleClose: ReturnType<typeof useCloseGuard>["handleClose"];
  pendingCloses: ReturnType<typeof useCloseGuard>["pendingCloses"];
  addable: boolean;
  handleAdd: () => void;
  overflowMenu: boolean;
  activeValue: string | undefined;
  selectValue: (next: string) => void;
};

function renderKiraTabsSectionPart4({
  listClassName,
  items,
  reorderable,
  handleClose,
  pendingCloses,
  addable,
  handleAdd,
  overflowMenu,
  activeValue,
  selectValue,
}: renderKiraTabsSectionPart4Args) {
  return (
    <TabsList className={listClassName}>
      {items.map((item) => (
        <SortableTab
          key={item.value}
          item={item}
          reorderable={reorderable}
          onClose={handleClose}
          closePending={Boolean(pendingCloses[item.value])}
        />
      ))}
      {addable && (
        <button
          data-slot="tabs-add"
          type="button"
          onClick={handleAdd}
          aria-label="Add tab"
          className={cn(
            "inline-flex items-center justify-center rounded-md size-6 shrink-0",
            "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "transition-colors duration-150 motion-reduce:transition-none",
          )}
        >
          <IconPlus className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      {overflowMenu && items.length > 0 && (
        <TabsOverflowMenu
          items={items}
          activeValue={activeValue}
          onSelect={selectValue}
        />
      )}
    </TabsList>
  );
}

type renderKiraTabsSectionPart5Args = {
  activeValue: string | undefined;
  selectValue: (next: string) => void;
  variant: TabsListVariant;
  color: TabsTriggerColor;
  orientation: "horizontal" | "vertical";
  showIndicator: boolean;
  className: KiraTabsProps["className"];
  listNode: React.JSX.Element;
  items: TabItem[];
  animation: "auto" | "none" | "fade" | "slide" | "slideUp" | "zoom" | null;
  lazy: boolean;
  contentClassName: KiraTabsProps["contentClassName"];
};

function renderKiraTabsSectionPart5({
  activeValue,
  selectValue,
  variant,
  color,
  orientation,
  showIndicator,
  className,
  listNode,
  items,
  animation,
  lazy,
  contentClassName,
}: renderKiraTabsSectionPart5Args) {
  return (
    <Tabs
      value={activeValue}
      onValueChange={selectValue}
      variant={variant}
      color={color}
      orientation={orientation}
      showIndicator={showIndicator}
      className={className}
    >
      {listNode}
      {items.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          animation={animation}
          lazy={lazy}
          className={contentClassName}
        >
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const TABS_DEFAULTS_1 = {
  orientation: "horizontal",
  variant: "default",
  color: "default",
  showIndicator: true,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const TABS_TRIGGER_DEFAULTS_2 = {
  badgeColor: "default",
  closable: false,
  dirty: false,
  closePending: false,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const KIRA_TABS_DEFAULTS_3 = {
  variant: "default",
  color: "default",
  orientation: "horizontal",
  showIndicator: true,
  animation: "fade",
  lazy: false,
  addable: false,
  deepLink: false,
  overflowMenu: false,
  reorderable: false,
} as const;

type renderKiraTabsViewArgs = {
  activeValue: string | undefined;
  selectValue: (next: string) => void;
  variant: Exclude<KiraTabsProps["variant"], undefined>;
  color: Exclude<KiraTabsProps["color"], undefined>;
  orientation: Exclude<KiraTabsProps["orientation"], undefined>;
  showIndicator: Exclude<KiraTabsProps["showIndicator"], undefined>;
  className: KiraTabsProps["className"];
  listNode: React.JSX.Element;
  items: TabItem[];
  animation: Exclude<KiraTabsProps["animation"], undefined>;
  lazy: Exclude<KiraTabsProps["lazy"], undefined>;
  contentClassName: KiraTabsProps["contentClassName"];
};

function renderKiraTabsView({
  activeValue,
  selectValue,
  variant,
  color,
  orientation,
  showIndicator,
  className,
  listNode,
  items,
  animation,
  lazy,
  contentClassName,
}: renderKiraTabsViewArgs) {
  return renderKiraTabsSectionPart5({
    activeValue,
    selectValue,
    variant,
    color,
    orientation,
    showIndicator,
    className,
    listNode,
    items,
    animation,
    lazy,
    contentClassName,
  });
}

function useTabsSetup(input: KiraTabsProps) {
  const resolvedProps = resolveComponentDefaults(input, KIRA_TABS_DEFAULTS_3);
  const { items: itemsProp, value, defaultValue } = resolvedProps;

  // Own the item list so closable/addable/reorder can mutate it. When the
  // parent passes a fresh `itemsProp`, adopt it (adjust-on-prop-change via a
  // render-time state prev-value, not an effect — react-compiler safe).
  const [items, setItems] = React.useState(itemsProp);

  const [prevItemsProp, setPrevItemsProp] = React.useState(itemsProp);

  if (itemsProp !== prevItemsProp) {
    setPrevItemsProp(itemsProp);
    setItems(itemsProp);
  }

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? itemsProp[0]?.value,
  );

  let activeValue: string | undefined;

  if (isControlled) {
    activeValue = value;
  } else {
    activeValue = internalValue;
  }

  return {
    ...resolvedProps,
    items,
    setItems,
    isControlled,
    setInternalValue,
    activeValue,
  };
}

function useTabsState2(state: ReturnType<typeof useTabsSetup>) {
  const {
    onValueChange,
    onAdd,
    onClose,
    onBeforeClose,
    deepLink,
    onReorder,
    items,
    setItems,
    isControlled,
    setInternalValue,
    activeValue,
  } = state;

  const selectValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  const announce = useAnnounce();

  const { pendingCloses, handleClose } = useCloseGuard(
    items,
    activeValue,
    selectValue,
    setItems,
    onClose,
    onBeforeClose,
  );

  useTabsDeepLinkEffects(deepLink, items, activeValue, selectValue);

  const handleAdd = () => {
    const created = onAdd?.();

    if (created) {
      setItems((prev) => [...prev, created]);
      selectValue(created.value);
    }
  };

  const dragSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: DND_SENSORS_ACTIVATION,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.value === active.id);
    const newIndex = items.findIndex((i) => i.value === over.id);

    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    onReorder?.(next);
    announce.announcePolite(`Moved to position ${newIndex + 1}`);
  };

  return {
    ...state,
    selectValue,
    pendingCloses,
    handleClose,
    handleAdd,
    dragSensors,
    handleDragEnd,
  };
}

function useTabsActions(state: ReturnType<typeof useTabsState2>) {
  const {
    addable,
    overflowMenu,
    reorderable,
    listClassName,
    items,
    activeValue,
    selectValue,
    pendingCloses,
    handleClose,
    handleAdd,
    dragSensors,
    handleDragEnd,
  } = state;

  const sortableIds = items.map((i) => i.value);

  const baseListNode = renderKiraTabsSectionPart4({
    listClassName,
    items,
    reorderable,
    handleClose,
    pendingCloses,
    addable,
    handleAdd,
    overflowMenu,
    activeValue,
    selectValue,
  });

  let listNode = baseListNode;

  if (reorderable && items.length > 0) {
    listNode = (
      <DndContext
        sensors={dragSensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
          {baseListNode}
        </SortableContext>
      </DndContext>
    );
  }

  return { ...state, listNode };
}

function renderTabs({
  variant,
  color,
  orientation,
  showIndicator,
  animation,
  lazy,
  className,
  contentClassName,
  items,
  activeValue,
  selectValue,
  listNode,
}: ReturnType<typeof useTabsActions>) {
  return renderKiraTabsView({
    activeValue,
    selectValue,
    variant,
    color,
    orientation,
    showIndicator,
    className,
    listNode,
    items,
    animation,
    lazy,
    contentClassName,
  });
}
