"use client";

import * as React from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "cn";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const DEFAULT_STORAGE_KEY = "kira-theme";

function readInitialTheme(storageKey: string, defaultTheme?: Theme): Theme {
  if (typeof window === "undefined") return defaultTheme ?? "light";

  try {
    const stored = window.localStorage.getItem(storageKey);

    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage may be blocked in sandboxed frames.
  }

  if (defaultTheme) return defaultTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

function ThemeProvider({
  children,
  defaultTheme,
  storageKey = DEFAULT_STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(() =>
    readInitialTheme(storageKey, defaultTheme),
  );

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // Storage may be blocked in sandboxed frames.
    }
  }, [theme, storageKey]);

  const toggleTheme = React.useCallback(() => {
    setTheme((previous) => (previous === "light" ? "dark" : "light"));
  }, []);

  const value = React.useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
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
      {showLabel && <span>{isLight ? "Dark mode" : "Light mode"}</span>}
    </Button>
  );
}

export { ThemeProvider, useTheme, ThemeToggle };

export type { Theme, ThemeContextValue, ThemeProviderProps, ThemeToggleProps };
