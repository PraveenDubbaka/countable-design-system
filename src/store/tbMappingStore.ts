// Per-engagement persistence for Trial Balance row edits (grouping / sub grouping /
// participant / tax code / map no). Previously TrialBalance.tsx had NO persistence for these
// fields at all — they reset to the static demo data on every reload.
export interface TBRowOverride {
 grouping?: string;
 subGrouping?: string;
 participantId?: string;
 taxCode?: string | number;
 mapNo?: string | number;
 // true once the preparer has explicitly confirmed or hand-edited this row's mapping,
 // as opposed to it merely carrying an unconfirmed auto-suggestion.
 confirmed?: boolean;
 autoAssigned?: boolean;
}

const TB_MAPPING_KEY = (engagementId: string) => `cds_tb_mapping_${engagementId}`;

// Pre-confirmed participant mapping for the demo capital/drawings rows (see
// buildParticipantScopedRows in TrialBalance.tsx — row ids are `pc-{participantId}` /
// `pd-{participantId}`). Without this, the auto-mapping engine only suggests a participant in
// the live TB screen's own React state — it's never persisted as "confirmed", so anything that
// reads the mapping from storage directly (getParticipantCapitalFromTB, used by the Workbook's
// capital statement) sees no participant linkage at all and the reconciliation shows $0 from TB
// regardless of what the TB screen displays. Seeding these as already-confirmed is what makes the
// TB → mapping → capital statement flow demonstrable without a manual confirm click first.
const wcpOverrides = (pid: string): Record<string, TBRowOverride> => ({
 [`pc-${pid}`]: { participantId: pid, confirmed: true },
 [`pd-${pid}`]: { participantId: pid, confirmed: true },
});
const SEED_TB_MAPPING_OVERRIDES: Record<string, Record<string, TBRowOverride>> = {
 "COM-WCP-Dec312024": { ...wcpOverrides("WCP-ALEX"), ...wcpOverrides("WCP-MORGAN"), ...wcpOverrides("WCP-PRIYA") },
 "REV-WCP-Dec312024": { ...wcpOverrides("WCP-ALEX"), ...wcpOverrides("WCP-MORGAN"), ...wcpOverrides("WCP-PRIYA") },
 "T5013-WCP-Dec312024": { ...wcpOverrides("WCP-ALEX"), ...wcpOverrides("WCP-MORGAN"), ...wcpOverrides("WCP-PRIYA") },
 "COM-BFT-Dec312024": { ...wcpOverrides("BFT-TAYLOR"), ...wcpOverrides("BFT-JORDAN") },
 "REV-BFT-Dec312024": { ...wcpOverrides("BFT-TAYLOR"), ...wcpOverrides("BFT-JORDAN") },
 "T3-BFT-Dec312024": { ...wcpOverrides("BFT-TAYLOR"), ...wcpOverrides("BFT-JORDAN") },
};

export function loadTBMappingOverrides(engagementId: string): Record<string, TBRowOverride> {
 try {
 const raw = localStorage.getItem(TB_MAPPING_KEY(engagementId));
 if (raw) return JSON.parse(raw);
 } catch { /* fall through */ }
 return SEED_TB_MAPPING_OVERRIDES[engagementId] ?? {};
}

export function saveTBMappingOverrides(engagementId: string, overrides: Record<string, TBRowOverride>): void {
 try {
 localStorage.setItem(TB_MAPPING_KEY(engagementId), JSON.stringify(overrides));
 } catch {}
}
