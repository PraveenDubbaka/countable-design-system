import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEngagements } from "@/store/EngagementsContext";
import { toast } from "sonner";
import { EngagementRightPanel } from "@/components/EngagementRightPanel";
import { Layout } from "@/components/Layout";
import { useSecondaryPanel } from "@/hooks/useSecondaryPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExpandableIconButton } from "@/components/ui/expandable-icon-button";
import { ExpandableSearch } from "@/components/ui/expandable-search";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
 DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
 Tooltip,
 TooltipContent,
 TooltipTrigger,
} from "@/components/ui/tooltip";
import { StyledCard } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewAdjEntryModal, type AdjLine, type AdjEntryMeta } from "@/components/NewAdjEntryModal";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { getUnresolvedDuplicateCount } from "@/data/mergeAccountsData";
import { engagementsData } from "@/data/engagementsData";
import { loadClients } from "@/data/clientsData";
import { loadParticipants, type Participant } from "@/store/participantsStore";
import {
 getGroupingOptions,
 getSubGroupingOptions,
 isParticipantScoped,
 getTaxCodeOptions,
} from "@/lib/tbGroupings";
import {
 matchParticipantByName,
 isPartnerLoanMiswired,
 suggestFromAccountSequence,
 suggestFromPriorMapping,
 savePriorMapping,
} from "@/lib/tbMappingSuggestions";
import { loadTBMappingOverrides, saveTBMappingOverrides, type TBRowOverride } from "@/store/tbMappingStore";
import MergeAccounts from "@/pages/MergeAccounts";
import {
 ChevronDown,
 ChevronLeft,
 ChevronRight,
 ChevronUp,
 Landmark,
 FileText,
 Triangle,
 PencilLine,
 FileSpreadsheet,
 Download,
 RefreshCw,
 Upload,
 Search,
 MoreVertical,
 GripVertical,
 FileX2,
 Network,
 Settings2,
 Building2,
 Calendar,
 Check,
 Plus,
 Trash2,
 GitMerge,
 AlertTriangle,
 Wrench,
 EyeOff,
 Eye,
 ListFilter,
 ArrowLeft,
 X,
 Info,
 CloudUpload,
 Plug,
} from "lucide-react";

// Filter categories with badge colors and short labels (matching screenshot)
const FILTER_CATEGORIES = [
 { id: "unmapped", label: "Unmapped", short: "UNM", color: "hsl(22 45% 48%)" },
 { id: "autoMapped", label: "Auto Mapped", short: "AUT", color: "hsl(28 55% 55%)" },
 { id: "newRow", label: "New row", short: "NEW", color: "hsl(40 50% 50%)" },
 { id: "addedRow", label: "Added row", short: "ADD", color: "hsl(195 45% 55%)" },
 { id: "changeRow", label: "Change row", short: "CHG", color: "hsl(140 35% 50%)" },
 { id: "zeroBal", label: "$0 Bal. Acc.", short: "$0", color: "hsl(0 0% 70%)" },
] as const;

type FilterId = typeof FILTER_CATEGORIES[number]["id"];

const getUniqueClients = () => {
 const clients = new Set<string>();
 Object.values(engagementsData).forEach(e => clients.add(e.client));
 return Array.from(clients);
};

const getEngagementsForClient = (clientName: string) => {
 return Object.values(engagementsData).filter(e => e.client === clientName);
};

// Custom TB Check icon
const TBCheckIcon = ({ className }: { className?: string }) => (
 <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
 <path d="M7.84228 5.33609V8.00276M7.84228 10.6694H7.84895M6.91916 1.93057L1.43591 11.4017C1.13177 11.927 0.979701 12.1896 1.00218 12.4052C1.02178 12.5933 1.12029 12.7641 1.2732 12.8753C1.4485 13.0028 1.75201 13.0028 2.35903 13.0028H13.3255C13.9326 13.0028 14.2361 13.0028 14.4114 12.8753C14.5643 12.7641 14.6628 12.5933 14.6824 12.4052C14.7049 12.1896 14.5528 11.927 14.2487 11.4017L8.76541 1.93057C8.46236 1.40713 8.31084 1.14541 8.11315 1.05751C7.94071 0.980831 7.74386 0.980831 7.57142 1.05751C7.37373 1.14541 7.22221 1.40713 6.91916 1.93057Z" stroke="#F04438" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
);

const inlineHeaderActions = [
 { id: "tb", label: "TB Check", icon: TBCheckIcon },
 { id: "adj", label: "Adj. Entries", icon: PencilLine },
 { id: "workbook", label: "Workbook", icon: FileSpreadsheet },
];

const toolsMenuActions = [
 { id: "bank", label: "Connect Bank", icon: Landmark },
 { id: "docs", label: "Source Docs", icon: FileText },
];


export interface TBRow {
 id: string;
 accNo: string;
 description: string;
 original: number;
 adj: number;
 final: number;
 py1: number;
 changePct: string;
 py2: string;
 mapNo: number | string;
 ls: string;
 grouping: string;
 subGrouping: string;
 cfCategory: string;
 taxCode: number | string;
 fxRate: number;
 // Set only for rows whose Sub Grouping is participant-scoped (Partners' capital /
 // Drawings-Distributions / Contributions) — see src/lib/tbGroupings.ts.
 participantId?: string;
 // True while the current grouping/subGrouping/participant is an unconfirmed suggestion
 // from the auto-mapping engine, rather than something the preparer picked or confirmed.
 autoAssigned?: boolean;
}

