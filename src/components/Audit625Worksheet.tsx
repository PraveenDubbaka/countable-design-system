import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

interface Data625 {
  periodEnd: string;
  reportDate: string;
  goingConcernBasisAppropriate: string;
  financialIndicators: string;
  operatingIndicators: string;
  otherIndicators: string;
  managementPlans: string;
  mitigatingFactors: string;
  significantDoubt: string;
  doubtAlleviated: string;
  disclosureRequired: string;
  disclosureAdequate: string;
  opinionImplication: string;
  conclusion: string;
  preparedBy: string; preparedDate: string;
  reviewedBy: string; reviewedDate: string;
  concluded: boolean; concludedOn: string;
}

const YN_NA = ['Yes', 'No', 'NA'];

function buildDefault(): Data625 {
  return {
    periodEnd: '', reportDate: '',
    goingConcernBasisAppropriate: '', financialIndicators: '', operatingIndicators: '',
    otherIndicators: '', managementPlans: '', mitigatingFactors: '',
    significantDoubt: '', doubtAlleviated: '', disclosureRequired: '',
    disclosureAdequate: '', opinionImplication: '', conclusion: '',
    preparedBy: '', preparedDate: '', reviewedBy: '', reviewedDate: '',
    concluded: false, concludedOn: '',
  };
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-3">
    <h3 className="text-sm font-semibold">{title}</h3>
    {children}
  </div>
);

const SelectField = ({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled: boolean }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    <Select disabled={disabled} value={value} onValueChange={onChange}>
      <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
      <SelectContent>{YN_NA.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent>
    </Select>
  </div>
);

const TAField = ({ label, value, onChange, disabled, placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; disabled: boolean; placeholder?: string }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    <Textarea disabled={disabled} value={value} onChange={e => onChange(e.target.value)} className="text-xs min-h-[72px]" placeholder={placeholder} />
  </div>
);

export function Audit625Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-625-data-${engagementId ?? 'default'}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const [data, setData] = useState<Data625>(() => readJsonFromLocalStorage<Data625>(storageKey, buildDefault()) ?? buildDefault());

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;
  const upd = (field: keyof Data625) => (v: string) => setData(d => ({ ...d, [field]: v }));

  return (
    <div className="p-4 space-y-4 text-sm">
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Objective</p>
        <p className="text-sm">Evaluate whether the going concern basis of accounting is appropriate and whether adequate disclosure has been made regarding any material uncertainty related to going concern (CAS 570).</p>
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Period end date</label><Input disabled={locked} type="date" value={data.periodEnd} onChange={e => setData(d => ({ ...d, periodEnd: e.target.value }))} className="h-7 text-xs" /></div>
          <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Audit report date</label><Input disabled={locked} type="date" value={data.reportDate} onChange={e => setData(d => ({ ...d, reportDate: e.target.value }))} className="h-7 text-xs" /></div>
        </div>
      </div>
      <Section title="1. Events and Conditions Identified">
        <TAField label="Financial indicators (net liabilities, debt maturities, negative cash flows, adverse ratios, arrears)" value={data.financialIndicators} onChange={upd('financialIndicators')} disabled={locked} placeholder="None identified / describe any indicators…" />
        <TAField label="Operating indicators (loss of key management, major market/customer loss, labour difficulties)" value={data.operatingIndicators} onChange={upd('operatingIndicators')} disabled={locked} placeholder="None identified / describe any indicators…" />
        <TAField label="Other indicators (legal proceedings, non-compliance, pending legislation changes)" value={data.otherIndicators} onChange={upd('otherIndicators')} disabled={locked} placeholder="None identified / describe any indicators…" />
      </Section>
      <Section title="2. Management's Assessment and Plans">
        <TAField label="Management's plans to mitigate events or conditions" value={data.managementPlans} onChange={upd('managementPlans')} disabled={locked} placeholder="Describe management's plans (financing, cost reductions, asset sales, etc.)" />
        <TAField label="Mitigating factors and auditor's assessment of feasibility" value={data.mitigatingFactors} onChange={upd('mitigatingFactors')} disabled={locked} placeholder="Assess whether management's plans are feasible and achievable" />
      </Section>
      <Section title="3. Conclusion on Going Concern">
        <SelectField label="Do events or conditions exist that cast significant doubt on the entity's ability to continue as a going concern?" value={data.significantDoubt} onChange={upd('significantDoubt')} disabled={locked} />
        <SelectField label="If significant doubt exists — is it alleviated by management's plans?" value={data.doubtAlleviated} onChange={upd('doubtAlleviated')} disabled={locked} />
        <SelectField label="Is disclosure of a material uncertainty relating to going concern required?" value={data.disclosureRequired} onChange={upd('disclosureRequired')} disabled={locked} />
        <SelectField label="If disclosure required — is the disclosure in the financial statements adequate?" value={data.disclosureAdequate} onChange={upd('disclosureAdequate')} disabled={locked} />
        <TAField label="Impact on auditor's report (modified opinion / emphasis of matter / unmodified)" value={data.opinionImplication} onChange={upd('opinionImplication')} disabled={locked} placeholder="Describe the impact on the audit report, if any" />
        <TAField label="Overall conclusion" value={data.conclusion} onChange={upd('conclusion')} disabled={locked} placeholder="State the overall conclusion on going concern" />
      </Section>
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <h3 className="text-sm font-semibold mb-3">Sign-off</h3>
        <div className="grid grid-cols-2 gap-3">
          {[['Prepared by', 'preparedBy', 'preparedDate'], ['Reviewed by', 'reviewedBy', 'reviewedDate']].map(([label, nk, dk]) => (
            <div key={nk} className="space-y-1.5"><p className="text-xs font-medium text-muted-foreground">{label}</p><div className="flex gap-2"><Input disabled={locked} value={(data as unknown as Record<string, string>)[nk]} onChange={e => setData(d => ({ ...d, [nk]: e.target.value }))} className="h-7 text-xs flex-1" placeholder="Name" /><Input disabled={locked} type="date" value={(data as unknown as Record<string, string>)[dk]} onChange={e => setData(d => ({ ...d, [dk]: e.target.value }))} className="h-7 text-xs w-32" /></div></div>
          ))}
        </div>
      </div>
      {locked ? <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-xs text-green-800 font-medium">Concluded on {data.concludedOn}</div> : (
        <div className="flex justify-end"><Button size="sm" onClick={() => { const u = { ...data, concluded: true, concludedOn: new Date().toISOString().slice(0, 10) }; setData(u); writeJsonToLocalStorage(storageKey, u); }}>Conclude Worksheet</Button></div>
      )}
    </div>
  );
}
