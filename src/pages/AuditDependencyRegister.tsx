import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { ChecklistIcon } from "@/components/icons/ChecklistIcon";
import { LetterIcon } from "@/components/icons/LetterIcon";
import { WorksheetIcon } from "@/components/icons/WorksheetIcon";
import { CompletionIcon } from "@/components/icons/CompletionIcon";
import { cn } from "@/lib/utils";
import { ChevronRight, Link2, AlertCircle, CheckCircle2, Circle, Clock } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | "Client Onboarding"
  | "Planning"
  | "Risk Assessment"
  | "Response to Risks"
  | "Financial Statements"
  | "Completion & Signoffs";

type DocType = "checklist" | "letter" | "worksheet" | "completion";

type StatusLevel = "not-started" | "in-progress" | "complete" | "blocked";

interface DependencyItem {
  code: string;
  navKey: string;
  label: string;
  type: DocType;
  phase: Phase;
  cas?: string;
  prerequisites: string[]; // codes
  enablesKey?: string; // what nav key this routes to
  criticalPath: boolean;
}

// ─── Dependency Register Data ─────────────────────────────────────────────────

const REGISTER: DependencyItem[] = [
  // ── CLIENT ONBOARDING ──────────────────────────────────────────────────────
  {
    code: "CO-NA",
    navKey: "aud-new-accept",
    label: "New Engagement Acceptance",
    type: "checklist",
    phase: "Client Onboarding",
    cas: "CAS 210",
    prerequisites: [],
    criticalPath: true,
  },
  {
    code: "CO-EC",
    navKey: "aud-exist-cont",
    label: "Existing Engagement Continuance",
    type: "checklist",
    phase: "Client Onboarding",
    cas: "CAS 210",
    prerequisites: [],
    criticalPath: true,
  },
  {
    code: "CO-IND",
    navKey: "aud-ind",
    label: "Independence & Ethical Requirements",
    type: "checklist",
    phase: "Client Onboarding",
    cas: "CAS 220 / CSQM 1",
    prerequisites: ["CO-NA", "CO-EC"],
    criticalPath: true,
  },
  {
    code: "CO-AML",
    navKey: "aud-aml",
    label: "Anti-Money Laundering (AML) Compliance",
    type: "checklist",
    phase: "Client Onboarding",
    cas: "PCMLTFA / FINTRAC",
    prerequisites: ["CO-NA", "CO-EC"],
    criticalPath: false,
  },
  {
    code: "CO-EL",
    navKey: "aud-el",
    label: "Engagement Letter",
    type: "letter",
    phase: "Client Onboarding",
    cas: "CAS 210",
    prerequisites: ["CO-IND", "CO-AML"],
    criticalPath: true,
  },

  // ── PLANNING ──────────────────────────────────────────────────────────────
  {
    code: "PL-UEB",
    navKey: "aud-ueb",
    label: "Understanding the Entity — Basics",
    type: "checklist",
    phase: "Planning",
    cas: "CAS 315",
    prerequisites: ["CO-EL"],
    criticalPath: true,
  },
  {
    code: "PL-UES",
    navKey: "aud-ues",
    label: "Understanding the Entity — Systems & Controls",
    type: "checklist",
    phase: "Planning",
    cas: "CAS 315",
    prerequisites: ["PL-UEB"],
    criticalPath: true,
  },
  {
    code: "PL-UEI",
    navKey: "aud-uei",
    label: "Understanding the Entity — Industry & Environment",
    type: "checklist",
    phase: "Planning",
    cas: "CAS 315",
    prerequisites: ["PL-UEB"],
    criticalPath: false,
  },
  {
    code: "PL-MAT",
    navKey: "aud-mat",
    label: "Materiality",
    type: "worksheet",
    phase: "Planning",
    cas: "CAS 320",
    prerequisites: ["PL-UEB", "PL-UEI"],
    criticalPath: true,
  },
  {
    code: "PL-EP",
    navKey: "aud-plan",
    label: "Engagement Planning",
    type: "checklist",
    phase: "Planning",
    cas: "CAS 300",
    prerequisites: ["PL-MAT", "PL-UES"],
    criticalPath: true,
  },
  {
    code: "PL-TCWG",
    navKey: "aud-tcwg-pl",
    label: "TCWG Communication — Planning",
    type: "letter",
    phase: "Planning",
    cas: "CAS 260",
    prerequisites: ["PL-MAT", "PL-EP"],
    criticalPath: false,
  },

  // ── RISK ASSESSMENT ───────────────────────────────────────────────────────
  {
    code: "RA-RAP",
    navKey: "aud-ra-rap",
    label: "Risk Assessment Procedures",
    type: "checklist",
    phase: "Risk Assessment",
    cas: "CAS 315",
    prerequisites: ["PL-EP", "PL-MAT"],
    criticalPath: true,
  },
  {
    code: "RA-IC",
    navKey: "aud-ra-ic",
    label: "Understanding Internal Controls",
    type: "checklist",
    phase: "Risk Assessment",
    cas: "CAS 315",
    prerequisites: ["RA-RAP", "PL-UES"],
    criticalPath: true,
  },
  {
    code: "RA-FRA",
    navKey: "aud-ra-fraud",
    label: "Fraud Risk Assessment",
    type: "checklist",
    phase: "Risk Assessment",
    cas: "CAS 240",
    prerequisites: ["RA-RAP"],
    criticalPath: true,
  },
  {
    code: "RA-SRR",
    navKey: "aud-ra-srr",
    label: "Significant Risks Register",
    type: "checklist",
    phase: "Risk Assessment",
    cas: "CAS 315",
    prerequisites: ["RA-RAP", "RA-FRA", "RA-IC"],
    criticalPath: true,
  },
  {
    code: "RA-RMM",
    navKey: "aud-ra-rmm",
    label: "Risk of Material Misstatement (RMM)",
    type: "checklist",
    phase: "Risk Assessment",
    cas: "CAS 315",
    prerequisites: ["RA-SRR", "RA-IC"],
    criticalPath: true,
  },
  {
    code: "RA-S1",
    navKey: "aud-ra-scot-rev",
    label: "SCOT — Revenue Cycle",
    type: "checklist",
    phase: "Risk Assessment",
    cas: "CAS 315",
    prerequisites: ["RA-IC", "RA-SRR"],
    criticalPath: false,
  },
  {
    code: "RA-S2",
    navKey: "aud-ra-scot-exp",
    label: "SCOT — Expenditure Cycle",
    type: "checklist",
    phase: "Risk Assessment",
    cas: "CAS 315",
    prerequisites: ["RA-IC", "RA-SRR"],
    criticalPath: false,
  },
  {
    code: "RA-S3",
    navKey: "aud-ra-scot-pay",
    label: "SCOT — Payroll Cycle",
    type: "checklist",
    phase: "Risk Assessment",
    cas: "CAS 315",
    prerequisites: ["RA-IC", "RA-SRR"],
    criticalPath: false,
  },
  {
    code: "RA-GC",
    navKey: "aud-ra-gc",
    label: "Going Concern — Initial Assessment",
    type: "checklist",
    phase: "Risk Assessment",
    cas: "CAS 570",
    prerequisites: ["RA-RAP", "PL-UEB"],
    criticalPath: false,
  },

  // ── RESPONSE TO ASSESSED RISKS ────────────────────────────────────────────
  {
    code: "RP-OAR",
    navKey: "aud-rp-oar",
    label: "Overall Audit Response",
    type: "checklist",
    phase: "Response to Risks",
    cas: "CAS 330",
    prerequisites: ["RA-RMM", "RA-SRR"],
    criticalPath: true,
  },

  // ── FINANCIAL STATEMENTS ──────────────────────────────────────────────────
  {
    code: "FS-AR",
    navKey: "aud-ar",
    label: "Independent Auditor's Report",
    type: "checklist",
    phase: "Financial Statements",
    cas: "CAS 700",
    prerequisites: ["SO-COMP"],
    criticalPath: true,
  },

  // ── COMPLETION & SIGNOFFS ─────────────────────────────────────────────────
  {
    code: "SO-AIM",
    navKey: "aud-so-aim",
    label: "Accumulation of Identified Misstatements",
    type: "checklist",
    phase: "Completion & Signoffs",
    cas: "CAS 450",
    prerequisites: ["RP-OAR"],
    criticalPath: true,
  },
  {
    code: "SO-FAR",
    navKey: "aud-so-far",
    label: "Final Analytical Review",
    type: "checklist",
    phase: "Completion & Signoffs",
    cas: "CAS 520",
    prerequisites: ["SO-AIM"],
    criticalPath: true,
  },
  {
    code: "SO-SE",
    navKey: "aud-subseq",
    label: "Subsequent Events",
    type: "checklist",
    phase: "Completion & Signoffs",
    cas: "CAS 560",
    prerequisites: ["SO-FAR"],
    criticalPath: true,
  },
  {
    code: "SO-GCF",
    navKey: "aud-wgc-final",
    label: "Going Concern — Final Assessment",
    type: "checklist",
    phase: "Completion & Signoffs",
    cas: "CAS 570",
    prerequisites: ["SO-FAR", "SO-SE"],
    criticalPath: false,
  },
  {
    code: "SO-MRL",
    navKey: "aud-mr",
    label: "Management Representation Letter",
    type: "checklist",
    phase: "Completion & Signoffs",
    cas: "CAS 580",
    prerequisites: ["SO-FAR", "SO-GCF"],
    criticalPath: true,
  },
  {
    code: "SO-TCWG",
    navKey: "aud-tcwg-fin",
    label: "TCWG Communication — Completion",
    type: "letter",
    phase: "Completion & Signoffs",
    cas: "CAS 260",
    prerequisites: ["SO-MRL", "SO-AIM"],
    criticalPath: false,
  },
  {
    code: "SO-COMP",
    navKey: "aud-comp",
    label: "Audit Completion Checklist",
    type: "completion",
    phase: "Completion & Signoffs",
    cas: "CAS 220",
    prerequisites: ["SO-FAR", "SO-SE", "SO-GCF", "SO-MRL", "SO-TCWG"],
    criticalPath: true,
  },
  {
    code: "SO-EP",
    navKey: "aud-ep",
    label: "Quality Control Review (EP)",
    type: "completion",
    phase: "Completion & Signoffs",
    cas: "CSQM 1",
    prerequisites: ["SO-COMP"],
    criticalPath: true,
  },
];

