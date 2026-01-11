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
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react";

export function AccordionPage() {
  const handleOpen = () => {
    console.log("Accordion item opened");
  };

  const handleClose = () => {
    console.log("Accordion item closed");
  };

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

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Size Variants
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use the <code className="bg-muted px-1 rounded">size</code> prop to
          change trigger and content sizes.
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">xs</h3>
            <Accordion>
              <AccordionItem value="item-1">
                <AccordionTrigger size="xs">Extra Small</AccordionTrigger>
                <AccordionContent size="xs">
                  This is extra small content.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">sm</h3>
            <Accordion>
              <AccordionItem value="item-1">
                <AccordionTrigger size="sm">Small</AccordionTrigger>
                <AccordionContent size="sm">
                  This is small content.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">default</h3>
            <Accordion>
              <AccordionItem value="item-1">
                <AccordionTrigger size="default">Default</AccordionTrigger>
                <AccordionContent size="default">
                  This is default size content.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">lg</h3>
            <Accordion>
              <AccordionItem value="item-1">
                <AccordionTrigger size="lg">Large</AccordionTrigger>
                <AccordionContent size="lg">
                  This is large content with more padding.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Ghost and Outline Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Ghost and Outline Variants
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use <code className="bg-muted px-1 rounded">variant="ghost"</code> or{" "}
          <code className="bg-muted px-1 rounded">variant="outline"</code> for
          alternative styles.
        </p>
        <Accordion>
          <AccordionItem value="ghost">
            <AccordionTrigger variant="ghost">Ghost Variant</AccordionTrigger>
            <AccordionContent>
              Ghost variant has no background color until hovered.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="outline">
            <AccordionTrigger variant="outline">
              Outline Variant
            </AccordionTrigger>
            <AccordionContent>
              Outline variant has a border but no background color.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Custom Chevron Icon */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Custom Chevron Icon
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use <code className="bg-muted px-1 rounded">chevronIcon</code> to
          replace the default chevron.
        </p>
        <Accordion>
          <AccordionItem value="item-1">
            <AccordionTrigger
              chevronIcon={<IconChevronRight className="w-4 h-4" />}
              chevronPosition="end"
            >
              Custom Chevron (Right Arrow)
            </AccordionTrigger>
            <AccordionContent>
              This accordion uses a custom right arrow icon instead of the
              default chevron.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger
              chevronIcon={<IconPlus className="w-4 h-4" />}
              showArrow={false}
            >
              Plus/Minus Toggle
            </AccordionTrigger>
            <AccordionContent>
              This accordion uses a plus/minus style toggle indicator.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled State
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use the <code className="bg-muted px-1 rounded">disabled</code> prop
          on AccordionItem to disable interaction.
        </p>
        <Accordion>
          <AccordionItem value="item-1">
            <AccordionTrigger>Enabled Item</AccordionTrigger>
            <AccordionContent>This item can be toggled.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" disabled>
            <AccordionTrigger>Disabled Item</AccordionTrigger>
            <AccordionContent>
              This item cannot be interacted with.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Another Enabled Item</AccordionTrigger>
            <AccordionContent>This item can also be toggled.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Callbacks */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Callbacks
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use <code className="bg-muted px-1 rounded">onOpen</code> and{" "}
          <code className="bg-muted px-1 rounded">onClose</code> props on
          AccordionItem for lifecycle callbacks. Check console for logs.
        </p>
        <Accordion>
          <AccordionItem
            value="item-1"
            onOpen={handleOpen}
            onClose={handleClose}
          >
            <AccordionTrigger>With Callbacks</AccordionTrigger>
            <AccordionContent>
              Open and close this item to see console logs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Lazy Mount with Skeleton */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Lazy Mount with Skeleton
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use <code className="bg-muted px-1 rounded">lazyMount</code> and{" "}
          <code className="bg-muted px-1 rounded">showSkeleton</code> to defer
          rendering until opened and show a loading state.
        </p>
        <Accordion>
          <AccordionItem value="item-1">
            <AccordionTrigger>Regular Content</AccordionTrigger>
            <AccordionContent>
              This content renders immediately.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Lazy Mounted with Skeleton</AccordionTrigger>
            <AccordionContent lazyMount showSkeleton skeletonLines={4}>
              <p>This content is loaded only when opened.</p>
              <p>The skeleton shown while loading.</p>
              <p>More content loaded on demand.</p>
              <p>Final piece of content.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Inset Padding */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Inset Padding
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use <code className="bg-muted px-1 rounded">inset</code> prop on
          AccordionContent for nested accordions.
        </p>
        <Accordion multiple>
          <AccordionItem value="item-1">
            <AccordionTrigger>Parent Item 1</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">This is parent content.</p>
              <Accordion>
                <AccordionItem value="child-1">
                  <AccordionTrigger>Nested Child 1</AccordionTrigger>
                  <AccordionContent inset>
                    This nested accordion has inset padding for visual
                    hierarchy.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="child-2">
                  <AccordionTrigger>Nested Child 2</AccordionTrigger>
                  <AccordionContent inset>
                    Another nested accordion item with inset.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Parent Item 2</AccordionTrigger>
            <AccordionContent>
              Another parent item without nested content.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Scroll Into View */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Scroll Into View
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use <code className="bg-muted px-1 rounded">scrollIntoView</code> prop
          on Accordion to auto-scroll to opened items.
        </p>
        <div className="h-64 overflow-auto border rounded-lg p-4">
          <Accordion scrollIntoView>
            <AccordionItem value="item-1">
              <AccordionTrigger>Item 1 (scroll to see more)</AccordionTrigger>
              <AccordionContent>
                Content for item 1. Opening this should scroll it into view.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Item 2</AccordionTrigger>
              <AccordionContent>Content for item 2.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Item 3</AccordionTrigger>
              <AccordionContent>Content for item 3.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Item 4</AccordionTrigger>
              <AccordionContent>Content for item 4.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Item 5</AccordionTrigger>
              <AccordionContent>Content for item 5.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>Item 6</AccordionTrigger>
              <AccordionContent>Content for item 6.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>Item 7</AccordionTrigger>
              <AccordionContent>Content for item 7.</AccordionContent>
            </AccordionItem>
          </Accordion>
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
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

// Basic
<Accordion defaultValue={["item-1"]}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Title</AccordionTrigger>
    <AccordionContent>Content</AccordionContent>
  </AccordionItem>
</Accordion>

// With Icon (backward compatible)
<AccordionTrigger icon={<Icon />}>Title</AccordionTrigger>

// Without Arrow
<AccordionTrigger showArrow={false}>Title</AccordionTrigger>

// Colored Header
<AccordionTrigger variant="info">Info</AccordionTrigger>
<AccordionTrigger variant="success">Success</AccordionTrigger>
<AccordionTrigger variant="warning">Warning</AccordionTrigger>
<AccordionTrigger variant="destructive">Error</AccordionTrigger>
<AccordionTrigger variant="ghost">Ghost</AccordionTrigger>
<AccordionTrigger variant="outline">Outline</AccordionTrigger>

// Sizes
<AccordionTrigger size="xs">Extra Small</AccordionTrigger>
<AccordionTrigger size="sm">Small</AccordionTrigger>
<AccordionTrigger size="default">Default</AccordionTrigger>
<AccordionTrigger size="lg">Large</AccordionTrigger>

// Multiple open
<Accordion multiple>...</Accordion>

// Disabled Item
<AccordionItem value="item-1" disabled>...</AccordionItem>

// With Callbacks
<AccordionItem value="item-1" onOpen={() => {}} onClose={() => {}}>
  <AccordionTrigger>Title</AccordionTrigger>
  <AccordionContent>Content</AccordionContent>
</AccordionItem>

// Lazy Mount with Skeleton
<AccordionContent lazyMount showSkeleton skeletonLines={4}>
  Content loaded on open
</AccordionContent>

// Nested Accordions with Inset
<AccordionContent inset>...</AccordionContent>

// Custom Chevron
<AccordionTrigger chevronIcon={<CustomIcon />} chevronPosition="start">
  Title
</AccordionTrigger>

// Scroll Into View
<Accordion scrollIntoView>...</Accordion>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
