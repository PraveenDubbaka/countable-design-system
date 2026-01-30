import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  size?: "default" | "lg" | "xl";
}

// Futuristic Outlined TextArea - Expanded for better UX
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, size = "default", ...props }, ref) => {
  const sizeClasses = {
    default: "min-h-[140px] px-5 py-4 text-sm",
    lg: "min-h-[180px] px-6 py-5 text-base",
    xl: "min-h-[220px] px-6 py-6 text-base",
  };

  return (
    <textarea
      className={cn(
        // Base styles - expanded with better spacing
        "flex w-full rounded-xl ring-offset-background transition-all duration-300",
        sizeClasses[size],
        // Default state: subtle background with refined border
        "bg-card/80 border border-border/60 text-foreground placeholder:text-muted-foreground/70",
        // Hover state: gentle glow effect
        "hover:bg-card hover:border-primary/40 hover:shadow-[0_0_15px_hsl(var(--primary)/0.1)]",
        // Focus state: pronounced glow with primary border
        "focus:outline-none focus:bg-card focus:border-primary focus:border-2 focus:shadow-[0_0_20px_hsl(var(--primary)/0.15)]",
        "focus-visible:outline-none focus-visible:bg-card focus-visible:border-primary focus-visible:border-2",
        // Disabled state
        "disabled:cursor-not-allowed disabled:bg-muted/50 disabled:border-transparent disabled:text-muted-foreground disabled:opacity-50",
        // Error state
        error && "bg-card border-destructive border-2 hover:border-destructive focus:border-destructive focus-visible:border-destructive shadow-[0_0_15px_hsl(var(--destructive)/0.1)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
