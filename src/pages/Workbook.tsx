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
 PanelLeft,
 PanelRight,
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
 buildCashFlow,
 defaultCfCategory,
 rowCashEffect,
 type BalanceSheetData,
 type IncomeStatementData,
 type StatementLine,
 type StatementSection,
 type CashFlowData,
 type CashFlowLine,
 type CfCategory,
} from "@/lib/workbookStatements";
import { loadCfOverrides, saveCfOverrides } from "@/store/cashFlowMappingStore";
import { loadParticipants, type Participant } from "@/store/participantsStore";
import { loadPWWorksheet } from "@/store/partnershipWorksheetStore";
import { getEntityLabels, type EntityKind, type EntityLabels } from "@/lib/entityLabels";
import { buildCapitalStatement, toPublicEntities, type CapitalStatementData, type PublicCapitalEntity } from "@/lib/capitalStatement";
import "@/styles/workbook.css";

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

const MONTH_FULL: Record<string, string> = {
 Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June",
 Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December",
};
// "Dec 31, 2023" -> { monthDay: "December 31", year: "2023" } — the printed statement's date
// columns spell the month out and stack the year on its own line, unlike the app's own
// abbreviated "Dec 31, 2023" strings used everywhere else (title blocks, filters, etc).
function splitStatementDate(yearEnd: string): { monthDay: string; year: string } {
 const m = yearEnd.match(/^(\w{3})\w*\s+(\d{1,2}),\s*(\d{4})$/);
 if (!m) return { monthDay: yearEnd, year: "" };
 const [, mon, day, year] = m;
 return { monthDay: `${MONTH_FULL[mon] ?? mon} ${day}`, year };
}
// The prior-year column's date is the same month/day, one year back — there's no separate
// stored "prior year end" string anywhere, so it's derived rather than invented.
function priorStatementDate(yearEnd: string): { monthDay: string; year: string } {
 const { monthDay, year } = splitStatementDate(yearEnd);
 const y = Number(year);
 return { monthDay, year: Number.isNaN(y) ? "" : String(y - 1) };
}

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
 <tr className="wb-group-header">
 <td colSpan={6} style={{ padding: "8px 10px", fontWeight: 600 }}>{sec.label}</td>
 </tr>
 {sec.lines.map(line => {
 const expanded = expandedLines.has(line.id);
 const linkedSchedule = scheduleByGroupId.get(line.id);
 const leafGroup = GROUPS.find(g => g.id === line.id);
 return (
 <Fragment key={line.id}>
 <tr>
 <td>
 <div className="wb-row-inner" style={{ fontWeight: 500 }}>
 <button onClick={() => toggleLine(line.id)} className="wb-row-inner" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, color: "inherit", font: "inherit" }} type="button">
 {expanded ? <ChevronDown className="h-3.5 w-3.5" style={{ color: "var(--wb-text-3)" }} /> : <ChevronRight className="h-3.5 w-3.5" style={{ color: "var(--wb-text-3)" }} />}
 <input type="checkbox" onClick={e => e.stopPropagation()} />
 {line.label}
 </button>
 {linkedSchedule ? (
 <span className="wb-badge-schedule">{linkedSchedule.name.replace(/^Schedule (\d+).*/, "Schedule $1")}</span>
 ) : (
 <button onClick={() => onAddSchedule(line)} className="wb-ghost-schedule" type="button" style={{ border: "1px solid var(--wb-border)" }}>
 + Schedule
 </button>
 )}
 </div>
 </td>
 <td><a className="wb-map-link">{line.ls}</a></td>
 <td style={{ color: "var(--wb-text-3)" }}>{line.mapNo || "—"}</td>
 <td style={{ textAlign: "center" }}>
 <Plus className="h-3.5 w-3.5 inline-block" style={{ color: "var(--wb-text-3)" }} />
 </td>
 <td className="wb-num">{formatAmt(line.cy)}</td>
 <td className="wb-num" style={{ color: "var(--wb-text-2)" }}>{formatAmt(line.py)}</td>
 </tr>
 {expanded && leafGroup?.rows.map(r => (
 <tr key={r.id} style={{ color: "var(--wb-text-2)" }}>
 <td className="wb-indent-2">{r.description}</td>
 <td>{r.ls}</td>
 <td>{r.mapNo || "—"}</td>
 <td />
 <td className="wb-num">{formatAmt(r.final)}</td>
 <td className="wb-num">{formatAmt(r.py1)}</td>
 </tr>
 ))}
 {expanded && (
 <tr style={{ fontWeight: 500 }}>
 <td className="wb-indent-2">Total {line.label}</td>
 <td colSpan={3} />
 <td className="wb-num">{formatAmt(line.cy)}</td>
 <td className="wb-num">{formatAmt(line.py)}</td>
 </tr>
 )}
 </Fragment>
 );
 })}
 <tr className="wb-total-row">
 <td>Total {sec.label}</td>
 <td colSpan={3} />
 <td className="wb-num">{formatAmt(sec.cyTotal)}</td>
 <td className="wb-num">{formatAmt(sec.pyTotal)}</td>
 </tr>
 </>
 );
}

