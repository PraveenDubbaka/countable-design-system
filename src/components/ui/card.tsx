import * as React from "react";

import { cn } from "@/lib/utils";

// Futuristic Card - Elevated variant with glow (default)
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl bg-card text-card-foreground shadow-lg border border-border/40 transition-all duration-300",
      "hover:shadow-xl hover:border-border/60",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// Futuristic Styled Card - Enhanced with subtle glow and refined borders
const StyledCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { hover?: boolean; glow?: boolean }>(
  ({ className, hover = false, glow = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl bg-card text-card-foreground shadow-lg border border-border/30 transition-all duration-300",
        hover && "hover:shadow-xl hover:border-primary/20 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.08)]",
        glow && "shadow-[0_0_30px_hsl(var(--primary)/0.1)]",
        className
      )}
      {...props}
    />
  )
);
StyledCard.displayName = "StyledCard";

// Futuristic Glass Card - Semi-transparent with backdrop blur
const GlassCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl bg-card/70 backdrop-blur-xl text-card-foreground border border-border/20 shadow-lg transition-all duration-300",
        "hover:bg-card/80 hover:border-border/30",
        className
      )}
      {...props}
    />
  )
);
GlassCard.displayName = "GlassCard";

// M3 Card - Filled variant
const CardFilled = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl bg-muted text-card-foreground transition-colors duration-300",
        className
      )}
      {...props}
    />
  )
);
CardFilled.displayName = "CardFilled";

// M3 Card - Outlined variant
const CardOutlined = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border/60 bg-card/50 text-card-foreground transition-all duration-300",
        "hover:border-border hover:bg-card/70",
        className
      )}
      {...props}
    />
  )
);
CardOutlined.displayName = "CardOutlined";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2 p-7", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-7 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-7 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, StyledCard, GlassCard, CardFilled, CardOutlined, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };