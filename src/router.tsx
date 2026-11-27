import {
  createRouter,
  createRoute,
  createRootRoute,
  lazyRouteComponent,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { RootProviders } from "@/components/site/root-providers";
import { RoutePending } from "@/components/route/route-pending";
import { RouteError } from "@/components/route/route-error";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { supportsViewTransitionTypes } from "@/lib/view-transition";

// Root route: providers only, so the landing page can own the full viewport.
const rootRoute = createRootRoute({
  component: RootProviders,
  pendingComponent: RoutePending,
  errorComponent: (props: ErrorComponentProps) => <RouteError {...props} />,
});

// Marketing landing page (lazy loaded)
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("@/pages/landing")),
});

// App shell: sidebar + scrolling content area for docs and component pages.
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_app",
  component: lazyRouteComponent(
    () => import("@/components/site/app-layout"),
    "AppLayout",
  ),
});

const overviewRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/overview",
  component: lazyRouteComponent(() => import("@/pages/overview")),
});

const uiPreviewRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/ui-preview",
  component: lazyRouteComponent(() => import("@/pages/ui-preview")),
});

// Documentation routes (lazy loaded)
const docsIntroductionRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/docs/introduction",
  component: lazyRouteComponent(() => import("@/pages/docs/introduction")),
});

const docsInstallationRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/docs/installation",
  component: lazyRouteComponent(() => import("@/pages/docs/installation")),
});

const docsThemingRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/docs/theming",
  component: lazyRouteComponent(() => import("@/pages/docs/theming")),
});

const docsTransitionsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/docs/transitions",
  component: lazyRouteComponent(() => import("@/pages/docs/transitions")),
});

const docsCliRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/docs/cli",
  component: lazyRouteComponent(() => import("@/pages/docs/cli")),
});

const docsTypesetRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/docs/typeset",
  component: lazyRouteComponent(() => import("@/pages/docs/typeset")),
});

const docsFormRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/docs/form",
  component: lazyRouteComponent(() => import("@/pages/docs/form")),
});

const docsChangelogRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/docs/changelog",
  component: lazyRouteComponent(() => import("@/pages/docs/changelog")),
});

// Component routes (lazy loaded)
const buttonRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/button",
  component: lazyRouteComponent(() => import("@/pages/components/button")),
});

const cardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/card",
  component: lazyRouteComponent(() => import("@/pages/components/card")),
});

const inputRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/input",
  component: lazyRouteComponent(() => import("@/pages/components/input")),
});

const selectRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/select",
  component: lazyRouteComponent(() => import("@/pages/components/select")),
});

const textareaRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/textarea",
  component: lazyRouteComponent(() => import("@/pages/components/textarea")),
});

const fieldRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/field",
  component: lazyRouteComponent(() => import("@/pages/components/field")),
});

const inputGroupRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/input-group",
  component: lazyRouteComponent(() => import("@/pages/components/input-group")),
});

const badgeRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/badge",
  component: lazyRouteComponent(() => import("@/pages/components/badge")),
});

const alertDialogRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/alert-dialog",
  component: lazyRouteComponent(
    () => import("@/pages/components/alert-dialog"),
  ),
});

const dropdownMenuRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/dropdown-menu",
  component: lazyRouteComponent(
    () => import("@/pages/components/dropdown-menu"),
  ),
});

const separatorRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/separator",
  component: lazyRouteComponent(() => import("@/pages/components/separator")),
});

const labelRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/label",
  component: lazyRouteComponent(() => import("@/pages/components/label")),
});

const accordionRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/accordion",
  component: lazyRouteComponent(() => import("@/pages/components/accordion")),
});

const alertRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/alert",
  component: lazyRouteComponent(() => import("@/pages/components/alert")),
});

const aspectRatioRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/aspect-ratio",
  component: lazyRouteComponent(
    () => import("@/pages/components/aspect-ratio"),
  ),
});

const avatarRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/avatar",
  component: lazyRouteComponent(() => import("@/pages/components/avatar")),
});

const buttonGroupRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/button-group",
  component: lazyRouteComponent(
    () => import("@/pages/components/button-group"),
  ),
});

const breadcrumbRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/breadcrumb",
  component: lazyRouteComponent(() => import("@/pages/components/breadcrumb")),
});

const calendarRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/calendar",
  component: lazyRouteComponent(() => import("@/pages/components/calendar")),
});

const dialogRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/dialog",
  component: lazyRouteComponent(() => import("@/pages/components/dialog")),
});

const drawerRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/drawer",
  component: lazyRouteComponent(() => import("@/pages/components/drawer")),
});

const emptyRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/empty",
  component: lazyRouteComponent(() => import("@/pages/components/empty")),
});

const popoverRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/popover",
  component: lazyRouteComponent(() => import("@/pages/components/popover")),
});

const hoverCardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/hover-card",
  component: lazyRouteComponent(() => import("@/pages/components/hover-card")),
});

const kbdRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/kbd",
  component: lazyRouteComponent(() => import("@/pages/components/kbd")),
});

const menubarRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/menubar",
  component: lazyRouteComponent(() => import("@/pages/components/menubar")),
});

const navigationMenuRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/navigation-menu",
  component: lazyRouteComponent(
    () => import("@/pages/components/navigation-menu"),
  ),
});

const paginationRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/pagination",
  component: lazyRouteComponent(() => import("@/pages/components/pagination")),
});

const progressRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/progress",
  component: lazyRouteComponent(() => import("@/pages/components/progress")),
});

const radioGroupRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/radio-group",
  component: lazyRouteComponent(() => import("@/pages/components/radio-group")),
});

const resizableRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/resizable",
  component: lazyRouteComponent(() => import("@/pages/components/resizable")),
});

const skeletonRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/skeleton",
  component: lazyRouteComponent(() => import("@/pages/components/skeleton")),
});

const sliderRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/slider",
  component: lazyRouteComponent(() => import("@/pages/components/slider")),
});

const switchRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/switch",
  component: lazyRouteComponent(() => import("@/pages/components/switch")),
});

const contextMenuRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/context-menu",
  component: lazyRouteComponent(
    () => import("@/pages/components/context-menu"),
  ),
});

const tableRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/table",
  component: lazyRouteComponent(() => import("@/pages/components/table")),
});

const dataTableRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/data-table",
  component: lazyRouteComponent(() => import("@/pages/components/data-table")),
});

const tabsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/tabs",
  component: lazyRouteComponent(() => import("@/pages/components/tabs")),
});

const toastRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/toast",
  component: lazyRouteComponent(() => import("@/pages/components/toast")),
});

const toggleRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/toggle",
  component: lazyRouteComponent(() => import("@/pages/components/toggle")),
});

const tooltipRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/tooltip",
  component: lazyRouteComponent(() => import("@/pages/components/tooltip")),
});

const typographyRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/typography",
  component: lazyRouteComponent(() => import("@/pages/components/typography")),
});

const checkboxRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/checkbox",
  component: lazyRouteComponent(() => import("@/pages/components/checkbox")),
});

const treeViewRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/tree-view",
  component: lazyRouteComponent(() => import("@/pages/components/tree-view")),
});

const fileUploadRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/file-upload",
  component: lazyRouteComponent(() => import("@/pages/components/file-upload")),
});

const sidebarRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/sidebar",
  component: lazyRouteComponent(() => import("@/pages/components/sidebar")),
});

const colorPickerRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/color-picker",
  component: lazyRouteComponent(
    () => import("@/pages/components/color-picker"),
  ),
});

const colorUsageRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/color-usage",
  component: lazyRouteComponent(() => import("@/pages/components/color-usage")),
});

const flexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/flex",
  component: lazyRouteComponent(() => import("@/pages/components/flex")),
});

const stackRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/stack",
  component: lazyRouteComponent(() => import("@/pages/components/stack")),
});

const gridRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/grid",
  component: lazyRouteComponent(() => import("@/pages/components/grid")),
});

const containerRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/container",
  component: lazyRouteComponent(() => import("@/pages/components/container")),
});

const scrollAreaRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/scroll-area",
  component: lazyRouteComponent(() => import("@/pages/components/scroll-area")),
});

const layoutUtilitiesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/layout-utilities",
  component: lazyRouteComponent(
    () => import("@/pages/components/layout-utilities"),
  ),
});

const kanbanRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/kanban",
  component: lazyRouteComponent(() => import("@/pages/components/kanban")),
});

const carouselRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/carousel",
  component: lazyRouteComponent(() => import("@/pages/components/carousel")),
});

const spotlightRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/spotlight",
  component: lazyRouteComponent(() => import("@/pages/components/spotlight")),
});

const statsCardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/stats-card",
  component: lazyRouteComponent(() => import("@/pages/components/stats-card")),
});

const timelineRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/timeline",
  component: lazyRouteComponent(() => import("@/pages/components/timeline")),
});

const timePickerRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/time-picker",
  component: lazyRouteComponent(() => import("@/pages/components/time-picker")),
});

const stepperRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/stepper",
  component: lazyRouteComponent(() => import("@/pages/components/stepper")),
});

const commandRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/command",
  component: lazyRouteComponent(() => import("@/pages/components/command")),
});

const announcementBarRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/announcement-bar",
  component: lazyRouteComponent(
    () => import("@/pages/components/announcement-bar"),
  ),
});

const collapsibleRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/collapsible",
  component: lazyRouteComponent(() => import("@/pages/components/collapsible")),
});

const datePickerRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/date-picker",
  component: lazyRouteComponent(() => import("@/pages/components/date-picker")),
});

const modalRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/modal",
  component: lazyRouteComponent(() => import("@/pages/components/modal")),
});

const progressIndicatorRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/progress-indicator",
  component: lazyRouteComponent(
    () => import("@/pages/components/progress-indicator"),
  ),
});

const sheetRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/sheet",
  component: lazyRouteComponent(() => import("@/pages/components/sheet")),
});

const spinnerRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/spinner",
  component: lazyRouteComponent(() => import("@/pages/components/spinner")),
});

const boxRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/box",
  component: lazyRouteComponent(() => import("@/pages/components/box")),
});

const centerRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/center",
  component: lazyRouteComponent(() => import("@/pages/components/center")),
});

const codeBlockRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/code-block",
  component: lazyRouteComponent(() => import("@/pages/components/code-block")),
});

const imageRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/image",
  component: lazyRouteComponent(() => import("@/pages/components/image")),
});

const spacerRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/spacer",
  component: lazyRouteComponent(() => import("@/pages/components/spacer")),
});

const splitViewRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/split-view",
  component: lazyRouteComponent(() => import("@/pages/components/split-view")),
});

const toggleGroupRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/toggle-group",
  component: lazyRouteComponent(
    () => import("@/pages/components/toggle-group"),
  ),
});

const videoPlayerRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/video-player",
  component: lazyRouteComponent(
    () => import("@/pages/components/video-player"),
  ),
});

const cameraRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/camera",
  component: lazyRouteComponent(() => import("@/pages/components/camera")),
});

const routeTransitionRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/route-transition",
  component: lazyRouteComponent(
    () => import("@/pages/components/route-transition"),
  ),
});

const themeProviderRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/components/theme-provider",
  component: lazyRouteComponent(
    () => import("@/pages/components/theme-provider"),
  ),
});

