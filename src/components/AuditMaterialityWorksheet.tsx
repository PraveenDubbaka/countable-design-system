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
  if (readOnly) {
    return (
      <div className={`h-8 px-2 flex items-center text-sm bg-muted/40 text-foreground font-medium tabular-nums ${className}`}>
        {value ? value : <span className="text-muted-foreground font-normal">—</span>}
      </div>
    );
  }
  return (
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={`h-8 text-sm border-0 border-b border-border rounded-none focus:ring-1 focus:ring-primary/30 bg-transparent px-2 ${className}`}
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
      <SelectTrigger className="h-8 text-sm border-0 border-b border-border rounded-none focus:ring-1 focus:ring-primary/30 bg-transparent">
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

  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  // Preliminary Materiality table rows
  const [entityRows, setEntityRows] = useState<EntityRow[]>([
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

  // Total materiality CY (sum of all rows)
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
            </div>
            <div className="px-6 py-5">
              {/* Date row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex items-center">
                  <Input
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    className="h-8 text-sm pr-8 w-40"
                    placeholder="Start date"
                  />
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground absolute right-2 pointer-events-none" />
                </div>
                <div className="relative flex items-center">
                  <Input
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    className="h-8 text-sm pr-8 w-40"
                    placeholder="End date"
                  />
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground absolute right-2 pointer-events-none" />
                </div>
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

              {/* Main table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-muted border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Entity Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Basis for calculations</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                        {periodEnd ? new Date(periodEnd).getFullYear() : "Period"} ($)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Extrapolated period ($)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Benchmark applied (%)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Materiality CY ($) — CALCULATED</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Materiality PY ($) — for reference</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {entityRows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-2.5 align-top">
                          <TdInput
                            value={row.entityName}
                            onChange={(v) => updateEntityRow(row.id, "entityName", v)}
                            placeholder="Entity name"
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
                        <td className="px-4 py-2.5 align-top">
                          <TdInput
                            value={row.periodAmount}
                            onChange={(v) => updateEntityRow(row.id, "periodAmount", v.replace(/[^0-9.]/g, ""))}
                            placeholder="e.g. 12500000"
                            className="tabular-nums"
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top">
                          <TdInput
                            value={row.extrapolatedPeriod}
                            onChange={(v) => updateEntityRow(row.id, "extrapolatedPeriod", v.replace(/[^0-9.]/g, ""))}
                            placeholder="e.g. 12500000"
                            className="tabular-nums"
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top w-28">
                          <TdInput
                            value={row.benchmarkPct}
                            onChange={(v) => updateEntityRow(row.id, "benchmarkPct", v.replace(/[^0-9.]/g, ""))}
                            placeholder="1.00"
                            className="tabular-nums"
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top w-44">
                          <TdInput
                            value={row.materialityCY}
                            readOnly
                            className="tabular-nums"
                          />
                        </td>
                        <td className="px-4 py-2.5 align-top w-40">
                          <TdInput
                            value={row.materialityPY}
                            onChange={(v) => updateEntityRow(row.id, "materialityPY", v.replace(/[^0-9.]/g, ""))}
                            placeholder="e.g. 112000"
                            className="tabular-nums"
                          />
                        </td>
                        <td className="px-2 py-1 text-center">
                          <button
                            onClick={() => removeEntityRow(row.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            disabled={entityRows.length === 1}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Total row */}
                    <tr className="bg-muted/30 border-t border-border font-semibold">
                      <td className="px-3 py-2 text-xs text-muted-foreground" colSpan={5}>Total</td>
                      <td className="px-3 py-2 text-sm tabular-nums text-foreground">
                        {totalMatCY ? totalMatCY : "—"}
                      </td>
                      <td className="px-3 py-2 text-sm tabular-nums text-foreground">
                        {totalMatPY ? totalMatPY : "—"}
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-border">
              <button
                onClick={addEntityRow}
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Row
              </button>
            </div>
          </div>

          {/* ── Clearly Trivial Misstatements ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Clearly Trivial Misstatements</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-40">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-2.5 align-top text-sm text-muted-foreground">Threshold (%)</td>
                    <td className="px-4 py-2.5 align-top w-36">
                      <TdInput
                        value={ctThresholdPct}
                        onChange={(v) => setCtThresholdPct(v.replace(/[^0-9.]/g, ""))}
                        placeholder="5.00"
                        className="tabular-nums w-28"
                      />
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-2.5 align-top text-sm text-muted-foreground">Amount ($)</td>
                    <td className="px-4 py-2.5 align-top text-sm font-semibold tabular-nums text-foreground">
                      {ctAmount ? ctAmount : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
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
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Conclusion</span>
            </div>
            <div className="px-6 py-5">
              <Textarea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                className="min-h-[72px] text-sm resize-none bg-background"
              />
              <div className="flex justify-end mt-4">
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
