// Partnership Agreement & Capital worksheet state (P9) — the questionnaire, roll-forward
// adjustments, reconciliation comments, and conclude/reopen status. Partner register data
// itself lives in participantsStore.ts (shared with the TB Participant column and the
// Partners' Capital preview); this store holds only what's specific to the worksheet.
export interface PWQuestionnaire {
 generalPartnerId: string; // participant id of the general/managing partner
 whoSigns: string; // free text — name + title
 basis: string; // one of ALLOCATION_BASIS_OPTIONS
 changeSincePriorYear: boolean;
 changeDetail: string;
 changeEffectiveDate: string;
 priorityReturns: boolean;
 priorityDetail: string;
 drawingsLimited: boolean;
 drawingsLimitedDetail: string;
 negativeCapitalAllowed: boolean;
}

export const ALLOCATION_BASIS_OPTIONS = [
 "Fixed profit-sharing ratios per agreement",
 "Capital account balances",
 "Equal shares regardless of capital",
 "Other (describe in comments)",
];

export function blankQuestionnaire(): PWQuestionnaire {
 return {
 generalPartnerId: "",
 whoSigns: "",
 basis: "",
 changeSincePriorYear: false,
 changeDetail: "",
 changeEffectiveDate: "",
 priorityReturns: false,
 priorityDetail: "",
 drawingsLimited: false,
 drawingsLimitedDetail: "",
 negativeCapitalAllowed: false,
 };
}

export interface PartnerCapitalOverride {
 contributions: number;
 drawings: number;
 adjustments: number;
}

export interface PWWorksheetState {
 questionnaire: PWQuestionnaire;
 overridesByParticipantId: Record<string, PartnerCapitalOverride>;
 comments: string;
 concluded: boolean;
 copiedFromEngagementId?: string;
}

export function blankWorksheetState(): PWWorksheetState {
 return {
 questionnaire: blankQuestionnaire(),
 overridesByParticipantId: {},
 comments: "",
 concluded: false,
 };
}

const PW_KEY = (engagementId: string) => `cds_pw_worksheet_${engagementId}`;

export function loadPWWorksheet(engagementId: string): PWWorksheetState {
 try {
 const raw = localStorage.getItem(PW_KEY(engagementId));
 if (raw) return { ...blankWorksheetState(), ...JSON.parse(raw) };
 } catch { /* fall through */ }
 return blankWorksheetState();
}

export function savePWWorksheet(engagementId: string, state: PWWorksheetState): void {
 try { localStorage.setItem(PW_KEY(engagementId), JSON.stringify(state)); } catch { /* ignore */ }
}

export function getOverride(state: PWWorksheetState, participantId: string): PartnerCapitalOverride {
 return state.overridesByParticipantId[participantId] ?? { contributions: 0, drawings: 0, adjustments: 0 };
}
