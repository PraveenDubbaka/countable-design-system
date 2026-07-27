import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Plus, Trash2, BookOpen, X } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { formatCurrency, type FsaBalance } from "@/lib/engagementContext";
import { WorksheetSignOff } from "@/components/WorksheetSignOff";
import { AutomationStateChip } from "@/components/demo/AutomationStateChip";
import { ProvenancePopover } from "@/components/demo/ProvenancePopover";
import { LukaStatusBar } from "@/components/demo/LukaStatusBar";
import { DEMO_PROVENANCE, DEMO_ENGAGEMENT_ID } from "@/components/demo/demoFixtureData";

// ── Types ──────────────────────────────────────────────────────────────────────

type HML = "H" | "M" | "L" | "";
type YN = "Y" | "N" | "NA" | "";
type YSN = "Y" | "S" | "N" | "";
type Assertion = "C" | "AV" | "E" | "P";
// Marker for an assertion cell:
// X = relevant assertion for SCOTABD (risk identified)
// O = selected assertion for material-only COTABD (no risk but reasonable possibility)
type AssertionMarker = "" | "X" | "O";

interface AssertionCell {
 marker: AssertionMarker;
 rmm: HML; // assessed RMM rating for the assertion (when X)
}

interface CotabdRow {
 id: string;
 fsa: string; // Financial statement area or COTABD name
 amount: string; // Current year amount
 material: YN; // Material (quantitatively or qualitatively)?
 materialBasis: "Quantitative" | "Qualitative" | "Both" | "";
 risk520Ref: string; // Cross-reference
 inherentRisk: HML; // From
 significantRisk: YN; // From
 controlRisk: HML; // From (H if not tested)
 assertions: Record<Assertion, AssertionCell>;
 auditResponse: string;
 procedures: string[];
 wpRef: RefDoc[];
}

interface StandbackItem {
 done: boolean;
 notes: string;
}

interface Data590 {
 entityName: string;
 periodEnd: string;
 auditFramework: string;
 overallMateriality: string;
 performanceMateriality: string;
 rows: CotabdRow[];

 standback: {
 a: StandbackItem;
 b: StandbackItem;
 c: StandbackItem;
 pscDone: YN;
 pscInitials: string;
 };

 overallConclusion: YSN;
 conclusionRationale: string;
 notes: string;

 preparedBy: string;
 preparedDate: string;
 reviewedBy: string;
 reviewedDate: string;

 concluded: boolean;
 concludedOn: string;
}

// ── Reference data ─────────────────────────────────────────────────────────────

const HML_OPTIONS: HML[] = ["H", "M", "L"];
const ASSERTIONS: Assertion[] = ["C", "AV", "E", "P"];
const ASSERTION_LABELS: Record<Assertion, string> = {
 C: "Completeness",
 AV: "Accuracy / Valuation",
 E: "Existence",
 P: "Presentation",
};



const DEFAULT_FSAS = [
 "Revenue",
 "Cost of Sales",
 "Operating Expenses",
 "Payroll & Benefits",
 "Cash & Bank",
 "Accounts Receivable",
 "Inventory",
 "Property, Plant & Equipment",
 "Accounts Payable",
 "Debt & Financing",
 "Equity",
];

const hmlBadge = (r: HML): string => {
 switch (r) {
 case "H": return "bg-red-50 text-red-700 border-red-200";
 case "M": return "bg-amber-50 text-amber-700 border-amber-200";
 case "L": return "bg-green-50 text-green-700 border-green-200";
 default: return "";
 }
};

