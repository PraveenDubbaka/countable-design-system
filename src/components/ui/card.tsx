import * as React from "react";

import { cn } from "@/lib/utils";

// M3 Card - Elevated variant (default)
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg bg-surface-container-lowest text-card-foreground shadow-elevation-1 transition-shadow duration-short4 ease-emphasized",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// Styled Card - Standard card with shadow-md and border-t styling
const StyledCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }>(
  ({ className, hover = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-card text-card-foreground shadow-md border-t border-border transition-shadow duration-200",
        hover && "hover:shadow-lg",
        className
      )}
      {...props}
    />
  )
);
StyledCard.displayName = "StyledCard";

// M3 Card - Filled variant
const CardFilled = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-surface-container-highest text-card-foreground transition-colors duration-short4 ease-emphasized",
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
        "rounded-lg border border-outline-variant bg-surface text-card-foreground transition-colors duration-short4 ease-emphasized",
        className
      )}
      {...props}
    />
  )
);
CardOutlined.displayName = "CardOutlined";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-headline-sm font-normal leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-body-md text-on-surface-variant", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, StyledCard, CardFilled, CardOutlined, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };