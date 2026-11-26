import { useRef, useEffect, useState } from "react";
import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  IconAlertCircle,
  IconRefresh,
  IconHome,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-react";

const ERROR_MESSAGES = {
  ChunkLoadError: {
    title: "Failed to load page",
    description:
      "There was a network error while loading this page. Please check your connection.",
    badge: "Network Error",
  },
  NotFound: {
    title: "Page not found",
    description: "The page you're looking for doesn't exist or has been moved.",
    badge: "Not Found",
  },
  default: {
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again.",
    badge: "Error",
  },
} satisfies Record<
  string,
  { title: string; description: string; badge: string }
>;

function getErrorInfo(error: Pick<Error, "name" | "message">) {
  const { name, message } = error;

  if (name.includes("ChunkLoadError") || message.includes("Loading chunk")) {
    return ERROR_MESSAGES.ChunkLoadError;
  }

  if (name.includes("NotFound") || message.includes("404")) {
    return ERROR_MESSAGES.NotFound;
  }

  return ERROR_MESSAGES.default;
}

export function RouteError({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const retryButtonRef = useRef<HTMLButtonElement>(null);

  const errorInfo = getErrorInfo(
    error instanceof Error ? error : { name: "", message: "" },
  );

  useEffect(() => {
    retryButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.navigate({ to: "/" });
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [router]);

  const handleRetry = () => {
    reset();
  };

  const handleGoHome = () => {
    router.navigate({ to: "/" });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="alert"
      aria-live="assertive"
      aria-label="Error occurred"
    >
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-destructive/10">
            <IconAlertCircle
              className="w-12 h-12 text-destructive"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Badge variant="destructive">{errorInfo.badge}</Badge>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            {errorInfo.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {errorInfo.description}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            ref={retryButtonRef}
            onClick={handleRetry}
            variant="default"
            className="w-full"
          >
            <IconRefresh className="w-4 h-4 mr-2" aria-hidden="true" />
            Try Again
          </Button>
          <Button onClick={handleGoHome} variant="outline" className="w-full">
            <IconHome className="w-4 h-4 mr-2" aria-hidden="true" />
            Go Home
          </Button>
        </div>

        <RouteErrorErrorDetailsSection
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          error={error}
        />
      </div>
    </div>
  );
}

function RouteErrorErrorDetailsSection({
  showDetails,
  setShowDetails,
  error,
}: {
  showDetails: boolean;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  error: unknown;
}) {
  return (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
          />
        }
      >
        View Error Details
        <span className="ml-auto" aria-hidden="true">
          {showDetails ? (
            <IconChevronDown className="w-4 h-4" />
          ) : (
            <IconChevronRight className="w-4 h-4" />
          )}
        </span>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Error Details</h3>
          <pre className="p-4 text-xs bg-muted rounded-lg overflow-auto max-h-64 text-muted-foreground">
            {error instanceof Error
              ? `${error.name}: ${error.message}${error.stack ? "\n\n" + error.stack : ""}`
              : String(error)}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
