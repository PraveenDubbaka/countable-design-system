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
  // Questions matching the screenshot - each in its own block/section
  const sections: Section[] = [
    {
      id: 'section-1',
      title: 'Quality Management & Risk Assessment',
      questions: [
        {
          id: 'q1',
          text: 'Determine whether accepting this engagement would contravene any of the firm\'s quality management policies.',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: ''
        },
        {
          id: 'q2',
          text: `<p><strong>New Clients</strong></p>
<ol type="a">
<li>Indicate who in the firm has knowledge about the prospective client and whether they recommend that this entity be accepted as a new client.</li>
<li>Contact the predecessor practitioner to inquire about any reasons the engagement should not be accepted. If no response is received, explain what alternative procedures were performed.</li>
</ol>
<p><strong>All Clients</strong></p>
<ol type="a" start="3">
<li>Make inquiries and perform web searches for any new or emerging engagement risks that would impact the decision to accept or continue with this engagement.</li>
<li>Consider any risk factors identified from other sources.</li>
<li>Based on preliminary understanding, is there any indication that the financial information will be misleading?</li>
<li>Does management understand the limited nature of the engagement?</li>
</ol>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-2',
      title: 'Financial Information & Basis of Accounting',
      questions: [
        {
          id: 'q3',
          text: `<p>Inquire to management about:</p>
<ol type="a">
<li>Intended use of the FI.</li>
<li>Whether the FI is intended to be used by a third party.</li>
</ol>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: ''
        },
        {
          id: 'q4',
          text: `<p>Discuss the expected basis of accounting with management and obtain management's acknowledgement that it is appropriate in the circumstances:</p>
<ol type="a">
<li>A written communication (e.g., paper or electronic).</li>
<li>An oral communication documented in the working paper file.</li>
</ol>
<p><em>Note: Use of a general purpose framework is considered rare (such as ASPE). In such cases, consideration should be given to whether an audit or review engagement would be more appropriate.</em></p>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-3',
      title: 'Third-Party Use & Quality Review',
      questions: [
        {
          id: 'q5',
          text: `<p>If the FI is intended to be used by a third party, inquire of management about:</p>
<ol type="a">
<li>The ability of the third party to request and obtain additional information.</li>
<li>Whether the third party agrees with the basis of accounting.</li>
</ol>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: ''
        },
        {
          id: 'q6',
          text: `<p>Are there any circumstances that would require this engagement to be subject to an engagement quality review?</p>
<p>If so, has a reviewer been appointed?</p>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: ''
        }
      ],
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
    title: prompt ? `Checklist: ${prompt.substring(0, 50)}...` : 'Engagement Acceptance Checklist',
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
        showBackButton={!!checklist}
        onBack={handleBack}
      >

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
            onSave={() => setShowSaveDialog(true)}
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
