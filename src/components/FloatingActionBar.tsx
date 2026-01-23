import { useState } from 'react';
import { 
  Minimize2, 
  ArrowUpDown, 
  Layers,
  Trash2,
  FolderPlus,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Checklist } from '@/types/checklist';
import { ReorderModal } from './ReorderModal';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface FloatingActionBarProps {
  checklist: Checklist;
  onUpdate: (checklist: Checklist) => void;
  onCollapseSections: () => void;
  onExpandSections: () => void;
  onCollapseQuestions: () => void;
  onExpandQuestions: () => void;
  allSectionsCollapsed: boolean;
  allQuestionsCollapsed: boolean;
  isCompactMode: boolean;
  onToggleCompactMode: () => void;
  selectedQuestions: Set<string>;
  onBulkDelete: () => void;
  onAddCategory: (position: 'top' | 'bottom') => void;
}

export function FloatingActionBar({ 
  checklist, 
  onUpdate, 
  onCollapseSections, 
  onExpandSections,
  onCollapseQuestions,
  onExpandQuestions,
  allSectionsCollapsed,
  allQuestionsCollapsed,
  isCompactMode,
  onToggleCompactMode,
  selectedQuestions,
  onBulkDelete,
  onAddCategory
}: FloatingActionBarProps) {
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [showAddCategoryPopover, setShowAddCategoryPopover] = useState(false);

  const handleToggleSections = () => {
    if (allSectionsCollapsed) {
      onExpandSections();
    } else {
      onCollapseSections();
    }
  };

  return (
    <>
      {/* Floating pill button */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-1 bg-card border p-2 shadow-lg" style={{ borderRadius: '9999px' }}>
          {/* Collapse/Expand Sections */}
          <button
            onClick={handleToggleSections}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors group"
            title={allSectionsCollapsed ? "Expand all categories" : "Collapse all categories"}
          >
            <Layers className={`h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:icon-layers transition-transform ${allSectionsCollapsed ? 'opacity-50' : ''}`} />
          </button>

          {/* Collapse/Expand Row Text (Compact Mode) */}
          <button
            onClick={onToggleCompactMode}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors group"
            title={isCompactMode ? "Expand row text" : "Collapse row text"}
          >
            <Minimize2 className={`h-4 w-4 text-muted-foreground group-hover:text-foreground transition-transform ${isCompactMode ? 'rotate-180' : ''}`} />
          </button>

          {/* Reorder Questions */}
          <button
            onClick={() => setShowReorderModal(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors group"
            title="Reorder questions"
          >
            <ArrowUpDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:icon-reorder" />
          </button>

          {/* Add Category */}
          <Popover open={showAddCategoryPopover} onOpenChange={setShowAddCategoryPopover}>
            <PopoverTrigger asChild>
              <button
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors group"
                title="Add category"
              >
                <FolderPlus className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="left" align="center" className="w-40 p-2 bg-card border shadow-lg z-50">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    onAddCategory('top');
                    setShowAddCategoryPopover(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  <ChevronUp className="h-4 w-4" />
                  <span>Add to Top</span>
                </button>
                <button
                  onClick={() => {
                    onAddCategory('bottom');
                    setShowAddCategoryPopover(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  <ChevronDown className="h-4 w-4" />
                  <span>Add to Bottom</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Bulk Delete */}
          <button
            onClick={onBulkDelete}
            disabled={selectedQuestions.size === 0}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors group ${
              selectedQuestions.size === 0 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-red-50 hover:text-red-500'
            }`}
            title={selectedQuestions.size === 0 ? "Select questions to delete" : `Delete ${selectedQuestions.size} selected`}
          >
            <Trash2 className={`h-4 w-4 ${selectedQuestions.size === 0 ? 'text-muted-foreground' : 'text-muted-foreground group-hover:text-red-500'}`} />
          </button>
        </div>
      </div>

      {/* Reorder Modal */}
      <ReorderModal
        isOpen={showReorderModal}
        onClose={() => setShowReorderModal(false)}
        checklist={checklist}
        onUpdate={onUpdate}
      />
    </>
  );
}
