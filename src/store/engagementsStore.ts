export type EngagementRecord = {
 id: string;
 client: string;
 type: string;
 yearEnd: string;
 team: string;
 status: 'New' | 'In Progress';
 statusVariant: 'new' | 'inProgress';
 hasRF: boolean;
 dateCreated: string;
 firstYearAudit: boolean;
};

const ENG_KEY = 'cds_engagements_v1';
const META_KEY = (id: string) => `engagement-meta-${id}`;

export const SEED_ENGAGEMENTS: EngagementRecord[] = [
 { id: "AUD-NPM-Dec312025", client: "Northline Precision Manufacturing Inc.", type: "Audit (AUD)", yearEnd: "Dec 31, 2025", team: "R. Chandra · S. Whitfield · D. Okonkwo", status: "In Progress", statusVariant: "inProgress", hasRF: false, dateCreated: "Jul 27, 2026 09:00 AM", firstYearAudit: true },
 { id: "AUD-US-Dec312024", client: "Harbor Freight Logistics LLC", type: "Audit (AUD)", yearEnd: "Dec 31, 2024", team: "View Assignees", status: "In Progress", statusVariant: "inProgress", hasRF: false, dateCreated: "Jan 22, 2026 08:00 AM", firstYearAudit: false },
 { id: "AUD-SL-Mar312024", client: "Shipping Line Inc.", type: "Audit (AUD)", yearEnd: "Mar 31, 2024", team: "View Assignees", status: "In Progress", statusVariant: "inProgress", hasRF: false, dateCreated: "Jan 21, 2026 10:00 AM", firstYearAudit: false },
 { id: "COM-CON-Dec312024", client: "Shipping Line Inc.", type: "Compilation (COM)", yearEnd: "Dec 31, 2024", team: "View Assignees", status: "In Progress", statusVariant: "inProgress", hasRF: false, dateCreated: "Jan 21, 2026 09:00 AM", firstYearAudit: false },
 { id: "COM-PSP-Dec312023", client: "Source 40", type: "Compilation (COM)", yearEnd: "Dec 31, 2023", team: "View Assignees", status: "In Progress", statusVariant: "inProgress", hasRF: false, dateCreated: "Dec 30, 2025 06:26 AM", firstYearAudit: false },
 { id: "COM-QB-Dec312025", client: "qb 40.1", type: "Compilation (COM)", yearEnd: "Dec 31, 2025", team: "View Assignees", status: "In Progress", statusVariant: "inProgress", hasRF: true, dateCreated: "Jan 16, 2026 01:15 PM", firstYearAudit: false },
 { id: "COM-QB-Dec312024", client: "qb 40.1", type: "Compilation (COM)", yearEnd: "Dec 31, 2024", team: "View Assignees", status: "In Progress", statusVariant: "inProgress", hasRF: false, dateCreated: "Jan 13, 2026 01:36 AM", firstYearAudit: false },
 { id: "COM-CHE-Dec252024", client: "check add", type: "Compilation (COM)", yearEnd: "Dec 25, 2024", team: "View Assignees", status: "New", statusVariant: "new", hasRF: false, dateCreated: "Jan 16, 2026 08:20 AM", firstYearAudit: false },
 { id: "COM-OTH-Dec312024", client: "Other Revenue", type: "Compilation (COM)", yearEnd: "Dec 31, 2024", team: "View Assignees", status: "In Progress", statusVariant: "inProgress", hasRF: false, dateCreated: "Jan 16, 2026 02:38 AM", firstYearAudit: false },
 { id: "T2-AUT-Dec312023", client: "Shipping Line Inc.", type: "T2 (Corporations)", yearEnd: "Dec 31, 2023", team: "View Assignees", status: "In Progress", statusVariant: "inProgress", hasRF: false, dateCreated: "Dec 30, 2025 08:48 AM", firstYearAudit: false },
 { id: "COM-CAS-Dec312024", client: "cash flow ls", type: "Compilation (COM)", yearEnd: "Dec 31, 2024", team: "View Assignees", status: "In Progress", statusVariant: "inProgress", hasRF: false, dateCreated: "Jan 13, 2026 09:21 AM", firstYearAudit: false },
 { id: "COM-QB-Jan142026", client: "qb 40.1", type: "Compilation (COM)", yearEnd: "Jan 14, 2026", team: "View Assignees", status: "New", statusVariant: "new", hasRF: false, dateCreated: "Jan 13, 2026 04:36 AM", firstYearAudit: false },
 { id: "COM-SHR-Dec302023", client: "ShRoll Forward", type: "Compilation (COM)", yearEnd: "Dec 30, 2023", team: "View Assignees", status: "In Progress", statusVariant: "inProgress", hasRF: true, dateCreated: "Jan 13, 2026 03:51 AM", firstYearAudit: false },
];

