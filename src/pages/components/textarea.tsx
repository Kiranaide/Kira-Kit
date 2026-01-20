import * as React from "react";
import {
  Textarea,
  TextareaWithCounter,
} from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TextareaPage() {
  const [counterValue, setCounterValue] = React.useState("");
  const [resize, setResize] = React.useState<"none" | "vertical" | "horizontal" | "both">("none");
  const [useMinRows, setUseMinRows] = React.useState(false);
  const [useMaxRows, setUseMaxRows] = React.useState(false);

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Textarea</h1>
        <p className="text-muted-foreground">
          Multi-line text input with auto-resize, character counter, size variants,
          and more.
        </p>
      </header>

      {/* ============================================
          BASIC TEXTAREA
          ============================================ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Textarea
        </h2>
        <div className="max-w-md">
          <Textarea placeholder="Type your message here..." />
        </div>
      </section>

      {/* ============================================
          SIZE VARIANTS
          ============================================ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Size Variants
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose from sm, default, or lg sizes for different visual emphasis.
        </p>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Small</label>
            <Textarea size="sm" placeholder="Small textarea..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Default</label>
            <Textarea size="default" placeholder="Default textarea..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Large</label>
            <Textarea size="lg" placeholder="Large textarea..." />
          </div>
        </div>
      </section>

      {/* ============================================
          RESIZE CONTROL
          ============================================ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Resize Control
        </h2>
        <p className="text-sm text-muted-foreground">
          Control how users can resize the textarea: none, vertical, horizontal, or both.
        </p>
        <div className="flex gap-2">
          <Button
            variant={resize === "none" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setResize("none")}
          >
            None
          </Button>
          <Button
            variant={resize === "vertical" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setResize("vertical")}
          >
            Vertical
          </Button>
          <Button
            variant={resize === "horizontal" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setResize("horizontal")}
          >
            Horizontal
          </Button>
          <Button
            variant={resize === "both" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setResize("both")}
          >
            Both
          </Button>
        </div>
        <div className="max-w-md">
          <Textarea
            resize={resize}
            placeholder={`Resize: ${resize}`}
            minRows={useMinRows ? 3 : undefined}
            maxRows={useMaxRows ? 10 : undefined}
          />
        </div>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useMinRows}
              onChange={(e) => setUseMinRows(e.target.checked)}
            />
            Min Rows (3)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useMaxRows}
              onChange={(e) => setUseMaxRows(e.target.checked)}
            />
            Max Rows (10)
          </label>
        </div>
      </section>

      {/* ============================================
          CHARACTER COUNTER
          ============================================ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Character Counter
        </h2>
        <p className="text-sm text-muted-foreground">
          Real-time character counter with warning at 80% and error at 100%.
        </p>
        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Show Current/Max</label>
            <TextareaWithCounter
              value={counterValue}
              onChange={(e) => setCounterValue(e.target.value)}
              maxLength={200}
              warningThreshold={0.8}
              placeholder="Type something..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Show Remaining</label>
            <TextareaWithCounter
              value={counterValue}
              onChange={(e) => setCounterValue(e.target.value)}
              maxLength={200}
              warningThreshold={0.8}
              showRemaining
              placeholder="Type something..."
            />
          </div>
        </div>
      </section>

      {/* ============================================
          ARIA & ACCESSIBILITY
          ============================================ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Accessibility Features
        </h2>
        <p className="text-sm text-muted-foreground">
          Built with WCAG 2.2 AA compliance including ARIA attributes and keyboard support.
        </p>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc ml-4">
          <li><strong>aria-describedby:</strong> Links helper text and character counter</li>
          <li><strong>aria-required:</strong> Indicates required fields</li>
          <li><strong>aria-invalid:</strong> Error state for screen readers</li>
          <li><strong>aria-live:</strong> Live region for character counter updates</li>
          <li><strong>Keyboard Navigation:</strong> Full keyboard support</li>
          <li><strong>Focus Management:</strong> 3:1 contrast focus indicators</li>
        </ul>
        <div className="max-w-md space-y-2">
          <label className="text-sm font-medium">
            With error state
          </label>
          <TextareaWithCounter
            maxLength={100}
            value={counterValue}
            onChange={(e) => setCounterValue(e.target.value)}
            aria-invalid={counterValue.length > 80}
            placeholder="Over 80 characters shows error..."
          />
        </div>
      </section>

      {/* ============================================
          USAGE EXAMPLES
          ============================================ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-foreground">
                  {`<Textarea placeholder="Type here..." />
<Textarea size="sm" />
<Textarea size="default" />
<Textarea size="lg" />`}
                </pre>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>With Counter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-foreground">
                  {`<TextareaWithCounter
  maxLength={500}
  warningThreshold={0.8}
  showRemaining
/>`}
                </pre>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Resize & Height</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-foreground">
                  {`<Textarea
  resize="vertical"
  minRows={3}
  maxRows={10}
  autoSize={true}
/>`}
                </pre>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-foreground">
                  {`<Textarea
  aria-describedby="helper-text"
  aria-required
  aria-invalid={hasError}
/>`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============================================
          AVAILABLE FEATURES
          ============================================ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Available Features
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Props</h4>
            <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
              <li>size - sm / default / lg</li>
              <li>resize - none / vertical / horizontal / both</li>
              <li>minRows / maxRows - Height constraints</li>
              <li>autoSize - Auto-resize based on content</li>
              <li>aria-describedby - Link helper text</li>
              <li>aria-required - Mark as required</li>
              <li>aria-invalid - Error state</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Components</h4>
            <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
              <li>Textarea - Base component</li>
              <li>TextareaWithCounter - With character limit</li>
            </ul>
            <h4 className="font-medium mt-3 mb-2">Features</h4>
            <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
              <li>Auto-resize using CSS field-sizing</li>
              <li>Character counter with live region</li>
              <li>Warning colors (80% / 100%)</li>
              <li>Screen reader announcements</li>
              <li>Export textareaVariants for extension</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
