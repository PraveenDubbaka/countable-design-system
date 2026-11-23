import { Fragment, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
 ChevronDown,
 ChevronRight,
 Search,
 Download,
 Plus,
 Minimize2,
 RefreshCw,
 FileText,
 Pencil,
 Trash2,
 Bold,
 Italic,
 Underline,
 FolderOpen,
 Check,
 X,
} from "lucide-react";
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
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Row, Group, GROUPS } from "@/lib/tbGroups";
import { loadEngagements, getEngagementMeta } from "@/store/engagementsStore";
import { engagementsData as staticEngagementsData } from "@/data/engagementsData";
import { loadClients } from "@/data/clientsData";
import {
 buildBalanceSheet,
 buildIncomeStatement,
 type BalanceSheetData,
 type IncomeStatementData,
 type StatementLine,
 type StatementSection,
} from "@/lib/workbookStatements";
import { loadParticipants, type Participant } from "@/store/participantsStore";
import { loadPWWorksheet } from "@/store/partnershipWorksheetStore";
import { getEntityLabels, type EntityKind, type EntityLabels } from "@/lib/entityLabels";
import { buildCapitalStatement, toPublicEntities, type CapitalStatementData, type PublicCapitalEntity } from "@/lib/capitalStatement";

export type { Row, Group };

function resolveEngagement(engagementId: string | undefined) {
 const real = engagementId ? loadEngagements().find(e => e.id === engagementId) : undefined;
 const demo = engagementId ? staticEngagementsData[engagementId] : undefined;
 const client = real?.client ?? demo?.client ?? "Test123";
 const matchedClient = (() => {
 try {
 return loadClients().find(c => c.legalEntityName === client || c.entityName === client);
 } catch {
 return undefined;
 }
 })();
 return {
 id: engagementId || "—",
 client,
 type: real?.type ?? demo?.type ?? "Compilation (COM)",
 yearEnd: real?.yearEnd ?? demo?.yearEnd ?? "Dec 31, 2024",
 entityType: matchedClient?.entityType ?? "Corporation",
 // Only meaningful when entityType === "Trust" — see entityLabels.ts.
 trustVariant: (matchedClient?.trustVariant ?? "other") as "unit" | "other",
 // Set at Create Engagement time (doc section 4 item 1) but never enforced until now — see
 // CapitalStatementPreview's "Show" toggle below and CapitalStatementPage.tsx.
 capitalVisibility: (engagementId ? getEngagementMeta(engagementId).capitalVisibility : undefined) ?? "open",
 };
}

type FixedNavKey =
 | "tb-grouping"
 | "balance-sheet"
 | "income"
 | "capital-statement"
 | "cash-flows"
 | "notes"
 | "schedules";

const NAV_ITEMS: { id: FixedNavKey; label: string }[] = [
 { id: "tb-grouping", label: "Trial Balance Grouping" },
 { id: "balance-sheet", label: "Balance Sheet" },
 { id: "income", label: "Statement of Income (Loss)" },
 { id: "cash-flows", label: "Statement of Cash Flows" },
 { id: "notes", label: "Notes to Financial Information" },
];

const formatAmt = (n: number) => {
 if (Math.abs(n) < 0.005) return "0.00";
 const abs = Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
 return n < 0 ? `(${abs})` : abs;
};

// ── Schedules (foundation: a schedule is just an LS code pinned to a named page) ──────────
interface ScheduleDef {
 id: string;
 name: string;
 // The specific statement line (GROUPS id) this schedule details — not the broader LS code,
 // since one LS code (e.g. "40") spans many distinct, unrelated statement lines (Salaries,
 // Travel, Advertising…) that must never be forced to share one schedule.
 groupId: string;
}

const SCHEDULES_KEY = (engagementId: string) => `workbook-schedules-${engagementId}`;

function loadSchedules(engagementId: string): ScheduleDef[] {
 try {
 const raw = localStorage.getItem(SCHEDULES_KEY(engagementId));
 if (raw) return JSON.parse(raw);
 } catch { /* fall through */ }
 return [{ id: "sch-1", name: "Schedule 1 - Cash and cash equivalents", groupId: "g-a3" }];
}

function saveSchedules(engagementId: string, schedules: ScheduleDef[]): void {
 try { localStorage.setItem(SCHEDULES_KEY(engagementId), JSON.stringify(schedules)); } catch { /* ignore */ }
}

// ── Notes ──────────────────────────────────────────────────────────────────────────────
interface NoteEntry {
 id: string;
 title: string;
 body: string;
}

const NOTES_KEY = (engagementId: string) => `workbook-notes-${engagementId}`;

function loadNotes(engagementId: string): NoteEntry[] {
 try {
 const raw = localStorage.getItem(NOTES_KEY(engagementId));
 if (raw) return JSON.parse(raw);
 } catch { /* fall through */ }
 return [];
}

function saveNotes(engagementId: string, notes: NoteEntry[]): void {
 try { localStorage.setItem(NOTES_KEY(engagementId), JSON.stringify(notes)); } catch { /* ignore */ }
}

// ── Shared grouping-table pieces (Balance Sheet / Statement of Income) ───────────────────
function StatementSectionRows({
 sec,
 expandedLines,
 toggleLine,
 onAddSchedule,
 scheduleByGroupId,
}: {
 sec: StatementSection;
 expandedLines: Set<string>;
 toggleLine: (id: string) => void;
 onAddSchedule: (line: StatementLine) => void;
 scheduleByGroupId: Map<string, ScheduleDef>;
}) {
 return (
 <>
 <tr className="bg-muted/40 border-t border-border">
 <td colSpan={6} className="px-3 py-2 font-semibold text-sm text-foreground">{sec.label}</td>
 </tr>
 {sec.lines.map(line => {
 const expanded = expandedLines.has(line.id);
 const linkedSchedule = scheduleByGroupId.get(line.id);
 const leafGroup = GROUPS.find(g => g.id === line.id);
 return (
 <Fragment key={line.id}>
 <tr className="border-t border-border/60">
 <td className="px-3 py-2">
 <div className="flex items-center gap-2 font-medium text-foreground">
 <button onClick={() => toggleLine(line.id)} className="flex items-center gap-2" type="button">
 {expanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
 <input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-primary" onClick={e => e.stopPropagation()} />
 {line.label}
 </button>
 {linkedSchedule ? (
 <span className="text-xs font-semibold text-primary">({linkedSchedule.name.replace(/^Schedule (\d+).*/, "Schedule $1")})</span>
 ) : (
 <button
 onClick={() => onAddSchedule(line)}
 className="text-xs font-medium text-primary border border-primary/30 bg-primary/5 rounded-full px-2 py-0.5 hover:bg-primary/10"
 type="button"
 >
 + Schedule
 </button>
 )}
 </div>
 </td>
 <td className="px-3 py-2 text-primary font-medium">{line.ls}</td>
 <td className="px-3 py-2 text-muted-foreground">{line.mapNo || "—"}</td>
 <td className="px-3 py-2 text-center">
 <Plus className="h-3.5 w-3.5 text-muted-foreground inline-block" />
 </td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(line.cy)}</td>
 <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{formatAmt(line.py)}</td>
 </tr>
 {expanded && leafGroup?.rows.map(r => (
 <tr key={r.id} className="border-t border-border/30 text-muted-foreground">
 <td className="px-3 py-1.5 pl-10">{r.description}</td>
 <td className="px-3 py-1.5">{r.ls}</td>
 <td className="px-3 py-1.5">{r.mapNo || "—"}</td>
 <td />
 <td className="px-3 py-1.5 text-right tabular-nums">{formatAmt(r.final)}</td>
 <td className="px-3 py-1.5 text-right tabular-nums">{formatAmt(r.py1)}</td>
 </tr>
 ))}
 {expanded && (
 <tr className="text-foreground font-medium">
 <td className="px-3 py-1.5 pl-10">Total {line.label}</td>
 <td colSpan={3} />
 <td className="px-3 py-1.5 text-right tabular-nums">{formatAmt(line.cy)}</td>
 <td className="px-3 py-1.5 text-right tabular-nums">{formatAmt(line.py)}</td>
 </tr>
 )}
 </Fragment>
 );
 })}
 <tr className="border-t-2 border-border bg-muted/30 font-semibold">
 <td className="px-3 py-2">Total {sec.label}</td>
 <td colSpan={3} />
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(sec.cyTotal)}</td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(sec.pyTotal)}</td>
 </tr>
 </>
 );
}

