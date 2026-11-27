/* oxlint-disable react/only-export-components -- public color utilities accompany the component */
/* kira-kit-ignore-file raw-colors: swatch palette entries and default values are colour data, not theme styling */
"use client";

import * as React from "react";
import {
  isFunctionProp,
  omitComponentProps,
  resolveComponentDefaults,
} from "@/lib/component-utils";
import { cva, type VariantProps } from "class-variance-authority";
import { hsvaToHexa, type HsvaColor } from "@uiw/color-convert";
import Saturation from "@uiw/react-color-saturation";
import {
  IconCheck,
  IconColorPicker,
  IconCopy,
  IconLoader2,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { KiraSelect } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useColorPicker } from "@/hooks/use-color-picker";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  colorValue,
  findAccessibleColor,
  formatColor,
  getContrastRatio,
  initialColor,
  isOklchInSrgb,
  parseColor,
  parseOklchInput,
  serializeColorToken,
  type ColorFormat,
  type ColorInput,
  type ColorPickerValue,
} from "@/lib/color-picker";
import { cn } from "cn";

const colorPickerVariants = cva(
  // kira-kit-ignore spacing-scale: compact swatch-field stack gap
  "inline-flex min-w-0 max-w-full flex-col gap-1.5",
  {
    variants: {
      size: {
        sm: "gap-1 text-xs",
        default: "text-sm",
        lg: "gap-2 text-base",
      },
    },
    defaultVariants: { size: "default" },
  },
);

const DEFAULT_SWATCHES = [
  "#F8371A",
  "#F97C1B",
  "#FAC81C",
  "#3FD0B6",
  "#2CADF6",
  "#6462FC",
] as const;

const CHECKERBOARD = {
  background:
    "repeating-conic-gradient(var(--muted) 0% 25%, var(--background) 0% 50%) 50% / 8px 8px",
};

