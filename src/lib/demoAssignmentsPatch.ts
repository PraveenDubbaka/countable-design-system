import { CLIENTS_KEY } from "@/data/clientsData";
import { SEED_PREFIX, SEED_TEAM_MEMBERS, TEAM_MEMBERS_KEY } from "@/data/teamMembersData";
import { ENG_KEY } from "@/store/engagementsStore";

// One-time demo data: the built-in clients, team members and engagements were reassigned so a few people own enough work
// to try the bulk reassign dialog (Teams -> Delete User, Settings -> Remove Access). Browsers that already stored those
// lists still have the old owners, so this brings the stored records in line once, then sets the flag. It changes only
// the fields below, and only on the built-in records (matched on id / key): records people added, every other field and
// any key that is absent are left as they are.
const DONE_KEY = "cds_demo_assignments_v1";

const invert = (groups: Record<string, string[]>) => new Map(Object.entries(groups).flatMap(([value, ids]) => ids.map(id => [id, value] as const)));

// Client id -> engagement partner. The other clients keep theirs.
const CLIENT_PARTNER = invert({
 "R. Chandra": ["DEMO-NPM", "CR002", "CR005", "MC001", "QB001", "RV001", "BK001", "CR001", "CR004", "GG001", "TF001"],
 "Ayesha Naaz": ["NV001", "MH001"],
});

// Engagement id -> team ("A · B"). AUD-NPM-Dec312025 keeps its own.
const ENGAGEMENT_TEAM = invert({
 "R. Chandra · Praveen D.": ["AUD-US-Dec312024", "AUD-SL-Mar312024", "COM-CON-Dec312024", "T2-AUT-Dec312023", "COM-PSP-Dec312023"],
 "R. Chandra · James Park": ["COM-QB-Dec312025", "COM-QB-Dec312024"],
 "R. Chandra": ["COM-CHE-Dec252024", "COM-OTH-Dec312024", "COM-CAS-Dec312024", "COM-QB-Jan142026", "COM-SHR-Dec302023"],
});

// Amol Patil's edited record, if there is one, is stored under the key of his built-in row.
const AMOL_KEY = `${SEED_PREFIX}${SEED_TEAM_MEMBERS.findIndex(m => m.name === "Amol Patil")}`;
const AMOL_PARTNER = "R. Chandra";

type StoredRecord = Record<string, unknown>;
const isRecord = (value: unknown): value is StoredRecord => typeof value === "object" && value !== null && !Array.isArray(value);

// Rewrites the JSON list stored under `storageKey`, replacing each record `update` returns a new version of (null =
// leave it). An absent key, one that is not a list, and a list nothing changes in are not written.
const patchStored = (storageKey: string, update: (record: StoredRecord) => StoredRecord | null) => {
 try {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return;
  const list: unknown = JSON.parse(raw);
  if (!Array.isArray(list)) return;
  let changed = false;
  const next = list.map(item => {
   const updated = isRecord(item) ? update(item) : null;
   if (updated) changed = true;
   return updated ?? item;
  });
  if (changed) localStorage.setItem(storageKey, JSON.stringify(next));
 } catch { /* unreadable or unwritable: leave it as it is */ }
};

export function applyDemoAssignmentsPatch(): void {
 try {
  if (localStorage.getItem(DONE_KEY)) return;

  patchStored(CLIENTS_KEY, client => {
   const partner = typeof client.id === "string" ? CLIENT_PARTNER.get(client.id) : undefined;
   return partner && client.engagementPartner !== partner ? { ...client, engagementPartner: partner } : null;
  });

  patchStored(ENG_KEY, engagement => {
   const team = typeof engagement.id === "string" ? ENGAGEMENT_TEAM.get(engagement.id) : undefined;
   return team && engagement.team !== team ? { ...engagement, team } : null;
  });

  patchStored(TEAM_MEMBERS_KEY, member => {
   if (member.key !== AMOL_KEY || (member.assignedPartner === AMOL_PARTNER && member.unassigned !== true)) return null;
   const updated: StoredRecord = { ...member, assignedPartner: AMOL_PARTNER };
   // The grid shows "Unassigned" whenever this flag is set, whatever the partner is
   if (updated.unassigned === true) delete updated.unassigned;
   return updated;
  });

  localStorage.setItem(DONE_KEY, "done");
 } catch { /* storage unavailable: nothing to patch */ }
}
