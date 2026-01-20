import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, Trash2 } from 'lucide-react';

interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onDiscard: () => void;
}

export function UnsavedChangesDialog({ 
  open, 
  onOpenChange, 
  onSave,
  onDiscard
}: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Unsaved Changes</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            You have unsaved changes. Would you like to save them before leaving?
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-wrap gap-2 pt-4 justify-end">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="shrink-0"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={() => {
              onDiscard();
              onOpenChange(false);
            }}
            className="shrink-0 gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Discard
          </Button>
          <Button 
            onClick={() => {
              onSave();
              onOpenChange(false);
            }}
            className="shrink-0 gap-2 bg-[#1C63A6] hover:bg-[#1C63A6]/90"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
