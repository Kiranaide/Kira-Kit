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

// ============================================
// BASE SELECT PRIMITIVES (Low-level wrappers)
// ============================================

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
        className,
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
            className,
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
        className,
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
        className,
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
        className,
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
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface AutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Grouped options for categorized display */
interface GroupedSelectOption<T extends SelectOption = SelectOption> {
  label: string;
  options: T[];
}

/** Check if options are grouped */
function isGroupedOptions<T extends SelectOption>(
  options: T[] | GroupedSelectOption<T>[],
): options is GroupedSelectOption<T>[] {
  return options.length > 0 && "options" in options[0];
}

/** Flatten grouped options to flat array */
function flattenOptions<T extends SelectOption>(
  options: T[] | GroupedSelectOption<T>[],
): T[] {
  if (isGroupedOptions(options)) {
    return options.flatMap((group) => group.options);
  }
  return options;
}

// ============================================
// UNIFIED SELECT FIELD COMPONENT
// Uses Base-UI Combobox for full functionality
// ============================================

interface SelectFieldProps<T extends SelectOption = SelectOption> {
  /** Options to display in the dropdown - can be flat or grouped */
  options?: T[] | GroupedSelectOption<T>[];
  /** Controlled value - single string or array for multiple */
  value?: string | string[];
  /** Callback when value changes */
  onChange?: (
    value: string | string[],
    selectedOptions: T | T[] | null,
  ) => void;
  /** Enable multiple selection with chips */
  multiple?: boolean;
  /** Enable search/filter input */
  searchable?: boolean;
  /** Enable creating new options */
  creatable?: boolean;
  /** Enable async loading mode */
  async?: boolean;
  /** Async search function */
  onSearch?: (query: string) => Promise<T[]>;
  /** Debounce delay for async search (ms) */
  debounceMs?: number;
  /** Cache async results */
  cacheOptions?: boolean;
  /** Callback when creating new option */
  onCreateOption?: (inputValue: string) => void;
  /** Label for create option button */
  createLabel?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Disable the component */
  disabled?: boolean;
  /** Size variant */
  size?: "sm" | "default";
  /** Additional className */
  className?: string;
  /** Max tags to display in multiple mode */
  maxDisplayedTags?: number;
  /** Show search icon */
  showSearchIcon?: boolean;
  /** Enable fuzzy matching for filtering */
  fuzzyMatching?: boolean;
  /** Custom filter function */
  filterFn?: (option: T, query: string) => boolean;

  // ============================================
  // ACCESSIBILITY PROPS
  // ============================================
  /** Whether the field is required */
  required?: boolean;
  /** Accessible label for the field */
  "aria-label"?: string;
  /** ID of element that labels this field */
  "aria-labelledby"?: string;
  /** ID of element that describes this field */
  "aria-describedby"?: string;
  /** Whether the field is in an invalid state */
  "aria-invalid"?: boolean;
  /** Form field name for native form submission */
  name?: string;

  // ============================================
  // CALLBACK PROPS
  // ============================================
  /** Callback when dropdown opens or closes */
  onOpenChange?: (open: boolean) => void;
  /** Callback when search input changes */
  onSearchChange?: (query: string) => void;
  /** Callback when all selections are cleared (multi-select only) */
  onClearAll?: () => void;

  // ============================================
  // TRIGGER VARIANTS
  // ============================================
  /** Trigger visual variant */
  variant?: "default" | "ghost" | "outline";
  /** Icon to display on the left of trigger */
  leftIcon?: React.ReactNode;
  /** Hide the chevron dropdown indicator */
  hideChevron?: boolean;

  // ============================================
  // EMPTY STATE CUSTOMIZATION
  // ============================================
  /** Custom message when no results found */
  emptyMessage?: string | React.ReactNode;
  /** Custom message while loading */
  loadingMessage?: string | React.ReactNode;
  /** Custom message prompting search */
  searchingMessage?: string | React.ReactNode;

  // ============================================
  // VIRTUALIZATION (for large lists)
  // ============================================
  /** Enable virtualization for large option lists */
  virtualize?: boolean;
  /** Height of each virtualized item in pixels (default: 36) */
  virtualItemHeight?: number;
  /** Number of items to render outside visible area (default: 5) */
  overscan?: number;
}

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

