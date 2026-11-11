import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, Columns3, Pencil, Trash2, Mail, UserPlus, Users, UserCheck, ShieldCheck, UsersRound, KeyRound } from "lucide-react";
import { ExpandableIconButton } from "@/components/ui/expandable-icon-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Layout } from "@/components/Layout";
import { StyledCard } from "@/components/ui/card";

// Sample stats
const stats = [
 { label: "Partners", value: "80" },
 { label: "Staff", value: "49" },
 { label: "CMS", value: "2" },
 { label: "Total Team", value: "131" },
];

// Sample team members
const teamMembers = [
 { id: "-", name: "Cpt Group", title: "cpt-10176", status: "Accepted", email: "cpt10176canada@yopmail.c...", category: "Partner", clients: "132", businessPhone: "-", cellPhone: "(424) 234-2424", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "Pen Test", title: "-", status: "Accepted", email: "pentest+role4@sspentest.c...", category: "Partner", clients: "-", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "Shai Firm", title: "ms", status: "Accepted", email: "shfirmuat@yopmail.com", category: "Partner", clients: "-", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "60.00", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "Norbert B", title: "Pen Test", status: "Accepted", email: "norbert@strivesec.com", category: "Staff", clients: "2", businessPhone: "-", cellPhone: "-", assignedPartner: "Unassigned", hourlyRate: "124.00", twoFAStatus: "-", licenseNo: "-", unassigned: true },
 { id: "-", name: "Haroon S", title: "API", status: "Accepted", email: "haroons@countable.co", category: "Staff", clients: "-", businessPhone: "-", cellPhone: "-", assignedPartner: "Unassigned", hourlyRate: "256.00", twoFAStatus: "-", licenseNo: "-", unassigned: true },
 { id: "-", name: "Amol Patil", title: "-", status: "Accepted", email: "amolp@countable.co", category: "CMS (Countable Managed Staff)", clients: "-", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "Staff Test", title: "HV", status: "Accepted", email: "stafftest@yopmail.com", category: "Partner", clients: "-", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "Ishaan S", title: "CA", status: "Invite Now", email: "ishaan@yopmail.com", category: "Partner", clients: "-", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "Henry Davis", title: "Mr", status: "Accepted", email: "general_2511281624292@y...", category: "Partner", clients: "-", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
];

const StatusBadge = ({ status }: { status: string }) => {
 const getVariant = () => {
 switch (status) {
 case "Accepted":
 return "accepted" as const;
 case "Invite Now":
 return "inviteNow" as const;
 default:
 return "secondary" as const;
 }
 };
 return <Badge variant={getVariant()}>{status}</Badge>;
};

function Highlight({ text, query }: { text: string; query: string }) {
 if (!query.trim()) return <>{text}</>;
 const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
 const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
 return (
  <>
   {parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
     <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded-sm px-0.5 not-italic">{part}</mark>
    ) : (
     <span key={i}>{part}</span>
    )
   )}
  </>
 );
}

// One entry per movable table column: its header label and the cell for a team member.
// Checkbox (first) and Actions (last) are fixed and are not part of this list.
type TeamMember = (typeof teamMembers)[number];
type TeamColumn = {
 id: string;
 label: string;
 cell: (member: TeamMember) => React.ReactNode;
};

