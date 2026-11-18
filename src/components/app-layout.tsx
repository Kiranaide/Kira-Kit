import { Outlet } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarDivider,
  SidebarProvider,
  ThemeProvider,
  ThemeToggle,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { KiraToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  IconHome,
  IconClick,
  IconLayoutCards,
  IconForms,
  IconSelector,
  IconTextCaption,
  IconInputCheck,
  IconLayoutList,
  IconBadge,
  IconAlertCircle,
  IconMenu2,
  IconSeparator,
  IconTag,
  IconList,
  IconAlertTriangle,
  IconRectangle,
  IconUser,
  IconLayoutColumns,
  IconCalendar,
  IconLayoutSidebar,
  IconBox,
  IconInbox,
  IconMessageCircle,
  IconPointer,
  IconKeyboard,
  IconMenu,
  IconNavigation,
  IconNumbers,
  IconLoader,
  IconCircleDot,
  IconLayoutBoardSplit,
  IconBoxMultiple,
  IconAdjustmentsHorizontal,
  IconTable,
  IconFolder,
  IconToggleLeft,
  IconTooltip,
  IconTypography,
  IconSquareCheck,
  IconBinaryTree2,
  IconUpload,
  IconBell,
  IconPalette,
  IconColorPicker,
  IconChevronDown,
  IconChevronLeft,
  IconClock,
  IconMagnet,
  IconLoader2,
  IconClipboardList,
  IconSpeakerphone,
  IconLayoutKanban,
  IconChartBar,
  IconTimeline,
  IconSquare,
  IconFocus2,
  IconCode,
  IconPhoto,
  IconSpace,
  IconToggleRight,
  IconPlayerPlay,
  IconCamera,
  IconRuler2,
} from "@tabler/icons-react";

export function AppLayout() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <SidebarProvider>
          <KiraToastProvider />
          <div className="flex h-screen overflow-hidden">
            <header className="fixed top-0 left-0 right-0 z-40 flex items-center h-14 px-4 border-b border-border bg-background md:hidden">
              <SidebarTrigger />
              <div className="flex items-center gap-2 ml-2">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">
                    K
                  </span>
                </div>
                <span className="font-semibold text-foreground">Kira Kit</span>
              </div>
            </header>

            <Sidebar>
              <SidebarHeader />
              <SidebarContent>
                <SidebarItem to="/" icon={<IconHome className="w-5 h-5" />}>
                  Overview
                </SidebarItem>

                <SidebarItem
                  to="/ui-preview"
                  icon={<IconRuler2 className="w-5 h-5" />}
                >
                  UI Preview
                </SidebarItem>

                <SidebarDivider />

                <SidebarGroup label="Layout">
                  {layoutNavigation.map((item) => (
                    <SidebarItem
                      key={item.to}
                      to={item.to}
                      icon={<item.icon className="w-5 h-5" />}
                    >
                      {item.label}
                    </SidebarItem>
                  ))}
                </SidebarGroup>

                <SidebarDivider />

                <SidebarGroup label="Components">
                  {componentsNavigation.map((item) => (
                    <SidebarItem
                      key={item.to}
                      to={item.to}
                      icon={<item.icon className="w-5 h-5" />}
                    >
                      {item.label}
                    </SidebarItem>
                  ))}
                </SidebarGroup>

                <SidebarDivider />

                <SidebarGroup label="Settings">
                  <ThemeToggle />
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <main className="flex-1 overflow-y-auto bg-background pt-14 md:pt-0">
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

const layoutNavigation = [
  { to: "/components/box", icon: IconSquare, label: "Box" },
  { to: "/components/center", icon: IconFocus2, label: "Center" },
  { to: "/components/container", icon: IconBox, label: "Container" },
  { to: "/components/flex", icon: IconLayoutColumns, label: "Flex" },
  { to: "/components/grid", icon: IconTable, label: "Grid" },
  { to: "/components/stack", icon: IconLayoutList, label: "Stack" },
  {
    to: "/components/scroll-area",
    icon: IconChevronDown,
    label: "Scroll Area",
  },
  {
    to: "/components/layout-utilities",
    icon: IconBoxMultiple,
    label: "Utilities",
  },
] as const;

