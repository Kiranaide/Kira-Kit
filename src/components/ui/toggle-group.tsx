"use client";

import * as React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva, type VariantProps } from "class-variance-authority";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toast";

const toggleGroupVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      default: "gap-1",
      outline: "gap-0 rounded-lg border border-input",
      segment: "gap-0 rounded-lg bg-muted p-1",
      pills: "gap-2",
    },
    orientation: {
      horizontal: "flex-row",
      // Cross axis is horizontal in a column, so the base `items-center` shrinks
      // each item to its own text width — a short label's hover fill then can't
      // span the column. `items-stretch` makes every item fill the column width
      // so hover/pressed covers the full tab; the item's own `justify-center`
      // keeps the label centred. Applies to all vertical variants.
      vertical: "flex-col items-stretch",
    },
    /**
     * Tight-width behaviour. Segments must never wrap (Michelin), so the
     * options are: keep them on one line and scroll, or drop the labels.
     */
    overflowMode: {
      none: "",
      scroll:
        "max-w-full flex-nowrap overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      hideLabels: "flex-nowrap",
    },
    size: {
      sm: "",
      default: "",
      lg: "",
    },
    shape: {
      default: "",
      pill: "rounded-full",
    },
  },
  compoundVariants: [
    {
      orientation: "vertical",
      variant: "outline",
      className: "rounded-lg",
    },
  ],
  defaultVariants: {
    variant: "default",
    orientation: "horizontal",
    size: "default",
    shape: "default",
    overflowMode: "none",
  },
});

const toggleGroupItemVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 text-sm font-medium transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "rounded-md hover:bg-accent hover:text-accent-foreground data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
        outline: [
          "border-r last:border-r-0 first:rounded-l-lg last:rounded-r-lg",
          "hover:bg-accent hover:text-accent-foreground",
          "data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
        ],
        segment: [
          "rounded-md",
          "hover:text-foreground",
          "data-[pressed]:bg-background data-[pressed]:text-foreground data-[pressed]:shadow-sm",
        ],
        pills: [
          "rounded-full border border-transparent",
          "hover:bg-accent hover:text-accent-foreground",
          "data-[pressed]:border-primary data-[pressed]:bg-primary/10 data-[pressed]:text-primary",
        ],
      },
      size: {
        sm: "h-7 px-2 text-xs [&_svg]:h-3.5 [&_svg]:w-3.5",
        default: "h-9 px-3 [&_svg]:h-4 [&_svg]:w-4",
        lg: "h-10 px-4 text-base [&_svg]:h-5 [&_svg]:w-5",
      },
      colorVariant: {
        default: "",
        success:
          "data-[pressed]:bg-success data-[pressed]:text-success-foreground",
        warning:
          "data-[pressed]:bg-warning data-[pressed]:text-warning-foreground",
        destructive:
          "data-[pressed]:bg-destructive data-[pressed]:text-destructive-foreground",
      },
      shape: {
        default: "",
        pill: "rounded-full first:rounded-l-full last:rounded-r-full",
      },
      /**
       * When a sliding indicator owns the selected fill, the item drops its own
       * pressed background so the two treatments don't stack. Weight + text
       * colour still change, so selection is never signalled by colour alone.
       */
      slide: {
        true: "data-[pressed]:bg-transparent data-[pressed]:shadow-none data-[pressed]:font-semibold data-[pressed]:text-foreground",
        false: "",
      },
      /** Icon-only collapse for tight widths (Primer's `hideLabels`). */
      hideLabel: {
        true: "gap-0 px-0 aspect-square",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "outline",
        className:
          "data-[orientation=vertical]:border-r-0 data-[orientation=vertical]:border-b data-[orientation=vertical]:last:border-b-0 data-[orientation=vertical]:first:rounded-t-lg data-[orientation=vertical]:first:rounded-bl-none data-[orientation=vertical]:last:rounded-b-lg data-[orientation=vertical]:last:rounded-tr-none",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      colorVariant: "default",
      shape: "default",
      slide: false,
      hideLabel: false,
    },
  }
);

