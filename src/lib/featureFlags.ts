export const SHOW_REGION_LABELS = false; // Data Residency (CA/US cell) labels, hidden until direction is decided (Atin, Nov 16)
export const SHOW_MULTI_OFFICE = false; // Multi-office (switcher, add office, all-offices view), hidden – Atin not proceeding for now (Nov 16)

// With multi-office hidden the active office is always the main one; a stored activeFirmId is ignored (not deleted).
export const MAIN_FIRM_ID = "firm-ca-1";
export const activeFirmIdOrMain = (stored: string | null): string => (SHOW_MULTI_OFFICE ? stored ?? MAIN_FIRM_ID : MAIN_FIRM_ID);
