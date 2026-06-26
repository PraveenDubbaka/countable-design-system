import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, ChevronDown, ChevronRight } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProcRow { psc: string; wpRef: RefDoc[]; response: string }
interface InterviewLog { who: string; byWhom: string; date: string }
interface Data506 {
  mgmtInterviews: InterviewLog[];
  tcwgInterviews: InterviewLog[];
  procedures: Record<string, ProcRow>;
  appendixOpen: boolean;
  conclusion: string; concluded: boolean; concludedOn: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

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
  { id: 'b1', num: '1', description: 'Consider whether any fraud risk factors have been identified from the inquiries above and from other risk assessment procedures. If identified, document them on Form 520.' },
  { id: 'b2', num: '2', description: 'Determine whether any of the identified fraud risk factors indicate the existence of a significant risk of material misstatement due to fraud.' },
  { id: 'b3', num: '3', description: 'Consider whether there are any unusual or unexpected relationships identified during analytical procedures that may indicate a risk of material misstatement due to fraud.' },
  { id: 'b4', num: '4', description: 'Assess the risk of management override of controls. Unless the engagement is otherwise low risk, this risk should generally be treated as a significant risk requiring a specific audit response.' },
  { id: 'b5', num: '5', description: 'Determine whether journal entries and other adjustments need to be tested based on the identified fraud risks and whether there is a presumption of fraud risk in revenue recognition.' },
  { id: 'b6', num: '6', description: 'Consider whether the overall audit plan and approach needs to be updated based on the identified fraud risks, including whether additional audit procedures or changes in timing are required.' },
  { id: 'b7', num: '7', description: 'Consider whether it is necessary to communicate the identified fraud risks to management, TCWG or others (such as regulators) in accordance with professional standards and applicable law.' },
];

const ALL_PROC_IDS = [...PART_A_MGMT, ...PART_A_TCWG, ...PART_B].map(p => p.id);

const MGMT_ROLES = ['CEO', 'CFO', 'COO', 'President', 'Controller', 'VP Finance', 'Managing Director', 'VP Operations', 'Other'];
const TCWG_ROLES = ['Board Chair', 'Audit Committee Chair', 'Board Member', 'Director', 'Independent Director', 'Trustee', 'Other'];
const AUDITOR_OPTIONS = ['Elena Sokolova — Partner', 'Priya Raman — Staff', 'Marcus Chen — CMS'];

function emptyIv(): InterviewLog { return { who: '', byWhom: '', date: '' }; }
function emptyProc(): ProcRow { return { psc: '', wpRef: [], response: '' }; }

