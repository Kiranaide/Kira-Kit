/* kira-kit-ignore-file raw-colors: default colour value and white/black contrast constants are colour data, not theme styling */
import * as React from "react";
import { hsvaToHex, hsvaToHexa, type HsvaColor } from "@uiw/color-convert";
import {
  colorValue,
  formatColor,
  generateHarmonies,
  getContrastRatio,
  initialColor,
  parseColor,
  type ColorFormat,
  type ColorHarmony,
  type ColorInput,
  type ColorPickerValue,
} from "@/lib/color-picker";

export interface UseColorPickerOptions {
  value?: ColorInput;
  defaultValue?: ColorInput;
  onValueChange?: (value: ColorPickerValue) => void;
  showAlpha?: boolean;
  defaultAlpha?: number;
  maxRecentColors?: number;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface UseColorPickerReturn {
  colorHsv: HsvaColor;
  alpha: number;
  recentColors: string[];
  harmonies: ColorHarmony[];
  setColor: (color: HsvaColor, newAlpha?: number) => void;
  setColorFromHex: (hex: string) => void;
  setAlpha: (alpha: number) => void;
  addRecentColor: (hex: string) => void;
  clearRecentColors: () => void;
  reset: () => void;
  copyToClipboard: (format: ColorFormat) => Promise<string>;
  formatValue: (format: ColorFormat) => string;
  contrast: { light: number; dark: number; aa: boolean; aaa: boolean };
}

export function useColorPicker({
  value,
  defaultValue = "#3b82f6",
  onValueChange,
  showAlpha = false,
  defaultAlpha,
  maxRecentColors = 8,
  disabled = false,
  readOnly = false,
}: UseColorPickerOptions = {}): UseColorPickerReturn {
  const initial = () => initialColor(defaultValue, defaultAlpha);
  const [internal, setInternal] = React.useState<HsvaColor>(initial);
  const [recentColors, setRecentColors] = React.useState<string[]>([]);

  const colorHsv =
    value === undefined ? internal : (parseColor(value) ?? internal);

  const limit = recentColorLimit(maxRecentColors);

  const addRecentColor = React.useCallback(
    (input: string) => rememberColor({ setRecentColors, limit }, input),
    [limit],
  );

  const setColor = React.useCallback(
    (next: HsvaColor, alpha?: number) =>
      commitColor(
        {
          disabled,
          readOnly,
          value,
          setInternal,
          addRecentColor,
          onValueChange,
        },
        next,
        alpha,
      ),
    [addRecentColor, disabled, onValueChange, readOnly, value],
  );

  const setColorFromHex = React.useCallback(
    (input: string) => {
      const parsed = parseColor(input);

      if (parsed) setColor(parsed);
    },
    [setColor],
  );

  const setAlpha = React.useCallback(
    (alpha: number) => setColor(colorHsv, alpha),
    [colorHsv, setColor],
  );

  const clearRecentColors = React.useCallback(() => setRecentColors([]), []);

  const reset = () => {
    if (value === undefined) setInternal(initial());
    setRecentColors([]);
  };

  const formatValue = React.useCallback(
    (format: ColorFormat) =>
      formatColor(colorHsv, format, showAlpha || colorHsv.a < 1),
    [colorHsv, showAlpha],
  );

  const copyToClipboard = React.useCallback(
    async (format: ColorFormat) => copyColor({ formatValue }, format),
    [formatValue],
  );

  return {
    colorHsv,
    alpha: colorHsv.a,
    recentColors,
    harmonies: generateHarmonies(colorHsv),
    setColor,
    setColorFromHex,
    setAlpha,
    addRecentColor,
    clearRecentColors,
    reset,
    copyToClipboard,
    formatValue,
    contrast: colorContrast(colorHsv),
  };
}

export type { ColorHarmony, ColorPickerValue };

function recentColorLimit(requested: number) {
  return Math.max(
    0,
    Math.min(24, Number.isFinite(requested) ? Math.floor(requested) : 8),
  );
}

function colorContrast(color: HsvaColor): UseColorPickerReturn["contrast"] {
  const light = getContrastRatio(color, "#ffffff") ?? 1;
  const dark = getContrastRatio(color, "#000000") ?? 1;

  return {
    light,
    dark,
    aa: light >= 4.5 && dark >= 4.5,
    aaa: light >= 7 && dark >= 7,
  };
}

interface RememberColorContext {
  setRecentColors: React.Dispatch<React.SetStateAction<string[]>>;
  limit: number;
}

function rememberColor(
  { setRecentColors, limit }: RememberColorContext,
  input: string,
): void {
  const parsed = parseColor(input);

  if (!parsed) return;
  const hex = parsed.a < 1 ? hsvaToHexa(parsed) : hsvaToHex(parsed);
  setRecentColors((previous) =>
    [
      hex,
      ...previous.filter((item) => item.toLowerCase() !== hex.toLowerCase()),
    ].slice(0, limit),
  );
}

interface CommitColorContext {
  disabled: boolean;
  readOnly: boolean;
  value: ColorInput | undefined;
  setInternal: React.Dispatch<React.SetStateAction<HsvaColor>>;
  addRecentColor: (input: string) => void;
  onValueChange: ((value: ColorPickerValue) => void) | undefined;
}

function commitColor(
  {
    disabled,
    readOnly,
    value,
    setInternal,
    addRecentColor,
    onValueChange,
  }: CommitColorContext,
  next: HsvaColor,
  alpha?: number,
): void {
  if (disabled || readOnly) return;

  const parsed = parseColor(alpha === undefined ? next : { ...next, a: alpha });

  if (!parsed) return;

  if (value === undefined) setInternal(parsed);
  addRecentColor(parsed.a < 1 ? hsvaToHexa(parsed) : hsvaToHex(parsed));
  onValueChange?.(colorValue(parsed));
}

interface CopyColorContext {
  formatValue: (format: ColorFormat) => string;
}

async function copyColor(
  { formatValue }: CopyColorContext,
  format: ColorFormat,
): Promise<string> {
  const text = formatValue(format);

  if (typeof navigator === "undefined" || !navigator.clipboard)
    throw new Error(
      "Clipboard access is unavailable. Select and copy the color text.",
    );
  await navigator.clipboard.writeText(text);

  return text;
}
