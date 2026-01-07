"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";

import { cn } from "@/lib/utils";
import {
  IconCheck,
  IconChevronUp,
  IconChevronDown,
  IconX,
  IconSearch,
  IconLoader2,
} from "@tabler/icons-react";
import { animate, stagger } from "animejs";

const Select = SelectPrimitive.Root;

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left text-left", className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-2 py-1 text-sm transition-colors select-none gap-1.5",
        "dark:bg-input/30 dark:hover:bg-input/50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "data-[placeholder]:text-muted-foreground",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 aria-invalid:ring-[3px]",
        "data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)]",
        "*:data-[slot=select-value]:flex *:data-[slot=select-value]:gap-1.5 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:items-center",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <IconChevronDown className="text-muted-foreground size-4 pointer-events-none transition-transform [[data-state=open]>&]:rotate-180" />
        }
      />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 rounded-lg shadow-md ring-1 duration-100 relative isolate z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("text-muted-foreground px-1.5 py-1 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 gap-2 shrink-0 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <IconCheck className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border -mx-1 my-1 h-px pointer-events-none", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 top-0 w-full",
        className
      )}
      {...props}
    >
      <IconChevronUp />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 bottom-0 w-full",
        className
      )}
      {...props}
    >
      <IconChevronDown />
    </SelectPrimitive.ScrollDownArrow>
  );
}

// ============================================
// TYPES
// ============================================
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// ============================================
// MULTI SELECT COMPONENT
// ============================================
interface MultiSelectProps {
  options: SelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxDisplayedTags?: number;
  showSearchIcon?: boolean;
}

