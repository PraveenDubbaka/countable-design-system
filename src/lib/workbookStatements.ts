// Statement-building logic for the Workbook (P8 foundation). Shared by the centre grouping
// table and the right-hand live preview on the Balance Sheet / Statement of Income pages, so
// the two panes can never drift apart — same rule the Financial Statements folder preview
// should eventually read from too (P10).
import { GROUPS, LS_META, type Group, type Row } from "@/lib/tbGroups";

export interface StatementLine {
 id: string;
 label: string;
 ls: string;
 mapNo: string;
 cy: number;
 py: number;
}

export interface StatementSection {
 id: string;
 label: string;
 lines: StatementLine[];
 cyTotal: number;
 pyTotal: number;
}

// Which broad statement section each LS code rolls into. Current/long-term and
// liability/equity splits follow the LS_META title wording itself (e.g. "H - Property, plant
// and equipment" is obviously long-term, "JJ - Other long-term liabilities" says so directly) —
// not an invented categorization.
const CURRENT_ASSET_LS = ["A", "B", "C", "D", "E", "I"];
const LONG_TERM_ASSET_LS = ["H", "K", "L"];
const CURRENT_LIABILITY_LS = ["AA", "BB", "CC", "DD", "EE"];
const LONG_TERM_LIABILITY_LS = ["JJ", "KK"];
const EQUITY_LS = ["TT"];
const REVENUE_LS = ["20"];
const EXPENSE_LS = ["30", "40", "80"];

// Each GROUPS entry (sub-group) becomes one statement line, labelled by its title with the
// leading "XX - " LS prefix stripped. Known simplification: the demo TB has a few duplicate
// "Custom Group" sub-groupings for LS "A" (an artefact of unclean demo data, not a product
// rule) — they show as separate lines rather than being silently merged, since merging them
// would mean inventing a consolidation rule the underlying data doesn't actually express.
function linesForLs(lsCodes: string[], signFlip: 1 | -1): StatementLine[] {
 const groups = GROUPS.filter(g => lsCodes.includes(g.rows[0]?.ls ?? ""));
 return groups.map(g => {
 const cy = g.rows.reduce((s, r) => s + r.final, 0) * signFlip;
 const py = g.rows.reduce((s, r) => s + r.py1, 0) * signFlip;
 const mapNo = g.rows.find(r => r.mapNo)?.mapNo ?? "";
 return {
 id: g.id,
 label: g.title.replace(/^[A-Z0-9]+\s*-\s*/, ""),
 ls: g.rows[0]?.ls ?? "",
 mapNo,
 cy,
 py,
 };
 });
}

function section(id: string, label: string, lsCodes: string[], signFlip: 1 | -1): StatementSection {
 const lines = linesForLs(lsCodes, signFlip);
 return {
 id,
 label,
 lines,
 cyTotal: lines.reduce((s, l) => s + l.cy, 0),
 pyTotal: lines.reduce((s, l) => s + l.py, 0),
 };
}

export interface BalanceSheetData {
 currentAssets: StatementSection;
 longTermAssets: StatementSection;
 totalAssetsCy: number;
 totalAssetsPy: number;
 currentLiabilities: StatementSection;
 longTermLiabilities: StatementSection;
 totalLiabilitiesCy: number;
 totalLiabilitiesPy: number;
 equity: StatementSection;
 totalLiabEquityCy: number;
 totalLiabEquityPy: number;
 balancesCy: boolean;
 balancesPy: boolean;
}

export function buildBalanceSheet(): BalanceSheetData {
 const currentAssets = section("bs-ca", "Current assets", CURRENT_ASSET_LS, 1);
 const longTermAssets = section("bs-lta", "Long-term assets", LONG_TERM_ASSET_LS, 1);
 const totalAssetsCy = currentAssets.cyTotal + longTermAssets.cyTotal;
 const totalAssetsPy = currentAssets.pyTotal + longTermAssets.pyTotal;

 const currentLiabilities = section("bs-cl", "Current liabilities", CURRENT_LIABILITY_LS, -1);
 const longTermLiabilities = section("bs-ltl", "Long-term liabilities", LONG_TERM_LIABILITY_LS, -1);
 const totalLiabilitiesCy = currentLiabilities.cyTotal + longTermLiabilities.cyTotal;
 const totalLiabilitiesPy = currentLiabilities.pyTotal + longTermLiabilities.pyTotal;

 const equity = section("bs-eq", "Equity", EQUITY_LS, -1);
 const totalLiabEquityCy = totalLiabilitiesCy + equity.cyTotal;
 const totalLiabEquityPy = totalLiabilitiesPy + equity.pyTotal;

 return {
 currentAssets, longTermAssets, totalAssetsCy, totalAssetsPy,
 currentLiabilities, longTermLiabilities, totalLiabilitiesCy, totalLiabilitiesPy,
 equity, totalLiabEquityCy, totalLiabEquityPy,
 balancesCy: Math.abs(totalAssetsCy - totalLiabEquityCy) < 0.005,
 balancesPy: Math.abs(totalAssetsPy - totalLiabEquityPy) < 0.005,
 };
}

