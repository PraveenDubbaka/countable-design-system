import { useState, useRef, useCallback, useEffect } from 'react';
import { sanitizeHtml } from '@/lib/sanitize';
import { Plus, Trash2, ChevronDown, ChevronRight, MoreHorizontal, Copy, GripVertical, PlusCircle, Circle, Square, Type, Calendar, AlignLeft, Paperclip, ToggleLeft, ListPlus, Menu, DollarSign, FileText, Search, Upload, File, X, Check, Pencil, LayoutGrid } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input as SearchInput } from '@/components/ui/input';
import { Checklist, Question, Section, AnswerType, FormLayout } from '@/types/checklist';
import { FormLayoutEditor } from '@/components/FormLayoutEditor';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AITextarea } from '@/components/AITextarea';
import { RichTextQuestionEditor } from '@/components/RichTextQuestionEditor';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
interface MondayBoardViewProps {
  checklist: Checklist;
  onUpdate: (checklist: Checklist) => void;
  isPreviewMode: boolean;
  isCompactMode?: boolean;
  selectedQuestions?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
}

// Answer type options for dropdown with icons like Monday.com
const ANSWER_TYPE_OPTIONS: {
  value: AnswerType;
  label: string;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
}[] = [{
  value: 'none',
  label: 'None',
  icon: Circle,
  bgColor: 'bg-gray-100',
  iconColor: 'text-gray-400'
}, {
  value: 'yes-no',
  label: 'Yes / No',
  icon: Circle,
  bgColor: 'bg-green-100',
  iconColor: 'text-green-600'
}, {
  value: 'yes-no-na',
  label: 'Yes / No / N/A',
  icon: Circle,
  bgColor: 'bg-green-100',
  iconColor: 'text-green-600'
}, {
  value: 'multiple-choice',
  label: 'Multiple Choice',
  icon: Square,
  bgColor: 'bg-amber-100',
  iconColor: 'text-amber-600'
}, {
  value: 'date',
  label: 'Date',
  icon: Calendar,
  bgColor: 'bg-blue-100',
  iconColor: 'text-blue-600'
}, {
  value: 'long-answer',
  label: 'Answer',
  icon: AlignLeft,
  bgColor: 'bg-purple-100',
  iconColor: 'text-purple-600'
}, {
  value: 'amount',
  label: 'Amount',
  icon: DollarSign,
  bgColor: 'bg-yellow-100',
  iconColor: 'text-yellow-600'
}, {
  value: 'dropdown',
  label: 'Dropdown',
  icon: Menu,
  bgColor: 'bg-teal-100',
  iconColor: 'text-teal-600'
}, {
  value: 'file-upload',
  label: 'File Upload',
  icon: Paperclip,
  bgColor: 'bg-pink-100',
  iconColor: 'text-pink-600'
}, {
  value: 'toggle',
  label: 'Switch/Toggle',
  icon: ToggleLeft,
  bgColor: 'bg-indigo-100',
  iconColor: 'text-indigo-600'
}];

// Column options for add column dropdown
const COLUMN_OPTIONS = [{
  id: 'explanation',
  label: 'Additional Explanation',
  icon: AlignLeft,
  bgColor: 'bg-purple-100',
  iconColor: 'text-purple-600'
}, {
  id: 'reference',
  label: '+ Ref (Attached Document)',
  icon: Paperclip,
  bgColor: 'bg-pink-100',
  iconColor: 'text-pink-600'
}];

// Mock existing documents for demo
const EXISTING_DOCUMENTS = [{
  id: 'doc1',
  name: 'Company Policy.pdf',
  type: 'pdf'
}, {
  id: 'doc2',
  name: 'Guidelines 2024.docx',
  type: 'docx'
}, {
  id: 'doc3',
  name: 'Compliance Checklist.xlsx',
  type: 'xlsx'
}, {
  id: 'doc4',
  name: 'Reference Manual.pdf',
  type: 'pdf'
}];

// Sortable Option Row for edit popovers
interface SortableOptionRowProps {
  id: string;
  value: string;
  index: number;
  onChange: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}
function SortableOptionRow({
  id,
  value,
  index,
  onChange,
  onRemove,
  canRemove
}: SortableOptionRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  return <div ref={setNodeRef} style={style} className="flex items-center gap-1">
      <button type="button" className="p-0.5 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none" {...attributes} {...listeners}>
        <GripVertical className="h-3 w-3" />
      </button>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary" placeholder={`Option ${index + 1}`} />
      <button type="button" onClick={onRemove} disabled={!canRemove} className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>;
}

// Shared Edit Options Popover Content
interface EditOptionsPopoverProps {
  editingOptions: string[];
  setEditingOptions: (options: string[]) => void;
  newOption: string;
  setNewOption: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}
function EditOptionsPopoverContent({
  editingOptions,
  setEditingOptions,
  newOption,
  setNewOption,
  onSave,
  onCancel
}: EditOptionsPopoverProps) {
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3
    }
  }), useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  }));
  const handleDragEnd = (event: DragEndEvent) => {
    const {
      active,
      over
    } = event;
    if (over && active.id !== over.id) {
      const oldIndex = editingOptions.findIndex((_, i) => `option-${i}` === active.id);
      const newIndex = editingOptions.findIndex((_, i) => `option-${i}` === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOptions = [...editingOptions];
        const [removed] = newOptions.splice(oldIndex, 1);
        newOptions.splice(newIndex, 0, removed);
        setEditingOptions(newOptions);
      }
    }
  };
  const handleOptionChange = (index: number, value: string) => {
    const updated = [...editingOptions];
    updated[index] = value;
    setEditingOptions(updated);
  };
  const handleRemoveOption = (index: number) => {
    if (editingOptions.length <= 1) return;
    setEditingOptions(editingOptions.filter((_, i) => i !== index));
  };
  const handleAddOption = () => {
    const trimmed = newOption.trim();
    if (trimmed && !editingOptions.includes(trimmed)) {
      setEditingOptions([...editingOptions, trimmed]);
      setNewOption('');
    }
  };
  return <div className="flex flex-col gap-2">
      <div className="text-xs font-medium text-gray-700 mb-1">Edit Options</div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={editingOptions.map((_, i) => `option-${i}`)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
            {editingOptions.map((opt, i) => <SortableOptionRow key={`option-${i}`} id={`option-${i}`} value={opt} index={i} onChange={value => handleOptionChange(i, value)} onRemove={() => handleRemoveOption(i)} canRemove={editingOptions.length > 1} />)}
          </div>
        </SortableContext>
      </DndContext>
      <div className="flex items-center gap-1.5">
        <input type="text" value={newOption} onChange={e => setNewOption(e.target.value)} onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddOption();
        }
      }} placeholder="Add new option..." className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 border-dashed rounded focus:outline-none focus:ring-1 focus:ring-primary" />
        <button type="button" onClick={handleAddOption} disabled={!newOption.trim()} className="p-1 text-gray-400 hover:text-green-600 disabled:opacity-30">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex justify-end gap-1.5 pt-2 border-t border-gray-200">
        <button type="button" onClick={onCancel} className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors">
          Cancel
        </button>
        <button type="button" onClick={onSave} className="px-2 py-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors">
          Save
        </button>
      </div>
    </div>;
}

// Multiple Choice Field Component with multi-select and edit support
interface MultipleChoiceFieldProps {
  options: string[];
  selectedAnswers: string[];
  onAnswerChange: (answers: string[]) => void;
  onOptionsChange: (options: string[]) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}
