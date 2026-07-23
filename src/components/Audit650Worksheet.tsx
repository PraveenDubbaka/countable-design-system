// — Subsequent Events (CAS 560 / AU-C 560)
// Aligned with WorksheetShell design standards (605/625/635/645).
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AttributedComment } from "@/components/ui/AttributedComment";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { loadRisks520, overallRisk520, filterRisks } from "@/lib/audit520Bridge";
import {
 WorksheetLayout, WorksheetSection, LinkedRisksCard, ProcedureTable, ConcludeBar, makeProcRow,
 type ProcRow,
} from "@/components/audit/WorksheetShell";

type YN = "Y" | "N" | "";
type YNNA = YN | "N/A";

type EventCategory = "Adjusting" | "Non-adjusting (disclose)" | "No impact" | "";

interface SubsequentEvent {
 id: string;
 dateIdentified: string;
 description: string;
 source: string; // e.g. minutes, inquiry, bank scan
 category: EventCategory;
 fsImpact: string;
 treatment: string; // adjustment booked / disclosure added / N/A
 wpRef: string;
}

interface Data650 {
 // Dates (CAS 560 — auditor's report cannot be earlier than this)
 fsApprovalDate: string;
 auditorReportDate: string;
 fsIssuedDate: string;

 // Procedure sections
 procReview: ProcRow[];
 procInquiries: ProcRow[];
 procProcedures: ProcRow[];
 procIdentified: ProcRow[];
 procWrittenReps: ProcRow[];
 procDisclosures: ProcRow[];

 // Identified events register
 events: SubsequentEvent[];

 // Post-report-date facts (CAS 560.10-.17)
 newFactsDiscovered: YN;
 newFactsNotes: string;
 fsAmendmentRequired: YN;
 fsAmendmentNotes: string;
 revisedReportIssued: YN;
 revisedReportNotes: string;

 // Disclosures
 disclosuresAdequate: YNNA;
 disclosureNotes: string;

 // Conclusion
 otherProcedures: string;
 evidenceSufficient: YN;
 evidenceRationale: string;

 concluded: boolean;
 concludedOn: string;
}

const dReview = (): ProcRow[] => [
 makeProcRow("Review risk assessments and results of audit procedures already performed for: evidence/indicators of events requiring adjustment or disclosure; procedures to be updated to the audit report date; matters needing additional procedures (subsequent receipts of loans/AR, refinancing, covenant breaches, employee disputes, litigation, contracts, estimates with significant uncertainty)."),
];
const dInquiries = (): ProcRow[] => [
 makeProcRow("Inquire of management and TCWG about subsequent events: management's identification procedures; events requiring disclosure; events from board decisions where minutes are unavailable; status changes on identified events; significant changes in commitments/contingencies; significant changes in assets, share capital, debt or working capital; unusual adjustments in the subsequent period."),
];
const dProcedures = (): ProcRow[] => [
 makeProcRow("a. Review interim F/S, budgets, forecasts or business plans for the subsequent period for indicators of subsequent events."),
 makeProcRow("b. Where interim F/S are not available, scan bank account activity, sales journals, cheque registers, etc."),
 makeProcRow("c. Read meeting minutes of management and TCWG held after the period end for indicators of subsequent events; where minutes are not yet available, inquire about matters discussed."),
 makeProcRow("d. Review new/revised financing or legal agreements and new legal correspondence."),
 makeProcRow("e. Review significant subsequent transactions (asset disposals, business combinations, unusual adjustments)."),
 makeProcRow("f. Search Internet / news media sources for events affecting the entity."),
];
const dIdentified = (): ProcRow[] => [
 makeProcRow("For each potential subsequent event identified: discuss with management (and TCWG where appropriate); evaluate whether adjustment or disclosure is required considering materiality and qualitative factors; where adjustment/disclosure is required, perform procedures over the resulting entries / note disclosure."),
];
const dWrittenReps = (): ProcRow[] => [
 makeProcRow("Obtain written representations that all events occurring subsequent to the period end and for which the AFRF requires adjustment or disclosure have been adjusted or disclosed."),
];
const dDisclosures = (): ProcRow[] => [
 makeProcRow("Review the final F/S and evaluate whether subsequent events are appropriately reflected in accordance with the AFRF."),
 makeProcRow("Where the AFRF allows non-disclosure for competitive or other reasons, document the rationale."),
];

