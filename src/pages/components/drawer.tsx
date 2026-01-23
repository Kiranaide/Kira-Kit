import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
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
import {
  IconLayoutSidebar,
  IconSettings,
  IconArrowsRight,
} from "@tabler/icons-react";

function BasicDemo() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button>Open</Button>} />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Title</DrawerTitle>
          <DrawerDescription>Description</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm text-muted-foreground">
            You can put any content here. The drawer is scrollable if content
            overflows.
          </p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const basicCode = `<Drawer>
  <DrawerTrigger render={<Button>Open</Button>} />
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Title</DrawerTitle>
      <DrawerDescription>Description</DrawerDescription>
    </DrawerHeader>
    <DrawerBody>Content here</DrawerBody>
    <DrawerFooter>
      <DrawerClose render={<Button>Close</Button>} />
    </DrawerFooter>
  </DrawerContent>
</Drawer>`;

function PositionsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Drawer>
        <DrawerTrigger
          render={
            <Button variant="outline" className="w-full">
              Left
            </Button>
          }
        />
        <DrawerContent side="left">
          <DrawerHeader>
            <DrawerTitle>Left Drawer</DrawerTitle>
            <DrawerDescription>Slides from left</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-sm text-muted-foreground">
              Often used for navigation menus.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger
          render={
            <Button variant="outline" className="w-full">
              Right
            </Button>
          }
        />
        <DrawerContent side="right">
          <DrawerHeader>
            <DrawerTitle>Right Drawer</DrawerTitle>
            <DrawerDescription>Slides from right (default)</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-sm text-muted-foreground">
              Common for settings panels.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger
          render={
            <Button variant="outline" className="w-full">
              Top
            </Button>
          }
        />
        <DrawerContent side="top">
          <DrawerHeader>
            <DrawerTitle>Top Drawer</DrawerTitle>
            <DrawerDescription>Slides from top</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-sm text-muted-foreground">
              Useful for notifications.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger
          render={
            <Button variant="outline" className="w-full">
              Bottom
            </Button>
          }
        />
        <DrawerContent side="bottom">
          <DrawerHeader>
            <DrawerTitle>Bottom Drawer</DrawerTitle>
            <DrawerDescription>Slides from bottom</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-sm text-muted-foreground">
              Common on mobile for action sheets.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

const positionsCode = `<Drawer>
  <DrawerTrigger render={<Button>Left</Button>} />
  <DrawerContent side="left" />
</Drawer>

<Drawer>
  <DrawerTrigger render={<Button>Right</Button>} />
  <DrawerContent side="right" />
</Drawer>

<Drawer>
  <DrawerTrigger render={<Button>Top</Button>} />
  <DrawerContent side="top" />
</Drawer>

<Drawer>
  <DrawerTrigger render={<Button>Bottom</Button>} />
  <DrawerContent side="bottom" />
</Drawer>`;

function SizesDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Width Variants (Right)
        </h3>
        <div className="flex flex-wrap gap-4">
          {(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
            <Drawer key={size}>
              <DrawerTrigger
                render={
                  <Button variant="outline" size="sm">
                    {size}
                  </Button>
                }
              />
              <DrawerContent side="right" size={size}>
                <DrawerHeader>
                  <DrawerTitle className="capitalize">
                    {size} Right Drawer
                  </DrawerTitle>
                  <DrawerDescription>
                    This drawer has <code>size="{size}"</code>.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerBody>
                  <div className="h-full flex items-center justify-center bg-muted/20 border border-dashed rounded-lg">
                    Content
                  </div>
                </DrawerBody>
                <DrawerFooter>
                  <DrawerClose render={<Button>Close</Button>} />
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Height Variants (Bottom)
        </h3>
        <div className="flex flex-wrap gap-4">
          {(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
            <Drawer key={size}>
              <DrawerTrigger
                render={
                  <Button variant="outline" size="sm">
                    {size}
                  </Button>
                }
              />
              <DrawerContent side="bottom" size={size}>
                <DrawerHeader>
                  <DrawerTitle className="capitalize">
                    {size} Bottom Drawer
                  </DrawerTitle>
                  <DrawerDescription>
                    This drawer has <code>size="{size}"</code>.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerBody>
                  <div className="h-full flex items-center justify-center bg-muted/20 border border-dashed rounded-lg min-h-[100px]">
                    Content
                  </div>
                </DrawerBody>
                <DrawerFooter>
                  <DrawerClose render={<Button>Close</Button>} />
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ))}
        </div>
      </div>
    </div>
  );
}

