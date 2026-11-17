"use client";

import * as React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva, type VariantProps } from "class-variance-authority";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";

import { cn } from "cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { usePressBounce } from "@/hooks/use-press-bounce";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toast";

// oxlint-disable anti-slop/no-shape-in-symbol-names -- `shapeMorph` is the Material 3 Expressive term of art for the selected-item radius morph; the prop name matches the spec language (m3.material.io "button groups") users search for.
// oxlint-disable anti-slop/no-runtime-typeof -- ReactNode → string is the I/O boundary: React guarantees string children/labels; anything else has no text label.
function asText(node: React.ReactNode): string | undefined {
  return typeof node === "string" ? node.trim() : undefined;
}

/** `${React.useId()}-error` shorthand for group/item inline-error ids. */
function useId() {
  return `${React.useId()}-error`;
}

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
    radius: {
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
    radius: "default",
    overflowMode: "none",
  },
});

const toggleGroupItemVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 text-sm font-medium transition-[color,background-color,border-color,box-shadow]",
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
      radius: {
        default: "",
        pill: "rounded-full first:rounded-l-full last:rounded-r-full",
      },
      /**
       * M3 Expressive morph: the pressed item's radius grows. Applied only
       * when the group's guards pass (see ToggleGroupProps.shapeMorph).
       */
      shapeMorph: {
        true: "data-[pressed]:rounded-xl data-[pressed]:scale-[1.03]",
        false: "",
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
      radius: "default",
      shapeMorph: false,
      slide: false,
      hideLabel: false,
    },
  },
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
  radius: VariantProps<typeof toggleGroupVariants>["radius"];
  disabled?: boolean;
  /** True when the group renders a sliding indicator behind the active item. */
  slide: boolean;
  /** M3 Expressive selection morph (guarded; see ToggleGroupProps.shapeMorph). */
  shapeMorph: boolean;
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
  radius: "default",
  disabled: false,
  slide: false,
  shapeMorph: false,
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
 * outright, so it hands `onValueChange` a details object of the same structure.
 */