const FORMATS = [
  { value: "hex", label: "HEX" },
  { value: "hexa", label: "HEXA" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
  { value: "oklch", label: "OKLCH" },
] satisfies { value: ColorFormat; label: string }[];

type ColorPickerError = {
  type: "invalid" | "format" | "clipboard" | "eyedropper";
  message: string;
};

interface ColorPickerProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<"div">,
      "defaultValue" | "children" | "onError"
    >,
    VariantProps<typeof colorPickerVariants> {
  value?: ColorInput;
  defaultValue?: ColorInput;
  /** Controlled display format. */
  format?: ColorFormat;
  defaultFormat?: ColorFormat;
  /** @deprecated Use defaultFormat. */
  type?: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
  swatches?: readonly string[];
  hideContrastRatio?: boolean;
  hideDefaultSwatches?: boolean;
  showAlpha?: boolean;
  defaultAlpha?: number;
  showHarmonies?: boolean;
  showBackgroundPreview?: boolean;
  showCopyButton?: boolean;
  onValueChange?: (value: ColorPickerValue) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** One element receiving Base UI trigger props through render. */
  children?: React.ReactElement;
  disabled?: boolean;
  disabledReason?: string;
  readOnly?: boolean;
  name?: string;
  required?: boolean;
  invalid?: boolean;
  error?: string;
  label?: string;
  contentClassName?: string;
  onError?: (error: ColorPickerError) => void;
  /** Lets a composed workflow share one live status region. */
  onFeedback?: (message: string) => void;
  announceFeedback?: boolean;
}

interface BrowserEyeDropper {
  open: (options?: { signal?: AbortSignal }) => Promise<{ sRGBHex: string }>;
}

function eyeDropperConstructor() {
  if (typeof window === "undefined" || !window.isSecureContext)
    return undefined;

  // SAFETY: this optional browser API is only constructed after feature detection.
  return (window as Window & { EyeDropper?: new () => BrowserEyeDropper })
    .EyeDropper;
}

function subscribeToBrowserCapabilities() {
  return () => {};
}

function ColorSwatches({
  title,
  colors,
  current,
  disabled,
  onSelect,
}: {
  title: string;
  colors: readonly string[];
  current: HsvaColor | null;
  disabled: boolean;
  onSelect: (color: HsvaColor) => void;
}) {
  const valid = Array.from(
    new Set(
      colors
        .map((color) => {
          const parsed = parseColor(color);

          return parsed ? hsvaToHexa(parsed).toLowerCase() : null;
        })
        .filter((color): color is string => color !== null),
    ),
  );

  if (!valid.length) return null;

  return (
    <div
      data-slot="color-picker-swatches"
      className="space-y-2"

      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This composite div groups controls or content without introducing fieldset form behavior, default styling, or a different public ref element.
      role="group"
      aria-label={title}
    >
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">
        {valid.map((color) => (
          <Button
            key={color}
            variant="outline"
            size="icon-sm"
            data-slot="color-picker-swatch"
            disabled={disabled}
            aria-label={"Select " + color}
            aria-pressed={
              current !== null && hsvaToHexa(current).toLowerCase() === color
            }
            onClick={() => {
              const parsed = parseColor(color);

              if (parsed) onSelect(parsed);
            }}
            className="relative overflow-hidden"
            style={CHECKERBOARD}
          >
            <span
              data-slot="color-picker-swatch-color"
              aria-hidden="true"
              className="relative grid size-8 shrink-0 place-items-center"
              style={{ backgroundColor: color }}
            >
              {current !== null &&
                hsvaToHexa(current).toLowerCase() === color && (
                  <IconCheck
                    data-slot="color-picker-swatch-indicator"
                    aria-hidden="true"
                    className="size-4 rounded-sm bg-background text-foreground"
                  />
                )}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}

function ColorTextField({
  id,
  value,
  format,
  disabled,
  readOnly,
  onCommit,
  onError,
  onNotice,
}: {
  id: string;
  value: string;
  format: ColorFormat;
  disabled: boolean;
  readOnly: boolean;
  onCommit: (color: HsvaColor) => void;
  onError: (message: string) => void;
  onNotice: (message: string) => void;
}) {
  const [draft, setDraft] = React.useState(value);
  const [previous, setPrevious] = React.useState({ value, format });
  const [error, setError] = React.useState<string | null>(null);

  if (previous.value !== value || previous.format !== format) {
    setPrevious({ value, format });
    setDraft(value);
    setError(null);
  }

  const commit = () => {
    if (disabled || readOnly || draft === value) return;
    const parsed = parseColor(draft);

    if (!parsed) {
      const message = "Enter a valid HEX, RGB, HSL or OKLCH color.";
      setError(message);
      onError(message);

      return;
    }

    onCommit(parsed);
    const requestedOklch = parseOklchInput(draft);

    if (requestedOklch && !isOklchInSrgb(requestedOklch))
      onNotice(
        "Mapped to sRGB. Chroma was reduced to fit this picker’s color space.",
      );
    setError(null);
    // A controlled picker displays only the accepted value after committing.
    setDraft(value);
  };

  return renderColorPickerValueFieldPart1({
    id,
    draft,
    disabled,
    readOnly,
    error,
    setDraft,
    setError,
    commit,
    value,
  });
}

function ColorSliders({
  color,
  showAlpha,
  disabled,
  readOnly,
  onChange,
}: {
  color: HsvaColor;
  showAlpha: boolean;
  disabled: boolean;
  readOnly: boolean;
  onChange: (color: HsvaColor) => void;
}) {
  const saturationBrightness = [
    { key: "s" as const, label: "Saturation", value: color.s },
    { key: "v" as const, label: "Brightness", value: color.v },
  ];

  return (
    <div data-slot="color-picker-sliders" className="space-y-2">
      <Slider
        label="Hue"
        value={color.h}
        min={0}
        max={359}
        step={1}
        size="sm"
        disabled={disabled}
        readOnly={readOnly}
        tooltipMode="never"
        getValueText={(value) => Math.round(value) + " degrees"}
        onValueChange={(h) => onChange({ ...color, h })}
        className="**:data-[slot=slider-header]:sr-only **:data-[slot=slider-track]:bg-[linear-gradient(to_right,red,yellow,lime,cyan,blue,magenta,red)] **:data-[slot=slider-range]:bg-transparent"
      />
      <div
        data-slot="color-picker-keyboard-channels"
        className="sr-only focus-within:not-sr-only focus-within:space-y-3"
      >
        {saturationBrightness.map((control) => (
          <Slider
            key={control.key}
            label={control.label}
            value={control.value}
            min={0}
            max={100}
            step={1}
            size="sm"
            tooltipMode="never"
            disabled={disabled}
            readOnly={readOnly}
            getValueText={(value) => Math.round(value) + " percent"}
            onValueChange={(value) =>
              onChange({ ...color, [control.key]: value })
            }
          />
        ))}
      </div>
      {showAlpha && (
        <Slider
          label="Opacity"
          value={color.a * 100}
          min={0}
          max={100}
          step={1}
          size="sm"
          disabled={disabled}
          readOnly={readOnly}
          tooltipMode="never"
          getValueText={(value) => Math.round(value) + " percent"}
          onValueChange={(value) => onChange({ ...color, a: value / 100 })}
        />
      )}
    </div>
  );
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (input0, input1) => {
    const state0 = useColorPickerSetup(input0, input1);
    const state1 = useColorPickerState2(state0);
    const state2 = useColorPickerState3(state1);
    const state3 = useColorPickerState4(state2);
    const state4 = useColorPickerActions(state3);

    return renderColorPicker(state4);
  },
);

ColorPicker.displayName = "ColorPicker";

type ColorCopyKind = "css" | "dtcg";

type ColorCopyState =
  | { status: "idle" }
  | { status: "pending"; kind: ColorCopyKind }
  | { status: "success"; kind: ColorCopyKind }
  | { status: "error"; kind: ColorCopyKind; message: string };

interface KiraColorPickerProps extends Omit<
  ColorPickerProps,
  "hideContrastRatio" | "showCopyButton" | "announceFeedback"
> {
  /** Contrast requires the real, opaque surface behind the foreground. */
  background: ColorInput;
  textSize?: "normal" | "large";
  contrastLevel?: "AA" | "AAA";
  showAccessibleSuggestion?: boolean;
  tokenName?: string;
  showTokenPreview?: boolean;
  /** Optional clipboard adapter. Completion, failure and cancellation are caller-owned. */
  copyText?: (text: string, signal: AbortSignal) => Promise<void>;
}

const CONTRAST_TARGETS = {
  AA: { normal: 4.5, large: 3 },
  AAA: { normal: 7, large: 4.5 },
};

async function writeColorClipboard(
  text: string,
  signal: AbortSignal,
): Promise<void> {
  if (signal.aborted) throw new DOMException("Copy cancelled", "AbortError");

  if (typeof navigator === "undefined" || !navigator.clipboard)
    throw new Error(
      "Clipboard access is unavailable. Select and copy the token text.",
    );
  await navigator.clipboard.writeText(text);
}

const KiraColorPicker = React.forwardRef<HTMLDivElement, KiraColorPickerProps>(
  (input0, input1) => {
    const state0 = useKiraColorPickerSetup(input0, input1);
    const state1 = useKiraColorPickerState2(state0);
    const state2 = useKiraColorPickerState3(state1);
    const state3 = useKiraColorPickerState4(state2);
    const state4 = useKiraColorPickerState5(state3);
    const state5 = useKiraColorPickerState6(state4);
    const state6 = useKiraColorPickerActions(state5);

    return renderKiraColorPicker(state6);
  },
);

KiraColorPicker.displayName = "KiraColorPicker";

export { ColorPicker, KiraColorPicker, colorPickerVariants };

export type {
  ColorPickerProps,
  KiraColorPickerProps,
  ColorPickerError,
  ColorCopyState,
};

export type {
  ColorInput,
  ColorFormat,
  ColorPickerValue,
  ColorHarmony,
  OklchColor,
} from "@/lib/color-picker";

export {
  getColorAsHsva,
  rgbaToOklch,
  oklchToRgba,
  hslaToHsva,
} from "@/lib/color-picker";

type resolvecolorpickertsxChoice1Args = {
  externalInvalid: boolean;
  requiredError: boolean;
};

function resolvecolorpickertsxChoice1({
  externalInvalid,
  requiredError,
}: resolvecolorpickertsxChoice1Args) {
  if (externalInvalid) {
    return "The supplied color is invalid.";
  }

  if (requiredError) {
    return "Choose a color.";
  }

  return "";
}

type resolvecolorpickertsxChoice2Args = {
  copyState: "error" | "idle" | "pending" | "success";
  reducedMotion: boolean;
};

function resolvecolorpickertsxChoice2({
  copyState,
  reducedMotion,
}: resolvecolorpickertsxChoice2Args) {
  if (copyState === "success") {
    return <IconCheck aria-hidden="true" className="size-4" />;
  }

  if (copyState === "pending") {
    return (
      <IconLoader2
        aria-hidden="true"
        className={cn("size-4", !reducedMotion && "animate-spin")}
      />
    );
  }

  return <IconCopy aria-hidden="true" className="size-4" />;
}

type resolvecolorpickertsxChoice3Args = {
  copyState: "error" | "idle" | "pending" | "success";
};

function resolvecolorpickertsxChoice3({
  copyState,
}: resolvecolorpickertsxChoice3Args) {
  if (copyState === "success") {
    return "Copied";
  }

  if (copyState === "error") {
    return "Retry copy";
  }

  return "Copy color";
}

type resolvecolorpickertsxChoice4Args = {
  pending: boolean;
  reducedMotion: boolean;
  copied: boolean;
};

function resolvecolorpickertsxChoice4({
  pending,
  reducedMotion,
  copied,
}: resolvecolorpickertsxChoice4Args) {
  if (pending) {
    return (
      <IconLoader2
        aria-hidden="true"
        className={cn("size-4", !reducedMotion && "animate-spin")}
      />
    );
  }

  if (copied) {
    return <IconCheck aria-hidden="true" className="size-4" />;
  }

  return <IconCopy aria-hidden="true" className="size-4" />;
}

type resolvecolorpickertsxChoice5Args = {
  copied: boolean;
  failed: boolean;
  kind: "css" | "dtcg";
};

function resolvecolorpickertsxChoice5({
  copied,
  failed,
  kind,
}: resolvecolorpickertsxChoice5Args) {
  if (copied) {
    return "Copied";
  }

  if (failed) {
    return "Retry copy";
  }

  if (kind === "css") {
    return "Copy CSS variable";
  }

  return "Copy DTCG token";
}

function useColorPickerSetup(
  componentProps: ColorPickerProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const props = omitComponentProps(
    componentProps,
    USE_COLOR_PICKER_SETUP_COMPOSITION_KEYS_1,
  );

  const resolvedProps = resolveComponentDefaults(
    componentProps,
    USE_COLOR_PICKER_SETUP_DEFAULTS_1,
  );

  const { defaultValue, defaultOpen } = resolvedProps;

  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const eyeAbortRef = React.useRef<AbortController | null>(null);

  const commitScreenColorRef = React.useRef<(color: HsvaColor) => void>(
    () => {},
  );

  const feedbackTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const mountedRef = React.useRef(true);

  const copyGenerationRef = React.useRef(0);

  const id = React.useId();

  const reducedMotion = useReducedMotion();

  const [internalFormat, setInternalFormat] = React.useState<ColorFormat>(
    componentProps.defaultFormat ?? componentProps.type ?? "hex",
  );

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const [hasInternalValue, setHasInternalValue] = React.useState(
    () => !!parseColor(defaultValue),
  );

  const [feedback, setFeedback] = React.useState("");

  return {
    ...componentProps,
    ...resolvedProps,
    props,
    ref,
    rootRef,
    triggerRef,
    eyeAbortRef,
    commitScreenColorRef,
    feedbackTimerRef,
    mountedRef,
    copyGenerationRef,
    id,
    reducedMotion,
    internalFormat,
    setInternalFormat,
    internalOpen,
    setInternalOpen,
    hasInternalValue,
    setHasInternalValue,
    feedback,
    setFeedback,
  };
}

function useColorPickerState2(state: ReturnType<typeof useColorPickerSetup>) {
  const { setFeedback } = state;

  const [copyState, setCopyState] = React.useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  const [eyePending, setEyePending] = React.useState(false);

  const [requiredError, setRequiredError] = React.useState(false);

  const { colorFormat, hasValue, externalInvalid } =
    getColorPickerValueState(state);

  const errorText = colorPickerValidationMessage({
    state,
    externalInvalid,
    requiredError,
  });

  const picker = useColorPicker({
    value: state.value,
    defaultValue: state.defaultValue,
    showAlpha: state.showAlpha,
    defaultAlpha: state.defaultAlpha,
    disabled: state.disabled,
    readOnly: state.readOnly,
    onValueChange: state.onValueChange,
  });

  const { formatted, canonical, popupOpen, screenSelectionEnabled } =
    getColorPickerDisplayState(state, picker, colorFormat, hasValue);

  if (eyePending && !screenSelectionEnabled) setEyePending(false);

  const [previousCopyValue, setPreviousCopyValue] = React.useState(formatted);

  if (previousCopyValue !== formatted) {
    setPreviousCopyValue(formatted);
    setCopyState("idle");
    setFeedback("");
  }

  const eyedropperSupported = React.useSyncExternalStore(
    subscribeToBrowserCapabilities,
    () => !!eyeDropperConstructor(),
    () => false,
  );

  return {
    ...state,
    copyState,
    setCopyState,
    eyePending,
    setEyePending,
    setRequiredError,
    colorFormat,
    hasValue,
    errorText,
    picker,
    formatted,
    canonical,
    popupOpen,
    screenSelectionEnabled,
    eyedropperSupported,
  };
}

function getColorPickerValueState(
  state: ReturnType<typeof useColorPickerSetup>,
) {
  const colorFormat = state.format ?? state.internalFormat;

  const hasValue =
    state.value === undefined
      ? state.hasInternalValue
      : !!parseColor(state.value);

  const externalInvalid =
    state.value !== undefined && state.value !== "" && !parseColor(state.value);

  return { colorFormat, hasValue, externalInvalid };
}

function getColorPickerDisplayState(
  state: ReturnType<typeof useColorPickerSetup>,
  picker: ReturnType<typeof useColorPicker>,
  colorFormat: ColorFormat,
  hasValue: boolean,
) {
  const popupOpen = !state.disabled && (state.open ?? state.internalOpen);

  return {
    formatted: hasValue ? picker.formatValue(colorFormat) : "",
    canonical: hasValue
      ? formatColor(picker.colorHsv, "hex", picker.alpha < 1)
      : "",
    popupOpen,
    screenSelectionEnabled: popupOpen && !state.disabled && !state.readOnly,
  };
}

function useColorPickerState3(state: ReturnType<typeof useColorPickerState2>) {
  const { copyGenerationRef, commitScreenColorRef, eyeAbortRef } = state;

  const {
    setFeedback,
    onFeedback,
    setCopyState,
    setRequiredError,
    setHasInternalValue,
    setInternalOpen,
    setEyePending,
    onOpenChange,
  } = state;

  const report = (message: string) => {
    setFeedback(message);
    onFeedback?.(message);
  };

  const changeColor = (color: HsvaColor) => {
    if (state.disabled || state.readOnly) return;
    copyGenerationRef.current += 1;
    setCopyState("idle");
    setRequiredError(false);

    if (state.value === undefined) setHasInternalValue(true);
    state.picker.setColor(color);
    report(
      "Color set to " +
        formatColor(color, state.colorFormat, state.showAlpha || color.a < 1) +
        ".",
    );
  };

  React.useLayoutEffect(() => {
    commitScreenColorRef.current = (color) => {
      if (state.screenSelectionEnabled)
        changeColor({ ...color, a: state.picker.alpha });
    };
  });

  React.useLayoutEffect(
    () => () => {
      const controller = eyeAbortRef.current;
      eyeAbortRef.current = null;
      controller?.abort();
    },
    [state.screenSelectionEnabled, eyeAbortRef],
  );

  const changeOpen = (next: boolean) => {
    if (state.disabled && next) return;

    if (state.open === undefined) setInternalOpen(next);

    if (!next) {
      eyeAbortRef.current?.abort();
      eyeAbortRef.current = null;
      setEyePending(false);
    }

    onOpenChange?.(next);
  };

  return { ...state, report, changeColor, changeOpen };
}

function useColorPickerState4(state: ReturnType<typeof useColorPickerState3>) {
  const {
    triggerRef,
    copyGenerationRef,
    mountedRef,
    feedbackTimerRef,
    eyeAbortRef,
    commitScreenColorRef,
  } = state;

  const {
    setInternalFormat,
    onFormatChange,
    setCopyState,
    report,
    onError,
    setEyePending,
  } = state;

  const changeFormat = (next: string | string[]) => {
    if (Array.isArray(next)) return;
    const selected = FORMATS.find((item) => item.value === next)?.value;

    if (!selected) return;

    if (state.format === undefined) setInternalFormat(selected);
    onFormatChange?.(selected);
  };

  const openFromValue = () => {
    if (!state.disabled && !state.popupOpen) triggerRef.current?.click();
  };

  const copy = createColorCopyAction({
    state,
    copyGenerationRef,
    setCopyState,
    report,
    mountedRef,
    feedbackTimerRef,
    onError,
  });

  const pickFromScreen = createScreenColorAction({
    state,
    eyeAbortRef,
    setEyePending,
    report,
    mountedRef,
    commitScreenColorRef,
    onError,
  });

  return { ...state, changeFormat, openFromValue, copy, pickFromScreen };
}

function useColorPickerActions(state: ReturnType<typeof useColorPickerState4>) {
  const {
    rootRef,
    copyGenerationRef,
    feedbackTimerRef,
    mountedRef,
    eyeAbortRef,
  } = state;

  const { setHasInternalValue, setRequiredError, setCopyState, ref } = state;

  const resetFormValue = React.useEffectEvent(() => {
    state.picker.reset();
    setHasInternalValue(!!parseColor(state.defaultValue));
    setRequiredError(false);
    setCopyState("idle");
  });

  React.useEffect(() => {
    const form = rootRef.current?.closest("form");
    const reset = () => resetFormValue();
    form?.addEventListener("reset", reset);

    return () => form?.removeEventListener("reset", reset);
  }, [rootRef]);

  React.useEffect(
    () => () => {
      copyGenerationRef.current += 1;

      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    },
    [state.formatted, state.disabled, feedbackTimerRef, copyGenerationRef],
  );

  React.useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      copyGenerationRef.current += 1;

      // oxlint-disable-next-line react-hooks/exhaustive-deps -- Cleanup must cancel the latest pending operation or timer stored in this stable ref, including work started after effect setup.
      eyeAbortRef.current?.abort();

      // oxlint-disable-next-line react-hooks/exhaustive-deps -- Cleanup must cancel the latest pending operation or timer stored in this stable ref, including work started after effect setup.
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, [feedbackTimerRef, eyeAbortRef, mountedRef, copyGenerationRef]);

  const attachRoot = (element: HTMLDivElement | null) => {
    rootRef.current = element;

    if (isFunctionProp(ref)) return ref(element);

    if (ref) ref.current = element;
  };

  const allSwatches = state.hideDefaultSwatches
    ? [...state.swatches]
    : [...DEFAULT_SWATCHES, ...state.swatches];

  const contrasts = [
    { name: "white", color: "#ffffff" },
    { name: "black", color: "#000000" },
  ];

  return { ...state, attachRoot, allSwatches, contrasts };
}

// oxlint-disable-next-line eslint/max-lines-per-function, eslint/complexity, sonarjs/cognitive-complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function renderColorPicker(state: ReturnType<typeof useColorPickerActions>) {
  const { triggerRef } = state;

  const { openFromValue, changeColor, setRequiredError } = state;

  return (
    <div
      ref={state.attachRoot}
      data-slot="color-picker"
      data-disabled={state.disabled || undefined}
      data-readonly={state.readOnly || undefined}
      data-invalid={state.invalid || !!state.errorText || undefined}
      className={cn(
        colorPickerVariants({ size: state.size, className: state.className }),
      )}
      {...state.props}
    >
      <Popover open={state.popupOpen} onOpenChange={state.changeOpen}>
        {state.children ? (
          <PopoverTrigger
            ref={triggerRef}
            disabled={state.disabled}
            data-slot="color-picker-trigger"
            render={state.children}
            aria-label={
              state.label +
              (state.formatted ? ": " + state.formatted : ": choose a color")
            }
            aria-invalid={state.invalid || !!state.errorText || undefined}
            aria-describedby={resolverenderColorPickerChoice10({ state })}
          />
        ) : (
          <div
            data-slot="color-picker-trigger-group"
            className="inline-flex max-w-full items-center gap-2"
          >
            <PopoverTrigger
              ref={triggerRef}
              disabled={state.disabled}
              data-slot="color-picker-trigger"
              aria-label={
                state.label +
                (state.formatted ? ": " + state.formatted : ": choose a color")
              }
              aria-invalid={state.invalid || !!state.errorText || undefined}
              aria-describedby={resolverenderColorPickerChoice11({ state })}
              render={renderRenderColorPickerSectionPart2({ state })}
            />
            <Input
              data-slot="color-picker-trigger-value"
              size={resolverenderColorPickerChoice12({ state })}
              value={state.formatted}
              readOnly
              disabled={state.disabled}
              aria-label={state.label + " value"}
              aria-haspopup="dialog"
              aria-expanded={state.popupOpen}
              aria-controls={
                state.popupOpen ? state.id + "-content" : undefined
              }
              placeholder="Choose color"
              className={cn(
                "min-w-0 font-mono text-xs",
                state.size === "lg" ? "w-32" : "w-24",
              )}
              onClick={openFromValue}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === "ArrowDown") {
                  event.preventDefault();
                  openFromValue();
                }
              }}
            />
          </div>
        )}
        <PopoverContent
          id={state.id + "-content"}
          data-slot="color-picker-content"
          align="start"
          className={cn(
            "w-85 max-w-[calc(100vw-2rem)] space-y-3 p-4",
            state.contentClassName,
          )}
        >
          <PopoverTitle className="sr-only">{state.label}</PopoverTitle>
          {renderColorPickerSaturationPart3({ state })}
          <ColorSliders
            color={state.picker.colorHsv}
            showAlpha={state.showAlpha}
            disabled={state.disabled}
            readOnly={state.readOnly}
            onChange={changeColor}
          />
          {renderColorPickerActionsPart4({ state })}
          {renderColorPickerFormatRowPart5({ state })}
          {state.readOnly && (
            <p className="text-xs text-muted-foreground">
              Read only. You can inspect and copy this color.
            </p>
          )}
          <ColorSwatches
            title="Palette"
            colors={state.allSwatches}
            current={state.hasValue ? state.picker.colorHsv : null}
            disabled={state.disabled || state.readOnly}
            onSelect={changeColor}
          />
          <ColorSwatches
            title="Recent colors"
            colors={state.picker.recentColors}
            current={state.hasValue ? state.picker.colorHsv : null}
            disabled={state.disabled || state.readOnly}
            onSelect={changeColor}
          />
          {state.showHarmonies &&
            state.picker.harmonies.map((group) => (
              <ColorSwatches
                key={group.name}
                title={group.name}
                colors={group.colors}
                current={state.hasValue ? state.picker.colorHsv : null}
                disabled={state.disabled || state.readOnly}
                onSelect={(color) =>
                  changeColor({ ...color, a: state.picker.alpha })
                }
              />
            ))}
          {!state.hideContrastRatio &&
            state.hasValue &&
            renderColorPickerContrastPart6({ state })}
          {state.showBackgroundPreview &&
            state.hasValue &&
            renderColorPickerBackgroundPreviewPart7({ state })}
          {state.feedback && (
            <p
              data-slot="color-picker-feedback"
              className="wrap-anywhere text-xs text-muted-foreground"
            >
              {state.feedback}
            </p>
          )}
        </PopoverContent>
      </Popover>
      {state.name && (
        <input
          data-slot="color-picker-form-value"
          className="sr-only pointer-events-none"
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          name={state.name}
          value={state.canonical}
          disabled={state.disabled}
          required={state.required}
          onChange={() => {}}
          onInvalid={(event) => {
            event.preventDefault();
            setRequiredError(true);
            triggerRef.current?.focus();
          }}
        />
      )}
      {state.errorText && (
        <p
          id={state.id + "-error"}
          data-slot="color-picker-error"
          className="wrap-anywhere text-xs text-destructive"
        >
          {state.errorText}
        </p>
      )}
      {state.disabledReason && (
        <p
          id={state.id + "-reason"}
          data-slot="color-picker-disabled-reason"
          className="wrap-anywhere text-xs text-muted-foreground"
        >
          {state.disabledReason}
        </p>
      )}
      {state.announceFeedback && (
        <span
          data-slot="color-picker-live-status"

          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This existing live region preserves its block layout and div ref contract; output introduces form-associated semantics.
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {state.feedback}
        </span>
      )}
    </div>
  );
}

