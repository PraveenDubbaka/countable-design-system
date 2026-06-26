import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Info, AlertTriangle, ChevronRight } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { AutoFillBanner } from "@/components/AutoFillBanner";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

type YN = "Y" | "N" | "";
type RefField = RefDoc[];

interface SimpleField { response: string; wpRef: RefField }
interface InquiryField { who: string; byWhom: string; date: string }

interface RevenueRow { id: string; source: string; nature: string; revenue: string; geoMarket: string; complexity: string }
interface CustomerRow { id: string; name: string; type: "C" | "S" | ""; riskAreas: string }
interface FacilityRow { id: string; address: string; purpose: string; inventoryValue: string; employees: string }
interface ThirdPartyRow { id: string; nameDesc: string; contact: string; isServiceOrg: YN; reasoning: string }
interface StakeholderRow { id: string; name: string; pctOwned: string; involvement: string }
interface TcwgRow { id: string; name: string; memberSince: string; onFinance: YN; comments: string }
interface ManagementRow { id: string; name: string; position: string; qualifications: string }
interface AdvisorRow { id: string; contactPerson: string; company: string; email: string; adviceType: string }
interface LawRow { id: string; law: string; nonCompliance: string; materialEffect: YN }
interface InvestmentRow { id: string; name: string; amount: string; consolidated: YN; purpose: string; terms: string }
interface FinancingRow { id: string; creditor: string; amount: string; rate: string; maturity: string; terms: string }

interface Data510 {
  // A – Nature of Business
  entityType: SimpleField;
  entityActivity: SimpleField;
  revenues: SimpleField;
  revenueRows: RevenueRow[];
  marketConditions: SimpleField;
  relationships: SimpleField;
  customerRows: CustomerRow[];
  facilities: SimpleField;
  facilityRows: FacilityRow[];
  thirdParties: SimpleField;
  thirdPartyRows: ThirdPartyRow[];
  rAndD: SimpleField;
  conclusionA: string;

  // B – Ownership and Governance
  keyStakeholders: SimpleField;
  stakeholderRows: StakeholderRow[];
  tcwgWho: SimpleField;
  financeCommittee: SimpleField;
  tcwgMandate: SimpleField;
  tcwgRows: TcwgRow[];
  keyManagement: SimpleField;
  managementRows: ManagementRow[];
  operatingStyle: SimpleField;
  keyAdvisors: SimpleField;
  advisorRows: AdvisorRow[];
  perfIncentives: SimpleField;
  conclusionB: string;

  // C – Laws and Regulations
  lawRows: LawRow[];
  correspondence: SimpleField;
  newLegislation: SimpleField;
  inquiryC: InquiryField;
  conclusionC: string;

  // D – Accounting Policies
  afrf: SimpleField;
  sigPolicies: SimpleField;
  revenueRecognition: SimpleField;
  lackGuidance: SimpleField;
  policyChoice: SimpleField;
  unusualTransactions: SimpleField;
  inquiryD: InquiryField;
  conclusionD: string;

  // E – Investments
  entityStructure: SimpleField;
  majorInvestments: SimpleField;
  investmentRows: InvestmentRow[];
  acquisitions: SimpleField;
  offBalance: SimpleField;
  conclusionE: string;

  // F – Financing
  debtStructure: SimpleField;
  financingRows: FinancingRow[];
  derivatives: SimpleField;
  imposedTargets: SimpleField;
  financingChanges: SimpleField;
  conclusionF: string;

  // G – Measurement
  budgetsForecasts: SimpleField;
  perfMeasures: SimpleField;
  externalTargets: SimpleField;
  perfComparisons: SimpleField;
  conclusionG: string;

  // Overall
  overallConclusion: string;
  notes: string;
  concluded: boolean;
  concludedOn: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);
const emptyField = (): SimpleField => ({ response: "", wpRef: [] });
const emptyInquiry = (): InquiryField => ({ who: "", byWhom: "", date: "" });

const emptyRevenueRow = (): RevenueRow => ({ id: uid(), source: "", nature: "", revenue: "", geoMarket: "", complexity: "" });
const emptyCustomerRow = (): CustomerRow => ({ id: uid(), name: "", type: "", riskAreas: "" });
const emptyFacilityRow = (): FacilityRow => ({ id: uid(), address: "", purpose: "", inventoryValue: "", employees: "" });
const emptyThirdPartyRow = (): ThirdPartyRow => ({ id: uid(), nameDesc: "", contact: "", isServiceOrg: "", reasoning: "" });
const emptyStakeholderRow = (): StakeholderRow => ({ id: uid(), name: "", pctOwned: "", involvement: "" });
const emptyTcwgRow = (): TcwgRow => ({ id: uid(), name: "", memberSince: "", onFinance: "", comments: "" });
const emptyManagementRow = (): ManagementRow => ({ id: uid(), name: "", position: "", qualifications: "" });
const emptyAdvisorRow = (): AdvisorRow => ({ id: uid(), contactPerson: "", company: "", email: "", adviceType: "" });
const emptyLawRow = (): LawRow => ({ id: uid(), law: "", nonCompliance: "", materialEffect: "" });
const emptyInvestmentRow = (): InvestmentRow => ({ id: uid(), name: "", amount: "", consolidated: "", purpose: "", terms: "" });
const emptyFinancingRow = (): FinancingRow => ({ id: uid(), creditor: "", amount: "", rate: "", maturity: "", terms: "" });

