import * as React from "react";
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
    </div>
  );
}