function GroupingTableShell({ children }: { children: React.ReactNode }) {
 return (
 <table className="wb-data-table">
 <thead>
 <tr>
 <th>Group Name</th>
 <th style={{ width: 64 }}>LS</th>
 <th style={{ width: 96 }}>Map No.</th>
 <th className="wb-num" style={{ width: 112, textAlign: "center" }}>Notes to FS</th>
 <th className="wb-num" style={{ width: 128 }}>Current Year</th>
 <th className="wb-num" style={{ width: 128 }}>Prior Year</th>
 </tr>
 </thead>
 <tbody>{children}</tbody>
 </table>
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
 <tr className="wb-group-header"><td colSpan={6} style={{ fontWeight: 700 }}>Assets</td></tr>
 <StatementSectionRows sec={bs.currentAssets} {...rowProps} />
 <StatementSectionRows sec={bs.longTermAssets} {...rowProps} />
 <tr className="wb-total-row" style={{ fontWeight: 700 }}>
 <td>Total Assets</td><td colSpan={3} />
 <td className="wb-num">{formatAmt(bs.totalAssetsCy)}</td>
 <td className="wb-num">{formatAmt(bs.totalAssetsPy)}</td>
 </tr>
 <tr className="wb-group-header"><td colSpan={6} style={{ fontWeight: 700 }}>Liabilities</td></tr>
 <StatementSectionRows sec={bs.currentLiabilities} {...rowProps} />
 <StatementSectionRows sec={bs.longTermLiabilities} {...rowProps} />
 <tr className="wb-total-row" style={{ fontWeight: 700 }}>
 <td>Total Liabilities</td><td colSpan={3} />
 <td className="wb-num">{formatAmt(bs.totalLiabilitiesCy)}</td>
 <td className="wb-num">{formatAmt(bs.totalLiabilitiesPy)}</td>
 </tr>
 <tr className="wb-group-header"><td colSpan={6} style={{ fontWeight: 700 }}>Equity</td></tr>
 <StatementSectionRows sec={bs.equity} {...rowProps} />
 <tr className="wb-total-row" style={{ fontWeight: 700 }}>
 <td>Total Liabilities and Equity</td><td colSpan={3} />
 <td className="wb-num">{formatAmt(bs.totalLiabEquityCy)}</td>
 <td className="wb-num">{formatAmt(bs.totalLiabEquityPy)}</td>
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
 <div key={l.id} className="wb-preview-row wb-indent" style={{ fontStyle: "italic" }}>
 <span>{lineLabel(l)}</span>
 <span className="wb-amt" style={{ display: "flex", gap: 24 }}>
 <span className="wb-amt-cy" style={{ width: 80, textAlign: "right" }}>{formatAmt(l.cy)}</span>
 <span className="wb-amt-py" style={{ width: 80, textAlign: "right", color: "var(--wb-text-2)" }}>{formatAmt(l.py)}</span>
 </span>
 </div>
 );
 const subtotal = (label: string, cy: number, py: number, bold = false) => (
 <div className={cn("wb-preview-row wb-subtotal", bold && "wb-total")}>
 <span>{label}</span>
 <span className="wb-amt" style={{ display: "flex", gap: 24 }}>
 <span className="wb-amt-cy" style={{ width: 80, textAlign: "right" }}>{formatAmt(cy)}</span>
 <span className="wb-amt-py" style={{ width: 80, textAlign: "right" }}>{formatAmt(py)}</span>
 </span>
 </div>
 );
 const cyDate = splitStatementDate(yearEnd);
 const pyDate = priorStatementDate(yearEnd);
 return (
 <div>
 <div className="wb-statement-header">
 <h2>{client}</h2>
 <h3>Balance Sheet</h3>
 <p>As at {yearEnd}</p>
 </div>
 <div className="wb-preview-rule" />
 <div className="wb-preview-datecols">
 <span className="wb-amt-cy">{cyDate.monthDay}<br />{cyDate.year}</span>
 <span className="wb-amt-py">{pyDate.monthDay}<br />{pyDate.year}</span>
 </div>
 <p className="wb-preview-section-title">Assets</p>
 <p style={{ fontWeight: 600, paddingLeft: 8 }}>Current assets</p>
 {bs.currentAssets.lines.map(row)}
 {subtotal("Total current assets", bs.currentAssets.cyTotal, bs.currentAssets.pyTotal)}
 <p style={{ fontWeight: 600, paddingLeft: 8, marginTop: 8 }}>Long-term assets</p>
 {bs.longTermAssets.lines.map(row)}
 {subtotal("Total assets", bs.totalAssetsCy, bs.totalAssetsPy, true)}
 <div className="wb-preview-dashed" />
 <p className="wb-preview-section-title">Liabilities</p>
 <p style={{ fontWeight: 600, paddingLeft: 8 }}>Current liabilities</p>
 {bs.currentLiabilities.lines.map(row)}
 {subtotal("Total current liabilities", bs.currentLiabilities.cyTotal, bs.currentLiabilities.pyTotal)}
 <p style={{ fontWeight: 600, paddingLeft: 8, marginTop: 8 }}>Long-term liabilities</p>
 {bs.longTermLiabilities.lines.map(row)}
 {subtotal("Total long-term liabilities", bs.longTermLiabilities.cyTotal, bs.longTermLiabilities.pyTotal)}
 {/* Total Liabilities — unlabeled, the same way production leaves this one sub-grand-total
 bare since it sits right where the Liabilities section visibly ends. */}
 {subtotal("", bs.totalLiabilitiesCy, bs.totalLiabilitiesPy, true)}
 <p className="wb-preview-section-title" style={{ marginTop: 16 }}>Equity</p>
 {bs.equity.lines.map(row)}
 {subtotal("", bs.equity.cyTotal, bs.equity.pyTotal, true)}
 {subtotal("Total liabilities and equity", bs.totalLiabEquityCy, bs.totalLiabEquityPy, true)}
 {!bs.balancesCy && (
 <div className="wb-preview-row wb-difference">
 <span>Difference</span>
 <span className="wb-amt" style={{ display: "flex", gap: 24 }}>
 <span className="wb-amt-cy" style={{ width: 80, textAlign: "right" }}>{formatAmt(bs.totalAssetsCy - bs.totalLiabEquityCy)}</span>
 <span className="wb-amt-py" style={{ width: 80, textAlign: "right" }}>{formatAmt(bs.totalAssetsPy - bs.totalLiabEquityPy)}</span>
 </span>
 </div>
 )}
 <div className="wb-preview-footer">See accompanying notes to financial information</div>
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
 <tr className="wb-total-row" style={{ fontWeight: 700 }}>
 <td>Net income (loss)</td><td colSpan={3} />
 <td className="wb-num">{formatAmt(is.netIncomeCy)}</td>
 <td className="wb-num">{formatAmt(is.netIncomePy)}</td>
 </tr>
 </GroupingTableShell>
 );
}

function IncomeStatementPreview({ is, client, yearEnd }: { is: IncomeStatementData; client: string; yearEnd: string }) {
 const row = (l: StatementLine) => (
 <div key={l.id} className="wb-preview-row wb-indent" style={{ fontStyle: "italic" }}>
 <span>{l.label}</span>
 <span className="wb-amt" style={{ display: "flex", gap: 24 }}>
 <span className="wb-amt-cy" style={{ width: 80, textAlign: "right" }}>{formatAmt(l.cy)}</span>
 <span className="wb-amt-py" style={{ width: 80, textAlign: "right", color: "var(--wb-text-2)" }}>{formatAmt(l.py)}</span>
 </span>
 </div>
 );
 const subtotal = (label: string, cy: number, py: number, bold = false) => (
 <div className={cn("wb-preview-row wb-subtotal", bold && "wb-total")}>
 <span>{label}</span>
 <span className="wb-amt" style={{ display: "flex", gap: 24 }}>
 <span className="wb-amt-cy" style={{ width: 80, textAlign: "right" }}>{formatAmt(cy)}</span>
 <span className="wb-amt-py" style={{ width: 80, textAlign: "right" }}>{formatAmt(py)}</span>
 </span>
 </div>
 );
 const cyDate = splitStatementDate(yearEnd);
 const pyDate = priorStatementDate(yearEnd);
 const hasDifference = Math.abs(is.differenceCy) >= 0.005 || Math.abs(is.differencePy) >= 0.005;
 return (
 <div>
 <div className="wb-statement-header">
 <h2>{client}</h2>
 <h3>Statement of Income (Loss) and Retained Earnings (Deficit)</h3>
 <p>For the year ended {yearEnd}</p>
 </div>
 <div className="wb-preview-rule" />
 <div className="wb-preview-datecols">
 <span className="wb-amt-cy">{cyDate.monthDay}<br />{cyDate.year}</span>
 <span className="wb-amt-py">{pyDate.monthDay}<br />{pyDate.year}</span>
 </div>
 <p className="wb-preview-section-title">Revenue</p>
 {is.revenue.lines.map(row)}
 {subtotal("Total revenue", is.revenue.cyTotal, is.revenue.pyTotal)}
 <p className="wb-preview-section-title" style={{ marginTop: 16 }}>Expenses</p>
 {is.expenses.lines.map(row)}
 {subtotal("Total expenses", is.expenses.cyTotal, is.expenses.pyTotal)}
 {subtotal("Net income (loss)", is.netIncomeCy, is.netIncomePy, true)}
 {subtotal("Retained earnings (deficit), beginning of year", is.openingRetainedEarningsCy, is.openingRetainedEarningsPy)}
 {subtotal("Retained earnings (deficit), end of year", is.closingRetainedEarningsCy, is.closingRetainedEarningsPy, true)}
 {hasDifference && (
 <div className="wb-preview-row wb-difference">
 <span>Difference</span>
 <span className="wb-amt" style={{ display: "flex", gap: 24 }}>
 <span className="wb-amt-cy" style={{ width: 80, textAlign: "right" }}>{formatAmt(is.differenceCy)}</span>
 <span className="wb-amt-py" style={{ width: 80, textAlign: "right" }}>{formatAmt(is.differencePy)}</span>
 </span>
 </div>
 )}
 <div className="wb-preview-footer">See accompanying notes to financial information</div>
 </div>
 );
}

// ── Statement of Cash Flows ───────────────────────────────────────────────────────────────
const CF_CATEGORY_OPTIONS: { value: CfCategory; label: string }[] = [
 { value: "CFO", label: "CFO" },
 { value: "CFI", label: "CFI" },
 { value: "CFF", label: "CFF" },
 { value: "Excl", label: "Excl" },
];

