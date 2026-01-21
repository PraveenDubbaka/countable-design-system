import { useState } from "react";
import { Search, ChevronDown, FileText, MessageSquare, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <div className="flex-1 p-6 overflow-auto bg-background">
      {/* Header */}
      <h1 className="text-2xl font-bold text-primary mb-6">Dashboard</h1>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-4"
              >
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Engagements Table */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 flex items-center justify-between border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Engagements</h2>
                <p className="text-sm text-muted-foreground">Active engagements from last 6 months</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Engagement"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Engagement ID</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Year End</TableHead>
                  <TableHead>Integrations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {engagements.map((engagement) => (
                  <TableRow key={engagement.id}>
                    <TableCell className="text-primary font-medium cursor-pointer hover:underline">
                      {engagement.id}
                    </TableCell>
                    <TableCell>{engagement.client}</TableCell>
                    <TableCell>{engagement.yearEnd}</TableCell>
                    <TableCell>
                      <IntegrationBadge type={engagement.integration} />
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={engagement.status === "New" ? "secondary" : "outline"}
                        className={engagement.status === "New" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-blue-100 text-blue-700 hover:bg-blue-100"}
                      >
                        {engagement.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-xs font-medium">EL</span>
                        <FileText className="h-4 w-4 cursor-pointer hover:text-foreground" />
                        <MessageSquare className="h-4 w-4 cursor-pointer hover:text-foreground" />
                        <Send className="h-4 w-4 cursor-pointer hover:text-foreground" />
                        <ChevronDown className="h-4 w-4 cursor-pointer hover:text-foreground" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-6">
          {/* Charts Row */}
          <div className="flex gap-4">
            {/* Team Members Chart */}
            <div className="flex-1 bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Team Members</h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={teamData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={45}
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
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                {teamData.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3 text-primary border-primary">
                View Team
              </Button>
            </div>

            {/* Clients Chart */}
            <div className="flex-1 bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Clients</h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clientsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={45}
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
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                {clientsData.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3 text-primary border-primary">
                View Clients
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="border-l-2 border-primary pl-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-foreground">{activity.time}</span>
                    <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.path}</p>
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
