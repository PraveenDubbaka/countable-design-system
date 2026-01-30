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
        // Base styles
        "flex w-full rounded-xl ring-offset-background transition-all duration-200",
        sizeClasses[size],
        // Default state: subtle gray border
        "bg-card text-foreground placeholder:text-muted-foreground/70",
        "border-2 border-[hsl(210_20%_85%)]",
        // Hover state: slightly darker border
        "hover:border-[hsl(210_25%_75%)]",
        // Focus state: blue border
        "focus:outline-none focus:border-[hsl(207_71%_38%)]",
        "focus-visible:outline-none focus-visible:border-[hsl(207_71%_38%)]",
        // Disabled state
        "disabled:cursor-not-allowed disabled:bg-muted/50 disabled:border-muted disabled:text-muted-foreground disabled:opacity-50",
        // Error state
        error && "border-destructive hover:border-destructive focus:border-destructive focus-visible:border-destructive",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
