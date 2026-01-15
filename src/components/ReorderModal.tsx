import { useState, useEffect } from 'react';
import { X, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Checklist, Section, Question } from '@/types/checklist';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklist: Checklist;
  onUpdate: (checklist: Checklist) => void;
}

interface FlatItem {
  id: string;
  type: 'section' | 'question';
  sectionIndex: number;
  questionIndex?: number;
  label: string;
  indent: boolean;
}

export function ReorderModal({ isOpen, onClose, checklist, onUpdate }: ReorderModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [localSections, setLocalSections] = useState<Section[]>([]);

  // Sync local state with checklist when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSections([...checklist.sections]);
      setSelectedItems(new Set());
    }
  }, [isOpen, checklist.sections]);

  if (!isOpen) return null;

  // Build flat list of items for display
  const buildFlatList = (): FlatItem[] => {
    const items: FlatItem[] = [];
    localSections.forEach((section, sIndex) => {
      items.push({
        id: section.id,
        type: 'section',
        sectionIndex: sIndex,
        label: section.title,
        indent: false
      });
      section.questions.forEach((question, qIndex) => {
        items.push({
          id: question.id,
          type: 'question',
          sectionIndex: sIndex,
          questionIndex: qIndex,
          label: question.text.length > 35 ? question.text.substring(0, 35) + '...' : question.text,
          indent: true
        });
      });
    });
    return items;
  };

  const flatItems = buildFlatList();

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const moveSelectedUp = () => {
    if (selectedItems.size === 0) return;
    
    const newSections = [...localSections];
    
    // Get selected questions and move them up within their sections
    selectedItems.forEach(itemId => {
      const item = flatItems.find(i => i.id === itemId);
      if (!item || item.type !== 'question' || item.questionIndex === undefined) return;
      
      const section = newSections[item.sectionIndex];
      const qIndex = section.questions.findIndex(q => q.id === itemId);
      
      if (qIndex > 0) {
        // Swap with previous question
        [section.questions[qIndex - 1], section.questions[qIndex]] = 
          [section.questions[qIndex], section.questions[qIndex - 1]];
      }
    });
    
    setLocalSections(newSections);
  };

  const moveSelectedDown = () => {
    if (selectedItems.size === 0) return;
    
    const newSections = [...localSections];
    
    // Get selected questions and move them down (process in reverse to avoid conflicts)
    const selectedArray = Array.from(selectedItems).reverse();
    selectedArray.forEach(itemId => {
      const item = flatItems.find(i => i.id === itemId);
      if (!item || item.type !== 'question' || item.questionIndex === undefined) return;
      
      const section = newSections[item.sectionIndex];
      const qIndex = section.questions.findIndex(q => q.id === itemId);
      
      if (qIndex < section.questions.length - 1) {
        // Swap with next question
        [section.questions[qIndex], section.questions[qIndex + 1]] = 
          [section.questions[qIndex + 1], section.questions[qIndex]];
      }
    });
    
    setLocalSections(newSections);
  };

  const handleSave = () => {
    onUpdate({ ...checklist, sections: localSections });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-card border rounded-xl shadow-2xl w-full max-w-md mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-semibold">Reorder Questions</h2>
              <p className="text-sm text-muted-foreground">
                Select one or multiple questions and use the arrows to change their order.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Sections</span>
            <div className="flex gap-1">
              <button
                onClick={moveSelectedUp}
                disabled={selectedItems.size === 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg border hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Move up"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                onClick={moveSelectedDown}
                disabled={selectedItems.size === 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg border hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Move down"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1 border rounded-lg p-2">
            {flatItems.map((item, index) => (
              <label
                key={item.id}
                className={`flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                  selectedItems.has(item.id) ? 'bg-primary/10 border border-primary/30' : ''
                } ${item.indent ? 'ml-4' : ''}`}
              >
                <Checkbox
                  checked={selectedItems.has(item.id)}
                  onCheckedChange={() => toggleItem(item.id)}
                  disabled={item.type === 'section'}
                  className={item.type === 'section' ? 'opacity-0' : ''}
                />
                <span className={`text-sm flex-1 ${item.type === 'section' ? 'font-medium' : 'text-muted-foreground'}`}>
                  {item.type === 'question' ? `${index}. ` : ''}{item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30 rounded-b-xl">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
