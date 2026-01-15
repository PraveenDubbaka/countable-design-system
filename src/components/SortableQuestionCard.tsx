import { useSortable } from '@dnd-kit/sortable';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  arrayMove 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useRef, useEffect } from 'react';
import { 
  GripVertical, 
  Plus, 
  Sparkles,
  Mic,
  ChevronRight,
  X
} from 'lucide-react';
import { Question, AnswerType } from '@/types/checklist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AIEditMenu } from './AIEditMenu';
import { QuestionToolbar } from './QuestionToolbar';
import { EditableOption } from './EditableOption';
import { SortableInlineSubQuestion } from './SortableInlineSubQuestion';

interface SortableQuestionCardProps {
  question: Question;
  index: number;
  sectionIndex: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  onAddSubQuestion: () => void;
  onDuplicate?: () => void;
}

export function SortableQuestionCard({
  question,
  index,
  sectionIndex,
  onUpdate,
  onDelete,
  onAddSubQuestion,
  onDuplicate,
}: SortableQuestionCardProps) {
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [draftQuestionText, setDraftQuestionText] = useState(question.text);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [hasNote, setHasNote] = useState(!!question.note);
  const [aiMenuPosition, setAiMenuPosition] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const questionInputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keep draft in sync if the question is updated externally (e.g., reorder, duplicate)
  useEffect(() => {
    setDraftQuestionText(question.text);
  }, [question.text]);

  // Focus/select input when entering edit mode
  useEffect(() => {
    if (!isEditingQuestion) return;
    // next tick so the input exists
    queueMicrotask(() => {
      questionInputRef.current?.focus();
      questionInputRef.current?.select();
    });
  }, [isEditingQuestion]);

  // Sync hasNote with question.note
  useEffect(() => {
    setHasNote(!!question.note);
  }, [question.note]);

  const commitQuestionText = () => {
    const trimmed = draftQuestionText.trim();

    // If user clears the field, revert (don’t allow empty question text)
    if (!trimmed) {
      setDraftQuestionText(question.text);
      setIsEditingQuestion(false);
      return;
    }

    if (trimmed !== question.text) {
      onUpdate({ ...question, text: trimmed });
    }

    setIsEditingQuestion(false);
  };

  const handleQuestionChange = (text: string) => {
    setDraftQuestionText(text);
  };

  const handleAnswerChange = (answer: string) => {
    onUpdate({ ...question, answer });
  };

  const handleNoteChange = (note: string) => {
    onUpdate({ ...question, note });
  };

  const handleExplanationChange = (explanation: string) => {
    onUpdate({ ...question, explanation });
  };

  const handleTypeChange = (answerType: AnswerType) => {
    const options = (answerType === 'multiple-choice' || answerType === 'dropdown') 
      ? (question.options || ['Option 1', 'Option 2', 'Option 3'])
      : undefined;
    onUpdate({ ...question, answerType, answer: '', options });
  };

  const handleOptionUpdate = (optIndex: number, value: string) => {
    const baseOptions = question.options || ['Option 1', 'Option 2', 'Option 3'];
    const oldValue = baseOptions[optIndex];

    const newOptions = [...baseOptions];
    newOptions[optIndex] = value;

    const next: Question = {
      ...question,
      options: newOptions,
      // keep the selected value in sync when a label changes
      answer: question.answer === oldValue ? value : question.answer,
    };

    onUpdate(next);
  };

  const handleOptionRemove = (optIndex: number) => {
    const baseOptions = question.options || ['Option 1', 'Option 2', 'Option 3'];
    const removedValue = baseOptions[optIndex];
    const newOptions = baseOptions.filter((_, i) => i !== optIndex);

    if (newOptions.length > 0) {
      onUpdate({
        ...question,
        options: newOptions,
        // if the selected option was removed, clear the answer
        answer: question.answer === removedValue ? '' : question.answer,
      });
    }
  };

  const handleAddOption = () => {
    const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
    onUpdate({ ...question, options: newOptions });
  };

  const handleSubQuestionUpdate = (subIndex: number, subQuestion: Question) => {
    const newSubQuestions = [...(question.subQuestions || [])];
    newSubQuestions[subIndex] = subQuestion;
    onUpdate({ ...question, subQuestions: newSubQuestions });
  };

  const handleSubQuestionDelete = (subIndex: number) => {
    const newSubQuestions = (question.subQuestions || []).filter((_, i) => i !== subIndex);
    onUpdate({ ...question, subQuestions: newSubQuestions });
  };

  const subQuestionSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleSubQuestionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const subQuestions = question.subQuestions || [];
    const oldIndex = subQuestions.findIndex((q) => q.id === active.id);
    const newIndex = subQuestions.findIndex((q) => q.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(subQuestions, oldIndex, newIndex);
      onUpdate({ ...question, subQuestions: reordered });
    }
  };

  const handleAddInlineSubQuestion = () => {
    const newSubQuestion: Question = {
      id: `sq-${Date.now()}`,
      text: 'New sub-question - click to edit',
      answerType: 'short-answer',
      required: false
    };
    onUpdate({ 
      ...question, 
      subQuestions: [...(question.subQuestions || []), newSubQuestion] 
    });
  };

  const handleAIClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAiMenuPosition({ x: rect.left, y: rect.bottom + 8 });
    setShowAIMenu(true);
  };

  const handleAIEdit = (newText: string) => {
    onUpdate({ ...question, answer: newText });
    setShowAIMenu(false);
  };

  const handleDuplicate = () => {
    onDuplicate?.();
  };

  const handleAddNote = () => {
    setHasNote(true);
    onUpdate({ ...question, note: question.note || '' });
  };

  const handleRemoveNote = () => {
    setHasNote(false);
    onUpdate({ ...question, note: undefined });
  };

  const renderAnswerField = () => {
    switch (question.answerType) {
      case 'yes-no':
        return (
          <div className="flex flex-wrap gap-3 mt-3">
            {['Yes', 'No'].map((option) => (
              <label key={option} className="flex items-center gap-2.5 cursor-pointer group px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                <div 
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    question.answer === option 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground/50 group-hover:border-primary/50'
                  }`}
                  onClick={() => handleAnswerChange(option)}
                >
                  {question.answer === option && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <span className="text-sm text-foreground">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'yes-no-na':
        return (
          <div className="flex flex-wrap gap-3 mt-3">
            {['Yes', 'No', 'Not applicable'].map((option) => (
              <label key={option} className="flex items-center gap-2.5 cursor-pointer group px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                <div 
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    question.answer === option 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground/50 group-hover:border-primary/50'
                  }`}
                  onClick={() => handleAnswerChange(option)}
                >
                  {question.answer === option && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <span className="text-sm text-foreground">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'short-answer':
        return (
          <Input
            placeholder="Enter your answer..."
            value={question.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="mt-3 bg-background"
          />
        );

      case 'long-answer':
        return (
          <div className="mt-3 relative">
            <Textarea
              ref={textareaRef}
              placeholder="Enter your detailed answer..."
              value={question.answer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="min-h-[100px] pr-20 resize-none bg-background"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-1">
              <button
                onClick={handleAIClick}
                className="flex items-center gap-1 px-2 py-1 rounded text-accent hover:bg-accent/10 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
              </button>
              <button className="flex items-center gap-1 px-2 py-1 rounded text-accent hover:bg-accent/10 transition-colors">
                <Mic className="h-4 w-4" />
              </button>
            </div>
          </div>
        );

      case 'dropdown':
      case 'multiple-choice':
        const options = question.options || ['Option 1', 'Option 2', 'Option 3'];
        return (
          <div className="mt-3 space-y-1">
            {options.map((option, i) => (
              <EditableOption
                key={`${question.id}-opt-${i}`}
                value={option}
                index={i}
                isSelected={question.answer === option}
                onUpdate={(value) => handleOptionUpdate(i, value)}
                onRemove={() => handleOptionRemove(i)}
                onSelect={() => handleAnswerChange(option)}
                type={question.answerType === 'dropdown' ? 'radio' : 'checkbox'}
              />
            ))}
            <button
              onClick={handleAddOption}
              className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full"
            >
              <Plus className="h-4 w-4" />
              Add option
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div 
        ref={(node) => {
          setNodeRef(node);
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        style={style}
        className={`question-card p-5 mb-3 animate-slide-up group/card relative ${
          isDragging ? 'shadow-xl ring-2 ring-primary/20' : ''
        } ${isFocused ? 'ring-2 ring-primary/30' : ''}`}
        onClick={() => setIsFocused(true)}
      >
        {/* Floating Toolbar - appears when focused */}
        {isFocused && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30">
            <QuestionToolbar
              currentType={question.answerType}
              onChangeType={handleTypeChange}
              onDuplicate={handleDuplicate}
              onDelete={onDelete}
              onAddSubQuestion={onAddSubQuestion}
              onAddNote={handleAddNote}
            />
          </div>
        )}

        <div className="flex gap-3">
          {/* Drag Handle - appears on hover */}
          <div
            {...attributes}
            {...listeners}
            className="flex items-center justify-center w-6 h-6 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover/card:opacity-100 hover:bg-muted transition-all mt-0.5 shrink-0"
            title="Drag to reorder"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center justify-center w-6 h-6 rounded hover:bg-muted transition-all mt-0.5 shrink-0"
            aria-label={isExpanded ? 'Collapse question' : 'Expand question'}
          >
            <ChevronRight 
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
            />
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Question text - inline editable */}
            {isEditingQuestion ? (
              <Input
                ref={questionInputRef}
                value={draftQuestionText}
                onChange={(e) => handleQuestionChange(e.target.value)}
                onBlur={commitQuestionText}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    commitQuestionText();
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    setDraftQuestionText(question.text);
                    setIsEditingQuestion(false);
                  }
                }}
                autoFocus
                className="font-medium bg-background text-base"
              />
            ) : (
              <p 
                className="text-foreground font-medium cursor-text hover:bg-muted/50 px-2 py-1 -mx-2 -my-1 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingQuestion(true);
                }}
              >
              {question.text}
              </p>
            )}

            {/* Sub-question button - between question and answer */}
            <button
              onClick={handleAddInlineSubQuestion}
              className="mt-3 flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors border border-dashed border-muted hover:border-primary"
            >
              <Plus className="h-4 w-4" />
              Sub-question
            </button>

            {/* Sub-questions (nested blocks - between question and answer) */}
            {question.subQuestions && question.subQuestions.length > 0 && (
              <DndContext
                sensors={subQuestionSensors}
                collisionDetection={closestCenter}
                onDragEnd={handleSubQuestionDragEnd}
              >
                <SortableContext
                  items={question.subQuestions.map((sq) => sq.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="mt-3 ml-4 border-l-2 border-muted pl-4 space-y-3">
                    {question.subQuestions.map((sub, i) => (
                      <SortableInlineSubQuestion
                        key={sub.id}
                        question={sub}
                        index={i}
                        onUpdate={(updated) => handleSubQuestionUpdate(i, updated)}
                        onDelete={() => handleSubQuestionDelete(i)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {/* Collapsible answer section */}
            <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[3000px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
              {/* Answer field */}
              {renderAnswerField()}

              {/* Note section - persisted */}
              {hasNote && (
                <div className="mt-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Note</p>
                    <button 
                      onClick={handleRemoveNote}
                      className="p-1 rounded hover:bg-muted transition-colors"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>
                  <Textarea
                    placeholder="Add a note..."
                    value={question.note || ''}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    className="min-h-[60px] resize-none bg-muted/30 border-muted"
                  />
                </div>
              )}

              {/* Additional explanation for Yes/No types - persisted */}
              {(question.answerType === 'yes-no' || question.answerType === 'yes-no-na') && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Additional Explanation</p>
                  <div className="relative">
                    <Textarea
                      placeholder="Add any additional context or explanation..."
                      value={question.explanation || ''}
                      onChange={(e) => handleExplanationChange(e.target.value)}
                      className="min-h-[80px] pr-20 resize-none bg-background"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-1">
                      <button
                        onClick={handleAIClick}
                        className="flex items-center gap-1 px-2 py-1 rounded text-accent hover:bg-accent/10 transition-colors"
                      >
                        <Sparkles className="h-4 w-4" />
                      </button>
                      <button className="flex items-center gap-1 px-2 py-1 rounded text-accent hover:bg-accent/10 transition-colors">
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add reference button */}
              <Button variant="outline" size="sm" className="mt-4 text-muted-foreground hover:text-primary hover:border-primary">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Ref
              </Button>

            </div>
          </div>
        </div>
      </div>

      {showAIMenu && (
        <AIEditMenu
          text={question.answer || ''}
          position={aiMenuPosition}
          onClose={() => setShowAIMenu(false)}
          onApply={handleAIEdit}
        />
      )}
    </>
  );
}
