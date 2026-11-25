// Firm roles used when assigning engagement teams (Settings › Roles). Persisted in localStorage "firm-roles-v1".
import { useSyncExternalStore } from "react";

export interface Role {
  id: string;
  name: string;
  defaultRate: number;
  inRecommended: boolean;
  active: boolean;
  order: number;
}

export const ROLES_KEY = "firm-roles-v1";

const SEED: Role[] = [
  { id: "role-staff-auditor", name: "Staff Auditor", defaultRate: 150, inRecommended: true, active: true, order: 1 },
  { id: "role-senior-auditor", name: "Senior Auditor", defaultRate: 200, inRecommended: true, active: true, order: 2 },
  { id: "role-manager", name: "Manager", defaultRate: 275, inRecommended: true, active: true, order: 3 },
  { id: "role-partner", name: "Partner", defaultRate: 400, inRecommended: true, active: true, order: 4 },
  { id: "role-admin-staff", name: "Admin Staff", defaultRate: 90, inRecommended: false, active: true, order: 5 },
  { id: "role-qc-reviewer", name: "Quality Control Reviewer", defaultRate: 350, inRecommended: false, active: true, order: 6 },
];

const normalise = (list: Role[]): Role[] =>
  [...list].sort((a, b) => a.order - b.order).map((r, i) => ({ ...r, order: i + 1 }));

const read = (): Role[] => {
  try {
    const raw = localStorage.getItem(ROLES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length) {
      const ok = parsed.filter((r): r is Role => !!r && typeof r.id === "string" && typeof r.name === "string");
      if (ok.length) {
        return normalise(ok.map((r, i) => ({
          id: r.id, name: r.name,
          defaultRate: Number.isFinite(Number(r.defaultRate)) ? Number(r.defaultRate) : 0,
          inRecommended: !!r.inRecommended, active: r.active !== false,
          order: Number.isFinite(Number(r.order)) ? Number(r.order) : i + 1,
        })));
      }
    }
  } catch { /* fall through to the seed */ }
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

// Active roles in store order (what the Create Engagement Role dropdown lists).
export const getActiveRoles = (roleList: Role[] = roles) => roleList.filter(r => r.active);
// Active roles ticked "In Add Recommended", in store order.
export const getRecommendedRoles = (roleList: Role[] = roles) => roleList.filter(r => r.active && r.inRecommended);
export const formatRate = (rate: number) => rate.toFixed(2);

export const isRoleNameTaken = (name: string, exceptId?: string) =>
  roles.some(r => r.id !== exceptId && r.name.trim().toLowerCase() === name.trim().toLowerCase());

const insertAt = (list: Role[], role: Role, position: number) => {
  const next = list.filter(r => r.id !== role.id);
  next.splice(Math.max(0, Math.min(position - 1, next.length)), 0, role);
  return next.map((r, i) => ({ ...r, order: i + 1 }));
};

export const addRole = (input: { name: string; defaultRate: number; position?: number }) => {
  const role: Role = {
    id: `role-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: input.name.trim(), defaultRate: input.defaultRate, inRecommended: false, active: true, order: roles.length + 1,
  };
  commit(insertAt(roles, role, input.position ?? roles.length + 1));
};

export const updateRole = (id: string, patch: Partial<Pick<Role, "name" | "defaultRate" | "inRecommended" | "active">>, position?: number) => {
  let next = roles.map(r => r.id === id ? { ...r, ...patch, name: (patch.name ?? r.name).trim() } : r);
  const updated = next.find(r => r.id === id);
  if (updated && position != null) next = insertAt(next, updated, position);
  commit(next);
};

export const moveRole = (id: string, toPosition: number) => {
  const role = roles.find(r => r.id === id);
  if (role) commit(insertAt(roles, role, toPosition));
};

export const deleteRole = (id: string) => commit(roles.filter(r => r.id !== id));
