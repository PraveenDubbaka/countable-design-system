// Shared Partners'/Unitholders'/Trust Capital roll-forward and reconciliation math — the
// single source of truth for both the Partnership Agreement & Capital worksheet (P9) and the
// Workbook's Statement of Partners' Capital screen (P10), so the two never drift apart.
import type { Participant } from "@/store/participantsStore";
import { getOverride, type PWWorksheetState } from "@/store/partnershipWorksheetStore";
import { getParticipantCapitalFromTB, getNetIncomeForEngagement } from "@/lib/participantCapitalFromTB";
import { getEntityLabels, type EntityKind } from "@/lib/entityLabels";
import { getEngagementMeta } from "@/store/engagementsStore";

const MS_PER_DAY = 86400000;

/** Net-income allocation weight for one participant, pro-rated by the portion of the fiscal
 * period they actually held their interest — "admitted mid-year" gets a partial year's share,
 * not a full one. Falls back to the raw (un-prorated) weight whenever the engagement has no
 * recorded period (`periodStart`/`periodEnd` in EngagementMeta) or the dates don't parse, so
 * existing engagements/tests created before this behaved exactly as they did before. Opening
 * capital, contributions, drawings and adjustments are real recorded transactions and are never
 * pro-rated — only the ex-post net-income allocation is. */
function proRatedWeight(p: Participant, periodStart: Date | null, periodEnd: Date | null): number {
 const weight = p.ownershipValue || 0;
 if (!periodStart || !periodEnd || periodEnd < periodStart) return weight;
 const totalDays = Math.round((periodEnd.getTime() - periodStart.getTime()) / MS_PER_DAY) + 1;
 if (totalDays <= 0) return weight;
 const admitted = p.admissionDate ? new Date(p.admissionDate) : null;
 const retired = p.retirementDate ? new Date(p.retirementDate) : null;
 const effectiveStart = admitted && admitted > periodStart ? admitted : periodStart;
 const effectiveEnd = retired && retired < periodEnd ? retired : periodEnd;
 if (effectiveEnd < effectiveStart) return 0;
 const heldDays = Math.round((effectiveEnd.getTime() - effectiveStart.getTime()) / MS_PER_DAY) + 1;
 return weight * (heldDays / totalDays);
}

/** Largest-remainder allocation: splits `total` across `weights` (percentages that should sum
 * to ~100) so every participant's share is proportional AND the parts sum exactly back to
 * `total` — no silent penny drift from naive per-participant rounding. */
export function allocateByWeight(total: number, weights: number[]): number[] {
 const sumWeights = weights.reduce((s, w) => s + w, 0);
 if (sumWeights <= 0) return weights.map(() => 0);
 const raw = weights.map(w => (total * w) / sumWeights);
 const floors = raw.map(r => Math.trunc(r * 100) / 100);
 let remainder = Math.round((total - floors.reduce((s, f) => s + f, 0)) * 100);
 const order = raw.map((r, i) => ({ i, frac: r - floors[i] })).sort((a, b) => b.frac - a.frac);
 const result = [...floors];
 for (let k = 0; k < order.length && remainder !== 0; k++) {
 const step = remainder > 0 ? 0.01 : -0.01;
 result[order[k].i] = Math.round((result[order[k].i] + step) * 100) / 100;
 remainder += remainder > 0 ? -1 : 1;
 }
 return result;
}

export interface CapitalRow {
 participant: Participant;
 opening: number;
 contributions: number;
 niAllocated: number;
 drawings: number;
 adjustments: number;
 closing: number;
}

export interface CapitalClassTotal {
 key: string;
 label: string;
 count: number;
 pctTotal: number;
 opening: number;
 contributions: number;
 ni: number;
 drawings: number;
 adjustments: number;
 closing: number;
}

export interface ReconciliationRow {
 label: string;
 worksheetVal: number;
 tbVal: number;
 diff: number;
 agrees: boolean;
}

export interface CapitalStatementData {
 rows: CapitalRow[];
 totals: { opening: number; contributions: number; ni: number; drawings: number; adjustments: number; closing: number };
 classTotals: CapitalClassTotal[];
 reconciliation: ReconciliationRow[];
 pctTotal: number;
 pctOK: boolean;
 recOK: boolean;
 netIncome: number;
 balanceSheetCapital: number;
}

const sumField = <T,>(list: T[], f: (r: T) => number) => list.reduce((s, r) => s + f(r), 0);