function CfCategorySelect({ value, onChange }: { value: CfCategory; onChange: (v: CfCategory) => void }) {
 return (
 <Select value={value} onValueChange={v => onChange(v as CfCategory)}>
 <SelectTrigger className="h-8 w-[84px] text-xs" style={{ background: "var(--wb-panel-alt)", borderColor: "var(--wb-border)", color: "var(--wb-text)" }}>
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 {CF_CATEGORY_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
 </SelectContent>
 </Select>
 );
}

// A blank, prototype-only row the preparer can type a description/amount into — kept in local
// component state (not persisted), same scope as everything else "+ Add Row"/"+ Manual Entry"
// touches: a demonstrable affordance, not a durable ledger entry.
interface CfManualRow { id: string; description: string; amount: number }

function CfAddRowButton({ onClick }: { onClick: () => void }) {
 return (
 <button onClick={onClick} type="button" style={{ fontSize: 13.5, fontWeight: 500, color: "var(--wb-link)", display: "flex", alignItems: "center", gap: 4, border: "none", background: "none", cursor: "pointer", padding: "6px 0" }}>
 <Plus className="h-3.5 w-3.5" />Add Row
 </button>
 );
}

function CfManualRows({ rows, onChange }: { rows: CfManualRow[]; onChange: (rows: CfManualRow[]) => void }) {
 const update = (id: string, patch: Partial<CfManualRow>) => onChange(rows.map(r => (r.id === id ? { ...r, ...patch } : r)));
 return (
 <>
 {rows.map(r => (
 <tr key={r.id}>
 <td className="wb-indent-2">
 <Input value={r.description} onChange={e => update(r.id, { description: e.target.value })} placeholder="Description" className="h-8" />
 </td>
 <td />
 <td />
 <td>
 <Input type="number" value={r.amount} onChange={e => update(r.id, { amount: Number(e.target.value) || 0 })} className="h-8 text-right" />
 </td>
 </tr>
 ))}
 </>
 );
}

function CashFlowLineGroup({ line, expanded, onToggle, overrides, onChangeCategory }: {
 line: CashFlowLine;
 expanded: boolean;
 onToggle: () => void;
 overrides: Record<string, CfCategory>;
 onChangeCategory: (rowId: string, cat: CfCategory) => void;
}) {
 const [manualRows, setManualRows] = useState<CfManualRow[]>([]);
 const manualTotal = manualRows.reduce((s, r) => s + r.amount, 0);
 const addRow = () => setManualRows(prev => [...prev, { id: Math.random().toString(36).slice(2, 9), description: "", amount: 0 }]);
 return (
 <>
 <tr>
 <td>
 <button onClick={onToggle} type="button" className="wb-row-inner" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, color: "inherit", font: "inherit", fontWeight: 500 }}>
 {expanded ? <ChevronDown className="h-3.5 w-3.5" style={{ color: "var(--wb-text-3)" }} /> : <ChevronRight className="h-3.5 w-3.5" style={{ color: "var(--wb-text-3)" }} />}
 {line.label}
 </button>
 </td>
 <td /><td />
 <td className="wb-num">{formatAmt(line.cy + manualTotal)}</td>
 </tr>
 {expanded && line.rows.map(r => (
 <tr key={r.id} style={{ color: "var(--wb-text-2)" }}>
 <td className="wb-indent-2">{r.mapNo || r.accNo} &nbsp; {r.description}</td>
 <td><CfCategorySelect value={overrides[r.id] ?? defaultCfCategory(r.ls, r.id)} onChange={v => onChangeCategory(r.id, v)} /></td>
 <td style={{ color: "var(--wb-text-3)" }}>{line.label}</td>
 <td className="wb-num">{formatAmt(rowCashEffect(r))}</td>
 </tr>
 ))}
 {expanded && <CfManualRows rows={manualRows} onChange={setManualRows} />}
 {expanded && (
 <tr>
 <td colSpan={4}><CfAddRowButton onClick={addRow} /></td>
 </tr>
 )}
 </>
 );
}

function CashFlowSectionBlock({ title, section, expandedIds, toggleId, overrides, onChangeCategory, subheader }: {
 title: string;
 section: CashFlowSection;
 expandedIds: Set<string>;
 toggleId: (id: string) => void;
 overrides: Record<string, CfCategory>;
 onChangeCategory: (rowId: string, cat: CfCategory) => void;
 subheader?: string;
}) {
 const [manualRows, setManualRows] = useState<CfManualRow[]>([]);
 const manualTotal = manualRows.reduce((s, r) => s + r.amount, 0);
 const addManual = () => setManualRows(prev => [...prev, { id: Math.random().toString(36).slice(2, 9), description: "", amount: 0 }]);
 return (
 <>
 <tr className="wb-group-header"><td colSpan={4} style={{ fontWeight: 700 }}>{title}</td></tr>
 {subheader && (
 <tr><td colSpan={4} style={{ fontWeight: 600, paddingTop: 8 }}>{subheader}:</td></tr>
 )}
 {section.lines.map(line => (
 <CashFlowLineGroup
 key={line.id}
 line={line}
 expanded={expandedIds.has(line.id)}
 onToggle={() => toggleId(line.id)}
 overrides={overrides}
 onChangeCategory={onChangeCategory}
 />
 ))}
 <CfManualRows rows={manualRows} onChange={setManualRows} />
 <tr><td colSpan={4}><CfAddRowButton onClick={addManual} /></td></tr>
 </>
 );
}

function CashFlowCentre({ cashFlow, overrides, onChangeCategory }: {
 cashFlow: CashFlowData;
 overrides: Record<string, CfCategory>;
 onChangeCategory: (rowId: string, cat: CfCategory) => void;
}) {
 const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
 const toggleId = (id: string) => setExpandedIds(prev => {
 const n = new Set(prev);
 n.has(id) ? n.delete(id) : n.add(id);
 return n;
 });
 const netIncomeLabel = cashFlow.netIncomeCy < 0 ? "Net Loss" : "Net income";
 return (
 <table className="wb-data-table">
 <thead>
 <tr>
 <th>Group / Account</th>
 <th style={{ width: 96 }}>Classification</th>
 <th style={{ width: 160 }}>Maps to</th>
 <th className="wb-num" style={{ width: 144 }}>Amount</th>
 </tr>
 </thead>
 <tbody>
 <tr className="wb-group-header"><td colSpan={4} style={{ fontWeight: 700 }}>Operating activities</td></tr>
 <tr style={{ fontStyle: "italic" }}>
 <td className="wb-indent-2">{netIncomeLabel}</td><td /><td />
 <td className="wb-num">{formatAmt(cashFlow.netIncomeCy)}</td>
 </tr>
 <CashFlowSectionBlock
 title=""
 subheader={cashFlow.operating.label}
 section={cashFlow.operating}
 expandedIds={expandedIds}
 toggleId={toggleId}
 overrides={overrides}
 onChangeCategory={onChangeCategory}
 />
 <tr className="wb-total-row" style={{ fontWeight: 700 }}>
 <td>Net cash generated from (used in) operating activities <Pencil className="h-3 w-3 inline-block" style={{ color: "var(--wb-text-3)", marginLeft: 4 }} /></td>
 <td colSpan={2} />
 <td className="wb-num">{formatAmt(cashFlow.netCashOperatingCy)}</td>
 </tr>

 <CashFlowSectionBlock
 title="Investing activities"
 section={cashFlow.investing}
 expandedIds={expandedIds}
 toggleId={toggleId}
 overrides={overrides}
 onChangeCategory={onChangeCategory}
 />
 <tr className="wb-total-row" style={{ fontWeight: 700 }}>
 <td>Net cash generated from (used in) investing activities</td>
 <td colSpan={2} />
 <td className="wb-num">{formatAmt(cashFlow.netCashInvestingCy)}</td>
 </tr>

 <CashFlowSectionBlock
 title="Financing activities"
 section={cashFlow.financing}
 expandedIds={expandedIds}
 toggleId={toggleId}
 overrides={overrides}
 onChangeCategory={onChangeCategory}
 />
 <tr className="wb-total-row" style={{ fontWeight: 700 }}>
 <td>Net cash generated from financing activities</td>
 <td colSpan={2} />
 <td className="wb-num">{formatAmt(cashFlow.netCashFinancingCy)}</td>
 </tr>

 <tr className="wb-total-row" style={{ fontWeight: 700 }}>
 <td>Net increase (decrease) in cash &amp; cash equivalents</td>
 <td colSpan={2} />
 <td className="wb-num">{formatAmt(cashFlow.netChangeInCashCy)}</td>
 </tr>
 <tr>
 <td>Cash and cash equivalents, beginning of year</td><td colSpan={2} />
 <td className="wb-num">{formatAmt(cashFlow.cashBeginningCy)}</td>
 </tr>
 <tr className="wb-total-row" style={{ fontWeight: 700 }}>
 <td>Cash and cash equivalents, end of year</td><td colSpan={2} />
 <td className="wb-num">{formatAmt(cashFlow.cashEndingCy)}</td>
 </tr>
 </tbody>
 </table>
 );
}

