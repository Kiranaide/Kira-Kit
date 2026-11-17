"use client";

import * as React from "react";
import gsap from "gsap";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";

import { cn } from "cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toast";

// oxlint-disable anti-slop/no-runtime-typeof -- ReactNode → string is the I/O boundary (React guarantees string children/labels; anything else has no text label); mergeRefs dispatches on the documented React ref forms.
function asText(node: React.ReactNode): string | undefined {
  return typeof node === "string" ? node.trim() : undefined;
}

/** Fans one DOM node out to every ref passed in. */
function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;

      // oxlint-disable-next-line anti-slop/no-runtime-typeof -- React refs support callback and mutable-object forms, requiring runtime dispatch.
      if (typeof ref === "function") {
        ref(value);
      } else {
        ref.current = value;
      }
    }
  };
}

const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-[color,background-color,border-color,box-shadow]",
    "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "disabled:pointer-events-none disabled:opacity-50",
    "hover:bg-muted hover:text-muted-foreground",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-transparent data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
        ghost:
          "bg-transparent hover:bg-accent hover:text-accent-foreground data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
        solid:
          "bg-muted text-muted-foreground data-[pressed]:bg-primary data-[pressed]:text-primary-foreground",
        success:
          "bg-transparent data-[pressed]:bg-success data-[pressed]:text-success-foreground",
        warning:
          "bg-transparent data-[pressed]:bg-warning data-[pressed]:text-warning-foreground",
        destructive:
          "bg-transparent data-[pressed]:bg-destructive data-[pressed]:text-destructive-foreground",
      },
      size: {
        sm: "h-8 px-2 text-xs [&_svg]:h-3.5 [&_svg]:w-3.5",
        default: "h-9 px-3 [&_svg]:h-4 [&_svg]:w-4",
        lg: "h-10 px-4 text-base [&_svg]:h-5 [&_svg]:w-5",
        icon: "h-9 w-9 [&_svg]:h-4 [&_svg]:w-4",
        "icon-sm": "h-8 w-8 [&_svg]:h-3.5 [&_svg]:w-3.5",
        "icon-lg": "h-10 w-10 [&_svg]:h-5 [&_svg]:w-5",
      },
      radius: {
        default: "rounded-md",
        pill: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
    },
  },
);

type ToggleSize = NonNullable<VariantProps<typeof toggleVariants>["size"]>;

const ICON_ONLY_SIZES: Partial<Record<ToggleSize, true>> = {
  icon: true,
  "icon-sm": true,
  "icon-lg": true,
};

/**
 * Dev-only nudge: an icon-only toggle with no accessible name is invisible to
 * screen readers. Called from an effect so render stays side-effect free.
 */
function useAriaLabelWarning(
  componentName: string,
  {
    ariaLabel,
    size,
    icon,
    children,
  }: {
    ariaLabel?: string;
    size?: ToggleSize | null;
    icon?: React.ReactNode;
    children?: React.ReactNode;
  },
) {
  const hasText = !!asText(children);

  const isIconOnly = !!icon || (!!size && ICON_ONLY_SIZES[size]) || !children;

  React.useEffect(() => {
    if (!import.meta.env?.DEV) return;

    if (ariaLabel || hasText || !isIconOnly) return;
    console.warn(
      `[kira-kit] <${componentName}> renders without a text label. Pass an \`aria-label\` so assistive technology can announce it.`,
    );
  }, [componentName, ariaLabel, hasText, isIconOnly]);
}

/**
 * Dev-only nudge for the rule people get wrong most often. The APG calls it
 * critical that "the label on a toggle does not change when its state changes":
 * a button labelled "Mute" stays "Mute" when pressed, because `aria-pressed`
 * already carries the state. Swapping the text to "Unmute" double-announces it
 * and breaks voice control, which targets the visible name.
 *
 * If the label genuinely must swap (Play → Pause), that's the text-carries-state
 * pattern — drop `aria-pressed` entirely rather than shipping both.
 *
 * Only labels observed at *different* pressed states are compared, so a label
 * that changes for unrelated reasons while the state holds isn't flagged.
 */
