/* oxlint-disable react/only-export-components -- compound component exports are required by the public API */
"use client";

import * as React from "react";
import gsap from "gsap";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconInfoCircle,
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle,
  IconX,
  IconChevronDown,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const alertVariants = cva("relative w-full rounded-lg p-4", {
  variants: {
    variant: {
      default: "bg-background text-foreground border border-border",
      // Tone variants: body text stays foreground for WCAG AA contrast in
      // light and dark; the tone is carried by icon, border and accent.
      info: "bg-info/10 border border-info/30 text-foreground",
      success: "bg-success/10 border border-success/30 text-foreground",
      warning: "bg-warning/10 border border-warning/30 text-foreground",
      destructive:
        "bg-destructive/10 border border-destructive/30 text-foreground",
      // Soft: tinted background, no visible border.
      "info-soft": "bg-info/10 border border-transparent text-foreground",
      "success-soft": "bg-success/10 border border-transparent text-foreground",
      "warning-soft": "bg-warning/10 border border-transparent text-foreground",
      "destructive-soft":
        "bg-destructive/10 border border-transparent text-foreground",
      "outline-default": "bg-transparent border border-border text-foreground",
      "outline-info": "bg-transparent border border-info text-foreground",
      "outline-success": "bg-transparent border border-success text-foreground",
      "outline-warning": "bg-transparent border border-warning text-foreground",
      "outline-destructive":
        "bg-transparent border border-destructive text-foreground",
    },
    size: {
      xs: "p-2 text-xs",
      sm: "p-3 text-sm",
      default: "p-4 text-sm",
      lg: "p-5 text-base",
    },
    // Full-width, edge-to-edge banner (no rounding).
    banner: {
      true: "rounded-none border-x-0",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    banner: false,
  },
});

// Icon size + optical top-offset per alert size. Applied directly to the
// icon slot (instead of relying on `[&>svg]` sibling selectors), so
// placement stays consistent whether the icon comes from the variant's
// default or a custom node is passed in.
const alertIconSize: Record<
  NonNullable<VariantProps<typeof alertVariants>["size"]>,
  string
> = {
  xs: "h-3 w-3 mt-0.5",
  sm: "h-3.5 w-3.5 mt-0.5",
  default: "h-4 w-4 mt-0.5",
  lg: "h-5 w-5 mt-1",
};

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>;

const alertIcons: Record<
  AlertVariant,
  React.ComponentType<{ className?: string }> | null
> = {
  default: null,
  info: IconInfoCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  destructive: IconAlertCircle,
  "info-soft": IconInfoCircle,
  "success-soft": IconCircleCheck,
  "warning-soft": IconAlertTriangle,
  "destructive-soft": IconAlertCircle,
  "outline-default": null,
  "outline-info": IconInfoCircle,
  "outline-success": IconCircleCheck,
  "outline-warning": IconAlertTriangle,
  "outline-destructive": IconAlertCircle,
};

// Tone icons pick up the semantic colour, since the variant body no
// longer carries it. `default` and `outline-default` fall back to the
// inherited foreground.
const iconTone: Partial<Record<AlertVariant, string>> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

// Left accent-border color per variant family.
const accentBorder: Record<AlertVariant, string> = {
  default: "border-l-4 border-l-border",
  info: "border-l-4 border-l-info",
  success: "border-l-4 border-l-success",
  warning: "border-l-4 border-l-warning",
  destructive: "border-l-4 border-l-destructive",
  "info-soft": "border-l-4 border-l-info",
  "success-soft": "border-l-4 border-l-success",
  "warning-soft": "border-l-4 border-l-warning",
  "destructive-soft": "border-l-4 border-l-destructive",
  "outline-default": "border-l-4 border-l-border",
  "outline-info": "border-l-4 border-l-info",
  "outline-success": "border-l-4 border-l-success",
  "outline-warning": "border-l-4 border-l-warning",
  "outline-destructive": "border-l-4 border-l-destructive",
};

interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  showIcon?: boolean;
  /** Override the auto icon. Pass `null` to hide it entirely. */
  icon?: React.ReactNode | null;
  closable?: boolean;
  onClose?: () => void;
  size?: "xs" | "sm" | "default" | "lg";
  /** Add a colored left accent border. */
  leftAccent?: boolean;
  /** Extra header-row content (timestamp, copy, …) rendered left of the
      close button, all on one baseline-aligned flex row. */
  meta?: React.ReactNode;
}

