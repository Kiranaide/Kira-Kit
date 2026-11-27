"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import { cn } from "cn";

// kira-kit-ignore spacing-scale: star rating is a dense non-control glyph row
const ratingVariants = cva("inline-flex items-center gap-0.5", {
  variants: {
    size: {
      sm: "[&_svg]:h-4 [&_svg]:w-4",
      default: "[&_svg]:h-5 [&_svg]:w-5",
      lg: "[&_svg]:h-6 [&_svg]:w-6",
      xl: "[&_svg]:h-8 [&_svg]:w-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const ratingItemVariants = cva(
  "transition-[color,box-shadow,opacity] duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
  {
    variants: {
      color: {
        default: "text-primary",
        yellow: "text-yellow-500",
        orange: "text-orange-500",
        red: "text-red-500",
        pink: "text-pink-500",
      },
      disabled: {
        true: "cursor-default opacity-60",
        false: "",
      },
      readOnly: {
        true: "cursor-default",
        false: "",
      },
    },
    defaultVariants: {
      color: "yellow",
      disabled: false,
      readOnly: false,
    },
  },
);

interface RatingProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof ratingVariants> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  max?: number;
  allowHalf?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  color?: "default" | "yellow" | "orange" | "red" | "pink";
  showValue?: boolean;
  filledIcon?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  halfIcon?: React.ReactNode;
  tooltipFormatter?: (value: number) => string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

function ratingDigits(allowHalf?: boolean) {
  return allowHalf ? 1 : 0;
}

function ratingTabIndex(disabled?: boolean, readOnly?: boolean, index = 0) {
  if (disabled || readOnly) return -1;

  return index === 0 ? 0 : -1;
}

function ratingKeyboardValue(
  key: string,
  value: number,
  max: number,
  allowHalf: boolean,
) {
  const step = allowHalf ? 0.5 : 1;

  switch (key) {
    case "ArrowRight":
    case "ArrowUp":
      return Math.min(max, value + step);
    case "ArrowLeft":
    case "ArrowDown":
      return Math.max(0, value - step);
    case "Home":
      return 0;
    case "End":
      return max;
    default:
      return undefined;
  }
}

function pointerStarValue(
  index: number,
  e: React.MouseEvent<HTMLButtonElement>,
  allowHalf: boolean,
) {
  if (!allowHalf) return index + 1;

  const rect = e.currentTarget.getBoundingClientRect();
  const isLeftHalf = e.clientX - rect.left < rect.width / 2;

  return isLeftHalf ? index + 0.5 : index + 1;
}

function ratingStarIcon(
  index: number,
  displayValue: number,
  {
    allowHalf,
    filledIcon,
    halfIcon,
    emptyIcon,
  }: Pick<RatingProps, "allowHalf" | "filledIcon" | "halfIcon" | "emptyIcon">,
) {
  const fillAmount = displayValue - index;

  if (fillAmount >= 1) return filledIcon || <IconStarFilled />;

  if (fillAmount >= 0.5 && allowHalf) return halfIcon || <IconStarHalfFilled />;

  return emptyIcon || <IconStar />;
}

interface RatingStarItemProps {
  index: number;
  max: number;
  currentValue: number;
  displayValue: number;
  allowHalf: boolean;
  disabled: boolean;
  readOnly: boolean;
  color: "default" | "yellow" | "orange" | "red" | "pink";
  filledIcon?: React.ReactNode;
  halfIcon?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  tooltip: string;
  onCommit: (value: number) => void;
  onHover: (value: number | null) => void;
}

function RatingStarItem({
  index,
  max,
  currentValue,
  displayValue,
  allowHalf,
  disabled,
  readOnly,
  color,
  filledIcon,
  halfIcon,
  emptyIcon,
  tooltip,
  onCommit,
  onHover,
}: RatingStarItemProps) {
  const starValue = index + 1;
  const isFilled = displayValue >= starValue;

  const isHalfFilled =
    allowHalf && displayValue >= index + 0.5 && displayValue < starValue;

  const starColor = isFilled || isHalfFilled ? color : undefined;

  return (
    <button
      type="button"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Pointer-position half ratings use this button as an ARIA radio in the keyboard-managed rating group.
      role="radio"
      aria-checked={currentValue >= starValue}
      aria-label={`Rate ${starValue} out of ${max}`}
      tabIndex={ratingTabIndex(disabled, readOnly, index)}
      disabled={disabled}
      title={tooltip}
      className={cn(
        ratingItemVariants({ color: starColor, disabled, readOnly }),
        { "text-muted-foreground/40": !isFilled && !isHalfFilled },
        { "hover:scale-110": !disabled && !readOnly },
      )}
      onClick={(e) => onCommit(pointerStarValue(index, e, allowHalf))}
      onMouseMove={(e) => {
        if (!disabled && !readOnly) {
          onHover(pointerStarValue(index, e, allowHalf));
        }
      }}
      onMouseLeave={() => onHover(null)}
      onFocus={() => !readOnly && onHover(starValue)}
      onBlur={() => onHover(null)}
    >
      {ratingStarIcon(index, displayValue, {
        allowHalf,
        filledIcon,
        halfIcon,
        emptyIcon,
      })}
    </button>
  );
}

function useRatingState({
  controlledValue,
  defaultValue,
  max,
  allowHalf,
  allowClear,
  disabled,
  readOnly,
  onChange,
}: {
  controlledValue: number | undefined;
  defaultValue: number;
  max: number;
  allowHalf: boolean;
  allowClear: boolean;
  disabled: boolean;
  readOnly: boolean;
  onChange?: (value: number) => void;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const currentValue = controlledValue ?? internalValue;
  const displayValue = hoverValue ?? currentValue;

  const commitValue = (nextValue: number) => {
    if (disabled || readOnly) return;

    const finalValue = allowClear && nextValue === currentValue ? 0 : nextValue;

    if (controlledValue === undefined) setInternalValue(finalValue);
    onChange?.(finalValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || readOnly) return;

    const next = ratingKeyboardValue(e.key, currentValue, max, allowHalf);

    if (next === undefined) return;
    e.preventDefault();

    if (controlledValue === undefined) setInternalValue(next);
    onChange?.(next);
  };

  return {
    currentValue,
    displayValue,
    setHoverValue,
    commitValue,
    handleKeyDown,
  };
}

// oxlint-disable-next-line complexity -- count is prop-destructure defaults (idiomatic React), not branching
function Rating({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  max = 5,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  readOnly = false,
  size = "default",
  color = "yellow",
  showValue = false,
  filledIcon,
  emptyIcon,
  halfIcon,
  tooltipFormatter,
  className,
  "aria-label": ariaLabel = "Rating",
  "aria-describedby": ariaDescribedBy,
  ref,
  ...props
}: RatingProps & { ref?: React.Ref<HTMLDivElement> }) {
  const state = useRatingState({
    controlledValue,
    defaultValue,
    max,
    allowHalf,
    allowClear,
    disabled,
    readOnly,
    onChange,
  });

  const getTooltip = (val: number) =>
    tooltipFormatter ? tooltipFormatter(val) : `${val} of ${max}`;

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      data-slot="rating"
      data-value={state.currentValue}
      tabIndex={-1}
      onKeyDown={state.handleKeyDown}
      className={cn(ratingVariants({ size }), className)}
      {...props}
    >
      {Array.from({ length: max }, (_, index) => (
        <RatingStarItem
          key={index + 1}
          index={index}
          max={max}
          currentValue={state.currentValue}
          displayValue={state.displayValue}
          allowHalf={allowHalf}
          disabled={disabled}
          readOnly={readOnly}
          color={color}
          filledIcon={filledIcon}
          halfIcon={halfIcon}
          emptyIcon={emptyIcon}
          tooltip={getTooltip(index + 1)}
          onCommit={state.commitValue}
          onHover={state.setHoverValue}
        />
      ))}
      {showValue && (
        <span
          className="ml-2 text-sm font-medium tabular-nums text-muted-foreground"
          aria-hidden="true"
        >
          {state.displayValue.toFixed(ratingDigits(allowHalf))}
        </span>
      )}
    </div>
  );
}

interface RatingDisplayProps extends Omit<
  RatingProps,
  "onChange" | "allowClear" | "allowHalf"
> {
  showFraction?: boolean;
  reviewCount?: number;
}

function RatingDisplay({
  value = 0,
  showFraction = true,
  reviewCount,
  className,
  ref,
  ...props
}: RatingDisplayProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      data-slot="rating-display"
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      <Rating value={value} readOnly allowHalf={showFraction} {...props} />
      {showFraction && (
        <span className="text-sm font-medium tabular-nums">
          {value.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-muted-foreground">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}

export { Rating, RatingDisplay, ratingVariants, ratingItemVariants };

export type { RatingProps, RatingDisplayProps };
