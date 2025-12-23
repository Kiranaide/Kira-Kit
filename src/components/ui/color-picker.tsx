"use client";

import * as React from "react";
import {
  type HexColor,
  hexToHsva,
  type HslaColor,
  hslaToHsva,
  type HsvaColor,
  hsvaToHex,
  hsvaToHsla,
  hsvaToHslString,
  hsvaToRgba,
  type RgbaColor,
  rgbaToHsva,
} from "@uiw/color-convert";
import Hue from "@uiw/react-color-hue";
import Saturation from "@uiw/react-color-saturation";
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons-react";

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
    return hslaToHsva(color);
  }
}

type ColorPickerValue = {
  hex: string;
  hsl: HslaColor;
  rgb: RgbaColor;
};

type ColorPickerProps = {
  value?: `#${string}` | HsvaColor | HslaColor | RgbaColor;
  defaultValue?: `#${string}` | HsvaColor | HslaColor | RgbaColor;
  type?: "hsl" | "rgb" | "hex";
  swatches?: HexColor[];
  hideContrastRatio?: boolean;
  hideDefaultSwatches?: boolean;
  className?: string;
  onValueChange?: (value: ColorPickerValue) => void;
  children?: React.ReactNode;
  disabled?: boolean;
};

function ColorPicker({
  value,
  defaultValue = "#3b82f6",
  children,
  type = "hex",
  swatches = [],
  hideContrastRatio = false,
  hideDefaultSwatches = false,
  onValueChange,
  className,
  disabled,
}: ColorPickerProps) {
  const [colorType, setColorType] = React.useState(type);
  const [colorHsv, setColorHsv] = React.useState<HsvaColor>(
    value ? getColorAsHsva(value) : getColorAsHsva(defaultValue)
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [showTypeMenu, setShowTypeMenu] = React.useState(false);

  React.useEffect(() => {
    if (value) {
      setColorHsv(getColorAsHsva(value));
    }
  }, [value]);

  const handleValueChange = (color: HsvaColor) => {
    setColorHsv(color);
    onValueChange?.({
      hex: hsvaToHex(color),
      hsl: hsvaToHsla(color),
      rgb: hsvaToRgba(color),
    });
  };

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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "inline-flex items-center gap-2",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {children || (
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-md border border-input cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: hsvaToHex(colorHsv) }}
            />
            <Input
              value={hsvaToHex(colorHsv)}
              readOnly
              className="w-24 font-mono cursor-pointer"
            />
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-[320px] p-0", className)}
        style={
          {
            "--selected-color": hsvaToHslString(colorHsv),
          } as React.CSSProperties
        }
      >
        <div className="space-y-3 p-4">
          {/* Saturation picker */}
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

          {/* Hue slider */}
          <Hue
            hue={colorHsv.h}
            onChange={(newHue) => handleValueChange({ ...colorHsv, ...newHue })}
            className="[&>div:first-child]:overflow-hidden [&>div:first-child]:!rounded"
            style={
              {
                width: "100%",
                height: "0.75rem",
                borderRadius: "0.375rem",
                "--alpha-pointer-background-color": "hsl(var(--foreground))",
              } as React.CSSProperties
            }
          />

          {/* Color type selector and input */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTypeMenu(!showTypeMenu)}
                className="w-16 justify-between uppercase text-xs"
              >
                {colorType}
                <IconChevronDown className="h-3 w-3" />
              </Button>
              {showTypeMenu && (
                <div className="absolute top-full left-0 mt-1 z-50 w-20 rounded-md border bg-popover shadow-md">
                  {(["hex", "hsl", "rgb"] as const).map((t) => (
                    <button
                      key={t}
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
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1">
              {colorType === "hex" && (
                <Input
                  value={hsvaToHex(colorHsv)}
                  onChange={(e) => {
                    try {
                      handleValueChange(hexToHsva(e.target.value));
                    } catch {
                      // Invalid hex, ignore
                    }
                  }}
                  className="font-mono"
                />
              )}
              {colorType === "hsl" && (
                <ObjectColorInput
                  value={hsvaToHsla(colorHsv)}
                  label="hsl"
                  onValueChange={(val) => handleValueChange(hslaToHsva(val))}
                />
              )}
              {colorType === "rgb" && (
                <ObjectColorInput
                  value={hsvaToRgba(colorHsv)}
                  label="rgb"
                  onValueChange={(val) => handleValueChange(rgbaToHsva(val))}
                />
              )}
            </div>
          </div>

          {/* Swatches */}
          {allSwatches.length > 0 && (
            <>
              <div className="h-px bg-border" />
              <div className="flex flex-wrap gap-1.5">
                {allSwatches
                  .sort((a, b) => hexToHsva(a).h - hexToHsva(b).h)
                  .map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => handleValueChange(hexToHsva(color))}
                      className={cn(
                        "h-6 w-6 rounded-md border border-input transition-transform hover:scale-110",
                        hsvaToHex(colorHsv).toLowerCase() ===
                          color.toLowerCase() &&
                          "ring-2 ring-ring ring-offset-1"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
              </div>
            </>
          )}

          {/* Contrast ratio */}
          {!hideContrastRatio && (
            <>
              <div className="h-px bg-border" />
              <ContrastRatio color={colorHsv} />
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================
// CONTRAST RATIO
// ============================================
type ContrastRatioProps = {
  color: HsvaColor;
};

// ValidationBadge component for contrast ratio display
type ValidationBadgeProps = {
  ratio: number;
  ratioLimit: number;
  className?: string;
  children?: React.ReactNode;
};

function ValidationBadge({
  ratio,
  ratioLimit,
  className,
  children,
}: ValidationBadgeProps) {
  const isValid = ratio > ratioLimit;
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 rounded-full text-muted-foreground text-xs",
        isValid &&
          "border-transparent bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
        className
      )}
    >
      {isValid ? (
        <IconCheck className="h-3 w-3" />
      ) : (
        <IconX className="h-3 w-3" />
      )}
      {children}
    </Badge>
  );
}

function ContrastRatio({ color }: ContrastRatioProps) {
  const [darkModeContrastRatio, setDarkModeContrastValue] = React.useState(0);
  const [lightModeContrastValue, setLightModeContrastValue] = React.useState(0);

  React.useEffect(() => {
    const rgb = hsvaToRgba(color);

    const toSRGB = (c: number) => {
      const channel = c / 255;
      return channel <= 0.03928
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    };

    const r = toSRGB(rgb.r);
    const g = toSRGB(rgb.g);
    const b = toSRGB(rgb.b);

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    const darkModeRatio = (1.0 + 0.05) / (luminance + 0.05);
    const lightModeRatio = (luminance + 0.05) / 0.05;

    setDarkModeContrastValue(Number(darkModeRatio.toFixed(2)));
    setLightModeContrastValue(Number(lightModeRatio.toFixed(2)));
  }, [color]);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded"
          style={{ backgroundColor: "var(--selected-color)" }}
        >
          <span className="font-medium text-black dark:text-white text-sm">
            A
          </span>
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

// ============================================
// OBJECT COLOR INPUT (HSL/RGB)
// ============================================
type ObjectColorInputProps =
  | {
      label: "hsl";
      value: HslaColor;
      onValueChange?: (value: HslaColor) => void;
    }
  | {
      label: "rgb";
      value: RgbaColor;
      onValueChange?: (value: RgbaColor) => void;
    };

function ObjectColorInput({
  value,
  label,
  onValueChange,
}: ObjectColorInputProps) {
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
    <div className="flex">
      <Input
        className="rounded-e-none border-r-0 text-center text-sm"
        value={label === "hsl" ? Math.round(value.h) : (value as RgbaColor).r}
        onChange={(e) =>
          handleChange({
            [label === "hsl" ? "h" : "r"]: Number(e.target.value) || 0,
          })
        }
      />
      <Input
        className="rounded-none border-r-0 text-center text-sm"
        value={label === "hsl" ? Math.round(value.s) : (value as RgbaColor).g}
        onChange={(e) =>
          handleChange({
            [label === "hsl" ? "s" : "g"]: Number(e.target.value) || 0,
          })
        }
      />
      <Input
        className="rounded-s-none text-center text-sm"
        value={label === "hsl" ? Math.round(value.l) : (value as RgbaColor).b}
        onChange={(e) =>
          handleChange({
            [label === "hsl" ? "l" : "b"]: Number(e.target.value) || 0,
          })
        }
      />
    </div>
  );
}

export { ColorPicker };
export type { ColorPickerProps, ColorPickerValue };
