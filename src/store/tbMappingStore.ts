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

export function loadTBMappingOverrides(engagementId: string): Record<string, TBRowOverride> {
 try {
 const raw = localStorage.getItem(TB_MAPPING_KEY(engagementId));
 return raw ? JSON.parse(raw) : {};
 } catch {
 return {};
 }
}

export function saveTBMappingOverrides(engagementId: string, overrides: Record<string, TBRowOverride>): void {
 try {
 localStorage.setItem(TB_MAPPING_KEY(engagementId), JSON.stringify(overrides));
 } catch {}
}