function GroupingTableShell({ children }: { children: React.ReactNode }) {
 return (
 <div className="rounded-lg border border-border bg-card overflow-hidden">
 <table className="w-full text-sm">
 <thead>
 <tr className="bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground">
 <th className="px-3 py-3 text-left">Group Name</th>
 <th className="px-3 py-3 text-left w-16">LS</th>
 <th className="px-3 py-3 text-left w-24">Map No.</th>
 <th className="px-3 py-3 text-center w-28">Notes to FS</th>
 <th className="px-3 py-3 text-right w-32">Current Year</th>
 <th className="px-3 py-3 text-right w-32">Prior Year</th>
 </tr>
 </thead>
 <tbody>{children}</tbody>
 </table>
 </div>
 );
}

// ── Balance Sheet ─────────────────────────────────────────────────────────────────────────
function BalanceSheetCentre({ bs, expandedLines, toggleLine, onAddSchedule, scheduleByGroupId }: {
 bs: BalanceSheetData;
 expandedLines: Set<string>;
 toggleLine: (id: string) => void;
 onAddSchedule: (line: StatementLine) => void;
 scheduleByGroupId: Map<string, ScheduleDef>;
}) {
 const rowProps = { expandedLines, toggleLine, onAddSchedule, scheduleByGroupId };
 return (
 <GroupingTableShell>
 <tr className="bg-muted/60"><td colSpan={6} className="px-3 py-2 font-bold text-foreground">Assets</td></tr>
 <StatementSectionRows sec={bs.currentAssets} {...rowProps} />
 <StatementSectionRows sec={bs.longTermAssets} {...rowProps} />
 <tr className="bg-muted/60 font-bold">
 <td className="px-3 py-2">Total Assets</td><td colSpan={3} />
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(bs.totalAssetsCy)}</td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(bs.totalAssetsPy)}</td>
 </tr>
 <tr className="bg-muted/60"><td colSpan={6} className="px-3 py-2 font-bold text-foreground">Liabilities</td></tr>
 <StatementSectionRows sec={bs.currentLiabilities} {...rowProps} />
 <StatementSectionRows sec={bs.longTermLiabilities} {...rowProps} />
 <tr className="bg-muted/60 font-bold">
 <td className="px-3 py-2">Total Liabilities</td><td colSpan={3} />
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(bs.totalLiabilitiesCy)}</td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(bs.totalLiabilitiesPy)}</td>
 </tr>
 <tr className="bg-muted/60"><td colSpan={6} className="px-3 py-2 font-bold text-foreground">Equity</td></tr>
 <StatementSectionRows sec={bs.equity} {...rowProps} />
 <tr className="bg-muted/60 font-bold">
 <td className="px-3 py-2">Total Liabilities and Equity</td><td colSpan={3} />
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(bs.totalLiabEquityCy)}</td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(bs.totalLiabEquityPy)}</td>
 </tr>
 </GroupingTableShell>
 );
}

function BalanceSheetPreview({ bs, client, yearEnd, scheduleByGroupId }: {
 bs: BalanceSheetData; client: string; yearEnd: string; scheduleByGroupId: Map<string, ScheduleDef>;
}) {
 const lineLabel = (l: StatementLine) => {
 const sch = scheduleByGroupId.get(l.id);
 return sch ? `${l.label} (${sch.name.replace(/^Schedule (\d+).*/, "Schedule $1")})` : l.label;
 };
 const row = (l: StatementLine) => (
 <div key={l.id} className="flex justify-between py-0.5 pl-4 text-[13px]">
 <span className="italic text-foreground">{lineLabel(l)}</span>
 <span className="flex gap-10 tabular-nums">
 <span className="w-20 text-right">{formatAmt(l.cy)}</span>
 <span className="w-20 text-right text-muted-foreground">{formatAmt(l.py)}</span>
 </span>
 </div>
 );
 const subtotal = (label: string, cy: number, py: number, bold = false) => (
 <div className={cn("flex justify-between py-1 border-t border-border/50 text-[13px]", bold && "font-bold")}>
 <span>{label}</span>
 <span className="flex gap-10 tabular-nums">
 <span className="w-20 text-right">{formatAmt(cy)}</span>
 <span className="w-20 text-right">{formatAmt(py)}</span>
 </span>
 </div>
 );
 return (
 <div className="bg-white text-[#1B2533] p-8 text-sm font-serif">
 <div className="text-center mb-6">
 <h2 className="text-lg font-bold">{client}</h2>
 <h3 className="text-base font-bold">Balance Sheet</h3>
 <p className="text-xs text-muted-foreground mt-1">As at {yearEnd}</p>
 </div>
 <div className="flex justify-end gap-10 text-xs font-semibold text-muted-foreground mb-1 pr-0">
 <span className="w-20 text-right">{yearEnd}</span>
 <span className="w-20 text-right">Prior Year</span>
 </div>
 <p className="font-bold mt-2">Assets</p>
 <p className="font-semibold pl-2">Current assets</p>
 {bs.currentAssets.lines.map(row)}
 {subtotal("Total current assets", bs.currentAssets.cyTotal, bs.currentAssets.pyTotal)}
 <p className="font-semibold pl-2 mt-2">Long-term assets</p>
 {bs.longTermAssets.lines.map(row)}
 {subtotal("Total assets", bs.totalAssetsCy, bs.totalAssetsPy, true)}
 <p className="font-bold mt-4">Liabilities</p>
 <p className="font-semibold pl-2">Current liabilities</p>
 {bs.currentLiabilities.lines.map(row)}
 {subtotal("Total current liabilities", bs.currentLiabilities.cyTotal, bs.currentLiabilities.pyTotal)}
 <p className="font-semibold pl-2 mt-2">Long-term liabilities</p>
 {bs.longTermLiabilities.lines.map(row)}
 {subtotal("Total liabilities", bs.totalLiabilitiesCy, bs.totalLiabilitiesPy, true)}
 <p className="font-bold mt-4">Equity</p>
 {bs.equity.lines.map(row)}
 {subtotal("Total liabilities and equity", bs.totalLiabEquityCy, bs.totalLiabEquityPy, true)}
 <div className="mt-4">
 {bs.balancesCy ? (
 <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><Check className="h-3.5 w-3.5" /> Balance sheet balances</span>
 ) : (
 <span className="text-xs font-semibold text-destructive">Difference: {formatAmt(bs.totalAssetsCy - bs.totalLiabEquityCy)}</span>
 )}
 </div>
 </div>
 );
}

