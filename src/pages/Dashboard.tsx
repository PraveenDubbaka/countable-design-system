import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, MessageSquare, Send, AlertCircle, Layers, Sparkles, Loader, CheckCircle2, Archive } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Layout } from "@/components/Layout";
import { StyledCard } from "@/components/ui/card";
import intuitQuickbooksLogo from "@/assets/intuit-quickbooks-logo.svg";
import sageLogo from "@/assets/sage-logo.svg";

// Sample data for stats
const stats = [{
  label: "Total Engagements",
  value: "1764"
}, {
  label: "New Engagements",
  value: "482"
}, {
  label: "In Progress",
  value: "1037"
}, {
  label: "Completed",
  value: "168"
}, {
  label: "Archived",
  value: "77"
}];

// Sample engagements data
const engagements = [{
  id: "COM-CON-Dec312024",
  client: "Shipping Line Inc.",
  yearEnd: "Dec 31, 2024",
  integration: "sage",
  status: "In Progress",
  statusVariant: "default" as const
}, {
  id: "COM-PSP-Dec312023",
  client: "Source 40",
  yearEnd: "Dec 31, 2023",
  integration: "xero",
  status: "In Progress",
  statusVariant: "default" as const
}, {
  id: "COM-QB-Dec312025",
  client: "Qb 40.1",
  yearEnd: "Dec 31, 2025",
  integration: "quickbooks",
  status: "In Progress",
  statusVariant: "default" as const
}, {
  id: "COM-QB-Dec312024",
  client: "Qb 40.1",
  yearEnd: "Dec 31, 2024",
  integration: "quickbooks",
  status: "In Progress",
  statusVariant: "default" as const
}, {
  id: "COM-CHE-Dec252024",
  client: "Check Add",
  yearEnd: "Dec 25, 2024",
  integration: "xero",
  status: "New",
  statusVariant: "secondary" as const
}, {
  id: "COM-OTH-Dec312024",
  client: "Other Revenue",
  yearEnd: "Dec 31, 2024",
  integration: null,
  status: "In Progress",
  statusVariant: "default" as const
}, {
  id: "T2-AUT-Dec312023",
  client: "Shipping Line Inc.",
  yearEnd: "Dec 31, 2023",
  integration: null,
  status: "In Progress",
  statusVariant: "default" as const
}, {
  id: "COM-CAS-Dec312024",
  client: "Cash Flow Ls",
  yearEnd: "Dec 31, 2024",
  integration: null,
  status: "In Progress",
  statusVariant: "default" as const
}, {
  id: "COM-QB-Jan142026",
  client: "Qb 40.1",
  yearEnd: "Jan 14, 2026",
  integration: "quickbooks",
  status: "New",
  statusVariant: "secondary" as const
}, {
  id: "COM-SHR-Dec302023",
  client: "Shroll Forward",
  yearEnd: "Dec 30, 2023",
  integration: "xero",
  status: "In Progress",
  statusVariant: "default" as const
}];

// Team members pie chart data
const teamData = [{
  name: "Invite Sent",
  value: 25,
  color: "#F97316"
}, {
  name: "Invite Now",
  value: 40,
  color: "#0EA5E9"
}, {
  name: "Accepted",
  value: 49,
  color: "#22C55E"
}];

// Clients pie chart data
const clientsData = [{
  name: "Invite Sent",
  value: 84,
  color: "#F97316"
}, {
  name: "Invite Now",
  value: 41,
  color: "#0EA5E9"
}, {
  name: "Accepted",
  value: 268,
  color: "#22C55E"
}];

