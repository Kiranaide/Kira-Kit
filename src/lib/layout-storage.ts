import { isNumberProp, isObjectProp } from "@/lib/component-utils";

export interface ValidatedLayoutStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

export interface LayoutStorageOptions {
  /** Require an exact panel count when validating stored percentages. */
  expectedPanels?: number;
}

function isValidPanelSize(size: unknown): size is number {
  return (
    isNumberProp(size) && Number.isFinite(size) && size >= 0 && size <= 100
  );
}

function isValidLayoutJson(raw: string, expectedPanels?: number): boolean {
  const value: unknown = JSON.parse(raw);

  if (!value || !isObjectProp(value) || Array.isArray(value)) return false;

  const sizes: unknown[] = Object.values(value);

  const validCount =
    expectedPanels === undefined
      ? sizes.length > 0
      : sizes.length === expectedPanels;

  if (!validCount || !sizes.every(isValidPanelSize)) return false;

  const total = sizes.reduce((sum, size) => sum + size, 0);

  return Math.abs(total - 100) < 0.1;
}

/**
 * Validated `localStorage` adapter for `react-resizable-panels`.
 * Untrusted, malformed, or unavailable browser storage safely falls back to `null`.
 */
export function createValidatedLayoutStorage(
  options: LayoutStorageOptions = {},
): ValidatedLayoutStorage {
  const { expectedPanels } = options;

  return {
    getItem(key) {
      if (typeof window === "undefined") return null;

      try {
        const raw = window.localStorage.getItem(key);

        if (!raw) return null;

        return isValidLayoutJson(raw, expectedPanels) ? raw : null;
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Layout remains usable when browser storage is blocked or full.
      }
    },
  };
}

export const unsavedLayoutStorage: ValidatedLayoutStorage = {
  getItem: () => null,
  setItem: () => {},
};