// ── Statement of Income ──────────────────────────────────────────────────────────────────
function IncomeStatementCentre({ is, expandedLines, toggleLine, onAddSchedule, scheduleByGroupId }: {
 is: IncomeStatementData;
 expandedLines: Set<string>;
 toggleLine: (id: string) => void;
 onAddSchedule: (line: StatementLine) => void;
 scheduleByGroupId: Map<string, ScheduleDef>;
}) {
 const rowProps = { expandedLines, toggleLine, onAddSchedule, scheduleByGroupId };
 return (
 <GroupingTableShell>
 <StatementSectionRows sec={is.revenue} {...rowProps} />
 <StatementSectionRows sec={is.expenses} {...rowProps} />
 <tr className="bg-muted/60 font-bold">
 <td className="px-3 py-2">Net income (loss)</td><td colSpan={3} />
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(is.netIncomeCy)}</td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(is.netIncomePy)}</td>
 </tr>
 </GroupingTableShell>
 );
}

function IncomeStatementPreview({ is, client, yearEnd }: { is: IncomeStatementData; client: string; yearEnd: string }) {
 const row = (l: StatementLine) => (
 <div key={l.id} className="flex justify-between py-0.5 pl-4 text-[13px]">
 <span className="italic text-foreground">{l.label}</span>
 <span className="flex gap-10 tabular-nums">
 <span className="w-20 text-right">{formatAmt(l.cy)}</span>
 <span className="w-20 text-right text-muted-foreground">{formatAmt(l.py)}</span>
 </span>
 </div>
 );
 const subtotal = (label: string, cy: number, py: number, bold = false) => (
 <div className={cn("flex justify-between py-1 border-t border-border/50 text-[13px]", bold && "font-bold")}>
 <span>{label}</span>
 <span className="flex gap-10 tabular-nums">
 <span className="w-20 text-right">{formatAmt(cy)}</span>
 <span className="w-20 text-right">{formatAmt(py)}</span>
 </span>
 </div>
 );
 return (
 <div className="bg-white text-[#1B2533] p-8 text-sm font-serif">
 <div className="text-center mb-6">
 <h2 className="text-lg font-bold">{client}</h2>
 <h3 className="text-base font-bold">Statement of Income (Loss) and Retained Earnings (Deficit)</h3>
 <p className="text-xs text-muted-foreground mt-1">For the year ended {yearEnd}</p>
 </div>
 <div className="flex justify-end gap-10 text-xs font-semibold text-muted-foreground mb-1">
 <span className="w-20 text-right">{yearEnd}</span>
 <span className="w-20 text-right">Prior Year</span>
 </div>
 <p className="font-bold mt-2">Revenue</p>
 {is.revenue.lines.map(row)}
 {subtotal("Total revenue", is.revenue.cyTotal, is.revenue.pyTotal)}
 <p className="font-bold mt-4">Expenses</p>
 {is.expenses.lines.map(row)}
 {subtotal("Total expenses", is.expenses.cyTotal, is.expenses.pyTotal)}
 {subtotal("Net income (loss)", is.netIncomeCy, is.netIncomePy, true)}
 {subtotal("Retained earnings (deficit), beginning of year", is.openingRetainedEarningsCy, is.openingRetainedEarningsPy)}
 {subtotal("Retained earnings (deficit), end of year", is.closingRetainedEarningsCy, is.closingRetainedEarningsPy, true)}
 <div className="mt-4">
 {Math.abs(is.differenceCy) < 0.005 ? (
 <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><Check className="h-3.5 w-3.5" /> Agrees with Balance Sheet equity</span>
 ) : (
 <span className="text-xs font-semibold text-destructive">Difference vs. Balance Sheet: {formatAmt(is.differenceCy)}</span>
 )}
 </div>
 </div>
 );
}

