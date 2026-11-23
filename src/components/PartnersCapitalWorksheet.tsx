import { useState } from "react";
import { StyledCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loadParticipants } from "@/store/participantsStore";

interface PartnersCapitalWorksheetProps {
 engagementId: string;
 entityType: string;
}

interface RowOverride {
 contributions: number;
 shareOfIncome: number;
 drawings: number;
}

const OVERRIDES_KEY = (engagementId: string) => `cds_pc_worksheet_${engagementId}`;

function loadOverrides(engagementId: string): Record<string, RowOverride> {
 try {
 const raw = localStorage.getItem(OVERRIDES_KEY(engagementId));
 if (raw) return JSON.parse(raw);
 } catch {}
 return {};
}
function saveOverrides(engagementId: string, overrides: Record<string, RowOverride>): void {
 try { localStorage.setItem(OVERRIDES_KEY(engagementId), JSON.stringify(overrides)); } catch {}
}

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

// Partners' Capital worksheet (P6 — a real, navigable centre preview for the new PC node).
// This is a simple opening/contributions/share/drawings/closing roll-forward per participant.
// The allocation methods (fixed %, units, manual), rounding rules and mid-year admission /
// retirement pro-ration described for this worksheet are explicitly later work (P8).
export function PartnersCapitalWorksheet({ engagementId, entityType }: PartnersCapitalWorksheetProps) {
 const participants = loadParticipants(engagementId);
 const [overrides, setOverrides] = useState<Record<string, RowOverride>>(() => loadOverrides(engagementId));
 const nameLabel = entityType === "Trust" ? "Beneficiary" : "Partner";

 const getOverride = (id: string): RowOverride => overrides[id] ?? { contributions: 0, shareOfIncome: 0, drawings: 0 };
 const updateOverride = (id: string, patch: Partial<RowOverride>) => {
 const next = { ...overrides, [id]: { ...getOverride(id), ...patch } };
 setOverrides(next);
 saveOverrides(engagementId, next);
 };

 const closingFor = (participantId: string, opening: number) => {
 const o = getOverride(participantId);
 return opening + o.contributions + o.shareOfIncome - o.drawings;
 };

 const totals = participants.reduce(
 (acc, p) => {
 const o = getOverride(p.id);
 const opening = p.openingCapital ?? 0;
 return {
 opening: acc.opening + opening,
 contributions: acc.contributions + o.contributions,
 shareOfIncome: acc.shareOfIncome + o.shareOfIncome,
 drawings: acc.drawings + o.drawings,
 closing: acc.closing + closingFor(p.id, opening),
 };
 },
 { opening: 0, contributions: 0, shareOfIncome: 0, drawings: 0, closing: 0 }
 );

 return (
 <div className="flex-1 overflow-auto p-6 bg-background">
 <StyledCard className="p-6 flex flex-col gap-4 max-w-5xl">
 <div>
 <h2 className="text-sm font-semibold text-foreground">Partners' Capital</h2>
 <p className="text-xs text-muted-foreground mt-0.5">
 Opening capital, contributions, share of net income and drawings per {nameLabel.toLowerCase()}.
 </p>
 </div>

 {participants.length === 0 ? (
 <p className="text-sm text-muted-foreground py-8 text-center">
 No participants yet — add them on the engagement's Create Engagement screen.
 </p>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-xs">
 <thead>
 <tr className="text-left text-muted-foreground border-b border-border">
 <th className="py-1.5 pr-3 font-medium">{nameLabel}</th>
 <th className="py-1.5 pr-3 font-medium">Class</th>
 <th className="py-1.5 pr-3 font-medium text-right">Opening capital</th>
 <th className="py-1.5 pr-3 font-medium text-right">Contributions</th>
 <th className="py-1.5 pr-3 font-medium text-right">Share of net income</th>
 <th className="py-1.5 pr-3 font-medium text-right">Drawings</th>
 <th className="py-1.5 font-medium text-right">Closing capital</th>
 </tr>
 </thead>
 <tbody>
 {participants.map(p => {
 const opening = p.openingCapital ?? 0;
 const o = getOverride(p.id);
 return (
 <tr key={p.id} className="border-b border-border/50">
 <td className="py-1.5 pr-3">{p.name || "—"}</td>
 <td className="py-1.5 pr-3 capitalize">{p.participantClass || "—"}</td>
 <td className="py-1.5 pr-3 text-right">{fmt(opening)}</td>
 <td className="py-1.5 pr-3">
 <Input type="number" value={o.contributions || ""} onChange={e => updateOverride(p.id, { contributions: Number(e.target.value) || 0 })} className="h-8 w-28 text-xs text-right ml-auto" />
 </td>
 <td className="py-1.5 pr-3">
 <Input type="number" value={o.shareOfIncome || ""} onChange={e => updateOverride(p.id, { shareOfIncome: Number(e.target.value) || 0 })} className="h-8 w-28 text-xs text-right ml-auto" />
 </td>
 <td className="py-1.5 pr-3">
 <Input type="number" value={o.drawings || ""} onChange={e => updateOverride(p.id, { drawings: Number(e.target.value) || 0 })} className="h-8 w-28 text-xs text-right ml-auto" />
 </td>
 <td className="py-1.5 text-right font-medium">{fmt(closingFor(p.id, opening))}</td>
 </tr>
 );
 })}
 <tr className="font-semibold border-t-2 border-border">
 <td className="py-1.5 pr-3">Total</td>
 <td className="py-1.5 pr-3"></td>
 <td className="py-1.5 pr-3 text-right">{fmt(totals.opening)}</td>
 <td className="py-1.5 pr-3 text-right">{fmt(totals.contributions)}</td>
 <td className="py-1.5 pr-3 text-right">{fmt(totals.shareOfIncome)}</td>
 <td className="py-1.5 pr-3 text-right">{fmt(totals.drawings)}</td>
 <td className="py-1.5 text-right">{fmt(totals.closing)}</td>
 </tr>
 </tbody>
 </table>
 </div>
 )}
 </StyledCard>
 </div>
 );
}
