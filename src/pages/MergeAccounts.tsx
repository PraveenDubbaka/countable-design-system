import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { engagementsData } from "@/pages/TrialBalance";
import {
  getMergeGroupsForEngagement,
  pruneExpiredHistory,
  HISTORY_RETENTION_DAYS,
  type DuplicateGroup,
  type MergeDecision,
  type MergeHistoryEntry,
} from "@/data/mergeAccountsData";
import { CornerLeftUp, CornerDownLeft, Ban, Trash2, Info, Save, Undo2, AlertTriangle } from "lucide-react";

const RESOLVED_KEY = (engId: string) => `merge-accounts-resolved-${engId}`;
const HISTORY_KEY = (engId: string) => `merge-accounts-history-${engId}`;
const XERO_LOGO_URL = "https://upload.wikimedia.org/wikipedia/en/9/9f/Xero_software_logo.svg";

const fmt = (n: number) => {
  const v = n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n < 0 ? `(${v.replace("-", "")})` : v;
};

const formatResolvedAt = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

const decisionLabel = (entry: MergeHistoryEntry) => {
  switch (entry.decision) {
    case "up":
      return `Merged into ${entry.rows[0].accNo} — ${entry.rows[0].description}`;
    case "down":
      return `Merged into ${entry.rows[1].accNo} — ${entry.rows[1].description}`;
    case "ignore":
      return "Marked as not a duplicate — both accounts kept";
    case "delete": {
      const row = entry.rowIndex !== undefined ? entry.rows[entry.rowIndex] : undefined;
      return row ? `Deleted ${row.accNo} — ${row.description}` : "Deleted";
    }
  }
};

// A staged (not-yet-saved) decision for one duplicate group. "delete" is the
// only action scoped to a single row — up/down/ignore always act on the pair.
interface StagedDecision {
  action: MergeDecision;
  rowIndex?: 0 | 1;
}

