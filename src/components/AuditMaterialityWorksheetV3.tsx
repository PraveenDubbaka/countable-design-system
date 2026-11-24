import { useState, useCallback, useEffect, useRef } from "react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Info, RefreshCw, Trash2, Plus, Sparkles, AlertTriangle } from "lucide-react";
import { DEMO_LUKA_ACTIONS } from "@/components/demo/demoFixtureData";
import { LukaStatusBar } from "@/components/demo/LukaStatusBar";
import { LukaTypingRow } from '@/components/demo/LukaTypingRow';
import { AddToMyTemplatesDialog } from "@/components/AddToMyTemplatesDialog";
import { AITextarea } from "@/components/AITextarea";
import { useAttribution, AttributionLine } from "@/components/ui/AttributedComment";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
}

type LevelKind = "overall" | "performance" | "adjPerformance" | "specific" | "specPerformance" | "trivial";

interface LevelRow {
 id: string;
 kind: LevelKind;
 area: string;
 method: string;
 manual: string; // amount entered when method is "manual"
 customPct: string; // percentage typed when method is "custom"
 py: string;
 comments: string;
 pairId?: string; // specific performance only: id of the Specific row it belongs to
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

const BASIS_OPTIONS: BasisOption[] = [
 { value: "profitBeforeTax", label: "Income before tax (continuing ops, adjusted)", tbKey: "profitBeforeTax", range: [3, 4, 5, 6, 7] },
 { value: "grossRevenue", label: "Gross revenues", tbKey: "grossRevenue", range: [1, 2, 3] },
 { value: "other", label: "Other (describe)" },
];
const findBasis = (v: string) => BASIS_OPTIONS.find(o => o.value === v);
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

// Every Specific row owns one Specific performance row (pairId). Saved data from earlier builds is migrated here:
// the single specific performance row attaches to the first Specific row; any Specific row still without a pair gets one.
function normalizeLevels(list: LevelRow[]): LevelRow[] {
 const specifics = list.filter(l => l.kind === "specific");
 const ids = new Set(specifics.map(l => l.id));
 const loose = list.filter(l => l.kind === "specPerformance" && (!l.pairId || !ids.has(l.pairId)));
 const used = new Set(list.filter(l => l.kind === "specPerformance" && l.pairId && ids.has(l.pairId)).map(l => l.pairId));
 const out = list.filter(l => l.kind !== "specPerformance" || (l.pairId && ids.has(l.pairId)));
 for (const sp of specifics) {
 if (used.has(sp.id)) continue;
 const orphan = loose.shift();
 out.push(orphan ? { ...orphan, pairId: sp.id } : newLevel("specPerformance", { pairId: sp.id }));
 }
 return out;
}


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
 specPerformance: "Performance materiality for the specific materiality levels (CAS 320.10–11, .A13). Calculated from the amount of the Specific row above it.",
 trivial: "Threshold below which misstatements are clearly trivial and need not be accumulated (CAS 450.A2).",
};

const MANUAL = { value: "manual", label: "Manual" };
const CUSTOM = { value: "custom", label: "Custom %…" };
const METHOD_OPTIONS: Record<LevelKind, { value: string; label: string }[]> = {
 overall: [{ value: "criteria", label: "From criteria" }, MANUAL],
 performance: [60, 65, 70, 75].map(n => ({ value: `p${n}`, label: `${n}% of overall` })).concat(CUSTOM, MANUAL),
 adjPerformance: [MANUAL],
 specific: [MANUAL],
 specPerformance: [{ value: "s70", label: "70% of specific" }, CUSTOM, MANUAL],
 trivial: [{ value: "t5", label: "5% of overall" }, CUSTOM, MANUAL],
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
 customPct: "",
 py: "",
 comments: "",
 ...patch,
});

