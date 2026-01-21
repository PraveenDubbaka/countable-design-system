import { useState } from "react";
import { Search, ChevronDown, FileText, MessageSquare, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Layout } from "@/components/Layout";

// Sample data for stats
const stats = [
  { label: "Total Engagements", value: "1764" },
  { label: "New Engagements", value: "482" },
  { label: "In Progress", value: "1037" },
  { label: "Completed", value: "168" },
  { label: "Archived", value: "77" },
];

// Sample engagements data
const engagements = [
  { id: "COM-CON-Dec312024", client: "Shipping Line Inc.", yearEnd: "Dec 31, 2024", integration: null, status: "In Progress", statusVariant: "default" as const },
  { id: "COM-PSP-Dec312023", client: "Source 40", yearEnd: "Dec 31, 2023", integration: "xero", status: "In Progress", statusVariant: "default" as const },
  { id: "COM-QB-Dec312025", client: "Qb 40.1", yearEnd: "Dec 31, 2025", integration: "quickbooks", status: "In Progress", statusVariant: "default" as const },
  { id: "COM-QB-Dec312024", client: "Qb 40.1", yearEnd: "Dec 31, 2024", integration: "quickbooks", status: "In Progress", statusVariant: "default" as const },
  { id: "COM-CHE-Dec252024", client: "Check Add", yearEnd: "Dec 25, 2024", integration: "xero", status: "New", statusVariant: "secondary" as const },
  { id: "COM-OTH-Dec312024", client: "Other Revenue", yearEnd: "Dec 31, 2024", integration: null, status: "In Progress", statusVariant: "default" as const },
  { id: "T2-AUT-Dec312023", client: "Shipping Line Inc.", yearEnd: "Dec 31, 2023", integration: null, status: "In Progress", statusVariant: "default" as const },
  { id: "COM-CAS-Dec312024", client: "Cash Flow Ls", yearEnd: "Dec 31, 2024", integration: null, status: "In Progress", statusVariant: "default" as const },
  { id: "COM-QB-Jan142026", client: "Qb 40.1", yearEnd: "Jan 14, 2026", integration: "quickbooks", status: "New", statusVariant: "secondary" as const },
  { id: "COM-SHR-Dec302023", client: "Shroll Forward", yearEnd: "Dec 30, 2023", integration: "xero", status: "In Progress", statusVariant: "default" as const },
];

// Team members pie chart data
const teamData = [
  { name: "Invite Sent", value: 25, color: "#F97316" },
  { name: "Invite Now", value: 40, color: "#0EA5E9" },
  { name: "Accepted", value: 49, color: "#22C55E" },
];

// Clients pie chart data
const clientsData = [
  { name: "Invite Sent", value: 84, color: "#F97316" },
  { name: "Invite Now", value: 41, color: "#0EA5E9" },
  { name: "Accepted", value: 268, color: "#22C55E" },
];

// Recent activity data
const recentActivity = [
  {
    time: "09:00 AM",
    title: "COM-CON-Dec312024",
    description: "Created an Engagement",
    path: "Engagement > Created an Engagement",
  },
  {
    time: "05:35 AM",
    title: "FIN-1-Trial Balance.pdf",
    description: "Viewed and Edited",
    path: "Engagement > COM-PSP-Dec312023 > Financial Statements > Financial Statements Docs",
  },
];

const IntegrationBadge = ({ type }: { type: string | null }) => {
  if (!type) return null;
  
  if (type === "xero") {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#13B5EA] text-white text-xs font-medium">
        <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
          <span className="text-[#13B5EA] text-[8px] font-bold">X</span>
        </div>
        Xero
      </div>
    );
  }
  
  if (type === "quickbooks") {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2CA01C] text-white text-xs font-medium">
        <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
          <span className="text-[#2CA01C] text-[8px] font-bold">QB</span>
        </div>
        QuickBooks
      </div>
    );
  }
  
  return null;
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout title="Dashboard">
      <div className="flex-1 p-6 overflow-auto" style={{ backgroundColor: "#F5F8FA" }}>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-5">
          {/* Stats Cards - Clean card style */}
          <div className="grid grid-cols-5 gap-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-primary mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Engagements Table - Monday.com style */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: "#FAFBFC" }}>
              <div>
                <h2 className="text-base font-semibold text-foreground">Engagements</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Active engagements from last 6 months</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Engagement"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-56 h-9 text-sm bg-white border-0 shadow-sm focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Monday.com style table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "#F5F8FA" }}>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Engagement ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client Name</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Year End</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Integrations</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {engagements.map((engagement, idx) => (
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
                      <td className="px-5 py-3 text-sm text-muted-foreground">{engagement.yearEnd}</td>
                      <td className="px-5 py-3">
                        <IntegrationBadge type={engagement.integration} />
                      </td>
                      <td className="px-5 py-3">
                        <span 
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            engagement.status === "New" 
                              ? "bg-emerald-50 text-emerald-700" 
                              : "bg-sky-50 text-sky-700"
                          }`}
                        >
                          {engagement.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-medium text-muted-foreground px-1.5 py-0.5 bg-gray-100 rounded">EL</span>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <Send className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
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

        {/* Right Sidebar */}
        <div className="w-72 space-y-4">
          {/* Charts Row */}
          <div className="flex gap-3">
            {/* Team Members Chart */}
            <div className="flex-1 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-xs font-semibold text-foreground mb-2">Team Members</h3>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={teamData}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={38}
                      dataKey="value"
                      stroke="none"
                    >
                      {teamData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {teamData.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2 h-8 text-xs text-primary hover:bg-primary/5 font-medium"
              >
                View Team
              </Button>
            </div>

            {/* Clients Chart */}
            <div className="flex-1 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-xs font-semibold text-foreground mb-2">Clients</h3>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clientsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={38}
                      dataKey="value"
                      stroke="none"
                    >
                      {clientsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {clientsData.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2 h-8 text-xs text-primary hover:bg-primary/5 font-medium"
              >
                View Clients
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-foreground mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="relative pl-4">
                  <div className="absolute left-0 top-1 w-0.5 h-full bg-primary/20 rounded-full" />
                  <div className="absolute left-[-3px] top-1 w-2 h-2 rounded-full bg-primary" />
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-medium text-muted-foreground">{activity.time}</span>
                    <div className="w-3 h-3 rounded-full bg-emerald-100 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 text-emerald-600">✓</div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-foreground leading-tight">{activity.title}</p>
                  <p className="text-[10px] text-muted-foreground">{activity.description}</p>
                  <p className="text-[10px] text-muted-foreground/70 truncate">{activity.path}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}