function newEvent(): SubsequentEvent {
 return {
 id: Math.random().toString(36).slice(2, 9),
 dateIdentified: "", description: "", source: "", category: "",
 fsImpact: "", treatment: "", wpRef: "",
 };
}

function buildDefault(): Data650 {
 return {
 fsApprovalDate: "", auditorReportDate: "", fsIssuedDate: "",
 procReview: dReview(), procInquiries: dInquiries(), procProcedures: dProcedures(),
 procIdentified: dIdentified(), procWrittenReps: dWrittenReps(), procDisclosures: dDisclosures(),
 events: [],
 newFactsDiscovered: "", newFactsNotes: "",
 fsAmendmentRequired: "", fsAmendmentNotes: "",
 revisedReportIssued: "", revisedReportNotes: "",
 disclosuresAdequate: "", disclosureNotes: "",
 otherProcedures: "", evidenceSufficient: "", evidenceRationale: "",
 concluded: false, concludedOn: "",
 };
}

function Label({ children }: { children: React.ReactNode }) {
 return <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">{children}</label>;
}
function YNSelect({ value, onChange, withNA = false, locked }: { value: string; onChange: (v: string) => void; withNA?: boolean; locked: boolean }) {
 return (
 <Select disabled={locked} value={value} onValueChange={onChange}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
 <SelectContent>
 <SelectItem value="Y">Yes</SelectItem>
 <SelectItem value="N">No</SelectItem>
 {withNA && <SelectItem value="N/A">N/A</SelectItem>}
 </SelectContent>
 </Select>
 );
}

type SectionKey =
 | "procReview" | "procInquiries" | "procProcedures"
 | "procIdentified" | "procWrittenReps" | "procDisclosures";

const SUBSEQ_KEYWORDS = [
 "subsequent", "going concern", "covenant", "refinanc", "contingen",
 "litigation", "claim", "commitment",
];

