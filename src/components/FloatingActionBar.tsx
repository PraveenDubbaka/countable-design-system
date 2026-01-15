import { useState } from 'react';
import { 
  Minimize2, 
  ArrowUpDown, 
  Layers,
  Link2
} from 'lucide-react';
import { Checklist } from '@/types/checklist';
import { ReorderModal } from './ReorderModal';

interface FloatingActionBarProps {
  checklist: Checklist;
  onUpdate: (checklist: Checklist) => void;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  allCollapsed: boolean;
}

export function FloatingActionBar({ 
  checklist, 
  onUpdate, 
  onCollapseAll, 
  onExpandAll,
  allCollapsed 
}: FloatingActionBarProps) {
  const [showReorderModal, setShowReorderModal] = useState(false);

  const handleToggleAll = () => {
    if (allCollapsed) {
      onExpandAll();
    } else {
      onCollapseAll();
    }
  };

  return (
    <>
      {/* Floating pill button */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-1 bg-card border rounded-full p-2 shadow-lg">
          {/* Collapse/Expand All */}
          <button
            onClick={handleToggleAll}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors group"
            title={allCollapsed ? "Expand all sections" : "Collapse all sections"}
          >
            <Minimize2 className={`h-4 w-4 text-muted-foreground group-hover:text-foreground transition-transform ${allCollapsed ? 'rotate-180' : ''}`} />
          </button>

          {/* Reorder Questions */}
          <button
            onClick={() => setShowReorderModal(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors group"
            title="Reorder questions"
          >
            <ArrowUpDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </button>

          {/* Group/Sections (placeholder) */}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors group"
            title="Manage sections"
          >
            <Layers className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </button>

          {/* Link (placeholder) */}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors group"
            title="Link items"
          >
            <Link2 className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
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
