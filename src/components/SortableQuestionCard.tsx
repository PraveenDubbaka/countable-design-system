import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useRef } from 'react';
import { 
  GripVertical, 
  MoreVertical, 
  Plus, 
  Trash2, 
  Sparkles,
  Check,
  ArrowRight,
  Mic,
  ChevronRight
} from 'lucide-react';
import { Question, AnswerType } from '@/types/checklist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AIEditMenu } from './AIEditMenu';

interface SortableQuestionCardProps {
  question: Question;
  index: number;
  sectionIndex: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  onAddSubQuestion: () => void;
}

export function SortableQuestionCard({
  question,
  index,
  sectionIndex,
  onUpdate,
  onDelete,
  onAddSubQuestion,
}: SortableQuestionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [aiMenuPosition, setAiMenuPosition] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleQuestionChange = (text: string) => {
    onUpdate({ ...question, text });
  };

  const handleAnswerChange = (answer: string) => {
    onUpdate({ ...question, answer });
  };

  const handleTypeChange = (answerType: AnswerType) => {
    onUpdate({ ...question, answerType, answer: '' });
    setShowMenu(false);
  };

  const toggleRequired = () => {
    onUpdate({ ...question, required: !question.required });
    setShowMenu(false);
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

  const answerTypeLabels: Record<AnswerType, string> = {
    'yes-no': 'Yes / No',
    'yes-no-na': 'Yes / No / N/A',
    'multiple-choice': 'Multiple Choice',
    'short-answer': 'Short Answer',
    'long-answer': 'Long Answer',
    'dropdown': 'Dropdown'
  };

  const renderAnswerField = () => {
    switch (question.answerType) {
      case 'yes-no':
        return (
          <div className="flex gap-8 mt-3">
            {['Yes', 'No'].map((option) => (
              <label key={option} className="flex items-center gap-2.5 cursor-pointer group">
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
          <div className="flex gap-8 mt-3">
            {['Yes', 'No', 'Not applicable'].map((option) => (
              <label key={option} className="flex items-center gap-2.5 cursor-pointer group">
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
        return (
          <div className="mt-3 space-y-2">
            {(question.options || ['Option 1', 'Option 2', 'Option 3']).map((option, i) => (
              <label key={i} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-md hover:bg-muted transition-colors group">
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
        return null;
    }
  };

  return (
    <>
      <div 
        ref={setNodeRef}
        style={style}
        className={`question-card p-5 mb-3 animate-slide-up group/card ${isDragging ? 'shadow-xl ring-2 ring-primary/20' : ''}`}
      >
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
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-6 h-6 rounded hover:bg-muted transition-all mt-0.5 shrink-0"
            aria-label={isExpanded ? 'Collapse question' : 'Expand question'}
          >
            <ChevronRight 
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
            />
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Question text */}
            {isEditingQuestion ? (
              <Input
                value={question.text}
                onChange={(e) => handleQuestionChange(e.target.value)}
                onBlur={() => setIsEditingQuestion(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingQuestion(false)}
                autoFocus
                className="font-medium bg-background"
              />
            ) : (
              <p 
                className="text-foreground cursor-text hover:bg-muted/50 px-2 py-1 -mx-2 -my-1 rounded transition-colors"
                onClick={() => setIsEditingQuestion(true)}
              >
                {question.text}
              </p>
            )}

            {/* Collapsible answer section */}
            <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[2000px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
              {/* Answer field */}
              {renderAnswerField()}

              {/* Additional explanation for Yes/No types */}
              {(question.answerType === 'yes-no' || question.answerType === 'yes-no-na') && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Additional Explanation</p>
                  <div className="relative">
                    <Textarea
                      placeholder="Add any additional context or explanation..."
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

              {/* Sub-questions (nested blocks with indentation) */}
              {question.subQuestions && question.subQuestions.length > 0 && (
                <div className="mt-5 ml-4 border-l-2 border-muted pl-4 space-y-3">
                  {question.subQuestions.map((sub, i) => (
                    <div key={sub.id} className="bg-muted/30 rounded-lg p-3 group hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <button className="drag-handle mt-0.5 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity">
                          <GripVertical className="h-4 w-4" />
                        </button>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            <span className="text-muted-foreground font-medium mr-2">
                              {String.fromCharCode(97 + i)}.
                            </span>
                            {sub.text}
                          </p>
                          {/* Render sub-question answer type */}
                          <div className="mt-2">
                            {sub.answerType === 'short-answer' && (
                              <Input 
                                placeholder="Enter your answer..." 
                                className="h-8 text-sm bg-background" 
                              />
                            )}
                            {sub.answerType === 'long-answer' && (
                              <div className="relative">
                                <Textarea 
                                  placeholder="Enter your detailed answer..." 
                                  className="min-h-[60px] text-sm resize-none bg-background pr-16" 
                                />
                                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                                  <button className="p-1 rounded text-accent hover:bg-accent/10 transition-colors">
                                    <Sparkles className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                            {(sub.answerType === 'yes-no' || sub.answerType === 'yes-no-na') && (
                              <div className="flex gap-4 mt-1">
                                {(sub.answerType === 'yes-no' ? ['Yes', 'No'] : ['Yes', 'No', 'N/A']).map((opt) => (
                                  <label key={opt} className="flex items-center gap-1.5 cursor-pointer text-xs">
                                    <div className="w-3 h-3 rounded-full border border-muted-foreground/50 hover:border-primary/50 transition-colors" />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
            </button>

            {showMenu && (
              <div className="absolute top-full right-0 mt-1 bg-card border rounded-lg shadow-lg p-1 z-20 w-56 animate-scale-in">
                <button
                  onClick={toggleRequired}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                >
                  <span>Required</span>
                  <div className={`w-8 h-5 rounded-full transition-colors ${
                    question.required ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mt-0.5 ${
                      question.required ? 'translate-x-3.5' : 'translate-x-0.5'
                    }`} />
                  </div>
                </button>
                
                <div className="h-px bg-border my-1" />
                
                <div className="px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-2">Convert to:</p>
                  <div className="space-y-1">
                    {(Object.keys(answerTypeLabels) as AnswerType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleTypeChange(type)}
                        className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                          question.answerType === type 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        {answerTypeLabels[type]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border my-1" />

                <button
                  onClick={onAddSubQuestion}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Sub-Question
                </button>

                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                  Move to Category
                </button>

                <div className="h-px bg-border my-1" />

                <button
                  onClick={onDelete}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Question
                </button>
              </div>
            )}
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
