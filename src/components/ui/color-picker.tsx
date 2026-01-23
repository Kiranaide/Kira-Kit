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
import Hue from "@uiw/react-color-hue";
import Saturation from "@uiw/react-color-saturation";
import {
  IconCheck,
  IconChevronDown,
  IconX,
  IconColorPicker,
  IconCopy,
  IconCopyCheck,
  IconRefresh,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function getColorAsHsva(
  color: `#${string}` | HsvaColor | HslaColor | RgbaColor
): HsvaColor {
  if (typeof color === "string") {
    return hexToHsva(color);
  } else if ("h" in color && "s" in color && "v" in color) {
    return color;
  } else if ("r" in color) {
    return rgbaToHsva(color);
  } else {
    return hslaToHsva({ ...color, a: 1 });
  }
}

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

type OklchColor = {
  l: number;
  c: number;
  h: number;
};


function rgbaToOklch(rgb: RgbaColor): OklchColor {

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;


  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);


  const lLms = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const mLms = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const sLms = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;


  const lCbrt = Math.cbrt(lLms);
  const mCbrt = Math.cbrt(mLms);
  const sCbrt = Math.cbrt(sLms);


  const L = 0.2104542553 * lCbrt + 0.793617785 * mCbrt - 0.0040720468 * sCbrt;
  const a = 1.9779984951 * lCbrt - 2.428592205 * mCbrt + 0.4505937099 * sCbrt;
  const bVal =
    0.0259040371 * lCbrt + 0.7827717662 * mCbrt - 0.808675766 * sCbrt;


  const c = Math.sqrt(a * a + bVal * bVal);
  let h = Math.atan2(bVal, a) * (180 / Math.PI);
  if (h < 0) h += 360;

  return {
    l: Math.round(L * 100) / 100,
    c: Math.round(c * 1000) / 1000,
    h: Math.round(h * 10) / 10,
  };
}


function oklchToRgba(oklch: OklchColor): RgbaColor {
  const { l: L, c, h } = oklch;


  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);


  const lCbrt = L + 0.3963377774 * a + 0.2158037573 * b;
  const mCbrt = L - 0.1055613458 * a - 0.0638541728 * b;
  const sCbrt = L - 0.0894841775 * a - 1.291485548 * b;

  const lLms = lCbrt * lCbrt * lCbrt;
  const mLms = mCbrt * mCbrt * mCbrt;
  const sLms = sCbrt * sCbrt * sCbrt;


  const lr = 4.0767416621 * lLms - 3.3077115913 * mLms + 0.2309699292 * sLms;
  const lg = -1.2684380046 * lLms + 2.6097574011 * mLms - 0.3413193965 * sLms;
  const lb = -0.0041960863 * lLms - 0.7034186147 * mLms + 1.707614701 * sLms;


  const toSrgb = (c: number) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

  return {
    r: Math.max(0, Math.min(255, Math.round(toSrgb(lr) * 255))),
    g: Math.max(0, Math.min(255, Math.round(toSrgb(lg) * 255))),
    b: Math.max(0, Math.min(255, Math.round(toSrgb(lb) * 255))),
    a: 1,
  };
}

type ColorPickerValue = {
  hex: string;
  hexa: string;
  hsl: HslaColor;
  rgb: RgbaColor;
  hsv: HsvaColor;
  oklch: OklchColor;
};

type ColorHarmony = {
  name: string;
  colors: string[];
};

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

type ColorPickerProps = {
  value?: `#${string}` | HsvaColor | HslaColor | RgbaColor;
  defaultValue?: `#${string}` | HsvaColor | HslaColor | RgbaColor;

  type?: "hex" | "hsl" | "rgb" | "hexa" | "oklch";

  format?: "hex" | "hsl" | "rgb" | "hexa" | "oklch";

  size?: "sm" | "default" | "lg";
  swatches?: HexColor[];
  hideContrastRatio?: boolean;
  hideDefaultSwatches?: boolean;
  showAlpha?: boolean;
  defaultAlpha?: number;
  showHarmonies?: boolean;
  showBackgroundPreview?: boolean;
  className?: string;
  onValueChange?: (value: ColorPickerValue) => void;

  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  onError?: (error: { type: "invalid" | "format"; message: string }) => void;
};