export function Audit650Worksheet() {
 const { engagementId } = useParams<{ engagementId: string }>();
 const ctx = useEngagementContext();

 const risks = useMemo(() => loadRisks520(engagementId), [engagementId]);
 const overall = useMemo(() => overallRisk520(risks), [risks]);
 const linked = useMemo(() => filterRisks(risks, SUBSEQ_KEYWORDS), [risks]);

 const storageKey = `audit-650-data-${engagementId ?? "default"}`;
 const [data, setData] = useState<Data650>(() => {
 const def = buildDefault();
 const stored = readJsonFromLocalStorage<Partial<Data650>>(storageKey, def) ?? def;
 const merged = {...def,...stored } as Data650;
 if (!Array.isArray(merged.events)) merged.events = [];
 (["procReview","procInquiries","procProcedures","procIdentified","procWrittenReps","procDisclosures"] as SectionKey[])
.forEach(k => { if (!Array.isArray(merged[k])) (merged as unknown as Record<SectionKey, ProcRow[]>)[k] = (def as unknown as Record<SectionKey, ProcRow[]>)[k]; });
 // Pre-fill auditor report date from engagement period if blank (suggested earliest = day after period end)
 if (!merged.auditorReportDate && ctx.periodEnd) {
 const d = new Date(ctx.periodEnd);
 if (!isNaN(d.getTime())) { d.setDate(d.getDate() + 45); merged.auditorReportDate = d.toISOString().slice(0, 10); }
 }
 return merged;
 });

 const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 const first = useRef(true);
 useEffect(() => {
 if (first.current) { first.current = false; return; }
 if (saveTimer.current) clearTimeout(saveTimer.current);
 saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
 }, [data, storageKey]);

 const locked = data.concluded;

 function updateProcRow(section: SectionKey, rowId: string, field: keyof ProcRow, value: string | RefDoc[]) {
 setData(d => ({...d, [section]: (d[section] as ProcRow[]).map(r => r.id === rowId ? {...r, [field]: value } : r) }));
 }
 const handler = (section: SectionKey) =>
 (_si: number, rowId: string, field: keyof ProcRow, value: string | RefDoc[]) =>
 updateProcRow(section, rowId, field, value);

 const allProcsAddressed = useMemo(() => {
 const all = [
...data.procReview,...data.procInquiries,...data.procProcedures,
...data.procIdentified,...data.procWrittenReps,...data.procDisclosures,
 ];
 return all.length > 0 && all.every(p => p.psc !== "");
 }, [data]);

 // Date integrity warning — auditor's report must be ≥ FS approval
 const dateWarning =
 data.fsApprovalDate && data.auditorReportDate && data.auditorReportDate < data.fsApprovalDate
 ? "Auditor's report date is earlier than the date of F/S approval — the report date must be on or after the F/S approval date."
 : "";

 return (
 <WorksheetLayout
 heading="Canada > Worksheets"
 objective="Obtain evidence about events between the F/S date and the auditor's report date that require adjustment or disclosure, and respond to facts discovered after the auditor's report date."
 standard={`${ctx.standardPrefix} 560`}
 >
 {/* Key dates */}
 <WorksheetSection title="Key dates" right={<span className="text-[11px] text-muted-foreground">Auditor's report ≥ F/S approval date</span>}>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div><Label>Date of F/S approval</Label>
 <Input disabled={locked} type="date" value={data.fsApprovalDate} onChange={e => setData(d => ({...d, fsApprovalDate: e.target.value }))} className="h-8 text-sm" />
 </div>
 <div><Label>Date of auditor's report</Label>
 <Input disabled={locked} type="date" value={data.auditorReportDate} onChange={e => setData(d => ({...d, auditorReportDate: e.target.value }))} className="h-8 text-sm" />
 </div>
 <div><Label>Date F/S issued</Label>
 <Input disabled={locked} type="date" value={data.fsIssuedDate} onChange={e => setData(d => ({...d, fsIssuedDate: e.target.value }))} className="h-8 text-sm" />
 </div>
 </div>
 {dateWarning && (
 <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">{dateWarning}</p>
 )}
 <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
 Period end: <span className="font-medium text-foreground">{ctx.periodEndDisplay}</span>. The auditor's report shall be dated no earlier than the date the auditor obtained sufficient appropriate evidence, including that those with the recognized authority have asserted responsibility for the F/S.
 </p>
 </WorksheetSection>

 <LinkedRisksCard overallRisk={overall} risks={linked}
 emptyHint="No subsequent-event-sensitive risks tagged in (going concern, contingencies, refinancing, litigation, commitments). Tag relevant risks to flow them through."
 storageKey={`audit-650-risks-${engagementId ?? "default"}`} locked={locked} />

 {/* Procedures */}
 <WorksheetSection title="1. Review work performed" bodyClassName="p-0">
 <ProcedureTable showPsa={false} showNumbers={false} sections={[{ title: "Risk assessment & prior procedures", rows: data.procReview }]} locked={locked} onChange={handler("procReview")} />
 </WorksheetSection>
 <WorksheetSection title="2. Management & TCWG inquiries" bodyClassName="p-0">
 <ProcedureTable showPsa={false} showNumbers={false} sections={[{ title: "Inquiries", rows: data.procInquiries }]} locked={locked} onChange={handler("procInquiries")} />
 </WorksheetSection>
 <WorksheetSection title="3. Subsequent event procedures" bodyClassName="p-0">
 <ProcedureTable showPsa={false} showNumbers={false} sections={[{ title: "Procedures to period of auditor's report", rows: data.procProcedures }]} locked={locked} onChange={handler("procProcedures")} />
 </WorksheetSection>
 <WorksheetSection title="4. Evaluation of identified events" bodyClassName="p-0">
 <ProcedureTable showPsa={false} showNumbers={false} sections={[{ title: "Per event evaluation", rows: data.procIdentified }]} locked={locked} onChange={handler("procIdentified")} />
 </WorksheetSection>

 {/* Identified events register */}
 <WorksheetSection
 title="Identified subsequent events register"
 right={<Button size="sm" variant="outline" className="h-7 text-xs" disabled={locked} onClick={() => setData(d => ({...d, events: [...d.events, newEvent()] }))}><Plus className="h-3 w-3 mr-1" /> Add event</Button>}
 bodyClassName="p-0"
 >
 {data.events.length === 0 ? (
 <p className="px-6 py-4 text-xs text-muted-foreground">No subsequent events recorded. Each identified event flows in (representations), (TCWG) and (auditor's report).</p>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-xs border-collapse">
 <thead><tr className="bg-muted/40">
 <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[120px]">Date identified</th>
 <th className="text-left px-3 py-2.5 font-medium border-b border-border">Event / matter</th>
 <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[140px]">Source</th>
 <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[170px]">Category</th>
 <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[180px]">F/S impact</th>
 <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[180px]">Treatment</th>
 <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[90px]">W/P</th>
 <th className="px-3 py-2.5 border-b border-border w-[40px]" />
 </tr></thead>
 <tbody>
 {data.events.map(ev => (
 <tr key={ev.id} className="align-top hover:bg-muted/20">
 <td className="border-b border-border p-2"><Input disabled={locked} type="date" value={ev.dateIdentified} onChange={e => setData(d => ({...d, events: d.events.map(x => x.id === ev.id ? {...x, dateIdentified: e.target.value } : x) }))} className="h-8 text-xs" /></td>
 <td className="border-b border-border p-2"><Textarea disabled={locked} value={ev.description} onChange={e => setData(d => ({...d, events: d.events.map(x => x.id === ev.id ? {...x, description: e.target.value } : x) }))} className="min-h-[44px] text-xs resize-none" placeholder="Nature of event" /></td>
 <td className="border-b border-border p-2"><Input disabled={locked} value={ev.source} onChange={e => setData(d => ({...d, events: d.events.map(x => x.id === ev.id ? {...x, source: e.target.value } : x) }))} className="h-8 text-xs" placeholder="Minutes / inquiry / bank" /></td>
 <td className="border-b border-border p-2">
 <Select disabled={locked} value={ev.category} onValueChange={v => setData(d => ({...d, events: d.events.map(x => x.id === ev.id ? {...x, category: v as EventCategory } : x) }))}>
 <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
 <SelectContent>
 <SelectItem value="Adjusting">Adjusting</SelectItem>
 <SelectItem value="Non-adjusting (disclose)">Non-adjusting (disclose)</SelectItem>
 <SelectItem value="No impact">No impact</SelectItem>
 </SelectContent>
 </Select>
 </td>
 <td className="border-b border-border p-2"><Input disabled={locked} value={ev.fsImpact} onChange={e => setData(d => ({...d, events: d.events.map(x => x.id === ev.id ? {...x, fsImpact: e.target.value } : x) }))} className="h-8 text-xs" placeholder="$ / qualitative" /></td>
 <td className="border-b border-border p-2"><Input disabled={locked} value={ev.treatment} onChange={e => setData(d => ({...d, events: d.events.map(x => x.id === ev.id ? {...x, treatment: e.target.value } : x) }))} className="h-8 text-xs" placeholder="JE booked / Note added" /></td>
 <td className="border-b border-border p-2"><Input disabled={locked} value={ev.wpRef} onChange={e => setData(d => ({...d, events: d.events.map(x => x.id === ev.id ? {...x, wpRef: e.target.value } : x) }))} className="h-8 text-xs" placeholder="—" /></td>
 <td className="border-b border-border p-2 text-center"><Button size="icon" variant="ghost" className="h-7 w-7" disabled={locked} onClick={() => setData(d => ({...d, events: d.events.filter(x => x.id !== ev.id) }))}><Trash2 className="h-3.5 w-3.5 text-muted-foreground" /></Button></td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </WorksheetSection>

 <WorksheetSection title="5. Written representations" bodyClassName="p-0">
 <ProcedureTable showPsa={false} showNumbers={false} sections={[{ title: "Representation coverage", rows: data.procWrittenReps }]} locked={locked} onChange={handler("procWrittenReps")} />
 </WorksheetSection>

 <WorksheetSection title="6. Disclosures" bodyClassName="p-0">
 <ProcedureTable showPsa={false} showNumbers={false} sections={[{ title: "Disclosure review", rows: data.procDisclosures }]} locked={locked} onChange={handler("procDisclosures")} />
 </WorksheetSection>

 {/* Post-report-date facts */}
 <WorksheetSection title="Facts discovered after the auditor's report date">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div><Label>New facts discovered?</Label><YNSelect value={data.newFactsDiscovered} onChange={v => setData(d => ({...d, newFactsDiscovered: v as YN }))} locked={locked} /></div>
 <div><Label>F/S amendment required?</Label><YNSelect value={data.fsAmendmentRequired} onChange={v => setData(d => ({...d, fsAmendmentRequired: v as YN }))} locked={locked} /></div>
 <div><Label>Revised auditor's report issued?</Label><YNSelect value={data.revisedReportIssued} onChange={v => setData(d => ({...d, revisedReportIssued: v as YN }))} locked={locked} /></div>
 {data.newFactsDiscovered === "Y" && (
 <div className="md:col-span-3"><Label>New facts — discussion with management / TCWG</Label>
 <Textarea disabled={locked} value={data.newFactsNotes} onChange={e => setData(d => ({...d, newFactsNotes: e.target.value }))} className="text-sm min-h-[72px]" placeholder="Document the fact, discussions held, and conclusion on whether the F/S require amendment." />
 </div>
 )}
 {data.fsAmendmentRequired === "Y" && (
 <div className="md:col-span-3"><Label>Amendment procedures performed</Label>
 <Textarea disabled={locked} value={data.fsAmendmentNotes} onChange={e => setData(d => ({...d, fsAmendmentNotes: e.target.value }))} className="text-sm min-h-[72px]" placeholder="Audit procedures on the circumstances of the amendment; revised report dating; EOM / OM paragraph if procedures restricted to the amendment." />
 </div>
 )}
 {data.revisedReportIssued === "Y" && (
 <div className="md:col-span-3"><Label>Revised report — dating & references</Label>
 <Textarea disabled={locked} value={data.revisedReportNotes} onChange={e => setData(d => ({...d, revisedReportNotes: e.target.value }))} className="text-sm min-h-[64px]" placeholder="Record the new report date (≥ date of approval of amended F/S) and link" />
 </div>
 )}
 </div>
 </WorksheetSection>

 <WorksheetSection title="Disclosures — overall">
 <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
 <div><Label>Disclosures adequate (AFRF)?</Label><YNSelect value={data.disclosuresAdequate} onChange={v => setData(d => ({...d, disclosuresAdequate: v as YNNA }))} withNA locked={locked} /></div>
 <div><Label>Disclosure notes</Label>
 <Textarea disabled={locked} value={data.disclosureNotes} onChange={e => setData(d => ({...d, disclosureNotes: e.target.value }))} className="text-sm min-h-[72px]" placeholder="Confirm that adjusting / non-adjusting subsequent events are reflected in accordance with the AFRF." />
 </div>
 </div>
 </WorksheetSection>

 <WorksheetSection title="Other procedures (specify)">
 <AttributedComment value={data.otherProcedures} onChange={v => setData(d => ({...d, otherProcedures: v }))} storageKey={`650-${engagementId ?? "def"}-otherProcs`} placeholder="Add any additional procedures performed." disabled={locked} className="text-sm min-h-[72px]" />
 </WorksheetSection>

 <WorksheetSection
 title={`Audit conclusion (${ctx.standardPrefix} 560)`}
 right={allProcsAddressed && data.evidenceSufficient === "" ? (
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">All procedures addressed — ready to conclude</span>
 ) : null}
 >
 <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 items-start">
 <div><Label>Evidence sufficient & appropriate?</Label><YNSelect value={data.evidenceSufficient} onChange={v => setData(d => ({...d, evidenceSufficient: v as YN }))} locked={locked} /></div>
 <div><Label>Rationale</Label>
 <Textarea disabled={locked} value={data.evidenceRationale} onChange={e => setData(d => ({...d, evidenceRationale: e.target.value }))} className="text-sm min-h-[72px]"
 placeholder="The audit evidence obtained over subsequent events is sufficient and appropriate to reduce risk of material misstatement to an acceptably low level." />
 </div>
 </div>
 </WorksheetSection>

 <ConcludeBar
 concluded={data.concluded}
 concludedOn={data.concludedOn}
 onConclude={() => {
 const u = {...data, concluded: true, concludedOn: new Date().toISOString().slice(0, 10) };
 setData(u); writeJsonToLocalStorage(storageKey, u);
 }}
 />
 </WorksheetLayout>
 );
}
