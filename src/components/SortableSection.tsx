import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { 
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ChevronDown, ChevronUp, MoreVertical, Plus, Trash2, GripVertical } from 'lucide-react';
import { Section, Question } from '@/types/checklist';
import { SortableQuestionCard } from './SortableQuestionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SortableSectionProps {
  section: Section;
  index: number;
  onUpdate: (section: Section) => void;
  onDelete: () => void;
  isFirst: boolean;
  isLast: boolean;
  disableQuestionDnd?: boolean;
}

export function SortableSection({
  section,
  index,
  onUpdate,
  onDelete,
  isFirst,
  isLast,
  disableQuestionDnd = false
}: SortableSectionProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

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

  const handleDuplicateQuestion = (questionIndex: number) => {
    const question = section.questions[questionIndex];
    const duplicatedQuestion: Question = {
      ...question,
      id: `q-${Date.now()}`,
      text: question.text,
      subQuestions: question.subQuestions?.map((sq, i) => ({
        ...sq,
        id: `sq-${Date.now()}-${i}`
      }))
    };
    const newQuestions = [...section.questions];
    newQuestions.splice(questionIndex + 1, 0, duplicatedQuestion);
    onUpdate({ ...section, questions: newQuestions });
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`mb-6 animate-slide-up ${isDragging ? 'shadow-xl' : ''}`}
    >
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3 group/section">
        {/* Drag Handle for Section */}
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-center w-8 h-8 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover/section:opacity-100 hover:bg-muted transition-all shrink-0"
          title="Drag to reorder section"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        <button
          onClick={toggleExpanded}
          className="flex items-center gap-3 flex-1 bg-muted/30 rounded-lg px-4 py-3 font-medium text-foreground hover:bg-muted/50 transition-colors text-left"
        >
          {section.isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          )}
          
          <span className="text-muted-foreground mr-1">{index + 1}.</span>
          
          {isEditingTitle ? (
            <Input
              value={section.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              className="max-w-md bg-card"
            />
          ) : (
            <span 
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
              className="hover:underline cursor-text font-semibold"
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

      {/* Questions - now using parent's DndContext for cross-section drag */}
      {section.isExpanded && (
        <div className="ml-12">
          <SortableContext
            items={section.questions.map(q => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {section.questions.map((question, qIndex) => (
              <SortableQuestionCard
                key={question.id}
                question={question}
                index={qIndex}
                sectionIndex={index}
                onUpdate={(q) => handleQuestionUpdate(qIndex, q)}
                onDelete={() => handleQuestionDelete(qIndex)}
                onAddSubQuestion={() => handleAddSubQuestion(qIndex)}
                onDuplicate={() => handleDuplicateQuestion(qIndex)}
              />
            ))}
          </SortableContext>

          <Button
            variant="outline"
            onClick={handleAddQuestion}
            className="w-full mt-2 border-dashed text-muted-foreground hover:text-white hover:border-[#1C63A6] hover:bg-[#1C63A6] transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      )}
    </div>
  );
}