// Shared by the pending list (staged decisions) and History (saved decisions):
// Merge Up/Down tints only the surviving row, Ignore tints both (both kept),
// Delete tints only the specific row that was removed — so a glance at either
// tab shows exactly what happened to each row.
function rowTintClass(action: MergeDecision | undefined, actionRowIndex: 0 | 1 | undefined, targetRow: 0 | 1): string {
  if (!action) return "bg-card";
  switch (action) {
    case "up":
      return targetRow === 0 ? "bg-[#12B76A]/10" : "bg-card";
    case "down":
      return targetRow === 1 ? "bg-[#12B76A]/10" : "bg-card";
    case "ignore":
      return "bg-[#12B76A]/10";
    case "delete":
      return actionRowIndex === targetRow ? "bg-destructive/10" : "bg-card";
    default:
      return "bg-card";
  }
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
  tone: "success" | "destructive";
}) {
  const toneClasses =
    tone === "success" ? "bg-[#12B76A] hover:bg-[#0e9c5a] text-white" : "bg-destructive hover:bg-destructive/90 text-destructive-foreground";
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

const colWidths = { acc: "w-16", desc: "flex-1 min-w-0", num: "w-20" };

export default function MergeAccounts() {
  const navigate = useNavigate();
  const { engagementId } = useParams();
  const engId = engagementId ?? "default";
  const engagement = engagementId ? engagementsData[engagementId] : undefined;

  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const [groups, setGroups] = useState<DuplicateGroup[]>(() => {
    const all = getMergeGroupsForEngagement(engagementId);
    const resolved = readJsonFromLocalStorage<string[]>(RESOLVED_KEY(engId), []);
    return all.filter((g) => !resolved.includes(g.id));
  });
  const [decisions, setDecisions] = useState<Record<string, StagedDecision>>({});
  const [history, setHistory] = useState<MergeHistoryEntry[]>(() => {
    const raw = readJsonFromLocalStorage<MergeHistoryEntry[]>(HISTORY_KEY(engId), []);
    const pruned = pruneExpiredHistory(raw);
    if (pruned.length !== raw.length) writeJsonToLocalStorage(HISTORY_KEY(engId), pruned);
    return pruned;
  });
  const [warningOpen, setWarningOpen] = useState(false);

  const decidedCount = Object.keys(decisions).length;

  // The row being dropped is the only one whose adjusting entries matter —
  // Merge Up drops rows[1], Merge Down drops rows[0], Delete drops whichever
  // row's own trash icon was clicked. The row that's kept is unaffected.
  const decide = (groupId: string, action: MergeDecision, rowIndex?: 0 | 1) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    const droppedRow =
      action === "up" ? group.rows[1] : action === "down" ? group.rows[0] : action === "delete" ? group.rows[rowIndex!] : undefined;
    if (droppedRow && droppedRow.adj !== 0) {
      setWarningOpen(true);
      return;
    }

    setDecisions((prev) => ({ ...prev, [groupId]: { action, rowIndex } }));
  };

  const goToTrialBalance = () => navigate(`/engagements/${engagementId}/trial-balance`);

  const handleSave = () => {
    const resolvedIds = Object.keys(decisions);
    if (resolvedIds.length === 0) return;

    const resolvedAt = new Date().toISOString();
    const newEntries: MergeHistoryEntry[] = resolvedIds.map((id) => {
      const group = groups.find((g) => g.id === id)!;
      const staged = decisions[id];
      return { groupId: id, decision: staged.action, rowIndex: staged.rowIndex, rows: group.rows, resolvedAt };
    });

    const prevResolved = readJsonFromLocalStorage<string[]>(RESOLVED_KEY(engId), []);
    writeJsonToLocalStorage(RESOLVED_KEY(engId), [...prevResolved, ...resolvedIds]);

    const prevHistory = pruneExpiredHistory(readJsonFromLocalStorage<MergeHistoryEntry[]>(HISTORY_KEY(engId), []));
    const nextHistory = [...newEntries, ...prevHistory];
    writeJsonToLocalStorage(HISTORY_KEY(engId), nextHistory);
    setHistory(nextHistory);

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
    setActiveTab("history");
  };

  const handleRevert = (groupId: string) => {
    const entry = history.find((h) => h.groupId === groupId);
    if (!entry) return;

    const nextHistory = history.filter((h) => h.groupId !== groupId);
    setHistory(nextHistory);
    writeJsonToLocalStorage(HISTORY_KEY(engId), nextHistory);

    const prevResolved = readJsonFromLocalStorage<string[]>(RESOLVED_KEY(engId), []);
    writeJsonToLocalStorage(
      RESOLVED_KEY(engId),
      prevResolved.filter((id) => id !== groupId)
    );

    setGroups((prev) => [...prev, { id: entry.groupId, rows: entry.rows }]);
    toast.success("Reverted — account restored to Matching Duplicates");
    setActiveTab("pending");
  };

  const yearEndLabel = engagement?.yearEnd ?? "Dec 31, 2024";

  return (
    <Layout title="Engagements" hideSidebar>
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Engagement sub-header */}
        <div className="w-full bg-primary text-primary-foreground px-6 py-2.5 flex items-center justify-between text-sm">
          <span className="font-semibold font-mono">{engagementId ?? "Unknown"}</span>
          <span>Year End Date: {yearEndLabel}</span>
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-wrap gap-3">
          <h1 className="text-xl font-semibold text-foreground">Merge accounts</h1>
          <div className="flex items-center gap-3">
            {activeTab === "pending" && decidedCount > 0 && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-[#12B76A]">
                <Save className="h-4 w-4" />
                Accounts selected to merge: {decidedCount} of {groups.length}
              </span>
            )}
            <Button variant="outline" onClick={goToTrialBalance}>
              Cancel
            </Button>
            {activeTab === "pending" && (
              <Button disabled={decidedCount === 0} onClick={handleSave} className="gap-1.5">
                <Save className="h-4 w-4" />
                Save
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pending" | "history")} className="px-6 pb-6">
          <TabsList>
            <TabsTrigger value="pending" className="gap-1.5">
              Matching Duplicates
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  These accounts appear more than once in your trial balance. Choose which record to keep, or mark as
                  not a duplicate.
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Pending duplicates */}
          <TabsContent value="pending" className="pt-4 flex flex-col gap-4">
            {groups.length === 0 && (
              <div className="text-sm text-muted-foreground px-2 py-8 text-center">
                No matching duplicates remaining.
              </div>
            )}
            {groups.map((group) => {
              const decision = decisions[group.id];
              const disableDown = group.rows[0].source === "xero";
              const rowTint = (rowIndex: 0 | 1) => rowTintClass(decision?.action, decision?.rowIndex, rowIndex);
              // Merge is only possible when at least one row is the "stub" left
              // over from a split import — signaled by an Original of 0. Two rows
              // that both carry a real non-zero Original (equal or not) can't be
              // auto-merged and need a support ticket instead.
              const requiresSupportTicket = group.rows[0].original !== 0 && group.rows[1].original !== 0;

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
                    <div className="w-[168px] text-right pr-1">Actions</div>
                  </div>

                  {/* Rows + actions */}
                  <div className="flex items-stretch">
                    <div className="flex-1 min-w-0">
                      {group.rows.map((row, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                            i === 0 ? "border-b border-border/60" : "rounded-bl-lg"
                          } ${rowTint(i as 0 | 1)}`}
                        >
                          <div className={`${colWidths.acc} font-semibold text-foreground`}>{row.accNo}</div>
                          <div className={`${colWidths.desc} flex items-center gap-2 text-link truncate`}>
                            <span className="truncate">{row.description}</span>
                            {row.source === "xero" && <XeroSourceBadge />}
                          </div>
                          <div className={`${colWidths.num} text-foreground`}>{fmt(row.original)}</div>
                          <div className={`${colWidths.num} text-foreground`}>{fmt(row.adj)}</div>
                          <div className={`${colWidths.num} text-foreground`}>{fmt(row.final)}</div>
                          <div className={`${colWidths.num} text-foreground`}>{fmt(row.py1)}</div>
                          <div className={`${colWidths.num} text-foreground`}>{fmt(row.py2)}</div>
                        </div>
                      ))}
                    </div>

                    {/* Actions column — background split to match each row's tint;
                        the buttons float centered on top spanning both halves. */}
                    <div className="w-[168px] relative rounded-br-lg overflow-hidden">
                      <div className="absolute inset-0 flex flex-col">
                        <div className={`flex-1 transition-colors ${rowTint(0)}`} />
                        <div className={`flex-1 border-t border-border/60 transition-colors ${rowTint(1)}`} />
                      </div>
                      <div className="relative flex items-stretch h-full">
                        <div className="flex-1 flex items-center gap-1.5 pl-2">
                          <MergeActionButton
                            tone="success"
                            icon={<CornerLeftUp className="h-4 w-4" />}
                            label="Merge Up"
                            selected={decision?.action === "up"}
                            disabled={requiresSupportTicket}
                            onClick={() => decide(group.id, "up")}
                          />
                          <MergeActionButton
                            tone="success"
                            icon={<CornerDownLeft className="h-4 w-4" />}
                            label="Merge Down"
                            selected={decision?.action === "down"}
                            disabled={disableDown || requiresSupportTicket}
                            onClick={() => decide(group.id, "down")}
                          />
                          <MergeActionButton
                            tone="destructive"
                            icon={<Ban className="h-4 w-4" />}
                            label="Ignore"
                            selected={decision?.action === "ignore"}
                            disabled={requiresSupportTicket}
                            onClick={() => decide(group.id, "ignore")}
                          />
                        </div>
                        <div className="w-9 flex flex-col justify-around items-center py-1 pr-3">
                          <button
                            type="button"
                            aria-label="Delete this account"
                            aria-pressed={decision?.action === "delete" && decision.rowIndex === 0}
                            disabled={requiresSupportTicket}
                            onClick={() => decide(group.id, "delete", 0)}
                            className={`text-destructive hover:text-destructive/80 rounded disabled:opacity-40 disabled:pointer-events-none ${
                              decision?.action === "delete" && decision.rowIndex === 0 ? "ring-2 ring-destructive" : ""
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete this account"
                            aria-pressed={decision?.action === "delete" && decision.rowIndex === 1}
                            disabled={requiresSupportTicket}
                            onClick={() => decide(group.id, "delete", 1)}
                            className={`text-destructive hover:text-destructive/80 rounded disabled:opacity-40 disabled:pointer-events-none ${
                              decision?.action === "delete" && decision.rowIndex === 1 ? "ring-2 ring-destructive" : ""
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {requiresSupportTicket && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-b-lg bg-amber-50 border-t border-amber-200 text-xs text-amber-800">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                      Please raise a support ticket to fix the merge issue for these accounts.
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>

          {/* History */}
          <TabsContent value="history" className="pt-4 flex flex-col gap-4">
            <div className="px-4 py-2.5 rounded-md bg-muted/60 text-xs text-muted-foreground flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 shrink-0" />
              History is available for {HISTORY_RETENTION_DAYS} days from the date of the save action.
            </div>

            {history.length === 0 && (
              <div className="text-sm text-muted-foreground px-2 py-8 text-center">No merge history yet.</div>
            )}
            {history.map((entry) => (
              <div key={entry.groupId} className="rounded-lg border border-border overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-4 py-2 bg-muted/60 text-xs font-medium text-muted-foreground">
                  <span>
                    {decisionLabel(entry)} · {formatResolvedAt(entry.resolvedAt)}
                  </span>
                  <Button size="sm" variant="outline" className="h-7 gap-1.5" onClick={() => handleRevert(entry.groupId)}>
                    <Undo2 className="h-3.5 w-3.5" />
                    Revert
                  </Button>
                </div>
                <div>
                  {entry.rows.map((row, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-4 px-4 py-3 text-muted-foreground transition-colors ${
                        i === 0 ? "border-b border-border/60" : ""
                      } ${rowTintClass(entry.decision, entry.rowIndex, i as 0 | 1)}`}
                    >
                      <div className={`${colWidths.acc} font-semibold`}>{row.accNo}</div>
                      <div className={`${colWidths.desc} flex items-center gap-2 truncate`}>
                        <span className="truncate">{row.description}</span>
                        {row.source === "xero" && <XeroSourceBadge />}
                      </div>
                      <div className={colWidths.num}>{fmt(row.original)}</div>
                      <div className={colWidths.num}>{fmt(row.adj)}</div>
                      <div className={colWidths.num}>{fmt(row.final)}</div>
                      <div className={colWidths.num}>{fmt(row.py1)}</div>
                      <div className={colWidths.num}>{fmt(row.py2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={warningOpen} onOpenChange={setWarningOpen}>
        <AlertDialogContent className="max-w-[400px] rounded-xl">
          <AlertDialogHeader className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <MergeConflictIcon className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-base font-semibold">Merge Warning</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
              This action cannot be performed as there are adjusting entries in the row which will be deleted.
              <br />
              <br />
              Please remove the adjusting entry and then perform the merge action
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="w-full" onClick={() => setWarningOpen(false)}>
              Ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
