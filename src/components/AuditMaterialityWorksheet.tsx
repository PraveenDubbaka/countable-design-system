import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, RefreshCw, Trash2, Plus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AddToMyTemplatesDialog } from "@/components/AddToMyTemplatesDialog";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { toast } from "sonner";

// ── Benchmarks (profit-oriented corporations & partnerships only) ─────────────

type BenchmarkBasis =
  | "grossRevenue"
  | "preTaxIncome"
  | "totalAssets"
  | "netAssets"
  | "totalExpenses";

const BENCHMARK_OPTIONS: { value: BenchmarkBasis; label: string }[] = [
  { value: "grossRevenue", label: "Gross Revenue" },
  { value: "preTaxIncome", label: "Pre-Tax Income (normalized)" },
  { value: "totalAssets", label: "Total Assets" },
  { value: "netAssets", label: "Net Assets / Equity" },
  { value: "totalExpenses", label: "Total Expenses" },
];

const SUGGESTED_RANGES: Record<BenchmarkBasis, string> = {
  grossRevenue: "0.5% – 1%",
  preTaxIncome: "3% – 5%",
  totalAssets: "0.5% – 1%",
  netAssets: "1% – 2%",
  totalExpenses: "0.5% – 1%",
};

// Income-statement flows annualize; balance-sheet positions are point-in-time.
const FLOW_BASES = new Set<BenchmarkBasis>(["grossRevenue", "preTaxIncome", "totalExpenses"]);

const REASON_OPTIONS = [
  "Related party transactions",
  "Regulatory compliance threshold",
  "Executive compensation",
  "Sensitive disclosures",
  "Other",
];

// ── Simulated data source (QuickBooks / Xero pull) ────────────────────────────

interface FinancialSnapshot {
  grossRevenue: number;
  preTaxIncome: number;
  totalAssets: number;
  netAssets: number;
  totalExpenses: number;
}

interface MockFinancials {
  entityName: string;
  availableThrough: string; // last transaction date in the connected source
  values: FinancialSnapshot; // year-to-date as of availableThrough
  fullYear: FinancialSnapshot; // actuals once the year is complete
}

const FINANCIALS: { ca: MockFinancials; us: MockFinancials } = {
  ca: {
    entityName: "Shipping Line Inc.",
    availableThrough: "2024-12-31",
    values: { grossRevenue: 12500000, preTaxIncome: 460000, totalAssets: 21800000, netAssets: 8400000, totalExpenses: 12040000 },
    fullYear: { grossRevenue: 16700000, preTaxIncome: 730000, totalAssets: 22400000, netAssets: 9100000, totalExpenses: 15970000 },
  },
  us: {
    entityName: "Harbor Freight Logistics LLC",
    availableThrough: "2024-09-30",
    values: { grossRevenue: 18400000, preTaxIncome: 1140000, totalAssets: 14600000, netAssets: 5400000, totalExpenses: 17260000 },
    fullYear: { grossRevenue: 24900000, preTaxIncome: 1310000, totalAssets: 15100000, netAssets: 5900000, totalExpenses: 23590000 },
  },
};

// Profit-oriented engagements only — NFP and government are out of scope.
const ENTITY_OPTIONS = ["Profit-oriented corporation", "Profit-oriented partnership"];

// ── Types ──────────────────────────────────────────────────────────────────────

interface BenchmarkRow {
  id: string;
  entity: string;
  basis: BenchmarkBasis | "";
  benchmarkValue: string; // manual value; ignored while the row is auto-filled
  valueIsManual: boolean;
  appliedPct: string;
  priorYear: string;
  comments: string;
}

interface SpecificRow {
  id: string;
  account: string;
  reason: string;
  amount: string;
  pmAmount: string;
  comments: string;
}

