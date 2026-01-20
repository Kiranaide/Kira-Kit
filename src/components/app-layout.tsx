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
import { Toaster } from "@/components/ui/sonner";
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
  IconSearch,
  IconListNumbers,
  IconTimeline,
} from "@tabler/icons-react";

export function AppLayout() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <SidebarProvider>
          <Toaster />
          <div className="flex h-screen overflow-hidden">
            {/* Mobile Header - only visible on small screens */}
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

            {/* Sidebar - hidden on mobile, visible on md+ */}
            <Sidebar>
              <SidebarHeader />
              <SidebarContent>
                <SidebarItem to="/" icon={<IconHome className="w-5 h-5" />}>
                  Overview
                </SidebarItem>

                <SidebarDivider />

                <SidebarGroup label="Layout">
                  <SidebarItem
                    to="/components/flex"
                    icon={<IconLayoutColumns className="w-5 h-5" />}
                  >
                    Flex
                  </SidebarItem>
                  <SidebarItem
                    to="/components/stack"
                    icon={<IconLayoutList className="w-5 h-5" />}
                  >
                    Stack
                  </SidebarItem>
                  <SidebarItem
                    to="/components/grid"
                    icon={<IconTable className="w-5 h-5" />}
                  >
                    Grid
                  </SidebarItem>
                  <SidebarItem
                    to="/components/container"
                    icon={<IconBox className="w-5 h-5" />}
                  >
                    Container
                  </SidebarItem>
                  <SidebarItem
                    to="/components/scroll-area"
                    icon={<IconChevronDown className="w-5 h-5" />}
                  >
                    Scroll Area
                  </SidebarItem>
                  <SidebarItem
                    to="/components/layout-utilities"
                    icon={<IconBoxMultiple className="w-5 h-5" />}
                  >
                    Utilities
                  </SidebarItem>
                </SidebarGroup>

                <SidebarDivider />

                <SidebarGroup label="Components">
                  <SidebarItem
                    to="/components/accordion"
                    icon={<IconList className="w-5 h-5" />}
                  >
                    Accordion
                  </SidebarItem>
                  <SidebarItem
                    to="/components/alert"
                    icon={<IconAlertTriangle className="w-5 h-5" />}
                  >
                    Alert
                  </SidebarItem>
                  <SidebarItem
                    to="/components/alert-dialog"
                    icon={<IconAlertCircle className="w-5 h-5" />}
                  >
                    Alert Dialog
                  </SidebarItem>
                  <SidebarItem
                    to="/components/aspect-ratio"
                    icon={<IconRectangle className="w-5 h-5" />}
                  >
                    Aspect Ratio
                  </SidebarItem>
                  <SidebarItem
                    to="/components/avatar"
                    icon={<IconUser className="w-5 h-5" />}
                  >
                    Avatar
                  </SidebarItem>
                  <SidebarItem
                    to="/components/badge"
                    icon={<IconBadge className="w-5 h-5" />}
                  >
                    Badge
                  </SidebarItem>
                  <SidebarItem
                    to="/components/button"
                    icon={<IconClick className="w-5 h-5" />}
                  >
                    Button
                  </SidebarItem>
<SidebarItem
                    to="/components/button-group"
                    icon={<IconLayoutColumns className="w-5 h-5" />}
                  >
                    Button Group
                  </SidebarItem>
                  <SidebarItem
                    to="/components/breadcrumb"
                    icon={<IconNavigation className="w-5 h-5" />}
                  >
                    Breadcrumb
                  </SidebarItem>
                  <SidebarItem
                    to="/components/calendar"
                    icon={<IconCalendar className="w-5 h-5" />}
                  >
                    Calendar
                  </SidebarItem>