// Harbor Freight Logistics LLC — Trial Balance (USD) — Dec 31, 2025
export const baseTrialBalanceData: TBRow[] = [
 // Assets — debit balances (positive)
 { id: "1", accNo: "1010", description: "Cash & Bank", original: 1240000, adj: 0, final: 1240000, py1: 1085000, changePct: "14.29%", py2: "975,000.00", mapNo: 1010, ls: "BB", grouping: "Assets", subGrouping: "Current assets", cfCategory: "CFO", taxCode: 1010, fxRate: 1.00 },
 { id: "2", accNo: "1100", description: "Accounts Receivable", original: 2100000, adj: 0, final: 2100000, py1: 1920000, changePct: "9.38%", py2: "1,750,000.00", mapNo: 1100, ls: "BB", grouping: "Assets", subGrouping: "Current assets", cfCategory: "CFO", taxCode: 1100, fxRate: 1.00 },
 { id: "3", accNo: "1105", description: "Allowance for Doubtful Accounts", original: -42000, adj: 0, final: -42000, py1: -38000, changePct: "10.53%", py2: "(32,000.00)", mapNo: 1105, ls: "BB", grouping: "Assets", subGrouping: "Current assets", cfCategory: "CFO", taxCode: 1105, fxRate: 1.00 },
 { id: "4", accNo: "1200", description: "Inventory", original: 340000, adj: 0, final: 340000, py1: 298000, changePct: "14.09%", py2: "265,000.00", mapNo: 1200, ls: "BB", grouping: "Assets", subGrouping: "Current assets", cfCategory: "CFO", taxCode: 1200, fxRate: 1.00 },
 { id: "5", accNo: "1300", description: "Prepaid Expenses", original: 185000, adj: 0, final: 185000, py1: 162000, changePct: "14.20%", py2: "148,000.00", mapNo: 1300, ls: "BB", grouping: "Assets", subGrouping: "Current assets", cfCategory: "CFO", taxCode: 1300, fxRate: 1.00 },
 { id: "6", accNo: "1510", description: "Right-of-Use Assets (ASC 842)", original: 2800000, adj: 0, final: 2800000, py1: 3080000, changePct: "(9.09)%", py2: "3,360,000.00", mapNo: 1510, ls: "BB", grouping: "Assets", subGrouping: "Non-current assets", cfCategory: "NA", taxCode: 1510, fxRate: 1.00 },
 { id: "7", accNo: "1600", description: "Property Plant & Equipment", original: 6420000, adj: 0, final: 6420000, py1: 5940000, changePct: "8.08%", py2: "5,500,000.00", mapNo: 1600, ls: "BB", grouping: "Assets", subGrouping: "Fixed assets", cfCategory: "CFI", taxCode: 1600, fxRate: 1.00 },
 { id: "8", accNo: "1605", description: "Accumulated Depreciation", original: -1600000, adj: 0, final: -1600000, py1: -1120000, changePct: "42.86%", py2: "(840,000.00)", mapNo: 1605, ls: "BB", grouping: "Assets", subGrouping: "Fixed assets", cfCategory: "CFI", taxCode: 1605, fxRate: 1.00 },
 { id: "9", accNo: "1700", description: "Goodwill", original: 1420000, adj: 0, final: 1420000, py1: 1420000, changePct: "0.00%", py2: "1,420,000.00", mapNo: 1700, ls: "BB", grouping: "Assets", subGrouping: "Non-current assets", cfCategory: "NA", taxCode: 1700, fxRate: 1.00 },
 { id: "10", accNo: "1900", description: "Other Assets", original: 237000, adj: 0, final: 237000, py1: 214000, changePct: "10.75%", py2: "198,000.00", mapNo: 1900, ls: "BB", grouping: "Assets", subGrouping: "Non-current assets", cfCategory: "NA", taxCode: 1900, fxRate: 1.00 },
 { id: "10a", accNo: "1.5", description: "Asset - AIM", original: 445.50, adj: 0, final: 445.50, py1: 445.50, changePct: "0.00%", py2: "221.20", mapNo: 1480, ls: "I", grouping: "Assets", subGrouping: "Current assets", cfCategory: "CFI", taxCode: 1480, fxRate: 1.00 },
 // Liabilities — credit balances (negative)
 { id: "11", accNo: "2010", description: "Accounts Payable", original: -1400000, adj: 0, final: -1400000, py1: -1260000, changePct: "11.11%", py2: "(1,140,000.00)", mapNo: 2010, ls: "BB", grouping: "Liabilities", subGrouping: "Current liabilities", cfCategory: "CFO", taxCode: 2010, fxRate: 1.00 },
 { id: "12", accNo: "2100", description: "Accrued Liabilities", original: -620000, adj: 0, final: -620000, py1: -574000, changePct: "8.01%", py2: "(530,000.00)", mapNo: 2100, ls: "BB", grouping: "Liabilities", subGrouping: "Current liabilities", cfCategory: "CFO", taxCode: 2100, fxRate: 1.00 },
 { id: "13", accNo: "2200", description: "Deferred Revenue", original: -284000, adj: 0, final: -284000, py1: -252000, changePct: "12.70%", py2: "(220,000.00)", mapNo: 2200, ls: "BB", grouping: "Liabilities", subGrouping: "Current liabilities", cfCategory: "CFO", taxCode: 2200, fxRate: 1.00 },
 { id: "14", accNo: "2310", description: "Current Portion LT Debt", original: -480000, adj: 0, final: -480000, py1: -480000, changePct: "0.00%", py2: "(480,000.00)", mapNo: 2310, ls: "BB", grouping: "Liabilities", subGrouping: "Current liabilities", cfCategory: "CFF", taxCode: 2310, fxRate: 1.00 },
 { id: "15", accNo: "2320", description: "Lease Liability - Current", original: -380000, adj: 0, final: -380000, py1: -360000, changePct: "5.56%", py2: "(340,000.00)", mapNo: 2320, ls: "BB", grouping: "Liabilities", subGrouping: "Current liabilities", cfCategory: "CFF", taxCode: 2320, fxRate: 1.00 },
 { id: "16", accNo: "2500", description: "Long-term Debt", original: -4320000, adj: 0, final: -4320000, py1: -4800000, changePct: "(10.00)%", py2: "(5,280,000.00)", mapNo: 2500, ls: "BB", grouping: "Liabilities", subGrouping: "Long-term liabilities", cfCategory: "CFF", taxCode: 2500, fxRate: 1.00 },
 { id: "17", accNo: "2510", description: "Lease Liability - Non-Current", original: -2370000, adj: 0, final: -2370000, py1: -2640000, changePct: "(10.23)%", py2: "(2,910,000.00)", mapNo: 2510, ls: "BB", grouping: "Liabilities", subGrouping: "Long-term liabilities", cfCategory: "CFF", taxCode: 2510, fxRate: 1.00 },
 { id: "18", accNo: "2900", description: "Other Long-term Liabilities", original: -116000, adj: 0, final: -116000, py1: -104000, changePct: "11.54%", py2: "(95,000.00)", mapNo: 2900, ls: "BB", grouping: "Liabilities", subGrouping: "Long-term liabilities", cfCategory: "NA", taxCode: 2900, fxRate: 1.00 },
 // Equity — credit balances (negative)
 { id: "19", accNo: "3100", description: "Common Stock", original: -500000, adj: 0, final: -500000, py1: -500000, changePct: "0.00%", py2: "(500,000.00)", mapNo: 3100, ls: "BB", grouping: "Equity", subGrouping: "Share capital", cfCategory: "NA", taxCode: 3100, fxRate: 1.00 },
 { id: "20", accNo: "3200", description: "Retained Earnings (opening)", original: -2683000, adj: 0, final: -2683000, py1: -1943000, changePct: "38.08%", py2: "(1,354,000.00)", mapNo: 3200, ls: "RE", grouping: "Equity", subGrouping: "Retained earnings", cfCategory: "NA", taxCode: 3200, fxRate: 1.00 },
 // Revenue — credit balances (negative)
 { id: "21", accNo: "4000", description: "Service Revenue", original: -18400000, adj: 0, final: -18400000, py1: -16820000, changePct: "9.39%", py2: "(15,440,000.00)", mapNo: 4000, ls: "I", grouping: "Revenue", subGrouping: "Operating revenue", cfCategory: "CFO", taxCode: 4000, fxRate: 1.00 },
 { id: "22", accNo: "4900", description: "Other Income", original: -47000, adj: 0, final: -47000, py1: -38000, changePct: "23.68%", py2: "(31,000.00)", mapNo: 4900, ls: "I", grouping: "Revenue", subGrouping: "Other income", cfCategory: "CFO", taxCode: 4900, fxRate: 1.00 },
 // Expenses — debit balances (positive)
 { id: "23", accNo: "5000", description: "Cost of Services", original: 12144000, adj: 0, final: 12144000, py1: 11116000, changePct: "9.25%", py2: "10,208,000.00", mapNo: 5000, ls: "I", grouping: "Expenses", subGrouping: "Operating expenses", cfCategory: "CFO", taxCode: 5000, fxRate: 1.00 },
 { id: "24", accNo: "6100", description: "Salaries & Benefits", original: 2160000, adj: 0, final: 2160000, py1: 2040000, changePct: "5.88%", py2: "1,920,000.00", mapNo: 6100, ls: "I", grouping: "Expenses", subGrouping: "Operating expenses", cfCategory: "CFO", taxCode: 6100, fxRate: 1.00 },
 { id: "25", accNo: "6200", description: "Fuel & Vehicle", original: 980000, adj: 0, final: 980000, py1: 876000, changePct: "11.87%", py2: "798,000.00", mapNo: 6200, ls: "I", grouping: "Expenses", subGrouping: "Operating expenses", cfCategory: "CFO", taxCode: 6200, fxRate: 1.00 },
 { id: "26", accNo: "6300", description: "Rent & Occupancy", original: 440000, adj: 0, final: 440000, py1: 420000, changePct: "4.76%", py2: "400,000.00", mapNo: 6300, ls: "I", grouping: "Expenses", subGrouping: "Admin expenses", cfCategory: "CFO", taxCode: 6300, fxRate: 1.00 },
 { id: "27", accNo: "6400", description: "Depreciation & Amortization", original: 480000, adj: 0, final: 480000, py1: 440000, changePct: "9.09%", py2: "400,000.00", mapNo: 6400, ls: "I", grouping: "Expenses", subGrouping: "Admin expenses", cfCategory: "Excl", taxCode: 6400, fxRate: 1.00 },
 { id: "28", accNo: "6500", description: "Interest Expense", original: 384000, adj: 0, final: 384000, py1: 412000, changePct: "(6.80)%", py2: "440,000.00", mapNo: 6500, ls: "I", grouping: "Expenses", subGrouping: "Finance costs", cfCategory: "CFF", taxCode: 6500, fxRate: 1.00 },
 { id: "29", accNo: "6900", description: "Other Operating Expenses", original: 856000, adj: 0, final: 856000, py1: 794000, changePct: "7.81%", py2: "728,000.00", mapNo: 6900, ls: "I", grouping: "Expenses", subGrouping: "Operating expenses", cfCategory: "CFO", taxCode: 6900, fxRate: 1.00 },
 { id: "30", accNo: "7000", description: "Income Tax Expense", original: 249000, adj: 0, final: 249000, py1: 213000, changePct: "16.90%", py2: "183,000.00", mapNo: 7000, ls: "I", grouping: "Expenses", subGrouping: "Finance costs", cfCategory: "CFO", taxCode: 7000, fxRate: 1.00 },
];

