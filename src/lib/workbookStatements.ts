// Statement-building logic for the Workbook (P8 foundation). Shared by the centre grouping
// table and the right-hand live preview on the Balance Sheet / Statement of Income pages, so
// the two panes can never drift apart — same rule the Financial Statements folder preview
// should eventually read from too (P10).
import { GROUPS, LS_META, type Group } from "@/lib/tbGroups";

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

export function lsTitle(ls: string): string {
 return LS_META[ls]?.title ?? ls;
}

export function groupsForLs(ls: string): Group[] {
 return GROUPS.filter(g => g.rows[0]?.ls === ls);
}