// SAFETY: ReactNode union narrows to string here by construction — props are
// local author input, not I/O; this is the single domain-parse boundary.
function copySourceText(
  copyText: string | undefined,
  title: React.ReactNode,
  description: React.ReactNode,
): string {
  if (copyText !== undefined) {
    return copyText;
  }

  // SAFETY: ReactNode union narrows to string here by construction — props
  // are local author input, not I/O; this is the single domain-parse boundary.
  // oxlint-disable-next-line anti-slop/no-runtime-typeof
  if (typeof description === "string" && description.length > 0) {
    return description;
  }

  // oxlint-disable-next-line anti-slop/no-runtime-typeof
  if (typeof title === "string" && title.length > 0) {
    return title;
  }

  return "";
}

// A custom `icon` (including `null` to hide) always takes precedence over
// the variant's default icon. Returns null when no icon should render.
function resolveIcon(
  icon: React.ReactNode | null | undefined,
  showIcon: boolean,
  variant: AlertVariant | null,
): React.ReactNode {
  if (!showIcon || icon === null) {
    return null;
  }

  if (icon !== undefined) {
    return icon;
  }

  const IconComponent = alertIcons[variant || "default"];

  if (IconComponent === null) {
    return null;
  }

  return React.createElement(IconComponent, { className: "h-full w-full" });
}

function resolveActionVariant(
  variant: AlertAction["variant"],
  index: number,
): React.ComponentProps<typeof Button>["variant"] {
  if (variant !== undefined) {
    return variant;
  }

  if (index === 0) {
    return "default";
  }

  return "outline";
}

function resolveAccentClass(variant: AlertVariant | null): string | undefined {
  return accentBorder[variant || "default"];
}

function resolveIconClassName(
  variant: AlertVariant | null,
  resolvedSize: "xs" | "sm" | "default" | "lg",
): string {
  return cn(
    "relative z-10 shrink-0",
    alertIconSize[resolvedSize],
    iconTone[variant || "default"],
  );
}

// Shared dismiss: reduced motion (or missing ref) tears down instantly;
// otherwise a single interruptible tween owns the exit (§5).
function performDismiss(
  ref: React.RefObject<HTMLDivElement | null>,
  tweenRef: React.RefObject<gsap.core.Tween | null>,
  reducedMotion: boolean,
  done: () => void,
): void {
  if (!ref.current || reducedMotion) {
    done();

    return;
  }

  tweenRef.current?.kill();

  tweenRef.current = gsap.to(ref.current, {
    opacity: 0,
    y: -10,
    duration: 0.2,
    ease: "power1.in",
    onComplete: done,
  });
}

// Header row: icon, body, and header actions (meta + close) share one flex
// row so nothing overlaps or stacks across coordinate systems. Actions
// reserve their own width — no absolute positioning, no reserved padding.
interface AlertHeaderRowProps {
  hasIcon: boolean;
  iconNode: React.ReactNode;
  iconClassName: string;
  body: React.ReactNode;
  meta: React.ReactNode;
  closable: boolean;
  onClose: () => void;
}

