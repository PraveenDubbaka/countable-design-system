import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, FileText, MessageSquare, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Layout } from "@/components/Layout";
import { StyledCard } from "@/components/ui/card";
import intuitQuickbooksLogo from "@/assets/intuit-quickbooks-logo.svg";

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
  if (!type) return null;
  
  const badgeClasses = "inline-flex items-center justify-center h-8 w-40 px-3 rounded-full";
  
  if (type === "xero") {
    return <div className={`${badgeClasses} gap-1.5 bg-[#13B5EA]/10`}>
        <img src="https://upload.wikimedia.org/wikipedia/en/9/9f/Xero_software_logo.svg" alt="Xero" className="h-5" />
        <span className="text-xs font-medium text-black">Xero</span>
      </div>;
  }
  if (type === "quickbooks") {
    return <div className={`${badgeClasses} bg-[#2CA01C]/10`}>
        <img src={intuitQuickbooksLogo} alt="Intuit QuickBooks" className="h-5" />
      </div>;
  }
  if (type === "sage") {
    return <div className={`${badgeClasses} bg-[#00D639]/10`}>
        <svg className="h-5" viewBox="0 0 250 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M27.6269 0C43.2682 0 55.9863 10.8171 56.2793 25.8724C56.4258 30.1107 53.3561 32.4512 49.9935 32.4512C46.7773 32.4512 44.0006 30.1139 43.8542 26.1654C43.7077 17.6855 36.5462 11.3997 27.4805 11.3997C19.0006 11.3997 12.5716 17.3926 12.5716 25.5794C12.5716 34.4954 18.5645 38.444 30.9896 42.9753C44.2904 47.7995 56.4258 53.4993 56.4258 70.4557C56.4258 85.2213 44.8763 97.0605 28.7988 97.0605C13.0111 97.0605 0 85.9505 0 70.8952C0 61.5397 4.53125 54.9609 8.91602 54.9609C12.7181 54.9609 15.0553 57.4447 15.0553 60.8073C15.0553 63.7305 12.5716 65.0456 12.5716 70.3092C12.5716 79.6647 20.1725 85.6576 28.7988 85.6576C37.8613 85.6576 43.8542 79.3717 43.8542 71.7708C43.8542 62.4154 37.8613 58.4701 25.4362 54.082C11.5495 49.1178 0 43.1217 0 26.6048C0 11.696 11.9857 0 27.6269 0Z" fill="#00D639"/>
          <path d="M91.4225 97.0636C75.6348 97.0636 62.4805 84.3455 62.4805 68.2648C62.4805 51.6014 75.7813 39.1763 91.862 39.1763C109.111 39.1763 121.243 52.0409 121.243 69.5832V90.9243C121.243 94.5799 118.32 97.0636 114.958 97.0636C111.449 97.0636 108.525 94.5799 108.525 90.9243V70.0194C108.525 58.4699 101.947 50.576 91.569 50.576C82.36 50.576 75.0521 58.3234 75.0521 68.2648C75.0521 77.4738 82.2135 85.3677 91.2793 85.3677C94.6419 85.3677 96.1035 84.492 98.151 84.492C100.928 84.492 103.851 86.8293 103.851 90.1919C103.848 94.7231 98.4375 97.0636 91.4225 97.0636Z" fill="#00D639"/>
          <path d="M157.262 97.0605C140.889 97.0605 127.295 85.3644 127.295 70.1627C127.295 65.0456 130.218 62.7083 133.581 62.7083C136.943 62.7083 139.72 64.9024 139.867 69.1407C140.013 78.6426 147.614 85.6576 157.116 85.6576C167.204 85.6576 173.779 79.2253 173.779 70.8919C173.779 61.3899 166.471 57.4447 154.046 53.4961C139.574 48.8184 127.295 42.3862 127.295 24.5541C127.295 8.18042 139.867 -4.39104 156.237 -4.39104C172.754 -4.39104 186.351 7.5946 186.351 23.3823C186.351 33.0307 182.406 40.4852 176.995 40.4852C173.34 40.4852 170.856 37.855 170.856 34.6388C170.856 31.2762 173.779 29.8146 173.779 23.8218C173.779 13.7339 165.885 7.0119 156.383 7.0119C147.174 7.0119 139.867 14.0301 139.867 23.2391C139.867 33.6167 147.321 38.0047 159.6 42.0965C173.779 46.7742 186.351 52.6206 186.351 69.7237C186.351 85.0714 174.219 97.0605 157.262 97.0605Z" fill="#00D639"/>
          <path d="M222.227 97.0638C205.853 97.0638 192.406 84.1992 192.406 68.1218C192.406 52.041 205.417 39.1797 221.494 39.1797C237.722 39.1797 250 50.4362 250 64.7624C250 70.3158 246.055 73.6784 239.623 73.6784H222.813C219.45 73.6784 216.966 71.3411 216.966 68.2682C216.966 65.345 219.45 63.0046 222.813 63.0046H235.384C236.553 63.0046 237.432 62.4186 237.432 61.25C237.432 57.0117 232.022 50.4329 221.937 50.4329C212.582 50.4329 204.981 58.4733 204.981 68.1218C204.981 77.9167 212.728 85.6641 222.376 85.6641C233.487 85.6641 237.142 79.0853 241.673 79.0853C245.475 79.0853 247.52 81.569 247.52 84.349C247.52 86.9792 245.765 89.3197 241.38 92.0964C236.989 94.8698 230.414 97.0638 222.227 97.0638Z" fill="#00D639"/>
        </svg>
      </div>;
  }
  return null;
};
export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  return <Layout title="Dashboard">
      <div className="flex-1 p-6 overflow-auto" style={{
      backgroundColor: "#F5F8FA"
    }}>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-5">
          {/* Stats Cards - Clean card style */}
          <div className="grid grid-cols-5 gap-3">
            {stats.map((stat, index) => <StyledCard key={index} hover className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-black">{stat.label}</p>
                <p className="text-2xl font-bold text-primary mt-1">{stat.value}</p>
              </StyledCard>)}
          </div>

          {/* Engagements Table - Monday.com style */}
          <StyledCard className="overflow-hidden flex flex-col" style={{
            height: "calc(100vh - 220px)"
          }}>
            <div className="px-5 py-4 flex items-center justify-between flex-shrink-0 bg-white">
              <div>
                <h2 className="text-base font-semibold text-foreground">Engagements</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Active engagements from last 6 months</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground icon-search" />
                <Input placeholder="Search Engagement" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 w-56 h-9 text-sm" />
              </div>
            </div>

            {/* Monday.com style table with sticky header */}
            <div className="flex-1 overflow-y-auto overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr style={{ backgroundColor: "#f1f1f3" }}>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider">Engagement ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider">Client Name</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider">Year End</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider">Integrations</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {engagements.map((engagement, idx) => <tr key={engagement.id} className="hover:bg-[#F8FAFC] transition-colors group">
                      <td className="px-5 py-3">
                        <span className="text-sm text-primary font-medium cursor-pointer hover:underline" onClick={() => navigate(`/engagements/${engagement.id}`)}>
                          {engagement.id}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-foreground">{engagement.client}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{engagement.yearEnd}</td>
                      <td className="px-5 py-3">
                        <IntegrationBadge type={engagement.integration} />
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={engagement.status === "New" ? "new" : "inProgress"}>
                          {engagement.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-medium text-muted-foreground px-1.5 py-0.5 bg-gray-100 rounded">EL</span>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors group/file">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground group-hover/file:icon-bounce" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors group/msg">
                            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground group-hover/msg:icon-bounce" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors group/send">
                            <Send className="h-3.5 w-3.5 text-muted-foreground group-hover/send:icon-external" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors group/chev">
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover/chev:icon-chevron-down" />
                          </button>
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </StyledCard>
        </div>

        {/* Right Sidebar */}
        <div className="w-72 space-y-4">
          {/* Charts Row */}
          <div className="flex gap-3">
            {/* Team Members Chart */}
            <StyledCard className="flex-1 p-4">
              <h3 className="text-xs font-semibold text-foreground mb-2">Team Members</h3>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={teamData} cx="50%" cy="50%" innerRadius={20} outerRadius={38} dataKey="value" stroke="none">
                      {teamData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {teamData.map((item, index) => <div key={index} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{
                    backgroundColor: item.color
                  }} />
                    <span className="text-[10px] text-muted-foreground">{item.name}</span>
                  </div>)}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-2 h-8 text-xs text-primary hover:bg-primary/5 font-medium">
                View Team
              </Button>
            </StyledCard>

            {/* Clients Chart */}
            <StyledCard className="flex-1 p-4">
              <h3 className="text-xs font-semibold text-foreground mb-2">Clients</h3>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={clientsData} cx="50%" cy="50%" innerRadius={20} outerRadius={38} dataKey="value" stroke="none">
                      {clientsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {clientsData.map((item, index) => <div key={index} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                    backgroundColor: item.color
                  }} />
                    <span className="text-[10px] text-muted-foreground">{item.name}</span>
                  </div>)}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-2 h-8 text-xs text-primary hover:bg-primary/5 font-medium">
                View Clients
              </Button>
            </StyledCard>
          </div>

          {/* Recent Activity */}
          <StyledCard className="p-4">
            <h3 className="text-xs font-semibold text-foreground mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => <div key={index} className="relative pl-4">
                  <div className="absolute left-0 top-1 w-0.5 h-full bg-primary/20 rounded-full" />
                  <div className="absolute left-[-3px] top-1 w-2 h-2 rounded-full bg-primary" />
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-medium text-muted-foreground">{activity.time}</span>
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-foreground leading-tight">{activity.title}</p>
                  <p className="text-[10px] text-muted-foreground">{activity.description}</p>
                  <p className="text-[10px] text-muted-foreground/70 truncate">{activity.path}</p>
                </div>)}
            </div>
          </StyledCard>
        </div>
      </div>
      </div>
    </Layout>;
}