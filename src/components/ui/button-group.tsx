/* oxlint-disable react/only-export-components -- compound component exports are required by the public API */
"use client";

import * as React from "react";
import { omitComponentProps } from "@/lib/component-native-props";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cva } from "class-variance-authority";
import { IconLoader2 } from "@tabler/icons-react";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cn } from "cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Separator, type SeparatorProps } from "@/components/ui/separator";
import { resolveComponentDefaults } from "@/lib/component-defaults";

const buttonGroupVariants = cva(
  "inline-flex items-center [&>[data-slot=button]]:shadow-none [&>[data-slot=toggle-group-item]]:shadow-none *:focus-visible:relative *:focus-visible:z-10 [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "flex-row [&>[data-slot=button]]:w-auto [&>[data-slot=toggle-group-item]]:w-auto",
        vertical:
          "flex-col [&>[data-slot=button]]:w-full [&>[data-slot=toggle-group-item]]:w-full",
      },
      connected: {
        true: "gap-0",
        false: "gap-1",
      },

      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape names denote the intentional public geometric corner API and CVA variant keys; renaming them would break consumers.
      shape: {
        default: "",
        pill: "rounded-full [&>[data-slot=button]]:rounded-full [&>[data-slot=toggle-group-item]]:rounded-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      connected: true,

      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape names denote the intentional public geometric corner API and CVA variant keys; renaming them would break consumers.
      shape: "default",
    },
  },
);

const buttonGroupSizeVariants = cva("inline-flex", {
  variants: {
    size: {
      xs: "[&>[data-slot=button]]:h-6 [&>[data-slot=button]]:px-2 [&>[data-slot=button]]:text-xs [&>[data-slot=toggle-group-item]]:h-6 [&>[data-slot=toggle-group-item]]:px-2 [&>[data-slot=toggle-group-item]]:text-xs",
      // kira-kit-ignore arbitrary-values: compact button-group keeps 12.8px text (documented inconsistency, PR follow-up)
      // kira-kit-ignore spacing-scale: compact button-group ladder is a documented non-change (PR follow-up)
      sm: "[&>[data-slot=button]]:h-7 [&>[data-slot=button]]:px-2.5 [&>[data-slot=button]]:text-[0.8rem] [&>[data-slot=toggle-group-item]]:h-7 [&>[data-slot=toggle-group-item]]:px-2.5 [&>[data-slot=toggle-group-item]]:text-[0.8rem]",
      default:
        // kira-kit-ignore spacing-scale: compact button-group ladder is a documented non-change (PR follow-up)
        "[&>[data-slot=button]]:h-8 [&>[data-slot=button]]:px-2.5 [&>[data-slot=button]]:text-sm [&>[data-slot=toggle-group-item]]:h-8 [&>[data-slot=toggle-group-item]]:px-2.5 [&>[data-slot=toggle-group-item]]:text-sm",
      lg: "[&>[data-slot=button]]:h-9 [&>[data-slot=button]]:px-3 [&>[data-slot=button]]:text-base [&>[data-slot=toggle-group-item]]:h-9 [&>[data-slot=toggle-group-item]]:px-3 [&>[data-slot=toggle-group-item]]:text-base",
    },
    gap: {
      none: "gap-0",
      // kira-kit-ignore spacing-scale: compact button-group ladder is a documented non-change (PR follow-up)
      sm: "gap-0.5",
      default: "gap-1",
      lg: "gap-2",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    },
  },
  defaultVariants: {
    size: "default",
    gap: undefined,
    justify: "start",
  },
});

