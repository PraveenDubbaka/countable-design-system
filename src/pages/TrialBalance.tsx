import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  MapPin,
  Wand2,
} from "lucide-react";

// Sample trial balance data matching screenshot
const trialBalanceData = [
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

const totals = { original: 0.00, adj: 0.00, final: 0.00, py1: 0.00, py2: 0.00 };
const netIncome = { original: 14.35, adj: 0.00, final: 14.35, py1: 149.22, py2: "(2,150.10)" };

const formatNumber = (val: number | string) => {
  if (typeof val === "string") return val;
  if (val === 0) return "0.00";
  if (val < 0) return `(${Math.abs(val).toFixed(2)})`;
  return val.toFixed(2);
};

export default function TrialBalance() {
  const navigate = useNavigate();
  const { engagementId } = useParams();
  const [dateFilter] = useState("Nov 27 2025");

  return (
    <Layout
      title=""
      showBackButton
      onBack={() => navigate(`/engagements/${engagementId || "eng-fst-001"}`)}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Top Breadcrumb and Actions Bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 flex-shrink-0">
          {/* Left: Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-primary cursor-pointer hover:underline" onClick={() => navigate(`/engagements/${engagementId || "eng-fst-001"}`)}>FST</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors">
                  COM-FST-Nov272025
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>COM-FST-Nov272025</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Badge variant="inProgress" className="text-[10px] px-2 py-0.5">In Progress</Badge>
            <div className="flex items-center gap-1 ml-1 px-2 py-1 rounded-md bg-[#e8f5e9]">
              <img src="https://upload.wikimedia.org/wikipedia/en/9/9f/Xero_software_logo.svg" alt="Xero" className="h-3.5" />
              <span className="text-[11px] font-medium text-[#1a7340]">Xero</span>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-medium">
              <Landmark className="h-3.5 w-3.5" />
              Connect Bank
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-medium">
              <FileText className="h-3.5 w-3.5" />
              Source Docs
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-medium">
              <Triangle className="h-3.5 w-3.5" />
              TB Check
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-medium">
              <PencilLine className="h-3.5 w-3.5" />
              Adj. Entries
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-medium">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Workbook
            </Button>
          </div>
        </div>

        {/* Title and Filter Bar */}
        <div className="flex items-center justify-between px-6 pb-3 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-primary">Trial Balance</h2>
          </div>
          <span className="text-xs text-muted-foreground">
            Last updated on: <span className="font-bold text-foreground">54 minutes ago</span>
          </span>
        </div>

        {/* Filters Row */}
        <div className="flex items-center justify-between px-6 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                  {dateFilter}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Nov 27 2025</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                  <span className="text-muted-foreground">≡</span> Filter by
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem>Assets</DropdownMenuItem>
                <DropdownMenuItem>Liabilities</DropdownMenuItem>
                <DropdownMenuItem>Equity</DropdownMenuItem>
                <DropdownMenuItem>Expenses</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Unmap
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Wand2 className="h-3.5 w-3.5" />
              Auto Map
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              Import
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              + $0 Bal. Acc.
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Search className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <StyledCard className="mx-6 mb-6 overflow-hidden flex flex-col flex-1 min-h-0">
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
                {trialBalanceData.map((row) => (
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
                      <span className="text-primary font-medium">{formatNumber(row.adj)}</span>
                    </td>
                    <td className="px-3 py-2 text-right text-foreground whitespace-nowrap">{formatNumber(row.final)}</td>
                    <td className="px-3 py-2 text-right text-foreground whitespace-nowrap">{formatNumber(row.py1)}</td>
                    <td className="px-3 py-2 text-right text-foreground whitespace-nowrap">{row.changePct}</td>
                    <td className="px-3 py-2 text-right text-foreground whitespace-nowrap">{row.py2}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      <span className="text-primary font-medium">{formatNumber(row.mapNo)}</span>
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      <span className="text-primary font-medium">{row.ls}</span>
                    </td>
                    <td className="px-3 py-2 text-foreground whitespace-nowrap">{row.grouping}</td>
                    <td className="px-3 py-2 text-foreground whitespace-nowrap">{row.subGrouping}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      <span className="text-primary font-medium">{row.cfCategory}</span>
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      <span className="text-primary font-medium">{row.taxCode}</span>
                    </td>
                    <td className="px-3 py-2 text-right text-foreground whitespace-nowrap">{row.fxRate.toFixed(2)}</td>
                  </tr>
                ))}

                {/* Totals row */}
                <tr className="border-b border-border bg-muted/20">
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
                <tr className="bg-muted/10">
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
              </tbody>
            </table>
          </div>
        </StyledCard>
      </div>
    </Layout>
  );
}
