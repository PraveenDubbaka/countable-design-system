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
        "flex w-full rounded-[10px] ring-0 ring-offset-0 transition-all duration-200",
        sizeClasses[size],
        // Default state: rgb(246, 247, 249) background, rgb(220, 223, 228) border, 1px border
        "bg-[#f6f7f9] text-foreground placeholder:text-muted-foreground/70",
        "border border-[#dcdfe4]",
        // Dark mode: darker border
        "dark:border-[hsl(220_15%_30%)] dark:bg-card",
        // Hover state: slightly darker border
        "hover:border-[hsl(210_25%_75%)]",
        "dark:hover:border-[hsl(220_15%_40%)]",
        // Focus state: double border effect using border-2 + box-shadow for inner white
        "focus:outline-none focus:border-2 focus:border-[#2b6cb0] focus:[box-shadow:inset_0_0_0_2px_white]",
        "focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#2b6cb0] focus-visible:[box-shadow:inset_0_0_0_2px_white]",
        // Dark mode focus
        "dark:focus:border-[hsl(207_80%_60%)] dark:focus:[box-shadow:inset_0_0_0_2px_hsl(220,15%,20%)]",
        "dark:focus-visible:border-[hsl(207_80%_60%)] dark:focus-visible:[box-shadow:inset_0_0_0_2px_hsl(220,15%,20%)]",
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
