import { useState, useEffect } from 'react';
import { Plus, Folder, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from '@/lib/safeJson';
import { Checklist } from '@/types/checklist';
import { SavedChecklist } from './Sidebar';

interface Template {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: Template[];
  isExpanded?: boolean;
}

interface AddToMyTemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checklist: Checklist;
  checklistName: string;
}

const initialTemplates: Template[] = [
  { id: "1", name: "Before Release V22Comp", type: "folder", children: [] },
  { id: "2", name: "Before Release V22 Revi...", type: "folder", children: [] },
  { id: "3", name: "Carissa_13208", type: "folder", children: [] },
  { id: "4", name: "carisa 37.3", type: "folder", children: [] },
  { id: "5", name: "Compilation Checklists", type: "folder", children: [] },
  { id: "6", name: "release 38 before", type: "folder", children: [] },
  { id: "7", name: "Review Checklists", type: "folder", children: [] },
  { id: "8", name: "Tax Release", type: "folder", children: [] },
];

export function AddToMyTemplatesDialog({
  open,
  onOpenChange,
  checklist,
  checklistName,
}: AddToMyTemplatesDialogProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState(checklistName);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [folders] = useState<Template[]>(initialTemplates);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setTemplateName(checklistName);
      setSelectedFolder(null);
    }
  }, [open, checklistName]);

  const handleSave = () => {
    if (!selectedFolder || !templateName.trim()) return;

    const selectedFolderData = folders.find(f => f.id === selectedFolder);
    if (!selectedFolderData) return;

    // Create new saved checklist
    const newChecklist: SavedChecklist = {
      id: `checklist-${Date.now()}`,
      name: templateName.trim(),
      folderId: selectedFolder,
      folderName: selectedFolderData.name,
      data: {
        ...checklist,
        id: `checklist-${Date.now()}`,
        title: templateName.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    // Save to localStorage
    const savedChecklists = readJsonFromLocalStorage<SavedChecklist[]>('savedChecklists', []);
    const updated = [...savedChecklists, newChecklist];
    writeJsonToLocalStorage('savedChecklists', updated);

    // Dispatch event for sidebar to pick up
    const event = new CustomEvent('checklistSaved', { detail: newChecklist });
    window.dispatchEvent(event);

    // Close the main dialog and show success
    onOpenChange(false);
    setShowSuccessDialog(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add to My Templates
            </DialogTitle>
            <DialogDescription>
              Select a folder to save this template to your library.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name"
              />
            </div>

            <div className="space-y-2">
              <Label>Select Folder</Label>
              <ScrollArea className="h-[200px] rounded-md border p-2">
                <div className="space-y-1">
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      type="button"
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition-colors",
                        selectedFolder === folder.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                      onClick={() => setSelectedFolder(folder.id)}
                    >
                      <Folder className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate flex-1">{folder.name}</span>
                      {selectedFolder === folder.id && (
                        <Check className="h-4 w-4 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedFolder || !templateName.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to My Templates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Confirmation Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <AlertDialogTitle className="text-center">Success!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Checklist successfully added to My Templates
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center">
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              Done
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