function useKiraColorPickerSetup(
  componentProps: KiraColorPickerProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const props = omitComponentProps(
    componentProps,
    USE_KIRA_COLOR_PICKER_SETUP_COMPOSITION_KEYS_2,
  );

  const resolvedProps = resolveKiraColorPickerDefaults(componentProps);

  const { textSize, contrastLevel, showAccessibleSuggestion, defaultValue } =
    resolvedProps;

  const core = useKiraColorPickerCoreState(componentProps, defaultValue);

  const {
    internal,
    setInternal,
    internalFormat,
    setInternalFormat,
    copyState,
    setCopyState,
    feedback,
    setFeedback,
    rootRef,
    copyButtonRef,
    operationRef,
    resetTimerRef,
    mountedRef,
    id,
    reducedMotion,
  } = core;

  const contrast = resolveKiraColorContrast({
    componentProps,
    internal,
    internalFormat,
    contrastLevel,
    textSize,
    showAccessibleSuggestion,
  });

  return {
    ...componentProps,
    ...resolvedProps,
    ...contrast,
    props,
    ref,
    setInternal,
    setInternalFormat,
    copyState,
    setCopyState,
    feedback,
    setFeedback,
    rootRef,
    copyButtonRef,
    operationRef,
    resetTimerRef,
    mountedRef,
    id,
    reducedMotion,
  };
}