interface PersistedMaterialityData {
  // contract consumed by AuditScopeWorksheet / AuditPAPWorksheet — keep shapes
  overallMateriality: string;
  clearlyTrivial: string;
  performanceMateriality: string;
  performancePct: string;
  specificItems: SpecificRow[];
  refreshedOn: string | null;
  periodStart: string;
  periodEnd: string;
  // self-restore extras
  rows: BenchmarkRow[];
  selectedRowId: string | null;
  dataSource: "connected" | "none";
  materialityShift: boolean;
  pmPriorYear: string;
  pmComments: string;
  ctPct: string;
  specificEnabled: boolean;
  specificRows: SpecificRow[];
  preparedBy: string;
  preparedDate: string;
  reviewedBy: string;
  reviewedDate: string;
  conclusion: string;
  concluded: boolean;
  concludedBy: string;
  concludedOn: string;
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

function parseNum(s: string): number | null {
  const n = parseFloat(String(s).replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? null : n;
}

function fmtAmt(n: number | null): string {
  return n === null ? "—" : formatNum(n);
}

function monthsBetween(startISO: string, endISO: string): number {
  const start = new Date(startISO + "T00:00:00").getTime();
  const end = new Date(endISO + "T00:00:00").getTime();
  if (isNaN(start) || isNaN(end) || end <= start) return 0;
  return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24 * 30.4375)));
}

function fmtDate(iso: string): string {
  const dt = new Date(iso + "T00:00:00");
  if (isNaN(dt.getTime())) return iso;
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

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
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
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
  // Keyed inner component: variant switches remount cleanly and lazy
  // initializers re-run against the correct localStorage key.
  return <WorksheetInner key={isUS ? "us" : "ca"} isUS={isUS} />;
}

function defaultRows(fin: MockFinancials, entity: string): BenchmarkRow[] {
  return [
    { id: uid(), entity, basis: "grossRevenue", benchmarkValue: String(fin.values.grossRevenue), valueIsManual: false, appliedPct: "1.00", priorYear: "", comments: "" },
    { id: uid(), entity, basis: "preTaxIncome", benchmarkValue: String(fin.values.preTaxIncome), valueIsManual: false, appliedPct: "5.00", priorYear: "", comments: "" },
  ];
}

