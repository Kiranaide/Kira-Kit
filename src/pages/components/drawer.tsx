import type { ComponentProps as ReactComponentProps } from "react";
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
  KiraDrawer,
  DrawerClose,
  DrawerHandle,
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
  Changelog,
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
          <DrawerClose render={<Button>Save</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const basicCode = `import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerBody, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

export function BasicDemo() {
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
          <DrawerClose render={<Button>Save</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}`;

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
function PositionsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Drawer side="left">
        <DrawerTrigger
          render={
            <Button variant="outline" className="w-full">
              Left
            </Button>
          }
        />
        <DrawerContent>
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
        <DrawerContent>
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

      <Drawer side="top">
        <DrawerTrigger
          render={
            <Button variant="outline" className="w-full">
              Top
            </Button>
          }
        />
        <DrawerContent>
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

      <Drawer side="bottom">
        <DrawerTrigger
          render={
            <Button variant="outline" className="w-full">
              Bottom
            </Button>
          }
        />
        <DrawerContent>
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

const positionsCode = `import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

export function PositionsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Drawer side="left">
        <DrawerTrigger
          render={
            <Button variant="outline" className="w-full">
              Left
            </Button>
          }
        />
        <DrawerContent>
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
        <DrawerContent>
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

      <Drawer side="top">
        <DrawerTrigger
          render={
            <Button variant="outline" className="w-full">
              Top
            </Button>
          }
        />
        <DrawerContent>
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

      <Drawer side="bottom">
        <DrawerTrigger
          render={
            <Button variant="outline" className="w-full">
              Bottom
            </Button>
          }
        />
        <DrawerContent>
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
}`;

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
              <DrawerContent size={size}>
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
            <Drawer key={size} side="bottom">
              <DrawerTrigger
                render={
                  <Button variant="outline" size="sm">
                    {size}
                  </Button>
                }
              />
              <DrawerContent size={size}>
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

const sizesCode = `import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerBody, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

export function SizesDemo() {
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
              <DrawerContent size={size}>
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
            <Drawer key={size} side="bottom">
              <DrawerTrigger
                render={
                  <Button variant="outline" size="sm">
                    {size}
                  </Button>
                }
              />
              <DrawerContent size={size}>
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
}`;

function NestedDemo() {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Drawer open={parentOpen} onOpenChange={setParentOpen}>
        <DrawerTrigger render={<Button>Open Parent Drawer</Button>} />
        <DrawerContent size="lg">
          <DrawerHeader>
            <DrawerTitle>Parent Drawer</DrawerTitle>
            <DrawerDescription>Contains a nested drawer</DrawerDescription>
          </DrawerHeader>
          <DrawerBody className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is the parent drawer. You can open another drawer from within
              it.
            </p>
            <Drawer side="bottom" open={childOpen} onOpenChange={setChildOpen}>
              <DrawerTrigger render={<Button>Open Child Drawer</Button>} />
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Child Drawer</DrawerTitle>
                  <DrawerDescription>Nested inside parent</DrawerDescription>
                </DrawerHeader>
                <DrawerBody>
                  Multiple drawers can be open simultaneously.
                </DrawerBody>
                <DrawerFooter>
                  <DrawerClose render={<Button>Close Child</Button>} />
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose render={<Button variant="outline">Close</Button>} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setParentOpen(true)}>
          Open Parent
        </Button>
      </div>
    </div>
  );
}

const nestedCode = `import { useState } from "react"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerBody, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

export function NestedDemo() {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Drawer open={parentOpen} onOpenChange={setParentOpen}>
        <DrawerTrigger render={<Button>Open Parent Drawer</Button>} />
        <DrawerContent size="lg">
          <DrawerHeader>
            <DrawerTitle>Parent Drawer</DrawerTitle>
            <DrawerDescription>Contains a nested drawer</DrawerDescription>
          </DrawerHeader>
          <DrawerBody className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is the parent drawer. You can open another drawer from within
              it.
            </p>
            <Drawer side="bottom" open={childOpen} onOpenChange={setChildOpen}>
              <DrawerTrigger render={<Button>Open Child Drawer</Button>} />
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Child Drawer</DrawerTitle>
                  <DrawerDescription>Nested inside parent</DrawerDescription>
                </DrawerHeader>
                <DrawerBody>
                  Multiple drawers can be open simultaneously.
                </DrawerBody>
                <DrawerFooter>
                  <DrawerClose render={<Button>Close Child</Button>} />
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose render={<Button variant="outline">Close</Button>} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setParentOpen(true)}>
          Open Parent
        </Button>
      </div>
    </div>
  );
}`;

function ControlledDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger render={<Button>Toggle</Button>} />
        <DrawerContent>
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

const controlledCode = `import { useState } from "react"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerBody } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

export function ControlledDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger render={<Button>Toggle</Button>} />
        <DrawerContent>
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
}`;

function SnapDemo() {
  const [snap, setSnap] = useState<number | string | null>(0.55);

  return (
    <KiraDrawer
      trigger={<Button>Review order</Button>}
      title="Order summary"
      description="Order #4821 · ready for review"
      handle={
        <DrawerHandle
          expanded={snap === 1}
          onExpandedChange={(expanded) => setSnap(expanded ? 1 : 0.55)}
        />
      }
      rootProps={{
        side: "bottom",
        snapPoints: [0.55, 1],
        snapPoint: snap,
        onSnapPointChange: setSnap,
      }}
      footer={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSnap(snap === 1 ? 0.55 : 1)}
          >
            {snap === 1 ? "Collapse order" : "Expand order"}
          </Button>
          <DrawerClose render={<Button>Close order</Button>} />
        </div>
      }
    >
      <div className="space-y-3">
        <p>2 items · $68.00</p>
        <p>Canvas carryall — natural</p>
        <p>Everyday water bottle — slate</p>
        <p className="text-muted-foreground">
          Delivery to 42 Market Street. Estimated arrival: Friday.
        </p>
      </div>
    </KiraDrawer>
  );
}

const snapCode = `import { useState } from "react"
import { KiraDrawer, DrawerClose, DrawerHandle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

export function SnapDemo() {
  const [snap, setSnap] = useState<number | string | null>(0.55);
  return (
    <KiraDrawer
      trigger={<Button>Review order</Button>}
      title="Order summary"
      description="Order #4821 · ready for review"
      handle={
        <DrawerHandle
          expanded={snap === 1}
          onExpandedChange={(expanded) => setSnap(expanded ? 1 : 0.55)}
        />
      }
      rootProps={{
        side: "bottom",
        snapPoints: [0.55, 1],
        snapPoint: snap,
        onSnapPointChange: setSnap,
      }}
      footer={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSnap(snap === 1 ? 0.55 : 1)}
          >
            {snap === 1 ? "Collapse order" : "Expand order"}
          </Button>
          <DrawerClose render={<Button>Close order</Button>} />
        </div>
      }
    >
      <div className="space-y-3">
        <p>2 items · $68.00</p>
        <p>Canvas carryall — natural</p>
        <p>Everyday water bottle — slate</p>
        <p className="text-muted-foreground">
          Delivery to 42 Market Street. Estimated arrival: Friday.
        </p>
      </div>
    </KiraDrawer>
  );
}`;

function DrawerStatesDemo() {
  return (
    <div className="w-full max-w-80">
      <KiraDrawer
        trigger={<Button>Open empty order</Button>}
        title="A particularly long order description for a narrow screen"
        description="No items have been added yet."
        rootProps={{ side: "bottom" }}
        footer={<DrawerClose render={<Button>Continue shopping</Button>} />}
      >
        <p>Your order is empty. Add an item to see it here.</p>
      </KiraDrawer>
    </div>
  );
}

