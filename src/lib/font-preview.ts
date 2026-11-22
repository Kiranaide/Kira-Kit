import {
  DEFAULT_DOC_DISPLAY,
  DEFAULT_DOC_FONT_PRESET,
  DEFAULT_DOC_MONO,
  DEFAULT_DOC_SANS,
  findDocFont,
  findDocFontPreset,
} from "./fonts";

const STYLE_ID = "kira-font-preview";

/**
 * Docs-only live font preview. Unlayered rules beat Tailwind's layered font
 * utilities (which inline literal stacks via @theme inline) and the :root
 * tokens retarget `var(--font-*)` consumers. The style element is never
 * removed on unmount, so the preview survives SPA navigation.
 */
export function applyFontPreview(
  sans: string,
  mono: string,
  display?: string,
  headingTracking?: string,
): void {
  const sansFont = findDocFont("sans", sans);
  const monoFont = findDocFont("mono", mono);
  const displayName = display ?? sans;
  const displayFont = findDocFont("display", displayName);

  const existing = document.getElementById(STYLE_ID);

  if (
    sans === DEFAULT_DOC_SANS &&
    mono === DEFAULT_DOC_MONO &&
    displayName === DEFAULT_DOC_DISPLAY
  ) {
    existing?.remove();

    return;
  }

  const style = existing ?? document.createElement("style");

  const trackingToken = headingTracking
    ? `;--tracking-kira-heading:${headingTracking}`
    : "";

  style.id = STYLE_ID;
  style.textContent = `:root{--font-sans:${sansFont.stack};--font-display:${displayFont.stack};--font-mono:${monoFont.stack}${trackingToken}}body{font-family:${sansFont.stack}}.font-display{font-family:${displayFont.stack}}.font-mono,code,pre,kbd,samp{font-family:${monoFont.stack}}`;

  if (!existing) document.head.appendChild(style);
}

export function initFontPreview(): void {
  try {
    const presetName = localStorage.getItem("kira-font-preset");

    if (presetName && presetName !== DEFAULT_DOC_FONT_PRESET) {
      const preset = findDocFontPreset(presetName);

      applyFontPreview(
        preset.sans,
        preset.mono,
        preset.display,
        preset.headingTracking,
      );

      return;
    }

    applyFontPreview(
      localStorage.getItem("kira-font") ?? DEFAULT_DOC_SANS,
      localStorage.getItem("kira-font-mono") ?? DEFAULT_DOC_MONO,
      localStorage.getItem("kira-font-display") ?? undefined,
    );
  } catch {
    // Storage unavailable — the preview stays at the defaults.
  }
}
