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
 ownershipValue: number; // this year's allocation % (or units)
 priorYearOwnershipValue?: number; // last year's allocation %, for the Partner register's PY/CY/Change columns (P9)
 signingAuthority?: boolean; // can sign the FS/letters on the partnership's behalf (P9 register)
 openingCapital?: number; // first engagement only; carried forward thereafter
 admissionDate?: string | null; // nullable — drives pro-rata
 retirementDate?: string | null; // nullable — drives pro-rata and settlement
 taxIdentifier?: string; // NEVER rendered on a financial statement. Slips only.
 displayOrder: number;
}

const PARTICIPANTS_KEY = (engagementId: string) => `cds_participants_${engagementId}`;

// Committed demo fixtures (doc section 4 item 9 — seed data) for the two Partnership/Trust
// engagements seeded in engagementsStore.ts / clientsData.ts. Willow Creek Partners LLP carries a
// participant admitted mid-year (Priya Nandan, 2024-07-01) and a change in allocation % year over
// year; Birchwood Family Trust is the simpler continuing-beneficiaries case.
const SEED_PARTICIPANTS: Record<string, Participant[]> = {
 "COM-WCP-Dec312023": [
 { id: "WCP-ALEX", engagementId: "COM-WCP-Dec312023", name: "Alex Rivera", participantType: "individual", participantClass: "general", ownershipMode: "percentage", ownershipValue: 60, signingAuthority: true, openingCapital: 180000, admissionDate: null, retirementDate: null, displayOrder: 0 },
 { id: "WCP-MORGAN", engagementId: "COM-WCP-Dec312023", name: "Morgan Hale", participantType: "individual", participantClass: "general", ownershipMode: "percentage", ownershipValue: 40, signingAuthority: true, openingCapital: 120000, admissionDate: null, retirementDate: null, displayOrder: 1 },
 ],
 "COM-WCP-Dec312024": [
 { id: "WCP-ALEX", engagementId: "COM-WCP-Dec312024", name: "Alex Rivera", participantType: "individual", participantClass: "general", ownershipMode: "percentage", ownershipValue: 55, priorYearOwnershipValue: 60, signingAuthority: true, openingCapital: 200000, admissionDate: null, retirementDate: null, displayOrder: 0 },
 { id: "WCP-MORGAN", engagementId: "COM-WCP-Dec312024", name: "Morgan Hale", participantType: "individual", participantClass: "general", ownershipMode: "percentage", ownershipValue: 30, priorYearOwnershipValue: 40, signingAuthority: true, openingCapital: 130000, admissionDate: null, retirementDate: null, displayOrder: 1 },
 { id: "WCP-PRIYA", engagementId: "COM-WCP-Dec312024", name: "Priya Nandan", participantType: "individual", participantClass: "limited", ownershipMode: "percentage", ownershipValue: 15, signingAuthority: false, openingCapital: 0, admissionDate: "2024-07-01", retirementDate: null, displayOrder: 2 },
 ],
 "COM-BFT-Dec312023": [
 { id: "BFT-TAYLOR", engagementId: "COM-BFT-Dec312023", name: "Taylor Novak", participantType: "individual", participantClass: "income", ownershipMode: "percentage", ownershipValue: 60, signingAuthority: true, openingCapital: 150000, admissionDate: null, retirementDate: null, displayOrder: 0 },
 { id: "BFT-JORDAN", engagementId: "COM-BFT-Dec312023", name: "Jordan Singh", participantType: "individual", participantClass: "income", ownershipMode: "percentage", ownershipValue: 40, signingAuthority: false, openingCapital: 100000, admissionDate: null, retirementDate: null, displayOrder: 1 },
 ],
 "COM-BFT-Dec312024": [
 { id: "BFT-TAYLOR", engagementId: "COM-BFT-Dec312024", name: "Taylor Novak", participantType: "individual", participantClass: "income", ownershipMode: "percentage", ownershipValue: 60, priorYearOwnershipValue: 60, signingAuthority: true, openingCapital: 162000, admissionDate: null, retirementDate: null, displayOrder: 0 },
 { id: "BFT-JORDAN", engagementId: "COM-BFT-Dec312024", name: "Jordan Singh", participantType: "individual", participantClass: "income", ownershipMode: "percentage", ownershipValue: 40, priorYearOwnershipValue: 40, signingAuthority: false, openingCapital: 108000, admissionDate: null, retirementDate: null, displayOrder: 1 },
 ],
};

export function loadParticipants(engagementId: string): Participant[] {
 try {
 const raw = localStorage.getItem(PARTICIPANTS_KEY(engagementId));
 if (raw) return JSON.parse(raw);
 } catch {}
 return SEED_PARTICIPANTS[engagementId] ?? [];
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