function resolveKiraColorPickerDefaults(componentProps: KiraColorPickerProps) {
  return resolveComponentDefaults(
    {
      textSize: componentProps.textSize,
      contrastLevel: componentProps.contrastLevel,
      showAccessibleSuggestion: componentProps.showAccessibleSuggestion,
      tokenName: componentProps.tokenName,
      showTokenPreview: componentProps.showTokenPreview,
      copyText: componentProps.copyText,
      defaultValue: componentProps.defaultValue,
      disabled: componentProps.disabled,
      readOnly: componentProps.readOnly,
    },
    {
      textSize: "normal",
      contrastLevel: "AA",
      showAccessibleSuggestion: false,
      tokenName: "brand.primary",
      showTokenPreview: true,
      copyText: writeColorClipboard,
      defaultValue: "#3b82f6",
      disabled: false,
      readOnly: false,
    },
  );
}

function useKiraColorPickerCoreState(
  componentProps: KiraColorPickerProps,
  defaultValue: ColorInput,
) {
  const [internal, setInternal] = React.useState<ColorInput>(() =>
    parseColor(defaultValue)
      ? initialColor(defaultValue, componentProps.defaultAlpha)
      : "",
  );

  const [internalFormat, setInternalFormat] = React.useState<ColorFormat>(
    componentProps.defaultFormat ?? componentProps.type ?? "hex",
  );

  const [copyState, setCopyState] = React.useState<ColorCopyState>({
    status: "idle",
  });

  const [feedback, setFeedback] = React.useState("");
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const copyButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const operationRef = React.useRef<AbortController | null>(null);

  const resetTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const mountedRef = React.useRef(true);
  const id = React.useId();
  const reducedMotion = useReducedMotion();

  return {
    internal,
    setInternal,
    internalFormat,
    setInternalFormat,
    copyState,
    setCopyState,
    feedback,
    setFeedback,
    rootRef,
    copyButtonRef,
    operationRef,
    resetTimerRef,
    mountedRef,
    id,
    reducedMotion,
  };
}