// Connected-group seam: flatten the inner edges of buttons/toggle items with
// logical properties (RTL-safe) instead of cloneElement position classes.
// Scoped to buttons/items only so separators keep their own borders.
const connectedRoundingClasses = {
  horizontal:
    "[&>[data-slot=button]:not(:last-child)]:rounded-e-none [&>[data-slot=toggle-group-item]:not(:last-child)]:rounded-e-none [&>[data-slot=button]+[data-slot=button]]:rounded-s-none [&>[data-slot=button]+[data-slot=button]]:border-s-0 [&>[data-slot=toggle-group-item]+[data-slot=toggle-group-item]]:rounded-s-none [&>[data-slot=toggle-group-item]+[data-slot=toggle-group-item]]:border-s-0",
  vertical:
    "[&>[data-slot=button]:not(:last-child)]:rounded-b-none [&>[data-slot=toggle-group-item]:not(:last-child)]:rounded-b-none [&>[data-slot=button]+[data-slot=button]]:rounded-t-none [&>[data-slot=button]+[data-slot=button]]:border-t-0 [&>[data-slot=toggle-group-item]+[data-slot=toggle-group-item]]:rounded-t-none [&>[data-slot=toggle-group-item]+[data-slot=toggle-group-item]]:border-t-0",
};

type ButtonGroupOrientation = "horizontal" | "vertical";

type ButtonGroupSize = "xs" | "sm" | "default" | "lg";

type ButtonGroupGap = "none" | "sm" | "default" | "lg";

type ButtonGroupJustify = "start" | "center" | "end" | "between" | "around";

// oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape names denote the intentional public geometric corner API and CVA variant keys; renaming them would break consumers.
type ButtonGroupShape = "default" | "pill";

type SelectionMode = "none" | "single" | "multiple";

/** Deselecting the active single-select item emits `null` (was `""`). */
type ButtonGroupValue = string | string[] | null;

interface ButtonGroupContextValue {
  selectable: boolean;
  variant?: ButtonProps["variant"];
  disabled?: boolean;
  segmented?: boolean;
}

const ButtonGroupContext = React.createContext<ButtonGroupContextValue | null>(
  null,
);

const useButtonGroupContext = () => {
  const context = React.useContext(ButtonGroupContext);

  if (!context) {
    throw new Error(
      "ButtonGroup compound components must be used within a ButtonGroup",
    );
  }

  return context;
};

interface ButtonGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  orientation?: ButtonGroupOrientation;
  size?: ButtonGroupSize;
  gap?: ButtonGroupGap;
  justify?: ButtonGroupJustify;

  // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape names denote the intentional public geometric corner API and CVA variant keys; renaming them would break consumers.
  shape?: ButtonGroupShape;
  value?: ButtonGroupValue;
  onChange?: (value: ButtonGroupValue) => void;
  selectionMode?: SelectionMode;
  connected?: boolean;
  /**
   * Segmented-control mode: renders an animated sliding pill behind the
   * selected item. Only meaningful with `selectionMode="single"`.
   */
  segmented?: boolean;
  animated?: boolean;
  animationStagger?: number;
  variant?: ButtonProps["variant"];
  disabled?: boolean;
  loop?: boolean;
  dir?: "ltr" | "rtl";
}

