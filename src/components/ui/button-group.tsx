"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
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
    },
    defaultVariants: {
      orientation: "horizontal",
      connected: true,
    },
  }
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
type SelectionMode = "none" | "single" | "multiple";

interface ButtonGroupContextValue {
  selectionMode: SelectionMode;
  value: string | string[] | null;
  onChange: (value: string | string[]) => void;
  orientation: ButtonGroupOrientation;
  variant?: ButtonProps["variant"];
  disabled?: boolean;
  loop?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ButtonGroupContext = React.createContext<ButtonGroupContextValue | null>(
  null
);

const useButtonGroupContext = () => {
  const context = React.useContext(ButtonGroupContext);
  if (!context) {
    throw new Error(
      "ButtonGroup compound components must be used within a ButtonGroup"
    );
  }
  return context;
};

interface ButtonGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Orientation of the button group */
  orientation?: ButtonGroupOrientation;
  /** Size variant for all buttons */
  size?: ButtonGroupSize;
  /** Gap between buttons (only when not connected) */
  gap?: ButtonGroupGap;
  /** Justify content alignment */
  justify?: ButtonGroupJustify;
  /** Controlled value for selection */
  value?: string | string[] | null;
  /** Callback when selection changes */
  onChange?: (value: string | string[]) => void;
  /** Selection mode: none, single, or multiple */
  selectionMode?: SelectionMode;
  /** Whether buttons are visually connected */
  connected?: boolean;
  /** Enable entrance animation */
  animated?: boolean;
  /** Stagger delay for animation (ms) */
  animationStagger?: number;
  /** Variant for all buttons */
  variant?: ButtonProps["variant"];
  /** Disable all buttons in the group */
  disabled?: boolean;
  /** Loop keyboard navigation (default: true) */
  loop?: boolean;
}

function ButtonGroup({
  className,
  orientation = "horizontal",
  size,
  gap,
  justify,
  value = null,
  onChange,
  selectionMode = "none",
  connected = true,
  animated = false,
  animationStagger = 50,
  variant,
  disabled = false,
  loop = true,
  children,
  ...props
}: ButtonGroupProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const contextValue = React.useMemo<ButtonGroupContextValue>(
    () => ({
      selectionMode,
      value: value !== undefined ? value : null,
      onChange: (newValue) => onChange?.(newValue),
      orientation,
      variant,
      disabled,
      loop,
      containerRef,
    }),
    [selectionMode, value, onChange, orientation, variant, disabled, loop]
  );

  useGSAP(() => {
    if (!animated || !containerRef.current) return;

    const buttons = containerRef.current.querySelectorAll("[data-slot=button]");

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
  }, { scope: containerRef, dependencies: [animated, orientation, animationStagger] });

  const processChildren = () => {
    const childArray = React.Children.toArray(children).filter(
      React.isValidElement
    );
    const count = childArray.length;

    return childArray.map((child, index) => {
      if (!React.isValidElement(child)) return child;

      const isFirst = index === 0;
      const isLast = index === count - 1;
      const isMiddle = !isFirst && !isLast;

      let positionClasses = "";

      if (connected) {
        if (orientation === "horizontal") {
          if (isFirst && count > 1) {
            positionClasses = "rounded-r-none border-r-0";
          } else if (isLast && count > 1) {
            positionClasses = "rounded-l-none";
          } else if (isMiddle) {
            positionClasses = "rounded-none border-r-0";
          }
        } else {
          // vertical
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
            positionClasses
          ),
        }
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
        className={cn(
          buttonGroupVariants({ orientation, connected }),
          buttonGroupSizeVariants({
            size,
            gap: connected && !gap ? undefined : gap,
            justify,
          }),
          className
        )}
        {...props}
      >
        {processChildren()}
      </div>
    </ButtonGroupContext.Provider>
  );
}

interface ToggleGroupItemProps extends Omit<ButtonProps, "onClick" | "ref"> {
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
    containerRef,
  } = useButtonGroupContext();

  const isDisabled = localDisabled ?? groupDisabled ?? false;

  const effectiveVariant =
    localVariant !== "outline" ? localVariant : groupVariant || "outline";

  const isSelected = React.useMemo(() => {
    if (selectionMode === "none" || groupValue === null) return false;
    if (selectionMode === "single") {
      return groupValue === value;
    }
    return Array.isArray(groupValue) && groupValue.includes(value);
  }, [selectionMode, groupValue, value]);

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
      container.querySelectorAll("[data-slot=button]")
    ) as HTMLElement[];
    const currentIndex = buttons.findIndex(
      (btn) => btn === document.activeElement
    );

    if (currentIndex === -1) return;

    let nextIndex: number;
    const isVertical = orientation === "vertical";
    const lastIndex = buttons.length - 1;

    // Handle Home/End keys
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

    // Handle Arrow keys
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

  useGSAP(() => {
    if (isSelected && itemRef.current) {
      gsap.to(itemRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      });
    }
  }, { scope: itemRef, dependencies: [isSelected] });

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
      variant={effectiveVariant}
      className={cn(getSelectedClassName(), className)}
      onClick={handleClick}
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
      aria-label={!label ? "Button group toolbar" : undefined}
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

export { buttonGroupVariants, buttonGroupSizeVariants };
export { ButtonGroup, ToggleGroupItem, ButtonGroupToolbar };
export type { ButtonGroupProps, ToggleGroupItemProps, ButtonGroupToolbarProps };