// ── Statement of Partners'/Unitholders' Capital (P10) ───────────────────────────────────────
function CapitalStatementCentre({ data, labels, client, yearEnd, detail, capitalVisibility = "open", onGoToIncome }: {
 data: CapitalStatementData;
 labels: EntityLabels;
 client: string;
 yearEnd: string;
 detail: CapDetail;
 capitalVisibility?: "open" | "restricted" | "partnerOnly";
 onGoToIncome: () => void;
}) {
 const hasAdj = Math.abs(data.totals.adjustments) > 0.005;
 const manyHolders = data.rows.length > 12;
 const visibilityRestricted = capitalVisibility !== "open";
 return (
 <div className="flex flex-col gap-6">
 <CapitalStatementHeader client={client} title={labels.statementTitle} yearEnd={yearEnd} />

 {(manyHolders && detail === "individual") || visibilityRestricted ? (
 <div className="flex flex-col gap-1">
 {manyHolders && detail === "individual" && (
 <p className="text-[11px] text-muted-foreground">{data.rows.length} {labels.holders.toLowerCase()}: too many to show individually — grouped by class.</p>
 )}
 {visibilityRestricted && (
 <p className="text-[11px] text-muted-foreground">
 Capital visibility is set to {capitalVisibility === "partnerOnly" ? "Partner-only" : "Restricted"} for this engagement — each {labels.holder.toLowerCase()}'s individual figures are hidden here; use the Partner package export to share one {labels.holder.toLowerCase()}'s own account.
 </p>
 )}
 </div>
 ) : null}

 <GroupingTableShell>
 <tr className="border-t border-border/60">
 <td className="px-3 py-2 font-medium text-foreground">Balance, beginning of year</td>
 <td colSpan={3} />
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(data.totals.opening)}</td>
 <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">—</td>
 </tr>
 <tr className="border-t border-border/60">
 <td className="px-3 py-2 font-medium text-foreground">{labels.contributions}</td>
 <td colSpan={3} />
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(data.totals.contributions)}</td>
 <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">—</td>
 </tr>
 <tr className="border-t border-border/60">
 <td className="px-3 py-2">
 <button type="button" onClick={onGoToIncome} className="font-medium text-primary hover:underline">
 Net income allocated <span className="text-muted-foreground font-normal">(from Statement of Income (Loss))</span>
 </button>
 </td>
 <td colSpan={3} />
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(data.totals.ni)}</td>
 <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">—</td>
 </tr>
 <tr className="border-t border-border/60">
 <td className="px-3 py-2 font-medium text-foreground">{labels.drawings}</td>
 <td colSpan={3} />
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(-data.totals.drawings)}</td>
 <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">—</td>
 </tr>
 {hasAdj && (
 <tr className="border-t border-border/60">
 <td className="px-3 py-2 font-medium text-foreground">Adjustments</td>
 <td colSpan={3} />
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(data.totals.adjustments)}</td>
 <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">—</td>
 </tr>
 )}
 <tr className="border-t-2 border-border bg-muted/30 font-bold">
 <td className="px-3 py-2">Balance, end of year</td>
 <td colSpan={3} />
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(data.totals.closing)}</td>
 <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">—</td>
 </tr>
 </GroupingTableShell>

 <div className="rounded-lg border border-border bg-card p-4">
 <h3 className="text-sm font-semibold text-foreground mb-3">Allocation by {labels.holder.toLowerCase()} (from worksheet {labels.worksheetCode})</h3>
 {data.rows.length === 0 ? (
 <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground border border-dashed border-border rounded-xl">
 <FolderOpen className="h-8 w-8" />
 <p className="text-sm">No {labels.holders.toLowerCase()} recorded in the {labels.worksheetName} worksheet yet.</p>
 </div>
 ) : (
 <>
 <table className="w-full text-sm">
 <thead>
 <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-left">
 <th className="px-3 py-2">Class</th>
 <th className="px-3 py-2 text-right">{labels.holders}</th>
 <th className="px-3 py-2 text-right">{labels.allocationHeader}</th>
 <th className="px-3 py-2 text-right">Opening</th>
 <th className="px-3 py-2 text-right">Net income</th>
 <th className="px-3 py-2 text-right">{labels.drawings}</th>
 <th className="px-3 py-2 text-right">Closing</th>
 </tr>
 </thead>
 <tbody>
 {data.classTotals.map(c => (
 <tr key={c.key} className="border-t border-border/60">
 <td className="px-3 py-2">{c.label}</td>
 <td className="px-3 py-2 text-right tabular-nums">{c.count}</td>
 <td className="px-3 py-2 text-right tabular-nums">{c.pctTotal.toFixed(2)}%</td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(c.opening)}</td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(c.ni)}</td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(-c.drawings)}</td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(c.closing)}</td>
 </tr>
 ))}
 <tr className="border-t-2 border-border font-semibold">
 <td className="px-3 py-2">Total</td>
 <td className="px-3 py-2 text-right tabular-nums">{data.rows.length}</td>
 <td className="px-3 py-2 text-right tabular-nums">{data.pctTotal.toFixed(2)}%</td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(data.totals.opening)}</td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(data.totals.ni)}</td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(-data.totals.drawings)}</td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(data.totals.closing)}</td>
 </tr>
 </tbody>
 </table>
 <div className="flex items-center gap-2 mt-3 flex-wrap">
 {Math.abs(data.totals.closing - data.balanceSheetCapital) < 0.005 ? (
 <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
 <Check className="h-3.5 w-3.5" />Worksheet closing agrees to balance sheet {formatAmt(data.balanceSheetCapital)}
 </span>
 ) : (
 <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
 <X className="h-3.5 w-3.5" />Worksheet closing does not agree to balance sheet {formatAmt(data.balanceSheetCapital)} (difference {formatAmt(data.totals.closing - data.balanceSheetCapital)})
 </span>
 )}
 </div>
 </>
 )}
 </div>
 </div>
 );
}

type CapLayout = "vertical" | "horizontal";
type CapDetail = "individual" | "class" | "total";
type CapRowKey = "opening" | "contributions" | "ni" | "drawings" | "adjustments";

type CapEntity = PublicCapitalEntity;

function capitalEntities(data: CapitalStatementData, detail: CapDetail): CapEntity[] {
 if (detail === "individual") {
 return toPublicEntities(data.rows);
 }
 if (detail === "class") {
 return data.classTotals.map(c => ({ name: c.label, opening: c.opening, contributions: c.contributions, ni: c.ni, drawings: c.drawings, adjustments: c.adjustments, closing: c.closing }));
 }
 return [];
}

function CapRow({ label, v, bold }: { label: string; v: number; bold?: boolean }) {
 return (
 <div className={cn("flex justify-between py-0.5 text-[13px]", bold && "font-bold border-t border-border/50 pt-1 mt-0.5")}>
 <span className={cn(!bold && "italic text-foreground")}>{label}</span>
 <span className="w-24 text-right tabular-nums">{formatAmt(v)}</span>
 </div>
 );
}

// Shared statement header — same serif title block the centre builder and the preview both show,
// so opening the preview never looks like a different document from what you were just editing.
function CapitalStatementHeader({ client, title, yearEnd }: { client: string; title: string; yearEnd: string }) {
 return (
 <div className="text-center font-serif">
 <h2 className="text-lg font-bold">{client}</h2>
 <h3 className="text-base font-bold">{title}</h3>
 <p className="text-xs text-muted-foreground mt-1">For the year ended {yearEnd}</p>
 </div>
 );
}

// Shared pill-style segmented control — used for the Layout/Show toggles (now in the centre panel).
// A single button that shows the current selection up front (e.g. "Layout: Partners down") and
// opens a dropdown to change it — used for the Capital Statement's Layout/Show controls instead
// of a permanently-expanded segmented control.
function CapControlDropdown({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string; disabled?: boolean }[]; onChange: (v: string) => void }) {
 const current = options.find(o => o.value === value);
 return (
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="outline" className="h-9 gap-1.5 text-xs bg-card border-border hover:bg-muted">
 <span className="text-muted-foreground font-medium">{label}:</span>
 <span className="font-semibold text-foreground">{current?.label}</span>
 <ChevronDown className="h-3.5 w-3.5 opacity-60" />
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="start">
 {options.map(o => (
 <DropdownMenuItem key={o.value} disabled={o.disabled} onClick={() => onChange(o.value)} className="gap-2">
 <Check className={cn("h-3.5 w-3.5", value === o.value ? "opacity-100 text-primary" : "opacity-0")} />
 {o.label}
 </DropdownMenuItem>
 ))}
 </DropdownMenuContent>
 </DropdownMenu>
 );
}