// Build route tree
const routeTree = rootRoute.addChildren([
  landingRoute,
  appRoute.addChildren([
    overviewRoute,
    uiPreviewRoute,
    docsIntroductionRoute,
    docsInstallationRoute,
    docsThemingRoute,
    docsTransitionsRoute,
    docsCliRoute,
    docsTypesetRoute,
    docsFormRoute,
    docsChangelogRoute,
    buttonRoute,
    cardRoute,
    inputRoute,
    selectRoute,
    textareaRoute,
    fieldRoute,
    inputGroupRoute,
    badgeRoute,
    alertDialogRoute,
    dropdownMenuRoute,
    separatorRoute,
    labelRoute,
    accordionRoute,
    alertRoute,
    aspectRatioRoute,
    avatarRoute,
    buttonGroupRoute,
    breadcrumbRoute,
    calendarRoute,
    dialogRoute,
    drawerRoute,
    emptyRoute,
    popoverRoute,
    hoverCardRoute,
    kbdRoute,
    menubarRoute,
    navigationMenuRoute,
    paginationRoute,
    progressRoute,
    radioGroupRoute,
    resizableRoute,
    skeletonRoute,
    sliderRoute,
    switchRoute,
    contextMenuRoute,
    tableRoute,
    dataTableRoute,
    tabsRoute,
    toastRoute,
    toggleRoute,
    tooltipRoute,
    typographyRoute,
    checkboxRoute,
    treeViewRoute,
    fileUploadRoute,
    sidebarRoute,
    colorPickerRoute,
    colorUsageRoute,
    flexRoute,
    stackRoute,
    gridRoute,
    containerRoute,
    scrollAreaRoute,
    layoutUtilitiesRoute,
    kanbanRoute,
    carouselRoute,
    spotlightRoute,
    statsCardRoute,
    timelineRoute,
    timePickerRoute,
    stepperRoute,
    commandRoute,
    announcementBarRoute,
    collapsibleRoute,
    datePickerRoute,
    modalRoute,
    progressIndicatorRoute,
    sheetRoute,
    spinnerRoute,
    boxRoute,
    centerRoute,
    codeBlockRoute,
    imageRoute,
    spacerRoute,
    splitViewRoute,
    toggleGroupRoute,
    videoPlayerRoute,
    cameraRoute,
    routeTransitionRoute,
    themeProviderRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  // Crossfade only real client navigations; never trigger on initial load.
  defaultViewTransition: supportsViewTransitionTypes() && {
    types: ({ fromLocation, pathChanged }) =>
      Boolean(fromLocation) && pathChanged && !prefersReducedMotion()
        ? ["route-change"]
        : false,
  },
});

function formatSegmentTitle(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function syncDocumentMeta(pathname: string): void {
  if (typeof document === "undefined") return;

  const cleanPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  let title = "Kira Kit — Accessible React Component Registry";

  let description =
    "Accessible React components built on Base UI, Tailwind CSS v4, and TypeScript. Install the source into your repo with OKLCH theme presets and WCAG AA contrast.";

  if (cleanPath === "/overview") {
    title = "Overview — Kira Kit";
    description =
      "Explore the Kira Kit component catalog, architecture pillars, 4px spacing contract, and quickstart CLI commands.";
  } else if (cleanPath === "/ui-preview") {
    title = "UI Preview — Kira Kit";
    description =
      "Interactive playground comparing the 4px control ladder, inputs, overlays, and live light/dark OKLCH theme presets.";
  } else if (cleanPath.startsWith("/components/")) {
    const name = formatSegmentTitle(cleanPath.slice("/components/".length));
    title = `${name} — Kira Kit`;
    description = `${name} React component built on Base UI with accessible keyboard support, Tailwind CSS v4 variants, and copy-ready source.`;
  } else if (cleanPath.startsWith("/docs/")) {
    const name = formatSegmentTitle(cleanPath.slice("/docs/".length));
    title = `${name} — Kira Kit Docs`;
    description = `Kira Kit documentation for ${name.toLowerCase()}: setup, configuration, and best practices.`;
  }

  document.title = title;

  const metaDescription = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]',
  );

  if (metaDescription) {
    metaDescription.content = description;
  }

  const canonical = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );

  if (canonical) {
    canonical.href = `${window.location.origin}${cleanPath}`;
  }
}

router.subscribe("onResolved", ({ toLocation }) => {
  syncDocumentMeta(toLocation.pathname);
});

// Type declaration for router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
