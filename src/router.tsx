import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";

// Pages
import { OverviewPage } from "@/pages/overview";
import { ButtonPage } from "@/pages/components/button";
import { CardPage } from "@/pages/components/card";
import { InputPage } from "@/pages/components/input";
import { SelectPage } from "@/pages/components/select";
import { TextareaPage } from "@/pages/components/textarea";
import { FieldPage } from "@/pages/components/field";
import { InputGroupPage } from "@/pages/components/input-group";
import { BadgePage } from "@/pages/components/badge";
import { AlertDialogPage } from "@/pages/components/alert-dialog";
import { DropdownMenuPage } from "@/pages/components/dropdown-menu";
import { SeparatorPage } from "@/pages/components/separator";
import { LabelPage } from "@/pages/components/label";
import { AccordionPage } from "@/pages/components/accordion";
import { AlertPage } from "@/pages/components/alert";
import { AspectRatioPage } from "@/pages/components/aspect-ratio";
import { AvatarPage } from "@/pages/components/avatar";
import { ButtonGroupPage } from "@/pages/components/button-group";
import CalendarPage from "@/pages/components/calendar";
import { DialogPage } from "@/pages/components/dialog";
import { DrawerPage } from "@/pages/components/drawer";
import { EmptyPage } from "@/pages/components/empty";
import { PopoverPage } from "@/pages/components/popover";
import { HoverCardPage } from "@/pages/components/hover-card";
import { KbdPage } from "@/pages/components/kbd";
import { MenubarPage } from "@/pages/components/menubar";
import { NavigationMenuPage } from "@/pages/components/navigation-menu";
import { PaginationPage } from "@/pages/components/pagination";
import { ProgressPage } from "@/pages/components/progress";
import { RadioGroupPage } from "@/pages/components/radio-group";
import { ResizablePage } from "@/pages/components/resizable";
import { SkeletonPage } from "@/pages/components/skeleton";
import SliderPage from "@/pages/components/slider";
import { SwitchPage } from "@/pages/components/switch";
import { ContextMenuPage } from "@/pages/components/context-menu";
import { TablePage } from "@/pages/components/table";
import { DataTablePage } from "@/pages/components/data-table";
import { TabsPage } from "@/pages/components/tabs";
import { ToastPage } from "@/pages/components/toast";
import { TogglePage } from "@/pages/components/toggle";
import TooltipPage from "@/pages/components/tooltip";
import TypographyPage from "@/pages/components/typography";
import { CheckboxPage } from "@/pages/components/checkbox";
import TreeViewPage from "@/pages/components/tree-view";
import { FileUploadPage } from "@/pages/components/file-upload";
import SidebarPage from "@/pages/components/sidebar";
import { ColorPickerPage } from "@/pages/components/color-picker";
import { ColorUsagePage } from "@/pages/components/color-usage";
import { FlexPage } from "@/pages/components/flex";
import { StackPage } from "@/pages/components/stack";
import GridPage from "@/pages/components/grid";
import ContainerPage from "@/pages/components/container";
import { ScrollAreaPage } from "@/pages/components/scroll-area";
import { LayoutUtilitiesPage } from "@/pages/components/layout-utilities";
import KanbanPage from "@/pages/components/kanban";
import CarouselPage from "@/pages/components/carousel";
import BreadcrumbPage from "@/pages/components/breadcrumb";
import SpotlightPage from "@/pages/components/spotlight";
import StatsCardPage from "@/pages/components/stats-card";
import TimelinePage from "@/pages/components/timeline";
import { StepperPage } from "@/pages/components/stepper";
import CommandPage from "@/pages/components/command";
import AnnouncementBarPage from "@/pages/components/announcement-bar";
import { CollapsiblePage } from "@/pages/components/collapsible";
import DatePickerPage from "@/pages/components/date-picker";
import { LinkPage } from "@/pages/components/link";
import ModalPage from "@/pages/components/modal";
import { ProgressIndicatorPage } from "@/pages/components/progress-indicator";
import { SheetPage } from "@/pages/components/sheet";
import { SpinnerPage } from "@/pages/components/spinner";
import { BoxPage } from "@/pages/components/box";
import { CenterPage } from "@/pages/components/center";
import { CodeBlockPage } from "@/pages/components/code-block";
import IconButtonPage from "@/pages/components/icon-button";
import ImagePage from "@/pages/components/image";
import { SpacerPage } from "@/pages/components/spacer";
import SplitViewPage from "@/pages/components/split-view";
import ToggleGroupPage from "@/pages/components/toggle-group";
import VideoPlayerPage from "@/pages/components/video-player";

// Root route with layout
const rootRoute = createRootRoute({
  component: AppLayout,
});

// Index route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: OverviewPage,
});

// Component routes
const buttonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/button",
  component: ButtonPage,
});

const cardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/card",
  component: CardPage,
});

const inputRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/input",
  component: InputPage,
});

const selectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/select",
  component: SelectPage,
});

const textareaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/textarea",
  component: TextareaPage,
});

const fieldRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/field",
  component: FieldPage,
});

const inputGroupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/input-group",
  component: InputGroupPage,
});

const badgeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/badge",
  component: BadgePage,
});

const alertDialogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/alert-dialog",
  component: AlertDialogPage,
});

const dropdownMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/dropdown-menu",
  component: DropdownMenuPage,
});

const separatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/separator",
  component: SeparatorPage,
});

const labelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/label",
  component: LabelPage,
});

const accordionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/accordion",
  component: AccordionPage,
});

const alertRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/alert",
  component: AlertPage,
});

const aspectRatioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/aspect-ratio",
  component: AspectRatioPage,
});

const avatarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/avatar",
  component: AvatarPage,
});

const buttonGroupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/button-group",
  component: ButtonGroupPage,
});

const breadcrumbRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/breadcrumb",
  component: BreadcrumbPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/calendar",
  component: CalendarPage,
});

const dialogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/dialog",
  component: DialogPage,
});

const drawerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/drawer",
  component: DrawerPage,
});

const emptyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/empty",
  component: EmptyPage,
});

const popoverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/popover",
  component: PopoverPage,
});

const hoverCardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/hover-card",
  component: HoverCardPage,
});

const kbdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/kbd",
  component: KbdPage,
});

const menubarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/menubar",
  component: MenubarPage,
});

const navigationMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/navigation-menu",
  component: NavigationMenuPage,
});

const paginationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/pagination",
  component: PaginationPage,
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/progress",
  component: ProgressPage,
});

const radioGroupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/radio-group",
  component: RadioGroupPage,
});

const resizableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/resizable",
  component: ResizablePage,
});

const skeletonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/skeleton",
  component: SkeletonPage,
});

const sliderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/slider",
  component: SliderPage,
});

const switchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/switch",
  component: SwitchPage,
});

const contextMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/context-menu",
  component: ContextMenuPage,
});

const tableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/table",
  component: TablePage,
});

const dataTableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/data-table",
  component: DataTablePage,
});

const tabsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/tabs",
  component: TabsPage,
});

const toastRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/toast",
  component: ToastPage,
});

const toggleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/toggle",
  component: TogglePage,
});

const tooltipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/tooltip",
  component: TooltipPage,
});

const typographyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/typography",
  component: TypographyPage,
});

const checkboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/checkbox",
  component: CheckboxPage,
});

const treeViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/tree-view",
  component: TreeViewPage,
});

const fileUploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/file-upload",
  component: FileUploadPage,
});

const sidebarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/sidebar",
  component: SidebarPage,
});

const colorPickerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/color-picker",
  component: ColorPickerPage,
});

const colorUsageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/color-usage",
  component: ColorUsagePage,
});

const flexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/flex",
  component: FlexPage,
});

const stackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/stack",
  component: StackPage,
});

const gridRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/grid",
  component: GridPage,
});

const containerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/container",
  component: ContainerPage,
});

const scrollAreaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/scroll-area",
  component: ScrollAreaPage,
});

const layoutUtilitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/layout-utilities",
  component: LayoutUtilitiesPage,
});

const kanbanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/kanban",
  component: KanbanPage,
});

const carouselRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/carousel",
  component: CarouselPage,
});

const spotlightRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/spotlight",
  component: SpotlightPage,
});

const statsCardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/stats-card",
  component: StatsCardPage,
});

const timelineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/timeline",
  component: TimelinePage,
});

const stepperRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/stepper",
  component: StepperPage,
});

const commandRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/command",
  component: CommandPage,
});

const announcementBarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/announcement-bar",
  component: AnnouncementBarPage,
});

const collapsibleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/collapsible",
  component: CollapsiblePage,
});

const datePickerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/date-picker",
  component: DatePickerPage,
});

const linkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/link",
  component: LinkPage,
});

const modalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/modal",
  component: ModalPage,
});

const progressIndicatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/progress-indicator",
  component: ProgressIndicatorPage,
});

const sheetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/sheet",
  component: SheetPage,
});

const spinnerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/spinner",
  component: SpinnerPage,
});

const boxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/box",
  component: BoxPage,
});

const centerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/center",
  component: CenterPage,
});

const codeBlockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/code-block",
  component: CodeBlockPage,
});

const iconButtonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/icon-button",
  component: IconButtonPage,
});

const imageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/image",
  component: ImagePage,
});

const spacerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/spacer",
  component: SpacerPage,
});

const splitViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/split-view",
  component: SplitViewPage,
});

const toggleGroupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/toggle-group",
  component: ToggleGroupPage,
});

const videoPlayerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/video-player",
  component: VideoPlayerPage,
});

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
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
  stepperRoute,
  commandRoute,
  announcementBarRoute,
  collapsibleRoute,
  datePickerRoute,
  linkRoute,
  modalRoute,
  progressIndicatorRoute,
  sheetRoute,
  spinnerRoute,
  boxRoute,
  centerRoute,
  codeBlockRoute,
  iconButtonRoute,
  imageRoute,
  spacerRoute,
  splitViewRoute,
  toggleGroupRoute,
  videoPlayerRoute,
]);

// Create router
export const router = createRouter({ routeTree });

// Type declaration for router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
