import { useState } from 'react';
import { 
  Minimize2, 
  ArrowUpDown, 
  Layers
} from 'lucide-react';
import { Checklist } from '@/types/checklist';
import { ReorderModal } from './ReorderModal';

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
  onToggleCompactMode
}: FloatingActionBarProps) {
  const [showReorderModal, setShowReorderModal] = useState(false);

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