function AlertHeaderRow({
  hasIcon,
  iconNode,
  iconClassName,
  body,
  meta,
  closable,
  onClose,
}: AlertHeaderRowProps) {
  const showActions = Boolean(meta) || closable;

  return (
    <div className="flex items-start gap-3">
      {hasIcon && (
        <span data-slot="alert-icon" className={iconClassName}>
          {iconNode}
        </span>
      )}
      <div data-slot="alert-body" className="relative z-10 min-w-0 flex-1">
        {body}
      </div>
      {showActions && (
        <div
          data-slot="alert-header-actions"
          className="relative z-20 flex shrink-0 items-center gap-1"
        >
          {meta}
          {closable && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Close alert"
            >
              <IconX className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Kill any in-flight dismiss tween on unmount, so the onComplete callback
// can never fire on a dead component (§5).
function useDismissTweenCleanup(
  dismissTweenRef: React.RefObject<gsap.core.Tween | null>,
): void {
  React.useEffect(() => {
    const tweenRef = dismissTweenRef;

    return () => {
      tweenRef.current?.kill();
    };
  }, [dismissTweenRef]);
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      banner = false,
      showIcon = true,
      icon,
      closable = false,
      onClose,
      leftAccent = false,
      meta,
      children,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const innerRef = React.useRef<HTMLDivElement>(null);
    const dismissTweenRef = React.useRef<gsap.core.Tween | null>(null);
    const reducedMotion = useReducedMotion();
    const resolvedSize = size || "default";

    const iconNode = resolveIcon(icon, showIcon, variant);
    const hasIcon = iconNode !== null;

    React.useImperativeHandle(ref, () => innerRef.current!);

    useDismissTweenCleanup(dismissTweenRef);

    const handleClose = React.useCallback(() => {
      performDismiss(innerRef, dismissTweenRef, reducedMotion, () => {
        setIsVisible(false);
        onClose?.();
      });
    }, [onClose, reducedMotion]);

    if (!isVisible) return null;

    return (
      <div
        ref={innerRef}
        data-slot="alert"
        role="alert"
        className={cn(
          alertVariants({ variant, size, banner }),
          leftAccent && resolveAccentClass(variant),
          className,
        )}
        {...props}
      >
        <AlertHeaderRow
          hasIcon={hasIcon}
          iconNode={iconNode}
          iconClassName={resolveIconClassName(variant, resolvedSize)}
          body={children}
          meta={meta}
          closable={closable}
          onClose={handleClose}
        />
      </div>
    );
  },
);

Alert.displayName = "Alert";

function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

// =============================================================================
// AlertActions — per-alert action button row
// =============================================================================

interface AlertAction {
  label: React.ReactNode;
  onClick?: () => void;
  variant?: React.ComponentProps<typeof Button>["variant"];
}

interface AlertActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  actions: AlertAction[];
}

function AlertActions({ actions, className, ...props }: AlertActionsProps) {
  return (
    <div
      data-slot="alert-actions"
      className={cn("mt-3 flex flex-wrap gap-2", className)}
      {...props}
    >
      {actions.map((action, i) => (
        <Button
          key={i}
          size="sm"
          variant={resolveActionVariant(action.variant, i)}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

// =============================================================================
// Relative time helper
// =============================================================================

function formatRelativeTime(date: Date, now: number = Date.now()): string {
  const diff = now - date.getTime();
  const s = Math.floor(diff / 1000);

  if (s < 60) return "just now";
  const m = Math.floor(s / 60);

  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);

  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);

  return `${d}d ago`;
}

function useRelativeTime(date?: Date): string | null {
  // `now` is captured once per mount via a lazy initializer (pure render —
  // no Date.now() during render); the tick state re-renders every 30s and
  // recomputes the label with the stored value.
  const [now] = React.useState(() => Date.now());
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!date) return;
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);

    return () => clearInterval(interval);
  }, [date]);

  if (!date) {
    return null;
  }

  return formatRelativeTime(date, now);
}

// =============================================================================
// KiraAlert — one prop-driven inline alert
// =============================================================================

// Strip replacing the alert after dismissal (undoDismiss only). Instant
// swap for everyone — calm by design (§3.5), no reduced-motion gate needed.
// role="status" announces "Dismissed" politely; Undo is reachable by name.
// Timer pauses on hover or focus within the strip (§9 SC 2.2.2).
interface UndoStripProps {
  onPause: () => void;
  onResume: () => void;
  onUndo: () => void;
}

function UndoStrip({ onPause, onResume, onUndo }: UndoStripProps) {
  return (
    <div
      data-slot="alert-undo"
      role="status"
      className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground"
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocusCapture={onPause}
      onBlurCapture={(e) => {
        // SAFETY: relatedTarget is null (focus left the window) or a Node
        // in the same document; contains() only needs null vs Node.
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onResume();
        }
      }}
    >
      <span>Dismissed</span>
      <button
        type="button"
        onClick={onUndo}
        className="rounded-sm font-medium text-foreground underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Undo
      </button>
    </div>
  );
}

// Undo-dismiss state machine: pause/extend timer per §9 SC 2.2.2. The
// callbacks are stable; `expired` flips false→true when the window elapses
// without interaction. Callers render the strip while `dismissed` is true.
function useUndoDismiss(duration: number) {
  const [dismissed, setDismissed] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);
  const remainingRef = React.useRef(duration);
  const startedAtRef = React.useRef(0);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pause = React.useCallback(() => {
    if (timerRef.current === null) {
      return;
    }

    window.clearTimeout(timerRef.current);
    timerRef.current = null;
    remainingRef.current -= Date.now() - startedAtRef.current;
  }, []);

  const resume = React.useCallback(() => {
    if (timerRef.current !== null) {
      return;
    }

    startedAtRef.current = Date.now();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setDismissed(false);
    }, remainingRef.current);
  }, []);

  const dismiss = React.useCallback(() => {
    clearTimer();
    remainingRef.current = duration;
    setDismissed(true);
    resume();
  }, [clearTimer, duration, resume]);

  const undo = React.useCallback(() => {
    clearTimer();
    setDismissed(false);
  }, [clearTimer]);

  React.useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return { dismissed, dismiss, undo, pause, resume };
}

