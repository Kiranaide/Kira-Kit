"use client";

/* eslint-disable react-refresh/only-export-components */

import * as React from "react";
import {
  useMemo,
  useEffect,
  useRef,
  useId,
  createContext,
  useContext,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { AnyFieldApi } from "@tanstack/react-form";
import { z, type ZodType } from "zod";
import { animate } from "animejs";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// =============================================================================
// Types
// =============================================================================

type FieldApiLike = Pick<
  AnyFieldApi,
  "name" | "state" | "handleChange" | "handleBlur" | "setValue" | "getValue"
>;

// =============================================================================
// Field Context - Enables state propagation to child components
// =============================================================================

interface FieldContextValue {
  /** Unique identifier for the field */
  id: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is read-only */
  readOnly?: boolean;
  /** Whether the field is in an invalid state */
  invalid?: boolean;
  /** ID for the description element (for aria-describedby) */
  descriptionId: string;
  /** ID for the error element (for aria-describedby) */
  errorId: string;
  /** Whether the field has been touched */
  touched?: boolean;
  /** Whether the field is currently validating */
  validating?: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Hook to access field context from child components.
 * Returns null if used outside a Field component.
 */
function useFieldContext() {
  return useContext(FieldContext);
}

// =============================================================================
// FieldSet - Semantic fieldset wrapper
// =============================================================================

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 flex flex-col",
        className
      )}
      {...props}
    />
  );
}

// =============================================================================
// FieldLegend - Semantic legend element
// =============================================================================

interface FieldLegendProps extends React.ComponentProps<"legend"> {
  variant?: "legend" | "label";
  /** Show required indicator */
  showRequired?: boolean;
  /** Custom required indicator (default: "*") */
  requiredIndicator?: React.ReactNode;
}

function FieldLegend({
  className,
  variant = "legend",
  children,
  showRequired,
  requiredIndicator = "*",
  ...props
}: FieldLegendProps) {
  const context = useFieldContext();
  const shouldShowRequired = showRequired ?? context?.required;

  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
        context?.disabled && "opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {shouldShowRequired && (
        <span
          className="text-destructive ml-0.5 font-normal"
          aria-hidden="true"
        >
          {requiredIndicator}
        </span>
      )}
    </legend>
  );
}

// =============================================================================
// FieldGroup - Groups multiple fields together
// =============================================================================

interface FieldGroupProps extends React.ComponentProps<"div"> {
  /** Visual variant for the group */
  variant?: "default" | "outline";
}

function FieldGroup({
  className,
  variant = "default",
  ...props
}: FieldGroupProps) {
  return (
    <div
      data-slot="field-group"
      data-variant={variant}
      className={cn(
        "gap-5 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4 group/field-group @container/field-group flex w-full flex-col",
        variant === "outline" && "rounded-lg border border-input p-4",
        className
      )}
      {...props}
    />
  );
}

// =============================================================================
// Field - Main field wrapper with context provider
// =============================================================================

