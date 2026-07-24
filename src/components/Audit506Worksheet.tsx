import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AttributedComment } from "@/components/ui/AttributedComment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { WorksheetSignOff, ConcludedRow } from "@/components/WorksheetSignOff";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProcRow { checked: boolean; psc: string; wpRef: RefDoc[]; response: string }
interface Interviewee { who: string; byWhom: string; date: string }

interface Data506 {
  mgmt: Record<string, ProcRow>;
  tcwg: Record<string, ProcRow>;
  partB: Record<string, ProcRow>;
  appendix: Record<string, ProcRow>;
  mgmtInterviewees: Interviewee[];
  tcwgInterviewees: Interviewee[];
  appendixOpen: boolean;
  conclusion: string;
  concluded: boolean;
  concludedOn: string;
}

// ── Data ───────────────────────────────────────────────────────────────────────

const PART_A_MGMT = [
  { id: 'm1', num: '1', description: 'Has management identified any risks of material misstatement in the financial statements due to fraud?' },
  { id: 'm2', num: '2', description: 'Does management have knowledge of any actual, suspected or alleged fraud affecting the entity, including fraud involving employees, management, TCWG or third parties?' },
  { id: 'm3', num: '3', description: "Does management have an understanding of the entity's fraud risk management programs and controls, including specific programs or controls designed to prevent and detect fraud?" },
  { id: 'm4', num: '4', description: 'How does management communicate to employees its views on business practices and ethical behavior? Are there codes of conduct, ethics policies or whistleblower programs in place?' },
  { id: 'm5', num: '5', description: 'Are there any specific areas (such as accounting estimates, journal entries or revenue recognition) where management believes there is a higher risk of fraud or management override of controls?' },
];

const PART_A_TCWG = [
  { id: 't1', num: '1', description: 'Does TCWG have knowledge of any actual, suspected or alleged fraud affecting the entity?' },
  { id: 't2', num: '2', description: "How does TCWG exercise oversight of management's processes for identifying and responding to the risks of fraud and of the internal controls established to mitigate those risks? Are there any concerns about the competence or integrity of management?" },
];

const PART_B = [
  { id: 'b1', num: '1', description: 'Consider whether any fraud risk factors have been identified from the inquiries above and from other risk assessment procedures. If identified, document them.' },
  { id: 'b2', num: '2', description: 'Determine whether any of the identified fraud risk factors indicate the existence of a significant risk of material misstatement due to fraud.' },
  { id: 'b3', num: '3', description: 'Consider whether there are any unusual or unexpected relationships identified during analytical procedures that may indicate a risk of material misstatement due to fraud.' },
  { id: 'b4', num: '4', description: 'Assess the risk of management override of controls. Unless the engagement is otherwise low risk, this risk should generally be treated as a significant risk requiring a specific audit response.' },
  { id: 'b5', num: '5', description: 'Determine whether journal entries and other adjustments need to be tested based on the identified fraud risks and whether there is a presumption of fraud risk in revenue recognition.' },
  { id: 'b6', num: '6', description: 'Consider whether the overall audit plan and approach needs to be updated based on the identified fraud risks, including whether additional audit procedures or changes in timing are required.' },
  { id: 'b7', num: '7', description: 'Consider whether it is necessary to communicate the identified fraud risks to management, TCWG or others (such as regulators) in accordance with professional standards and applicable law.' },
];

const APPENDIX_A = [
  {
    id: 'ap1', num: '1', label: 'Incentive / Pressure',
    description: 'Have you identified any incentive or pressure conditions that may provide a reason for management or employees to commit fraud (e.g., financial pressure, employment pressure, performance-based compensation, personal integrity issues)?',
    reference: 'Management or employees have an incentive or are under pressure that provides a reason to commit fraud. This may include financial pressure (personal financial difficulties, significant bonuses tied to results), employment pressure (fear of losing a job, pressure to meet analyst expectations), or other pressures such as personal integrity issues.',
  },
  {
    id: 'ap2', num: '2', label: 'Opportunity',
    description: 'Have you identified any opportunity conditions that may allow fraud to occur (e.g., absence of controls, ineffective controls, ability to override controls, assets susceptible to misappropriation, complex transactions)?',
    reference: 'Circumstances exist that provide an opportunity to commit fraud, such as the absence of controls, ineffective controls, or the ability to override controls. Opportunities arise when there are assets susceptible to misappropriation, significant estimates and judgements required in financial reporting, complex transactions, or significant related party transactions.',
  },
  {
    id: 'ap3', num: '3', label: 'Rationalization / Attitude',
    description: "Have you identified any rationalization or attitude factors suggesting management or employees may be inclined to commit fraud (e.g., aggressive or unrealistic forecasts, non-compliance with regulations, management integrity concerns)?",
    reference: "An individual is able to rationalize committing a fraudulent act, or an attitude, character or set of ethical values exists that allows management or employees to commit a dishonest act. Management's attitude toward financial reporting (aggressive or unrealistic forecasts, non-compliance with regulations) or employees' attitudes toward the entity or its management may indicate a rationalization of fraudulent behavior.",
  },
];

