import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EngagementRightPanel } from "@/components/EngagementRightPanel";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExpandableIconButton } from "@/components/ui/expandable-icon-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StyledCard } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronRight,
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
} from "lucide-react";
// Engagement data for breadcrumb
const engagementsData: Record<string, { id: string; client: string; type: string; yearEnd: string; status: string }> = {
  "COM-CON-Dec312024": { id: "COM-CON-Dec312024", client: "Shipping Line Inc.", type: "Compilation (COM)", yearEnd: "Dec 31, 2024", status: "In Progress" },
  "COM-PSP-Dec312023": { id: "COM-PSP-Dec312023", client: "Source 40", type: "Compilation (COM)", yearEnd: "Dec 31, 2023", status: "In Progress" },
  "COM-QB-Dec312025": { id: "COM-QB-Dec312025", client: "qb 40.1", type: "Compilation (COM)", yearEnd: "Dec 31, 2025", status: "In Progress" },
  "AUD-SL-Mar312024": { id: "AUD-SL-Mar312024", client: "Shipping Line Inc.", type: "Audit (AUD)", yearEnd: "Mar 31, 2024", status: "In Progress" },
  "REV-SL-Jun302024": { id: "REV-SL-Jun302024", client: "Shipping Line Inc.", type: "Review (REV)", yearEnd: "Jun 30, 2024", status: "In Progress" },
  "COM-S40-Jun302024": { id: "COM-S40-Jun302024", client: "Source 40", type: "Compilation (COM)", yearEnd: "Jun 30, 2024", status: "In Progress" },
};

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

const headerActions = [
  { id: "bank", label: "Connect Bank", icon: Landmark },
  { id: "docs", label: "Source Docs", icon: FileText },
  { id: "tb", label: "TB Check", icon: TBCheckIcon },
  { id: "adj", label: "Adj. Entries", icon: PencilLine },
  { id: "workbook", label: "Workbook", icon: FileSpreadsheet },
];

// Sample trial balance data matching screenshot
const baseTrialBalanceData = [
  { id: "1", accNo: "1.112", description: "Asset AIM renamed", original: 145.00, adj: 0.00, final: 145.00, py1: 0.00, changePct: "0.00%", py2: "(110.10)", mapNo: 1480.00, ls: "I", grouping: "Assets", subGrouping: "Current assets", cfCategory: "CFO", taxCode: 1480, fxRate: 1.00 },
  { id: "2", accNo: "2.1", description: "Assets-AIM2 2.1", original: 1260.10, adj: 0.00, final: 1260.10, py1: 1260.00, changePct: "0.01%", py2: "100.00", mapNo: 2960.00, ls: "BB", grouping: "Liabilities", subGrouping: "Current liabilities", cfCategory: "CFO", taxCode: 2960, fxRate: 1.00 },
  { id: "3", accNo: "2.12", description: "Add locally 40 test 2", original: "(10.10)", adj: 0.00, final: "(10.10)", py1: "(10.10)", changePct: "0.00%", py2: "0.00", mapNo: 1480.00, ls: "I", grouping: "Assets", subGrouping: "Current assets", cfCategory: "CFO", taxCode: 1480, fxRate: 1.00 },
  { id: "4", accNo: "002.2", description: "Liabilities-A2IM edited", original: 56.00, adj: 0.00, final: 56.00, py1: "(50.00)", changePct: "(212.00)%", py2: "120.10", mapNo: 2960.00, ls: "BB", grouping: "Liabilities", subGrouping: "Current liabilities", cfCategory: "CFO", taxCode: 2960, fxRate: 1.00 },
  { id: "5", accNo: "3.5", description: "Equity-AIM", original: 105.00, adj: 0.00, final: 105.00, py1: 115.00, changePct: "(8.70)%", py2: "0.00", mapNo: 7006.00, ls: "TT", grouping: "Equity", subGrouping: "Other compreh...", cfCategory: "NA", taxCode: 7006, fxRate: 1.00 },
  { id: "6", accNo: "3.606", description: "3.60 puat 38 test", original: 651.40, adj: 0.00, final: 651.40, py1: 650.40, changePct: "0.15%", py2: "251.20", mapNo: 1480.00, ls: "I", grouping: "Assets", subGrouping: "Current assets", cfCategory: "CFO", taxCode: 1480, fxRate: 1.00 },
  { id: "7", accNo: "005", description: "Costofsales-AIM", original: 0.00, adj: 0.00, final: 0.00, py1: "(11.00)", changePct: "(100.00)%", py2: "0.00", mapNo: 9270.00, ls: "40", grouping: "Expenses", subGrouping: "Operating expe...", cfCategory: "Excl", taxCode: 9270, fxRate: 1.00 },
  { id: "8", accNo: "007.1", description: "MSD-WK renamed", original: 8.00, adj: 0.00, final: 8.00, py1: "(151.00)", changePct: "(105.30)%", py2: "(0.20)", mapNo: 9270.00, ls: "40", grouping: "Expenses", subGrouping: "Operating expe...", cfCategory: "Excl", taxCode: 9270, fxRate: 1.00 },
  { id: "9", accNo: "8.1010", description: "test ga uat v8.1", original: 10.00, adj: 0.00, final: 10.00, py1: 10.00, changePct: "0.00%", py2: "10.00", mapNo: 1480.00, ls: "I", grouping: "Assets", subGrouping: "Current assets", cfCategory: "CFO", taxCode: 1480, fxRate: 1.00 },
];

