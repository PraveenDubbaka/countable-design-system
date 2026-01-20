import { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Copy,
  GripVertical,
  PlusCircle,
} from 'lucide-react';
import { Checklist, Question, Section, AnswerType } from '@/types/checklist';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextQuestionEditor } from '@/components/RichTextQuestionEditor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

// Answer type options for dropdown
const ANSWER_TYPE_OPTIONS: { value: AnswerType; label: string }[] = [
  { value: 'short-answer', label: 'Text' },
  { value: 'long-answer', label: 'Long Text' },
  { value: 'yes-no', label: 'Yes/No' },
  { value: 'yes-no-na', label: 'Yes/No/N/A' },
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'date', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'file-upload', label: 'File Upload' },
  { value: 'toggle', label: 'Toggle' },
];

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
  const [isSelected, setIsSelected] = useState(false);
  const draftNameRef = useRef(subItem.text);

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

  const handleSave = () => {
    const trimmed = draftNameRef.current.trim();
    if (trimmed && trimmed !== subItem.text) {
      onUpdate({ ...subItem, text: trimmed });
    }
    setIsEditingName(false);
  };

  const handleCancel = () => {
    draftNameRef.current = subItem.text;
    setIsEditingName(false);
  };

  const handleAnswerChange = (answer: string) => {
    onUpdate({ ...subItem, answer });
  };

  const handleAnswerTypeChange = (answerType: AnswerType) => {
    onUpdate({ ...subItem, answerType, answer: '' });
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
                disabled={isPreviewMode}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  subItem.answer === opt
                    ? 'bg-blue-600 text-white'
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
            disabled={isPreviewMode}
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
            disabled={isPreviewMode}
            className="h-7 text-xs bg-slate-700/50 border-slate-600 text-slate-200"
          />
        );
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...(!isPreviewMode ? { ...attributes, ...listeners } : {})}
      className={`group flex items-stretch hover:bg-slate-700/20 transition-colors relative ${!isPreviewMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {/* Checkbox column */}
      <div className="w-10 flex items-center justify-center">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={() => setIsSelected(!isSelected)}
          className="h-4 w-4 border-slate-500 bg-slate-800"
        />
      </div>

      {/* Sub-item name */}
      <div className="flex-1 min-w-[280px] px-3 py-2.5">
        {isEditingName && !isPreviewMode ? (
          <RichTextQuestionEditor
            value={subItem.text}
            onChange={(newValue) => { draftNameRef.current = newValue; }}
            onBlur={handleSave}
            onCancel={handleCancel}
            className="text-sm min-h-[32px] bg-slate-700/50 border-slate-600 text-slate-200"
          />
        ) : (
          <div
            onClick={(e) => {
              if (!isPreviewMode) {
                e.stopPropagation();
                draftNameRef.current = subItem.text;
                setIsEditingName(true);
              }
            }}
            className={`text-sm text-slate-300 ${!isPreviewMode ? 'cursor-text hover:text-slate-100' : ''}`}
            dangerouslySetInnerHTML={{ __html: subItem.text || 'New sub-item' }}
          />
        )}
      </div>

      {/* Response Type column */}
      <div className="w-[120px] px-2 py-2 flex items-center">
        {!isPreviewMode ? (
          <Select
            value={subItem.answerType}
            onValueChange={(value) => handleAnswerTypeChange(value as AnswerType)}
          >
            <SelectTrigger className="h-7 text-xs bg-slate-700/50 border-slate-600 text-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 z-50">
              {ANSWER_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-slate-200 focus:bg-slate-700">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-xs text-slate-400">
            {ANSWER_TYPE_OPTIONS.find(o => o.value === subItem.answerType)?.label || 'Text'}
          </span>
        )}
      </div>

      {/* Response column */}
      <div className="w-[160px] px-2 py-2 flex items-center">
        {renderResponseField()}
      </div>

      {/* Additional Explanation column */}
      <div className="w-[200px] px-2 py-2 flex items-center">
        <Textarea
          value={subItem.explanation || ''}
          onChange={(e) => onUpdate({ ...subItem, explanation: e.target.value })}
          placeholder="Add explanation..."
          disabled={isPreviewMode}
          className="min-h-[28px] h-7 text-xs bg-slate-700/50 border-slate-600 text-slate-200 resize-none py-1"
        />
      </div>

      {/* Actions - add subitem button */}
      <div className="w-12 flex items-center justify-center">
        {!isPreviewMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded hover:bg-slate-600 text-slate-400 hover:text-slate-200 transition-colors opacity-0 group-hover:opacity-100"
          >
            <PlusCircle className="h-4 w-4" />
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
  const [isSelected, setIsSelected] = useState(false);
  const draftNameRef = useRef(item.text);

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

  const handleSave = () => {
    const trimmed = draftNameRef.current.trim();
    if (trimmed && trimmed !== item.text) {
      onUpdate({ ...item, text: trimmed });
    }
    setIsEditingName(false);
  };

  const handleCancel = () => {
    draftNameRef.current = item.text;
    setIsEditingName(false);
  };

  const handleAnswerChange = (answer: string) => {
    onUpdate({ ...item, answer });
  };

  const handleAnswerTypeChange = (answerType: AnswerType) => {
    onUpdate({ ...item, answerType, answer: '' });
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
                disabled={isPreviewMode}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  item.answer === opt
                    ? 'bg-blue-600 text-white'
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
            disabled={isPreviewMode}
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
          <Textarea
            value={item.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter response..."
            disabled={isPreviewMode}
            className="min-h-[32px] text-sm bg-slate-700/50 border border-slate-600 text-slate-200 resize-none rounded-md px-2 py-1 w-full"
          />
        );

      default:
        return (
          <Input
            value={item.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter response..."
            disabled={isPreviewMode}
            className="h-8 text-sm bg-slate-700/50 border-slate-600 text-slate-200"
          />
        );
    }
  };

  const subItemIds = item.subQuestions?.map(sq => sq.id) || [];

  return (
    <div ref={setNodeRef} style={style}>
      {/* Main item row - full row is draggable */}
      <div 
        {...(!isPreviewMode && !isEditingName ? { ...attributes, ...listeners } : {})}
        className={`group flex items-center border-b border-slate-700 hover:bg-slate-700/40 transition-colors ${isSelected ? 'bg-slate-700/30' : ''} ${!isPreviewMode && !isEditingName ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        {/* Checkbox */}
        <div className="w-10 flex items-center justify-center border-r border-slate-700">
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
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
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
        <div className="flex-1 min-w-[280px] px-3 py-1 border-r border-slate-700">
          {isEditingName && !isPreviewMode ? (
            <RichTextQuestionEditor
              value={item.text}
              onChange={(newValue) => { draftNameRef.current = newValue; }}
              onBlur={handleSave}
              onCancel={handleCancel}
              className="text-sm min-h-[36px] bg-slate-700/50 border-slate-600 text-slate-200"
            />
          ) : (
            <div className="flex items-center gap-2">
              <div 
                onClick={(e) => {
                  if (!isPreviewMode) {
                    e.stopPropagation();
                    draftNameRef.current = item.text;
                    setIsEditingName(true);
                  }
                }}
                className={`text-sm text-slate-200 py-2 flex-1 ${!isPreviewMode ? 'cursor-text hover:text-white' : ''}`}
                dangerouslySetInnerHTML={{ __html: item.text || 'Click to add item name...' }}
              />
              {hasSubItems && (
                <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-medium">
                  {item.subQuestions!.length}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Response Type column */}
        <div className="w-[120px] px-2 py-2 border-r border-slate-700">
          {!isPreviewMode ? (
            <Select
              value={item.answerType}
              onValueChange={(value) => handleAnswerTypeChange(value as AnswerType)}
            >
              <SelectTrigger className="h-8 text-xs bg-slate-700/50 border-slate-600 text-slate-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 z-50">
                {ANSWER_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-slate-200 focus:bg-slate-700">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-xs text-slate-400">
              {ANSWER_TYPE_OPTIONS.find(o => o.value === item.answerType)?.label || 'Text'}
            </span>
          )}
        </div>

        {/* Response column */}
        <div className="w-[160px] px-2 py-2 border-r border-slate-700">
          {renderResponseField()}
        </div>

        {/* Additional Explanation column */}
        <div className="w-[200px] px-2 py-2 border-r border-slate-700">
          <Textarea
            value={item.explanation || ''}
            onChange={(e) => onUpdate({ ...item, explanation: e.target.value })}
            placeholder="Add explanation..."
            disabled={isPreviewMode}
            className="min-h-[32px] h-8 text-xs bg-slate-700/50 border-slate-600 text-slate-200 resize-none py-1.5"
          />
        </div>

        {/* Actions menu */}
        <div className="w-16 flex items-center justify-center gap-1">
          {!isPreviewMode && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSubItem();
                }}
                className="p-1.5 rounded hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-slate-200"
                title="Add sub-item"
              >
                <PlusCircle className="h-4 w-4" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
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
            </>
          )}
        </div>
      </div>

      {/* Sub-items section - Monday.com style with vertical bar */}
      {hasSubItems && isExpanded && (
        <div className="relative ml-8">
          {/* Continuous vertical amber bar on left */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-600/70 rounded-full" />
          
          {/* Sub-items container */}
          <div className="ml-4 bg-slate-800/50 border border-slate-700/60 rounded-lg overflow-hidden">
            {/* Sub-items header row */}
            <div className="flex items-center bg-slate-800/80 text-xs font-medium text-slate-400 border-b border-slate-700/50">
              <div className="w-10 flex items-center justify-center py-2" />
              <div className="flex-1 min-w-[280px] px-3 py-2">Subitem</div>
              <div className="w-[120px] px-2 py-2 text-center">Type</div>
              <div className="w-[160px] px-2 py-2 text-center">Response</div>
              <div className="w-[200px] px-2 py-2 text-center">Explanation</div>
              <div className="w-12" />
            </div>

            <SortableContext items={subItemIds} strategy={verticalListSortingStrategy}>
              {item.subQuestions!.map((sub, idx) => (
                <div key={sub.id} className="border-b border-slate-700/40 last:border-b-0">
                  <SortableSubItemRow
                    subItem={sub}
                    index={idx}
                    parentId={item.id}
                    onUpdate={(updated) => handleSubItemUpdate(idx, updated)}
                    onDelete={() => handleSubItemDelete(idx)}
                    isPreviewMode={isPreviewMode}
                    isLast={idx === item.subQuestions!.length - 1}
                    totalCount={item.subQuestions!.length}
                  />
                </div>
              ))}
            </SortableContext>

            {/* Add subitem row */}
            {!isPreviewMode && (
              <div className="flex items-center hover:bg-slate-700/20 transition-colors border-t border-slate-700/40">
                <div className="w-10 flex items-center justify-center py-2">
                  <Checkbox 
                    disabled
                    className="h-4 w-4 border-slate-600 bg-slate-800 opacity-40"
                  />
                </div>
                <button
                  onClick={onAddSubItem}
                  className="flex-1 flex items-center gap-2 px-3 py-2.5 text-sm text-slate-500 hover:text-blue-400 transition-colors text-left"
                >
                  <Plus className="h-3.5 w-3.5" />
                  + Add subitem
                </button>
              </div>
            )}
          </div>
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
      <div 
        {...(!isPreviewMode ? { ...attributes, ...listeners } : {})}
        className={`flex items-center gap-3 px-4 py-2 border-b border-slate-700 ${!isPreviewMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        <div className="w-1 h-6 bg-amber-600 rounded-full" />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onUpdate({ ...section, isExpanded: !section.isExpanded });
          }}
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
            onClick={(e) => e.stopPropagation()}
            className="h-7 text-sm font-semibold bg-slate-700/50 border-slate-600 text-amber-400 flex-1"
          />
        ) : (
          <h3 
            onClick={(e) => {
              e.stopPropagation();
              if (!isPreviewMode) setIsEditingTitle(true);
            }}
            className={`text-sm font-semibold text-amber-400 flex-1 ${!isPreviewMode ? 'cursor-text hover:text-amber-300' : ''}`}
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
              <button 
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded hover:bg-slate-700 transition-colors"
              >
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
            <div className="w-10 border-r border-slate-700" />
            <div className="w-8" />
            <div className="flex-1 min-w-[280px] px-3 py-2 border-r border-slate-700">Item</div>
            <div className="w-[120px] px-2 py-2 border-r border-slate-700">Type</div>
            <div className="w-[160px] px-2 py-2 border-r border-slate-700">Response</div>
            <div className="w-[200px] px-2 py-2 border-r border-slate-700">Explanation</div>
            <div className="w-16" />
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
