import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Reuse engagement data shape from EngagementDetail (lightweight inline copy)
const engagementsData: Record<
  string,
  { id: string; client: string; type: string; yearEnd: string }
> = {
  "COM-CON-Dec312024": { id: "COM-CON-Dec312024", client: "Shipping Line Inc.", type: "Compilation (COM)", yearEnd: "Dec 31, 2024" },
  "COM-PSP-Dec312023": { id: "COM-PSP-Dec312023", client: "Source 40", type: "Compilation (COM)", yearEnd: "Dec 31, 2023" },
  "COM-QB-Dec312025": { id: "COM-QB-Dec312025", client: "qb 40.1", type: "Compilation (COM)", yearEnd: "Dec 31, 2025" },
  "AUD-SL-Mar312024": { id: "AUD-SL-Mar312024", client: "Shipping Line Inc.", type: "Audit (AUD)", yearEnd: "Mar 31, 2024" },
  "REV-SL-Jun302024": { id: "REV-SL-Jun302024", client: "Shipping Line Inc.", type: "Review (REV)", yearEnd: "Jun 30, 2024" },
  "COM-S40-Jun302024": { id: "COM-S40-Jun302024", client: "Source 40", type: "Compilation (COM)", yearEnd: "Jun 30, 2024" },
  "AUD-US-Dec312024": { id: "AUD-US-Dec312024", client: "Harbor Freight Logistics LLC", type: "Audit (GAAS/US)", yearEnd: "Dec 31, 2024" },
};

type NavKey =
  | "tb-grouping"
  | "balance-sheet"
  | "income"
  | "cash-flows"
  | "notes"
  | "schedules";

const NAV_ITEMS: { id: NavKey; label: string }[] = [
  { id: "tb-grouping", label: "Trial Balance Grouping" },
  { id: "balance-sheet", label: "Balance Sheet" },
  { id: "income", label: "Statement of Income and R..." },
  { id: "cash-flows", label: "Statement of Cash Flows" },
  { id: "notes", label: "Notes to Financial Information" },
  { id: "schedules", label: "Schedules" },
];

type Row = {
  id: string;
  ls: string;
  mapNo: string;
  accNo: string;
  description: string;
  original: number;
  adj: number;
  final: number;
  py1: number;
  changePct: string;
  ref?: string;
};

type Group = { id: string; title: string; rows: Row[] };

const mk = (
  id: string,
  ls: string,
  accNo: string,
  description: string,
  original: number,
  adj: number,
  py1: number,
  changePct: string,
): Row => ({
  id,
  ls,
  mapNo: "",
  accNo,
  description,
  original,
  adj,
  final: original + adj,
  py1,
  changePct,
});