const formatNumber = (val: number | string) => {
 if (typeof val === "string") return val;
 const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
 if (val === 0) return "0.00";
 if (val < 0) return `(${fmt(Math.abs(val))})`;
 return fmt(val);
};

// trialBalanceData is managed as state inside the TrialBalance component

const totals = { original: 0.00, adj: 0.00, final: 0.00, py1: 0.00, py2: 0.00 };
export const netIncome = { original: 847000, adj: 0.00, final: 847000, py1: 740000, py2: "589,000.00" };


const TB_LOADED_KEY = (id: string) => `tb-loaded-${id}`;

export function computeAdjFromStorage(engId: string): Record<string, number> {
  const prefix = `adj-entry-${engId}-`;
  const accAdj: Record<string, number> = {};
  Object.keys(localStorage).filter(k => k.startsWith(prefix)).forEach(key => {
    try {
      const entry = JSON.parse(localStorage.getItem(key) ?? "{}") as { lines?: AdjLine[] };
      (entry.lines ?? []).forEach(l => {
        const net = (parseFloat(l.debit) || 0) - (parseFloat(l.credit) || 0);
        if (net !== 0) accAdj[l.accNo] = (accAdj[l.accNo] ?? 0) + net;
      });
    } catch {}
  });
  return accAdj;
}

// GIFI map numbers (per the mapping sheet received from Amar, Nov 2026 — Prod_mapping_Nov2026.csv)
// for the partner/trust capital roll-forward lines. Leadsheet "TT" (Equity) matches every one of
// these lines in the sheet. Only "capital beginning balance" and "drawings/distributions" are
// mapped today — Contributions and Net income allocated aren't TB-sourced accounts in this demo
// (NI is closed into capital via an adjusting entry, which isn't seeded here).
type PartnerClassKey = "general" | "limited" | "trust";
const GIFI_LEADSHEET = "TT";
const GIFI_CAPITAL_MAPNO: Record<PartnerClassKey, string> = {
 general: "3551.00", // General partners' capital beginning balance
 limited: "3561.00", // Limited partners' capital beginning balance
 trust: "3850.01", // Members/beneficiaries equity beginning balance
};
const GIFI_DRAWINGS_MAPNO: Record<PartnerClassKey, string> = {
 general: "3553.00", // General partners' drawings
 limited: "3563.00", // Limited partners' drawings
 trust: "3850.03", // Members distributions
};

// Mock current-year drawings/distributions per participant, keyed by participant id — demo data
// only, so the flow (TB row → GIFI mapping → participant → capital statement) is actually
// demonstrable end to end instead of every partner always showing $0 drawings. Matching figures
// are seeded into the worksheet's own overrides in partnershipWorksheetStore.ts, so the capital
// statement's "Drawings" line reflects the same number, not just the TB row.
export const MOCK_PARTICIPANT_DRAWINGS: Record<string, number> = {
 "WCP-ALEX": 120000,
 "WCP-MORGAN": 75000,
 "WCP-PRIYA": 15000,
 "BFT-TAYLOR": 150000,
 "BFT-JORDAN": 95000,
};

// Partnership/Trust demo seed — one capital account (+ one drawings account, where mocked) per
// participant so the entity-aware grouping, participant column, GIFI mapping and auto-mapping
// suggestions are actually demonstrable (the Corporation demo data has no per-partner capital
// accounts). Opening balance comes from the participant's own openingCapital, not an invented
// figure.
export function buildParticipantScopedRows(entityType: string, participants: Participant[]): TBRow[] {
 if (entityType === "Corporation" || participants.length === 0) return [];
 const nameLabel = entityType === "Trust" ? "Beneficiary" : "Partner";
 const rows: TBRow[] = [];
 participants.forEach((p, i) => {
 const classKey: PartnerClassKey = entityType === "Trust" ? "trust" : (p.participantClass === "limited" ? "limited" : "general");
 const capitalMapNo = GIFI_CAPITAL_MAPNO[classKey];
 const drawingsMapNo = GIFI_DRAWINGS_MAPNO[classKey];
 const opening = p.openingCapital ?? 0;
 rows.push({
 id: `pc-${p.id}`,
 accNo: `${capitalMapNo.split(".")[0]}-${i}`,
 description: `${nameLabel} Capital - ${p.name || "Unnamed"}`,
 original: opening,
 adj: 0,
 final: opening,
 py1: opening,
 changePct: "0.00%",
 py2: formatNumber(opening),
 mapNo: capitalMapNo,
 ls: GIFI_LEADSHEET,
 grouping: "Equity",
 subGrouping: "Partners' capital",
 cfCategory: "NA",
 taxCode: "",
 fxRate: 1.00,
 // Intentionally left unassigned — the auto-mapping effect below suggests a participant
 // from the description (demonstrating the suggestion engine) rather than pre-wiring it.
 } satisfies TBRow);

 const drawings = MOCK_PARTICIPANT_DRAWINGS[p.id] ?? 0;
 if (drawings > 0) {
 rows.push({
 id: `pd-${p.id}`,
 accNo: `${drawingsMapNo.split(".")[0]}-${i}`,
 description: `${nameLabel} Drawings - ${p.name || "Unnamed"}`,
 original: -drawings,
 adj: 0,
 final: -drawings,
 py1: 0,
 changePct: "0.00%",
 py2: "0.00",
 mapNo: drawingsMapNo,
 ls: GIFI_LEADSHEET,
 grouping: "Equity",
 subGrouping: "Drawings / Distributions",
 cfCategory: "NA",
 taxCode: "",
 fxRate: 1.00,
 // Same as the capital row above — left for the auto-mapping suggestion engine to assign.
 } satisfies TBRow);
 }
 });
 return rows;
}

function getRowFilterCategory(row: TBRow, override?: TBRowOverride): FilterId {
 if (row.final === 0) return "zeroBal";
 if (!row.grouping) return "unmapped";
 if (row.autoAssigned && !override?.confirmed) return "autoMapped";
 if (override?.confirmed) return "changeRow";
 if (row.id.startsWith("pc-") || row.id.startsWith("pd-")) return "newRow";
 return "addedRow";
}

