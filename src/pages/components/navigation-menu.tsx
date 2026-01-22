"use client";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuDropdown,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  ListItem,
  NavigationMenuHeader,
  NavigationMenuFooter,
  NavigationMenuSection,
  NavigationMenuViewAll,
  NavigationMenuSub,
  NavigationMenuSubTrigger,
  NavigationMenuSubContent,
  NavigationMenuSubItem,
} from "@/components/ui/navigation-menu";
import {
  IconPackage,
  IconCode,
  IconBook,
  IconSettings,
  IconUsers,
  IconChartBar,
  IconCalendar,
  IconMessage,
  IconShield,
  IconRocket,
  IconFolder,
  IconFile,
  IconPhoto,
  IconMusic,
  IconVideo,
} from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs";

function IconApple({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.69C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
    </svg>
  );
}

function BasicDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuDropdown menuId="getting-started">
            <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[400px] md:w-[500px]">
              <ul className="grid gap-3 p-4 md:grid-cols-2">
                <ListItem
                  href="#"
                  title="Introduction"
                  icon={<IconBook className="h-5 w-5" />}
                >
                  Re-usable components built with Base UI.
                </ListItem>
                <ListItem
                  href="#"
                  title="Installation"
                  icon={<IconPackage className="h-5 w-5" />}
                >
                  How to install and configure the library.
                </ListItem>
                <ListItem
                  href="#"
                  title="Typography"
                  icon={<IconCode className="h-5 w-5" />}
                >
                  Styles for headings, paragraphs, and more.
                </ListItem>
                <ListItem
                  href="#"
                  title="Theming"
                  icon={<IconSettings className="h-5 w-5" />}
                >
                  Customize colors and appearance.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuDropdown>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuDropdown menuId="components">
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[400px] md:w-[600px]">
              <ul className="grid gap-3 p-4 md:grid-cols-3">
                <ListItem
                  href="#"
                  title="Button"
                  icon={<IconPackage className="h-5 w-5" />}
                >
                  Trigger actions with buttons.
                </ListItem>
                <ListItem
                  href="#"
                  title="Dialog"
                  icon={<IconMessage className="h-5 w-5" />}
                >
                  Modal dialogs for user interaction.
                </ListItem>
                <ListItem
                  href="#"
                  title="Dropdown"
                  icon={<IconCode className="h-5 w-5" />}
                >
                  Contextual menus and actions.
                </ListItem>
                <ListItem
                  href="#"
                  title="Input"
                  icon={<IconBook className="h-5 w-5" />}
                >
                  Text inputs and form fields.
                </ListItem>
                <ListItem
                  href="#"
                  title="Select"
                  icon={<IconSettings className="h-5 w-5" />}
                >
                  Selection from a list of options.
                </ListItem>
                <ListItem
                  href="#"
                  title="Calendar"
                  icon={<IconCalendar className="h-5 w-5" />}
                >
                  Date selection components.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuDropdown>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="#">Documentation</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const basicCode = `import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuDropdown,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  ListItem,
} from "@/components/ui/navigation-menu"

export function BasicDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuDropdown menuId="getting-started">
            <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[400px] md:w-[500px]">
              <ul className="grid gap-3 p-4 md:grid-cols-2">
                <ListItem
                  href="#"
                  title="Introduction"
                  icon={<IconBook className="h-5 w-5" />}
                >
                  Re-usable components built with Base UI.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuDropdown>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Documentation</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`;

function MegaMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuDropdown menuId="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent
              megaMenu
              className="w-[800px] max-w-full"
            >
              <div className="grid grid-cols-4 gap-4 p-4">
                <NavigationMenuSection title="Web Apps">
                  <ListItem
                    href="#"
                    title="Dashboard"
                    icon={<IconChartBar className="h-4 w-4" />}
                  >
                    Analytics and metrics
                  </ListItem>
                  <ListItem
                    href="#"
                    title="CMS"
                    icon={<IconBook className="h-4 w-4" />}
                  >
                    Content management
                  </ListItem>
                  <ListItem
                    href="#"
                    title="E-commerce"
                    icon={<IconRocket className="h-4 w-4" />}
                  >
                    Online store platform
                  </ListItem>
                </NavigationMenuSection>

                <NavigationMenuSection title="Mobile">
                  <ListItem
                    href="#"
                    title="React Native"
                    icon={<IconPackage className="h-4 w-4" />}
                  >
                    Cross-platform apps
                  </ListItem>
                  <ListItem
                    href="#"
                    title="Flutter"
                    icon={<IconCode className="h-4 w-4" />}
                  >
                    Fast mobile development
                  </ListItem>
                  <ListItem
                    href="#"
                    title="iOS"
                    icon={<IconApple className="h-4 w-4" />}
                  >
                    Native Apple apps
                  </ListItem>
                </NavigationMenuSection>

                <NavigationMenuSection title="Backend">
                  <ListItem
                    href="#"
                    title="API"
                    icon={<IconCode className="h-4 w-4" />}
                  >
                    RESTful APIs
                  </ListItem>
                  <ListItem
                    href="#"
                    title="Database"
                    icon={<IconSettings className="h-4 w-4" />}
                  >
                    Data storage
                  </ListItem>
                  <ListItem
                    href="#"
                    title="Auth"
                    icon={<IconShield className="h-4 w-4" />}
                  >
                    User authentication
                  </ListItem>
                </NavigationMenuSection>

                <div className="space-y-3">
                  <NavigationMenuHeader>
                    <h4 className="font-medium text-sm">Featured</h4>
                  </NavigationMenuHeader>
                  <ListItem
                    href="#"
                    title="New Release 2.0"
                    description="Check out what's new"
                  >
                    Major update with new features
                  </ListItem>
                  <NavigationMenuViewAll
                    href="#"
                    title="View All Products"
                    description="Browse our complete catalog"
                  />
                </div>
              </div>
              <NavigationMenuFooter>
                <span>© 2024 Your Company</span>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </NavigationMenuFooter>
            </NavigationMenuContent>
          </NavigationMenuDropdown>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuDropdown menuId="resources">
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[400px]">
              <ul className="grid gap-3 p-4 md:grid-cols-2">
                <ListItem
                  href="#"
                  title="Documentation"
                  icon={<IconBook className="h-5 w-5" />}
                >
                  Complete API reference
                </ListItem>
                <ListItem
                  href="#"
                  title="Guides"
                  icon={<IconCode className="h-5 w-5" />}
                >
                  Step-by-step tutorials
                </ListItem>
                <ListItem
                  href="#"
                  title="Blog"
                  icon={<IconMessage className="h-5 w-5" />}
                >
                  Latest updates and news
                </ListItem>
                <ListItem
                  href="#"
                  title="Support"
                  icon={<IconUsers className="h-5 w-5" />}
                >
                  Get help from our team
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuDropdown>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const megaMenuCode = `import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuDropdown,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuSection,
  NavigationMenuHeader,
  NavigationMenuFooter,
  NavigationMenuViewAll,
  ListItem,
} from "@/components/ui/navigation-menu"

export function MegaMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuDropdown menuId="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent megaMenu className="w-[800px] max-w-full">
              <div className="grid grid-cols-4 gap-4 p-4">
                <NavigationMenuSection title="Web Apps">
                  <ListItem href="#" title="Dashboard" icon={<IconChartBar className="h-4 w-4" />}>
                    Analytics and metrics
                  </ListItem>
                </NavigationMenuSection>
                <NavigationMenuSection title="Mobile">
                  <ListItem href="#" title="React Native" icon={<IconPackage className="h-4 w-4" />}>
                    Cross-platform apps
                  </ListItem>
                </NavigationMenuSection>
                <NavigationMenuSection title="Backend">
                  <ListItem href="#" title="API" icon={<IconCode className="h-4 w-4" />}>
                    RESTful APIs
                  </ListItem>
                </NavigationMenuSection>
              </div>
              <NavigationMenuFooter>
                <span>© 2024 Your Company</span>
              </NavigationMenuFooter>
            </NavigationMenuContent>
          </NavigationMenuDropdown>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`;

function SimpleLinksDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">About</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Products</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" active>
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const simpleLinksCode = `import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export function SimpleLinksDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">About</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" active>
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`;

function MixedDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuDropdown menuId="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[300px]">
              <ul className="grid gap-3 p-4">
                <ListItem
                  href="#"
                  title="Web App"
                  icon={<IconRocket className="h-5 w-5" />}
                >
                  Build modern web applications
                </ListItem>
                <ListItem
                  href="#"
                  title="Mobile App"
                  icon={<IconPackage className="h-5 w-5" />}
                >
                  Native mobile experiences
                </ListItem>
                <ListItem
                  href="#"
                  title="API"
                  icon={<IconCode className="h-5 w-5" />}
                >
                  Integrate with our API
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuDropdown>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuDropdown menuId="resources">
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[400px]">
              <ul className="grid gap-3 p-4 md:grid-cols-2">
                <ListItem
                  href="#"
                  title="Documentation"
                  icon={<IconBook className="h-5 w-5" />}
                >
                  Complete API reference
                </ListItem>
                <ListItem
                  href="#"
                  title="Guides"
                  icon={<IconCode className="h-5 w-5" />}
                >
                  Step-by-step tutorials
                </ListItem>
                <ListItem
                  href="#"
                  title="Blog"
                  icon={<IconMessage className="h-5 w-5" />}
                >
                  Latest updates and news
                </ListItem>
                <ListItem
                  href="#"
                  title="Support"
                  icon={<IconUsers className="h-5 w-5" />}
                >
                  Get help from our team
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuDropdown>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const mixedCode = `import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuDropdown,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  ListItem,
} from "@/components/ui/navigation-menu"

export function MixedDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuDropdown menuId="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[300px]">
              <ul className="grid gap-3 p-4">
                <ListItem href="#" title="Web App" icon={<IconRocket className="h-5 w-5" />}>
                  Build modern web applications
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuDropdown>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`;

