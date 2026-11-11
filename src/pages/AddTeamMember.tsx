import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Maximize2, Minimize2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { StyledCard } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { TeamMember } from "./Teams";

// Mirrors InlineField in AddNewClientV2.tsx (same props, same invalid highlight). The label sits above the control
// because this form lays its fields out in a 4-column grid.
const InlineField = ({
  label, htmlFor, required, invalid, children,
}: {
  label: string; htmlFor: string; required?: boolean; invalid?: boolean; children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={htmlFor} className="text-sm font-medium text-foreground leading-snug">
      {label}{required && <span className="text-destructive ml-0.5">*</span>}
    </label>
    <div className={invalid ? "[&_input]:!border-destructive [&_button]:!border-destructive" : ""}>
      {children}
      {invalid && <p className="text-xs text-destructive mt-1">Required</p>}
    </div>
  </div>
);

// Teams.tsx reads saved members from this key (keep the two in sync).
const TEAM_MEMBERS_KEY = "cds_team_members_v2";

const CATEGORIES = ["Partner", "Staff", "CMS (Countable Managed Staff)"];

// Hourly rate is kept to two decimal places; blank or invalid becomes "".
const formatRate = (value: string) => {
  const rate = parseFloat(value);
  return Number.isFinite(rate) && rate >= 0 ? rate.toFixed(2) : "";
};

// ── Access permissions ───────────────────────────────────────────────────────

type PermissionRow = {
  id: string;
  label: string;
  checked?: boolean;  // checkbox starts ticked
  disabled?: boolean; // checkbox is disabled
  scope?: string;     // shows this secondary button and an "All" select instead of a checkbox
  ownOnly?: boolean;  // shows a disabled "Own only" select instead of a checkbox
};
type PermissionGroup = { id: string; title: string; rows: PermissionRow[] };

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "general", title: "General settings", rows: [
      { id: "dashboard", label: "Access to dashboard", checked: true },
      { id: "firmInfo", label: "Edit firm information" },
      { id: "billing", label: "Access to Billing" },
      { id: "exportData", label: "Ability to export platform data", disabled: true },
    ],
  },
  {
    id: "team", title: "Team member settings", rows: [
      { id: "addTeam", label: "Can add team members" },
      { id: "editTeam", label: "Can edit team members" },
      { id: "deleteTeam", label: "Can delete team members" },
    ],
  },
  {
    id: "client", title: "Client settings", rows: [
      { id: "addClients", label: "Can add clients" },
      { id: "viewClients", label: "Can view clients", scope: "View Clients" },
      { id: "editClients", label: "Can edit clients", scope: "View Clients" },
      { id: "deleteClients", label: "Can delete clients" },
    ],
  },
  {
    id: "engagement", title: "Engagement settings", rows: [
      { id: "createEngagements", label: "Can create engagements", checked: true },
      { id: "viewEngagements", label: "Can view engagements", scope: "View Engagements" },
      { id: "editEngagements", label: "Can edit engagements", scope: "View Engagements" },
      { id: "deleteEngagements", label: "Can delete engagements" },
    ],
  },
  {
    id: "template", title: "Template settings", rows: [
      { id: "createTemplates", label: "Can create templates", checked: true },
      { id: "viewTemplates", label: "Can view templates", checked: true },
      { id: "editTemplates", label: "Can edit templates", ownOnly: true },
      { id: "deleteTemplates", label: "Can delete templates", ownOnly: true },
    ],
  },
  {
    id: "headerFooter", title: "Header and Footer Settings", rows: [
      { id: "headerFooterConfig", label: "Change Header and Footer Configuration in Preview Mode", checked: true },
    ],
  },
];