const GROUPS: Group[] = [
  {
    id: "g-a1", title: "A - Custom Group 2",
    rows: [
      mk("1005", "A", "1005", "Cash & Cash Equivalents:Chequing 07412-1003540 (3540)", 27167.18, 0, 120247.46, "(77.41)%"),
      mk("1001", "A", "1001", "Cash & Cash Equivalents:Plooto Clearing", 14500.00, 0, -0.01, "(145,000,100.00)%"),
      mk("1011", "A", "1011", "Wise (5456/4967) - USD", 5632.03, 0, 5862.92, "(3.94)%"),
    ],
  },
  {
    id: "g-a2", title: "A - Custom Group 1",
    rows: [
      mk("1004", "A", "1004", "Cash & Cash Equivalents:Cash", 655.39, 0, 655.39, "0.00%"),
      mk("1009", "A", "1009", "RBC USD Checking 5814", 43.83, 0, 879.54, "(95.02)%"),
    ],
  },
  {
    id: "g-a3", title: "A - Cash and cash equivalents",
    rows: [
      mk("1012", "A", "1012", "Undeposited Funds", 0, 0, 0, "0.00%"),
      mk("1006", "A", "1006", "Cash & Cash Equivalents:Float - Prepaid Corp card", 0, 0, 0, "0.00%"),
      mk("1003", "A", "1003", "Plooto Clearing (USD)", 0, 0, 0, "0.00%"),
    ],
  },
  {
    id: "g-b", title: "B - Accounts receivable",
    rows: [
      mk("1100", "B", "1100", "Accounts Receivable (A/R)", 141312.25, 0, 100552.11, "40.54%"),
      mk("1101", "B", "1101", "Accounts Receivable (A/R) - USD", 654.88, 0, 541.80, "20.87%"),
      mk("1002", "B", "1002", "Plooto Clearing (INR)", 0, 0, 0, "0.00%"),
      mk("1102", "B", "1102", "Provision for Bad Debt", -31270.49, 0, -15000.00, "108.47%"),
    ],
  },
  {
    id: "g-c", title: "C - Inventories",
    rows: [mk("1200", "C", "1200", "Inventory Asset", 0, 0, 0, "0.00%")],
  },
  {
    id: "g-d", title: "D - Short-term investments",
    rows: [mk("1440", "D", "1440", "Investments", 0, 0, 0, "0.00%")],
  },
  {
    id: "g-e", title: "E - Loans and notes receivable",
    rows: [
      mk("1151", "E", "1151", "Intercompany Receivables:Due to/from 15338298 Canada Inc", 60000.00, 0, 0, "0.00%"),
      mk("1152", "E", "1152", "Intercompany Receivables:Due to/from Third Pole", 254.48, 0, 0, "0.00%"),
      mk("1423", "E", "1423", "Other Current Assets:Loan to CHL", 0, 0, 0, "0.00%"),
    ],
  },
  {
    id: "g-i", title: "I - Other current assets",
    rows: [
      mk("1430", "I", "1430", "Advanced Payroll clearing", 0, 0, 0, "0.00%"),
      mk("1422", "I", "1422", "Other Current Assets:Loan -Rakshit", 0, 0, 0, "0.00%"),
    ],
  },
  {
    id: "g-h1", title: "H - Furniture and fixtures",
    rows: [mk("fe", "H", "", "Furniture and Equipment", 11922.21, 0, 9222.21, "29.28%")],
  },
  {
    id: "g-h2", title: "H - Other tangible capital assets",
    rows: [mk("1501", "H", "1501", "Fixed Assets:Computer and Laptops", 6413.25, 0, 6413.25, "0.00%")],
  },
  {
    id: "g-h3", title: "H - Accumulated amortization of machinery, equipment, furniture, and fixtures",
    rows: [
      mk("1502", "H", "1502", "Fixed Assets:Computer and Laptops:Acc Depreciation - Computer and Laptops", -6413.25, 0, -4517.43, "41.97%"),
      mk("fe-ad", "H", "", "Furniture and Equipment:Acc. Depreciation - Furniture and Equipment", -7122.47, 0, -4738.03, "50.33%"),
    ],
  },
  {
    id: "g-k", title: "K - Long-term investments",
    rows: [mk("1401", "K", "1401", "Investments in Subsidiaries:Convertible Note - Countable", 0, 0, 0, "0.00%")],
  },
  {
    id: "g-l", title: "L - Assets held in trust",
    rows: [mk("me-hst", "L", "", "Meals & Entertainment HST Dont Use (deleted)", 0, 0, 0, "0.00%")],
  },
  {
    id: "g-bb1", title: "BB - Accounts payable and accrued liabilities",
    rows: [
      mk("ap-inr", "BB", "", "Accounts Payable (A/P) - INR", 0, 0, 0, "0.00%"),
      mk("ap-gbp", "BB", "", "Accounts Payable (A/P) - GBP", -2594.96, 0, -2876.55, "(9.79)%"),
      mk("ap-usd", "BB", "", "Accounts Payable (A/P) - USD", -9048.24, 0, -111145.44, "(91.86)%"),
      mk("ap", "BB", "", "Accounts Payable (A/P)", -66202.54, 0, -45587.48, "45.22%"),
    ],
  },
  {
    id: "g-bb2", title: "BB - Other current liabilities",
    rows: [
      mk("def-rev", "BB", "", "Deferred Revenue", 0, 0, 0, "0.00%"),
      mk("hst-ns", "BB", "", "HST NS 15 Payable", 0, 0, 0, "0.00%"),
      mk("gst-5", "BB", "", "GST/HST Payable:GST 5 Payable", 0, 0, 0, "0.00%"),
      mk("gst-hst", "BB", "", "GST/HST Payable", 0, 0, -2715.00, "(100.00)%"),
      mk("loan-atin", "BB", "", "Loan - Atin Gupta", 0, 0, 0, "0.00%"),
      mk("dd-pay", "BB", "", "Direct Deposit Payable", 0, 0, 0, "0.00%"),
      mk("acc-liab", "BB", "", "Accrued Liability", 0, 0, -72000.00, "(100.00)%"),
      mk("loan-pankaj", "BB", "", "Loan - Pankaj Makkar", 0, 0, 0, "0.00%"),
      mk("gst-susp", "BB", "", "GST/HST Payable:GST/HST Suspense", -19221.08, 0, 0, "0.00%"),
    ],
  },
  {
    id: "g-cc", title: "CC - Taxes payable",
    rows: [
      mk("pl-fed", "CC", "", "Payroll Liabilities:Federal Taxes", 0, 0, 0, "0.00%"),
      mk("pl", "CC", "", "Payroll Liabilities", 0, 0, 0, "0.00%"),
      mk("vac-liab", "CC", "", "Vacation liability", -2359.36, 0, -7400.05, "(68.12)%"),
      mk("inc-tax-p", "CC", "", "Income Tax Payable", -16017.00, 0, 0.38, "(4,215,100.00)%"),
    ],
  },
  {
    id: "g-dd", title: "DD - Short-term debt",
    rows: [
      mk("visa-3440", "DD", "", "VISA 3440", 0, 0, -140.37, "(100.00)%"),
      mk("op-loc", "DD", "", "Operating LOC", 0, 0, 0, "0.00%"),
      mk("visa-loc", "DD", "", "Visa LOC", 0, 0, 0, "0.00%"),
      mk("visa-avion", "DD", "", "Visa Avion (8828/8836)", -9344.89, 0, -10364.38, "(9.84)%"),
      mk("visa-usd", "DD", "", "Visa Credit Card - USD", -10305.25, 0, -11942.04, "(13.71)%"),
      mk("amex-1001", "DD", "", "Amex 1001", -11781.24, 0, -1274.70, "824.24%"),
    ],
  },
  {
    id: "g-jj", title: "JJ - Other long-term liabilities",
    rows: [
      mk("dom-loan", "JJ", "", "Dominion loan", 0, 0, 0, "0.00%"),
      mk("apple-1272", "JJ", "", "Apple Loan #1272", 0, 0, 0, "0.00%"),
      mk("apple-1271", "JJ", "", "Apple Loan #1271", 0, 0, 0, "0.00%"),
      mk("apple-4831", "JJ", "", "Apple Loan # 4831", 0, 0, 0, "0.00%"),
      mk("veh-loan", "JJ", "", "Vehicle Loan Payable", 0, 0, 0, "0.00%"),
      mk("apple-4830", "JJ", "", "Apple Loan # 4830", 0, 0, 0, "0.00%"),
      mk("apple-8474", "JJ", "", "Apple Loan # 8474", 0, 0, 0, "0.00%"),
    ],
  },
  {
    id: "g-kk", title: "KK - Long-term debt",
    rows: [mk("bdc-loan", "KK", "", "BDC Loan", -47310.00, 0, -50000.00, "(5.38)%")],
  },
  {
    id: "g-tt1", title: "TT - Common shares",
    rows: [
      mk("div-paid", "TT", "", "Dividend Paid", 5000.00, 0, 250095.88, "(98.00)%"),
      mk("oth-re", "TT", "", "Other items affecting retained earnings", 0, 0, 20632.00, "(100.00)%"),
      mk("share-cap", "TT", "", "Share Capital", 0, 0, 0, "0.00%"),
      mk("com-sh", "TT", "", "Common Shares", -10.00, 0, -10.00, "0.00%"),
    ],
  },
  {
    id: "g-tt2", title: "TT - Preferred shares",
    rows: [mk("pref-sh", "TT", "", "Preferred shares", -59.79, 0, -59.79, "0.00%")],
  },
  {
    id: "g-tt3", title: "TT - Head office account",
    rows: [mk("rbc-loan", "TT", "", "RBC Loan Account (deleted)", 0, 0, 0, "0.00%")],
  },
  {
    id: "g-tt4", title: "TT - Retained earnings/deficit",
    rows: [mk("ret-earn", "TT", "", "Retained Earnings", 74764.56, 0, -161993.32, "(146.15)%")],
  },
  {
    id: "g-tt5", title: "TT - Retained earnings/deficit start",
    rows: [mk("ob-eq", "TT", "", "Opening Balance Equity", -0.35, 0, -0.35, "0.00%")],
  },
  {
    id: "g-20a", title: "20 - Trade sales of goods and services",
    rows: [mk("sw-resale", "20", "", "Software Resale", -16605.00, -100.00, -12778.00, "30.73%")],
  },
  {
    id: "g-20b", title: "20 - Other revenue",
    rows: [
      mk("oth-inc", "20", "", "Other Income", -6707.00, 0, -38641.71, "(82.64)%"),
      mk("cons-srv", "20", "", "Consulting Services", -213073.07, 0, -250538.31, "(14.95)%"),
      mk("bk-srv", "20", "", "Bookkeeping Services", -668583.73, 0, -622920.78, "7.33%"),
    ],
  },
  {
    id: "g-30", title: "30 - Cost of sales",
    rows: [mk("subc-mgmt", "30", "", "Sub-Contractor Expenses:Management Fee", 125000.00, 0, 169026.54, "(26.05)%")],
  },
  {
    id: "g-40a", title: "40 - Goodwill impairment loss",
    rows: [mk("fx-gl", "40", "", "Exchange Gain or Loss", 3023.04, 0, 431.65, "600.35%")],
  },
  {
    id: "g-40b", title: "40 - Employee benefits",
    rows: [mk("dues-sub", "40", "", "Dues & Subscription", 40470.56, 0, 29766.02, "35.96%")],
  },
  {
    id: "g-40c", title: "40 - Insurance",
    rows: [mk("ins-exp", "40", "", "Insurance Expenses", 7529.52, 0, 8130.73, "(7.39)%")],
  },
  {
    id: "g-40d", title: "40 - Interest and bank charges",
    rows: [mk("bank-chg", "40", "", "Bank Service Charges", 3085.32, 0, 2363.55, "30.54%")],
  },
  {
    id: "g-40e", title: "40 - Interest paid",
    rows: [mk("int-exp", "40", "", "Interest Expense", 74.34, 0, 0, "0.00%")],
  },
  {
    id: "g-40f", title: "40 - Rental",
    rows: [mk("rent-exp", "40", "", "Rent Expense", 725.00, 0, 8600.00, "(91.57)%")],
  },
  {
    id: "g-40g", title: "40 - Repairs and maintenance",
    rows: [mk("rep-maint", "40", "", "Repair and Maintenance", 1611.18, 0, 1346.78, "19.63%")],
  },
  {
    id: "g-40h", title: "40 - Salaries and wages",
    rows: [mk("wages", "40", "", "Wages", 114869.70, 0, 103165.89, "11.34%")],
  },
  {
    id: "g-40i", title: "40 - Travel expenses",
    rows: [mk("trav-exp", "40", "", "Travel Expenses", 29826.74, 0, 33915.05, "(12.05)%")],
  },
  {
    id: "g-40j", title: "40 - Other expenses",
    rows: [
      mk("subc-exp", "40", "", "Sub-Contractor Expenses", 317670.42, 0, 339156.30, "(6.34)%"),
      mk("bad-debts", "40", "", "Bad Debts", 27892.06, 0, 11005.00, "153.45%"),
      mk("off-exp", "40", "", "Office Expenses", 17020.23, 100.00, 22305.26, "(23.25)%"),
      mk("it-exp", "40", "", "IT Expenses", 15000.00, 0, 69048.76, "(78.28)%"),
      mk("auto-exp", "40", "", "Automobile Expenses", 10071.74, 0, 10022.11, "0.50%"),
      mk("prof-legal", "40", "", "Professional & Legal Fees", 9473.59, 0, 20977.49, "(54.84)%"),
      mk("tel-int", "40", "", "Telephone & Internet Expenses", 7368.05, 0, 3384.43, "117.70%"),
      mk("depr-exp", "40", "", "Depreciation Expense", 4280.26, 0, 4290.59, "(0.24)%"),
    ],
  },
  {
    id: "g-40k", title: "40 - Meals and entertainment",
    rows: [mk("meals-ent", "40", "", "Meals & entertainment", 9449.96, 0, 11979.97, "(21.12)%")],
  },
  {
    id: "g-40l", title: "40 - Advertising and promotion",
    rows: [
      mk("mkt-exp", "40", "", "Marketing Expense", 34526.05, 0, 59122.68, "(41.60)%"),
      mk("char-contrib", "40", "", "Charitable Contributions", 430.00, 0, 600.00, "(28.33)%"),
      mk("evt-conf", "40", "", "Event & Conference Expenses", 294.89, 0, 0, "0.00%"),
    ],
  },
  {
    id: "g-80", title: "80 - Unrealized gains/losses",
    rows: [mk("inc-tax-exp", "80", "", "Income Tax Expense", 16017.00, 0, 2902.00, "451.93%")],
  },
];

