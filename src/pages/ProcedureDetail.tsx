import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { EngagementRightPanel } from "@/components/EngagementRightPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  Settings2,
  Building2,
  FileText,
  Calendar,
  Check,
  Landmark,
  PencilLine,
  FileSpreadsheet,
  ClipboardCopy,
  FileBarChart,
  MessageSquare,
  Bookmark,
  Send,
} from "lucide-react";
import intuitLogo from "@/assets/intuit-quickbooks-logo.svg";

// Engagement data for breadcrumb (shared)
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

// Procedure metadata
const procedureData: Record<string, {
  breadcrumb: string[];
  title: string;
  code: string;
  accounts: {
    id: string;
    accNo: string;
    description: string;
    original: number;
    adj: number;
    final: number;
    py1: number;
    changePct: string;
    ref: string;
    ticks: string;
  }[];
}> = {
  "pr-ca-a": {
    breadcrumb: ["Assets", "A"],
    title: "Cash and cash equivalents",
    code: "A",
    accounts: [
      { id: "1", accNo: "", description: "Savings", original: 800.00, adj: 0.00, final: 800.00, py1: 800.00, changePct: "0.00%", ref: "-", ticks: "-" },
      { id: "2", accNo: "", description: "Undeposited Funds", original: 2062.52, adj: 0.00, final: 2062.52, py1: 2062.52, changePct: "0.00%", ref: "-", ticks: "-" },
    ],
  },
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


const formatNumber = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ProcedureDetail() {
  const { engagementId, procedureId } = useParams<{ engagementId: string; procedureId: string }>();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");

  const engagement = engagementId ? engagementsData[engagementId] : null;
  const clientName = engagement?.client || "Unknown Client";
  const displayId = engagementId || "Unknown";
  const status = engagement?.status || "In Progress";

  const uniqueClients = getUniqueClients();
  const clientEngagements = getEngagementsForClient(clientName);

  const procedure = procedureId ? procedureData[procedureId] : null;
  const accounts = procedure?.accounts || [];

  // Compute totals
  const totals = accounts.reduce(
    (acc, row) => ({
      original: acc.original + row.original,
      adj: acc.adj + row.adj,
      final: acc.final + row.final,
      py1: acc.py1 + row.py1,
    }),
    { original: 0, adj: 0, final: 0, py1: 0 }
  );

  const breadcrumbParts = procedure?.breadcrumb || [];
  const title = procedure?.title || "Procedure";

  const procedureBreadcrumb = (
    <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
      {/* Client Name (read-only) */}
      <div className="flex items-center gap-1.5 px-2 py-1">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          <Building2 className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-sm font-medium text-foreground">{clientName}</span>
      </div>

      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />

      {/* Engagement Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group flex items-center gap-1.5 px-2 py-1 rounded-md border border-border hover:bg-primary/5 transition-colors">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
              <FileText className="h-3.5 w-3.5 text-secondary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors font-mono">{displayId}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72 bg-card border shadow-lg z-50">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Engagements for {clientName}</div>
          <DropdownMenuSeparator />
          {clientEngagements.map(eng => (
            <DropdownMenuItem key={eng.id} onClick={() => navigate(`/engagements/${eng.id}`)} className="flex items-center gap-3 cursor-pointer group py-2">
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-mono text-sm font-medium truncate">{eng.id}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{eng.yearEnd}</span>
                </div>
              </div>
              {eng.id === displayId && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Badge */}
      <Badge variant={status === "Completed" ? "completed" : status === "Not Started" ? "notStarted" : "inProgress"} className="ml-2 whitespace-nowrap">
        {status}
      </Badge>

      {/* QuickBooks Logo */}
      <img src={intuitLogo} alt="Intuit QuickBooks" className="h-6 ml-2" />
    </div>
  );

  return (
    <Layout title="Engagements" headerContent={procedureBreadcrumb}>
      <div className="flex h-full overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Top Header Bar - tools only */}
          <div className="flex items-center justify-end px-4 py-1.5 border-b border-border bg-gradient-to-r from-card via-card to-secondary/20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium">
                  <Settings2 className="h-3.5 w-3.5 mr-1.5" />
                  Tools
                  <ChevronDown className="h-3 w-3 ml-1.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border shadow-lg z-50">
                {headerActions.map(action => (
                  <DropdownMenuItem key={action.id} className="flex items-center gap-2 cursor-pointer group">
                    <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span>{action.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto bg-card">
            <div className="mx-6 mt-6 mb-6">
              {/* Breadcrumb row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {breadcrumbParts.map((part, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <span>{part}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </span>
                  ))}
                  <span>{title}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Last updated on: <span className="font-semibold text-foreground">1 week ago</span>
                </span>
              </div>

              {/* Accounts Table */}
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                {/* Table Header */}
                <div className="grid grid-cols-[40px_100px_1fr_110px_80px_110px_110px_90px_60px_80px_160px] bg-muted border-b border-border text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center justify-center py-2.5">
                    <Checkbox className="h-4 w-4" />
                  </div>
                  <div className="py-2.5 px-2">Acc No.</div>
                  <div className="py-2.5 px-2">Description</div>
                  <div className="py-2.5 px-2 text-right">Original</div>
                  <div className="py-2.5 px-2 text-right font-bold text-foreground">Adj</div>
                  <div className="py-2.5 px-2 text-right font-bold text-foreground">Final</div>
                  <div className="py-2.5 px-2 text-right">PY1</div>
                  <div className="py-2.5 px-2 text-right flex items-center justify-end gap-1">
                    Change(%)
                    <ChevronDown className="h-3 w-3" />
                  </div>
                  <div className="py-2.5 px-2 text-center">Ref</div>
                  <div className="py-2.5 px-2 text-center">Ticks</div>
                  <div className="py-2.5 px-2 text-center">Actions</div>
                </div>

                {/* Table Body */}
                {accounts.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[40px_100px_1fr_110px_80px_110px_110px_90px_60px_80px_160px] border-b border-border hover:bg-muted/30 transition-colors text-sm"
                  >
                    <div className="flex items-center justify-center py-2.5">
                      <Checkbox className="h-4 w-4" />
                    </div>
                    <div className="py-2.5 px-2 text-foreground">{row.accNo}</div>
                    <div className="py-2.5 px-2 text-foreground">{row.description}</div>
                    <div className="py-2.5 px-2 text-right text-foreground">{formatNumber(row.original)}</div>
                    <div className="py-2.5 px-2 text-right font-bold text-foreground">{formatNumber(row.adj)}</div>
                    <div className="py-2.5 px-2 text-right font-bold text-foreground">{formatNumber(row.final)}</div>
                    <div className="py-2.5 px-2 text-right text-foreground">{formatNumber(row.py1)}</div>
                    <div className="py-2.5 px-2 text-right text-foreground">{row.changePct}</div>
                    <div className="py-2.5 px-2 text-center text-muted-foreground">{row.ref}</div>
                    <div className="py-2.5 px-2 text-center flex items-center justify-center gap-1">
                      <span className="text-muted-foreground">{row.ticks}</span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="py-2.5 px-2 flex items-center justify-center gap-1">
                      <button className="p-1 hover:bg-muted rounded text-primary" title="Add to workbook">
                        <ClipboardCopy className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded text-primary" title="View report">
                        <FileBarChart className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded text-primary" title="Comment">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded text-primary" title="Bookmark">
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded text-primary" title="Send">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Total Row */}
                <div className="grid grid-cols-[40px_100px_1fr_110px_80px_110px_110px_90px_60px_80px_160px] bg-muted/50 text-sm font-bold">
                  <div className="py-2.5" />
                  <div className="py-2.5" />
                  <div className="py-2.5 px-2 text-foreground">Total</div>
                  <div className="py-2.5 px-2 text-right text-foreground">{formatNumber(totals.original)}</div>
                  <div className="py-2.5 px-2 text-right text-foreground">{formatNumber(totals.adj)}</div>
                  <div className="py-2.5 px-2 text-right text-foreground">{formatNumber(totals.final)}</div>
                  <div className="py-2.5 px-2 text-right text-foreground">{formatNumber(totals.py1)}</div>
                  <div className="py-2.5 px-2" />
                  <div className="py-2.5 px-2" />
                  <div className="py-2.5 px-2" />
                  <div className="py-2.5 px-2" />
                </div>
              </div>

              {/* General Notes Section */}
              <div className="mt-6 border border-border rounded-lg overflow-hidden bg-card">
                <div className="px-4 py-3 border-b border-border bg-muted/30">
                  <h3 className="text-sm font-bold text-foreground">General Notes</h3>
                </div>
                <div className="p-4">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Comment"
                    className="min-h-[100px] resize-none border-border bg-background"
                  />
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => setComment("")}>
                      Cancel
                    </Button>
                    <Button size="sm">
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <EngagementRightPanel />
      </div>
    </Layout>
  );
}
