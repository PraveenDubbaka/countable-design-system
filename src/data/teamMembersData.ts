// Team members: the built-in list below plus whatever localStorage adds, edits or removes. Shared by the Teams page and
// Settings (User & Access), which both need the members and need to reassign their work.

// Sample team members
export const SEED_TEAM_MEMBERS = [
 { id: "-", name: "Cpt Group", title: "cpt-10176", status: "Accepted", email: "cpt10176canada@yopmail.c...", category: "Partner", clients: "132", businessPhone: "-", cellPhone: "(424) 234-2424", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "Pen Test", title: "-", status: "Accepted", email: "pentest+role4@sspentest.c...", category: "Partner", clients: "-", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "Shai Firm", title: "ms", status: "Accepted", email: "shfirmuat@yopmail.com", category: "Partner", clients: "-", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "60.00", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "Norbert B", title: "Pen Test", status: "Accepted", email: "norbert@strivesec.com", category: "Staff", clients: "2", businessPhone: "-", cellPhone: "-", assignedPartner: "R. Chandra", hourlyRate: "124.00", twoFAStatus: "-", licenseNo: "-", unassigned: false },
 { id: "-", name: "Haroon S", title: "API", status: "Accepted", email: "haroons@countable.co", category: "Staff", clients: "-", businessPhone: "-", cellPhone: "-", assignedPartner: "R. Chandra", hourlyRate: "256.00", twoFAStatus: "-", licenseNo: "-", unassigned: false },
 { id: "-", name: "Amol Patil", title: "-", status: "Accepted", email: "amolp@countable.co", category: "CMS (Countable Managed Staff)", clients: "-", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "Staff Test", title: "HV", status: "Accepted", email: "stafftest@yopmail.com", category: "Partner", clients: "-", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "Ishaan S", title: "CA", status: "Invite Now", email: "ishaan@yopmail.com", category: "Partner", clients: "-", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "Henry Davis", title: "Mr", status: "Accepted", email: "general_2511281624292@y...", category: "Partner", clients: "-", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "R. Chandra", title: "Partner", status: "Accepted", email: "rchandra@countable.co", category: "Partner", clients: "1", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "Praveen D.", title: "Partner", status: "Accepted", email: "praveend@countable.co", category: "Partner", clients: "7", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "Ayesha Naaz", title: "Manager", status: "Accepted", email: "ayeshan@countable.co", category: "Partner", clients: "6", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
 { id: "-", name: "James Park", title: "Partner", status: "Accepted", email: "jamesp@countable.co", category: "Partner", clients: "6", businessPhone: "-", cellPhone: "-", assignedPartner: "-", hourlyRate: "-", twoFAStatus: "-", licenseNo: "-" },
];

export type TeamMember = (typeof SEED_TEAM_MEMBERS)[number];
// A row of the grid: the member plus the key that identifies it (the built-in members are "seed-<position>").
export type TeamMemberRow = TeamMember & { key: string };

// Members come from the built-in list above and from localStorage "cds_team_members_v2" (AddTeamMember.tsx writes new
// members there; keep the key in sync). Every stored record has a `key`: one keyed "seed-<position>" is an edit that
// replaces that built-in member, any other is a member added later and is listed first. Deleted built-in members are
// kept in a removed-keys list so they stay hidden.
const TEAM_MEMBERS_KEY = "cds_team_members_v2";
const REMOVED_KEYS_KEY = "cds_team_members_removed_v1";
const SEED_PREFIX = "seed-";

const readList = (storageKey: string): unknown[] => {
 try {
  const raw = localStorage.getItem(storageKey);
  const list: unknown = raw ? JSON.parse(raw) : [];
  return Array.isArray(list) ? list : [];
 } catch {
  return [];
 }
};
const writeList = (storageKey: string, list: unknown[]) => {
 try { localStorage.setItem(storageKey, JSON.stringify(list)); } catch { /* storage unavailable: the change is not kept */ }
};

// Stored records, tidied: entries without a name are skipped, other missing fields show "-", and records saved before
// keys existed are given one.
const readStored = (): TeamMemberRow[] => {
 const text = (value: unknown) => (typeof value === "string" && value ? value : "-");
 let addedKeys = false;
 const rows = readList(TEAM_MEMBERS_KEY)
  .filter((m): m is Record<string, unknown> => typeof m === "object" && m !== null)
  .map((m, index) => {
   const hasKey = typeof m.key === "string" && m.key !== "";
   if (!hasKey) addedKeys = true;
   return {
    key: hasKey ? String(m.key) : `team-${Date.now()}-${index}`,
    id: text(m.id), name: text(m.name), title: text(m.title), status: text(m.status), email: text(m.email),
    category: text(m.category), clients: text(m.clients), businessPhone: text(m.businessPhone), cellPhone: text(m.cellPhone),
    assignedPartner: text(m.assignedPartner), hourlyRate: text(m.hourlyRate), twoFAStatus: text(m.twoFAStatus), licenseNo: text(m.licenseNo),
    unassigned: m.unassigned === true ? true : undefined,
   };
  })
  .filter(m => m.name !== "-");
 if (addedKeys) writeList(TEAM_MEMBERS_KEY, rows);
 return rows;
};

// The grid: added members first, then the built-in members with their edits, minus the deleted ones.
export const loadMembers = (): TeamMemberRow[] => {
 const stored = readStored();
 const removed = new Set(readList(REMOVED_KEYS_KEY));
 const edits = new Map(stored.filter(r => r.key.startsWith(SEED_PREFIX)).map(r => [r.key, r] as const));
 const builtIn = SEED_TEAM_MEMBERS.map((m, i): TeamMemberRow => edits.get(`${SEED_PREFIX}${i}`) ?? { ...m, key: `${SEED_PREFIX}${i}` });
 return [...stored.filter(r => !r.key.startsWith(SEED_PREFIX)), ...builtIn].filter(r => !removed.has(r.key));
};

// Replaces the stored record with the same key, or adds it (for a built-in member that is its first edit).
export const saveMemberRecord = (row: TeamMemberRow) => {
 const stored = readStored();
 writeList(TEAM_MEMBERS_KEY, stored.some(r => r.key === row.key) ? stored.map(r => (r.key === row.key ? row : r)) : [...stored, row]);
};

export const removeMemberRecord = (row: TeamMemberRow) => {
 writeList(TEAM_MEMBERS_KEY, readStored().filter(r => r.key !== row.key));
 if (row.key.startsWith(SEED_PREFIX)) writeList(REMOVED_KEYS_KEY, Array.from(new Set([...readList(REMOVED_KEYS_KEY), row.key])));
};