function MultipleChoiceField({
  options,
  selectedAnswers,
  onAnswerChange,
  onOptionsChange,
  disabled,
  size = 'md'
}: MultipleChoiceFieldProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingOptions, setEditingOptions] = useState<string[]>([...options]);
  const [newOption, setNewOption] = useState('');

  // Store refs for callbacks to avoid stale closures
  const onOptionsChangeRef = useRef(onOptionsChange);
  const onAnswerChangeRef = useRef(onAnswerChange);
  onOptionsChangeRef.current = onOptionsChange;
  onAnswerChangeRef.current = onAnswerChange;
  const toggleSelection = (opt: string) => {
    if (disabled) return;
    const isSelected = selectedAnswers.includes(opt);
    if (isSelected) {
      onAnswerChange(selectedAnswers.filter(a => a !== opt));
    } else {
      onAnswerChange([...selectedAnswers, opt]);
    }
  };
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setEditingOptions([...options]);
      setNewOption('');
    }
    setIsEditOpen(open);
  };
  const handleSaveEdit = () => {
    const validOptions = editingOptions.filter(o => o.trim() !== '');
    if (validOptions.length > 0) {
      onOptionsChangeRef.current(validOptions);
      const validAnswers = selectedAnswers.filter(a => validOptions.includes(a));
      if (validAnswers.length !== selectedAnswers.length) {
        onAnswerChangeRef.current(validAnswers);
      }
    }
    setIsEditOpen(false);
    setNewOption('');
  };
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const padding = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-1';
  const checkSize = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';
  return <div className="flex items-start gap-1.5">
      <div className="flex flex-col gap-1">
        {options.map((opt, i) => {
        const isSelected = selectedAnswers.includes(opt);
        return <button key={i} onClick={e => {
          e.stopPropagation();
          toggleSelection(opt);
        }} className={`${padding} ${textSize} rounded transition-all flex items-center gap-1 whitespace-nowrap ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
              {isSelected && <Check className={checkSize} />}
              {opt}
            </button>;
      })}
      </div>
      {!disabled && <Popover open={isEditOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <button onClick={e => e.stopPropagation()} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Edit options">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 bg-white border border-gray-200 shadow-lg z-50" align="start" onClick={e => e.stopPropagation()}>
            <EditOptionsPopoverContent editingOptions={editingOptions} setEditingOptions={setEditingOptions} newOption={newOption} setNewOption={setNewOption} onSave={handleSaveEdit} onCancel={() => setIsEditOpen(false)} />
          </PopoverContent>
        </Popover>}
    </div>;
}

// Dropdown Field Component with edit support
interface DropdownFieldProps {
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  onOptionsChange: (options: string[]) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}
function DropdownField({
  options,
  selectedValue,
  onValueChange,
  onOptionsChange,
  disabled,
  size = 'md'
}: DropdownFieldProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingOptions, setEditingOptions] = useState<string[]>([...options]);
  const [newOption, setNewOption] = useState('');

  // Store refs for callbacks to avoid stale closures
  const onOptionsChangeRef = useRef(onOptionsChange);
  const onValueChangeRef = useRef(onValueChange);
  onOptionsChangeRef.current = onOptionsChange;
  onValueChangeRef.current = onValueChange;
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setEditingOptions([...options]);
      setNewOption('');
    }
    setIsEditOpen(open);
  };
  const handleSaveEdit = () => {
    const validOptions = editingOptions.filter(o => o.trim() !== '');
    if (validOptions.length > 0) {
      onOptionsChangeRef.current(validOptions);
      // Clear selection if it no longer exists
      if (selectedValue && !validOptions.includes(selectedValue)) {
        onValueChangeRef.current('');
      }
    }
    setIsEditOpen(false);
    setNewOption('');
  };
  const selectHeight = size === 'sm' ? 'h-7' : 'h-8';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  return <div className="flex items-center gap-1 w-full overflow-hidden">
      <select value={selectedValue} onChange={e => {
      e.stopPropagation();
      onValueChange(e.target.value);
    }} onClick={e => e.stopPropagation()} className={`${selectHeight} px-2 ${textSize} bg-gray-100 border-gray-300 text-gray-700 rounded flex-1 min-w-0 truncate`}>
        <option value="">Select...</option>
        {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
      </select>
      {!disabled && <Popover open={isEditOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <button onClick={e => e.stopPropagation()} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors shrink-0" title="Edit options">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 bg-white border border-gray-200 shadow-lg z-50" align="start" onClick={e => e.stopPropagation()}>
            <EditOptionsPopoverContent editingOptions={editingOptions} setEditingOptions={setEditingOptions} newOption={newOption} setNewOption={setNewOption} onSave={handleSaveEdit} onCancel={() => setIsEditOpen(false)} />
          </PopoverContent>
        </Popover>}
    </div>;
}

// Reference Button Component
interface RefButtonProps {
  reference?: {
    name: string;
    id?: string;
  } | null;
  onAttach: (doc: {
    name: string;
    id?: string;
  }) => void;
  onRemove: () => void;
  disabled?: boolean;
}
function RefButton({
  reference,
  onAttach,
  onRemove,
  disabled
}: RefButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filteredDocs = EXISTING_DOCUMENTS.filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAttach({
        name: file.name
      });
      setIsOpen(false);
      setSearchTerm('');
    }
    e.target.value = '';
  };
  // In preview mode, still show the + Ref button but display attached reference read-only style
  if (disabled && reference) {
    return <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-600 bg-gray-100 rounded">
        <File className="h-3 w-3" />
        <span className="truncate max-w-[120px]">{reference.name}</span>
      </div>;
  }
  if (reference) {
    return <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
        <File className="h-3 w-3 shrink-0" />
        <span className="truncate max-w-[100px]">{reference.name}</span>
        <button onClick={e => {
        e.stopPropagation();
        onRemove();
      }} className="p-0.5 hover:bg-blue-100 rounded shrink-0">
          <X className="h-3 w-3" />
        </button>
      </div>;
  }
  return <>
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md border border-dashed border-blue-300 transition-colors">
            <Paperclip className="h-3.5 w-3.5" />
            <span>+ Ref</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-0 bg-slate-800 border-slate-700 shadow-xl z-50" sideOffset={5}>
          {/* Search input */}
          <div className="p-3 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <SearchInput value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search documents..." className="pl-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 h-9 text-sm" />
            </div>
          </div>

          {/* Upload new document option */}
          <div className="p-2 border-b border-slate-700">
            <button onClick={e => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-md hover:bg-slate-700 transition-colors text-left">
              <div className="w-7 h-7 rounded flex items-center justify-center bg-green-100">
                <Upload className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-white">Upload new document</span>
            </button>
          </div>

          {/* Existing documents */}
          <div className="p-2 max-h-48 overflow-y-auto">
            <p className="text-xs text-slate-400 px-2 py-1 mb-1">Existing documents</p>
            {filteredDocs.length > 0 ? <div className="space-y-1">
                {filteredDocs.map(doc => <button key={doc.id} onClick={e => {
              e.stopPropagation();
              onAttach({
                id: doc.id,
                name: doc.name
              });
              setIsOpen(false);
              setSearchTerm('');
            }} className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-slate-700 transition-colors text-left">
                    <File className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-white truncate">{doc.name}</span>
                  </button>)}
              </div> : <p className="text-sm text-slate-400 text-center py-3">No documents found</p>}
          </div>
        </PopoverContent>
      </Popover>
    </>;
}

// Strip HTML tags from text for clean display
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

// Add Column Button Component
interface AddColumnButtonProps {
  onAddColumn: (columnId: string) => void;
  visibleColumns: {
    explanation: boolean;
    reference: boolean;
  };
}
function AddColumnButton({
  onAddColumn,
  visibleColumns
}: AddColumnButtonProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const filteredOptions = COLUMN_OPTIONS.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()) && !visibleColumns[opt.id as keyof typeof visibleColumns]);
  return <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="w-10 h-full flex items-center justify-center hover:bg-[#EDF2F7] transition-colors">
          <Plus className="h-4 w-4 text-gray-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0 bg-slate-800 border-slate-700 shadow-xl z-50" sideOffset={5}>
        {/* Column options */}
        <div className="p-2">
          {filteredOptions.length > 0 ? <div className="grid grid-cols-2 gap-2">
              {filteredOptions.map(opt => {
            const IconComponent = opt.icon;
            return <button key={opt.id} onClick={() => {
              onAddColumn(opt.id);
              setIsOpen(false);
              setSearchTerm('');
            }} className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-slate-700 transition-colors text-left">
                    <div className={`w-7 h-7 rounded flex items-center justify-center ${opt.bgColor}`}>
                      <IconComponent className={`h-4 w-4 ${opt.iconColor}`} />
                    </div>
                    <span className="text-sm text-white">{opt.label}</span>
                  </button>;
          })}
            </div> : <p className="text-sm text-slate-400 text-center py-4">All columns are already visible</p>}
        </div>
      </PopoverContent>
    </Popover>;
}

// Response Type Dropdown Component (Monday.com style)
interface ResponseTypeDropdownProps {
  currentType: AnswerType;
  onTypeChange: (type: AnswerType) => void;
  disabled?: boolean;
}
function ResponseTypeDropdown({
  currentType,
  onTypeChange,
  disabled
}: ResponseTypeDropdownProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const currentTypeConfig = ANSWER_TYPE_OPTIONS.find(o => o.value === currentType) || ANSWER_TYPE_OPTIONS[0];
  const CurrentTypeIcon = currentTypeConfig.icon;
  const filteredOptions = ANSWER_TYPE_OPTIONS.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));
  if (disabled) {
    return null;
  }
  return <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button onClick={e => e.stopPropagation()} className="flex items-center justify-center p-1 hover:bg-gray-100 rounded transition-colors pt-[4px]" title={currentTypeConfig.label}>
          <div className={`w-7 h-7 rounded flex items-center justify-center ${currentTypeConfig.bgColor}`}>
            <CurrentTypeIcon className={`h-4 w-4 ${currentTypeConfig.iconColor}`} />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0 bg-slate-800 border-slate-700 shadow-xl z-50" sideOffset={5}>
        
        {/* Response type options */}
        <div className="p-2">
          <div className="grid grid-cols-2 gap-1.5">
            {filteredOptions.map(opt => {
            const IconComponent = opt.icon;
            const isSelected = opt.value === currentType;
            return <button key={opt.value} onClick={e => {
              e.stopPropagation();
              onTypeChange(opt.value);
              setIsOpen(false);
              setSearchTerm('');
            }} className={`flex items-center gap-2 px-2 py-2 rounded-md transition-colors text-left ${isSelected ? 'bg-slate-600' : 'hover:bg-slate-700'}`}>
                  <div className={`w-6 h-6 shrink-0 rounded flex items-center justify-center ${opt.bgColor}`}>
                    <IconComponent className={`h-3.5 w-3.5 ${opt.iconColor}`} />
                  </div>
                  <span className="text-xs text-white whitespace-nowrap truncate">{opt.label}</span>
                </button>;
          })}
          </div>
        </div>
      </PopoverContent>
    </Popover>;
}

// Sortable Sub-item row component
interface SubItemRowProps {
  subItem: Question;
  index: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  isPreviewMode: boolean;
  isCompactMode: boolean;
  parentId: string;
  visibleColumns: {
    explanation: boolean;
    reference: boolean;
  };
  columnWidths: {
    questions: number;
    response: number;
    explanation: number;
    reference: number;
  };
  sectionNumber: number;
  itemNumber: number;
}
interface SortableSubItemRowProps extends SubItemRowProps {
  isLast: boolean;
  totalCount: number;
  isNewEmpty?: boolean;
  onBlurCleanup?: () => void;
}
function SortableSubItemRow({
  subItem,
  onUpdate,
  onDelete,
  isPreviewMode,
  isCompactMode,
  index,
  parentId,
  isLast,
  totalCount,
  visibleColumns,
  columnWidths,
  isNewEmpty,
  onBlurCleanup,
  sectionNumber,
  itemNumber
}: SortableSubItemRowProps) {
  const [isEditingName, setIsEditingName] = useState(isNewEmpty || false);
  const [isSelected, setIsSelected] = useState(false);
  const draftNameRef = useRef(subItem.text);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    active
  } = useSortable({
    id: subItem.id,
    data: {
      type: 'subitem',
      parentId,
      subItem
    }
  });

  // Check if this is a valid drop target
  const isDropTarget = isOver && active?.id !== subItem.id;
  const activeType = active?.data?.current?.type;
  const isValidDropTarget = isDropTarget && activeType === 'subitem';
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  const handleSave = () => {
    const trimmed = draftNameRef.current.trim();
    if (trimmed && trimmed !== subItem.text) {
      onUpdate({
        ...subItem,
        text: trimmed
      });
    }
    setIsEditingName(false);
  };
  const handleCancel = () => {
    draftNameRef.current = subItem.text;
    setIsEditingName(false);
    // If this was a new empty sub-item and user cancelled, trigger cleanup
    if (isNewEmpty && subItem.text.trim() === '') {
      onBlurCleanup?.();
    }
  };
  const handleAnswerChange = (answer: string) => {
    onUpdate({
      ...subItem,
      answer
    });
  };
  const handleAnswerTypeChange = (answerType: AnswerType) => {
    onUpdate({
      ...subItem,
      answerType,
      answer: ''
    });
  };
  const renderResponseField = () => {
    switch (subItem.answerType) {
      case 'yes-no':
      case 'yes-no-na':
        const options = subItem.answerType === 'yes-no' ? ['Yes', 'No'] : ['Yes', 'No', 'N/A'];
        return <div className="flex gap-1">
            {options.map(opt => <button key={opt} onClick={e => {
            e.stopPropagation();
            handleAnswerChange(opt);
          }} className={`px-2 py-1 text-xs rounded transition-all ${subItem.answer === opt ? 'bg-primary text-primary-foreground' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
                {opt}
              </button>)}
          </div>;
      case 'multiple-choice':
        const mcSubOptions = subItem.options || ['Option 1', 'Option 2', 'Option 3'];
        const subSelectedAnswers = subItem.answer ? subItem.answer.split('|||').filter(a => a) : [];
        return <MultipleChoiceField options={mcSubOptions} selectedAnswers={subSelectedAnswers} onAnswerChange={answers => onUpdate({
          ...subItem,
          answer: answers.join('|||')
        })} onOptionsChange={opts => onUpdate({
          ...subItem,
          options: opts
        })} disabled={isPreviewMode} size="sm" />;
      case 'dropdown':
        const dropdownSubOptions = subItem.options || ['Option 1', 'Option 2'];
        return <DropdownField options={dropdownSubOptions} selectedValue={subItem.answer || ''} onValueChange={value => onUpdate({
          ...subItem,
          answer: value
        })} onOptionsChange={opts => onUpdate({
          ...subItem,
          options: opts
        })} disabled={isPreviewMode} size="sm" />;
      case 'long-answer':
        return <AITextarea value={subItem.answer || ''} onChange={val => handleAnswerChange(val)} placeholder="Enter your detailed answer..." minHeight="60px" isCompactMode={isCompactMode} />;
      case 'none':
        return null;
      case 'date':
        return <Input type="date" value={subItem.answer || ''} onChange={e => handleAnswerChange(e.target.value)} onClick={e => e.stopPropagation()} className="h-7 text-xs bg-gray-100 border-gray-300 text-gray-700" />;
      case 'amount':
        return <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
          <Input type="number" value={subItem.answer || ''} onChange={e => handleAnswerChange(e.target.value)} onClick={e => e.stopPropagation()} placeholder="0.00" className="h-7 text-xs bg-gray-100 border-gray-300 text-gray-700 pl-5" />
        </div>;
      case 'file-upload':
        return <div className="flex items-center gap-1">
          {subItem.answer ? <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              <File className="h-3 w-3" />
              <span className="truncate max-w-[80px]">{subItem.answer}</span>
              {!isPreviewMode && <button onClick={() => handleAnswerChange('')} className="hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>}
            </div> : <label className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
              <Upload className="h-3 w-3" />
              <span>Upload</span>
              <input type="file" className="hidden" onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleAnswerChange(file.name);
            }} />
            </label>}
        </div>;
      case 'toggle':
        return <button onClick={e => {
          e.stopPropagation();
          handleAnswerChange(subItem.answer === 'true' ? 'false' : 'true');
        }} className={`w-10 h-5 rounded-full transition-colors relative ${subItem.answer === 'true' ? 'bg-blue-600' : 'bg-gray-300'}`}>
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${subItem.answer === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>;
      default:
        return <Input value={subItem.answer || ''} onChange={e => handleAnswerChange(e.target.value)} onClick={e => e.stopPropagation()} placeholder="Enter response..." className="h-7 text-xs bg-gray-100 border-gray-300 text-gray-700" />;
    }
  };
  return <div ref={setNodeRef} style={style} {...!isPreviewMode ? {
    ...attributes,
    ...listeners
  } : {}} className={`group flex items-stretch hover:bg-[#EDF2F7] transition-all relative border-b border-[#E8EDF2] ${!isPreviewMode ? 'cursor-grab active:cursor-grabbing' : ''} ${isDragging ? 'opacity-50 ring-2 ring-primary ring-offset-1 z-10' : ''} ${isValidDropTarget ? 'bg-primary/5' : ''}`}>
      {/* Drop indicator line */}
      {isValidDropTarget && <div className="absolute -top-[2px] left-0 right-0 h-1 bg-primary rounded-full z-20 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
      {/* Checkbox column */}
      <div className="w-10 shrink-0 flex items-center justify-center self-center">
        <Checkbox checked={isSelected} onCheckedChange={() => setIsSelected(!isSelected)} className="h-4 w-4 border-gray-400 bg-white" />
      </div>

      {/* Sub-item name - width matches header */}
      <div className="shrink-0 px-3 py-2.5 flex items-center gap-2" style={{
      width: columnWidths.questions
    }}>
        <span className="text-xs font-medium text-gray-500 shrink-0">{sectionNumber}.{itemNumber}.{index + 1}</span>
        {isEditingName && !isPreviewMode ? <RichTextQuestionEditor value={subItem.text} onChange={newValue => {
        draftNameRef.current = newValue;
      }} onBlur={() => {
        handleSave();
        // If text is still empty after blur, trigger cleanup
        if (draftNameRef.current.trim() === '' && isNewEmpty) {
          setTimeout(() => onBlurCleanup?.(), 100);
        }
      }} onCancel={handleCancel} className="text-sm min-h-[32px] bg-gray-100 border-gray-300 text-gray-800" /> : isCompactMode ? <Tooltip>
            <TooltipTrigger asChild>
              <div onClick={e => {
            if (!isPreviewMode) {
              e.stopPropagation();
              draftNameRef.current = subItem.text;
              setIsEditingName(true);
            }
          }} className={`text-sm text-gray-700 ${!isPreviewMode ? 'cursor-text hover:text-gray-900' : ''} line-clamp-1 overflow-hidden`} dangerouslySetInnerHTML={{
            __html: sanitizeHtml(subItem.text) || 'Click to add sub-item...'
          }} />
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-white text-gray-800 border border-gray-200 shadow-lg max-w-md">
              <div dangerouslySetInnerHTML={{
            __html: sanitizeHtml(subItem.text)
          }} />
            </TooltipContent>
          </Tooltip> : <div onClick={e => {
        if (!isPreviewMode) {
          e.stopPropagation();
          draftNameRef.current = subItem.text;
          setIsEditingName(true);
        }
      }} className={`text-sm text-gray-700 ${!isPreviewMode ? 'cursor-text hover:text-gray-900' : ''}`} dangerouslySetInnerHTML={{
        __html: sanitizeHtml(subItem.text) || 'Click to add sub-item...'
      }} />}
      </div>

      {/* Response column with inline type selector and response field */}
      <div className="shrink-0 px-2 py-2 border-l border-[#E8EDF2] flex items-stretch" style={{
      width: columnWidths.response
    }}>
        <div className="flex items-center gap-2 w-full">
          <ResponseTypeDropdown currentType={subItem.answerType} onTypeChange={handleAnswerTypeChange} disabled={isPreviewMode} />
          <div className="flex-1 min-w-0">
            {renderResponseField()}
          </div>
        </div>
      </div>

      {/* Additional Explanation column - conditionally rendered */}
      {visibleColumns.explanation && <div className="shrink-0 px-2 py-2 border-l border-[#E8EDF2] flex items-center" style={{
      width: columnWidths.explanation
    }}>
          {(subItem as any).showExplanation !== false ? <div className="relative group/exp w-full">
              <AITextarea value={subItem.explanation || ''} onChange={val => onUpdate({
          ...subItem,
          explanation: val
        })} placeholder="Additional Explanation" minHeight="40px" isCompactMode={isCompactMode} />
              {!isPreviewMode && <button onClick={() => onUpdate({
          ...subItem,
          showExplanation: false,
          explanation: ''
        } as any)} className="absolute -top-1 -right-1 p-0.5 bg-white border border-gray-300 rounded-full text-gray-400 hover:text-red-500 hover:border-red-300 opacity-0 group-hover/exp:opacity-100 transition-opacity shadow-sm" title="Remove explanation">
                  <X className="h-3 w-3" />
                </button>}
            </div> : !isPreviewMode && <button onClick={() => onUpdate({
        ...subItem,
        showExplanation: true
      } as any)} className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-primary hover:bg-[#EDF2F7] rounded transition-colors">
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>}
        </div>}

      {/* Reference column - conditionally rendered */}
      {visibleColumns.reference && <div className="shrink-0 px-2 py-2 flex items-center border-l border-[#E8EDF2]" style={{
      width: columnWidths.reference
    }}>
          <RefButton reference={(subItem as any).reference} onAttach={doc => onUpdate({
        ...subItem,
        reference: doc
      } as any)} onRemove={() => onUpdate({
        ...subItem,
        reference: null
      } as any)} disabled={isPreviewMode} />
        </div>}

      {/* Add column placeholder to maintain alignment - always show when columns hidden */}
      {!isPreviewMode && (!visibleColumns.explanation || !visibleColumns.reference) && <div className="w-[100px] shrink-0" />}

      {/* Actions - delete button */}
      <div className="w-16 shrink-0 flex items-center justify-center self-center">
        {!isPreviewMode && <button onClick={e => {
        e.stopPropagation();
        onDelete();
      }} className="p-1 rounded hover:bg-[#EDF2F7] text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
            <Trash2 className="h-4 w-4" />
          </button>}
      </div>
    </div>;
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
  onAddItemAtPosition: (position: 'above' | 'below') => void;
  isPreviewMode: boolean;
  isCompactMode: boolean;
  onSubItemsReorder: (itemId: string, newSubItems: Question[]) => void;
  visibleColumns: {
    explanation: boolean;
    reference: boolean;
  };
  columnWidths: {
    questions: number;
    response: number;
    explanation: number;
    reference: number;
  };
  sectionNumber: number;
  isSelected: boolean;
  onSelectionChange: (selected: boolean) => void;
}
function SortableItemRow({
  item,
  sectionId,
  itemIndex,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddSubItem,
  onAddItemAtPosition,
  isPreviewMode,
  isCompactMode,
  onSubItemsReorder,
  visibleColumns,
  columnWidths,
  sectionNumber,
  isSelected,
  onSelectionChange
}: ItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPendingSubItem, setIsPendingSubItem] = useState(false);
  const draftNameRef = useRef(item.text);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    active
  } = useSortable({
    id: item.id,
    data: {
      type: 'item',
      sectionId,
      item
    }
  });

  // Check if this is a valid drop target (item being dragged over)
  const isDropTarget = isOver && active?.id !== item.id;
  const activeType = active?.data?.current?.type;
  const isValidDropTarget = isDropTarget && activeType === 'item';
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  const hasSubItems = item.subQuestions && item.subQuestions.length > 0;
  const hasRealSubItems = hasSubItems && item.subQuestions!.some(sq => sq.text.trim() !== '');

  // Handle chevron click - expand to add sub-item section
  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasSubItems) {
      setIsExpanded(!isExpanded);
    } else {
      // Start adding a new sub-item
      setIsPendingSubItem(true);
      setIsExpanded(true);
      onAddSubItem();
    }
  };

  // Clean up empty sub-items when collapsing or losing focus
  const cleanupEmptySubItems = () => {
    if (item.subQuestions) {
      const nonEmptySubItems = item.subQuestions.filter(sq => sq.text.trim() !== '');
      if (nonEmptySubItems.length !== item.subQuestions.length) {
        onUpdate({
          ...item,
          subQuestions: nonEmptySubItems.length > 0 ? nonEmptySubItems : undefined
        });
      }
      if (nonEmptySubItems.length === 0) {
        setIsExpanded(false);
        setIsPendingSubItem(false);
      }
    }
  };
  const handleSave = () => {
    const trimmed = draftNameRef.current.trim();
    if (trimmed && trimmed !== item.text) {
      onUpdate({
        ...item,
        text: trimmed
      });
    }
    setIsEditingName(false);
  };
  const handleCancel = () => {
    draftNameRef.current = item.text;
    setIsEditingName(false);
  };
  const handleAnswerChange = (answer: string) => {
    onUpdate({
      ...item,
      answer
    });
  };
  const handleAnswerTypeChange = (answerType: AnswerType) => {
    onUpdate({
      ...item,
      answerType,
      answer: ''
    });
  };
  const handleSubItemUpdate = (index: number, updatedSub: Question) => {
    const newSubQuestions = [...(item.subQuestions || [])];
    newSubQuestions[index] = updatedSub;
    onUpdate({
      ...item,
      subQuestions: newSubQuestions
    });
  };
  const handleSubItemDelete = (index: number) => {
    const newSubQuestions = (item.subQuestions || []).filter((_, i) => i !== index);
    onUpdate({
      ...item,
      subQuestions: newSubQuestions
    });
  };
  const renderResponseField = () => {
    switch (item.answerType) {
      case 'yes-no':
      case 'yes-no-na':
        const options = item.answerType === 'yes-no' ? ['Yes', 'No'] : ['Yes', 'No', 'N/A'];
        return <div className="flex gap-1">
            {options.map(opt => <button key={opt} onClick={e => {
            e.stopPropagation();
            handleAnswerChange(opt);
          }} className={`px-2 py-1 text-xs rounded transition-all ${item.answer === opt ? 'bg-primary text-primary-foreground' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
                {opt}
              </button>)}
          </div>;
      case 'multiple-choice':
        const mcItemOptions = item.options || ['Option 1', 'Option 2', 'Option 3'];
        const itemSelectedAnswers = item.answer ? item.answer.split('|||').filter(a => a) : [];
        return <MultipleChoiceField options={mcItemOptions} selectedAnswers={itemSelectedAnswers} onAnswerChange={answers => onUpdate({
          ...item,
          answer: answers.join('|||')
        })} onOptionsChange={opts => onUpdate({
          ...item,
          options: opts
        })} disabled={isPreviewMode} size="sm" />;
      case 'dropdown':
        const dropdownItemOptions = item.options || ['Option 1', 'Option 2'];
        return <DropdownField options={dropdownItemOptions} selectedValue={item.answer || ''} onValueChange={value => onUpdate({
          ...item,
          answer: value
        })} onOptionsChange={opts => onUpdate({
          ...item,
          options: opts
        })} disabled={isPreviewMode} size="md" />;
      case 'long-answer':
        return <AITextarea value={item.answer || ''} onChange={val => handleAnswerChange(val)} placeholder="Enter your detailed answer..." minHeight="60px" isCompactMode={isCompactMode} />;
      case 'none':
        return null;
      case 'date':
        return <Input type="date" value={item.answer || ''} onChange={e => handleAnswerChange(e.target.value)} onClick={e => e.stopPropagation()} className="h-8 text-sm bg-gray-100 border-gray-300 text-gray-700" />;
      case 'amount':
        return <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
          <Input type="number" value={item.answer || ''} onChange={e => handleAnswerChange(e.target.value)} onClick={e => e.stopPropagation()} placeholder="0.00" className="h-8 text-sm bg-gray-100 border-gray-300 text-gray-700 pl-5" />
        </div>;
      case 'file-upload':
        return <div className="flex items-center gap-1">
          {item.answer ? <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              <File className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{item.answer}</span>
              <button onClick={() => handleAnswerChange('')} className="hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </div> : <label className="flex items-center gap-1.5 px-2 py-1.5 text-xs bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
              <Upload className="h-3.5 w-3.5" />
              <span>Upload file</span>
              <input type="file" className="hidden" onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleAnswerChange(file.name);
            }} />
            </label>}
        </div>;
      case 'toggle':
        return <button onClick={e => {
          e.stopPropagation();
          handleAnswerChange(item.answer === 'true' ? 'false' : 'true');
        }} className={`w-11 h-6 rounded-full transition-colors relative ${item.answer === 'true' ? 'bg-blue-600' : 'bg-gray-300'}`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.answer === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>;
      default:
        return <Input value={item.answer || ''} onChange={e => handleAnswerChange(e.target.value)} onClick={e => e.stopPropagation()} placeholder="Enter response..." className="h-8 text-sm bg-gray-100 border-gray-300 text-gray-700" />;
    }
  };
  const subItemIds = item.subQuestions?.map(sq => sq.id) || [];
  return <div ref={setNodeRef} style={style} className={`border-t border-[#E0E6ED] relative ${isDragging ? 'z-10' : ''}`}>
      {/* Drop indicator line - shows above item when hovering */}
      {isValidDropTarget && <div className="absolute -top-[2px] left-0 right-0 h-1 bg-primary rounded-full z-20 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
      {/* Main item row - full row is draggable */}
      <div {...!isPreviewMode && !isEditingName ? {
      ...attributes,
      ...listeners
    } : {}} className={`group flex items-stretch hover:bg-[#EDF2F7] transition-all border-b border-[#E8EDF2] ${isSelected ? 'bg-[#EDF2F7]' : ''} ${!isPreviewMode && !isEditingName ? 'cursor-grab active:cursor-grabbing' : ''} ${isDragging ? 'opacity-50 ring-2 ring-primary ring-offset-1' : ''} ${isValidDropTarget ? 'bg-primary/5' : ''}`}>
        {/* Checkbox */}
        <div className="w-10 shrink-0 flex items-center justify-center self-center">
          <Checkbox checked={isSelected} onCheckedChange={checked => onSelectionChange(checked === true)} className="h-4 w-4 border-gray-400" />
        </div>

        {/* Expand arrow - Monday.com style: dull on hover, solid when has sub-items */}
        <div className="w-8 shrink-0 flex items-center justify-center self-center">
          {hasRealSubItems ? <button onClick={handleChevronClick} className="p-0.5 rounded hover:bg-gray-200 transition-colors" title={isExpanded ? "Collapse sub-items" : "Expand sub-items"}>
              {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-600" /> : <ChevronRight className="h-4 w-4 text-gray-600" />}
            </button> : !isPreviewMode ? <button onClick={handleChevronClick} className="p-0.5 rounded hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100" title="Add sub-item">
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button> : <div className="w-4" />}
        </div>

        {/* Item name */}
        <div className="shrink-0 px-3 py-1 flex items-center gap-2" style={{
        width: columnWidths.questions
      }}>
          <span className="text-xs font-medium text-gray-500 shrink-0">
            {sectionNumber}.{itemIndex + 1}
          </span>
          {isEditingName && !isPreviewMode ? <RichTextQuestionEditor value={item.text} onChange={newValue => {
          draftNameRef.current = newValue;
        }} onBlur={handleSave} onCancel={handleCancel} className="text-sm min-h-[36px] bg-gray-100 border-gray-300 text-gray-800 flex-1" /> : <div className="flex items-center gap-2 flex-1 min-w-0">
              {isCompactMode ? <Tooltip>
                  <TooltipTrigger asChild>
                    <div onClick={e => {
                if (!isPreviewMode) {
                  e.stopPropagation();
                  draftNameRef.current = item.text;
                  setIsEditingName(true);
                }
              }} className={`text-sm text-gray-800 ${!isPreviewMode ? 'cursor-text hover:text-gray-900' : ''} py-1 line-clamp-1`} style={{display: 'flex', alignItems: 'baseline'}}>
                      <span className="inline" style={{display: 'inline'}} dangerouslySetInnerHTML={{
                __html: sanitizeHtml(item.text) || 'Click to add item name...'
              }} />
                      {item.required && isPreviewMode && <span className="text-red-500 font-medium shrink-0">*</span>}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white text-gray-800 border border-gray-200 shadow-lg max-w-md">
                    <div dangerouslySetInnerHTML={{
                __html: sanitizeHtml(item.text)
              }} />
                  </TooltipContent>
                </Tooltip> : <div onClick={e => {
            if (!isPreviewMode) {
              e.stopPropagation();
              draftNameRef.current = item.text;
              setIsEditingName(true);
            }
          }} className={`text-sm text-gray-800 flex-1 ${!isPreviewMode ? 'cursor-text hover:text-gray-900' : ''} py-2`} style={{display: 'flex', alignItems: 'baseline', flexWrap: 'wrap'}}>
                <span className="inline" style={{display: 'inline'}} dangerouslySetInnerHTML={{
            __html: sanitizeHtml(item.text) || 'Click to add item name...'
          }} />
                {item.required && isPreviewMode && <span className="text-red-500 font-medium shrink-0">*</span>}
              </div>}
              {hasRealSubItems && <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium shrink-0 cursor-default">
                      {item.subQuestions!.filter(sq => sq.text.trim() !== '').length}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white text-gray-800 border border-gray-200 shadow-lg">
                    {item.subQuestions!.filter(sq => sq.text.trim() !== '').length === 1 ? '1 Sub-question' : `${item.subQuestions!.filter(sq => sq.text.trim() !== '').length} Sub-questions`}
                  </TooltipContent>
                </Tooltip>}
            </div>}
        </div>

        {/* Response column with inline type selector and response field */}
        <div className="shrink-0 px-2 py-2 border-l border-[#E8EDF2] flex items-stretch" style={{
        width: columnWidths.response
      }}>
          <div className="flex items-center gap-2 w-full">
            <ResponseTypeDropdown currentType={item.answerType} onTypeChange={handleAnswerTypeChange} disabled={isPreviewMode} />
            <div className="flex-1 min-w-0">
              {renderResponseField()}
            </div>
          </div>
        </div>

        {/* Additional Explanation column - conditionally rendered */}
        {visibleColumns.explanation && <div className="shrink-0 px-2 py-2 border-l border-[#E8EDF2] flex items-center" style={{
        width: columnWidths.explanation
      }}>
            {(item as any).showExplanation !== false ? <div className="relative group/exp w-full">
                <AITextarea value={item.explanation || ''} onChange={val => onUpdate({
            ...item,
            explanation: val
          })} placeholder="Additional Explanation" minHeight="40px" isCompactMode={isCompactMode} />
                {!isPreviewMode && <button onClick={() => onUpdate({
            ...item,
            showExplanation: false,
            explanation: ''
          } as any)} className="absolute -top-1 -right-1 p-0.5 bg-white border border-gray-300 rounded-full text-gray-400 hover:text-red-500 hover:border-red-300 opacity-0 group-hover/exp:opacity-100 transition-opacity shadow-sm" title="Remove explanation">
                    <X className="h-3 w-3" />
                  </button>}
              </div> : !isPreviewMode && <button onClick={() => onUpdate({
          ...item,
          showExplanation: true
        } as any)} className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-primary hover:bg-[#EDF2F7] rounded transition-colors">
                  <Plus className="h-3 w-3" />
                  <span>Add</span>
                </button>}
          </div>}

        {/* Reference column - conditionally rendered */}
        {visibleColumns.reference && <div className="shrink-0 px-2 py-2 flex items-center border-l border-[#E8EDF2]" style={{
        width: columnWidths.reference
      }}>
            <RefButton reference={(item as any).reference} onAttach={doc => onUpdate({
          ...item,
          reference: doc
        } as any)} onRemove={() => onUpdate({
          ...item,
          reference: null
        } as any)} disabled={isPreviewMode} />
          </div>}

        {/* Add column placeholder to maintain alignment */}
        {!isPreviewMode && (!visibleColumns.explanation || !visibleColumns.reference) && <div className="w-[100px] shrink-0" />}

        {/* Actions menu */}
        <div className="w-16 shrink-0 flex items-center justify-center gap-1 self-center">
          {!isPreviewMode && <>
              <button onClick={e => {
            e.stopPropagation();
            onAddSubItem();
          }} className="p-1.5 rounded hover:bg-[#EDF2F7] opacity-0 group-hover:opacity-100 transition-all text-gray-400 hover:text-gray-700" title="Add sub-item">
                <PlusCircle className="h-4 w-4" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button onClick={e => e.stopPropagation()} className="p-1.5 rounded hover:bg-[#EDF2F7] opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white z-50">
                  <div 
                    className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-700 hover:bg-[#EDF2F7] rounded-sm cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onUpdate({ ...item, required: !item.required });
                    }}
                  >
                    <span>Required</span>
                    <Switch 
                      checked={item.required || false} 
                      onCheckedChange={(checked) => onUpdate({ ...item, required: checked })}
                      className="h-4 w-8 data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300"
                    />
                  </div>
                  <DropdownMenuSeparator className="bg-[#EDF2F7]" />
                  <DropdownMenuItem onClick={onAddSubItem} className="text-gray-700 focus:bg-[#EDF2F7] focus:text-gray-900">
                    <Plus className="h-4 w-4 mr-2" />
                    Add sub-item
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#EDF2F7]" />
                  <div className="px-2 py-1.5 text-xs font-medium text-gray-500">Add item</div>
                  <DropdownMenuItem onClick={() => onAddItemAtPosition('above')} className="text-gray-700 focus:bg-[#EDF2F7] focus:text-gray-900 pl-4">
                    <ChevronDown className="h-4 w-4 mr-2 rotate-180" />
                    Above this item
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAddItemAtPosition('below')} className="text-gray-700 focus:bg-[#EDF2F7] focus:text-gray-900 pl-4">
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Below this item
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#EDF2F7]" />
                  <DropdownMenuItem onClick={onDuplicate} className="text-gray-700 focus:bg-[#EDF2F7] focus:text-gray-900">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#EDF2F7]" />
                  <DropdownMenuItem onClick={onDelete} className="text-red-500 focus:bg-[#EDF2F7] focus:text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>}
        </div>
      </div>

      {/* Sub-items section - Monday.com style with connecting line */}
      {hasSubItems && isExpanded && <div className="relative mt-1 mb-2" onBlur={e => {
      // Check if focus is leaving the sub-items container entirely
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        cleanupEmptySubItems();
      }
    }}>
          {/* Vertical connecting line from parent - positioned at left edge */}
          <div className="absolute left-3 -top-1 w-0.5 h-4 bg-amber-600/70" />
          
          {/* Horizontal connector line */}
          <div className="absolute left-3 top-3 w-6 h-0.5 bg-amber-600/70" />
          
          {/* Continuous vertical bar alongside sub-items */}
          <div className="absolute left-3 top-3 bottom-0 w-0.5 bg-amber-600/70" />
          
          {/* Sub-items container with left margin for the bar */}
          <div className="ml-10 bg-[#F5F8FA] rounded-lg overflow-hidden">
            {/* Sub-items header row */}
            <div className="flex items-center bg-[#EDF2F7] text-xs font-medium text-gray-500 border-b border-[#E8EDF2]">
              <div className="w-10 shrink-0 flex items-center justify-center py-2" />
              <div className="shrink-0 px-3 py-2" style={{
            width: columnWidths.questions
          }}>Sub-questions</div>
              <div className="shrink-0 px-2 py-2 text-center" style={{
            width: columnWidths.response
          }}>Response</div>
              {visibleColumns.explanation && <div className="shrink-0 px-2 py-2 text-center" style={{
            width: columnWidths.explanation
          }}>Explanation</div>}
              {visibleColumns.reference && <div className="shrink-0 px-2 py-2 text-center" style={{
            width: columnWidths.reference
          }}>Reference</div>}
              {!isPreviewMode && (!visibleColumns.explanation || !visibleColumns.reference) && <div className="w-[100px] shrink-0" />}
              <div className="w-16 shrink-0" />
            </div>

            <SortableContext items={subItemIds} strategy={verticalListSortingStrategy}>
              {item.subQuestions!.map((sub, idx) => <div key={sub.id} className="">
                  <SortableSubItemRow subItem={sub} index={idx} parentId={item.id} onUpdate={updated => handleSubItemUpdate(idx, updated)} onDelete={() => handleSubItemDelete(idx)} isPreviewMode={isPreviewMode} isCompactMode={isCompactMode} isLast={idx === item.subQuestions!.length - 1} totalCount={item.subQuestions!.length} visibleColumns={visibleColumns} columnWidths={columnWidths} isNewEmpty={isPendingSubItem && sub.text.trim() === ''} onBlurCleanup={() => {
              if (sub.text.trim() === '') {
                cleanupEmptySubItems();
              }
            }} sectionNumber={sectionNumber} itemNumber={itemIndex + 1} />
                </div>)}
            </SortableContext>

            {/* Add subitem row */}
            {!isPreviewMode && hasRealSubItems && <div className="flex items-center hover:bg-[#EDF2F7] transition-colors">
                <div className="w-10 flex items-center justify-center py-2.5">
                  <Checkbox disabled className="h-4 w-4 border-gray-300 bg-white opacity-30" />
                </div>
                <button onClick={onAddSubItem} className="flex-1 flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 hover:text-blue-500 transition-colors text-left">
                  + Add Sub-question
                </button>
              </div>}
          </div>
        </div>}
    </div>;
}

// Group component (Section)
interface GroupProps {
  section: Section;
  sectionIndex: number;
  onUpdate: (section: Section) => void;
  onDelete: () => void;
  onAddItem: () => void;
  onAddCategoryAtPosition: (position: 'above' | 'below') => void;
  isPreviewMode: boolean;
  isCompactMode: boolean;
  onItemsReorder: (sectionId: string, newItems: Question[]) => void;
  onSubItemsReorder: (itemId: string, newSubItems: Question[]) => void;
  selectedQuestions: Set<string>;
  onSelectionChange: (questionId: string, selected: boolean) => void;
}

// Resizable column header component
interface ResizableColumnHeaderProps {
  label: string;
  width: number;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange: (width: number) => void;
  onLabelChange?: (label: string) => void;
  onRemove?: () => void;
  isPreviewMode: boolean;
  showRemove?: boolean;
}
function ResizableColumnHeader({
  label,
  width,
  minWidth = 100,
  maxWidth = 500,
  onWidthChange,
  onLabelChange,
  onRemove,
  isPreviewMode,
  showRemove = false
}: ResizableColumnHeaderProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(label);
  const startXRef = useRef(0);
  const startWidthRef = useRef(width);
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
  };
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const delta = e.clientX - startXRef.current;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + delta));
    onWidthChange(newWidth);
  }, [isResizing, minWidth, maxWidth, onWidthChange]);
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Attach/detach global listeners for resize
  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + delta));
      onWidthChange(newWidth);
    };
    const handleUp = () => {
      setIsResizing(false);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isResizing, minWidth, maxWidth, onWidthChange]);
  const commitLabel = () => {
    const trimmed = draftLabel.trim();
    if (trimmed && trimmed !== label && onLabelChange) {
      onLabelChange(trimmed);
    } else {
      setDraftLabel(label);
    }
    setIsEditing(false);
  };
  return <div className="shrink-0 px-2 py-2 flex items-center justify-between group/col relative" style={{
    width
  }}>
      {isEditing && !isPreviewMode && onLabelChange ? <input type="text" value={draftLabel} onChange={e => setDraftLabel(e.target.value)} onBlur={commitLabel} onKeyDown={e => {
      if (e.key === 'Enter') commitLabel();
      if (e.key === 'Escape') {
        setDraftLabel(label);
        setIsEditing(false);
      }
    }} autoFocus onClick={e => e.stopPropagation()} className="h-5 text-xs font-medium bg-white border border-gray-300 rounded px-1 flex-1 min-w-0" /> : <span onClick={() => {
      if (!isPreviewMode && onLabelChange) setIsEditing(true);
    }} className={`text-xs font-medium truncate ${!isPreviewMode && onLabelChange ? 'cursor-text hover:text-gray-700' : ''}`}>
          {label}
        </span>}
      
      {!isPreviewMode && showRemove && onRemove && <button onClick={onRemove} className="p-0.5 text-gray-400 hover:text-red-500 opacity-0 group-hover/col:opacity-100 transition-opacity ml-1" title="Remove column">
          <X className="h-3.5 w-3.5" />
        </button>}
      
      {/* Resize handle */}
      {!isPreviewMode && <div onMouseDown={handleMouseDown} className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors ${isResizing ? 'bg-primary' : ''}`} style={{
      transform: 'translateX(50%)'
    }} />}
    </div>;
}
function SortableGroup({
  section,
  sectionIndex,
  onUpdate,
  onDelete,
  onAddItem,
  onAddCategoryAtPosition,
  isPreviewMode,
  isCompactMode,
  onItemsReorder,
  onSubItemsReorder,
  selectedQuestions,
  onSelectionChange
}: GroupProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(section.title);
  const [visibleColumns, setVisibleColumns] = useState({
    explanation: true,
    reference: true
  });

  // Column widths state
  const [columnWidths, setColumnWidths] = useState({
    questions: 300,
    response: 320,
    explanation: 280,
    reference: 200
  });

  // Column labels state (editable)
  const [columnLabels, setColumnLabels] = useState({
    questions: 'Questions',
    response: 'Response',
    explanation: 'Explanation',
    reference: 'Reference'
  });
  const handleAddColumn = (columnId: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnId]: true
    }));
  };
  const handleRemoveColumn = (columnId: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnId]: false
    }));
  };
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    active
  } = useSortable({
    id: section.id,
    data: {
      type: 'group',
      section
    }
  });

  // Check if this is a valid drop target
  const isDropTarget = isOver && active?.id !== section.id;
  const activeType = active?.data?.current?.type;
  const isValidDropTarget = isDropTarget && activeType === 'group';
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  const commitTitle = () => {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== section.title) {
      onUpdate({
        ...section,
        title: trimmed
      });
    } else {
      setDraftTitle(section.title);
    }
    setIsEditingTitle(false);
  };
  const handleItemUpdate = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...section.questions];
    newQuestions[index] = updatedQuestion;
    onUpdate({
      ...section,
      questions: newQuestions
    });
  };
  const handleItemDelete = (index: number) => {
    const newQuestions = section.questions.filter((_, i) => i !== index);
    onUpdate({
      ...section,
      questions: newQuestions
    });
  };
  const handleItemDuplicate = (index: number) => {
    const question = section.questions[index];
    const newQuestion: Question = {
      ...question,
      id: `q-${Date.now()}`,
      subQuestions: question.subQuestions?.map(sq => ({
        ...sq,
        id: `sq-${Date.now()}-${Math.random()}`
      }))
    };
    const newQuestions = [...section.questions.slice(0, index + 1), newQuestion, ...section.questions.slice(index + 1)];
    onUpdate({
      ...section,
      questions: newQuestions
    });
  };
  const handleAddSubItem = (index: number) => {
    const question = section.questions[index];
    const newSubQuestion: Question = {
      id: `sq-${Date.now()}`,
      text: 'New sub-item',
      answerType: 'long-answer',
      required: false
    };
    const updatedQuestion = {
      ...question,
      subQuestions: [...(question.subQuestions || []), newSubQuestion]
    };
    handleItemUpdate(index, updatedQuestion);
  };

  const handleAddItemAtPosition = (index: number, position: 'above' | 'below') => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: '',
      answerType: 'long-answer',
      required: false
    };
    const insertIndex = position === 'above' ? index : index + 1;
    const newQuestions = [
      ...section.questions.slice(0, insertIndex),
      newQuestion,
      ...section.questions.slice(insertIndex)
    ];
    onUpdate({
      ...section,
      questions: newQuestions
    });
  };

  // Clean number prefix from title
  const cleanTitle = (title: string) => title.replace(/^\d+\.\s*/, '');

  // Count total subitems
  const totalSubitems = section.questions.reduce((acc, q) => acc + (q.subQuestions?.length || 0), 0);
  const itemIds = section.questions.map(q => q.id);
  return <div ref={setNodeRef} style={style} className={`bg-white rounded-lg overflow-hidden shadow-[0_0_4px_rgba(0,0,0,0.1)] relative ${isDragging ? 'ring-2 ring-primary ring-offset-2 z-10' : ''} ${isValidDropTarget ? 'ring-2 ring-primary/50' : ''}`}>
      {/* Drop indicator line for groups */}
      {isValidDropTarget && <div className="absolute -top-2 left-0 right-0 h-1 bg-primary rounded-full z-20 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
      {/* Group header */}
      <div {...!isPreviewMode ? {
      ...attributes,
      ...listeners
    } : {}} className={`flex items-center gap-3 px-4 py-2 bg-[#F5F8FA] border-b border-[#E8EDF2] ${!isPreviewMode ? 'cursor-grab active:cursor-grabbing' : ''} ${isDragging ? 'opacity-70' : ''}`}>
        <div className="w-1 h-6 bg-amber-600 rounded-full" />
        <button onClick={e => {
        e.stopPropagation();
        onUpdate({
          ...section,
          isExpanded: !section.isExpanded
        });
      }} className="p-0.5 rounded hover:bg-[#EDF2F7] transition-colors">
          {section.isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
        </button>
        
        {isEditingTitle && !isPreviewMode ? <Input value={draftTitle} onChange={e => setDraftTitle(e.target.value)} onBlur={commitTitle} onKeyDown={e => {
        if (e.key === 'Enter') commitTitle();
        if (e.key === 'Escape') {
          setDraftTitle(section.title);
          setIsEditingTitle(false);
        }
      }} autoFocus onClick={e => e.stopPropagation()} className="h-7 text-sm font-semibold bg-gray-100 border-gray-300 text-amber-600 flex-1" /> : <h3 onClick={e => {
        e.stopPropagation();
        if (!isPreviewMode) setIsEditingTitle(true);
      }} className={`text-sm font-semibold text-amber-600 flex-1 ${!isPreviewMode ? 'cursor-text hover:text-amber-700' : ''}`}>
            <span className="text-gray-500 mr-1">{sectionIndex + 1}.</span>
            {cleanTitle(section.title)}
          </h3>}

        <span className="text-xs text-gray-500 flex items-center gap-1">
          {section.formLayout ? (
            <>
              <LayoutGrid className="h-3 w-3" />
              {section.formLayout.columns} Column Form
            </>
          ) : (
            <>{section.questions.length} Items{totalSubitems > 0 ? ` / ${totalSubitems} Subitems` : ''}</>
          )}
        </span>

        {!isPreviewMode && <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button onClick={e => e.stopPropagation()} className="p-1 rounded hover:bg-gray-200 transition-colors">
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-gray-200 z-50">
              {!section.formLayout && (
                <DropdownMenuItem onClick={onAddItem} className="text-gray-700 focus:bg-gray-100 focus:text-gray-900">
                  <Plus className="h-4 w-4 mr-2" />
                  Add item
                </DropdownMenuItem>
              )}
              {!section.formLayout && <DropdownMenuSeparator className="bg-gray-200" />}
              <div className="px-2 py-1.5 text-xs font-medium text-gray-500">Add category</div>
              <DropdownMenuItem onClick={() => onAddCategoryAtPosition('above')} className="text-gray-700 focus:bg-gray-100 focus:text-gray-900 pl-4">
                <ChevronDown className="h-4 w-4 mr-2 rotate-180" />
                Above this category
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddCategoryAtPosition('below')} className="text-gray-700 focus:bg-gray-100 focus:text-gray-900 pl-4">
                <ChevronDown className="h-4 w-4 mr-2" />
                Below this category
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem onClick={onDelete} className="text-red-500 focus:bg-gray-100 focus:text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>}
      </div>

      {/* Content */}
      {section.isExpanded && <>
          {/* Check if this is a form layout section */}
          {section.formLayout ? (
            <FormLayoutEditor
              formLayout={section.formLayout}
              onUpdate={(newFormLayout) => onUpdate({ ...section, formLayout: newFormLayout })}
              isPreviewMode={isPreviewMode}
            />
          ) : (
            <>
              {/* Column headers */}
              <div className="flex items-center bg-[#F5F8FA] text-xs font-medium text-gray-500 border-b border-[#E8EDF2]">
                <div className="w-10 shrink-0 py-2" />
                <div className="w-8 shrink-0 py-2" />
                <ResizableColumnHeader label={columnLabels.questions} width={columnWidths.questions} minWidth={200} maxWidth={600} onWidthChange={w => setColumnWidths(prev => ({
              ...prev,
              questions: w
            }))} onLabelChange={l => setColumnLabels(prev => ({
              ...prev,
              questions: l
            }))} isPreviewMode={isPreviewMode} />
                <ResizableColumnHeader label={columnLabels.response} width={columnWidths.response} minWidth={200} maxWidth={600} onWidthChange={w => setColumnWidths(prev => ({
              ...prev,
              response: w
            }))} onLabelChange={l => setColumnLabels(prev => ({
              ...prev,
              response: l
            }))} isPreviewMode={isPreviewMode} />
                {visibleColumns.explanation && <ResizableColumnHeader label={columnLabels.explanation} width={columnWidths.explanation} minWidth={180} maxWidth={600} onWidthChange={w => setColumnWidths(prev => ({
              ...prev,
              explanation: w
            }))} onLabelChange={l => setColumnLabels(prev => ({
              ...prev,
              explanation: l
            }))} onRemove={() => handleRemoveColumn('explanation')} isPreviewMode={isPreviewMode} showRemove={true} />}
                {visibleColumns.reference && <ResizableColumnHeader label={columnLabels.reference} width={columnWidths.reference} minWidth={120} maxWidth={400} onWidthChange={w => setColumnWidths(prev => ({
              ...prev,
              reference: w
            }))} onLabelChange={l => setColumnLabels(prev => ({
              ...prev,
              reference: l
            }))} onRemove={() => handleRemoveColumn('reference')} isPreviewMode={isPreviewMode} showRemove={true} />}
                {!isPreviewMode && (!visibleColumns.explanation || !visibleColumns.reference) && <div className="w-[100px] shrink-0 px-2 py-2 text-center text-gray-400">
                    <AddColumnButton onAddColumn={handleAddColumn} visibleColumns={visibleColumns} />
                  </div>}
                <div className="w-16 shrink-0 py-2" />
              </div>

              {/* Items */}
              <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                {section.questions.map((question, idx) => <SortableItemRow key={question.id} item={question} sectionId={section.id} itemIndex={idx} onUpdate={q => handleItemUpdate(idx, q)} onDelete={() => handleItemDelete(idx)} onDuplicate={() => handleItemDuplicate(idx)} onAddSubItem={() => handleAddSubItem(idx)} onAddItemAtPosition={(position) => handleAddItemAtPosition(idx, position)} isPreviewMode={isPreviewMode} isCompactMode={isCompactMode} onSubItemsReorder={onSubItemsReorder} visibleColumns={visibleColumns} columnWidths={columnWidths} sectionNumber={sectionIndex + 1} isSelected={selectedQuestions.has(question.id)} onSelectionChange={selected => onSelectionChange(question.id, selected)} />)}
              </SortableContext>

              {/* Add item button */}
              {!isPreviewMode && <div className="flex items-center">
                  <div className="w-10" />
                  <button onClick={onAddItem} className="flex items-center gap-2 px-6 py-3 text-sm text-gray-400 hover:text-gray-700 hover:bg-[#EDF2F7] transition-colors w-full text-left">
                    <Plus className="h-4 w-4" />
                    Add item
                  </button>
                </div>}
            </>
          )}
        </>}
    </div>;
}
export function MondayBoardView({
  checklist,
  onUpdate,
  isPreviewMode,
  isCompactMode = false,
  selectedQuestions = new Set(),
  onSelectionChange
}: MondayBoardViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<{
    type: string;
    text: string;
  } | null>(null);
  const handleSelectionChange = (questionId: string, selected: boolean) => {
    if (!onSelectionChange) return;
    const newSelected = new Set(selectedQuestions);
    if (selected) {
      newSelected.add(questionId);
    } else {
      newSelected.delete(questionId);
    }
    onSelectionChange(newSelected);
  };
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8
    }
  }), useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  }));
  const handleSectionUpdate = (index: number, updatedSection: Section) => {
    const newSections = [...checklist.sections];
    newSections[index] = updatedSection;
    onUpdate({
      ...checklist,
      sections: newSections
    });
  };
  const handleSectionDelete = (index: number) => {
    const newSections = checklist.sections.filter((_, i) => i !== index);
    onUpdate({
      ...checklist,
      sections: newSections
    });
  };
  const handleAddItem = (sectionIndex: number) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: '',
      answerType: 'long-answer',
      required: false
    };
    const newSections = [...checklist.sections];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      questions: [...newSections[sectionIndex].questions, newQuestion]
    };
    onUpdate({
      ...checklist,
      sections: newSections
    });
  };

  const handleAddCategoryAtPosition = (sectionIndex: number, position: 'above' | 'below') => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: 'New Category',
      questions: [],
      isExpanded: true
    };
    const insertIndex = position === 'above' ? sectionIndex : sectionIndex + 1;
    const newSections = [
      ...checklist.sections.slice(0, insertIndex),
      newSection,
      ...checklist.sections.slice(insertIndex)
    ];
    onUpdate({
      ...checklist,
      sections: newSections
    });
  };
  const handleItemsReorder = (sectionId: string, newItems: Question[]) => {
    const newSections = checklist.sections.map(section => section.id === sectionId ? {
      ...section,
      questions: newItems
    } : section);
    onUpdate({
      ...checklist,
      sections: newSections
    });
  };
  const handleSubItemsReorder = (itemId: string, newSubItems: Question[]) => {
    const newSections = checklist.sections.map(section => ({
      ...section,
      questions: section.questions.map(q => q.id === itemId ? {
        ...q,
        subQuestions: newSubItems
      } : q)
    }));
    onUpdate({
      ...checklist,
      sections: newSections
    });
  };
  const handleDragStart = (event: DragStartEvent) => {
    const {
      active
    } = event;
    setActiveId(active.id as string);

    // Extract information about what's being dragged
    const data = active.data.current;
    if (data?.type === 'group') {
      setActiveData({
        type: 'group',
        text: data.section?.title || 'Section'
      });
    } else if (data?.type === 'item') {
      setActiveData({
        type: 'item',
        text: data.item?.text || 'Question'
      });
    } else if (data?.type === 'subitem') {
      setActiveData({
        type: 'subitem',
        text: data.subItem?.text || 'Sub-question'
      });
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const {
      active,
      over
    } = event;
    setActiveId(null);
    setActiveData(null);
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
        onUpdate({
          ...checklist,
          sections: newSections
        });
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
              if (section.id === activeSectionId) return {
                ...section,
                questions: newSourceQuestions
              };
              if (section.id === overSectionId) return {
                ...section,
                questions: newTargetQuestions
              };
              return section;
            });
            onUpdate({
              ...checklist,
              sections: newSections
            });
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
                if (q.id === activeParentId) return {
                  ...q,
                  subQuestions: newSourceSubItems
                };
                if (q.id === overParentId) return {
                  ...q,
                  subQuestions: newTargetSubItems
                };
                return q;
              })
            }));
            onUpdate({
              ...checklist,
              sections: newSections
            });
          }
        }
      }
    }
  };
  const sectionIds = checklist.sections.map(s => s.id);
  return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
          {checklist.sections.map((section, idx) => <SortableGroup key={section.id} section={section} sectionIndex={idx} onUpdate={s => handleSectionUpdate(idx, s)} onDelete={() => handleSectionDelete(idx)} onAddItem={() => handleAddItem(idx)} onAddCategoryAtPosition={(position) => handleAddCategoryAtPosition(idx, position)} isPreviewMode={isPreviewMode} isCompactMode={isCompactMode} onItemsReorder={handleItemsReorder} onSubItemsReorder={handleSubItemsReorder} selectedQuestions={selectedQuestions} onSelectionChange={handleSelectionChange} />)}
        </SortableContext>
      </div>
      
      {/* Drag Overlay - shows preview of dragged item */}
      <DragOverlay dropAnimation={{
      duration: 200,
      easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)'
    }}>
        {activeId && activeData && <div className={`
            px-4 py-3 rounded-lg shadow-xl border-2 border-primary bg-white
            ${activeData.type === 'group' ? 'bg-[#F5F8FA]' : ''}
            ${activeData.type === 'subitem' ? 'ml-10 bg-[#FAFBFC]' : ''}
          `}>
            <div className="flex items-center gap-3">
              <GripVertical className="h-4 w-4 text-gray-400" />
              <div className="flex items-center gap-2">
                {activeData.type === 'group' && <div className="w-1 h-5 bg-amber-600 rounded-full" />}
                <span className={`text-sm font-medium truncate max-w-[300px] ${activeData.type === 'group' ? 'text-amber-600' : 'text-gray-700'}`} dangerouslySetInnerHTML={{
              __html: sanitizeHtml(activeData.text) || 'Untitled'
            }} />
              </div>
            </div>
          </div>}
      </DragOverlay>
    </DndContext>;
}