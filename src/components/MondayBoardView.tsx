import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Copy,
  GripVertical,
} from 'lucide-react';
import { Checklist, Question, Section } from '@/types/checklist';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RichTextQuestionEditor } from '@/components/RichTextQuestionEditor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MondayBoardViewProps {
  checklist: Checklist;
  onUpdate: (checklist: Checklist) => void;
  isPreviewMode: boolean;
}

// Strip HTML tags from text for clean display
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

// Sortable Sub-item row component
interface SubItemRowProps {
  subItem: Question;
  index: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  isPreviewMode: boolean;
  parentId: string;
}

interface SortableSubItemRowProps extends SubItemRowProps {
  isLast: boolean;
  totalCount: number;
}

function SortableSubItemRow({ subItem, onUpdate, onDelete, isPreviewMode, index, parentId, isLast, totalCount }: SortableSubItemRowProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(stripHtml(subItem.text));
  const [isSelected, setIsSelected] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: subItem.id,
    data: { type: 'subitem', parentId, subItem }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const commitName = () => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== stripHtml(subItem.text)) {
      onUpdate({ ...subItem, text: trimmed });
    } else {
      setDraftName(stripHtml(subItem.text));
    }
    setIsEditingName(false);
  };

  const handleAnswerChange = (answer: string) => {
    onUpdate({ ...subItem, answer });
  };

  const renderResponseField = () => {
    switch (subItem.answerType) {
      case 'yes-no':
      case 'yes-no-na':
        const options = subItem.answerType === 'yes-no' ? ['Yes', 'No'] : ['Yes', 'No', 'N/A'];
        return (
          <div className="flex gap-1">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswerChange(opt)}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  subItem.answer === opt
                    ? 'bg-slate-600 text-white'
                    : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        );

      case 'multiple-choice':
      case 'dropdown':
        return (
          <select
            value={subItem.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="h-7 px-2 text-xs bg-slate-700/50 border-slate-600 text-slate-200 rounded w-full"
          >
            <option value="">Select...</option>
            {(subItem.options || ['Option 1', 'Option 2']).map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );

      default:
        return (
          <Input
            value={subItem.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter response..."
            className="h-7 text-xs bg-slate-700/50 border-slate-600 text-slate-200"
          />
        );
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="group flex items-stretch hover:bg-slate-700/30 transition-colors relative"
    >
      {/* Vertical connector line + horizontal line */}
      <div className="w-16 relative flex items-center justify-end pr-2">
        {/* Vertical line */}
        <div 
          className={`absolute left-6 top-0 w-0.5 bg-slate-600 ${isLast ? 'h-1/2' : 'h-full'}`}
        />
        {/* Horizontal connector */}
        <div className="absolute left-6 top-1/2 w-4 h-0.5 bg-slate-600" />
        
        {/* Drag handle */}
        {!isPreviewMode && (
          <button
            {...attributes}
            {...listeners}
            className="p-1 rounded hover:bg-slate-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <GripVertical className="h-3.5 w-3.5 text-slate-500" />
          </button>
        )}
      </div>

      {/* Checkbox */}
      <div className="w-10 flex items-center justify-center">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={() => setIsSelected(!isSelected)}
          className="h-4 w-4 border-slate-500 bg-slate-800"
        />
      </div>

      {/* Sub-item name */}
      <div className="flex-1 min-w-[280px] px-3 py-1">
        {isEditingName && !isPreviewMode ? (
          <RichTextQuestionEditor
            value={subItem.text}
            onChange={(newValue) => setDraftName(newValue)}
            onBlur={() => {
              const trimmed = draftName.trim();
              if (trimmed && trimmed !== subItem.text) {
                onUpdate({ ...subItem, text: trimmed });
              }
              setIsEditingName(false);
            }}
            onCancel={() => {
              setDraftName(subItem.text);
              setIsEditingName(false);
            }}
            className="text-sm min-h-[32px] bg-slate-700/50 border-slate-600 text-slate-200"
          />
        ) : (
          <span
            onClick={() => !isPreviewMode && setIsEditingName(true)}
            className={`text-sm text-slate-300 block py-1.5 ${!isPreviewMode ? 'cursor-text hover:text-slate-100' : ''}`}
            dangerouslySetInnerHTML={{ __html: subItem.text || 'New sub-item' }}
          />
        )}
      </div>

      {/* Response column */}
      <div className="w-[180px] px-3 py-2">
        {renderResponseField()}
      </div>

      {/* Reference column */}
      <div className="w-[120px] px-3 py-2">
        <Input
          value={subItem.reference || ''}
          onChange={(e) => onUpdate({ ...subItem, reference: e.target.value })}
          placeholder="Ref..."
          className="h-7 text-xs bg-slate-700/50 border-slate-600 text-slate-200"
          disabled={isPreviewMode}
        />
      </div>

      {/* Actions */}
      <div className="w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {!isPreviewMode && (
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-slate-600 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Sortable Item row component
interface ItemRowProps {
  item: Question;
  sectionId: string;
  itemIndex: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onAddSubItem: () => void;
  isPreviewMode: boolean;
  onSubItemsReorder: (itemId: string, newSubItems: Question[]) => void;
}

function SortableItemRow({ 
  item, 
  sectionId,
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onAddSubItem,
  isPreviewMode,
  onSubItemsReorder,
}: ItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(stripHtml(item.text));
  const [isSelected, setIsSelected] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.id,
    data: { type: 'item', sectionId, item }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasSubItems = item.subQuestions && item.subQuestions.length > 0;

  const commitName = () => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== stripHtml(item.text)) {
      onUpdate({ ...item, text: trimmed });
    } else {
      setDraftName(stripHtml(item.text));
    }
    setIsEditingName(false);
  };

  const handleAnswerChange = (answer: string) => {
    onUpdate({ ...item, answer });
  };

  const handleSubItemUpdate = (index: number, updatedSub: Question) => {
    const newSubQuestions = [...(item.subQuestions || [])];
    newSubQuestions[index] = updatedSub;
    onUpdate({ ...item, subQuestions: newSubQuestions });
  };

  const handleSubItemDelete = (index: number) => {
    const newSubQuestions = (item.subQuestions || []).filter((_, i) => i !== index);
    onUpdate({ ...item, subQuestions: newSubQuestions });
  };

  const renderResponseField = () => {
    switch (item.answerType) {
      case 'yes-no':
      case 'yes-no-na':
        const options = item.answerType === 'yes-no' ? ['Yes', 'No'] : ['Yes', 'No', 'N/A'];
        return (
          <div className="flex gap-1">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswerChange(opt)}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  item.answer === opt
                    ? 'bg-slate-500 text-white'
                    : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        );

      case 'multiple-choice':
      case 'dropdown':
        return (
          <select
            value={item.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="h-8 px-2 text-sm bg-slate-700/50 border-slate-600 text-slate-200 rounded w-full"
          >
            <option value="">Select...</option>
            {(item.options || ['Option 1', 'Option 2']).map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'long-answer':
        return (
          <textarea
            value={item.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter response..."
            className="min-h-[40px] text-sm bg-slate-700/50 border border-slate-600 text-slate-200 resize-none rounded-md px-2 py-1 w-full"
          />
        );

      default:
        return (
          <Input
            value={item.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter response..."
            className="h-8 text-sm bg-slate-700/50 border-slate-600 text-slate-200"
          />
        );
    }
  };

  const subItemIds = item.subQuestions?.map(sq => sq.id) || [];

  return (
    <div ref={setNodeRef} style={style}>
      {/* Main item row */}
      <div className={`group flex items-center border-b border-slate-700 hover:bg-slate-700/40 transition-colors ${isSelected ? 'bg-slate-700/30' : ''}`}>
        {/* Drag handle */}
        <div className="w-6 flex items-center justify-center">
          {!isPreviewMode && (
            <button
              {...attributes}
              {...listeners}
              className="p-1 rounded hover:bg-slate-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripVertical className="h-4 w-4 text-slate-500" />
            </button>
          )}
        </div>

        {/* Checkbox */}
        <div className="w-10 flex items-center justify-center">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={() => setIsSelected(!isSelected)}
            className="h-4 w-4 border-slate-500"
          />
        </div>

        {/* Expand arrow */}
        <div className="w-8 flex items-center justify-center">
          {hasSubItems ? (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0.5 rounded hover:bg-slate-600 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}
        </div>

        {/* Item name */}
        <div className="flex-1 min-w-[300px] px-3 py-1">
          {isEditingName && !isPreviewMode ? (
            <RichTextQuestionEditor
              value={item.text}
              onChange={(newValue) => setDraftName(newValue)}
              onBlur={() => {
                const trimmed = draftName.trim();
                if (trimmed && trimmed !== item.text) {
                  onUpdate({ ...item, text: trimmed });
                }
                setIsEditingName(false);
              }}
              onCancel={() => {
                setDraftName(item.text);
                setIsEditingName(false);
              }}
              className="text-sm min-h-[36px] bg-slate-700/50 border-slate-600 text-slate-200"
            />
          ) : (
            <div 
              onClick={() => !isPreviewMode && setIsEditingName(true)}
              className={`text-sm text-slate-200 py-2 ${!isPreviewMode ? 'cursor-text hover:text-white' : ''}`}
              dangerouslySetInnerHTML={{ __html: item.text || 'Click to add item name...' }}
            />
          )}
          {hasSubItems && !isEditingName && (
            <span className="ml-2 text-xs text-blue-400 font-medium">
              {item.subQuestions!.length}
            </span>
          )}
        </div>

        {/* Response column */}
        <div className="w-[180px] px-3 py-2">
          {renderResponseField()}
        </div>

        {/* Reference column */}
        <div className="w-[120px] px-3 py-2">
          <Input
            value={item.reference || ''}
            onChange={(e) => onUpdate({ ...item, reference: e.target.value })}
            placeholder="Add ref..."
            className="h-8 text-sm bg-slate-700/50 border-slate-600 text-slate-200"
            disabled={isPreviewMode}
          />
        </div>

        {/* Actions menu */}
        <div className="w-10 flex items-center justify-center">
          {!isPreviewMode && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                  <MoreHorizontal className="h-4 w-4 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-700 z-50">
                <DropdownMenuItem onClick={onAddSubItem} className="text-slate-200 focus:bg-slate-700 focus:text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add sub-item
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDuplicate} className="text-slate-200 focus:bg-slate-700 focus:text-white">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem onClick={onDelete} className="text-red-400 focus:bg-slate-700 focus:text-red-300">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Sub-items section - Monday.com style with connector lines */}
      {hasSubItems && isExpanded && (
        <div className="bg-slate-800/30 relative">
          <SortableContext items={subItemIds} strategy={verticalListSortingStrategy}>
            {item.subQuestions!.map((sub, idx) => (
              <SortableSubItemRow
                key={sub.id}
                subItem={sub}
                index={idx}
                parentId={item.id}
                onUpdate={(updated) => handleSubItemUpdate(idx, updated)}
                onDelete={() => handleSubItemDelete(idx)}
                isPreviewMode={isPreviewMode}
                isLast={idx === item.subQuestions!.length - 1 && isPreviewMode}
                totalCount={item.subQuestions!.length}
              />
            ))}
          </SortableContext>

          {/* Add subitem button with connector */}
          {!isPreviewMode && (
            <div className="flex items-stretch relative group/add">
              {/* Vertical connector line for add button */}
              <div className="w-16 relative flex items-center justify-end pr-2">
                <div className="absolute left-6 top-0 w-0.5 bg-slate-600 h-1/2" />
                <div className="absolute left-6 top-1/2 w-4 h-0.5 bg-slate-600" />
              </div>
              
              <div className="w-10 flex items-center justify-center">
                <div className="h-4 w-4 border border-dashed border-slate-500 rounded opacity-50" />
              </div>
              
              <button
                onClick={onAddSubItem}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-400 hover:text-slate-200 transition-colors flex-1 text-left"
              >
                <Plus className="h-3.5 w-3.5" />
                Add subitem
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Group component (Section)
interface GroupProps {
  section: Section;
  sectionIndex: number;
  onUpdate: (section: Section) => void;
  onDelete: () => void;
  onAddItem: () => void;
  isPreviewMode: boolean;
  onItemsReorder: (sectionId: string, newItems: Question[]) => void;
  onSubItemsReorder: (itemId: string, newSubItems: Question[]) => void;
}

function SortableGroup({ 
  section, 
  sectionIndex, 
  onUpdate, 
  onDelete, 
  onAddItem, 
  isPreviewMode,
  onItemsReorder,
  onSubItemsReorder,
}: GroupProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(section.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: section.id,
    data: { type: 'group', section }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const commitTitle = () => {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== section.title) {
      onUpdate({ ...section, title: trimmed });
    } else {
      setDraftTitle(section.title);
    }
    setIsEditingTitle(false);
  };

  const handleItemUpdate = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...section.questions];
    newQuestions[index] = updatedQuestion;
    onUpdate({ ...section, questions: newQuestions });
  };

  const handleItemDelete = (index: number) => {
    const newQuestions = section.questions.filter((_, i) => i !== index);
    onUpdate({ ...section, questions: newQuestions });
  };

  const handleItemDuplicate = (index: number) => {
    const question = section.questions[index];
    const newQuestion: Question = {
      ...question,
      id: `q-${Date.now()}`,
      subQuestions: question.subQuestions?.map(sq => ({ ...sq, id: `sq-${Date.now()}-${Math.random()}` }))
    };
    const newQuestions = [
      ...section.questions.slice(0, index + 1),
      newQuestion,
      ...section.questions.slice(index + 1)
    ];
    onUpdate({ ...section, questions: newQuestions });
  };

  const handleAddSubItem = (index: number) => {
    const question = section.questions[index];
    const newSubQuestion: Question = {
      id: `sq-${Date.now()}`,
      text: 'New sub-item',
      answerType: 'short-answer',
      required: false,
    };
    const updatedQuestion = {
      ...question,
      subQuestions: [...(question.subQuestions || []), newSubQuestion],
    };
    handleItemUpdate(index, updatedQuestion);
  };

  // Clean number prefix from title
  const cleanTitle = (title: string) => title.replace(/^\d+\.\s*/, '');

  // Count total subitems
  const totalSubitems = section.questions.reduce((acc, q) => acc + (q.subQuestions?.length || 0), 0);

  const itemIds = section.questions.map(q => q.id);

  return (
    <div ref={setNodeRef} style={style} className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
      {/* Group header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-700">
        {/* Drag handle for group */}
        {!isPreviewMode && (
          <button
            {...attributes}
            {...listeners}
            className="p-1 rounded hover:bg-slate-700 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-slate-500" />
          </button>
        )}
        
        <div className="w-1 h-6 bg-blue-500 rounded-full" />
        <button 
          onClick={() => onUpdate({ ...section, isExpanded: !section.isExpanded })}
          className="p-0.5 rounded hover:bg-slate-700 transition-colors"
        >
          {section.isExpanded ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )}
        </button>
        
        {isEditingTitle && !isPreviewMode ? (
          <Input
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitTitle();
              if (e.key === 'Escape') {
                setDraftTitle(section.title);
                setIsEditingTitle(false);
              }
            }}
            autoFocus
            className="h-7 text-sm font-semibold bg-slate-700/50 border-slate-600 text-blue-400 flex-1"
          />
        ) : (
          <h3 
            onClick={() => !isPreviewMode && setIsEditingTitle(true)}
            className={`text-sm font-semibold text-blue-400 flex-1 ${!isPreviewMode ? 'cursor-text hover:text-blue-300' : ''}`}
          >
            {cleanTitle(section.title)}
          </h3>
        )}

        <span className="text-xs text-slate-400">
          {section.questions.length} Items{totalSubitems > 0 ? ` / ${totalSubitems} Subitems` : ''}
        </span>

        {!isPreviewMode && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded hover:bg-slate-700 transition-colors">
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 z-50">
              <DropdownMenuItem onClick={onAddItem} className="text-slate-200 focus:bg-slate-700 focus:text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add item
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem onClick={onDelete} className="text-red-400 focus:bg-slate-700 focus:text-red-300">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      {section.isExpanded && (
        <>
          {/* Column headers */}
          <div className="flex items-center border-b border-slate-700 bg-slate-800/50 text-xs font-medium text-slate-400">
            <div className="w-6" />
            <div className="w-10" />
            <div className="w-8" />
            <div className="flex-1 min-w-[300px] px-3 py-2">Item</div>
            <div className="w-[180px] px-3 py-2">Response</div>
            <div className="w-[120px] px-3 py-2">Reference</div>
            <div className="w-10" />
          </div>

          {/* Items */}
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            {section.questions.map((question, idx) => (
              <SortableItemRow
                key={question.id}
                item={question}
                sectionId={section.id}
                itemIndex={idx}
                onUpdate={(q) => handleItemUpdate(idx, q)}
                onDelete={() => handleItemDelete(idx)}
                onDuplicate={() => handleItemDuplicate(idx)}
                onAddSubItem={() => handleAddSubItem(idx)}
                isPreviewMode={isPreviewMode}
                onSubItemsReorder={onSubItemsReorder}
              />
            ))}
          </SortableContext>

          {/* Add item button */}
          {!isPreviewMode && (
            <div className="flex items-center border-t border-slate-700/50">
              <div className="w-6" />
              <div className="w-10" />
              <button
                onClick={onAddItem}
                className="flex items-center gap-2 px-6 py-3 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 transition-colors w-full text-left"
              >
                <Plus className="h-4 w-4" />
                + Add item
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function MondayBoardView({ checklist, onUpdate, isPreviewMode }: MondayBoardViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSectionUpdate = (index: number, updatedSection: Section) => {
    const newSections = [...checklist.sections];
    newSections[index] = updatedSection;
    onUpdate({ ...checklist, sections: newSections });
  };

  const handleSectionDelete = (index: number) => {
    const newSections = checklist.sections.filter((_, i) => i !== index);
    onUpdate({ ...checklist, sections: newSections });
  };

  const handleAddItem = (sectionIndex: number) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: '',
      answerType: 'short-answer',
      required: false,
    };
    const newSections = [...checklist.sections];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      questions: [...newSections[sectionIndex].questions, newQuestion],
    };
    onUpdate({ ...checklist, sections: newSections });
  };

  const handleItemsReorder = (sectionId: string, newItems: Question[]) => {
    const newSections = checklist.sections.map(section => 
      section.id === sectionId ? { ...section, questions: newItems } : section
    );
    onUpdate({ ...checklist, sections: newSections });
  };

  const handleSubItemsReorder = (itemId: string, newSubItems: Question[]) => {
    const newSections = checklist.sections.map(section => ({
      ...section,
      questions: section.questions.map(q => 
        q.id === itemId ? { ...q, subQuestions: newSubItems } : q
      )
    }));
    onUpdate({ ...checklist, sections: newSections });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle group reordering
    if (activeData?.type === 'group' && overData?.type === 'group') {
      const oldIndex = checklist.sections.findIndex(s => s.id === active.id);
      const newIndex = checklist.sections.findIndex(s => s.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = [...checklist.sections];
        const [removed] = newSections.splice(oldIndex, 1);
        newSections.splice(newIndex, 0, removed);
        onUpdate({ ...checklist, sections: newSections });
      }
      return;
    }

    // Handle item reordering within the same section
    if (activeData?.type === 'item' && overData?.type === 'item') {
      const activeSectionId = activeData.sectionId;
      const overSectionId = overData.sectionId;

      if (activeSectionId === overSectionId) {
        // Same section - reorder
        const section = checklist.sections.find(s => s.id === activeSectionId);
        if (section) {
          const oldIndex = section.questions.findIndex(q => q.id === active.id);
          const newIndex = section.questions.findIndex(q => q.id === over.id);
          
          if (oldIndex !== -1 && newIndex !== -1) {
            const newQuestions = [...section.questions];
            const [removed] = newQuestions.splice(oldIndex, 1);
            newQuestions.splice(newIndex, 0, removed);
            handleItemsReorder(activeSectionId, newQuestions);
          }
        }
      } else {
        // Different sections - move item
        const sourceSection = checklist.sections.find(s => s.id === activeSectionId);
        const targetSection = checklist.sections.find(s => s.id === overSectionId);
        
        if (sourceSection && targetSection) {
          const itemToMove = sourceSection.questions.find(q => q.id === active.id);
          if (itemToMove) {
            const newSourceQuestions = sourceSection.questions.filter(q => q.id !== active.id);
            const targetIndex = targetSection.questions.findIndex(q => q.id === over.id);
            const newTargetQuestions = [...targetSection.questions];
            newTargetQuestions.splice(targetIndex, 0, itemToMove);

            const newSections = checklist.sections.map(section => {
              if (section.id === activeSectionId) return { ...section, questions: newSourceQuestions };
              if (section.id === overSectionId) return { ...section, questions: newTargetQuestions };
              return section;
            });
            onUpdate({ ...checklist, sections: newSections });
          }
        }
      }
      return;
    }

    // Handle subitem reordering within the same parent
    if (activeData?.type === 'subitem' && overData?.type === 'subitem') {
      const activeParentId = activeData.parentId;
      const overParentId = overData.parentId;

      if (activeParentId === overParentId) {
        // Same parent - reorder
        for (const section of checklist.sections) {
          const item = section.questions.find(q => q.id === activeParentId);
          if (item && item.subQuestions) {
            const oldIndex = item.subQuestions.findIndex(sq => sq.id === active.id);
            const newIndex = item.subQuestions.findIndex(sq => sq.id === over.id);
            
            if (oldIndex !== -1 && newIndex !== -1) {
              const newSubQuestions = [...item.subQuestions];
              const [removed] = newSubQuestions.splice(oldIndex, 1);
              newSubQuestions.splice(newIndex, 0, removed);
              handleSubItemsReorder(activeParentId, newSubQuestions);
            }
            break;
          }
        }
      } else {
        // Different parents - move subitem
        let sourceItem: Question | undefined;
        let targetItem: Question | undefined;

        for (const section of checklist.sections) {
          for (const q of section.questions) {
            if (q.id === activeParentId) sourceItem = q;
            if (q.id === overParentId) targetItem = q;
          }
        }

        if (sourceItem && targetItem && sourceItem.subQuestions && targetItem.subQuestions) {
          const subItemToMove = sourceItem.subQuestions.find(sq => sq.id === active.id);
          if (subItemToMove) {
            const newSourceSubItems = sourceItem.subQuestions.filter(sq => sq.id !== active.id);
            const targetIndex = targetItem.subQuestions.findIndex(sq => sq.id === over.id);
            const newTargetSubItems = [...targetItem.subQuestions];
            newTargetSubItems.splice(targetIndex, 0, subItemToMove);

            const newSections = checklist.sections.map(section => ({
              ...section,
              questions: section.questions.map(q => {
                if (q.id === activeParentId) return { ...q, subQuestions: newSourceSubItems };
                if (q.id === overParentId) return { ...q, subQuestions: newTargetSubItems };
                return q;
              })
            }));
            onUpdate({ ...checklist, sections: newSections });
          }
        }
      }
    }
  };

  const sectionIds = checklist.sections.map(s => s.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
          {checklist.sections.map((section, idx) => (
            <SortableGroup
              key={section.id}
              section={section}
              sectionIndex={idx}
              onUpdate={(s) => handleSectionUpdate(idx, s)}
              onDelete={() => handleSectionDelete(idx)}
              onAddItem={() => handleAddItem(idx)}
              isPreviewMode={isPreviewMode}
              onItemsReorder={handleItemsReorder}
              onSubItemsReorder={handleSubItemsReorder}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}
