import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, User, FileText, ChevronLeft, ChevronDown, CalendarDays, Plus, CheckCircle2, X, Sparkles, Search, Trash2, Pencil, Check, MapPin, Users, SlidersHorizontal } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StyledCard } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { loadClientGroups, saveClientGroups, loadClients, saveClients, SEED_GROUPS } from "@/data/clientsData";

// Shared primitives mirrored from AddNewClient.tsx — keep in sync

const InlineField = ({
  label, required, invalid, hint, children, className,
}: {
  label: string; required?: boolean; invalid?: boolean; hint?: string; children: React.ReactNode; className?: string;
}) => (
  <div className={`flex items-start gap-4 ${className ?? ""}`}>
    <span className="text-sm font-medium text-foreground shrink-0 w-52 pt-2 leading-snug">
      {label}{required && <span className="text-destructive ml-0.5">*</span>}
    </span>
    <div className={`flex-1 ${invalid ? "[&_input]:!border-destructive [&_button]:!border-destructive" : ""}`}>
      {children}
      {invalid && <p className="text-xs text-destructive mt-1">Required</p>}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  </div>
);

const SectionCard = ({
  icon: Icon, title, subtitle, children, className, badge, headerRight,
}: {
  icon: React.ElementType; title: string; subtitle?: string; children: React.ReactNode; className?: string;
  badge?: string; headerRight?: React.ReactNode;
}) => (
  <StyledCard className={`p-6 ${className ?? ""}`}>
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {badge && <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">{badge}</span>}
      {headerRight && <div className="ml-auto">{headerRight}</div>}
    </div>
    {children}
  </StyledCard>
);

// Labels above the control, for the 2-column grids in V3
const FieldCol = ({
  label, required, invalid, hint, children, className,
}: {
  label: string; required?: boolean; invalid?: boolean; hint?: string; children: React.ReactNode; className?: string;
}) => (
  <div className={`flex flex-col gap-1 ${className ?? ""}`}>
    <label className="text-xs font-medium text-foreground">
      {label}{required && <span className="text-destructive ml-0.5">*</span>}
    </label>
    <div className={invalid ? "[&_input]:!border-destructive [&_button[role=combobox]]:!border-destructive" : ""}>{children}</div>
    {invalid && <p className="text-xs text-destructive">Required</p>}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

const Segmented = ({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) => (
  <div className="inline-flex rounded-[8px] border border-border overflow-hidden text-xs font-medium select-none w-fit">
    {options.map((o, i) => (
      <button key={o.value} type="button" onClick={() => onChange(o.value)}
        className={`px-3.5 py-2 transition-colors ${i > 0 ? "border-l border-border" : ""} ${value === o.value ? "bg-[#1C63A6] text-white" : "text-muted-foreground hover:bg-muted"}`}>
        {o.label}
      </button>
    ))}
  </div>
);

// "+1 (604) 555-0192" while typing
const formatPhone = (v: string) => {
  let d = v.replace(/\D/g, "");
  if (d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (!d) return "";
  const a = d.slice(0, 3), b = d.slice(3, 6), c = d.slice(6, 10);
  return `+1 (${a}${d.length >= 3 ? ")" : ""}${b ? ` ${b}` : ""}${c ? `-${c}` : ""}`;
};

// Short list of common NAICS codes (code — name)
const NAICS_OPTIONS = [
  { code: "211", name: "Oil and Gas Extraction" },
  { code: "212", name: "Mining and Quarrying (except Oil and Gas)" },
  { code: "236", name: "Construction of Buildings" },
  { code: "238", name: "Specialty Trade Contractors" },
  { code: "311", name: "Food Manufacturing" },
  { code: "332", name: "Fabricated Metal Product Manufacturing" },
  { code: "333", name: "Machinery Manufacturing" },
  { code: "423", name: "Merchant Wholesalers, Durable Goods" },
  { code: "441", name: "Motor Vehicle and Parts Dealers" },
  { code: "445", name: "Food and Beverage Retailers" },
  { code: "484", name: "Truck Transportation" },
  { code: "493", name: "Warehousing and Storage" },
  { code: "511", name: "Publishing Industries" },
  { code: "518", name: "Computing Infrastructure, Data Processing and Hosting" },
  { code: "522", name: "Credit Intermediation and Related Activities" },
  { code: "523", name: "Securities, Commodity Contracts and Other Financial Investments" },
  { code: "531", name: "Real Estate" },
  { code: "541211", name: "Offices of Certified Public Accountants" },
  { code: "541511", name: "Custom Computer Programming Services" },
  { code: "621", name: "Ambulatory Health Care Services" },
  { code: "622", name: "Hospitals" },
  { code: "721", name: "Accommodation" },
  { code: "722", name: "Food Services and Drinking Places" },
  { code: "813", name: "Religious, Grantmaking, Civic and Professional Organizations" },
].map(o => ({ ...o, label: `${o.code} — ${o.name}` }));

const NaicsCombobox = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const results = NAICS_OPTIONS.filter(o => !query || o.code.startsWith(query) || o.label.toLowerCase().includes(query));
  return (
    <Popover open={open} onOpenChange={o => { setOpen(o); if (!o) setQ(""); }}>
      <PopoverTrigger asChild>
        <button type="button" role="combobox" aria-expanded={open}
          className={`input-double-border flex items-center justify-between gap-2 h-9 px-3 w-full rounded-[10px] border text-sm text-left transition-all duration-200 bg-white dark:bg-card border-[#C3CBD6] dark:border-[hsl(220_15%_30%)] hover:border-[hsl(210_25%_75%)] dark:hover:border-[hsl(220_15%_40%)] ${value ? "text-foreground" : "text-muted-foreground/70"}`}>
          <span className="truncate">{value || "Search by code or name"}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-2 w-[--radix-popover-trigger-width] min-w-[280px]" align="start">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input autoFocus placeholder="Search code or name" value={q} onChange={e => setQ(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>
        <div className="max-h-56 overflow-y-auto">
          {results.length === 0 && <p className="px-2 py-2 text-xs text-muted-foreground">No matching industry</p>}
          {results.map(o => (
            <button key={o.code} type="button" onClick={() => { onChange(o.label); setOpen(false); setQ(""); }}
              className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors">
              {o.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const PEOPLE_ROLES = ["Primary contact", "Signing officer"];
type Person = { id: string; name: string; title: string; roles: string[]; email: string; phone: string; portalAccess: boolean };
type PendingPerson = { mode: "add"; draft: Person } | { mode: "edit"; originalId: string; draft: Person };

let _pid = 0;
const newPersonId = () => `P${++_pid}`;
const blankPerson = (roles: string[] = []): Person => ({ id: newPersonId(), name: "", title: "", roles, email: "", phone: "", portalAccess: false });

const PersonEditRow = ({
  draft, onChange, onConfirm, onCancel,
}: { draft: Person; onChange: (p: Person) => void; onConfirm: () => void; onCancel: () => void }) => (
  <tr className="bg-primary/[0.03] dark:bg-primary/[0.05] border-b border-border/40">
    <td className="px-4 py-2 w-10"><Checkbox disabled /></td>
    <td className="px-4 py-2 min-w-[160px]"><Input className="h-8 text-sm" placeholder="Name" value={draft.name} onChange={e => onChange({ ...draft, name: e.target.value })} /></td>
    <td className="px-4 py-2 min-w-[140px]"><Input className="h-8 text-sm" placeholder="Title" value={draft.title} onChange={e => onChange({ ...draft, title: e.target.value })} /></td>
    <td className="px-4 py-2 min-w-[220px]">
      <div className="flex flex-wrap gap-1">
        {PEOPLE_ROLES.map(r => {
          const on = draft.roles.includes(r);
          return (
            <button key={r} type="button"
              onClick={() => onChange({ ...draft, roles: on ? draft.roles.filter(x => x !== r) : [...draft.roles, r] })}
              className={`h-7 px-2.5 rounded-full border text-xs font-medium transition-colors ${on ? "border-[#1C63A6] bg-[#1C63A6]/10 text-[#1C63A6]" : "border-border text-muted-foreground hover:bg-muted"}`}>
              {r}
            </button>
          );
        })}
      </div>
    </td>
    <td className="px-4 py-2 min-w-[200px]"><Input className="h-8 text-sm" type="email" placeholder="name@company.com" value={draft.email} onChange={e => onChange({ ...draft, email: e.target.value })} /></td>
    <td className="px-4 py-2 min-w-[160px]"><Input className="h-8 text-sm" placeholder="+1 (000) 000-0000" value={draft.phone} onChange={e => onChange({ ...draft, phone: formatPhone(e.target.value) })} /></td>
    <td className="px-4 py-2"><Switch checked={draft.portalAccess} onCheckedChange={v => onChange({ ...draft, portalAccess: v })} /></td>
    <td className="px-4 py-2">
      <div className="flex items-center gap-0.5">
        <button type="button" aria-label="Confirm" onClick={onConfirm} disabled={!draft.name.trim() || !draft.email.trim()}
          className="p-1.5 hover:bg-muted rounded-lg transition-colors text-green-600 dark:text-green-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent">
          <Check className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Cancel" onClick={onCancel} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-destructive">
          <X className="h-4 w-4" />
        </button>
      </div>
    </td>
  </tr>
);

// ── Entity type config ───────────────────────────────────────────────────────

type EntityConfig = {
  hasIncorporation: boolean;
  hasYearEnd: boolean;
  hasCorporateTax: boolean;
  hasPayroll: boolean;
  hasTaxId: boolean;
  dbaLabel: string;
  dbaHint: string;
};

const ENTITY_CONFIG: Record<string, EntityConfig> = {
  corporation: {
    hasIncorporation: true, hasYearEnd: true, hasCorporateTax: true, hasPayroll: true, hasTaxId: true,
    dbaLabel: "Operating Name / DBA",
    dbaHint: "The branded name used in public-facing materials, if different from the registered legal name.",
  },
  partnership: {
    hasIncorporation: true, hasYearEnd: true, hasCorporateTax: false, hasPayroll: false, hasTaxId: true,
    dbaLabel: "Partnership Trading Name",
    dbaHint: "The name the partnership uses commercially, if distinct from the partners' combined legal names.",
  },
  "sole-proprietor": {
    hasIncorporation: false, hasYearEnd: true, hasCorporateTax: false, hasPayroll: false, hasTaxId: true,
    dbaLabel: "Business / Trading Name",
    dbaHint: "The name under which the proprietor conducts business.",
  },
  trust: {
    hasIncorporation: true, hasYearEnd: true, hasCorporateTax: false, hasPayroll: false, hasTaxId: false,
    dbaLabel: "Trust Operating Name",
    dbaHint: "An informal or shortened name used to refer to this trust, if applicable.",
  },
};

// ── Country-specific tax & field config ─────────────────────────────────────

type CountryTaxConfig = {
  businessNumberLabel: string;
  businessNumberHint: string;
  businessNumberPlaceholder: string;
  corporateTaxLabel: string;
  corporateTaxPlaceholder: string;
  payrollLabel: string;
  payrollPlaceholder: string;
  taxIdLabel: string;
  taxIdPlaceholder: string;
  taxIdSoleProprietorLabel: string;
  taxIdSoleProprietorPlaceholder: string;
  salesTaxLabel: string;
  salesTaxNumberLabel: string;
  salesTaxNumberPlaceholder: string;
  regionLabel: string;
  postalLabel: string;
  postalPlaceholder: string;
};

const COUNTRY_TAX_CONFIG: Record<string, CountryTaxConfig> = {
  ca: {
    businessNumberLabel: "Business Number (BN)",
    businessNumberHint: "CRA-issued 9-digit Business Number.",
    businessNumberPlaceholder: "e.g., 123456789",
    corporateTaxLabel: "Corporate Tax Account",
    corporateTaxPlaceholder: "e.g., 123456789 T0001",
    payrollLabel: "Payroll Account (RP)",
    payrollPlaceholder: "e.g., 123456789 RP0001",
    taxIdLabel: "Tax ID",
    taxIdPlaceholder: "Tax ID",
    taxIdSoleProprietorLabel: "SIN",
    taxIdSoleProprietorPlaceholder: "Social Insurance Number",
    salesTaxLabel: "GST / HST Registered",
    salesTaxNumberLabel: "GST / HST Number",
    salesTaxNumberPlaceholder: "e.g., 123456789 RT0001",
    regionLabel: "Province",
    postalLabel: "Postal Code",
    postalPlaceholder: "e.g., M5V 3A8",
  },
  us: {
    businessNumberLabel: "EIN",
    businessNumberHint: "Employer Identification Number (format XX-XXXXXXX).",
    businessNumberPlaceholder: "e.g., 12-3456789",
    corporateTaxLabel: "State Tax ID",
    corporateTaxPlaceholder: "State Tax ID",
    payrollLabel: "FEIN / Payroll Reference",
    payrollPlaceholder: "e.g., 12-3456789",
    taxIdLabel: "Tax ID",
    taxIdPlaceholder: "Tax ID",
    taxIdSoleProprietorLabel: "SSN / ITIN",
    taxIdSoleProprietorPlaceholder: "e.g., XXX-XX-XXXX",
    salesTaxLabel: "Sales Tax Registered",
    salesTaxNumberLabel: "Sales Tax Registration No.",
    salesTaxNumberPlaceholder: "State Sales Tax Number",
    regionLabel: "State",
    postalLabel: "ZIP Code",
    postalPlaceholder: "e.g., 10001",
  },
};

// ── Region options per country ───────────────────────────────────────────────

const REGION_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
  ca: [
    { value: "on", label: "Ontario" }, { value: "qc", label: "Quebec" },
    { value: "bc", label: "British Columbia" }, { value: "ab", label: "Alberta" },
    { value: "mb", label: "Manitoba" }, { value: "sk", label: "Saskatchewan" },
    { value: "ns", label: "Nova Scotia" }, { value: "nb", label: "New Brunswick" },
    { value: "pe", label: "Prince Edward Island" }, { value: "nl", label: "Newfoundland" },
    { value: "nt", label: "Northwest Territories" }, { value: "nu", label: "Nunavut" },
    { value: "yt", label: "Yukon" },
  ],
  us: [
    { value: "al", label: "Alabama" }, { value: "ak", label: "Alaska" },
    { value: "az", label: "Arizona" }, { value: "ar", label: "Arkansas" },
    { value: "ca", label: "California" }, { value: "co", label: "Colorado" },
    { value: "ct", label: "Connecticut" }, { value: "de", label: "Delaware" },
    { value: "fl", label: "Florida" }, { value: "ga", label: "Georgia" },
    { value: "hi", label: "Hawaii" }, { value: "id", label: "Idaho" },
    { value: "il", label: "Illinois" }, { value: "in", label: "Indiana" },
    { value: "ia", label: "Iowa" }, { value: "ks", label: "Kansas" },
    { value: "ky", label: "Kentucky" }, { value: "la", label: "Louisiana" },
    { value: "me", label: "Maine" }, { value: "md", label: "Maryland" },
    { value: "ma", label: "Massachusetts" }, { value: "mi", label: "Michigan" },
    { value: "mn", label: "Minnesota" }, { value: "ms", label: "Mississippi" },
    { value: "mo", label: "Missouri" }, { value: "mt", label: "Montana" },
    { value: "ne", label: "Nebraska" }, { value: "nv", label: "Nevada" },
    { value: "nh", label: "New Hampshire" }, { value: "nj", label: "New Jersey" },
    { value: "nm", label: "New Mexico" }, { value: "ny", label: "New York" },
    { value: "nc", label: "North Carolina" }, { value: "nd", label: "North Dakota" },
    { value: "oh", label: "Ohio" }, { value: "ok", label: "Oklahoma" },
    { value: "or", label: "Oregon" }, { value: "pa", label: "Pennsylvania" },
    { value: "ri", label: "Rhode Island" }, { value: "sc", label: "South Carolina" },
    { value: "sd", label: "South Dakota" }, { value: "tn", label: "Tennessee" },
    { value: "tx", label: "Texas" }, { value: "ut", label: "Utah" },
    { value: "vt", label: "Vermont" }, { value: "va", label: "Virginia" },
    { value: "wa", label: "Washington" }, { value: "wv", label: "West Virginia" },
    { value: "wi", label: "Wisconsin" }, { value: "wy", label: "Wyoming" },
  ],
};

// ── Entity sub-type options (country × entity-type) ─────────────────────────

type SubTypeOption = { value: string; label: string };
type SubTypeConfig = { label: string; hint: string; options: SubTypeOption[] };

const SUB_TYPE_CONFIG: Record<string, SubTypeConfig> = {
  "ca-corporation": {
    label: "Corporation Type",
    hint: "Determines applicable tax rules under the Income Tax Act.",
    options: [
      { value: "ccpc", label: "CCPC — Canadian-Controlled Private Corporation" },
      { value: "non-ccpc", label: "Non-CCPC / Public Corporation" },
      { value: "professional-corp", label: "Professional Corporation" },
    ],
  },
  "us-corporation": {
    label: "Corporation Type",
    hint: "C-Corp is taxed as a separate entity; S-Corp income passes through to shareholders.",
    options: [
      { value: "c-corp", label: "C-Corp (C Corporation)" },
      { value: "s-corp", label: "S-Corp (S Corporation)" },
    ],
  },
  "ca-partnership": {
    label: "Partnership Type",
    hint: "Determines liability exposure and T5013 filing requirements.",
    options: [
      { value: "gp", label: "General Partnership (GP)" },
      { value: "lp", label: "Limited Partnership (LP)" },
      { value: "llp", label: "Limited Liability Partnership (LLP)" },
    ],
  },
  "us-partnership": {
    label: "Partnership Type",
    hint: "Determines liability exposure and filing requirements.",
    options: [
      { value: "gp", label: "General Partnership (GP)" },
      { value: "lp", label: "Limited Partnership (LP)" },
      { value: "llp", label: "Limited Liability Partnership (LLP)" },
      { value: "llc", label: "Limited Liability Company (LLC)" },
    ],
  },
  "ca-trust": {
    label: "Trust Type",
    hint: "Determines trust taxation rules and T3 filing obligations.",
    options: [
      { value: "family", label: "Family / Discretionary Trust" },
      { value: "alter-ego", label: "Alter Ego Trust" },
      { value: "spousal", label: "Spousal / Joint Spousal Trust" },
      { value: "testamentary", label: "Testamentary Trust / Estate" },
    ],
  },
  "us-trust": {
    label: "Trust Type",
    hint: "Determines revocability, filing, and tax treatment.",
    options: [
      { value: "revocable", label: "Revocable Living Trust" },
      { value: "irrevocable", label: "Irrevocable Trust" },
      { value: "testamentary", label: "Testamentary Trust" },
      { value: "special-needs", label: "Special Needs Trust" },
    ],
  },
  "ca-sole-proprietor": {
    label: "Structure",
    hint: "Determines applicable deductions and T1 reporting schedule.",
    options: [
      { value: "individual", label: "Individual / Sole Proprietor" },
      { value: "professional", label: "Professional Practice" },
    ],
  },
  "us-sole-proprietor": {
    label: "Structure",
    hint: "Determines Schedule C filing and self-employment tax treatment.",
    options: [
      { value: "individual", label: "Individual / Sole Proprietor" },
      { value: "smllc", label: "Single-Member LLC (SMLLC)" },
    ],
  },
};

// ── Source connection labels ─────────────────────────────────────────────────

const SOURCE_CONNECTIONS: Array<{ value: string; label: string }> = [
  { value: "qbo", label: "QuickBooks Online" },
  { value: "xero", label: "Xero" },
  { value: "sage", label: "Sage" },
];

// ── Month/Day picker ─────────────────────────────────────────────────────────

const MONTHS_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_DAYS  = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const MonthDayPicker = ({
  value,
  onChange,
  placeholder = "e.g., Dec 31",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"month" | "day">("month");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (!o) setStep("month");
  };

  const handleMonthClick = (m: number) => {
    setSelectedMonth(m);
    setStep("day");
  };

  const handleDayClick = (d: number) => {
    if (selectedMonth === null) return;
    onChange(`${MONTHS_ABBR[selectedMonth]} ${d}`);
    setOpen(false);
    setStep("month");
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`input-double-border flex items-center gap-2 h-9 px-3 w-full rounded-[10px] border text-sm text-left transition-all duration-200 bg-white dark:bg-card border-[#C3CBD6] dark:border-[hsl(220_15%_30%)] hover:border-[hsl(210_25%_75%)] dark:hover:border-[hsl(220_15%_40%)] ${value ? "text-foreground" : "text-muted-foreground/70"}`}
        >
          <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>{value || placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        {step === "month" ? (
          <>
            <p className="text-xs font-medium text-muted-foreground mb-2 text-center">Select Month</p>
            <div className="grid grid-cols-3 gap-1">
              {MONTHS_ABBR.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMonthClick(i)}
                  className={`py-1.5 text-sm rounded-md transition-colors font-medium text-center ${
                    selectedMonth === i
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1 mb-2">
              <button
                type="button"
                onClick={() => setStep("month")}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <p className="text-xs font-medium flex-1 text-center">
                {selectedMonth !== null ? MONTHS_ABBR[selectedMonth] : ""} — Select Day
              </p>
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from(
                { length: selectedMonth !== null ? MONTH_DAYS[selectedMonth] : 31 },
                (_, i) => i + 1
              ).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDayClick(d)}
                  className="h-7 w-7 text-xs rounded-md transition-colors hover:bg-primary hover:text-primary-foreground text-foreground font-medium text-center"
                >
                  {d}
                </button>
              ))}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

// ── Component ────────────────────────────────────────────────────────────────

type EntryMode = "choose" | "manual" | "source-connecting" | "source-connected";

const SOURCE_CARDS = [
  { value: "qbo", label: "QuickBooks Online" },
  { value: "xero", label: "Xero" },
  { value: "sage", label: "Sage" },
];

const TEAM_LIST = ["Cpt Group", "Monte Heilig", "Jangaiah Arige", "Jude Law"];

const INDUSTRY_TYPES = [
  "Construction & Real Estate",
  "Financial Services",
  "Healthcare & Life Sciences",
  "Hospitality & Tourism",
  "Manufacturing",
  "Mining & Resources",
  "Not-for-Profit",
  "Oil & Gas",
  "Professional Services",
  "Retail & Consumer",
  "Technology",
  "Transportation & Logistics",
];

// Icon-only marks cropped from the real brand assets (dropping the pre-baked
// button chrome/wordmark) so all three "Connect to X" buttons can share one
// consistent button shell instead of three differently-sized graphics.
const QuickBooksIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="m30.77,61.54c16.99,0,30.77-13.78,30.77-30.77S47.76,0,30.77,0,0,13.78,0,30.77s13.77,30.77,30.77,30.77Z" fill="#2ca01c"/>
    <path d="m20.51,18.8c-6.61,0-11.97,5.36-11.97,11.97s5.35,11.96,11.97,11.96h1.71v-4.44h-1.71c-4.15,0-7.52-3.37-7.52-7.52,0-4.15,3.37-7.52,7.52-7.52h4.11v23.25c0,2.45,1.99,4.44,4.44,4.44V18.8h-8.55,0Zm20.52,23.93c6.61,0,11.97-5.36,11.97-11.96s-5.35-11.96-11.97-11.96h-1.71v4.44h1.71c4.15,0,7.52,3.37,7.52,7.52s-3.37,7.52-7.52,7.52h-4.11V15.04c0-2.45-1.99-4.44-4.44-4.44v32.13h8.55s0,0,0,0Z" fill="#fff"/>
  </svg>
);

const XeroIcon = ({ className }: { className?: string }) => (
  <svg viewBox="25 7 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M39.5 34C46.4036 34 52 28.4036 52 21.5C52 14.5964 46.4036 9 39.5 9C32.5964 9 27 14.5964 27 21.5C27 28.4036 32.5964 34 39.5 34Z" fill="#1AB4D7"/>
    <path d="M32.9835 21.4643L35.1168 19.3258C35.1875 19.2537 35.227 19.1583 35.227 19.0571C35.227 18.8461 35.0555 18.6748 34.8446 18.6748C34.7418 18.6748 34.6455 18.7151 34.5729 18.7886C34.5726 18.7891 32.4415 20.9189 32.4415 20.9189L30.3007 18.7854C30.2284 18.7141 30.1325 18.6748 30.0309 18.6748C29.8202 18.6748 29.6487 18.846 29.6487 19.0568C29.6487 19.1595 29.6897 19.256 29.7634 19.3287L31.8963 21.4613L29.7645 23.5971C29.6895 23.6709 29.6487 23.7676 29.6487 23.8708C29.6487 24.0817 29.8202 24.2528 30.0309 24.2528C30.1327 24.2528 30.2286 24.2133 30.3007 24.1412L32.4382 22.0065L34.5676 24.1334C34.6432 24.2115 34.7406 24.2531 34.8446 24.2531C35.0553 24.2531 35.2267 24.0817 35.2267 23.8708C35.2267 23.7691 35.1873 23.6735 35.1156 23.6014L32.9835 21.4643Z" fill="white"/>
    <path d="M45.6653 21.4635C45.6653 21.8465 45.9767 22.158 46.3602 22.158C46.7428 22.158 47.0543 21.8465 47.0543 21.4635C47.0543 21.0804 46.7428 20.7689 46.3602 20.7689C45.9767 20.7689 45.6653 21.0804 45.6653 21.4635Z" fill="white"/>
    <path d="M44.3481 21.464C44.3481 20.3549 45.2503 19.4525 46.3595 19.4525C47.4682 19.4525 48.3707 20.3549 48.3707 21.464C48.3707 22.5728 47.4682 23.4749 46.3595 23.4749C45.2503 23.4749 44.3481 22.5728 44.3481 21.464ZM43.5568 21.464C43.5568 23.0092 44.8141 24.2663 46.3595 24.2663C47.9049 24.2663 49.1629 23.0092 49.1629 21.464C49.1629 19.9186 47.9049 18.6611 46.3595 18.6611C44.8141 18.6611 43.5568 19.9186 43.5568 21.464Z" fill="white"/>
    <path d="M43.3578 18.709L43.2403 18.7086C42.8872 18.7086 42.5468 18.82 42.2624 19.0391C42.2249 18.8676 42.0717 18.7386 41.8891 18.7386C41.679 18.7386 41.5106 18.907 41.5101 19.1175C41.5101 19.1183 41.5114 23.838 41.5114 23.838C41.5119 24.0482 41.6834 24.219 41.8936 24.219C42.1038 24.219 42.2752 24.0482 42.2758 23.8375C42.2758 23.8366 42.2759 20.935 42.2759 20.935C42.2759 19.9676 42.3644 19.5769 43.1931 19.4734C43.2696 19.4639 43.353 19.4653 43.3533 19.4653C43.5801 19.4576 43.7412 19.3017 43.7412 19.0912C43.7412 18.8804 43.5692 18.709 43.3578 18.709Z" fill="white"/>
    <path d="M36.0188 21.0025C36.0188 20.9921 36.0196 20.9812 36.0201 20.9704C36.242 20.0932 37.0365 19.4441 37.9826 19.4441C38.9402 19.4441 39.7419 20.1092 39.9524 21.0025H36.0188ZM40.7351 20.9304C40.5704 20.1506 40.1435 19.51 39.4934 19.0987C38.5431 18.4953 37.2882 18.5287 36.3703 19.1815C35.6216 19.7141 35.1894 20.5854 35.1894 21.483C35.1894 21.7081 35.2165 21.9352 35.273 22.1588C35.5557 23.271 36.5118 24.1129 37.6517 24.2524C37.99 24.2934 38.3192 24.2738 38.6601 24.1855C38.9531 24.1142 39.2366 23.9954 39.4978 23.828C39.7689 23.6537 39.9954 23.4239 40.2147 23.1488C40.2192 23.1438 40.2236 23.1393 40.2281 23.134C40.3803 22.9452 40.3521 22.6766 40.1848 22.5485C40.0437 22.4403 39.8068 22.3965 39.6204 22.6352C39.5803 22.6923 39.5356 22.751 39.4864 22.8097C39.3382 22.9735 39.1543 23.1322 38.934 23.2552C38.6536 23.405 38.3341 23.4906 37.9945 23.4925C36.8827 23.4801 36.2878 22.7041 36.0762 22.1502C36.0393 22.0468 36.0108 21.9395 35.9909 21.829C35.9883 21.8083 35.9864 21.7884 35.9856 21.77C36.2155 21.77 39.9752 21.7694 39.9752 21.7694C40.5221 21.7579 40.8165 21.3718 40.7351 20.9304Z" fill="white"/>
  </svg>
);

const SageIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <rect width="32" height="32" rx="7" fill="#000000" />
    <text x="16" y="22.5" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="19" fill="#ffffff">S</text>
  </svg>
);

function ConnectSourceButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 w-full rounded-lg border border-border bg-[#F4F4F4] hover:bg-muted text-sm font-semibold text-foreground transition-colors flex items-center justify-center gap-2"
    >
      <span className="w-6 h-6 shrink-0">{icon}</span>
      {label}
    </button>
  );
}

export default function AddNewClientV3() {
  const navigate = useNavigate();

  // ── Flow state ──────────────────────────────────────────────────────────────
  const [entryMode, setEntryMode] = useState<EntryMode>("choose");
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [showPrefillBanner, setShowPrefillBanner] = useState(false);

  // ── Entity Foundation ───────────────────────────────────────────────────────
  const [clientId, setClientId] = useState("");
  const [country, setCountry] = useState<string>("ca");
  const [entityType, setEntityType] = useState<string>("");
  const [subCorpType, setSubCorpType] = useState<string>("");
  const [showDba, setShowDba] = useState<boolean>(false);
  const [dbaName, setDbaName] = useState<string>("");
  const [dbaDisplay, setDbaDisplay] = useState<string>("legal-only");
  const [legalEntityName, setLegalEntityName] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [fiscalYearEnd, setFiscalYearEnd] = useState<string>("");
  const [naics, setNaics] = useState("");
  const [groupName, setGroupName] = useState<string>("");
  const [clientGroups, setClientGroups] = useState<string[]>(() => loadClientGroups());
  const [newGroupInput, setNewGroupInput] = useState<string>("");

  // ── Firm Defaults ───────────────────────────────────────────────────────────
  const [engagementPartner, setEngagementPartner] = useState<string>("");
  const [engagementManager, setEngagementManager] = useState<string>("");
  const [reportingFramework, setReportingFramework] = useState<string>("");
  const [accountingSoftware, setAccountingSoftware] = useState<string>("");

  // ── Business & Tax ──────────────────────────────────────────────────────────
  const [incorporationDate, setIncorporationDate] = useState<string>("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [gstRegistered, setGstRegistered] = useState<string>("");
  const [extraAccounts, setExtraAccounts] = useState<{ id: string; number: string; label: string }[]>([]);
  const [addingAccount, setAddingAccount] = useState(false);
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newAccountLabel, setNewAccountLabel] = useState("");
  const [hasQuebecPersonalInfo, setHasQuebecPersonalInfo] = useState<boolean>(false);

  // ── Business Address ────────────────────────────────────────────────────────
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [mailingSame, setMailingSame] = useState(true);
  const [mailLine1, setMailLine1] = useState("");
  const [mailLine2, setMailLine2] = useState("");
  const [mailCity, setMailCity] = useState("");
  const [mailProvince, setMailProvince] = useState("");
  const [mailPostal, setMailPostal] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [cellPhone, setCellPhone] = useState("");
  const [website, setWebsite] = useState("");

  // ── People ──────────────────────────────────────────────────────────────────
  const [people, setPeople] = useState<Person[]>([]);
  const [pendingPerson, setPendingPerson] = useState<PendingPerson | null>(() => ({ mode: "add", draft: blankPerson(["Primary contact"]) }));
  const [selectedPeople, setSelectedPeople] = useState<Set<string>>(new Set());
  const [peopleSearch, setPeopleSearch] = useState("");

  const subTypeCfg = entityType ? (SUB_TYPE_CONFIG[`${country}-${entityType}`] ?? null) : null;
  const cfg = entityType ? ENTITY_CONFIG[entityType] : null;
  const taxCfg = COUNTRY_TAX_CONFIG[country];
  const regions = REGION_OPTIONS[country] ?? [];
  const jurisdictionOptions = country === "ca" ? [{ value: "federal", label: "Federal — CBCA" }, ...regions] : regions;
  const showSections = !!entityType;

  const incLabel: Record<string, string> = {
    corporation: "Date of Incorporation",
    partnership: "Date of Partnership",
    trust: "Date of Trust Formation",
    "sole-proprietor": "Date of Registration",
  };

  const bnDigits = businessNumber.replace(/\D/g, "");
  const bnValid = bnDigits.length === 9;

  // CRA program accounts built from the BN
  const programAccounts: { key: string; code: string; label: string; removableId?: string }[] = [
    ...(cfg?.hasCorporateTax ? [{ key: "rc", code: "RC0001", label: "Corporate tax" }] : []),
    ...(gstRegistered === "yes" ? [{ key: "rt", code: "RT0001", label: "GST/HST" }] : []),
    ...(cfg?.hasPayroll ? [{ key: "rp", code: "RP0001", label: "Payroll" }] : []),
    ...extraAccounts.map(a => ({ key: a.id, code: a.number, label: a.label, removableId: a.id })),
  ];
  const accountNumber = (code: string) => (bnValid ? `${bnDigits} ${code}` : code);

  // ── Source prefill simulation ────────────────────────────────────────────────
  const applySourcePrefill = () => {
    const sourceName = SOURCE_CARDS.find(s => s.value === selectedSource)?.label ?? selectedSource;
    setCountry("ca");
    setEntityType("corporation");
    setShowDba(false);
    setDbaName("");
    setLegalEntityName("Northline Precision Manufacturing Inc.");
    setPeople([{ id: newPersonId(), name: "David Chen", title: "", roles: ["Primary contact"], email: "david.chen@northline.ca", phone: formatPhone("6045550192"), portalAccess: false }]);
    setPendingPerson(null);
    setBusinessPhone(formatPhone("6045550192"));
    setAddressLine1("120 Industrial Parkway");
    setCity("Mississauga");
    setProvince("on");
    setPostalCode("L5T 2B3");
    setWebsite("https://northlineprecision.ca");
    setFiscalYearEnd("Dec 31");
    setBusinessNumber("123456789");
    setGstRegistered("yes");
    setShowPrefillBanner(true);
    toast.success(`Client information imported from ${sourceName}`);
  };

  useEffect(() => {
    if (entryMode !== "source-connecting") return;
    const t1 = setTimeout(() => { applySourcePrefill(); }, 2000);
    const t2 = setTimeout(() => { setEntryMode("manual"); }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [entryMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── People handlers ─────────────────────────────────────────────────────────
  const confirmPerson = () => {
    if (!pendingPerson) return;
    if (pendingPerson.mode === "add") setPeople(prev => [...prev, pendingPerson.draft]);
    else setPeople(prev => prev.map(p => (p.id === pendingPerson.originalId ? pendingPerson.draft : p)));
    setPendingPerson(null);
  };
  const startAddPerson = () => { if (!pendingPerson) setPendingPerson({ mode: "add", draft: blankPerson() }); };
  const startEditPerson = (p: Person) => { if (!pendingPerson) setPendingPerson({ mode: "edit", originalId: p.id, draft: { ...p } }); };
  const deletePerson = (id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id));
    setSelectedPeople(prev => { const n = new Set(prev); n.delete(id); return n; });
  };
  const deleteSelectedPeople = () => {
    setPeople(prev => prev.filter(p => !selectedPeople.has(p.id)));
    setSelectedPeople(new Set());
  };
  const filteredPeople = people.filter(p => {
    const q = peopleSearch.trim().toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.title.toLowerCase().includes(q);
  });
  const hasPrimaryContact = people.some(p => p.roles.includes("Primary contact"));
  const primaryContact = people.find(p => p.roles.includes("Primary contact"));

  const handleAdd = (mode: "add" | "invite") => {
    if (!hasPrimaryContact) {
      toast.error("Add at least one person with the Primary contact role");
      return;
    }
    const resolvedGroup = groupName === "__new__" ? newGroupInput.trim() : groupName;
    if (resolvedGroup && !clientGroups.includes(resolvedGroup)) {
      const updated = [...clientGroups, resolvedGroup];
      saveClientGroups(updated);
      setClientGroups(updated);
    }
    const newId = clientId.trim() || `CLI-${Date.now()}`;
    const contactName = primaryContact?.name ?? "";
    const newClient = {
      id: newId,
      entityName: legalEntityName.split(' ').slice(0, 2).join(' '),
      legalEntityName,
      entityType: entityType || 'Corporation',
      status: mode === "invite" ? 'Pending' as const : 'Invite Now' as const,
      integration: selectedSource ? (selectedSource as 'xero' | 'quickbooks' | 'connect') : 'none' as const,
      contactName,
      contactPerson: contactName,
      engagementPartner,
      email: primaryContact?.email ?? "",
      repository: 'Repository',
      assignedPartner: '',
      assignedTeam: null,
      businessPhone: businessPhone || null,
      cellPhone: cellPhone || null,
      clientCountry: country as 'ca' | 'us',
      industryType: undefined,
      groupName: resolvedGroup || undefined,
      incorporationDate: cfg?.hasIncorporation && incorporationDate ? incorporationDate : undefined,
      hasQuebecPersonalInfo,
      engagements: [],
      // V3 fields
      dbaName: showDba && dbaName ? dbaName : undefined,
      dbaDisplay,
      subType: subCorpType || undefined,
      jurisdiction: jurisdiction || undefined,
      fiscalYearEnd: fiscalYearEnd || undefined,
      naics: naics || undefined,
      engagementManager: engagementManager || undefined,
      reportingFramework: reportingFramework || undefined,
      accountingSoftware: accountingSoftware || undefined,
      businessNumber: businessNumber || undefined,
      gstRegistered: gstRegistered || undefined,
      craAccounts: country === "ca" ? programAccounts.map(a => ({ number: a.removableId ? a.code : accountNumber(a.code), label: a.label })) : undefined,
      address: { line1: addressLine1, line2: addressLine2, city, region: province, postal: postalCode },
      mailingSame,
      mailingAddress: mailingSame ? undefined : { line1: mailLine1, line2: mailLine2, city: mailCity, region: mailProvince, postal: mailPostal },
      website: website || undefined,
      people,
    };
    const existing = loadClients();
    saveClients([...existing, newClient]);
    toast.success(mode === "invite" ? "Client added and invite sent" : "Client added");
    navigate("/clients");
  };

  // Header back action varies by screen
  const handleHeaderBack = () => {
    if (entryMode === "choose") { navigate("/clients"); return; }
    if (entryMode === "source-connecting") { setEntryMode("choose"); return; }
    if (entryMode === "manual") {
      if (legalEntityName) { setEntryMode("choose"); } else { navigate("/clients"); }
    }
  };

  const addDisabled = entryMode === "choose" || entryMode === "source-connecting";

  const legalPreview = legalEntityName.trim() || "Legal entity name";
  const dbaPreview = dbaName.trim() || "Operating name";
  const deliverableCards = [
    { value: "legal-only", label: "Legal name only", title: legalPreview },
    { value: "dba-only", label: "Operating name only", title: dbaPreview },
    { value: "both", label: "Both", title: `${legalPreview} o/a ${dbaPreview}` },
  ];

  // Called as a function (not used as a component) so the inputs keep focus between renders
  const renderAddressFields = ({
    line1, setLine1, line2, setLine2, cityV, setCityV, region, setRegion, postal, setPostal,
  }: {
    line1: string; setLine1: (v: string) => void; line2: string; setLine2: (v: string) => void;
    cityV: string; setCityV: (v: string) => void; region: string; setRegion: (v: string) => void; postal: string; setPostal: (v: string) => void;
  }) => (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      <FieldCol label="Address line 1"><Input placeholder="Address line 1" value={line1} onChange={e => setLine1(e.target.value)} /></FieldCol>
      <FieldCol label="Address line 2"><Input placeholder="Address line 2" value={line2} onChange={e => setLine2(e.target.value)} /></FieldCol>
      <div className="col-span-2 grid grid-cols-3 gap-x-6">
        <FieldCol label="City"><Input placeholder="City" value={cityV} onChange={e => setCityV(e.target.value)} /></FieldCol>
        <FieldCol label={taxCfg.regionLabel}>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {regions.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </FieldCol>
        <FieldCol label={taxCfg.postalLabel}><Input placeholder={taxCfg.postalPlaceholder} value={postal} onChange={e => setPostal(e.target.value)} /></FieldCol>
      </div>
    </div>
  );

  return (
    <Layout title="Add New Client">
      <div className="flex flex-col h-full overflow-hidden bg-background">

        {/* Sticky header bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 border-b border-border/60">
          <button
            onClick={handleHeaderBack}
            className="flex items-center gap-2 text-link font-medium text-sm hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </button>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 px-4 text-sm" onClick={() => navigate("/clients")}>
              Cancel
            </Button>
            <div className="inline-flex">
              <Button
                className="h-9 px-4 text-sm bg-[#1C63A6] hover:bg-[#1a5a9e] text-white rounded-r-none"
                disabled={addDisabled}
                onClick={() => handleAdd("add")}
              >
                Add Client
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="More add options"
                    className="h-9 w-9 px-0 bg-[#1C63A6] hover:bg-[#1a5a9e] text-white rounded-l-none border-l-white/30"
                    disabled={addDisabled}
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

        {/* ── SCREEN: choose ─────────────────────────────────────────────────── */}
        {entryMode === "choose" && (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="max-w-5xl w-full">
              <h2 className="text-lg font-semibold text-foreground mb-8">Import via integration</h2>
              <div className="flex gap-10 items-stretch">
                {/* Connect integration */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-1">Select client accounting source</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    We'll connect to your client's accounting software and import their information.
                  </p>
                  <div className="flex flex-col gap-3">
                    <ConnectSourceButton
                      icon={<QuickBooksIcon className="w-full h-full" />}
                      label="Connect to QuickBooks"
                      onClick={() => { setSelectedSource("qbo"); setEntryMode("source-connecting"); }}
                    />
                    <ConnectSourceButton
                      icon={<XeroIcon className="w-full h-full" />}
                      label="Connect to Xero"
                      onClick={() => { setSelectedSource("xero"); setEntryMode("source-connecting"); }}
                    />
                    <ConnectSourceButton
                      icon={<SageIcon className="w-full h-full" />}
                      label="Connect to Sage"
                      onClick={() => { setSelectedSource("sage"); setEntryMode("source-connecting"); }}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px bg-border" />

                {/* Manual fallback */}
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-sm font-semibold text-foreground mb-4">
                    Fill in client details yourself using the form.
                  </p>
                  <button
                    type="button"
                    onClick={() => setEntryMode("manual")}
                    className="self-start h-11 px-4 rounded-lg border border-border bg-card hover:bg-muted/40 text-sm font-semibold text-foreground transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Manually
                  </button>
                </div>

                {/* Divider */}
                <div className="w-px bg-border" />

                {/* Let Luka fill this in */}
                <div
                  className="flex-1 flex flex-col justify-center rounded-lg border-2 border-dashed border-[#8649F1]/50 bg-[#8649F1]/[0.03] p-5"
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); toast.info("Luka will fill the profile from your files"); }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-[#8649F1]" />
                    <p className="text-sm font-semibold text-foreground">Let Luka fill this in</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Drop last year's financial statements, T2 or articles</p>
                  <button
                    type="button"
                    onClick={() => toast.info("Luka will fill the profile from your files")}
                    className="self-start h-11 px-4 rounded-lg border border-[#8649F1]/50 bg-card hover:bg-[#8649F1]/5 text-sm font-semibold text-[#8649F1] transition-colors"
                  >
                    Drop files here
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SCREEN: source-connecting ───────────────────────────────────────── */}
        {(entryMode === "source-connecting" || entryMode === "source-connected") && (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 text-primary border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-base font-semibold text-foreground mb-1">
                Connecting to {SOURCE_CARDS.find(s => s.value === selectedSource)?.label ?? selectedSource}...
              </p>
              <p className="text-sm text-muted-foreground">Fetching client information. This will only take a moment.</p>
            </div>
          </div>
        )}

        {/* ── SCREEN: manual (form) ───────────────────────────────────────────── */}
        {entryMode === "manual" && (
          <div className="flex-1 overflow-auto px-6 pb-8 pt-4 space-y-4">

            {/* Prefill banner */}
            {showPrefillBanner && (
              <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span className="flex-1">
                  Client information imported from {SOURCE_CARDS.find(s => s.value === selectedSource)?.label ?? selectedSource}. Review the details below and make any changes before saving.
                </span>
                <button
                  type="button"
                  onClick={() => setShowPrefillBanner(false)}
                  className="shrink-0 hover:opacity-70 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* ── Section 1: Entity Foundation ──────────────────────────────── */}
            <SectionCard
              icon={Building2}
              title="Entity Foundation"
              subtitle="Start with the legal identity — this drives which other fields appear"
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <FieldCol label="Client ID" hint="Leave blank to auto-generate.">
                  <Input placeholder="e.g., CLI-0042" value={clientId} onChange={e => setClientId(e.target.value)} />
                </FieldCol>
                <FieldCol label="Country" required>
                  <Select value={country} onValueChange={v => { setCountry(v); setGstRegistered(""); setSubCorpType(""); setJurisdiction(""); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldCol>
                <FieldCol label="Legal Entity Name" required invalid={!legalEntityName} className="col-span-2">
                  <Input placeholder="e.g., Acme Holdings Inc." value={legalEntityName} onChange={e => setLegalEntityName(e.target.value)} />
                </FieldCol>

                {/* DBA */}
                <div className="col-span-2 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={showDba}
                      onCheckedChange={v => { setShowDba(v); if (!v) { setDbaName(""); setDbaDisplay("legal-only"); } }}
                    />
                    <span className="text-sm font-medium text-foreground">Operates under a different name (DBA)</span>
                  </div>
                  {showDba ? (
                    <FieldCol label={cfg ? cfg.dbaLabel : "Operating Name / DBA"}>
                      <Input value={dbaName} onChange={e => setDbaName(e.target.value)} placeholder="e.g., Acme Trading Co." />
                    </FieldCol>
                  ) : (
                    <p className="text-xs text-muted-foreground">{cfg ? cfg.dbaHint : "The branded name used in public-facing materials, if different from the registered legal name."}</p>
                  )}
                </div>

                {/* Name on deliverables */}
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-medium text-foreground">Name on deliverables</label>
                  <div role="radiogroup" aria-label="Name on deliverables" className={`grid grid-cols-3 gap-3 ${showDba ? "" : "opacity-50"}`}>
                    {deliverableCards.map(c => {
                      const selected = dbaDisplay === c.value;
                      return (
                        <button key={c.value} type="button" role="radio" aria-checked={selected} disabled={!showDba}
                          onClick={() => setDbaDisplay(c.value)}
                          className={`flex flex-col gap-1.5 rounded-[10px] border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed ${selected ? "border-[#1C63A6] bg-[#1C63A6]/5" : "border-border bg-card hover:bg-muted/40"}`}>
                          <span className="flex items-center gap-2">
                            <span className={`h-4 w-4 shrink-0 rounded-full border flex items-center justify-center ${selected ? "border-[#1C63A6]" : "border-[#C3CBD6]"}`}>
                              {selected && <span className="h-2 w-2 rounded-full bg-[#1C63A6]" />}
                            </span>
                            <span className="text-sm font-medium text-foreground">{c.label}</span>
                          </span>
                          <span className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">
                            <span className="block font-semibold text-foreground truncate" data-testid="deliverable-preview">{c.title}</span>
                            <span className="block">Statement of financial position</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {showDba && dbaDisplay === "dba-only" && (
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Assurance reports still need the legal name</p>
                  )}
                  {!showDba && <p className="text-xs text-muted-foreground">Turn on DBA to choose how the name appears.</p>}
                </div>

                <FieldCol label="Entity Type" required invalid={!entityType}>
                  <Select
                    value={entityType}
                    onValueChange={v => {
                      setEntityType(v);
                      setShowDba(false);
                      setDbaName("");
                      setDbaDisplay("legal-only");
                      setGstRegistered("");
                      setSubCorpType("");
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Select entity type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                      <SelectItem value="trust">Trust</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldCol>
                {subTypeCfg ? (
                  <FieldCol label={subTypeCfg.label} required invalid={!subCorpType} hint={subTypeCfg.hint}>
                    <Select value={subCorpType} onValueChange={setSubCorpType}>
                      <SelectTrigger><SelectValue placeholder={`Select ${subTypeCfg.label.toLowerCase()}`} /></SelectTrigger>
                      <SelectContent>
                        {subTypeCfg.options.map(o => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldCol>
                ) : <div />}

                <FieldCol label="Jurisdiction of incorporation">
                  <Select value={jurisdiction} onValueChange={setJurisdiction}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {jurisdictionOptions.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FieldCol>
                <FieldCol label="Fiscal Year-End (Month/Day)" hint="Not mandatory — can be set at the engagement level.">
                  <MonthDayPicker value={fiscalYearEnd} onChange={setFiscalYearEnd} />
                </FieldCol>

                <FieldCol label="Industry (NAICS)" hint="Used to filter engagements by sector and seed industry-specific risks in the risk register.">
                  <NaicsCombobox value={naics} onChange={setNaics} />
                </FieldCol>
                <FieldCol label="Client group" hint="Use to group related clients together.">
                  <div className="flex gap-2 items-center">
                    <Select
                      value={groupName}
                      onValueChange={v => {
                        const resolved = v === "__none__" ? "" : v;
                        setGroupName(resolved);
                        if (resolved !== "__new__") setNewGroupInput("");
                      }}
                    >
                      <SelectTrigger className={groupName === "__new__" ? "flex-none w-44" : "flex-1"}>
                        <SelectValue placeholder="Select a group (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__" className="text-muted-foreground">No group</SelectItem>
                        {clientGroups.map(g => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                        <SelectItem value="__new__">New group...</SelectItem>
                      </SelectContent>
                    </Select>
                    {groupName && groupName !== "__new__" && (
                      <button
                        type="button"
                        aria-label="Clear group selection"
                        onClick={() => setGroupName("")}
                        className="shrink-0 h-9 w-9 flex items-center justify-center rounded-[10px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    {groupName === "__new__" && (
                      <Input placeholder="Group name" value={newGroupInput} onChange={e => setNewGroupInput(e.target.value)} className="flex-1" autoFocus />
                    )}
                  </div>
                </FieldCol>
              </div>
            </SectionCard>

            {/* Placeholder shown before entity type is selected */}
            {!showSections && (
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">Select an entity type above to continue</p>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    The form adapts to show only the fields relevant to the selected entity and country.
                  </p>
                </div>
              </div>
            )}

            {showSections && (
              <div className="space-y-4">

                {/* ── Firm Defaults ─────────────────────────────────────────── */}
                <SectionCard icon={SlidersHorizontal} title="Firm Defaults" subtitle="Pre-filled on every new engagement for this client">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <FieldCol label="Engagement Partner" required invalid={!engagementPartner}>
                      <Select value={engagementPartner} onValueChange={setEngagementPartner}>
                        <SelectTrigger><SelectValue placeholder="Select partner" /></SelectTrigger>
                        <SelectContent>
                          {TEAM_LIST.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FieldCol>
                    <FieldCol label="Engagement manager">
                      <Select value={engagementManager} onValueChange={setEngagementManager}>
                        <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
                        <SelectContent>
                          {TEAM_LIST.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FieldCol>
                    <FieldCol label="Reporting framework">
                      <Select value={reportingFramework} onValueChange={setReportingFramework}>
                        <SelectTrigger><SelectValue placeholder="Select framework" /></SelectTrigger>
                        <SelectContent>
                          {["ASPE", "ASNPO", "IFRS", "PSAS"].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FieldCol>
                    <FieldCol label="Accounting software">
                      <Select value={accountingSoftware} onValueChange={setAccountingSoftware}>
                        <SelectTrigger><SelectValue placeholder="Select software" /></SelectTrigger>
                        <SelectContent>
                          {["QuickBooks Online", "Xero", "Sage", "Desktop software", "CSV / Excel"].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FieldCol>
                  </div>
                </SectionCard>

                {/* ── Business & Tax Details ────────────────────────────────── */}
                <SectionCard
                  icon={FileText}
                  title="Business & Tax Details"
                  subtitle={`Registration numbers and tax identifiers for ${country === "ca" ? "Canada" : "United States"}`}
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {cfg?.hasIncorporation && (
                      <FieldCol label={incLabel[entityType] ?? "Date of Incorporation"} required invalid={!incorporationDate}>
                        <Input type="date" className="w-44" value={incorporationDate} onChange={e => setIncorporationDate(e.target.value)} />
                      </FieldCol>
                    )}
                    <FieldCol label={taxCfg.businessNumberLabel} hint={taxCfg.businessNumberHint}>
                      <div className="relative">
                        <Input placeholder={taxCfg.businessNumberPlaceholder} value={businessNumber} onChange={e => setBusinessNumber(e.target.value)} className={bnValid ? "pr-20" : ""} />
                        {bnValid && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-green-600 dark:text-green-400">✓ Valid</span>}
                      </div>
                    </FieldCol>
                    <FieldCol label={taxCfg.salesTaxLabel} hint="Informational — helps with sales tax treatment in future engagements.">
                      <Segmented options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} value={gstRegistered} onChange={setGstRegistered} />
                    </FieldCol>

                    {country === "ca" && (
                      <div className="col-span-2 flex flex-col gap-2">
                        <label className="text-xs font-medium text-foreground">CRA program accounts</label>
                        <div className="flex flex-wrap items-center gap-2">
                          {programAccounts.map(a => (
                            <span key={a.key} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-border bg-muted/40 text-xs text-foreground">
                              {bnValid && !a.removableId && <span className="text-muted-foreground">{bnDigits}</span>}
                              <span className="font-semibold">{a.code}</span>
                              <span className="text-muted-foreground">· {a.label}</span>
                              {a.removableId && (
                                <button type="button" aria-label={`Remove ${a.label}`} className="hover:text-destructive"
                                  onClick={() => setExtraAccounts(p => p.filter(x => x.id !== a.removableId))}>
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </span>
                          ))}
                          {!addingAccount && (
                            <button type="button" onClick={() => setAddingAccount(true)}
                              className="h-8 px-3 rounded-full border border-dashed border-border text-xs font-medium text-muted-foreground hover:bg-muted">
                              + Add
                            </button>
                          )}
                        </div>
                        {addingAccount && (
                          <div className="flex items-center gap-2">
                            <Input className="w-48 h-8 text-sm" placeholder="Number, e.g. PST-123456" value={newAccountNumber} onChange={e => setNewAccountNumber(e.target.value)} />
                            <Input className="w-48 h-8 text-sm" placeholder="Label, e.g. PST" value={newAccountLabel} onChange={e => setNewAccountLabel(e.target.value)} />
                            <Button type="button" className="h-8 px-3 text-xs" disabled={!newAccountNumber.trim() || !newAccountLabel.trim()}
                              onClick={() => {
                                setExtraAccounts(p => [...p, { id: `X${Date.now()}`, number: newAccountNumber.trim(), label: newAccountLabel.trim() }]);
                                setNewAccountNumber(""); setNewAccountLabel(""); setAddingAccount(false);
                              }}>
                              Add
                            </Button>
                            <Button type="button" variant="outline" className="h-8 px-3 text-xs" onClick={() => { setNewAccountNumber(""); setNewAccountLabel(""); setAddingAccount(false); }}>
                              Cancel
                            </Button>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">Built from the Business Number; the GST/HST account appears when GST/HST registered is Yes.</p>
                      </div>
                    )}
                  </div>
                  {/* ── Compliance flags ──────────────────────────────── */}
                  <div className="mt-5 pt-5 border-t border-border space-y-4">
                    <div className="flex items-start gap-4">
                      <span className="text-sm font-medium text-foreground shrink-0 w-52 pt-0.5 leading-snug">
                        Quebec Personal Info
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Switch checked={hasQuebecPersonalInfo} onCheckedChange={setHasQuebecPersonalInfo} />
                          <span className="text-sm text-foreground">
                            {hasQuebecPersonalInfo ? "Yes" : "No"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Enable if this client involves personal information of Quebec residents. Triggers Law 25 Transfer Impact Assessment obligations for the firm.
                        </p>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* ── Business Address ──────────────────────────────────────── */}
                <SectionCard icon={MapPin} title="Business Address" subtitle="Where the client operates and how to reach them">
                  <div className="space-y-4">
                    {renderAddressFields({
                      line1: addressLine1, setLine1: setAddressLine1, line2: addressLine2, setLine2: setAddressLine2,
                      cityV: city, setCityV: setCity, region: province, setRegion: setProvince, postal: postalCode, setPostal: setPostalCode,
                    })}
                    <div className="flex items-center gap-3">
                      <Switch checked={mailingSame} onCheckedChange={setMailingSame} />
                      <span className="text-sm font-medium text-foreground">Mailing address is the same</span>
                    </div>
                    {!mailingSame && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Mailing address</p>
                        {renderAddressFields({
                          line1: mailLine1, setLine1: setMailLine1, line2: mailLine2, setLine2: setMailLine2,
                          cityV: mailCity, setCityV: setMailCity, region: mailProvince, setRegion: setMailProvince, postal: mailPostal, setPostal: setMailPostal,
                        })}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <FieldCol label="Business phone">
                        <Input placeholder="+1 (000) 000-0000" value={businessPhone} onChange={e => setBusinessPhone(formatPhone(e.target.value))} />
                      </FieldCol>
                      <FieldCol label="Cell phone">
                        <Input placeholder="+1 (000) 000-0000" value={cellPhone} onChange={e => setCellPhone(formatPhone(e.target.value))} />
                      </FieldCol>
                      <FieldCol label="Website (optional)">
                        <Input type="url" placeholder="https://example.com" value={website} onChange={e => setWebsite(e.target.value)} />
                      </FieldCol>
                    </div>
                  </div>
                </SectionCard>

                {/* ── People ────────────────────────────────────────────────── */}
                <SectionCard
                  icon={Users}
                  title="People"
                  subtitle="Who signs, and who sends the documents"
                  badge={`${people.length} User`}
                  headerRight={
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input type="text" placeholder="Search" value={peopleSearch} onChange={e => setPeopleSearch(e.target.value)}
                          className="input-double-border pl-9 pr-3 h-9 text-sm bg-card border border-border rounded-[10px] outline-none w-40 text-foreground placeholder:text-muted-foreground" />
                      </div>
                      <Button variant="outline" onClick={deleteSelectedPeople} disabled={selectedPeople.size === 0} className="h-9 px-3 gap-1.5 text-sm">
                        <Trash2 className="h-4 w-4" />Delete
                      </Button>
                    </div>
                  }
                >
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/60 border-b border-border">
                          <th className="text-left px-4 py-3 w-10">
                            <Checkbox
                              checked={people.length > 0 && selectedPeople.size === people.length}
                              onCheckedChange={v => setSelectedPeople(v ? new Set(people.map(p => p.id)) : new Set())}
                            />
                          </th>
                          <th className="text-left px-4 py-3 text-sm font-semibold text-foreground whitespace-nowrap">Name<span className="text-destructive ml-0.5">*</span></th>
                          <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Title</th>
                          <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Roles</th>
                          <th className="text-left px-4 py-3 text-sm font-semibold text-foreground whitespace-nowrap">Email<span className="text-destructive ml-0.5">*</span></th>
                          <th className="text-left px-4 py-3 text-sm font-semibold text-foreground whitespace-nowrap">Business Phone</th>
                          <th className="text-left px-4 py-3 text-sm font-semibold text-foreground whitespace-nowrap">Portal access</th>
                          <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPeople.map(p =>
                          pendingPerson?.mode === "edit" && pendingPerson.originalId === p.id ? (
                            <PersonEditRow key={p.id} draft={pendingPerson.draft}
                              onChange={d => setPendingPerson({ mode: "edit", originalId: p.id, draft: d })}
                              onConfirm={confirmPerson} onCancel={() => setPendingPerson(null)} />
                          ) : (
                            <tr key={p.id} className="hover:bg-muted/40 transition-colors border-b border-border/40">
                              <td className="px-4 py-3 w-10">
                                <Checkbox checked={selectedPeople.has(p.id)}
                                  onCheckedChange={() => setSelectedPeople(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })} />
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap">{p.name}</td>
                              <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{p.title || "—"}</td>
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                  {p.roles.length === 0 ? <span className="text-muted-foreground">—</span> : p.roles.map(r => (
                                    <span key={r} className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{r}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">{p.email}</td>
                              <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{p.phone || "—"}</td>
                              <td className="px-4 py-3">
                                <Switch checked={p.portalAccess} aria-label={`Portal access for ${p.name}`}
                                  onCheckedChange={v => setPeople(prev => prev.map(x => (x.id === p.id ? { ...x, portalAccess: v } : x)))} />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-0.5">
                                  <button type="button" aria-label={`Edit ${p.name}`} onClick={() => startEditPerson(p)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                                    <Pencil className="h-4 w-4 text-link" />
                                  </button>
                                  <button type="button" aria-label={`Delete ${p.name}`} onClick={() => deletePerson(p.id)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                        {pendingPerson?.mode === "add" && (
                          <PersonEditRow draft={pendingPerson.draft}
                            onChange={d => setPendingPerson({ mode: "add", draft: d })}
                            onConfirm={confirmPerson} onCancel={() => setPendingPerson(null)} />
                        )}
                      </tbody>
                    </table>
                  </div>
                  {!hasPrimaryContact && <p className="text-xs text-destructive mt-2">At least one Primary contact is required</p>}
                  <div className="mt-4">
                    <button type="button" onClick={startAddPerson} disabled={!!pendingPerson}
                      className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold rounded-[10px] bg-[#1C63A6] text-white hover:bg-[#1a5a9e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      <Plus className="h-4 w-4" />Add person
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Portal access is set here; no invite is sent unless you choose Add and Invite.</p>
                </SectionCard>

              </div>
            )}

          </div>
        )}

      </div>
    </Layout>
  );
}