/**
 * The three documented segmented-control semantics — 2026 practice genuinely
 * splits, so this is a prop rather than a hidden decision:
 *
 * - `"current"` — Primer/eBay: `aria-current="true"` on the active segment.
 * - `"radio"` — ARIA17-normative for single-select: `role="radiogroup"` +
 *   `role="radio"`/`aria-checked`, one Tab stop, arrow keys move *and* select.
 * - `"toggle"` — Base UI's default: independent `aria-pressed` buttons.
 */
type ToggleGroupSemantics = "current" | "radio" | "toggle";

/**
 * The 2–5 segment cap is near-universal (Material 3, Primer, Michelin; VA says
 * 2–4). Past it, use chips or a select instead.
 */
const MAX_SEGMENTS = 5;

type ToggleGroupContextValue = {
  variant: VariantProps<typeof toggleGroupVariants>["variant"];
  size: VariantProps<typeof toggleGroupVariants>["size"];
  orientation: VariantProps<typeof toggleGroupVariants>["orientation"];
  shape: VariantProps<typeof toggleGroupVariants>["shape"];
  disabled?: boolean;
  /** True when the group renders a sliding indicator behind the active item. */
  slide: boolean;
  /**
   * `"current"` → `aria-current`; `"radio"` → `role="radio"` + `aria-checked`;
   * `"toggle"` → `aria-pressed`.
   */
  semantics: ToggleGroupSemantics;
  /** Render `IconCheck` on the selected item (Material 3's default affordance). */
  showSelectedIcon: boolean;
  /** Collapse items to icon-only. */
  hideLabels: boolean;
  /** Values currently selected — items read this for `aria-current`. */
  value: readonly string[];
  /**
   * Commits a value directly, bypassing the toggle-off path. Radio mode uses
   * this for selection-follows-focus, where arrowing to a segment selects it.
   */
  selectValue: (value: string, event: Event, trigger?: HTMLElement) => void;
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  variant: "default",
  size: "default",
  orientation: "horizontal",
  shape: "default",
  disabled: false,
  slide: false,
  semantics: "toggle",
  showSelectedIcon: false,
  hideLabels: false,
  value: [],
  selectValue: () => {},
});

type ToggleGroupChangeDetails = Parameters<
  NonNullable<ToggleGroupPrimitive.Props["onValueChange"]>
>[1];

/**
 * Base UI only exposes a *toggle* path for group values, and its event-details
 * factory is an internal export we can't import (a registry consumer copies
 * this file alone). Radio mode's selection-follows-focus needs to set a value
 * outright, so it hands `onValueChange` a details object of the same shape.
 */
function createSelectDetails(
  event: Event,
  trigger?: HTMLElement
): ToggleGroupChangeDetails {
  let canceled = false;
  let propagationAllowed = false;

  return {
    reason: "none",
    event,
    trigger,
    cancel() {
      canceled = true;
    },
    allowPropagation() {
      propagationAllowed = true;
    },
    get isCanceled() {
      return canceled;
    },
    get isPropagationAllowed() {
      return propagationAllowed;
    },
  } as ToggleGroupChangeDetails;
}

const ICON_ONLY_HINT =
  "renders an icon-only item without a text label. Pass an `aria-label` (or `tooltip`) so assistive technology can announce it.";

/** Dev-only accessible-name check, run in an effect so render stays pure. */
function useAriaLabelWarning(
  componentName: string,
  { ariaLabel, children }: { ariaLabel?: string; children?: React.ReactNode }
) {
  const hasText = typeof children === "string" && children.trim().length > 0;

  React.useEffect(() => {
    if (!import.meta.env?.DEV) return;

    if (ariaLabel) return;

    if (componentName === "ToggleGroup") {
      console.warn(
        "[kira-kit] <ToggleGroup> has no `aria-label`. Screen readers announce the group without a purpose."
      );

      return;
    }

    if (!hasText) {
      console.warn(`[kira-kit] <${componentName}> ${ICON_ONLY_HINT}`);
    }
  }, [componentName, ariaLabel, hasText]);
}

/** Dev-only nudge when a segmented control exceeds the 2–5 segment consensus. */
function useSegmentCapWarning(
  variant: ToggleGroupProps["variant"],
  count: number
) {
  React.useEffect(() => {
    if (!import.meta.env?.DEV) return;

    if (variant !== "segment") return;

    if (count <= MAX_SEGMENTS) return;
    console.warn(
      `[kira-kit] <ToggleGroup variant="segment"> has ${count} segments. ` +
        `Segmented controls read best with 2–${MAX_SEGMENTS}; past that use chips or a select.`
    );
  }, [variant, count]);
}

