"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconChevronDown,
  IconGripVertical,
  IconLoader2,
  IconRefresh,
  IconChevronsDown,
  IconChevronsUp,
  IconSearch,
  IconCheck,
} from "@tabler/icons-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "cn";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { resolveComponentDefaults } from "@/lib/component-defaults";
import { isCallbackProp, isObjectProp } from "@/lib/component-prop-guards";

interface AccordionItemData {
  value: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  /** Shown as a tooltip on the disabled trigger (Â§9: never unexplained). */
  disabledReason?: string;
  icon?: React.ReactNode;
  variant?: VariantProps<typeof accordionTriggerVariants>["variant"];
  size?: VariantProps<typeof accordionTriggerVariants>["size"];
  showArrow?: boolean;
  chevronIcon?: React.ReactNode;
  chevronPosition?: "start" | "end";
  inset?: boolean;
  lazyMount?: boolean;
  showSkeleton?: boolean;
  skeletonLines?: number;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  children?: AccordionItemData[];
  /** Explicit text used for search when `title` is not a plain string. */
  searchText?: string;
}

interface KiraAccordionProps extends Omit<
  React.ComponentProps<typeof AccordionPrimitive.Root>,
  "children"
> {
  items: AccordionItemData[];
  variant?: VariantProps<typeof accordionTriggerVariants>["variant"];
  size?: VariantProps<typeof accordionTriggerVariants>["size"];
  scrollIntoView?: boolean;
  draggable?: boolean;
  onReorder?: (items: AccordionItemData[]) => void;
  asyncLoading?: boolean;
  onItemOpen?: (item: AccordionItemData) => void | Promise<void>;
  onItemClose?: (item: AccordionItemData) => void;
  nested?: boolean;
  showExpandAll?: boolean;
  dragHandlePosition?: "start" | "end";
  /** Render a filter input above the items. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Persist open state (and reorder) to storage under this key. */
  persistKey?: string;
  /** Register panels for browser find-in-page: âŒ˜F/Ctrl-F auto-expands matches. */
  hiddenUntilFound?: boolean;
  /** Sync open state with the URL hash: open an item to share `#value` links. */
  deepLink?: boolean;
}

function flattenItems(items: AccordionItemData[]): AccordionItemData[] {
  const flat: AccordionItemData[] = [];

  for (const item of items) {
    flat.push(item);

    if (item.children) {
      flat.push(...flattenItems(item.children));
    }
  }

  return flat;
}

/** ReactNode title decoder: only plain string titles are searchable/highlightable. */
function isStringTitle(title: React.ReactNode): title is string {
  return Object.prototype.toString.call(title) === "[object String]";
}

/** Resolve the trigger title, wrapping matched substrings while searching. */
function resolveTitleContent(
  item: AccordionItemData,
  highlightQuery?: string,
): React.ReactNode {
  if (highlightQuery === undefined) return item.title;

  if (!isStringTitle(item.title)) return item.title;

  return <HighlightMatch text={item.title} query={highlightQuery} />;
}

/** Open-set callback for an item; kept hook-free so recursive renderers can use it. */
function makeItemOpenHandler(
  item: AccordionItemData,
  asyncLoading: boolean,
  onItemOpen?: (item: AccordionItemData) => void | Promise<void>,
) {
  return () => {
    if (asyncLoading && onItemOpen) {
      void onItemOpen(item);
    } else {
      onItemOpen?.(item);
    }
  };
}

/** Text used to match an item during search. */
function itemSearchText(item: AccordionItemData): string {
  if (item.searchText) return item.searchText;

  if (isStringTitle(item.title)) return item.title;

  return "";
}

/** Recursively keep items (and ancestors) whose title/searchText match `query`. */
function filterItems(
  items: AccordionItemData[],
  query: string,
): AccordionItemData[] {
  const q = query.trim().toLowerCase();

  if (!q) return items;

  const result: AccordionItemData[] = [];

  for (const item of items) {
    const selfMatch = itemSearchText(item).toLowerCase().includes(q);

    if (selfMatch) {
      result.push(item);
      continue;
    }

    if (item.children) {
      const filteredChildren = filterItems(item.children, query);

      if (filteredChildren.length > 0) {
        result.push({ ...item, children: filteredChildren });
      }
    }
  }

  return result;
}

/** Wrap the first case-insensitive occurrence of `query` in `text` with a <mark>. */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  const q = query.trim();

  if (!q) {
    return <>{text}</>;
  }

  const index = text.toLowerCase().indexOf(q.toLowerCase());

  if (index === -1) {
    return <>{text}</>;
  }

  return (
    <>
      {text.slice(0, index)}
      {/* kira-kit-ignore spacing-scale: inline marker pill uses badge-tier 2px padding */}
      <mark
        data-slot="accordion-search-match"
        className="bg-warning/30 text-inherit rounded-sm px-0.5"
      >
        {text.slice(index, index + q.length)}
      </mark>
      {text.slice(index + q.length)}
    </>
  );
}