function useLabelStabilityWarning({
  pressed,
  ariaLabel,
  children,
}: {
  pressed: boolean;
  ariaLabel?: string;
  children?: React.ReactNode;
}) {
  const label = ariaLabel ?? asText(children);

  // Last label seen at each pressed state; written from an effect so render
  // stays pure (playbook §4).
  const seen = React.useRef<{ on?: string; off?: string }>({});

  React.useEffect(() => {
    if (!import.meta.env?.DEV) return;

    if (!label) return;

    const key = pressed ? "on" : "off";
    seen.current[key] = label;

    const { on, off } = seen.current;

    if (on && off && on !== off) {
      console.warn(
        `[kira-kit] <Toggle> changes its label between states ("${off}" → "${on}"). ` +
          "The APG requires a toggle button's label to stay fixed — `aria-pressed` " +
          "already announces the state, so a swapped label double-announces it and " +
          "breaks voice control. Keep one stable label, or drop `aria-pressed` and " +
          "let the text carry the state.",
      );
      // One warning per offending pair, not one per toggle.
      seen.current = {};
    }
  }, [label, pressed]);
}

interface ToggleProps
  extends
    Omit<TogglePrimitive.Props, "children" | "value">,
    VariantProps<typeof toggleVariants> {
  loading?: boolean;
  showIndicator?: boolean;
  indicatorPosition?: "left" | "right";
  children?: React.ReactNode;
  icon?: React.ReactNode;
  /**
   * Submits with the enclosing `<form>`. Follows native checkbox semantics: a
   * hidden input is emitted only while pressed, so an unpressed toggle
   * contributes nothing to `FormData` (servers test key presence, not value).
   */
  name?: string;
  /** Value submitted while pressed. Defaults to `"on"`, as native checkboxes do. */
  value?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

function ToggleIndicator({
  loading,
  pressed,
  showIndicator,
  reducedMotion,
}: {
  loading: boolean;
  pressed: boolean;
  showIndicator: boolean;
  reducedMotion: boolean;
}) {
  if (loading) {
    return (
      <IconLoader2
        data-slot="toggle-spinner"
        className={cn(!reducedMotion && "animate-spin")}
        aria-hidden="true"
      />
    );
  }

  if (showIndicator && pressed) {
    return <IconCheck data-slot="toggle-indicator" aria-hidden="true" />;
  }

  return null;
}

/**
 * M3 Expressive selection pop: the wrapped node springs 1.25 → 1 when `active`
 * flips false → true. Render stays pure — the flip is detected with the
 * render-time previous-value pattern (playbook §4), the tween runs from the
 * effect and is interruptible (`overwrite: "auto"`).
 */
function useSelectionPop(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  enabled: boolean,
) {
  const [prevActive, setPrevActive] = React.useState(active);
  const justPressed = active && !prevActive;

  if (active !== prevActive) {
    setPrevActive(active);
  }

  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (!justPressed || !enabled || reducedMotion || !ref.current) return;

    gsap.fromTo(
      ref.current,
      { scale: 1.25 },
      { scale: 1, duration: 0.3, ease: "back.out(2.5)", overwrite: "auto" },
    );
  }, [justPressed, enabled, reducedMotion, ref]);
}

type ToggleRenderProps = Omit<
  ToggleProps,
  | "className"
  | "variant"
  | "size"
  | "radius"
  | "loading"
  | "showIndicator"
  | "indicatorPosition"
  | "icon"
  | "children"
  | "disabled"
  | "pressed"
  | "defaultPressed"
  | "onPressedChange"
  | "name"
  | "value"
  | "ref"
>;

/** Press micro-interaction: <150ms, transform only, reduced-motion gated,
 * interruptible (§5 — `overwrite: "auto"` cancels any in-flight tween). */
function pressTween(
  node: HTMLElement | null,
  loading: boolean,
  reducedMotion: boolean,
) {
  if (!node || loading || reducedMotion) return;

  gsap.to(node, {
    scale: 0.95,
    duration: 0.075,
    ease: "power2.out",
    yoyo: true,
    repeat: 1,
    overwrite: "auto",
  });
}

