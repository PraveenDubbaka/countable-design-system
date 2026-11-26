// Dashboard shortcut into the guided, clickthrough use-case tours (see TourOverlay.tsx +
// useCaseTours.ts). Each "Start walkthrough" jumps straight into the relevant demo engagement and
// highlights one real control at a time — no separate mockup, just the actual screens.
import { Compass, PlayCircle } from "lucide-react";
import { StyledCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { USE_CASE_TOURS } from "@/lib/useCaseTours";
import { useTour } from "@/store/tourStore";

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
 return (
 <StyledCard className="p-5 flex flex-col gap-4 flex-shrink-0">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
 <Compass className="h-4 w-4 text-primary" />
 </div>
 <div>
 <h2 className="text-sm font-semibold text-foreground">Guided use cases — Partnership &amp; Trust</h2>
 <p className="text-xs text-muted-foreground mt-0.5">Clickthrough walkthroughs across the real screens — start one below and click where it highlights.</p>
 </div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {USE_CASE_TOURS.map(tour => (
 <div key={tour.id} className="flex flex-col gap-2 p-3.5 rounded-xl border border-border bg-card/60 hover:border-primary/40 transition-colors">
 <div className="flex items-center justify-between gap-2">
 <Badge variant={CATEGORY_VARIANT[tour.category] ?? "secondary"} className="text-[10px]">{CATEGORY_LABEL[tour.category] ?? tour.category}</Badge>
 <span className="text-[10px] text-muted-foreground shrink-0">{tour.steps.length} steps</span>
 </div>
 <h3 className="text-sm font-semibold text-foreground leading-snug">{tour.title}</h3>
 <p className="text-xs text-muted-foreground leading-relaxed flex-1">{tour.summary}</p>
 <Button size="sm" variant="secondary" className="gap-1.5 w-fit mt-1" onClick={() => startTour(tour)}>
 <PlayCircle className="h-3.5 w-3.5" />
 Start walkthrough
 </Button>
 </div>
 ))}
 </div>
 </StyledCard>
 );
}