function CashFlowPreview({ cf, client, yearEnd }: { cf: CashFlowData; client: string; yearEnd: string }) {
 const line = (label: string, cy: number) => (
 <div key={label} className="wb-preview-row wb-indent" style={{ fontStyle: "italic" }}>
 <span>{label}</span>
 <span className="wb-amt-cy" style={{ width: 80, textAlign: "right" }}>{formatAmt(cy)}</span>
 </div>
 );
 const subtotal = (label: string, cy: number, bold = false) => (
 <div className={cn("wb-preview-row wb-subtotal", bold && "wb-total")}>
 <span>{label}</span>
 <span className="wb-amt-cy" style={{ width: 80, textAlign: "right" }}>{formatAmt(cy)}</span>
 </div>
 );
 const netIncomeLabel = cf.netIncomeCy < 0 ? "Net Loss" : "Net income";
 const hasDifference = Math.abs(cf.differenceCy) >= 0.005;
 return (
 <div>
 <div className="wb-statement-header">
 <h2>{client}</h2>
 <h3>Statement of Cash Flows</h3>
 <p>For the year ended {yearEnd}</p>
 </div>
 <div className="wb-preview-rule" />
 {/* A Cash Flow statement's own prior-year column would need a prior-PRIOR-year balance
 sheet to difference against — one more year back than this demo data carries anywhere
 else (the same gap documented on IncomeStatementData.openingRetainedEarningsPy) — so,
 same as production itself, this preview shows the current year only. */}
 <div className="wb-preview-datecols" style={{ justifyContent: "flex-end" }}>
 <span className="wb-amt-cy" style={{ width: 80 }}>{yearEnd}</span>
 </div>
 <p className="wb-preview-section-title">Operating activities</p>
 {line(netIncomeLabel, cf.netIncomeCy)}
 {cf.operating.lines.length > 0 && (
 <p style={{ fontWeight: 600, paddingLeft: 8, marginTop: 8 }}>{cf.operating.label}:</p>
 )}
 {cf.operating.lines.map(l => line(l.label, l.cy))}
 {subtotal("Net cash generated from (used in) operating activities", cf.netCashOperatingCy, true)}
 <p className="wb-preview-section-title" style={{ marginTop: 16 }}>Investing activities</p>
 {cf.investing.lines.map(l => line(l.label, l.cy))}
 {subtotal("Net cash generated from (used in) investing activities", cf.netCashInvestingCy, true)}
 <p className="wb-preview-section-title" style={{ marginTop: 16 }}>Financing activities</p>
 {cf.financing.lines.map(l => line(l.label, l.cy))}
 {subtotal("Net cash generated from (used in) financing activities", cf.netCashFinancingCy, true)}
 {subtotal("Net increase (decrease) in cash & cash equivalents", cf.netChangeInCashCy, true)}
 {subtotal("Cash and cash equivalents, beginning of year", cf.cashBeginningCy)}
 {subtotal("Cash and cash equivalents, end of year", cf.cashEndingCy, true)}
 {hasDifference && (
 <div className="wb-preview-row wb-difference">
 <span>Difference</span>
 <span className="wb-amt-cy" style={{ width: 80, textAlign: "right" }}>{formatAmt(cf.differenceCy)}</span>
 </div>
 )}
 <div className="wb-preview-footer">See accompanying notes to financial information</div>
 </div>
 );
}