const MGMT_ROLES = ['CEO', 'CFO', 'COO', 'President', 'Controller', 'VP Finance', 'Managing Director', 'VP Operations', 'Other'];
const TCWG_ROLES = ['Board Chair', 'Audit Committee Chair', 'Board Member', 'Director', 'Independent Director', 'Trustee', 'Other'];
const AUDITOR_OPTIONS = ['Elena Sokolova — Partner', 'Priya Raman — Staff', 'Marcus Chen — CMS'];

// ── Defaults ───────────────────────────────────────────────────────────────────

function emptyProc(): ProcRow { return { checked: false, psc: '', wpRef: [], response: '' }; }
function emptyIv(): Interviewee { return { who: '', byWhom: '', date: '' }; }

function buildDefault(): Data506 {
  const mgmt: Record<string, ProcRow> = {};
  PART_A_MGMT.forEach(p => { mgmt[p.id] = emptyProc(); });
  const tcwg: Record<string, ProcRow> = {};
  PART_A_TCWG.forEach(p => { tcwg[p.id] = emptyProc(); });
  const partB: Record<string, ProcRow> = {};
  PART_B.forEach(p => { partB[p.id] = emptyProc(); });
  const appendix: Record<string, ProcRow> = {};
  APPENDIX_A.forEach(p => { appendix[p.id] = emptyProc(); });
  return {
    mgmt, tcwg, partB, appendix,
    mgmtInterviewees: [emptyIv(), emptyIv(), emptyIv()],
    tcwgInterviewees: [emptyIv(), emptyIv()],
    appendixOpen: false,
    conclusion: '', concluded: false, concludedOn: '',
  };
}

// ── Column headers ─────────────────────────────────────────────────────────────

