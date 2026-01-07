import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function AlertDialogPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Alert Dialog</h1>
        <p className="text-muted-foreground">
          Modal dialog for important confirmations that require user action.
        </p>
      </header>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Alert Dialog
        </h2>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="outline">Show Dialog</Button>}
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* Destructive */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Destructive Action
        </h2>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="destructive">Delete Account</Button>}
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete your account? All of your data
                will be permanently removed. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Yes, delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* Centered Layout */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Centered Layout
        </h2>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="outline">Centered Dialog</Button>}
          />
          <AlertDialogContent>
            <AlertDialogHeader centered>
              <AlertDialogTitle>Successfully Saved</AlertDialogTitle>
              <AlertDialogDescription>
                Your changes have been saved successfully to the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-center py-4">
              <div className="bg-success/20 text-success-foreground p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
            </div>
            <AlertDialogFooter centered>
              <AlertDialogAction className="w-full sm:w-auto">
                Awesome
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

<AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Title</AlertDialogTitle>
      <AlertDialogDescription>Description</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
