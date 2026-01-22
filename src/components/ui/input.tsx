import * as React from "react";

import { cn } from "@/lib/utils";

// M3 Outlined TextField with Figma-based states
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { error?: boolean }>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex h-11 w-full rounded-lg px-4 py-2 text-sm ring-offset-background transition-all duration-200",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Default state: light gray background with gray border
          "bg-[#F5F8FA] border border-[#D0D5DD] text-foreground placeholder:text-muted-foreground",
          // Hover state: white background with darker border
          "hover:bg-white hover:border-[#98A2B3]",
          // Focus state: white background with blue border
          "focus:outline-none focus:bg-white focus:border-primary focus:border-2 focus:px-[15px]",
          "focus-visible:outline-none focus-visible:bg-white focus-visible:border-primary focus-visible:border-2 focus-visible:px-[15px]",
          // Disabled state: very light gray background, no interactions
          "disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:border-transparent disabled:text-muted-foreground disabled:opacity-60",
          // Error state: white background with red border
          error && "bg-white border-destructive border-2 px-[15px] hover:border-destructive focus:border-destructive focus-visible:border-destructive",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

// M3 Filled TextField with Figma-based states
const InputFilled = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { error?: boolean }>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex h-11 w-full rounded-t-lg rounded-b-none px-4 py-2 text-sm ring-offset-background transition-all duration-200",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Default state: light gray background with bottom border
          "bg-[#F5F8FA] border-b border-[#D0D5DD] text-foreground placeholder:text-muted-foreground",
          // Hover state: slightly darker background
          "hover:bg-[#EDF2F7] hover:border-[#98A2B3]",
          // Focus state: blue bottom border
          "focus:outline-none focus:border-b-2 focus:border-primary focus:pb-[7px]",
          "focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-primary focus-visible:pb-[7px]",
          // Disabled state
          "disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:border-transparent disabled:text-muted-foreground disabled:opacity-60",
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
