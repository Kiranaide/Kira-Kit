import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverBackdrop,
  PopoverTitle,
  PopoverDescription,
  PopoverArrow,
} from "@/components/ui/popover";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function OnOpenChangeExample() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        State: <strong>{isOpen ? "Open" : "Closed"}</strong>
      </p>
      <Popover onOpenChange={setIsOpen}>
        <PopoverTrigger
          render={<Button variant="outline">Toggle Popover</Button>}
        />
        <PopoverContent>
          <PopoverTitle>Controlled State</PopoverTitle>
          <PopoverDescription>
            The parent receives open/close events via onOpenChange.
          </PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function FocusManagementExample() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline">Focus on Input</Button>}
      />
      <PopoverContent initialFocus={() => inputRef.current}>
        <PopoverTitle>Initial Focus</PopoverTitle>
        <PopoverDescription>
          Focus automatically moves to the input field when opened.
        </PopoverDescription>
        <div className="mt-4 space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="focusInput">Name</Label>
            <Input ref={inputRef} id="focusInput" placeholder="Enter name..." />
          </div>
          <PopoverClose render={<Button size="sm">Done</Button>} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

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
            <PopoverTitle>Popover Title</PopoverTitle>
            <PopoverDescription>
              This is a basic popover with accessible title and description.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      </section>

      {/* With Arrow */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Arrow
        </h2>
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline">Default</Button>}
            />
            <PopoverContent>
              <PopoverArrow />
              <PopoverTitle>With Arrow</PopoverTitle>
              <PopoverDescription>
                The arrow points to the trigger element.
              </PopoverDescription>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline">Outline Variant</Button>}
            />
            <PopoverContent variant="outline">
              <PopoverArrow variant="outline" />
              <PopoverTitle>Outline Style</PopoverTitle>
              <PopoverDescription>
                Both content and arrow use outline variant.
              </PopoverDescription>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Variants
        </h2>
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline">Default</Button>}
            />
            <PopoverContent variant="default">
              <PopoverTitle>Default Variant</PopoverTitle>
              <PopoverDescription>
                Uses popover background color.
              </PopoverDescription>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline">Outline</Button>}
            />
            <PopoverContent variant="outline">
              <PopoverTitle>Outline Variant</PopoverTitle>
              <PopoverDescription>
                Uses background color for a lighter feel.
              </PopoverDescription>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* With Form */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Form
        </h2>
        <Popover>
          <PopoverTrigger render={<Button>Edit Settings</Button>} />
          <PopoverContent className="w-80">
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the width and height of your element.
            </PopoverDescription>
            <div className="mt-4 grid gap-3">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="width">Width</Label>
                <Input id="width" defaultValue="100%" className="col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="height">Height</Label>
                <Input id="height" defaultValue="auto" className="col-span-2" />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <PopoverClose render={<Button size="sm">Apply</Button>} />
            </div>
          </PopoverContent>
        </Popover>
      </section>

      {/* onOpenChange Callback */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          onOpenChange Callback
        </h2>
        <p className="text-sm text-muted-foreground">
          Track popover state changes with the onOpenChange prop.
        </p>
        <OnOpenChangeExample />
      </section>

      {/* Focus Management */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Focus Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Use{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            initialFocus
          </code>{" "}
          to control which element receives focus when the popover opens.
        </p>
        <FocusManagementExample />
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
              <PopoverTitle>Small</PopoverTitle>
              <PopoverDescription>Compact (w-48).</PopoverDescription>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger
              render={<Button variant="outline">Large Popover</Button>}
            />
            <PopoverContent size="lg">
              <PopoverTitle>Large</PopoverTitle>
              <PopoverDescription>
                Wide (w-96). Great for complex content.
              </PopoverDescription>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger
              render={<Button variant="outline">Auto Width</Button>}
            />
            <PopoverContent size="auto">
              <PopoverTitle>Auto Width</PopoverTitle>
              <PopoverDescription className="whitespace-nowrap">
                Adapts to content.
              </PopoverDescription>
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

      {/* Accessibility Notes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Accessibility
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div>
            <h4 className="font-medium text-sm">PopoverTitle</h4>
            <p className="text-sm text-muted-foreground">
              Automatically sets{" "}
              <code className="text-xs">aria-labelledby</code> on the popover.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm">PopoverDescription</h4>
            <p className="text-sm text-muted-foreground">
              Automatically sets{" "}
              <code className="text-xs">aria-describedby</code> on the popover.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm">Focus Management</h4>
            <p className="text-sm text-muted-foreground">
              Use <code className="text-xs">initialFocus</code> and{" "}
              <code className="text-xs">finalFocus</code> props to control focus
              behavior.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm">Keyboard Navigation</h4>
            <p className="text-sm text-muted-foreground">
              Press{" "}
              <kbd className="text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">
                Esc
              </kbd>{" "}
              to close. Focus is trapped within modal popovers.
            </p>
          </div>
        </div>
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
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover"

{/* Basic with accessibility */}
<Popover onOpenChange={(open) => console.log(open)}>
  <PopoverTrigger render={<Button>Open</Button>} />
  <PopoverContent>
    <PopoverTitle>Title</PopoverTitle>
    <PopoverDescription>Description for screen readers.</PopoverDescription>
    <PopoverClose render={<Button>Close</Button>} />
  </PopoverContent>
</Popover>

{/* With focus management */}
<PopoverContent initialFocus={() => inputRef.current}>
  ...
</PopoverContent>

{/* Outline variant */}
<PopoverContent variant="outline">
  ...
</PopoverContent>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