/** Entrance stagger for group buttons; no-op unless animated and motion allowed. */
function useEntranceAnimation(
  containerRef: React.RefObject<HTMLDivElement | null>,
  {
    animated,
    orientation,
    animationStagger,
    reducedMotion,
  }: {
    animated: boolean;
    orientation: ButtonGroupOrientation;
    animationStagger: number;
    reducedMotion: boolean;
  },
) {
  useGSAP(
    () => {
      if (!animated || reducedMotion || !containerRef.current) return;

      const buttons = containerRef.current.querySelectorAll(
        "[data-slot=button], [data-slot=toggle-group-item]",
      );

      if (buttons.length > 0) {
        let y = 0;

        if (orientation === "vertical") {
          y = -10;
        }

        let x = 0;

        if (orientation === "horizontal") {
          x = -10;
        }

        gsap.from(buttons, {
          opacity: 0,
          y,
          x,
          stagger: animationStagger / 1000,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    {
      scope: containerRef,
      dependencies: [animated, orientation, animationStagger, reducedMotion],
    },
  );
}

/** Segmented sliding pill: measure the selected item and slide behind it. */
function useSegmentedIndicator(
  containerRef: React.RefObject<HTMLDivElement | null>,
  indicatorRef: React.RefObject<HTMLDivElement | null>,
  {
    enabled,
    selectedValue,
    reducedMotion,
  }: {
    enabled: boolean;
    selectedValue: string | null;
    reducedMotion: boolean;
  },
) {
  useGSAP(
    () => {
      const container = containerRef.current;
      const indicator = indicatorRef.current;

      if (!enabled || !container || !indicator) return;

      const selected = container.querySelector<HTMLElement>(
        '[data-slot="toggle-group-item"][data-pressed]',
      );

      if (!selected) {
        gsap.to(indicator, { autoAlpha: 0, duration: 0 });

        return;
      }

      const cRect = container.getBoundingClientRect();
      const sRect = selected.getBoundingClientRect();

      let duration = 0.25;

      if (reducedMotion) {
        duration = 0;
      }

      gsap.to(indicator, {
        autoAlpha: 1,
        x: sRect.left - cRect.left,
        y: sRect.top - cRect.top,
        width: sRect.width,
        height: sRect.height,
        duration,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    {
      scope: containerRef,
      dependencies: [enabled, selectedValue, reducedMotion],
    },
  );
}

/** Shared visual classes for the group container (both plain and primitive). */
function buildContainerClasses({
  orientation,
  size,
  gap,
  justify,

  // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape names denote the intentional public geometric corner API and CVA variant keys; renaming them would break consumers.
  shape: cornerStyle,
  connected,
  segmented,
  className,
}: Pick<
  ButtonGroupProps,
  | "orientation"
  | "size"
  | "gap"
  | "justify"
  | "shape"
  | "connected"
  | "segmented"
  | "className"
>): string {
  let resolvedGap = gap;

  if (connected && !gap) {
    resolvedGap = undefined;
  }

  return cn(
    // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape names denote the intentional public geometric corner API and CVA variant keys; renaming them would break consumers.
    buttonGroupVariants({ orientation, connected, shape: cornerStyle }),
    buttonGroupSizeVariants({
      size,
      gap: resolvedGap,
      justify,
    }),
    connected &&
      !segmented &&
      connectedRoundingClasses[orientation ?? "horizontal"],
    segmented &&
      "relative bg-muted p-1 rounded-lg gap-1 data-[connected=true]:gap-1",
    segmented && cornerStyle === "pill" && "rounded-full",
    className,
  );
}

/** Sliding pill behind the selected item in segmented mode. */
function SegmentedIndicator({
  indicatorRef,
  pill,
}: {
  indicatorRef: React.RefObject<HTMLDivElement | null>;
  pill: boolean;
}) {
  return (
    <div
      ref={indicatorRef}
      data-slot="segmented-indicator"
      aria-hidden="true"
      className={cn(
        "invisible absolute left-0 top-0 z-0 rounded-md bg-background shadow-sm",
        pill && "rounded-full",
      )}
    />
  );
}

// Public defaults; merged instead of inline destructuring defaults so the
// component body stays within the complexity budget.
const GROUP_DEFAULTS = {
  orientation: "horizontal",

  // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape names denote the intentional public geometric corner API and CVA variant keys; renaming them would break consumers.
  shape: "default",
  value: null,
  selectionMode: "none",
  connected: true,
  segmented: false,
  animated: false,
  animationStagger: 50,
  disabled: false,
  loop: true,
} as const;

function ButtonGroup(input0: ButtonGroupProps) {
  const state0 = useButtonGroupSetup(input0);
  const state1 = useButtonGroupActions(state0);

  return renderButtonGroup(state1);
}

interface ToggleGroupItemProps extends Omit<ButtonProps, "ref"> {
  value: string;
}

const pressedClassByVariant: Partial<
  Record<NonNullable<ButtonProps["variant"]>, string>
> = {
  outline:
    "data-[pressed]:bg-primary data-[pressed]:text-primary-foreground data-[pressed]:hover:bg-primary/90",
  default: "data-[pressed]:bg-primary data-[pressed]:text-primary-foreground",
  secondary:
    "data-[pressed]:bg-secondary data-[pressed]:text-secondary-foreground",
  ghost: "data-[pressed]:bg-muted",
  success: "data-[pressed]:bg-success data-[pressed]:text-success-foreground",
  warning: "data-[pressed]:bg-warning data-[pressed]:text-warning-foreground",
  destructive:
    "data-[pressed]:bg-destructive data-[pressed]:text-destructive-foreground",
};

function ToggleGroupItem({
  value,
  className,
  variant: localVariant = "outline",
  disabled: localDisabled,
  ...props
}: ToggleGroupItemProps) {
  const {
    selectable,
    variant: groupVariant,
    disabled: groupDisabled,
    segmented,
  } = useButtonGroupContext();

  const isDisabled = localDisabled ?? groupDisabled ?? false;

  let effectiveVariant = localVariant;

  if (localVariant === "outline") {
    effectiveVariant = groupVariant || "outline";
  }

  let buttonVariant = effectiveVariant;

  if (segmented) {
    buttonVariant = "ghost";
  }

  let itemClasses = pressedClassByVariant[effectiveVariant ?? "outline"];

  if (segmented) {
    itemClasses =
      "z-10 bg-transparent hover:bg-transparent text-muted-foreground data-[pressed]:text-foreground";
  }

  const button = (
    <Button
      data-slot="toggle-group-item"
      variant={buttonVariant}
      className={cn("relative overflow-hidden", itemClasses, className)}
      disabled={isDisabled}
      {...props}
    />
  );

  if (!selectable) {
    return button;
  }

  // The Base UI Toggle consumes the group context, supplies `data-pressed`
  // and `aria-pressed`, and merges its props onto the rendered Button
  // (render's props merge last, so `data-slot` survives).
  return (
    <TogglePrimitive value={value} disabled={isDisabled} render={button} />
  );
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: SeparatorProps) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn("mx-1 self-stretch", className)}
      {...props}
    />
  );
}

interface ButtonGroupTextProps extends useRender.ComponentProps<"div"> {}

function ButtonGroupText({
  className,
  render,
  ...props
}: ButtonGroupTextProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      // SAFETY: The default data-slot and className object is a valid div-props object.
      {
        "data-slot": "button-group-text",
        className: cn(
          "flex items-center [&_svg]:pointer-events-none px-2 text-sm text-muted-foreground",
          className,
        ),
      } as React.ComponentPropsWithoutRef<"div">,
      // SAFETY: ButtonGroupTextProps extends useRender.ComponentProps<"div">.
      props as React.ComponentPropsWithoutRef<"div">,
    ),
    render,
  });
}

interface ButtonGroupToolbarProps extends ButtonGroupProps {
  label?: string;
}

function ButtonGroupToolbar({
  label,
  className,
  children,
  ...props
}: ButtonGroupToolbarProps) {
  const toolbarId = React.useId();

  let labelId: string | undefined;

  if (label) {
    labelId = `${toolbarId}-label`;
  }

  let ariaLabel: string | undefined = "Button group toolbar";

  if (label) {
    ariaLabel = undefined;
  }

  return (
    <div
      role="toolbar"
      aria-labelledby={labelId}
      aria-label={ariaLabel}
      className={cn("flex flex-col gap-2", className)}
    >
      {label && (
        <span
          id={labelId}
          className="text-sm font-medium text-muted-foreground"
        >
          {label}
        </span>
      )}
      <ButtonGroup {...props}>{children}</ButtonGroup>
    </div>
  );
}

interface KiraButtonGroupItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonProps["variant"];
  className?: string;
  "aria-label"?: string;
}

