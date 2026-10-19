export default function OverviewPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Welcome to Kira Kit
        </h1>
        <p className="text-lg text-muted-foreground">
          A modern React component library built with Base UI, Tailwind CSS, and
          TypeScript.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-lg font-semibold mb-2">🎨 Beautiful Design</h3>
          <p className="text-muted-foreground text-sm">
            Carefully crafted components with attention to detail, supporting
            both light and dark themes.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-lg font-semibold mb-2">⚡ Base UI Powered</h3>
          <p className="text-muted-foreground text-sm">
            Built on top of Base UI for unstyled, accessible primitives with
            full customization freedom.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-lg font-semibold mb-2">🔧 TypeScript First</h3>
          <p className="text-muted-foreground text-sm">
            Full TypeScript support with proper type definitions for an
            excellent developer experience.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-lg font-semibold mb-2">📦 70+ Components</h3>
          <p className="text-muted-foreground text-sm">
            A growing collection of essential components: Button, Card, Input,
            Select, and more.
          </p>
        </div>
      </div>

      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
        <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
        <p className="text-muted-foreground text-sm">
          Browse components using the sidebar navigation. Each component page
          shows variants and usage examples.
        </p>
      </div>
    </div>
  );
}