export default function AddTeamMember() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [memberId, setMemberId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [cellPhone, setCellPhone] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [email, setEmail] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [title, setTitle] = useState("");
  const [accessType, setAccessType] = useState("General");
  const [permissions, setPermissions] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PERMISSION_GROUPS.flatMap(g => g.rows).map(r => [r.id, !!r.checked])),
  );
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PERMISSION_GROUPS.map(g => [g.id, true])),
  );

  const allCollapsed = PERMISSION_GROUPS.every(g => !openGroups[g.id]);
  const toggleAllGroups = () =>
    setOpenGroups(Object.fromEntries(PERMISSION_GROUPS.map(g => [g.id, allCollapsed])));

  // Email stays disabled until a category is chosen, so it is only flagged once it can be filled in.
  const missingEmail = !!category && !email.trim();
  const canAdd = !!category && !!firstName.trim() && !!lastName.trim() && !!email.trim() && !!title.trim() && !!accessType;

  const handleAdd = (mode: "add" | "invite") => {
    const member: TeamMember = {
      id: memberId.trim() || "-",
      name: `${firstName.trim()} ${lastName.trim()}`,
      title: title.trim(),
      status: mode === "invite" ? "Invite Sent" : "Invite Now",
      email: email.trim(),
      category,
      clients: "-",
      businessPhone: businessPhone.trim() || "-",
      cellPhone: cellPhone.trim() || "-",
      assignedPartner: "-",
      hourlyRate: formatRate(hourlyRate) || "-",
      twoFAStatus: "-",
      licenseNo: licenseNo.trim() || "-",
    };
    let existing: unknown[] = [];
    try {
      const raw = localStorage.getItem(TEAM_MEMBERS_KEY);
      const saved: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(saved)) existing = saved;
    } catch { /* unreadable storage: start a new list */ }
    try {
      localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify([member, ...existing]));
    } catch { /* storage unavailable: the member is not kept */ }
    toast.success(mode === "invite" ? "Team member added and invite sent" : "Team member added");
    navigate("/teams");
  };

  // The right-hand control of a permission row: checkbox by default, or the scope button + select / "Own only" select.
  const renderPermissionControl = (row: PermissionRow) => {
    if (row.scope) {
      return (
        <div className="flex items-center gap-4">
          <Button type="button" variant="secondary">{row.scope}</Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]" aria-label={`${row.label}: scope`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }
    if (row.ownOnly) {
      return (
        <Select value="own" disabled>
          <SelectTrigger className="w-[150px]" aria-label={`${row.label}: scope`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="own">Own only</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    return (
      <Checkbox
        checked={permissions[row.id]}
        disabled={row.disabled}
        aria-label={row.label}
        onCheckedChange={checked => setPermissions(prev => ({ ...prev, [row.id]: checked === true }))}
      />
    );
  };

  return (
    <Layout title="Team">
      <div className="flex flex-col h-full overflow-hidden bg-background">

        {/* Sticky header bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 border-b border-border/60">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Back to Team"
              onClick={() => navigate("/teams")}
              className="text-link hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-foreground">Add New Member</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 px-4 text-sm" onClick={() => navigate("/teams")}>
              Cancel
            </Button>
            <div className="inline-flex">
              <Button
                className="h-9 px-4 text-sm bg-[#1C63A6] hover:bg-[#1a5a9e] text-white rounded-r-none"
                disabled={!canAdd}
                onClick={() => handleAdd("add")}
              >
                Add
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="More add options"
                    className="h-9 w-9 px-0 bg-[#1C63A6] hover:bg-[#1a5a9e] text-white rounded-l-none border-l-white/30"
                    disabled={!canAdd}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-max">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleAdd("invite")}>
                    Add and Invite
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 pb-8 pt-4 space-y-4">

          {/* ── Basic Details ─────────────────────────────────────────────── */}
          <StyledCard>
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-base font-semibold text-foreground">Basic Details</h3>
            </div>
            <div className="grid grid-cols-4 gap-x-6 gap-y-4 p-6">
              <InlineField label="Choose Category" htmlFor="team-category" required invalid={!category}>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="team-category">
                    <SelectValue placeholder="Choose Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </InlineField>
              <InlineField label="Member ID" htmlFor="team-member-id">
                <Input id="team-member-id" placeholder="Member ID" value={memberId} onChange={e => setMemberId(e.target.value)} />
              </InlineField>
              <InlineField label="First Name" htmlFor="team-first-name" required invalid={!firstName.trim()}>
                <Input id="team-first-name" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
              </InlineField>
              <InlineField label="Last Name" htmlFor="team-last-name" required invalid={!lastName.trim()}>
                <Input id="team-last-name" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
              </InlineField>

              <InlineField label="Business Phone" htmlFor="team-business-phone">
                <Input id="team-business-phone" type="tel" placeholder="Business Phone" value={businessPhone} onChange={e => setBusinessPhone(e.target.value)} />
              </InlineField>
              <InlineField label="Cell Phone" htmlFor="team-cell-phone">
                <Input id="team-cell-phone" type="tel" placeholder="Cell Phone" value={cellPhone} onChange={e => setCellPhone(e.target.value)} />
              </InlineField>
              <InlineField label="Hourly Rate" htmlFor="team-hourly-rate">
                <Input
                  id="team-hourly-rate"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Hourly Rate"
                  value={hourlyRate}
                  onChange={e => setHourlyRate(e.target.value.replace(/-/g, ""))}
                  onBlur={() => setHourlyRate(formatRate(hourlyRate))}
                />
              </InlineField>
              <InlineField label="Email" htmlFor="team-email" required invalid={missingEmail}>
                <Input
                  id="team-email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  disabled={!category}
                  onChange={e => setEmail(e.target.value)}
                />
              </InlineField>

              <InlineField label="License No" htmlFor="team-license-no">
                <Input id="team-license-no" placeholder="License No" value={licenseNo} onChange={e => setLicenseNo(e.target.value)} />
              </InlineField>
              <InlineField label="Title" htmlFor="team-title" required invalid={!title.trim()}>
                <Input id="team-title" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
              </InlineField>
              <InlineField label="Access Type" htmlFor="team-access-type" required invalid={!accessType}>
                <Select value={accessType} onValueChange={setAccessType}>
                  <SelectTrigger id="team-access-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </InlineField>
            </div>
          </StyledCard>

          {/* ── Access Permissions ────────────────────────────────────────── */}
          <StyledCard className="flex items-center justify-between px-6 py-4">
            <h3 className="text-base font-semibold text-foreground">Access Permissions</h3>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label={allCollapsed ? "Expand all" : "Collapse all"}
              onClick={toggleAllGroups}
            >
              {allCollapsed ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          </StyledCard>

          {PERMISSION_GROUPS.map(group => (
            <Collapsible
              key={group.id}
              open={openGroups[group.id]}
              onOpenChange={open => setOpenGroups(prev => ({ ...prev, [group.id]: open }))}
            >
              <StyledCard>
                <CollapsibleTrigger asChild>
                  <button type="button" className="flex w-full items-center justify-between px-6 py-3 text-left">
                    <span className="text-sm font-semibold text-foreground">{group.title}</span>
                    {openGroups[group.id]
                      ? <ChevronUp className="h-4 w-4 text-foreground" />
                      : <ChevronDown className="h-4 w-4 text-foreground" />}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t border-border py-1">
                    {group.rows.map(row => (
                      <div key={row.id} className="flex items-center justify-between gap-4 px-6 py-2 min-h-10">
                        <span className="text-sm text-foreground">{row.label}</span>
                        {renderPermissionControl(row)}
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </StyledCard>
            </Collapsible>
          ))}
        </div>
      </div>
    </Layout>
  );
}