// Classification of a row
function classifyRow(r: CotabdRow): { label: string; tone: string } {
 const anyX = ASSERTIONS.some(a => r.assertions[a].marker === "X");
 const isScotabd = r.significantRisk === "Y" || r.inherentRisk === "H" || r.inherentRisk === "M" || anyX;
 if (isScotabd) return { label: "SCOTABD", tone: "bg-red-50 text-red-700 border-red-200" };
 if (r.material === "Y") return { label: "Material only", tone: "bg-amber-50 text-amber-700 border-amber-200" };
 if (r.material === "N") return { label: "Not material", tone: "bg-muted text-muted-foreground border-border" };
 return { label: "—", tone: "bg-muted text-muted-foreground border-border" };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function uid(): string { return Math.random().toString(36).slice(2, 9); }

function emptyAssertions(): Record<Assertion, AssertionCell> {
 return {
 C: { marker: "", rmm: "" },
 AV: { marker: "", rmm: "" },
 E: { marker: "", rmm: "" },
 P: { marker: "", rmm: "" },
 };
}

function emptyRow(fsa = ""): CotabdRow {
 return {
 id: uid(), fsa, amount: "", material: "", materialBasis: "",
 risk520Ref: "", inherentRisk: "", significantRisk: "", controlRisk: "",
 assertions: emptyAssertions(),
 auditResponse: "", procedures: [], wpRef: [],
 };
}

function rowFromFsa(f: FsaBalance): CotabdRow {
 const row = emptyRow(f.fsa);
 row.amount = f.amount ? formatCurrency(f.amount) : "";
 row.material = f.amount > 0 ? "Y" : "";
 row.materialBasis = f.amount > 0 ? "Quantitative" : "";
 row.risk520Ref = f.risk520Ref ?? "";
 row.inherentRisk = f.inherentRisk;
 row.significantRisk = f.significantRisk;
 row.controlRisk = "H"; // not tested by default per CAS
 if (f.assertionsX) {
 for (const a of f.assertionsX) {
 row.assertions[a] = { marker: "X", rmm: f.inherentRisk };
 }
 }
 return row;
}

function buildDefault(): Data590 {
 return {
 entityName: "",
 periodEnd: "",
 auditFramework: "ASPE",
 overallMateriality: "",
 performanceMateriality: "",
 rows: [],
 standback: {
 a: { done: false, notes: "" },
 b: { done: false, notes: "" },
 c: { done: false, notes: "" },
 pscDone: "",
 pscInitials: "",
 },
 overallConclusion: "",
 conclusionRationale: "",
 notes: "",
 preparedBy: "", preparedDate: "",
 reviewedBy: "", reviewedDate: "",
 concluded: false, concludedOn: "",
 };
}

// Normalize loaded data to ensure shape matches current schema.
function normalize(saved: any): Data590 {
 const def = buildDefault();
 const merged: Data590 = {...def,...saved };
 if (!Array.isArray(merged.rows) || merged.rows.length === 0) merged.rows = def.rows;
 merged.rows = merged.rows.map((r: any) => ({
...emptyRow(),
 procedures: [] as string[],
...r,
 assertions: {...emptyAssertions(),...(r?.assertions ?? {}) },
 wpRef: Array.isArray(r?.wpRef) ? r.wpRef : [],
 }));
 merged.standback = {
 a: { done: !!saved?.standback?.a?.done, notes: saved?.standback?.a?.notes ?? "" },
 b: { done: !!saved?.standback?.b?.done, notes: saved?.standback?.b?.notes ?? "" },
 c: { done: !!saved?.standback?.c?.done, notes: saved?.standback?.c?.notes ?? "" },
 pscDone: saved?.standback?.pscDone ?? "",
 pscInitials: saved?.standback?.pscInitials ?? "",
 };
 return merged;
}

// ── Procedure library for 590 ──────────────────────────────────────────────────

interface ProcEntry590 { fsa: string; procedures: string[] }

const PROC_LIBRARY_590: ProcEntry590[] = [
 { fsa: "Revenue", procedures: [
   "Perform analytical procedures on revenue by product/service line and period; investigate variances.",
   "Test a sample of revenue transactions to contracts, invoices, and delivery/service completion evidence.",
   "Test revenue cut-off: review transactions in the final and first 10 business days around period-end.",
   "Test journal entries posted to revenue accounts for unusual or manual entries.",
   "Confirm significant revenue balances with customers where applicable.",
 ]},
 { fsa: "Cost of Sales", procedures: [
   "Reconcile cost of sales to inventory movements and trace to underlying purchase records.",
   "Test a sample of cost transactions to vendor invoices, purchase orders, and receiving records.",
   "Perform gross margin analysis and investigate significant variances from prior period.",
   "Verify overhead allocation methods are consistent and appropriate.",
 ]},
 { fsa: "Operating Expenses", procedures: [
   "Perform analytical review of expenses by category against prior period and budget.",
   "Test a sample of expense transactions to supporting invoices and authorization evidence.",
   "Review prepaid expenses and accruals for completeness and proper cut-off.",
   "Identify and assess significant or unusual expense items.",
 ]},
 { fsa: "Payroll", procedures: [
   "Analytically review payroll by period, department, and employee category.",
   "Test a sample of payroll disbursements to timesheets, contracts, and authorized rates.",
   "Verify payroll source deductions (CPP, EI, income tax) are properly recorded and remitted.",
   "Review management compensation against board resolutions.",
   "Perform a headcount reconciliation for the period.",
 ]},
 { fsa: "Cash", procedures: [
   "Obtain bank confirmations for all significant accounts.",
   "Test bank reconciliations: trace reconciling items and investigate stale items.",
   "Review period-end bank statements for unusual transactions.",
   "Test petty cash and other cash funds by count or confirmation.",
 ]},
 { fsa: "Accounts Receivable", procedures: [
   "Obtain the aged AR listing and agree total to the general ledger.",
   "Confirm a sample of significant and/or unusual receivable balances.",
   "Review subsequent cash receipts to assess collectibility at period-end.",
   "Evaluate the reasonableness of the allowance for doubtful accounts.",
   "Investigate long-outstanding or unusual receivable balances.",
 ]},
 { fsa: "Inventory", procedures: [
   "Attend the physical inventory count; observe procedures, perform test counts, and trace to the final listing.",
   "Test the mathematical accuracy of the inventory listing and agree total to the general ledger.",
   "Test inventory unit costs to recent supplier invoices and compare to standard costs.",
   "Obtain and test management's obsolescence provision and NRV calculations.",
   "Identify slow-moving or zero-movement items and assess adequacy of any provision.",
 ]},
 { fsa: "Property", procedures: [
   "Agree the PPE continuity schedule to prior period and trace additions, disposals, and ending balances to the GL.",
   "Test a sample of additions to supporting documentation and verify capitalization criteria.",
   "Test repairs and maintenance expense items to confirm they are not capital in nature.",
   "Review disposals for completeness; trace proceeds and removal of net book value.",
   "Assess depreciation rates; recalculate depreciation for a sample of assets.",
   "Evaluate impairment indicators and review management's impairment assessment.",
 ]},
 { fsa: "Accounts Payable", procedures: [
   "Obtain the aged AP listing and agree total to the general ledger.",
   "Search for unrecorded liabilities: review subsequent disbursements and vendor invoices.",
   "Confirm significant vendor balances and reconcile to supplier statements.",
   "Test cut-off by reviewing purchases in the final and first days around period-end.",
 ]},
 { fsa: "Debt", procedures: [
   "Obtain a debt continuity schedule and agree opening balances to prior period working papers.",
   "Confirm outstanding debt balances, terms, interest rates, and covenants directly with lenders.",
   "Review loan agreements for restrictive covenants and confirm compliance at period-end.",
   "Recalculate interest expense for a sample of debt instruments and agree to the general ledger.",
   "Assess current vs. non-current classification based on maturity dates and covenant compliance.",
 ]},
 { fsa: "Equity", procedures: [
   "Obtain the equity continuity schedule and agree opening balances to prior period audited statements.",
   "Review articles of incorporation and minute book for authorized share capital changes.",
   "Verify share issuances or repurchases to supporting documentation and board authorization.",
   "Agree dividends declared to board approval and trace payment to bank statements.",
   "Recalculate retained earnings rollforward (opening + net income ± OCI − dividends).",
 ]},
];

function bestProcMatch590(fsa: string): ProcEntry590 | null {
 if (!fsa) return null;
 const n = fsa.toLowerCase();
 return PROC_LIBRARY_590.find(e => {
   const en = e.fsa.toLowerCase();
   return n.includes(en) || en.includes(n.split(/[\s,&]+/)[0]);
 }) ?? null;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function Audit590Worksheet() {
 const { engagementId } = useParams<{ engagementId: string }>();
 const isDemoEngagement = engagementId === DEMO_ENGAGEMENT_ID;
 const ctx = useEngagementContext();
 const storageKey = `audit-590-data-${engagementId ?? "default"}`;
 const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 const isFirstRender = useRef(true);

 const [data, setData] = useState<Data590>(() => {
 const saved = readJsonFromLocalStorage<any>(storageKey, null);
 const seededRows = ctx.fsas.map(rowFromFsa);
 const seededHeader = {
 entityName: ctx.entityName,
 periodEnd: ctx.periodEnd,
 auditFramework: ctx.isUS ? "US GAAP" : "ASPE",
 overallMateriality: formatCurrency(ctx.overallMateriality),
 performanceMateriality: formatCurrency(ctx.performanceMateriality),
 };
 if (!saved) return {...buildDefault(),...seededHeader, rows: seededRows };
 // Migrate legacy schema if present
 if (Array.isArray(saved.rows) && saved.rows[0] && "class" in saved.rows[0]) {
 return {
...buildDefault(),
...seededHeader,
 rows: seededRows,
 };
 }
 const normalized = normalize(saved);
 // Backfill any blank header fields from context (pre-fill, not override)
 return {
...normalized,
 entityName: normalized.entityName || seededHeader.entityName,
 periodEnd: normalized.periodEnd || seededHeader.periodEnd,
 auditFramework: normalized.auditFramework || seededHeader.auditFramework,
 overallMateriality: normalized.overallMateriality || seededHeader.overallMateriality,
 performanceMateriality: normalized.performanceMateriality || seededHeader.performanceMateriality,
 rows: normalized.rows.length ? normalized.rows : seededRows,
 };
 });

 useEffect(() => {
 if (isFirstRender.current) { isFirstRender.current = false; return; }
 if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
 saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
 }, [data, storageKey]);

 // Auto-populate procedures for any row with none that matches the library
 useEffect(() => {
 setData(d => {
 let changed = false;
 const rows = d.rows.map(row => {
 if ((row.procedures ?? []).length > 0) return row;
 const match = bestProcMatch590(row.fsa);
 if (!match) return row;
 changed = true;
 return { ...row, procedures: [...match.procedures] };
 });
 return changed ? { ...d, rows } : d;
 });
 }, []); // eslint-disable-line react-hooks/exhaustive-deps

 const locked = data.concluded;
 const [editingProcsId, setEditingProcsId] = useState<string | null>(null);

 function updateProcedure590(id: string, i: number, val: string) {
  setData(d => ({ ...d, rows: d.rows.map(r => r.id === id ? { ...r, procedures: r.procedures.map((p, j) => j === i ? val : p) } : r) }));
 }
 function addProcedure590(id: string) {
  setData(d => ({ ...d, rows: d.rows.map(r => r.id === id ? { ...r, procedures: [...r.procedures, ""] } : r) }));
 }
 function removeProcedure590(id: string, i: number) {
  setData(d => ({ ...d, rows: d.rows.map(r => r.id === id ? { ...r, procedures: r.procedures.filter((_, j) => j !== i) } : r) }));
 }


 // ── Row mutators ────────────────────────────────────────────────────────────
 function patchRow(id: string, patch: Partial<CotabdRow>) {
 setData(d => ({...d, rows: d.rows.map(r => r.id === id ? {...r,...patch } : r) }));
 }
 function patchAssertion(id: string, a: Assertion, patch: Partial<AssertionCell>) {
 setData(d => ({
...d,
 rows: d.rows.map(r => r.id !== id ? r : {
...r,
 assertions: {...r.assertions, [a]: {...r.assertions[a],...patch } },
 }),
 }));
 }
 function cycleMarker(id: string, a: Assertion) {
 const order: AssertionMarker[] = ["", "X", "O"];
 setData(d => ({
...d,
 rows: d.rows.map(r => {
 if (r.id !== id) return r;
 const current = r.assertions[a].marker;
 const next = order[(order.indexOf(current) + 1) % order.length];
 return {
...r,
 assertions: {
...r.assertions,
 [a]: {...r.assertions[a], marker: next, rmm: next === "X" ? r.assertions[a].rmm : "" },
 },
 };
 }),
 }));
 }
 function addRow() { setData(d => ({...d, rows: [...d.rows, emptyRow()] })); }
 function removeRow(id: string) {
 setData(d => ({...d, rows: d.rows.length > 1 ? d.rows.filter(r => r.id !== id) : d.rows }));
 }

 // ── Summary counts ──────────────────────────────────────────────────────────
 const counts = data.rows.reduce(
 (acc, r) => {
 const c = classifyRow(r);
 if (c.label === "SCOTABD") acc.scotabd++;
 else if (c.label === "Material only") acc.materialOnly++;
 else if (c.label === "Not material") acc.notMaterial++;
 if (r.significantRisk === "Y") acc.significant++;
 return acc;
 },
 { scotabd: 0, materialOnly: 0, notMaterial: 0, significant: 0 }
 );

 // ── Render ──────────────────────────────────────────────────────────────────

 return (
 <div className="flex flex-col h-full">
    {isDemoEngagement && (
      <LukaStatusBar
        isActive={true}
        message="Luka is pulling performance materiality from Form 420 and populating engagement scope…"
      />
    )}
 {/* Objective banner */}
 <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-3 shrink-0">
 <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
 <span className="text-base font-semibold text-primary whitespace-nowrap">Objective:</span>
 <p className="text-base text-muted-foreground flex-1 leading-relaxed">
 Perform engagement scoping for all classes of transactions, account balances and disclosures (COTABDs).
 Identify SCOTABDs and material-only COTABDs, assess RMM at the assertion level, summarise the audit
 response, and complete a stand-back assessment to ensure all risks have been identified.
 </p>
 </div>

 <div className="flex-1 overflow-y-auto p-6 space-y-5">

 {/* Materiality */}
 <div className="bg-card border border-border rounded-md p-5 grid grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-sm font-medium text-muted-foreground">Overall materiality ($)</label>
 <Input disabled={locked} value={data.overallMateriality}
 onChange={e => setData(d => ({...d, overallMateriality: e.target.value }))}
 placeholder="From" className="h-8 text-sm" />
 </div>
 <div className="space-y-1">
 <label className="text-sm font-medium text-muted-foreground">Performance materiality ($)</label>
 <Input disabled={locked} value={data.performanceMateriality}
 onChange={e => setData(d => ({...d, performanceMateriality: e.target.value }))}
 placeholder="From" className="h-8 text-sm" />
 {isDemoEngagement && (
   <div className="flex items-center gap-2 mt-1">
     <AutomationStateChip state="auto" />
     <ProvenancePopover data={DEMO_PROVENANCE.materiality}>
       <span className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer">Why this? ↗</span>
     </ProvenancePopover>
   </div>
 )}
 </div>
 </div>

 {/* Legend */}
 <div className="bg-card border border-border rounded-md p-4 grid grid-cols-2 gap-4 text-sm">
 <div>
 <p className="font-semibold text-foreground uppercase tracking-wider mb-2 text-[11px]">Assertions</p>
 <div className="grid grid-cols-2 gap-1.5">
 {ASSERTIONS.map(a => (
 <div key={a} className="flex items-center gap-2">
 <span className="px-1.5 py-0.5 rounded border border-border bg-muted/40 font-mono font-semibold text-primary text-[11px]">{a}</span>
 <span className="text-muted-foreground">{ASSERTION_LABELS[a]}</span>
 </div>
 ))}
 </div>
 </div>
 <div>
 <p className="font-semibold text-foreground uppercase tracking-wider mb-2 text-[11px]">Marker &amp; rating key</p>
 <ul className="space-y-1 text-muted-foreground">
 <li><span className="font-mono font-semibold text-red-700">X</span> — Relevant assertion (risk identified) — set RMM rating (H/M/L)</li>
 <li><span className="font-mono font-semibold text-amber-700">O</span> — Selected assertion for material-only COTABD (no RMM identified)</li>
 <li><span className="font-mono">H/M/L</span> — High / Moderate / Low</li>
 </ul>
 </div>
 </div>

 {/* Summary chips */}
 <div className="flex flex-wrap gap-2 text-sm">
 <span className="px-3 py-1 rounded-md border border-red-200 bg-red-50 text-red-700 font-medium">
 SCOTABD: <b>{counts.scotabd}</b>
 </span>
 <span className="px-3 py-1 rounded-md border border-amber-200 bg-amber-50 text-amber-700 font-medium">
 Material only: <b>{counts.materialOnly}</b>
 </span>
 <span className="px-3 py-1 rounded-md border border-border bg-muted text-muted-foreground font-medium">
 Not material: <b>{counts.notMaterial}</b>
 </span>
 <span className="px-3 py-1 rounded-md border border-primary/20 bg-primary/5 text-primary font-medium">
 Significant risks: <b>{counts.significant}</b>
 </span>
 <span className="px-3 py-1 rounded-md border border-border bg-card text-foreground font-medium">
 Total COTABDs: <b>{data.rows.length}</b>
 </span>
 </div>

 {/* Scoping table */}
 <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center justify-between">
 <div>
 <h3 className="text-sm font-semibold text-foreground">Classes of transactions, account balances &amp; disclosures</h3>
 <p className="text-[11px] text-muted-foreground mt-0.5">
 One row per FSA / COTABD. Pull inherent and significant risks, control risk Mark relevant assertions with X (RMM rating) or O (material-only consideration).
 </p>
 </div>
 {!locked && (
 <Button size="sm" variant="secondary" className="h-7 text-xs gap-1" onClick={addRow}>
 <Plus className="h-3.5 w-3.5" /> Add COTABD
 </Button>
 )}
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead className="sticky top-0 z-10">
 <tr className="bg-muted border-b border-border">
 <th rowSpan={2} className="px-3 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-10 border-r border-border">#</th>
 <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider border-r border-border" style={{ minWidth: 200 }}>FSA / COTABD</th>
 <th rowSpan={2} className="px-4 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider whitespace-nowrap border-r border-border" style={{ width: 130 }}>Current yr ($)</th>
 <th rowSpan={2} className="px-3 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider whitespace-nowrap border-r border-border" style={{ width: 90 }}>Material?</th>
 <th rowSpan={2} className="px-3 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider whitespace-nowrap border-r border-border" style={{ width: 110 }}>Basis</th>
 <th rowSpan={2} className="px-3 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider whitespace-nowrap border-r border-border" style={{ width: 110 }}>F520 ref.</th>
 <th rowSpan={2} className="px-3 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider whitespace-nowrap border-r border-border" style={{ width: 80 }}>IR</th>
 <th rowSpan={2} className="px-3 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider whitespace-nowrap border-r border-border" style={{ width: 80 }}>Sig. risk</th>
 <th rowSpan={2} className="px-3 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider whitespace-nowrap border-r border-border" style={{ width: 80 }}>CR</th>
 <th colSpan={4} className="px-3 py-2 text-center text-sm font-semibold text-foreground uppercase tracking-wider border-r border-border border-b border-border">Assertions / RMM</th>
 <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider border-r border-border" style={{ minWidth: 260 }}>Procedures</th>
 <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider border-r border-border" style={{ minWidth: 220 }}>Audit response</th>
 <th rowSpan={2} className="px-3 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider whitespace-nowrap border-r border-border" style={{ width: 110 }}>Classification</th>
 <th rowSpan={2} className="px-3 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" style={{ width: 80 }}>W/P</th>
 {!locked && <th rowSpan={2} className="px-2 py-3 w-8" />}
 </tr>
 <tr className="bg-muted border-b border-border">
 {ASSERTIONS.map((a, idx) => (
 <th key={a}
 className={`px-2 py-2 text-center text-[11px] font-mono font-semibold text-primary ${idx === ASSERTIONS.length - 1 ? "border-r border-border" : ""}`}
 style={{ width: 78 }}>
 {a}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {data.rows.map((r, i) => {
 const cls = classifyRow(r);
 return (
 <tr key={r.id} className="hover:bg-muted/50 transition-colors align-top border-b border-border last:border-b-0">
 <td className="px-3 py-2 text-center font-mono">{i + 1}</td>
 <td className="px-3 py-2">
 <Input disabled={locked} value={r.fsa}
 onChange={e => patchRow(r.id, { fsa: e.target.value })}
 placeholder="FSA / COTABD"
 className="h-8 text-sm" />
 </td>
 <td className="px-3 py-2">
 <Input disabled={locked} value={r.amount}
 onChange={e => patchRow(r.id, { amount: e.target.value })}
 placeholder="$"
 className="h-8 text-sm text-right font-mono" />
 </td>
 <td className="px-3 py-2 text-center">
 <Select disabled={locked} value={r.material}
 onValueChange={v => patchRow(r.id, { material: v as YN })}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
 <SelectContent>
 <SelectItem value="Y" className="text-sm">Y</SelectItem>
 <SelectItem value="N" className="text-sm">N</SelectItem>
 <SelectItem value="NA" className="text-sm">N/A</SelectItem>
 </SelectContent>
 </Select>
 </td>
 <td className="px-3 py-2 text-center">
 <Select disabled={locked} value={r.materialBasis}
 onValueChange={v => patchRow(r.id, { materialBasis: v as CotabdRow["materialBasis"] })}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
 <SelectContent>
 <SelectItem value="Quantitative" className="text-sm">Quantitative</SelectItem>
 <SelectItem value="Qualitative" className="text-sm">Qualitative</SelectItem>
 <SelectItem value="Both" className="text-sm">Both</SelectItem>
 </SelectContent>
 </Select>
 </td>
 <td className="px-3 py-2">
 <Input disabled={locked} value={r.risk520Ref}
 onChange={e => patchRow(r.id, { risk520Ref: e.target.value })}
 placeholder="e.g. R-12"
 className="h-8 text-sm font-mono" />
 </td>
 <td className="px-3 py-2 text-center">
 <Select disabled={locked} value={r.inherentRisk}
 onValueChange={v => patchRow(r.id, { inherentRisk: v as HML })}>
 <SelectTrigger className={`h-8 text-sm ${hmlBadge(r.inherentRisk)}`}>
 <SelectValue placeholder="—" />
 </SelectTrigger>
 <SelectContent>
 {HML_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-sm">{o}</SelectItem>)}
 </SelectContent>
 </Select>
 </td>
 <td className="px-3 py-2 text-center">
 <Select disabled={locked} value={r.significantRisk}
 onValueChange={v => patchRow(r.id, { significantRisk: v as YN })}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
 <SelectContent>
 <SelectItem value="Y" className="text-sm">Y</SelectItem>
 <SelectItem value="N" className="text-sm">N</SelectItem>
 </SelectContent>
 </Select>
 </td>
 <td className="px-3 py-2 text-center">
 <Select disabled={locked} value={r.controlRisk}
 onValueChange={v => patchRow(r.id, { controlRisk: v as HML })}>
 <SelectTrigger className={`h-8 text-sm ${hmlBadge(r.controlRisk)}`}>
 <SelectValue placeholder="—" />
 </SelectTrigger>
 <SelectContent>
 {HML_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-sm">{o}</SelectItem>)}
 </SelectContent>
 </Select>
 </td>

 {/* Assertion cells */}
 {ASSERTIONS.map(a => {
 const cell = r.assertions[a];
 const tone =
 cell.marker === "X" ? "bg-red-50 border-red-200 text-red-700" :
 cell.marker === "O" ? "bg-amber-50 border-amber-200 text-amber-700" :
 "bg-card border-border text-muted-foreground";
 return (
 <td key={a} className="px-1.5 py-2 text-center">
 <div className="flex flex-col items-center gap-1">
 <button type="button" disabled={locked}
 onClick={() => cycleMarker(r.id, a)}
 title="Click to cycle: blank → X → O → blank"
 className={`w-7 h-7 rounded-md border font-mono font-semibold text-[12px] transition-colors hover:opacity-80 ${tone}`}>
 {cell.marker || "—"}
 </button>
 {cell.marker === "X" && (
 <Select disabled={locked} value={cell.rmm}
 onValueChange={v => patchAssertion(r.id, a, { rmm: v as HML })}>
 <SelectTrigger className={`h-6 text-[11px] px-1.5 ${hmlBadge(cell.rmm)}`}>
 <SelectValue placeholder="—" />
 </SelectTrigger>
 <SelectContent>
 {HML_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-sm">{o}</SelectItem>)}
 </SelectContent>
 </Select>
 )}
 </div>
 </td>
 );
 })}

 <td className="px-3 py-2 align-top" onClick={() => !locked && setEditingProcsId(r.id)}>
      {editingProcsId === r.id && !locked ? (
       <div className="space-y-1.5" onClick={e => e.stopPropagation()}>
        {r.procedures.map((p, i) => (
         <div key={i} className="flex items-start gap-1">
          <span className="mt-1.5 text-[10px] text-muted-foreground shrink-0 w-4 text-right">{i + 1}.</span>
          <textarea
           value={p}
           onChange={e => updateProcedure590(r.id, i, e.target.value)}
           className="flex-1 text-xs resize-none bg-transparent border-0 border-b border-border focus:outline-none focus:border-primary py-0.5 min-h-[40px]"
           rows={2}
          />
          <button onClick={() => removeProcedure590(r.id, i)} className="mt-1.5 text-muted-foreground hover:text-destructive shrink-0">
           <X className="h-3 w-3" />
          </button>
         </div>
        ))}
        <div className="flex gap-2 pt-1">
         <button onClick={() => addProcedure590(r.id)} className="flex items-center gap-1 text-xs text-primary hover:underline">
          <Plus className="h-3 w-3" />Add
         </button>
         <button onClick={() => setEditingProcsId(null)} className="text-sm text-muted-foreground hover:underline">Done</button>
        </div>
       </div>
      ) : (
       <div className="space-y-1 cursor-pointer min-h-[40px]">
        {r.procedures.length === 0 ? (
         <span className="text-sm text-muted-foreground italic flex items-center gap-1">
          <BookOpen className="h-3 w-3" />No procedures
         </span>
        ) : (
         r.procedures.map((p, i) => (
          <div key={i} className="flex items-start gap-1.5 text-xs text-foreground">
           <span className="text-muted-foreground shrink-0 mt-0.5">{i + 1}.</span>
           <span className="leading-snug">{p}</span>
          </div>
         ))
        )}
        {!locked && <span className="text-[10px] text-muted-foreground/60 block mt-1">Click to edit</span>}
       </div>
      )}
     </td>
     <td className="px-3 py-2">
      <Textarea disabled={locked} value={r.auditResponse}
      onChange={e => patchRow(r.id, { auditResponse: e.target.value })}
      placeholder="Summarise the audit response or cross-reference the detailed plan…"
      className="min-h-[60px] text-sm resize-none rounded-[10px]" />
     </td>
 <td className="px-3 py-2 text-center">
 <span className={`inline-block px-2 py-0.5 rounded-md border text-[11px] font-medium ${cls.tone}`}>
 {cls.label}
 </span>
 </td>
 <td className="px-3 py-2 text-center">
 <RefButton
 reference={r.wpRef}
 onAttach={doc => patchRow(r.id, { wpRef: [...r.wpRef, doc] })}
 onRemove={idx => patchRow(r.id, { wpRef: r.wpRef.filter((_, i2) => i2 !== idx) })}
 />
 </td>
 {!locked && (
 <td className="px-2 py-2 text-center">
 <button onClick={() => removeRow(r.id)} className="text-muted-foreground hover:text-destructive">
 <Trash2 className="h-3.5 w-3.5" />
 </button>
 </td>
 )}
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>

 {/* Stand-back assessment */}
 <div className="bg-card border border-border rounded-md p-5 space-y-3">
 <div>
 <h3 className="text-sm font-semibold text-foreground">Stand-back assessment</h3>
 <p className="text-[11px] text-muted-foreground mt-0.5">
 Review your risk assessment procedures and complete each check below before concluding.
 </p>
 </div>

 {([
 { key: "a" as const, label: "For each SCOTABD, ensure that all RMMs and relevant assertions have been identified." },
 { key: "b" as const, label: "Where a COTABD is material but not significant, determine the evaluation is still appropriate." },
 { key: "c" as const, label: "For any COTABD not identified as material or significant, determine the evaluation is still appropriate." },
 ]).map(item => {
 const value = data.standback[item.key];
 return (
 <div key={item.key} className="grid grid-cols-[1fr_280px] gap-3 items-start border-t border-border pt-3 first:border-t-0 first:pt-0">
 <label className="flex items-start gap-2 text-sm text-foreground">
 <input type="checkbox" disabled={locked} checked={value.done}
 onChange={e => setData(d => ({
...d, standback: {...d.standback, [item.key]: {...value, done: e.target.checked } },
 }))}
 className="mt-0.5" />
 <span><b className="font-mono mr-1">{item.key}.</b>{item.label}</span>
 </label>
 <Input disabled={locked} value={value.notes}
 onChange={e => setData(d => ({
...d, standback: {...d.standback, [item.key]: {...value, notes: e.target.value } },
 }))}
 placeholder="Notes / cross-reference"
 className="h-8 text-sm" />
 </div>
 );
 })}

 <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
 <div className="space-y-1">
 <label className="text-sm font-medium text-muted-foreground">PSC performed? (Y/N)</label>
 <Select disabled={locked} value={data.standback.pscDone}
 onValueChange={v => setData(d => ({...d, standback: {...d.standback, pscDone: v as YN } }))}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
 <SelectContent>
 <SelectItem value="Y" className="text-sm">Y</SelectItem>
 <SelectItem value="N" className="text-sm">N</SelectItem>
 <SelectItem value="NA" className="text-sm">N/A</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="space-y-1">
 <label className="text-sm font-medium text-muted-foreground">PSC initials</label>
 <Input disabled={locked} value={data.standback.pscInitials}
 onChange={e => setData(d => ({...d, standback: {...d.standback, pscInitials: e.target.value } }))}
 placeholder="e.g. JD"
 className="h-8 text-sm uppercase" />
 </div>
 </div>
 </div>

 {/* Overall conclusion */}
 <div className="bg-card border border-border rounded-md p-5 space-y-3">
 <h3 className="text-sm font-semibold text-foreground">Conclusion</h3>
 <p className="text-[11px] text-muted-foreground">
 All material COTABDs and SCOTABDs have been identified, assessed and an appropriate audit response developed.
 </p>
 <div className="grid grid-cols-3 gap-3">
 <div className="space-y-1">
 <label className="text-sm font-medium text-muted-foreground">Conclusion</label>
 <Select disabled={locked} value={data.overallConclusion}
 onValueChange={v => setData(d => ({...d, overallConclusion: v as YSN }))}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
 <SelectContent>
 <SelectItem value="Y" className="text-sm">Y — Scoping is complete &amp; appropriate</SelectItem>
 <SelectItem value="S" className="text-sm">S — Some matters require follow-up</SelectItem>
 <SelectItem value="N" className="text-sm">N — Scoping requires revision</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="col-span-2 space-y-1">
 <label className="text-sm font-medium text-muted-foreground">Rationale</label>
 <Input disabled={locked} value={data.conclusionRationale}
 onChange={e => setData(d => ({...d, conclusionRationale: e.target.value }))}
 placeholder="Briefly support the conclusion."
 className="h-8 text-sm" />
 </div>
 </div>
 </div>

 {/* Notes */}
 <div className="bg-card border border-border rounded-md p-5 space-y-2">
 <h3 className="text-sm font-semibold text-foreground">Notes</h3>
 <Textarea disabled={locked} value={data.notes}
 onChange={e => setData(d => ({...d, notes: e.target.value }))}
 placeholder="Additional observations, cross-references to Forms 410 / 520 / 550, follow-ups…"
 className="min-h-[90px] text-sm resize-none rounded-[10px]" />
 </div>

 {/* Sign-off (standard checklist sign-off) */}
 <WorksheetSignOff worksheetKey="audit-590" engagementId={engagementId} />

 {/* Conclude action */}
 <div className="flex justify-end pt-1">
 {locked ? (
 <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800 font-medium">
 Concluded on {data.concludedOn}
 </div>
 ) : (
 <Button size="sm" onClick={() => {
 const today = new Date().toISOString().slice(0, 10);
 const updated = {...data, concluded: true, concludedOn: today };
 setData(updated);
 writeJsonToLocalStorage(storageKey, updated);
 }}>
 Conclude worksheet
 </Button>
 )}
 </div>

 </div>
 </div>
 );
}