// Meta cluster (timestamp + copy), rendered into Alert's header row via the
// `meta` prop — never self-positioned, never stacked above the title.
interface KiraMetaProps {
  relative: string | null;
  copied: boolean;
  onCopy: () => void;
}

function KiraMeta({ relative, copied, onCopy }: KiraMetaProps) {
  let CopyGlyph = <IconCopy className="h-3.5 w-3.5" />;

  if (copied) {
    CopyGlyph = <IconCheck className="h-3.5 w-3.5" />;
  }

  return (
    <div data-slot="alert-meta" className="flex items-center gap-2">
      {relative && (
        <span className="text-xs opacity-70 whitespace-nowrap">{relative}</span>
      )}
      <button
        type="button"
        onClick={onCopy}
        className="rounded-md p-1.5 opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label="Copy alert text"
      >
        {CopyGlyph}
        <span aria-live="polite" className="sr-only">
          {copied && "Copied"}
        </span>
      </button>
    </div>
  );
}

// Progressive disclosure behind a Show more / less toggle. Grid-rows
// animation; instant under reduced motion (§5).
interface KiraExpandableProps {
  expanded: boolean;
  onToggle: () => void;
  reducedMotion: boolean;
  expandedContent: React.ReactNode;
}

function KiraExpandable({
  expanded,
  onToggle,
  reducedMotion,
  expandedContent,
}: KiraExpandableProps) {
  let gridRows = "grid-rows-[0fr]";

  if (expanded) {
    gridRows = "grid-rows-[1fr]";
  }

  let toggleLabel = "Show more";

  if (expanded) {
    toggleLabel = "Show less";
  }

  return (
    <>
      <div
        className={cn(
          "grid",
          !reducedMotion && "transition-[grid-template-rows] duration-200",
          gridRows,
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-2 text-sm">{expandedContent}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="mt-1 inline-flex items-center gap-1 rounded-sm text-xs font-medium opacity-80 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-expanded={expanded}
      >
        {toggleLabel}
        <IconChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            reducedMotion && "transition-none",
            expanded && "rotate-180",
          )}
        />
      </button>
    </>
  );
}

interface KiraAlertProps extends Omit<AlertProps, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Override the auto icon (or `null` to hide). */
  icon?: React.ReactNode | null;
  /** Action buttons rendered under the body. */
  actions?: AlertAction[];
  /** Collapsible extra content behind a Show more / less toggle. */
  expandable?: boolean;
  expandedContent?: React.ReactNode;
  /** Copy-to-clipboard affordance. */
  copyable?: boolean;
  copyText?: string;
  /** Show a relative timestamp in the corner. */
  timestamp?: Date;
  dismissible?: boolean;
  /** Dismiss shows a "Dismissed — Undo" strip for a short window instead of
      unmounting immediately. */
  undoDismiss?: boolean;
  /** How long the undo strip stays visible (ms). */
  undoDuration?: number;
  children?: React.ReactNode;
}

// Copy-to-clipboard with a 1.5s check-glyph flash. Clipboard failure is
// silent by design — the button is a convenience (permissions, non-secure
// contexts).
function useCopyFlash(text: string) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = React.useCallback(() => {
    if (!text) {
      return;
    }

    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {
        // Clipboard can be unavailable (permissions, non-secure context);
        // failing silently is fine — the button is a convenience.
      });
  }, [text]);

  return { copied, onCopy };
}

