"use client";

import * as React from "react";
import {
  type HexColor,
  hexToHsva,
  type HslaColor,
  type HsvaColor,
  hsvaToHex,
  hsvaToHsla,
  hsvaToRgba,
  type RgbaColor,
  rgbaToHsva,
  hsvaToHexa,
} from "@uiw/color-convert";
import { type ColorHarmony } from "@/components/ui/color-picker";

export type ColorPickerValue = {
  hex: string;
  hexa: string;
  hsl: HslaColor;
  rgb: RgbaColor;
  hsv: HsvaColor;
};

function hslaToHsva(color: HslaColor): HsvaColor {
  const h = color.h;
  const s = color.s / 100;
  const l = color.l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const maxVal = Math.max(r, g, b);
  return {
    h,
    s: Math.round(r * 100),
    v: Math.round((maxVal + m) * 100),
    a: 1,
  };
}

function generateHarmonies(hsva: HsvaColor): ColorHarmony[] {
  const baseHex = hsvaToHex(hsva);
  const hsl = hsvaToHsla(hsva);

  const hexFromHSL = (h: number, s: number, l: number): string => {
    const result = hslaToHsva({ h, s, l, a: 1 });
    return hsvaToHex(result);
  };

  return [
    {
      name: "Complementary",
      colors: [baseHex, hexFromHSL((hsl.h + 180) % 360, hsl.s, hsl.l)],
    },
    {
      name: "Analogous",
      colors: [
        hexFromHSL((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
        baseHex,
        hexFromHSL((hsl.h + 30) % 360, hsl.s, hsl.l),
      ],
    },
    {
      name: "Triadic",
      colors: [
        baseHex,
        hexFromHSL((hsl.h + 120) % 360, hsl.s, hsl.l),
        hexFromHSL((hsl.h + 240) % 360, hsl.s, hsl.l),
      ],
    },
    {
      name: "Monochromatic",
      colors: [
        hexFromHSL(hsl.h, hsl.s, Math.min(hsl.l + 30, 95)),
        hexFromHSL(hsl.h, hsl.s, hsl.l),
        hexFromHSL(hsl.h, hsl.s, Math.max(hsl.l - 20, 10)),
        hexFromHSL(hsl.h, hsl.s, Math.max(hsl.l - 40, 5)),
      ],
    },
  ];
}

export interface UseColorPickerOptions {
  value?: `#${string}` | HsvaColor | HslaColor | RgbaColor;
  defaultValue?: `#${string}` | HsvaColor | HslaColor | RgbaColor;
  onValueChange?: (value: ColorPickerValue) => void;
  showAlpha?: boolean;
  defaultAlpha?: number;
  maxRecentColors?: number;
}

export interface UseColorPickerReturn {
  colorHsv: HsvaColor;
  alpha: number;
  recentColors: HexColor[];
  harmonies: ColorHarmony[];
  setColor: (color: HsvaColor, newAlpha?: number) => void;
  setColorFromHex: (hex: string) => void;
  setAlpha: (alpha: number) => void;
  addRecentColor: (hex: string) => void;
  clearRecentColors: () => void;
  copyToClipboard: (format: "hex" | "hexa" | "rgb" | "hsl") => Promise<string>;
  formatValue: (format: "hex" | "hexa" | "rgb" | "hsl") => string;
  contrast: {
    light: number;
    dark: number;
    aa: boolean;
    aaa: boolean;
  };
}

export function useColorPicker(options: UseColorPickerOptions = {}): UseColorPickerReturn {
  const {
    value,
    defaultValue = "#3b82f6",
    onValueChange,
    showAlpha = false,
    defaultAlpha = 1,
    maxRecentColors = 8,
  } = options;

  const [colorHsv, setColorHsv] = React.useState<HsvaColor>(() => {
    if (value) {
      if (typeof value === "string") {
        return hexToHsva(value);
      } else if ("h" in value && "s" in value && "v" in value) {
        return value;
      } else if ("r" in value) {
        return rgbaToHsva(value);
      } else {
        return hslaToHsva({ ...value, a: 1 });
      }
    }
    if (typeof defaultValue === "string") {
      return hexToHsva(defaultValue);
    } else if ("h" in defaultValue && "s" in defaultValue && "v" in defaultValue) {
      return defaultValue;
    } else if ("r" in defaultValue) {
      return rgbaToHsva(defaultValue);
    }
    return hslaToHsva({ ...defaultValue, a: 1 });
  });

  const [alpha, setAlphaState] = React.useState(defaultAlpha);
  const [recentColors, setRecentColors] = React.useState<HexColor[]>([]);

  const harmonies = React.useMemo(() => generateHarmonies(colorHsv), [colorHsv]);

  React.useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        setColorHsv(hexToHsva(value));
      } else if ("h" in value && "s" in value && "v" in value) {
        setColorHsv(value);
      } else if ("r" in value) {
        setColorHsv(rgbaToHsva(value));
      } else {
        setColorHsv(hslaToHsva({ ...value, a: 1 }));
      }
    }
  }, [value]);

  const setColor = React.useCallback(
    (color: HsvaColor, newAlpha?: number) => {
      const finalAlpha = newAlpha !== undefined ? newAlpha : alpha;
      setColorHsv(color);
      const hexColor = hsvaToHex(color);
      setRecentColors((prev) => {
        const filtered = prev.filter(
          (c) => c.toLowerCase() !== hexColor.toLowerCase()
        );
        return [hexColor as HexColor, ...filtered].slice(0, maxRecentColors);
      });
      onValueChange?.({
        hex: hexColor,
        hexa: hsvaToHexa({ ...color, a: finalAlpha }),
        hsl: hsvaToHsla(color),
        rgb: hsvaToRgba(color),
        hsv: color,
      });
    },
    [alpha, maxRecentColors, onValueChange]
  );

  const setColorFromHex = React.useCallback(
    (hex: string) => {
      try {
        const newColor = hexToHsva(hex);
        setColor(newColor);
      } catch {
        console.error("Invalid hex color:", hex);
      }
    },
    [setColor]
  );

  const setAlpha = React.useCallback(
    (newAlpha: number) => {
      setAlphaState(newAlpha);
      setColor(colorHsv, newAlpha);
    },
    [colorHsv, setColor]
  );

  const addRecentColor = React.useCallback(
    (hex: string) => {
      setRecentColors((prev) => {
        const filtered = prev.filter(
          (c) => c.toLowerCase() !== hex.toLowerCase()
        );
        return [hex as HexColor, ...filtered].slice(0, maxRecentColors);
      });
    },
    [maxRecentColors]
  );

  const clearRecentColors = React.useCallback(() => {
    setRecentColors([]);
  }, []);

  const copyToClipboard = React.useCallback(
    async (format: "hex" | "hexa" | "rgb" | "hsl"): Promise<string> => {
      const rgb = hsvaToRgba(colorHsv);
      const hsl = hsvaToHsla(colorHsv);
      const hexColor = hsvaToHex(colorHsv);
      const hexaColor = hsvaToHexa({ ...colorHsv, a: alpha });

      let colorValue: string;
      switch (format) {
        case "hexa":
          colorValue = hexaColor;
          break;
        case "rgb":
          colorValue = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
          break;
        case "hsl":
          colorValue = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
          break;
        default:
          colorValue = showAlpha ? hexaColor : hexColor;
      }

      await navigator.clipboard.writeText(colorValue);
      return colorValue;
    },
    [colorHsv, alpha, showAlpha]
  );

  const formatValue = React.useCallback(
    (format: "hex" | "hexa" | "rgb" | "hsl"): string => {
      const rgb = hsvaToRgba(colorHsv);
      const hsl = hsvaToHsla(colorHsv);
      const hexColor = hsvaToHex(colorHsv);
      const hexaColor = hsvaToHexa({ ...colorHsv, a: alpha });

      switch (format) {
        case "hexa":
          return hexaColor;
        case "rgb":
          return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        case "hsl":
          return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
        default:
          return showAlpha ? hexaColor : hexColor;
      }
    },
    [colorHsv, alpha, showAlpha]
  );

  const contrast = React.useMemo(() => {
    const rgb = hsvaToRgba(colorHsv);
    const effectiveAlpha = alpha < 1;
    const bgRgb = effectiveAlpha ? { r: 255, g: 255, b: 255 } : rgb;

    const blendedRgb = effectiveAlpha
      ? {
          r: Math.round(rgb.r * alpha + bgRgb.r * (1 - alpha)),
          g: Math.round(rgb.g * alpha + bgRgb.g * (1 - alpha)),
          b: Math.round(rgb.b * alpha + bgRgb.b * (1 - alpha)),
        }
      : rgb;

    const toSRGB = (c: number) => {
      const channel = c / 255;
      return channel <= 0.03928
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    };

    const r = toSRGB(blendedRgb.r);
    const g = toSRGB(blendedRgb.g);
    const b = toSRGB(blendedRgb.b);

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    const darkModeRatio = (1.0 + 0.05) / (luminance + 0.05);
    const lightModeRatio = (luminance + 0.05) / 0.05;

    return {
      light: Number(lightModeRatio.toFixed(2)),
      dark: Number(darkModeRatio.toFixed(2)),
      aa: lightModeRatio > 4.5 && darkModeRatio > 4.5,
      aaa: lightModeRatio > 7 && darkModeRatio > 7,
    };
  }, [colorHsv, alpha]);

  return {
    colorHsv,
    alpha,
    recentColors,
    harmonies,
    setColor,
    setColorFromHex,
    setAlpha,
    addRecentColor,
    clearRecentColors,
    copyToClipboard,
    formatValue,
    contrast,
  };
}

export type { ColorHarmony };
