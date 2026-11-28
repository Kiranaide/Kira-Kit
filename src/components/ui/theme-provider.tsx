"use client";

import * as React from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "cn";

type ThemePreference = "light" | "dark" | "system";

type ResolvedTheme = "light" | "dark";

type Theme = ResolvedTheme;

interface ThemeContextValue {
  /** Resolved concrete theme applied to `<html>` ("light" | "dark"). */
  theme: ResolvedTheme;
  /** User's stored or controlled preference ("light" | "dark" | "system"). */
  preference: ThemePreference;
  /** Update the active theme preference ("light", "dark", or "system"). */
  setTheme: (theme: ThemePreference) => void;
  /** Switch to the opposite resolved theme ("light" <-> "dark"). */
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Fallback preference when no stored or controlled value exists. Defaults to "system". */
  defaultTheme?: ThemePreference;
  /**
   * Authoritative controlled/SSR preference (e.g. from a server cookie).
   * When provided, takes precedence over localStorage on initial render and updates.
   */
  value?: ThemePreference;
  /** Called when the user changes the theme via `setTheme` or `toggleTheme`. */
  onThemeChange?: (
    preference: ThemePreference,
    resolved: ResolvedTheme,
  ) => void;
  /**
   * localStorage key used to persist the user's preference.
   * Set to `null` or `false` to disable localStorage reads and writes in cookie-driven SSR apps.
   * Defaults to `"kira-theme"`.
   */
  storageKey?: string | null | false;
}

interface ThemeBootstrapScriptOptions {
  /** Fallback preference when no stored or initial preference exists. Defaults to "system". */
  defaultTheme?: ThemePreference;
  /**
   * Authoritative SSR preference (e.g. from a server cookie).
   * When provided, takes precedence over localStorage.
   */
  initialTheme?: ThemePreference;
  /**
   * localStorage key read when `initialTheme` is omitted.
   * Set to `null` or `false` to skip localStorage access.
   * Defaults to `"kira-theme"`.
   */
  storageKey?: string | null | false;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const DEFAULT_STORAGE_KEY = "kira-theme";
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

const storageListenersByKey = new Map<string, Set<() => void>>();

function noop(): void {
  // Intentional no-op cleanup when subscriptions are inactive.
}

function parseThemePreference(raw: string | null): ThemePreference | null {
  if (raw === "light" || raw === "dark" || raw === "system") {
    return raw;
  }

  return null;
}

function normalizeStorageKey(
  storageKey: string | null | false | undefined,
): string | null {
  if (storageKey === undefined) {
    return DEFAULT_STORAGE_KEY;
  }

  if (storageKey === null || storageKey === false || storageKey === "") {
    return null;
  }

  return storageKey;
}

function resolveTheme(
  preference: ThemePreference,
  systemTheme: ResolvedTheme,
): ResolvedTheme {
  return preference === "system" ? systemTheme : preference;
}

function applyDocumentTheme(resolvedTheme: ResolvedTheme): void {
  const root = document.documentElement;
  const opposite: ResolvedTheme = resolvedTheme === "dark" ? "light" : "dark";

  root.classList.remove(opposite);

  if (!root.classList.contains(resolvedTheme)) {
    root.classList.add(resolvedTheme);
  }
}

function getSystemThemeSnapshot(): ResolvedTheme {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia === "undefined"
  ) {
    return "light";
  }

  return window.matchMedia(DARK_MEDIA_QUERY).matches ? "dark" : "light";
}

function getSystemThemeServerSnapshot(): ResolvedTheme {
  return "light";
}

function subscribeToSystemTheme(onStoreChange: () => void): () => void {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia === "undefined"
  ) {
    return noop;
  }

  const mediaQuery = window.matchMedia(DARK_MEDIA_QUERY);

  const handleChange = () => {
    onStoreChange();
  };

  if (typeof mediaQuery.addEventListener !== "undefined") {
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }

  mediaQuery.addListener(handleChange);

  return () => {
    mediaQuery.removeListener(handleChange);
  };
}

function readStoredPreference(
  storageKey: string | null,
): ThemePreference | null {
  if (storageKey === null || typeof window === "undefined") {
    return null;
  }

  try {
    return parseThemePreference(window.localStorage.getItem(storageKey));
  } catch {
    // Storage may be blocked in sandboxed frames.
    return null;
  }
}

function writeStoredPreference(
  storageKey: string | null,
  preference: ThemePreference,
): boolean {
  if (storageKey === null || typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(storageKey, preference);

    return readStoredPreference(storageKey) === preference;
  } catch {
    // Storage may be blocked in sandboxed frames.
    return false;
  }
}

function notifyStorageListeners(storageKey: string): void {
  const listeners = storageListenersByKey.get(storageKey);

  if (!listeners) {
    return;
  }

  for (const listener of listeners) {
    listener();
  }
}

function subscribeToStorage(
  storageKey: string | null,
  onStoreChange: () => void,
): () => void {
  if (storageKey === null || typeof window === "undefined") {
    return noop;
  }

  let listeners = storageListenersByKey.get(storageKey);

  if (!listeners) {
    listeners = new Set();
    storageListenersByKey.set(storageKey, listeners);
  }

  listeners.add(onStoreChange);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === storageKey) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    const currentListeners = storageListenersByKey.get(storageKey);

    if (currentListeners) {
      currentListeners.delete(onStoreChange);

      if (currentListeners.size === 0) {
        storageListenersByKey.delete(storageKey);
      }
    }

    window.removeEventListener("storage", handleStorage);
  };
}

function getNullServerSnapshot(): ThemePreference | null {
  return null;
}

