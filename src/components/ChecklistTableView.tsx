import { useState, useRef, useCallback } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Trash2, 
  Sparkles, 
  Mic, 
  MicOff, 
  GripVertical,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import { Checklist, Question, AnswerType } from '@/types/checklist';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { QuestionToolbar } from './QuestionToolbar';
import { AIEditMenu } from './AIEditMenu';
import { SortableInlineSubQuestion } from './SortableInlineSubQuestion';
import { useVoiceToText } from '@/hooks/useVoiceToText';
import { useToast } from '@/hooks/use-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ChecklistTableViewProps {
  checklist: Checklist;
  onUpdate: (checklist: Checklist) => void;
  isPreviewMode: boolean;
}

// Sub-question drag-and-drop container component
interface SubQuestionDndContainerProps {
  subQuestions: Question[];
  onReorder: (subQuestions: Question[]) => void;
  onUpdateSubQuestion: (index: number, question: Question) => void;
  onDeleteSubQuestion: (index: number) => void;
}

function SubQuestionDndContainer({
  subQuestions,
  onReorder,
  onUpdateSubQuestion,
  onDeleteSubQuestion,
}: SubQuestionDndContainerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = subQuestions.findIndex((q) => q.id === active.id);
      const newIndex = subQuestions.findIndex((q) => q.id === over.id);
      const reordered = arrayMove(subQuestions, oldIndex, newIndex);
      onReorder(reordered);
    }
  };

  return (
    <div className="mt-3 ml-4 border-l-2 border-muted pl-3 space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={subQuestions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {subQuestions.map((sub, i) => (
            <SortableInlineSubQuestion
              key={sub.id}
              question={sub}
              index={i}
              onUpdate={(updatedSub) => onUpdateSubQuestion(i, updatedSub)}
              onDelete={() => onDeleteSubQuestion(i)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

interface TableRowProps {
  question: Question;
  sectionIndex: number;
  questionIndex: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onAddSubQuestion: () => void;
  isPreviewMode: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function TableRow({ 
  question, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onAddSubQuestion,
  isPreviewMode,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown
}: TableRowProps) {
  const [checked, setChecked] = useState(false);
  const [procedureStatus, setProcedureStatus] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [aiMenuPosition, setAiMenuPosition] = useState({ x: 0, y: 0 });
  const [activeVoiceField, setActiveVoiceField] = useState<'answer' | 'explanation' | null>(null);
  const [hasReference, setHasReference] = useState(!!question.reference);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rowRef = useRef<HTMLTableRowElement>(null);
  const { toast } = useToast();

  // Voice-to-text handlers
  const handleVoiceResult = useCallback((transcript: string) => {
    if (activeVoiceField === 'answer') {
      const currentAnswer = question.answer || '';
      const newAnswer = currentAnswer ? `${currentAnswer} ${transcript}` : transcript;
      onUpdate({ ...question, answer: newAnswer });
      toast({
        title: "Voice input captured",
        description: transcript.length > 50 ? transcript.substring(0, 50) + '...' : transcript,
      });
    }
    setActiveVoiceField(null);
  }, [activeVoiceField, question, onUpdate, toast]);

  const handleVoiceError = useCallback((error: string) => {
    toast({
      title: "Voice input error",
      description: error,
      variant: "destructive",
    });
    setActiveVoiceField(null);
  }, [toast]);

  const { isListening, toggleListening, isSupported } = useVoiceToText({
    onResult: handleVoiceResult,
    onError: handleVoiceError,
  });

  const handleMicClick = () => {
    if (!isSupported) {
      toast({
        title: "Not supported",
        description: "Voice input is not supported in this browser. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }
    setActiveVoiceField('answer');
    toggleListening();
  };

  const handleAnswerChange = (answer: string) => {
    onUpdate({ ...question, answer });
  };

  const handleTypeChange = (type: AnswerType) => {
    onUpdate({ ...question, answerType: type, answer: '' });
  };

  const handleTextChange = (text: string) => {
    onUpdate({ ...question, text });
  };

  const handleProcedureChange = (value: string) => {
    setProcedureStatus(value);
    onUpdate({ ...question, note: value });
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

  const handleToggleReference = () => {
    setHasReference(!hasReference);
    onUpdate({ ...question, reference: !hasReference ? '' : undefined });
  };

  const handleAddNote = () => {
    onUpdate({ ...question, explanation: question.explanation || '' });
  };

  // Strip HTML tags for plain text editing
  const plainText = question.text.replace(/<[^>]*>/g, '');

  const renderAnswerField = () => {
    if (isPreviewMode) {
      return (
        <span className="text-sm text-muted-foreground">
          {question.answer || '-'}
        </span>
      );
    }

    switch (question.answerType) {
      case 'yes-no':
        return (
          <div className="flex gap-4">
            {['Yes', 'No'].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer group">
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
          <div className="flex gap-4">
            {['Yes', 'No', 'N/A'].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer group">
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
            className="bg-background h-9"
          />
        );

      case 'long-answer':
        return (
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Enter your detailed answer..."
              value={question.answer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="min-h-[80px] pr-16 resize-none bg-background"
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <button
                onClick={handleAIClick}
                className="flex items-center gap-1 px-2 py-1 rounded text-accent hover:bg-accent/10 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
              </button>
              <button 
                onClick={handleMicClick}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                  isListening && activeVoiceField === 'answer' 
                    ? 'text-red-500 bg-red-100 animate-pulse' 
                    : 'text-accent hover:bg-accent/10'
                }`}
                title={isListening && activeVoiceField === 'answer' ? 'Stop recording' : 'Start voice input'}
              >
                {isListening && activeVoiceField === 'answer' ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            </div>
          </div>
        );

      case 'dropdown':
      case 'multiple-choice':
        return (
          <div className="space-y-1">
            {(question.options || ['Option 1', 'Option 2', 'Option 3']).map((option, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-muted transition-colors group">
                <div 
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    question.answer === option 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground/50 group-hover:border-primary/50'
                  }`}
                  onClick={() => handleAnswerChange(option)}
                >
                  {question.answer === option && (
                    <Check className="h-2.5 w-2.5 text-primary-foreground" />
                  )}
                </div>
                <span className="text-sm text-foreground">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <Input
            placeholder="Enter your answer..."
            value={question.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="bg-background h-9"
          />
        );
    }
  };

  return (
    <>
      <tr 
        ref={rowRef}
        className={`border-b hover:bg-muted/30 transition-colors ${isFocused ? 'bg-muted/20' : ''}`}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          if (!rowRef.current?.contains(e.relatedTarget as Node)) {
            setIsFocused(false);
          }
        }}
        tabIndex={0}
      >
        {/* Checkbox + Drag handle */}
        <td className="p-3 w-14">
          <div className="flex items-center gap-1">
            {!isPreviewMode && (
              <div className="flex flex-col items-center gap-0.5">
                <button
                  onClick={onMoveUp}
                  disabled={isFirst}
                  className="p-0.5 rounded hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-3 w-3 text-muted-foreground" />
                </button>
                <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
                <button
                  onClick={onMoveDown}
                  disabled={isLast}
                  className="p-0.5 rounded hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            )}
            <Checkbox
              checked={checked}
              onCheckedChange={(val) => setChecked(!!val)}
              disabled={isPreviewMode}
            />
          </div>
        </td>

        {/* Description - editable */}
        <td className="p-3 min-w-[300px] max-w-[400px]">
          <div className="border rounded-lg p-3 bg-background min-h-[60px] relative group">
            {isEditing && !isPreviewMode ? (
              <Textarea
                value={plainText}
                onChange={(e) => handleTextChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="min-h-[60px] resize-none bg-transparent border-0 p-0 focus-visible:ring-0"
                placeholder="Enter question text..."
              />
            ) : (
              <div 
                className="text-sm text-foreground whitespace-pre-wrap cursor-text prose prose-sm max-w-none
                  [&_ol]:list-[lower-alpha] [&_ol]:ml-4 [&_ol]:my-2
                  [&_li]:my-1 [&_li]:pl-1
                  [&_p]:my-2 [&_p:first-child]:mt-0
                  [&_strong]:font-semibold
                  [&_em]:italic [&_em]:text-muted-foreground"
                onClick={() => !isPreviewMode && setIsEditing(true)}
                dangerouslySetInnerHTML={{ __html: question.text || '<span class="text-muted-foreground">Click to add question text...</span>' }}
              />
            )}

            {/* Floating Toolbar on focus */}
            {isFocused && !isPreviewMode && (
              <div className="absolute -top-12 left-0 z-10">
                <QuestionToolbar
                  currentType={question.answerType}
                  onChangeType={handleTypeChange}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                  onAddSubQuestion={onAddSubQuestion}
                  onAddNote={handleAddNote}
                  onToggleReference={handleToggleReference}
                  hasReference={hasReference}
                />
              </div>
            )}
          </div>

          {/* Sub-questions - fully editable with drag-and-drop */}
          {question.subQuestions && question.subQuestions.length > 0 && !isPreviewMode && (
            <SubQuestionDndContainer
              subQuestions={question.subQuestions}
              onReorder={(newSubQuestions) => {
                onUpdate({ ...question, subQuestions: newSubQuestions });
              }}
              onUpdateSubQuestion={(index, updatedSub) => {
                const newSubQuestions = [...(question.subQuestions || [])];
                newSubQuestions[index] = updatedSub;
                onUpdate({ ...question, subQuestions: newSubQuestions });
              }}
              onDeleteSubQuestion={(index) => {
                const newSubQuestions = (question.subQuestions || []).filter((_, idx) => idx !== index);
                onUpdate({ ...question, subQuestions: newSubQuestions });
              }}
            />
          )}
          {/* Sub-questions - preview mode (read-only) */}
          {question.subQuestions && question.subQuestions.length > 0 && isPreviewMode && (
            <div className="mt-2 ml-4 border-l-2 border-muted pl-3 space-y-2">
              {question.subQuestions.map((sub, i) => (
                <div key={sub.id} className="bg-muted/30 rounded-lg p-2 text-sm">
                  <span className="text-muted-foreground font-medium mr-2">
                    {String.fromCharCode(97 + i)}.
                  </span>
                  {sub.text.replace(/<[^>]*>/g, '')}
                  {sub.answer && (
                    <span className="ml-2 text-muted-foreground">— {sub.answer}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </td>


        {/* Responses - with answer type specific fields */}
        <td className="p-3 min-w-[250px]">
          {renderAnswerField()}
        </td>

        {/* Reference */}
        <td className="p-3 w-[100px]">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-[#1C63A6] hover:text-white transition-colors"
            disabled={isPreviewMode}
          >
            + Ref
          </Button>
        </td>
      </tr>

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

export function ChecklistTableView({ checklist, onUpdate, isPreviewMode }: ChecklistTableViewProps) {
  const handleQuestionUpdate = (sectionIndex: number, questionIndex: number, updatedQuestion: Question) => {
    const newSections = [...checklist.sections];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      questions: newSections[sectionIndex].questions.map((q, idx) =>
        idx === questionIndex ? updatedQuestion : q
      ),
    };
    onUpdate({ ...checklist, sections: newSections });
  };

  const handleQuestionDelete = (sectionIndex: number, questionIndex: number) => {
    const newSections = [...checklist.sections];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      questions: newSections[sectionIndex].questions.filter((_, idx) => idx !== questionIndex),
    };
    onUpdate({ ...checklist, sections: newSections });
  };

  const handleQuestionDuplicate = (sectionIndex: number, questionIndex: number) => {
    const question = checklist.sections[sectionIndex].questions[questionIndex];
    const newQuestion: Question = {
      ...question,
      id: `q-${Date.now()}`,
    };
    const newSections = [...checklist.sections];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      questions: [
        ...newSections[sectionIndex].questions.slice(0, questionIndex + 1),
        newQuestion,
        ...newSections[sectionIndex].questions.slice(questionIndex + 1),
      ],
    };
    onUpdate({ ...checklist, sections: newSections });
  };

  const handleAddSubQuestion = (sectionIndex: number, questionIndex: number) => {
    const question = checklist.sections[sectionIndex].questions[questionIndex];
    const newSubQuestion = {
      id: `sq-${Date.now()}`,
      text: 'New sub-question',
      answerType: 'short-answer' as AnswerType,
      required: false,
    };
    const updatedQuestion = {
      ...question,
      subQuestions: [...(question.subQuestions || []), newSubQuestion],
    };
    handleQuestionUpdate(sectionIndex, questionIndex, updatedQuestion);
  };

  const handleMoveQuestion = (sectionIndex: number, questionIndex: number, direction: 'up' | 'down') => {
    const newSections = [...checklist.sections];
    const questions = [...newSections[sectionIndex].questions];
    
    if (direction === 'up' && questionIndex > 0) {
      [questions[questionIndex - 1], questions[questionIndex]] = [questions[questionIndex], questions[questionIndex - 1]];
    } else if (direction === 'down' && questionIndex < questions.length - 1) {
      [questions[questionIndex], questions[questionIndex + 1]] = [questions[questionIndex + 1], questions[questionIndex]];
    }
    
    newSections[sectionIndex] = { ...newSections[sectionIndex], questions };
    onUpdate({ ...checklist, sections: newSections });
  };

  const handleAddRow = (sectionIndex: number) => {
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

  // Strip number prefix from section title
  const cleanTitle = (title: string) => title.replace(/^\d+\.\s*/, '');

  return (
    <div className="space-y-8">
      {checklist.sections.map((section, sectionIndex) => (
        <div key={section.id} className="bg-card border rounded-xl overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <h3 className="font-semibold text-foreground">
              {sectionIndex + 1}. {cleanTitle(section.title)}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-3 w-14"></th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground min-w-[250px]">
                    Response
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground w-[100px]">
                    w/p reference
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.questions.map((question, questionIndex) => (
                  <TableRow
                    key={question.id}
                    question={question}
                    sectionIndex={sectionIndex}
                    questionIndex={questionIndex}
                    onUpdate={(q) => handleQuestionUpdate(sectionIndex, questionIndex, q)}
                    onDelete={() => handleQuestionDelete(sectionIndex, questionIndex)}
                    onDuplicate={() => handleQuestionDuplicate(sectionIndex, questionIndex)}
                    onAddSubQuestion={() => handleAddSubQuestion(sectionIndex, questionIndex)}
                    isPreviewMode={isPreviewMode}
                    isFirst={questionIndex === 0}
                    isLast={questionIndex === section.questions.length - 1}
                    onMoveUp={() => handleMoveQuestion(sectionIndex, questionIndex, 'up')}
                    onMoveDown={() => handleMoveQuestion(sectionIndex, questionIndex, 'down')}
                  />
                ))}
              </tbody>
            </table>
          </div>
          
          {!isPreviewMode && (
            <div className="p-4 border-t">
              <Button
                variant="default"
                size="sm"
                onClick={() => handleAddRow(sectionIndex)}
                className="bg-[#3379C9] hover:bg-[#1C63A6] text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Row
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}