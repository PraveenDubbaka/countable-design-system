import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles with micro-animations
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-label-lg font-medium ring-offset-background transition-all duration-200 ease-emphasized focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0 relative overflow-hidden cursor-pointer select-none",
  {
    variants: {
      variant: {
        // M3 Filled Button with pop-out effect
        default: [
          "bg-primary text-primary-foreground rounded-xl",
          // Pop-out hover effect
          "hover:scale-[1.02] hover:shadow-[0_8px_25px_hsl(213_40%_20%/0.15)]",
          // Active/pressed state - slightly smaller
          "active:scale-[0.98] active:shadow-[0_2px_8px_hsl(213_40%_20%/0.1)]",
          // State layers
          "before:absolute before:inset-0 before:bg-primary-foreground/0 hover:before:bg-primary-foreground/[0.08] active:before:bg-primary-foreground/[0.12]",
        ].join(" "),
        // M3 Destructive with pop-out
        destructive: [
          "bg-destructive text-destructive-foreground rounded-xl",
          "hover:scale-[1.02] hover:shadow-[0_8px_25px_hsl(0_50%_30%/0.2)]",
          "active:scale-[0.98] active:shadow-[0_2px_8px_hsl(0_50%_30%/0.1)]",
          "before:absolute before:inset-0 before:bg-destructive-foreground/0 hover:before:bg-destructive-foreground/[0.08] active:before:bg-destructive-foreground/[0.12]",
        ].join(" "),
        // M3 Outlined Button with pop-out
        outline: [
          "border-2 border-[hsl(213_60%_30%/0.4)] bg-transparent text-primary rounded-xl",
          "shadow-[inset_0_0_0_1px_hsl(210_20%_85%/0.6)]",
          "hover:scale-[1.02] hover:border-[hsl(213_60%_30%/0.6)] hover:bg-primary/[0.05] hover:shadow-[inset_0_0_0_1px_hsl(210_20%_85%/0.8),0_8px_25px_hsl(213_40%_20%/0.1)]",
          "active:scale-[0.98] active:bg-primary/[0.12]",
          "focus-visible:border-primary",
        ].join(" "),
        // M3 Secondary/Tonal with pop-out
        secondary: [
          "bg-secondary text-secondary-foreground border border-outline rounded-xl",
          "hover:scale-[1.02] hover:shadow-[0_8px_25px_hsl(213_40%_20%/0.12)]",
          "active:scale-[0.98] active:shadow-[0_2px_8px_hsl(213_40%_20%/0.08)]",
          "before:absolute before:inset-0 before:bg-secondary-foreground/0 hover:before:bg-secondary-foreground/[0.08] active:before:bg-secondary-foreground/[0.12]",
        ].join(" "),
        // M3 Ghost/Text Button with highlight
        ghost: [
          "text-primary rounded-xl",
          "hover:bg-primary/[0.08] hover:scale-[1.02]",
          "active:bg-primary/[0.12] active:scale-[0.98]",
        ].join(" "),
        // M3 Link Button
        link: "text-primary underline-offset-4 hover:underline rounded-xl hover:scale-[1.01]",
        // M3 Elevated Button with lift effect
        elevated: [
          "bg-surface-container-low text-primary shadow-[0_2px_8px_hsl(213_40%_20%/0.08)] rounded-xl",
          "hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_hsl(213_40%_20%/0.15)]",
          "active:scale-[0.98] active:translate-y-0 active:shadow-[0_4px_12px_hsl(213_40%_20%/0.1)]",
          "before:absolute before:inset-0 before:bg-primary/0 hover:before:bg-primary/[0.08] active:before:bg-primary/[0.12]",
        ].join(" "),
        // M3 Tonal Icon Button with pop-out
        tonal: [
          "bg-secondary-container text-on-secondary-container rounded-xl",
          "hover:scale-[1.02] hover:shadow-[0_8px_25px_hsl(213_40%_20%/0.12)]",
          "active:scale-[0.98] active:shadow-[0_2px_8px_hsl(213_40%_20%/0.08)]",
          "before:absolute before:inset-0 before:bg-on-secondary-container/0 hover:before:bg-on-secondary-container/[0.08] active:before:bg-on-secondary-container/[0.12]",
        ].join(" "),
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4",
        lg: "h-12 px-8",
        icon: "h-10 w-10 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-xl",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };