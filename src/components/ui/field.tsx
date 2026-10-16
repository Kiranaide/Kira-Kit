"use client";

import * as React from "react";
import {
  useMemo,
  useRef,
  useId,
  createContext,
  useContext,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { AnyFieldApi } from "@tanstack/react-form";
import { z, type ZodType } from "zod";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type FieldApiLike = Pick<
  AnyFieldApi,
  "name" | "state" | "handleChange" | "handleBlur" | "setValue" | "getValue"
>;

interface FieldContextValue {
  id: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  descriptionId: string;
  errorId: string;
  touched?: boolean;
  validating?: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

function useFieldContext() {
  return useContext(FieldContext);
}

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

interface FieldLegendProps extends React.ComponentProps<"legend"> {
  variant?: "legend" | "label";
  showRequired?: boolean;
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

interface FieldGroupProps extends React.ComponentProps<"div"> {
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
        "gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4 group/field-group @container/field-group flex w-full flex-col",
        variant === "outline" && "rounded-lg border border-input p-4",
        className
      )}
      {...props}
    />
  );
}

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
  extends React.ComponentProps<"div">, VariantProps<typeof fieldVariants> {
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
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

interface FieldLabelProps extends React.ComponentProps<typeof Label> {
  showRequired?: boolean;
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
        "has-data-checked:bg-primary/5 has-data-checked:border-primary dark:has-data-checked:bg-primary/10 gap-2 group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 group/field-label peer/field-label flex w-fit leading-snug",
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

interface FieldTitleProps extends React.ComponentProps<"div"> {
  showRequired?: boolean;

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

interface FieldDescriptionProps extends React.ComponentProps<"p"> {
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
        "text-muted-foreground text-left text-sm [[data-variant=legend]+&]:-mt-1.5 leading-normal font-normal group-has-data-[orientation=horizontal]/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        context?.disabled && "opacity-50",
        className
      )}
      {...props}
    />
  );
}

const FieldHelperText = FieldDescription;

interface FieldCharacterCountProps extends React.ComponentProps<"span"> {
  current: number;
  max: number;
  warningThreshold?: number;
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

interface FieldValidationIconProps extends React.ComponentProps<"span"> {
  state: "valid" | "invalid" | "validating";
  size?: "sm" | "default" | "lg";
}

function FieldValidationIcon({
  state,
  size = "default",
  className,
  ...props
}: FieldValidationIconProps) {
  const iconRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (iconRef.current && state !== "validating") {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          iconRef.current,
          { scale: 0, opacity: 0 },
          {
            keyframes: { scale: [0, 1.1, 1], opacity: [0, 1, 1] },
            duration: 0.3,
            ease: "back.out(1.7)",
          }
        );
      });

      return () => mm.revert();
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

interface FieldErrorProps extends React.ComponentProps<"div"> {
  errors?: Array<{ message?: string } | undefined> | string[] | null;
  field?: FieldApiLike | AnyFieldApi;
  showErrors?: boolean;

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

  useGSAP(() => {
    if (errorRef.current && content) {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          errorRef.current,
          { opacity: 0, y: -4 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
        );
      });

      return () => mm.revert();
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

const FieldErrorText = FieldError;

interface FormFieldProps {
  name: string;
  form: any;
  children: (field: FieldApiLike) => React.ReactNode;
  className?: string;
  orientation?: "vertical" | "horizontal" | "responsive";
  disabled?: boolean;
  required?: boolean;
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

interface FieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field?: FieldApiLike;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;

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

interface FieldRowProps extends React.ComponentProps<"div"> {
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