const componentsNavigation = [
  { to: "/components/accordion", icon: IconList, label: "Accordion" },
  { to: "/components/alert", icon: IconAlertTriangle, label: "Alert" },
  {
    to: "/components/alert-dialog",
    icon: IconAlertCircle,
    label: "Alert Dialog",
  },
  {
    to: "/components/announcement-bar",
    icon: IconSpeakerphone,
    label: "Announcement Bar",
  },
  {
    to: "/components/aspect-ratio",
    icon: IconRectangle,
    label: "Aspect Ratio",
  },
  { to: "/components/avatar", icon: IconUser, label: "Avatar" },
  { to: "/components/badge", icon: IconBadge, label: "Badge" },
  { to: "/components/button", icon: IconClick, label: "Button" },
  {
    to: "/components/button-group",
    icon: IconLayoutColumns,
    label: "Button Group",
  },
  { to: "/components/breadcrumb", icon: IconNavigation, label: "Breadcrumb" },
  { to: "/components/calendar", icon: IconCalendar, label: "Calendar" },
  { to: "/components/card", icon: IconLayoutCards, label: "Card" },
  { to: "/components/camera", icon: IconCamera, label: "Camera" },
  { to: "/components/carousel", icon: IconLayoutBoardSplit, label: "Carousel" },
  { to: "/components/checkbox", icon: IconSquareCheck, label: "Checkbox" },
  {
    to: "/components/collapsible",
    icon: IconChevronLeft,
    label: "Collapsible",
  },
  { to: "/components/code-block", icon: IconCode, label: "Code Block" },
  { to: "/components/color-usage", icon: IconPalette, label: "Color System" },
  {
    to: "/components/color-picker",
    icon: IconColorPicker,
    label: "Color Picker",
  },
  { to: "/components/command", icon: IconMenu, label: "Command" },
  { to: "/components/context-menu", icon: IconMenu2, label: "Context Menu" },
  { to: "/components/data-table", icon: IconLayoutList, label: "Data Table" },
  { to: "/components/date-picker", icon: IconCalendar, label: "Date Picker" },
  { to: "/components/dialog", icon: IconBox, label: "Dialog" },
  { to: "/components/drawer", icon: IconLayoutSidebar, label: "Drawer" },
  { to: "/components/dropdown-menu", icon: IconMenu2, label: "Dropdown Menu" },
  { to: "/components/empty", icon: IconInbox, label: "Empty" },
  { to: "/components/field", icon: IconInputCheck, label: "Field" },
  { to: "/components/file-upload", icon: IconUpload, label: "File Upload" },
  { to: "/components/hover-card", icon: IconPointer, label: "Hover Card" },
  { to: "/components/image", icon: IconPhoto, label: "Image" },
  { to: "/components/input", icon: IconForms, label: "Input" },
  { to: "/components/input-group", icon: IconLayoutList, label: "Input Group" },
  { to: "/components/kanban", icon: IconLayoutKanban, label: "Kanban" },
  { to: "/components/kbd", icon: IconKeyboard, label: "Kbd" },
  { to: "/components/label", icon: IconTag, label: "Label" },
  { to: "/components/menubar", icon: IconMenu, label: "Menubar" },
  { to: "/components/modal", icon: IconBox, label: "Modal" },
  {
    to: "/components/navigation-menu",
    icon: IconNavigation,
    label: "Navigation Menu",
  },
  { to: "/components/pagination", icon: IconNumbers, label: "Pagination" },
  { to: "/components/popover", icon: IconMessageCircle, label: "Popover" },
  { to: "/components/progress", icon: IconLoader, label: "Progress" },
  {
    to: "/components/progress-indicator",
    icon: IconNumbers,
    label: "Progress Indicator",
  },
  { to: "/components/radio-group", icon: IconCircleDot, label: "Radio Group" },
  {
    to: "/components/resizable",
    icon: IconLayoutBoardSplit,
    label: "Resizable",
  },
  { to: "/components/select", icon: IconSelector, label: "Select" },
  { to: "/components/separator", icon: IconSeparator, label: "Separator" },
  { to: "/components/sheet", icon: IconLayoutSidebar, label: "Sheet" },
  { to: "/components/skeleton", icon: IconBoxMultiple, label: "Skeleton" },
  {
    to: "/components/slider",
    icon: IconAdjustmentsHorizontal,
    label: "Slider",
  },
  { to: "/components/sidebar", icon: IconLayoutSidebar, label: "Sidebar" },
  { to: "/components/spinner", icon: IconLoader2, label: "Spinner" },
  {
    to: "/components/split-view",
    icon: IconLayoutColumns,
    label: "Split View",
  },
  { to: "/components/spacer", icon: IconSpace, label: "Spacer" },
  { to: "/components/spotlight", icon: IconMagnet, label: "Spotlight" },
  { to: "/components/stepper", icon: IconClipboardList, label: "Stepper" },
  { to: "/components/stats-card", icon: IconChartBar, label: "Stats Card" },
  { to: "/components/switch", icon: IconToggleLeft, label: "Switch" },
  { to: "/components/table", icon: IconTable, label: "Table" },
  { to: "/components/tabs", icon: IconFolder, label: "Tabs" },
  { to: "/components/textarea", icon: IconTextCaption, label: "Textarea" },
  { to: "/components/timeline", icon: IconTimeline, label: "Timeline" },
  { to: "/components/time-picker", icon: IconClock, label: "Time Picker" },
  { to: "/components/toast", icon: IconBell, label: "Toast" },
  { to: "/components/toggle", icon: IconToggleLeft, label: "Toggle" },
  {
    to: "/components/toggle-group",
    icon: IconToggleRight,
    label: "Toggle Group",
  },
  { to: "/components/tooltip", icon: IconTooltip, label: "Tooltip" },
  { to: "/components/tree-view", icon: IconBinaryTree2, label: "Tree View" },
  { to: "/components/typography", icon: IconTypography, label: "Typography" },
  {
    to: "/components/video-player",
    icon: IconPlayerPlay,
    label: "Video Player",
  },
] as const;
