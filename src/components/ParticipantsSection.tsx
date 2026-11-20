import { useState } from "react";
import { Plus, Trash2, ClipboardPaste, History } from "lucide-react";
import { StyledCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateField } from "@/components/DateField";
import type { Participant, ParticipantType, OwnershipMode } from "@/store/participantsStore";

let _participantUid = 0;
const participantUid = () => `participant-${Date.now()}-${++_participantUid}`;

const PARTICIPANT_TYPE_OPTIONS: { value: ParticipantType; label: string }[] = [
 { value: "individual", label: "Individual" },
 { value: "corporate", label: "Corporate" },
 { value: "partnership", label: "Partnership" },
 { value: "trust", label: "Trust" },
];

function classOptions(entityType: string): { value: string; label: string }[] {
 return entityType === "Trust"
 ? [
 { value: "income", label: "Income" },
 { value: "capital", label: "Capital" },
 { value: "discretionary", label: "Discretionary" },
 ]
 : [
 { value: "general", label: "General" },
 { value: "limited", label: "Limited" },
 ];
}

function newParticipant(engagementId: string, displayOrder: number, ownershipMode: OwnershipMode): Participant {
 return {
 id: participantUid(),
 engagementId,
 name: "",
 participantType: "individual",
 participantClass: undefined,
 ownershipMode,
 ownershipValue: 0,
 openingCapital: undefined,
 admissionDate: null,
 retirementDate: null,
 taxIdentifier: "",
 displayOrder,
 };
}

function toMMDDYYYY(iso: string | null | undefined): string {
 if (!iso) return "";
 const d = new Date(iso);
 if (isNaN(d.getTime())) return "";
 return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
}
function fromMMDDYYYY(value: string): string | null {
 const m = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
 if (!m) return null;
 return new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2])).toISOString();
}

export interface ParticipantsValidation {
 errors: string[];
 warnings: string[];
}

export function validateParticipants(
 participants: Participant[],
 ownershipMode: OwnershipMode,
 entityType: string,
): ParticipantsValidation {
 const errors: string[] = [];
 const warnings: string[] = [];

 if (participants.length === 0) {
 errors.push("At least one participant is required.");
 return { errors, warnings };
 }

 if (ownershipMode === "percentage") {
 const total = participants.reduce((sum, p) => sum + (p.ownershipValue || 0), 0);
 if (Math.abs(total - 100) > 0.005) {
 errors.push(`Ownership percentages must total exactly 100% (currently ${total.toFixed(2)}%).`);
 }
 } else {
 if (participants.some(p => !p.ownershipValue || p.ownershipValue <= 0)) {
 errors.push("Every participant needs a units value greater than zero.");
 }
 }

 for (const p of participants) {
 if (p.admissionDate && p.retirementDate && new Date(p.retirementDate) <= new Date(p.admissionDate)) {
 errors.push(`${p.name || "A participant"}'s retirement date must be after their admission date.`);
 }
 }

 const names = participants.map(p => p.name.trim().toLowerCase()).filter(Boolean);
 const dupes = names.filter((n, i) => names.indexOf(n) !== i);
 if (dupes.length > 0) {
 warnings.push("Duplicate participant names found.");
 }

 if (entityType === "Partnership") {
 if (participants.some(p => p.participantClass === "limited" && (p.openingCapital ?? 0) < 0)) {
 warnings.push("A limited partner has a negative opening capital.");
 }
 }

 return { errors, warnings };
}

interface ParticipantsSectionProps {
 entityType: string; // "Partnership" | "Trust"
 engagementId: string;
 participants: Participant[];
 onChange: (participants: Participant[]) => void;
 ownershipMode: OwnershipMode;
 onOwnershipModeChange: (mode: OwnershipMode) => void;
 capitalPresentation: "itemised" | "totalOnly";
 onCapitalPresentationChange: (value: "itemised" | "totalOnly") => void;
 capitalVisibility: "open" | "restricted" | "partnerOnly";
 onCapitalVisibilityChange: (value: "open" | "restricted" | "partnerOnly") => void;
 priorParticipants?: Participant[] | null;
}

