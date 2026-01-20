import { useState, useRef, useCallback } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronDown,
  ChevronRight,
  GripVertical,
  Check,
  MoreHorizontal,
  Copy,
  Pencil,
  X
} from 'lucide-react';
import { Checklist, Question, Section, AnswerType } from '@/types/checklist';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MondayBoardViewProps {
  checklist: Checklist;
  onUpdate: (checklist: Checklist) => void;
  isPreviewMode: boolean;
}

// Strip HTML tags from text for clean display
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

// Group colors for Monday-style theming
const GROUP_COLORS = [
  { bg: 'bg-violet-500', light: 'bg-violet-50', border: 'border-violet-500', text: 'text-violet-700' },
  { bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700' },
  { bg: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-700' },
  { bg: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700' },
  { bg: 'bg-rose-500', light: 'bg-rose-50', border: 'border-rose-500', text: 'text-rose-700' },
  { bg: 'bg-cyan-500', light: 'bg-cyan-50', border: 'border-cyan-500', text: 'text-cyan-700' },
];

// Sub-item row component
interface SubItemRowProps {
  subItem: Question;
  index: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  isPreviewMode: boolean;
  groupColor: typeof GROUP_COLORS[0];
}

function SubItemRow({ subItem, onUpdate, onDelete, isPreviewMode, groupColor, index }: SubItemRowProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(stripHtml(subItem.text));
  const [isSelected, setIsSelected] = useState(false);

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
          <div className="flex gap-2">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswerChange(opt)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  subItem.answer === opt
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
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
            className="h-8 px-2 text-sm bg-background border rounded w-full"
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
            className="h-8 text-sm bg-background"
          />
        );
    }
  };

  return (
    <div className="group flex items-center border-b border-border/50 hover:bg-muted/30 transition-colors">
      {/* Color indicator - thinner for sub-items */}
      <div className={`w-1 self-stretch ${groupColor.bg} opacity-40`} />
      
      {/* Checkbox + indent */}
      <div className="w-16 flex items-center justify-center pl-8">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={() => setIsSelected(!isSelected)}
          className="h-4 w-4"
        />
      </div>

      {/* Sub-item name with letter prefix */}
      <div className="flex-1 min-w-[200px] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium w-4">
            {String.fromCharCode(97 + index)}.
          </span>
          {isEditingName && !isPreviewMode ? (
            <Input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitName();
                if (e.key === 'Escape') {
                  setDraftName(stripHtml(subItem.text));
                  setIsEditingName(false);
                }
              }}
              autoFocus
              className="h-7 text-sm flex-1"
            />
          ) : (
            <span
              onClick={() => !isPreviewMode && setIsEditingName(true)}
              className={`text-sm text-muted-foreground flex-1 ${!isPreviewMode ? 'cursor-text hover:text-foreground' : ''}`}
            >
              {stripHtml(subItem.text) || 'New sub-item'}
              
            </span>
          )}
        </div>
      </div>

      {/* Response column */}
      <div className="w-[200px] px-3 py-2">
        {renderResponseField()}
      </div>

      {/* Reference column */}
      <div className="w-[120px] px-3 py-2">
        <Input
          value={subItem.reference || ''}
          onChange={(e) => onUpdate({ ...subItem, reference: e.target.value })}
          placeholder="Ref..."
          className="h-8 text-sm bg-background"
          disabled={isPreviewMode}
        />
      </div>

      {/* Actions */}
      <div className="w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {!isPreviewMode && (
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Main Item row component
interface ItemRowProps {
  item: Question;
  sectionIndex: number;
  itemIndex: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onAddSubItem: () => void;
  isPreviewMode: boolean;
  groupColor: typeof GROUP_COLORS[0];
}

