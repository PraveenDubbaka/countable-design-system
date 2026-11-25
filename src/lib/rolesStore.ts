// Firm roles used when assigning engagement teams (Settings › Roles). Persisted in localStorage "firm-roles-v1".
import { useSyncExternalStore } from "react";

export const ENGAGEMENT_TYPES = ["Audit", "Review", "Compilation", "T2"] as const;
export type EngagementType = (typeof ENGAGEMENT_TYPES)[number];
export const SIGNOFF_LEVELS = ["Preparer", "1st Reviewer", "2nd Reviewer", "Admin"] as const;
export type SignoffLevel = (typeof SIGNOFF_LEVELS)[number];

export interface Role {
  id: string;
  name: string;
  defaultRate: number;
  signoffLevel: SignoffLevel;
  appliesTo: EngagementType[];
  recommendedFor: EngagementType[];
  active: boolean;
  order: number;
}

export const ROLES_KEY = "firm-roles-v1";

const ALL: EngagementType[] = [...ENGAGEMENT_TYPES];
const mk = (id: string, name: string, defaultRate: number, signoffLevel: SignoffLevel, opts: { appliesTo?: EngagementType[]; recommendedFor?: EngagementType[] } = {}): Omit<Role, "order"> =>
  ({ id, name, defaultRate, signoffLevel, appliesTo: opts.appliesTo ?? [...ALL], recommendedFor: opts.recommendedFor ?? [], active: true });

// The four production roles first, then the firm titles.
const SEED: Role[] = ([
  mk("role-preparer", "Preparer", 150, "Preparer"),
  mk("role-1st-reviewer", "1st Reviewer", 275, "1st Reviewer"),
  mk("role-2nd-reviewer", "2nd Reviewer", 400, "2nd Reviewer"),
  mk("role-admin", "Admin", 90, "Admin"),
  mk("role-staff-auditor", "Staff Auditor", 150, "Preparer", { recommendedFor: [...ALL] }),
  mk("role-senior-auditor", "Senior Auditor", 200, "Preparer", { recommendedFor: [...ALL] }),
  mk("role-manager", "Manager", 275, "1st Reviewer", { recommendedFor: [...ALL] }),
  mk("role-eqr", "Engagement Quality Reviewer", 350, "2nd Reviewer", { appliesTo: ["Audit"] }),
  mk("role-partner", "Partner", 400, "2nd Reviewer", { recommendedFor: [...ALL] }),
  mk("role-admin-staff", "Admin Staff", 90, "Admin"),
  mk("role-qc-reviewer", "Quality Control Reviewer", 350, "2nd Reviewer"),
] as Omit<Role, "order">[]).map((r, i) => ({ ...r, order: i + 1 }));

const normalise = (list: Role[]): Role[] =>
  [...list].sort((a, b) => a.order - b.order).map((r, i) => ({ ...r, order: i + 1 }));

const types = (v: unknown): EngagementType[] =>
  Array.isArray(v) ? ENGAGEMENT_TYPES.filter(t => v.includes(t)) : [];

// Roles saved before sign-off levels existed: keep the firm's rate/active edits on roles that are still in the seed and
// keep user-added roles (Preparer level, all types); inRecommended true becomes all four types.
const migrate = (old: Record<string, unknown>[]): Role[] => {
  const recAll = (r: Record<string, unknown>) => (r.inRecommended ? [...ALL] : []);
  const out: Role[] = SEED.map(seed => {
    const prev = old.find(o => o.id === seed.id || String(o.name ?? "").trim().toLowerCase() === seed.name.toLowerCase());
    if (!prev) return seed;
    return {
      ...seed,
      defaultRate: Number.isFinite(Number(prev.defaultRate)) ? Number(prev.defaultRate) : seed.defaultRate,
      active: prev.active !== false,
      recommendedFor: seed.appliesTo.length === ALL.length || !prev.inRecommended ? recAll(prev) : seed.recommendedFor,
    };
  });
  old.forEach(o => {
    const name = String(o.name ?? "").trim();
    if (!name || out.some(r => r.id === o.id || r.name.toLowerCase() === name.toLowerCase())) return;
    out.push({
      id: String(o.id), name, defaultRate: Number.isFinite(Number(o.defaultRate)) ? Number(o.defaultRate) : 0,
      signoffLevel: "Preparer", appliesTo: [...ALL], recommendedFor: recAll(o), active: o.active !== false, order: out.length + 1,
    });
  });
  return out;
};