// Recent activity data
const recentActivity = [{
  time: "09:00 AM",
  title: "COM-CON-Dec312024",
  description: "Created an Engagement",
  path: "Engagement > Created an Engagement"
}, {
  time: "05:35 AM",
  title: "FIN-1-Trial Balance.pdf",
  description: "Viewed and Edited",
  path: "Engagement > COM-PSP-Dec312023 > Financial Statements > Financial Statements Docs"
}];
const IntegrationBadge = ({
  type
}: {
  type: string | null;
}) => {
  const [showPopover, setShowPopover] = React.useState(false);
  if (!type) return null;
  const badgeClasses = "inline-flex items-center justify-center h-8 w-24 px-1 rounded-lg cursor-pointer hover:opacity-80 transition-opacity bg-card border border-border";
  const getIntegrationName = () => {
    switch (type) {
      case "xero":
        return "Xero";
      case "quickbooks":
        return "QuickBooks";
      case "sage":
        return "Sage";
      default:
        return type;
    }
  };
  const BadgeContent = () => {
    if (type === "xero") {
      return <div className={`${badgeClasses} gap-1.5`}>
          <img src="https://upload.wikimedia.org/wikipedia/en/9/9f/Xero_software_logo.svg" alt="Xero" className="h-5" />
          <span className="text-xs font-medium text-foreground">Xero</span>
        </div>;
    }
    if (type === "quickbooks") {
      return <div className={badgeClasses}>
          <img src={intuitQuickbooksLogo} alt="Intuit QuickBooks" className="h-5" />
        </div>;
    }
    if (type === "sage") {
      return <div className={`${badgeClasses} gap-1.5`}>
          <div className="h-5 w-5 rounded-full bg-black flex items-center justify-center p-1">
            <img src={sageLogo} alt="Sage" className="h-3 w-auto" />
          </div>
          <span className="text-xs font-medium text-foreground">Sage</span>
        </div>;
    }
    return null;
  };
  return <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <div onClick={e => e.stopPropagation()}>
          <BadgeContent />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium">Connected</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {getIntegrationName()} integration is active and syncing data.
          </p>
          <div className="text-xs text-muted-foreground">
            Last synced: 2 hours ago
          </div>
          <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={e => {
          e.stopPropagation();
          setShowPopover(false);
        }}>
            Disconnect
          </Button>
        </div>
      </PopoverContent>
    </Popover>;
};
export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  return <Layout title="Dashboard">
      <div className="flex-1 p-8 overflow-auto bg-background h-full">

      <div className="flex gap-8 h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6 min-h-0">
          {/* Stats Bar - Creative compact display with micro-animated icons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {stats.map((stat, index) => {
              const config = [
                { color: 'text-primary', bg: 'bg-primary/10', icon: Layers, animation: '' },
                { color: 'text-primary', bg: 'bg-primary/10', icon: Sparkles, animation: '' },
                { color: 'text-primary', bg: 'bg-primary/10', icon: Loader, animation: '' },
                { color: 'text-primary', bg: 'bg-primary/10', icon: CheckCircle2, animation: '' },
                { color: 'text-primary', bg: 'bg-primary/10', icon: Archive, animation: '' },
              ];
              const { color, bg, icon: Icon, animation } = config[index];
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-5 py-3 flex-1 bg-card border border-border shadow-sm cursor-default hover:shadow-md transition-shadow`}
                  style={{ borderRadius: '12px' }}
                >
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-4.5 w-4.5 ${color} ${animation}`} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xl font-bold leading-none ${color}`}>{stat.value}</span>
                    <span className="text-[11px] font-medium text-foreground/60 leading-tight mt-0.5 whitespace-nowrap">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Engagements Table - Enhanced styling */}
          <StyledCard className="overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="px-6 py-5 flex items-center justify-between flex-shrink-0 bg-card">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Engagements</h2>
                <p className="text-sm text-muted-foreground mt-1">Active engagements from last 6 months</p>
              </div>
              <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground icon-search" />
                <Input placeholder="Search Engagement" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 w-48 h-9 text-sm" />
              </div>
            </div>

            {/* Enhanced table with better spacing */}
            <div className="flex-1 overflow-y-auto overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Engagement ID</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Client Name</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Year End</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Integrations</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {engagements.map((engagement, idx) => <tr key={engagement.id} className="hover:bg-muted/50 transition-colors group max-h-[50px]" style={{ maxHeight: '50px' }}>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <span className="text-sm text-primary font-medium cursor-pointer hover:underline" onClick={() => navigate(`/engagements/${engagement.id}`)}>
                          {engagement.id}
                        </span>
                      </td>
                      <td className="px-6 py-2 text-sm text-foreground whitespace-nowrap truncate max-w-[200px]">{engagement.client}</td>
                      <td className="px-6 py-2 text-sm text-muted-foreground whitespace-nowrap">{engagement.yearEnd}</td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <IntegrationBadge type={engagement.integration} />
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <Badge variant={engagement.status === "New" ? "new" : "inProgress"}>
                          {engagement.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded-lg">EL</span>
                          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors group/file">
                            <AlertCircle className="h-4 w-4 text-primary group-hover/file:icon-bounce" />
                          </button>
                          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors group/msg">
                            <MessageSquare className="h-4 w-4 text-primary group-hover/msg:icon-bounce" />
                          </button>
                          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors group/send">
                            <Send className="h-4 w-4 text-primary group-hover/send:icon-external" />
                          </button>
                          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors group/chev">
                            <ChevronDown className="h-4 w-4 text-primary group-hover/chev:icon-chevron-down" />
                          </button>
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </StyledCard>
        </div>

        {/* Right Sidebar - Enhanced spacing */}
        <div className="w-80 space-y-5">
          {/* Charts Row */}
          <div className="flex gap-4">
            {/* Team Members Chart */}
            <StyledCard className="flex-1 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Team Members</h3>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={teamData} cx="50%" cy="50%" innerRadius={22} outerRadius={42} dataKey="value" stroke="none">
                      {teamData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {teamData.map((item, index) => <div key={index} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{
                    backgroundColor: item.color
                  }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>)}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-3 h-9 text-sm text-primary hover:bg-primary/5 font-medium rounded-xl">
                View Team
              </Button>
            </StyledCard>

            {/* Clients Chart */}
            <StyledCard className="flex-1 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Clients</h3>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={clientsData} cx="50%" cy="50%" innerRadius={22} outerRadius={42} dataKey="value" stroke="none">
                      {clientsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {clientsData.map((item, index) => <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                    backgroundColor: item.color
                  }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>)}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-3 h-9 text-sm text-primary hover:bg-primary/5 font-medium rounded-xl">
                View Clients
              </Button>
            </StyledCard>
          </div>

          {/* Recent Activity - Enhanced spacing */}
          <StyledCard className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => <div key={index} className="relative pl-5">
                  <div className="absolute left-0 top-1 w-0.5 h-full bg-primary/20 rounded-full" />
                  <div className="absolute left-[-3px] top-1 w-2 h-2 rounded-full bg-primary" />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">{activity.time}</span>
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground leading-tight">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                  <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{activity.path}</p>
                </div>)}
            </div>
          </StyledCard>
        </div>
      </div>
      </div>
    </Layout>;
}