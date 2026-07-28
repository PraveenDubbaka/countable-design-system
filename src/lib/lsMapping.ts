export interface LsInfo {
  lsCode: string;
  wpNodeId: string;
  wpLabel: string;
}

export const ALL_PROCEDURE_NODES: LsInfo[] = [
  { lsCode: "A",  wpNodeId: "aud-wp-a",  wpLabel: "Cash and cash equivalents" },
  { lsCode: "B",  wpNodeId: "aud-wp-b",  wpLabel: "Accounts receivable" },
  { lsCode: "C",  wpNodeId: "aud-wp-c",  wpLabel: "Inventories" },
  { lsCode: "D",  wpNodeId: "aud-wp-d",  wpLabel: "Short-term investments" },
  { lsCode: "E",  wpNodeId: "aud-wp-e",  wpLabel: "Loans and notes receivable" },
  { lsCode: "I",  wpNodeId: "aud-wp-i",  wpLabel: "Other current assets" },
  { lsCode: "H",  wpNodeId: "aud-wp-h",  wpLabel: "Property, plant and equipment" },
  { lsCode: "K",  wpNodeId: "aud-wp-k",  wpLabel: "Long-term investments" },
  { lsCode: "BB", wpNodeId: "aud-wp-bb", wpLabel: "Accounts payable" },
  { lsCode: "CC", wpNodeId: "aud-wp-cc", wpLabel: "Taxes payable" },
  { lsCode: "DD", wpNodeId: "aud-wp-dd", wpLabel: "Short-term debt" },
  { lsCode: "JJ", wpNodeId: "aud-wp-jj", wpLabel: "Other long-term liabilities" },
  { lsCode: "KK", wpNodeId: "aud-wp-kk", wpLabel: "Long-term debt" },
  { lsCode: "TT", wpNodeId: "aud-wp-tt", wpLabel: "Equity" },
  { lsCode: "20", wpNodeId: "aud-wp-20", wpLabel: "Revenue" },
  { lsCode: "30", wpNodeId: "aud-wp-30", wpLabel: "Cost of sales" },
  { lsCode: "40", wpNodeId: "aud-wp-40", wpLabel: "Expenses" },
  { lsCode: "80", wpNodeId: "aud-wp-80", wpLabel: "Other expenses (income)" },
];

// Ordered from most specific to least — first match wins
const LS_MAP: Array<{ pattern: RegExp; wpNodeId: string }> = [
  { pattern: /^revenue$/i,                                                    wpNodeId: "aud-wp-20" },
  { pattern: /^cost of (sales|goods( sold)?)$/i,                             wpNodeId: "aud-wp-30" },
  { pattern: /payroll|benefits?|wages|salaries/i,                            wpNodeId: "aud-wp-40" },
  { pattern: /operating expense|general.{0,6}admin/i,                        wpNodeId: "aud-wp-40" },
  { pattern: /cash|bank/i,                                                    wpNodeId: "aud-wp-a"  },
  { pattern: /accounts? receivable|trade receivable/i,                       wpNodeId: "aud-wp-b"  },
  { pattern: /inventor/i,                                                     wpNodeId: "aud-wp-c"  },
  { pattern: /property|plant.{0,10}equipment|ppe|capital asset|tangible/i,   wpNodeId: "aud-wp-h"  },
  { pattern: /accounts? payable|trade payable/i,                             wpNodeId: "aud-wp-bb" },
  { pattern: /income tax|tax payable|tax/i,                                  wpNodeId: "aud-wp-cc" },
  { pattern: /short.{0,5}term debt|line of credit|revolver|credit facilit|overdraft/i, wpNodeId: "aud-wp-dd" },
  { pattern: /debt|loan|financing|mortgage|debenture|bond|note payable/i,    wpNodeId: "aud-wp-kk" },
  { pattern: /equity|shareholder|stockholder|retained earnings?|capital stock|share capital/i, wpNodeId: "aud-wp-tt" },
  { pattern: /other (expense|income)|miscellaneous/i,                        wpNodeId: "aud-wp-80" },
  { pattern: /revenue|income|sales/i,                                        wpNodeId: "aud-wp-20" },
  { pattern: /expense|cost/i,                                                 wpNodeId: "aud-wp-40" },
];

export function getLsInfo(fsaName: string): LsInfo | null {
  if (!fsaName.trim()) return null;
  for (const entry of LS_MAP) {
    if (entry.pattern.test(fsaName)) {
      return ALL_PROCEDURE_NODES.find(n => n.wpNodeId === entry.wpNodeId) ?? null;
    }
  }
  return null;
}

const procStorageKey = (engId: string) => `audit-590-active-procs-${engId}`;

export function getActiveProcedureIds(engagementId: string): string[] {
  try {
    const raw = localStorage.getItem(procStorageKey(engagementId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function setActiveProcedureIds(engagementId: string, ids: string[]): void {
  try {
    const key = procStorageKey(engagementId);
    localStorage.setItem(key, JSON.stringify([...new Set(ids)]));
    // Notify other components (Sidebar) listening for storage events
    window.dispatchEvent(new StorageEvent("storage", { key, storageArea: localStorage }));
  } catch { /* ignore */ }
}