// One-time: the seed used to put Engagement Quality Reviewer last. If saved roles still follow that old seed order
// (the seeded roles in their previous relative order), move it directly above Partner; a user's own order is left alone.
const PREV_SEED_IDS = ["role-preparer", "role-1st-reviewer", "role-2nd-reviewer", "role-admin", "role-staff-auditor", "role-senior-auditor", "role-manager", "role-partner", "role-admin-staff", "role-qc-reviewer", "role-eqr"];
const ORDER_MIGRATED_KEY = "firm-roles-eqr-order-v1";

const migrateEqrOrder = (list: Role[]): Role[] => {
  try {
    if (localStorage.getItem(ORDER_MIGRATED_KEY)) return list;
    localStorage.setItem(ORDER_MIGRATED_KEY, "1");
  } catch { return list; }
  const seeded = list.filter(r => PREV_SEED_IDS.includes(r.id)).map(r => r.id);
  const untouched = seeded.length === PREV_SEED_IDS.length && seeded.every((id, i) => id === PREV_SEED_IDS[i]);
  const eqr = list.find(r => r.id === "role-eqr");
  const partner = list.find(r => r.id === "role-partner");
  if (!untouched || !eqr || !partner) return list;
  const without = list.filter(r => r.id !== "role-eqr");
  without.splice(without.findIndex(r => r.id === "role-partner"), 0, eqr);
  const moved = without.map((r, i) => ({ ...r, order: i + 1 }));
  try { localStorage.setItem(ROLES_KEY, JSON.stringify(moved)); } catch { /* not kept */ }
  return moved;
};

const read = (): Role[] => {
  try {
    const raw = localStorage.getItem(ROLES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length) {
      const ok = parsed.filter((r): r is Record<string, unknown> => !!r && typeof r.id === "string" && typeof r.name === "string");
      if (ok.length && ok.some(r => !("signoffLevel" in r))) { try { localStorage.setItem(ORDER_MIGRATED_KEY, "1"); } catch { /* ignore */ } return normalise(migrate(ok)); }
      if (ok.length) {
        return migrateEqrOrder(normalise(ok.map((r, i) => {
          const applies = types(r.appliesTo);
          return {
            id: String(r.id), name: String(r.name),
            defaultRate: Number.isFinite(Number(r.defaultRate)) ? Number(r.defaultRate) : 0,
            signoffLevel: (SIGNOFF_LEVELS as readonly string[]).includes(String(r.signoffLevel)) ? (r.signoffLevel as SignoffLevel) : "Preparer",
            appliesTo: applies,
            recommendedFor: types(r.recommendedFor).filter(t => applies.includes(t)),
            active: r.active !== false,
            order: Number.isFinite(Number(r.order)) ? Number(r.order) : i + 1,
          };
        })));
      }
    }
  } catch { /* fall through to the seed */ }
  try { localStorage.setItem(ORDER_MIGRATED_KEY, "1"); } catch { /* ignore */ }
  return normalise(SEED);
};

let roles: Role[] = read();
const listeners = new Set<() => void>();

const commit = (next: Role[]) => {
  roles = normalise(next);
  try { localStorage.setItem(ROLES_KEY, JSON.stringify(roles)); } catch { /* storage unavailable: not kept */ }
  listeners.forEach(fn => fn());
};

