import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { loadEngagements } from "@/store/engagementsStore";
import { WorksheetSignOff } from "@/components/WorksheetSignOff";

// ── Flow state machine ─────────────────────────────────────────────────────────

type FlowState = 'idle' | 'worksheet';

// ── Types ──────────────────────────────────────────────────────────────────────

interface PartARow { checked: boolean; psc: string; exceptions: string; wpRef: RefDoc[] }
interface FinRow   { current: string; budget: string; prior: string; hasIssue: string; explanation: string; auditResponse: string }
interface MatterRow { partBRef: string; summary: string; mgmtResponse: string; auditImplications: string }

interface PAP501Data {
  partA: Record<string, PartARow>;
  compareBudget: string;   // 'Yes' | 'No'
  comparePrior: string;    // 'Yes' | 'No'
  numStreams: number;
  streamLabels: string[];
  fin: Record<string, FinRow>;
  ratios: Record<string, FinRow>;
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
const ALL_FIN_IDS = [...IS_IDS, ...BS_IDS];

function emptyPA(): PartARow { return { checked: false, psc: '', exceptions: '', wpRef: [] }; }
function emptyFin(): FinRow  { return { current: '', budget: '', prior: '', hasIssue: '', explanation: '', auditResponse: '' }; }
function emptyMatter(): MatterRow { return { partBRef: '', summary: '', mgmtResponse: '', auditImplications: '' }; }

function buildDefault(): PAP501Data {
  const partA: Record<string, PartARow> = {};
  ALL_PA_IDS.forEach(id => { partA[id] = emptyPA(); });
  const fin: Record<string, FinRow> = {};
  ALL_FIN_IDS.forEach(id => { fin[id] = emptyFin(); });
  const ratios: Record<string, FinRow> = {};
  RAT_IDS.forEach(id => { ratios[id] = emptyFin(); });
  return {
    partA,
    compareBudget: 'Yes',
    comparePrior: 'Yes',
    numStreams: 1,
    streamLabels: ['Product category', 'Stream 2', 'Stream 3', 'Stream 4', 'Stream 5'],
    fin, ratios,
    matters: Array(10).fill(null).map(emptyMatter),
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
        <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" style={{width:140,minWidth:140}}>PSC (Y/N)</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Exceptions / findings</th>
        <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" style={{width:90,minWidth:90}}>W/P ref.</th>
      </tr>
    </thead>
  );
}

// Part B financial table column headers
function FinColHeaders({ showBudget, showPrior = true }: { showBudget: boolean; showPrior?: boolean }) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="bg-muted border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
        <th className="px-4 py-3 text-left" style={{minWidth:200}}>Description</th>
        <th className="px-3 py-3 text-right whitespace-nowrap" style={{width:120,minWidth:120}}>Current period</th>
        {showBudget && <th className="px-3 py-3 text-right whitespace-nowrap" style={{width:120,minWidth:120}}>Budget / forecast</th>}
        {showPrior && <th className="px-3 py-3 text-right whitespace-nowrap" style={{width:120,minWidth:120}}>Prior period</th>}
        {showBudget && <>
          <th className="px-3 py-3 text-right whitespace-nowrap" style={{width:90,minWidth:90}}>vs Budget $</th>
          <th className="px-3 py-3 text-right whitespace-nowrap" style={{width:70,minWidth:70}}>vs Budget %</th>
        </>}
        {showPrior && <>
          <th className="px-3 py-3 text-right whitespace-nowrap" style={{width:90,minWidth:90}}>vs Prior $</th>
          <th className="px-3 py-3 text-right whitespace-nowrap" style={{width:70,minWidth:70}}>vs Prior %</th>
        </>}
        <th className="px-3 py-3 text-center whitespace-nowrap" style={{width:90,minWidth:90}}>Matter?</th>
        <th className="px-3 py-3 text-left" style={{minWidth:180}}>If yes, describe matter</th>
        <th className="px-3 py-3 text-left whitespace-nowrap" style={{width:140,minWidth:140}}>Audit response ref.</th>
      </tr>
    </thead>
  );
}

// ── Luka AI fill data ──────────────────────────────────────────────────────────
// Pre-populated values for Shipping Line Inc. AUD-SL-Mar312024, keyed by "ri,ci"