// Body content of a KiraAlert: title, description, caller children,
// expandable section, and the action row.
interface KiraAlertBodyProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  expandable: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
  reducedMotion: boolean;
  expandedContent?: React.ReactNode;
  actions?: AlertAction[];
}

function KiraAlertBody({
  title,
  description,
  children,
  expandable,
  expanded,
  onToggleExpanded,
  reducedMotion,
  expandedContent,
  actions,
}: KiraAlertBodyProps) {
  const hasActions = Boolean(actions && actions.length > 0);

  return (
    <>
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
      {children}
      {expandable && (
        <KiraExpandable
          expanded={expanded}
          onToggle={onToggleExpanded}
          reducedMotion={reducedMotion}
          expandedContent={expandedContent}
        />
      )}
      {hasActions && <AlertActions actions={actions!} />}
    </>
  );
}

// Caller-provided `meta` wins over the internally-built one; the internal
// cluster renders only when there is a timestamp or copy affordance.
function resolveKiraMeta(
  callerMeta: React.ReactNode,
  copyable: boolean,
  relative: string | null,
  metaNode: React.ReactNode,
): React.ReactNode {
  if (callerMeta !== undefined) {
    return callerMeta;
  }

  if (copyable || relative) {
    return metaNode;
  }

  return undefined;
}

// Non-undo dismissals delegate to Alert's internal GSAP close (undefined
// intercept → Alert uses its own handleClose); the undo path intercepts so
// the strip replaces the alert. The caller's onClose runs alongside the
// intercept so parent state stays consistent with what the user last saw.
type AlertOnClose = (() => void) | undefined;

function composeOnClose(
  caller: AlertOnClose,
  dismissible: boolean,
  undoDismiss: boolean,
  intercept: () => void,
): AlertOnClose {
  if (!dismissible || !undoDismiss) {
    return caller;
  }

  if (caller) {
    return () => {
      intercept();
      caller();
    };
  }

  return intercept;
}

function KiraAlert({
  title,
  description,
  icon,
  actions,
  expandable = false,
  expandedContent,
  copyable = false,
  copyText,
  timestamp,
  dismissible = false,
  undoDismiss = false,
  undoDuration = 5000,
  variant = "default",
  showIcon = true,
  children,
  ...alertProps
}: KiraAlertProps) {
  const [expanded, setExpanded] = React.useState(false);
  const reducedMotion = useReducedMotion();
  const relative = useRelativeTime(timestamp);
  const undo = useUndoDismiss(undoDuration);
  const copyTextSource = copySourceText(copyText, title, description);
  const copy = useCopyFlash(copyTextSource);

  const metaNode = (
    <KiraMeta relative={relative} copied={copy.copied} onCopy={copy.onCopy} />
  );

  const meta = resolveKiraMeta(alertProps.meta, copyable, relative, metaNode);

  // Non-undo dismissals delegate to Alert's internal GSAP close; the undo
  // path intercepts so the strip replaces the alert instead. The caller's
  // onClose composes with the intercept and fires at dismiss time (not
  // undo-expiry) — parent state matches what the user last saw; undo is
  // purely visual restoration.
  const closeHandler = composeOnClose(
    alertProps.onClose,
    dismissible,
    undoDismiss,
    undo.dismiss,
  );

  const toggleExpanded = React.useCallback(() => {
    setExpanded((e) => !e);
  }, []);

  if (undo.dismissed) {
    return (
      <UndoStrip
        onPause={undo.pause}
        onResume={undo.resume}
        onUndo={undo.undo}
      />
    );
  }

  return (
    <Alert
      variant={variant}
      showIcon={showIcon}
      icon={icon}
      closable={dismissible}
      meta={meta}
      {...alertProps}
      onClose={closeHandler}
    >
      <KiraAlertBody
        title={title}
        description={description}
        expandable={expandable}
        expanded={expanded}
        onToggleExpanded={toggleExpanded}
        reducedMotion={reducedMotion}
        expandedContent={expandedContent}
        actions={actions}
      >
        {children}
      </KiraAlertBody>
    </Alert>
  );
}

export {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertActions,
  KiraAlert,
  alertVariants,
  formatRelativeTime,
};

export type {
  AlertProps,
  AlertActionsProps,
  AlertAction,
  KiraAlertProps,
  AlertVariant,
};
