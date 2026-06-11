import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEngagements } from "@/store/EngagementsContext";
import { EngagementRecord, setEngagementMeta } from "@/store/engagementsStore";
import { toast } from "sonner";
import intuitQuickbooksLogo from "@/assets/intuit-quickbooks-logo.svg";
import { ArrowLeft, Briefcase, Calendar, Users, ChevronDown, Plus, Pencil, Trash2, Search, ExternalLink, X, Building2, FileText, Settings2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const INDUSTRIES = [
  "Construction & Real Estate", "Financial Services", "Healthcare & Life Sciences",
  "Hospitality & Tourism", "Manufacturing", "Mining & Resources", "Not-for-Profit",
  "Oil & Gas", "Professional Services", "Retail & Consumer", "Technology", "Transportation & Logistics",
];
const ACCOUNTING_FRAMEWORKS = ["ASPE", "IFRS", "US GAAP"];
const ENTITY_CLASSIFICATIONS = ["Private", "Public", "Manufacturing"];
const AUDIT_ROLES = [
  "Engagement Partner", "Manager", "Senior Auditor", "Staff Auditor / Assistant",
  "EQCR (Quality Reviewer)", "Tax Reviewer", "Subject Matter Expert", "Preparer", "Other",
];
const AUDIT_DISCLOSURE_OPTIONS = [
  { key: "fullFinancials",         label: "Full financial statements" },
  { key: "cashFlow",               label: "Cash Flow Statement" },
  { key: "shareholdersEquity",     label: "Shareholders' Equity" },
  { key: "notesToFinancials",      label: "Notes to financial statements" },
  { key: "schedulesOfExpenses",    label: "Schedules of Expenses" },
  { key: "supplementarySchedules", label: "Supplementary schedules" },
  { key: "segmentReporting",       label: "Segment Reporting" },
  { key: "interimFinancials",      label: "Interim Financials" },
];

let _uid = 0;
const uid = () => String(++_uid);

// Standard input component with label above - matching design system
const LabeledInput = ({ 
  label, 
  value, 
  onChange, 
  required = false,
  type = "text",
  icon,
  readOnly = false,
  disabled = false,
  error = false
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  icon?: React.ReactNode;
  readOnly?: boolean;
  disabled?: boolean;
  error?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          disabled={disabled}
          className={`
            input-double-border w-full h-9 px-3 py-2 text-sm text-foreground rounded-[10px] outline-none transition-all duration-200
            ${disabled 
              ? 'bg-muted border border-transparent text-muted-foreground opacity-60 cursor-not-allowed' 
              : error
                ? 'bg-white dark:bg-card border border-destructive'
                : 'bg-white border border-[#dcdfe4] dark:border-[hsl(220_15%_30%)] dark:bg-card hover:border-[hsl(210_25%_75%)] dark:hover:border-[hsl(220_15%_40%)]'
            }
            ${readOnly ? 'cursor-default' : ''}
            ${icon ? 'pr-10' : ''}
          `}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

// Standard select component with label above - matching design system
const LabeledSelect = ({ 
  label, 
  value, 
  onChange, 
  options,
  required = false,
  disabled = false,
  error = false
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            input-double-border w-full h-9 px-3 py-2 text-sm text-foreground rounded-[10px] outline-none transition-all duration-200 appearance-none cursor-pointer
            ${disabled 
              ? 'bg-muted border border-transparent text-muted-foreground opacity-60 cursor-not-allowed' 
              : error
                ? 'bg-white dark:bg-card border border-destructive'
                : 'bg-white border border-[#dcdfe4] dark:border-[hsl(220_15%_30%)] dark:bg-card hover:border-[hsl(210_25%_75%)] dark:hover:border-[hsl(220_15%_40%)]'
            }
          `}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${disabled ? 'text-muted-foreground opacity-60' : 'text-muted-foreground'}`} />
      </div>
    </div>
  );
};

// Section card component
const SectionCard = ({
  icon,
  title,
  children,
  badge,
  headerRight,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  badge?: string;
  headerRight?: React.ReactNode;
}) => (
  <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
    <div className="flex items-center gap-2 mb-5">
      <span className="text-primary">{icon}</span>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {badge && (
        <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">{badge}</span>
      )}
      {headerRight && <div className="ml-auto">{headerRight}</div>}
    </div>
    {children}
  </div>
);

const MultiSelectDropdown = ({
  label,
  options,
  selected,
  onToggle,
  required = false,
}: {
  label: string;
  options: { key: string; label: string }[];
  selected: Set<string>;
  onToggle: (key: string) => void;
  required?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-1" ref={ref}>
      <label className="text-xs font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="input-double-border w-full h-9 px-3 text-sm text-left rounded-[10px] outline-none transition-all bg-white border border-[#dcdfe4] dark:border-[hsl(220_15%_30%)] dark:bg-card hover:border-[hsl(210_25%_75%)] dark:hover:border-[hsl(220_15%_40%)] flex items-center justify-between gap-2"
        >
          <span className="text-muted-foreground truncate">
            {selected.size === 0 ? "Select..." : `${selected.size} selected`}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>
        {open && (
          <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white dark:bg-card border border-border rounded-lg shadow-lg py-1 max-h-52 overflow-y-auto">
            {options.map(({ key, label: optLabel }) => (
              <button
                key={key}
                type="button"
                onClick={() => onToggle(key)}
                className="w-full px-3 py-2 text-sm text-left flex items-center gap-2.5 hover:bg-muted transition-colors"
              >
                <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${selected.has(key) ? "bg-primary border-primary" : "border-border"}`}>
                  {selected.has(key) && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <span className={selected.has(key) ? "text-foreground" : "text-muted-foreground"}>{optLabel}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {selected.size > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {options.filter(o => selected.has(o.key)).map(({ key, label: chipLabel }) => (
            <span key={key} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
              {chipLabel}
              <button type="button" onClick={() => onToggle(key)} className="hover:text-destructive transition-colors ml-0.5">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

interface TeamMember {
  id: string;
  role: string;
  name: string;
  email: string;
  title: string;
  hourlyRate: string;
  timeAllocation: string;
}

type PendingRow =
  | { mode: 'add'; draft: TeamMember }
  | { mode: 'edit'; originalId: string; draft: TeamMember };

function calcBudgetedCost(hourlyRate: string, timeAllocation: string) {
  const rate = parseFloat(hourlyRate) || 0;
  const alloc = parseFloat(timeAllocation) || 0;
  return (rate * (alloc / 100)).toFixed(2);
}

function calcBudgetedHours(timeAllocation: string) {
  return ((parseFloat(timeAllocation) || 0) / 100).toFixed(2);
}

const MOCK_TEAM_MEMBERS = [
  { name: "Kaushal Bhagat",  email: "kaushalb@countable.co",  title: "Manager",       hourlyRate: "100.00" },
  { name: "Atin Gupta",      email: "atin@countable.co",       title: "Partner",       hourlyRate: "200.00" },
  { name: "Michael Torres",  email: "michaelt@countable.co",   title: "Senior Auditor",hourlyRate: "85.00"  },
  { name: "Sarah Chen",      email: "sarahc@countable.co",     title: "Staff Auditor", hourlyRate: "65.00"  },
  { name: "Jane DEF",        email: "John_DEF@email.com",      title: "Associate",     hourlyRate: "25.00"  },
];

const TeamMemberViewRow = ({
  member,
  checked,
  onCheck,
  onEdit,
  onDelete,
}: {
  member: TeamMember;
  checked: boolean;
  onCheck: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <tr className="hover:bg-muted/50 transition-colors group border-b border-border/40">
    <td className="px-6 py-2 w-10">
      <Checkbox checked={checked} onCheckedChange={onCheck} />
    </td>
    <td className="px-6 py-2 text-sm text-foreground whitespace-nowrap">{member.role}</td>
    <td className="px-6 py-2 text-sm font-medium text-foreground whitespace-nowrap">{member.name}</td>
    <td className="px-6 py-2 text-sm text-muted-foreground">{member.email}</td>
    <td className="px-6 py-2 text-sm text-muted-foreground whitespace-nowrap">{member.title}</td>
    <td className="px-6 py-2 text-sm text-right text-foreground">{parseFloat(member.hourlyRate || "0").toFixed(2)}</td>
    <td className="px-6 py-2 text-sm text-right text-foreground">{member.timeAllocation}</td>
    <td className="px-6 py-2 text-sm text-right text-foreground">{calcBudgetedCost(member.hourlyRate, member.timeAllocation)}</td>
    <td className="px-6 py-2 text-sm text-right text-foreground">{calcBudgetedHours(member.timeAllocation)}</td>
    <td className="px-6 py-2">
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button type="button" onClick={onEdit} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
          <Pencil className="h-4 w-4 text-link" />
        </button>
        <button type="button" onClick={onDelete} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
          <Trash2 className="h-4 w-4 text-destructive" />
        </button>
      </div>
    </td>
  </tr>
);

const TeamMemberEditRow = ({
  draft,
  onChangeDraft,
  onConfirm,
  onCancel,
  roleOptions,
}: {
  draft: TeamMember;
  onChangeDraft: (d: TeamMember) => void;
  onConfirm: () => void;
  onCancel: () => void;
  roleOptions: string[];
}) => {
  const handleMemberSelect = (name: string) => {
    const found = MOCK_TEAM_MEMBERS.find(m => m.name === name);
    onChangeDraft({ ...draft, name, email: found?.email ?? "", title: found?.title ?? "", hourlyRate: found?.hourlyRate ?? draft.hourlyRate });
  };
  const selectCls = "input-double-border w-full h-9 pl-3 pr-8 text-sm text-foreground rounded-[10px] outline-none transition-all duration-200 appearance-none cursor-pointer bg-white border border-[#dcdfe4] dark:border-[hsl(220_15%_30%)] dark:bg-card hover:border-[hsl(210_25%_75%)] dark:hover:border-[hsl(220_15%_40%)]";
  const numCls  = "input-double-border w-full h-9 px-3 text-sm text-right text-foreground rounded-[10px] outline-none transition-all duration-200 bg-white border border-[#dcdfe4] dark:border-[hsl(220_15%_30%)] dark:bg-card hover:border-[hsl(210_25%_75%)] dark:hover:border-[hsl(220_15%_40%)]";
  return (
    <tr className="bg-primary/[0.03] dark:bg-primary/[0.05] border-b border-border/40">
      <td className="px-6 py-2 w-10"><Checkbox /></td>
      <td className="px-6 py-2 min-w-[160px]">
        <div className="relative">
          <select value={draft.role} onChange={e => onChangeDraft({ ...draft, role: e.target.value })} className={selectCls}>
            {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </td>
      <td className="px-6 py-2 min-w-[200px]">
        <div className="relative">
          <select value={draft.name} onChange={e => handleMemberSelect(e.target.value)} className={selectCls}>
            <option value="">Select an option</option>
            {MOCK_TEAM_MEMBERS.map(m => (
              <option key={m.name} value={m.name} title={m.email}>{m.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </td>
      <td className="px-6 py-2 text-sm text-muted-foreground max-w-[160px] truncate">{draft.email}</td>
      <td className="px-6 py-2 text-sm text-muted-foreground whitespace-nowrap">{draft.title}</td>
      <td className="px-6 py-2 min-w-[110px]">
        <input type="number" value={draft.hourlyRate} min="0" step="0.01"
          onChange={e => onChangeDraft({ ...draft, hourlyRate: e.target.value })}
          className={numCls} />
      </td>
      <td className="px-6 py-2 min-w-[110px]">
        <input type="number" value={draft.timeAllocation} min="0" max="100"
          onChange={e => onChangeDraft({ ...draft, timeAllocation: e.target.value })}
          className={numCls} />
      </td>
      <td className="px-6 py-2 text-sm text-right text-muted-foreground min-w-[110px]">
        {calcBudgetedCost(draft.hourlyRate, draft.timeAllocation)}
      </td>
      <td className="px-6 py-2 text-sm text-right text-muted-foreground min-w-[100px]">
        {calcBudgetedHours(draft.timeAllocation)}
      </td>
      <td className="px-6 py-2">
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={onConfirm}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
          </button>
          <button type="button" onClick={onCancel}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors text-destructive">
            <X className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const CLIENT_DATA: Record<string, {
  entityLegalName: string;
  entityType: string;
  contactPerson: string;
  engagementPartner: string;
  integrations: string[];
  businessPhone: string;
  cellPhone: string;
}> = {
  "Harbor Freight Logistics LLC": {
    entityLegalName: "Harbor Freight Logistics LLC",
    entityType: "Corporation",
    contactPerson: "Michael Torres",
    engagementPartner: "Atin Gupta",
    integrations: ["quickbooks"],
    businessPhone: "+1 (604) 555-0192",
    cellPhone: "-",
  },
  "Shipping Line Inc.": {
    entityLegalName: "Shipping Line Inc.",
    entityType: "Corporation",
    contactPerson: "Sarah Chen",
    engagementPartner: "Atin Gupta",
    integrations: ["quickbooks"],
    businessPhone: "+1 (604) 555-0134",
    cellPhone: "+1 (778) 555-0221",
  },
  "John Doe Inc.": {
    entityLegalName: "John Doe Inc.",
    entityType: "Corporation",
    contactPerson: "John Doe",
    engagementPartner: "Atin Gupta",
    integrations: ["quickbooks"],
    businessPhone: "-",
    cellPhone: "-",
  },
};

function formatYearEnd(dateStr: string): string {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateCreated(): string {
  const now = new Date();
  return now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export default function CreateEngagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addEngagement } = useEngagements();
  const prefill = (location.state as { clientName?: string; engagementType?: string } | null) ?? {};

  // Engagement Details state
  const [clientName, setClientName] = useState(prefill.clientName || "");
  const clientInfo = CLIENT_DATA[clientName] ?? null;
  const [engagementType, setEngagementType] = useState(prefill.engagementType || "Review (REV)");
  const prefillIsAudit = (prefill.engagementType || "Review (REV)") === "Audit (AUD)";
  const [engagementId, setEngagementId] = useState(prefillIsAudit ? "AUD-HFL-Mar312024" : "REV-DEF-Nov302023");
  const [engagementTemplate, setEngagementTemplate] = useState(prefillIsAudit ? "CAS Audit" : "Review Section 2400");
  const [budget, setBudget] = useState("10000.00");
  const [accountingStandards, setAccountingStandards] = useState(prefillIsAudit ? "CAS (Canadian Auditing Standards)" : "Section 2400 Review standards");
  const [additionalDisclosures, setAdditionalDisclosures] = useState(prefillIsAudit ? "Full financial statements" : "Statement of cash flows");

  // Engagement Period state
  const [periodType, setPeriodType] = useState("Full year");
  const [currentYearStart, setCurrentYearStart] = useState("12/01/2022");
  const [currentYearEnd, setCurrentYearEnd] = useState("11/30/2023");
  const [priorYear1Start, setPriorYear1Start] = useState("12/01/2021");
  const [priorYear1End, setPriorYear1End] = useState("11/30/2022");
  const [priorYear2Start, setPriorYear2Start] = useState("12/01/2020");
  const [priorYear2End, setPriorYear2End] = useState("11/30/2021");
  const [priorYear1NoData, setPriorYear1NoData] = useState(false);
  const [priorYear2NoData, setPriorYear2NoData] = useState(false);

  // Audit-specific state
  const isAudit = engagementType === "Audit (AUD)";

  // Sync engagement details when type changes (skip initial render)
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    if (isAudit) {
      setEngagementId("AUD-HFL-Mar312024");
      setEngagementTemplate("CAS Audit");
      setAccountingStandards("CAS (Canadian Auditing Standards)");
      setAdditionalDisclosures("");
      setAdditionalDisclosuresSet(new Set());
    } else {
      setEngagementId("REV-DEF-Nov302023");
      setEngagementTemplate("Review Section 2400");
      setAccountingStandards("Section 2400 Review standards");
      setAdditionalDisclosures("Statement of cash flows");
      setAdditionalDisclosuresSet(new Set());
    }
  }, [isAudit]);
  const [industry, setIndustry] = useState("");
  const [accountingFramework, setAccountingFramework] = useState("");
  const [entityClassification, setEntityClassification] = useState("");
  const [firstYearAudit, setFirstYearAudit] = useState(false);
  const [additionalDisclosuresSet, setAdditionalDisclosuresSet] = useState<Set<string>>(new Set());
  const toggleAdditionalDisclosure = (key: string) =>
    setAdditionalDisclosuresSet(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  // Team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingRow, setPendingRow] = useState<PendingRow | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [teamSearch, setTeamSearch] = useState("");

  const roleOptions = isAudit ? AUDIT_ROLES : ["Partner", "Manager", "Senior", "Staff / Assistant", "Preparer"];

  const startAddMember = () => {
    if (pendingRow) return;
    setPendingRow({ mode: 'add', draft: { id: uid(), role: roleOptions[0] ?? "", name: "", email: "", title: "", hourlyRate: "0.00", timeAllocation: "" } });
  };
  const startEditMember = (member: TeamMember) => {
    if (pendingRow) return;
    setPendingRow({ mode: 'edit', originalId: member.id, draft: { ...member } });
  };
  const confirmPendingRow = () => {
    if (!pendingRow) return;
    if (pendingRow.mode === 'add') {
      setTeamMembers(prev => [...prev, pendingRow.draft]);
    } else {
      setTeamMembers(prev => prev.map(m => m.id === pendingRow.originalId ? pendingRow.draft : m));
    }
    setPendingRow(null);
  };
  const cancelPendingRow = () => setPendingRow(null);
  const deleteMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };
  const toggleSelect = (id: string) =>
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const deleteSelected = () => {
    setTeamMembers(prev => prev.filter(m => !selectedIds.has(m.id)));
    setSelectedIds(new Set());
  };

  const filteredMembers = teamMembers.filter(m =>
    !teamSearch || m.name.toLowerCase().includes(teamSearch.toLowerCase()) || m.role.toLowerCase().includes(teamSearch.toLowerCase())
  );
  const avgRate = teamMembers.length ? (teamMembers.reduce((s, m) => s + (parseFloat(m.hourlyRate) || 0), 0) / teamMembers.length).toFixed(2) : "0.00";
  const avgAlloc = teamMembers.length ? (teamMembers.reduce((s, m) => s + (parseFloat(m.timeAllocation) || 0), 0) / teamMembers.length).toFixed(0) : "0";
  const avgCost = teamMembers.length ? (teamMembers.reduce((s, m) => s + parseFloat(calcBudgetedCost(m.hourlyRate, m.timeAllocation)), 0) / teamMembers.length).toFixed(2) : "0.00";
  const avgHours = teamMembers.length ? (teamMembers.reduce((s, m) => s + parseFloat(calcBudgetedHours(m.timeAllocation)), 0) / teamMembers.length).toFixed(2) : "0.00";

  const engagementTypeOptions = [
    { value: "Audit (AUD)", label: "Audit (AUD)" },
    { value: "Compilation (COM)", label: "Compilation (COM)" },
    { value: "Review (REV)", label: "Review (REV)" },
    { value: "T2 (Corporations)", label: "T2 (Corporations)" },
  ];

  const accountingStandardsOptions = isAudit
    ? [
        { value: "CAS (Canadian Auditing Standards)", label: "CAS (Canadian Auditing Standards)" },
        { value: "ISA (International Standards on Auditing)", label: "ISA (International Standards on Auditing)" },
        { value: "GAAS (US Generally Accepted Auditing Standards)", label: "GAAS (US Generally Accepted Auditing Standards)" },
        { value: "PCAOB Standards", label: "PCAOB Standards" },
      ]
    : [
        { value: "Section 2400 Review standards", label: "Section 2400 Review standards" },
        { value: "ASPE", label: "ASPE" },
        { value: "IFRS", label: "IFRS" },
      ];

  const disclosureOptions = [
    { value: "Statement of cash flows", label: "Statement of cash flows" },
    { value: "Notes to financial statements", label: "Notes to financial statements" },
  ];

  const periodTypeOptions = [
    { value: "Full year", label: "Full year" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "Monthly", label: "Monthly" },
  ];

  const isFormValid =
    clientName.trim() !== "" &&
    engagementId.trim() !== "" &&
    engagementTemplate.trim() !== "" &&
    engagementType !== "" &&
    budget.trim() !== "" &&
    accountingStandards !== "" &&
    additionalDisclosures !== "" &&
    (!isAudit || (industry !== "" && accountingFramework !== "" && entityClassification !== "")) &&
    currentYearStart.trim() !== "" &&
    currentYearEnd.trim() !== "" &&
    teamMembers.length > 0;

  const handleCreate = () => {
    const record: EngagementRecord = {
      id: engagementId,
      client: clientName,
      type: engagementType,
      yearEnd: formatYearEnd(currentYearEnd),
      team: "View Assignees",
      status: "New",
      statusVariant: "new",
      hasRF: false,
      dateCreated: formatDateCreated(),
      firstYearAudit,
    };
    addEngagement(record);
    setEngagementMeta(engagementId, {
      firstYearAudit,
      accountingFramework: isAudit ? accountingFramework : undefined,
      industry: isAudit ? industry : undefined,
      accountingStandards,
      budget,
      periodStart: currentYearStart,
      periodEnd: currentYearEnd,
    });
    if (isAudit && firstYearAudit) {
      toast.success("Engagement created — IE checklist and predecessor letter added.");
    } else {
      toast.success("Engagement created successfully.");
    }
    navigate("/engagements");
  };

  return (
    <Layout title="Create Engagement">
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="p-6">
          {/* Header with back button */}
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => navigate("/engagements")}
              className="flex items-center gap-1 text-link hover:underline text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 icon-arrow" />
              Back
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {/* Client Info Section */}
            {clientInfo && (
              <div className="bg-card rounded-lg shadow-sm px-6 py-5 border border-border">
                <h2 className="text-sm font-semibold text-foreground mb-4">Client Info</h2>
                <div className="grid grid-cols-7 gap-4">
                  {[
                    { label: "Entity legal name", value: clientInfo.entityLegalName },
                    { label: "Entity type", value: clientInfo.entityType },
                    { label: "Contact person", value: clientInfo.contactPerson },
                    { label: "Engagement partner", value: clientInfo.engagementPartner, isLink: true },
                    { label: "Integrations", value: clientInfo.integrations },
                    { label: "Business phone", value: clientInfo.businessPhone },
                    { label: "Cell phone", value: clientInfo.cellPhone },
                  ].map((col) => (
                    <div key={col.label} className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-primary">{col.label}</span>
                      {Array.isArray(col.value) ? (
                        <div className="flex items-center gap-1.5">
                          {col.value.includes("quickbooks") && (
                            <img
                              src={intuitQuickbooksLogo}
                              alt="QuickBooks"
                              className="h-5 object-contain"
                            />
                          )}
                        </div>
                      ) : (col as any).isLink ? (
                        <span className="text-sm text-link font-medium cursor-pointer hover:underline">{col.value as string}</span>
                      ) : (
                        <span className="text-sm text-foreground">{col.value as string}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Engagement Details Section */}
            <SectionCard icon={<Briefcase className="h-5 w-5" />} title="Engagement Details">
              <div className="grid grid-cols-4 gap-4">
                <LabeledInput
                  label="Client Name"
                  value={clientName}
                  onChange={setClientName}
                  required
                />
                <LabeledInput
                  label="Engagement ID"
                  value={engagementId}
                  onChange={setEngagementId}
                  required
                  icon={<Pencil className="h-4 w-4" />}
                />
                <LabeledInput
                  label="Engagement Template"
                  value={engagementTemplate}
                  onChange={setEngagementTemplate}
                  required
                  icon={<ExternalLink className="h-4 w-4" />}
                />
                <LabeledSelect
                  label="Engagement Type"
                  value={engagementType}
                  onChange={setEngagementType}
                  options={engagementTypeOptions}
                  required
                />
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                <LabeledInput
                  label="Budget($)"
                  value={budget}
                  onChange={setBudget}
                  required
                  type="text"
                />
                <LabeledSelect
                  label="Accounting Standards"
                  value={accountingStandards}
                  onChange={setAccountingStandards}
                  options={accountingStandardsOptions}
                  required
                />
                <LabeledSelect
                  label="Additional disclosures"
                  value={additionalDisclosures}
                  onChange={setAdditionalDisclosures}
                  options={isAudit
                    ? AUDIT_DISCLOSURE_OPTIONS.map(o => ({ value: o.label, label: o.label }))
                    : disclosureOptions}
                  required
                />
              </div>
            </SectionCard>

            {/* Audit Configuration — only for Audit (AUD) */}
            {isAudit && (
              <SectionCard icon={<Settings2 className="h-5 w-5" />} title="Audit Configuration">
                <div className="grid grid-cols-4 gap-5 items-start">
                  <LabeledSelect
                    label="Industry"
                    value={industry}
                    onChange={setIndustry}
                    options={INDUSTRIES.map(i => ({ value: i, label: i }))}
                    required
                  />
                  <LabeledSelect
                    label="Accounting Framework"
                    value={accountingFramework}
                    onChange={setAccountingFramework}
                    options={ACCOUNTING_FRAMEWORKS.map(fw => ({ value: fw, label: fw }))}
                    required
                  />
                  <LabeledSelect
                    label="Entity Classification"
                    value={entityClassification}
                    onChange={setEntityClassification}
                    options={ENTITY_CLASSIFICATIONS.map(ec => ({ value: ec, label: ec }))}
                    required
                  />
                  {/* First-year audit */}
                  <div className="flex flex-col gap-1">
                    <LabeledSelect
                      label="First-Year Audit?"
                      value={firstYearAudit ? "yes" : "no"}
                      onChange={v => setFirstYearAudit(v === "yes")}
                      options={[
                        { value: "no", label: "No" },
                        { value: "yes", label: "Yes" },
                      ]}
                    />
                    {firstYearAudit && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        Predecessor review required. Opening balances will be included.
                      </p>
                    )}
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Engagement Period Section */}
            <SectionCard icon={<Calendar className="h-5 w-5" />} title="Engagement Period">
              <div className="space-y-5">
                {/* Period Type */}
                <div className="flex items-center gap-8">
                  <label className="text-sm text-muted-foreground w-24 whitespace-nowrap">Period Type<span className="text-destructive">*</span></label>
                  <div className="w-64">
                    <LabeledSelect
                      label=""
                      value={periodType}
                      onChange={setPeriodType}
                      options={periodTypeOptions}
                    />
                  </div>
                </div>

                {/* Current Year */}
                <div className="flex items-start gap-8">
                  <label className="text-sm text-muted-foreground w-24 pt-6 whitespace-nowrap">Current Year<span className="text-destructive">*</span></label>
                  <div className="flex gap-4">
                    <div className="w-40">
                      <LabeledInput
                        label="Start Date"
                        value={currentYearStart}
                        onChange={setCurrentYearStart}
                        required
                        icon={<Calendar className="h-4 w-4" />}
                      />
                    </div>
                    <div className="w-40">
                      <LabeledInput
                        label="End Date"
                        value={currentYearEnd}
                        onChange={setCurrentYearEnd}
                        required
                        icon={<Calendar className="h-4 w-4" />}
                      />
                    </div>
                  </div>
                </div>

                {/* Prior Year 1 */}
                <div className="flex items-start gap-8">
                  <label className="text-sm text-muted-foreground w-24 pt-6 whitespace-nowrap">Prior Year 1<span className="text-destructive">*</span></label>
                  <div className="flex gap-4">
                    <div className="w-40">
                      <LabeledInput
                        label="Start Date"
                        value={priorYear1Start}
                        onChange={setPriorYear1Start}
                        required
                        icon={<Calendar className="h-4 w-4" />}
                      />
                    </div>
                    <div className="w-40">
                      <LabeledInput
                        label="End Date"
                        value={priorYear1End}
                        onChange={setPriorYear1End}
                        required
                        icon={<Calendar className="h-4 w-4" />}
                      />
                    </div>
                    <div className="flex items-end gap-2 pb-3">
                      <Checkbox 
                        checked={priorYear1NoData} 
                        onCheckedChange={(checked) => setPriorYear1NoData(checked as boolean)} 
                      />
                      <div className="text-sm">
                        <span className="text-muted-foreground">No Data Available</span>
                        <p className="text-xs text-muted-foreground">Prior Year 1 data upload will be disabled</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prior Year 2 */}
                <div className="flex items-start gap-8">
                  <label className="text-sm text-muted-foreground w-24 pt-6 whitespace-nowrap">Prior Year 2<span className="text-destructive">*</span></label>
                  <div className="flex gap-4">
                    <div className="w-40">
                      <LabeledInput
                        label="Start Date"
                        value={priorYear2Start}
                        onChange={setPriorYear2Start}
                        required
                        icon={<Calendar className="h-4 w-4" />}
                      />
                    </div>
                    <div className="w-40">
                      <LabeledInput
                        label="End Date"
                        value={priorYear2End}
                        onChange={setPriorYear2End}
                        required
                        icon={<Calendar className="h-4 w-4" />}
                      />
                    </div>
                    <div className="flex items-end gap-2 pb-3">
                      <Checkbox 
                        checked={priorYear2NoData} 
                        onCheckedChange={(checked) => setPriorYear2NoData(checked as boolean)} 
                      />
                      <div className="text-sm">
                        <span className="text-muted-foreground">No Data Available</span>
                        <p className="text-xs text-muted-foreground">Prior Year 2 data upload will be disabled</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Assigned Team Section */}
            <SectionCard
              icon={<Users className="h-5 w-5" />}
              title="Assigned team"
              badge={`${teamMembers.length} User`}
              headerRight={
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={teamSearch}
                      onChange={(e) => setTeamSearch(e.target.value)}
                      className="input-double-border pl-9 pr-3 h-9 text-sm bg-card border border-border rounded-[10px] outline-none w-40 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={deleteSelected}
                    disabled={selectedIds.size === 0}
                    className="h-9 px-3 gap-1.5 text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              }
            >
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted border-b border-border">
                      <th className="text-left px-6 py-4 w-10">
                        <Checkbox
                          checked={teamMembers.length > 0 && selectedIds.size === teamMembers.length}
                          onCheckedChange={(v) => setSelectedIds(v ? new Set(teamMembers.map(m => m.id)) : new Set())}
                        />
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                        Role<span className="text-destructive ml-0.5">*</span>
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                        Team member<span className="text-destructive ml-0.5">*</span>
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Email</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Title</th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                        Hourly rate ($)<span className="text-destructive ml-0.5">*</span>
                      </th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                        Time Allocation(%)<span className="text-destructive ml-0.5">*</span>
                      </th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Budgeted cost ($)</th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Budgeted hours (H)</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map(member =>
                      pendingRow?.mode === 'edit' && pendingRow.originalId === member.id ? (
                        <TeamMemberEditRow
                          key={member.id}
                          draft={pendingRow.draft}
                          onChangeDraft={d => setPendingRow({ mode: 'edit', originalId: member.id, draft: d })}
                          onConfirm={confirmPendingRow}
                          onCancel={cancelPendingRow}
                          roleOptions={roleOptions}
                        />
                      ) : (
                        <TeamMemberViewRow
                          key={member.id}
                          member={member}
                          checked={selectedIds.has(member.id)}
                          onCheck={() => toggleSelect(member.id)}
                          onEdit={() => startEditMember(member)}
                          onDelete={() => deleteMember(member.id)}
                        />
                      )
                    )}
                    {pendingRow?.mode === 'add' && (
                      <TeamMemberEditRow
                        draft={pendingRow.draft}
                        onChangeDraft={d => setPendingRow({ mode: 'add', draft: d })}
                        onConfirm={confirmPendingRow}
                        onCancel={cancelPendingRow}
                        roleOptions={roleOptions}
                      />
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/30 border-t border-border/30">
                      <td className="px-6 py-3" />
                      <td colSpan={4} className="px-6 py-3 text-xs font-semibold text-foreground uppercase tracking-wider">Avg Engagement Rate</td>
                      <td className="px-6 py-3 text-sm font-semibold text-foreground text-right">{avgRate}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-foreground text-right">{avgAlloc}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-foreground text-right">{avgCost}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-foreground text-right">{avgHours}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={startAddMember}
                  disabled={!!pendingRow}
                  className="inline-flex items-center gap-1.5 h-8 px-4 text-sm font-medium rounded-md bg-[#0C2D55] text-white hover:bg-[#0a2447] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add member
                </button>
              </div>
            </SectionCard>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/engagements")}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button disabled={!isFormValid} onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              Create Engagement
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