function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  disabled = false,
  className,
  maxDisplayedTags = 3,
  showSearchIcon = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOptions = options.filter((opt) => value.includes(opt.value));
  const displayedTags = selectedOptions.slice(0, maxDisplayedTags);
  const remainingCount = selectedOptions.length - maxDisplayedTags;

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const removeTag = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(value.filter((v) => v !== optionValue));
  };

  // Reset highlighted index when options change
  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions.length]);

  // Animate items when dropdown opens
  React.useEffect(() => {
    if (isOpen && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-option]");
      animate(items, {
        opacity: [0, 1],
        translateY: [-10, 0],
        delay: stagger(30),
        duration: 200,
        ease: "outQuad",
      });
    }
  }, [isOpen, filteredOptions.length]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (
      e.key === "Enter" &&
      highlightedIndex >= 0 &&
      filteredOptions[highlightedIndex]
    ) {
      e.preventDefault();
      toggleOption(filteredOptions[highlightedIndex].value);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Backspace" && !searchQuery && value.length > 0) {
      const newValue = value.slice(0, -1);
      onChange?.(newValue);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-1 min-h-8 px-2 py-1 rounded-lg border border-input bg-transparent cursor-text",
          "dark:bg-input/30 dark:hover:bg-input/50",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          disabled && "opacity-50 pointer-events-none"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {showSearchIcon && (
          <IconSearch className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        {displayedTags.map((opt) => (
          <span
            key={opt.value}
            className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs shrink-0"
          >
            {opt.label}
            <button
              type="button"
              onClick={(e) => removeTag(opt.value, e)}
              className="rounded-sm hover:bg-muted-foreground/20"
            >
              <IconX className="h-3 w-3" />
            </button>
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="text-xs text-muted-foreground shrink-0">
            +{remainingCount} more
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={value.length > 0 ? "" : placeholder}
          disabled={disabled}
          className="flex-1 min-w-[80px] bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        />
        <IconChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-border bg-popover p-1 shadow-md"
        >
          {filteredOptions.map((option, index) => {
            const isSelected = value.includes(option.value);
            const isHighlighted = index === highlightedIndex;
            return (
              <button
                key={option.value}
                data-option
                type="button"
                disabled={option.disabled}
                onClick={() => toggleOption(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none",
                  isHighlighted && "bg-muted",
                  option.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border transition-colors shrink-0",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input"
                  )}
                >
                  {isSelected && <IconCheck className="h-3 w-3" />}
                </div>
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
      {isOpen && filteredOptions.length === 0 && searchQuery && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover p-3 text-sm text-muted-foreground text-center shadow-md">
          No options found
        </div>
      )}
    </div>
  );
}

// ============================================
// ASYNC SELECT COMPONENT
// ============================================
interface AsyncSelectProps {
  loadOptions: (query: string) => Promise<SelectOption[]>;
  value?: string;
  onChange?: (value: string, option: SelectOption | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  debounceMs?: number;
  cacheOptions?: boolean;
  showSearchIcon?: boolean;
}

function AsyncSelect({
  loadOptions,
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
  className,
  debounceMs = 300,
  cacheOptions = true,
  showSearchIcon = false,
}: AsyncSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [options, setOptions] = React.useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedOption, setSelectedOption] =
    React.useState<SelectOption | null>(null);
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const cacheRef = React.useRef<Map<string, SelectOption[]>>(new Map());

  // Load options with debounce
  const fetchOptions = React.useCallback(
    async (query: string) => {
      if (cacheOptions && cacheRef.current.has(query)) {
        setOptions(cacheRef.current.get(query) || []);
        return;
      }

      setIsLoading(true);
      try {
        const result = await loadOptions(query);
        setOptions(result);
        if (cacheOptions) {
          cacheRef.current.set(query, result);
        }
      } catch (error) {
        console.error("Failed to load options:", error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [loadOptions, cacheOptions]
  );

  React.useEffect(() => {
    if (!isOpen) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchOptions(searchQuery);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, isOpen, fetchOptions, debounceMs]);

  // Load initial options when dropdown opens
  React.useEffect(() => {
    if (isOpen && options.length === 0) {
      fetchOptions("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Reset highlighted index when options change
  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [options.length]);

  // Animate items when options change
  React.useEffect(() => {
    if (isOpen && listRef.current && !isLoading && options.length > 0) {
      const items = listRef.current.querySelectorAll("[data-option]");
      animate(items, {
        opacity: [0, 1],
        translateY: [-10, 0],
        delay: stagger(30),
        duration: 200,
        ease: "outQuad",
      });
    }
  }, [options, isLoading, isOpen]);

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    onChange?.(option.value, option);
    setIsOpen(false);
    setSearchQuery(option.label);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOption(null);
    onChange?.("", null);
    setSearchQuery("");
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (
      e.key === "Enter" &&
      highlightedIndex >= 0 &&
      options[highlightedIndex]
    ) {
      e.preventDefault();
      handleSelect(options[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-1 h-8 px-2 py-1 rounded-lg border border-input bg-transparent cursor-text",
          "dark:bg-input/30 dark:hover:bg-input/50",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          disabled && "opacity-50 pointer-events-none"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {showSearchIcon && (
          <IconSearch className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
            if (selectedOption) {
              setSelectedOption(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        />
        {isLoading && (
          <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
        )}
        {selectedOption && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-sm p-0.5 hover:bg-muted"
          >
            <IconX className="h-4 w-4" />
          </button>
        )}
        {!isLoading && !selectedOption && (
          <IconChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        )}
      </div>
      {isOpen && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-border bg-popover p-1 shadow-md"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4 gap-2 text-sm text-muted-foreground">
              <IconLoader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : options.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              {searchQuery ? "No results found" : "Type to search..."}
            </div>
          ) : (
            options.map((option, index) => {
              const isSelected = value === option.value;
              const isHighlighted = index === highlightedIndex;
              return (
                <button
                  key={option.value}
                  data-option
                  type="button"
                  disabled={option.disabled}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none",
                    isHighlighted && "bg-muted",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="flex-1 text-left truncate">
                    {option.label}
                  </span>
                  {isSelected && (
                    <IconCheck className="h-4 w-4 text-primary shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// CREATABLE SELECT COMPONENT
// ============================================
interface CreatableSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string, option: SelectOption) => void;
  onCreateOption?: (inputValue: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  createLabel?: string;
}

function CreatableSelect({
  options,
  value,
  onChange,
  onCreateOption,
  placeholder = "Select or type to create...",
  disabled = false,
  className,
  createLabel = "Create",
}: CreatableSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);
  const showCreateOption =
    searchQuery &&
    !filteredOptions.some(
      (opt) => opt.label.toLowerCase() === searchQuery.toLowerCase()
    );

  // Reset highlighted index when options change
  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions.length, showCreateOption]);

  // Animate items when dropdown opens
  React.useEffect(() => {
    if (isOpen && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-option]");
      animate(items, {
        opacity: [0, 1],
        translateY: [-10, 0],
        delay: stagger(30),
        duration: 200,
        ease: "outQuad",
      });
    }
  }, [isOpen, filteredOptions.length]);

  const handleSelect = (option: SelectOption) => {
    onChange?.(option.value, option);
    setSearchQuery(option.label);
    setIsOpen(false);
  };

  const handleCreate = () => {
    if (searchQuery && onCreateOption) {
      onCreateOption(searchQuery);
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("", { value: "", label: "" });
    setSearchQuery("");
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalOptions = filteredOptions.length + (showCreateOption ? 1 : 0);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < totalOptions - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showCreateOption && highlightedIndex === filteredOptions.length) {
        handleCreate();
      } else if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-1 h-8 px-2 py-1 rounded-lg border border-input bg-transparent cursor-text",
          "dark:bg-input/30 dark:hover:bg-input/50",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          disabled && "opacity-50 pointer-events-none"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        />
        {selectedOption && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-sm p-0.5 hover:bg-muted"
          >
            <IconX className="h-4 w-4" />
          </button>
        )}
        <IconChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </div>
      {isOpen && (filteredOptions.length > 0 || showCreateOption) && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-border bg-popover p-1 shadow-md"
        >
          {filteredOptions.map((option, index) => {
            const isSelected = value === option.value;
            const isHighlighted = index === highlightedIndex;
            return (
              <button
                key={option.value}
                data-option
                type="button"
                disabled={option.disabled}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none",
                  isHighlighted && "bg-muted",
                  option.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <span className="flex-1 text-left truncate">
                  {option.label}
                </span>
                {isSelected && (
                  <IconCheck className="h-4 w-4 text-primary shrink-0" />
                )}
              </button>
            );
          })}
          {showCreateOption && (
            <button
              data-option
              type="button"
              onClick={handleCreate}
              onMouseEnter={() => setHighlightedIndex(filteredOptions.length)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none text-primary",
                highlightedIndex === filteredOptions.length && "bg-muted"
              )}
            >
              <span className="flex-1 text-left">
                {createLabel} "{searchQuery}"
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// UTILITIES
// ============================================
// Fuzzy matching utility
function fuzzyMatch(text: string, query: string): boolean {
  const pattern = query.toLowerCase().split("").join(".*");
  const regex = new RegExp(pattern);
  return regex.test(text.toLowerCase());
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// AUTOCOMPLETE COMPONENT
// ============================================
export interface AutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface AutocompleteProps {
  options?: AutocompleteOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  onSearch?: (query: string) => Promise<AutocompleteOption[]>;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  limit?: number;
  debounceMs?: number;
  fuzzyMatching?: boolean;
  autoHighlight?: boolean;
  className?: string;
}

function Autocomplete({
  options: initialOptions = [],
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  disabled = false,
  multiple = false,
  limit,
  debounceMs = 300,
  fuzzyMatching = true,
  autoHighlight = true,
  className,
}: AutocompleteProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] =
    React.useState<AutocompleteOption[]>(initialOptions);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(
    autoHighlight ? 0 : -1
  );

  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(inputValue, debounceMs);

  // Update options when initialOptions change
  React.useEffect(() => {
    if (!onSearch) {
      setOptions(initialOptions);
    }
  }, [initialOptions, onSearch]);

  // Filter options (only for non-async mode)
  const filteredOptions = React.useMemo(() => {
    if (onSearch) {
      // For async mode, just apply limit
      return limit ? options.slice(0, limit) : options;
    }

    let result = options;

    if (inputValue) {
      result = options.filter((opt) =>
        fuzzyMatching
          ? fuzzyMatch(opt.label, inputValue)
          : opt.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }

    if (limit) {
      result = result.slice(0, limit);
    }

    return result;
  }, [options, inputValue, fuzzyMatching, limit, onSearch]);

  // Async search effect
  React.useEffect(() => {
    if (!onSearch) return;

    if (!debouncedQuery) {
      setOptions([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    onSearch(debouncedQuery)
      .then((results) => {
        if (!cancelled) {
          setOptions(results);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOptions([]);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, onSearch]);

  // Auto highlight first option
  React.useEffect(() => {
    if (autoHighlight && filteredOptions.length > 0) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [filteredOptions.length, autoHighlight]);

  // Animate items when dropdown opens
  React.useEffect(() => {
    if (isOpen && listRef.current && !isLoading) {
      const items = listRef.current.querySelectorAll("[data-option]");
      animate(items, {
        opacity: [0, 1],
        translateY: [-10, 0],
        delay: stagger(30),
        duration: 200,
        ease: "outQuad",
      });
    }
  }, [isOpen, filteredOptions.length, isLoading]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newValues);
      onChange?.(newValues);
      setInputValue("");
      inputRef.current?.focus();
    } else {
      setSelectedValues([optionValue]);
      onChange?.(optionValue);
      setIsOpen(false);
      const option = options.find((o) => o.value === optionValue);
      if (option) {
        setInputValue(option.label);
      }
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== optionValue);
    setSelectedValues(newValues);
    onChange?.(multiple ? newValues : "");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (
      e.key === "Enter" &&
      highlightedIndex >= 0 &&
      filteredOptions[highlightedIndex]
    ) {
      e.preventDefault();
      handleSelect(filteredOptions[highlightedIndex].value);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (
      e.key === "Backspace" &&
      !inputValue &&
      multiple &&
      selectedValues.length > 0
    ) {
      // Remove last selected item on backspace
      const newValues = selectedValues.slice(0, -1);
      setSelectedValues(newValues);
      onChange?.(newValues);
    }
  };

  const selectedOptions =
    options.length > 0
      ? options.filter((o) => selectedValues.includes(o.value))
      : initialOptions.filter((o) => selectedValues.includes(o.value));

  return (
    <div className={cn("relative w-full", className)}>
      {/* Input container with tags inside */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-1 min-h-8 px-2 py-1 rounded-lg border border-input bg-transparent cursor-text",
          "dark:bg-input/30 dark:hover:bg-input/50",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          disabled && "opacity-50 pointer-events-none"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <IconSearch className="h-4 w-4 text-muted-foreground shrink-0" />

        {/* Multi-select tags inside input */}
        {multiple &&
          selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-muted shrink-0"
            >
              {opt.label}
              <button
                type="button"
                onClick={(e) => handleRemove(opt.value, e)}
                className="hover:text-destructive"
              >
                <IconX className="h-3 w-3" />
              </button>
            </span>
          ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={multiple && selectedValues.length > 0 ? "" : placeholder}
          disabled={disabled}
          className="flex-1 min-w-[80px] bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        />

        {isLoading && (
          <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-border bg-popover p-1 shadow-md"
        >
          {filteredOptions.map((option, index) => {
            const isSelected = selectedValues.includes(option.value);
            const isHighlighted = index === highlightedIndex;

            return (
              <div
                key={option.value}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer",
                  isHighlighted && "bg-muted",
                  isSelected && "font-medium",
                  option.disabled && "opacity-50 pointer-events-none"
                )}
                onClick={() => !option.disabled && handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {multiple && (
                  <div
                    className={cn(
                      "h-4 w-4 border rounded flex items-center justify-center shrink-0",
                      isSelected ? "bg-primary border-primary" : "border-input"
                    )}
                  >
                    {isSelected && (
                      <IconCheck className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                )}
                <span className="truncate">{option.label}</span>
                {!multiple && isSelected && (
                  <IconCheck className="ml-auto h-4 w-4 text-primary shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* No results */}
      {isOpen && filteredOptions.length === 0 && !isLoading && inputValue && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover p-3 text-sm text-muted-foreground text-center shadow-md">
          No results found
        </div>
      )}
    </div>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  MultiSelect,
  AsyncSelect,
  CreatableSelect,
  Autocomplete,
  fuzzyMatch,
  useDebounce,
};
export type {
  SelectOption,
  MultiSelectProps,
  AsyncSelectProps,
  CreatableSelectProps,
  AutocompleteOption,
  AutocompleteProps,
};