const PHASE_ORDER: Phase[] = [
  "Client Onboarding",
  "Planning",
  "Risk Assessment",
  "Response to Risks",
  "Financial Statements",
  "Completion & Signoffs",
];

const PHASE_COLORS: Record<Phase, { bg: string; text: string; border: string }> = {
  "Client Onboarding": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  "Planning": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Risk Assessment": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Response to Risks": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  "Financial Statements": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Completion & Signoffs": { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeIcon({ type }: { type: DocType }) {
  const cls = "h-3.5 w-3.5 flex-shrink-0";
  if (type === "letter") return <LetterIcon className={cls} />;
  if (type === "worksheet") return <WorksheetIcon className={cls} />;
  if (type === "completion") return <CompletionIcon className={cls} />;
  return <ChecklistIcon className={cls} />;
}

function TypeBadge({ type }: { type: DocType }) {
  const labels: Record<DocType, string> = {
    checklist: "Checklist",
    letter: "Letter",
    worksheet: "Worksheet",
    completion: "Completion",
  };
  const colors: Record<DocType, string> = {
    checklist: "bg-sky-100 text-sky-700 border border-sky-200",
    letter: "bg-purple-100 text-purple-700 border border-purple-200",
    worksheet: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    completion: "bg-teal-100 text-teal-700 border border-teal-200",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium", colors[type])}>
      <TypeIcon type={type} />
      {labels[type]}
    </span>
  );
}