function resolveKiraColorContrast({
  componentProps,
  internal,
  internalFormat,
  contrastLevel,
  textSize,
  showAccessibleSuggestion,
}: {
  componentProps: KiraColorPickerProps;
  internal: ColorInput;
  internalFormat: ColorFormat;
  contrastLevel: "AA" | "AAA";
  textSize: "normal" | "large";
  showAccessibleSuggestion: boolean;
}) {
  const selected = componentProps.value ?? internal;
  const color = parseColor(selected);
  const backgroundColor = parseColor(componentProps.background);
  const selectedFormat = componentProps.format ?? internalFormat;
  const target = CONTRAST_TARGETS[contrastLevel][textSize];

  const ratio = color
    ? getContrastRatio(color, componentProps.background)
    : null;

  const passes = ratio !== null && ratio >= target;

  const suggestion = accessibleColorSuggestion({
    showAccessibleSuggestion,
    color,
    ratio,
    passes,
    componentProps,
    target,
  });

  return {
    selected,
    color,
    backgroundColor,
    selectedFormat,
    target,
    ratio,
    passes,
    suggestion,
  };
}

function useKiraColorPickerState2(
  state: ReturnType<typeof useKiraColorPickerSetup>,
) {
  const { setCopyState, setFeedback, onFeedback } = state;

  const canonical = state.color
    ? formatColor(
        state.color,
        state.selectedFormat,
        state.props.showAlpha || state.color.a < 1,
      )
    : "";

  const exportValue = React.useMemo(() => {
    if (!state.color)
      return { css: "", dtcg: "", error: "Choose a valid color to export." };

    try {
      const dtcg = serializeColorToken(state.tokenName, state.color);

      return {
        css:
          "--" +
          state.tokenName.replaceAll(".", "-") +
          ": " +
          formatColor(
            state.color,
            state.selectedFormat,
            state.props.showAlpha || state.color.a < 1,
          ) +
          ";",
        dtcg,
        error: "",
      };
    } catch (cause) {
      return {
        css: "",
        dtcg: "",
        error:
          cause instanceof Error ? cause.message : "Enter a valid token name.",
      };
    }
  }, [
    state.color,
    state.selectedFormat,
    state.tokenName,
    state.props.showAlpha,
  ]);

  const exportKey =
    exportValue.css + "\n" + exportValue.dtcg + "\n" + state.disabled;

  const [previousExportKey, setPreviousExportKey] = React.useState(exportKey);

  if (previousExportKey !== exportKey) {
    setPreviousExportKey(exportKey);
    setCopyState({ status: "idle" });
    setFeedback("");
  }

  const report = (message: string) => {
    setFeedback(message);
    onFeedback?.(message);
  };

  return { ...state, canonical, exportValue, exportKey, report };
}

function useKiraColorPickerState3(
  state: ReturnType<typeof useKiraColorPickerState2>,
) {
  const { operationRef, resetTimerRef, mountedRef } = state;

  const {
    setCopyState,
    setInternal,
    onValueChange,
    setInternalFormat,
    onFormatChange,
    report,
    copyText,
    onError,
  } = state;

  const change = (nextValue: ColorPickerValue) => {
    if (state.disabled || state.readOnly) return;
    operationRef.current?.abort();
    operationRef.current = null;

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setCopyState({ status: "idle" });

    if (state.value === undefined) setInternal(nextValue.hsv);
    onValueChange?.(nextValue);
  };

  const changeFormat = (nextFormat: ColorFormat) => {
    if (state.format === undefined) setInternalFormat(nextFormat);
    onFormatChange?.(nextFormat);
  };

  const copy = async (kind: ColorCopyKind) => {
    if (
      !canStartTokenCopy(
        state.disabled,
        state.exportValue.error,
        operationRef.current,
      )
    )
      return;
    const controller = new AbortController();
    operationRef.current = controller;

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    const text = state.exportValue[kind];
    setCopyState({ status: "pending", kind });
    report(
      kind === "css" ? "Copying CSS variable…" : "Copying DTCG color token…",
    );

    try {
      await copyText(text, controller.signal);

      if (!isTokenCopyCurrent(mountedRef, controller, operationRef)) return;
      setCopyState({ status: "success", kind });
      report(
        kind === "css" ? "CSS variable copied." : "DTCG color token copied.",
      );
      resetTimerRef.current = setTimeout(
        () => setCopyState({ status: "idle" }),
        2000,
      );
    } catch (cause) {
      return reportTokenCopyError({
        mountedRef,
        controller,
        operationRef,
        cause,
        setCopyState,
        kind,
        report,
        onError,
      });
    } finally {
      if (operationRef.current === controller) operationRef.current = null;
    }
  };

  return { ...state, change, changeFormat, copy };
}

function canStartTokenCopy(
  disabled: boolean,
  exportError: string | undefined,
  operation: AbortController | null,
) {
  return !disabled && !exportError && !operation;
}

function isTokenCopyCurrent(
  mountedRef: React.RefObject<boolean>,
  controller: AbortController,
  operationRef: React.RefObject<AbortController | null>,
) {
  return (
    mountedRef.current &&
    !controller.signal.aborted &&
    operationRef.current === controller
  );
}

function useKiraColorPickerState4(
  state: ReturnType<typeof useKiraColorPickerState3>,
) {
  const { operationRef, copyButtonRef, resetTimerRef, rootRef, mountedRef } =
    state;

  const { setCopyState, report, setInternal } = state;

  const cancelCopy = () => {
    operationRef.current?.abort();
    operationRef.current = null;
    setCopyState({ status: "idle" });
    report("Copy cancelled. You can retry.");
    copyButtonRef.current?.focus();
  };

  const resetForm = React.useEffectEvent(() => {
    operationRef.current?.abort();
    operationRef.current = null;

    if (state.value === undefined)
      setInternal(
        parseColor(state.defaultValue)
          ? initialColor(state.defaultValue, state.defaultAlpha)
          : "",
      );
    setCopyState({ status: "idle" });
  });

  React.useEffect(
    () => () => {
      operationRef.current?.abort();
      operationRef.current = null;

      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    [state.exportKey, resetTimerRef, operationRef],
  );

  React.useEffect(() => {
    const form = rootRef.current?.closest("form");
    const reset = () => resetForm();
    form?.addEventListener("reset", reset);

    return () => form?.removeEventListener("reset", reset);
  }, [rootRef]);

  React.useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      operationRef.current?.abort();
      operationRef.current = null;

      // oxlint-disable-next-line react-hooks/exhaustive-deps -- Cleanup must cancel the latest pending operation or timer stored in this stable ref, including work started after effect setup.
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [resetTimerRef, mountedRef, operationRef]);

  return { ...state, cancelCopy };
}

function useKiraColorPickerState5(
  state: ReturnType<typeof useKiraColorPickerState4>,
) {
  const buildContrast = () => (
    <div data-slot="kira-color-picker-contrast" className="space-y-2">
      <p className="text-sm font-medium">Contrast on your background</p>
      {state.backgroundColor?.a === 1 && state.color ? (
        renderKiraColorPickerTextPreviewPart8({ state })
      ) : (
        <p className="text-sm text-muted-foreground">
          Choose a color and supply an opaque background to evaluate contrast.
        </p>
      )}
      {state.ratio !== null && (
        <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
          <span
            data-slot="kira-color-picker-contrast-ratio"
            className="font-medium tabular-nums"
          >
            {state.ratio.toFixed(2)}:1
          </span>
          <span>
            {state.passes ? "Pass" : "Fail"} · {state.contrastLevel}{" "}
            {state.textSize} text · requires {state.target}:1
          </span>
        </p>
      )}
      {state.showAccessibleSuggestion &&
        state.ratio !== null &&
        !state.passes &&
        (state.suggestion ? (
          renderBuildContrastSectionPart9({ state })
        ) : (
          <p className="text-xs text-muted-foreground">
            No lightness adjustment meets this target at the current opacity.
            Increase opacity or change the background.
          </p>
        ))}
    </div>
  );

  return { ...state, buildContrast };
}

