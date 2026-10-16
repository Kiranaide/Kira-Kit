"use client";

/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cva } from "class-variance-authority";
import { IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Button, type ButtonProps } from "@/components/ui/button";

const buttonGroupVariants = cva(
  "inline-flex items-center [&>[data-slot=button]]:shadow-none",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col [&>[data-slot=button]]:w-full",
      },
      connected: {
        true: "gap-0",
        false: "gap-1",
      },
      shape: {
        default: "",
        pill: "rounded-full [&>[data-slot=button]]:rounded-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      connected: true,
      shape: "default",
    },
  },
);

const buttonGroupSizeVariants = cva("inline-flex", {
  variants: {
    size: {
      xs: "[&>[data-slot=button]]:h-6 [&>[data-slot=button]]:px-2 [&>[data-slot=button]]:text-xs",
      sm: "[&>[data-slot=button]]:h-7 [&>[data-slot=button]]:px-2.5 [&>[data-slot=button]]:text-[0.8rem]",
      default:
        "[&>[data-slot=button]]:h-8 [&>[data-slot=button]]:px-2.5 [&>[data-slot=button]]:text-sm",
      lg: "[&>[data-slot=button]]:h-9 [&>[data-slot=button]]:px-3 [&>[data-slot=button]]:text-base",
    },
    gap: {
      none: "gap-0",
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

type ButtonGroupOrientation = "horizontal" | "vertical";

type ButtonGroupSize = "xs" | "sm" | "default" | "lg";

type ButtonGroupGap = "none" | "sm" | "default" | "lg";

type ButtonGroupJustify = "start" | "center" | "end" | "between" | "around";

type ButtonGroupShape = "default" | "pill";

type SelectionMode = "none" | "single" | "multiple";

interface ButtonGroupContextValue {
  selectionMode: SelectionMode;
  value: string | string[] | null;
  onChange: (value: string | string[]) => void;
  orientation: ButtonGroupOrientation;
  variant?: ButtonProps["variant"];
  disabled?: boolean;
  loop?: boolean;
  dir?: "ltr" | "rtl";
  segmented?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
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
  "onChange"
> {
  orientation?: ButtonGroupOrientation;
  size?: ButtonGroupSize;
  gap?: ButtonGroupGap;
  justify?: ButtonGroupJustify;
  shape?: ButtonGroupShape;
  value?: string | string[] | null;
  onChange?: (value: string | string[]) => void;
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

function ButtonGroup({
  className,
  orientation = "horizontal",
  size,
  gap,
  justify,
  shape = "default",
  value = null,
  onChange,
  selectionMode = "none",
  connected = true,
  segmented = false,
  animated = false,
  animationStagger = 50,
  variant,
  disabled = false,
  loop = true,
  dir,
  children,
  ...props
}: ButtonGroupProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const contextValue: ButtonGroupContextValue = {
      selectionMode,
      value: value === undefined ? null : value,
      onChange: (newValue) => onChange?.(newValue),
      orientation,
      variant,
      disabled,
      loop,
      dir,
      segmented,
      containerRef,
    };

  useGSAP(
    () => {
      if (!animated || reducedMotion || !containerRef.current) return;

      const buttons =
        containerRef.current.querySelectorAll("[data-slot=button]");

      if (buttons.length > 0) {
        gsap.from(buttons, {
          opacity: 0,
          y: orientation === "vertical" ? -10 : 0,
          x: orientation === "horizontal" ? -10 : 0,
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

  // Segmented sliding pill: measure the selected item and move an absolutely
  // positioned indicator behind it. Snaps instantly under reduced motion.
  const singleValue =
    selectionMode === "single" && typeof value === "string" ? value : null;

  useGSAP(
    () => {
      const container = containerRef.current;
      const indicator = indicatorRef.current;

      if (!segmented || !container || !indicator) return;

      const selected = container.querySelector<HTMLElement>(
        '[data-slot=toggle-group-item][data-selected="true"]',
      );

      if (!selected) {
        gsap.to(indicator, { autoAlpha: 0, duration: 0 });

        return;
      }

      const cRect = container.getBoundingClientRect();
      const sRect = selected.getBoundingClientRect();

      gsap.to(indicator, {
        autoAlpha: 1,
        width: sRect.width,
        height: sRect.height,
        x: sRect.left - cRect.left,
        y: sRect.top - cRect.top,
        duration: reducedMotion ? 0 : 0.25,
        ease: "power3.out",
      });
    },
    {
      scope: containerRef,
      dependencies: [segmented, singleValue, orientation, reducedMotion],
    },
  );

  const processChildren = () => {
    const childArray = React.Children.toArray(children).filter(
      React.isValidElement,
    );

    const count = childArray.length;

    return childArray.map((child, index) => {
      if (!React.isValidElement(child)) return child;

      const isFirst = index === 0;
      const isLast = index === count - 1;
      const isMiddle = !isFirst && !isLast;

      let positionClasses = "";

      if (connected && !segmented) {
        if (orientation === "horizontal") {
          if (dir === "rtl") {
            if (isFirst && count > 1) {
              positionClasses = "rounded-r-md rounded-l-none border-l-0";
            } else if (isLast && count > 1) {
              positionClasses = "rounded-l-md rounded-r-none";
            } else if (isMiddle) {
              positionClasses = "rounded-none border-l-0";
            }
          } else {
            if (isFirst && count > 1) {
              positionClasses = "rounded-r-none border-r-0";
            } else if (isLast && count > 1) {
              positionClasses = "rounded-l-none";
            } else if (isMiddle) {
              positionClasses = "rounded-none border-r-0";
            }
          }
        } else {
          if (isFirst && count > 1) {
            positionClasses = "rounded-b-none border-b-0";
          } else if (isLast && count > 1) {
            positionClasses = "rounded-t-none";
          } else if (isMiddle) {
            positionClasses = "rounded-none border-b-0";
          }
        }
      }

      return React.cloneElement(
        child as React.ReactElement<{ className?: string }>,
        {
          className: cn(
            (child as React.ReactElement<{ className?: string }>).props
              .className,
            positionClasses,
          ),
        },
      );
    });
  };

  const role = selectionMode === "single" ? "radiogroup" : "group";

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        data-slot="button-group"
        role={role}
        aria-orientation={orientation}
        data-connected={connected}
        data-segmented={segmented || undefined}
        dir={dir}
        className={cn(
          buttonGroupVariants({ orientation, connected, shape }),
          buttonGroupSizeVariants({
            size,
            gap: connected && !gap ? undefined : gap,
            justify,
          }),
          segmented &&
            "relative bg-muted p-1 rounded-lg gap-1 data-[connected=true]:gap-1",
          segmented && shape === "pill" && "rounded-full",
          className,
        )}
        {...props}
      >
        {segmented && (
          <div
            ref={indicatorRef}
            data-slot="segmented-indicator"
            aria-hidden="true"
            className={cn(
              "invisible absolute left-0 top-0 z-0 rounded-md bg-background shadow-sm",
              shape === "pill" && "rounded-full",
            )}
          />
        )}
        {processChildren()}
      </div>
    </ButtonGroupContext.Provider>
  );
}

interface ToggleGroupItemProps extends Omit<ButtonProps, "ref"> {
  value: string;
}

function ToggleGroupItem({
  value,
  className,
  variant: localVariant = "outline",
  disabled: localDisabled,
  ...props
}: ToggleGroupItemProps) {
  const {
    selectionMode,
    value: groupValue,
    onChange,
    orientation,
    variant: groupVariant,
    disabled: groupDisabled,
    loop,
    segmented,
    containerRef,
  } = useButtonGroupContext();

  const reducedMotion = useReducedMotion();
  const isDisabled = localDisabled ?? groupDisabled ?? false;

  const effectiveVariant =
    localVariant === "outline" ? groupVariant || "outline" : localVariant;

  const isSelected =
      selectionMode === "none" || groupValue === null
        ? false
        : selectionMode === "single"
          ? groupValue === value
          : Array.isArray(groupValue) && groupValue.includes(value);

  const handleClick = () => {
    if (selectionMode === "none" || isDisabled) {
      return;
    }

    let newValue: string | string[];

    if (selectionMode === "single") {
      newValue = groupValue === value ? "" : value;
    } else {
      const currentArray = Array.isArray(groupValue) ? groupValue : [];
      newValue = currentArray.includes(value)
        ? currentArray.filter((v) => v !== value)
        : [...currentArray, value];
    }

    onChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const navKeys = [
      "ArrowRight",
      "ArrowDown",
      "ArrowLeft",
      "ArrowUp",
      "Home",
      "End",
    ];

    if (navKeys.includes(e.key)) {
      e.preventDefault();
      handleKeyboardNavigation(e.key);
    }
  };

  const handleKeyboardNavigation = (key: string) => {
    const container = containerRef.current;

    if (!container) return;

    const buttons = Array.from(
      container.querySelectorAll("[data-slot=button]"),
    ) as HTMLElement[];

    const currentIndex = buttons.findIndex(
      (btn) => btn === document.activeElement,
    );

    if (currentIndex === -1) return;

    let nextIndex: number;
    const isVertical = orientation === "vertical";
    const lastIndex = buttons.length - 1;

    if (key === "Home") {
      nextIndex = 0;
      buttons[nextIndex]?.focus();

      return;
    }

    if (key === "End") {
      nextIndex = lastIndex;
      buttons[nextIndex]?.focus();

      return;
    }

    if (
      (isVertical && (key === "ArrowDown" || key === "ArrowUp")) ||
      (!isVertical && (key === "ArrowRight" || key === "ArrowLeft"))
    ) {
      if (key === "ArrowRight" || key === "ArrowDown") {
        if (loop) {
          nextIndex = (currentIndex + 1) % buttons.length;
        } else {
          nextIndex = Math.min(currentIndex + 1, lastIndex);
        }
      } else {
        if (loop) {
          nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        } else {
          nextIndex = Math.max(currentIndex - 1, 0);
        }
      }

      buttons[nextIndex]?.focus();
    }
  };

  const itemRef = React.useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (isSelected && !reducedMotion && itemRef.current) {
        gsap.to(itemRef.current, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        });
      }
    },
    { scope: itemRef, dependencies: [isSelected, reducedMotion] },
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!itemRef.current || reducedMotion) return;

    const rect = itemRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.className =
      "absolute rounded-full bg-current opacity-20 pointer-events-none";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = "0";
    ripple.style.height = "0";

    itemRef.current.appendChild(ripple);

    gsap.to(ripple, {
      width: Math.max(rect.width, rect.height) * 2,
      height: Math.max(rect.width, rect.height) * 2,
      x: -Math.max(rect.width, rect.height),
      y: -Math.max(rect.width, rect.height),
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        ripple.remove();
      },
    });
  };

  const getSelectedClassName = (): string => {
    if (!isSelected) return "";

    switch (effectiveVariant) {
      case "outline":
        return "bg-primary text-primary-foreground hover:bg-primary/90";
      case "default":
        return "bg-primary text-primary-foreground";
      case "secondary":
        return "bg-secondary text-secondary-foreground";
      case "ghost":
        return "bg-muted";
      case "success":
        return "bg-success text-success-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "destructive":
        return "bg-destructive text-destructive-foreground";
      default:
        return "";
    }
  };

  return (
    <Button
      ref={itemRef}
      data-slot="toggle-group-item"
      data-selected={isSelected}
      data-state={isSelected ? "on" : "off"}
      data-disabled={isDisabled || undefined}
      variant={segmented ? "ghost" : effectiveVariant}
      className={cn(
        "relative overflow-hidden",
        // In segmented mode the sliding pill IS the selected background, so the
        // item stays transparent and only sits above the indicator.
        segmented
          ? cn(
              "z-10 bg-transparent hover:bg-transparent",
              isSelected ? "text-foreground" : "text-muted-foreground",
            )
          : getSelectedClassName(),
        className,
      )}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      aria-pressed={isSelected}
      aria-checked={selectionMode === "multiple" ? isSelected : undefined}
      role={
        selectionMode === "single"
          ? "radio"
          : selectionMode === "multiple"
            ? "checkbox"
            : undefined
      }
      tabIndex={selectionMode === "single" && !isSelected ? -1 : 0}
      {...props}
    >
      {props.children}
    </Button>
  );
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
  const labelId = label ? `${toolbarId}-label` : undefined;

  return (
    <div
      role="toolbar"
      aria-labelledby={labelId}
      aria-label={label ? undefined : "Button group toolbar"}
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
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onChange?: (value: string | string[]) => void;
  onValueChange?: (value: string | string[]) => void;
  selectionMode?: SelectionMode;
  type?: "single" | "multiple";
  required?: boolean;
  rovingFocus?: boolean;
  dir?: "ltr" | "rtl";
  fullWidth?: boolean;
  toolbar?: boolean;
  toolbarLabel?: string;
  allowEmpty?: boolean;
  onItemClick?: (value: string) => void;
}

function KiraButtonGroup({
  items,
  children,
  value,
  defaultValue,
  onChange,
  onValueChange,
  selectionMode = "none",
  type,
  required = false,
  dir,
  fullWidth = false,
  allowEmpty = true,
  toolbar = false,
  toolbarLabel,
  onItemClick,
  className,
  ...props
}: KiraButtonGroupProps) {
  const [internalValue, setInternalValue] = React.useState<
    string | string[] | null
  >(defaultValue ?? null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const resolvedSelectionMode = type
    ? type === "single"
      ? "single"
      : "multiple"
    : selectionMode;

  const handleChange = (newValue: string | string[]) => {
    if (required) {
      if (resolvedSelectionMode === "single" && newValue === "") return;

      if (
        resolvedSelectionMode === "multiple" &&
        Array.isArray(newValue) &&
        newValue.length === 0
      )
        return;
    }

    if (resolvedSelectionMode === "single" && !allowEmpty && newValue === "") {
      return;
    }

    if (!isControlled) setInternalValue(newValue);

    onChange?.(newValue);
    onValueChange?.(newValue);
  };

  const handleItemClick = (itemValue: string) => {
    onItemClick?.(itemValue);
  };

  const renderItems = () =>
    items?.map((item) => (
      <ToggleGroupItem
        key={item.value}
        value={item.value}
        disabled={item.disabled || item.loading}
        leftIcon={
          item.loading ? (
            <IconLoader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            item.icon
          )
        }
        rightIcon={item.rightIcon}
        variant={item.variant}
        className={item.className}
        aria-label={item["aria-label"]}
        aria-busy={item.loading || undefined}
        onClick={() => handleItemClick(item.value)}
      >
        {item.label}
      </ToggleGroupItem>
    ));

  const renderContent = () =>
    items && items.length > 0 ? renderItems() : children;

  const group = (
    <ButtonGroup
      value={currentValue}
      onChange={handleChange}
      selectionMode={resolvedSelectionMode}
      className={cn(fullWidth && "w-full", !toolbar && className)}
      dir={dir}
      {...props}
    >
      {renderContent()}
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
        {renderContent()}
      </ButtonGroupToolbar>
    );
  }

  return group;
}

export { buttonGroupVariants, buttonGroupSizeVariants };

export { ButtonGroup, ToggleGroupItem, ButtonGroupToolbar, KiraButtonGroup };

export type {
  ButtonGroupProps,
  ToggleGroupItemProps,
  ButtonGroupToolbarProps,
  KiraButtonGroupProps,
  KiraButtonGroupItem,
};
