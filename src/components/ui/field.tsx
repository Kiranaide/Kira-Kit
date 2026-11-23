"use client";

import * as React from "react";
import {
  isNumberProp,
  isStringProp,
  omitComponentProps,
  resolveComponentDefaults,
  withOccurrenceKeys,
} from "@/lib/component-utils";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { IconAlertCircle, IconCheck, IconLoader2 } from "@tabler/icons-react";
import type { AnyFieldApi } from "@tanstack/react-form";
import { cva, type VariantProps } from "class-variance-authority";
import { z, type ZodType } from "zod";

import { cn } from "cn";
import { Input, type InputProps } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const fieldValidationIcons = {
  valid: IconCheck,
  invalid: IconAlertCircle,
  validating: IconLoader2,
};

// SAFETY: TanStack's public AnyFieldApi is the adapter boundary; only these
// operations are used. The field's own validators retain their value types.
type FieldApiLike = Pick<
  AnyFieldApi,
  "name" | "state" | "handleChange" | "handleBlur" | "setValue" | "getValue"
>;

interface FieldContextValue {
  id: string;
  descriptionId: string;
  errorId: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  touched?: boolean;
  dirty?: boolean;
  validating?: boolean;
}

const FieldContext = React.createContext<FieldContextValue | null>(null);

function useFieldContext() {
  return React.useContext(FieldContext);
}

const fieldVariants = cva("group/field flex min-w-0 w-full gap-2", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal:
        "flex-row items-start [&>[data-slot=field-label]]:shrink-0 [&>[data-slot=field-label]]:pt-2",
      responsive:
        "flex-col @md/field-group:flex-row @md/field-group:items-start @md/field-group:[&>[data-slot=field-label]]:w-1/3 @md/field-group:[&>[data-slot=field-label]]:shrink-0 @md/field-group:[&>[data-slot=field-label]]:pt-2",
    },
  },
  defaultVariants: { orientation: "vertical" },
});

const fieldControlVariants = cva(
  "flex min-w-0 w-full rounded-lg border border-input bg-background px-4 py-1 text-base text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted/50 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive sm:text-sm",
);

interface FieldProps
  extends
    Omit<FieldPrimitive.Root.Props, "className">,
    VariantProps<typeof fieldVariants> {
  className?: string;
  required?: boolean;
  readOnly?: boolean;
  validating?: boolean;
  disabledReason?: React.ReactNode;
}

function Field({
  className,
  orientation = "vertical",
  required,
  readOnly,
  validating,
  disabledReason,
  id,
  disabled,
  invalid,
  dirty,
  touched,
  children,
  ...props
}: FieldProps) {
  const generatedId = React.useId();
  const rootId = id ?? generatedId;

  const context: FieldContextValue = {
    id: `${rootId}-control`,
    descriptionId: `${rootId}-description`,
    errorId: `${rootId}-error`,
    disabled,
    required,
    readOnly,
    invalid,
    dirty,
    touched,
    validating,
  };

  return (
    <FieldContext.Provider value={context}>
      <FieldPrimitive.Root
        {...props}
        id={rootId}
        disabled={disabled}
        invalid={invalid}
        dirty={dirty}
        touched={touched}

        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This composite div groups controls or content without introducing fieldset form behavior, default styling, or a different public ref element.
        role="group"
        data-slot="field"
        data-orientation={orientation}
        data-required={required || undefined}
        data-readonly={readOnly || undefined}
        data-validating={validating || undefined}
        className={cn(fieldVariants({ orientation }), className)}
      >
        {children}
        {disabled && disabledReason && (
          <FieldDescription data-slot="field-disabled-reason">
            {disabledReason}
          </FieldDescription>
        )}
      </FieldPrimitive.Root>
    </FieldContext.Provider>
  );
}

type FieldSetProps = Omit<FieldsetPrimitive.Root.Props, "className"> & {
  className?: string;
};

function FieldSet({ className, ...props }: FieldSetProps) {
  return (
    <FieldsetPrimitive.Root
      data-slot="field-set"
      className={cn("flex min-w-0 flex-col gap-6", className)}
      {...props}
    />
  );
}

interface FieldLegendProps extends Omit<
  FieldsetPrimitive.Legend.Props,
  "className"
> {
  className?: string;
  variant?: "legend" | "label";
  showRequired?: boolean;
  requiredIndicator?: React.ReactNode;
}

function FieldLegend({
  className,
  variant = "legend",
  showRequired,
  requiredIndicator = "*",
  children,
  ...props
}: FieldLegendProps) {
  return (
    <FieldsetPrimitive.Legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-2 font-medium leading-snug data-[variant=label]:text-sm data-[variant=legend]:text-base",
        className,
      )}
      {...props}
    >
      {children}
      {showRequired && (
        <span
          data-slot="field-required"
          className="ms-1 text-destructive"
          aria-hidden="true"
        >
          {requiredIndicator}
        </span>
      )}
    </FieldsetPrimitive.Legend>
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
        "group/field-group @container/field-group flex min-w-0 w-full flex-col gap-6",
        variant === "outline" && "rounded-lg border border-input p-4",
        className,
      )}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-2", className)}
      {...props}
    />
  );
}

interface FieldLabelProps extends Omit<
  FieldPrimitive.Label.Props,
  "className"
> {
  className?: string;
  showRequired?: boolean;
  requiredIndicator?: React.ReactNode;
}