function useKiraColorPickerState6(
  state: ReturnType<typeof useKiraColorPickerState5>,
) {
  const { copyButtonRef } = state;

  const { copy } = state;

  const buildExports = () => (
    <div
      data-slot="kira-color-picker-export"
      className="space-y-2 border-t pt-3"
    >
      <p className="wrap-anywhere text-sm font-medium">
        Token: {state.tokenName || "Enter a token name"}
      </p>
      {state.exportValue.error && (
        <p id={state.id + "-export-error"} className="text-xs text-destructive">
          {state.exportValue.error}
        </p>
      )}
      {state.showTokenPreview && !state.exportValue.error && (
        <pre
          data-slot="kira-color-picker-token-preview"

          // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The bounded scroll region is keyboard focusable so users can scroll and select its content without a pointer.
          tabIndex={0}
          aria-label="DTCG color token JSON"
          className="max-h-48 overflow-auto rounded-md bg-muted p-3 text-xs"
        >
          {state.exportValue.dtcg}
        </pre>
      )}
      <div className="flex flex-wrap gap-2">
        {(["css", "dtcg"] as const).map((kind, index) => {
          const active =
            "kind" in state.copyState && state.copyState.kind === kind;

          const pending = active && state.copyState.status === "pending";
          const copied = active && state.copyState.status === "success";
          const failed = active && state.copyState.status === "error";

          return (
            <Button
              key={kind}
              ref={index === 0 ? copyButtonRef : undefined}
              variant="outline"
              size="sm"
              disabled={
                state.disabled ||
                !!state.exportValue.error ||
                state.copyState.status === "pending"
              }
              focusableWhenDisabled
              aria-describedby={
                state.exportValue.error ? state.id + "-export-error" : undefined
              }
              aria-busy={pending || undefined}
              onClick={() => {
                void copy(kind);
              }}
            >
              {resolvecolorpickertsxChoice4({
                pending,
                reducedMotion: state.reducedMotion,
                copied,
              })}
              {resolvecolorpickertsxChoice5({ copied, failed, kind })}
            </Button>
          );
        })}
        {state.copyState.status === "pending" && (
          <Button variant="ghost" size="sm" onClick={state.cancelCopy}>
            Cancel copy
          </Button>
        )}
      </div>
    </div>
  );

  return { ...state, buildExports };
}

function useKiraColorPickerActions(
  state: ReturnType<typeof useKiraColorPickerState6>,
) {
  const { rootRef } = state;

  const { ref } = state;

  const attachRoot = (element: HTMLDivElement | null) => {
    rootRef.current = element;

    if (isFunctionProp(ref)) return ref(element);

    if (ref) ref.current = element;
  };

  return { ...state, attachRoot };
}

function renderKiraColorPicker(
  state: ReturnType<typeof useKiraColorPickerActions>,
) {
  const { buildContrast, buildExports } = state;

  return (
    <div
      ref={state.attachRoot}
      data-slot="kira-color-picker"
      className={cn(
        colorPickerVariants({ size: state.size }),
        "w-full max-w-md gap-4",
        state.className,
      )}
    >
      <ColorPicker
        {...state.props}
        value={state.selected}
        defaultValue={state.defaultValue}
        defaultAlpha={state.defaultAlpha}
        format={state.selectedFormat}
        onFormatChange={state.changeFormat}
        onValueChange={state.change}
        onError={state.onError}
        onFeedback={state.report}
        disabled={state.disabled}
        readOnly={state.readOnly}
        size={state.size}
        hideContrastRatio
        showCopyButton={false}
        announceFeedback={false}
      />
      {buildContrast()}
      {buildExports()}
      <p
        data-slot="kira-color-picker-status"

        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This existing live region preserves its block layout and div ref contract; output introduces form-associated semantics.
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="min-h-5 wrap-anywhere text-xs text-muted-foreground"
      >
        {state.feedback}
      </p>
    </div>
  );
}

type renderColorPickerValueFieldPart1Args = {
  id: {
    id: string;
    value: string;
    format: ColorFormat;
    disabled: boolean;
    readOnly: boolean;
    onCommit: (color: HsvaColor) => void;
    onError: (message: string) => void;
    onNotice: (message: string) => void;
  }["id"];
  draft: string;
  disabled: {
    id: string;
    value: string;
    format: ColorFormat;
    disabled: boolean;
    readOnly: boolean;
    onCommit: (color: HsvaColor) => void;
    onError: (message: string) => void;
    onNotice: (message: string) => void;
  }["disabled"];
  readOnly: {
    id: string;
    value: string;
    format: ColorFormat;
    disabled: boolean;
    readOnly: boolean;
    onCommit: (color: HsvaColor) => void;
    onError: (message: string) => void;
    onNotice: (message: string) => void;
  }["readOnly"];
  error: string | null;
  setDraft: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  commit: () => void;
  value: {
    id: string;
    value: string;
    format: ColorFormat;
    disabled: boolean;
    readOnly: boolean;
    onCommit: (color: HsvaColor) => void;
    onError: (message: string) => void;
    onNotice: (message: string) => void;
  }["value"];
};

function renderColorPickerValueFieldPart1({
  id,
  draft,
  disabled,
  readOnly,
  error,
  setDraft,
  setError,
  commit,
  value,
}: renderColorPickerValueFieldPart1Args) {
  return (
    // kira-kit-ignore spacing-scale: compact swatch-field stack gap
    <div
      data-slot="color-picker-value-field"
      className="flex min-w-0 flex-col gap-1.5"
    >
      <label htmlFor={id} className="block text-xs font-medium leading-4">
        Color value
      </label>
      <Input
        id={id}
        size="sm"
        data-slot="color-picker-value-input"
        value={draft}
        disabled={disabled}
        readOnly={readOnly}
        spellCheck={false}
        autoComplete="off"
        className="font-mono text-xs"
        aria-invalid={!!error}
        aria-describedby={error ? id + "-error" : id + "-hint"}
        onChange={(event) => {
          setDraft(event.target.value);
          setError(null);
        }}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          }

          if (event.key === "Escape" && draft !== value) {
            event.preventDefault();
            event.stopPropagation();
            setDraft(value);
            setError(null);
          }
        }}
      />
      <p
        id={error ? id + "-error" : id + "-hint"}
        data-slot="color-picker-value-hint"
        className={cn(
          "text-xs",
          error ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {error ?? "Press Enter or leave the field to apply."}
      </p>
    </div>
  );
}

type renderRenderColorPickerSectionPart2Args = {
  state: ReturnType<typeof useColorPickerActions>;
};

function renderRenderColorPickerSectionPart2({
  state,
}: renderRenderColorPickerSectionPart2Args) {
  return (
    <Button
      variant="outline"
      size="icon-sm"
      className={cn(
        "relative shrink-0 overflow-hidden",
        state.size === "sm" && "size-7",
        state.size === "lg" && "size-9",
      )}
      style={CHECKERBOARD}
    >
      {state.hasValue && (
        <span
          data-slot="color-picker-preview"
          aria-hidden="true"
          className={cn(
            "block shrink-0",
            resolverenderRenderColorPickerSectionPart2Choice1({ state }),
          )}
          style={{ backgroundColor: state.canonical }}
        />
      )}
    </Button>
  );
}

type renderColorPickerSaturationPart3Args = {
  state: ReturnType<typeof useColorPickerActions>;
};

function renderColorPickerSaturationPart3({
  state,
}: renderColorPickerSaturationPart3Args) {
  const { changeColor } = state;

  return (
    <div
      data-slot="color-picker-saturation"
      aria-hidden="true"
      className="relative overflow-hidden rounded-md border"
      inert={state.disabled || state.readOnly || undefined}
    >
      <Saturation
        hsva={state.picker.colorHsv}
        onChange={(next) =>
          changeColor({
            ...state.picker.colorHsv,
            ...next,
            a: state.picker.alpha,
          })
        }
        style={{ width: "100%", height: "auto", aspectRatio: "2 / 1" }}
      />
    </div>
  );
}

type renderColorPickerActionsPart4Args = {
  state: ReturnType<typeof useColorPickerActions>;
};