const fieldVariants = cva(
  "data-[invalid=true]:text-destructive gap-2 group/field flex w-full",
  {
    variants: {
      orientation: {
        vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
        horizontal:
          "flex-row items-center [&>[data-slot=field-label]]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto @md/field-group:[&>[data-slot=field-label]]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
);

interface FieldProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof fieldVariants> {
  /** Disable the entire field and its children */
  disabled?: boolean;
  /** Mark the field as required (shows indicator on label) */
  required?: boolean;
  /** Mark the field as read-only */
  readOnly?: boolean;
  /** Mark the field as invalid (triggers error styling) */
  invalid?: boolean;
  /** Custom ID for the field (auto-generated if not provided) */
  id?: string;
}

function Field({
  className,
  orientation = "vertical",
  disabled,
  required,
  readOnly,
  invalid,
  id,
  children,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  const contextValue: FieldContextValue = {
    id: fieldId,
    disabled,
    required,
    readOnly,
    invalid,
    descriptionId,
    errorId,
  };

  return (
    <FieldContext.Provider value={contextValue}>
      <div
        role="group"
        data-slot="field"
        data-orientation={orientation}
        data-disabled={disabled || undefined}
        data-required={required || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={invalid || undefined}
        className={cn(fieldVariants({ orientation }), className)}
        {...props}
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
}

// =============================================================================
// FieldContent - Content container within field
// =============================================================================

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  const context = useFieldContext();

  return (
    <div
      data-slot="field-content"
      className={cn(
        "gap-0.5 group/field-content flex flex-1 flex-col leading-snug",
        context?.disabled && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    />
  );
}

// =============================================================================
// FieldLabel - Label component with required indicator support
// =============================================================================

interface FieldLabelProps extends React.ComponentProps<typeof Label> {
  /** Show required indicator (inherits from Field context if not specified) */
  showRequired?: boolean;
  /** Custom required indicator (default: "*") */
  requiredIndicator?: React.ReactNode;
}

function FieldLabel({
  className,
  children,
  showRequired,
  requiredIndicator = "*",
  htmlFor,
  ...props
}: FieldLabelProps) {
  const context = useFieldContext();
  const shouldShowRequired = showRequired ?? context?.required;
  const labelFor = htmlFor || context?.id;

  return (
    <Label
      data-slot="field-label"
      htmlFor={labelFor}
      className={cn(
        "has-data-checked:bg-primary/5 has-data-checked:border-primary dark:has-data-checked:bg-primary/10 gap-2 group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-2.5 group/field-label peer/field-label flex w-fit leading-snug",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        context?.disabled && "cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
      {shouldShowRequired && (
        <span className="text-destructive font-normal" aria-hidden="true">
          {requiredIndicator}
        </span>
      )}
    </Label>
  );
}

// =============================================================================
// FieldTitle - Alternative label-like title
// =============================================================================

interface FieldTitleProps extends React.ComponentProps<"div"> {
  /** Show required indicator */
  showRequired?: boolean;
  /** Custom required indicator (default: "*") */
  requiredIndicator?: React.ReactNode;
}

function FieldTitle({
  className,
  children,
  showRequired,
  requiredIndicator = "*",
  ...props
}: FieldTitleProps) {
  const context = useFieldContext();
  const shouldShowRequired = showRequired ?? context?.required;

  return (
    <div
      data-slot="field-label"
      className={cn(
        "gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50 flex w-fit items-center leading-snug",
        context?.disabled && "opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {shouldShowRequired && (
        <span className="text-destructive font-normal" aria-hidden="true">
          {requiredIndicator}
        </span>
      )}
    </div>
  );
}

// =============================================================================
// FieldDescription - Helper/description text
// =============================================================================

interface FieldDescriptionProps extends React.ComponentProps<"p"> {
  /** ID override (uses context descriptionId if not provided) */
  id?: string;
}

function FieldDescription({ className, id, ...props }: FieldDescriptionProps) {
  const context = useFieldContext();
  const descId = id || context?.descriptionId;

  return (
    <p
      id={descId}
      data-slot="field-description"
      className={cn(
        "text-muted-foreground text-left text-sm [[data-variant=legend]+&]:-mt-1.5 leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        context?.disabled && "opacity-50",
        className
      )}
      {...props}
    />
  );
}

/** @alias FieldDescription - For API compatibility with other UI libraries */
const FieldHelperText = FieldDescription;

// =============================================================================
// FieldCharacterCount - Character count display for inputs
// =============================================================================

interface FieldCharacterCountProps extends React.ComponentProps<"span"> {
  /** Current character count */
  current: number;
  /** Maximum allowed characters */
  max: number;
  /** Percentage threshold to show warning (default: 80) */
  warningThreshold?: number;
  /** Hide when below threshold */
  showOnlyNearLimit?: boolean;
}

function FieldCharacterCount({
  current,
  max,
  warningThreshold = 80,
  showOnlyNearLimit = false,
  className,
  ...props
}: FieldCharacterCountProps) {
  const percentage = (current / max) * 100;
  const isWarning = percentage >= warningThreshold && current <= max;
  const isError = current > max;

  // Hide if below threshold and showOnlyNearLimit is enabled
  if (showOnlyNearLimit && percentage < warningThreshold) {
    return null;
  }

  return (
    <span
      data-slot="field-character-count"
      data-warning={isWarning || undefined}
      data-error={isError || undefined}
      className={cn(
        "text-xs text-muted-foreground tabular-nums transition-colors",
        isWarning && "text-warning",
        isError && "text-destructive font-medium",
        className
      )}
      aria-live="polite"
      aria-atomic="true"
      {...props}
    >
      {current}/{max}
    </span>
  );
}

// =============================================================================
// FieldSeparator - Visual separator with optional content
// =============================================================================

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "-my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2 relative",
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="text-muted-foreground px-2 bg-background relative mx-auto block w-fit"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

// =============================================================================
// FieldValidationIcon - Status icon for validation state
// =============================================================================

interface FieldValidationIconProps extends React.ComponentProps<"span"> {
  /** Validation state */
  state: "valid" | "invalid" | "validating";
  /** Size of the icon */
  size?: "sm" | "default" | "lg";
}

function FieldValidationIcon({
  state,
  size = "default",
  className,
  ...props
}: FieldValidationIconProps) {
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (iconRef.current && state !== "validating") {
      animate(iconRef.current, {
        scale: [0, 1.1, 1],
        opacity: [0, 1],
        duration: 300,
        easing: "easeOutBack",
      });
    }
  }, [state]);

  const sizeClasses = {
    sm: "h-3 w-3",
    default: "h-4 w-4",
    lg: "h-5 w-5",
  };

  if (state === "validating") {
    return (
      <span
        data-slot="field-validation-icon"
        data-state="validating"
        className={cn(
          "inline-flex items-center justify-center",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <svg
          className="animate-spin text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      ref={iconRef}
      data-slot="field-validation-icon"
      data-state={state}
      className={cn(
        "inline-flex items-center justify-center",
        sizeClasses[size],
        state === "valid" && "text-success",
        state === "invalid" && "text-destructive",
        className
      )}
      {...props}
    >
      {state === "valid" && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
      {state === "invalid" && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
    </span>
  );
}

// =============================================================================
// Zod Validation Helper
// =============================================================================

type ZodValidatorOptions = {
  onChange?: boolean | number;
  onBlur?: boolean;
  onSubmit?: boolean;
};

type ZodValidatorReturn<T> = {
  onChange?: ({
    value,
  }: {
    value: T;
  }) => string | undefined | Promise<string | undefined>;
  onBlur?: ({ value }: { value: T }) => string | undefined;
  onSubmit?: ({
    value,
  }: {
    value: T;
  }) => string | undefined | Record<string, string>;
  onChangeAsyncDebounceMs?: number;
  onChangeAsync?: ({
    value,
    signal,
  }: {
    value: T;
    signal: AbortSignal;
  }) => Promise<string | undefined>;
};

function createZodValidator<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodType<T, any, any>,
  options: ZodValidatorOptions = { onChange: true, onSubmit: true }
): ZodValidatorReturn<T> {
  const result: ZodValidatorReturn<T> = {};

  if (options.onChange !== false) {
    result.onChange = ({ value }: { value: T }) => {
      const parseResult = schema.safeParse(value);
      if (!parseResult.success) {
        const issue = parseResult.error.issues[0];
        return issue?.message;
      }
      return undefined;
    };

    if (typeof options.onChange === "number") {
      result.onChangeAsyncDebounceMs = options.onChange;
      result.onChangeAsync = async ({
        value,
        signal,
      }: {
        value: T;
        signal: AbortSignal;
      }) => {
        if (signal.aborted) return undefined;
        const parseResult = await schema.safeParseAsync(value);
        if (!parseResult.success) {
          const issue = parseResult.error.issues[0];
          return issue?.message;
        }
        return undefined;
      };
    }
  }

  if (options.onBlur) {
    result.onBlur = ({ value }: { value: T }) => {
      const parseResult = schema.safeParse(value);
      if (!parseResult.success) {
        const issue = parseResult.error.issues[0];
        return issue?.message;
      }
      return undefined;
    };
  }

  if (options.onSubmit !== false) {
    result.onSubmit = ({ value }: { value: T }) => {
      const parseResult = schema.safeParse(value);
      if (!parseResult.success) {
        const errors: Record<string, string> = {};
        for (const issue of parseResult.error.issues) {
          const path = issue.path.join(".");
          if (path) {
            errors[path] = issue.message;
          }
        }
        return Object.keys(errors).length > 0 ? errors : undefined;
      }
      return undefined;
    };
  }

  return result;
}

// =============================================================================
// Enhanced FieldError with TanStack Form Support and Animation
// =============================================================================

interface FieldErrorProps extends React.ComponentProps<"div"> {
  errors?: Array<{ message?: string } | undefined> | string[] | null;
  field?: FieldApiLike | AnyFieldApi;
  showErrors?: boolean;
  /** Show validation icon */
  showIcon?: boolean;
}

function FieldError({
  className,
  children,
  errors,
  field,
  showErrors = true,
  showIcon = false,
  id,
  ...props
}: FieldErrorProps) {
  const context = useFieldContext();
  const errorRef = useRef<HTMLDivElement>(null);
  const errorId = id || context?.errorId;

  const metaErrors = useMemo(() => {
    if (field && "state" in field) {
      return field.state.meta.errors;
    }
    return errors;
  }, [field, errors]);

  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!metaErrors?.length || !showErrors) {
      return null;
    }

    const errorArray =
      typeof metaErrors[0] === "string"
        ? (metaErrors as string[]).map((msg) => ({ message: msg }))
        : (metaErrors as Array<{ message?: string }>);

    const uniqueErrors = [
      ...new Map(errorArray.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    );
  }, [children, metaErrors, showErrors]);

  // Animate error appearance
  useEffect(() => {
    if (errorRef.current && content) {
      animate(errorRef.current, {
        opacity: [0, 1],
        translateY: [-4, 0],
        duration: 200,
        easing: "easeOutQuad",
      });
    }
  }, [content]);

  if (!content) {
    return null;
  }

  const isInvalid =
    field && "state" in field
      ? !field.state.meta.isValid && field.state.meta.isTouched
      : undefined;

  return (
    <div
      ref={errorRef}
      id={errorId}
      role="alert"
      data-slot="field-error"
      data-invalid={isInvalid}
      aria-live="polite"
      className={cn(
        "text-destructive text-sm font-normal flex items-start gap-1.5",
        className
      )}
      {...props}
    >
      {showIcon && (
        <FieldValidationIcon
          state="invalid"
          size="sm"
          className="mt-0.5 shrink-0"
        />
      )}
      <span>{content}</span>
    </div>
  );
}

/** @alias FieldError - For API compatibility with other UI libraries */
const FieldErrorText = FieldError;

// =============================================================================
// FormField - Enhanced Field for TanStack Form
// =============================================================================

interface FormFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  children: (field: FieldApiLike) => React.ReactNode;
  className?: string;
  orientation?: "vertical" | "horizontal" | "responsive";
  /** Disable the field */
  disabled?: boolean;
  /** Mark the field as required */
  required?: boolean;
  /** Mark the field as read-only */
  readOnly?: boolean;
}

function FormField({
  name,
  form,
  children,
  className,
  orientation = "vertical",
  disabled,
  required,
  readOnly,
  ...props
}: FormFieldProps) {
  return (
    <form.Field
      name={name}
      children={(field: FieldApiLike) => {
        const isInvalid =
          !field.state.meta.isValid && field.state.meta.isTouched;

        return (
          <Field
            className={className}
            orientation={orientation}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            invalid={isInvalid}
            {...props}
          >
            {children(field)}
          </Field>
        );
      }}
    />
  );
}

// =============================================================================
// FieldInput - Helper for common input patterns
// =============================================================================

interface FieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field?: FieldApiLike;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  /** Show character count (requires maxLength) */
  showCharacterCount?: boolean;
}

function FieldInput({
  field,
  label,
  description,
  error,
  className,
  id,
  showCharacterCount,
  maxLength,
  ...props
}: FieldInputProps) {
  const context = useFieldContext();
  const inputId = id || context?.id || field?.name;
  const currentValue = String(field?.state.value ?? props.value ?? "");

  return (
    <>
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      <input
        id={inputId}
        disabled={context?.disabled}
        readOnly={context?.readOnly}
        required={context?.required}
        aria-invalid={context?.invalid || undefined}
        aria-describedby={context?.descriptionId}
        maxLength={maxLength}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          context?.invalid &&
            "border-destructive focus-visible:ring-destructive",
          className
        )}
        onChange={(e) => field?.handleChange(e.target.value)}
        onBlur={field?.handleBlur}
        value={field?.state.value ?? ""}
        {...props}
      />
      {(description || (showCharacterCount && maxLength)) && (
        <div className="flex items-center justify-between gap-2">
          {description && <FieldDescription>{description}</FieldDescription>}
          {showCharacterCount && maxLength && (
            <FieldCharacterCount
              current={currentValue.length}
              max={maxLength}
              className="ml-auto"
            />
          )}
        </div>
      )}
      {error && <FieldError field={field}>{error}</FieldError>}
    </>
  );
}

// =============================================================================
// FieldRow - Horizontal layout helper for multiple fields
// =============================================================================

interface FieldRowProps extends React.ComponentProps<"div"> {
  /** Gap between fields */
  gap?: "sm" | "default" | "lg";
}

function FieldRow({
  className,
  gap = "default",
  children,
  ...props
}: FieldRowProps) {
  const gapClasses = {
    sm: "gap-2",
    default: "gap-4",
    lg: "gap-6",
  };

  return (
    <div
      data-slot="field-row"
      className={cn(
        "flex flex-col sm:flex-row sm:items-start w-full",
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}





// =============================================================================
// Exports
// =============================================================================

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldHelperText,
  FieldError,
  FieldErrorText,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
  FieldCharacterCount,
  FieldValidationIcon,
  FieldRow,
  FormField,
  FieldInput,
  createZodValidator,
  useFieldContext,
};

// =============================================================================
// Type Exports
// =============================================================================

export type {
  FieldProps,
  FieldLabelProps,
  FieldDescriptionProps,
  FieldErrorProps,
  FieldGroupProps,
  FieldLegendProps,
  FieldTitleProps,
  FieldCharacterCountProps,
  FieldValidationIconProps,
  FieldRowProps,
  FormFieldProps,
  FieldInputProps,
  FieldContextValue,
  ZodValidatorOptions,
  ZodValidatorReturn,
};

export type { AnyFieldApi as FieldApi };
export { z };