export default function Teams() {
 const [searchQuery, setSearchQuery] = useState("");
 const [activeTab, setActiveTab] = useState("all-teams");

 const q = searchQuery.toLowerCase();
 const filteredMembers = teamMembers.filter(m => {
  const tabMatch =
   activeTab === 'all-teams' ||
   (activeTab === 'partner' && m.category === 'Partner') ||
   (activeTab === 'staff' && m.category === 'Staff') ||
   (activeTab === 'cms' && m.category.startsWith('CMS'));
  if (!tabMatch) return false;
  if (!q) return true;
  return (
   m.name.toLowerCase().includes(q) ||
   m.title.toLowerCase().includes(q) ||
   m.email.toLowerCase().includes(q) ||
   m.category.toLowerCase().includes(q) ||
   m.status.toLowerCase().includes(q)
  );
 });


 const tabs = [
 { id: "all-teams", label: "All Teams" },
 { id: "partner", label: "Partner" },
 { id: "staff", label: "Staff" },
 { id: "cms", label: "CMS" },
 ];

 // Column config drives both the header and the row cells; order and visibility live in state (not persisted).
 const columns: TeamColumn[] = [
  { id: "memberId", label: "Member ID", cell: member => (
   <td className="px-6 py-2 text-sm text-foreground whitespace-nowrap">{member.id}</td>
  ) },
  { id: "name", label: "Name", cell: member => (
   <td className="px-6 py-2 text-sm text-foreground whitespace-nowrap"><Highlight text={member.name} query={searchQuery} /></td>
  ) },
  { id: "title", label: "Title", cell: member => (
   <td className="px-6 py-2 text-sm text-foreground whitespace-nowrap"><Highlight text={member.title} query={searchQuery} /></td>
  ) },
  { id: "status", label: "Status", cell: member => (
   <td className="px-6 py-2 whitespace-nowrap">
    <StatusBadge status={member.status} />
   </td>
  ) },
  { id: "email", label: "Email", cell: member => (
   <td className="px-6 py-2 whitespace-nowrap">
    <a href={`mailto:${member.email}`} className="text-sm text-link hover:underline">
     {member.email}
    </a>
   </td>
  ) },
  { id: "category", label: "Category", cell: member => (
   <td className="px-6 py-2 text-sm text-foreground whitespace-nowrap"><Highlight text={member.category} query={searchQuery} /></td>
  ) },
  { id: "clients", label: "Clients", cell: member => (
   <td className="px-6 py-2 text-sm text-foreground whitespace-nowrap">{member.clients}</td>
  ) },
  { id: "businessPhone", label: "Business Phone", cell: member => (
   <td className="px-6 py-2 text-sm text-foreground whitespace-nowrap">{member.businessPhone}</td>
  ) },
  { id: "cellPhone", label: "Cell Phone", cell: member => (
   <td className="px-6 py-2 text-sm text-foreground whitespace-nowrap">{member.cellPhone}</td>
  ) },
  { id: "assignedPartner", label: "Assigned Partner", cell: member => (
   <td className="px-6 py-2 whitespace-nowrap">
    {member.unassigned ? (
     <span className="text-sm text-link cursor-pointer hover:underline flex items-center gap-1">
      Unassigned <Users className="h-3.5 w-3.5" />
     </span>
    ) : (
     <span className="text-sm text-foreground">{member.assignedPartner}</span>
    )}
   </td>
  ) },
  { id: "hourlyRate", label: "Hourly Rate", cell: member => (
   <td className="px-6 py-2 text-sm text-foreground whitespace-nowrap">{member.hourlyRate}</td>
  ) },
  { id: "twoFAStatus", label: "2FA Status", cell: member => (
   <td className="px-6 py-2 text-sm text-foreground whitespace-nowrap">{member.twoFAStatus}</td>
  ) },
  { id: "licenseNo", label: "License No", cell: member => (
   <td className="px-6 py-2 text-sm text-foreground whitespace-nowrap">{member.licenseNo}</td>
  ) },
 ];

 const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map(c => c.id));
 const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());

 const toggleColumn = (id: string) => setHiddenColumns(prev => {
  const next = new Set(prev);
  if (next.has(id)) next.delete(id); else next.add(id);
  return next;
 });

 const moveColumn = (id: string, direction: -1 | 1) => setColumnOrder(prev => {
  const from = prev.indexOf(id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= prev.length) return prev;
  const next = [...prev];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
 });

 const visibleColumns = columnOrder
  .filter(id => !hiddenColumns.has(id))
  .map(id => columns.find(c => c.id === id))
  .filter((c): c is TeamColumn => !!c);

 return (
 <Layout title="Team">
 <div className="flex h-full overflow-hidden bg-background">
 <div className="flex-1 p-6 overflow-hidden flex flex-col min-w-0">
 <div className="flex flex-col flex-1 gap-5 min-h-0">
 {/* Stats Cards */}
 <div className="flex items-center gap-3 flex-shrink-0">
 {stats.map((stat, index) => {
 const config = [
 { color: 'text-primary', bg: 'bg-primary/10', icon: UserCheck },
 { color: 'text-primary', bg: 'bg-primary/10', icon: Users },
 { color: 'text-primary', bg: 'bg-primary/10', icon: ShieldCheck },
 { color: 'text-primary', bg: 'bg-primary/10', icon: UsersRound },
 ];
 const { color, bg, icon: Icon } = config[index];
 return (
 <div
 key={index}
 className="flex items-center gap-3 px-5 py-3 flex-1 bg-card border border-border shadow-sm cursor-default hover:shadow-md transition-shadow"
 style={{ borderRadius: '12px' }}
 >
 <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
 <Icon className={`h-4.5 w-4.5 ${color}`} strokeWidth={2} />
 </div>
 <div className="flex flex-col">
 <span className={`text-xl font-bold leading-none ${color}`}>{stat.value}</span>
 <span className="text-[13px] font-medium text-foreground leading-tight mt-0.5 whitespace-nowrap">{stat.label}</span>
 </div>
 </div>
 );
 })}
 </div>

 {/* Tabs and Actions Row */}
 <div className="flex items-center justify-between flex-shrink-0">
 {/* Tabs */}
 <div className="flex items-center gap-1 bg-card rounded-lg border border-border p-1">
 {tabs.map((tab) => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`px-4 py-1.5 text-sm font-medium transition-colors rounded-sm ${
 activeTab === tab.id
 ? "bg-[#1C63A6] text-white"
 : "text-muted-foreground hover:bg-muted"
 }`}
 style={{ fontWeight: 600 }}
 >
 {tab.label}
 </button>
 ))}
 </div>

 {/* Actions */}
 <div className="flex items-center gap-2">
 <ExpandableIconButton
 variant="secondary"
 icon={<UserPlus className="h-4 w-4" />}
 label="Assign Partner"
 />
 <ExpandableIconButton
 variant="secondary"
 icon={<Mail className="h-4 w-4" />}
 label="Invite All"
 />
 <ExpandableIconButton
 variant="secondary"
 icon={<KeyRound className="h-4 w-4" />}
 label="Reset 2 FA"
 />
 <Popover>
 <PopoverTrigger asChild>
 <ExpandableIconButton variant="secondary" icon={<Columns3 className="h-4 w-4" />} label="Columns" />
 </PopoverTrigger>
 <PopoverContent className="p-1 bg-card min-w-max max-h-[70vh] overflow-y-auto" align="end">
  {columnOrder.map((id, index) => {
   const col = columns.find(c => c.id === id);
   if (!col) return null;
   return (
    <div key={id} className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded hover:bg-muted transition-colors">
     <label className="flex flex-1 items-center gap-2 cursor-pointer whitespace-nowrap text-foreground">
      <Checkbox checked={!hiddenColumns.has(id)} onCheckedChange={() => toggleColumn(id)} />
      {col.label}
     </label>
     <button
      type="button"
      aria-label={`Move ${col.label} up`}
      disabled={index === 0}
      onClick={() => moveColumn(id, -1)}
      className="p-0.5 rounded text-muted-foreground hover:bg-black/10 hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
     >
      <ChevronUp className="h-3.5 w-3.5" />
     </button>
     <button
      type="button"
      aria-label={`Move ${col.label} down`}
      disabled={index === columnOrder.length - 1}
      onClick={() => moveColumn(id, 1)}
      className="p-0.5 rounded text-muted-foreground hover:bg-black/10 hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
     >
      <ChevronDown className="h-3.5 w-3.5" />
     </button>
    </div>
   );
  })}
 </PopoverContent>
 </Popover>
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
 <Input
 placeholder="Search"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="pl-9 w-44 h-9 text-sm"
 />
 </div>
 <Button className="bg-[#1C63A6] hover:bg-[#1a5a9e] text-white h-9 px-4 text-sm font-medium">
 Add Team
 <ChevronDown className="h-4 w-4 ml-1.5" />
 </Button>
 </div>
 </div>

 {/* Team Table */}
 <StyledCard className="overflow-hidden flex flex-col flex-1 min-h-0 -mt-2">
 <div className="flex-1 overflow-y-auto overflow-x-auto">
 <table className="w-full">
 <thead className="sticky top-0 z-10">
 <tr className="bg-muted border-b border-border">
 <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap w-10">
 <Checkbox />
 </th>
 {visibleColumns.map(col => (
 <th key={col.id} className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
 {col.label}
 </th>
 ))}
 <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {filteredMembers.length === 0 && searchQuery.trim() ? (
          <tr><td colSpan={visibleColumns.length + 2} className="px-6 py-12 text-center">
           <p className="text-sm font-medium text-foreground">No results for &ldquo;{searchQuery}&rdquo;</p>
           <p className="text-xs text-muted-foreground mt-1">Try a different name, email, or category</p>
          </td></tr>
         ) : filteredMembers.map((member, idx) => (
 <tr
 key={idx}
 className="hover:bg-muted/50 transition-colors group max-h-[50px]"
 style={{ maxHeight: '50px' }}
 >
 <td className="px-6 py-2 whitespace-nowrap">
 <Checkbox />
 </td>
 {visibleColumns.map(col => <React.Fragment key={col.id}>{col.cell(member)}</React.Fragment>)}
 <td className="px-6 py-2 whitespace-nowrap">
 <div className="flex items-center gap-2">
 {member.status === "Invite Now" ? (
 <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
 <Mail className="h-4 w-4 text-link" />
 </button>
 ) : (
 <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
 <Pencil className="h-4 w-4 text-link" />
 </button>
 )}
 <button className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors">
 <Trash2 className="h-4 w-4 text-destructive" />
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
 </div>
 </Layout>
 );
}
