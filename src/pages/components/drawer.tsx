import type { ComponentProps as ReactComponentProps } from "react";
import { useState } from "react";
import {
  IconLayoutSidebar,
  IconSettings,
  IconArrowsRight,
} from "@tabler/icons-react";
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
  type DrawerSide,
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

const basicCode = `import {
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

function PositionsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {drawerPositionExamples.map((item) => (
        <Drawer key={item.side} side={item.side}>
          <DrawerTrigger
            render={
              <Button variant="outline" className="w-full">
                {item.label}
              </Button>
            }
          />
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{item.title}</DrawerTitle>
              <DrawerDescription>{item.description}</DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p className="text-sm text-muted-foreground">{item.body}</p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
}

const positionsCode = `import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function PositionsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Drawer side="left">
        <DrawerTrigger
          render={<Button variant="outline" className="w-full">Left</Button>}
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

      <Drawer side="right">
        <DrawerTrigger
          render={<Button variant="outline" className="w-full">Right</Button>}
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
          render={<Button variant="outline" className="w-full">Top</Button>}
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
          render={<Button variant="outline" className="w-full">Bottom</Button>}
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
          {drawerSizes.map((size) => (
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
                  <div className="flex h-full items-center justify-center rounded-lg border border-dashed bg-muted/20">
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
          {drawerSizes.map((size) => (
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
                  <div className="flex h-full min-h-24 items-center justify-center rounded-lg border border-dashed bg-muted/20">
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

const sizesCode = `import {
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

const sizes = ["sm", "default", "lg", "xl", "full"] as const;

export function SizesDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Width Variants (Right)
        </h3>
        <div className="flex flex-wrap gap-4">
          {sizes.map((size) => (
            <Drawer key={size}>
              <DrawerTrigger
                render={<Button variant="outline" size="sm">{size}</Button>}
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
                  <div className="flex h-full items-center justify-center rounded-lg border border-dashed bg-muted/20">
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
          {sizes.map((size) => (
            <Drawer key={size} side="bottom">
              <DrawerTrigger
                render={<Button variant="outline" size="sm">{size}</Button>}
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
                  <div className="flex h-full min-h-24 items-center justify-center rounded-lg border border-dashed bg-muted/20">
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

function NonModalDemo() {
  const [clicks, setClicks] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
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
              <p className="text-sm text-muted-foreground">
                Click the outside action button — the drawer keeps its state and
                the page keeps working.
              </p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <Button
          variant="outline"
          onClick={() => setClicks((count) => count + 1)}
        >
          {clicks > 0 ? `Clicked ${clicks}×` : "Outside action"}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Explicitly re-enabling outside-press dismissal (stock Base UI behavior)
        is a one-prop override:
        <code className="mx-1 rounded bg-muted px-2 py-1 text-xs">
          {"<Drawer modal={false} disablePointerDismissal={false}>"}
        </code>
      </p>
    </div>
  );
}

const nonModalCode = `import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function NonModalDemo() {
  return (
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
          Outside clicks do not close it; Esc, the close button, or a swipe
          does.
        </DrawerBody>
      </DrawerContent>
    </Drawer>
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

const nestedCode = `import { useState } from "react";
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

export function NestedDemo() {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);

  return (
    <Drawer open={parentOpen} onOpenChange={setParentOpen}>
      <DrawerTrigger render={<Button>Open Parent Drawer</Button>} />
      <DrawerContent size="lg">
        <DrawerHeader>
          <DrawerTitle>Parent Drawer</DrawerTitle>
          <DrawerDescription>Contains a nested drawer</DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="space-y-4">
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
              This drawer&apos;s open state is controlled by the parent
              component&apos;s state.
            </p>
            <output className="mt-4 block rounded border bg-muted/50 p-3 font-mono text-sm">
              isOpen: {String(isOpen)}
            </output>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="flex flex-wrap gap-2">
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

const controlledCode = `import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

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
            <output className="block rounded border bg-muted/50 p-3 font-mono text-sm">
              isOpen: {String(isOpen)}
            </output>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          Open Programmatically
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
          Close Programmatically
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
      description="Order No. 4821 · ready for review"
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

const snapCode = `import { useState } from "react";
import { KiraDrawer, DrawerClose, DrawerHandle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function SnapDemo() {
  const [snap, setSnap] = useState<number | string | null>(0.55);

  return (
    <KiraDrawer
      trigger={<Button>Review order</Button>}
      title="Order summary"
      description="Order No. 4821 · ready for review"
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

function StressDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <KiraDrawer
        trigger={
          <Button variant="outline" className="w-full whitespace-normal">
            Open long-title empty order sheet
          </Button>
        }
        title="A particularly long order description and fulfillment reference for a narrow screen"
        description="No items have been added to this shipment yet."
        rootProps={{ side: "bottom" }}
        footer={<DrawerClose render={<Button>Continue shopping</Button>} />}
      >
        <p className="text-sm text-muted-foreground">
          Your order is empty. Add an item to inspect its delivery timeline.
        </p>
      </KiraDrawer>

      <Drawer>
        <DrawerTrigger
          disabled
          render={
            <Button variant="outline" className="w-full" disabled>
              Disabled drawer trigger
            </Button>
          }
        />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Unavailable</DrawerTitle>
          </DrawerHeader>
          <DrawerBody />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

const stressCode = `import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerClose,
  KiraDrawer,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function StressDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <KiraDrawer
        trigger={
          <Button variant="outline" className="w-full whitespace-normal">
            Open long-title empty order sheet
          </Button>
        }
        title="A particularly long order description and fulfillment reference for a narrow screen"
        description="No items have been added to this shipment yet."
        rootProps={{ side: "bottom" }}
        footer={<DrawerClose render={<Button>Continue shopping</Button>} />}
      >
        <p className="text-sm text-muted-foreground">
          Your order is empty. Add an item to inspect its delivery timeline.
        </p>
      </KiraDrawer>

      <Drawer>
        <DrawerTrigger
          disabled
          render={<Button variant="outline" disabled>Disabled drawer trigger</Button>}
        />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Unavailable</DrawerTitle>
          </DrawerHeader>
          <DrawerBody />
        </DrawerContent>
      </Drawer>
    </div>
  );
}`;

const drawerUsageCode = `import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
  DrawerHandle,
  KiraDrawer,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function OrderSheet() {
  const [snap, setSnap] = useState<number | string | null>(0.55);

  return (
    <KiraDrawer
      trigger={<Button>Review order</Button>}
      title="Order summary"
      description="Order No. 4821 · two items ready for review."
      rootProps={{
        side: "bottom",
        snapPoints: [0.55, 1],
        snapPoint: snap,
        onSnapPointChange: setSnap,
      }}
      handle={
        <DrawerHandle
          expanded={snap === 1}
          onExpandedChange={(expanded) => setSnap(expanded ? 1 : 0.55)}
        />
      }
      footer={<DrawerClose render={<Button>Close order</Button>} />}
    >
      <p>2 items · $68.00</p>
    </KiraDrawer>
  );
}`;

export default function DrawerPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Drawer"
        description="An edge panel for details and mobile sheets, with visible alternatives to swipe gestures."
        version="v2.3.0"
      />

      <FeatureGrid
        features={drawerPageFeatures}
        description="Built on Base UI Drawer with edge placement, snap detents, and keyboard-operable sheet handles."
      />

      <DemoTabs defaultValue="basic" tabs={drawerPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={drawerPageShortcuts}
        description="Keyboard navigation and dismissal bindings provided by Base UI Drawer and DrawerHandle."
      />

      <UsageBlock
        code={drawerUsageCode}
        title="Usage"
        description="Compose Drawer primitives for custom layouts or use KiraDrawer for header, body, handle, and footer scaffolding."
        notes={[
          {
            label: "KiraDrawer",
            body: "Use KiraDrawer when you want trigger, header, scrollable body, optional DrawerHandle, and footer wired automatically.",
          },
          {
            label: "Snap points",
            body: 'Snap points (snapPoints, snapPoint, onSnapPointChange) are supported only on bottom sheets (side="bottom"); pair them with DrawerHandle or explicit expand/collapse buttons for keyboard users.',
          },
          {
            label: "Non-modal drawers",
            body: "Setting modal={false} enables disablePointerDismissal by default so outside clicks keep the drawer open while the page stays interactive.",
          },
        ]}
      />

      <APIReference
        sections={drawerPageAPISections}
        description="Props, types, and defaults for every exported Drawer part and variant helper."
      />

      <Changelog
        entries={drawerPageChangelogEntries}
        title="Changelog"
        description="Version history for the Drawer component."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const drawerSizes = ["sm", "default", "lg", "xl", "full"] as const;

const drawerPositionExamples: readonly {
  side: DrawerSide;
  label: string;
  title: string;
  description: string;
  body: string;
}[] = [
  {
    side: "left",
    label: "Left",
    title: "Left Drawer",
    description: "Slides from left",
    body: "Often used for navigation menus.",
  },
  {
    side: "right",
    label: "Right",
    title: "Right Drawer",
    description: "Slides from right (default)",
    body: "Common for settings panels.",
  },
  {
    side: "top",
    label: "Top",
    title: "Top Drawer",
    description: "Slides from top",
    body: "Useful for notifications.",
  },
  {
    side: "bottom",
    label: "Bottom",
    title: "Bottom Drawer",
    description: "Slides from bottom",
    body: "Common on mobile for action sheets.",
  },
];

const drawerPageFeatures = [
  {
    title: "Multiple Positions",
    description:
      "Slide from left, right, top, or bottom with reduced-motion-aware transitions.",
    icon: <IconLayoutSidebar aria-hidden="true" className="h-5 w-5" />,
  },
  {
    title: "Configurable Sizes",
    description: "Choose from sm, default, lg, xl, or full for perfect sizing.",
    icon: <IconSettings aria-hidden="true" className="h-5 w-5" />,
  },
  {
    title: "Accessibility First",
    description:
      "Full keyboard navigation, focus management, ARIA roles, and keyboard-operable detents.",
    icon: <IconArrowsRight aria-hidden="true" className="h-5 w-5" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const drawerPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    value: "snap",
    label: "Order sheet",
    group: "KiraDrawer",
    demo: (
      <DemoWrapper
        title="Order sheet"
        description="Expand or collapse snap detents with DrawerHandle or buttons without dragging."
        code={snapCode}
      >
        <SnapDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "nonmodal",
    label: "Non-modal",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Keep the page interactive"
        description="Non-modal drawers stay open while you work with the page. Outside clicks don't dismiss them; close with Esc, the close button, or a swipe."
        code={nonModalCode}
      >
        <NonModalDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "nested",
    label: "Nested",
    group: "Behavior",
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
    group: "Behavior",
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
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long wrapping titles, empty body content, and disabled triggers in a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const drawerPageShortcuts = [
  {
    keys: "Enter / Space",
    description:
      "Activate the drawer trigger, close button, or DrawerHandle detent toggle (Kira).",
  },
  {
    keys: "Escape",
    description: "Close the active drawer (Base UI).",
  },
  {
    keys: "Tab",
    description: "Move focus to the next interactive element (Base UI).",
  },
  {
    keys: "Shift + Tab",
    description: "Move focus to the previous interactive element (Base UI).",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const drawerPageAPISections = [
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
        default: "-",
        description:
          "Bottom sheets only: viewport fractions, pixels, or px/rem strings.",
      },
      {
        prop: "snapPoint",
        type: "number | string | null",
        default: "-",
        description: "Controlled active detent.",
      },
      {
        prop: "defaultSnapPoint",
        type: "number | string | null",
        default: "-",
        description: "Initial uncontrolled detent.",
      },
      {
        prop: "onSnapPointChange",
        type: "(snapPoint: number | string | null, details: DrawerPrimitive.Root.SnapPointChangeEventDetails) => void",
        default: "-",
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
          "Modal, non-modal, or focus-trapping without a backdrop. Non-modal (false) stays open on outside presses.",
      },
      {
        prop: "disablePointerDismissal",
        type: "boolean",
        default: "true when modal={false}, else false",
        description:
          "Prevent outside-press dismissal. Pass false explicitly to dismiss non-modal drawers on outside clicks.",
      },
      {
        prop: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Whether the drawer is open by default.",
      },
      {
        prop: "open",
        type: "boolean",
        default: "-",
        description: "Controlled open state.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean, details: DrawerPrimitive.Root.ChangeEventDetails) => void",
        default: "-",
        description: "Callback when open state changes.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Drawer trigger and content parts.",
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
        description: "Element that triggers the drawer.",
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
        description: "Width (left/right) or max-height (top/bottom) variant.",
      },
      {
        prop: "showCloseButton",
        type: "boolean",
        default: "true",
        description: "Show the labelled close button.",
      },
      {
        prop: "portalProps",
        type: "Omit<DrawerPrimitive.Portal.Props, 'children'>",
        default: "-",
        description:
          "Configure the internal portal, including keepMounted and container.",
      },
      {
        prop: "overlayProps",
        type: "DrawerOverlayProps",
        default: "-",
        description:
          "Configure the internal backdrop without duplicating drawer composition.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes applied to the popup.",
      },
      {
        prop: "style",
        type: "React.CSSProperties",
        default: "-",
        description: "Inline styles merged onto the popup.",
      },
    ],
  },
  {
    title: "DrawerHandle",
    props: [
      {
        prop: "expanded",
        type: "boolean",
        default: "-",
        description:
          "Current detent; exposes aria-expanded and an accessible action name.",
      },
      {
        prop: "onExpandedChange",
        type: "(expanded: boolean) => void",
        default: "-",
        description:
          "Update the controlled snap point. Enter, Space, and click activate the same action.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the handle button.",
      },
      {
        prop: "ButtonPrimitive.Props",
        type: "Omit<ButtonPrimitive.Props, 'children' | 'className'>",
        default: "-",
        description:
          "Native button props, ref, disabled state, and aria-controls.",
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
        description: "Additional CSS classes.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Header content (DrawerTitle, DrawerDescription).",
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
        description: "Additional CSS classes.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Title text or content.",
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
        description: "Additional CSS classes.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Description text or content.",
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
        description: "Additional CSS classes.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Scrollable main content area.",
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
        description: "Additional CSS classes.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Footer content (typically action buttons).",
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
        description: "Element that closes the drawer.",
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
        default: "-",
        description: "Portal destination.",
      },
    ],
  },
  {
    title: "DrawerOverlay",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Backdrop styling.",
      },
    ],
  },
  {
    title: "KiraDrawer",
    props: [
      {
        prop: "trigger",
        type: "ReactElement",
        default: "-",
        description: "Element rendered as the trigger.",
      },
      {
        prop: "title",
        type: "ReactNode",
        default: "-",
        description: "Accessible drawer title.",
      },
      {
        prop: "description",
        type: "ReactNode",
        default: "-",
        description: "Optional drawer description.",
      },
      {
        prop: "handle",
        type: "ReactNode",
        default: "-",
        description: "Optional keyboard-operable control above the header.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Scrollable body content.",
      },
      {
        prop: "footer",
        type: "ReactNode",
        default: "-",
        description: "Optional footer actions.",
      },
      {
        prop: "rootProps",
        type: "WithoutChildren<DrawerProps>",
        default: "-",
        description: "Side, state, and snap-point options.",
      },
      {
        prop: "contentProps",
        type: "Omit<DrawerContentProps, 'children'>",
        default: "-",
        description: "Popup, overlay, and portal options.",
      },
    ],
  },
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