function FieldLabel({
  className,
  showRequired,
  requiredIndicator = "*",
  children,
  ...props
}: FieldLabelProps) {
  const context = useFieldContext();

  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        "flex min-w-0 w-fit items-start gap-1 text-sm font-medium leading-snug wrap-anywhere data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      {(showRequired ?? context?.required) && (
        <span
          data-slot="field-required"
          className="shrink-0 text-destructive"
          aria-hidden="true"
        >
          {requiredIndicator}
        </span>
      )}
    </FieldPrimitive.Label>
  );
}

interface FieldTitleProps extends React.ComponentProps<"div"> {
  showRequired?: boolean;
  requiredIndicator?: React.ReactNode;
}

function FieldTitle({
  className,
  showRequired,
  requiredIndicator = "*",
  children,
  ...props
}: FieldTitleProps) {
  const context = useFieldContext();

  return (
    <div
      data-slot="field-title"
      className={cn(
        "flex min-w-0 items-start gap-1 text-sm font-medium leading-snug wrap-anywhere",
        className,
      )}
      {...props}
    >
      {children}
      {(showRequired ?? context?.required) && (
        <span
          data-slot="field-required"
          className="text-destructive"
          aria-hidden="true"
        >
          {requiredIndicator}
        </span>
      )}
    </div>
  );
}

type FieldItemProps = Omit<FieldPrimitive.Item.Props, "className"> & {
  className?: string;
};

function FieldItem({ className, ...props }: FieldItemProps) {
  return (
    <FieldPrimitive.Item
      data-slot="field-item"
      className={cn("flex min-w-0 items-start gap-3", className)}
      {...props}
    />
  );
}

type FieldDescriptionProps = Omit<
  FieldPrimitive.Description.Props,
  "className"
> & { className?: string };

function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn(
        "text-sm leading-relaxed text-muted-foreground wrap-anywhere [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

const FieldHelperText = FieldDescription;

type FieldControlProps = Omit<FieldPrimitive.Control.Props, "className"> & {
  className?: string;
};

function FieldControl({
  className,
  disabled,
  required,
  readOnly,
  ...props
}: FieldControlProps) {
  const context = useFieldContext();

  return (
    <FieldPrimitive.Control
      data-slot="field-control"
      className={cn(fieldControlVariants(), "min-h-9", className)}
      disabled={disabled || context?.disabled}
      required={required ?? context?.required}
      readOnly={readOnly ?? context?.readOnly}
      {...props}
    />
  );
}

interface FieldCharacterCountProps extends React.ComponentProps<"span"> {
  current: number;
  max: number;
  warningThreshold?: number;
  showOnlyNearLimit?: boolean;
  announce?: boolean;
}

function FieldCharacterCount(inputProps: FieldCharacterCountProps) {
  const {
    current,
    max,
    warningThreshold,
    showOnlyNearLimit,
    announce,
    className,
    ...props
  } = resolveComponentDefaults(inputProps, {
    warningThreshold: 80,
    showOnlyNearLimit: false,
    announce: true,
  });

  const resolvePercentage1 = () => {
    if (limit > 0) {
      return (count / limit) * 100;
    }

    if (count > 0) {
      return 100 as const;
    }

    return 0 as const;
  };

  const resolveAnnouncement2 = () => {
    if (isError) {
      return `Character limit exceeded. Shorten your text to ${limit} characters.`;
    }

    if (count === limit) {
      return `The ${limit} character limit has been reached.`;
    }

    if (isWarning) {
      return `Approaching the ${limit} character limit.`;
    }

    return "" as const;
  };

  const resolveValue3 = () => {
    if (isError) {
      return "Over limit · " as const;
    }

    if (isWarning) {
      return "Near limit · " as const;
    }

    return "" as const;
  };

  const count = Number.isFinite(current) ? Math.max(0, Math.floor(current)) : 0;
  const limit = Number.isFinite(max) ? Math.max(0, Math.floor(max)) : 0;

  const threshold = Number.isFinite(warningThreshold)
    ? Math.max(0, Math.min(100, warningThreshold))
    : 80;

  const percentage = resolvePercentage1();
  const isError = count > limit;
  const isWarning = percentage >= threshold && !isError;
  const nearLimit = percentage >= threshold || count === limit;

  const announcement = resolveAnnouncement2();

  return renderFieldCharacterCountPart1({
    isWarning,
    isError,
    className,
    props,
    showOnlyNearLimit,
    nearLimit,
    count,
    limit,
    resolveValue3,
    announce,
    announcement,
  });
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative my-2 flex min-h-5 items-center text-sm",
        className,
      )}
      {...props}
    >
      <Separator className="absolute inset-x-0 top-1/2" />
      {children && (
        <span
          data-slot="field-separator-content"
          className="relative mx-auto bg-background px-2 text-muted-foreground"
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

// kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception
const validationIconSizes = { sm: "size-3.5", default: "size-4", lg: "size-5" };

function FieldValidationIcon({
  state,
  size = "default",
  className,
  "aria-label": ariaLabel,
  ...props
}: FieldValidationIconProps) {
  const Icon = fieldValidationIcons[state];

  return (
    <span
      data-slot="field-validation-icon"
      data-state={state}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        validationIconSizes[size],
        state === "valid" && "text-foreground",
        state === "invalid" && "text-destructive",
        state === "validating" && "text-muted-foreground",
        className,
      )}
      {...props}
    >
      <Icon
        data-slot="field-validation-symbol"
        className="size-full"
        aria-hidden="true"
      />
    </span>
  );
}

interface FieldErrorProps extends Omit<
  FieldPrimitive.Error.Props,
  "className"
