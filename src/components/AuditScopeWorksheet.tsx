import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Plus, X } from "lucide-react";
import { AddToMyTemplatesDialog } from "@/components/AddToMyTemplatesDialog";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

interface FSARow {
  id: string;
  code: string;
  description: string;
  balance: string;
  material: "yes" | "no" | "";
  misstatementLikely: "high" | "moderate" | "low" | "na" | "";
  potentialEffect: string;
  procedures: string;
}

interface SignificantRisk {
  id: string;
  risk: string;
  area: string;
  inherentRiskRating: "significant" | "high" | "moderate" | "low" | "";
  plannedResponse: string;
}

interface PervasiveMisstatement {
  id: string;
  description: string;
  type: "fraud" | "error" | "";
  assessment: string;
}

interface DisclosureItem {
  id: string;
  disclosure: string;
  material: "yes" | "no" | "";
  auditApproach: string;
}

interface WorksheetData {
  // Engagement info (carried from MAT)
  periodStart: string;
  periodEnd: string;
  reportingFramework: string;
  entityDescription: string;

  // Materiality carry-forward
  overallMateriality: string;
  performanceMateriality: string;
  clearlyTrivial: string;

  // Scope definition
  entityComponents: string;
  componentAuditors: "yes" | "no" | "na" | "";
  componentAuditorsDetail: string;
  scopeRestrictions: "yes" | "no" | "";
  scopeRestrictionsDetail: string;
  reportingDeadline: string;
  auditObjective: string;

  // FSA table
  fsaRows: FSARow[];

  // Performance materiality allocation
  pmAllocationComments: string;

  // Significant risks
  significantRisks: SignificantRisk[];

  // Pervasive misstatements
  pervasiveMisstatements: PervasiveMisstatement[];

  // Disclosures
  disclosures: DisclosureItem[];

  // Additional comments
  additionalComments: string;

  // Conclusion
  conclusion: string;
  concludedBy: string;
  concludedDate: string;
  preparedBy: string;
  preparedDate: string;
  reviewedBy: string;
  reviewedDate: string;
}

const FRAMEWORK_OPTIONS = [
  "ASPE",
  "IFRS",
  "ASNPO",
  "Public Sector Accounting Standards (PSAS)",
  "US GAAP",
  "Other",
];

const DEFAULT_FSA_ROWS: FSARow[] = [
  // Assets
  { id: "fsa-a", code: "A", description: "Cash and cash equivalents", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-b", code: "B", description: "Accounts receivable and confirmations", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-c", code: "C", description: "Inventories", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-d", code: "D", description: "Prepaid expenses and other current assets", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-h", code: "H", description: "Property, plant and equipment", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-i", code: "I", description: "Intangible assets", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-j", code: "J", description: "Investments and long-term receivables", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  // Liabilities
  { id: "fsa-aa", code: "AA", description: "Bank indebtedness / overdraft", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-bb", code: "BB", description: "Accounts payable and accrued liabilities", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-cc", code: "CC", description: "Income taxes payable", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-dd", code: "DD", description: "Short-term debt and current portion of long-term debt", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-ee", code: "EE", description: "Deferred revenue", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-jj", code: "JJ", description: "Long-term debt", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  // Equity
  { id: "fsa-tt", code: "TT", description: "Equity / shareholders' equity", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  // Income
  { id: "fsa-700", code: "700", description: "Revenue / net sales", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-710", code: "710", description: "Cost of goods sold / cost of revenues", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-720", code: "720", description: "Operating expenses (salaries, rent, etc.)", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-730", code: "730", description: "Interest and financing charges", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-740", code: "740", description: "Depreciation and amortization", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
  { id: "fsa-750", code: "750", description: "Income tax expense", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
];

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function formatCAD(val: string): string {
  const n = parseFloat(val.replace(/[^0-9.]/g, ""));
  if (isNaN(n)) return val;
  return "$" + n.toLocaleString("en-CA", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionCard({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
      <div className="px-6 py-3.5 bg-card border-b border-border">
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      {note && (
        <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2">
          <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">{note}</p>
        </div>
      )}
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function RowLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-sm text-foreground font-medium mb-1">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}

function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="h-9 px-3 flex items-center bg-muted/60 border border-border rounded-md text-sm font-semibold text-foreground">
        {value || <span className="text-muted-foreground font-normal">Not set</span>}
      </div>
    </div>
  );
}

function YNBadge({ value }: { value: "yes" | "no" | "" }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  return (
    <span
      className={`inline-flex items-center justify-center h-6 px-2 rounded text-xs font-medium ${
        value === "yes"
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {value === "yes" ? "Yes" : "No"}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface AuditScopeWorksheetProps {
  isUS?: boolean;
  overallMateriality?: string;
  performanceMateriality?: string;
  clearlyTrivial?: string;
}

export function AuditScopeWorksheet({
  isUS = false,
  overallMateriality: propOM,
  performanceMateriality: propPM,
  clearlyTrivial: propCT,
}: AuditScopeWorksheetProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [concluded, setConcluded] = useState(false);

  const [data, setData] = useState<WorksheetData>({
    periodStart: "",
    periodEnd: "",
    reportingFramework: isUS ? "US GAAP" : "ASPE",
    entityDescription: "",

    overallMateriality: propOM ?? "",
    performanceMateriality: propPM ?? "",
    clearlyTrivial: propCT ?? "",

    entityComponents: "",
    componentAuditors: "",
    componentAuditorsDetail: "",
    scopeRestrictions: "",
    scopeRestrictionsDetail: "",
    reportingDeadline: "",
    auditObjective: "",

    fsaRows: DEFAULT_FSA_ROWS.map((r) => ({ ...r, id: uid() })),

    pmAllocationComments: "",

    significantRisks: [
      { id: uid(), risk: "", area: "", inherentRiskRating: "", plannedResponse: "" },
    ],

    pervasiveMisstatements: [
      { id: uid(), description: "", type: "", assessment: "" },
    ],

    disclosures: [
      { id: uid(), disclosure: "", material: "", auditApproach: "" },
    ],

    additionalComments: "",
    conclusion: "",
    concludedBy: "",
    concludedDate: "",
    preparedBy: "",
    preparedDate: "",
    reviewedBy: "",
    reviewedDate: "",
  });

  const update = useCallback(<K extends keyof WorksheetData>(key: K, value: WorksheetData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateFSARow = (id: string, field: keyof FSARow, value: string) => {
    setData((prev) => ({
      ...prev,
      fsaRows: prev.fsaRows.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));
  };

  const standardRef = isUS ? "AS 2101 / AU-C 300" : "CAS 300 / CAS 315";
  const title = isUS ? "Engagement Scope — US GAAS" : "Engagement Scope — CAS 300";

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b bg-card px-6 py-3 flex items-center justify-between shrink-0">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add to My Templates
        </Button>
      </div>

      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Define and document the scope of the audit engagement: entity coverage, reporting period,
          applicable framework, financial statement areas in scope, significant risks, and agreed
          reporting requirements. ({standardRef})
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* ── Section 1: Materiality Carry-Forward ── */}
          <SectionCard
            title="1. Materiality Carry-Forward"
            note="Values carried forward from the Materiality (MAT) worksheet. Update that worksheet first, then refresh these values."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <RowLabel label="Overall materiality ($)" />
                <Input
                  placeholder="From MAT worksheet"
                  value={data.overallMateriality}
                  onChange={(e) => update("overallMateriality", e.target.value.replace(/[^0-9.]/g, ""))}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <RowLabel label="Performance materiality ($)" />
                <Input
                  placeholder="From MAT worksheet"
                  value={data.performanceMateriality}
                  onChange={(e) => update("performanceMateriality", e.target.value.replace(/[^0-9.]/g, ""))}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <RowLabel label="Clearly trivial threshold ($)" />
                <Input
                  placeholder="From MAT worksheet"
                  value={data.clearlyTrivial}
                  onChange={(e) => update("clearlyTrivial", e.target.value.replace(/[^0-9.]/g, ""))}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </SectionCard>

          {/* ── Section 2: Engagement Information ── */}
          <SectionCard title="2. Engagement Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <RowLabel label="Period start date" />
                <Input
                  type="date"
                  value={data.periodStart}
                  onChange={(e) => update("periodStart", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <RowLabel label="Period end date" />
                <Input
                  type="date"
                  value={data.periodEnd}
                  onChange={(e) => update("periodEnd", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <RowLabel label="Financial reporting framework" />
                <Select
                  value={data.reportingFramework}
                  onValueChange={(v) => update("reportingFramework", v)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {FRAMEWORK_OPTIONS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <RowLabel label="Report delivery deadline" />
                <Input
                  type="date"
                  value={data.reportingDeadline}
                  onChange={(e) => update("reportingDeadline", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <RowLabel label="Entity description (legal name, nature of business, jurisdiction)" />
                <Textarea
                  placeholder="e.g. Shipping Line Inc., incorporated under the CBCA, engaged in maritime freight and logistics…"
                  value={data.entityDescription}
                  onChange={(e) => update("entityDescription", e.target.value)}
                  className="min-h-[60px] text-sm resize-none bg-background"
                />
              </div>
              <div className="sm:col-span-2">
                <RowLabel label="Components included in scope (subsidiaries, divisions, branches, JVs)" />
                <Textarea
                  placeholder="Describe all components included in scope, or state 'Single entity — no subsidiaries or components'…"
                  value={data.entityComponents}
                  onChange={(e) => update("entityComponents", e.target.value)}
                  className="min-h-[60px] text-sm resize-none bg-background"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <RowLabel label="Component auditors involved?" />
                <Select
                  value={data.componentAuditors}
                  onValueChange={(v) => update("componentAuditors", v as WorksheetData["componentAuditors"])}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="na">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {data.componentAuditors === "yes" && (
                <div>
                  <RowLabel label="Component auditor details" />
                  <Textarea
                    placeholder="Identify component auditors and describe how their work will be used…"
                    value={data.componentAuditorsDetail}
                    onChange={(e) => update("componentAuditorsDetail", e.target.value)}
                    className="min-h-[60px] text-sm resize-none bg-background"
                  />
                </div>
              )}
              <div>
                <RowLabel label="Scope restrictions identified?" />
                <Select
                  value={data.scopeRestrictions}
                  onValueChange={(v) => update("scopeRestrictions", v as WorksheetData["scopeRestrictions"])}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes — document below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {data.scopeRestrictions === "yes" && (
                <div>
                  <RowLabel label="Scope restriction detail and impact on report" />
                  <Textarea
                    placeholder="Describe restriction and whether a qualification or disclaimer is required…"
                    value={data.scopeRestrictionsDetail}
                    onChange={(e) => update("scopeRestrictionsDetail", e.target.value)}
                    className="min-h-[60px] text-sm resize-none bg-background"
                  />
                </div>
              )}
            </div>
          </SectionCard>

          {/* ── Section 3: Financial Statement Areas (FSA) ── */}
          <SectionCard
            title="3. Financial Statement Areas (FSA) — Scope Table"
            note="For each account code, enter the balance, assess materiality, and document the planned audit approach. Immaterial areas may have reduced procedures."
          >
            {data.overallMateriality && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-muted/60 rounded-md border border-border">
                <InfoBadge label="Overall materiality" value={data.overallMateriality ? formatCAD(data.overallMateriality) : ""} />
                <InfoBadge label="Performance materiality" value={data.performanceMateriality ? formatCAD(data.performanceMateriality) : ""} />
                <InfoBadge label="Clearly trivial" value={data.clearlyTrivial ? formatCAD(data.clearlyTrivial) : ""} />
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 900 }}>
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-12">Code</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-44">Description</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-28">Balance ($)</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-20">Material?</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-28">Misstatement likely</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Description of potential effect</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-36">Significant planned procedures</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.fsaRows.map((row) => (
                    <tr key={row.id} className={`hover:bg-muted/30 transition-colors ${row.material === "yes" ? "bg-primary/[0.02]" : ""}`}>
                      <td className="px-3 py-2 align-top">
                        <Input
                          value={row.code}
                          onChange={(e) => updateFSARow(row.id, "code", e.target.value)}
                          className="h-7 w-12 text-xs border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent font-mono"
                        />
                      </td>
                      <td className="px-3 py-2 align-top">
                        <Textarea
                          value={row.description}
                          onChange={(e) => updateFSARow(row.id, "description", e.target.value)}
                          className="min-h-[36px] text-xs resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent w-40"
                        />
                      </td>
                      <td className="px-3 py-2 align-top">
                        <Input
                          placeholder="0"
                          value={row.balance}
                          onChange={(e) => updateFSARow(row.id, "balance", e.target.value.replace(/[^0-9.]/g, ""))}
                          className="h-7 w-24 text-xs border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent tabular-nums"
                        />
                      </td>
                      <td className="px-3 py-2 align-top text-center">
                        <Select
                          value={row.material}
                          onValueChange={(v) => updateFSARow(row.id, "material", v)}
                        >
                          <SelectTrigger className="h-7 text-xs w-16 mx-auto">
                            <SelectValue placeholder="—">
                              {row.material ? (
                                <YNBadge value={row.material as "yes" | "no" | ""} />
                              ) : "—"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-2 align-top text-center">
                        <Select
                          value={row.misstatementLikely}
                          onValueChange={(v) => updateFSARow(row.id, "misstatementLikely", v)}
                        >
                          <SelectTrigger className="h-7 text-xs w-24 mx-auto">
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="na">N/A</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-2 align-top">
                        <Textarea
                          placeholder="Describe potential effect of misstatement…"
                          value={row.potentialEffect}
                          onChange={(e) => updateFSARow(row.id, "potentialEffect", e.target.value)}
                          className="min-h-[52px] text-xs resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2 align-top">
                        <Textarea
                          placeholder="Link or describe…"
                          value={row.procedures}
                          onChange={(e) => updateFSARow(row.id, "procedures", e.target.value)}
                          className="min-h-[52px] text-xs resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2 align-top text-center">
                        <button
                          onClick={() =>
                            update(
                              "fsaRows",
                              data.fsaRows.filter((r) => r.id !== row.id)
                            )
                          }
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                update("fsaRows", [
                  ...data.fsaRows,
                  { id: uid(), code: "", description: "", balance: "", material: "", misstatementLikely: "", potentialEffect: "", procedures: "" },
                ])
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add row
            </Button>
          </SectionCard>

          {/* ── Section 4: Performance Materiality Allocation ── */}
          <SectionCard
            title="4. Performance Materiality Allocation"
            note="Document how performance materiality has been allocated across significant account balances or transaction classes."
          >
            <Textarea
              placeholder="Describe how performance materiality was allocated across FSAs — e.g. proportional allocation, risk-based allocation, or equal allocation across material account balances…"
              value={data.pmAllocationComments}
              onChange={(e) => update("pmAllocationComments", e.target.value)}
              className="min-h-[80px] text-sm resize-none bg-background"
            />
          </SectionCard>

          {/* ── Section 5: Significant Risks ── */}
          <SectionCard
            title="5. Significant Risks"
            note={
              (isUS ? "(AS 2110.68 / AU-C 315.27)" : "(CAS 315.27–28)") +
              " — Identify significant risks that require special audit consideration."
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 700 }}>
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-1/4">Risk description</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-1/5">FSA / account area</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-1/6">Inherent risk rating</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Planned audit response</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.significantRisks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2">
                        <Textarea
                          placeholder="e.g. Revenue recognition cut-off"
                          value={risk.risk}
                          onChange={(e) =>
                            update(
                              "significantRisks",
                              data.significantRisks.map((x) =>
                                x.id === risk.id ? { ...x, risk: e.target.value } : x
                              )
                            )
                          }
                          className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="e.g. Revenue / AR"
                          value={risk.area}
                          onChange={(e) =>
                            update(
                              "significantRisks",
                              data.significantRisks.map((x) =>
                                x.id === risk.id ? { ...x, area: e.target.value } : x
                              )
                            )
                          }
                          className="h-8 text-sm border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Select
                          value={risk.inherentRiskRating}
                          onValueChange={(v) =>
                            update(
                              "significantRisks",
                              data.significantRisks.map((x) =>
                                x.id === risk.id ? { ...x, inherentRiskRating: v as SignificantRisk["inherentRiskRating"] } : x
                              )
                            )
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="significant">Significant</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-2">
                        <Textarea
                          placeholder="Describe planned procedures to address this risk…"
                          value={risk.plannedResponse}
                          onChange={(e) =>
                            update(
                              "significantRisks",
                              data.significantRisks.map((x) =>
                                x.id === risk.id ? { ...x, plannedResponse: e.target.value } : x
                              )
                            )
                          }
                          className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        {data.significantRisks.length > 1 && (
                          <button
                            onClick={() =>
                              update(
                                "significantRisks",
                                data.significantRisks.filter((x) => x.id !== risk.id)
                              )
                            }
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                update("significantRisks", [
                  ...data.significantRisks,
                  { id: uid(), risk: "", area: "", inherentRiskRating: "", plannedResponse: "" },
                ])
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add risk
            </Button>
          </SectionCard>

          {/* ── Section 6: Pervasive Misstatements ── */}
          <SectionCard
            title="6. Pervasive Misstatements"
            note="Identify any known or suspected pervasive misstatements (those that affect multiple elements of the financial statements) and document the audit response."
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 600 }}>
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-2/5">Description</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-1/6">Type</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Assessment / response</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.pervasiveMisstatements.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2">
                        <Textarea
                          placeholder="Describe the pervasive misstatement or risk…"
                          value={item.description}
                          onChange={(e) =>
                            update(
                              "pervasiveMisstatements",
                              data.pervasiveMisstatements.map((x) =>
                                x.id === item.id ? { ...x, description: e.target.value } : x
                              )
                            )
                          }
                          className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Select
                          value={item.type}
                          onValueChange={(v) =>
                            update(
                              "pervasiveMisstatements",
                              data.pervasiveMisstatements.map((x) =>
                                x.id === item.id ? { ...x, type: v as PervasiveMisstatement["type"] } : x
                              )
                            )
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fraud">Fraud</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-2">
                        <Textarea
                          placeholder="Assessment and planned audit response…"
                          value={item.assessment}
                          onChange={(e) =>
                            update(
                              "pervasiveMisstatements",
                              data.pervasiveMisstatements.map((x) =>
                                x.id === item.id ? { ...x, assessment: e.target.value } : x
                              )
                            )
                          }
                          className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        {data.pervasiveMisstatements.length > 1 && (
                          <button
                            onClick={() =>
                              update(
                                "pervasiveMisstatements",
                                data.pervasiveMisstatements.filter((x) => x.id !== item.id)
                              )
                            }
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                update("pervasiveMisstatements", [
                  ...data.pervasiveMisstatements,
                  { id: uid(), description: "", type: "", assessment: "" },
                ])
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add row
            </Button>
          </SectionCard>

          {/* ── Section 7: Financial Statement Disclosures ── */}
          <SectionCard
            title="7. Financial Statement Disclosures"
            note="Identify significant disclosures, assess their materiality, and document the planned audit approach for each."
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 600 }}>
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-2/5">Disclosure</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-20">Material?</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Audit approach</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.disclosures.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2">
                        <Textarea
                          placeholder="e.g. Related party transactions (ASPE 3840)"
                          value={item.disclosure}
                          onChange={(e) =>
                            update(
                              "disclosures",
                              data.disclosures.map((x) =>
                                x.id === item.id ? { ...x, disclosure: e.target.value } : x
                              )
                            )
                          }
                          className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <Select
                          value={item.material}
                          onValueChange={(v) =>
                            update(
                              "disclosures",
                              data.disclosures.map((x) =>
                                x.id === item.id ? { ...x, material: v as "yes" | "no" | "" } : x
                              )
                            )
                          }
                        >
                          <SelectTrigger className="h-8 text-sm w-16 mx-auto">
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-2">
                        <Textarea
                          placeholder="Describe how you will audit the completeness and accuracy of this disclosure…"
                          value={item.auditApproach}
                          onChange={(e) =>
                            update(
                              "disclosures",
                              data.disclosures.map((x) =>
                                x.id === item.id ? { ...x, auditApproach: e.target.value } : x
                              )
                            )
                          }
                          className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        {data.disclosures.length > 1 && (
                          <button
                            onClick={() =>
                              update(
                                "disclosures",
                                data.disclosures.filter((x) => x.id !== item.id)
                              )
                            }
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                update("disclosures", [
                  ...data.disclosures,
                  { id: uid(), disclosure: "", material: "", auditApproach: "" },
                ])
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add disclosure
            </Button>
          </SectionCard>

          {/* ── Additional Comments ── */}
          <SectionCard title="Additional Comments">
            <Textarea
              placeholder="Any additional comments or context not captured above…"
              value={data.additionalComments}
              onChange={(e) => update("additionalComments", e.target.value)}
              className="min-h-[80px] text-sm resize-none bg-background"
            />
          </SectionCard>

          {/* ── Conclusion ── */}
          <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Conclusion</span>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <RowLabel label="Conclusion statement" />
                <Textarea
                  placeholder="I am satisfied that the engagement scope has been clearly defined and documented. All significant financial statement areas have been identified, materiality has been allocated appropriately, and significant risks have been linked to planned audit responses…"
                  value={data.conclusion}
                  onChange={(e) => update("conclusion", e.target.value)}
                  className="min-h-[80px] text-sm resize-none bg-background"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <RowLabel label="Engagement partner" />
                  <Input
                    placeholder="Name, designation"
                    value={data.concludedBy}
                    onChange={(e) => update("concludedBy", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <RowLabel label="Date" />
                  <Input
                    type="date"
                    value={data.concludedDate}
                    onChange={(e) => update("concludedDate", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div />
                <div>
                  <RowLabel label="Prepared by" />
                  <Input
                    placeholder="Name, designation"
                    value={data.preparedBy}
                    onChange={(e) => update("preparedBy", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <RowLabel label="Date" />
                  <Input
                    type="date"
                    value={data.preparedDate}
                    onChange={(e) => update("preparedDate", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div />
                <div>
                  <RowLabel label="Reviewed by" />
                  <Input
                    placeholder="Name, designation"
                    value={data.reviewedBy}
                    onChange={(e) => update("reviewedBy", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <RowLabel label="Date" />
                  <Input
                    type="date"
                    value={data.reviewedDate}
                    onChange={(e) => update("reviewedDate", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  onClick={() => {
                    setConcluded(true);
                    toast.success("Engagement scope worksheet concluded");
                  }}
                  disabled={concluded}
                >
                  {concluded ? "Worksheet concluded" : "Conclude worksheet"}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Dialog */}
      <AddToMyTemplatesDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        checklist={{
          id: isUS ? "aud-us-scope-worksheet" : "aud-scope-worksheet",
          title,
          sections: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
        checklistName={title}
      />
    </div>
  );
}
