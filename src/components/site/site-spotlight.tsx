import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { IconBrandGithub, IconMoon, IconSun } from "@tabler/icons-react";
import {
  KiraSpotlight,
  type SpotlightGroupType,
  type SpotlightItemType,
  type SpotlightScope,
} from "@/components/ui/spotlight";
import { useTheme } from "@/components/ui/theme-provider";
import {
  componentsNavigation,
  docsNavigation,
  layoutNavigation,
  primaryNavigation,
} from "@/components/site/site-navigation";
import { SITE_REPOSITORY_URL } from "@/components/site/site-chrome";

const SITE_SPOTLIGHT_SCOPES: SpotlightScope[] = [
  { id: "docs", label: "Docs" },
  { id: "layout", label: "Layout" },
  { id: "components", label: "Components" },
  { id: "actions", label: "Actions" },
];

type NavEntry = {
  readonly to: string;
  readonly label: string;
  readonly icon: React.ComponentType<{ className?: string }>;
};

function toRouteItems(
  entries: readonly NavEntry[],
  scope: string,
  extraKeywords: readonly string[],
  navigateTo: (to: string) => void,
): SpotlightItemType[] {
  return entries.map((entry) => {
    const Icon = entry.icon;

    return {
      id: entry.to,
      label: entry.label,
      description: entry.to,
      icon: <Icon className="size-4" />,
      scope,
      keywords: [...extraKeywords, entry.to.replaceAll("/", " ")],
      onSelect: () => navigateTo(entry.to),
    };
  });
}

function buildActionItems(
  theme: "light" | "dark",
  toggleTheme: () => void,
): SpotlightItemType[] {
  const isLight = theme === "light";

  return [
    {
      id: "action-toggle-theme",
      label: isLight ? "Switch to Dark Mode" : "Switch to Light Mode",
      description: "Toggle site color appearance",
      icon: isLight ? (
        <IconMoon className="size-4" />
      ) : (
        <IconSun className="size-4" />
      ),
      scope: "actions",
      keywords: ["theme", "dark", "light", "appearance", "mode"],
      onSelect: toggleTheme,
    },
    {
      id: "action-github",
      label: "Open GitHub Repository",
      description: SITE_REPOSITORY_URL,
      icon: <IconBrandGithub className="size-4" />,
      scope: "actions",
      keywords: ["github", "source", "repo", "code"],
      onSelect: () => {
        window.open(SITE_REPOSITORY_URL, "_blank", "noopener,noreferrer");
      },
    },
  ];
}

export function SiteSpotlightDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const navigateTo = React.useCallback(
    (to: string) => {
      void navigate({ to });
    },
    [navigate],
  );

  const groups = React.useMemo<SpotlightGroupType[]>(
    () => [
      {
        id: "pages",
        label: "Pages",
        items: toRouteItems(
          primaryNavigation,
          "docs",
          ["home", "start"],
          navigateTo,
        ),
      },
      {
        id: "docs",
        label: "Documentation",
        items: toRouteItems(
          docsNavigation,
          "docs",
          ["guide", "docs"],
          navigateTo,
        ),
      },
      {
        id: "layout",
        label: "Layout",
        items: toRouteItems(
          layoutNavigation,
          "layout",
          ["layout", "primitive"],
          navigateTo,
        ),
      },
      {
        id: "components",
        label: "Components",
        items: toRouteItems(
          componentsNavigation,
          "components",
          ["component", "ui"],
          navigateTo,
        ),
      },
      {
        id: "actions",
        label: "Preferences & Links",
        items: buildActionItems(theme, toggleTheme),
      },
    ],
    [navigateTo, theme, toggleTheme],
  );

  return (
    <KiraSpotlight
      open={open}
      onOpenChange={onOpenChange}
      groups={groups}
      scopes={SITE_SPOTLIGHT_SCOPES}
      rememberRecent
      maxRecent={5}
      title="Search Kira Kit"
      placeholder="Jump to a component, doc page, or action…"
      className="site-spotlight-dialog"
    />
  );
}
