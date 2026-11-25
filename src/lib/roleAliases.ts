// Names the demo teams and saved worksheet data used before roles came from Settings › Roles → the store's role names.
const ROLE_ALIASES: Record<string, string> = {
  "engagement partner": "Partner",
  "eqcr (quality reviewer)": "Engagement Quality Reviewer",
  "eqcr": "Engagement Quality Reviewer",
  "quality reviewer": "Engagement Quality Reviewer",
};

export const canonicalRoleName = (role: string): string => ROLE_ALIASES[role.trim().toLowerCase()] ?? role;

const keyOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "_");

// Key a worksheet stores per team member; legacy and new role names give the same key.
export const memberKey = (role: string): string => keyOf(canonicalRoleName(role));

// Re-keys saved per-member data stored under a legacy role name (an entry already under the new key wins).
export function migrateMemberKeys<T>(record: Record<string, T> | undefined): Record<string, T> {
  const legacy = new Map(Object.keys(ROLE_ALIASES).map(a => [keyOf(a), memberKey(a)]));
  const out: Record<string, T> = {};
  Object.entries(record ?? {}).forEach(([k, v]) => {
    const nk = legacy.get(k) ?? k;
    if (nk === k || !(nk in (record ?? {}))) out[nk] = v;
  });
  return out;
}
