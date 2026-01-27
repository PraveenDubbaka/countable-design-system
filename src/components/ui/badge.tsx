import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Status variants with matching border colors (border = text color)
        new: "bg-emerald-50 text-emerald-700 border-emerald-700",
        completed: "bg-emerald-50 text-emerald-700 border-emerald-700",
        inProgress: "bg-sky-50 text-sky-700 border-sky-700",
        notStarted: "bg-slate-100 text-slate-600 border-slate-600",
        rf: "bg-gray-100 text-gray-600 border-gray-600",
        // Client status variants
        accepted: "bg-emerald-50 text-emerald-700 border-emerald-700",
        inviteNow: "bg-sky-50 text-sky-700 border-sky-700",
        // Additional utility variants
        recommended: "bg-pink-100 text-pink-600 border-pink-600",
        feature: "bg-teal-100 text-teal-600 border-teal-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
