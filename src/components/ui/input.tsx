import * as React from "react";

import { cn } from "@/lib/utils";

// Futuristic Outlined TextField with Double Border Effect
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
          // Default state: double border effect (dark blue outer, light inner via shadow)
          "bg-card/90 text-foreground placeholder:text-muted-foreground/70",
          "border-2 border-[hsl(213_60%_30%/0.4)]",
          "shadow-[inset_0_0_0_1px_hsl(210_20%_85%/0.6),0_0_0_1px_hsl(210_15%_75%/0.3)]",
          // Hover state: darker border with subtle glow
          "hover:bg-card hover:border-[hsl(213_60%_30%/0.6)]",
          "hover:shadow-[inset_0_0_0_1px_hsl(210_20%_85%/0.8),0_0_15px_hsl(var(--primary)/0.08)]",
          // Focus state: dark blue border with glow
          "focus:outline-none focus:bg-card focus:border-[hsl(207_71%_45%)]",
          "focus:shadow-[inset_0_0_0_1px_hsl(210_20%_85%),0_0_20px_hsl(var(--primary)/0.15)]",
          "focus-visible:outline-none focus-visible:bg-card focus-visible:border-[hsl(207_71%_45%)]",
          // Disabled state
          "disabled:cursor-not-allowed disabled:bg-muted/50 disabled:border-transparent disabled:text-muted-foreground disabled:opacity-50 disabled:shadow-none",
          // Error state
          error && "border-destructive hover:border-destructive focus:border-destructive focus-visible:border-destructive shadow-[inset_0_0_0_1px_hsl(0_85%_92%),0_0_15px_hsl(var(--destructive)/0.1)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

// Futuristic Filled TextField with Double Border Effect
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
          // Default state: muted background with dark blue bottom border
          "bg-muted/60 text-foreground placeholder:text-muted-foreground/70",
          "border-b-2 border-[hsl(213_60%_30%/0.3)]",
          "shadow-[inset_0_-1px_0_0_hsl(210_20%_85%/0.5)]",
          // Hover state
          "hover:bg-muted/80 hover:border-[hsl(213_60%_30%/0.5)]",
          // Focus state: dark blue bottom border with glow
          "focus:outline-none focus:border-[hsl(207_71%_45%)] focus:bg-muted/90",
          "focus:shadow-[inset_0_-1px_0_0_hsl(210_20%_85%),0_2px_10px_hsl(var(--primary)/0.1)]",
          "focus-visible:outline-none focus-visible:border-[hsl(207_71%_45%)]",
          // Disabled state
          "disabled:cursor-not-allowed disabled:bg-muted/30 disabled:border-transparent disabled:text-muted-foreground disabled:opacity-50 disabled:shadow-none",
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