interface KiraButtonGroupProps extends Omit<
  ButtonGroupProps,
  "children" | "onChange" | "defaultValue"
> {
  items?: KiraButtonGroupItem[];
  children?: React.ReactNode;
  value?: ButtonGroupValue;
  defaultValue?: ButtonGroupValue;
  onChange?: (value: ButtonGroupValue) => void;
  onValueChange?: (value: ButtonGroupValue) => void;
  selectionMode?: SelectionMode;
  type?: "single" | "multiple";
  required?: boolean;
  dir?: "ltr" | "rtl";
  fullWidth?: boolean;
  toolbar?: boolean;
  toolbarLabel?: string;
  allowEmpty?: boolean;
  onItemClick?: (value: string) => void;
}

function resolveSelectionMode(
  type: "single" | "multiple" | undefined,
  selectionMode: SelectionMode,
): SelectionMode {
  if (!type) {
    return selectionMode;
  }

  if (type === "single") {
    return "single";
  }

  return "multiple";
}

function shouldRejectSelectionChange(
  newValue: ButtonGroupValue,
  selectionMode: SelectionMode,
  required: boolean,
  allowEmpty: boolean,
): boolean {
  if (required && selectionMode === "single" && newValue === null) {
    return true;
  }

  if (
    required &&
    selectionMode === "multiple" &&
    Array.isArray(newValue) &&
    newValue.length === 0
  ) {
    return true;
  }

  return selectionMode === "single" && !allowEmpty && newValue === null;
}