const sizesCode = `// Width variants for side drawers
<DrawerContent side="right" size="sm" />
<DrawerContent side="right" size="default" />
<DrawerContent side="right" size="lg" />
<DrawerContent side="right" size="xl" />
<DrawerContent side="right" size="full" />

// Height variants for top/bottom drawers
<DrawerContent side="bottom" size="sm" />
<DrawerContent side="bottom" size="default" />
<DrawerContent side="bottom" size="lg" />
<DrawerContent side="bottom" size="xl" />
<DrawerContent side="bottom" size="full" />`;

function NestedDemo() {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Drawer open={parentOpen} onOpenChange={setParentOpen}>
        <DrawerTrigger render={<Button>Open Parent Drawer</Button>} />
        <DrawerContent side="right" size="lg">
          <DrawerHeader>
            <DrawerTitle>Parent Drawer</DrawerTitle>
            <DrawerDescription>Contains a nested drawer</DrawerDescription>
          </DrawerHeader>
          <DrawerBody className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is the parent drawer. You can open another drawer from within
              it.
            </p>
            <Button onClick={() => setChildOpen(true)}>
              Open Child Drawer
            </Button>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose render={<Button variant="outline">Close</Button>} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={childOpen} onOpenChange={setChildOpen}>
        <DrawerContent side="bottom" size="default">
          <DrawerHeader>
            <DrawerTitle>Child Drawer</DrawerTitle>
            <DrawerDescription>Nested inside parent</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-sm text-muted-foreground">
              This drawer is nested inside the parent drawer. Multiple drawers
              can be open simultaneously.
            </p>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose render={<Button>Close Child</Button>} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setParentOpen(true)}>
          Open Parent
        </Button>
        <Button variant="outline" size="sm" onClick={() => setChildOpen(true)}>
          Open Child Only
        </Button>
      </div>
    </div>
  );
}

const nestedCode = `function NestedDemo() {
  const [parentOpen, setParentOpen] = useState(false)
  const [childOpen, setChildOpen] = useState(false)

  return (
    <>
      <Drawer open={parentOpen} onOpenChange={setParentOpen}>
        <DrawerTrigger render={<Button>Open Parent</Button>} />
        <DrawerContent side="right" size="lg">
          <DrawerHeader>
            <DrawerTitle>Parent Drawer</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Button onClick={() => setChildOpen(true)}>
              Open Child Drawer
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer open={childOpen} onOpenChange={setChildOpen}>
        <DrawerContent side="bottom" size="default">
          <DrawerHeader>
            <DrawerTitle>Child Drawer</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            Nested content
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}`;

function ControlledDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger render={<Button>Toggle</Button>} />
        <DrawerContent side="right">
          <DrawerHeader>
            <DrawerTitle>Controlled Drawer</DrawerTitle>
            <DrawerDescription>State managed externally</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-sm text-muted-foreground">
              This drawer's open state is controlled by the parent component's
              state.
            </p>
            <div className="mt-4 p-3 rounded bg-muted/50 border text-sm">
              <div className="font-mono">isOpen: {String(isOpen)}</div>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          Open Programmatically
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
          Close Programmatically
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
          Toggle State
        </Button>
      </div>
    </div>
  );
}

