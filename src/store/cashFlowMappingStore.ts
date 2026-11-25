// Per-engagement persistence for the Statement of Cash Flows mapping grid — which CFO/CFI/CFF
// category each Trial Balance row has been (re)assigned to, overriding workbookStatements.ts's
// own `defaultCfCategory` guess. Same shape/pattern as tbMappingStore.ts's TBRowOverride.
import type { CfCategory } from "@/lib/workbookStatements";

const CF_MAPPING_KEY = (engagementId: string) => `cds_cf_mapping_${engagementId}`;

export function loadCfOverrides(engagementId: string): Record<string, CfCategory> {
 try {
 const raw = localStorage.getItem(CF_MAPPING_KEY(engagementId));
 return raw ? JSON.parse(raw) : {};
 } catch {
 return {};
 }
}

export function saveCfOverrides(engagementId: string, overrides: Record<string, CfCategory>): void {
 try {
 localStorage.setItem(CF_MAPPING_KEY(engagementId), JSON.stringify(overrides));
 } catch {
 // best-effort — a blocked/full localStorage shouldn't crash the page
 }
}
