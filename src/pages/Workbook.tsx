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
 type BalanceSheetData,
 type IncomeStatementData,
 type StatementLine,
 type StatementSection,
} from "@/lib/workbookStatements";
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
 return (
 <div>
 <div className="wb-statement-header">
 <h2>{client}</h2>
 <h3>Balance Sheet</h3>
 <p>As at {yearEnd}</p>
 </div>
 <div className="wb-preview-rule" />
 <div style={{ display: "flex", justifyContent: "flex-end", gap: 24, fontSize: 11, fontWeight: 600, color: "var(--wb-text-2)", marginBottom: 4 }}>
 <span style={{ width: 80, textAlign: "right" }}>{yearEnd}</span>
 <span style={{ width: 80, textAlign: "right" }}>Prior Year</span>
 </div>
 <p className="wb-preview-section-title">Assets</p>
 <p style={{ fontWeight: 600, paddingLeft: 8 }}>Current assets</p>
 {bs.currentAssets.lines.map(row)}
 {subtotal("Total current assets", bs.currentAssets.cyTotal, bs.currentAssets.pyTotal)}
 <p style={{ fontWeight: 600, paddingLeft: 8, marginTop: 8 }}>Long-term assets</p>
 {bs.longTermAssets.lines.map(row)}
 {subtotal("Total assets", bs.totalAssetsCy, bs.totalAssetsPy, true)}
 <p className="wb-preview-section-title" style={{ marginTop: 16 }}>Liabilities</p>
 <p style={{ fontWeight: 600, paddingLeft: 8 }}>Current liabilities</p>
 {bs.currentLiabilities.lines.map(row)}
 {subtotal("Total current liabilities", bs.currentLiabilities.cyTotal, bs.currentLiabilities.pyTotal)}
 <p style={{ fontWeight: 600, paddingLeft: 8, marginTop: 8 }}>Long-term liabilities</p>
 {bs.longTermLiabilities.lines.map(row)}
 {subtotal("Total liabilities", bs.totalLiabilitiesCy, bs.totalLiabilitiesPy, true)}
 <p className="wb-preview-section-title" style={{ marginTop: 16 }}>Equity</p>
 {bs.equity.lines.map(row)}
 {subtotal("Total liabilities and equity", bs.totalLiabEquityCy, bs.totalLiabEquityPy, true)}
 <div style={{ marginTop: 16 }}>
 {bs.balancesCy ? (
 <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--wb-success)" }}><Check className="h-3.5 w-3.5" /> Balance sheet balances</span>
 ) : (
 <span className="wb-preview-mismatch" style={{ fontSize: 12 }}>Difference: {formatAmt(bs.totalAssetsCy - bs.totalLiabEquityCy)}</span>
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
 return (
 <div>
 <div className="wb-statement-header">
 <h2>{client}</h2>
 <h3>Statement of Income (Loss) and Retained Earnings (Deficit)</h3>
 <p>For the year ended {yearEnd}</p>
 </div>
 <div className="wb-preview-rule" />
 <div style={{ display: "flex", justifyContent: "flex-end", gap: 24, fontSize: 11, fontWeight: 600, color: "var(--wb-text-2)", marginBottom: 4 }}>
 <span style={{ width: 80, textAlign: "right" }}>{yearEnd}</span>
 <span style={{ width: 80, textAlign: "right" }}>Prior Year</span>
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
 <div style={{ marginTop: 16 }}>
 {Math.abs(is.differenceCy) < 0.005 ? (
 <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--wb-success)" }}><Check className="h-3.5 w-3.5" /> Agrees with Balance Sheet equity</span>
 ) : (
 <span className="wb-preview-mismatch" style={{ fontSize: 12 }}>Difference vs. Balance Sheet: {formatAmt(is.differenceCy)}</span>
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
 <td className="wb-num" style={{ color: "var(--wb-text-3)" }}>—</td>
 </tr>
 <tr>
 <td style={{ fontWeight: 500 }}>{labels.contributions}</td>
 <td colSpan={3} />
 <td className="wb-num">{formatAmt(data.totals.contributions)}</td>
 <td className="wb-num" style={{ color: "var(--wb-text-3)" }}>—</td>
 </tr>
 <tr>
 <td>
 <button type="button" onClick={onGoToIncome} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, fontWeight: 500, color: "var(--wb-link)", font: "inherit" }}>
 Net income allocated <span style={{ color: "var(--wb-text-3)", fontWeight: 400 }}>(from Statement of Income (Loss))</span>
 </button>
 </td>
 <td colSpan={3} />
 <td className="wb-num">{formatAmt(data.totals.ni)}</td>
 <td className="wb-num" style={{ color: "var(--wb-text-3)" }}>—</td>
 </tr>
 <tr>
 <td style={{ fontWeight: 500 }}>{labels.drawings}</td>
 <td colSpan={3} />
 <td className="wb-num">{formatAmt(-data.totals.drawings)}</td>
 <td className="wb-num" style={{ color: "var(--wb-text-3)" }}>—</td>
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
 <td className="wb-num" style={{ color: "var(--wb-text-3)" }}>—</td>
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

function CapRow({ label, v, bold }: { label: string; v: number; bold?: boolean }) {
 return (
 <div className={cn("wb-preview-row", bold && "wb-total")} style={!bold ? { fontStyle: "italic" } : undefined}>
 <span>{label}</span>
 <span className="wb-amt wb-amt-cy" style={{ width: 96, textAlign: "right" }}>{formatAmt(v)}</span>
 </div>
 );
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
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <button
 type="button"
 className="wb-dropdown-trigger"
 style={{
 display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 12px",
 border: "1px solid var(--wb-border)", borderRadius: "var(--wb-radius-sm)",
 background: "var(--wb-panel-alt)", color: "var(--wb-text)", fontSize: 13.5, cursor: "pointer",
 }}
 >
 <span style={{ color: "var(--wb-text-2)", fontWeight: 500 }}>{label}:</span>
 <span style={{ fontWeight: 600 }}>{current?.label}</span>
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
 {rowKeys.map(k => (
 <tr key={k}>
 <td style={{ fontStyle: "italic" }}>{rowLabel(k)}</td>
 {ents.map(e => <td key={e.name} className="wb-num wb-amt-cy">{formatAmt(rowVal(e, k))}</td>)}
 <td className="wb-num wb-amt-cy">{formatAmt(rowVal(data.totals, k))}</td>
 </tr>
 ))}
 <tr className="wb-total-row">
 <td>Balance, end of year</td>
 {ents.map(e => <td key={e.name} className="wb-num wb-amt-cy">{formatAmt(e.closing)}</td>)}
 <td className="wb-num wb-amt-cy">{formatAmt(data.totals.closing)}</td>
 </tr>
 </tbody>
 </table>
 </div>
 ) : (
 <div className="flex flex-col gap-4">
 {(ents.length ? ents : [totalEntity]).map(e => (
 <div key={e.name}>
 <p style={{ fontWeight: 600, marginBottom: 4 }}>{e.name}</p>
 <div style={{ paddingLeft: 12, display: "flex", flexDirection: "column", gap: 2 }}>
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
 <div style={{ marginTop: 16 }}>
 {data.rows.length === 0 ? null : Math.abs(data.totals.closing - data.balanceSheetCapital) < 0.005 ? (
 <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--wb-success)" }}><Check className="h-3.5 w-3.5" /> Agrees with Balance Sheet {labels.capitalLabel.toLowerCase()}</span>
 ) : (
 <span className="wb-preview-mismatch" style={{ fontSize: 12 }}>Difference vs. Balance Sheet: {formatAmt(data.totals.closing - data.balanceSheetCapital)}</span>
 )}
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
 <div className="wb-main-toolbar">
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
 {showPreview && (
 <button
 onClick={() => setPreviewCollapsed(v => !v)}
 className="wb-icon-btn"
 style={{ marginLeft: "auto" }}
 aria-label={previewCollapsed ? "Show preview" : "Hide preview"}
 title={previewCollapsed ? "Show preview" : "Hide preview"}
 >
 <PanelRight className="h-4 w-4" />
 </button>
 )}
 </div>

 <div className="wb-main-content">
 {/* Title */}
 {active === "tb-grouping" && (
 <div className="wb-view-title">
 <h1>Trial Balance Grouping</h1>
 <div className="wb-subtitle">As at {engagement.yearEnd}</div>
 </div>
 )}
 {active !== "tb-grouping" && !activeSchedule && (
 <div className="wb-view-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
 <h1>{title}</h1>
 <Pencil className="h-3.5 w-3.5" style={{ color: "var(--wb-text-3)" }} />
 </div>
 )}

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
 client={engagement.client}
 yearEnd={engagement.yearEnd}
 detail={capDetail}
 capitalVisibility={engagement.capitalVisibility}
 onGoToIncome={() => setActive("income")}
 />
 )}
 {active === "cash-flows" && (
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "96px 0", color: "var(--wb-text-3)", border: "1px dashed var(--wb-border)", borderRadius: "var(--wb-radius-md)" }}>
 <FileText className="h-10 w-10" />
 <p style={{ fontWeight: 500, color: "var(--wb-text)" }}>Statement of Cash Flows is not built yet</p>
 <p style={{ fontSize: 12 }}>Planned for a later Workbook package.</p>
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
 </section>

 {/* RHS preview — an absolutely-positioned overlay that floats on top of the main
 panel's right edge (matching production exactly) rather than a layout sibling, so
 opening/closing it never resizes the main panel. Not rendered at all while
 collapsed, so there's no band — the toggle lives in the main toolbar. */}
 {showPreview && !previewCollapsed && (active === "balance-sheet" || active === "income" || active === "capital-statement") && (
 <aside className="wb-panel wb-preview-panel">
 <div className="wb-preview-inner">
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
 </aside>
 )}
 </div>
 </div>
 );
}
