import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

// M3 Outlined TextArea with Figma-based states
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // Base styles
        "flex min-h-[120px] w-full rounded-lg px-4 py-3 text-sm ring-offset-background transition-all duration-200",
        // Default state: light gray background with gray border
        "bg-[#F5F8FA] border border-transparent text-foreground placeholder:text-muted-foreground",
        // Hover state: white background with darker border
        "hover:bg-white hover:border-[#98A2B3]",
        // Focus state: white background with blue border
        "focus:outline-none focus:bg-white focus:border-primary focus:border-2 focus:px-[15px] focus:py-[11px]",
        "focus-visible:outline-none focus-visible:bg-white focus-visible:border-primary focus-visible:border-2 focus-visible:px-[15px] focus-visible:py-[11px]",
        // Disabled state
        "disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:border-transparent disabled:text-muted-foreground disabled:opacity-60",
        // Error state
        error && "bg-white border-destructive border-2 px-[15px] py-[11px] hover:border-destructive focus:border-destructive focus-visible:border-destructive",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
