// Auto-mapping suggestion engine for the Trial Balance (P7). Every function here returns a
// SUGGESTION only — nothing is ever silently assigned. The caller decides whether/how to
// surface it (e.g. via the existing filter-badge mechanism) and always requires confirmation.
import type { Participant } from "@/store/participantsStore";

// ── Account-name-contains-participant-name matching ──────────────────────────────────────
// Never auto-assigns when ambiguous (e.g. two partners share a matched name) — the caller
// must present an ambiguous match as "needs manual selection," not as a confirmed pick.
export function matchParticipantByName(
  description: string,
  participants: Participant[]
): { participantId: string } | { ambiguous: true; candidateIds: string[] } | null {
  const desc = description.toLowerCase();
  const matches = participants.filter(p => p.name && desc.includes(p.name.toLowerCase()));
  if (matches.length === 0) return null;
  if (matches.length > 1) return { ambiguous: true, candidateIds: matches.map(m => m.id) };
  return { participantId: matches[0].id };
}

// ── Partner / beneficiary loan guard ─────────────────────────────────────────────────────
// A "loan" account mapped to Equity is almost always miswired (it belongs in Assets or
// Liabilities) — flagged as a warning only, never auto-corrected.
export function isPartnerLoanMiswired(description: string, grouping: string): boolean {
  return grouping === "Equity" && description.toLowerCase().includes("loan");
}

// ── Account-number-sequence detection ─────────────────────────────────────────────────────
// Accountants commonly block participant-scoped accounts into the same tens-range (e.g.
// 3101-3109 for partners' capital). If an unmapped account falls in the same block as an
// already-mapped row, suggest that row's sub-grouping/participant — still just a suggestion.
export function suggestFromAccountSequence(
  accNo: string,
  mappedRows: { accNo: string; subGrouping: string; participantId?: string }[]
): { subGrouping: string; participantId?: string } | null {
  const num = parseInt(accNo, 10);
  if (isNaN(num)) return null;
  const block = Math.floor(num / 10);
  const match = mappedRows.find(r => {
    const n = parseInt(r.accNo, 10);
    return !isNaN(n) && r.accNo !== accNo && Math.floor(n / 10) === block;
  });
  return match ? { subGrouping: match.subGrouping, participantId: match.participantId } : null;
}

// ── Prior-year mapping carry-forward ──────────────────────────────────────────────────────
// Keyed by client name + account number, so a later engagement for the same client can look
// up a mapping the preparer already confirmed. Only written when a mapping is actually
// confirmed (see TrialBalance.tsx), never from a suggestion alone.
export interface PriorMapping {
  grouping: string;
  subGrouping: string;
  participantId?: string;
  taxCode?: string;
}

const PRIOR_MAP_KEY = (clientName: string) => `cds_tb_prior_mapping_${clientName}`;

export function loadPriorMappings(clientName: string): Record<string, PriorMapping> {
  try {
    const raw = localStorage.getItem(PRIOR_MAP_KEY(clientName));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function savePriorMapping(clientName: string, accNo: string, mapping: PriorMapping): void {
  try {
    const all = loadPriorMappings(clientName);
    all[accNo] = mapping;
    localStorage.setItem(PRIOR_MAP_KEY(clientName), JSON.stringify(all));
  } catch {}
}

export function suggestFromPriorMapping(clientName: string, accNo: string): PriorMapping | null {
  return loadPriorMappings(clientName)[accNo] ?? null;
}
