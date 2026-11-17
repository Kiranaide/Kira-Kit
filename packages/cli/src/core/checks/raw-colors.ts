import type { Check } from "./types";

/** Check 7: raw hex/rgb color literals — use semantic tokens instead. */
export const rawColors: Check = (file) => {
  const hex = file.content.match(/#[0-9a-fA-F]{3,8}\b/);
  const rgb = file.content.match(/\brgba?\(/);
  if (hex || rgb) {
    return [
      {
        checkId: "raw-colors",
        severity: "warning",
        file: file.name,
        message: `raw colour literal (${hex ? hex[0] : "rgb()"}) — use semantic tokens.`,
      },
    ];
  }
  return [];
};