function PrereqBadges({ codes, onNavigate }: { codes: string[]; onNavigate: (code: string) => void }) {
  if (codes.length === 0) {
    return <span className="text-xs text-muted-foreground italic">None — can start immediately</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {codes.map(code => (
        <button
          key={code}
          onClick={() => onNavigate(code)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs font-mono font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border hover:border-primary/40"
        >
          <Link2 className="h-3 w-3" />
          {code}
        </button>
      ))}
    </div>
  );
}

function CriticalBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border border-red-200">
      <AlertCircle className="h-3 w-3" />
      Critical Path
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AuditDependencyRegister() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const navigate = useNavigate();

  // Build a code → navKey map for navigation
  const codeToNavKey = Object.fromEntries(REGISTER.map(r => [r.code, r.navKey]));

  const handleNavigateToCode = (code: string) => {
    const navKey = codeToNavKey[code];
    if (navKey && engagementId) {
      navigate(`/engagements/${engagementId}/checklist/${navKey}`);
    }
  };

  const handleNavigateToItem = (item: DependencyItem) => {
    if (engagementId) {
      navigate(`/engagements/${engagementId}/checklist/${item.navKey}`);
    }
  };

  const breadcrumb = (
    <div className="flex items-center gap-1.5 text-sm text-sidebar-foreground">
      <span className="font-medium">{engagementId}</span>
      <ChevronRight className="h-3.5 w-3.5 opacity-50" />
      <span className="font-semibold">Dependency Register</span>
    </div>
  );

  return (
    <Layout title="Engagements" headerContent={breadcrumb}>
      <div className="flex-1 overflow-auto bg-background p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Audit Engagement Dependency Register</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Prerequisites that must be completed before each checklist, letter, or worksheet can be started.
            Critical path items are required to reach the auditor's report.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-3 bg-card rounded-lg border border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Legend:</span>
          <div className="flex items-center gap-1.5">
            <TypeIcon type="checklist" />
            <span className="text-xs text-muted-foreground">Checklist</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TypeIcon type="letter" />
            <span className="text-xs text-muted-foreground">Letter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TypeIcon type="worksheet" />
            <span className="text-xs text-muted-foreground">Worksheet</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TypeIcon type="completion" />
            <span className="text-xs text-muted-foreground">Completion</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            <span className="text-xs text-muted-foreground">Critical path item</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">Click a prerequisite code to navigate to it</span>
          </div>
        </div>

        {/* Table by Phase */}
        <div className="space-y-8">
          {PHASE_ORDER.map(phase => {
            const items = REGISTER.filter(r => r.phase === phase);
            const colors = PHASE_COLORS[phase];
            return (
              <div key={phase} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                {/* Phase header */}
                <div className={cn("px-4 py-3 border-b border-border flex items-center gap-2", colors.bg)}>
                  <span className={cn("text-sm font-bold", colors.text)}>{phase}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", colors.bg, colors.text, colors.border)}>
                    {items.length} items
                  </span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium ml-auto", colors.bg, colors.text, colors.border)}>
                    {items.filter(i => i.criticalPath).length} critical path
                  </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-24">Code</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Document</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-36">Type</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-36">Standard</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Prerequisites</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-36">Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr
                          key={item.code}
                          className={cn(
                            "border-b border-border/50 hover:bg-muted/30 transition-colors",
                            idx === items.length - 1 && "border-b-0"
                          )}
                        >
                          {/* Code */}
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleNavigateToItem(item)}
                              className="font-mono text-xs font-bold text-primary hover:underline"
                            >
                              {item.code}
                            </button>
                          </td>

                          {/* Document name */}
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleNavigateToItem(item)}
                              className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left"
                            >
                              {item.label}
                            </button>
                          </td>

                          {/* Type */}
                          <td className="px-4 py-3">
                            <TypeBadge type={item.type} />
                          </td>

                          {/* Standard */}
                          <td className="px-4 py-3">
                            {item.cas ? (
                              <span className="text-xs text-muted-foreground font-mono">{item.cas}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>

                          {/* Prerequisites */}
                          <td className="px-4 py-3">
                            <PrereqBadges codes={item.prerequisites} onNavigate={handleNavigateToCode} />
                          </td>

                          {/* Flag */}
                          <td className="px-4 py-3">
                            {item.criticalPath ? <CriticalBadge /> : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Documents", value: REGISTER.length, color: "text-foreground" },
            { label: "Critical Path", value: REGISTER.filter(r => r.criticalPath).length, color: "text-red-600" },
            { label: "Letters", value: REGISTER.filter(r => r.type === "letter").length, color: "text-purple-600" },
            { label: "Phases", value: PHASE_ORDER.length, color: "text-primary" },
          ].map(stat => (
            <div key={stat.label} className="bg-card rounded-lg border border-border p-4 text-center">
              <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