// Generate 100 additional rows
const descriptions = ["Accounts Receivable", "Prepaid Insurance", "Office Equipment", "Accumulated Depreciation", "Notes Payable", "Unearned Revenue", "Common Stock", "Retained Earnings", "Service Revenue", "Salary Expense", "Rent Expense", "Utilities Expense", "Insurance Expense", "Depreciation Expense", "Supplies Expense", "Interest Expense", "Interest Income", "Dividend Income", "Gain on Sale", "Loss on Disposal", "Inventory", "Cost of Goods Sold", "Sales Returns", "Purchase Discounts", "Freight In", "Bad Debt Expense", "Allowance for Doubtful", "Bonds Payable", "Premium on Bonds", "Treasury Stock", "Cash Equivalents", "Short-term Investments", "Long-term Investments", "Goodwill", "Patents", "Copyright", "Trademark", "Franchise Rights", "Leasehold Improvements", "Land", "Building", "Machinery", "Vehicles", "Furniture & Fixtures", "Computer Equipment", "Software Licenses", "Mortgage Payable", "Lease Liability", "Deferred Tax Asset", "Deferred Tax Liability"];
const groupings = ["Assets", "Liabilities", "Equity", "Revenue", "Expenses"];
const subGroupings: Record<string, string[]> = { Assets: ["Current assets", "Non-current assets", "Fixed assets"], Liabilities: ["Current liabilities", "Long-term liabilities"], Equity: ["Share capital", "Retained earnings", "Other compreh..."], Revenue: ["Operating revenue", "Other income"], Expenses: ["Operating expe...", "Admin expenses", "Finance costs"] };
const lsCodes = ["I", "BB", "TT", "40", "IS", "RE"];
const cfCategories = ["CFO", "CFI", "CFF", "Excl", "NA"];

const formatNumber = (val: number | string) => {
  if (typeof val === "string") return val;
  if (val === 0) return "0.00";
  if (val < 0) return `(${Math.abs(val).toFixed(2)})`;
  return val.toFixed(2);
};

