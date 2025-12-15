import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  IconInfoCircle,
  IconCheck,
  IconAlertTriangle,
  IconFolder,
  IconFile,
  IconSettings,
} from "@tabler/icons-react";

export function AccordionPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Accordion</h1>
        <p className="text-muted-foreground">
          Collapsible content panels for organizing information.
        </p>
      </header>

      {/* Basic Accordion */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Accordion
        </h2>
        <Accordion defaultValue={["item-1"]}>
          <AccordionItem value="item-1">
            <AccordionTrigger>What is Kira Kit?</AccordionTrigger>
            <AccordionContent>
              Kira Kit is a modern React component library built with Base UI,
              Tailwind CSS, and TypeScript. It provides a set of accessible and
              customizable UI components.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I install it?</AccordionTrigger>
            <AccordionContent>
              Simply copy the components you need into your project. Each
              component is self-contained and can be customized to fit your
              design system.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes! All components are built with accessibility in mind, using
              Base UI primitives that follow WAI-ARIA guidelines.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Without Arrow */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Without Arrow
        </h2>
        <Accordion>
          <AccordionItem value="item-1">
            <AccordionTrigger showArrow={false}>
              Click to expand (no arrow)
            </AccordionTrigger>
            <AccordionContent>
              This accordion item has no chevron arrow indicator.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger showArrow={false}>
              Another item without arrow
            </AccordionTrigger>
            <AccordionContent>
              Clean look without the default arrow icon.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* With Icon */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Icon
        </h2>
        <Accordion>
          <AccordionItem value="item-1">
            <AccordionTrigger icon={<IconFolder className="w-4 h-4" />}>
              Project Files
            </AccordionTrigger>
            <AccordionContent>
              Contains all your project source files and assets.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger icon={<IconFile className="w-4 h-4" />}>
              Documentation
            </AccordionTrigger>
            <AccordionContent>
              README, CHANGELOG, and other documentation files.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger icon={<IconSettings className="w-4 h-4" />}>
              Configuration
            </AccordionTrigger>
            <AccordionContent>
              Project configuration files like tsconfig, vite.config, etc.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Header Background Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Header Background Colors
        </h2>
        <Accordion multiple>
          <AccordionItem value="info">
            <AccordionTrigger
              variant="info"
              icon={<IconInfoCircle className="w-4 h-4" />}
            >
              Information
            </AccordionTrigger>
            <AccordionContent>
              This is an informational message with a blue pastel background.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="success">
            <AccordionTrigger
              variant="success"
              icon={<IconCheck className="w-4 h-4" />}
            >
              Success
            </AccordionTrigger>
            <AccordionContent>
              This indicates a successful action with a green pastel background.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="warning">
            <AccordionTrigger
              variant="warning"
              icon={<IconAlertTriangle className="w-4 h-4" />}
            >
              Warning
            </AccordionTrigger>
            <AccordionContent>
              This warns about potential issues with a yellow pastel background.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="destructive">
            <AccordionTrigger variant="destructive">
              Destructive / Error
            </AccordionTrigger>
            <AccordionContent>
              This indicates an error or destructive action with a red pastel
              background.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Multiple Selection */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Multiple Selection
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Set <code className="bg-muted px-1 rounded">multiple</code> to allow
          opening multiple items at once.
        </p>
        <Accordion multiple defaultValue={["item-1", "item-2"]}>
          <AccordionItem value="item-1">
            <AccordionTrigger>First Item (open by default)</AccordionTrigger>
            <AccordionContent>
              Multiple items can be open simultaneously.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Second Item (open by default)</AccordionTrigger>
            <AccordionContent>
              Click any header to toggle without closing others.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Third Item</AccordionTrigger>
            <AccordionContent>
              This one starts closed but can be opened.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

{/* Basic */}
<Accordion defaultValue={["item-1"]}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Title</AccordionTrigger>
    <AccordionContent>Content</AccordionContent>
  </AccordionItem>
</Accordion>

{/* With Icon */}
<AccordionTrigger icon={<Icon />}>Title</AccordionTrigger>

{/* Without Arrow */}
<AccordionTrigger showArrow={false}>Title</AccordionTrigger>

{/* Colored Header */}
<AccordionTrigger variant="info">Info</AccordionTrigger>
<AccordionTrigger variant="success">Success</AccordionTrigger>
<AccordionTrigger variant="warning">Warning</AccordionTrigger>
<AccordionTrigger variant="destructive">Error</AccordionTrigger>

{/* Multiple open */}
<Accordion openMultiple>...</Accordion>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
