import {
  DEFAULT_DOC_MONO,
  DEFAULT_DOC_SANS,
  DOC_MONO_FONTS,
  DOC_SANS_FONTS,
} from "./fonts";

const STYLE_ID = "kira-font-preview";

/**
 * Docs-only live font preview. Unlayered rules beat Tailwind's layered font
 * utilities (which inline literal stacks via @theme inline), and the :root
 * tokens retarget var(--font-*) consumers like the code-block's inline
 * fontFamily. The style element is never removed on unmount so the preview
 * survives SPA navigation; initFontPreview re-applies it after a full load.
 */
export function applyFontPreview(sans: string, mono: string): void {
  const sansFont =
    DOC_SANS_FONTS.find((font) => font.name === sans) ?? DOC_SANS_FONTS[0];

  const monoFont =
    DOC_MONO_FONTS.find((font) => font.name === mono) ?? DOC_MONO_FONTS[0];

  const existing = document.getElementById(STYLE_ID);

  if (sans === DEFAULT_DOC_SANS && mono === DEFAULT_DOC_MONO) {
    existing?.remove();

    return;
  }

  const style = existing ?? document.createElement("style");

  style.id = STYLE_ID;
  style.textContent = `:root{--font-sans:${sansFont.stack};--font-mono:${monoFont.stack}}body{font-family:${sansFont.stack}}.font-mono,code,pre,kbd,samp{font-family:${monoFont.stack}}`;

  if (!existing) document.head.appendChild(style);
}

export function initFontPreview(): void {
  try {
    applyFontPreview(
      localStorage.getItem("kira-font") ?? DEFAULT_DOC_SANS,
      localStorage.getItem("kira-font-mono") ?? DEFAULT_DOC_MONO,
    );
  } catch {
    // Storage unavailable — the preview stays at the defaults.
  }
}
