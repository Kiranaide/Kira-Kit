import {
  createRouter,
  createRoute,
  createRootRoute,
  lazyRouteComponent,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { RoutePending } from "@/components/route/route-pending";
import { RouteError } from "@/components/route/route-error";

// Root route with layout
const rootRoute = createRootRoute({
  component: AppLayout,
  pendingComponent: RoutePending,
  errorComponent: (props: ErrorComponentProps) => <RouteError {...props} />,
});

// Index route (lazy loaded)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("@/pages/overview")),
});

const uiPreviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ui-preview",
  component: lazyRouteComponent(() => import("@/pages/ui-preview")),
});

// Documentation routes (lazy loaded)
const docsIntroductionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs/introduction",
  component: lazyRouteComponent(() => import("@/pages/docs/introduction")),
});

const docsInstallationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs/installation",
  component: lazyRouteComponent(() => import("@/pages/docs/installation")),
});

const docsThemingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs/theming",
  component: lazyRouteComponent(() => import("@/pages/docs/theming")),
});

const docsTransitionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs/transitions",
  component: lazyRouteComponent(() => import("@/pages/docs/transitions")),
});

const docsCliRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs/cli",
  component: lazyRouteComponent(() => import("@/pages/docs/cli")),
});

const docsTypesetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs/typeset",
  component: lazyRouteComponent(() => import("@/pages/docs/typeset")),
});

const docsFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs/form",
  component: lazyRouteComponent(() => import("@/pages/docs/form")),
});

const docsChangelogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs/changelog",
  component: lazyRouteComponent(() => import("@/pages/docs/changelog")),
});

// Component routes (lazy loaded)
const buttonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/button",
  component: lazyRouteComponent(() => import("@/pages/components/button")),
});

const cardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/card",
  component: lazyRouteComponent(() => import("@/pages/components/card")),
});

const inputRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/input",
  component: lazyRouteComponent(() => import("@/pages/components/input")),
});

const selectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/select",
  component: lazyRouteComponent(() => import("@/pages/components/select")),
});

const textareaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/textarea",
  component: lazyRouteComponent(() => import("@/pages/components/textarea")),
});

const fieldRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/field",
  component: lazyRouteComponent(() => import("@/pages/components/field")),
});

const inputGroupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/input-group",
  component: lazyRouteComponent(() => import("@/pages/components/input-group")),
});

const badgeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/badge",
  component: lazyRouteComponent(() => import("@/pages/components/badge")),
});

const alertDialogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/alert-dialog",
  component: lazyRouteComponent(
    () => import("@/pages/components/alert-dialog"),
  ),
});

const dropdownMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/dropdown-menu",
  component: lazyRouteComponent(
    () => import("@/pages/components/dropdown-menu"),
  ),
});

const separatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/separator",
  component: lazyRouteComponent(() => import("@/pages/components/separator")),
});

const labelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/label",
  component: lazyRouteComponent(() => import("@/pages/components/label")),
});

const accordionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/accordion",
  component: lazyRouteComponent(() => import("@/pages/components/accordion")),
});

const alertRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/alert",
  component: lazyRouteComponent(() => import("@/pages/components/alert")),
});

const aspectRatioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/aspect-ratio",
  component: lazyRouteComponent(
    () => import("@/pages/components/aspect-ratio"),
  ),
});

const avatarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/avatar",
  component: lazyRouteComponent(() => import("@/pages/components/avatar")),
});

const buttonGroupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/button-group",
  component: lazyRouteComponent(
    () => import("@/pages/components/button-group"),
  ),
});

const breadcrumbRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/breadcrumb",
  component: lazyRouteComponent(() => import("@/pages/components/breadcrumb")),
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/calendar",
  component: lazyRouteComponent(() => import("@/pages/components/calendar")),
});

const dialogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/dialog",
  component: lazyRouteComponent(() => import("@/pages/components/dialog")),
});

const drawerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/drawer",
  component: lazyRouteComponent(() => import("@/pages/components/drawer")),
});

const emptyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/empty",
  component: lazyRouteComponent(() => import("@/pages/components/empty")),
});

const popoverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/popover",
  component: lazyRouteComponent(() => import("@/pages/components/popover")),
});

const hoverCardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/hover-card",
  component: lazyRouteComponent(() => import("@/pages/components/hover-card")),
});

const kbdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/kbd",
  component: lazyRouteComponent(() => import("@/pages/components/kbd")),
});

const menubarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/menubar",
  component: lazyRouteComponent(() => import("@/pages/components/menubar")),
});

const navigationMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/navigation-menu",
  component: lazyRouteComponent(
    () => import("@/pages/components/navigation-menu"),
  ),
});

const paginationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/pagination",
  component: lazyRouteComponent(() => import("@/pages/components/pagination")),
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/progress",
  component: lazyRouteComponent(() => import("@/pages/components/progress")),
});

const radioGroupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/radio-group",
  component: lazyRouteComponent(() => import("@/pages/components/radio-group")),
});

const resizableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/resizable",
  component: lazyRouteComponent(() => import("@/pages/components/resizable")),
});

const skeletonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/skeleton",
  component: lazyRouteComponent(() => import("@/pages/components/skeleton")),
});

const sliderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/slider",
  component: lazyRouteComponent(() => import("@/pages/components/slider")),
});

const switchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/switch",
  component: lazyRouteComponent(() => import("@/pages/components/switch")),
});

const contextMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/context-menu",
  component: lazyRouteComponent(
    () => import("@/pages/components/context-menu"),
  ),
});

const tableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/table",
  component: lazyRouteComponent(() => import("@/pages/components/table")),
});

const dataTableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/data-table",
  component: lazyRouteComponent(() => import("@/pages/components/data-table")),
});

const tabsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/tabs",
  component: lazyRouteComponent(() => import("@/pages/components/tabs")),
});

const toastRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/toast",
  component: lazyRouteComponent(() => import("@/pages/components/toast")),
});

const toggleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/toggle",
  component: lazyRouteComponent(() => import("@/pages/components/toggle")),
});

const tooltipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/tooltip",
  component: lazyRouteComponent(() => import("@/pages/components/tooltip")),
});

const typographyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/typography",
  component: lazyRouteComponent(() => import("@/pages/components/typography")),
});

const checkboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/checkbox",
  component: lazyRouteComponent(() => import("@/pages/components/checkbox")),
});

const treeViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/tree-view",
  component: lazyRouteComponent(() => import("@/pages/components/tree-view")),
});

const fileUploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/file-upload",
  component: lazyRouteComponent(() => import("@/pages/components/file-upload")),
});

const sidebarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/sidebar",
  component: lazyRouteComponent(() => import("@/pages/components/sidebar")),
});

const colorPickerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/color-picker",
  component: lazyRouteComponent(
    () => import("@/pages/components/color-picker"),
  ),
});

const colorUsageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/color-usage",
  component: lazyRouteComponent(() => import("@/pages/components/color-usage")),
});

const flexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/flex",
  component: lazyRouteComponent(() => import("@/pages/components/flex")),
});

const stackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/stack",
  component: lazyRouteComponent(() => import("@/pages/components/stack")),
});

const gridRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/grid",
  component: lazyRouteComponent(() => import("@/pages/components/grid")),
});

const containerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/container",
  component: lazyRouteComponent(() => import("@/pages/components/container")),
});

const scrollAreaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/scroll-area",
  component: lazyRouteComponent(() => import("@/pages/components/scroll-area")),
});

const layoutUtilitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/layout-utilities",
  component: lazyRouteComponent(
    () => import("@/pages/components/layout-utilities"),
  ),
});

const kanbanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/kanban",
  component: lazyRouteComponent(() => import("@/pages/components/kanban")),
});

const carouselRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/carousel",
  component: lazyRouteComponent(() => import("@/pages/components/carousel")),
});

const spotlightRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/spotlight",
  component: lazyRouteComponent(() => import("@/pages/components/spotlight")),
});

const statsCardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/stats-card",
  component: lazyRouteComponent(() => import("@/pages/components/stats-card")),
});

const timelineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/timeline",
  component: lazyRouteComponent(() => import("@/pages/components/timeline")),
});

const timePickerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/time-picker",
  component: lazyRouteComponent(() => import("@/pages/components/time-picker")),
});

const stepperRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/stepper",
  component: lazyRouteComponent(() => import("@/pages/components/stepper")),
});

const commandRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/command",
  component: lazyRouteComponent(() => import("@/pages/components/command")),
});

const announcementBarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/announcement-bar",
  component: lazyRouteComponent(
    () => import("@/pages/components/announcement-bar"),
  ),
});

const collapsibleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/collapsible",
  component: lazyRouteComponent(() => import("@/pages/components/collapsible")),
});

const datePickerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/date-picker",
  component: lazyRouteComponent(() => import("@/pages/components/date-picker")),
});

const modalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/modal",
  component: lazyRouteComponent(() => import("@/pages/components/modal")),
});

const progressIndicatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/progress-indicator",
  component: lazyRouteComponent(
    () => import("@/pages/components/progress-indicator"),
  ),
});

const sheetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/sheet",
  component: lazyRouteComponent(() => import("@/pages/components/sheet")),
});

const spinnerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/spinner",
  component: lazyRouteComponent(() => import("@/pages/components/spinner")),
});

const boxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/box",
  component: lazyRouteComponent(() => import("@/pages/components/box")),
});

const centerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/center",
  component: lazyRouteComponent(() => import("@/pages/components/center")),
});

const codeBlockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/code-block",
  component: lazyRouteComponent(() => import("@/pages/components/code-block")),
});

const imageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/image",
  component: lazyRouteComponent(() => import("@/pages/components/image")),
});

const spacerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/spacer",
  component: lazyRouteComponent(() => import("@/pages/components/spacer")),
});

const splitViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/split-view",
  component: lazyRouteComponent(() => import("@/pages/components/split-view")),
});

const toggleGroupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/toggle-group",
  component: lazyRouteComponent(
    () => import("@/pages/components/toggle-group"),
  ),
});

const videoPlayerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/video-player",
  component: lazyRouteComponent(
    () => import("@/pages/components/video-player"),
  ),
});

const cameraRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/camera",
  component: lazyRouteComponent(() => import("@/pages/components/camera")),
});

const routeTransitionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/route-transition",
  component: lazyRouteComponent(
    () => import("@/pages/components/route-transition"),
  ),
});

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
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
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  // Crossfade only real path changes; search/hash updates stay instant.
  defaultViewTransition: {
    types: ({ pathChanged }) => (pathChanged ? ["route-change"] : false),
  },
});

// Type declaration for router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
