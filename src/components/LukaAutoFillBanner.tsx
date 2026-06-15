import { useMemo } from "react";
import { ArrowLeftRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
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
  "aud-form-410": "Client Acceptance & Continuance",
};

const CHECKLIST_CONTEXT: Record<string, string> = {
  "aud-mat": "Materiality benchmarks extracted from Xero trial balance. Gross revenue, pre-tax income, and net assets ready to populate thresholds and calculate performance materiality.",
  "aud-us-mat": "Materiality benchmarks extracted from connected trial balance. Gross revenue, pre-tax income, and net assets ready to populate thresholds and calculate performance materiality.",
  "aud-tb": "Time estimates pre-populated from similar engagements and prior year actuals. Hours by section and partner/staff allocation ready to fill.",
  "aud-us-tb": "Time estimates pre-populated from similar engagements and prior year actuals. Hours by section and partner/staff allocation ready to fill.",
  "aud-db": "Detailed budget lines mapped from prior year actuals and current engagement scope. Budgeted hours per procedure area ready to pre-fill.",
  "aud-us-db": "Detailed budget lines mapped from prior year actuals and current engagement scope. Budgeted hours per procedure area ready to pre-fill.",
  "aud-scope": "Audit scope parameters derived from entity profile, Xero chart of accounts, and engagement settings. Coverage assertions and rationale ready to populate.",
  "aud-us-scope": "Audit scope parameters derived from entity profile, connected chart of accounts, and engagement settings. Coverage assertions and rationale ready to populate.",
  "aud-pap": "Planned procedures matched to identified risks from prior files. Budgeted hours and assertions ready to pre-populate for all significant account areas.",
  "aud-us-pap": "Planned procedures matched to identified risks from prior files. Budgeted hours and assertions ready to pre-populate for all significant account areas.",
  "aud-sae": "Auditor's expert engagement details pre-populated from engagement meta. Expert independence assessment and scope of work ready to fill.",
  "aud-us-sae": "Auditor's expert engagement details pre-populated from engagement meta. Expert independence assessment and scope of work ready to fill.",
  "aud-asm": "Overall audit strategy parameters derived from scope, materiality, and risk assessment. Entity and environment considerations ready to populate.",
  "aud-us-asm": "Overall audit strategy parameters derived from scope, materiality, and risk assessment. Entity and environment considerations ready to populate.",
  "aud-iar": "Management information requests pre-populated from prior year files and Xero chart of accounts. Complete request list ready to generate.",
  "aud-us-iar": "Management information requests pre-populated from prior year files and connected accounting data. Complete request list ready to generate.",
  "aud-cac": "Risk factors cross-referenced against Xero transaction history and predecessor audit files. Ready to flag acceptance concerns and auto-populate standard responses.",
  "aud-form-410": "Risk factors cross-referenced against Xero transaction history and predecessor audit files. Ready to flag acceptance concerns and auto-populate standard responses.",
};

const GENERIC_CONTEXT = "Connected data sources analyzed and ready to populate this checklist with citations. Items requiring professional judgment will be flagged for review.";

export type AutoFillConfig = {
  query: string;
  label: string;
  sources: string[];
};

interface LukaAutoFillBannerProps {
  checklistKey: string;
  engagementId: string;
  checklistName?: string;
  onRunAutoFill: (config: AutoFillConfig) => void;
}

export function LukaAutoFillBanner({ checklistKey, engagementId, checklistName, onRunAutoFill }: LukaAutoFillBannerProps) {
  const { engagements } = useEngagements();
  const engagement = engagements.find(e => e.id === engagementId);
  const meta = useMemo(() => getEngagementMeta(engagementId), [engagementId]);

  const label = CHECKLIST_LABELS[checklistKey] || checklistName || checklistKey;
  const context = CHECKLIST_CONTEXT[checklistKey] || GENERIC_CONTEXT;

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
          <Zap className="h-3 w-3" />
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

      {/* Context description */}
      <p className="text-sm text-muted-foreground mb-2.5 leading-relaxed">
        {context}
        {meta.firstYearAudit && " This is a first-year engagement — predecessor files are not available."}
      </p>

      {/* Action */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onRunAutoFill({ query: buildQuery(), label, sources })}
          className={cn(
            "inline-flex items-center gap-1.5 h-7 px-3 rounded-[8px] text-xs font-semibold text-white shadow-sm",
            "bg-gradient-to-br from-[#8649F1] to-[#2355A4] hover:opacity-90 transition-opacity"
          )}
        >
          <Zap className="h-3.5 w-3.5 text-white fill-white" strokeWidth={0} />
          Run Luka auto-fill
        </button>
      </div>
    </div>
  );
}