function resolveCurrentValue(
  value: ButtonGroupValue | undefined,
  internalValue: ButtonGroupValue,
): ButtonGroupValue {
  let currentValue = internalValue;

  if (value !== undefined) {
    currentValue = value;
  }

  return currentValue;
}

function renderButtonGroupItems(
  items: KiraButtonGroupItem[] | undefined,
  onItemClick: ((value: string) => void) | undefined,
) {
  return items?.map((item) => {
    let leftIcon = item.icon;

    if (item.loading) {
      leftIcon = (
        <IconLoader2 className="size-4 animate-spin" aria-hidden="true" />
      );
    }

    return (
      <ToggleGroupItem
        key={item.value}
        value={item.value}
        disabled={item.disabled || item.loading}
        leftIcon={leftIcon}
        rightIcon={item.rightIcon}
        variant={item.variant}
        className={item.className}
        aria-label={item["aria-label"]}
        aria-busy={item.loading || undefined}
        onClick={() => onItemClick?.(item.value)}
      >
        {item.label}
      </ToggleGroupItem>
    );
  });
}

function getButtonGroupContent(
  items: KiraButtonGroupItem[] | undefined,
  children: React.ReactNode,
  onItemClick: ((value: string) => void) | undefined,
) {
  if (items && items.length > 0) {
    return renderButtonGroupItems(items, onItemClick);
  }

  return children;
}

function KiraButtonGroup(input: KiraButtonGroupProps) {
  const {
    items,
    children,
    value,
    defaultValue,
    onChange,
    onValueChange,
    selectionMode,
    type,
    required,
    dir,
    fullWidth,
    allowEmpty,
    toolbar,
    toolbarLabel,
    onItemClick,
    className,
    ...props
  } = resolveComponentDefaults(input, KIRA_BUTTON_GROUP_DEFAULTS_1);

  const [internalValue, setInternalValue] = React.useState<ButtonGroupValue>(
    defaultValue ?? null,
  );

  const isControlled = value !== undefined;
  const currentValue = resolveCurrentValue(value, internalValue);

  const resolvedSelectionMode = resolveSelectionMode(type, selectionMode);

  const handleChange = (newValue: ButtonGroupValue) => {
    if (
      shouldRejectSelectionChange(
        newValue,
        resolvedSelectionMode,
        required,
        allowEmpty,
      )
    ) {
      return;
    }

    if (!isControlled) setInternalValue(newValue);

    onChange?.(newValue);
    onValueChange?.(newValue);
  };

  const content = getButtonGroupContent(items, children, onItemClick);

  const group = (
    <ButtonGroup
      value={currentValue}
      onChange={handleChange}
      selectionMode={resolvedSelectionMode}
      className={cn(fullWidth && "w-full", !toolbar && className)}
      dir={dir}
      {...props}
    >
      {content}
    </ButtonGroup>
  );

  if (toolbar) {
    return (
      <ButtonGroupToolbar
        label={toolbarLabel}
        className={className}
        value={currentValue}
        onChange={handleChange}
        selectionMode={resolvedSelectionMode}
        dir={dir}
        {...props}
      >
        {content}
      </ButtonGroupToolbar>
    );
  }

  return group;
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  ButtonGroupToolbar,
  ToggleGroupItem,
  KiraButtonGroup,
  buttonGroupVariants,
  buttonGroupSizeVariants,
};

