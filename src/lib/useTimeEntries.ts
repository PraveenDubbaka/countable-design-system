import { useState, useEffect, useCallback } from 'react';

export type RoleKey = 'senior' | 'assistant' | 'manager' | 'partner' | 'eqcr' | 'specialist' | 'admin' | 'other';

export const ROLE_LABELS: Record<RoleKey, string> = {
  senior: 'Senior',
  assistant: 'Assistant(s)',
  manager: 'Manager / Supervisor',
  partner: 'Partner / Practitioner',
  eqcr: 'EQCR / EQR',
  specialist: 'Specialist',
  admin: 'Administration',
  other: 'Other',
};

// Maps each RoleKey → the TB team-member row ID
export const ROLE_TO_TB_ROW: Record<RoleKey, string> = {
  senior: 't1',
  assistant: 't2',
  manager: 't3',
  partner: 't4',
  specialist: 't5',
  eqcr: 't6',
  admin: 't7',
  other: 't7',
};

export interface TimeEntry {
  id: string;
  date: string;         // YYYY-MM-DD
  roleKey: RoleKey;
  tbRowId: string;      // e.g. 'g1', 'ra3', 'rr5' — corresponds to TB row ids
  tbSection: string;    // 'general' | 'risk-assess' | 'risk-resp'
  hours: number;
  description: string;
}

const storageKey = (eid: string) => `audit-time-entries-${eid}`;

const SEED_ENTRIES: TimeEntry[] = [
  { id: 'seed-1', date: '2024-04-02', roleKey: 'partner',   tbRowId: 'g1',  tbSection: 'general',     hours: 3.0, description: 'Overall audit strategy and planning meeting' },
  { id: 'seed-2', date: '2024-04-03', roleKey: 'manager',   tbRowId: 'g2',  tbSection: 'general',     hours: 2.5, description: 'Supervision – review of planning documentation' },
  { id: 'seed-3', date: '2024-04-05', roleKey: 'senior',    tbRowId: 'g4',  tbSection: 'general',     hours: 1.5, description: 'Opening client meeting' },
  { id: 'seed-4', date: '2024-04-08', roleKey: 'senior',    tbRowId: 'ra1', tbSection: 'risk-assess',  hours: 4.0, description: 'Financial statement analysis – revenue trend review' },
  { id: 'seed-5', date: '2024-04-09', roleKey: 'senior',    tbRowId: 'ra3', tbSection: 'risk-assess',  hours: 6.5, description: 'Risk assessment procedures – walkthroughs and inquiries' },
  { id: 'seed-6', date: '2024-04-10', roleKey: 'assistant', tbRowId: 'ra3', tbSection: 'risk-assess',  hours: 3.0, description: 'Entity-level controls documentation' },
  { id: 'seed-7', date: '2024-04-15', roleKey: 'senior',    tbRowId: 'rr3', tbSection: 'risk-resp',    hours: 5.0, description: 'Cash and short-term investments' },
  { id: 'seed-8', date: '2024-04-16', roleKey: 'assistant', tbRowId: 'rr4', tbSection: 'risk-resp',    hours: 4.5, description: 'Accounts receivable confirmation' },
  { id: 'seed-9', date: '2024-04-17', roleKey: 'assistant', tbRowId: 'rr5', tbSection: 'risk-resp',    hours: 5.0, description: 'Inventory test counts and valuation' },
  { id: 'seed-10',date: '2024-04-18', roleKey: 'senior',    tbRowId: 'rr8', tbSection: 'risk-resp',    hours: 3.5, description: 'PP&E additions and disposals testing' },
  { id: 'seed-11',date: '2024-04-22', roleKey: 'manager',   tbRowId: 'g2',  tbSection: 'general',     hours: 2.0, description: 'Interim review – fieldwork progress' },
  { id: 'seed-12',date: '2024-04-23', roleKey: 'senior',    tbRowId: 'rr16',tbSection: 'risk-resp',    hours: 4.0, description: 'Revenue cut-off and recognition testing' },
];

export function loadTimeEntries(engagementId: string): TimeEntry[] {
  try {
    const raw = localStorage.getItem(storageKey(engagementId));
    if (raw) return JSON.parse(raw) as TimeEntry[];
    // First load: seed with mock entries
    localStorage.setItem(storageKey(engagementId), JSON.stringify(SEED_ENTRIES));
    return SEED_ENTRIES;
  } catch { return []; }
}

export function useTimeEntries(engagementId: string) {
  const [entries, setEntries] = useState<TimeEntry[]>(() => loadTimeEntries(engagementId));

  // React to cross-tab storage changes
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === storageKey(engagementId)) setEntries(loadTimeEntries(engagementId));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [engagementId]);

  const persist = useCallback((next: TimeEntry[]) => {
    localStorage.setItem(storageKey(engagementId), JSON.stringify(next));
    setEntries(next);
  }, [engagementId]);

  const addEntry = useCallback((entry: TimeEntry) => {
    setEntries(prev => {
      const next = [entry, ...prev];
      localStorage.setItem(storageKey(engagementId), JSON.stringify(next));
      return next;
    });
  }, [engagementId]);

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => {
      const next = prev.filter(e => e.id !== id);
      localStorage.setItem(storageKey(engagementId), JSON.stringify(next));
      return next;
    });
  }, [engagementId]);

  const hrsForRow     = (rowId: string)     => entries.filter(e => e.tbRowId   === rowId).reduce((a, e) => a + e.hours, 0);
  const hrsForRole    = (role: RoleKey)     => entries.filter(e => e.roleKey   === role).reduce((a, e) => a + e.hours, 0);
  const hrsForSection = (sec: string)      => entries.filter(e => e.tbSection  === sec).reduce((a, e) => a + e.hours, 0);

  return { entries, addEntry, removeEntry, persist, hrsForRow, hrsForRole, hrsForSection };
}
