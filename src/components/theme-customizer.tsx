import { cn } from "cn";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_PRESET, presetSwatch, usePreset } from "@/lib/theme-presets";

function Swatch({ color }: { color: string }) {
  return (
    <span
      className="h-3.5 w-3.5 shrink-0 rounded-full border border-border"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
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
        className={className}
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

/**
 * Site-wide theme preset picker for the docs sidebar. Applying a preset
 * re-skins every page (the provider injects its tokens globally); the adjacent
 * ThemeToggle handles light/dark.
 */
export function ThemeCustomizer({ className }: { className?: string }) {
  return (
    <div className={cn("px-2 py-1.5", className)} data-slot="theme-customizer">
      <span className="mb-1.5 block px-1 text-xs font-medium text-muted-foreground">
        Theme preset
      </span>
      <PresetField />
    </div>
  );
}
