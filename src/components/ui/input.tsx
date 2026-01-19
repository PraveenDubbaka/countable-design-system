import * as React from "react";

import { cn } from "@/lib/utils";

// M3 Outlined TextField
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-xs border border-outline bg-transparent px-4 py-4 text-body-lg ring-offset-background transition-all duration-short4 ease-emphasized file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-on-surface-variant focus-visible:outline-none focus-visible:border-primary focus-visible:border-2 focus-visible:px-[15px] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

// M3 Filled TextField
const InputFilled = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-t-xs rounded-b-none border-b border-on-surface-variant bg-surface-container-highest px-4 py-4 text-body-lg ring-offset-background transition-all duration-short4 ease-emphasized file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-on-surface-variant focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-primary focus-visible:pb-[15px] disabled:cursor-not-allowed disabled:opacity-50",
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