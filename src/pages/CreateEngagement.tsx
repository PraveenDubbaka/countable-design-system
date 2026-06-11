import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import intuitQuickbooksLogo from "@/assets/intuit-quickbooks-logo.svg";
import { ArrowLeft, Briefcase, Calendar, Users, ChevronDown, Plus, Pencil, Trash2, Search, ExternalLink, X, Building2, FileText, Settings2 } from "lucide-react";
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
const FINANCIAL_STATEMENTS = [
  { key: "cashFlow", label: "Cash Flow Statement" },
  { key: "shareholdersEquity", label: "Shareholders' Equity" },
  { key: "schedulesOfExpenses", label: "Schedules of Expenses" },
  { key: "segmentReporting", label: "Segment Reporting" },
  { key: "interimFinancials", label: "Interim Financials" },
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
  badge
}: { 
  icon: React.ReactNode; 
  title: string; 
  children: React.ReactNode;
  badge?: string;
}) => (
  <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
    <div className="flex items-center gap-2 mb-5">
      <span className="text-primary">{icon}</span>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {badge && (
        <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">{badge}</span>
      )}
    </div>
    {children}
  </div>
);

interface TeamMember {
  id: string;
  role: string;
  name: string;
  email: string;
  title: string;
  hourlyRate: string;
  timeAllocation: string;
}

function calcBudgetedCost(hourlyRate: string, timeAllocation: string) {
  const rate = parseFloat(hourlyRate) || 0;
  const alloc = parseFloat(timeAllocation) || 0;
  return (rate * alloc).toFixed(2);
}

