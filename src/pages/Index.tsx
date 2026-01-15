import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { DropZone } from '@/components/DropZone';
import { ChecklistBuilder } from '@/components/ChecklistBuilder';
import { Checklist, GenerationScope, Section, Question } from '@/types/checklist';
import { RichTextToolbarProvider } from '@/contexts/RichTextToolbarContext';
import { SaveDialog } from '@/components/SaveDialog';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const generateMockChecklist = (prompt: string, scope: GenerationScope): Checklist => {
  // Seed content as per specification
  const independenceQuestions: Question[] = [
    {
      id: 'q1',
      text: 'Has the engagement team confirmed independence for this engagement?',
      answerType: 'yes-no',
      required: true,
      answer: ''
    },
    {
      id: 'q2',
      text: 'Describe identified threats and safeguards.',
      answerType: 'long-answer',
      required: true,
      // Seed the "We → I" demo text
      answer: 'We believe all necessary steps have been completed to comply with the independence requirements.'
    },
    {
      id: 'q3',
      text: 'Which independence threats apply?',
      answerType: 'multiple-choice',
      required: false,
      options: ['Self-interest', 'Self-review', 'Advocacy', 'Familiarity', 'Intimidation'],
      answer: ''
    }
  ];

  const documentationQuestions: Question[] = [
    {
      id: 'q4',
      text: 'Where is the independence documentation stored?',
      answerType: 'short-answer',
      required: true,
      answer: ''
    }
  ];

  // Add more questions based on scope
  if (scope === 'standard' || scope === 'detailed') {
    independenceQuestions.push({
      id: 'q5',
      text: 'Have all team members confirmed their independence in writing?',
      answerType: 'yes-no',
      required: true,
      answer: ''
    });
  }

  if (scope === 'detailed') {
    independenceQuestions.push({
      id: 'q6',
      text: 'Document any relationships that may impair independence.',
      answerType: 'long-answer',
      required: false,
      answer: '',
      subQuestions: [
        {
          id: 'sq1',
          text: 'What safeguards have been implemented?',
          answerType: 'long-answer',
          required: false
        },
        {
          id: 'sq2',
          text: 'Who reviewed the independence assessment?',
          answerType: 'short-answer',
          required: false
        }
      ]
    });

    documentationQuestions.push({
      id: 'q7',
      text: 'Has the engagement letter been signed by both parties?',
      answerType: 'yes-no',
      required: true,
      answer: ''
    });
  }

  const sections: Section[] = [
    {
      id: 'section-1',
      title: 'Independence',
      questions: independenceQuestions,
      isExpanded: true
    },
    {
      id: 'section-2',
      title: 'Documentation',
      questions: documentationQuestions,
      isExpanded: true
    }
  ];

  const defaultObjective = `Basis of accounting:
When assisting management in developing an appropriate basis of accounting, take into account the following:
  • The nature of the entity
  • The intended use of the compiled financial information (such as for third parties)
  • Whether there are any specific financial reporting requirements under applicable law, regulation, or contractional provisions with third parties
  • Through the terms of their lending agreements, financial institutions usually have the ability to request and obtain additional information about the compiled financial information. Such terms would be sufficient to meet the criteria to accept the engagement.`;

  return {
    id: 'checklist-1',
    title: prompt ? `Checklist: ${prompt.substring(0, 50)}...` : 'Independence Checklist (CSRS 4200)',
    description: prompt,
    objective: defaultObjective,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

type GenerateNavState = {
  generate?: {
    prompt: string;
    scope: GenerationScope;
    cardSize?: string;
  };
};

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();

  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (prompt: string, scope: GenerationScope, file?: File) => {
    setIsGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const generated = generateMockChecklist(prompt, scope);
    setChecklist(generated);
    setIsGenerating(false);
  };

  // If the user came from /generate, start generation automatically
  useEffect(() => {
    const navState = location.state as GenerateNavState | null;
    const gen = navState?.generate;

    if (!gen?.prompt) return;

    // Clear the navigation state so we don't regenerate on refresh/back
    navigate('/', { replace: true, state: null });

    void handleGenerate(gen.prompt, gen.scope ?? 'standard');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, navigate]);

  const handleChecklistUpdate = (updated: Checklist) => {
    setChecklist(updated);
  };

  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleBack = () => {
    if (checklist) {
      setShowSaveDialog(true);
    } else {
      // No checklist, just go back
      navigate(-1);
    }
  };

  const handleSaveAsDraft = () => {
    toast.success('Checklist saved as draft');
    setChecklist(null);
  };

  const handleSaveToFolder = (folderId: string, folderName: string) => {
    toast.success(`Checklist saved to "${folderName}"`);
    setChecklist(null);
  };

  const handleCreateFolder = (folderName: string) => {
    toast.success(`Folder "${folderName}" created`);
  };

  return (
    <RichTextToolbarProvider>
      <Layout 
        showActions={!!checklist}
      >
        {/* Back Button - only show when checklist is active */}
        {checklist && (
          <div className="px-6 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-[#1C63A6] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        )}

        {isGenerating ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center animate-pulse">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <svg className="w-8 h-8 text-primary-foreground animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-foreground">Generating your checklist...</p>
              <p className="text-sm text-muted-foreground mt-1">AI is analyzing your requirements</p>
            </div>
          </div>
        ) : checklist ? (
          <ChecklistBuilder 
            checklist={checklist} 
            onUpdate={handleChecklistUpdate}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 h-full">
            <DropZone onGenerate={handleGenerate} />
          </div>
        )}

        {/* Save Dialog */}
        <SaveDialog
          open={showSaveDialog}
          onOpenChange={setShowSaveDialog}
          onSaveAsDraft={handleSaveAsDraft}
          onSaveToFolder={handleSaveToFolder}
          onCreateFolder={handleCreateFolder}
        />
      </Layout>
    </RichTextToolbarProvider>
  );
}