const accordionTriggerVariants = cva(
  "relative flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-panel-open:rounded-b-none rounded-lg",
  {
    variants: {
      variant: {
        default: "hover:bg-muted/50",
        info: "bg-info/10 text-info dark:text-info hover:bg-info/20",
        success:
          "bg-success/10 text-success dark:text-success hover:bg-success/20",
        warning:
          "bg-warning/10 text-warning dark:text-warning hover:bg-warning/20",
        destructive:
          "bg-destructive/10 text-destructive dark:text-destructive hover:bg-destructive/20",
        ghost: "hover:bg-muted/30",
        outline: "border border-border hover:bg-muted/30",
      },
      size: {
        xs: "py-1.5 px-2 text-xs",
        sm: "py-2 px-3 text-xs",
        default: "py-3 px-4 text-sm",
        lg: "py-4 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const accordionContentVariants = cva("", {
  variants: {
    size: {
      xs: "px-2 py-1.5 text-xs",
      sm: "px-3 py-2 text-xs",
      default: "px-4 py-3 text-sm",
      lg: "px-5 py-4 text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface AccordionProps extends React.ComponentProps<
  typeof AccordionPrimitive.Root
> {
  scrollIntoView?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  hiddenUntilFound?: boolean;
}

function Accordion({
  className,
  scrollIntoView = false,
  hiddenUntilFound = false,
  children,
  ref,
  ...props
}: AccordionProps) {
  const reducedMotion = useReducedMotion();

  const handleValueChange: AccordionPrimitive.Root.Props["onValueChange"] = (
    value,
    ...args
  ) => {
    props.onValueChange?.(value, ...args);

    if (scrollIntoView && value.length > 0) {
      const lastOpened = value[value.length - 1];

      const trigger = document.querySelector<HTMLElement>(
        `[data-accordion-item-value="${lastOpened}"] [data-slot="accordion-trigger"]`,
      );

      let behavior: ScrollBehavior = "smooth";

      if (reducedMotion) {
        behavior = "auto";
      }

      trigger?.scrollIntoView({ behavior, block: "nearest" });
    }
  };

  return (
    <AccordionPrimitive.Root
      ref={ref}
      data-slot="accordion"
      className={cn("w-full space-y-1", className)}
      onValueChange={handleValueChange}
      hiddenUntilFound={hiddenUntilFound}
      {...props}
    >
      {children}
    </AccordionPrimitive.Root>
  );
}

/**
 * Base UI 1.9's AccordionItem never calls the consumer's onOpenChange (it wires
 * its own internal handler), so open/close transitions are observed from the
 * item's data-open attribute instead â€” the same technique usePanelOpened uses
 * for panels. The initial state never fires; only transitions do.
 */
function AccordionItem({
  className,
  onOpen,
  onClose,
  disabled = false,
  ref: userRef,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item> & {
  onOpen?: () => void;
  onClose?: () => void;
}) {
  const itemRef = React.useRef<HTMLDivElement>(null);
  // Latest-callback refs so the observer never needs re-wiring per render.
  const onOpenRef = React.useRef(onOpen);
  const onCloseRef = React.useRef(onClose);

  React.useLayoutEffect(() => {
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
  }, [onOpen, onClose]);

  React.useEffect(() => {
    const item = itemRef.current;

    if (!item) return;

    let wasOpen = item.hasAttribute("data-open");

    const observer = new MutationObserver(() => {
      const isOpen = item.hasAttribute("data-open");

      if (isOpen && !wasOpen) {
        onOpenRef.current?.();
      } else if (!isOpen && wasOpen) {
        onCloseRef.current?.();
      }

      wasOpen = isOpen;
    });

    observer.observe(item, {
      attributes: true,
      attributeFilter: ["data-open"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <AccordionPrimitive.Item
      ref={(node) => {
        // SAFETY: AccordionPrimitive.Item renders a div, so the node is always
        // an HTMLDivElement when mounted.
        itemRef.current = node as HTMLDivElement | null;

        // oxlint-disable-next-line anti-slop/no-runtime-typeof -- React refs support callback and mutable-object forms, requiring runtime dispatch.
        if (isCallbackProp(userRef)) userRef(node);
        // oxlint-disable-next-line anti-slop/no-runtime-typeof -- React refs support callback and mutable-object forms, requiring runtime dispatch.
        else if (userRef && isObjectProp(userRef)) {
          userRef.current = node;
        }
      }}
      data-slot="accordion-item"
      data-accordion-item-value={String(props.value)}
      className={cn(
        "border border-border rounded-lg overflow-hidden",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      disabled={disabled}
      {...props}
    />
  );
}

type AccordionTriggerProps = Omit<
  AccordionPrimitive.Trigger.Props,
  "children"
> & {
  children?: React.ReactNode;
  variant?: VariantProps<typeof accordionTriggerVariants>["variant"];
  size?: VariantProps<typeof accordionTriggerVariants>["size"];
  showArrow?: boolean;
  chevronIcon?: React.ReactNode;
  chevronPosition?: "start" | "end";
  icon?: React.ReactNode;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  dragHandle?: React.ReactNode;
  dragHandlePosition?: "start" | "end";
  disabled?: boolean;
  /** Tooltip shown on a disabled trigger (Â§9: never leave a disabled control unexplained). */
  disabledReason?: string;
};

function TriggerChevron({
  icon,
  position,
  side,
  show,
  reducedMotion,
}: {
  icon: React.ReactNode;
  position: "start" | "end";
  side: "start" | "end";
  show: boolean;
  reducedMotion: boolean;
}): React.ReactNode {
  if (!show || position !== side) return null;

  const chevronElement = icon || <IconChevronDown className="h-4 w-4" />;

  return (
    <span
      data-slot="accordion-chevron"
      className={cn(
        "inline-block shrink-0 in-data-panel-open:rotate-180",
        !reducedMotion && "transition-transform duration-200 ease-out",
      )}
    >
      {chevronElement}
    </span>
  );
}

function TriggerDragHandleSlot({
  handle,
  position,
  side,
}: {
  handle?: React.ReactNode;
  position: "start" | "end";
  side: "start" | "end";
}): React.ReactNode {
  if (!handle || position !== side) return null;

  let edge = "right-2";

  if (side === "start") {
    edge = "left-2";
  }

  return (
    <span
      role="presentation"
      className={cn("absolute top-1/2 -translate-y-1/2", edge)}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {handle}
    </span>
  );
}

function TriggerLoading({
  loading,
  reducedMotion,
}: {
  loading: boolean;
  reducedMotion: boolean;
}): React.ReactNode {
  if (!loading) return null;

  return (
    <IconLoader2
      className={cn("h-4 w-4 shrink-0", !reducedMotion && "animate-spin")}
      aria-hidden="true"
    />
  );
}

/** Brief success checkmark after loading completes without error. */
function TriggerSuccess({ active }: { active: boolean }): React.ReactNode {
  if (!active) return null;

  return (
    <IconCheck
      className="h-4 w-4 shrink-0 text-success"
      aria-hidden="true"
      data-slot="accordion-success"
    />
  );
}

function TriggerRetry({
  error,
  loading,
  onRetry,
}: {
  error: Error | null;
  loading: boolean;
  onRetry?: () => void;
}): React.ReactNode {
  if (!error || loading || !onRetry) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onRetry();
      }}
      className="shrink-0 p-1 rounded hover:bg-destructive/20 text-destructive"
      aria-label="Retry loading content"
    >
      <IconRefresh className="h-4 w-4" />
    </button>
  );
}

function TriggerIcon({ icon }: { icon?: React.ReactNode }): React.ReactNode {
  if (!icon) return null;

  return <span className="shrink-0 flex items-center">{icon}</span>;
}

/** Success flash state: rising edge of `loading` (without error) shows a checkmark briefly. */
function useLoadingSuccessFlash(
  loading: boolean,
  error: Error | null,
): boolean {
  const [prevLoading, setPrevLoading] = React.useState(loading);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Adjust during render (playbook Â§4) so no effect chases the prop.
  if (loading !== prevLoading) {
    setPrevLoading(loading);

    if (loading) {
      setShowSuccess(false);
    } else if (!error) {
      setShowSuccess(true);
    }
  }

  React.useEffect(() => {
    if (!showSuccess) return;

    const timer = window.setTimeout(() => setShowSuccess(false), 1500);

    return () => window.clearTimeout(timer);
  }, [showSuccess]);

  return showSuccess;
}

/** Focusable wrapper so a disabled trigger can host a tooltip (Â§9). */
function DisabledReasonWrapper({
  reason,
  children,
}: {
  reason: string;
  children: React.ReactNode;
}) {
  // Focus proxy for a native-disabled trigger (Base UI's documented pattern for
  // tooltips on disabled controls): the span is hit-tested where the disabled
  // button is not, and Tab reaches it so keyboard users can read the reason.
  // role="button" is deliberately avoided â€” the accessible "disabled button" is
  // already announced via aria-disabled; the label carries the reason.
  const anchorProps = {
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focus proxy required for disabled-control tooltip reachability (WCAG 2.2 Â§9)
    tabIndex: 0,
    "aria-disabled": true,
    "aria-label": reason,
  } as const;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            data-slot="accordion-reason-anchor"
            {...anchorProps}
            className="block w-full cursor-not-allowed rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="top">{reason}</TooltipContent>
    </Tooltip>
  );
}

/** Handle side padding so the grip never overlaps the label. */
function dragHandlePadding(
  hasHandle: boolean,
  position: "start" | "end",
): string {
  if (!hasHandle) return "";

  if (position === "start") return "pl-8";

  return "pr-8";
}

function AccordionTrigger(input: AccordionTriggerProps) {
  const {
    className,
    children,
    variant,
    size,
    showArrow,
    chevronIcon,
    chevronPosition,
    icon,
    loading,
    error,
    onRetry,
    dragHandle,
    dragHandlePosition,
    disabled,
    disabledReason,
    ...props
  } = resolveComponentDefaults(input, ACCORDION_TRIGGER_DEFAULTS_1);

  const reducedMotion = useReducedMotion();
  const showSuccess = useLoadingSuccessFlash(loading, error);
  const handlePadding = dragHandlePadding(!!dragHandle, dragHandlePosition);

  const trigger = renderAccordionHeaderPart1({
    variant,
    size,
    className,
    handlePadding,
    props,
    dragHandle,
    dragHandlePosition,
    chevronIcon,
    chevronPosition,
    showArrow,
    reducedMotion,
    icon,
    children,
    loading,
    showSuccess,
    error,
    onRetry,
  });

  if (disabled && disabledReason) {
    return (
      <DisabledReasonWrapper reason={disabledReason}>
        {trigger}
      </DisabledReasonWrapper>
    );
  }

  return trigger;
}

type AccordionContentProps = Omit<
  AccordionPrimitive.Panel.Props,
  "children"
> & {
  children?: React.ReactNode;
  size?: VariantProps<typeof accordionContentVariants>["size"];
  inset?: boolean;
  lazyMount?: boolean;
  /** Always render children, overriding lazyMount (used by find-in-page). */
  forceMounted?: boolean;
  showSkeleton?: boolean;
  skeletonLines?: number;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
};

/** Observe the Base UI panel's data-open attribute (no public state API exists). */
function usePanelOpened(panelRef: React.RefObject<HTMLDivElement | null>) {
  const [hasBeenOpened, setHasBeenOpened] = React.useState(false);

  React.useEffect(() => {
    const panel = panelRef.current;

    if (!panel) return;

    if (panel.hasAttribute("data-open")) {
      setHasBeenOpened(true);
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-open" &&
          panel.hasAttribute("data-open")
        ) {
          setHasBeenOpened(true);
        }
      });
    });

    observer.observe(panel, {
      attributes: true,
      attributeFilter: ["data-open"],
    });

    return () => observer.disconnect();
  }, [panelRef]);

  return hasBeenOpened;
}

interface AccordionContentBodyProps {
  children: React.ReactNode;
  size: VariantProps<typeof accordionContentVariants>["size"];
  lazyMount: boolean;
  forceMounted: boolean;
  showSkeleton: boolean;
  skeletonLines: number;
  loading: boolean;
  error: Error | null;
  onRetry?: () => void;
  hasBeenOpened: boolean;
}

function AccordionContentBody({
  children,
  size,
  lazyMount,
  forceMounted,
  showSkeleton,
  skeletonLines,
  loading,
  error,
  onRetry,
  hasBeenOpened,
}: AccordionContentBodyProps) {
  const widths = ["75%", "85%", "60%", "90%", "70%"];

  const skeletonRows = Array.from({ length: skeletonLines }, (_, row) => ({
    id: row,
    width: widths[row % widths.length],
  }));

  const reducedMotion = useReducedMotion();

  const skeleton = (
    <div className="space-y-2 px-4 py-3">
      {skeletonRows.map(({ id, width }) => (
        <div
          key={id}
          className={cn(
            "h-3 bg-muted rounded",
            !reducedMotion && "animate-pulse",
          )}
          style={{ width }}
        />
      ))}
    </div>
  );

  let renderContent: React.ReactNode = null;

  if (loading) {
    renderContent = skeleton;
  } else if (error) {
    renderContent = (
      <div className="px-4 py-3 text-destructive">
        <p className="text-sm font-medium">Error loading content</p>
        <p className="text-xs opacity-80 mt-1">{error.message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs flex items-center gap-1 hover:underline"
          >
            <IconRefresh className="h-3 w-3" />
            Retry
          </button>
        )}
      </div>
    );
  } else if (forceMounted || !lazyMount || hasBeenOpened) {
    renderContent = children;
  } else if (showSkeleton) {
    renderContent = skeleton;
  }

  return (
    <div className={cn(accordionContentVariants({ size }))}>
      {renderContent}
    </div>
  );
}

function AccordionContent(input: AccordionContentProps) {
  const {
    className,
    children,
    size,
    inset,
    lazyMount,
    forceMounted,
    showSkeleton,
    skeletonLines,
    loading,
    error,
    onRetry,
    ...props
  } = resolveComponentDefaults(input, ACCORDION_CONTENT_DEFAULTS_2);

  const panelRef = React.useRef<HTMLDivElement>(null);
  const hasBeenOpened = usePanelOpened(panelRef);
  const reducedMotion = useReducedMotion();

  return (
    <AccordionPrimitive.Panel
      ref={panelRef}
      data-slot="accordion-panel"
      keepMounted
      className={cn(
        "overflow-hidden h-(--accordion-panel-height) data-ending-style:h-0 data-starting-style:h-0",
        !reducedMotion &&
          // kira-kit-ignore layout-transitions: Base UI collapsible panel height var is the standard expand/collapse animation
          "transition-[height] duration-200 ease-out data-ending-style:duration-150 data-ending-style:ease-in",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      <AccordionContentBody
        size={size}
        lazyMount={lazyMount}
        forceMounted={forceMounted}
        showSkeleton={showSkeleton}
        skeletonLines={skeletonLines}
        loading={loading}
        error={error}
        onRetry={onRetry}
        hasBeenOpened={hasBeenOpened}
      >
        {children}
      </AccordionContentBody>
    </AccordionPrimitive.Panel>
  );
}

interface SortableAccordionItemProps {
  item: AccordionItemData;
  defaultVariant: VariantProps<typeof accordionTriggerVariants>["variant"];
  defaultSize: VariantProps<typeof accordionTriggerVariants>["size"];
  level: number;
  dragHandlePosition: "start" | "end";
  nested?: boolean;
  onItemOpen?: (item: AccordionItemData) => void | Promise<void>;
  onItemClose?: (item: AccordionItemData) => void;
  asyncLoading?: boolean;
  highlightQuery?: string;
  forceMounted?: boolean;
}

/** Wire one accordion item into dnd-kit sortable drag state. */
function useSortableAccordionDrag(item: AccordionItemData) {
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
  }

  const dragHandle = (
    <span
      {...attributes}
      {...listeners}
      className="shrink-0 p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing touch-none"
      aria-label="Drag to reorder"
    >
      <IconGripVertical className="h-4 w-4 text-muted-foreground" />
    </span>
  );

  return { setNodeRef, style, dragHandle };
}

/** Common trigger/content props shared by both item renderers. */
function triggerVariantProps(
  item: AccordionItemData,
  defaultVariant: VariantProps<typeof accordionTriggerVariants>["variant"],
  defaultSize: VariantProps<typeof accordionTriggerVariants>["size"],
) {
  return {
    variant: item.variant ?? defaultVariant,
    size: item.size ?? defaultSize,
    icon: item.icon,
    showArrow: item.showArrow ?? true,
    chevronIcon: item.chevronIcon,
    chevronPosition: item.chevronPosition ?? "end",
    loading: item.loading,
    error: item.error,
    onRetry: item.onRetry,
    disabled: item.disabled ?? false,
    disabledReason: item.disabledReason,
  } as const;
}

function SortableAccordionItem({
  item,
  defaultVariant,
  defaultSize,
  level,
  dragHandlePosition,
  nested,
  onItemOpen,
  onItemClose,
  asyncLoading = false,
  highlightQuery,
  forceMounted,
}: SortableAccordionItemProps) {
  const { setNodeRef, style, dragHandle } = useSortableAccordionDrag(item);

  const handleOpen = makeItemOpenHandler(item, asyncLoading, onItemOpen);

  const handleClose = React.useCallback(() => {
    onItemClose?.(item);
  }, [onItemClose, item]);

  const hasChildren = nested && item.children && item.children.length > 0;
  const titleContent = resolveTitleContent(item, highlightQuery);
  const childLevel = level + 1;

  const nestedChildren: React.ReactNode[] = [];

  if (hasChildren) {
    nestedChildren.push(
      <div key="nested" className={cn("mt-2 space-y-1", level > 0 && "ml-4")}>
        {item.children?.map((child) => (
          <SortableAccordionItem
            key={child.value}
            item={child}
            defaultVariant={defaultVariant}
            defaultSize={defaultSize}
            level={childLevel}
            dragHandlePosition={dragHandlePosition}
            nested={nested}
            onItemOpen={onItemOpen}
            onItemClose={onItemClose}
            asyncLoading={asyncLoading}
            highlightQuery={highlightQuery}
            forceMounted={forceMounted}
          />
        ))}
      </div>,
    );
  }

  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem
        value={item.value}
        disabled={item.disabled}
        onOpen={handleOpen}
        onClose={handleClose}
      >
        <AccordionTrigger
          {...triggerVariantProps(item, defaultVariant, defaultSize)}
          dragHandle={dragHandle}
          dragHandlePosition={dragHandlePosition}
        >
          {titleContent}
        </AccordionTrigger>
        <AccordionContent
          size={item.size ?? defaultSize}
          inset={item.inset ?? level > 0}
          lazyMount={item.lazyMount}
          forceMounted={forceMounted}
          showSkeleton={item.showSkeleton}
          skeletonLines={item.skeletonLines}
          loading={item.loading}
          error={item.error}
          onRetry={item.onRetry}
        >
          {item.content}
          {nestedChildren}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

/** Restore + persist the open-value set under a localStorage key. */
function usePersistedOpenValues(persistKey?: string) {
  const [openValues, setOpenValues] = React.useState<string[]>(() => {
    if (!persistKey || typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(`accordion-open-${persistKey}`);

      if (!stored) return [];

      // SAFETY: the persist effect writes JSON.stringify(string[]) under this
      // exact key; any foreign value is swallowed by the surrounding catch.
      return JSON.parse(stored) as string[];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    if (!persistKey || typeof window === "undefined") return;

    try {
      localStorage.setItem(
        `accordion-open-${persistKey}`,
        JSON.stringify(openValues),
      );
    } catch {
      // ignore storage failures (private mode / quota)
    }
  }, [persistKey, openValues]);

  return { openValues, setOpenValues };
}

/** Deep link: on mount, open + scroll to the item named in the URL hash. */
function useHashDeepLink(
  deepLink: boolean,
  initialItems: AccordionItemData[],
  reducedMotion: boolean,
  setOpenValues: React.Dispatch<React.SetStateAction<string[]>>,
) {
  const initialItemsRef = React.useRef(initialItems);

  React.useEffect(() => {
    if (!deepLink || typeof window === "undefined") return;

    if (!window.location.hash || window.location.hash === "#") return;

    const target = decodeURIComponent(window.location.hash.slice(1));

    const exists = flattenItems(initialItemsRef.current).some(
      (item) => item.value === target,
    );

    if (!exists) return;

    setOpenValues((prev) => {
      if (prev.includes(target)) return prev;

      return [...prev, target];
    });

    let behavior: ScrollBehavior = "smooth";

    if (reducedMotion) {
      behavior = "auto";
    }

    document
      .querySelector<HTMLElement>(
        `[data-accordion-item-value="${target}"] [data-slot="accordion-trigger"]`,
      )
      ?.scrollIntoView({ behavior, block: "nearest" });
  }, [deepLink, reducedMotion, setOpenValues]);
}

/** dnd-kit wiring for the draggable accordion mode. */
function useAccordionDrag(
  setItems: (updater: React.SetStateAction<AccordionItemData[]>) => void,
  onReorder?: (items: AccordionItemData[]) => void,
) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    // SAFETY: SortableContext items are built from AccordionItemData.value
    // (string), so every dnd-kit active id is an item value string.
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        setItems((items) => {
          const flatItems = flattenItems(items);

          const oldIndex = flatItems.findIndex(
            (item) => item.value === active.id,
          );

          const newIndex = flatItems.findIndex(
            (item) => item.value === over.id,
          );

          if (oldIndex === -1 || newIndex === -1) return items;

          const newFlatItems = arrayMove(flatItems, oldIndex, newIndex);

          onReorder?.(newFlatItems);

          return newFlatItems;
        });
      }
    },
    [onReorder, setItems],
  );

  return { activeId, sensors, handleDragStart, handleDragEnd };
}

interface AccordionSearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  searchPlaceholder: string;
  visibleCount: number;
  expandedButtonClasses: string;
  onClearQuery: () => void;
}

function AccordionSearchHeader({
  query,
  onQueryChange,
  searchPlaceholder,
  visibleCount,
  expandedButtonClasses,
  onClearQuery,
}: AccordionSearchHeaderProps) {
  return (
    <>
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          data-slot="accordion-search"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Search accordion items"
          className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>
      {visibleCount === 0 && (
        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            No items match your search.
          </p>
          <button
            type="button"
            onClick={onClearQuery}
            className={cn(
              expandedButtonClasses,
              "mt-2 text-muted-foreground hover:text-foreground",
            )}
          >
            Clear search
          </button>
        </div>
      )}
    </>
  );
}

interface ExpandAllHeaderProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
  buttonClasses: string;
}

function ExpandAllHeader({
  onExpandAll,
  onCollapseAll,
  buttonClasses,
}: ExpandAllHeaderProps) {
  return (
    <div className="flex gap-2 justify-end">
      <button
        onClick={onExpandAll}
        className={buttonClasses}
        aria-label="Expand all accordion items"
      >
        {/* kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception */}
        <IconChevronsDown className="h-3.5 w-3.5" />
        Expand all
      </button>
      <button
        onClick={onCollapseAll}
        className={buttonClasses}
        aria-label="Collapse all accordion items"
      >
        {/* kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception */}
        <IconChevronsUp className="h-3.5 w-3.5" />
        Collapse all
      </button>
    </div>
  );
}

/** Controlled vs local item list, with a unified setItems updater. */
function useAccordionItems(
  initialItems: AccordionItemData[],
  onReorder?: (items: AccordionItemData[]) => void,
) {
  const controlled = Boolean(onReorder);
  const [localItems, setLocalItems] = React.useState(initialItems);
  const [adoptedItems, setAdoptedItems] = React.useState(initialItems);

  // Uncontrolled mode still honors parent-driven item updates (loading flags,
  // content, errors): when the items prop identity changes, adopt it â€”
  // render-time adjust per playbook Â§4. Internal reorder keeps the local copy.
  if (initialItems !== adoptedItems) {
    setAdoptedItems(initialItems);
    setLocalItems(initialItems);
  }

  const setItems = React.useCallback(
    (updater: React.SetStateAction<AccordionItemData[]>) => {
      if (controlled) {
        onReorder?.(applyItemsUpdater(initialItems, updater));
      } else {
        setLocalItems(updater);
      }
    },
    [controlled, initialItems, onReorder],
  );

  let items = localItems;

  if (controlled) {
    items = initialItems;
  }

  return { items, setItems };
}

/** ReplaceState the URL hash to track the last opened value (deep link). */
function syncHashToOpenValue(deepLink: boolean, value: string[]) {
  if (!deepLink || typeof window === "undefined") return;

  if (value.length > 0) {
    const lastOpened = value[value.length - 1];
    window.history.replaceState(null, "", `#${encodeURIComponent(lastOpened)}`);
  } else {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  }
}

interface AccordionDragWiring {
  activeId: string | null;
  sensors: ReturnType<typeof useSensors>;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

interface AccordionItemsRootProps {
  draggable: boolean;
  visibleItems: AccordionItemData[];
  items: AccordionItemData[];
  variant: VariantProps<typeof accordionTriggerVariants>["variant"];
  size: VariantProps<typeof accordionTriggerVariants>["size"];
  dragHandlePosition: "start" | "end";
  nested: boolean;
  onItemOpen?: (item: AccordionItemData) => void | Promise<void>;
  onItemClose?: (item: AccordionItemData) => void;
  asyncLoading: boolean;
  highlightQuery?: string;
  forceMounted: boolean;
  drag: AccordionDragWiring;
}

function AccordionItemsRoot({
  draggable,
  visibleItems,
  items,
  variant,
  size,
  dragHandlePosition,
  nested,
  onItemOpen,
  onItemClose,
  asyncLoading,
  highlightQuery,
  forceMounted,
  drag,
}: AccordionItemsRootProps) {
  if (!draggable) {
    return (
      <>
        {visibleItems.map((item) =>
          renderAccordionItem({
            item,
            defaultVariant: variant,
            defaultSize: size,
            level: 0,
            nested,
            onItemOpen,
            onItemClose,
            asyncLoading,
            highlightQuery,
            forceMounted,
          }),
        )}
      </>
    );
  }

  return renderAccordionItems({
    drag,
    visibleItems,
    variant,
    size,
    dragHandlePosition,
    nested,
    onItemOpen,
    onItemClose,
    asyncLoading,
    highlightQuery,
    forceMounted,
    items,
  });
}

/** Filter + highlight query derived from the search box state. */
function useAccordionSearch(
  searchable: boolean,
  items: AccordionItemData[],
  query: string,
) {
  const visibleItems = React.useMemo(() => {
    if (!searchable) return items;

    return filterItems(items, query);
  }, [searchable, items, query]);

  const highlightQuery = React.useMemo(() => {
    if (!searchable) return undefined;

    if (query.trim() === "") return undefined;

    return query;
  }, [searchable, query]);

  return { visibleItems, highlightQuery };
}

/** Expand/collapse-all handlers over the flattened item list. */
function useExpandCollapseAll(
  items: AccordionItemData[],
  setOpenValues: React.Dispatch<React.SetStateAction<string[]>>,
) {
  const handleExpandAll = React.useCallback(() => {
    const allValues = flattenItems(items).map((item) => item.value);
    setOpenValues(allValues);
  }, [items, setOpenValues]);

  const handleCollapseAll = React.useCallback(() => {
    setOpenValues([]);
  }, [setOpenValues]);

  return { handleExpandAll, handleCollapseAll };
}

interface KiraAccordionChromeProps {
  showExpandAll: boolean;
  searchable: boolean;
  query: string;
  searchPlaceholder: string;
  visibleCount: number;
  buttonClasses: string;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onQueryChange: (query: string) => void;
}

/** Expand/collapse + search controls rendered above the item list. */
function KiraAccordionChrome({
  showExpandAll,
  searchable,
  query,
  searchPlaceholder,
  visibleCount,
  buttonClasses,
  onExpandAll,
  onCollapseAll,
  onQueryChange,
}: KiraAccordionChromeProps) {
  let header: React.ReactNode = null;

  if (showExpandAll) {
    header = (
      <ExpandAllHeader
        onExpandAll={onExpandAll}
        onCollapseAll={onCollapseAll}
        buttonClasses={buttonClasses}
      />
    );
  }

  return (
    <>
      {header}
      {searchable && (
        <AccordionSearchHeader
          query={query}
          onQueryChange={onQueryChange}
          searchPlaceholder={searchPlaceholder}
          visibleCount={visibleCount}
          expandedButtonClasses={buttonClasses}
          onClearQuery={() => onQueryChange("")}
        />
      )}
    </>
  );
}

/** Open-set state + deep-link hash sync on every change. */
function useOpenValues(
  persistKey: string | undefined,
  deepLink: boolean,
  onValueChange?: AccordionPrimitive.Root.Props["onValueChange"],
) {
  const { openValues, setOpenValues } = usePersistedOpenValues(persistKey);

  const handleValueChange: AccordionPrimitive.Root.Props["onValueChange"] = (
    value,
    ...args
  ) => {
    // SAFETY: KiraAccordion only renders items with string values, so the
    // Base UI open set is always a string[] here.
    setOpenValues(value as string[]);
    onValueChange?.(value, ...args);

    syncHashToOpenValue(deepLink, value);
  };

  return { openValues, setOpenValues, handleValueChange };
}

interface KiraAccordionCoreProps {
  items: AccordionItemData[];
  variant?: VariantProps<typeof accordionTriggerVariants>["variant"];
  size?: VariantProps<typeof accordionTriggerVariants>["size"];
  scrollIntoView?: boolean;
  draggable?: boolean;
  onReorder?: (items: AccordionItemData[]) => void;
  asyncLoading?: boolean;
  onItemOpen?: (item: AccordionItemData) => void | Promise<void>;
  onItemClose?: (item: AccordionItemData) => void;
  nested?: boolean;
  showExpandAll?: boolean;
  dragHandlePosition?: "start" | "end";
  searchable?: boolean;
  searchPlaceholder?: string;
  persistKey?: string;
  hiddenUntilFound?: boolean;
  deepLink?: boolean;
  onValueChange?: AccordionPrimitive.Root.Props["onValueChange"];
  className?: React.ComponentProps<typeof AccordionPrimitive.Root>["className"];
}

/** Shared expand/collapse button styling; motion transitions gated by reduced motion. */
function useExpandedButtonClasses(reducedMotion: boolean): string {
  return cn(
    "inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-muted hover:bg-muted/80",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    !reducedMotion && "transition-colors",
  );
}

/** Drag wiring bundle consumed by AccordionItemsRoot. */
function useAccordionDragWiring(
  setItems: (updater: React.SetStateAction<AccordionItemData[]>) => void,
  onReorder?: (items: AccordionItemData[]) => void,
): AccordionDragWiring {
  const { activeId, sensors, handleDragStart, handleDragEnd } =
    useAccordionDrag(setItems, onReorder);

  return { activeId, sensors, handleDragStart, handleDragEnd };
}

// Core is internal; KiraAccordion applies the public defaults, but the shared
// item renderers below require booleans, so normalize undefined once here.
const CORE_DEFAULTS = {
  variant: "default",
  size: "default",
  scrollIntoView: false,
  draggable: false,
  asyncLoading: false,
  nested: false,
  showExpandAll: false,
  dragHandlePosition: "start",
  searchable: false,
  searchPlaceholder: "Searchâ€¦",
  hiddenUntilFound: false,
  deepLink: false,
} as const;

function KiraAccordionCore({
  items: initialItems,
  onReorder,
  onItemOpen,
  onItemClose,
  persistKey,
  onValueChange,
  className,
  ...props
}: Omit<KiraAccordionCoreProps, "reducedMotion">) {
  const {
    variant,
    size,
    scrollIntoView,
    draggable,
    asyncLoading,
    nested,
    showExpandAll,
    dragHandlePosition,
    searchable,
    searchPlaceholder,
    hiddenUntilFound,
    deepLink,
  } = { ...CORE_DEFAULTS, ...props };

  const reducedMotion = useReducedMotion();
  const { items, setItems } = useAccordionItems(initialItems, onReorder);

  const [query, setQuery] = React.useState("");

  const { openValues, setOpenValues, handleValueChange } = useOpenValues(
    persistKey,
    deepLink,
    onValueChange,
  );

  useHashDeepLink(deepLink, initialItems, reducedMotion, setOpenValues);

  const { visibleItems, highlightQuery } = useAccordionSearch(
    searchable,
    items,
    query,
  );

  // Find-in-page needs the content mounted; lazyMount would unmount exactly
  // what the browser is looking for, so it is ignored while the feature is on.
  const forceMounted = hiddenUntilFound;

  const drag = useAccordionDragWiring(setItems, onReorder);

  const { handleExpandAll, handleCollapseAll } = useExpandCollapseAll(
    items,
    setOpenValues,
  );

  const expandedButtonClasses = useExpandedButtonClasses(reducedMotion);

  return renderKiraAccordion({
    showExpandAll,
    searchable,
    query,
    searchPlaceholder,
    visibleItems,
    expandedButtonClasses,
    handleExpandAll,
    handleCollapseAll,
    setQuery,
    scrollIntoView,
    className,
    openValues,
    handleValueChange,
    hiddenUntilFound,
    props,
    draggable,
    items,
    variant,
    size,
    dragHandlePosition,
    nested,
    onItemOpen,
    onItemClose,
    asyncLoading,
    highlightQuery,
    forceMounted,
    drag,
  });
}

function KiraAccordion(input: KiraAccordionProps) {
  const {
    items,
    draggable,
    asyncLoading,
    nested,
    showExpandAll,
    searchable,
    deepLink,
    ...props
  } = resolveComponentDefaults(input, KIRA_ACCORDION_DEFAULTS_3);

  return (
    <KiraAccordionCore
      items={items}
      draggable={draggable}
      asyncLoading={asyncLoading}
      nested={nested}
      showExpandAll={showExpandAll}
      searchable={searchable}
      deepLink={deepLink}
      {...props}
    />
  );
}

interface RenderAccordionItemOptions {
  item: AccordionItemData;
  defaultVariant: VariantProps<typeof accordionTriggerVariants>["variant"];
  defaultSize: VariantProps<typeof accordionTriggerVariants>["size"];
  level: number;
  nested: boolean;
  onItemOpen?: (item: AccordionItemData) => void | Promise<void>;
  onItemClose?: (item: AccordionItemData) => void;
  asyncLoading: boolean;
  highlightQuery?: string;
  forceMounted: boolean;
}

function DragOverlayItem({
  item,
  variant,
  size,
}: {
  item: AccordionItemData;
  variant: VariantProps<typeof accordionTriggerVariants>["variant"];
  size: VariantProps<typeof accordionTriggerVariants>["size"];
}) {
  return (
    <AccordionItem value={item.value} disabled={item.disabled}>
      <AccordionTrigger
        variant={item.variant ?? variant}
        size={item.size ?? size}
        icon={item.icon}
        showArrow={item.showArrow ?? true}
        chevronIcon={item.chevronIcon}
        chevronPosition={item.chevronPosition ?? "end"}
      >
        {item.title}
      </AccordionTrigger>
    </AccordionItem>
  );
}

function applyItemsUpdater(
  initialItems: AccordionItemData[],
  updater: React.SetStateAction<AccordionItemData[]>,
): AccordionItemData[] {
  if (Array.isArray(updater)) {
    return updater;
  }

  // SAFETY: SetStateAction<AccordionItemData[]> minus the array branch is
  // exactly (prev: AccordionItemData[]) => AccordionItemData[].
  return (updater as (prev: AccordionItemData[]) => AccordionItemData[])(
    initialItems,
  );
}

function DragOverlayContent({
  activeId,
  items,
  variant,
  size,
}: {
  activeId: string | null;
  items: AccordionItemData[];
  variant: VariantProps<typeof accordionTriggerVariants>["variant"];
  size: VariantProps<typeof accordionTriggerVariants>["size"];
}) {
  if (!activeId) return null;

  const item = flattenItems(items).find((i) => i.value === activeId);

  if (!item) return null;

  return (
    <div className="opacity-50">
      <DragOverlayItem item={item} variant={variant} size={size} />
    </div>
  );
}

function renderAccordionItem({
  item,
  defaultVariant,
  defaultSize,
  level,
  nested,
  onItemOpen,
  onItemClose,
  asyncLoading,
  highlightQuery,
  forceMounted,
}: RenderAccordionItemOptions): React.ReactElement {
  const hasChildren = nested && item.children && item.children.length > 0;

  const handleOpen = makeItemOpenHandler(item, asyncLoading, onItemOpen);

  const handleClose = () => {
    onItemClose?.(item);
  };

  const titleContent = resolveTitleContent(item, highlightQuery);

  let nestedChildren: React.ReactNode = null;

  if (hasChildren) {
    nestedChildren = (
      <div className={cn("mt-2 space-y-1", level > 0 && "ml-4")}>
        {item.children?.map((child) =>
          renderAccordionItem({
            item: child,
            defaultVariant,
            defaultSize,
            level: level + 1,
            nested,
            onItemOpen,
            onItemClose,
            asyncLoading,
            highlightQuery,
            forceMounted,
          }),
        )}
      </div>
    );
  }

  return (
    <AccordionItem
      key={item.value}
      value={item.value}
      disabled={item.disabled}
      onOpen={handleOpen}
      onClose={handleClose}
    >
      <AccordionTrigger
        {...triggerVariantProps(item, defaultVariant, defaultSize)}
      >
        {titleContent}
      </AccordionTrigger>
      <AccordionContent
        size={item.size ?? defaultSize}
        inset={item.inset ?? level > 0}
        lazyMount={item.lazyMount}
        forceMounted={forceMounted}
        showSkeleton={item.showSkeleton}
        skeletonLines={item.skeletonLines}
        loading={item.loading}
        error={item.error}
        onRetry={item.onRetry}
      >
        {item.content}
        {nestedChildren}
      </AccordionContent>
    </AccordionItem>
  );
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  KiraAccordion,
  accordionTriggerVariants,
  accordionContentVariants,
};

export type {
  AccordionItemData,
  AccordionTriggerProps,
  AccordionContentProps,
  KiraAccordionProps,
};

function renderAccordionItems({
  drag,
  visibleItems,
  variant,
  size,
  dragHandlePosition,
  nested,
  onItemOpen,
  onItemClose,
  asyncLoading,
  highlightQuery,
  forceMounted,
  items,
}: {
  drag: AccordionDragWiring;
  visibleItems: AccordionItemData[];
  variant:
    | "default"
    | "info"
    | "success"
    | "warning"
    | "destructive"
    | "ghost"
    | "outline"
    | null
    | undefined;
  size: "default" | "xs" | "sm" | "lg" | null | undefined;
  dragHandlePosition: "start" | "end";
  nested: boolean;
  onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
  onItemClose: ((item: AccordionItemData) => void) | undefined;
  asyncLoading: boolean;
  highlightQuery: string | undefined;
  forceMounted: boolean;
  items: AccordionItemData[];
}) {
  return renderRenderAccordionItemsSectionPart2({
    drag,
    visibleItems,
    variant,
    size,
    dragHandlePosition,
    nested,
    onItemOpen,
    onItemClose,
    asyncLoading,
    highlightQuery,
    forceMounted,
    items,
  });
}

function renderKiraAccordion(
  args: Parameters<typeof renderKiraAccordionPart3>[0],
) {
  return renderKiraAccordionPart3(args);
}

type renderAccordionHeaderPart1Args = {
  variant: AccordionTriggerProps["variant"];
  size: AccordionTriggerProps["size"];
  className: AccordionTriggerProps["className"];
  handlePadding: ReturnType<typeof dragHandlePadding>;
  props: Omit<
    AccordionTriggerProps,
    | "className"
    | "children"
    | "variant"
    | "size"
    | "showArrow"
    | "chevronIcon"
    | "chevronPosition"
    | "icon"
    | "loading"
    | "error"
    | "onRetry"
    | "dragHandle"
    | "dragHandlePosition"
    | "disabled"
    | "disabledReason"
  >;
  dragHandle: AccordionTriggerProps["dragHandle"];
  dragHandlePosition: "start" | "end";
  chevronIcon: AccordionTriggerProps["chevronIcon"];
  chevronPosition: "start" | "end";
  showArrow: boolean;
  reducedMotion: ReturnType<typeof useReducedMotion>;
  icon: AccordionTriggerProps["icon"];
  children: AccordionTriggerProps["children"];
  loading: boolean;
  showSuccess: ReturnType<typeof useLoadingSuccessFlash>;
  error: Error | null;
  onRetry: AccordionTriggerProps["onRetry"];
};

function renderAccordionHeaderPart1({
  variant,
  size,
  className,
  handlePadding,
  props,
  dragHandle,
  dragHandlePosition,
  chevronIcon,
  chevronPosition,
  showArrow,
  reducedMotion,
  icon,
  children,
  loading,
  showSuccess,
  error,
  onRetry,
}: renderAccordionHeaderPart1Args) {
  return (
    <AccordionPrimitive.Header data-slot="accordion-header">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          accordionTriggerVariants({ variant, size, className }),
          handlePadding,
        )}
        {...props}
      >
        <span className="flex items-center gap-2 flex-1 min-w-0">
          <TriggerDragHandleSlot
            handle={dragHandle}
            position={dragHandlePosition}
            side="start"
          />
          <TriggerChevron
            icon={chevronIcon}
            position={chevronPosition}
            side="start"
            show={showArrow}
            reducedMotion={reducedMotion}
          />
          <TriggerIcon icon={icon} />
          <span className="flex-1 min-w-0 truncate">{children}</span>
          <TriggerLoading loading={loading} reducedMotion={reducedMotion} />
          <TriggerSuccess active={showSuccess} />
          <TriggerRetry error={error} loading={loading} onRetry={onRetry} />
          <TriggerChevron
            icon={chevronIcon}
            position={chevronPosition}
            side="end"
            show={showArrow}
            reducedMotion={reducedMotion}
          />
          <TriggerDragHandleSlot
            handle={dragHandle}
            position={dragHandlePosition}
            side="end"
          />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

type renderRenderAccordionItemsSectionPart2Args = {
  drag: {
    drag: AccordionDragWiring;
    visibleItems: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null
      | undefined;
    size: "default" | "xs" | "sm" | "lg" | null | undefined;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    items: AccordionItemData[];
  }["drag"];
  visibleItems: {
    drag: AccordionDragWiring;
    visibleItems: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null
      | undefined;
    size: "default" | "xs" | "sm" | "lg" | null | undefined;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    items: AccordionItemData[];
  }["visibleItems"];
  variant: {
    drag: AccordionDragWiring;
    visibleItems: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null
      | undefined;
    size: "default" | "xs" | "sm" | "lg" | null | undefined;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    items: AccordionItemData[];
  }["variant"];
  size: {
    drag: AccordionDragWiring;
    visibleItems: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null
      | undefined;
    size: "default" | "xs" | "sm" | "lg" | null | undefined;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    items: AccordionItemData[];
  }["size"];
  dragHandlePosition: {
    drag: AccordionDragWiring;
    visibleItems: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null
      | undefined;
    size: "default" | "xs" | "sm" | "lg" | null | undefined;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    items: AccordionItemData[];
  }["dragHandlePosition"];
  nested: {
    drag: AccordionDragWiring;
    visibleItems: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null
      | undefined;
    size: "default" | "xs" | "sm" | "lg" | null | undefined;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    items: AccordionItemData[];
  }["nested"];
  onItemOpen: {
    drag: AccordionDragWiring;
    visibleItems: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null
      | undefined;
    size: "default" | "xs" | "sm" | "lg" | null | undefined;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    items: AccordionItemData[];
  }["onItemOpen"];
  onItemClose: {
    drag: AccordionDragWiring;
    visibleItems: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null
      | undefined;
    size: "default" | "xs" | "sm" | "lg" | null | undefined;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    items: AccordionItemData[];
  }["onItemClose"];
  asyncLoading: {
    drag: AccordionDragWiring;
    visibleItems: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null
      | undefined;
    size: "default" | "xs" | "sm" | "lg" | null | undefined;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    items: AccordionItemData[];
  }["asyncLoading"];
  highlightQuery: {
    drag: AccordionDragWiring;
    visibleItems: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null
      | undefined;
    size: "default" | "xs" | "sm" | "lg" | null | undefined;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    items: AccordionItemData[];
  }["highlightQuery"];
  forceMounted: {
    drag: AccordionDragWiring;
    visibleItems: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null
      | undefined;
    size: "default" | "xs" | "sm" | "lg" | null | undefined;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    items: AccordionItemData[];
  }["forceMounted"];
  items: {
    drag: AccordionDragWiring;
    visibleItems: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null
      | undefined;
    size: "default" | "xs" | "sm" | "lg" | null | undefined;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    items: AccordionItemData[];
  }["items"];
};

function renderRenderAccordionItemsSectionPart2({
  drag,
  visibleItems,
  variant,
  size,
  dragHandlePosition,
  nested,
  onItemOpen,
  onItemClose,
  asyncLoading,
  highlightQuery,
  forceMounted,
  items,
}: renderRenderAccordionItemsSectionPart2Args) {
  return (
    <DndContext
      sensors={drag.sensors}
      collisionDetection={closestCenter}
      onDragStart={drag.handleDragStart}
      onDragEnd={drag.handleDragEnd}
    >
      <SortableContext
        items={visibleItems.map((item) => item.value)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1">
          {visibleItems.map((item) => (
            <SortableAccordionItem
              key={item.value}
              item={item}
              defaultVariant={variant}
              defaultSize={size}
              level={0}
              dragHandlePosition={dragHandlePosition}
              nested={nested}
              onItemOpen={onItemOpen}
              onItemClose={onItemClose}
              asyncLoading={asyncLoading}
              highlightQuery={highlightQuery}
              forceMounted={forceMounted}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: "0.5" } },
          }),
        }}
      >
        <DragOverlayContent
          activeId={drag.activeId}
          items={items}
          variant={variant}
          size={size}
        />
      </DragOverlay>
    </DndContext>
  );
}

