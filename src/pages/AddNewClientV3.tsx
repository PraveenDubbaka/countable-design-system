import React, { useState, useEffect, useRef } from "react";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SourceConnectionModal } from "@/components/SourceConnectionModal";
import type { AccountingProvider } from "@/lib/clientSource";
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
// True after the user tries to Add Client; required fields then show their errors
const ShowErrorsContext = React.createContext(false);

// `invalid` means "required and empty". The error only shows once the field was touched (blurred) or Add Client was attempted.
const FieldCol = ({
  label, required, invalid, hint, children, className,
}: {
  label: string; required?: boolean; invalid?: boolean; hint?: string; children: React.ReactNode; className?: string;
}) => {
  const attempted = React.useContext(ShowErrorsContext);
  const [touched, setTouched] = useState(false);
  const showError = !!invalid && (attempted || touched);
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      <label className="text-xs font-medium text-foreground">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <div onBlurCapture={() => setTouched(true)} className={showError ? "[&_input]:!border-destructive [&_button[role=combobox]]:!border-destructive" : ""}>{children}</div>
      {showError && <p className="text-xs text-destructive">Required</p>}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
};

const Segmented = ({ options, value, onChange, full }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; full?: boolean }) => (
  <div className={`rounded-[8px] border border-border overflow-hidden text-xs font-medium select-none ${full ? "flex w-full h-9" : "inline-flex w-fit"}`}>
    {options.map((o, i) => (
      <button key={o.value} type="button" onClick={() => onChange(o.value)}
        className={`${full ? "flex-1 text-center" : "px-3.5 py-2"} transition-colors ${i > 0 ? "border-l border-border" : ""} ${value === o.value ? "bg-[#1C63A6] text-white" : "text-muted-foreground hover:bg-muted"}`}>
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

export default function AddNewClientV3() {
  const navigate = useNavigate();

  // ── Flow state ──────────────────────────────────────────────────────────────
  const [entryOption, setEntryOption] = useState<"manual" | "integration">("manual");
  const [fetching, setFetching] = useState(false);
  const [attemptedAdd, setAttemptedAdd] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
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

  // "Fetching client information…" after the connect modal, then the prefill
  useEffect(() => {
    if (!fetching) return;
    const t = setTimeout(() => { applySourcePrefill(); setFetching(false); }, 2000);
    return () => clearTimeout(t);
  }, [fetching]); // eslint-disable-line react-hooks/exhaustive-deps

  const PROVIDER_TO_SOURCE: Record<AccountingProvider, string> = { quickbooks: "qbo", xero: "xero", sage: "sage" };
  const handleConnected = (provider: AccountingProvider) => {
    setSelectedSource(PROVIDER_TO_SOURCE[provider]);
    setEntryOption("integration");
    setFetching(true);
  };

  const isDirty =
    !!(clientId || legalEntityName || entityType || subCorpType || showDba || dbaName || jurisdiction || fiscalYearEnd || naics || groupName ||
      engagementPartner || engagementManager || reportingFramework || accountingSoftware || incorporationDate || businessNumber || gstRegistered ||
      extraAccounts.length || hasQuebecPersonalInfo || addressLine1 || addressLine2 || city || province || postalCode || !mailingSame ||
      mailLine1 || mailLine2 || mailCity || mailProvince || mailPostal || businessPhone || cellPhone || website || people.length ||
      (pendingPerson && (pendingPerson.draft.name || pendingPerson.draft.title || pendingPerson.draft.email || pendingPerson.draft.phone || pendingPerson.draft.portalAccess)) ||
      showPrefillBanner || selectedSource) || country !== "ca";

  const resetForm = () => {
    setClientId(""); setCountry("ca"); setEntityType(""); setSubCorpType(""); setShowDba(false); setDbaName(""); setDbaDisplay("legal-only");
    setLegalEntityName(""); setJurisdiction(""); setFiscalYearEnd(""); setNaics(""); setGroupName(""); setNewGroupInput("");
    setEngagementPartner(""); setEngagementManager(""); setReportingFramework(""); setAccountingSoftware("");
    setIncorporationDate(""); setBusinessNumber(""); setGstRegistered(""); setExtraAccounts([]); setAddingAccount(false);
    setNewAccountNumber(""); setNewAccountLabel(""); setHasQuebecPersonalInfo(false);
    setAddressLine1(""); setAddressLine2(""); setCity(""); setProvince(""); setPostalCode(""); setMailingSame(true);
    setMailLine1(""); setMailLine2(""); setMailCity(""); setMailProvince(""); setMailPostal("");
    setBusinessPhone(""); setCellPhone(""); setWebsite("");
    setPeople([]); setPendingPerson({ mode: "add", draft: blankPerson(["Primary contact"]) }); setSelectedPeople(new Set()); setPeopleSearch("");
    setShowPrefillBanner(false); setSelectedSource(""); setFetching(false); setAttemptedAdd(false);
    setEntryOption("manual");
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleAddManually = () => {
    if (isDirty) { setShowClearConfirm(true); return; }
    resetForm();
  };

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
    setAttemptedAdd(true);
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

  const addDisabled = fetching;

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
    <ShowErrorsContext.Provider value={attemptedAdd}>
    <Layout title="Add New Client">
      <div className="flex flex-col h-full overflow-hidden bg-background">

        {/* Sticky header bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 border-b border-border/60">
          <button
            onClick={() => navigate("/clients")}
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

        <div ref={scrollRef} className="flex-1 overflow-auto px-6 pb-8 pt-4 space-y-4">

            {/* How to start */}
            <div className="grid grid-cols-3 gap-3">
              <button type="button" role="radio" aria-checked={entryOption === "manual"} onClick={handleAddManually}
                className={`flex flex-col gap-1 rounded-[10px] border px-4 py-3 text-left transition-colors ${entryOption === "manual" ? "border-[#1C63A6] bg-[#1C63A6]/5" : "border-border bg-card hover:bg-muted/40"}`}>
                <span className="flex items-center gap-2">
                  <span className={`h-4 w-4 shrink-0 rounded-full border flex items-center justify-center ${entryOption === "manual" ? "border-[#1C63A6]" : "border-[#C3CBD6]"}`}>
                    {entryOption === "manual" && <span className="h-2 w-2 rounded-full bg-[#1C63A6]" />}
                  </span>
                  <span className="text-sm font-semibold text-foreground">Add manually</span>
                </span>
                <span className="text-xs text-muted-foreground pl-6">Fill in the client profile below</span>
              </button>
              <button type="button" role="radio" aria-checked={entryOption === "integration"} onClick={() => setShowConnectModal(true)}
                className={`flex flex-col gap-1 rounded-[10px] border px-4 py-3 text-left transition-colors ${entryOption === "integration" ? "border-[#1C63A6] bg-[#1C63A6]/5" : "border-border bg-card hover:bg-muted/40"}`}>
                <span className="flex items-center gap-2">
                  <span className={`h-4 w-4 shrink-0 rounded-full border flex items-center justify-center ${entryOption === "integration" ? "border-[#1C63A6]" : "border-[#C3CBD6]"}`}>
                    {entryOption === "integration" && <span className="h-2 w-2 rounded-full bg-[#1C63A6]" />}
                  </span>
                  <span className="text-sm font-semibold text-foreground">Import via integration</span>
                </span>
                <span className="text-xs text-muted-foreground pl-6">QuickBooks Online, Xero or Sage</span>
              </button>
              <div
                className="flex items-center justify-between gap-3 rounded-[10px] border-2 border-dashed border-[#8649F1]/50 bg-[#8649F1]/[0.03] px-4 py-3"
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); toast.info("Luka will fill the profile from your files"); }}
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><Sparkles className="h-4 w-4 text-[#8649F1]" />Let Luka fill this in</p>
                  <p className="text-xs text-muted-foreground">Drop last year's financial statements, T2 or articles</p>
                </div>
                <button type="button" onClick={() => toast.info("Luka will fill the profile from your files")}
                  className="shrink-0 h-9 px-3 rounded-lg border border-[#8649F1]/50 bg-card hover:bg-[#8649F1]/5 text-sm font-semibold text-[#8649F1] transition-colors">
                  Drop files here
                </button>
              </div>
            </div>

            {fetching && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 text-primary border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-base font-semibold text-foreground mb-1">Fetching client information…</p>
                  <p className="text-sm text-muted-foreground">This will only take a moment.</p>
                </div>
              </div>
            )}

            {!fetching && (<>
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
                        <Input type="date" className="w-full h-9" value={incorporationDate} onChange={e => setIncorporationDate(e.target.value)} />
                      </FieldCol>
                    )}
                    <FieldCol label={taxCfg.businessNumberLabel} hint={country === "ca" ? "9-digit CRA Business Number" : taxCfg.businessNumberHint}>
                      <div className="relative">
                        <Input className="w-full h-9" placeholder={taxCfg.businessNumberPlaceholder} value={businessNumber} onChange={e => setBusinessNumber(e.target.value)} />
                        {bnValid && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-green-600 dark:text-green-400">✓ Valid</span>}
                      </div>
                    </FieldCol>
                    <FieldCol label={country === "ca" ? "GST/HST registered" : taxCfg.salesTaxLabel}>
                      <Segmented full options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} value={gstRegistered} onChange={setGstRegistered} />
                    </FieldCol>
                    <FieldCol label="Québec personal information" hint="Triggers Law 25 Transfer Impact Assessment obligations">
                      <div className="flex items-center gap-3 h-9">
                        <Switch checked={hasQuebecPersonalInfo} onCheckedChange={setHasQuebecPersonalInfo} />
                        <span className="text-sm text-foreground">{hasQuebecPersonalInfo ? "Yes" : "No"}</span>
                      </div>
                    </FieldCol>

                    {country === "ca" && (
                      <FieldCol label="CRA program accounts" hint="Built from the BN; GST/HST appears when registered" className="col-span-2">
                        {!bnValid ? (
                          <p className="text-sm text-muted-foreground flex items-center h-8">Enter a Business Number to add program accounts</p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              {programAccounts.map(a => (
                                <span key={a.key} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-border bg-muted/40 text-xs text-foreground">
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
                                  className="inline-flex items-center h-8 px-3 rounded-full border border-dashed border-border text-xs font-medium text-muted-foreground hover:bg-muted">
                                  + Add
                                </button>
                              )}
                            </div>
                            {addingAccount && (
                              <div className="flex items-center gap-2">
                                <Input className="w-48 h-9 text-sm" placeholder="Number, e.g. PST-123456" value={newAccountNumber} onChange={e => setNewAccountNumber(e.target.value)} />
                                <Input className="w-48 h-9 text-sm" placeholder="Label, e.g. PST" value={newAccountLabel} onChange={e => setNewAccountLabel(e.target.value)} />
                                <Button type="button" className="h-9 px-3 text-sm" disabled={!newAccountNumber.trim() || !newAccountLabel.trim()}
                                  onClick={() => {
                                    setExtraAccounts(p => [...p, { id: `X${Date.now()}`, number: newAccountNumber.trim(), label: newAccountLabel.trim() }]);
                                    setNewAccountNumber(""); setNewAccountLabel(""); setAddingAccount(false);
                                  }}>
                                  Add
                                </Button>
                                <Button type="button" variant="outline" className="h-9 px-3 text-sm" onClick={() => { setNewAccountNumber(""); setNewAccountLabel(""); setAddingAccount(false); }}>
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </FieldCol>
                    )}
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
                  {attemptedAdd && !hasPrimaryContact && <p className="text-xs text-destructive mt-2">At least one Primary contact is required</p>}
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

            </>)}
          </div>

        <SourceConnectionModal
          open={showConnectModal}
          onOpenChange={setShowConnectModal}
          clientName={legalEntityName.trim() || "New client"}
          persist={false}
          onConnected={handleConnected}
        />
        <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear the form and start again?</AlertDialogTitle>
              <AlertDialogDescription>Everything you entered will be removed.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => { setShowClearConfirm(false); resetForm(); }}>Clear form</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </Layout>
    </ShowErrorsContext.Provider>
  );
}
