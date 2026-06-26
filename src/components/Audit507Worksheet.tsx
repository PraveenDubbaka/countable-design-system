import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProcRow { doneBy: string; comments: string; wpRef: RefDoc[] }
interface ExtractRow { mt: string; date: string; extract: string; riskForm520: boolean; wpRef: RefDoc[] }
interface Data507 {
  partA: Record<string, ProcRow>;
  dateAuditedFS: string;
  dateAuditorAppt: string;
  partB: Record<string, ProcRow>;
  dateBNoMeetings: string;
  partC: ExtractRow[];
  conclusion: string; concluded: boolean; concludedOn: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const SUBITEMS_3 = [
  'a. Notes payable or new debt.',
  'b. Long-term debt.',
  'c. Capital stock activities.',
  'd. Dividends.',
  'e. Compensation of officers, directors or owners.',
  'f. Share issuances, repurchases and option grants (as applicable).',
  'g. Acquisitions, divestitures and other significant commitments.',
  'h. Significant contracts, related party transactions and capital expenditures.',
  'i. New or pending legal or regulatory matters.',
  'j. Revenue and profit levels and goals.',
  'k. Changes in internal controls (including IT) or management.',
  'l. Operating and/or financial challenges facing the entity.',
  'm. Environmental or social issues facing the entity.',
  'n. Going concern issues and solvency of the entity.',
  'o. New or amended laws and regulations.',
  'p. Other items of concern.',
];

type PartAItem = { id: string; num: string; section: string; description: string; subitems?: string[]; hasDateFields?: boolean };

const PART_A: PartAItem[] = [
  { id: 'a1', num: '1', section: 'General', description: "Select governance documents available (such as the shareholders' agreement, society bylaws, board policies or terms of reference) and obtain copies or extracts." },
  { id: 'a2', num: '2', section: 'General', description: 'Determine when governance meetings are held, what records are maintained, and review the most recent minutes or governance documents available.' },
  { id: 'a3', num: '3', section: 'Review Content', description: 'If minutes are available, trace the significant matters discussed from the financial statements and notes to the minutes or other governance documents of the entity. Consider matters such as:', subitems: SUBITEMS_3 },
  { id: 'a4', num: '4', section: 'Pervasive Controls', description: 'Inquire whether significant decisions have been made at management meetings or informally (without formal ratification by the board) rather than at governance meetings.' },
  { id: 'a5', num: '5', section: 'Pervasive Controls', description: 'Consider that the client may have several related entities or business units with their own governance meetings. Obtain copies of the minutes for any such entities or units if they are included in the scope of the engagement.' },
  { id: 'a6', num: '6', section: 'Pervasive Controls', description: 'Note the date when the minutes recorded the approval of the prior period\'s audited financial statements and the firm\'s appointment as auditors. (Enter dates in the Comments column.)', hasDateFields: true },
  { id: 'a7', num: '7', section: 'Pervasive Controls', description: 'Note any significant differences between what was stated in the governance minutes and what was recorded in the financial statements.' },
  { id: 'a8', num: '8', section: 'Pervasive Controls', description: 'Note any significant matters related to the engagement that are not mentioned in the minutes, or any matters mentioned in the minutes that are not addressed in the financial statements.' },
  { id: 'a9', num: '9', section: 'Pervasive Controls', description: "Inquire whether there are any matters arising from the minutes that require follow-up from prior period governance meetings and confirm that management's response has been documented." },
  { id: 'a10', num: '10', section: 'Audit Response', description: 'Document the audit response to matters arising from the review of governance minutes. Update the audit plan and risk assessment as required. Record risk factors on Form 520.' },
];

type PartBItem = { id: string; num: string; description: string; subitems?: string[] };

const PART_B: PartBItem[] = [
  { id: 'b1', num: '1', description: 'Document the reason why minutes or governance meeting records are not available (e.g., the entity does not hold formal governance meetings, minutes are not kept, or they are not accessible).' },
  { id: 'b2', num: '2', description: "Inquire of management and, where applicable, those charged with governance (TCWG) about significant decisions made during the period in the absence of recorded minutes." },
  { id: 'b3', num: '3', description: 'Consider matters such as:', subitems: SUBITEMS_3 },
  { id: 'b4', num: '4', description: 'Inquire whether significant decisions were made informally and document the representations obtained from management regarding governance matters.' },
  { id: 'b5', num: '5', description: 'Document the audit response to any matters identified through inquiries. Update the audit plan and risk assessment as required. Record risk factors on Form 520.' },
];

const PART_C_ROWS = 11;

function emptyProc(): ProcRow { return { doneBy: '', comments: '', wpRef: [] }; }
function emptyExtract(): ExtractRow { return { mt: '', date: '', extract: '', riskForm520: false, wpRef: [] }; }

function buildDefault(): Data507 {
  const partA: Record<string, ProcRow> = {};
  PART_A.forEach(p => { partA[p.id] = emptyProc(); });
  const partB: Record<string, ProcRow> = {};
  PART_B.forEach(p => { partB[p.id] = emptyProc(); });
  const partC = Array.from({length: PART_C_ROWS}, emptyExtract);
  return { partA, dateAuditedFS: '', dateAuditorAppt: '', partB, dateBNoMeetings: '', partC, conclusion: '', concluded: false, concludedOn: '' };
}

// ── Section grouping helper ────────────────────────────────────────────────────

function groupedPartA() {
  const seen = new Set<string>();
  return PART_A.map(item => ({ ...item, showSection: !seen.has(item.section) && (seen.add(item.section), true) }));
}

// ── Component ──────────────────────────────────────────────────────────────────

export function Audit507Worksheet({ isUS = false }: { isUS?: boolean }) {
  const storageKey = `audit-507-data-${isUS ? 'us' : 'ca'}`;

  const [data, setData] = useState<Data507>(() => {
    const saved = readJsonFromLocalStorage<Data507 | null>(storageKey, null);
    if (!saved) return buildDefault();
    const def = buildDefault();
    return {
      ...def, ...saved,
      partA: { ...def.partA, ...(saved.partA ?? {}) },
      partB: { ...def.partB, ...(saved.partB ?? {}) },
      partC: saved.partC?.length ? saved.partC : def.partC,
    };
  });

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 600);
    return () => clearTimeout(t);
  }, [data, storageKey]);

  const locked = data.concluded;
  function setPA(id: string, patch: Partial<ProcRow>) { setData(d => ({ ...d, partA: { ...d.partA, [id]: { ...d.partA[id], ...patch } } })); }
  function setPB(id: string, patch: Partial<ProcRow>) { setData(d => ({ ...d, partB: { ...d.partB, [id]: { ...d.partB[id], ...patch } } })); }
  function setPC(idx: number, patch: Partial<ExtractRow>) {
    setData(d => { const rows = [...d.partC]; rows[idx] = { ...rows[idx], ...patch }; return { ...d, partC: rows }; });
  }

  const GROUPED_A = groupedPartA();

  function renderProcTable(
    items: (PartAItem | PartBItem)[],
    getRow: (id: string) => ProcRow,
    setRow: (id: string, patch: Partial<ProcRow>) => void,
    extra?: React.ReactNode
  ) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-muted border-b border-border">
              <th className="w-10 px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider">#</th>
              <th className="w-[38%] px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Procedure</th>
              <th className="w-[140px] px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider" style={{minWidth:140}}>Done by</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Comments</th>
              <th className="w-[100px] px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" style={{minWidth:100}}>W/P ref.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(items as (PartAItem & PartBItem)[]).map(proc => {
              const row = getRow(proc.id);
              const isA6 = proc.id === 'a6';
              return (
                <tr key={proc.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-center align-top text-xs font-semibold font-mono text-foreground">{proc.num}</td>
                  <td className="w-[38%] px-6 py-3 align-top text-sm text-foreground">
                    {'showSection' in proc && proc.showSection && (
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">{proc.section}</p>
                    )}
                    {proc.description}
                    {proc.subitems && (
                      <ul className="mt-1.5 space-y-0.5 list-none pl-2">
                        {proc.subitems.map((sub, i) => <li key={i} className="text-xs text-muted-foreground">{sub}</li>)}
                      </ul>
                    )}
                    {isA6 && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground shrink-0">Approval of prior period's audited F/S. Date:</span>
                          <Input disabled={locked} value={data.dateAuditedFS} onChange={e => setData(d => ({...d, dateAuditedFS:e.target.value}))} placeholder="YYYY-MM-DD" className="h-8 text-xs bg-background" />
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground shrink-0">The firm's appointment as auditors. Date:</span>
                          <Input disabled={locked} value={data.dateAuditorAppt} onChange={e => setData(d => ({...d, dateAuditorAppt:e.target.value}))} placeholder="YYYY-MM-DD" className="h-8 text-xs bg-background" />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="w-[140px] px-4 py-3 align-top" style={{minWidth:140}}>
                    <Input disabled={locked} value={row.doneBy} onChange={e => setRow(proc.id, {doneBy:e.target.value})} placeholder="Initials" className="h-8 text-sm bg-background" />
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Textarea disabled={locked} value={row.comments} onChange={e => setRow(proc.id, {comments:e.target.value})} placeholder="Enter comments…" className="min-h-[56px] text-sm bg-background resize-none" />
                  </td>
                  <td className="w-[100px] px-4 py-3 align-top text-center" style={{minWidth:100}}>
                    <RefButton reference={row.wpRef} onAttach={doc => setRow(proc.id, {wpRef:[...row.wpRef,doc]})} onRemove={i => setRow(proc.id, {wpRef:row.wpRef.filter((_,idx)=>idx!==i)})} disabled={locked} />
                  </td>
                </tr>
              );
            })}
            {extra}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          To review the minutes of governance meetings (board of directors, audit committee, shareholders, etc.) and other governance documents to identify matters relevant to the audit.{" "}
          <span className="font-medium text-foreground">Note:</span> Use <span className="font-medium text-foreground">Part A</span> when minutes are available; use <span className="font-medium text-foreground">Part B</span> when no minutes exist or meetings are not held. Use <span className="font-medium text-foreground">Part C</span> to record relevant extracts. Record risk factors on <span className="font-medium text-foreground">Form 520</span>.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* Part A */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Part A — Review of governance minutes</span>
              <p className="text-xs text-muted-foreground mt-0.5">Complete this part when minutes or governance documents are available.</p>
            </div>
            {renderProcTable(GROUPED_A, id => data.partA[id], setPA)}
          </div>

          {/* Part B */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Part B — Inquiries when no governance meetings are held or no minutes are available</span>
              <p className="text-xs text-muted-foreground mt-0.5">Complete this part when formal minutes are not available.</p>
            </div>
            {renderProcTable(PART_B, id => data.partB[id], setPB)}
          </div>

          {/* Part C */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Part C — Extracts from governance minutes</span>
              <p className="text-xs text-muted-foreground mt-0.5">Record relevant extracts or summaries of matters noted during the review of minutes. Indicate if the matter needs to be recorded as a risk on Form 520.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider" style={{width:120,minWidth:120}}>MT</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider border-l border-border" style={{width:130,minWidth:130}}>Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider border-l border-border">Relevant extracts / matters noted</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider border-l border-border" style={{width:110,minWidth:110}}>Form 520</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider border-l border-border" style={{width:110,minWidth:110}}>W/P ref.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.partC.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-2 align-top" style={{width:120}}>
                        <Input disabled={locked} value={row.mt} onChange={e => setPC(i, {mt:e.target.value})} placeholder="Meeting type" className="h-8 text-sm border-border" />
                      </td>
                      <td className="px-4 py-2 align-top border-l border-border" style={{width:130}}>
                        <Input disabled={locked} value={row.date} onChange={e => setPC(i, {date:e.target.value})} placeholder="YYYY-MM-DD" className="h-8 text-sm border-border" />
                      </td>
                      <td className="px-6 py-2 align-top border-l border-border">
                        <Textarea disabled={locked} value={row.extract} onChange={e => setPC(i, {extract:e.target.value})} placeholder="Enter extract or matter noted…" className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent" />
                      </td>
                      <td className="px-4 py-2 align-top text-center border-l border-border" style={{width:110}}>
                        <div className="flex items-center justify-center pt-1">
                          <Checkbox checked={row.riskForm520} onCheckedChange={v => setPC(i, {riskForm520:!!v})} disabled={locked} />
                        </div>
                      </td>
                      <td className="px-4 py-2 align-top text-center border-l border-border" style={{width:110}}>
                        <RefButton reference={row.wpRef} onAttach={doc => setPC(i, {wpRef:[...row.wpRef,doc]})} onRemove={j => setPC(i, {wpRef:row.wpRef.filter((_,idx)=>idx!==j)})} disabled={locked} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