function renderColorPickerActionsPart4({
  state,
}: renderColorPickerActionsPart4Args) {
  const { copy, pickFromScreen } = state;

  return (
    <div data-slot="color-picker-actions" className="flex flex-wrap gap-2">
      {state.showCopyButton && (
        <Button
          variant="outline"
          size="sm"
          disabled={
            state.disabled || !state.hasValue || state.copyState === "pending"
          }
          aria-busy={state.copyState === "pending" || undefined}
          onClick={() => {
            void copy();
          }}
        >
          {resolvecolorpickertsxChoice2({
            copyState: state.copyState,
            reducedMotion: state.reducedMotion,
          })}
          {resolvecolorpickertsxChoice3({ copyState: state.copyState })}
        </Button>
      )}
      {state.eyedropperSupported && (
        <Button
          variant="outline"
          size="sm"
          disabled={state.disabled || state.readOnly || state.eyePending}
          aria-busy={state.eyePending || undefined}
          onClick={() => {
            void pickFromScreen();
          }}
        >
          <IconColorPicker aria-hidden="true" className="size-4" />
          {state.eyePending ? "Selecting…" : "Pick from screen"}
        </Button>
      )}
    </div>
  );
}

type renderColorPickerFormatRowPart5Args = {
  state: ReturnType<typeof useColorPickerActions>;
};

function renderColorPickerFormatRowPart5({
  state,
}: renderColorPickerFormatRowPart5Args) {
  const { report, onError } = state;

  return (
    <div
      data-slot="color-picker-format-row"
      className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-2"
    >
      {/* kira-kit-ignore spacing-scale: compact swatch-field stack gap */}
      <div className="flex min-w-0 flex-col gap-1.5">
        <label
          htmlFor={state.id + "-format"}
          className="block text-xs font-medium leading-4"
        >
          Format
        </label>
        <KiraSelect
          id={state.id + "-format"}
          options={FORMATS}
          value={state.colorFormat}
          onChange={state.changeFormat}
          disabled={state.disabled}
          size="sm"
          aria-label="Color format"
        />
      </div>
      <div className="min-w-0 flex-1">
        <ColorTextField
          id={state.id + "-value"}
          value={state.formatted}
          format={state.colorFormat}
          disabled={state.disabled}
          readOnly={state.readOnly}
          onCommit={state.changeColor}
          onNotice={report}
          onError={(message) => {
            report(message);
            onError?.({ type: "format", message });
          }}
        />
      </div>
    </div>
  );
}

type renderColorPickerContrastPart6Args = {
  state: ReturnType<typeof useColorPickerActions>;
};

function renderColorPickerContrastPart6({
  state,
}: renderColorPickerContrastPart6Args) {
  const color = state.picker.colorHsv;

  if (!color) return null;

  return (
    <div
      data-slot="color-picker-contrast"
      className="space-y-2 border-t pt-3 text-xs"
    >
      <p className="font-medium">Normal text contrast (AA ≥ 4.5:1)</p>
      {state.contrasts.map((background) => {
        const ratio = getContrastRatio(color, background.color) ?? 1;

        return (
          <p key={background.name} className="flex justify-between gap-2">
            <span>On {background.name}</span>
            <span className="tabular-nums">
              {ratio.toFixed(2)}:1 · {ratio >= 4.5 ? "Pass" : "Fail"}
            </span>
          </p>
        );
      })}
    </div>
  );
}

type renderColorPickerBackgroundPreviewPart7Args = {
  state: ReturnType<typeof useColorPickerActions>;
};

function renderColorPickerBackgroundPreviewPart7({
  state,
}: renderColorPickerBackgroundPreviewPart7Args) {
  return (
    <div
      data-slot="color-picker-background-preview"
      className="grid grid-cols-2 overflow-hidden rounded-md border"
    >
      {state.contrasts.map((background) => (
        <div
          key={background.name}
          className="p-3 text-center text-sm"
          style={{
            backgroundColor: background.color,
            color: state.canonical,
          }}
        >
          Text sample
        </div>
      ))}
    </div>
  );
}

type renderKiraColorPickerTextPreviewPart8Args = {
  state: ReturnType<typeof useKiraColorPickerState4>;
};

function renderKiraColorPickerTextPreviewPart8({
  state,
}: renderKiraColorPickerTextPreviewPart8Args) {
  const background = state.backgroundColor;

  if (!background) return null;

  return (
    <div
      data-slot="kira-color-picker-text-preview"
      className="rounded-md border p-4"
      style={{
        backgroundColor: formatColor(background, "hex"),
        color: state.canonical,
      }}
    >
      <span
        className={cn(
          "block",
          state.textSize === "large" ? "text-2xl" : "text-sm",
        )}
      >
        The next chapter starts here.
      </span>
    </div>
  );
}

type renderBuildContrastSectionPart9Args = {
  state: ReturnType<typeof useKiraColorPickerState4>;
};