const drawerUsageCode = `import { useState } from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody, DrawerFooter, DrawerClose, DrawerPortal, DrawerOverlay, DrawerHandle, KiraDrawer, drawerVariants } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

export function OrderSheet() {
  const [snap, setSnap] = useState<number | string | null>(0.55)
  return <KiraDrawer trigger={<Button>Review order</Button>} title="Order summary"
    description="Two items ready for review."
    rootProps={{ side: "bottom", snapPoints: [0.55, 1], snapPoint: snap, onSnapPointChange: setSnap }}
    handle={<DrawerHandle expanded={snap === 1} onExpandedChange={expanded => setSnap(expanded ? 1 : 0.55)} />}
    footer={<DrawerClose render={<Button>Close order</Button>} />}>
    <p>2 items - $68.00</p>
  </KiraDrawer>
}

export function OrderDetails() {
  return <Drawer><DrawerTrigger render={<Button>Order details</Button>} />
    <DrawerContent><DrawerHeader><DrawerTitle>Order #4821</DrawerTitle><DrawerDescription>Ready for review.</DrawerDescription></DrawerHeader>
      <DrawerBody><p>Canvas carryall and water bottle.</p></DrawerBody>
      <DrawerFooter><DrawerClose render={<Button>Done</Button>} /></DrawerFooter>
    </DrawerContent>
  </Drawer>
}

export function CustomPanel() {
  return <Drawer><DrawerTrigger render={<Button>Custom order panel</Button>} />
    <DrawerPortal><DrawerOverlay /><DrawerPrimitive.Viewport className="pointer-events-none fixed inset-0 z-50">
      <DrawerPrimitive.Popup className={drawerVariants({ className: "pointer-events-auto" })}>
        <DrawerPrimitive.Content><DrawerTitle>Order details</DrawerTitle><DrawerDescription>No items have shipped.</DrawerDescription>
          <DrawerClose render={<Button>Done</Button>} />
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Viewport></DrawerPortal>
  </Drawer>
}`;

