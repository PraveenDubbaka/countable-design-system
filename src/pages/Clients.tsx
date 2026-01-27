import { useState } from "react";
import { Search, ChevronDown, Pencil, Trash2, Download, Mail, ClipboardPlus, UserPlus, RefreshCw, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Layout } from "@/components/Layout";
import { StyledCard } from "@/components/ui/card";
import { ClientRightPanel } from "@/components/ClientRightPanel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import intuitQuickbooksLogo from "@/assets/intuit-quickbooks-logo.svg";

// Sample stats data
const stats = [
  { label: "Active Clients", value: "29" },
  { label: "Pending Clients", value: "92" },
  { label: "Total Clients", value: "121" },
];

// Sample clients data matching the screenshot
const clients = [
  { 
    id: "CR001", 
    entityName: "CR tickets", 
    entityType: "Corporation", 
    status: "Accepted", 
    statusVariant: "accepted" as const,
    integration: "xero",
    contactName: "Cr Tickets",
    email: "crtick@yopmail.com",
    repository: "Repository",
    assignedPartner: "Cpt",
    assignedTeam: null,
    cellPhone: null,
    engagements: 4
  },
  { 
    id: "CR002", 
    entityName: "CSV client 41", 
    entityType: "Corporation", 
    status: "Invite Now", 
    statusVariant: "inviteNow" as const,
    integration: "connect",
    contactName: "Automation...",
    email: "csvclient41@yopm...",
    repository: "Repository",
    assignedPartner: "Cpt",
    assignedTeam: null,
    cellPhone: null,
    engagements: 2
  },
  { 
    id: "CR003", 
    entityName: "Source 41", 
    entityType: "Corporation", 
    status: "Invite Now", 
    statusVariant: "inviteNow" as const,
    integration: "xero",
    contactName: "Automation...",
    email: "source41@yopmail...",
    repository: "Repository",
    assignedPartner: "Cpt",
    assignedTeam: null,
    cellPhone: null,
    engagements: 4
  },
  { 
    id: "CR004", 
    entityName: "Xero Vizhen", 
    entityType: "Corporation", 
    status: "Invite Now", 
    statusVariant: "inviteNow" as const,
    integration: "xero",
    contactName: "Xero Vizhen",
    email: "xerov@yopmail.com",
    repository: "Repository",
    assignedPartner: "Cpt",
    assignedTeam: null,
    cellPhone: null,
    engagements: 7
  },
  { 
    id: "CR005", 
    entityName: "FST", 
    entityType: "Corporation", 
    status: "Accepted", 
    statusVariant: "accepted" as const,
    integration: "xero",
    contactName: "Fs Temps",
    email: "fst@yopmail.com",
    repository: "Repository",
    assignedPartner: "Cpt",
    assignedTeam: null,
    cellPhone: null,
    engagements: 21
  },
  { 
    id: "CR006", 
    entityName: "Consolidated Shipping...", 
    entityType: "Corporation", 
    status: "Invite Now", 
    statusVariant: "inviteNow" as const,
    integration: "connect",
    contactName: "Test Toc",
    email: "toc@yopmail.com",
    repository: "Repository",
    assignedPartner: "Cpt",
    assignedTeam: null,
    cellPhone: null,
    engagements: 1
  },
  { 
    id: "CR007", 
    entityName: "uat 41 test", 
    entityType: "Corporation", 
    status: "Accepted", 
    statusVariant: "accepted" as const,
    integration: "quickbooks",
    contactName: "Uat Test",
    email: "uat41test@yopmail...",
    repository: "Repository",
    assignedPartner: "Cpt",
    assignedTeam: "Norbert",
    cellPhone: "(123) 456-7876",
    engagements: 2
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusVariant = () => {
    switch (status) {
      case "Accepted":
        return "accepted" as const;
      case "Invite Now":
        return "inviteNow" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <Badge variant={getStatusVariant()}>
      {status}
    </Badge>
  );
};

const IntegrationCell = ({ type }: { type: string }) => {
  if (type === "connect") {
    return (
      <Button variant="outline" size="sm" className="h-7 text-xs font-medium">
        Connect
      </Button>
    );
  }
  
  const badgeClasses = "inline-flex items-center justify-center h-7 w-20 px-1 rounded-lg bg-white border border-[#E2E5EB]";
  
  if (type === "xero") {
    return (
      <div className={`${badgeClasses} gap-1`}>
        <img src="https://upload.wikimedia.org/wikipedia/en/9/9f/Xero_software_logo.svg" alt="Xero" className="h-4" />
        <span className="text-xs font-medium text-black">Xero</span>
      </div>
    );
  }
  
  if (type === "quickbooks") {
    return (
      <div className={badgeClasses}>
        <img src={intuitQuickbooksLogo} alt="Intuit QuickBooks" className="h-4" />
      </div>
    );
  }
  
  return null;
};

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("my-clients");
  const [selectedClient, setSelectedClient] = useState<string | null>("CR001");

  const tabs = [
    { id: "my-clients", label: "My Clients" },
    { id: "all-clients", label: "All Clients" },
    { id: "unassigned", label: "Unassigned" },
    { id: "archived", label: "Archived" },
  ];

  const selectedClientData = clients.find(c => c.id === selectedClient);

  return (
    <Layout title="Clients">
      <div className="flex h-full overflow-hidden" style={{ backgroundColor: "#F5F8FA" }}>
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col min-w-0">
          <div className="flex flex-col flex-1 gap-5 min-h-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 flex-shrink-0">
              {stats.map((stat, index) => (
                <StyledCard
                  key={index}
                  hover
                  className="p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-black">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary mt-1">{stat.value}</p>
                </StyledCard>
              ))}
            </div>

            {/* Tabs and Actions Row */}
            <div className="flex items-center justify-between flex-shrink-0">
              {/* Tabs */}
              <div className="flex items-center gap-1 bg-white rounded-lg border border-[#E2E5EB] p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 bg-white border border-[#E2E5EB] hover:bg-gray-50"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 bg-white border border-[#E2E5EB] hover:bg-gray-50 text-muted-foreground"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Assign Partner</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 bg-white border border-[#E2E5EB] hover:bg-gray-50 text-muted-foreground"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Invite All</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 bg-white border border-[#E2E5EB] hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-44 h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Add Client Button - Positioned top right */}
            <div className="flex justify-end -mt-3 flex-shrink-0">
              <Button className="bg-primary hover:bg-primary/90 text-white h-9 px-4 text-sm font-medium">
                Add Client
                <ChevronDown className="h-4 w-4 ml-1.5" />
              </Button>
            </div>

            {/* Clients Table */}
            <StyledCard className="overflow-hidden flex flex-col flex-1 min-h-0 -mt-2">
              <div className="flex-1 overflow-y-auto overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0 z-10 shadow-sm">
                    <tr style={{ backgroundColor: "#f1f1f3" }}>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider whitespace-nowrap w-10">
                        <Checkbox />
                      </th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider whitespace-nowrap">Client ID</th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider whitespace-nowrap">Entity Name</th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider whitespace-nowrap">Entity Type</th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider whitespace-nowrap">Status</th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider whitespace-nowrap">Integrations</th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider whitespace-nowrap">Contact Name</th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider whitespace-nowrap">Email</th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider whitespace-nowrap">Repository</th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider whitespace-nowrap">Assigned Partner</th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider whitespace-nowrap">Assigned Team</th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider whitespace-nowrap">Cell Phone</th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider whitespace-nowrap">Engagements</th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-[#000000] uppercase tracking-wider whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {clients.map((client) => (
                      <tr 
                        key={client.id} 
                        className={`hover:bg-[#F8FAFC] transition-colors group cursor-pointer ${
                          selectedClient === client.id ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedClient(client.id)}
                      >
                        <td className="px-3 py-3">
                          <Checkbox checked={selectedClient === client.id} />
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-sm text-primary font-medium cursor-pointer hover:underline">
                            {client.entityName}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-foreground">{client.entityName}</td>
                        <td className="px-3 py-3 text-sm text-foreground">{client.entityType}</td>
                        <td className="px-3 py-3">
                          <StatusBadge status={client.status} />
                        </td>
                        <td className="px-3 py-3">
                          <IntegrationCell type={client.integration} />
                        </td>
                        <td className="px-3 py-3 text-sm text-foreground">{client.contactName}</td>
                        <td className="px-3 py-3 text-sm text-primary cursor-pointer hover:underline">{client.email}</td>
                        <td className="px-3 py-3">
                          <span className="text-sm text-primary cursor-pointer hover:underline">{client.repository}</span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-primary">{client.assignedPartner}</span>
                            <Users className="h-3.5 w-3.5 text-primary" />
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          {client.assignedTeam ? (
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-foreground">{client.assignedTeam}</span>
                              <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          ) : (
                            <Users className="h-3.5 w-3.5 text-primary" />
                          )}
                        </td>
                        <td className="px-3 py-3 text-sm text-foreground">{client.cellPhone || '-'}</td>
                        <td className="px-3 py-3 text-sm text-primary font-medium text-center">{client.engagements}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Create Engagement">
                              <ClipboardPlus className="h-4 w-4 text-primary" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Edit Client">
                              <Pencil className="h-4 w-4 text-primary" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Delete Client">
                              <Trash2 className="h-4 w-4 text-primary" />
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

        {/* Right Panel - Fixed height, doesn't scroll with content */}
        <ClientRightPanel 
          className="flex-shrink-0 h-full" 
          clientName={selectedClientData?.entityName || 'Select a client'}
        />
      </div>
    </Layout>
  );
}