const pctOfMethod = (method: string): number | null => {
 const m = /^[pst](\d+)$/.exec(method);
 return m ? parseInt(m[1], 10) : null;
};
// Percentage a level is calculated with: the preset (p70, t5, …) or the typed Custom %
const pctOfLevel = (l: LevelRow): number | null => {
 if (l.method === "custom") { const v = toNum(l.customPct); return isNaN(v) ? null : v; }
 return pctOfMethod(l.method);
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
 locked,
 lockTip,
}: {
 value: string;
 onChange?: (raw: string) => void;
 placeholder?: string;
 className?: string;
 luka?: boolean;
 readOnly?: boolean;
 /** Automated value: read-only, muted grey, tooltip on hover explains how to edit */
 locked?: boolean;
 lockTip?: React.ReactNode;
}) {
 const [draft, setDraft] = useState<string | null>(null);
 const shown = draft !== null ? draft : (value ? formatDisplay(value) : "");
 const input = (
 <TdInput
 value={shown}
 readOnly={readOnly || locked}
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
 return locked ? <LockWrap tip={lockTip}>{input}</LockWrap> : input;
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
function Tip({ text, children }: { text?: React.ReactNode; children: React.ReactNode }) {
 if (!text) return <>{children}</>;
 return (
 <Tooltip>
 <TooltipTrigger asChild><div>{children}</div></TooltipTrigger>
 <TooltipContent>{text}</TooltipContent>
 </Tooltip>
 );
}

const LOCK_TIP = "Automated · switch Method to Custom % or Manual to edit";

/** Tooltip on hover of an automated (read-only) input */
function LockWrap({ tip = LOCK_TIP, children }: { tip?: React.ReactNode; children: React.ReactNode }) {
 return <Tip text={tip}>{children}</Tip>;
}

/** Same comment input as the checklists (AITextarea with mic/dictation), with the "Last updated by…" line under it */
function CommentField({ value, onChange, storageKey, placeholder, luka }: {
 value: string;
 onChange: (v: string) => void;
 storageKey: string;
 placeholder?: string;
 luka?: boolean;
}) {
 const attr = useAttribution(storageKey);
 const dirty = useRef(false);
 const latest = useRef(value);
 latest.current = value;
 return (
 <div className="flex flex-col gap-1">
 <div className={`rounded-md border bg-background ${luka ? "border-[#8649F1]" : "border-input"}`}>
 <AITextarea
 value={value}
 onChange={(v) => { dirty.current = true; onChange(v); }}
 placeholder={placeholder}
 maxLength={2000}
 onAIGenerate={() => attr.stamp("LUKA")}
 onEditEnd={() => { if (dirty.current && latest.current) { attr.stamp(); } dirty.current = false; }}
 />
 </div>
 {value && attr.attr && <AttributionLine attr={attr.attr} />}
 </div>
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

 const region = isUS ? "us" : "ca";
 const scope = engagementId ?? region;

 // TB values: the engagement's trial balance (demo data), plus an optional V3-only override so a changed trial balance can be shown.
 // Re-read on every render; a change is announced with the "audit-materiality-tb-changed" event (or storage/focus).
 const [, setTbTick] = useState(0);
 useEffect(() => {
 const bump = () => setTbTick(t => t + 1);
 window.addEventListener("audit-materiality-tb-changed", bump);
 window.addEventListener("storage", bump);
 window.addEventListener("focus", bump);
 return () => {
 window.removeEventListener("audit-materiality-tb-changed", bump);
 window.removeEventListener("storage", bump);
 window.removeEventListener("focus", bump);
 };
 }, []);
 const TB_BASE = isDemoEngagement ? TB_NPM : (isUS ? TB_US : TB_CA);
 const TB: typeof TB_CA = { ...TB_BASE, ...(readJsonFromLocalStorage<Partial<typeof TB_CA> | null>(`audit-materiality-tb-v3-${scope}`, null) ?? {}) };
 const tbSig = JSON.stringify(TB);
 // A trial balance exists once it was imported for the engagement (same flag the Trial Balance page sets); the demo engagement always has one
 const tbAvailable = isDemoEngagement || !engagementId || !!localStorage.getItem(`tb-loaded-${engagementId}`);
 const entityLabel = isDemoEngagement ? "Northline Precision Manufacturing Inc." : (isUS ? "Harbor Freight LLC" : "Shipping Line Inc.");
 // Saved state (V3 keys only) — read once
 const stateKey = `audit-materiality-state-v3-${scope}`;
 const attrBase = `mat-v3-${scope}`;
 const saved = useRef<Record<string, any> | null>(readJsonFromLocalStorage<Record<string, any> | null>(stateKey, null)).current;

 const [concluded, setConcluded] = useState<boolean>(saved?.concluded ?? false);

 const [periodStart, setPeriodStart] = useState<string>(saved?.periodStart ?? (isUS ? "2024-01-01" : "2024-04-01"));
 const [periodEnd, setPeriodEnd] = useState<string>(saved?.periodEnd ?? (isUS ? "2024-12-31" : "2025-03-31"));

 // Criteria — two benchmark lines seeded from Trial Balance
 const [selectedRowId, setSelectedRowId] = useState<string>(saved?.selectedRowId ?? SEED_ROW_A);
 const [entityRows, setEntityRows] = useState<EntityRow[]>(() => (saved?.entityRows as EntityRow[] | undefined)?.map(r => (
 // earlier builds had not-for-profit bases; Profit-oriented only now
 r.basis === "nfpRevenues" ? { ...r, basis: "grossRevenue" } : r.basis === "nfpExpenses" ? { ...r, basis: "other" } : r
 )) ?? [
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

 const [intendedUsers, setIntendedUsers] = useState<IntendedUser[]>(saved?.intendedUsers ?? [{ id: uid(), user: "", factors: "" }]);

 const [qualDisclosures, setQualDisclosures] = useState<QualDisclosure[]>(saved?.qualDisclosures ?? [{
 id: uid(),
 text: isUS
 ? "ASC 842 first-year lease adoption — nature and extent of leases, ROU asset measurement, discount rate policy, and transition adjustments require complete disclosure. Goodwill impairment testing methodology and assumptions also require qualitative disclosure per ASC 350."
 : "Vessel impairment indicators — nature of impairment assessment and key assumptions (charter rate forecasts, useful lives) require qualitative disclosure. Foreign currency risk management policy disclosure under ASPE s.3856.",
 }]);

 // Materiality levels — one flat list; fixed kinds appear once, adjusted/specific are repeatable
 const [levels, setLevels] = useState<LevelRow[]>(() => normalizeLevels(((saved?.levels as LevelRow[] | undefined)?.map(l => ({ customPct: "", ...l }))) ?? (isUS ? [
 newLevel("overall"),
 newLevel("performance"),
 newLevel("adjPerformance", { area: "Revenue (ASC 606 — contract estimates)", manual: "92000", comments: "Higher risk of misstatement due to percentage-of-completion estimates. Set at 50% of overall." }),
 newLevel("adjPerformance", { area: "ROU Assets & Lease Liabilities (ASC 842)", manual: "64000", comments: "First-year adoption — increased inherent risk. Set at 35% of overall." }),
 newLevel("specific", { area: "Related party transactions (ASC 850) — Board member loans and management compensation", manual: "10000", comments: "Users (lenders) particularly sensitive to RPTs. Lower materiality applied to ensure completeness of disclosure.", }),
 newLevel("specific", { area: "Going concern disclosures — elevated D/E ratio (2.71x) and covenant compliance", manual: "0", comments: "Qualitative — any indication of substantial doubt requires disclosure regardless of dollar amount." }),
 newLevel("specPerformance", { comments: "70% of specific materiality. Ensures detection of individually insignificant RPTs that aggregate to material amounts." }),
 newLevel("trivial"),
 ] : [
 newLevel("overall"),
 newLevel("performance"),
 newLevel("adjPerformance", { area: "Vessel PP&E (impairment)", manual: "62000", comments: "Significant judgment in impairment assessment. Set at 50% of performance materiality." }),
 newLevel("specific", { area: "Related party transactions — shareholder loans and management fees", manual: "5000", comments: "Bank covenant requires disclosure of all RPTs. Lower threshold applied for completeness." }),
 newLevel("specPerformance", { comments: "70% of specific materiality." }),
 newLevel("trivial"),
 ])));

 const [qualitative, setQualitative] = useState<QualitativeItem[]>(saved?.qualitative ?? [{ id: uid(), nature: "", impact: "" }]);

 // Trial balance state: blank until a trial balance exists (or last year's materiality is used); Refresh pulls it in
 const [tbReady, setTbReady] = useState<boolean>(() => tbAvailable || !!saved?.tbReady);
 const [prefilled, setPrefilled] = useState<boolean>(saved?.prefilled ?? false);
 // Signature of the TB values the benchmarks were last pulled from; a different current TB means Refresh is required
 const [usedTbSig, setUsedTbSig] = useState<string>(saved?.usedTbSig ?? tbSig);
 const [showLastYear, setShowLastYear] = useState(false);
 const [lastYearDragging, setLastYearDragging] = useState(false);
 const lastYearFileRef = useRef<HTMLInputElement>(null);
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

 const handleRefresh = () => {
 if (!tbAvailable && !tbReady) {
 toast.info("No trial balance data yet — import a trial balance first");
 return;
 }
 setTbReady(true);
 setEntityRows(prev => prev.map(row => {
 const opt = findBasis(row.basis);
 if (!opt?.tbKey) return {...row, extrapManual: false };
 return {...row, periodAmount: String(TB[opt.tbKey]), extrapManual: false };
 }));
 setUsedTbSig(tbSig);
 toast.success("Benchmarks refreshed from Trial Balance");
 };

 // Demo: dropping last year's materiality file prefills benchmarks, principal users and last year's comments (no real parsing)
 const applyLastYear = () => {
 setEntityRows(prev => prev.map(row => ({
 ...row,
 // no trial balance yet: there are no amounts to benchmark against, only last year's percentages
 ...(tbReady ? {} : { periodAmount: "", extrapolatedPeriod: "", materialityCY: "" }),
 benchmarkPct: row.basis === "grossRevenue" ? "2.00" : row.basis === "profitBeforeTax" ? "6.00" : row.benchmarkPct,
 pctManual: row.basis === "other" ? row.pctManual : false,
 comments: row.comments || (row.basis === "grossRevenue" ? "Last year: revenue benchmark at 2% — stable revenue base; users focus on top-line trends." : row.basis === "profitBeforeTax" ? "Last year: income before tax at 6% — earnings are the key measure for the lender and shareholders." : ""),
 })));
 setIntendedUsers([
 { id: uid(), user: "Lender", factors: "Covenant compliance (DSCR, current ratio) and quarterly reporting drive the lender's decisions." },
 { id: uid(), user: "Shareholders", factors: "Profitability, dividend capacity and the valuation of their investment." },
 ]);
 setLevels(prev => prev.map(l => (l.kind === "overall" || l.kind === "performance" || l.kind === "trivial") && !l.comments
 ? { ...l, comments: `Carried over from last year's materiality (${LEVEL_LABEL[l.kind].toLowerCase()}).` }
 : l));
 setPrefilled(true);
 setShowLastYear(false);
 toast.success("Prefilled from last year's materiality");
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
 const showBlank = !tbReady && !prefilled; // no trial balance data yet
 const rows = entityRows.map((r) => {
 if (showBlank) return {...r, anticipated: "", anticipatedNote: "", possible: "" };
 const ant = anticipatedFor(r, periodStart, periodEnd, now);
 return {...r, anticipated: ant.value, anticipatedNote: ant.note, possible: calcMatCY(ant.value || r.periodAmount, r.benchmarkPct) };
 });
 const refreshStale = !showBlank && usedTbSig !== tbSig;
 // Partial-data note: only while the period end is after today
 const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
 const periodEndDate = new Date(periodEnd + "T00:00:00");
 const partialData = !showBlank && !isNaN(periodEndDate.getTime()) && periodEndDate > startOfToday;
 // Latest source data date: end of the last closed month in the source
 const latestDataDate = new Date(now.getFullYear(), now.getMonth(), 0).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

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
 const p = pctOfLevel(l);
 return p === null || isNaN(base) ? null : base * p / 100;
 };

 const overallRow = levelOf("overall");
 const overallNum: number | null = !overallRow ? null
 : overallRow.method === "manual" ? (isNaN(toNum(overallRow.manual)) ? null : toNum(overallRow.manual))
 : (isNaN(toNum(criteriaOverall)) ? null : toNum(criteriaOverall));
 const overallBase = overallNum ?? NaN;

 // Lowest non-zero specific amount is the base for specific performance
 const specificAmounts = levels.filter(l => l.kind === "specific").map(l => toNum(l.manual)).filter(n => !isNaN(n) && n > 0);
 const specificBase = specificAmounts.length ? Math.min(...specificAmounts) : NaN; // tile value only

 const currentOf = (l: LevelRow): number | null => {
 switch (l.kind) {
 case "overall": return overallNum;
 case "performance":
 case "trivial": return calcFrom(l, overallBase);
 case "specPerformance": {
 const owner = levels.find(x => x.id === l.pairId);
 return calcFrom(l, owner ? toNum(owner.manual) : NaN);
 }
 default: return calcFrom(l, NaN);
 }
 };
 const isComputed = (l: LevelRow) => l.method !== "manual";
 const numStr = (n: number | null) => (n === null ? "" : String(Math.round(n * 100) / 100));

 const performanceNum = currentOf(levelOf("performance") ?? newLevel("performance", { method: "manual" }));
 const trivialNum = currentOf(levelOf("trivial") ?? newLevel("trivial", { method: "manual" }));
 const specificRows = levels.filter(l => l.kind === "specific");
 // PM of the Specific row with the lowest non-zero amount (the row the tile value comes from); never summed
 const lowestSpecific = specificRows.filter(l => toNum(l.manual) > 0).sort((x, y) => toNum(x.manual) - toNum(y.manual))[0];
 const lowestPair = lowestSpecific ? levels.find(l => l.kind === "specPerformance" && l.pairId === lowestSpecific.id) : undefined;
 const lowestPM: number | null = lowestPair ? currentOf(lowestPair) : null;
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
 concluded, periodStart, periodEnd, selectedRowId, entityRows, intendedUsers,
 qualDisclosures, levels, qualitative, conclusion, tbReady, prefilled, usedTbSig,
 });
 }, [stateKey, concluded, periodStart, periodEnd, selectedRowId, entityRows, intendedUsers, qualDisclosures, levels, qualitative, conclusion, tbReady, prefilled, usedTbSig]);

 const addLevel = (kind: LevelKind) => {
 if (kind === "adjPerformance" && adjCount >= MAX_ADJUSTED) return;
 if (kind === "specific") {
 const sp = newLevel("specific");
 setLevels(prev => [...prev, sp, newLevel("specPerformance", { pairId: sp.id })]);
 return;
 }
 setLevels(prev => [...prev, newLevel(kind)]);
 };

 // Fixed rows first, then the repeatable ones: adjusted performance, then each Specific row followed by its own pair
 const orderedLevels: LevelRow[] = [
 ...(["overall", "performance", "trivial"] as LevelKind[]).flatMap(k => levels.filter(l => l.kind === k)),
 ...levels.filter(l => l.kind === "adjPerformance"),
 ...levels.filter(l => l.kind === "specific").flatMap(sp => [sp, ...levels.filter(l => l.kind === "specPerformance" && l.pairId === sp.id)]),
 ];
 const title = "Materiality";
 const overallBasisLabel = (() => {
 const b = selectedRow ? findBasis(selectedRow.basis) : undefined;
 const lbl = b ? (selectedRow.basis === "other" ? (selectedRow.basisOther || "Other") : b.label) : "";
 return lbl && selectedRow ? `${lbl} × ${formatDisplay(selectedRow.benchmarkPct)}%` : "";
 })();
 const perfRow = levelOf("performance");
 const trivialRow = levelOf("trivial");
 const pctText = (l?: LevelRow, fallback = "Manual") => {
 const p = l ? pctOfLevel(l) : null;
 return p === null || !l ? fallback : `${l.method === "custom" ? "Custom " : ""}${p}% of overall`;
 };

 const tiles: { key: string; label: string; hint: string; value: string; luka?: boolean; locked?: boolean }[] = [
 { key: "overall", label: "Overall", hint: overallRow?.method === "manual" ? "Manual" : overallBasisLabel, value: overallStr, luka: isDemoEngagement && !!overallStr, locked: overallRow?.method !== "manual" },
 { key: "perf", label: "Performance", hint: `${pctText(perfRow)} · ${adjCount} adjusted`, value: performanceStr, locked: perfRow?.method !== "manual" },
 { key: "spec", label: "Specific", hint: `${specCount === 1 ? "1 item" : `${specCount > 1 ? "Lowest of " : ""}${specCount} items`} · specific PM ${lowestPM === null ? "—" : fmtInt(lowestPM)}`, value: showBlank || isNaN(specificBase) ? "" : formatNum(specificBase) },
 { key: "trivial", label: "Trivial", hint: pctText(trivialRow), value: trivialStr, locked: trivialRow?.method !== "manual" },
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
 {tiles.map((t) => {
 const shown = t.value ? formatDisplay(t.value) : "—";
 const tileInput = <TdInput value={shown} readOnly placeholder="0.00" luka={t.luka} className="h-10 text-lg font-semibold tabular-nums text-right" />;
 return (
 <div key={t.key} className={`${CARD} px-4 py-3 flex flex-col gap-1.5`}>
 <span className="text-sm font-semibold text-foreground">{t.label}</span>
 <span className="text-xs leading-4 text-muted-foreground min-h-[16px]">{t.hint}</span>
 {t.locked ? <LockWrap>{tileInput}</LockWrap> : tileInput}
 </div>
 );
 })}
 </div>

 {/* ── Criteria ── */}
 <div className={CARD}>
 <div className={`${CARD_HEAD} flex-wrap`}>
 <span className="text-sm font-semibold text-foreground">Criteria</span>
 <InfoTip text="Use professional judgment to set the highest amount of misstatement that could be included in the F/S without affecting the economic decisions of the users identified above. The selected line drives overall materiality." />
 <Input type="date" aria-label="Period start" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} className="h-8 text-sm w-44 pr-2" />
 <Input type="date" aria-label="Period end" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} className="h-8 text-sm w-44 pr-2" />
 {partialData && (
 <span className="inline-flex items-center h-7 rounded-full border border-amber-300 bg-amber-50 px-2.5 text-xs font-medium text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
 Data to {latestDataDate} — not full year-end
 </span>
 )}
 <div className="flex-1" />
 {!showBlank && (
 <>
 <Button variant="secondary" size="sm" onClick={() => setShowLastYear(true)} className="h-8 text-sm gap-1.5">
 <Sparkles className="h-3.5 w-3.5 text-[#8649F1]" />
 Use last year's materiality
 </Button>
 <Button size="sm" onClick={handleRefresh} className="h-8 text-sm gap-1.5">
 {refreshStale ? (
 <Tooltip>
 <TooltipTrigger asChild>
 <span className="inline-flex" aria-label="Refresh required"><AlertTriangle className="h-3.5 w-3.5 text-amber-300" /></span>
 </TooltipTrigger>
 <TooltipContent className="max-w-xs">Refresh required: the trial balance data or numbers have changed since materiality was last calculated</TooltipContent>
 </Tooltip>
 ) : (
 <RefreshCw className="h-3.5 w-3.5" />
 )}
 Refresh
 </Button>
 </>
 )}
 </div>
 {showBlank ? (
 <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
 <p className="text-sm font-semibold text-foreground">No trial balance data yet</p>
 <p className="text-sm text-muted-foreground max-w-md">Refresh to pull in the trial balance, or prefill from last year's materiality.</p>
 <div className="flex items-center gap-2">
 <Button variant="secondary" size="sm" onClick={() => setShowLastYear(true)} className="h-8 text-sm gap-1.5">
 <Sparkles className="h-3.5 w-3.5 text-[#8649F1]" />
 Use last year's materiality
 </Button>
 <Button size="sm" onClick={handleRefresh} className="h-8 text-sm gap-1.5">
 <RefreshCw className="h-3.5 w-3.5" />
 Refresh
 </Button>
 </div>
 </div>
 ) : (<>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="bg-muted border-b border-border">
 <th className="px-3 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-[64px]">Use</th>
 <th className="px-2 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider w-[220px] min-w-[220px]">Basis</th>
 <th className="px-2 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[140px]">Period to date</th>
 <th className="px-2 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[140px]">Anticipated</th>
 <th className="px-2 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider min-w-[140px]">Previous period</th>
 <th className="px-2 py-3 text-right text-sm font-semibold text-foreground uppercase tracking-wider w-[190px] min-w-[190px]">
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
 const customPctShown = !range || row.pctManual || !range.includes(pctNum);
 const rangeTip = range ? `Range ${range[0]}–${range[range.length - 1]}%` : "Manual entry";
 const pctInput = (
 <div className="relative w-16 shrink-0">
 <Input
 aria-label="Custom benchmark percentage"
 inputMode="decimal"
 value={row.benchmarkPct}
 onChange={(e) => patchRow(row.id, { benchmarkPct: e.target.value.replace(/[^0-9.]/g, ""), pctManual: true })}
 placeholder="0.00"
 className="h-8 text-sm text-right pl-2 pr-5 tabular-nums"
 />
 <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">%</span>
 </div>
 );
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
 <TdSelect wrap value={row.basis} onChange={(v) => handleBasisChange(row.id, v)} options={BASIS_OPTIONS} placeholder="Select basis…" />
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
 <MoneyField
 value={row.anticipated}
 locked
 lockTip={<><p>{LOCK_TIP}</p>{row.anticipatedNote && <p className="mt-0.5 text-muted-foreground">Anticipated: {row.anticipatedNote}</p>}</>}
 />
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
 <td className="px-2 py-2.5 align-top w-[190px] min-w-[190px]">
 <Tip text={rangeTip}>
 {range ? (
 <div className="flex items-center gap-1.5">
 <div className="flex-1 min-w-0">
 <TdSelect
 value={customPctShown ? "custom" : String(pctNum)}
 onChange={(v) => v === "custom" ? patchRow(row.id, { pctManual: true }) : patchRow(row.id, { benchmarkPct: Number(v).toFixed(2), pctManual: false })}
 options={[...range.map(n => ({ value: String(n), label: `${n}%` })), { value: "custom", label: "Custom…" }]}
 />
 </div>
 {customPctShown && pctInput}
 </div>
 ) : (
 <div className="flex justify-end">{pctInput}</div>
 )}
 </Tip>
 </td>
 <td className="px-2 py-2.5 align-top min-w-[140px]">
 <MoneyField value={row.possible} locked className={isSelected ? "font-semibold" : ""} />
 </td>
 <td className="px-2 py-2.5 align-top">
 <LukaTypingRow filled={isDemoEngagement && lukaFilledFields.has('mat-row-0-comments')}>
 <CommentField
 value={row.comments}
 onChange={(v) => { markEdited(`comments-${row.id}`); patchRow(row.id, { comments: v }); }}
 storageKey={`${attrBase}-criteria-${row.id}`}
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
 </>)}
 </div>

 {/* ── Materiality levels ── */}
 <div className={CARD}>
 <div className={CARD_HEAD}>
 <span className="text-sm font-semibold text-foreground">Materiality levels</span>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full table-fixed min-w-[1280px]">
 <colgroup>
 <col className="w-[190px]" />
 <col className="w-[220px]" />
 <col className="w-[230px]" />
 <col className="w-[150px]" />
 <col className="w-[140px]" />
 <col />
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
 value={specificRows.find(x => x.id === l.pairId)?.area ?? l.area}
 onChange={(v) => patchLevel(l.id, { area: v, areaManual: true })}
 placeholder="F/S area or disclosure"
 className="bg-muted/50"
 />
 ) : (
 <TdInput value={l.area} onChange={(v) => patchLevel(l.id, l.kind === "specPerformance" ? { area: v, areaManual: true } : { area: v })} placeholder="F/S area or disclosure" />
 )}
 </td>
 <td className="px-4 py-2.5 align-top">
 <div className="flex items-center gap-1.5">
 <div className="flex-1 min-w-0">
 <TdSelect
 value={l.method}
 onChange={(v) => patchLevel(l.id,
 v === "manual" && cur !== null && l.manual === "" ? { method: v, manual: numStr(cur) }
 : v === "custom" ? { method: v, customPct: l.customPct || (pctOfLevel(l) !== null ? String(pctOfLevel(l)) : "") }
 : { method: v })}
 options={METHOD_OPTIONS[l.kind]}
 />
 </div>
 {l.method === "custom" && (
 <div className="relative w-16 shrink-0">
 <Input
 aria-label="Custom percentage"
 inputMode="decimal"
 value={l.customPct}
 onChange={(e) => patchLevel(l.id, { customPct: e.target.value.replace(/[^0-9.]/g, "") })}
 placeholder="62"
 className="h-8 text-sm text-right pl-2 pr-5 tabular-nums"
 />
 <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">%</span>
 </div>
 )}
 </div>
 </td>
 <td className="px-4 py-2.5 align-top">
 <MoneyField
 value={computed ? numStr(cur) : l.manual}
 locked={computed}
 placeholder={computed ? "—" : "0.00"}
 onChange={(v) => patchLevel(l.id, { manual: v })}
 luka={l.kind === "overall" && isDemoEngagement && computed && !!numStr(cur)}
 />
 </td>
 <td className="px-4 py-2.5 align-top">
 <MoneyField value={l.py} onChange={(v) => patchLevel(l.id, { py: v })} placeholder="—" />
 </td>
 <td className="px-4 py-2.5 align-top">
 <CommentField value={l.comments} onChange={(v) => patchLevel(l.id, { comments: v })} storageKey={`${attrBase}-level-${l.id}`} placeholder="Comments…" />
 </td>
 <td className="px-2 py-2.5 align-top text-center">
 {repeatable && (
 <div className="flex h-8 items-center justify-center">
 <button aria-label={`Delete ${LEVEL_LABEL[l.kind].toLowerCase()} level`} onClick={() => setLevels(p => p.filter(x => x.id !== l.id && x.pairId !== l.id))} className={DEL_BTN}>
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
 {adjCount >= MAX_ADJUSTED ? (
 <Tooltip>
 <TooltipTrigger asChild>
 <div><DropdownMenuItem className="text-sm" disabled>Adjusted performance</DropdownMenuItem></div>
 </TooltipTrigger>
 <TooltipContent side="right">Maximum of two adjusted performance levels</TooltipContent>
 </Tooltip>
 ) : (
 <DropdownMenuItem className="text-sm cursor-pointer" onClick={() => addLevel("adjPerformance")}>Adjusted performance</DropdownMenuItem>
 )}
 <DropdownMenuItem className="text-sm cursor-pointer" onClick={() => addLevel("specific")}>Specific</DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 <p className="flex flex-1 items-start gap-1.5 text-sm text-muted-foreground min-w-[240px]">
 <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
 Maximum of two adjusted performance levels.
 </p>
 </div>
 <div className="border-t border-border px-6 py-3 bg-muted/20">
 <p className="text-sm text-muted-foreground">
 If overall materiality is lower than in previous audits, consider whether misstatements may exist in the opening balances. Document any changes in the materiality assessments and the final materiality on Form 335. Grey values are automated. Switch Method to Custom % or Manual to change them.
 </p>
 </div>
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
 <CommentField value={u.factors} onChange={(v) => setIntendedUsers((prev) => prev.map((x) => (x.id === u.id ? {...x, factors: v } : x)))} storageKey={`${attrBase}-user-${u.id}`} placeholder="Describe factors" />
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
 <th className="px-4 py-3 w-12" />
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {qualDisclosures.map((q) => (
 <tr key={q.id} className="hover:bg-muted/50 transition-colors">
 <td className="px-4 py-2.5 align-top">
 <CommentField
 value={q.text}
 onChange={(v) => setQualDisclosures(p => p.map(x => x.id === q.id ? {...x, text: v} : x))}
 storageKey={`${attrBase}-disclosure-${q.id}`}
 placeholder="Describe qualitative disclosures that could be material…"
 />
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
 <Button size="sm" variant="secondary" className="h-7 text-xs gap-1" onClick={() => setQualDisclosures(p => [...p, { id: uid(), text: "" }])}>
 <Plus className="h-3.5 w-3.5" />
 Add item
 </Button>
 </div>
 </div>

 {/* ── Qualitative considerations ── */}
 <div className={CARD}>
 <div className={CARD_HEAD}>
 <span className="text-sm font-semibold text-foreground">Qualitative considerations</span>
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
 <CommentField value={item.nature} onChange={(v) => setQualitative((prev) => prev.map((x) => (x.id === item.id ? {...x, nature: v } : x)))} storageKey={`${attrBase}-qnature-${item.id}`} placeholder="Describe Nature" />
 </td>
 <td className="px-4 py-2.5 align-top">
 <CommentField value={item.impact} onChange={(v) => setQualitative((prev) => prev.map((x) => (x.id === item.id ? {...x, impact: v } : x)))} storageKey={`${attrBase}-qimpact-${item.id}`} placeholder="Describe impact" />
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

 {/* ── Conclusion ── */}
 <div className={CARD}>
 <div className={CARD_HEAD}>
 <span className="text-sm font-semibold text-foreground">Conclusion</span>
 </div>
 <div className="px-6 py-5">
 <CommentField value={conclusion} onChange={setConclusion} storageKey={`${attrBase}-conclusion`} placeholder="Conclusion" />
 </div>
 <div className="px-6 py-3 border-t border-border flex justify-end">
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

 {/* Luka thread: drop last year's materiality (demo, no parsing) */}
 <Dialog open={showLastYear} onOpenChange={setShowLastYear}>
 <DialogContent className="max-w-lg">
 <DialogHeader>
 <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#8649F1]" />Luka</DialogTitle>
 <DialogDescription>Drop last year's materiality worksheet and I'll prefill the benchmark percentages, principal users and last year's comments.</DialogDescription>
 </DialogHeader>
 <div
 onDragOver={(e) => { e.preventDefault(); setLastYearDragging(true); }}
 onDragLeave={() => setLastYearDragging(false)}
 onDrop={(e) => { e.preventDefault(); setLastYearDragging(false); applyLastYear(); }}
 className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${lastYearDragging ? "border-[#8649F1] bg-[#8649F1]/10" : "border-[#8649F1]/50 bg-[#8649F1]/[0.03]"}`}
 >
 <p className="text-sm font-medium text-foreground">Drop last year's materiality file here</p>
 <Button type="button" variant="outline" size="sm" onClick={() => lastYearFileRef.current?.click()}>Choose file</Button>
 <input ref={lastYearFileRef} type="file" className="hidden" onChange={(e) => { if (e.target.files?.length) applyLastYear(); e.target.value = ""; }} />
 </div>
 </DialogContent>
 </Dialog>

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