export const subscribeRoles = (fn: () => void) => {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => { if (e.key === ROLES_KEY) { roles = read(); fn(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(fn); window.removeEventListener("storage", onStorage); };
};

export const getRoles = (): Role[] => roles;
export const useRoles = (): Role[] => useSyncExternalStore(subscribeRoles, getRoles, getRoles);

// "Audit (AUD)" / "Review (REV)" / "Compilation (COM)" / "T2 (Corporations)" / "1120 …" → the type roles are configured by.
export const engagementTypeKey = (label: string | undefined | null): EngagementType | null => {
  const l = (label ?? "").toLowerCase();
  if (l.startsWith("audit")) return "Audit";
  if (l.startsWith("review")) return "Review";
  if (l.startsWith("compilation")) return "Compilation";
  if (l.startsWith("t2") || /^\d{4}/.test(l)) return "T2";
  return null;
};

// Active roles in store order; with a type, only those that apply to it.
export const getActiveRoles = (roleList: Role[] = roles, type?: EngagementType | null) =>
  roleList.filter(r => r.active && (!type || r.appliesTo.includes(type)));
// Active roles recommended for the type, in store order.
export const getRecommendedRoles = (roleList: Role[] = roles, type?: EngagementType | null) =>
  type ? roleList.filter(r => r.active && r.appliesTo.includes(type) && r.recommendedFor.includes(type)) : [];
// The role a team member holds (matched on name, active or not), for sign-off levels.
export const findRoleByName = (name: string, roleList: Role[] = roles) =>
  roleList.find(r => r.name.trim().toLowerCase() === name.trim().toLowerCase());
export const formatRate = (rate: number) => rate.toFixed(2);

export const isRoleNameTaken = (name: string, exceptId?: string) =>
  roles.some(r => r.id !== exceptId && r.name.trim().toLowerCase() === name.trim().toLowerCase());

const insertAt = (list: Role[], role: Role, position: number) => {
  const next = list.filter(r => r.id !== role.id);
  next.splice(Math.max(0, Math.min(position - 1, next.length)), 0, role);
  return next.map((r, i) => ({ ...r, order: i + 1 }));
};

export const addRole = (input: { name: string; defaultRate: number; position?: number; signoffLevel?: SignoffLevel; appliesTo?: EngagementType[]; recommendedFor?: EngagementType[] }) => {
  const applies = input.appliesTo ?? [...ALL];
  const role: Role = {
    id: `role-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: input.name.trim(), defaultRate: input.defaultRate, signoffLevel: input.signoffLevel ?? "Preparer",
    appliesTo: applies, recommendedFor: (input.recommendedFor ?? []).filter(t => applies.includes(t)),
    active: true, order: roles.length + 1,
  };
  commit(insertAt(roles, role, input.position ?? roles.length + 1));
};

export const updateRole = (id: string, patch: Partial<Pick<Role, "name" | "defaultRate" | "signoffLevel" | "appliesTo" | "recommendedFor" | "active">>, position?: number) => {
  let next = roles.map(r => {
    if (r.id !== id) return r;
    const merged = { ...r, ...patch, name: (patch.name ?? r.name).trim() };
    return { ...merged, recommendedFor: merged.recommendedFor.filter(t => merged.appliesTo.includes(t)) };
  });
  const updated = next.find(r => r.id === id);
  if (updated && position != null) next = insertAt(next, updated, position);
  commit(next);
};

export const moveRole = (id: string, toPosition: number) => {
  const role = roles.find(r => r.id === id);
  if (role) commit(insertAt(roles, role, toPosition));
};

export const deleteRole = (id: string) => commit(roles.filter(r => r.id !== id));

// Splits 100% across `count` recommended rows (given in store order, junior first): more for junior roles.
// The first four get 35/30/20/10, any further rows share the remaining 5, then everything is normalised to a whole-number total of 100.
export const splitAllocation = (count: number): number[] => {
  if (count <= 0) return [];
  const base = [35, 30, 20, 10];
  const extras = Math.max(0, count - base.length);
  const weights = Array.from({ length: count }, (_, i) => (i < base.length ? base[i] : 5 / extras));
  const total = weights.reduce((a, b) => a + b, 0);
  const exact = weights.map(w => (w / total) * 100);
  const floors = exact.map(Math.floor);
  let left = 100 - floors.reduce((a, b) => a + b, 0);
  exact.map((v, i) => ({ i, frac: v - floors[i] })).sort((a, b) => b.frac - a.frac).forEach(({ i }) => { if (left > 0) { floors[i] += 1; left -= 1; } });
  return floors;
};