function SelectField<T extends SelectOption = SelectOption>({
  options: initialOptions = [],
  value,
  onChange,
  multiple = false,
  searchable = true,
  creatable = false,
  async = false,
  onSearch,
  debounceMs = 300,
  cacheOptions = true,
  onCreateOption,
  createLabel = "Create",
  placeholder = "Select...",
  disabled = false,
  size = "default",
  className,
  maxDisplayedTags = 3,
  showSearchIcon = true,
  fuzzyMatching = true,
  filterFn,
  // Accessibility props
  required,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalid,
  name,
  // Callback props
  onOpenChange,
  onSearchChange,
  onClearAll,
  // Trigger variants
  variant = "default",
  leftIcon,
  hideChevron = false,
  // Empty state customization
  emptyMessage,
  loadingMessage,
  searchingMessage,
}: SelectFieldProps<T>) {
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<T[]>(
    flattenOptions(initialOptions) as T[],
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const listRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const cacheRef = React.useRef<Map<string, T[]>>(new Map());
  const typeaheadRef = React.useRef("");
  const typeaheadTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const debouncedQuery = useDebounce(inputValue, debounceMs);
  const listId = React.useId();
  const triggerId = React.useId();

  // Call onOpenChange when isOpen changes
  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
      if (!open) {
        setHighlightedIndex(-1);
      }
    },
    [onOpenChange],
  );

  // Convert value to internal format
  const selectedValues = React.useMemo(() => {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  // Update options when initialOptions change (for non-async mode)
  React.useEffect(() => {
    if (!async) {
      const flattened = flattenOptions(initialOptions) as T[];
      setOptions(flattened);
    }
  }, [initialOptions, async]);

  // Async search effect
  React.useEffect(() => {
    if (!async || !onSearch) return;

    if (!debouncedQuery && !isOpen) {
      return;
    }

    // Check cache
    if (cacheOptions && cacheRef.current.has(debouncedQuery)) {
      setOptions(cacheRef.current.get(debouncedQuery) || []);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    onSearch(debouncedQuery)
      .then((results) => {
        if (!cancelled) {
          setOptions(results as T[]);
          if (cacheOptions) {
            cacheRef.current.set(debouncedQuery, results as T[]);
          }
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
  }, [debouncedQuery, isOpen, async, onSearch, cacheOptions]);

  // Filter options (only for non-async mode)
  const filteredOptions = React.useMemo(() => {
    if (async) {
      return options;
    }

    if (!inputValue) {
      return options;
    }

    return options.filter((opt) => {
      if (filterFn) {
        return filterFn(opt, inputValue);
      }
      return fuzzyMatching
        ? fuzzyMatch(opt.label, inputValue)
        : opt.label.toLowerCase().includes(inputValue.toLowerCase());
    });
  }, [options, inputValue, fuzzyMatching, filterFn, async]);

  // Check if create option should be shown
  const showCreateOption = React.useMemo(() => {
    if (!creatable || !inputValue.trim()) return false;
    const normalizedInput = inputValue.trim().toLowerCase();
    return !filteredOptions.some(
      (opt) => opt.label.toLowerCase() === normalizedInput,
    );
  }, [creatable, inputValue, filteredOptions]);

  // Animate items when dropdown opens
  React.useEffect(() => {
    if (isOpen && listRef.current && !isLoading) {
      const items = listRef.current.querySelectorAll("[data-option]");
      if (items.length > 0) {
        animate(items, {
          opacity: [0, 1],
          translateY: [-10, 0],
          delay: stagger(30),
          duration: 200,
          ease: "outQuad",
        });
      }
    }
  }, [isOpen, filteredOptions.length, isLoading]);

  const handleSelect = (optionValue: string) => {
    const option = options.find((o) => o.value === optionValue);

    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];

      const newOptions = options.filter((o) => newValues.includes(o.value));
      onChange?.(newValues, newOptions as T[]);
      setInputValue("");
    } else {
      onChange?.(optionValue, option || null);
      setIsOpen(false);
      if (option) {
        setInputValue(option.label);
      }
    }
  };

  const handleRemoveChip = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== optionValue);
    const newOptions = options.filter((o) => newValues.includes(o.value));
    onChange?.(
      multiple ? newValues : "",
      multiple ? (newOptions as T[]) : null,
    );
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : "", null);
    setInputValue("");
  };

  const handleCreate = () => {
    if (inputValue.trim() && onCreateOption) {
      onCreateOption(inputValue.trim());
      setInputValue("");
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onSearchChange?.(newValue);
    if (!isOpen) {
      handleOpenChange(true);
    }
  };

  // Get enabled (non-disabled) options for keyboard navigation
  const enabledOptions = React.useMemo(() => {
    return filteredOptions.filter((opt) => !opt.disabled);
  }, [filteredOptions]);

  // Handle typeahead character navigation
  const handleTypeahead = React.useCallback(
    (char: string) => {
      if (typeaheadTimeoutRef.current) {
        clearTimeout(typeaheadTimeoutRef.current);
      }
      typeaheadRef.current += char.toLowerCase();

      const matchIndex = enabledOptions.findIndex((opt) =>
        opt.label.toLowerCase().startsWith(typeaheadRef.current),
      );

      if (matchIndex !== -1) {
        const actualIndex = filteredOptions.findIndex(
          (opt) => opt.value === enabledOptions[matchIndex].value,
        );
        setHighlightedIndex(actualIndex);
      }

      typeaheadTimeoutRef.current = setTimeout(() => {
        typeaheadRef.current = "";
      }, 500);
    },
    [enabledOptions, filteredOptions],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const optionCount = filteredOptions.length + (showCreateOption ? 1 : 0);

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        handleOpenChange(false);
        break;

      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          handleOpenChange(true);
        } else {
          setHighlightedIndex((prev) => {
            const next = prev + 1;
            return next >= optionCount ? 0 : next;
          });
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          handleOpenChange(true);
        } else {
          setHighlightedIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? optionCount - 1 : next;
          });
        }
        break;

      case "Home":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(0);
        }
        break;

      case "End":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(optionCount - 1);
        }
        break;

      case "PageUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => Math.max(0, prev - 10));
        }
        break;

      case "PageDown":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => Math.min(optionCount - 1, prev + 10));
        }
        break;

      case "Enter":
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          if (highlightedIndex < filteredOptions.length) {
            const option = filteredOptions[highlightedIndex];
            if (!option.disabled) {
              handleSelect(option.value);
            }
          } else if (showCreateOption) {
            handleCreate();
          }
        } else if (!isOpen) {
          handleOpenChange(true);
        }
        break;

      case " ": // Space
        if (!searchable && !isOpen) {
          e.preventDefault();
          handleOpenChange(true);
        }
        break;

      case "Tab":
        // Close on tab, allow default behavior
        handleOpenChange(false);
        break;

      case "Backspace":
        if (!inputValue && multiple && selectedValues.length > 0) {
          const newValues = selectedValues.slice(0, -1);
          const newOptions = options.filter((o) => newValues.includes(o.value));
          onChange?.(newValues, newOptions as T[]);
        }
        break;

      default:
        // Typeahead for non-searchable selects
        if (!searchable && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          handleTypeahead(e.key);
        }
        break;
    }
  };

  // Clear all selections (multi-select only)
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([], []);
    setInputValue("");
    onClearAll?.();
  };

  const selectedOptions = options.filter((o) =>
    selectedValues.includes(o.value),
  );
  const displayedTags = selectedOptions.slice(0, maxDisplayedTags);
  const remainingCount = selectedOptions.length - maxDisplayedTags;

  const triggerClasses = cn(
    "flex flex-wrap items-center gap-1 min-h-8 px-2 py-1 rounded-lg border bg-transparent cursor-text w-full transition-colors",
    // Variant styles
    variant === "default" &&
      "border-input dark:bg-input/30 dark:hover:bg-input/50",
    variant === "ghost" && "border-transparent hover:bg-muted",
    variant === "outline" && "border-input bg-transparent hover:bg-muted/50",
    // Focus and validation states
    "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
    ariaInvalid &&
      "border-destructive ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/30",
    // Size variants
    size === "sm" && "min-h-7 rounded-[min(var(--radius-md),10px)]",
    disabled && "opacity-50 pointer-events-none cursor-not-allowed",
  );

  const popupClasses = cn(
    "absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-border bg-popover p-1 shadow-md",
    "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95",
  );

  const itemClasses = (
    isHighlighted: boolean,
    isSelected: boolean,
    isDisabled?: boolean,
  ) =>
    cn(
      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none cursor-pointer",
      isHighlighted && "bg-accent text-accent-foreground",
      isSelected && "font-medium",
      isDisabled && "opacity-50 pointer-events-none cursor-not-allowed",
    );

  // Get the ID of the currently highlighted option for aria-activedescendant
  const activeDescendantId =
    highlightedIndex >= 0 && highlightedIndex < filteredOptions.length
      ? `${listId}-option-${highlightedIndex}`
      : undefined;

  return (
    <div className={cn("relative w-full", className)}>
      {/* Hidden input for form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={multiple ? selectedValues.join(",") : selectedValues[0] || ""}
        />
      )}

      {/* Trigger container */}
      <div
        ref={triggerRef}
        id={triggerId}
        className={triggerClasses}
        onClick={() => !disabled && handleOpenChange(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listId : undefined}
        aria-activedescendant={activeDescendantId}
        aria-disabled={disabled}
        aria-required={required}
        aria-invalid={ariaInvalid}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
      >
        {/* Left icon */}
        {leftIcon && (
          <span className="shrink-0 text-muted-foreground">{leftIcon}</span>
        )}

        {showSearchIcon && searchable && !leftIcon && (
          <IconSearch className="h-4 w-4 text-muted-foreground shrink-0" />
        )}

        {/* Multi-select chips */}
        {multiple &&
          displayedTags.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-muted shrink-0"
            >
              {opt.label}
              <button
                type="button"
                onClick={(e) => handleRemoveChip(opt.value, e)}
                className="hover:text-destructive rounded-sm"
                aria-label={`Remove ${opt.label}`}
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

        {/* Search input */}
        {searchable ? (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => handleOpenChange(false), 150)}
            placeholder={
              multiple && selectedValues.length > 0 ? "" : placeholder
            }
            disabled={disabled}
            className="flex-1 min-w-[80px] bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            aria-autocomplete="list"
            aria-controls={isOpen ? listId : undefined}
          />
        ) : (
          <span
            className={cn(
              "flex-1 text-sm text-left truncate",
              !selectedOptions.length && "text-muted-foreground",
            )}
          >
            {!multiple && selectedOptions.length > 0
              ? selectedOptions[0].label
              : placeholder}
          </span>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
        )}

        {/* Clear button - single select */}
        {!isLoading && !multiple && selectedValues.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-sm p-0.5 hover:bg-muted"
            aria-label="Clear selection"
          >
            <IconX className="h-4 w-4" />
          </button>
        )}

        {/* Clear all button - multi-select */}
        {!isLoading && selectedValues.length > 0 && multiple && (
          <button
            type="button"
            onClick={handleClearAll}
            className="rounded-sm p-0.5 hover:bg-muted"
            aria-label="Clear all selections"
          >
            <IconX className="h-4 w-4" />
          </button>
        )}

        {/* Chevron icon */}
        {!isLoading && !hideChevron && (
          <IconChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        )}
      </div>

      {/* Dropdown popup */}
      {isOpen && (
        <div
          ref={listRef}
          id={listId}
          className={popupClasses}
          role="listbox"
          aria-multiselectable={multiple}
          aria-label={ariaLabel}
        >
          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center py-4 gap-2 text-sm text-muted-foreground">
              <IconLoader2 className="h-4 w-4 animate-spin" />
              {loadingMessage || "Loading..."}
            </div>
          ) : filteredOptions.length === 0 && !showCreateOption ? (
            /* Empty state */
            <div className="py-4 text-center text-sm text-muted-foreground">
              {emptyMessage ||
                (inputValue
                  ? "No results found"
                  : async
                    ? searchingMessage || "Type to search..."
                    : "No options")}
            </div>
          ) : (
            /* Options list */
            <>
              {filteredOptions.map((option, index) => {
                const isSelected = selectedValues.includes(option.value);
                const isHighlighted = index === highlightedIndex;
                return (
                  <div
                    key={option.value}
                    id={`${listId}-option-${index}`}
                    data-option
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    className={itemClasses(
                      isHighlighted,
                      isSelected,
                      option.disabled,
                    )}
                    onClick={() =>
                      !option.disabled && handleSelect(option.value)
                    }
                    onMouseDown={(e) => {
                      // Prevent input blur to keep menu open (especially for multi-select)
                      // If single select, handleSelect will close it anyway.
                      e.preventDefault();
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {multiple && (
                      <div
                        className={cn(
                          "h-4 w-4 border rounded flex items-center justify-center shrink-0",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-input",
                        )}
                      >
                        {isSelected && (
                          <IconCheck className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                    )}
                    <span className="flex-1 text-left truncate">
                      {option.label}
                    </span>
                    {!multiple && isSelected && (
                      <IconCheck className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </div>
                );
              })}

              {/* Create option */}
              {showCreateOption && (
                <div
                  id={`${listId}-option-${filteredOptions.length}`}
                  data-option
                  role="option"
                  aria-selected={false}
                  className={cn(
                    itemClasses(
                      highlightedIndex === filteredOptions.length,
                      false,
                    ),
                    "text-primary",
                  )}
                  onClick={handleCreate}
                  onMouseEnter={() =>
                    setHighlightedIndex(filteredOptions.length)
                  }
                >
                  <span className="flex-1 text-left">
                    {createLabel} "{inputValue.trim()}"
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// DEPRECATED COMPONENTS
// These are kept for backward compatibility.
// Use SelectField instead with appropriate props.
// ============================================

/**
 * @deprecated Use `<SelectField multiple />` instead.
 * This component is kept for backward compatibility.
 */
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

/**
 * @deprecated Use `<SelectField multiple />` instead.
 */
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
  return (
    <SelectField
      options={options}
      value={value}
      onChange={(val) => onChange?.(val as string[])}
      multiple
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      maxDisplayedTags={maxDisplayedTags}
      showSearchIcon={showSearchIcon}
    />
  );
}

/**
 * @deprecated Use `<SelectField async onSearch={...} />` instead.
 * This component is kept for backward compatibility.
 */
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

/**
 * @deprecated Use `<SelectField async onSearch={...} />` instead.
 */
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
  return (
    <SelectField
      value={value}
      onChange={(val, opt) =>
        onChange?.(val as string, opt as SelectOption | null)
      }
      async
      onSearch={loadOptions}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      debounceMs={debounceMs}
      cacheOptions={cacheOptions}
      showSearchIcon={showSearchIcon}
    />
  );
}

/**
 * @deprecated Use `<SelectField creatable onCreateOption={...} />` instead.
 * This component is kept for backward compatibility.
 */
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

/**
 * @deprecated Use `<SelectField creatable onCreateOption={...} />` instead.
 */
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
  return (
    <SelectField
      options={options}
      value={value}
      onChange={(val, opt) => onChange?.(val as string, opt as SelectOption)}
      creatable
      onCreateOption={onCreateOption}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      createLabel={createLabel}
    />
  );
}

/**
 * @deprecated Use `<SelectField />` with appropriate props instead.
 * This component is kept for backward compatibility.
 */
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

/**
 * @deprecated Use `<SelectField />` with appropriate props instead.
 */
function Autocomplete({
  options: initialOptions = [],
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  disabled = false,
  multiple = false,
  debounceMs = 300,
  fuzzyMatching = true,
  className,
}: AutocompleteProps) {
  return (
    <SelectField
      options={initialOptions}
      value={value}
      onChange={(val) => onChange?.(val)}
      multiple={multiple}
      async={!!onSearch}
      onSearch={onSearch}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      debounceMs={debounceMs}
      fuzzyMatching={fuzzyMatching}
      showSearchIcon
    />
  );
}

// ============================================
// EXPORTS
// ============================================

export {
  // Base Select primitives (low-level)
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
  // Unified component (recommended)
  SelectField,
  // Deprecated components (backward compatibility)
  MultiSelect,
  AsyncSelect,
  CreatableSelect,
  Autocomplete,
  // Utilities
  fuzzyMatch,
  useDebounce,
};

export type {
  SelectOption,
  AutocompleteOption,
  SelectFieldProps,
  // Deprecated types
  MultiSelectProps,
  AsyncSelectProps,
  CreatableSelectProps,
  AutocompleteProps,
};