function CapitalStatementPreview({ data, labels, client, yearEnd, layout, detail }: {
 data: CapitalStatementData; labels: EntityLabels; client: string; yearEnd: string;
 layout: CapLayout; detail: CapDetail;
}) {
 const hasAdj = Math.abs(data.totals.adjustments) > 0.005;
 const ents = capitalEntities(data, detail);
 const rowKeys: CapRowKey[] = ["opening", "contributions", "ni", "drawings", ...(hasAdj ? ["adjustments" as const] : [])];
 const rowLabel = (k: CapRowKey) =>
 k === "opening" ? "Balance, beginning of year" :
 k === "contributions" ? labels.contributions :
 k === "ni" ? "Net income allocated" :
 k === "drawings" ? labels.drawings : "Adjustments";
 const rowVal = (o: { opening: number; contributions: number; ni: number; drawings: number; adjustments: number }, k: CapRowKey) =>
 k === "drawings" ? -o.drawings : o[k];

 const totalEntity: CapEntity = { name: "Total", opening: data.totals.opening, contributions: data.totals.contributions, ni: data.totals.ni, drawings: data.totals.drawings, adjustments: data.totals.adjustments, closing: data.totals.closing };

 return (
 <div className="bg-white text-[#1B2533] text-sm">
 <div className="p-8 font-serif">
 <div className="mb-6">
 <CapitalStatementHeader client={client} title={labels.statementTitle} yearEnd={yearEnd} />
 </div>
 {layout === "horizontal" ? (
 <div className="overflow-x-auto">
 <table className="w-full text-[13px]">
 <thead>
 <tr>
 <th></th>
 {ents.map(e => <th key={e.name} className="text-right font-semibold px-2 py-1 whitespace-nowrap">{e.name}</th>)}
 <th className="text-right font-semibold px-2 py-1">Total</th>
 </tr>
 </thead>
 <tbody>
 {rowKeys.map(k => (
 <tr key={k} className="border-t border-border/40">
 <td className="py-1 italic">{rowLabel(k)}</td>
 {ents.map(e => <td key={e.name} className="text-right tabular-nums px-2 py-1">{formatAmt(rowVal(e, k))}</td>)}
 <td className="text-right tabular-nums px-2 py-1 font-medium">{formatAmt(rowVal(data.totals, k))}</td>
 </tr>
 ))}
 <tr className="border-t-2 border-border font-bold">
 <td className="py-1">Balance, end of year</td>
 {ents.map(e => <td key={e.name} className="text-right tabular-nums px-2 py-1">{formatAmt(e.closing)}</td>)}
 <td className="text-right tabular-nums px-2 py-1">{formatAmt(data.totals.closing)}</td>
 </tr>
 </tbody>
 </table>
 </div>
 ) : (
 <div className="flex flex-col gap-4">
 {(ents.length ? ents : [totalEntity]).map(e => (
 <div key={e.name}>
 <p className="font-semibold mb-1">{e.name}</p>
 <div className="pl-3 flex flex-col gap-0.5">
 <CapRow label="Balance, beginning of year" v={e.opening} />
 <CapRow label={labels.contributions} v={e.contributions} />
 <CapRow label="Net income allocated" v={e.ni} />
 <CapRow label={labels.drawings} v={-e.drawings} />
 {hasAdj && <CapRow label="Adjustments" v={e.adjustments} />}
 <CapRow label="Balance, end of year" v={e.closing} bold />
 </div>
 </div>
 ))}
 </div>
 )}
 <div className="mt-4">
 {data.rows.length === 0 ? null : Math.abs(data.totals.closing - data.balanceSheetCapital) < 0.005 ? (
 <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><Check className="h-3.5 w-3.5" /> Agrees with Balance Sheet {labels.capitalLabel.toLowerCase()}</span>
 ) : (
 <span className="text-xs font-semibold text-destructive">Difference vs. Balance Sheet: {formatAmt(data.totals.closing - data.balanceSheetCapital)}</span>
 )}
 </div>
 </div>
 </div>
 );
}

// ── Notes ─────────────────────────────────────────────────────────────────────────────────
function NotesScreen({ engagementId }: { engagementId: string }) {
 const [notes, setNotes] = useState<NoteEntry[]>(() => loadNotes(engagementId));

 const update = (next: NoteEntry[]) => {
 setNotes(next);
 saveNotes(engagementId, next);
 };
 const addNote = () => {
 update([...notes, { id: Math.random().toString(36).slice(2, 9), title: `Note ${notes.length + 1}`, body: "" }]);
 };
 const removeNote = (id: string) => update(notes.filter(n => n.id !== id));
 const updateNote = (id: string, patch: Partial<NoteEntry>) =>
 update(notes.map(n => (n.id === id ? { ...n, ...patch } : n)));

 return (
 <div className="max-w-4xl mx-auto">
 <div className="flex items-center justify-end mb-4">
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button className="gap-1.5">Add notes <ChevronDown className="h-3.5 w-3.5" /></Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuItem onClick={addNote}>Blank note</DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 </div>
 {notes.length === 0 ? (
 <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground border border-dashed border-border rounded-xl">
 <FolderOpen className="h-10 w-10" />
 <p className="font-medium text-foreground">No notes added yet</p>
 </div>
 ) : (
 <div className="flex flex-col gap-4">
 {notes.map(n => (
 <div key={n.id} className="border border-border rounded-xl p-4 bg-card">
 <div className="flex items-center justify-between mb-2">
 <Input
 value={n.title}
 onChange={e => updateNote(n.id, { title: e.target.value })}
 className="font-semibold border-none px-0 h-7 text-base focus-visible:ring-0"
 />
 <button onClick={() => removeNote(n.id)} className="text-muted-foreground hover:text-destructive">
 <Trash2 className="h-4 w-4" />
 </button>
 </div>
 <Textarea
 value={n.body}
 onChange={e => updateNote(n.id, { body: e.target.value })}
 placeholder="Add note content…"
 className="min-h-[90px]"
 />
 </div>
 ))}
 </div>
 )}
 </div>
 );
}

// ── Schedule detail ───────────────────────────────────────────────────────────────────────
interface ScheduleRowState { id: string; description: string; cy: number; py: number }

