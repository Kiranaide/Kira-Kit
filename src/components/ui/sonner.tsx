import { useTheme } from "@/components/ui/sidebar";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error:
            "group-[.toaster]:!border-destructive group-[.toaster]:!text-destructive",
          success:
            "group-[.toaster]:!border-success group-[.toaster]:!text-success",
          warning:
            "group-[.toaster]:!border-warning group-[.toaster]:!text-warning",
          info: "group-[.toaster]:!border-info group-[.toaster]:!text-info",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
