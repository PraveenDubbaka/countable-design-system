import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Columns, LayoutGrid } from 'lucide-react';

interface FormColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (columnCount: number) => void;
}

const columnOptions = [
  { count: 1, label: '1 Column', description: 'Single column layout' },
  { count: 2, label: '2 Columns', description: 'Two equal columns' },
  { count: 3, label: '3 Columns', description: 'Three equal columns' },
  { count: 4, label: '4 Columns', description: 'Four equal columns' },
  { count: 5, label: '5 Columns', description: 'Five equal columns' },
];

export function FormColumnModal({ isOpen, onClose, onSelect }: FormColumnModalProps) {
  const [selectedCount, setSelectedCount] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedCount !== null) {
      onSelect(selectedCount);
      setSelectedCount(null);
    }
  };

  const handleClose = () => {
    setSelectedCount(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" />
            Choose Column Layout
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-2 py-4">
          {columnOptions.map((option) => (
            <button
              key={option.count}
              onClick={() => setSelectedCount(option.count)}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                selectedCount === option.count
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Columns className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
              <div className="flex gap-1">
                {Array(option.count).fill(null).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-8 rounded-sm ${
                      selectedCount === option.count ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={selectedCount === null}>
            Create Form
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