export interface IncomeStatementData {
 revenue: StatementSection;
 expenses: StatementSection;
 netIncomeCy: number;
 netIncomePy: number;
 openingRetainedEarningsCy: number;
 openingRetainedEarningsPy: number;
 closingRetainedEarningsCy: number;
 closingRetainedEarningsPy: number;
 // Ties the rolled-forward closing balance back to the Balance Sheet's own Equity total —
 // a real reconciliation check, not a cosmetic one. A non-zero difference here is a genuine
 // "this demo TB doesn't fully tie out" signal, same pattern as the Statement of Partners'
 // Capital's own Difference row (P10).
 differenceCy: number;
 differencePy: number;
}

// Retained-earnings-only GROUPS ids within the TT (equity) LS code. Share-capital-only ids are
// everything else under TT. This split is a bounded, necessary judgment call: the demo TT
// rows don't carry a machine-readable "is this a retained-earnings movement" flag, so the two
// buckets are inferred from each GROUPS entry's own title ("Retained earnings/deficit...").
const RETAINED_EARNINGS_GROUP_IDS = new Set(["g-tt4", "g-tt5"]);

export function buildIncomeStatement(balanceSheet: BalanceSheetData): IncomeStatementData {
 const revenue = section("is-rev", "Revenue", REVENUE_LS, -1);
 const expenses = section("is-exp", "Expenses", EXPENSE_LS, 1);
 const netIncomeCy = revenue.cyTotal - expenses.cyTotal;
 const netIncomePy = revenue.pyTotal - expenses.pyTotal;

 const reLines = balanceSheet.equity.lines.filter(l => RETAINED_EARNINGS_GROUP_IDS.has(l.id));
 // py of the RE lines is last year's closing RE, i.e. this year's opening RE.
 const openingRetainedEarningsCy = reLines.reduce((s, l) => s + l.py, 0);
 // There's no "PPY" figure in this demo data, so the prior-year column shows the same opening
 // RE the current year started from (known foundation-package simplification).
 const openingRetainedEarningsPy = openingRetainedEarningsCy;
 const closingRetainedEarningsCy = openingRetainedEarningsCy + netIncomeCy;
 const closingRetainedEarningsPy = openingRetainedEarningsPy + netIncomePy;

 const equityRetainedEarningsCy = reLines.reduce((s, l) => s + l.cy, 0);
 const equityRetainedEarningsPy = reLines.reduce((s, l) => s + l.py, 0);

 return {
 revenue, expenses, netIncomeCy, netIncomePy,
 openingRetainedEarningsCy, openingRetainedEarningsPy,
 closingRetainedEarningsCy, closingRetainedEarningsPy,
 differenceCy: closingRetainedEarningsCy - equityRetainedEarningsCy,
 differencePy: closingRetainedEarningsPy - equityRetainedEarningsPy,
 };
}

// ── Statement of Cash Flows ──────────────────────────────────────────────────────────────
// Built on the same per-Group-line convention as the Balance Sheet/Income Statement above —
// every GROUPS entry that isn't cash itself or a P&L (revenue/expense) account gets classified
// into exactly one cash-flow category (CFO/CFI/CFF), defaulted by its LS code and overridable
// per row (the preparer can move an individual account into a different category, same idea as
// a real indirect-method mapping grid). Investing/financing roll up each Group's NET change
// (gross asset cost together with any contra/accumulated-amortization row in the same Group) as
// one line, the same simplified "net book value delta" shortcut many small-business cash flow
// templates use in place of a separate non-cash depreciation add-back — so depreciation never
// needs its own operating add-back line, it's already netted inside the Investing line it sits
// under.
export type CfCategory = "CFO" | "CFI" | "CFF" | "Excl";

// "TT - Common shares" bundles genuine balance accounts (Share Capital, Common Shares) together
// with what are actually period-flow accounts (Dividend Paid, an RE adjustment) that reset each
// year rather than roll forward — the demo TB has no separate ls/flag distinguishing the two, so
// these two ids are called out by hand. A flow account's `final` *is* this year's cash effect
// (negated, since paying a dividend is a cash outflow); a balance account's effect is its own
// year-over-year change.
const CF_FLOW_ROW_IDS = new Set(["div-paid", "oth-re"]);
// Retained earnings/opening-equity rows are already captured via net income (operating) and the
// Income Statement's own opening-RE rollforward — including them here would double-count.
const CF_EXCLUDED_ROW_IDS = new Set(["ret-earn", "ob-eq"]);