const TeamMemberRow = ({
  member,
  roleOptions,
  onChange,
  onDelete,
}: {
  member: TeamMember;
  roleOptions: string[];
  onChange: (updated: TeamMember) => void;
  onDelete: () => void;
}) => {
  const inlineInput = (field: keyof TeamMember, align = "left") => (
    <input
      value={member[field] as string}
      onChange={e => onChange({ ...member, [field]: e.target.value })}
      className={`w-full min-w-[80px] h-7 px-2 text-xs rounded border border-transparent hover:border-border focus:border-primary bg-transparent outline-none text-${align}`}
    />
  );
  return (
    <tr className="hover:bg-muted/30 transition-colors group border-b border-border">
      <td className="py-2 px-3"><Checkbox /></td>
      <td className="py-2 px-3 min-w-[160px]">
        <div className="relative">
          <select
            value={member.role}
            onChange={e => onChange({ ...member, role: e.target.value })}
            className="w-full h-7 pl-2 pr-6 text-xs rounded border border-transparent hover:border-border focus:border-primary bg-transparent outline-none appearance-none cursor-pointer"
          >
            <option value="">Select role…</option>
            {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
        </div>
      </td>
      <td className="py-2 px-3 min-w-[130px]">{inlineInput("name")}</td>
      <td className="py-2 px-3 min-w-[160px]">{inlineInput("email")}</td>
      <td className="py-2 px-3 min-w-[120px]">{inlineInput("title")}</td>
      <td className="py-2 px-3 min-w-[90px]">{inlineInput("hourlyRate", "right")}</td>
      <td className="py-2 px-3 min-w-[90px]">{inlineInput("timeAllocation", "right")}</td>
      <td className="py-2 px-3 text-xs text-right text-foreground min-w-[100px]">
        {calcBudgetedCost(member.hourlyRate, member.timeAllocation)}
      </td>
      <td className="py-2 px-3">
        <button
          onClick={onDelete}
          className="p-1 hover:bg-destructive/10 rounded opacity-40 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </button>
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

export default function CreateEngagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = (location.state as { clientName?: string; engagementType?: string } | null) ?? {};

  // Engagement Details state
  const [clientName, setClientName] = useState(prefill.clientName || "");
  const clientInfo = CLIENT_DATA[clientName] ?? null;
  const [engagementId, setEngagementId] = useState("REV-DEF-Nov302023");
  const [engagementTemplate, setEngagementTemplate] = useState("Review Section 2400");
  const [engagementType, setEngagementType] = useState(prefill.engagementType || "Review (REV)");
  const [budget, setBudget] = useState("10000.00");
  const [accountingStandards, setAccountingStandards] = useState("Section 2400 Review standards");
  const [additionalDisclosures, setAdditionalDisclosures] = useState("Statement of cash flows");

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
  const [industry, setIndustry] = useState("");
  const [accountingFramework, setAccountingFramework] = useState("");
  const [entityClassification, setEntityClassification] = useState("");
  const [firstYearAudit, setFirstYearAudit] = useState(false);
  const [financialStatements, setFinancialStatements] = useState<Set<string>>(new Set());
  const toggleStatement = (key: string) =>
    setFinancialStatements(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  // Team members — fully dynamic
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: uid(), role: "Preparer", name: "Jane DEF", email: "John_DEF@email.com", title: "", hourlyRate: "25.00", timeAllocation: "50" },
  ]);
  const addTeamMember = () =>
    setTeamMembers(prev => [...prev, { id: uid(), role: "", name: "", email: "", title: "", hourlyRate: "0.00", timeAllocation: "0" }]);
  const updateMember = (updated: TeamMember) =>
    setTeamMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
  const deleteMember = (id: string) =>
    setTeamMembers(prev => prev.filter(m => m.id !== id));

  const roleOptions = isAudit ? AUDIT_ROLES : ["Partner", "Manager", "Senior", "Staff / Assistant", "Preparer"];
  const [teamSearch, setTeamSearch] = useState("");

  const engagementTypeOptions = [
    { value: "Audit (AUD)", label: "Audit (AUD)" },
    { value: "Compilation (COM)", label: "Compilation (COM)" },
    { value: "Review (REV)", label: "Review (REV)" },
    { value: "T2 (Corporations)", label: "T2 (Corporations)" },
  ];

  const accountingStandardsOptions = [
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
                  options={disclosureOptions}
                  required
                />
              </div>
            </SectionCard>

            {/* Audit Configuration — only for Audit (AUD) */}
            {isAudit && (
              <SectionCard icon={<Settings2 className="h-5 w-5" />} title="Audit Configuration">
                {/* Row 1: Industry | Framework | Entity Classification */}
                <div className="grid grid-cols-3 gap-5">
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
                </div>

                {/* Row 2: First-year Audit toggle | Financial statements checkboxes */}
                <div className="grid grid-cols-3 gap-5 mt-5">
                  {/* First-year audit */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-foreground">First-Year Audit?</span>
                    <div className="flex items-center gap-3 mt-0.5">
                      <Switch
                        id="firstYearAudit"
                        checked={firstYearAudit}
                        onCheckedChange={setFirstYearAudit}
                      />
                      <Label htmlFor="firstYearAudit" className="text-sm text-foreground cursor-pointer">
                        {firstYearAudit ? "Yes — predecessor review required" : "No — continuing engagement"}
                      </Label>
                    </div>
                    {firstYearAudit && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        Opening balances and predecessor communication procedures will be included in the audit program.
                      </p>
                    )}
                  </div>

                  {/* Financial statements */}
                  <div className="col-span-2 flex flex-col gap-2">
                    <span className="text-xs font-medium text-foreground">Financial Statements &amp; Schedules</span>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2 mt-0.5">
                      {FINANCIAL_STATEMENTS.map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer group">
                          <Checkbox
                            checked={financialStatements.has(key)}
                            onCheckedChange={() => toggleStatement(key)}
                          />
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors">{label}</span>
                        </label>
                      ))}
                    </div>
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

            {/* Assigned Team / Roles Section */}
            <SectionCard
              icon={<Users className="h-5 w-5" />}
              title={isAudit ? "Engagement Team & Roles" : "Assigned team"}
              badge={`${teamMembers.length} member${teamMembers.length !== 1 ? "s" : ""}`}
            >
              {isAudit && (
                <p className="text-xs text-muted-foreground mb-4">
                  Add all engagement team members and assign their roles. Audit roles include partner, manager, senior, EQCR, tax reviewer, and subject matter experts. You can add as many members as required.
                </p>
              )}

              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search members…"
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    className="input-double-border pl-9 pr-3 h-8 text-sm bg-card border border-border rounded-[10px] outline-none w-44 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button onClick={addTeamMember} className="h-8 px-3 text-sm">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add {isAudit ? "Role" : "Member"}
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="py-2.5 px-3 text-left w-8"><Checkbox /></th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                        Role <span className="text-destructive normal-case font-normal">*</span>
                      </th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Name</th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                      <th className="py-2.5 px-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Rate ($/hr)</th>
                      <th className="py-2.5 px-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Alloc (%)</th>
                      <th className="py-2.5 px-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Budgeted Cost ($)</th>
                      <th className="py-2.5 px-3 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers
                      .filter(m =>
                        !teamSearch ||
                        m.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
                        m.role.toLowerCase().includes(teamSearch.toLowerCase())
                      )
                      .map(member => (
                        <TeamMemberRow
                          key={member.id}
                          member={member}
                          roleOptions={roleOptions}
                          onChange={updateMember}
                          onDelete={() => deleteMember(member.id)}
                        />
                      ))}
                    {teamMembers.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                          No team members yet — click "Add {isAudit ? "Role" : "Member"}" to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/60 border-t border-border">
                      <td colSpan={7} className="py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">Total Budgeted Cost</td>
                      <td className="py-2.5 px-3 text-xs font-bold text-foreground text-right">
                        ${teamMembers.reduce((sum, m) => sum + (parseFloat(m.hourlyRate) || 0) * (parseFloat(m.timeAllocation) || 0), 0).toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
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
            <Button>
              <Plus className="h-4 w-4" />
              Create Engagement
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
