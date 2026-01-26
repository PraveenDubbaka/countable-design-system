import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-2xl group-[.toaster]:shadow-lg group-[.toaster]:border-0 group-[.toaster]:px-4 group-[.toaster]:py-3 group-[.toaster]:gap-3",
          description: "group-[.toast]:text-sm group-[.toast]:opacity-90",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-full group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-full group-[.toast]:px-4 group-[.toast]:py-2",
          success:
            "group-[.toaster]:bg-emerald-500 group-[.toaster]:text-white [&>svg]:text-white",
          error:
            "group-[.toaster]:bg-red-500 group-[.toaster]:text-white [&>svg]:text-white",
          warning:
            "group-[.toaster]:bg-amber-500 group-[.toaster]:text-white [&>svg]:text-white",
          info:
            "group-[.toaster]:bg-blue-500 group-[.toaster]:text-white [&>svg]:text-white",
        },
      }}
      icons={{
        success: <CheckCircle2 className="h-5 w-5" />,
        error: <AlertCircle className="h-5 w-5" />,
        warning: <AlertTriangle className="h-5 w-5" />,
        info: <Info className="h-5 w-5" />,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
