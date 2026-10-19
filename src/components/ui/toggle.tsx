"use client";

import * as React from "react";
import gsap from "gsap";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
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

/** Fans one DOM node out to every ref passed in. */
function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value: T) => {
    for (const ref of refs) {
      if (!ref) continue;

      if (typeof ref === "function") {
        ref(value);
      } else {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}

const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
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
  }
) {
  const hasText = typeof children === "string" && children.trim().length > 0;

  const isIconOnly =
    !!icon || (!!size && ICON_ONLY_SIZES[size]) || !children;

  React.useEffect(() => {
    if (!import.meta.env?.DEV) return;

    if (ariaLabel || hasText || !isIconOnly) return;
    console.warn(
      `[kira-kit] <${componentName}> renders without a text label. Pass an \`aria-label\` so assistive technology can announce it.`
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
  const label =
    ariaLabel ?? (typeof children === "string" ? children.trim() : undefined);

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
          "let the text carry the state."
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

function Toggle({
  className,
  variant,
  size,
  shape,
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
    defaultPressed ?? false
  );

  const isPressed = pressed ?? internalPressed;

  useAriaLabelWarning("Toggle", {
    ariaLabel: props["aria-label"],
    size,
    icon,
    children,
  });

  useLabelStabilityWarning({
    pressed: isPressed,
    ariaLabel: props["aria-label"],
    children,
  });

  const handlePressedChange: NonNullable<TogglePrimitive.Props["onPressedChange"]> =
    (newPressed, eventDetails) => {
      if (pressed === undefined) {
        setInternalPressed(newPressed);
      }

      onPressedChange?.(newPressed, eventDetails);

      // Press micro-interaction: <150ms, transform only, reduced-motion gated.
      if (innerRef.current && !loading && !reducedMotion) {
        gsap.to(innerRef.current, {
          scale: 0.95,
          duration: 0.075,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      }
    };

  const renderIndicator = () => {
    if (loading) {
      return (
        <IconLoader2
          data-slot="toggle-spinner"
          className={cn(!reducedMotion && "animate-spin")}
          aria-hidden="true"
        />
      );
    }

    if (showIndicator && isPressed) {
      return <IconCheck data-slot="toggle-indicator" aria-hidden="true" />;
    }

    return null;
  };

  const toggle = (
    <TogglePrimitive
      ref={mergeRefs(ref, innerRef)}
      data-slot="toggle"
      data-loading={loading || undefined}
      className={cn(toggleVariants({ variant, size, shape }), className)}
      disabled={disabled || loading}
      pressed={isPressed}
      defaultPressed={defaultPressed}
      onPressedChange={handlePressedChange}
      aria-busy={loading || undefined}
      {...props}
    >
      {indicatorPosition === "left" && renderIndicator()}
      {icon}
      {children}
      {indicatorPosition === "right" && renderIndicator()}
    </TogglePrimitive>
  );

  if (!name) return toggle;

  // Native checkbox semantics: an unpressed toggle submits nothing at all,
  // rather than an empty string. A hidden input can't live inside a <button>,
  // so it rides alongside as a sibling — it generates no box, so layout in a
  // flex/grid parent is unchanged.
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

interface KiraToggleProps
  extends Omit<ToggleProps, "onPressedChange" | "children"> {
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

  const [status, setStatus] = React.useState<"idle" | "loading" | "success">(
    "idle"
  );

  const isControlled = pressed !== undefined;
  const [pressedState, setPressedState] = React.useState(defaultPressed);
  const committedPressed = (isControlled ? pressed : pressedState) ?? false;

  const [optimisticPressed, setOptimisticPressed] = React.useOptimistic(
    committedPressed,
    (_prev: boolean, next: boolean) => next
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
      showSuccess,
      errorMessage,
      setOptimisticPressed,
    ]
  );

  const handlePressedChange = (next: boolean) => {
    if (onToggleAsync) {
      React.startTransition(() => {
        runToggle(next);
      });
    } else if (!isControlled) {
      setPressedState(next);
    }

    onPressedChange?.(next);
  };

  // Wire the shortcut hint to an actual global handler.
  React.useEffect(() => {
    if (!shortcut || disabled) return;
    const key = shortcut.slice(-1).toLowerCase();
    const needsMod = /[⌘^]|ctrl|cmd/i.test(shortcut);

    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key) return;

      if (needsMod && !(e.metaKey || e.ctrlKey)) return;
      e.preventDefault();
      handlePressedChange(!committedPressed);
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [shortcut, disabled, committedPressed]);

  const isBusy = loading || status === "loading";

  const buildToggle = () => {
    const effectiveIcon =
      status === "success" ? (
        <IconCheck data-slot="toggle-success" aria-hidden="true" />
      ) : optimisticPressed && pressedIcon ? (
        pressedIcon
      ) : (
        icon
      );

    return (
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
        {shortcut && (
          <kbd
            data-slot="toggle-shortcut"
            className="pointer-events-none ml-1 inline-flex h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
          >
            {shortcut}
          </kbd>
        )}
      </Toggle>
    );
  };

  const wrapWithTooltip = (element: React.ReactNode) => {
    const content = disabled && disabledReason ? disabledReason : tooltip;

    if (!content) return element;

    // A disabled button emits no pointer events, so the disabled-reason
    // tooltip needs a wrapper span to carry the hover target.
    const trigger =
      disabled && disabledReason ? (
        <span className="inline-flex">{element}</span>
      ) : (
        element
      );

    return (
      <Tooltip>
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>{content}</TooltipContent>
      </Tooltip>
    );
  };

  const wrapWithLabel = (element: React.ReactNode) => {
    if (!label && !description) return element;

    return (
      <div data-slot="toggle-field" className="flex items-start gap-3">
        {element}
        <div className="space-y-0.5">
          {label && (
            <span
              id={labelId}
              className="block text-sm font-medium leading-none"
            >
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
  };

  return wrapWithLabel(wrapWithTooltip(buildToggle()));
}

export { Toggle, KiraToggle, toggleVariants };

export type { ToggleProps, ToggleSize, KiraToggleProps };