function ItemRow({ 
  item, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onAddSubItem,
  isPreviewMode, 
  groupColor,
  itemIndex 
}: ItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(stripHtml(item.text));
  const [isSelected, setIsSelected] = useState(false);

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
          <div className="flex gap-2">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswerChange(opt)}
                className={`px-3 py-1.5 text-xs rounded-full transition-all font-medium ${
                  item.answer === opt
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
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
            className="h-9 px-3 text-sm bg-background border rounded-md w-full"
          >
            <option value="">Select an option...</option>
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
            placeholder="Enter detailed response..."
            className="min-h-[60px] text-sm bg-background resize-none"
          />
        );

      default:
        return (
          <Input
            value={item.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter response..."
            className="h-9 text-sm bg-background"
          />
        );
    }
  };

  return (
    <>
      {/* Main item row */}
      <div className={`group flex items-center border-b border-border hover:bg-muted/40 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
        {/* Color indicator */}
        <div className={`w-1.5 self-stretch ${groupColor.bg}`} />
        
        {/* Expand + Checkbox + Drag */}
        <div className="w-16 flex items-center justify-center gap-1 px-2">
          {hasSubItems ? (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0.5 rounded hover:bg-muted transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={() => setIsSelected(!isSelected)}
            className="h-4 w-4"
          />
        </div>

        {/* Item name */}
        <div className="flex-1 min-w-[200px] px-3 py-3">
          {isEditingName && !isPreviewMode ? (
            <Textarea
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  commitName();
                }
                if (e.key === 'Escape') {
                  setDraftName(stripHtml(item.text));
                  setIsEditingName(false);
                }
              }}
              autoFocus
              className="text-sm font-medium min-h-[36px] resize-none"
            />
          ) : (
            <div 
              onClick={() => !isPreviewMode && setIsEditingName(true)}
              className={`text-sm font-medium text-foreground ${!isPreviewMode ? 'cursor-text hover:bg-muted/50 px-2 py-1 -mx-2 rounded transition-colors' : ''}`}
            >
              {stripHtml(item.text) || 'Click to add item name...'}
            </div>
          )}
        </div>

        {/* Response column */}
        <div className="w-[200px] px-3 py-2">
          {renderResponseField()}
        </div>

        {/* Reference column */}
        <div className="w-[120px] px-3 py-2">
          <Input
            value={item.reference || ''}
            onChange={(e) => onUpdate({ ...item, reference: e.target.value })}
            placeholder="Add ref..."
            className="h-9 text-sm bg-background"
            disabled={isPreviewMode}
          />
        </div>

        {/* Actions menu */}
        <div className="w-10 flex items-center justify-center">
          {!isPreviewMode && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-all">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover z-50">
                <DropdownMenuItem onClick={onAddSubItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add sub-item
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Sub-items */}
      {hasSubItems && isExpanded && (
        <div className="bg-muted/10">
          {item.subQuestions!.map((sub, idx) => (
            <SubItemRow
              key={sub.id}
              subItem={sub}
              index={idx}
              onUpdate={(updated) => handleSubItemUpdate(idx, updated)}
              onDelete={() => handleSubItemDelete(idx)}
              isPreviewMode={isPreviewMode}
              groupColor={groupColor}
            />
          ))}
          {!isPreviewMode && (
            <div className="flex items-center border-b border-border/50">
              <div className={`w-1 self-stretch ${groupColor.bg} opacity-40`} />
              <button
                onClick={onAddSubItem}
                className="flex items-center gap-2 px-6 py-2 pl-12 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors w-full text-left"
              >
                <Plus className="h-3.5 w-3.5" />
                Add sub-item
              </button>
            </div>
          )}
        </div>
      )}
    </>
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
  groupColor: typeof GROUP_COLORS[0];
}

function Group({ section, sectionIndex, onUpdate, onDelete, onAddItem, isPreviewMode, groupColor }: GroupProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(section.title);

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

  return (
    <div className="bg-card rounded-lg border overflow-hidden shadow-sm">
      {/* Group header */}
      <div className={`flex items-center gap-3 px-4 py-3 ${groupColor.bg} text-white`}>
        <button 
          onClick={() => onUpdate({ ...section, isExpanded: !section.isExpanded })}
          className="p-0.5 rounded hover:bg-white/20 transition-colors"
        >
          {section.isExpanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
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
            className="h-8 text-sm font-semibold bg-white/20 border-white/30 text-white placeholder:text-white/60 flex-1"
          />
        ) : (
          <h3 
            onClick={() => !isPreviewMode && setIsEditingTitle(true)}
            className={`text-sm font-semibold flex-1 ${!isPreviewMode ? 'cursor-text hover:bg-white/10 px-2 py-1 -mx-2 rounded transition-colors' : ''}`}
          >
            {cleanTitle(section.title)}
          </h3>
        )}

        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {section.questions.length} items
        </span>

        {!isPreviewMode && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded hover:bg-white/20 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover z-50">
              <DropdownMenuItem onClick={onAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add item
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Column headers */}
      {section.isExpanded && (
        <>
          <div className="flex items-center border-b bg-muted/30 text-xs font-medium text-muted-foreground">
            <div className="w-1.5" />
            <div className="w-16" />
            <div className="flex-1 min-w-[200px] px-3 py-2">Item</div>
            <div className="w-[200px] px-3 py-2">Response</div>
            <div className="w-[120px] px-3 py-2">Reference</div>
            <div className="w-10" />
          </div>

          {/* Items */}
          {section.questions.map((question, idx) => (
            <ItemRow
              key={question.id}
              item={question}
              sectionIndex={sectionIndex}
              itemIndex={idx}
              onUpdate={(q) => handleItemUpdate(idx, q)}
              onDelete={() => handleItemDelete(idx)}
              onDuplicate={() => handleItemDuplicate(idx)}
              onAddSubItem={() => handleAddSubItem(idx)}
              isPreviewMode={isPreviewMode}
              groupColor={groupColor}
            />
          ))}

          {/* Add item button */}
          {!isPreviewMode && (
            <div className="flex items-center">
              <div className={`w-1.5 self-stretch ${groupColor.bg} opacity-30`} />
              <button
                onClick={onAddItem}
                className="flex items-center gap-2 px-6 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors w-full text-left"
              >
                <Plus className="h-4 w-4" />
                Add item
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function MondayBoardView({ checklist, onUpdate, isPreviewMode }: MondayBoardViewProps) {
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

  return (
    <div className="space-y-6">
      {checklist.sections.map((section, idx) => (
        <Group
          key={section.id}
          section={section}
          sectionIndex={idx}
          onUpdate={(s) => handleSectionUpdate(idx, s)}
          onDelete={() => handleSectionDelete(idx)}
          onAddItem={() => handleAddItem(idx)}
          isPreviewMode={isPreviewMode}
          groupColor={GROUP_COLORS[idx % GROUP_COLORS.length]}
        />
      ))}
    </div>
  );
}
