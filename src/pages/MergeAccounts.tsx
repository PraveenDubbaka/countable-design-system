import { useState } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { engagementsData } from "@/data/engagementsData";
import { getMergeGroupsForEngagement, type DuplicateGroup, type MergeDecision } from "@/data/mergeAccountsData";
import { CornerDownLeft, EyeOff, Trash2, Info, Save, AlertTriangle, Undo2 } from "lucide-react";

const RESOLVED_KEY = (engId: string) => `merge-accounts-resolved-${engId}`;
const XERO_LOGO_URL = "https://upload.wikimedia.org/wikipedia/en/9/9f/Xero_software_logo.svg";

const fmt = (n: number) => {
  const v = n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n < 0 ? `(${v.replace("-", "")})` : v;
};

// A staged (not-yet-saved) decision for one duplicate group. "delete" is the
// only action scoped to a single row — up/down/ignore always act on the pair.
interface StagedDecision {
  action: MergeDecision;
  rowIndex?: 0 | 1;
}

// Ignore tints both rows (both kept), Delete tints only the specific row
// that was removed — a glance at the pending list shows exactly what a
// staged decision will do. Merge (up/down) doesn't use this: those collapse
// the pair into a single combined row instead of tinting two rows.
function rowTintClass(action: MergeDecision | undefined, actionRowIndex: 0 | 1 | undefined, targetRow: 0 | 1): string {
  switch (action) {
    case "ignore":
      return "bg-muted/60";
    case "delete":
      return actionRowIndex === targetRow ? "bg-muted/60" : "bg-card";
    default:
      return "bg-card";
  }
}

// Same style everywhere it appears — the combined row after a merge, the
// deleted row after a delete, and both rows after an ignore all use this
// one button to un-stage that decision before Save.
function RevertButton({ onClick }: { onClick: () => void }) {
  return (
    <Button size="sm" variant="outline" className="h-7 gap-1.5 shrink-0" onClick={onClick}>
      <Undo2 className="h-3.5 w-3.5" />
      Revert
    </Button>
  );
}

function XeroSourceBadge() {
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border border-border overflow-hidden shrink-0"
      title="Synced from Xero"
    >
      <img src={XERO_LOGO_URL} alt="Xero" className="w-6 h-6 object-cover scale-150" />
    </span>
  );
}

// Icon-only by default, expands to reveal its label on hover — matches the AC:
// "when the user hovers over a particular button the button will get expanded
// in size and the specific action performed by the button will be displayed."
// Unlike the toolbar's ExpandableIconButton (which only compacts below a 1368px
// viewport breakpoint), this one is always compact — there's no room for three
// permanently-labeled buttons inside a table row.
function MergeActionButton({
  icon,
  label,
  onClick,
  disabled,
  selected,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
  tone: "success" | "warning" | "destructive";
}) {
  const toneClasses =
    tone === "success"
      ? "bg-[#12B76A] hover:bg-[#0e9c5a] text-white"
      : tone === "warning"
        ? "bg-amber-500 hover:bg-amber-600 text-white"
        : "bg-destructive hover:bg-destructive/90 text-destructive-foreground";
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={`group/action h-9 shrink-0 rounded-md flex items-center justify-center px-2 hover:px-3 gap-0 hover:gap-1.5 overflow-hidden transition-[padding,gap] duration-150 ease-in-out ${toneClasses} ${
        selected ? "ring-2 ring-offset-2 ring-offset-background ring-foreground/60 shadow-[inset_0_2px_3px_rgba(0,0,0,0.35)]" : ""
      } disabled:opacity-40 disabled:pointer-events-none disabled:ring-0 disabled:shadow-none`}
    >
      <span className="shrink-0 flex items-center justify-center">{icon}</span>
      <span className="grid grid-cols-[0fr] group-hover/action:grid-cols-[1fr] transition-[grid-template-columns,opacity] duration-150 ease-in-out">
        <span className="overflow-hidden whitespace-nowrap text-[11px] font-semibold opacity-0 group-hover/action:opacity-100 transition-opacity duration-150 ease-in-out">
          {label}
        </span>
      </span>
    </button>
  );
}

function MergeUpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.50016 3.33331L3.3335 7.49998L7.50016 11.6666M3.3335 7.49998H8.66683C11.4671 7.49998 12.8672 7.49998 13.9368 8.04495C14.8776 8.52431 15.6425 9.28922 16.1219 10.23C16.6668 11.2996 16.6668 12.6997 16.6668 15.5V16.6666"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MergeConflictIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 8H7a1 1 0 0 0-1 1v2M6 15v2a1 1 0 0 0 1 1h2M9 12h2l-1.5 2M15 8h2a1 1 0 0 1 1 1v2M18 15v2a1 1 0 0 1-1 1h-2M15 12h-2l1.5-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// actions is fixed so the header and every row reserve identical space —
// otherwise the flex-1 Description column resolves to a different width on
// each (the header's plain "Actions" label is narrower than a row's button
// toolbar), throwing every column after it out of alignment. The width is
// sized to fit a fully hover-expanded button (icon + label) plus the other
// two buttons compact, so the reveal never overlaps or shifts neighboring cells.
const colWidths = { acc: "w-16", desc: "flex-1 min-w-0", num: "w-20 text-right", actions: "w-[200px]" };

interface MergeAccountsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  engagementId?: string;
}

export default function MergeAccounts({ open, onOpenChange, engagementId }: MergeAccountsProps) {
  const engId = engagementId ?? "default";
  const engagement = engagementId ? engagementsData[engagementId] : undefined;

  const [groups, setGroups] = useState<DuplicateGroup[]>(() => {
    const all = getMergeGroupsForEngagement(engagementId);
    const resolved = readJsonFromLocalStorage<string[]>(RESOLVED_KEY(engId), []);
    return all.filter((g) => !resolved.includes(g.id));
  });
  const [decisions, setDecisions] = useState<Record<string, StagedDecision>>({});
  const [warningOpen, setWarningOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const decidedCount = Object.keys(decisions).length;

  // Cancel discards any staged (not-yet-saved) decisions — confirm first so a
  // stray click can't silently lose in-progress work on the pending list.
  const handleCancelClick = () => {
    if (decidedCount > 0) {
      setCancelConfirmOpen(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleConfirmDiscard = () => {
    setDecisions({});
    setCancelConfirmOpen(false);
    onOpenChange(false);
  };

  // Only a merge (up/down) needs the adjusting-entries guard — merging drops
  // a whole row, so if that dropped row carries an adjusting entry, warn
  // first. Delete doesn't trigger this: deleting a row with an adjusting
  // entry is allowed outright.
  const decide = (groupId: string, action: MergeDecision, rowIndex?: 0 | 1) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    if (action === "up" || action === "down") {
      const droppedRow = action === "up" ? group.rows[1] : group.rows[0];
      if (droppedRow.adj !== 0) {
        setWarningOpen(true);
        return;
      }
    }

    setDecisions((prev) => ({ ...prev, [groupId]: { action, rowIndex } }));
  };

  // Un-stages a decision before Save — the pair goes back to its normal,
  // undecided two-row view with all hover actions available again.
  const handleRevertDecision = (groupId: string) => {
    setDecisions((prev) => {
      const next = { ...prev };
      delete next[groupId];
      return next;
    });
  };

  const handleSave = () => {
    const resolvedIds = Object.keys(decisions);
    if (resolvedIds.length === 0) return;

    const prevResolved = readJsonFromLocalStorage<string[]>(RESOLVED_KEY(engId), []);
    writeJsonToLocalStorage(RESOLVED_KEY(engId), [...prevResolved, ...resolvedIds]);

    setGroups((prev) => prev.filter((g) => !resolvedIds.includes(g.id)));
    setDecisions({});

    // AC-specified copy applies only when an actual merge happened — CPT-17271
    // flagged the real app showing this same message for a pure Ignore+Save,
    // which is exactly the bug we don't want to reproduce here.
    const mergedCount = resolvedIds.filter((id) => decisions[id].action === "up" || decisions[id].action === "down").length;
    const otherCount = resolvedIds.length - mergedCount;
    if (mergedCount > 0 && otherCount === 0) {
      toast.success("Trial Balance duplicate accounts merged successfully.");
    } else if (mergedCount > 0) {
      toast.success(`${mergedCount} account${mergedCount === 1 ? "" : "s"} merged, ${otherCount} updated.`);
    } else {
      toast.success(`${otherCount} record${otherCount === 1 ? "" : "s"} updated.`);
    }
  };

  const yearEndLabel = engagement?.yearEnd ?? "Dec 31, 2024";

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          // Route every dismiss path (Escape, overlay click, the built-in ×)
          // through the same discard guard as the Cancel button — otherwise
          // they'd silently drop staged decisions the button now protects.
          if (!next) handleCancelClick();
          else onOpenChange(next);
        }}
      >
        <DialogContent className="p-0 gap-0 max-w-6xl w-[95vw] max-h-[88vh] overflow-hidden flex flex-col rounded-lg">
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Engagement sub-header */}
        <div className="w-full bg-primary text-primary-foreground px-6 py-2.5 flex items-center justify-between text-sm">
          <span className="font-semibold font-mono">{engagementId ?? "Unknown"}</span>
          <span>Year End Date: {yearEndLabel}</span>
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-wrap gap-3">
          <DialogTitle asChild>
            <h1 className="text-xl font-semibold text-foreground">Resolve duplicate accounts</h1>
          </DialogTitle>
          <div className="flex items-center gap-3">
            {decidedCount > 0 && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-[#12B76A]">
                <Save className="h-4 w-4" />
                Accounts selected to resolve: {decidedCount} of {groups.length}
              </span>
            )}
            <Button variant="outline" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button disabled={decidedCount === 0} onClick={handleSave} className="gap-1.5">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1">
            Duplicates
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                These accounts appear more than once in your trial balance. Choose which record to keep, or mark as
                not a duplicate.
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="pt-3 flex flex-col gap-4">
            {groups.length === 0 && (
              <div className="text-sm text-muted-foreground px-2 py-8 text-center">
                No matching duplicates remaining.
              </div>
            )}
            {groups.map((group) => {
              const decision = decisions[group.id];
              const rowTint = (rowIndex: 0 | 1) => rowTintClass(decision?.action, decision?.rowIndex, rowIndex);
              // Merge is only possible when at least one row is the "stub" left
              // over from a split import — signaled by an Original of 0. Two rows
              // that both carry a real non-zero Original can never be auto-merged
              // (there's no safe stub to discard), whether or not the two Originals
              // agree — no support ticket needed either way, per today's discussion:
              // Delete/Ignore stay available with no warning banner regardless.
              const bothOriginalsNonZero = group.rows[0].original !== 0 && group.rows[1].original !== 0;
              const originalsMatch = group.rows[0].original === group.rows[1].original;
              const mergeBlocked = bothOriginalsNonZero;
              // Purely a visual flag — highlights the Original cells when they
              // genuinely conflict, so it's easy to spot before choosing Delete.
              const originalsConflict = bothOriginalsNonZero && !originalsMatch;

              // A staged merge collapses the pair into one preview row instead
              // of tinting two — destination keeps its identity, and each
              // numeric column sums both rows (safe because a merge can only
              // be staged when the dropped row's ADJ is 0, so ADJ carries
              // over unchanged either way).
              const mergedRow =
                decision?.action === "up" || decision?.action === "down"
                  ? (() => {
                      const destination = decision.action === "up" ? group.rows[0] : group.rows[1];
                      const dropped = decision.action === "up" ? group.rows[1] : group.rows[0];
                      return {
                        accNo: destination.accNo,
                        description: destination.description,
                        source: destination.source,
                        original: destination.original + dropped.original,
                        adj: destination.adj + dropped.adj,
                        final: destination.final + dropped.final,
                        py1: destination.py1 + dropped.py1,
                        py2: destination.py2 + dropped.py2,
                      };
                    })()
                  : null;

              return (
                <div key={group.id} className="rounded-lg border border-border">
                  {/* Column header */}
                  <div className="flex items-center gap-4 px-4 py-2 rounded-t-lg bg-muted/60 text-xs font-medium text-muted-foreground">
                    <div className={colWidths.acc}>Acc No.</div>
                    <div className={colWidths.desc}>Description</div>
                    <div className={colWidths.num}>Original</div>
                    <div className={colWidths.num}>ADJ</div>
                    <div className={colWidths.num}>Final</div>
                    <div className={colWidths.num}>PY1</div>
                    <div className={colWidths.num}>PY2</div>
                    <div className={`${colWidths.actions} text-right pr-1`}>Actions</div>
                  </div>

                  {mergedRow ? (
                    // Merge preview — the two rows above collapse into this one.
                    <div className="flex items-center gap-4 px-4 py-3 rounded-b-lg bg-[#12B76A]/10">
                      <div className={`${colWidths.acc} font-semibold text-foreground`}>{mergedRow.accNo}</div>
                      <div className={`${colWidths.desc} flex items-center gap-2 text-link truncate`}>
                        <span className="truncate">{mergedRow.description}</span>
                        {mergedRow.source === "xero" && <XeroSourceBadge />}
                      </div>
                      <div className={`${colWidths.num} text-foreground`}>{fmt(mergedRow.original)}</div>
                      <div className={`${colWidths.num} text-foreground`}>{fmt(mergedRow.adj)}</div>
                      <div className={`${colWidths.num} text-foreground`}>{fmt(mergedRow.final)}</div>
                      <div className={`${colWidths.num} text-foreground`}>{fmt(mergedRow.py1)}</div>
                      <div className={`${colWidths.num} text-foreground`}>{fmt(mergedRow.py2)}</div>
                      <div className={`${colWidths.actions} shrink-0 flex items-center justify-end`}>
                        <RevertButton onClick={() => handleRevertDecision(group.id)} />
                      </div>
                    </div>
                  ) : (
                    /* Rows — each row carries its own inline action toolbar, revealed
                       on hover/focus so it doesn't compete with the data at rest.
                       Once Delete/Ignore is staged, the toolbar is replaced by an
                       always-visible Revert button. */
                    group.rows.map((row, i) => {
                      const rowIndex = i as 0 | 1;
                      const isTop = rowIndex === 0;
                      const isDeletedRow = decision?.action === "delete" && decision.rowIndex === rowIndex;
                      const isIgnoredRow = decision?.action === "ignore";
                      const isGrayedOut = isDeletedRow || isIgnoredRow;
                      // A row synced from a connected source (e.g. Xero) is the
                      // source of truth — it can only ever be the merge target,
                      // never touched itself, so it gets no actions at all.
                      const isSourceProtected = row.source === "xero";
                      const strike = isDeletedRow ? "line-through" : "";

                      return (
                        <div
                          key={i}
                          className={`group/row flex items-center gap-4 px-4 py-3 transition-colors ${
                            isTop ? "border-b border-border/60" : "rounded-b-lg"
                          } ${rowTint(rowIndex)}`}
                        >
                          <div className={`${colWidths.acc} font-semibold ${strike} ${isGrayedOut ? "text-foreground/50" : "text-foreground"}`}>
                            {row.accNo}
                          </div>
                          <div className={`${colWidths.desc} flex items-center gap-2 truncate ${strike} ${isGrayedOut ? "text-foreground/50" : "text-link"}`}>
                            <span className="truncate">{row.description}</span>
                            {row.source === "xero" && <XeroSourceBadge />}
                          </div>
                          <div
                            className={`${colWidths.num} ${strike} ${
                              isGrayedOut ? "text-foreground/50" : originalsConflict ? "font-semibold text-amber-700" : "text-foreground"
                            }`}
                          >
                            {fmt(row.original)}
                          </div>
                          <div
                            className={`${colWidths.num} ${strike} ${
                              isGrayedOut ? "text-foreground/50" : row.adj !== 0 ? "font-semibold text-amber-700" : "text-foreground"
                            }`}
                          >
                            {fmt(row.adj)}
                          </div>
                          <div className={`${colWidths.num} ${strike} ${isGrayedOut ? "text-foreground/50" : "text-foreground"}`}>{fmt(row.final)}</div>
                          <div className={`${colWidths.num} ${strike} ${isGrayedOut ? "text-foreground/50" : "text-foreground"}`}>{fmt(row.py1)}</div>
                          <div className={`${colWidths.num} ${strike} ${isGrayedOut ? "text-foreground/50" : "text-foreground"}`}>{fmt(row.py2)}</div>

                          <div
                            className={`${colWidths.actions} shrink-0 flex items-center justify-end gap-1.5 transition-opacity ${
                              decision ? "" : "opacity-0 group-hover/row:opacity-100 focus-within:opacity-100"
                            }`}
                          >
                            {isDeletedRow && (
                              <>
                                <span className="text-xs font-medium text-foreground/50">Deleted</span>
                                <RevertButton onClick={() => handleRevertDecision(group.id)} />
                              </>
                            )}
                            {isIgnoredRow && <RevertButton onClick={() => handleRevertDecision(group.id)} />}
                            {!decision && !isSourceProtected && (
                              <>
                                {isTop ? (
                                  <MergeActionButton
                                    tone="success"
                                    icon={<CornerDownLeft className="h-4 w-4" />}
                                    label="Merge Down"
                                    disabled={mergeBlocked}
                                    onClick={() => decide(group.id, "down")}
                                  />
                                ) : (
                                  <MergeActionButton
                                    tone="success"
                                    icon={<MergeUpIcon className="h-4 w-4" />}
                                    label="Merge Up"
                                    disabled={mergeBlocked}
                                    onClick={() => decide(group.id, "up")}
                                  />
                                )}
                                <MergeActionButton
                                  tone="destructive"
                                  icon={<Trash2 className="h-4 w-4" />}
                                  label="Delete"
                                  onClick={() => decide(group.id, "delete", rowIndex)}
                                />
                                <MergeActionButton
                                  tone="warning"
                                  icon={<EyeOff className="h-4 w-4" />}
                                  label="Ignore"
                                  onClick={() => decide(group.id, "ignore")}
                                />
                              </>
                            )}
                            {/* Renders no buttons at all: the surviving row in a Delete
                                decision, or any source-protected (e.g. Xero) row. */}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={warningOpen} onOpenChange={setWarningOpen}>
        <AlertDialogContent className="max-w-[400px] rounded-xl">
          <AlertDialogHeader className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <MergeConflictIcon className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-base font-semibold">Merge Warning</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
              This account has adjusting entries.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="w-full" onClick={() => setWarningOpen(false)}>
              Ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
        <AlertDialogContent className="max-w-[400px] rounded-xl">
          <AlertDialogHeader className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <AlertDialogTitle className="text-base font-semibold">
              Discard {decidedCount} unsaved change{decidedCount === 1 ? "" : "s"}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
              You've made decisions on {decidedCount} duplicate{decidedCount === 1 ? "" : "s"} that haven't been
              saved. Closing now will discard {decidedCount === 1 ? "it" : "them"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCancelConfirmOpen(false)}>Keep editing</AlertDialogCancel>
            <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={handleConfirmDiscard}>
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