const generatedRows = Array.from({ length: 100 }, (_, i) => {
  const idx = i + 10;
  const grp = groupings[i % groupings.length];
  const subGrps = subGroupings[grp];
  const orig = parseFloat((Math.random() * 5000 - 1000).toFixed(2));
  const adjVal = parseFloat((Math.random() * 100 - 50).toFixed(2));
  const finalVal = parseFloat((orig + adjVal).toFixed(2));
  const py1Val = parseFloat((orig + (Math.random() * 200 - 100)).toFixed(2));
  const changePct = py1Val !== 0 ? `${(((finalVal - py1Val) / Math.abs(py1Val)) * 100).toFixed(2)}%` : "0.00%";
  const py2Val = parseFloat((Math.random() * 3000 - 500).toFixed(2));
  const mapNo = [1480, 2960, 7006, 9270, 4100, 5200, 6300][i % 7];
  return {
    id: String(idx),
    accNo: `${idx}.${String(i % 100).padStart(2, "0")}`,
    description: descriptions[i % descriptions.length],
    original: orig,
    adj: adjVal,
    final: finalVal,
    py1: py1Val,
    changePct,
    py2: formatNumber(py2Val),
    mapNo,
    ls: lsCodes[i % lsCodes.length],
    grouping: grp,
    subGrouping: subGrps[i % subGrps.length],
    cfCategory: cfCategories[i % cfCategories.length],
    taxCode: mapNo,
    fxRate: 1.00,
  };
});

const trialBalanceData = [...baseTrialBalanceData, ...generatedRows];

const totals = { original: 0.00, adj: 0.00, final: 0.00, py1: 0.00, py2: 0.00 };
const netIncome = { original: 14.35, adj: 0.00, final: 14.35, py1: 149.22, py2: "(2,150.10)" };


// Group trial balance data by grouping
const groupedData = trialBalanceData.reduce<Record<string, typeof trialBalanceData>>((acc, row) => {
  const key = row.grouping;
  if (!acc[key]) acc[key] = [];
  acc[key].push(row);
  return acc;
}, {});

const sectionOrder = Object.keys(groupedData);

