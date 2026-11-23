import { useMemo, useState } from "react";
import { AlertTriangle, Check, Plus, RefreshCw } from "lucide-react";
import { StyledCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
 loadParticipants,
 saveParticipants,
 type Participant,
} from "@/store/participantsStore";
import {
 loadPWWorksheet,
 savePWWorksheet,
 getOverride,
 ALLOCATION_BASIS_OPTIONS,
 type PWWorksheetState,
} from "@/store/partnershipWorksheetStore";
import { getEntityLabels, type EntityKind } from "@/lib/entityLabels";
import { buildCapitalStatement } from "@/lib/capitalStatement";

let _pwParticipantUid = 0;
const pwParticipantUid = () => `participant-${Date.now()}-${++_pwParticipantUid}`;

const STALE_KEY = (engagementId: string) => `cds_allocation_stale_${engagementId}`;

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface Props {
 engagementId: string;
 entityType: EntityKind;
 /** Only meaningful when entityType === "Trust" — see entityLabels.ts. */
 trustVariant?: "unit" | "other";
 clientName: string;
}

export function PartnershipAgreementWorksheet({ engagementId, entityType, trustVariant = "other", clientName }: Props) {
 const labels = getEntityLabels(entityType, trustVariant);
 const [participants, setParticipants] = useState<Participant[]>(() => loadParticipants(engagementId));
 const [worksheet, setWorksheet] = useState<PWWorksheetState>(() => loadPWWorksheet(engagementId));
 const [staleDismissed, setStaleDismissed] = useState(false);
 const isStale = !staleDismissed && localStorage.getItem(STALE_KEY(engagementId)) === "true";

 const persistParticipants = (next: Participant[]) => {
 setParticipants(next);
 saveParticipants(engagementId, next);
 };
 const persistWorksheet = (next: PWWorksheetState) => {
 setWorksheet(next);
 savePWWorksheet(engagementId, next);
 };

 const dismissStale = () => {
 localStorage.removeItem(STALE_KEY(engagementId));
 setStaleDismissed(true);
 };

 const capital = useMemo(
 () => buildCapitalStatement(engagementId, entityType, participants, worksheet, trustVariant),
 [engagementId, entityType, participants, worksheet, trustVariant]
 );
 const { rows: capitalRows, totals, reconciliation, pctTotal, pctOK, recOK } = capital;
 const rows = capitalRows.map(r => ({
 participant: r.participant,
 override: { contributions: r.contributions, drawings: r.drawings, adjustments: r.adjustments },
 opening: r.opening,
 niAllocated: r.niAllocated,
 closing: r.closing,
 }));

 const isGeneral = (p: Participant) => p.participantClass === "general";
 const generalRows = rows.filter(r => isGeneral(r.participant));
 const limitedRows = rows.filter(r => !isGeneral(r.participant));

 const sumField = (list: typeof rows, f: (r: typeof rows[number]) => number) => list.reduce((s, r) => s + f(r), 0);

 const updateQuestionnaire = (patch: Partial<PWWorksheetState["questionnaire"]>) =>
 persistWorksheet({ ...worksheet, questionnaire: { ...worksheet.questionnaire, ...patch } });

 const updateParticipant = (id: string, patch: Partial<Participant>) =>
 persistParticipants(participants.map(p => (p.id === id ? { ...p, ...patch } : p)));

 const updateOverride = (id: string, patch: Partial<PWWorksheetState["overridesByParticipantId"][string]>) => {
 const current = getOverride(worksheet, id);
 persistWorksheet({
 ...worksheet,
 overridesByParticipantId: { ...worksheet.overridesByParticipantId, [id]: { ...current, ...patch } },
 });
 };

 const addPartner = () => {
 const next: Participant = {
 id: pwParticipantUid(),
 engagementId,
 name: "",
 participantType: "individual",
 participantClass: "general",
 ownershipMode: "percentage",
 ownershipValue: 0,
 priorYearOwnershipValue: 0,
 signingAuthority: false,
 openingCapital: 0,
 admissionDate: null,
 retirementDate: null,
 taxIdentifier: "",
 displayOrder: participants.length,
 };
 persistParticipants([...participants, next]);
 };

 const pullBalances = () => {
 const reset: PWWorksheetState["overridesByParticipantId"] = {};
 participants.forEach(p => { reset[p.id] = { contributions: 0, drawings: 0, adjustments: 0 }; });
 persistWorksheet({ ...worksheet, overridesByParticipantId: reset });
 };

 const openWorkbook = () => {
 window.open(`${import.meta.env.BASE_URL}engagements/${engagementId}/workbook`, "_blank", "noopener,noreferrer");
 };

 const gpOptions = participants.filter(p => !labels.hasClassSplit || isGeneral(p));

 return (
 <div className="flex-1 overflow-auto p-6 bg-background flex flex-col gap-5">
 {isStale && (
 <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
 <AlertTriangle className="h-4 w-4 shrink-0" />
 <p className="flex-1">An adjusting entry has changed net income since this worksheet was last reconciled — review the allocation below.</p>
 <Button size="sm" variant="secondary" onClick={dismissStale}>Dismiss</Button>
 </div>
 )}

 {worksheet.copiedFromEngagementId && (
 <div className="text-xs text-muted-foreground">Copied from engagement <span className="font-medium text-foreground">{worksheet.copiedFromEngagementId}</span></div>
 )}

 {/* 1. Questionnaire */}
 <StyledCard className="p-5 flex flex-col gap-4">
 <div>
 <h2 className="text-sm font-semibold text-foreground">{labels.worksheetName} questionnaire</h2>
 <p className="text-xs text-muted-foreground mt-0.5">Saved with the worksheet and carried forward.</p>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="flex flex-col gap-1.5">
 <label className="text-xs font-medium text-foreground">1. {labels.whoSigns === "Trustees" ? "Trustee(s)" : "General / managing partner"}</label>
 <Select value={worksheet.questionnaire.generalPartnerId} onValueChange={v => updateQuestionnaire({ generalPartnerId: v })}>
 <SelectTrigger className="h-9"><SelectValue placeholder="Select…" /></SelectTrigger>
 <SelectContent>
 {gpOptions.map(p => <SelectItem key={p.id} value={p.id}>{p.name || "Unnamed"}</SelectItem>)}
 </SelectContent>
 </Select>
 </div>
 <div className="flex flex-col gap-1.5">
 <label className="text-xs font-medium text-foreground">2. Who signs the financial statements and letters?</label>
 <Input value={worksheet.questionnaire.whoSigns} onChange={e => updateQuestionnaire({ whoSigns: e.target.value })} placeholder="Name, title" className="h-9" />
 </div>
 <div className="col-span-2 flex flex-col gap-1.5">
 <label className="text-xs font-medium text-foreground">3. Basis of income and loss allocation</label>
 <Select value={worksheet.questionnaire.basis} onValueChange={v => updateQuestionnaire({ basis: v })}>
 <SelectTrigger className="h-9"><SelectValue placeholder="Select…" /></SelectTrigger>
 <SelectContent>
 {ALLOCATION_BASIS_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
 </SelectContent>
 </Select>
 </div>

 <YesNoRow
 label={`4. Any change in ${labels.holders.toLowerCase()} or allocation % since last year?`}
 value={worksheet.questionnaire.changeSincePriorYear}
 onChange={v => updateQuestionnaire({ changeSincePriorYear: v })}
 />
 {worksheet.questionnaire.changeSincePriorYear && (
 <div className="col-span-2 grid grid-cols-2 gap-3 pl-4">
 <Input value={worksheet.questionnaire.changeDetail} onChange={e => updateQuestionnaire({ changeDetail: e.target.value })} placeholder="Describe the change" className="h-9" />
 <Input type="date" value={worksheet.questionnaire.changeEffectiveDate} onChange={e => updateQuestionnaire({ changeEffectiveDate: e.target.value })} className="h-9" />
 </div>
 )}

 <YesNoRow
 label="5. Priority returns, salaries or interest on capital to partners?"
 value={worksheet.questionnaire.priorityReturns}
 onChange={v => updateQuestionnaire({ priorityReturns: v })}
 />
 {worksheet.questionnaire.priorityReturns && (
 <div className="col-span-2 pl-4">
 <Input value={worksheet.questionnaire.priorityDetail} onChange={e => updateQuestionnaire({ priorityDetail: e.target.value })} placeholder="Describe" className="h-9" />
 </div>
 )}

 <YesNoRow
 label={`6. Are ${labels.drawings.toLowerCase()} limited by the agreement?`}
 value={worksheet.questionnaire.drawingsLimited}
 onChange={v => updateQuestionnaire({ drawingsLimited: v })}
 />
 {worksheet.questionnaire.drawingsLimited && (
 <div className="col-span-2 pl-4">
 <Input value={worksheet.questionnaire.drawingsLimitedDetail} onChange={e => updateQuestionnaire({ drawingsLimitedDetail: e.target.value })} placeholder="Describe" className="h-9" />
 </div>
 )}

 {labels.hasClassSplit && (
 <YesNoRow
 label="7. Can limited partners carry negative capital balances?"
 value={worksheet.questionnaire.negativeCapitalAllowed}
 onChange={v => updateQuestionnaire({ negativeCapitalAllowed: v })}
 />
 )}
 </div>
 </StyledCard>

 {/* 2. Partner register & allocation */}
 <StyledCard className="p-5 flex flex-col gap-4">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-sm font-semibold text-foreground">{labels.holder} register &amp; allocation</h2>
 <p className="text-xs text-muted-foreground mt-0.5">Signing authority and allocation % for this year vs last year.</p>
 </div>
 <Button size="sm" variant="secondary" className="gap-1.5" onClick={addPartner}><Plus className="h-3.5 w-3.5" />Add {labels.holder.toLowerCase()}</Button>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-xs">
 <thead>
 <tr className="text-left text-muted-foreground border-b border-border">
 <th className="py-1.5 pr-3 font-medium">{labels.holder}</th>
 <th className="py-1.5 pr-3 font-medium">Type</th>
 {labels.hasClassSplit && <th className="py-1.5 pr-3 font-medium">Class</th>}
 <th className="py-1.5 pr-3 font-medium text-center">Signing</th>
 <th className="py-1.5 pr-3 font-medium text-right">PY %</th>
 <th className="py-1.5 pr-3 font-medium text-right">{labels.allocationHeader}</th>
 <th className="py-1.5 font-medium text-right">Change</th>
 </tr>
 </thead>
 <tbody>
 {participants.map(p => {
 const py = p.priorYearOwnershipValue ?? p.ownershipValue;
 const change = p.ownershipValue - py;
 return (
 <tr key={p.id} className="border-b border-border/50">
 <td className="py-1.5 pr-3"><Input value={p.name} onChange={e => updateParticipant(p.id, { name: e.target.value })} className="h-8 w-32 text-xs" /></td>
 <td className="py-1.5 pr-3">
 <Select value={p.participantType} onValueChange={v => updateParticipant(p.id, { participantType: v as Participant["participantType"] })}>
 <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
 <SelectContent>
 <SelectItem value="individual">Individual</SelectItem>
 <SelectItem value="corporate">Corporate</SelectItem>
 <SelectItem value="partnership">Partnership</SelectItem>
 <SelectItem value="trust">Trust</SelectItem>
 </SelectContent>
 </Select>
 </td>
 {labels.hasClassSplit && (
 <td className="py-1.5 pr-3">
 <Select value={p.participantClass ?? "general"} onValueChange={v => updateParticipant(p.id, { participantClass: v })}>
 <SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger>
 <SelectContent>
 <SelectItem value="general">General</SelectItem>
 <SelectItem value="limited">Limited</SelectItem>
 </SelectContent>
 </Select>
 </td>
 )}
 <td className="py-1.5 pr-3 text-center">
 <Checkbox checked={!!p.signingAuthority} onCheckedChange={v => updateParticipant(p.id, { signingAuthority: !!v })} />
 </td>
 <td className="py-1.5 pr-3">
 <Input type="number" value={py} onChange={e => updateParticipant(p.id, { priorYearOwnershipValue: Number(e.target.value) || 0 })} className="h-8 w-20 text-xs text-right ml-auto" />
 </td>
 <td className="py-1.5 pr-3">
 <Input type="number" value={p.ownershipValue} onChange={e => updateParticipant(p.id, { ownershipValue: Number(e.target.value) || 0 })} className="h-8 w-20 text-xs text-right ml-auto" />
 </td>
 <td className="py-1.5 text-right">{change === 0 ? "No change" : `${change > 0 ? "+" : ""}${change.toFixed(1)}`}</td>
 </tr>
 );
 })}
 {labels.hasClassSplit && (
 <>
 <tr className="font-medium"><td colSpan={4}>{labels.classGeneral} ({generalRows.length})</td><td /><td className="text-right">{sumField(generalRows, r => r.participant.ownershipValue)}</td><td /></tr>
 <tr className="font-medium"><td colSpan={4}>{labels.classLimited} ({limitedRows.length})</td><td /><td className="text-right">{sumField(limitedRows, r => r.participant.ownershipValue)}</td><td /></tr>
 </>
 )}
 <tr className="font-semibold border-t-2 border-border">
 <td colSpan={labels.hasClassSplit ? 5 : 4}>Total</td>
 <td className="text-right">{pctTotal.toFixed(2)}</td>
 <td className="text-right">
 {pctOK ? (
 <span className="inline-flex items-center gap-1 text-emerald-600"><Check className="h-3.5 w-3.5" />100%</span>
 ) : (
 <span className="text-destructive">{pctTotal.toFixed(2)}%</span>
 )}
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 {!pctOK && <p className="text-xs text-destructive">Allocation percentages must total exactly 100% (currently {pctTotal.toFixed(2)}%).</p>}
 </StyledCard>

 {/* 3. Capital roll-forward */}
 <StyledCard className="p-5 flex flex-col gap-4">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-sm font-semibold text-foreground">Capital roll-forward</h2>
 <p className="text-xs text-muted-foreground mt-0.5">Opening = last year's closing · net income allocated at current-year %.</p>
 </div>
 <Button size="sm" variant="secondary" className="gap-1.5" onClick={pullBalances}><RefreshCw className="h-3.5 w-3.5" />Pull balances</Button>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-xs">
 <thead>
 <tr className="text-left text-muted-foreground border-b border-border">
 <th className="py-1.5 pr-3 font-medium">{labels.holder}</th>
 <th className="py-1.5 pr-3 font-medium text-right">Opening ($)</th>
 <th className="py-1.5 pr-3 font-medium text-right">{labels.contributions} ($)</th>
 <th className="py-1.5 pr-3 font-medium text-right">Net income allocated ($)</th>
 <th className="py-1.5 pr-3 font-medium text-right">{labels.drawings} ($)</th>
 <th className="py-1.5 pr-3 font-medium text-right">Adjustments ($)</th>
 <th className="py-1.5 font-medium text-right">Closing ($)</th>
 </tr>
 </thead>
 <tbody>
 {rows.map(r => (
 <tr key={r.participant.id} className="border-b border-border/50">
 <td className="py-1.5 pr-3">{r.participant.name || "—"}</td>
 <td className="py-1.5 pr-3 text-right bg-muted/30">{fmt(r.opening)}</td>
 <td className="py-1.5 pr-3">
 <Input type="number" value={r.override.contributions || ""} onChange={e => updateOverride(r.participant.id, { contributions: Number(e.target.value) || 0 })} className="h-8 w-24 text-xs text-right ml-auto" />
 </td>
 <td className="py-1.5 pr-3 text-right bg-muted/30">{fmt(r.niAllocated)}</td>
 <td className="py-1.5 pr-3">
 <Input type="number" value={r.override.drawings || ""} onChange={e => updateOverride(r.participant.id, { drawings: Number(e.target.value) || 0 })} className="h-8 w-24 text-xs text-right ml-auto" />
 </td>
 <td className="py-1.5 pr-3">
 <Input type="number" value={r.override.adjustments || ""} onChange={e => updateOverride(r.participant.id, { adjustments: Number(e.target.value) || 0 })} className="h-8 w-24 text-xs text-right ml-auto" />
 </td>
 <td className="py-1.5 text-right font-medium bg-muted/30">{fmt(r.closing)}</td>
 </tr>
 ))}
 <tr className="font-semibold border-t-2 border-border">
 <td className="py-1.5 pr-3">Total</td>
 <td className="py-1.5 pr-3 text-right">{fmt(totals.opening)}</td>
 <td className="py-1.5 pr-3 text-right">{fmt(totals.contributions)}</td>
 <td className="py-1.5 pr-3 text-right">{fmt(totals.ni)}</td>
 <td className="py-1.5 pr-3 text-right">{fmt(totals.drawings)}</td>
 <td className="py-1.5 pr-3 text-right">{fmt(totals.adjustments)}</td>
 <td className="py-1.5 text-right">{fmt(totals.closing)}</td>
 </tr>
 </tbody>
 </table>
 </div>
 <p className="text-[11px] text-muted-foreground">Opening and net income allocated are calculated; Contributions, {labels.drawings} and Adjustments are entered here. Use Adjustments for transfers between {labels.holders.toLowerCase()} or corrections, and explain them in the comments below.</p>
 </StyledCard>

 {/* 4. Reconciliation */}
 <StyledCard className="p-5 flex flex-col gap-4">
 <h2 className="text-sm font-semibold text-foreground">Reconciliation</h2>
 <table className="w-full text-xs">
 <thead>
 <tr className="text-left text-muted-foreground border-b border-border">
 <th className="py-1.5 pr-3 font-medium">&nbsp;</th>
 <th className="py-1.5 pr-3 font-medium text-right">Per worksheet ($)</th>
 <th className="py-1.5 pr-3 font-medium text-right">Per TB / FS ($)</th>
 <th className="py-1.5 font-medium text-right">Difference ($)</th>
 </tr>
 </thead>
 <tbody>
 {reconciliation.map(r => (
 <tr key={r.label} className="border-b border-border/50">
 <td className="py-1.5 pr-3">{r.label}</td>
 <td className="py-1.5 pr-3 text-right">{fmt(r.worksheetVal)}</td>
 <td className="py-1.5 pr-3 text-right">{fmt(r.tbVal)}</td>
 <td className="py-1.5 text-right">
 {r.agrees ? (
 <Badge variant="success" className="gap-1"><Check className="h-3 w-3" />Agrees</Badge>
 ) : (
 <Badge variant="destructive">{fmt(r.diff)}</Badge>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 <p className="text-[11px] text-muted-foreground">
 Contributions and {labels.drawings.toLowerCase()} reconcile to the worksheet itself in this release — this demo chart of
 accounts has no separate posted accounts for them yet, so there is nothing independent to tie to.
 </p>
 </StyledCard>

 {/* Comments */}
 <StyledCard className="p-5 flex flex-col gap-2">
 <h2 className="text-sm font-semibold text-foreground">Comments</h2>
 <Textarea
 value={worksheet.comments}
 onChange={e => persistWorksheet({ ...worksheet, comments: e.target.value })}
 placeholder="Add comments…"
 className="min-h-[80px]"
 />
 </StyledCard>

 {/* Footer actions */}
 <div className="flex items-center justify-between pb-4">
 <div className="flex items-center gap-2">
 {worksheet.concluded ? (
 <>
 <Badge variant="success" className="gap-1"><Check className="h-3 w-3" />Concluded</Badge>
 <Button size="sm" variant="secondary" onClick={() => persistWorksheet({ ...worksheet, concluded: false })}>Reopen</Button>
 </>
 ) : (
 <Button
 size="sm"
 disabled={!recOK}
 onClick={() => persistWorksheet({ ...worksheet, concluded: true })}
 title={!recOK ? "Allocation must total 100% and every reconciliation row must agree" : undefined}
 >
 Conclude
 </Button>
 )}
 </div>
 <Button size="sm" variant="outline" onClick={openWorkbook}>View {labels.statementTitle} in Workbook</Button>
 </div>
 </div>
 );
}

function YesNoRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
 return (
 <div className="col-span-2 flex items-center justify-between gap-4">
 <label className="text-xs font-medium text-foreground">{label}</label>
 <div className="flex gap-1.5 shrink-0">
 <Button size="sm" variant={value ? "default" : "secondary"} onClick={() => onChange(true)} className="h-7 px-3 text-xs">Yes</Button>
 <Button size="sm" variant={!value ? "default" : "secondary"} onClick={() => onChange(false)} className="h-7 px-3 text-xs">No</Button>
 </div>
 </div>
 );
}
