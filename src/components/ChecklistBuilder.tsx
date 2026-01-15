import { useState, useMemo, useRef, useCallback } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  getFirstCollision
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { 
  Plus, 
  Download, 
  Share2, 
  Eye, 
  FileText,
  Wand2,
  ChevronDown,
  FileDown
} from 'lucide-react';
import { Checklist, Section, Question } from '@/types/checklist';
import { SortableSection } from './SortableSection';
import { FloatingActionBar } from './FloatingActionBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { RichTextToolbar } from './RichTextToolbar';
import { useRichTextToolbarContext } from '@/contexts/RichTextToolbarContext';

interface ChecklistBuilderProps {
  checklist: Checklist;
  onUpdate: (checklist: Checklist) => void;
}

export function ChecklistBuilder({ checklist, onUpdate }: ChecklistBuilderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [objectiveExpanded, setObjectiveExpanded] = useState(false);
  const [isEditingObjective, setIsEditingObjective] = useState(false);
  const [objectiveDraft, setObjectiveDraft] = useState(checklist.objective || '');
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const objectiveTextareaRef = useRef<HTMLTextAreaElement>(null);
  const { toolbarState, showToolbar, hideToolbar, handleFormatAction, toolbarRef } = useRichTextToolbarContext();

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

  const handleTitleChange = (title: string) => {
    onUpdate({ ...checklist, title });
  };

  const handleSectionUpdate = (index: number, section: Section) => {
    const newSections = [...checklist.sections];
    newSections[index] = section;
    onUpdate({ ...checklist, sections: newSections });
  };

  const handleSectionDelete = (index: number) => {
    const newSections = checklist.sections.filter((_, i) => i !== index);
    onUpdate({ ...checklist, sections: newSections });
  };

  // Get all question IDs for the sortable context
  const allQuestionIds = checklist.sections.flatMap(s => s.questions.map(q => q.id));

  // Check if all sections are collapsed
  const allSectionsCollapsed = useMemo(() => {
    return checklist.sections.every(s => !s.isExpanded);
  }, [checklist.sections]);

  // Check if all questions are collapsed
  const allQuestionsCollapsed = useMemo(() => {
    return checklist.sections.every(s => 
      s.questions.every(q => q.isExpanded === false)
    );
  }, [checklist.sections]);

  const handleCollapseSections = () => {
    const newSections = checklist.sections.map(s => ({ ...s, isExpanded: false }));
    onUpdate({ ...checklist, sections: newSections });
  };

  const handleExpandSections = () => {
    const newSections = checklist.sections.map(s => ({ ...s, isExpanded: true }));
    onUpdate({ ...checklist, sections: newSections });
  };

  const handleCollapseQuestions = () => {
    const newSections = checklist.sections.map(s => ({
      ...s,
      questions: s.questions.map(q => ({ ...q, isExpanded: false }))
    }));
    onUpdate({ ...checklist, sections: newSections });
  };

  const handleExpandQuestions = () => {
    const newSections = checklist.sections.map(s => ({
      ...s,
      questions: s.questions.map(q => ({ ...q, isExpanded: true }))
    }));
    onUpdate({ ...checklist, sections: newSections });
  };

  // Find which section a question belongs to
  const findSectionByQuestionId = (questionId: string): { sectionIndex: number; questionIndex: number } | null => {
    for (let sIndex = 0; sIndex < checklist.sections.length; sIndex++) {
      const qIndex = checklist.sections[sIndex].questions.findIndex(q => q.id === questionId);
      if (qIndex !== -1) {
        return { sectionIndex: sIndex, questionIndex: qIndex };
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Check if dragging a question (not a section)
    const location = findSectionByQuestionId(active.id as string);
    if (location) {
      setActiveQuestion(checklist.sections[location.sectionIndex].questions[location.questionIndex]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveQuestion(null);
    
    if (!over) return;

    // Check if this is a section drag
    const isSectionDrag = checklist.sections.some(s => s.id === active.id);
    
    if (isSectionDrag) {
      // Handle section reordering
      if (active.id !== over.id) {
        const oldIndex = checklist.sections.findIndex(s => s.id === active.id);
        const newIndex = checklist.sections.findIndex(s => s.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newSections = arrayMove(checklist.sections, oldIndex, newIndex);
          onUpdate({ ...checklist, sections: newSections });
        }
      }
      return;
    }

    // Handle question drag
    const activeLocation = findSectionByQuestionId(active.id as string);
    if (!activeLocation) return;

    // Check if dropping onto a section
    const targetSectionIndex = checklist.sections.findIndex(s => s.id === over.id);
    
    if (targetSectionIndex !== -1) {
      // Dropping onto a section - add to end of that section
      if (targetSectionIndex !== activeLocation.sectionIndex) {
        const newSections = [...checklist.sections];
        const [movedQuestion] = newSections[activeLocation.sectionIndex].questions.splice(activeLocation.questionIndex, 1);
        newSections[targetSectionIndex].questions.push(movedQuestion);
        onUpdate({ ...checklist, sections: newSections });
      }
      return;
    }

    // Check if dropping onto another question
    const overLocation = findSectionByQuestionId(over.id as string);
    if (!overLocation) return;

    if (activeLocation.sectionIndex === overLocation.sectionIndex) {
      // Same section - just reorder
      if (activeLocation.questionIndex !== overLocation.questionIndex) {
        const newSections = [...checklist.sections];
        newSections[activeLocation.sectionIndex] = {
          ...newSections[activeLocation.sectionIndex],
          questions: arrayMove(
            newSections[activeLocation.sectionIndex].questions,
            activeLocation.questionIndex,
            overLocation.questionIndex
          )
        };
        onUpdate({ ...checklist, sections: newSections });
      }
    } else {
      // Different section - move question
      const newSections = [...checklist.sections];
      const [movedQuestion] = newSections[activeLocation.sectionIndex].questions.splice(activeLocation.questionIndex, 1);
      newSections[overLocation.sectionIndex].questions.splice(overLocation.questionIndex, 0, movedQuestion);
      onUpdate({ ...checklist, sections: newSections });
    }
  };

  const handleAddSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      questions: [],
      isExpanded: true
    };
    onUpdate({ ...checklist, sections: [...checklist.sections, newSection] });
    setShowAddMenu(false);
  };

  const handleAddFromTemplate = () => {
    const templateSection: Section = {
      id: `section-${Date.now()}`,
      title: 'Template Section',
      questions: [
        {
          id: `q-${Date.now()}-1`,
          text: 'Has the engagement letter been signed by both parties?',
          answerType: 'yes-no',
          required: true
        },
        {
          id: `q-${Date.now()}-2`,
          text: 'Describe the scope of services agreed upon.',
          answerType: 'long-answer',
          required: false
        }
      ],
      isExpanded: true
    };
    onUpdate({ ...checklist, sections: [...checklist.sections, templateSection] });
    setShowAddMenu(false);
  };

  const handleAddWithAI = () => {
    const aiSection: Section = {
      id: `section-${Date.now()}`,
      title: 'AI Generated: Compliance Review',
      questions: [
        {
          id: `q-${Date.now()}-1`,
          text: 'Have all regulatory requirements been identified and documented?',
          answerType: 'yes-no',
          required: true
        },
        {
          id: `q-${Date.now()}-2`,
          text: 'Is there evidence of management\'s acknowledgment of their responsibilities?',
          answerType: 'yes-no',
          required: true
        },
        {
          id: `q-${Date.now()}-3`,
          text: 'Document any compliance concerns or exceptions noted.',
          answerType: 'long-answer',
          required: false
        }
      ],
      isExpanded: true
    };
    onUpdate({ ...checklist, sections: [...checklist.sections, aiSection] });
    setShowAddMenu(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Top Toolbar */}
      <div className="border-b bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isEditingTitle ? (
            <Input
              value={checklist.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              autoFocus
              className="text-lg font-semibold max-w-md"
            />
          ) : (
            <h1 
              className="text-lg font-semibold cursor-text hover:bg-muted px-2 py-1 -mx-2 rounded transition-colors"
              onClick={() => setIsEditingTitle(true)}
            >
              {checklist.title}
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download className="h-4 w-4" />
              Export
              <ChevronDown className="h-3 w-3" />
            </Button>
            
            {showExportMenu && (
              <div className="absolute top-full right-0 mt-1 bg-card border rounded-lg shadow-lg p-1 z-20 w-40 animate-scale-in">
                <button
                  onClick={() => {
                    toast.success('Exporting to PDF...');
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                >
                  <FileDown className="h-4 w-4" />
                  Export as PDF
                </button>
                <button
                  onClick={() => {
                    toast.success('Exporting to Word...');
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Export as Word
                </button>
              </div>
            )}
          </div>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Objective accordion */}
          <div className="mb-6">
            <button 
              onClick={() => setObjectiveExpanded(!objectiveExpanded)}
              className="w-full flex items-center gap-2 bg-card border rounded-t-lg px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${objectiveExpanded ? 'rotate-180' : ''}`} />
              <span className="text-sm font-medium">Objective</span>
            </button>
            
            {objectiveExpanded && (
              <div className="bg-card border border-t-0 rounded-b-lg p-4">
                {isEditingObjective ? (
                  <div className="space-y-3">
                    <textarea
                      ref={objectiveTextareaRef}
                      value={objectiveDraft}
                      onChange={(e) => setObjectiveDraft(e.target.value)}
                      onFocus={(e) => showToolbar(e.target)}
                      onBlur={(e) => {
                        // Delay hiding to allow toolbar clicks
                        setTimeout(() => {
                          if (!e.relatedTarget?.closest('[data-rich-text-toolbar]')) {
                            // Don't hide if clicking toolbar
                          }
                        }, 100);
                      }}
                      onSelect={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        if (target.selectionStart !== target.selectionEnd) {
                          showToolbar(target);
                        }
                      }}
                      className="w-full min-h-[200px] p-3 bg-background border rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter the objective for this checklist..."
                      autoFocus
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setObjectiveDraft(checklist.objective || '');
                          setIsEditingObjective(false);
                          hideToolbar();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          onUpdate({ ...checklist, objective: objectiveDraft });
                          setIsEditingObjective(false);
                          hideToolbar();
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => setIsEditingObjective(true)}
                    className="cursor-pointer hover:bg-muted/50 rounded-lg p-3 -m-3 transition-colors group"
                  >
                    {checklist.objective ? (
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                        {checklist.objective}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Click to add objective...
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to edit
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sections with drag-and-drop */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={[...checklist.sections.map(s => s.id), ...allQuestionIds]}
              strategy={verticalListSortingStrategy}
            >
              {checklist.sections.map((section, index) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  index={index}
                  onUpdate={(s) => handleSectionUpdate(index, s)}
                  onDelete={() => handleSectionDelete(index)}
                  isFirst={index === 0}
                  isLast={index === checklist.sections.length - 1}
                  disableQuestionDnd={true}
                />
              ))}
            </SortableContext>
          </DndContext>

          {/* Add New Block */}
          <div className="relative mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="w-full border-dashed py-8 text-muted-foreground hover:text-white hover:border-[#1C63A6] hover:bg-[#1C63A6] group transition-colors"
            >
              <Plus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Add New Category
            </Button>

            {showAddMenu && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border rounded-xl shadow-xl p-2 z-20 w-64 animate-scale-in">
                <button
                  onClick={handleAddSection}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Plus className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Empty Section</p>
                    <p className="text-xs text-muted-foreground">Start from scratch</p>
                  </div>
                </button>

                <button
                  onClick={handleAddFromTemplate}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <FileText className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">From Template</p>
                    <p className="text-xs text-muted-foreground">Use existing template</p>
                  </div>
                </button>

                <button
                  onClick={handleAddWithAI}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Wand2 className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Generate with AI</p>
                    <p className="text-xs text-muted-foreground">AI-powered generation</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <FloatingActionBar
        checklist={checklist}
        onUpdate={onUpdate}
        onCollapseSections={handleCollapseSections}
        onExpandSections={handleExpandSections}
        onCollapseQuestions={handleCollapseQuestions}
        onExpandQuestions={handleExpandQuestions}
        allSectionsCollapsed={allSectionsCollapsed}
        allQuestionsCollapsed={allQuestionsCollapsed}
      />

      {/* Rich Text Toolbar */}
      {toolbarState.isVisible && (
        <RichTextToolbar
          position={toolbarState.position}
          onFormatAction={handleFormatAction}
          onAIAssist={() => {
            toast.info('AI assist coming soon!');
          }}
          toolbarRef={toolbarRef}
        />
      )}
    </div>
  );
}

