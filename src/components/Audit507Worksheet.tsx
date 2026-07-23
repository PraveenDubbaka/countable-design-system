import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Info, Plus, Sparkles } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { WorksheetSignOff } from "@/components/WorksheetSignOff";
import { ImportNotesDialog, ImportResult } from "@/components/ImportNotesDialog";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProcRow { doneBy: string; comments: string; wpRef: RefDoc[] }
interface ExtractRow { mt: string; date: string; extract: string; riskForm520: boolean; wpRef: RefDoc[] }
interface Data507 {
 partA: Record<string, ProcRow>;
 dateAuditedFS: string;
 dateAuditorAppt: string;
 partB: Record<string, ProcRow>;
 partC: ExtractRow[];
 conclusion: string;
 concluded: boolean;
 concludedOn: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const SUBITEMS_3 = [
 'a. Business plans and actual/proposed changes in operations.',
 'b. New contracts, loans, business decisions and transactions.',
 'c. Bonus payments and changes in management incentive plans.',
 'd. Any instances or allegations of fraud, management override or other unethical behaviour.',
 'e. Related-party transactions.',
 'f. Changes in share capital or ownership.',
 'g. Changes in pervasive or specific internal controls, policies and related systems.',
 'h. New business or fraud risk factors.',
 'i. Events/conditions that could cast doubt on the entity\'s ability to continue as a going concern.',
 'j. Deficiencies identified in internal control.',
 'k. Preparation or need for estimates.',
 'l. Non-compliance with regulatory matters.',
 'm. Changes in the application of accounting policies.',
 'n. Litigation and contingencies.',
 'o. Relevant communications between management and TCWG.',
 'p. Other matters of interest, such as disputes with management, conflicts of interest or matters affecting key personnel, suppliers or customers, etc.',
];

const ITEM_8_SUBITEMS = [
 'a. Minutes have not been signed or dated.',
 'b. Meetings have been held but no minutes are yet available.',
 'c. Meetings were scheduled but never held.',
];

type PartAItem = {
 id: string; num: string; section: string; description: string;
 subitems?: string[]; hasDateFields?: boolean;
};

const PART_A: PartAItem[] = [
 {
 id: 'a1', num: '1', section: 'General',
 description: 'Describe what minutes are available and the dates of meetings held (include any sub-committees, such as the audit committee).',
 },
 {
 id: 'a2', num: '2', section: 'General',
 description: 'Consider copying relevant extracts from minutes, or including a copy of the entire minutes or completing Part C of this worksheet for the file.',
 },
 {
 id: 'a3', num: '3', section: 'Review Content',
 description: 'Note or highlight matters in the minutes that will need to be addressed in the audit, such as:',
 subitems: SUBITEMS_3,
 },
 {
 id: 'a4', num: '4', section: 'Pervasive Controls',
 description: 'Check that financial matters/decisions mentioned in the minutes have been reflected in the accounting records.',
 },
 {
 id: 'a5', num: '5', section: 'Pervasive Controls',
 description: 'Describe any significant events/contracts (that we are aware of) in the period that were not documented or approved in the minutes.',
 },
 {
 id: 'a6', num: '6', section: 'Pervasive Controls',
 description: 'Note the date when the minutes recorded:',
 hasDateFields: true,
 },
 {
 id: 'a7', num: '7', section: 'Pervasive Controls',
 description: 'Inquire how TCWG exercise oversight of management\'s processes for identifying and responding to the risks of fraud.',
 },
 {
 id: 'a8', num: '8', section: 'Pervasive Controls',
 description: 'Note any instances and reasons where:',
 subitems: ITEM_8_SUBITEMS,
 },
 {
 id: 'a9', num: '9', section: 'Pervasive Controls',
 description: 'Note any assessments or reports on board/committee effectiveness.',
 },
 {
 id: 'a10', num: '10', section: 'Audit Response',
 description: 'Document the impact (if any) of matters noted above on assessed risks and planned audit procedures.',
 },
];

type PartBItem = { id: string; num: string; description: string; subitems?: string[] };

const PART_B: PartBItem[] = [
 {
 id: 'b1', num: '1',
 description: 'Inquire why meetings were not held, or if meetings were held, why no minutes were prepared.',
 },
 {
 id: 'b2', num: '2',
 description: 'Inquire how TCWG exercise oversight of management and their processes (if any) for identifying and responding to the risks of fraud.',
 },
 {
 id: 'b3', num: '3',
 description: 'Obtain details (where applicable) of matters that will need to be addressed in the audit, such as:',
 subitems: SUBITEMS_3,
 },
 {
 id: 'b4', num: '4',
 description: 'Document the information obtained in Points 1 to 3 above and obtain a written representation from management on the completeness and accuracy of the matters addressed.',
 },
 {
 id: 'b5', num: '5',
 description: 'Consider the impact (if any) of the matters noted above on assessed risks and planned audit procedures.',
 },
];

const PART_C_INITIAL = 3;

function emptyProc(): ProcRow { return { doneBy: '', comments: '', wpRef: [] }; }
function emptyExtract(): ExtractRow { return { mt: '', date: '', extract: '', riskForm520: false, wpRef: [] }; }

function buildDefault(): Data507 {
 const partA: Record<string, ProcRow> = {};
 PART_A.forEach(p => { partA[p.id] = emptyProc(); });
 const partB: Record<string, ProcRow> = {};
 PART_B.forEach(p => { partB[p.id] = emptyProc(); });
 return {
 partA,
 dateAuditedFS: '', dateAuditorAppt: '',
 partB,
 partC: Array.from({ length: PART_C_INITIAL }, emptyExtract),
 conclusion: '', concluded: false, concludedOn: '',
 };
}

// ── Section grouping helper ────────────────────────────────────────────────────

function groupedPartA() {
 const seen = new Set<string>();
 return PART_A.map(item => ({
...item,
 showSection: !seen.has(item.section) && (seen.add(item.section), true),
 }));
}

// ── Component ──────────────────────────────────────────────────────────────────

export function Audit507Worksheet({ isUS = false }: { isUS?: boolean }) {
 const storageKey = `audit-507-data-${isUS ? 'us' : 'ca'}`;
 const { engagementId = '' } = useParams<{ engagementId: string }>();

 const [data, setData] = useState<Data507>(() => {
 const saved = readJsonFromLocalStorage<Data507 | null>(storageKey, null);
 if (!saved) return buildDefault();
 const def = buildDefault();
 return {
...def,
...saved,
 partA: {...def.partA,...(saved.partA ?? {}) },
 partB: {...def.partB,...(saved.partB ?? {}) },
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

 function setPA(id: string, patch: Partial<ProcRow>) {
 setData(d => ({...d, partA: {...d.partA, [id]: {...d.partA[id],...patch } } }));
 }
 function setPB(id: string, patch: Partial<ProcRow>) {
 setData(d => ({...d, partB: {...d.partB, [id]: {...d.partB[id],...patch } } }));
 }
 function setPC(idx: number, patch: Partial<ExtractRow>) {
 setData(d => { const rows = [...d.partC]; rows[idx] = {...rows[idx],...patch }; return {...d, partC: rows }; });
 }
 function addPartCRow() {
 setData(d => ({...d, partC: [...d.partC, emptyExtract()] }));
 }

 const [importOpen, setImportOpen] = useState(false);

 function applyImport(result: ImportResult) {
 setData(d => {
 const nextA = {...d.partA };
 const nextB = {...d.partB };
 if (result.agendaNotes) {
 for (const [id, notes] of Object.entries(result.agendaNotes)) {
 if (nextA[id]) nextA[id] = {...nextA[id], comments: notes };
 if (nextB[id]) nextB[id] = {...nextB[id], comments: notes };
 }
 }
 return {...d, partA: nextA, partB: nextB };
 });
 const sourceLabel = result.source.charAt(0).toUpperCase() + result.source.slice(1);
 toast.success(`Worksheet populated from ${sourceLabel}`, {
 description: 'Review and refine the auto-filled content before sign-off.',
 });
 }

 const GROUPED_A = groupedPartA();

 function renderProcTable(
 items: (PartAItem | PartBItem)[],
 getRow: (id: string) => ProcRow,
 setRow: (id: string, patch: Partial<ProcRow>) => void,
 ) {
 return (
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="sticky top-0 z-10">
 <tr className="bg-muted border-b border-border">
 <th className="w-10 px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider">#</th>
 <th className="w-[42%] px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Procedure</th>
 <th className="w-[130px] px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider" style={{ minWidth: 130 }}>Done by</th>
 <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Comments</th>
 <th className="w-[100px] px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" style={{ minWidth: 100 }}>W/P ref.</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {(items as (PartAItem & PartBItem)[]).map(proc => {
 const row = getRow(proc.id);
 const isA6 = proc.id === 'a6';
 return (
 <tr key={proc.id} className="hover:bg-muted/50 transition-colors">
 <td className="px-4 py-3 text-center align-top text-xs font-semibold font-mono text-foreground">{proc.num}</td>
 <td className="w-[42%] px-6 py-3 align-top text-sm text-foreground">
 {'showSection' in proc && proc.showSection && (
 <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">{proc.section}</p>
 )}
 {proc.description}
 {proc.subitems && (
 <ul className="mt-1.5 space-y-0.5 list-none pl-2">
 {proc.subitems.map((sub, i) => (
 <li key={i} className="text-xs text-muted-foreground">{sub}</li>
 ))}
 </ul>
 )}
 {isA6 && (
 <div className="mt-2 space-y-1.5">
 <div className="flex items-center gap-2 text-xs">
 <span className="text-muted-foreground shrink-0">Approval of prior period's audited F/S. Date:</span>
 <Input
 disabled={locked}
 type="date"
 value={data.dateAuditedFS}
 onChange={e => setData(d => ({...d, dateAuditedFS: e.target.value }))}
 className="h-7 text-xs bg-background w-36"
 />
 </div>
 <div className="flex items-center gap-2 text-xs">
 <span className="text-muted-foreground shrink-0">The firm's appointment as auditors. Date:</span>
 <Input
 disabled={locked}
 type="date"
 value={data.dateAuditorAppt}
 onChange={e => setData(d => ({...d, dateAuditorAppt: e.target.value }))}
 className="h-7 text-xs bg-background w-36"
 />
 </div>
 </div>
 )}
 </td>
 <td className="w-[130px] px-4 py-3 align-top" style={{ minWidth: 130 }}>
 <Input
 disabled={locked}
 value={row.doneBy}
 onChange={e => setRow(proc.id, { doneBy: e.target.value })}
 placeholder="Initials"
 className="h-8 text-sm bg-background"
 />
 </td>
 <td className="px-4 py-3 align-top">
 <Textarea
 disabled={locked}
 value={row.comments}
 onChange={e => setRow(proc.id, { comments: e.target.value })}
 placeholder="Enter comments…"
 className="min-h-[56px] text-sm bg-background resize-none"
 />
 </td>
 <td className="w-[100px] px-4 py-3 align-top text-center" style={{ minWidth: 100 }}>
 <RefButton
 reference={row.wpRef}
 onAttach={doc => setRow(proc.id, { wpRef: [...row.wpRef, doc] })}
 onRemove={i => setRow(proc.id, { wpRef: row.wpRef.filter((_, idx) => idx !== i) })}
 disabled={locked}
 />
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 );
 }

 return (
 <div className="flex flex-col h-full">

 {/* Objective */}
 <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
 <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
 <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
 <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
 To identify possible risk factors based on a review of minutes from meetings of those charged with governance or, if no minutes were prepared, the results of inquiries to determine matters that would normally have been included.{" "}
 <span className="font-medium text-foreground">Note:</span>{" "}
 Use <span className="font-medium text-foreground">Part A</span> when minutes are available; use{" "}
 <span className="font-medium text-foreground">Part B</span> when no minutes exist or meetings are not held. Use{" "}
 <span className="font-medium text-foreground">Part C</span> to record relevant extracts.
 </p>
 </div>

 <ImportNotesDialog open={importOpen} onOpenChange={setImportOpen} onImport={applyImport} />

 <div className="flex-1 overflow-y-auto bg-muted/30">
 <div className="p-6 space-y-4">

 {/* Part A */}
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center justify-between">
 <div>
 <span className="text-sm font-semibold text-foreground">Part A — Review of minutes prepared by entity</span>
 <p className="text-xs text-muted-foreground mt-0.5">Complete this part when minutes or governance documents are available.</p>
 </div>
 <Button size="sm" onClick={() => setImportOpen(true)} className="h-8 shrink-0 whitespace-nowrap ml-4">
 <Sparkles className="h-3.5 w-3.5 mr-1.5" />
 Import
 </Button>
 </div>
 {renderProcTable(GROUPED_A, id => data.partA[id], setPA)}
 </div>

 {/* Part B */}
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border">
 <span className="text-sm font-semibold text-foreground">Part B — Inquiries when no meetings held or no minutes prepared</span>
 <p className="text-xs text-muted-foreground mt-0.5">Complete this part when formal minutes are not available.</p>
 </div>
 {renderProcTable(PART_B, id => data.partB[id], setPB)}
 </div>

 {/* Part C */}
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border">
 <span className="text-sm font-semibold text-foreground">Part C — Extracts from minutes and other matters that have audit implications</span>
 <p className="text-xs text-muted-foreground mt-0.5">MT = Meeting type, such as directors, audit committee or other committees.</p>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="sticky top-0 z-10">
 <tr className="bg-muted border-b border-border">
 <th className="w-[140px] px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider" style={{ minWidth: 140 }}>MT</th>
 <th className="w-[130px] px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider border-l border-border" style={{ minWidth: 130 }}>Date</th>
 <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider border-l border-border">Relevant extracts from minutes and matters noted that require an audit response</th>
 <th className="w-[110px] px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider border-l border-border" style={{ minWidth: 110 }}>Record</th>
 <th className="w-[100px] px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider border-l border-border" style={{ minWidth: 100 }}>W/P ref.</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {data.partC.map((row, i) => (
 <tr key={i} className="hover:bg-muted/50 transition-colors">
 <td className="w-[140px] px-4 py-2 align-top" style={{ minWidth: 140 }}>
 <Input
 disabled={locked}
 value={row.mt}
 onChange={e => setPC(i, { mt: e.target.value })}
 placeholder="e.g. Directors"
 className="h-8 text-sm bg-background"
 />
 </td>
 <td className="w-[130px] px-4 py-2 align-top border-l border-border" style={{ minWidth: 130 }}>
 <Input
 disabled={locked}
 type="date"
 value={row.date}
 onChange={e => setPC(i, { date: e.target.value })}
 className="h-8 text-sm bg-background"
 />
 </td>
 <td className="px-4 py-2 align-top border-l border-border">
 <Textarea
 disabled={locked}
 value={row.extract}
 onChange={e => setPC(i, { extract: e.target.value })}
 placeholder="Enter extract or matter noted…"
 className="min-h-[56px] text-sm bg-background resize-none"
 />
 </td>
 <td className="w-[110px] px-4 py-2 align-top text-center border-l border-border" style={{ minWidth: 110 }}>
 <div className="flex items-center justify-center pt-1">
 <Checkbox
 checked={row.riskForm520}
 onCheckedChange={v => setPC(i, { riskForm520: !!v })}
 disabled={locked}
 />
 </div>
 </td>
 <td className="w-[100px] px-4 py-2 align-top text-center border-l border-border" style={{ minWidth: 100 }}>
 <RefButton
 reference={row.wpRef}
 onAttach={doc => setPC(i, { wpRef: [...row.wpRef, doc] })}
 onRemove={j => setPC(i, { wpRef: row.wpRef.filter((_, idx) => idx !== j) })}
 disabled={locked}
 />
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 {!locked && (
 <div className="px-4 py-2.5 border-t border-border">
 <Button
 variant="ghost"
 size="sm"
 onClick={addPartCRow}
 className="text-muted-foreground hover:text-foreground gap-1.5"
 >
 <Plus className="h-3.5 w-3.5" />
 Add row
 </Button>
 </div>
 )}
 </div>

 {/* Sign-off */}
 <WorksheetSignOff worksheetKey="aud-507" engagementId={engagementId} />

 {/* Conclude */}
 <div className="flex items-center justify-between gap-4 pb-2">
 {data.concluded && (
 <div className="rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 px-4 py-2.5 text-sm text-green-800 dark:text-green-300 flex-1">
 Concluded on {data.concludedOn}
 </div>
 )}
 <div className="ml-auto">
 <Button
 disabled={locked}
 onClick={() => {
 const now = new Date().toISOString().slice(0, 10);
 setData(d => {
 const next = {...d, concluded: true, concludedOn: now };
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
 </div>
 );
}
