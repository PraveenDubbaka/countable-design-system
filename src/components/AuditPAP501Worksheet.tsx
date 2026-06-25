import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { loadEngagements } from "@/store/engagementsStore";

// ── Flow state machine ─────────────────────────────────────────────────────────

type FlowState = 'idle' | 'worksheet';

// ── Types ──────────────────────────────────────────────────────────────────────

interface PartARow { checked: boolean; psc: string; exceptions: string; wpRef: RefDoc[] }
interface FinRow   { current: string; budget: string; prior: string; hasIssue: string; explanation: string; auditResponse: string }
interface MatterRow { partBRef: string; summary: string; mgmtResponse: string; auditImplications: string }

interface PAP501Data {
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
  const { engagementId = '' } = useParams<{ engagementId: string }>();

  // Engagement context
  const engRecord = loadEngagements().find(e => e.id === engagementId);
  const entityName = engRecord?.client ?? '—';
  const periodEnded = engRecord?.yearEnd ?? '—';

  // Performance materiality from materiality worksheet
  const matKey = `audit-materiality-data-${isUS ? 'us' : 'ca'}`;
  const matData = readJsonFromLocalStorage<Record<string, string> | null>(matKey, null);
  const perfMateriality = matData?.performanceMateriality
    ? `$${matData.performanceMateriality}`
    : matData?.overallMateriality
      ? (() => { const v = parseFloat(matData.overallMateriality.replace(/,/g, '')); return isNaN(v) ? '—' : `$${(v * 0.7).toLocaleString('en-CA', {maximumFractionDigits:0})}`; })()
      : '—';

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

  // ── Flow state ───────────────────────────────────────────────────────────────

  const acceptedKey = `pap501-accepted-${engagementId}-${isUS ? 'us' : 'ca'}`;

  const [flowState, setFlowState] = useState<FlowState>(() =>
    localStorage.getItem(`pap501-accepted-${engagementId}-${isUS ? 'us' : 'ca'}`) ? 'worksheet' : 'idle'
  );
  const [activeSheet, setActiveSheet] = useState<'partA' | 'partB' | 'partC'>('partA');

  const [connectedSource, setConnectedSource] = useState<string | null>(null);
  useEffect(() => {
    const connectors = readJsonFromLocalStorage<string[]>(`connectors-${engagementId}`, ['xero']);
    setConnectedSource(connectors[0] ?? null);
  }, [engagementId]);

  // ── XLSX embed state ────────────────────────────────────────────────────────

  interface XlsxSheetData {
    name: string;
    rows: (string | number)[][];
    merges: Array<{ sr: number; sc: number; er: number; ec: number }>;
  }
  const [xlsxSheets, setXlsxSheets] = useState<XlsxSheetData[]>([]);
  const [xlsxActiveSheet, setXlsxActiveSheet] = useState('');
  const [xlsxLoading, setXlsxLoading] = useState(false);

  const COL_LIMITS: Record<string, number> = {
    '501 - Part A': 7,
    '501 - Part B': 10,
    '501- Part C': 9,
  };

  useEffect(() => {
    if (flowState !== 'worksheet') return;
    if (xlsxSheets.length > 0) return;
    setXlsxLoading(true);
    import('xlsx').then(XLSX => {
      fetch('/assets/pap501-worksheet.xlsm')
        .then(r => r.arrayBuffer())
        .then(buf => {
          const wb = XLSX.read(new Uint8Array(buf), { type: 'array' });
          const visible = wb.SheetNames.filter((n: string) => n !== 'programming');
          const sheets: XlsxSheetData[] = visible.map((name: string) => {
            const ws = wb.Sheets[name];
            const limit = COL_LIMITS[name] ?? 10;
            const raw = XLSX.utils.sheet_to_json<(string | number)[]>(ws, {
              header: 1, defval: '', blankrows: true,
            }) as (string | number)[][];
            const rows = raw.map(row =>
              (row as (string | number)[]).slice(0, limit).map(c =>
                typeof c === 'string' ? c.replace(/\r\n/g, '\n').trim() : c
              )
            );
            const merges = ((ws['!merges'] as Array<{ s: { r: number; c: number }; e: { r: number; c: number } }>) ?? [])
              .filter((m) => m.s.c < limit)
              .map((m) => ({
                sr: m.s.r, sc: m.s.c,
                er: m.e.r, ec: Math.min(m.e.c, limit - 1),
              }));
            return { name, rows, merges };
          });
          setXlsxSheets(sheets);
          setXlsxActiveSheet(sheets[0]?.name ?? '');
        })
        .catch(console.error)
        .finally(() => setXlsxLoading(false));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowState, xlsxSheets.length]);

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

  const showBudget = true;

  // ── Accept artifact — pre-fill mock generated data ───────────────────────────
  function acceptArtifact() {
    const mockFin: PAP501Data['fin'] = { ...buildDefault().fin };
    mockFin['s1'] = { current: '16732400', budget: '', prior: '14891200', hasIssue: 'No', explanation: '', auditResponse: '' };
    mockFin['cos1'] = { current: '12214300', budget: '', prior: '10802100', hasIssue: 'Yes', explanation: 'Increase of 13.1% driven by fuel surcharges and third-party port fees. Proportion of revenue consistent with prior year (73%).', auditResponse: 'Form 520 — Cost analysis' };
    mockFin['exp-sal'] = { current: '1842100', budget: '', prior: '1698400', hasIssue: 'No', explanation: '', auditResponse: '' };
    mockFin['exp-occ'] = { current: '621400', budget: '', prior: '598200', hasIssue: 'No', explanation: '', auditResponse: '' };
    mockFin['exp-int'] = { current: '189300', budget: '', prior: '201800', hasIssue: 'No', explanation: '', auditResponse: '' };
    mockFin['exp-oth1'] = { current: '450000', budget: '', prior: '343500', hasIssue: 'Yes', explanation: 'Other expenses increased 31% — includes one-time restructuring charge of $120K.', auditResponse: 'Form 505 — Management inquiry' };
    mockFin['ca-cash'] = { current: '2140000', budget: '', prior: '1820000', hasIssue: 'No', explanation: '', auditResponse: '' };
    mockFin['ca-ar'] = { current: '3280000', budget: '', prior: '2940000', hasIssue: 'No', explanation: '', auditResponse: '' };
    mockFin['lta-ppe'] = { current: '8920000', budget: '', prior: '9100000', hasIssue: 'No', explanation: '', auditResponse: '' };
    mockFin['cl-ap'] = { current: '2610000', budget: '', prior: '2340000', hasIssue: 'No', explanation: '', auditResponse: '' };
    mockFin['ltl-ltd'] = { current: '4200000', budget: '', prior: '4800000', hasIssue: 'No', explanation: '', auditResponse: '' };
    mockFin['eq-ret'] = { current: '5130000', budget: '', prior: '4820000', hasIssue: 'No', explanation: '', auditResponse: '' };
    const mockPartA: PAP501Data['partA'] = { ...buildDefault().partA };
    Object.assign(mockPartA, {
      'pa-1': { checked: true, psc: 'Y', exceptions: 'Trial balance and GL obtained from Xero as at March 31, 2024. Agreed to management-prepared financial statements.', wpRef: [] },
      'pa-2': { checked: true, psc: 'Y', exceptions: 'Information obtained is reliable and adequate. No unexplained differences noted.', wpRef: [] },
      'pa-3': { checked: true, psc: 'Y', exceptions: '', wpRef: [] },
      'pa-3a': { checked: true, psc: 'N/A', exceptions: 'No inconsistencies with our understanding of the entity.', wpRef: [] },
      'pa-3b': { checked: true, psc: 'Y', exceptions: '31% increase in other expenses — investigated; attributable to one-time restructuring charge.', wpRef: [] },
      'pa-3c': { checked: true, psc: 'N/A', exceptions: '', wpRef: [] },
      'pa-4': { checked: true, psc: 'Y', exceptions: '', wpRef: [] },
      'pa-4a': { checked: true, psc: 'Y', exceptions: 'Management confirmed all fluctuations are volume-driven or the one-time restructuring charge.', wpRef: [] },
      'pa-4b': { checked: true, psc: 'N/A', exceptions: 'No unusual transactions or material misstatements identified.', wpRef: [] },
      'pa-5': { checked: true, psc: 'Y', exceptions: '', wpRef: [] },
      'pa-5a': { checked: true, psc: 'N/A', exceptions: '', wpRef: [] },
      'pa-5b': { checked: true, psc: 'N/A', exceptions: '', wpRef: [] },
    });
    const mockMatters: MatterRow[] = [
      { partBRef: 'IS-COS', summary: 'Cost of services increased 13.1% ($1.4M) — exceeds performance materiality. Driven by fuel surcharges and third-party port fees.', mgmtResponse: 'Increase is volume-driven. Port fees increased industry-wide in H2 2023.', auditImplications: 'Expand cost verification. Obtain breakdown of fuel surcharges. Reference Form 520.' },
      { partBRef: 'IS-EXP', summary: 'Other operating expenses increased 31% ($106K) — one-time restructuring charge of $120K.', mgmtResponse: 'One-time office consolidation. Board resolution available.', auditImplications: 'Obtain supporting documentation for restructuring charge. Verify expense classification.' },
      ...Array(8).fill(null).map(emptyMatter),
    ];
    setData(d => ({ ...d, fin: { ...d.fin, ...mockFin }, partA: { ...d.partA, ...mockPartA }, matters: mockMatters }));
    setFlowState('worksheet');
    localStorage.setItem(acceptedKey, 'true');
  }

  function handleGenerate() {
    window.dispatchEvent(new CustomEvent('pap501-generate', {
      detail: {
        engagementId,
        isUS,
        label: 'PAP 501 — Preliminary Analytical Procedures',
        sources: connectedSource
          ? [`${connectedSource.charAt(0).toUpperCase() + connectedSource.slice(1)} connection`, 'Predecessor file']
          : ['Trial balance', 'Predecessor file'],
      },
    }));
  }

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ engagementId?: string }>;
      if (ce.detail?.engagementId && ce.detail.engagementId !== engagementId) return;
      acceptArtifact();
    };
    window.addEventListener('pap501-luka-accepted', handler);
    return () => window.removeEventListener('pap501-luka-accepted', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementId]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ engagementId?: string }>;
      if (ce.detail?.engagementId && ce.detail.engagementId !== engagementId) return;
      setFlowState('idle');
      setXlsxSheets([]);
    };
    window.addEventListener('pap501-regenerate', handler);
    return () => window.removeEventListener('pap501-regenerate', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementId]);

  return (
    <div className="flex flex-col h-full">

      {/* ── IDLE: Luka-thread landing ───────────────────────────────────────── */}
      {flowState === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 overflow-auto">
          <div className="w-full max-w-md flex flex-col items-center gap-7 text-center">

            {/* Luka bolt icon */}
            <div
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
              style={{
                border: '2px solid hsla(270,65%,64%,0.3)',
                background: 'linear-gradient(135deg,hsla(270,65%,64%,0.12),hsla(211,76%,33%,0.12))',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="luka-bolt-pap501" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9747FF" />
                    <stop offset="100%" stopColor="#115697" />
                  </linearGradient>
                </defs>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#luka-bolt-pap501)" />
              </svg>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground">Preliminary Analytical Procedures</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{entityName} · Period ended {periodEnded}</p>
            </div>

            {/* Quick prompt chips */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['/PAP 501 Analysis', '/Import Trial Balance', '/Prior Year Comparison'].map(chip => (
                <button key={chip} className="luka-prompt-chip" onClick={handleGenerate}>
                  <span style={{ color: 'hsl(207 71% 38%)', fontWeight: 700 }}>/</span>
                  {chip.slice(1)}
                </button>
              ))}
            </div>

            {/* Source status */}
            <div className={`flex items-center gap-2 text-xs px-3.5 py-2 rounded-full border ${
              connectedSource
                ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                : 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
            }`}>
              {connectedSource ? (
                <><CheckCircle2 className="h-3.5 w-3.5" /> Connected to {connectedSource.charAt(0).toUpperCase() + connectedSource.slice(1)}</>
              ) : (
                <><AlertCircle className="h-3.5 w-3.5" /> No data source — upload trial balance to auto-populate</>
              )}
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#9747FF,#115697)', boxShadow: '0 2px 8px hsla(270,60%,50%,0.3)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Generate with Luka
            </button>
          </div>
        </div>
      )}


      {/* ── WORKSHEET: XLSX embed ─────────────────────────────────────────── */}
      {flowState === 'worksheet' && (<>

        {/* Sheet tabs */}
        <div className="flex items-end gap-0 border-b border-border bg-muted/20 px-4 shrink-0">
          {xlsxSheets.length > 0 ? xlsxSheets.map(s => (
            <button
              key={s.name}
              onClick={() => setXlsxActiveSheet(s.name)}
              className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                xlsxActiveSheet === s.name
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.name}
            </button>
          )) : ['501 - Part A', '501 - Part B', '501- Part C'].map(n => (
            <button key={n} className="px-4 py-2 text-xs font-medium border-b-2 border-transparent text-muted-foreground">{n}</button>
          ))}
        </div>

        {/* ── WORKSHEET: XLSX embed ── */}
        <div className="flex-1 overflow-auto bg-background">

          {xlsxLoading ? (
            <div className="flex items-center justify-center h-40 gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /><span>Loading worksheet…</span>
            </div>
          ) : (() => {
            const sheet = xlsxSheets.find(s => s.name === xlsxActiveSheet);
            if (!sheet) return null;
            const mergeMap: Record<string, { rowspan: number; colspan: number } | 'skip'> = {};
            sheet.merges.forEach(m => {
              mergeMap[`${m.sr},${m.sc}`] = { rowspan: m.er - m.sr + 1, colspan: m.ec - m.sc + 1 };
              for (let r = m.sr; r <= m.er; r++)
                for (let c = m.sc; c <= m.ec; c++)
                  if (r !== m.sr || c !== m.sc) mergeMap[`${r},${c}`] = 'skip';
            });
            return (
              <div className="overflow-x-auto">
                <table className="border-collapse text-[11px]" style={{ fontFamily: "'Calibri','Segoe UI',Arial,sans-serif", minWidth: '100%' }}>
                  <tbody>
                    {sheet.rows.map((row, ri) => {
                      const cells = row as (string | number)[];
                      const hasContent = cells.some(c => String(c).trim() !== '');
                      if (!hasContent && ri > 5) return null;
                      return (
                        <tr key={ri}>
                          <td className="text-right text-[9px] text-muted-foreground/40 pl-1 pr-2 py-0.5 select-none bg-muted/20 border-r border-border/40 w-7 shrink-0">{ri + 1}</td>
                          {cells.map((cell, ci) => {
                            const cellKey = `${ri},${ci}`;
                            const merge = mergeMap[cellKey];
                            if (merge === 'skip') return null;
                            const span = typeof merge === 'object' ? merge : null;
                            const val = String(cell ?? '');
                            return (
                              <td
                                key={ci}
                                rowSpan={span?.rowspan}
                                colSpan={span?.colspan}
                                className={`border border-border/30 px-2 py-0.5 align-top text-foreground ${ci === 0 ? 'min-w-[180px] max-w-[380px] whitespace-pre-wrap' : 'whitespace-nowrap min-w-[60px]'}`}
                              >
                                {val}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>

      </>)}

    </div>
  );
}
