import { useState } from 'react';
import { 
  Plus, 
  Download, 
  Share2, 
  Eye, 
  Sparkles,
  FileText,
  Expand,
  ArrowUpDown,
  MessageSquarePlus,
  Wand2,
  ChevronDown
} from 'lucide-react';
import { Checklist, Section, Question, GenerationScope } from '@/types/checklist';
import { ChecklistSection } from './ChecklistSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChecklistBuilderProps {
  checklist: Checklist;
  onUpdate: (checklist: Checklist) => void;
}

export function ChecklistBuilder({ checklist, onUpdate }: ChecklistBuilderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

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

  const handleSectionMove = (index: number, direction: 'up' | 'down') => {
    const newSections = [...checklist.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    onUpdate({ ...checklist, sections: newSections });
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
          answerType: 'yes-no-na',
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
          answerType: 'yes-no-na',
          required: true
        },
        {
          id: `q-${Date.now()}-2`,
          text: 'Is there evidence of management\'s acknowledgment of their responsibilities?',
          answerType: 'yes-no-na',
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
      {/* Floating Action Buttons */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-lg bg-card shadow-md border-border"
        >
          <Expand className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-lg bg-card shadow-md border-border"
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
        <div className="relative group">
          <Button
            size="icon"
            className="h-10 w-10 rounded-lg bg-primary shadow-md hover:bg-primary/90"
            onClick={() => setShowAddMenu(!showAddMenu)}
          >
            <MessageSquarePlus className="h-4 w-4 text-primary-foreground" />
          </Button>
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-card px-2 py-1 rounded shadow-sm">
            Add Question
          </span>
        </div>
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-lg bg-card shadow-md border-border"
        >
          <Sparkles className="h-4 w-4 text-primary" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Description accordion */}
          <button 
            onClick={() => setDescriptionExpanded(!descriptionExpanded)}
            className="w-full flex items-center gap-2 bg-card border rounded-lg px-4 py-3 mb-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${descriptionExpanded ? 'rotate-180' : ''}`} />
            <span className="text-sm font-medium">Description</span>
          </button>

          {/* Sections */}
          {checklist.sections.map((section, index) => (
            <ChecklistSection
              key={section.id}
              section={section}
              index={index}
              onUpdate={(s) => handleSectionUpdate(index, s)}
              onDelete={() => handleSectionDelete(index)}
              onMove={(dir) => handleSectionMove(index, dir)}
              isFirst={index === 0}
              isLast={index === checklist.sections.length - 1}
            />
          ))}

          {/* Add New Block */}
          <div className="relative mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="w-full border-dashed py-8 text-muted-foreground hover:text-primary hover:border-primary group"
            >
              <Plus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Add New Block
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
    </div>
  );
}