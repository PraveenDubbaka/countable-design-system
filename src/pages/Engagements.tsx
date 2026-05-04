import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Search, ChevronDown, Pencil, Trash2, Download, Briefcase, Loader, CheckCircle2, Archive } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Layout } from "@/components/Layout";
import { StyledCard } from "@/components/ui/card";

// Sample stats data
const stats = [
  { label: "Engagements", value: "1764" },
  { label: "New/In Progress", value: "1519" },
  { label: "Completed", value: "168" },
  { label: "Archived", value: "77" },
];

// Sample engagements data matching the screenshot
const engagements = [
  { id: "AUD-SL-Mar312024", client: "Shipping Line Inc.", type: "Audit (AUD)", yearEnd: "Mar 31, 2024", team: "View Assignees", status: "In Progress", statusVariant: "inProgress" as const, hasRF: false, dateCreated: "Jan 21, 2026 10:00 AM" },
  { id: "COM-CON-Dec312024", client: "Shipping Line Inc.", type: "Compilation (COM)", yearEnd: "Dec 31, 2024", team: "View Assignees", status: "In Progress", statusVariant: "inProgress" as const, hasRF: false, dateCreated: "Jan 21, 2026 09:00 AM" },
  { id: "COM-PSP-Dec312023", client: "Source 40", type: "Compilation (COM)", yearEnd: "Dec 31, 2023", team: "View Assignees", status: "In Progress", statusVariant: "inProgress" as const, hasRF: false, dateCreated: "Dec 30, 2025 06:26 AM" },
  { id: "COM-QB-Dec312025", client: "qb 40.1", type: "Compilation (COM)", yearEnd: "Dec 31, 2025", team: "View Assignees", status: "In Progress", statusVariant: "inProgress" as const, hasRF: true, dateCreated: "Jan 16, 2026 01:15 PM" },
  { id: "COM-QB-Dec312024", client: "qb 40.1", type: "Compilation (COM)", yearEnd: "Dec 31, 2024", team: "View Assignees", status: "In Progress", statusVariant: "inProgress" as const, hasRF: false, dateCreated: "Jan 13, 2026 01:36 AM" },
  { id: "COM-CHE-Dec252024", client: "check add", type: "Compilation (COM)", yearEnd: "Dec 25, 2024", team: "View Assignees", status: "New", statusVariant: "new" as const, hasRF: false, dateCreated: "Jan 16, 2026 08:20 AM" },
  { id: "COM-OTH-Dec312024", client: "Other Revenue", type: "Compilation (COM)", yearEnd: "Dec 31, 2024", team: "View Assignees", status: "In Progress", statusVariant: "inProgress" as const, hasRF: false, dateCreated: "Jan 16, 2026 02:38 AM" },
  { id: "T2-AUT-Dec312023", client: "Shipping Line Inc.", type: "T2 (Corporations)", yearEnd: "Dec 31, 2023", team: "View Assignees", status: "In Progress", statusVariant: "inProgress" as const, hasRF: false, dateCreated: "Dec 30, 2025 08:48 AM" },
  { id: "COM-CAS-Dec312024", client: "cash flow ls", type: "Compilation (COM)", yearEnd: "Dec 31, 2024", team: "View Assignees", status: "In Progress", statusVariant: "inProgress" as const, hasRF: false, dateCreated: "Jan 13, 2026 09:21 AM" },
  { id: "COM-QB-Jan142026", client: "qb 40.1", type: "Compilation (COM)", yearEnd: "Jan 14, 2026", team: "View Assignees", status: "New", statusVariant: "new" as const, hasRF: false, dateCreated: "Jan 13, 2026 04:36 AM" },
  { id: "COM-SHR-Dec302023", client: "ShRoll Forward", type: "Compilation (COM)", yearEnd: "Dec 30, 2023", team: "View Assignees", status: "In Progress", statusVariant: "inProgress" as const, hasRF: true, dateCreated: "Jan 13, 2026 03:51 AM" },
];

