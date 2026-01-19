import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// M3 Outlined TextArea
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-xs border border-outline bg-transparent px-4 py-4 text-body-lg ring-offset-background transition-all duration-200 ease-emphasized placeholder:text-on-surface-variant focus-visible:outline-none focus-visible:border-primary focus-visible:border-2 focus-visible:px-[15px] focus-visible:py-[15px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };