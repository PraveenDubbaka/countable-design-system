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
import { Info, RefreshCw, Trash2, Plus, Calendar } from "lucide-react";
import { AddToMyTemplatesDialog } from "@/components/AddToMyTemplatesDialog";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

interface EntityRow {
  id: string;
  entityName: string;
  basis: string;
  periodAmount: string;
  extrapolatedPeriod: string;
  benchmarkPct: string;
  materialityCY: string; // calculated
  materialityPY: string;
  comments: string;
}

interface IntendedUser {
  id: string;
  user: string;
  factors: string;
}

interface QualitativeItem {
  id: string;
  nature: string;
  impact: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function formatNum(val: string | number): string {
  const n = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.]/g, ""));
  if (isNaN(n)) return "";
  return n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcMatCY(periodAmount: string, benchmarkPct: string): string {
  const a = parseFloat(periodAmount.replace(/[^0-9.]/g, ""));
  const p = parseFloat(benchmarkPct.replace(/[^0-9.]/g, ""));
  if (isNaN(a) || isNaN(p)) return "";
  return formatNum(a * p / 100);
}

function sumColumn(rows: EntityRow[], field: keyof EntityRow): string {
  let total = 0;
  let hasValue = false;
  for (const row of rows) {
    const v = parseFloat(String(row[field]).replace(/[^0-9.]/g, ""));
    if (!isNaN(v)) { total += v; hasValue = true; }
  }
  return hasValue ? formatNum(total) : "";
}

const BASIS_OPTIONS = [
  "Gross revenues",
  "Total assets",
  "Profit before tax",
  "Total expenses",
  "Net assets",
];

const ENTITY_TYPE_OPTIONS = ["Profit Oriented", "Non-Profit", "Government", "Other"];

const formatDisplay = (v: string) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v;
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function TdInput({
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly,
  className = "",
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
  className?: string;
}) {
  return (
    <Input
      type={type}
      readOnly={readOnly}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={`h-8 text-sm ${className}`}
    />
  );
}

function TdSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface AuditMaterialityWorksheetProps {
  isUS?: boolean;
}

export function AuditMaterialityWorksheet({ isUS = false }: AuditMaterialityWorksheetProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [concluded, setConcluded] = useState(false);

  const [periodStart, setPeriodStart] = useState(isUS ? "2024-01-01" : "2024-04-01");
  const [periodEnd, setPeriodEnd] = useState(isUS ? "2024-12-31" : "2025-03-31");

  // Preliminary Materiality table rows
  const mockPeriodAmount = isUS ? "18400000" : "12500000";
  const [entityRows, setEntityRows] = useState<EntityRow[]>([
    {
      id: uid(),
      entityName: "Profit Oriented",
      basis: "Gross revenues",
      periodAmount: mockPeriodAmount,
      extrapolatedPeriod: mockPeriodAmount,
      benchmarkPct: "1.00",
      materialityCY: calcMatCY(mockPeriodAmount, "1.00"),
      materialityPY: "0",
      comments: "",
    },
  ]);

  // Clearly trivial
  const [ctThresholdPct, setCtThresholdPct] = useState("5.00");

  // Performance Materiality
  const [pmPct, setPmPct] = useState("70");
  const [pmRationale, setPmRationale] = useState("");

  // Intended Users
  const [intendedUsers, setIntendedUsers] = useState<IntendedUser[]>([
    { id: uid(), user: "", factors: "" },
  ]);

  // Qualitative considerations
  const [qualitative, setQualitative] = useState<QualitativeItem[]>([
    { id: uid(), nature: "", impact: "" },
  ]);

  // Section B — Qualitative disclosures
  const [qualDisclosures, setQualDisclosures] = useState(
    isUS
      ? "ASC 842 first-year lease adoption — nature and extent of leases, ROU asset measurement, discount rate policy, and transition adjustments require complete disclosure. Goodwill impairment testing methodology and assumptions also require qualitative disclosure per ASC 350."
      : "Vessel impairment indicators (CAS 36) — nature of impairment assessment and key assumptions (charter rate forecasts, useful lives) require qualitative disclosure. Foreign currency risk management policy disclosure under ASPE s.3856."
  );

  // Section C adjusted — Performance materiality for specific F/S areas
  interface AdjPMRow { id: string; area: string; amount: string; reasoning: string; pyAmount: string; }
  const initAdjPM: AdjPMRow[] = isUS ? [
    { id: uid(), area: "Revenue (ASC 606 — contract estimates)", amount: "92000", reasoning: "Higher risk of misstatement due to percentage-of-completion estimates. PM set at 50% of overall.", pyAmount: "" },
    { id: uid(), area: "ROU Assets & Lease Liabilities (ASC 842)", amount: "64000", reasoning: "First-year adoption — increased inherent risk. PM set at 35% of overall.", pyAmount: "" },
  ] : [
    { id: uid(), area: "Vessel PP&E (CAS 36 impairment)", amount: "62000", reasoning: "Significant judgment in impairment assessment. PM set at 50% of performance materiality.", pyAmount: "" },
  ];
  const [adjPMRows, setAdjPMRows] = useState<AdjPMRow[]>(initAdjPM);

  // Section D — Materiality for specific circumstances
  interface SpecMatRow { id: string; description: string; amount: string; reasoning: string; wpRef: string; pyAmount: string; }
  const initSpecMat: SpecMatRow[] = isUS ? [
    { id: uid(), description: "Related party transactions (ASC 850) — Board member loans and management compensation", amount: "10000", reasoning: "Users (lenders) particularly sensitive to RPTs. Lower materiality applied to ensure completeness of disclosure.", wpRef: "WP-RPT-01", pyAmount: "" },
    { id: uid(), description: "Going concern disclosures — elevated D/E ratio (2.71x) and covenant compliance", amount: "0", reasoning: "Qualitative — any indication of substantial doubt requires disclosure regardless of dollar amount.", wpRef: "WP-GC-01", pyAmount: "" },
  ] : [
    { id: uid(), description: "Related party transactions — shareholder loans and management fees", amount: "5000", reasoning: "Bank covenant requires disclosure of all RPTs. Lower threshold applied for completeness.", wpRef: "WP-RPT-01", pyAmount: "" },
  ];
  const [specMatRows, setSpecMatRows] = useState<SpecMatRow[]>(initSpecMat);

  // Section E — Performance materiality for specific circumstances
  const [specPMAmount, setSpecPMAmount] = useState(isUS ? "7000" : "3500");
  const [specPMReasoning, setSpecPMReasoning] = useState(
    isUS
      ? "Performance materiality for RPTs set at 70% of specific materiality ($10,000 × 70% = $7,000). Ensures detection of individually insignificant RPTs that aggregate to material amounts."
      : "Performance materiality for RPTs set at 70% of specific materiality ($5,000 × 70% = $3,500)."
  );
  const [specPMPY, setSpecPMPY] = useState("");
  const [specPMWPRef, setSpecPMWPRef] = useState("WP-RPT-PM");

  // Additional comments & conclusion
  const [additionalComments, setAdditionalComments] = useState("");
  const [conclusion, setConclusion] = useState(
    "I am satisfied that the engagement planning adequately addresses the areas in the financial statements where material misstatements are likely to arise"
  );

  // ── Derived ──────────────────────────────────────────────────────────────────

  const updateEntityRow = useCallback(
    (id: string, field: keyof EntityRow, value: string) => {
      setEntityRows((prev) =>
        prev.map((row) => {
          if (row.id !== id) return row;
          const updated = { ...row, [field]: value };
          // recalculate materialityCY if periodAmount or benchmarkPct changed
          if (field === "periodAmount" || field === "benchmarkPct") {
            const pAmt = field === "periodAmount" ? value : row.periodAmount;
            const bPct = field === "benchmarkPct" ? value : row.benchmarkPct;
            updated.materialityCY = calcMatCY(pAmt, bPct);
          }
          return updated;
        })
      );
    },
    []
  );

  const addEntityRow = () => {
    setEntityRows((prev) => [
      ...prev,
      {
        id: uid(),
        entityName: "",
        basis: "",
        periodAmount: "",
        extrapolatedPeriod: "",
        benchmarkPct: "1.00",
        materialityCY: "",
        materialityPY: "",
      },
    ]);
  };

  const removeEntityRow = (id: string) => {
    setEntityRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Totals for all numeric columns
  const totalPeriod = sumColumn(entityRows, "periodAmount");
  const totalExtrapolated = sumColumn(entityRows, "extrapolatedPeriod");
  const totalBenchmark = sumColumn(entityRows, "benchmarkPct");
  const totalMatCY = sumColumn(entityRows, "materialityCY");
  const totalMatPY = sumColumn(entityRows, "materialityPY");

  // Clearly trivial amount
  const ctAmount = (() => {
    const m = parseFloat(totalMatCY.replace(/[^0-9.]/g, ""));
    const p = parseFloat(ctThresholdPct.replace(/[^0-9.]/g, ""));
    if (isNaN(m) || isNaN(p)) return "";
    return formatNum(m * p / 100);
  })();

  // Performance Materiality
  const pmAmount = (() => {
    const m = parseFloat(totalMatCY.replace(/[^0-9.]/g, ""));
    const p = parseFloat(pmPct.replace(/[^0-9.]/g, ""));
    if (isNaN(m) || isNaN(p)) return "";
    return formatNum(m * p / 100);
  })();

  const standardRef = isUS ? "AU-C 320" : "CAS 320";
  const title = isUS ? "Materiality — AU-C 320" : "Materiality — CAS 320";

  const periodLabel = periodStart && periodEnd
    ? (() => {
        const fmt = (d: string) => {
          const dt = new Date(d + 'T00:00:00');
          return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '');
        };
        return `${fmt(periodStart)}-${fmt(periodEnd)}($)`;
      })()
    : "Period ($)";

  return (
    <div className="flex flex-col h-full">

      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Establish overall materiality, performance materiality, and the clearly trivial threshold for the audit
          and document the rationale for each determination. ({isUS ? "AU-C 320 / AU-C 450" : "CAS 320 / CAS 450"})
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* ── Preliminary Materiality ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Preliminary Materiality</span>
              <span title="Set the period dates and populate the table below to calculate overall materiality.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
              <Input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="h-8 text-sm w-44 pr-2"
              />
              <Input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="h-8 text-sm w-44 pr-2"
              />
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-muted/40 border-border">
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 11.5C12.6193 11.5 11.5 12.6193 11.5 14C11.5 15.3807 12.6193 16.5 14 16.5C15.3807 16.5 16.5 15.3807 16.5 14C16.5 12.6193 15.3807 11.5 14 11.5ZM14 11.5V5.66667C14 5.22464 13.8244 4.80072 13.5118 4.48816C13.1993 4.17559 12.7754 4 12.3333 4H9.83333M4 6.5C5.38071 6.5 6.5 5.38071 6.5 4C6.5 2.61929 5.38071 1.5 4 1.5C2.61929 1.5 1.5 2.61929 1.5 4C1.5 5.38071 2.61929 6.5 4 6.5ZM4 6.5V16.5" stroke="#A7B2C2" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
              <div className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                disabled
                className="h-8 text-sm opacity-50 cursor-not-allowed"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Refresh
              </Button>
            </div>
            <div className="px-6 py-5">
              {/* Main table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-muted border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Entity Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Basis for calculations</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                        {periodLabel}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Extrapolated period ($)</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Benchmark applied (%)</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Materiality CY ($)</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Materiality PY ($)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Comments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {entityRows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-2.5 align-top min-w-[160px]">
                          <TdSelect
                            value={row.entityName}
                            onChange={(v) => updateEntityRow(row.id, "entityName", v)}
                            options={ENTITY_TYPE_OPTIONS.map((e) => ({ value: e, label: e }))}
                            placeholder="Select type…"
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top min-w-[160px]">
                          <TdSelect
                            value={row.basis}
                            onChange={(v) => updateEntityRow(row.id, "basis", v)}
                            options={BASIS_OPTIONS.map((b) => ({ value: b, label: b }))}
                            placeholder="Select basis…"
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top text-right">
                          <TdInput
                            value={row.periodAmount}
                            onChange={(v) => updateEntityRow(row.id, "periodAmount", v.replace(/[^0-9.]/g, ""))}
                            placeholder="e.g. 12500000"
                            className="tabular-nums text-right"
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top text-right">
                          <TdInput
                            value={row.extrapolatedPeriod}
                            onChange={(v) => updateEntityRow(row.id, "extrapolatedPeriod", v.replace(/[^0-9.]/g, ""))}
                            placeholder="e.g. 12500000"
                            className="tabular-nums text-right"
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top w-28 text-right">
                          <TdInput
                            value={row.benchmarkPct}
                            onChange={(v) => updateEntityRow(row.id, "benchmarkPct", v.replace(/[^0-9.]/g, ""))}
                            placeholder="1.00"
                            className="tabular-nums text-right"
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top w-44 text-right">
                          <TdInput
                            value={formatDisplay(row.materialityCY)}
                            readOnly
                            className="tabular-nums text-right"
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top w-40 text-right">
                          <TdInput
                            value={row.materialityPY}
                            onChange={(v) => updateEntityRow(row.id, "materialityPY", v.replace(/[^0-9.]/g, ""))}
                            placeholder="e.g. 0.00"
                            className="tabular-nums text-right"
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top min-w-[180px]">
                          <TdInput
                            value={row.comments}
                            onChange={(v) => updateEntityRow(row.id, "comments", v)}
                            placeholder="Comments…"
                          />
                        </td>
                      </tr>
                    ))}
                    {/* Total row */}
                    <tr className="bg-muted/30 border-t border-border font-semibold">
                      <td className="px-4 py-2 text-xs font-semibold text-foreground" colSpan={2}>Total</td>
                      <td className="px-4 py-2 text-sm tabular-nums text-foreground text-right">{totalPeriod || "—"}</td>
                      <td className="px-4 py-2 text-sm tabular-nums text-foreground text-right">{totalExtrapolated || "—"}</td>
                      <td className="px-4 py-2 text-sm tabular-nums text-foreground text-right">{totalBenchmark || "—"}</td>
                      <td className="px-4 py-2 text-sm tabular-nums text-foreground text-right">{totalMatCY || "—"}</td>
                      <td className="px-4 py-2 text-sm tabular-nums text-foreground text-right">{totalMatPY || "—"}</td>
                      <td className="px-4 py-2" />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Clearly Trivial Misstatements footer — inside the same card */}
            <div className="border-t border-border px-4 py-3">
              <div className="flex items-center">
                <span className="text-sm text-foreground flex-1">Clearly trivial misstatements <span className="text-xs text-muted-foreground font-normal">({isUS ? "AU-C 450.A2" : "CAS 450.A2"})</span></span>
                <div className="flex items-center gap-8 mr-8">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">Threshold (%)</span>
                    <TdInput
                      value={ctThresholdPct}
                      onChange={(v) => setCtThresholdPct(v.replace(/[^0-9.]/g, ""))}
                      placeholder="5.00"
                      className="w-24 tabular-nums"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">Amount ($)</span>
                    <TdInput
                      value={ctAmount ? formatDisplay(ctAmount) : ""}
                      readOnly
                      className="w-32 tabular-nums"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Opening balances note */}
            <div className="border-t border-border px-4 py-3 flex items-start gap-2 bg-muted/20">
              <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">If overall materiality is lower than in previous audits, consider whether misstatements may exist in the opening balances.</p>
            </div>
          </div>

          {/* ── Performance Materiality ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Performance Materiality</span>
              <span title={`Reduces the risk that aggregate uncorrected and undetected misstatements exceed overall materiality. (${standardRef}.11)`}>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="px-6 py-5">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="py-2 text-sm text-muted-foreground w-56">% of Overall Materiality</td>
                    <td className="px-1 py-1 w-36">
                      <TdInput
                        value={pmPct}
                        onChange={(v) => setPmPct(v.replace(/[^0-9.]/g, ""))}
                        placeholder="70"
                        className="tabular-nums w-28"
                      />
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="py-2 text-sm text-muted-foreground">Performance Materiality ($)</td>
                    <td className="py-2 text-sm font-semibold tabular-nums text-foreground">
                      {pmAmount ? pmAmount : "—"}
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="py-2 text-sm text-muted-foreground align-top pt-3">Rationale</td>
                    <td className="px-2 py-2 w-full">
                      <Textarea
                        value={pmRationale}
                        onChange={(e) => setPmRationale(e.target.value)}
                        placeholder="Explain why this percentage was selected…"
                        className="min-h-[72px] text-sm resize-none bg-background border-border"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Intended Users ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Intended Users</span>
              <span title="Identify the primary users of the financial statements and the factors affecting their decision making.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-1/3">Users</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Factors affecting users decision making</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-16">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {intendedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-2.5 align-top">
                        <TdInput
                          value={u.user}
                          onChange={(v) =>
                            setIntendedUsers((prev) =>
                              prev.map((x) => (x.id === u.id ? { ...x, user: v } : x))
                            )
                          }
                          placeholder="Define user"
                        />
                      </td>
                      <td className="px-4 py-2.5 align-top">
                        <TdInput
                          value={u.factors}
                          onChange={(v) =>
                            setIntendedUsers((prev) =>
                              prev.map((x) => (x.id === u.id ? { ...x, factors: v } : x))
                            )
                          }
                          placeholder="Describe factors"
                        />
                      </td>
                      <td className="px-4 py-2.5 align-top text-center">
                        <button
                          onClick={() =>
                            setIntendedUsers((prev) => prev.filter((x) => x.id !== u.id))
                          }
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          disabled={intendedUsers.length === 1}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-border">
              <button
                onClick={() =>
                  setIntendedUsers((prev) => [...prev, { id: uid(), user: "", factors: "" }])
                }
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Row
              </button>
            </div>
          </div>

          {/* ── Qualitative Considerations ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Qualitative Considerations</span>
              <span title="Document any qualitative factors that influenced the materiality determination.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-1/2">Nature</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Impact</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-16">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {qualitative.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-2.5 align-top">
                        <TdInput
                          value={item.nature}
                          onChange={(v) =>
                            setQualitative((prev) =>
                              prev.map((x) => (x.id === item.id ? { ...x, nature: v } : x))
                            )
                          }
                          placeholder="Describe Nature"
                        />
                      </td>
                      <td className="px-4 py-2.5 align-top">
                        <TdInput
                          value={item.impact}
                          onChange={(v) =>
                            setQualitative((prev) =>
                              prev.map((x) => (x.id === item.id ? { ...x, impact: v } : x))
                            )
                          }
                          placeholder="Describe impact"
                        />
                      </td>
                      <td className="px-4 py-2.5 align-top text-center">
                        <button
                          onClick={() =>
                            setQualitative((prev) => prev.filter((x) => x.id !== item.id))
                          }
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          disabled={qualitative.length === 1}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-border">
              <button
                onClick={() =>
                  setQualitative((prev) => [...prev, { id: uid(), nature: "", impact: "" }])
                }
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Row
              </button>
            </div>
          </div>

          {/* ── Section B: Possible misstatements in qualitative disclosures ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">B. Possible Misstatements in Qualitative Disclosures</span>
              <span title="Identify any possible misstatements in qualitative F/S disclosures that could be material to intended users. Consider significant transactions, applicable framework, and nature of entity."><Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></span>
            </div>
            <div className="px-6 py-5">
              <p className="text-xs text-muted-foreground mb-2">Describe the nature of any qualitative disclosures that could be material to F/S users. ({isUS ? "AU-C 320 / ASC disclosures" : "CAS 320.A8"})</p>
              <Textarea value={qualDisclosures} onChange={(e) => setQualDisclosures(e.target.value)} className="min-h-[80px] text-sm resize-none" placeholder="Describe qualitative disclosures that could be material…" />
            </div>
          </div>

          {/* ── Section C Adjusted: Performance materiality for specific F/S areas ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">C. Adjusted Performance Materiality Levels</span>
              <span title="Set adjusted performance materiality for specific F/S areas with higher risk. Set at an amount lower than overall performance materiality."><Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">F/S Area or Disclosure</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider w-32">Amount ($)</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Reasoning</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider w-28">PY Amount ($)</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {adjPMRows.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-2.5 align-top"><TdInput value={row.area} onChange={(v) => setAdjPMRows(p => p.map(r => r.id === row.id ? {...r, area: v} : r))} placeholder="F/S area or disclosure" /></td>
                      <td className="px-4 py-2.5 align-top"><TdInput value={row.amount} onChange={(v) => setAdjPMRows(p => p.map(r => r.id === row.id ? {...r, amount: v.replace(/[^0-9.]/g,"")} : r))} placeholder="0" className="text-right tabular-nums" /></td>
                      <td className="px-4 py-2.5 align-top"><TdInput value={row.reasoning} onChange={(v) => setAdjPMRows(p => p.map(r => r.id === row.id ? {...r, reasoning: v} : r))} placeholder="Reasoning…" /></td>
                      <td className="px-4 py-2.5 align-top"><TdInput value={row.pyAmount} onChange={(v) => setAdjPMRows(p => p.map(r => r.id === row.id ? {...r, pyAmount: v.replace(/[^0-9.]/g,"")} : r))} placeholder="—" className="text-right tabular-nums" /></td>
                      <td className="px-2 py-2.5 align-top text-center"><button onClick={() => setAdjPMRows(p => p.filter(r => r.id !== row.id))} className="text-muted-foreground hover:text-destructive transition-colors" disabled={adjPMRows.length === 1}><Trash2 className="h-3.5 w-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-border flex items-center justify-between gap-4">
              <button onClick={() => setAdjPMRows(p => [...p, {id: uid(), area:"", amount:"", reasoning:"", pyAmount:""}])} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"><Plus className="h-4 w-4" />Add Row</button>
              {adjPMRows.length > 2 && (
                <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  If there are more than two F/S areas or disclosures requiring an adjusted performance materiality level, provide details on a supplementary work paper that cross-references to this form.
                </p>
              )}
            </div>
          </div>

          {/* ── Section D: Materiality for specific circumstances ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">D. Materiality for Specific Circumstances</span>
              <span title="Set lower materiality for specific classes of transactions, balances or disclosures where users are particularly sensitive. (CAS 320.10 and .A11-A12)"><Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Description / User Expectation</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider w-28">Amount ($)</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Reasoning</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-24">W/P Ref.</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider w-24">PY ($)</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {specMatRows.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-2.5 align-top"><TdInput value={row.description} onChange={(v) => setSpecMatRows(p => p.map(r => r.id === row.id ? {...r, description: v} : r))} placeholder="Describe specific circumstances…" /></td>
                      <td className="px-4 py-2.5 align-top"><TdInput value={row.amount} onChange={(v) => setSpecMatRows(p => p.map(r => r.id === row.id ? {...r, amount: v.replace(/[^0-9.]/g,"")} : r))} placeholder="0" className="text-right tabular-nums" /></td>
                      <td className="px-4 py-2.5 align-top"><TdInput value={row.reasoning} onChange={(v) => setSpecMatRows(p => p.map(r => r.id === row.id ? {...r, reasoning: v} : r))} placeholder="Reasoning…" /></td>
                      <td className="px-4 py-2.5 align-top"><TdInput value={row.wpRef} onChange={(v) => setSpecMatRows(p => p.map(r => r.id === row.id ? {...r, wpRef: v} : r))} placeholder="—" className="text-center" /></td>
                      <td className="px-4 py-2.5 align-top"><TdInput value={row.pyAmount} onChange={(v) => setSpecMatRows(p => p.map(r => r.id === row.id ? {...r, pyAmount: v.replace(/[^0-9.]/g,"")} : r))} placeholder="—" className="text-right tabular-nums" /></td>
                      <td className="px-2 py-2.5 align-top text-center"><button onClick={() => setSpecMatRows(p => p.filter(r => r.id !== row.id))} className="text-muted-foreground hover:text-destructive transition-colors" disabled={specMatRows.length === 1}><Trash2 className="h-3.5 w-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-border">
              <button onClick={() => setSpecMatRows(p => [...p, {id: uid(), description:"", amount:"", reasoning:"", wpRef:"", pyAmount:""}])} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"><Plus className="h-4 w-4" />Add Row</button>
            </div>
          </div>

          {/* ── Section E: Performance materiality for specific circumstances ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">E. Performance Materiality for Specific Circumstances</span>
              <span title="Performance materiality applied to the specific circumstances identified in Step D. (CAS 320.10-11 and .A13)"><Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider w-32">Amount ($)</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Reasoning</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-24">W/P Ref.</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider w-28">PY Amount ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-2.5 align-top"><TdInput value={specPMAmount} onChange={setSpecPMAmount} placeholder="0" className="text-right tabular-nums" /></td>
                    <td className="px-4 py-2.5 align-top"><TdInput value={specPMReasoning} onChange={setSpecPMReasoning} placeholder="Reasoning…" /></td>
                    <td className="px-4 py-2.5 align-top"><TdInput value={specPMWPRef} onChange={setSpecPMWPRef} placeholder="—" className="text-center" /></td>
                    <td className="px-4 py-2.5 align-top"><TdInput value={specPMPY} onChange={setSpecPMPY} placeholder="—" className="text-right tabular-nums" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Additional Comments ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Additional Comments</span>
            </div>
            <div className="px-6 py-5">
              <Textarea
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                placeholder="Add Comments"
                className="min-h-[80px] text-sm resize-none bg-background"
              />
            </div>
          </div>

          {/* ── Conclusion ── */}
          <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Conclusion</span>
              <span className="text-xs text-muted-foreground">— Document any changes in the materiality assessments and the final materiality on Form 335.</span>
            </div>
            <div className="px-6 py-5">
              <Textarea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                className="min-h-[72px] text-sm resize-none bg-background"
              />
            </div>
          </div>

          {/* Conclude button — bottom right */}
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setConcluded(true);
                toast.success("Materiality worksheet concluded");
              }}
              disabled={concluded}
            >
              {concluded ? "Worksheet concluded" : "Conclude worksheet"}
            </Button>
          </div>

        </div>
      </div>

      {/* Dialog */}
      <AddToMyTemplatesDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        checklist={{
          id: isUS ? "aud-us-mat-worksheet" : "aud-mat-worksheet",
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
