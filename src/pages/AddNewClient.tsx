import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, User, FileText } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StyledCard } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Field = ({
  label, required, hint, children, className,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode; className?: string;
}) => (
  <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
    <label className="text-sm font-medium text-foreground">
      {label}{required && <span className="text-destructive ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
  </div>
);

const SectionCard = ({
  icon: Icon, title, subtitle, children, className,
}: {
  icon: React.ElementType; title: string; subtitle?: string; children: React.ReactNode; className?: string;
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
    </div>
    {children}
  </StyledCard>
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
  "non-profit": {
    hasIncorporation: true, hasYearEnd: true, hasCorporateTax: false, hasPayroll: true, hasTaxId: false,
    dbaLabel: "Operating / Charitable Name",
    dbaHint: "The name the organization uses publicly, if different from the legal registered name.",
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
  uk: {
    businessNumberLabel: "Companies House Number",
    businessNumberHint: "8-digit company registration number from Companies House.",
    businessNumberPlaceholder: "e.g., 12345678",
    corporateTaxLabel: "UTR (Unique Taxpayer Reference)",
    corporateTaxPlaceholder: "e.g., 1234567890",
    payrollLabel: "PAYE Reference",
    payrollPlaceholder: "e.g., 123/AB456",
    taxIdLabel: "UTR",
    taxIdPlaceholder: "Unique Taxpayer Reference",
    taxIdSoleProprietorLabel: "NI Number / UTR",
    taxIdSoleProprietorPlaceholder: "e.g., AB 12 34 56 C",
    salesTaxLabel: "VAT Registered",
    salesTaxNumberLabel: "VAT Registration Number",
    salesTaxNumberPlaceholder: "e.g., GB 123 4567 89",
    regionLabel: "County / Region",
    postalLabel: "Postcode",
    postalPlaceholder: "e.g., EC1A 1BB",
  },
  au: {
    businessNumberLabel: "ABN",
    businessNumberHint: "11-digit Australian Business Number.",
    businessNumberPlaceholder: "e.g., 51 824 753 556",
    corporateTaxLabel: "ACN",
    corporateTaxPlaceholder: "e.g., 123 456 789",
    payrollLabel: "Payroll Tax Registration",
    payrollPlaceholder: "Payroll Tax Registration Number",
    taxIdLabel: "TFN",
    taxIdPlaceholder: "Tax File Number",
    taxIdSoleProprietorLabel: "TFN",
    taxIdSoleProprietorPlaceholder: "Tax File Number",
    salesTaxLabel: "GST Registered",
    salesTaxNumberLabel: "ABN (for GST)",
    salesTaxNumberPlaceholder: "e.g., 51 824 753 556",
    regionLabel: "State / Territory",
    postalLabel: "Postcode",
    postalPlaceholder: "e.g., 2000",
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
  uk: [
    { value: "eng", label: "England" }, { value: "sco", label: "Scotland" },
    { value: "wal", label: "Wales" }, { value: "nir", label: "Northern Ireland" },
  ],
  au: [
    { value: "nsw", label: "New South Wales" }, { value: "vic", label: "Victoria" },
    { value: "qld", label: "Queensland" }, { value: "sa", label: "South Australia" },
    { value: "wa", label: "Western Australia" }, { value: "tas", label: "Tasmania" },
    { value: "act", label: "Australian Capital Territory" },
    { value: "nt", label: "Northern Territory" },
  ],
};

// ── Component ────────────────────────────────────────────────────────────────

export default function AddNewClient() {
  const navigate = useNavigate();
  const [entityType, setEntityType]       = useState<string>("corporation");
  const [country, setCountry]             = useState<string>("ca");
  const [subCorpType, setSubCorpType]     = useState<string>("");
  const [showDba, setShowDba]             = useState<boolean>(false);
  const [dbaName, setDbaName]             = useState<string>("");
  const [dbaDisplay, setDbaDisplay]       = useState<string>("legal-only");
  const [gstRegistered, setGstRegistered] = useState<string>("");

  const showSubEntity = entityType === "corporation" && country === "us";

  const cfg     = entityType ? ENTITY_CONFIG[entityType] : null;
  const taxCfg  = COUNTRY_TAX_CONFIG[country];
  const regions = REGION_OPTIONS[country] ?? [];
  const showSections = !!entityType;

  const isSoleProprietor = entityType === "sole-proprietor";

  const handleAdd = () => {
    toast.success("Client added");
    navigate("/clients");
  };

  return (
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
            <Button
              className="h-9 px-4 text-sm bg-primary hover:bg-primary/90 text-white"
              onClick={handleAdd}
            >
              Add
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 pb-8 pt-4 space-y-4">

          {/* ── Section 1: Entity Foundation — always visible ────────────── */}
          <SectionCard icon={Building2} title="Entity Foundation" subtitle="Start with the legal identity — this drives which other fields appear">
            {/* Core identity — 4-column: Country | Client ID | Legal Name | Entity Type */}
            <div className="grid grid-cols-4 gap-5">
              <Field label="Country" hint="Determines applicable tax identifiers and field labels.">
                <Select
                  value={country}
                  onValueChange={v => { setCountry(v); setGstRegistered(""); setSubCorpType(""); }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                    <SelectItem value="us">🇺🇸 United States</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Client ID" hint="Leave blank to auto-generate.">
                <Input placeholder="e.g., CLI-0042" />
              </Field>
              <Field label="Legal Entity Name" required>
                <Input placeholder="e.g., Acme Holdings Inc." />
              </Field>
              <Field label="Entity Type" required hint="Determines which fields and tax treatments apply.">
                <Select
                  value={entityType}
                  onValueChange={v => { setEntityType(v); setShowDba(false); setDbaName(""); setDbaDisplay("legal-only"); setGstRegistered(""); setSubCorpType(""); }}
                >
                  <SelectTrigger><SelectValue placeholder="Select entity type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                    <SelectItem value="trust">Trust</SelectItem>
                    <SelectItem value="non-profit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* US Corporation sub-type — C-Corp vs S-Corp */}
            {showSubEntity && (
              <div className="mt-5 pt-5 border-t border-border/50 grid grid-cols-4 gap-5">
                <Field label="Corporation Type" required hint="C-Corp is taxed as a separate entity; S-Corp income passes through to shareholders." className="col-span-2">
                  <Select value={subCorpType} onValueChange={setSubCorpType}>
                    <SelectTrigger><SelectValue placeholder="Select corporation type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="c-corp">C-Corp (C Corporation)</SelectItem>
                      <SelectItem value="s-corp">S-Corp (S Corporation)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            )}

            {/* DBA + Group Name — 4-column row after entity type selected */}
            {cfg && (
              <div className="mt-5 pt-5 border-t border-border/50 grid grid-cols-4 gap-5">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">{cfg.dbaLabel}</label>
                    <Switch
                      checked={showDba}
                      onCheckedChange={(v) => { setShowDba(v); if (!v) { setDbaName(""); setDbaDisplay("legal-only"); } }}
                    />
                  </div>
                  {showDba ? (
                    <Input
                      value={dbaName}
                      onChange={e => setDbaName(e.target.value)}
                      placeholder="e.g., Acme Trading Co."
                    />
                  ) : (
                    <p className="text-xs text-muted-foreground">{cfg.dbaHint}</p>
                  )}
                </div>
                {showDba && dbaName && (
                  <Field label="Display on balance sheet / cover page as" hint="Legal name is always retained in legal documents.">
                    <Select value={dbaDisplay} onValueChange={setDbaDisplay}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="legal-only">Legal name only</SelectItem>
                        <SelectItem value="dba-only">DBA only</SelectItem>
                        <SelectItem value="both">Both — legal name and DBA</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
                <Field label="Group Name" hint="Use to group related clients together.">
                  <Input placeholder="e.g., Smith Family Group" />
                </Field>
                <Field label="Engagement Partner" required>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select partner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpt">Cpt Group</SelectItem>
                      <SelectItem value="monte">Monte Heilig</SelectItem>
                      <SelectItem value="jangaiah">Jangaiah Arige</SelectItem>
                      <SelectItem value="jude">Jude Law</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            )}

            {/* Address — inside Entity Foundation */}
            <div className="mt-5 pt-5 border-t border-border/50 grid grid-cols-4 gap-5">
              <Field label="Street Address">
                <Input placeholder="123 Main Street, Suite 400" />
              </Field>
              <Field label="City">
                <Input placeholder="City" />
              </Field>
              <Field label={taxCfg.regionLabel}>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {regions.map(r => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label={taxCfg.postalLabel}>
                <Input placeholder={taxCfg.postalPlaceholder} />
              </Field>
            </div>
          </SectionCard>

          {/* ── Prompt shown before entity type is selected ─────────────── */}
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

          {/* ── Sections 2–3 appear after entity type is selected ────────── */}
          {showSections && (
            <div className="space-y-4">

              {/* ── Primary Contact ──────────────────────────────────────── */}
              <SectionCard icon={User} title="Primary Contact" subtitle="The person responsible for this client relationship">
                <div className="grid grid-cols-2 gap-5">
                  <Field label="First Name" required>
                    <Input placeholder="First Name" />
                  </Field>
                  <Field label="Last Name" required>
                    <Input placeholder="Last Name" />
                  </Field>
                  <Field label="Email" required className="col-span-2">
                    <Input type="email" placeholder="contact@company.com" />
                  </Field>
                </div>
                <div className="mt-5 pt-5 border-t border-border/50 grid grid-cols-2 gap-5">
                  <Field label="Cell Phone">
                    <Input placeholder="+1 (555) 000-0000" />
                  </Field>
                  <Field label="Business Phone">
                    <Input placeholder="+1 (555) 000-0000" />
                  </Field>
                </div>
              </SectionCard>

              {/* ── Business & Tax Details — merged ──────────────────────── */}
              <SectionCard icon={FileText} title="Business & Tax Details" subtitle={`Fiscal dates, registration numbers, and tax identifiers for ${country === "ca" ? "Canada" : country === "us" ? "United States" : country === "uk" ? "United Kingdom" : "Australia"}`}>

                {/* Fiscal dates */}
                {(cfg?.hasIncorporation || cfg?.hasYearEnd) && (
                  <div className="grid grid-cols-2 gap-5">
                    {cfg?.hasIncorporation && (
                      <Field label="Date of Incorporation" hint="The date the entity was formally registered.">
                        <Input type="date" />
                      </Field>
                    )}
                    {cfg?.hasYearEnd && (
                      <Field label="Year End Date" hint="The month and day your fiscal year closes.">
                        <Input type="date" />
                      </Field>
                    )}
                  </div>
                )}

                {/* Business number + Corporate Tax (paired when both apply) */}
                <div className={`grid grid-cols-2 gap-5${(cfg?.hasIncorporation || cfg?.hasYearEnd) ? " mt-5" : ""}`}>
                  <Field label={taxCfg.businessNumberLabel} hint={taxCfg.businessNumberHint}>
                    <Input placeholder={taxCfg.businessNumberPlaceholder} />
                  </Field>
                  {cfg?.hasCorporateTax ? (
                    <Field label={taxCfg.corporateTaxLabel}>
                      <Input placeholder={taxCfg.corporateTaxPlaceholder} />
                    </Field>
                  ) : cfg?.hasPayroll ? (
                    <Field label={taxCfg.payrollLabel}>
                      <Input placeholder={taxCfg.payrollPlaceholder} />
                    </Field>
                  ) : null}
                </div>

                {/* Payroll row — only when corporate tax already occupies the second column */}
                {cfg?.hasCorporateTax && cfg?.hasPayroll && (
                  <div className="mt-5 grid grid-cols-2 gap-5">
                    <Field label={taxCfg.payrollLabel}>
                      <Input placeholder={taxCfg.payrollPlaceholder} />
                    </Field>
                  </div>
                )}

                {/* Sales tax registration */}
                <div className="mt-5 pt-5 border-t border-border/50 grid grid-cols-2 gap-5">
                  <Field label={taxCfg.salesTaxLabel} hint="Informational — helps with sales tax treatment in future engagements.">
                    <Select value={gstRegistered} onValueChange={setGstRegistered}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  {gstRegistered === "yes" && (
                    <Field label={taxCfg.salesTaxNumberLabel}>
                      <Input placeholder={taxCfg.salesTaxNumberPlaceholder} />
                    </Field>
                  )}
                </div>

              </SectionCard>

            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
