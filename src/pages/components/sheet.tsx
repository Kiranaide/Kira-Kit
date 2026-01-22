import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs"
import { IconLayoutSidebar, IconSettings, IconArrowsRight } from "@tabler/icons-react"

export function SheetPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Sheet"
        description="A panel that slides in from the edge of the screen for secondary content and navigation."
        version="1.0.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Multiple Positions",
            description: "Slide from left, right, top, or bottom with smooth animations.",
            icon: <IconLayoutSidebar className="h-5 w-5" />,
          },
          {
            title: "Configurable Sizes",
            description: "Choose from sm, default, lg, xl, or full for perfect sizing.",
            icon: <IconSettings className="h-5 w-5" />,
          },
          {
            title: "Accessibility First",
            description: "Full keyboard navigation, focus management, and ARIA support.",
            icon: <IconArrowsRight className="h-5 w-5" />,
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
                title="Basic Sheet"
                description="Default right sheet with header, body, and footer."
                code={`<Sheet>
  <SheetTrigger render={<Button>Open</Button>} />
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
      <SheetDescription>Description</SheetDescription>
    </SheetHeader>
    <SheetBody>Content here</SheetBody>
    <SheetFooter>
      <SheetClose render={<Button>Close</Button>} />
    </SheetFooter>
  </SheetContent>
</Sheet>`}
              >
                <Sheet>
                  <SheetTrigger render={<Button>Open Right</Button>} />
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Right Sheet</SheetTitle>
                      <SheetDescription>
                        This sheet slides in from the right.
                      </SheetDescription>
                    </SheetHeader>
                    <SheetBody>
                      <p className="text-sm text-muted-foreground">
                        You can put any content here. The sheet is scrollable if
                        content overflows.
                      </p>
                    </SheetBody>
                    <SheetFooter>
                      <SheetClose render={<Button variant="outline">Cancel</Button>} />
                      <Button>Save</Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </DemoWrapper>
            ),
          },
          {
            value: "sizes",
            label: "Sizes",
            demo: (
              <DemoWrapper
                title="Size Variants"
                description="Choose from sm, default, lg, xl, or full size."
                code={`// Width variants for side sheets
<SheetContent side="right" size="sm" />
<SheetContent side="right" size="default" />
<SheetContent side="right" size="lg" />
<SheetContent side="right" size="xl" />
<SheetContent side="right" size="full" />

// Height variants for top/bottom sheets
<SheetContent side="bottom" size="sm" />
<SheetContent side="bottom" size="default" />
<SheetContent side="bottom" size="lg" />
<SheetContent side="bottom" size="xl" />
<SheetContent side="bottom" size="full" />`}
              >
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Width Variants (Right)</h3>
                    <div className="flex flex-wrap gap-4">
                      {(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
                        <Sheet key={size}>
                          <SheetTrigger
                            render={
                              <Button variant="outline" size="sm">
                                {size}
                              </Button>
                            }
                          />
                          <SheetContent side="right" size={size}>
                            <SheetHeader>
                              <SheetTitle className="capitalize">
                                {size} Right Sheet
                              </SheetTitle>
                              <SheetDescription>
                                This sheet has <code>size="{size}"</code>.
                              </SheetDescription>
                            </SheetHeader>
                            <SheetBody>
                              <div className="h-full flex items-center justify-center bg-muted/20 border border-dashed rounded-lg">
                                Content
                              </div>
                            </SheetBody>
                            <SheetFooter>
                              <SheetClose render={<Button>Close</Button>} />
                            </SheetFooter>
                          </SheetContent>
                        </Sheet>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Height Variants (Bottom)</h3>
                    <div className="flex flex-wrap gap-4">
                      {(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
                        <Sheet key={size}>
                          <SheetTrigger
                            render={
                              <Button variant="outline" size="sm">
                                {size}
                              </Button>
                            }
                          />
                          <SheetContent side="bottom" size={size}>
                            <SheetHeader>
                              <SheetTitle className="capitalize">
                                {size} Bottom Sheet
                              </SheetTitle>
                              <SheetDescription>
                                This sheet has <code>size="{size}"</code>.
                              </SheetDescription>
                            </SheetHeader>
                            <SheetBody>
                              <div className="h-full flex items-center justify-center bg-muted/20 border border-dashed rounded-lg min-h-[100px]">
                                Content
                              </div>
                            </SheetBody>
                            <SheetFooter>
                              <SheetClose render={<Button>Close</Button>} />
                            </SheetFooter>
                          </SheetContent>
                        </Sheet>
                      ))}
                    </div>
                  </div>
                </div>
              </DemoWrapper>
            ),
          },
          {
            value: "positions",
            label: "Positions",
            demo: (
              <DemoWrapper
                title="Position Variants"
                description="Slide from left, right, top, or bottom."
                code={`<Sheet>
  <SheetTrigger render={<Button>Left</Button>} />
  <SheetContent side="left" />
</Sheet>

<Sheet>
  <SheetTrigger render={<Button>Right</Button>} />
  <SheetContent side="right" />
</Sheet>

<Sheet>
  <SheetTrigger render={<Button>Top</Button>} />
  <SheetContent side="top" />
</Sheet>

<Sheet>
  <SheetTrigger render={<Button>Bottom</Button>} />
  <SheetContent side="bottom" />
</Sheet>`}
              >
                <div className="grid grid-cols-2 gap-4">
                  <Sheet>
                    <SheetTrigger
                      render={<Button variant="outline" className="w-full">Left</Button>}
                    />
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Left Sheet</SheetTitle>
                        <SheetDescription>Slides from left</SheetDescription>
                      </SheetHeader>
                      <SheetBody>
                        <p className="text-sm text-muted-foreground">Often used for navigation menus.</p>
                      </SheetBody>
                    </SheetContent>
                  </Sheet>

                  <Sheet>
                    <SheetTrigger
                      render={<Button variant="outline" className="w-full">Right</Button>}
                    />
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle>Right Sheet</SheetTitle>
                        <SheetDescription>Slides from right (default)</SheetDescription>
                      </SheetHeader>
                      <SheetBody>
                        <p className="text-sm text-muted-foreground">Common for settings panels.</p>
                      </SheetBody>
                    </SheetContent>
                  </Sheet>

                  <Sheet>
                    <SheetTrigger
                      render={<Button variant="outline" className="w-full">Top</Button>}
                    />
                    <SheetContent side="top">
                      <SheetHeader>
                        <SheetTitle>Top Sheet</SheetTitle>
                        <SheetDescription>Slides from top</SheetDescription>
                      </SheetHeader>
                      <SheetBody>
                        <p className="text-sm text-muted-foreground">Useful for notifications.</p>
                      </SheetBody>
                    </SheetContent>
                  </Sheet>

                  <Sheet>
                    <SheetTrigger
                      render={<Button variant="outline" className="w-full">Bottom</Button>}
                    />
                    <SheetContent side="bottom">
                      <SheetHeader>
                        <SheetTitle>Bottom Sheet</SheetTitle>
                        <SheetDescription>Slides from bottom</SheetDescription>
                      </SheetHeader>
                      <SheetBody>
                        <p className="text-sm text-muted-foreground">Common on mobile for action sheets.</p>
                      </SheetBody>
                    </SheetContent>
                  </Sheet>
                </div>
              </DemoWrapper>
            ),
          },
          {
            value: "form",
            label: "Form",
            demo: (
              <DemoWrapper
                title="Sheet with Form"
                description="Combine sheet with form components for data entry."
                code={`<Sheet>
  <SheetTrigger render={<Button>Edit Profile</Button>} />
  <SheetContent side="right" size="lg">
    <SheetHeader>
      <SheetTitle>Edit Profile</SheetTitle>
      <SheetDescription>Update your information</SheetDescription>
    </SheetHeader>
    <SheetBody>
      <form className="space-y-4">
        <Input placeholder="Name" />
        <Input type="email" placeholder="Email" />
        <Textarea placeholder="Bio" />
      </form>
    </SheetBody>
    <SheetFooter>
      <SheetClose render={<Button variant="outline">Cancel</Button>} />
      <Button>Save Changes</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>`}
              >
                <Sheet>
                  <SheetTrigger render={<Button>Edit Profile</Button>} />
                  <SheetContent side="right" size="lg">
                    <SheetHeader>
                      <SheetTitle>Edit Profile</SheetTitle>
                      <SheetDescription>Update your information below</SheetDescription>
                    </SheetHeader>
                    <SheetBody>
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Name</label>
                          <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Bio</label>
                          <textarea
                            placeholder="Tell us about yourself"
                            rows={4}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                          />
                        </div>
                      </form>
                    </SheetBody>
                    <SheetFooter>
                      <SheetClose render={<Button variant="outline">Cancel</Button>} />
                      <Button>Save Changes</Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </DemoWrapper>
            ),
          },
          {
            value: "custom",
            label: "Custom",
            demo: (
              <DemoWrapper
                title="Custom Styling"
                description="Apply custom styles and overrides to sheet components."
                code={`<Sheet>
  <SheetTrigger render={<Button>Open Custom</Button>} />
  <SheetContent side="right" className="max-w-[500px]">
    <SheetHeader className="bg-muted/50">
      <SheetTitle className="text-primary">Custom Title</SheetTitle>
      <SheetDescription>Custom description</SheetDescription>
    </SheetHeader>
    <SheetBody className="p-6">
      {/* Custom content */}
    </SheetBody>
    <SheetFooter className="bg-muted/30">
      <SheetClose render={<Button variant="ghost">Cancel</Button>} />
      <Button className="bg-primary">Confirm</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>`}
              >
                <Sheet>
                  <SheetTrigger render={<Button>Open Custom</Button>} />
                  <SheetContent side="right" className="max-w-[500px]">
                    <SheetHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b">
                      <SheetTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                        Custom Styled Sheet
                      </SheetTitle>
                      <SheetDescription>
                        This sheet has custom styling applied
                      </SheetDescription>
                    </SheetHeader>
                    <SheetBody className="p-6 space-y-4">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-200 dark:border-purple-800">
                        <p className="text-sm text-muted-foreground">
                          This is custom content with gradient backgrounds and styled borders.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-20 flex-1 rounded-lg bg-purple-500/10" />
                        <div className="h-20 flex-1 rounded-lg bg-pink-500/10" />
                        <div className="h-20 flex-1 rounded-lg bg-indigo-500/10" />
                      </div>
                    </SheetBody>
                    <SheetFooter className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-t">
                      <SheetClose render={<Button variant="ghost">Cancel</Button>} />
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Confirm
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </DemoWrapper>
            ),
          },
          {
            value: "nested",
            label: "Nested",
            demo: (
              <DemoWrapper
                title="Nested Sheets"
                description="Open a sheet from within another sheet for complex workflows."
                code={`<Sheet>
  <SheetTrigger render={<Button>Open Parent</Button>} />
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Parent Sheet</SheetTitle>
    </SheetHeader>
    <SheetBody>
      <Sheet>
        <SheetTrigger render={<Button>Open Child</Button>} />
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Child Sheet</SheetTitle>
          </SheetHeader>
          <SheetBody>
            Child content
          </SheetBody>
        </SheetContent>
      </Sheet>
    </SheetBody>
  </SheetContent>
</Sheet>`}
              >
                <Sheet>
                  <SheetTrigger render={<Button>Open Parent Sheet</Button>} />
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Parent Sheet</SheetTitle>
                      <SheetDescription>
                        This is the parent sheet containing another sheet.
                      </SheetDescription>
                    </SheetHeader>
                    <SheetBody className="flex flex-col items-center justify-center gap-4">
                      <p className="text-sm text-muted-foreground">
                        Click the button below to open a nested child sheet.
                      </p>
                      <Sheet>
                        <SheetTrigger render={<Button>Open Child Sheet</Button>} />
                        <SheetContent side="right" className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                          <SheetHeader>
                            <SheetTitle>Child Sheet</SheetTitle>
                            <SheetDescription>
                              This is a nested sheet inside the parent.
                            </SheetDescription>
                          </SheetHeader>
                          <SheetBody className="flex flex-col items-center justify-center">
                            <p className="text-sm text-muted-foreground">
                              Child sheet content
                            </p>
                          </SheetBody>
                        </SheetContent>
                      </Sheet>
                    </SheetBody>
                  </SheetContent>
                </Sheet>
              </DemoWrapper>
            ),
          },
          {
            value: "scrollable",
            label: "Scrollable",
            demo: (
              <DemoWrapper
                title="Scrollable Content"
                description="The sheet body is scrollable when content exceeds the available space."
                code={`<Sheet>
  <SheetTrigger render={<Button>Open Sheet</Button>} />
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Scrollable Sheet</SheetTitle>
    </SheetHeader>
    <SheetBody>
      {/* Long content that scrolls */}
      {Array.from({ length: 50 }).map((_, i) => (
        <p key={i}>Item {i + 1}</p>
      ))}
    </SheetBody>
  </SheetContent>
</Sheet>`}
              >
                <Sheet>
                  <SheetTrigger render={<Button>Open Scrollable Sheet</Button>} />
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Scrollable Content</SheetTitle>
                      <SheetDescription>
                        This sheet has a scrollable body with long content.
                      </SheetDescription>
                    </SheetHeader>
                    <SheetBody className="space-y-2">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className="p-3 bg-muted/50 rounded border">
                          <p className="text-sm font-medium">Item {i + 1}</p>
                          <p className="text-xs text-muted-foreground">
                            This is item {i + 1} in a scrollable list.
                          </p>
                        </div>
                      ))}
                    </SheetBody>
                  </SheetContent>
                </Sheet>
              </DemoWrapper>
            ),
          },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "Escape", description: "Close the sheet" },
          { keys: "Tab", description: "Move focus between elements" },
          { keys: "Shift + Tab", description: "Move focus backwards" },
        ]}
      />

      <UsageBlock
        code={`import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger render={<Button>Open</Button>} />
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
      <SheetDescription>Description</SheetDescription>
    </SheetHeader>
    <SheetBody>Content here</SheetBody>
    <SheetFooter>
      <SheetClose render={<Button>Close</Button>} />
    </SheetFooter>
  </SheetContent>
</Sheet>`}
      />

      <APIReference
        sections={[
          {
            title: "Sheet",
            props: [
              {
                prop: "defaultOpen",
                type: "boolean",
                default: "false",
                description: "Whether the sheet is open by default",
              },
              {
                prop: "onOpenChange",
                type: "(open: boolean) => void",
                default: "-",
                description: "Callback when open state changes",
              },
              {
                prop: "children",
                type: "React.ReactNode",
                default: "-",
                description: "Sheet components",
              },
            ],
          },
          {
            title: "SheetTrigger",
            props: [
              {
                prop: "render",
                type: "React.ReactNode",
                default: "-",
                description: "Element that triggers the sheet",
              },
              {
                prop: "asChild",
                type: "boolean",
                default: "false",
                description: "Merge with child element",
              },
            ],
          },
          {
            title: "SheetContent",
            props: [
              {
                prop: "side",
                type: '"left" | "right" | "top" | "bottom"',
                default: '"right"',
                description: "Which edge the sheet slides from",
              },
              {
                prop: "size",
                type: '"sm" | "default" | "lg" | "xl" | "full"',
                default: '"default"',
                description: "Size of the sheet",
              },
              {
                prop: "showCloseButton",
                type: "boolean",
                default: "true",
                description: "Show close button in corner",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes",
              },
            ],
          },
          {
            title: "SheetHeader",
            props: [
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes",
              },
              {
                prop: "children",
                type: "React.ReactNode",
                default: "-",
                description: "Header content (SheetTitle, SheetDescription)",
              },
            ],
          },
          {
            title: "SheetTitle",
            props: [
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes",
              },
              {
                prop: "children",
                type: "React.ReactNode",
                default: "-",
                description: "Title text or content",
              },
            ],
          },
          {
            title: "SheetDescription",
            props: [
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes",
              },
              {
                prop: "children",
                type: "React.ReactNode",
                default: "-",
                description: "Description text or content",
              },
            ],
          },
          {
            title: "SheetBody",
            props: [
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes",
              },
              {
                prop: "children",
                type: "React.ReactNode",
                default: "-",
                description: "Main content area (scrollable)",
              },
            ],
          },
          {
            title: "SheetFooter",
            props: [
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes",
              },
              {
                prop: "children",
                type: "React.ReactNode",
                default: "-",
                description: "Footer content (typically buttons)",
              },
            ],
          },
          {
            title: "SheetClose",
            props: [
              {
                prop: "render",
                type: "React.ReactNode",
                default: "-",
                description: "Element that closes the sheet",
              },
              {
                prop: "asChild",
                type: "boolean",
                default: "false",
                description: "Merge with child element",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  )
}