> {
  className?: string;
  errors?: Array<string | { message?: string } | undefined> | null;
  field?: FieldApiLike;
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
  match,
  ...props
}: FieldErrorProps) {
  if (!showErrors) return null;

  const presentation = resolveFieldErrorPresentation({
    children,
    errors,
    field,
  });

  if (presentation.hasExternalContent && !presentation.content) return null;

  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      match={match ?? (presentation.hasExternalContent ? true : undefined)}
      aria-live="polite"
      className={cn(
        "flex items-start gap-2 text-sm leading-relaxed text-destructive wrap-anywhere",
        className,
      )}
      {...props}
    >
      {renderFieldErrorAdornment({
        showIcon,
        hasExternalContent: presentation.hasExternalContent,
        content: presentation.content,
      })}
    </FieldPrimitive.Error>
  );
}

function resolveFieldErrorPresentation({
  children,
  errors,
  field,
}: Pick<FieldErrorProps, "children" | "errors" | "field">) {
  const suppliedErrors = field ? field.state.meta.errors : errors;
  const messages = fieldErrorMessages({ suppliedErrors });

  const hasExternalContent =
    (children !== undefined && children !== null) ||
    (suppliedErrors !== undefined && suppliedErrors !== null);

  return {
    hasExternalContent,
    content: renderFieldErrorMessages({ children, messages }),
  };
}

function renderFieldErrorMessages({
  children,
  messages,
}: {
  children: React.ReactNode;
  messages: string[];
}) {
  if (children !== undefined && children !== null) return children;

  if (messages.length <= 1) return messages[0];

  return (
    <ul data-slot="field-error-list" className="ms-4 list-disc space-y-1">
      {messages.map((message) => (
        <li data-slot="field-error-item" key={message}>
          {message}
        </li>
      ))}
    </ul>
  );
}

function renderFieldErrorAdornment({
  showIcon,
  hasExternalContent,
  content,
}: {
  showIcon: boolean;
  hasExternalContent: boolean;
  content: React.ReactNode;
}) {
  if (hasExternalContent) {
    return (
      <>
        {showIcon && (
          <FieldValidationIcon state="invalid" size="sm" className="mt-1" />
        )}
        <div data-slot="field-error-content" className="min-w-0">
          {content}
        </div>
      </>
    );
  }

  if (!showIcon) return undefined;

  return (
    <>
      <FieldValidationIcon state="invalid" size="sm" className="mt-1" />
      <FieldPrimitive.Validity>
        {({ error: message }) => (
          <span data-slot="field-error-content">{message}</span>
        )}
      </FieldPrimitive.Validity>
    </>
  );
}

const FieldErrorText = FieldError;
const FieldValidity = FieldPrimitive.Validity;

type FieldStatusProps = FieldDescriptionProps & {
  state: FieldValidationIconProps["state"];
};

function FieldStatus({
  state,
  className,
  children,
  ...props
}: FieldStatusProps) {
  const resolveValue6 = () => {
    if (state === "valid") {
      return "Looks good." as const;
    }

    if (state === "validating") {
      return "Checking this value…" as const;
    }

    return "Check this value." as const;
  };

  return (
    <FieldDescription
      data-slot="field-status"

      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This existing live region preserves its block layout and div ref contract; output introduces form-associated semantics.
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "flex items-start gap-2",
        state === "valid" && "text-foreground",
        state === "invalid" && "text-destructive",
        className,
      )}
      {...props}
    >
      <FieldValidationIcon state={state} size="sm" className="mt-1" />
      <span data-slot="field-status-content">
        {children ?? resolveValue6()}
      </span>
    </FieldDescription>
  );
}

type ZodValidatorOptions = {
  onChange?: boolean | number;
  onBlur?: boolean;
  onSubmit?: boolean;
};

type ZodValidatorReturn<T> = {
  onChange?: (args: { value: T }) => string | undefined;
  onBlur?: (args: { value: T }) => string | undefined;
  onSubmit?: (args: { value: T }) => string | undefined;
  onChangeAsyncDebounceMs?: number;
  onChangeAsync?: (args: {
    value: T;
    signal: AbortSignal;
  }) => Promise<string | undefined>;
};

function createZodValidator<T>(
  schema: ZodType<T>,
  options: ZodValidatorOptions = {},
): ZodValidatorReturn<T> {
  const validate = ({ value }: { value: T }) => {
    const parsed = schema.safeParse(value);

    return parsed.success ? undefined : parsed.error.issues[0]?.message;
  };

  const validators: ZodValidatorReturn<T> = {};

  if (options.onBlur !== false) validators.onBlur = validate;

  if (options.onSubmit !== false) validators.onSubmit = validate;

  if (options.onChange === true) validators.onChange = validate;

  if (isNumberProp(options.onChange)) {
    validators.onChangeAsyncDebounceMs = Math.max(0, options.onChange);
    validators.onChangeAsync = async ({ value, signal }) => {
      if (signal.aborted) return undefined;
      const parsed = await schema.safeParseAsync(value);

      if (signal.aborted) return undefined;

      return parsed.success ? undefined : parsed.error.issues[0]?.message;
    };
  }

  return validators;
}

interface FormFieldProps<TField extends React.ElementType = React.ElementType> {
  name: React.ComponentProps<TField> extends { name: infer TName }
    ? TName
    : never;
  form: { Field: TField };
  children: (field: FieldApiLike) => React.ReactNode;
  className?: string;
  orientation?: FieldProps["orientation"];
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
}

