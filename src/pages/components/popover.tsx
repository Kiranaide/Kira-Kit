import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";
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