/**
 * Sliding pill behind the active item — the defining 2026 segmented-control
 * affordance. Position is measured from the pressed item rather than guessed
 * from an index, so it survives per-item width differences and wrapping.
 */
function ToggleGroupIndicator({
  containerRef,
  activeKey,
  orientation,
  shape,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  activeKey: string;
  orientation: "horizontal" | "vertical";
  shape: "default" | "pill";
}) {
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  // Nothing to slide to until the first pressed item is measured.
  const hasPositioned = React.useRef(false);

  useGSAP(
    () => {
      const container = containerRef.current;
      const indicator = indicatorRef.current;

      if (!container || !indicator) return;

      const active = container.querySelector<HTMLElement>(
        '[data-slot="toggle-group-item"][data-pressed]'
      );

      if (!active) {
        gsap.set(indicator, { autoAlpha: 0 });
        hasPositioned.current = false;

        return;
      }

      const box = active.getBoundingClientRect();
      const parent = container.getBoundingClientRect();

      const next = {
        x: box.left - parent.left,
        y: box.top - parent.top,
        width: box.width,
        height: box.height,
        autoAlpha: 1,
      };

      // Jump into place the first time (and whenever motion is reduced);
      // slide only for subsequent selection changes.
      if (!hasPositioned.current || reducedMotion) {
        hasPositioned.current = true;
        gsap.set(indicator, next);

        return;
      }

      gsap.to(indicator, {
        ...next,
        duration: 0.25,
        ease: "power3.out",
      });
    },
    { dependencies: [activeKey, orientation, reducedMotion], scope: containerRef }
  );

  return (
    <span
      ref={indicatorRef}
      data-slot="toggle-group-indicator"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-0 top-0 z-0 bg-background shadow-sm",
        shape === "pill" ? "rounded-full" : "rounded-md"
      )}
      style={{ opacity: 0 }}
    />
  );
}

interface ToggleGroupProps
  extends
    Omit<ToggleGroupPrimitive.Props, "children" | "orientation">,
    VariantProps<typeof toggleGroupVariants> {
  "aria-label": string;
  multiple?: boolean;
  loopFocus?: boolean;
  /**
   * Animate a sliding pill behind the active item. Single-selection only —
   * a multi-select group has no single "active" item to slide to.
   */
  slidingIndicator?: boolean;
  /**
   * ARIA model for single-select groups. There is no single 2026 standard:
   *
   * - `"current"` (default) follows Primer/eBay — `aria-current="true"` on the
   *   active segment, conveying "one of a set is active".
   * - `"radio"` is ARIA17-normative for a mutually-exclusive set:
   *   `role="radiogroup"` on the container, `role="radio"` + `aria-checked` on
   *   items, one Tab stop, and arrow keys that move focus *and* selection.
   *   Use it when the group is a real form field.
   * - `"toggle"` keeps Base UI's `aria-pressed` on/off buttons.
   *
   * Multi-select groups are always `"toggle"` (a formatting bar of independent
   * toggles is `aria-pressed` per the APG), so this prop is ignored when
   * `multiple` is set.
   */
  semantics?: ToggleGroupSemantics;
  /**
   * Allow the last selected item to be deselected. Single-select segmented
   * controls keep one item selected always (Material 3, Apple HIG, eBay, VA),
   * so deselection is vetoed by default; opt out for filter-style groups.
   * Ignored under `semantics="radio"` — a radio group has no "none" state.
   */
  allowEmpty?: boolean;
  /** Render `IconCheck` on the selected item — Material 3's default affordance. */
  showSelectedIcon?: boolean;
  /** Marks the group required, forwarding `aria-required`. */
  required?: boolean;
  /**
   * Marks the group invalid. Per ARIA21, set this only *after* validation has
   * run — not on mount.
   */
  invalid?: boolean;
  /** Error text rendered below the group and linked via `aria-describedby`. */
  errorMessage?: React.ReactNode;
  /**
   * Submits with the enclosing `<form>`: one hidden input per selected value,
   * matching native checkbox/radio behaviour, so `formData.getAll(name)`
   * returns each value as its own entry. An empty selection emits no input at
   * all (absent key, not an empty string).
   *
   * Note `required` is `aria-required` only — browsers skip native validation
   * on hidden inputs, so enforce it in your own submit handler.
   */
  name?: string;
  children: React.ReactNode;
}

