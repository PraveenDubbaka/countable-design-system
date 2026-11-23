import { useNavigate } from "react-router-dom";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Quick jump straight into the Partnership/Trust demo engagements' detail view — one per entity
// type x engagement type, covering Compilation/Review/Tax (see src/data/clientsData.ts's
// DEMO-WCP/DEMO-BFT clients and the matching rows in src/store/engagementsStore.ts).
const SHORTCUTS: { entity: "Partnership" | "Trust"; engagementType: "Compilation" | "Review" | "Tax"; engagementId: string }[] = [
 { entity: "Partnership", engagementType: "Compilation", engagementId: "COM-WCP-Dec312024" },
 { entity: "Partnership", engagementType: "Review", engagementId: "REV-WCP-Dec312024" },
 { entity: "Partnership", engagementType: "Tax", engagementId: "T5013-WCP-Dec312024" },
 { entity: "Trust", engagementType: "Compilation", engagementId: "COM-BFT-Dec312024" },
 { entity: "Trust", engagementType: "Review", engagementId: "REV-BFT-Dec312024" },
 { entity: "Trust", engagementType: "Tax", engagementId: "T3-BFT-Dec312024" },
];

const ENTITY_VARIANT = { Partnership: "warning", Trust: "feature" } as const;

export function EntityEngagementShortcuts() {
 const navigate = useNavigate();
 return (
 <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
 <span className="text-xs font-medium text-muted-foreground mr-1">Partnership / Trust demos:</span>
 {SHORTCUTS.map(s => (
 <button
 key={s.engagementId}
 type="button"
 onClick={() => navigate(`/engagements/${s.engagementId}`)}
 className={cn(badgeVariants({ variant: ENTITY_VARIANT[s.entity] }), "cursor-pointer hover:brightness-95 transition-all")}
 title={`Open the ${s.entity} ${s.engagementType} demo engagement`}
 >
 {s.entity} · {s.engagementType}
 </button>
 ))}
 </div>
 );
}
