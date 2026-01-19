import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-label-lg font-medium ring-offset-background transition-all duration-short4 ease-emphasized focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        // M3 Filled Button
        default:
          "bg-primary text-primary-foreground rounded-full hover:shadow-elevation-1 active:shadow-none before:absolute before:inset-0 before:bg-primary-foreground/0 hover:before:bg-primary-foreground/[0.08] active:before:bg-primary-foreground/[0.12]",
        // M3 Destructive (Error filled)
        destructive:
          "bg-destructive text-destructive-foreground rounded-full hover:shadow-elevation-1 before:absolute before:inset-0 before:bg-destructive-foreground/0 hover:before:bg-destructive-foreground/[0.08] active:before:bg-destructive-foreground/[0.12]",
        // M3 Outlined Button
        outline:
          "border border-outline bg-transparent text-primary rounded-full hover:bg-primary/[0.08] active:bg-primary/[0.12] focus-visible:border-primary",
        // M3 Tonal Button (Secondary Container)
        secondary:
          "bg-secondary text-secondary-foreground rounded-full hover:shadow-elevation-1 before:absolute before:inset-0 before:bg-secondary-foreground/0 hover:before:bg-secondary-foreground/[0.08] active:before:bg-secondary-foreground/[0.12]",
        // M3 Text Button
        ghost:
          "text-primary rounded-full hover:bg-primary/[0.08] active:bg-primary/[0.12]",
        // M3 Text Button with underline
        link: "text-primary underline-offset-4 hover:underline rounded-md",
        // M3 Elevated Button
        elevated:
          "bg-surface-container-low text-primary shadow-elevation-1 rounded-full hover:shadow-elevation-2 before:absolute before:inset-0 before:bg-primary/0 hover:before:bg-primary/[0.08] active:before:bg-primary/[0.12]",
        // M3 Tonal Icon Button
        tonal:
          "bg-secondary-container text-on-secondary-container rounded-full hover:shadow-elevation-1 before:absolute before:inset-0 before:bg-on-secondary-container/0 hover:before:bg-on-secondary-container/[0.08] active:before:bg-on-secondary-container/[0.12]",
      },
      size: {
        default: "h-10 px-6 py-2.5",
        sm: "h-9 px-4",
        lg: "h-12 px-8",
        icon: "h-10 w-10 rounded-full",
        "icon-sm": "h-8 w-8 rounded-full",
        "icon-lg": "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };