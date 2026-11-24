import { useState, useCallback, useEffect, useRef } from "react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Info, RefreshCw, Trash2, Plus } from "lucide-react";
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

interface QualDisclosure {
 id: string;
 text: string;
 wpRef: RefDoc[];
}

type LevelKind = "overall" | "performance" | "adjPerformance" | "specific" | "specPerformance" | "trivial";

interface LevelRow {
 id: string;
 kind: LevelKind;
 area: string;
 method: string;
 manual: string; // amount entered when method is "manual"
 py: string;
 comments: string;
 wpRef: RefDoc[];
 areaManual?: boolean; // specific performance only: area overridden instead of mirroring the Specific row
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

const toNum = (s: string): number => parseFloat(String(s).replace(/[^0-9.]/g, ""));

function calcMatCY(periodAmount: string, benchmarkPct: string): string {
 const a = toNum(periodAmount);
 const p = toNum(benchmarkPct);
 if (isNaN(a) || isNaN(p)) return "";
 return formatNum(a * p / 100);
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
 const ptd = toNum(row.periodAmount);
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

// ── Levels configuration ───────────────────────────────────────────────────────

const KIND_ORDER: LevelKind[] = ["overall", "performance", "adjPerformance", "specific", "specPerformance", "trivial"];

const LEVEL_LABEL: Record<LevelKind, string> = {
 overall: "Overall",
 performance: "Performance",
 adjPerformance: "Adjusted performance",
 specific: "Specific",
 specPerformance: "Specific performance",
 trivial: "Trivial",
};

const LEVEL_GUIDANCE: Record<LevelKind, string> = {
 overall: "Highest amount of misstatement that could be included in the F/S without affecting the economic decisions of the users (CAS 320.10).",
 performance: "Set below overall materiality, typically 60%–75%, to reduce the risk that aggregate uncorrected and undetected misstatements exceed overall materiality (CAS 320.11).",
 adjPerformance: "Lower performance materiality for a class of transactions, account balance or disclosure with a particular risk of misstatement. Maximum of two; use a supplementary work paper for more.",
 specific: "Lower amount for particular transactions, balances or disclosures where users' decisions could be influenced by lesser misstatements (CAS 320.10, .A11–A12).",
 specPerformance: "Performance materiality for the specific materiality levels (CAS 320.10–11, .A13). Based on the lowest specific amount.",
 trivial: "Threshold below which misstatements are clearly trivial and need not be accumulated (CAS 450.A2).",
};

const MANUAL = { value: "manual", label: "Manual" };
const METHOD_OPTIONS: Record<LevelKind, { value: string; label: string }[]> = {
 overall: [{ value: "criteria", label: "From criteria" }, MANUAL],
 performance: [60, 65, 70, 75].map(n => ({ value: `p${n}`, label: `${n}% of overall` })).concat(MANUAL),
 adjPerformance: [MANUAL],
 specific: [MANUAL],
 specPerformance: [{ value: "s70", label: "70% of specific" }, MANUAL],
 trivial: [{ value: "t5", label: "5% of overall" }, MANUAL],
};

const DEFAULT_METHOD: Record<LevelKind, string> = {
 overall: "criteria",
 performance: "p70",
 adjPerformance: "manual",
 specific: "manual",
 specPerformance: "s70",
 trivial: "t5",
};

const REPEATABLE: LevelKind[] = ["adjPerformance", "specific"];
const MAX_ADJUSTED = 2;

const newLevel = (kind: LevelKind, patch: Partial<LevelRow> = {}): LevelRow => ({
 id: uid(),
 kind,
 area: kind === "overall" || kind === "performance" || kind === "trivial" ? "F/S as a whole" : "",
 method: DEFAULT_METHOD[kind],
 manual: "",
 py: "",
 comments: "",
 wpRef: [],
 ...patch,
});

const pctOfMethod = (method: string): number | null => {
 const m = /^[pst](\d+)$/.exec(method);
 return m ? parseInt(m[1], 10) : null;
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const LUKA_BORDER = "border-[#8649F1] hover:border-[#8649F1] dark:border-[#8649F1] dark:hover:border-[#8649F1] focus:ring-[#8649F1]/30 focus-visible:!outline-[#8649F1] ";

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
 className={`h-8 text-sm ${readOnly ? "bg-muted/50 cursor-default " : ""}${luka ? LUKA_BORDER : ""}${className}`}
 />
 );
}

/** Amount input: shows what is typed while focused, formats to 2 decimals on blur */
function MoneyInput({
 value,
 onChange,
 placeholder = "0.00",
 className = "",
 luka,
 readOnly,
}: {
 value: string;
 onChange?: (raw: string) => void;
 placeholder?: string;
 className?: string;
 luka?: boolean;
 readOnly?: boolean;
}) {
 const [draft, setDraft] = useState<string | null>(null);
 const shown = draft !== null ? draft : (value ? formatDisplay(value) : "");
 return (
 <TdInput
 value={shown}
 readOnly={readOnly}
 placeholder={placeholder}
 luka={luka}
 className={`w-full px-2 tabular-nums text-right ${className}`}
 onChange={(v) => {
 const cleaned = v.replace(/[^0-9.]/g, "");
 setDraft(cleaned);
 onChange?.(cleaned);
 }}
 // draft clears on blur via the wrapper below
 />
 );
}

function MoneyField(props: React.ComponentProps<typeof MoneyInput>) {
 // Wrapper that resets the focused draft when focus leaves the field
 const [key, setKey] = useState(0);
 return (
 <div onBlur={() => setKey((k) => k + 1)}>
 <MoneyInput key={key} {...props} />
 </div>
 );
}

function TdSelect({
 value,
 onChange,
 options,
 placeholder = "Select…",
 wrap = false,
}: {
 value: string;
 onChange: (v: string) => void;
 options: { value: string; label: string }[];
 placeholder?: string;
 /** Let the selected label wrap onto a second line instead of truncating */
 wrap?: boolean;
}) {
 return (
 <Select value={value} onValueChange={onChange}>
 <SelectTrigger className={wrap ? "h-auto min-h-8 w-full min-w-0 gap-1 px-2 text-left text-xs leading-4 whitespace-normal [&>span]:whitespace-normal [&>span]:overflow-visible [&>span]:text-clip" : "h-8 w-full min-w-0 text-sm"}>
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

/** Wraps a control with a hover tooltip; renders the control alone when there is no text */
function Tip({ text, children }: { text?: string; children: React.ReactNode }) {
 if (!text) return <>{children}</>;
 return (
 <Tooltip>
 <TooltipTrigger asChild><div>{children}</div></TooltipTrigger>
 <TooltipContent>{text}</TooltipContent>
 </Tooltip>
 );
}

function InfoTip({ text }: { text: string }) {
 return (
 <Tooltip>
 <TooltipTrigger asChild>
 <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground cursor-help" />
 </TooltipTrigger>
 <TooltipContent className="max-w-xs">{text}</TooltipContent>
 </Tooltip>
 );
}

const CARD = "bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden";
const CARD_HEAD = "px-6 py-3.5 bg-card border-b border-border flex items-center gap-3";
const TH = "px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider";
const DEL_BTN = "text-muted-foreground hover:text-destructive transition-colors";

// ── Main Component ─────────────────────────────────────────────────────────────

interface AuditMaterialityWorksheetProps {
 isUS?: boolean;
 engagementId?: string;
}

export function AuditMaterialityWorksheetV3({ isUS = false, engagementId }: AuditMaterialityWorksheetProps) {
 const isDemoEngagement = engagementId === 'AUD-NPM-Dec312025';
 const [showAddDialog, setShowAddDialog] = useState(false);

 const TB = isDemoEngagement ? TB_NPM : (isUS ? TB_US : TB_CA);
 const entityLabel = isDemoEngagement ? "Northline Precision Manufacturing Inc." : (isUS ? "Harbor Freight LLC" : "Shipping Line Inc.");
 const region = isUS ? "us" : "ca";

 // Saved state (V3 keys only) — read once
 const stateKey = `audit-materiality-state-v3-${engagementId ?? region}`;
 const saved = useRef<Record<string, any> | null>(readJsonFromLocalStorage<Record<string, any> | null>(stateKey, null)).current;

 const [concluded, setConcluded] = useState<boolean>(saved?.concluded ?? false);

 const [periodStart, setPeriodStart] = useState<string>(saved?.periodStart ?? (isUS ? "2024-01-01" : "2024-04-01"));
 const [periodEnd, setPeriodEnd] = useState<string>(saved?.periodEnd ?? (isUS ? "2024-12-31" : "2025-03-31"));

 // Criteria — two benchmark lines seeded from Trial Balance
 const [selectedRowId, setSelectedRowId] = useState<string>(saved?.selectedRowId ?? SEED_ROW_A);
 const [entityRows, setEntityRows] = useState<EntityRow[]>(saved?.entityRows ?? [
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
 const [entityType, setEntityType] = useState<EntityType>(saved?.entityType ?? "profit");

 const [intendedUsers, setIntendedUsers] = useState<IntendedUser[]>(saved?.intendedUsers ?? [{ id: uid(), user: "", factors: "" }]);

 const [qualDisclosures, setQualDisclosures] = useState<QualDisclosure[]>(saved?.qualDisclosures ?? [{
 id: uid(),
 text: isUS
 ? "ASC 842 first-year lease adoption — nature and extent of leases, ROU asset measurement, discount rate policy, and transition adjustments require complete disclosure. Goodwill impairment testing methodology and assumptions also require qualitative disclosure per ASC 350."
 : "Vessel impairment indicators — nature of impairment assessment and key assumptions (charter rate forecasts, useful lives) require qualitative disclosure. Foreign currency risk management policy disclosure under ASPE s.3856.",
 wpRef: [],
 }]);

 // Materiality levels — one flat list; fixed kinds appear once, adjusted/specific are repeatable
 const [levels, setLevels] = useState<LevelRow[]>(saved?.levels ?? (isUS ? [
 newLevel("overall"),
 newLevel("performance"),
 newLevel("adjPerformance", { area: "Revenue (ASC 606 — contract estimates)", manual: "92000", comments: "Higher risk of misstatement due to percentage-of-completion estimates. Set at 50% of overall." }),
 newLevel("adjPerformance", { area: "ROU Assets & Lease Liabilities (ASC 842)", manual: "64000", comments: "First-year adoption — increased inherent risk. Set at 35% of overall." }),
 newLevel("specific", { area: "Related party transactions (ASC 850) — Board member loans and management compensation", manual: "10000", comments: "Users (lenders) particularly sensitive to RPTs. Lower materiality applied to ensure completeness of disclosure.", wpRef: [{ name: "WP-RPT-01" }] }),
 newLevel("specific", { area: "Going concern disclosures — elevated D/E ratio (2.71x) and covenant compliance", manual: "0", comments: "Qualitative — any indication of substantial doubt requires disclosure regardless of dollar amount.", wpRef: [{ name: "WP-GC-01" }] }),
 newLevel("specPerformance", { comments: "70% of specific materiality. Ensures detection of individually insignificant RPTs that aggregate to material amounts.", wpRef: [{ name: "WP-RPT-PM" }] }),
 newLevel("trivial"),
 ] : [
 newLevel("overall"),
 newLevel("performance"),
 newLevel("adjPerformance", { area: "Vessel PP&E (impairment)", manual: "62000", comments: "Significant judgment in impairment assessment. Set at 50% of performance materiality." }),
 newLevel("specific", { area: "Related party transactions — shareholder loans and management fees", manual: "5000", comments: "Bank covenant requires disclosure of all RPTs. Lower threshold applied for completeness.", wpRef: [{ name: "WP-RPT-01" }] }),
 newLevel("specPerformance", { comments: "70% of specific materiality.", wpRef: [{ name: "WP-RPT-PM" }] }),
 newLevel("trivial"),
 ]));

 const [qualitative, setQualitative] = useState<QualitativeItem[]>(saved?.qualitative ?? [{ id: uid(), nature: "", impact: "" }]);

 const [additionalComments, setAdditionalComments] = useState<string>(saved?.additionalComments ?? "");
 const [conclusion, setConclusion] = useState<string>(
 saved?.conclusion ?? "I am satisfied that the engagement planning adequately addresses the areas in the financial statements where material misstatements are likely to arise"
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

 // ── Criteria handlers ────────────────────────────────────────────────────────

 const patchRow = useCallback((id: string, patch: Partial<EntityRow>) => {
 setEntityRows((prev) => prev.map((row) => (row.id === id ? {...row,...patch } : row)));
 }, []);

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

 // Overall = the selected criteria line's possible materiality (not a sum)
 const selectedRow = rows.find(r => r.id === selectedRowId) ?? rows[0];
 const criteriaOverall = selectedRow?.possible ?? "";
 const selectedRange = selectedRow ? findBasis(selectedRow.basis)?.range : undefined;
 const selectedRangeTip = selectedRange ? `Range ${selectedRange[0]}–${selectedRange[selectedRange.length - 1]}%` : "Manual entry";

 // ── Levels derivation: Overall -> Performance / Trivial; Specific -> Specific performance ──

 const patchLevel = (id: string, patch: Partial<LevelRow>) => setLevels(prev => prev.map(l => (l.id === id ? {...l,...patch } : l)));

 const levelOf = (kind: LevelKind) => levels.find(l => l.kind === kind);
 const calcFrom = (l: LevelRow | undefined, base: number): number | null => {
 if (!l) return null;
 if (l.method === "manual") { const v = toNum(l.manual); return isNaN(v) ? null : v; }
 const p = pctOfMethod(l.method);
 return p === null || isNaN(base) ? null : base * p / 100;
 };

 const overallRow = levelOf("overall");
 const overallNum: number | null = !overallRow ? null
 : overallRow.method === "manual" ? (isNaN(toNum(overallRow.manual)) ? null : toNum(overallRow.manual))
 : (isNaN(toNum(criteriaOverall)) ? null : toNum(criteriaOverall));
 const overallBase = overallNum ?? NaN;

 // Lowest non-zero specific amount is the base for specific performance
 const specificAmounts = levels.filter(l => l.kind === "specific").map(l => toNum(l.manual)).filter(n => !isNaN(n) && n > 0);
 const specificBase = specificAmounts.length ? Math.min(...specificAmounts) : NaN;

 const currentOf = (l: LevelRow): number | null => {
 switch (l.kind) {
 case "overall": return overallNum;
 case "performance":
 case "trivial": return calcFrom(l, overallBase);
 case "specPerformance": return calcFrom(l, specificBase);
 default: return calcFrom(l, NaN);
 }
 };
 const isComputed = (l: LevelRow) => l.method !== "manual";
 const numStr = (n: number | null) => (n === null ? "" : String(Math.round(n * 100) / 100));

 const performanceNum = currentOf(levelOf("performance") ?? newLevel("performance", { method: "manual" }));
 const trivialNum = currentOf(levelOf("trivial") ?? newLevel("trivial", { method: "manual" }));
 const specPerfNum = levelOf("specPerformance") ? currentOf(levelOf("specPerformance")!) : null;
 const specificRows = levels.filter(l => l.kind === "specific");
 const adjCount = levels.filter(l => l.kind === "adjPerformance").length;
 const specCount = levels.filter(l => l.kind === "specific").length;

 // Persist key derived values for cross-worksheet auto-population (e.g., 513)
 const overallStr = overallNum === null ? "" : formatNum(overallNum);
 const performanceStr = performanceNum === null ? "" : formatNum(performanceNum);
 const trivialStr = trivialNum === null ? "" : formatNum(trivialNum);
 useEffect(() => {
 writeJsonToLocalStorage(`audit-materiality-data-v3-${region}`, {
 overallMateriality: overallStr,
 performanceMateriality: performanceStr,
 clearlyTrivial: trivialStr,
 });
 }, [region, overallStr, performanceStr, trivialStr]);

 // Persist the worksheet itself (V3 key only)
 useEffect(() => {
 writeJsonToLocalStorage(stateKey, {
 concluded, periodStart, periodEnd, selectedRowId, entityRows, entityType, intendedUsers,
 qualDisclosures, levels, qualitative, additionalComments, conclusion,
 });
 }, [stateKey, concluded, periodStart, periodEnd, selectedRowId, entityRows, entityType, intendedUsers, qualDisclosures, levels, qualitative, additionalComments, conclusion]);

 const addLevel = (kind: LevelKind) => {
 if (kind === "adjPerformance" && adjCount >= MAX_ADJUSTED) return;
 setLevels(prev => [...prev, newLevel(kind)]);
 };

 const orderedLevels = [...levels].sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));
 const title = "Materiality";
 const overallBasisLabel = (() => {
 const b = selectedRow ? findBasis(selectedRow.basis) : undefined;
 const lbl = b ? (selectedRow.basis === "other" ? (selectedRow.basisOther || "Other") : b.label) : "";
 return lbl && selectedRow ? `${lbl} × ${formatDisplay(selectedRow.benchmarkPct)}%` : "";
 })();
 const perfRow = levelOf("performance");
 const trivialRow = levelOf("trivial");
 const pctText = (l?: LevelRow, fallback = "Manual") => {
 const p = l ? pctOfMethod(l.method) : null;
 return p === null ? fallback : `${p}% of overall`;
 };

 const tiles: { key: string; label: string; hint: string; value: string; luka?: boolean }[] = [
 { key: "overall", label: "Overall", hint: overallRow?.method === "manual" ? "Manual" : overallBasisLabel, value: overallStr, luka: isDemoEngagement && !!overallStr },
 { key: "perf", label: "Performance", hint: `${pctText(perfRow)} · ${adjCount} adjusted`, value: performanceStr },
 { key: "spec", label: "Specific", hint: `${specCount} ${specCount === 1 ? "item" : "items"} · specific PM ${specPerfNum === null ? "—" : fmtInt(specPerfNum)}`, value: isNaN(specificBase) ? "" : formatNum(specificBase) },
 { key: "trivial", label: "Trivial", hint: pctText(trivialRow), value: trivialStr },
 ];

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

 <div className="flex-1 overflow-y-auto bg-muted/30">
 {/* Header */}
 <div className="px-6 py-3 border-b border-border bg-card flex items-center gap-2">
 <h2 className="text-base font-semibold text-foreground">{title}</h2>
 <Tooltip>
 <TooltipTrigger asChild>
 <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
 </TooltipTrigger>
 <TooltipContent className="max-w-md">
 <p className="mb-1 font-semibold">Objective</p>
 <ul className="list-disc pl-4 space-y-0.5">
 <li>Overall materiality, including possible misstatements in qualitative disclosures, based on the F/S users (CAS 320.10)</li>
 <li>Performance materiality to reduce the risk that aggregate uncorrected/undetected misstatements exceed overall materiality (CAS 320.11)</li>
 <li>Specific materiality and specific performance materiality where required (CAS 320.10, .A11-A12)</li>
 </ul>
 </TooltipContent>
 </Tooltip>
 </div>

 <div className="p-6 space-y-4">

 {/* ── Level tiles ── */}
 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
 {tiles.map((t) => (
 <div key={t.key} className={`${CARD} px-4 py-3 flex flex-col gap-1.5`}>
 <span className="text-sm font-semibold text-foreground">{t.label}</span>
 <span className="text-xs leading-4 text-muted-foreground min-h-[16px]">{t.hint}</span>
 <TdInput value={t.value ? formatDisplay(t.value) : ""} readOnly placeholder="0.00" luka={t.luka} className="h-10 text-lg font-semibold tabular-nums text-right" />
 </div>
 ))}
 </div>

 {/* ── Principal users ── */}
 <div className={CARD}>
 <div className={CARD_HEAD}>
 <span className="text-sm font-semibold text-foreground">Principal users</span>
 <InfoTip text="Identify the primary users of the financial statements and the factors affecting their decision making." />
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="bg-muted border-b border-border">
 <th className={`${TH} w-1/3`}>User</th>
 <th className={TH}>Factors that would influence users' decision-making</th>
 <th className="px-4 py-3 w-12" />
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {intendedUsers.map((u) => (
 <tr key={u.id} className="hover:bg-muted/50 transition-colors">
 <td className="px-4 py-2.5 align-top">
 <TdInput value={u.user} onChange={(v) => setIntendedUsers((prev) => prev.map((x) => (x.id === u.id ? {...x, user: v } : x)))} placeholder="Define user" />
 </td>
 <td className="px-4 py-2.5 align-top">
 <TdInput value={u.factors} onChange={(v) => setIntendedUsers((prev) => prev.map((x) => (x.id === u.id ? {...x, factors: v } : x)))} placeholder="Describe factors" />
 </td>
 <td className="px-2 py-2.5 align-top text-center">
 <div className="flex h-8 items-center justify-center">
 <button aria-label="Delete user" onClick={() => setIntendedUsers((prev) => prev.filter((x) => x.id !== u.id))} className={DEL_BTN} disabled={intendedUsers.length === 1}>
 <Trash2 className="h-3.5 w-3.5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div className="px-6 py-3 border-t border-border">
 <Button size="sm" variant="secondary" className="h-7 text-xs gap-1" onClick={() => setIntendedUsers((prev) => [...prev, { id: uid(), user: "", factors: "" }])}>
 <Plus className="h-3.5 w-3.5" />
 Add user
 </Button>
 </div>
 </div>

 {/* ── Criteria ── */}
 <div className={CARD}>
 <div className={`${CARD_HEAD} flex-wrap`}>
 <span className="text-sm font-semibold text-foreground">Criteria</span>
 <InfoTip text="Use professional judgment to set the highest amount of misstatement that could be included in the F/S without affecting the economic decisions of the users identified above. The selected line drives overall materiality." />
 <Input type="date" aria-label="Period start" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} className="h-8 text-sm w-44 pr-2" />
 <Input type="date" aria-label="Period end" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} className="h-8 text-sm w-44 pr-2" />
 <div className="flex-1" />
 <Button variant="outline" size="sm" onClick={handleRefresh} className="h-8 text-sm">
 <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
 Refresh
 </Button>
 <Tabs value={entityType} onValueChange={(v) => handleEntityTypeChange(v as EntityType)}>
 <TabsList className="h-8">
 <TabsTrigger value="profit" className="text-xs px-3">Profit-oriented</TabsTrigger>
 <TabsTrigger value="nfp" className="text-xs px-3">Not-for-profit</TabsTrigger>
 </TabsList>
 </Tabs>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="bg-muted border-b border-border">
 <th className="px-3 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-[64px]">Use</th>
 <th className="px-2 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider w-[220px] min-w-[220px]">Basis</th>
 <th className="px-2 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[140px]">Period to date</th>
 <th className="px-2 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[140px]">Anticipated</th>
 <th className="px-2 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[140px]">Previous period</th>
 <th className="px-2 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider w-36">
 <span className="inline-flex items-center justify-end gap-1.5">Benchmark % applied<InfoTip text={selectedRangeTip} /></span>
 </th>
 <th className="px-2 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[140px]">Possible materiality</th>
 <th className="px-2 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider min-w-[200px] w-full">Comments</th>
 <th className="px-2 py-3 w-10" />
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {rows.map((row, rowIdx) => {
 const isSelected = row.id === selectedRowId;
 const basisOpt = findBasis(row.basis);
 const range = basisOpt?.range;
 const pctNum = parseFloat(row.benchmarkPct);
 const showPctInput = !range || row.pctManual || !range.includes(pctNum);
 const rangeTip = range ? `Range ${range[0]}–${range[range.length - 1]}%` : "Manual entry";
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
 name="primary-benchmark-v3"
 aria-label="Use this criteria line"
 checked={isSelected}
 onChange={() => setSelectedRowId(row.id)}
 className="h-4 w-4 accent-primary cursor-pointer"
 />
 </div>
 </td>
 <td className="px-2 py-2.5 align-top w-[220px] min-w-[220px]">
 <TdSelect wrap value={row.basis} onChange={(v) => handleBasisChange(row.id, v)} options={BASIS_OPTIONS_BY_TYPE[entityType]} placeholder="Select basis…" />
 {row.basis === "other" && (
 <TdInput value={row.basisOther} onChange={(v) => patchRow(row.id, { basisOther: v })} placeholder="Describe basis…" className="mt-1.5" />
 )}
 </td>
 <td className="px-2 py-2.5 align-top min-w-[140px]">
 <LukaTypingRow filled={isDemoEngagement && lukaFilledFields.has('mat-row-0-amount')}>
 <MoneyField
 value={row.periodAmount}
 onChange={(v) => { markEdited(`ptd-${row.id}`); patchRow(row.id, { periodAmount: v }); }}
 luka={isDemoEngagement && !lukaEditedFields.has(`ptd-${row.id}`) && (row.basis === 'grossRevenue' || (rowIdx === 0 && lukaFilledFields.has('mat-row-0-amount')))}
 />
 </LukaTypingRow>
 </td>
 <td className="px-2 py-2.5 align-top min-w-[140px]">
 <Tip text={row.anticipatedNote ? `Anticipated: ${row.anticipatedNote}` : undefined}>
 <MoneyField
 value={row.anticipated}
 onChange={(cleaned) => patchRow(row.id, cleaned ? { extrapolatedPeriod: cleaned, extrapManual: true } : { extrapolatedPeriod: "", extrapManual: false })}
 />
 </Tip>
 </td>
 <td className="px-2 py-2.5 align-top min-w-[140px]">
 <LukaTypingRow filled={isDemoEngagement && lukaFilledFields.has('mat-row-0-py')}>
 <MoneyField
 value={row.prevAmount}
 onChange={(v) => { markEdited(`prev-${row.id}`); patchRow(row.id, { prevAmount: v }); }}
 luka={isDemoEngagement && !lukaEditedFields.has(`prev-${row.id}`) && rowIdx === 0 && lukaFilledFields.has('mat-row-0-py')}
 />
 </LukaTypingRow>
 </td>
 <td className="px-2 py-2.5 align-top w-36">
 <Tip text={rangeTip}>
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
 </Tip>
 </td>
 <td className="px-2 py-2.5 align-top min-w-[140px]">
 <TdInput value={row.possible ? formatDisplay(row.possible) : ""} readOnly placeholder="0.00" className={`px-2 tabular-nums text-right${isSelected ? " font-semibold" : ""}`} />
 </td>
 <td className="px-2 py-2.5 align-top">
 <LukaTypingRow filled={isDemoEngagement && lukaFilledFields.has('mat-row-0-comments')}>
 <TdInput
 value={row.comments}
 onChange={(v) => { markEdited(`comments-${row.id}`); patchRow(row.id, { comments: v }); }}
 placeholder="Comments…"
 luka={isDemoEngagement && !lukaEditedFields.has(`comments-${row.id}`) && rowIdx === 0 && lukaFilledFields.has('mat-row-0-comments')}
 />
 </LukaTypingRow>
 </td>
 <td className="px-2 py-2.5 align-top text-center">
 <div className="flex h-8 items-center justify-center">
 <button aria-label="Delete criteria line" onClick={() => removeEntityRow(row.id)} className={DEL_BTN} disabled={entityRows.length === 1}>
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
 Add criteria line
 </Button>
 </div>
 </div>

 {/* ── Qualitative disclosures ── */}
 <div className={CARD}>
 <div className={CARD_HEAD}>
 <span className="text-sm font-semibold text-foreground">Qualitative disclosures</span>
 <InfoTip text="Identify possible misstatements in qualitative disclosures that could be material to the intended users. Consider the entity's circumstances (such as a significant business combination), the applicable financial reporting framework and disclosures related to the nature of the entity." />
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="bg-muted border-b border-border">
 <th className={TH}>Possible misstatements</th>
 <th className="px-4 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-24">W/P Ref.</th>
 <th className="px-4 py-3 w-12" />
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {qualDisclosures.map((q) => (
 <tr key={q.id} className="hover:bg-muted/50 transition-colors">
 <td className="px-4 py-2.5 align-top">
 <Textarea
 value={q.text}
 onChange={(e) => setQualDisclosures(p => p.map(x => x.id === q.id ? {...x, text: e.target.value} : x))}
 placeholder="Describe qualitative disclosures that could be material…"
 className="min-h-[56px] text-sm resize-none bg-background"
 />
 </td>
 <td className="px-4 py-2.5 align-top">
 <RefButton reference={q.wpRef} onAttach={(doc) => setQualDisclosures(p => p.map(x => x.id === q.id ? {...x, wpRef: [...x.wpRef, doc]} : x))} onRemove={(idx) => setQualDisclosures(p => p.map(x => x.id === q.id ? {...x, wpRef: x.wpRef.filter((_, j) => j !== idx)} : x))} />
 </td>
 <td className="px-2 py-2.5 align-top text-center">
 <div className="flex h-8 items-center justify-center">
 <button aria-label="Delete disclosure item" onClick={() => setQualDisclosures(p => p.filter(x => x.id !== q.id))} className={DEL_BTN} disabled={qualDisclosures.length === 1}>
 <Trash2 className="h-3.5 w-3.5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div className="px-6 py-3 border-t border-border">
 <Button size="sm" variant="secondary" className="h-7 text-xs gap-1" onClick={() => setQualDisclosures(p => [...p, { id: uid(), text: "", wpRef: [] }])}>
 <Plus className="h-3.5 w-3.5" />
 Add item
 </Button>
 </div>
 </div>

 {/* ── Materiality levels ── */}
 <div className={CARD}>
 <div className={CARD_HEAD}>
 <span className="text-sm font-semibold text-foreground">Materiality levels</span>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full table-fixed min-w-[1100px]">
 <colgroup>
 <col className="w-[190px]" />
 <col className="w-[22%]" />
 <col className="w-[170px]" />
 <col className="w-[150px]" />
 <col className="w-[140px]" />
 <col />
 <col className="w-[110px]" />
 <col className="w-[48px]" />
 </colgroup>
 <thead>
 <tr className="bg-muted border-b border-border">
 <th className={TH}>Level</th>
 <th className={TH}>Area</th>
 <th className={TH}>Method</th>
 <th className={`${TH} text-right`}>Current</th>
 <th className={`${TH} text-right`}>Prior year</th>
 <th className={TH}>Comments</th>
 <th className="px-4 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider">W/P Ref.</th>
 <th className="px-4 py-3" />
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {orderedLevels.map((l) => {
 const computed = isComputed(l);
 const cur = currentOf(l);
 const repeatable = REPEATABLE.includes(l.kind);
 return (
 <tr key={l.id} className="hover:bg-muted/50 transition-colors">
 <td className="px-4 py-2.5 align-top">
 <div className="flex h-8 items-center gap-1.5 text-sm font-medium text-foreground">
 <span className="truncate">{LEVEL_LABEL[l.kind]}</span>
 <InfoTip text={LEVEL_GUIDANCE[l.kind]} />
 </div>
 </td>
 <td className="px-4 py-2.5 align-top">
 {l.kind === "specPerformance" && !l.areaManual ? (
 <TdInput
 value={specificRows.length === 1 ? specificRows[0].area : l.area}
 onChange={(v) => patchLevel(l.id, { area: v, areaManual: true })}
 placeholder="F/S area or disclosure"
 className={specificRows.length === 1 ? "bg-muted/50" : ""}
 />
 ) : (
 <TdInput value={l.area} onChange={(v) => patchLevel(l.id, l.kind === "specPerformance" ? { area: v, areaManual: true } : { area: v })} placeholder="F/S area or disclosure" />
 )}
 </td>
 <td className="px-4 py-2.5 align-top">
 <TdSelect value={l.method} onChange={(v) => patchLevel(l.id, v === "manual" && cur !== null && l.manual === "" ? { method: v, manual: numStr(cur) } : { method: v })} options={METHOD_OPTIONS[l.kind]} />
 </td>
 <td className="px-4 py-2.5 align-top">
 <MoneyField
 value={computed ? numStr(cur) : l.manual}
 readOnly={computed}
 onChange={(v) => patchLevel(l.id, { manual: v })}
 luka={l.kind === "overall" && isDemoEngagement && computed && !!numStr(cur)}
 />
 </td>
 <td className="px-4 py-2.5 align-top">
 <MoneyField value={l.py} onChange={(v) => patchLevel(l.id, { py: v })} placeholder="—" />
 </td>
 <td className="px-4 py-2.5 align-top">
 <TdInput value={l.comments} onChange={(v) => patchLevel(l.id, { comments: v })} placeholder="Comments…" />
 </td>
 <td className="px-4 py-2.5 align-top">
 <RefButton reference={l.wpRef} onAttach={(doc) => patchLevel(l.id, { wpRef: [...l.wpRef, doc] })} onRemove={(idx) => patchLevel(l.id, { wpRef: l.wpRef.filter((_, j) => j !== idx) })} />
 </td>
 <td className="px-2 py-2.5 align-top text-center">
 {repeatable && (
 <div className="flex h-8 items-center justify-center">
 <button aria-label={`Delete ${LEVEL_LABEL[l.kind].toLowerCase()} level`} onClick={() => setLevels(p => p.filter(x => x.id !== l.id))} className={DEL_BTN}>
 <Trash2 className="h-3.5 w-3.5" />
 </button>
 </div>
 )}
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 <div className="px-6 py-3 border-t border-border flex flex-wrap items-center gap-3">
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button size="sm" variant="secondary" className="h-7 text-xs gap-1">
 <Plus className="h-3.5 w-3.5" />
 Add level
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="start" className="min-w-max">
 <DropdownMenuItem className="text-sm cursor-pointer" disabled={adjCount >= MAX_ADJUSTED} onClick={() => addLevel("adjPerformance")}>Adjusted performance</DropdownMenuItem>
 <DropdownMenuItem className="text-sm cursor-pointer" onClick={() => addLevel("specific")}>Specific</DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 <p className="flex flex-1 items-start gap-1.5 text-sm text-muted-foreground min-w-[240px]">
 <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
 Maximum of two adjusted performance levels. For more, provide details on a supplementary work paper that cross-references to this form.
 </p>
 </div>
 <div className="border-t border-border px-6 py-3 bg-muted/20">
 <p className="text-sm text-muted-foreground">
 If overall materiality is lower than in previous audits, consider whether misstatements may exist in the opening balances. Document any changes in the materiality assessments and the final materiality on Form 335.
 </p>
 </div>
 </div>

 {/* ── Qualitative considerations ── */}
 <div className={CARD}>
 <div className={CARD_HEAD}>
 <span className="text-sm font-semibold text-foreground">Qualitative considerations · pending Atin</span>
 <InfoTip text="Document any qualitative factors that influenced the materiality determination." />
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="bg-muted border-b border-border">
 <th className={`${TH} w-1/2`}>Nature</th>
 <th className={TH}>Impact</th>
 <th className="px-4 py-3 w-12" />
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {qualitative.map((item) => (
 <tr key={item.id} className="hover:bg-muted/50 transition-colors">
 <td className="px-4 py-2.5 align-top">
 <TdInput value={item.nature} onChange={(v) => setQualitative((prev) => prev.map((x) => (x.id === item.id ? {...x, nature: v } : x)))} placeholder="Describe Nature" />
 </td>
 <td className="px-4 py-2.5 align-top">
 <TdInput value={item.impact} onChange={(v) => setQualitative((prev) => prev.map((x) => (x.id === item.id ? {...x, impact: v } : x)))} placeholder="Describe impact" />
 </td>
 <td className="px-2 py-2.5 align-top text-center">
 <div className="flex h-8 items-center justify-center">
 <button aria-label="Delete row" onClick={() => setQualitative((prev) => prev.filter((x) => x.id !== item.id))} className={DEL_BTN} disabled={qualitative.length === 1}>
 <Trash2 className="h-3.5 w-3.5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div className="px-6 py-3 border-t border-border">
 <Button size="sm" variant="secondary" className="h-7 text-xs gap-1" onClick={() => setQualitative((prev) => [...prev, { id: uid(), nature: "", impact: "" }])}>
 <Plus className="h-3.5 w-3.5" />
 Add row
 </Button>
 </div>
 </div>

 {/* ── Additional Comments ── */}
 <div className={CARD}>
 <div className={CARD_HEAD}>
 <span className="text-sm font-semibold text-foreground">Additional Comments</span>
 </div>
 <div className="px-6 py-5">
 <AttributedComment
 value={additionalComments}
 onChange={setAdditionalComments}
 storageKey={`materiality-comments-v3-${region}`}
 placeholder="Add Comments"
 className="min-h-[80px] text-sm resize-none bg-background"
 />
 </div>
 </div>

 {/* ── Conclusion ── */}
 <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-2">
 <span className="text-sm font-semibold text-foreground">Conclusion — Document any changes in the materiality assessments and the final materiality</span>
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