export function buildCapitalStatement(
 engagementId: string,
 entityType: EntityKind,
 participants: Participant[],
 worksheet: PWWorksheetState,
 trustVariant: "unit" | "other" = "other",
): CapitalStatementData {
 const labels = getEntityLabels(entityType, trustVariant);
 const netIncome = getNetIncomeForEngagement(engagementId, entityType, participants);
 const tbCapital = getParticipantCapitalFromTB(engagementId, entityType, participants);

 const pctTotal = participants.reduce((s, p) => s + (p.ownershipValue || 0), 0);
 const pctOK = participants.length > 0 && Math.abs(pctTotal - 100) < 0.01;

 // pctTotal/pctOK above check the AGREED allocation percentages sum to 100% — unaffected by who
 // was there for how long this year. Net income itself is allocated by time-weighted ownership.
 const meta = getEngagementMeta(engagementId);
 const periodStart = meta.periodStart ? new Date(meta.periodStart) : null;
 const periodEnd = meta.periodEnd ? new Date(meta.periodEnd) : null;
 const validPeriod = periodStart && periodEnd && !isNaN(periodStart.getTime()) && !isNaN(periodEnd.getTime()) ? { periodStart, periodEnd } : { periodStart: null, periodEnd: null };
 const niAllocations = allocateByWeight(netIncome, participants.map(p => proRatedWeight(p, validPeriod.periodStart, validPeriod.periodEnd)));

 const rows: CapitalRow[] = participants.map((p, idx) => {
 const override = getOverride(worksheet, p.id);
 const opening = p.openingCapital ?? 0;
 const niAllocated = niAllocations[idx] ?? 0;
 const closing = opening + override.contributions + niAllocated + override.adjustments - override.drawings;
 return { participant: p, opening, contributions: override.contributions, niAllocated, drawings: override.drawings, adjustments: override.adjustments, closing };
 });

 const isGeneral = (p: Participant) => p.participantClass === "general";
 const generalRows = rows.filter(r => isGeneral(r.participant));
 const limitedRows = rows.filter(r => !isGeneral(r.participant));

 const classRowTotal = (key: string, label: string, list: CapitalRow[]): CapitalClassTotal => ({
 key, label,
 count: list.length,
 pctTotal: sumField(list, r => r.participant.ownershipValue || 0),
 opening: sumField(list, r => r.opening),
 contributions: sumField(list, r => r.contributions),
 ni: sumField(list, r => r.niAllocated),
 drawings: sumField(list, r => r.drawings),
 adjustments: sumField(list, r => r.adjustments),
 closing: sumField(list, r => r.closing),
 });

 const classTotals: CapitalClassTotal[] = labels.hasClassSplit
 ? [classRowTotal("general", labels.classGeneral, generalRows), classRowTotal("limited", labels.classLimited, limitedRows)].filter(c => c.count > 0)
 : [classRowTotal("all", labels.classGeneral, rows)].filter(c => c.count > 0);

 const totals = {
 opening: sumField(rows, r => r.opening),
 contributions: sumField(rows, r => r.contributions),
 ni: sumField(rows, r => r.niAllocated),
 drawings: sumField(rows, r => r.drawings),
 adjustments: sumField(rows, r => r.adjustments),
 closing: sumField(rows, r => r.closing),
 };

 const tbOpeningFor = (list: CapitalRow[]) =>
 list.reduce((s, r) => s + (tbCapital[r.participant.id]?.openingFromTB ?? 0), 0);
 const balanceSheetCapital = rows.reduce((s, r) => s + (tbCapital[r.participant.id]?.closingFromTB ?? 0), 0);
 const drawingsFromTB = rows.reduce((s, r) => s + (tbCapital[r.participant.id]?.drawingsFromTB ?? 0), 0);

 // Trust/other single-class entities have no "general"/"limited" split — isGeneral is
 // meaningless there (participantClass is "income", never "general"), so generalRows would be
 // empty and silently show a trivial 0-vs-0 "agrees". Group by the same all-vs-split logic
 // classTotals above already uses, instead of raw generalRows/limitedRows, so this line always
 // reflects every participant somewhere.
 const openingGroups = labels.hasClassSplit
 ? [{ label: labels.classGeneral, list: generalRows }, { label: labels.classLimited, list: limitedRows }]
 : [{ label: labels.classGeneral, list: rows }];

 const reconciliation: ReconciliationRow[] = [
 ...openingGroups.map(g => ({
 label: `Opening – ${g.label.toLowerCase()} vs. TB`,
 worksheetVal: sumField(g.list, r => r.opening),
 tbVal: tbOpeningFor(g.list),
 })),
 { label: `${labels.contributions} vs. TB`, worksheetVal: totals.contributions, tbVal: totals.contributions },
 { label: `${labels.drawings} vs. TB`, worksheetVal: totals.drawings, tbVal: drawingsFromTB },
 { label: "Net income allocated vs. Statement of Income (Loss)", worksheetVal: totals.ni, tbVal: netIncome },
 { label: `Closing vs. ${labels.capitalLabel} on Balance Sheet`, worksheetVal: totals.closing, tbVal: balanceSheetCapital },
 ].map(r => ({ ...r, diff: r.worksheetVal - r.tbVal, agrees: Math.abs(r.worksheetVal - r.tbVal) < 0.005 }));

 const recOK = reconciliation.every(r => r.agrees) && pctOK;

 return { rows, totals, classTotals, reconciliation, pctTotal, pctOK, recOK, netIncome, balanceSheetCapital };
}

/** A capital row stripped to name + the roll-forward numbers only — never `taxIdentifier`,
 * `admissionDate`, `retirementDate`, or any other field on `Participant`. Anything that renders a
 * capital statement for an audience outside the firm (the Workbook preview, the Partner package
 * PDF export — P14) should consume this type, not `CapitalRow`/`Participant` directly, so a
 * sensitive field can't leak onto a statement by accident. */
export interface PublicCapitalEntity {
 /** Present for an individual participant's row; omitted for a class/total rollup, which has no
 * single participant to key on. */
 id?: string;
 name: string;
 opening: number;
 contributions: number;
 ni: number;
 drawings: number;
 adjustments: number;
 closing: number;
}

export function toPublicEntities(rows: CapitalRow[]): PublicCapitalEntity[] {
 return rows.map(r => ({
 id: r.participant.id,
 name: r.participant.name || "Unnamed",
 opening: r.opening,
 contributions: r.contributions,
 ni: r.niAllocated,
 drawings: r.drawings,
 adjustments: r.adjustments,
 closing: r.closing,
 }));
}
