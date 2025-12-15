import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
} from "@tabler/icons-react";

export function ButtonGroupPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Button Group</h1>
        <p className="text-muted-foreground">
          Groups multiple buttons together with seamless styling.
        </p>
      </header>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Button Group
        </h2>
        <ButtonGroup>
          <Button variant="outline">Left</Button>
          <Button variant="outline">Center</Button>
          <Button variant="outline">Right</Button>
        </ButtonGroup>
      </section>

      {/* Icon Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Icon Buttons
        </h2>
        <div className="flex gap-4">
          <ButtonGroup>
            <Button variant="outline" size="icon">
              <IconBold className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <IconItalic className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <IconUnderline className="w-4 h-4" />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="icon">
              <IconAlignLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <IconAlignCenter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <IconAlignRight className="w-4 h-4" />
            </Button>
          </ButtonGroup>
        </div>
      </section>

      {/* Vertical */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Vertical Orientation
        </h2>
        <ButtonGroup orientation="vertical">
          <Button variant="outline">Top</Button>
          <Button variant="outline">Middle</Button>
          <Button variant="outline">Bottom</Button>
        </ButtonGroup>
      </section>

      {/* Mixed Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Mixed Button Styles
        </h2>
        <ButtonGroup>
          <Button variant="outline">Edit</Button>
          <Button variant="outline">Duplicate</Button>
          <Button variant="destructive">Delete</Button>
        </ButtonGroup>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"

<ButtonGroup>
  <Button variant="outline">One</Button>
  <Button variant="outline">Two</Button>
  <Button variant="outline">Three</Button>
</ButtonGroup>

{/* Vertical orientation */}
<ButtonGroup orientation="vertical">
  ...
</ButtonGroup>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
