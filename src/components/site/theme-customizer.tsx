import {
  IconAdjustmentsHorizontal,
  IconChevronDown,
  IconMoon,
  IconPalette,
  IconRotateClockwise,
  IconSun,
} from "@tabler/icons-react";
import { cn } from "cn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/ui/theme-provider";
import {
  DOC_BASE_COLORS,
  DOC_FONT_PRESETS,
  DOC_RADIUS_PRESETS,
  DOC_SURFACE_PRESETS,
  findBaseColor,
  findRadiusPreset,
  findSurfacePreset,
} from "@/lib/theme-studio";
import {
  AUTO_VALUE,
  DEFAULT_PRESET,
  presetSwatch,
  usePreset,
  type BaseColorSelection,
} from "@/lib/theme-presets";

function Swatch({ color }: { color: string }) {
  return (
    <span
      className="size-4 shrink-0 rounded-full border border-border"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
}

function DualBaseSwatch({ light, dark }: { light: string; dark: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-4 shrink-0 overflow-hidden rounded-full border border-border"
    >
      <span className="h-full w-1/2" style={{ backgroundColor: light }} />
      <span className="h-full w-1/2" style={{ backgroundColor: dark }} />
    </span>
  );
}

/**
 * The picker itself, without the sidebar's label and padding — the site header
 * and the docs top bar show the same control inline.
 */
export function PresetField({
  className,
  showLabel = true,
}: {
  className?: string;
  /** Compact chrome (site headers) shows the swatch alone, label to readers only. */
  showLabel?: boolean;
}) {
  const { presetName, setPresetName, presets } = usePreset();

  const selected = presets.find((preset) => preset.name === presetName);
  const label = selected?.title ?? "Default";

  return (
    <Select
      value={presetName}
      onValueChange={(value) => setPresetName(value ?? DEFAULT_PRESET)}
    >
      <SelectTrigger
        size="sm"
        aria-label="Theme preset"
        data-slot="preset-field"
        className={cn("min-h-11 min-w-11 md:min-h-8 md:min-w-0", className)}
      >
        <SelectValue>
          <span className="flex items-center gap-2">
            <Swatch
              color={selected ? presetSwatch(selected) : "var(--primary)"}
            />
            {showLabel ? label : <span className="sr-only">{label}</span>}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={DEFAULT_PRESET}>
            <span className="flex items-center gap-2">
              <Swatch color="var(--primary)" />
              Default
            </span>
          </SelectItem>
          {presets.map((preset) => (
            <SelectItem key={preset.name} value={preset.name}>
              <span className="flex items-center gap-2">
                <Swatch color={presetSwatch(preset)} />
                {preset.title}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function BaseColorField() {
  const { baseColor, setBaseColor } = usePreset();

  const active =
    baseColor === AUTO_VALUE ? undefined : findBaseColor(baseColor);

  return (
    <Select
      value={baseColor}
      onValueChange={(value) => {
        if (!value || value === AUTO_VALUE) {
          setBaseColor(AUTO_VALUE);

          return;
        }

        const matched = findBaseColor(value);

        if (matched) setBaseColor(matched.name);
      }}
    >
      <SelectTrigger
        size="sm"
        aria-label="Base color preset"
        data-slot="base-color-field"
        className="min-h-11 w-full md:min-h-8"
      >
        <SelectValue>
          <span className="flex items-center gap-2">
            {active ? (
              <DualBaseSwatch
                light={active.light["--muted"]}
                dark={active.dark["--background"]}
              />
            ) : (
              <Swatch color="var(--muted)" />
            )}
            {active ? active.title : "Theme default"}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={AUTO_VALUE}>
            <span className="flex items-center gap-2">
              <Swatch color="var(--muted)" />
              Theme default
            </span>
          </SelectItem>
          {DOC_BASE_COLORS.map((base) => (
            <SelectItem key={base.name} value={base.name}>
              <span className="flex items-center gap-2">
                <DualBaseSwatch
                  light={base.light["--muted"]}
                  dark={base.dark["--background"]}
                />
                {base.title}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function FontPresetField() {
  const { fontPreset, setFontPreset } = usePreset();

  const active =
    DOC_FONT_PRESETS.find((item) => item.name === fontPreset) ??
    DOC_FONT_PRESETS[0];

  return (
    <Select
      value={fontPreset}
      onValueChange={(value) => {
        const matched = DOC_FONT_PRESETS.find((item) => item.name === value);

        if (matched) setFontPreset(matched.name);
      }}
    >
      <SelectTrigger
        size="sm"
        aria-label="Font preset"
        data-slot="font-preset-field"
        className="min-h-11 w-full md:min-h-8"
      >
        <SelectValue>{active.title}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {DOC_FONT_PRESETS.map((item) => (
            <SelectItem key={item.name} value={item.name}>
              <span className="flex items-center justify-between gap-2">
                <span>{item.title}</span>
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function GeometryRow() {
  const { radius, setRadius, surface, setSurface } = usePreset();

  const activeRadius =
    radius === AUTO_VALUE ? undefined : findRadiusPreset(radius);

  const activeSurface =
    surface === AUTO_VALUE ? undefined : findSurfacePreset(surface);

  return (
    <div className="grid grid-cols-2 gap-2">
      <Select
        value={radius}
        onValueChange={(value) => {
          if (!value || value === AUTO_VALUE) {
            setRadius(AUTO_VALUE);

            return;
          }

          const matched = findRadiusPreset(value);

          if (matched) setRadius(matched.name);
        }}
      >
        <SelectTrigger
          size="sm"
          aria-label="Corner radius preset"
          data-slot="radius-field"
          className="min-h-11 w-full md:min-h-8"
        >
          <SelectValue>
            {activeRadius ? activeRadius.title : "Radius"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={AUTO_VALUE}>Auto</SelectItem>
            {DOC_RADIUS_PRESETS.map((item) => (
              <SelectItem key={item.name} value={item.name}>
                {item.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={surface}
        onValueChange={(value) => {
          if (!value || value === AUTO_VALUE) {
            setSurface(AUTO_VALUE);

            return;
          }

          const matched = findSurfacePreset(value);

          if (matched) setSurface(matched.name);
        }}
      >
        <SelectTrigger
          size="sm"
          aria-label="Surface style preset"
          data-slot="surface-field"
          className="min-h-11 w-full md:min-h-8"
        >
          <SelectValue>
            {activeSurface ? activeSurface.title : "Surface"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={AUTO_VALUE}>Auto</SelectItem>
            {DOC_SURFACE_PRESETS.map((item) => (
              <SelectItem key={item.name} value={item.name}>
                {item.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function StudioAppearanceBar() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between gap-2 border-t border-border/70 bg-muted/30 px-4 py-2.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Appearance
      </span>
      <div className="inline-flex rounded-full border border-border/80 bg-background p-0.5">
        <button
          type="button"
          aria-pressed={theme === "light"}
          onClick={() => setTheme("light")}
          className={cn(
            "docs-focus-ring inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors duration-150",
            theme === "light"
              ? "bg-primary text-primary-foreground shadow-2xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <IconSun aria-hidden="true" className="size-3.5" />
          Light
        </button>
        <button
          type="button"
          aria-pressed={theme === "dark"}
          onClick={() => setTheme("dark")}
          className={cn(
            "docs-focus-ring inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors duration-150",
            theme === "dark"
              ? "bg-primary text-primary-foreground shadow-2xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <IconMoon aria-hidden="true" className="size-3.5" />
          Dark
        </button>
      </div>
    </div>
  );
}

function PresetStudioBody() {
  const { isCustomized, resetAll } = usePreset();

  return (
    <>
      <div className="flex items-center justify-between gap-2 border-b border-border/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg border border-border/80 bg-muted/60 text-primary">
            <IconPalette aria-hidden="true" className="size-4" />
          </span>
          <div>
            <p className="text-xs font-semibold leading-none text-foreground">
              Preset studio
            </p>
            <p className="mt-1 text-[11px] leading-none text-muted-foreground">
              Theme, typography &amp; geometry
            </p>
          </div>
        </div>

        {isCustomized && (
          <button
            type="button"
            onClick={resetAll}
            className="docs-focus-ring inline-flex h-7 items-center gap-1 rounded-md border border-border/70 bg-background px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <IconRotateClockwise aria-hidden="true" className="size-3" />
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3.5 p-4" data-slot="theme-customizer">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Color &amp; base
          </span>
          <PresetField className="w-full" />
          <BaseColorField />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Typography
          </span>
          <FontPresetField />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Radius &amp; surface
          </span>
          <GeometryRow />
        </div>
      </div>

      <StudioAppearanceBar />
    </>
  );
}

/**
 * Header-mounted Preset Studio popover: keeps the sidebar purely for
 * navigation while putting accent theme, neutral base, typography, radius,
 * surface, and light/dark mode one click away in the top bar.
 */
export function PresetStudioPopover({
  className,
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { presetName, presets, isCustomized } = usePreset();
  const selected = presets.find((preset) => preset.name === presetName);
  const label = selected?.title ?? "Default";

  return (
    <Popover>
      <PopoverTrigger
        aria-label={`Preset studio: ${label}`}
        data-slot="preset-studio-trigger"
        className={cn(
          "docs-focus-ring inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full border border-border/80 bg-background/80 px-2.5 text-xs font-medium text-foreground shadow-2xs transition-[background-color,border-color,color] duration-150 ease-out hover:border-border hover:bg-accent lg:h-9 lg:px-3",
          className,
        )}
      >
        <span className="relative flex items-center">
          <Swatch
            color={selected ? presetSwatch(selected) : "var(--primary)"}
          />
          {isCustomized && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 size-2 rounded-full border border-background bg-primary"
            />
          )}
        </span>
        {showLabel ? (
          <span className="max-w-32 truncate">{label}</span>
        ) : (
          <span className="sr-only">{label}</span>
        )}
        <IconAdjustmentsHorizontal
          aria-hidden="true"
          className="size-3.5 text-muted-foreground"
        />
        <IconChevronDown
          aria-hidden="true"
          className="hidden size-3 text-muted-foreground sm:inline"
        />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[320px] overflow-hidden p-0"
      >
        <PresetStudioBody />
      </PopoverContent>
    </Popover>
  );
}

/**
 * Site-wide composable theme preset controls.
 */
export function ThemeCustomizer({ className }: { className?: string }) {
  const { isCustomized, resetAll } = usePreset();

  return (
    <div
      className={cn("flex flex-col gap-2 px-2 py-2", className)}
      data-slot="theme-customizer"
    >
      <div className="flex items-center justify-between gap-2 px-1">
        <span className="text-xs font-medium text-muted-foreground">
          Preset studio
        </span>
        {isCustomized && (
          <button
            type="button"
            onClick={resetAll}
            className="docs-focus-ring inline-flex min-h-11 min-w-11 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:min-h-7"
          >
            <IconRotateClockwise aria-hidden="true" className="size-3" />
            Reset
          </button>
        )}
      </div>

      <PresetField className="w-full" />
      <BaseColorField />
      <FontPresetField />
      <GeometryRow />
    </div>
  );
}

export type { BaseColorSelection };