function HoverDemo() {
  return (
    <NavigationMenu openOnHover hoverDelay={150}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuDropdown menuId="hover-products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[300px]">
              <ul className="grid gap-3 p-4">
                <ListItem
                  href="#"
                  title="Dashboard"
                  icon={<IconChartBar className="h-5 w-5" />}
                >
                  Analytics and metrics
                </ListItem>
                <ListItem
                  href="#"
                  title="API Platform"
                  icon={<IconCode className="h-5 w-5" />}
                >
                  Build integrations
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuDropdown>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuDropdown menuId="hover-solutions">
            <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[300px]">
              <ul className="grid gap-3 p-4">
                <ListItem
                  href="#"
                  title="Enterprise"
                  icon={<IconShield className="h-5 w-5" />}
                >
                  Large-scale solutions
                </ListItem>
                <ListItem
                  href="#"
                  title="Startups"
                  icon={<IconRocket className="h-5 w-5" />}
                >
                  Fast growth tools
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuDropdown>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const hoverCode = `import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuDropdown,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  ListItem,
} from "@/components/ui/navigation-menu"

export function HoverDemo() {
  return (
    <NavigationMenu openOnHover hoverDelay={150}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuDropdown menuId="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[300px]">
              <ul className="grid gap-3 p-4">
                <ListItem href="#" title="Dashboard" icon={<IconChartBar className="h-5 w-5" />}>
                  Analytics and metrics
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuDropdown>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`;

function SubmenusDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuDropdown menuId="submenu-files">
            <NavigationMenuTrigger>Files</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[250px] p-1">
              <NavigationMenuSubItem
                icon={<IconFile className="h-4 w-4" />}
              >
                New File
              </NavigationMenuSubItem>
              <NavigationMenuSubItem
                icon={<IconFolder className="h-4 w-4" />}
              >
                New Folder
              </NavigationMenuSubItem>
              <div className="mx-2 my-1 h-px bg-border" />
              <NavigationMenuSub>
                <NavigationMenuSubTrigger
                  icon={<IconPhoto className="h-4 w-4" />}
                >
                  Media
                </NavigationMenuSubTrigger>
                <NavigationMenuSubContent>
                  <NavigationMenuSubItem
                    icon={<IconPhoto className="h-4 w-4" />}
                  >
                    Images
                  </NavigationMenuSubItem>
                  <NavigationMenuSubItem
                    icon={<IconVideo className="h-4 w-4" />}
                  >
                    Videos
                  </NavigationMenuSubItem>
                  <NavigationMenuSubItem
                    icon={<IconMusic className="h-4 w-4" />}
                  >
                    Audio
                  </NavigationMenuSubItem>
                </NavigationMenuSubContent>
              </NavigationMenuSub>
              <NavigationMenuSub>
                <NavigationMenuSubTrigger
                  icon={<IconSettings className="h-4 w-4" />}
                >
                  Settings
                </NavigationMenuSubTrigger>
                <NavigationMenuSubContent>
                  <NavigationMenuSubItem>Preferences</NavigationMenuSubItem>
                  <NavigationMenuSubItem>Account</NavigationMenuSubItem>
                  <NavigationMenuSub>
                    <NavigationMenuSubTrigger>
                      Advanced
                    </NavigationMenuSubTrigger>
                    <NavigationMenuSubContent>
                      <NavigationMenuSubItem>
                        Developer Mode
                      </NavigationMenuSubItem>
                      <NavigationMenuSubItem>
                        Experimental
                      </NavigationMenuSubItem>
                    </NavigationMenuSubContent>
                  </NavigationMenuSub>
                </NavigationMenuSubContent>
              </NavigationMenuSub>
            </NavigationMenuContent>
          </NavigationMenuDropdown>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Home</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const submenusCode = `import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuDropdown,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuSub,
  NavigationMenuSubTrigger,
  NavigationMenuSubContent,
  NavigationMenuSubItem,
} from "@/components/ui/navigation-menu"

export function SubmenusDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuDropdown menuId="files">
            <NavigationMenuTrigger>Files</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[250px] p-1">
              <NavigationMenuSubItem icon={<IconFile className="h-4 w-4" />}>
                New File
              </NavigationMenuSubItem>
              <NavigationMenuSub>
                <NavigationMenuSubTrigger icon={<IconPhoto className="h-4 w-4" />}>
                  Media
                </NavigationMenuSubTrigger>
                <NavigationMenuSubContent>
                  <NavigationMenuSubItem>Images</NavigationMenuSubItem>
                  <NavigationMenuSubItem>Videos</NavigationMenuSubItem>
                </NavigationMenuSubContent>
              </NavigationMenuSub>
            </NavigationMenuContent>
          </NavigationMenuDropdown>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`;

export function NavigationMenuPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Navigation Menu"
        description="A navigation component for site-wide navigation with dropdowns. Now with mega menu support, icons, and enhanced layout components."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Mega Menu",
            description: "Use megaMenu prop for larger dropdowns with organized sections and footers.",
            icon: <IconRocket className="h-5 w-5" />,
          },
          {
            title: "Nested Submenus",
            description: "Full support for nested submenus with keyboard navigation for complex hierarchies.",
            icon: <IconFolder className="h-5 w-5" />,
          },
          {
            title: "Accessible",
            description: "Full keyboard support with arrow keys, Escape, and proper ARIA navigation patterns.",
            icon: <IconShield className="h-5 w-5" />,
          },
        ]}
      />

      <DemoTabs
        tabs={[
          {
            value: "basic",
            label: "Basic",
            demo: (
              <DemoWrapper
                title="Basic Navigation with Dropdowns"
                description="Simple navigation menu with dropdowns containing list items with icons."
                code={basicCode}
              >
                <BasicDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "mega",
            label: "Mega Menu",
            demo: (
              <DemoWrapper
                title="Mega Menu"
                description="Use megaMenu prop for larger, more complex dropdown layouts with sections and footers."
                code={megaMenuCode}
              >
                <MegaMenuDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "simple",
            label: "Simple Links",
            demo: (
              <DemoWrapper
                title="Simple Links (Without Dropdowns)"
                description="Navigation menu with direct links, no dropdowns."
                code={simpleLinksCode}
              >
                <SimpleLinksDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "mixed",
            label: "Mixed",
            demo: (
              <DemoWrapper
                title="Mixed Navigation"
                description="Combine dropdowns and direct links in the same navigation menu."
                code={mixedCode}
              >
                <MixedDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "hover",
            label: "Open on Hover",
            demo: (
              <DemoWrapper
                title="Open on Hover"
                description="Use openOnHover prop to open dropdowns on mouse hover instead of click."
                code={hoverCode}
              >
                <HoverDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "submenus",
            label: "Submenus",
            demo: (
              <DemoWrapper
                title="Nested Submenus"
                description="Use NavigationMenuSub, NavigationMenuSubTrigger, and NavigationMenuSubContent for nested navigation."
                code={submenusCode}
              >
                <SubmenusDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "← / →", description: "Navigate between menu items" },
          { keys: "↑ / ↓", description: "Navigate within dropdowns" },
          { keys: "Home", description: "Go to first menu item" },
          { keys: "End", description: "Go to last menu item" },
          { keys: "Enter / Space", description: "Open dropdown or activate link" },
          { keys: "Escape", description: "Close dropdown" },
        ]}
        title="Keyboard Navigation"
        description="Full keyboard support for accessibility"
      />

      <UsageBlock
        code={`import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuDropdown,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  ListItem,
  NavigationMenuHeader,
  NavigationMenuFooter,
  NavigationMenuSection,
  NavigationMenuViewAll,
} from "@/components/ui/navigation-menu"

// Basic dropdown
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuDropdown menuId="products">
        <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid gap-3 p-4">
            <ListItem href="#" title="Item" icon={<IconPackage className="h-5 w-5" />}>
              Description here
            </ListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuDropdown>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>

// Mega menu
<NavigationMenuContent megaMenu className="w-[800px]">
  <div className="grid grid-cols-4 gap-4 p-4">
    <NavigationMenuSection title="Section">
      <ListItem href="#" title="Item">Description</ListItem>
    </NavigationMenuSection>
  </div>
  <NavigationMenuFooter>© 2024</NavigationMenuFooter>
</NavigationMenuContent>`}
      />

      <APIReference
        sections={[
          {
            title: "NavigationMenu",
            props: [
              { prop: "openOnHover", type: "boolean", default: "false", description: "Opens dropdowns on mouse hover instead of click." },
              { prop: "hoverDelay", type: "number", default: "200", description: "Delay in milliseconds before opening on hover." },
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the root element." },
            ],
          },
          {
            title: "NavigationMenuList",
            props: [
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the list container." },
            ],
          },
          {
            title: "NavigationMenuItem",
            props: [
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the menu item." },
            ],
          },
          {
            title: "NavigationMenuDropdown",
            props: [
              { prop: "menuId", type: "string", default: "-", description: "Unique identifier for the dropdown menu." },
              { prop: "children", type: "ReactNode", default: "-", description: "NavigationMenuTrigger and NavigationMenuContent." },
            ],
          },
          {
            title: "NavigationMenuTrigger",
            props: [
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the trigger button." },
            ],
          },
          {
            title: "NavigationMenuContent",
            props: [
              { prop: "megaMenu", type: "boolean", default: "false", description: "Enables mega menu mode for larger dropdowns." },
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the content." },
            ],
          },
          {
            title: "NavigationMenuLink",
            props: [
              { prop: "active", type: "boolean", default: "false", description: "Marks the link as currently active." },
              { prop: "href", type: "string", default: "-", description: "URL for the link." },
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes." },
            ],
          },
          {
            title: "ListItem",
            props: [
              { prop: "href", type: "string", default: "-", description: "URL for the list item link." },
              { prop: "title", type: "ReactNode", default: "-", description: "Title text for the item." },
              { prop: "description", type: "ReactNode", default: "-", description: "Optional description text." },
              { prop: "icon", type: "ReactNode", default: "-", description: "Optional icon element." },
            ],
          },
          {
            title: "NavigationMenuHeader",
            props: [
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the header." },
            ],
          },
          {
            title: "NavigationMenuFooter",
            props: [
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes for the footer." },
            ],
          },
          {
            title: "NavigationMenuSection",
            props: [
              { prop: "title", type: "string", default: "-", description: "Section title for grouping items." },
              { prop: "children", type: "ReactNode", default: "-", description: "List items within the section." },
            ],
          },
          {
            title: "NavigationMenuViewAll",
            props: [
              { prop: "href", type: "string", default: "-", description: "URL for the view all link." },
              { prop: "title", type: "string", default: "-", description: "Title for the view all link." },
              { prop: "description", type: "string", default: "-", description: "Optional description." },
            ],
          },
          {
            title: "NavigationMenuSub",
            props: [
              { prop: "children", type: "ReactNode", default: "-", description: "NavigationMenuSubTrigger and NavigationMenuSubContent." },
            ],
          },
          {
            title: "NavigationMenuSubTrigger",
            props: [
              { prop: "icon", type: "ReactNode", default: "-", description: "Optional icon for the sub trigger." },
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes." },
            ],
          },
          {
            title: "NavigationMenuSubContent",
            props: [
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes." },
            ],
          },
          {
            title: "NavigationMenuSubItem",
            props: [
              { prop: "icon", type: "ReactNode", default: "-", description: "Optional icon for the sub item." },
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes." },
            ],
          },
        ]}
        title="API Reference"
        description="Key props and configuration options"
      />
    </ComponentPage>
  );
}