function seedDemoEngagementMeta() {
 const key = 'engagement-meta-AUD-NPM-Dec312025';
 if (localStorage.getItem(key)) return;
 const meta: EngagementMeta = {
   firstYearAudit: true,
   accountingFramework: 'ASPE',
   accountingStandards: 'CAS',
   industry: 'Manufacturing',
   periodStart: 'Jan 1, 2025',
   periodEnd: 'Dec 31, 2025',
   auditPeriodType: 'Full Year',
   firstTimeAdoption: false,
   budget: '138',
 };
 localStorage.setItem(key, JSON.stringify(meta));
}

export function loadEngagements(): EngagementRecord[] {
 seedDemoEngagementMeta();
 try {
   const raw = localStorage.getItem(ENG_KEY);
   if (raw) return JSON.parse(raw);
 } catch {}
 return SEED_ENGAGEMENTS;
}

export function loadAuditEngagements(): EngagementRecord[] {
 return loadEngagements().filter(e => e.type === 'Audit (AUD)');
}

export function saveEngagements(list: EngagementRecord[]): void {
 try {
 localStorage.setItem(ENG_KEY, JSON.stringify(list));
 } catch {}
}

export type YearSourceKind = "csv" | "xero" | "quickbooks" | "sage";

export type EngagementMeta = {
 firstYearAudit: boolean;
 firstYearOnPlatform?: string;
 isRollForward?: string;
 firstYearTemplates?: string[];
 templateId?: string;
 accountingFramework?: string;
 industry?: string;
 accountingStandards?: string;
 budget?: string;
 periodStart?: string;
 periodEnd?: string;
 auditPeriodType?: string; // "Full Year" | "Interim (6-month)" | "Stub Period" | "Other"
 annualizeInterim?: boolean; // true by default when auditPeriodType === "Interim (6-month)"
 firstYearOfOperations?: boolean; // stub period that is the entity's first year — allows source
 /** First Year of Operations roll-forward chain: 1 = the FOO year, 2 = 1st roll forward (CY + PY1), 3 = 2nd roll forward (all years). */
 fyoChainYear?: 1 | 2 | 3;
 /** Date (MM/dd/yyyy) the Trial Balance last pulled Current Year source data — shown for future year ends. */
 dataPulledAsOf?: string;
 firstTimeAdoption?: boolean; // first-time adoption of accounting standard
 dataSource?: "csv" | "source";
 yearDataSources?: {
   cy: "csv" | "source";
   py1: "csv" | "source";
   py2: "csv" | "source";
 };
 /** Which connected provider each Source year pulls from (multi-source engagements). */
 yearSourceProviders?: { cy?: "xero" | "quickbooks" | "sage"; py1?: "xero" | "quickbooks" | "sage"; py2?: "xero" | "quickbooks" | "sage" };
  /** Edit only: years switched Source to CSV whose existing data the user chose to remove. */
 yearRemoveData?: { cy?: boolean; py1?: boolean; py2?: boolean };
 sourceYears?: number; // 1 = CY only, 2 = CY + PY1, 3 = all years connected to source
 sourceConnectionId?: string; // client connection the source years were pulled from (default `${provider}-initial`)
 sourceDisconnectedFrom?: "xero" | "quickbooks" | "sage"; // set when a CSV import disconnected a source engagement
 sourceRollForward?: boolean; // roll forward: CY from source, prior years stay CSV
 /** Roll forward: where each locked prior year came from (last year's CY → PY1, last year's PY1 → PY2).
  *  py2 is "nodata" when last year was the entity's First Year of Operations (no year before it). */
 priorYearSources?: { py1: YearSourceKind; py2: YearSourceKind | "nodata" };
 sourceYearsAvailable?: number; // years of data available in the source (demo)
 sourceProvider?: "xero" | "quickbooks" | "sage"; // which accounting source the engagement is linked to
 teamMembers?: {
   id: string;
   role: string;
   name: string;
   email: string;
   title: string;
   hourlyRate: string;
   timeAllocation: string;
 }[];
};

export function getEngagementMeta(id: string): EngagementMeta {
 try {
 const raw = localStorage.getItem(META_KEY(id));
 if (raw) return JSON.parse(raw);
 } catch {}
 return { firstYearAudit: false };
}

export function setEngagementMeta(id: string, meta: EngagementMeta): void {
 try {
 localStorage.setItem(META_KEY(id), JSON.stringify(meta));
 } catch {}
}

const LAST_YEAR_RE = /(\d{4})(?!\d)(?!.*\d{4})/;
/** Adds `n` years to the last 4-digit year in a string (IDs, year ends, period dates). */
function bumpLastYear(s: string, n = 1): string {
 return s.replace(LAST_YEAR_RE, (y) => String(Number(y) + n));
}

