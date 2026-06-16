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

interface PartARow { checked: boolean; psc: string; exceptions: string; wpRef: RefDoc[] }
interface FinRow   { current: string; budget: string; prior: string; hasIssue: string; explanation: string; auditResponse: string }
interface MatterRow { partBRef: string; summary: string; mgmtResponse: string; auditImplications: string }

interface PAP501Data {
  entity: string; periodEnded: string; perfMateriality: string;
  activeTab: 'a' | 'b' | 'c';
  partA: Record<string, PartARow>;
  numStreams: number;
  streamLabels: string[];
  fin: Record<string, FinRow>;
  matters: MatterRow[];
  fraudAnswer: string;
  preparedBy: string; preparedDate: string; reviewedBy: string; reviewedDate: string;
  concluded: boolean; concludedOn: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const PART_A_PROCS = [
  { id: 'pa-1', num: '1', description: 'Obtain a copy of the most recent financial results/trial balance and relevant information (financial and non-financial) available from the entity.', items: [] as {id:string;label:string}[] },
  { id: 'pa-2', num: '2', description: 'Ensure that the information obtained is reliable and adequate for the purposes of performing analytical procedures.', items: [] },
  { id: 'pa-3', num: '3', description: 'Review the information obtained, and identify any:', items: [
    { id: 'pa-3a', label: 'Inconsistencies with our understanding of the entity.' },
    { id: 'pa-3b', label: 'Negative trends, or other unusual relationships, including those related to revenue accounts.' },
    { id: 'pa-3c', label: 'Potential fraud.' },
  ]},
  { id: 'pa-4', num: '4', description: 'Inquire of management about the reasons for any:', items: [
    { id: 'pa-4a', label: 'Inconsistencies, fluctuations and unexpected relationships.' },
    { id: 'pa-4b', label: 'Unusual transactions/events or other material misstatements.' },
  ]},
  { id: 'pa-5', num: '5', description: 'Assess whether the explanations from management indicate the possible existence of the following:', items: [
    { id: 'pa-5a', label: 'Unusual transactions/events or other material misstatements that require a specific audit response.' },
    { id: 'pa-5b', label: 'Fraud.' },
  ]},
];

const ALL_PA_IDS = PART_A_PROCS.flatMap(p => [p.id, ...p.items.map(i => i.id)]);

const IS_IDS  = ['s1','s2','s3','s4','s5','cos1','cos2','cos3','cos4','cos5','or1','or2','exp-sal','exp-occ','exp-int','exp-bon','exp-rep','exp-bad','exp-non','exp-oth1','exp-oth2','exp-oth3'];
const BS_IDS  = ['ca-cash','ca-inv','ca-ar','ca-inventory','ca-oth1','ca-oth2','lta-ppe','lta-oth1','lta-oth2','lta-oth3','cl-bank','cl-ap','cl-tax','cl-fut','cl-def','cl-dep','cl-std','cl-cpltd','cl-oth1','cl-oth2','ltl-loan','ltl-fut','ltl-ltd','ltl-oth1','ltl-oth2','eq-ret','eq-con','eq-shr','eq-oth'];
const RAT_IDS = ['rat-wc','rat-drecv','rat-dinv','rat-iturn','rat-dpay','rat-dte'];
const ALL_FIN_IDS = [...IS_IDS, ...BS_IDS, ...RAT_IDS];

function emptyPA(): PartARow { return { checked: false, psc: '', exceptions: '', wpRef: [] }; }
function emptyFin(): FinRow  { return { current: '', budget: '', prior: '', hasIssue: '', explanation: '', auditResponse: '' }; }
function emptyMatter(): MatterRow { return { partBRef: '', summary: '', mgmtResponse: '', auditImplications: '' }; }

function buildDefault(): PAP501Data {
  const partA: Record<string, PartARow> = {};
  ALL_PA_IDS.forEach(id => { partA[id] = emptyPA(); });
  const fin: Record<string, FinRow> = {};
  ALL_FIN_IDS.forEach(id => { fin[id] = emptyFin(); });
  return {
    entity: '', periodEnded: '', perfMateriality: '', activeTab: 'a',
    partA, numStreams: 1,
    streamLabels: ['Product category', 'Stream 2', 'Stream 3', 'Stream 4', 'Stream 5'],
    fin, matters: Array(10).fill(null).map(emptyMatter),
    fraudAnswer: '', preparedBy: '', preparedDate: '', reviewedBy: '', reviewedDate: '',
    concluded: false, concludedOn: '',
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function p(s: string): number { const v = parseFloat(s.replace(/[^0-9.-]/g, '')); return isNaN(v) ? 0 : v; }
function fmtN(n: number): string { if (n === 0) return ''; return Math.abs(n).toLocaleString('en-CA', {maximumFractionDigits: 0}) + (n < 0 ? ' (-)' : ''); }
function fmtP(n: number | null): string { if (n === null || !isFinite(n) || isNaN(n)) return '—'; return (n * 100).toFixed(1) + '%'; }
function sum(ids: string[], field: keyof Pick<FinRow,'current'|'budget'|'prior'>, fin: Record<string, FinRow>): number {
  return ids.reduce((a, id) => a + p(fin[id]?.[field] ?? ''), 0);
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function TdInput({ value, onChange, placeholder, className = '' }: { value: string; onChange: (v:string)=>void; placeholder?: string; className?: string }) {
  return <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`h-8 text-sm ${className}`} />;
}

// Part A column headers
function PartAColHeaders() {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="bg-muted border-b border-border">
        <th className="w-10 px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" />
        <th className="w-10 px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider">#</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Procedure</th>
        <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" style={{width:180,minWidth:180}}>PSC? (Y/N / Initials)</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Summarize exceptions or findings</th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" style={{width:110,minWidth:110}}>W/P ref.</th>
      </tr>
    </thead>
  );
}

// Part B financial table column headers
function FinColHeaders({ showBudget }: { showBudget: boolean }) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="bg-muted border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
        <th className="px-4 py-2.5 text-left" style={{minWidth:200}}>Description</th>
        <th className="px-3 py-2.5 text-right border-l border-border" style={{width:120,minWidth:120}}>Current period</th>
        {showBudget && <th className="px-3 py-2.5 text-right border-l border-border" style={{width:120,minWidth:120}}>Budget / forecast</th>}
        <th className="px-3 py-2.5 text-right border-l border-border" style={{width:120,minWidth:120}}>Prior period</th>
        {showBudget && <>
          <th className="px-3 py-2.5 text-right border-l border-border bg-blue-50/50 dark:bg-blue-950/20" style={{width:90,minWidth:90}}>vs Budget $</th>
          <th className="px-3 py-2.5 text-right border-l border-border bg-blue-50/50 dark:bg-blue-950/20" style={{width:70,minWidth:70}}>vs Budget %</th>
        </>}
        <th className="px-3 py-2.5 text-right border-l border-border bg-purple-50/50 dark:bg-purple-950/20" style={{width:90,minWidth:90}}>vs Prior $</th>
        <th className="px-3 py-2.5 text-right border-l border-border bg-purple-50/50 dark:bg-purple-950/20" style={{width:70,minWidth:70}}>vs Prior %</th>
        <th className="px-3 py-2.5 text-center border-l border-border" style={{width:90,minWidth:90}}>Matter?</th>
        <th className="px-3 py-2.5 text-left border-l border-border" style={{minWidth:180}}>If yes, describe matter</th>
        <th className="px-3 py-2.5 text-left border-l border-border" style={{width:140,minWidth:140}}>Audit response ref.</th>
      </tr>
    </thead>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function AuditPAP501Worksheet({ isUS = false }: { isUS?: boolean }) {
  const storageKey = `audit-pap501-data-${isUS ? 'us' : 'ca'}`;

  const [data, setData] = useState<PAP501Data>(() => {
    const saved = readJsonFromLocalStorage<PAP501Data | null>(storageKey, null);
    if (!saved) return buildDefault();
    const def = buildDefault();
    return {
      ...def, ...saved,
      partA: { ...def.partA, ...(saved.partA ?? {}) },
      fin:   { ...def.fin,   ...(saved.fin ?? {}) },
      matters: saved.matters?.length === 10 ? saved.matters : def.matters,
    };
  });

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 600);
    return () => clearTimeout(t);
  }, [data, storageKey]);

  const locked = data.concluded;
  const set = (patch: Partial<PAP501Data>) => setData(d => ({ ...d, ...patch }));

  function setPA(id: string, patch: Partial<PartARow>) {
    setData(d => ({ ...d, partA: { ...d.partA, [id]: { ...d.partA[id], ...patch } } }));
  }
  function setFin(id: string, patch: Partial<FinRow>) {
    setData(d => ({ ...d, fin: { ...d.fin, [id]: { ...d.fin[id], ...patch } } }));
  }
  function setMatter(idx: number, patch: Partial<MatterRow>) {
    setData(d => {
      const matters = [...d.matters];
      matters[idx] = { ...matters[idx], ...patch };
      return { ...d, matters };
    });
  }

  // ── Derived financial totals ─────────────────────────────────────────────────

  const f = data.fin;
  const n = data.numStreams;
  const salesIds  = ['s1','s2','s3','s4','s5'].slice(0, n);
  const cosIds    = ['cos1','cos2','cos3','cos4','cos5'].slice(0, n);
  const expIds    = ['exp-sal','exp-occ','exp-int','exp-bon','exp-rep','exp-bad','exp-non','exp-oth1','exp-oth2','exp-oth3'];
  const orIds     = ['or1','or2'];

  const totalSales  = { c: sum(salesIds,'current',f),  b: sum(salesIds,'budget',f),  pr: sum(salesIds,'prior',f) };
  const totalCos    = { c: sum(cosIds,'current',f),    b: sum(cosIds,'budget',f),    pr: sum(cosIds,'prior',f) };
  const totalGM     = { c: totalSales.c - totalCos.c,   b: totalSales.b - totalCos.b, pr: totalSales.pr - totalCos.pr };
  const totalOR     = { c: sum(orIds,'current',f),     b: sum(orIds,'budget',f),     pr: sum(orIds,'prior',f) };
  const totalExp    = { c: sum(expIds,'current',f),    b: sum(expIds,'budget',f),    pr: sum(expIds,'prior',f) };
  const netIncome   = { c: totalGM.c + totalOR.c - totalExp.c, b: totalGM.b + totalOR.b - totalExp.b, pr: totalGM.pr + totalOR.pr - totalExp.pr };

  const caIds  = ['ca-cash','ca-inv','ca-ar','ca-inventory','ca-oth1','ca-oth2'];
  const ltaIds = ['lta-ppe','lta-oth1','lta-oth2','lta-oth3'];
  const clIds  = ['cl-bank','cl-ap','cl-tax','cl-fut','cl-def','cl-dep','cl-std','cl-cpltd','cl-oth1','cl-oth2'];
  const ltlIds = ['ltl-loan','ltl-fut','ltl-ltd','ltl-oth1','ltl-oth2'];
  const eqIds  = ['eq-ret','eq-con','eq-shr','eq-oth'];

  const totalCA  = { c: sum(caIds,'current',f),  b: sum(caIds,'budget',f),  pr: sum(caIds,'prior',f) };
  const totalLTA = { c: sum(ltaIds,'current',f), b: sum(ltaIds,'budget',f), pr: sum(ltaIds,'prior',f) };
  const totalA   = { c: totalCA.c + totalLTA.c,  b: totalCA.b + totalLTA.b, pr: totalCA.pr + totalLTA.pr };
  const totalCL  = { c: sum(clIds,'current',f),  b: sum(clIds,'budget',f),  pr: sum(clIds,'prior',f) };
  const totalLTL = { c: sum(ltlIds,'current',f), b: sum(ltlIds,'budget',f), pr: sum(ltlIds,'prior',f) };
  const totalL   = { c: totalCL.c + totalLTL.c,  b: totalCL.b + totalLTL.b, pr: totalCL.pr + totalLTL.pr };
  const totalEQ  = { c: sum(eqIds,'current',f),  b: sum(eqIds,'budget',f),  pr: sum(eqIds,'prior',f) };
  const totalLE  = { c: totalL.c + totalEQ.c,    b: totalL.b + totalEQ.b,   pr: totalL.pr + totalEQ.pr };

  // ── Row renderers ────────────────────────────────────────────────────────────

  // Part A top-level row
  function PATopRow({ proc }: { proc: typeof PART_A_PROCS[0] }) {
    const row = data.partA[proc.id];
    return (
      <tr className="hover:bg-muted/50 transition-colors border-b border-border">
        <td className="px-4 py-3 text-center align-top"><Checkbox checked={row.checked} onCheckedChange={v => setPA(proc.id, { checked: !!v })} disabled={locked} /></td>
        <td className="px-4 py-3 text-center align-top text-xs font-semibold font-mono text-foreground">{proc.num}</td>
        <td className="px-6 py-3 align-top text-sm text-foreground">{proc.description}</td>
        <td className="px-4 py-3 align-top" style={{width:180}}>
          <Select value={row.psc} onValueChange={v => setPA(proc.id, { psc: v })} disabled={locked}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent><SelectItem value="Y">Y</SelectItem><SelectItem value="N">N</SelectItem><SelectItem value="N/A">N/A</SelectItem></SelectContent>
          </Select>
        </td>
        <td className="px-6 py-3 align-top">
          <Textarea disabled={locked} value={row.exceptions} onChange={e => setPA(proc.id, { exceptions: e.target.value })} placeholder="Enter exceptions or findings…" className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent" />
        </td>
        <td className="px-4 py-3 align-top text-center" style={{width:110}}>
          <RefButton reference={row.wpRef} onAttach={doc => setPA(proc.id, { wpRef: [...row.wpRef, doc] })} onRemove={i => setPA(proc.id, { wpRef: row.wpRef.filter((_,idx)=>idx!==i) })} disabled={locked} />
        </td>
      </tr>
    );
  }

  function PASubRow({ item, letterIdx }: { item:{id:string;label:string}; letterIdx:number }) {
    const row = data.partA[item.id];
    return (
      <tr className="bg-muted/[0.03] hover:bg-muted/40 transition-colors border-b border-border last:border-0">
        <td className="px-4 py-2.5 text-center align-top"><Checkbox checked={row.checked} onCheckedChange={v => setPA(item.id, { checked: !!v })} disabled={locked} /></td>
        <td className="px-4 py-2.5 text-center align-top text-xs text-muted-foreground font-mono">{String.fromCharCode(97 + letterIdx)}.</td>
        <td className="py-2.5 pl-10 pr-6 align-top border-l-2 border-primary/20"><span className="text-sm text-foreground">{item.label}</span></td>
        <td className="px-4 py-2.5 align-top" style={{width:180}}>
          <Select value={row.psc} onValueChange={v => setPA(item.id, { psc: v })} disabled={locked}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent><SelectItem value="Y">Y</SelectItem><SelectItem value="N">N</SelectItem><SelectItem value="N/A">N/A</SelectItem></SelectContent>
          </Select>
        </td>
        <td className="px-6 py-2.5 align-top">
          <Textarea disabled={locked} value={row.exceptions} onChange={e => setPA(item.id, { exceptions: e.target.value })} placeholder="Enter exceptions or findings…" className="min-h-[44px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent" />
        </td>
        <td className="px-4 py-2.5 align-top text-center" style={{width:110}}>
          <RefButton reference={row.wpRef} onAttach={doc => setPA(item.id, { wpRef: [...row.wpRef, doc] })} onRemove={i => setPA(item.id, { wpRef: row.wpRef.filter((_,idx)=>idx!==i) })} disabled={locked} />
        </td>
      </tr>
    );
  }

  // Part B — editable financial row
  function FinEditRow({ id, label, indent = 0, bold = false, showBudget }: { id:string; label:string; indent?:number; bold?:boolean; showBudget:boolean }) {
    const row = f[id] ?? emptyFin();
    const c = p(row.current), b = p(row.budget), pr = p(row.prior);
    const vbAmt = c - b, vbPct = b !== 0 ? vbAmt/b : null;
    const vpAmt = c - pr, vpPct = pr !== 0 ? vpAmt/pr : null;
    return (
      <tr className="border-b border-border hover:bg-muted/30 transition-colors">
        <td className={`px-4 py-2 text-sm align-top ${bold ? 'font-semibold text-foreground' : 'text-foreground'}`} style={{paddingLeft: `${16 + indent * 12}px`}}>{label}</td>
        <td className="px-2 py-2 align-top border-l border-border" style={{width:120}}>
          <TdInput value={row.current} onChange={v => setFin(id,{current:v})} placeholder="0" className="text-right font-mono" />
        </td>
        {showBudget && <td className="px-2 py-2 align-top border-l border-border" style={{width:120}}>
          <TdInput value={row.budget} onChange={v => setFin(id,{budget:v})} placeholder="0" className="text-right font-mono" />
        </td>}
        <td className="px-2 py-2 align-top border-l border-border" style={{width:120}}>
          <TdInput value={row.prior} onChange={v => setFin(id,{prior:v})} placeholder="0" className="text-right font-mono" />
        </td>
        {showBudget && <>
          <td className="px-3 py-2 align-middle text-right text-xs font-mono border-l border-border bg-blue-50/30 dark:bg-blue-950/10" style={{width:90}}>{b!==0?fmtN(vbAmt):''}</td>
          <td className="px-3 py-2 align-middle text-right text-xs border-l border-border bg-blue-50/30 dark:bg-blue-950/10" style={{width:70}}>{fmtP(vbPct)}</td>
        </>}
        <td className="px-3 py-2 align-middle text-right text-xs font-mono border-l border-border bg-purple-50/30 dark:bg-purple-950/10" style={{width:90}}>{pr!==0?fmtN(vpAmt):''}</td>
        <td className="px-3 py-2 align-middle text-right text-xs border-l border-border bg-purple-50/30 dark:bg-purple-950/10" style={{width:70}}>{fmtP(vpPct)}</td>
        <td className="px-2 py-2 align-top border-l border-border" style={{width:90}}>
          <Select value={row.hasIssue} onValueChange={v => setFin(id,{hasIssue:v})} disabled={locked}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
          </Select>
        </td>
        <td className="px-2 py-2 align-top border-l border-border" style={{minWidth:180}}>
          {row.hasIssue === 'Yes' && <Textarea disabled={locked} value={row.explanation} onChange={e => setFin(id,{explanation:e.target.value})} placeholder="Describe…" className="min-h-[44px] text-xs resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent" />}
        </td>
        <td className="px-2 py-2 align-top border-l border-border" style={{width:140}}>
          {row.hasIssue === 'Yes' && <TdInput value={row.auditResponse} onChange={v => setFin(id,{auditResponse:v})} placeholder="Form/ref." className="text-xs" />}
        </td>
      </tr>
    );
  }

  // Part B — computed total row (read-only)
  function FinTotalRow({ label, c, b, pr, showBudget, indent = 0 }: { label:string; c:number; b:number; pr:number; showBudget:boolean; indent?:number }) {
    const vbAmt = c - b, vbPct = b !== 0 ? vbAmt/b : null;
    const vpAmt = c - pr, vpPct = pr !== 0 ? vpAmt/pr : null;
    return (
      <tr className="border-b border-border bg-muted/40">
        <td className="px-4 py-2 text-sm font-bold text-foreground" style={{paddingLeft: `${16 + indent * 12}px`}}>{label}</td>
        <td className="px-3 py-2 text-right text-sm font-bold font-mono border-l border-border border-t border-foreground/20">{c!==0?Math.abs(c).toLocaleString('en-CA',{maximumFractionDigits:0}):''}</td>
        {showBudget && <td className="px-3 py-2 text-right text-sm font-bold font-mono border-l border-border border-t border-foreground/20">{b!==0?Math.abs(b).toLocaleString('en-CA',{maximumFractionDigits:0}):''}</td>}
        <td className="px-3 py-2 text-right text-sm font-bold font-mono border-l border-border border-t border-foreground/20">{pr!==0?Math.abs(pr).toLocaleString('en-CA',{maximumFractionDigits:0}):''}</td>
        {showBudget && <>
          <td className="px-3 py-2 text-right text-xs font-mono border-l border-border border-t border-foreground/20 bg-blue-50/40 dark:bg-blue-950/10">{b!==0?fmtN(vbAmt):''}</td>
          <td className="px-3 py-2 text-right text-xs border-l border-border border-t border-foreground/20 bg-blue-50/40 dark:bg-blue-950/10">{fmtP(vbPct)}</td>
        </>}
        <td className="px-3 py-2 text-right text-xs font-mono border-l border-border border-t border-foreground/20 bg-purple-50/40 dark:bg-purple-950/10">{pr!==0?fmtN(vpAmt):''}</td>
        <td className="px-3 py-2 text-right text-xs border-l border-border border-t border-foreground/20 bg-purple-50/40 dark:bg-purple-950/10">{fmtP(vpPct)}</td>
        <td className="border-l border-border border-t border-foreground/20" colSpan={3} />
      </tr>
    );
  }

  // Part B — section header row
  function FinSectionRow({ label }: { label: string }) {
    return (
      <tr className="bg-muted/60 border-b border-border">
        <td colSpan={99} className="px-4 py-2 text-xs font-bold text-foreground uppercase tracking-wider">{label}</td>
      </tr>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  const tab = data.activeTab;
  const showBudget = true; // always show budget column

  return (
    <div className="flex flex-col h-full">

      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          To identify relationships, risks, inconsistencies, unusual transactions, events, amounts, ratios or trends
          that will likely require an audit response.{" "}
          <span className="font-medium text-foreground">Note:</span> Use Parts A and B to identify matters requiring additional information/audit work. Use Part C to document preliminary discussions with management. Do NOT use this form for substantive analytical procedures — use Form 614 instead.
        </p>
      </div>

      {/* Header strip: entity / period / performance materiality + tabs */}
      <div className="px-6 py-3 border-b border-border bg-card flex flex-wrap items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Entity</span>
          <Input value={data.entity} onChange={e => set({entity:e.target.value})} placeholder="Entity name" className="h-7 text-sm w-48" />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Period ended</span>
          <Input value={data.periodEnded} onChange={e => set({periodEnded:e.target.value})} placeholder="e.g. March 31, 2024" className="h-7 text-sm w-40" />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Performance materiality</span>
          <Input value={data.perfMateriality} onChange={e => set({perfMateriality:e.target.value})} placeholder="e.g. 12,000" className="h-7 text-sm w-32 font-mono" />
        </div>
        <div className="ml-auto flex items-center gap-1">
          {(['a','b','c'] as const).map(t => (
            <button key={t} onClick={() => set({activeTab:t})}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${tab===t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              Part {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* ═══════════════════════════════════════════════════════════ PART A */}
          {tab === 'a' && (
            <>
              {PART_A_PROCS.map(proc => (
                <div key={proc.id} className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                  <div className="px-6 py-3.5 bg-card border-b border-border">
                    <span className="text-sm font-semibold text-foreground">{proc.num}. {proc.description.slice(0,60)}{proc.description.length > 60 ? '…' : ''}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <PartAColHeaders />
                      <tbody className="divide-y divide-border">
                        <PATopRow proc={proc} />
                        {proc.items.map((item, idx) => <PASubRow key={item.id} item={item} letterIdx={idx} />)}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════ PART B */}
          {tab === 'b' && (
            <>
              {/* Settings */}
              <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md px-5 py-4 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Number of sales streams</span>
                  <Select value={String(data.numStreams)} onValueChange={v => set({numStreams:parseInt(v)})} disabled={locked}>
                    <SelectTrigger className="h-8 text-sm w-20"><SelectValue /></SelectTrigger>
                    <SelectContent>{[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">Customize stream labels below. Enter amounts in thousands (or as-is — consistent units throughout).</p>
              </div>

              {/* Stream label editors */}
              {data.numStreams > 1 && (
                <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md px-5 py-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Sales stream labels</p>
                  <div className="flex flex-wrap gap-3">
                    {Array.from({length: data.numStreams}, (_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-12">Stream {i+1}</span>
                        <Input
                          value={data.streamLabels[i]}
                          onChange={e => { const sl = [...data.streamLabels]; sl[i] = e.target.value; set({streamLabels:sl}); }}
                          className="h-7 text-sm w-40"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Income Statement */}
              <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                <div className="px-6 py-3.5 bg-card border-b border-border">
                  <span className="text-sm font-semibold text-foreground">Income Statement</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <FinColHeaders showBudget={showBudget} />
                    <tbody>
                      <FinSectionRow label="Sales" />
                      {salesIds.map((id, i) => <FinEditRow key={id} id={id} label={data.streamLabels[i] || `Stream ${i+1}`} indent={1} showBudget={showBudget} />)}
                      <FinTotalRow label="Total sales" c={totalSales.c} b={totalSales.b} pr={totalSales.pr} showBudget={showBudget} />

                      <FinSectionRow label="Cost of Sales" />
                      {cosIds.map((id, i) => <FinEditRow key={id} id={id} label={data.streamLabels[i] || `Stream ${i+1}`} indent={1} showBudget={showBudget} />)}
                      <FinTotalRow label="Total cost of sales" c={totalCos.c} b={totalCos.b} pr={totalCos.pr} showBudget={showBudget} />

                      <FinSectionRow label="Gross Margin $" />
                      {salesIds.map((id, i) => {
                        const cosId = cosIds[i];
                        const gc = p(f[id]?.current??'') - p(f[cosId]?.current??'');
                        const gb = p(f[id]?.budget??'') - p(f[cosId]?.budget??'');
                        const gp = p(f[id]?.prior??'') - p(f[cosId]?.prior??'');
                        return <FinTotalRow key={`gm-${i}`} label={data.streamLabels[i] || `Stream ${i+1}`} c={gc} b={gb} pr={gp} showBudget={showBudget} indent={1} />;
                      })}
                      <FinTotalRow label="Total gross margin $" c={totalGM.c} b={totalGM.b} pr={totalGM.pr} showBudget={showBudget} />

                      <FinSectionRow label="Gross Margin %" />
                      {salesIds.map((id, i) => {
                        const cosId = cosIds[i];
                        const gc = p(f[id]?.current??'') - p(f[cosId]?.current??'');
                        const gb = p(f[id]?.budget??'') - p(f[cosId]?.budget??'');
                        const gp = p(f[id]?.prior??'') - p(f[cosId]?.prior??'');
                        const sc = p(f[id]?.current??''), sb = p(f[id]?.budget??''), sp = p(f[id]?.prior??'');
                        const label = data.streamLabels[i] || `Stream ${i+1}`;
                        return (
                          <tr key={`gmpct-${i}`} className="border-b border-border bg-muted/20">
                            <td className="px-4 py-2 text-sm text-muted-foreground" style={{paddingLeft:'28px'}}>{label}</td>
                            <td className="px-3 py-2 text-right text-xs font-mono border-l border-border">{sc!==0 ? fmtP(gc/sc) : '—'}</td>
                            {showBudget && <td className="px-3 py-2 text-right text-xs font-mono border-l border-border">{sb!==0 ? fmtP(gb/sb) : '—'}</td>}
                            <td className="px-3 py-2 text-right text-xs font-mono border-l border-border">{sp!==0 ? fmtP(gp/sp) : '—'}</td>
                            {showBudget && <><td className="border-l border-border bg-blue-50/30" /><td className="border-l border-border bg-blue-50/30" /></>}
                            <td className="border-l border-border bg-purple-50/30" /><td className="border-l border-border bg-purple-50/30" />
                            <td className="border-l border-border" colSpan={3} />
                          </tr>
                        );
                      })}
                      <tr className="border-b border-border bg-muted/40">
                        <td className="px-4 py-2 text-sm font-bold text-foreground">Total gross margin %</td>
                        <td className="px-3 py-2 text-right text-sm font-bold font-mono border-l border-border">{totalSales.c!==0 ? fmtP(totalGM.c/totalSales.c) : '—'}</td>
                        {showBudget && <td className="px-3 py-2 text-right text-sm font-bold font-mono border-l border-border">{totalSales.b!==0 ? fmtP(totalGM.b/totalSales.b) : '—'}</td>}
                        <td className="px-3 py-2 text-right text-sm font-bold font-mono border-l border-border">{totalSales.pr!==0 ? fmtP(totalGM.pr/totalSales.pr) : '—'}</td>
                        {showBudget && <><td className="border-l border-border bg-blue-50/40" /><td className="border-l border-border bg-blue-50/40" /></>}
                        <td className="border-l border-border bg-purple-50/40" /><td className="border-l border-border bg-purple-50/40" />
                        <td className="border-l border-border" colSpan={3} />
                      </tr>

                      <FinSectionRow label="Other Revenue" />
                      <FinEditRow id="or1" label="Other revenue" indent={1} showBudget={showBudget} />
                      <FinEditRow id="or2" label="Other revenue" indent={1} showBudget={showBudget} />
                      <FinTotalRow label="Total other revenue" c={totalOR.c} b={totalOR.b} pr={totalOR.pr} showBudget={showBudget} />

                      <FinSectionRow label="Expenses" />
                      <FinEditRow id="exp-sal"  label="Salaries / payroll"       indent={1} showBudget={showBudget} />
                      <FinEditRow id="exp-occ"  label="Occupancy"                indent={1} showBudget={showBudget} />
                      <FinEditRow id="exp-int"  label="Interest / bank charges"  indent={1} showBudget={showBudget} />
                      <FinEditRow id="exp-bon"  label="Bonuses"                  indent={1} showBudget={showBudget} />
                      <FinEditRow id="exp-rep"  label="Repairs and maintenance"  indent={1} showBudget={showBudget} />
                      <FinEditRow id="exp-bad"  label="Bad debts"                indent={1} showBudget={showBudget} />
                      <FinEditRow id="exp-non"  label="Non-recurring transactions" indent={1} showBudget={showBudget} />
                      <FinEditRow id="exp-oth1" label="Other expenses"           indent={1} showBudget={showBudget} />
                      <FinEditRow id="exp-oth2" label="Other expenses"           indent={1} showBudget={showBudget} />
                      <FinEditRow id="exp-oth3" label="Other expenses"           indent={1} showBudget={showBudget} />
                      <FinTotalRow label="Total expenses" c={totalExp.c} b={totalExp.b} pr={totalExp.pr} showBudget={showBudget} />

                      <FinTotalRow label="Net income before tax" c={netIncome.c} b={netIncome.b} pr={netIncome.pr} showBudget={showBudget} />
                      <tr className="border-b border-border bg-muted/20">
                        <td className="px-4 py-2 text-sm font-semibold text-muted-foreground">% of revenue</td>
                        <td className="px-3 py-2 text-right text-xs font-mono border-l border-border">{totalSales.c!==0 ? fmtP(netIncome.c/totalSales.c) : '—'}</td>
                        {showBudget && <td className="px-3 py-2 text-right text-xs font-mono border-l border-border">{totalSales.b!==0 ? fmtP(netIncome.b/totalSales.b) : '—'}</td>}
                        <td className="px-3 py-2 text-right text-xs font-mono border-l border-border">{totalSales.pr!==0 ? fmtP(netIncome.pr/totalSales.pr) : '—'}</td>
                        {showBudget && <><td className="border-l border-border bg-blue-50/30" /><td className="border-l border-border bg-blue-50/30" /></>}
                        <td className="border-l border-border bg-purple-50/30" /><td className="border-l border-border bg-purple-50/30" />
                        <td className="border-l border-border" colSpan={3} />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Balance Sheet */}
              <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                <div className="px-6 py-3.5 bg-card border-b border-border">
                  <span className="text-sm font-semibold text-foreground">Balance Sheet</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <FinColHeaders showBudget={showBudget} />
                    <tbody>
                      <FinSectionRow label="Assets" />
                      <FinSectionRow label="Current assets" />
                      <FinEditRow id="ca-cash"      label="Cash"                indent={1} showBudget={showBudget} />
                      <FinEditRow id="ca-inv"       label="Investments"         indent={1} showBudget={showBudget} />
                      <FinEditRow id="ca-ar"        label="Accounts receivable" indent={1} showBudget={showBudget} />
                      <FinEditRow id="ca-inventory" label="Inventory"           indent={1} showBudget={showBudget} />
                      <FinEditRow id="ca-oth1"      label="Other assets"        indent={1} showBudget={showBudget} />
                      <FinEditRow id="ca-oth2"      label="Other assets"        indent={1} showBudget={showBudget} />
                      <FinTotalRow label="Total current assets" c={totalCA.c} b={totalCA.b} pr={totalCA.pr} showBudget={showBudget} />
                      <FinSectionRow label="Long-term assets" />
                      <FinEditRow id="lta-ppe"  label="Property, plant and equipment" indent={1} showBudget={showBudget} />
                      <FinEditRow id="lta-oth1" label="Other assets"                  indent={1} showBudget={showBudget} />
                      <FinEditRow id="lta-oth2" label="Other assets"                  indent={1} showBudget={showBudget} />
                      <FinEditRow id="lta-oth3" label="Other assets"                  indent={1} showBudget={showBudget} />
                      <FinTotalRow label="Total long-term assets" c={totalLTA.c} b={totalLTA.b} pr={totalLTA.pr} showBudget={showBudget} />
                      <FinTotalRow label="Total assets" c={totalA.c} b={totalA.b} pr={totalA.pr} showBudget={showBudget} />

                      <FinSectionRow label="Liabilities" />
                      <FinSectionRow label="Current liabilities" />
                      <FinEditRow id="cl-bank"  label="Bank indebtedness"                    indent={1} showBudget={showBudget} />
                      <FinEditRow id="cl-ap"    label="Accounts payable and accrued liabilities" indent={1} showBudget={showBudget} />
                      <FinEditRow id="cl-tax"   label="Income taxes payable"                 indent={1} showBudget={showBudget} />
                      <FinEditRow id="cl-fut"   label="Future income taxes payable"          indent={1} showBudget={showBudget} />
                      <FinEditRow id="cl-def"   label="Deferred revenue"                     indent={1} showBudget={showBudget} />
                      <FinEditRow id="cl-dep"   label="Customer deposits"                    indent={1} showBudget={showBudget} />
                      <FinEditRow id="cl-std"   label="Short-term debt"                      indent={1} showBudget={showBudget} />
                      <FinEditRow id="cl-cpltd" label="Current portion of long-term debt"    indent={1} showBudget={showBudget} />
                      <FinEditRow id="cl-oth1"  label="Other current liabilities"            indent={1} showBudget={showBudget} />
                      <FinEditRow id="cl-oth2"  label="Other current liabilities"            indent={1} showBudget={showBudget} />
                      <FinTotalRow label="Total current liabilities" c={totalCL.c} b={totalCL.b} pr={totalCL.pr} showBudget={showBudget} />
                      <FinSectionRow label="Long-term liabilities" />
                      <FinEditRow id="ltl-loan" label="Loans payable"              indent={1} showBudget={showBudget} />
                      <FinEditRow id="ltl-fut"  label="Future income taxes payable" indent={1} showBudget={showBudget} />
                      <FinEditRow id="ltl-ltd"  label="Long-term debt"             indent={1} showBudget={showBudget} />
                      <FinEditRow id="ltl-oth1" label="Other long-term liabilities" indent={1} showBudget={showBudget} />
                      <FinEditRow id="ltl-oth2" label="Other long-term liabilities" indent={1} showBudget={showBudget} />
                      <FinTotalRow label="Total long-term liabilities" c={totalLTL.c} b={totalLTL.b} pr={totalLTL.pr} showBudget={showBudget} />
                      <FinTotalRow label="Total liabilities" c={totalL.c} b={totalL.b} pr={totalL.pr} showBudget={showBudget} />

                      <FinSectionRow label="Equity" />
                      <FinEditRow id="eq-ret" label="Retained earnings"   indent={1} showBudget={showBudget} />
                      <FinEditRow id="eq-con" label="Contributed surplus"  indent={1} showBudget={showBudget} />
                      <FinEditRow id="eq-shr" label="Share capital"        indent={1} showBudget={showBudget} />
                      <FinEditRow id="eq-oth" label="Other equity"         indent={1} showBudget={showBudget} />
                      <FinTotalRow label="Total equity" c={totalEQ.c} b={totalEQ.b} pr={totalEQ.pr} showBudget={showBudget} />
                      <FinTotalRow label="Total liabilities and equity" c={totalLE.c} b={totalLE.b} pr={totalLE.pr} showBudget={showBudget} />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ratios */}
              <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                <div className="px-6 py-3.5 bg-card border-b border-border">
                  <span className="text-sm font-semibold text-foreground">Ratios</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <FinColHeaders showBudget={showBudget} />
                    <tbody>
                      {/* Working capital — auto-computed */}
                      <FinTotalRow label="Working capital (current assets − current liabilities)" c={totalCA.c-totalCL.c} b={totalCA.b-totalCL.b} pr={totalCA.pr-totalCL.pr} showBudget={showBudget} />
                      <FinEditRow id="rat-drecv"  label="Number of days in receivables"                indent={0} showBudget={showBudget} />
                      <FinEditRow id="rat-dinv"   label="Number of days' sales in inventory"           indent={0} showBudget={showBudget} />
                      <FinEditRow id="rat-iturn"  label="Inventory turnover"                           indent={0} showBudget={showBudget} />
                      <FinEditRow id="rat-dpay"   label="Number of days' purchases in trade payables"  indent={0} showBudget={showBudget} />
                      <FinEditRow id="rat-dte"    label="Debt-to-equity ratio"                         indent={0} showBudget={showBudget} />
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════ PART C */}
          {tab === 'c' && (
            <>
              {/* Matter table */}
              <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                <div className="px-6 py-3.5 bg-card border-b border-border">
                  <span className="text-sm font-semibold text-foreground">Matters identified in Part B — Management discussion</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
                        <th className="px-4 py-3 text-center" style={{width:100,minWidth:100}}>Part B ref. #</th>
                        <th className="px-4 py-3 text-left border-l border-border" style={{minWidth:200}}>Summary of matter(s) identified</th>
                        <th className="px-4 py-3 text-left border-l border-border" style={{minWidth:200}}>Management's response</th>
                        <th className="px-4 py-3 text-left border-l border-border" style={{minWidth:200}}>Audit implications and possible responses</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.matters.map((m, idx) => (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-2 align-top text-center">
                            <Input value={m.partBRef} onChange={e => setMatter(idx, {partBRef:e.target.value})} placeholder={`${idx+1}`} className="h-8 text-sm text-center" disabled={locked} />
                          </td>
                          <td className="px-4 py-2 align-top border-l border-border">
                            <Textarea value={m.summary} onChange={e => setMatter(idx,{summary:e.target.value})} placeholder="Describe matter…" className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent" disabled={locked} />
                          </td>
                          <td className="px-4 py-2 align-top border-l border-border">
                            <Textarea value={m.mgmtResponse} onChange={e => setMatter(idx,{mgmtResponse:e.target.value})} placeholder="Management's response…" className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent" disabled={locked} />
                          </td>
                          <td className="px-4 py-2 align-top border-l border-border">
                            <Textarea value={m.auditImplications} onChange={e => setMatter(idx,{auditImplications:e.target.value})} placeholder="Audit implications / Form 520 ref…" className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent" disabled={locked} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fraud question */}
              <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                <div className="px-6 py-3.5 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">
                    Have any unusual/unexpected relationships been identified that may indicate risks of material misstatement due to fraud? If so, describe below:
                  </p>
                </div>
                <div className="px-6 py-4">
                  <Textarea
                    disabled={locked}
                    value={data.fraudAnswer}
                    onChange={e => set({fraudAnswer: e.target.value})}
                    placeholder="Describe any unusual or unexpected relationships identified…"
                    className="min-h-[80px] text-sm resize-none bg-background"
                  />
                </div>
              </div>

              {/* Sign-off + Conclude */}
              <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                <div className="px-6 py-3.5 border-b border-border">
                  <span className="text-sm font-semibold text-foreground">Conclusion</span>
                </div>
                <div className="px-6 py-5 space-y-4">
                  {data.concluded && (
                    <div className="rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-800 dark:text-green-300">
                      Concluded on {data.concludedOn}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-28 flex-shrink-0">Prepared by</span>
                        <Input disabled={locked} value={data.preparedBy} onChange={e => set({preparedBy:e.target.value})} placeholder="Name" className="h-8 text-sm" />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-28 flex-shrink-0">Date</span>
                        <Input disabled={locked} value={data.preparedDate} onChange={e => set({preparedDate:e.target.value})} placeholder="YYYY-MM-DD" className="h-8 text-sm" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-28 flex-shrink-0">Reviewed by</span>
                        <Input disabled={locked} value={data.reviewedBy} onChange={e => set({reviewedBy:e.target.value})} placeholder="Name" className="h-8 text-sm" />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-28 flex-shrink-0">Date</span>
                        <Input disabled={locked} value={data.reviewedDate} onChange={e => set({reviewedDate:e.target.value})} placeholder="YYYY-MM-DD" className="h-8 text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      disabled={locked}
                      onClick={() => {
                        const now = new Date().toISOString().slice(0,10);
                        setData(d => { const next = {...d, concluded: true, concludedOn: now}; writeJsonToLocalStorage(storageKey, next); return next; })
                      }}>
                      Conclude worksheet
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