// ── Statement of Partners'/Unitholders' Capital (P10) ───────────────────────────────────────
function CapitalStatementCentre({ data, labels, layout, detail, capitalVisibility = "open", onGoToIncome }: {
 data: CapitalStatementData;
 labels: EntityLabels;
 layout: CapLayout;
 detail: CapDetail;
 capitalVisibility?: "open" | "restricted" | "partnerOnly";
 onGoToIncome: () => void;
}) {
 const hasAdj = Math.abs(data.totals.adjustments) > 0.005;
 const ents = capitalEntities(data, detail);
 const manyHolders = data.rows.length > 12;
 const visibilityRestricted = capitalVisibility !== "open";
 return (
 <div className="flex flex-col gap-6">
 {(manyHolders && detail === "individual") || visibilityRestricted ? (
 <div className="flex flex-col gap-1">
 {manyHolders && detail === "individual" && (
 <p style={{ fontSize: 11, color: "var(--wb-text-3)" }}>{data.rows.length} {labels.holders.toLowerCase()}: too many to show individually — grouped by class.</p>
 )}
 {visibilityRestricted && (
 <p style={{ fontSize: 11, color: "var(--wb-text-3)" }}>
 Capital visibility is set to {capitalVisibility === "partnerOnly" ? "Partner-only" : "Restricted"} for this engagement — each {labels.holder.toLowerCase()}'s individual figures are hidden here; use the Partner package export to share one {labels.holder.toLowerCase()}'s own account.
 </p>
 )}
 </div>
 ) : null}

 <GroupingTableShell>
 <tr>
 <td style={{ fontWeight: 500 }}>Balance, beginning of year</td>
 <td colSpan={3} />
 <td className="wb-num">{formatAmt(data.totals.opening)}</td>
 <td className="wb-num">{formatAmt(data.totalsPy.opening)}</td>
 </tr>
 <tr>
 <td style={{ fontWeight: 500 }}>{labels.contributions}</td>
 <td colSpan={3} />
 <td className="wb-num">{formatAmt(data.totals.contributions)}</td>
 <td className="wb-num">{formatAmt(data.totalsPy.contributions)}</td>
 </tr>
 <tr>
 <td>
 <button type="button" onClick={onGoToIncome} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, fontWeight: 500, color: "var(--wb-link)", font: "inherit" }}>
 Net income allocated <span style={{ color: "var(--wb-text-3)", fontWeight: 400 }}>(from Statement of Income (Loss))</span>
 </button>
 </td>
 <td colSpan={3} />
 <td className="wb-num">{formatAmt(data.totals.ni)}</td>
 <td className="wb-num">{formatAmt(data.totalsPy.ni)}</td>
 </tr>
 <tr>
 <td style={{ fontWeight: 500 }}>{labels.drawings}</td>
 <td colSpan={3} />
 <td className="wb-num">{formatAmt(-data.totals.drawings)}</td>
 <td className="wb-num">{formatAmt(-data.totalsPy.drawings)}</td>
 </tr>
 {hasAdj && (
 <tr>
 <td style={{ fontWeight: 500 }}>Adjustments</td>
 <td colSpan={3} />
 <td className="wb-num">{formatAmt(data.totals.adjustments)}</td>
 <td className="wb-num" style={{ color: "var(--wb-text-3)" }}>—</td>
 </tr>
 )}
 <tr className="wb-total-row" style={{ fontWeight: 700 }}>
 <td>Balance, end of year</td>
 <td colSpan={3} />
 <td className="wb-num">{formatAmt(data.totals.closing)}</td>
 <td className="wb-num">{formatAmt(data.totalsPy.closing)}</td>
 </tr>
 </GroupingTableShell>

 <div className="wb-card" style={{ padding: 16 }}>
 <h3 style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>Allocation by {labels.holder.toLowerCase()} (from worksheet {labels.worksheetCode})</h3>
 {data.rows.length === 0 ? (
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "40px 0", color: "var(--wb-text-3)", border: "1px dashed var(--wb-border)", borderRadius: "var(--wb-radius-md)" }}>
 <FolderOpen className="h-8 w-8" />
 <p style={{ fontSize: 13.5 }}>No {labels.holders.toLowerCase()} recorded in the {labels.worksheetName} worksheet yet.</p>
 </div>
 ) : (
 <>
 {layout === "horizontal" ? (
 <div style={{ overflowX: "auto" }}>
 <table className="wb-data-table">
 <thead>
 <tr>
 <th></th>
 {ents.map(e => <th key={e.name} className="wb-num" style={{ whiteSpace: "nowrap" }}>{e.name}</th>)}
 <th className="wb-num">Total</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td>Opening</td>
 {ents.map(e => <td key={e.name} className="wb-num">{formatAmt(e.opening)}</td>)}
 <td className="wb-num">{formatAmt(data.totals.opening)}</td>
 </tr>
 <tr>
 <td>{labels.contributions}</td>
 {ents.map(e => <td key={e.name} className="wb-num">{formatAmt(e.contributions)}</td>)}
 <td className="wb-num">{formatAmt(data.totals.contributions)}</td>
 </tr>
 <tr>
 <td>Net income</td>
 {ents.map(e => <td key={e.name} className="wb-num">{formatAmt(e.ni)}</td>)}
 <td className="wb-num">{formatAmt(data.totals.ni)}</td>
 </tr>
 <tr>
 <td>{labels.drawings}</td>
 {ents.map(e => <td key={e.name} className="wb-num">{formatAmt(-e.drawings)}</td>)}
 <td className="wb-num">{formatAmt(-data.totals.drawings)}</td>
 </tr>
 {hasAdj && (
 <tr>
 <td>Adjustments</td>
 {ents.map(e => <td key={e.name} className="wb-num">{formatAmt(e.adjustments)}</td>)}
 <td className="wb-num">{formatAmt(data.totals.adjustments)}</td>
 </tr>
 )}
 <tr className="wb-total-row">
 <td>Closing</td>
 {ents.map(e => <td key={e.name} className="wb-num">{formatAmt(e.closing)}</td>)}
 <td className="wb-num">{formatAmt(data.totals.closing)}</td>
 </tr>
 </tbody>
 </table>
 </div>
 ) : detail === "class" ? (
 <table className="wb-data-table">
 <thead>
 <tr>
 <th>Class</th>
 <th className="wb-num">{labels.holders}</th>
 <th className="wb-num">{labels.allocationHeader}</th>
 <th className="wb-num">Opening</th>
 <th className="wb-num">Net income</th>
 <th className="wb-num">{labels.drawings}</th>
 <th className="wb-num">Closing</th>
 </tr>
 </thead>
 <tbody>
 {data.classTotals.map(c => (
 <tr key={c.key}>
 <td>{c.label}</td>
 <td className="wb-num">{c.count}</td>
 <td className="wb-num">{c.pctTotal.toFixed(2)}%</td>
 <td className="wb-num">{formatAmt(c.opening)}</td>
 <td className="wb-num">{formatAmt(c.ni)}</td>
 <td className="wb-num">{formatAmt(-c.drawings)}</td>
 <td className="wb-num">{formatAmt(c.closing)}</td>
 </tr>
 ))}
 <tr className="wb-total-row">
 <td>Total</td>
 <td className="wb-num">{data.rows.length}</td>
 <td className="wb-num">{data.pctTotal.toFixed(2)}%</td>
 <td className="wb-num">{formatAmt(data.totals.opening)}</td>
 <td className="wb-num">{formatAmt(data.totals.ni)}</td>
 <td className="wb-num">{formatAmt(-data.totals.drawings)}</td>
 <td className="wb-num">{formatAmt(data.totals.closing)}</td>
 </tr>
 </tbody>
 </table>
 ) : (
 <table className="wb-data-table">
 <thead>
 <tr>
 <th>{detail === "individual" ? labels.holder : "Total"}</th>
 <th className="wb-num">Opening</th>
 <th className="wb-num">{labels.contributions}</th>
 <th className="wb-num">Net income</th>
 <th className="wb-num">{labels.drawings}</th>
 <th className="wb-num">Closing</th>
 </tr>
 </thead>
 <tbody>
 {ents.map(e => (
 <tr key={e.name}>
 <td>{e.name}</td>
 <td className="wb-num">{formatAmt(e.opening)}</td>
 <td className="wb-num">{formatAmt(e.contributions)}</td>
 <td className="wb-num">{formatAmt(e.ni)}</td>
 <td className="wb-num">{formatAmt(-e.drawings)}</td>
 <td className="wb-num">{formatAmt(e.closing)}</td>
 </tr>
 ))}
 <tr className="wb-total-row">
 <td>Total</td>
 <td className="wb-num">{formatAmt(data.totals.opening)}</td>
 <td className="wb-num">{formatAmt(data.totals.contributions)}</td>
 <td className="wb-num">{formatAmt(data.totals.ni)}</td>
 <td className="wb-num">{formatAmt(-data.totals.drawings)}</td>
 <td className="wb-num">{formatAmt(data.totals.closing)}</td>
 </tr>
 </tbody>
 </table>
 )}
 <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
 {Math.abs(data.totals.closing - data.balanceSheetCapital) < 0.005 ? (
 <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--wb-success)" }}>
 <Check className="h-3.5 w-3.5" />Worksheet closing agrees to balance sheet {formatAmt(data.balanceSheetCapital)}
 </span>
 ) : (
 <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--wb-danger)" }}>
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

// Shared statement header — same serif title block the centre builder and the preview both show,
// so opening the preview never looks like a different document from what you were just editing.
function CapitalStatementHeader({ client, title, yearEnd }: { client: string; title: string; yearEnd: string }) {
 return (
 <div className="wb-statement-header" style={{ fontFamily: "var(--wb-font-preview)" }}>
 <h2>{client}</h2>
 <h3>{title}</h3>
 <p>For the year ended {yearEnd}</p>
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
 <div className="wb-field">
 <label>{label}</label>
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <button
 type="button"
 className="wb-dropdown-trigger"
 style={{
 display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6,
 height: 36, minWidth: 170, padding: "0 12px",
 border: "1px solid var(--wb-border)", borderRadius: "var(--wb-radius-sm)",
 background: "var(--wb-panel-alt)", color: "var(--wb-text)", fontSize: 16, fontWeight: 500, cursor: "pointer",
 }}
 >
 <span>{current?.label}</span>
 <ChevronDown className="h-3.5 w-3.5" style={{ color: "var(--wb-text-3)" }} />
 </button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="start">
 {options.map(o => (
 <DropdownMenuItem key={o.value} disabled={o.disabled} onClick={() => onChange(o.value)} className="gap-2">
 <Check className={cn("h-3.5 w-3.5", value === o.value ? "opacity-100" : "opacity-0")} style={{ color: "var(--wb-primary)" }} />
 {o.label}
 </DropdownMenuItem>
 ))}
 </DropdownMenuContent>
 </DropdownMenu>
 </div>
 );
}

function CapitalStatementPreview({ data, labels, client, yearEnd, layout, detail }: {
 data: CapitalStatementData; labels: EntityLabels; client: string; yearEnd: string;
 layout: CapLayout; detail: CapDetail;
}) {
 const hasAdj = Math.abs(data.totals.adjustments) > 0.005;
 const ents = capitalEntities(data, detail);
 // There's no participant-level prior-year breakdown anywhere in the system, so the statement
 // is grouped by year — current year shows the Layout/Show breakdown, prior year is always
 // totals-only. The CY summary row reads "Total {year}" when there's a breakdown above it to
 // distinguish it from those rows, or just "{year}" on its own when detail is "total" already.
 const cyYear = (yearEnd.match(/\d{4}/) ?? [])[0] ?? "";
 const pyYear = cyYear ? String(Number(cyYear) - 1) : "";
 // PY never shows its own breakdown rows, but its "Total" prefix still follows whether the
 // statement has a breakdown AT ALL (i.e. CY's), so the two year-groups read as a matched pair.
 const totalPrefix = ents.length ? "Total " : "";
 const cyLabel = `${totalPrefix}${cyYear}`;
 const pyLabel = `${totalPrefix}${pyYear}`;

 const rowKeys: CapRowKey[] = ["opening", "contributions", "ni", "drawings", ...(hasAdj ? ["adjustments" as const] : [])];
 const rowLabel = (k: CapRowKey) =>
 k === "opening" ? "Opening" :
 k === "contributions" ? labels.contributions :
 k === "ni" ? "Net income allocated" :
 k === "drawings" ? labels.drawings : "Adjustments";
 const rowVal = (o: { opening: number; contributions: number; ni: number; drawings: number; adjustments: number }, k: CapRowKey) =>
 k === "drawings" ? -o.drawings : o[k];

 return (
 <div>
 <div style={{ marginBottom: 24 }}>
 <CapitalStatementHeader client={client} title={labels.statementTitle} yearEnd={yearEnd} />
 </div>
 {layout === "horizontal" ? (
 <div style={{ overflowX: "auto" }}>
 <table className="wb-data-table" style={{ fontSize: 13 }}>
 <thead>
 <tr>
 <th></th>
 {ents.map(e => <th key={e.name} className="wb-num" style={{ whiteSpace: "nowrap" }}>{e.name}</th>)}
 <th className="wb-num">Total</th>
 </tr>
 </thead>
 <tbody>
 <tr className="wb-preview-year-row"><td colSpan={ents.length + 2}>{cyYear}</td></tr>
 {rowKeys.map(k => (
 <tr key={k}>
 <td style={{ fontStyle: "italic" }}>{rowLabel(k)}</td>
 {ents.map(e => <td key={e.name} className="wb-num wb-amt-cy">{formatAmt(rowVal(e, k))}</td>)}
 <td className="wb-num wb-amt-cy">{formatAmt(rowVal(data.totals, k))}</td>
 </tr>
 ))}
 <tr className="wb-total-row">
 <td>{cyLabel}</td>
 {ents.map(e => <td key={e.name} className="wb-num wb-amt-cy">{formatAmt(e.closing)}</td>)}
 <td className="wb-num wb-amt-cy">{formatAmt(data.totals.closing)}</td>
 </tr>
 <tr className="wb-preview-year-row"><td colSpan={ents.length + 2}>{pyYear}</td></tr>
 <tr className="wb-total-row">
 <td>{pyLabel}</td>
 {ents.map(e => <td key={e.name} className="wb-num wb-amt-py">—</td>)}
 <td className="wb-num wb-amt-py">{formatAmt(data.totalsPy.closing)}</td>
 </tr>
 </tbody>
 </table>
 </div>
 ) : (
 <table className="wb-data-table" style={{ fontSize: 13 }}>
 <thead>
 <tr>
 <th></th>
 <th className="wb-num">Opening</th>
 <th className="wb-num">{labels.contributions}</th>
 <th className="wb-num">Net income</th>
 <th className="wb-num">{labels.drawings}</th>
 <th className="wb-num">Closing</th>
 </tr>
 </thead>
 <tbody>
 <tr className="wb-preview-year-row"><td colSpan={5}>{cyYear}</td></tr>
 {ents.map(e => (
 <tr key={e.name}>
 <td style={{ fontStyle: "italic" }}>{e.name}</td>
 <td className="wb-num wb-amt-cy">{formatAmt(e.opening)}</td>
 <td className="wb-num wb-amt-cy">{formatAmt(e.contributions)}</td>
 <td className="wb-num wb-amt-cy">{formatAmt(e.ni)}</td>
 <td className="wb-num wb-amt-cy">{formatAmt(-e.drawings)}</td>
 <td className="wb-num wb-amt-cy">{formatAmt(e.closing)}</td>
 </tr>
 ))}
 <tr className="wb-total-row">
 <td>{cyLabel}</td>
 <td className="wb-num wb-amt-cy">{formatAmt(data.totals.opening)}</td>
 <td className="wb-num wb-amt-cy">{formatAmt(data.totals.contributions)}</td>
 <td className="wb-num wb-amt-cy">{formatAmt(data.totals.ni)}</td>
 <td className="wb-num wb-amt-cy">{formatAmt(-data.totals.drawings)}</td>
 <td className="wb-num wb-amt-cy">{formatAmt(data.totals.closing)}</td>
 </tr>
 <tr className="wb-preview-year-row"><td colSpan={5}>{pyYear}</td></tr>
 <tr className="wb-total-row">
 <td>{pyLabel}</td>
 <td className="wb-num wb-amt-py">{formatAmt(data.totalsPy.opening)}</td>
 <td className="wb-num wb-amt-py">{formatAmt(data.totalsPy.contributions)}</td>
 <td className="wb-num wb-amt-py">{formatAmt(data.totalsPy.ni)}</td>
 <td className="wb-num wb-amt-py">{formatAmt(-data.totalsPy.drawings)}</td>
 <td className="wb-num wb-amt-py">{formatAmt(data.totalsPy.closing)}</td>
 </tr>
 </tbody>
 </table>
 )}
 {data.rows.length > 0 && Math.abs(data.totals.closing - data.balanceSheetCapital) >= 0.005 && (
 <div className="wb-preview-row wb-difference">
 <span>Difference vs. Balance Sheet {labels.capitalLabel.toLowerCase()}</span>
 <span className="wb-amt wb-amt-cy" style={{ width: 80, textAlign: "right" }}>{formatAmt(data.totals.closing - data.balanceSheetCapital)}</span>
 </div>
 )}
 <div className="wb-preview-footer">See accompanying notes to financial information</div>
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
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "96px 0", color: "var(--wb-text-3)", border: "1px dashed var(--wb-border)", borderRadius: "var(--wb-radius-md)" }}>
 <FolderOpen className="h-10 w-10" />
 <p style={{ fontWeight: 500, color: "var(--wb-text)" }}>No notes added yet</p>
 </div>
 ) : (
 <div className="flex flex-col gap-4">
 {notes.map(n => (
 <div key={n.id} className="wb-card" style={{ padding: 16 }}>
 <div className="flex items-center justify-between mb-2">
 <Input
 value={n.title}
 onChange={e => updateNote(n.id, { title: e.target.value })}
 className="font-semibold border-none px-0 h-7 text-base focus-visible:ring-0"
 />
 <button onClick={() => removeNote(n.id)} style={{ color: "var(--wb-text-3)", background: "none", border: "none", cursor: "pointer" }}>
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
 <button onClick={() => setBold(v => !v)} className={cn("h-8 w-8 rounded border flex items-center justify-center", bold && "font-bold")} style={{ borderColor: "var(--wb-border)", color: bold ? "var(--wb-primary)" : "var(--wb-text-2)" }}><Bold className="h-3.5 w-3.5" /></button>
 <button onClick={() => setItalic(v => !v)} className={cn("h-8 w-8 rounded border flex items-center justify-center")} style={{ borderColor: "var(--wb-border)", color: italic ? "var(--wb-primary)" : "var(--wb-text-2)" }}><Italic className="h-3.5 w-3.5" /></button>
 <button onClick={() => setUnderline(v => !v)} className={cn("h-8 w-8 rounded border flex items-center justify-center")} style={{ borderColor: "var(--wb-border)", color: underline ? "var(--wb-primary)" : "var(--wb-text-2)" }}><Underline className="h-3.5 w-3.5" /></button>
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
 className="text-center border rounded px-2 py-1"
 style={{ borderColor: "var(--wb-border)" }}
 />
 ) : schedule.name}
 </h2>
 </div>
 <div className="wb-card" style={{ overflow: "hidden" }}>
 <table className="wb-data-table">
 <thead>
 <tr>
 <th>Description</th>
 <th style={{ width: 160 }}>Search</th>
 <th className="wb-num" style={{ width: 144 }}>Current Year</th>
 <th className="wb-num" style={{ width: 144 }}>Prior Year</th>
 </tr>
 </thead>
 <tbody>
 {rows.map(r => (
 <tr key={r.id}>
 <td>
 <Input value={r.description} onChange={e => updateRow(r.id, { description: e.target.value })} className="h-8" />
 </td>
 <td>
 <div className="relative">
 <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--wb-text-3)" }} />
 <Input placeholder="Search" className="h-8 pl-7" />
 </div>
 </td>
 <td>
 <Input type="number" value={r.cy} onChange={e => updateRow(r.id, { cy: Number(e.target.value) || 0 })} className="h-8 text-right" />
 </td>
 <td>
 <Input type="number" value={r.py} onChange={e => updateRow(r.id, { py: Number(e.target.value) || 0 })} className="h-8 text-right" />
 </td>
 </tr>
 ))}
 <tr>
 <td colSpan={4}>
 <button onClick={addRow} style={{ fontSize: 13.5, fontWeight: 500, color: "var(--wb-link)", display: "flex", alignItems: "center", gap: 4, border: "none", background: "none", cursor: "pointer" }}><Plus className="h-3.5 w-3.5" />Add Row</button>
 </td>
 </tr>
 <tr className="wb-total-row">
 <td>Total</td>
 <td />
 <td className="wb-num">{formatAmt(total.cy)}</td>
 <td className="wb-num">{formatAmt(total.py)}</td>
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

 // Force light theme on this page for consistent white workbook experience. A MutationObserver
 // (not just a one-time removal) is needed because the app's ThemeProvider sets the "dark" class
 // in its own effect, which can fire after this one on initial mount and re-add it.
 useEffect(() => {
 const root = document.documentElement;
 const hadDark = root.classList.contains("dark");
 root.classList.remove("dark");
 const observer = new MutationObserver(() => {
 if (root.classList.contains("dark")) root.classList.remove("dark");
 });
 observer.observe(root, { attributes: true, attributeFilter: ["class"] });
 return () => {
 observer.disconnect();
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
 const [cfOverrides, setCfOverrides] = useState<Record<string, CfCategory>>(() => loadCfOverrides(engId));
 const cashFlow = useMemo(() => buildCashFlow(incomeStatement, cfOverrides), [incomeStatement, cfOverrides]);
 const updateCfCategory = (rowId: string, cat: CfCategory) =>
 setCfOverrides(prev => {
 const next = { ...prev, [rowId]: cat };
 saveCfOverrides(engId, next);
 return next;
 });

 const isPartnershipOrTrust = engagement.entityType === "Partnership" || engagement.entityType === "Trust";
 const labels = isPartnershipOrTrust ? getEntityLabels(engagement.entityType as EntityKind, engagement.trustVariant) : null;
 const participants = useMemo<Participant[]>(() => (isPartnershipOrTrust ? loadParticipants(engId) : []), [engId, isPartnershipOrTrust]);
 const pwWorksheet = useMemo(() => loadPWWorksheet(engId), [engId]);
 const capitalStatement = useMemo(
 () => (isPartnershipOrTrust ? buildCapitalStatement(engId, engagement.entityType as EntityKind, participants, pwWorksheet, engagement.trustVariant, incomeStatement.netIncomePy) : null),
 [engId, isPartnershipOrTrust, engagement.entityType, engagement.trustVariant, participants, pwWorksheet, incomeStatement.netIncomePy]
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
 // A point-in-time statement reads "As at", a period statement "For the year ended" —
 // a schedule is neither, so it just shows the date on its own.
 const titleSubtitle =
 activeSchedule ? engagement.yearEnd :
 (active === "tb-grouping" || active === "balance-sheet") ? `As at ${engagement.yearEnd}` :
 `For the year ended ${engagement.yearEnd}`;

 const showPreview = active === "balance-sheet" || active === "income" || active === "capital-statement" || active === "cash-flows" || !!activeSchedule;

 return (
 <div className="workbook-shell flex flex-col h-screen w-screen overflow-hidden">
 {/* Top navy gradient header */}
 <header className="wb-app-header">
 <div className="wb-header-left">
 <span className="wb-com-badge">
 {engagement.type.startsWith("Audit") ? "A" : engagement.type.startsWith("Review") ? "R" : engagement.type.startsWith("Tax") ? "T" : "C"}
 </span>
 <span className="wb-header-label">Engagement Name:</span>
 <span className="wb-header-value">{engagement.id}</span>
 </div>
 <div className="wb-header-center">
 <span className="wb-header-label">Client Name:</span>{" "}
 <span className="wb-header-value">{engagement.client}</span>
 {engagement.entityType !== "Corporation" && (
 <span className="wb-header-value" style={{ marginLeft: 6, padding: "1px 6px", borderRadius: 4, fontSize: 10, background: "rgba(255,255,255,0.15)" }}>{engagement.entityType}</span>
 )}
 </div>
 <div className="wb-header-right">
 <span className="wb-header-label">Year End Date:</span>
 <span className="wb-header-value">{engagement.yearEnd}</span>
 </div>
 </header>

 {/* Three-panel body */}
 <div className="wb-app-main min-h-0">
 {/* LHS nav panel — fully hidden (no band) while closed; opened/closed solely via
 the menu icon in the main toolbar. */}
 {sidebarOpen && (
 <aside className="wb-panel wb-lhs-panel">
 <nav className="wb-lhs-inner">
 <button
 onClick={() => setActive("tb-grouping")}
 className={cn("wb-nav-item", active === "tb-grouping" && "wb-active")}
 >
 Trial Balance Grouping
 </button>
 {navItems.slice(1).map((item) => (
 <button
 key={item.id}
 onClick={() => setActive(item.id)}
 className={cn("wb-nav-item", active === item.id && "wb-active")}
 >
 {item.label}
 </button>
 ))}
 <div className="wb-nav-group">
 <span>Schedules</span>
 </div>
 {schedules.map(s => (
 <button
 key={s.id}
 onClick={() => setActive(`schedule:${s.id}`)}
 className={cn("wb-nav-subitem", active === `schedule:${s.id}` && "wb-active")}
 >
 {s.name}
 </button>
 ))}
 </nav>
 </aside>
 )}

 {/* Main panel */}
 <section className="wb-panel wb-main-panel">
 {/* Title block — icons, centered title/subtitle, and the preview toggle all share
 one row with its own border-bottom, matching production's page-title-block
 (icons + title live together, not a separate toolbar strip above the title). */}
 <div className="wb-title-block">
 <div className="wb-title-block-left">
 <button
 onClick={() => setSidebarOpen(v => !v)}
 className="wb-icon-btn"
 aria-label={sidebarOpen ? "Close menu" : "Open menu"}
 title={sidebarOpen ? "Close menu" : "Open menu"}
 >
 <PanelLeft className="h-4 w-4" />
 </button>
 <button className="wb-icon-btn">
 <Minimize2 className="h-4 w-4" />
 </button>
 <button className="wb-icon-btn wb-subtle">
 <RefreshCw className="h-4 w-4" />
 </button>
 </div>
 <div className="wb-title-block-center">
 <div className="wb-view-title">
 <div className="wb-view-entity">{engagement.client}</div>
 {activeSchedule ? (
 <div className="wb-subtitle">{titleSubtitle}</div>
 ) : (
 <>
 <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
 <h1>{title}</h1>
 {active !== "tb-grouping" && <Pencil className="h-3.5 w-3.5" style={{ color: "var(--wb-text-3)" }} />}
 </div>
 <div className="wb-subtitle">{titleSubtitle}</div>
 </>
 )}
 </div>
 </div>
 <div className="wb-title-block-right">
 {showPreview && (
 <button
 onClick={() => setPreviewCollapsed(v => !v)}
 className="wb-icon-btn"
 aria-label={previewCollapsed ? "Show preview" : "Hide preview"}
 title={previewCollapsed ? "Show preview" : "Hide preview"}
 >
 <PanelRight className="h-4 w-4" />
 </button>
 )}
 </div>
 </div>

 <div className="wb-main-content">
 {/* Filters row */}
 {active !== "notes" && !activeSchedule && (
 <div className="wb-view-controls" style={{ justifyContent: "space-between" }}>
 <div className="flex items-end gap-4">
 <div className="wb-field">
 <label>Entity Name</label>
 <Select defaultValue={engagement.client}>
 <SelectTrigger className="w-[240px] h-9" style={{ background: "var(--wb-panel-alt)", borderColor: "var(--wb-border)", color: "var(--wb-text)" }}>
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value={engagement.client}>{engagement.client}</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="wb-field">
 <label>Year End Date</label>
 <Select defaultValue={engagement.yearEnd}>
 <SelectTrigger className="w-[200px] h-9" style={{ background: "var(--wb-panel-alt)", borderColor: "var(--wb-border)", color: "var(--wb-text)" }}>
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
 <div className="wb-search-field" style={{ minWidth: 260 }}>
 <span className="wb-search-icon"><Search className="h-4 w-4" /></span>
 <Input
 placeholder="Search"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="pl-9 w-[260px] h-9"
 style={{ background: "var(--wb-panel)", borderColor: "var(--wb-border)", color: "var(--wb-text)" }}
 />
 </div>
 {active === "tb-grouping" && (
 <Button className="h-9 gap-2">
 <Download className="h-4 w-4" />
 Export
 <ChevronDown className="h-3 w-3 opacity-80" />
 </Button>
 )}
 </div>
 </div>
 )}

 {/* Content */}
 <div className="flex-1 min-w-0 min-h-0 overflow-y-auto">
 {active === "tb-grouping" && (
 <table className="wb-data-table">
 <thead>
 <tr>
 <th style={{ width: 40 }}></th>
 <th style={{ width: 64 }}>LS</th>
 <th style={{ width: 96 }}>Map No.</th>
 <th style={{ width: 80 }}>Acc No.</th>
 <th>Description</th>
 <th className="wb-num" style={{ width: 112 }}>Original</th>
 <th className="wb-num" style={{ width: 80 }}>Adj</th>
 <th className="wb-num" style={{ width: 112 }}>Final</th>
 <th className="wb-num" style={{ width: 112 }}>PY1</th>
 <th className="wb-num" style={{ width: 128 }}>Change (%)</th>
 <th style={{ textAlign: "center", width: 64 }}>Notes</th>
 <th style={{ textAlign: "center", width: 64 }}>Ref</th>
 </tr>
 </thead>
 <tbody>
 {filteredGroups.map((group) => {
 const collapsed = collapsedGroups.has(group.id);
 const t = totals(group.rows);
 return (
 <Fragment key={group.id}>
 <tr className="wb-group-header" style={{ borderLeft: "2px solid var(--wb-primary)" }}>
 <td colSpan={12}>
 <button
 onClick={() => toggleGroup(group.id)}
 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, color: "var(--wb-text)", border: "none", background: "transparent", cursor: "pointer", padding: 0 }}
 >
 {collapsed ? (
 <ChevronRight className="h-4 w-4" style={{ color: "var(--wb-text-3)" }} />
 ) : (
 <ChevronDown className="h-4 w-4" style={{ color: "var(--wb-text-3)" }} />
 )}
 {group.title}
 </button>
 </td>
 </tr>
 {!collapsed &&
 group.rows.map((row) => (
 <tr key={row.id}>
 <td>
 <input type="checkbox" />
 </td>
 <td><a className="wb-map-link">{row.ls}</a></td>
 <td><a className="wb-map-link">{row.mapNo}</a></td>
 <td>{row.accNo}</td>
 <td className="truncate">{row.description}</td>
 <td className="wb-num">{formatAmt(row.original)}</td>
 <td className="wb-num"><a className="wb-map-link">{formatAmt(row.adj)}</a></td>
 <td className="wb-num">{formatAmt(row.final)}</td>
 <td className="wb-num">{formatAmt(row.py1)}</td>
 <td className="wb-num" style={{ color: "var(--wb-text-2)" }}>{row.changePct}</td>
 <td style={{ textAlign: "center" }}>
 <FileText className="h-4 w-4 inline-block" style={{ color: "var(--wb-text-3)" }} />
 </td>
 <td style={{ textAlign: "center" }}>
 {row.ref ? (
 <span style={{ color: "var(--wb-primary)", fontWeight: 500 }}>{row.ref}</span>
 ) : (
 <span style={{ color: "var(--wb-text-3)" }}>-</span>
 )}
 </td>
 </tr>
 ))}
 {!collapsed && (
 <tr className="wb-total-row">
 <td colSpan={4}></td>
 <td>Total {group.title.replace(/^[A-Z0-9]+\s*-\s*/, "")}</td>
 <td className="wb-num">{formatAmt(t.original)}</td>
 <td className="wb-num">{formatAmt(t.adj)}</td>
 <td className="wb-num">{formatAmt(t.final)}</td>
 <td className="wb-num">{formatAmt(t.py1)}</td>
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
 layout={capLayout}
 detail={capDetail}
 capitalVisibility={engagement.capitalVisibility}
 onGoToIncome={() => setActive("income")}
 />
 )}
 {active === "cash-flows" && (
 <CashFlowCentre cashFlow={cashFlow} overrides={cfOverrides} onChangeCategory={updateCfCategory} />
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
 </section>

 {/* RHS preview — an absolutely-positioned overlay that floats on top of the main
 panel's right edge, including its toolbar (matching production exactly) rather
 than a layout sibling, so opening/closing it never resizes the main panel. Not
 rendered at all while collapsed, so there's no band. Because it floats above the
 main toolbar, its own toggle button there is covered once open, so the preview
 carries its own close button too. */}
 {showPreview && !previewCollapsed && (active === "balance-sheet" || active === "income" || active === "capital-statement" || active === "cash-flows") && (
 <aside className="wb-panel wb-preview-panel">
 <div className="wb-preview-inner">
 <button
 type="button"
 onClick={() => setPreviewCollapsed(true)}
 className="wb-icon-btn wb-preview-close"
 aria-label="Hide preview"
 title="Hide preview"
 >
 <X className="h-4 w-4" />
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
 {active === "cash-flows" && (
 <CashFlowPreview cf={cashFlow} client={engagement.client} yearEnd={engagement.yearEnd} />
 )}
 </div>
 </aside>
 )}
 </div>
 </div>
 );
}
