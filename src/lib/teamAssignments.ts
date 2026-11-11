import { loadClients, saveClients } from "@/data/clientsData";
import { saveMemberRecord, type TeamMemberRow } from "@/data/teamMembersData";
import type { EngagementRecord } from "@/store/engagementsStore";

// Shared by the Teams page (Delete User) and Settings (Remove Access): find the work a person still owns, matched on
// their exact name, and hand it over to someone else.

// Choice that leaves an item with nobody; every other choice is the key of a team member.
export const UNASSIGN = "__unassign__";

export type ReassignItem = { id: string; label: string; detail?: string };
export type ReassignGroup = { id: string; title: string; items: ReassignItem[] };
export type ReassignOption = { value: string; label: string };

// Whose work it is: the exact name to match, their category (partners also own the team members assigned to them) and
// a key, so a team member is never listed as owning their own assignment.
export type WorkOwner = Pick<TeamMemberRow, "key" | "name" | "category">;

// Engagement teams read "A · B · C"; "View Assignees" is the placeholder when nobody is listed.
const teamNames = (team: string) => (team === "View Assignees" ? [] : team.split(/\s*[·,]\s*/).filter(Boolean));

// What still belongs to `owner`, matched on the exact name: clients it is engagement partner of, team members it is
// assigned partner of (partners only) and engagements it is on the team of.
export const findAssignedWork = (owner: WorkOwner, rows: TeamMemberRow[], engagements: EngagementRecord[]): ReassignGroup[] => {
 const clients = loadClients().filter(c => c.engagementPartner === owner.name);
 const staff = owner.category === "Partner" ? rows.filter(m => m.key !== owner.key && m.assignedPartner === owner.name) : [];
 const onTeam = engagements.filter(e => teamNames(e.team).includes(owner.name));
 return [
  { id: "clients", title: "Clients", items: clients.map(c => ({ id: c.id, label: c.entityName, detail: c.id })) },
  { id: "team", title: "Team members", items: staff.map(m => ({ id: m.key, label: m.name, detail: m.category })) },
  { id: "engagements", title: "Engagements", items: onTeam.map(e => ({ id: e.id, label: e.client, detail: e.id })) },
 ].filter(group => group.items.length > 0);
};

// Hands every item to the member picked for it in `choices` (keyed `${group.id}:${item.id}`, a team member key or
// UNASSIGN to leave it with nobody). `rows` are the team members the choices refer to.
export const applyReassignments = ({ ownerName, groups, choices, rows, engagements, updateEngagement }: {
 ownerName: string;
 groups: ReassignGroup[];
 choices: Record<string, string>;
 rows: TeamMemberRow[];
 engagements: EngagementRecord[];
 updateEngagement: (id: string, updates: Partial<EngagementRecord>) => void;
}) => {
 const chosen = (groupId: string, itemId: string) => {
  const value = choices[`${groupId}:${itemId}`];
  return value === UNASSIGN ? null : rows.find(m => m.key === value)?.name ?? null;
 };
 groups.forEach(group => {
  if (group.id === "clients") {
   const partners = new Map(group.items.map(item => [item.id, chosen(group.id, item.id)]));
   saveClients(loadClients().map(c => (partners.has(c.id) ? { ...c, engagementPartner: partners.get(c.id) ?? "" } : c)));
  } else if (group.id === "team") {
   group.items.forEach(item => {
    const row = rows.find(m => m.key === item.id);
    const partner = chosen(group.id, item.id);
    if (row) saveMemberRecord({ ...row, assignedPartner: partner ?? "Unassigned", unassigned: partner === null ? true : undefined });
   });
  } else {
   group.items.forEach(item => {
    const engagement = engagements.find(e => e.id === item.id);
    if (!engagement) return;
    const partner = chosen(group.id, item.id);
    const names = teamNames(engagement.team).flatMap(n => (n !== ownerName ? [n] : partner ? [partner] : []));
    updateEngagement(engagement.id, { team: Array.from(new Set(names)).join(" · ") || "View Assignees" });
   });
  }
 });
};
