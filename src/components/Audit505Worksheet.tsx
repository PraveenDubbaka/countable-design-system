import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

// ── Types ──────────────────────────────────────────────────────────────────────

interface PlanRow { checked: boolean; psc: string; response: string; wpRef: RefDoc[] }
interface Interviewee { who: string; byWhom: string; date: string }
interface SectionRow { psc: string; response: string; wpRef: RefDoc[] }
interface Data505 {
  planning: Record<string, PlanRow>;
  interviewees: Record<string, Interviewee[]>;
  sections: Record<string, SectionRow>;
  conclusion: string; concluded: boolean; concludedOn: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const PLANNING = [
  { id: 'pl-1', num: '1', description: 'Select members of management and TCWG who may help in identifying (or updating) the risks of material misstatements (error and fraud) in the F/S.', items: [] as string[] },
  { id: 'pl-2', num: '2', description: 'Select others in the entity (at various levels of authority) that may provide a different perspective in identifying risks of material misstatement. Consider:', items: [
    'Sales/marketing personnel.',
    'Operational and purchasing managers.',
    'IT support personnel.',
    'Accounting employees.',
    'Others, such as internal auditors or risk managers (specify).',
  ]},
  { id: 'pl-3', num: '3', description: 'Document the names of those selected for interview, and schedule a convenient time to meet.', items: [] },
  { id: 'pl-4', num: '4', description: 'Ask open-ended questions and document the information obtained. Record risk factors identified on Form 520.', items: [] },
];

const INQUIRY_GROUPS = [
  { group: 'INQUIRIES OF MANAGEMENT AND FINANCIAL REPORTING PERSONNEL', id: 'mgmt', label: 'Management', items: [
    'Business plans and strategies.',
    'Financial targets (such as sales and profitability, planned acquisitions and divestitures), new/discontinued products and services, and new contracts.',
    'Key initiatives (such as personnel changes, location changes, new financing sources, new technologies and major research, or other planned expenditures).',
    'The impact of any new accounting requirements and how they will be implemented.',
  ]},
  { group: 'INQUIRIES OF OTHERS', id: 'sales', label: 'Sales/marketing personnel', items: [
    'Composition of sales and sales trends.',
    'Products/services that are doing well and those that are not.',
    'The major competitors and their impact.',
    'Major new and lost customers.',
    'Changes in contractual arrangements and terms of warranties.',
    'Any customers having difficulty paying on time.',
    'Any new or modified incentive programs for sales staff.',
    'Any sales that have been made outside of the usual terms of business.',
    'Any modifications to accounting policies for revenue recognition.',
    'Any instances of alleged, suspected or actual fraud.',
    'The risks and relevant internal controls over sales.',
    'Other (specify).',
  ]},
  { group: null as string | null, id: 'ops', label: 'Operational/purchasing personnel', items: [
    'Major changes in production processes.',
    'New equipment or technologies.',
    'Changes in suppliers, price/availability of raw materials, costing methodology, personnel and other operational matters.',
    'Condition of inventory. Consider obsolescence, slow-moving items, damage and any theft during the period.',
    'Any instances of alleged, suspected or actual fraud.',
    'Economic dependence on a major supplier.',
    'Risks and relevant internal controls over purchasing.',
    'Other (specify).',
  ]},
  { group: null as string | null, id: 'it', label: 'IT support personnel', items: [
    'Changes (planned and actual) to IT infrastructure, personnel or support.',
    'Access and control over data/programs by the IT staff or IT contractor.',
    'Changes to IT applications that have an impact on accounting.',
    'Problems encountered during the period. Consider system crashes, virus/hacker attacks, security breaches, unauthorized access to data or user complaints, etc.',
    'Physical security of IT equipment (such as servers, laptops, desktops and other mobile devices, such as smartphones).',
    'Any instances of alleged, suspected or actual fraud.',
    'The risks and relevant internal controls that address IT security and financial applications, if applicable.',
    'Other (specify).',
  ]},
  { group: null as string | null, id: 'acctg', label: 'Accounting personnel', items: [
    'The process of preparing financial reports and statements and the areas where misstatements could arise (such as use of Excel spreadsheets).',
    'Significant or unusual transactions or journal entries in the period.',
    'Any instances of alleged, suspected or actual fraud.',
    "Whether the entity's accounting policies have been consistently applied.",
    'Whether there is a service auditor\'s report available for review where payroll has been outsourced.',
    'Whether issues or concerns have been raised by external parties, such as bankers, regulators, investors or the press.',
    'The risks and relevant internal controls that address areas such as payroll and financial reporting.',
    'Other (specify).',
  ]},
  { group: 'OTHER INQUIRIES', id: 'lawyers', label: 'Others (such as in-house lawyers, internal auditors, etc.)', items: [
    'Any knowledge of management override, fraud or suspected fraud.',
    'Any actual or threatened litigation or non-compliance with laws and regulations.',
    'Internal audit reports to management on areas of concern.',
  ]},
];

const SECTIONS_WITH_HEADERS = INQUIRY_GROUPS.map((sec, i) => ({
  ...sec,
  showGroupHeader: sec.group !== null && (i === 0 || sec.group !== INQUIRY_GROUPS[i - 1].group),
}));

const INTERVIEWEE_ROLES: Record<string, string[]> = {
  mgmt:    ['CEO', 'CFO', 'COO', 'President', 'Controller', 'VP Finance', 'Managing Director', 'VP Operations', 'Other'],
  sales:   ['Sales Director', 'VP Sales', 'Sales Manager', 'Marketing Manager', 'Account Manager', 'Business Development Manager', 'Other'],
  ops:     ['Operations Manager', 'Purchasing Manager', 'Supply Chain Manager', 'Production Manager', 'Warehouse Manager', 'Plant Manager', 'Other'],
  it:      ['IT Manager', 'IT Director', 'CTO', 'Systems Administrator', 'Network Administrator', 'IT Coordinator', 'Other'],
  acctg:   ['Controller', 'Chief Accountant', 'Accounting Manager', 'AP Manager', 'AR Manager', 'Financial Analyst', 'Bookkeeper', 'Other'],
  lawyers: ['Legal Counsel', 'General Counsel', 'Internal Auditor', 'Risk Manager', 'Compliance Officer', 'Other'],
};

const AUDITOR_OPTIONS = [
  'Elena Sokolova — Partner',
  'Priya Raman — Staff',
  'Marcus Chen — CMS',
];

function emptyPlan(): PlanRow { return { checked: false, psc: '', response: '', wpRef: [] }; }
function emptyIv(): Interviewee { return { who: '', byWhom: '', date: '' }; }
function emptySec(): SectionRow { return { psc: '', response: '', wpRef: [] }; }

function buildDefault(): Data505 {
  const planning: Record<string, PlanRow> = {};
  PLANNING.forEach(p => { planning[p.id] = emptyPlan(); });
  const interviewees: Record<string, Interviewee[]> = {};
  const sections: Record<string, SectionRow> = {};
  INQUIRY_GROUPS.forEach(g => { interviewees[g.id] = [emptyIv(), emptyIv()]; sections[g.id] = emptySec(); });
  return { planning, interviewees, sections, conclusion: '', concluded: false, concludedOn: '' };
}

// ── Component ──────────────────────────────────────────────────────────────────

export function Audit505Worksheet({ isUS = false }: { isUS?: boolean }) {
  const storageKey = `audit-505-data-${isUS ? 'us' : 'ca'}`;

  const [data, setData] = useState<Data505>(() => {
    const saved = readJsonFromLocalStorage<Data505 | null>(storageKey, null);
    if (!saved) return buildDefault();
    const def = buildDefault();
    return { ...def, ...saved, planning: { ...def.planning, ...(saved.planning ?? {}) }, interviewees: { ...def.interviewees, ...(saved.interviewees ?? {}) }, sections: { ...def.sections, ...(saved.sections ?? {}) } };
  });

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 600);
    return () => clearTimeout(t);
  }, [data, storageKey]);

  const locked = data.concluded;
  function setPlan(id: string, patch: Partial<PlanRow>) { setData(d => ({ ...d, planning: { ...d.planning, [id]: { ...d.planning[id], ...patch } } })); }
  function setIv(sId: string, idx: number, patch: Partial<Interviewee>) {
    setData(d => { const list = [...d.interviewees[sId]]; list[idx] = { ...list[idx], ...patch }; return { ...d, interviewees: { ...d.interviewees, [sId]: list } }; });
  }
  function setSec(id: string, patch: Partial<SectionRow>) { setData(d => ({ ...d, sections: { ...d.sections, [id]: { ...d.sections[id], ...patch } } })); }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          To provide an additional listing of potential inquiries of management, those responsible for financial reporting and other appropriate individuals within the entity.{" "}
          <span className="font-medium text-foreground">Note:</span> Where responses are incomplete, unsatisfactory or inconsistent, perform additional risk assessment procedures.{" "}
          <span className="font-medium text-foreground">PSC</span> = Procedure successfully completed. <span className="font-medium text-foreground">TCWG</span> = Those charged with governance.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* Planning */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Planning</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted border-b border-border">
                    <th className="w-10 px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" />
                    <th className="w-10 px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider" style={{width:320,minWidth:320}}>Procedure</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" style={{width:140,minWidth:140}}>PSC? (Y/N)</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider" style={{minWidth:420}}>Responses / comments</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" style={{width:110,minWidth:110}}>W/P ref.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {PLANNING.map(proc => {
                    const row = data.planning[proc.id];
                    return (
                      <tr key={proc.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 text-center align-top"><Checkbox checked={row.checked} onCheckedChange={v => setPlan(proc.id, {checked:!!v})} disabled={locked} /></td>
                        <td className="px-4 py-3 text-center align-top text-xs font-semibold font-mono text-foreground">{proc.num}</td>
                        <td className="px-6 py-3 align-top text-sm text-foreground">
                          {proc.description}
                          {proc.items.length > 0 && (
                            <ul className="mt-1.5 space-y-0.5 list-disc list-inside">
                              {proc.items.map((item, i) => <li key={i} className="text-xs text-muted-foreground">{item}</li>)}
                            </ul>
                          )}
                        </td>
                        <td className="px-4 py-3 align-top" style={{width:160}}>
                          <Select value={row.psc} onValueChange={v => setPlan(proc.id, {psc:v})} disabled={locked}>
                            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent><SelectItem value="Y">Y</SelectItem><SelectItem value="N">N</SelectItem><SelectItem value="N/A">N/A</SelectItem></SelectContent>
                          </Select>
                        </td>
                        <td className="px-6 py-3 align-top">
                          <Textarea disabled={locked} value={row.response} onChange={e => setPlan(proc.id, {response:e.target.value})} placeholder="Enter response…" className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent" />
                        </td>
                        <td className="px-4 py-3 align-top text-center" style={{width:110}}>
                          <RefButton reference={row.wpRef} onAttach={doc => setPlan(proc.id, {wpRef:[...row.wpRef,doc]})} onRemove={i => setPlan(proc.id, {wpRef:row.wpRef.filter((_,idx)=>idx!==i)})} disabled={locked} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inquiry sub-sections */}
          {SECTIONS_WITH_HEADERS.map(sec => {
            const row = data.sections[sec.id];
            const interviews = data.interviewees[sec.id] ?? [emptyIv(), emptyIv()];
            return (
              <div key={sec.id} className="space-y-3">
                {sec.showGroupHeader && (
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{sec.group}</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}
                <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                  <div className="px-6 py-3.5 bg-card border-b border-border">
                    <span className="text-sm font-semibold text-foreground">{sec.label}</span>
                  </div>
                  <div className="px-6 pt-4 pb-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Interviewee(s)</p>
                    <div className="rounded-md border border-border overflow-hidden mb-4">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted text-xs font-semibold text-foreground uppercase tracking-wider border-b border-border">
                            <th className="px-4 py-2 text-left">Who interviewed</th>
                            <th className="px-4 py-2 text-left border-l border-border">By whom</th>
                            <th className="px-4 py-2 text-left border-l border-border" style={{width:140}}>Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {interviews.map((iv, i) => (
                            <tr key={i} className="hover:bg-muted/30">
                              <td className="px-2 py-1">
                                <Select value={iv.who} onValueChange={v => setIv(sec.id, i, {who: v})} disabled={locked}>
                                  <SelectTrigger className="h-7 text-sm border-0 shadow-none bg-transparent focus:ring-0 focus:ring-offset-0 px-2">
                                    <SelectValue placeholder="Select name / role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {(INTERVIEWEE_ROLES[sec.id] ?? INTERVIEWEE_ROLES['mgmt']).map(role => (
                                      <SelectItem key={role} value={role}>{role}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-2 py-1 border-l border-border">
                                <Select value={iv.byWhom} onValueChange={v => setIv(sec.id, i, {byWhom: v})} disabled={locked}>
                                  <SelectTrigger className="h-7 text-sm border-0 shadow-none bg-transparent focus:ring-0 focus:ring-offset-0 px-2">
                                    <SelectValue placeholder="Select auditor" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {AUDITOR_OPTIONS.map(name => (
                                      <SelectItem key={name} value={name}>{name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-2 py-1 border-l border-border" style={{width:160}}>
                                <Input
                                  type="date"
                                  disabled={locked}
                                  value={iv.date}
                                  onChange={e => setIv(sec.id, i, {date: e.target.value})}
                                  className="h-7 text-sm border-0 shadow-none px-2 focus-visible:ring-0 bg-transparent"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Inquire about matters such as the following:</p>
                    <ul className="mb-4 space-y-1 list-disc list-inside">
                      {sec.items.map((item, i) => <li key={i} className="text-sm text-foreground">{item}</li>)}
                    </ul>
                  </div>
                  <div className="border-t border-border px-6 py-4 flex items-start gap-4 bg-muted/10">
                    <div style={{width:180}} className="shrink-0">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">PSC? (Y/N / Initials)</p>
                      <Select value={row.psc} onValueChange={v => setSec(sec.id, {psc:v})} disabled={locked}>
                        <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent><SelectItem value="Y">Y</SelectItem><SelectItem value="N">N</SelectItem><SelectItem value="N/A">N/A</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">Responses / comments</p>
                      <Textarea disabled={locked} value={row.response} onChange={e => setSec(sec.id, {response:e.target.value})} placeholder="Enter responses…" className="min-h-[60px] text-sm resize-none bg-background" />
                    </div>
                    <div className="shrink-0 pt-5">
                      <RefButton reference={row.wpRef} onAttach={doc => setSec(sec.id, {wpRef:[...row.wpRef,doc]})} onRemove={i => setSec(sec.id, {wpRef:row.wpRef.filter((_,idx)=>idx!==i)})} disabled={locked} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Conclusion */}
          <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 border-b border-border"><span className="text-sm font-semibold text-foreground">Conclusion</span></div>
            <div className="px-6 py-5 space-y-4">
              {data.concluded && <div className="rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-800 dark:text-green-300">Concluded on {data.concludedOn}</div>}
              <Textarea disabled={locked} value={data.conclusion} onChange={e => setData(d => ({...d, conclusion:e.target.value}))} placeholder="Document your overall conclusion and assessment…" className="min-h-[100px] text-sm resize-none bg-background" />
              <div className="flex justify-end">
                <Button disabled={locked} onClick={() => { const now = new Date().toISOString().slice(0,10); setData(d => { const next = {...d, concluded:true, concludedOn:now}; writeJsonToLocalStorage(storageKey, next); return next; }); }}>Conclude worksheet</Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
