import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, User, MapPin, FileText } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StyledCard } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    dbaHint: "The name under which the proprietor conducts business (e.g., Jane Doe Consulting).",
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

export default function AddNewClient() {
  const navigate = useNavigate();
  const [entityType, setEntityType]         = useState<string>("");
  const [dbaOption, setDbaOption]           = useState<string>("");
  const [gstRegistered, setGstRegistered]   = useState<string>("");

  const cfg          = entityType ? ENTITY_CONFIG[entityType] : null;
  const showSections = !!entityType;

  const handleAdd = () => {
    toast.success("Client added");
    navigate("/clients");
  };

  return (
    <Layout title="Add New Client" hideSidebar>
      <div className="flex flex-col h-full overflow-hidden bg-background">

        {/* Sticky header bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0 border-b border-border/60">
          <button
            onClick={() => navigate("/clients")}
            className="flex items-center gap-2 text-link font-medium text-sm hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Add New Client
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
            {/* Core identity fields */}
            <div className="grid grid-cols-2 gap-5">
              <Field label="Legal Entity Name" required>
                <Input placeholder="e.g., Acme Holdings Inc." />
              </Field>
              <Field label="Entity Type" required hint="Determines which fields and tax treatments apply.">
                <Select
                  value={entityType}
                  onValueChange={v => { setEntityType(v); setDbaOption(""); setGstRegistered(""); }}
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

            {/* DBA — only appears once entity type is known */}
            {cfg && (
              <div className="mt-5 pt-5 border-t border-border/50">
                <div className="grid grid-cols-2 gap-5 items-start">
                  <Field label={cfg.dbaLabel} hint={cfg.dbaHint}>
                    <Select value={dbaOption} onValueChange={setDbaOption}>
                      <SelectTrigger><SelectValue placeholder="Same as legal entity name" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="same">Same as legal entity name</SelectItem>
                        <SelectItem value="custom">Enter a different name…</SelectItem>
                        <SelectItem value="none">Not applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  {dbaOption === "custom" && (
                    <Field label="DBA / Operating Name" required>
                      <Input placeholder="e.g., Acme Trading Co." />
                    </Field>
                  )}
                </div>
              </div>
            )}

            {/* Optional identifiers — always at bottom of this card */}
            <div className="mt-5 pt-5 border-t border-border/50">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Optional identifiers
              </p>
              <div className="grid grid-cols-2 gap-5">
                <Field label="Client ID" hint="Alphanumeric only — leave blank to auto-generate.">
                  <Input placeholder="e.g., CLI-0042" />
                </Field>
                <Field label="Group Name" hint="Use to group related clients together.">
                  <Input placeholder="e.g., Smith Family Group" />
                </Field>
              </div>
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
                  The form adapts to show only the fields relevant to the selected entity — no guesswork.
                </p>
              </div>
            </div>
          )}

          {/* ── Sections 2–4 appear after entity type is selected ────────── */}
          {showSections && (
            <>
              {/* 2-column: Contact + Business Details */}
              <div className="grid grid-cols-2 gap-4 items-start">

                {/* ── Section 2: Primary Contact ──────────────────────────── */}
                <SectionCard icon={User} title="Primary Contact" subtitle="The person responsible for this client relationship">
                  <div className="grid grid-cols-2 gap-5">
                    <Field label="First Name" required>
                      <Input placeholder="First Name" />
                    </Field>
                    <Field label="Last Name" required>
                      <Input placeholder="Last Name" />
                    </Field>
                  </div>
                  <div className="mt-5 space-y-5">
                    <Field label="Email" required>
                      <Input type="email" placeholder="contact@company.com" />
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
                  <div className="mt-5 pt-5 border-t border-border/50 grid grid-cols-2 gap-5">
                    <Field label="Business Phone">
                      <Input placeholder="+1 (555) 000-0000" />
                    </Field>
                    <Field label="Cell Phone">
                      <Input placeholder="+1 (555) 000-0000" />
                    </Field>
                  </div>
                </SectionCard>

                {/* ── Section 3: Business & Tax Details (conditional) ──────── */}
                <SectionCard icon={FileText} title="Business Details" subtitle="Fiscal dates and regulatory identifiers">
                  <div className="space-y-5">
                    {cfg?.hasIncorporation && (
                      <Field label="Date of Incorporation" hint="The date the entity was formally registered.">
                        <Input type="date" />
                      </Field>
                    )}
                    {cfg?.hasYearEnd && (
                      <Field
                        label="Year End Date"
                        hint="The month and day your fiscal year closes. The year itself is not fixed."
                      >
                        <Input type="date" />
                      </Field>
                    )}
                    <Field label="Business Number" hint="CRA Business Number (BN) or equivalent registration number.">
                      <Input placeholder="e.g., 123456789" />
                    </Field>
                    {cfg?.hasCorporateTax && (
                      <Field label="Corporate Tax Number">
                        <Input placeholder="Corporate Tax Number" />
                      </Field>
                    )}
                    {cfg?.hasPayroll && (
                      <Field label="Payroll Account Number">
                        <Input placeholder="e.g., 123456789 RP0001" />
                      </Field>
                    )}
                    {cfg?.hasTaxId && (
                      <Field label={entityType === "sole-proprietor" ? "SIN / Tax ID" : "Tax ID"}>
                        <Input placeholder={entityType === "sole-proprietor" ? "Social Insurance Number" : "Tax ID"} />
                      </Field>
                    )}

                    {/* GST/HST — informational, always shown */}
                    <div className="pt-5 border-t border-border/50">
                      <Field
                        label="GST / HST Registered"
                        hint="Informational — helps with sales tax treatment in future engagements."
                      >
                        <Select value={gstRegistered} onValueChange={setGstRegistered}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes — registered</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="pending">Pending registration</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      {gstRegistered === "yes" && (
                        <div className="mt-4">
                          <Field label="GST / HST Number">
                            <Input placeholder="e.g., 123456789 RT0001" />
                          </Field>
                        </div>
                      )}
                    </div>
                  </div>
                </SectionCard>
              </div>

              {/* ── Section 4: Address — full width ─────────────────────── */}
              <SectionCard icon={MapPin} title="Address" subtitle="Physical or mailing address for correspondence and filings">
                <div className="grid grid-cols-4 gap-5">
                  <Field label="Street Address" className="col-span-2">
                    <Input placeholder="123 Main Street, Suite 400" />
                  </Field>
                  <Field label="City">
                    <Input placeholder="City" />
                  </Field>
                  <Field label="Province / State">
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on">Ontario</SelectItem>
                        <SelectItem value="qc">Quebec</SelectItem>
                        <SelectItem value="bc">British Columbia</SelectItem>
                        <SelectItem value="ab">Alberta</SelectItem>
                        <SelectItem value="mb">Manitoba</SelectItem>
                        <SelectItem value="sk">Saskatchewan</SelectItem>
                        <SelectItem value="ns">Nova Scotia</SelectItem>
                        <SelectItem value="nb">New Brunswick</SelectItem>
                        <SelectItem value="pe">Prince Edward Island</SelectItem>
                        <SelectItem value="nl">Newfoundland</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Country">
                    <Select defaultValue="ca">
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Postal / Zip Code">
                    <Input placeholder="e.g., M5V 3A8" />
                  </Field>
                </div>
              </SectionCard>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
