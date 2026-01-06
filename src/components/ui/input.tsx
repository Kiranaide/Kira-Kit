import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconMinus,
  IconPlus,
  IconLoader2,
  IconChevronDown,
} from "@tabler/icons-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 h-8 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors file:h-6 file:text-sm file:font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

// ============================================
// NUMERIC INPUT (with increment/decrement)
// ============================================
interface NumericInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "onChange" | "value"> {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showButtons?: boolean;
}

function NumericInput({
  value = 0,
  onChange,
  min,
  max,
  step = 1,
  showButtons = true,
  className,
  disabled,
  ...props
}: NumericInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    if (min !== undefined && newValue < min) return;
    if (max !== undefined && newValue > max) return;
    onChange?.(newValue);
  };

  const increment = () => {
    const newValue = (value || 0) + step;
    if (max !== undefined && newValue > max) return;
    onChange?.(newValue);
  };

  const decrement = () => {
    const newValue = (value || 0) - step;
    if (min !== undefined && newValue < min) return;
    onChange?.(newValue);
  };

  if (!showButtons) {
    return (
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={cn(
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || (min !== undefined && value <= min)}
        className="flex h-8 w-8 items-center justify-center rounded-l-lg border border-r-0 border-input bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IconMinus className="h-3 w-3" />
      </button>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        {...props}
      />
      <button
        type="button"
        onClick={increment}
        disabled={disabled || (max !== undefined && value >= max)}
        className="flex h-8 w-8 items-center justify-center rounded-r-lg border border-l-0 border-input bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IconPlus className="h-3 w-3" />
      </button>
    </div>
  );
}

// ============================================
// INPUT WITH PREFIX/SUFFIX (Symbol Input)
// ============================================
interface InputWithAffixProps
  extends Omit<React.ComponentProps<"input">, "prefix"> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const InputWithAffix = React.forwardRef<HTMLInputElement, InputWithAffixProps>(
  ({ className, prefix, suffix, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-0 flex h-full items-center pl-3 text-muted-foreground pointer-events-none">
            {prefix}
          </div>
        )}
        <Input
          ref={ref}
          className={cn(prefix && "pl-8", suffix && "pr-8", className)}
          {...props}
        />
        {suffix && (
          <div className="absolute right-0 flex h-full items-center pr-3 text-muted-foreground pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
    );
  }
);
InputWithAffix.displayName = "InputWithAffix";

// ============================================
// TEXTAREA FIXED (no auto-height expansion)
// ============================================
interface TextareaFixedProps extends React.ComponentProps<"textarea"> {
  rows?: number;
}

function TextareaFixed({ className, rows = 3, ...props }: TextareaFixedProps) {
  return (
    <textarea
      data-slot="textarea"
      rows={rows}
      className={cn(
        "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors focus-visible:ring-[3px] aria-invalid:ring-[3px] md:text-sm placeholder:text-muted-foreground flex w-full outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      {...props}
    />
  );
}

// ============================================
// INPUT WITH LABEL
// ============================================
interface InputWithLabelProps extends React.ComponentProps<"input"> {
  label: string;
  description?: string;
  error?: string;
}

function InputWithLabel({
  label,
  description,
  error,
  className,
  id,
  ...props
}: InputWithLabelProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <Input
        id={inputId}
        className={cn(error && "border-destructive", className)}
        aria-invalid={!!error}
        {...props}
      />
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ============================================
// INPUT WITH BUTTON
// ============================================
interface InputWithButtonProps extends React.ComponentProps<"input"> {
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: () => void;
  buttonPosition?: "left" | "right";
  buttonVariant?: "default" | "secondary" | "outline" | "ghost";
}

function InputWithButton({
  buttonText,
  buttonIcon,
  onButtonClick,
  buttonPosition = "right",
  buttonVariant = "default",
  className,
  ...props
}: InputWithButtonProps) {
  return (
    <div className="flex">
      {buttonPosition === "left" && (
        <Button
          type="button"
          variant={buttonVariant}
          onClick={onButtonClick}
          className="rounded-r-none border-r-0"
        >
          {buttonIcon}
          {buttonText}
        </Button>
      )}
      <Input
        className={cn(
          buttonPosition === "left" && "rounded-l-none",
          buttonPosition === "right" && "rounded-r-none",
          "flex-1",
          className
        )}
        {...props}
      />
      {buttonPosition === "right" && (
        <Button
          type="button"
          variant={buttonVariant}
          onClick={onButtonClick}
          className="rounded-l-none border-l-0"
        >
          {buttonIcon}
          {buttonText}
        </Button>
      )}
    </div>
  );
}

// ============================================
// INPUT WITH SPINNER
// ============================================
interface InputWithSpinnerProps extends React.ComponentProps<"input"> {
  isLoading?: boolean;
}

function InputWithSpinner({
  isLoading = false,
  className,
  ...props
}: InputWithSpinnerProps) {
  return (
    <div className="relative">
      <Input className={cn(isLoading && "pr-10", className)} {...props} />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

// ============================================
// INPUT WITH TOOLTIP
// ============================================
interface InputWithTooltipProps extends React.ComponentProps<"input"> {
  tooltip: string;
}

function InputWithTooltip({
  tooltip,
  className,
  ...props
}: InputWithTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Input className={className} {...props} />
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

// ============================================
// INPUT WITH DROPDOWN
// ============================================
interface InputWithDropdownProps
  extends Omit<React.ComponentProps<"input">, "onSelect"> {
  options: { value: string; label: string }[];
  onOptionSelect?: (value: string) => void;
  dropdownPosition?: "left" | "right";
  dropdownValue?: string;
}

function InputWithDropdown({
  options,
  onOptionSelect,
  dropdownPosition = "left",
  dropdownValue,
  className,
  ...props
}: InputWithDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState(
    options.find((o) => o.value === dropdownValue) || options[0]
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Click outside to close
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (option: { value: string; label: string }) => {
    setSelectedOption(option);
    onOptionSelect?.(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex">
      {dropdownPosition === "left" && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-8 items-center gap-1 rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm hover:bg-muted/80"
          >
            {selectedOption?.label}
            <IconChevronDown className="h-3 w-3" />
          </button>
          {isOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 min-w-24 rounded-lg border bg-popover p-1 shadow-md">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "w-full rounded-md px-2 py-1 text-left text-sm hover:bg-muted",
                    selectedOption?.value === option.value && "bg-muted"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <Input
        className={cn(
          "flex-1",
          dropdownPosition === "left" && "rounded-l-none",
          dropdownPosition === "right" && "rounded-r-none",
          className
        )}
        {...props}
      />
      {dropdownPosition === "right" && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-8 items-center gap-1 rounded-r-lg border border-l-0 border-input bg-muted px-3 text-sm hover:bg-muted/80"
          >
            {selectedOption?.label}
            <IconChevronDown className="h-3 w-3" />
          </button>
          {isOpen && (
            <div className="absolute top-full right-0 z-50 mt-1 min-w-24 rounded-lg border bg-popover p-1 shadow-md">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "w-full rounded-md px-2 py-1 text-left text-sm hover:bg-muted",
                    selectedOption?.value === option.value && "bg-muted"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// INPUT GROUP (multiple inputs in a row)
// ============================================
interface InputGroupProps {
  children: React.ReactNode;
  className?: string;
}

function InputGroup({ children, className }: InputGroupProps) {
  const childArray = React.Children.toArray(children);

  return (
    <div className={cn("flex", className)}>
      {React.Children.map(childArray, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const isFirst = index === 0;
        const isLast = index === childArray.length - 1;
        const childClassName = (child.props as Record<string, unknown>)
          .className as string | undefined;

        return React.cloneElement(
          child as React.ReactElement<{ className?: string }>,
          {
            className: cn(
              childClassName,
              !isFirst && "rounded-l-none border-l-0",
              !isLast && "rounded-r-none"
            ),
          }
        );
      })}
    </div>
  );
}

export {
  Input,
  NumericInput,
  InputWithAffix,
  TextareaFixed,
  InputWithLabel,
  InputWithButton,
  InputWithSpinner,
  InputWithTooltip,
  InputWithDropdown,
  InputGroup,
};
export type {
  NumericInputProps,
  InputWithAffixProps,
  TextareaFixedProps,
  InputWithLabelProps,
  InputWithButtonProps,
  InputWithSpinnerProps,
  InputWithTooltipProps,
  InputWithDropdownProps,
  InputGroupProps,
};