interface ToggleGroupItemProps
  extends
    Omit<TogglePrimitive.Props, "children">,
    Omit<
      VariantProps<typeof toggleGroupItemVariants>,
      "variant" | "shape" | "slide"
    > {
  value: string;
  colorVariant?: VariantProps<typeof toggleGroupItemVariants>["colorVariant"];
  loading?: boolean;
  /** Tooltip content — the accessible companion to icon-only dense items. */
  tooltip?: React.ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  /** Tooltip shown only while this item is disabled, explaining why. */
  disabledReason?: React.ReactNode;
  children?: React.ReactNode;
  "aria-label"?: string;
}

function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  orientation = "horizontal",
  shape = "default",
  multiple = false,
  loopFocus = true,
  slidingIndicator = false,
  overflowMode = "none",
  semantics = "current",
  allowEmpty = false,
  showSelectedIcon = false,
  required = false,
  invalid = false,
  errorMessage,
  name,
  disabled,
  value,
  defaultValue,
  onValueChange,
  children,
  ...props
}: ToggleGroupProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const errorId = `${React.useId()}-error`;

  useAriaLabelWarning("ToggleGroup", { ariaLabel: props["aria-label"] });
  useSegmentCapWarning(variant, React.Children.count(children));

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = React.useState<readonly string[]>(
    defaultValue ?? []
  );

  const resolvedValue = isControlled ? value : internalValue;

  // A multi-select group has no single active item, so the pill is off there.
  const slide = slidingIndicator && !multiple;
  // A formatting bar of independent toggles is `aria-pressed` per the APG;
  // only mutually-exclusive segments get the `aria-current`/radio set models.
  const resolvedSemantics: ToggleGroupSemantics = multiple ? "toggle" : semantics;
  const isRadio = resolvedSemantics === "radio";
  // A radio group has no "none" state, so it never honours `allowEmpty`.
  const canEmpty = allowEmpty && !isRadio;
  const hideLabels = overflowMode === "hideLabels";

  const handleValueChange: NonNullable<
    ToggleGroupPrimitive.Props["onValueChange"]
  > = (next, eventDetails) => {
    // One-selected-always: in single-select, pressing the active item would
    // clear the group (Base UI yields `[]`). Veto it so selection can only
    // move, never empty.
    if (!multiple && !canEmpty && next.length === 0) {
      eventDetails.cancel();

      return;
    }

    if (!isControlled) setInternalValue(next);
    onValueChange?.(next, eventDetails);
  };

  // Radio mode's selection-follows-focus needs to *set* a value, not toggle it.
  // Base UI only exposes the toggle path, so this drives the same commit with a
  // details object carrying the originating event.
  const selectValue = React.useCallback(
    (next: string, event: Event, trigger?: HTMLElement) => {
      const details = createSelectDetails(event, trigger);
      onValueChange?.([next], details);

      if (details.isCanceled) return;

      if (!isControlled) setInternalValue([next]);
    },
    [isControlled, onValueChange]
  );

  const contextValue = React.useMemo<ToggleGroupContextValue>(
    () => ({
      variant,
      size,
      orientation,
      shape,
      disabled,
      slide,
      semantics: resolvedSemantics,
      showSelectedIcon,
      hideLabels,
      value: resolvedValue,
      selectValue,
    }),
    [
      variant,
      size,
      orientation,
      shape,
      disabled,
      slide,
      resolvedSemantics,
      showSelectedIcon,
      hideLabels,
      resolvedValue,
      selectValue,
    ]
  );

  const describedBy =
    [props["aria-describedby"], invalid && errorMessage ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const group = (
    <ToggleGroupContext.Provider value={contextValue}>
      <ToggleGroupPrimitive
        ref={containerRef}
        data-slot="toggle-group"
        data-orientation={orientation}
        // ARIA17: "For a group of radio buttons, one should use
        // `role="radiogroup"` instead of `role="group"`." Base UI hard-codes
        // `role="group"`; `render`'s props merge last, so this overrides it.
        render={
          isRadio ? <div role="radiogroup" /> : undefined
        }
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        className={cn(
          toggleGroupVariants({ variant, orientation, shape, overflowMode }),
          slide && "relative isolate",
          className
        )}
        multiple={multiple}
        loopFocus={loopFocus}
        disabled={disabled}
        orientation={orientation ?? "horizontal"}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        {...props}
        aria-describedby={describedBy}
      >
        {/*
          One input per selected value, so `formData.getAll(name)` yields each
          value separately. Single-select simply produces one (or none), so
          there's no `multiple` branch to keep in sync. Driven by
          `resolvedValue`, the same source the items and indicator read, so
          controlled and uncontrolled modes stay consistent by construction.
        */}
        {name &&
          resolvedValue.map((selected) => (
            <input
              key={selected}
              type="hidden"
              name={name}
              value={selected}
              data-slot="toggle-group-input"
            />
          ))}
        {slide && (
          <ToggleGroupIndicator
            containerRef={containerRef}
            activeKey={resolvedValue.join("|")}
            orientation={orientation ?? "horizontal"}
            shape={shape ?? "default"}
          />
        )}
        {children}
      </ToggleGroupPrimitive>
    </ToggleGroupContext.Provider>
  );

  if (!invalid || !errorMessage) return group;

  return (
    <div data-slot="toggle-group-wrapper" className="space-y-1.5">
      {group}
      <span
        id={errorId}
        data-slot="toggle-group-error"
        className="block text-xs text-destructive"
      >
        {errorMessage}
      </span>
    </div>
  );
}