function FormField<TField extends React.ElementType>({
  name,
  form,
  children,
  ...props
}: FormFieldProps<TField>) {
  return React.createElement(form.Field, {
    name,
    // oxlint-disable-next-line react/no-children-prop -- TanStack Form requires a callable render prop, which is not a ReactNode child argument.
    children: (field: FieldApiLike) => (
      <Field
        {...props}
        name={field.name}
        invalid={!field.state.meta.isValid && field.state.meta.isTouched}
        touched={field.state.meta.isTouched}
        dirty={field.state.meta.isDirty}
        validating={field.state.meta.isValidating}
      >
        {children(field)}
      </Field>
    ),
  });
}

interface FieldInputProps extends Omit<InputProps, "showCount"> {
  className?: string;
  field?: FieldApiLike;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  showCharacterCount?: boolean;
}

function useUncontrolledFieldValue(
  id: string,
  fallback: string,
  enabled: boolean,
) {
  const getControl = React.useCallback(() => {
    const control = document.getElementById(id);

    return control instanceof HTMLInputElement ||
      control instanceof HTMLTextAreaElement
      ? control
      : null;
  }, [id]);

  const subscribe = React.useCallback(
    (notify: () => void) => {
      if (!enabled) return () => {};

      let resetTimer: ReturnType<typeof setTimeout> | undefined;

      const onInput = (event: Event) => {
        if (event.target === getControl()) notify();
      };

      const onReset = (event: Event) => {
        if (getControl()?.form !== event.target) return;
        // Observe the final DOM value, even after successive canceled resets.
        clearTimeout(resetTimer);
        resetTimer = setTimeout(notify, 0);
      };

      const observer = new MutationObserver(notify);
      const control = getControl();

      if (control) {
        // defaultValue writes affect native input attributes or textarea text.
        observer.observe(control, {
          attributes: true,
          attributeFilter: ["value"],
          childList: true,
          characterData: true,
          subtree: true,
        });
      }

      document.addEventListener("input", onInput, true);
      document.addEventListener("change", onInput, true);
      document.addEventListener("reset", onReset, true);

      return () => {
        clearTimeout(resetTimer);
        observer.disconnect();
        document.removeEventListener("input", onInput, true);
        document.removeEventListener("change", onInput, true);
        document.removeEventListener("reset", onReset, true);
      };
    },
    [enabled, getControl],
  );

  const getSnapshot = React.useCallback(
    () => (enabled ? (getControl()?.value ?? fallback) : fallback),
    [enabled, fallback, getControl],
  );

  return React.useSyncExternalStore(subscribe, getSnapshot, () => fallback);
}

function FieldInput(input0: FieldInputProps) {
  const state0 = useFieldInputSetup(input0);

  return renderFieldInput(state0);
}

interface FieldRowProps extends React.ComponentProps<"div"> {
  gap?: "sm" | "default" | "lg";
}

const fieldRowGaps = { sm: "gap-2", default: "gap-4", lg: "gap-6" };

function FieldRow({ className, gap = "default", ...props }: FieldRowProps) {
  return (
    <div
      data-slot="field-row"
      className={cn(
        "flex min-w-0 w-full flex-col sm:flex-row sm:items-start",
        fieldRowGaps[gap],
        className,
      )}
      {...props}
    />
  );
}

interface KiraFieldControlProps {
  /** Apply to the registering primitive: an input/trigger, or NumberField/Combobox Root. */
  id: string;
  name?: string;
  disabled: boolean;
  required: boolean;
  readOnly: boolean;
}

interface KiraFieldBaseProps extends FieldProps {
  label: React.ReactNode;
  labelProps?: Omit<FieldLabelProps, "children">;
  description?: React.ReactNode;
  error?: React.ReactNode;
  successMessage?: React.ReactNode;
  field?: FieldApiLike;
  controlId?: string;
}

interface KiraFieldInputProps extends KiraFieldBaseProps {
  control?: undefined;
  value?: FieldInputProps["value"];
  defaultValue?: FieldInputProps["defaultValue"];
  onValueChange?: FieldInputProps["onValueChange"];
  inputProps?: Omit<
    FieldInputProps,
    | "field"
    | "label"
    | "description"
    | "error"
    | "value"
    | "defaultValue"
    | "onValueChange"
  >;
  maxLength?: number;
  showCharacterCount?: boolean;
  multiline?: boolean;
  rows?: number;
}

interface KiraFieldCustomProps extends KiraFieldBaseProps {
  /** Base UI controls register directly; wrap native controls in FieldControl. */
  control: (props: KiraFieldControlProps) => React.ReactNode;
  value?: never;
  defaultValue?: never;
  onValueChange?: never;
  inputProps?: never;
  maxLength?: never;
  showCharacterCount?: never;
  multiline?: never;
  rows?: never;
}

type KiraFieldProps = KiraFieldInputProps | KiraFieldCustomProps;

function KiraField(input0: KiraFieldProps) {
  const state0 = useFieldSetup(input0);
  const state1 = useFieldState2(state0);
  const state2 = useFieldActions(state1);

  return renderField(state2);
}

interface FieldSummaryError {
  /** ID of the actual focusable input, not the surrounding Field. */
  id: string;
  message: React.ReactNode;
  label?: React.ReactNode;
}

interface FieldErrorSummaryProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "title"
> {
  errors: readonly FieldSummaryError[];
  title?: React.ReactNode;
  focusOnError?: boolean;
  /** Change this after each failed submit to refocus an existing summary. */
  focusKey?: string | number;
}