/** Dev-only nudges for the plain `Toggle`: aria-label, label stability, icon pop. */
function useToggleDiagnostics({
  ariaLabel,
  size,
  icon,
  children,
  isPressed,
}: {
  ariaLabel: string | undefined;
  size: ToggleProps["size"];
  icon: React.ReactNode;
  children: React.ReactNode;
  isPressed: boolean;
}) {
  const iconRef = React.useRef<HTMLSpanElement>(null);

  useSelectionPop(iconRef, isPressed && !!icon, true);

  useAriaLabelWarning("Toggle", { ariaLabel, size, icon, children });

  useLabelStabilityWarning({ pressed: isPressed, ariaLabel, children });

  return iconRef;
}

function Toggle({
  className,
  variant,
  size,
  radius,
  loading = false,
  showIndicator = false,
  indicatorPosition = "left",
  icon,
  children,
  disabled,
  pressed,
  defaultPressed,
  onPressedChange,
  name,
  value,
  ref,
  ...props
}: ToggleProps) {
  const innerRef = React.useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  const [internalPressed, setInternalPressed] = React.useState(
    defaultPressed ?? false,
  );

  const isPressed = pressed ?? internalPressed;

  const popRef = useToggleDiagnostics({
    ariaLabel: props["aria-label"],
    size,
    icon,
    children,
    isPressed,
  });

  const handlePressedChange: NonNullable<
    TogglePrimitive.Props["onPressedChange"]
  > = (newPressed, eventDetails) => {
    if (pressed === undefined) {
      setInternalPressed(newPressed);
    }

    onPressedChange?.(newPressed, eventDetails);

    pressTween(innerRef.current, loading, reducedMotion);
  };

  return (
    <ToggleBody
      ref={ref}
      innerRef={innerRef}
      className={className}
      variant={variant}
      size={size}
      radius={radius}
      loading={loading}
      disabled={disabled}
      isPressed={isPressed}
      defaultPressed={defaultPressed}
      handlePressedChange={handlePressedChange}
      icon={icon}
      popRef={popRef}
      indicatorPosition={indicatorPosition}
      showIndicator={showIndicator}
      reducedMotion={reducedMotion}
      props={props}
      name={name}
      value={value}
    >
      {children}
    </ToggleBody>
  );
}

function ToggleBody({
  ref,
  innerRef,
  className,
  variant,
  size,
  radius,
  loading,
  disabled,
  isPressed,
  defaultPressed,
  handlePressedChange,
  icon,
  popRef,
  indicatorPosition,
  showIndicator,
  reducedMotion,
  props,
  name,
  value,
  children,
}: {
  ref: ToggleProps["ref"];
  innerRef: React.RefObject<HTMLButtonElement | null>;
  className: ToggleProps["className"];
  variant: VariantProps<typeof toggleVariants>["variant"];
  size: ToggleProps["size"];
  radius: VariantProps<typeof toggleVariants>["radius"];
  loading: boolean;
  disabled: boolean | undefined;
  isPressed: boolean;
  defaultPressed: boolean | undefined;
  handlePressedChange: NonNullable<TogglePrimitive.Props["onPressedChange"]>;
  icon: React.ReactNode;
  popRef: React.RefObject<HTMLSpanElement | null>;
  indicatorPosition: "left" | "right";
  showIndicator: boolean;
  reducedMotion: boolean;
  props: ToggleRenderProps;
  name: string | undefined;
  value: string | undefined;
  children: React.ReactNode;
}) {
  const toggle = (
    <TogglePrimitive
      ref={mergeRefs(ref, innerRef)}
      data-slot="toggle"
      data-loading={loading || undefined}
      className={(state) =>
        cn(
          toggleVariants({ variant, size, radius }),
          typeof className === "function" ? className(state) : className,
        )
      }
      disabled={disabled || loading}
      pressed={isPressed}
      defaultPressed={defaultPressed}
      onPressedChange={handlePressedChange}
      aria-busy={loading || undefined}
      {...props}
    >
      <ToggleIndicators
        indicatorPosition={indicatorPosition}
        loading={loading}
        isPressed={isPressed}
        showIndicator={showIndicator}
        reducedMotion={reducedMotion}
        popRef={popRef}
        icon={icon}
      >
        {children}
      </ToggleIndicators>
    </TogglePrimitive>
  );

  return withFormInput({ toggle, isPressed, name, value });
}

