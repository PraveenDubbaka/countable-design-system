import { useMemo } from "react";
import { Plus, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEngagements } from "@/store/EngagementsContext";
import { getEngagementMeta } from "@/store/engagementsStore";

const CHECKLIST_LABELS: Record<string, string> = {
  "aud-mat": "Materiality",
  "aud-us-mat": "Materiality",
  "aud-tb": "Time Budget",
  "aud-us-tb": "Time Budget",
  "aud-db": "Detailed Budget",
  "aud-us-db": "Detailed Budget",
  "aud-scope": "Audit Scope",
  "aud-us-scope": "Audit Scope",
  "aud-pap": "Plan Audit Procedures",
  "aud-us-pap": "Plan Audit Procedures",
  "aud-sae": "Auditor's Expert",
  "aud-us-sae": "Auditor's Expert",
  "aud-asm": "Overall Audit Strategy",
  "aud-us-asm": "Overall Audit Strategy",
  "aud-iar": "Management Requests",
  "aud-us-iar": "Management Requests",
  "aud-cac": "Client Acceptance & Continuance",
};

interface LukaAutoFillBannerProps {
  checklistKey: string;
  engagementId: string;
  checklistName?: string;
  onRunAutoFill: (query: string) => void;
}

export function LukaAutoFillBanner({ checklistKey, engagementId, checklistName, onRunAutoFill }: LukaAutoFillBannerProps) {
  const { engagements } = useEngagements();
  const engagement = engagements.find(e => e.id === engagementId);
  const meta = useMemo(() => getEngagementMeta(engagementId), [engagementId]);

  const label = CHECKLIST_LABELS[checklistKey] || checklistName || checklistKey;

  const sources: string[] = [];
  sources.push("Xero connection");
  if (!meta.firstYearAudit) sources.push("Predecessor file");
  if (meta.budget) sources.push("Time budget");

  const score = Math.min(90, 60 + sources.length * 10);

  const buildQuery = () => {
    const period = meta.periodStart && meta.periodEnd
      ? `${meta.periodStart} to ${meta.periodEnd}`
      : engagement?.yearEnd ? `year ending ${engagement.yearEnd}` : "";
    const framework = meta.accountingFramework || "";
    return [
      `Please analyze the ${label} checklist for ${engagement?.client || engagementId}`,
      period ? `(period: ${period})` : "",
      framework ? `using ${framework}` : "",
      "and auto-fill responses using the connected Xero data",
      !meta.firstYearAudit ? "and prior year files." : ".",
      "Populate field-by-field with citations. Flag any items requiring professional judgment.",
    ].filter(Boolean).join(" ");
  };

  return (
    <div className="mx-4 mt-4 rounded-lg border border-border bg-card px-4 py-3">
      {/* Row 1: pill + progress + source tags */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/5 text-primary text-xs px-2.5 py-1 font-medium">
          <Plus className="h-3 w-3" />
          Luka auto-populate
        </span>
        <div className="h-1.5 rounded-full bg-muted w-16 overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${score}%` }} />
        </div>
        <span className="text-xs font-semibold text-foreground">{score}%</span>
        {sources.map(src => (
          <span key={src} className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground text-xs px-2.5 py-1">
            <ArrowLeftRight className="h-3 w-3" />
            {src}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-2.5 leading-relaxed">
        Target <span className="font-semibold text-foreground">{score}% automation</span>. Click to fill the worksheet — responses populate field-by-field with citations. Items Luka can't answer route to the{" "}
        <span className="font-semibold text-foreground">client app</span>{" "}
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-muted-foreground text-[10px] font-bold align-middle">?</span>{" "}
        or stay flagged <span className="text-amber-500">△</span> <span className="font-semibold text-foreground">judgment</span>.
        {meta.firstYearAudit && " This is a first-year engagement — predecessor files are not available."}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button size="sm" className="h-7 text-xs gap-1" onClick={() => onRunAutoFill(buildQuery())}>
          <Plus className="h-3 w-3" />
          Run Luka auto-fill
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast("Data lineage coming soon")}>
          View data lineage
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast("Customize template coming soon")}>
          Customize template
        </Button>
      </div>
    </div>
  );
}