function ScheduleDetailScreen({ schedule, onRename, onDelete }: {
 schedule: ScheduleDef;
 onRename: (name: string) => void;
 onDelete: () => void;
}) {
 const seedRows = useMemo<ScheduleRowState[]>(() => {
 const accs = GROUPS.find(g => g.id === schedule.groupId)?.rows ?? [];
 return accs.map(r => ({ id: r.id, description: r.description, cy: r.final, py: r.py1 }));
 }, [schedule.groupId]);
 const [rows, setRows] = useState<ScheduleRowState[]>(seedRows);
 const [bold, setBold] = useState(false);
 const [italic, setItalic] = useState(false);
 const [underline, setUnderline] = useState(false);
 const [editing, setEditing] = useState(false);

 const total = rows.reduce((acc, r) => ({ cy: acc.cy + r.cy, py: acc.py + r.py }), { cy: 0, py: 0 });

 const updateRow = (id: string, patch: Partial<ScheduleRowState>) =>
 setRows(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
 const addRow = () => setRows(prev => [...prev, { id: Math.random().toString(36).slice(2, 9), description: "", cy: 0, py: 0 }]);

 return (
 <div className="max-w-5xl mx-auto">
 <div className="flex items-center gap-2 mb-4">
 <button onClick={() => setBold(v => !v)} className={cn("h-8 w-8 rounded border border-border flex items-center justify-center", bold && "bg-primary/10 text-primary")}><Bold className="h-3.5 w-3.5" /></button>
 <button onClick={() => setItalic(v => !v)} className={cn("h-8 w-8 rounded border border-border flex items-center justify-center", italic && "bg-primary/10 text-primary")}><Italic className="h-3.5 w-3.5" /></button>
 <button onClick={() => setUnderline(v => !v)} className={cn("h-8 w-8 rounded border border-border flex items-center justify-center", underline && "bg-primary/10 text-primary")}><Underline className="h-3.5 w-3.5" /></button>
 <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Apply</Button>
 <Button variant="ghost" size="sm" onClick={() => { setRows(seedRows); setEditing(false); }}>Cancel</Button>
 <div className="ml-auto flex items-center gap-2">
 <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => setRows(seedRows)}><RefreshCw className="h-3.5 w-3.5" />Reset</Button>
 <Button variant="destructive" size="sm" className="gap-1.5" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" />Delete</Button>
 <Button size="sm">Save</Button>
 </div>
 </div>
 <div className="text-center mb-6">
 <h2 className={cn("text-xl font-bold", bold && "font-extrabold", italic && "italic", underline && "underline")} onDoubleClick={() => setEditing(true)}>
 {editing ? (
 <input
 autoFocus
 defaultValue={schedule.name}
 onBlur={e => { onRename(e.target.value); setEditing(false); }}
 className="text-center border border-border rounded px-2 py-1"
 />
 ) : schedule.name}
 </h2>
 </div>
 <div className="rounded-lg border border-border bg-card overflow-hidden">
 <table className="w-full text-sm">
 <thead>
 <tr className="bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground">
 <th className="px-3 py-3 text-left">Description</th>
 <th className="px-3 py-3 text-left w-40">Search</th>
 <th className="px-3 py-3 text-right w-36">Current Year</th>
 <th className="px-3 py-3 text-right w-36">Prior Year</th>
 </tr>
 </thead>
 <tbody>
 {rows.map(r => (
 <tr key={r.id} className="border-t border-border">
 <td className="px-3 py-2">
 <Input value={r.description} onChange={e => updateRow(r.id, { description: e.target.value })} className="h-8" />
 </td>
 <td className="px-3 py-2">
 <div className="relative">
 <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
 <Input placeholder="Search" className="h-8 pl-7" />
 </div>
 </td>
 <td className="px-3 py-2">
 <Input type="number" value={r.cy} onChange={e => updateRow(r.id, { cy: Number(e.target.value) || 0 })} className="h-8 text-right" />
 </td>
 <td className="px-3 py-2">
 <Input type="number" value={r.py} onChange={e => updateRow(r.id, { py: Number(e.target.value) || 0 })} className="h-8 text-right" />
 </td>
 </tr>
 ))}
 <tr>
 <td colSpan={4} className="px-3 py-2">
 <button onClick={addRow} className="text-sm font-medium text-primary flex items-center gap-1"><Plus className="h-3.5 w-3.5" />Add Row</button>
 </td>
 </tr>
 <tr className="border-t-2 border-border bg-muted/30 font-semibold">
 <td className="px-3 py-2">Total</td>
 <td />
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(total.cy)}</td>
 <td className="px-3 py-2 text-right tabular-nums">{formatAmt(total.py)}</td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
 );
}