function ToggleIndicators({
  indicatorPosition,
  loading,
  isPressed,
  showIndicator,
  reducedMotion,
  popRef,
  icon,
  children,
}: {
  indicatorPosition: "left" | "right";
  loading: boolean;
  isPressed: boolean;
  showIndicator: boolean;
  reducedMotion: boolean;
  popRef: React.RefObject<HTMLSpanElement | null>;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      {indicatorPosition === "left" && (
        <ToggleIndicator
          loading={loading}
          pressed={isPressed}
          showIndicator={showIndicator}
          reducedMotion={reducedMotion}
        />
      )}
      {icon && (
        <span ref={popRef} data-slot="toggle-icon" className="inline-flex">
          {icon}
        </span>
      )}
      {children}
      {indicatorPosition === "right" && (
        <ToggleIndicator
          loading={loading}
          pressed={isPressed}
          showIndicator={showIndicator}
          reducedMotion={reducedMotion}
        />
      )}
    </>
  );
}

/** Native checkbox semantics: an unpressed toggle submits nothing at all, rather
 * than an empty string. A hidden input can't live inside a `<button>`, so it
 * rides alongside as a sibling — it generates no box, so layout in a flex/grid
 * parent is unchanged. */
function withFormInput({
  toggle,
  isPressed,
  name,
  value,
}: {
  toggle: React.ReactElement;
  isPressed: boolean;
  name: string | undefined;
  value: string | undefined;
}) {
  if (!name) return toggle;

  return (
    <>
      {toggle}
      {isPressed && (
        <input
          type="hidden"
          name={name}
          value={value ?? "on"}
          data-slot="toggle-input"
        />
      )}
    </>
  );
}

// =============================================================================
// KiraToggle — one prop-driven entry point over every toggle mode
// =============================================================================

interface KiraToggleProps extends Omit<
  ToggleProps,
  "onPressedChange" | "children"
> {
  children?: React.ReactNode;
  /** Tooltip on the toggle. Icon-only toggles should always have one. */
  tooltip?: React.ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  /** Tooltip shown only while disabled, explaining why. Takes precedence. */
  disabledReason?: React.ReactNode;
  /** Icon swapped in while pressed (e.g. a filled heart). */
  pressedIcon?: React.ReactNode;
  /** Keyboard shortcut hint rendered as a kbd chip; also wired to a handler. */
  shortcut?: string;
  /** Plain (non-async) pressed-state callback. */
  onPressedChange?: (pressed: boolean) => void;
  /**
   * Async handler. The pressed state flips instantly (`useOptimistic`) and
   * rolls back with a toast if this rejects — for non-destructive actions.
   */
  onToggleAsync?: (pressed: boolean) => Promise<void>;
  /** Flash a checkmark after `onToggleAsync` resolves. */
  showSuccess?: boolean;
  successDuration?: number;
  errorMessage?: string;
  /** Label text rendered beside the toggle, wired via `aria-labelledby`. */
  label?: React.ReactNode;
  description?: React.ReactNode;
  /**
   * Submits with the enclosing `<form>` while pressed — see `Toggle`'s `name`.
   * Pairs with `value` to set the submitted payload (defaults to `"on"`).
   */
  name?: string;
  value?: string;
}

/** Focusable wrapper so a disabled toggle can host a tooltip (§9). */
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
            data-slot="toggle-reason-anchor"
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

