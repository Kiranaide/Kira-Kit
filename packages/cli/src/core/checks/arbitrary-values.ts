import type { Check } from "./types";

/**
 * Check 9: one-off arbitrary z-/shadow-/rounded- values outside token scales.
 */
export const arbitraryValues: Check = (file) => {
  if (
    /\bz-\[/.test(file.content) ||
    /\bshadow-\[/.test(file.content) ||
    /\brounded-\[/.test(file.content)
  ) {
    return [
      {
        checkId: "arbitrary-values",
        severity: "warning",
        file: file.name,
        message: "arbitrary z-[…]/shadow-[…]/rounded-[…] value outside the token scales.",
      },
    ];
  }
  return [];
};
