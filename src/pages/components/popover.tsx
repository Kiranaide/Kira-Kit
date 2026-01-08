import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverBackdrop,
} from "@/components/ui/popover";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PopoverPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Popover</h1>
        <p className="text-muted-foreground">
          Displays rich content in a floating panel.
        </p>
      </header>

      {/* Basic Popover */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Popover
        </h2>
        <Popover>
          <PopoverTrigger
            render={<Button variant="outline">Open Popover</Button>}
          />
          <PopoverContent>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Popover Content</h4>
              <p className="text-sm text-muted-foreground">
                This is a basic popover with some content inside.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </section>

      {/* With Form */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Form
        </h2>
        <Popover>
          <PopoverTrigger render={<Button>Edit Settings</Button>} />
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Dimensions</h4>
              <div className="grid gap-3">
                <div className="grid grid-cols-3 items-center gap-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    defaultValue="100%"
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    defaultValue="auto"
                    className="col-span-2"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <PopoverClose render={<Button size="sm">Apply</Button>} />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </section>

      {/* Multiple Triggers */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Different Content
        </h2>
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="outline" size="sm">
                  Info
                </Button>
              }
            />
            <PopoverContent>
              <p className="text-sm">This is helpful information.</p>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="outline" size="sm">
                  Warning
                </Button>
              }
            />
            <PopoverContent>
              <p className="text-sm text-warning-foreground">
                ⚠️ Please be careful!
              </p>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="outline" size="sm">
                  Profile
                </Button>
              }
            />
            <PopoverContent>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">
                    john@example.com
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Size Variants
        </h2>
        <div className="flex flex-wrap gap-4">
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline">Small Popover</Button>}
            />
            <PopoverContent size="sm">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Small</h4>
                <p className="text-sm text-muted-foreground">Compact (w-48).</p>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger
              render={<Button variant="outline">Large Popover</Button>}
            />
            <PopoverContent size="lg">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Large</h4>
                <p className="text-sm text-muted-foreground">
                  Wide (w-96). Great for complex content.
                </p>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger
              render={<Button variant="outline">Auto Width</Button>}
            />
            <PopoverContent size="auto">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Auto Width</h4>
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  Adapts to content.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* Modal Popover */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Modal Popover
        </h2>
        <Popover modal>
          <PopoverTrigger
            render={<Button variant="default">Open Modal Popover</Button>}
          />
          <PopoverPrimitive.Portal>
            <PopoverBackdrop />
            <PopoverPrimitive.Positioner
              side="bottom"
              sideOffset={4}
              className="z-50"
            >
              <PopoverPrimitive.Popup className="w-80 rounded-lg border border-border bg-popover p-4 shadow-lg outline-none data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-lg leading-none">
                      Modal-like Behavior
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      This popover has a backdrop (blur + dim) and behaves like
                      a dialog.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <PopoverClose
                      render={<Button variant="outline">Cancel</Button>}
                    />
                    <PopoverClose render={<Button>Confirm</Button>} />
                  </div>
                </div>
              </PopoverPrimitive.Popup>
            </PopoverPrimitive.Positioner>
          </PopoverPrimitive.Portal>
        </Popover>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover"

<Popover>
  <PopoverTrigger render={<Button>Open</Button>} />
  <PopoverContent>
    <p>Popover content here</p>
    <PopoverClose render={<Button>Close</Button>} />
  </PopoverContent>
</Popover>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
