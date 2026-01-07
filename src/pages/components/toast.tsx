import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ToastPage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Toast</h1>
        <p className="text-lg text-muted-foreground">
          A succinct message that is displayed temporarily. Built using Sonner.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <p className="text-sm text-muted-foreground">
          Call the <code>toast</code> function to display a notification.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() => toast("Event has been created")}
          >
            Default
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.success("Event has been created")}
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info("New message received")}
          >
            Info
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.warning("Event start time cannot be in the past")
            }
          >
            Warning
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error("Event has not been created")}
          >
            Error
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Action
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() =>
              toast("Event has been created", {
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo"),
                },
              })
            }
          >
            With Action Button
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Description
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() =>
              toast.message("Event has been created", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
              })
            }
          >
            With Description
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Positions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() => toast("Top Right", { position: "top-right" })}
          >
            Top Right
          </Button>
          <Button
            variant="outline"
            onClick={() => toast("Top Center", { position: "top-center" })}
          >
            Top Center
          </Button>
          <Button
            variant="outline"
            onClick={() => toast("Bottom Right", { position: "bottom-right" })}
          >
            Bottom Right
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Bottom Center", { position: "bottom-center" })
            }
          >
            Bottom Center
          </Button>
        </div>
      </section>
    </div>
  );
}