export type {
  ButtonGroupProps,
  ButtonGroupToolbarProps,
  ToggleGroupItemProps,
  ButtonGroupTextProps,
  KiraButtonGroupProps,
  KiraButtonGroupItem,
  SelectionMode,
};

type renderButtonGroupSectionPart1Args = {
  contextValue: ButtonGroupContextValue;
  containerRef: React.RefObject<HTMLDivElement | null>;
  primitiveValue: string[];
  handleGroupValueChange: (groupValue: string[]) => void;
  selectionMode: SelectionMode;
  orientation: ButtonGroupOrientation;
  loop: boolean;
  disabled: boolean;
  connected: boolean;
  segmented: boolean;
  dir: "ltr" | "rtl" | undefined;
  containerClasses: ReturnType<typeof buildContainerClasses>;
  props: Omit<
    React.ComponentPropsWithoutRef<"div">,
    "defaultValue" | "onChange"
  >;
  indicator: React.ReactNode;
  children: React.ReactNode;
};

function RenderButtonGroupSectionPart1({
  contextValue,
  containerRef,
  primitiveValue,
  handleGroupValueChange,
  selectionMode,
  orientation,
  loop,
  disabled,
  connected,
  segmented,
  dir,
  containerClasses,
  props,
  indicator,
  children,
}: renderButtonGroupSectionPart1Args) {
  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <ToggleGroupPrimitive
        ref={containerRef}
        value={primitiveValue}
        onValueChange={handleGroupValueChange}
        multiple={selectionMode === "multiple"}
        orientation={orientation}
        loopFocus={loop}
        disabled={disabled}
        aria-orientation={orientation}
        data-slot="button-group"
        data-connected={connected}
        data-segmented={segmented || undefined}
        dir={dir}
        className={containerClasses}
        {...props}
      >
        {indicator}
        {children}
      </ToggleGroupPrimitive>
    </ButtonGroupContext.Provider>
  );
}

type renderButtonGroupSectionPart2Args = {
  contextValue: ButtonGroupContextValue;
  containerRef: React.RefObject<HTMLDivElement | null>;
  orientation: ButtonGroupOrientation;
  connected: boolean;
  segmented: boolean;
  dir: "ltr" | "rtl" | undefined;
  containerClasses: ReturnType<typeof buildContainerClasses>;
  props: Omit<
    React.ComponentPropsWithoutRef<"div">,
    "defaultValue" | "onChange"
  >;
  indicator: React.ReactNode;
  children: React.ReactNode;
};