function useStoredThemePreference(
  storageKey: string | null,
  disabled: boolean,
): ThemePreference | null {
  const subscribeStorage = React.useCallback(
    (onStoreChange: () => void) =>
      disabled ? noop : subscribeToStorage(storageKey, onStoreChange),
    [disabled, storageKey],
  );

  const getStorageSnapshot = React.useCallback(
    () => (disabled ? null : readStoredPreference(storageKey)),
    [disabled, storageKey],
  );

  return React.useSyncExternalStore(
    subscribeStorage,
    getStorageSnapshot,
    getNullServerSnapshot,
  );
}

/**
 * Returns a self-contained inline script string for `<head>` that applies the
 * resolved `.light` or `.dark` class to `document.documentElement` before first
 * paint using the same resolution order as `ThemeProvider`.
 */
function getThemeBootstrapScript(
  options: ThemeBootstrapScriptOptions = {},
): string {
  const safeDefault =
    parseThemePreference(options.defaultTheme ?? null) ?? "system";

  const safeInitial = parseThemePreference(options.initialTheme ?? null);
  const activeStorageKey = normalizeStorageKey(options.storageKey);

  if (safeInitial !== null) {
    const initialLiteral = JSON.stringify(safeInitial);

    return `(function(){try{var d=document.documentElement,p=${initialLiteral},r=p==="system"?(window.matchMedia("${DARK_MEDIA_QUERY}").matches?"dark":"light"):p;d.classList.remove(r==="dark"?"light":"dark");if(!d.classList.contains(r))d.classList.add(r);}catch(e){}})();`;
  }

  const defaultLiteral = JSON.stringify(safeDefault);

  if (activeStorageKey === null) {
    return `(function(){try{var d=document.documentElement,p=${defaultLiteral},r=p==="system"?(window.matchMedia("${DARK_MEDIA_QUERY}").matches?"dark":"light"):p;d.classList.remove(r==="dark"?"light":"dark");if(!d.classList.contains(r))d.classList.add(r);}catch(e){}})();`;
  }

  const keyLiteral = JSON.stringify(activeStorageKey).replaceAll(
    "<",
    "\\u003c",
  );

  return `(function(){try{var d=document.documentElement,p=${defaultLiteral},s=null;try{s=window.localStorage.getItem(${keyLiteral});}catch(e){}if(s==="light"||s==="dark"||s==="system")p=s;var r=p==="system"?(window.matchMedia("${DARK_MEDIA_QUERY}").matches?"dark":"light"):p;d.classList.remove(r==="dark"?"light":"dark");if(!d.classList.contains(r))d.classList.add(r);}catch(e){}})();`;
}

function ThemeProvider({
  children,
  defaultTheme = "system",
  value: controlledPreference,
  onThemeChange,
  storageKey = DEFAULT_STORAGE_KEY,
}: ThemeProviderProps) {
  const activeStorageKey = normalizeStorageKey(storageKey);
  const isControlled = controlledPreference !== undefined;

  const [localOverride, setLocalOverride] =
    React.useState<ThemePreference | null>(null);

  const systemTheme = React.useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemThemeSnapshot,
    getSystemThemeServerSnapshot,
  );

  const storedPreference = useStoredThemePreference(
    activeStorageKey,
    isControlled,
  );

  const preference: ThemePreference =
    controlledPreference ?? localOverride ?? storedPreference ?? defaultTheme;

  const resolvedTheme = resolveTheme(preference, systemTheme);

  React.useEffect(() => {
    applyDocumentTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = React.useCallback(
    (nextPreference: ThemePreference) => {
      const nextResolved = resolveTheme(
        nextPreference,
        getSystemThemeSnapshot(),
      );

      if (!isControlled) {
        const persisted = writeStoredPreference(
          activeStorageKey,
          nextPreference,
        );

        if (persisted && activeStorageKey !== null) {
          setLocalOverride(null);
          notifyStorageListeners(activeStorageKey);
        } else {
          setLocalOverride(nextPreference);
        }
      }

      onThemeChange?.(nextPreference, nextResolved);
    },
    [isControlled, activeStorageKey, onThemeChange],
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  }, [resolvedTheme, setTheme]);

  const contextValue = React.useMemo<ThemeContextValue>(
    () => ({
      theme: resolvedTheme,
      preference,
      setTheme,
      toggleTheme,
    }),
    [resolvedTheme, preference, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

interface ThemeToggleProps extends Omit<ButtonProps, "onClick" | "children"> {
  /** Show "Dark mode" / "Light mode" label beside the icon. */
  showLabel?: boolean;
}

function ThemeToggle({
  showLabel = true,
  variant = "ghost",
  size,
  className,
  ...props
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <Button
      {...props}
      type="button"
      variant={variant}
      size={size ?? (showLabel ? "default" : "icon")}
      data-slot="theme-toggle"
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      onClick={toggleTheme}
      className={cn(showLabel && "w-full justify-start gap-2", className)}
    >
      {isLight ? (
        <IconMoon aria-hidden="true" className="size-4 shrink-0" />
      ) : (
        <IconSun aria-hidden="true" className="size-4 shrink-0" />
      )}
      {showLabel ? <span>{isLight ? "Dark mode" : "Light mode"}</span> : null}
    </Button>
  );
}

export { ThemeProvider, useTheme, ThemeToggle, getThemeBootstrapScript };

export type {
  Theme,
  ThemePreference,
  ResolvedTheme,
  ThemeContextValue,
  ThemeProviderProps,
  ThemeToggleProps,
  ThemeBootstrapScriptOptions,
};
