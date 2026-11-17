import { useEffect, useState } from "react";
import { Check, Info, Search, Trash2, type LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ReassignGroup, type ReassignOption } from "@/lib/teamAssignments";

const DEFAULT_WARNINGS = [
  "This user will lose all Luka history and interactions.",
  "Remaining credits will be dissolved and not reallocated.",
  "The change will be reflected in the next billing cycle.",
];

// Every item goes to a person, so there is no "Unassign" choice. A member's role shows beside the name in muted text.
const ReassignSelect = ({
  value, onChange, options, label, className = "w-44 shrink-0", error,
}: {
  value: string; onChange: (value: string) => void; options: ReassignOption[]; label: string; className?: string; error?: boolean;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={className} aria-label={label} error={error}>
      <SelectValue placeholder="Select member" />
    </SelectTrigger>
    <SelectContent>
      {options.map(o => (
        <SelectItem key={o.value} value={o.value}>
          {o.label}
          {o.role && <span className="text-muted-foreground"> · {o.role}</span>}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

// The reassign step always lists these three tabs, in this order, even when the member has nothing in one of them.
const TABS = [
  { id: "clients", title: "Clients" },
  { id: "team", title: "Team members" },
  { id: "engagements", title: "Engagements" },
];

const keyOf = (groupId: string, itemId: string) => `${groupId}:${itemId}`;
const matches = (label: string, query: string) => label.toLowerCase().includes(query);

interface DeleteTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Work still assigned to the member, by group; empty when there is nothing to reassign. A group with no items may be
   *  left out: the reassign step still shows its tab, empty. */
  groups: ReassignGroup[];
  /** The other team members an item can be handed to. */
  options: ReassignOption[];
  /** Called with a choice per item, keyed `${group.id}:${item.id}`. */
  onConfirm: (choices: Record<string, string>) => void;
  /** Wording and icon; each defaults to the Delete User text, so the dialog can be reused for other actions. */
  title?: string;
  question?: string;
  /** Warning lines. An empty list also leaves out "This action cannot be undone" and the closing question. */
  warnings?: string[];
  confirmLabel?: string;
  /** Title of the reassign step, shown when there is work to hand over. */
  reassignTitle?: string;
  icon?: LucideIcon;
}

export function DeleteTeamMemberDialog({
  open, onOpenChange, groups, options, onConfirm,
  title = "Delete User",
  question = "Are you sure you want to delete this User?",
  warnings = DEFAULT_WARNINGS,
  confirmLabel = "Delete",
  reassignTitle = "Reassign work before deleting",
  icon: Icon = Trash2,
}: DeleteTeamMemberDialogProps) {
  // With work to hand over the dialog has two steps (reassign, then confirm); without any it is just the confirm step.
  const [step, setStep] = useState<"reassign" | "confirm">("reassign");
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkMember, setBulkMember] = useState("");
  const [bulkError, setBulkError] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("");
  useEffect(() => {
    if (open) { setStep("reassign"); setChoices({}); setSelected(new Set()); setSearch(""); setTab(""); }
  }, [open]);
  // The member picked for the bulk bar, and the error about it, only last while rows are selected.
  useEffect(() => { if (selected.size === 0) { setBulkMember(""); setBulkError(false); } }, [selected]);

  const choiceKeys = groups.flatMap(g => g.items.map(i => keyOf(g.id, i.id)));
  const total = choiceKeys.length;
  const hasWork = total > 0;
  const assigned = choiceKeys.filter(k => !!choices[k]).length;
  const allAssigned = assigned === total;
  const reassigning = hasWork && step === "reassign";

  // A tab for each of the three groups: the one passed in, or an empty one. It opens on the first tab that has items.
  const tabGroups: ReassignGroup[] = TABS.map(t => groups.find(g => g.id === t.id) ?? { ...t, items: [] });
  const group = tabGroups.find(g => g.id === tab) ?? tabGroups.find(g => g.items.length > 0) ?? tabGroups[0];
  const currentTab = group.id;
  const query = search.trim().toLowerCase();
  const rows = group.items.filter(item => matches(item.label, query));
  const rowKeys = rows.map(item => keyOf(currentTab, item.id));
  const selectedShown = rowKeys.filter(k => selected.has(k)).length;
  const allShownSelected = rowKeys.length > 0 && selectedShown === rowKeys.length;
  const someShownSelected = selectedShown > 0 && !allShownSelected;

  const clearSelection = () => setSelected(new Set());
  const switchTab = (value: string) => { setTab(value); clearSelection(); };
  const toggleRow = (key: string, on: boolean) => setSelected(prev => {
    const next = new Set(prev);
    if (on) next.add(key); else next.delete(key);
    return next;
  });
  const toggleAllShown = (on: boolean) => setSelected(prev => {
    const next = new Set(prev);
    rowKeys.forEach(k => { if (on) next.add(k); else next.delete(k); });
    return next;
  });
  // Rows the new search hides are deselected, so the bulk bar only ever acts on rows you can see.
  const changeSearch = (value: string) => {
    setSearch(value);
    const shown = new Set(group.items.filter(item => matches(item.label, value.trim().toLowerCase())).map(item => keyOf(currentTab, item.id)));
    setSelected(prev => new Set(Array.from(prev).filter(k => shown.has(k))));
  };
  const applyBulk = () => {
    if (!bulkMember) { setBulkError(true); return; }
    setChoices(prev => ({ ...prev, ...Object.fromEntries(Array.from(selected).map(k => [k, bulkMember])) }));
    clearSelection();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${reassigning ? "sm:max-w-[min(1100px,90vw)] h-[90vh] max-h-[calc(100vh-2rem)]" : "sm:max-w-[400px] max-h-[90vh]"} flex flex-col border shadow-xl rounded-2xl sm:rounded-2xl p-6`}
      >
        {reassigning ? (
          <>
            {/* Step 1: reassign. Only the table body scrolls. */}
            <DialogHeader className="shrink-0 space-y-1 pr-8 text-left sm:text-left">
              <DialogTitle className="text-lg font-semibold text-foreground">{reassignTitle}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Everything must have an owner before you can continue.
              </DialogDescription>
            </DialogHeader>

            <Tabs value={currentTab} onValueChange={switchTab} className="flex flex-col flex-1 min-h-0 gap-3">
              <div className="flex items-center justify-between gap-3 shrink-0">
                <TabsList className="h-9">
                  {tabGroups.map(g => {
                    const done = g.items.length > 0 && g.items.every(item => !!choices[keyOf(g.id, item.id)]);
                    return (
                      <TabsTrigger key={g.id} value={g.id} className="gap-1.5 px-3 py-1">
                        <span className="truncate">{g.title} ({g.items.length})</span>
                        {done && (
                          <>
                            <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} aria-hidden="true" />
                            <span className="sr-only"> all set</span>
                          </>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    aria-label={`Search ${group.title.toLowerCase()}`}
                    value={search}
                    onChange={e => changeSearch(e.target.value)}
                    className="pl-9 w-64 h-9 text-sm"
                  />
                </div>
              </div>

              <TabsContent key={currentTab} value={currentTab} className="mt-0 flex flex-col flex-1 min-h-0 gap-3">
                {/* The bar's space is always reserved, so the rows do not jump down when the first one is ticked */}
                <div className="shrink-0 min-h-[54px]">
                  {selected.size > 0 && (
                    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/50 px-3 py-2">
                      <span className="text-sm font-semibold text-foreground">{selected.size} selected</span>
                      <span className="text-sm text-muted-foreground" aria-hidden="true">·</span>
                      <span className="text-sm text-foreground">Assign to</span>
                      <ReassignSelect
                        value={bulkMember}
                        onChange={value => { setBulkMember(value); setBulkError(false); }}
                        options={options}
                        label="Assign selected to"
                        className="w-64 shrink-0"
                        error={bulkError}
                      />
                      <Button onClick={applyBulk} className="h-9">Apply</Button>
                      {bulkError && <span role="alert" className="text-xs text-destructive">Select a member first</span>}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-border">
                  {/* Fixed column widths, so "Assigned to" stays put as the search narrows the rows and across tabs */}
                  <table className="w-full min-w-[800px] table-fixed">
                    <colgroup>
                      <col className="w-12" />
                      <col />
                      <col className="w-64" />
                      <col className="w-80" />
                    </colgroup>
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-muted border-b border-border">
                        <th className="px-4 py-3 text-left">
                          <Checkbox
                            checked={allShownSelected ? true : someShownSelected ? "indeterminate" : false}
                            indeterminate={someShownSelected}
                            disabled={rows.length === 0}
                            onCheckedChange={on => toggleAllShown(on === true)}
                            aria-label="Select all"
                          />
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Name</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Detail</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Assigned to</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rows.map(item => {
                        const key = keyOf(currentTab, item.id);
                        return (
                          <tr key={item.id} className={selected.has(key) ? "bg-primary/5" : "hover:bg-muted/50 transition-colors"}>
                            <td className="px-4 py-2">
                              <Checkbox
                                checked={selected.has(key)}
                                onCheckedChange={on => toggleRow(key, on === true)}
                                aria-label={`Select ${item.label}`}
                              />
                            </td>
                            <td className="px-4 py-2 text-sm text-foreground break-words">{item.label}</td>
                            <td className="px-4 py-2 text-sm text-muted-foreground truncate">{item.detail}</td>
                            <td className="px-4 py-2">
                              <ReassignSelect
                                value={choices[key] ?? ""}
                                onChange={value => setChoices(prev => ({ ...prev, [key]: value }))}
                                options={options}
                                label={`Reassign ${item.label}`}
                                className="w-72 shrink-0"
                              />
                            </td>
                          </tr>
                        );
                      })}
                      {rows.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                            {group.items.length === 0 ? `No ${group.title.toLowerCase()} assigned` : "No matches"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="shrink-0 flex flex-row items-center justify-between sm:justify-between sm:space-x-0 pt-2">
              <span className="text-sm text-muted-foreground" aria-live="polite">{assigned} of {total} assigned</span>
              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={() => onOpenChange(false)} className="h-10 px-6">
                  Cancel
                </Button>
                <Button disabled={!allAssigned} onClick={() => { clearSelection(); setStep("confirm"); }} className="h-10 px-6">
                  Continue
                </Button>
              </div>
            </DialogFooter>
          </>
        ) : (
          <>
            {/* Confirm step (the only step when there is nothing to reassign). Fixed top: icon, title, question */}
            <div className="flex flex-col items-center text-center gap-4 shrink-0">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <Icon className="h-7 w-7 text-destructive" />
              </div>

              <DialogHeader className="space-y-2 sm:text-center">
                <DialogTitle className="text-lg font-semibold text-foreground">{title}</DialogTitle>
                <DialogDescription className="text-sm text-foreground">
                  {question}
                </DialogDescription>
              </DialogHeader>

              {warnings.length > 0 && <p className="text-sm text-foreground">This action cannot be undone</p>}
            </div>

            {/* Body: the only part that scrolls, when the dialog is taller than the window */}
            <div className="flex flex-col items-center text-center gap-4 flex-1 min-h-0 overflow-y-auto -mx-6 px-6">
              {warnings.length > 0 && (
                <>
                  <div className="w-full rounded-xl border border-border text-left p-4 space-y-3">
                    {warnings.map(text => (
                      <div key={text} className="flex items-start gap-2">
                        <Info className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
                        <p className="text-sm text-foreground">{text}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground">Are you sure you want to delete this user?</p>
                </>
              )}
            </div>

            {/* Fixed bottom: Back (only after a reassign step) / Cancel / confirm */}
            <DialogFooter className="flex flex-row gap-3 w-full sm:justify-center sm:space-x-0 pt-2 shrink-0">
              {hasWork && (
                <Button variant="outline" onClick={() => setStep("reassign")} className="flex-1 h-10">
                  Back
                </Button>
              )}
              <Button variant="secondary" onClick={() => onOpenChange(false)} className="flex-1 h-10">
                Cancel
              </Button>
              <Button variant="destructive" disabled={!allAssigned} onClick={() => onConfirm(choices)} className="flex-1 h-10">
                {confirmLabel}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
