import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Plus, Trash2 } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

// ── Types ──────────────────────────────────────────────────────────────────────

type YN = "Y" | "N" | "NA" | "";

interface ProcedureRow {
 psc: YN;
 initials: string;
 comments: string;
 wpRef: RefDoc[];
}

interface ScotabdRow {
 id: string;
 cycle: string;
 understandingObtained: string; // inquiry / observation / inspection / walkthrough
 itApps: string;
 processDescription: string;
 nonTransactionEvents: string;
 supportsFs: YN;
 deficiencyNote: string;
}

interface Data535 {
 periodEnd: string;
 // Procedure rows keyed by item id
 rows: Record<string, ProcedureRow>;
 // Appendix A — SCOTABDs
 scotabds: ScotabdRow[];
 // Evaluation
 newRisksIdentified: string;
 controlsIdentified: string;
 deficienciesComm: string;
 // Conclusion
 conclusion: YN;
 conclusionNotes: string;
 // Notes
 notes: string;
 // Conclusion lock
 concluded: boolean; concludedOn: string;
}

interface ProcItem {
 id: string;
 num: string;
 title: string;
 intro?: string;
 items?: string[];
 note?: string;
}

const PART_A: ProcItem[] = [
 { id: 'a1', num: '1', title: 'Financial reporting process', intro: 'Document the financial reporting process used to prepare the entity’s F/S in accordance with the applicable financial reporting framework. Consider:', items: [
 'Where the information is obtained from (general ledger, service providers, subsidiary ledgers, etc.).',
 'The personnel involved (management, others within the entity, TCWG) and their roles.',
 ], note: 'Fraudulent financial reporting often involves management override of controls. (Risk Register) and (Use of Journal Entries) as a response to this risk.' },
 { id: 'a2', num: '2', title: 'F/S closing process', intro: 'Document the F/S closing process. Consider:', items: [
 'The use of journal entries (including automated entries) for corrections and accruals.',
 'Procedures performed, such as reconciliations and reports.',
 'The process around collecting information for the preparation of the F/S.',
 ]},
 { id: 'a3', num: '3', title: 'Consolidation process', intro: 'Document the consolidation process, if applicable. Consider:', items: [
 'The financial reporting framework used, including accounting policies.',
 'The use of spreadsheets and controls in place to prevent misstatements and errors.',
 'The adjustments required for the consolidation.',
 ]},
 { id: 'a4', num: '4', title: 'Non-routine events and conditions', intro: 'Document the process used to capture events and conditions outside the normal course of business (e.g., contingent liabilities, going-concern events, subsequent events).' },
 { id: 'a5', num: '5', title: 'Preparing disclosures', intro: 'Document the process around preparing disclosures to the F/S. Consider:', items: [
 'The personnel involved.',
 'How the information is captured and its accuracy.',
 'Use of experts, specialists or checklists.',
 ]},
];

const PART_B: ProcItem[] = [
 { id: 'b6', num: '6', title: 'Nature of journal entries', intro: 'Obtain an understanding of the nature of journal entries (manual and/or automated) used in the financial reporting process. Address:', items: [
 'Standard entries (sales, receipts, expenditures, purchases).',
 'Non-standard entries (F/S closing, consolidation, business combinations).',
 'Management-requested entries (corrections and adjustments).',
 ], note: 'An understanding of journal entries may instead be obtained in Part C when documenting information flow for SCOTABDs.' },
 { id: 'b7', num: '7', title: 'Journal entry process', intro: 'For each major type of journal entry identified in Step 6, document the process (including automated processes) for how journal entries are initiated, authorized, recorded, approved and reported.' },
 { id: 'b8', num: '8', title: 'History of unauthorized entries', intro: 'If there is any history of unauthorized, inappropriate or fictitious journal entries, determine its impact on further audit procedures, including the response to risk of management override.' },
];