function ToggleGroupItem({
  className,
  value,
  size,
  colorVariant = "default",
  loading = false,
  tooltip,
  tooltipSide = "top",
  disabledReason,
  disabled,
  children,
  onPressedChange,
  ...props
}: ToggleGroupItemProps) {
  const itemRef = React.useRef<HTMLButtonElement>(null);
  const context = React.useContext(ToggleGroupContext);
  const reducedMotion = useReducedMotion();

  const resolvedSize = size ?? context.size ?? "default";
  const resolvedVariant = context.variant ?? "default";
  const isDisabled = disabled || context.disabled || loading;
  const isSelected = context.value.includes(value);
  // In `"current"` mode the item is one of a mutually-exclusive set, not an
  // on/off button — `aria-current` replaces `aria-pressed` rather than joining
  // it (never expose both; see the eBay/Primer pattern).
  const useCurrent = context.semantics === "current";
  // Radio mode swaps the button's whole role, so `aria-pressed` must go too:
  // `role="radio"` carries state via `aria-checked`.
  const useRadio = context.semantics === "radio";

  // Labels are hidden visually, so the text must survive as the accessible name.
  const textLabel =
    typeof children === "string" ? children : undefined;

  const hideLabel = context.hideLabels && !!textLabel;

  // A non-string tooltip can't stand in as the accessible name, so it doesn't
  // silence the warning — only a real name does.
  useAriaLabelWarning("ToggleGroupItem", {
    ariaLabel:
      props["aria-label"] ?? (typeof tooltip === "string" ? tooltip : undefined),
    children,
  });

  const { selectValue } = context;

  /**
   * Selection-follows-focus, the APG radio-group behaviour. Base UI's composite
   * already owns roving tabindex and arrow-key focus movement, so selection
   * only has to follow the focus it produces. Guarded on `isSelected` so the
   * commit is idempotent, and on `disabled` so a skipped item can't select.
   */
  const handleFocus: NonNullable<TogglePrimitive.Props["onFocus"]> = (event) => {
    props.onFocus?.(event);

    if (!useRadio || isSelected || isDisabled) return;
    selectValue(value, event.nativeEvent, event.currentTarget);
  };

  /**
   * Space/Enter/click on a radio selects; it must never deselect. Base UI's own
   * handler toggles, which for the already-checked item would emit `[]`.
   * Merged handlers run right-to-left with ours first, so
   * `preventBaseUIHandler()` suppresses the toggle and we commit the value
   * outright. (`preventDefault()` would not stop it — Base UI gates on its own
   * flag, not the DOM's.)
   */
  const handleClick: NonNullable<TogglePrimitive.Props["onClick"]> = (event) => {
    props.onClick?.(event);

    if (!useRadio) return;
    event.preventBaseUIHandler();

    if (isDisabled || isSelected) return;
    selectValue(value, event.nativeEvent, event.currentTarget);
  };

  const handlePressedChange: NonNullable<
    TogglePrimitive.Props["onPressedChange"]
  > = (pressed, eventDetails) => {
    onPressedChange?.(pressed, eventDetails);

    // Press micro-interaction: <150ms, transform only, reduced-motion gated.
    // Skipped when a sliding indicator already carries the feedback.
    if (itemRef.current && !loading && !reducedMotion && !context.slide) {
      gsap.to(itemRef.current, {
        scale: 0.95,
        duration: 0.075,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const item = (
    <TogglePrimitive
      ref={itemRef}
      data-slot="toggle-group-item"
      data-orientation={context.orientation}
      data-loading={loading || undefined}
      className={cn(
        toggleGroupItemVariants({
          variant: resolvedVariant,
          size: resolvedSize,
          colorVariant,
          shape: context.shape,
          slide: context.slide,
          hideLabel,
        }),
        context.slide && "z-10",
        className
      )}
      value={value}
      disabled={isDisabled}
      aria-label={
        props["aria-label"] ??
        (hideLabel ? textLabel : undefined) ??
        (!children && typeof tooltip === "string" ? tooltip : undefined)
      }
      aria-busy={loading || undefined}
      onPressedChange={handlePressedChange}
      {...props}
      onFocus={handleFocus}
      onClick={handleClick}
      // Base UI hard-codes `role="button"`-ish semantics and `aria-pressed` on
      // the item. The playbook's polymorphism route is `useRender`/`mergeProps`,
      // and `render`'s props are merged *last* (`mergeProps(props, render.props)`
      // in `useRenderElement`), so this is the supported override seam rather
      // than a spread-order accident. Each mode exposes exactly one state
      // attribute — `aria-pressed` and `aria-checked` are never both present.
      render={
        <button
          type="button"
          {...mergeProps<"button">(
            {
              "aria-pressed": useCurrent || useRadio ? undefined : isSelected,
              "aria-current": useCurrent && isSelected ? "true" : undefined,
            } as React.ButtonHTMLAttributes<HTMLButtonElement>,
            (useRadio
              ? { role: "radio", "aria-checked": isSelected }
              : {}) as React.ButtonHTMLAttributes<HTMLButtonElement>
          )}
        />
      }
    >
      {loading && (
        <IconLoader2
          data-slot="toggle-group-item-spinner"
          className={cn(!reducedMotion && "animate-spin")}
          aria-hidden="true"
        />
      )}
      {context.showSelectedIcon && isSelected && !loading && (
        <IconCheck data-slot="toggle-group-item-indicator" aria-hidden="true" />
      )}
      {hideLabel ? null : children}
    </TogglePrimitive>
  );

  // A collapsed label must reappear somewhere — Primer/Spectrum both pair
  // hidden labels with a tooltip.
  const tooltipContent =
    isDisabled && disabledReason
      ? disabledReason
      : (tooltip ?? (hideLabel ? textLabel : undefined));

  if (!tooltipContent) return item;

  // A disabled button emits no pointer events, so the disabled-reason tooltip
  // needs a wrapper span to carry the hover target.
  const trigger =
    isDisabled && disabledReason ? (
      <span className="inline-flex">{item}</span>
    ) : (
      item
    );

  return (
    <Tooltip>
      <TooltipTrigger>{trigger}</TooltipTrigger>
      <TooltipContent side={tooltipSide}>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
}

// =============================================================================
// KiraToggleGroup — one prop-driven entry point over the group family
// =============================================================================

interface KiraToggleGroupItem {
  value: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  tooltip?: React.ReactNode;
  disabled?: boolean;
  disabledReason?: React.ReactNode;
  loading?: boolean;
  colorVariant?: ToggleGroupItemProps["colorVariant"];
}

interface KiraToggleGroupProps
  extends Omit<ToggleGroupProps, "children" | "onValueChange"> {
  /** Items as data — each becomes a `ToggleGroupItem`. */
  items: KiraToggleGroupItem[];
  onValueChange?: (value: string[]) => void;
  /**
   * Async selection handler. Selection flips instantly (`useOptimistic`) and
   * rolls back if this rejects.
   */
  onValueChangeAsync?: (value: string[]) => Promise<void>;
  /**
   * Toast text shown when `onValueChangeAsync` rejects. Distinct from the
   * inherited `errorMessage`, which is the inline validation text rendered
   * below the group.
   */
  asyncErrorMessage?: string;
  /** Render labels as tooltips only, for an icon-only dense bar. */
  dense?: boolean;
  /** Label rendered above the group, wired via `aria-labelledby`. */
  label?: React.ReactNode;
  description?: React.ReactNode;
}

function KiraToggleGroup({
  items,
  value,
  defaultValue,
  onValueChange,
  onValueChangeAsync,
  asyncErrorMessage = "Couldn't update",
  dense = false,
  label,
  description,
  multiple,
  className,
  ...props
}: KiraToggleGroupProps) {
  const generatedId = React.useId();
  const labelId = `${generatedId}-label`;
  const descriptionId = `${generatedId}-description`;

  const isControlled = value !== undefined;

  const [valueState, setValueState] = React.useState<readonly string[]>(
    defaultValue ?? []
  );

  const committed = isControlled ? value : valueState;

  const [optimistic, setOptimistic] = React.useOptimistic(
    committed,
    (_prev: readonly string[], next: readonly string[]) => next
  );

  const [pending, setPending] = React.useState<string[]>([]);

  const runAsync = React.useCallback(
    async (next: string[]) => {
      if (!onValueChangeAsync) return;
      setOptimistic(next);
      // Mark newly-selected values busy so each item can show its spinner.
      setPending(next.filter((v) => !committed.includes(v)));

      try {
        await onValueChangeAsync(next);

        if (!isControlled) setValueState(next);
      } catch {
        // The optimistic value reverts to `committed` on the next render, but a
        // silent revert reads as "nothing happened" — say why, as KiraToggle does.
        toast.error(asyncErrorMessage);
      } finally {
        setPending([]);
      }
    },
    [
      onValueChangeAsync,
      committed,
      isControlled,
      setOptimistic,
      asyncErrorMessage,
    ]
  );

  const handleValueChange = (next: string[]) => {
    if (onValueChangeAsync) {
      React.startTransition(() => {
        runAsync(next);
      });
    } else if (!isControlled) {
      setValueState(next);
    }

    onValueChange?.(next);
  };

  const group = (
    <ToggleGroup
      className={className}
      multiple={multiple}
      value={onValueChangeAsync || isControlled ? optimistic : undefined}
      defaultValue={onValueChangeAsync || isControlled ? undefined : defaultValue}
      onValueChange={handleValueChange}
      aria-labelledby={label ? labelId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      {...props}
    >
      {items.map((item) => (
        <ToggleGroupItem
          key={item.value}
          value={item.value}
          colorVariant={item.colorVariant}
          disabled={item.disabled}
          disabledReason={item.disabledReason}
          loading={item.loading || pending.includes(item.value)}
          tooltip={item.tooltip ?? (dense ? item.label : undefined)}
          aria-label={
            dense && typeof item.label === "string" ? item.label : undefined
          }
        >
          {item.icon}
          {!dense && item.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );

  if (!label && !description) return group;

  return (
    <div data-slot="toggle-group-field" className="space-y-2">
      {label && (
        <span id={labelId} className="block text-sm font-medium leading-none">
          {label}
        </span>
      )}
      {group}
      {description && (
        <span id={descriptionId} className="block text-xs text-muted-foreground">
          {description}
        </span>
      )}
    </div>
  );
}

export {
  ToggleGroup,
  ToggleGroupItem,
  KiraToggleGroup,
  toggleGroupVariants,
  toggleGroupItemVariants,
};

export type {
  ToggleGroupProps,
  ToggleGroupItemProps,
  ToggleGroupSemantics,
  KiraToggleGroupProps,
  KiraToggleGroupItem,
};



