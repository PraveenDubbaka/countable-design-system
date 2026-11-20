// Participant data model (P5) — a partner in a partnership, a beneficiary in a trust.
// Stored per engagement, following the same localStorage-backed pattern as engagementsStore.ts.

export type ParticipantType = "individual" | "corporate" | "partnership" | "trust";
export type PartnershipClass = "general" | "limited";
export type TrustClass = "income" | "capital" | "discretionary";
export type OwnershipMode = "percentage" | "units";

export interface Participant {
 id: string;
 engagementId: string;
 name: string; // becomes a column header and a mapping target
 participantType: ParticipantType;
 participantClass?: string; // PartnershipClass | TrustClass — kept loose since the valid set depends on entityType
 ownershipMode: OwnershipMode; // chosen once per engagement
 ownershipValue: number; // e.g. 40.00 (percentage) or 400 (units)
 openingCapital?: number; // first engagement only; carried forward thereafter
 admissionDate?: string | null; // nullable — drives pro-rata
 retirementDate?: string | null; // nullable — drives pro-rata and settlement
 taxIdentifier?: string; // NEVER rendered on a financial statement. Slips only.
 displayOrder: number;
}

const PARTICIPANTS_KEY = (engagementId: string) => `cds_participants_${engagementId}`;

export function loadParticipants(engagementId: string): Participant[] {
 try {
 const raw = localStorage.getItem(PARTICIPANTS_KEY(engagementId));
 if (raw) return JSON.parse(raw);
 } catch {}
 return [];
}

export function saveParticipants(engagementId: string, participants: Participant[]): void {
 try {
 localStorage.setItem(PARTICIPANTS_KEY(engagementId), JSON.stringify(participants));
 } catch {}
}

/** Finds the most recent prior engagement for this client (by name) that has saved
 * participants, for the "Carry from prior engagement" bulk-entry option. */
export function findPriorEngagementParticipants(
 clientEngagementIds: string[],
 currentEngagementId: string
): Participant[] | null {
 for (const id of clientEngagementIds) {
 if (id === currentEngagementId) continue;
 const prior = loadParticipants(id);
 if (prior.length > 0) return prior;
 }
 return null;
}