function createSelectDetails(
  event: Event,
  trigger?: HTMLElement,
): ToggleGroupChangeDetails {
  let canceled = false;
  let propagationAllowed = false;

  // SAFETY: the literal carries every member of ToggleGroupChangeDetails;
  // duck-typed because Base UI doesn't export its event-details factory.
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
  { ariaLabel, children }: { ariaLabel?: string; children?: React.ReactNode },
) {
  const hasText = !!asText(children);

  React.useEffect(() => {
    if (!import.meta.env?.DEV) return;

    if (ariaLabel) return;

    if (componentName === "ToggleGroup") {
      console.warn(
        "[kira-kit] <ToggleGroup> has no `aria-label`. Screen readers announce the group without a purpose.",
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
  count: number,
) {
  React.useEffect(() => {
    if (!import.meta.env?.DEV) return;

    if (variant !== "segment") return;

    if (count <= MAX_SEGMENTS) return;
    console.warn(
      `[kira-kit] <ToggleGroup variant="segment"> has ${count} segments. ` +
        `Segmented controls read best with 2–${MAX_SEGMENTS}; past that use chips or a select.`,
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
  radius,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  activeKey: string;
  orientation: "horizontal" | "vertical";
  radius: "default" | "pill";
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
        '[data-slot="toggle-group-item"][data-pressed]',
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
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    {
      dependencies: [activeKey, orientation, reducedMotion],
      scope: containerRef,
    },
  );

  return (
    <span
      ref={indicatorRef}
      data-slot="toggle-group-indicator"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-0 top-0 z-0 bg-background shadow-sm",
        radius === "pill" ? "rounded-full" : "rounded-md",
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
  /**
   * M3 Expressive button-group behavior: the selected item's radius grows
   * (`rounded-xl`) and it springs into place (scale 0.92 → 1, `back.out(2)`).
   *
   * Guards — visually inert when any of these hold:
   * - `variant="outline"` (joined borders conflict with the morph)
   * - `variant="segment"` (the muted track owns the silhouette)
   * - `slidingIndicator` (the sliding pill owns the selected fill)
   * - `multiple` (no single "selected" item to morph)
   *
   * Reduced-motion aware: the spring is skipped, the static radius morph stays.
   */
  shapeMorph?: boolean;
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
      "variant" | "radius" | "shapeMorph" | "slide"
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

type ToggleGroupItemRenderProps = Omit<
  ToggleGroupItemProps,
  | "className"
  | "value"
  | "size"
  | "colorVariant"
  | "loading"
  | "tooltip"
  | "tooltipSide"
  | "disabledReason"
  | "disabled"
  | "children"
  | "onPressedChange"
>;

/**
 * Group value state: controlled/uncontrolled resolution, the one-selected-always
 * veto, and the radio-mode `selectValue` commit. Returns everything the
 * context memo needs.
 */
function useToggleGroupState({
  value,
  defaultValue,
  multiple,
  allowEmpty,
  onValueChange,
}: {
  value: readonly string[] | undefined;
  defaultValue: readonly string[] | undefined;
  multiple: boolean;
  allowEmpty: boolean;
  onValueChange: ToggleGroupProps["onValueChange"];
}) {
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = React.useState<readonly string[]>(
    defaultValue ?? [],
  );

  const resolvedValue = isControlled ? value : internalValue;

  const handleValueChange: NonNullable<
    ToggleGroupPrimitive.Props["onValueChange"]
  > = (next, eventDetails) => {
    // One-selected-always: in single-select, pressing the active item would
    // clear the group (Base UI yields `[]`). Veto it so selection can only
    // move, never empty.
    if (!multiple && !allowEmpty && next.length === 0) {
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
    [isControlled, onValueChange],
  );

  return { resolvedValue, handleValueChange, selectValue };
}

/** One hidden input per selected value — see the usage note in GroupContextProvider. */
function GroupInputs({
  name,
  resolvedValue,
}: {
  name: string | undefined;
  resolvedValue: readonly string[];
}) {
  if (!name) return null;

  return (
    <>
      {resolvedValue.map((selected) => (
        <input
          key={selected}
          type="hidden"
          name={name}
          value={selected}
          data-slot="toggle-group-input"
        />
      ))}
    </>
  );
}

interface GroupRenderArgs {
  contextValue: ToggleGroupContextValue;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isRadio: boolean;
  required: boolean;
  invalid: boolean;
  variant: VariantProps<typeof toggleGroupVariants>["variant"];
  orientation: ToggleGroupProps["orientation"];
  radius: VariantProps<typeof toggleGroupVariants>["radius"];
  overflowMode: VariantProps<typeof toggleGroupVariants>["overflowMode"];
  slide: boolean;
  className: ToggleGroupProps["className"];
  multiple: boolean;
  loopFocus: boolean;
  disabled: boolean | undefined;
  value: readonly string[] | undefined;
  defaultValue: readonly string[] | undefined;
  handleValueChange: NonNullable<ToggleGroupPrimitive.Props["onValueChange"]>;
  describedBy: string | undefined;
  name: string | undefined;
  resolvedValue: readonly string[];
  children: React.ReactNode;
  errorMessage: ToggleGroupProps["errorMessage"];
  errorId: string;
  props: GroupSeamArgs["rest"];
}

/** Context + primitive wrapper for the group; owns the describedBy wiring. */
function GroupContextProvider(args: GroupRenderArgs) {
  const {
    contextValue,
    containerRef,
    isRadio,
    required,
    invalid,
    errorMessage,
    errorId,
    variant,
    orientation,
    radius,
    overflowMode,
    slide,
    className,
    multiple,
    loopFocus,
    disabled,
    value,
    defaultValue,
    handleValueChange,
    describedBy,
    name,
    resolvedValue,
    children,
    props,
  } = args;

  return (
    <GroupErrorWrapper
      invalid={invalid}
      errorMessage={errorMessage}
      errorId={errorId}
    >
      <ToggleGroupContext.Provider value={contextValue}>
        <ToggleGroupPrimitive
          ref={containerRef}
          data-slot="toggle-group"
          data-orientation={orientation}
          // ARIA17: "For a group of radio buttons, one should use
          // `role="radiogroup"` instead of `role="group"`." Base UI hard-codes
          // `role="group"`; `render`'s props merge last, so this overrides it.
          render={isRadio ? <div role="radiogroup" /> : undefined}
          aria-required={required || undefined}
          aria-invalid={invalid || undefined}
          className={(state) =>
            cn(
              toggleGroupVariants({
                variant,
                orientation,
                radius,
                overflowMode,
              }),
              slide && "relative isolate",
              typeof className === "function" ? className(state) : className,
            )
          }
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
          {/* One input per selected value, so `formData.getAll(name)` yields each
              value separately. Single-select simply produces one (or none), so
              there's no `multiple` branch to keep in sync. Driven by
              `resolvedValue`, the same source the items and indicator read, so
              controlled and uncontrolled modes stay consistent by construction. */}
          <GroupInputs name={name} resolvedValue={resolvedValue} />
          {slide && (
            <ToggleGroupIndicator
              containerRef={containerRef}
              activeKey={resolvedValue.join("|")}
              orientation={orientation ?? "horizontal"}
              radius={radius ?? "default"}
            />
          )}
          {children}
        </ToggleGroupPrimitive>
      </ToggleGroupContext.Provider>
    </GroupErrorWrapper>
  );
}

/** Inline validation text below the group when `invalid` + `errorMessage`. */
function GroupErrorWrapper({
  invalid,
  errorMessage,
  errorId,
  children,
}: {
  invalid: boolean;
  errorMessage: ToggleGroupProps["errorMessage"];
  errorId: string;
  children: React.ReactNode;
}) {
  if (!invalid || !errorMessage) return <>{children}</>;

  return (
    <div data-slot="toggle-group-wrapper" className="space-y-1.5">
      {children}
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

/** Builds the memoized context value shared by every ToggleGroupItem. */
function useToggleGroupContext({
  variant,
  size,
  orientation,
  radius,
  disabled,
  multiple,
  semantics,
  showSelectedIcon,
  shapeMorph,
  hideLabels,
  slide,
  resolvedValue,
  selectValue,
}: {
  variant: VariantProps<typeof toggleGroupVariants>["variant"];
  size: VariantProps<typeof toggleGroupVariants>["size"];
  orientation: ToggleGroupProps["orientation"];
  radius: VariantProps<typeof toggleGroupVariants>["radius"];
  disabled: boolean | undefined;
  multiple: boolean;
  semantics: ToggleGroupSemantics;
  showSelectedIcon: boolean;
  shapeMorph: boolean;
  hideLabels: boolean;
  slide: boolean;
  resolvedValue: readonly string[];
  selectValue: (value: string, event: Event, trigger?: HTMLElement) => void;
}) {
  // A formatting bar of independent toggles is `aria-pressed` per the APG;
  // only mutually-exclusive segments get the `aria-current`/radio set models.
  const resolvedSemantics: ToggleGroupSemantics = multiple
    ? "toggle"
    : semantics;

  return React.useMemo<ToggleGroupContextValue>(
    () => ({
      variant,
      size,
      orientation,
      radius,
      disabled,
      slide,
      shapeMorph,
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
      radius,
      disabled,
      slide,
      shapeMorph,
      resolvedSemantics,
      showSelectedIcon,
      hideLabels,
      resolvedValue,
      selectValue,
    ],
  );
}

/** ToggleGroup's prop defaults; spread first so callers override per prop. */
const DEFAULT_GROUP_PROPS = {
  variant: "default",
  size: "default",
  orientation: "horizontal",
  radius: "default",
  multiple: false,
  loopFocus: true,
  slidingIndicator: false,
  overflowMode: "none",
  semantics: "current",
  allowEmpty: false,
  showSelectedIcon: false,
  shapeMorph: false,
  required: false,
  invalid: false,
} as const;

/** aria-describedby chain: user value + the inline-error id when active. */
function useGroupDescribedBy(
  userDescribedBy: string | undefined,
  showError: boolean,
  errorId: string,
) {
  return (
    [userDescribedBy, showError ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

interface GroupSeamArgs {
  variant: ToggleGroupProps["variant"];
  size: ToggleGroupProps["size"];
  orientation: ToggleGroupProps["orientation"];
  radius: ToggleGroupProps["radius"];
  disabled: ToggleGroupProps["disabled"];
  multiple: boolean;
  semantics: ToggleGroupSemantics;
  showSelectedIcon: boolean;
  overflowMode: ToggleGroupProps["overflowMode"];
  slide: boolean;
  shapeMorph: boolean;
  resolvedValue: readonly string[];
  selectValue: ToggleGroupContextValue["selectValue"];
  containerRef: React.RefObject<HTMLDivElement | null>;
  isRadio: boolean;
  required: boolean;
  invalid: boolean;
  errorMessage: ToggleGroupProps["errorMessage"];
  errorId: string;
  className: ToggleGroupProps["className"];
  loopFocus: boolean;
  value: readonly string[] | undefined;
  defaultValue: readonly string[] | undefined;
  handleValueChange: NonNullable<ToggleGroupPrimitive.Props["onValueChange"]>;
  name: string | undefined;
  describedByUser: string | undefined;
  children: React.ReactNode;
  rest: Omit<
    ToggleGroupProps,
    | "className"
    | "variant"
    | "size"
    | "orientation"
    | "radius"
    | "multiple"
    | "loopFocus"
    | "slidingIndicator"
    | "overflowMode"
    | "semantics"
    | "allowEmpty"
    | "showSelectedIcon"
    | "shapeMorph"
    | "required"
    | "invalid"
    | "errorMessage"
    | "name"
    | "disabled"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "children"
  >;
}

/** ToggleGroup render seam: wires derived values into GroupContextProvider. */
function GroupSeam(args: GroupSeamArgs) {
  return (
    <GroupContextProvider
      contextValue={useToggleGroupContext({
        variant: args.variant,
        size: args.size,
        orientation: args.orientation,
        radius: args.radius,
        disabled: args.disabled,
        multiple: args.multiple,
        semantics: args.semantics,
        showSelectedIcon: args.showSelectedIcon,
        shapeMorph: args.shapeMorph,
        hideLabels: args.overflowMode === "hideLabels",
        slide: args.slide,
        resolvedValue: args.resolvedValue,
        selectValue: args.selectValue,
      })}
      containerRef={args.containerRef}
      isRadio={args.isRadio}
      required={args.required}
      invalid={args.invalid}
      errorMessage={args.errorMessage}
      errorId={args.errorId}
      variant={args.variant}
      orientation={args.orientation}
      radius={args.radius}
      overflowMode={args.overflowMode}
      slide={args.slide}
      className={args.className}
      multiple={args.multiple}
      loopFocus={args.loopFocus}
      disabled={args.disabled}
      value={args.value}
      defaultValue={args.defaultValue}
      handleValueChange={args.handleValueChange}
      describedBy={useGroupDescribedBy(
        args.describedByUser,
        args.invalid && !!args.errorMessage,
        args.errorId,
      )}
      name={args.name}
      resolvedValue={args.resolvedValue}
      props={args.rest}
    >
      {args.children}
    </GroupContextProvider>
  );
}

function ToggleGroup(props: ToggleGroupProps) {
  const {
    className,
    variant,
    size,
    orientation,
    radius,
    multiple,
    loopFocus,
    slidingIndicator,
    overflowMode,
    semantics,
    allowEmpty,
    showSelectedIcon,
    shapeMorph,
    required,
    invalid,
    errorMessage,
    name,
    disabled,
    value,
    defaultValue,
    onValueChange,
    children,
    ...rest
  } = { ...DEFAULT_GROUP_PROPS, ...props };

  const containerRef = React.useRef<HTMLDivElement>(null);
  const errorId = useId();

  useAriaLabelWarning("ToggleGroup", { ariaLabel: rest["aria-label"] });
  useSegmentCapWarning(variant, React.Children.count(children));

  const { resolvedValue, handleValueChange, selectValue } = useToggleGroupState(
    { value, defaultValue, multiple, allowEmpty, onValueChange },
  );

  const isRadio = semantics !== "toggle" && !multiple;
  const slide = slidingIndicator && !multiple;

  // Render seam: everything ToggleGroup derived, forwarded to the provider.
  return (
    <GroupSeam
      variant={variant}
      size={size}
      orientation={orientation}
      radius={radius}
      disabled={disabled}
      multiple={multiple}
      semantics={semantics}
      showSelectedIcon={showSelectedIcon}
      shapeMorph={shapeMorph}
      overflowMode={overflowMode}
      slide={slide}
      resolvedValue={resolvedValue}
      selectValue={selectValue}
      containerRef={containerRef}
      isRadio={isRadio}
      required={required}
      invalid={invalid}
      errorMessage={errorMessage}
      errorId={errorId}
      className={className}
      loopFocus={loopFocus}
      value={value}
      defaultValue={defaultValue}
      handleValueChange={handleValueChange}
      name={name}
      describedByUser={rest["aria-describedby"]}
      rest={rest}
    >
      {children}
    </GroupSeam>
  );
}

/** Focusable wrapper so a disabled group item can host a tooltip (§9). */
function DisabledReasonWrapper({
  reason,
  children,
}: {
  reason: React.ReactNode;
  children: React.ReactNode;
}) {
  // Focus proxy for a native-disabled trigger (Base UI's documented pattern for
  // tooltips on disabled controls): the span is hit-tested where the disabled
  // button is not, and Tab reaches it so keyboard users can read the reason.
  // role="button" is deliberately avoided — the accessible "disabled button" is
  // already announced via aria-disabled; the label carries the reason.
  const anchorProps = {
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focus proxy required for disabled-control tooltip reachability (WCAG 2.2 §9)
    tabIndex: 0,
    "aria-disabled": true,
    "aria-label": asText(reason),
  } as const;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            data-slot="toggle-group-item-reason-anchor"
            {...anchorProps}
            className="inline-flex cursor-not-allowed rounded-md outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="top">{reason}</TooltipContent>
    </Tooltip>
  );
}

/** Collapsed-label / disabled-reason tooltip wrapper for a group item. */
function ItemTooltip({
  item,
  isDisabled,
  disabledReason,
  tooltip,
  hideLabel,
  textLabel,
  tooltipSide,
}: {
  item: React.ReactElement;
  isDisabled: boolean;
  disabledReason: React.ReactNode;
  tooltip: React.ReactNode;
  hideLabel: boolean;
  textLabel: string | undefined;
  tooltipSide: "top" | "right" | "bottom" | "left";
}) {
  // A collapsed label must reappear somewhere — Primer/Spectrum both pair
  // hidden labels with a tooltip.
  const tooltipContent =
    isDisabled && disabledReason
      ? disabledReason
      : (tooltip ?? (hideLabel ? textLabel : undefined));

  if (!tooltipContent) return item;

  // A disabled button emits no pointer events, so the disabled-reason tooltip
  // needs a focusable anchor to carry the hover/focus target (§9).
  const trigger =
    isDisabled && disabledReason ? (
      <DisabledReasonWrapper reason={disabledReason}>
        {item}
      </DisabledReasonWrapper>
    ) : (
      item
    );

  return (
    <Tooltip>
      <TooltipTrigger render={trigger} />
      <TooltipContent side={tooltipSide}>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
}

/** Item focus/click/press handlers (radio-mode selection + press bounce). */
function useToggleGroupItemHandlers({
  isDisabled,
  isSelected,
  useRadio,
  useCurrent,
  value,
  selectValue,
  itemRef,
  bounceEnabled,
  springEnabled,
  onPressedChange,
  props,
}: {
  isDisabled: boolean;
  isSelected: boolean;
  useRadio: boolean;
  useCurrent: boolean;
  value: string;
  selectValue: ToggleGroupContextValue["selectValue"];
  itemRef: React.RefObject<HTMLButtonElement | null>;
  bounceEnabled: boolean;
  springEnabled: boolean;
  onPressedChange: TogglePrimitive.Props["onPressedChange"];
  props: ToggleGroupItemRenderProps;
}) {
  const pressBounce = usePressBounce(itemRef, bounceEnabled);

  // M3 Expressive selection spring: fires when this item becomes selected.
  // Render stays pure — the flip is detected with the render-time
  // previous-value pattern (playbook §4); the tween runs from the effect and
  // is interruptible (`overwrite: "auto"`) + reduced-motion gated.
  const [prevSelected, setPrevSelected] = React.useState(isSelected);
  const justSelected = isSelected && !prevSelected;

  if (isSelected !== prevSelected) {
    setPrevSelected(isSelected);
  }

  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (!justSelected || !springEnabled || reducedMotion || !itemRef.current) {
      return;
    }

    gsap.fromTo(
      itemRef.current,
      { scale: 0.92 },
      { scale: 1, duration: 0.35, ease: "back.out(2)", overwrite: "auto" },
    );
  }, [justSelected, springEnabled, reducedMotion, itemRef]);

  /**
   * Selection-follows-focus, the APG radio-group behaviour. Base UI's composite
   * already owns roving tabindex and arrow-key focus movement, so selection
   * only has to follow the focus it produces. Guarded on `isSelected` so the
   * commit is idempotent, and on `disabled` so a skipped item can't select.
   */
  const handleFocus: NonNullable<TogglePrimitive.Props["onFocus"]> = (
    event,
  ) => {
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
  const handleClick: NonNullable<TogglePrimitive.Props["onClick"]> = (
    event,
  ) => {
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

    // Skipped when a sliding indicator already carries the feedback.
    pressBounce();
  };

  // `aria-current` and `aria-pressed` are never both present (§3 seam note).
  // SAFETY: aria-pressed/aria-current/role/aria-checked are valid button
  // attributes; the casts exist because mergeProps' generic rejects a bare
  // literal (playbook §3 pattern).
  const renderState = mergeProps<"button">(
    {
      "aria-pressed": useCurrent || useRadio ? undefined : isSelected,
      "aria-current": useCurrent && isSelected ? "true" : undefined,
    } as React.ButtonHTMLAttributes<HTMLButtonElement>,
    (useRadio
      ? { role: "radio", "aria-checked": isSelected }
      : {}) as React.ButtonHTMLAttributes<HTMLButtonElement>,
  );

  return { handleFocus, handleClick, handlePressedChange, renderState };
}

/** Derived display state for a ToggleGroupItem from its props + context. */
/** M3 morph guards: joined borders / sliding pill / set-model conflicts make
 * the morph visually inert — the spring stays off with them. */
function useGroupMorphState(context: ToggleGroupContextValue) {
  return (
    context.shapeMorph &&
    !context.slide &&
    context.semantics !== "current" &&
    (context.variant === "pills" || context.variant === "default")
  );
}

function useToggleGroupItemDerived({
  size,
  loading,
  disabled,
  value,
  children,
  tooltip,
  props,
}: {
  size: VariantProps<typeof toggleGroupItemVariants>["size"];
  loading: boolean;
  disabled: boolean | undefined;
  value: string;
  children: React.ReactNode;
  tooltip: React.ReactNode;
  props: ToggleGroupItemRenderProps;
}) {
  const context = React.useContext(ToggleGroupContext);

  const resolvedSize = size ?? context.size ?? "default";
  const resolvedVariant = context.variant ?? "default";
  const isDisabled = disabled || context.disabled || loading;
  const isSelected = context.value.includes(value);

  const morphActive = useGroupMorphState(context);

  // In `"current"` mode the item is one of a mutually-exclusive set, not an
  // on/off button — `aria-current` replaces `aria-pressed` rather than joining
  // it (never expose both; see the eBay/Primer pattern).
  const useCurrent = context.semantics === "current";

  // Radio mode swaps the button's whole role, so `aria-pressed` must go too:
  // `role="radio"` carries state via `aria-checked`.
  const useRadio = context.semantics === "radio";

  // Labels are hidden visually, so the text must survive as the accessible name.
  const textLabel = asText(children);
  const hideLabel = context.hideLabels && !!textLabel;

  // A non-string tooltip can't stand in as the accessible name, so it doesn't
  // silence the warning — only a real name does.
  useAriaLabelWarning("ToggleGroupItem", {
    ariaLabel: props["aria-label"] ?? asText(tooltip),
    children,
  });

  return {
    context,
    resolvedSize,
    resolvedVariant,
    isDisabled,
    isSelected,
    useCurrent,
    useRadio,
    morphActive,
    textLabel,
    hideLabel,
  };
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
  const reducedMotion = useReducedMotion();

  const {
    context,
    resolvedSize,
    resolvedVariant,
    isDisabled,
    isSelected,
    useCurrent,
    useRadio,
    morphActive,
    textLabel,
    hideLabel,
  } = useToggleGroupItemDerived({
    size,
    loading,
    disabled,
    value,
    children,
    tooltip,
    props,
  });

  const { handleFocus, handleClick, handlePressedChange, renderState } =
    useToggleGroupItemHandlers({
      isDisabled,
      isSelected,
      useRadio,
      useCurrent,
      value,
      selectValue: context.selectValue,
      itemRef,
      bounceEnabled: !loading && !context.slide,
      springEnabled: morphActive,
      onPressedChange,
      props,
    });

  // Render seam: derived state + handlers forwarded to the element builder.
  return (
    <GroupItemElement
      itemRef={itemRef}
      context={context}
      reducedMotion={reducedMotion}
      resolvedVariant={resolvedVariant}
      resolvedSize={resolvedSize}
      colorVariant={colorVariant}
      hideLabel={hideLabel}
      morphActive={morphActive}
      className={className}
      value={value}
      isDisabled={isDisabled}
      textLabel={textLabel}
      tooltip={tooltip}
      props={props}
      handlePressedChange={handlePressedChange}
      handleFocus={handleFocus}
      handleClick={handleClick}
      renderState={renderState}
      loading={loading}
      isSelected={isSelected}
      disabledReason={disabledReason}
      tooltipSide={tooltipSide}
    >
      {children}
    </GroupItemElement>
  );
}

/** ToggleGroupItem body: loading spinner, selected check, collapsed-label gate. */
function ItemContent({
  loading,
  reducedMotion,
  showSelectedIcon,
  isSelected,
  hideLabel,
  children,
}: {
  loading: boolean;
  reducedMotion: boolean;
  showSelectedIcon: boolean;
  isSelected: boolean;
  hideLabel: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      {loading && (
        <IconLoader2
          data-slot="toggle-group-item-spinner"
          className={cn(!reducedMotion && "animate-spin")}
          aria-hidden="true"
        />
      )}
      {showSelectedIcon && isSelected && !loading && (
        <IconCheck data-slot="toggle-group-item-indicator" aria-hidden="true" />
      )}
      {hideLabel ? null : children}
    </>
  );
}

interface GroupItemElementArgs {
  itemRef: React.RefObject<HTMLButtonElement | null>;
  context: ToggleGroupContextValue;
  reducedMotion: boolean;
  resolvedVariant: NonNullable<
    VariantProps<typeof toggleGroupItemVariants>["variant"]
  >;
  resolvedSize: NonNullable<
    VariantProps<typeof toggleGroupItemVariants>["size"]
  >;
  colorVariant: VariantProps<typeof toggleGroupItemVariants>["colorVariant"];
  hideLabel: boolean;
  morphActive: boolean;
  className: ToggleGroupItemProps["className"];
  value: string;
  isDisabled: boolean;
  textLabel: string | undefined;
  tooltip: React.ReactNode;
  props: ToggleGroupItemRenderProps;
  handlePressedChange: NonNullable<TogglePrimitive.Props["onPressedChange"]>;
  handleFocus: NonNullable<TogglePrimitive.Props["onFocus"]>;
  handleClick: NonNullable<TogglePrimitive.Props["onClick"]>;
  renderState: React.ButtonHTMLAttributes<HTMLButtonElement>;
  loading: boolean;
  isSelected: boolean;
  disabledReason: React.ReactNode;
  tooltipSide: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
}

/** Accessible name for a group item: explicit label > collapsed text > tooltip. */
function itemAriaLabel(
  props: ToggleGroupItemRenderProps,
  hideLabel: boolean,
  textLabel: string | undefined,
  children: React.ReactNode,
  tooltip: React.ReactNode,
) {
  return (
    props["aria-label"] ??
    (hideLabel ? textLabel : undefined) ??
    (children ? undefined : asText(tooltip))
  );
}

function GroupItemElement({
  itemRef,
  context,
  reducedMotion,
  resolvedVariant,
  resolvedSize,
  colorVariant,
  hideLabel,
  morphActive,
  className,
  value,
  isDisabled,
  textLabel,
  tooltip,
  props,
  handlePressedChange,
  handleFocus,
  handleClick,
  renderState,
  loading,
  isSelected,
  disabledReason,
  tooltipSide,
  children,
}: GroupItemElementArgs) {
  const item = (
    <TogglePrimitive
      ref={itemRef}
      data-slot="toggle-group-item"
      data-orientation={context.orientation}
      data-loading={loading || undefined}
      className={(state) =>
        cn(
          toggleGroupItemVariants({
            variant: resolvedVariant,
            size: resolvedSize,
            colorVariant,
            radius: context.radius,
            shapeMorph: morphActive,
            slide: context.slide,
            hideLabel,
          }),
          context.slide && "z-10",
          typeof className === "function" ? className(state) : className,
        )
      }
      value={value}
      disabled={isDisabled}
      aria-label={itemAriaLabel(props, hideLabel, textLabel, children, tooltip)}
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
      render={<button type="button" {...renderState} />}
    >
      <ItemContent
        loading={loading}
        reducedMotion={reducedMotion}
        showSelectedIcon={context.showSelectedIcon}
        isSelected={isSelected}
        hideLabel={hideLabel}
      >
        {children}
      </ItemContent>
    </TogglePrimitive>
  );

  return (
    <ItemTooltip
      item={item}
      isDisabled={isDisabled}
      disabledReason={disabledReason}
      tooltip={tooltip}
      hideLabel={hideLabel}
      textLabel={textLabel}
      tooltipSide={tooltipSide}
    />
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

interface KiraToggleGroupProps extends Omit<
  ToggleGroupProps,
  "children" | "onValueChange"
> {
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

/** Optimistic async group value: flips instantly, commits on resolve, toasts on reject. */
function useOptimisticGroupValue({
  value,
  defaultValue,
  onValueChange,
  onValueChangeAsync,
  asyncErrorMessage,
}: {
  value: readonly string[] | undefined;
  defaultValue: readonly string[] | undefined;
  onValueChange: ((value: string[]) => void) | undefined;
  onValueChangeAsync: ((value: string[]) => Promise<void>) | undefined;
  asyncErrorMessage: string;
}) {
  const isControlled = value !== undefined;

  const [valueState, setValueState] = React.useState<readonly string[]>(
    defaultValue ?? [],
  );

  const committed = isControlled ? value : valueState;

  const [optimistic, setOptimistic] = React.useOptimistic(
    committed,
    (_prev: readonly string[], next: readonly string[]) => next,
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
    ],
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

  return {
    optimistic,
    pending,
    handleValueChange,
    asyncActive: !!onValueChangeAsync,
    isControlled,
  };
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

  const { optimistic, pending, handleValueChange, asyncActive, isControlled } =
    useOptimisticGroupValue({
      value,
      defaultValue,
      onValueChange,
      onValueChangeAsync,
      asyncErrorMessage,
    });

  const group = (
    <ToggleGroup
      className={className}
      multiple={multiple}
      value={asyncActive || isControlled ? optimistic : undefined}
      defaultValue={asyncActive || isControlled ? undefined : defaultValue}
      onValueChange={handleValueChange}
      aria-labelledby={label ? labelId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      {...props}
    >
      <KiraGroupItems items={items} dense={dense} pending={pending} />
    </ToggleGroup>
  );

  return (
    <KiraGroupField
      group={group}
      label={label}
      labelId={labelId}
      description={description}
      descriptionId={descriptionId}
    />
  );
}

/** Label + description chrome above/below the KiraToggleGroup group. */
function KiraGroupField({
  group,
  label,
  labelId,
  description,
  descriptionId,
}: {
  group: React.ReactElement;
  label: React.ReactNode;
  labelId: string;
  description: React.ReactNode;
  descriptionId: string;
}) {
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
        <span
          id={descriptionId}
          className="block text-xs text-muted-foreground"
        >
          {description}
        </span>
      )}
    </div>
  );
}

/** Renders the item-driven ToggleGroupItems for KiraToggleGroup. */
function KiraGroupItems({
  items,
  dense,
  pending,
}: {
  items: KiraToggleGroupItem[];
  dense: boolean;
  pending: readonly string[];
}) {
  return (
    <>
      {items.map((item) => (
        <ToggleGroupItem
          key={item.value}
          value={item.value}
          colorVariant={item.colorVariant}
          disabled={item.disabled}
          disabledReason={item.disabledReason}
          loading={item.loading || pending.includes(item.value)}
          tooltip={item.tooltip ?? (dense ? item.label : undefined)}
          aria-label={dense ? asText(item.label) : undefined}
        >
          {item.icon}
          {!dense && item.label}
        </ToggleGroupItem>
      ))}
    </>
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
