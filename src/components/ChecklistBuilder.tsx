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
  Wand2
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
    // Simulate adding from template
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
    // Simulate AI generation
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
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isEditingTitle ? (
              <Input
                value={checklist.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                autoFocus
                className="text-xl font-semibold max-w-xl"
              />
            ) : (
              <h1 
                className="text-xl font-semibold cursor-text hover:text-primary transition-colors"
                onClick={() => setIsEditingTitle(true)}
              >
                {checklist.title}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              {showExportMenu && (
                <div className="absolute top-full right-0 mt-2 bg-card border rounded-lg shadow-lg p-1 z-20 w-40 animate-scale-in">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                    <FileText className="h-4 w-4" />
                    Export as PDF
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                    <FileText className="h-4 w-4" />
                    Export as Word
                  </button>
                </div>
              )}
            </div>

            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share with Client
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-xl bg-card shadow-lg"
        >
          <Expand className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-xl bg-card shadow-lg"
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
        <div className="relative">
          <Button
            size="icon"
            className="h-10 w-10 rounded-xl bg-primary shadow-lg"
            onClick={() => setShowAddMenu(!showAddMenu)}
          >
            <MessageSquarePlus className="h-4 w-4" />
          </Button>
          <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground whitespace-nowrap pl-4">
            Add Question
          </span>
        </div>
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-xl bg-card shadow-lg"
        >
          <Sparkles className="h-4 w-4 text-primary" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Description accordion */}
        <div className="bg-card border rounded-xl p-4 mb-6">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-sm font-medium">Description</span>
          </button>
        </div>

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
            className="w-full border-dashed py-8 text-muted-foreground hover:text-foreground hover:border-primary group"
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
                  <Plus className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Empty Section</p>
                  <p className="text-xs text-muted-foreground">Start from scratch</p>
                </div>
              </button>

              <button
                onClick={handleAddFromTemplate}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">From Template</p>
                  <p className="text-xs text-muted-foreground">Use existing template</p>
                </div>
              </button>

              <button
                onClick={handleAddWithAI}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                  <Wand2 className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Generate with AI</p>
                  <p className="text-xs text-muted-foreground">AI-powered generation</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