function WorksheetInner({ isUS }: { isUS: boolean }) {
  const fin = isUS ? FINANCIALS.us : FINANCIALS.ca;
  const storageKey = `audit-materiality-data-${isUS ? "us" : "ca"}`;
  const persisted = useMemo(
    () => readJsonFromLocalStorage<Partial<PersistedMaterialityData>>(storageKey, {}),
    [storageKey]
  );

  const seedRows = useMemo(
    () => defaultRows(fin, isUS ? "Profit-oriented partnership" : "Profit-oriented corporation"),
    [fin, isUS]
  );

  const [showAddDialog, setShowAddDialog] = useState(false);

  const [periodStart, setPeriodStart] = useState(persisted.periodStart ?? (isUS ? "2024-01-01" : "2024-04-01"));
  const [periodEnd, setPeriodEnd] = useState(persisted.periodEnd ?? (isUS ? "2024-12-31" : "2025-03-31"));

  const [dataSource, setDataSource] = useState<"connected" | "none">(persisted.dataSource ?? "connected");
  const [refreshedOn, setRefreshedOn] = useState<string | null>(persisted.refreshedOn ?? null);
  const [materialityShift, setMaterialityShift] = useState(persisted.materialityShift ?? false);

  const [rows, setRows] = useState<BenchmarkRow[]>(persisted.rows?.length ? persisted.rows : seedRows);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(
    persisted.selectedRowId !== undefined ? persisted.selectedRowId : (persisted.rows?.length ? persisted.rows : seedRows)[0]?.id ?? null
  );

  const [pmPct, setPmPct] = useState(persisted.performancePct ?? "70");
  const [pmPriorYear, setPmPriorYear] = useState(persisted.pmPriorYear ?? "");
  const [pmComments, setPmComments] = useState(persisted.pmComments ?? "");

  const [ctPct, setCtPct] = useState(persisted.ctPct ?? "5.00");

  const [specificEnabled, setSpecificEnabled] = useState(persisted.specificEnabled ?? false);
  const [specificRows, setSpecificRows] = useState<SpecificRow[]>(
    persisted.specificRows?.length
      ? persisted.specificRows
      : [{ id: uid(), account: "", reason: "", amount: "", pmAmount: "", comments: "" }]
  );

  const [preparedBy, setPreparedBy] = useState(persisted.preparedBy ?? "");
  const [preparedDate, setPreparedDate] = useState(persisted.preparedDate ?? "");
  const [reviewedBy, setReviewedBy] = useState(persisted.reviewedBy ?? "");
  const [reviewedDate, setReviewedDate] = useState(persisted.reviewedDate ?? "");
  const [conclusion, setConclusion] = useState(
    persisted.conclusion ??
      "I am satisfied that the engagement planning adequately addresses the areas in the financial statements where material misstatements are likely to arise"
  );
  const [concluded, setConcluded] = useState(persisted.concluded ?? false);
  const [concludedBy, setConcludedBy] = useState(persisted.concludedBy ?? "");
  const [concludedOn, setConcludedOn] = useState(persisted.concludedOn ?? "");

  const locked = concluded;
  const connected = dataSource === "connected";

  // ── Period & extrapolation ────────────────────────────────────────────────

  const availableThrough = refreshedOn ? periodEnd : fin.availableThrough;
  const totalMonths = monthsBetween(periodStart, periodEnd);
  const availableMonths = monthsBetween(periodStart, availableThrough);
  const isPartial =
    !refreshedOn &&
    availableThrough < periodEnd &&
    availableMonths > 0 &&
    totalMonths > 0 &&
    availableMonths < totalMonths;

  const autoValue = (basis: BenchmarkBasis): number =>
    refreshedOn ? fin.fullYear[basis] : fin.values[basis];

  const effectiveValue = (row: BenchmarkRow): number | null => {
    if (connected && row.basis && !row.valueIsManual) return autoValue(row.basis);
    return parseNum(row.benchmarkValue);
  };

  const extrapolatedValue = (row: BenchmarkRow, value: number | null): number | null => {
    if (!isPartial || value === null || !row.basis || !FLOW_BASES.has(row.basis)) return null;
    return (value / availableMonths) * totalMonths;
  };

  const rowCalc = (row: BenchmarkRow): { value: number | null; extrapolated: number | null; calc: number | null } => {
    const value = effectiveValue(row);
    const extrapolated = extrapolatedValue(row, value);
    const pct = parseNum(row.appliedPct);
    const base = extrapolated ?? value;
    const calc = pct === null || base === null ? null : (pct / 100) * base;
    return { value, extrapolated, calc };
  };

  const calcs = useMemo(
    () => new Map(rows.map((r) => [r.id, rowCalc(r)])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, dataSource, refreshedOn, isPartial, availableMonths, totalMonths]
  );

  const selectedRow = rows.find((r) => r.id === selectedRowId) ?? null;
  const overall = selectedRow ? calcs.get(selectedRow.id)?.calc ?? null : null;
  const pm = overall === null ? null : ((parseNum(pmPct) ?? NaN) / 100) * overall;
  const pmValid = pm !== null && !isNaN(pm) ? pm : null;
  const ct = overall === null ? null : ((parseNum(ctPct) ?? NaN) / 100) * overall;
  const ctValid = ct !== null && !isNaN(ct) ? ct : null;

  // Pre-tax income reliability check on the selected benchmark
  const preTaxUnreliable = (() => {
    if (!selectedRow || selectedRow.basis !== "preTaxIncome") return false;
    const value = calcs.get(selectedRow.id)?.value ?? null;
    if (value === null) return false;
    if (value < 0) return true;
    const revenueRef = connected
      ? autoValue("grossRevenue")
      : rows.map((r) => (r.basis === "grossRevenue" ? effectiveValue(r) : null)).find((v) => v !== null) ?? null;
    if (revenueRef === null || revenueRef <= 0) return false;
    return Math.abs(value) < 0.05 * revenueRef;
  })();

  // Column totals for the benchmark table footer
  const sumOrNull = (vals: (number | null)[]): number | null => {
    const nums = vals.filter((v): v is number => v !== null);
    return nums.length ? nums.reduce((a, b) => a + b, 0) : null;
  };
  const totalBenchmarkValue = sumOrNull(rows.map((r) => calcs.get(r.id)?.value ?? null));
  const totalExtrapolated = sumOrNull(rows.map((r) => calcs.get(r.id)?.extrapolated ?? null));
  const totalCalc = sumOrNull(rows.map((r) => calcs.get(r.id)?.calc ?? null));
  const totalPriorYear = sumOrNull(rows.map((r) => parseNum(r.priorYear)));

  const specificTotal = specificEnabled
    ? specificRows.reduce((sum, r) => sum + (parseNum(r.amount) ?? 0), 0)
    : 0;
  const specificCount = specificEnabled ? specificRows.filter((r) => parseNum(r.amount) !== null || r.account.trim()).length : 0;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const updateRow = (id: string, patch: Partial<BenchmarkRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = () =>
    setRows((prev) => [...prev, { id: uid(), entity: "", basis: "", benchmarkValue: "", valueIsManual: !connected, appliedPct: "", priorYear: "", comments: "" }]);

  const removeRow = (id: string) =>
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      if (selectedRowId === id) setSelectedRowId(next[0]?.id ?? null);
      return next;
    });

  const updateSpecific = (id: string, patch: Partial<SpecificRow>) =>
    setSpecificRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addSpecific = () =>
    setSpecificRows((prev) => [...prev, { id: uid(), account: "", reason: "", amount: "", pmAmount: "", comments: "" }]);

  const removeSpecific = (id: string) =>
    setSpecificRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));

  const handleRefresh = () => {
    if (refreshedOn || !connected) return;
    // before: calculated materiality per row under extrapolation
    const before = new Map(rows.map((r) => [r.id, rowCalc(r).calc]));
    // after: full-year actuals, no extrapolation, manual overrides cleared
    let shift = false;
    for (const r of rows) {
      if (!r.basis) continue;
      const pct = parseNum(r.appliedPct);
      const b = before.get(r.id);
      const after = pct === null ? null : (pct / 100) * fin.fullYear[r.basis];
      if (b != null && after != null && b !== 0 && Math.abs(after - b) / Math.abs(b) > 0.10) shift = true;
    }
    setRows((prev) => prev.map((r) => (r.basis ? { ...r, valueIsManual: false, benchmarkValue: String(fin.fullYear[r.basis as BenchmarkBasis]) } : r)));
    setRefreshedOn(todayISO());
    if (shift) setMaterialityShift(true);
    toast.success("Financial data refreshed with full-year actuals");
  };

  const handleConclude = () => {
    setConcludedBy(preparedBy || (isUS ? "L. Garcia, CPA" : "J. Smith, CPA"));
    setConcludedOn(todayISO());
    setConcluded(true);
    toast.success("Materiality worksheet concluded");
  };

  // ── Persistence ───────────────────────────────────────────────────────────

  const snapshot: PersistedMaterialityData = {
    overallMateriality: overall === null ? "" : formatNum(overall),
    clearlyTrivial: ctValid === null ? "" : formatNum(ctValid),
    performanceMateriality: pmValid === null ? "" : formatNum(pmValid),
    performancePct: pmPct,
    specificItems: specificEnabled ? specificRows : [],
    refreshedOn,
    periodStart,
    periodEnd,
    rows,
    selectedRowId,
    dataSource,
    materialityShift,
    pmPriorYear,
    pmComments,
    ctPct,
    specificEnabled,
    specificRows,
    preparedBy,
    preparedDate,
    reviewedBy,
    reviewedDate,
    conclusion,
    concluded,
    concludedBy,
    concludedOn,
  };
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;
  const snapJson = JSON.stringify(snapshot);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, snapshotRef.current), 300);
    return () => clearTimeout(t);
  }, [snapJson, storageKey]);

  const title = "PL1 — Materiality";
  const benchmarkLabel = (basis: BenchmarkBasis | "") =>
    BENCHMARK_OPTIONS.find((o) => o.value === basis)?.label ?? "";

  return (
    <div className="flex flex-col h-full">

      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Establish overall materiality, performance materiality, and the clearly trivial threshold for the audit
          and document the rationale for each determination.
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* ── Summary card ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-primary/[0.04] border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Materiality Summary</span>
              <span title="Final figures determined on this worksheet. These feed the audit strategy, risk assessment, and procedures.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Overall Materiality</div>
                <div className="text-lg font-semibold tabular-nums text-foreground">{overall === null ? "—" : `$${formatNum(overall)}`}</div>
                {selectedRow?.basis && <div className="text-[11px] text-muted-foreground">{benchmarkLabel(selectedRow.basis)} × {selectedRow.appliedPct || "—"}%</div>}
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Performance Materiality</div>
                <div className="text-lg font-semibold tabular-nums text-foreground">{pmValid === null ? "—" : `$${formatNum(pmValid)}`}</div>
                <div className="text-[11px] text-muted-foreground">{pmPct || "—"}% of overall</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Clearly Trivial Threshold</div>
                <div className="text-lg font-semibold tabular-nums text-foreground">{ctValid === null ? "—" : `$${formatNum(ctValid)}`}</div>
                <div className="text-[11px] text-muted-foreground">{ctPct || "—"}% of overall</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Specific Materiality</div>
                {specificEnabled && specificCount > 0 ? (
                  <>
                    <div className="text-lg font-semibold tabular-nums text-foreground">${formatNum(specificTotal)}</div>
                    <div className="text-[11px] text-muted-foreground">{specificCount} item{specificCount === 1 ? "" : "s"}</div>
                  </>
                ) : (
                  <div className="text-lg font-semibold text-muted-foreground">N/A</div>
                )}
              </div>
            </div>
          </div>

          {/* ── Overall Materiality ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-foreground">Overall Materiality</span>
              <span title="The highest amount of misstatement that could be present in the financial statements without affecting the decisions of users. Select the benchmark that best reflects what users of these statements focus on.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
              <Input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} readOnly={locked} className="h-8 text-sm w-40" />
              <span className="text-muted-foreground text-sm">→</span>
              <Input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} readOnly={locked} className="h-8 text-sm w-40" />
              <div className="flex-1" />
              {refreshedOn ? (
                <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" />Refreshed on {fmtDate(refreshedOn)}</Badge>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-sm"
                  disabled={!connected || locked}
                  onClick={handleRefresh}
                  title="Re-pull financial data from the connected source. Once the fiscal year is complete this replaces extrapolated figures with actuals."
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Refresh Data
                </Button>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Data source</span>
                <Switch
                  checked={connected}
                  onCheckedChange={(v) => setDataSource(v ? "connected" : "none")}
                  disabled={locked}
                  className="scale-75"
                />
              </div>
            </div>
            {materialityShift && (
              <div className="border-b border-border px-6 py-3 flex items-start gap-2 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-700">Materiality has changed. Please review and update your assessment.</p>
                <div className="flex-1" />
                {!locked && (
                  <button className="text-xs text-amber-700 underline hover:opacity-80" onClick={() => setMaterialityShift(false)}>Dismiss</button>
                )}
              </div>
            )}
            {!connected && (
              <div className="border-b border-border px-6 py-3 flex items-start gap-2 bg-muted/20">
                <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">Connect a data source or upload a trial balance to auto-populate financial benchmarks. All values below are manual entries.</p>
              </div>
            )}
            <div className="px-6 py-5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted border-b border-border">
                      <th className="px-3 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-16" title="Exactly one benchmark drives overall materiality.">Selected</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider min-w-[200px]">Entity Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider min-w-[190px]">Basis of Calculation</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" title={connected ? "Pulled automatically from the connected data source. Type to override." : "Manual entry"}>
                        <div>Benchmark Value ($)</div>
                        <div className="text-[10px] font-normal normal-case tracking-normal text-muted-foreground">{fmtDate(periodStart)} → {fmtDate(availableThrough)}</div>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" title="Partial-year flows annualized: (value ÷ available months) × total months. Balance-sheet amounts are not extrapolated.">Extrapolated ($)</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Suggested Range</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Applied (%)</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Calculated Materiality ($)</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Prior Year ($)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider min-w-[170px]">Comments</th>
                      {!locked && <th className="px-2 py-3 w-10" />}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.map((row) => {
                      const c = calcs.get(row.id) ?? { value: null, extrapolated: null, calc: null };
                      const isAuto = connected && !!row.basis && !row.valueIsManual;
                      return (
                        <tr key={row.id} className={`transition-colors ${row.id === selectedRowId ? "bg-primary/[0.03]" : "hover:bg-muted/50"}`}>
                          <td className="px-3 py-2.5 text-center align-middle">
                            <input
                              type="radio"
                              name={`overall-benchmark-${isUS ? "us" : "ca"}`}
                              checked={row.id === selectedRowId}
                              onChange={() => setSelectedRowId(row.id)}
                              disabled={locked}
                              className="h-4 w-4 accent-primary cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-2.5 align-top">
                            <TdSelect
                              value={row.entity}
                              onChange={(v) => updateRow(row.id, { entity: v })}
                              options={ENTITY_OPTIONS.map((e) => ({ value: e, label: e }))}
                              placeholder="Select entity…"
                              disabled={locked}
                            />
                          </td>
                          <td className="px-4 py-2.5 align-top">
                            <TdSelect
                              value={row.basis}
                              onChange={(v) => updateRow(row.id, { basis: v as BenchmarkBasis, valueIsManual: !connected })}
                              options={BENCHMARK_OPTIONS}
                              placeholder="Select basis…"
                              disabled={locked}
                            />
                          </td>
                          <td className="px-4 py-2.5 align-top text-right w-44">
                            <TdInput
                              value={isAuto ? formatNum(c.value ?? "") : row.benchmarkValue}
                              onChange={(v) => updateRow(row.id, { benchmarkValue: v.replace(/[^0-9.-]/g, ""), valueIsManual: true })}
                              readOnly={locked}
                              placeholder="e.g. 12500000"
                              className={`tabular-nums text-right ${isAuto ? "bg-muted/30" : ""}`}
                            />
                          </td>
                          <td className="px-4 py-2.5 align-middle text-right w-48 whitespace-nowrap">
                            {c.extrapolated !== null ? (
                              <span className="inline-flex items-center gap-2">
                                <span className="text-sm tabular-nums">{formatNum(c.extrapolated)}</span>
                                <Badge variant="warning" title={`Based on ${availableMonths} months of data extrapolated to ${totalMonths} months`}>Extrapolated</Badge>
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 align-middle text-center text-sm text-muted-foreground whitespace-nowrap">
                            {row.basis ? SUGGESTED_RANGES[row.basis] : "—"}
                          </td>
                          <td className="px-4 py-2.5 align-top text-right w-28">
                            <TdInput
                              value={row.appliedPct}
                              onChange={(v) => updateRow(row.id, { appliedPct: v.replace(/[^0-9.]/g, "") })}
                              readOnly={locked}
                              placeholder="1.00"
                              className="tabular-nums text-right"
                            />
                          </td>
                          <td className="px-4 py-2.5 align-middle text-right w-44">
                            <span className="text-sm font-semibold tabular-nums">{fmtAmt(c.calc)}</span>
                          </td>
                          <td className="px-4 py-2.5 align-top text-right w-36">
                            <TdInput
                              value={row.priorYear}
                              onChange={(v) => updateRow(row.id, { priorYear: v.replace(/[^0-9.]/g, "") })}
                              readOnly={locked}
                              placeholder="0.00"
                              className="tabular-nums text-right"
                            />
                          </td>
                          <td className="px-4 py-2.5 align-top">
                            <TdInput
                              value={row.comments}
                              onChange={(v) => updateRow(row.id, { comments: v })}
                              readOnly={locked}
                              placeholder="Comments…"
                            />
                          </td>
                          {!locked && (
                            <td className="px-2 py-2.5 align-middle text-center">
                              <button
                                onClick={() => removeRow(row.id)}
                                disabled={rows.length <= 1}
                                className="text-muted-foreground hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Remove row"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {/* Total footer */}
                    <tr className="bg-muted/30 border-t border-border font-semibold">
                      <td className="px-4 py-2 text-xs font-semibold text-foreground" colSpan={3}>Total</td>
                      <td className="px-4 py-2 text-sm tabular-nums text-foreground text-right">{totalBenchmarkValue === null ? "—" : formatNum(totalBenchmarkValue)}</td>
                      <td className="px-4 py-2 text-sm tabular-nums text-foreground text-right">{totalExtrapolated === null ? "—" : formatNum(totalExtrapolated)}</td>
                      <td className="px-4 py-2" />
                      <td className="px-4 py-2" />
                      <td className="px-4 py-2 text-sm tabular-nums text-foreground text-right">{totalCalc === null ? "—" : formatNum(totalCalc)}</td>
                      <td className="px-4 py-2 text-sm tabular-nums text-foreground text-right">{totalPriorYear === null ? "—" : formatNum(totalPriorYear)}</td>
                      <td className="px-4 py-2" />
                      {!locked && <td className="px-2 py-2" />}
                    </tr>
                  </tbody>
                </table>
              </div>
              {preTaxUnreliable && (
                <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-700">Pre-tax income may not be a reliable benchmark. Consider using Gross Revenue or Total Assets instead.</p>
                </div>
              )}
              {!locked && (
                <Button variant="outline" size="sm" className="h-8 text-sm mt-3" onClick={addRow}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Row
                </Button>
              )}
            </div>
            {/* Clearly trivial threshold — inside the same card */}
            <div className="border-t border-border px-4 py-3">
              <div className="flex items-center">
                <span className="text-sm text-foreground flex-1 pl-2">
                  Clearly trivial misstatements threshold
                  <span title="Misstatements below this amount are not accumulated during the audit. Typically 3–5% of overall materiality.">
                    <Info className="inline h-3.5 w-3.5 text-muted-foreground cursor-help ml-1.5 -mt-0.5" />
                  </span>
                </span>
                <div className="flex items-center gap-8 mr-8">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">Threshold (%)</span>
                    <TdInput
                      value={ctPct}
                      onChange={(v) => setCtPct(v.replace(/[^0-9.]/g, ""))}
                      readOnly={locked}
                      placeholder="5.00"
                      className="w-24 tabular-nums"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">Amount ($)</span>
                    <TdInput
                      value={ctValid === null ? "" : formatNum(ctValid)}
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
              <span title="An amount set below overall materiality so that misstatements which go undetected or uncorrected are unlikely to add up to more than overall materiality.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="px-6 py-5">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="py-2 text-sm text-muted-foreground w-56">Overall Materiality ($)</td>
                    <td className="py-2 text-sm font-semibold tabular-nums text-foreground">{overall === null ? "—" : formatNum(overall)}</td>
                  </tr>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="py-2 text-sm text-muted-foreground">Applied % of Overall</td>
                    <td className="px-1 py-1">
                      <div className="flex items-center gap-3">
                        <TdInput
                          value={pmPct}
                          onChange={(v) => setPmPct(v.replace(/[^0-9.]/g, ""))}
                          readOnly={locked}
                          placeholder="70"
                          className="tabular-nums w-28"
                        />
                        <span className="text-xs text-muted-foreground">Suggested: 50% – 75%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="py-2 text-sm text-muted-foreground">Performance Materiality ($)</td>
                    <td className="py-2 text-sm font-semibold tabular-nums text-foreground">{pmValid === null ? "—" : formatNum(pmValid)}</td>
                  </tr>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="py-2 text-sm text-muted-foreground">Prior Year ($)</td>
                    <td className="px-1 py-1">
                      <TdInput
                        value={pmPriorYear}
                        onChange={(v) => setPmPriorYear(v.replace(/[^0-9.]/g, ""))}
                        readOnly={locked}
                        placeholder="0.00"
                        className="tabular-nums w-40"
                      />
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="py-2 text-sm text-muted-foreground align-top pt-3">Comments</td>
                    <td className="px-2 py-2 w-full">
                      <Textarea
                        value={pmComments}
                        onChange={(e) => setPmComments(e.target.value)}
                        readOnly={locked}
                        placeholder="Explain why this percentage was selected…"
                        className="min-h-[72px] text-sm resize-none bg-background border-border"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-3 text-xs text-muted-foreground italic">
                Performance materiality is set below overall materiality to reduce the risk that uncorrected and undetected misstatements in total exceed overall materiality.
              </p>
            </div>
          </div>

          {/* ── Specific Materiality (conditional) ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Specific Materiality</span>
              <span title="Lower thresholds for particular accounts or disclosures where smaller misstatements could influence users — for example related party transactions or amounts tied to a compliance limit.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
              <Badge variant="info" className="font-normal">Optional</Badge>
              <div className="flex-1" />
              <span className="text-xs text-muted-foreground">Apply specific materiality to certain accounts or disclosures?</span>
              <Switch
                checked={specificEnabled}
                onCheckedChange={setSpecificEnabled}
                disabled={locked}
                className="scale-75"
              />
            </div>
            {specificEnabled ? (
              <div className="px-6 py-5">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider min-w-[200px]">Account / Disclosure</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider min-w-[210px]">Reason</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Specific Materiality ($)</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" title="Set below the specific materiality amount, the same way performance materiality sits below overall materiality.">Specific Performance ($)</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider min-w-[170px]">Comments</th>
                        {!locked && <th className="px-2 py-3 w-10" />}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {specificRows.map((row) => (
                        <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-2.5 align-top">
                            <TdInput
                              value={row.account}
                              onChange={(v) => updateSpecific(row.id, { account: v })}
                              readOnly={locked}
                              placeholder="e.g. Related party transactions"
                            />
                          </td>
                          <td className="px-4 py-2.5 align-top">
                            <TdSelect
                              value={row.reason}
                              onChange={(v) => updateSpecific(row.id, { reason: v })}
                              options={REASON_OPTIONS.map((r) => ({ value: r, label: r }))}
                              placeholder="Select reason…"
                              disabled={locked}
                            />
                          </td>
                          <td className="px-4 py-2.5 align-top text-right w-44">
                            <TdInput
                              value={row.amount}
                              onChange={(v) => updateSpecific(row.id, { amount: v.replace(/[^0-9.]/g, "") })}
                              readOnly={locked}
                              placeholder="0.00"
                              className="tabular-nums text-right"
                            />
                          </td>
                          <td className="px-4 py-2.5 align-top text-right w-44">
                            <TdInput
                              value={row.pmAmount}
                              onChange={(v) => updateSpecific(row.id, { pmAmount: v.replace(/[^0-9.]/g, "") })}
                              readOnly={locked}
                              placeholder="0.00"
                              className="tabular-nums text-right"
                            />
                          </td>
                          <td className="px-4 py-2.5 align-top">
                            <TdInput
                              value={row.comments}
                              onChange={(v) => updateSpecific(row.id, { comments: v })}
                              readOnly={locked}
                              placeholder="Comments…"
                            />
                          </td>
                          {!locked && (
                            <td className="px-2 py-2.5 align-middle text-center">
                              <button
                                onClick={() => removeSpecific(row.id)}
                                disabled={specificRows.length <= 1}
                                className="text-muted-foreground hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Remove row"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!locked && (
                  <Button variant="outline" size="sm" className="h-8 text-sm mt-3" onClick={addSpecific}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Add Row
                  </Button>
                )}
              </div>
            ) : (
              <div className="px-6 py-4">
                <p className="text-xs text-muted-foreground">No specific materiality applied. Turn the toggle on if smaller misstatements in particular accounts or disclosures could influence users of the financial statements.</p>
              </div>
            )}
          </div>

          {/* ── Conclusion ── */}
          <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Conclusion</span>
              <span className="text-xs text-muted-foreground">— Document any later changes in the materiality assessments and the final materiality on the summary of misstatements.</span>
            </div>
            <div className="px-6 py-5">
              <Textarea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                readOnly={locked}
                className="min-h-[72px] text-sm resize-none bg-background"
              />
            </div>
          </div>

          {/* ── Sign-off footer ── */}
          <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-4 bg-muted/20">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Prepared by:</span>
                  <Input
                    className="h-8 text-sm flex-1"
                    value={preparedBy}
                    onChange={(e) => setPreparedBy(e.target.value)}
                    readOnly={locked}
                    placeholder="Name"
                  />
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Date:</span>
                  <Input
                    type="date"
                    className="h-8 text-sm w-36"
                    value={preparedDate}
                    onChange={(e) => setPreparedDate(e.target.value)}
                    readOnly={locked}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Reviewed by:</span>
                  <Input
                    className="h-8 text-sm flex-1"
                    value={reviewedBy}
                    onChange={(e) => setReviewedBy(e.target.value)}
                    readOnly={locked}
                    placeholder="Name"
                  />
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Date:</span>
                  <Input
                    type="date"
                    className="h-8 text-sm w-36"
                    value={reviewedDate}
                    onChange={(e) => setReviewedDate(e.target.value)}
                    readOnly={locked}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Concluded banner / Conclude button */}
          {concluded ? (
            <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              <p className="text-sm text-green-700">
                Concluded by <span className="font-semibold">{concludedBy}</span>{concludedOn ? ` on ${fmtDate(concludedOn)}` : ""}. This worksheet is read-only.
              </p>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button onClick={handleConclude}>Conclude worksheet</Button>
            </div>
          )}

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
