import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  size?: "default" | "lg" | "xl";
}

// Clean Outlined TextArea matching design system
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, size = "default", ...props }, ref) => {
  const sizeClasses = {
    default: "min-h-[140px] px-4 py-4 text-sm",
    lg: "min-h-[180px] px-5 py-5 text-base",
    xl: "min-h-[220px] px-6 py-6 text-base",
  };

  return (
    <textarea
      className={cn(
        // Base styles - 10px border radius
        "flex w-full rounded-[10px] ring-offset-background transition-all duration-200",
        sizeClasses[size],
        // Default state: rgb(246, 247, 249) background, rgb(220, 223, 228) border, 1px border
        "bg-[rgb(246,247,249)] text-foreground placeholder:text-muted-foreground/70",
        "border border-[rgb(220,223,228)]",
        // Dark mode: darker border
        "dark:border-[hsl(220_15%_30%)] dark:bg-card",
        // Hover state: slightly darker border
        "hover:border-[hsl(210_25%_75%)]",
        "dark:hover:border-[hsl(220_15%_40%)]",
        // Focus state: double border effect - outer dark blue, inner light
        "focus:outline-none focus:border-[hsl(207_71%_38%)] focus:shadow-[inset_0_0_0_2px_white,0_0_0_0_transparent]",
        "focus-visible:outline-none focus-visible:border-[hsl(207_71%_38%)] focus-visible:shadow-[inset_0_0_0_2px_white,0_0_0_0_transparent]",
        // Dark mode focus: brighter blue with dark inner
        "dark:focus:border-[hsl(207_80%_60%)] dark:focus:shadow-[inset_0_0_0_2px_hsl(220_15%_20%),0_0_0_0_transparent]",
        "dark:focus-visible:border-[hsl(207_80%_60%)] dark:focus-visible:shadow-[inset_0_0_0_2px_hsl(220_15%_20%),0_0_0_0_transparent]",
        // Disabled state
        "disabled:cursor-not-allowed disabled:bg-muted/50 disabled:border-muted disabled:text-muted-foreground disabled:opacity-50",
        // Error state
        error && "border-destructive hover:border-destructive focus:border-destructive focus-visible:border-destructive focus:ring-destructive/20 focus-visible:ring-destructive/20",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