function FieldErrorSummary({
  errors,
  title = "Check these fields",
  focusOnError = false,
  focusKey,
  className,
  ...props
}: FieldErrorSummaryProps) {
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const hasErrors = errors.length > 0;
  React.useEffect(() => {
    if (focusOnError && hasErrors) summaryRef.current?.focus();
  }, [focusOnError, hasErrors, focusKey]);

  if (!hasErrors) return null;

  return (
    <div
      {...props}
      ref={summaryRef}
      data-slot="field-error-summary"
      tabIndex={-1}
      aria-labelledby={titleId}
      className={cn(
        "rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <h3
        data-slot="field-error-summary-title"
        id={titleId}
        className="flex items-start gap-2 font-medium text-destructive"
      >
        <IconAlertCircle
          data-slot="field-error-summary-icon"
          className="mt-0.5 size-4 shrink-0"
          aria-hidden="true"
        />
        {title}
      </h3>
      <ul
        data-slot="field-error-summary-list"
        className="mt-3 flex flex-col gap-2"
      >
        {withOccurrenceKeys(errors, (error) => error.id).map(
          ({ item: { id: control, message, label }, key }) => (
            <li data-slot="field-error-summary-item" key={key}>
              <a
                data-slot="field-error-summary-link"
                href={`#${control}`}
                className="inline-block min-h-6 max-w-full text-destructive underline underline-offset-4 outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring wrap-anywhere"
                onClick={(event) => {
                  const target = document.getElementById(control);

                  if (target) {
                    event.preventDefault();
                    target.focus();
                  }
                }}
              >
                {label != null && <>{label}: </>}
                {message}
              </a>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

export {
  KiraField,
  FieldErrorSummary,
  Field,
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldContent,
  FieldItem,
  FieldLabel,
  FieldTitle,
  FieldDescription,
  FieldHelperText,
  FieldControl,
  FieldInput,
  FieldError,
  FieldErrorText,
  FieldValidity,
  FieldStatus,
  FieldCharacterCount,
  FieldValidationIcon,
  FieldSeparator,
  FieldRow,
  FormField,
  createZodValidator,
  useFieldContext,
  fieldVariants,
  fieldControlVariants,
  z,
};

export type {
  KiraFieldProps,
  KiraFieldInputProps,
  KiraFieldCustomProps,
  KiraFieldControlProps,
  FieldItemProps,
  FieldErrorSummaryProps,
  FieldSummaryError,
  FieldProps,
  FieldSetProps,
  FieldLegendProps,
  FieldGroupProps,
  FieldLabelProps,
  FieldTitleProps,
  FieldDescriptionProps,
  FieldControlProps,
  FieldInputProps,
  FieldErrorProps,
  FieldStatusProps,
  FieldCharacterCountProps,
  FieldValidationIconProps,
  FieldRowProps,
  FormFieldProps,
  FieldContextValue,
  ZodValidatorOptions,
  ZodValidatorReturn,
};

export type { AnyFieldApi as FieldApi };

type renderFieldCharacterCountPart1Args = {
  isWarning: boolean;
  isError: boolean;
  className: FieldCharacterCountProps["className"];
  props: Omit<
    FieldCharacterCountProps,
    | "current"
    | "max"
    | "warningThreshold"
    | "showOnlyNearLimit"
    | "announce"
    | "className"
  >;
  showOnlyNearLimit: Exclude<
    FieldCharacterCountProps["showOnlyNearLimit"],
    undefined
  >;
  nearLimit: boolean;
  count: number;
  limit: number;
  resolveValue3: () => "" | "Over limit · " | "Near limit · ";
  announce: Exclude<FieldCharacterCountProps["announce"], undefined>;
  announcement: string;
};

function renderFieldCharacterCountPart1({
  isWarning,
  isError,
  className,
  props,
  showOnlyNearLimit,
  nearLimit,
  count,
  limit,
  resolveValue3,
  announce,
  announcement,
}: renderFieldCharacterCountPart1Args) {
  return (
    <span
      data-slot="field-character-count"
      data-warning={isWarning || undefined}
      data-error={isError || undefined}
      className={cn(
        "shrink-0 text-xs text-muted-foreground tabular-nums",
        isWarning && "font-medium text-foreground",
        isError && "font-medium text-destructive",
        className,
      )}
      {...props}
    >
      <span
        data-slot="field-character-count-value"
        className={cn(showOnlyNearLimit && !nearLimit && "sr-only")}
        aria-label={`${count} of ${limit} characters`}
      >
        {resolveValue3()}
        {count}/{limit}
      </span>
      {announce && (
        <output
          data-slot="field-character-count-status"
          className="sr-only"

          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </output>
      )}
    </span>
  );
}

type renderFieldInputSectionPart2Args = {
  label: FieldInputProps["label"];
  inputId: string;
  render: FieldInputProps["render"];
  controlProps: Omit<InputPrimitive.Props, "className"> & {
    className?: string;
    "data-slot": string;
  };
  className: FieldInputProps["className"];
  size: FieldInputProps["size"];
  prefix: FieldInputProps["prefix"];
  suffix: FieldInputProps["suffix"];
  showClear: FieldInputProps["showClear"];
  onClear: FieldInputProps["onClear"];
  showCopy: FieldInputProps["showCopy"];
  onCopySuccess: FieldInputProps["onCopySuccess"];
  onCopyError: FieldInputProps["onCopyError"];
  description: FieldInputProps["description"];
  counted: boolean | undefined;
  counterId: string;
  currentValue: string;
  maxLength: FieldInputProps["maxLength"];
  error: FieldInputProps["error"];
};

// oxlint-disable-next-line eslint/complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function renderFieldInputSectionPart2({
  label,
  inputId,
  render,
  controlProps,
  className,
  size,
  prefix,
  suffix,
  showClear,
  onClear,
  showCopy,
  onCopySuccess,
  onCopyError,
  description,
  counted,
  counterId,
  currentValue,
  maxLength,
  error,
}: renderFieldInputSectionPart2Args) {
  return (
    <>
      {label != null && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      {render ? (
        <InputPrimitive
          {...controlProps}
          render={render}
          className={cn(
            !(
              React.isValidElement(render) &&
              (render.type === Input || render.type === Textarea)
            ) && [fieldControlVariants(), "min-h-9"],
            className,
          )}
        />
      ) : (
        <Input
          {...controlProps}
          size={size}
          prefix={prefix}
          suffix={suffix}
          showClear={showClear}
          onClear={onClear}
          showCopy={showCopy}
          onCopySuccess={onCopySuccess}
          onCopyError={onCopyError}
        />
      )}
      {(description != null || counted) && (
        <div
          data-slot="field-metadata"
          className="flex min-w-0 items-start justify-between gap-3"
        >
          {description != null && (
            <FieldDescription>{description}</FieldDescription>
          )}
          {counted && maxLength !== undefined && (
            <FieldCharacterCount
              id={counterId}
              current={currentValue.length}
              max={maxLength}
              className="ms-auto"
            />
          )}
        </div>
      )}
      {error != null && <FieldError showIcon>{error}</FieldError>}
    </>
  );
}

type renderBuildFeedbackSectionPart3Args = {
  field: KiraFieldProps["field"];
  hasExternalError: boolean;
  error: KiraFieldProps["error"];
  successMessage: KiraFieldProps["successMessage"];
  externalInvalid: boolean | undefined;
  disabled: KiraFieldProps["disabled"];
};

function renderBuildFeedbackSectionPart3({
  field,
  hasExternalError,
  error,
  successMessage,
  externalInvalid,
  disabled,
}: renderBuildFeedbackSectionPart3Args) {
  return (
    <>
      {field || hasExternalError ? (
        <FieldError field={hasExternalError ? undefined : field} showIcon>
          {hasExternalError ? error : undefined}
        </FieldError>
      ) : (
        <FieldError showIcon />
      )}
      {successMessage != null && !externalInvalid && !disabled && (
        <FieldValidity>
          {({ validity, value: checkedValue }) =>
            validity.valid === true &&
            checkedValue !== "" &&
            checkedValue != null ? (
              <FieldStatus state="valid">{successMessage}</FieldStatus>
            ) : null
          }
        </FieldValidity>
      )}
    </>
  );
}

type renderKiraFieldSectionPart4Args = {
  props: Omit<
    KiraFieldProps,
    | "label"
    | "labelProps"
    | "control"
    | "description"
    | "error"
    | "successMessage"
    | "field"
    | "controlId"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "inputProps"
    | "maxLength"
    | "showCharacterCount"
    | "multiline"
    | "rows"
    | "validationMode"
    | "id"
    | "name"
    | "invalid"
    | "dirty"
    | "touched"
    | "validating"
    | "disabled"
    | "required"
    | "readOnly"
    | "children"
  >;
  rootId: string;
  name: KiraFieldProps["name"];
  field: KiraFieldProps["field"];
  validationMode: FieldProps["validationMode"];
  externalInvalid: boolean | undefined;
  dirty: KiraFieldProps["dirty"];
  touched: KiraFieldProps["touched"];
  isValidating: boolean | undefined;
  disabled: KiraFieldProps["disabled"];
  required: KiraFieldProps["required"];
  readOnly: KiraFieldProps["readOnly"];
  buildLabel: () => React.JSX.Element;
  buildControl: () => React.JSX.Element;
  buildFeedback: () => React.JSX.Element;
  children: KiraFieldProps["children"];
};

function renderKiraFieldSectionPart4({
  props,
  rootId,
  name,
  field,
  validationMode,
  externalInvalid,
  dirty,
  touched,
  isValidating,
  disabled,
  required,
  readOnly,
  buildLabel,
  buildControl,
  buildFeedback,
  children,
}: renderKiraFieldSectionPart4Args) {
  return (
    <Field
      {...props}
      id={rootId}
      name={name ?? field?.name}
      validationMode={validationMode}
      invalid={externalInvalid}
      dirty={dirty ?? field?.state.meta.isDirty}
      touched={touched ?? field?.state.meta.isTouched}
      validating={isValidating}
      disabled={disabled}
      required={required}
      readOnly={readOnly}
      data-kira-field=""
    >
      <>
        {buildLabel()}
        <FieldContent>
          {buildControl()}
          {buildFeedback()}
          {children}
        </FieldContent>
      </>
    </Field>
  );
}

function useFieldInputValue({
  inputId,
  field,
  defaultValue,
  showCharacterCount,
  maxLength,
  value,
}: Pick<
  FieldInputProps,
  "field" | "defaultValue" | "showCharacterCount" | "maxLength" | "value"
> & { inputId: string }) {
  const counted = showCharacterCount && maxLength !== undefined;

  const uncontrolledValue = useUncontrolledFieldValue(
    inputId,
    String(defaultValue ?? ""),
    Boolean(counted && !field && value === undefined),
  );

  const currentValue = String(
    field ? (field.state.value ?? "") : (value ?? uncontrolledValue),
  );

  return { counted, currentValue };
}

function useFieldInputSetup({
  field,
  label,
  description,
  error,
  showCharacterCount,
  maxLength,
  className,
  id,
  disabled,
  required,
  readOnly,
  value,
  defaultValue,
  onValueChange,
  onBlur,
  render,
  size,
  prefix,
  suffix,
  showClear,
  onClear,
  showCopy,
  onCopySuccess,
  onCopyError,
  "aria-describedby": describedBy,
  ...props
}: FieldInputProps) {
  const context = useFieldContext();
  const generatedId = React.useId();
  const inputId = id ?? context?.id ?? generatedId;
  const counterId = `${inputId}-count`;

  const { counted, currentValue } = useFieldInputValue({
    inputId,
    field,
    defaultValue,
    showCharacterCount,
    maxLength,
    value,
  });

  const controlProps = fieldInputControlProps({
    props,
    inputId,
    field,
    value,
    defaultValue,
    disabled,
    context,
    required,
    readOnly,
    maxLength,
    describedBy,
    counted,
    counterId,
    className,
    onValueChange,
    onBlur,
  });

  return {
    label,
    description,
    error,
    maxLength,
    className,
    render,
    size,
    prefix,
    suffix,
    showClear,
    onClear,
    showCopy,
    onCopySuccess,
    onCopyError,
    inputId,
    counted,
    counterId,
    currentValue,
    controlProps,
  };
}

function renderFieldInput({
  label,
  description,
  error,
  maxLength,
  className,
  render,
  size,
  prefix,
  suffix,
  showClear,
  onClear,
  showCopy,
  onCopySuccess,
  onCopyError,
  inputId,
  counted,
  counterId,
  currentValue,
  controlProps,
}: ReturnType<typeof useFieldInputSetup>) {
  return renderFieldInputSectionPart2({
    label,
    inputId,
    render,
    controlProps,
    className,
    size,
    prefix,
    suffix,
    showClear,
    onClear,
    showCopy,
    onCopySuccess,
    onCopyError,
    description,
    counted,
    counterId,
    currentValue,
    maxLength,
    error,
  });
}

type fieldInputControlPropsArgs = {
  props: Omit<
    FieldInputProps,
    | "field"
    | "label"
    | "description"
    | "error"
    | "showCharacterCount"
    | "maxLength"
    | "className"
    | "id"
    | "disabled"
    | "required"
    | "readOnly"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "onBlur"
    | "render"
    | "size"
    | "prefix"
    | "suffix"
    | "showClear"
    | "onClear"
    | "showCopy"
    | "onCopySuccess"
    | "onCopyError"
    | "aria-describedby"
  >;
  inputId: string;
  field: FieldInputProps["field"];
  value: FieldInputProps["value"];
  defaultValue: FieldInputProps["defaultValue"];
  disabled: FieldInputProps["disabled"];
  context: FieldContextValue | null;
  required: FieldInputProps["required"];
  readOnly: FieldInputProps["readOnly"];
  maxLength: FieldInputProps["maxLength"];
  describedBy: FieldInputProps["aria-describedby"];
  counted: boolean | undefined;
  counterId: string;
  className: FieldInputProps["className"];
  onValueChange: FieldInputProps["onValueChange"];
  onBlur: FieldInputProps["onBlur"];
};

function fieldInputControlStateProps({
  field,
  value,
  defaultValue,
  disabled,
  context,
  required,
  readOnly,
  maxLength,
  describedBy,
  counted,
  counterId,
}: Pick<
  fieldInputControlPropsArgs,
  | "field"
  | "value"
  | "defaultValue"
  | "disabled"
  | "context"
  | "required"
  | "readOnly"
  | "maxLength"
  | "describedBy"
  | "counted"
  | "counterId"
>) {
  return {
    ...fieldInputValueProps({ field, value, defaultValue }),
    ...fieldInputRequirementProps({
      disabled,
      context,
      required,
      readOnly,
      maxLength,
    }),
    ...fieldInputDescribedByProps({ describedBy, counted, counterId }),
  };
}

function fieldInputValueProps({
  field,
  value,
  defaultValue,
}: Pick<fieldInputControlPropsArgs, "field" | "value" | "defaultValue">) {
  return {
    value: field ? (field.state.value ?? "") : value,
    defaultValue: field ? undefined : defaultValue,
  };
}

function fieldInputRequirementProps({
  disabled,
  context,
  required,
  readOnly,
  maxLength,
}: Pick<
  fieldInputControlPropsArgs,
  "disabled" | "context" | "required" | "readOnly" | "maxLength"
>) {
  return {
    disabled: disabled || context?.disabled,
    required: required ?? context?.required,
    readOnly: readOnly ?? context?.readOnly,
    maxLength,
  };
}

function fieldInputDescribedByProps({
  describedBy,
  counted,
  counterId,
}: Pick<fieldInputControlPropsArgs, "describedBy" | "counted" | "counterId">) {
  return {
    "aria-describedby":
      [describedBy, counted ? counterId : undefined]
        .filter(Boolean)
        .join(" ") || undefined,
  };
}

function fieldInputControlProps({
  props,
  inputId,
  field,
  value,
  defaultValue,
  disabled,
  context,
  required,
  readOnly,
  maxLength,
  describedBy,
  counted,
  counterId,
  className,
  onValueChange,
  onBlur,
}: fieldInputControlPropsArgs): Omit<InputPrimitive.Props, "className"> & {
  className?: string;
  "data-slot": string;
} {
  return {
    ...props,
    id: inputId,
    "data-slot": "field-input",
    ...fieldInputControlStateProps({
      field,
      value,
      defaultValue,
      disabled,
      context,
      required,
      readOnly,
      maxLength,
      describedBy,
      counted,
      counterId,
    }),
    className,
    onValueChange: (
      next: string,
      details: InputPrimitive.ChangeEventDetails,
    ) => {
      onValueChange?.(next, details);

      if (details.isCanceled) return;
      field?.handleChange(next);
    },
    onBlur: (event) => {
      onBlur?.(event);

      if (!event.defaultPrevented) field?.handleBlur();
    },
  };
}

function useFieldSetup(input: KiraFieldProps) {
  const resolvedProps = resolveComponentDefaults(input, {
    showCharacterCount: input.maxLength !== undefined,
    multiline: false,
    rows: 3,
    validationMode: "onBlur",
  });

  const { error, field, controlId, inputProps, id } = resolvedProps;
  // SAFETY: The excluded keys are exactly those removed by the original native-prop rest binding.

  const props = omitComponentProps(resolvedProps, [
    "label",
    "labelProps",
    "control",
    "description",
    "error",
    "successMessage",
    "field",
    "controlId",
    "value",
    "defaultValue",
    "onValueChange",
    "inputProps",
    "maxLength",
    "showCharacterCount",
    "multiline",
    "rows",
    "validationMode",
    "id",
    "name",
    "invalid",
    "dirty",
    "touched",
    "validating",
    "disabled",
    "required",
    "readOnly",
    "children",
  ] as const);

  const resolveExternalInvalid7 = () => {
    if (hasExternalError) {
      return true;
    }

    if (field) {
      return !field.state.meta.isValid && field.state.meta.isTouched;
    }

    return undefined;
  };

  const generatedId = React.useId();

  const rootId = id ?? generatedId;

  const inputId = controlId ?? inputProps?.id ?? `${rootId}-control`;

  const hasExternalError = React.Children.toArray(error).some(
    (content) => content !== "",
  );

  return {
    ...resolvedProps,
    props,
    resolveExternalInvalid7,
    rootId,
    inputId,
    hasExternalError,
  };
}

function useFieldState2(state: ReturnType<typeof useFieldSetup>) {
  const {
    label,
    labelProps,
    control,
    description,
    field,
    value,
    defaultValue,
    onValueChange,
    inputProps,
    maxLength,
    showCharacterCount,
    multiline,
    rows,
    name,
    invalid,
    validating,
    disabled,
    required,
    readOnly,
    resolveExternalInvalid7,
    inputId,
  } = state;

  const externalInvalid = invalid ?? resolveExternalInvalid7();

  const isValidating = validating ?? field?.state.meta.isValidating;

  const buildLabel = () => (
    <FieldLabel {...(control ? {} : { htmlFor: inputId })} {...labelProps}>
      {label}
    </FieldLabel>
  );

  // oxlint-disable-next-line eslint/complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
  const buildControl = () =>
    control ? (
      <>
        {control({
          id: inputId,
          name: name ?? field?.name,
          disabled: Boolean(disabled),
          required: Boolean(required),
          readOnly: Boolean(readOnly),
        })}
        {description != null && (
          <FieldDescription>{description}</FieldDescription>
        )}
      </>
    ) : (
      <FieldInput
        {...inputProps}
        id={inputId}
        field={field}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        description={description}
        maxLength={maxLength ?? inputProps?.maxLength}
        showCharacterCount={showCharacterCount}
        render={
          inputProps?.render ??
          (multiline ? (
            <Textarea
              rows={rows}
              minRows={rows}
              size={inputProps?.size === "xs" ? "sm" : inputProps?.size}
              resize="vertical"
            />
          ) : undefined)
        }
        className={cn(multiline && "resize-y", inputProps?.className)}
      />
    );

  return { ...state, externalInvalid, isValidating, buildLabel, buildControl };
}

function useFieldActions(state: ReturnType<typeof useFieldState2>) {
  const {
    error,
    successMessage,
    field,
    disabled,
    hasExternalError,
    externalInvalid,
    isValidating,
  } = state;

  const buildFeedback = () =>
    isValidating ? (
      <FieldStatus state="validating" />
    ) : (
      renderBuildFeedbackSectionPart3({
        field,
        hasExternalError,
        error,
        successMessage,
        externalInvalid,
        disabled,
      })
    );

  return { ...state, buildFeedback };
}

function renderField({
  field,
  validationMode,
  name,
  dirty,
  touched,
  disabled,
  required,
  readOnly,
  children,
  props,
  rootId,
  externalInvalid,
  isValidating,
  buildLabel,
  buildControl,
  buildFeedback,
}: ReturnType<typeof useFieldActions>) {
  return renderKiraFieldSectionPart4({
    props,
    rootId,
    name,
    field,
    validationMode,
    externalInvalid,
    dirty,
    touched,
    isValidating,
    disabled,
    required,
    readOnly,
    buildLabel,
    buildControl,
    buildFeedback,
    children,
  });
}

type FieldErrorMessage = string | { message?: string } | undefined;

type fieldErrorMessagesArgs = {
  suppliedErrors: FieldErrorMessage[] | null | undefined;
};

function fieldErrorMessages({ suppliedErrors }: fieldErrorMessagesArgs) {
  return Array.from(
    new Set(
      (suppliedErrors ?? [])
        .map((error) => (isStringProp(error) ? error : error?.message))
        .filter((message): message is string => Boolean(message)),
    ),
  );
}