/** Resolves which icon renders: success check > pressed icon > base icon. */
function resolveIcon(
  status: "idle" | "loading" | "success",
  optimisticPressed: boolean,
  pressedIcon: React.ReactNode,
  icon: React.ReactNode,
): React.ReactNode {
  if (status === "success") {
    return <IconCheck data-slot="toggle-success" aria-hidden="true" />;
  }

  if (optimisticPressed && pressedIcon) {
    return pressedIcon;
  }

  return icon;
}

interface UseToggleShortcutOptions {
  shortcut: string | undefined;
  disabled: boolean | undefined;
  isPressed: boolean;
  onToggle: () => void;
}

/** Wires the KiraToggle shortcut hint to an actual global key handler. */
function useToggleShortcut({
  shortcut,
  disabled,
  isPressed,
  onToggle,
}: UseToggleShortcutOptions) {
  React.useEffect(() => {
    if (!shortcut || disabled) return;
    const key = shortcut.slice(-1).toLowerCase();
    const needsMod = /[⌘^]|ctrl|cmd/i.test(shortcut);

    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key) return;

      if (needsMod && !(e.metaKey || e.ctrlKey)) return;
      e.preventDefault();
      onToggle();
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [shortcut, disabled, isPressed, onToggle]);
}

/**
 * Optimistic async toggle state for KiraToggle: flips instantly via
 * `useOptimistic`, commits on resolve, reverts with a toast on reject.
 */
function useOptimisticToggle({
  committedPressed,
  isControlled,
  setPressedState,
  onToggleAsync,
  showSuccess,
  successDuration,
  errorMessage,
}: {
  committedPressed: boolean;
  isControlled: boolean;
  setPressedState: (pressed: boolean) => void;
  onToggleAsync: ((pressed: boolean) => Promise<void>) | undefined;
  showSuccess: boolean;
  successDuration: number;
  errorMessage: string;
}) {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">(
    "idle",
  );

  const [optimisticPressed, setOptimisticPressed] = React.useOptimistic(
    committedPressed,
    (_prev: boolean, next: boolean) => next,
  );

  React.useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => setStatus("idle"), successDuration);

    return () => clearTimeout(timer);
  }, [status, successDuration]);

  const runToggle = React.useCallback(
    async (next: boolean) => {
      if (!onToggleAsync) return;
      setOptimisticPressed(next); // flips the UI instantly
      setStatus("loading");

      try {
        await onToggleAsync(next);

        if (!isControlled) setPressedState(next); // commit truth
        setStatus(showSuccess ? "success" : "idle");
      } catch {
        // the optimistic value reverts to committedPressed on the next render
        setStatus("idle");
        toast.error(errorMessage);
      }
    },
    [
      onToggleAsync,
      isControlled,
      setPressedState,
      showSuccess,
      errorMessage,
      setOptimisticPressed,
    ],
  );

  return { status, optimisticPressed, runToggle };
}

/** State + async/shortcut wiring for KiraToggle (composes the two hooks below). */
function useKiraToggleState({
  pressed,
  defaultPressed,
  disabled,
  shortcut,
  onToggleAsync,
  onPressedChange,
  showSuccess,
  successDuration,
  errorMessage,
}: {
  pressed: boolean | undefined;
  defaultPressed: boolean;
  disabled: boolean | undefined;
  shortcut: string | undefined;
  onToggleAsync: ((pressed: boolean) => Promise<void>) | undefined;
  onPressedChange: ((pressed: boolean) => void) | undefined;
  showSuccess: boolean;
  successDuration: number;
  errorMessage: string;
}) {
  const isControlled = pressed !== undefined;
  const [pressedState, setPressedState] = React.useState(defaultPressed);
  const committedPressed = (isControlled ? pressed : pressedState) ?? false;

  const { status, optimisticPressed, runToggle } = useOptimisticToggle({
    committedPressed,
    isControlled,
    setPressedState,
    onToggleAsync,
    showSuccess,
    successDuration,
    errorMessage,
  });

  const handlePressedChange = React.useCallback(
    (next: boolean) => {
      if (onToggleAsync) {
        React.startTransition(() => {
          runToggle(next);
        });
      } else if (!isControlled) {
        setPressedState(next);
      }

      onPressedChange?.(next);
    },
    [onToggleAsync, runToggle, isControlled, setPressedState, onPressedChange],
  );

  useToggleShortcut({
    shortcut,
    disabled,
    isPressed: committedPressed,
    onToggle: React.useCallback(
      () => handlePressedChange(!committedPressed),
      [handlePressedChange, committedPressed],
    ),
  });

  return { status, optimisticPressed, handlePressedChange };
}

