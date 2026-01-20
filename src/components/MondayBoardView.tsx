import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Copy,
} from 'lucide-react';
import { Checklist, Question, Section } from '@/types/checklist';
import { Checkbox } from '@/components/ui/checkbox';
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

// Sub-item row component
interface SubItemRowProps {
  subItem: Question;
  index: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  isPreviewMode: boolean;
}

function SubItemRow({ subItem, onUpdate, onDelete, isPreviewMode, index }: SubItemRowProps) {
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
    <div className="group flex items-center border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
      {/* Checkbox */}
      <div className="w-12 flex items-center justify-center">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={() => setIsSelected(!isSelected)}
          className="h-4 w-4 border-slate-500"
        />
      </div>

      {/* Sub-item name */}
      <div className="flex-1 min-w-[300px] px-3 py-2 pl-8">
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
            className="h-7 text-sm bg-slate-700/50 border-slate-600 text-slate-200"
          />
        ) : (
          <span
            onClick={() => !isPreviewMode && setIsEditingName(true)}
            className={`text-sm text-slate-300 ${!isPreviewMode ? 'cursor-text hover:text-slate-100' : ''}`}
          >
            {stripHtml(subItem.text) || 'New sub-item'}
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
}

function ItemRow({ 
  item, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onAddSubItem,
  isPreviewMode, 
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
          <Textarea
            value={item.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter response..."
            className="min-h-[40px] text-sm bg-slate-700/50 border-slate-600 text-slate-200 resize-none"
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

  return (
    <>
      {/* Main item row */}
      <div className={`group flex items-center border-b border-slate-700 hover:bg-slate-700/40 transition-colors ${isSelected ? 'bg-slate-700/30' : ''}`}>
        {/* Checkbox + Expand */}
        <div className="w-12 flex items-center justify-center gap-1">
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
        <div className="flex-1 min-w-[300px] px-3 py-3">
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
              className="text-sm min-h-[36px] resize-none bg-slate-700/50 border-slate-600 text-slate-200"
            />
          ) : (
            <div 
              onClick={() => !isPreviewMode && setIsEditingName(true)}
              className={`text-sm text-slate-200 ${!isPreviewMode ? 'cursor-text hover:text-white' : ''}`}
            >
              {stripHtml(item.text) || 'Click to add item name...'}
            </div>
          )}
          {hasSubItems && (
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

      {/* Sub-items section */}
      {hasSubItems && isExpanded && (
        <div className="bg-slate-800/50">
          {/* Subitem header */}
          <div className="flex items-center border-b border-slate-700/50 bg-slate-800/80 text-xs font-medium text-slate-400">
            <div className="w-12" />
            <div className="flex-1 min-w-[300px] px-3 py-2 pl-8">Subitem</div>
            <div className="w-[180px] px-3 py-2">Response</div>
            <div className="w-[120px] px-3 py-2">Reference</div>
            <div className="w-10" />
          </div>
          
          {item.subQuestions!.map((sub, idx) => (
            <SubItemRow
              key={sub.id}
              subItem={sub}
              index={idx}
              onUpdate={(updated) => handleSubItemUpdate(idx, updated)}
              onDelete={() => handleSubItemDelete(idx)}
              isPreviewMode={isPreviewMode}
            />
          ))}
          {!isPreviewMode && (
            <div className="flex items-center border-b border-slate-700/50">
              <div className="w-12" />
              <button
                onClick={onAddSubItem}
                className="flex items-center gap-2 px-3 py-2 pl-8 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 transition-colors flex-1 text-left"
              >
                <Plus className="h-3.5 w-3.5" />
                Add subitem
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
}

function Group({ section, sectionIndex, onUpdate, onDelete, onAddItem, isPreviewMode }: GroupProps) {
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

  // Count total subitems
  const totalSubitems = section.questions.reduce((acc, q) => acc + (q.subQuestions?.length || 0), 0);

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
      {/* Group header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-700">
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
            <div className="w-12" />
            <div className="w-8" />
            <div className="flex-1 min-w-[300px] px-3 py-2">Item</div>
            <div className="w-[180px] px-3 py-2">Response</div>
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
            />
          ))}

          {/* Add item button */}
          {!isPreviewMode && (
            <div className="flex items-center border-t border-slate-700/50">
              <div className="w-12" />
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
    <div className="space-y-4">
      {checklist.sections.map((section, idx) => (
        <Group
          key={section.id}
          section={section}
          sectionIndex={idx}
          onUpdate={(s) => handleSectionUpdate(idx, s)}
          onDelete={() => handleSectionDelete(idx)}
          onAddItem={() => handleAddItem(idx)}
          isPreviewMode={isPreviewMode}
        />
      ))}
    </div>
  );
}