export function defaultCfCategory(ls: string, rowId: string): CfCategory {
 if (ls === "A") return "Excl"; // the cash balance itself — the thing being reconciled to, not a flow
 if (CF_EXCLUDED_ROW_IDS.has(rowId)) return "Excl";
 if (["B", "C", "D", "E", "I", "BB", "CC"].includes(ls)) return "CFO";
 if (["H", "K", "L"].includes(ls)) return "CFI";
 if (["DD", "JJ", "KK", "TT"].includes(ls)) return "CFF";
 return "Excl"; // revenue/expense (20/30/40/80) — already rolled into net income, not mapped here
}

// A row's own cash effect this year. For an ordinary balance-sheet row this is simply its prior-
// year balance minus its current-year balance: using the *raw* (unflipped) TB value works
// uniformly for assets AND liabilities/equity alike — the sign convention that makes a
// liability's increase a source of cash falls out of the same subtraction once you work in raw
// values (see the BalanceSheet signFlip: displayed liability/equity total = -1 * raw sum, so an
// *increase* in the displayed balance is a *decrease* in the raw sum, i.e. py1 - final is
// already a positive "source of cash" in both cases). A flow account (see CF_FLOW_ROW_IDS) uses
// its own current-year column directly instead of a delta.
export function rowCashEffect(row: Row): number {
 if (CF_FLOW_ROW_IDS.has(row.id)) return -row.final;
 return row.py1 - row.final;
}

export interface CashFlowLine {
 id: string;
 label: string;
 cy: number;
 rows: Row[];
}

export interface CashFlowSection {
 label: string;
 lines: CashFlowLine[];
 total: number;
}

export interface CashFlowData {
 netIncomeCy: number;
 operating: CashFlowSection;
 netCashOperatingCy: number;
 investing: CashFlowSection;
 netCashInvestingCy: number;
 financing: CashFlowSection;
 netCashFinancingCy: number;
 netChangeInCashCy: number;
 cashBeginningCy: number;
 cashEndingCy: number;
 // The Balance Sheet's own actual ending cash — a real reconciliation check against the
 // computed roll-forward above, same "Difference" idiom as every other statement's preview.
 cashEndingActualCy: number;
 differenceCy: number;
}

export function buildCashFlow(incomeStatement: IncomeStatementData, overrides: Record<string, CfCategory>): CashFlowData {
 const cashGroups = GROUPS.filter(g => g.rows[0]?.ls === "A");
 const cashBeginningCy = cashGroups.reduce((s, g) => s + g.rows.reduce((rs, r) => rs + r.py1, 0), 0);
 const cashEndingActualCy = cashGroups.reduce((s, g) => s + g.rows.reduce((rs, r) => rs + r.final, 0), 0);

 const bucket = (cat: CfCategory, label: string): CashFlowSection => {
 const lines: CashFlowLine[] = [];
 for (const g of GROUPS) {
 const ls = g.rows[0]?.ls ?? "";
 const rows = g.rows.filter(r => (overrides[r.id] ?? defaultCfCategory(ls, r.id)) === cat);
 if (rows.length === 0) continue;
 lines.push({
 id: g.id,
 label: g.title.replace(/^[A-Z0-9]+\s*-\s*/, ""),
 cy: rows.reduce((s, r) => s + rowCashEffect(r), 0),
 rows,
 });
 }
 return { label, lines, total: lines.reduce((s, l) => s + l.cy, 0) };
 };

 const operating = bucket("CFO", "Changes in operating assets and liabilities");
 const investing = bucket("CFI", "Investing activities");
 const financing = bucket("CFF", "Financing activities");

 const netCashOperatingCy = incomeStatement.netIncomeCy + operating.total;
 const netCashInvestingCy = investing.total;
 const netCashFinancingCy = financing.total;
 const netChangeInCashCy = netCashOperatingCy + netCashInvestingCy + netCashFinancingCy;
 const cashEndingCy = cashBeginningCy + netChangeInCashCy;

 return {
 netIncomeCy: incomeStatement.netIncomeCy,
 operating, netCashOperatingCy,
 investing, netCashInvestingCy,
 financing, netCashFinancingCy,
 netChangeInCashCy,
 cashBeginningCy, cashEndingCy, cashEndingActualCy,
 differenceCy: cashEndingCy - cashEndingActualCy,
 };
}

export function lsTitle(ls: string): string {
 return LS_META[ls]?.title ?? ls;
}

export function groupsForLs(ls: string): Group[] {
 return GROUPS.filter(g => g.rows[0]?.ls === ls);
}