function RenderButtonGroupSectionPart2({
  contextValue,
  containerRef,
  orientation,
  connected,
  segmented,
  dir,
  containerClasses,
  props,
  indicator,
  children,
}: renderButtonGroupSectionPart2Args) {
  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        data-slot="button-group"

        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This composite div groups controls or content without introducing fieldset form behavior, default styling, or a different public ref element.
        role="group"
        data-orientation={orientation}
        data-connected={connected}
        data-segmented={segmented || undefined}
        dir={dir}
        className={containerClasses}
        {...props}
      >
        {indicator}
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const KIRA_BUTTON_GROUP_DEFAULTS_1 = {
  selectionMode: "none",
  required: false,
  fullWidth: false,
  allowEmpty: true,
  toolbar: false,
} as const;

function useButtonGroupSetup(groupProps: ButtonGroupProps) {
  const resolvedProps = resolveComponentDefaults(groupProps, GROUP_DEFAULTS);

  const {
    value,
    variant,
    orientation,
    // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- `shape` is a published corner-style prop retained for API compatibility.
    shape: cornerStyle,
    selectionMode,
    segmented,
    animated,
    animationStagger,
    disabled,
  } = resolvedProps;
  // SAFETY: The excluded keys are exactly those removed by the original native-prop rest binding.

  const props = omitComponentProps(resolvedProps, [
    "className",
    "size",
    "gap",
    "justify",
    "value",
    "onChange",
    "variant",
    "dir",
    "children",
    "orientation",
    "shape",
    "selectionMode",
    "connected",
    "segmented",
    "animated",
    "animationStagger",
    "disabled",
    "loop",
  ] as const);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const indicatorRef = React.useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  const isSelectable = selectionMode !== "none";

  useEntranceAnimation(containerRef, {
    animated,
    orientation,
    animationStagger,
    reducedMotion,
  });

  // Base UI sets `data-pressed` on pressed items (presence attribute).
  const singleValue = Array.isArray(value) ? null : value;

  useSegmentedIndicator(containerRef, indicatorRef, {
    enabled: segmented,
    selectedValue: singleValue,
    reducedMotion,
  });

  const contextValue: ButtonGroupContextValue = {
    selectable: isSelectable,
    variant,
    disabled,
    segmented,
  };

  return {
    ...resolvedProps,
    cornerStyle,
    props,
    containerRef,
    indicatorRef,
    isSelectable,
    contextValue,
  };
}

function useButtonGroupActions(state: ReturnType<typeof useButtonGroupSetup>) {
  const {
    className,
    size,
    gap,
    justify,
    value,
    onChange,
    orientation,
    cornerStyle,
    selectionMode,
    connected,
    segmented,
    indicatorRef,
  } = state;

  // Base UI ToggleGroup values are always arrays — including single-select
  // (deselect yields []). Normalize both directions against the public API.
  let primitiveValue: string[] = [];

  if (Array.isArray(value)) {
    primitiveValue = value;
  } else if (value) {
    primitiveValue = [value];
  }

  const handleGroupValueChange = (groupValue: string[]) => {
    let next: ButtonGroupValue = groupValue;

    if (selectionMode === "single") {
      next = groupValue[0] ?? null;
    }

    onChange?.(next);
  };

  const containerClasses = buildContainerClasses({
    orientation,
    size,
    gap,
    justify,

    // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape names denote the intentional public geometric corner API and CVA variant keys; renaming them would break consumers.
    shape: cornerStyle,
    connected,
    segmented,
    className,
  });

  let indicator: React.ReactNode = null;

  if (segmented) {
    indicator = (
      <SegmentedIndicator
        indicatorRef={indicatorRef}
        pill={cornerStyle === "pill"}
      />
    );
  }

  return {
    ...state,
    primitiveValue,
    handleGroupValueChange,
    containerClasses,
    indicator,
  };
}

function renderButtonGroup({
  dir,
  children,
  orientation,
  selectionMode,
  connected,
  segmented,
  disabled,
  loop,
  props,
  containerRef,
  isSelectable,
  contextValue,
  primitiveValue,
  handleGroupValueChange,
  containerClasses,
  indicator,
}: ReturnType<typeof useButtonGroupActions>) {
  if (!isSelectable) {
    return (
      <RenderButtonGroupSectionPart2
        {...{
          contextValue,
          containerRef,
          orientation,
          connected,
          segmented,
          dir,
          containerClasses,
          props,
          indicator,
          children,
        }}
      />
    );
  }

  return (
    <RenderButtonGroupSectionPart1
      {...{
        contextValue,
        containerRef,
        primitiveValue,
        handleGroupValueChange,
        selectionMode,
        orientation,
        loop,
        disabled,
        connected,
        segmented,
        dir,
        containerClasses,
        props,
        indicator,
        children,
      }}
    />
  );
}