const StatusBadge = ({ status, hasRF }: { status: string; hasRF: boolean }) => {
  const getStatusVariant = () => {
    switch (status) {
      case "New":
        return "new" as const;
      case "In Progress":
        return "inProgress" as const;
      default:
        return "notStarted" as const;
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <Badge variant={getStatusVariant()}>
        {status}
      </Badge>
      {hasRF && (
        <Badge variant="rf" className="px-1.5">
          RF
        </Badge>
      )}
    </div>
  );
};

const filterPeriodOptions = [
  "Last 6 Month Engagements",
  "Last 3 Month Engagements",
  "Last 12 Month Engagements",
  "All Engagements",
];

export default function Engagements() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("Last 6 Month Engagements");
  const [engagementList, setEngagementList] = useState(engagements);

  const filteredEngagements = engagementList.filter(e =>
    e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEngagementList(prev => prev.filter(eng => eng.id !== id));
    toast.success(`Engagement ${id} deleted`);
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/engagements/${id}`);
  };

  return (
    <Layout title="Engagements">
      <div className="flex-1 p-8 overflow-hidden flex flex-col bg-background">
        <div className="flex flex-col flex-1 gap-6 min-h-0">
          {/* Stats Cards */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {stats.map((stat, index) => {
              const config = [
                { color: 'text-primary', bg: 'bg-primary/10', icon: Briefcase, animation: '' },
                { color: 'text-primary', bg: 'bg-primary/10', icon: Loader, animation: '' },
                { color: 'text-primary', bg: 'bg-primary/10', icon: CheckCircle2, animation: '' },
                { color: 'text-primary', bg: 'bg-primary/10', icon: Archive, animation: '' },
              ];
              const { color, bg, icon: Icon, animation } = config[index];
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 px-5 py-3 flex-1 bg-card border border-border shadow-sm cursor-default hover:shadow-md transition-shadow"
                  style={{ borderRadius: '12px' }}
                >
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-4.5 w-4.5 ${color} ${animation}`} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xl font-bold leading-none ${color}`}>{stat.value}</span>
                    <span className="text-[13px] font-medium text-foreground leading-tight mt-0.5 whitespace-nowrap">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filter, Search, Export and Create Row - Enhanced spacing */}
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-4 text-sm font-medium bg-card border-border hover:bg-muted"
                >
                  {filterPeriod}
                  <ChevronDown className="ml-2 h-4 w-4 icon-chevron-down" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {filterPeriodOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setFilterPeriod(option)}
                    className={filterPeriod === option ? "font-medium text-primary" : ""}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground icon-search" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-44 h-9 text-sm"
                />
              </div>
              <Button
                variant="outline"
                className="h-9 px-4 text-sm font-medium bg-card border-border hover:bg-muted"
              >
                <Download className="mr-2 h-4 w-4 icon-download" />
                Export
              </Button>
              <Button 
                onClick={() => navigate("/engagements/create")}
                className="bg-primary hover:bg-primary/90 text-white h-9 px-4 text-sm font-medium"
              >
                Create Engagement
              </Button>
            </div>
          </div>

          {/* Engagements Table - Full width with enhanced spacing */}
          <StyledCard className="overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10 shadow-sm">
                  <tr className="bg-muted border-b border-border">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Engagement ID</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Client Name</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Type</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Period/Year End Date</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Assigned Team</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Date Created</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredEngagements.map((engagement) => (
                    <tr 
                      key={engagement.id} 
                      className="hover:bg-muted/50 transition-colors group max-h-[50px]"
                      style={{ maxHeight: '50px' }}
                    >
                      <td className="px-6 py-2 whitespace-nowrap">
                        <span 
                          onClick={() => navigate(`/engagements/${engagement.id}`)}
                          className="text-sm text-link font-medium cursor-pointer hover:underline"
                        >
                          {engagement.id}
                        </span>
                      </td>
                      <td className="px-6 py-2 text-sm text-foreground whitespace-nowrap truncate max-w-[200px]">{engagement.client}</td>
                      <td className="px-6 py-2 text-sm text-foreground whitespace-nowrap">{engagement.type}</td>
                      <td className="px-6 py-2 text-sm text-muted-foreground whitespace-nowrap">{engagement.yearEnd}</td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <span className="text-sm text-link cursor-pointer hover:underline">
                          {engagement.team}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <StatusBadge status={engagement.status} hasRF={engagement.hasRF} />
                      </td>
                      <td className="px-6 py-2 text-sm text-muted-foreground whitespace-nowrap">{engagement.dateCreated}</td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors group/edit"
                            onClick={(e) => handleEdit(engagement.id, e)}
                          >
                            <Pencil className="h-4 w-4 text-primary group-hover/edit:icon-edit" />
                          </button>
                          <button
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors group/trash"
                            onClick={(e) => handleDelete(engagement.id, e)}
                          >
                            <Trash2 className="h-4 w-4 text-primary group-hover/trash:icon-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </StyledCard>
        </div>
      </div>
    </Layout>
  );
}
