import { useState, useRef } from 'react';
import { 
  GripVertical, 
  MoreVertical, 
  Plus, 
  Trash2, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowRight
} from 'lucide-react';
import { Question, AnswerType } from '@/types/checklist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AIEditMenu } from './AIEditMenu';

interface QuestionCardProps {
  question: Question;
  index: number;
  sectionIndex: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  onAddSubQuestion: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging?: boolean;
}

export function QuestionCard({
  question,
  index,
  sectionIndex,
  onUpdate,
  onDelete,
  onAddSubQuestion,
  onDragStart,
  onDragEnd,
  isDragging
}: QuestionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [aiMenuPosition, setAiMenuPosition] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
          <div className="flex gap-6 mt-3">
            {['Yes', 'No'].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  question.answer === option 
                    ? 'border-primary bg-primary' 
                    : 'border-muted-foreground'
                }`}>
                  {question.answer === option && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'yes-no-na':
        return (
          <div className="flex gap-6 mt-3">
            {['Yes', 'No', 'Not applicable'].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  question.answer === option 
                    ? 'border-primary bg-primary' 
                    : 'border-muted-foreground'
                }`}
                onClick={() => handleAnswerChange(option)}
                >
                  {question.answer === option && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <span className="text-sm">{option}</span>
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
            className="mt-3"
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
              className="min-h-[100px] pr-16 resize-none"
            />
            <button
              onClick={handleAIClick}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">AI</span>
            </button>
          </div>
        );

      case 'dropdown':
      case 'multiple-choice':
        return (
          <div className="mt-3 space-y-2">
            {(question.options || ['Option 1', 'Option 2', 'Option 3']).map((option, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-muted transition-colors">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  question.answer === option 
                    ? 'border-primary bg-primary' 
                    : 'border-muted-foreground'
                }`}
                onClick={() => handleAnswerChange(option)}
                >
                  {question.answer === option && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                <span className="text-sm">{option}</span>
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
        className={`question-card p-4 mb-3 animate-slide-up ${isDragging ? 'dragging' : ''}`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex gap-3">
          {/* Drag handle */}
          <button
            className="drag-handle mt-1"
            onMouseDown={onDragStart}
            onMouseUp={onDragEnd}
          >
            <GripVertical className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="flex-1">
            {/* Question text */}
            {isEditingQuestion ? (
              <Input
                value={question.text}
                onChange={(e) => handleQuestionChange(e.target.value)}
                onBlur={() => setIsEditingQuestion(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingQuestion(false)}
                autoFocus
                className="font-medium"
              />
            ) : (
              <p 
                className="font-medium cursor-text hover:bg-muted/50 px-2 py-1 -mx-2 -my-1 rounded transition-colors"
                onClick={() => setIsEditingQuestion(true)}
              >
                {question.text}
              </p>
            )}

            {/* Answer field */}
            {renderAnswerField()}

            {/* Additional explanation for Yes/No types */}
            {(question.answerType === 'yes-no' || question.answerType === 'yes-no-na') && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Additional Explanation</p>
                <div className="relative">
                  <Textarea
                    placeholder="Add any additional context or explanation..."
                    className="min-h-[80px] pr-16 resize-none"
                  />
                  <button
                    onClick={handleAIClick}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Add reference button */}
            <Button variant="outline" size="sm" className="mt-3 text-muted-foreground">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Ref
            </Button>

            {/* Sub-questions */}
            {question.subQuestions && question.subQuestions.length > 0 && (
              <div className="mt-4 pl-4 border-l-2 border-primary/20 space-y-3">
                {question.subQuestions.map((sub, i) => (
                  <div key={sub.id} className="text-sm">
                    <span className="text-muted-foreground mr-2">
                      {String.fromCharCode(97 + i)}.
                    </span>
                    {sub.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="relative">
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
