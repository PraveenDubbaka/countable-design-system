import { useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { Section, Question, AnswerType } from '@/types/checklist';
import { QuestionCard } from './QuestionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChecklistSectionProps {
  section: Section;
  index: number;
  onUpdate: (section: Section) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

export function ChecklistSection({
  section,
  index,
  onUpdate,
  onDelete,
  onMove,
  isFirst,
  isLast
}: ChecklistSectionProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draggedQuestion, setDraggedQuestion] = useState<number | null>(null);

  const toggleExpanded = () => {
    onUpdate({ ...section, isExpanded: !section.isExpanded });
  };

  const handleTitleChange = (title: string) => {
    onUpdate({ ...section, title });
  };

  const handleQuestionUpdate = (questionIndex: number, question: Question) => {
    const newQuestions = [...section.questions];
    newQuestions[questionIndex] = question;
    onUpdate({ ...section, questions: newQuestions });
  };

  const handleQuestionDelete = (questionIndex: number) => {
    const newQuestions = section.questions.filter((_, i) => i !== questionIndex);
    onUpdate({ ...section, questions: newQuestions });
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: 'New question - click to edit',
      answerType: 'yes-no-na',
      required: false
    };
    onUpdate({ ...section, questions: [...section.questions, newQuestion] });
  };

  const handleAddSubQuestion = (questionIndex: number) => {
    const question = section.questions[questionIndex];
    const newSubQuestion: Question = {
      id: `sq-${Date.now()}`,
      text: 'New sub-question',
      answerType: 'short-answer',
      required: false
    };
    const updatedQuestion = {
      ...question,
      subQuestions: [...(question.subQuestions || []), newSubQuestion]
    };
    handleQuestionUpdate(questionIndex, updatedQuestion);
  };

  return (
    <div className="mb-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <button className="drag-handle">
          <GripVertical className="h-5 w-5" />
        </button>
        
        <button
          onClick={toggleExpanded}
          className="section-header flex-1"
        >
          {section.isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          )}
          
          <span className="text-muted-foreground mr-2">{index + 1}.</span>
          
          {isEditingTitle ? (
            <Input
              value={section.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              className="max-w-md"
            />
          ) : (
            <span 
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
              className="hover:underline cursor-text"
            >
              {section.title}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <MoreVertical className="h-5 w-5 text-muted-foreground" />
          </button>

          {showMenu && (
            <div className="absolute top-full right-0 mt-1 bg-card border rounded-lg shadow-lg p-1 z-20 w-48 animate-scale-in">
              <button
                onClick={() => {
                  onMove('up');
                  setShowMenu(false);
                }}
                disabled={isFirst}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors disabled:opacity-50"
              >
                <ChevronUp className="h-4 w-4" />
                Move Up
              </button>
              <button
                onClick={() => {
                  onMove('down');
                  setShowMenu(false);
                }}
                disabled={isLast}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors disabled:opacity-50"
              >
                <ChevronDown className="h-4 w-4" />
                Move Down
              </button>
              <div className="h-px bg-border my-1" />
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Section
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      {section.isExpanded && (
        <div className="pl-7">
          {section.questions.map((question, qIndex) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={qIndex}
              sectionIndex={index}
              onUpdate={(q) => handleQuestionUpdate(qIndex, q)}
              onDelete={() => handleQuestionDelete(qIndex)}
              onAddSubQuestion={() => handleAddSubQuestion(qIndex)}
              onDragStart={() => setDraggedQuestion(qIndex)}
              onDragEnd={() => setDraggedQuestion(null)}
              isDragging={draggedQuestion === qIndex}
            />
          ))}

          <Button
            variant="outline"
            onClick={handleAddQuestion}
            className="w-full mt-2 border-dashed text-muted-foreground hover:text-foreground hover:border-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      )}
    </div>
  );
}
