import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Checklist } from "@/types/checklist";
import { useEngagementContext } from "@/hooks/useEngagementContext";

// ── Constants ────────────────────────────────────────────────────────────────

const DISCLAIMER =
  "By signing off below, you are confirming that you have reviewed this working paper, cleared all outstanding queries, and appropriately documented any matters that could otherwise cause the financial statements and note disclosures to be false and/or misleading.";

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
  signedBy: string;
  initials: string;
  signedAt: string;
};

type ExtraRow = {
  id: string;
  roleId: RoleId;
  signedBy?: string;
  initials?: string;
  signedAt?: string;
};

type SignOffData = {
  entries: SignEntry[];
  extraRows: ExtraRow[];
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const storageKey = (id: string) => `checklist-signoff-v2:${id}`;

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function getInitials(name: string): string {
  return name
    .replace(/,.*$/, "")
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
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SignOffData>;
      return {
        entries: parsed.entries ?? [],
        extraRows: parsed.extraRows ?? [],
      };
    }
  } catch { /* fallback */ }
  return { entries: [], extraRows: [] };
}

// ── Shared row shell ─────────────────────────────────────────────────────────

function RowShell({
  isSigned,
  hasBorderBottom,
  children,
}: {
  isSigned: boolean;
  hasBorderBottom: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "flex items-center gap-4 px-4 py-3",
        hasBorderBottom ? "border-b border-border" : "",
        isSigned ? "bg-green-50/60 dark:bg-green-950/20" : "bg-card",
      ].join(" ")}
    >
      {children}
    </div>
  );
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

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* noop */ }
  }, [data, key]);

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
    setData(d => ({
      ...d,
      entries: [...d.entries.filter(e => e.roleId !== roleId), entry],
    }));
  }

  function unsignRole(roleId: RoleId) {
    setData(d => ({ ...d, entries: d.entries.filter(e => e.roleId !== roleId) }));
  }

  function addExtraRow(roleId: RoleId) {
    setData(d => ({ ...d, extraRows: [...d.extraRows, { id: uid(), roleId }] }));
  }

  function removeExtraRow(rowId: string) {
    setData(d => ({ ...d, extraRows: d.extraRows.filter(r => r.id !== rowId) }));
  }

  function signExtraRow(rowId: string, roleId: RoleId) {
    const name = assigned[roleId];
    if (!name || name === "—") return;
    setData(d => ({
      ...d,
      extraRows: d.extraRows.map(r =>
        r.id === rowId
          ? { ...r, signedBy: name, initials: getInitials(name), signedAt: new Date().toISOString() }
          : r
      ),
    }));
  }

  function unsignExtraRow(rowId: string) {
    setData(d => ({
      ...d,
      extraRows: d.extraRows.map(r =>
        r.id === rowId ? { id: r.id, roleId: r.roleId } : r
      ),
    }));
  }

  const locked = isPreviewMode && !isEngagementMode;
  const hasExtraRows = data.extraRows.length > 0;
  const showAddRow = isEngagementMode && !locked;

  return (
    <div className="space-y-3 px-4 py-4">

      <p className="text-xs text-muted-foreground leading-relaxed">{DISCLAIMER}</p>

      <div className="rounded-lg border border-border overflow-hidden">

        {/* Fixed four-role rows */}
        {ROLES.map((role, idx) => {
          const entry = data.entries.find(e => e.roleId === role.id);
          const isSigned = !!entry;
          const isLast = idx === ROLES.length - 1 && !hasExtraRows && !showAddRow;

          return (
            <RowShell key={role.id} isSigned={isSigned} hasBorderBottom={!isLast}>
              {/* Status icon */}
              <div className="w-5 shrink-0 flex items-center justify-center">
                {isSigned
                  ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                  : <Clock className="h-4 w-4 text-muted-foreground/50" />
                }
              </div>

              {/* Role label */}
              <div className="w-44 shrink-0">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  {role.label}
                </span>
              </div>

              {/* Signed stamp OR pending */}
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
                    ) : assigned[role.id] !== "—" ? (
                      <Button size="sm" className="h-7 px-3 text-xs" onClick={() => signRole(role.id)}>
                        Sign Off
                      </Button>
                    ) : null}
                  </div>
                )}
              </div>
            </RowShell>
          );
        })}

        {/* Extra rows */}
        {data.extraRows.map((row, idx) => {
          const role = ROLES.find(r => r.id === row.roleId)!;
          const isSigned = !!row.signedAt;
          const isLast = idx === data.extraRows.length - 1 && !showAddRow;

          return (
            <RowShell key={row.id} isSigned={isSigned} hasBorderBottom={!isLast}>
              <div className="w-5 shrink-0 flex items-center justify-center">
                {isSigned
                  ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                  : <Clock className="h-4 w-4 text-muted-foreground/50" />
                }
              </div>

              <div className="w-44 shrink-0">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  {role.label}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-between min-w-0">
                {isSigned ? (
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-bold shrink-0">
                      {row.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{row.signedBy}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(row.signedAt!)}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">Pending signature</span>
                )}

                {isEngagementMode && !locked && (
                  <div className="ml-4 shrink-0 flex items-center gap-2">
                    {isSigned ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 px-3 text-xs"
                        onClick={() => unsignExtraRow(row.id)}
                      >
                        Unsign
                      </Button>
                    ) : assigned[row.roleId] !== "—" ? (
                      <Button size="sm" className="h-7 px-3 text-xs" onClick={() => signExtraRow(row.id, row.roleId)}>
                        Sign Off
                      </Button>
                    ) : null}
                    <button
                      onClick={() => removeExtraRow(row.id)}
                      className="text-muted-foreground/40 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </RowShell>
          );
        })}

        {/* Add row — lives inside the table border */}
        {showAddRow && (
          <div className="flex items-center justify-center border-t border-border px-4 py-2.5 bg-card">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-7 w-7 p-0 rounded border border-border text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {ROLES.map(role => (
                  <DropdownMenuItem key={role.id} onClick={() => addExtraRow(role.id)}>
                    {role.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
