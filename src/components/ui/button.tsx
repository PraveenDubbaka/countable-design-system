import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[0.9375rem] font-semibold leading-[1.3] ring-offset-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0 cursor-pointer select-none rounded-[10px]",
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-white border border-transparent",
          "hover:bg-primary/90",
          "active:bg-primary/80",
          "focus-visible:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3A3A3]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        ].join(" "),
        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive/75",
          "active:bg-destructive/65",
        ].join(" "),
        outline: [
          "border border-border bg-card text-foreground",
          "hover:bg-muted",
          "active:bg-muted",
          "focus-visible:border-border focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-0",
        ].join(" "),
        secondary: [
          "border border-border bg-card text-foreground",
          "hover:bg-muted",
          "active:bg-muted",
          "data-[state=open]:bg-muted",
          "data-[state=on]:bg-muted",
          "aria-selected:bg-muted",
          "focus-visible:border-border focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-0",
        ].join(" "),
        ghost: [
          "text-primary",
          "hover:bg-primary/[0.14]",
          "active:bg-primary/[0.22]",
        ].join(" "),
        link: "text-link underline-offset-4 hover:underline",
        elevated: [
          "bg-surface-container-low text-primary shadow-sm",
          "hover:bg-primary/[0.14]",
          "active:bg-primary/[0.22]",
        ].join(" "),
        tonal: [
          "bg-secondary-container text-on-secondary-container",
          "hover:bg-secondary-container/65",
          "active:bg-secondary-container/50",
        ].join(" "),
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3",
        lg: "h-11 px-6",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7",
        "icon-lg": "h-11 w-11",
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
