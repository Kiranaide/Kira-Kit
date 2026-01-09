import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarLabel,
} from "@/components/ui/menubar";

export function MenubarPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Menubar</h1>
        <p className="text-muted-foreground">
          A horizontal menu bar with dropdown menus, like in desktop
          applications.
        </p>
      </header>

      {/* Basic Menubar */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Menubar
        </h2>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                New Window <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Share</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Print <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Cut <MenubarShortcut>⌘X</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Copy <MenubarShortcut>⌘C</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Paste <MenubarShortcut>⌘V</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked>Show Toolbar</MenubarCheckboxItem>
              <MenubarCheckboxItem>Show Sidebar</MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarItem>
                Enter Full Screen <MenubarShortcut>F11</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Profiles</MenubarTrigger>
            <MenubarContent>
              <MenubarRadioGroup value="andy">
                <MenubarLabel>Switch Profile</MenubarLabel>
                <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
                <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
              </MenubarRadioGroup>
              <MenubarSeparator />
              <MenubarItem>Edit Profiles...</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </section>

      {/* With Submenus */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Submenus
        </h2>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Format</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Bold</MenubarItem>
              <MenubarItem>Italic</MenubarItem>
              <MenubarItem>Underline</MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Text Color</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Red</MenubarItem>
                  <MenubarItem>Green</MenubarItem>
                  <MenubarItem>Blue</MenubarItem>
                  <MenubarItem>Black</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSub>
                <MenubarSubTrigger>Background</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Yellow</MenubarItem>
                  <MenubarItem>Light Blue</MenubarItem>
                  <MenubarItem>Light Green</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Features
        </h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Checkbox Items:</strong> Toggle
            states with checkboxes
          </li>
          <li>
            <strong className="text-foreground">Radio Groups:</strong> Single
            selection from a group
          </li>
          <li>
            <strong className="text-foreground">Submenus:</strong> Nested menus
            for hierarchical actions
          </li>
          <li>
            <strong className="text-foreground">Keyboard Shortcuts:</strong>{" "}
            Display keyboard shortcuts with MenubarShortcut
          </li>
          <li>
            <strong className="text-foreground">Separators:</strong> Visual
            grouping with MenubarSeparator
          </li>
          <li>
            <strong className="text-foreground">Labels:</strong> Section headers
            with MenubarLabel
          </li>
          <li>
            <strong className="text-foreground">Keyboard Navigation:</strong>{" "}
            Full keyboard support with arrow keys and shortcuts
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
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@/components/ui/menubar"

// Basic menubar
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New <MenubarShortcut>⌘N</MenubarShortcut>
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Quit</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>

// With checkboxes
<MenubarCheckboxItem checked>
  Show Toolbar
</MenubarCheckboxItem>

// With radio group
<MenubarRadioGroup value="option1">
  <MenubarLabel>Options</MenubarLabel>
  <MenubarRadioItem value="option1">Option 1</MenubarRadioItem>
  <MenubarRadioItem value="option2">Option 2</MenubarRadioItem>
</MenubarRadioGroup>

// With submenu
<MenubarSub>
  <MenubarSubTrigger>More Options</MenubarSubTrigger>
  <MenubarSubContent>
    <MenubarItem>Sub Item 1</MenubarItem>
    <MenubarItem>Sub Item 2</MenubarItem>
  </MenubarSubContent>
</MenubarSub>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
