import { useEffect, useState } from "react";
import { Check, Info, Trash2, type LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UNASSIGN, type ReassignGroup, type ReassignOption } from "@/lib/teamAssignments";

const DEFAULT_WARNINGS = [
  "This user will lose all Luka history and interactions.",
  "Remaining credits will be dissolved and not reallocated.",
  "The change will be reflected in the next billing cycle.",
];

const ReassignSelect = ({
  value, onChange, options, label,
}: {
  value: string; onChange: (value: string) => void; options: ReassignOption[]; label: string;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-44 shrink-0" aria-label={label}>
      <SelectValue placeholder="Select member" />
    </SelectTrigger>
    <SelectContent>
      {options.map(o => (
        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
      ))}
      <SelectItem value={UNASSIGN}>Unassign</SelectItem>
    </SelectContent>
  </Select>
);

interface DeleteTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Work still assigned to the member, by group; empty when there is nothing to reassign. */
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
  /** Heading of the reassign section, shown when there is work to hand over. */
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
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [tab, setTab] = useState("");
  useEffect(() => { if (open) { setChoices({}); setTab(""); } }, [open]);

  const choiceKeys = groups.flatMap(g => g.items.map(i => `${g.id}:${i.id}`));
  const hasWork = choiceKeys.length > 0;
  const canDelete = choiceKeys.every(k => !!choices[k]);
  // "Transfer all to" shows a member only while every item is set to that same member.
  const first = choices[choiceKeys[0]];
  const transferAllValue = first && choiceKeys.every(k => choices[k] === first) ? first : "";
  const currentTab = groups.some(g => g.id === tab) ? tab : groups[0]?.id;
  // Height the rest of the dialog needs besides the tab panel, plus the 1rem margins above and below it (and a few px
  // to spare). On a short window the panel gives way (and scrolls) before the dialog would have to.
  const panelReserve = warnings.length > 0 ? 618 : 436;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${hasWork ? "sm:max-w-[560px] max-h-[calc(100vh-2rem)]" : "sm:max-w-[400px] max-h-[90vh]"} flex flex-col border shadow-xl rounded-2xl sm:rounded-2xl p-6`}
      >
        {/* Fixed top: icon, title, question */}
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
        <div className={`flex flex-col items-center text-center ${hasWork ? "gap-3" : "gap-4"} flex-1 min-h-0 overflow-y-auto -mx-6 px-6`}>
          {hasWork && (
            <div className="w-full rounded-xl border border-border p-3 text-left space-y-2">
              <p className="text-sm font-semibold text-foreground">{reassignTitle}</p>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-foreground">Transfer all to</span>
                <ReassignSelect
                  value={transferAllValue}
                  onChange={value => setChoices(Object.fromEntries(choiceKeys.map(k => [k, value])))}
                  options={options}
                  label="Transfer all to"
                />
              </div>
              <Tabs value={currentTab} onValueChange={setTab}>
                <TabsList className="w-full h-9">
                  {groups.map(group => {
                    const done = group.items.every(item => !!choices[`${group.id}:${item.id}`]);
                    return (
                      <TabsTrigger key={group.id} value={group.id} className="flex-auto min-w-0 gap-1.5 px-2 py-1">
                        <span className="truncate">{group.title} ({group.items.length})</span>
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
                {groups.map(group => (
                  <TabsContent
                    key={group.id}
                    value={group.id}
                    className="mt-2 -mx-1 px-1 min-h-[96px] overflow-y-auto"
                    style={{ maxHeight: `clamp(96px, calc(100vh - ${panelReserve}px), 200px)` }}
                  >
                    {group.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-4 py-1.5">
                        <div className="min-w-0">
                          <p className="text-sm text-foreground break-words">{item.label}</p>
                          {item.detail && <p className="text-xs text-muted-foreground break-words">{item.detail}</p>}
                        </div>
                        <ReassignSelect
                          value={choices[`${group.id}:${item.id}`] ?? ""}
                          onChange={value => setChoices(prev => ({ ...prev, [`${group.id}:${item.id}`]: value }))}
                          options={options}
                          label={`Reassign ${item.label}`}
                        />
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}

          {warnings.length > 0 && (
            <>
              <div className={`w-full rounded-xl border border-border text-left ${hasWork ? "p-3 space-y-2" : "p-4 space-y-3"}`}>
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

        {/* Fixed bottom: Cancel / confirm */}
        <DialogFooter className="flex flex-row gap-3 w-full sm:justify-center sm:space-x-0 pt-2 shrink-0">
          <Button variant="secondary" onClick={() => onOpenChange(false)} className="flex-1 h-10">
            Cancel
          </Button>
          <Button variant="destructive" disabled={!canDelete} onClick={() => onConfirm(choices)} className="flex-1 h-10">
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