export function ParticipantsSection({
 entityType,
 engagementId,
 participants,
 onChange,
 ownershipMode,
 onOwnershipModeChange,
 capitalPresentation,
 onCapitalPresentationChange,
 capitalVisibility,
 onCapitalVisibilityChange,
 priorParticipants,
}: ParticipantsSectionProps) {
 const [pasteOpen, setPasteOpen] = useState(false);
 const [pasteText, setPasteText] = useState("");
 const ownershipUnitLabel = ownershipMode === "percentage" ? "%" : "units";
 const classLabel = entityType === "Trust" ? "Beneficiary class" : "Partner class";
 const nameLabel = entityType === "Trust" ? "Beneficiary" : "Partner";

 const updateRow = (id: string, patch: Partial<Participant>) => {
 onChange(participants.map(p => (p.id === id ? { ...p, ...patch } : p)));
 };
 const removeRow = (id: string) => {
 onChange(participants.filter(p => p.id !== id));
 };
 const addRow = () => {
 onChange([...participants, newParticipant(engagementId, participants.length, ownershipMode)]);
 };
 const carryForward = () => {
 if (!priorParticipants) return;
 onChange(priorParticipants.map((p, i) => ({
 ...p,
 id: participantUid(),
 engagementId,
 openingCapital: undefined, // first-engagement-only field; a real carried-forward closing balance isn't computed yet
 displayOrder: i,
 })));
 };
 const applyPaste = () => {
 const rows = pasteText.split("\n").map(line => line.trim()).filter(Boolean);
 const parsed = rows.map((row, i) => {
 const cells = row.split(/\t|,/).map(c => c.trim());
 const [name = "", type = "individual", cls = "", ownership = "0"] = cells;
 const participant = newParticipant(engagementId, participants.length + i, ownershipMode);
 participant.name = name;
 participant.participantType = (PARTICIPANT_TYPE_OPTIONS.find(o => o.label.toLowerCase() === type.toLowerCase())?.value ?? "individual") as ParticipantType;
 participant.participantClass = classOptions(entityType).find(o => o.label.toLowerCase() === cls.toLowerCase())?.value;
 participant.ownershipValue = Number(ownership.replace(/[^0-9.-]/g, "")) || 0;
 return participant;
 });
 onChange([...participants, ...parsed]);
 setPasteText("");
 setPasteOpen(false);
 };

 const { errors, warnings } = validateParticipants(participants, ownershipMode, entityType);

 return (
 <StyledCard className="p-6 flex flex-col gap-4">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="text-sm font-semibold text-foreground">Participants</h3>
 <p className="text-xs text-muted-foreground mt-0.5">
 {entityType === "Trust" ? "Beneficiaries of the trust." : "Partners in the partnership."}
 </p>
 </div>
 <div className="flex items-center gap-2">
 {priorParticipants && priorParticipants.length > 0 && participants.length === 0 && (
 <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={carryForward}>
 <History className="h-3.5 w-3.5" />
 Carry from prior engagement
 </Button>
 )}
 <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setPasteOpen(v => !v)}>
 <ClipboardPaste className="h-3.5 w-3.5" />
 Paste from spreadsheet
 </Button>
 <Button type="button" size="sm" className="h-8 gap-1.5 text-xs" onClick={addRow}>
 <Plus className="h-3.5 w-3.5" />
 Add {nameLabel}
 </Button>
 </div>
 </div>

 {pasteOpen && (
 <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-muted/30">
 <p className="text-xs text-muted-foreground">
 One {nameLabel.toLowerCase()} per line — Name, Type, Class, Ownership (tab or comma separated).
 </p>
 <Textarea
 value={pasteText}
 onChange={e => setPasteText(e.target.value)}
 placeholder={`Jane Smith, Individual, General, 60\nJohn Doe, Individual, Limited, 40`}
 className="text-xs font-mono min-h-20"
 />
 <div className="flex justify-end gap-2">
 <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => setPasteOpen(false)}>Cancel</Button>
 <Button type="button" size="sm" className="h-7 text-xs" onClick={applyPaste} disabled={!pasteText.trim()}>Add rows</Button>
 </div>
 </div>
 )}

 <div className="flex items-center gap-6">
 <div className="flex items-center gap-2">
 <span className="text-xs font-medium text-foreground">Ownership mode</span>
 <Select value={ownershipMode} onValueChange={v => onOwnershipModeChange(v as OwnershipMode)}>
 <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
 <SelectContent>
 <SelectItem value="percentage">Percentage</SelectItem>
 <SelectItem value="units">Units</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="flex items-center gap-2">
 <span className="text-xs font-medium text-foreground">Capital presentation</span>
 <Select value={capitalPresentation} onValueChange={v => onCapitalPresentationChange(v as "itemised" | "totalOnly")}>
 <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
 <SelectContent>
 <SelectItem value="totalOnly">Total only</SelectItem>
 <SelectItem value="itemised">Itemised</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="flex items-center gap-2">
 <span className="text-xs font-medium text-foreground">Capital visibility</span>
 <Select value={capitalVisibility} onValueChange={v => onCapitalVisibilityChange(v as "open" | "restricted" | "partnerOnly")}>
 <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
 <SelectContent>
 <SelectItem value="open">Open</SelectItem>
 <SelectItem value="restricted">Restricted</SelectItem>
 <SelectItem value="partnerOnly">Partner-only</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>

 {participants.length > 0 && (
 <div className="overflow-x-auto">
 <table className="w-full text-xs">
 <thead>
 <tr className="text-left text-muted-foreground border-b border-border">
 <th className="py-1.5 pr-2 font-medium">Name</th>
 <th className="py-1.5 pr-2 font-medium">Type</th>
 <th className="py-1.5 pr-2 font-medium">{classLabel}</th>
 <th className="py-1.5 pr-2 font-medium">Ownership ({ownershipUnitLabel})</th>
 <th className="py-1.5 pr-2 font-medium">Opening capital</th>
 <th className="py-1.5 pr-2 font-medium">Admission date</th>
 <th className="py-1.5 pr-2 font-medium">Retirement date</th>
 <th className="py-1.5"></th>
 </tr>
 </thead>
 <tbody>
 {participants.map(p => (
 <tr key={p.id} className="border-b border-border/50">
 <td className="py-1.5 pr-2">
 <Input value={p.name} onChange={e => updateRow(p.id, { name: e.target.value })} className="h-8 text-xs" placeholder="Name" />
 </td>
 <td className="py-1.5 pr-2">
 <Select value={p.participantType} onValueChange={v => updateRow(p.id, { participantType: v as ParticipantType })}>
 <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
 <SelectContent>
 {PARTICIPANT_TYPE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>)}
 </SelectContent>
 </Select>
 </td>
 <td className="py-1.5 pr-2">
 <Select value={p.participantClass ?? ""} onValueChange={v => updateRow(p.id, { participantClass: v })}>
 <SelectTrigger className="h-8 w-28 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
 <SelectContent>
 {classOptions(entityType).map(o => <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>)}
 </SelectContent>
 </Select>
 </td>
 <td className="py-1.5 pr-2">
 <Input
 type="number"
 value={p.ownershipValue || ""}
 onChange={e => updateRow(p.id, { ownershipValue: Number(e.target.value) })}
 className="h-8 w-20 text-xs"
 />
 </td>
 <td className="py-1.5 pr-2">
 <Input
 type="number"
 value={p.openingCapital ?? ""}
 onChange={e => updateRow(p.id, { openingCapital: e.target.value === "" ? undefined : Number(e.target.value) })}
 className="h-8 w-24 text-xs"
 />
 </td>
 <td className="py-1.5 pr-2 w-36">
 <DateField value={toMMDDYYYY(p.admissionDate)} onChange={v => updateRow(p.id, { admissionDate: fromMMDDYYYY(v) })} />
 </td>
 <td className="py-1.5 pr-2 w-36">
 <DateField value={toMMDDYYYY(p.retirementDate)} onChange={v => updateRow(p.id, { retirementDate: fromMMDDYYYY(v) })} />
 </td>
 <td className="py-1.5">
 <button type="button" onClick={() => removeRow(p.id)} className="p-1 hover:bg-destructive/10 rounded text-destructive">
 <Trash2 className="h-3.5 w-3.5" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}

 {(errors.length > 0 || warnings.length > 0) && (
 <div className="flex flex-col gap-1">
 {errors.map((e, i) => (
 <p key={`err-${i}`} className="text-xs text-destructive">{e}</p>
 ))}
 {warnings.map((w, i) => (
 <p key={`warn-${i}`} className="text-xs text-amber-600 dark:text-amber-500">{w}</p>
 ))}
 </div>
 )}
 </StyledCard>
 );
}