const LUKA_PAP501_FILLS: Record<string, Record<string, string>> = {
  '501 - Part A': {
    '0,1': 'Shipping Line Inc.', '0,4': 'March 31, 2024',
    // Procedure 1
    '8,3': 'RA-501', '8,4': 'Y / AG',
    '8,5': 'Financial statements obtained from Xero general ledger. Income statement and balance sheet for period ended March 31, 2024 reviewed and agreed to trial balance.',
    // Procedure 2
    '9,3': 'RA-501', '9,4': 'Y / AG',
    '9,5': 'Data confirmed reliable — reviewed to signed management representation letter. Reconciled to Xero data; no significant discrepancies noted.',
    // Procedure 3
    '10,4': 'Y / AG', '10,5': 'See items a–c below.',
    '11,4': 'Y / AG', '11,5': 'No significant inconsistencies. Revenue growth of 8.2% YoY; consistent with voyage logs. Working capital position stable. No material changes in accounting policies noted.',
    '12,4': 'Y / AG', '12,5': 'Q3 revenue decline noted ($840K below budget). Management attributed to scheduled dry-docking of MV Kestrel (Oct–Nov 2023). Recovery in Q4 consistent with prior-year seasonal pattern.',
    '13,4': 'Y / AG', '13,5': 'No fraud indicators identified. Segregation of duties appears adequate. No unusual journal entries noted. No red flags in analytical data.',
    // Procedure 4
    '14,4': 'Y / AG', '14,5': 'Discussed with James Hartley (CEO) and Priya Sharma (CFO) on April 8, 2024. Notes documented on W/P RA-502.',
    '15,4': 'Y / AG', '15,5': 'Q3 dip attributed to dry-docking — consistent with prior year. Charter rates stable at $24,800/day avg. Explanation corroborated by voyage logs.',
    '16,4': 'Y / AG', '16,5': 'No unusual transactions identified. All items >$50,000 reviewed and appear ordinary-course. No undisclosed related-party transactions noted.',
    // Procedure 5
    '17,4': 'Y / AG', '17,5': 'No indications of material misstatement arising from analytical procedures performed.',
    '18,4': 'Y / AG', '18,5': 'No specific additional audit response required beyond planned substantive procedures in the risk assessment.',
    '19,4': 'Y / AG', '19,5': 'No fraud risk indicators identified. All management explanations reasonable and consistent with Xero data and industry benchmarks.',
  },
  '501 - Part B': {
    '0,1': 'Shipping Line Inc.', '0,6': 'March 31, 2024',
    // Stream labels
    '15,0': 'Charter income', '22,0': 'Vessel operating costs', '29,0': 'Charter income',
    // Sales stream 1 (row 15)
    '15,3': '16,420,000', '15,4': '15,800,000', '15,5': '15,200,000',
    '15,6': '620,000', '15,7': '3.9%', '15,8': '1,220,000', '15,9': '8.0%',
    // Total sales (row 20)
    '20,3': '16,420,000', '20,4': '15,800,000', '20,5': '15,200,000',
    '20,6': '620,000', '20,7': '3.9%', '20,8': '1,220,000', '20,9': '8.0%',
    // COS stream 1 (row 22)
    '22,3': '12,105,000', '22,4': '11,850,000', '22,5': '11,400,000',
    '22,6': '255,000', '22,7': '2.2%', '22,8': '705,000', '22,9': '6.2%',
    // Total COS (row 27)
    '27,3': '12,105,000', '27,4': '11,850,000', '27,5': '11,400,000',
    '27,6': '255,000', '27,7': '2.2%', '27,8': '705,000', '27,9': '6.2%',
    // GM stream 1 (row 29)
    '29,3': '4,315,000', '29,4': '3,950,000', '29,5': '3,800,000',
    '29,6': '365,000', '29,7': '9.2%', '29,8': '515,000', '29,9': '13.6%',
    // Total GM $ (row 34)
    '34,3': '4,315,000', '34,4': '3,950,000', '34,5': '3,800,000',
    '34,6': '365,000', '34,7': '9.2%', '34,8': '515,000', '34,9': '13.6%',
    // GM % (rows 36, 41)
    '36,3': '26.3%', '36,4': '25.0%', '36,5': '25.0%', '36,6': '1.3%', '36,8': '1.3%',
    '41,3': '26.3%', '41,4': '25.0%', '41,5': '25.0%', '41,6': '1.3%', '41,8': '1.3%',
    // Expenses (rows 47-51)
    '47,3': '1,850,000', '47,4': '1,820,000', '47,5': '1,750,000', '47,6': '30,000',  '47,7': '1.6%',  '47,8': '100,000', '47,9': '5.7%',
    '48,3': '425,000',   '48,4': '410,000',   '48,5': '395,000',   '48,6': '15,000',  '48,7': '3.7%',  '48,8': '30,000',  '48,9': '7.6%',
    '49,3': '285,000',   '49,4': '290,000',   '49,5': '265,000',   '49,6': '-5,000',  '49,7': '-1.7%', '49,8': '20,000',  '49,9': '7.5%',
    '51,3': '395,000',   '51,4': '380,000',   '51,5': '360,000',   '51,6': '15,000',  '51,7': '3.9%',  '51,8': '35,000',  '51,9': '9.7%',
    // Total expenses (row 57)
    '57,3': '2,955,000', '57,4': '2,900,000', '57,5': '2,770,000', '57,6': '55,000',  '57,7': '1.9%',  '57,8': '185,000', '57,9': '6.7%',
    // Net income (row 58) and % (row 59)
    '58,3': '1,360,000', '58,4': '1,050,000', '58,5': '1,030,000', '58,6': '310,000', '58,7': '29.5%', '58,8': '330,000', '58,9': '32.0%',
    '59,3': '8.3%', '59,4': '6.6%', '59,5': '6.8%',
    // Balance sheet (key rows)
    '65,3': '1,850,000',  '65,4': '1,600,000',  '65,5': '1,420,000',  '65,6': '250,000', '65,7': '15.6%', '65,8': '430,000',   '65,9': '30.3%',
    '67,3': '2,340,000',  '67,4': '2,100,000',  '67,5': '1,980,000',  '67,6': '240,000', '67,7': '11.4%', '67,8': '360,000',   '67,9': '18.2%',
    '71,3': '4,280,000',  '71,4': '3,820,000',  '71,5': '3,510,000',  '71,6': '460,000', '71,7': '12.0%', '71,8': '770,000',   '71,9': '21.9%',
    '78,3': '18,650,000', '78,4': '17,900,000', '78,5': '17,200,000', '78,6': '750,000', '78,7': '4.2%',  '78,8': '1,450,000', '78,9': '8.4%',
    '82,3': '1,420,000',  '82,4': '1,350,000',  '82,5': '1,290,000',  '82,6': '70,000',  '82,7': '5.2%',  '82,8': '130,000',   '82,9': '10.1%',
    '91,3': '2,210,000',  '91,4': '2,100,000',  '91,5': '2,015,000',  '91,6': '110,000', '91,7': '5.2%',  '91,8': '195,000',   '91,9': '9.7%',
    '99,3': '9,830,000',  '99,4': '9,500,000',  '99,5': '9,200,000',  '99,6': '330,000', '99,7': '3.5%',  '99,8': '630,000',   '99,9': '6.8%',
    '105,3': '8,820,000', '105,4': '8,400,000', '105,5': '8,000,000', '105,6': '420,000','105,7': '5.0%', '105,8': '820,000',  '105,9': '10.3%',
    '106,3': '18,650,000','106,4': '17,900,000','106,5': '17,200,000','106,6': '750,000','106,7': '4.2%', '106,8': '1,450,000','106,9': '8.4%',
  },
  '501- Part C': {
    '0,1': 'Shipping Line Inc.', '0,5': 'March 31, 2024',
    // Matter 1: net income above budget (row 8)
    '8,0': 'B-58',
    '8,1': 'Net income significantly above budget (+$310K, +29.5%) and prior year (+$330K, +32.0%)',
    '8,4': 'Higher average charter rates in H1 ($26,200/day vs $24,800 budget) and Q4 revenue recovery post dry-docking. Partial offset by higher salaries (+$30K) and occupancy (+$15K).',
    '8,6': 'Flag for additional scrutiny: perform substantive testing of charter income; review all JEs >$25K related to revenue. Explanation corroborated by voyage logs and bank statements. No indicators of fraud.',
    // Matter 2: Q3 dry-docking (row 9)
    '9,0': 'B-15 / B-22',
    '9,1': 'Q3 revenue below budget and prior year — scheduled dry-docking of MV Kestrel (Oct–Nov 2023)',
    '9,4': 'Dry-docking program completed November 2023. MV Kestrel returned to service December 2023. Revenue recovered above budget in Q4, with full-year revenue $620K above budget.',
    '9,6': 'No specific audit response required. Consistent with prior-year seasonal pattern and disclosed in management discussion. Documented in risk assessment W/P RA-502.',
    // Fraud question answer (row 20)
    '20,0': 'No unusual or unexpected relationships were identified that indicate risks of material misstatement due to fraud. Revenue fluctuations are attributable to the known MV Kestrel dry-docking schedule, consistent with prior-year patterns. All management explanations were reasonable and corroborated by independent charter rate market data and voyage documentation. No indicators of management override of controls or unusual journal entries were noted.',
    // Sign-off (rows 23, 25)
    '23,0': 'Atin Gupta',   '23,5': 'April 15, 2024',
    '25,0': 'Sarah Chen',   '25,5': 'April 18, 2024',
  },
};

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
      ratios: { ...def.ratios, ...(saved.ratios ?? {}) },
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
  

  const [connectedSource, setConnectedSource] = useState<string | null>(null);
  useEffect(() => {
    const connectors = readJsonFromLocalStorage<string[]>(`connectors-${engagementId}`, ['xero']);
    setConnectedSource(connectors[0] ?? null);
  }, [engagementId]);



  const locked = data.concluded;
  const set = (patch: Partial<PAP501Data>) => setData(d => ({ ...d, ...patch }));

  function setPA(id: string, patch: Partial<PartARow>) {
    setData(d => ({ ...d, partA: { ...d.partA, [id]: { ...d.partA[id], ...patch } } }));
  }
  function setFin(id: string, patch: Partial<FinRow>) {
    setData(d => ({ ...d, fin: { ...d.fin, [id]: { ...d.fin[id], ...patch } } }));
  }
  function setRatio(id: string, patch: Partial<FinRow>) {
    setData(d => ({ ...d, ratios: { ...d.ratios, [id]: { ...d.ratios[id], ...patch } } }));
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
      <tr className="hover:bg-muted/50 transition-colors align-top border-b border-border">
        <td className="px-4 py-3 text-center"><Checkbox checked={row.checked} onCheckedChange={v => setPA(proc.id, { checked: !!v })} disabled={locked} /></td>
        <td className="px-4 py-3 text-center text-xs font-semibold font-mono text-foreground">{proc.num}</td>
        <td className="px-4 py-3">
          <p className="text-xs font-semibold text-foreground mb-0.5">{proc.description}</p>
        </td>
        <td className="px-3 py-3" style={{width:140}}>
          <Select value={row.psc} onValueChange={v => setPA(proc.id, { psc: v })} disabled={locked}>
            <SelectTrigger className="h-8 text-xs w-24"><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent><SelectItem value="Y" className="text-xs">Y</SelectItem><SelectItem value="N" className="text-xs">N</SelectItem><SelectItem value="N/A" className="text-xs">N/A</SelectItem></SelectContent>
          </Select>
        </td>
        <td className="px-3 py-3">
          <Textarea disabled={locked} value={row.exceptions} onChange={e => setPA(proc.id, { exceptions: e.target.value })} placeholder="Summarize exceptions or findings…" className="min-h-[56px] text-xs resize-none rounded-[10px]" />
        </td>
        <td className="px-3 py-3 text-center" style={{width:90}}>
          <RefButton reference={row.wpRef} onAttach={doc => setPA(proc.id, { wpRef: [...row.wpRef, doc] })} onRemove={i => setPA(proc.id, { wpRef: row.wpRef.filter((_,idx)=>idx!==i) })} disabled={locked} />
        </td>
      </tr>
    );
  }

  function PASubRow({ item, letterIdx }: { item:{id:string;label:string}; letterIdx:number }) {
    const row = data.partA[item.id];
    return (
      <tr className="hover:bg-muted/50 transition-colors align-top border-b border-border last:border-b-0">
        <td className="px-4 py-2.5 text-center"><Checkbox checked={row.checked} onCheckedChange={v => setPA(item.id, { checked: !!v })} disabled={locked} /></td>
        <td className="px-4 py-2.5 text-center text-xs text-muted-foreground font-mono">{String.fromCharCode(97 + letterIdx)}.</td>
        <td className="px-4 py-2.5 pl-10">
          <p className="text-xs text-foreground leading-relaxed">{item.label}</p>
        </td>
        <td className="px-3 py-2.5" style={{width:140}}>
          <Select value={row.psc} onValueChange={v => setPA(item.id, { psc: v })} disabled={locked}>
            <SelectTrigger className="h-8 text-xs w-24"><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent><SelectItem value="Y" className="text-xs">Y</SelectItem><SelectItem value="N" className="text-xs">N</SelectItem><SelectItem value="N/A" className="text-xs">N/A</SelectItem></SelectContent>
          </Select>
        </td>
        <td className="px-3 py-2.5">
          <Textarea disabled={locked} value={row.exceptions} onChange={e => setPA(item.id, { exceptions: e.target.value })} placeholder="Summarize exceptions or findings…" className="min-h-[48px] text-xs resize-none rounded-[10px]" />
        </td>
        <td className="px-3 py-2.5 text-center" style={{width:90}}>
          <RefButton reference={row.wpRef} onAttach={doc => setPA(item.id, { wpRef: [...row.wpRef, doc] })} onRemove={i => setPA(item.id, { wpRef: row.wpRef.filter((_,idx)=>idx!==i) })} disabled={locked} />
        </td>
      </tr>
    );
  }

  // Part B — editable financial row
  function FinEditRow({ id, label, indent = 0, bold = false, showBudget, showPrior = true, source = 'fin' }: { id:string; label:string; indent?:number; bold?:boolean; showBudget:boolean; showPrior?:boolean; source?: 'fin'|'ratio' }) {
    const bucket = source === 'ratio' ? data.ratios : f;
    const setter = source === 'ratio' ? setRatio : setFin;
    const row = bucket[id] ?? emptyFin();
    const c = p(row.current), b = p(row.budget), pr = p(row.prior);
    const vbAmt = c - b, vbPct = b !== 0 ? vbAmt/b : null;
    const vpAmt = c - pr, vpPct = pr !== 0 ? vpAmt/pr : null;
    return (
      <tr className="hover:bg-muted/50 transition-colors align-top border-b border-border last:border-b-0">
        <td className={`px-4 py-2 text-xs ${bold ? 'font-semibold text-foreground' : 'text-foreground'}`} style={{paddingLeft: `${16 + indent * 12}px`}}>{label}</td>
        <td className="px-2 py-2" style={{width:120}}>
          <TdInput value={row.current} onChange={v => setter(id,{current:v})} placeholder="0" className="text-right font-mono" />
        </td>
        {showBudget && <td className="px-2 py-2" style={{width:120}}>
          <TdInput value={row.budget} onChange={v => setter(id,{budget:v})} placeholder="0" className="text-right font-mono" />
        </td>}
        {showPrior && <td className="px-2 py-2" style={{width:120}}>
          <TdInput value={row.prior} onChange={v => setter(id,{prior:v})} placeholder="0" className="text-right font-mono" />
        </td>}
        {showBudget && <>
          <td className="px-3 py-2 text-right text-xs font-mono" style={{width:90}}>{b!==0?fmtN(vbAmt):''}</td>
          <td className="px-3 py-2 text-right text-xs" style={{width:70}}>{fmtP(vbPct)}</td>
        </>}
        {showPrior && <>
          <td className="px-3 py-2 text-right text-xs font-mono" style={{width:90}}>{pr!==0?fmtN(vpAmt):''}</td>
          <td className="px-3 py-2 text-right text-xs" style={{width:70}}>{fmtP(vpPct)}</td>
        </>}
        <td className="px-2 py-2" style={{width:90}}>
          <Select value={row.hasIssue} onValueChange={v => setter(id,{hasIssue:v})} disabled={locked}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent><SelectItem value="Yes" className="text-xs">Yes</SelectItem><SelectItem value="No" className="text-xs">No</SelectItem></SelectContent>
          </Select>
        </td>
        <td className="px-2 py-2" style={{minWidth:180}}>
          {row.hasIssue === 'Yes' && <Textarea disabled={locked} value={row.explanation} onChange={e => setter(id,{explanation:e.target.value})} placeholder="Describe…" className="min-h-[44px] text-xs resize-none rounded-[10px]" />}
        </td>
        <td className="px-2 py-2" style={{width:140}}>
          {row.hasIssue === 'Yes' && <TdInput value={row.auditResponse} onChange={v => setter(id,{auditResponse:v})} placeholder="Form/ref." className="text-xs" />}
        </td>
      </tr>
    );
  }

  // Part B — computed total row (read-only)
  function FinTotalRow({ label, c, b, pr, showBudget, showPrior = true, indent = 0 }: { label:string; c:number; b:number; pr:number; showBudget:boolean; showPrior?:boolean; indent?:number }) {
    const vbAmt = c - b, vbPct = b !== 0 ? vbAmt/b : null;
    const vpAmt = c - pr, vpPct = pr !== 0 ? vpAmt/pr : null;
    return (
      <tr className="border-b border-border bg-muted/40 align-top">
        <td className="px-4 py-2 text-xs font-semibold text-foreground" style={{paddingLeft: `${16 + indent * 12}px`}}>{label}</td>
        <td className="px-3 py-2 text-right text-xs font-semibold font-mono">{c!==0?Math.abs(c).toLocaleString('en-CA',{maximumFractionDigits:0}):''}</td>
        {showBudget && <td className="px-3 py-2 text-right text-xs font-semibold font-mono">{b!==0?Math.abs(b).toLocaleString('en-CA',{maximumFractionDigits:0}):''}</td>}
        {showPrior && <td className="px-3 py-2 text-right text-xs font-semibold font-mono">{pr!==0?Math.abs(pr).toLocaleString('en-CA',{maximumFractionDigits:0}):''}</td>}
        {showBudget && <>
          <td className="px-3 py-2 text-right text-xs font-semibold font-mono">{b!==0?fmtN(vbAmt):''}</td>
          <td className="px-3 py-2 text-right text-xs font-semibold">{fmtP(vbPct)}</td>
        </>}
        {showPrior && <>
          <td className="px-3 py-2 text-right text-xs font-semibold font-mono">{pr!==0?fmtN(vpAmt):''}</td>
          <td className="px-3 py-2 text-right text-xs font-semibold">{fmtP(vpPct)}</td>
        </>}
        <td colSpan={3} />
      </tr>
    );
  }

  // Per-stream computed (read-only) row
  function FinComputedRow({ label, c, b, pr, showBudget, showPrior = true, indent = 0, isPercent = false }: { label:string; c:number; b:number; pr:number; showBudget:boolean; showPrior?:boolean; indent?:number; isPercent?:boolean }) {
    const vbAmt = c - b, vbPct = b !== 0 ? vbAmt/b : null;
    const vpAmt = c - pr, vpPct = pr !== 0 ? vpAmt/pr : null;
    const fmt = (n:number) => isPercent ? (n*100).toFixed(1)+'%' : (n!==0 ? Math.abs(n).toLocaleString('en-CA',{maximumFractionDigits:0}) : '');
    return (
      <tr className="hover:bg-muted/50 transition-colors align-top border-b border-border last:border-b-0">
        <td className="px-4 py-2 text-xs text-foreground italic" style={{paddingLeft: `${16 + indent * 12}px`}}>{label}</td>
        <td className="px-3 py-2 text-right text-xs font-mono">{fmt(c)}</td>
        {showBudget && <td className="px-3 py-2 text-right text-xs font-mono">{fmt(b)}</td>}
        {showPrior && <td className="px-3 py-2 text-right text-xs font-mono">{fmt(pr)}</td>}
        {showBudget && <>
          <td className="px-3 py-2 text-right text-xs font-mono">{isPercent ? '' : (b!==0?fmtN(vbAmt):'')}</td>
          <td className="px-3 py-2 text-right text-xs">{isPercent ? '' : fmtP(vbPct)}</td>
        </>}
        {showPrior && <>
          <td className="px-3 py-2 text-right text-xs font-mono">{isPercent ? '' : (pr!==0?fmtN(vpAmt):'')}</td>
          <td className="px-3 py-2 text-right text-xs">{isPercent ? '' : fmtP(vpPct)}</td>
        </>}
        <td colSpan={3} />
      </tr>
    );
  }

  // Part B — section header row
  function FinSectionRow({ label }: { label: string }) {
    return (
      <tr className="bg-muted border-b border-border">
        <td colSpan={99} className="px-4 py-2 text-xs font-semibold text-foreground uppercase tracking-wider">{label}</td>
      </tr>
    );
  }


  // ── Render ───────────────────────────────────────────────────────────────────

  const showBudget = data.compareBudget !== 'No';
  const showPrior  = data.comparePrior  !== 'No';

  // Per-stream gross margin ($ and %)
  const gmPerStream = salesIds.map((sid, i) => {
    const cid = cosIds[i];
    const sc = p(f[sid]?.current ?? ''), sb = p(f[sid]?.budget ?? ''), sp = p(f[sid]?.prior ?? '');
    const cc = p(f[cid]?.current ?? ''), cb = p(f[cid]?.budget ?? ''), cp = p(f[cid]?.prior ?? '');
    return { c: sc - cc, b: sb - cb, pr: sp - cp, salesC: sc, salesB: sb, salesP: sp };
  });
  const gmPctPerStream = gmPerStream.map(g => ({
    c: g.salesC ? g.c / g.salesC : 0,
    b: g.salesB ? g.b / g.salesB : 0,
    pr: g.salesP ? g.pr / g.salesP : 0,
  }));
  const totalGMPct = {
    c:  totalSales.c  ? totalGM.c  / totalSales.c  : 0,
    b:  totalSales.b  ? totalGM.b  / totalSales.b  : 0,
    pr: totalSales.pr ? totalGM.pr / totalSales.pr : 0,
  };
  const niPct = {
    c:  totalSales.c  ? netIncome.c  / totalSales.c  : 0,
    b:  totalSales.b  ? netIncome.b  / totalSales.b  : 0,
    pr: totalSales.pr ? netIncome.pr / totalSales.pr : 0,
  };

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

            <h3 className="text-xl font-semibold text-foreground">Preliminary Analytical Procedures — Parts B &amp; C</h3>

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


      {/* ── WORKSHEET: Part B / Part C tabs ───────────────────────────────── */}
      {flowState === 'worksheet' && (<>

        {/* Objective bar — matches 420 Materiality standard */}
        <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
          <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
          <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
          <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
            Compare the entity&apos;s most recent financial results to expectations (budget, prior period, industry trends);
            document matters requiring an audit response; conclude on fraud risk indicators.
            ({isUS ? 'AU-C 315 / AU-C 520' : 'CAS 315 / CAS 520'})
          </p>
        </div>

        {/* Context bar */}
        <div className="flex items-center border-b border-border bg-muted/20 px-6 py-2.5 shrink-0">
          <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
            <span><strong className="text-foreground">Entity:</strong> {entityName}</span>
            <span><strong className="text-foreground">Period end:</strong> {periodEnded}</span>
            <span><strong className="text-foreground">Performance materiality:</strong> {perfMateriality}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-muted/30">
          <div className="p-6 space-y-4">

            {/* ── Comparatives Setup card (mirrors 420 Materiality standard header cards) ── */}
            <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
              <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">Comparatives Setup</span>
                <span title="Select which comparatives to include and the number of sales streams. Auto-populated data flows from engagement setup and the 420 Materiality worksheet.">
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </span>
              </div>
              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Performance materiality</div>
                  <div className="text-sm font-semibold text-foreground">{perfMateriality}</div>
                  
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Compare to budget / forecast?</label>
                  <Select value={data.compareBudget} onValueChange={v => set({ compareBudget: v })} disabled={locked}>
                    <SelectTrigger className="h-8 text-sm w-28"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Compare to prior period?</label>
                  <Select value={data.comparePrior} onValueChange={v => set({ comparePrior: v })} disabled={locked}>
                    <SelectTrigger className="h-8 text-sm w-28"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Number of sales streams</label>
                  <Select value={String(data.numStreams)} onValueChange={v => set({ numStreams: Math.max(1, Math.min(5, Number(v))) })} disabled={locked}>
                    <SelectTrigger className="h-8 text-sm w-20"><SelectValue /></SelectTrigger>
                    <SelectContent>{[1,2,3,4,5].map(nn => <SelectItem key={nn} value={String(nn)}>{nn}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ── Part B — Financial Comparatives ── */}
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 pt-2">Part B — Financial Comparatives</div>
            <>
                {/* ── Income Statement card ── */}
                <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                  <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">Income Statement</span>
                    <span title="Compare current period to budget/forecast and prior period. Flag material or unexpected variances.">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <FinColHeaders showBudget={showBudget} showPrior={showPrior} />
                      <tbody>
                        <FinSectionRow label="Sales / Revenue" />
                        {salesIds.map((id, i) => (
                          <FinEditRow key={id} id={id} label={data.streamLabels[i] || `Stream ${i+1}`} showBudget={showBudget} showPrior={showPrior} />
                        ))}
                        <FinTotalRow label="Total Sales" c={totalSales.c} b={totalSales.b} pr={totalSales.pr} showBudget={showBudget} showPrior={showPrior} />

                        <FinSectionRow label="Cost of Sales" />
                        {cosIds.map((id, i) => (
                          <FinEditRow key={id} id={id} label={`COS — ${data.streamLabels[i] || `Stream ${i+1}`}`} showBudget={showBudget} showPrior={showPrior} />
                        ))}
                        <FinTotalRow label="Total Cost of Sales" c={totalCos.c} b={totalCos.b} pr={totalCos.pr} showBudget={showBudget} showPrior={showPrior} />

                        <FinSectionRow label="Gross Margin ($) — computed" />
                        {salesIds.map((sid, i) => (
                          <FinComputedRow key={`gm-${sid}`} label={`GM $ — ${data.streamLabels[i] || `Stream ${i+1}`}`} c={gmPerStream[i].c} b={gmPerStream[i].b} pr={gmPerStream[i].pr} showBudget={showBudget} showPrior={showPrior} />
                        ))}
                        <FinTotalRow label="Total Gross Margin ($)" c={totalGM.c} b={totalGM.b} pr={totalGM.pr} showBudget={showBudget} showPrior={showPrior} />

                        <FinSectionRow label="Gross Margin (%) — computed" />
                        {salesIds.map((sid, i) => (
                          <FinComputedRow key={`gmp-${sid}`} label={`GM % — ${data.streamLabels[i] || `Stream ${i+1}`}`} c={gmPctPerStream[i].c} b={gmPctPerStream[i].b} pr={gmPctPerStream[i].pr} showBudget={showBudget} showPrior={showPrior} isPercent />
                        ))}
                        <FinComputedRow label="Total Gross Margin (%)" c={totalGMPct.c} b={totalGMPct.b} pr={totalGMPct.pr} showBudget={showBudget} showPrior={showPrior} isPercent />

                        <FinSectionRow label="Other Revenue" />
                        <FinEditRow id="or1" label="Other revenue 1" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="or2" label="Other revenue 2" showBudget={showBudget} showPrior={showPrior} />
                        <FinTotalRow label="Total Other Revenue" c={totalOR.c} b={totalOR.b} pr={totalOR.pr} showBudget={showBudget} showPrior={showPrior} />

                        <FinSectionRow label="Expenses" />
                        <FinEditRow id="exp-sal"  label="Salaries / payroll" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="exp-occ"  label="Occupancy" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="exp-int"  label="Interest / bank charges" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="exp-bon"  label="Bonuses" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="exp-rep"  label="Repairs & maintenance" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="exp-bad"  label="Bad debts" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="exp-non"  label="Non-recurring transactions" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="exp-oth1" label="Other expenses 1" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="exp-oth2" label="Other expenses 2" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="exp-oth3" label="Other expenses 3" showBudget={showBudget} showPrior={showPrior} />
                        <FinTotalRow label="Total Expenses" c={totalExp.c} b={totalExp.b} pr={totalExp.pr} showBudget={showBudget} showPrior={showPrior} />

                        <FinTotalRow label="Net income before tax" c={netIncome.c} b={netIncome.b} pr={netIncome.pr} showBudget={showBudget} showPrior={showPrior} />
                        <FinComputedRow label="     % of revenue" c={niPct.c} b={niPct.b} pr={niPct.pr} showBudget={showBudget} showPrior={showPrior} isPercent />
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── Balance Sheet card ── */}
                <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                  <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">Balance Sheet</span>
                    <span title="Compare current period balances to budget/forecast and prior period. Flag material variances.">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <FinColHeaders showBudget={showBudget} showPrior={showPrior} />
                      <tbody>
                        <FinSectionRow label="Current Assets" />
                        <FinEditRow id="ca-cash"      label="Cash" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="ca-inv"       label="Short-term investments" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="ca-ar"        label="Accounts receivable" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="ca-inventory" label="Inventory" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="ca-oth1"      label="Other assets 1" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="ca-oth2"      label="Other assets 2" showBudget={showBudget} showPrior={showPrior} />
                        <FinTotalRow label="Total Current Assets" c={totalCA.c} b={totalCA.b} pr={totalCA.pr} showBudget={showBudget} showPrior={showPrior} />

                        <FinSectionRow label="Long-Term Assets" />
                        <FinEditRow id="lta-ppe"  label="Property, plant & equipment" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="lta-oth1" label="Other assets 1" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="lta-oth2" label="Other assets 2" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="lta-oth3" label="Other assets 3" showBudget={showBudget} showPrior={showPrior} />
                        <FinTotalRow label="Total Long-Term Assets" c={totalLTA.c} b={totalLTA.b} pr={totalLTA.pr} showBudget={showBudget} showPrior={showPrior} />
                        <FinTotalRow label="Total Assets" c={totalA.c} b={totalA.b} pr={totalA.pr} showBudget={showBudget} showPrior={showPrior} />

                        <FinSectionRow label="Current Liabilities" />
                        <FinEditRow id="cl-bank"  label="Bank indebtedness" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="cl-ap"    label="Accounts payable & accrued liabilities" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="cl-tax"   label="Income taxes payable" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="cl-fut"   label="Future income taxes payable" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="cl-def"   label="Deferred revenue" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="cl-dep"   label="Customer deposits" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="cl-std"   label="Short-term debt" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="cl-cpltd" label="Current portion of long-term debt" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="cl-oth1"  label="Other current liabilities 1" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="cl-oth2"  label="Other current liabilities 2" showBudget={showBudget} showPrior={showPrior} />
                        <FinTotalRow label="Total Current Liabilities" c={totalCL.c} b={totalCL.b} pr={totalCL.pr} showBudget={showBudget} showPrior={showPrior} />

                        <FinSectionRow label="Long-Term Liabilities" />
                        <FinEditRow id="ltl-loan" label="Loans payable" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="ltl-fut"  label="Future income taxes payable" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="ltl-ltd"  label="Long-term debt" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="ltl-oth1" label="Other long-term liabilities 1" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="ltl-oth2" label="Other long-term liabilities 2" showBudget={showBudget} showPrior={showPrior} />
                        <FinTotalRow label="Total Long-Term Liabilities" c={totalLTL.c} b={totalLTL.b} pr={totalLTL.pr} showBudget={showBudget} showPrior={showPrior} />
                        <FinTotalRow label="Total Liabilities" c={totalL.c} b={totalL.b} pr={totalL.pr} showBudget={showBudget} showPrior={showPrior} />

                        <FinSectionRow label="Equity" />
                        <FinEditRow id="eq-ret" label="Retained earnings" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="eq-con" label="Contributed surplus" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="eq-shr" label="Share capital" showBudget={showBudget} showPrior={showPrior} />
                        <FinEditRow id="eq-oth" label="Other equity" showBudget={showBudget} showPrior={showPrior} />
                        <FinTotalRow label="Total Equity" c={totalEQ.c} b={totalEQ.b} pr={totalEQ.pr} showBudget={showBudget} showPrior={showPrior} />
                        <FinTotalRow label="Total Liabilities & Equity" c={totalLE.c} b={totalLE.b} pr={totalLE.pr} showBudget={showBudget} showPrior={showPrior} />
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── Ratios card ── */}
                <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                  <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">Ratios</span>
                    <span title="Enter key liquidity, activity and leverage ratios for the current period, budget/forecast and prior period.">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <FinColHeaders showBudget={showBudget} showPrior={showPrior} />
                      <tbody>
                        <FinEditRow id="rat-wc"     label="Working capital"                              showBudget={showBudget} showPrior={showPrior} source="ratio" />
                        <FinEditRow id="rat-drecv"  label="Number of days in receivables"                showBudget={showBudget} showPrior={showPrior} source="ratio" />
                        <FinEditRow id="rat-dinv"   label="Number of days' sales in inventory"           showBudget={showBudget} showPrior={showPrior} source="ratio" />
                        <FinEditRow id="rat-iturn"  label="Inventory turnover"                           showBudget={showBudget} showPrior={showPrior} source="ratio" />
                        <FinEditRow id="rat-dpay"   label="Number of days' purchases in trade payables"  showBudget={showBudget} showPrior={showPrior} source="ratio" />
                        <FinEditRow id="rat-dte"    label="Debt-to-equity ratio"                         showBudget={showBudget} showPrior={showPrior} source="ratio" />
                      </tbody>
                    </table>
                  </div>
                </div>
              </>


            {/* ── Part C — Matters & Sign-off ── */}
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 pt-4">Part C — Matters &amp; Sign-off</div>
            {true && (
              <>
                {/* ── Matters register card ── */}
                <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                  <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">Matters Requiring Audit Response</span>
                    <span title="Document each matter flagged in Part B: management response and audit implications.">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-muted border-b border-border">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-24">Part B ref.</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Summary of matter</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Management response</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Audit implications</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {data.matters.map((m, idx) => (
                          <tr key={idx} className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-2.5 align-top w-24">
                              <TdInput value={m.partBRef} onChange={v => setMatter(idx, { partBRef: v })} placeholder="—" />
                            </td>
                            <td className="px-4 py-2.5 align-top">
                              <Textarea disabled={locked} value={m.summary} onChange={e => setMatter(idx, { summary: e.target.value })} placeholder="Describe the matter…" className="min-h-[52px] text-sm resize-none bg-background border-border" />
                            </td>
                            <td className="px-4 py-2.5 align-top">
                              <Textarea disabled={locked} value={m.mgmtResponse} onChange={e => setMatter(idx, { mgmtResponse: e.target.value })} placeholder="Management response…" className="min-h-[52px] text-sm resize-none bg-background border-border" />
                            </td>
                            <td className="px-4 py-2.5 align-top">
                              <Textarea disabled={locked} value={m.auditImplications} onChange={e => setMatter(idx, { auditImplications: e.target.value })} placeholder="Audit implications…" className="min-h-[52px] text-sm resize-none bg-background border-border" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── Fraud conclusion card ── */}
                <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                  <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">Fraud Risk Conclusion</span>
                    <span title={`Conclude on whether analytical procedures identified unusual or unexpected relationships indicating risks of material misstatement due to fraud. (${isUS ? 'AU-C 240' : 'CAS 240'}.22)`}>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </span>
                  </div>
                  <div className="px-6 py-5">
                    <Textarea
                      disabled={locked}
                      value={data.fraudAnswer}
                      onChange={e => set({ fraudAnswer: e.target.value })}
                      placeholder="Document conclusion on fraud risk indicators arising from the preliminary analytical procedures…"
                      className="min-h-[100px] text-sm resize-none bg-background border-border"
                    />
                  </div>
                </div>

                {/* ── Sign-off (standard checklist sign-off) ── */}
                <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                  <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">Sign-off</span>
                  </div>
                  <WorksheetSignOff worksheetKey="pap501bc" engagementId={engagementId} />
                  <div className="border-t border-border px-6 py-4 flex items-center justify-end gap-3 bg-muted/20">
                    {locked ? (
                      <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-xs text-green-800 font-medium">
                        Concluded on {data.concludedOn}
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => set({ concluded: true, concludedOn: new Date().toISOString().slice(0,10) })}>
                        Conclude worksheet
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

      </>)}


    </div>
  );
}