function buildDefault(): Data510 {
  return {
    entityType: emptyField(), entityActivity: emptyField(), revenues: emptyField(),
    revenueRows: [emptyRevenueRow()],
    marketConditions: emptyField(), relationships: emptyField(),
    customerRows: [emptyCustomerRow()],
    facilities: emptyField(),
    facilityRows: [emptyFacilityRow()],
    thirdParties: emptyField(),
    thirdPartyRows: [emptyThirdPartyRow()],
    rAndD: emptyField(), conclusionA: "",
    keyStakeholders: emptyField(),
    stakeholderRows: [emptyStakeholderRow()],
    tcwgWho: emptyField(), financeCommittee: emptyField(), tcwgMandate: emptyField(),
    tcwgRows: [emptyTcwgRow()],
    keyManagement: emptyField(),
    managementRows: [emptyManagementRow()],
    operatingStyle: emptyField(), keyAdvisors: emptyField(),
    advisorRows: [emptyAdvisorRow()],
    perfIncentives: emptyField(), conclusionB: "",
    lawRows: [emptyLawRow()],
    correspondence: emptyField(), newLegislation: emptyField(),
    inquiryC: emptyInquiry(), conclusionC: "",
    afrf: emptyField(), sigPolicies: emptyField(), revenueRecognition: emptyField(),
    lackGuidance: emptyField(), policyChoice: emptyField(), unusualTransactions: emptyField(),
    inquiryD: emptyInquiry(), conclusionD: "",
    entityStructure: emptyField(), majorInvestments: emptyField(),
    investmentRows: [emptyInvestmentRow()],
    acquisitions: emptyField(), offBalance: emptyField(), conclusionE: "",
    debtStructure: emptyField(),
    financingRows: [emptyFinancingRow()],
    derivatives: emptyField(), imposedTargets: emptyField(), financingChanges: emptyField(), conclusionF: "",
    budgetsForecasts: emptyField(), perfMeasures: emptyField(), externalTargets: emptyField(),
    perfComparisons: emptyField(), conclusionG: "",
    overallConclusion: "", notes: "", concluded: false, concludedOn: "",
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FieldRow({ label, sublabel, field, locked, onChange }: {
  label: string; sublabel?: string;
  field: SimpleField; locked: boolean;
  onChange: (f: SimpleField) => void;
}) {
  return (
    <tr className="group hover:bg-muted/30 transition-colors align-top">
      <td className="border border-border px-5 py-3 text-sm text-foreground w-[38%]">
        <span>{label}</span>
        {sublabel && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{sublabel}</p>}
      </td>
      <td className="border border-border px-4 py-3">
        <Textarea
          disabled={locked}
          value={field.response}
          onChange={e => onChange({ ...field, response: e.target.value })}
          placeholder="Enter response…"
          className="min-h-[56px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
        />
      </td>
      <td className="border border-border px-4 py-3 text-center w-[100px]">
        <RefButton
          reference={field.wpRef}
          onAttach={doc => onChange({ ...field, wpRef: [...field.wpRef, doc] })}
          onRemove={i => onChange({ ...field, wpRef: field.wpRef.filter((_, idx) => idx !== i) })}
          disabled={locked}
        />
      </td>
    </tr>
  );
}

function TableCard({ title, onAdd, children }: {
  title: string; onAdd: () => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</span>
        <button onClick={onAdd} className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
          <Plus className="h-3 w-3" /> Add row
        </button>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function DeleteCell({ onDelete, locked }: { onDelete: () => void; locked: boolean }) {
  return (
    <td className="border border-border px-2 py-2 text-center w-8">
      {!locked && (
        <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 transition-all">
          <Trash2 className="h-3 w-3 text-destructive" />
        </button>
      )}
    </td>
  );
}

const INQUIRY_WHO_ROLES = ['CEO', 'CFO', 'COO', 'Controller', 'VP Finance', 'Managing Director', 'Board Chair', 'Audit Committee Chair', 'Board Member', 'Director', 'Other'];
const INQUIRY_AUDITOR_OPTIONS = ['Elena Sokolova — Partner', 'Priya Raman — Staff', 'Marcus Chen — CMS'];

function RequiredInquiryBanner({ inquiry, locked, onChange }: {
  inquiry: InquiryField; locked: boolean;
  onChange: (f: InquiryField) => void;
}) {
  return (
    <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 px-4 py-3">
      <div className="flex items-center gap-1.5 mb-3">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wide">Required Inquiries</span>
        <span className="text-xs text-amber-700 dark:text-amber-400 ml-1">— to be completed every period</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs font-medium text-amber-800 dark:text-amber-400 mb-1">Who interviewed</p>
          <Select value={inquiry.who} onValueChange={v => onChange({ ...inquiry, who: v })} disabled={locked}>
            <SelectTrigger className="h-8 text-sm bg-white dark:bg-background border-amber-200 dark:border-amber-700 focus:ring-amber-400">
              <SelectValue placeholder="Select name / role" />
            </SelectTrigger>
            <SelectContent>
              {INQUIRY_WHO_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <p className="text-xs font-medium text-amber-800 dark:text-amber-400 mb-1">By whom</p>
          <Select value={inquiry.byWhom} onValueChange={v => onChange({ ...inquiry, byWhom: v })} disabled={locked}>
            <SelectTrigger className="h-8 text-sm bg-white dark:bg-background border-amber-200 dark:border-amber-700 focus:ring-amber-400">
              <SelectValue placeholder="Select auditor" />
            </SelectTrigger>
            <SelectContent>
              {INQUIRY_AUDITOR_OPTIONS.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <p className="text-xs font-medium text-amber-800 dark:text-amber-400 mb-1">Date</p>
          <Input
            type="date"
            disabled={locked}
            value={inquiry.date}
            onChange={e => onChange({ ...inquiry, date: e.target.value })}
            className="h-8 text-sm bg-white dark:bg-background border-amber-200 dark:border-amber-700 focus-visible:ring-amber-400"
          />
        </div>
      </div>
    </div>
  );
}

function SectionConclusion({ value, sectionLetter, locked, onChange }: {
  value: string; sectionLetter: string; locked: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-md border border-border bg-primary/[0.02] px-4 py-3.5 space-y-2">
      <div className="flex items-start gap-2">
        <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <p className="text-xs font-semibold text-primary">
          Section {sectionLetter} conclusion — Identify risk factors and carry forward to Form 520.
        </p>
      </div>
      <Textarea
        disabled={locked}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Document any risk factors identified for this section…"
        className="min-h-[72px] text-sm resize-none bg-background"
      />
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
      <div className="px-6 py-3.5 bg-card border-b border-border">
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="border border-border px-5 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-[38%]">Document</th>
              <th className="border border-border px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Responses / Comments</th>
              <th className="border border-border px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-[100px]">W/P Ref.</th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── TABS ───────────────────────────────────────────────────────────────────────

// ── Main Component ─────────────────────────────────────────────────────────────

export function Audit510Worksheet({ isUS = false }: { isUS?: boolean }) {
  const { engagementId } = useParams<{ engagementId: string }>();
  const ctx = useEngagementContext();
  const storageKey = `audit-510-data-${engagementId ?? (isUS ? "us" : "ca")}`;

  const [data, setData] = useState<Data510>(() => {
    const saved = readJsonFromLocalStorage<Data510 | null>(storageKey, null);
    if (!saved) return buildDefault();
    const def = buildDefault();
    return { ...def, ...saved };
  });

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 600);
    return () => clearTimeout(t);
  }, [data, storageKey]);

  const locked = data.concluded;

  function setField<K extends keyof Data510>(key: K, val: Data510[K]) {
    setData(d => ({ ...d, [key]: val }));
  }

  function sf(key: keyof Data510) {
    return {
      field: data[key] as SimpleField,
      locked,
      onChange: (f: SimpleField) => setField(key, f as Data510[typeof key]),
    };
  }

  // ── Row list helpers ──────────────────────────────────────────────────────────

  function addRow<T>(key: keyof Data510, empty: () => T) {
    setData(d => ({ ...d, [key]: [...(d[key] as T[]), empty()] }));
  }

  function updateRow<T>(key: keyof Data510, idx: number, patch: Partial<T>) {
    setData(d => {
      const list = [...(d[key] as T[])];
      list[idx] = { ...list[idx], ...patch };
      return { ...d, [key]: list };
    });
  }

  function deleteRow<T>(key: keyof Data510, idx: number) {
    setData(d => ({ ...d, [key]: (d[key] as T[]).filter((_, i) => i !== idx) }));
  }

  // ── Section A ─────────────────────────────────────────────────────────────────

  const SectionA = (
    <div className="space-y-5">
      <SectionCard title="A. Nature of Business">
        <FieldRow label="Type of entity" sublabel="E.g., public, private, public interest entity, etc. If public, indicate where shares/debt are listed." {...sf("entityType")} />
        <FieldRow label="What the entity does and the industry in which it operates." {...sf("entityActivity")} />
        <FieldRow label="Sources of revenues." sublabel="Complete the table below." {...sf("revenues")} />
      </SectionCard>

      <TableCard title="Revenue sources" onAdd={() => addRow("revenueRows", emptyRevenueRow)}>
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-muted/60 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
              <th className="border border-border px-4 py-2.5 text-left">Source of Revenue</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Nature of Products / Services</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border w-32">Approx. Revenue ($ or %)</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Geographical Market</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Areas of Complexity / Subjectivity</th>
              <th className="border border-border w-8" />
            </tr>
          </thead>
          <tbody>
            {data.revenueRows.map((row, i) => (
              <tr key={row.id} className="group hover:bg-muted/30 transition-colors">
                {(["source", "nature", "revenue", "geoMarket", "complexity"] as const).map((col, ci) => (
                  <td key={col} className={cn("border border-border px-4 py-2 align-top", ci > 0 && "border-l border-border")}>
                    <Input disabled={locked} value={row[col]} onChange={e => updateRow<RevenueRow>("revenueRows", i, { [col]: e.target.value })}
                      className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="—" />
                  </td>
                ))}
                <DeleteCell onDelete={() => deleteRow("revenueRows", i)} locked={locked} />
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <SectionCard title="A. Nature of Business (continued)">
        <FieldRow label="Market conditions" sublabel="Changes in economy, competition, technology, tariffs, etc. that may impact the business." {...sf("marketConditions")} />
        <FieldRow label="Significant supplier and customer relationships." sublabel="Complete the table below." {...sf("relationships")} />
      </SectionCard>

      <TableCard title="Significant customers (C) and/or suppliers (S)" onAdd={() => addRow("customerRows", emptyCustomerRow)}>
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-muted/60 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
              <th className="border border-border px-4 py-2.5 text-left">Customer (C) / Supplier (S)</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border w-20">Type</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Areas of Possible Risk</th>
              <th className="border border-border w-8" />
            </tr>
          </thead>
          <tbody>
            {data.customerRows.map((row, i) => (
              <tr key={row.id} className="group hover:bg-muted/30 transition-colors">
                <td className="border border-border px-4 py-2 align-top">
                  <Input disabled={locked} value={row.name} onChange={e => updateRow<CustomerRow>("customerRows", i, { name: e.target.value })}
                    className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="Name" />
                </td>
                <td className="border border-border px-4 py-2 align-top border-l border-border w-24">
                  <Select value={row.type} onValueChange={v => updateRow<CustomerRow>("customerRows", i, { type: v as "C" | "S" | "" })} disabled={locked}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent><SelectItem value="C">C</SelectItem><SelectItem value="S">S</SelectItem></SelectContent>
                  </Select>
                </td>
                <td className="border border-border px-4 py-2 align-top border-l border-border">
                  <Input disabled={locked} value={row.riskAreas} onChange={e => updateRow<CustomerRow>("customerRows", i, { riskAreas: e.target.value })}
                    className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="Risk areas…" />
                </td>
                <DeleteCell onDelete={() => deleteRow("customerRows", i)} locked={locked} />
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <SectionCard title="A. Nature of Business (continued)">
        <FieldRow label="Location of key facilities" sublabel="Warehouses, retail, offices, etc. Complete the table below." {...sf("facilities")} />
      </SectionCard>

      <TableCard title="Key facilities" onAdd={() => addRow("facilityRows", emptyFacilityRow)}>
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-muted/60 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
              <th className="border border-border px-4 py-2.5 text-left">Address</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Principal Purpose</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border w-40">Approx. Inventory Value ($ or %)</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border w-32">Employees at Location</th>
              <th className="border border-border w-8" />
            </tr>
          </thead>
          <tbody>
            {data.facilityRows.map((row, i) => (
              <tr key={row.id} className="group hover:bg-muted/30 transition-colors">
                {(["address", "purpose", "inventoryValue", "employees"] as const).map((col, ci) => (
                  <td key={col} className={cn("border border-border px-4 py-2 align-top", ci > 0 && "border-l border-border")}>
                    <Input disabled={locked} value={row[col]} onChange={e => updateRow<FacilityRow>("facilityRows", i, { [col]: e.target.value })}
                      className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="—" />
                  </td>
                ))}
                <DeleteCell onDelete={() => deleteRow("facilityRows", i)} locked={locked} />
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <SectionCard title="A. Nature of Business (continued)">
        <FieldRow label="Use of third-party organizations" sublabel="Refer to Appendix B for examples. Populate all third-party organizations below including those identified via management questionnaire." {...sf("thirdParties")} />
      </SectionCard>

      <TableCard title="Third-party organizations" onAdd={() => addRow("thirdPartyRows", emptyThirdPartyRow)}>
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-muted/60 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
              <th className="border border-border px-4 py-2.5 text-left">Name & Brief Description of Services</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border w-44">Contact Information</th>
              <th className="border border-border px-4 py-2.5 text-center border-l border-border w-28">Service Org? (Y/N)</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Reasoning & Factors Considered</th>
              <th className="border border-border w-8" />
            </tr>
          </thead>
          <tbody>
            {data.thirdPartyRows.map((row, i) => (
              <tr key={row.id} className="group hover:bg-muted/30 transition-colors align-top">
                <td className="border border-border px-4 py-2">
                  <Textarea disabled={locked} value={row.nameDesc} onChange={e => updateRow<ThirdPartyRow>("thirdPartyRows", i, { nameDesc: e.target.value })}
                    className="min-h-[48px] text-sm border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent resize-none" placeholder="Name and services…" />
                </td>
                <td className="border border-border px-4 py-2 border-l border-border w-44">
                  <Input disabled={locked} value={row.contact} onChange={e => updateRow<ThirdPartyRow>("thirdPartyRows", i, { contact: e.target.value })}
                    className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="Contact info" />
                </td>
                <td className="border border-border px-4 py-2 border-l border-border w-28">
                  <Select value={row.isServiceOrg} onValueChange={v => updateRow<ThirdPartyRow>("thirdPartyRows", i, { isServiceOrg: v as YN })} disabled={locked}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Y — Form 516 required</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                    </SelectContent>
                  </Select>
                  {row.isServiceOrg === "Y" && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">Form 516 required</p>
                  )}
                </td>
                <td className="border border-border px-4 py-2 border-l border-border">
                  <Textarea disabled={locked} value={row.reasoning} onChange={e => updateRow<ThirdPartyRow>("thirdPartyRows", i, { reasoning: e.target.value })}
                    className="min-h-[48px] text-sm border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent resize-none" placeholder="Reasoning…" />
                </td>
                <DeleteCell onDelete={() => deleteRow("thirdPartyRows", i)} locked={locked} />
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <SectionCard title="A. Nature of Business (continued)">
        <FieldRow label="Research and development activities and expenditures." {...sf("rAndD")} />
      </SectionCard>

      <SectionConclusion value={data.conclusionA} sectionLetter="A" locked={locked} onChange={v => setField("conclusionA", v)} />
    </div>
  );

  // ── Section B ─────────────────────────────────────────────────────────────────

  const SectionB = (
    <div className="space-y-5">
      <SectionCard title="B. Ownership and Governance">
        <FieldRow label="Key stakeholders and their involvement in day-to-day management." sublabel="Owner/manager, family members, public ownership, taxpayers, etc. Complete the table below." {...sf("keyStakeholders")} />
      </SectionCard>

      <TableCard title="Key stakeholders" onAdd={() => addRow("stakeholderRows", emptyStakeholderRow)}>
        <table className="w-full min-w-[500px] border-collapse">
          <thead>
            <tr className="bg-muted/60 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
              <th className="border border-border px-4 py-2.5 text-left">Key Stakeholder (Individual / Company)</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border w-28">% Owned</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Direct Involvement, Influence or Agreements</th>
              <th className="border border-border w-8" />
            </tr>
          </thead>
          <tbody>
            {data.stakeholderRows.map((row, i) => (
              <tr key={row.id} className="group hover:bg-muted/30 transition-colors">
                {(["name", "pctOwned", "involvement"] as const).map((col, ci) => (
                  <td key={col} className={cn("border border-border px-4 py-2 align-top", ci > 0 && "border-l border-border", col === "pctOwned" && "w-28")}>
                    <Input disabled={locked} value={row[col]} onChange={e => updateRow<StakeholderRow>("stakeholderRows", i, { [col]: e.target.value })}
                      className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="—" />
                  </td>
                ))}
                <DeleteCell onDelete={() => deleteRow("stakeholderRows", i)} locked={locked} />
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <SectionCard title="B. Ownership and Governance (continued)">
        <FieldRow label="Who is TCWG?" sublabel="E.g., owner manager, CEO, board of directors." {...sf("tcwgWho")} />
        <FieldRow label="Finance and/or audit committee" sublabel="Describe their role and how often they meet, if applicable." {...sf("financeCommittee")} />
        <FieldRow label="Mandate, composition and operation of TCWG." sublabel="Complete the table below." {...sf("tcwgMandate")} />
      </SectionCard>

      <TableCard title="TCWG members" onAdd={() => addRow("tcwgRows", emptyTcwgRow)}>
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-muted/60 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
              <th className="border border-border px-4 py-2.5 text-left">Name</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border w-32">Member Since</th>
              <th className="border border-border px-4 py-2.5 text-center border-l border-border w-36">Finance / Audit Committee?</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Comments (Skills, Background, Expertise, Family Links)</th>
              <th className="border border-border w-8" />
            </tr>
          </thead>
          <tbody>
            {data.tcwgRows.map((row, i) => (
              <tr key={row.id} className="group hover:bg-muted/30 transition-colors">
                <td className="border border-border px-4 py-2 align-top">
                  <Input disabled={locked} value={row.name} onChange={e => updateRow<TcwgRow>("tcwgRows", i, { name: e.target.value })}
                    className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="Name" />
                </td>
                <td className="border border-border px-4 py-2 align-top border-l border-border w-32">
                  <Input disabled={locked} value={row.memberSince} onChange={e => updateRow<TcwgRow>("tcwgRows", i, { memberSince: e.target.value })}
                    className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="Year" />
                </td>
                <td className="border border-border px-4 py-2 align-top border-l border-border w-36">
                  <Select value={row.onFinance} onValueChange={v => updateRow<TcwgRow>("tcwgRows", i, { onFinance: v as YN })} disabled={locked}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent><SelectItem value="Y">Y</SelectItem><SelectItem value="N">N</SelectItem></SelectContent>
                  </Select>
                </td>
                <td className="border border-border px-4 py-2 align-top border-l border-border">
                  <Input disabled={locked} value={row.comments} onChange={e => updateRow<TcwgRow>("tcwgRows", i, { comments: e.target.value })}
                    className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="Comments…" />
                </td>
                <DeleteCell onDelete={() => deleteRow("tcwgRows", i)} locked={locked} />
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <SectionCard title="B. Ownership and Governance (continued)">
        <FieldRow label="Key members of management/personnel." sublabel="Complete the table below." {...sf("keyManagement")} />
      </SectionCard>

      <TableCard title="Key management personnel" onAdd={() => addRow("managementRows", emptyManagementRow)}>
        <table className="w-full min-w-[500px] border-collapse">
          <thead>
            <tr className="bg-muted/60 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
              <th className="border border-border px-4 py-2.5 text-left">Name</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Position</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Qualifications / Experience / Comments</th>
              <th className="border border-border w-8" />
            </tr>
          </thead>
          <tbody>
            {data.managementRows.map((row, i) => (
              <tr key={row.id} className="group hover:bg-muted/30 transition-colors">
                {(["name", "position", "qualifications"] as const).map((col, ci) => (
                  <td key={col} className={cn("border border-border px-4 py-2 align-top", ci > 0 && "border-l border-border")}>
                    <Input disabled={locked} value={row[col]} onChange={e => updateRow<ManagementRow>("managementRows", i, { [col]: e.target.value })}
                      className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="—" />
                  </td>
                ))}
                <DeleteCell onDelete={() => deleteRow("managementRows", i)} locked={locked} />
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <SectionCard title="B. Ownership and Governance (continued)">
        <FieldRow label="Management's operating style" sublabel="E.g., autocratic or consensus building, risk taking or conservative, and implications for the entity." {...sf("operatingStyle")} />
        <FieldRow label="Key advisors and non-management entities" sublabel="Legal, insurance, banks, franchisors, government agencies that provide direction, control or accountability. Complete the table below." {...sf("keyAdvisors")} />
      </SectionCard>

      <TableCard title="Key advisors" onAdd={() => addRow("advisorRows", emptyAdvisorRow)}>
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-muted/60 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
              <th className="border border-border px-4 py-2.5 text-left">Contact Person</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Company</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border w-44">Email</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Type(s) of Direction / Advice Provided</th>
              <th className="border border-border w-8" />
            </tr>
          </thead>
          <tbody>
            {data.advisorRows.map((row, i) => (
              <tr key={row.id} className="group hover:bg-muted/30 transition-colors">
                {(["contactPerson", "company", "email", "adviceType"] as const).map((col, ci) => (
                  <td key={col} className={cn("border border-border px-4 py-2 align-top", ci > 0 && "border-l border-border", col === "email" && "w-44")}>
                    <Input disabled={locked} value={row[col]} onChange={e => updateRow<AdvisorRow>("advisorRows", i, { [col]: e.target.value })}
                      className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="—" />
                  </td>
                ))}
                <DeleteCell onDelete={() => deleteRow("advisorRows", i)} locked={locked} />
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <SectionCard title="B. Ownership and Governance (continued)">
        <FieldRow label="Performance incentives" sublabel="Management bonuses paid and how calculated. Consider if incentives could motivate fraud — if so, document risk on Form 506." {...sf("perfIncentives")} />
      </SectionCard>

      <SectionConclusion value={data.conclusionB} sectionLetter="B" locked={locked} onChange={v => setField("conclusionB", v)} />
    </div>
  );

  // ── Section C ─────────────────────────────────────────────────────────────────

  const SectionC = (
    <div className="space-y-5">
      <TableCard title="Significant laws and regulations" onAdd={() => addRow("lawRows", emptyLawRow)}>
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-muted/60 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
              <th className="border border-border px-4 py-2.5 text-left">Significant Laws / Regulations (including environmental and tax)</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Instances of Non-Compliance, Alleged Non-Compliance or Investigations</th>
              <th className="border border-border px-4 py-2.5 text-center border-l border-border w-40">Would Non-Compliance Result in Material Direct Effect on F/S? (Y/N)</th>
              <th className="border border-border w-8" />
            </tr>
          </thead>
          <tbody>
            {data.lawRows.map((row, i) => (
              <tr key={row.id} className="group hover:bg-muted/30 transition-colors align-top">
                <td className="border border-border px-4 py-2">
                  <Textarea disabled={locked} value={row.law} onChange={e => updateRow<LawRow>("lawRows", i, { law: e.target.value })}
                    className="min-h-[48px] text-sm border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent resize-none" placeholder="Law / regulation…" />
                </td>
                <td className="border border-border px-4 py-2 border-l border-border">
                  <Textarea disabled={locked} value={row.nonCompliance} onChange={e => updateRow<LawRow>("lawRows", i, { nonCompliance: e.target.value })}
                    className="min-h-[48px] text-sm border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent resize-none" placeholder="Describe any instances…" />
                </td>
                <td className="border border-border px-4 py-2 border-l border-border w-40">
                  <Select value={row.materialEffect} onValueChange={v => updateRow<LawRow>("lawRows", i, { materialEffect: v as YN })} disabled={locked}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent><SelectItem value="Y">Y</SelectItem><SelectItem value="N">N</SelectItem></SelectContent>
                  </Select>
                </td>
                <DeleteCell onDelete={() => deleteRow("lawRows", i)} locked={locked} />
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <SectionCard title="C. Laws and Regulations (continued)">
        <FieldRow label="Correspondence with relevant licensing or regulatory authorities." {...sf("correspondence")} />
        <FieldRow label="New or proposed legislation/regulations" sublabel="Where non-compliance could have a significant financial impact on the F/S." {...sf("newLegislation")} />
      </SectionCard>

      <RequiredInquiryBanner inquiry={data.inquiryC} locked={locked} onChange={v => setField("inquiryC", v)} />
      <div className="rounded-md border border-border bg-card px-5 py-3 text-sm text-foreground">
        Inquire of management and, where appropriate, TCWG, as to whether the entity is in compliance with significant laws and regulations.
      </div>

      <SectionConclusion value={data.conclusionC} sectionLetter="C" locked={locked} onChange={v => setField("conclusionC", v)} />
    </div>
  );

  // ── Section D ─────────────────────────────────────────────────────────────────

  const SectionD = (
    <div className="space-y-5">
      <SectionCard title="D. Accounting Policies and F/S Disclosures">
        <FieldRow label="The applicable financial reporting framework (AFRF)." {...sf("afrf")} />
        <FieldRow label="Significant accounting policies" sublabel="Consider attaching significant policies from prior year F/S." {...sf("sigPolicies")} />
        <FieldRow
          label="Revenue recognition for each revenue stream."
          sublabel="See Section A for revenue streams. Consider using Form 580. Note: CAS 240 presumes a risk of fraud on revenue recognition unless specifically refuted."
          {...sf("revenueRecognition")}
        />
        <FieldRow label="Areas with lack of authoritative guidance or consensus." sublabel="Controversial or emerging accounting areas." {...sf("lackGuidance")} />
        <FieldRow label="Areas where a choice in the selection of accounting policies exists." {...sf("policyChoice")} />
        <FieldRow label="Unusual or complex transactions." {...sf("unusualTransactions")} />
      </SectionCard>

      <RequiredInquiryBanner inquiry={data.inquiryD} locked={locked} onChange={v => setField("inquiryD", v)} />
      <div className="rounded-md border border-border bg-card px-5 py-3 text-sm text-foreground space-y-1">
        <p>Inquire about whether there have been any changes to the entity's accounting policies, including any changes in the AFRF. Consider:</p>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5 mt-1">
          <li>New or revised financial reporting standards.</li>
          <li>New laws and regulations.</li>
        </ul>
        <p className="mt-1">Inquire about F/S disclosures requiring special consideration, such as related-party transactions or management's assessment of the entity's ability to continue as a going concern.</p>
      </div>

      <SectionConclusion value={data.conclusionD} sectionLetter="D" locked={locked} onChange={v => setField("conclusionD", v)} />
    </div>
  );

  // ── Section E ─────────────────────────────────────────────────────────────────

  const SectionE = (
    <div className="space-y-5">
      <SectionCard title="E. Investments">
        <FieldRow label="Overall entity structure" sublabel="Subsidiaries, joint arrangements, partnerships, etc. Obtain or prepare a chart where applicable. Document related parties on Form 515." {...sf("entityStructure")} />
        <FieldRow label="Major investments, loans, joint arrangements, capital projects or outsourcing activities." sublabel="Complete the table below." {...sf("majorInvestments")} />
      </SectionCard>

      <TableCard title="Major investments and capital projects" onAdd={() => addRow("investmentRows", emptyInvestmentRow)}>
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-muted/60 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
              <th className="border border-border px-4 py-2.5 text-left">Name of Entity / Capital Project</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border w-32">Approx. $ Amount</th>
              <th className="border border-border px-4 py-2.5 text-center border-l border-border w-32">Consolidated in F/S? (Y/N)</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Purpose of Investment</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Significant Terms</th>
              <th className="border border-border w-8" />
            </tr>
          </thead>
          <tbody>
            {data.investmentRows.map((row, i) => (
              <tr key={row.id} className="group hover:bg-muted/30 transition-colors">
                <td className="border border-border px-4 py-2 align-top">
                  <Input disabled={locked} value={row.name} onChange={e => updateRow<InvestmentRow>("investmentRows", i, { name: e.target.value })}
                    className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="Name" />
                </td>
                <td className="border border-border px-4 py-2 align-top border-l border-border w-32">
                  <Input disabled={locked} value={row.amount} onChange={e => updateRow<InvestmentRow>("investmentRows", i, { amount: e.target.value })}
                    className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="$" />
                </td>
                <td className="border border-border px-4 py-2 align-top border-l border-border w-32">
                  <Select value={row.consolidated} onValueChange={v => updateRow<InvestmentRow>("investmentRows", i, { consolidated: v as YN })} disabled={locked}>
                    <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent><SelectItem value="Y">Y</SelectItem><SelectItem value="N">N</SelectItem></SelectContent>
                  </Select>
                </td>
                <td className="border border-border px-4 py-2 align-top border-l border-border">
                  <Input disabled={locked} value={row.purpose} onChange={e => updateRow<InvestmentRow>("investmentRows", i, { purpose: e.target.value })}
                    className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="Purpose…" />
                </td>
                <td className="border border-border px-4 py-2 align-top border-l border-border">
                  <Input disabled={locked} value={row.terms} onChange={e => updateRow<InvestmentRow>("investmentRows", i, { terms: e.target.value })}
                    className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="Terms…" />
                </td>
                <DeleteCell onDelete={() => deleteRow("investmentRows", i)} locked={locked} />
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <SectionCard title="E. Investments (continued)">
        <FieldRow label="Planned or recently executed acquisitions or divestitures." {...sf("acquisitions")} />
        <FieldRow label="Use of off-balance sheet finance, special-purpose entities and other complex financing arrangements." {...sf("offBalance")} />
      </SectionCard>

      <SectionConclusion value={data.conclusionE} sectionLetter="E" locked={locked} onChange={v => setField("conclusionE", v)} />
    </div>
  );

  // ── Section F ─────────────────────────────────────────────────────────────────

  const SectionF = (
    <div className="space-y-5">
      <SectionCard title="F. Financing">
        <FieldRow label="Debt structure and related terms" sublabel="Including off-balance sheet financing arrangements (e.g., leasing). Complete the table below." {...sf("debtStructure")} />
      </SectionCard>

      <TableCard title="Debt and financing arrangements" onAdd={() => addRow("financingRows", emptyFinancingRow)}>
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-muted/60 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
              <th className="border border-border px-4 py-2.5 text-left">Name of Creditor</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border w-32">Amount of Financing</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border w-28">Interest Rate</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border w-28">Maturity Date</th>
              <th className="border border-border px-4 py-2.5 text-left border-l border-border">Terms, Loan Security and Covenants</th>
              <th className="border border-border w-8" />
            </tr>
          </thead>
          <tbody>
            {data.financingRows.map((row, i) => (
              <tr key={row.id} className="group hover:bg-muted/30 transition-colors align-top">
                <td className="border border-border px-4 py-2">
                  <Input disabled={locked} value={row.creditor} onChange={e => updateRow<FinancingRow>("financingRows", i, { creditor: e.target.value })}
                    className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="Creditor" />
                </td>
                <td className="border border-border px-4 py-2 border-l border-border w-32">
                  <Input disabled={locked} value={row.amount} onChange={e => updateRow<FinancingRow>("financingRows", i, { amount: e.target.value })}
                    className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="$" />
                </td>
                <td className="border border-border px-4 py-2 border-l border-border w-28">
                  <Input disabled={locked} value={row.rate} onChange={e => updateRow<FinancingRow>("financingRows", i, { rate: e.target.value })}
                    className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="%" />
                </td>
                <td className="border border-border px-4 py-2 border-l border-border w-28">
                  <Input disabled={locked} value={row.maturity} onChange={e => updateRow<FinancingRow>("financingRows", i, { maturity: e.target.value })}
                    className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" placeholder="YYYY-MM-DD" />
                </td>
                <td className="border border-border px-4 py-2 border-l border-border">
                  <Textarea disabled={locked} value={row.terms} onChange={e => updateRow<FinancingRow>("financingRows", i, { terms: e.target.value })}
                    className="min-h-[40px] text-sm border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent resize-none" placeholder="Terms, security, covenants…" />
                </td>
                <DeleteCell onDelete={() => deleteRow("financingRows", i)} locked={locked} />
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <SectionCard title="F. Financing (continued)">
        <FieldRow label="Use of derivative financial instruments." {...sf("derivatives")} />
        <FieldRow label="Externally imposed performance targets" sublabel="Established by banks, investors and other lenders that management is expected to achieve." {...sf("imposedTargets")} />
        <FieldRow
          label="Changes to financing arrangements during the period"
          sublabel="Consider: new financing, refinancing, debt extinguishment, debt modifications, future plans."
          {...sf("financingChanges")}
        />
      </SectionCard>

      <SectionConclusion value={data.conclusionF} sectionLetter="F" locked={locked} onChange={v => setField("conclusionF", v)} />
    </div>
  );

  // ── Section G ─────────────────────────────────────────────────────────────────

  const SectionG = (
    <div className="space-y-5">
      <SectionCard title="G. Measurement / Review of Financial Performance">
        <FieldRow
          label="Preparation, use and review of budgets, forecasts, variance analyses and key performance indicators (financial and non-financial), and key ratios and trends."
          {...sf("budgetsForecasts")}
        />
        <FieldRow label="Use of employee performance measures in incentive compensation policies." {...sf("perfMeasures")} />
        <FieldRow
          label="Use of externally imposed performance targets"
          sublabel="Established by banks, investors and other lenders that management is expected to achieve (e.g., bank covenants)."
          {...sf("externalTargets")}
        />
        <FieldRow label="Performance comparisons made with competitors." {...sf("perfComparisons")} />
      </SectionCard>

      <SectionConclusion value={data.conclusionG} sectionLetter="G" locked={locked} onChange={v => setField("conclusionG", v)} />
    </div>
  );

  // ── Conclusion ────────────────────────────────────────────────────────────────

  const SectionZ = (
    <div className="space-y-5">
      {/* Notes */}
      <div className="bg-card border border-border rounded-md p-5 space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Notes</h3>
        <Textarea
          disabled={locked}
          value={data.notes}
          onChange={e => setField("notes", e.target.value)}
          placeholder="Additional observations, cross-references to Forms 520 / 511 / 551, follow-ups…"
          className="min-h-[90px] text-sm resize-none rounded-[10px]"
        />
      </div>

      <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
        <div className="px-6 py-3.5 border-b border-border">
          <span className="text-sm font-semibold text-foreground">Overall Conclusion</span>
        </div>
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-muted-foreground">
            We have performed risk assessment procedures to identify events, conditions and circumstances that may result in a material misstatement in the F/S and have documented the risk factors identified on Form 520.
          </p>
          {data.concluded && (
            <div className="rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-800 dark:text-green-300">
              Concluded on {data.concludedOn}
            </div>
          )}
          <Textarea
            disabled={locked}
            value={data.overallConclusion}
            onChange={e => setField("overallConclusion", e.target.value)}
            placeholder="Document your overall conclusion and any additional observations…"
            className="min-h-[120px] text-sm resize-none bg-background"
          />
          <div className="flex justify-end">
            <Button
              disabled={locked}
              onClick={() => {
                const now = new Date().toISOString().slice(0, 10);
                setData(d => {
                  const next = { ...d, concluded: true, concludedOn: now };
                  writeJsonToLocalStorage(storageKey, next);
                  return next;
                });
              }}
            >
              Conclude worksheet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Perform and document risk assessment procedures to identify events, conditions and circumstances that may result in a material misstatement through understanding the entity, its environment and the applicable financial reporting framework. Identified risk factors are carried forward to Form 520. Review and update this form each period.
        </p>
      </div>

      {/* Single scrollable page */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-5 max-w-6xl">
          {SectionA}
          {SectionB}
          {SectionC}
          {SectionD}
          {SectionE}
          {SectionF}
          {SectionG}
          {SectionZ}
        </div>
      </div>
    </div>
  );
}
