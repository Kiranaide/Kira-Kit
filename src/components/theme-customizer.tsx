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
 * Site-wide theme preset picker for the docs sidebar. Applying a preset
 * re-skins every page (the provider injects its tokens globally); the adjacent
 * ThemeToggle handles light/dark.
 */
export function ThemeCustomizer({ className }: { className?: string }) {
  const { presetName, setPresetName, presets } = usePreset();

  const selected = presets.find((preset) => preset.name === presetName);
  const label = selected?.title ?? "Default";

  return (
    <div className={cn("px-2 py-1.5", className)} data-slot="theme-customizer">
      <span className="mb-1.5 block px-1 text-xs font-medium text-muted-foreground">
        Theme preset
      </span>
      <Select
        value={presetName}
        onValueChange={(value) => setPresetName(value ?? DEFAULT_PRESET)}
      >
        <SelectTrigger size="sm" aria-label="Theme preset">
          <SelectValue>
            <span className="flex items-center gap-2">
              <Swatch
                color={selected ? presetSwatch(selected) : "var(--primary)"}
              />
              {label}
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
    </div>
  );
}
