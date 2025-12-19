import * as React from "react";
import { Progress } from "@/components/ui/progress";

export function ProgressPage() {
  const [progress, setProgress] = React.useState(45);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 5));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Progress</h1>
        <p className="text-muted-foreground">
          Displays an indicator showing completion progress.
        </p>
      </header>

      {/* Basic Progress */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Progress
        </h2>
        <Progress value={33} />
      </section>

      {/* Animated Progress */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Animated Progress
        </h2>
        <Progress value={progress} />
      </section>

      {/* With Label */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Label
        </h2>
        <Progress value={75} showLabel />
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Small</p>
            <Progress value={60} size="sm" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Default</p>
            <Progress value={60} size="default" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Large</p>
            <Progress value={60} size="lg" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Extra Large</p>
            <Progress value={60} size="xl" />
          </div>
        </div>
      </section>

      {/* Color Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Color Variants
        </h2>
        <div className="space-y-3">
          <Progress value={80} variant="default" />
          <Progress value={80} variant="info" />
          <Progress value={80} variant="success" />
          <Progress value={80} variant="warning" />
          <Progress value={80} variant="destructive" />
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Progress } from "@/components/ui/progress"

<Progress value={33} />

{/* With label */}
<Progress value={75} showLabel />

{/* Variants */}
<Progress value={80} variant="success" size="lg" />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
