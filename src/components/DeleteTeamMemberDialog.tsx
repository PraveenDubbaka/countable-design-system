import { useEffect, useState } from "react";
import { Info, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Choice that leaves an item with nobody; every other choice is the key of a team member.
export const UNASSIGN = "__unassign__";

export type ReassignItem = { id: string; label: string; detail?: string };
export type ReassignGroup = { id: string; title: string; items: ReassignItem[] };
export type ReassignOption = { value: string; label: string };

const WARNINGS = [
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
}

export function DeleteTeamMemberDialog({ open, onOpenChange, groups, options, onConfirm }: DeleteTeamMemberDialogProps) {
  const [choices, setChoices] = useState<Record<string, string>>({});
  useEffect(() => { if (open) setChoices({}); }, [open]);

  const choiceKeys = groups.flatMap(g => g.items.map(i => `${g.id}:${i.id}`));
  const hasWork = choiceKeys.length > 0;
  const canDelete = choiceKeys.every(k => !!choices[k]);
  // "Transfer all to" shows a member only while every item is set to that same member.
  const first = choices[choiceKeys[0]];
  const transferAllValue = first && choiceKeys.every(k => choices[k] === first) ? first : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${hasWork ? "sm:max-w-[520px]" : "sm:max-w-[400px]"} border shadow-xl rounded-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex flex-col items-center text-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <Trash2 className="h-7 w-7 text-destructive" />
          </div>

          <DialogHeader className="space-y-2 sm:text-center">
            <DialogTitle className="text-lg font-semibold text-foreground">Delete User</DialogTitle>
            <DialogDescription className="text-sm text-foreground">
              Are you sure you want to delete this User?
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-foreground">This action cannot be undone</p>

          {hasWork && (
            <div className="w-full rounded-xl border border-border p-4 text-left space-y-3">
              <p className="text-sm font-semibold text-foreground">Reassign work before deleting</p>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-foreground">Transfer all to</span>
                <ReassignSelect
                  value={transferAllValue}
                  onChange={value => setChoices(Object.fromEntries(choiceKeys.map(k => [k, value])))}
                  options={options}
                  label="Transfer all to"
                />
              </div>
              <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                {groups.map(group => (
                  <div key={group.id}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      {group.title} ({group.items.length})
                    </p>
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
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="w-full rounded-xl border border-border p-4 text-left space-y-3">
            {WARNINGS.map(text => (
              <div key={text} className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
                <p className="text-sm text-foreground">{text}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">Are you sure you want to delete this user?</p>

          <DialogFooter className="flex flex-row gap-3 w-full sm:justify-center sm:space-x-0 pt-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)} className="flex-1 h-10">
              Cancel
            </Button>
            <Button variant="destructive" disabled={!canDelete} onClick={() => onConfirm(choices)} className="flex-1 h-10">
              Delete
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