const formatAmt = (n: number) => {
  if (n === 0) return "0.00";
  const abs = Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n < 0 ? `(${abs})` : abs;
};

export default function Workbook() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const engagement = (engagementId && engagementsData[engagementId]) || {
    id: engagementId || "—",
    client: "Test123",
    type: "Compilation (COM)",
    yearEnd: "Dec 31, 2024",
  };

  const [active, setActive] = useState<NavKey>("tb-grouping");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden">
      {/* Top navy bar */}
      <header className="shrink-0 bg-[hsl(213,68%,28%)] text-white">
        <div className="flex items-center justify-between px-6 py-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-white/10 font-semibold text-xs tracking-wide">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-white/15 text-[10px]">
                {engagement.type.startsWith("Audit") ? "AUD" : engagement.type.startsWith("Review") ? "REV" : "COM"}
              </span>
            </div>
            <span className="opacity-80">Engagement Name:</span>
            <span className="font-semibold">{engagement.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-80">Client Name:</span>
            <span className="font-semibold">{engagement.client}</span>
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
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group",
                    active === item.id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <span className="truncate">{item.label}</span>
                  {item.id === "schedules" && (
                    <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  )}
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Main */}
        <main className="flex-1 min-w-0 overflow-auto bg-background">
          <div className="px-8 py-6">
            {/* Toolbar (collapse / refresh) */}
            <div className="flex items-center gap-2 mb-4">
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
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">Trial Balance Grouping</h1>
              <p className="text-sm text-muted-foreground mt-1">As at {engagement.yearEnd.replace("Dec 31,", "December 31,")}</p>
            </div>

            {/* Filters row */}
            <div className="flex items-end justify-between gap-4 mb-4 flex-wrap">
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

            {/* Table */}
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.04)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                      <>
                        <tr key={`${group.id}-h`} className="bg-muted/20 border-t border-border">
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
                              className="border-t border-border/40 hover:bg-muted/30 transition-colors"
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
                          <tr className="border-t border-border bg-muted/10 font-semibold">
                            <td colSpan={4}></td>
                            <td className="px-3 py-2.5 text-foreground">Total {group.title.replace(/^[A-Z]\s*-\s*/, "")}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatAmt(t.original)}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatAmt(t.adj)}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatAmt(t.final)}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{formatAmt(t.py1)}</td>
                            <td colSpan={3}></td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