function renderBuildContrastSectionPart9({
  state,
}: renderBuildContrastSectionPart9Args) {
  const { change, report } = state;

  const suggestion = state.suggestion;

  if (!suggestion) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={state.disabled || state.readOnly}
      onClick={() => {
        change(colorValue(suggestion));
        report(
          "Suggested color applied for this background and text category.",
        );
      }}
    >
      Use accessible suggestion
    </Button>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const USE_COLOR_PICKER_SETUP_DEFAULTS_1 = {
  defaultValue: "#3b82f6",
  swatches: [],
  hideContrastRatio: false,
  hideDefaultSwatches: false,
  showAlpha: false,
  showHarmonies: false,
  showBackgroundPreview: false,
  showCopyButton: true,
  defaultOpen: false,
  disabled: false,
  readOnly: false,
  required: false,
  invalid: false,
  label: "Color",
  announceFeedback: true,
} as const;

// SAFETY: This immutable list names the composition props removed from the native root.
const USE_COLOR_PICKER_SETUP_COMPOSITION_KEYS_1 = [
  "value",
  "defaultValue",
  "format",
  "defaultFormat",
  "type",
  "onFormatChange",
  "size",
  "swatches",
  "hideContrastRatio",
  "hideDefaultSwatches",
  "showAlpha",
  "defaultAlpha",
  "showHarmonies",
  "showBackgroundPreview",
  "showCopyButton",
  "onValueChange",
  "open",
  "defaultOpen",
  "onOpenChange",
  "children",
  "disabled",
  "disabledReason",
  "readOnly",
  "name",
  "required",
  "invalid",
  "error",
  "label",
  "contentClassName",
  "onError",
  "onFeedback",
  "announceFeedback",
  "className",
] as const;

// SAFETY: This immutable list names the composition props removed from the native root.
const USE_KIRA_COLOR_PICKER_SETUP_COMPOSITION_KEYS_2 = [
  "background",
  "textSize",
  "contrastLevel",
  "showAccessibleSuggestion",
  "tokenName",
  "showTokenPreview",
  "copyText",
  "value",
  "defaultValue",
  "defaultAlpha",
  "format",
  "defaultFormat",
  "type",
  "onFormatChange",
  "onValueChange",
  "onFeedback",
  "onError",
  "disabled",
  "readOnly",
  "className",
  "size",
] as const;

type resolverenderRenderColorPickerSectionPart2Choice1Args = {
  state: ReturnType<typeof useColorPickerActions>;
};

function resolverenderRenderColorPickerSectionPart2Choice1({
  state,
}: resolverenderRenderColorPickerSectionPart2Choice1Args) {
  if (state.size === "sm") {
    return "size-7";
  }

  if (state.size === "lg") {
    return "size-9";
  }

  return "size-8";
}

type colorPickerValidationMessageArgs = {
  state: ReturnType<typeof useColorPickerSetup>;
  externalInvalid: boolean;
  requiredError: boolean;
};

function colorPickerValidationMessage({
  state,
  externalInvalid,
  requiredError,
}: colorPickerValidationMessageArgs) {
  return (
    state.error ||
    resolvecolorpickertsxChoice1({ externalInvalid, requiredError })
  );
}

type reportColorCopyErrorArgs = {
  mountedRef: ReturnType<typeof useColorPickerState3>["mountedRef"];
  generation: number;
  copyGenerationRef: ReturnType<
    typeof useColorPickerState3
  >["copyGenerationRef"];
  setCopyState: ReturnType<typeof useColorPickerState3>["setCopyState"];
  report: ReturnType<typeof useColorPickerState3>["report"];
  onError: ReturnType<typeof useColorPickerState3>["onError"];
};

function reportColorCopyError({
  mountedRef,
  generation,
  copyGenerationRef,
  setCopyState,
  report,
  onError,
}: reportColorCopyErrorArgs) {
  if (!mountedRef.current || generation !== copyGenerationRef.current) return;

  const message = "Could not copy. Select the color text and copy it manually.";

  setCopyState("error");
  report(message);
  onError?.({ type: "clipboard", message });
}

type reportScreenColorErrorArgs = {
  mountedRef: ReturnType<typeof useColorPickerState3>["mountedRef"];
  eyeAbortRef: ReturnType<typeof useColorPickerState3>["eyeAbortRef"];
  controller: AbortController;
  cause: unknown;
  report: ReturnType<typeof useColorPickerState3>["report"];
  onError: ReturnType<typeof useColorPickerState3>["onError"];
};

function reportScreenColorError({
  mountedRef,
  eyeAbortRef,
  controller,
  cause,
  report,
  onError,
}: reportScreenColorErrorArgs) {
  if (!mountedRef.current || eyeAbortRef.current !== controller) return;

  if (
    controller.signal.aborted ||
    (cause instanceof DOMException && cause.name === "AbortError")
  )
    report("Screen selection cancelled.");
  else {
    const message =
      "Screen selection failed. Enter a color or use the sliders.";

    report(message);
    onError?.({ type: "eyedropper", message });
  }
}

type reportTokenCopyErrorArgs = {
  mountedRef: ReturnType<typeof useKiraColorPickerState2>["mountedRef"];
  controller: AbortController;
  operationRef: ReturnType<typeof useKiraColorPickerState2>["operationRef"];
  cause: unknown;
  setCopyState: ReturnType<typeof useKiraColorPickerState2>["setCopyState"];
  kind: ColorCopyKind;
  report: ReturnType<typeof useKiraColorPickerState2>["report"];
  onError: ReturnType<typeof useKiraColorPickerState2>["onError"];
};

function reportTokenCopyError({
  mountedRef,
  controller,
  operationRef,
  cause,
  setCopyState,
  kind,
  report,
  onError,
}: reportTokenCopyErrorArgs) {
  if (
    !mountedRef.current ||
    controller.signal.aborted ||
    operationRef.current !== controller
  )
    return;

  const message =
    cause instanceof Error
      ? cause.message
      : "Copy failed. Retry or select the token text and copy it manually.";

  setCopyState({ status: "error", kind, message });
  report(message);
  onError?.({ type: "clipboard", message });
}

type accessibleColorSuggestionArgs = {
  showAccessibleSuggestion: boolean;
  color: HsvaColor | null;
  ratio: number | null;
  passes: boolean;
  componentProps: KiraColorPickerProps;
  target: number;
};

function accessibleColorSuggestion({
  showAccessibleSuggestion,
  color,
  ratio,
  passes,
  componentProps,
  target,
}: accessibleColorSuggestionArgs) {
  return showAccessibleSuggestion && color && ratio !== null && !passes
    ? findAccessibleColor(color, componentProps.background, target)
    : null;
}

type resolverenderColorPickerChoice10Args = {
  state: ReturnType<typeof useColorPickerActions>;
};

function resolverenderColorPickerChoice10({
  state,
}: resolverenderColorPickerChoice10Args) {
  if (state.errorText) {
    return state.id + "-error";
  }

  if (state.disabledReason) {
    return state.id + "-reason";
  }

  return undefined;
}

type resolverenderColorPickerChoice11Args = {
  state: ReturnType<typeof useColorPickerActions>;
};

function resolverenderColorPickerChoice11({
  state,
}: resolverenderColorPickerChoice11Args) {
  return resolverenderColorPickerChoice10({ state });
}

type resolverenderColorPickerChoice12Args = {
  state: ReturnType<typeof useColorPickerActions>;
};

function resolverenderColorPickerChoice12({
  state,
}: resolverenderColorPickerChoice12Args) {
  if (state.size === "sm") {
    return "sm";
  }

  if (state.size === "lg") {
    return "lg";
  }

  return "default";
}

type createColorCopyActionArgs = {
  state: ReturnType<typeof useColorPickerState3>;
  copyGenerationRef: ReturnType<
    typeof useColorPickerState3
  >["copyGenerationRef"];
  setCopyState: ReturnType<typeof useColorPickerState3>["setCopyState"];
  report: ReturnType<typeof useColorPickerState3>["report"];
  mountedRef: ReturnType<typeof useColorPickerState3>["mountedRef"];
  feedbackTimerRef: ReturnType<typeof useColorPickerState3>["feedbackTimerRef"];
  onError: ReturnType<typeof useColorPickerState3>["onError"];
};

function createColorCopyAction({
  state,
  copyGenerationRef,
  setCopyState,
  report,
  mountedRef,
  feedbackTimerRef,
  onError,
}: createColorCopyActionArgs) {
  return async () => {
    if (!canStartColorCopy(state)) return;
    const generation = ++copyGenerationRef.current;
    setCopyState("pending");
    report("Copying color…");

    try {
      const text = await state.picker.copyToClipboard(state.colorFormat);

      if (!isColorCopyCurrent(mountedRef, generation, copyGenerationRef))
        return;
      setCopyState("success");
      report("Copied " + text + ".");

      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      return reportColorCopyError({
        mountedRef,
        generation,
        copyGenerationRef,
        setCopyState,
        report,
        onError,
      });
    }
  };
}

function canStartColorCopy(state: ReturnType<typeof useColorPickerState3>) {
  return !state.disabled && state.hasValue && state.copyState !== "pending";
}

function isColorCopyCurrent(
  mountedRef: React.RefObject<boolean>,
  generation: number,
  copyGenerationRef: React.RefObject<number>,
) {
  return mountedRef.current && generation === copyGenerationRef.current;
}

type createScreenColorActionArgs = {
  state: ReturnType<typeof useColorPickerState3>;
  eyeAbortRef: ReturnType<typeof useColorPickerState3>["eyeAbortRef"];
  setEyePending: ReturnType<typeof useColorPickerState3>["setEyePending"];
  report: ReturnType<typeof useColorPickerState3>["report"];
  mountedRef: ReturnType<typeof useColorPickerState3>["mountedRef"];
  commitScreenColorRef: ReturnType<
    typeof useColorPickerState3
  >["commitScreenColorRef"];
  onError: ReturnType<typeof useColorPickerState3>["onError"];
};

function createScreenColorAction({
  state,
  eyeAbortRef,
  setEyePending,
  report,
  mountedRef,
  commitScreenColorRef,
  onError,
}: createScreenColorActionArgs) {
  return async () => {
    const Constructor = eyeDropperConstructor();

    if (!Constructor || !isScreenColorSelectionAllowed(Constructor, state))
      return;
    const controller = new AbortController();
    eyeAbortRef.current = controller;
    setEyePending(true);
    report("Choose a color on screen. Escape cancels.");

    try {
      const result = await new Constructor().open({
        signal: controller.signal,
      });

      if (!isScreenColorOperationCurrent(mountedRef, eyeAbortRef, controller))
        return;
      const color = parseColor(result.sRGBHex);

      if (!color) throw new Error("The screen color could not be read.");
      commitScreenColorRef.current(color);
    } catch (cause) {
      return reportScreenColorError({
        mountedRef,
        eyeAbortRef,
        controller,
        cause,
        report,
        onError,
      });
    } finally {
      finishScreenColorOperation(
        eyeAbortRef,
        controller,
        mountedRef,
        setEyePending,
      );
    }
  };
}

function isScreenColorSelectionAllowed(
  Constructor: ReturnType<typeof eyeDropperConstructor>,
  state: ReturnType<typeof useColorPickerState3>,
) {
  return !!Constructor && state.screenSelectionEnabled && !state.eyePending;
}

function isScreenColorOperationCurrent(
  mountedRef: React.RefObject<boolean>,
  eyeAbortRef: React.RefObject<AbortController | null>,
  controller: AbortController,
) {
  return (
    mountedRef.current &&
    !controller.signal.aborted &&
    eyeAbortRef.current === controller
  );
}

function finishScreenColorOperation(
  eyeAbortRef: React.RefObject<AbortController | null>,
  controller: AbortController,
  mountedRef: React.RefObject<boolean>,
  setEyePending: (pending: boolean) => void,
) {
  if (eyeAbortRef.current !== controller) return;
  eyeAbortRef.current = null;

  if (mountedRef.current) setEyePending(false);
}
