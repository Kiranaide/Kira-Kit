import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CheckboxPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Checkbox</h1>
        <p className="text-muted-foreground">
          A control that allows the user to toggle between checked and
          unchecked.
        </p>
      </header>

      {/* Basic Checkbox */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Checkbox
        </h2>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
      </section>

      {/* Default Checked */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Default Checked
        </h2>
        <div className="flex items-center space-x-2">
          <Checkbox id="marketing" defaultChecked />
          <Label htmlFor="marketing">Receive marketing emails</Label>
        </div>
      </section>

      {/* Disabled */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled
        </h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-unchecked" disabled />
            <Label
              htmlFor="disabled-unchecked"
              className="text-muted-foreground"
            >
              Disabled unchecked
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-checked" disabled defaultChecked />
            <Label htmlFor="disabled-checked" className="text-muted-foreground">
              Disabled checked
            </Label>
          </div>
        </div>
      </section>

      {/* With Description */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Description
        </h2>
        <div className="items-top flex space-x-2">
          <Checkbox id="terms2" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="terms2" className="font-medium">
              Accept terms and conditions
            </Label>
            <p className="text-sm text-muted-foreground">
              You agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* Form Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Form Example
        </h2>
        <div className="space-y-4">
          <div className="items-top flex space-x-2">
            <Checkbox id="sidebar" defaultChecked />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="sidebar" className="font-medium">
                Show sidebar
              </Label>
              <p className="text-sm text-muted-foreground">
                Display navigation sidebar
              </p>
            </div>
          </div>
          <div className="items-top flex space-x-2">
            <Checkbox id="notifications" defaultChecked />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="notifications" className="font-medium">
                Enable notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications
              </p>
            </div>
          </div>
          <div className="items-top flex space-x-2">
            <Checkbox id="cookies" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="cookies" className="font-medium">
                Accept cookies
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow tracking cookies
              </p>
            </div>
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
            {`import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>

{/* Controlled */}
<Checkbox
  checked={isChecked}
  onCheckedChange={setIsChecked}
/>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
