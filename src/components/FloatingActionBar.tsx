import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Minimize2, GripVertical, 
  ArrowUpDown, 
  Layers,
  Trash2,
  FolderPlus,
  ChevronUp,
  ChevronDown,
  Plus,
  FileText,
  Columns,
  Circle,
  Square,
  Calendar,
  AlignLeft,
  DollarSign,
  Menu,
  ToggleLeft,
  Type
} from 'lucide-react';
import { SmartLayoutIcon } from './icons/SmartLayoutIcon';
import { Checklist, CellBlockType } from '@/types/checklist';
import { ReorderModal } from './ReorderModal';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const SMART_LAYOUT_OPTIONS: {value: CellBlockType; label: string; icon: React.ElementType; bgColor: string; iconColor: string;}[] = [
  { value: 'yes-no', label: 'Yes / No', icon: Circle, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { value: 'yes-no-na', label: 'Yes / No / NA', icon: Circle, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { value: 'multiple-choice', label: 'Multiple Choice', icon: Square, bgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
  { value: 'date', label: 'Date', icon: Calendar, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
  { value: 'long-answer', label: 'Answer', icon: AlignLeft, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { value: 'amount', label: 'Amount', icon: DollarSign, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  { value: 'dropdown', label: 'Dropdown', icon: Menu, bgColor: 'bg-teal-100', iconColor: 'text-teal-600' },
  { value: 'toggle', label: 'Switch/Toggle', icon: ToggleLeft, bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  { value: 'explanation', label: 'Explanation', icon: FileText, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  { value: 'text', label: 'Text', icon: Type, bgColor: 'bg-slate-100', iconColor: 'text-slate-600' },
];

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
  onAddCategory: (position: 'top' | 'bottom', type: 'empty' | 'template' | 'form' | 'inquires-form') => void;
  isPreviewMode?: boolean;
}

const getStorageKey = (isPreviewMode: boolean) => 
  `floating-action-bar-position-${isPreviewMode ? 'preview' : 'edit'}`;

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
  const [showSmartLayoutPopover, setShowSmartLayoutPopover] = useState(false);
  const [pendingCategoryType, setPendingCategoryType] = useState<'empty' | 'template' | 'form' | 'inquires-form' | null>(null);
  
  // Drag state
  const [snapPosition, setSnapPosition] = useState<SnapPosition>(() => {
    const saved = localStorage.getItem(getStorageKey(isPreviewMode));
    return (saved as SnapPosition) || 'bottom';
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [dragY, setDragY] = useState<number | null>(null);
  const [isSnapping, setIsSnapping] = useState(false);
  
  // Use ref to track current dragY for closure
  const dragYRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Update ref when dragY changes
  useEffect(() => {
    dragYRef.current = dragY;
  }, [dragY]);

  // Load position when mode changes
  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(isPreviewMode));
    setSnapPosition((saved as SnapPosition) || 'bottom');
  }, [isPreviewMode]);

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem(getStorageKey(isPreviewMode), snapPosition);
  }, [snapPosition, isPreviewMode]);

  const handleToggleSections = () => {
    if (allSectionsCollapsed) {
      onExpandSections();
    } else {
      onCollapseSections();
    }
  };

  // Cycle through positions on double-click
  const handleDoubleClick = () => {
    setIsSnapping(true);
    const positions: SnapPosition[] = ['top', 'center', 'bottom'];
    const currentIndex = positions.indexOf(snapPosition);
    const nextIndex = (currentIndex + 1) % positions.length;
    setSnapPosition(positions[nextIndex]);
    setTimeout(() => setIsSnapping(false), 400);
  };

  // Top offset to clear the sticky header (Save, Replace, Delete buttons area)
  const TOP_HEADER_OFFSET = 156; // Clear sticky header + action buttons area

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
        return { top: `${TOP_HEADER_OFFSET}px`, transform: 'translateX(0)' };
      case 'bottom':
        return { bottom: '1rem', transform: 'translateX(0)' };
      case 'center':
      default:
        return { top: '50%', transform: 'translateY(-50%)' };
    }
  };

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const barRect = barRef.current?.getBoundingClientRect();
    const parentElement = containerRef.current?.parentElement;
    const containerRect = parentElement?.getBoundingClientRect();
    
    if (barRect && containerRect && parentElement) {
      const initialY = barRect.top - containerRect.top;
      setDragY(initialY);
      dragYRef.current = initialY;
      
      const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
        const moveClientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
        const newY = moveClientY - containerRect.top - (barRect.height / 2);
        const maxY = containerRect.height - barRect.height - 16;
        // Use TOP_HEADER_OFFSET as minimum to prevent overlapping sticky header
        const clampedY = Math.max(TOP_HEADER_OFFSET, Math.min(newY, maxY));
        setDragY(clampedY);
        dragYRef.current = clampedY;
      };
      
      const handleEnd = () => {
        setIsDragging(false);
        setIsSnapping(true);
        
        // Use ref value instead of state (fixes closure issue)
        const currentY = dragYRef.current;
        const containerHeight = containerRect.height;
        const barHeight = barRect.height;
        
        if (currentY !== null) {
          const topThreshold = containerHeight * 0.33;
          const bottomThreshold = containerHeight * 0.66;
          
          let newPosition: SnapPosition;
          if (currentY < topThreshold) {
            newPosition = 'top';
          } else if (currentY > bottomThreshold - barHeight) {
            newPosition = 'bottom';
          } else {
            newPosition = 'center';
          }
          
          setSnapPosition(newPosition);
        }
        
        setDragY(null);
        dragYRef.current = null;
        
        // Clear snapping animation after transition
        setTimeout(() => setIsSnapping(false), 400);
        
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
  }, []);

  // Determine which zone we're currently in during drag
  const getCurrentZone = (): SnapPosition => {
    if (!isDragging || dragY === null || !containerRef.current?.parentElement) {
      return snapPosition;
    }
    
    const containerHeight = containerRef.current.parentElement.getBoundingClientRect().height;
    const barHeight = barRef.current?.getBoundingClientRect().height || 0;
    
    const topThreshold = containerHeight * 0.33;
    const bottomThreshold = containerHeight * 0.66;
    
    if (dragY < topThreshold) {
      return 'top';
    } else if (dragY > bottomThreshold - barHeight) {
      return 'bottom';
    }
    return 'center';
  };

  const currentZone = getCurrentZone();

  return (
    <>
      {/* Snap Position Indicators - shown while dragging */}
      {isDragging && (
        <div className="absolute right-6 inset-y-0 z-30 pointer-events-none flex flex-col items-center justify-between py-4">
          {/* Top indicator */}
          <div className={`flex items-center gap-2 transition-all duration-150 ${currentZone === 'top' ? 'opacity-100 scale-110' : 'opacity-40'}`}>
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${currentZone === 'top' ? 'bg-primary scale-125' : 'bg-muted-foreground'}`} />
            <span className={`text-[10px] font-medium transition-colors ${currentZone === 'top' ? 'text-primary' : 'text-muted-foreground'}`}>Top</span>
          </div>
          
          {/* Center indicator */}
          <div className={`flex items-center gap-2 transition-all duration-150 ${currentZone === 'center' ? 'opacity-100 scale-110' : 'opacity-40'}`}>
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${currentZone === 'center' ? 'bg-primary scale-125' : 'bg-muted-foreground'}`} />
            <span className={`text-[10px] font-medium transition-colors ${currentZone === 'center' ? 'text-primary' : 'text-muted-foreground'}`}>Center</span>
          </div>
          
          {/* Bottom indicator */}
          <div className={`flex items-center gap-2 transition-all duration-150 ${currentZone === 'bottom' ? 'opacity-100 scale-110' : 'opacity-40'}`}>
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${currentZone === 'bottom' ? 'bg-primary scale-125' : 'bg-muted-foreground'}`} />
            <span className={`text-[10px] font-medium transition-colors ${currentZone === 'bottom' ? 'text-primary' : 'text-muted-foreground'}`}>Bottom</span>
          </div>
        </div>
      )}

      {/* Floating pill button - positioned relative to parent container */}
      <div 
        ref={containerRef}
        className={`absolute right-6 z-40 ${
          isDragging 
            ? 'transition-none' 
            : isSnapping 
              ? 'transition-all duration-400 ease-out' 
              : 'transition-all duration-300 ease-out'
        }`}
        style={getPositionStyles()}
      >
        <div 
          ref={barRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onDoubleClick={handleDoubleClick}
          className={`flex flex-col gap-1 bg-card p-2 shadow-lg transition-all duration-200 ${
            isDragging 
              ? 'shadow-xl ring-2 ring-primary/30 border-2 border-dashed border-primary cursor-grabbing scale-105' 
              : isHovering 
                ? 'border-2 border-dashed border-primary/50 cursor-grab' 
                : 'border-2 border-solid border-border'
          } ${isSnapping && !isDragging ? 'animate-[scale-in_0.3s_ease-out]' : ''}`} 
          style={{ borderRadius: '9999px' }}
          title="Drag to reposition • Double-click to cycle positions"
        >
          {/* Smart Layout - Hidden in preview mode */}
          {!isPreviewMode && (
            <Popover 
              open={showSmartLayoutPopover} 
              onOpenChange={setShowSmartLayoutPopover}
            >
              <PopoverTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors group"
                  title="Smart Layout – drag or click to add content types"
                >
                  <SmartLayoutIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent 
                side="left" 
                align="center" 
                className="w-72 p-2 bg-card border shadow-lg z-50"
              >
                <div className="flex flex-col gap-1">
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-sm font-semibold text-foreground">Smart Layout</p>
                    <p className="text-xs text-muted-foreground">Click to place into a column</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {SMART_LAYOUT_OPTIONS.map((opt) => {
                      const I = opt.icon;
                      return (
                        <div
                          key={opt.value}
                          draggable
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          onDragStart={(e) => {
                            e.stopPropagation();
                            e.dataTransfer.setData('application/smart-layout-type', opt.value);
                            e.dataTransfer.effectAllowed = 'copy';
                          }}
                          onClick={() => {
                            document.dispatchEvent(new CustomEvent('smart-layout-activate', { detail: { type: opt.value } }));
                            setShowSmartLayoutPopover(false);
                          }}
                          className="flex items-center gap-2 px-2 py-2 rounded-lg text-left text-xs transition-colors hover:bg-muted cursor-grab active:cursor-grabbing group/drag"
                        >
                          <GripVertical className="h-3 w-3 shrink-0 text-muted-foreground/40 group-hover/drag:text-muted-foreground transition-colors" />
                          <div className={`w-6 h-6 shrink-0 rounded flex items-center justify-center ${opt.bgColor}`}>
                            <I className={`h-3.5 w-3.5 ${opt.iconColor}`} />
                          </div>
                          <span className="text-foreground truncate">{opt.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Collapse/Expand Sections */}
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleSections(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors group"
            title={allSectionsCollapsed ? "Expand all categories" : "Collapse all categories"}
          >
            <Layers className={`h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:icon-layers transition-transform ${allSectionsCollapsed ? 'opacity-50' : ''}`} />
          </button>

          {/* Collapse/Expand Row Text (Compact Mode) */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompactMode(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors group"
            title={isCompactMode ? "Expand row text" : "Collapse row text"}
          >
            <Minimize2 className={`h-4 w-4 text-muted-foreground group-hover:text-foreground transition-transform ${isCompactMode ? 'rotate-180' : ''}`} />
          </button>

          {/* Reorder Questions */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowReorderModal(true); }}
            onMouseDown={(e) => e.stopPropagation()}
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
                if (open) setPendingCategoryType('empty');
                if (!open) setPendingCategoryType(null);
              }}
            >
              <PopoverTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors group"
                  title="Add category"
                >
                  <FolderPlus className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent 
                side="left" 
                align="center" 
                className="w-56 p-2 bg-card border shadow-lg z-50"
                onPointerDownOutside={(e) => e.preventDefault()}
              >
                {pendingCategoryType && (
                  <div className="flex flex-col gap-1">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-sm font-semibold text-foreground">Category</p>
                    </div>
                    <button
                      onClick={() => {
                        onAddCategory('top', pendingCategoryType);
                        setShowAddCategoryPopover(false);
                        setPendingCategoryType(null);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
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
                      <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                        <ChevronDown className="h-3.5 w-3.5 text-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Add to Bottom</p>
                        <p className="text-xs text-muted-foreground">Insert at end</p>
                      </div>
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}

          {/* Bulk Delete - Hidden in preview mode */}
          {!isPreviewMode && (
            <button
              onClick={(e) => { e.stopPropagation(); onBulkDelete(); }}
              onMouseDown={(e) => e.stopPropagation()}
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