export default function TrialBalance() {
 const navigate = useNavigate();
 const { engagementId } = useParams();
 const [dateFilter] = useState("Dec 31 2024");
 const [hideZeroAcc, setHideZeroAcc] = useState(false);
 const zeroAccCount = 0;
 const [isToolbarExpanded, setIsToolbarExpanded] = useState(true);
 const [adjModalOpen, setAdjModalOpen] = useState(false);
 const [mergeModalOpen, setMergeModalOpen] = useState(false);
 const [selectedAdjRow, setSelectedAdjRow] = useState<{ accNo: string; description: string } | null>(null);
 const [trialBalanceData, setTrialBalanceData] = useState([...baseTrialBalanceData]);
 const [activeFilters, setActiveFilters] = useState<Set<FilterId>>(new Set());
 const { isCollapsed: isPanelCollapsed, toggle: togglePanel } = useSecondaryPanel();

 // Restore adj amounts from saved AJE entries on mount
 useEffect(() => {
   if (!engagementId) return;
   const accAdj = computeAdjFromStorage(engagementId);
   if (Object.keys(accAdj).length === 0) return;
   setTrialBalanceData(prev =>
     prev.map(row => {
       const adj = accAdj[row.accNo] ?? 0;
       return { ...row, adj, final: row.original + adj };
     })
   );
 }, [engagementId]);

 // TB load state — persisted per engagement
 const [tbLoaded, setTbLoaded] = useState(() =>
 engagementId ? !!localStorage.getItem(TB_LOADED_KEY(engagementId)) : false
 );
 const [showImport, setShowImport] = useState(false);
 const [cyFile, setCyFile] = useState<File | null>(null);
 const [py1File, setPy1File] = useState<File | null>(null);
 const [py2File, setPy2File] = useState<File | null>(null);
 const [isUploading, setIsUploading] = useState(false);
 const cyInputRef = useRef<HTMLInputElement>(null);
 const py1InputRef = useRef<HTMLInputElement>(null);
 const py2InputRef = useRef<HTMLInputElement>(null);

 const { engagements, updateEngagement } = useEngagements();
 const contextEng = engagements.find(e => e.id === engagementId);
 const staticEng = engagementId ? engagementsData[engagementId] : null;

 const toggleFilter = (id: FilterId) => {
 setActiveFilters(prev => {
 const next = new Set(prev);
 if (next.has(id)) next.delete(id); else next.add(id);
 return next;
 });
 };
 const clearFilters = () => setActiveFilters(new Set());

 const handleUpload = () => {
 if (!cyFile || !engagementId) return;
 setIsUploading(true);
 setTimeout(() => {
 localStorage.setItem(TB_LOADED_KEY(engagementId), '1');
 setTbLoaded(true);
 setShowImport(false);
 setIsUploading(false);
 setCyFile(null); setPy1File(null); setPy2File(null);
 updateEngagement(engagementId, { status: 'In Progress', statusVariant: 'inProgress' });
 toast.success('Trial balance imported successfully');
 }, 1200);
 };

 const cyYear = (() => {
 const ye = contextEng?.yearEnd || staticEng?.yearEnd || '';
 const m = ye.match(/\d{4}/);
 return m ? parseInt(m[0]) : new Date().getFullYear();
 })();

 const engagement = staticEng;
 const displayId = engagementId || "Unknown";
 const clientName = contextEng?.client || engagement?.client || "Unknown Client";
 const status = contextEng?.status || engagement?.status || "In Progress";
 const uniqueClients = getUniqueClients();
 const clientEngagements = getEngagementsForClient(clientName);
 const duplicateCount = getUnresolvedDuplicateCount(engagementId);
 const duplicatesPending = duplicateCount > 0;

 const clientEntityType = (() => {
 try {
 return loadClients().find(c => c.legalEntityName === clientName || c.entityName === clientName)?.entityType ?? "Corporation";
 } catch {
 return "Corporation";
 }
 })();
 const clientCountry = (() => {
 try {
 return loadClients().find(c => c.legalEntityName === clientName || c.entityName === clientName)?.clientCountry ?? "ca";
 } catch {
 return "ca";
 }
 })();
 const participants = engagementId ? loadParticipants(engagementId) : [];

 const [mappingOverrides, setMappingOverrides] = useState<Record<string, TBRowOverride>>(() =>
 engagementId ? loadTBMappingOverrides(engagementId) : {}
 );

 // Apply any previously-confirmed row edits (grouping/sub grouping/participant/tax code/map no)
 // on mount — these previously had NO persistence at all and reset on every reload.
 useEffect(() => {
 if (!engagementId) return;
 setTrialBalanceData(prev => {
 let changed = false;
 const next = prev.map(row => {
 const override = mappingOverrides[row.id];
 if (!override?.confirmed) return row;
 changed = true;
 return {
 ...row,
 grouping: override.grouping ?? row.grouping,
 subGrouping: override.subGrouping ?? row.subGrouping,
 participantId: override.participantId ?? row.participantId,
 taxCode: override.taxCode ?? row.taxCode,
 mapNo: override.mapNo ?? row.mapNo,
 autoAssigned: false,
 };
 });
 return changed ? next : prev;
 });
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [engagementId]);

 // Partnership/Trust: seed participant capital rows, remap the two legacy corporation-shaped
 // equity rows to a valid entity-aware sub grouping, and run the auto-mapping suggestion
 // engine for any participant-scoped row still missing a participant. Every suggestion here
 // is unconfirmed (autoAssigned: true) and can be overridden in the row's own Select.
 useEffect(() => {
 if (!engagementId || clientEntityType === "Corporation") return;
 setTrialBalanceData(prev => {
 let changed = false;
 const withSeedRows = [...prev];
 const existingIds = new Set(prev.map(r => r.id));
 buildParticipantScopedRows(clientEntityType, participants).forEach(r => {
 if (!existingIds.has(r.id)) { withSeedRows.push(r); changed = true; }
 });

 const mappedForSequence = withSeedRows
 .filter(r => r.subGrouping)
 .map(r => ({ accNo: r.accNo, subGrouping: r.subGrouping, participantId: r.participantId }));

 const next = withSeedRows.map(row => {
 if (mappingOverrides[row.id]?.confirmed) return row;

 // Legacy corp-shaped seed rows (Common Stock / Retained Earnings) aren't valid sub
 // groupings for Partnership/Trust — suggest the closest entity-aware analog.
 if (row.accNo === "3100" && row.subGrouping === "Share capital") {
 changed = true;
 return { ...row, subGrouping: "Contributions", autoAssigned: true };
 }
 if (row.accNo === "3200" && row.subGrouping === "Retained earnings") {
 changed = true;
 return { ...row, subGrouping: clientEntityType === "Trust" ? "Accumulated income" : "Partners' capital", autoAssigned: true };
 }

 if (!isParticipantScoped(row.subGrouping) || row.participantId) return row;

 const byName = matchParticipantByName(row.description, participants);
 if (byName && "participantId" in byName) {
 changed = true;
 return { ...row, participantId: byName.participantId, autoAssigned: true };
 }
 const bySequence = suggestFromAccountSequence(row.accNo, mappedForSequence);
 if (bySequence?.participantId) {
 changed = true;
 return { ...row, participantId: bySequence.participantId, autoAssigned: true };
 }
 const byPrior = suggestFromPriorMapping(clientName, row.accNo);
 if (byPrior?.participantId) {
 changed = true;
 return { ...row, participantId: byPrior.participantId, autoAssigned: true };
 }
 return row;
 });
 return changed ? next : prev;
 });
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [engagementId, clientEntityType, participants.length]);

 function updateRowMapping(rowId: string, patch: Partial<Pick<TBRow, "grouping" | "subGrouping" | "participantId" | "taxCode" | "mapNo">>) {
 const row = trialBalanceData.find(r => r.id === rowId);
 setTrialBalanceData(prev => prev.map(r => {
 if (r.id !== rowId) return r;
 const updated: TBRow = { ...r, ...patch, autoAssigned: false };
 if (patch.grouping) {
 const validSubGroupings = getSubGroupingOptions(clientEntityType, patch.grouping);
 if (!validSubGroupings.includes(updated.subGrouping)) {
 updated.subGrouping = validSubGroupings[0] ?? "";
 }
 }
 return updated;
 }));
 if (engagementId) {
 setMappingOverrides(prev => {
 const next: Record<string, TBRowOverride> = {
 ...prev,
 [rowId]: { ...prev[rowId], ...patch, confirmed: true, autoAssigned: false },
 };
 saveTBMappingOverrides(engagementId, next);
 return next;
 });
 }
 if (row) {
 savePriorMapping(clientName, row.accNo, {
 grouping: patch.grouping ?? row.grouping,
 subGrouping: patch.subGrouping ?? row.subGrouping,
 participantId: patch.participantId ?? row.participantId,
 taxCode: String(patch.taxCode ?? row.taxCode ?? ""),
 });
 }
 }

 const trialBalanceBreadcrumb = (
 <div className="flex items-center gap-1 whitespace-nowrap flex-shrink-0 text-sidebar-foreground">
 {/* Client Name (read-only) */}
 <div className="flex items-center gap-1.5 px-2 py-1">
 <div className="w-6 h-6 rounded-md bg-sidebar-foreground/12 border border-sidebar-foreground/15 flex items-center justify-center">
 <Building2 className="h-3.5 w-3.5 text-sidebar-foreground" />
 </div>
 <span className="text-sm font-medium text-sidebar-foreground">{clientName}</span>
 </div>

 <ChevronRight className="h-3.5 w-3.5 text-sidebar-foreground/60" />

 {/* Engagement Selector */}
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <button className="group flex items-center gap-1.5 px-2 py-1 rounded-md border border-sidebar-foreground/20 hover:bg-sidebar-foreground/10 transition-colors">
 <div className="w-6 h-6 rounded-md bg-sidebar-foreground/12 border border-sidebar-foreground/15 flex items-center justify-center">
 <FileText className="h-3.5 w-3.5 text-sidebar-foreground" />
 </div>
 <span className="text-sm font-medium text-sidebar-foreground group-hover:text-sidebar-foreground transition-colors font-mono">{displayId}</span>
 <ChevronDown className="h-3 w-3 text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors" />
 </button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="start" className="w-72">
 <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Engagements for {clientName}</div>
 {clientEngagements.map((eng) => (
 <DropdownMenuItem key={eng.id} onClick={() => navigate(`/engagements/${eng.id}/trial-balance`)} className="flex items-center gap-3 cursor-pointer group py-2">
 <div className="flex flex-col flex-1 min-w-0">
 <span className="font-mono text-sm font-medium truncate">{eng.id}</span>
 <div className="flex items-center gap-2 mt-0.5">
 <Calendar className="h-3 w-3 text-muted-foreground group-hover:text-white transition-colors" />
 <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">{eng.yearEnd}</span>
 <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">•</span>
 <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">{eng.type}</span>
 </div>
 </div>
 {eng.id === displayId && <Check className="h-4 w-4 text-primary group-hover:text-primary-foreground flex-shrink-0" />}
 </DropdownMenuItem>
 ))}
 </DropdownMenuContent>
 </DropdownMenu>

 {/* Status Badge */}
 <Badge
 variant={status === 'Completed' || status === 'New' ? 'completed' : status === 'Not Started' ? 'notStarted' : 'inProgress'}
 className="ml-1 whitespace-nowrap"
 >
 {status}
 </Badge>

 {/* Entity Type Badge — Corporation/Partnership/Trust, so the entity-aware TB behaviour
 (grouping options, Participant column, tax code stubs) is visible wherever this engagement is. */}
 <Badge variant="outline" className="ml-1 whitespace-nowrap">
 {clientEntityType}
 </Badge>

 {/* Xero Integration Badge */}
 <div className="ml-1 inline-flex items-center justify-center h-7 w-20 px-1 bg-card border border-border rounded-sm gap-1">
 <img src="https://upload.wikimedia.org/wikipedia/en/9/9f/Xero_software_logo.svg" alt="Xero" className="h-4" />
 <span className="text-xs font-medium text-foreground">Xero</span>
 </div>
 </div>
 );

 // ── Empty state — only for New engagements without a loaded TB ──────────
 if (!tbLoaded && !showImport && status === 'New') {
 return (
 <Layout title="Engagements" headerContent={trialBalanceBreadcrumb}>
 <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
 {/* Level-1 sticky header — matches loaded TB */}
 <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-1.5 border-b border-border bg-gradient-to-r from-card via-card to-secondary/20">
 <div className="flex items-center gap-2">
 <button disabled className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground opacity-40 pointer-events-none flex-shrink-0">
 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
 <path fill="currentColor" d="M20.25 7c0-.69-.56-1.25-1.25-1.25H9.75v12.5H19c.69 0 1.25-.56 1.25-1.25zM3.75 17c0.69.56 1.25 1.25 1.25h3.25V5.75H5c-.69 0-1.25.56-1.25 1.25zm18 0A2.75 2.75 0 0 1 19 19.75H5A2.75 2.75 0 0 1 2.25 17V7A2.75 2.75 0 0 1 5 4.25h14A2.75 2.75 0 0 1 21.75 7z" />
 </svg>
 </button>
 <h1 className="text-lg font-semibold text-foreground truncate">Trial Balance</h1>
 </div>
 <div className="flex items-center gap-2">
 {inlineHeaderActions.map(action => (
 <ExpandableIconButton key={action.id} variant="secondary" size="sm" icon={<action.icon className="h-4 w-4" />} label={action.label} disabled />
 ))}
 <ExpandableIconButton
 variant="secondary"
 size="sm"
 icon={<Settings2 className="h-4 w-4" />}
 label={<span className="inline-flex items-center gap-1">Tools<ChevronDown className="h-3 w-3" /></span>}
 disabled
 />
 </div>
 </div>
 {/* Level-2 sticky sub-toolbar — matches loaded TB */}
 <div className="sticky top-[42px] z-10 bg-card px-4 py-2 border-b border-border/50">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Button variant="secondary" size="sm" className="h-9 text-xs gap-1.5 opacity-40 pointer-events-none" disabled>
 {dateFilter} <ChevronDown className="h-3.5 w-3.5" />
 </Button>
 </div>
 <div className="flex items-center gap-2">
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <ExpandableIconButton variant="secondary" icon={<Wrench className="h-4 w-4" />} label={<span className="inline-flex items-center gap-1">Actions<ChevronDown className="h-3 w-3" /></span>} />
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end" className="w-44">
 <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => setShowImport(true)}>
 <Upload className="h-4 w-4 text-muted-foreground" /><span>Import</span>
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem disabled className="flex items-center gap-2 opacity-40">
 <Plus className="h-4 w-4 text-muted-foreground" /><span>Add</span>
 </DropdownMenuItem>
 <DropdownMenuItem disabled className="flex items-center gap-2 opacity-40">
 <Trash2 className="h-4 w-4 text-destructive" /><span>Delete</span>
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem disabled className="flex items-center gap-2 opacity-40">
 <FileX2 className="h-4 w-4 text-muted-foreground" /><span>Unmap</span>
 </DropdownMenuItem>
 <DropdownMenuItem disabled className="flex items-center gap-2 opacity-40">
 <Network className="h-4 w-4 text-muted-foreground" /><span>Auto Map</span>
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem disabled className="flex items-center gap-2 opacity-40">
 <Download className="h-4 w-4 text-muted-foreground" /><span>Export</span>
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 <ExpandableIconButton variant="secondary" icon={<RefreshCw className="h-4 w-4" />} label={<span className="inline-flex items-center gap-1">Refresh<ChevronDown className="h-3 w-3" /></span>} disabled />
 <ExpandableIconButton variant="secondary" icon={<EyeOff className="h-4 w-4" />} label="Hide $0 Acc. (0)" disabled />
 <ExpandableSearch disabled />
 </div>
 </div>
 </div>
 {/* Content */}
 <div className="flex-1 overflow-auto flex items-center justify-center p-6">
 <div className="bg-card border border-border rounded-xl p-10 max-w-2xl w-full text-center shadow-sm">
 <p className="text-base font-semibold text-foreground mb-1">No Trial Balance Data Found</p>
 <p className="text-sm text-muted-foreground mb-8">Please Retrieve Data Using One of the Options</p>
 <div className="flex items-stretch gap-6 justify-center">
 {/* Import CSV/Excel/PDF */}
 <div className="flex-1 max-w-xs flex flex-col items-center gap-3 bg-muted/40 border border-border rounded-xl p-6">
 <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
 <CloudUpload className="h-7 w-7 text-primary" />
 </div>
 <p className="text-sm font-semibold text-foreground">Import Data from CSV/Excel/PDF</p>
 <p className="text-xs text-muted-foreground text-center">Choose and import the respective file to effortlessly bring in all data with a single click</p>
 <Button size="sm" className="mt-auto gap-1.5" onClick={() => setShowImport(true)}>
 <Upload className="h-4 w-4" /> Import
 </Button>
 </div>
 <div className="flex items-center text-sm font-medium text-muted-foreground">OR</div>
 {/* Accounting software */}
 <div className="flex-1 max-w-xs flex flex-col items-center gap-3 bg-muted/40 border border-border rounded-xl p-6">
 <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
 <Plug className="h-7 w-7 text-primary" />
 </div>
 <p className="text-sm font-semibold text-foreground">Integrate with Accounting Software</p>
 <p className="text-xs text-muted-foreground text-center">Instantly import data by login and linking to the accounting source</p>
 <Button size="sm" variant="outline" className="mt-auto gap-1.5" onClick={() => toast.info('Accounting source integration coming soon')}>
 <Plug className="h-4 w-4" /> Select Account Source
 </Button>
 </div>
 </div>
 </div>
 </div>
 </div>
 </Layout>
 );
 }

 // ── Import view ───────────────────────────────────────────────────────────
 if (showImport) {
 const years = [cyYear, cyYear - 1, cyYear - 2];
 const DropZone = ({ label, file, onFile, inputRef }: { label: string; file: File | null; onFile: (f: File | null) => void; inputRef: React.RefObject<HTMLInputElement> }) => (
 <div className="flex items-start gap-6 py-4 border-b border-border last:border-b-0">
 <span className="w-44 shrink-0 text-sm font-medium text-foreground pt-4">{label}</span>
 <div className="flex-1">
 {file ? (
 <div className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 bg-card">
 <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
 <span className="text-sm text-foreground flex-1 truncate">{file.name}</span>
 <button onClick={() => onFile(null)} className="text-destructive hover:text-destructive/80">
 <X className="h-4 w-4" />
 </button>
 </div>
 ) : (
 <div
 className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-muted/40 transition-colors"
 onClick={() => inputRef.current?.click()}
 >
 <CloudUpload className="h-8 w-8 text-muted-foreground" />
 <p className="text-sm text-muted-foreground">
 <span className="text-link font-medium">Click to upload</span> or Drag and drop the file
 </p>
 <p className="text-xs text-muted-foreground">(CSV/Excel/PDF)</p>
 </div>
 )}
 <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls,.pdf" className="hidden"
 onChange={e => { const f = e.target.files?.[0] ?? null; onFile(f); e.target.value = ''; }} />
 </div>
 </div>
 );

 return (
 <Layout title="Engagements" headerContent={trialBalanceBreadcrumb}>
 <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
 {/* Level-1 sticky header — matches main TB page */}
 <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-1.5 border-b border-border bg-gradient-to-r from-card via-card to-secondary/20">
 <div className="flex items-center gap-2">
 <button
 onClick={() => setShowImport(false)}
 className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
 >
 <ArrowLeft className="h-4 w-4" />
 </button>
 <h1 className="text-lg font-semibold text-foreground">Import Trial Balance</h1>
 </div>
 <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowImport(false)}>
 <FileSpreadsheet className="h-4 w-4" /> Import TB
 </Button>
 </div>

 {/* Level-2 sticky sub-toolbar — year tabs + upload actions */}
 <div className="sticky top-[42px] z-10 bg-card px-4 py-2 border-b border-border/50">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-xs font-medium text-muted-foreground mb-1.5">Year End</p>
 <div className="flex">
 {years.map((y, i) => (
 <button key={y} className={`px-3 py-1.5 text-sm border transition-colors
 ${i === 0 ? 'rounded-l-md' : '-ml-px'}
 ${i === years.length - 1 ? 'rounded-r-md' : ''}
 ${i === 0 ? 'bg-[#1C63A6] text-white border-primary z-10 relative' : 'border-border text-muted-foreground hover:bg-muted'}`}>
 {y} (0)
 </button>
 ))}
 </div>
 </div>
 <div className="flex items-center gap-2">
 <Button size="sm" variant="outline" disabled={!cyFile && !py1File && !py2File}>Delete Draft</Button>
 <Button size="sm" disabled={!cyFile} onClick={handleUpload} className="gap-1.5">
 {isUploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
 Upload
 </Button>
 </div>
 </div>
 </div>

 {/* Body — full width */}
 <div className="flex-1 overflow-auto p-6">
 <p className="text-sm text-muted-foreground mb-2">
 This feature allows you to upload trial balance data from desktop-based accounting software for one or multiple years. Ensure files follow the specified format in the upload section. The system will auto-generate groupings, and data can only be imported once all items are fully mapped.
 </p>
 <p className="text-sm text-link mb-6 flex items-start gap-1.5">
 <Info className="h-4 w-4 shrink-0 mt-0.5" />
 <em>Note: If results are not as expected, ensure your file has accurate headers with Acc No., Description, Debit, and Credit details and import again.</em>
 </p>

 {/* Upload zones */}
 <div className="bg-card border border-border rounded-xl p-6">
 <DropZone label="Current Year (CY) Trial Balance" file={cyFile} onFile={setCyFile} inputRef={cyInputRef} />
 <DropZone label="Prior Year 1 (PY1) Trial Balance" file={py1File} onFile={setPy1File} inputRef={py1InputRef} />
 <DropZone label="Prior Year 2 (PY2) Trial Balance" file={py2File} onFile={setPy2File} inputRef={py2InputRef} />
 <div className="mt-4">
 <Button className="w-full gap-1.5" disabled={!cyFile} onClick={handleUpload}>
 {isUploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
 Upload
 </Button>
 </div>
 </div>
 </div>
 </div>
 </Layout>
 );
 }

 return (
 <Layout title="Engagements" headerContent={trialBalanceBreadcrumb}>
 <div className="flex h-full overflow-hidden">
 <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
 {/* Top Header Bar - title and tool actions */}
 <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-1.5 border-b border-border bg-gradient-to-r from-card via-card to-secondary/20">
 <div className="flex items-center gap-2">
 <button
 onClick={togglePanel}
 aria-label={isPanelCollapsed ? "Expand sections panel" : "Collapse sections panel"}
 title={isPanelCollapsed ? "Expand sections panel" : "Collapse sections panel"}
 className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
 >
 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" className="shrink-0" aria-hidden="true">
 <path fill="currentColor" d="M20.25 7c0-.69-.56-1.25-1.25-1.25H9.75v12.5H19c.69 0 1.25-.56 1.25-1.25zM3.75 17c0.69.56 1.25 1.25 1.25h3.25V5.75H5c-.69 0-1.25.56-1.25 1.25zm18 0A2.75 2.75 0 0 1 19 19.75H5A2.75 2.75 0 0 1 2.25 17V7A2.75 2.75 0 0 1 5 4.25h14A2.75 2.75 0 0 1 21.75 7z"></path>
 </svg>
 </button>
 <h1 className="text-lg font-semibold text-foreground truncate">
 Trial Balance
 </h1>
 </div>
 <div className="flex items-center gap-2">
 {inlineHeaderActions.map(action => (
 <ExpandableIconButton
 key={action.id}
 variant="secondary"
 size="sm"
 icon={<action.icon className="h-4 w-4" />}
 label={action.label}
 />
 ))}
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <ExpandableIconButton
 variant="secondary"
 size="sm"
 icon={<Settings2 className="h-4 w-4" />}
 label={<span className="inline-flex items-center gap-1">Tools<ChevronDown className="h-3 w-3" /></span>}
 />
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end" className="w-48">
 {toolsMenuActions.map(action => (
 <DropdownMenuItem key={action.id} className="flex items-center gap-2 cursor-pointer group">
 <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
 <span>{action.label}</span>
 </DropdownMenuItem>
 ))}
 </DropdownMenuContent>
 </DropdownMenu>
 </div>

 </div>

 {/* Sub header toolbar - always visible */}
 <div className="sticky top-[42px] z-10 bg-card px-4 py-2 border-b border-border/50">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 {/* Date Selector - dropdown */}
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="secondary" size="sm" className="h-9 text-xs gap-1.5">
 {dateFilter}
 <ChevronDown className="h-3.5 w-3.5" />
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent>
 <DropdownMenuItem>Dec 31 2025</DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>

 </div>

 <div className="flex items-center gap-2">
 {/* Actions dropdown - Add / Merge / Delete / Unmap / Auto Map */}
 <Tooltip>
 <DropdownMenu>
 <TooltipTrigger asChild>
 <DropdownMenuTrigger asChild>
 <ExpandableIconButton
 variant={duplicatesPending ? undefined : "secondary"}
 icon={duplicatesPending ? <AlertTriangle className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
 label={<span className="inline-flex items-center gap-1">Actions<ChevronDown className="h-3 w-3" /></span>}
 className={duplicatesPending ? "bg-amber-50 border-2 border-amber-500 text-amber-700 hover:bg-amber-100" : undefined}
 />
 </DropdownMenuTrigger>
 </TooltipTrigger>
 <DropdownMenuContent align="end" className="w-44">
 <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
 <Plus className="h-4 w-4 text-muted-foreground" />
 <span>Add</span>
 </DropdownMenuItem>
 <DropdownMenuItem
 className="flex items-center gap-2 cursor-pointer"
 onClick={() => setMergeModalOpen(true)}
 >
 <GitMerge className="h-4 w-4 text-muted-foreground" />
 <span className="flex-1">Merge</span>
 {duplicatesPending && <AlertTriangle className="h-4 w-4 text-amber-600" />}
 </DropdownMenuItem>
 <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
 <Trash2 className="h-4 w-4 text-destructive" />
 <span>Delete</span>
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
 <FileX2 className="h-4 w-4 text-muted-foreground" />
 <span>Unmap</span>
 </DropdownMenuItem>
 <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
 <Network className="h-4 w-4 text-muted-foreground" />
 <span>Auto Map</span>
 </DropdownMenuItem>
 <DropdownMenuSeparator />
 <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
 <Upload className="h-4 w-4 text-muted-foreground" />
 <span>Import</span>
 </DropdownMenuItem>
 <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
 <Download className="h-4 w-4 text-muted-foreground" />
 <span>Export</span>
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 {duplicatesPending && (
 <TooltipContent side="top" className="bg-card text-foreground border border-border shadow-md">
 {duplicateCount} duplicate account{duplicateCount === 1 ? "" : "s"} found
 </TooltipContent>
 )}
 </Tooltip>

 {/* Refresh button beside Actions */}
 <Tooltip>
 <DropdownMenu>
 <TooltipTrigger asChild>
 <DropdownMenuTrigger asChild>
 <ExpandableIconButton
 variant="secondary"
 icon={<RefreshCw className="h-4 w-4" />}
 label={<span className="inline-flex items-center gap-1">Refresh<ChevronDown className="h-3 w-3" /></span>}
 />
 </DropdownMenuTrigger>
 </TooltipTrigger>
 <DropdownMenuContent align="end" className="z-[100]">
 <DropdownMenuItem>All Years</DropdownMenuItem>
 <DropdownMenuItem>Current Year</DropdownMenuItem>
 <DropdownMenuItem>PY 1</DropdownMenuItem>
 <DropdownMenuItem>PY 2</DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 <TooltipContent side="bottom" sideOffset={8} className="z-[110]">
 Last updated: <span className="font-medium">54 min ago</span>
 </TooltipContent>
 </Tooltip>



 {/* Hide / Show $0 Accounts toggle */}
 <ExpandableIconButton
 variant="secondary"
 icon={hideZeroAcc ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
 label={`${hideZeroAcc ? "Show" : "Hide"} $0 Acc. (${zeroAccCount})`}
 onClick={() => setHideZeroAcc(v => !v)}
 />

 <ExpandableSearch />
 </div>
 </div>
 </div>

 {/* Table */}
 <StyledCard className="mx-6 mt-6 mb-6 overflow-hidden flex flex-col flex-1 min-h-0">
 <div className="flex-1 overflow-auto">
 <table className="w-full text-sm">
 <thead className="sticky top-0 z-10">
 <tr className="bg-muted border-b border-border">
 <th className="px-0 py-3 align-middle" style={{ width: "16px", minWidth: "16px", maxWidth: "16px" }}>
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <button
 aria-label="Filter rows"
 className="inline-flex items-center justify-center w-4 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/60 transition-colors relative ml-2"
 >
 <ListFilter className="h-3.5 w-3.5" />
 {activeFilters.size > 0 && (
 <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
 )}
 </button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="start" className="w-56">
 <div className="flex items-center justify-between px-2 py-1.5">
 <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Filter</span>
 <button
 onClick={clearFilters}
 className="text-xs font-medium text-link hover:underline"
 >
 Clear All
 </button>
 </div>
 <DropdownMenuSeparator />
 {FILTER_CATEGORIES.map(cat => {
 const checked = activeFilters.has(cat.id);
 return (
 <DropdownMenuItem
 key={cat.id}
 onSelect={(e) => { e.preventDefault(); toggleFilter(cat.id); }}
 className="flex items-center gap-2 cursor-pointer group"
 >
 <Checkbox checked={checked} className="pointer-events-none" />
 <span className="flex-1 text-sm">{cat.label}</span>
 <span
 className="w-2.5 h-2.5 rounded-full flex-shrink-0"
 style={{ backgroundColor: cat.color }}
 />
 </DropdownMenuItem>
 );
 })}
 </DropdownMenuContent>
 </DropdownMenu>
 </th>
 <th className="px-2 py-3 w-8"></th>
 <th className="px-2 py-3 w-8"><Checkbox /></th>
 <th className="text-left px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Acc No.</th>
 <th className="text-left px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap min-w-[180px]">Description</th>
 <th className="text-right px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Original</th>
 <th className="text-right px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Adj</th>
 <th className="text-right px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Final</th>
 <th className="text-right px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">PY1</th>
 <th className="text-right px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">
 Change (%) <ChevronDown className="inline h-3 w-3" />
 </th>
 <th className="text-right px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">PY2</th>
 <th className="text-right px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Map No.</th>
 <th className="text-center px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">LS</th>
 <th className="text-left px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Grouping</th>
 <th className="text-left px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Sub Grouping</th>
 <th className="text-left px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Participant</th>
 <th className="text-center px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">CF Category</th>
 <th className="text-center px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Tax Code</th>
 <th className="text-right px-6 py-3 text-xs font-semibold text-foreground whitespace-nowrap">
 FX Rate <span className="text-muted-foreground">⚙</span>
 </th>
 </tr>
 </thead>
 <tbody>
 {trialBalanceData.map((row) => {
 const override = mappingOverrides[row.id];
 const cat = FILTER_CATEGORIES.find(c => c.id === getRowFilterCategory(row, override))!;
 const visible = activeFilters.size === 0 || activeFilters.has(cat.id);
 if (!visible) return null;
 const subGroupingOptions = getSubGroupingOptions(clientEntityType, row.grouping);
 const participantScoped = isParticipantScoped(row.subGrouping);
 const loanWarning = isPartnerLoanMiswired(row.description, row.grouping);
 const taxCodeOptions = getTaxCodeOptions(clientEntityType, clientCountry);
 return (
 <tr
 key={row.id}
 className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
 data-tour={`tb-row-${row.id}`}
 >
 <td className="p-0 relative" style={{ width: "16px", minWidth: "16px", maxWidth: "16px" }}>
 <div
 className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white tracking-wider overflow-hidden"
 style={{ backgroundColor: cat.color, writingMode: "vertical-rl", transform: "rotate(180deg)" }}
 title={cat.label}
 >
 {cat.short}
 </div>
 </td>
 <td className="px-2 py-2 text-center">
 <button className="text-muted-foreground hover:text-foreground">
 <MoreVertical className="h-3.5 w-3.5" />
 </button>
 </td>
 <td className="px-2 py-2"><Checkbox /></td>
 <td className="px-6 py-2 text-foreground whitespace-nowrap">{row.accNo}</td>
 <td className="px-6 py-2 text-foreground whitespace-nowrap">
 <div className="flex items-center gap-1.5">
 <span>{row.description}</span>
 {loanWarning && (
 <Tooltip>
 <TooltipTrigger asChild>
 <span><Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" />Loan in Equity</Badge></span>
 </TooltipTrigger>
 <TooltipContent side="top">A "loan" account is usually Assets or Liabilities, not Equity — please confirm this mapping</TooltipContent>
 </Tooltip>
 )}
 </div>
 </td>
 <td className="px-6 py-2 text-right text-foreground whitespace-nowrap">{formatNumber(row.original)}</td>
 <td className="px-6 py-2 text-right whitespace-nowrap">
 <button onClick={() => { setSelectedAdjRow({ accNo: row.accNo, description: row.description }); setAdjModalOpen(true); }} className="text-link font-medium hover:underline focus:outline-none">
   {formatNumber(row.adj)}
 </button>
 </td>
 <td className="px-6 py-2 text-right text-foreground whitespace-nowrap">{formatNumber(row.final)}</td>
 <td className="px-6 py-2 text-right text-foreground whitespace-nowrap">{formatNumber(row.py1)}</td>
 <td className="px-6 py-2 text-right text-foreground whitespace-nowrap">{row.changePct}</td>
 <td className="px-6 py-2 text-right text-foreground whitespace-nowrap">{row.py2}</td>
 <td className="px-6 py-2 text-right whitespace-nowrap">
 <Input
 type="number"
 value={row.mapNo === "" ? "" : row.mapNo}
 onChange={e => updateRowMapping(row.id, { mapNo: e.target.value === "" ? "" : Number(e.target.value) })}
 className="h-7 w-20 text-xs text-right ml-auto"
 data-tour={`tb-mapno-${row.id}`}
 />
 </td>
 <td className="px-6 py-2 text-center whitespace-nowrap">
 <span className="text-link font-medium">{row.ls}</span>
 </td>
 <td className="px-6 py-2 whitespace-nowrap">
 <Select value={row.grouping} onValueChange={v => updateRowMapping(row.id, { grouping: v })}>
 <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
 <SelectContent>
 {Object.keys(getGroupingOptions(clientEntityType)).map(g => (
 <SelectItem key={g} value={g}>{g}</SelectItem>
 ))}
 </SelectContent>
 </Select>
 </td>
 <td className="px-6 py-2 whitespace-nowrap">
 <Select value={row.subGrouping} onValueChange={v => updateRowMapping(row.id, { subGrouping: v })}>
 <SelectTrigger className="h-7 w-40 text-xs"><SelectValue /></SelectTrigger>
 <SelectContent>
 {subGroupingOptions.map(sg => (
 <SelectItem key={sg} value={sg}>{sg}</SelectItem>
 ))}
 </SelectContent>
 </Select>
 </td>
 <td className="px-6 py-2 whitespace-nowrap">
 {participantScoped ? (
 <Select value={row.participantId ?? ""} onValueChange={v => updateRowMapping(row.id, { participantId: v })}>
 <SelectTrigger className="h-7 w-36 text-xs" data-tour={`tb-participant-${row.id}`}><SelectValue placeholder="Select…" /></SelectTrigger>
 <SelectContent>
 {participants.map(p => (
 <SelectItem key={p.id} value={p.id}>{p.name || "Unnamed"}</SelectItem>
 ))}
 </SelectContent>
 </Select>
 ) : (
 <span className="text-muted-foreground">—</span>
 )}
 </td>
 <td className="px-6 py-2 text-center whitespace-nowrap">
 <span className="text-link font-medium">{row.cfCategory}</span>
 </td>
 <td className="px-6 py-2 text-center whitespace-nowrap">
 {clientEntityType === "Corporation" ? (
 <Input
 type="number"
 value={row.taxCode === "" ? "" : row.taxCode}
 onChange={e => updateRowMapping(row.id, { taxCode: e.target.value })}
 className="h-7 w-20 text-xs text-center mx-auto"
 />
 ) : (
 <Select value={typeof row.taxCode === "string" && row.taxCode ? row.taxCode : ""} onValueChange={v => updateRowMapping(row.id, { taxCode: v })}>
 <SelectTrigger className="h-7 w-44 text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
 <SelectContent>
 {taxCodeOptions.map(tc => (
 <SelectItem key={tc} value={tc}>{tc}</SelectItem>
 ))}
 </SelectContent>
 </Select>
 )}
 </td>
 <td className="px-6 py-2 text-right text-foreground whitespace-nowrap">{row.fxRate.toFixed(2)}</td>
 </tr>
 );
 })}

 </tbody>
 <tfoot className="sticky bottom-0 z-10">
 {/* Totals row */}
 <tr className="bg-muted border-t border-border">
 <td className="px-6 py-2" colSpan={5}></td>
 <td className="px-6 py-2 text-right font-semibold text-foreground whitespace-nowrap">{formatNumber(totals.original)}</td>
 <td className="px-6 py-2 text-right font-semibold text-foreground whitespace-nowrap">{formatNumber(totals.adj)}</td>
 <td className="px-6 py-2 text-right font-semibold text-foreground whitespace-nowrap">{formatNumber(totals.final)}</td>
 <td className="px-6 py-2 text-right font-semibold text-foreground whitespace-nowrap">{formatNumber(totals.py1)}</td>
 <td className="px-6 py-2"></td>
 <td className="px-6 py-2 text-right font-semibold text-foreground whitespace-nowrap">{formatNumber(totals.py2)}</td>
 <td colSpan={8}></td>
 </tr>

 {/* Net Income row */}
 <tr className="bg-muted border-t border-border">
 <td className="px-6 py-2" colSpan={4}></td>
 <td className="px-6 py-2 text-right font-bold text-foreground whitespace-nowrap">Net Income (loss)</td>
 <td className="px-6 py-2 text-right font-bold text-foreground whitespace-nowrap">{formatNumber(netIncome.original)}</td>
 <td className="px-6 py-2 text-right font-bold text-foreground whitespace-nowrap">{formatNumber(netIncome.adj)}</td>
 <td className="px-6 py-2 text-right font-bold text-foreground whitespace-nowrap">{formatNumber(netIncome.final)}</td>
 <td className="px-6 py-2 text-right font-bold text-foreground whitespace-nowrap">{formatNumber(netIncome.py1)}</td>
 <td className="px-6 py-2"></td>
 <td className="px-6 py-2 text-right font-bold text-foreground whitespace-nowrap">{netIncome.py2}</td>
 <td colSpan={8}></td>
 </tr>
 </tfoot>
 </table>
 </div>
 </StyledCard>
 </div>

 <NewAdjEntryModal
   key={adjModalOpen ? "open" : "closed"}
   open={adjModalOpen}
   onClose={() => setAdjModalOpen(false)}
   onSave={(savedLines, meta) => {
     const entryId = meta.entryNo.replace(/[^a-zA-Z0-9]/g, "-");
     const engId = engagementId ?? "default";

     // An AJE line touching a participant-scoped account carries that account's participant
     // automatically — no separate picker in the modal, since the mapping is already known.
     const linesWithParticipant = savedLines.map(l => {
       const tbRow = trialBalanceData.find(r => r.accNo === l.accNo);
       return tbRow?.participantId ? { ...l, participantId: tbRow.participantId } : l;
     });

     // 1. Persist the adj entry
     writeJsonToLocalStorage(`adj-entry-${engId}-${entryId}`, { lines: linesWithParticipant, meta, clientName, engId: engagementId });

     // 2. Recompute ALL adj from storage (avoids double-counting on re-save)
     const accAdj = computeAdjFromStorage(engId);
     setTrialBalanceData(prev =>
       prev.map(row => {
         const adj = accAdj[row.accNo] ?? 0;
         return { ...row, adj, final: row.original + adj };
       })
     );

     // 3. Write/update the AIM sectionA row
     const aimKey = `audit-aim-data-${engId}`;
     const existing = readJsonFromLocalStorage<{ sectionA?: unknown[]; sectionB?: unknown[] }>(aimKey, { sectionA: [], sectionB: [] });
     let assets = 0, liabilities = 0, pretaxIncome = 0, equity = 0;
     savedLines.forEach(l => {
       const tbRow = trialBalanceData.find(r => r.accNo === l.accNo);
       const net = (parseFloat(l.debit) || 0) - (parseFloat(l.credit) || 0);
       const g = (tbRow?.grouping ?? "").toLowerCase();
       if (g.includes("asset")) assets += net;
       else if (g.includes("liabilit")) liabilities += -net;
       else if (g.includes("equity")) equity += -net;
       else pretaxIncome += -net;
     });

     // An AJE that changes net income invalidates any already-posted capital allocation for
     // Partnership/Trust engagements — mark it stale. Displaying/consuming this flag (a banner
     // prompting a re-run, blocking before export) is P8 scope; P7 only sets it.
     if (pretaxIncome !== 0 && clientEntityType !== "Corporation" && engagementId) {
       localStorage.setItem(`cds_allocation_stale_${engagementId}`, "true");
     }
     const fallbackDesc = savedLines.filter(l => l.description).map(l => l.description).join("; ") || savedLines.filter(l => l.accNo).map(l => l.accNo).join("; ");
     const newRow = {
       id: `tb-${entryId}-${Date.now()}`,
       refNo: meta.entryNo,
       description: meta.notes || fallbackDesc,
       entryType: meta.entryType,
       corrected: "",
       assets: assets !== 0 ? String(assets) : "",
       liabilities: liabilities !== 0 ? String(liabilities) : "",
       pretaxIncome: pretaxIncome !== 0 ? String(pretaxIncome) : "",
       equity: equity !== 0 ? String(equity) : "",
       disclosures: "",
       wpRef: [],
     };
     // Update existing AIM row if same entryNo, otherwise append
     const prevRows = (existing.sectionA ?? []) as typeof newRow[];
     const aimRows = prevRows.some(r => r.refNo === meta.entryNo)
       ? prevRows.map(r => r.refNo === meta.entryNo ? { ...newRow, id: r.id } : r)
       : [...prevRows, newRow];
     writeJsonToLocalStorage(aimKey, { ...existing, sectionA: aimRows });

     toast.success("Adjusting entry saved");
   }}
   engId={engagementId ?? ""}
   clientName={clientName}
   yearEnd={staticEng?.yearEnd ?? "Dec 31, 2024"}
   prefillRow={selectedAdjRow ?? undefined}
 />
 <MergeAccounts open={mergeModalOpen} onOpenChange={setMergeModalOpen} engagementId={engagementId} />
 {/* Right Panel */}
 <EngagementRightPanel />
 </div>
 </Layout>
 );
}
