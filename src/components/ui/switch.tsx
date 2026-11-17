/* oxlint-disable react/only-export-components -- public compound component and variant exports */
"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cva } from "class-variance-authority";
import { IconLoader } from "@tabler/icons-react";
import { cn } from "cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toast";

const switchTrackVariants = cva(
  [
    "relative inline-flex shrink-0 items-center rounded-full cursor-pointer",
    // Invisible hit-area extension (WCAG 2.5.8) — the track no longer inflates.
    "after:absolute after:-inset-x-2 after:-inset-y-2 after:rounded-full after:content-['']",
    "transition-[background-color,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
    "motion-reduce:transition-none",
    // Button-exemplar focus ring (no offset — the hit area already pads).
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    // Single error path: `error` prop and Field both set aria-invalid.
    "aria-invalid:bg-destructive",
    "touch-action-manipulation",
  ],
  {
    variants: {
      size: {
        // sm grows to a 40x24 track (24px minimum height, WCAG 2.5.8).
        sm: "h-6 w-10 px-1",
        default: "h-6 w-11 px-0.5",
        lg: "h-7 w-[52px] px-0.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const switchThumbVariants = cva(
  [
    "pointer-events-none block rounded-full bg-white shadow-sm",
    // Tailwind v4 translate-x-*/scale-* set the CSS `translate`/`scale`
    // properties (NOT `transform`) — both must be listed or the thumb jumps.
    "transition-[translate,scale,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
    "motion-reduce:transition-none",
    "flex items-center justify-center",
    "translate-x-0 data-[unchecked]:translate-x-0",
    "active:scale-95 data-[pressed]:scale-95",
  ],
  {
    variants: {
      size: {
        sm: "h-4 w-4 data-[checked]:translate-x-4",
        default: "h-5 w-5 data-[checked]:translate-x-5",
        lg: "h-6 w-6 data-[checked]:translate-x-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface SwitchProps extends Omit<
  SwitchPrimitive.Root.Props,
  "checked" | "onCheckedChange" | "defaultChecked" | "className"
> {
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "default" | "lg";
  color?: "default" | "success" | "destructive" | "warning";
  label?: string;
  description?: string;
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  thumbIcon?: React.ReactNode;
  thumbIconChecked?: React.ReactNode;
  labelPosition?: "start" | "end";
  checkedLabel?: string;
  uncheckedLabel?: string;
  /** Flip immediately; notify onCheckedChange after the commit succeeds. */
  optimistic?: boolean;
  onCommit?: (checked: boolean) => Promise<void>;
  commitErrorTitle?: React.ReactNode;
  disabledReason?: React.ReactNode;
}

function useSwitchCommit(props: SwitchProps) {
  const [pending, setPending] = React.useState<boolean | null>(null);
  const inFlight = React.useRef(false);

  const commit = async (checked: boolean) => {
    const { optimistic, onCommit, onCheckedChange } = props;

    if (inFlight.current) return;

    if (!optimistic || !onCommit || props.checked === undefined) {
      onCheckedChange?.(checked);

      return;
    }

    inFlight.current = true;
    setPending(checked);

    try {
      await onCommit(checked);
      onCheckedChange?.(checked);
    } catch {
      toast.error(props.commitErrorTitle ?? "Couldn't save that", {
        description: "The change was reverted.",
      });
    } finally {
      inFlight.current = false;
      setPending(null);
    }
  };

  return {
    checked: pending ?? props.checked,
    pending: pending !== null,
    commit,
  };
}

const SwitchGroupDisabledContext = React.createContext(false);

function useSwitchDisabled(disabled: boolean | undefined) {
  const groupDisabled = React.useContext(SwitchGroupDisabledContext);

  return Boolean(disabled || groupDisabled);
}

function useSwitchModel(props: SwitchProps) {
  const disabled = useSwitchDisabled(props.disabled);
  const generatedId = React.useId();
  const id = props.id ?? generatedId;
  const commit = useSwitchCommit(props);
  const reasonId = `${id}-reason`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const showReason = Boolean(disabled && props.disabledReason);

  const describedBy =
    [
      props["aria-describedby"],
      props.description && descriptionId,
      props.errorMessage && errorId,
      showReason && reasonId,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return {
    ...commit,
    id,
    reasonId,
    descriptionId,
    errorId,
    showReason,
    describedBy,
    busy: Boolean(props.loading || commit.pending),
    disabled: Boolean(disabled || props.loading),
    readOnly: Boolean(props.readOnly || commit.pending),
  };
}

type SwitchModel = ReturnType<typeof useSwitchModel>;

const switchIconSizes = {
  sm: "h-2.5 w-2.5",
  default: "h-3 w-3",
  lg: "h-3.5 w-3.5",
};

const switchColors = {
  default: "bg-primary",
  success: "bg-success",
  destructive: "bg-destructive",
  warning: "bg-warning",
};

function SwitchThumbContent({
  props,
  checked,
  busy,
}: {
  props: SwitchProps;
  checked: boolean;
  busy: boolean;
}) {
  const reduced = useReducedMotion();
  const iconSizeClass = switchIconSizes[props.size ?? "default"];
  const label = checked ? props.checkedLabel : props.uncheckedLabel;

  return (
    <>
      <span aria-hidden="true">
        {busy ? (
          <IconLoader
            className={cn(
              "text-muted-foreground",
              iconSizeClass,
              !reduced && "animate-spin",
            )}
          />
        ) : (
          <ThumbIcon
            checked={checked}
            thumbIcon={props.thumbIcon}
            thumbIconChecked={props.thumbIconChecked}
            iconSizeClass={iconSizeClass}
          />
        )}
      </span>
      {(props.checkedLabel || props.uncheckedLabel) && (
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {label ?? (checked ? "On" : "Off")}
        </span>
      )}
    </>
  );
}

function SwitchTrack({
  props,
  model,
}: {
  props: SwitchProps;
  model: SwitchModel;
}) {
  const {
    className: _className,
    checked: _checked,
    defaultChecked,
    onCheckedChange: _onCheckedChange,
    size = "default",
    color = "default",
    label,
    description: _description,
    loading: _loading,
    error: _error,
    errorMessage: _errorMessage,
    thumbIcon: _thumbIcon,
    thumbIconChecked: _thumbIconChecked,
    labelPosition: _labelPosition,
    checkedLabel: _checkedLabel,
    uncheckedLabel: _uncheckedLabel,
    optimistic: _optimistic,
    onCommit: _onCommit,
    commitErrorTitle: _commitErrorTitle,
    disabledReason: _disabledReason,
    ...rootProps
  } = props;

  const invalid =
    props.error || props.errorMessage ? true : props["aria-invalid"];

  return (
    <SwitchPrimitive.Root
      {...rootProps}
      data-slot="switch"
      id={model.id}
      aria-label={props["aria-label"] ?? label}
      checked={model.checked}
      defaultChecked={defaultChecked}
      onCheckedChange={model.commit}
      disabled={model.disabled}
      readOnly={model.readOnly}
      aria-busy={model.busy || undefined}
      aria-describedby={model.describedBy}
      aria-invalid={invalid}
      aria-errormessage={
        props.errorMessage ? model.errorId : props["aria-errormessage"]
      }
      className={({ checked }) =>
        cn(
          switchTrackVariants({ size }),
          checked ? switchColors[color] : "bg-muted-foreground/30",
        )
      }
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={switchThumbVariants({ size })}
        render={(thumbProps, state) => (
          <span {...thumbProps}>
            <SwitchThumbContent
              props={props}
              checked={state.checked}
              busy={model.busy}
            />
          </span>
        )}
      />
    </SwitchPrimitive.Root>
  );
}

function SwitchLabel({
  props,
  model,
}: {
  props: SwitchProps;
  model: SwitchModel;
}) {
  return (
    <div
      data-slot="switch-content"
      className="flex min-w-0 flex-col gap-0.5 pt-0.5"
    >
      {props.label && (
        <label
          htmlFor={model.id}
          className={cn(
            "text-sm font-medium leading-5 cursor-pointer select-none",
            model.disabled && "cursor-not-allowed opacity-70",
          )}
        >
          {props.label}
          {props.required && (
            <span className="text-destructive ms-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {props.description && (
        <p id={model.descriptionId} className="text-sm text-muted-foreground">
          {props.description}
        </p>
      )}
      {props.errorMessage && (
        <p id={model.errorId} className="text-sm text-destructive" role="alert">
          {props.errorMessage}
        </p>
      )}
    </div>
  );
}

function DisabledReasonAnchor({
  reason,
  describedBy,
  label,
  children,
}: {
  reason: React.ReactNode;
  describedBy: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div data-slot="switch-reason-anchor" className="relative inline-flex">
      {children}
      <Tooltip delay={0}>
        <TooltipTrigger
          render={
            <button
              type="button"
              aria-label={label}
              aria-describedby={describedBy}
              className="absolute inset-0 cursor-not-allowed rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          }
        />
        <TooltipContent side="top">{reason}</TooltipContent>
      </Tooltip>
    </div>
  );
}

function Switch(props: SwitchProps) {
  const model = useSwitchModel(props);

  const withContent = Boolean(
    props.label || props.description || props.errorMessage,
  );

  const element = (
    <div
      data-slot="switch-field"
      className={cn(
        "inline-flex min-w-0 gap-3",
        withContent ? "items-start" : "items-center",
        props.labelPosition === "start" && "flex-row-reverse",
        props.className,
      )}
    >
      <SwitchTrack props={props} model={model} />
      {withContent && <SwitchLabel props={props} model={model} />}
      {model.showReason && (
        <span id={model.reasonId} className="sr-only">
          {props.disabledReason}
        </span>
      )}
    </div>
  );

  if (!model.showReason) return element;

  return (
    <DisabledReasonAnchor
      reason={props.disabledReason}
      describedBy={model.reasonId}
      label={props.label ?? props["aria-label"] ?? "Unavailable setting"}
    >
      {element}
    </DisabledReasonAnchor>
  );
}

function ThumbIcon({
  checked,
  thumbIcon,
  thumbIconChecked,
  iconSizeClass,
}: {
  checked: boolean;
  thumbIcon?: React.ReactNode;
  thumbIconChecked?: React.ReactNode;
  iconSizeClass: string;
}) {
  const wrapperClass =
    "relative flex items-center justify-center [&_svg]:w-full [&_svg]:h-full";

  if (thumbIcon && thumbIconChecked)
    return (
      <span className={cn(wrapperClass, iconSizeClass)}>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-[opacity,rotate,scale] duration-200 ease-out motion-reduce:transition-none",
            checked
              ? "opacity-0 rotate-90 scale-50"
              : "opacity-100 rotate-0 scale-100 text-muted-foreground",
          )}
        >
          {thumbIcon}
        </span>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-[opacity,rotate,scale] duration-200 ease-out motion-reduce:transition-none",
            checked
              ? "opacity-100 rotate-0 scale-100 text-primary"
              : "opacity-0 -rotate-90 scale-50",
          )}
        >
          {thumbIconChecked}
        </span>
      </span>
    );

  const icon = checked ? (thumbIconChecked ?? thumbIcon) : thumbIcon;

  return icon ? (
    <span
      className={cn(
        wrapperClass,
        checked ? "text-primary" : "text-muted-foreground",
        iconSizeClass,
      )}
    >
      {icon}
    </span>
  ) : null;
}

interface SwitchGroupProps extends React.ComponentProps<"fieldset"> {
  label?: string;
  orientation?: "horizontal" | "vertical";
}

function SwitchGroup({
  label,
  orientation = "vertical",
  className,
  children,
  disabled = false,
  ...props
}: SwitchGroupProps) {
  const parentDisabled = React.useContext(SwitchGroupDisabledContext);
  const groupDisabled = parentDisabled || disabled;

  return (
    <SwitchGroupDisabledContext.Provider value={groupDisabled}>
      <fieldset
        disabled={groupDisabled}
        data-slot="switch-group"
        className={cn(
          "min-w-0",
          orientation === "vertical"
            ? "flex flex-col gap-3"
            : "flex flex-row gap-4 flex-wrap",
          className,
        )}
        {...props}
      >
        {label && (
          <legend
            data-slot="switch-group-label"
            className="mb-3 text-sm font-medium text-foreground"
          >
            {label}
          </legend>
        )}
        {children}
      </fieldset>
    </SwitchGroupDisabledContext.Provider>
  );
}

export { Switch, SwitchGroup, switchTrackVariants, switchThumbVariants };

export type { SwitchProps, SwitchGroupProps };
