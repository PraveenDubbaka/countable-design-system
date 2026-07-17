import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2, ChevronDown, ChevronRight, Clock, PenLine, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RichTextToolbar } from "@/components/RichTextToolbar";
import { cn } from "@/lib/utils";
import type { Checklist } from "@/types/checklist";
import { useEngagementContext } from "@/hooks/useEngagementContext";

// ── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_TITLE = "Conclusion";

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
  title?: string;
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
        title: parsed.title,
      };
    }
  } catch { /* fallback */ }
  return { entries: [], extraRows: [] };
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xfffffff;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* noop */ }
  }, [data, key]);

  // Initialise editor content and focus when editing starts
  useEffect(() => {
    if (!isEditingTitle || !editorRef.current) return;
    editorRef.current.innerHTML = data.title ?? DEFAULT_TITLE;
    editorRef.current.focus();
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, [isEditingTitle]);

  // Commit on click outside (skip clicks inside the toolbar)
  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    if (editorRef.current?.contains(target)) return;
    if (toolbarRef.current?.contains(target)) return;
    if (target.closest('[data-radix-menu-content]')) return;
    if (target.closest('[data-rich-text-toolbar]')) return;
    commitTitle();
  }, []);

  useEffect(() => {
    if (!isEditingTitle) return;
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditingTitle, handleClickOutside]);

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

  function commitTitle() {
    const html = editorRef.current?.innerHTML ?? '';
    const t = html.trim() || DEFAULT_TITLE;
    setData(d => ({ ...d, title: t === DEFAULT_TITLE ? undefined : t }));
    setIsEditingTitle(false);
  }

  function handleTitleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setIsEditingTitle(false); }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); commitTitle(); }
  }

  function handleFormatAction(action: string, value?: string) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    switch (action) {
      case 'bold':          document.execCommand('bold', false); break;
      case 'italic':        document.execCommand('italic', false); break;
      case 'underline':     document.execCommand('underline', false); break;
      case 'bulletList':    document.execCommand('insertUnorderedList', false); break;
      case 'numberedList':  document.execCommand('insertOrderedList', false); break;
      case 'alignLeft':     document.execCommand('justifyLeft', false); break;
      case 'alignCenter':   document.execCommand('justifyCenter', false); break;
      case 'alignRight':    document.execCommand('justifyRight', false); break;
      case 'undo':          document.execCommand('undo', false); break;
      case 'redo':          document.execCommand('redo', false); break;
      case 'textStyle':     if (value) document.execCommand('formatBlock', false, value); break;
    }
  }

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
  const canEditTitle = !locked;
  const hasExtraRows = data.extraRows.length > 0;
  const currentTitle = data.title ?? DEFAULT_TITLE;

  return (
    <div
      className="dv-section group/section relative rounded-[8px] border-[0.5px] transition-colors mt-2"
      style={{ borderColor: "var(--dv-separator)" }}
    >
      {/* Section header */}
      <div
        className={cn(
          "dv-section-header flex items-center gap-2 pl-[38px] pr-4 relative border-b",
          isEditingTitle ? "py-2 flex-col items-start" : "py-0"
        )}
        style={{
          borderColor: "var(--dv-separator)",
          ...(isEditingTitle ? {} : { height: "48px", minHeight: "48px" }),
        }}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setIsExpanded(v => !v)}
          className={cn(
            "dv-collapse-btn p-0.5 rounded hover:bg-muted transition-colors z-10",
            isEditingTitle ? "self-start mt-0.5 relative" : "absolute left-4 top-1/2 -translate-y-1/2"
          )}
          style={isEditingTitle ? {} : { left: "1rem" }}
        >
          {isExpanded
            ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
            : <ChevronRight className="h-4 w-4 text-muted-foreground" />
          }
        </button>

        {/* Rich text title editor */}
        {isEditingTitle && canEditTitle ? (
          <div className="flex flex-col w-full gap-1 pl-6">
            <RichTextToolbar
              inline
              toolbarRef={toolbarRef}
              onFormatAction={handleFormatAction}
            />
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleTitleKeyDown}
              className="dv-section-title text-sm font-semibold text-category-title outline-none border border-border rounded px-2 py-0.5 min-h-[1.75rem] bg-transparent"
            />
          </div>
        ) : (
          <h3
            onClick={() => { if (canEditTitle) setIsEditingTitle(true); }}
            className={cn(
              "dv-section-title text-sm font-semibold text-category-title flex-1 pl-[6px]",
              canEditTitle ? "cursor-text" : ""
            )}
            dangerouslySetInnerHTML={{ __html: currentTitle }}
          />
        )}
      </div>

      {/* Body — sign-off rows */}
      {isExpanded && (
        <div>

          {ROLES.map((role, idx) => {
            const entry = data.entries.find(e => e.roleId === role.id);
            const isSigned = !!entry;
            const displayName = isSigned ? entry.signedBy : assigned[role.id];
            const hasAssignee = displayName && displayName !== "—";
            const initials = hasAssignee ? getInitials(displayName) : "?";
            const avatarColorClass = hasAssignee
              ? getAvatarColor(displayName)
              : "bg-muted text-muted-foreground";
            const isLast = idx === ROLES.length - 1 && !hasExtraRows;

            return (
              <div
                key={role.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3",
                  !isLast && "border-b",
                  isSigned ? "bg-green-50/60 dark:bg-green-950/20" : ""
                )}
                style={{ borderColor: "var(--dv-separator)" }}
              >
                {/* Status icon */}
                <div className="shrink-0 w-4 flex items-center justify-center">
                  {isSigned
                    ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                    : <Clock className="h-4 w-4 text-muted-foreground/40" />
                  }
                </div>

                {/* Role label */}
                <span className="w-36 shrink-0 text-xs text-muted-foreground">
                  {role.label}
                </span>

                {/* Avatar + name */}
                <div className="flex-1 flex items-center gap-2.5 min-w-0">
                  <span className={cn(
                    "inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-semibold shrink-0",
                    avatarColorClass
                  )}>
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {hasAssignee ? displayName : "Unassigned"}
                    </p>
                    {isSigned && (
                      <p className="text-xs text-muted-foreground">{formatDate(entry.signedAt)}</p>
                    )}
                  </div>
                </div>

                {/* Action */}
                {isEngagementMode && !locked && (
                  <div className="shrink-0">
                    {isSigned ? (
                      <Button size="sm" variant="destructive" className="h-7 px-3 text-xs"
                        onClick={() => unsignRole(role.id)}>
                        Unsign
                      </Button>
                    ) : assigned[role.id] !== "—" ? (
                      <Button size="sm" className="h-7 px-3 text-xs gap-1.5"
                        onClick={() => signRole(role.id)}>
                        <PenLine className="h-3 w-3" />
                        Sign Off
                      </Button>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}

          {/* Extra rows */}
          {data.extraRows.map((row) => {
            const role = ROLES.find(r => r.id === row.roleId)!;
            const isSigned = !!row.signedAt;
            const displayName = isSigned ? (row.signedBy ?? "") : assigned[row.roleId];
            const hasAssignee = displayName && displayName !== "—";
            const initials = hasAssignee ? getInitials(displayName) : "?";
            const avatarColorClass = hasAssignee
              ? getAvatarColor(displayName)
              : "bg-muted text-muted-foreground";

            return (
              <div
                key={row.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 border-t",
                  isSigned ? "bg-green-50/60 dark:bg-green-950/20" : ""
                )}
                style={{ borderColor: "var(--dv-separator)" }}
              >
                <div className="shrink-0 w-4 flex items-center justify-center">
                  {isSigned
                    ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                    : <Clock className="h-4 w-4 text-muted-foreground/40" />
                  }
                </div>

                <span className="w-36 shrink-0 text-xs text-muted-foreground">
                  {role.label}
                </span>

                <div className="flex-1 flex items-center gap-2.5 min-w-0">
                  <span className={cn(
                    "inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-semibold shrink-0",
                    avatarColorClass
                  )}>
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {hasAssignee ? displayName : "Unassigned"}
                    </p>
                    {isSigned && row.signedAt && (
                      <p className="text-xs text-muted-foreground">{formatDate(row.signedAt)}</p>
                    )}
                  </div>
                </div>

                {isEngagementMode && !locked && (
                  <div className="shrink-0 flex items-center gap-2">
                    {isSigned ? (
                      <Button size="sm" variant="destructive" className="h-7 px-3 text-xs"
                        onClick={() => unsignExtraRow(row.id)}>
                        Unsign
                      </Button>
                    ) : assigned[row.roleId] !== "—" ? (
                      <Button size="sm" className="h-7 px-3 text-xs gap-1.5"
                        onClick={() => signExtraRow(row.id, row.roleId)}>
                        <PenLine className="h-3 w-3" />
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
            );
          })}

        </div>
      )}
    </div>
  );
}
