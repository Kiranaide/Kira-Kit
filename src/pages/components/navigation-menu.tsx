import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuDropdown,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  ListItem,
} from "@/components/ui/navigation-menu";

export function NavigationMenuPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Navigation Menu</h1>
        <p className="text-muted-foreground">
          A navigation component for site-wide navigation with dropdowns.
        </p>
      </header>

      {/* Basic Navigation */}
      <section className="space-y-4 min-h-[280px]">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Navigation with Dropdowns
        </h2>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuDropdown menuId="getting-started">
                <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
                <NavigationMenuContent className="w-[400px] md:w-[500px]">
                  <ul className="grid gap-3 p-4 md:grid-cols-2">
                    <ListItem href="#" title="Introduction">
                      Re-usable components built with Base UI.
                    </ListItem>
                    <ListItem href="#" title="Installation">
                      How to install and configure the library.
                    </ListItem>
                    <ListItem href="#" title="Typography">
                      Styles for headings, paragraphs, and more.
                    </ListItem>
                    <ListItem href="#" title="Theming">
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
                    <ListItem href="#" title="Button">
                      Trigger actions with buttons.
                    </ListItem>
                    <ListItem href="#" title="Dialog">
                      Modal dialogs for user interaction.
                    </ListItem>
                    <ListItem href="#" title="Dropdown">
                      Contextual menus and actions.
                    </ListItem>
                    <ListItem href="#" title="Input">
                      Text inputs and form fields.
                    </ListItem>
                    <ListItem href="#" title="Select">
                      Selection from a list of options.
                    </ListItem>
                    <ListItem href="#" title="Calendar">
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
      </section>

      {/* Simple Links */}
      <section className="space-y-4 pt-8">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Simple Links (Without Dropdowns)
        </h2>
        <p className="text-sm text-muted-foreground">
          Navigation menu with direct links, no dropdowns.
        </p>
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
      </section>

      {/* Mixed Navigation */}
      <section className="space-y-4 pt-8">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Mixed Navigation
        </h2>
        <p className="text-sm text-muted-foreground">
          Combine dropdowns and direct links in the same navigation menu.
        </p>
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
                    <ListItem href="#" title="Web App">
                      Build modern web applications
                    </ListItem>
                    <ListItem href="#" title="Mobile App">
                      Native mobile experiences
                    </ListItem>
                    <ListItem href="#" title="API">
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
                    <ListItem href="#" title="Documentation">
                      Complete API reference
                    </ListItem>
                    <ListItem href="#" title="Guides">
                      Step-by-step tutorials
                    </ListItem>
                    <ListItem href="#" title="Blog">
                      Latest updates and news
                    </ListItem>
                    <ListItem href="#" title="Support">
                      Get help from our team
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuDropdown>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Features
        </h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Auto-close:</strong> Only one
            dropdown menu can be open at a time
          </li>
          <li>
            <strong className="text-foreground">Keyboard Navigation:</strong>{" "}
            Full keyboard support with arrow keys and Escape
          </li>
          <li>
            <strong className="text-foreground">Responsive:</strong> Adapts to
            different screen sizes
          </li>
          <li>
            <strong className="text-foreground">Flexible Layout:</strong>{" "}
            Support for grid layouts in dropdown content
          </li>
          <li>
            <strong className="text-foreground">Router Integration:</strong>{" "}
            Works with TanStack Router for client-side navigation
          </li>
        </ul>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuDropdown,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  ListItem,
} from "@/components/ui/navigation-menu"

// Basic dropdown
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuDropdown menuId="products">
        <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid gap-3 p-4">
            <ListItem href="#" title="Item">
              Description here
            </ListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuDropdown>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>

// Direct link
<NavigationMenuItem>
  <NavigationMenuLink href="#">Docs</NavigationMenuLink>
</NavigationMenuItem>

// Grid layout in content
<NavigationMenuContent className="w-[400px]">
  <ul className="grid gap-3 p-4 md:grid-cols-2">
    <ListItem href="#" title="Item 1">Description</ListItem>
    <ListItem href="#" title="Item 2">Description</ListItem>
  </ul>
</NavigationMenuContent>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
