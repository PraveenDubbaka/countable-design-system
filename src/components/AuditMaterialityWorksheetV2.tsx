import { useState, useCallback, useEffect, useRef } from "react";
import { writeJsonToLocalStorage } from "@/lib/safeJson";
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
import { DEMO_LUKA_ACTIONS } from "@/components/demo/demoFixtureData";
import { LukaStatusBar } from "@/components/demo/LukaStatusBar";
import { LukaTypingRow } from '@/components/demo/LukaTypingRow';
import { RefButton, RefDoc } from "@/components/RefButton";
import { AddToMyTemplatesDialog } from "@/components/AddToMyTemplatesDialog";
import { AttributedComment } from "@/components/ui/AttributedComment";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lukaSequentialFill } from "@/lib/lukaInlineFill";

// ── Types ──────────────────────────────────────────────────────────────────────

interface EntityRow {
 id: string;
 entityName: string;
 basis: string;
 periodAmount: string;
 extrapolatedPeriod: string;
 benchmarkPct: string;
 materialityCY: string; // legacy stored value; possible materiality is derived at render
 prevAmount: string; // previous period's BASIS amount (manual)
 basisOther: string; // free-text description when basis is "other"
 pctManual: boolean; // benchmark % entered manually instead of from the form range
 extrapManual: boolean; // "this period anticipated" overwritten by the user
 comments: string;
}

type EntityType = "profit" | "nfp";

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

// TB benchmark values — sourced from QBO connector via TrialBalance
const TB_CA = { grossRevenue: 12500000, profitBeforeTax: 460000, totalAssets: 21800000, totalExpenses: 12040000, netAssets: 8400000 };
const TB_US = { grossRevenue: 18400000, profitBeforeTax: 1003000, totalAssets: 13100000, totalExpenses: 17444000, netAssets: 3183000 };
const TB_NPM = { grossRevenue: 14200000, profitBeforeTax: 1140000, totalAssets: 9617340, totalExpenses: 13060000, netAssets: 4800000 };
type TBKey = keyof typeof TB_CA;

type BasisOption = { value: string; label: string; tbKey?: TBKey; range?: number[] };

const BASIS_OPTIONS_BY_TYPE: Record<EntityType, BasisOption[]> = {
 profit: [
 { value: "profitBeforeTax", label: "Income before tax (continuing ops, adjusted)", tbKey: "profitBeforeTax", range: [3, 4, 5, 6, 7] },
 { value: "grossRevenue", label: "Gross revenues", tbKey: "grossRevenue", range: [1, 2, 3] },
 { value: "other", label: "Other (describe)" },
 ],
 nfp: [
 { value: "nfpRevenues", label: "Total revenues", tbKey: "grossRevenue", range: [1, 2, 3] },
 { value: "nfpExpenses", label: "Total expenses", tbKey: "totalExpenses", range: [1, 2, 3] },
 { value: "other", label: "Other (describe)" },
 ],
};
const ALL_BASIS_OPTIONS: BasisOption[] = [...BASIS_OPTIONS_BY_TYPE.profit, ...BASIS_OPTIONS_BY_TYPE.nfp];
const findBasis = (v: string) => ALL_BASIS_OPTIONS.find(o => o.value === v);
const defaultPctFor = (basis: string) => (basis === "profitBeforeTax" ? "5.00" : "1.00");

const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");

// Months from a to b (fractional, by calendar months)
function monthsBetween(a: Date, b: Date): number {
 return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + (b.getDate() - a.getDate()) / 30;
}

// "This period anticipated": extrapolate period-to-date over the whole period while the period is still running
function anticipatedFor(row: EntityRow, periodStart: string, periodEnd: string, now: Date): { value: string; note: string } {
 if (row.extrapManual) return { value: row.extrapolatedPeriod, note: "Manual" };
 const ptd = parseFloat(String(row.periodAmount).replace(/[^0-9.]/g, ""));
 if (isNaN(ptd)) return { value: "", note: "" };
 const start = new Date(periodStart + "T00:00:00");
 const end = new Date(periodEnd + "T00:00:00");
 if (isNaN(start.getTime()) || isNaN(end.getTime())) return { value: row.periodAmount, note: "" };
 if (now >= end) return { value: row.periodAmount, note: "Period ended" };
 const elapsed = Math.max(1, Math.round(monthsBetween(start, now)));
 if (now < start) return { value: row.periodAmount, note: "Period not started" };
 const total = Math.max(1, Math.round(monthsBetween(start, new Date(end.getTime() + 86400000))));
 const value = ptd * total / elapsed;
 return { value: String(Math.round(value * 100) / 100), note: `${fmtInt(ptd)} x ${total} / ${elapsed} mo` };
}

const SEED_ROW_A = "mat-row-a";
const SEED_ROW_B = "mat-row-b";

const formatDisplay = (v: string) => {
 const n = parseFloat(String(v).replace(/,/g, ""));
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
 luka,
}: {
 value: string;
 onChange?: (v: string) => void;
 placeholder?: string;
 type?: string;
 readOnly?: boolean;
 className?: string;
 /** Value suggested by Luka (demo): purple border + tooltip until the user edits it */
 luka?: boolean;
}) {
 return (
 <Input
 type={type}
 readOnly={readOnly}
 value={value}
 onChange={(e) => onChange?.(e.target.value)}
 placeholder={placeholder}
 title={luka ? "Suggested by Luka" : undefined}
 className={`h-8 text-sm ${luka ? "border-[#8649F1] hover:border-[#8649F1] dark:border-[#8649F1] dark:hover:border-[#8649F1] focus:ring-[#8649F1]/30 focus-visible:!outline-[#8649F1] " : ""}${className}`}
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
 <SelectTrigger className="h-8 w-full min-w-0 text-sm">
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
 engagementId?: string;
}

export function AuditMaterialityWorksheetV2({ isUS = false, engagementId }: AuditMaterialityWorksheetProps) {
 const isDemoEngagement = engagementId === 'AUD-NPM-Dec312025';
 const [showAddDialog, setShowAddDialog] = useState(false);
 const [concluded, setConcluded] = useState(false);

 const [periodStart, setPeriodStart] = useState(isUS ? "2024-01-01" : "2024-04-01");
 const [periodEnd, setPeriodEnd] = useState(isUS ? "2024-12-31" : "2025-03-31");

 const TB = isDemoEngagement ? TB_NPM : (isUS ? TB_US : TB_CA);
 const entityLabel = isDemoEngagement ? "Northline Precision Manufacturing Inc." : (isUS ? "Harbor Freight LLC" : "Shipping Line Inc.");

 // Preliminary Materiality — two benchmark rows seeded from Trial Balance
 const [selectedRowId, setSelectedRowId] = useState(SEED_ROW_A);
 const [entityRows, setEntityRows] = useState<EntityRow[]>([
 {
 id: SEED_ROW_A,
 entityName: entityLabel,
 basis: "grossRevenue",
 periodAmount: String(TB.grossRevenue),
 extrapolatedPeriod: String(TB.grossRevenue),
 benchmarkPct: "1.00",
 materialityCY: calcMatCY(String(TB.grossRevenue), "1.00"),
 prevAmount: "",
 basisOther: "",
 pctManual: false,
 extrapManual: false,
 comments: "",
 },
 {
 id: SEED_ROW_B,
 entityName: entityLabel,
 basis: "profitBeforeTax",
 periodAmount: String(TB.profitBeforeTax),
 extrapolatedPeriod: String(TB.profitBeforeTax),
 benchmarkPct: "5.00",
 materialityCY: calcMatCY(String(TB.profitBeforeTax), "5.00"),
 prevAmount: "",
 basisOther: "",
 pctManual: false,
 extrapManual: false,
 comments: "",
 },
 ]);

 // Entity type drives the basis options
 const [entityType, setEntityType] = useState<EntityType>("profit");

 // A — previous / preliminary overall materiality rows
 const [prevMatAmount, setPrevMatAmount] = useState("");
 const [prevMatReasoning, setPrevMatReasoning] = useState("");
 const [prelimReasoning, setPrelimReasoning] = useState("");

 // C — previous performance materiality row
 const [pmPrevAmount, setPmPrevAmount] = useState("");
 const [pmPrevReasoning, setPmPrevReasoning] = useState("");

 // Preliminary materiality levels sign-off (F)
 const [signOff, setSignOff] = useState({ preparedBy: "", preparedDate: "", reviewedBy: "", reviewedDate: "" });

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
 : "Vessel impairment indicators — nature of impairment assessment and key assumptions (charter rate forecasts, useful lives) require qualitative disclosure. Foreign currency risk management policy disclosure under ASPE s.3856."
 );

 // Section C adjusted — Performance materiality for specific F/S areas
 interface AdjPMRow { id: string; area: string; amount: string; reasoning: string; pyAmount: string; pyReasoning?: string; }
 const initAdjPM: AdjPMRow[] = isUS ? [
 { id: uid(), area: "Revenue (ASC 606 — contract estimates)", amount: "92000", reasoning: "Higher risk of misstatement due to percentage-of-completion estimates. PM set at 50% of overall.", pyAmount: "" },
 { id: uid(), area: "ROU Assets & Lease Liabilities (ASC 842)", amount: "64000", reasoning: "First-year adoption — increased inherent risk. PM set at 35% of overall.", pyAmount: "" },
 ] : [
 { id: uid(), area: "Vessel PP&E (impairment)", amount: "62000", reasoning: "Significant judgment in impairment assessment. PM set at 50% of performance materiality.", pyAmount: "" },
 ];
 const [adjPMRows, setAdjPMRows] = useState<AdjPMRow[]>(initAdjPM);
 const [adjWPRef, setAdjWPRef] = useState<RefDoc[]>([]);

 // Section D — Materiality for specific circumstances
 interface SpecMatRow { id: string; description: string; amount: string; reasoning: string; wpRef: RefDoc[]; pyAmount: string; pyReasoning?: string; }
 const initSpecMat: SpecMatRow[] = isUS ? [
 { id: uid(), description: "Related party transactions (ASC 850) — Board member loans and management compensation", amount: "10000", reasoning: "Users (lenders) particularly sensitive to RPTs. Lower materiality applied to ensure completeness of disclosure.", wpRef: [{ name: "WP-RPT-01" }], pyAmount: "" },
 { id: uid(), description: "Going concern disclosures — elevated D/E ratio (2.71x) and covenant compliance", amount: "0", reasoning: "Qualitative — any indication of substantial doubt requires disclosure regardless of dollar amount.", wpRef: [{ name: "WP-GC-01" }], pyAmount: "" },
 ] : [
 { id: uid(), description: "Related party transactions — shareholder loans and management fees", amount: "5000", reasoning: "Bank covenant requires disclosure of all RPTs. Lower threshold applied for completeness.", wpRef: [{ name: "WP-RPT-01" }], pyAmount: "" },
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
 const [specPMPYReasoning, setSpecPMPYReasoning] = useState("");
 const [specPMWPRef, setSpecPMWPRef] = useState<RefDoc[]>([{ name: "WP-RPT-PM" }]);

 // Additional comments & conclusion
 const [additionalComments, setAdditionalComments] = useState("");
 const [conclusion, setConclusion] = useState(
 "I am satisfied that the engagement planning adequately addresses the areas in the financial statements where material misstatements are likely to arise"
 );

 const [lukaState, setLukaState] = useState<'idle' | 'loading' | 'done'>('idle');
 const [lukaFilledFields, setLukaFilledFields] = useState<Set<string>>(new Set());
 // Luka-suggested fields the user has edited in this session lose their purple border
 const [lukaEditedFields, setLukaEditedFields] = useState<Set<string>>(new Set());
 const markEdited = (id: string) => setLukaEditedFields(prev => (prev.has(id) ? prev : new Set(prev).add(id)));
 const [lukaHighlightFields, setLukaHighlightFields] = useState<Set<string>>(new Set());
 const matFillRef = useRef<HTMLTableRowElement>(null);
 function markLukaFilled(fieldId: string) {
   setLukaFilledFields(prev => new Set(prev).add(fieldId));
   setLukaHighlightFields(prev => new Set(prev).add(fieldId));
   setTimeout(() => setLukaHighlightFields(prev => { const n = new Set(prev); n.delete(fieldId); return n; }), 2000);
 }

 // ── Derived ──────────────────────────────────────────────────────────────────

 const patchRow = useCallback((id: string, patch: Partial<EntityRow>) => {
 setEntityRows((prev) => prev.map((row) => (row.id === id ? {...row,...patch } : row)));
 }, []);

 const updateEntityRow = useCallback(
 (id: string, field: keyof EntityRow, value: string) => patchRow(id, { [field]: value } as Partial<EntityRow>),
 [patchRow]
 );

 // Basis change: pull the matching TB amount (manual for "Other") and reset the % to the form range default when it no longer fits
 const pullBasis = (row: EntityRow, basis: string): Partial<EntityRow> => {
 const opt = findBasis(basis);
 const patch: Partial<EntityRow> = { basis, extrapManual: false };
 if (opt?.tbKey) patch.periodAmount = String(TB[opt.tbKey]);
 else patch.periodAmount = "";
 if (opt?.range) {
 if (!opt.range.includes(parseFloat(row.benchmarkPct))) patch.benchmarkPct = defaultPctFor(basis);
 patch.pctManual = false;
 } else {
 patch.pctManual = true;
 }
 return patch;
 };
 const handleBasisChange = (id: string, basis: string) => {
 setEntityRows((prev) => prev.map((row) => (row.id === id ? {...row,...pullBasis(row, basis) } : row)));
 };

 // Switching entity type swaps the basis lists; rows whose basis no longer exists take the next unused option of the new list
 const handleEntityTypeChange = (next: EntityType) => {
 if (next === entityType) return;
 setEntityType(next);
 setEntityRows((prev) => {
 const valid = BASIS_OPTIONS_BY_TYPE[next];
 const free = valid.filter(o => o.value !== "other" && !prev.some(r => r.basis === o.value));
 return prev.map((row) => {
 if (!row.basis || valid.some(o => o.value === row.basis)) return row;
 const target = free.shift();
 return target ? {...row,...pullBasis(row, target.value) } : {...row, basis: "", periodAmount: "", extrapManual: false };
 });
 });
 };

 const handleRefresh = () => {
 setEntityRows(prev => prev.map(row => {
 const opt = findBasis(row.basis);
 if (!opt?.tbKey) return {...row, extrapManual: false };
 return {...row, periodAmount: String(TB[opt.tbKey]), extrapManual: false };
 }));
 toast.success("Benchmarks refreshed from Trial Balance");
 };

 const addEntityRow = () => {
 setEntityRows((prev) => [
...prev,
 {
 id: uid(),
 entityName: entityLabel,
 basis: "",
 periodAmount: "",
 extrapolatedPeriod: "",
 benchmarkPct: "1.00",
 materialityCY: "",
 prevAmount: "",
 basisOther: "",
 pctManual: false,
 extrapManual: false,
 comments: "",
 },
 ]);
 };

 const removeEntityRow = (id: string) => {
 setEntityRows((prev) => {
 const next = prev.filter((r) => r.id !== id);
 if (id === selectedRowId && next.length > 0) setSelectedRowId(next[0].id);
 return next;
 });
 };

 // Derived per-row values: anticipated amount (extrapolated while the period runs) and possible materiality
 const now = new Date();
 const rows = entityRows.map((r) => {
 const ant = anticipatedFor(r, periodStart, periodEnd, now);
 return {...r, anticipated: ant.value, anticipatedNote: ant.note, possible: calcMatCY(ant.value || r.periodAmount, r.benchmarkPct) };
 });

 // Overall materiality = selected row's possible materiality (not a sum)
 const selectedRow = rows.find(r => r.id === selectedRowId) ?? rows[0];
 const overallMateriality = selectedRow?.possible ?? "";

 // Clearly trivial — flows from overall materiality
 const ctAmount = (() => {
 const m = parseFloat(overallMateriality.replace(/[^0-9.]/g, ""));
 const p = parseFloat(ctThresholdPct.replace(/[^0-9.]/g, ""));
 if (isNaN(m) || isNaN(p)) return "";
 return formatNum(m * p / 100);
 })();

 // Performance Materiality — flows from overall materiality
 const pmAmount = (() => {
 const m = parseFloat(overallMateriality.replace(/[^0-9.]/g, ""));
 const p = parseFloat(pmPct.replace(/[^0-9.]/g, ""));
 if (isNaN(m) || isNaN(p)) return "";
 return formatNum(m * p / 100);
 })();

 // Persist key derived values for cross-worksheet auto-population (e.g., 513)
 useEffect(() => {
 const key = `audit-materiality-data-v2-${isUS ? "us" : "ca"}`;
 writeJsonToLocalStorage(key, {
 overallMateriality,
 performanceMateriality: pmAmount,
 clearlyTrivial: ctAmount,
 });
 }, [isUS, overallMateriality, pmAmount, ctAmount]);

 const title = "Materiality";

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

 <LukaStatusBar
   isActive={isDemoEngagement}
   message={
     lukaState === 'loading'
       ? "Luka is populating materiality fields from Xero GL and prior file…"
       : lukaState === 'done'
       ? "Luka has populated 3 fields — review and confirm."
       : "Luka is populating information from Xero and prior file…"
   }
   actions={lukaState === 'idle' ? DEMO_LUKA_ACTIONS.generic.actions.map(a => ({
     ...a,
     onTrigger: () => {
       setLukaState('loading');
       lukaSequentialFill([
         { scrollRef: matFillRef as React.RefObject<HTMLElement>, set: () => {
             setEntityRows(prev => prev.map((r, i) => i === 0
               ? { ...r, periodAmount: '14,200,000.00', extrapolatedPeriod: '14,200,000.00', materialityCY: '142,000.00' }
               : r));
             markLukaFilled('mat-row-0-amount');
           }
         },
         { set: () => {
             setEntityRows(prev => prev.map((r, i) => i === 0
               ? { ...r, prevAmount: '13,800,000.00' }
               : r));
             markLukaFilled('mat-row-0-py');
           }
         },
         { set: () => {
             setEntityRows(prev => prev.map((r, i) => i === 0
               ? { ...r, comments: 'Revenue benchmark selected — manufacturing entity with volatile earnings; primary users are lender and shareholder (CAS 320.08).' }
               : r));
             markLukaFilled('mat-row-0-comments');
           }
         },
       ], () => setLukaState('done'));
     },
   })) : []}
 />

 {/* Objective bar */}

 <div className="flex-1 overflow-y-auto bg-muted/30">
 <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2">
 <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
 <span className="text-sm font-semibold text-primary whitespace-nowrap">Objective:</span>
 <ul className="text-sm text-muted-foreground flex-1 leading-relaxed list-disc pl-4 space-y-0.5">
 <li>Overall materiality, including possible misstatements in qualitative disclosures, based on the F/S users (CAS 320.10)</li>
 <li>Performance materiality to reduce the risk that aggregate uncorrected/undetected misstatements exceed overall materiality (CAS 320.11)</li>
 <li>Specific materiality and specific performance materiality where required (CAS 320.10, .A11-A12)</li>
 </ul>
 </div>
 <div className="p-6 space-y-4">

 {/* ── Intended Users ── */}
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
 <span className="text-sm font-semibold text-foreground">Principal Users of the F/S</span>
 <Tooltip>
 <TooltipTrigger asChild>
 <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
 </TooltipTrigger>
 <TooltipContent>Identify the primary users of the financial statements and the factors affecting their decision making.</TooltipContent>
 </Tooltip>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="sticky top-0 z-10">
 <tr className="bg-muted border-b border-border">
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider w-1/3">Users</th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider">Factors that would influence users' decision-making
 <span className="mt-0.5 block text-xs font-normal normal-case tracking-normal text-muted-foreground">Consider key F/S areas and disclosures, laws/regulations and other matters</span>
 </th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider w-16">Action</th>
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
 prev.map((x) => (x.id === u.id ? {...x, user: v } : x))
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
 prev.map((x) => (x.id === u.id ? {...x, factors: v } : x))
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
 <Button
 size="sm"
 variant="outline"
 className="h-7 text-xs gap-1"
 onClick={() => setIntendedUsers((prev) => [...prev, { id: uid(), user: "", factors: "" }])}
 >
 <Plus className="h-3.5 w-3.5" />
 Add Row
 </Button>
 </div>
 </div>

 {/* ── Preliminary Materiality ── */}
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
 <span className="text-sm font-semibold text-foreground">A. Overall Materiality</span>
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
 onClick={handleRefresh}
 className="h-8 text-sm"
 >
 <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
 Refresh
 </Button>
 </div>
 <p className="px-6 pt-3 pb-1 text-sm text-muted-foreground">Use professional judgment to set the highest amount of misstatement that could be included in the F/S without affecting the economic decisions of the users identified above.</p>
 <div className="px-6 py-3 border-b border-border flex items-center gap-3">
 <span className="text-sm text-muted-foreground">Entity type</span>
 <Tabs value={entityType} onValueChange={(v) => handleEntityTypeChange(v as EntityType)}>
 <TabsList className="h-8">
 <TabsTrigger value="profit" className="text-xs px-3">Profit-oriented</TabsTrigger>
 <TabsTrigger value="nfp" className="text-xs px-3">Not-for-profit</TabsTrigger>
 </TabsList>
 </Tabs>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="sticky top-0 z-10">
 <tr className="bg-muted border-b border-border">
 <th className="px-3 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-10">Primary</th>
 <th className="px-2 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider">Basis for Calculations</th>
 <th className="px-2 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[140px]">Period to date ($)</th>
 <th className="px-2 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[140px]">This period anticipated ($)</th>
 <th className="px-2 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[140px]">Previous period ($)</th>
 <th className="px-2 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider w-28">Benchmark % applied</th>
 <th className="px-2 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[140px]">Possible materiality ($)</th>
 <th className="px-2 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider w-full">Comments</th>
 <th className="px-2 py-3 w-8" />
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {rows.map((row, rowIdx) => {
 const isSelected = row.id === selectedRowId;
 const basisOpt = findBasis(row.basis);
 const range = basisOpt?.range;
 const pctNum = parseFloat(row.benchmarkPct);
 const showPctInput = !range || row.pctManual || !range.includes(pctNum);
 return (
 <tr
 key={row.id}
 ref={rowIdx === 0 ? matFillRef : undefined}
 className={`transition-colors ${isSelected ? "bg-primary/[0.04]" : "hover:bg-muted/50"}${
   isDemoEngagement && rowIdx === 0 && lukaHighlightFields.has('mat-row-0-amount')
     ? ' border-l-2 border-violet-400 bg-violet-50/40'
     : ''
 }`}
 >
 <td className="px-3 py-2.5 align-top text-center">
 <div className="flex h-8 items-center justify-center">
 <input
 type="radio"
 name="primary-benchmark"
 checked={isSelected}
 onChange={() => setSelectedRowId(row.id)}
 className="h-4 w-4 accent-primary cursor-pointer"
 />
 </div>
 </td>
 <td className="px-2 py-2.5 align-top w-[220px] min-w-[220px] max-w-[220px]">
 <TdSelect
 value={row.basis}
 onChange={(v) => handleBasisChange(row.id, v)}
 options={BASIS_OPTIONS_BY_TYPE[entityType]}
 placeholder="Select basis…"
 />
 {row.basis === "other" && (
 <TdInput
 value={row.basisOther}
 onChange={(v) => updateEntityRow(row.id, "basisOther", v)}
 placeholder="Describe basis…"
 className="mt-1.5"
 />
 )}
 </td>
 <td className="px-2 py-2.5 align-top min-w-[140px] text-right">
 <LukaTypingRow filled={isDemoEngagement && lukaFilledFields.has('mat-row-0-amount')}>
 <TdInput
 value={row.periodAmount ? formatDisplay(row.periodAmount) : ""}
 onChange={(v) => { markEdited(`ptd-${row.id}`); updateEntityRow(row.id, "periodAmount", v.replace(/[^0-9.]/g, "")); }}
 placeholder="0.00"
 className="w-full px-2 tabular-nums text-right"
 luka={isDemoEngagement && !lukaEditedFields.has(`ptd-${row.id}`) && (row.basis === 'grossRevenue' || (rowIdx === 0 && lukaFilledFields.has('mat-row-0-amount')))}
 />
 </LukaTypingRow>
 </td>
 <td className="px-2 py-2.5 align-top min-w-[140px] text-right">
 <TdInput
 value={row.anticipated ? formatDisplay(row.anticipated) : ""}
 onChange={(v) => {
   const cleaned = v.replace(/[^0-9.]/g, "");
   patchRow(row.id, cleaned ? { extrapolatedPeriod: cleaned, extrapManual: true } : { extrapolatedPeriod: "", extrapManual: false });
 }}
 placeholder="0.00"
 className="w-full px-2 tabular-nums text-right"
 />
  {row.anticipatedNote && <p className="mt-1 text-xs text-muted-foreground text-right">{row.anticipatedNote}</p>}
 </td>
 <td className="px-2 py-2.5 align-top min-w-[140px] text-right">
 <LukaTypingRow filled={isDemoEngagement && lukaFilledFields.has('mat-row-0-py')}>
 <TdInput
 value={row.prevAmount ? formatDisplay(row.prevAmount) : ""}
 onChange={(v) => { markEdited(`prev-${row.id}`); updateEntityRow(row.id, "prevAmount", v.replace(/[^0-9.]/g, "")); }}
 placeholder="0.00"
 className="w-full px-2 tabular-nums text-right"
 luka={isDemoEngagement && !lukaEditedFields.has(`prev-${row.id}`) && rowIdx === 0 && lukaFilledFields.has('mat-row-0-py')}
 />
 </LukaTypingRow>
 </td>
 <td className="px-2 py-2.5 align-top w-28 text-right">
 {showPctInput ? (
 <TdInput
 value={row.benchmarkPct}
 onChange={(v) => patchRow(row.id, { benchmarkPct: v.replace(/[^0-9.]/g, ""), pctManual: true })}
 placeholder="0.00"
 className="tabular-nums text-right"
 />
 ) : (
 <TdSelect
 value={String(pctNum)}
 onChange={(v) => v === "manual" ? patchRow(row.id, { pctManual: true }) : patchRow(row.id, { benchmarkPct: Number(v).toFixed(2), pctManual: false })}
 options={[...range!.map(n => ({ value: String(n), label: `${n}%` })), { value: "manual", label: "Manual…" }]}
 />
 )}
 <p className="mt-1 text-xs text-muted-foreground text-right">
 {range ? <>Range {range[0]}–{range[range.length - 1]}%{showPctInput && <> · <button type="button" className="underline hover:text-foreground" onClick={() => patchRow(row.id, { benchmarkPct: range.includes(pctNum) ? row.benchmarkPct : defaultPctFor(row.basis), pctManual: false })}>Use range</button></>}</> : "Manual entry"}
 </p>
 </td>
 <td className="px-2 py-2.5 align-top min-w-[140px] text-right">
 <TdInput
 value={formatDisplay(row.possible)}
 readOnly
 className={`px-2 tabular-nums text-right${isSelected ? " font-semibold" : ""}`}
 />
 </td>
 <td className="px-2 py-2.5 align-top ">
 <LukaTypingRow filled={isDemoEngagement && lukaFilledFields.has('mat-row-0-comments')}>
 <TdInput
 value={row.comments}
 onChange={(v) => { markEdited(`comments-${row.id}`); updateEntityRow(row.id, "comments", v); }}
 placeholder="Comments…"
 luka={isDemoEngagement && !lukaEditedFields.has(`comments-${row.id}`) && rowIdx === 0 && lukaFilledFields.has('mat-row-0-comments')}
 />
 </LukaTypingRow>
 </td>
 <td className="px-2 py-2.5 align-top text-center">
 <div className="flex h-8 items-center justify-center">
 <button
 onClick={() => removeEntityRow(row.id)}
 className="text-muted-foreground hover:text-destructive transition-colors"
 disabled={entityRows.length === 1}
 >
 <Trash2 className="h-3.5 w-3.5" />
 </button>
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 <div className="px-6 py-3 border-t border-border">
 <Button size="sm" variant="secondary" className="h-7 text-xs gap-1" onClick={addEntityRow}>
 <Plus className="h-3.5 w-3.5" />
 Add Row
 </Button>
 </div>
 <div className="border-t border-border px-6 py-4">
 <table className="w-full text-sm">
 <thead>
 <tr>
 <th className="w-40" />
 <th className="px-2 pb-1 text-right text-xs font-medium text-muted-foreground w-56">Amount ($)</th>
 <th className="px-2 pb-1 text-left text-xs font-medium text-muted-foreground">Reasoning</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 <tr>
 <td className="py-2 text-sm text-muted-foreground">Previous period</td>
 <td className="px-2 py-1.5 w-56"><TdInput value={prevMatAmount ? formatDisplay(prevMatAmount) : ""} onChange={(v) => setPrevMatAmount(v.replace(/[^0-9.]/g, ""))} placeholder="0.00" className="tabular-nums text-right" /></td>
 <td className="px-2 py-1.5"><TdInput value={prevMatReasoning} onChange={setPrevMatReasoning} placeholder="Reasoning…" /></td>
 </tr>
 <tr>
 <td className="py-2 text-sm font-semibold text-primary">Preliminary</td>
 <td className="px-2 py-1.5 w-56">
 <TdInput value={overallMateriality ? formatDisplay(overallMateriality) : "—"} readOnly className="w-full tabular-nums text-right font-semibold" luka={isDemoEngagement && !!overallMateriality} />
 </td>
 <td className="px-2 py-1.5"><TdInput value={prelimReasoning} onChange={setPrelimReasoning} placeholder="Reasoning…" /></td>
 </tr>
 </tbody>
 </table>
 </div>
 {/* Opening balances note */}
 <div className="border-t border-border px-4 py-3 flex items-start gap-2 bg-muted/20">
 <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
 <p className="text-sm text-muted-foreground">If overall materiality is lower than in previous audits, consider whether misstatements may exist in the opening balances.</p>
 </div>
 </div>

 {/* ── Section B: Possible misstatements in qualitative disclosures ── */}
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
 <span className="text-sm font-semibold text-foreground">B. Possible Misstatements in Qualitative Disclosures</span>
 </div>
 <p className="px-6 pt-3 pb-1 text-sm text-muted-foreground">Identify possible misstatements in qualitative disclosures that could be material to the intended users. Consider the entity's circumstances (such as a significant business combination), the applicable financial reporting framework and disclosures related to the nature of the entity.</p>
 <div className="px-6 py-5">
 <AttributedComment value={qualDisclosures} onChange={v => setQualDisclosures(v)} storageKey={`materiality-qualDisc-v2-${isUS ? "us" : "ca"}`} placeholder="Describe qualitative disclosures that could be material…" className="min-h-[80px] text-sm resize-none" />
 </div>
 </div>

 {/* ── Performance Materiality ── */}
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
 <span className="text-sm font-semibold text-foreground">C. Performance Materiality</span>
 <Tooltip>
 <TooltipTrigger asChild>
 <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
 </TooltipTrigger>
 <TooltipContent>Reduces the risk that aggregate uncorrected and undetected misstatements exceed overall materiality.</TooltipContent>
 </Tooltip>
 </div>
 <div className="px-6 py-5">
 <p className="mb-3 text-sm text-muted-foreground">Set based on, but lower than, overall materiality — typically 60%–75%.</p>
 <p className="mb-3 text-sm text-muted-foreground">Consider expected misstatements this period, business and fraud risks (Form 520), risk assessment results and misstatements found in prior audits.</p>
 <table className="w-full text-sm">
 <tbody>
 <tr>
 <td className="py-2 text-sm text-muted-foreground w-40">% of Overall Materiality</td>
 <td className="px-2 py-1 w-56">
 <TdInput
 value={pmPct}
 onChange={(v) => setPmPct(v.replace(/[^0-9.]/g, ""))}
 placeholder="0"
 className="tabular-nums text-right"
 />
 </td>
 <td />
 </tr>
 </tbody>
 </table>
 <table className="w-full text-sm mt-3">
 <thead>
 <tr>
 <th className="w-40" />
 <th className="px-2 pb-1 text-right text-xs font-medium text-muted-foreground w-56">Amount ($)</th>
 <th className="px-2 pb-1 text-left text-xs font-medium text-muted-foreground">Reasoning</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 <tr>
 <td className="py-2 text-sm text-muted-foreground">Previous period</td>
 <td className="px-2 py-1.5 w-56"><TdInput value={pmPrevAmount ? formatDisplay(pmPrevAmount) : ""} onChange={(v) => setPmPrevAmount(v.replace(/[^0-9.]/g, ""))} placeholder="0.00" className="tabular-nums text-right" /></td>
 <td className="px-2 py-1.5"><TdInput value={pmPrevReasoning} onChange={setPmPrevReasoning} placeholder="Reasoning…" /></td>
 </tr>
 <tr>
 <td className="py-2 text-sm font-semibold text-primary">Preliminary</td>
 <td className="px-2 py-1.5 w-56"><TdInput value={pmAmount ? pmAmount : "—"} readOnly className="tabular-nums text-right font-semibold" /></td>
 <td className="px-2 py-1.5">
 <TdInput value={pmRationale} onChange={setPmRationale} placeholder="Explain why this percentage was selected…" />
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

 {/* ── Section C (subsection): Adjusted: Performance materiality for specific F/S areas ── */}
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
 <span className="text-sm font-semibold text-foreground">Adjusted performance materiality levels</span>
 </div>
 <p className="px-6 pt-3 pb-1 text-sm text-muted-foreground">Where considered necessary to address particular risks of misstatement in a class of transactions, account balance or F/S disclosure.</p>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="sticky top-0 z-10">
 <tr className="bg-muted border-b border-border">
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider">F/S Area or Disclosure</th>
 <th className="px-4 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[130px]">Amount ($)</th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider">Reasoning</th>
 <th className="px-4 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[120px]">PY Amount ($)</th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider">PY Reasoning</th>
 <th className="px-4 py-3 w-10" />
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {adjPMRows.map((row) => (
 <tr key={row.id} className="hover:bg-muted/50 transition-colors">
 <td className="px-4 py-2.5 align-top"><TdInput value={row.area} onChange={(v) => setAdjPMRows(p => p.map(r => r.id === row.id ? {...r, area: v} : r))} placeholder="F/S area or disclosure" /></td>
 <td className="px-4 py-2.5 align-top min-w-[130px]"><TdInput value={row.amount ? formatDisplay(row.amount) : ""} onChange={(v) => setAdjPMRows(p => p.map(r => r.id === row.id ? {...r, amount: v.replace(/[^0-9.]/g,"")} : r))} placeholder="0.00" className="text-right tabular-nums" /></td>
 <td className="px-4 py-2.5 align-top"><TdInput value={row.reasoning} onChange={(v) => setAdjPMRows(p => p.map(r => r.id === row.id ? {...r, reasoning: v} : r))} placeholder="Reasoning…" /></td>
 <td className="px-4 py-2.5 align-top min-w-[120px]"><TdInput value={row.pyAmount ? formatDisplay(row.pyAmount) : ""} onChange={(v) => setAdjPMRows(p => p.map(r => r.id === row.id ? {...r, pyAmount: v.replace(/[^0-9.]/g,"")} : r))} placeholder="—" className="text-right tabular-nums" /></td>
 <td className="px-4 py-2.5 align-top"><TdInput value={row.pyReasoning ?? ""} onChange={(v) => setAdjPMRows(p => p.map(r => r.id === row.id ? {...r, pyReasoning: v} : r))} placeholder="PY reasoning…" /></td>
 <td className="px-2 py-2.5 align-top text-center"><button onClick={() => setAdjPMRows(p => p.filter(r => r.id !== row.id))} className="text-muted-foreground hover:text-destructive transition-colors" disabled={adjPMRows.length === 1}><Trash2 className="h-3.5 w-3.5" /></button></td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div className="px-6 py-3 border-t border-border space-y-2">
 {adjPMRows.length < 2 && <Button size="sm" variant="secondary" className="h-7 text-xs gap-1" onClick={() => setAdjPMRows(p => p.length >= 2 ? p : [...p, {id: uid(), area:"", amount:"", reasoning:"", pyAmount:""}])}><Plus className="h-3.5 w-3.5" />Add Row</Button>}
 <div className="flex items-start gap-3">
 <p className="flex flex-1 items-start gap-1.5 text-sm text-muted-foreground">
 <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
 If there are more than two F/S areas or disclosures that require an adjusted performance materiality level, provide details on a supplementary work paper that cross-references to this form.
 </p>
 <RefButton reference={adjWPRef} onAttach={(doc) => setAdjWPRef(p => [...p, doc])} onRemove={(idx) => setAdjWPRef(p => p.filter((_,j) => j !== idx))} />
 </div>
 </div>
 </div>

 {/* ── Section D: Materiality for specific circumstances ── */}
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
 <span className="text-sm font-semibold text-foreground">D. Materiality for Specific Circumstances (CAS 320.10, .A11–A12)</span>
 </div>
 <p className="px-6 pt-3 pb-1 text-sm text-muted-foreground">Where misstatements of lesser amounts than overall materiality could reasonably influence users' decisions for particular transactions, balances or disclosures. Consider the views and expectations of management and TCWG, then set a level lower than overall materiality (Step A).</p>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="sticky top-0 z-10">
 <tr className="bg-muted border-b border-border">
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider">Description / User Expectation</th>
 <th className="px-4 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[130px]">Materiality ($)</th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider">Reasoning</th>
 <th className="px-4 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-24">W/P Ref.</th>
 <th className="px-4 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider w-24">PY ($)</th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider">PY Reasoning</th>
 <th className="px-4 py-3 w-10" />
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {specMatRows.map((row) => (
 <tr key={row.id} className="hover:bg-muted/50 transition-colors">
 <td className="px-4 py-2.5 align-top"><TdInput value={row.description} onChange={(v) => setSpecMatRows(p => p.map(r => r.id === row.id ? {...r, description: v} : r))} placeholder="Describe specific circumstances…" /></td>
 <td className="px-4 py-2.5 align-top min-w-[130px]"><TdInput value={row.amount ? formatDisplay(row.amount) : ""} onChange={(v) => setSpecMatRows(p => p.map(r => r.id === row.id ? {...r, amount: v.replace(/[^0-9.]/g,"")} : r))} placeholder="0.00" className="text-right tabular-nums" /></td>
 <td className="px-4 py-2.5 align-top"><TdInput value={row.reasoning} onChange={(v) => setSpecMatRows(p => p.map(r => r.id === row.id ? {...r, reasoning: v} : r))} placeholder="Reasoning…" /></td>
 <td className="px-4 py-2.5 align-top"><RefButton reference={row.wpRef} onAttach={(doc) => setSpecMatRows(p => p.map(r => r.id === row.id ? {...r, wpRef: [...r.wpRef, doc]} : r))} onRemove={(idx) => setSpecMatRows(p => p.map(r => r.id === row.id ? {...r, wpRef: r.wpRef.filter((_,j) => j !== idx)} : r))} /></td>
 <td className="px-4 py-2.5 align-top"><TdInput value={row.pyAmount ? formatDisplay(row.pyAmount) : ""} onChange={(v) => setSpecMatRows(p => p.map(r => r.id === row.id ? {...r, pyAmount: v.replace(/[^0-9.]/g,"")} : r))} placeholder="—" className="text-right tabular-nums" /></td>
 <td className="px-4 py-2.5 align-top"><TdInput value={row.pyReasoning ?? ""} onChange={(v) => setSpecMatRows(p => p.map(r => r.id === row.id ? {...r, pyReasoning: v} : r))} placeholder="PY reasoning…" /></td>
 <td className="px-2 py-2.5 align-top text-center"><button onClick={() => setSpecMatRows(p => p.filter(r => r.id !== row.id))} className="text-muted-foreground hover:text-destructive transition-colors" disabled={specMatRows.length === 1}><Trash2 className="h-3.5 w-3.5" /></button></td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div className="px-6 py-3 border-t border-border">
 <Button size="sm" variant="secondary" className="h-7 text-xs gap-1" onClick={() => setSpecMatRows(p => [...p, {id: uid(), description:"", amount:"", reasoning:"", wpRef:[], pyAmount:""}])}><Plus className="h-3.5 w-3.5" />Add Row</Button>
 </div>
 </div>

 {/* ── Section E: Performance materiality for specific circumstances ── */}
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
 <span className="text-sm font-semibold text-foreground">E. Performance Materiality for Specific Circumstances (CAS 320.10–11, .A13)</span>
 </div>
 <p className="px-6 pt-3 pb-1 text-sm text-muted-foreground">Performance materiality for the specific circumstances in Step D.</p>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="sticky top-0 z-10">
 <tr className="bg-muted border-b border-border">
 <th className="px-4 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[130px]">Amount ($)</th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider">Reasoning</th>
 <th className="px-4 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-24">W/P Ref.</th>
 <th className="px-4 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[120px]">PY Amount ($)</th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider">PY Reasoning</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 <tr className="hover:bg-muted/50 transition-colors">
 <td className="px-4 py-2.5 align-top min-w-[130px]"><TdInput value={specPMAmount ? formatDisplay(specPMAmount) : ""} onChange={(v) => setSpecPMAmount(v.replace(/[^0-9.]/g, ""))} placeholder="0.00" className="text-right tabular-nums" /></td>
 <td className="px-4 py-2.5 align-top"><TdInput value={specPMReasoning} onChange={setSpecPMReasoning} placeholder="Reasoning…" /></td>
 <td className="px-4 py-2.5 align-top"><RefButton reference={specPMWPRef} onAttach={(doc) => setSpecPMWPRef(p => [...p, doc])} onRemove={(idx) => setSpecPMWPRef(p => p.filter((_,j) => j !== idx))} /></td>
 <td className="px-4 py-2.5 align-top min-w-[120px]"><TdInput value={specPMPY ? formatDisplay(specPMPY) : ""} onChange={(v) => setSpecPMPY(v.replace(/[^0-9.]/g, ""))} placeholder="—" className="text-right tabular-nums" /></td>
 <td className="px-4 py-2.5 align-top"><TdInput value={specPMPYReasoning} onChange={setSpecPMPYReasoning} placeholder="PY reasoning…" /></td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

 {/* ── Section F: Trivial misstatements ── */}
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
 <span className="text-sm font-semibold text-foreground">F. Trivial Misstatements (CAS 450.A2)</span>
 <Tooltip>
 <TooltipTrigger asChild>
 <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
 </TooltipTrigger>
 <TooltipContent>Threshold below which misstatements are clearly trivial and need not be accumulated (CAS 450.A2).</TooltipContent>
 </Tooltip>
 </div>
 <div className="border-t border-border px-6 py-4 flex items-center gap-4">
 <span className="text-sm text-foreground flex-1">Amount below which misstatements would be clearly trivial and not recorded on Form 335</span>
 <div className="flex flex-col items-end gap-1">
 <span className="text-sm text-muted-foreground">Amount ($)</span>
 <TdInput value={ctAmount ? formatDisplay(ctAmount) : ""} readOnly className="w-40 tabular-nums text-right" />
 </div>
 <div className="flex items-center gap-1.5 self-end pb-1.5 text-xs text-muted-foreground">
 <span>calc. at</span>
 <TdInput value={ctThresholdPct} onChange={(v) => setCtThresholdPct(v.replace(/[^0-9.]/g, ""))} placeholder="0.00" className="h-7 w-16 px-2 text-xs tabular-nums text-right" />
 <span>% of overall</span>
 </div>
 </div>
 <div className="border-t border-border px-6 py-4">
 <p className="mb-2 text-sm font-semibold text-foreground">Preliminary materiality levels</p>
 <div className="grid grid-cols-4 gap-4">
 <div className="flex flex-col gap-1"><span className="text-xs text-muted-foreground">Prepared by</span><TdInput value={signOff.preparedBy} onChange={(v) => setSignOff(p => ({...p, preparedBy: v}))} placeholder="Name" /></div>
 <div className="flex flex-col gap-1"><span className="text-xs text-muted-foreground">Date</span><TdInput type="date" value={signOff.preparedDate} onChange={(v) => setSignOff(p => ({...p, preparedDate: v}))} /></div>
 <div className="flex flex-col gap-1"><span className="text-xs text-muted-foreground">Reviewed by</span><TdInput value={signOff.reviewedBy} onChange={(v) => setSignOff(p => ({...p, reviewedBy: v}))} placeholder="Name" /></div>
 <div className="flex flex-col gap-1"><span className="text-xs text-muted-foreground">Date</span><TdInput type="date" value={signOff.reviewedDate} onChange={(v) => setSignOff(p => ({...p, reviewedDate: v}))} /></div>
 </div>
 </div>
 </div>

 <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
 <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
 Document any changes in the materiality assessments and the final materiality on Form 335.
 </p>

 {/* ── Qualitative Considerations ── */}
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
 <span className="text-sm font-semibold text-foreground">Qualitative Considerations</span>
 <Tooltip>
 <TooltipTrigger asChild>
 <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
 </TooltipTrigger>
 <TooltipContent>Document any qualitative factors that influenced the materiality determination.</TooltipContent>
 </Tooltip>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="sticky top-0 z-10">
 <tr className="bg-muted border-b border-border">
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider w-1/2">Nature</th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider">Impact</th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider w-16">Action</th>
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
 prev.map((x) => (x.id === item.id ? {...x, nature: v } : x))
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
 prev.map((x) => (x.id === item.id ? {...x, impact: v } : x))
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
 <Button
 size="sm"
 variant="outline"
 className="h-7 text-xs gap-1"
 onClick={() => setQualitative((prev) => [...prev, { id: uid(), nature: "", impact: "" }])}
 >
 <Plus className="h-3.5 w-3.5" />
 Add Row
 </Button>
 </div>
 </div>

 {/* ── Additional Comments ── */}
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
 <span className="text-sm font-semibold text-foreground">Additional Comments</span>
 </div>
 <div className="px-6 py-5">
 <AttributedComment
 value={additionalComments}
 onChange={setAdditionalComments}
 storageKey={`materiality-comments-v2-${isUS ? 'us' : 'ca'}`}
 placeholder="Add Comments"
 className="min-h-[80px] text-sm resize-none bg-background"
 />
 </div>
 </div>

 {/* ── Conclusion ── */}
 <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-2">
 <span className="text-sm font-semibold text-foreground">Conclusion</span>
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