function buildDefault(): Data506 {
  const procedures: Record<string, ProcRow> = {};
  ALL_PROC_IDS.forEach(id => { procedures[id] = emptyProc(); });
  return {
    mgmtInterviews: [emptyIv(), emptyIv(), emptyIv()],
    tcwgInterviews: [emptyIv(), emptyIv()],
    procedures,
    appendixOpen: false,
    conclusion: '', concluded: false, concludedOn: '',
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

export function Audit506Worksheet({ isUS = false }: { isUS?: boolean }) {
  const storageKey = `audit-506-data-${isUS ? 'us' : 'ca'}`;

  const [data, setData] = useState<Data506>(() => {
    const saved = readJsonFromLocalStorage<Data506 | null>(storageKey, null);
    if (!saved) return buildDefault();
    const def = buildDefault();
    return {
      ...def, ...saved,
      mgmtInterviews: saved.mgmtInterviews?.length === 3 ? saved.mgmtInterviews : def.mgmtInterviews,
      tcwgInterviews: saved.tcwgInterviews?.length === 2 ? saved.tcwgInterviews : def.tcwgInterviews,
      procedures: { ...def.procedures, ...(saved.procedures ?? {}) },
    };
  });

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 600);
    return () => clearTimeout(t);
  }, [data, storageKey]);

  const locked = data.concluded;
  function setMgmtIv(idx: number, patch: Partial<InterviewLog>) {
    setData(d => { const list = [...d.mgmtInterviews]; list[idx] = { ...list[idx], ...patch }; return { ...d, mgmtInterviews: list }; });
  }
  function setTcwgIv(idx: number, patch: Partial<InterviewLog>) {
    setData(d => { const list = [...d.tcwgInterviews]; list[idx] = { ...list[idx], ...patch }; return { ...d, tcwgInterviews: list }; });
  }
  function setProc(id: string, patch: Partial<ProcRow>) {
    setData(d => ({ ...d, procedures: { ...d.procedures, [id]: { ...d.procedures[id], ...patch } } }));
  }

  function renderInterviewTable(interviews: InterviewLog[], setIv: (idx: number, patch: Partial<InterviewLog>) => void, roles: string[]) {
    return (
      <div className="rounded-md border border-border overflow-hidden mb-4">
        <table className="w-full">
          <thead>
            <tr className="bg-muted text-xs font-semibold text-foreground uppercase tracking-wider border-b border-border">
              <th className="px-4 py-2 text-left">Who interviewed</th>
              <th className="px-4 py-2 text-left border-l border-border">By whom</th>
              <th className="w-[160px] px-4 py-2 text-left border-l border-border" style={{minWidth:160}}>Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {interviews.map((iv, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="px-2 py-1.5">
                  <Select value={iv.who} onValueChange={v => setIv(i, {who: v})} disabled={locked}>
                    <SelectTrigger className="h-8 text-sm bg-background">
                      <SelectValue placeholder="Select name / role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-2 py-1.5 border-l border-border">
                  <Select value={iv.byWhom} onValueChange={v => setIv(i, {byWhom: v})} disabled={locked}>
                    <SelectTrigger className="h-8 text-sm bg-background">
                      <SelectValue placeholder="Select auditor" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDITOR_OPTIONS.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </td>
                <td className="w-[160px] px-2 py-1.5 border-l border-border" style={{minWidth:160}}>
                  <Input type="date" disabled={locked} value={iv.date} onChange={e => setIv(i, {date: e.target.value})} className="h-8 text-sm bg-background" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderProcRows(procs: typeof PART_A_MGMT) {
    return procs.map(proc => {
      const row = data.procedures[proc.id];
      return (
        <tr key={proc.id} className="hover:bg-muted/50 transition-colors border-b border-border last:border-0">
          <td className="px-4 py-3 text-center align-top text-xs font-semibold font-mono text-foreground">{proc.num}</td>
          <td className="px-6 py-3 align-top text-sm text-foreground">{proc.description}</td>
          <td className="px-4 py-3 align-top" style={{width:150}}>
            <Select value={row.psc} onValueChange={v => setProc(proc.id, {psc:v})} disabled={locked}>
              <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent><SelectItem value="Y">Y</SelectItem><SelectItem value="N">N</SelectItem><SelectItem value="N/A">N/A</SelectItem></SelectContent>
            </Select>
          </td>
          <td className="px-4 py-3 align-top text-center" style={{width:110}}>
            <RefButton reference={row.wpRef} onAttach={doc => setProc(proc.id, {wpRef:[...row.wpRef,doc]})} onRemove={i => setProc(proc.id, {wpRef:row.wpRef.filter((_,idx)=>idx!==i)})} disabled={locked} />
          </td>
          <td className="px-6 py-3 align-top">
            <Textarea disabled={locked} value={row.response} onChange={e => setProc(proc.id, {response:e.target.value})} placeholder="Enter response…" className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent" />
          </td>
        </tr>
      );
    });
  }

  const PROC_THEAD = (
    <thead className="sticky top-0 z-10">
      <tr className="bg-muted border-b border-border">
        <th className="w-10 px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider">#</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Procedure</th>
        <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" style={{width:150,minWidth:150}}>PSC? (Y/N)</th>
        <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" style={{width:110,minWidth:110}}>W/P ref.</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Response / comments</th>
      </tr>
    </thead>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          To document inquiries about fraud risks performed as part of the risk assessment. <span className="font-medium text-foreground">Part A</span> covers required inquiries of management, others in the entity, and TCWG. <span className="font-medium text-foreground">Part B</span> covers other fraud risk assessment procedures. Record identified fraud risk factors on <span className="font-medium text-foreground">Form 520</span>.{" "}
          <span className="font-medium text-foreground">PSC</span> = Procedure successfully completed. <span className="font-medium text-foreground">TCWG</span> = Those charged with governance.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* Part A */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Part A — Required inquiries</span>
            </div>

            {/* Management & Others sub-section */}
            <div className="px-6 pt-5 pb-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Management and Others</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <p className="text-xs text-muted-foreground mb-2">Document who was interviewed:</p>
              {renderInterviewTable(data.mgmtInterviews, setMgmtIv, MGMT_ROLES)}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                {PROC_THEAD}
                <tbody className="divide-y divide-border">{renderProcRows(PART_A_MGMT)}</tbody>
              </table>
            </div>

            {/* TCWG sub-section */}
            <div className="px-6 pt-5 pb-0 border-t border-border">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Those Charged with Governance (TCWG)</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <p className="text-xs text-muted-foreground mb-2">Document who was interviewed:</p>
              {renderInterviewTable(data.tcwgInterviews, setTcwgIv, TCWG_ROLES)}
            </div>
            <div className="overflow-x-auto border-t border-border">
              <table className="w-full">
                {PROC_THEAD}
                <tbody className="divide-y divide-border">{renderProcRows(PART_A_TCWG)}</tbody>
              </table>
            </div>
          </div>

          {/* Part B */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Part B — Other fraud risk assessment procedures</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                {PROC_THEAD}
                <tbody className="divide-y divide-border">{renderProcRows(PART_B)}</tbody>
              </table>
            </div>
          </div>

          {/* Appendix A */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <button
              className="w-full px-6 py-3.5 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
              onClick={() => setData(d => ({...d, appendixOpen:!d.appendixOpen}))}
            >
              <div>
                <span className="text-sm font-semibold text-foreground">Appendix A — Characteristics of fraud (reference)</span>
                <p className="text-xs text-muted-foreground mt-0.5">Read-only reference. Click to expand.</p>
              </div>
              {data.appendixOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </button>
            {data.appendixOpen && (
              <div className="border-t border-border px-6 py-5 space-y-5 bg-muted/10">
                <p className="text-xs text-muted-foreground">The following characteristics of fraud may be relevant when identifying and assessing fraud risks. These three conditions are often referred to as the "fraud triangle."</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">1. Incentive / Pressure</p>
                    <p className="text-sm text-muted-foreground">Management or employees have an incentive or are under pressure that provides a reason to commit fraud. This may include financial pressure (personal financial difficulties, significant bonuses tied to results), employment pressure (fear of losing a job, pressure to meet analyst expectations), or other pressures such as personal integrity issues.</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">2. Opportunity</p>
                    <p className="text-sm text-muted-foreground">Circumstances exist that provide an opportunity to commit fraud, such as the absence of controls, ineffective controls, or the ability to override controls. Opportunities arise when there are assets susceptible to misappropriation, significant estimates and judgements required in financial reporting, complex transactions, or significant related party transactions.</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">3. Rationalization / Attitude</p>
                    <p className="text-sm text-muted-foreground">An individual is able to rationalize committing a fraudulent act, or an attitude, character or set of ethical values exists that allows management or employees to commit a dishonest act. Management's attitude toward financial reporting (aggressive or unrealistic forecasts, non-compliance with regulations) or employees' attitudes toward the entity or its management may indicate a rationalization of fraudulent behavior.</p>
                  </div>
                  <p className="text-xs text-muted-foreground italic">Note: The presence of fraud risk factors does not necessarily indicate fraud exists. However, they should be considered when assessing the risk of material misstatement due to fraud.</p>
                </div>
              </div>
            )}
          </div>

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
