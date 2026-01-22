import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Pencil, Trash2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";

// Sample stats data
const stats = [
  { label: "Engagements", value: "1764" },
  { label: "New/In Progress", value: "1519" },
  { label: "Completed", value: "168" },
  { label: "Archived", value: "77" },
];

// Sample engagements data matching the screenshot
const engagements = [
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
  const getStatusStyles = () => {
    switch (status) {
      case "New":
        return "bg-emerald-50 text-emerald-700";
      case "In Progress":
        return "bg-sky-50 text-sky-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
        {status}
      </span>
      {hasRF && (
        <span className="inline-flex items-center px-1.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          RF
        </span>
      )}
    </div>
  );
};

export default function Engagements() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("Last 6 Month Engagements");

  return (
    <Layout title="Engagements">
      <div className="flex-1 p-6 overflow-hidden flex flex-col" style={{ backgroundColor: "#F5F8FA" }}>
        <div className="flex flex-col flex-1 gap-5 min-h-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filter, Search, Export and Create Row */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              className="h-9 px-4 text-sm font-medium bg-white border border-gray-200 hover:bg-gray-50"
            >
              {filterPeriod}
              <ChevronDown className="ml-2 h-4 w-4 icon-chevron-down" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground icon-search" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-56 h-9 text-sm bg-white border border-gray-200 focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <Button
                variant="outline"
                className="h-9 px-4 text-sm font-medium bg-white border border-gray-200 hover:bg-gray-50"
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

          {/* Engagements Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10 shadow-sm">
                  <tr style={{ backgroundColor: "#EDF2F7" }}>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Engagement ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client Name</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Period/Year End Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned Team</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date Created</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {engagements.map((engagement) => (
                    <tr 
                      key={engagement.id} 
                      className="hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <td className="px-5 py-3">
                        <span className="text-sm text-primary font-medium cursor-pointer hover:underline">
                          {engagement.id}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-foreground">{engagement.client}</td>
                      <td className="px-5 py-3 text-sm text-foreground">{engagement.type}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{engagement.yearEnd}</td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-primary cursor-pointer hover:underline">
                          {engagement.team}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={engagement.status} hasRF={engagement.hasRF} />
                      </td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{engagement.dateCreated}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors group/edit">
                            <Pencil className="h-4 w-4 text-muted-foreground group-hover/edit:icon-edit" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors group/trash">
                            <Trash2 className="h-4 w-4 text-muted-foreground group-hover/trash:icon-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
