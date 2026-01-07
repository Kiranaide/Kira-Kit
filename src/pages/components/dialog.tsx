import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxValue,
} from "@/components/ui/combobox";

export function DialogPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Dialog</h1>
        <p className="text-muted-foreground">
          A modal dialog that interrupts the user with important content.
        </p>
      </header>

      {/* Basic Dialog */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Dialog
        </h2>
        <Dialog>
          <DialogTrigger
            render={<Button variant="outline">Open Dialog</Button>}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Welcome to Kira Kit</DialogTitle>
              <DialogDescription>
                This is a basic dialog with a title and description.
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              You can put any content here including forms, images, or other
              components.
            </p>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button>Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Size Variants
        </h2>
        <div className="flex flex-wrap gap-4">
          {(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
            <Dialog key={size}>
              <DialogTrigger
                render={
                  <Button variant="outline" className="capitalize">
                    {size} ({size === "full" ? "Fullscreen" : "Pop-up"})
                  </Button>
                }
              />
              <DialogContent size={size}>
                <DialogHeader>
                  <DialogTitle className="capitalize">
                    {size} Dialog
                  </DialogTitle>
                  <DialogDescription>
                    This is a dialog with <code>size="{size}"</code>.
                  </DialogDescription>
                </DialogHeader>
                <div className="h-32 flex items-center justify-center bg-muted/20 rounded-lg border border-dashed">
                  Content Area
                </div>
                <DialogFooter>
                  <DialogClose render={<Button>Close</Button>} />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </section>

      {/* Form Dialog */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Form Dialog
        </h2>
        <Dialog>
          <DialogTrigger render={<Button>Edit Profile</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when done.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="john@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Without Close Button */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Without Close Button
        </h2>
        <Dialog>
          <DialogTrigger
            render={<Button variant="outline">Open (No X)</Button>}
          />
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Important Notice</DialogTitle>
              <DialogDescription>
                This dialog has no X button. Use the cancel button to close.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Close</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger render={<Button>Open</Button>} />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose render={<Button>Close</Button>} />
    </DialogFooter>
  </DialogContent>
</Dialog>`}
          </pre>
        </div>
      </section>

      {/* Form with Popovers */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Form with Popovers (Accessibility Test)
        </h2>
        <p className="text-sm text-muted-foreground">
          Testing interaction with nested popovers (DatePicker, Combobox) inside
          a dialog, and sticky footer behavior in full-screen mode.
        </p>
        <Dialog>
          <DialogTrigger render={<Button>Open Complex Form</Button>} />
          <DialogContent size="full">
            <DialogHeader>
              <DialogTitle>Schedule Meeting</DialogTitle>
              <DialogDescription>
                Fill out the form below to schedule a new meeting.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="grid gap-6 max-w-md mx-auto">
                <div className="space-y-2">
                  <Label>Meeting Title</Label>
                  <Input placeholder="e.g. Q4 Planning" />
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <DatePicker placeholder="Pick a date" />
                </div>

                <div className="space-y-2">
                  <Label>Participants</Label>
                  <Combobox>
                    <ComboboxTrigger className="w-full">
                      <ComboboxInput placeholder="Select team member..." />
                    </ComboboxTrigger>
                    <ComboboxContent>
                      <ComboboxList>
                        <ComboboxEmpty>No results found.</ComboboxEmpty>
                        <ComboboxItem>
                          <ComboboxValue>Alice Johnson</ComboboxValue>
                        </ComboboxItem>
                        <ComboboxItem>
                          <ComboboxValue>Bob Smith</ComboboxValue>
                        </ComboboxItem>
                        <ComboboxItem>
                          <ComboboxValue>Charlie Brown</ComboboxValue>
                        </ComboboxItem>
                        <ComboboxItem>
                          <ComboboxValue>Diana Prince</ComboboxValue>
                        </ComboboxItem>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Meeting agenda..." className="h-32" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button>Schedule Meeting</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