export default function DrawerPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Drawer"
        description="An edge panel for details and mobile sheets, with visible alternatives to swipe gestures."
        version="2.3.0"
      />

      <FeatureGrid features={drawerPageFeatureGridFeatures} />

      <DemoTabs tabs={drawerPageDemoTabsTabs} />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "Escape", description: "Close the drawer" },
          { keys: "Tab", description: "Move focus between elements" },
          { keys: "Shift + Tab", description: "Move focus backwards" },
        ]}
      />

      <UsageBlock code={drawerUsageCode} />

      <APIReference sections={drawerPageAPIReferenceSections} />
      <Changelog entries={drawerPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const drawerPageFeatureGridFeatures = [
  {
    title: "Multiple Positions",
    description:
      "Slide from left, right, top, or bottom with smooth animations.",
    icon: <IconLayoutSidebar className="h-5 w-5" />,
  },
  {
    title: "Configurable Sizes",
    description: "Choose from sm, default, lg, xl, or full for perfect sizing.",
    icon: <IconSettings className="h-5 w-5" />,
  },
  {
    title: "Accessibility First",
    description:
      "Full keyboard navigation, focus management, and ARIA support.",
    icon: <IconArrowsRight className="h-5 w-5" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const drawerPageAPIReferenceSections = [
  {
    title: "drawerVariants",
    props: [
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl" | "full"',
        default: '"default"',
        description: "Popup classes; placement comes from the Drawer root.",
      },
    ],
  },
  {
    title: "DrawerHandle",
    props: [
      {
        prop: "expanded",
        type: "boolean",
        description:
          "Current detent; exposes aria-expanded and an accessible action name.",
      },
      {
        prop: "onExpandedChange",
        type: "(expanded: boolean) => void",
        description:
          "Update the controlled snap point. Enter, Space and click activate the same action.",
      },
      {
        prop: "ButtonPrimitive.Props",
        type: "Base UI Button props",
        description:
          "Native button props, ref, disabled state, aria-controls, and state-aware className.",
      },
    ],
  },
  {
    title: "KiraDrawer",
    props: [
      {
        prop: "handle",
        type: "ReactNode",
        description: "Optional keyboard-operable control above the header.",
      },
      {
        prop: "trigger",
        type: "ReactElement",
        description: "Element rendered as the trigger.",
      },
      {
        prop: "title",
        type: "ReactNode",
        description: "Accessible drawer title.",
      },
      {
        prop: "description",
        type: "ReactNode",
        description: "Optional drawer description.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description: "Scrollable body content.",
      },
      {
        prop: "footer",
        type: "ReactNode",
        description: "Optional actions.",
      },
      {
        prop: "rootProps",
        type: "Omit<DrawerProps, 'children'>",
        description: "Side, state and snap-point options.",
      },
      {
        prop: "contentProps",
        type: "Omit<DrawerContentProps, 'children'>",
        description: "Popup and portal options.",
      },
    ],
  },
  {
    title: "DrawerPortal",
    props: [
      {
        prop: "keepMounted",
        type: "boolean",
        default: "false",
        description: "Keep the portal mounted while closed.",
      },
      {
        prop: "container",
        type: "HTMLElement | ShadowRoot | RefObject<HTMLElement | ShadowRoot | null> | null",
        description: "Portal destination.",
      },
    ],
  },
  {
    title: "DrawerOverlay",
    props: [
      {
        prop: "className",
        type: "string | ((state: DrawerBackdrop.State) => string | undefined)",
        description: "Backdrop styling.",
      },
    ],
  },
  {
    title: "Drawer",
    props: [
      {
        prop: "side",
        type: '"left" | "right" | "top" | "bottom"',
        default: '"right"',
        description: "Edge and swipe direction; set on Drawer.",
      },
      {
        prop: "snapPoints",
        type: "(number | string)[]",
        description:
          "Bottom sheets only: viewport fractions, pixels or px/rem strings. Top and horizontal detents are not supported by this wrapper.",
      },
      {
        prop: "snapPoint",
        type: "number | string | null",
        description: "Controlled active detent.",
      },
      {
        prop: "defaultSnapPoint",
        type: "number | string | null",
        description: "Initial uncontrolled detent.",
      },
      {
        prop: "onSnapPointChange",
        type: "(snapPoint: number | string | null, details: DrawerPrimitive.Root.SnapPointChangeEventDetails) => void",
        description: "Respond to detent changes.",
      },
      {
        prop: "snapToSequentialPoints",
        type: "boolean",
        default: "false",
        description: "Disable velocity-based snap skipping.",
      },
      {
        prop: "modal",
        type: 'boolean | "trap-focus"',
        default: "true",
        description:
          "Modal, non-modal, or focus-trapping without a backdrop. Non-modal (false) stays open on outside presses and focus-out; close via Esc, Drawer.Close or swipe.",
      },
      {
        prop: "disablePointerDismissal",
        type: "boolean",
        default: "true when modal={false}, else false",
        description:
          "Prevent outside-press dismissal. Kira bakes it into the non-modal default; pass false explicitly to dismiss on outside clicks.",
      },
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
        type: "(open: boolean, details: DrawerPrimitive.Root.ChangeEventDetails) => void",
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
        type: "DrawerPrimitive.Trigger.Props['render']",
        default: "-",
        description: "Element that triggers the drawer",
      },
    ],
  },
  {
    title: "DrawerContent",
    props: [
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl" | "full"',
        default: '"default"',
        description: "Size of the drawer",
      },
      {
        prop: "showCloseButton",
        type: "boolean",
        default: "true",
        description: "Show the labelled close button.",
      },
      {
        prop: "portalProps",
        type: "DrawerPortal.Props",
        description:
          "Configure the internal portal, including keepMounted and container.",
      },
      {
        prop: "className",
        type: "DrawerPrimitive.Popup.Props['className']",
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
        type: "DrawerPrimitive.Close.Props['render']",
        default: "-",
        description: "Element that closes the drawer",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const drawerPageChangelogEntries = [
  {
    version: "2.3.0",
    date: "5 November 2026",
    changes: [
      {
        type: "added",
        title: "A keyboard-operable sheet handle",
        description:
          "DrawerHandle is a named button exposing expanded state; KiraDrawer accepts a handle slot. The order sheet supports click, Enter and Space to change detents. Audited on Base UI 1.9.0.",
      },
      {
        type: "fixed",
        title: "Preserve snap-point prop contracts",
        description:
          "KiraDrawer now preserves the root's discriminated union without a type assertion. Snap points remain limited to bottom sheets; other sides continue to reject them.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "4 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Non-modal drawers stay open + header spacing",
        description:
          "modal={false} now bakes disablePointerDismissal (Base UI 1.9 recipe) so outside presses and focus-out no longer dismiss the drawer — Esc, Drawer.Close and swipe still do. Pass disablePointerDismissal={false} to restore stock dismissal. DrawerHeader padding fixed (was flush against the popup top edge, title collided with the floating close button); popup shadow fades on enter/exit (Base UI non-modal recipe) and non-modal drawers render shadow-md.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "4 November 2026",
    changes: [
      {
        type: "added",
        title: "KiraDrawer and vertical detents",
        description:
          "Compose order details with Base UI 1.9.0 snap points and visible expand, collapse and close actions.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "4 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Native Drawer and scrolling",
        description:
          "Migrated to Base UI 1.9.0 Drawer. Breaking: move side from DrawerContent to Drawer; drawerVariants no longer accepts side. data-slot=drawer-popup now identifies the outer Popup (and receives className/ref); drawer-content identifies its inner content wrapper. Update CSS selectors accordingly.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

const drawerPageDemoTabsTabs = [
  {
    value: "nonmodal",
    label: "Non-modal",
    demo: (
      <DemoWrapper
        title="Keep the page interactive"
        description="Non-modal drawers stay open while you work with the page. Outside clicks don't dismiss them; close with Esc, ✕, or a swipe."
        code={`import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

<Drawer modal={false}>
  <DrawerTrigger render={<Button variant="outline">Open details</Button>} />
  <DrawerContent className="w-96">
    <DrawerHeader>
      <DrawerTitle>Details</DrawerTitle>
      <DrawerDescription>
        Stays open while you use the page.
      </DrawerDescription>
    </DrawerHeader>
    <DrawerBody>
      Outside clicks don't close it; Esc, ✕, or a swipe does.
    </DrawerBody>
  </DrawerContent>
</Drawer>`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Drawer modal={false}>
              <DrawerTrigger
                render={<Button variant="outline">Open details</Button>}
              />
              <DrawerContent className="w-96">
                <DrawerHeader>
                  <DrawerTitle>Details</DrawerTitle>
                  <DrawerDescription>
                    Stays open while you use the page.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerBody>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      Click the button below — the drawer keeps its state and
                      the page keeps working.
                    </p>
                  </div>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
            <Button
              variant="outline"
              onClick={(event) => {
                const b = event.currentTarget;
                b.textContent = `Clicked ${Number(b.dataset.count ?? 0) + 1}×`;
                b.dataset.count = String(Number(b.dataset.count ?? 0) + 1);
              }}
            >
              Outside action
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Explicitly re-enabling outside-press dismissal (stock Base UI
            behavior) is a one-prop override:
            <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
              {"<Drawer modal={false} disablePointerDismissal={false}>"}
            </code>
          </p>
        </div>
      </DemoWrapper>
    ),
  },
  {
    value: "snap",
    label: "Order sheet",
    demo: (
      <DemoWrapper
        title="Order sheet"
        description="Expand or collapse without dragging."
        code={snapCode}
      >
        <SnapDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "Kira & states",
    demo: (
      <DemoWrapper
        title="Empty order"
        description="A long title and empty state in a narrow container."
        code={`import { KiraDrawer } from "@/components/ui/drawer"\nimport { Button } from "@/components/ui/button"\n\n<KiraDrawer trigger={<Button>Open</Button>} title="Order" rootProps={{ side: "bottom" }}>Your order is empty.</KiraDrawer>`}
      >
        <DrawerStatesDemo />
      </DemoWrapper>
    ),
  },
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
] satisfies React.ComponentProps<typeof DemoTabs>["tabs"];
