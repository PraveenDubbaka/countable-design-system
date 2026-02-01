import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Calendar, Users, ChevronDown, Plus, Pencil, Trash2, Search, ExternalLink, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Checkbox } from "@/components/ui/checkbox";

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
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-foreground">
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
            w-full h-9 px-3 py-2 text-sm text-foreground rounded-button outline-none transition-all duration-200
            ${disabled 
              ? 'bg-muted border-2 border-transparent text-muted-foreground opacity-60 cursor-not-allowed' 
              : error
                ? 'bg-card border-2 border-destructive'
                : 'bg-card border-2 border-[hsl(210_20%_85%)] dark:border-[hsl(220_15%_30%)] hover:border-[hsl(210_25%_75%)] dark:hover:border-[hsl(220_15%_40%)] focus:border-[hsl(207_71%_38%)] focus:ring-2 focus:ring-[hsl(207_71%_38%/0.2)] dark:focus:border-[hsl(207_80%_60%)] dark:focus:ring-[hsl(207_80%_60%/0.25)]'
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
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-foreground">
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
            w-full h-9 px-3 py-2 text-sm text-foreground rounded-button outline-none transition-all duration-200 appearance-none cursor-pointer
            ${disabled 
              ? 'bg-muted border-2 border-transparent text-muted-foreground opacity-60 cursor-not-allowed' 
              : error
                ? 'bg-card border-2 border-destructive'
                : 'bg-card border-2 border-[hsl(210_20%_85%)] dark:border-[hsl(220_15%_30%)] hover:border-[hsl(210_25%_75%)] dark:hover:border-[hsl(220_15%_40%)] focus:border-[hsl(207_71%_38%)] focus:ring-2 focus:ring-[hsl(207_71%_38%/0.2)] dark:focus:border-[hsl(207_80%_60%)] dark:focus:ring-[hsl(207_80%_60%/0.25)]'
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

// Team member row component
const TeamMemberRow = ({ 
  member, 
  onEdit, 
  onDelete 
}: { 
  member: {
    role: string;
    name: string;
    email: string;
    title: string;
    hourlyRate: number;
    timeAllocation: number;
    budgetedCost: number;
    budgetedHours: number;
  };
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <tr className="hover:bg-muted/50 transition-colors group">
    <td className="py-3 px-5">
      <Checkbox />
    </td>
    <td className="py-3 px-5 text-sm text-foreground">{member.role}</td>
    <td className="py-3 px-5 text-sm text-foreground">{member.name}</td>
    <td className="py-3 px-5 text-sm text-muted-foreground">{member.email}</td>
    <td className="py-3 px-5 text-sm text-muted-foreground">{member.title}</td>
    <td className="py-3 px-5 text-sm text-foreground text-right">{member.hourlyRate.toFixed(2)}</td>
    <td className="py-3 px-5 text-sm text-foreground text-right">{member.timeAllocation}</td>
    <td className="py-3 px-5 text-sm text-foreground text-right">{member.budgetedCost.toFixed(2)}</td>
    <td className="py-3 px-5 text-sm text-foreground text-right">{member.budgetedHours.toFixed(2)}</td>
    <td className="py-3 px-5">
      <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 hover:bg-muted rounded transition-colors group/edit">
          <Pencil className="h-4 w-4 text-muted-foreground group-hover/edit:icon-edit" />
        </button>
        <button onClick={onDelete} className="p-1.5 hover:bg-muted rounded transition-colors group/trash">
          <Trash2 className="h-4 w-4 text-muted-foreground group-hover/trash:icon-trash" />
        </button>
      </div>
    </td>
  </tr>
);

export default function CreateEngagement() {
  const navigate = useNavigate();

  // Engagement Details state
  const [engagementId, setEngagementId] = useState("REV-DEF-Nov302023");
  const [engagementTemplate, setEngagementTemplate] = useState("Review Section 2400");
  const [engagementType, setEngagementType] = useState("Review (REV)");
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

  // Team members state
  const [teamMembers] = useState([
    {
      role: "Preparer",
      name: "Jane DEF",
      email: "John_DEF@email.com",
      title: "",
      hourlyRate: 25.00,
      timeAllocation: 50,
      budgetedCost: 1000.00,
      budgetedHours: 24.66
    }
  ]);

  const [teamSearch, setTeamSearch] = useState("");

  const engagementTypeOptions = [
    { value: "Review (REV)", label: "Review (REV)" },
    { value: "Compilation (COM)", label: "Compilation (COM)" },
    { value: "Audit (AUD)", label: "Audit (AUD)" },
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
              className="flex items-center gap-1 text-primary hover:underline text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 icon-arrow" />
              Back
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {/* Engagement Details Section */}
            <SectionCard icon={<Briefcase className="h-5 w-5" />} title="Engagement Details">
              <div className="grid grid-cols-4 gap-4">
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
                <LabeledInput
                  label="Budget($)"
                  value={budget}
                  onChange={setBudget}
                  required
                  type="text"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
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

            {/* Engagement Period Section */}
            <SectionCard icon={<Calendar className="h-5 w-5" />} title="Engagement Period">
              <div className="space-y-5">
                {/* Period Type */}
                <div className="flex items-center gap-8">
                  <label className="text-sm text-muted-foreground w-24">Period Type<span className="text-destructive">*</span></label>
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
                  <label className="text-sm text-muted-foreground w-24 pt-6">Current Year<span className="text-destructive">*</span></label>
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
                  <label className="text-sm text-muted-foreground w-24 pt-6">Prior Year 1<span className="text-destructive">*</span></label>
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
                  <label className="text-sm text-muted-foreground w-24 pt-6">Prior Year 2<span className="text-destructive">*</span></label>
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
              badge={`${teamMembers.length} users`}
            >
              <div className="flex items-center justify-end gap-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground icon-search" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm bg-muted rounded-lg outline-none w-48 focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <Button variant="outline" className="h-9 px-4 text-sm bg-card hover:bg-muted">
                  <Trash2 className="h-4 w-4 mr-2 icon-trash" />
                  Delete
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-muted">
                      <th className="py-3 px-5 text-left">
                        <Checkbox />
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role <span className="text-red-500 normal-case">*</span></th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Team Member <span className="text-red-500 normal-case">*</span></th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hourly Rate ($) <span className="text-red-500 normal-case">*</span></th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time Allocation (%) <span className="text-red-500 normal-case">*</span></th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Budgeted Cost ($)</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Budgeted Hours (H)</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {teamMembers.map((member, index) => (
                      <TeamMemberRow
                        key={index}
                        member={member}
                        onEdit={() => {}}
                        onDelete={() => {}}
                      />
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted">
                      <td colSpan={4}></td>
                      <td className="py-3 px-5 text-sm font-medium text-foreground">Avg Engagement Rate</td>
                      <td className="py-3 px-5 text-sm font-medium text-foreground text-right">0.00</td>
                      <td className="py-3 px-5 text-sm font-medium text-foreground text-right">0</td>
                      <td className="py-3 px-5 text-sm font-medium text-foreground text-right">1000.00</td>
                      <td className="py-3 px-5 text-sm font-medium text-foreground text-right">0.00</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <Button className="mt-4 bg-primary hover:bg-primary/90 text-white h-10 px-4 text-sm font-medium">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
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
