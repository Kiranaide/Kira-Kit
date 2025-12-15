import * as React from "react";
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

export function DrawerPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Drawer</h1>
        <p className="text-muted-foreground">
          A panel that slides in from the edge of the screen.
        </p>
      </header>

      {/* Right Drawer (default) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Right Drawer (Default)
        </h2>
        <Drawer>
          <DrawerTrigger
            render={<Button variant="outline">Open Right</Button>}
          />
          <DrawerContent side="right">
            <DrawerHeader>
              <DrawerTitle>Right Drawer</DrawerTitle>
              <DrawerDescription>
                This drawer slides in from the right.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p className="text-sm text-muted-foreground">
                You can put any content here. The drawer is scrollable if
                content overflows.
              </p>
            </DrawerBody>
            <DrawerFooter>
              <DrawerClose render={<Button variant="outline">Cancel</Button>} />
              <Button>Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </section>

      {/* Left Drawer */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Left Drawer
        </h2>
        <Drawer>
          <DrawerTrigger
            render={<Button variant="outline">Open Left</Button>}
          />
          <DrawerContent side="left">
            <DrawerHeader>
              <DrawerTitle>Left Drawer</DrawerTitle>
              <DrawerDescription>
                This drawer slides in from the left.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p className="text-sm text-muted-foreground">
                Often used for navigation menus.
              </p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </section>

      {/* Top Drawer */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Top Drawer
        </h2>
        <Drawer>
          <DrawerTrigger render={<Button variant="outline">Open Top</Button>} />
          <DrawerContent side="top">
            <DrawerHeader>
              <DrawerTitle>Top Drawer</DrawerTitle>
              <DrawerDescription>
                This drawer slides in from the top.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p className="text-sm text-muted-foreground">
                Useful for notifications or quick actions.
              </p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </section>

      {/* Bottom Drawer */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Bottom Drawer
        </h2>
        <Drawer>
          <DrawerTrigger
            render={<Button variant="outline">Open Bottom</Button>}
          />
          <DrawerContent side="bottom">
            <DrawerHeader>
              <DrawerTitle>Bottom Drawer</DrawerTitle>
              <DrawerDescription>
                This drawer slides in from the bottom.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p className="text-sm text-muted-foreground">
                Common on mobile for action sheets.
              </p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
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
  <DrawerContent side="right"> {/* left | right | top | bottom */}
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
          </pre>
        </div>
      </section>
    </div>
  );
}