<SidebarItem
                    to="/components/card"
                    icon={<IconLayoutCards className="w-5 h-5" />}
                  >
                    Card
                  </SidebarItem>
                  <SidebarItem
                    to="/components/carousel"
                    icon={<IconLayoutBoardSplit className="w-5 h-5" />}
                  >
                    Carousel
                  </SidebarItem>
                  <SidebarItem
                    to="/components/checkbox"
                    icon={<IconSquareCheck className="w-5 h-5" />}
                  >
                    Checkbox
                  </SidebarItem>
                  <SidebarItem
                    to="/components/color-usage"
                    icon={<IconPalette className="w-5 h-5" />}
                  >
                    Color System
                  </SidebarItem>
                  <SidebarItem
                    to="/components/color-picker"
                    icon={<IconColorPicker className="w-5 h-5" />}
                  >
                    Color Picker
                  </SidebarItem>
                  <SidebarItem
                    to="/components/context-menu"
                    icon={<IconMenu2 className="w-5 h-5" />}
                  >
                    Context Menu
                  </SidebarItem>
                  <SidebarItem
                    to="/components/data-table"
                    icon={<IconLayoutList className="w-5 h-5" />}
                  >
                    Data Table
                  </SidebarItem>
                  <SidebarItem
                    to="/components/dialog"
                    icon={<IconBox className="w-5 h-5" />}
                  >
                    Dialog
                  </SidebarItem>
                  <SidebarItem
                    to="/components/drawer"
                    icon={<IconLayoutSidebar className="w-5 h-5" />}
                  >
                    Drawer
                  </SidebarItem>
                  <SidebarItem
                    to="/components/dropdown-menu"
                    icon={<IconMenu2 className="w-5 h-5" />}
                  >
                    Dropdown Menu
                  </SidebarItem>
                  <SidebarItem
                    to="/components/empty"
                    icon={<IconInbox className="w-5 h-5" />}
                  >
                    Empty
                  </SidebarItem>
                  <SidebarItem
                    to="/components/field"
                    icon={<IconInputCheck className="w-5 h-5" />}
                  >
                    Field
                  </SidebarItem>
                  <SidebarItem
                    to="/components/file-upload"
                    icon={<IconUpload className="w-5 h-5" />}
                  >
                    File Upload
                  </SidebarItem>
                  <SidebarItem
                    to="/components/hover-card"
                    icon={<IconPointer className="w-5 h-5" />}
                  >
                    Hover Card
                  </SidebarItem>
                  <SidebarItem
                    to="/components/input"
                    icon={<IconForms className="w-5 h-5" />}
                  >
                    Input
                  </SidebarItem>
                  <SidebarItem
                    to="/components/input-group"
                    icon={<IconLayoutList className="w-5 h-5" />}
                  >
                    Input Group
                  </SidebarItem>
                  <SidebarItem
                    to="/components/kbd"
                    icon={<IconKeyboard className="w-5 h-5" />}
                  >
                    Kbd
                  </SidebarItem>
                  <SidebarItem
                    to="/components/label"
                    icon={<IconTag className="w-5 h-5" />}
                  >
                    Label
                  </SidebarItem>
                  <SidebarItem
                    to="/components/menubar"
                    icon={<IconMenu className="w-5 h-5" />}
                  >
                    Menubar
                  </SidebarItem>
                  <SidebarItem
                    to="/components/navigation-menu"
                    icon={<IconNavigation className="w-5 h-5" />}
                  >
                    Navigation Menu
                  </SidebarItem>
                  <SidebarItem
                    to="/components/pagination"
                    icon={<IconNumbers className="w-5 h-5" />}
                  >
                    Pagination
                  </SidebarItem>
                  <SidebarItem
                    to="/components/popover"
                    icon={<IconMessageCircle className="w-5 h-5" />}
                  >
                    Popover
                  </SidebarItem>
                  <SidebarItem
                    to="/components/progress"
                    icon={<IconLoader className="w-5 h-5" />}
                  >
                    Progress
                  </SidebarItem>
                  <SidebarItem
                    to="/components/radio-group"
                    icon={<IconCircleDot className="w-5 h-5" />}
                  >
                    Radio Group
                  </SidebarItem>
                  <SidebarItem
                    to="/components/resizable"
                    icon={<IconLayoutBoardSplit className="w-5 h-5" />}
                  >
                    Resizable
                  </SidebarItem>
                  <SidebarItem
                    to="/components/select"
                    icon={<IconSelector className="w-5 h-5" />}
                  >
                    Select
                  </SidebarItem>
                  <SidebarItem
                    to="/components/separator"
                    icon={<IconSeparator className="w-5 h-5" />}
                  >
                    Separator
                  </SidebarItem>
                  <SidebarItem
                    to="/components/skeleton"
                    icon={<IconBoxMultiple className="w-5 h-5" />}
                  >
                    Skeleton
                  </SidebarItem>
                  <SidebarItem
                    to="/components/sidebar"
                    icon={<IconLayoutSidebar className="w-5 h-5" />}
                  >
                    Sidebar
                  </SidebarItem>
                  <SidebarItem
                    to="/components/slider"
                    icon={<IconAdjustmentsHorizontal className="w-5 h-5" />}
                  >
                    Slider
                  </SidebarItem>
                  <SidebarItem
                    to="/components/spotlight"
                    icon={<IconSearch className="w-5 h-5" />}
                  >
                    Spotlight
                  </SidebarItem>
                  <SidebarItem
                    to="/components/stepper"
                    icon={<IconListNumbers className="w-5 h-5" />}
                  >
                    Stepper
                  </SidebarItem>
                  <SidebarItem
                    to="/components/table"
                    icon={<IconTable className="w-5 h-5" />}
                  >
                    Table
                  </SidebarItem>
                  <SidebarItem
                    to="/components/tabs"
                    icon={<IconFolder className="w-5 h-5" />}
                  >
                    Tabs
                  </SidebarItem>
                  <SidebarItem
                    to="/components/textarea"
                    icon={<IconTextCaption className="w-5 h-5" />}
                  >
                    Textarea
                  </SidebarItem>
                  <SidebarItem
                    to="/components/toast"
                    icon={<IconBell className="w-5 h-5" />}
                  >
                    Toast
                  </SidebarItem>
                  <SidebarItem
                    to="/components/toggle"
                    icon={<IconToggleLeft className="w-5 h-5" />}
                  >
                    Toggle
                  </SidebarItem>
                  <SidebarItem
                    to="/components/tooltip"
                    icon={<IconTooltip className="w-5 h-5" />}
                  >
                    Tooltip
                  </SidebarItem>
                  <SidebarItem
                    to="/components/timeline"
                    icon={<IconTimeline className="w-5 h-5" />}
                  >
                    Timeline
                  </SidebarItem>
                  <SidebarItem
                    to="/components/tree-view"
                    icon={<IconBinaryTree2 className="w-5 h-5" />}
                  >
                    Tree View
                  </SidebarItem>
                  <SidebarItem
                    to="/components/typography"
                    icon={<IconTypography className="w-5 h-5" />}
                  >
                    Typography
                  </SidebarItem>
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
