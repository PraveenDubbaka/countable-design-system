import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Share2, Monitor } from "lucide-react";
import { toast } from "sonner";

interface ShareWithClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checklistName?: string;
}

export function ShareWithClientDialog({
  open,
  onOpenChange,
  checklistName,
}: ShareWithClientDialogProps) {
  const [clientPortalSelected, setClientPortalSelected] = useState(false);

  const handleConfirm = () => {
    if (clientPortalSelected) {
      toast.success(`Checklist shared via Client Portal`);
    } else {
      toast.error("Please select a sharing method");
      return;
    }
    onOpenChange(false);
    setClientPortalSelected(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setClientPortalSelected(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Share2 className="h-5 w-5 text-primary" />
          </div>
          <DialogTitle className="text-lg font-semibold">
            Share With Client
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Share Via
          </p>
          <div className="space-y-2">
            <label
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                clientPortalSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <Checkbox
                checked={clientPortalSelected}
                onCheckedChange={(checked) =>
                  setClientPortalSelected(checked === true)
                }
              />
              <Monitor className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium">Client Portal</span>
            </label>
          </div>
        </div>

        <DialogFooter className="flex sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!clientPortalSelected}
            className="flex-1"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
