// Dashboard shortcut into the guided, clickthrough use-case tours (see TourOverlay.tsx +
// useCaseTours.ts). Rendered as a single trigger button so the dashboard's own layout stays
// intact; the use-case list itself lives in a popup, and "Start walkthrough" closes the popup
// before handing off to the tour overlay, which then drives the real screens underneath — no
// separate mockup.
import { useState } from "react";
import { Compass, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { USE_CASE_TOURS } from "@/lib/useCaseTours";
import { useTour, type UseCaseTour } from "@/store/tourStore";

const CATEGORY_LABEL: Record<string, string> = {
 flagship: "Flagship",
 new: "New partner",
 mapping: "Mapping",
 lifecycle: "Lifecycle",
 reporting: "Reporting",
};

const CATEGORY_VARIANT: Record<string, "default" | "secondary" | "warning" | "feature"> = {
 flagship: "feature",
 new: "default",
 mapping: "secondary",
 lifecycle: "warning",
 reporting: "secondary",
};

export function UseCasesPanel() {
 const { startTour } = useTour();
 const [open, setOpen] = useState(false);

 const handleStart = (tour: UseCaseTour) => {
 // Close the popup first so the dashboard is visible again before the tour's first step
 // navigates/highlights — otherwise the dialog's own overlay would sit on top of it.
 setOpen(false);
 startTour(tour);
 };

 return (
 <Dialog open={open} onOpenChange={setOpen}>
 <DialogTrigger asChild>
 <Button variant="secondary" size="sm" className="gap-1.5 shrink-0" title="Guided use cases — Partnership &amp; Trust">
 <Compass className="h-3.5 w-3.5" />
 Guided use cases
 </Button>
 </DialogTrigger>
 <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
 <DialogHeader>
 <DialogTitle className="flex items-center gap-2">
 <Compass className="h-4 w-4 text-primary" />
 Guided use cases — Partnership &amp; Trust
 </DialogTitle>
 <DialogDescription>Clickthrough walkthroughs across the real screens — start one below and click where it highlights.</DialogDescription>
 </DialogHeader>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {USE_CASE_TOURS.map((tour) => (
 <div key={tour.id} className="flex flex-col gap-2 p-3.5 rounded-xl border border-border bg-card/60 hover:border-primary/40 transition-colors">
 <div className="flex items-center justify-between gap-2">
 <Badge variant={CATEGORY_VARIANT[tour.category] ?? "secondary"} className="text-[10px]">{CATEGORY_LABEL[tour.category] ?? tour.category}</Badge>
 <span className="text-[10px] text-muted-foreground shrink-0">{tour.steps.length} steps</span>
 </div>
 <h3 className="text-sm font-semibold text-foreground leading-snug">{tour.title}</h3>
 <p className="text-xs text-muted-foreground leading-relaxed flex-1">{tour.summary}</p>
 <Button size="sm" variant="secondary" className="gap-1.5 w-fit mt-1" onClick={() => handleStart(tour)}>
 <PlayCircle className="h-3.5 w-3.5" />
 Start walkthrough
 </Button>
 </div>
 ))}
 </div>
 </DialogContent>
 </Dialog>
 );
}