const PART_C: ProcItem[] = [
 { id: 'c9', num: '9', title: 'Information flow for SCOTABDs', intro: 'For each significant class of transaction, account balance and disclosure (or business cycle), document how information flows through the entity’s information system, including:', items: [
 'How transactions are initiated, recorded, processed, corrected, incorporated into the general ledger and reported.',
 'How information about events and conditions other than transactions is captured, processed and disclosed.',
 'Resources (financial, human, intellectual, technological) and IT applications used.',
 'Accounting records, specific accounts in the F/S, and other supporting documents.',
 ], note: 'Use the SCOTABD table below (Appendix A) to document and evaluate each business process.' },
];

const PART_D: ProcItem[] = [
 { id: 'd10', num: '10', title: 'Communication of significant matters', intro: 'Obtain an understanding of how management communicates significant matters that support the preparation of the F/S:', items: [
 'Between people within the entity.',
 'Between management and TCWG.',
 'With external parties (banks, regulatory authorities).',
 ]},
 { id: 'd11', num: '11', title: 'Communication of reporting responsibilities', intro: 'Obtain an understanding of how management communicates reporting responsibilities within the information system and other components of internal control:', items: [
 'Between people within the entity.',
 'Between management and TCWG.',
 'With external parties.',
 ]},
];

const PART_E: ProcItem[] = [
 { id: 'e12', num: '12', title: 'Reassess identified risks', intro: 'Based on the understanding obtained, consider:', items: [
 'Whether the risks identified and assessed are still appropriate.',
 'Whether any new risks were identified.',
 ]},
 { id: 'e13', num: '13', title: 'Identify controls to test', intro: 'Document controls identified that address risks of material misstatement at the assertion level (D&I) that meet the following criteria:', items: [
 'Controls that address significant risks.',
 'Controls over journal entries.',
 'Controls that address assertion-level risks for which substantive procedures alone do not provide sufficient and appropriate audit evidence.',
 ]},
 { id: 'e14', num: '14', title: 'Other controls to test', intro: 'Document any other controls that the auditor chooses to test. Consider:', items: [
 'Where a controls-test strategy is more efficient than tests of details.',
 'Controls that address higher inherent risk but are not significant risks.',
 ]},
 { id: 'e15', num: '15', title: 'Communicate deficiencies', intro: 'Where significant control deficiencies have been identified, ensure they are communicated in writing to TCWG on a timely basis.' },
];

const ALL_PARTS: { title: string; items: ProcItem[] }[] = [
 { title: 'Part A — Understanding the financial reporting process', items: PART_A },
 { title: 'Part B — Understanding journal entries', items: PART_B },
 { title: 'Part C — Documenting and evaluating information flow', items: PART_C },
 { title: 'Part D — Understanding management communications', items: PART_D },
 { title: 'Part E — Evaluation of risks identified', items: PART_E },
];

const ALL_ITEMS = ALL_PARTS.flatMap(p => p.items);

function uid(): string { return Math.random().toString(36).slice(2, 9); }
function emptyRow(): ProcedureRow { return { psc: '', initials: '', comments: '', wpRef: [] }; }
function emptyScotabd(): ScotabdRow { return { id: uid(), cycle: '', understandingObtained: '', itApps: '', processDescription: '', nonTransactionEvents: '', supportsFs: '', deficiencyNote: '' }; }

function buildDefault(): Data535 {
 const rows: Record<string, ProcedureRow> = {};
 ALL_ITEMS.forEach(i => { rows[i.id] = emptyRow(); });
 return {
 periodEnd: '',
 rows,
 scotabds: [emptyScotabd()],
 newRisksIdentified: '',
 controlsIdentified: '',
 deficienciesComm: '',
 conclusion: '',
 conclusionNotes: '',
 notes: '',
 concluded: false, concludedOn: '',
 };
}