const controlledCode = `function ControlledDemo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger render={<Button>Toggle</Button>} />
        <DrawerContent side="right">
          <DrawerHeader>
            <DrawerTitle>Controlled Drawer</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            Drawer state: {String(isOpen)}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Button onClick={() => setIsOpen(true)}>
        Open Programmatically
      </Button>
      <Button onClick={() => setIsOpen(false)}>
        Close Programmatically
      </Button>
    </>
  )
}`;

export default function DrawerPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Drawer"
        description="A panel that slides in from the edge of the screen."
        version="1.0.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Multiple Positions",
            description:
              "Slide from left, right, top, or bottom with smooth animations.",
            icon: <IconLayoutSidebar className="h-5 w-5" />,
          },
          {
            title: "Configurable Sizes",
            description:
              "Choose from sm, default, lg, xl, or full for perfect sizing.",
            icon: <IconSettings className="h-5 w-5" />,
          },
          {
            title: "Accessibility First",
            description:
              "Full keyboard navigation, focus management, and ARIA support.",
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
                title="Basic Drawer"
                description="Default right drawer with header, body, and footer."
                code={basicCode}
              >
                <BasicDemo />
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
                code={positionsCode}
              >
                <PositionsDemo />
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
                code={sizesCode}
              >
                <SizesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "nested",
            label: "Nested",
            demo: (
              <DemoWrapper
                title="Nested Drawers"
                description="Open multiple drawers simultaneously with controlled state."
                code={nestedCode}
              >
                <NestedDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "controlled",
            label: "Controlled",
            demo: (
              <DemoWrapper
                title="Controlled Drawer"
                description="Manage drawer open state programmatically with external state."
                code={controlledCode}
              >
                <ControlledDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "Escape", description: "Close the drawer" },
          { keys: "Tab", description: "Move focus between elements" },
          { keys: "Shift + Tab", description: "Move focus backwards" },
        ]}
      />

      <UsageBlock
        code={`import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"

<Drawer>
  <DrawerTrigger render={<Button>Open</Button>} />
  <DrawerContent side="right">
    <DrawerHeader>
      <DrawerTitle>Title</DrawerTitle>
      <DrawerDescription>Description</DrawerDescription>
    </DrawerHeader>
    <DrawerBody>Content here</DrawerBody>
    <DrawerFooter>
      <DrawerClose render={<Button>Close</Button>} />
    </DrawerFooter>
  </DrawerContent>
</Drawer>`}
      />

      <APIReference
        sections={[
          {
            title: "Drawer",
            props: [
              {
                prop: "defaultOpen",
                type: "boolean",
                default: "false",
                description: "Whether the drawer is open by default",
              },
              {
                prop: "open",
                type: "boolean",
                default: "-",
                description: "Controlled open state",
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
                description: "Drawer components",
              },
            ],
          },
          {
            title: "DrawerTrigger",
            props: [
              {
                prop: "render",
                type: "React.ReactNode",
                default: "-",
                description: "Element that triggers the drawer",
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
            title: "DrawerContent",
            props: [
              {
                prop: "side",
                type: '"left" | "right" | "top" | "bottom"',
                default: '"right"',
                description: "Which edge the drawer slides from",
              },
              {
                prop: "size",
                type: '"sm" | "default" | "lg" | "xl" | "full"',
                default: '"default"',
                description: "Size of the drawer",
              },
              {
                prop: "onClose",
                type: "() => void",
                default: "-",
                description: "Callback when drawer closes",
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
            title: "DrawerHeader",
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
                description: "Header content (DrawerTitle, DrawerDescription)",
              },
            ],
          },
          {
            title: "DrawerTitle",
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
            title: "DrawerDescription",
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
            title: "DrawerBody",
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
                description: "Main content area",
              },
            ],
          },
          {
            title: "DrawerFooter",
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
            title: "DrawerClose",
            props: [
              {
                prop: "render",
                type: "React.ReactNode",
                default: "-",
                description: "Element that closes the drawer",
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
  );
}
