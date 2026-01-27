import { useState, useRef, useEffect } from 'react';
import { 
  Minimize2, 
  ArrowUpDown, 
  Layers,
  Trash2,
  FolderPlus,
  ChevronUp,
  ChevronDown,
  Plus,
  FileText,
  Columns,
  GripVertical
} from 'lucide-react';
import { Checklist } from '@/types/checklist';
import { ReorderModal } from './ReorderModal';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type SnapPosition = 'top' | 'center' | 'bottom';

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
  onAddCategory: (position: 'top' | 'bottom', type: 'empty' | 'template' | 'form') => void;
  isPreviewMode?: boolean;
}

const STORAGE_KEY = 'floating-action-bar-position';

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
  onAddCategory,
  isPreviewMode = false
}: FloatingActionBarProps) {
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [showAddCategoryPopover, setShowAddCategoryPopover] = useState(false);
  const [pendingCategoryType, setPendingCategoryType] = useState<'empty' | 'template' | 'form' | null>(null);
  
  // Drag state
  const [snapPosition, setSnapPosition] = useState<SnapPosition>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as SnapPosition) || 'center';
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, snapPosition);
  }, [snapPosition]);

  const handleToggleSections = () => {
    if (allSectionsCollapsed) {
      onExpandSections();
    } else {
      onCollapseSections();
    }
  };

  // Get position styles based on snap position
  const getPositionStyles = (): React.CSSProperties => {
    if (isDragging && dragY !== null) {
      return {
        top: dragY,
        transform: 'translateX(0)',
      };
    }
    
    switch (snapPosition) {
      case 'top':
        return { top: '1rem', transform: 'translateX(0)' };
      case 'bottom':
        return { bottom: '1rem', transform: 'translateX(0)' };
      case 'center':
      default:
        return { top: '50%', transform: 'translateY(-50%)' };
    }
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const barRect = barRef.current?.getBoundingClientRect();
    const containerRect = containerRef.current?.parentElement?.getBoundingClientRect();
    
    if (barRect && containerRect) {
      const initialY = barRect.top - containerRect.top;
      setDragY(initialY);
      
      const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
        const moveClientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
        const newY = moveClientY - containerRect.top - (barRect.height / 2);
        const maxY = containerRect.height - barRect.height - 16;
        const clampedY = Math.max(16, Math.min(newY, maxY));
        setDragY(clampedY);
      };
      
      const handleEnd = () => {
        setIsDragging(false);
        
        // Determine snap position based on final Y
        if (containerRef.current?.parentElement && dragY !== null) {
          const containerHeight = containerRef.current.parentElement.getBoundingClientRect().height;
          const barHeight = barRef.current?.getBoundingClientRect().height || 0;
          const currentY = dragY;
          
          const topThreshold = containerHeight * 0.33;
          const bottomThreshold = containerHeight * 0.66;
          
          if (currentY < topThreshold) {
            setSnapPosition('top');
          } else if (currentY > bottomThreshold - barHeight) {
            setSnapPosition('bottom');
          } else {
            setSnapPosition('center');
          }
        }
        
        setDragY(null);
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
      
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
    }
  };

  return (
    <>
      {/* Floating pill button - positioned relative to parent container */}
      <div 
        ref={containerRef}
        className={`absolute right-6 z-40 transition-all ${isDragging ? 'duration-0' : 'duration-300'} ease-out`}
        style={getPositionStyles()}
      >
        <div 
          ref={barRef}
          className={`flex flex-col gap-1 bg-card border p-2 shadow-lg ${isDragging ? 'shadow-xl ring-2 ring-primary/20' : ''}`} 
          style={{ borderRadius: '9999px' }}
        >
          {/* Drag Handle */}
          <button
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className={`w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors cursor-grab active:cursor-grabbing group ${isDragging ? 'bg-muted' : ''}`}
            title="Drag to reposition"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </button>

          <div className="w-full h-px bg-border my-0.5" />

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

          {/* Add Category - Hidden in preview mode */}
          {!isPreviewMode && (
            <Popover 
              open={showAddCategoryPopover} 
              onOpenChange={(open) => {
                setShowAddCategoryPopover(open);
                if (!open) setPendingCategoryType(null);
              }}
            >
              <PopoverTrigger asChild>
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors group"
                  title="Add category"
                >
                  <FolderPlus className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="left" align="center" className="w-56 p-2 bg-card border shadow-lg z-50">
                {!pendingCategoryType ? (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setPendingCategoryType('empty')}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center">
                        <Plus className="h-3.5 w-3.5 text-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Empty Section</p>
                        <p className="text-xs text-muted-foreground">Start from scratch</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setPendingCategoryType('template')}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center">
                        <FileText className="h-3.5 w-3.5 text-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">From Template</p>
                        <p className="text-xs text-muted-foreground">Use existing template</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setPendingCategoryType('form')}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                        <Columns className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Form Column</p>
                        <p className="text-xs text-muted-foreground">Multi-column form layout</p>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-xs text-muted-foreground font-medium">Where to add?</p>
                    </div>
                    <button
                      onClick={() => {
                        onAddCategory('top', pendingCategoryType);
                        setShowAddCategoryPopover(false);
                        setPendingCategoryType(null);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-7 h-7 rounded-md bg-[#F5F8FA] flex items-center justify-center">
                        <ChevronUp className="h-3.5 w-3.5 text-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Add to Top</p>
                        <p className="text-xs text-muted-foreground">Insert at beginning</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onAddCategory('bottom', pendingCategoryType);
                        setShowAddCategoryPopover(false);
                        setPendingCategoryType(null);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-7 h-7 rounded-md bg-[#F5F8FA] flex items-center justify-center">
                        <ChevronDown className="h-3.5 w-3.5 text-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Add to Bottom</p>
                        <p className="text-xs text-muted-foreground">Insert at end</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setPendingCategoryType(null)}
                      className="text-center text-xs text-muted-foreground hover:text-foreground py-2 mt-1 transition-colors"
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}

          {/* Bulk Delete - Hidden in preview mode */}
          {!isPreviewMode && (
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
          )}
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
