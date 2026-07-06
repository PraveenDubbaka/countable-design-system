import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Checklist } from "@/types/checklist";
import { useEngagementContext } from "@/hooks/useEngagementContext";

// ── Constants ────────────────────────────────────────────────────────────────

const DISCLAIMER =
  "By signing off below, you are confirming that you have reviewed this working paper, cleared all outstanding queries, and appropriately documented any matters that could otherwise cause the financial statements and note disclosures to be false and/or misleading.";

// Fixed four-role sequence — order is immutable
const ROLES = [
  { id: "preparer",           label: "Preparer",             teamRoles: ["Staff Auditor", "Senior Auditor", "Junior Auditor"] },
  { id: "partner",            label: "Partner",              teamRoles: ["Engagement Partner", "Partner"] },
  { id: "quality-reviewer",   label: "Quality Reviewer",     teamRoles: ["EQCR (Quality Reviewer)", "Quality Reviewer", "EQCR"] },
  { id: "admin-tax-reviewer", label: "Admin / Tax Reviewer", teamRoles: ["Manager", "Tax Manager", "Senior Manager", "Admin"] },
] as const;

type RoleId = typeof ROLES[number]["id"];

// ── Types ────────────────────────────────────────────────────────────────────

type SignEntry = {
  roleId: RoleId;
  signedBy: string;   // captured permanently at sign time
  initials: string;
  signedAt: string;   // ISO timestamp — never modified after creation
};

type SignOffData = {
  entries: SignEntry[];
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const storageKey = (id: string) => `checklist-signoff-v2:${id}`;

function getInitials(name: string): string {
  return name
    .replace(/,.*$/, "")        // strip ", CPA" etc.
    .split(" ")
    .filter(Boolean)
    .map(w => w[0].toUpperCase())
    .join("");
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

function loadData(id: string): SignOffData {
  try {
    const raw = localStorage.getItem(storageKey(id));
    if (raw) return JSON.parse(raw) as SignOffData;
  } catch { /* fallback */ }
  return { entries: [] };
}

// ── Component ────────────────────────────────────────────────────────────────

export function ChecklistSignOff({
  checklist,
  isPreviewMode = false,
  isEngagementMode = false,
}: {
  checklist: Checklist;
  isPreviewMode?: boolean;
  isEngagementMode?: boolean;
  numberingFormat?: string;
  showNumbering?: boolean;
}) {
  const ctx = useEngagementContext();
  const key = useMemo(() => storageKey(checklist.id), [checklist.id]);

  const [data, setData] = useState<SignOffData>(() => loadData(checklist.id));

  // Persist on change
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* noop */ }
  }, [data, key]);

  // Derive assigned name from current engagement team for each role
  const assigned = useMemo<Record<RoleId, string>>(() => {
    const result = {} as Record<RoleId, string>;
    for (const role of ROLES) {
      const match = ctx.team?.find(m =>
        role.teamRoles.some(tr => m.role.toLowerCase().includes(tr.toLowerCase()))
      );
      result[role.id] = match?.name ?? "—";
    }
    return result;
  }, [ctx.team]);

  function signRole(roleId: RoleId) {
    const name = assigned[roleId];
    if (!name || name === "—") return;
    const entry: SignEntry = {
      roleId,
      signedBy: name,
      initials: getInitials(name),
      signedAt: new Date().toISOString(),
    };
    // Retention: never remove existing entries — append/replace only this role
    setData(d => ({
      entries: [
        ...d.entries.filter(e => e.roleId !== roleId),
        entry,
      ],
    }));
  }

  function unsignRole(roleId: RoleId) {
    setData(d => ({ entries: d.entries.filter(e => e.roleId !== roleId) }));
  }

  const locked = isPreviewMode && !isEngagementMode;

  return (
    <div className="space-y-3 px-4 py-4">

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground leading-relaxed">{DISCLAIMER}</p>

      {/* Fixed-sequence sign-off rows */}
      <div className="rounded-lg border border-border overflow-hidden">
        {ROLES.map((role, idx) => {
          const entry = data.entries.find(e => e.roleId === role.id);
          const name = assigned[role.id];
          const isSigned = !!entry;
          const isLast = idx === ROLES.length - 1;

          return (
            <div
              key={role.id}
              className={`flex items-center gap-4 px-4 py-3 ${!isLast ? "border-b border-border" : ""} ${isSigned ? "bg-green-50/60 dark:bg-green-950/20" : "bg-card"}`}
            >
              {/* Status icon */}
              <div className="w-5 shrink-0 flex items-center justify-center">
                {isSigned
                  ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                  : <Clock className="h-4 w-4 text-muted-foreground/50" />
                }
              </div>

              {/* Role label */}
              <div className="w-40 shrink-0">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  {role.label}
                </span>
              </div>

              {/* Assigned name */}
              <div className="w-44 shrink-0">
                <span className={`text-sm ${isSigned ? "text-muted-foreground" : "text-foreground"}`}>
                  {name}
                </span>
              </div>

              {/* Signed stamp OR action */}
              <div className="flex-1 flex items-center justify-between min-w-0">
                {isSigned ? (
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-bold shrink-0">
                      {entry.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{entry.signedBy}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(entry.signedAt)}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">Pending signature</span>
                )}

                {/* Action — only shown in engagement mode */}
                {isEngagementMode && !locked && (
                  <div className="ml-4 shrink-0">
                    {isSigned ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 px-3 text-xs"
                        onClick={() => unsignRole(role.id)}
                      >
                        Unsign
                      </Button>
                    ) : name !== "—" ? (
                      <Button size="sm" className="h-7 px-3 text-xs" onClick={() => signRole(role.id)}>
                        Sign Off
                      </Button>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