export default function TrialBalance() {
  const navigate = useNavigate();
  const { engagementId } = useParams();
  const [dateFilter] = useState("Nov 27 2025");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const engagement = engagementId ? engagementsData[engagementId] : null;
  const displayId = engagementId || "Unknown";
  const clientName = engagement?.client || "Unknown Client";
  const status = engagement?.status || "In Progress";
  const uniqueClients = getUniqueClients();
  const clientEngagements = getEngagementsForClient(clientName);

  return (
    <Layout>
      <div className="flex h-full overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar - matching Engagement Detail style */}
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-border bg-gradient-to-r from-card via-card to-secondary/20">
          {/* Left side - Interactive Breadcrumb */}
          <div className="flex items-center gap-2">
            {/* Client Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-primary/5 transition-colors">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{clientName}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-card border shadow-lg z-50">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Select Client</div>
                {uniqueClients.map((client) => (
                  <DropdownMenuItem key={client} className="flex items-center gap-2 cursor-pointer group">
                    <Building2 className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                    <span className="flex-1">{client}</span>
                    {client === clientName && <Check className="h-4 w-4 text-primary group-hover:text-primary-foreground" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />

            {/* Engagement Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-primary/5 transition-colors">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
                    <FileText className="h-3.5 w-3.5 text-secondary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors font-mono">{displayId}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 bg-card border shadow-lg z-50">
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
              className="ml-2 whitespace-nowrap"
            >
              {status}
            </Badge>
          </div>

          {/* Right side - Tools dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium">
                <Settings2 className="h-3.5 w-3.5 mr-1.5" />
                Tools
                <ChevronDown className="h-3 w-3 ml-1.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card border shadow-lg z-50">
              {headerActions.map((action) => (
                <DropdownMenuItem key={action.id} className="flex items-center gap-2 cursor-pointer group">
                  <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span>{action.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Action Buttons - Sticky Header with Title (matching Engagement Detail) */}
        <div className="sticky top-0 z-10 bg-card px-4 py-2 flex items-center justify-between border-b border-border/50">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-foreground truncate">
              Trial Balance
            </h1>
            <span className="text-xs text-muted-foreground">
              Last updated: <span className="font-medium text-foreground">54 min ago</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Date Selector - dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 bg-card border-border hover:bg-muted">
                  {dateFilter}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border shadow-lg z-50">
                <DropdownMenuItem>Nov 27 2025</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter - dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 bg-card border-border hover:bg-muted">
                  <span className="text-muted-foreground">≡</span> Filter by
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border shadow-lg z-50">
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem>Assets</DropdownMenuItem>
                <DropdownMenuItem>Liabilities</DropdownMenuItem>
                <DropdownMenuItem>Equity</DropdownMenuItem>
                <DropdownMenuItem>Expenses</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Icon-only expandable buttons */}
            <ExpandableIconButton variant="outline" className="bg-card border-border hover:bg-muted" icon={<FileX2 className="h-4 w-4" />} label="Unmap" />
            <ExpandableIconButton variant="outline" className="bg-card border-border hover:bg-muted" icon={<Network className="h-4 w-4" />} label="Auto Map" />
            <ExpandableIconButton variant="outline" className="bg-card border-border hover:bg-muted" icon={<Upload className="h-4 w-4" />} label="Import" />
            <ExpandableIconButton variant="outline" className="bg-card border-border hover:bg-muted" icon={<Download className="h-4 w-4" />} label="Export" />
            <ExpandableIconButton variant="outline" className="bg-card border-border hover:bg-muted" icon={<RefreshCw className="h-4 w-4" />} label="Refresh" />

            {/* Zero Balance Accounts - dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ExpandableIconButton variant="outline" className="bg-card border-border hover:bg-muted" icon={<MoreVertical className="h-4 w-4" />} label="Zero Balance" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border shadow-lg z-50">
                <DropdownMenuItem>Show Zero Balance</DropdownMenuItem>
                <DropdownMenuItem>Hide Zero Balance</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ExpandableIconButton variant="outline" className="bg-card border-border hover:bg-muted" icon={<Search className="h-4 w-4" />} label="Search" />
          </div>
        </div>

        {/* Table */}
        <StyledCard className="mx-6 mt-6 mb-6 overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted border-b border-border">
                  <th className="px-3 py-3 w-8"></th>
                  <th className="px-3 py-3 w-8"><Checkbox /></th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Acc No.</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap min-w-[180px]">Description</th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Original</th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Adj</th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Final</th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap">PY1</th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap">
                    Change (%) <ChevronDown className="inline h-3 w-3" />
                  </th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap">PY2</th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Map No.</th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap">LS</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Grouping</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Sub Grouping</th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap">CF Category</th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap">Tax Code</th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-foreground whitespace-nowrap">
                    FX Rate <span className="text-muted-foreground">⚙</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sectionOrder.map((sectionName) => {
                  const rows = groupedData[sectionName];
                  const isCollapsed = collapsedSections[sectionName];
                  return (
                    <React.Fragment key={sectionName}>
                      {/* Section header row */}
                      <tr
                        className="bg-muted/60 border-b border-border cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => toggleSection(sectionName)}
                      >
                        <td className="px-3 py-2 text-center">
                          {isCollapsed ? (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </td>
                        <td colSpan={16} className="px-3 py-2">
                          <span className="text-xs font-bold text-foreground uppercase tracking-wider">{sectionName}</span>
                          <span className="ml-2 text-xs text-muted-foreground">({rows.length})</span>
                        </td>
                      </tr>
                      {/* Section rows */}
                      {!isCollapsed && rows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                        >
                          <td className="px-3 py-2 text-center">
                            <button className="text-muted-foreground hover:text-foreground">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </td>
                          <td className="px-3 py-2"><Checkbox /></td>
                          <td className="px-3 py-2 text-foreground whitespace-nowrap">{row.accNo}</td>
                          <td className="px-3 py-2 text-foreground whitespace-nowrap">{row.description}</td>
                          <td className="px-3 py-2 text-right text-foreground whitespace-nowrap">{formatNumber(row.original)}</td>
                          <td className="px-3 py-2 text-right whitespace-nowrap">
                            <span className="text-link font-medium">{formatNumber(row.adj)}</span>
                          </td>
                          <td className="px-3 py-2 text-right text-foreground whitespace-nowrap">{formatNumber(row.final)}</td>
                          <td className="px-3 py-2 text-right text-foreground whitespace-nowrap">{formatNumber(row.py1)}</td>
                          <td className="px-3 py-2 text-right text-foreground whitespace-nowrap">{row.changePct}</td>
                          <td className="px-3 py-2 text-right text-foreground whitespace-nowrap">{row.py2}</td>
                          <td className="px-3 py-2 text-right whitespace-nowrap">
                            <span className="text-link font-medium">{formatNumber(row.mapNo)}</span>
                          </td>
                          <td className="px-3 py-2 text-center whitespace-nowrap">
                            <span className="text-link font-medium">{row.ls}</span>
                          </td>
                          <td className="px-3 py-2 text-foreground whitespace-nowrap">{row.grouping}</td>
                          <td className="px-3 py-2 text-foreground whitespace-nowrap">{row.subGrouping}</td>
                          <td className="px-3 py-2 text-center whitespace-nowrap">
                            <span className="text-link font-medium">{row.cfCategory}</span>
                          </td>
                          <td className="px-3 py-2 text-center whitespace-nowrap">
                            <span className="text-link font-medium">{row.taxCode}</span>
                          </td>
                          <td className="px-3 py-2 text-right text-foreground whitespace-nowrap">{row.fxRate.toFixed(2)}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot className="sticky bottom-0 z-10">
                {/* Totals row */}
                <tr className="bg-muted border-t border-border">
                  <td className="px-3 py-2" colSpan={4}></td>
                  <td className="px-3 py-2 text-right font-semibold text-foreground whitespace-nowrap">{formatNumber(totals.original)}</td>
                  <td className="px-3 py-2 text-right font-semibold text-foreground whitespace-nowrap">{formatNumber(totals.adj)}</td>
                  <td className="px-3 py-2 text-right font-semibold text-foreground whitespace-nowrap">{formatNumber(totals.final)}</td>
                  <td className="px-3 py-2 text-right font-semibold text-foreground whitespace-nowrap">{formatNumber(totals.py1)}</td>
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2 text-right font-semibold text-foreground whitespace-nowrap">{formatNumber(totals.py2)}</td>
                  <td colSpan={7}></td>
                </tr>

                {/* Net Income row */}
                <tr className="bg-muted border-t border-border">
                  <td className="px-3 py-2" colSpan={3}></td>
                  <td className="px-3 py-2 text-right font-bold text-foreground whitespace-nowrap">Net Income (loss)</td>
                  <td className="px-3 py-2 text-right font-bold text-foreground whitespace-nowrap">{formatNumber(netIncome.original)}</td>
                  <td className="px-3 py-2 text-right font-bold text-foreground whitespace-nowrap">{formatNumber(netIncome.adj)}</td>
                  <td className="px-3 py-2 text-right font-bold text-foreground whitespace-nowrap">{formatNumber(netIncome.final)}</td>
                  <td className="px-3 py-2 text-right font-bold text-foreground whitespace-nowrap">{formatNumber(netIncome.py1)}</td>
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2 text-right font-bold text-foreground whitespace-nowrap">{netIncome.py2}</td>
                  <td colSpan={7}></td>
                </tr>
              </tfoot>
            </table>
          </div>
         </StyledCard>
        </div>

        {/* Right Panel */}
        <EngagementRightPanel />
      </div>
    </Layout>
  );
}
