"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { IconX, IconChevronDown } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "border-input dark:bg-input/30 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-disabled:bg-input/50 dark:has-disabled:bg-input/80 h-8 rounded-lg border transition-colors has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot][aria-invalid=true]]:ring-[3px] has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5 in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 group/input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto",
        className
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "text-muted-foreground h-auto gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4 flex cursor-text items-center justify-center select-none",
  {
    variants: {
      align: {
        "inline-start":
          "pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem] order-first",
        "inline-end":
          "pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem] order-last",
        "block-start":
          "px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2 order-first w-full justify-start",
        "block-end":
          "px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2 order-last w-full justify-start",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }

        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  "gap-2 text-sm shadow-none flex items-center",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
);

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset";
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn(
        "text-muted-foreground gap-2 text-sm [&_svg:not([class*='size-'])]:size-4 flex items-center [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "size">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent flex-1",
        className
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent flex-1 resize-none",
        className
      )}
      {...props}
    />
  );
}

// =============================================================================
// KiraInputGroup — prop-driven wrapper over the compound parts
// =============================================================================

interface UnitOption {
  value: string;
  label: string;
}

/** Compact unit/currency selector for use as an inline-end addon. */
function InputGroupUnitSelect({
  options,
  value,
  onValueChange,
}: {
  options: UnitOption[];
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const [selected, setSelected] = React.useState(
    () => options.find((o) => o.value === value) ?? options[0],
  );

  const ref = React.useRef<HTMLDivElement>(null);

  // Adjust selection when the controlled value changes (during render).
  const [prevValue, setPrevValue] = React.useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    const match = options.find((o) => o.value === value);

    if (match) setSelected(match);
  }

  React.useEffect(() => {
    if (!open) return;

    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDoc);

    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="gap-1"
      >
        {selected?.label}
        <IconChevronDown className="size-3.5" />
      </Button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 min-w-20 rounded-lg border bg-popover p-1 shadow-md"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={selected?.value === option.value}
              onClick={() => {
                setSelected(option);
                onValueChange?.(option.value);
                setOpen(false);
              }}
              className={cn(
                "w-full rounded-md px-2 py-1 text-left text-sm hover:bg-muted",
                selected?.value === option.value && "bg-muted",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface KiraInputGroupProps
  extends Omit<React.ComponentProps<"input">, "prefix" | "size"> {
  leadingIcon?: React.ReactNode;
  leadingText?: string;
  trailing?: React.ReactNode;
  /** Inline unit/currency selector rendered as an inline-end addon. */
  units?: UnitOption[];
  unitValue?: string;
  onUnitChange?: (value: string) => void;
  clearable?: boolean;
  onClear?: () => void;
  /** Show a live character counter addon (needs a controlled `value`). */
  counter?: boolean;
}

function KiraInputGroup({
  leadingIcon,
  leadingText,
  trailing,
  units,
  unitValue,
  onUnitChange,
  clearable,
  onClear,
  counter,
  value,
  onChange,
  maxLength,
  className,
  ...props
}: KiraInputGroupProps) {
  const hasValue = String(value ?? "").length > 0;
  const showClear = clearable && hasValue && !props.disabled;
  const currentLength = String(value ?? "").length;

  const handleClear = () => {
    onClear?.();
    onChange?.({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const hasLead = leadingIcon || leadingText;
  const hasTrail = trailing || showClear || counter || units;

  return (
    <InputGroup className={className}>
      {hasLead && (
        <InputGroupAddon align="inline-start">
          {leadingIcon}
          {leadingText && <InputGroupText>{leadingText}</InputGroupText>}
        </InputGroupAddon>
      )}
      <InputGroupInput
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        {...props}
      />
      {hasTrail && (
        <InputGroupAddon align="inline-end">
          {counter && (
            <InputGroupText
              aria-live="polite"
              className="tabular-nums text-xs"
            >
              <span
                className={cn(
                  maxLength !== undefined &&
                    currentLength >= maxLength &&
                    "text-destructive",
                )}
              >
                {currentLength}
              </span>
              {maxLength !== undefined && `/${maxLength}`}
            </InputGroupText>
          )}
          {showClear && (
            <InputGroupButton
              size="icon-xs"
              onClick={handleClear}
              aria-label="Clear input"
            >
              <IconX className="size-3.5" />
            </InputGroupButton>
          )}
          {trailing}
          {units && units.length > 0 && (
            <InputGroupUnitSelect
              options={units}
              value={unitValue}
              onValueChange={onUnitChange}
            />
          )}
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
  InputGroupUnitSelect,
  KiraInputGroup,
};

export type { KiraInputGroupProps, UnitOption };
