// Reconstructs the same per-engagement Trial Balance state TrialBalance.tsx shows (base data +
// participant-scoped rows + confirmed grouping/participant overrides + posted AJEs), so the
// Partnership Agreement & Capital worksheet's reconciliation (P9) ties to the SAME numbers the
// TB page and the AJE flow already produce — not a second, independently-fabricated figure.
import {
 baseTrialBalanceData,
 buildParticipantScopedRows,
 computeAdjFromStorage,
 netIncome as baselineNetIncome,
 type TBRow,
} from "@/pages/TrialBalance";
import { loadTBMappingOverrides } from "@/store/tbMappingStore";
import { isParticipantScoped } from "@/lib/tbGroupings";
import type { Participant } from "@/store/participantsStore";

export interface ParticipantTBCapital {
 openingFromTB: number;
 closingFromTB: number;
 // Positive = amount drawn/distributed, from the Drawings / Distributions-mapped TB row(s) only
 // (sign-flipped from the row's own negative/contra-equity balance) — 0 when nothing is mapped.
 drawingsFromTB: number;
 // Same two figures, but from each row's own `py1` (prior-year comparative) column instead of
 // its current-year original/final — the real prior-year opening/drawings this participant's
 // mapped TB rows carry, not an invented comparative.
 openingPy: number;
 drawingsPy: number;
}

function reconstructRows(engagementId: string, entityType: string, participants: Participant[]): TBRow[] {
 const overrides = loadTBMappingOverrides(engagementId);
 const base = [...baseTrialBalanceData, ...buildParticipantScopedRows(entityType, participants)];
 const accAdj = computeAdjFromStorage(engagementId);
 return base.map(row => {
 const override = overrides[row.id];
 const withOverride = override?.confirmed
 ? {
 ...row,
 grouping: override.grouping ?? row.grouping,
 subGrouping: override.subGrouping ?? row.subGrouping,
 participantId: override.participantId ?? row.participantId,
 }
 : row;
 const adj = accAdj[withOverride.accNo] ?? 0;
 return { ...withOverride, adj, final: withOverride.original + adj };
 });
}

/** Per-participant opening/closing capital as currently mapped on the Trial Balance. */
export function getParticipantCapitalFromTB(
 engagementId: string,
 entityType: string,
 participants: Participant[]
): Record<string, ParticipantTBCapital> {
 const rows = reconstructRows(engagementId, entityType, participants);
 const result: Record<string, ParticipantTBCapital> = {};
 participants.forEach(p => {
 const linked = rows.filter(r => r.participantId === p.id && isParticipantScoped(r.subGrouping));
 result[p.id] = {
 // Opening ties to the worksheet's own opening capital — only the capital account itself,
 // not a Drawings/Contributions row, which has no balance until the year's activity is
 // recorded (and shouldn't retroactively change what "opening" means).
 openingFromTB: linked.filter(r => r.subGrouping === "Partners' capital").reduce((s, r) => s + r.original, 0),
 closingFromTB: linked.reduce((s, r) => s + r.final, 0),
 drawingsFromTB: -linked.filter(r => r.subGrouping === "Drawings / Distributions").reduce((s, r) => s + r.final, 0),
 openingPy: linked.filter(r => r.subGrouping === "Partners' capital").reduce((s, r) => s + r.py1, 0),
 drawingsPy: -linked.filter(r => r.subGrouping === "Drawings / Distributions").reduce((s, r) => s + r.py1, 0),
 };
 });
 return result;
}

/** This engagement's net income: the shared demo baseline plus the effect of any of ITS OWN
 * posted adjusting entries on non-asset/liability/equity accounts. A genuinely engagement-
 * specific delta, even though the starting baseline is shared demo data. */
export function getNetIncomeForEngagement(engagementId: string, entityType: string, participants: Participant[]): number {
 const rows = reconstructRows(engagementId, entityType, participants);
 const accAdj = computeAdjFromStorage(engagementId);
 let pretaxDelta = 0;
 Object.entries(accAdj).forEach(([accNo, net]) => {
 const row = rows.find(r => r.accNo === accNo);
 const g = (row?.grouping ?? "").toLowerCase();
 if (!g.includes("asset") && !g.includes("liabilit") && !g.includes("equity")) {
 pretaxDelta += -net;
 }
 });
 return baselineNetIncome.original + pretaxDelta;
}
