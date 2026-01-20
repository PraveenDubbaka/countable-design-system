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
  Circle,
  Square,
  Type,
  Calendar,
  AlignLeft,
  Paperclip,
  ToggleLeft,
  ListPlus,
  Menu,
  DollarSign,
  FileText,
  Search,
  Upload,
  File,
  X,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input as SearchInput } from '@/components/ui/input';
import { Checklist, Question, Section, AnswerType } from '@/types/checklist';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AITextarea } from '@/components/AITextarea';
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

// Answer type options for dropdown with icons like Monday.com
const ANSWER_TYPE_OPTIONS: { value: AnswerType; label: string; icon: React.ElementType; bgColor: string; iconColor: string }[] = [
  { value: 'yes-no', label: 'Yes / No', icon: Circle, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { value: 'yes-no-na', label: 'Yes / No / N/A', icon: Circle, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { value: 'multiple-choice', label: 'Multiple Choice', icon: Square, bgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
  { value: 'date', label: 'Date', icon: Calendar, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
  { value: 'long-answer', label: 'Long Answer', icon: AlignLeft, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { value: 'short-answer', label: 'Short Answer', icon: Type, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  { value: 'amount', label: 'Amount', icon: DollarSign, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  { value: 'dropdown', label: 'Dropdown', icon: Menu, bgColor: 'bg-teal-100', iconColor: 'text-teal-600' },
  { value: 'file-upload', label: 'File Upload', icon: Paperclip, bgColor: 'bg-pink-100', iconColor: 'text-pink-600' },
  { value: 'toggle', label: 'Switch/Toggle', icon: ToggleLeft, bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
];

// Column options for add column dropdown
const COLUMN_OPTIONS = [
  { id: 'explanation', label: 'Additional Explanation', icon: AlignLeft, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { id: 'reference', label: '+ Ref (Attached Document)', icon: Paperclip, bgColor: 'bg-pink-100', iconColor: 'text-pink-600' },
];

// Mock existing documents for demo
const EXISTING_DOCUMENTS = [
  { id: 'doc1', name: 'Company Policy.pdf', type: 'pdf' },
  { id: 'doc2', name: 'Guidelines 2024.docx', type: 'docx' },
  { id: 'doc3', name: 'Compliance Checklist.xlsx', type: 'xlsx' },
  { id: 'doc4', name: 'Reference Manual.pdf', type: 'pdf' },
];

// Reference Button Component
interface RefButtonProps {
  reference?: { name: string; id?: string } | null;
  onAttach: (doc: { name: string; id?: string }) => void;
  onRemove: () => void;
  disabled?: boolean;
}

function RefButton({ reference, onAttach, onRemove, disabled }: RefButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocs = EXISTING_DOCUMENTS.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAttach({ name: file.name });
      setIsOpen(false);
      setSearchTerm('');
    }
    e.target.value = '';
  };

  if (disabled) {
    return reference ? (
      <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-600 bg-gray-100 rounded">
        <File className="h-3 w-3" />
        <span className="truncate max-w-[120px]">{reference.name}</span>
      </div>
    ) : (
      <span className="text-xs text-gray-400">No reference</span>
    );
  }

  if (reference) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
        <File className="h-3 w-3 shrink-0" />
        <span className="truncate max-w-[100px]">{reference.name}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-0.5 hover:bg-blue-100 rounded shrink-0"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md border border-dashed border-blue-300 transition-colors"
          >
            <Paperclip className="h-3.5 w-3.5" />
            <span>+ Ref</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-72 p-0 bg-slate-800 border-slate-700 shadow-xl z-50"
          sideOffset={5}
        >
          {/* Search input */}
          <div className="p-3 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents..."
                className="pl-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 h-9 text-sm"
              />
            </div>
          </div>

          {/* Upload new document option */}
          <div className="p-2 border-b border-slate-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-md hover:bg-slate-700 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded flex items-center justify-center bg-green-100">
                <Upload className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-white">Upload new document</span>
            </button>
          </div>

          {/* Existing documents */}
          <div className="p-2 max-h-48 overflow-y-auto">
            <p className="text-xs text-slate-400 px-2 py-1 mb-1">Existing documents</p>
            {filteredDocs.length > 0 ? (
              <div className="space-y-1">
                {filteredDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAttach({ id: doc.id, name: doc.name });
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-slate-700 transition-colors text-left"
                  >
                    <File className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-white truncate">{doc.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-3">No documents found</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

// Strip HTML tags from text for clean display
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

// Add Column Button Component
interface AddColumnButtonProps {
  onAddColumn: (columnId: string) => void;
  visibleColumns: { explanation: boolean; reference: boolean };
}

function AddColumnButton({ onAddColumn, visibleColumns }: AddColumnButtonProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const filteredOptions = COLUMN_OPTIONS.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !visibleColumns[opt.id as keyof typeof visibleColumns]
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="w-10 h-full flex items-center justify-center hover:bg-gray-200 transition-colors border-l border-gray-200">
          <Plus className="h-4 w-4 text-gray-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-72 p-0 bg-slate-800 border-slate-700 shadow-xl z-50"
        sideOffset={5}
      >
        {/* Search input */}
        <div className="p-3 border-b border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search or describe your column"
              className="pl-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 h-9 text-sm"
            />
          </div>
        </div>
        
        {/* Column options */}
        <div className="p-2">
          {filteredOptions.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {filteredOptions.map((opt) => {
                const IconComponent = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onAddColumn(opt.id);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-slate-700 transition-colors text-left"
                  >
                    <div className={`w-7 h-7 rounded flex items-center justify-center ${opt.bgColor}`}>
                      <IconComponent className={`h-4 w-4 ${opt.iconColor}`} />
                    </div>
                    <span className="text-sm text-white">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">All columns are already visible</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Response Type Dropdown Component (Monday.com style)
interface ResponseTypeDropdownProps {
  currentType: AnswerType;
  onTypeChange: (type: AnswerType) => void;
  disabled?: boolean;
}

function ResponseTypeDropdown({ currentType, onTypeChange, disabled }: ResponseTypeDropdownProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const currentTypeConfig = ANSWER_TYPE_OPTIONS.find(o => o.value === currentType) || ANSWER_TYPE_OPTIONS[0];
  const CurrentTypeIcon = currentTypeConfig.icon;
  
  const filteredOptions = ANSWER_TYPE_OPTIONS.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (disabled) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700">
        <div className={`w-6 h-6 rounded flex items-center justify-center ${currentTypeConfig.bgColor}`}>
          <CurrentTypeIcon className={`h-3.5 w-3.5 ${currentTypeConfig.iconColor}`} />
        </div>
        <span>{currentTypeConfig.label}</span>
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button 
          onClick={(e) => e.stopPropagation()}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          <div className={`w-6 h-6 rounded flex items-center justify-center ${currentTypeConfig.bgColor}`}>
            <CurrentTypeIcon className={`h-3.5 w-3.5 ${currentTypeConfig.iconColor}`} />
          </div>
          <span>{currentTypeConfig.label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="start" 
        className="w-72 p-0 bg-slate-800 border-slate-700 shadow-xl z-50"
        sideOffset={5}
      >
        {/* Search input */}
        <div className="p-3 border-b border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search or describe your column"
              className="pl-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 h-9 text-sm"
            />
          </div>
        </div>
        
        {/* Response type options */}
        <div className="p-2">
          <div className="grid grid-cols-2 gap-1.5">
            {filteredOptions.map((opt) => {
              const IconComponent = opt.icon;
              const isSelected = opt.value === currentType;
              return (
                <button
                  key={opt.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTypeChange(opt.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`flex items-center gap-2 px-2 py-2 rounded-md transition-colors text-left ${
                    isSelected ? 'bg-slate-600' : 'hover:bg-slate-700'
                  }`}
                >
                  <div className={`w-6 h-6 shrink-0 rounded flex items-center justify-center ${opt.bgColor}`}>
                    <IconComponent className={`h-3.5 w-3.5 ${opt.iconColor}`} />
                  </div>
                  <span className="text-xs text-white whitespace-nowrap truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Sortable Sub-item row component
interface SubItemRowProps {
  subItem: Question;
  index: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  isPreviewMode: boolean;
  parentId: string;
  visibleColumns: { explanation: boolean; reference: boolean };
}

interface SortableSubItemRowProps extends SubItemRowProps {
  isLast: boolean;
  totalCount: number;
}

function SortableSubItemRow({ subItem, onUpdate, onDelete, isPreviewMode, index, parentId, isLast, totalCount, visibleColumns }: SortableSubItemRowProps) {
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswerChange(opt);
                }}
                disabled={isPreviewMode}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  subItem.answer === opt
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
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
            onClick={(e) => e.stopPropagation()}
            disabled={isPreviewMode}
            className="h-7 px-2 text-xs bg-gray-100 border-gray-300 text-gray-700 rounded w-full"
          >
            <option value="">Select...</option>
            {(subItem.options || ['Option 1', 'Option 2']).map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'long-answer':
        return (
          <AITextarea
            value={subItem.answer || ''}
            onChange={(val) => handleAnswerChange(val)}
            placeholder="Enter your detailed answer..."
            disabled={isPreviewMode}
            minHeight="60px"
          />
        );

      case 'short-answer':
        return (
          <AITextarea
            value={subItem.answer || ''}
            onChange={(val) => handleAnswerChange(val)}
            placeholder="Enter response..."
            disabled={isPreviewMode}
            minHeight="40px"
          />
        );

      default:
        return (
          <Input
            value={subItem.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Enter response..."
            disabled={isPreviewMode}
            className="h-7 text-xs bg-gray-100 border-gray-300 text-gray-700"
          />
        );
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...(!isPreviewMode ? { ...attributes, ...listeners } : {})}
      className={`group flex items-stretch hover:bg-gray-100 transition-colors relative ${!isPreviewMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {/* Checkbox column */}
      <div className="w-10 flex items-center justify-center">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={() => setIsSelected(!isSelected)}
          className="h-4 w-4 border-gray-400 bg-white"
        />
      </div>

      {/* Sub-item name */}
      <div className="flex-1 min-w-[280px] px-3 py-2.5 border-r border-gray-200">
        {isEditingName && !isPreviewMode ? (
          <RichTextQuestionEditor
            value={subItem.text}
            onChange={(newValue) => { draftNameRef.current = newValue; }}
            onBlur={handleSave}
            onCancel={handleCancel}
            className="text-sm min-h-[32px] bg-gray-100 border-gray-300 text-gray-800"
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
            className={`text-sm text-gray-700 ${!isPreviewMode ? 'cursor-text hover:text-gray-900' : ''}`}
            dangerouslySetInnerHTML={{ __html: subItem.text || 'New sub-item' }}
          />
        )}
      </div>

      {/* Response column with inline type selector and response field */}
      <div className="w-[200px] px-2 py-2 border-r border-gray-200">
        <div className="flex flex-col gap-1.5">
          <ResponseTypeDropdown
            currentType={subItem.answerType}
            onTypeChange={handleAnswerTypeChange}
            disabled={isPreviewMode}
          />
          <div className="w-full">
            {renderResponseField()}
          </div>
        </div>
      </div>

      {/* Additional Explanation column - conditionally rendered */}
      {visibleColumns.explanation && (
        <div className="w-[200px] px-2 py-2 border-r border-gray-200">
          <AITextarea
            value={subItem.explanation || ''}
            onChange={(val) => onUpdate({ ...subItem, explanation: val })}
            placeholder="Add explanation..."
            disabled={isPreviewMode}
            minHeight="40px"
          />
        </div>
      )}

      {/* Reference column - conditionally rendered */}
      {visibleColumns.reference && (
        <div className="w-[200px] px-2 py-2 border-r border-gray-200 flex items-center">
          <RefButton
            reference={(subItem as any).reference}
            onAttach={(doc) => onUpdate({ ...subItem, reference: doc } as any)}
            onRemove={() => onUpdate({ ...subItem, reference: null } as any)}
            disabled={isPreviewMode}
          />
        </div>
      )}

      {/* Actions - delete button */}
      <div className="w-12 flex items-center justify-center">
        {!isPreviewMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
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
  const [visibleColumns, setVisibleColumns] = useState({ explanation: true, reference: false });
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

  const handleAddColumn = (columnId: string) => {
    setVisibleColumns(prev => ({ ...prev, [columnId]: true }));
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswerChange(opt);
                }}
                disabled={isPreviewMode}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  item.answer === opt
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
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
            onClick={(e) => e.stopPropagation()}
            disabled={isPreviewMode}
            className="h-8 px-2 text-sm bg-gray-100 border-gray-300 text-gray-700 rounded w-full"
          >
            <option value="">Select...</option>
            {(item.options || ['Option 1', 'Option 2']).map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'long-answer':
        return (
          <AITextarea
            value={item.answer || ''}
            onChange={(val) => handleAnswerChange(val)}
            placeholder="Enter your detailed answer..."
            disabled={isPreviewMode}
            minHeight="60px"
          />
        );

      case 'short-answer':
        return (
          <AITextarea
            value={item.answer || ''}
            onChange={(val) => handleAnswerChange(val)}
            placeholder="Enter response..."
            disabled={isPreviewMode}
            minHeight="40px"
          />
        );

      default:
        return (
          <Input
            value={item.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Enter response..."
            disabled={isPreviewMode}
            className="h-8 text-sm bg-gray-100 border-gray-300 text-gray-700"
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
        className={`group flex items-center border-b border-gray-200 hover:bg-gray-100 transition-colors ${isSelected ? 'bg-gray-100' : ''} ${!isPreviewMode && !isEditingName ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        {/* Checkbox */}
        <div className="w-10 flex items-center justify-center border-r border-gray-200">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={() => setIsSelected(!isSelected)}
            className="h-4 w-4 border-gray-400"
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
              className="p-0.5 rounded hover:bg-gray-200 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}
        </div>

        {/* Item name */}
        <div className="flex-1 min-w-[280px] px-3 py-1 border-r border-gray-200">
          {isEditingName && !isPreviewMode ? (
            <RichTextQuestionEditor
              value={item.text}
              onChange={(newValue) => { draftNameRef.current = newValue; }}
              onBlur={handleSave}
              onCancel={handleCancel}
              className="text-sm min-h-[36px] bg-gray-100 border-gray-300 text-gray-800"
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
                className={`text-sm text-gray-800 py-2 flex-1 ${!isPreviewMode ? 'cursor-text hover:text-gray-900' : ''}`}
                dangerouslySetInnerHTML={{ __html: item.text || 'Click to add item name...' }}
              />
              {hasSubItems && (
                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                  {item.subQuestions!.length}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Response column with inline type selector and response field */}
        <div className="w-[200px] px-2 py-2 border-r border-gray-200">
          <div className="flex flex-col gap-1.5">
            <ResponseTypeDropdown
              currentType={item.answerType}
              onTypeChange={handleAnswerTypeChange}
              disabled={isPreviewMode}
            />
            <div className="w-full">
              {renderResponseField()}
            </div>
          </div>
        </div>

        {/* Additional Explanation column - conditionally rendered */}
        {visibleColumns.explanation && (
          <div className="w-[200px] px-2 py-2 border-r border-gray-200">
            <AITextarea
              value={item.explanation || ''}
              onChange={(val) => onUpdate({ ...item, explanation: val })}
              placeholder="Add explanation..."
              disabled={isPreviewMode}
              minHeight="40px"
            />
          </div>
        )}

        {/* Reference column - conditionally rendered */}
        {visibleColumns.reference && (
          <div className="w-[200px] px-2 py-2 border-r border-gray-200 flex items-center">
            <RefButton
              reference={(item as any).reference}
              onAttach={(doc) => onUpdate({ ...item, reference: doc } as any)}
              onRemove={() => onUpdate({ ...item, reference: null } as any)}
              disabled={isPreviewMode}
            />
          </div>
        )}

        {/* Add column button */}
        {!isPreviewMode && (!visibleColumns.explanation || !visibleColumns.reference) && (
          <AddColumnButton onAddColumn={handleAddColumn} visibleColumns={visibleColumns} />
        )}

        {/* Actions menu */}
        <div className="w-16 flex items-center justify-center gap-1">
          {!isPreviewMode && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSubItem();
                }}
                className="p-1.5 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-all text-gray-400 hover:text-gray-700"
                title="Add sub-item"
              >
                <PlusCircle className="h-4 w-4" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border-gray-200 z-50">
                  <DropdownMenuItem onClick={onAddSubItem} className="text-gray-700 focus:bg-gray-100 focus:text-gray-900">
                    <Plus className="h-4 w-4 mr-2" />
                    Add sub-item
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDuplicate} className="text-gray-700 focus:bg-gray-100 focus:text-gray-900">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem onClick={onDelete} className="text-red-500 focus:bg-gray-100 focus:text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {/* Sub-items section - Monday.com style with connecting line */}
      {hasSubItems && isExpanded && (
        <div className="relative mt-1 mb-2">
          {/* Vertical connecting line from parent - positioned at left edge */}
          <div className="absolute left-3 -top-1 w-0.5 h-4 bg-amber-600/70" />
          
          {/* Horizontal connector line */}
          <div className="absolute left-3 top-3 w-6 h-0.5 bg-amber-600/70" />
          
          {/* Continuous vertical bar alongside sub-items */}
          <div className="absolute left-3 top-3 bottom-0 w-0.5 bg-amber-600/70" />
          
          {/* Sub-items container with left margin for the bar */}
          <div className="ml-10 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            {/* Sub-items header row */}
            <div className="flex items-center bg-gray-100 text-xs font-medium text-gray-500 border-b border-gray-200">
              <div className="w-10 flex items-center justify-center py-2" />
              <div className="flex-1 min-w-[280px] px-3 py-2 border-r border-gray-200">Subitem</div>
              <div className="w-[200px] px-2 py-2 text-center border-r border-gray-200">Response</div>
              {visibleColumns.explanation && (
                <div className="w-[200px] px-2 py-2 text-center border-r border-gray-200">Explanation</div>
              )}
              {visibleColumns.reference && (
                <div className="w-[200px] px-2 py-2 text-center border-r border-gray-200">Reference</div>
              )}
              <div className="w-12" />
            </div>

            <SortableContext items={subItemIds} strategy={verticalListSortingStrategy}>
              {item.subQuestions!.map((sub, idx) => (
                <div key={sub.id} className="border-b border-gray-200 last:border-b-0">
                  <SortableSubItemRow
                    subItem={sub}
                    index={idx}
                    parentId={item.id}
                    onUpdate={(updated) => handleSubItemUpdate(idx, updated)}
                    onDelete={() => handleSubItemDelete(idx)}
                    isPreviewMode={isPreviewMode}
                    isLast={idx === item.subQuestions!.length - 1}
                    totalCount={item.subQuestions!.length}
                    visibleColumns={visibleColumns}
                  />
                </div>
              ))}
            </SortableContext>

            {/* Add subitem row */}
            {!isPreviewMode && (
              <div className="flex items-center hover:bg-gray-100 transition-colors border-t border-gray-200">
                <div className="w-10 flex items-center justify-center py-2.5">
                  <Checkbox 
                    disabled
                    className="h-4 w-4 border-gray-300 bg-white opacity-30"
                  />
                </div>
                <button
                  onClick={onAddSubItem}
                  className="flex-1 flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 hover:text-blue-500 transition-colors text-left"
                >
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
    <div ref={setNodeRef} style={style} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      {/* Group header */}
      <div 
        {...(!isPreviewMode ? { ...attributes, ...listeners } : {})}
        className={`flex items-center gap-3 px-4 py-2 border-b border-gray-200 bg-gray-50 ${!isPreviewMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        <div className="w-1 h-6 bg-amber-600 rounded-full" />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onUpdate({ ...section, isExpanded: !section.isExpanded });
          }}
          className="p-0.5 rounded hover:bg-gray-200 transition-colors"
        >
          {section.isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
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
            className="h-7 text-sm font-semibold bg-gray-100 border-gray-300 text-amber-600 flex-1"
          />
        ) : (
          <h3 
            onClick={(e) => {
              e.stopPropagation();
              if (!isPreviewMode) setIsEditingTitle(true);
            }}
            className={`text-sm font-semibold text-amber-600 flex-1 ${!isPreviewMode ? 'cursor-text hover:text-amber-700' : ''}`}
          >
            {cleanTitle(section.title)}
          </h3>
        )}

        <span className="text-xs text-gray-500">
          {section.questions.length} Items{totalSubitems > 0 ? ` / ${totalSubitems} Subitems` : ''}
        </span>

        {!isPreviewMode && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-gray-200 z-50">
              <DropdownMenuItem onClick={onAddItem} className="text-gray-700 focus:bg-gray-100 focus:text-gray-900">
                <Plus className="h-4 w-4 mr-2" />
                Add item
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem onClick={onDelete} className="text-red-500 focus:bg-gray-100 focus:text-red-600">
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
          <div className="flex items-center border-b border-gray-200 bg-gray-100 text-xs font-medium text-gray-500">
            <div className="w-10 border-r border-gray-200 py-2" />
            <div className="w-8 py-2" />
            <div className="flex-1 min-w-[280px] px-3 py-2 border-r border-gray-200">Item</div>
            <div className="w-[200px] px-2 py-2 border-r border-gray-200">Response</div>
            <div className="flex-1 px-2 py-2 text-center text-gray-400">+ Additional Columns</div>
            <div className="w-16 py-2" />
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
            <div className="flex items-center border-t border-gray-200">
              <div className="w-10" />
              <button
                onClick={onAddItem}
                className="flex items-center gap-2 px-6 py-3 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors w-full text-left"
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
