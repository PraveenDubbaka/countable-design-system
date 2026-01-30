import * as React from "react";

import { cn } from "@/lib/utils";

// Futuristic Outlined TextField - Expanded for better UX
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { error?: boolean; size?: "default" | "lg" | "xl" }>(
  ({ className, type, error, size = "default", ...props }, ref) => {
    const sizeClasses = {
      default: "h-12 px-5 py-3 text-sm",
      lg: "h-14 px-6 py-4 text-base",
      xl: "h-16 px-6 py-5 text-base",
    };
    
    return (
      <input
        type={type}
        className={cn(
          // Base styles - expanded with better spacing
          "flex w-full rounded-xl ring-offset-background transition-all duration-300",
          sizeClasses[size],
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
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
  },
);
Input.displayName = "Input";

// Futuristic Filled TextField - Expanded for better UX
const InputFilled = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { error?: boolean; size?: "default" | "lg" | "xl" }>(
  ({ className, type, error, size = "default", ...props }, ref) => {
    const sizeClasses = {
      default: "h-12 px-5 py-3 text-sm",
      lg: "h-14 px-6 py-4 text-base",
      xl: "h-16 px-6 py-5 text-base",
    };
    
    return (
      <input
        type={type}
        className={cn(
          // Base styles - expanded
          "flex w-full rounded-t-xl rounded-b-none ring-offset-background transition-all duration-300",
          sizeClasses[size],
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Default state: subtle muted background
          "bg-muted/60 border-b-2 border-transparent text-foreground placeholder:text-muted-foreground/70",
          // Hover state
          "hover:bg-muted/80 hover:border-primary/30",
          // Focus state: primary bottom border with glow
          "focus:outline-none focus:border-primary focus:bg-muted/90",
          "focus-visible:outline-none focus-visible:border-primary",
          // Disabled state
          "disabled:cursor-not-allowed disabled:bg-muted/30 disabled:border-transparent disabled:text-muted-foreground disabled:opacity-50",
          // Error state
          error && "border-b-2 border-destructive hover:border-destructive focus:border-destructive focus-visible:border-destructive",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
InputFilled.displayName = "InputFilled";

export { Input, InputFilled };