function ColHeaders({ label }: { label: string }) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="bg-muted border-b border-border">
        <th className="w-10 px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" />
        <th className="w-10 px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider">#</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">{label}</th>
        <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" style={{ width: 140, minWidth: 140 }}>PSC (Y/N)</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider" style={{ minWidth: 380 }}>Response / comments</th>
        <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" style={{ width: 100, minWidth: 100 }}>W/P ref.</th>
      </tr>
    </thead>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export function Audit506Worksheet({ isUS = false }: { isUS?: boolean }) {
  const storageKey = `audit-506-data-${isUS ? 'us' : 'ca'}`;
  const { engagementId = 'default' } = useParams<{ engagementId?: string }>();

  const [data, setData] = useState<Data506>(() => {
    const saved = readJsonFromLocalStorage<Data506 | null>(storageKey, null);
    if (!saved) return buildDefault();
    const def = buildDefault();
    return {
      ...def, ...saved,
      mgmt: { ...def.mgmt, ...(saved.mgmt ?? {}) },
      tcwg: { ...def.tcwg, ...(saved.tcwg ?? {}) },
      partB: { ...def.partB, ...(saved.partB ?? {}) },
      appendix: { ...def.appendix, ...(saved.appendix ?? {}) },
      mgmtInterviewees: saved.mgmtInterviewees?.length ? saved.mgmtInterviewees : def.mgmtInterviewees,
      tcwgInterviewees: saved.tcwgInterviewees?.length ? saved.tcwgInterviewees : def.tcwgInterviewees,
    };
  });

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 600);
    return () => clearTimeout(t);
  }, [data, storageKey]);

  const locked = data.concluded;

  // ── Handlers ──────────────────────────────────────────────────────────────

  function setMgmt(id: string, patch: Partial<ProcRow>) {
    setData(d => ({ ...d, mgmt: { ...d.mgmt, [id]: { ...d.mgmt[id], ...patch } } }));
  }
  function setTcwg(id: string, patch: Partial<ProcRow>) {
    setData(d => ({ ...d, tcwg: { ...d.tcwg, [id]: { ...d.tcwg[id], ...patch } } }));
  }
  function setPartB(id: string, patch: Partial<ProcRow>) {
    setData(d => ({ ...d, partB: { ...d.partB, [id]: { ...d.partB[id], ...patch } } }));
  }
  function setAppendix(id: string, patch: Partial<ProcRow>) {
    setData(d => ({ ...d, appendix: { ...d.appendix, [id]: { ...d.appendix[id], ...patch } } }));
  }

  function setMgmtIv(idx: number, patch: Partial<Interviewee>) {
    setData(d => { const list = [...d.mgmtInterviewees]; list[idx] = { ...list[idx], ...patch }; return { ...d, mgmtInterviewees: list }; });
  }
  function setTcwgIv(idx: number, patch: Partial<Interviewee>) {
    setData(d => { const list = [...d.tcwgInterviewees]; list[idx] = { ...list[idx], ...patch }; return { ...d, tcwgInterviewees: list }; });
  }
  function addMgmtIv() { setData(d => ({ ...d, mgmtInterviewees: [...d.mgmtInterviewees, emptyIv()] })); }
  function removeMgmtIv(idx: number) {
    setData(d => { const list = d.mgmtInterviewees.filter((_, i) => i !== idx); return { ...d, mgmtInterviewees: list.length ? list : [emptyIv()] }; });
  }
  function addTcwgIv() { setData(d => ({ ...d, tcwgInterviewees: [...d.tcwgInterviewees, emptyIv()] })); }
  function removeTcwgIv(idx: number) {
    setData(d => { const list = d.tcwgInterviewees.filter((_, i) => i !== idx); return { ...d, tcwgInterviewees: list.length ? list : [emptyIv()] }; });
  }

  function conclude() {
    const u = { ...data, concluded: true, concludedOn: new Date().toISOString() };
    setData(u);
    writeJsonToLocalStorage(storageKey, u);
  }

  // ── Interviewees table ─────────────────────────────────────────────────────

  function InterviewTable({ list, roles, onSet, onAdd, onRemove }: {
    list: Interviewee[];
    roles: string[];
    onSet: (idx: number, patch: Partial<Interviewee>) => void;
    onAdd: () => void;
    onRemove: (idx: number) => void;
  }) {
    return (
      <div className="px-6 pt-3 pb-3 border-b border-border bg-muted/[0.03]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Interviewees</p>
          {!locked && (
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={onAdd}>
              <Plus className="h-3.5 w-3.5" />Add row
            </Button>
          )}
        </div>
        <div className="rounded border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted text-xs font-semibold text-foreground uppercase tracking-wider border-b border-border">
                <th className="px-3 py-2 text-left">Who interviewed</th>
                <th className="px-3 py-2 text-left border-l border-border">By whom (auditor)</th>
                <th className="px-3 py-2 text-left border-l border-border" style={{ width: 160 }}>Date</th>
                {!locked && <th className="w-9" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((iv, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-2 py-1">
                    <Select value={iv.who} onValueChange={v => onSet(i, { who: v })} disabled={locked}>
                      <SelectTrigger className="h-7 text-sm border-0 shadow-none bg-transparent focus:ring-0 focus:ring-offset-0 px-2">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-2 py-1 border-l border-border">
                    <Select value={iv.byWhom} onValueChange={v => onSet(i, { byWhom: v })} disabled={locked}>
                      <SelectTrigger className="h-7 text-sm border-0 shadow-none bg-transparent focus:ring-0 focus:ring-offset-0 px-2">
                        <SelectValue placeholder="Select auditor" />
                      </SelectTrigger>
                      <SelectContent>
                        {AUDITOR_OPTIONS.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-2 py-1 border-l border-border" style={{ width: 160 }}>
                    <Input type="date" disabled={locked} value={iv.date} onChange={e => onSet(i, { date: e.target.value })}
                      className="h-7 text-sm border-0 shadow-none px-2 focus-visible:ring-0 bg-transparent" />
                  </td>
                  {!locked && (
                    <td className="px-2 text-center">
                      <button type="button" onClick={() => onRemove(i)} className="text-muted-foreground/40 hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── Procedure rows ─────────────────────────────────────────────────────────

  function ProcRows({ items, store, setFn, prefix }: {
    items: { id: string; num: string; description: string }[];
    store: Record<string, ProcRow>;
    setFn: (id: string, patch: Partial<ProcRow>) => void;
    prefix: string;
  }) {
    return (
      <>
        {items.map(proc => {
          const row = store[proc.id] ?? emptyProc();
          return (
            <tr key={proc.id} className="hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 text-center align-top">
                <Checkbox checked={row.checked} onCheckedChange={v => setFn(proc.id, { checked: !!v })} disabled={locked} />
              </td>
              <td className="px-4 py-3 text-center align-top text-xs font-semibold font-mono text-foreground">{proc.num}</td>
              <td className="px-6 py-3 align-top text-sm text-foreground border-l-2 border-primary/20">{proc.description}</td>
              <td className="px-4 py-3 align-top" style={{ width: 140 }}>
                <Select value={row.psc} onValueChange={v => setFn(proc.id, { psc: v })} disabled={locked}>
                  <SelectTrigger className="h-8 text-sm bg-background"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">Y</SelectItem>
                    <SelectItem value="N">N</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="px-6 py-3 align-top" style={{ minWidth: 380 }}>
                <AttributedComment value={row.response} onChange={v => setFn(proc.id, { response: v })}
                  storageKey={`506-${isUS ? 'us' : 'ca'}-${prefix}-${proc.id}`}
                  placeholder="Enter response…" disabled={locked} className="min-h-[60px] text-sm resize-none bg-background" />
              </td>
              <td className="px-4 py-3 align-top text-center" style={{ width: 100 }}>
                <RefButton reference={row.wpRef}
                  onAttach={doc => setFn(proc.id, { wpRef: [...row.wpRef, doc] })}
                  onRemove={i => setFn(proc.id, { wpRef: row.wpRef.filter((_, idx) => idx !== i) })}
                  disabled={locked} />
              </td>
            </tr>
          );
        })}
      </>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full">

      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          To document inquiries about fraud risks performed as part of the risk assessment.{" "}
          <span className="font-medium text-foreground">Part A</span> covers required inquiries of management, others in the entity, and TCWG.{" "}
          <span className="font-medium text-foreground">Part B</span> covers other fraud risk assessment procedures.{" "}
          <span className="font-medium text-foreground">PSC</span> = Procedure successfully completed.{" "}
          <span className="font-medium text-foreground">TCWG</span> = Those charged with governance.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* ── Part A ─────────────────────────────────────────────────── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Part A — Required inquiries</span>
            </div>

            {/* Management & Others */}
            <div className="border-b border-border">
              <div className="px-6 pt-4 pb-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Management and Others</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              </div>
              <InterviewTable
                list={data.mgmtInterviewees} roles={MGMT_ROLES}
                onSet={setMgmtIv} onAdd={addMgmtIv} onRemove={removeMgmtIv}
              />
              <p className="px-6 pt-3 pb-0.5 text-xs text-muted-foreground italic">Inquire about the following:</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <ColHeaders label="Inquiry" />
                  <tbody className="divide-y divide-border">
                    <ProcRows items={PART_A_MGMT} store={data.mgmt} setFn={setMgmt} prefix="mgmt" />
                  </tbody>
                </table>
              </div>
            </div>

            {/* TCWG */}
            <div>
              <div className="px-6 pt-4 pb-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Those Charged with Governance (TCWG)</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              </div>
              <InterviewTable
                list={data.tcwgInterviewees} roles={TCWG_ROLES}
                onSet={setTcwgIv} onAdd={addTcwgIv} onRemove={removeTcwgIv}
              />
              <p className="px-6 pt-3 pb-0.5 text-xs text-muted-foreground italic">Inquire about the following:</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <ColHeaders label="Inquiry" />
                  <tbody className="divide-y divide-border">
                    <ProcRows items={PART_A_TCWG} store={data.tcwg} setFn={setTcwg} prefix="tcwg" />
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Part B ─────────────────────────────────────────────────── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Part B — Other fraud risk assessment procedures</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <ColHeaders label="Procedure" />
                <tbody className="divide-y divide-border">
                  <ProcRows items={PART_B} store={data.partB} setFn={setPartB} prefix="partb" />
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Appendix A ──────────────────────────────────────────────── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <button
              className="w-full px-6 py-3.5 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
              onClick={() => setData(d => ({ ...d, appendixOpen: !d.appendixOpen }))}
            >
              <div>
                <span className="text-sm font-semibold text-foreground">Appendix A — Characteristics of fraud (fraud triangle assessment)</span>
                <p className="text-xs text-muted-foreground mt-0.5">Click to expand and assess each fraud risk factor.</p>
              </div>
              {data.appendixOpen
                ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </button>
            {data.appendixOpen && (
              <div className="border-t border-border">
                <p className="px-6 pt-4 pb-1 text-xs text-muted-foreground">
                  Assess each element of the fraud triangle to determine whether conditions for fraud are present. These three conditions are often referred to as the "fraud triangle."
                  <span className="italic"> Note: The presence of fraud risk factors does not necessarily indicate fraud exists. However, they should be considered when assessing the risk of material misstatement due to fraud.</span>
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <ColHeaders label="Fraud risk factor" />
                    <tbody className="divide-y divide-border">
                      {APPENDIX_A.map(item => {
                        const row = data.appendix[item.id] ?? emptyProc();
                        return (
                          <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3 text-center align-top">
                              <Checkbox checked={row.checked} onCheckedChange={v => setAppendix(item.id, { checked: !!v })} disabled={locked} />
                            </td>
                            <td className="px-4 py-3 text-center align-top text-xs font-semibold font-mono text-foreground">{item.num}</td>
                            <td className="px-6 py-3 align-top border-l-2 border-primary/20">
                              <p className="text-xs font-semibold text-foreground mb-1">{item.label}</p>
                              <p className="text-sm text-foreground">{item.description}</p>
                              <p className="text-xs text-muted-foreground mt-1.5 italic">{item.reference}</p>
                            </td>
                            <td className="px-4 py-3 align-top" style={{ width: 140 }}>
                              <Select value={row.psc} onValueChange={v => setAppendix(item.id, { psc: v })} disabled={locked}>
                                <SelectTrigger className="h-8 text-sm bg-background"><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Y">Y</SelectItem>
                                  <SelectItem value="N">N</SelectItem>
                                  <SelectItem value="N/A">N/A</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-6 py-3 align-top" style={{ minWidth: 380 }}>
                              <Textarea disabled={locked} value={row.response}
                                onChange={e => setAppendix(item.id, { response: e.target.value })}
                                placeholder="Document findings and assessment…"
                                className="min-h-[72px] text-sm resize-y bg-background" />
                            </td>
                            <td className="px-4 py-3 align-top text-center" style={{ width: 100 }}>
                              <RefButton reference={row.wpRef}
                                onAttach={doc => setAppendix(item.id, { wpRef: [...row.wpRef, doc] })}
                                onRemove={i => setAppendix(item.id, { wpRef: row.wpRef.filter((_, idx) => idx !== i) })}
                                disabled={locked} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── Conclusion ───────────────────────────────────────────────── */}
          <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 border-b border-border">
              <span className="text-sm font-semibold text-foreground">Conclusion</span>
            </div>
            <div className="px-6 py-5 space-y-4">
              <Textarea disabled={locked} value={data.conclusion}
                onChange={e => setData(d => ({ ...d, conclusion: e.target.value }))}
                placeholder="Document your overall conclusion and assessment of the fraud risk inquiries performed…"
                className="min-h-[100px] text-sm resize-none bg-background" />
              {locked
                ? <ConcludedRow concludedOn={data.concludedOn}
                    onReopen={() => { const u = { ...data, concluded: false, concludedOn: '' }; setData(u); writeJsonToLocalStorage(storageKey, u); }} />
                : <div className="flex justify-end"><Button onClick={conclude}>Conclude worksheet</Button></div>
              }
            </div>
          </div>

          {/* ── Sign-off ──────────────────────────────────────────────────── */}
          <WorksheetSignOff worksheetKey="506" engagementId={engagementId} />

        </div>
      </div>
    </div>
  );
}
