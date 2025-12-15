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
import { ComboboxPage } from "@/pages/components/combobox";
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
import { AutocompletePage } from "@/pages/components/autocomplete";
import { CalendarPage } from "@/pages/components/calendar";
import { DialogPage } from "@/pages/components/dialog";
import { DrawerPage } from "@/pages/components/drawer";
import { EmptyPage } from "@/pages/components/empty";
import { PopoverPage } from "@/pages/components/popover";

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

const comboboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/combobox",
  component: ComboboxPage,
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

const autocompleteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/components/autocomplete",
  component: AutocompletePage,
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

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  buttonRoute,
  cardRoute,
  inputRoute,
  selectRoute,
  comboboxRoute,
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
  autocompleteRoute,
  calendarRoute,
  dialogRoute,
  drawerRoute,
  emptyRoute,
  popoverRoute,
]);

// Create router
export const router = createRouter({ routeTree });

// Type declaration for router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
