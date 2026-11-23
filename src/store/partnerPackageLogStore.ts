// Partner package generation log (P14) — "a record of which package went to whom and when".
// There's no send/email pipeline in this prototype, so "delivery" is recorded as generation: the
// batch that produced a given file, and when. Stored per engagement, following the same
// localStorage-backed pattern as participantsStore.ts / partnershipWorksheetStore.ts.

export interface PartnerPackageLogEntry {
 id: string;
 engagementId: string;
 generatedAt: string; // ISO timestamp
 packageType: "full" | "partner";
 participantId?: string; // present for packageType === "partner"
 participantName?: string;
 fileName: string;
}

const LOG_KEY = (engagementId: string) => `cds_partner_package_log_${engagementId}`;

export function loadPartnerPackageLog(engagementId: string): PartnerPackageLogEntry[] {
 try {
 const raw = localStorage.getItem(LOG_KEY(engagementId));
 if (raw) return JSON.parse(raw);
 } catch {}
 return [];
}

export function appendPartnerPackageLogEntries(engagementId: string, entries: PartnerPackageLogEntry[]): void {
 try {
 const existing = loadPartnerPackageLog(engagementId);
 localStorage.setItem(LOG_KEY(engagementId), JSON.stringify([...existing, ...entries]));
 } catch {}
}
