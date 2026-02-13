import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

export interface ExpandableIconButtonProps extends Omit<ButtonProps, "size"> {
  icon: React.ReactNode;
  label: string;
  size?: "default" | "sm";
}

const ExpandableIconButton = React.forwardRef<HTMLButtonElement, ExpandableIconButtonProps>(
  ({ icon, label, className, size = "default", ...props }, ref) => {
    const h = size === "sm" ? "h-8" : "h-9";
    const iconSize = size === "sm" ? "w-8" : "w-9";
    
    return (
      <Button
        ref={ref}
        size="sm"
        className={cn(
          h,
          iconSize,
          "px-0 group/expand transition-all duration-200 ease-in-out overflow-hidden",
          `hover:w-auto hover:px-3`,
          className,
        )}
        {...props}
      >
        <span className="shrink-0">{icon}</span>
        <span className="max-w-0 overflow-hidden opacity-0 group-hover/expand:max-w-[120px] group-hover/expand:opacity-100 transition-all duration-200 ease-in-out whitespace-nowrap text-xs font-medium">
          {label}
        </span>
      </Button>
    );
  }
);
ExpandableIconButton.displayName = "ExpandableIconButton";

export { ExpandableIconButton };