export default function Workbook() {
 const { engagementId } = useParams<{ engagementId: string }>();
 const engagement = resolveEngagement(engagementId);
 const engId = engagementId ?? "default";

 const [active, setActive] = useState<string>("tb-grouping");
 const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
 const [expandedLines, setExpandedLines] = useState<Set<string>>(new Set());
 const [search, setSearch] = useState("");
 const [sidebarOpen, setSidebarOpen] = useState(true);
 const [schedules, setSchedules] = useState<ScheduleDef[]>(() => loadSchedules(engId));

 // Force light theme on this page for consistent white workbook experience
 useEffect(() => {
 const root = document.documentElement;
 const hadDark = root.classList.contains("dark");
 if (hadDark) root.classList.remove("dark");
 return () => {
 if (hadDark) root.classList.add("dark");
 };
 }, []);

 const toggleGroup = (id: string) =>
 setCollapsedGroups((prev) => {
 const n = new Set(prev);
 n.has(id) ? n.delete(id) : n.add(id);
 return n;
 });
 const toggleLine = (id: string) =>
 setExpandedLines((prev) => {
 const n = new Set(prev);
 n.has(id) ? n.delete(id) : n.add(id);
 return n;
 });

 const updateSchedules = (next: ScheduleDef[]) => {
 setSchedules(next);
 saveSchedules(engId, next);
 };
 const addSchedule = (line: StatementLine) => {
 if (schedules.some(s => s.groupId === line.id)) return;
 const name = `Schedule ${schedules.length + 1} - ${line.label}`;
 const next = [...schedules, { id: `sch-${Date.now()}`, name, groupId: line.id }];
 updateSchedules(next);
 setActive(`schedule:${next[next.length - 1].id}`);
 };
 const scheduleByGroupId = useMemo(() => new Map(schedules.map(s => [s.groupId, s] as const)), [schedules]);

 const balanceSheet = useMemo(() => buildBalanceSheet(), []);
 const incomeStatement = useMemo(() => buildIncomeStatement(balanceSheet), [balanceSheet]);

 const isPartnershipOrTrust = engagement.entityType === "Partnership" || engagement.entityType === "Trust";
 const labels = isPartnershipOrTrust ? getEntityLabels(engagement.entityType as EntityKind, engagement.trustVariant) : null;
 const participants = useMemo<Participant[]>(() => (isPartnershipOrTrust ? loadParticipants(engId) : []), [engId, isPartnershipOrTrust]);
 const pwWorksheet = useMemo(() => loadPWWorksheet(engId), [engId]);
 const capitalStatement = useMemo(
 () => (isPartnershipOrTrust ? buildCapitalStatement(engId, engagement.entityType as EntityKind, participants, pwWorksheet, engagement.trustVariant) : null),
 [engId, isPartnershipOrTrust, engagement.entityType, engagement.trustVariant, participants, pwWorksheet]
 );
 // Layout/Show now live in the centre panel (not the preview) and control what the preview
 // renders when expanded — the preview itself is left settings-free, matching the centre area.
 const [capLayout, setCapLayout] = useState<CapLayout>("vertical");
 const [capDetail, setCapDetail] = useState<CapDetail>(() =>
 ((capitalStatement?.rows.length ?? 0) > 12 || engagement.capitalVisibility !== "open") ? "class" : "individual"
 );
 // Minimised by default for every statement's preview (Balance Sheet, Income, Capital
 // Statement) — a thin trigger tab on the right slides it open on click, same control
 // regardless of which statement is active.
 const [previewCollapsed, setPreviewCollapsed] = useState(true);

 const navItems = useMemo(() => {
 const items = [...NAV_ITEMS];
 if (isPartnershipOrTrust && labels) {
 const incomeIdx = items.findIndex(i => i.id === "income");
 items.splice(incomeIdx + 1, 0, { id: "capital-statement", label: labels.statementTitle });
 }
 return items;
 }, [isPartnershipOrTrust, labels]);

 const filteredGroups = useMemo(() => {
 if (!search.trim()) return GROUPS;
 const q = search.toLowerCase();
 return GROUPS.map((g) => ({
...g,
 rows: g.rows.filter(
 (r) =>
 r.description.toLowerCase().includes(q) ||
 r.accNo.includes(q) ||
 r.mapNo.includes(q),
 ),
 })).filter((g) => g.rows.length > 0);
 }, [search]);

 const totals = (rows: Row[]) =>
 rows.reduce(
 (acc, r) => ({
 original: acc.original + r.original,
 adj: acc.adj + r.adj,
 final: acc.final + r.final,
 py1: acc.py1 + r.py1,
 }),
 { original: 0, adj: 0, final: 0, py1: 0 },
 );

 const activeSchedule = active.startsWith("schedule:") ? schedules.find(s => `schedule:${s.id}` === active) : undefined;
 const title =
 active === "balance-sheet" ? "Balance Sheet" :
 active === "income" ? "Statement of Income (Loss)" :
 active === "capital-statement" ? (labels?.statementTitle ?? "Statement of Partners' Capital") :
 active === "cash-flows" ? "Statement of Cash Flows" :
 active === "notes" ? "Notes to Financial Information" :
 activeSchedule ? activeSchedule.name :
 "Trial Balance Grouping";

 const showPreview = active === "balance-sheet" || active === "income" || active === "capital-statement" || !!activeSchedule;

 return (
 <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden">
 {/* Top navy bar */}
 <header className="shrink-0 bg-[hsl(213,68%,28%)] text-white">
 <div className="flex items-center justify-between px-6 py-3 text-sm">
 <div className="flex items-center gap-3">
 <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-white/10 font-semibold text-xs tracking-wide">
 <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-white/15 text-[10px]">
 {engagement.type.startsWith("Audit") ? "AUD" : engagement.type.startsWith("Review") ? "REV" : engagement.type.startsWith("Tax") ? "TAX" : "COM"}
 </span>
 </div>
 <span className="opacity-80">Engagement Name:</span>
 <span className="font-semibold">{engagement.id}</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="opacity-80">Client Name:</span>
 <span className="font-semibold">{engagement.client}</span>
 {engagement.entityType !== "Corporation" && (
 <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/15">{engagement.entityType}</span>
 )}
 </div>
 <div className="flex items-center gap-2">
 <span className="opacity-80">Year End Date:</span>
 <span className="font-semibold">{engagement.yearEnd}</span>
 </div>
 </div>
 </header>

 {/* Body */}
 <div className="flex flex-1 min-h-0">
 {/* LHS menu */}
 {sidebarOpen && (
 <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
 <div className="flex items-center justify-end px-3 py-2 border-b border-border">
 <button
 onClick={() => setSidebarOpen(false)}
 className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
 aria-label="Collapse sidebar"
 >
 <ChevronRight className="h-4 w-4 rotate-180" />
 </button>
 </div>
 <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
 <button
 onClick={() => setActive("tb-grouping")}
 className={cn(
 "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
 active === "tb-grouping" ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted",
 )}
 >
 Trial Balance Grouping
 </button>
 {navItems.slice(1).map((item) => (
 <button
 key={item.id}
 onClick={() => setActive(item.id)}
 className={cn(
 "w-full text-left px-3 py-2 rounded-md text-sm transition-colors truncate",
 active === item.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted",
 )}
 >
 {item.label}
 </button>
 ))}
 <div className="flex items-center justify-between px-3 py-2 mt-1 group">
 <span className="text-sm font-semibold text-muted-foreground">Schedules</span>
 </div>
 {schedules.map(s => (
 <button
 key={s.id}
 onClick={() => setActive(`schedule:${s.id}`)}
 className={cn(
 "w-full text-left pl-6 pr-3 py-2 rounded-md text-sm transition-colors truncate",
 active === `schedule:${s.id}` ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted",
 )}
 >
 {s.name}
 </button>
 ))}
 </nav>
 </aside>
 )}

 {/* Main */}
 <main className="flex-1 min-w-0 overflow-hidden bg-background flex flex-col">
 <div className="px-8 py-6 flex-1 min-h-0 overflow-hidden flex flex-col">
 {/* Toolbar (collapse / refresh) */}
 <div className="flex items-center gap-2 mb-4 shrink-0">
 {!sidebarOpen && (
 <button
 onClick={() => setSidebarOpen(true)}
 className="h-9 w-9 rounded-md flex items-center justify-center border border-border bg-card hover:bg-muted text-foreground"
 aria-label="Open sidebar"
 >
 <ChevronRight className="h-4 w-4" />
 </button>
 )}
 <button className="h-9 w-9 rounded-md flex items-center justify-center border border-border bg-card hover:bg-muted text-foreground">
 <Minimize2 className="h-4 w-4" />
 </button>
 <button className="h-9 w-9 rounded-md flex items-center justify-center border border-border bg-card hover:bg-muted text-foreground">
 <RefreshCw className="h-4 w-4" />
 </button>
 </div>

 {/* Title */}
 {active === "tb-grouping" && (
 <div className="text-center mb-6 shrink-0">
 <h1 className="text-2xl font-bold text-foreground">Trial Balance Grouping</h1>
 <p className="text-sm text-muted-foreground mt-1">As at {engagement.yearEnd}</p>
 </div>
 )}
 {active !== "tb-grouping" && !activeSchedule && (
 <div className="text-center mb-6 shrink-0 flex items-center justify-center gap-2">
 <h1 className="text-2xl font-bold text-foreground">{title}</h1>
 <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
 </div>
 )}

 {/* Filters row */}
 {active !== "notes" && !activeSchedule && (
 <div className="flex items-end justify-between gap-4 mb-4 flex-wrap shrink-0">
 <div className="flex items-end gap-4">
 <div className="flex flex-col gap-1.5">
 <label className="text-xs font-medium text-foreground">Entity Name</label>
 <Select defaultValue={engagement.client}>
 <SelectTrigger className="w-[240px] h-9">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value={engagement.client}>{engagement.client}</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="flex flex-col gap-1.5">
 <label className="text-xs font-medium text-foreground">Year End Date</label>
 <Select defaultValue={engagement.yearEnd}>
 <SelectTrigger className="w-[200px] h-9">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value={engagement.yearEnd}>{engagement.yearEnd}</SelectItem>
 </SelectContent>
 </Select>
 </div>
 {active === "capital-statement" && capitalStatement && labels && (
 <>
 <CapControlDropdown
 label="Layout"
 value={capLayout}
 options={[{ value: "vertical", label: `${labels.holder}s down` }, { value: "horizontal", label: `${labels.holder}s across` }]}
 onChange={v => setCapLayout(v as CapLayout)}
 />
 <CapControlDropdown
 label="Show"
 value={capDetail}
 options={[
 { value: "individual", label: `Each ${labels.holder.toLowerCase()}`, disabled: capitalStatement.rows.length > 12 || engagement.capitalVisibility !== "open" },
 { value: "class", label: labels.hasClassSplit ? "General / limited" : `All ${labels.holders.toLowerCase()}` },
 { value: "total", label: "Totals only" },
 ]}
 onChange={v => setCapDetail(v as CapDetail)}
 />
 </>
 )}
 </div>
 <div className="flex items-center gap-2">
 <div className="relative">
 <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
 <Input
 placeholder="Search"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="pl-9 w-[260px] h-9"
 />
 </div>
 <Button className="h-9 gap-2">
 <Download className="h-4 w-4" />
 Export
 <ChevronDown className="h-3 w-3 opacity-80" />
 </Button>
 </div>
 </div>
 )}

 {/* Content */}
 <div className="flex-1 min-w-0 min-h-0 overflow-y-auto">
 {active === "tb-grouping" && (
 <table className="w-full text-sm rounded-lg border border-border bg-card overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.04)]">
 <thead>
 <tr className="bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground">
 <th className="w-10 px-3 py-3"></th>
 <th className="px-3 py-3 text-left w-16">LS</th>
 <th className="px-3 py-3 text-left w-24">Map No.</th>
 <th className="px-3 py-3 text-left w-20">Acc No.</th>
 <th className="px-3 py-3 text-left">Description</th>
 <th className="px-3 py-3 text-right w-28">Original</th>
 <th className="px-3 py-3 text-right w-20">Adj</th>
 <th className="px-3 py-3 text-right w-28">Final</th>
 <th className="px-3 py-3 text-right w-28">PY1</th>
 <th className="px-3 py-3 text-right w-32">Change (%)</th>
 <th className="px-3 py-3 text-center w-16">Notes</th>
 <th className="px-3 py-3 text-center w-16">Ref</th>
 </tr>
 </thead>
 <tbody>
 {filteredGroups.map((group) => {
 const collapsed = collapsedGroups.has(group.id);
 const t = totals(group.rows);
 return (
 <Fragment key={group.id}>
 <tr className="bg-muted/50 border-t border-border border-l-2 border-l-primary">
 <td colSpan={12} className="px-3 py-2.5">
 <button
 onClick={() => toggleGroup(group.id)}
 className="flex items-center gap-2 text-sm font-semibold text-foreground"
 >
 {collapsed ? (
 <ChevronRight className="h-4 w-4 text-muted-foreground" />
 ) : (
 <ChevronDown className="h-4 w-4 text-muted-foreground" />
 )}
 {group.title}
 </button>
 </td>
 </tr>
 {!collapsed &&
 group.rows.map((row) => (
 <tr
 key={row.id}
 className="border-t border-border hover:bg-muted/30 transition-colors"
 >
 <td className="px-3 py-2.5">
 <input
 type="checkbox"
 className="h-4 w-4 rounded border-border accent-primary"
 />
 </td>
 <td className="px-3 py-2.5">
 <span className="text-primary font-semibold">{row.ls}</span>
 </td>
 <td className="px-3 py-2.5">
 <span className="text-primary">{row.mapNo}</span>
 </td>
 <td className="px-3 py-2.5 text-foreground">{row.accNo}</td>
 <td className="px-3 py-2.5 text-foreground truncate">{row.description}</td>
 <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatAmt(row.original)}</td>
 <td className="px-3 py-2.5 text-right tabular-nums text-primary">{formatAmt(row.adj)}</td>
 <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatAmt(row.final)}</td>
 <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatAmt(row.py1)}</td>
 <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{row.changePct}</td>
 <td className="px-3 py-2.5 text-center">
 <FileText className="h-4 w-4 text-muted-foreground inline-block" />
 </td>
 <td className="px-3 py-2.5 text-center">
 {row.ref ? (
 <span className="text-primary font-medium">{row.ref}</span>
 ) : (
 <span className="text-muted-foreground">-</span>
 )}
 </td>
 </tr>
 ))}
 {!collapsed && (
 <tr className="border-t-2 border-border bg-muted/30 font-semibold">
 <td colSpan={4}></td>
 <td className="px-3 py-2.5 text-foreground">Total {group.title.replace(/^[A-Z0-9]+\s*-\s*/, "")}</td>
 <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatAmt(t.original)}</td>
 <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatAmt(t.adj)}</td>
 <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatAmt(t.final)}</td>
 <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatAmt(t.py1)}</td>
 <td colSpan={3}></td>
 </tr>
 )}
 </Fragment>
 );
 })}
 </tbody>
 </table>
 )}

 {active === "balance-sheet" && (
 <BalanceSheetCentre bs={balanceSheet} expandedLines={expandedLines} toggleLine={toggleLine} onAddSchedule={addSchedule} scheduleByGroupId={scheduleByGroupId} />
 )}
 {active === "income" && (
 <IncomeStatementCentre is={incomeStatement} expandedLines={expandedLines} toggleLine={toggleLine} onAddSchedule={addSchedule} scheduleByGroupId={scheduleByGroupId} />
 )}
 {active === "capital-statement" && capitalStatement && labels && (
 <CapitalStatementCentre
 data={capitalStatement}
 labels={labels}
 client={engagement.client}
 yearEnd={engagement.yearEnd}
 detail={capDetail}
 capitalVisibility={engagement.capitalVisibility}
 onGoToIncome={() => setActive("income")}
 />
 )}
 {active === "cash-flows" && (
 <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground border border-dashed border-border rounded-xl">
 <FileText className="h-10 w-10" />
 <p className="font-medium text-foreground">Statement of Cash Flows is not built yet</p>
 <p className="text-xs">Planned for a later Workbook package.</p>
 </div>
 )}
 {active === "notes" && <NotesScreen engagementId={engId} />}
 {activeSchedule && (
 <ScheduleDetailScreen
 schedule={activeSchedule}
 onRename={name => updateSchedules(schedules.map(s => (s.id === activeSchedule.id ? { ...s, name } : s)))}
 onDelete={() => {
 updateSchedules(schedules.filter(s => s.id !== activeSchedule.id));
 setActive("tb-grouping");
 }}
 />
 )}
 </div>
 </div>
 </main>

 {/* RHS preview — a direct sibling of the sidebar/main (like <aside> above), not nested inside
 main's padded content, so it always runs the full height of the body top to bottom, flush
 against the header above and the bottom edge below, in both the collapsed and open state. */}
 {showPreview && (active === "balance-sheet" || active === "income" || active === "capital-statement") && (
 <div
 className={cn(
 "shrink-0 border-l border-border bg-card overflow-hidden transition-all duration-300 ease-in-out",
 previewCollapsed ? "w-9" : "w-[420px]",
 )}
 >
 {previewCollapsed ? (
 <button
 type="button"
 onClick={() => setPreviewCollapsed(false)}
 className="h-full w-full flex flex-col items-center justify-center gap-2 py-4 bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
 aria-label="Show preview"
 title="Show preview"
 >
 <ChevronRight className="h-4 w-4 rotate-180" />
 <span className="text-[11px] font-semibold tracking-wide [writing-mode:vertical-rl] rotate-180">Preview</span>
 </button>
 ) : (
 <div className="h-full overflow-y-auto relative">
 <button
 type="button"
 onClick={() => setPreviewCollapsed(true)}
 className="absolute top-3 right-3 z-10 h-7 w-7 rounded-md flex items-center justify-center border border-border bg-card/90 hover:bg-muted text-muted-foreground hover:text-foreground"
 aria-label="Minimize preview"
 title="Minimize preview"
 >
 <ChevronRight className="h-4 w-4" />
 </button>
 {active === "balance-sheet" && (
 <BalanceSheetPreview bs={balanceSheet} client={engagement.client} yearEnd={engagement.yearEnd} scheduleByGroupId={scheduleByGroupId} />
 )}
 {active === "income" && (
 <IncomeStatementPreview is={incomeStatement} client={engagement.client} yearEnd={engagement.yearEnd} />
 )}
 {active === "capital-statement" && capitalStatement && labels && (
 <CapitalStatementPreview data={capitalStatement} labels={labels} client={engagement.client} yearEnd={engagement.yearEnd} layout={capLayout} detail={capDetail} />
 )}
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 );
}
