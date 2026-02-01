import * as React from "react";

import { cn } from "@/lib/utils";

// Clean Outlined TextField matching design system
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { error?: boolean; size?: "default" | "lg" | "xl" }>(
  ({ className, type, error, size = "default", ...props }, ref) => {
    const sizeClasses = {
      default: "h-9 px-3 py-2 text-sm",
      lg: "h-12 px-4 py-3 text-base",
      xl: "h-14 px-5 py-4 text-base",
    };
    
    return (
      <input
        type={type}
        className={cn(
          // Base styles - 10px border radius
          "flex w-full rounded-[10px] ring-offset-background transition-all duration-200",
          sizeClasses[size],
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Default state: rgb(246, 247, 249) background, rgb(220, 223, 228) border, 1px border
          "bg-[rgb(246,247,249)] text-foreground placeholder:text-muted-foreground/70",
          "border border-[rgb(220,223,228)]",
          // Dark mode: darker border
          "dark:border-[hsl(220_15%_30%)] dark:bg-card",
          // Hover state: slightly darker border
          "hover:border-[hsl(210_25%_75%)]",
          "dark:hover:border-[hsl(220_15%_40%)]",
          // Focus state: blue border with ring
          "focus:outline-none focus:border-[hsl(207_71%_38%)] focus:ring-2 focus:ring-[hsl(207_71%_38%/0.2)]",
          "focus-visible:outline-none focus-visible:border-[hsl(207_71%_38%)] focus-visible:ring-2 focus-visible:ring-[hsl(207_71%_38%/0.2)]",
          // Dark mode focus: brighter blue
          "dark:focus:border-[hsl(207_80%_60%)] dark:focus:ring-[hsl(207_80%_60%/0.25)]",
          "dark:focus-visible:border-[hsl(207_80%_60%)] dark:focus-visible:ring-[hsl(207_80%_60%/0.25)]",
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
  },
);
Input.displayName = "Input";

// Filled TextField variant
const InputFilled = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { error?: boolean; size?: "default" | "lg" | "xl" }>(
  ({ className, type, error, size = "default", ...props }, ref) => {
    const sizeClasses = {
      default: "h-9 px-3 py-2 text-sm",
      lg: "h-12 px-4 py-3 text-base",
      xl: "h-14 px-5 py-4 text-base",
    };
    
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex w-full rounded-t-xl rounded-b-none ring-offset-background transition-all duration-200",
          sizeClasses[size],
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Default state: muted background with bottom border
          "bg-muted/60 text-foreground placeholder:text-muted-foreground/70",
          "border-b-2 border-[hsl(210_20%_85%)]",
          // Dark mode
          "dark:bg-muted/40 dark:border-[hsl(220_15%_30%)]",
          // Hover state
          "hover:bg-muted/80 hover:border-[hsl(210_25%_75%)]",
          "dark:hover:bg-muted/60 dark:hover:border-[hsl(220_15%_40%)]",
          // Focus state: blue bottom border
          "focus:outline-none focus:border-[hsl(207_71%_38%)] focus:bg-muted/90",
          "focus-visible:outline-none focus-visible:border-[hsl(207_71%_38%)]",
          // Dark mode focus
          "dark:focus:border-[hsl(207_80%_60%)] dark:focus:bg-muted/70",
          "dark:focus-visible:border-[hsl(207_80%_60%)]",
          // Disabled state
          "disabled:cursor-not-allowed disabled:bg-muted/30 disabled:border-muted disabled:text-muted-foreground disabled:opacity-50",
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