export function Audit535Worksheet() {
 const { engagementId } = useParams<{ engagementId: string }>();
 const storageKey = `audit-535-data-${engagementId ?? 'default'}`;
 const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 const isFirstRender = useRef(true);

 const [data, setData] = useState<Data535>(() => {
 const saved = readJsonFromLocalStorage<Data535 | null>(storageKey, null);
 if (!saved) return buildDefault();
 const def = buildDefault();
 return {
...def,
...saved,
 rows: {...def.rows,...(saved.rows ?? {}) },
 scotabds: saved.scotabds?.length ? saved.scotabds : def.scotabds,
 };
 });

 useEffect(() => {
 if (isFirstRender.current) { isFirstRender.current = false; return; }
 if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
 saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
 }, [data, storageKey]);

 const locked = data.concluded;

 function setRow(id: string, patch: Partial<ProcedureRow>) {
 setData(d => ({...d, rows: {...d.rows, [id]: {...d.rows[id],...patch } } }));
 }
 function setScotabd(idx: number, patch: Partial<ScotabdRow>) {
 setData(d => { const list = [...d.scotabds]; list[idx] = {...list[idx],...patch }; return {...d, scotabds: list }; });
 }
 function addScotabd() { setData(d => ({...d, scotabds: [...d.scotabds, emptyScotabd()] })); }
 function removeScotabd(idx: number) {
 setData(d => ({...d, scotabds: d.scotabds.length > 1 ? d.scotabds.filter((_, i) => i !== idx) : d.scotabds }));
 }

 const renderPart = (title: string, items: ProcItem[]) => (
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border">
 <span className="text-sm font-semibold text-foreground">{title}</span>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="sticky top-0 z-10">
 <tr className="bg-muted border-b border-border">
 <th className="w-10 px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider">#</th>
 <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider" style={{ width: '38%', minWidth: 320 }}>Procedure</th>
 <th className="px-3 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" style={{ width: 90 }}>PSC?</th>
 <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider" style={{ width: '44%', minWidth: 320 }}>Comments</th>
 <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" style={{ width: 100 }}>W/P ref.</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {items.map(item => {
 const row = data.rows[item.id] ?? emptyRow();
 return (
 <tr key={item.id} className="hover:bg-muted/50 transition-colors align-top">
 <td className="px-4 py-3 text-center text-xs font-semibold font-mono text-foreground">{item.num}</td>
 <td className="px-6 py-3 text-sm text-foreground">
 <div className="font-semibold">{item.title}</div>
 {item.intro && <div className="mt-1 text-xs text-muted-foreground">{item.intro}</div>}
 {item.items && item.items.length > 0 && (
 <ul className="mt-1.5 space-y-0.5 list-disc list-inside">
 {item.items.map((sub, i) => <li key={i} className="text-xs text-muted-foreground">{sub}</li>)}
 </ul>
 )}
 {item.note && (
 <div className="mt-2 px-2.5 py-1.5 rounded-md bg-primary/5 border border-primary/10 text-[11px] text-foreground/80">
 <span className="font-semibold text-primary">Note: </span>{item.note}
 </div>
 )}
 </td>
 <td className="px-3 py-3 text-center">
 <Select disabled={locked} value={row.psc} onValueChange={v => setRow(item.id, { psc: v as YN })}>
 <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
 <SelectContent>
 <SelectItem value="Y" className="text-xs">Y</SelectItem>
 <SelectItem value="N" className="text-xs">N</SelectItem>
 <SelectItem value="NA" className="text-xs">N/A</SelectItem>
 </SelectContent>
 </Select>
 </td>
 <td className="px-6 py-3">
 <Textarea disabled={locked} value={row.comments} onChange={e => setRow(item.id, { comments: e.target.value })} placeholder="Document procedure performed and findings…" className="min-h-[72px] w-full text-sm resize-none rounded-[10px] border border-input bg-white px-3 py-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
 </td>
 <td className="px-4 py-3 text-center">
 <RefButton
 reference={row.wpRef}
 onAttach={doc => setRow(item.id, { wpRef: [...row.wpRef, doc] })}
 onRemove={i => setRow(item.id, { wpRef: row.wpRef.filter((_, idx) => idx !== i) })}
 />
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 );

 return (
 <div className="flex flex-col h-full">
 {/* Objective banner */}
 <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-3 shrink-0">
 <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
 <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
 <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
 To obtain an understanding of the entity’s information system and communication relevant to the preparation of the financial statements through performing risk assessment procedures.
 <span className="block mt-1.5 text-[11px]">
 <span className="font-semibold text-foreground">Legend: </span>
 PSC = Procedure successfully completed.&nbsp;&nbsp;F/S = Financial statements.&nbsp;&nbsp;SCOTABD = Significant class of transactions, account balances and disclosures.
 </span>
 </p>
 </div>

 <div className="flex-1 overflow-y-auto p-6 space-y-5">

 {/* Procedure parts */}
 {ALL_PARTS.map(part => (
 <div key={part.title}>{renderPart(part.title, part.items)}</div>
 ))}

 {/* Appendix A — SCOTABDs */}
 <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border flex items-center justify-between">
 <div>
 <span className="text-sm font-semibold text-foreground">Appendix A — Business process documentation (SCOTABDs)</span>
 <p className="text-[11px] text-muted-foreground mt-0.5">Document and evaluate each significant business process. Add a row per cycle.</p>
 </div>
 {!locked && (
 <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={addScotabd}>
 <Plus className="h-3.5 w-3.5" /> Add cycle
 </Button>
 )}
 </div>

 <div className="divide-y divide-border">
 {data.scotabds.map((s, idx) => (
 <div key={s.id} className="p-5 space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-xs font-semibold text-foreground">Cycle #{idx + 1}</span>
 {!locked && data.scotabds.length > 1 && (
 <button onClick={() => removeScotabd(idx)} className="text-muted-foreground hover:text-destructive">
 <Trash2 className="h-3.5 w-3.5" />
 </button>
 )}
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div className="space-y-1">
 <label className="text-xs font-medium text-muted-foreground">Business cycle / SCOTABD</label>
 <Input disabled={locked} value={s.cycle} onChange={e => setScotabd(idx, { cycle: e.target.value })} placeholder="e.g., Revenue, receivables and receipts" className="h-8 text-xs" />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-medium text-muted-foreground">IT applications used</label>
 <Input disabled={locked} value={s.itApps} onChange={e => setScotabd(idx, { itApps: e.target.value })} placeholder="e.g., QuickBooks, TruckMate" className="h-8 text-xs" />
 </div>
 </div>

 <div className="space-y-1">
 <label className="text-xs font-medium text-muted-foreground">How was understanding obtained (inquiry, observation, inspection, walkthrough)</label>
 <Textarea disabled={locked} value={s.understandingObtained} onChange={e => setScotabd(idx, { understandingObtained: e.target.value })} placeholder="Inspection of documents: …&#10;Inquiries of: …&#10;Observation of: …&#10;Walkthrough performed: …" className="min-h-[80px] text-xs resize-none rounded-[10px]" />
 </div>

 <div className="space-y-1">
 <label className="text-xs font-medium text-muted-foreground">Business process (flow of information)</label>
 <Textarea disabled={locked} value={s.processDescription} onChange={e => setScotabd(idx, { processDescription: e.target.value })} placeholder="Describe initiation, authorization, recording, processing, correction, posting to GL and reporting in F/S. Reference specific accounts and supporting documents." className="min-h-[110px] text-xs resize-none rounded-[10px]" />
 </div>

 <div className="space-y-1">
 <label className="text-xs font-medium text-muted-foreground">Events and conditions other than transactions</label>
 <Textarea disabled={locked} value={s.nonTransactionEvents} onChange={e => setScotabd(idx, { nonTransactionEvents: e.target.value })} placeholder="How the entity captures, processes and discloses these events." className="min-h-[70px] text-xs resize-none rounded-[10px]" />
 </div>

 <div className="grid grid-cols-3 gap-3">
 <div className="space-y-1">
 <label className="text-xs font-medium text-muted-foreground">Process supports F/S preparation?</label>
 <Select disabled={locked} value={s.supportsFs} onValueChange={v => setScotabd(idx, { supportsFs: v as YN })}>
 <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
 <SelectContent>
 <SelectItem value="Y" className="text-xs">Yes</SelectItem>
 <SelectItem value="N" className="text-xs">No</SelectItem>
 <SelectItem value="NA" className="text-xs">N/A</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="col-span-2 space-y-1">
 <label className="text-xs font-medium text-muted-foreground">If No — significant deficiencies &amp; audit response</label>
 <Input disabled={locked} value={s.deficiencyNote} onChange={e => setScotabd(idx, { deficiencyNote: e.target.value })} placeholder="Describe deficiency and planned response…" className="h-8 text-xs" />
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Evaluation summary */}
 <div className="bg-card border border-border rounded-md p-5 space-y-3">
 <h3 className="text-sm font-semibold text-foreground">Evaluation of risks identified</h3>
 <div className="space-y-1">
 <label className="text-xs font-medium text-muted-foreground">New risks identified ()</label>
 <Textarea disabled={locked} value={data.newRisksIdentified} onChange={e => setData(d => ({...d, newRisksIdentified: e.target.value }))} className="min-h-[70px] text-xs resize-none rounded-[10px]" placeholder="Describe any new RMMs identified during this understanding." />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-medium text-muted-foreground">Controls identified for D&amp;I testing</label>
 <Textarea disabled={locked} value={data.controlsIdentified} onChange={e => setData(d => ({...d, controlsIdentified: e.target.value }))} className="min-h-[70px] text-xs resize-none rounded-[10px]" placeholder="List controls over significant risks, journal entries, and assertion-level risks." />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-medium text-muted-foreground">Significant deficiencies communicated to TCWG</label>
 <Textarea disabled={locked} value={data.deficienciesComm} onChange={e => setData(d => ({...d, deficienciesComm: e.target.value }))} className="min-h-[60px] text-xs resize-none rounded-[10px]" placeholder="Summarize deficiencies and date communicated." />
 </div>
 </div>

 {/* Audit conclusion */}
 <div className="bg-card border border-border rounded-md p-5 space-y-3">
 <h3 className="text-sm font-semibold text-foreground">Audit conclusion</h3>
 <p className="text-xs text-muted-foreground">A sufficient understanding of the entity’s information system and communication process has been obtained to determine if it supports the preparation of the F/S in accordance with the applicable financial reporting framework.</p>
 <div className="grid grid-cols-3 gap-3">
 <div className="space-y-1">
 <label className="text-xs font-medium text-muted-foreground">Conclusion</label>
 <Select disabled={locked} value={data.conclusion} onValueChange={v => setData(d => ({...d, conclusion: v as YN }))}>
 <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
 <SelectContent>
 <SelectItem value="Y" className="text-xs">Yes — sufficient</SelectItem>
 <SelectItem value="N" className="text-xs">No — further work required</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="col-span-2 space-y-1">
 <label className="text-xs font-medium text-muted-foreground">Supporting rationale</label>
 <Input disabled={locked} value={data.conclusionNotes} onChange={e => setData(d => ({...d, conclusionNotes: e.target.value }))} placeholder="Briefly support the conclusion." className="h-8 text-xs" />
 </div>
 </div>
 </div>

 {/* Notes */}
 <div className="bg-card border border-border rounded-md p-5 space-y-2">
 <h3 className="text-sm font-semibold text-foreground">Notes</h3>
 <Textarea disabled={locked} value={data.notes} onChange={e => setData(d => ({...d, notes: e.target.value }))} placeholder="Additional observations, follow-ups, or cross-references…" className="min-h-[90px] text-sm resize-none rounded-[10px]" />
 </div>

 {locked ? (
 <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-xs text-green-800 font-medium">
 Concluded on {data.concludedOn}
 </div>
 ) : (
 <div className="flex justify-end">
 <Button size="sm" onClick={() => { const u = {...data, concluded: true, concludedOn: new Date().toISOString().slice(0, 10) }; setData(u); writeJsonToLocalStorage(storageKey, u); }}>
 Conclude Worksheet
 </Button>
 </div>
 )}
 </div>
 </div>
 );
}
