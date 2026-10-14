import * as React from "react";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type PageBannerVariant = "success" | "error" | "warning" | "info";

interface PageBannerProps {
 variant: PageBannerVariant;
 title: string;
 description?: string;
 onDismiss?: () => void;
 className?: string;
}

const variants: Record<PageBannerVariant, { icon: React.ReactNode; classes: string; iconClass: string }> = {
 success: {
  icon: <CheckCircle2 className="h-4 w-4 shrink-0" />,
  classes: "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-100",
  iconClass: "text-emerald-600 dark:text-emerald-400",
 },
 error: {
  icon: <AlertCircle className="h-4 w-4 shrink-0" />,
  classes: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-800 dark:text-red-100",
  iconClass: "text-red-600 dark:text-red-400",
 },
 warning: {
  icon: <AlertTriangle className="h-4 w-4 shrink-0" />,
  classes: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-100",
  iconClass: "text-amber-600 dark:text-amber-400",
 },
 info: {
  icon: <Info className="h-4 w-4 shrink-0" />,
  classes: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-100",
  iconClass: "text-blue-600 dark:text-blue-400",
 },
};

export function PageBanner({ variant, title, description, onDismiss, className }: PageBannerProps) {
 const { icon, classes, iconClass } = variants[variant];
 return (
  <div role="alert" className={cn("flex items-start gap-3 rounded-lg border px-4 py-3 text-sm", classes, className)}>
   <span className={cn("mt-0.5", iconClass)}>{icon}</span>
   <div className="flex-1 min-w-0">
    <p className="font-semibold leading-snug">{title}</p>
    {description && <p className="mt-0.5 opacity-80 leading-snug">{description}</p>}
   </div>
   {onDismiss && (
    <button
     onClick={onDismiss}
     className="ml-1 mt-0.5 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
     aria-label="Dismiss"
    >
     <X className="h-3.5 w-3.5" />
    </button>
   )}
  </div>
 );
}