type renderKiraAccordionPart3Args = {
  showExpandAll: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["showExpandAll"];
  searchable: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["searchable"];
  query: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["query"];
  searchPlaceholder: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["searchPlaceholder"];
  visibleItems: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["visibleItems"];
  expandedButtonClasses: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["expandedButtonClasses"];
  handleExpandAll: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["handleExpandAll"];
  handleCollapseAll: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["handleCollapseAll"];
  setQuery: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["setQuery"];
  scrollIntoView: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["scrollIntoView"];
  className: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["className"];
  openValues: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["openValues"];
  handleValueChange: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["handleValueChange"];
  hiddenUntilFound: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["hiddenUntilFound"];
  props: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["props"];
  draggable: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["draggable"];
  items: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["items"];
  variant: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["variant"];
  size: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["size"];
  dragHandlePosition: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["dragHandlePosition"];
  nested: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["nested"];
  onItemOpen: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["onItemOpen"];
  onItemClose: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["onItemClose"];
  asyncLoading: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["asyncLoading"];
  highlightQuery: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["highlightQuery"];
  forceMounted: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["forceMounted"];
  drag: {
    showExpandAll: boolean;
    searchable: boolean;
    query: string;
    searchPlaceholder: string;
    visibleItems: AccordionItemData[];
    expandedButtonClasses: string;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    scrollIntoView: boolean;
    className:
      | string
      | ((state: AccordionPrimitive.Root.State<unknown>) => string | undefined)
      | undefined;
    openValues: string[];
    handleValueChange: NonNullable<
      React.ComponentProps<typeof Accordion>["onValueChange"]
    >;
    hiddenUntilFound: boolean;
    props: {
      variant?:
        | "default"
        | "info"
        | "success"
        | "warning"
        | "destructive"
        | "ghost"
        | "outline"
        | null
        | undefined;
      size?: "default" | "xs" | "sm" | "lg" | null | undefined;
      scrollIntoView?: boolean | undefined;
      draggable?: boolean | undefined;
      asyncLoading?: boolean | undefined;
      nested?: boolean | undefined;
      showExpandAll?: boolean | undefined;
      dragHandlePosition?: "start" | "end" | undefined;
      searchable?: boolean | undefined;
      searchPlaceholder?: string | undefined;
      hiddenUntilFound?: boolean | undefined;
      deepLink?: boolean | undefined;
    };
    draggable: boolean;
    items: AccordionItemData[];
    variant:
      | "default"
      | "info"
      | "success"
      | "warning"
      | "destructive"
      | "ghost"
      | "outline"
      | null;
    size: "default" | "xs" | "sm" | "lg" | null;
    dragHandlePosition: "start" | "end";
    nested: boolean;
    onItemOpen: ((item: AccordionItemData) => void | Promise<void>) | undefined;
    onItemClose: ((item: AccordionItemData) => void) | undefined;
    asyncLoading: boolean;
    highlightQuery: string | undefined;
    forceMounted: boolean;
    drag: AccordionDragWiring;
  }["drag"];
};

function renderKiraAccordionPart3({
  showExpandAll,
  searchable,
  query,
  searchPlaceholder,
  visibleItems,
  expandedButtonClasses,
  handleExpandAll,
  handleCollapseAll,
  setQuery,
  scrollIntoView,
  className,
  openValues,
  handleValueChange,
  hiddenUntilFound,
  props,
  draggable,
  items,
  variant,
  size,
  dragHandlePosition,
  nested,
  onItemOpen,
  onItemClose,
  asyncLoading,
  highlightQuery,
  forceMounted,
  drag,
}: renderKiraAccordionPart3Args) {
  return (
    <div data-slot="kira-accordion" className="space-y-2">
      <KiraAccordionChrome
        showExpandAll={showExpandAll}
        searchable={searchable}
        query={query}
        searchPlaceholder={searchPlaceholder}
        visibleCount={visibleItems.length}
        buttonClasses={expandedButtonClasses}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onQueryChange={setQuery}
      />
      <Accordion
        scrollIntoView={scrollIntoView}
        className={className}
        value={openValues}
        onValueChange={handleValueChange}
        hiddenUntilFound={hiddenUntilFound}
        {...props}
      >
        <AccordionItemsRoot
          draggable={draggable}
          visibleItems={visibleItems}
          items={items}
          variant={variant}
          size={size}
          dragHandlePosition={dragHandlePosition}
          nested={nested}
          onItemOpen={onItemOpen}
          onItemClose={onItemClose}
          asyncLoading={asyncLoading}
          highlightQuery={highlightQuery}
          forceMounted={forceMounted}
          drag={drag}
        />
      </Accordion>
    </div>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const ACCORDION_TRIGGER_DEFAULTS_1 = {
  showArrow: true,
  chevronPosition: "end",
  loading: false,
  error: null,
  dragHandlePosition: "start",
  disabled: false,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const ACCORDION_CONTENT_DEFAULTS_2 = {
  inset: false,
  lazyMount: false,
  forceMounted: false,
  showSkeleton: false,
  skeletonLines: 3,
  loading: false,
  error: null,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const KIRA_ACCORDION_DEFAULTS_3 = {
  draggable: false,
  asyncLoading: false,
  nested: false,
  showExpandAll: false,
  searchable: false,
  deepLink: false,
} as const;
