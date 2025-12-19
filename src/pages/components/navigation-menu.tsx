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
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Navigation
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
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Simple Links
        </h2>
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

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuDropdown menuId="products">
        <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ListItem href="#" title="Item">
            Description here
          </ListItem>
        </NavigationMenuContent>
      </NavigationMenuDropdown>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#">Docs</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