/** Shortcut hint chip rendered inside KiraToggle. */
function ToggleShortcut({ kbd }: { kbd: string }) {
  return (
    <kbd
      data-slot="toggle-shortcut"
      className="pointer-events-none ml-1 inline-flex h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
    >
      {kbd}
    </kbd>
  );
}

function KiraToggle({
  tooltip,
  tooltipSide = "top",
  disabledReason,
  pressedIcon,
  shortcut,
  onPressedChange,
  onToggleAsync,
  showSuccess = false,
  successDuration = 1200,
  errorMessage = "Couldn't update",
  label,
  description,
  icon,
  children,
  pressed,
  defaultPressed = false,
  disabled,
  loading,
  className,
  size,
  ...props
}: KiraToggleProps) {
  const generatedId = React.useId();
  const labelId = `${generatedId}-label`;
  const descriptionId = `${generatedId}-description`;

  const { status, optimisticPressed, handlePressedChange } = useKiraToggleState(
    {
      pressed,
      defaultPressed,
      disabled,
      shortcut,
      onToggleAsync,
      onPressedChange,
      showSuccess,
      successDuration,
      errorMessage,
    },
  );

  const isBusy = loading || status === "loading";

  const effectiveIcon = resolveIcon(
    status,
    optimisticPressed,
    pressedIcon,
    icon,
  );

  return (
    <KiraToggleField
      element={
        <Toggle
          className={className}
          size={size}
          icon={effectiveIcon}
          loading={isBusy}
          disabled={disabled}
          pressed={optimisticPressed}
          onPressedChange={handlePressedChange}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          {...props}
        >
          {children}
          {shortcut && <ToggleShortcut kbd={shortcut} />}
        </Toggle>
      }
      label={label}
      labelId={labelId}
      description={description}
      descriptionId={descriptionId}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
      disabled={disabled}
      disabledReason={disabledReason}
    />
  );
}

/** Tooltip + label chrome for KiraToggle; owns the disabled-reason focus proxy. */
function KiraToggleField({
  element,
  label,
  labelId,
  description,
  descriptionId,
  tooltip,
  tooltipSide,
  disabled,
  disabledReason,
}: {
  element: React.ReactElement;
  label: React.ReactNode;
  labelId: string;
  description: React.ReactNode;
  descriptionId: string;
  tooltip: React.ReactNode;
  tooltipSide: "top" | "right" | "bottom" | "left";
  disabled: boolean | undefined;
  disabledReason: React.ReactNode;
}) {
  const content = disabled && disabledReason ? disabledReason : tooltip;

  const withTooltip = content ? (
    <Tooltip>
      <TooltipTrigger
        render={
          disabled && disabledReason ? (
            <DisabledReasonWrapper reason={disabledReason}>
              {element}
            </DisabledReasonWrapper>
          ) : (
            element
          )
        }
      />
      <TooltipContent side={tooltipSide}>{content}</TooltipContent>
    </Tooltip>
  ) : (
    element
  );

  if (!label && !description) return withTooltip;

  return (
    <div data-slot="toggle-field" className="flex items-start gap-3">
      {withTooltip}
      <div className="space-y-0.5">
        {label && (
          <span id={labelId} className="block text-sm font-medium leading-none">
            {label}
          </span>
        )}
        {description && (
          <span
            id={descriptionId}
            className="block text-xs text-muted-foreground"
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

export { Toggle, KiraToggle, toggleVariants };

export type { ToggleProps, ToggleSize, KiraToggleProps };