function ColorPicker({
  value,
  defaultValue = "#3b82f6",
  children,
  type,
  format,
  size = "default",
  swatches = [],
  hideContrastRatio = false,
  hideDefaultSwatches = false,
  showAlpha = false,
  defaultAlpha = 1,
  showHarmonies = false,
  showBackgroundPreview = false,
  onValueChange,
  onOpenChange,
  className,
  disabled,
  name,
  required,
  onBlur,
  onFocus,
  onError,
}: ColorPickerProps) {

  const initialFormat = format ?? type ?? "hex";
  const [colorType, setColorType] = React.useState<
    "hex" | "hsl" | "rgb" | "hexa" | "oklch"
  >(initialFormat);
  const [colorHsv, setColorHsv] = React.useState<HsvaColor>(
    value ? getColorAsHsva(value) : getColorAsHsva(defaultValue)
  );
  const [alpha, setAlpha] = React.useState(defaultAlpha);
  const [isOpen, setIsOpen] = React.useState(false);
  const [showTypeMenu, setShowTypeMenu] = React.useState(false);
  const [recentColors, setRecentColors] = React.useState<HexColor[]>([]);
  const [copied, setCopied] = React.useState(false);
  const [eyedropperSupported, setEyedropperSupported] = React.useState(false);
  const [inputError, setInputError] = React.useState<string | null>(null);

  const saturationRef = React.useRef<HTMLDivElement>(null);
  const hueRef = React.useRef<HTMLDivElement>(null);
  const announcementTimeoutRef = React.useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);
  const [announcement, setAnnouncement] = React.useState("");


  const sizeClasses = {
    sm: { swatch: "h-6 w-6", input: "w-20 text-xs" },
    default: { swatch: "h-8 w-8", input: "w-24" },
    lg: { swatch: "h-10 w-10", input: "w-28 text-base" },
  };
  const currentSize = sizeClasses[size];

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const win = window as Window & {
      EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
    };
    setEyedropperSupported(typeof win.EyeDropper !== "undefined");
  }, []);

  React.useEffect(() => {
    if (value) {
      setColorHsv(getColorAsHsva(value));
    }
  }, [value]);

  const handleValueChange = (color: HsvaColor, newAlpha?: number) => {
    setColorHsv(color);
    const hexColor = hsvaToHex(color);
    const finalAlpha = newAlpha !== undefined ? newAlpha : alpha;

    setRecentColors((prev) => {
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== hexColor.toLowerCase()
      );
      return [hexColor as HexColor, ...filtered].slice(0, 8);
    });

    setInputError(null);
    const rgb = hsvaToRgba(color);
    onValueChange?.({
      hex: hexColor,
      hexa: hsvaToHexa({ ...color, a: finalAlpha }),
      hsl: hsvaToHsla(color),
      rgb,
      hsv: color,
      oklch: rgbaToOklch(rgb),
    });


    if (announcementTimeoutRef.current) {
      clearTimeout(announcementTimeoutRef.current);
    }
    announcementTimeoutRef.current = setTimeout(() => {
      setAnnouncement(`Color changed to ${hexColor}`);
    }, 500);
  };

  const handleAlphaChange = (newAlpha: number) => {
    setAlpha(newAlpha);
    handleValueChange(colorHsv, newAlpha);
  };

  const handleEyedropper = async () => {
    if (!eyedropperSupported || typeof window === "undefined") return;

    try {
      const win = window as Window & {
        EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
      };
      if (!win.EyeDropper) return;
      const eyeDropper = new win.EyeDropper();
      const result = await eyeDropper.open();
      const newColor = hexToHsva(result.sRGBHex);
      handleValueChange(newColor);
    } catch {
      console.log("Eyedropper cancelled");
    }
  };

  const handleCopy = async () => {
    const rgb = hsvaToRgba(colorHsv);
    const hsl = hsvaToHsla(colorHsv);
    const hexColor = hsvaToHex(colorHsv);
    const hexaColor = hsvaToHexa({ ...colorHsv, a: alpha });

    let colorValue: string;
    switch (colorType) {
      case "hexa":
        colorValue = hexaColor;
        break;
      case "rgb":
        colorValue = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        break;
      case "hsl":
        colorValue = `hsl(${Math.round(hsl.h)}, ${Math.round(
          hsl.s
        )}%, ${Math.round(hsl.l)}%)`;
        break;
      default:
        colorValue = showAlpha ? hexaColor : hexColor;
    }

    try {
      await navigator.clipboard.writeText(colorValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  const handleSaturationKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        handleValueChange({ ...colorHsv, s: Math.min(100, colorHsv.s + step) });
        break;
      case "ArrowLeft":
        e.preventDefault();
        handleValueChange({ ...colorHsv, s: Math.max(0, colorHsv.s - step) });
        break;
      case "ArrowDown":
        e.preventDefault();
        handleValueChange({ ...colorHsv, v: Math.max(0, colorHsv.v - step) });
        break;
      case "ArrowUp":
        e.preventDefault();
        handleValueChange({ ...colorHsv, v: Math.min(100, colorHsv.v + step) });
        break;
      case "Home":
        e.preventDefault();
        handleValueChange({ ...colorHsv, s: 0, v: 0 });
        break;
      case "End":
        e.preventDefault();
        handleValueChange({ ...colorHsv, s: 100, v: 100 });
        break;
    }
  };

  const handleHueKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 15 : 1;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        handleValueChange({ ...colorHsv, h: (colorHsv.h + step) % 360 });
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        handleValueChange({ ...colorHsv, h: (colorHsv.h - step + 360) % 360 });
        break;
      case "Home":
        e.preventDefault();
        handleValueChange({ ...colorHsv, h: 0 });
        break;
      case "End":
        e.preventDefault();
        handleValueChange({ ...colorHsv, h: 359 });
        break;
    }
  };

  const handleAlphaKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.01;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        handleAlphaChange(Math.min(1, alpha + step));
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        handleAlphaChange(Math.max(0, alpha - step));
        break;
      case "Home":
        e.preventDefault();
        handleAlphaChange(0);
        break;
      case "End":
        e.preventDefault();
        handleAlphaChange(1);
        break;
    }
  };

  const handleSwatchKeyDown = (e: React.KeyboardEvent, color: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleValueChange(hexToHsva(color));
    }
  };

  const harmonies = React.useMemo(
    () => generateHarmonies(colorHsv),
    [colorHsv]
  );

  const defaultSwatches: HexColor[] = [
    "#F8371A",
    "#F97C1B",
    "#FAC81C",
    "#3FD0B6",
    "#2CADF6",
    "#6462FC",
  ];
  const allSwatches = hideDefaultSwatches
    ? swatches
    : [...defaultSwatches, ...swatches];

  const formatColorValue = (): string => {
    const hexColor = hsvaToHex(colorHsv);
    const hexaColor = hsvaToHexa({ ...colorHsv, a: alpha });
    switch (colorType) {
      case "hexa":
        return hexaColor;
      case "rgb": {
        const rgb = hsvaToRgba(colorHsv);
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      }
      case "hsl": {
        const hsl = hsvaToHsla(colorHsv);
        return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(
          hsl.l
        )}%)`;
      }
      case "oklch": {
        const oklch = rgbaToOklch(hsvaToRgba(colorHsv));
        return `oklch(${oklch.l} ${oklch.c} ${oklch.h})`;
      }
      default:
        return showAlpha ? hexaColor : hexColor;
    }
  };


  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);

    if (open) {
      setTimeout(() => saturationRef.current?.focus(), 0);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger disabled={disabled}>
        {children || (
          <button
            type="button"
            className="flex items-center gap-2"
            aria-label="Color picker"
            aria-haspopup="dialog"
          >
            <div
              className={cn(
                "rounded-md border border-input cursor-pointer transition-transform hover:scale-105",
                currentSize.swatch
              )}
              style={{ backgroundColor: hsvaToHex(colorHsv) }}
            />
            <Input
              value={formatColorValue()}
              readOnly
              className={cn("font-mono cursor-pointer", currentSize.input)}
              aria-label="Current color value"
            />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className={cn("w-[340px] p-0", className)}>
        <div className="space-y-3 p-4">
          {}
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {announcement}
          </div>
          <div role="group" aria-label="Color picker controls">
            <div
              ref={saturationRef}
              className="relative cursor-crosshair"
              tabIndex={0}
              role="slider"
              aria-label="Saturation and brightness"
              aria-valuenow={colorHsv.s}
              aria-valuetext={`Saturation ${colorHsv.s}%, Brightness ${colorHsv.v}%`}
              onKeyDown={handleSaturationKeyDown}
            >
              <Saturation
                hsva={colorHsv}
                onChange={(newColor) => handleValueChange(newColor)}
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: "4/2",
                  borderRadius: "0.375rem",
                }}
                className="border border-border"
              />
            </div>

            <div
              ref={hueRef}
              className="mt-2"
              tabIndex={0}
              role="slider"
              aria-label="Hue"
              aria-valuenow={Math.round(colorHsv.h)}
              aria-valuemin={0}
              aria-valuemax={359}
              aria-valuetext={`${Math.round(colorHsv.h)} degrees`}
              onKeyDown={handleHueKeyDown}
            >
              <Hue
                hue={colorHsv.h}
                onChange={(newHue) =>
                  handleValueChange({ ...colorHsv, ...newHue })
                }
                className="[&>div:first-child]:overflow-hidden [&>div:first-child]:rounded!"
                style={
                  {
                    width: "100%",
                    height: "0.75rem",
                    borderRadius: "0.375rem",
                    "--alpha-pointer-background-color":
                      "hsl(var(--foreground))",
                  } as React.CSSProperties
                }
              />
            </div>

            {showAlpha && (
              <div
                className="mt-2 relative"
                tabIndex={0}
                role="slider"
                aria-label="Opacity"
                aria-valuenow={Math.round(alpha * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuetext={`${Math.round(alpha * 100)}%`}
                onKeyDown={handleAlphaKeyDown}
              >
                {}
                <div
                  className="absolute inset-0 w-full h-4 rounded-md overflow-hidden"
                  style={{
                    background: `repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 50% / 8px 8px`,
                  }}
                />
                {}
                <div
                  className="absolute inset-0 w-full h-4 rounded-md border"
                  style={{
                    background: `linear-gradient(to right, transparent, ${hsvaToHex(
                      colorHsv
                    )})`,
                  }}
                />
                {}
                <div
                  className="absolute top-0 h-4 w-4 rounded-full border-2 border-white shadow-md pointer-events-none transition-transform"
                  style={{
                    left: `calc(${alpha * 100}% - 8px)`,
                    backgroundColor: hsvaToHex(colorHsv),
                    boxShadow:
                      "0 0 0 1px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
                {}
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={alpha}
                  onChange={(e) =>
                    handleAlphaChange(parseFloat(e.target.value))
                  }
                  className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
                  aria-label="Opacity slider"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {eyedropperSupported && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEyedropper}
                className="flex-1"
                aria-label="Pick color from screen"
              >
                <IconColorPicker className="h-4 w-4 mr-2" />
                Eyedropper
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex-1"
              aria-label={copied ? "Copied!" : "Copy color value"}
            >
              {copied ? (
                <>
                  <IconCopyCheck className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <IconCopy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTypeMenu(!showTypeMenu)}
                className="w-16 justify-between uppercase text-xs"
                aria-haspopup="menu"
                aria-expanded={showTypeMenu}
                aria-label={`Color format: ${colorType}`}
              >
                {colorType}
                <IconChevronDown className="h-3 w-3" />
              </Button>
              {showTypeMenu && (
                <div
                  className="absolute top-full left-0 mt-1 z-50 w-20 rounded-md border bg-popover shadow-md"
                  role="menu"
                >
                  {(["hex", "hexa", "hsl", "rgb", "oklch"] as const).map(
                    (t) => (
                      <button
                        key={t}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setColorType(t);
                          setShowTypeMenu(false);
                        }}
                        className={cn(
                          "w-full px-3 py-1.5 text-left text-xs uppercase hover:bg-muted",
                          colorType === t && "bg-muted font-medium"
                        )}
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div aria-live="polite" aria-atomic="true" className="sr-only">
                Current color: {formatColorValue()}
              </div>
              {colorType === "hex" && !showAlpha && (
                <Input
                  data-slot="color-input"
                  value={hsvaToHex(colorHsv)}
                  onChange={(e) => {
                    try {
                      handleValueChange(hexToHsva(e.target.value));
                    } catch {
                      setInputError("Invalid hex color");
                      onError?.({
                        type: "format",
                        message: "Invalid hex color",
                      });
                    }
                  }}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  className={cn(
                    "font-mono",
                    inputError && "border-destructive"
                  )}
                  aria-invalid={!!inputError}
                  aria-describedby={
                    inputError ? "color-input-error" : undefined
                  }
                  name={name}
                  required={required}
                />
              )}
              {colorType === "hexa" && showAlpha && (
                <Input
                  data-slot="color-input"
                  value={hsvaToHexa({ ...colorHsv, a: alpha })}
                  onChange={(e) => {
                    try {
                      const hex = e.target.value;
                      if (hex.length >= 7) {
                        const newColor = hexToHsva(hex.substring(0, 7));
                        const newAlpha =
                          hex.length >= 9
                            ? parseInt(hex.substring(7, 9), 16) / 255
                            : alpha;
                        handleValueChange(newColor, newAlpha);
                      }
                    } catch {
                      setInputError("Invalid hex color");
                      onError?.({
                        type: "format",
                        message: "Invalid hex color",
                      });
                    }
                  }}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  className={cn(
                    "font-mono",
                    inputError && "border-destructive"
                  )}
                  aria-invalid={!!inputError}
                  aria-describedby={
                    inputError ? "color-input-error" : undefined
                  }
                  name={name}
                  required={required}
                />
              )}
              {colorType === "hsl" && (
                <ObjectColorInput
                  value={hsvaToHsla(colorHsv)}
                  label="hsl"
                  onValueChange={(val) => handleValueChange(hslaToHsva(val))}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  name={name}
                  required={required}
                />
              )}
              {colorType === "rgb" && (
                <ObjectColorInput
                  value={hsvaToRgba(colorHsv)}
                  label="rgb"
                  onValueChange={(val) => handleValueChange(rgbaToHsva(val))}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  name={name}
                  required={required}
                />
              )}
              {colorType === "oklch" && (
                <OklchColorInput
                  value={rgbaToOklch(hsvaToRgba(colorHsv))}
                  onValueChange={(val) =>
                    handleValueChange(rgbaToHsva(oklchToRgba(val)))
                  }
                  onBlur={onBlur}
                  onFocus={onFocus}
                  name={name}
                  required={required}
                />
              )}
              {inputError && (
                <div
                  id="color-input-error"
                  className="flex items-center gap-1.5 mt-1.5"
                >
                  <IconX className="h-3 w-3 text-destructive shrink-0" />
                  <span className="text-xs text-destructive">{inputError}</span>
                </div>
              )}
            </div>
          </div>

          {showBackgroundPreview && (
            <>
              <div className="h-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Preview</p>
                <div className="flex gap-1">
                  <div
                    className="h-10 w-10 rounded-md border shadow-sm"
                    style={{ backgroundColor: hsvaToHex(colorHsv) }}
                    aria-hidden="true"
                  />
                  <div
                    className="h-10 w-10 rounded-md border shadow-sm bg-white"
                    style={{ backgroundColor: hsvaToHex(colorHsv) }}
                    aria-label="On white background"
                  />
                  <div
                    className="h-10 w-10 rounded-md border shadow-sm bg-black"
                    style={{ backgroundColor: hsvaToHex(colorHsv) }}
                    aria-label="On black background"
                  />
                  <div
                    className="h-10 w-10 rounded-md border shadow-sm"
                    style={{
                      background: `repeating-conic-gradient(#808080 0% 25%, white 0% 50%) 50% / 8px 8px`,
                    }}
                    aria-label="Transparent background"
                  />
                </div>
              </div>
            </>
          )}

          {allSwatches.length > 0 && (
            <>
              <div className="h-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Presets</p>
                <div
                  className="flex flex-wrap gap-1.5"
                  role="listbox"
                  aria-label="Preset colors"
                >
                  {allSwatches
                    .sort((a, b) => hexToHsva(a).h - hexToHsva(b).h)
                    .map((color) => (
                      <button
                        type="button"
                        role="option"
                        aria-selected={
                          hsvaToHex(colorHsv).toLowerCase() ===
                          color.toLowerCase()
                        }
                        key={color}
                        onClick={() => handleValueChange(hexToHsva(color))}
                        onKeyDown={(e) => handleSwatchKeyDown(e, color)}
                        className={cn(
                          "h-7 w-7 rounded-md border border-input transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                          hsvaToHex(colorHsv).toLowerCase() ===
                            color.toLowerCase() &&
                            "ring-2 ring-ring ring-offset-1"
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                        tabIndex={0}
                      />
                    ))}
                </div>
              </div>
            </>
          )}

          {recentColors.length > 0 && (
            <>
              <div className="h-px bg-border" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">Recent</p>
                  {recentColors.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setRecentColors([])}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Clear recent colors"
                    >
                      <IconRefresh className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <div
                  className="flex flex-wrap gap-1.5"
                  role="listbox"
                  aria-label="Recent colors"
                >
                  {recentColors.map((color) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={
                        hsvaToHex(colorHsv).toLowerCase() ===
                        color.toLowerCase()
                      }
                      key={`${color}-${recentColors.indexOf(color)}`}
                      onClick={() => handleValueChange(hexToHsva(color))}
                      onKeyDown={(e) => handleSwatchKeyDown(e, color)}
                      className={cn(
                        "h-7 w-7 rounded-md border border-input transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                        hsvaToHex(colorHsv).toLowerCase() ===
                          color.toLowerCase() &&
                          "ring-2 ring-ring ring-offset-1"
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Recent color ${color}`}
                      tabIndex={0}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {showHarmonies && (
            <>
              <div className="h-px bg-border" />
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Harmonies</p>
                {harmonies.map((harmony) => (
                  <div key={harmony.name}>
                    <p className="text-xs text-muted-foreground mb-1">
                      {harmony.name}
                    </p>
                    <div
                      className="flex flex-wrap gap-1"
                      role="listbox"
                      aria-label={`${harmony.name} colors`}
                    >
                      {harmony.colors.map((color) => (
                        <button
                          type="button"
                          role="option"
                          aria-selected={
                            hsvaToHex(colorHsv).toLowerCase() ===
                            color.toLowerCase()
                          }
                          key={`${harmony.name}-${color}`}
                          onClick={() => handleValueChange(hexToHsva(color))}
                          onKeyDown={(e) => handleSwatchKeyDown(e, color)}
                          className={cn(
                            "h-6 w-6 rounded-md border border-input transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                            hsvaToHex(colorHsv).toLowerCase() ===
                              color.toLowerCase() &&
                              "ring-2 ring-ring ring-offset-1"
                          )}
                          style={{ backgroundColor: color }}
                          aria-label={`Select ${harmony.name} color ${color}`}
                          tabIndex={0}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!hideContrastRatio && (
            <>
              <div className="h-px bg-border" />
              <ContrastRatio color={colorHsv} alpha={alpha} />
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

type ContrastRatioProps = {
  color: HsvaColor;
  alpha?: number;
};

function ValidationBadge({
  ratio,
  ratioLimit,
  className,
  children,
}: {
  ratio: number;
  ratioLimit: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const isValid = ratio > ratioLimit;
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1 rounded-full text-muted-foreground text-xs px-2 py-0.5",
        isValid &&
          "border-transparent bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
        className
      )}
      icon={isValid ? <IconCheck /> : <IconX />}
    >
      {



}
      <span className="leading-none">{children}</span>
    </Badge>
  );
}

function ContrastRatio({ color, alpha = 1 }: ContrastRatioProps) {
  const [darkModeContrastRatio, setDarkModeContrastValue] = React.useState(0);
  const [lightModeContrastValue, setLightModeContrastValue] = React.useState(0);

  React.useEffect(() => {
    const rgb = hsvaToRgba(color);

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

    setDarkModeContrastValue(Number(darkModeRatio.toFixed(2)));
    setLightModeContrastValue(Number(lightModeRatio.toFixed(2)));
  }, [color, alpha]);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded relative overflow-hidden"
          style={{ backgroundColor: "var(--selected-color)" }}
        >
          <span className="font-medium text-black dark:text-white text-sm relative z-10">
            A
          </span>
          {alpha < 1 && (
            <div
              className="absolute inset-0"
              style={{
                background: `repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 50% / 4px 4px`,
                opacity: 1 - alpha,
              }}
            />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Contrast</span>
          <span className="hidden text-sm dark:flex">
            {darkModeContrastRatio}
          </span>
          <span className="text-sm dark:hidden">{lightModeContrastValue}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <ValidationBadge
          className="dark:hidden"
          ratio={lightModeContrastValue}
          ratioLimit={4.5}
        >
          AA
        </ValidationBadge>
        <ValidationBadge
          className="dark:hidden"
          ratio={lightModeContrastValue}
          ratioLimit={7}
        >
          AAA
        </ValidationBadge>
        <ValidationBadge
          className="hidden dark:flex"
          ratio={darkModeContrastRatio}
          ratioLimit={4.5}
        >
          AA
        </ValidationBadge>
        <ValidationBadge
          className="hidden dark:flex"
          ratio={darkModeContrastRatio}
          ratioLimit={7}
        >
          AAA
        </ValidationBadge>
      </div>
    </div>
  );
}

type ObjectColorInputProps =
  | {
      label: "hsl";
      value: HslaColor;
      onValueChange?: (value: HslaColor) => void;
      onBlur?: () => void;
      onFocus?: () => void;
      name?: string;
      required?: boolean;
    }
  | {
      label: "rgb";
      value: RgbaColor;
      onValueChange?: (value: RgbaColor) => void;
      onBlur?: () => void;
      onFocus?: () => void;
      name?: string;
      required?: boolean;
    };

function ObjectColorInput({
  value,
  label,
  onValueChange,
  onBlur,
  onFocus,
  name,
  required,
}: ObjectColorInputProps) {
  const inputId = React.useId();
  const labelChars = label === "hsl" ? ["h", "s", "l"] : ["r", "g", "b"];

  function handleChange(val: Partial<HslaColor | RgbaColor>) {
    if (onValueChange) {
      if (label === "hsl") {
        onValueChange({ ...value, ...val } as HslaColor);
      } else {
        onValueChange({ ...value, ...val } as RgbaColor);
      }
    }
  }

  return (
    <div
      className="flex"
      role="group"
      aria-label={`${label.toUpperCase()} color values`}
    >
      {labelChars.map((char, index) => {
        const inputValue =
          label === "hsl"
            ? char === "h"
              ? Math.round((value as HslaColor).h)
              : char === "s"
              ? Math.round((value as HslaColor).s)
              : Math.round((value as HslaColor).l)
            : char === "r"
            ? (value as RgbaColor).r
            : char === "g"
            ? (value as RgbaColor).g
            : (value as RgbaColor).b;

        const maxValue = label === "hsl" ? (char === "h" ? 360 : 100) : 255;

        return (
          <div key={char} className="flex-1">
            <label htmlFor={`${inputId}-${char}`} className="sr-only">
              {label.toUpperCase()}{" "}
              {char === "h"
                ? "Hue"
                : char === "s"
                ? "Saturation"
                : char === "l"
                ? "Lightness"
                : char.toUpperCase()}
            </label>
            <Input
              id={`${inputId}-${char}`}
              className={cn(
                "text-center text-sm",
                index === 0 && "rounded-e-none border-r-0",
                index === 1 && "rounded-none border-r-0",
                index === 2 && "rounded-s-none"
              )}
              value={inputValue}
              onChange={(e) =>
                handleChange({
                  [char]: Number(e.target.value) || 0,
                })
              }
              onBlur={onBlur}
              onFocus={onFocus}
              min={0}
              max={maxValue}
              type="number"
              aria-label={`${label.toUpperCase()} ${
                char === "h"
                  ? "hue"
                  : char === "s"
                  ? "saturation"
                  : char === "l"
                  ? "lightness"
                  : char
              }`}
              name={name ? `${name}-${char}` : undefined}
              required={required}
            />
          </div>
        );
      })}
    </div>
  );
}

type OklchColorInputProps = {
  value: OklchColor;
  onValueChange?: (value: OklchColor) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  name?: string;
  required?: boolean;
};

function OklchColorInput({
  value,
  onValueChange,
  onBlur,
  onFocus,
  name,
  required,
}: OklchColorInputProps) {
  const inputId = React.useId();
  const labelChars = ["l", "c", "h"] as const;

  function handleChange(val: Partial<OklchColor>) {
    if (onValueChange) {
      onValueChange({ ...value, ...val });
    }
  }

  return (
    <div className="flex" role="group" aria-label="OKLCH color values">
      {labelChars.map((char, index) => {
        const inputValue =
          char === "l" ? value.l : char === "c" ? value.c : value.h;

        const maxValue = char === "l" ? 1 : char === "c" ? 0.5 : 360;
        const step = char === "l" ? 0.01 : char === "c" ? 0.001 : 1;

        return (
          <div key={char} className="flex-1">
            <label htmlFor={`${inputId}-${char}`} className="sr-only">
              OKLCH{" "}
              {char === "l" ? "Lightness" : char === "c" ? "Chroma" : "Hue"}
            </label>
            <Input
              id={`${inputId}-${char}`}
              className={cn(
                "text-center text-sm",
                index === 0 && "rounded-e-none border-r-0",
                index === 1 && "rounded-none border-r-0",
                index === 2 && "rounded-s-none"
              )}
              value={inputValue}
              onChange={(e) =>
                handleChange({
                  [char]: Number(e.target.value) || 0,
                })
              }
              onBlur={onBlur}
              onFocus={onFocus}
              min={0}
              max={maxValue}
              step={step}
              type="number"
              aria-label={`OKLCH ${
                char === "l" ? "lightness" : char === "c" ? "chroma" : "hue"
              }`}
              name={name ? `${name}-${char}` : undefined}
              required={required}
            />
          </div>
        );
      })}
    </div>
  );
}

export { ColorPicker };
export type { ColorPickerProps, ColorPickerValue, ColorHarmony, OklchColor };


export { getColorAsHsva, rgbaToOklch, oklchToRgba, hslaToHsva };
