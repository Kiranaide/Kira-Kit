import * as React from "react";
import { Progress, CircularProgress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

function LoadingExample() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadProgress, setLoadProgress] = React.useState(0);

  const handleLoad = () => {
    setIsLoading(true);
    setLoadProgress(0);

    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Add a brief delay to show the complete circle at 100%
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={handleLoad} disabled={isLoading}>
          {isLoading ? "Loading..." : "Start Loading"}
        </Button>
        {isLoading && (
          <div className="flex items-center gap-3">
            <CircularProgress value={loadProgress} showLabel size="sm" />
            <span className="text-sm text-muted-foreground">
              Loading data... {loadProgress}%
            </span>
          </div>
        )}
      </div>
      {!isLoading && loadProgress === 100 && (
        <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
          <p className="text-sm text-success-foreground">
            ✓ Data loaded successfully!
          </p>
        </div>
      )}
    </div>
  );
}

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

      {/* Circular Progress */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Circular Progress
        </h2>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-4">Sizes</p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <CircularProgress value={60} size="sm" />
                <p className="text-xs text-muted-foreground mt-2">Small</p>
              </div>
              <div className="text-center">
                <CircularProgress value={60} size="default" />
                <p className="text-xs text-muted-foreground mt-2">Default</p>
              </div>
              <div className="text-center">
                <CircularProgress value={60} size="lg" />
                <p className="text-xs text-muted-foreground mt-2">Large</p>
              </div>
              <div className="text-center">
                <CircularProgress value={60} size="xl" />
                <p className="text-xs text-muted-foreground mt-2">XL</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-4">With Label</p>
            <div className="flex items-center gap-6">
              <CircularProgress value={75} showLabel />
              <CircularProgress value={45} showLabel variant="success" />
              <CircularProgress value={90} showLabel variant="warning" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Indeterminate (Loading)
            </p>
            <div className="flex items-center gap-6">
              <CircularProgress indeterminate />
              <CircularProgress indeterminate variant="success" />
              <CircularProgress indeterminate variant="info" />
            </div>
          </div>
        </div>
      </section>

      {/* Loading Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Loading Example
        </h2>
        <p className="text-sm text-muted-foreground">
          Circular progress used in a loading state scenario.
        </p>
        <LoadingExample />
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
