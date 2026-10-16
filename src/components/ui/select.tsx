"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  IconCheck,
  IconChevronUp,
  IconChevronDown,
  IconX,
  IconSearch,
  IconLoader2,
} from "@tabler/icons-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
      className={cn("flex flex-1 text-left", className)}
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
        "data-placeholder:text-muted-foreground",
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
        data-slot="select-icon"
        render={
          <IconChevronDown className="text-muted-foreground size-4 pointer-events-none transition-transform data-popup-open:rotate-180" />
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
  const reducedMotion = useReducedMotion();

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        data-slot="select-positioner"
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
            "bg-popover text-popover-foreground ring-foreground/10 min-w-36 rounded-lg shadow-md ring-1 duration-100 relative isolate z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto",
            !reducedMotion &&
              "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List data-slot="select-list">
            {children}
          </SelectPrimitive.List>
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
        "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText
        data-slot="select-item-text"
        className="flex flex-1 gap-2 shrink-0 whitespace-nowrap"
      >
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        data-slot="select-item-indicator"
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

interface GroupedSelectOption<T extends SelectOption = SelectOption> {
  label: string;
  options: T[];
}

function isGroupedOptions<T extends SelectOption>(
  options: T[] | GroupedSelectOption<T>[]
): options is GroupedSelectOption<T>[] {
  return options.length > 0 && "options" in options[0];
}

function flattenOptions<T extends SelectOption>(
  options: T[] | GroupedSelectOption<T>[]
): T[] {
  if (isGroupedOptions(options)) {
    return options.flatMap((group) => group.options);
  }

  return options;
}

interface SelectFieldProps<T extends SelectOption = SelectOption> {
  options?: T[] | GroupedSelectOption<T>[];

  value?: string | string[];

  onChange?: (
    value: string | string[],
    selectedOptions: T | T[] | null
  ) => void;

  multiple?: boolean;

  searchable?: boolean;

  creatable?: boolean;

  async?: boolean;

  onSearch?: (query: string) => Promise<T[]>;

  debounceMs?: number;

  cacheOptions?: boolean;

  onCreateOption?: (inputValue: string) => void;

  createLabel?: string;

  placeholder?: string;

  disabled?: boolean;

  size?: "sm" | "default";

  className?: string;

  maxDisplayedTags?: number;

  showSearchIcon?: boolean;

  fuzzyMatching?: boolean;

  filterFn?: (option: T, query: string) => boolean;

  required?: boolean;

  "aria-label"?: string;

  "aria-labelledby"?: string;

  "aria-describedby"?: string;

  "aria-invalid"?: boolean;

  name?: string;

  onOpenChange?: (open: boolean) => void;

  onSearchChange?: (query: string) => void;

  onClearAll?: () => void;

  variant?: "default" | "ghost" | "outline";

  leftIcon?: React.ReactNode;

  hideChevron?: boolean;

  emptyMessage?: string | React.ReactNode;

  loadingMessage?: string | React.ReactNode;

  searchingMessage?: string | React.ReactNode;
}

function fuzzyMatch(text: string, query: string): boolean {
  const pattern = query.toLowerCase().split("").join(".*");
  const regex = new RegExp(pattern);

  return regex.test(text.toLowerCase());
}

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

  required,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalid,
  name,

  onOpenChange,
  onSearchChange,
  onClearAll,

  variant = "default",
  leftIcon,
  hideChevron = false,

  emptyMessage,
  loadingMessage,
  searchingMessage,
}: SelectFieldProps<T>) {
  const [inputValue, setInputValue] = React.useState("");
  const reducedMotion = useReducedMotion();

  const [options, setOptions] = React.useState<T[]>(
    flattenOptions(initialOptions) as T[]
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const listRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const cacheRef = React.useRef<Map<string, T[]>>(new Map());
  const typeaheadRef = React.useRef("");

  const typeaheadTimeoutRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const debouncedQuery = useDebounce(inputValue, debounceMs);
  const listId = React.useId();
  const triggerId = React.useId();

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);

      if (!open) {
        setHighlightedIndex(-1);
      }
    },
    [onOpenChange]
  );

  const selectedValues = React.useMemo(() => {
    if (value === undefined || value === null) return [];

    return Array.isArray(value) ? value : [value];
  }, [value]);

  // Sync options from props during render (not an effect) so a changing
  // `initialOptions`/`async` updates the list without a cascading render.
  const [prevSync, setPrevSync] = React.useState({ initialOptions, async });

  if (prevSync.initialOptions !== initialOptions || prevSync.async !== async) {
    setPrevSync({ initialOptions, async });

    if (!async) {
      setOptions(flattenOptions(initialOptions) as T[]);
    }
  }

  React.useEffect(() => {
    if (!async || !onSearch) return;

    if (!debouncedQuery && !isOpen) {
      return;
    }

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

  const showCreateOption = React.useMemo(() => {
    if (!creatable || !inputValue.trim()) return false;
    const normalizedInput = inputValue.trim().toLowerCase();

    return !filteredOptions.some(
      (opt) => opt.label.toLowerCase() === normalizedInput
    );
  }, [creatable, inputValue, filteredOptions]);

  useGSAP(() => {
    if (isOpen && listRef.current && !isLoading) {
      const items = listRef.current.querySelectorAll("[data-option]");

      if (items.length > 0) {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(
            items,
            { opacity: 0, y: -10 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.03,
              duration: 0.2,
              ease: "power2.out",
            }
          );
        });

        return () => mm.revert();
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
      multiple ? (newOptions as T[]) : null
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

  const enabledOptions = React.useMemo(() => {
    return filteredOptions.filter((opt) => !opt.disabled);
  }, [filteredOptions]);

  const handleTypeahead = React.useCallback(
    (char: string) => {
      if (typeaheadTimeoutRef.current) {
        clearTimeout(typeaheadTimeoutRef.current);
      }

      typeaheadRef.current += char.toLowerCase();

      const matchIndex = enabledOptions.findIndex((opt) =>
        opt.label.toLowerCase().startsWith(typeaheadRef.current)
      );

      if (matchIndex !== -1) {
        const actualIndex = filteredOptions.findIndex(
          (opt) => opt.value === enabledOptions[matchIndex].value
        );

        setHighlightedIndex(actualIndex);
      }

      typeaheadTimeoutRef.current = setTimeout(() => {
        typeaheadRef.current = "";
      }, 500);
    },
    [enabledOptions, filteredOptions]
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

        if (isOpen) {
          setHighlightedIndex((prev) => {
            const next = prev + 1;

            return next >= optionCount ? 0 : next;
          });
        } else {
          handleOpenChange(true);
        }

        break;

      case "ArrowUp":
        e.preventDefault();

        if (isOpen) {
          setHighlightedIndex((prev) => {
            const next = prev - 1;

            return next < 0 ? optionCount - 1 : next;
          });
        } else {
          handleOpenChange(true);
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
        handleOpenChange(false);
        break;

      case "Backspace":
        if (!inputValue && multiple && selectedValues.length > 0) {
          // Bound on both the trigger and the input; stop the bubble so an
          // empty-input Backspace doesn't remove two tags.
          e.stopPropagation();
          const newValues = selectedValues.slice(0, -1);
          const newOptions = options.filter((o) => newValues.includes(o.value));
          onChange?.(newValues, newOptions as T[]);
        }

        break;

      default:
        if (!searchable && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          handleTypeahead(e.key);
        }

        break;
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([], []);
    setInputValue("");
    onClearAll?.();
  };

  const selectedOptions = options.filter((o) =>
    selectedValues.includes(o.value)
  );

  const displayedTags = selectedOptions.slice(0, maxDisplayedTags);
  const remainingCount = selectedOptions.length - maxDisplayedTags;

  const triggerClasses = cn(
    "flex flex-wrap items-center gap-1 min-h-8 px-2 py-1 rounded-lg border bg-transparent cursor-text w-full transition-colors",

    variant === "default" &&
      "border-input dark:bg-input/30 dark:hover:bg-input/50",
    variant === "ghost" && "border-transparent hover:bg-muted",
    variant === "outline" && "border-input bg-transparent hover:bg-muted/50",

    "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
    ariaInvalid &&
      "border-destructive ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/30",

    size === "sm" && "min-h-7 rounded-[min(var(--radius-md),10px)]",
    disabled && "opacity-50 pointer-events-none cursor-not-allowed"
  );

  const popupClasses = cn(
    "absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-border bg-popover p-1 shadow-md",
    !reducedMotion &&
      "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95"
  );

  const itemClasses = (
    isHighlighted: boolean,
    isSelected: boolean,
    isDisabled?: boolean
  ) =>
    cn(
      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none cursor-pointer",
      isHighlighted && "bg-accent text-accent-foreground",
      isSelected && "font-medium",
      isDisabled && "opacity-50 pointer-events-none cursor-not-allowed"
    );

  const activeDescendantId =
    highlightedIndex >= 0 && highlightedIndex < filteredOptions.length
      ? `${listId}-option-${highlightedIndex}`
      : undefined;

  return (
    <div data-slot="select-field" className={cn("relative w-full", className)}>
      {name && (
        <input
          type="hidden"
          name={name}
          value={multiple ? selectedValues.join(",") : selectedValues[0] || ""}
        />
      )}

      <div
        ref={triggerRef}
        id={triggerId}
        data-slot="select-field-trigger"
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
        {leftIcon && (
          <span className="shrink-0 text-muted-foreground">{leftIcon}</span>
        )}

        {showSearchIcon && searchable && !leftIcon && (
          <IconSearch className="h-4 w-4 text-muted-foreground shrink-0" />
        )}

        {multiple &&
          displayedTags.map((opt) => (
            <span
              key={opt.value}
              data-slot="select-field-tag"
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

        {searchable ? (
          <input
            ref={inputRef}
            type="text"
            data-slot="select-field-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => handleOpenChange(false), 150)}
            placeholder={
              multiple && selectedValues.length > 0 ? "" : placeholder
            }
            disabled={disabled}
            className="flex-1 min-w-20 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            aria-autocomplete="list"
            aria-controls={isOpen ? listId : undefined}
          />
        ) : (
          <span
            className={cn(
              "flex-1 text-sm text-left truncate",
              !selectedOptions.length && "text-muted-foreground"
            )}
          >
            {!multiple && selectedOptions.length > 0
              ? selectedOptions[0].label
              : placeholder}
          </span>
        )}

        {isLoading && (
          <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
        )}

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

        {!isLoading && !hideChevron && (
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
          id={listId}
          data-slot="select-field-list"
          className={popupClasses}
          role="listbox"
          aria-multiselectable={multiple}
          aria-label={ariaLabel}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4 gap-2 text-sm text-muted-foreground">
              <IconLoader2 className="h-4 w-4 animate-spin" />
              {loadingMessage || "Loading..."}
            </div>
          ) : filteredOptions.length === 0 && !showCreateOption ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              {emptyMessage ||
                (inputValue
                  ? "No results found"
                  : async
                    ? searchingMessage || "Type to search..."
                    : "No options")}
            </div>
          ) : (
            <>
              {filteredOptions.map((option, index) => {
                const isSelected = selectedValues.includes(option.value);
                const isHighlighted = index === highlightedIndex;

                return (
                  <div
                    key={option.value}
                    id={`${listId}-option-${index}`}
                    data-slot="select-field-option"
                    data-option
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    className={itemClasses(
                      isHighlighted,
                      isSelected,
                      option.disabled
                    )}
                    onClick={() =>
                      !option.disabled && handleSelect(option.value)
                    }
                    onMouseDown={(e) => {
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
                            : "border-input"
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

              {showCreateOption && (
                <div
                  id={`${listId}-option-${filteredOptions.length}`}
                  data-slot="select-field-create"
                  data-option
                  role="option"
                  aria-selected={false}
                  className={cn(
                    itemClasses(
                      highlightedIndex === filteredOptions.length,
                      false
                    ),
                    "text-primary"
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

// === KiraSelect: one prop-driven combobox ===

interface KiraSelectProps<T extends SelectOption = SelectOption> {
  options: T[] | GroupedSelectOption<T>[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[], option: T | T[] | null) => void;
  multiple?: boolean;
  searchable?: boolean;
  async?: boolean;
  onSearch?: (query: string) => Promise<T[]>;
  creatable?: boolean;
  onCreateOption?: (inputValue: string) => void;
  createLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "default";
  variant?: "default" | "ghost" | "outline";
  leftIcon?: React.ReactNode;
  hideChevron?: boolean;
  maxDisplayedTags?: number;
  emptyMessage?: string | React.ReactNode;
  loadingMessage?: string | React.ReactNode;
  searchingMessage?: string | React.ReactNode;
  /** Marks the control invalid: sets aria-invalid + destructive ring. */
  invalid?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
  "aria-label"?: string;
}

function KiraSelect<T extends SelectOption = SelectOption>({
  options,
  value,
  defaultValue,
  onChange,
  multiple = false,
  searchable = false,
  async = false,
  onSearch,
  creatable = false,
  onCreateOption,
  createLabel = "Create",
  placeholder = "Select...",
  disabled = false,
  size = "default",
  variant = "default",
  leftIcon,
  hideChevron = false,
  maxDisplayedTags = 3,
  emptyMessage,
  loadingMessage,
  searchingMessage,
  invalid,
  required,
  name,
  className,
  "aria-label": ariaLabel,
}: KiraSelectProps<T>) {
  // Uncontrolled fallback for the simple Base UI path.
  const [internalValue, setInternalValue] = React.useState<
    string | string[] | undefined
  >(defaultValue);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const isRich = searchable || async || creatable || multiple;
  const flat = React.useMemo(() => flattenOptions(options), [options]);

  // --- Rich path: delegate to the SelectField state machine ---
  if (isRich) {
    return (
      <SelectField<T>
        options={options}
        value={currentValue}
        onChange={(val, opt) => {
          if (!isControlled) setInternalValue(val);
          onChange?.(val, opt);
        }}
        multiple={multiple}
        searchable={searchable || async || creatable}
        async={async}
        onSearch={onSearch}
        creatable={creatable}
        onCreateOption={onCreateOption}
        createLabel={createLabel}
        placeholder={placeholder}
        disabled={disabled}
        size={size}
        variant={variant}
        leftIcon={leftIcon}
        hideChevron={hideChevron}
        maxDisplayedTags={maxDisplayedTags}
        emptyMessage={emptyMessage}
        loadingMessage={loadingMessage}
        searchingMessage={searchingMessage}
        aria-invalid={invalid}
        required={required}
        name={name}
        aria-label={ariaLabel}
        className={className}
      />
    );
  }

  // --- Simple path: native Base UI Select ---
  const renderItems = (items: T[]) =>
    items.map((opt) => (
      <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
        {opt.label}
      </SelectItem>
    ));

  return (
    <Select
      value={(currentValue as string) ?? ""}
      onValueChange={(val) => {
        if (!isControlled) setInternalValue(val as string);
        const opt = flat.find((o) => o.value === val) ?? null;
        onChange?.(val as string, opt);
      }}
      disabled={disabled}
      name={name}
      required={required}
    >
      <SelectTrigger
        size={size}
        aria-invalid={invalid}
        aria-label={ariaLabel}
        className={className}
      >
        {leftIcon && (
          <span className="shrink-0 text-muted-foreground">{leftIcon}</span>
        )}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isGroupedOptions(options)
          ? options.map((group) => (
              <SelectGroup key={group.label}>
                <SelectLabel>{group.label}</SelectLabel>
                {renderItems(group.options)}
              </SelectGroup>
            ))
          : renderItems(options)}
      </SelectContent>
    </Select>
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
  SelectField,
  KiraSelect,
};

export type {
  SelectOption,
  AutocompleteOption,
  GroupedSelectOption,
  SelectFieldProps,
  KiraSelectProps,
};