function toMdY(d: Date): string {
 const pad = (n: number) => String(n).padStart(2, "0");
 return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

function nowDateCreated(): string {
 const now = new Date();
 return now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
  " " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

/**
 * Rolls an engagement forward one year. Saves the new engagement's meta and returns its record
 * (the caller adds the record to the engagement list). Returns null if the source engagement is missing.
 */
export function createRollForward(
 sourceId: string,
 clientConnection: "xero" | "quickbooks" | "sage" | null,
): EngagementRecord | null {
 const list = loadEngagements();
 const src = list.find((e) => e.id === sourceId);
 if (!src) return null;
 const m = getEngagementMeta(sourceId);

 // Last year's source per year
 const lastYear = (y: "cy" | "py1" | "py2"): YearSourceKind =>
  m.yearDataSources?.[y] === "source" ? (m.yearSourceProviders?.[y] ?? m.sourceProvider ?? "csv") : "csv";
 // Last year was First Year of Operations / Partial year → this year is a normal 12-month Full year
 const srcIsFyo = m.auditPeriodType === "First Year of Operations"
  || (!!m.firstYearOfOperations && /^partial year$/i.test(m.auditPeriodType ?? ""));
 const srcIsPartial = !srcIsFyo && /^partial year$/i.test(m.auditPeriodType ?? "");
 const srcChain = srcIsFyo ? (m.fyoChainYear ?? 1) : 0;
 // FOO stays FOO through roll forward until all three years are full years (chain 1 → 2 → 3 → Full year)
 const keepFyo = srcIsFyo && srcChain < 3;
 const py1: YearSourceKind = lastYear("cy");
 // FYO: the business didn't exist two years back → PY2 is a "No data" year (only on the 1st roll forward)
 const py2: YearSourceKind | "nodata" = srcIsFyo && srcChain === 1
  ? "nodata"
  : m.sourceRollForward && m.priorYearSources?.py1 ? m.priorYearSources.py1 : lastYear("py1");
 const cyKind: "csv" | "source" = clientConnection ? "source" : "csv";

 // New ID: bump the last year, de-duplicate with -2, -3, …
 const ids = new Set(list.map((e) => e.id));
 const baseId = bumpLastYear(sourceId);
 let id = baseId;
 for (let n = 2; ids.has(id); n++) id = `${baseId}-${n}`;

 const record: EngagementRecord = {
  ...src,
  id,
  yearEnd: bumpLastYear(src.yearEnd),
  status: "New",
  statusVariant: "new",
  hasRF: true,
  dateCreated: nowDateCreated(),
 };

 const kind = (v: YearSourceKind | "nodata"): "csv" | "source" => (v === "csv" || v === "nodata" ? "csv" : "source");
 const yearSourceProviders: NonNullable<EngagementMeta["yearSourceProviders"]> = {};
 if (cyKind === "source" && clientConnection) yearSourceProviders.cy = clientConnection;
 if (py1 !== "csv") yearSourceProviders.py1 = py1;
 if (py2 !== "csv" && py2 !== "nodata") yearSourceProviders.py2 = py2;

 // Period: FYO / Partial year roll into a Full year = the 12 months ending on the new year-end
 const resetToFullYear = srcIsFyo || srcIsPartial;
 let periodStart = m.periodStart ? bumpLastYear(m.periodStart) : undefined;
 let periodEnd = m.periodEnd ? bumpLastYear(m.periodEnd) : undefined;
 if (resetToFullYear) {
  const end = new Date(periodEnd ?? record.yearEnd);
  if (!isNaN(end.getTime())) {
   const start = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate() + 1);
   periodStart = toMdY(start);
   periodEnd = toMdY(end);
  }
 }

 const meta: EngagementMeta = {
  firstYearAudit: record.firstYearAudit,
  templateId: m.templateId,
  accountingStandards: m.accountingStandards,
  accountingFramework: m.accountingFramework,
  budget: m.budget,
  teamMembers: m.teamMembers ? m.teamMembers.map((t) => ({ ...t })) : undefined,
  auditPeriodType: keepFyo ? "First Year of Operations" : resetToFullYear ? (src.type === "Audit (AUD)" ? "Full Year" : "Full year") : m.auditPeriodType,
  ...(keepFyo ? { firstYearOfOperations: true, fyoChainYear: (srcChain + 1) as 2 | 3 } : {}),
  periodStart,
  periodEnd,
  sourceRollForward: true,
  dataSource: cyKind,
  sourceProvider: clientConnection ?? undefined,
  sourceYears: cyKind === "source" ? 1 : undefined,
  priorYearSources: { py1, py2 },
  yearDataSources: { cy: cyKind, py1: kind(py1), py2: kind(py2) },
  yearSourceProviders,
  sourceYearsAvailable: m.sourceYearsAvailable ?? 3,
 };
 setEngagementMeta(id, meta);
 return record;
}
