import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { IconSearch, IconCheck, IconLoader2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

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
          "flex flex-wrap items-center gap-1 min-h-9 px-2 py-1 rounded-lg border border-input bg-background cursor-text",
          "focus-within:ring-2 focus-within:ring-ring",
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
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-primary/10 text-primary shrink-0"
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

export { Autocomplete, useDebounce, fuzzyMatch };
